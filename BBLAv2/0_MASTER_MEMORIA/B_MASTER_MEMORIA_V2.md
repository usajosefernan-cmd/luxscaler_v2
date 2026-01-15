# MEMORIA MAESTRA V2 - LUXSCALER PROJECT

> **FUENTE DE VERDAD ÚNICA**
> **ÚLTIMA ACTUALIZACIÓN:** 2026-01-13 (Neo Reset)
> **ESTADO:** LuxScaler v2.0 (Clean Architecture)

## 1. VISIÓN DEL PROYECTO

LuxScaler es una plataforma de "Engine Óptico Forense" que utiliza IA para escalar, restaurar y reimaginar imágenes con una fidelidad de 8K/16K.

* **Core Philosophy:** Mobile First, Premium UI (Gold/Black), Forensic Analysis.
* **Tech Stack:** React (Vite), Tailwind, Supabase (Edge Functions), Python (Forensic Lab).

## 2. ARQUITECTURA DE DIRECTORIOS (v2.0)

La estructura se ha aplanado para facilitar el mantenimiento:

* `/src`: Todo el código fuente frontend.
* `/supabase`: Backend (Migrations, Functions).
* `/BBLAv2`: Documentación técnica.
* `/public`: Assets estáticos.
* `/android` & `/ios`: Contenedores Nativos Soberanos.
* `/scripts`: Automatización (No-Zombie).

## 3. ESTADO TÉCNICO ACTUAL

### A. Core Engine (Edge Functions)

* **Master Sculptor (v32.0):** Optimizado con `decodeBase64` nativo de Deno. Sin fugas de memoria. Protocolo `snake_case`.
* **Preview Generator (Swarm):** Ejecución paralela 6x.
* **Forensic Lab:** Análisis profundo de lentes y daños físicos.

### B. Frontend (Deep Inspector)

* **Modal de Inspección**: Telemetría completa (Mixer Settings, Coste).
* **Storage Manager**: Protocolo Omnibus v19.1. Masonry Grid, Zoom.

### C. Protocolos Activos

* **Storage:** `{USER_ID}/{CONTEXT}/{YYYY-MM-DD}/{SESSION_ID}/{FILENAME}`.
* **Naming:** `{BASE}_MAST_4K_v1.png`.

## 4. HISTORIAL DE LOGROS (RESUMEN)

### Enero 2026 (Neo Era)

* [x] **Migración a v2.0**: Limpieza de directorios y eliminación de anidamiento `/frontend`.
* [x] **Master Creation**: Integración completa UI + Backend.
* [x] **Worker Limit Fix**: Optimización de recursos en Edge Functions.
* [x] **Forensic Vision**: Implementación de auditoría óptica en el pipeline.

## 5. REGLAS DE ORO (NEO PROTOCOL)

1. **No tocar el Core sin BBLA**: Consultar `/BBLAv2` antes de editar.
2. **Mobile First**: Todo componente debe funcionar en 375px de ancho.
3. **Snake_Case API**: Comunicación con IA siempre en `snake_case`.
4. **Zero Zombie**: Puertos 8081 fijos y limpios antes de arrancar.

---
*Documento vivo. Añadir nuevas sesiones al final.*

## 6. SESIONES POST-MIGRACIÓN

### 📝 SESIÓN: 2026-01-13 19:15

**Agente:** Antigravity (Assistant)
**Logros:**

* **Independencia Total (Island Model):** Se auditó y certificó que `luxscaler_v2` es autónomo. Eliminadas referencias a `LUXADMIN`.
* **Protocolo Agente v2:** Creado `B_PROTO_ANTIGRAVITY_AGENT.md` como Constitución Suprema.
* **Workflows Migrados:** `/sync`, `/idiomas` y Rules movidos a `luxscaler_v2/.agent` y actualizados.
* **Limpieza de Reglas:** Renombrado `luxadmin.md` -> `luxscaler_v2_rules.md` para coherencia.
* **Validación de Traducción:** Confirmada infraestructura `Locize` y scripts en `/scripts`.

**Cambios Técnicos:**

* [NEW] `luxscaler_v2/BBLAv2/3_PROTOCOLS/B_PROTO_ANTIGRAVITY_AGENT.md`
* [MOD] `luxscaler_v2/.agent/workflows/sync.md` (Enforce Single File)
* [MOD] `luxscaler_v2/.agent/workflows/translation_qa.md` (Rutas v2)
* [MOD] `luxscaler_v2/.agent/rules/luxscaler_v2_rules.md` (Refactor Total)
* [FIX] `src/services/locize.service.ts` (Env Vars fix `import.meta.env`)

### 📝 SESIÓN: 2026-01-14 00:05

**Agente:** Antigravity (Assistant)
**Logros:**

* **Auditoría de Paridad Total:** Sincronización 100% de componentes, servicios, hooks y utilidades desde el legado `LUXADMIN`.
* **Refinado UI Archives:** Visor responsivo "Borderless" (`object-cover`) y botón de zoom explícito.
* **Integración Master 4K v19.1:** Flujo de generación de Master activable desde el inspector de imágenes.
* **Migración de Herramientas:** `/upscale-tool` (`UpscalePage`) operativo en el nuevo entorno industrial.

**Cambios Técnicos:**

* [MOD] `src/components/ArchivesDashboard.tsx` (UI Refined)
* [MOD] `src/components/ImageInspectorModal.tsx` (Master Sculptor v19.1 integration)
* [NEW] `src/pages/UpscalePage.tsx` (Migrated from legacy)
* [SYNC] `src/services/` (Gemini, Auth, Payment) - Full parity.
* [SYNC] `src/utils/` (UpscaleEngine, StoragePaths) - Full parity.
* [SYNC] `public/locales/` (Full language support parity).

**Next Steps:**

* Pruebas de regresión total del pipeline 4K Master.
* Optimización de rendimiento en dispositivos móviles de gama baja.
* Cierre de auditoría y entrega de estado "Production Ready".

---

### 📝 SESIÓN: 2026-01-14 22:26

**Agente:** Antigravity (Assistant)
**Logros:**

* **Admin God Mode Implementado:** Panel completo para gestionar 7 tablas maestras de Supabase (photo/light/style/semantic/vision/global/audit).
* **Edges Editables:** Vista de relaciones entre tablas con CRUD desde `vision_trigger_overrides`.
* **Realtime Sync:** Suscripciones WebSocket para sincronización instantánea INSERT/UPDATE/DELETE.
* **GitHub Integration:** Repositorio `usajosefernan-cmd/luxscaler_v2` creado y sincronizado.
* **CI/CD Configurado:** GitHub Actions workflow para build + deploy automático a Netlify.
* **Workflow /gitsync:** Sincronización manual con GitHub en segundo plano.

**Cambios Técnicos:**

* [NEW] `src/components/admin/AdminGodMode.tsx` (617 líneas - Panel CRUD completo)
* [MOD] `src/components/AdminDashboard.tsx` (Tab GOD_MODE añadido)
* [MOD] `src/components/admin/layout/AdminSidebar.tsx` (Navegación Zap icon)
* [NEW] `.github/workflows/ci-cd.yml` (CI/CD Pipeline)
* [NEW] `.agent/workflows/gitsync.md` (Sync en segundo plano)
* [NEW] `scripts/auto_sync_github.ps1` (Watch mode cada 5 min)
* [DEL] `scripts/debug-stripe.ts` (Contenía API key)
* [DEL] `scripts/create_github_repo.ps1` (Contenía PAT)

**Next Steps:**

* Testing completo de CRUD en AdminGodMode.
* Documentar flujo de edges y cascade checks.
