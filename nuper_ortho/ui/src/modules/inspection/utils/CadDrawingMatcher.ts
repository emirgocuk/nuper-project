import type { CadMetadata } from '../../../types/generated/cad_metadata';
import type { DrawingExtractionResult } from '../../../types/generated/drawing_data';

export interface MatchedCadInstance {
  id: string;
  center: [number, number, number];
  normal: [number, number, number];
  axial_min?: number;
  axial_max?: number;
  stem_blocked?: boolean;
}

export interface TruePositionResult {
  deviationDia: number;
  radialError: number;
  withinTolerance: boolean;
}

export function evaluateTruePositionDeviation(
  nominalX: number,
  nominalZ: number,
  measuredX: number,
  measuredZ: number,
  toleranceDia: number
): TruePositionResult {
  const dx = measuredX - nominalX;
  const dz = measuredZ - nominalZ;
  const radialError = Math.hypot(dx, dz);
  const deviationDia = parseFloat((2.0 * radialError).toFixed(4));
  return {
    deviationDia,
    radialError: parseFloat(radialError.toFixed(4)),
    withinTolerance: deviationDia <= Math.abs(toleranceDia) + 1e-6,
  };
}

export interface MatchedInspectionDimension {
  id: number;
  balloon: string;
  page?: number;
  type: string;
  type_label: string;
  icon?: string;
  nominal: number;
  nominal_str: string;
  upper_tol: string;
  lower_tol: string;
  measured: string;
  deviation: string;
  status: 'PASS' | 'WARN' | 'FAIL' | 'UNMEASURED';
  feature_key?: string;
  gdt?: string;
  datum_reference?: string;
  bbox?: [number, number, number, number];
  cad_feature_id?: string;
  cad_center?: [number, number, number];
  cad_normal?: [number, number, number];
  cad_instances?: MatchedCadInstance[];
  axial_min?: number;
  axial_max?: number;
  stem_blocked?: boolean;
  true_position_deviation?: number;
  operation: 'OP10' | 'OP20';
  op_reason?: string;
  match_confidence: 'EXACT' | 'ENVELOPE' | 'RADIUS_HALF' | 'UNMATCHED';
  match_score?: number;
  match_status?: 'VERIFIED_EXACT' | 'VERIFIED_TOPOLOGY' | 'NEEDS_REVIEW' | 'UNMATCHED' | 'ENGINEER_LOCKED';
  inferred_axis?: 'X' | 'Y' | 'Z';
  distance_type?: string;
  faceA_center?: [number, number, number];
  faceB_center?: [number, number, number];
  faceA_normal?: [number, number, number];
  faceB_normal?: [number, number, number];
}

export interface CadDrawingMatchResult {
  part_number: string;
  total_dimensions: number;
  matched_count: number;
  unmatched_count: number;
  match_percentage: number;
  op10_count: number;
  op20_count: number;
  dimensions: MatchedInspectionDimension[];
}

const EPSILON = 0.15;
const ENVELOPE_EPSILON = 1.2;
const FEATURE_MATCH_TOLERANCE = 0.85;

export function matchCadWithDrawing(
  cad: CadMetadata,
  drawing: DrawingExtractionResult
): CadDrawingMatchResult {
  const cadFeatures = cad.features || [];
  const cadBbox = cad.bbox || { min: [0, 0, 0], max: [0, 0, 0], size: [0, 0, 0] };
  const sizeX = cadBbox.size[0] || 0;
  const sizeY = cadBbox.size[1] || 0;
  const sizeZ = cadBbox.size[2] || 0;

  const usedCadFeatureIds = new Set<string>();
  const matchedDims: MatchedInspectionDimension[] = [];

  let matchedCount = 0;
  let op10Count = 0;
  let op20Count = 0;

  for (const dim of drawing.dimensions) {
    const nom = dim.nominal;
    let assignedCadId: string | undefined;
    let assignedCenter: [number, number, number] | undefined;
    let assignedNormal: [number, number, number] | undefined;
    let assignedInstances: MatchedCadInstance[] | undefined;
    let assignedAxialMin: number | undefined;
    let assignedAxialMax: number | undefined;
    let assignedStemBlocked: boolean | undefined;
    let confidence: 'EXACT' | 'ENVELOPE' | 'RADIUS_HALF' | 'UNMATCHED' = 'UNMATCHED';

    const countMatch = `${dim.nominal_str || ''} ${dim.type_label || ''}`.match(/\b(\d+)\s*[xX×]\b/);
    const explicitCount = countMatch ? Math.max(1, parseInt(countMatch[1], 10)) : 1;
    let matchScore = 0;
    let matchStatus: 'VERIFIED_EXACT' | 'VERIFIED_TOPOLOGY' | 'NEEDS_REVIEW' | 'UNMATCHED' | 'ENGINEER_LOCKED' = 'UNMATCHED';
    let assignedFaceACenter: [number, number, number] | undefined;
    let assignedFaceBCenter: [number, number, number] | undefined;
    let assignedFaceANormal: [number, number, number] | undefined;
    let assignedFaceBNormal: [number, number, number] | undefined;
    let assignedDistType: string | undefined;
    let assignedAxis: 'X' | 'Y' | 'Z' | undefined;

    if (dim.type === 'DIAMETER' || /dia|çap|delik|bore|m3|m4/i.test(dim.type_label || '')) {
      let bestFeat: (typeof cadFeatures)[0] | undefined;
      let minDelta = Infinity;
      let bestScore = 0;

      for (const feat of cadFeatures) {
        if (usedCadFeatureIds.has(feat.id)) continue;
        if (
          (feat.feature_type === 'INTERNAL_CYLINDER' || feat.feature_type === 'EXTERNAL_CYLINDER') &&
          feat.nominal_dimension !== undefined
        ) {
          const delta = Math.abs(feat.nominal_dimension - nom);
          if (delta <= FEATURE_MATCH_TOLERANCE) {
            const deltaScore = delta <= 0.02 ? 40 : (delta <= 0.05 ? 35 : (delta <= 0.15 ? 25 : (delta <= 0.50 ? 15 : 5)));
            const typeScore = 20;
            const score = deltaScore + typeScore + 25;
            if (score > bestScore || (score === bestScore && delta < minDelta)) {
              bestScore = score;
              minDelta = delta;
              bestFeat = feat;
            }
          }
        }
      }

      if (bestFeat) {
        const extBest = bestFeat as (typeof cadFeatures)[0] & {
          axial_min?: number;
          axial_max?: number;
          stem_blocked?: boolean;
        };
        assignedCadId = bestFeat.id;
        assignedCenter = bestFeat.center;
        assignedNormal = bestFeat.normal;
        assignedAxialMin = extBest.axial_min;
        assignedAxialMax = extBest.axial_max;
        assignedStemBlocked = extBest.stem_blocked;
        confidence = minDelta <= EPSILON ? 'EXACT' : 'ENVELOPE';
        matchScore = bestScore;
        matchStatus = bestScore >= 85 ? 'VERIFIED_EXACT' : (bestScore >= 70 ? 'VERIFIED_TOPOLOGY' : 'NEEDS_REVIEW');
        usedCadFeatureIds.add(bestFeat.id);

        const groupCandidates = cadFeatures.filter(
          (f) =>
            f.feature_type === bestFeat.feature_type &&
            f.nominal_dimension !== undefined &&
            bestFeat.nominal_dimension !== undefined &&
            Math.abs(f.nominal_dimension - bestFeat.nominal_dimension) <= 0.05 &&
            f.center &&
            f.normal
        );
        if (groupCandidates.length > 1) {
          const maxInstances = explicitCount > 1 ? explicitCount : groupCandidates.length;
          assignedInstances = groupCandidates.slice(0, maxInstances).map((f) => {
            const ef = f as typeof extBest;
            usedCadFeatureIds.add(f.id);
            return {
              id: f.id,
              center: f.center as [number, number, number],
              normal: f.normal as [number, number, number],
              axial_min: ef.axial_min,
              axial_max: ef.axial_max,
              stem_blocked: ef.stem_blocked,
            };
          });
        }
      }
    } else if (dim.type === 'RADIUS' || /radius|kavis|yarıçap/i.test(dim.type_label || '')) {
      for (const feat of cadFeatures) {
        if (usedCadFeatureIds.has(feat.id)) continue;
        if (feat.feature_type === 'INTERNAL_CYLINDER') continue;
        if (feat.nominal_dimension !== undefined) {
          const featRadius = feat.nominal_dimension / 2;
          const deltaHalf = Math.abs(featRadius - nom);
          const deltaDirect = Math.abs(feat.nominal_dimension - nom);
          if (deltaHalf <= FEATURE_MATCH_TOLERANCE || deltaDirect <= FEATURE_MATCH_TOLERANCE) {
            assignedCadId = feat.id;
            assignedCenter = feat.center;
            assignedNormal = feat.normal;
            confidence = 'RADIUS_HALF';
            matchScore = 92;
            matchStatus = 'VERIFIED_EXACT';
            usedCadFeatureIds.add(feat.id);
            break;
          }
        }
      }
    } else if (dim.type === 'LINEAR' || /boyut|mesafe|boy|uzunluk|kalınlık/i.test(dim.type_label || '')) {
      const dimAxis = (dim as unknown as { inferred_axis?: 'X' | 'Y' | 'Z' }).inferred_axis;
      if (Math.abs(sizeX - nom) <= ENVELOPE_EPSILON) {
        assignedCadId = 'CAD_BBOX_X';
        assignedCenter = [cadBbox.max[0], (cadBbox.min[1] + cadBbox.max[1]) / 2, (cadBbox.min[2] + cadBbox.max[2]) / 2];
        assignedNormal = [1, 0, 0];
        confidence = 'ENVELOPE';
        matchScore = 90;
        matchStatus = 'VERIFIED_EXACT';
        assignedAxis = 'X';
        assignedDistType = 'EXTERNAL_WIDTH';
        assignedFaceACenter = [cadBbox.min[0], (cadBbox.min[1] + cadBbox.max[1]) / 2, (cadBbox.min[2] + cadBbox.max[2]) / 2];
        assignedFaceBCenter = [cadBbox.max[0], (cadBbox.min[1] + cadBbox.max[1]) / 2, (cadBbox.min[2] + cadBbox.max[2]) / 2];
        assignedFaceANormal = [-1, 0, 0];
        assignedFaceBNormal = [1, 0, 0];
      } else if (Math.abs(sizeZ - nom) <= ENVELOPE_EPSILON) {
        assignedCadId = 'CAD_BBOX_Z';
        assignedCenter = [(cadBbox.min[0] + cadBbox.max[0]) / 2, (cadBbox.min[1] + cadBbox.max[1]) / 2, cadBbox.max[2]];
        assignedNormal = [0, 0, 1];
        confidence = 'ENVELOPE';
        matchScore = 90;
        matchStatus = 'VERIFIED_EXACT';
        assignedAxis = 'Z';
        assignedDistType = 'EXTERNAL_WIDTH';
        assignedFaceACenter = [(cadBbox.min[0] + cadBbox.max[0]) / 2, (cadBbox.min[1] + cadBbox.max[1]) / 2, cadBbox.min[2]];
        assignedFaceBCenter = [(cadBbox.min[0] + cadBbox.max[0]) / 2, (cadBbox.min[1] + cadBbox.max[1]) / 2, cadBbox.max[2]];
        assignedFaceANormal = [0, 0, -1];
        assignedFaceBNormal = [0, 0, 1];
      } else if (Math.abs(sizeY - nom) <= ENVELOPE_EPSILON) {
        assignedCadId = 'CAD_BBOX_Y';
        assignedCenter = [(cadBbox.min[0] + cadBbox.max[0]) / 2, cadBbox.max[1], (cadBbox.min[2] + cadBbox.max[2]) / 2];
        assignedNormal = [0, 1, 0];
        confidence = 'ENVELOPE';
        matchScore = 90;
        matchStatus = 'VERIFIED_EXACT';
        assignedAxis = 'Y';
        assignedDistType = 'EXTERNAL_WIDTH';
        assignedFaceACenter = [(cadBbox.min[0] + cadBbox.max[0]) / 2, cadBbox.min[1], (cadBbox.min[2] + cadBbox.max[2]) / 2];
        assignedFaceBCenter = [(cadBbox.min[0] + cadBbox.max[0]) / 2, cadBbox.max[1], (cadBbox.min[2] + cadBbox.max[2]) / 2];
        assignedFaceANormal = [0, -1, 0];
        assignedFaceBNormal = [0, 1, 0];
      } else {
        let bestFeat: (typeof cadFeatures)[0] | undefined;
        let minDelta = Infinity;
        let bestScore = 0;

        for (const feat of cadFeatures) {
          if (usedCadFeatureIds.has(feat.id)) continue;
          if (feat.nominal_dimension !== undefined) {
            const delta = Math.abs(feat.nominal_dimension - nom);
            if (delta <= FEATURE_MATCH_TOLERANCE) {
              const deltaScore = delta <= 0.02 ? 40 : (delta <= 0.05 ? 35 : (delta <= 0.15 ? 25 : (delta <= 0.50 ? 15 : 5)));
              const isStepDist = feat.id.startsWith('CAD_STEP_DIST_') || feat.id.startsWith('CAD_DIST_');
              const typeScore = isStepDist ? 20 : (feat.feature_type === 'PLANE' ? 15 : 5);
              const featExt = feat as typeof feat & { axis?: 'X' | 'Y' | 'Z' };
              const axisScore = dimAxis && featExt.axis ? (dimAxis === featExt.axis ? 15 : 0) : 8;
              const countScore = explicitCount > 1 ? 15 : 10;
              const score = deltaScore + typeScore + axisScore + countScore;

              if (score > bestScore || (score === bestScore && delta < minDelta)) {
                bestScore = score;
                minDelta = delta;
                bestFeat = feat;
              }
            }
          }
        }

        if (bestFeat) {
          const bfExt = bestFeat as typeof bestFeat & {
            axis?: 'X' | 'Y' | 'Z';
            distance_type?: string;
            faceA_center?: [number, number, number];
            faceB_center?: [number, number, number];
            faceA_normal?: [number, number, number];
            faceB_normal?: [number, number, number];
          };
          assignedCadId = bestFeat.id;
          assignedCenter = bestFeat.center;
          assignedNormal = bestFeat.normal;
          assignedAxis = bfExt.axis;
          assignedDistType = bfExt.distance_type;
          assignedFaceACenter = bfExt.faceA_center;
          assignedFaceBCenter = bfExt.faceB_center;
          assignedFaceANormal = bfExt.faceA_normal;
          assignedFaceBNormal = bfExt.faceB_normal;
          confidence = minDelta <= EPSILON ? 'EXACT' : 'ENVELOPE';
          matchScore = bestScore;
          matchStatus = bestScore >= 85 ? 'VERIFIED_EXACT' : (bestScore >= 70 ? 'VERIFIED_TOPOLOGY' : 'NEEDS_REVIEW');
          usedCadFeatureIds.add(bestFeat.id);
        }
      }
    }

    let operation: 'OP10' | 'OP20' = 'OP10';
    let opReason = 'Z- probu ile OP10 üstten tek bağlamada ölçülebilir';

    const descLower = `${dim.type_label || ''} ${dim.nominal_str || ''} ${dim.datum_reference || ''}`.toLowerCase();
    const isRearOrBottomKeyword =
      descLower.includes('arka') ||
      descLower.includes('alt') ||
      descLower.includes('bottom') ||
      descLower.includes('rear') ||
      descLower.includes('back') ||
      descLower.includes('ters') ||
      descLower.includes('taban') ||
      descLower.includes('b-b') ||
      descLower.includes('kesit b') ||
      descLower.includes('datum d');

    if (assignedNormal) {
      if (assignedNormal[2] < -0.15) {
        operation = 'OP20';
        opReason = 'Yüzey normali granit tablaya bakıyor (Normal Z < 0)';
      } else {
        operation = 'OP10';
      }
    } else if (isRearOrBottomKeyword) {
      operation = 'OP20';
      opReason = 'Teknik resim ifadesinde alt/arka görünüş unsuru';
    } else if (dim.page && dim.page >= 3) {
      operation = 'OP20';
      opReason = 'Sayfa 3 ters bağlama (OP20) unsuru';
    } else if (dim.page && dim.page === 2 && (/delik|montaj|hole|bore|slot/i.test(descLower) || isRearOrBottomKeyword)) {
      operation = 'OP20';
      opReason = 'Sayfa 2 arka yüzey montaj / delik grubu (OP20)';
    }

    if (operation === 'OP10') {
      op10Count++;
    } else {
      op20Count++;
    }

    if (confidence !== 'UNMATCHED') {
      matchedCount++;
    }

    matchedDims.push({
      id: dim.id,
      balloon: dim.balloon,
      page: dim.page,
      type: dim.type,
      type_label: dim.type_label,
      icon: dim.icon,
      nominal: dim.nominal,
      nominal_str: dim.nominal_str,
      upper_tol: dim.upper_tol,
      lower_tol: dim.lower_tol,
      measured: dim.measured,
      deviation: dim.deviation,
      status: confidence === 'UNMATCHED' ? 'WARN' : dim.status,
      feature_key: assignedCadId || dim.feature_key,
      gdt: dim.gdt,
      datum_reference: dim.datum_reference,
      bbox: dim.bbox,
      cad_feature_id: assignedCadId,
      cad_center: assignedCenter,
      cad_normal: assignedNormal,
      cad_instances: assignedInstances,
      axial_min: assignedAxialMin,
      axial_max: assignedAxialMax,
      stem_blocked: assignedStemBlocked,
      operation,
      op_reason: opReason,
      match_confidence: confidence,
      match_score: matchScore,
      match_status: matchStatus,
      inferred_axis: assignedAxis,
      distance_type: assignedDistType,
      faceA_center: assignedFaceACenter,
      faceB_center: assignedFaceBCenter,
      faceA_normal: assignedFaceANormal,
      faceB_normal: assignedFaceBNormal,
    });
  }

  const total = drawing.dimensions.length;
  const matchPercentage = total > 0 ? parseFloat(((matchedCount / total) * 100).toFixed(1)) : 100.0;

  return {
    part_number: drawing.title_block?.part_number || drawing.filename || cad.model_name,
    total_dimensions: total,
    matched_count: matchedCount,
    unmatched_count: total - matchedCount,
    match_percentage: matchPercentage,
    op10_count: op10Count,
    op20_count: op20Count,
    dimensions: matchedDims,
  };
}
