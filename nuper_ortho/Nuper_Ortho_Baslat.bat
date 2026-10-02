@echo off
setlocal
cd /d "%~dp0"
title Nuper Ortho - Otonom Metroloji Istasyonu

echo =========================================================================
echo    NUPER ORTHO -- SOVEREIGN AUTONOMOUS METROLOGY SYSTEM (v1.0)
echo =========================================================================
echo.
echo Uygulama baslatiliyor...

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

set "ELECTRON_EXE=%ROOT_DIR%\node_modules\electron\dist\electron.exe"

if exist "%ELECTRON_EXE%" (
    start "" "%ELECTRON_EXE%" "%ROOT_DIR%"
    goto :done
)

:: Electron dist bulunamazsa npx ile baslat
where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "" npx electron "%ROOT_DIR%"
    goto :done
)

:: Son alternatif tarayici modu
start "" "%ROOT_DIR%\ui\index.html"

:done
exit /b 0

