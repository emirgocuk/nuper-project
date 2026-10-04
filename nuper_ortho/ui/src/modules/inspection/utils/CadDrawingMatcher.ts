import type { CadMetadata } from '../../../types/generated/cad_metadata';
import type { DrawingExtractionResult } from '../../../types/generated/drawing_data';

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
  operation: 'OP10' | 'OP20';
  match_confidence: 'EXACT' | 'ENVELOPE' | 'RADIUS_HALF' | 'UNMATCHED';
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

const EPSILON = 0.08;
const ENVELOPE_EPSILON = 1.2;

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
    let confidence: 'EXACT' | 'ENVELOPE' | 'RADIUS_HALF' | 'UNMATCHED' = 'UNMATCHED';

    if (dim.type === 'DIAMETER' || /dia|çap|delik/i.test(dim.type_label)) {
      for (const feat of cadFeatures) {
        if (usedCadFeatureIds.has(feat.id)) continue;
        if (
          (feat.feature_type === 'INTERNAL_CYLINDER' || feat.feature_type === 'EXTERNAL_CYLINDER') &&
          feat.nominal_dimension !== undefined
        ) {
          if (Math.abs(feat.nominal_dimension - nom) <= EPSILON) {
            assignedCadId = feat.id;
            assignedCenter = feat.center;
            assignedNormal = feat.normal;
            confidence = 'EXACT';
            usedCadFeatureIds.add(feat.id);
            break;
          }
        }
      }
    } else if (dim.type === 'RADIUS' || /radius|kavis|yarıçap/i.test(dim.type_label)) {
      for (const feat of cadFeatures) {
        if (usedCadFeatureIds.has(feat.id)) continue;
        if (feat.nominal_dimension !== undefined) {
          const featRadius = feat.nominal_dimension / 2;
          if (Math.abs(featRadius - nom) <= EPSILON || Math.abs(feat.nominal_dimension - nom) <= EPSILON) {
            assignedCadId = feat.id;
            assignedCenter = feat.center;
            assignedNormal = feat.normal;
            confidence = 'RADIUS_HALF';
            usedCadFeatureIds.add(feat.id);
            break;
          }
        }
      }
    } else if (dim.type === 'LINEAR' || /boyut|mesafe|boy|uzunluk/i.test(dim.type_label)) {
      if (Math.abs(sizeX - nom) <= ENVELOPE_EPSILON) {
        assignedCadId = 'CAD_BBOX_X';
        assignedCenter = [cadBbox.min[0] + sizeX / 2, cadBbox.min[1], cadBbox.min[2]];
        assignedNormal = [1, 0, 0];
        confidence = 'ENVELOPE';
      } else if (Math.abs(sizeY - nom) <= ENVELOPE_EPSILON) {
        assignedCadId = 'CAD_BBOX_Y';
        assignedCenter = [cadBbox.min[0], cadBbox.min[1] + sizeY / 2, cadBbox.min[2]];
        assignedNormal = [0, 1, 0];
        confidence = 'ENVELOPE';
      } else if (Math.abs(sizeZ - nom) <= ENVELOPE_EPSILON) {
        assignedCadId = 'CAD_BBOX_Z';
        assignedCenter = [cadBbox.min[0], cadBbox.min[1], cadBbox.min[2] + sizeZ / 2];
        assignedNormal = [0, 0, 1];
        confidence = 'ENVELOPE';
      } else {
        for (const feat of cadFeatures) {
          if (usedCadFeatureIds.has(feat.id)) continue;
          if (feat.nominal_dimension !== undefined && Math.abs(feat.nominal_dimension - nom) <= EPSILON) {
            assignedCadId = feat.id;
            assignedCenter = feat.center;
            assignedNormal = feat.normal;
            confidence = 'EXACT';
            usedCadFeatureIds.add(feat.id);
            break;
          }
        }
      }
    }

    let operation: 'OP10' | 'OP20' = 'OP10';
    if (assignedNormal) {
      if (assignedNormal[2] < -0.3) {
        operation = 'OP20';
      } else {
        operation = 'OP10';
      }
    } else if (dim.page && dim.page >= 3) {
      operation = 'OP20';
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
      operation,
      match_confidence: confidence,
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
