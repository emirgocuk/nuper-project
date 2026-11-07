import { describe, it, expect } from 'vitest';
import {
  getFeatureTypeSvg,
  getFeatureTypeOptions,
  parseDatumReference,
  formatDatumReference,
} from './MetrologyIcons';

describe('MetrologyIcons & Datum Utilities', () => {
  it('tüm metroloji tipleri için geçerli SVG markup döner', () => {
    const types = ['DIAMETER', 'LINEAR', 'RADIUS', 'ANGLE', 'CHAMFER', 'THREAD', 'POSITION', 'PLANE'];
    for (const t of types) {
      const svg = getFeatureTypeSvg(t);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('viewBox="0 0 18 18"');
    }
  });

  it('getFeatureTypeOptions standart CMM tiplerini listeler', () => {
    const opts = getFeatureTypeOptions();
    expect(opts.length).toBeGreaterThanOrEqual(7);
    const values = opts.map((o) => o.value);
    expect(values).toContain('DIAMETER');
    expect(values).toContain('LINEAR');
    expect(values).toContain('THREAD');
  });

  it('parseDatumReference köşeli parantezli ve dikey çizgili datumları doğru ayrıştırır', () => {
    expect(parseDatumReference('[A]')).toEqual(['A']);
    expect(parseDatumReference('[A|B|C]')).toEqual(['A', 'B', 'C']);
    expect(parseDatumReference('A | B')).toEqual(['A', 'B']);
    expect(parseDatumReference('')).toEqual([]);
    expect(parseDatumReference('  ')).toEqual([]);
  });

  it('formatDatumReference seçili datum dizisini standart köşeli parantez formatına çevirir', () => {
    expect(formatDatumReference(['A'])).toBe('[A]');
    expect(formatDatumReference(['A', 'B'])).toBe('[A|B]');
    expect(formatDatumReference([])).toBe('');
  });
});

