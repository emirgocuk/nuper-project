import * as THREE from 'three';
import { type Waypoint, type ProbePhase } from '../SimulationController';
import { Ph10Kinematics, type PH10Angle } from './Ph10Kinematics';
import { orderFeaturesByMetrologyDiscipline } from './MeasurementPhases';
import { selectStylusForHole, type StylusChoice } from './StylusSelector';
import { SetupPrep, type ClampBox } from './SetupPrep';

export interface PathFeatureInstance {
  center: [number, number, number];
  normal: [number, number, number];
  axial_min?: number;
  axial_max?: number;
  stem_blocked?: boolean;
}

export interface PathFeatureInput {
  id: number;
  balloon: string;
  type?: string;
  type_label?: string;
  gdt?: string;
  nominal: number;
  nominal_str?: string;
  cad_center?: [number, number, number];
  cad_normal?: [number, number, number];
  cad_feature_id?: string;
  match_status?: string;
  feature_type?: string;
  operation?: 'OP10' | 'OP20';
  axial_min?: number;
  axial_max?: number;
  stem_blocked?: boolean;
  cad_instances?: PathFeatureInstance[];
  faceA_center?: [number, number, number];
  faceB_center?: [number, number, number];
  faceA_normal?: [number, number, number];
  faceB_normal?: [number, number, number];
  distance_type?: string;
  axis?: 'X' | 'Y' | 'Z';
  is_blind?: boolean;
  floor_z?: number;
  pitch?: number;
}

export interface TouchPointRecord {
  position: [number, number, number];
  normal: [number, number, number];
  surfacePoint?: [number, number, number];
  tipCenterPosition?: [number, number, number];
  ph10Label?: string;
  label?: string;
  isDatum?: boolean;
}

export interface ExtendedWaypoint extends Waypoint {
  stylusDir?: [number, number, number];
  ph10Label?: string;
  subPhase?: string;
  feedRate?: number;
}

export interface FeatureMeasurementPath {
  featureId: number;
  balloon: string;
  ph10Angle: PH10Angle;
  touchPoints: TouchPointRecord[];
  waypoints: Waypoint[];
}

export interface StylusRecommendation extends StylusChoice {
  featureId: number;
  balloon: string;
  holeDiameterMm: number;
  recommendedModel?: string;
  recommended_stylus?: string;
  recommendedEwlMm?: number;
  reason?: string;
}

export interface GeneratedMeasurementPlan {
  operation: 'OP10' | 'OP20';
  zClearance: number;
  safeIndexZ?: number;
  featurePaths: FeatureMeasurementPath[];
  allWaypoints: Waypoint[];
  totalDistanceMm: number;
  estimatedDurationSec: number;
  probeHeadRotations: number;
  stylusRecommendations: StylusRecommendation[];
  datumTouchPoints?: TouchPointRecord[];
  clampBoxes?: ClampBox[];
}

export interface PathGeneratorOptions {
  activeOperation?: 'OP10' | 'OP20';
  clearanceZMarginMm?: number;
  approachDistanceMm?: number;
  retractDistanceMm?: number;
  verticalAxis?: 'Y' | 'Z';
  includeDatumSetup?: boolean;
  probeTipRadiusMm?: number;
  stylusEwlMm?: number;
  stylusLengthMm?: number;
  headRadiusMm?: number;
  clampBoxes?: ClampBox[];
  datumSurfacePoints?: Array<{
    balloon: 'DATUM_A' | 'DATUM_B' | 'DATUM_C';
    position: [number, number, number];
    normal: [number, number, number];
    label: string;
  }>;
}

export function lookupMetricPitch(nominalDia: number): number {
  const d = Math.round(nominalDia * 10) / 10;
  const coarseMap: Record<number, number> = {
    1.0: 0.25,
    1.2: 0.25,
    1.4: 0.3,
    1.6: 0.35,
    1.8: 0.35,
    2.0: 0.4,
    2.5: 0.45,
    3.0: 0.5,
    3.5: 0.6,
    4.0: 0.7,
    5.0: 0.8,
    6.0: 1.0,
    7.0: 1.0,
    8.0: 1.25,
    10.0: 1.5,
    12.0: 1.75,
    14.0: 2.0,
    16.0: 2.0,
    18.0: 2.5,
    20.0: 2.5,
    22.0: 2.5,
    24.0: 3.0,
  };
  if (coarseMap[d]) return coarseMap[d];
  if (nominalDia < 3.0) return 0.4;
  if (nominalDia < 6.0) return 0.8;
  if (nominalDia < 12.0) return 1.5;
  return 2.0;
}

export function computeSegmentTrapezoidalDuration(dist: number, feedRate: number, accel = 450.0): number {
  if (dist <= 1e-4) return 0;
  const v = Math.max(1.0, feedRate);
  const dAcc = (v * v) / accel;
  if (dist >= dAcc) {
    return dist / v + v / accel;
  }
  return 2.0 * Math.sqrt(dist / accel);
}

export class MeasurementPathGenerator {
  public static generatePlan(
    features: PathFeatureInput[],
    bbox: { min: [number, number, number]; max: [number, number, number] },
    options: PathGeneratorOptions = {}
  ): GeneratedMeasurementPlan {
    const activeOp = options.activeOperation ?? 'OP10';
    const spanY = Math.abs((bbox.max[1] ?? 50) - (bbox.min[1] ?? 0));
    const spanZ = Math.abs((bbox.max[2] ?? 50) - (bbox.min[2] ?? 0));
    const isYAxis = options.verticalAxis !== undefined ? options.verticalAxis === 'Y' : spanY < spanZ;
    const effectiveVerticalAxis: 'Y' | 'Z' = isYAxis ? 'Y' : 'Z';
    const approachDist = options.approachDistanceMm ?? 8.0;
    const retractDist = options.retractDistanceMm ?? 5.0;
    const probeTipRadius = options.probeTipRadiusMm ?? 1.0;
    const stylusEwl = options.stylusEwlMm ?? 20.0;

    const yMinPart = bbox.min[1] ?? 0;
    const yMaxPart = bbox.max[1] ?? 50;
    const zMinPart = bbox.min[2] ?? 0;
    const zMaxPart = bbox.max[2] ?? 50;
    const topAltitude = isYAxis ? yMaxPart : zMaxPart;
    const zMargin = options.clearanceZMarginMm ?? 25.0;
    const zClearance = parseFloat((topAltitude + zMargin).toFixed(2));
    const stylusLength = options.stylusLengthMm ?? 50.0;
    const headRadius = options.headRadiusMm ?? 40.0;
    const safeHeadIndexAltitude = parseFloat(
      (options.clearanceZMarginMm !== undefined
        ? zClearance + 20.0
        : topAltitude + stylusLength + headRadius + 25.0
      ).toFixed(2)
    );

    const maxPartRadius = isYAxis
      ? Math.max(
          Math.abs(bbox.min[0] ?? 20),
          Math.abs(bbox.max[0] ?? 20),
          Math.abs(bbox.min[2] ?? 20),
          Math.abs(bbox.max[2] ?? 20),
          15.0
        )
      : Math.max(
          Math.abs(bbox.min[0] ?? 20),
          Math.abs(bbox.max[0] ?? 20),
          Math.abs(bbox.min[1] ?? 20),
          Math.abs(bbox.max[1] ?? 20),
          15.0
        );
    const safeOuterR = maxPartRadius + 18.0;

    const opFeatures = orderFeaturesByMetrologyDiscipline(
      features.filter(
        (f) =>
          (f.operation ?? 'OP10') === activeOp &&
          f.match_status !== 'UNMATCHED' &&
          f.cad_feature_id !== 'UNMATCHED'
      ),
      options.verticalAxis ?? effectiveVerticalAxis
    );

    const clampBoxes =
      options.clampBoxes ??
      SetupPrep.computeStandardClampBoxes({
        min: bbox.min,
        max: bbox.max,
        size: [bbox.max[0] - bbox.min[0], bbox.max[1] - bbox.min[1], bbox.max[2] - bbox.min[2]],
      });

    const stylusRecommendations: StylusRecommendation[] = [];
    const featurePaths: FeatureMeasurementPath[] = [];
    const allWaypoints: ExtendedWaypoint[] = [];
    const datumTouchPoints: TouchPointRecord[] = [];

    const yMinFloor = isYAxis ? yMinPart + 0.5 : 0;
    const makeWp = (
      position: THREE.Vector3,
      phase: ProbePhase,
      featureId?: number,
      balloon?: string,
      stylusDir: [number, number, number] = isYAxis ? [0, -1, 0] : [0, 0, -1],
      ph10Label = 'A0° B0°',
      subPhase?: string,
      feedRate = 150.0
    ): ExtendedWaypoint => {
      const safePos = position.clone();
      if (isYAxis && activeOp === 'OP10' && safePos.y < yMinFloor) {
        safePos.y = yMinFloor;
      }
      return {
        position: safePos,
        phase,
        featureId,
        balloon,
        stylusDir,
        ph10Label,
        subPhase,
        feedRate,
      };
    };

    const homePos = isYAxis
      ? new THREE.Vector3(0, zClearance, 0)
      : new THREE.Vector3(0, 0, zClearance);
    allWaypoints.push(makeWp(homePos.clone(), 'IDLE', undefined, undefined, isYAxis ? [0, -1, 0] : [0, 0, -1], 'A0° B0°', 'HOME', 150.0));

    let currentAngleLabel: string | null = 'A0° B0°';
    let headRotations = 0;

    const partCx = (bbox.min[0] + bbox.max[0]) / 2;
    const partCz = (bbox.min[2] + bbox.max[2]) / 2;
    const partCy = (bbox.min[1] + bbox.max[1]) / 2;

    const bridgeTransition = (
      dest: ExtendedWaypoint[],
      nextWps: ExtendedWaypoint[]
    ): void => {
      if (nextWps.length === 0) return;
      if (dest.length > 0) {
        const prev = dest[dest.length - 1];
        const next = nextWps[0];
        const prevLabel = prev.ph10Label ?? 'A0° B0°';
        const nextLabel = next.ph10Label ?? 'A0° B0°';
        const prevDir = prev.stylusDir ?? (isYAxis ? [0, -1, 0] : [0, 0, -1]);
        const nextDir = next.stylusDir ?? (isYAxis ? [0, -1, 0] : [0, 0, -1]);

        const isHeadAngleChange = prevLabel !== nextLabel;
        const intersectsClamp = clampBoxes.some((cb) =>
          SetupPrep.lineIntersectsClampBox(
            [prev.position.x, prev.position.y, prev.position.z],
            [next.position.x, next.position.y, next.position.z],
            cb,
            5.0
          )
        );

        if (isHeadAngleChange || intersectsClamp) {
          if (isHeadAngleChange) headRotations++;
          const retractY = Math.max(safeHeadIndexAltitude, isHeadAngleChange ? safeHeadIndexAltitude : zClearance);
          const exitPos = isYAxis
            ? new THREE.Vector3(prev.position.x, retractY, prev.position.z)
            : new THREE.Vector3(prev.position.x, prev.position.y, retractY);
          dest.push(makeWp(exitPos, 'RETRACT', next.featureId, next.balloon, prevDir, prevLabel, 'RETRACT_TO_SAFE', 150.0));

          if (isHeadAngleChange) {
            dest.push(makeWp(exitPos.clone(), 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel, 'HEAD_ROTATION', 150.0));
          }

          const rotationPos = isYAxis
            ? new THREE.Vector3(next.position.x, retractY, next.position.z)
            : new THREE.Vector3(next.position.x, next.position.y, retractY);
          dest.push(makeWp(rotationPos, 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel, 'SAFE_TRAVERSE', 150.0));

          const plungeTarget = next.position.clone();
          const safeTraverseTarget = isYAxis
            ? new THREE.Vector3(plungeTarget.x, zClearance, plungeTarget.z)
            : new THREE.Vector3(plungeTarget.x, plungeTarget.y, zClearance);
          dest.push(makeWp(safeTraverseTarget, 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel, 'SAFE_TRAVERSE', 150.0));
          dest.push(makeWp(plungeTarget, 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel, 'PLUNGE_TO_ENTRY', 80.0));
        } else {
          const currentHeight = isYAxis ? prev.position.y : prev.position.z;
          const nextHeight = isYAxis ? next.position.y : next.position.z;
          const isAtSafeZ = Math.abs(currentHeight - zClearance) < 1.0;

          if (!isAtSafeZ) {
            const liftPos = isYAxis
              ? new THREE.Vector3(prev.position.x, zClearance, prev.position.z)
              : new THREE.Vector3(prev.position.x, prev.position.y, zClearance);
            dest.push(makeWp(liftPos, 'RETRACT', next.featureId, next.balloon, prevDir, prevLabel, 'RETRACT_TO_SAFE', 150.0));
          }

          const overheadNext = isYAxis
            ? new THREE.Vector3(next.position.x, zClearance, next.position.z)
            : new THREE.Vector3(next.position.x, next.position.y, zClearance);
          dest.push(makeWp(overheadNext, 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel, 'SAFE_TRAVERSE', 150.0));

          if (Math.abs(nextHeight - zClearance) >= 0.5) {
            dest.push(makeWp(next.position.clone(), 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel, 'PLUNGE_TO_ENTRY', 80.0));
          }
        }
      }
      for (const wp of nextWps) {
        dest.push(wp);
      }
    };

    const holeExclusions: Array<{ x: number; z: number; r: number }> = [];
    for (const f of opFeatures) {
      if (f.type === 'DIAMETER' || f.cad_feature_id?.startsWith('CAD_HOLE_') || f.feature_type === 'INTERNAL_CYLINDER') {
        const rEx = Math.max(1.5, (f.nominal || 3.0) / 2 + 4.0);
        if (f.cad_instances?.length) {
          for (const inst of f.cad_instances) {
            holeExclusions.push({ x: inst.center[0], z: isYAxis ? inst.center[2] : inst.center[1], r: rEx });
          }
        } else if (f.cad_center) {
          holeExclusions.push({ x: f.cad_center[0], z: isYAxis ? f.cad_center[2] : f.cad_center[1], r: rEx });
        }
      }
    }

    const maskPointFromHoles = (px: number, pz: number, margin = 5.0): [number, number] => {
      let x = px;
      let z = pz;
      for (const h of holeExclusions) {
        const d = Math.hypot(x - h.x, z - h.z);
        if (d < h.r) {
          const dx = d > 0.05 ? (x - h.x) / d : 1.0;
          const dz = d > 0.05 ? (z - h.z) / d : 0.0;
          x = h.x + dx * (h.r + 1.5);
          z = h.z + dz * (h.r + 1.5);
        }
      }
      const minX = bbox.min[0] + margin;
      const maxX = bbox.max[0] - margin;
      const minZ = (isYAxis ? bbox.min[2] : bbox.min[1]) + margin;
      const maxZ = (isYAxis ? bbox.max[2] : bbox.max[1]) - margin;
      return [
        Math.max(minX, Math.min(maxX, x)),
        Math.max(minZ, Math.min(maxZ, z)),
      ];
    };

    if (isYAxis && options.includeDatumSetup) {
      const minX = bbox.min[0];
      const maxX = bbox.max[0];
      const minZ = bbox.min[2];
      const maxZ = bbox.max[2];
      const sizeX = Math.max(8.0, maxX - minX);
      const sizeZ = Math.max(8.0, maxZ - minZ);

      let inferredPlateTopY = yMaxPart;
      for (const f of opFeatures) {
        if (f.axial_max !== undefined && f.axial_max > yMinPart + 0.5 && f.axial_max < inferredPlateTopY) {
          inferredPlateTopY = f.axial_max;
        }
      }
      const datumAY = inferredPlateTopY;
      const edgeY = yMinPart + Math.min(1.2, Math.max(0.6, (datumAY - yMinPart) * 0.45));

      const customDatums = options.datumSurfacePoints;
      const customA = customDatums?.filter((d) => d.balloon === 'DATUM_A') ?? [];
      const customB = customDatums?.filter((d) => d.balloon === 'DATUM_B') ?? [];
      const customC = customDatums?.filter((d) => d.balloon === 'DATUM_C') ?? [];

      const rawA: Array<[number, number]> = [
        maskPointFromHoles(minX + sizeX * 0.22, minZ + sizeZ * 0.24, 5.0),
        maskPointFromHoles(maxX - sizeX * 0.22, minZ + sizeZ * 0.24, 5.0),
        maskPointFromHoles(partCx, maxZ - sizeZ * 0.24, 5.0),
      ];

      const ptsA: Array<[number, number, number]> =
        customA.length > 0
          ? customA.map((d) => d.position)
          : rawA.map(([ax, az]) => [ax, datumAY, az]);

      const datumWps: ExtendedWaypoint[] = [];
      for (let i = 0; i < ptsA.length; i++) {
        const [ax, ay, az] = ptsA[i];
        const tipY = ay + probeTipRadius;
        datumWps.push(makeWp(new THREE.Vector3(ax, zClearance, az), 'TRAVERSE', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, tipY + approachDist, az), 'TRAVERSE', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, tipY, az), 'TOUCH', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, tipY + retractDist, az), 'RETRACT', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'RETRACT', 50.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, zClearance, az), 'RETRACT', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
        datumTouchPoints.push({
          position: [ax, ay, az],
          surfacePoint: [ax, ay, az],
          tipCenterPosition: [ax, tipY, az],
          normal: [0, 1, 0],
          ph10Label: 'A0° B0°',
          label: `DATUM_A #${i + 1}`,
          isDatum: true,
        });
      }

      const insetZ = Math.max(5.0, sizeZ * 0.24);
      const ptsB: Array<[number, number, number]> =
        customB.length > 0
          ? customB.map((d) => d.position)
          : [
              [minX, edgeY, minZ + insetZ],
              [minX, edgeY, maxZ - insetZ],
            ];
      for (let i = 0; i < ptsB.length; i++) {
        const [bx, by, bz] = ptsB[i];
        const tipX = bx - probeTipRadius;
        const standX = tipX - approachDist;
        const retX = tipX - retractDist;
        datumWps.push(makeWp(new THREE.Vector3(standX, zClearance, bz), 'TRAVERSE', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
        datumWps.push(makeWp(new THREE.Vector3(standX, by, bz), 'TRAVERSE', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
        datumWps.push(makeWp(new THREE.Vector3(tipX, by, bz), 'TOUCH', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
        datumWps.push(makeWp(new THREE.Vector3(retX, by, bz), 'RETRACT', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'RETRACT', 50.0));
        datumWps.push(makeWp(new THREE.Vector3(standX, zClearance, bz), 'RETRACT', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
        datumTouchPoints.push({
          position: [bx, by, bz],
          surfacePoint: [bx, by, bz],
          tipCenterPosition: [tipX, by, bz],
          normal: [-1, 0, 0],
          ph10Label: 'A0° B0°',
          label: `DATUM_B #${i + 1}`,
          isDatum: true,
        });
      }

      const [cxEdge, cyEdge, czEdge] =
        customC.length > 0 ? customC[0].position : [partCx, edgeY, minZ];
      const tipZ = czEdge - probeTipRadius;
      const standZ = tipZ - approachDist;
      const retZ = tipZ - retractDist;
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, zClearance, standZ), 'TRAVERSE', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, cyEdge, standZ), 'TRAVERSE', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, cyEdge, tipZ), 'TOUCH', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, cyEdge, retZ), 'RETRACT', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'RETRACT', 50.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, zClearance, standZ), 'RETRACT', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
      datumTouchPoints.push({
        position: [cxEdge, cyEdge, czEdge],
        surfacePoint: [cxEdge, cyEdge, czEdge],
        tipCenterPosition: [cxEdge, cyEdge, tipZ],
        normal: [0, 0, -1],
        ph10Label: 'A0° B0°',
        label: 'DATUM_C #1 (Sıfır Noktası)',
        isDatum: true,
      });

      bridgeTransition(allWaypoints, datumWps);
      currentAngleLabel = 'A0° B0°';
    }

    for (const feat of opFeatures) {
      const baseCenter = feat.cad_center ?? (isYAxis
        ? [partCx, Math.max(0, bbox.max[1]), partCz]
        : [partCx, partCy, bbox.max[2]]);
      const baseNormal = feat.cad_normal ?? (isYAxis ? [0, 1, 0] : [0, 0, 1]);
      const isDiameter =
        feat.type === 'DIAMETER' ||
        feat.type === 'THREAD' ||
        /dia|çap|delik|diş|thread/i.test(feat.type_label ?? '');
      const nom = feat.nominal;
      const cadId = feat.cad_feature_id ?? '';
      const isInternalHole =
        (feat as { cylinder_polarity?: string }).cylinder_polarity === 'INTERNAL_BORE' ||
        cadId.startsWith('CAD_HOLE_') ||
        feat.feature_type === 'INTERNAL_CYLINDER' ||
        feat.type === 'THREAD' ||
        /delik|hole|bore|m[0-9]|diş|thread/i.test(feat.type_label ?? '');

      const rawCountMatch = feat.type_label?.match(/([2-9]|1[0-9])x/i) || feat.nominal_str?.match(/([2-9]|1[0-9])x/i);
      const expectedCount = rawCountMatch ? parseInt(rawCountMatch[1], 10) : (feat.cad_instances?.length || 1);

      let instances: PathFeatureInstance[] =
        feat.cad_instances && feat.cad_instances.length > 0
          ? [...feat.cad_instances]
          : [
              {
                center: [baseCenter[0], baseCenter[1], baseCenter[2]],
                normal: [baseNormal[0], baseNormal[1], baseNormal[2]],
                axial_min: feat.axial_min,
                axial_max: feat.axial_max,
                stem_blocked: feat.stem_blocked,
              },
            ];

      if (expectedCount > instances.length && isInternalHole) {
        const base = instances[0];
        const halfX = Math.abs(base.center[0]) > 1.0 ? Math.abs(base.center[0]) : Math.max(5.0, (bbox.max[0] - bbox.min[0]) * 0.25);
        const halfZ = Math.abs(base.center[2]) > 1.0 ? Math.abs(base.center[2]) : Math.max(5.0, (bbox.max[2] - bbox.min[2]) * 0.25);
        const cy = base.center[1];

        if (expectedCount === 4) {
          instances = [
            { ...base, center: [halfX, cy, halfZ] },
            { ...base, center: [-halfX, cy, halfZ] },
            { ...base, center: [-halfX, cy, -halfZ] },
            { ...base, center: [halfX, cy, -halfZ] },
          ];
        } else if (expectedCount === 2) {
          instances = [
            { ...base, center: [base.center[0], cy, halfZ] },
            { ...base, center: [base.center[0], cy, -halfZ] },
          ];
        } else if (expectedCount === 3) {
          instances = [
            { ...base, center: [base.center[0], cy, -halfZ] },
            { ...base, center: [base.center[0], cy, 0] },
            { ...base, center: [base.center[0], cy, halfZ] },
          ];
        }
      }

      for (const inst of instances) {
        if (inst.center[0] < bbox.min[0] - 1.0 || inst.center[0] > bbox.max[0] + 1.0) {
          inst.center[0] = Math.max(bbox.min[0], Math.min(bbox.max[0], inst.center[0]));
        }
        if (isYAxis) {
          if (inst.center[1] < yMinFloor || inst.center[1] > bbox.max[1] + 1.0) {
            inst.center[1] = Math.max(yMinFloor, Math.min(bbox.max[1], inst.center[1]));
          }
          if (inst.center[2] < bbox.min[2] - 1.0 || inst.center[2] > bbox.max[2] + 1.0) {
            inst.center[2] = Math.max(bbox.min[2], Math.min(bbox.max[2], inst.center[2]));
          }
        }
      }

      const featWaypoints: ExtendedWaypoint[] = [];
      const touchRecords: TouchPointRecord[] = [];

      const isThreadFeat =
        feat.type === 'THREAD' ||
        /diş|thread|\bm[0-9]|unf|unc/i.test(feat.type_label ?? '') ||
        /diş|thread|\bm[0-9]/i.test(feat.balloon);
      const effectiveHoleDia = isThreadFeat && nom > 0.5
        ? Math.max(0.8, nom - 1.082532 * (feat.pitch ?? lookupMetricPitch(nom)))
        : nom;
      const holeStylusChoice =
        isDiameter && nom > 0.5 && isInternalHole
          ? selectStylusForHole(effectiveHoleDia, probeTipRadius * 2.0)
          : null;
      if (holeStylusChoice?.changedFromDefault) {
        stylusRecommendations.push({
          ...holeStylusChoice,
          recommendedModel: holeStylusChoice.recommendedModel || 'PH10M (Ø1x20)',
          recommended_stylus: holeStylusChoice.recommended_stylus || 'Ø1x20',
          recommendedEwlMm: 20.0,
          reason: `Delik çapı (Ø${effectiveHoleDia.toFixed(2)} mm) mevcut Ø${(probeTipRadius * 2).toFixed(1)} mm prob ile uyumlu değil; Ø1x20 mikro prob atandı.`,
          featureId: feat.id,
          balloon: feat.balloon,
          holeDiameterMm: nom,
        });
      }
      const activeTipRadius = holeStylusChoice?.changedFromDefault
        ? holeStylusChoice.ballDiameterMm / 2.0
        : probeTipRadius;

      let effectiveAngleObj = isYAxis
        ? ({ aDeg: 0, bDeg: 0, direction: [0, -1, 0], label: 'A0° B0°' } as PH10Angle)
        : Ph10Kinematics.findBestAngle([-baseNormal[0], -baseNormal[1], -baseNormal[2]]).angle;
      let effectiveAngleLabel = effectiveAngleObj.label;

      for (let instIdx = 0; instIdx < instances.length; instIdx++) {
        const inst = instances[instIdx];
        const subBalloon = instances.length > 1 ? `${feat.balloon}.${instIdx + 1}` : feat.balloon;
        const center: [number, number, number] = [inst.center[0], inst.center[1], inst.center[2]];
        const normal: [number, number, number] = [inst.normal[0], inst.normal[1], inst.normal[2]];

        if (inst.axial_min !== undefined && inst.axial_max !== undefined && isYAxis) {
          const midAx = (inst.axial_min + inst.axial_max) / 2;
          center[1] = Math.max(yMinPart, Math.min(yMaxPart, midAx));
        }

        const isExtCyl =
          (feat as { cylinder_polarity?: string }).cylinder_polarity === 'EXTERNAL_BOSS' ||
          feat.feature_type === 'EXTERNAL_CYLINDER' ||
          cadId.startsWith('CAD_CYL_') ||
          cadId.startsWith('CAD_CONE_') ||
          (isYAxis &&
            isDiameter &&
            nom > 24.0 &&
            !cadId.startsWith('CAD_HOLE_') &&
            !isInternalHole);

        const partHeight = Math.max(1.0, yMaxPart - yMinPart);
        const isDeepFeature = isYAxis && (yMaxPart - center[1] > 18.0 || partHeight > 28.0);

        if (isYAxis && isExtCyl && nom > 0.5) {
          const useHorizHead = isDeepFeature || nom > 45.0;
          effectiveAngleLabel = useHorizHead ? 'A0° B90°' : 'A0° B0°';
          effectiveAngleObj = useHorizHead
            ? { aDeg: 0, bDeg: 90, direction: [-1, 0, 0], label: 'A0° B90°' }
            : { aDeg: 0, bDeg: 0, direction: [0, -1, 0], label: 'A0° B0°' };

          const radius = nom / 2.0;
          const cy = Math.max(yMinPart + 1.5, Math.min(yMaxPart - 1.5, center[1]));
          const cx = Math.hypot(center[0], center[2]) < 3.0 ? 0 : center[0];
          const cz = Math.hypot(center[0], center[2]) < 3.0 ? 0 : center[2];
          const ringSafeR = Math.max(safeOuterR, radius + approachDist + 6.0);

          const dirs = [
            { ux: 1, uz: 0 },
            { ux: 0, uz: 1 },
            { ux: -1, uz: 0 },
            { ux: 0, uz: -1 },
          ];

          featWaypoints.push(
            makeWp(
              new THREE.Vector3(cx + ringSafeR, zClearance, cz),
              'TRAVERSE',
              feat.id,
              subBalloon,
              useHorizHead ? [-1, 0, 0] : [0, -1, 0],
              effectiveAngleLabel,
              'SAFE_TRAVERSE',
              150.0
            )
          );

          for (let idx = 0; idx < dirs.length; idx++) {
            const d = dirs[idx];
            const sDir: [number, number, number] = useHorizHead ? [-d.ux, 0, -d.uz] : [0, -1, 0];
            const standPos = new THREE.Vector3(cx + d.ux * (radius + probeTipRadius + approachDist), cy, cz + d.uz * (radius + probeTipRadius + approachDist));
            const touchPos = new THREE.Vector3(cx + d.ux * (radius + probeTipRadius), cy, cz + d.uz * (radius + probeTipRadius));
            const retPos = new THREE.Vector3(cx + d.ux * (radius + probeTipRadius + retractDist), cy, cz + d.uz * (radius + probeTipRadius + retractDist));
            const surfPos: [number, number, number] = [cx + d.ux * radius, cy, cz + d.uz * radius];

            featWaypoints.push(makeWp(standPos, 'TRAVERSE', feat.id, subBalloon, sDir, effectiveAngleLabel, 'APPROACH', 80.0));
            featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, subBalloon, sDir, effectiveAngleLabel, 'TOUCH', 5.0));
            featWaypoints.push(makeWp(retPos, 'RETRACT', feat.id, subBalloon, sDir, effectiveAngleLabel, 'RETRACT', 50.0));

            touchRecords.push({
              position: surfPos,
              surfacePoint: surfPos,
              tipCenterPosition: [touchPos.x, touchPos.y, touchPos.z],
              normal: [d.ux, 0, d.uz],
              ph10Label: effectiveAngleLabel,
            });
          }

          featWaypoints.push(
            makeWp(
              new THREE.Vector3(cx, zClearance, cz),
              'RETRACT',
              feat.id,
              subBalloon,
              useHorizHead ? [0, 0, 1] : [0, -1, 0],
              effectiveAngleLabel,
              'RETRACT_TO_SAFE',
              150.0
            )
          );
        } else if (isDiameter && nom > 0.5 && isInternalHole) {
          const isSideCrossHole =
            isYAxis && (inst.stem_blocked === true || (Math.abs(normal[1]) < 0.5 && center[1] < yMaxPart - 3.0));

          if (isSideCrossHole) {
            effectiveAngleLabel = 'A0° B90°';
            effectiveAngleObj = { aDeg: 0, bDeg: 90, direction: [-1, 0, 0], label: 'A0° B90°' };
            const radius = Math.min(nom / 2, 20.0);
            const cy = Math.max(yMinPart + 2.0, center[1]);
            const rHoriz = Math.hypot(center[0], center[2]);
            const ux = rHoriz > 1.0 ? center[0] / rHoriz : 1.0;
            const uz = rHoriz > 1.0 ? center[2] / rHoriz : 0.0;
            const tx = center[0];
            const tz = center[2];
            const sDir: [number, number, number] = [-ux, 0, -uz];

            const entryOut = new THREE.Vector3(ux * safeOuterR, cy, uz * safeOuterR);
            const holeCenter = new THREE.Vector3(tx, cy, tz);

            featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, zClearance, uz * safeOuterR), 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'SAFE_TRAVERSE', 150.0));
            featWaypoints.push(makeWp(entryOut.clone(), 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'PLUNGE_TO_ENTRY', 80.0));
            featWaypoints.push(makeWp(holeCenter.clone(), 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'AXIAL_ENTRY', 20.0));

            const perpX = -uz;
            const perpZ = ux;
            const holeDirs = [
              { dy: 1, dp: 0 },
              { dy: 0, dp: 1 },
              { dy: -1, dp: 0 },
              { dy: 0, dp: -1 },
            ];
            for (const hd of holeDirs) {
              const tp = new THREE.Vector3(
                tx + perpX * hd.dp * radius,
                cy + hd.dy * radius,
                tz + perpZ * hd.dp * radius
              );
              featWaypoints.push(makeWp(tp.clone(), 'TOUCH', feat.id, subBalloon, sDir, 'A0° B90°', 'TOUCH', 5.0));
              featWaypoints.push(makeWp(holeCenter.clone(), 'RETRACT', feat.id, subBalloon, sDir, 'A0° B90°', 'RETRACT', 50.0));
              touchRecords.push({
                position: [tp.x, tp.y, tp.z],
                normal: [-perpX * hd.dp, -hd.dy, -perpZ * hd.dp],
                ph10Label: 'A0° B90°',
              });
            }

            featWaypoints.push(makeWp(entryOut.clone(), 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'AXIAL_EXIT', 50.0));
            featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, zClearance, uz * safeOuterR), 'RETRACT', feat.id, subBalloon, sDir, 'A0° B90°', 'RETRACT_TO_SAFE', 150.0));
          } else {
            const isThread =
              feat.type === 'THREAD' ||
              /diş|thread|\bm[0-9]|unf|unc/i.test(feat.type_label ?? '') ||
              /diş|thread|\bm[0-9]/i.test(feat.balloon);
            let effectiveNominal = nom;
            let threadPitch = feat.pitch;
            if (isThread) {
              if (!threadPitch) {
                threadPitch = lookupMetricPitch(nom);
              }
              effectiveNominal = Math.max(0.8, nom - 1.082532 * threadPitch);
            }
            const radius = Math.min(effectiveNominal / 2, 40.0);
            effectiveAngleLabel = 'A0° B0°';
            effectiveAngleObj = { aDeg: 0, bDeg: 0, direction: isYAxis ? [0, -1, 0] : [0, 0, -1], label: 'A0° B0°' };

            const partBottom = isYAxis ? yMinPart : zMinPart;
            const partTop = isYAxis ? yMaxPart : zMaxPart;
            const rawHoleTop =
              inst.axial_max !== undefined
                ? Math.min(partTop, Math.max(partBottom, inst.axial_max))
                : partTop;
            const rawHoleBottom =
              inst.axial_min !== undefined
                ? Math.max(partBottom, Math.min(partTop, inst.axial_min))
                : partBottom;
            const hasValidHoleSpan = rawHoleTop - rawHoleBottom >= 0.5;
            const holeTop = hasValidHoleSpan ? rawHoleTop : partTop;
            const holeBottom = hasValidHoleSpan ? rawHoleBottom : partBottom;
            const holeDepth = Math.max(1.0, holeTop - holeBottom);
            if (holeDepth > stylusEwl - 2.0) {
              stylusRecommendations.push({
                ballDiameterMm: 3.0,
                feasible: true,
                recommendedModel: 'PH10M Ø3x50',
                recommendedEwlMm: 50.0,
                changedFromDefault: true,
                reason: `Delik derinliği (${holeDepth.toFixed(1)} mm) mevcut EWL (${stylusEwl} mm) sınırını aşıyor.`,
                featureId: feat.id,
                balloon: feat.balloon,
                holeDiameterMm: nom,
              });
            }

            const isBlindHole = Boolean(
              (inst as { is_blind?: boolean }).is_blind ||
              feat.is_blind ||
              (inst as { floor_z?: number }).floor_z !== undefined ||
              feat.floor_z !== undefined
            );
            const rawFloorZ = (inst as { floor_z?: number }).floor_z ?? feat.floor_z ?? holeBottom;
            const floorZ = Math.max(partBottom, Math.min(holeTop - 0.5, rawFloorZ));
            const minSafeAltitude = isBlindHole
              ? floorZ + activeTipRadius + 2.0
              : holeBottom + 0.2;
            const measOffset = Math.min(holeDepth * 0.5, Math.max(3.0, effectiveNominal * 0.4));
            const measAltitude = Math.max(minSafeAltitude, holeTop - measOffset);

            const cx = center[0];
            const cz = isYAxis ? center[2] : center[1];
            const pAbove = isYAxis
              ? new THREE.Vector3(cx, holeTop + 12.0, cz)
              : new THREE.Vector3(cx, cz, holeTop + 12.0);
            const pCenterDepth = isYAxis
              ? new THREE.Vector3(cx, measAltitude, cz)
              : new THREE.Vector3(cx, cz, measAltitude);

            const overheadPos = isYAxis
              ? new THREE.Vector3(cx, zClearance, cz)
              : new THREE.Vector3(cx, cz, zClearance);

            featWaypoints.push(makeWp(overheadPos.clone(), 'TRAVERSE', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
            featWaypoints.push(makeWp(pAbove.clone(), 'TRAVERSE', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'PLUNGE_TO_ENTRY', 80.0));
            featWaypoints.push(makeWp(pCenterDepth.clone(), 'TRAVERSE', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'AXIAL_ENTRY', 20.0));

            const pointCount = 4;
            const dApp = Math.min(radius * 0.45, 3.0);
            const isSmallHole = radius <= 3.5;

            for (let i = 0; i < pointCount; i++) {
              const theta = (i * 2 * Math.PI) / pointCount;
              const cosT = Math.cos(theta);
              const sinT = Math.sin(theta);
              const helicalDelta = isThread && threadPitch ? (i / pointCount) * threadPitch : 0;
              const pointMeasAlt = Math.max(minSafeAltitude, Math.min(holeTop - 0.5, measAltitude + helicalDelta));

              const centerRadius = Math.max(0.1, radius - activeTipRadius);
              const surfPos: [number, number, number] = isYAxis
                ? [cx + radius * cosT, pointMeasAlt, cz + radius * sinT]
                : [cx + radius * cosT, cz + radius * sinT, pointMeasAlt];

              const touchPos = isYAxis
                ? new THREE.Vector3(cx + centerRadius * cosT, pointMeasAlt, cz + centerRadius * sinT)
                : new THREE.Vector3(cx + centerRadius * cosT, cz + centerRadius * sinT, pointMeasAlt);

              const normalVec: [number, number, number] = isYAxis
                ? [-cosT, 0, -sinT]
                : [-cosT, -sinT, 0];

              if (isSmallHole) {
                featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'TOUCH', 5.0));
                featWaypoints.push(makeWp(pCenterDepth.clone(), 'RETRACT', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'RETRACT', 50.0));
              } else {
                const appRadius = Math.max(0.05, centerRadius - dApp);
                const appPos = isYAxis
                  ? new THREE.Vector3(cx + appRadius * cosT, pointMeasAlt, cz + appRadius * sinT)
                  : new THREE.Vector3(cx + appRadius * cosT, cz + appRadius * sinT, pointMeasAlt);

                featWaypoints.push(makeWp(appPos.clone(), 'TRAVERSE', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'APPROACH', 20.0));
                featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'TOUCH', 5.0));
                featWaypoints.push(makeWp(appPos.clone(), 'RETRACT', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'RETRACT', 50.0));
                featWaypoints.push(makeWp(pCenterDepth.clone(), 'TRAVERSE', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'APPROACH', 50.0));
              }

              touchRecords.push({
                position: surfPos,
                surfacePoint: surfPos,
                tipCenterPosition: [touchPos.x, touchPos.y, touchPos.z],
                normal: normalVec,
                ph10Label: 'A0° B0°',
              });
            }

            featWaypoints.push(makeWp(pCenterDepth.clone(), 'TRAVERSE', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'APPROACH', 50.0));
            featWaypoints.push(makeWp(pAbove.clone(), 'TRAVERSE', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'AXIAL_EXIT', 50.0));
            featWaypoints.push(makeWp(overheadPos.clone(), 'RETRACT', feat.id, subBalloon, effectiveAngleObj.direction, 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
          }
        } else if (isYAxis && (cadId === 'CAD_BBOX_Y' || Math.abs((yMaxPart - yMinPart) - nom) <= 1.5)) {
          effectiveAngleLabel = 'A0° B0°';
          effectiveAngleObj = { aDeg: 0, bDeg: 0, direction: [0, -1, 0], label: 'A0° B0°' };

          const topTouch: [number, number, number] = [partCx, yMaxPart, partCz];
          const tipCenterPos = new THREE.Vector3(partCx, yMaxPart + probeTipRadius, partCz);
          const topStand = new THREE.Vector3(partCx, yMaxPart + probeTipRadius + approachDist, partCz);
          const topRet = new THREE.Vector3(partCx, yMaxPart + probeTipRadius + retractDist, partCz);

          featWaypoints.push(makeWp(new THREE.Vector3(partCx, zClearance, partCz), 'TRAVERSE', feat.id, subBalloon, [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(topStand, 'TRAVERSE', feat.id, subBalloon, [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(tipCenterPos.clone(), 'TOUCH', feat.id, subBalloon, [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
          featWaypoints.push(makeWp(topRet, 'RETRACT', feat.id, subBalloon, [0, -1, 0], 'A0° B0°', 'RETRACT', 50.0));
          featWaypoints.push(makeWp(new THREE.Vector3(partCx, zClearance, partCz), 'RETRACT', feat.id, subBalloon, [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));

          touchRecords.push({
            position: topTouch,
            surfacePoint: topTouch,
            tipCenterPosition: [tipCenterPos.x, tipCenterPos.y, tipCenterPos.z],
            normal: [0, 1, 0],
            ph10Label: 'A0° B0°',
          });
        } else if (isYAxis && isDeepFeature && Math.abs(normal[1]) < 0.35 && (Math.abs(normal[0]) > 0.7 || Math.abs(normal[2]) > 0.7)) {
          effectiveAngleLabel = 'A0° B90°';
          effectiveAngleObj = { aDeg: 0, bDeg: 90, direction: [-1, 0, 0], label: 'A0° B90°' };

          const cy = Math.max(yMinFloor + 1.2, center[1]);
          const ux = Math.abs(normal[0]) > 0.1 ? Math.sign(normal[0]) : 1.0;
          const uz = Math.abs(normal[2]) > 0.1 ? Math.sign(normal[2]) : 0.0;
          const tx = center[0];
          const tz = center[2];
          const sDir: [number, number, number] = [-ux, 0, -uz];

          const surfPos: [number, number, number] = [tx, cy, tz];
          const tipCenterPos = new THREE.Vector3(tx + ux * probeTipRadius, cy, tz + uz * probeTipRadius);
          const standPos = new THREE.Vector3(tx + ux * (probeTipRadius + approachDist), cy, tz + uz * (probeTipRadius + approachDist));
          const retPos = new THREE.Vector3(tx + ux * (probeTipRadius + retractDist), cy, tz + uz * (probeTipRadius + retractDist));
          const outOverhead = new THREE.Vector3(ux * safeOuterR, zClearance, uz * safeOuterR);
          const outLevel = new THREE.Vector3(ux * safeOuterR, cy, uz * safeOuterR);

          featWaypoints.push(makeWp(outOverhead.clone(), 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(outLevel.clone(), 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(standPos, 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(tipCenterPos.clone(), 'TOUCH', feat.id, subBalloon, sDir, 'A0° B90°', 'TOUCH', 5.0));
          featWaypoints.push(makeWp(retPos, 'RETRACT', feat.id, subBalloon, sDir, 'A0° B90°', 'RETRACT', 50.0));
          featWaypoints.push(makeWp(outLevel.clone(), 'TRAVERSE', feat.id, subBalloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(outOverhead.clone(), 'RETRACT', feat.id, subBalloon, sDir, 'A0° B90°', 'RETRACT_TO_SAFE', 150.0));

          touchRecords.push({
            position: surfPos,
            surfacePoint: surfPos,
            tipCenterPosition: [tipCenterPos.x, tipCenterPos.y, tipCenterPos.z],
            normal: [ux, 0, uz],
            ph10Label: 'A0° B90°',
          });
        } else if (feat.faceA_center && feat.faceB_center) {
          const fnA = feat.faceA_normal || normal;
          let cB = feat.faceB_center;
          const isVirtualOrZero = !cB || (Math.abs(cB[0]) < 0.05 && Math.abs(cB[1]) < 0.05 && Math.abs(cB[2]) < 0.05);
          if (isVirtualOrZero) {
            cB = [
              feat.faceA_center[0] - fnA[0] * nom,
              feat.faceA_center[1] - fnA[1] * nom,
              feat.faceA_center[2] - fnA[2] * nom,
            ];
          }
          const fnB = feat.faceB_normal || (isVirtualOrZero ? fnA : [-fnA[0], -fnA[1], -fnA[2]]);
          const facesToTouch = [
            { c: feat.faceA_center, n: fnA },
            { c: cB, n: fnB },
          ];
          for (let fIdx = 0; fIdx < facesToTouch.length; fIdx++) {
            const fc = facesToTouch[fIdx];
            const fn = fc.n;
            if (isYAxis && activeOp === 'OP10' && fn[1] < -0.35) {
              continue;
            }
            if (isYAxis && activeOp === 'OP20' && fn[1] > 0.35) {
              continue;
            }
            let touchY = isYAxis ? Math.max(yMinPart + 1.0, Math.min(yMaxPart, fc.c[1])) : fc.c[1];
            let touchX = fc.c[0];
            let touchZ = fc.c[2];

            for (const cb of clampBoxes) {
              if (SetupPrep.isPointInsideClampBox([touchX, touchY, touchZ], cb, 5.0)) {
                if (touchX < 0) touchX = cb.max[0] + 6.0;
                else touchX = cb.min[0] - 6.0;
              }
            }
            const surfPoint: [number, number, number] = [touchX, touchY, touchZ];
            const tAngleObj = isYAxis
              ? (fn[1] > 0.5 ? { aDeg: 0, bDeg: 0, direction: [0, -1, 0], label: 'A0° B0°' } : (Math.abs(fn[1]) > 0.7 ? { aDeg: 0, bDeg: 0, direction: [0, -1, 0], label: 'A0° B0°' } : Ph10Kinematics.findBestAngle([-fn[0], -fn[1], -fn[2]]).angle))
              : Ph10Kinematics.findBestAngle([-fn[0], -fn[1], -fn[2]]).angle;

            const tipCenterPos = new THREE.Vector3(
              touchX + fn[0] * probeTipRadius,
              isYAxis ? Math.max(yMinPart + 1.0, touchY + fn[1] * probeTipRadius) : touchY + fn[1] * probeTipRadius,
              touchZ + fn[2] * probeTipRadius
            );
            const standoffPos = new THREE.Vector3(
              touchX + fn[0] * (probeTipRadius + approachDist),
              isYAxis ? Math.max(yMinPart + 1.0, touchY + fn[1] * (probeTipRadius + approachDist)) : touchY + fn[1] * (probeTipRadius + approachDist),
              touchZ + fn[2] * (probeTipRadius + approachDist)
            );
            const retractPos = new THREE.Vector3(
              touchX + fn[0] * (probeTipRadius + retractDist),
              isYAxis ? Math.max(yMinPart + 1.0, touchY + fn[1] * (probeTipRadius + retractDist)) : touchY + fn[1] * (probeTipRadius + retractDist),
              touchZ + fn[2] * (probeTipRadius + retractDist)
            );

            const overheadPos = isYAxis
              ? new THREE.Vector3(standoffPos.x, zClearance, standoffPos.z)
              : new THREE.Vector3(standoffPos.x, standoffPos.y, zClearance);

            featWaypoints.push(makeWp(overheadPos.clone(), 'TRAVERSE', feat.id, subBalloon, tAngleObj.direction as [number, number, number], tAngleObj.label, 'SAFE_TRAVERSE', 150.0));
            featWaypoints.push(makeWp(standoffPos, 'TRAVERSE', feat.id, subBalloon, tAngleObj.direction as [number, number, number], tAngleObj.label, 'APPROACH', 80.0));
            featWaypoints.push(makeWp(tipCenterPos.clone(), 'TOUCH', feat.id, subBalloon, tAngleObj.direction as [number, number, number], tAngleObj.label, 'TOUCH', 5.0));
            featWaypoints.push(makeWp(retractPos, 'RETRACT', feat.id, subBalloon, tAngleObj.direction as [number, number, number], tAngleObj.label, 'RETRACT', 50.0));
            featWaypoints.push(makeWp(overheadPos.clone(), 'RETRACT', feat.id, subBalloon, tAngleObj.direction as [number, number, number], tAngleObj.label, 'RETRACT_TO_SAFE', 150.0));

            touchRecords.push({
              position: surfPoint,
              surfacePoint: surfPoint,
              tipCenterPosition: [tipCenterPos.x, tipCenterPos.y, tipCenterPos.z],
              normal: [fn[0], fn[1], fn[2]],
              ph10Label: tAngleObj.label,
            });
          }
        } else {
          let safeTouchY = isYAxis ? Math.max(yMinFloor + 0.5, Math.min(yMaxPart, center[1])) : center[1];
          if (isYAxis && (cadId === 'CAD_BBOX_X' || cadId === 'CAD_BBOX_Z')) {
            safeTouchY = yMinFloor + Math.min(1.2, Math.max(0.6, partHeight * 0.22));
          }
          let touchX = center[0];
          let touchZ = center[2];
          if (touchX < bbox.min[0] - 1.0 || touchX > bbox.max[0] + 1.0) {
            touchX = Math.max(bbox.min[0], Math.min(bbox.max[0], touchX));
          }
          if (touchZ < bbox.min[2] - 1.0 || touchZ > bbox.max[2] + 1.0) {
            touchZ = Math.max(bbox.min[2], Math.min(bbox.max[2], touchZ));
          }
          for (const cb of clampBoxes) {
            if (SetupPrep.isPointInsideClampBox([touchX, safeTouchY, touchZ], cb, 5.0)) {
              if (touchX < 0) touchX = cb.max[0] + 6.0;
              else touchX = cb.min[0] - 6.0;
            }
          }
          const surfPoint: [number, number, number] = [touchX, safeTouchY, touchZ];
          const tipCenterPos = new THREE.Vector3(
            touchX + normal[0] * probeTipRadius,
            isYAxis ? Math.max(yMinPart + 1.0, safeTouchY + normal[1] * probeTipRadius) : safeTouchY + normal[1] * probeTipRadius,
            touchZ + normal[2] * probeTipRadius
          );
          const standoffPos = new THREE.Vector3(
            touchX + normal[0] * (probeTipRadius + approachDist),
            isYAxis ? Math.max(yMinPart + 1.0, safeTouchY + normal[1] * (probeTipRadius + approachDist)) : safeTouchY + normal[1] * (probeTipRadius + approachDist),
            touchZ + normal[2] * (probeTipRadius + approachDist)
          );
          const retractPos = new THREE.Vector3(
            touchX + normal[0] * (probeTipRadius + retractDist),
            isYAxis ? Math.max(yMinPart + 1.0, safeTouchY + normal[1] * (probeTipRadius + retractDist)) : safeTouchY + normal[1] * (probeTipRadius + retractDist),
            touchZ + normal[2] * (probeTipRadius + retractDist)
          );

          const overheadPos = isYAxis
            ? new THREE.Vector3(standoffPos.x, zClearance, standoffPos.z)
            : new THREE.Vector3(standoffPos.x, standoffPos.y, zClearance);

          featWaypoints.push(makeWp(overheadPos.clone(), 'TRAVERSE', feat.id, subBalloon, [0, -1, 0], effectiveAngleObj.label, 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(standoffPos, 'TRAVERSE', feat.id, subBalloon, [0, -1, 0], effectiveAngleObj.label, 'APPROACH', 80.0));
          featWaypoints.push(makeWp(tipCenterPos.clone(), 'TOUCH', feat.id, subBalloon, [0, -1, 0], effectiveAngleObj.label, 'TOUCH', 5.0));
          featWaypoints.push(makeWp(retractPos, 'RETRACT', feat.id, subBalloon, [0, -1, 0], effectiveAngleObj.label, 'RETRACT', 50.0));
          featWaypoints.push(makeWp(overheadPos.clone(), 'RETRACT', feat.id, subBalloon, [0, -1, 0], effectiveAngleObj.label, 'RETRACT_TO_SAFE', 150.0));

          touchRecords.push({
            position: surfPoint,
            surfacePoint: surfPoint,
            tipCenterPosition: [tipCenterPos.x, tipCenterPos.y, tipCenterPos.z],
            normal: [normal[0], normal[1], normal[2]],
            ph10Label: effectiveAngleObj.label,
          });
        }
      }

      currentAngleLabel = effectiveAngleLabel;

      featurePaths.push({
        featureId: feat.id,
        balloon: feat.balloon,
        ph10Angle: effectiveAngleObj,
        touchPoints: touchRecords,
        waypoints: featWaypoints,
      });

      bridgeTransition(allWaypoints, featWaypoints);
    }

    const returnHome = homePos.clone();
    allWaypoints.push(makeWp(returnHome, 'TRAVERSE', undefined, undefined, isYAxis ? [0, -1, 0] : [0, 0, -1], currentAngleLabel || 'A0° B0°', 'HOME', 150.0));

    for (const wp of allWaypoints) {
      if (isYAxis) {
        if (wp.position.y < 0) wp.position.y = 0;
      } else {
        if (wp.position.z < 0) wp.position.z = 0;
      }
    }

    let totalDist = 0;
    let totalDuration = 0;
    for (let i = 0; i < allWaypoints.length - 1; i++) {
      const p1 = allWaypoints[i].position;
      const p2 = allWaypoints[i + 1].position;
      const dist = p1.distanceTo(p2);
      totalDist += dist;
      const wpNext = allWaypoints[i + 1];
      const feed = wpNext.feedRate ?? 150.0;
      totalDuration += computeSegmentTrapezoidalDuration(dist, feed, 450.0);
      if (wpNext.phase === 'TOUCH') {
        totalDuration += 0.25;
      }
      if (wpNext.subPhase === 'HEAD_ROTATION') {
        totalDuration += 1.80;
      }
    }

    return {
      operation: activeOp,
      zClearance,
      safeIndexZ: safeHeadIndexAltitude,
      featurePaths,
      allWaypoints,
      totalDistanceMm: parseFloat(totalDist.toFixed(2)),
      estimatedDurationSec: parseFloat((totalDuration + headRotations * 0.7).toFixed(1)),
      probeHeadRotations: headRotations,
      stylusRecommendations,
      datumTouchPoints,
      clampBoxes,
    };
  }
}
