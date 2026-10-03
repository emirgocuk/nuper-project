import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

if (!process.versions.electron) {
  const { spawn } = await import('child_process');
  const electronPkg = await import('electron');
  const electronExe = electronPkg.default || electronPkg;

  const child = spawn(electronExe, [__filename], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  const { app, BrowserWindow } = await import('electron');

  app.whenReady().then(async () => {
    const win = new BrowserWindow({
      show: false,
      width: 1440,
      height: 900,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    const distPath = path.join(projectRoot, 'ui', 'dist', 'index.html');
    await win.loadFile(distPath);

    console.log('Canlı arayüz başlatıldı, 3 saniye bekleniyor...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Hız butonuna (5x) tıklama testi
    await win.webContents.executeJavaScript(`
      (() => {
        const btn5x = document.querySelector('button[data-speed="5.0"]') || document.querySelector('button[data-speed="5"]');
        if (btn5x) {
          btn5x.click();
        }
      })()
    `);

    // Hız değişimi sonrası akışı teyit etmek için 1 saniye daha bekle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const checkResult = await win.webContents.executeJavaScript(`
      (() => {
        const drawingContainer = document.getElementById('drawing-viewer-container');
        const cadViewport = document.getElementById('cad-viewport');
        const drawingCanvas = document.getElementById('drawing-viewport-canvas');
        const timeDisplay = document.getElementById('time-display');

        const simCtrl = window.nuperApp ? window.nuperApp.getCADViewer().getSimulationController() : null;
        const simState = simCtrl ? simCtrl.getState() : null;

        const drawingRect = drawingContainer ? drawingContainer.getBoundingClientRect() : { width: 0, height: 0 };
        const cadRect = cadViewport ? cadViewport.getBoundingClientRect() : { width: 0, height: 0 };

        return {
          drawingContainerRect: {
            width: Math.round(drawingRect.width),
            height: Math.round(drawingRect.height),
          },
          cadViewportRect: {
            width: Math.round(cadRect.width),
            height: Math.round(cadRect.height),
          },
          drawingCanvasDimensions: {
            width: drawingCanvas ? drawingCanvas.width : 0,
            height: drawingCanvas ? drawingCanvas.height : 0,
          },
          simProgress: simState ? simState.progress : 0,
          simPlaying: simState ? simState.isPlaying : false,
          simSpeed: simState ? simState.speedMultiplier : 0,
          timelineText: timeDisplay ? timeDisplay.innerText : '',
          isSimulating: !!window.isSimulating,
        };
      })()
    `);

    const screenshotDir = path.join(projectRoot, 'artifacts');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const screenshotPath = path.join(screenshotDir, 'live_ui_verification.png');
    const image = await win.webContents.capturePage();
    fs.writeFileSync(screenshotPath, image.toPNG());

    console.log('\n================ CANLI DOĞRULAMA ÇIKTISI ================');
    console.log('1. 2D PDF KANVAS ALANI (drawing-viewer-container):');
    console.log('   Width  : ' + checkResult.drawingContainerRect.width + 'px ' + (checkResult.drawingContainerRect.width > 300 ? '✅ (>300px PASS)' : '❌ FAIL'));
    console.log('   Height : ' + checkResult.drawingContainerRect.height + 'px');
    console.log('2. 3D CAD SAHNESİ (cad-viewport):');
    console.log('   Width  : ' + checkResult.cadViewportRect.width + 'px ' + (checkResult.cadViewportRect.width > 300 ? '✅ (>300px PASS)' : '❌ FAIL'));
    console.log('   Height : ' + checkResult.cadViewportRect.height + 'px');
    console.log('3. SİMÜLASYON DURUMU:');
    console.log('   simPlaying  : ' + (checkResult.simPlaying ? '✅ Oynatılıyor (PLAYING)' : '❌ DURDU'));
    console.log('   simProgress : ' + checkResult.simProgress.toFixed(4) + ' ' + (checkResult.simProgress > 0 ? '✅ (>0 PASS)' : '❌ FAIL'));
    console.log('   simSpeed    : ' + checkResult.simSpeed + 'x');
    console.log('   Timeline    : ' + checkResult.timelineText);
    console.log('4. EKRAN GÖRÜNTÜSÜ:');
    console.log('   Kaydedildi  : ' + screenshotPath);
    console.log('=========================================================\n');

    const pass = checkResult.drawingContainerRect.width > 300 &&
                 checkResult.cadViewportRect.width > 300 &&
                 checkResult.simProgress > 0;

    app.quit();
    process.exit(pass ? 0 : 1);
  });
}
