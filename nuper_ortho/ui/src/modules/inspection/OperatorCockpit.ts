export interface OperatorCockpitState {
  partName: string;
  serialNumber: string;
  currentDimensionIndex: number;
  totalDimensions: number;
  lastMeasuredFeature: string;
  lastDeviationMm: number;
  overallStatus: 'PASS' | 'FAIL' | 'INSPECTING' | 'ABORTED';
  isEmergencyStopActive: boolean;
}

export interface TouchTargetDimensions {
  id: string;
  widthPx: number;
  heightPx: number;
}

export class OperatorCockpit {
  public static readonly COLOR_OBSIDIAN_BG = '#0A0E17';
  public static readonly COLOR_CARD_BG = '#131B2E';
  public static readonly COLOR_NEON_PASS = '#00FF66';
  public static readonly COLOR_ALARM_FAIL = '#FF3333';
  public static readonly COLOR_CYAN_ACTIVE = '#00E5FF';
  public static readonly COLOR_TEXT_PRIMARY = '#FFFFFF';
  public static readonly MIN_TOUCH_SIZE_PX = 48;

  public static verifyTouchTargetSize(target: TouchTargetDimensions): boolean {
    return target.widthPx >= this.MIN_TOUCH_SIZE_PX && target.heightPx >= this.MIN_TOUCH_SIZE_PX;
  }

  public static verifyAllTouchTargets(targets: TouchTargetDimensions[]): boolean {
    return targets.every((t) => this.verifyTouchTargetSize(t));
  }

  private static hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  private static getLuminance(rgb: [number, number, number]): number {
    const [r, g, b] = rgb.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  public static computeContrastRatio(hex1: string, hex2: string): number {
    const l1 = this.getLuminance(this.hexToRgb(hex1));
    const l2 = this.getLuminance(this.hexToRgb(hex2));
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  public static isWcagAaaCompliant(fgHex: string, bgHex: string): boolean {
    return this.computeContrastRatio(fgHex, bgHex) >= 7.0;
  }

  public static renderCockpit(state: OperatorCockpitState): string {
    const statusColor =
      state.overallStatus === 'PASS'
        ? this.COLOR_NEON_PASS
        : state.overallStatus === 'FAIL'
          ? this.COLOR_ALARM_FAIL
          : this.COLOR_CYAN_ACTIVE;

    const stopButtonBg = state.isEmergencyStopActive ? '#880000' : this.COLOR_ALARM_FAIL;

    return `
      <div class="operator-cockpit" style="background-color: ${this.COLOR_OBSIDIAN_BG}; color: ${this.COLOR_TEXT_PRIMARY}; padding: 24px; min-height: 100vh; font-family: monospace;">
        <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${this.COLOR_CYAN_ACTIVE}; padding-bottom: 16px;">
          <div>
            <h1 style="font-size: 24px; margin: 0; color: ${this.COLOR_CYAN_ACTIVE};">NUPER ORTHO ATOLYE OPERATOR KOKPITI</h1>
            <p style="margin: 4px 0 0 0; color: #8892B0;">PARCA: <strong>${state.partName}</strong> | SERI NO: <strong>${state.serialNumber}</strong></p>
          </div>
          <div style="font-size: 20px; font-weight: bold;">
            ILISKI: ${state.currentDimensionIndex} / ${state.totalDimensions}
          </div>
        </header>

        <main style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 40px 0;">
          <div class="massive-status-banner" style="font-size: 72pt; font-weight: 900; color: ${statusColor}; text-shadow: 0 0 30px ${statusColor}; margin: 20px 0;">
            ${state.overallStatus}
          </div>
          <div style="font-size: 24px; color: ${this.COLOR_TEXT_PRIMARY}; background: ${this.COLOR_CARD_BG}; padding: 16px 32px; border-radius: 8px;">
            SON OLCULEN UNSUR: <strong>${state.lastMeasuredFeature}</strong> (SAPMA: ${state.lastDeviationMm >= 0 ? '+' : ''}${state.lastDeviationMm.toFixed(4)} mm)
          </div>
        </main>

        <footer style="display: flex; justify-content: center; gap: 32px; margin-top: 40px;">
          <button id="btn-emergency-stop" style="min-width: 160px; min-height: 64px; font-size: 20px; font-weight: bold; background: ${stopButtonBg}; color: #FFFFFF; border: none; border-radius: 8px; cursor: pointer;">
            ACIL DURDUR
          </button>
          <button id="btn-cycle-resume" style="min-width: 160px; min-height: 64px; font-size: 20px; font-weight: bold; background: ${this.COLOR_NEON_PASS}; color: #0A0E17; border: none; border-radius: 8px; cursor: pointer;">
            DEVAM ET
          </button>
          <button id="btn-retest-feature" style="min-width: 160px; min-height: 64px; font-size: 20px; font-weight: bold; background: ${this.COLOR_CARD_BG}; color: ${this.COLOR_CYAN_ACTIVE}; border: 2px solid ${this.COLOR_CYAN_ACTIVE}; border-radius: 8px; cursor: pointer;">
            TEKRAR OLC
          </button>
        </footer>
      </div>
    `.trim();
  }
}
