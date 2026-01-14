import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";

// SQL with escaped quotes (no $$ delimiters) for TypeScript compatibility
const COMPLETE_SEED_SQL = `
-- TABLA DE VERSIONADO LUXCANVAS
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_title TEXT NOT NULL,
    content TEXT NOT NULL,
    change_summary TEXT,
    
    word_count INT GENERATED ALWAYS AS (array_length(regexp_split_to_array(content, '\\s+'), 1)) STORED,
    file_size_bytes INT GENERATED ALWAYS AS (octet_length(content)) STORED,
    version_number SERIAL, 

    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    
    CONSTRAINT word_count_check CHECK (word_count > 0)
);

CREATE INDEX IF NOT EXISTS idx_document_versions_title_created ON public.document_versions(document_title, created_at DESC);

ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all versions') THEN
        CREATE POLICY "Admins can view all versions" ON public.document_versions FOR SELECT TO authenticated USING ( true );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert versions') THEN
        CREATE POLICY "Admins can insert versions" ON public.document_versions FOR INSERT TO authenticated WITH CHECK ( true );
    END IF;
END $$;

COMMENT ON TABLE public.document_versions IS 'Historial inmutable de versiones de documentos técnicos generados por LuxCanvas.';
`;

serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const databaseUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!databaseUrl) {
      throw new Error("SUPABASE_DB_URL not configured");
    }

    const sql = postgres(databaseUrl, { max: 1 });

    console.log("[MIGRATION-RUNNER] Executing VERSIONING MIGRATION...");

    await sql.unsafe(COMPLETE_SEED_SQL);

    console.log("[MIGRATION-RUNNER] SUCCESS - Table document_versions created/verified");

    await sql.end();

    return new Response(
      JSON.stringify({ success: true, message: "MIGRATION SUCCESS: document_versions table ready" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[MIGRATION-RUNNER] ERROR:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
