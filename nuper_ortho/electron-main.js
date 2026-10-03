const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: "Nuper Ortho — Sovereign Autonomous Metrology System",
    backgroundColor: '#0F172A',
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      plugins: true
    }
  });

  const distIndexPath = path.join(__dirname, 'ui', 'dist', 'index.html');
  mainWindow.loadFile(distIndexPath);

  // Shortcuts: F5 / Ctrl+R to reload, F12 to toggle DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) {
        mainWindow.reload();
        event.preventDefault();
      } else if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
        mainWindow.webContents.toggleDevTools();
        event.preventDefault();
      }
    }
  });

  // Window control IPCs
  ipcMain.on('window-minimize', () => mainWindow && mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow && mainWindow.close());

  // Native CAD File Chooser IPC
  ipcMain.handle('select-cad-file', async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Metroloji İçin CAD / Katı Model Seçin',
      buttonLabel: 'Modeli Yükle',
      properties: ['openFile'],
      filters: [
        { name: 'Tüm Desteklenen CAD Formatları (*.step, *.stp, *.stl, *.obj)', extensions: ['step', 'stp', 'stl', 'obj'] },
        { name: 'STEP / STP Katı Modelleri (*.step, *.stp)', extensions: ['step', 'stp'] },
        { name: 'STL 3D Yüzey Ağı (*.stl)', extensions: ['stl'] },
        { name: 'Wavefront OBJ (*.obj)', extensions: ['obj'] },
        { name: 'Tüm Dosyalar (*.*)', extensions: ['*'] }
      ]
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0];
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const name = path.basename(filePath);
    const buf = await fs.promises.readFile(filePath);

    return {
      filePath,
      name,
      ext,
      size: buf.length,
      dataText: (ext === 'step' || ext === 'stp' || ext === 'obj') ? buf.toString('utf8') : null,
      dataBase64: buf.toString('base64')
    };
  });

  // Native Drawing File Chooser IPC
  ipcMain.handle('select-drawing-file', async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      title: '2D Teknik Resim Seçin (PDF / Görsel)',
      buttonLabel: 'Teknik Resmi Yükle',
      properties: ['openFile'],
      filters: [
        { name: 'Tüm Teknik Resimler (*.pdf, *.png, *.jpg, *.jpeg, *.svg)', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'svg'] },
        { name: 'PDF Teknik Resimler (*.pdf)', extensions: ['pdf'] },
        { name: 'Görsel Formatlar (*.png, *.jpg, *.jpeg, *.svg)', extensions: ['png', 'jpg', 'jpeg', 'svg'] }
      ]
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0];
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const name = path.basename(filePath);
    const buf = await fs.promises.readFile(filePath);

    return {
      filePath,
      name,
      ext,
      size: buf.length,
      dataBase64: buf.toString('base64')
    };
  });

  // Extract Metrology Data & Dimensions from 2D Drawing
  ipcMain.handle('extract-drawing-data', async (event, targetPath) => {
    try {
      const { execFile } = require('child_process');
      const scriptPath = path.join(__dirname, 'tools', 'drawing_extractor.py');
      return new Promise((resolve) => {
        execFile('python', [scriptPath, targetPath], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
          if (err) {
            console.warn('drawing_extractor.py failed, error:', err);
            resolve(null);
          } else {
            try {
              resolve(JSON.parse(stdout));
            } catch (e) {
              console.warn('JSON parse error from drawing_extractor:', e);
              resolve(null);
            }
          }
        });
      });
    } catch (e) {
      console.error('Error extracting drawing data:', e);
      return null;
    }
  });

  // Read Local File from Disk (test_assets or citadel)
  ipcMain.handle('read-local-cad', async (event, targetPath) => {
    try {
      let resolved = path.resolve(targetPath);
      if (!fs.existsSync(resolved)) {
        // Try inside test_assets/BENCH_LAB
        const benchPath = path.resolve(__dirname, 'test_assets', 'BENCH_LAB', targetPath);
        if (fs.existsSync(benchPath)) resolved = benchPath;
        else {
          // Search in test_assets root or subfolders
          const baseTest = path.resolve(__dirname, 'test_assets');
          const directTest = path.join(baseTest, targetPath);
          if (fs.existsSync(directTest)) resolved = directTest;
          else {
            // Find by filename recursively in test_assets
            const targetName = path.basename(targetPath).toLowerCase();
            function findRecursive(dir) {
              const entries = fs.readdirSync(dir, { withFileTypes: true });
              for (const e of entries) {
                const full = path.join(dir, e.name);
                if (e.isDirectory()) {
                  const res = findRecursive(full);
                  if (res) return res;
                } else if (e.name.toLowerCase() === targetName) {
                  return full;
                }
              }
              return null;
            }
            const found = findRecursive(baseTest);
            if (found) resolved = found;
          }
        }
      }
      if (!fs.existsSync(resolved)) return null;

      const ext = path.extname(resolved).toLowerCase().replace('.', '');
      const name = path.basename(resolved);
      const buf = await fs.promises.readFile(resolved);
      return {
        filePath: resolved,
        name,
        ext,
        size: buf.length,
        dataText: (['step', 'stp', 'obj', 'svg', 'json'].includes(ext)) ? buf.toString('utf8') : null,
        dataBase64: buf.toString('base64')
      };
    } catch (e) {
      console.error('Error reading local CAD/asset:', e);
      return null;
    }
  });

  // Get Benchmark Laboratory Catalog & Flagships
  ipcMain.handle('get-benchmark-catalog', async () => {
    try {
      const benchDir = path.resolve(__dirname, 'test_assets', 'BENCH_LAB');
      const masterIdx = path.join(benchDir, 'master_laboratory_index.json');
      const catalogIdx = path.join(benchDir, 'bench_catalog.json');
      
      let specimens = [];
      let totalCount = 0;
      
      if (fs.existsSync(masterIdx)) {
        specimens = JSON.parse(await fs.promises.readFile(masterIdx, 'utf8'));
      }
      if (fs.existsSync(catalogIdx)) {
        const fullCat = JSON.parse(await fs.promises.readFile(catalogIdx, 'utf8'));
        totalCount = fullCat.length;
      }
      
      return { specimens, totalCount, success: true };
    } catch (e) {
      console.error('Error reading benchmark catalog:', e);
      return { specimens: [], totalCount: 0, error: e.message };
    }
  });

  // Load a complete benchmark specimen suite (CAD + 2D PDF Drawing + Meta)
  ipcMain.handle('load-benchmark-specimen', async (event, specimenIndex) => {
    try {
      const benchDir = path.resolve(__dirname, 'test_assets', 'BENCH_LAB');
      const masterIdx = path.join(benchDir, 'master_laboratory_index.json');
      if (!fs.existsSync(masterIdx)) return null;
      
      const specimens = JSON.parse(await fs.promises.readFile(masterIdx, 'utf8'));
      const spec = specimens.find(s => s.specimen_index === specimenIndex || s.specimen_id === specimenIndex);
      if (!spec) return null;

      const cadFullPath = path.resolve(benchDir, spec.cad_file);
      let cadData = null;
      if (fs.existsSync(cadFullPath)) {
        const cadBuf = await fs.promises.readFile(cadFullPath);
        const cadExt = path.extname(cadFullPath).toLowerCase().replace('.', '');
        cadData = {
          name: path.basename(cadFullPath),
          filePath: cadFullPath,
          ext: cadExt,
          size: cadBuf.length,
          dataText: ['step', 'stp', 'obj'].includes(cadExt) ? cadBuf.toString('utf8') : null,
          dataBase64: cadBuf.toString('base64')
        };
      }

      let drawingData = null;
      if (spec.drawing_file) {
        const drawFullPath = path.resolve(benchDir, spec.drawing_file);
        if (fs.existsSync(drawFullPath)) {
          const drawBuf = await fs.promises.readFile(drawFullPath);
          drawingData = {
            name: path.basename(drawFullPath),
            filePath: drawFullPath,
            ext: 'pdf',
            size: drawBuf.length,
            fileUrl: `file://${drawFullPath.replace(/\\/g, '/')}`,
            dataBase64: drawBuf.toString('base64')
          };
        }
      }

      return {
        specimen: spec,
        cad: cadData,
        drawing: drawingData,
        success: true
      };
    } catch (e) {
      console.error('Error loading benchmark specimen:', e);
      return null;
    }
  });

  // Scan and list test assets from test_assets directory
  ipcMain.handle('list-test-assets', async () => {
    const cadDir = path.resolve(__dirname, 'test_assets', 'cad_models');
    const drawDir = path.resolve(__dirname, 'test_assets', 'drawings');
    const result = { cadModels: [], drawings: [] };
    if (fs.existsSync(cadDir)) {
      const files = await fs.promises.readdir(cadDir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.step', '.stp', '.stl', '.obj'].includes(ext)) {
          const stat = await fs.promises.stat(path.join(cadDir, file));
          result.cadModels.push({ name: file, path: path.join(cadDir, file), size: stat.size, ext: ext.replace('.', '') });
        }
      }
    }
    if (fs.existsSync(drawDir)) {
      const files = await fs.promises.readdir(drawDir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.pdf', '.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
          const stat = await fs.promises.stat(path.join(drawDir, file));
          result.drawings.push({ name: file, path: path.join(drawDir, file), size: stat.size, ext: ext.replace('.', '') });
        }
      }
    }
    return result;
  });

  // Scan and list Citadel CAD models on the machine
  ipcMain.handle('list-citadel-models', async () => {
    const citadelDir = path.resolve(__dirname, '..', 'nuper_citadel', 'cad_models');
    if (!fs.existsSync(citadelDir)) return [];
    try {
      const files = await fs.promises.readdir(citadelDir);
      const cadFiles = [];
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.step', '.stp', '.stl', '.obj'].includes(ext)) {
          const fullPath = path.join(citadelDir, file);
          const stat = await fs.promises.stat(fullPath);
          cadFiles.push({
            name: file,
            path: fullPath,
            size: stat.size,
            ext: ext.replace('.', '')
          });
        }
      }
      return cadFiles;
    } catch (e) {
      console.error('Error listing citadel models:', e);
      return [];
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
