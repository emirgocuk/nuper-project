import * as THREE from 'three';
import { type Waypoint, type ProbePhase } from '../SimulationController';
import { Ph10Kinematics, type PH10Angle } from './Ph10Kinematics';
import { orderFeaturesByMetrologyDiscipline } from './MeasurementPhases';
import { selectStylusForHole, type StylusChoice } from './StylusSelector';

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
  cad_center?: [number, number, number];
  cad_normal?: [number, number, number];
  cad_feature_id?: string;
  feature_type?: string;
  operation?: 'OP10' | 'OP20';
  axial_min?: number;
  axial_max?: number;
  stem_blocked?: boolean;
  cad_instances?: PathFeatureInstance[];
}

export interface TouchPointRecord {
  position: [number, number, number];
  normal: [number, number, number];
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
}

export interface PathGeneratorOptions {
  activeOperation?: 'OP10' | 'OP20';
  clearanceZMarginMm?: number;
  approachDistanceMm?: number;
  retractDistanceMm?: number;
  verticalAxis?: 'Y' | 'Z';
  includeDatumSetup?: boolean;
  datumSurfacePoints?: Array<{
    balloon: 'DATUM_A' | 'DATUM_B' | 'DATUM_C';
    position: [number, number, number];
    normal: [number, number, number];
    label: string;
  }>;
}

export class MeasurementPathGenerator {
  public static generatePlan(
    features: PathFeatureInput[],
    bbox: { min: [number, number, number]; max: [number, number, number] },
    options: PathGeneratorOptions = {}
  ): GeneratedMeasurementPlan {
    const activeOp = options.activeOperation ?? 'OP10';
    const isYAxis = options.verticalAxis === 'Y';
    const approachDist = options.approachDistanceMm ?? 8.0;
    const retractDist = options.retractDistanceMm ?? 5.0;

    const yMinPart = bbox.min[1] ?? 0;
    const yMaxPart = bbox.max[1] ?? 50;
    const zMinPart = bbox.min[2] ?? 0;
    const zMaxPart = bbox.max[2] ?? 50;
    const topAltitude = isYAxis ? yMaxPart : zMaxPart;
    const zMargin = options.clearanceZMarginMm ?? 25.0;
    const zClearance = parseFloat((topAltitude + zMargin).toFixed(2));
    const safeHeadIndexAltitude = parseFloat(
      (options.clearanceZMarginMm !== undefined ? zClearance + 20.0 : topAltitude + 50.0).toFixed(2)
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
      features.filter((f) => (f.operation ?? 'OP10') === activeOp),
      options.verticalAxis ?? 'Y'
    );

    const stylusRecommendations: StylusRecommendation[] = [];
    const featurePaths: FeatureMeasurementPath[] = [];
    const allWaypoints: ExtendedWaypoint[] = [];
    const datumTouchPoints: TouchPointRecord[] = [];

    const makeWp = (
      position: THREE.Vector3,
      phase: ProbePhase,
      featureId?: number,
      balloon?: string,
      stylusDir: [number, number, number] = isYAxis ? [0, -1, 0] : [0, 0, -1],
      ph10Label = 'A0° B0°',
      subPhase?: string,
      feedRate = 150.0
    ): ExtendedWaypoint => ({
      position,
      phase,
      featureId,
      balloon,
      stylusDir,
      ph10Label,
      subPhase,
      feedRate,
    });

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

        if (isHeadAngleChange) {
          headRotations++;
          const retractY = safeHeadIndexAltitude;
          const exitPos = isYAxis
            ? new THREE.Vector3(prev.position.x, retractY, prev.position.z)
            : new THREE.Vector3(prev.position.x, prev.position.y, retractY);
          dest.push(makeWp(exitPos, 'RETRACT', next.featureId, next.balloon, prevDir, prevLabel, 'RETRACT_TO_SAFE', 150.0));

          const rotationPos = isYAxis
            ? new THREE.Vector3(next.position.x, retractY, next.position.z)
            : new THREE.Vector3(next.position.x, next.position.y, retractY);
          dest.push(makeWp(rotationPos, 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel, 'HEAD_ROTATION', 150.0));

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
        datumWps.push(makeWp(new THREE.Vector3(ax, zClearance, az), 'TRAVERSE', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, ay + approachDist, az), 'TRAVERSE', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, ay, az), 'TOUCH', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, ay + retractDist, az), 'RETRACT', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'RETRACT', 50.0));
        datumWps.push(makeWp(new THREE.Vector3(ax, zClearance, az), 'RETRACT', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
        datumTouchPoints.push({
          position: [ax, ay, az],
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
        const standX = bx - approachDist;
        const retX = bx - retractDist;
        datumWps.push(makeWp(new THREE.Vector3(standX, zClearance, bz), 'TRAVERSE', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
        datumWps.push(makeWp(new THREE.Vector3(standX, by, bz), 'TRAVERSE', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
        datumWps.push(makeWp(new THREE.Vector3(bx, by, bz), 'TOUCH', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
        datumWps.push(makeWp(new THREE.Vector3(retX, by, bz), 'RETRACT', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'RETRACT', 50.0));
        datumWps.push(makeWp(new THREE.Vector3(standX, zClearance, bz), 'RETRACT', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
        datumTouchPoints.push({
          position: [bx, by, bz],
          normal: [-1, 0, 0],
          ph10Label: 'A0° B0°',
          label: `DATUM_B #${i + 1}`,
          isDatum: true,
        });
      }

      const [cxEdge, cyEdge, czEdge] =
        customC.length > 0 ? customC[0].position : [partCx, edgeY, minZ];
      const standZ = czEdge - approachDist;
      const retZ = czEdge - retractDist;
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, zClearance, standZ), 'TRAVERSE', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, cyEdge, standZ), 'TRAVERSE', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, cyEdge, czEdge), 'TOUCH', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, cyEdge, retZ), 'RETRACT', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'RETRACT', 50.0));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, zClearance, standZ), 'RETRACT', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
      datumTouchPoints.push({
        position: [cxEdge, cyEdge, czEdge],
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
      const instances: PathFeatureInstance[] =
        feat.cad_instances && feat.cad_instances.length > 0
          ? feat.cad_instances
          : [
              {
                center: [baseCenter[0], baseCenter[1], baseCenter[2]],
                normal: [baseNormal[0], baseNormal[1], baseNormal[2]],
                axial_min: feat.axial_min,
                axial_max: feat.axial_max,
                stem_blocked: feat.stem_blocked,
              },
            ];

      const featWaypoints: ExtendedWaypoint[] = [];
      const touchRecords: TouchPointRecord[] = [];

      const isDiameter = feat.type === 'DIAMETER' || /dia|çap|delik/i.test(feat.type_label ?? '');
      const nom = feat.nominal;
      const cadId = feat.cad_feature_id ?? '';
      const isInternalHole =
        cadId.startsWith('CAD_HOLE_') ||
        feat.feature_type === 'INTERNAL_CYLINDER' ||
        /delik|hole|bore|m[0-9]/i.test(feat.type_label ?? '');

      if (isDiameter && nom > 0.5 && isInternalHole) {
        const stylus = selectStylusForHole(nom);
        if (stylus.changedFromDefault) {
          stylusRecommendations.push({ ...stylus, featureId: feat.id, balloon: feat.balloon, holeDiameterMm: nom });
        }
      }

      let effectiveAngleObj = isYAxis
        ? ({ aDeg: 0, bDeg: 0, direction: [0, -1, 0], label: 'A0° B0°' } as PH10Angle)
        : Ph10Kinematics.findBestAngle([-baseNormal[0], -baseNormal[1], -baseNormal[2]]).angle;
      let effectiveAngleLabel = effectiveAngleObj.label;

      for (const inst of instances) {
        const center: [number, number, number] = [inst.center[0], inst.center[1], inst.center[2]];
        const normal: [number, number, number] = [inst.normal[0], inst.normal[1], inst.normal[2]];

        if (inst.axial_min !== undefined && inst.axial_max !== undefined && isYAxis) {
          center[1] = (inst.axial_min + inst.axial_max) / 2;
        }

        const isExtCyl =
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
              feat.balloon,
              useHorizHead ? [-1, 0, 0] : [0, -1, 0],
              effectiveAngleLabel,
              'SAFE_TRAVERSE',
              150.0
            )
          );

          for (let idx = 0; idx < dirs.length; idx++) {
            const d = dirs[idx];
            const sDir: [number, number, number] = useHorizHead ? [-d.ux, 0, -d.uz] : [0, -1, 0];
            const standPos = new THREE.Vector3(cx + d.ux * (radius + approachDist), cy, cz + d.uz * (radius + approachDist));
            const touchPos = new THREE.Vector3(cx + d.ux * radius, cy, cz + d.uz * radius);
            const retPos = new THREE.Vector3(cx + d.ux * (radius + retractDist), cy, cz + d.uz * (radius + retractDist));

            featWaypoints.push(makeWp(standPos, 'TRAVERSE', feat.id, feat.balloon, sDir, effectiveAngleLabel, 'APPROACH', 80.0));
            featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, sDir, effectiveAngleLabel, 'TOUCH', 5.0));
            featWaypoints.push(makeWp(retPos, 'RETRACT', feat.id, feat.balloon, sDir, effectiveAngleLabel, 'RETRACT', 50.0));

            touchRecords.push({
              position: [touchPos.x, touchPos.y, touchPos.z],
              normal: [d.ux, 0, d.uz],
              ph10Label: effectiveAngleLabel,
            });
          }

          featWaypoints.push(
            makeWp(
              new THREE.Vector3(cx, zClearance, cz),
              'RETRACT',
              feat.id,
              feat.balloon,
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
            const tx = rHoriz > 3.0 ? center[0] : ux * maxPartRadius * 0.55;
            const tz = rHoriz > 3.0 ? center[2] : uz * maxPartRadius * 0.55;
            const sDir: [number, number, number] = [-ux, 0, -uz];

            const entryOut = new THREE.Vector3(ux * safeOuterR, cy, uz * safeOuterR);
            const holeCenter = new THREE.Vector3(tx, cy, tz);

            featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, zClearance, uz * safeOuterR), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'SAFE_TRAVERSE', 150.0));
            featWaypoints.push(makeWp(entryOut.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'PLUNGE_TO_ENTRY', 80.0));
            featWaypoints.push(makeWp(holeCenter.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'AXIAL_ENTRY', 20.0));

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
              featWaypoints.push(makeWp(tp.clone(), 'TOUCH', feat.id, feat.balloon, sDir, 'A0° B90°', 'TOUCH', 5.0));
              featWaypoints.push(makeWp(holeCenter.clone(), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°', 'RETRACT', 50.0));
              touchRecords.push({
                position: [tp.x, tp.y, tp.z],
                normal: [-perpX * hd.dp, -hd.dy, -perpZ * hd.dp],
                ph10Label: 'A0° B90°',
              });
            }

            featWaypoints.push(makeWp(entryOut.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'AXIAL_EXIT', 50.0));
            featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, zClearance, uz * safeOuterR), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°', 'RETRACT_TO_SAFE', 150.0));
          } else {
            const radius = Math.min(nom / 2, 40.0);
            effectiveAngleLabel = 'A0° B0°';
            effectiveAngleObj = { aDeg: 0, bDeg: 0, direction: isYAxis ? [0, -1, 0] : [0, 0, -1], label: 'A0° B0°' };

            const holeTop = isYAxis
              ? (inst.axial_max ?? yMaxPart)
              : (inst.axial_max ?? zMaxPart);
            const holeBottom = isYAxis
              ? (inst.axial_min ?? yMinPart)
              : (inst.axial_min ?? zMinPart);
            const holeDepth = Math.max(1.0, holeTop - holeBottom);

            const measOffset = Math.min(holeDepth * 0.5, Math.max(3.0, nom * 0.4));
            const measAltitude = holeTop - measOffset;

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

            featWaypoints.push(makeWp(overheadPos.clone(), 'TRAVERSE', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
            featWaypoints.push(makeWp(pAbove.clone(), 'TRAVERSE', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'PLUNGE_TO_ENTRY', 80.0));
            featWaypoints.push(makeWp(pCenterDepth.clone(), 'TRAVERSE', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'AXIAL_ENTRY', 20.0));

            const pointCount = 4;
            const dApp = Math.min(radius * 0.45, 3.0);
            const isSmallHole = radius <= 3.5;

            for (let i = 0; i < pointCount; i++) {
              const theta = (i * 2 * Math.PI) / pointCount;
              const cosT = Math.cos(theta);
              const sinT = Math.sin(theta);

              const touchPos = isYAxis
                ? new THREE.Vector3(cx + radius * cosT, measAltitude, cz + radius * sinT)
                : new THREE.Vector3(cx + radius * cosT, cz + radius * sinT, measAltitude);

              const normalVec: [number, number, number] = isYAxis
                ? [-cosT, 0, -sinT]
                : [-cosT, -sinT, 0];

              if (isSmallHole) {
                featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'TOUCH', 5.0));
                featWaypoints.push(makeWp(pCenterDepth.clone(), 'RETRACT', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'RETRACT', 50.0));
              } else {
                const appPos = isYAxis
                  ? new THREE.Vector3(cx + (radius - dApp) * cosT, measAltitude, cz + (radius - dApp) * sinT)
                  : new THREE.Vector3(cx + (radius - dApp) * cosT, cz + (radius - dApp) * sinT, measAltitude);

                featWaypoints.push(makeWp(appPos.clone(), 'TRAVERSE', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'APPROACH', 20.0));
                featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'TOUCH', 5.0));
                featWaypoints.push(makeWp(appPos.clone(), 'RETRACT', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'RETRACT', 50.0));
                featWaypoints.push(makeWp(pCenterDepth.clone(), 'TRAVERSE', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'APPROACH', 50.0));
              }

              touchRecords.push({
                position: [touchPos.x, touchPos.y, touchPos.z],
                normal: normalVec,
                ph10Label: 'A0° B0°',
              });
            }

            featWaypoints.push(makeWp(pCenterDepth.clone(), 'TRAVERSE', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'APPROACH', 50.0));
            featWaypoints.push(makeWp(pAbove.clone(), 'TRAVERSE', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'AXIAL_EXIT', 50.0));
            featWaypoints.push(makeWp(overheadPos.clone(), 'RETRACT', feat.id, feat.balloon, effectiveAngleObj.direction, 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
          }
        } else if (isYAxis && (cadId === 'CAD_BBOX_Y' || Math.abs((yMaxPart - yMinPart) - nom) <= 1.5)) {
          effectiveAngleLabel = 'A0° B90°';
          effectiveAngleObj = { aDeg: 0, bDeg: 90, direction: [-1, 0, 0], label: 'A0° B90°' };

          const topTouch = new THREE.Vector3(0, yMaxPart, 0);
          const topStand = new THREE.Vector3(0, yMaxPart + approachDist, 0);
          featWaypoints.push(makeWp(new THREE.Vector3(0, zClearance, 0), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(topStand, 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(topTouch.clone(), 'TOUCH', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°', 'TOUCH', 5.0));
          featWaypoints.push(makeWp(new THREE.Vector3(0, zClearance, 0), 'RETRACT', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
          touchRecords.push({
            position: [topTouch.x, topTouch.y, topTouch.z],
            normal: [0, 1, 0],
            ph10Label: 'A0° B0°',
          });

          const underR = Math.max(6.0, Math.min(maxPartRadius * 0.55, 26.0));
          const underY = Math.max(2.0, yMinPart);
          const sDir: [number, number, number] = [-1, 0, 0];
          const safeR = safeOuterR + 6.0;

          featWaypoints.push(makeWp(new THREE.Vector3(0, safeHeadIndexAltitude, 0), 'RETRACT', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°', 'RETRACT_TO_SAFE', 150.0));
          featWaypoints.push(makeWp(new THREE.Vector3(safeR, safeHeadIndexAltitude, 0), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°', 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(new THREE.Vector3(safeR, safeHeadIndexAltitude, 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'HEAD_ROTATION', 150.0));
          featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, zClearance, 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, Math.max(1.0, underY - approachDist), 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(new THREE.Vector3(underR, Math.max(1.0, underY - approachDist), 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(new THREE.Vector3(underR, underY, 0), 'TOUCH', feat.id, feat.balloon, sDir, 'A0° B90°', 'TOUCH', 5.0));
          featWaypoints.push(makeWp(new THREE.Vector3(underR, Math.max(1.0, underY - retractDist), 0), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°', 'RETRACT', 50.0));
          featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, Math.max(1.0, underY - retractDist), 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, zClearance, 0), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°', 'RETRACT_TO_SAFE', 150.0));
          touchRecords.push({
            position: [underR, underY, 0],
            normal: [0, -1, 0],
            ph10Label: 'A0° B90°',
          });
        } else if (isYAxis && (isDeepFeature || normal[1] < -0.25)) {
          effectiveAngleLabel = 'A0° B90°';
          effectiveAngleObj = { aDeg: 0, bDeg: 90, direction: [-1, 0, 0], label: 'A0° B90°' };

          const cy = Math.max(1.0, center[1]);
          const rHoriz = Math.hypot(center[0], center[2]);
          const ux = rHoriz > 1.0 ? center[0] / rHoriz : (Math.abs(normal[0]) > 0.1 || Math.abs(normal[2]) > 0.1 ? normal[0] / Math.hypot(normal[0], normal[2]) : 1.0);
          const uz = rHoriz > 1.0 ? center[2] / rHoriz : (Math.abs(normal[0]) > 0.1 || Math.abs(normal[2]) > 0.1 ? normal[2] / Math.hypot(normal[0], normal[2]) : 0.0);
          const tx = rHoriz > 2.5 ? center[0] : ux * Math.max(6.0, maxPartRadius * 0.65);
          const tz = rHoriz > 2.5 ? center[2] : uz * Math.max(6.0, maxPartRadius * 0.65);
          const sDir: [number, number, number] = [-ux, 0, -uz];

          const isUnderTouch = cy <= yMinPart + 2.0 || normal[1] < -0.35;
          const standY = isUnderTouch ? Math.max(1.0, cy - approachDist) : cy + normal[1] * approachDist;
          const retY = isUnderTouch ? Math.max(1.0, cy - retractDist) : cy + normal[1] * retractDist;
          const standX = isUnderTouch ? tx : tx + ux * approachDist;
          const standZ = isUnderTouch ? tz : tz + uz * approachDist;
          const retX = isUnderTouch ? tx : tx + ux * retractDist;
          const retZ = isUnderTouch ? tz : tz + uz * retractDist;

          const outOverhead = new THREE.Vector3(ux * safeOuterR, zClearance, uz * safeOuterR);
          const outLevel = new THREE.Vector3(ux * safeOuterR, standY, uz * safeOuterR);
          const standPos = new THREE.Vector3(standX, standY, standZ);
          const touchPos = new THREE.Vector3(tx, cy, tz);
          const retPos = new THREE.Vector3(retX, retY, retZ);

          featWaypoints.push(makeWp(outOverhead.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(outLevel.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(standPos, 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, sDir, 'A0° B90°', 'TOUCH', 5.0));
          featWaypoints.push(makeWp(retPos, 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°', 'RETRACT', 50.0));
          featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, retY, uz * safeOuterR), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°', 'APPROACH', 80.0));
          featWaypoints.push(makeWp(outOverhead.clone(), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°', 'RETRACT_TO_SAFE', 150.0));

          touchRecords.push({
            position: [touchPos.x, touchPos.y, touchPos.z],
            normal: [normal[0], normal[1], normal[2]],
            ph10Label: 'A0° B90°',
          });
        } else {
          let safeTouchY = isYAxis ? Math.max(yMinPart, Math.min(yMaxPart, center[1])) : center[1];
          if (isYAxis && (cadId === 'CAD_BBOX_X' || cadId === 'CAD_BBOX_Z')) {
            safeTouchY = yMinPart + Math.min(1.2, Math.max(0.6, partHeight * 0.22));
          }
          const touchPos = new THREE.Vector3(center[0], safeTouchY, center[2]);
          const standoffPos = new THREE.Vector3(
            center[0] + normal[0] * approachDist,
            isYAxis ? Math.max(0.5, safeTouchY + normal[1] * approachDist) : safeTouchY + normal[1] * approachDist,
            center[2] + normal[2] * approachDist
          );
          const retractPos = new THREE.Vector3(
            center[0] + normal[0] * retractDist,
            isYAxis ? Math.max(0.5, safeTouchY + normal[1] * retractDist) : safeTouchY + normal[1] * retractDist,
            center[2] + normal[2] * retractDist
          );

          const overheadPos = isYAxis
            ? new THREE.Vector3(standoffPos.x, zClearance, standoffPos.z)
            : new THREE.Vector3(standoffPos.x, standoffPos.y, zClearance);

          featWaypoints.push(makeWp(overheadPos.clone(), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label, 'SAFE_TRAVERSE', 150.0));
          featWaypoints.push(makeWp(standoffPos, 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label, 'APPROACH', 80.0));
          featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label, 'TOUCH', 5.0));
          featWaypoints.push(makeWp(retractPos, 'RETRACT', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label, 'RETRACT', 50.0));
          featWaypoints.push(makeWp(overheadPos.clone(), 'RETRACT', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label, 'RETRACT_TO_SAFE', 150.0));

          touchRecords.push({
            position: [touchPos.x, touchPos.y, touchPos.z],
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

    let totalDist = 0;
    let totalDuration = 0;
    for (let i = 0; i < allWaypoints.length - 1; i++) {
      const p1 = allWaypoints[i].position;
      const p2 = allWaypoints[i + 1].position;
      const dist = p1.distanceTo(p2);
      totalDist += dist;
      const feed = allWaypoints[i + 1].feedRate ?? 150.0;
      totalDuration += dist / Math.max(1.0, feed);
    }

    return {
      operation: activeOp,
      zClearance,
      safeIndexZ: safeHeadIndexAltitude,
      featurePaths,
      allWaypoints,
      totalDistanceMm: parseFloat(totalDist.toFixed(2)),
      estimatedDurationSec: parseFloat((totalDuration + headRotations * 2.5).toFixed(1)),
      probeHeadRotations: headRotations,
      stylusRecommendations,
      datumTouchPoints,
    };
  }
}
