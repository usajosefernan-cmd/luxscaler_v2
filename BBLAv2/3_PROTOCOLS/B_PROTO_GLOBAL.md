# ANTIGRAVITY GLOBAL PROTOCOLS (MASTER GUIDE)

> **ESTADO:** ACTIVO
> **APLICA A:** Todos los Agentes (Aba, Neo, etc).
> **PRIORIDAD:** ROOT (Kernel Level).

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
