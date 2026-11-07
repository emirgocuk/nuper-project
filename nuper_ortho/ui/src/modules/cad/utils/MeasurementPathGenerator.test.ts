import { describe, it, expect } from 'vitest';
import { MeasurementPathGenerator, type PathFeatureInput } from './MeasurementPathGenerator';

describe('MeasurementPathGenerator — Otomatik CMM Ölçüm Yolu ve Dokunma Noktası Üretici', () => {
  const mockBbox = {
    min: [0, 0, 0] as [number, number, number],
    max: [100, 100, 50] as [number, number, number],
  };

  const sampleFeatures: PathFeatureInput[] = [
    {
      id: 1,
      balloon: '#1',
      type: 'DIAMETER',
      type_label: 'Silindirik Çap / Delik',
      nominal: 20.0,
      cad_center: [50, 50, 50],
      cad_normal: [0, 0, 1],
      operation: 'OP10',
    },
    {
      id: 2,
      balloon: '#2',
      type: 'LINEAR',
      type_label: 'Düzlem / Yüzey',
      nominal: 50.0,
      cad_center: [20, 20, 50],
      cad_normal: [0, 0, 1],
      operation: 'OP10',
    },
    {
      id: 3,
      balloon: '#3',
      type: 'DIAMETER',
      nominal: 12.0,
      cad_center: [50, 50, 0],
      cad_normal: [0, 0, -1],
      operation: 'OP20',
    },
  ];

  it('OP10 ve OP20 operasyonlarını ayrıştırır ve yalnız aktif kurulumu planlar', () => {
    const planOp10 = MeasurementPathGenerator.generatePlan(sampleFeatures, mockBbox, {
      activeOperation: 'OP10',
    });
    expect(planOp10.operation).toBe('OP10');
    expect(planOp10.featurePaths.length).toBe(2);
    expect(planOp10.featurePaths.map((p) => p.balloon)).toEqual(['#1', '#2']);

    const planOp20 = MeasurementPathGenerator.generatePlan(sampleFeatures, mockBbox, {
      activeOperation: 'OP20',
    });
    expect(planOp20.operation).toBe('OP20');
    expect(planOp20.featurePaths.length).toBe(1);
    expect(planOp20.featurePaths[0].balloon).toBe('#3');
  });

  it('Z-First güvenli tavan seviyesini (Z_clearance) parça yüksekliğine marj ekleyerek hesaplar', () => {
    const plan = MeasurementPathGenerator.generatePlan(sampleFeatures, mockBbox, {
      clearanceZMarginMm: 35.0,
    });
    // bbox.max[2] = 50 + 35 = 85.0 mm
    expect(plan.zClearance).toBe(85.0);
    expect(plan.allWaypoints[0].position.z).toBe(85.0);
  });

  it('Silindirik delik için 4 radyal temas noktası ve güvenli merkez intikalleri kurar', () => {
    const plan = MeasurementPathGenerator.generatePlan([sampleFeatures[0]], mockBbox);
    const featPath = plan.featurePaths[0];

    expect(featPath.touchPoints.length).toBe(4);
    // Yarıçap = 20 / 2 = 10 mm. Merkez [50, 50, 47]
    const p1 = featPath.touchPoints[0].position;
    expect(p1[0]).toBeCloseTo(60, 1); // 50 + 10
    expect(p1[1]).toBeCloseTo(50, 1);

    const hasTouchPhase = featPath.waypoints.some((w) => w.phase === 'TOUCH');
    const hasRetractPhase = featPath.waypoints.some((w) => w.phase === 'RETRACT');
    expect(hasTouchPhase).toBe(true);
    expect(hasRetractPhase).toBe(true);
  });

  it('Yüzey normaline göre doğru PH10 kafa açısını otomatik atar', () => {
    const plan = MeasurementPathGenerator.generatePlan(sampleFeatures, mockBbox, {
      activeOperation: 'OP10',
    });
    // Normal [0, 0, 1] (yukarı) -> Prob yaklaşması [0, 0, -1] -> A0° B0°
    expect(plan.featurePaths[0].ph10Angle.label).toBe('A0° B0°');
  });

  it('Toplam intikal mesafesini ve tahmini süreyi hesaplar', () => {
    const plan = MeasurementPathGenerator.generatePlan(sampleFeatures, mockBbox);
    expect(plan.totalDistanceMm).toBeGreaterThan(0);
    expect(plan.estimatedDurationSec).toBeGreaterThan(0);
  });

  it('Three.js Y-ekseni dikey koordinat modunda güvenli pozitif kot ve tavan yüksekliği hesaplar', () => {
    const dcBbox = {
      min: [-19.5, 0, -30.3] as [number, number, number],
      max: [19.5, 8.63, 30.3] as [number, number, number],
    };
    const plan = MeasurementPathGenerator.generatePlan(sampleFeatures, dcBbox, {
      verticalAxis: 'Y',
      clearanceZMarginMm: 15.0,
    });
    // Y_clearance = 8.63 + 15 = 23.63
    expect(plan.zClearance).toBeCloseTo(23.63, 2);
    expect(plan.allWaypoints[0].position.y).toBeCloseTo(23.63, 2);
    for (const wp of plan.allWaypoints) {
      expect(wp.position.y).toBeGreaterThanOrEqual(0);
    }
  });
});

