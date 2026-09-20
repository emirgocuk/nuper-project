@echo off
title Nuper Citadel - Savunma Sanayii Kalifikasyon & Pre-FEA Istasyonu
cd /d "%~dp0"

echo ================================================================
echo   NUPER CITADEL - AIR-GAPPED SAVUNMA ISTASYONU
echo   Sifir Bulut Bagimliligi - Yerel Guvenli Muhendislik Modu
echo ================================================================

if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" scripts\desktop_launcher.py
) else (
    python scripts\desktop_launcher.py
)

pause
