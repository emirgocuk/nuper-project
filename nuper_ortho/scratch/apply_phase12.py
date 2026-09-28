import re

path = 'ui/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ============================================================
# FAZ 12: GERÇEK DOSYA YÜKLEME & ÇİFT KANVAS
# ============================================================

# 1. Add STLLoader and OBJLoader CDN scripts after Three.js CDN
three_cdn_marker = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js'
if 'STLLoader' not in content:
    # Find the Three.js script tag and OrbitControls
    orbit_tag = '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>'
    loaders_cdn = orbit_tag + """
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>"""
    content = content.replace(orbit_tag, loaders_cdn)

# 2. Add hidden file inputs for 3D model (STL/OBJ) and 2D drawing (PNG/JPG/PDF) after last modal before <script>
hidden_inputs = """
  <!-- Gizli Dosya Girişleri (3D Model ve 2D Teknik Resim) -->
  <input type="file" id="real-3d-file-input" accept=".stl,.obj,.step,.stp" style="display: none;" onchange="handleReal3dFileUpload(event)">
  <input type="file" id="drawing-file-input" accept=".png,.jpg,.jpeg,.svg,.pdf" style="display: none;" onchange="handleDrawingFileUpload(event)">
"""

if 'id="real-3d-file-input"' not in content:
    # Insert before the first <script> tag
    content = content.replace("\n  <script>", hidden_inputs + "\n  <script>", 1)

# 3. Update step-file-input accept to also include STL/OBJ
content = content.replace(
    'accept=".step,.stp"',
    'accept=".step,.stp,.stl,.obj"'
)

# 4. Update the STEP dropzone text to mention STL/OBJ
content = content.replace(
    'STEP / STP Dosyanızı Buraya Sürükleyin veya Dosya Seçmek İçin Tıklayın',
    'STEP / STL / OBJ Dosyanızı Buraya Sürükleyin veya Tıklayın'
)
content = content.replace(
    'Desteklenen Formatlar: ISO 10303-21 STEP AP203, AP214, AP242 (Semantik PMI Dahil)',
    'Desteklenen: STEP AP203/AP214/AP242 | STL (Binary/ASCII) | OBJ (Wavefront)'
)

# 5. Add CSS for the 2D drawing canvas image/pdf viewer
css_additions = """
    /* FAZ 12: 2D TEKNIK RESIM KANVASI (GERÇEK DOSYA GORUNTULEME) */
    #drawing-viewer-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      cursor: grab;
      background: #FAFAFA;
    }
    #drawing-viewer-container:active { cursor: grabbing; }
    #drawing-viewer-container img,
    #drawing-viewer-container canvas {
      position: absolute;
      transform-origin: 0 0;
      max-width: none;
    }
    .drawing-toolbar {
      position: absolute;
      bottom: 8px;
      right: 8px;
      display: flex;
      gap: 4px;
      z-index: 20;
    }
    .drawing-toolbar button {
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid var(--border-color);
      background: rgba(255,255,255,0.92);
      border-radius: 4px;
      cursor: pointer;
    }
    .drawing-toolbar button:hover { background: #EFF6FF; }
    .model-info-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(15,23,42,0.85);
      color: #F8FAFC;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 10.5px;
      font-family: var(--font-mono);
      z-index: 20;
      display: none;
      line-height: 1.5;
    }
"""

if '#drawing-viewer-container' not in content:
    content = content.replace('  </style>', css_additions + '  </style>')

# 6. Update the 2D canvas pane HTML to include a real viewer container
old_drawing_pane = """        <div class="svg-drawing-container" id="drawing-svg-area">"""
new_drawing_pane = """        <div class="svg-drawing-container" id="drawing-svg-area" style="position: relative;">
          <!-- Gerçek yüklenen 2D teknik resim burada gösterilir -->
          <div id="drawing-viewer-container" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; background: #FFF;"></div>"""

if 'drawing-viewer-container' not in content:
    content = content.replace(old_drawing_pane, new_drawing_pane)

# 7. Add 3D model info badge to the 3D viewport
model_badge_html = """        <!-- FAZ 12: Yüklenen 3D Model Bilgi Rozeti -->
        <div class="model-info-badge" id="loaded-model-badge">
          <div id="model-badge-name">Yüklenen Model: --</div>
          <div id="model-badge-size">Boyut: -- x -- x -- mm</div>
          <div id="model-badge-faces">Yüzey: -- | Üçgen: --</div>
        </div>
"""
if 'loaded-model-badge' not in content:
    content = content.replace('<div id="webgl-canvas"></div>', '<div id="webgl-canvas"></div>\n' + model_badge_html)

# 8. Add the FAZ 12 JavaScript functions
phase12_js = """
    // ==========================================================================
    // FAZ 12: GERÇEK 3D STL/OBJ YÜKLEME & 2D TEKNİK RESİM GÖRÜNTÜLEME
    // ==========================================================================
    let uploadedMeshGroup = null; // Yüklenen 3D model grubu

    // --- 3D Model Yükleme (STL / OBJ) ---
    function handleReal3dFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'stl') {
        loadSTLFile(file);
      } else if (ext === 'obj') {
        loadOBJFile(file);
      } else {
        // STEP dosyaları metin olarak parse edilir (mevcut CAD ingestion)
        processStepFile(file);
      }
    }

    function loadSTLFile(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const loader = new THREE.STLLoader();
        try {
          const geometry = loader.parse(e.target.result);
          addUploadedGeometry(geometry, file.name);
        } catch (err) {
          alert('STL dosyası yüklenirken hata oluştu: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    function loadOBJFile(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const loader = new THREE.OBJLoader();
        try {
          const obj = loader.parse(e.target.result);
          // OBJ'den geometri çıkar
          let mergedGeo = null;
          obj.traverse(function(child) {
            if (child.isMesh && child.geometry) {
              if (!mergedGeo) {
                mergedGeo = child.geometry.clone();
              }
            }
          });
          if (mergedGeo) {
            addUploadedGeometry(mergedGeo, file.name);
          } else {
            alert('OBJ dosyasında mesh geometrisi bulunamadı.');
          }
        } catch (err) {
          alert('OBJ dosyası yüklenirken hata oluştu: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    function addUploadedGeometry(geometry, filename) {
      // Önceki yüklenen modeli temizle
      if (uploadedMeshGroup) {
        scene.remove(uploadedMeshGroup);
        uploadedMeshGroup = null;
      }

      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox;
      const sizeX = bbox.max.x - bbox.min.x;
      const sizeY = bbox.max.y - bbox.min.y;
      const sizeZ = bbox.max.z - bbox.min.z;
      const center = new THREE.Vector3();
      bbox.getCenter(center);

      // Merkeze taşı
      geometry.translate(-center.x, -center.y, -center.z);
      // Tabana oturt (Z=0 -> Y=0 three.js koordinatı)
      geometry.translate(0, sizeY / 2, 0);

      // Mesh oluştur
      const mat = new THREE.MeshLambertMaterial({
        color: 0x94A3B8,
        transparent: true,
        opacity: 0.92
      });
      const mesh = new THREE.Mesh(geometry, mat);

      // Kenar çizgileri
      const edgesGeo = new THREE.EdgesGeometry(geometry, 30);
      const edgesMat = new THREE.LineBasicMaterial({ color: 0x475569 });
      const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);

      uploadedMeshGroup = new THREE.Group();
      uploadedMeshGroup.add(mesh);
      uploadedMeshGroup.add(edgeLines);
      scene.add(uploadedMeshGroup);

      // Eski demo bloğu gizle
      blockGroup.visible = false;

      // Kamerayı modele odakla
      const maxDim = Math.max(sizeX, sizeY, sizeZ);
      const camDist = maxDim * 2.2;
      camera.position.set(camDist * 0.7, camDist * 0.8, camDist * 0.7);
      controls.target.set(0, sizeY / 2, 0);

      // Raycasting için ekle
      selectableMeshes.push(mesh);
      mesh.userData = { featureKey: 'uploaded_model' };

      // Model bilgi rozetini güncelle
      const badge = document.getElementById('loaded-model-badge');
      if (badge) {
        badge.style.display = 'block';
        document.getElementById('model-badge-name').innerText = 'Model: ' + filename;
        document.getElementById('model-badge-size').innerText = 'Boyut: ' + sizeX.toFixed(1) + ' x ' + sizeY.toFixed(1) + ' x ' + sizeZ.toFixed(1) + ' mm';
        const triCount = geometry.index ? geometry.index.count / 3 : (geometry.attributes.position.count / 3);
        document.getElementById('model-badge-faces').innerText = 'Üçgen: ' + Math.round(triCount).toLocaleString();
      }

      // CAD ingestion istatistiklerini güncelle
      currentUploadedCad.name = filename;
      currentUploadedCad.bbox = sizeX.toFixed(1) + ' x ' + sizeY.toFixed(1) + ' x ' + sizeZ.toFixed(1) + ' mm';
      updateCadModalTelemetry();

      // Başlık çubuğu parça adını güncelle
      const partBadge = document.getElementById('part-name-badge');
      if (partBadge) partBadge.innerText = filename;

      requestRender();
      console.log('3D model yüklendi:', filename, 'Boyut:', sizeX.toFixed(1), 'x', sizeY.toFixed(1), 'x', sizeZ.toFixed(1), 'mm');
    }

    // CAD Ingestion modal'ından gerçek dosya yükleme tetikle
    const originalHandleStepFileInput = handleStepFileInput;
    handleStepFileInput = function(event) {
      const file = event.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'stl' || ext === 'obj') {
        handleReal3dFileUpload(event);
      } else {
        originalHandleStepFileInput(event);
      }
    };

    // Ribbon butonlarından gerçek dosya yükleme
    const origOpenCadIngestionModal = openCadIngestionModal;
    // openCadIngestionModal zaten tanımlı, onu kullan

    // --- 2D Teknik Resim Görüntüleme (PNG / JPG / SVG) ---
    let drawingState = { scale: 1, panX: 0, panY: 0, dragging: false, lastX: 0, lastY: 0 };

    function handleDrawingFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();

      // Çift kanvas modunu aktifleştir
      if (!isDualCanvas) toggleDualCanvas();

      const container = document.getElementById('drawing-viewer-container');
      const paneTitle = document.querySelector('#dual-canvas-2d .pane-toolbar span');

      if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
        const reader = new FileReader();
        reader.onload = function(e) {
          container.innerHTML = '';
          container.style.display = 'block';

          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
          img.draggable = false;
          container.appendChild(img);

          // Zoom/Pan araç çubuğu
          const toolbar = document.createElement('div');
          toolbar.className = 'drawing-toolbar';
          toolbar.innerHTML = '<button onclick="drawingZoom(1.25)">🔍+</button><button onclick="drawingZoom(0.8)">🔍-</button><button onclick="drawingReset()">↺ Sıfırla</button>';
          container.appendChild(toolbar);

          // Başlığı güncelle
          if (paneTitle) paneTitle.innerText = '2D Teknik Resim: ' + file.name;

          // Pan & Zoom
          drawingState = { scale: 1, panX: 0, panY: 0, dragging: false, lastX: 0, lastY: 0 };
          setupDrawingPanZoom(container, img);
        };
        reader.readAsDataURL(file);
      } else if (ext === 'pdf') {
        container.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #475569;"><span style="font-size: 28px; margin-bottom: 8px;">📄</span><span style="font-weight: 700;">PDF Yüklendi: ' + file.name + '</span><span style="font-size: 11px; margin-top: 4px; color: #64748B;">PDF görüntüleme için sisteminizin PDF okuyucusu kullanılacak.</span></div>';
        container.style.display = 'flex';
        if (paneTitle) paneTitle.innerText = '2D Teknik Resim: ' + file.name;

        // PDF'i yeni sekmede aç
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
    }

    function setupDrawingPanZoom(container, img) {
      container.addEventListener('wheel', function(e) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        drawingState.scale *= factor;
        drawingState.scale = Math.max(0.2, Math.min(drawingState.scale, 8));
        img.style.transform = 'translate(' + drawingState.panX + 'px, ' + drawingState.panY + 'px) scale(' + drawingState.scale + ')';
      });

      container.addEventListener('mousedown', function(e) {
        drawingState.dragging = true;
        drawingState.lastX = e.clientX;
        drawingState.lastY = e.clientY;
        container.style.cursor = 'grabbing';
      });

      container.addEventListener('mousemove', function(e) {
        if (!drawingState.dragging) return;
        drawingState.panX += e.clientX - drawingState.lastX;
        drawingState.panY += e.clientY - drawingState.lastY;
        drawingState.lastX = e.clientX;
        drawingState.lastY = e.clientY;
        img.style.transform = 'translate(' + drawingState.panX + 'px, ' + drawingState.panY + 'px) scale(' + drawingState.scale + ')';
      });

      container.addEventListener('mouseup', function() {
        drawingState.dragging = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mouseleave', function() {
        drawingState.dragging = false;
        container.style.cursor = 'grab';
      });
    }

    function drawingZoom(factor) {
      drawingState.scale *= factor;
      drawingState.scale = Math.max(0.2, Math.min(drawingState.scale, 8));
      const img = document.querySelector('#drawing-viewer-container img');
      if (img) {
        img.style.transform = 'translate(' + drawingState.panX + 'px, ' + drawingState.panY + 'px) scale(' + drawingState.scale + ')';
      }
    }

    function drawingReset() {
      drawingState = { scale: 1, panX: 0, panY: 0, dragging: false, lastX: 0, lastY: 0 };
      const img = document.querySelector('#drawing-viewer-container img');
      if (img) {
        img.style.transform = 'translate(0px, 0px) scale(1)';
      }
    }

    // trigger2dUpload fonksiyonunu güncelle
    trigger2dUpload = function() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      document.getElementById('drawing-file-input').click();
    };

    // Ribbon STEP Yükle butonunu da gerçek dosya yüklemeye yönlendir
    const origStepClick = document.getElementById('step-file-input');
    if (origStepClick) {
      origStepClick.setAttribute('accept', '.step,.stp,.stl,.obj');
    }
"""

if '// FAZ 12: GERÇEK 3D STL/OBJ YÜKLEME' not in content:
    # Insert before closing </script>
    content = content.replace('  </script>', phase12_js + '\n  </script>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("FAZ 12 applied successfully to ui/index.html")
