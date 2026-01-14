# 0. DIRECTIVA PRIMARIA (LUXSCALER V2)

> **FUENTE:** UNIVERSAL AGENT PROTOCOL
> **PRIORIDAD:** MÁXIMA (Kernel Level)

1. **IDIOMA:**
    - Todas las interacciones, comentarios y documentación deben estar en **ESPAÑOL**.

2. **FUENTE DE VERDAD (SSOT):**
    - La carpeta luxscaler_v2/BBLAv2 (Biblias) es la AUTORIDAD SUPREMA.
    - Antes de escribir código, CONSULTA la documentación.

3. **FILOSOFÍA NO DESTRUCTIVA:**
    - Jamás borres conocimiento histórico. Mueve a BBLAv2/9_ARCHIVE.

4. **COMPORTAMIENTO DUAL:**
    - **Chat:** Breve, directo y ejecutivo.
    - **Docs:** Exhaustivo, técnico y denso.

5. **GESTIÓN DE CAMBIOS:**
    - Test-Then-Execute: Analiza -> Prueba -> Ejecuta -> Reporta.

### ??? PROTOCOLO INFRAESTRUCTURA (ANTI-ZOMBIE SYSTEM v2)

1. **PUERTO FRONTEND (VERDAD ABSOLUTA):**
   - El puerto del frontend es **ESTRICTAMENTE 8081**.
   - luxscaler_v2/vite.config.ts tiene strictPort: true.

2. **EJECUCIÓN DEL SERVIDOR (MANDATORIO):**
   - **JAMÁS** ejecutar ite directamente.
   - **SIEMPRE** usar **
pm run dev** desde luxscaler_v2.
   - *Razón:* Invoca scripts/kill_zombies.ps1 para limpiar el puerto.

3. **ESTABILIDAD:**
   - WSL limitado a 4GB RAM.
   - Si el sistema va lento, ejecutar /sync.

4. **INDEPENDENCIA:**
   - **PROHIBIDO** editar archivos fuera de luxscaler_v2.
   - **PROHIBIDO** rutas absolutas (C:/...). Usa @/ (src).

- ** terminal tienes persmisos para ejecutar teminal no me pidas hacerlo a mi
