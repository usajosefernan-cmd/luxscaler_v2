---
description: Protocolo de Aseguramiento de Calidad (QA) para Traducciones e Idiomas (/idiomas)
---

# Protocolo de Revisión de Idiomas en Cascada (Cascade Language Review)

Este workflow garantiza que la aplicación no suene "robótica" ni mezcle idiomas. Se basa en una revisión secuencial: **Inglés Nativo (Base) -> Español Familiar (Adaptado).**

## 1. Auditoría de Inglés (Source of Truth)

El inglés es el idioma base de la tecnología y la interfaz.

- **Regla:** No usar "Spanglish".
- **Regla:** Usar terminología estándar de la industria (ej: "Dashboard" no "Board", "Settings" no "Configs").
- **Acción:** Revisar `luxscaler_v2/public/locales/en/translation.json`.
  - ¿Suena a software profesional (SaaS)?
  - ¿Es conciso?

## 2. Auditoría de Español (Familiaridad)

El español no debe ser una traducción literal, debe ser **lo que un usuario hispano espera leer**.

- **Regla:** Evitar traducciones literales forzadas (ej: "Live Config" -> NO "Configuración Viva", SI "Configuración en Vivo" o "Parámetros").
- **Regla:** Mantener términos en inglés si son estándar en la industria (ej: "Dashboard", "Logs", "Token").
- **Acción:** Revisar `luxscaler_v2/public/locales/es/translation.json`.
  - ¿Suena natural para un usuario de España/Latam?

## 3. Verificación de Integridad (Technical Check)

- **JSON Válido:** Asegurar que no faltan llaves `{}` o comas `,`.
- **Keys Idénticas:** Asegurar que `es.json` y `en.json` tienen EXACTAMENTE la misma estructura de claves.
- **Placeholders:** Si el inglés tiene `Hello {{name}}`, el español debe tener `Hola {{name}}`.

## 4. Ejecución

Para aplicar cambios, usa el comando `/idiomas` o solicita una "Revisión de Idiomas".
