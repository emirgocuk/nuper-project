@echo off
setlocal
cd /d "%~dp0"
title Nuper Ortho - Gelistirme Modu (Vite + Electron)

echo =========================================================================
echo    NUPER ORTHO -- GELISTIRME MODU (HOT RELOAD)
echo =========================================================================
echo.
echo   Vite dev sunucusu: http://localhost:5173
echo   ui/src altindaki her kaydetme aninda uygulanir.
echo   Cikmak icin bu pencereyi kapatin.
echo.

call npm run dev
