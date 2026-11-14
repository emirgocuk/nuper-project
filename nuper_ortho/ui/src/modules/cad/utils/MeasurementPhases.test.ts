import { describe, it, expect } from 'vitest';
import { classifyMeasurementPhase, orderByMeasurementPhase } from './MeasurementPhases';
import { selectStylusForHole } from './StylusSelector';

describe('MeasurementPhases', () => {
  it('delik, konum ve çap ölçülerini POSITION aşamasına koyar', () => {
    expect(classifyMeasurementPhase({ type: 'DIAMETER' })).toBe('POSITION');
    expect(classifyMeasurementPhase({ cad_feature_id: 'CAD_HOLE_Ø3.00_1' })).toBe('POSITION');
    expect(classifyMeasurementPhase({ type_label: 'Konum Toleransı', gdt: '⌖' })).toBe('POSITION');
  });

  it('kalınlık ve yüksekliği THICKNESS, diğer doğrusal ölçüyü DISTANCE yapar', () => {
    expect(classifyMeasurementPhase({ type_label: 'Levha Kalınlığı' })).toBe('THICKNESS');
    expect(classifyMeasurementPhase({ cad_feature_id: 'CAD_BBOX_Y' })).toBe('THICKNESS');
    expect(classifyMeasurementPhase({ type: 'LINEAR', type_label: 'Doğrusal Boyut' })).toBe('DISTANCE');
  });

  it('sırayı mesafe → konum → kalınlık yapar ve aşama içinde girdi sırasını korur', () => {
    const ordered = orderByMeasurementPhase([
      { id: 1, type: 'LINEAR', type_label: 'Kalınlık' },
      { id: 2, type: 'DIAMETER' },
      { id: 3, type: 'LINEAR', type_label: 'Doğrusal Boyut' },
      { id: 4, type: 'DIAMETER' },
      { id: 5, type: 'LINEAR', type_label: 'Doğrusal Boyut' },
    ]);
    expect(ordered.map((f) => f.id)).toEqual([3, 5, 2, 4, 1]);
  });
});

describe('StylusSelector', () => {
  it('Ø2 top delik çapına sığıyorsa Ø2 kalır', () => {
    expect(selectStylusForHole(4.0)).toEqual({ ballDiameterMm: 2.0, feasible: true, changedFromDefault: false });
  });

  it('Ø2 sığmıyorsa Ø1 önerir', () => {
    expect(selectStylusForHole(3.0)).toEqual({
      ballDiameterMm: 1.0,
      feasible: true,
      changedFromDefault: true,
      recommended_stylus: 'Ø1x20',
      recommendedModel: 'PH10M (Ø1x20)',
    });
    expect(selectStylusForHole(2.5)).toEqual({
      ballDiameterMm: 1.0,
      feasible: true,
      changedFromDefault: true,
      recommended_stylus: 'Ø1x20',
      recommendedModel: 'PH10M (Ø1x20)',
    });
  });

  it('Ø1 de sığmıyorsa uygulanamaz işaretler', () => {
    const choice = selectStylusForHole(1.5);
    expect(choice.ballDiameterMm).toBe(1.0);
    expect(choice.feasible).toBe(false);
  });
});
