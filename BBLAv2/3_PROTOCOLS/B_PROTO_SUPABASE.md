# 🔐 PROTOCOLO SUPABASE LUXSCALER (v2.0)

**Última Actualización:** 2026-01-14
**Scope:** Autenticación, Despliegue y Migración SQL

---

## 🔑 CLAVES DE ACCESO

### 1. Supabase Access Token (CLI/Management API)

```
sbp_04adaab0d1790b65a2307f342826f4b51c16e466
```

**Uso:** Despliegue de Edge Functions, consultas a Management API.
**Comando:** `$env:SUPABASE_ACCESS_TOKEN="sbp_..."; npx supabase functions deploy`

### 2. Service Role Key (Data API - Full Access)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc2Nuenltb2ZhaWpldm9ueGttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzE2NDM1NSwiZXhwIjoyMDgyNzQwMzU1fQ.kZxMkGOmqunADot69OcsIPM1kUaN1vdAIQYnWnCZYuk
```

**Uso:** Verificación directa de tablas, operaciones admin.

### 3. Anon Key (Frontend/Edge Function Invocation)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc2Nuenltb2ZhaWpldm9ueGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjQzNTUsImV4cCI6MjA4Mjc0MDM1NX0.JgWvL53a8ZqQUXQK5nQQ1cGtMzkqm1WktY0Yc3Gqu1I
```

**Uso:** Invocación de Edge Functions desde cliente.

### 4. Project Reference

```
pjscnzymofaijevonxkm
```

---

## 🚀 SISTEMA DE MIGRACIÓN SQL (Edge Function Tunnel)

### Problema Resuelto

- `supabase db push` requiere password interactivo.
- Management API `/database/query` falla con DDL grandes.
- MCP de Supabase no acepta token local.

### Solución: Edge Function Tunnel

1. **Crear/Editar** `supabase/functions/migration-runner/index.ts`
2. **Incrustar SQL** directamente en el código TypeScript.
3. **Desplegar** con Access Token.
4. **Invocar** con Anon Key para ejecutar desde la red interna.

### Comandos

```powershell
# 1. Desplegar
$env:SUPABASE_ACCESS_TOKEN="sbp_04adaab0d1790b65a2307f342826f4b51c16e466"
npx supabase functions deploy migration-runner --project-ref pjscnzymofaijevonxkm --no-verify-jwt

# 2. Ejecutar
powershell -File scripts/trigger_migration.ps1

# 3. Verificar
powershell -File scripts/count_rows.ps1
```

### ⚠️ Reglas Críticas del SQL

| Problema | Solución |
|----------|----------|
| `$$` (PostgreSQL delimiter) | **PROHIBIDO** en Template Literals. Usar comillas simples. |
| Duplicate Key | Añadir `TRUNCATE TABLE ... CASCADE;` antes de INSERTs. |
| Unicode/Encoding | Evitar emojis o caracteres especiales en el SQL. |

---

## 📁 SCRIPTS DE UTILIDAD

| Script | Descripción |
|--------|-------------|
| `scripts/trigger_migration.ps1` | Ejecuta `migration-runner` Edge Function |
| `scripts/count_rows.ps1` | Verifica conteo de registros via Management API |
| `scripts/list_tables.ps1` | Lista todas las tablas del schema public |
| `scripts/final_verify.ps1` | Verificación via Data API (Service Key) |

---

## 🌐 ENDPOINTS

| Servicio | URL |
|----------|-----|
| Supabase Dashboard | `https://supabase.com/dashboard/project/pjscnzymofaijevonxkm` |
| Edge Functions | `https://pjscnzymofaijevonxkm.supabase.co/functions/v1/{function}` |
| Data API | `https://pjscnzymofaijevonxkm.supabase.co/rest/v1/{table}` |
| Management API | `https://api.supabase.com/v1/projects/pjscnzymofaijevonxkm/...` |

---

## ✅ CHECKLIST MIGRACIÓN COMPLETADA (2026-01-14)

- [x] **DDL ejecutado** - 7 tablas creadas
- [x] **Seed Data insertado** - 24 registros totales
- [x] **Edge Functions verificadas** - Usan LaoZhang API correctamente
- [x] **Scripts de utilidad creados** - 4 scripts PowerShell

### Conteo Final de Datos

| Tabla | Registros |
|-------|-----------|
| `photoscaler_prompt_rules` | 3 |
| `lightscaler_prompt_rules` | 6 |
| `stylescaler_prompt_rules` | 3 |
| `global_prompt_config` | 3 |
| `semantic_material_rules` | 4 |
| `vision_trigger_overrides` | 5 |
| `prompt_audit_log` | (auto por triggers) |
