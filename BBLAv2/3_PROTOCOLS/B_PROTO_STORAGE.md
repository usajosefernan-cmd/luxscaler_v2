# B_Storage_Naming_Protocol.md - Protocolo de Estructura de Almacenamiento

**Propósito:** Definir una jerarquía de carpetas y nomenclatura de archivos lógica, legible humana y organizada para todo el proyecto Luxifier/Inkpunk.

> **FILOSOFÍA:** "Si un humano no puede encontrar el archivo navegando las carpetas, la estructura ha fallado." Evitar nombres crípticos (UUIDs largos) en la medida de lo posible.

---

## 1. Jerarquía de Directorios (Folder Structure)

La estructura raíz dentro del Bucket (ej: `lux-storage` o `user-data`) debe seguir este orden estricto:

`/{USER_ID} / {CONTEXTO} / {FECHA_ISO} / {SESION_TAG} /`

### Definiciones

1. **{USER_ID}**: ID del usuario (o Username si es único/seguro) para separar tenancies.
2. **{CONTEXTO}**: Módulo funcional donde se generó el asset.
    * `LAB_FORENSIC`
    * `LUX_SCALER`
    * `INK_FACTORY`
    * `PROFILE_ASSETS`
3. **{FECHA_ISO}**: Formato estricto `YYYY-MM-DD`. Agrupación diaria.
4. **{SESION_TAG}** (Opcional pero Recomendado): Nombre del lote o tarea si aplica.
    * Ej: `Session_Restoration_01`
    * Ej: `Batch_Product_Launch_v2`

---

## 2. Nomenclatura de Archivos (Naming Convention)

El nombre del archivo debe describir **QUÉ ES** y **QUIÉN LO HIZO**, no solo cuándo se hizo.

**Patrón:**
`{BASE_NAME}_{MODIFICADOR}_{VERSION}.{EXT}`

### Reglas

* **BASE_NAME**: Nombre legible del asset original o descripción corta. (ej: `portrait_girl`, `product_shoe`). Evitar espacios, usar `_`.
* **MODIFICADOR**: Sufijo del proceso aplicado.
  * `_orig`: Original / Source.
  * `_gen_nano`: Generado por Nano Banana.
  * `_gen_nanopro`: Generado por Nano Banana Pro (Gemini 3).
  * `_gen_seedream`: Generado por SeeDream.
  * `_upscale_x2`: Upscaled x2.
  * `_mask`: Máscara de recorte.
* **VERSION** (MANDATORIO si es iterativo): `v1`, `v2`, `v1.5`.

**Ejemplos Correctos:**
✅ `.../2026-01-10/Lab_Session_1/portrait_girl_gen_nanopro_v1.png`
✅ `.../2026-01-10/LuxScaler_Batch/shoe_product_upscale_x4_final.jpg`

**Ejemplos INCORRECTOS:**
❌ `image_238472398472398.png` (Indescifrable)
❌ `sd_output_23.png` (Sin contexto)
❌ `final_final_v2_real.jpg` (Ambigüo)

---

## 3. Implementación Técnica (Snippet de Referencia)

Al generar rutas en código (TypeScript/Python), usa esta función constructora:

```typescript
function buildStoragePath(
  userId: string, 
  context: 'LAB' | 'SCALER' | 'FACTORY', 
  sessionName: string, 
  fileName: string, 
  modifier: string, 
  version: string = 'v1'
): string {
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const safeSession = sessionName.replace(/[^a-zA-Z0-9_-]/g, '_'); // Sanitize
    const cleanFile = fileName.split('.')[0].replace(/[^a-zA-Z0-9_-]/g, '_'); // Sanitize base
    
    // Estructura: User / Lab / 2026-01-10 / Session_Name / file_gen_nano_v1.png
    return `${userId}/${context}/${dateStr}/${safeSession}/${cleanFile}_${modifier}_${version}.png`;
}
```

## 4. Metadatos

Siempre que sea posible, acompaña el guardado del archivo con un registro en base de datos (`generations` o `forensic_results`) que incluya el `path` completo, para facilitar la búsqueda cruzada.
