import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  selectStylusForHole,
  extractFaceDetailsFromHit,
  selectOptimalStylusConfiguration,
} from './StylusSelector';

describe('StylusSelector', () => {
  it('selectStylusForHole selects appropriate stylus ball diameter', () => {
    const bigHole = selectStylusForHole(5.0);
    expect(bigHole.ballDiameterMm).toBe(2.0);
    expect(bigHole.feasible).toBe(true);

    const smallHole = selectStylusForHole(2.0);
    expect(smallHole.ballDiameterMm).toBe(1.0);
    expect(smallHole.feasible).toBe(true);
    expect(smallHole.changedFromDefault).toBe(true);
  });

  it('extractFaceDetailsFromHit extracts faceId and surfaceType from mesh geometry attributes', () => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0]);
    const faceIds = new Float32Array([4, 4, 4]);
    const surfaceTypes = new Float32Array([2, 2, 2]);

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('faceId', new THREE.BufferAttribute(faceIds, 1));
    geo.setAttribute('surfaceType', new THREE.BufferAttribute(surfaceTypes, 1));

    const mesh = new THREE.Mesh(geo);

    const hit: THREE.Intersection = {
      distance: 10,
      point: new THREE.Vector3(2, 2, 0),
      object: mesh,
      faceIndex: 0,
      face: {
        a: 0,
        b: 1,
        c: 2,
        normal: new THREE.Vector3(0, 0, 1),
        materialIndex: 0,
      },
    };

    const details = extractFaceDetailsFromHit(hit, mesh);
    expect(details).not.toBeNull();
    expect(details?.faceId).toBe(4);
    expect(details?.surfaceType).toBe('CYLINDER');
    expect(details?.normal).toEqual([0, 0, 1]);
  });

  it('selectOptimalStylusConfiguration handles housing collision by selecting 5-way star stylus', () => {
    const straight = selectOptimalStylusConfiguration(false, [0, 0, 1]);
    expect(straight.stylusType).toBe('STRAIGHT_SINGLE');
    expect(straight.tipIndex).toBe(1);

    const starX = selectOptimalStylusConfiguration(true, [1, 0, 0]);
    expect(starX.stylusType).toBe('STAR_5WAY_30MM');
    expect(starX.tipIndex).toBe(2);
    expect(starX.ph10Angle.label).toBe('A0.0° B0.0°');

    const starYNeg = selectOptimalStylusConfiguration(true, [0, -1, 0]);
    expect(starYNeg.stylusType).toBe('STAR_5WAY_30MM');
    expect(starYNeg.tipIndex).toBe(5);
  });
});
