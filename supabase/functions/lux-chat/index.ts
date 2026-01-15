import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_INSTRUCTION_TEMPLATE = `
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

const tools = [
    {
        functionDeclarations: [
            {
                name: 'updateDocument',
                description: '⚠️ SOLO para documentos cortos. Sobreescribe TODO el documento.',
                parameters: {
                    type: "OBJECT",
                    properties: {
                        content: { type: "STRING", description: 'Contenido completo.' },
                        changeLog: { type: "STRING", description: 'Resumen cambios.' },
                    },
                    required: ['content', 'changeLog'],
                },
            },
            {
                name: 'appendSection',
                description: 'Añade una nueva sección al final del documento. SEGURO para documentos largos.',
                parameters: {
                    type: "OBJECT",
                    properties: {
                        title: { type: "STRING", description: 'Título de la nueva sección (Markdown H2/H3)' },
                        content: { type: "STRING", description: 'Contenido de la sección' },
                    },
                    required: ['title', 'content']
                }
            }
        ]
    }
];

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { message, docContext, history } = await req.json();

        // Use GEMINI_API_KEY from Secrets (BBLA Standard)
        const apiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("LAOZHANG_API_KEY");
        if (!apiKey) throw new Error("Missing GEMINI_API_KEY in Secrets");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro", // Or gemini-2.0-flash-exp if available in this SDK version
            tools: tools
        });

        // Prepare Chat History
        // History format from Frontend: { role: 'user' | 'ai', text: string }
        // Gemini SDK format: { role: 'user' | 'model', parts: [{ text: string }] }
        const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        // Inject System Instruction + Doc Context
        const wordCount = docContext?.match(/\S+/g)?.length || 0;
        const systemPrompt = `${SYSTEM_INSTRUCTION_TEMPLATE}\n\n[DOC CONTEXT]\nLongitud Actual: ${wordCount} palabras.\n\n${docContext}\n[END CONTEXT]`;

        // We instantiate the chat with system prompt as the first history part (hack for some SDK versions) 
        // OR rely on systemInstruction if supported.
        // GoogleGenerativeAI SDK v0.1.3+ supports systemInstruction in model config.
        const chat = model.startChat({
            history: chatHistory,
            systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        // Parse Tool Calls
        const functionCalls = response.functionCalls();
        const text = response.text();

        return new Response(
            JSON.stringify({
                text: text,
                functionCalls: functionCalls
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("LuxChat Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
    }
});
