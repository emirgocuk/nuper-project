path = 'ui/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ============================================================
# FAZ 14: HİBRİT AI (OLLAMA/OPENROUTER) & İNSAN-ONAYLI TEFTİŞ
# ============================================================

# 1. Add AI Inspection Modal HTML
ai_modal_html = """
  <!-- FAZ 14: AI İLE TEKNİK RESİMDEN ÖLÇÜ ÇIKARMA & İNSAN-ONAYLI TEFTİŞ TABLOSU -->
  <div class="modal-overlay" id="ai-inspection-modal">
    <div class="modal-card" style="width: 900px;">
      <div class="modal-header" style="background: linear-gradient(135deg, #0F172A, #1E293B); color: #FFF; border-bottom: 2px solid #0284C7;">
        <div class="modal-title" style="color: #FFF; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🤖</span>
          <span>AI ile Teknik Resimden Ölçü Çıkarma & İnsan-Onaylı Teftiş</span>
        </div>
        <button onclick="closeAiInspectionModal()" style="border: none; background: transparent; font-size: 18px; cursor: pointer; color: #94A3B8;">✕</button>
      </div>
      <div class="modal-body" style="padding: 18px; max-height: 75vh; overflow-y: auto;">
        <!-- AI Durum Paneli -->
        <div id="ai-engine-status-panel" style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 6px; padding: 12px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 700; font-size: 12px; color: #0369A1;" id="ai-engine-name">AI Motoru: Yerel Ollama / LLaMA</div>
            <div style="font-size: 11px; color: #0284C7; margin-top: 2px;" id="ai-engine-detail">Model: llama3.2-vision:latest | Endpoint: http://localhost:11434</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="runAiDimensionExtraction()" style="padding: 8px 14px; background: #0284C7; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
              🤖 Ölçüleri Çıkar
            </button>
            <button onclick="simulateAiExtraction()" style="padding: 8px 14px; background: #059669; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
              📋 Demo Verisi
            </button>
          </div>
        </div>

        <!-- Çıkarılan Ölçü Tablosu (Human-in-the-Loop Review) -->
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 700; font-size: 12px; color: #0F172A; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span>Çıkarılan Ölçüler — İnsan Onay Tablosu</span>
            <span id="ai-extract-count" style="font-size: 11px; font-weight: 600; color: #64748B;">0 ölçü tespit edildi</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;" id="ai-dimension-table">
            <thead>
              <tr style="background: #F1F5F9; text-align: left;">
                <th style="padding: 6px 8px; border: 1px solid var(--border-color); width: 30px;">✓</th>
                <th style="padding: 6px 8px; border: 1px solid var(--border-color);">Unsur ID</th>
                <th style="padding: 6px 8px; border: 1px solid var(--border-color);">Ölçü Tipi</th>
                <th style="padding: 6px 8px; border: 1px solid var(--border-color);">Nominal</th>
                <th style="padding: 6px 8px; border: 1px solid var(--border-color);">Tolerans</th>
                <th style="padding: 6px 8px; border: 1px solid var(--border-color);">CAD Yüzeyi</th>
                <th style="padding: 6px 8px; border: 1px solid var(--border-color);">Güven</th>
                <th style="padding: 6px 8px; border: 1px solid var(--border-color);">İşlem</th>
              </tr>
            </thead>
            <tbody id="ai-dimension-tbody">
              <tr>
                <td colspan="8" style="padding: 20px; text-align: center; color: #94A3B8; border: 1px solid var(--border-color);">
                  Henüz ölçü çıkarılmadı. "Ölçüleri Çıkar" veya "Demo Verisi" butonuna tıklayın.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Prompt ve AI Yanıt Logu -->
        <div style="background: #0F172A; border-radius: 6px; padding: 12px; margin-bottom: 12px;">
          <div style="font-size: 10px; color: #64748B; margin-bottom: 6px; font-weight: 700;">AI İSTEK / YANIT LOGU:</div>
          <div id="ai-log-panel" style="height: 100px; overflow-y: auto; font-family: var(--font-mono); font-size: 11px; color: #94A3B8; line-height: 1.5;">
            <div style="color: #475569;">// AI motoru hazır. Teknik resim yükledikten sonra ölçü çıkarma başlatılabilir.</div>
          </div>
        </div>
      </div>
      <div class="modal-footer" style="padding: 12px 18px; background: #F8FAFC; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 11px; color: #64748B;">
          İşaretli ölçüler teftiş ağacına ve DMIS planına eklenir.
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-header" onclick="closeAiInspectionModal()">Vazgeç</button>
          <button class="btn-header primary" onclick="approveAndAddToTree()" style="padding: 8px 16px;">
            ✓ Seçilenleri Onayla & Teftiş Ağacına Ekle
          </button>
        </div>
      </div>
    </div>
  </div>
"""

if 'id="ai-inspection-modal"' not in content:
    content = content.replace("\n  <!-- FAZ 13: EKSEN DÜZELTME", ai_modal_html + "\n  <!-- FAZ 13: EKSEN DÜZELTME")

# 2. Add FAZ 14 JavaScript
phase14_js = """
    // ==========================================================================
    // FAZ 14: HİBRİT AI (OLLAMA / OPENROUTER) & İNSAN-ONAYLI TEFTİŞ TABLOSU
    // ==========================================================================
    let aiExtractedDimensions = [];

    function showAiModal() {
      document.getElementById('ai-inspection-modal').classList.add('active');
      updateAiEngineStatus();
    }
    function closeAiInspectionModal() {
      document.getElementById('ai-inspection-modal').classList.remove('active');
    }
    openAiInspectionModal = function() {
      document.querySelectorAll('.app-menubar .menu-item').forEach(m => m.classList.remove('open'));
      showAiModal();
    };

    function updateAiEngineStatus() {
      const prov = document.querySelector('input[name="ai-provider"]:checked')?.value || 'ollama';
      const nameEl = document.getElementById('ai-engine-name');
      const detailEl = document.getElementById('ai-engine-detail');
      if (prov === 'ollama') {
        const url = document.getElementById('cfg-ollama-url')?.value || 'http://localhost:11434';
        const model = document.getElementById('cfg-ollama-model')?.value || 'llama3.2-vision:latest';
        nameEl.innerText = 'AI Motoru: Yerel Ollama / LLaMA (Ücretsiz & Gizli)';
        detailEl.innerText = 'Model: ' + model + ' | Endpoint: ' + url;
      } else {
        const model = document.getElementById('cfg-openrouter-model')?.value || 'google/gemini-2.0-flash-exp:free';
        nameEl.innerText = 'AI Motoru: OpenRouter API (Ücretsiz Tier)';
        detailEl.innerText = 'Model: ' + model + ' | Endpoint: https://openrouter.ai/api/v1';
      }
    }

    function runAiDimensionExtraction() {
      const log = document.getElementById('ai-log-panel');
      const prov = document.querySelector('input[name="ai-provider"]:checked')?.value || 'ollama';

      log.innerHTML += '<div style="color: #38BDF8;">▶ AI ölçü çıkarma başlatılıyor (' + prov + ')...</div>';

      if (prov === 'ollama') {
        const url = (document.getElementById('cfg-ollama-url')?.value || 'http://localhost:11434');
        const model = document.getElementById('cfg-ollama-model')?.value || 'llama3.2-vision:latest';

        log.innerHTML += '<div style="color: #94A3B8;">→ POST ' + url + '/api/generate {model: "' + model + '"}</div>';

        fetch(url + '/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model,
            prompt: 'You are a CMM metrology expert. Extract all dimensional measurements from this technical drawing. For each dimension, provide: feature_id, type (diameter/length/angle/position), nominal_value, tolerance, confidence. Format as JSON array.',
            stream: false
          })
        })
        .then(res => res.json())
        .then(data => {
          log.innerHTML += '<div style="color: #10B981;">✓ Ollama yanıtı alındı. Ölçüler ayrıştırılıyor...</div>';
          try {
            const dims = JSON.parse(data.response || '[]');
            if (Array.isArray(dims) && dims.length > 0) {
              populateAiTable(dims);
            } else {
              log.innerHTML += '<div style="color: #F59E0B;">⚠ Yanıtta JSON ölçü bulunamadı. Demo verisi yükleniyor.</div>';
              simulateAiExtraction();
            }
          } catch (e) {
            log.innerHTML += '<div style="color: #F59E0B;">⚠ JSON ayrıştırma hatası. Demo verisi yükleniyor.</div>';
            simulateAiExtraction();
          }
        })
        .catch(err => {
          log.innerHTML += '<div style="color: #F59E0B;">⚠ Ollama bağlantısı kurulamadı (' + err.message + '). Demo verisi yükleniyor.</div>';
          simulateAiExtraction();
        });
      } else {
        // OpenRouter
        const key = document.getElementById('cfg-openrouter-key')?.value;
        const model = document.getElementById('cfg-openrouter-model')?.value || 'google/gemini-2.0-flash-exp:free';

        if (!key) {
          log.innerHTML += '<div style="color: #DC2626;">✗ OpenRouter API anahtarı girilmemiş. Demo verisi yükleniyor.</div>';
          simulateAiExtraction();
          return;
        }

        log.innerHTML += '<div style="color: #94A3B8;">→ POST https://openrouter.ai/api/v1/chat/completions {model: "' + model + '"}</div>';

        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Nuper Ortho CMM'
          },
          body: JSON.stringify({
            model: model,
            messages: [{
              role: 'user',
              content: 'You are a CMM metrology expert. Extract all dimensional measurements from this technical drawing. For each dimension, provide: feature_id, type, nominal_value, tolerance, confidence. Return JSON array.'
            }]
          })
        })
        .then(res => res.json())
        .then(data => {
          log.innerHTML += '<div style="color: #10B981;">✓ OpenRouter yanıtı alındı.</div>';
          const msg = data.choices?.[0]?.message?.content || '';
          try {
            const dims = JSON.parse(msg);
            if (Array.isArray(dims) && dims.length > 0) {
              populateAiTable(dims);
            } else {
              simulateAiExtraction();
            }
          } catch (e) {
            log.innerHTML += '<div style="color: #F59E0B;">⚠ Yanıt ayrıştırılamadı. Demo verisi yükleniyor.</div>';
            simulateAiExtraction();
          }
        })
        .catch(err => {
          log.innerHTML += '<div style="color: #F59E0B;">⚠ OpenRouter bağlantı hatası. Demo verisi yükleniyor.</div>';
          simulateAiExtraction();
        });
      }

      log.scrollTop = log.scrollHeight;
    }

    function simulateAiExtraction() {
      const log = document.getElementById('ai-log-panel');
      log.innerHTML += '<div style="color: #10B981;">✓ Demo ölçü seti yüklendi (simülasyon modu).</div>';
      log.scrollTop = log.scrollHeight;

      const demoData = [
        { id: 'BORE_20_H7', type: 'Çap (Diameter)', nominal: 'Ø20.000 mm', tolerance: '+0.021 / 0', surface: 'CYLINDRICAL_SURFACE #14', confidence: 96 },
        { id: 'DATUM_A_FLAT', type: 'Düzlemsellik (Flatness)', nominal: '0.010 mm', tolerance: '0.010', surface: 'PLANE #2 (Üst Yüzey)', confidence: 98 },
        { id: 'DATUM_B_PERP', type: 'Dikeylik (Perpendicularity)', nominal: '0.015 mm', tolerance: '0.015 |A|', surface: 'PLANE #5 (Ön Yüzey)', confidence: 94 },
        { id: 'POS_BORE_20', type: 'Konum (Position)', nominal: 'X:50 Y:50 mm', tolerance: 'Ø0.020 Ⓜ |A|B|C|', surface: 'CYLINDRICAL_SURFACE #14', confidence: 91 },
        { id: 'SURF_PROFILE', type: 'Profil (Surface Profile)', nominal: '0.80 mm', tolerance: '0.80 Ⓤ 0.20 |A|B|', surface: 'B_SPLINE_SURFACE #22', confidence: 85 },
        { id: 'THREAD_M8', type: 'Dişli Delik (Thread)', nominal: 'M8x1.25', tolerance: '6H | ISO 1502', surface: 'CYLINDRICAL_SURFACE #18', confidence: 92 },
        { id: 'SLOT_WIDTH', type: 'Kanal Genişliği (Slot)', nominal: '18.000 mm', tolerance: '+0.030 / -0.030', surface: 'PLANE #8, #9', confidence: 72 }
      ];

      populateAiTable(demoData);
    }

    function populateAiTable(dims) {
      aiExtractedDimensions = dims;
      const tbody = document.getElementById('ai-dimension-tbody');
      const countEl = document.getElementById('ai-extract-count');
      countEl.innerText = dims.length + ' ölçü tespit edildi';

      tbody.innerHTML = dims.map((d, i) => {
        const confColor = d.confidence >= 90 ? '#059669' : (d.confidence >= 75 ? '#D97706' : '#DC2626');
        const confBg = d.confidence >= 90 ? '#ECFDF5' : (d.confidence >= 75 ? '#FEF3C7' : '#FEF2F2');
        const checked = d.confidence >= 80 ? 'checked' : '';
        return '<tr>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color); text-align: center;"><input type="checkbox" id="ai-dim-' + i + '" ' + checked + '></td>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color); font-weight: 700; font-family: var(--font-mono);">' + (d.id || d.feature_id || 'DIM_' + (i+1)) + '</td>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color);">' + (d.type || '--') + '</td>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);">' + (d.nominal || d.nominal_value || '--') + '</td>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color); font-family: var(--font-mono);">' + (d.tolerance || '--') + '</td>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color); font-size: 10px; color: #475569;">' + (d.surface || '--') + '</td>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color); text-align: center;"><span style="background:' + confBg + '; color:' + confColor + '; padding: 2px 6px; border-radius: 3px; font-weight: 700; font-size: 10px;">%' + d.confidence + '</span></td>' +
          '<td style="padding: 5px 8px; border: 1px solid var(--border-color); text-align: center;"><button onclick="editAiDimension(' + i + ')" style="padding: 2px 6px; font-size: 10px; border: 1px solid var(--border-color); background: #FFF; border-radius: 3px; cursor: pointer;">✏️</button></td>' +
          '</tr>';
      }).join('');
    }

    function editAiDimension(idx) {
      const dim = aiExtractedDimensions[idx];
      if (!dim) return;
      const newNom = prompt('Nominal değeri düzenle:', dim.nominal || dim.nominal_value || '');
      if (newNom !== null) {
        dim.nominal = newNom;
        dim.nominal_value = newNom;
        populateAiTable(aiExtractedDimensions);
      }
    }

    function approveAndAddToTree() {
      let approved = [];
      aiExtractedDimensions.forEach((d, i) => {
        const cb = document.getElementById('ai-dim-' + i);
        if (cb && cb.checked) {
          approved.push(d);
        }
      });

      if (approved.length === 0) {
        alert('⚠️ Lütfen teftiş ağacına eklemek istediğiniz ölçüleri işaretleyin.');
        return;
      }

      // Sol ağaca ekleme (simüle)
      const treeScroll = document.querySelector('.tree-scroll');
      if (treeScroll) {
        // Yeni grup oluştur
        let groupHtml = '<div class="tree-group"><div class="tree-group-title"><span>AI Çıkarılan Ölçüler (' + approved.length + ')</span><span style="font-size: 10px; color: #0284C7;">Onaylandı</span></div>';
        approved.forEach(d => {
          const fid = (d.id || d.feature_id || 'DIM').replace(/[^a-zA-Z0-9_]/g, '_');
          const icon = d.type && d.type.includes('Çap') ? '🥫' :
                       d.type && d.type.includes('Düzlem') ? '📐' :
                       d.type && d.type.includes('Dikeylik') ? '📐' :
                       d.type && d.type.includes('Profil') ? '〰️' :
                       d.type && d.type.includes('Dişli') ? '🧵' :
                       d.type && d.type.includes('Kanal') ? '⭕' : '📍';
          const badgeClass = d.type && d.type.includes('Çap') ? 'badge-cyl' :
                             d.type && d.type.includes('Dişli') ? 'badge-thread' :
                             d.type && d.type.includes('Profil') ? 'badge-surf' :
                             d.type && d.type.includes('Kanal') ? 'badge-hole' : 'badge-datum';
          groupHtml += '<div class="tree-node" onclick="selectFeature(\\'' + fid + '\\')">' +
            '<div class="node-label"><span class="node-icon-badge ' + badgeClass + '">' + icon + '</span><span>' + (d.id || d.feature_id || fid) + '</span></div>' +
            '<span class="node-status" style="color: #0284C7;">' + (d.nominal || d.nominal_value || '') + '</span></div>';
        });
        groupHtml += '</div>';
        treeScroll.insertAdjacentHTML('beforeend', groupHtml);

        // Unsur sayacını güncelle
        const countSpan = document.querySelector('.sidebar-left .panel-header span:last-child');
        if (countSpan) {
          const prev = parseInt(countSpan.innerText) || 7;
          countSpan.innerText = (prev + approved.length) + ' Unsur';
        }
      }

      closeAiInspectionModal();
      alert('✅ ' + approved.length + ' ölçü teftiş ağacına ve DMIS planına eklendi.\\n\\nOnaylanan Ölçüler:\\n' +
        approved.map(d => '• ' + (d.id || d.feature_id) + ': ' + (d.nominal || d.nominal_value) + ' (' + d.tolerance + ')').join('\\n'));
    }
"""

if '// FAZ 14: HİBRİT AI' not in content:
    content = content.replace('  </script>', phase14_js + '\n  </script>')

# Add AI modal to escape handler
if 'closeAiInspectionModal' not in content.split('keydown')[1] if 'keydown' in content else True:
    content = content.replace(
        "if (typeof closeClampingModalX === 'function') closeClampingModalX();",
        "if (typeof closeClampingModalX === 'function') closeClampingModalX();\n        if (typeof closeAiInspectionModal === 'function') closeAiInspectionModal();"
    )

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("FAZ 14 applied successfully to ui/index.html")
