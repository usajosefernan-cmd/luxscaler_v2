---
description: Workflow para sincronizar el estado del proyecto, archivar memoria y limpiar contexto.
---

# Workflow de Sincronización (/sync)

Este workflow implementa el "Workflow de Memoria" definido en el Protocolo Universal de Agente, optimizado para la persistencia técnica absoluta.

## Pasos

1. **Lectura de Estado (Read-First)**
    - Lee `BBLAv2/0_MASTER_MEMORIA/B_MASTER_MEMORIA_V2.md`.
    - Entiende el contexto actual y la última entrada de sesión.

2. **Escritura Acumulativa (Single File)**
    - **OBJETIVO:** `BBLAv2/0_MASTER_MEMORIA/B_MASTER_MEMORIA_V2.md`.
    - **ACCIÓN:** Añade una nueva entrada al final del archivo (SECCIÓN 6).
    - **PROHIBIDO:** Crear archivos nuevos tipo `B_Memoria_2026...md`. Solo existe UN archivo.

    **Formato de Entrada:**

    ```markdown
    ### 📝 SESIÓN: [YYYY-MM-DD HH:MM]
    **Agente:** [Nombre]
    **Logros:** [Bullets claros]
    **Cambios Técnicos:** [Rutas, Archivos, APIs]
    **Next:** [Siguiente paso lógico]
    ```

3. **Limpieza (Housekeeping)**
    - Si generaste algún reporte temporal en `BBLAv2` o raíz, MUÉVELO a `BBLAv2/9_ARCHIVE`.
    - La carpeta `BBLAv2` debe quedar limpia, solo con carpetas y la Master Memoria.

4. **Notificación**
    - Confirma: "SYNC COMPLETADO. Memoria Maestra actualizada."

## Comandos Útiles

- Fecha: `cmd /c "echo %DATE% %TIME%"`
- Master Path: `luxscaler_v2/BBLAv2/0_MASTER_MEMORIA/B_MASTER_MEMORIA_V2.md`

> **REGLA DE ORO:** 1 Proyecto = 1 Archivo de Memoria. No fragmentación.
