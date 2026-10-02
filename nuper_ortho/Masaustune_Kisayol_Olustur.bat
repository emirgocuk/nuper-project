@echo off
title Nuper Ortho - Masaustu Kisayolu Olusturucu
echo =========================================================================
echo    NUPER ORTHO -- MASAUSTU KISAYOLU OLUSTURULUYOR...
echo =========================================================================
echo.

set SCRIPT_DIR=%~dp0
set "CLEAN_DIR=%SCRIPT_DIR%"
if "%CLEAN_DIR:~-1%"=="\" set "CLEAN_DIR=%CLEAN_DIR:~0,-1%"
set ELECTRON_EXE=%CLEAN_DIR%\node_modules\electron\dist\electron.exe
set TARGET_HTML=%CLEAN_DIR%\ui\index.html
set BAT_FILE=%CLEAN_DIR%\Nuper_Ortho_Baslat.bat

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desk = [Environment]::GetFolderPath('Desktop'); $sc = $ws.CreateShortcut(\"$desk\Nuper Ortho 3D.lnk\"); if (Test-Path '%ELECTRON_EXE%') { $sc.TargetPath = '%ELECTRON_EXE%'; $sc.Arguments = '\"%CLEAN_DIR%\"'; } else { $sc.TargetPath = '%BAT_FILE%'; } $sc.WorkingDirectory = '%CLEAN_DIR%'; $sc.Description = 'Nuper Ortho Sovereign Autonomous Metrology System'; $sc.Save(); Write-Host 'Tebrikler! Masaustune \"Nuper Ortho 3D\" masaustu kisayolu eklendi.' -ForegroundColor Green"

echo.
echo Islem tamamlandi! Masaustunuzdeki "Nuper Ortho 3D" simgesine cift tiklayarak
echo uygulamayi gercek cercevesiz masaustu CAD istasyonu olarak acabilirsiniz.
echo.
pause
