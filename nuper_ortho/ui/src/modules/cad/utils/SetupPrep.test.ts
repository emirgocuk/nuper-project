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
});
