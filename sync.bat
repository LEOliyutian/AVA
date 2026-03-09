@echo off
chcp 65001 >nul
title 同步 GitHub 最新代码

echo.
echo  ====================================
echo   同步 GitHub 最新代码
echo   仓库: LEOliyutian/AVA
echo  ====================================
echo.

cd /d %~dp0

:: 检查本地是否有未提交的改动
git diff --quiet && git diff --cached --quiet
if errorlevel 1 (
    echo [警告] 你有未提交的本地改动：
    git status --short
    echo.
    set /p CONFIRM="继续同步可能产生冲突，确认继续？(y/N): "
    if /i not "%CONFIRM%"=="y" (
        echo [取消] 请先用 push.bat 提交本地改动，再同步。
        pause
        exit /b 0
    )
    echo.
)

:: 拉取最新代码
echo [同步] 正在从 GitHub 拉取最新代码...
git pull origin main
if errorlevel 1 (
    echo.
    echo [错误] 同步失败，可能存在冲突，请手动处理。
    pause
    exit /b 1
)

echo.
echo  ====================================
echo   同步成功！代码已是最新版本。
echo  ====================================
echo.
pause
