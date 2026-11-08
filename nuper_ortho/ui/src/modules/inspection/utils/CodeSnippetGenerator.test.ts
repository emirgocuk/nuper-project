import { describe, it, expect } from 'vitest';
import {
  CodeSnippetGenerator,
  compensateThermalExpansion,
  type CodeSnippetContext,
} from './CodeSnippetGenerator';
import type { InspectionDimension } from './InspectionSynchronizer';

describe('CodeSnippetGenerator (Pure Utility)', () => {
  const dummyDims: InspectionDimension[] = [
    {
      id: 1,
      balloon: '#1',
      page: 1,
      type: 'DIAMETER',
      type_label: 'Silindirik Delik',
      nominal: 20.0,
      nominal_str: 'Ø20.0',
      lower_tol: '0.000',
      upper_tol: '+0.021',
      datum_reference: '[A|B|C]',
      status: 'PASS',
      measured: '20.005',
      deviation: '+0.005',
    },
    {
      id: 2,
      balloon: '#2',
      page: 1,
      type: 'DISTANCE',
      type_label: 'Dogrusal Boyut',
      nominal: 45.0,
      nominal_str: '45.0',
      lower_tol: '-0.100',
      upper_tol: '+0.100',
      datum_reference: '[A]',
      status: 'PASS',
      measured: '45.002',
      deviation: '+0.002',
    },
  ];

  const dummyContext: CodeSnippetContext = {
    partName: '10142739_dc_modul_plaka.stp',
    dimensions: dummyDims,
    zClearance: 65.0,
  };

  it('generateAll 10 sekmenin tamamini eksiksiz dinamik dizelerle uretir', () => {
    const snippets = CodeSnippetGenerator.generateAll(dummyContext);
    const expectedKeys = [
      'dmis',
      'calypso',
      'wenzel',
      'threads',
      'ipp',
      'closed_loop',
      'uncertainty',
      'alignment',
      'calibration',
      'license',
      'ipc',
      'as9102',
    ];

    for (const key of expectedKeys) {
      expect(snippets[key]).toBeDefined();
      expect(typeof snippets[key]).toBe('string');
      expect(snippets[key].length).toBeGreaterThan(50);
    }

    expect(snippets.dmis).toContain('10142739_DC_MODUL_PLAKA');
    expect(snippets.dmis).toContain('FILNAM');
    expect(snippets.dmis).toContain('DATSET/DAT(A)');
    expect(snippets.dmis).toContain('DATDEF/FA(FEAT_DATUM_A)');
    expect(snippets.as9102).toContain('SAE AS9102 REV C');
    expect(snippets.as9102).toContain('FORM 3');
    expect(snippets.calypso).toContain('ZEISS CALYPSO ASCII PRUFPLAN GENERATOR');
    expect(snippets.calypso).toContain('10142739_DC_MODUL_PLAKA');
    expect(snippets.wenzel).toContain('WENZEL WM | QUARTIS METROLOGY PROGRAM');
    expect(snippets.threads).toContain('GEÇER MASTAR (GO Plug)');
    expect(snippets.ipp).toContain('StartSession()');
    expect(snippets.closed_loop).toContain('G10 L12');
    expect(snippets.uncertainty).toContain('ISO 15530-3');
    expect(snippets.alignment).toContain('PCS_321');
    expect(snippets.alignment).toContain('det(R) = 1.000000');
    expect(snippets.calibration).toContain('RENISHAW PH10M / TP20');
    expect(snippets.license).toContain('AS9100 REV D');
    expect(snippets.ipc).toContain('TAURI ZERO-COPY IPC RING BUFFER');
  });

  it('compensateThermalExpansion computes ISO 1 20C thermal expansion and net wear offset', () => {
    const res = compensateThermalExpansion(395.5, 0.0800, 'ALUMINUM', 28.0, 20.0);
    expect(res.thermalExpansionMm).toBeCloseTo(0.0731, 3);
    expect(res.netWearDeviationMm).toBeCloseTo(0.0800 - 0.0731, 3);
    expect(res.netWearOffsetMm).toBeCloseTo(-(0.0800 - 0.0731) / 2.0, 3);
  });
});
