
# scripts/fast_sync.ps1
# Automating the Sync Process: Append Memory + Clean Cache

param (
    [string]$ReportFile = "B_SESSION_REPORT_TEMP.md",
    [string]$MasterMemoryPath = "BBLAv2/0_MASTER_MEMORIA/B_MASTER_MEMORIA_V2.md"
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host "🚀 STARTING FAST SYNC..." -ForegroundColor Cyan

# 1. Validate Report Exists
if (-not (Test-Path $ReportFile)) {
    Write-Error "❌ Report file '$ReportFile' not found."
    exit 1
}

# 2. Append to Master Memory
try {
    Write-Host "📝 Appending to Master Memory..." -ForegroundColor Yellow
    $Content = Get-Content $ReportFile -Raw
    Add-Content -Path $MasterMemoryPath -Value "`n$Content"
    Write-Host "✅ Memory Updated." -ForegroundColor Green
}
catch {
    Write-Error "❌ Failed to update memory: $_"
    exit 1
}

# 3. Clean Cache (Anti-Lag)
Write-Host "🧹 Cleaning Cache (Anti-Lag)..." -ForegroundColor Yellow
Remove-Item -Path "node_modules/.vite" -Recurse -Force
Remove-Item -Path "node_modules/.cache" -Recurse -Force
Write-Host "✅ Cache Cleaned." -ForegroundColor Green

# 4. Cleanup Temp File
Remove-Item $ReportFile -Force
Write-Host "🗑️ Temp report deleted." -ForegroundColor Gray

Write-Host "✨ SYNC COMPLETED SUCCESSFULLY." -ForegroundColor Cyan
