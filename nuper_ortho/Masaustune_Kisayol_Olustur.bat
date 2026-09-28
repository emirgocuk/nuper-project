@echo off
title Nuper Ortho - Masaustu Kisayolu Olusturucu
echo =========================================================================
echo    NUPER ORTHO -- MASAUSTU KISAYOLU OLUSTURULUYOR...
echo =========================================================================
echo.

set SCRIPT_DIR=%~dp0
set TARGET_HTML=%SCRIPT_DIR%ui\index.html
set EDGE_EXE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desk = [Environment]::GetFolderPath('Desktop'); $sc = $ws.CreateShortcut(\"$desk\Nuper Ortho 3D.lnk\"); if (Test-Path '%EDGE_EXE%') { $sc.TargetPath = '%EDGE_EXE%'; $sc.Arguments = '--app=\"file:///' + ('%TARGET_HTML%'.Replace('\', '/')) + '\" --window-size=1440,900'; } else { $sc.TargetPath = '%TARGET_HTML%'; } $sc.WorkingDirectory = '%SCRIPT_DIR%'; $sc.Description = 'Nuper Ortho Sovereign Autonomous Metrology System'; $sc.Save(); Write-Host 'Tebrikler! Masaustune \"Nuper Ortho 3D\" kisayolu eklendi.' -ForegroundColor Green"

echo.
echo Islem tamamlandi! Masaustunuzdeki "Nuper Ortho 3D" simgesine cift tiklayarak
echo uygulamayi istediginiz zaman acabilirsiniz.
echo.
pause
