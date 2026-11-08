import * as THREE from 'three';
import type { CadMetadata } from '../../../types/generated/cad_metadata';

export interface DetectedHoleItem {
  center: [number, number, number];
  normal: [number, number, number];
  radius: number;
  name: string;
}

export interface CadFeatureItem {
  [k: string]: unknown;
  id: string;
  feature_type: 'PLANE' | 'INTERNAL_CYLINDER' | 'EXTERNAL_CYLINDER' | 'CONE' | 'SPHERE' | 'TORUS' | 'FREEFORM';
  nominal_dimension?: number;
  center?: [number, number, number];
  normal?: [number, number, number];
  raw_center?: [number, number, number];
  raw_normal?: [number, number, number];
  axial_min?: number;
  axial_max?: number;
  stem_blocked?: boolean;
  area_or_length?: number;
  description?: string;
  faceA_center?: [number, number, number];
  faceB_center?: [number, number, number];
  faceA_normal?: [number, number, number];
  faceB_normal?: [number, number, number];
  distance_type?: 'STEP_HEIGHT' | 'INTERNAL_SLOT' | 'EXTERNAL_WIDTH' | 'AXIS_DISTANCE';
  is_blind?: boolean;
  floor_z?: number;
  cad_instances?: Array<{
    center: [number, number, number];
    normal: [number, number, number];
    axial_min?: number;
    axial_max?: number;
    stem_blocked?: boolean;
  }>;
}

export interface StandoffSupportItem {
  x: number;
  z: number;
  radius: number;
  height: number;
}

export interface DatumSurfacePointItem {
  balloon: 'DATUM_A' | 'DATUM_B' | 'DATUM_C';
  position: [number, number, number];
  normal: [number, number, number];
  label: string;
}

export interface TessellatedModelResult {
  group: THREE.Group;
  geometry?: THREE.BufferGeometry;
  bbox: {
    min: [number, number, number];
    max: [number, number, number];
    size: [number, number, number];
  };
  detectedHoles: DetectedHoleItem[];
  primaryDatumNormal: [number, number, number];
  cadFeatures?: CadFeatureItem[];
  standoffSupports?: StandoffSupportItem[];
  datumSurfacePoints?: DatumSurfacePointItem[];
}

function getThree(): typeof THREE {
  if (typeof window !== 'undefined' && (window as unknown as { THREE?: typeof THREE }).THREE) {
    return (window as unknown as { THREE: typeof THREE }).THREE;
  }
  return THREE;
}

function decodeBase64Float32(b64: string): Float32Array {
  const binary = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Float32Array(bytes.buffer);
}

function decodeBase64Uint32(b64: string): Uint32Array {
  const binary = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Uint32Array(bytes.buffer);
}

export class StepModelTessellator {
  public static isDcModulPlaka(_filename: string, _stepText?: string): boolean {
    return false;
  }

  public static buildStepSolidModel(
    stepText: string,
    filename: string,
    metadata?: CadMetadata
  ): TessellatedModelResult {
    if (metadata?.mesh?.positions_b64) {
      return this.buildFromMetadata(metadata, filename);
    }
    return this.buildGenericStepModel(stepText, filename);
  }

  public static calculateStandoffSupports(
    posAttr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    standoffHeight: number,
    holes: DetectedHoleItem[]
  ): StandoffSupportItem[] {
    const pillarR = parseFloat(Math.max(2.0, Math.min(3.5, Math.min(sizeX, sizeZ) * 0.055)).toFixed(2));
    const halfX = sizeX / 2;
    const halfZ = sizeZ / 2;
    const bottomPts: Array<[number, number]> = [];
    const bandY = Math.max(1.8, Math.min(4.5, sizeY * 0.35));

    let cornerHits = [false, false, false, false];
    if (posAttr && posAttr.count > 0) {
      for (let i = 0; i < posAttr.count; i++) {
        const py = posAttr.getY(i);
        if (py <= standoffHeight + bandY) {
          const px = posAttr.getX(i);
          const pz = posAttr.getZ(i);
          bottomPts.push([px, pz]);
          if (Math.abs(px) > halfX * 0.58 && Math.abs(pz) > halfZ * 0.58) {
            if (px > 0 && pz > 0) cornerHits[0] = true;
            if (px < 0 && pz > 0) cornerHits[1] = true;
            if (px < 0 && pz < 0) cornerHits[2] = true;
            if (px > 0 && pz < 0) cornerHits[3] = true;
          }
        }
      }
    }

    const activeCorners = cornerHits.filter(Boolean).length;
    const aspectDiff = Math.abs(sizeX - sizeZ) / Math.max(sizeX, sizeZ, 1);
    const isRectangular = activeCorners >= 3 || aspectDiff > 0.14;

    const rawTargets: Array<[number, number]> = [];
    if (isRectangular) {
      const tx = Math.max(pillarR + 1.5, halfX * 0.68);
      const tz = Math.max(pillarR + 1.5, halfZ * 0.66);
      rawTargets.push([tx, tz], [-tx, tz], [-tx, -tz], [tx, -tz]);
      if (Math.max(sizeX, sizeZ) > 135) {
        if (sizeX >= sizeZ) {
          rawTargets.push([0, tz], [0, -tz]);
        } else {
          rawTargets.push([tx, 0], [-tx, 0]);
        }
      }
    } else {
      let maxBaseR = 0;
      for (const [bx, bz] of bottomPts) {
        const r = Math.hypot(bx, bz);
        if (r > maxBaseR) maxBaseR = r;
      }
      if (maxBaseR < 2.0) maxBaseR = Math.min(halfX, halfZ) * 0.85;
      const ringR = Math.max(pillarR + 2.0, maxBaseR * 0.66);
      for (const ang of [Math.PI / 3, Math.PI, (5 * Math.PI) / 3]) {
        rawTargets.push([Math.cos(ang) * ringR, Math.sin(ang) * ringR]);
      }
    }

    const isSafeFromHoles = (cx: number, cz: number): boolean => {
      for (const h of holes) {
        if (Math.abs(h.normal[1]) > 0.5 && h.center[1] <= standoffHeight + sizeY * 0.65) {
          const dist = Math.hypot(cx - h.center[0], cz - h.center[2]);
          if (dist < h.radius + pillarR + 1.4) {
            return false;
          }
        }
      }
      return true;
    };

    const marginX = Math.max(pillarR + 1.0, halfX - pillarR - 1.0);
    const marginZ = Math.max(pillarR + 1.0, halfZ - pillarR - 1.0);

    const supports: StandoffSupportItem[] = [];
    for (const [tx, tz] of rawTargets) {
      let bestX = Math.max(-marginX, Math.min(marginX, tx));
      let bestZ = Math.max(-marginZ, Math.min(marginZ, tz));

      if (!isSafeFromHoles(bestX, bestZ)) {
        const offsets: Array<[number, number]> = [
          [-pillarR * 2.2 * Math.sign(tx || 1), 0],
          [0, -pillarR * 2.2 * Math.sign(tz || 1)],
          [-pillarR * 2.0 * Math.sign(tx || 1), -pillarR * 2.0 * Math.sign(tz || 1)],
          [-pillarR * 3.5 * Math.sign(tx || 1), 0],
          [0, -pillarR * 3.5 * Math.sign(tz || 1)],
        ];
        for (const [dx, dz] of offsets) {
          const candX = Math.max(-marginX, Math.min(marginX, tx + dx));
          const candZ = Math.max(-marginZ, Math.min(marginZ, tz + dz));
          if (isSafeFromHoles(candX, candZ)) {
            bestX = candX;
            bestZ = candZ;
            break;
          }
        }
      }

      if (bottomPts.length > 12) {
        let minSurfDist = Infinity;
        for (const [bx, bz] of bottomPts) {
          const d = Math.hypot(bestX - bx, bestZ - bz);
          if (d < minSurfDist) minSurfDist = d;
        }
        if (minSurfDist > pillarR * 2.4) {
          let bestPt: [number, number] | null = null;
          let bestScore = Infinity;
          for (const [bx, bz] of bottomPts) {
            if (Math.abs(bx) <= marginX && Math.abs(bz) <= marginZ && isSafeFromHoles(bx, bz)) {
              const dTarget = Math.hypot(bx - tx, bz - tz);
              if (dTarget < bestScore) {
                bestScore = dTarget;
                bestPt = [bx, bz];
              }
            }
          }
          if (bestPt) {
            bestX = bestPt[0];
            bestZ = bestPt[1];
          }
        }
      }

      supports.push({
        x: parseFloat(bestX.toFixed(2)),
        z: parseFloat(bestZ.toFixed(2)),
        radius: pillarR,
        height: standoffHeight,
      });
    }

    return supports;
  }

  private static createStandoffRiserGroup(supports: StandoffSupportItem[]): THREE.Group {
    const T = getThree();
    const standoffGroup = new T.Group();
    standoffGroup.name = 'fixture_standoff_risers';
    const riserMat = new T.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.35 });
    const tapeMat = new T.MeshStandardMaterial({ color: 0x10b981, metalness: 0.1, roughness: 0.5 });

    for (const sup of supports) {
      const h = sup.height;
      const r = sup.radius;
      const bodyGeo = new T.CylinderGeometry(r, r * 1.12, h - 1.2, 18);
      bodyGeo.translate(sup.x, (h - 1.2) / 2, sup.z);
      standoffGroup.add(new T.Mesh(bodyGeo, riserMat));

      const tapeGeo = new T.CylinderGeometry(r * 1.02, r * 1.02, 1.2, 18);
      tapeGeo.translate(sup.x, h - 0.6, sup.z);
      standoffGroup.add(new T.Mesh(tapeGeo, tapeMat));
    }

    return standoffGroup;
  }

  public static buildFromMetadata(metadata: CadMetadata, filename = 'cad_model'): TessellatedModelResult {
    const T = getThree();
    const group = new T.Group();
    group.name = filename;

    const meshData = metadata.mesh;
    if (!meshData?.positions_b64 || !meshData?.indices_b64) {
      return this.buildGenericStepModel('', filename);
    }

    const positions = decodeBase64Float32(meshData.positions_b64);
    const normals = meshData.normals_b64 ? decodeBase64Float32(meshData.normals_b64) : null;
    const indices = decodeBase64Uint32(meshData.indices_b64);

    const solidGeo = new T.BufferGeometry();
    solidGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
    if (normals) {
      solidGeo.setAttribute('normal', new T.BufferAttribute(normals, 3));
    } else {
      solidGeo.computeVertexNormals();
    }
    solidGeo.setIndex(new T.BufferAttribute(indices, 1));

    const vertCount = positions.length / 3;
    const faceIdArray = new Float32Array(vertCount);
    const surfaceTypeArray = new Float32Array(vertCount);

    const surfaceTypeToNum = (st: string): number => {
      const u = (st || '').toUpperCase();
      if (u === 'PLANE') return 1;
      if (u === 'CYLINDER') return 2;
      if (u === 'CONE') return 3;
      if (u === 'SPHERE') return 4;
      if (u === 'TORUS') return 5;
      return 6;
    };

    const bRepFaces: Array<{
      id: string;
      numericId: number;
      surfaceType: string;
      surfaceTypeNum: number;
      triangleStart: number;
      triangleCount: number;
      area?: number;
    }> = [];

    const metaFaces = meshData.faces || [];
    if (metaFaces.length > 0) {
      for (let fIdx = 0; fIdx < metaFaces.length; fIdx++) {
        const mf = metaFaces[fIdx];
        const numId = fIdx + 1;
        const stNum = surfaceTypeToNum(mf.surface_type || 'PLANE');
        bRepFaces.push({
          id: mf.id || `FACE_${numId}`,
          numericId: numId,
          surfaceType: mf.surface_type || 'PLANE',
          surfaceTypeNum: stNum,
          triangleStart: mf.triangle_start,
          triangleCount: mf.triangle_count,
          area: mf.area,
        });

        const triStart = mf.triangle_start;
        const triEnd = triStart + mf.triangle_count;
        for (let t = triStart; t < triEnd; t++) {
          const idxA = indices[t * 3];
          const idxB = indices[t * 3 + 1];
          const idxC = indices[t * 3 + 2];
          if (idxA !== undefined && idxA < vertCount) {
            faceIdArray[idxA] = numId;
            surfaceTypeArray[idxA] = stNum;
          }
          if (idxB !== undefined && idxB < vertCount) {
            faceIdArray[idxB] = numId;
            surfaceTypeArray[idxB] = stNum;
          }
          if (idxC !== undefined && idxC < vertCount) {
            faceIdArray[idxC] = numId;
            surfaceTypeArray[idxC] = stNum;
          }
        }
      }
    } else {
      for (let i = 0; i < vertCount; i++) {
        faceIdArray[i] = 1;
        surfaceTypeArray[i] = 1;
      }
    }

    solidGeo.setAttribute('faceId', new T.BufferAttribute(faceIdArray, 1));
    solidGeo.setAttribute('surfaceType', new T.BufferAttribute(surfaceTypeArray, 1));
    solidGeo.userData.bRepFaces = bRepFaces;
    solidGeo.computeBoundingBox();

    const rawBox = solidGeo.boundingBox;
    const bboxMeta = metadata.bbox || { min: [0, 0, 0], max: [0, 0, 0], size: [50, 20, 50] };
    const sizeX = bboxMeta.size[0];
    const sizeY = bboxMeta.size[1];
    const sizeZ = bboxMeta.size[2];
    const standoffHeight = 20.0;
    const isAlreadyShiftedBbox = Math.abs(bboxMeta.min[1] - standoffHeight) < 0.05 && rawBox && Math.abs(rawBox.min.y - standoffHeight) > 1.0;
    const centerX = isAlreadyShiftedBbox && rawBox ? (rawBox.min.x + rawBox.max.x) / 2 : (bboxMeta.min[0] + bboxMeta.max[0]) / 2;
    const bottomY = isAlreadyShiftedBbox && rawBox ? rawBox.min.y : bboxMeta.min[1];
    const centerZ = isAlreadyShiftedBbox && rawBox ? (rawBox.min.z + rawBox.max.z) / 2 : (bboxMeta.min[2] + bboxMeta.max[2]) / 2;

    solidGeo.translate(-centerX, -bottomY + standoffHeight, -centerZ);

    const metalMat = new T.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.35,
      roughness: 0.38,
      side: T.DoubleSide,
    });
    const solidMesh = new T.Mesh(solidGeo, metalMat);
    solidMesh.name = `${filename}_brep_mesh`;
    group.add(solidMesh);

    if (meshData.edges_b64) {
      const edgesFloats = decodeBase64Float32(meshData.edges_b64);
      if (edgesFloats.length >= 6) {
        const edgeGeo = new T.BufferGeometry();
        edgeGeo.setAttribute('position', new T.BufferAttribute(edgesFloats, 3));
        edgeGeo.translate(-centerX, -bottomY + standoffHeight, -centerZ);
        const edgeMat = new T.LineBasicMaterial({
          color: 0x0f172a,
          linewidth: 1.5,
        });
        const edgeLines = new T.LineSegments(edgeGeo, edgeMat);
        edgeLines.name = `${filename}_brep_edges`;
        group.add(edgeLines);
      }
    }

    const posAttr = solidGeo.getAttribute('position');
    const getOuterRadiusAtY = (targetY: number, band = 4.0): number => {
      if (!posAttr) return Math.max(sizeX, sizeZ) / 2;
      let maxR = 0;
      for (let i = 0; i < posAttr.count; i++) {
        const py = posAttr.getY(i);
        if (Math.abs(py - targetY) <= band) {
          const r = Math.hypot(posAttr.getX(i), posAttr.getZ(i));
          if (r > maxR) maxR = r;
        }
      }
      if (maxR < 1.0) {
        for (let i = 0; i < posAttr.count; i++) {
          const py = posAttr.getY(i);
          if (Math.abs(py - targetY) <= band * 3.5) {
            const r = Math.hypot(posAttr.getX(i), posAttr.getZ(i));
            if (r > maxR) maxR = r;
          }
        }
      }
      return maxR > 1.0 ? maxR : Math.max(sizeX, sizeZ) * 0.4;
    };

    const isAxisymmetricShaft =
      Math.abs(sizeX - sizeZ) <= Math.max(sizeX, sizeZ) * 0.12 &&
      sizeY > Math.max(sizeX, sizeZ) * 0.65;

    const resolveCollisionFreeSurfaceApproach = (
      cx: number,
      cy: number,
      cz: number,
      norm: [number, number, number]
    ): { cy: number; norm: [number, number, number] } => {
      const lenH = Math.hypot(norm[0], norm[2]);
      if (lenH <= 0.25) {
        return { cy, norm };
      }
      const hx = norm[0] / lenH;
      const hz = norm[2] / lenH;
      const halfX = sizeX / 2;
      const halfZ = sizeZ / 2;

      const posOut = Math.abs(cx + hx * 8.0) > halfX + 0.5 || Math.abs(cz + hz * 8.0) > halfZ + 0.5;
      const negOut = Math.abs(cx - hx * 8.0) > halfX + 0.5 || Math.abs(cz - hz * 8.0) > halfZ + 0.5;

      let cntPos = 0;
      let cntNeg = 0;
      let maxYPos = -Infinity;
      let maxYNeg = -Infinity;

      if (posAttr && posAttr.count > 0) {
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i) - cx;
          const vz = posAttr.getZ(i) - cz;
          const perp = Math.abs(-vx * hz + vz * hx);
          if (perp > 4.0) continue;
          const proj = vx * hx + vz * hz;
          const py = posAttr.getY(i);
          if (proj >= 1.2 && proj <= 12.0) {
            if (py > maxYPos) maxYPos = py;
            if (py >= cy - 0.8) cntPos++;
          } else if (proj <= -1.2 && proj >= -12.0) {
            if (py > maxYNeg) maxYNeg = py;
            if (py >= cy - 0.8) cntNeg++;
          }
        }
      }

      const outwardDot = cx * hx + cz * hz;
      let flip = false;
      if (negOut && !posOut) {
        flip = true;
      } else if (!posOut && !negOut) {
        if (cntNeg < cntPos) {
          flip = true;
        } else if (cntNeg === cntPos && maxYNeg < maxYPos - 0.3) {
          flip = true;
        } else if (cntNeg === cntPos && Math.abs(maxYNeg - maxYPos) <= 0.3 && outwardDot < -1.0) {
          flip = true;
        }
      } else if (posOut && negOut && outwardDot < -1.0) {
        flip = true;
      }

      const finalNorm: [number, number, number] = flip
        ? [parseFloat((-norm[0]).toFixed(4)), norm[1], parseFloat((-norm[2]).toFixed(4))]
        : norm;
      return { cy, norm: finalNorm };
    };

    const snapPointToMeshSurface = (
      cx: number,
      cy: number,
      cz: number,
      norm: [number, number, number]
    ): [number, number, number] => {
      if (!posAttr || posAttr.count === 0) {
        return [cx, cy, cz];
      }
      const isHorizontalPlane = Math.abs(norm[1]) >= 0.7;
      if (isHorizontalPlane) {
        let localMaxY = -Infinity;
        let closestSurfY = Infinity;
        let minDy = Infinity;
        for (let i = 0; i < posAttr.count; i++) {
          const dx = posAttr.getX(i) - cx;
          const dz = posAttr.getZ(i) - cz;
          if (dx * dx + dz * dz <= 6.25) {
            const py = posAttr.getY(i);
            if (py > localMaxY) localMaxY = py;
            const dy = Math.abs(py - cy);
            if (dy < minDy) {
              minDy = dy;
              closestSurfY = py;
            }
          }
        }
        if (isFinite(localMaxY)) {
          const snappedY = minDy <= 0.8 ? closestSurfY : Math.min(cy, localMaxY);
          return [cx, parseFloat(Math.min(snappedY, localMaxY).toFixed(3)), cz];
        }
        let bestDistSq = Infinity;
        let bestX = cx;
        let bestY = cy;
        let bestZ = cz;
        for (let i = 0; i < posAttr.count; i++) {
          const py = posAttr.getY(i);
          if (Math.abs(py - cy) <= 1.2) {
            const px = posAttr.getX(i);
            const pz = posAttr.getZ(i);
            const dSq = (px - cx) * (px - cx) + (pz - cz) * (pz - cz);
            if (dSq < bestDistSq) {
              bestDistSq = dSq;
              bestX = px;
              bestY = py;
              bestZ = pz;
            }
          }
        }
        return [parseFloat(bestX.toFixed(3)), parseFloat(bestY.toFixed(3)), parseFloat(bestZ.toFixed(3))];
      }

      let wallMinY = Infinity;
      let wallMaxY = -Infinity;
      for (let i = 0; i < posAttr.count; i++) {
        const dx = posAttr.getX(i) - cx;
        const dz = posAttr.getZ(i) - cz;
        if (dx * dx + dz * dz <= 9.0) {
          const py = posAttr.getY(i);
          if (py < wallMinY) wallMinY = py;
          if (py > wallMaxY) wallMaxY = py;
        }
      }
      if (isFinite(wallMinY) && isFinite(wallMaxY) && wallMaxY >= wallMinY) {
        const margin = Math.min(0.35, (wallMaxY - wallMinY) * 0.25);
        const clampedY = Math.max(wallMinY + margin, Math.min(wallMaxY - margin, cy));
        return [cx, parseFloat(clampedY.toFixed(3)), cz];
      }
      return [cx, cy, cz];
    };

    const analyzeVerticalCylinderCorridor = (
      cx: number,
      cy: number,
      cz: number,
      cylRadius: number
    ): { axialMin: number; axialMax: number; stemBlocked: boolean } => {
      let axialMin = Infinity;
      let axialMax = -Infinity;
      let overhangCount = 0;

      if (posAttr && posAttr.count > 0 && cylRadius > 0.2) {
        const minWallR = cylRadius * 0.78;
        const maxWallR = cylRadius * 1.28;
        const maxCorridorR = Math.max(0.35, cylRadius - 0.25);

        for (let i = 0; i < posAttr.count; i++) {
          const r = Math.hypot(posAttr.getX(i) - cx, posAttr.getZ(i) - cz);
          const py = posAttr.getY(i);
          if (r >= minWallR && r <= maxWallR) {
            if (py < axialMin) axialMin = py;
            if (py > axialMax) axialMax = py;
          }
          if (r < maxCorridorR && py > cy + 1.2) {
            overhangCount++;
          }
        }
      }

      if (!isFinite(axialMin) || !isFinite(axialMax) || axialMax < axialMin) {
        axialMin = parseFloat(Math.max(standoffHeight, cy - 1.5).toFixed(3));
        axialMax = parseFloat(Math.min(standoffHeight + sizeY, cy + 1.5).toFixed(3));
      } else {
        axialMin = parseFloat(axialMin.toFixed(3));
        axialMax = parseFloat(axialMax.toFixed(3));
      }

      return {
        axialMin,
        axialMax,
        stemBlocked: overhangCount >= 3,
      };
    };

    const detectedHoles: DetectedHoleItem[] = [];
    const cadFeatures: CadFeatureItem[] = [];

    for (const feat of metadata.features || []) {
      const featWithRaw = feat as CadFeatureItem;
      const origCenter: [number, number, number] = featWithRaw.raw_center
        ? [featWithRaw.raw_center[0], featWithRaw.raw_center[1], featWithRaw.raw_center[2]]
        : (feat.center ? [feat.center[0], feat.center[1], feat.center[2]] : [0, 0, 0]);
      const origNormal: [number, number, number] = featWithRaw.raw_normal
        ? [featWithRaw.raw_normal[0], featWithRaw.raw_normal[1], featWithRaw.raw_normal[2]]
        : ((feat.normal ? [feat.normal[0], feat.normal[1], feat.normal[2]] : [0, 1, 0]) as [number, number, number]);

      let cx = parseFloat((origCenter[0] - centerX).toFixed(3));
      let cy = parseFloat((origCenter[1] - bottomY + standoffHeight).toFixed(3));
      let cz = parseFloat((origCenter[2] - centerZ).toFixed(3));
      let norm: [number, number, number] = [origNormal[0], origNormal[1], origNormal[2]];

      if (
        isAxisymmetricShaft &&
        feat.id.startsWith('CAD_STEP_DIST_') &&
        feat.nominal_dimension &&
        Math.hypot(cx, cz) < 3.5
      ) {
        if (Math.abs(cy - standoffHeight) < 2.0 && feat.nominal_dimension < sizeY - 1.0) {
          cy = parseFloat((standoffHeight + feat.nominal_dimension).toFixed(3));
        }
        const rStep = getOuterRadiusAtY(cy, 3.5);
        cx = parseFloat(rStep.toFixed(3));
        cz = 0;
        norm = [1, 0, 0];
      } else if (feat.feature_type === 'CONE' && Math.hypot(cx, cz) < 3.5) {
        const rCone = getOuterRadiusAtY(cy, 4.0);
        cx = parseFloat(rCone.toFixed(3));
        cz = 0;
        const isLowerChamfer = cy < standoffHeight + Math.min(15.0, sizeY * 0.25);
        norm = isLowerChamfer ? [0.707, -0.707, 0] : [0.85, 0.52, 0];
      } else if (
        isAxisymmetricShaft &&
        feat.feature_type === 'PLANE' &&
        cy > standoffHeight + 1.8 &&
        cy < standoffHeight + sizeY - 1.8 &&
        Math.hypot(cx, cz) < 3.5
      ) {
        const rStep = getOuterRadiusAtY(cy, 3.0);
        const rAbove = getOuterRadiusAtY(cy + 4.0, 2.5);
        const rBelow = getOuterRadiusAtY(cy - 4.0, 2.5);
        cx = parseFloat((Math.max(rStep, rAbove, rBelow) * 0.92).toFixed(3));
        cz = 0;
        norm = rAbove > rBelow + 1.0 ? [0.707, -0.707, 0] : [0.707, 0.707, 0];
      } else if (
        feat.feature_type === 'INTERNAL_CYLINDER' &&
        Math.abs(norm[1]) < 0.5 &&
        Math.hypot(cx, cz) < 3.5
      ) {
        const rCross = getOuterRadiusAtY(cy, 4.0);
        cx = parseFloat(rCross.toFixed(3));
        cz = 0;
        norm = [1, 0, 0];
      } else if (feat.feature_type === 'PLANE' || feat.feature_type === 'CONE') {
        const resolved = resolveCollisionFreeSurfaceApproach(cx, cy, cz, norm);
        cy = resolved.cy;
        norm = resolved.norm;
        const snapped = snapPointToMeshSurface(cx, cy, cz, norm);
        cx = snapped[0];
        cy = snapped[1];
        cz = snapped[2];
      }

      let axialMin: number | undefined;
      let axialMax: number | undefined;
      let stemBlocked: boolean | undefined;

      if (
        (feat.feature_type === 'INTERNAL_CYLINDER' || feat.feature_type === 'EXTERNAL_CYLINDER') &&
        feat.nominal_dimension &&
        Math.abs(norm[1]) >= 0.7
      ) {
        const corridor = analyzeVerticalCylinderCorridor(cx, cy, cz, feat.nominal_dimension / 2);
        axialMin = corridor.axialMin;
        axialMax = corridor.axialMax;
        stemBlocked = corridor.stemBlocked;
        cy = parseFloat(((axialMin + axialMax) / 2).toFixed(3));
      }

      const featExt = feat as {
        faceA_center?: [number, number, number];
        faceB_center?: [number, number, number];
        faceA_normal?: [number, number, number];
        faceB_normal?: [number, number, number];
        distance_type?: string;
        is_blind?: boolean;
        floor_z?: number;
        cad_instances?: Array<{
          center: [number, number, number];
          normal: [number, number, number];
          axial_min?: number;
          axial_max?: number;
          stem_blocked?: boolean;
        }>;
      };

      let shiftedFaceACenter: [number, number, number] | undefined;
      let shiftedFaceBCenter: [number, number, number] | undefined;
      if (featExt.faceA_center) {
        shiftedFaceACenter = [
          parseFloat((featExt.faceA_center[0] - centerX).toFixed(3)),
          parseFloat((featExt.faceA_center[1] - bottomY + standoffHeight).toFixed(3)),
          parseFloat((featExt.faceA_center[2] - centerZ).toFixed(3)),
        ];
      }
      if (featExt.faceB_center) {
        shiftedFaceBCenter = [
          parseFloat((featExt.faceB_center[0] - centerX).toFixed(3)),
          parseFloat((featExt.faceB_center[1] - bottomY + standoffHeight).toFixed(3)),
          parseFloat((featExt.faceB_center[2] - centerZ).toFixed(3)),
        ];
      }
      let shiftedFloorZ = featExt.floor_z;
      if (shiftedFloorZ !== undefined) {
        shiftedFloorZ = parseFloat((shiftedFloorZ - bottomY + standoffHeight).toFixed(3));
      }
      let shiftedInstances = featExt.cad_instances;
      if (shiftedInstances && shiftedInstances.length > 0) {
        shiftedInstances = shiftedInstances.map((inst) => ({
          ...inst,
          center: [
            parseFloat((inst.center[0] - centerX).toFixed(3)),
            parseFloat((inst.center[1] - bottomY + standoffHeight).toFixed(3)),
            parseFloat((inst.center[2] - centerZ).toFixed(3)),
          ],
        }));
      }

      const shiftedCenter: [number, number, number] = [cx, cy, cz];

      const item: CadFeatureItem = {
        id: feat.id,
        feature_type: feat.feature_type,
        nominal_dimension: feat.nominal_dimension,
        center: shiftedCenter,
        normal: norm,
        raw_center: origCenter,
        raw_normal: origNormal,
        axial_min: axialMin,
        axial_max: axialMax,
        stem_blocked: stemBlocked,
        area_or_length: feat.area_or_length,
        description: feat.description || feat.id,
        faceA_center: shiftedFaceACenter,
        faceB_center: shiftedFaceBCenter,
        faceA_normal: featExt.faceA_normal,
        faceB_normal: featExt.faceB_normal,
        distance_type: featExt.distance_type as CadFeatureItem['distance_type'],
        is_blind: featExt.is_blind,
        floor_z: shiftedFloorZ,
        cad_instances: shiftedInstances,
      };
      cadFeatures.push(item);

      if (feat.feature_type === 'INTERNAL_CYLINDER' && feat.nominal_dimension) {
        detectedHoles.push({
          center: shiftedCenter,
          normal: norm,
          radius: parseFloat((feat.nominal_dimension / 2).toFixed(3)),
          name: feat.id,
        });
      }
    }

    const standoffSupports = this.calculateStandoffSupports(
      posAttr,
      sizeX,
      sizeY,
      sizeZ,
      standoffHeight,
      detectedHoles
    );
    group.add(this.createStandoffRiserGroup(standoffSupports));

    const minXScene = parseFloat((-sizeX / 2).toFixed(3));
    const maxXScene = parseFloat((sizeX / 2).toFixed(3));
    const minZScene = parseFloat((-sizeZ / 2).toFixed(3));
    const maxZScene = parseFloat((sizeZ / 2).toFixed(3));

    const nudgeFromDetectedHoles = (px: number, pz: number): [number, number] => {
      let x = px;
      let z = pz;
      for (const h of detectedHoles) {
        const minR = Math.max(2.0, h.radius + 2.5);
        const d = Math.hypot(x - h.center[0], z - h.center[2]);
        if (d < minR) {
          const dx = d > 0.1 ? (x - h.center[0]) / d : 1.0;
          const dz = d > 0.1 ? (z - h.center[2]) / d : 0.0;
          x = h.center[0] + dx * (minR + 1.2);
          z = h.center[2] + dz * (minR + 1.2);
        }
      }
      return [
        parseFloat(Math.max(minXScene + 2.5, Math.min(maxXScene - 2.5, x)).toFixed(3)),
        parseFloat(Math.max(minZScene + 2.5, Math.min(maxZScene - 2.5, z)).toFixed(3)),
      ];
    };

    const candA: Array<[number, number]> = [
      nudgeFromDetectedHoles(minXScene + sizeX * 0.22, minZScene + sizeZ * 0.24),
      nudgeFromDetectedHoles(maxXScene - sizeX * 0.22, minZScene + sizeZ * 0.24),
      nudgeFromDetectedHoles(0, maxZScene - sizeZ * 0.24),
    ];

    const datumSurfacePoints: DatumSurfacePointItem[] = [];
    for (let i = 0; i < candA.length; i++) {
      const [ax, az] = candA[i];
      const snappedA = snapPointToMeshSurface(ax, standoffHeight + sizeY, az, [0, 1, 0]);
      datumSurfacePoints.push({
        balloon: 'DATUM_A',
        position: snappedA,
        normal: [0, 1, 0],
        label: `DATUM_A #${i + 1}`,
      });
    }

    const insetZ = Math.max(3.5, sizeZ * 0.24);
    const bZs = [minZScene + insetZ, maxZScene - insetZ];
    for (let i = 0; i < bZs.length; i++) {
      const snappedB = snapPointToMeshSurface(minXScene, standoffHeight + 0.9, bZs[i], [-1, 0, 0]);
      datumSurfacePoints.push({
        balloon: 'DATUM_B',
        position: [minXScene, snappedB[1], parseFloat(bZs[i].toFixed(3))],
        normal: [-1, 0, 0],
        label: `DATUM_B #${i + 1}`,
      });
    }

    const snappedC = snapPointToMeshSurface(0, standoffHeight + 0.9, minZScene, [0, 0, -1]);
    datumSurfacePoints.push({
      balloon: 'DATUM_C',
      position: [0, snappedC[1], minZScene],
      normal: [0, 0, -1],
      label: 'DATUM_C #1',
    });

    group.userData.detectedHoles = detectedHoles;
    group.userData.datumANormal = new T.Vector3(0, -1, 0);
    group.userData.standoffHeight = standoffHeight;
    group.userData.standoffSupports = standoffSupports;
    group.userData.datumSurfacePoints = datumSurfacePoints;

    return {
      group,
      geometry: solidGeo,
      bbox: {
        min: [-sizeX / 2, standoffHeight, -sizeZ / 2],
        max: [sizeX / 2, standoffHeight + sizeY, sizeZ / 2],
        size: [sizeX, sizeY, sizeZ],
      },
      detectedHoles,
      primaryDatumNormal: [0, -1, 0],
      cadFeatures,
      standoffSupports,
      datumSurfacePoints,
    };
  }

  public static buildGenericStepModel(stepText: string, filename: string): TessellatedModelResult {
    const T = getThree();
    const group = new T.Group();
    group.name = filename || 'step_model';

    const ptRegex = /#([0-9]+)\s*=\s*CARTESIAN_POINT\s*\(\s*(?:'[^']*'|\$)\s*,\s*\(\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)\s*\)/g;
    const points = new Map<string, [number, number, number]>();
    let m: RegExpExecArray | null;
    while ((m = ptRegex.exec(stepText)) !== null) {
      points.set(m[1], [parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])]);
    }

    const vpRegex = /#([0-9]+)\s*=\s*VERTEX_POINT\s*\(\s*(?:'[^']*'|\$)\s*,\s*#([0-9]+)\s*\)/g;
    const vpoints = new Map<string, [number, number, number]>();
    while ((m = vpRegex.exec(stepText)) !== null) {
      const p = points.get(m[2]);
      if (p) vpoints.set(m[1], p);
    }

    const dirRegex = /#([0-9]+)\s*=\s*DIRECTION\s*\(\s*(?:'[^']*'|\$)\s*,\s*\(\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)\s*\)/g;
    const directions = new Map<string, [number, number, number]>();
    while ((m = dirRegex.exec(stepText)) !== null) {
      directions.set(m[1], [parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])]);
    }

    const a2Regex = /#([0-9]+)\s*=\s*AXIS2_PLACEMENT_3D\s*\(\s*(?:'[^']*'|\$)\s*,\s*#([0-9]+)\s*,\s*#([0-9]+)(?:,\s*#([0-9]+))?\s*\)/g;
    const placements = new Map<string, { origin?: [number, number, number]; axis?: [number, number, number]; ref?: [number, number, number] }>();
    while ((m = a2Regex.exec(stepText)) !== null) {
      placements.set(m[1], {
        origin: points.get(m[2]),
        axis: directions.get(m[3]),
        ref: m[4] ? directions.get(m[4]) : undefined,
      });
    }

    const circleRegex = /#([0-9]+)\s*=\s*CIRCLE\s*\(\s*(?:'[^']*'|\$)\s*,\s*#([0-9]+)\s*,\s*([-\d.eE+]+)\s*\)/g;
    const circles = new Map<string, { placement?: { origin?: [number, number, number]; axis?: [number, number, number]; ref?: [number, number, number] }; radius: number }>();
    while ((m = circleRegex.exec(stepText)) !== null) {
      circles.set(m[1], {
        placement: placements.get(m[2]),
        radius: parseFloat(m[3]),
      });
    }

    const ecRegex = /#([0-9]+)\s*=\s*EDGE_CURVE\s*\(\s*(?:'[^']*'|\$)\s*,\s*#([0-9]+)\s*,\s*#([0-9]+)\s*,\s*#([0-9]+)\s*,\s*\.(T|F)\.\s*\)/g;
    const edges = new Map<string, { start: string; end: string; curveId: string; sameSense: boolean }>();
    while ((m = ecRegex.exec(stepText)) !== null) {
      edges.set(m[1], {
        start: m[2],
        end: m[3],
        curveId: m[4],
        sameSense: m[5] === 'T',
      });
    }

    const oeRegex = /#([0-9]+)\s*=\s*ORIENTED_EDGE\s*\(\s*(?:'[^']*'|\$)\s*,\s*\*\s*,\s*\*\s*,\s*#([0-9]+)\s*,\s*\.(T|F)\.\s*\)/g;
    const orientedEdges = new Map<string, { edgeId: string; sense: boolean }>();
    while ((m = oeRegex.exec(stepText)) !== null) {
      orientedEdges.set(m[1], { edgeId: m[2], sense: m[3] === 'T' });
    }

    const elRegex = /#([0-9]+)\s*=\s*EDGE_LOOP\s*\(\s*(?:'[^']*'|\$)\s*,\s*\(([^)]+)\)\s*\)/g;
    const loopMap = new Map<string, string[]>();
    while ((m = elRegex.exec(stepText)) !== null) {
      loopMap.set(m[1], m[2].split(',').map((s) => s.trim().replace('#', '')));
    }

    const boundingPoints: [number, number, number][] = vpoints.size > 2 ? Array.from(vpoints.values()) : Array.from(points.values());

    let rawMinX = Infinity, rawMaxX = -Infinity;
    let rawMinY = Infinity, rawMaxY = -Infinity;
    let rawMinZ = Infinity, rawMaxZ = -Infinity;

    if (boundingPoints.length > 0) {
      for (const p of boundingPoints) {
        if (p[0] < rawMinX) rawMinX = p[0];
        if (p[0] > rawMaxX) rawMaxX = p[0];
        if (p[1] < rawMinY) rawMinY = p[1];
        if (p[1] > rawMaxY) rawMaxY = p[1];
        if (p[2] < rawMinZ) rawMinZ = p[2];
        if (p[2] > rawMaxZ) rawMaxZ = p[2];
      }
    } else {
      rawMinX = -25; rawMaxX = 25;
      rawMinY = 0; rawMaxY = 20;
      rawMinZ = -25; rawMaxZ = 25;
    }

    const sizeX = Math.max(5.0, parseFloat((rawMaxX - rawMinX).toFixed(2)));
    const sizeY = Math.max(5.0, parseFloat((rawMaxY - rawMinY).toFixed(2)));
    const sizeZ = Math.max(5.0, parseFloat((rawMaxZ - rawMinZ).toFixed(2)));

    const centerX = (rawMinX + rawMaxX) / 2;
    const centerZ = (rawMinZ + rawMaxZ) / 2;
    const bottomY = rawMinY;

    const sampleLoop = (loopId: string): [number, number, number][] => {
      const oeIds = loopMap.get(loopId);
      if (!oeIds) return [];
      const loopPts: [number, number, number][] = [];
      for (const oeId of oeIds) {
        const oe = orientedEdges.get(oeId);
        if (!oe) continue;
        const e = edges.get(oe.edgeId);
        if (!e) continue;
        const vStart = vpoints.get(e.start);
        const vEnd = vpoints.get(e.end);
        if (!vStart || !vEnd) continue;

        const circ = circles.get(e.curveId);
        if (circ && circ.placement && circ.placement.origin) {
          const center = circ.placement.origin;
          const r = circ.radius;
          let axis = circ.placement.axis || [0, 1, 0];
          const lenA = Math.hypot(...axis) || 1;
          axis = [axis[0] / lenA, axis[1] / lenA, axis[2] / lenA];
          let ref = circ.placement.ref;
          if (!ref) ref = Math.abs(axis[0]) < 0.9 ? [1, 0, 0] : [0, 0, 1];
          const dot = ref[0] * axis[0] + ref[1] * axis[1] + ref[2] * axis[2];
          let u = [ref[0] - dot * axis[0], ref[1] - dot * axis[1], ref[2] - dot * axis[2]];
          const lenU = Math.hypot(...u) || 1;
          u = [u[0] / lenU, u[1] / lenU, u[2] / lenU];
          const v = [
            axis[1] * u[2] - axis[2] * u[1],
            axis[2] * u[0] - axis[0] * u[2],
            axis[0] * u[1] - axis[1] * u[0],
          ];
          const dx = vStart[0] - vEnd[0], dy = vStart[1] - vEnd[1], dz = vStart[2] - vEnd[2];
          const dist = Math.hypot(dx, dy, dz);
          const ccw = oe.sense === e.sameSense;
          if (dist < 0.001) {
            const segs = 32;
            for (let k = 0; k < segs; k++) {
              const theta = (ccw ? 1 : -1) * ((2 * Math.PI * k) / segs);
              const cosT = Math.cos(theta), sinT = Math.sin(theta);
              loopPts.push([
                center[0] + r * (cosT * u[0] + sinT * v[0]),
                center[1] + r * (cosT * u[1] + sinT * v[1]),
                center[2] + r * (cosT * u[2] + sinT * v[2]),
              ]);
            }
          } else {
            const pA = oe.sense ? vStart : vEnd;
            const pB = oe.sense ? vEnd : vStart;
            const vAx = pA[0] - center[0], vAy = pA[1] - center[1], vAz = pA[2] - center[2];
            const vBx = pB[0] - center[0], vBy = pB[1] - center[1], vBz = pB[2] - center[2];
            const thetaA = Math.atan2(vAx * v[0] + vAy * v[1] + vAz * v[2], vAx * u[0] + vAy * u[1] + vAz * u[2]);
            const thetaB = Math.atan2(vBx * v[0] + vBy * v[1] + vBz * v[2], vBx * u[0] + vBy * u[1] + vBz * u[2]);
            let dTheta = thetaB - thetaA;
            if (ccw) {
              while (dTheta <= 1e-5) dTheta += 2 * Math.PI;
            } else {
              while (dTheta >= -1e-5) dTheta -= 2 * Math.PI;
            }
            const steps = Math.max(6, Math.ceil((Math.abs(dTheta) / (2 * Math.PI)) * 32));
            for (let step = 0; step < steps; step++) {
              const theta = thetaA + (step / steps) * dTheta;
              const cosT = Math.cos(theta), sinT = Math.sin(theta);
              loopPts.push([
                center[0] + r * (cosT * u[0] + sinT * v[0]),
                center[1] + r * (cosT * u[1] + sinT * v[1]),
                center[2] + r * (cosT * u[2] + sinT * v[2]),
              ]);
            }
          }
        } else {
          loopPts.push(oe.sense ? vStart : vEnd);
        }
      }
      return loopPts;
    };

    const earClip2D = (pts: [number, number][]): number[] => {
      const n = pts.length;
      if (n < 3) return [];
      if (n === 3) return [0, 1, 2];
      let a = 0;
      for (let i = 0; i < n; i++) {
        const p1 = pts[i], p2 = pts[(i + 1) % n];
        a += p1[0] * p2[1] - p2[0] * p1[1];
      }
      const indices: number[] = [];
      for (let i = 0; i < n; i++) indices.push(i);
      if (a < 0) indices.reverse();

      const isConvex = (p0: [number, number], p1: [number, number], p2: [number, number]) =>
        (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]) >= 0;

      const inTriangle = (px: number, py: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
        const v0x = cx - ax, v0y = cy - ay;
        const v1x = bx - ax, v1y = by - ay;
        const v2x = px - ax, v2y = py - ay;
        const dot00 = v0x * v0x + v0y * v0y;
        const dot01 = v0x * v1x + v0y * v1y;
        const dot02 = v0x * v2x + v0y * v2y;
        const dot11 = v1x * v1x + v1y * v1y;
        const dot12 = v1x * v2x + v1y * v2y;
        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01 + 1e-10);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        return u >= 0 && v >= 0 && u + v <= 1;
      };

      const triangles: number[] = [];
      let count = indices.length;
      let iters = 0;
      while (count > 2 && iters < count * 3) {
        iters++;
        let earFound = false;
        for (let i = 0; i < count; i++) {
          const prev = indices[(i + count - 1) % count];
          const curr = indices[i];
          const next = indices[(i + 1) % count];
          const pPrev = pts[prev], pCurr = pts[curr], pNext = pts[next];
          if (!isConvex(pPrev, pCurr, pNext)) continue;

          let hasInside = false;
          for (let j = 0; j < count; j++) {
            if (j === (i + count - 1) % count || j === i || j === (i + 1) % count) continue;
            const testPt = pts[indices[j]];
            if (inTriangle(testPt[0], testPt[1], pPrev[0], pPrev[1], pCurr[0], pCurr[1], pNext[0], pNext[1])) {
              hasInside = true;
              break;
            }
          }
          if (!hasInside) {
            triangles.push(prev, curr, next);
            indices.splice(i, 1);
            count--;
            earFound = true;
            break;
          }
        }
        if (!earFound) {
          for (let k = 1; k < count - 1; k++) {
            triangles.push(indices[0], indices[k], indices[k + 1]);
          }
          break;
        }
      }
      return triangles;
    };

    const triPositions: number[] = [];
    const triNormals: number[] = [];
    const loopInfos: Array<{ normal: [number, number, number]; area: number; center: [number, number, number] }> = [];

    const planeSurfRegex = /#([0-9]+)\s*=\s*PLANE\s*\(\s*(?:'[^']*'|\$)\s*,\s*#([0-9]+)\s*\)/g;
    const planeSurfs = new Map<string, string>();
    while ((m = planeSurfRegex.exec(stepText)) !== null) {
      planeSurfs.set(m[1], m[2]);
    }

    const revSurfRegex = /#([0-9]+)\s*=\s*(CYLINDRICAL_SURFACE|CONICAL_SURFACE|TOROIDAL_SURFACE)\s*\(\s*(?:'[^']*'|\$)\s*,\s*#([0-9]+)\s*,\s*([-\d.eE+]+)(?:\s*,\s*([-\d.eE+]+))?\s*\)/g;
    const revSurfs = new Map<string, { type: string; placementId: string; r1: number; r2: number }>();
    while ((m = revSurfRegex.exec(stepText)) !== null) {
      revSurfs.set(m[1], {
        type: m[2],
        placementId: m[3],
        r1: parseFloat(m[4]),
        r2: m[5] ? parseFloat(m[5]) : 0,
      });
    }

    const fbRegex = /#([0-9]+)\s*=\s*FACE_(?:OUTER_)?BOUND\s*\(\s*(?:'[^']*'|\$)\s*,\s*#([0-9]+)\s*,\s*\.(T|F)\.\s*\)/g;
    const faceBounds = new Map<string, { loopId: string; sense: boolean }>();
    while ((m = fbRegex.exec(stepText)) !== null) {
      faceBounds.set(m[1], { loopId: m[2], sense: m[3] === 'T' });
    }

    const afRegex = /#([0-9]+)\s*=\s*ADVANCED_FACE\s*\(\s*(?:'[^']*'|\$)\s*,\s*\(([^)]+)\)\s*,\s*#([0-9]+)\s*,\s*\.(T|F)\.\s*\)/g;
    const advancedFaces: Array<{ id: string; boundIds: string[]; surfId: string; sameSense: boolean }> = [];
    while ((m = afRegex.exec(stepText)) !== null) {
      advancedFaces.push({
        id: m[1],
        boundIds: m[2].split(',').map((s) => s.trim().replace('#', '')),
        surfId: m[3],
        sameSense: m[4] === 'T',
      });
    }

    const computeLoopProps = (loopPts: [number, number, number][]) => {
      let nx = 0, ny = 0, nz = 0;
      let cx = 0, cy = 0, cz = 0;
      for (let i = 0; i < loopPts.length; i++) {
        const c = loopPts[i], next = loopPts[(i + 1) % loopPts.length];
        nx += (c[1] - next[1]) * (c[2] + next[2]);
        ny += (c[2] - next[2]) * (c[0] + next[0]);
        nz += (c[0] - next[0]) * (c[1] + next[1]);
        cx += c[0]; cy += c[1]; cz += c[2];
      }
      const lenN = Math.hypot(nx, ny, nz);
      if (lenN < 1e-6) return null;
      return {
        normal: [nx / lenN, ny / lenN, nz / lenN] as [number, number, number],
        area: lenN * 0.5,
        center: [cx / loopPts.length, cy / loopPts.length, cz / loopPts.length] as [number, number, number],
      };
    };

    const emitPlanarLoopGroup = (
      outerPts: [number, number, number][],
      holeLoops: [number, number, number][][],
      nx: number,
      ny: number,
      nz: number
    ) => {
      let ux = 0, uy = 1, uz = 0;
      if (Math.abs(ny) > 0.9) { ux = 1; uy = 0; uz = 0; }
      let tx = ny * uz - nz * uy;
      let ty = nz * ux - nx * uz;
      let tz = nx * uy - ny * ux;
      const tlen = Math.hypot(tx, ty, tz) || 1;
      tx /= tlen; ty /= tlen; tz /= tlen;
      const vx = ny * tz - nz * ty;
      const vy = nz * tx - nx * tz;
      const vz = nx * ty - ny * tx;

      const project2D = (pts: [number, number, number][]): [number, number][] =>
        pts.map((p) => [
          (p[0] - outerPts[0][0]) * tx + (p[1] - outerPts[0][1]) * ty + (p[2] - outerPts[0][2]) * tz,
          (p[0] - outerPts[0][0]) * vx + (p[1] - outerPts[0][1]) * vy + (p[2] - outerPts[0][2]) * vz,
        ]);

      if (holeLoops.length > 0 && typeof T.ShapeUtils?.triangulateShape === 'function') {
        const contour2D = project2D(outerPts).map((p) => new T.Vector2(p[0], p[1]));
        const holes2D = holeLoops.map((hl) => project2D(hl).map((p) => new T.Vector2(p[0], p[1])));
        const allPts3D: [number, number, number][] = [...outerPts];
        for (const hl of holeLoops) {
          allPts3D.push(...hl);
        }
        const faces = T.ShapeUtils.triangulateShape(contour2D, holes2D);
        for (const f of faces) {
          const pA = allPts3D[f[0]], pB = allPts3D[f[1]], pC = allPts3D[f[2]];
          if (!pA || !pB || !pC) continue;
          triPositions.push(pA[0], pA[1], pA[2], pB[0], pB[1], pB[2], pC[0], pC[1], pC[2]);
          triNormals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
        }
        return;
      }

      const pts2D = project2D(outerPts);
      const tris = earClip2D(pts2D);
      for (let k = 0; k < tris.length; k += 3) {
        const pA = outerPts[tris[k]], pB = outerPts[tris[k + 1]], pC = outerPts[tris[k + 2]];
        triPositions.push(pA[0], pA[1], pA[2], pB[0], pB[1], pB[2], pC[0], pC[1], pC[2]);
        triNormals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
      }
    };

    if (advancedFaces.length > 0) {
      for (const af of advancedFaces) {
        const sampledLoops: Array<{ pts: [number, number, number][]; area: number; normal: [number, number, number]; center: [number, number, number] }> = [];
        for (const bId of af.boundIds) {
          const fb = faceBounds.get(bId);
          if (!fb) continue;
          const pts = sampleLoop(fb.loopId);
          if (pts.length < 3) continue;
          const props = computeLoopProps(pts);
          if (props) {
            sampledLoops.push({ pts, area: props.area, normal: props.normal, center: props.center });
          } else {
            sampledLoops.push({ pts, area: 0, normal: [0, 1, 0], center: pts[0] });
          }
        }
        if (sampledLoops.length === 0) continue;

        const revSurf = revSurfs.get(af.surfId);
        if (revSurf) {
          const pl = placements.get(revSurf.placementId);
          if (pl?.origin && pl?.axis) {
            const origin = pl.origin;
            const lenA = Math.hypot(...pl.axis) || 1;
            const axis: [number, number, number] = [pl.axis[0] / lenA, pl.axis[1] / lenA, pl.axis[2] / lenA];
            let ref = pl.ref;
            if (!ref) ref = Math.abs(axis[0]) < 0.9 ? [1, 0, 0] : [0, 0, 1];
            const dot = ref[0] * axis[0] + ref[1] * axis[1] + ref[2] * axis[2];
            let u: [number, number, number] = [ref[0] - dot * axis[0], ref[1] - dot * axis[1], ref[2] - dot * axis[2]];
            const lenU = Math.hypot(...u) || 1;
            u = [u[0] / lenU, u[1] / lenU, u[2] / lenU];
            const v: [number, number, number] = [
              axis[1] * u[2] - axis[2] * u[1],
              axis[2] * u[0] - axis[0] * u[2],
              axis[0] * u[1] - axis[1] * u[0],
            ];

            const allPts = sampledLoops.flatMap((l) => l.pts);
            let hMin = Infinity, hMax = -Infinity;
            const hVals: number[] = [];
            const rVals: number[] = [];
            const thetas: number[] = [];

            for (const p of allPts) {
              const dx = p[0] - origin[0], dy = p[1] - origin[1], dz = p[2] - origin[2];
              const h = dx * axis[0] + dy * axis[1] + dz * axis[2];
              const ru = dx * u[0] + dy * u[1] + dz * u[2];
              const rv = dx * v[0] + dy * v[1] + dz * v[2];
              const r = Math.hypot(ru, rv);
              if (h < hMin) hMin = h;
              if (h > hMax) hMax = h;
              hVals.push(h);
              rVals.push(r);
              if (r > 1e-3) {
                thetas.push(Math.atan2(rv, ru));
              }
            }

            if (hMax - hMin > 1e-4) {
              let rAtMin = revSurf.r1;
              let rAtMax = revSurf.r1;
              if (revSurf.type !== 'CYLINDRICAL_SURFACE') {
                const band = Math.max(1e-3, (hMax - hMin) * 0.15);
                let sumMin = 0, cntMin = 0, sumMax = 0, cntMax = 0;
                for (let idx = 0; idx < hVals.length; idx++) {
                  if (hVals[idx] <= hMin + band) { sumMin += rVals[idx]; cntMin++; }
                  if (hVals[idx] >= hMax - band) { sumMax += rVals[idx]; cntMax++; }
                }
                if (cntMin > 0) rAtMin = sumMin / cntMin;
                if (cntMax > 0) rAtMax = sumMax / cntMax;
              }

              let thetaStart = 0;
              let dThetaSpan = 2 * Math.PI;
              if (thetas.length >= 3) {
                thetas.sort((a, b) => a - b);
                let maxGap = 0;
                let gapIdx = -1;
                for (let idx = 0; idx < thetas.length - 1; idx++) {
                  const gap = thetas[idx + 1] - thetas[idx];
                  if (gap > maxGap) { maxGap = gap; gapIdx = idx; }
                }
                const wrapGap = thetas[0] + 2 * Math.PI - thetas[thetas.length - 1];
                if (wrapGap > maxGap) {
                  maxGap = wrapGap;
                  gapIdx = thetas.length - 1;
                }
                if (maxGap > 0.45) {
                  thetaStart = thetas[(gapIdx + 1) % thetas.length];
                  dThetaSpan = Math.max(0.1, 2 * Math.PI - maxGap);
                }
              }

              const nSegs = Math.max(12, Math.ceil((dThetaSpan / (2 * Math.PI)) * 36));
              const signNorm = af.sameSense ? 1 : -1;
              for (let k = 0; k < nSegs; k++) {
                const t0 = thetaStart + (k / nSegs) * dThetaSpan;
                const t1 = thetaStart + ((k + 1) / nSegs) * dThetaSpan;
                const c0 = Math.cos(t0), s0 = Math.sin(t0);
                const c1 = Math.cos(t1), s1 = Math.sin(t1);

                const rad0: [number, number, number] = [c0 * u[0] + s0 * v[0], c0 * u[1] + s0 * v[1], c0 * u[2] + s0 * v[2]];
                const rad1: [number, number, number] = [c1 * u[0] + s1 * v[0], c1 * u[1] + s1 * v[1], c1 * u[2] + s1 * v[2]];

                const p00: [number, number, number] = [
                  origin[0] + hMin * axis[0] + rAtMin * rad0[0],
                  origin[1] + hMin * axis[1] + rAtMin * rad0[1],
                  origin[2] + hMin * axis[2] + rAtMin * rad0[2],
                ];
                const p10: [number, number, number] = [
                  origin[0] + hMin * axis[0] + rAtMin * rad1[0],
                  origin[1] + hMin * axis[1] + rAtMin * rad1[1],
                  origin[2] + hMin * axis[2] + rAtMin * rad1[2],
                ];
                const p11: [number, number, number] = [
                  origin[0] + hMax * axis[0] + rAtMax * rad1[0],
                  origin[1] + hMax * axis[1] + rAtMax * rad1[1],
                  origin[2] + hMax * axis[2] + rAtMax * rad1[2],
                ];
                const p01: [number, number, number] = [
                  origin[0] + hMax * axis[0] + rAtMax * rad0[0],
                  origin[1] + hMax * axis[1] + rAtMax * rad0[1],
                  origin[2] + hMax * axis[2] + rAtMax * rad0[2],
                ];

                const n0: [number, number, number] = [rad0[0] * signNorm, rad0[1] * signNorm, rad0[2] * signNorm];
                const n1: [number, number, number] = [rad1[0] * signNorm, rad1[1] * signNorm, rad1[2] * signNorm];

                triPositions.push(p00[0], p00[1], p00[2], p10[0], p10[1], p10[2], p11[0], p11[1], p11[2]);
                triNormals.push(n0[0], n0[1], n0[2], n1[0], n1[1], n1[2], n1[0], n1[1], n1[2]);

                triPositions.push(p00[0], p00[1], p00[2], p11[0], p11[1], p11[2], p01[0], p01[1], p01[2]);
                triNormals.push(n0[0], n0[1], n0[2], n1[0], n1[1], n1[2], n0[0], n0[1], n0[2]);
              }
              continue;
            }
          }
        }

        sampledLoops.sort((a, b) => b.area - a.area);
        const outer = sampledLoops[0];
        if (outer.area < 1e-6) continue;

        let nx = outer.normal[0], ny = outer.normal[1], nz = outer.normal[2];
        const plSurfId = planeSurfs.get(af.surfId);
        if (plSurfId) {
          const pl = placements.get(plSurfId);
          if (pl?.axis) {
            const lenA = Math.hypot(...pl.axis) || 1;
            const sign = af.sameSense ? 1 : -1;
            nx = (pl.axis[0] / lenA) * sign;
            ny = (pl.axis[1] / lenA) * sign;
            nz = (pl.axis[2] / lenA) * sign;
          }
          const netArea = Math.max(0.1, outer.area - sampledLoops.slice(1).reduce((s, l) => s + l.area, 0));
          loopInfos.push({
            normal: [nx, ny, nz],
            area: netArea,
            center: outer.center,
          });
        }

        emitPlanarLoopGroup(
          outer.pts,
          sampledLoops.slice(1).map((l) => l.pts),
          nx,
          ny,
          nz
        );
      }
    } else {
      for (const loopId of loopMap.keys()) {
        const loopPts = sampleLoop(loopId);
        if (loopPts.length < 3) continue;
        const props = computeLoopProps(loopPts);
        if (!props) continue;
        loopInfos.push(props);
        emitPlanarLoopGroup(loopPts, [], props.normal[0], props.normal[1], props.normal[2]);
      }
    }

    let ex: [number, number, number] = [1, 0, 0];
    let ey: [number, number, number] = [0, 1, 0];
    let ez: [number, number, number] = [0, 0, 1];

    const canonVec = (v: [number, number, number]): [number, number, number] => {
      for (const comp of v) {
        if (Math.abs(comp) > 1e-4) {
          return comp < 0 ? [-v[0], -v[1], -v[2]] : v;
        }
      }
      return v;
    };

    if (loopInfos.length > 0 && triPositions.length >= 9) {
      loopInfos.sort((a, b) => b.area - a.area);
      const n0 = loopInfos[0].normal;
      const c0 = loopInfos[0].center;
      let partCx = 0, partCy = 0, partCz = 0;
      const vCount = triPositions.length / 3;
      for (let i = 0; i < triPositions.length; i += 3) {
        partCx += triPositions[i];
        partCy += triPositions[i + 1];
        partCz += triPositions[i + 2];
      }
      partCx /= vCount; partCy /= vCount; partCz /= vCount;
      const dotCentroid = (partCx - c0[0]) * n0[0] + (partCy - c0[1]) * n0[1] + (partCz - c0[2]) * n0[2];
      ey = dotCentroid < -1e-4 ? [-n0[0], -n0[1], -n0[2]] : [n0[0], n0[1], n0[2]];

      let minYTest = Infinity, maxYTest = -Infinity;
      for (let i = 0; i < triPositions.length; i += 3) {
        const py = triPositions[i] * ey[0] + triPositions[i + 1] * ey[1] + triPositions[i + 2] * ey[2];
        if (py < minYTest) minYTest = py;
        if (py > maxYTest) maxYTest = py;
      }
      const spanYTest = maxYTest - minYTest;
      if (spanYTest > 1e-3) {
        let areaNearMin = 0, areaNearMax = 0;
        for (const li of loopInfos) {
          const dAlign = Math.abs(li.normal[0] * ey[0] + li.normal[1] * ey[1] + li.normal[2] * ey[2]);
          if (dAlign > 0.95) {
            const cyProj = li.center[0] * ey[0] + li.center[1] * ey[1] + li.center[2] * ey[2];
            if (cyProj - minYTest <= spanYTest * 0.15) areaNearMin += li.area;
            if (maxYTest - cyProj <= spanYTest * 0.15) areaNearMax += li.area;
          }
        }
        if (areaNearMax > areaNearMin + 1.0) {
          ey = [-ey[0], -ey[1], -ey[2]];
        }
      }

      const secGroups = new Map<string, { vec: [number, number, number]; area: number }>();
      for (let i = 1; i < loopInfos.length; i++) {
        const ns = loopInfos[i].normal;
        const d = ns[0] * ey[0] + ns[1] * ey[1] + ns[2] * ey[2];
        if (Math.abs(d) < 0.25) {
          let px = ns[0] - d * ey[0];
          let py = ns[1] - d * ey[1];
          let pz = ns[2] - d * ey[2];
          const plen = Math.hypot(px, py, pz) || 1;
          px /= plen; py /= plen; pz /= plen;
          const cv = canonVec([px, py, pz]);
          const key = `${cv[0].toFixed(2)},${cv[1].toFixed(2)},${cv[2].toFixed(2)}`;
          const prev = secGroups.get(key);
          if (prev) {
            prev.area += loopInfos[i].area;
          } else {
            secGroups.set(key, { vec: cv, area: loopInfos[i].area });
          }
        }
      }

      if (secGroups.size > 0) {
        let bestArea = -1;
        for (const g of secGroups.values()) {
          if (g.area > bestArea) {
            bestArea = g.area;
            ez = g.vec;
          }
        }
      } else {
        const ref: [number, number, number] = Math.abs(ey[0]) < 0.85 ? [1, 0, 0] : [0, 0, 1];
        const d = ref[0] * ey[0] + ref[1] * ey[1] + ref[2] * ey[2];
        const px = ref[0] - d * ey[0], py = ref[1] - d * ey[1], pz = ref[2] - d * ey[2];
        const plen = Math.hypot(px, py, pz) || 1;
        ez = [px / plen, py / plen, pz / plen];
      }

      const cxE = ey[1] * ez[2] - ey[2] * ez[1];
      const cyE = ey[2] * ez[0] - ey[0] * ez[2];
      const czE = ey[0] * ez[1] - ey[1] * ez[0];
      const lenEx = Math.hypot(cxE, cyE, czE) || 1;
      ex = [cxE / lenEx, cyE / lenEx, czE / lenEx];

      let minRx = Infinity, maxRx = -Infinity, minRz = Infinity, maxRz = -Infinity;
      for (let i = 0; i < triPositions.length; i += 3) {
        const x = triPositions[i], y = triPositions[i + 1], z = triPositions[i + 2];
        const rx = x * ex[0] + y * ex[1] + z * ex[2];
        const rz = x * ez[0] + y * ez[1] + z * ez[2];
        if (rx < minRx) minRx = rx;
        if (rx > maxRx) maxRx = rx;
        if (rz < minRz) minRz = rz;
        if (rz > maxRz) maxRz = rz;
      }
      if (maxRz - minRz > maxRx - minRx + 1e-3) {
        const oldEx = ex;
        ex = ez;
        ez = [-oldEx[0], -oldEx[1], -oldEx[2]];
      }
    }

    let alignedMinX = Infinity, alignedMaxX = -Infinity;
    let alignedMinY = Infinity, alignedMaxY = -Infinity;
    let alignedMinZ = Infinity, alignedMaxZ = -Infinity;

    for (let i = 0; i < triPositions.length; i += 3) {
      const x = triPositions[i], y = triPositions[i + 1], z = triPositions[i + 2];
      const rx = x * ex[0] + y * ex[1] + z * ex[2];
      const ry = x * ey[0] + y * ey[1] + z * ey[2];
      const rz = x * ez[0] + y * ez[1] + z * ez[2];
      triPositions[i] = rx;
      triPositions[i + 1] = ry;
      triPositions[i + 2] = rz;
      if (rx < alignedMinX) alignedMinX = rx;
      if (rx > alignedMaxX) alignedMaxX = rx;
      if (ry < alignedMinY) alignedMinY = ry;
      if (ry > alignedMaxY) alignedMaxY = ry;
      if (rz < alignedMinZ) alignedMinZ = rz;
      if (rz > alignedMaxZ) alignedMaxZ = rz;

      const nx = triNormals[i], ny = triNormals[i + 1], nz = triNormals[i + 2];
      triNormals[i] = nx * ex[0] + ny * ex[1] + nz * ex[2];
      triNormals[i + 1] = nx * ey[0] + ny * ey[1] + nz * ey[2];
      triNormals[i + 2] = nx * ez[0] + ny * ez[1] + nz * ez[2];
    }

    const finalSizeX = isFinite(alignedMaxX - alignedMinX) && alignedMaxX > alignedMinX
      ? parseFloat((alignedMaxX - alignedMinX).toFixed(2))
      : sizeX;
    const finalSizeY = isFinite(alignedMaxY - alignedMinY) && alignedMaxY > alignedMinY
      ? parseFloat((alignedMaxY - alignedMinY).toFixed(2))
      : sizeY;
    const finalSizeZ = isFinite(alignedMaxZ - alignedMinZ) && alignedMaxZ > alignedMinZ
      ? parseFloat((alignedMaxZ - alignedMinZ).toFixed(2))
      : sizeZ;

    const shiftX = isFinite(alignedMinX) ? (alignedMinX + alignedMaxX) / 2 : centerX;
    const shiftY = isFinite(alignedMinY) ? alignedMinY : bottomY;
    const shiftZ = isFinite(alignedMinZ) ? (alignedMinZ + alignedMaxZ) / 2 : centerZ;
    const standoffHeight = 20.0;

    for (let i = 0; i < triPositions.length; i += 3) {
      triPositions[i] -= shiftX;
      triPositions[i + 1] = triPositions[i + 1] - shiftY + standoffHeight;
      triPositions[i + 2] -= shiftZ;
    }

    const metalMat = new T.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.35,
      roughness: 0.38,
      side: T.DoubleSide,
    });
    const edgeMat = new T.LineBasicMaterial({
      color: 0x0f172a,
      linewidth: 1.5,
    });

    let solidGeo: THREE.BufferGeometry;
    if (triPositions.length > 0) {
      solidGeo = new T.BufferGeometry();
      solidGeo.setAttribute('position', new T.Float32BufferAttribute(triPositions, 3));
      solidGeo.setAttribute('normal', new T.Float32BufferAttribute(triNormals, 3));

      const vCount = triPositions.length / 3;
      const fIdArr = new Float32Array(vCount);
      const sTypeArr = new Float32Array(vCount);
      for (let i = 0; i < vCount; i++) {
        fIdArr[i] = Math.floor(i / 3) + 1;
        sTypeArr[i] = 1;
      }
      solidGeo.setAttribute('faceId', new T.Float32BufferAttribute(fIdArr, 1));
      solidGeo.setAttribute('surfaceType', new T.Float32BufferAttribute(sTypeArr, 1));

      const solidMesh = new T.Mesh(solidGeo, metalMat);
      solidMesh.name = 'step_brep_solid';
      group.add(solidMesh);

      const edgesGeo = new T.EdgesGeometry(solidGeo, 24);
      const edgeLines = new T.LineSegments(edgesGeo, edgeMat);
      group.add(edgeLines);
    } else {
      solidGeo = new T.BoxGeometry(finalSizeX, finalSizeY, finalSizeZ);
      solidGeo.translate(0, standoffHeight + finalSizeY / 2, 0);

      const vCount = solidGeo.getAttribute('position').count;
      const fIdArr = new Float32Array(vCount);
      const sTypeArr = new Float32Array(vCount);
      for (let i = 0; i < vCount; i++) {
        fIdArr[i] = Math.floor(i / 4) + 1;
        sTypeArr[i] = 1;
      }
      solidGeo.setAttribute('faceId', new T.Float32BufferAttribute(fIdArr, 1));
      solidGeo.setAttribute('surfaceType', new T.Float32BufferAttribute(sTypeArr, 1));

      const boxMesh = new T.Mesh(solidGeo, metalMat);
      boxMesh.name = 'step_bbox_solid';
      group.add(boxMesh);

      const edges = new T.EdgesGeometry(solidGeo, 24);
      const edgeLines = new T.LineSegments(edges, edgeMat);
      group.add(edgeLines);
    }

    const detectedHoles: DetectedHoleItem[] = [];
    let holeIdx = 1;
    circles.forEach((circ) => {
      if (circ.radius >= 0.5 && circ.radius <= 60.0) {
        const orig = circ.placement?.origin;
        let ox = 0, oy = standoffHeight + finalSizeY, oz = 0;
        if (orig) {
          const rx = orig[0] * ex[0] + orig[1] * ex[1] + orig[2] * ex[2];
          const ry = orig[0] * ey[0] + orig[1] * ey[1] + orig[2] * ey[2];
          const rz = orig[0] * ez[0] + orig[1] * ez[1] + orig[2] * ez[2];
          ox = rx - shiftX;
          oy = ry - shiftY + standoffHeight;
          oz = rz - shiftZ;
        }
        const rawNorm = circ.placement?.axis || [0, 1, 0];
        const rnx = rawNorm[0] * ex[0] + rawNorm[1] * ex[1] + rawNorm[2] * ex[2];
        const rny = rawNorm[0] * ey[0] + rawNorm[1] * ey[1] + rawNorm[2] * ey[2];
        const rnz = rawNorm[0] * ez[0] + rawNorm[1] * ez[1] + rawNorm[2] * ez[2];
        const isDuplicate = detectedHoles.some(
          (h) => Math.hypot(h.center[0] - ox, h.center[1] - oy, h.center[2] - oz) < 1.0 && Math.abs(h.radius - circ.radius) < 0.2
        );
        if (!isDuplicate) {
          detectedHoles.push({
            center: [parseFloat(ox.toFixed(2)), parseFloat(oy.toFixed(2)), parseFloat(oz.toFixed(2))],
            normal: [parseFloat(rnx.toFixed(2)), parseFloat(rny.toFixed(2)), parseFloat(rnz.toFixed(2))],
            radius: parseFloat(circ.radius.toFixed(2)),
            name: `DELIK_Ø${(circ.radius * 2).toFixed(2)}_${holeIdx++}`,
          });
        }
      }
    });

    const standoffSupports = this.calculateStandoffSupports(
      solidGeo.getAttribute('position'),
      finalSizeX,
      finalSizeY,
      finalSizeZ,
      standoffHeight,
      detectedHoles
    );
    group.add(this.createStandoffRiserGroup(standoffSupports));

    group.userData.detectedHoles = detectedHoles;
    group.userData.datumANormal = new T.Vector3(0, -1, 0);
    group.userData.standoffHeight = standoffHeight;
    group.userData.standoffSupports = standoffSupports;

    const genericCadFeatures: CadFeatureItem[] = [
      { id: 'CAD_BBOX_X', feature_type: 'PLANE', nominal_dimension: finalSizeX, center: [finalSizeX / 2, standoffHeight + finalSizeY / 2, 0], normal: [1, 0, 0] },
      { id: 'CAD_BBOX_Y', feature_type: 'PLANE', nominal_dimension: finalSizeY, center: [0, standoffHeight + finalSizeY, 0], normal: [0, 1, 0] },
      { id: 'CAD_BBOX_Z', feature_type: 'PLANE', nominal_dimension: finalSizeZ, center: [0, standoffHeight + finalSizeY / 2, finalSizeZ / 2], normal: [0, 0, 1] },
      ...detectedHoles.map((h, i) => ({
        id: `CAD_HOLE_${i + 1}`,
        feature_type: 'INTERNAL_CYLINDER' as const,
        nominal_dimension: h.radius * 2,
        center: h.center,
        normal: h.normal,
        description: h.name,
      })),
    ];

    let distIdx = 1;
    const seenDists = new Set<number>();
    for (let i = 0; i < detectedHoles.length; i++) {
      for (let j = i + 1; j < detectedHoles.length; j++) {
        const h1 = detectedHoles[i], h2 = detectedHoles[j];
        const dXz = parseFloat(Math.hypot(h1.center[0] - h2.center[0], h1.center[2] - h2.center[2]).toFixed(2));
        if (dXz > 1.0 && !seenDists.has(dXz)) {
          seenDists.add(dXz);
          genericCadFeatures.push({
            id: `CAD_DIST_${dXz.toFixed(2)}_${distIdx++}`,
            feature_type: 'PLANE',
            nominal_dimension: dXz,
            center: [
              parseFloat(((h1.center[0] + h2.center[0]) / 2).toFixed(2)),
              Math.max(h1.center[1], h2.center[1]),
              parseFloat(((h1.center[2] + h2.center[2]) / 2).toFixed(2)),
            ],
            normal: [0, 1, 0],
            description: `Eksenler Arası Mesafe (${dXz.toFixed(2)} mm)`,
          });
        }
      }
    }

    return {
      group,
      geometry: solidGeo,
      bbox: {
        min: [-finalSizeX / 2, standoffHeight, -finalSizeZ / 2],
        max: [finalSizeX / 2, standoffHeight + finalSizeY, finalSizeZ / 2],
        size: [finalSizeX, finalSizeY, finalSizeZ],
      },
      detectedHoles,
      primaryDatumNormal: [0, -1, 0],
      cadFeatures: genericCadFeatures,
      standoffSupports,
    };
  }
}
