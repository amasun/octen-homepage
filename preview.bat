@echo off
chcp 65001 >nul
echo [Octen] 正在检查本地预览状态 (http://localhost:3001/)...

netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% == 0 (
    echo [Octen] 检测到开发服务已在运行，正在直接打开浏览器...
    start http://localhost:3001/
) else (
    echo [Octen] 正在启动开发服务并自动打开浏览器...
    start "" http://localhost:3001/
    call pnpm dev
)
