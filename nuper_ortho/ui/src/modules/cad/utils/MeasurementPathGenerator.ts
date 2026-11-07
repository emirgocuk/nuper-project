import * as THREE from 'three';
import { type Waypoint } from '../SimulationController';
import { Ph10Kinematics, type PH10Angle } from './Ph10Kinematics';

export interface PathFeatureInput {
  id: number;
  balloon: string;
  type?: string;
  type_label?: string;
  nominal: number;
  cad_center?: [number, number, number];
  cad_normal?: [number, number, number];
  operation?: 'OP10' | 'OP20';
}

export interface TouchPointRecord {
  position: [number, number, number];
  normal: [number, number, number];
}

export interface FeatureMeasurementPath {
  featureId: number;
  balloon: string;
  ph10Angle: PH10Angle;
  touchPoints: TouchPointRecord[];
  waypoints: Waypoint[];
}

export interface GeneratedMeasurementPlan {
  operation: 'OP10' | 'OP20';
  zClearance: number;
  featurePaths: FeatureMeasurementPath[];
  allWaypoints: Waypoint[];
  totalDistanceMm: number;
  estimatedDurationSec: number;
  probeHeadRotations: number;
}

export interface PathGeneratorOptions {
  activeOperation?: 'OP10' | 'OP20';
  clearanceZMarginMm?: number;
  approachDistanceMm?: number;
  retractDistanceMm?: number;
  verticalAxis?: 'Y' | 'Z';
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

    const opFeatures = features.filter((f) => (f.operation ?? 'OP10') === activeOp);

    const featurePaths: FeatureMeasurementPath[] = [];
    const allWaypoints: Waypoint[] = [];

    // Başlangıç: Emniyetli Tavan Park Noktası
    const homePos = isYAxis
      ? new THREE.Vector3(0, zClearance, 0)
      : new THREE.Vector3(bbox.min[0], bbox.min[1], zClearance);
    allWaypoints.push({ position: homePos.clone(), phase: 'IDLE' });

    let currentAngleLabel: string | null = null;
    let headRotations = 0;

    for (const feat of opFeatures) {
      const center = feat.cad_center ?? (isYAxis
        ? [(bbox.min[0] + bbox.max[0]) / 2, Math.max(0, bbox.max[1]), (bbox.min[2] + bbox.max[2]) / 2]
        : [(bbox.min[0] + bbox.max[0]) / 2, (bbox.min[1] + bbox.max[1]) / 2, bbox.max[2]]);
      const normal = feat.cad_normal ?? (isYAxis ? [0, 1, 0] : [0, 0, 1]);

      // Prob yaklaşma vektörü yüzey normalinin tersidir (veya delik ekseni)
      const approachVec: [number, number, number] = [-normal[0], -normal[1], -normal[2]];
      const angleMatch = Ph10Kinematics.findBestAngle(approachVec);
      const angle = angleMatch.angle;

      if (currentAngleLabel !== null && currentAngleLabel !== angle.label) {
        headRotations++;
      }
      currentAngleLabel = angle.label;

      const featWaypoints: Waypoint[] = [];
      const touchRecords: TouchPointRecord[] = [];

      const isHole = feat.type === 'DIAMETER' || /dia|çap|delik/i.test(feat.type_label ?? '');
      const nom = feat.nominal;

      if (isHole && nom > 0.5) {
        // Silindirik Delik: Gerçek silindir ekseni boyunca iniş ve 4 radyal temas noktası (3D Arbitrary Axis)
        const radius = Math.min(nom / 2, 40.0);
        const axisVec = new THREE.Vector3(normal[0], normal[1], normal[2]).normalize();
        if (axisVec.lengthSq() < 0.1) axisVec.set(0, isYAxis ? 1 : 0, isYAxis ? 0 : 1);

        // Eksene dik iki ortogonal taban vektörü (U ve V) türet
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

        featWaypoints.push({ position: topApproach.clone(), phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });
        featWaypoints.push({ position: centerPos.clone(), phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });

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

          featWaypoints.push({ position: standoffPos, phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });
          featWaypoints.push({ position: touchPos.clone(), phase: 'TOUCH', featureId: feat.id, balloon: feat.balloon });
          featWaypoints.push({ position: retractPos, phase: 'RETRACT', featureId: feat.id, balloon: feat.balloon });
          featWaypoints.push({ position: centerPos.clone(), phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });

          const normalVec = touchPos.clone().sub(centerPos).normalize().negate();
          touchRecords.push({
            position: [touchPos.x, touchPos.y, touchPos.z],
            normal: [normalVec.x, normalVec.y, normalVec.z],
          });
        }

        // Delikten emniyetli çıkış
        featWaypoints.push({ position: topApproach.clone(), phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });
      } else {
        // Düzlem / Yüzey: Yüzey Normali Boyunca Tekil veya Izgara Teması
        const touchPos = new THREE.Vector3(
          center[0],
          isYAxis ? Math.max(0, center[1]) : center[1],
          center[2]
        );
        const standoffPos = new THREE.Vector3(
          center[0] + normal[0] * approachDist,
          isYAxis ? Math.max(0.5, center[1] + normal[1] * approachDist) : center[1] + normal[1] * approachDist,
          center[2] + normal[2] * approachDist
        );
        const retractPos = new THREE.Vector3(
          center[0] + normal[0] * retractDist,
          isYAxis ? Math.max(0.5, center[1] + normal[1] * retractDist) : center[1] + normal[1] * retractDist,
          center[2] + normal[2] * retractDist
        );

        // 1. Tavanda özelliğin koordinatına intikal
        const overheadPos = isYAxis
          ? new THREE.Vector3(standoffPos.x, zClearance, standoffPos.z)
          : new THREE.Vector3(standoffPos.x, standoffPos.y, zClearance);
        featWaypoints.push({ position: overheadPos, phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });

        // 2. Stand-off yaklaşma
        featWaypoints.push({ position: standoffPos, phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });

        // 3. Yüzeye dokunma
        featWaypoints.push({ position: touchPos.clone(), phase: 'TOUCH', featureId: feat.id, balloon: feat.balloon });

        // 4. Geri çekilme
        featWaypoints.push({ position: retractPos, phase: 'RETRACT', featureId: feat.id, balloon: feat.balloon });

        // 5. Tavana geri çekilme
        featWaypoints.push({ position: overheadPos.clone(), phase: 'TRAVERSE', featureId: feat.id, balloon: feat.balloon });

        touchRecords.push({
          position: [touchPos.x, touchPos.y, touchPos.z],
          normal: [normal[0], normal[1], normal[2]],
        });
      }

      featurePaths.push({
        featureId: feat.id,
        balloon: feat.balloon,
        ph10Angle: angle,
        touchPoints: touchRecords,
        waypoints: featWaypoints,
      });

      for (const wp of featWaypoints) {
        allWaypoints.push(wp);
      }
    }

    // Bitiş: Emniyetli Tavan Park Noktasına Dönüş
    allWaypoints.push({ position: homePos.clone(), phase: 'COMPLETED' });

    let totalDist = 0.0;
    for (let i = 0; i < allWaypoints.length - 1; i++) {
      totalDist += allWaypoints[i].position.distanceTo(allWaypoints[i + 1].position);
    }

    // Ortalama hızlar: İntikal 150 mm/s, Temas 5 mm/s, Kafa Dönüşü 2.5 saniye
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
    };
  }
}

