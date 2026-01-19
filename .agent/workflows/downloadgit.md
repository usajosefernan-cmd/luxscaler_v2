---
description: Download code from GitHub (Force Overwrite) with Backup
---

# Download Git - Reseteo Seguro con Backup

// turbo-all

1. **Backup de Seguridad (Robocopy)**
   - Prepara nombre de carpeta: `../luxscaler_BACKUP_[FECHAHORA]`.
   - Ejecuta backup excluyendo carpetas pesadas:
     `robocopy . ../luxscaler_BACKUP_$(Get-Date -Format "yyyyMMdd_HHmmss") /E /XD node_modules .git .gemini dist`
   - *Nota:* Si robocopy devuelve código < 8, es éxito.

2. **Sincronización con Nube (GitHub)**
   - `git fetch origin`
   - `git reset --hard origin/main`
   - *Efecto:* Tus archivos rastreados (src, etc.) serán IDÉNTICOS a GitHub.
   - *Seguridad:* Tus archivos NO rastreados (.env, BBLA local) NO se borran.

3. **Restauración de Dependencias (Opcional)**
   - Si `package.json` cambió, podrías necesitar `npm install`.

4. **Reporte Final**
   - "✅ CÓDIGO ACTUALIZADO DESDE GITHUB. Backup guardado en carpeta superior."
