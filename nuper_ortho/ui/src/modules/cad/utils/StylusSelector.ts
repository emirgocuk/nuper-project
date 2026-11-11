import * as THREE from 'three';

export const DEFAULT_STYLUS_BALL_MM = 2.0;
export const FALLBACK_STYLUS_BALL_MM = 1.0;
export const MAX_BALL_TO_HOLE_RATIO = 0.6;

export interface StylusChoice {
  ballDiameterMm: number;
  feasible: boolean;
  changedFromDefault: boolean;
}

export type SurfaceType = 'PLANE' | 'CYLINDER' | 'CONE' | 'SPHERE' | 'TORUS' | 'OTHER';

export interface SelectedFaceDetails {
  faceId: number;
  surfaceType: SurfaceType;
  center: [number, number, number];
  normal: [number, number, number];
  diameter?: number;
  area?: number;
  featureId?: string;
}

export interface OptimalStylusConfig {
  stylusType: 'STRAIGHT_SINGLE' | 'STAR_5WAY_30MM';
  tipIndex: number;
  ph10Angle: {
    a: number;
    b: number;
    label: string;
  };
  effectiveDia: number;
}

export function selectStylusForHole(holeDiameterMm: number): StylusChoice {
  const fits = (ball: number): boolean => ball <= holeDiameterMm * MAX_BALL_TO_HOLE_RATIO;

  if (fits(DEFAULT_STYLUS_BALL_MM)) {
    return { ballDiameterMm: DEFAULT_STYLUS_BALL_MM, feasible: true, changedFromDefault: false };
  }
  return {
    ballDiameterMm: FALLBACK_STYLUS_BALL_MM,
    feasible: fits(FALLBACK_STYLUS_BALL_MM),
    changedFromDefault: true,
  };
}

export function extractFaceDetailsFromHit(
  hit: THREE.Intersection,
  mesh: THREE.Mesh,
  features?: Array<{
    id: string;
    center?: [number, number, number];
    normal?: [number, number, number];
    feature_type?: string;
    nominal_dimension?: number;
    area_or_length?: number;
  }>
): SelectedFaceDetails | null {
  if (!hit || hit.faceIndex == null || !mesh.geometry) {
    return null;
  }

  const faceIndex = hit.faceIndex;
  const geometry = mesh.geometry;
  const faceIdAttr = geometry.getAttribute('faceId');
  const surfaceTypeAttr = geometry.getAttribute('surfaceType');
  const indexAttr = geometry.getIndex();

  let vertIndex = faceIndex * 3;
  if (indexAttr) {
    vertIndex = indexAttr.getX(faceIndex * 3);
  }

  const faceId = faceIdAttr ? faceIdAttr.getX(vertIndex) : faceIndex + 1;
  const sTypeNum = surfaceTypeAttr ? surfaceTypeAttr.getX(vertIndex) : 1;

  const numToType = (num: number): SurfaceType => {
    switch (Math.round(num)) {
      case 1:
        return 'PLANE';
      case 2:
        return 'CYLINDER';
      case 3:
        return 'CONE';
      case 4:
        return 'SPHERE';
      case 5:
        return 'TORUS';
      default:
        return 'OTHER';
    }
  };

  const surfaceType = numToType(sTypeNum);
  const hitPoint = hit.point;
  const normal: [number, number, number] = hit.face
    ? [hit.face.normal.x, hit.face.normal.y, hit.face.normal.z]
    : [0, 1, 0];

  let center: [number, number, number] = [hitPoint.x, hitPoint.y, hitPoint.z];
  let diameter: number | undefined;
  let area: number | undefined;
  let featureId: string | undefined;

  const bRepFaces = geometry.userData?.bRepFaces as
    | Array<{
        numericId: number;
        surfaceType: string;
        area?: number;
      }>
    | undefined;

  if (bRepFaces) {
    const matchedBRep = bRepFaces.find((f) => f.numericId === faceId);
    if (matchedBRep) {
      area = matchedBRep.area;
    }
  }

  if (features && features.length > 0) {
    let closestDist = Infinity;
    for (const f of features) {
      if (f.center) {
        const dx = f.center[0] - hitPoint.x;
        const dy = f.center[1] - hitPoint.y;
        const dz = f.center[2] - hitPoint.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < closestDist) {
          closestDist = dist;
          featureId = f.id;
          if (closestDist < 12.0) {
            center = f.center;
            if (f.normal) normal[0] = f.normal[0];
            if (f.normal) normal[1] = f.normal[1];
            if (f.normal) normal[2] = f.normal[2];
            diameter = f.nominal_dimension;
            area = f.area_or_length;
          }
        }
      }
    }
  }

  return {
    faceId,
    surfaceType,
    center,
    normal,
    diameter,
    area,
    featureId,
  };
}

export function selectOptimalStylusConfiguration(
  housingCollision: boolean,
  featureNormal: [number, number, number]
): OptimalStylusConfig {
  if (housingCollision) {
    const [nx, ny, nz] = featureNormal;
    const ax = Math.abs(nx);
    const ay = Math.abs(ny);
    const az = Math.abs(nz);

    let tipIndex = 1;
    if (az >= ax && az >= ay) {
      tipIndex = 1;
    } else if (ax >= ay && ax >= az) {
      tipIndex = nx >= 0 ? 2 : 4;
    } else {
      tipIndex = ny >= 0 ? 3 : 5;
    }

    return {
      stylusType: 'STAR_5WAY_30MM',
      tipIndex,
      ph10Angle: {
        a: 0,
        b: 0,
        label: 'A0.0° B0.0°',
      },
      effectiveDia: 1.9992,
    };
  }

  return {
    stylusType: 'STRAIGHT_SINGLE',
    tipIndex: 1,
    ph10Angle: {
      a: 0,
      b: 0,
      label: 'A0.0° B0.0°',
    },
    effectiveDia: 1.9996,
  };
}

export interface ProbeRackPort {
  portId: number;
  stylusId: string;
  dockPos: [number, number, number];
  approachVec: [number, number, number];
  isOccupied: boolean;
}

export interface ProbeChangeWaypoint {
  stepIndex: number;
  name: string;
  target: [number, number, number];
  speedMms: number;
  action: string;
}

export function planMcr20ProbeChange(
  currentPos: [number, number, number],
  currentPort: ProbeRackPort,
  targetPort: ProbeRackPort,
  safeAltitudeZ: number
): ProbeChangeWaypoint[] {
  const normAppCurr = Math.hypot(...currentPort.approachVec) || 1.0;
  const acx = currentPort.approachVec[0] / normAppCurr;
  const acy = currentPort.approachVec[1] / normAppCurr;
  const acz = currentPort.approachVec[2] / normAppCurr;

  const currPreDock: [number, number, number] = [
    currentPort.dockPos[0] - acx * 50.0,
    currentPort.dockPos[1] - acy * 50.0,
    currentPort.dockPos[2] - acz * 50.0,
  ];
  const currElevated: [number, number, number] = [
    currentPort.dockPos[0],
    currentPort.dockPos[1],
    currentPort.dockPos[2] + 15.0,
  ];

  const normAppTgt = Math.hypot(...targetPort.approachVec) || 1.0;
  const atx = targetPort.approachVec[0] / normAppTgt;
  const aty = targetPort.approachVec[1] / normAppTgt;
  const atz = targetPort.approachVec[2] / normAppTgt;

  const tgtPreDock: [number, number, number] = [
    targetPort.dockPos[0] - atx * 50.0,
    targetPort.dockPos[1] - aty * 50.0,
    targetPort.dockPos[2] - atz * 50.0,
  ];
  const tgtElevated: [number, number, number] = [
    targetPort.dockPos[0],
    targetPort.dockPos[1],
    targetPort.dockPos[2] + 15.0,
  ];

  return [
    {
      stepIndex: 1,
      name: 'RetractToSafeAltitude',
      target: [currentPos[0], currentPos[1], safeAltitudeZ],
      speedMms: 150.0,
      action: 'Traverse',
    },
    {
      stepIndex: 2,
      name: 'MoveAboveOldPortApproach',
      target: [currPreDock[0], currPreDock[1], safeAltitudeZ],
      speedMms: 150.0,
      action: 'Traverse',
    },
    {
      stepIndex: 3,
      name: 'DescendToApproachHeight',
      target: currPreDock,
      speedMms: 50.0,
      action: 'Descent',
    },
    {
      stepIndex: 4,
      name: 'EnterPortReleaseLock',
      target: [...currentPort.dockPos],
      speedMms: 20.0,
      action: 'DockRelease',
    },
    {
      stepIndex: 5,
      name: 'AscendLeavingModule',
      target: currElevated,
      speedMms: 20.0,
      action: 'ModuleRelease',
    },
    {
      stepIndex: 6,
      name: 'MoveAboveNewPort',
      target: [tgtElevated[0], tgtElevated[1], safeAltitudeZ],
      speedMms: 150.0,
      action: 'Traverse',
    },
    {
      stepIndex: 7,
      name: 'DescendAndEngageLock',
      target: [...targetPort.dockPos],
      speedMms: 20.0,
      action: 'DockEngage',
    },
    {
      stepIndex: 8,
      name: 'ExitPortToSafeAltitude',
      target: [tgtPreDock[0], tgtPreDock[1], safeAltitudeZ],
      speedMms: 50.0,
      action: 'Retract',
    },
  ];
}
