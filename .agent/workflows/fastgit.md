---
description: Fast Git Hard Reset (NO BACKUP) - Instant Sync
---

# Fast Git Reset (Modo Turbo) ⚡

// turbo-all

> [!CAUTION]
> **ESTE COMANDO ES DESTRUCTIVO.**
> No hace copia de seguridad. Borrará cualquier cambio local en archivos rastreados inmediatamente.

1. **Liberación de Recursos**
   - Mata procesos de Node para evitar bloqueos.
   - `taskkill /F /IM node.exe` (Ignora error si no existe).

2. **Sync Instantáneo**
   - `git fetch origin`
   - `git reset --hard origin/main`

3. **Reinicio Rápido**
   - `npm run dev -- --port 8081`

4. **Reporte**
   - "⚡ CÓDIGO SINCRONIZADO (Sin Backup). Sistema reiniciado."
