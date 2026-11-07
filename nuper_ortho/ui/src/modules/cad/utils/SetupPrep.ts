import * as THREE from 'three';

export interface BoundingBoxEnvelope {
  min: [number, number, number];
  max: [number, number, number];
  size: [number, number, number];
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
}
