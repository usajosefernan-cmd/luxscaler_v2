---
description: Workflow para sincronizar el estado del proyecto, archivar memoria y limpiar contexto.
---

# Workflow de Sincronización (/sync)

Este workflow implementa el "Workflow de Memoria" definido en el Protocolo Universal de Agente, optimizado para la persistencia técnica absoluta.

## Pasos

// turbo-all

// turbo-all

1. **Generación de Reporte (Brain)**
    - Genera el contenido del reporte en `B_SESSION_REPORT_TEMP.md` (no preguntes, solo hazlo).
    - Usa el formato detallado ("QUÉ y POR QUÉ").

2. **Ejecución "One-Shot" (Action)**
    - Ejecuta: `powershell -ExecutionPolicy Bypass -File scripts/fast_sync.ps1`
    - Este script hace TODO:
        - Valida el reporte.
        - Lo inyecta en `B_MASTER_MEMORIA_V2.md`.
        - Borra `node_modules/.vite` y `.cache` (Anti-Lag).
        - Borra el reporte temporal.
        - Imprime confirmaición.

3. **Notificación Final**
    - Confirma al usuario: "SYNC RAPIDO COMPLETADO 🚀".

## Comandos Útiles

- Fast Sync: `powershell -ExecutionPolicy Bypass -File scripts/fast_sync.ps1`

> **FILOSOFÍA:** VELOCIDAD ABSOLUTA. CERO PREGUNTAS. EJECUCIÓN ATÓMICA.
