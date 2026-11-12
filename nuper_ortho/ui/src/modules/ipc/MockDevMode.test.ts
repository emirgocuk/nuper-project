import { describe, it, expect } from 'vitest';
import { NuperApp } from '../../main';
import type { DrawingExtractionResult } from '../../types/generated/drawing_data';

describe('Hızlı Dev Modu ve Örnek Veri Okuma', () => {
  const sampleData: DrawingExtractionResult = {
    success: true,
    filename: '050-164849-000 - Kopya.pdf',
    page_count: 1,
    raw_text_length: 1420,
    title_block: {
      part_number: '050-164849-000',
      drawing_number: '050-164849-000',
      material: 'SAE 4340 Çelik',
      hardness: '38-44 HRC',
      roughness: 'Ra 1.6 µm',
      general_tolerance: 'ISO 2768-mK'
    },
    datums: ['A', 'B', 'C'],
    dimensions: [
      {
        id: 1,
        balloon: '#1',
        type: 'DIAMETER',
        type_label: 'Silindirik Çap (Bore/Shaft)',
        icon: '⭕',
        nominal: 20.0,
        nominal_str: 'Ø20.000 H7 (+0.021/0)',
        upper_tol: '+0.021',
        lower_tol: '0.000',
        measured: '20.004 mm',
        deviation: '+0.004 mm',
        status: 'PASS',
        feature_key: 'cyl_20',
        gdt: '⌖ Ø 0.020 Ⓜ | A | B | C',
        bbox: [120, 340, 220, 390]
      },
      {
        id: 2,
        balloon: '#2',
        type: 'LINEAR',
        type_label: 'Doğrusal Boyut',
        icon: '📏',
        nominal: 51.6,
        nominal_str: '51.60 ±0.20 mm',
        upper_tol: '+0.200',
        lower_tol: '-0.200',
        measured: '51.615 mm',
        deviation: '+0.015 mm',
        status: 'PASS',
        feature_key: 'dim_51_6',
        gdt: '∥ 0.015 | A',
        bbox: [300, 200, 410, 250]
      }
    ]
  };

  it('DrawingExtractionResult verisinin doğruluğunu teyit eder', () => {
    expect(sampleData.success).toBe(true);
    expect(sampleData.filename).toBe('050-164849-000 - Kopya.pdf');
    expect(sampleData.title_block.part_number).toBe('050-164849-000');
    expect(sampleData.datums).toEqual(['A', 'B', 'C']);
    expect(sampleData.dimensions.length).toBe(2);
  });

  it('NuperApp sınıfı örnek veriyi yükler ve kanvasa aktarır', () => {
    const app = new NuperApp();
    expect(app.getCADViewer()).toBeDefined();
    expect(app.getDrawingCanvas()).toBeDefined();
    expect(() => app.loadSampleData(sampleData)).not.toThrow();
    app.destroy();
  });
});
