# 📊 PLAN DE IMPLEMENTACIÓN: SQL PROMPT CONSTRUCTOR

**Última Actualización:** 2026-01-14 20:43
**Estado Global:** Fase 2 y 4 Completadas, Fase 3 Pendiente

---

## ✅ FASE 1: DB Architecture & Seed Data — COMPLETADA

| # | Tarea | Estado |
|---|-------|--------|
| 1.1 | Migración SQL Maestra (Schema) | ✅ |
| 1.2 | Ingesta de Datos Semilla (v15) | ✅ |
| 1.3 | Ejecución de Migración (Edge Function Tunnel) | ✅ |

### Tablas en Producción (Supabase)

| Tabla | Registros | Datos Clave |
|-------|-----------|-------------|
| `photoscaler_prompt_rules` | 3 | Niveles 1-3, 4-7, 8-10 (FORENSIC) |
| `lightscaler_prompt_rules` | 6 | sombras + identity + 3 estilos |
| `stylescaler_prompt_rules` | 3 | guidance_scale 5.0 → 12.0 |
| `global_prompt_config` | 3 | master_negative (1297 chars) |
| `semantic_material_rules` | 5 | SKIN, IRIS, FABRIC x2, METAL |
| `vision_trigger_overrides` | 5 | Triggers automáticos |
| **TOTAL** | **25** | |

---

## ✅ FASE 2: Middleware Logic — COMPLETADA

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 2.1 | Crear `sqlPromptBuilder.ts` | ✅ | Interfaces + lógica de ensamblaje |
| 2.2 | Refactorizar `preview-generator` | ✅ | Consultas paralelas a tablas |
| 2.3 | Desplegar Edge Functions | ✅ | LaoZhang API verificada |
| 2.4 | Migración v15 Completa | ✅ | 25 registros insertados |
| 2.5 | Verificación de APIs | ✅ | Nano Banana Pro activo |

---

## ⏳ FASE 3: UI Adaptation — PENDIENTE

| # | Tarea | Estado | Descripción |
|---|-------|--------|-------------|
| 3.1 | `effective_sliders` en frontend | ⬜ | Backend devuelve sliders modificados |
| 3.2 | `active_triggers` feedback | ⬜ | Badge de intervención IA |
| 3.3 | Vision Overrides en UI | ⬜ | Animar sliders cuando sistema ajusta |

### Componentes a Crear

- [ ] `AiInterventionBadge.tsx` — Notificación visual de override
- [ ] Hook `useEffectiveSliders()` — Sincroniza estado con backend
- [ ] Modificar `usePreview.ts` — Recibir metadata con sliders efectivos

---

## ✅ FASE 4: Admin Dashboard (God Mode) — COMPLETADA

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 4.1 | Crear `AdminGodMode.tsx` | ✅ | Componente principal |
| 4.2 | Introspección Dinámica de Schema | ✅ | Lee tablas desde Supabase |
| 4.3 | Suscripciones Realtime | ✅ | INSERT/UPDATE/DELETE sync |
| 4.4 | CRUD Completo | ✅ | Create, Update, Delete filas |
| 4.5 | Vista de Edges | ✅ | Visualiza relaciones entre tablas |
| 4.6 | Integrar en AdminDashboard | ✅ | Nueva tab + sidebar nav |

### Archivos Creados/Modificados

| Archivo | Cambio |
|---------|--------|
| `src/components/admin/AdminGodMode.tsx` | **NUEVO** - Componente principal |
| `src/components/AdminDashboard.tsx` | Import + tab render |
| `src/components/admin/layout/AdminSidebar.tsx` | Nav con icono Zap |

### Acceso

```
Admin Dashboard → Sidebar → SYSTEM → God Mode (⚡)
```

---

## 🧪 PLAN DE VERIFICACIÓN (QA)

### A. Pruebas de Datos (SQL)

- [ ] Long Text Query: SELECT de prompt largo sin truncar
- [ ] Trigger Audit: Modificar regla y verificar `prompt_audit_log`

### B. Pruebas de Lógica (Dry Run)

| Escenario | Input | Output Esperado |
|-----------|-------|-----------------|
| Foto Perfecta | Sliders=5, Vision="OK" | Sliders=5, Prompts normales |
| Desastre Forense | Sliders=1, Vision="Underexposed+Blur" | Light→9, Photo→10 |
| Food Porn | Vision="FOOD" | Inyección de materials comida |

### C. Verificación Visual (E2E)

- [ ] Subir imagen oscura → Slider "Sombras" salta automáticamente
- [ ] Verificar estética "Blue Hour" en resultado

---

## 🔧 COMANDOS ÚTILES

```powershell
# Desplegar Edge Function
$env:SUPABASE_ACCESS_TOKEN="sbp_04adaab0d1790b65a2307f342826f4b51c16e466"
npx supabase functions deploy migration-runner --project-ref pjscnzymofaijevonxkm --no-verify-jwt

# Ejecutar migración
powershell -File scripts/trigger_migration.ps1

# Verificar conteos
powershell -File scripts/count_rows.ps1

# Auditar datos
powershell -File scripts/audit_all_tables.ps1
```

---

## 📁 ARCHIVOS CLAVE

| Archivo | Propósito |
|---------|-----------|
| `supabase/functions/migration-runner/index.ts` | Ejecuta SQL via Edge Function |
| `supabase/migrations/HARD_RESET_v15_PRODUCTION.sql` | SQL completo para Dashboard |
| `scripts/count_rows.ps1` | Verifica conteo de registros |
| `BBLAv2/TABLAS/*.md` | Fuente de verdad para datos |
| `src/components/admin/AdminGodMode.tsx` | Panel admin "God Mode" |

---

## 📝 NOTAS DE SESIÓN

- **2026-01-14 20:43**: **Fase 4 completada.** Admin Dashboard "God Mode" implementado con:
  - Introspección dinámica de schema desde Supabase
  - Suscripciones Realtime para sync automático
  - CRUD completo para las 7 tablas maestras
  - Vista de Edges mostrando relaciones
  - Integrado en navegación del Admin Dashboard
- **2026-01-14 17:10**: Migración v15 completada. 25 registros insertados via Edge Function Tunnel.
- Los campos TEXT contienen el protocolo v15 completo (no truncado).
- El Table Editor de Supabase trunca visualmente pero los datos están completos.
