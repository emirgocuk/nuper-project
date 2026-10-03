import { describe, it, expect } from 'vitest';
import {
  InspectionSynchronizer,
  GOBEK_ALL_12_DIMENSIONS,
} from './InspectionSynchronizer';

describe('InspectionSynchronizer Unit Tests', () => {
  it('should contain all 12 verified dimensions for Gobek Bagi Olugu', () => {
    expect(GOBEK_ALL_12_DIMENSIONS).toHaveLength(12);
    expect(GOBEK_ALL_12_DIMENSIONS[0].nominal_str).toBe('395.5');
    expect(GOBEK_ALL_12_DIMENSIONS[6].nominal_str).toBe('36.5 ±0.1');
    expect(GOBEK_ALL_12_DIMENSIONS[11].nominal_str).toBe('9.11 (+0 / -0.25)');
  });

  it('should return valid coordinates for all 12 dimensions', () => {
    GOBEK_ALL_12_DIMENSIONS.forEach((dim) => {
      const coords = InspectionSynchronizer.getFeatureCoordinates(dim.id);
      expect(coords).toBeDefined();
      expect(typeof coords.x).toBe('number');
      expect(typeof coords.y).toBe('number');
      expect(typeof coords.z).toBe('number');
    });
  });

  it('should generate ASME Y14.5 FCF HTML correctly', () => {
    const dim1 = GOBEK_ALL_12_DIMENSIONS[0];
    const html = InspectionSynchronizer.generateFcfHtml(dim1);
    expect(html).toContain('ASME Y14.5 Tolerans Çerçevesi');
    expect(html).toContain('Balon: #1');
    expect(html).toContain('395.5');
    expect(html).toContain('<td>A</td>');
  });

  it('should generate complete diagnostics HTML with GUM uncertainty and metrics', () => {
    const dim8 = GOBEK_ALL_12_DIMENSIONS[7]; // 4x Ø3.5
    const html = InspectionSynchronizer.generateDiagnosticsHtml(dim8);
    expect(html).toContain('GUM / ISO 15530-3 Belirsizlik');
    expect(html).toContain('4x Ø3.5 (+0.2 / 0)');
    expect(html).toContain(dim8.measured);
    expect(html).toContain(dim8.deviation);
    expect(html).toContain('PASS ✓');
  });

  it('should generate HUD content with coordinates and details', () => {
    const dim3 = GOBEK_ALL_12_DIMENSIONS[2];
    const hud = InspectionSynchronizer.generateHudContent(dim3);
    expect(hud.name).toContain('#3');
    expect(hud.name).toContain('35 (-0.2 / 0)');
    expect(hud.coords).toContain('Prob: X:');
    expect(hud.details).toContain('Tol:');
  });
});
