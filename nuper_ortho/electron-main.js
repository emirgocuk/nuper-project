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
  mainWindow.webContents.session.clearStorageData();

  const devServerUrl = process.env.NUPER_DEV_SERVER_URL || '';
  if (process.argv.includes('--dev') || devServerUrl) {
    const targetUrl = devServerUrl || 'http://localhost:5173';
    const loadDevServer = () => {
      if (!mainWindow) return;
      mainWindow.loadURL(targetUrl).catch(() => {});
    };
    mainWindow.webContents.on('did-fail-load', () => {
      setTimeout(loadDevServer, 500);
    });
    loadDevServer();
  } else {
    mainWindow.loadFile(distIndexPath);
  }

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

  let cachedPythonPath = null;
  async function resolvePythonPath() {
    if (cachedPythonPath) return cachedPythonPath;
    const { execFile } = require('child_process');
    const candidates = ['python', 'py -3', 'python3'];
    for (const cmd of candidates) {
      const parts = cmd.split(' ');
      const bin = parts[0];
      const args = parts.slice(1).concat(['-c', 'import sys; print(sys.executable)']);
      try {
        const found = await new Promise((resolve) => {
          execFile(bin, args, { timeout: 3000 }, (err, stdout) => {
            if (!err && stdout && stdout.trim()) {
              resolve(bin);
            } else {
              resolve(null);
            }
          });
        });
        if (found) {
          cachedPythonPath = found;
          return found;
        }
      } catch {}
    }
    cachedPythonPath = 'python';
    return 'python';
  }

  async function parseStepMetadata(stepPath) {
    try {
      const { execFile } = require('child_process');
      const pyBin = await resolvePythonPath();
      const verifierScript = path.join(__dirname, 'tools', 'extractor', 'brep_verifier.py');
      return await new Promise((resolve) => {
        execFile(pyBin, [verifierScript, stepPath], { maxBuffer: 25 * 1024 * 1024 }, (err, stdout, stderr) => {
          if (!err && stdout) {
            try {
              const parsed = JSON.parse(stdout);
              resolve(parsed);
            } catch (e) {
              console.error('[Nuper B-Rep] JSON ayrıştırma hatası:', e, stdout.slice(0, 300));
              resolve({ success: false, error: 'JSON parse error: ' + e.message });
            }
          } else {
            console.error('[Nuper B-Rep] brep_verifier çalıştırılamadı:', err?.message, stderr?.slice(0, 300));
            resolve({ success: false, error: err?.message || stderr || 'B-Rep çıkarım hatası' });
          }
        });
      });
    } catch (e) {
      console.error('[Nuper B-Rep] Kritik hata:', e);
      return { success: false, error: e.message };
    }
  }

  // Python Çekirdek ve OCP Çalışma Zamanı Sağlık Kontrolü IPC
  ipcMain.handle('check-python-runtime', async () => {
    try {
      const { execFile } = require('child_process');
      const pyBin = await resolvePythonPath();
      return await new Promise((resolve) => {
        const code = `
import json, sys
res = {"python": sys.version.split()[0], "ocp": False, "pymupdf": False, "rapidocr": False}
try:
    import OCP
    res["ocp"] = True
except Exception as e:
    res["ocp_error"] = str(e)
try:
    import pymupdf
    res["pymupdf"] = True
except Exception as e:
    res["pymupdf_error"] = str(e)
try:
    import rapidocr_onnxruntime
    res["rapidocr"] = True
except Exception as e:
    res["rapidocr_error"] = str(e)
print(json.dumps(res))
`;
        execFile(pyBin, ['-c', code], { timeout: 5000 }, (err, stdout, stderr) => {
          if (!err && stdout) {
            try {
              resolve({ ok: true, data: JSON.parse(stdout) });
            } catch (e) {
              resolve({ ok: false, error: 'JSON Parse Error: ' + stdout });
            }
          } else {
            resolve({ ok: false, error: err?.message || stderr || 'Python bulunamadı' });
          }
        });
      });
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });

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
    const metadata = (ext === 'step' || ext === 'stp') ? await parseStepMetadata(filePath) : null;

    return {
      filePath,
      name,
      ext,
      size: buf.length,
      dataText: (ext === 'step' || ext === 'stp' || ext === 'obj') ? buf.toString('utf8') : null,
      dataBase64: buf.toString('base64'),
      metadata: metadata || undefined
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
  ipcMain.handle('extract-drawing-data', async (event, targetPath, stepPath) => {
    try {
      const { execFile } = require('child_process');
      const pyBin = await resolvePythonPath();
      const scriptPath = path.join(__dirname, 'tools', 'drawing_extractor.py');
      const args = [scriptPath, targetPath];
      if (stepPath) {
        args.push(stepPath);
      }
      return new Promise((resolve) => {
        execFile(pyBin, args, { maxBuffer: 15 * 1024 * 1024 }, (err, stdout, stderr) => {
          if (err) {
            console.error('[Nuper Drawing] drawing_extractor.py başarısız oldu:', err?.message, stderr?.slice(0, 300));
            resolve({ success: false, error: err?.message || stderr || 'Teknik resim çıkarım hatası' });
          } else {
            try {
              resolve(JSON.parse(stdout));
            } catch (e) {
              console.error('[Nuper Drawing] JSON parse error from drawing_extractor:', e, stdout.slice(0, 300));
              resolve({ success: false, error: 'JSON parse hatası: ' + e.message });
            }
          }
        });
      });
    } catch (e) {
      console.error('[Nuper Drawing] Error extracting drawing data:', e);
      return { success: false, error: e.message };
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
      const metadata = (ext === 'step' || ext === 'stp') ? await parseStepMetadata(resolved) : null;
      return {
        filePath: resolved,
        name,
        ext,
        size: buf.length,
        dataText: (['step', 'stp', 'obj', 'svg', 'json'].includes(ext)) ? buf.toString('utf8') : null,
        dataBase64: buf.toString('base64'),
        metadata: metadata || undefined
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
        const metadata = (cadExt === 'step' || cadExt === 'stp') ? await parseStepMetadata(cadFullPath) : null;
        cadData = {
          name: path.basename(cadFullPath),
          filePath: cadFullPath,
          ext: cadExt,
          size: cadBuf.length,
          dataText: ['step', 'stp', 'obj'].includes(cadExt) ? cadBuf.toString('utf8') : null,
          dataBase64: cadBuf.toString('base64'),
          metadata: metadata || undefined
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

  ipcMain.handle('ortho:extract-drawing', async (event, targetPath, stepPath) => {
    try {
      const { execFile } = require('child_process');
      const pyBin = await resolvePythonPath();
      const scriptPath = path.join(__dirname, 'tools', 'drawing_extractor.py');
      const args = [scriptPath, targetPath];
      if (stepPath) args.push(stepPath);
      return new Promise((resolve) => {
        execFile(pyBin, args, { maxBuffer: 15 * 1024 * 1024 }, (err, stdout, stderr) => {
          if (err) {
            resolve({ success: false, error: err?.message || stderr || 'Extract error' });
          } else {
            try {
              resolve(JSON.parse(stdout));
            } catch (e) {
              resolve({ success: false, error: 'JSON error: ' + e.message });
            }
          }
        });
      });
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('ortho:parse-step', async (event, stepPath) => {
    return parseStepMetadata(stepPath);
  });

  ipcMain.handle('ortho:compile-dmis', async (event, planPayload) => {
    try {
      const { execFile } = require('child_process');
      const pyBin = await resolvePythonPath();
      const scriptPath = path.join(__dirname, 'tools', 'inspection_planner.py');
      const inputJson = typeof planPayload === 'string' ? planPayload : JSON.stringify(planPayload);
      return new Promise((resolve) => {
        const child = execFile(pyBin, [scriptPath, '--stdin'], { maxBuffer: 15 * 1024 * 1024 }, (err, stdout, stderr) => {
          if (!err && stdout) {
            try {
              resolve(JSON.parse(stdout));
            } catch {
              resolve({ success: true, dmis: stdout });
            }
          } else {
            resolve({ success: false, error: err?.message || stderr });
          }
        });
        if (child.stdin) {
          child.stdin.write(inputJson);
          child.stdin.end();
        }
      });
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('ortho:save-session', async (event, sessionData) => {
    try {
      const sessionFile = path.join(__dirname, '.ortho-session.json');
      fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf-8');
      return { success: true, path: sessionFile };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('ortho:load-session', async (event, fingerprint) => {
    try {
      const sessionFile = path.join(__dirname, '.ortho-session.json');
      if (fs.existsSync(sessionFile)) {
        const content = fs.readFileSync(sessionFile, 'utf-8');
        const data = JSON.parse(content);
        if (!fingerprint || data.fingerprint === fingerprint) {
          return { success: true, session: data };
        }
      }
      return { success: false, error: 'Session not found' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
