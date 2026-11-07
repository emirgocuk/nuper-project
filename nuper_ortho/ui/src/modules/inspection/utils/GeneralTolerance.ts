interface LinearBand {
  upTo: number;
  f: number | null;
  m: number;
  c: number;
  v: number | null;
}

const ISO_2768_1_LINEAR: readonly LinearBand[] = [
  { upTo: 3, f: 0.05, m: 0.1, c: 0.2, v: null },
  { upTo: 6, f: 0.05, m: 0.1, c: 0.3, v: 0.5 },
  { upTo: 30, f: 0.1, m: 0.2, c: 0.5, v: 1.0 },
  { upTo: 120, f: 0.15, m: 0.3, c: 0.8, v: 1.5 },
  { upTo: 400, f: 0.2, m: 0.5, c: 1.2, v: 2.5 },
  { upTo: 1000, f: 0.3, m: 0.8, c: 2.0, v: 4.0 },
  { upTo: 2000, f: 0.5, m: 1.2, c: 3.0, v: 6.0 },
  { upTo: 4000, f: null, m: 2.0, c: 4.0, v: 8.0 },
];

const MIN_NOMINAL_MM = 0.5;

export const GENERAL_TOLERANCE_PRESETS: readonly string[] = [
  'ISO 2768-f',
  'ISO 2768-m',
  'ISO 2768-c',
  'ISO 2768-v',
  'ISO 2768-fH',
  'ISO 2768-mK',
  'ISO 2768-cL',
];

export interface ResolvedTolerance {
  upper: string;
  lower: string;
}

function format(value: number): ResolvedTolerance {
  const abs = value.toFixed(3);
  return { upper: `+${abs}`, lower: `-${abs}` };
}

function isoLinear(cls: 'f' | 'm' | 'c' | 'v', nominal: number): number | null {
  if (nominal < MIN_NOMINAL_MM) return null;
  const band = ISO_2768_1_LINEAR.find((b) => nominal <= b.upTo);
  return band ? band[cls] : null;
}

export function resolveGeneralTolerance(spec: string, nominal: number): ResolvedTolerance | null {
  if (!spec || !Number.isFinite(nominal)) return null;

  const iso = /2768[\s-]*([fmcv])/i.exec(spec);
  if (iso) {
    const value = isoLinear(iso[1].toLowerCase() as 'f' | 'm' | 'c' | 'v', Math.abs(nominal));
    return value === null ? null : format(value);
  }

  const block = /±\s*([0-9]+(?:[.,][0-9]+)?)/.exec(spec);
  if (block) {
    const value = parseFloat(block[1].replace(',', '.'));
    return value > 0 ? format(value) : null;
  }

  return null;
}
