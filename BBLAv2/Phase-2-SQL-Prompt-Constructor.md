# 🔧 FASE 1.5: ARQUITECTURA "PROMPT V15" (SQL-DRIVEN)

## Sistema de Reconstrucción Forense Modular | NanoBananaPro Ready

**Para:** Sistema de Prompts Adaptativo (Migración de Monolito a SQL) **Fecha:** Enero 14, 2026 **Versión:** 1.5.2 (Adapted for v15 Logic) **Propósito:** Desglosar el "Super-Prompt v15" en tablas SQL consultables.

---

## 🎯 EL CONCEPTO: DE MONOLITO A ROMPECABEZAS

El Prompt v15 es demasiado complejo para vivir en un `string` dentro del código. Lo hemos dividido en **4 Dominios de Responsabilidad** que se ensamblan en tiempo real según los sliders.

1. **Photoscaler (Estructura):** Se encarga de la geometría, la nitidez forense y la corrección de lente.

2. **Lightscaler (Física):** Se encarga del "Zone System", recuperación de sombras y teoría del color.

3. **Stylescaler (Estética):** Se encarga del "Drama Club", ópticas anamórficas y alucinación de texturas.

4. **Global Config:** Maneja el enorme "Negative Prompt" y las reglas universales.

---

## 📋 SCHEMA DE TABLAS ACTUALIZADO

### TABLA 1: `photoscaler_prompt_rules` (El Ingeniero Estructural)

Maneja: *Resolution, Geometry, Lens Physics, Signal Integrity.*

SQL

```
CREATE TABLE photoscaler_prompt_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slider_name VARCHAR(50) NOT NULL,    -- 'acutancia'
  slider_value_min INT, slider_value_max INT,
  on_off BOOLEAN DEFAULT true,

  -- Prompt v15 Modules
  base_prompt TEXT NOT NULL,           -- "SYSTEM OVERRIDE... RE-SHOOT PROTOCOL"
  geometric_correction TEXT,           -- "RECTILINEAR CORRECTION MODE..."
  detail_hallucination TEXT,           -- "COMPLETE RE-SYNTHESIS..."

  -- Metadata
  intensity_level VARCHAR(20),
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### TABLA 2: `lightscaler_prompt_rules` (El Director de Fotografía)

Maneja: *Zone System, Tone Mapping, Blue Hour, White Balance.*

SQL

```
CREATE TABLE lightscaler_prompt_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slider_name VARCHAR(50) NOT NULL,    -- 'sombras', 'identity'
  slider_value_min INT, slider_value_max INT,
  on_off BOOLEAN DEFAULT true,

  -- Prompt v15 Modules
  base_prompt TEXT NOT NULL,           -- "LOW-LIGHT RECOVERY SUB-PROTOCOL..."
  color_science_prompt TEXT,           -- "BLUE HOUR AESTHETIC... TEAL/ORANGE"
  white_balance_prompt TEXT,           -- "CONTEXTUAL WHITE BALANCE..."

  -- Metadata
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### TABLA 3: `stylescaler_prompt_rules` (El Director de Arte)

Maneja: *Cinema Look, Anamorphic Optics, Texture Injection.*

SQL

```
CREATE TABLE stylescaler_prompt_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slider_name VARCHAR(50) NOT NULL,    -- 'detalle'
  slider_value_min INT, slider_value_max INT,
  on_off BOOLEAN DEFAULT true,

  -- Prompt v15 Modules
  base_prompt TEXT NOT NULL,           -- "ANAMORPHIC OPTICS... DRAMA CLUB"
  texture_quality_prompt TEXT,         -- "INJECT MASSIVE HIGH-FREQUENCY DETAIL..."

  -- AI Parameters
  guidance_scale FLOAT DEFAULT 7.5,    -- Control dinámico

  created_at TIMESTAMP DEFAULT NOW()
);
```

### TABLA 4: `global_prompt_config` (Reglas Universales)

Maneja: *Negative Prompts y Output Specs.*

SQL

```
CREATE TABLE global_prompt_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name VARCHAR(50) NOT NULL,    -- 'v15_master_negative', 'v15_output_specs'
  prompt_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

---

## 💾 DATOS DE IMPLEMENTACIÓN (EL "SEED" DEL V15)

Aquí es donde insertamos la lógica exacta del prompt v15 en la base de datos. *Nota: Usamos `$$` como delimitador de texto en SQL para evitar problemas con las comillas simples dentro del prompt.*

### 1. Ingesta: Photoscaler (Acutancia 8-10) -> "Forensic Re-shoot"

SQL

```
INSERT INTO photoscaler_prompt_rules 
(slider_name, slider_value_min, slider_value_max, intensity_level, description, base_prompt, geometric_correction, detail_hallucination)
VALUES
(
  'acutancia', 8, 10, 'extreme', 
  'v15 Forensic Re-shoot Implementation',

  -- Base Prompt (System Override)
  $$[SYSTEM OVERRIDE: UNIVERSAL FORENSIC RE-SHOOT & OPTICAL SYNTHESIS PROTOCOL v15.0]. 
  A definitive, photorealistic reconstruction. The AI must act as a "Reality Reconstruction Engine". 
  VIRTUAL RE-SHOOT: Simulate a brand new capture using a 1/8000s shutter speed (zero motion blur) and a calibrated sensor.$$,

  -- Geometric Correction (Lens)
  $$GEOMETRIC & OPTICAL FAILURE ALERT: If input has barrel distortion or perspective skew, ACTIVATE "RECTILINEAR CORRECTION MODE". 
  Straighten architectural lines. LENS SUBSTITUTION: If wide-angle distortion exists, RE-RENDER as if shot with 85mm Prime Lens. 
  FORCE HORIZON ALIGNMENT.$$,

  -- Detail Hallucination
  $$COMPLETE RE-SYNTHESIS: You must HALLUCINATE and GENERATE brand new, razor-sharp high-frequency details (individual eyelashes, iris trabeculae, distinct teeth, skin pores) from scratch. 
  SEVERE DAMAGE RECONSTRUCTION: If signal is lost, DO NOT preserve damage. PAINT NEW REALITY.$$
);
```

### 2. Ingesta: Lightscaler (Sombras 7-10) -> "Zone System & Blue Hour"

SQL

```
INSERT INTO lightscaler_prompt_rules 
(slider_name, slider_value_min, slider_value_max, description, base_prompt, color_science_prompt, white_balance_prompt)
VALUES
(
  'sombras', 7, 10, 
  'v15 Low Light & Atmospheric Recovery',

  -- Base (Low Light Protocol)
  $$[SUB-PROTOCOL: LOW-LIGHT RECOVERY]. DIAGNOSIS: If input is Underexposed, DO NOT wash out. 
  ZONE SYSTEM RECOVERY: STRICTLY Anchor the Black Point at absolute zero (0,0,0). 
  Aggressively lift Zones 1-3 (Deep Shadows) to reveal latent textures hidden in darkness.$$,

  -- Color Science (Blue Hour / Drama)
  $$BLUE HOUR AESTHETIC: Simulate "Civil Twilight" lighting physics (6500K-8000K). 
  CONTRAST LIGHTING: Force artificial lights to "Warm Tungsten" (3200K) to create Teal/Orange contrast. 
  VOLUMETRICS: Inject subtle "Blue Hour Mist" to separate planes.$$,

  -- White Balance
  $$CONTEXTUAL WHITE BALANCE: Neutralize technical color casts (green fluorescent, muddy yellow) but PRESERVE ATMOSPHERIC TONE. 
  Do not force a sterile 5500K white if it destroys the mood.$$
);
```

### 3. Ingesta: Stylescaler (Detalle 8-10) -> "Cinema Look"

SQL

```
INSERT INTO stylescaler_prompt_rules 
(slider_name, slider_value_min, slider_value_max, description, guidance_scale, base_prompt, texture_quality_prompt)
VALUES
(
  'detalle', 8, 10, 
  'v15 Anamorphic & Drama Club',
  12.0, -- Guidance alto para forzar el estilo

  -- Base (Anamorphic / Cinema)
  $$ANAMORPHIC OPTICS ("HOLLYWOOD LOOK"): To achieve the "Drama Club" and "Reality Warp" aesthetic, simulate Anamorphic Lens characteristics: subtle oval bokeh and controlled horizontal flares. 
  CONCEPTUAL TONE MAPPING (HDR 2.0): Ensure "Cinematic Visibility" over flat illumination.$$,

  -- Texture Quality
  $$INJECT MASSIVE HIGH-FREQUENCY DETAIL. Hallucinate organic roughness (pores, vellus hair, fabric threads) to kill "plastic/mobile" look. 
  OUTPUT SPECS: Native 4K, 8K UHD, Photorealistic RAW.$$
);
```

### 4. Ingesta: Global Config (Negative Prompt)

SQL

```
INSERT INTO global_prompt_config (config_name, prompt_text) VALUES
(
  'v15_master_negative',
  $$damaged photo, torn photo, white spots, chemical burns, missing pixels, scratched, dirty, changing aspect ratio, cropping subject, faithful to bad source, preserving blur, motion blur, camera shake, melted faces, smudged faces, faceless people, distorted eyes, plastic skin, wax skin, neon red skin, sunburned, crushed shadows, blocked blacks, flat lighting, noisy, grainy, jpeg artifacts, bad anatomy, floating limbs, double vision, ghosting, blurry crowd, clipped highlights, solarized sky, foggy lens, steam patch, dirty lens, light leak, washed out colors, milky overlay, low contrast haze, fish-eye effect, chromatic aberration, purple fringing, big nose distortion, tilted horizon, crooked lines, grey blacks, banding, posterization, floating green dots, blue sensor ghosts, ugly artifacts, sterile lighting.$$
);
```

---

## 🔄 QUERY BUILDER (TypeScript Actualizado)

**Archivo:** `src/lib/sqlPromptBuilder.ts` Este builder ensambla el prompt consultando las tablas anteriores.

TypeScript

```
import { createClient } from '@supabase/supabase-js'

// ... (Client initialization)

export async function buildPromptsFromSQL(sliders: any, category: string = 'HUMAN') {

  // 1. Ejecutar Queries Paralelas
  const [photoscaler, lightscaler, stylescaler, globalConfig] = await Promise.all([

    // Photoscaler (Estructura)
    supabase.from('photoscaler_prompt_rules')
      .select('*')
      .eq('slider_name', 'acutancia')
      .lte('slider_value_min', sliders.acutancia)
      .gte('slider_value_max', sliders.acutancia)
      .single(),

    // Lightscaler (Luz)
    supabase.from('lightscaler_prompt_rules')
      .select('*')
      .eq('slider_name', 'sombras')
      .lte('slider_value_min', sliders.sombras)
      .gte('slider_value_max', sliders.sombras)
      .single(),

    // Stylescaler (Estilo)
    supabase.from('stylescaler_prompt_rules')
      .select('*')
      .eq('slider_name', 'detalle')
      .lte('slider_value_min', sliders.detalle)
      .gte('slider_value_max', sliders.detalle)
      .single(),

    // Global Negative Prompt
    supabase.from('global_prompt_config')
      .select('prompt_text')
      .eq('config_name', 'v15_master_negative')
      .single()
  ]);

  // 2. Ensamblar Array de Prompts
  const promptParts: string[] = [];

  // A. Estructura (Photoscaler)
  if (photoscaler.data) {
    promptParts.push(photoscaler.data.base_prompt);
    promptParts.push(photoscaler.data.geometric_correction);
    promptParts.push(photoscaler.data.detail_hallucination);
  }

  // B. Física de Luz (Lightscaler)
  if (lightscaler.data) {
    promptParts.push(lightscaler.data.base_prompt);
    promptParts.push(lightscaler.data.color_science_prompt);
    promptParts.push(lightscaler.data.white_balance_prompt);
  }

  // C. Estilo (Stylescaler)
  if (stylescaler.data) {
    promptParts.push(stylescaler.data.base_prompt);
    promptParts.push(stylescaler.data.texture_quality_prompt);
  }

  // 3. Extraer Valores Numéricos para la IA
  const settings = {
    guidance_scale: stylescaler.data?.guidance_scale || 7.5,
    negative_prompt: globalConfig.data?.prompt_text || ""
  };

  return {
    positive_prompt_array: promptParts.filter(p => p !== null), // Clean nulls
    ...settings
  };
}
```

---

## 🚀 CÓMO USARLO

1. **Ejecuta el SQL** en Supabase para crear las tablas e insertar los datos del v15.

2. **Copia el TypeScript** en tu backend/middleware.

3. **Llama a la función**:
   
   TypeScript
   
   ```
   const result = await buildPromptsFromSQL({ acutancia: 10, sombras: 9, detalle: 8 });
   console.log(result.positive_prompt_array.join(" ")); 
   // -> Generará el Prompt v15 completo automáticamente.
   ```

# 👁️ ANEXO FASE 1.6: EDGEVISION INTELLIGENCE LAYER

## El "Forensic Blueprint" como Driver del Sistema SQL

**Propósito:** Interceptar la imagen antes de la generación, crear un mapa de daños y materiales, y **forzar** la selección de reglas SQL específicas que el usuario podría olvidar activar manualmente.

---

## 1. EL NUEVO FLUJO DE DATOS (PIPELINE ACTUALIZADO)

La arquitectura cambia de ser **Reactiva** (esperar al usuario) a **Proactiva** (analizar primero).

1. **Input:** Imagen Raw subida.

2. **EdgeVision (Gemini 1.5 Flash):** Escanea en <2s.

3. **Output:** `ForensicBlueprint.json` (El mapa de intencionalidad).

4. **Traductor (The Bridge):** Convierte el JSON en parámetros SQL.
   
   - *Ejemplo:* `distortion: "Barrel"` -> **ACTIVA** regla `photoscaler` "Rectilinear Mode".
   
   - *Ejemplo:* `material: "SKIN"` -> **INYECTA** regla `material_physics` "SSS High".

5. **SQL Builder:** Ejecuta las queries combinando **Sliders de Usuario + Overrides de EdgeVision**.

---

## 2. NUEVAS TABLAS NECESARIAS (RELACIONALES)

Para soportar la "Materialidad Semántica" y la "Auditoría Técnica" que mencionas, necesitamos dos tablas nuevas que trabajen junto a `photoscaler` y `lightscaler`.

### TABLA 6: `semantic_material_rules` (Nuevo)

**Propósito:** Almacena la física de los materiales detectados por EdgeVision (Piel, Metal, Seda, Comida).

SQL

```
CREATE TABLE semantic_material_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Trigger desde EdgeVision
  material_tag VARCHAR(50) NOT NULL,   -- 'SKIN', 'FABRIC_SILK', 'IRIS', 'METAL'
  detected_attribute VARCHAR(50),      -- 'sss_strength', 'anisotropy', 'reflection'

  -- La Inyección de Prompt (Física)
  physics_prompt TEXT NOT NULL,        -- "subsurface_scattering_strength:0.8, skin_pore_depth:normal_map"

  -- Propiedades Ópticas
  roughness_prompt TEXT,               -- "specular_roughness:0.2"
  reflection_model VARCHAR(50),        -- 'ggx', 'anisotropic', 'wet_glass'

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  priority INT DEFAULT 5               -- 10 = Override total
);

CREATE INDEX idx_material_tag ON semantic_material_rules(material_tag);
```

### TABLA 7: `vision_trigger_overrides` (El Puente Lógico)

**Propósito:** Traduce "Diagnósticos Técnicos" del JSON a "Acciones" en las tablas existentes (Photoscaler, Lightscaler).

SQL

```
CREATE TABLE vision_trigger_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- La condición del JSON (INPUT)
  json_category VARCHAR(50) NOT NULL,  -- 'technical_audit', 'lighting_diagnosis'
  json_key VARCHAR(50) NOT NULL,       -- 'signal', 'distortion', 'strategy'
  json_value_match VARCHAR(50) NOT NULL, -- 'Underexposed_Clipped_Shadows', 'Minor_Barrel'

  -- La acción en el sistema (OUTPUT)
  target_table VARCHAR(50) NOT NULL,   -- 'lightscaler_prompt_rules', 'photoscaler_prompt_rules'
  action_type VARCHAR(20) NOT NULL,    -- 'FORCE_ENABLE', 'SET_SLIDER_MIN', 'INJECT_EXTRA'

  -- Parámetros de la acción
  forced_slider_value INT,             -- Ej: Si está oscura, fuerza Sombras a 9
  forced_rule_slug VARCHAR(100),       -- Ej: 'rectilinear_correction_mode'

  description VARCHAR(200)
);
```

---

## 3. DATOS DE INGESTA (SEED DATA PARA EDGEVISION)

Aquí conectamos tu lógica de "Auditoría" con las tablas.

#### A. Reglas de Materiales (Semántica)

*EdgeVision detecta [SKIN] o [IRIS], nosotros inyectamos física.*

SQL

```
-- PIEL (Human)
INSERT INTO semantic_material_rules (material_tag, detected_attribute, physics_prompt, reflection_model)
VALUES 
('SKIN', 'HIGH', 'subsurface_scattering_strength:1.0, epidermal_translucency:true, vellus_hair_render:on', 'skin_shader_v4');

-- IRIS (Ojos)
INSERT INTO semantic_material_rules (material_tag, detected_attribute, physics_prompt, reflection_model)
VALUES 
('IRIS', 'WET', 'corneal_refraction_index:1.376, iris_fibrous_structure:ultra_detail, tear_film_specular:wet', 'wet_glass');

-- SEDA (Ropa)
INSERT INTO semantic_material_rules (material_tag, detected_attribute, physics_prompt, reflection_model)
VALUES 
('FABRIC_SILK', 'MODERATE', 'anisotropic_fabric_sheen:true, weave_pattern:micro_satin', 'anisotropic');
```

#### B. Triggers de Diagnóstico (El Puente)

*EdgeVision detecta [Underexposed] -> Sistema activa [Zone System].*

SQL

```
-- CASO 1: Foto Subexpuesta (Underexposed)
-- Acción: Forzar el Lightscaler "Zone System" (definido en lightscaler table como value 9)
INSERT INTO vision_trigger_overrides 
(json_category, json_key, json_value_match, target_table, action_type, forced_slider_value, description)
VALUES 
('technical_audit', 'signal', 'Underexposed_Clipped_Shadows', 'lightscaler_prompt_rules', 'SET_SLIDER_MIN', 9, 'Force aggressive shadow recovery');

-- CASO 2: Distorsión de Lente (Barrel)
-- Acción: Activar Photoscaler "Rectilinear Correction" (definido en photoscaler como value 10)
INSERT INTO vision_trigger_overrides 
(json_category, json_key, json_value_match, target_table, action_type, forced_slider_value, description)
VALUES 
('technical_audit', 'distortion', 'Minor_Barrel', 'photoscaler_prompt_rules', 'SET_SLIDER_MIN', 10, 'Activate geometric correction');
```

---

## 4. INTEGRACIÓN EN EL BUILDER (TYPESCRIPT LOGIC)

El `sqlPromptBuilder.ts` ahora acepta el `ForensicBlueprint` como argumento opcional.

TypeScript

```
// Interfaces para el JSON de EdgeVision
interface ForensicBlueprint {
  classification: { primary: string; sub_category: string };
  technical_audit: { signal: string; distortion: string };
  materiality_map: Array<{ type: string; sss_strength?: string; anisotropy?: string }>;
  restoration_priority: { strategy: string };
}

export async function buildPromptsFromSQL(
  sliders: SlidersV32,   blueprint?: ForensicBlueprint // <-- NUEVO ARGUMENTO
) {

  // PASO 1: Analizar el Blueprint para modificar Sliders (Auto-Pilot)
  let effectiveSliders = { ...sliders };
  let activeMaterials: string[] = [];

  if (blueprint) {
    // A. Consultar tabla 'vision_trigger_overrides'
    // Si el blueprint dice "Underexposed", buscamos en DB qué slider mover.
    // (Pseudocódigo de lógica de override)
    const overrides = await supabase.from('vision_trigger_overrides').select('*')...;

    overrides.forEach(rule => {
       if (matchJSON(blueprint, rule)) {
          if (rule.target_table === 'lightscaler') effectiveSliders.sombras = Math.max(effectiveSliders.sombras, rule.forced_slider_value);
          if (rule.target_table === 'photoscaler') effectiveSliders.acutancia = Math.max(effectiveSliders.acutancia, rule.forced_slider_value);
       }
    });

    // B. Recolectar Materiales
    activeMaterials = blueprint.materiality_map.map(m => m.type);
  }

  // PASO 2: Ejecutar las queries estándar con los Sliders MODIFICADOS
  // (Llamada a las tablas photoscaler, lightscaler, stylescaler como antes...)
  const standardPrompts = await executeStandardQueries(effectiveSliders);

  // PASO 3: Ejecutar query de MATERIALES (Nueva capa)
  const materialPrompts = await supabase
    .from('semantic_material_rules')
    .select('physics_prompt')
    .in('material_tag', activeMaterials);

  // PASO 4: Ensamblaje Final del Prompt Maestro
  return {
    system_instruction: "UNIVERSAL FORENSIC PROTOCOL v15...",

    // Array ordenado lógicamente
    prompt_stack: [
      ...standardPrompts.photoscaler,      // Estructura y Geometría (Corregido por Vision)
      ...standardPrompts.lightscaler,      // Luz y Zone System (Corregido por Vision)
      ...standardPrompts.stylescaler,      // Estilo
      ...materialPrompts.data,             // INYECCIÓN FÍSICA DE MATERIALES (Skin, Silk...)
      standardPrompts.negative_prompt
    ]
  };
}
```

---

## 💾 RESUMEN DEL IMPACTO

Al añadir este anexo, tu programador entiende que:

1. **No confiamos solo en el usuario:** Si la foto viene rota (JSON: `strategy: COMPLETE_RE_SYNTHESIS`), el sistema fuerza los sliders al máximo automáticamente.

2. **La piel será realista:** Gracias a la tabla `semantic_material_rules`, si EdgeVision ve una cara, inyectamos SSS (Subsurface Scattering) automáticamente.

3. **Prompt Híbrido:** El prompt final es la suma de [Deseo del Usuario (Sliders)] + [Realidad de la Imagen (EdgeVision)].
