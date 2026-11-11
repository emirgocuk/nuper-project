import { describe, it, expect } from 'vitest';
import { Ph10Kinematics } from './Ph10Kinematics';

describe('Ph10Kinematics — Renishaw PH10 A/B Motorize Açı ve Yönelim Motoru', () => {
  it('A=0, B=0 iken prob yönelim vektörü tam dikey aşağı (-Z) bakar', () => {
    const dir = Ph10Kinematics.computeDirection(0, 0);
    expect(dir[0]).toBeCloseTo(0, 4);
    expect(dir[1]).toBeCloseTo(0, 4);
    expect(dir[2]).toBeCloseTo(-1, 4);
  });

  it('A=90, B=0 iken prob ön yöne (-Y) bakar', () => {
    const dir = Ph10Kinematics.computeDirection(90, 0);
    expect(dir[0]).toBeCloseTo(0, 4);
    expect(dir[1]).toBeCloseTo(-1, 4);
    expect(dir[2]).toBeCloseTo(0, 4);
  });

  it('A=90, B=90 iken prob sağ yöne (+X) bakar', () => {
    const dir = Ph10Kinematics.computeDirection(90, 90);
    expect(dir[0]).toBeCloseTo(1, 4);
    expect(dir[1]).toBeCloseTo(0, 4);
    expect(dir[2]).toBeCloseTo(0, 4);
  });

  it('A=90, B=-90 iken prob sol yöne (-X) bakar', () => {
    const dir = Ph10Kinematics.computeDirection(90, -90);
    expect(dir[0]).toBeCloseTo(-1, 4);
    expect(dir[1]).toBeCloseTo(0, 4);
    expect(dir[2]).toBeCloseTo(0, 4);
  });

  it('720 diskret açılık LUT tablosu oluşturur ve önbelleğe alır', () => {
    const lut = Ph10Kinematics.getLookUpTable();
    expect(lut.length).toBe(16 * 48); // 16 A adımı (0..105° 7.5°'lik) * 48 B adımı
    expect(lut[0].label).toBe('A0° B-180°');
  });

  it('Hedef yaklaşma vektörüne en yakın PH10 açısını sıfır sapmayla seçer', () => {
    // Düşey aşağı delik yaklaşması [0, 0, -1] -> A0 B0
    const resTop = Ph10Kinematics.findBestAngle([0, 0, -1]);
    expect(resTop.angle.aDeg).toBe(0);
    expect(resTop.angularErrorDeg).toBeCloseTo(0, 2);

    // Yan yüzey yaklaşması [0, -1, 0] -> A90 B0
    const resFront = Ph10Kinematics.findBestAngle([0, -1, 0]);
    expect(resFront.angle.aDeg).toBe(90);
    expect(resFront.angle.bDeg).toBe(0);
    expect(resFront.angularErrorDeg).toBeCloseTo(0, 2);
  });

  it('Unsur kümesini kafa açısına göre gruplayarak kafa dönme sayısını optimize eder', () => {
    const features = [
      { id: 'hole1', approach: [0, 0, -1] as [number, number, number] },
      { id: 'hole2', approach: [0, 0, -1] as [number, number, number] },
      { id: 'side1', approach: [1, 0, 0] as [number, number, number] },
    ];

    const clusters = Ph10Kinematics.clusterFeaturesByAngle(features, (f) => f.approach);
    expect(clusters.size).toBe(2);
    expect(clusters.get('A0° B0°')?.items.length).toBe(2);
    expect(clusters.get('A90° B90°')?.items.length).toBe(1);
  });

  it('quantizeAngle 7.5 derecelik mekanik disli adimlarina yuvarlar', () => {
    const q1 = Ph10Kinematics.quantizeAngle(3.8, 14.8);
    expect(q1.aDeg).toBe(7.5);
    expect(q1.bDeg).toBe(15.0);

    const q2 = Ph10Kinematics.quantizeAngle(110.0, -190.0);
    expect(q2.aDeg).toBe(105.0);
    expect(q2.bDeg).toBe(172.5);
  });

  it('verifySweepClearance tavan yuksekliginde ve guvenli mesafede dogrulanir', () => {
    const bbox = {
      min: [0, 0, 0] as [number, number, number],
      max: [100, 50, 100] as [number, number, number],
    };
    const isSafeHigh = Ph10Kinematics.verifySweepClearance([50, 200, 50], bbox, 60, 50, 'Y');
    expect(isSafeHigh).toBe(true);

    const isCollisionClose = Ph10Kinematics.verifySweepClearance([50, 60, 50], bbox, 60, 50, 'Y');
    expect(isCollisionClose).toBe(false);
  });

  it('Kesintisiz 5-eksen helisel delik tarama takim yolunu 0.0002mm toleransla uretir (Faz 10)', () => {
    const waypoints = Ph10Kinematics.generateHelicalScan5Axis(
      [100.0, 50.0, 0.0],
      20.0,
      60.0,
      2.0,
      2.0,
      72
    );

    expect(waypoints.length).toBeGreaterThan(100);
    for (const wp of waypoints) {
      const radialDist = Math.hypot(wp.tipPos[0] - 100.0, wp.tipPos[1] - 50.0);
      const effectiveSurfaceR = radialDist + 2.0;
      expect(Math.abs(effectiveSurfaceR - 20.0)).toBeLessThan(0.0002);
    }
  });

  it('Kuaterniyon slerp acisal enterpolasyonunu dogrular (Faz 10)', () => {
    const q1: [number, number, number, number] = [0, 0, 0, 1];
    const q2: [number, number, number, number] = [0, 0.70710678, 0, 0.70710678];
    const mid = Ph10Kinematics.slerpQuaternion(q1, q2, 0.5);
    const norm = Math.hypot(...mid);
    expect(Math.abs(norm - 1.0)).toBeLessThan(1e-5);
  });
});

