export type MeasurementPhase = 'DISTANCE' | 'POSITION' | 'THICKNESS';

export interface PhaseClassifiable {
  id?: number;
  balloon?: string;
  type?: string;
  type_label?: string;
  gdt?: string;
  nominal?: number;
  cad_feature_id?: string;
  cad_center?: [number, number, number];
  operation?: 'OP10' | 'OP20';
  ph10Angle?: string;
}

const PHASE_RANK: Record<MeasurementPhase, number> = {
  DISTANCE: 0,
  POSITION: 1,
  THICKNESS: 2,
};

const THICKNESS_PATTERN = /kal[ıi]nl[ıi][kğg]|thickness|y[üu]kseklik|height/i;
const POSITION_PATTERN = /konum|position|⌖|dia|çap|delik|hole/i;

export function classifyMeasurementPhase(feature: PhaseClassifiable): MeasurementPhase {
  const text = `${feature.type ?? ''} ${feature.type_label ?? ''} ${feature.gdt ?? ''}`;
  if (feature.cad_feature_id === 'CAD_BBOX_Y' || THICKNESS_PATTERN.test(text)) return 'THICKNESS';
  if (feature.type === 'DIAMETER' || feature.cad_feature_id?.startsWith('CAD_HOLE_') || POSITION_PATTERN.test(text)) {
    return 'POSITION';
  }
  return 'DISTANCE';
}

export function orderByMeasurementPhase<T extends PhaseClassifiable>(features: readonly T[]): T[] {
  return features
    .map((feature, index) => ({ feature, index, rank: PHASE_RANK[classifyMeasurementPhase(feature)] }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.feature);
}

export function orderFeaturesByMetrologyDiscipline<T extends PhaseClassifiable>(
  features: readonly T[],
  verticalAxis: 'Y' | 'Z' = 'Y'
): T[] {
  const isDatum = (f: T): boolean => {
    const text = `${f.balloon ?? ''} ${f.type_label ?? ''} ${f.cad_feature_id ?? ''}`.toUpperCase();
    return text.includes('DATUM') || text.includes('PCS_') || text.includes('SIFIR');
  };

  const datums = features.filter(isDatum);
  const nonDatums = features.filter((f) => !isDatum(f));

  const isOp20OrAngled = (f: T): boolean => {
    if (f.operation === 'OP20') return true;
    if (f.ph10Angle && f.ph10Angle !== 'A0° B0°' && f.ph10Angle !== 'A0B0') return true;
    return false;
  };

  const op10 = nonDatums.filter((f) => !isOp20OrAngled(f));
  const op20 = nonDatums.filter(isOp20OrAngled);

  const solveTspNearestNeighbor = (pool: T[]): T[] => {
    if (pool.length <= 1) return [...pool];
    const remaining = [...pool];
    const ordered: T[] = [];
    let current = remaining.shift()!;
    ordered.push(current);

    while (remaining.length > 0) {
      const cCenter = current.cad_center ?? [0, 0, 0];
      const cx = cCenter[0];
      const cz = verticalAxis === 'Y' ? cCenter[2] : cCenter[1];

      let bestIdx = 0;
      let minSqDist = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const nCenter = remaining[i].cad_center ?? [0, 0, 0];
        const nx = nCenter[0];
        const nz = verticalAxis === 'Y' ? nCenter[2] : nCenter[1];
        const dx = nx - cx;
        const dz = nz - cz;
        const distSq = dx * dx + dz * dz;
        if (distSq < minSqDist) {
          minSqDist = distSq;
          bestIdx = i;
        }
      }

      current = remaining.splice(bestIdx, 1)[0];
      ordered.push(current);
    }

    return ordered;
  };

  const distanceGroup = op10.filter((f) => classifyMeasurementPhase(f) === 'DISTANCE');
  const positionGroup = op10.filter((f) => classifyMeasurementPhase(f) === 'POSITION');
  const thicknessGroup = op10.filter((f) => classifyMeasurementPhase(f) === 'THICKNESS');

  const sortedOp10 = [
    ...solveTspNearestNeighbor(distanceGroup),
    ...solveTspNearestNeighbor(positionGroup),
    ...solveTspNearestNeighbor(thicknessGroup),
  ];

  const angleBuckets = new Map<string, T[]>();
  for (const f of op20) {
    const key = f.ph10Angle || 'A0° B90°';
    const list = angleBuckets.get(key) || [];
    list.push(f);
    angleBuckets.set(key, list);
  }

  const sortedOp20: T[] = [];
  for (const bucket of angleBuckets.values()) {
    sortedOp20.push(...solveTspNearestNeighbor(orderByMeasurementPhase(bucket)));
  }

  return [...datums, ...sortedOp10, ...sortedOp20];
}
