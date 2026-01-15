import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Types for Raw API
interface ChatMessage {
    role: string;
    parts: { text: string }[];
}

Deno.serve(async (req: Request) => {
    // 1. CORS Preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { message, docContext, history } = await req.json();

        // 2. Secret Management
        const apiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("LAOZHANG_API_KEY"); // Fallback
        if (!apiKey) throw new Error("Missing GEMINI_API_KEY in Secrets");

        // 3. Construct Payload manually (REST API v1beta)
        const chatHistory: ChatMessage[] = (history || []).map((msg: any) => ({
            role: msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        // System Instruction & Context
        const wordCount = docContext?.match(/\S+/g)?.length || 0;
        const systemInstruction = {
            role: "user",
            parts: [{
                text: `SYSTEM: Eres Gemini 3 Pro (LUX MODE). 
DIRECTIVA: NO BORRAR CONTENIDO. Usa 'appendSection' para textos largos.
Si usas 'updateDocument', asegúrate de devolver EL TEXTO COMPLETO.

[DOC CONTEXT - ${wordCount} words]
${docContext}
[END CONTEXT]`
            }]
        };

        // Current User Message
        const userMessage = {
            role: "user",
            parts: [{ text: message }]
        };

        // Combine for "Chat" emulation (Gemini REST stateless/context window)
        // Note: For 'generateContent', we pass contents array.
        // We inject system prompt as the first message or use system_instruction if model supports it (v1beta does).
        // For simplicity and compatibility with all models, we prepend to contents.
        const contents = [systemInstruction, ...chatHistory, userMessage];

        // Tools Definition (Raw JSON Schema)
        const tools = [
            {
                function_declarations: [
                    {
                        name: "updateDocument",
                        description: "Full overwrite of document. Only for small edits.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                content: { type: "STRING", description: "Full new content" },
                                changeLog: { type: "STRING", description: "Summary of changes" }
                            },
                            required: ["content", "changeLog"]
                        }
                    },
                    {
                        name: "appendSection",
                        description: "Append new section at end. Safe for large docs.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                title: { type: "STRING", description: "Section Title" },
                                content: { type: "STRING", description: "Section Content" }
                            },
                            required: ["title", "content"]
                        }
                    }
                ]
            }
        ];

        console.log("[LuxChat] Sending Request to Gemini REST API...");

        // 4. Trace Call
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: contents,
                    tools: tools
                })
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts || [];

        // 5. Parse Response for Tools vs Text
        let text = "";
        const functionCalls: any[] = [];

        for (const part of parts) {
            if (part.text) text += part.text;
            if (part.functionCall) {
                functionCalls.push({
                    name: part.functionCall.name,
                    args: part.functionCall.args
                });
            }
        }

        return new Response(
            JSON.stringify({ text, functionCalls }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error: any) {
        console.error("[LuxChat] Fatal Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
    }
});
