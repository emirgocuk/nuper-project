import { describe, it, expect } from 'vitest';
import { MeasurementPathGenerator, type PathFeatureInput } from './MeasurementPathGenerator';
import { GOBEK_ALL_12_DIMENSIONS } from '../../inspection/utils/InspectionSynchronizer';

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
    expect(planOp10.featurePaths.map((p) => p.balloon)).toEqual(['#2', '#1']);

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
    expect(plan.zClearance).toBe(85.0);
    expect(plan.allWaypoints[0].position.z).toBe(85.0);
  });

  it('Silindirik delik için 4 radyal temas noktası ve güvenli merkez intikalleri kurar', () => {
    const plan = MeasurementPathGenerator.generatePlan([sampleFeatures[0]], mockBbox);
    const featPath = plan.featurePaths[0];

    expect(featPath.touchPoints.length).toBe(4);
    const p1 = featPath.touchPoints[0].position;
    expect(p1[0]).toBeCloseTo(60, 1);
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
    expect(plan.zClearance).toBeCloseTo(23.63, 2);
    expect(plan.allWaypoints[0].position.y).toBeCloseTo(23.63, 2);
    for (const wp of plan.allWaypoints) {
      expect(wp.position.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('iki delik arasında emniyet düzlemi intikali (z >= maxPart + 20) uygular', () => {
    const twoHoles: PathFeatureInput[] = [
      {
        id: 10,
        balloon: '#10',
        type: 'DIAMETER',
        type_label: 'Delik 1',
        nominal: 10.0,
        cad_center: [20, 20, 50],
        cad_normal: [0, 0, 1],
        operation: 'OP10',
      },
      {
        id: 11,
        balloon: '#11',
        type: 'DIAMETER',
        type_label: 'Delik 2',
        nominal: 10.0,
        cad_center: [80, 80, 50],
        cad_normal: [0, 0, 1],
        operation: 'OP10',
      },
    ];
    const plan = MeasurementPathGenerator.generatePlan(twoHoles, mockBbox, { verticalAxis: 'Z' });
    const maxPartZ = mockBbox.max[2];
    const clearanceWaypoints = plan.allWaypoints.filter((wp) => wp.position.z >= maxPartZ + 20.0);
    expect(clearanceWaypoints.length).toBeGreaterThanOrEqual(2);
  });

  it('deliğin eksenel giriş ve çıkış waypointlerinin delik merkezinde olduğunu doğrular', () => {
    const singleHole: PathFeatureInput = {
      id: 20,
      balloon: '#20',
      type: 'DIAMETER',
      type_label: 'Delik',
      nominal: 12.0,
      cad_center: [45, 45, 50],
      cad_normal: [0, 0, 1],
      operation: 'OP10',
    };
    const plan = MeasurementPathGenerator.generatePlan([singleHole], mockBbox, { verticalAxis: 'Z' });
    const featurePath = plan.featurePaths[0];
    const axialEntries = featurePath.waypoints.filter(
      (wp) => (wp as any).subPhase === 'AXIAL_ENTRY' || (wp as any).subPhase === 'PLUNGE_TO_ENTRY'
    );
    expect(axialEntries.length).toBeGreaterThanOrEqual(1);
    for (const wp of axialEntries) {
      expect(wp.position.x).toBeCloseTo(45.0, 1);
      expect(wp.position.y).toBeCloseTo(45.0, 1);
    }
  });

  it('kafa açısı değişiminde safeIndexZ emniyet seviyesinde kafa dönüş waypointi üretir', () => {
    const multiAngle: PathFeatureInput[] = [
      {
        id: 30,
        balloon: '#30',
        type: 'DIAMETER',
        type_label: 'Delik Dikey',
        nominal: 10.0,
        cad_center: [20, 1.75, 20],
        cad_normal: [0, -1, 0],
        operation: 'OP10',
      },
      {
        id: 31,
        balloon: '#31',
        type: 'DIAMETER',
        type_label: 'Yan Delik',
        nominal: 4.0,
        cad_center: [20, 1.0, 0],
        cad_normal: [1, 0, 0],
        cad_instances: [
          { center: [20, 1.0, 0], normal: [1, 0, 0], stem_blocked: true },
        ],
        operation: 'OP10',
      },
    ];
    const yBbox = {
      min: [-30, 0, -20] as [number, number, number],
      max: [30, 5.7, 20] as [number, number, number],
    };
    const plan = MeasurementPathGenerator.generatePlan(multiAngle, yBbox, { verticalAxis: 'Y' });
    expect(plan.safeIndexZ).toBeDefined();
    const safeZ = plan.safeIndexZ!;
    const rotationWps = plan.allWaypoints.filter(
      (wp) => Math.abs(wp.position.y - safeZ) < 0.1
    );
    expect(rotationWps.length).toBeGreaterThanOrEqual(1);
  });

  it('hiçbir waypoint koordinatında z < 0 veya y < 0 olamaz (granit tabla çarpışmasızlık)', () => {
    const plan = MeasurementPathGenerator.generatePlan(sampleFeatures, mockBbox, {
      verticalAxis: 'Y',
      includeDatumSetup: true,
    });
    for (const wp of plan.allWaypoints) {
      expect(wp.position.y).toBeGreaterThanOrEqual(0);
      expect(wp.position.z).toBeGreaterThanOrEqual(0);
    }
  });

  it('TOUCH adımında tipCenterPosition ile surfacePoint mesafesi probeTipRadius değerine eşittir', () => {
    const tipRadius = 1.0;
    const plan = MeasurementPathGenerator.generatePlan(sampleFeatures, mockBbox, {
      probeTipRadiusMm: tipRadius,
      includeDatumSetup: true,
    });
    const touchList = [
      ...(plan.datumTouchPoints ?? []),
      ...plan.featurePaths.flatMap((fp) => fp.touchPoints),
    ];
    expect(touchList.length).toBeGreaterThan(0);
    for (const tp of touchList) {
      if (tp.surfacePoint && tp.tipCenterPosition) {
        const dist = Math.hypot(
          tp.tipCenterPosition[0] - tp.surfacePoint[0],
          tp.tipCenterPosition[1] - tp.surfacePoint[1],
          tp.tipCenterPosition[2] - tp.surfacePoint[2]
        );
        expect(dist).toBeCloseTo(tipRadius, 2);
      }
    }
  });

  it('t=0 anında tüm ölçü boyutları UNMEASURED durumunda başlar', () => {
    expect(GOBEK_ALL_12_DIMENSIONS.length).toBeGreaterThan(0);
    for (const dim of GOBEK_ALL_12_DIMENSIONS) {
      expect(dim.status).toBe('UNMEASURED');
      expect(dim.measured).toBe('--');
      expect(dim.deviation).toBe('--');
    }
  });
});

