import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";

// API KEY MANAGEMENT
const LAOZHANG_KEY = import.meta.env.VITE_LAOZHANG_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY || 'MISSING_KEY' });

// --- TOOLS DEFINITION ---

// 1. Update Document (FULL REWRITE - DANGEROUS FOR LARGE DOCS)
const updateDocumentTool: FunctionDeclaration = {
  name: 'updateDocument',
  description: '⚠️ SOLO para documentos cortos. Sobreescribe TODO el documento. RIESGO: Truncamiento en docs largos.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: 'Contenido completo.' },
      changeLog: { type: Type.STRING, description: 'Resumen cambios.' },
    },
    required: ['content', 'changeLog'],
  },
};

// 2. Append Section (SAFE FOR LARGE DOCS)
const appendSectionTool: FunctionDeclaration = {
  name: 'appendSection',
  description: 'Añade una nueva sección al final del documento. SEGURO para documentos largos.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'Título de la nueva sección (Markdown H2/H3)' },
      content: { type: Type.STRING, description: 'Contenido de la sección' },
    },
    required: ['title', 'content']
  }
};

const tools: Tool[] = [{ functionDeclarations: [updateDocumentTool, appendSectionTool] }];

// --- SYSTEM PROMPT ---
const SYSTEM_INSTRUCTION = `
Eres Gemini 3 Pro (LUX MODE), Arquitecto de Software Senior y Guardián de Datos.

🚨 **DIRECTIVA DE SEGURIDAD DE DATOS (NIVEL CRÍTICO):**
1. **PROHIBIDO BORRAR:** El contador de palabras NUNCA debe bajar.
   - Si reescribes el documento y se corta por límite de tokens, PERDEREMOS DATOS.
   - **SOLUCIÓN:** Para documentos grandes (+2000 palabras), USA 'appendSection' en lugar de 'updateDocument'.
   - Si debes editar, hazlo incrementalmente.

2. **DOCUMENTACIÓN SUPABASE EXHAUSTIVA:**
   - El documento debe ser la **FUENTE DE VERDAD TOTAL**.
   - Incluye schemas SQL completos (CREATE TABLE...), Policies RLS, Triggers, Functions.
   - NO pongas "TBD" ni referencias externas. Escribe el CÓDIGO real.
   - Incluye configuración de Storage optimizada.

3. **VERSIONADO:**
   - Diseña e implementa (en el doc) un sistema de versionado DB (tabla document_versions).

🛠️ **HERRAMIENTAS:**
- \`updateDocument\`: SOLO para pequeñas ediciones o docs nuevos.
- \`appendSection\`: PREFERIDO. Añade contenido al final sin riesgo de borrar lo anterior.

**TU OBJETIVO:** Construir la Biblioteca Técnica Suprema de LuxScaler sin perder ni un byte de historia.
`;

export class GeminiService {
  private chatSession: any;
  private modelName = 'gemini-2.0-flash-exp'; // Support large context

  constructor() {
    this.startNewSession();
  }

  startNewSession() {
    if (!GEMINI_KEY) return;
    this.chatSession = ai.chats.create({
      model: this.modelName,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        temperature: 0.2, // Low temp for precision
      },
    });
  }

  // SORA INFOGRAPHIC IMPLEMENTATION
  async generateInfographic(prompt: string): Promise<string | null> {
    console.log("🎨 Generando Infografía con SORA (Laozhang)...", prompt);
    const targetKey = LAOZHANG_KEY || GEMINI_KEY;
    if (!targetKey) return null;

    try {
      const response = await fetch('https://api.laozhang.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${targetKey}`
        },
        body: JSON.stringify({
          model: "sora_image",
          messages: [{
            role: "user",
            content: `Generate a high-fidelity infographic about: ${prompt}. Infographic style, data visualization, 8k resolution.`
          }],
          stream: false
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      const match = content.match(/!\[.*?\]\((.*?)\)/);
      if (match && match[1]) return match[1];
      if (content.startsWith('http') || content.startsWith('data:')) return content;
      return null;
    } catch (e) {
      console.error("Infographic Gen Failed:", e);
      return null;
    }
  }

  async sendMessage(message: string, currentDocContext: string, onToolCall: (action: string, data: any) => void): Promise<{ text: string; stats: any }> {
    if (!this.chatSession) this.startNewSession();
    if (!this.chatSession) return { text: "Error: No API Key.", stats: {} };

    const startTime = Date.now();
    // Pass word count info to AI
    const wordCount = currentDocContext.match(/\S+/g)?.length || 0;
    const prompt = `[DOC CONTEXT]\nLongitud Actual: ${wordCount} palabras.\n\n${currentDocContext}\n[END CONTEXT]\n\nUSER: ${message}`;

    try {
      const response = await this.chatSession.sendMessage({ content: [{ parts: [{ text: prompt }] }] });
      let responseText = "";

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const firstCandidate = candidates[0];
        const parts = firstCandidate.content?.parts || [];
        const functionCalls = parts.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);

        if (functionCalls.length > 0) {
          const functionResponseParts = [];
          for (const call of functionCalls) {

            if (call.name === 'updateDocument') {
              const { content, changeLog } = call.args;
              onToolCall('UPDATE', { content, changeLog }); // Standardize action
              functionResponseParts.push({ functionResponse: { name: 'updateDocument', response: { result: { result: "OK" } } } });
            }

            else if (call.name === 'appendSection') {
              const { title, content } = call.args;
              onToolCall('APPEND', { title, content });
              functionResponseParts.push({ functionResponse: { name: 'appendSection', response: { result: { result: "APPENDED" } } } });
            }

          }
          const finalResponse = await this.chatSession.sendMessage({ content: [{ parts: functionResponseParts }] });
          responseText = finalResponse.text || "Operación realizada.";
        } else {
          responseText = response.text || "";
        }
      }
      return { text: responseText, stats: { latency: `${Date.now() - startTime}ms`, model: this.modelName } };
    } catch (err: any) {
      if (err.message.includes("SAFETY")) return { text: "Error de Seguridad: La IA rechazó el prompt.", stats: {} };
      return { text: `Error Crítico: ${err.message}`, stats: { latency: '0ms', model: 'OFFLINE' } };
    }
  }
}
export const geminiService = new GeminiService();