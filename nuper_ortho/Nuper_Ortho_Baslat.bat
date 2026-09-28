@echo off
title Nuper Ortho - Otonom Metroloji Istasyonu
echo =========================================================================
echo    NUPER ORTHO -- SOVEREIGN AUTONOMOUS METROLOGY SYSTEM (v1.0)
echo =========================================================================
echo.
echo Uygulama yerel masaustu penceresinde baslatiliyor...

set HTML_PATH=%~dp0ui\index.html
set EDGE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

if exist "%EDGE_PATH%" (
    start "" "%EDGE_PATH%" --app="file:///%HTML_PATH:\=/%" --window-size=1440,900
) else (
    start "" "%HTML_PATH%"
)

exit
