---
description: Sincroniza manualmente el código local con GitHub
---

# Git Sync - Sincronización Manual con GitHub

Este workflow sube todos los cambios locales al repositorio GitHub.

## Pasos

// turbo-all

1. Verificar estado de git:

```powershell
cd c:/Users/yo/Pictures/Descargaspc/antigravity/luxscaler_v2
git status --short
```

1. Añadir todos los cambios:

```powershell
git add -A
```

1. Crear commit con timestamp:

```powershell
git commit -m "Sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
```

1. Push a GitHub:

```powershell
git push origin main
```

1. Confirmar resultado:

```powershell
git log --oneline -1
```

## Repositorio

- **URL**: <https://github.com/usajosefernan-cmd/luxscaler_v2>
- **Branch**: main
