---
description: Protocolo de arranque rápido para sincronizar al agente con el estado actual del proyecto.
---

# /boot - Protocolo de Arranque Antigravity

## Objetivo

Sincronizar al agente con el estado actual del proyecto LuxScaler v2 al iniciar una nueva sesión.

## Pasos Automáticos

// turbo-all

1. Leer el archivo `_STATUS.md` en la raíz del proyecto para conocer:
   - Tarea actual
   - Últimas acciones completadas
   - Pendientes
   - Último error conocido

2. Verificar el estado del servidor de desarrollo:

   ```powershell
   netstat -ano | findstr :8081
   ```

3. Confirmar que el archivo `.cursorrules` existe y contiene las Hard Rules.

4. Reportar al usuario:
   - Estado del proyecto
   - Puerto activo
   - Próximos pasos recomendados

## Uso

Cuando inicies una nueva sesión, simplemente escribe:

- `/boot`
- O: "Lee _STATUS.md y ponte al día"
- O: "Sincronízate con el proyecto"

## Notas

- El agente actualizará `_STATUS.md` automáticamente al completar tareas importantes.
- El comando `/sync` archiva el estado anterior y limpia para una nueva tarea.
