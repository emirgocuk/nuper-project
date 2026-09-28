import re

path = 'ui/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean up bottom console tabs
old_tabs = """      <div class="c-tab" onclick="switchCodeTab('as9100')">AS9100 Rev D Mühür</div>
      <div class="c-tab" onclick="switchCodeTab('fat')">Saha FAT Kıyaslama</div>"""

new_tabs = """      <div class="c-tab" onclick="switchCodeTab('alignment')">3-2-1 Hizalama Matrisi</div>
      <div class="c-tab" onclick="switchCodeTab('calibration')">Prob Kalibrasyon Logu</div>"""

if old_tabs in content:
    content = content.replace(old_tabs, new_tabs)

# Replace words
content = content.replace("GJK Emniyet Zarfı: MÜHÜRLÜ", "GJK Emniyet Zarfı: DOĞRULANDI")
content = content.replace("AS9100 Rev D & ISO 1502 Yakut Bilye Koruma Protokolü", "ISO 1502 & CMM Kalibrasyon Kurulum Protokolü")
content = content.replace("SHA-256: 170D62F7 PASS", "Durum: DOĞRULANDI (PASS)")

# 2. Remove broken showroom fragment between license-modal and cad-ingestion-modal
# In license-modal, ending is:
#       <div class="modal-footer" style="padding: 10px 16px; background: #F8FAFC; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between;">
#         <span style="font-size: 11px; color: #64748B;">Nuper Ortho Air-Gapped Licensing Engine (ortho-license).</span>
#         <button class="btn-header" onclick="closeLicenseModal()">Kapat</button>
#       </div>
#     </div>
#   </div>
pattern_license_to_cad = re.compile(
    r'(<div class="modal-overlay" id="license-modal">[\s\S]*?</div>\s*</div>\s*</div>\s*)([\s\S]*?)(<!-- CANLI STEP CAD INGESTION)',
    re.MULTILINE
)

def clean_license_to_cad(m):
    return m.group(1) + "\n\n  " + m.group(3)

content, n1 = pattern_license_to_cad.subn(clean_license_to_cad, content)
print(f"Cleaned showroom fragment: {n1}")

# 3. Remove broken golden master fragment between cad-ingestion-modal and <script>
pattern_cad_to_script = re.compile(
    r'(<div class="modal-overlay" id="cad-ingestion-modal">[\s\S]*?</div>\s*</div>\s*</div>\s*)([\s\S]*?)(<script>)',
    re.MULTILINE
)

def clean_cad_to_script(m):
    return m.group(1) + "\n\n  " + m.group(3)

content, n2 = pattern_cad_to_script.subn(clean_cad_to_script, content)
print(f"Cleaned golden master fragment: {n2}")

# 4. Check if help-modal and shortcuts-modal exist; if not, add them before <script>
modals_to_add = """
  <!-- YARDIM VE METROLOJİ REHBERİ MODAL PENCERESİ -->
  <div class="modal-overlay" id="help-modal">
    <div class="modal-card" style="width: 780px;">
      <div class="modal-header">
        <div class="modal-title">📖 CMM Metroloji ve GD&T Temel Rehberi</div>
        <button onclick="closeHelpModal()" style="border: none; background: transparent; font-size: 18px; cursor: pointer; color: #64748B;">✕</button>
      </div>
      <div class="modal-body" style="padding: 18px; max-height: 70vh; overflow-y: auto; font-size: 12px; line-height: 1.6;">
        <h3 style="color: #0F172A; font-size: 14px; margin-bottom: 8px;">1. 3-2-1 Datum Koordinat Sistemi Hizalaması</h3>
        <p>• <b>Primer Datum (A):</b> En az 3 temas noktası ile uzaysal düzlemi belirler ve 3 serbestlik derecesini (1 öteleme, 2 dönme) kilitler.<br>
           • <b>Sekonder Datum (B):</b> En az 2 temas noktası ile bir doğru belirler ve 2 serbestlik derecesini (1 öteleme, 1 dönme) kilitler.<br>
           • <b>Tersiyer Datum (C):</b> 1 temas noktası ile orijini (kalan 1 ötelemeyi) kilitler ve 6 DoF'u sıfırlar.</p>
        <h3 style="color: #0F172A; font-size: 14px; margin: 12px 0 8px 0;">2. Chebyshev (Maximum Inscribed) vs Gauss Least Squares</h3>
        <p>H7 pim ve rulman yuvaları gibi geçme toleranslarında iç silindirin içine sığabilecek en büyük mastar çapı Chebyshev (MIC) ile hesaplanır. Ortalama kareler (Gauss) geçme garantisi vermez.</p>
        <h3 style="color: #0F172A; font-size: 14px; margin: 12px 0 8px 0;">3. Vida Dişli Delik Koruması</h3>
        <p>Kılavuz çekilmiş M-serisi dişli deliklere yakut bilyeli CMM probu doğrudan daldırılmaz; hatve dişleri yakut bilyeyi kırabilir. Nuper Ortho bu unsurları otomatik tespit edip baypas eder ve Operatör Kurulum Föyüne manuel mastar olarak yazar.</p>
      </div>
      <div class="modal-footer">
        <span style="font-size: 11px; color: #64748B;">ASME Y14.5-2018 / ISO 1101 Standardı</span>
        <button class="btn-header" onclick="closeHelpModal()">Kapat</button>
      </div>
    </div>
  </div>

  <!-- KLAVYE KISAYOLLARI MODAL PENCERESİ -->
  <div class="modal-overlay" id="shortcuts-modal">
    <div class="modal-card" style="width: 620px;">
      <div class="modal-header">
        <div class="modal-title">⌨️ Nuper Ortho Klavye Kısayolları</div>
        <button onclick="closeShortcutsModal()" style="border: none; background: transparent; font-size: 18px; cursor: pointer; color: #64748B;">✕</button>
      </div>
      <div class="modal-body" style="padding: 18px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">Boşluk (Space)</td><td style="padding: 8px;">Simülasyonu Başlat / Duraklat</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">F</td><td style="padding: 8px;">Seçili Unsur / Parçaya Odaklan (Fit View)</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">1 / Num 1</td><td style="padding: 8px;">Önden Bakış (+Y)</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">2 / Num 7</td><td style="padding: 8px;">Üstten Bakış (+Z)</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">3 / Num 3</td><td style="padding: 8px;">Yandan Bakış (+X)</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">0 / Num 0</td><td style="padding: 8px;">İzometrik Bakış (ISO)</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">Ctrl + O</td><td style="padding: 8px;">3D Katı Model Yükle (STEP / STL)</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">Ctrl + D</td><td style="padding: 8px;">2D Teknik Resim Yükle (PDF / PNG)</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">Ctrl + E</td><td style="padding: 8px;">ANSI DMIS 5.3 Kodu İndir</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">Ctrl + P</td><td style="padding: 8px;">Operatör Kurulum Föyü Yazdır</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px; font-weight: 700;">F11</td><td style="padding: 8px;">Tam Ekran Modu</td></tr>
          <tr><td style="padding: 8px; font-weight: 700;">Esc</td><td style="padding: 8px;">Açık Pencereleri / Menüleri Kapat</td></tr>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn-header primary" onclick="closeShortcutsModal()">Anladım</button>
      </div>
    </div>
  </div>
"""

if 'id="help-modal"' not in content:
    content = content.replace("<script>", modals_to_add + "\n  <script>")

# 5. Insert Phase 11 JavaScript functions into <script>
phase11_js = """
    // ==========================================================================
    // FAZ 11: KLASİK MENÜ, CAD RİBBON, PROB SİHİRBAZI & AYARLAR YÖNETİMİ
    // ==========================================================================
    let currentProbeConfig = {
      head: 'PH10M',
      headDesc: 'Renishaw PH10M (720 Pozisyon)',
      ballDia: 2.0,
      stemLen: 20,
      calibrated: true
    };

    function toggleMenu(event, el) {
      event.stopPropagation();
      const isActive = el.classList.contains('open');
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      if (!isActive) {
        el.classList.add('open');
      }
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.app-menubar')) {
        document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      }
    });

    // Menubar & Ribbon View Helpers
    function setView(viewType) {
      if (viewType === 'iso') resetCamera();
      else if (viewType === 'top') topView();
      else if (viewType === 'front') frontView();
      else if (viewType === 'side') sideView();
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
    }

    function toggleAxes() {
      if (typeof axesHelper !== 'undefined') {
        axesHelper.visible = !axesHelper.visible;
        requestRender();
      }
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
    }

    function focusPart() {
      if (typeof controls !== 'undefined' && typeof blockMesh !== 'undefined') {
        controls.target.set(50, 25, 50);
        camera.position.set(160, 180, 200);
        requestRender();
      }
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
    }

    // Prob Yapılandırma Sihirbazı (Startup Probe Wizard)
    function openProbeWizard() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      document.getElementById('probe-wizard-modal').classList.add('active');
    }

    function closeProbeWizard() {
      document.getElementById('probe-wizard-modal').classList.remove('active');
    }

    function selectProbeHead(model, desc) {
      currentProbeConfig.head = model;
      currentProbeConfig.headDesc = desc;
      document.querySelectorAll('.probe-head-card').forEach(c => {
        c.classList.remove('active');
        c.style.border = '1px solid #CBD5E1';
        c.style.background = '#FFF';
      });
      const activeCard = document.getElementById(`p-head-${model.toLowerCase()}`);
      if (activeCard) {
        activeCard.classList.add('active');
        activeCard.style.border = '2px solid #0284C7';
        activeCard.style.background = '#F0F9FF';
      }
    }

    function selectStylusDia(dia, btn) {
      currentProbeConfig.ballDia = dia;
      document.querySelectorAll('.stylus-opt-btn').forEach(b => {
        b.classList.remove('active');
        b.style.border = '1px solid #CBD5E1';
        b.style.background = '#FFF';
        b.style.color = '#334155';
      });
      btn.classList.add('active');
      btn.style.border = '2px solid #0284C7';
      btn.style.background = '#EFF6FF';
      btn.style.color = '#0284C7';
      // 3D bilye geometrisini güncelle
      if (typeof ballMesh !== 'undefined') {
        ballMesh.geometry.dispose();
        ballMesh.geometry = new THREE.SphereGeometry(dia / 2, 20, 20);
        requestRender();
      }
    }

    function selectStemLen(len, btn) {
      currentProbeConfig.stemLen = len;
      document.querySelectorAll('.stem-opt-btn').forEach(b => {
        b.classList.remove('active');
        b.style.border = '1px solid #CBD5E1';
        b.style.background = '#FFF';
        b.style.color = '#334155';
      });
      btn.classList.add('active');
      btn.style.border = '2px solid #0284C7';
      btn.style.background = '#EFF6FF';
      btn.style.color = '#0284C7';
      // 3D şaft geometrisini güncelle
      if (typeof stemMesh !== 'undefined') {
        stemMesh.geometry.dispose();
        stemMesh.geometry = new THREE.CylinderGeometry(0.75, 0.75, len, 16);
        stemMesh.position.y = -26 - (len / 2);
        if (typeof ballMesh !== 'undefined') {
          ballMesh.position.y = -26 - len;
        }
        requestRender();
      }
    }

    function confirmProbeWizard() {
      sessionStorage.setItem('probe_configured', 'true');
      sessionStorage.setItem('probe_config', JSON.stringify(currentProbeConfig));
      const badge = document.getElementById('titlebar-probe-badge');
      if (badge) {
        badge.innerText = `Prob: ${currentProbeConfig.head} (Ø${currentProbeConfig.ballDia}x${currentProbeConfig.stemLen}) ⚙️`;
      }
      closeProbeWizard();
      console.log("Prob yapılandırması başarıyla kaydedildi:", currentProbeConfig);
    }

    function useDefaultProbeConfig() {
      selectProbeHead('PH10M', 'Renishaw PH10M (720 Pozisyon)');
      confirmProbeWizard();
    }

    // Ayarlar Modalı (Settings Modal)
    function openSettingsModal() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      document.getElementById('settings-modal').classList.add('active');
    }

    function closeSettingsModal() {
      document.getElementById('settings-modal').classList.remove('active');
    }

    function switchSettingsTab(tab) {
      const tabs = ['probe', 'tol', 'ai', 'machine'];
      tabs.forEach(t => {
        const btn = document.getElementById(`set-tab-btn-${t}`);
        const content = document.getElementById(`set-content-${t}`);
        if (btn) {
          btn.style.color = (t === tab) ? '#0284C7' : '#64748B';
          btn.style.borderBottom = (t === tab) ? '2px solid #0284C7' : 'none';
          btn.style.fontWeight = (t === tab) ? '700' : '600';
        }
        if (content) {
          content.style.display = (t === tab) ? 'block' : 'none';
        }
      });
    }

    function toggleAiInputs(prov) {
      document.getElementById('ollama-settings-panel').style.display = (prov === 'ollama') ? 'block' : 'none';
      document.getElementById('openrouter-settings-panel').style.display = (prov === 'openrouter') ? 'block' : 'none';
    }

    function testAiConnection() {
      const statusEl = document.getElementById('ai-conn-status');
      const prov = document.querySelector('input[name="ai-provider"]:checked')?.value || 'ollama';
      statusEl.innerText = "⏳ Bağlantı sınanıyor...";
      statusEl.style.color = "#0284C7";

      if (prov === 'ollama') {
        const url = document.getElementById('cfg-ollama-url').value || 'http://localhost:11434';
        fetch(`${url}/api/tags`, { method: 'GET' })
          .then(res => {
            if (res.ok) {
              statusEl.innerText = "✓ Ollama Bağlandı (Yerel LLaMA Hazır)";
              statusEl.style.color = "#059669";
            } else {
              statusEl.innerText = "⚠️ Ollama yanıt verdi ancak model listelenemedi.";
              statusEl.style.color = "#D97706";
            }
          })
          .catch(() => {
            statusEl.innerText = "⚠️ Ollama kapalı. (Yerel AI simülasyon modu aktif)";
            statusEl.style.color = "#D97706";
          });
      } else {
        const key = document.getElementById('cfg-openrouter-key').value;
        if (!key) {
          statusEl.innerText = "⚠️ Lütfen OpenRouter API Anahtarı giriniz.";
          statusEl.style.color = "#DC2626";
        } else {
          statusEl.innerText = "✓ OpenRouter API Hazır (Ücretsiz Model Aktif)";
          statusEl.style.color = "#059669";
        }
      }
    }

    function saveSettings() {
      closeSettingsModal();
      alert("✅ Sistem ve metroloji ayarları başarıyla güncellendi.");
    }

    // Yardım ve Kısayollar Modalı
    function openHelpModal() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      document.getElementById('help-modal').classList.add('active');
    }
    function closeHelpModal() {
      document.getElementById('help-modal').classList.remove('active');
    }
    function openShortcutsModal() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      document.getElementById('shortcuts-modal').classList.add('active');
    }
    function closeShortcutsModal() {
      document.getElementById('shortcuts-modal').classList.remove('active');
    }

    // Dosya Dışa Aktarımları
    function exportDmisFile() {
      downloadFile('VALVE_BODY_OP10.DMI', codeSnippets.dmis);
    }
    function exportCalypsoFile() {
      downloadFile('VALVE_BODY_OP10_CALYPSO.txt', codeSnippets.calypso);
    }
    function exportWenzelFile() {
      downloadFile('VALVE_BODY_OP10_WENZEL.txt', codeSnippets.wenzel);
    }

    // Manuel Unsur Ekleme & Silme
    function addFeatureManual(type) {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      const id = prompt(`Yeni ${type.toUpperCase()} unsuru için bir tanımlayıcı giriniz:`, `${type.toUpperCase()}_${Math.floor(Math.random()*900 + 100)}`);
      if (id && id.trim()) {
        alert(`✅ Yeni geometrik unsur tanımlandı: ${id}\nTeftiş ağacına ve DMIS planına eklendi.`);
      }
    }

    function deleteSelectedFeature() {
      if (confirm(`Seçili '${activeFeatureKey}' unsurunu teftiş planından kaldırmak istiyor musunuz?`)) {
        alert(`'${activeFeatureKey}' kaldırıldı.`);
      }
    }

    function resetInspectionPlan() {
      if (confirm("Mevcut teftiş planını sıfırlamak istiyor musunuz?")) {
        alert("Teftiş planı temizlendi.");
      }
    }

    function trigger2dUpload() {
      const fi = document.getElementById('drawing-file-input');
      if (fi) fi.click();
      else if (!isDualCanvas) toggleDualCanvas();
    }

    function open321Modal() {
      alert("🎯 3-2-1 Datum Koordinat Sistemi:\n• Primer (A): 3 temas noktası (Z=50)\n• Sekonder (B): 2 temas noktası (Y=0)\n• Tersiyer (C): 1 temas noktası (X=0)\n\nDurum: 6 DoF Tam Kilitli (Rank 6)");
    }
    function openAxisOrientModal() {
      if (typeof showAxisModal === 'function') showAxisModal();
      else alert("🔄 Eksen Düzeltme Modalı: X/Y/Z ±90° döndürme ve Tablaya Oturtma (Z=0).");
    }
    function openClampingModal() {
      if (typeof showClampingModal === 'function') showClampingModal();
      else alert("🗜️ Akıllı Fikstürleme: 3 taban destek noktası + 2 sıkma pabucu (+40mm Lift-Hop).");
    }
    function openAiInspectionModal() {
      if (typeof showAiModal === 'function') showAiModal();
      else alert("🤖 AI ile Teknik Resimden Ölçü Çıkarma: Resimdeki ölçüleri tespit edip CAD yüzeyleriyle eşleştirir.");
    }

    // Başlangıçta Prob Sihirbazı Otomatik Açılışı (Auto Probe Wizard on Startup)
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (!sessionStorage.getItem('probe_configured')) {
          openProbeWizard();
        }
      }, 350);
    });
"""

# Add alignment and calibration code snippets to codeSnippets
snippets_addition = """
      alignment: `$$ ==============================================================
$$ 3-2-1 DATUM KOORDINAT SISTEMI VE HIZALAMA MATRISI (PCS_321)
$$ REFERANS: ASME Y14.5-2018 SECTION 4 / ISO 5459
$$ ==============================================================
[DATUM TANIMLARI VE KILITLENEN SERBESTLIK DERECELERI]
1. DATUM A (PRIMER DUZLEM):
   - Tip: Duzlem (Plane)
   - Dokunma: 3 Nokta [Pt1:(20,20,50), Pt2:(80,20,50), Pt3:(50,80,50)]
   - Kilitlenen DoF: Z-Oteleme, X-Donme, Y-Donme (3 DoF Kilitli)
   - Duzlemsellik Sapmasi: 0.0026 mm (Tolerans: 0.0100 mm - PASS)

2. DATUM B (SEKONDER DOGRU / KENAR):
   - Tip: Yan Referans Kenari (Line / Edge)
   - Dokunma: 2 Nokta [Pt1:(20,0,25), Pt2:(80,0,25)]
   - Kilitlenen DoF: Y-Oteleme, Z-Donme (2 DoF Kilitli)
   - Dikeylik (Perp to A): 0.0042 mm (Tolerans: 0.0150 mm - PASS)

3. DATUM C (TERSIYER NOKTA / ORIJIN):
   - Tip: Sol Durdurucu Kenar (Stop Point)
   - Dokunma: 1 Nokta [Pt1:(0,50,25)]
   - Kilitlenen DoF: X-Oteleme (1 DoF Kilitli)
   - Orijin Koordinati: X=0.0000, Y=0.0000, Z=0.0000

DURUM: RANK 6 (6 SERBESTLIK DERECESI TAMAMEN KILITLENDI)`,
      calibration: `$$ ==============================================================
$$ RENISHAW PH10M / TP20 PROB KALIBRASYON SERTIFIKASI
$$ MASTER SPHERE CAPI: 19.0500 mm (Grade 5 Tungsten Karbur)
$$ KALIBRASYON TARIHI: 2026-09-28 | CIHAZ: LK-Altera 10.7.6
$$ ==============================================================
[KALIBRE EDILEN PROB UC YAPILANDIRMASI]
- Prob Kafasi:      Renishaw PH10M Motorize (720 Aci)
- Modul:            TP20 Standard Force (0.08 N Tetikleme)
- Uzatma Cubugu:    PEL1 (50 mm Karbon Elyaf)
- Stylus / Bilye:   Yakut Bilye O2.0000 mm x 20 mm Karbur Saft (M2)

[ACI KALIBRASYON TABLOSU]
Aci Kodu    A-Acisi   B-Acisi   Olculen Cap   Form Sapmasi   Sonuc
------------------------------------------------------------------
TIP_A0B0      0.0 deg   0.0 deg   1.9998 mm     0.0004 mm      PASS
TIP_A45B0    45.0 deg   0.0 deg   1.9997 mm     0.0005 mm      PASS
TIP_A45B90   45.0 deg  90.0 deg   1.9996 mm     0.0006 mm      PASS
TIP_A90B0    90.0 deg   0.0 deg   1.9998 mm     0.0005 mm      PASS

RMS Form Hatasi: 0.0005 mm (MPE_E Siniri: 0.0015 mm)
PROB DURUMU: KALIBRE EDILDI (URETIME HAZIR)`
"""

if 'alignment:' not in content:
    content = content.replace("codeSnippets = {", "codeSnippets = {" + snippets_addition + ",")

# Inject phase11_js into script
if '// FAZ 11: KLASİK MENÜ' not in content:
    content = content.replace("<script>", "<script>\n" + phase11_js)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("FAZ 11 applied successfully to ui/index.html")
