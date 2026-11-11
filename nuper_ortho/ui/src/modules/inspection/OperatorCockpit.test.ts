import { describe, expect, it } from 'vitest';
import {
  OperatorCockpit,
  OperatorCockpitState,
  TouchTargetDimensions,
} from './OperatorCockpit';

describe('OperatorCockpit — Atölye Tipi Yüksek Kontrast CMM Operatör Kokpiti', () => {
  it('WCAG 2.2 AAA kontrast oranını (> 7:1) emniyet renklerinde sağlar', () => {
    const bg = OperatorCockpit.COLOR_OBSIDIAN_BG;
    const passRatio = OperatorCockpit.computeContrastRatio(
      OperatorCockpit.COLOR_NEON_PASS,
      bg
    );
    const textRatio = OperatorCockpit.computeContrastRatio(
      OperatorCockpit.COLOR_TEXT_PRIMARY,
      bg
    );
    const cyanRatio = OperatorCockpit.computeContrastRatio(
      OperatorCockpit.COLOR_CYAN_ACTIVE,
      bg
    );

    expect(passRatio).toBeGreaterThan(7.0);
    expect(textRatio).toBeGreaterThan(7.0);
    expect(cyanRatio).toBeGreaterThan(7.0);

    expect(
      OperatorCockpit.isWcagAaaCompliant(OperatorCockpit.COLOR_NEON_PASS, bg)
    ).toBe(true);
    expect(
      OperatorCockpit.isWcagAaaCompliant(OperatorCockpit.COLOR_TEXT_PRIMARY, bg)
    ).toBe(true);
  });

  it('tüm buton ve temas hedeflerinin minimum 48x48 px kuralına uyduğunu doğrular', () => {
    const targets: TouchTargetDimensions[] = [
      { id: 'btn-emergency-stop', widthPx: 160, heightPx: 64 },
      { id: 'btn-cycle-resume', widthPx: 160, heightPx: 64 },
      { id: 'btn-retest-feature', widthPx: 160, heightPx: 64 },
    ];

    expect(OperatorCockpit.verifyAllTouchTargets(targets)).toBe(true);

    const smallTarget: TouchTargetDimensions = {
      id: 'btn-too-small',
      widthPx: 32,
      heightPx: 32,
    };
    expect(OperatorCockpit.verifyTouchTargetSize(smallTarget)).toBe(false);
  });

  it('72pt devasa durum panosu ve acil durdurma HTML çıktısını üretir', () => {
    const state: OperatorCockpitState = {
      partName: 'WING_RIB_001',
      serialNumber: 'SN-99881',
      currentDimensionIndex: 12,
      totalDimensions: 12,
      lastMeasuredFeature: 'BORE_20_H7',
      lastDeviationMm: 0.008,
      overallStatus: 'PASS',
      isEmergencyStopActive: false,
    };

    const html = OperatorCockpit.renderCockpit(state);

    expect(html).toContain('72pt');
    expect(html).toContain('PASS');
    expect(html).toContain('ACIL DURDUR');
    expect(html).toContain('DEVAM ET');
    expect(html).toContain('WING_RIB_001');
    expect(html).toContain('BORE_20_H7');
  });
});
