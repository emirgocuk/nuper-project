export interface FormattedInspectionCard {
  id: number;
  balloon: string;
  page: number;
  featureTitle: string;
  nominalStr: string;
  toleranceRange: string;
  datumReference: string;
  status: 'PASS' | 'WARN' | 'FAIL' | 'UNMEASURED';
  featureKey?: string;
  selected?: boolean;
  op?: string;
  op_reason?: string;
  hasMmc?: boolean;
  bonusTol?: number;
  totalTol?: number;
}

export class InspectionCardFormatter {
  public static computeMmcBonusTolerance(
    nominal: number,
    lowerTol: number,
    upperTol: number,
    actualVal: number,
    statedPosTol: number,
    isInternal: boolean
  ): { mmcSize: number; bonus: number; totalTol: number } {
    let mmcSize = 0;
    let bonus = 0;
    if (isInternal) {
      mmcSize = nominal - Math.abs(lowerTol);
      bonus = Math.max(0, actualVal - mmcSize);
    } else {
      mmcSize = nominal + Math.abs(upperTol);
      bonus = Math.max(0, mmcSize - actualVal);
    }
    return {
      mmcSize: parseFloat(mmcSize.toFixed(4)),
      bonus: parseFloat(bonus.toFixed(4)),
      totalTol: parseFloat((statedPosTol + bonus).toFixed(4)),
    };
  }

  public static extractDatumReference(gdt?: string, fallbackDatums: string[] = ['A']): string {
    if (gdt) {
      const match = gdt.match(/\|\s*([A-Z])(?:\s*\|\s*([A-Z]))?(?:\s*\|\s*([A-Z]))?/);
      if (match) {
        const parts = [match[1], match[2], match[3]].filter(Boolean);
        if (parts.length > 0) {
          return `[${parts.join('|')}]`;
        }
      }
    }
    if (fallbackDatums && fallbackDatums.length > 0) {
      return `[${fallbackDatums.slice(0, 2).join('|')}]`;
    }
    return '[A]';
  }

  public static formatToleranceRange(lower: string, upper: string, nominalStr?: string): string {
    if (nominalStr) {
      const parenMatch = nominalStr.match(/\(([^)]+)\)/);
      if (parenMatch) {
        return parenMatch[1].trim();
      }
      const plusMinusMatch = nominalStr.match(/[±\+]\s*([0-9\.]+)/);
      if (plusMinusMatch && nominalStr.includes('±')) {
        return `±${plusMinusMatch[1]}`;
      }
    }

    const lowNum = parseFloat(lower);
    const upNum = parseFloat(upper);

    if (!isNaN(lowNum) && !isNaN(upNum)) {
      if (Math.abs(Math.abs(lowNum) - Math.abs(upNum)) < 1e-4 && (lowNum < 0 || upNum > 0)) {
        const val = Math.abs(upNum);
        return `±${val.toFixed(val < 0.01 ? 3 : val < 0.1 ? 2 : 1)}`;
      }
      const fmtUpper = upNum >= 0 ? `+${upNum}` : `${upNum}`;
      const fmtLower = lowNum === 0 ? '0' : lowNum > 0 ? `+${lowNum}` : `${lowNum}`;
      return `${fmtUpper} / ${fmtLower}`;
    }

    return `${upper} / ${lower}`;
  }

  public static formatFeatureTitle(typeLabel: string, nominalStr: string): string {
    const cleanLabel = typeLabel.replace(/\([^)]*\)/g, '').trim();
    if (nominalStr.toLowerCase().includes('profil')) {
      return `Çatı Profil Toleransı (${nominalStr})`;
    }
    if (nominalStr.toLowerCase().includes('ø')) {
      return `${cleanLabel || 'Silindirik Delik / Çap'} (${nominalStr})`;
    }
    if (cleanLabel.toLowerCase().includes('boy') || cleanLabel.toLowerCase().includes('uzunluk')) {
      return `Tam Boy (${nominalStr} mm)`;
    }
    if (cleanLabel.toLowerCase().includes('aralık') || cleanLabel.toLowerCase().includes('mesafe')) {
      return `Eksen Aralığı (${nominalStr} mm)`;
    }
    return `${cleanLabel} (${nominalStr})`;
  }

  public static renderCardHtml(card: FormattedInspectionCard): string {
    const activeClass = card.selected ? ' active' : '';
    const statusClass = ` status-${card.status.toLowerCase()}`;

    const opBadge = card.op
      ? `<span class="card-op-badge ${card.op.toLowerCase()}" title="${card.op_reason || card.op}">${card.op}</span>`
      : '';

    return `
      <div class="inspection-card${activeClass}${statusClass}" data-id="${card.id}" data-page="${card.page}">
        <div class="card-left-badge">
          <span class="balloon-tag">${card.balloon}</span>
          <span class="page-tag">S.${card.page}</span>
        </div>
        <div class="card-main-content">
          <div class="card-header-row">
            <span class="card-title">${card.featureTitle}</span>
            <div class="card-header-badges">
              ${opBadge}
              <span class="card-datum-badge">${card.datumReference}</span>
            </div>
          </div>
          <div class="card-details-row">
            <div class="detail-item">
              <span class="detail-label">Nominal:</span>
              <span class="detail-value mono">${card.nominalStr}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tolerans:</span>
              <span class="detail-value tol-highlight">${card.toleranceRange}</span>
            </div>
          </div>
          ${
            card.hasMmc && card.bonusTol !== undefined && card.bonusTol > 0
              ? `<div class="card-bonus-row" style="font-size: 10px; color: #1D4ED8; margin-top: 4px; font-weight: 700; background: #EFF6FF; padding: 2px 6px; border-radius: 3px; border: 1px solid #BFDBFE;">Ⓜ Bonus: +${card.bonusTol.toFixed(3)} mm | Toplam: Ø${card.totalTol?.toFixed(3)} mm</div>`
              : ''
          }
        </div>
      </div>
    `.trim();
  }

  public static renderListContainerHtml(cards: FormattedInspectionCard[]): string {
    const cardsHtml = cards.map((c) => this.renderCardHtml(c)).join('\n');
    return `
      <div class="inspection-items-panel">
        <div class="inspection-panel-header">
          <div class="header-title-box">
            <span class="panel-icon">📋</span>
            <span class="panel-title">Ölçülecek Özellikler</span>
          </div>
          <span class="item-count-badge">Top: ${cards.length} Eleman</span>
        </div>
        <div class="inspection-cards-scroll">
          ${cardsHtml}
        </div>
      </div>
    `.trim();
  }
}
