import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";

// 1. Initialize Client
// NOTE: In a real production app, you might handle the API key more securely.
// Here we assume it is injected via environment variable as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 2. Define the Tool
const updateDocumentTool: FunctionDeclaration = {
  name: 'updateDocument',
  description: 'Sobreescribe completamente el documento técnico actual con nuevo contenido. Úsalo cuando tú y el usuario acordéis cambios, mejoras o implementaciones. No pidas al usuario que copie y pegue; hazlo tú.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      content: {
        type: Type.STRING,
        description: 'El contenido markdown completo y actualizado del documento.',
      },
      changeLog: {
        type: Type.STRING,
        description: 'Un resumen muy breve de lo que cambió (ej: "Añadida capa de caché Redis").',
      },
    },
    required: ['content', 'changeLog'],
  },
};

const tools: Tool[] = [{ functionDeclarations: [updateDocumentTool] }];

// 3. System Instruction
// Traducido al español con las reglas de Supabase y REGLAS CRÍTICAS DE CONTENIDO.
const SYSTEM_INSTRUCTION = `
Eres Gemini 3 Pro, actuando como un Arquitecto de Software Senior y Líder Técnico de élite.
Tu objetivo es debatir, refinar e implementar especificaciones técnicas en un documento en vivo.

REGLAS CRÍTICAS DE CONTENIDO:
🔴 **PROHIBIDO RESUMIR**: Nunca acortes, elimines o condenses contenido existente.
🟢 **SIEMPRE ENRIQUECER**: Tu tarea es expandir. Añade ejemplos, detalles técnicos, diagramas (usando sintaxis \`flow\` o \`mindmap\`), y tablas comparativas. El documento debe crecer en valor y profundidad, nunca reducirse.

REGLAS DE COMPORTAMIENTO:
1. **Implementación Proactiva**: No te limites a sugerir cambios. Si el usuario está de acuerdo o pide un arreglo, usa la herramienta \`updateDocument\` para aplicarlo inmediatamente.
2. **Debate y Desafío**: Si el usuario propone algo técnicamente deficiente (ej: polling en lugar de sockets), desafíalo con patrones arquitectónicos (ej: "El problema C10k").
3. **Mandato Supabase/SQL**: Al final de CADA respuesta (independientemente de si hubo cambios), DEBES incluir una sección titulada "### 🛠 Plan de Migración Supabase".
   - Si cambiaron estructuras de datos: Proporciona el diff SQL completo, sentencias CREATE TABLE y políticas RLS (Row Level Security) precisas.
   - Si NO hubo cambios: Indica explícitamente el contexto actual del esquema y consideraciones futuras. "Contexto Actual del Esquema: [Detalles] - No se requieren cambios en esta iteración."

4. **Fase de Propuesta**: Cuando el usuario pida mejoras o cambios, PRIMERO lista todas las propuestas numeradas organizadas por sección del documento. NO uses updateDocument todavía. Termina preguntando: "¿Implemento estos cambios? Responde IMPLEMENTA TODO, IMPLEMENTA [números], o DESCARTAR."

5. **Actualizaciones en Cascada**: Al usar updateDocument, analiza TODO el documento y actualiza en cascada:
   - Índice/tabla de contenidos
   - Referencias internas entre secciones
   - Terminología consistente en todo el doc
   - Cualquier sección que dependa de lo modificado

6. **Resaltado de Cambios**: Después de cada updateDocument, lista brevemente qué secciones fueron modificadas con etiquetas: [NUEVO], [MODIFICADO], o [CASCADA].

7. **Herramientas Visuales**:
   - Usa Tablas Markdown para comparaciones.
   - Usa bloques de código \`flow\` para diagramas de flujo de procesos.
   - Usa bloques de código \`mindmap\` para estructuras jerárquicas.

CONTEXTO:
Tienes acceso a un editor de documentos en vivo. El usuario ve lo que escribes en la herramienta \`updateDocument\`.
`;

export class GeminiService {
  private chatSession: any;
  private modelName = 'gemini-3-pro-preview';
  private imageModelName = 'gemini-2.5-flash-image';

  constructor() {
    this.startNewSession();
  }

  startNewSession() {
    this.chatSession = ai.chats.create({
      model: this.modelName,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        temperature: 0.3, // Keep it technical and precise
        thinkingConfig: { thinkingBudget: 2048 } // Allow some thinking for complex architectural decisions
      },
    });
  }

  async generateInfographic(prompt: string): Promise<string | null> {
    try {
      // Use Nano Banana (Gemini 2.5 Flash Image) for generation
      const response = await ai.models.generateContent({
        model: this.imageModelName,
        contents: {
          parts: [{ text: `Generate a minimalist, high-tech, architectural infographic schematic for: ${prompt}. White background, blue/cyan accents, technical lines.` }]
        },
        config: {
          // Nano Banana does not support responseMimeType or responseSchema
          // It returns inlineData or text
        }
      });

      // Extract image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64String}`;
        }
      }
      return null;
    } catch (e) {
      console.error("Error generating infographic:", e);
      return null;
    }
  }

  async sendMessage(
    message: string, 
    currentDocContext: string,
    onToolCall: (newContent: string, log: string) => void
  ): Promise<{ text: string; stats: any }> {
    
    const startTime = Date.now();

    // We pass the current document context with every message so the AI knows what it is editing.
    // This is a "Stateless" approach regarding the doc, but "Stateful" regarding the chat history.
    const prompt = `
[ESTADO ACTUAL DEL DOCUMENTO INICIO]
${currentDocContext}
[ESTADO ACTUAL DEL DOCUMENTO FIN]

PETICIÓN DEL USUARIO:
${message}
`;

    try {
      const response = await this.chatSession.sendMessage({
        message: prompt
      });

      let responseText = "";
      let stats = {
        latency: `${Date.now() - startTime}ms`,
        tokens: 0, // Placeholder as raw token count isn't always easily exposed in simple response
        model: this.modelName
      };

      // Handle Tool Calls (Function Calling)
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const firstCandidate = candidates[0];
        const functionCalls = firstCandidate.content.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);

        if (functionCalls && functionCalls.length > 0) {
          const functionResponseParts = [];

          for (const call of functionCalls) {
            if (call.name === 'updateDocument') {
              const { content, changeLog } = call.args;
              onToolCall(content, changeLog);
              
              const responsePart: any = {
                 functionResponse: {
                    name: 'updateDocument',
                    response: { result: "Documento actualizado correctamente." } 
                 }
              };
              if (call.id) {
                responsePart.functionResponse.id = call.id;
              }
              functionResponseParts.push(responsePart);
            }
          }

          if (functionResponseParts.length > 0) {
              const finalResponse = await this.chatSession.sendMessage({
                  message: functionResponseParts
              });
              responseText = finalResponse.text;
          } else {
              responseText = response.text || "Acción ejecutada.";
          }
        } else {
          responseText = response.text;
        }
      }

      return { text: responseText, stats };

    } catch (error) {
      console.error("Gemini API Error:", error);
      return { 
        text: `**ERROR DEL SISTEMA**: Conexión al Núcleo Neuronal fallida. Detalles: ${error instanceof Error ? error.message : 'Error desconocido'}`, 
        stats: { latency: '0ms', model: 'OFFLINE' } 
      };
    }
  }
}

export const geminiService = new GeminiService();