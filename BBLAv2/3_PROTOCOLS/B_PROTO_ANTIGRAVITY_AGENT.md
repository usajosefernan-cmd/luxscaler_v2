# 🛡️ PROTOCOLO AGENTE ANTIGRAVITY (CONSTITUCIÓN)

> **ESTADO:** VIGENTE (Enero 2026)
> **PRIORIDAD:** ROOT (Nivel Kernel)
> **ALCANCE:** Todos los Agentes (Humanos, AI, Híbridos)
> **FUENTE DE VERDAD:** Este documento prevalece sobre cualquier instrucción previa.

---

## 1. DIRECTIVA PRIMARIA (THE LAW)

1. **IDIOMA ESPAÑOL:** Toda comunicación, código, comentarios y documentación será **SIEMPRE EN ESPAÑOL**.
2. **SSOT (Single Source of Truth):**
    - La carpeta `/BBLAv2` es la **AUTORIDAD SUPREMA**.
    - **Protocolo de Lectura:** Antes de escribir una sola línea de código, CONSULTA la BBLA.
    - **Conflicto:** Si tu código contradice la BBLA, la BBLA gana. Si la BBLA está obsoleta, actualízala primero (Cascada).
3. **NO DESTRUCCIÓN:**
    - Jamás borres conocimiento histórico.
    - Si algo cambia, lo antiguo se mueve a `/_ARCHIVE` o `/OLD`.
4. **COMPORTAMIENTO DUAL:**
    - **Chat:** Breve, ejecutivo, militar.
    - **Docs:** Denso, técnico, exhaustivo.
5. **TEST-THEN-EXECUTE:** Analiza -> Prueba (Dry Run) -> Ejecuta -> Reporta.

---

## 2. ARQUITECTURA "THE ISLAND" (LuxScaler v2)

El proyecto `luxscaler_v2` es Soberano e Independiente.

### 2.1 Estructura Intocable

Todo vive dentro de: `C:\Users\yo\Pictures\Descargaspc\antigravity\LUXADMIN\luxscaler_v2\`

- **`/src`**: Código Fuente (React/Vite).
- **`/android` & `/ios`**: Contenedores Nativos Generados (NO BORRAR NI RECREAR MANUALMENTE).
- **`/scripts`**: Herramientas de automatización (`kill_zombies.ps1`, etc).
- **`.env`**: Secretos (No hardcodear keys en código).

### 2.2 Prohibiciones de Directorios

- **NO TOCAR** la carpeta raíz `LUXADMIN` (Proyecto padre obsoleto).
- **NO CREAR** archivos sueltos en la raíz del padre.
- **NO USAR** rutas absolutas (`C:/Users/...`). Siempre relativas (`@/` o `./`).

---

## 3. INFRAESTRUCTURA & PUERTOS (ANTI-ZOMBIE)

### 3.1 El Puerto Sagrado: 8081

La aplicación frontend corre ESTRICTAMENTE en el puerto **8081**.

### 3.2 Protocolo de Arranque

JAMÁS ejecutes `vite` directamente. Usa siempre el script de limpieza:

```powershell
# En /luxscaler_v2/
npm run dev
# (Esto invoca ./scripts/kill_zombies.ps1 para liberar el puerto primero)
```

### 3.3 Docker & WSL

- WSL limitado a 4GB RAM.
- Si Docker falla: Ejecutar `LUXADMIN/REPARAR_DOCKER.bat`.

---

## 4. DESPLIEGUE & AUTOMATIZACIÓN

### 4.1 Despliegue Móvil

Usa siempre los scripts definidos en `package.json`:

- `npm run cap:sync` (Sincronizar cambios web a nativo).
- `npm run deploy:android` (Generar App Bundle).

### 4.2 Despliegue Edge Functions (Supabase)

> **⚠️ IMPORTANTE:** Consulta `scripts/manual_deploy.ps1` antes de desplegar.

El proyecto usa un **Token Maestro** para actualizaciones automáticas sin login interactivo.

- **Método Estándar:** Ejecutar `./scripts/manual_deploy.ps1`.
- **¿Qué hace?**: Inyecta el token `sbp_...` y despliega todas las funciones.
- **¿Por qué?**: Evita errores de autenticación y timeouts en terminales remotas.

Si falla, revisa los logs de Supabase en el Dashboard.

### 4.3 Supabase Config

- **Project Ref:** `pjscnzymofaijevonxkm`
- **DB URL:** `postgres://postgres:SmyNs4b2EI6Dzs9Z@db.pjscnzymofaijevonxkm.supabase.co:6543/postgres`
- **JWT/Anon:** Ver `.env` o `manual_deploy.ps1`.

---

## 5. STORAGE & NOMENCLATURA (Omnibus v19.1)

### 5.1 Estructura de Archivos

El caos está prohibido. Usa esta jerarquía:
`{USER_ID}/{CONTEXT}/{YYYY-MM-DD}/{SESSION_ID}/{FILENAME}`

### 5.2 Naming Convention

- **Formato:** `snake_case` (siempre minúsculas, guiones bajos).
- **Prohibido:** Espacios, tildes, ñ, caracteres especiales.
- **Sufijos:** `_ORIG`, `_VAR`, `_MAST`.

---

## 6. WORKFLOW DEL AGENTE (TÚ)

### 6.1 Al Entrar (Onboarding)

1. Lee `B_MASTER_MEMORIA_V2.md`.
2. Lee este protocolo.
3. Revisa `task.md`.

### 6.2 Al Salir (Sync)

1. Ejecuta `/sync`.
2. Genera un "Save State" en la memoria.
3. Reporta identidad: "SYNC COMPLETADO (Agente: [Nombre])".

---

## 7. FILOSOFÍA DE DISEÑO

- **Mobile First Always:** Todo se diseña para pantalla móvil (Touch, Swipes, One-Hand).
- **UI Premium:** Oscuro (Black/Gold), Glassmorphism, Animaciones fluidas.
- **Nombres Prohibidos:** No usar nombres de proveedores reales, cortes o pliegos en el frontend visible.

---
> *"El código es efímero. La documentación es eterna."*
