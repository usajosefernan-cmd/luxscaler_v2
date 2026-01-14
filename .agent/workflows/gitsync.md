---
description: Sincroniza manualmente el código local con GitHub
---

# Git Sync - Sincronización Rápida con GitHub

## Ejecución en Segundo Plano

// turbo

1. Sync instantáneo (background):

```powershell
Start-Job -ScriptBlock { Set-Location 'c:/Users/yo/Pictures/Descargaspc/antigravity/luxscaler_v2'; git add -A; git commit -m "Sync $(Get-Date -Format 'HH:mm')"; git push origin main 2>&1 } | Out-Null; Write-Host "Sync en background..."
```

## Repositorio

- **URL**: <https://github.com/usajosefernan-cmd/luxscaler_v2>
- **Branch**: main
