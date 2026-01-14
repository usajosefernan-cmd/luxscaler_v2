import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";

// SQL with escaped quotes (no $$ delimiters) for TypeScript compatibility
const COMPLETE_SEED_SQL = `
-- STEP 0: CLEAN SLATE
TRUNCATE TABLE photoscaler_prompt_rules CASCADE;
TRUNCATE TABLE lightscaler_prompt_rules CASCADE;
TRUNCATE TABLE stylescaler_prompt_rules CASCADE;
TRUNCATE TABLE global_prompt_config CASCADE;
TRUNCATE TABLE semantic_material_rules CASCADE;
TRUNCATE TABLE vision_trigger_overrides CASCADE;

-- TABLE 1: photoscaler_prompt_rules (3 RECORDS)

INSERT INTO photoscaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max, intensity_label,
  protocol_header, mission_statement, quality_assessment_logic,
  virtual_camera_specs, geometric_projection_logic, lens_physics_correction,
  signal_processing_pipeline, detail_synthesis_logic, damage_restoration_protocol
) VALUES (
  'acutancia', 1, 3, 'PASSIVE_POLISH',
  '[SYSTEM MODE: NON-DESTRUCTIVE ENHANCEMENT]',
  'Enhance and polish existing details. Prioritize source fidelity.',
  'IF INPUT IS SHARP & CLEAN: Maintain original pixel structure. Do not hallucinate unnecessary details.',
  NULL,
  'Ensure structural stability. Do not warp.',
  'Correct only obvious chromatic aberration.',
  'Denoise gently. Maintain natural grain structure.',
  'Sharpen existing edges using Unsharp Mask logic.',
  NULL
);

INSERT INTO photoscaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max, intensity_label,
  protocol_header, mission_statement, quality_assessment_logic,
  virtual_camera_specs, geometric_projection_logic, lens_physics_correction,
  signal_processing_pipeline, detail_synthesis_logic, damage_restoration_protocol
) VALUES (
  'acutancia', 4, 7, 'HYBRID_ENHANCEMENT',
  '[SYSTEM MODE: INTELLIGENT RESTORATION v4.0]',
  'The AI acts as a restoration artist. Fix flaws but keep the essence.',
  'IF INPUT HAS ARTIFACTS: Apply intelligent de-noising without waxy skin effect.',
  'Simulate a modern sensor capture. Stabilize micro-jitters.',
  'Correct perspective skew if horizon > 2 degrees tilted.',
  'Correct barrel/pincushion distortion inside the frame to flatter the subject.',
  '32-BIT FLOAT PROCESSING. Neutralize color casts while preserving atmospheric tone.',
  'Inject missing high-frequency texture in blurred areas (fabric, hair).',
  'Infill minor scratches and dust spots using context awareness.'
);

INSERT INTO photoscaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max, intensity_label,
  protocol_header, mission_statement, quality_assessment_logic,
  virtual_camera_specs, geometric_projection_logic, lens_physics_correction,
  signal_processing_pipeline, detail_synthesis_logic, damage_restoration_protocol
) VALUES (
  'acutancia', 8, 10, 'FORENSIC_RESHOOT_v15',
  '[SYSTEM OVERRIDE: UNIVERSAL FORENSIC RE-SHOOT & OPTICAL SYNTHESIS PROTOCOL v15.0 - STRUCTURAL ALIGNMENT, DAMAGE RECONSTRUCTION & SOLID SIGNAL MASTER].',
  'A definitive, photorealistic reconstruction. The AI must act as a Reality Reconstruction Engine, NOT just an editor.',
  'CRITICAL FOCUS & TREPIDATION OVERRIDE: If the input exhibits ANY camera shake or lack of definition, STOP being faithful to the pixels. The input is now considered a corrupted compositional sketch only. IGNORE SOURCE ARTIFACTS: Do not sharpen the blur, noise, fog. DISCARD the bad data.',
  'VIRTUAL RE-SHOOT: Simulate a brand new capture of the same scene using a 1/8000s shutter speed (zero motion blur), a high-end rectilinear lens (zero distortion), and a calibrated sensor.',
  'GEOMETRIC & OPTICAL FAILURE ALERT: ACTIVATE RECTILINEAR CORRECTION MODE. FORCE HORIZON & VERTICAL ALIGNMENT: ROTATE and RE-ALIGN so gravity is vertical. STRICT ASPECT RATIO: The structural composition MUST ALIGN PERFECTLY with the source.',
  'LENS SUBSTITUTION (WIDE-ANGLE FIX): If the scene suffers from wide-angle distortion (curved corners, big nose selfie), RE-RENDER THE SCENE as if shot with a 50mm or 85mm Prime Lens (Rectilinear Projection). Straighten architectural lines.',
  '32-BIT FLOAT PROCESSING: Treat input as floating-point RAW. AGGRESSIVE NORMALIZATION: STRETCH THE SIGNAL. The darkest pixel MUST touch True Black (0) and brightest True White (255). Prevent banding in gradients.',
  'COMPLETE RE-SYNTHESIS (GENERATIVE RE-INVENTION): You must HALLUCINATE and GENERATE brand new, razor-sharp high-frequency details (individual eyelashes, iris trabeculae, distinct teeth, skin pores, fabric weave) from scratch. Inject organic roughness to kill plastic look.',
  'SEVERE DAMAGE RECONSTRUCTION (THE TIME MACHINE FIX): If source contains total signal loss (white blobs, chemical burns, torn paper), YOU MUST REIMAGINE THE MISSING CONTENT. Do not preserve the damage; PAINT NEW REALITY into the void.'
);

-- TABLE 2: lightscaler_prompt_rules (6 RECORDS)

INSERT INTO lightscaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max,
  protocol_header, zone_system_logic, dynamic_range_strategy, white_balance_logic
) VALUES (
  'sombras', 1, 3,
  '[MODE: NATURAL LIGHT FIDELITY]',
  'Preserve original contrast curve. Do not lift shadows artificially.',
  'Maintain scene linearity. No HDR tone mapping.',
  'Correct only severe color casts (green/magenta tint). Keep temperature neutral.'
);

INSERT INTO lightscaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max,
  protocol_header, zone_system_logic, dynamic_range_strategy,
  color_science_grading, light_source_physics, volumetric_atmosphere, white_balance_logic
) VALUES (
  'sombras', 8, 10,
  '[SUB-PROTOCOL: LOW-LIGHT RECOVERY & ATMOSPHERIC TONE MAPPING]. DIAGNOSIS: If input is Underexposed/Dark: DO NOT wash out the image.',
  'ZONE SYSTEM RECOVERY: STRICTLY Anchor the Black Point at absolute zero (0,0,0). Aggressively lift Zones 1-3 (Deep Shadows) to reveal latent textures (fabric weave, brick details) currently hidden. Maintain rich, deep blacks where physically appropriate.',
  'CONCEPTUAL TONE MAPPING (HDR 2.0): Apply Local Tone Mapping to compress dynamic range intelligently. Ensure visibility in dark areas without destroying global contrast. Avoid halo effect. Goal is Cinematic Visibility.',
  'BLUE HOUR AESTHETIC INJECTION: Global Ambience: Simulate Civil Twilight lighting physics. Ambient fill light must be cool/blue (6500K-8000K). Contrast Lighting: Force artificial sources to Warm Tungsten (3200K). Create Complementary Color Contrast (Teal/Orange).',
  'Simulate Rayleigh scattering from upper atmosphere. Treat input as 32-bit floating-point RAW to prevent banding during exposure lift.',
  'VOLUMETRICS: Inject subtle Blue Hour Mist in the background to separate planes and add depth.',
  'CONTEXTUAL WHITE BALANCE: NEUTRALIZE technical color casts (sickly green fluorescent, muddy yellow) but PRESERVE ATMOSPHERIC TONE. Do not force sterile 5500K white if it destroys the mood.'
);

INSERT INTO lightscaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max,
  protocol_header, light_source_physics, face_fidelity_weight, codeformer_strength
) VALUES (
  'identity', 9, 10,
  '[IDENTITY OVERRIDE: STRICT BONE STRUCTURE LOCK]',
  'IDENTITY PRESERVATION: The people must look like themselves, but in Ultra High Definition. Reconstruct anatomically perfect eyes (distinct iris/pupil). Prevent Melted Faces. SKIN PHYSICS: Apply Subsurface Scattering to face mesh.',
  1.0,
  0.9
);

INSERT INTO lightscaler_prompt_rules (
  slider_name, style_slug, protocol_header,
  light_source_physics, color_science_grading, zone_system_logic
) VALUES (
  'lighting_style', 'rembrandt_v32',
  '[LIGHTING SETUP: CLASSIC CHIAROSCURO]',
  'KEY LIGHT: Single soft source at 45-degree angle (Rembrandt Patch). FILL LIGHT: Minimal (-3 EV). BACKLIGHT: None.',
  'COLOR PALETTE: Warm, oil-painting tones. Golden hour falloff.',
  'CONTRAST RATIO: High (8:1). Allow shadows to fall into deep darkness (Zone 1).'
);

INSERT INTO lightscaler_prompt_rules (
  slider_name, style_slug, protocol_header,
  light_source_physics, color_science_grading, volumetric_atmosphere
) VALUES (
  'lighting_style', 'neon_noir_v32',
  '[LIGHTING SETUP: CYBERPUNK ATMOSPHERE]',
  'KEY LIGHT: Harsh, colored gels (Cyan/Magenta). PRACTICAL LIGHTS: Neon signs and street lamps reflecting on wet surfaces.',
  'COLOR PALETTE: Dual-tone split lighting. Deep Blues vs Hot Pinks.',
  'VOLUMETRICS: Heavy steam, rain haze, diffusion filters (ProMist 1/4).'
);

INSERT INTO lightscaler_prompt_rules (
  slider_name, style_slug, protocol_header,
  light_source_physics, white_balance_logic, dynamic_range_strategy
) VALUES (
  'lighting_style', 'commercial_beauty_v32',
  '[LIGHTING SETUP: HIGH-END BEAUTY]',
  'KEY LIGHT: Large Octabox (butterfly lighting) directly above camera. FILL: White bounce cards from below (Clamshell setup).',
  'WHITE BALANCE: Perfectly neutral (5600K). Clean, sterile whites.',
  'DYNAMIC RANGE: Low contrast, high key. Lift shadows to Zone 6. No deep blacks.'
);

-- TABLE 3: stylescaler_prompt_rules (3 RECORDS)

INSERT INTO stylescaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max,
  art_direction_header, texture_quality_prompt, anamorphic_optics_prompt,
  hallucination_density, guidance_scale
) VALUES (
  'detalle', 1, 3,
  '[STYLE: DOCUMENTARY REALISM]',
  'Maintain original texture frequency. Do not add artificial grain or sharpness.',
  'Standard spherical lens characteristics. No stylized flares or bokeh.',
  0.1,
  5.0
);

INSERT INTO stylescaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max,
  art_direction_header, texture_quality_prompt, styling_prompt, environment_prompt,
  hallucination_density, guidance_scale
) VALUES (
  'detalle', 4, 7,
  '[STYLE: HIGH-END COMMERCIAL EDITORIAL]',
  'Enhance micro-contrast in key areas (eyes, jewelry). Clean skin texture without blurring.',
  'Professional grooming. Tidy hair, hydrated lips.',
  'Clean up background distractions. Unify environmental lighting.',
  0.4,
  7.5
);

INSERT INTO stylescaler_prompt_rules (
  slider_name, slider_value_min, slider_value_max,
  art_direction_header, texture_quality_prompt, anamorphic_optics_prompt,
  environment_prompt, styling_prompt, hallucination_density, guidance_scale
) VALUES (
  'detalle', 8, 10,
  '[STYLE OVERRIDE: CINEMATIC DRAMA CLUB & REALITY WARP]. The goal is NOT stock photography. We seek high contrast, emotion, and a surreal dream-like clarity.',
  'INJECT MASSIVE HIGH-FREQUENCY DETAIL: You must HALLUCINATE organic roughness (skin pores, vellus hair, fabric threads, brick imperfections) to kill the plastic/mobile look. Every surface must have tactile weight.',
  'ANAMORPHIC OPTICS (HOLLYWOOD LOOK): Simulate Panavision C-Series Anamorphic Lens characteristics. Create subtle oval bokeh in out-of-focus areas. Allow controlled horizontal flares (blue/gold) if light hits the lens directly. Instant cinematic feel.',
  'SCENOGRAPHY ENHANCEMENT: If background is dull, inject Cinematic Atmosphere. Add depth cues, subtle haze, and rich textures to walls/floors. Avoid sterile white walls.',
  'STYLING PRIORITY: Subjects must look Dead Sharp and professionally styled. Reconstruct makeup texture, fabric folds, and accessories with macro-level definition.',
  0.8,
  12.0
);

-- TABLE 4: semantic_material_rules (5 RECORDS)

INSERT INTO semantic_material_rules (
  material_tag, detected_attribute,
  physics_logic_prompt, surface_texture_prompt, reflection_model_prompt, negative_material_prompt
) VALUES (
  'SKIN', 'DEFAULT',
  'SUBSURFACE SCATTERING (SSS) ENABLED: Simulate light penetrating the epidermis to create a fleshy, organic warm glow. Skin must behave like translucent tissue, NOT opaque plastic.',
  'ORGANIC MICRO-DETAIL: Hallucinate visible skin pores, fine wrinkles, and VELLUS HAIR (peach fuzz) on cheeks/jawline. Skin texture must have irregular, organic roughness.',
  'SPECULARITY: Natural skin oils reflection. Dual-layer specular lobe (oily T-zone vs matte cheek).',
  'plastic skin, wax skin, airbrushed skin, blurred pores, smooth porcelain doll effect, overly polished, makeup caking.'
);

INSERT INTO semantic_material_rules (
  material_tag, detected_attribute,
  physics_logic_prompt, surface_texture_prompt, reflection_model_prompt, negative_material_prompt
) VALUES (
  'IRIS', 'DEFAULT',
  'CORNEAL REFRACTION: Simulate the clear dome of the cornea with distinct specular highlights (catchlights).',
  'IRIS TRABECULAE: Generate high-definition fibrous patterns inside the iris. Distinct separation between pupil and iris. No smudging.',
  'WET SURFACE PHYSICS: The eye must look wet/hydrated. Sharp, hard reflections of light sources.',
  'dead eyes, dull eyes, blurry iris, merged pupil, illustration style eyes, anime eyes.'
);

INSERT INTO semantic_material_rules (
  material_tag, detected_attribute,
  physics_logic_prompt, surface_texture_prompt, reflection_model_prompt, negative_material_prompt
) VALUES (
  'FABRIC', 'SILK',
  'ANISOTROPIC SHEEN: Fabric interacts with light directionally. Soft, flowing highlights.',
  'MICRO-WEAVE: Ultra-fine thread count. Smooth but with visible woven structure at macro zoom.',
  'Velvet/Satin Shader logic.',
  'rough fabric, denim texture, wool texture, noisy pattern.'
);

INSERT INTO semantic_material_rules (
  material_tag, detected_attribute,
  physics_logic_prompt, surface_texture_prompt, reflection_model_prompt, negative_material_prompt
) VALUES (
  'FABRIC', 'WOOL',
  'LIGHT ABSORPTION: Matte surface with high roughness. No specular highlights.',
  'FIBER FRAYING: Visible loose threads and fuzz at edges. Coarse weave pattern reconstruction.',
  'Lambertian Diffuse Model.',
  'shiny plastic clothes, wet look fabric, smooth texture.'
);

INSERT INTO semantic_material_rules (
  material_tag, detected_attribute,
  physics_logic_prompt, surface_texture_prompt, reflection_model_prompt, negative_material_prompt
) VALUES (
  'METAL', 'POLISHED',
  'CONDUCTIVE MATERIAL: Colored reflections (for Gold/Copper) or uncolored (Chrome). High reflectivity.',
  'MICRO-SCRATCHES: Imperceptible surface scratches to break digital perfection. Realistic patina.',
  'GGX METALLIC: Sharp reflections. Fresnel edge brightening.',
  'diffuse grey, plastic looking metal, matte finish.'
);

-- TABLE 5: vision_trigger_overrides (5 RECORDS)

INSERT INTO vision_trigger_overrides (
  json_category, json_key, json_value_match,
  target_table, action_type, forced_slider_value, override_priority, description
) VALUES (
  'technical_audit', 'signal', 'Underexposed_Clipped_Shadows',
  'lightscaler_prompt_rules', 'SET_SLIDER_MIN', 9, 20,
  'CRITICAL: Input is dark. Force Lightscaler to Level 9 (Zone System Recovery) to prevent black crush.'
);

INSERT INTO vision_trigger_overrides (
  json_category, json_key, json_value_match,
  target_table, action_type, forced_slider_value, override_priority, description
) VALUES (
  'restoration_priority', 'damage_detected', 'Motion_Blur',
  'photoscaler_prompt_rules', 'SET_SLIDER_MIN', 10, 20,
  'CRITICAL: Trepidation detected. Force Photoscaler to Level 10 (Virtual Re-shoot) to kill blur.'
);

INSERT INTO vision_trigger_overrides (
  json_category, json_key, json_value_match,
  target_table, action_type, forced_slider_value, override_priority, description
) VALUES (
  'technical_audit', 'distortion', 'Minor_Barrel',
  'photoscaler_prompt_rules', 'SET_SLIDER_MIN', 8, 15,
  'GEOMETRY: Barrel distortion detected. Force Rectilinear Correction logic.'
);

INSERT INTO vision_trigger_overrides (
  json_category, json_key, json_value_match,
  target_table, action_type, forced_slider_value, override_priority, description
) VALUES (
  'classification', 'primary', 'HUMAN',
  'lightscaler_prompt_rules', 'SET_SLIDER_MIN', 7, 10,
  'CONTEXT: Human subject detected. Ensure Identity Lock is at least Level 7 to prevent melted faces.'
);

INSERT INTO vision_trigger_overrides (
  json_category, json_key, json_value_match,
  target_table, action_type, forced_slider_value, override_priority, description
) VALUES (
  'classification', 'primary', 'FOOD',
  'stylescaler_prompt_rules', 'SET_SLIDER_MIN', 8, 10,
  'CONTEXT: Food photography. Force high texture detail for appetizing look.'
);

-- TABLE 6: global_prompt_config (3 RECORDS)

INSERT INTO global_prompt_config (config_key, prompt_text, token_weight, description) VALUES (
  'v15_master_negative',
  'damaged photo, torn photo, white spots, chemical burns, missing pixels, scratched, dirty, changing aspect ratio, cropping subject, shifting position, misaligned comparison, faithful to bad source, preserving blur, motion blur, camera shake, trepidation, melted faces, smudged faces, faceless people, distorted eyes, merged teeth, plastic skin, wax skin, neon red skin, sunburned, oversaturated, crushed shadows, blocked blacks, underexposed foreground, silhouetted buildings, dark blobs, flat lighting, noisy, grainy, jpeg artifacts, bad anatomy, floating limbs, double vision, ghosting, blurry table, blurry crowd, clipped highlights, solarized sky, foggy lens, steam patch, dirty lens, light leak, unwanted lens flare, washed out colors, milky overlay, low contrast haze, barrel distortion, curved walls, fish-eye effect, chromatic aberration, purple fringing, wide angle distortion, big nose distortion, tilted horizon, crooked lines, leaning buildings, distorted perspective, flat histogram, grey blacks, banding, posterization, floating green dots, blue sensor ghosts, internal lens reflection, unwanted halos, technical glare, dirty sensor spots, ugly artifacts, wrong white balance, sterile lighting, HDR halos, washed out shadows, illustration, painting, drawing, sketch, anime, 3d render.',
  1.0,
  'Universal negative prompt to enforce photorealism and prevent signal degradation.'
);

INSERT INTO global_prompt_config (config_key, prompt_text, token_weight, description) VALUES (
  'v15_output_specs',
  'OUTPUT SPECS: Native 4K, 8K UHD, Photorealistic RAW. Zero digital noise. Maximum Acutance. Perfect Geometry. Full Histogram Range (Solid Blacks, Clean Whites). STRICT ASPECT RATIO & ALIGNMENT: The Output MUST match the Input Format and Aspect Ratio EXACTLY. The structural composition (position of eyes, subject boundaries, key landmarks) MUST ALIGN PERFECTLY with the source.',
  1.2,
  'Technical requirements for file quality and geometric alignment.'
);

INSERT INTO global_prompt_config (config_key, prompt_text, token_weight, description) VALUES (
  'v15_identity_safety',
  'IDENTITY INTEGRITY PROTOCOL: The subjects must look like themselves, but in Ultra High Definition. Correct proportions and perfect skin tones. Do not alter bone structure unless Rectilinear Correction is active. Prevent Melted Faces: Reconstruct anatomically perfect eyes (distinct iris/pupil), distinct noses, and separated teeth.',
  1.1,
  'Base rules for human subject reconstruction.'
);
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

    console.log("[MIGRATION-RUNNER] Executing COMPLETE v15 HARD RESET...");

    await sql.unsafe(COMPLETE_SEED_SQL);

    console.log("[MIGRATION-RUNNER] SUCCESS - 25 records inserted");

    await sql.end();

    return new Response(
      JSON.stringify({ success: true, message: "COMPLETE v15 HARD RESET EXECUTED - 25 RECORDS" }),
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
