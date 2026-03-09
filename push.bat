@echo off
chcp 65001 >nul
title 一键提交 GitHub

echo.
echo  ====================================
echo   一键提交 GitHub
echo   仓库: LEOliyutian/AVA
echo  ====================================
echo.

cd /d %~dp0

:: 显示当前改动
echo [状态] 当前改动文件：
git status --short
echo.

:: 询问提交信息
set /p MSG="请输入提交说明（回车使用自动生成）: "

if "%MSG%"=="" (
    :: 自动生成：日期 + 简短摘要
    for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set D=%%a-%%b-%%c
    for /f "tokens=1 delims=: " %%a in ("%time%") do set T=%%a
    set MSG=update: %D% %T%点提交
)

echo.
echo [提交信息] %MSG%
echo.

:: 暂存所有改动
git add -A
if errorlevel 1 (
    echo [错误] git add 失败
    pause
    exit /b 1
)

:: 提交
git commit -m "%MSG%"
if errorlevel 1 (
    echo [提示] 没有新内容需要提交
    pause
    exit /b 0
)

:: 推送
echo.
echo [推送] 正在推送到 GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo [错误] 推送失败，请检查网络或登录状态
    pause
    exit /b 1
)

echo.
echo  ====================================
echo   提交成功！
echo   https://github.com/LEOliyutian/AVA
echo  ====================================
echo.
pause
