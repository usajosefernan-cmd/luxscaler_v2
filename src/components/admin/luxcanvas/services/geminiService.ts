import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";

// API KEY MANAGEMENT
const LAOZHANG_KEY = import.meta.env.VITE_LAOZHANG_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 1. Initialize Client (Standard Gemini for Chat)
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY || 'MISSING_KEY' });

// 2. Define the Tool
const updateDocumentTool: FunctionDeclaration = {
  name: 'updateDocument',
  description: 'Sobreescribe completamente el documento técnico actual con nuevo contenido.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: 'Contenido markdown completo.' },
      changeLog: { type: Type.STRING, description: 'Resumen de cambios.' },
    },
    required: ['content', 'changeLog'],
  },
};

const tools: Tool[] = [{ functionDeclarations: [updateDocumentTool] }];

const SYSTEM_INSTRUCTION = `
Eres Gemini 3 Pro, Arquitecto de Software Senior y Líder Técnico.
Objetivo: Implementar especificaciones técnicas en vivo.
REGLAS:
🔴 NO RESUMIR. 🟢 SIEMPRE ENRIQUECER.
1. Implementación Proactiva: Usa updateDocument.
2. Debate y Desafío.
3. Plan de Migración Supabase OBLIGATORIO al final.
4. Diagramas flow/mindmap.
`;

export class GeminiService {
  private chatSession: any;
  private modelName = 'gemini-2.0-flash-exp';

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
        temperature: 0.3,
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

      // Extract Image
      const match = content.match(/!\[.*?\]\((.*?)\)/);
      if (match && match[1]) return match[1];
      if (content.startsWith('http') || content.startsWith('data:')) return content;
      return null;

    } catch (e) {
      console.error("Infographic Gen Failed:", e);
      return null;
    }
  }

  async sendMessage(message: string, currentDocContext: string, onToolCall: (c: string, l: string) => void): Promise<{ text: string; stats: any }> {
    if (!this.chatSession) this.startNewSession();
    if (!this.chatSession) return { text: "Error: No API Key.", stats: {} };

    const startTime = Date.now();
    const prompt = `[DOC START]\n${currentDocContext}\n[DOC END]\nUSER: ${message}`;

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
              onToolCall(content, changeLog);
              functionResponseParts.push({ functionResponse: { name: 'updateDocument', response: { result: { result: "OK" } } } });
            }
          }
          const finalResponse = await this.chatSession.sendMessage({ content: [{ parts: functionResponseParts }] });
          responseText = finalResponse.text || "Updated.";
        } else {
          responseText = response.text || "";
        }
      }
      return { text: responseText, stats: { latency: `${Date.now() - startTime}ms`, model: this.modelName } };
    } catch (err: any) {
      return { text: `Error: ${err.message}`, stats: { latency: '0ms', model: 'OFFLINE' } };
    }
  }
}
export const geminiService = new GeminiService();