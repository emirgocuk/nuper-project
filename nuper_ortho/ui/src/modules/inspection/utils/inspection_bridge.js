(function () {
  function getActiveDimensions() {
    if (typeof window !== 'undefined' && window.nuperApp && typeof window.nuperApp.getSetupWizard === 'function') {
      const wizard = window.nuperApp.getSetupWizard();
      if (wizard && typeof wizard.getDimensions === 'function') {
        const dims = wizard.getDimensions();
        if (dims && dims.length > 0) return dims;
      }
    }
    return [];
  }

  function updateActiveDimension(d, skipCamera) {
    if (!d) return;

    document.querySelectorAll('.dim-card').forEach((c) => c.classList.remove('active'));
    const card = document.getElementById(`dim-card-${d.id}`);
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    document.querySelectorAll('.drawing-balloon-marker').forEach((m) => m.classList.remove('active'));
    const marker = document.getElementById(`marker-balloon-${d.id}`);
    if (marker) marker.classList.add('active');

    const diagContent = document.getElementById('diag-content');
    const badgeStatus = document.getElementById('diag-badge-status');
    if (badgeStatus) {
      const isPass = d.status === 'PASS';
      const isFail = d.status === 'FAIL';
      badgeStatus.className = isPass ? 'pass-tag' : (isFail ? 'fail-tag' : 'unmeasured-tag');
      badgeStatus.innerText = isPass ? 'PASS ✓' : (isFail ? 'FAIL ✕' : 'UNMEASURED');
    }

    if (diagContent) {
      const sym = d.icon === '⌒' ? '⌒' : (d.icon === '⭕' ? '⌖' : '📏');
      const datum = d.datum_reference ? d.datum_reference.replace(/[\[\]]/g, '') : 'A';
      const datumParts = datum.split('|').map((x) => x.trim()).filter(Boolean);
      const datumTds = datumParts.map((x) => `<td>${x}</td>`).join('');
      const measVal = d.measured && d.measured !== '--' ? d.measured : '--';
      const devVal = d.deviation && d.deviation !== '--' ? d.deviation : '--';

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
        <div class="metric-row">
          <span class="metric-label">Nominal Değer</span>
          <span class="metric-val" style="font-weight:700;">${d.nominal_str}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Ölçülen (CMM)</span>
          <span class="metric-val" style="font-weight:700;">${measVal}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Sapma (Deviation)</span>
          <span class="metric-val" style="font-weight:700;">${devVal}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Tolerans Aralığı</span>
          <span class="metric-val">${d.lower_tol || '-'} / ${d.upper_tol || '+'}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Durum</span>
          <span class="metric-val">${d.status || 'UNMEASURED'}</span>
        </div>
      `;
    }

    if (!skipCamera && typeof window.showToast === 'function') {
      window.showToast(`🎯 Balon ${d.balloon}: ${d.nominal_str}`);
    }
  }

  window.selectDrawingDimension = updateActiveDimension;
  window.getActiveDimensions = getActiveDimensions;
  window.InspectionBridge = {
    updateActiveDimension,
    getActiveDimensions
  };
})();
