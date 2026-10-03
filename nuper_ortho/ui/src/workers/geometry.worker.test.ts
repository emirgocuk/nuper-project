import { describe, it, expect } from 'vitest';
import { computeJacobiPCA } from './geometry.worker';

describe('geometry.worker (Jacobi PCA ve Arka Plan Geometri Motoru)', () => {
  it('Yetersiz nokta durumunda (< 3 nokta) 3x3 birim matris döner', () => {
    const emptyPoints = new Float64Array([]);
    const res = computeJacobiPCA(emptyPoints);
    expect(res).toEqual(new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

    const twoPoints = new Float64Array([0, 0, 0, 1, 1, 1]);
    const res2 = computeJacobiPCA(twoPoints);
    expect(res2).toEqual(new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
  });

  it('X ekseni boyunca uzatılmış nokta bulutunda ana ekseni doğru tespit eder', () => {
    // X ekseninde yayılmış noktalar
    const points = new Float64Array([
      -100, 0, 0,
      100, 0, 0,
      -50, 1, 0,
      50, -1, 0,
      0, 2, 1,
      0, -2, -1,
    ]);

    const eigenvectors = computeJacobiPCA(points);
    expect(eigenvectors.length).toBe(9);

    // İlk veya herhangi bir özvektör X ekseni ile neredeyse kolineer olmalıdır (|dot(v, [1,0,0])| ~ 1)
    const v1 = [eigenvectors[0], eigenvectors[1], eigenvectors[2]];
    const v2 = [eigenvectors[3], eigenvectors[4], eigenvectors[5]];
    const v3 = [eigenvectors[6], eigenvectors[7], eigenvectors[8]];

    const dotX1 = Math.abs(v1[0]);
    const dotX2 = Math.abs(v2[0]);
    const dotX3 = Math.abs(v3[0]);
    const maxDotX = Math.max(dotX1, dotX2, dotX3);

    expect(maxDotX).toBeGreaterThan(0.99);
  });

  it('Üretilen özvektör matrisinin kesinlikle ortonormal olduğunu doğrular', () => {
    const points = new Float64Array([
      12.5, 4.2, 9.1,
      -3.1, 15.6, 2.2,
      7.8, -9.0, 14.3,
      -11.2, 0.5, -8.7,
      5.4, 6.7, -1.2,
      -2.0, -4.5, 5.0,
    ]);

    const eigenvectors = computeJacobiPCA(points);

    const v1 = [eigenvectors[0], eigenvectors[1], eigenvectors[2]];
    const v2 = [eigenvectors[3], eigenvectors[4], eigenvectors[5]];
    const v3 = [eigenvectors[6], eigenvectors[7], eigenvectors[8]];

    // Birim uzunluk testi: |v| = 1
    const len1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2);
    const len2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2);
    const len3 = Math.sqrt(v3[0] ** 2 + v3[1] ** 2 + v3[2] ** 2);

    expect(len1).toBeCloseTo(1.0, 5);
    expect(len2).toBeCloseTo(1.0, 5);
    expect(len3).toBeCloseTo(1.0, 5);

    // Ortogonallik testi: v_i . v_j = 0
    const dot12 = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    const dot13 = v1[0] * v3[0] + v1[1] * v3[1] + v1[2] * v3[2];
    const dot23 = v2[0] * v3[0] + v2[1] * v3[1] + v2[2] * v3[2];

    expect(dot12).toBeCloseTo(0.0, 5);
    expect(dot13).toBeCloseTo(0.0, 5);
    expect(dot23).toBeCloseTo(0.0, 5);
  });
});
