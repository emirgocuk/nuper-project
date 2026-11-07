export interface FeatureTypeOption {
  value: string;
  label: string;
  code: string;
  svg: string;
}

export function getFeatureTypeSvg(type: string): string {
  const norm = (type || '').toUpperCase().trim();
  switch (norm) {
    case 'DIAMETER':
    case 'HOLE':
    case 'CYLINDER':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="6"/><line x1="4" y1="14" x2="14" y2="4"/></svg>`;

    case 'LINEAR':
    case 'DISTANCE':
    case 'LENGTH':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="3" x2="2" y2="15"/><line x1="16" y1="3" x2="16" y2="15"/><line x1="2" y1="9" x2="16" y2="9"/><polygon points="5,7 2,9 5,11" fill="currentColor"/><polygon points="13,7 16,9 13,11" fill="currentColor"/></svg>`;

    case 'RADIUS':
    case 'FILLET':
    case 'ROUND':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 14 A 9 9 0 0 1 14 4"/><line x1="4" y1="14" x2="11" y2="7"/><polygon points="9.5,6 12.5,5.5 12,8.5" fill="currentColor"/></svg>`;

    case 'ANGLE':
    case 'CONE':
    case 'ANGULAR':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="3" y1="14" x2="15" y2="14"/><line x1="3" y1="14" x2="12" y2="5"/><path d="M8 14 A 5 5 0 0 1 10 9.5"/></svg>`;

    case 'CHAMFER':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 15 L3 5 L8 5 L15 12 L15 15 Z"/><line x1="8" y1="5" x2="15" y2="12" stroke="#0284C7" stroke-width="2.2"/></svg>`;

    case 'THREAD':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="4" y1="2" x2="4" y2="16"/><line x1="14" y1="2" x2="14" y2="16"/><line x1="4" y1="5" x2="14" y2="7"/><line x1="4" y1="9" x2="14" y2="11"/><line x1="4" y1="13" x2="14" y2="15"/></svg>`;

    case 'POSITION':
    case 'GD_T':
    case 'GDT':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="5.5"/><line x1="9" y1="1" x2="9" y2="17"/><line x1="1" y1="9" x2="17" y2="9"/></svg>`;

    case 'PLANE':
    case 'FLATNESS':
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="6,4 16,4 12,14 2,14"/></svg>`;

    default:
      return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="12" height="12" rx="2"/></svg>`;
  }
}

export function getFeatureTypeOptions(): FeatureTypeOption[] {
  return [
    { value: 'DIAMETER', label: 'Çap (DIAMETER / Ø)', code: 'Ø', svg: getFeatureTypeSvg('DIAMETER') },
    { value: 'LINEAR', label: 'Doğrusal Boyut (LINEAR / ⟷)', code: '⟷', svg: getFeatureTypeSvg('LINEAR') },
    { value: 'RADIUS', label: 'Radyus / Kavis (RADIUS / R)', code: 'R', svg: getFeatureTypeSvg('RADIUS') },
    { value: 'ANGLE', label: 'Açı / Koniklik (ANGLE / ∠)', code: '∠', svg: getFeatureTypeSvg('ANGLE') },
    { value: 'CHAMFER', label: 'Pah Kırma (CHAMFER / ◺)', code: '◺', svg: getFeatureTypeSvg('CHAMFER') },
    { value: 'THREAD', label: 'Vida / Diş (THREAD / M)', code: 'M', svg: getFeatureTypeSvg('THREAD') },
    { value: 'POSITION', label: 'Konum / GD&T (POSITION / ⌖)', code: '⌖', svg: getFeatureTypeSvg('POSITION') },
    { value: 'PLANE', label: 'Düzlem / Yüzey (PLANE / ⏥)', code: '⏥', svg: getFeatureTypeSvg('PLANE') },
  ];
}

export function parseDatumReference(raw: string): string[] {
  if (!raw) return [];
  const clean = raw.replace(/[\[\]]/g, ' ').trim();
  if (!clean) return [];
  const parts = clean.split(/[|,;\s]+/).map((s) => s.trim().toUpperCase()).filter((s) => /^[A-Z][0-9]?$/.test(s));
  return Array.from(new Set(parts));
}

export function formatDatumReference(datums: string[]): string {
  if (!datums || datums.length === 0) return '';
  return `[${datums.join('|')}]`;
}

