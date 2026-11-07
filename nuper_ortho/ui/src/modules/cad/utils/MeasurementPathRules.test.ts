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
});
