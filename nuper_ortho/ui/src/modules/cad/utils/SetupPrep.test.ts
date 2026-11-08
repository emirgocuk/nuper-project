import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { SetupPrep } from './SetupPrep';
import { CADViewer } from '../CADViewer';

describe('5 Eksen Bağlama ve Geometri Hazırlık Modülü (SetupPrep)', () => {
  it('Eksenel serbest döndürme matrisleri (0°, 45°, 90°, 180°) doğru hesaplanır', () => {
    const mat90Z = SetupPrep.calculateRotationMatrix('z', 90);
    const vec = new THREE.Vector3(1, 0, 0).applyMatrix4(mat90Z);
    expect(vec.x).toBeCloseTo(0, 4);
    expect(vec.y).toBeCloseTo(1, 4);
    expect(vec.z).toBeCloseTo(0, 4);

    const mat180X = SetupPrep.calculateRotationMatrix('x', 180);
    const vecY = new THREE.Vector3(0, 1, 0).applyMatrix4(mat180X);
    expect(vecY.x).toBeCloseTo(0, 4);
    expect(vecY.y).toBeCloseTo(-1, 4);
    expect(vecY.z).toBeCloseTo(0, 4);
  });

  it('Referans datum yüzey normaline göre parça granit tabla düzlemine (minY=0) yatırılır', () => {
    const geometry = new THREE.BoxGeometry(50, 30, 20);
    const datumNormal = new THREE.Vector3(0, 1, 0);

    const alignMatrix = SetupPrep.calculateAlignToTableMatrix(geometry, datumNormal, new THREE.Vector3(0, -1, 0));
    SetupPrep.applyTransformation(geometry, alignMatrix);

    const envelope = SetupPrep.computeBoundingBoxEnvelope(geometry);
    expect(envelope.min[1]).toBeCloseTo(0.0, 3);
    geometry.dispose();
  });

  it('Z ofset yükseltme (pabuç / takoz payı) CMM zarfına eklenir', () => {
    const geometry = new THREE.BoxGeometry(40, 20, 10);
    const matrix = SetupPrep.create5AxisSetupMatrix(geometry, {
      datumNormal: new THREE.Vector3(0, 1, 0),
      zOffsetMm: 25.0,
    });

    SetupPrep.applyTransformation(geometry, matrix);
    const envelope = SetupPrep.computeBoundingBoxEnvelope(geometry);

    expect(envelope.min[1]).toBeCloseTo(25.0, 3);
    geometry.dispose();
  });

  it('5-Eksen composite matris ile serbest döndürme ve ofset birlikte uygulanır', () => {
    const geometry = new THREE.BoxGeometry(100, 20, 50);
    const matrix = SetupPrep.create5AxisSetupMatrix(geometry, {
      rotateYDeg: 90,
      zOffsetMm: 10.0,
    });

    SetupPrep.applyTransformation(geometry, matrix);
    const envelope = SetupPrep.computeBoundingBoxEnvelope(geometry);

    expect(envelope.size[0]).toBeCloseTo(50, 1);
    expect(envelope.size[2]).toBeCloseTo(100, 1);
    geometry.dispose();
  });

  it('CADViewer üzerinden applySetupOrientation modeli yönlendirir ve Bounding Box zarfını günceller', () => {
    const viewer = new CADViewer();
    const boxGeo = new THREE.BoxGeometry(60, 40, 30);
    viewer.setModelGeometry(boxGeo);

    const envBefore = viewer.getBoundingBoxEnvelope();
    expect(envBefore).not.toBeNull();
    expect(envBefore?.size).toEqual([60, 40, 30]);

    const envAfter = viewer.applySetupOrientation({
      datumNormal: new THREE.Vector3(0, 1, 0),
      rotateYDeg: 45,
      zOffsetMm: 15.0,
    });

    expect(envAfter).not.toBeNull();
    expect(envAfter?.min[1]).toBeCloseTo(15.0, 3);

    viewer.destroy();
  });

  it('recommendPartSetup en kararlı taban yüzeyini ve prob erişilebilirlik skorunu otomatik belirler', () => {
    // 39 x 5.7 x 60.6 mm DC Modül Plaka simülasyonu
    const bbox = { size: [39.0, 5.7, 60.6] as [number, number, number] };
    const features = [
      { id: 'hole_1', feature_type: 'INTERNAL_CYLINDER', normal: [0, 1, 0] as [number, number, number] },
      { id: 'hole_2', feature_type: 'INTERNAL_CYLINDER', normal: [0, 1, 0] as [number, number, number] },
      { id: 'plane_top', feature_type: 'PLANE', normal: [0, 1, 0] as [number, number, number] },
      { id: 'plane_bottom', feature_type: 'PLANE', normal: [0, -1, 0] as [number, number, number] },
    ];

    const recommendation = SetupPrep.recommendPartSetup(bbox, features);

    expect(recommendation.bestCandidate).toBeDefined();
    expect(recommendation.bestCandidate.axis).toBe('y');
    expect(recommendation.bestCandidate.heightMm).toBe(5.7);
    expect(recommendation.bestCandidate.stabilityScore).toBe(100);
    expect(recommendation.bestCandidate.compositeScore).toBeGreaterThanOrEqual(70);
    expect(recommendation.rotationMatrix).toBeDefined();
    expect(recommendation.summaryMessage).toContain('📐 Otomatik Bağlama');
  });

  it('recommendPartSetup tüm unsurlar tek yönden erişilebiliyorsa requiresOp20 false verir', () => {
    const bbox = { size: [50, 20, 30] as [number, number, number] };
    const features = [
      { id: 'h1', feature_type: 'INTERNAL_CYLINDER', normal: [0, 1, 0] as [number, number, number] },
      { id: 'h2', feature_type: 'INTERNAL_CYLINDER', normal: [0, 1, 0] as [number, number, number] },
    ];

    const recommendation = SetupPrep.recommendPartSetup(bbox, features);
    expect(recommendation.bestCandidate.axis).toBe('y');
    expect(recommendation.bestCandidate.requiresOp20).toBe(false);
  });

  it('computeCollinearSafePoints dogrusal veya kucuk ucgen durumunda genis ucgen uretir', () => {
    const collinear = SetupPrep.computeCollinearSafePoints(
      [0, 10, 0],
      [10, 10, 0],
      [20, 10, 0],
      100,
      50,
      [0, 1, 0]
    );
    expect(collinear.length).toBe(3);
    const v1 = new THREE.Vector3(collinear[1][0] - collinear[0][0], collinear[1][1] - collinear[0][0], collinear[1][2] - collinear[0][2]);
    const v2 = new THREE.Vector3(collinear[2][0] - collinear[0][0], collinear[2][1] - collinear[0][0], collinear[2][2] - collinear[0][2]);
    const cross = new THREE.Vector3().crossVectors(v1, v2);
    expect(cross.length()).toBeGreaterThan(1e-3);
  });

  it('verifyProperRightHandedMatrix sol el matrisi durumunda y eksenini duzeltir', () => {
    const leftHanded = new THREE.Matrix4().set(
      1, 0, 0, 0,
      0, -1, 0, 0,
      0, 0, -1, 0,
      0, 0, 0, 1
    );
    const corrected = SetupPrep.verifyProperRightHandedMatrix(leftHanded);
    expect(corrected.determinant()).toBeGreaterThan(0);
  });
});
