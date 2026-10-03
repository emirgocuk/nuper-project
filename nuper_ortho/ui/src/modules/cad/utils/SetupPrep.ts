import * as THREE from 'three';

export interface BoundingBoxEnvelope {
  min: [number, number, number];
  max: [number, number, number];
  size: [number, number, number];
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
}
