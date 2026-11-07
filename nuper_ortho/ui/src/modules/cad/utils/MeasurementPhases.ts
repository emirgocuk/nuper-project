export type MeasurementPhase = 'DISTANCE' | 'POSITION' | 'THICKNESS';

interface PhaseClassifiable {
  type?: string;
  type_label?: string;
  gdt?: string;
  cad_feature_id?: string;
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
