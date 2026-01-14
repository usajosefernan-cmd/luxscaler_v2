# 📱 B_PROTOCOL_MOBILE_DEPLOYMENT (CAPACITOR)

> **ESTADO:** ACTIVO
> **PLATAFORMA:** Cross-Platform (React Native Vibe via Capacitor)
> **PRIORIDAD:** CRÍTICA (Canal de Distribución)
> **FECHA:** 2026-01-13

---

## 1. ARQUITECTURA "THE ISLAND" (v2.0)

LuxScaler v2 adopta el modelo de "Isla Soberana" para garantizar portabilidad total y desacoplamiento de LUXADMIN.

* **PROYECTO (`/luxscaler_v2/`)**: Contenedor maestro. Todo vive aquí dentro.
* **CONFIGURACIÓN (`/luxscaler_v2/capacitor.config.ts`)**: Archivo de configuración local.
* **NATIVOS (`/luxscaler_v2/android`, `/luxscaler_v2/ios`)**: Carpetas de compilación móvil generadas localmente.

> [!IMPORTANT]
> **Autonomía Total:** El proyecto no necesita subir a ninguna carpeta padre. Todo comando se ejecuta desde `luxscaler_v2`.

---

## 2. FLUJO DE DESPLIEGUE (WORKFLOW)

### Paso 1: Compilación Web (The Brain)

Genera el build de producción en `./dist`.

```powershell
# En /luxscaler_v2/
npm run build
```

### Paso 2: Sincronización (The Body)

Inyecta los assets web en los contenedores nativos locales.

```powershell
# En /luxscaler_v2/
npm run cap:sync
# (Alias para: npx cap sync)
```

### Paso 3: Compilación Nativa

#### 🤖 Android (Automated)

Genera el App Bundle (.aab) listo para Play Store.

```powershell
# En /luxscaler_v2/
npm run deploy:android
# Ejecuta: cd android && ./gradlew publishBundle
```

#### 🍎 iOS (Manual)

Prepara el proyecto Xcode workspace.

```powershell
# En /luxscaler_v2/
npm run cap:open:ios
```

---

## 3. SCRIPTS DE AUTOMATIZACIÓN

| Comando | Acción | Contexto |
| :--- | :--- | :--- |
| `npm run build` | Compila React a `/dist`. | Local |
| `npm run cap:sync` | Sincroniza `/dist` -> Android/iOS. | Local |
| `npm run deploy:android` | Genera binario Android release. | Local |

---

> "LuxScaler v2 es soberano. Su código es su ley, y su carpeta su territorio."
> — **LuxScaler Mobile Team**
