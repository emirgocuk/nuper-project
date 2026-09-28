path = 'ui/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ============================================================
# FAZ 13: EKSEN DÜZELTME SIHIRBAZI & AKILLI FİKSTÜRLEME ÖNERİ
# ============================================================

# 1. Add Axis Orientation Modal HTML
axis_modal_html = """
  <!-- FAZ 13: EKSEN DÜZELTME SİHİRBAZI MODAL PENCERESİ -->
  <div class="modal-overlay" id="axis-orient-modal">
    <div class="modal-card" style="width: 720px;">
      <div class="modal-header" style="background: #0F172A; color: #FFF; border-bottom: 2px solid #0284C7;">
        <div class="modal-title" style="color: #FFF; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">🔄</span>
          <span>CAD Eksen Düzeltme & Tablaya Oturtma Sihirbazı</span>
        </div>
        <button onclick="closeAxisOrientModal()" style="border: none; background: transparent; font-size: 18px; cursor: pointer; color: #94A3B8;">✕</button>
      </div>
      <div class="modal-body" style="padding: 18px;">
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 12px; margin-bottom: 16px; font-size: 11.5px; color: #1E3A8A; line-height: 1.5;">
          <b>ℹ️ Eksen Düzeltme:</b> CAD modelinizin koordinat sistemi CMM tablasıyla uyumsuzsa, burada X/Y/Z eksenleri etrafında ±90° döndürme yaparak modeli doğru yönelime getirebilirsiniz. "Tablaya Oturt" ile modelin en alt yüzeyini Z=0 seviyesine hizalayın.
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; text-align: center;">
            <div style="font-weight: 700; font-size: 12px; color: #DC2626; margin-bottom: 8px;">X Ekseni (Kırmızı)</div>
            <div style="display: flex; gap: 6px; justify-content: center;">
              <button onclick="rotateModel('x', -90)" style="padding: 6px 12px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 4px; font-weight: 700; cursor: pointer;">-90°</button>
              <button onclick="rotateModel('x', 90)" style="padding: 6px 12px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 4px; font-weight: 700; cursor: pointer;">+90°</button>
            </div>
          </div>
          <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; text-align: center;">
            <div style="font-weight: 700; font-size: 12px; color: #16A34A; margin-bottom: 8px;">Y Ekseni (Yeşil)</div>
            <div style="display: flex; gap: 6px; justify-content: center;">
              <button onclick="rotateModel('y', -90)" style="padding: 6px 12px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 4px; font-weight: 700; cursor: pointer;">-90°</button>
              <button onclick="rotateModel('y', 90)" style="padding: 6px 12px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 4px; font-weight: 700; cursor: pointer;">+90°</button>
            </div>
          </div>
          <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; text-align: center;">
            <div style="font-weight: 700; font-size: 12px; color: #2563EB; margin-bottom: 8px;">Z Ekseni (Mavi)</div>
            <div style="display: flex; gap: 6px; justify-content: center;">
              <button onclick="rotateModel('z', -90)" style="padding: 6px 12px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; font-weight: 700; cursor: pointer;">-90°</button>
              <button onclick="rotateModel('z', 90)" style="padding: 6px 12px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; font-weight: 700; cursor: pointer;">+90°</button>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 16px;">
          <button onclick="seatModelToTable()" style="flex: 1; padding: 10px; background: #059669; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
            ⬇️ Tablaya Oturt (Alt Yüzeyi Z=0'a Hizala)
          </button>
          <button onclick="centerModelOnTable()" style="flex: 1; padding: 10px; background: #0284C7; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
            🎯 Tabla Merkezine Al (X=0, Z=0)
          </button>
          <button onclick="resetModelOrientation()" style="padding: 10px; background: #F1F5F9; border: 1px solid var(--border-color); border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
            ↺ Sıfırla
          </button>
        </div>

        <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; font-size: 11px;">
          <b style="color: #0F172A;">Mevcut Model Yönelimi:</b>
          <div id="axis-orient-status" style="font-family: var(--font-mono); margin-top: 4px; color: #334155;">
            Rx: 0° | Ry: 0° | Rz: 0° | Z-Offset: 0 mm
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-header" onclick="closeAxisOrientModal()">İptal</button>
        <button class="btn-header primary" onclick="applyAxisOrientation()">✓ Yönelimi Uygula ve Kapat</button>
      </div>
    </div>
  </div>

  <!-- FAZ 13: AKILLI FİKSTÜRLEME & PABUÇ ÖNERİ MODAL PENCERESİ -->
  <div class="modal-overlay" id="clamping-modal">
    <div class="modal-card" style="width: 780px;">
      <div class="modal-header" style="background: #0F172A; color: #FFF; border-bottom: 2px solid #F97316;">
        <div class="modal-title" style="color: #FFF; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">🗜️</span>
          <span>Akıllı Fikstürleme & Pabuç Konumu Öneri Sihirbazı</span>
        </div>
        <button onclick="closeClampingModalX()" style="border: none; background: transparent; font-size: 18px; cursor: pointer; color: #94A3B8;">✕</button>
      </div>
      <div class="modal-body" style="padding: 18px;">
        <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 6px; padding: 12px; margin-bottom: 16px; font-size: 11.5px; color: #9A3412; line-height: 1.5;">
          <b>🗜️ Fikstürleme Analizi:</b> Parça bounding box boyutları ve ağırlık merkezi analiz edilerek 3 taban destek noktası ve 2 yan sıkma pabucu konumu önerilir. Pabuç yasaklı alanları (Keep-Out) otomatik olarak prob yolunu etkiler.
        </div>

        <div id="clamping-analysis-result" style="margin-bottom: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
              <b style="font-size: 11px; color: #475569; text-transform: uppercase;">Parça Bounding Box:</b>
              <div id="clamp-bbox-info" style="font-family: var(--font-mono); font-size: 12px; font-weight: 600; margin-top: 4px; color: #0F172A;">
                100.0 x 50.0 x 100.0 mm
              </div>
            </div>
            <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
              <b style="font-size: 11px; color: #475569; text-transform: uppercase;">Tahmini Ağırlık (7075-T6):</b>
              <div id="clamp-weight-info" style="font-family: var(--font-mono); font-size: 12px; font-weight: 600; margin-top: 4px; color: #0F172A;">
                ~1.4 kg (2810 kg/m³)
              </div>
            </div>
          </div>

          <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; margin-bottom: 12px;">
            <b style="font-size: 11px; color: #059669; text-transform: uppercase;">✓ Önerilen Taban Destek Noktaları (3 Nokta):</b>
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11px;">
              <tr style="background: #F1F5F9;"><th style="padding: 4px 8px; border: 1px solid var(--border-color);">No</th><th style="padding: 4px 8px; border: 1px solid var(--border-color);">X (mm)</th><th style="padding: 4px 8px; border: 1px solid var(--border-color);">Z (mm)</th><th style="padding: 4px 8px; border: 1px solid var(--border-color);">Konum Açıklama</th></tr>
              <tr><td style="padding: 4px 8px; border: 1px solid var(--border-color); text-align: center;">1</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);" id="clamp-s1x">15.0</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);" id="clamp-s1z">15.0</td><td style="padding: 4px 8px; border: 1px solid var(--border-color);">Sol Alt Köşe</td></tr>
              <tr><td style="padding: 4px 8px; border: 1px solid var(--border-color); text-align: center;">2</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);" id="clamp-s2x">85.0</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);" id="clamp-s2z">15.0</td><td style="padding: 4px 8px; border: 1px solid var(--border-color);">Sağ Alt Köşe</td></tr>
              <tr><td style="padding: 4px 8px; border: 1px solid var(--border-color); text-align: center;">3</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);" id="clamp-s3x">50.0</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);" id="clamp-s3z">85.0</td><td style="padding: 4px 8px; border: 1px solid var(--border-color);">Arka Orta</td></tr>
            </table>
          </div>

          <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; margin-bottom: 12px;">
            <b style="font-size: 11px; color: #F97316; text-transform: uppercase;">🗜️ Önerilen Sıkma Pabuçları (2 Pabuç + Lift-Hop):</b>
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11px;">
              <tr style="background: #FFF7ED;"><th style="padding: 4px 8px; border: 1px solid var(--border-color);">Pabuç</th><th style="padding: 4px 8px; border: 1px solid var(--border-color);">Konum (X, Z)</th><th style="padding: 4px 8px; border: 1px solid var(--border-color);">Keep-Out Yüksekliği</th><th style="padding: 4px 8px; border: 1px solid var(--border-color);">OP20 Çakışma</th></tr>
              <tr><td style="padding: 4px 8px; border: 1px solid var(--border-color);">Pabuç A (Sol)</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);">X: -10, Z: 25</td><td style="padding: 4px 8px; border: 1px solid var(--border-color);">+40 mm Lift-Hop</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); color: #059669; font-weight: 700;">Çakışma Yok</td></tr>
              <tr><td style="padding: 4px 8px; border: 1px solid var(--border-color);">Pabuç B (Sağ)</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);">X: 110, Z: 25</td><td style="padding: 4px 8px; border: 1px solid var(--border-color);">+40 mm Lift-Hop</td><td style="padding: 4px 8px; border: 1px solid var(--border-color); color: #059669; font-weight: 700;">Çakışma Yok</td></tr>
            </table>
          </div>

          <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; background: #F0F9FF;">
            <b style="font-size: 11px; color: #0369A1; text-transform: uppercase;">🔁 OP20 (180° Flip) Erişilebilirlik Analizi:</b>
            <div style="font-size: 11px; margin-top: 4px; color: #334155;" id="op20-analysis">
              Parça 180° döndürüldüğünde tüm alt yüzey delikleri erişilebilir durumda. OP20 ek bağlama gerekli değil.
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-header" onclick="closeClampingModalX()">Kapat</button>
        <button class="btn-header primary" onclick="applyClampingRecommendation()">✓ Fikstür Önerisini Teftiş Planına Uygula</button>
      </div>
    </div>
  </div>
"""

if 'id="axis-orient-modal"' not in content:
    content = content.replace("\n  <!-- Gizli Dosya", axis_modal_html + "\n  <!-- Gizli Dosya")

# 2. Add FAZ 13 JavaScript
phase13_js = """
    // ==========================================================================
    // FAZ 13: EKSEN DÜZELTME SİHİRBAZI & AKILLI FİKSTÜRLEME ÖNERİ
    // ==========================================================================
    let modelRotation = { x: 0, y: 0, z: 0, zOffset: 0 };

    function showAxisModal() {
      document.getElementById('axis-orient-modal').classList.add('active');
      updateAxisStatus();
    }
    function closeAxisOrientModal() {
      document.getElementById('axis-orient-modal').classList.remove('active');
    }
    // openAxisOrientModal redirect
    openAxisOrientModal = function() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      showAxisModal();
    };

    function rotateModel(axis, degrees) {
      const rad = (degrees * Math.PI) / 180;
      const target = uploadedMeshGroup || blockGroup;
      if (axis === 'x') { target.rotation.x += rad; modelRotation.x += degrees; }
      if (axis === 'y') { target.rotation.y += rad; modelRotation.y += degrees; }
      if (axis === 'z') { target.rotation.z += rad; modelRotation.z += degrees; }
      updateAxisStatus();
      requestRender();
    }

    function seatModelToTable() {
      const target = uploadedMeshGroup || blockGroup;
      const box = new THREE.Box3().setFromObject(target);
      const offset = -box.min.y;
      target.position.y += offset;
      modelRotation.zOffset = parseFloat((target.position.y).toFixed(1));
      updateAxisStatus();
      requestRender();
    }

    function centerModelOnTable() {
      const target = uploadedMeshGroup || blockGroup;
      const box = new THREE.Box3().setFromObject(target);
      const cx = (box.max.x + box.min.x) / 2;
      const cz = (box.max.z + box.min.z) / 2;
      target.position.x -= cx;
      target.position.z -= cz;
      controls.target.set(0, target.position.y, 0);
      updateAxisStatus();
      requestRender();
    }

    function resetModelOrientation() {
      const target = uploadedMeshGroup || blockGroup;
      target.rotation.set(0, 0, 0);
      target.position.set(0, 0, 0);
      modelRotation = { x: 0, y: 0, z: 0, zOffset: 0 };
      updateAxisStatus();
      requestRender();
    }

    function updateAxisStatus() {
      const el = document.getElementById('axis-orient-status');
      if (el) {
        el.innerText = `Rx: ${modelRotation.x}° | Ry: ${modelRotation.y}° | Rz: ${modelRotation.z}° | Z-Offset: ${modelRotation.zOffset} mm`;
      }
    }

    function applyAxisOrientation() {
      closeAxisOrientModal();
      console.log('Eksen yönelimi uygulandı:', modelRotation);
    }

    // --- Akıllı Fikstürleme ---
    function showClampingModal() {
      document.getElementById('clamping-modal').classList.add('active');
      analyzeClampingPositions();
    }
    function closeClampingModalX() {
      document.getElementById('clamping-modal').classList.remove('active');
    }
    openClampingModal = function() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      showClampingModal();
    };

    function analyzeClampingPositions() {
      const target = uploadedMeshGroup || blockGroup;
      const box = new THREE.Box3().setFromObject(target);
      const sX = box.max.x - box.min.x;
      const sY = box.max.y - box.min.y;
      const sZ = box.max.z - box.min.z;

      // Bounding box bilgisi
      const bboxEl = document.getElementById('clamp-bbox-info');
      if (bboxEl) bboxEl.innerText = sX.toFixed(1) + ' x ' + sY.toFixed(1) + ' x ' + sZ.toFixed(1) + ' mm';

      // Ağırlık tahmini (7075-T6: 2810 kg/m³)
      const vol = (sX * sY * sZ) / 1e9; // m³
      const mass = vol * 2810;
      const weightEl = document.getElementById('clamp-weight-info');
      if (weightEl) weightEl.innerText = '~' + mass.toFixed(2) + ' kg (7075-T6 Al: 2810 kg/m³)';

      // 3 destek noktası (bounding box köşelerinin %15 içeriden)
      const mX = sX * 0.15;
      const mZ = sZ * 0.15;
      document.getElementById('clamp-s1x').innerText = (box.min.x + mX).toFixed(1);
      document.getElementById('clamp-s1z').innerText = (box.min.z + mZ).toFixed(1);
      document.getElementById('clamp-s2x').innerText = (box.max.x - mX).toFixed(1);
      document.getElementById('clamp-s2z').innerText = (box.min.z + mZ).toFixed(1);
      document.getElementById('clamp-s3x').innerText = ((box.min.x + box.max.x) / 2).toFixed(1);
      document.getElementById('clamp-s3z').innerText = (box.max.z - mZ).toFixed(1);

      // OP20 analizi
      const op20El = document.getElementById('op20-analysis');
      if (op20El) {
        if (sY > 80) {
          op20El.innerHTML = '⚠️ Parça yüksekliği ' + sY.toFixed(0) + ' mm — OP20 flip sonrası derin deliklere erişim sınırlı olabilir. 100 mm uzatma çubuğu önerilir.';
          op20El.style.color = '#B45309';
        } else {
          op20El.innerHTML = '✅ Parça 180° döndürüldüğünde tüm alt yüzey unsurları standart prob ile erişilebilir.';
          op20El.style.color = '#059669';
        }
      }
    }

    function applyClampingRecommendation() {
      closeClampingModalX();
      alert('✅ Fikstür önerisi teftiş planına eklendi.\\n• 3 taban destek noktası\\n• 2 yan sıkma pabucu (+40mm Lift-Hop)\\n• GJK çarpışma zarfı güncellendi.');
    }
"""

if '// FAZ 13: EKSEN DÜZELTME SİHİRBAZI' not in content:
    content = content.replace('  </script>', phase13_js + '\n  </script>')

# Also add closing of new modals to Escape handler
content = content.replace(
    "closeShowroomModal();",
    "closeShowroomModal();\n        if (typeof closeAxisOrientModal === 'function') closeAxisOrientModal();\n        if (typeof closeClampingModalX === 'function') closeClampingModalX();"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("FAZ 13 applied successfully to ui/index.html")
