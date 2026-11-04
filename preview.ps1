# Octen Homepage 快速预览脚本
Write-Host "[Octen] 检查本地预览状态 (http://localhost:3001/)..." -ForegroundColor Cyan

$portActive = (Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue)

if ($portActive) {
    Write-Host "[Octen] 检测到开发服务已在运行，正在直接打开浏览器..." -ForegroundColor Green
    Start-Process "http://localhost:3001/"
} else {
    Write-Host "[Octen] 正在启动开发服务并自动打开浏览器..." -ForegroundColor Green
    Start-Process "http://localhost:3001/"
    pnpm dev
}
