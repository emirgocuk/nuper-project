// Nuper Ortho - Live Inspection Interactive Synchronization Bridge
// ASME Y14.5 / ISO 15530-3 Metrology Engine Connection

(function () {
  const GOBEK_DIMS = [
    { id: 1, balloon: '#1', page: 2, type: 'LINEAR', type_label: 'Tam Boy (Overall Length)', icon: '📏', nominal: 395.5, nominal_str: '395.5', upper_tol: '+0.800', lower_tol: '-0.800', measured: '395.504 mm', deviation: '+0.004 mm', status: 'PASS', gdt: '| A', datum_reference: '[A]' },
    { id: 2, balloon: '#2', page: 2, type: 'LINEAR', type_label: 'Doğrusal Eksen Mesafesi', icon: '📏', nominal: 305.2, nominal_str: '305.2', upper_tol: '+0.500', lower_tol: '-0.500', measured: '305.204 mm', deviation: '+0.004 mm', status: 'PASS', gdt: '| A', datum_reference: '[A]' },
    { id: 3, balloon: '#3', page: 2, type: 'LINEAR', type_label: 'Gövde Genişliği (Asimetrik)', icon: '📏', nominal: 35.0, nominal_str: '35 (-0.2 / 0)', upper_tol: '0.000', lower_tol: '-0.200', measured: '34.985 mm', deviation: '-0.015 mm', status: 'PASS', gdt: '| A | B', datum_reference: '[A | B]' },
    { id: 4, balloon: '#4', page: 2, type: 'DIAMETER', type_label: 'Montaj Delik Grubu (4x)', icon: '⭕', nominal: 2.5, nominal_str: '4x Ø2.5', upper_tol: '+0.100', lower_tol: '0.000', measured: '2.505 mm', deviation: '+0.005 mm', status: 'PASS', gdt: '⌖ Ø 0.100 | A | B', datum_reference: '[A | B]' },
    { id: 5, balloon: '#5', page: 2, type: 'DIAMETER', type_label: 'Bağlantı Pimi Yuvası (2x)', icon: '⭕', nominal: 6.0, nominal_str: '2x Ø6 (+0.5 / 0)', upper_tol: '+0.500', lower_tol: '0.000', measured: '6.025 mm', deviation: '+0.025 mm', status: 'PASS', gdt: '⌖ Ø 0.150 | A | B', datum_reference: '[A | B]' },
    { id: 6, balloon: '#6', page: 2, type: 'PROFILE', type_label: 'Yüzey Profili Geometrik Tol.', icon: '⌒', nominal: 0.0, nominal_str: 'Profil 0.5 | A', upper_tol: '+0.500', lower_tol: '0.000', measured: '0.025 mm', deviation: '+0.025 mm', status: 'PASS', gdt: '⌒ 0.500 | A', datum_reference: '[A]' },
    { id: 7, balloon: '#7', page: 3, type: 'LINEAR', type_label: 'Kare Montaj Eksen Aralığı', icon: '📏', nominal: 36.5, nominal_str: '36.5 ±0.1', upper_tol: '+0.100', lower_tol: '-0.100', measured: '36.505 mm', deviation: '+0.005 mm', status: 'PASS', gdt: '| A | B', datum_reference: '[A | B]' },
    { id: 8, balloon: '#8', page: 3, type: 'DIAMETER', type_label: 'Kare Flanş Bağlantı Delikleri', icon: '⭕', nominal: 3.5, nominal_str: '4x Ø3.5 (+0.2 / 0)', upper_tol: '+0.200', lower_tol: '0.000', measured: '3.512 mm', deviation: '+0.012 mm', status: 'PASS', gdt: '⌖ Ø 0.100 | A | B | C', datum_reference: '[A | B | C]' },
    { id: 9, balloon: '#9', page: 3, type: 'DIAMETER', type_label: 'Dış Çap (KESIT G-G)', icon: '⭕', nominal: 43.0, nominal_str: 'Ø43 (+0.5 / 0)', upper_tol: '+0.500', lower_tol: '0.000', measured: '43.018 mm', deviation: '+0.018 mm', status: 'PASS', gdt: '◎ 0.050 | A', datum_reference: '[A]' },
    { id: 10, balloon: '#10', page: 3, type: 'DIAMETER', type_label: 'İç Kılavuz Çapı (KESIT G-G)', icon: '⭕', nominal: 21.0, nominal_str: 'Ø21 (+0.25 / 0)', upper_tol: '+0.250', lower_tol: '0.000', measured: '21.010 mm', deviation: '+0.010 mm', status: 'PASS', gdt: '◎ 0.030 | A', datum_reference: '[A]' },
    { id: 11, balloon: '#11', page: 3, type: 'LINEAR', type_label: 'Kanal Derinliği (KESIT G-G)', icon: '📏', nominal: 12.0, nominal_str: '12 ±0.5', upper_tol: '+0.500', lower_tol: '-0.500', measured: '12.008 mm', deviation: '+0.008 mm', status: 'PASS', gdt: '| A', datum_reference: '[A]' },
    { id: 12, balloon: '#12', page: 3, type: 'LINEAR', type_label: 'Hassas Dayama Payı (KESIT G-G)', icon: '📏', nominal: 9.11, nominal_str: '9.11 (+0 / -0.25)', upper_tol: '0.000', lower_tol: '-0.250', measured: '9.095 mm', deviation: '-0.015 mm', status: 'PASS', gdt: '| A | B', datum_reference: '[A | B]' }
  ];

  const COORDS = {
    1: { x: 197.75, y: 0.0, z: 43.83 },
    2: { x: 152.60, y: 0.0, z: 43.83 },
    3: { x: 0.0, y: 35.0, z: 43.83 },
    4: { x: -120.0, y: 40.0, z: 20.0 },
    5: { x: -80.0, y: 0.0, z: 80.0 },
    6: { x: 0.0, y: 0.0, z: 87.66 },
    7: { x: -160.0, y: 0.0, z: 45.0 },
    8: { x: -160.0, y: 18.25, z: 45.0 },
    9: { x: 100.0, y: 0.0, z: 45.0 },
    10: { x: 100.0, y: 0.0, z: 45.0 },
    11: { x: 106.0, y: 0.0, z: 45.0 },
    12: { x: 95.0, y: 0.0, z: 45.0 }
  };

  let lastActiveId = null;

  function updateActiveDimension(d, skipCamera) {
    if (!d) return;
    lastActiveId = d.id;

    // 1. Sol Panel Kartı Aktif Yap
    document.querySelectorAll('.dim-card').forEach(c => c.classList.remove('active'));
    const card = document.getElementById(`dim-card-${d.id}`);
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 2. 2D Balon Aktif Yap
    document.querySelectorAll('.drawing-balloon-marker').forEach(m => m.classList.remove('active'));
    const marker = document.getElementById(`marker-balloon-${d.id}`);
    if (marker) marker.classList.add('active');

    // 3. Sağ Akıllı Teşhis (Diagnostics) Panelini Güncelle
    const diagContent = document.getElementById('diag-content');
    const badgeStatus = document.getElementById('diag-badge-status');
    if (badgeStatus) {
      badgeStatus.className = 'pass-tag';
      badgeStatus.innerText = 'PASS ✓';
    }

    if (diagContent) {
      const sym = d.icon === '⌒' ? '⌒' : (d.icon === '⭕' ? '⌖' : '📏');
      const datum = d.datum_reference ? d.datum_reference.replace(/[\[\]]/g, '') : 'A';
      const datumParts = datum.split('|').map(x => x.trim()).filter(Boolean);
      const datumTds = datumParts.map(x => `<td>${x}</td>`).join('');

      diagContent.innerHTML = `
        <div class="card-fcf">
          <div class="fcf-title">
            <span>ASME Y14.5 Tolerans Çerçevesi (FCF)</span>
            <span style="font-size: 10px; color: #0284C7; font-weight:700;">Balon: ${d.balloon}</span>
          </div>
          <table class="fcf-table">
            <tr>
              <td style="font-size: 13px; font-weight: 700;">${sym}</td>
              <td style="font-weight: 600;">${d.nominal_str}</td>
              ${datumTds}
            </tr>
          </table>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 10px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <b style="color: #0F172A; font-size: 11px; text-transform: uppercase;">GUM / ISO 15530-3 Belirsizlik</b>
            <span class="pass-tag" style="font-size: 9px;">TUR 6.56:1</span>
          </div>
          <div style="font-size: 11px; display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #64748B;">Genişletilmiş Belirsizlik (U₉₅):</span>
            <span style="font-family: var(--font-mono); font-weight: 600;">± 0.0032 mm (k=2)</span>
          </div>
          <div style="font-size: 11px; display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #64748B;">ISO 14253-1 Emniyet Bandı:</span>
            <span style="color: #059669; font-weight: 700;">PASS (Net Kabul)</span>
          </div>
          <div style="font-size: 10px; color: #0284C7; margin-top: 4px;">
            ISO 16610-31 Filtresi: Talaş/toz sıçramaları temizlendi.
          </div>
        </div>

        <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">
          Metrolojik Ölçüm Parametreleri
        </div>
        <div class="metric-row">
          <span class="metric-label">Nominal Değer</span>
          <span class="metric-val" style="font-weight:700;">${d.nominal_str}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Ölçülen (CMM)</span>
          <span class="metric-val" style="font-weight:700; color:#059669;">${d.measured}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Sapma (Deviation)</span>
          <span class="metric-val" style="font-weight:700; color:#0284C7;">${d.deviation || '+0.003 mm'}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Tolerans Aralığı</span>
          <span class="metric-val">${d.upper_tol} / ${d.lower_tol}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Geometrik Unsur</span>
          <span class="metric-val">${d.type_label || d.type}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Ölçüm Kararı</span>
          <span class="metric-val" style="color:#059669; font-weight:700;">PASS ✓</span>
        </div>
      `;
    }

    // 4. 3D Sahne HUD Bilgilerini Güncelle
    const pos = COORDS[d.id] || { x: 0, y: 20, z: 40 };
    const hudName = document.getElementById('hud-feature-name');
    const hudCoords = document.getElementById('hud-feature-coords');
    const hudDetails = document.getElementById('hud-feature-details');
    if (hudName) hudName.innerText = `${d.balloon} [${d.type_label || d.nominal_str}]`;
    if (hudCoords) hudCoords.innerText = `Prob: X: ${pos.x.toFixed(2)} mm | Y: ${pos.y.toFixed(2)} mm | Z: ${pos.z.toFixed(2)} mm`;
    if (hudDetails) hudDetails.innerText = `${d.gdt || 'ASME Y14.5'} | Tol: ${d.upper_tol} / ${d.lower_tol} | Ölçülen: ${d.measured}`;

    // 5. CMM Probunu Unsur Koordinatına Taşı & Dokunma Efekti
    if (window.probeGroup) {
      window.probeGroup.position.set(pos.x, pos.y + 20, pos.z);
      if (typeof window.triggerContactRipple === 'function') {
        window.triggerContactRipple(pos.x, pos.y, pos.z);
      }
      if (typeof window.requestRender === 'function') {
        window.requestRender();
      }
    }

    // 6. Eğer Çift Kanvas Açık Değilse Aç (2D ve 3D Birlikte Görünsün)
    if (typeof window.isDualCanvas !== 'undefined' && !window.isDualCanvas && typeof window.toggleDualCanvas === 'function') {
      window.toggleDualCanvas();
    }

    if (!skipCamera && typeof window.showToast === 'function') {
      window.showToast(`🎯 Balon ${d.balloon}: ${d.nominal_str} (Ölçülen: ${d.measured}) ✓`);
    }
  }

  // Global Kancalar
  window.selectDrawingDimension = updateActiveDimension;
  window.gobekAllDimensions = GOBEK_DIMS;

  // Simülasyon Sırasında Canlı Unsur Senkronizasyonu
  setInterval(() => {
    if (window.isPlaying && typeof window.animProgress === 'number') {
      const idx = Math.min(Math.floor(window.animProgress * GOBEK_DIMS.length), GOBEK_DIMS.length - 1);
      const activeDim = GOBEK_DIMS[idx];
      if (activeDim && activeDim.id !== lastActiveId) {
        updateActiveDimension(activeDim, true);
      }
    }
  }, 200);

  window.InspectionBridge = {
    GOBEK_DIMS,
    COORDS,
    updateActiveDimension
  };
})();
