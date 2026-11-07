import * as THREE from 'three';
import { type Waypoint } from '../SimulationController';
import { Ph10Kinematics, type PH10Angle } from './Ph10Kinematics';
import { orderByMeasurementPhase } from './MeasurementPhases';
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
}

export class MeasurementPathGenerator {
  public static generatePlan(
    features: PathFeatureInput[],
    bbox: { min: [number, number, number]; max: [number, number, number] },
    options: PathGeneratorOptions = {}
  ): GeneratedMeasurementPlan {
    const activeOp = options.activeOperation ?? 'OP10';
    const clearanceMargin = options.clearanceZMarginMm ?? 15.0;
    const approachDist = options.approachDistanceMm ?? 8.0;
    const retractDist = options.retractDistanceMm ?? 5.0;
    const isYAxis = options.verticalAxis === 'Y';

    const zClearance = isYAxis
      ? parseFloat(((bbox.max[1] ?? 8.63) + clearanceMargin).toFixed(2))
      : parseFloat(((bbox.max[2] ?? 50.0) + clearanceMargin).toFixed(2));

    const maxPartRadius = isYAxis
      ? Math.max(
          Math.abs(bbox.min[0] ?? 20),
          Math.abs(bbox.max[0] ?? 20),
          Math.abs(bbox.min[2] ?? 20),
          Math.abs(bbox.max[2] ?? 20),
          15.0
        )
      : 50.0;
    const safeOuterR = maxPartRadius + 16.0;
    const yMinPart = bbox.min[1] ?? 0;
    const yMaxPart = bbox.max[1] ?? 50;

    const opFeatures = orderByMeasurementPhase(features.filter((f) => (f.operation ?? 'OP10') === activeOp));
    const stylusRecommendations: StylusRecommendation[] = [];

    const featurePaths: FeatureMeasurementPath[] = [];
    const allWaypoints: ExtendedWaypoint[] = [];

    const makeWp = (
      position: THREE.Vector3,
      phase: Waypoint['phase'],
      featureId?: number,
      balloon?: string,
      stylusDir: [number, number, number] = [0, -1, 0],
      ph10Label = 'A0° B0°'
    ): ExtendedWaypoint => ({
      position,
      phase,
      featureId,
      balloon,
      stylusDir,
      ph10Label,
    });

    const homePos = isYAxis
      ? new THREE.Vector3(0, zClearance, 0)
      : new THREE.Vector3(bbox.min[0], bbox.min[1], zClearance);
    allWaypoints.push(makeWp(homePos.clone(), 'IDLE', undefined, undefined, [0, -1, 0], 'A0° B0°'));

    let currentAngleLabel: string | null = null;
    let headRotations = 0;

    const partCx = (bbox.min[0] + bbox.max[0]) / 2;
    const partCz = (bbox.min[2] + bbox.max[2]) / 2;
    const safeHeadIndexY = isYAxis ? zClearance + 20.0 : zClearance + 20.0;
    const datumTouchPoints: TouchPointRecord[] = [];

    const appendWithSafeHeadRotation = (
      dest: ExtendedWaypoint[],
      nextWps: ExtendedWaypoint[]
    ): void => {
      if (nextWps.length === 0) return;
      if (dest.length > 0 && isYAxis) {
        const prev = dest[dest.length - 1];
        const next = nextWps[0];
        const prevLabel = prev.ph10Label ?? 'A0° B0°';
        const nextLabel = next.ph10Label ?? 'A0° B0°';
        const prevDir = prev.stylusDir ?? [0, -1, 0];
        const nextDir = next.stylusDir ?? [0, -1, 0];
        const dirDot = prevDir[0] * nextDir[0] + prevDir[1] * nextDir[1] + prevDir[2] * nextDir[2];
        const needsSafeIndex = prevLabel !== nextLabel || (nextLabel === 'A0° B90°' && dirDot < 0.85);
        if (needsSafeIndex) {
          const prevRad = Math.hypot(prev.position.x, prev.position.z);
          const nextRad = Math.hypot(next.position.x, next.position.z);
          const safeR = safeOuterR + 6.0;
          const pUx = prevRad > 1.0 ? prev.position.x / prevRad : ( -prevDir[0] || 1.0 );
          const pUz = prevRad > 1.0 ? prev.position.z / prevRad : ( -prevDir[2] || 0.0 );
          const nUx = nextRad > 1.0 ? next.position.x / nextRad : ( -nextDir[0] || 1.0 );
          const nUz = nextRad > 1.0 ? next.position.z / nextRad : ( -nextDir[2] || 0.0 );

          const exitX = prevLabel === 'A0° B90°' ? pUx * safeR : prev.position.x;
          const exitZ = prevLabel === 'A0° B90°' ? pUz * safeR : prev.position.z;
          const entryX = nextLabel === 'A0° B90°' ? nUx * safeR : next.position.x;
          const entryZ = nextLabel === 'A0° B90°' ? nUz * safeR : next.position.z;

          dest.push(makeWp(new THREE.Vector3(exitX, safeHeadIndexY, exitZ), 'TRAVERSE', next.featureId, next.balloon, prevDir, prevLabel));
          dest.push(makeWp(new THREE.Vector3(entryX, safeHeadIndexY, entryZ), 'TRAVERSE', next.featureId, next.balloon, nextDir, nextLabel));
        }
      }
      for (const wp of nextWps) {
        dest.push(wp);
      }
    };

    if (isYAxis && options.includeDatumSetup) {
      const minX = bbox.min[0];
      const maxX = bbox.max[0];
      const minZ = bbox.min[2];
      const maxZ = bbox.max[2];
      const sizeX = Math.max(8.0, maxX - minX);
      const sizeZ = Math.max(8.0, maxZ - minZ);
      const partH = Math.max(1.0, yMaxPart - yMinPart);
      const datumAY = yMaxPart;
      const edgeY = yMinPart + Math.min(1.5, Math.max(0.6, partH * 0.25));

      const holeCenters: Array<[number, number, number]> = [];
      for (const f of opFeatures) {
        if (f.type === 'DIAMETER' || f.cad_feature_id?.startsWith('CAD_HOLE_')) {
          const r = Math.max(1.5, (f.nominal || 3.0) / 2 + 2.5);
          if (f.cad_instances?.length) {
            for (const inst of f.cad_instances) {
              holeCenters.push([inst.center[0], inst.center[1], r]);
            }
          } else if (f.cad_center) {
            holeCenters.push([f.cad_center[0], f.cad_center[2], r]);
          }
        }
      }

      const nudgeFromHoles = (px: number, pz: number): [number, number] => {
        let x = px;
        let z = pz;
        for (const [hx, hz, minR] of holeCenters) {
          const d = Math.hypot(x - hx, z - hz);
          if (d < minR) {
            const dx = d > 0.1 ? (x - hx) / d : 1.0;
            const dz = d > 0.1 ? (z - hz) / d : 0.0;
            x = hx + dx * (minR + 1.5);
            z = hz + dz * (minR + 1.5);
          }
        }
        return [
          Math.max(minX + 2.5, Math.min(maxX - 2.5, x)),
          Math.max(minZ + 2.5, Math.min(maxZ - 2.5, z)),
        ];
      };

      const rawA: Array<[number, number]> = [
        nudgeFromHoles(minX + sizeX * 0.22, minZ + sizeZ * 0.24),
        nudgeFromHoles(maxX - sizeX * 0.22, minZ + sizeZ * 0.24),
        nudgeFromHoles(partCx, maxZ - sizeZ * 0.24),
      ];

      const datumWps: ExtendedWaypoint[] = [];
      for (let i = 0; i < rawA.length; i++) {
        const [ax, az] = rawA[i];
        datumWps.push(makeWp(new THREE.Vector3(ax, zClearance, az), 'TRAVERSE', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(ax, datumAY + approachDist, az), 'TRAVERSE', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(ax, datumAY, az), 'TOUCH', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(ax, datumAY + retractDist, az), 'RETRACT', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(ax, zClearance, az), 'TRAVERSE', 0, 'DATUM_A', [0, -1, 0], 'A0° B0°'));
        datumTouchPoints.push({
          position: [ax, datumAY, az],
          normal: [0, 1, 0],
          ph10Label: 'A0° B0°',
          label: `DATUM_A #${i + 1}`,
          isDatum: true,
        });
      }

      const insetZ = Math.max(3.5, sizeZ * 0.24);
      const bZs = [minZ + insetZ, maxZ - insetZ];
      for (let i = 0; i < bZs.length; i++) {
        const bz = bZs[i];
        const standX = minX - approachDist;
        const retX = minX - retractDist;
        datumWps.push(makeWp(new THREE.Vector3(standX, zClearance, bz), 'TRAVERSE', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(standX, edgeY, bz), 'TRAVERSE', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(minX, edgeY, bz), 'TOUCH', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(retX, edgeY, bz), 'RETRACT', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°'));
        datumWps.push(makeWp(new THREE.Vector3(standX, zClearance, bz), 'TRAVERSE', 0, 'DATUM_B', [0, -1, 0], 'A0° B0°'));
        datumTouchPoints.push({
          position: [minX, edgeY, bz],
          normal: [-1, 0, 0],
          ph10Label: 'A0° B0°',
          label: `DATUM_B #${i + 1}`,
          isDatum: true,
        });
      }

      const cxEdge = partCx;
      const standZ = minZ - approachDist;
      const retZ = minZ - retractDist;
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, zClearance, standZ), 'TRAVERSE', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°'));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, edgeY, standZ), 'TRAVERSE', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°'));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, edgeY, minZ), 'TOUCH', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°'));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, edgeY, retZ), 'RETRACT', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°'));
      datumWps.push(makeWp(new THREE.Vector3(cxEdge, zClearance, standZ), 'TRAVERSE', 0, 'DATUM_C', [0, -1, 0], 'A0° B0°'));
      datumTouchPoints.push({
        position: [cxEdge, edgeY, minZ],
        normal: [0, 0, -1],
        ph10Label: 'A0° B0°',
        label: 'DATUM_C #1 (Sıfır Noktası)',
        isDatum: true,
      });

      appendWithSafeHeadRotation(allWaypoints, datumWps);
      currentAngleLabel = 'A0° B0°';
    }

    for (const feat of opFeatures) {
      const baseCenter = feat.cad_center ?? (isYAxis
        ? [partCx, Math.max(0, bbox.max[1]), partCz]
        : [partCx, (bbox.min[1] + bbox.max[1]) / 2, bbox.max[2]]);
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
      const isHole =
        cadId.startsWith('CAD_HOLE_') ||
        feat.feature_type === 'INTERNAL_CYLINDER' ||
        /delik|hole/i.test(feat.type_label ?? '');
      if (isDiameter && nom > 0.5 && isHole) {
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

        if (isYAxis && !isDiameter && Math.hypot(normal[0], normal[2]) > 0.25) {
          const relX = center[0] - partCx;
          const relZ = center[2] - partCz;
          const dotOut = relX * normal[0] + relZ * normal[2];
          if (dotOut < -1.0) {
            normal[0] = -normal[0];
            normal[2] = -normal[2];
          }
        }
        const isExtCyl =
          feat.feature_type === 'EXTERNAL_CYLINDER' ||
          cadId.startsWith('CAD_CYL_') ||
          cadId.startsWith('CAD_CONE_') ||
          (isYAxis &&
            isDiameter &&
            nom > 24.0 &&
            !cadId.startsWith('CAD_HOLE_') &&
            !/delik|bore|hole|m[0-9]/i.test(feat.type_label ?? ''));

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
            effectiveAngleLabel
          )
        );

        for (let idx = 0; idx < dirs.length; idx++) {
          const d = dirs[idx];
          const sDir: [number, number, number] = useHorizHead ? [-d.ux, 0, -d.uz] : [0, -1, 0];
          const outerPos = new THREE.Vector3(cx + d.ux * ringSafeR, cy, cz + d.uz * ringSafeR);
          const standPos = new THREE.Vector3(cx + d.ux * (radius + approachDist), cy, cz + d.uz * (radius + approachDist));
          const touchPos = new THREE.Vector3(cx + d.ux * radius, cy, cz + d.uz * radius);
          const retPos = new THREE.Vector3(cx + d.ux * (radius + retractDist), cy, cz + d.uz * (radius + retractDist));

          featWaypoints.push(makeWp(outerPos.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, effectiveAngleLabel));
          featWaypoints.push(makeWp(standPos, 'TRAVERSE', feat.id, feat.balloon, sDir, effectiveAngleLabel));
          featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, sDir, effectiveAngleLabel));
          featWaypoints.push(makeWp(retPos, 'RETRACT', feat.id, feat.balloon, sDir, effectiveAngleLabel));
          featWaypoints.push(makeWp(outerPos.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, effectiveAngleLabel));

          if (idx < dirs.length - 1) {
            const nextD = dirs[idx + 1];
            const midUx = (d.ux + nextD.ux) * 0.7071;
            const midUz = (d.uz + nextD.uz) * 0.7071;
            featWaypoints.push(
              makeWp(
                new THREE.Vector3(cx + midUx * ringSafeR * 1.05, cy, cz + midUz * ringSafeR * 1.05),
                'TRAVERSE',
                feat.id,
                feat.balloon,
                useHorizHead ? [-midUx, 0, -midUz] : [0, -1, 0],
                effectiveAngleLabel
              )
            );
          }

          touchRecords.push({
            position: [touchPos.x, touchPos.y, touchPos.z],
            normal: [d.ux, 0, d.uz],
            ph10Label: effectiveAngleLabel,
          });
        }

        featWaypoints.push(
          makeWp(
            new THREE.Vector3(cx, zClearance, cz - ringSafeR),
            'TRAVERSE',
            feat.id,
            feat.balloon,
            useHorizHead ? [0, 0, 1] : [0, -1, 0],
            effectiveAngleLabel
          )
        );
      } else if (isDiameter && nom > 0.5) {
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

          const overheadOut = new THREE.Vector3(ux * safeOuterR, zClearance, uz * safeOuterR);
          const entryOut = new THREE.Vector3(ux * safeOuterR, cy, uz * safeOuterR);
          const holeCenter = new THREE.Vector3(tx, cy, tz);

          featWaypoints.push(makeWp(overheadOut.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
          featWaypoints.push(makeWp(entryOut.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
          featWaypoints.push(makeWp(holeCenter.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));

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
            featWaypoints.push(makeWp(tp.clone(), 'TOUCH', feat.id, feat.balloon, sDir, 'A0° B90°'));
            featWaypoints.push(makeWp(holeCenter.clone(), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°'));
            touchRecords.push({
              position: [tp.x, tp.y, tp.z],
              normal: [-perpX * hd.dp, -hd.dy, -perpZ * hd.dp],
              ph10Label: 'A0° B90°',
            });
          }

          featWaypoints.push(makeWp(entryOut.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
          featWaypoints.push(makeWp(overheadOut.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        } else {
          const radius = Math.min(nom / 2, 40.0);
          const axisVec = new THREE.Vector3(normal[0], normal[1], normal[2]).normalize();
          if (axisVec.lengthSq() < 0.1) axisVec.set(0, isYAxis ? 1 : 0, isYAxis ? 0 : 1);

          let uVec = new THREE.Vector3(1, 0, 0);
          if (Math.abs(axisVec.x) > 0.9) {
            uVec.set(0, 1, 0);
          }
          const vVec = new THREE.Vector3().crossVectors(axisVec, uVec).normalize();
          uVec.crossVectors(vVec, axisVec).normalize();

          const centerPos = new THREE.Vector3(center[0], isYAxis ? Math.max(0, center[1]) : center[1], center[2]);
          const topApproach = isYAxis
            ? new THREE.Vector3(centerPos.x, zClearance, centerPos.z)
            : centerPos.clone().addScaledVector(axisVec, clearanceMargin);

          featWaypoints.push(makeWp(topApproach.clone(), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
          featWaypoints.push(makeWp(centerPos.clone(), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));

          const radialOffsets = [
            { u: 1, v: 0 },
            { u: 0, v: 1 },
            { u: -1, v: 0 },
            { u: 0, v: -1 },
          ];

          for (const dir of radialOffsets) {
            const touchPos = centerPos.clone()
              .addScaledVector(uVec, dir.u * radius)
              .addScaledVector(vVec, dir.v * radius);

            const standoffDist = Math.max(0.2, radius - approachDist);
            const standoffPos = centerPos.clone()
              .addScaledVector(uVec, dir.u * standoffDist)
              .addScaledVector(vVec, dir.v * standoffDist);

            const retractDistMm = Math.max(0.2, radius - retractDist);
            const retractPos = centerPos.clone()
              .addScaledVector(uVec, dir.u * retractDistMm)
              .addScaledVector(vVec, dir.v * retractDistMm);

            featWaypoints.push(makeWp(standoffPos, 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
            featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
            featWaypoints.push(makeWp(retractPos, 'RETRACT', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
            featWaypoints.push(makeWp(centerPos.clone(), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));

            const normalVec = touchPos.clone().sub(centerPos).normalize().negate();
            touchRecords.push({
              position: [touchPos.x, touchPos.y, touchPos.z],
              normal: [normalVec.x, normalVec.y, normalVec.z],
              ph10Label: effectiveAngleObj.label,
            });
          }

          featWaypoints.push(makeWp(topApproach.clone(), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
        }
      } else if (isYAxis && (cadId === 'CAD_BBOX_Y' || Math.abs((yMaxPart - yMinPart) - nom) <= 1.5)) {
        effectiveAngleLabel = 'A0° B90°';
        effectiveAngleObj = { aDeg: 0, bDeg: 90, direction: [-1, 0, 0], label: 'A0° B90°' };
        const topTouch = new THREE.Vector3(0, yMaxPart, 0);
        const topStand = new THREE.Vector3(0, yMaxPart + approachDist, 0);
        featWaypoints.push(makeWp(new THREE.Vector3(0, zClearance, 0), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°'));
        featWaypoints.push(makeWp(topStand, 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°'));
        featWaypoints.push(makeWp(topTouch.clone(), 'TOUCH', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°'));
        featWaypoints.push(makeWp(new THREE.Vector3(0, zClearance, 0), 'RETRACT', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°'));
        touchRecords.push({
          position: [topTouch.x, topTouch.y, topTouch.z],
          normal: [0, 1, 0],
          ph10Label: 'A0° B0°',
        });

        const underR = Math.max(6.0, Math.min(maxPartRadius * 0.55, 26.0));
        const underY = Math.max(2.0, yMinPart);
        const sDir: [number, number, number] = [-1, 0, 0];
        const safeR = safeOuterR + 6.0;
        featWaypoints.push(makeWp(new THREE.Vector3(0, safeHeadIndexY, 0), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°'));
        featWaypoints.push(makeWp(new THREE.Vector3(safeR, safeHeadIndexY, 0), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], 'A0° B0°'));
        featWaypoints.push(makeWp(new THREE.Vector3(safeR, safeHeadIndexY, 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, zClearance, 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, Math.max(1.0, underY - approachDist), 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(underR, Math.max(1.0, underY - approachDist), 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(underR, underY, 0), 'TOUCH', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(underR, Math.max(1.0, underY - retractDist), 0), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, Math.max(1.0, underY - retractDist), 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(safeOuterR, zClearance, 0), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
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

        featWaypoints.push(makeWp(outOverhead.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(outLevel.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(standPos, 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(retPos, 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°'));
        featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, retY, uz * safeOuterR), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));

        touchRecords.push({
          position: [touchPos.x, touchPos.y, touchPos.z],
          normal: [normal[0], normal[1], normal[2]],
          ph10Label: 'A0° B90°',
        });

        if (cadId.startsWith('CAD_STEP_DIST_') && yMinPart >= 10.0 && Math.abs(normal[1]) > 0.7) {
          const underR = Math.max(6.0, Math.min(maxPartRadius * 0.55, 26.0));
          const underY = yMinPart;
          featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, Math.max(1.0, underY - approachDist), uz * safeOuterR), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
          featWaypoints.push(makeWp(new THREE.Vector3(ux * underR, Math.max(1.0, underY - approachDist), uz * underR), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
          featWaypoints.push(makeWp(new THREE.Vector3(ux * underR, underY, uz * underR), 'TOUCH', feat.id, feat.balloon, sDir, 'A0° B90°'));
          featWaypoints.push(makeWp(new THREE.Vector3(ux * underR, Math.max(1.0, underY - retractDist), uz * underR), 'RETRACT', feat.id, feat.balloon, sDir, 'A0° B90°'));
          featWaypoints.push(makeWp(new THREE.Vector3(ux * safeOuterR, Math.max(1.0, underY - retractDist), uz * safeOuterR), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
          touchRecords.push({
            position: [ux * underR, underY, uz * underR],
            normal: [0, -1, 0],
            ph10Label: 'A0° B90°',
          });
        }

        featWaypoints.push(makeWp(outOverhead.clone(), 'TRAVERSE', feat.id, feat.balloon, sDir, 'A0° B90°'));
      } else {
        const isHorizWall = isYAxis && Math.hypot(normal[0], normal[2]) > 0.25;
        let safeTouchY = isYAxis ? Math.max(0, center[1]) : center[1];
        if (isHorizWall) {
          const sx = center[0] + normal[0] * approachDist;
          const sz = center[2] + normal[2] * approachDist;
          const insideFootprint =
            sx > bbox.min[0] + 1.0 &&
            sx < bbox.max[0] - 1.0 &&
            sz > bbox.min[2] + 1.0 &&
            sz < bbox.max[2] - 1.0;
          if (insideFootprint) {
            safeTouchY = Math.max(safeTouchY, Math.min(yMaxPart - 0.3, Math.max(center[1], yMaxPart - 1.2)));
          }
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
        featWaypoints.push(makeWp(overheadPos, 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
        featWaypoints.push(makeWp(standoffPos, 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
        featWaypoints.push(makeWp(touchPos.clone(), 'TOUCH', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
        featWaypoints.push(makeWp(retractPos, 'RETRACT', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));
        featWaypoints.push(makeWp(overheadPos.clone(), 'TRAVERSE', feat.id, feat.balloon, [0, -1, 0], effectiveAngleObj.label));

        touchRecords.push({
          position: [touchPos.x, touchPos.y, touchPos.z],
          normal: [normal[0], normal[1], normal[2]],
          ph10Label: effectiveAngleObj.label,
        });
      }
      }

      if (currentAngleLabel !== null && currentAngleLabel !== effectiveAngleLabel) {
        headRotations++;
      }
      currentAngleLabel = effectiveAngleLabel;

      featurePaths.push({
        featureId: feat.id,
        balloon: feat.balloon,
        ph10Angle: effectiveAngleObj,
        touchPoints: touchRecords,
        waypoints: featWaypoints,
      });

      appendWithSafeHeadRotation(allWaypoints, featWaypoints);
    }

    appendWithSafeHeadRotation(allWaypoints, [
      makeWp(homePos.clone(), 'COMPLETED', undefined, undefined, [0, -1, 0], 'A0° B0°'),
    ]);

    let totalDist = 0.0;
    for (let i = 0; i < allWaypoints.length - 1; i++) {
      totalDist += allWaypoints[i].position.distanceTo(allWaypoints[i + 1].position);
    }

    const traverseDist = totalDist * 0.9;
    const touchDist = totalDist * 0.1;
    const duration = traverseDist / 150.0 + touchDist / 5.0 + headRotations * 2.5;

    return {
      operation: activeOp,
      zClearance,
      featurePaths,
      allWaypoints,
      totalDistanceMm: parseFloat(totalDist.toFixed(1)),
      estimatedDurationSec: parseFloat(duration.toFixed(1)),
      probeHeadRotations: headRotations,
      stylusRecommendations,
      datumTouchPoints,
    };
  }
}

