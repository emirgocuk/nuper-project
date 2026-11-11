import { describe, expect, it } from 'vitest';
import { computePlaneDeviations, deviationToRgb } from './ScanToCadHeatmap';

describe('ScanToCadHeatmap — Lazer Bulutu ve Renkli Sapma Analizi (Faz 11)', () => {
  it('deviationToRgb nominalde yeşil, artıda kırmızı, ekside mavi üretir', () => {
    const green = deviationToRgb(0.0, 0.05);
    expect(green[0]).toBeCloseTo(0.0, 3);
    expect(green[1]).toBeCloseTo(1.0, 3);
    expect(green[2]).toBeCloseTo(0.0, 3);

    const red = deviationToRgb(0.06, 0.05);
    expect(red[0]).toBeCloseTo(1.0, 3);
    expect(red[1]).toBeCloseTo(0.0, 3);

    const blue = deviationToRgb(-0.06, 0.05);
    expect(blue[2]).toBeCloseTo(1.0, 3);
    expect(blue[0]).toBeCloseTo(0.0, 3);
  });

  it('10.000 noktalık lazer bulutunu 10ms altında CAD düzlemine izdüşürür', () => {
    const count = 10000;
    const points = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      points[i * 3] = (i % 100) * 2.0;
      points[i * 3 + 1] = Math.floor(i / 100) * 2.0;
      points[i * 3 + 2] = 50.0 + (i % 2 === 0 ? 0.015 : -0.010);
    }

    const tStart = performance.now();
    const result = computePlaneDeviations(points, [0, 0, 50.0], [0, 0, 1.0], 0.05);
    const duration = performance.now() - tStart;

    expect(result.pointCount).toBe(count);
    expect(result.deviations.length).toBe(count);
    expect(result.colorsRgb.length).toBe(count * 3);
    expect(result.minDeviation).toBeCloseTo(-0.010, 4);
    expect(result.maxDeviation).toBeCloseTo(0.015, 4);
    expect(duration).toBeLessThan(50);
  });
});
