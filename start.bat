@echo off
title 雪崩预报系统 - 启动中...
echo.
echo  ====================================
echo   雪崩预报系统 一键启动
echo  ====================================
echo.

:: 检查 node_modules
if not exist "node_modules" (
    echo [前端] 首次运行，安装依赖中...
    call npm install
)
if not exist "server\node_modules" (
    echo [后端] 首次运行，安装依赖中...
    cd server && call npm install && cd ..
)

:: 初始化数据库（如果尚未初始化）
if not exist "server\data\avalanche.db" (
    echo [后端] 初始化数据库...
    cd server && call npx tsx src/db/init.ts && cd ..
)

echo.
echo [启动] 后端服务 ^(端口 3001^)...
start "后端 - Express:3001" cmd /k "cd /d %~dp0server && npm run dev"

echo [等待] 后端启动中...
timeout /t 2 /nobreak >nul

echo [启动] 前端服务 ^(端口 5173^)...
start "前端 - Vite:5173" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo  ====================================
echo   服务已启动！
echo   前端: http://localhost:5173
echo   后端: http://localhost:3001/api
echo  ====================================
echo.
echo  关闭两个黑色命令窗口即可停止服务
echo.
pause
