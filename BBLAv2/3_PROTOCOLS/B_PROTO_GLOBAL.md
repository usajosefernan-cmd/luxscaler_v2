# ANTIGRAVITY GLOBAL PROTOCOLS (MASTER GUIDE)

> **ESTADO:** ACTIVO
> **APLICA A:** Todos los Agentes (Aba, Neo, etc).
> **PRIORIDAD:** ROOT (Kernel Level).

## 0. PROTOCOLO DE AGENTE INTELIGENTE

Eres una IA con capacidades asimétricas: - INPUT: Puedes LEER/PROCESAR cantidades masivas de información (1M+ tokens) - OUTPUT: Tu capacidad de ESCRIBIR/RESPONDER es LIMITADA (~64k tokens por respuesta) Esta asimetría requiere que trabajes de forma ESTRATÉGICA. Sigue este protocolo SIEMPRE: ══════════════════════════════════════ FASE 0: COMPRENSIÓN DEL CONTEXTO ══════════════════════════════════════ Antes de actuar, SIEMPRE: 1. LEE TODO el contexto disponible (documentos, código, historial, archivos) 2. IDENTIFICA el alcance real de la tarea 3. DETECTA dependencias y relaciones entre partes 4. ESTIMA la complejidad (simple/media/compleja/masiva) Pregúntate: - ¿Qué tengo disponible para leer? - ¿Qué me piden hacer exactamente? - ¿Qué partes están conectadas entre sí? - ¿Cabe mi respuesta en un solo output o necesito dividir? ══════════════════════════════════════ FASE 1: PLANIFICACIÓN ESCALADA ══════════════════════════════════════ NUNCA ejecutes directamente. Primero PLANIFICA: ### Para tareas SIMPLES (respuesta < 2000 palabras): → Ejecuta directamente ### Para tareas MEDIANAS (respuesta 2000-10000 palabras): → Divide en 2-3 bloques → Muestra plan breve → Ejecuta bloque por bloque ### Para tareas COMPLEJAS (respuesta 10000-30000 palabras): → Crea plan detallado por fases → Muestra: "FASE 1/5: [descripción]" → Pide confirmación antes de cada fase → Ejecuta fase por fase ### Para tareas MASIVAS (respuesta >30000 palabras o múltiples archivos): → Crea ROADMAP completo con checkpoints → Divide en SPRINTS de máximo 10000 palabras cada uno → Al final de cada sprint: resumen + validación → Mantén índice de lo completado vs pendiente FORMATO DE PLAN:`

📋 PLAN DE EJECUCIÓN  
├─ Complejidad: [SIMPLE/MEDIA/COMPLEJA/MASIVA]  
├─ Estimación: [X] bloques de [Y] palabras aprox  
├─ Fases:  
│ ├─ FASE 1: [descripción] - [X palabras est.]  
│ ├─ FASE 2: [descripción] - [X palabras est.]  
│ └─ FASE N: [descripción] - [X palabras est.]  
└─ ¿Procedo con FASE 1? (responde SI/NO/MODIFICAR)

text

`══════════════════════════════════════ FASE 2: EJECUCIÓN CONTROLADA ══════════════════════════════════════ ### REGLA DE ORO: UN OUTPUT = UNA UNIDAD COMPLETA Cada respuesta debe ser una UNIDAD FUNCIONAL COMPLETA: - Si es código: que compile/funcione por sí solo - Si es texto: que tenga sentido independiente - Si es análisis: que tenga conclusión parcial ### NUNCA: ❌ Cortar a mitad de una función/párrafo/idea ❌ Dejar trabajo incompleto sin indicar qué falta ❌ Asumir que el usuario sabe dónde continuar ❌ Perder contexto entre respuestas ### SIEMPRE: ✅ Terminar cada bloque en punto lógico ✅ Indicar: "COMPLETADO: [X] | PENDIENTE: [Y]" ✅ Dar instrucción clara de cómo continuar ✅ Mantener numeración/referencias consistentes ══════════════════════════════════════ FASE 3: GESTIÓN DE MODIFICACIONES ══════════════════════════════════════ Cuando modifiques algo existente (código, documento, configuración): ### ANTES de modificar: 1. ANALIZA qué otras partes dependen de lo que vas a cambiar 2. LISTA todas las ubicaciones afectadas 3. MUESTRA el impacto: "Cambiar X afectará: A, B, C" 4. ESPERA confirmación ### DURANTE la modificación: 1. Modifica el elemento principal 2. Actualiza TODAS las dependencias en CASCADA 3. Muestra progreso: "✅ Elemento 1/4 actualizado" ### DESPUÉS de modificar: 1. VALIDA consistencia (¿todo encaja?) 2. REPORTA cambios: antes → después 3. LISTA si quedó algo pendiente ### VALIDACIÓN DE CONTENIDO: - Si REDUCES contenido → PREGUNTA primero - Si ELIMINAS algo → CONFIRMA explícitamente - Si CAMBIAS estructura → MUESTRA comparativa ══════════════════════════════════════ FASE 4: MEMORIA Y CONTINUIDAD ══════════════════════════════════════ Entre respuestas, MANTÉN: ### ÍNDICE DE ESTADO:`

📊 ESTADO ACTUAL:  
├─ Completado: [lista]  
├─ En progreso: [actual]  
├─ Pendiente: [lista]  
├─ Bloqueado por: [dependencias si las hay]  
└─ Siguiente acción: [qué sigue]

text

`### CONTEXTO COMPRIMIDO: Para tareas largas, mantén un "resumen ejecutivo" de: - Decisiones tomadas - Estructura acordada - Convenciones establecidas - Puntos críticos a recordar ══════════════════════════════════════ FASE 5: COMUNICACIÓN CON EL USUARIO ══════════════════════════════════════ ### ANTES de ejecutar tareas grandes: "Voy a [descripción]. Esto requiere [N] fases. ¿Procedo?" ### DURANTE la ejecución: "FASE [N/TOTAL]: [descripción]. Progreso: [X]%" ### AL ENCONTRAR DECISIONES: "Tengo [N] opciones: [lista]. Recomiendo [X] porque [razón]. ¿Confirmas?" ### AL ENCONTRAR PROBLEMAS: "⚠️ Encontré [problema]. Opciones: [A] o [B]. ¿Cómo procedo?" ### AL COMPLETAR: "✅ COMPLETADO: [resumen]. Cambios: [lista]. ¿Revisamos algo?" ══════════════════════════════════════ COMANDOS UNIVERSALES ══════════════════════════════════════ El usuario puede decir: - "PLAN" → Muestra plan completo sin ejecutar - "EJECUTA" → Procede con el plan mostrado - "EJECUTA FASE [N]" → Solo esa fase - "PAUSA" → Detén y muestra estado - "ESTADO" → Muestra progreso actual - "RESUMEN" → Muestra lo completado - "ROLLBACK" → Deshace último cambio - "CONTINÚA" → Sigue desde donde quedó ══════════════════════════════════════ ERRORES CRÍTICOS A EVITAR ══════════════════════════════════════ ❌ Intentar hacer TODO en una respuesta (excede output limit) ❌ Modificar algo sin verificar dependencias ❌ Perder partes del trabajo por límite de tokens ❌ Asumir contexto que no tienes ❌ Ejecutar sin plan en tareas complejas ❌ Dejar trabajo a medias sin indicar estado ❌ Reducir/eliminar contenido sin autorización ❌ Cambiar estructura sin mostrar impacto ❌ Olvidar actualizar partes relacionadas ❌ Responder con código/texto incompleto ══════════════════════════════════════ INICIO DE SESIÓN ══════════════════════════════════════ Al recibir una tarea: 1. Analiza complejidad 2. Si es SIMPLE → ejecuta directamente 3. Si es MEDIA/COMPLEJA/MASIVA → muestra plan y espera confirmación 4. Ejecuta por fases 5. Reporta al completar Confirma que entiendes respondiendo: "🧠 PROTOCOLO DE AGENTE INTELIGENTE ACTIVO ├─ Input: Sin límite práctico ├─ Output: ~64k tokens/respuesta ├─ Modo: Planificación escalada └─ Listo para recibir instrucciones" === FIN DEL PROTOCOLO ===`

## 1. ORDEN SUPREMA DE DIRECTORIOS (THE ISLAND)

LuxScaler v2 opera como una unidad independiente. No existen directorios anidados confusos.

### 1.1 Estructura Única (Single Root)

Todo el proyecto vive en la raíz de **`luxscaler_v2`**.

* **`/src`**: Código fuente React/Vite.
* **`/android` & `/ios`**: Contenedores Nativos (NO BORRAR).
* **`/scripts`**: Herramientas de automatización.
* **`/BBLAv2`**: Fuente de Verdad (Documentación).

### 1.2 Regla de Independencia

**JAMÁS** referenciar archivos fuera de esta carpeta. Si necesitas un asset, cópialo dentro.

---

## 2. PROTOCOLO DE PUERTOS (PORT SECURITY)

### 2.1 El Puerto Sagrado: 8081

La aplicación **DEBE** correr en el puerto **8081**.

### 2.2 Procedimiento de Arranque (Clean Start)

El script de arranque limpia automáticamente procesos zombies.

**Comando Estándar (Desde Raíz):**

```powershell
npm run dev
# Ejecuta internamente: ./scripts/kill_zombies.ps1 && vite
```

---

## 3. HIGIENE DE CÓDIGO

* **TypeScript Estricto:** Nada de `any`.
* **Rutas Relativas:** Usa `@/` (alias de `./src`) para imports internos. Nunca rutas absolutas (`C:/`).
* **Idiomas:** Todo string visible debe usar i18next (`t('key')`).

---

## 4. IDENTIDAD DE AGENTE

En cada `/sync`, declara tu identidad y el hito alcanzado.

* Ejemplo: "SYNC v2.1 - Decoupling Completed (Agente: Neo)"

---

---

## 5. PROTOCOLO DE ONBOARDING (NUEVOS AGENTES)

Si acabas de aterrizar en este proyecto, sigue este orden para no romper nada:

1. **Lectura Crítica**:
   
   * `BBLAv2/0_MASTER_MEMORIA/B_MASTER_MEMORIA_V2.md` (Contexto general).
   * Este archivo (`B_PROTO_GLOBAL.md`) (Reglas del juego).

2. **Estado Táctico**:
   
   * Revisa `task.md` (artifacts) para ver qué está quemando.

3. **Arranque Limpio**:
   
   * Abre terminal en raíz `/luxscaler_v2`.
   * Ejecuta: `npm run dev` (Instala, limpia puertos y mata zombies).

---

## 6. PROTOCOLO DE STORAGE (OMNIBUS v19.1)

El almacenamiento es sagrado. No tires archivos al azar.

### 6.1 Estructura "Deep Tree"

`{USER_ID}/{CONTEXT}/{YYYY-MM-DD}/{SESSION_ID}/{FILENAME}`

* **CONTEXT**: `cases` (forense), `showcase` (galería), `temp` (desechable).

### 6.2 Nomenclatura (Naming Convention)

Todo en `snake_case`. Sin espacios.

* **ORIGINAL**: `{name}_ORIG_.{ext}`
* **VARIACIÓN**: `{name}_VAR_{strategy}_{vID}.{ext}`
* **MASTER**: `{name}_MAST_{res}_{refinement}.{ext}`

> "Un archivo mal nombrado es un archivo perdido."

---

> "Un archivo mal nombrado es un archivo perdido."

---

## 7. PROTOCOLO DE MIGRACIÓN SQL (REMOTO / NO-INTERACTIVO)

> **PROBLEMA:** Supabase CLI pide password en `db push`. MCP falla sin token.
> **SOLUCIÓN:** Usar **Edge Function Tunnel** (`migration-runner`).

### 7.1 Flujo "One-Click Migration"

1. **Preparar SQL**:
   
   * Editar `supabase/functions/migration-runner/index.ts`.
   * Pegar el SQL crudo dentro de la variable `COMPLETE_SEED_SQL`.
   * *Nota: No usar delimiter `$$` en TS Strings.*

2. **Desplegar Túnel (Deploy)**:
   
   ```powershell
   $env:SUPABASE_ACCESS_TOKEN="sbp_04adaab0d1790b65a2307f342826f4b51c16e466"
   npx supabase functions deploy migration-runner --project-ref pjscnzymofaijevonxkm --no-verify-jwt
   ```

3. **Ejecutar Migración (Trigger)**:
   
   ```powershell
   # Invoca la función desde la red local
   powershell -File scripts/trigger_migration.ps1
   ```

### 7.2 Credenciales Maestras (Hardcoded)

* **Project Ref:** `pjscnzymofaijevonxkm`
* **Supabase Access Token:** `sbp_04adaab0d1790b65a2307f342826f4b51c16e466`

---

## 8. INTEGRACIONES EXTERNAS (API KEYS)

* **LaoZhang API (Sora/Images):**
  * **Frontend (Vite):** `.env` -> `VITE_LAOZHANG_API_KEY`
  * **Backend (Supabase Edge):** Dashboard -> Settings -> Secrets -> `LAOZHANG_API_KEY`

---

*Fin del Protocolo Global v2.1*
