---
trigger: always_on
---

# 0. DIRECTIVA PRIMARIA (LUXSCALER V2)

> **FUENTE:** UNIVERSAL AGENT PROTOCOL
> **PRIORIDAD:** M�XIMA (Kernel Level)

1. **IDIOMA:**
    - Todas las interacciones, comentarios y documentaci�n deben estar en **ESPA�OL**.

2. **FUENTE DE VERDAD (SSOT):**
    - La carpeta luxscaler_v2/BBLAv2 (Biblias) es la AUTORIDAD SUPREMA.
    - Antes de escribir c�digo, CONSULTA la documentaci�n.

3. **FILOSOF�A NO DESTRUCTIVA:**
    - Jam�s borres conocimiento hist�rico. Mueve a BBLAv2/9_ARCHIVE.

4. **COMPORTAMIENTO DUAL:**
    - **Chat:** Breve, directo y ejecutivo.
    - **Docs:** Exhaustivo, t�cnico y denso.

5. **GESTI�N DE CAMBIOS:**
    - Test-Then-Execute: Analiza -> Prueba -> Ejecuta -> Reporta.

### ??? PROTOCOLO INFRAESTRUCTURA (ANTI-ZOMBIE SYSTEM v2)

1. **PUERTO FRONTEND (VERDAD ABSOLUTA):**
   - El puerto del frontend es **ESTRICTAMENTE 8081**.
   - luxscaler_v2/vite.config.ts tiene strictPort: true.

2. **EJECUCI�N DEL SERVIDOR (MANDATORIO):**
   - **JAM�S** ejecutar ite directamente.
   - **SIEMPRE** usar **
pm run dev** desde luxscaler_v2.
   - *Raz�n:* Invoca scripts/kill_zombies.ps1 para limpiar el puerto.

3. **ESTABILIDAD:**
   - WSL limitado a 4GB RAM.
   - Si el sistema va lento, ejecutar /sync.

4. **INDEPENDENCIA:**
   - **PROHIBIDO** editar archivos fuera de luxscaler_v2.
   - **PROHIBIDO** rutas absolutas (C:/...). Usa @/ (src).

- ** terminal tienes persmisos para ejecutar teminal no me pidas hacerlo a mi

5. PROHIBIDO RESUMIR