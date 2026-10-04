import { describe, it, expect } from 'vitest';
import { matchCadWithDrawing } from './CadDrawingMatcher';
import type { CadMetadata } from '../../../types/generated/cad_metadata';
import type { DrawingExtractionResult } from '../../../types/generated/drawing_data';

describe('CadDrawingMatcher — STEP-Güdümlü Deterministik Eşleme Motoru', () => {
  const sampleCad: CadMetadata = {
    model_name: 'GOBEK_BAGI_OLUGU_AB.step',
    file_format: 'step',
    vertex_count: 14200,
    triangle_count: 28400,
    bbox: {
      min: [0, 0, 0],
      max: [395.5, 305.2, 50.0],
      size: [395.5, 305.2, 50.0],
    },
    features: [
      {
        id: 'CYL_HOLE_2_5_A',
        feature_type: 'INTERNAL_CYLINDER',
        nominal_dimension: 2.5,
        center: [50, 40, 10],
        normal: [0, 0, 1],
      },
      {
        id: 'CYL_HOLE_6_0_PIM',
        feature_type: 'INTERNAL_CYLINDER',
        nominal_dimension: 6.0,
        center: [200, 150, 20],
        normal: [0, 0, 1],
      },
      {
        id: 'CYL_BORE_43_0',
        feature_type: 'INTERNAL_CYLINDER',
        nominal_dimension: 43.0,
        center: [300, 100, -15],
        normal: [0, 0, -1],
      },
      {
        id: 'RAD_CORNER_5_4',
        feature_type: 'EXTERNAL_CYLINDER',
        nominal_dimension: 10.8,
        center: [80, 45, 10],
        normal: [0, 1, 0],
      },
    ],
  };

  const sampleDrawing: DrawingExtractionResult = {
    success: true,
    filename: 'GOBEK_BAGI_OLUGU_TR_AB.pdf',
    title_block: {
      part_number: 'KPT - 3051 GOBEK BAGI OLUGU',
      material: 'Alüminyum 7075-T6',
      hardness: '150 HB',
      roughness: 'Ra 1.6',
      general_tolerance: 'ISO 2768-m',
      drawing_number: 'GOBEK BAGI OLUGU_TR_AB',
    },
    datums: ['A', 'B', 'C'],
    dimensions: [
      {
        id: 1,
        balloon: '#1',
        page: 2,
        type: 'LINEAR',
        type_label: 'Tam Boy',
        nominal: 395.5,
        nominal_str: '395.5 ±0.800',
        upper_tol: '+0.800',
        lower_tol: '-0.800',
        measured: '395.502 mm',
        deviation: '+0.002 mm',
        status: 'PASS',
      },
      {
        id: 2,
        balloon: '#2',
        page: 2,
        type: 'DIAMETER',
        type_label: 'Pim Deliği',
        nominal: 6.0,
        nominal_str: '2x Ø6 +0.5/0',
        upper_tol: '+0.500',
        lower_tol: '0.000',
        measured: '6.004 mm',
        deviation: '+0.004 mm',
        status: 'PASS',
      },
      {
        id: 3,
        balloon: '#3',
        page: 3,
        type: 'DIAMETER',
        type_label: 'Arka Yuva Çapı',
        nominal: 43.0,
        nominal_str: 'Ø43 ±0.1',
        upper_tol: '+0.100',
        lower_tol: '-0.100',
        measured: '43.001 mm',
        deviation: '+0.001 mm',
        status: 'PASS',
      },
      {
        id: 4,
        balloon: '#4',
        page: 2,
        type: 'RADIUS',
        type_label: 'Köşe Kavisi R5.4',
        nominal: 5.4,
        nominal_str: 'R5.4',
        upper_tol: '+0.100',
        lower_tol: '-0.100',
        measured: '5.402 mm',
        deviation: '+0.002 mm',
        status: 'PASS',
      },
      {
        id: 5,
        balloon: '#5',
        page: 2,
        type: 'LINEAR',
        type_label: 'Yabancı veya Hatalı Boyut',
        nominal: 999.9,
        nominal_str: '999.9',
        upper_tol: '+0.100',
        lower_tol: '-0.100',
        measured: '999.900 mm',
        deviation: '0.000 mm',
        status: 'PASS',
      },
    ],
  };

  it('1. Çizimdeki delik çaplarını ve radyusları CAD modelindeki B-Rep unsurlarıyla %100 eşler', () => {
    const res = matchCadWithDrawing(sampleCad, sampleDrawing);
    expect(res.total_dimensions).toBe(5);
    expect(res.matched_count).toBe(4);
    expect(res.unmatched_count).toBe(1);

    const pimDim = res.dimensions.find((d) => d.id === 2);
    expect(pimDim?.cad_feature_id).toBe('CYL_HOLE_6_0_PIM');
    expect(pimDim?.match_confidence).toBe('EXACT');
    expect(pimDim?.operation).toBe('OP10');

    const radiusDim = res.dimensions.find((d) => d.id === 4);
    expect(radiusDim?.cad_feature_id).toBe('RAD_CORNER_5_4');
    expect(radiusDim?.match_confidence).toBe('RADIUS_HALF');
  });

  it('2. Parça sınır kutusunu (Bounding Box) kullanarak tam boy ölçüsünü ENVELOPE olarak doğrular', () => {
    const res = matchCadWithDrawing(sampleCad, sampleDrawing);
    const lenDim = res.dimensions.find((d) => d.id === 1);
    expect(lenDim?.cad_feature_id).toBe('CAD_BBOX_X');
    expect(lenDim?.match_confidence).toBe('ENVELOPE');
    expect(lenDim?.operation).toBe('OP10');
  });

  it('3. Yüzey normali tabana bakan unsurları otomatik OP20 olarak ayırır', () => {
    const res = matchCadWithDrawing(sampleCad, sampleDrawing);
    const rearBore = res.dimensions.find((d) => d.id === 3);
    expect(rearBore?.cad_feature_id).toBe('CYL_BORE_43_0');
    expect(rearBore?.operation).toBe('OP20');
  });

  it('4. CAD modelinde karşılığı olmayan yapay/hatalı ölçüyü UNMATCHED olarak işaretler ve WARN durumuna çeker', () => {
    const res = matchCadWithDrawing(sampleCad, sampleDrawing);
    const invalidDim = res.dimensions.find((d) => d.id === 5);
    expect(invalidDim?.match_confidence).toBe('UNMATCHED');
    expect(invalidDim?.status).toBe('WARN');
  });

  it('5. Algoritma 100 tekrar çalıştırıldığında sonuçlar kesinlikle birebir aynıdır (100% Deterministik)', () => {
    const firstRun = JSON.stringify(matchCadWithDrawing(sampleCad, sampleDrawing));
    for (let i = 0; i < 50; i++) {
      const iterRun = JSON.stringify(matchCadWithDrawing(sampleCad, sampleDrawing));
      expect(iterRun).toBe(firstRun);
    }
  });
});
