import * as THREE from 'three';

export interface BoundingBoxEnvelope {
  min: [number, number, number];
  max: [number, number, number];
  size: [number, number, number];
}

export interface ClampBox {
  id: string;
  min: [number, number, number];
  max: [number, number, number];
}

export interface KeepOutZoneDto {
  name: string;
  min: [number, number, number];
  max: [number, number, number];
}

export interface CadBboxInput {
  size: [number, number, number];
  min?: [number, number, number];
  max?: [number, number, number];
}

export interface CadFeatureInput {
  id: string;
  feature_type: string;
  nominal_dimension?: number;
  center?: [number, number, number];
  normal?: [number, number, number];
}

export interface SetupCandidateScore {
  axis: 'x' | 'y' | 'z';
  direction: 1 | -1;
  faceNormal: [number, number, number];
  heightMm: number;
  stabilityScore: number;
  accessibleFeatures: number;
  totalFeatures: number;
  coverageRatio: number;
  compositeScore: number;
  requiresOp20: boolean;
  explanation: string;
}

export interface SetupRecommendation {
  bestCandidate: SetupCandidateScore;
  rotationMatrix: THREE.Matrix4;
  candidates: SetupCandidateScore[];
  summaryMessage: string;
}

export interface SetupPrepOptions {
  datumNormal?: THREE.Vector3;
  targetNormal?: THREE.Vector3;
  rotateXDeg?: number;
  rotateYDeg?: number;
  rotateZDeg?: number;
  zOffsetMm?: number;
}

export class SetupPrep {
  public static computeCollinearSafePoints(
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    width: number,
    depth: number,
    normal: [number, number, number] = [0, 1, 0]
  ): [number, number, number][] {
    const v1 = new THREE.Vector3(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    const v2 = new THREE.Vector3(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);
    const cross = new THREE.Vector3().crossVectors(v1, v2);
    const area = 0.5 * cross.length();
    const minRequiredArea = 0.25 * width * depth;

    if (area >= minRequiredArea && cross.length() > 1e-4) {
      return [p1, p2, p3];
    }

    const n = new THREE.Vector3(normal[0], normal[1], normal[2]).normalize();
    const ref = Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const u = new THREE.Vector3().crossVectors(n, ref).normalize();
    const v = new THREE.Vector3().crossVectors(n, u).normalize();

    const spanU = Math.max(10.0, width * 0.4);
    const spanV = Math.max(10.0, depth * 0.4);
    const center = new THREE.Vector3(
      (p1[0] + p2[0] + p3[0]) / 3,
      (p1[1] + p2[1] + p3[1]) / 3,
      (p1[2] + p2[2] + p3[2]) / 3
    );

    const safe1 = center.clone().addScaledVector(u, spanU);
    const safe2 = center.clone().addScaledVector(u, -spanU * 0.5).addScaledVector(v, spanV * 0.866);
    const safe3 = center.clone().addScaledVector(u, -spanU * 0.5).addScaledVector(v, -spanV * 0.866);

    return [
      [parseFloat(safe1.x.toFixed(3)), parseFloat(safe1.y.toFixed(3)), parseFloat(safe1.z.toFixed(3))],
      [parseFloat(safe2.x.toFixed(3)), parseFloat(safe2.y.toFixed(3)), parseFloat(safe2.z.toFixed(3))],
      [parseFloat(safe3.x.toFixed(3)), parseFloat(safe3.y.toFixed(3)), parseFloat(safe3.z.toFixed(3))],
    ];
  }

  public static verifyProperRightHandedMatrix(matrix: THREE.Matrix4): THREE.Matrix4 {
    const el = matrix.elements;
    const x = new THREE.Vector3(el[0], el[1], el[2]);
    const z = new THREE.Vector3(el[8], el[9], el[10]);

    const det = matrix.determinant();
    if (det < 0) {
      const fixedY = new THREE.Vector3().crossVectors(z, x).normalize();
      el[4] = fixedY.x;
      el[5] = fixedY.y;
      el[6] = fixedY.z;
    }
    return matrix;
  }

  public static calculateRotationMatrix(axis: 'x' | 'y' | 'z', angleDeg: number): THREE.Matrix4 {
    const angleRad = THREE.MathUtils.degToRad(angleDeg);
    const matrix = new THREE.Matrix4();
    if (axis === 'x') {
      matrix.makeRotationX(angleRad);
    } else if (axis === 'y') {
      matrix.makeRotationY(angleRad);
    } else {
      matrix.makeRotationZ(angleRad);
    }
    return matrix;
  }

  public static calculateAlignToTableMatrix(
    geometry: THREE.BufferGeometry,
    datumNormal: THREE.Vector3,
    targetNormal: THREE.Vector3 = new THREE.Vector3(0, -1, 0),
    zOffsetMm = 0
  ): THREE.Matrix4 {
    const normalizedDatum = datumNormal.clone().normalize();
    const normalizedTarget = targetNormal.clone().normalize();

    const rotationMatrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(normalizedDatum, normalizedTarget);
    rotationMatrix.makeRotationFromQuaternion(quaternion);

    const tempGeo = geometry.clone();
    tempGeo.applyMatrix4(rotationMatrix);
    tempGeo.computeBoundingBox();

    const translationMatrix = new THREE.Matrix4();
    if (tempGeo.boundingBox) {
      const minY = tempGeo.boundingBox.min.y;
      translationMatrix.makeTranslation(0, -minY + zOffsetMm, 0);
    }
    tempGeo.dispose();

    return new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix);
  }

  public static create5AxisSetupMatrix(
    geometry: THREE.BufferGeometry,
    options: SetupPrepOptions
  ): THREE.Matrix4 {
    const compositeMatrix = new THREE.Matrix4();

    if (options.rotateXDeg) {
      compositeMatrix.multiply(SetupPrep.calculateRotationMatrix('x', options.rotateXDeg));
    }
    if (options.rotateYDeg) {
      compositeMatrix.multiply(SetupPrep.calculateRotationMatrix('y', options.rotateYDeg));
    }
    if (options.rotateZDeg) {
      compositeMatrix.multiply(SetupPrep.calculateRotationMatrix('z', options.rotateZDeg));
    }

    if (options.datumNormal) {
      const tempGeo = geometry.clone().applyMatrix4(compositeMatrix);
      const alignMatrix = SetupPrep.calculateAlignToTableMatrix(
        tempGeo,
        options.datumNormal,
        options.targetNormal ?? new THREE.Vector3(0, -1, 0),
        options.zOffsetMm ?? 0
      );
      compositeMatrix.premultiply(alignMatrix);
      tempGeo.dispose();
    } else if (options.zOffsetMm && options.zOffsetMm !== 0) {
      const offsetMatrix = new THREE.Matrix4().makeTranslation(0, options.zOffsetMm, 0);
      compositeMatrix.premultiply(offsetMatrix);
    }

    return compositeMatrix;
  }

  public static applyTransformation(
    geometry: THREE.BufferGeometry,
    matrix: THREE.Matrix4
  ): THREE.BufferGeometry {
    geometry.applyMatrix4(matrix);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  }

  public static computeBoundingBoxEnvelope(geometry: THREE.BufferGeometry): BoundingBoxEnvelope {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
      min: [box.min.x, box.min.y, box.min.z],
      max: [box.max.x, box.max.y, box.max.z],
      size: [size.x, size.y, size.z],
    };
  }

  public static recommendPartSetup(
    bbox: CadBboxInput,
    features: CadFeatureInput[] = []
  ): SetupRecommendation {
    const sizeX = Math.max(0.1, bbox.size[0] || 10);
    const sizeY = Math.max(0.1, bbox.size[1] || 10);
    const sizeZ = Math.max(0.1, bbox.size[2] || 10);
    const minDim = Math.min(sizeX, sizeY, sizeZ);

    const candidates: SetupCandidateScore[] = [];

    const dirs: Array<{ axis: 'x' | 'y' | 'z'; direction: 1 | -1; normal: [number, number, number]; height: number }> = [
      { axis: 'y', direction: -1, normal: [0, -1, 0], height: sizeY },
      { axis: 'y', direction: 1, normal: [0, 1, 0], height: sizeY },
      { axis: 'z', direction: -1, normal: [0, 0, -1], height: sizeZ },
      { axis: 'z', direction: 1, normal: [0, 0, 1], height: sizeZ },
      { axis: 'x', direction: -1, normal: [-1, 0, 0], height: sizeX },
      { axis: 'x', direction: 1, normal: [1, 0, 0], height: sizeX },
    ];

    const totalFeatures = features.length;

    for (const d of dirs) {
      const stabilityScore = Math.round((minDim / d.height) * 100);
      const approach = [-d.normal[0], -d.normal[1], -d.normal[2]];
      let accessible = 0;

      if (totalFeatures > 0) {
        for (const feat of features) {
          const fn = feat.normal || [0, 1, 0];
          const dot = fn[0] * approach[0] + fn[1] * approach[1] + fn[2] * approach[2];
          if (dot >= -0.25) {
            accessible++;
          }
        }
      } else {
        accessible = 1;
      }

      const coverageRatio = totalFeatures > 0 ? accessible / totalFeatures : 1.0;
      const compositeScore = Math.round(coverageRatio * 60 + stabilityScore * 0.4);
      const requiresOp20 = totalFeatures > 0 ? accessible < totalFeatures : false;

      candidates.push({
        axis: d.axis,
        direction: d.direction,
        faceNormal: d.normal,
        heightMm: Math.round(d.height * 10) / 10,
        stabilityScore,
        accessibleFeatures: accessible,
        totalFeatures,
        coverageRatio: Math.round(coverageRatio * 1000) / 10,
        compositeScore,
        requiresOp20,
        explanation: `Normal [${d.normal.join(', ')}] tabana oturur. Yükseklik: ${d.height.toFixed(1)} mm. Erişim: ${accessible}/${totalFeatures} unsur (%${(coverageRatio * 100).toFixed(0)}).`,
      });
    }

    candidates.sort((a, b) => b.compositeScore - a.compositeScore);
    const best = candidates[0];

    const rotationMatrix = new THREE.Matrix4();
    const currentNormal = new THREE.Vector3(...best.faceNormal).normalize();
    const targetNormal = new THREE.Vector3(0, -1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(currentNormal, targetNormal);
    rotationMatrix.makeRotationFromQuaternion(quat);

    const summaryMessage = `📐 Otomatik Bağlama: Model en kararlı eksende [${best.faceNormal.join(', ')}] tabanına yatırıldı (Yükseklik: ${best.heightMm} mm, Kararlılık: %${best.stabilityScore}). OP10 erişim: %${best.coverageRatio}. ${best.requiresOp20 ? 'Alt yüzey için OP20 gerekecek.' : 'Tek bağlama yeterli.'}`;

    return {
      bestCandidate: best,
      rotationMatrix,
      candidates,
      summaryMessage,
    };
  }

  public static computeStandardClampBoxes(bbox: BoundingBoxEnvelope): ClampBox[] {
    const minX = bbox.min[0];
    const maxX = bbox.max[0];
    const minZ = bbox.min[2];
    const maxZ = bbox.max[2];
    const sizeZ = bbox.size[2];
    const tableY = 0;
    const clampHeight = 18.0;
    const clampWidthX = 25.0;
    const clampDepthZ = 20.0;

    const z1 = minZ + sizeZ * 0.25;
    const z2 = maxZ - sizeZ * 0.25;

    return [
      {
        id: 'CLAMP_LEFT_FRONT',
        min: [minX - clampWidthX, tableY, z1 - clampDepthZ / 2],
        max: [minX, tableY + clampHeight, z1 + clampDepthZ / 2],
      },
      {
        id: 'CLAMP_LEFT_REAR',
        min: [minX - clampWidthX, tableY, z2 - clampDepthZ / 2],
        max: [minX, tableY + clampHeight, z2 + clampDepthZ / 2],
      },
      {
        id: 'CLAMP_RIGHT_FRONT',
        min: [maxX, tableY, z1 - clampDepthZ / 2],
        max: [maxX + clampWidthX, tableY + clampHeight, z1 + clampDepthZ / 2],
      },
      {
        id: 'CLAMP_RIGHT_REAR',
        min: [maxX, tableY, z2 - clampDepthZ / 2],
        max: [maxX + clampWidthX, tableY + clampHeight, z2 + clampDepthZ / 2],
      },
    ];
  }

  public static isPointInsideClampBox(
    pt: [number, number, number],
    box: ClampBox,
    margin = 5.0
  ): boolean {
    return (
      pt[0] >= box.min[0] - margin &&
      pt[0] <= box.max[0] + margin &&
      pt[1] >= box.min[1] - margin &&
      pt[1] <= box.max[1] + margin &&
      pt[2] >= box.min[2] - margin &&
      pt[2] <= box.max[2] + margin
    );
  }

  public static lineIntersectsClampBox(
    p1: [number, number, number],
    p2: [number, number, number],
    box: ClampBox,
    margin = 5.0
  ): boolean {
    const minX = box.min[0] - margin;
    const maxX = box.max[0] + margin;
    const minY = box.min[1] - margin;
    const maxY = box.max[1] + margin;
    const minZ = box.min[2] - margin;
    const maxZ = box.max[2] + margin;

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];

    let tMin = 0.0;
    let tMax = 1.0;

    const checkAxis = (origin: number, dir: number, bMin: number, bMax: number): boolean => {
      if (Math.abs(dir) < 1e-8) {
        return origin >= bMin && origin <= bMax;
      }
      const invD = 1.0 / dir;
      let t0 = (bMin - origin) * invD;
      let t1 = (bMax - origin) * invD;
      if (t0 > t1) {
        const tmp = t0;
        t0 = t1;
        t1 = tmp;
      }
      tMin = Math.max(tMin, t0);
      tMax = Math.min(tMax, t1);
      return tMin <= tMax;
    };

    if (!checkAxis(p1[0], dx, minX, maxX)) return false;
    if (!checkAxis(p1[1], dy, minY, maxY)) return false;
    if (!checkAxis(p1[2], dz, minZ, maxZ)) return false;

    return tMin <= tMax && tMax >= 0.0 && tMin <= 1.0;
  }

  public static buildKeepOutZonesFromClamps(clamps: ClampBox[]): KeepOutZoneDto[] {
    return clamps.map((c) => ({
      name: c.id,
      min: c.min,
      max: c.max,
    }));
  }
}
