import { describe, it, expect } from 'vitest';
import { MeasurementPathGenerator, type PathFeatureInput } from './MeasurementPathGenerator';

const plateBbox = {
  min: [-30.3, 0, -19.5] as [number, number, number],
  max: [30.3, 5.7, 19.5] as [number, number, number],
};

function hole(id: number, x: number, z: number, nominal: number): PathFeatureInput {
  return {
    id,
    balloon: `#${id}`,
    type: 'DIAMETER',
    type_label: 'Delik',
    nominal,
    cad_center: [x, 1.75, z],
    cad_normal: [0, -1, 0],
    cad_feature_id: `CAD_HOLE_Ø${nominal.toFixed(2)}_${id}`,
    feature_type: 'INTERNAL_CYLINDER',
    operation: 'OP10',
  };
}

describe('Ölçüm kuralları: delik yolu, aşama sırası ve stylus', () => {
  it('dikey eksenli deliğe A0° B0° ile üstten inilir ve dokunuşlar delik merkezi çevresindedir', () => {
    const plan = MeasurementPathGenerator.generatePlan([hole(1, 23.6, 13.08, 3.0)], plateBbox, {
      verticalAxis: 'Y',
    });
    const path = plan.featurePaths[0];
    expect(path.ph10Angle.label).toBe('A0° B0°');
    expect(path.touchPoints).toHaveLength(4);
    for (const tp of path.touchPoints) {
      expect(tp.ph10Label).toBe('A0° B0°');
      expect(Math.hypot(tp.position[0] - 23.6, tp.position[2] - 13.08)).toBeCloseTo(1.5, 1);
    }
  });

  it('dört ayrı deliğin rotası parça merkezine değil her deliğin kendi konumuna gider', () => {
    const features = [
      hole(1, 23.6, 13.08, 3.0),
      hole(2, -23.6, 13.08, 3.0),
      hole(3, -23.6, -13.08, 3.0),
      hole(4, 23.6, -13.08, 3.0),
    ];
    const plan = MeasurementPathGenerator.generatePlan(features, plateBbox, { verticalAxis: 'Y' });
    const touched = new Set(
      plan.featurePaths.map((p) => {
        const tp = p.touchPoints;
        const cx = tp.reduce((s, t) => s + t.position[0], 0) / tp.length;
        const cz = tp.reduce((s, t) => s + t.position[2], 0) / tp.length;
        return `${Math.round(cx)},${Math.round(cz)}`;
      })
    );
    expect(touched).toEqual(new Set(['24,13', '-24,13', '-24,-13', '24,-13']));
  });

  it('ölçüleri mesafe → konum → kalınlık sırasında üretir', () => {
    const linear = (id: number, label: string): PathFeatureInput => ({
      id,
      balloon: `#${id}`,
      type: 'LINEAR',
      type_label: label,
      nominal: 20,
      cad_center: [0, 3, 0],
      cad_normal: [1, 0, 0],
      operation: 'OP10',
    });
    const plan = MeasurementPathGenerator.generatePlan(
      [linear(1, 'Kalınlık'), hole(2, 23.6, 13.08, 3.0), linear(3, 'Doğrusal Boyut')],
      plateBbox,
      { verticalAxis: 'Y' }
    );
    expect(plan.featurePaths.map((p) => p.featureId)).toEqual([3, 2, 1]);
  });

  it('Ø2 stylus sığmayan deliklerde Ø1 önerir, sığanlarda öneri üretmez', () => {
    const plan = MeasurementPathGenerator.generatePlan(
      [hole(1, 23.6, 13.08, 3.0), hole(2, 0, 0, 2.5), hole(3, 10, 10, 6.0)],
      plateBbox,
      { verticalAxis: 'Y' }
    );
    const recs = plan.stylusRecommendations;
    expect(recs.map((r) => r.featureId)).toEqual([1, 2]);
    expect(recs.every((r) => r.ballDiameterMm === 1.0 && r.feasible)).toBe(true);
  });

  it('includeDatumSetup açıkken rotanın başında DATUM_A (3), DATUM_B (2), DATUM_C (1) olmak üzere 6 datum noktası üretir', () => {
    const plan = MeasurementPathGenerator.generatePlan([hole(1, 23.6, 13.08, 3.0)], plateBbox, {
      verticalAxis: 'Y',
      includeDatumSetup: true,
    });
    expect(plan.datumTouchPoints).toBeDefined();
    expect(plan.datumTouchPoints).toHaveLength(6);
    expect(plan.datumTouchPoints?.filter((d) => d.label?.startsWith('DATUM_A'))).toHaveLength(3);
    expect(plan.datumTouchPoints?.filter((d) => d.label?.startsWith('DATUM_B'))).toHaveLength(2);
    expect(plan.datumTouchPoints?.filter((d) => d.label?.startsWith('DATUM_C'))).toHaveLength(1);
  });

  it('prob kafa açısı (A0° B0° ↔ A0° B90°) değişirken parçadan uzak ve yüksek güvenli dönüş bölgesine (zClearance + 20) çıkar', () => {
    const topHole = hole(1, 23.6, 13.08, 3.0);
    const sideFeat: PathFeatureInput = {
      id: 2,
      balloon: '#2',
      type: 'DIAMETER',
      type_label: 'Yan Delik',
      nominal: 4.0,
      cad_center: [20, 1.0, 0],
      cad_normal: [1, 0, 0],
      cad_instances: [
        { center: [20, 1.0, 0], normal: [1, 0, 0], stem_blocked: true },
      ],
      operation: 'OP10',
    };
    const plan = MeasurementPathGenerator.generatePlan([topHole, sideFeat], plateBbox, {
      verticalAxis: 'Y',
      clearanceZMarginMm: 15.0,
    });
    const safeHeadY = plan.zClearance + 20.0;
    const highIndexWaypoints = plan.allWaypoints.filter((wp) => Math.abs(wp.position.y - safeHeadY) < 0.05);
    expect(highIndexWaypoints.length).toBeGreaterThanOrEqual(2);
  });

  it('çoklu unsur (cad_instances: 4X delik) verildiğinde 4 deliğin tamamı için toplam 16 temas noktası üretir', () => {
    const multiHole: PathFeatureInput = {
      ...hole(1, 23.6, 13.08, 3.0),
      cad_instances: [
        { center: [23.6, 1.75, 13.08], normal: [0, -1, 0], axial_min: 0.4, axial_max: 3.9 },
        { center: [-23.6, 1.75, 13.08], normal: [0, -1, 0], axial_min: 0.4, axial_max: 3.9 },
        { center: [-23.6, 1.75, -13.08], normal: [0, -1, 0], axial_min: 0.4, axial_max: 3.9 },
        { center: [23.6, 1.75, -13.08], normal: [0, -1, 0], axial_min: 0.4, axial_max: 3.9 },
      ],
    };
    const plan = MeasurementPathGenerator.generatePlan([multiHole], plateBbox, { verticalAxis: 'Y' });
    expect(plan.featurePaths[0].touchPoints).toHaveLength(16);
    expect(plan.featurePaths[0].touchPoints[0].position[1]).toBeCloseTo(2.15, 2);
  });

  it('68.6 x 5.7 x 39.8 mm plakada dikey eksen (Y=5.7) otomatik seçilir ve Ø2.4 / M3 delikler için Ø1x20 stylus atanır', () => {
    const dcPlateBbox = {
      min: [-34.3, 0, -19.9] as [number, number, number],
      max: [34.3, 5.7, 19.9] as [number, number, number],
      size: [68.6, 5.7, 39.8] as [number, number, number],
    };
    const m3Hole: PathFeatureInput = {
      id: 1,
      balloon: '#1',
      type: 'THREAD',
      type_label: '4x M3 Helicoil',
      nominal: 2.4,
      cad_center: [23.6, 2.85, 13.08],
      cad_normal: [0, -1, 0],
      feature_type: 'INTERNAL_CYLINDER',
      operation: 'OP10',
    };
    const plan = MeasurementPathGenerator.generatePlan([m3Hole], dcPlateBbox, {
      clearanceZMarginMm: 25.0,
    });
    expect(plan.zClearance).toBeCloseTo(30.7, 2);
    expect(plan.stylusRecommendations.some((r) => r.ballDiameterMm === 1.0)).toBe(true);
  });
});

