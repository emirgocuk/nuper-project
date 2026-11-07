import { describe, it, expect } from 'vitest';
import { resolveGeneralTolerance, GENERAL_TOLERANCE_PRESETS } from './GeneralTolerance';

describe('resolveGeneralTolerance', () => {
  it('ISO 2768-m için aralığa göre ±tolerans verir', () => {
    expect(resolveGeneralTolerance('ISO 2768-m', 2)).toEqual({ upper: '+0.100', lower: '-0.100' });
    expect(resolveGeneralTolerance('ISO 2768-m', 25.9)).toEqual({ upper: '+0.200', lower: '-0.200' });
    expect(resolveGeneralTolerance('ISO 2768-m', 49.4)).toEqual({ upper: '+0.300', lower: '-0.300' });
    expect(resolveGeneralTolerance('ISO 2768-m', 150)).toEqual({ upper: '+0.500', lower: '-0.500' });
  });

  it('mK gibi geometrik harfli sınıfta doğrusal harfi kullanır', () => {
    expect(resolveGeneralTolerance('ISO 2768-mK', 20)).toEqual({ upper: '+0.200', lower: '-0.200' });
    expect(resolveGeneralTolerance('ISO 2768 mK', 20)).toEqual({ upper: '+0.200', lower: '-0.200' });
  });

  it('f ve c sınıflarını ayırır, tanımsız hücrede null döner', () => {
    expect(resolveGeneralTolerance('ISO 2768-f', 20)).toEqual({ upper: '+0.100', lower: '-0.100' });
    expect(resolveGeneralTolerance('ISO 2768-c', 20)).toEqual({ upper: '+0.500', lower: '-0.500' });
    expect(resolveGeneralTolerance('ISO 2768-v', 2)).toBeNull();
    expect(resolveGeneralTolerance('ISO 2768-f', 3000)).toBeNull();
  });

  it('antet blok toleransını (±0.2/±1°) doğrusal ölçüye uygular', () => {
    expect(resolveGeneralTolerance('±0.2/±1°', 49.4)).toEqual({ upper: '+0.200', lower: '-0.200' });
  });

  it('boş, çözülemeyen veya 0.5 mm altı ölçü için değer uydurmaz', () => {
    expect(resolveGeneralTolerance('', 10)).toBeNull();
    expect(resolveGeneralTolerance('belirsiz', 10)).toBeNull();
    expect(resolveGeneralTolerance('ISO 2768-m', 0.3)).toBeNull();
    expect(resolveGeneralTolerance('ISO 2768-m', Number.NaN)).toBeNull();
  });

  it('hazır seçeneklerin hepsi bir doğrusal sınıfa çözülür', () => {
    for (const preset of GENERAL_TOLERANCE_PRESETS) {
      const tol = resolveGeneralTolerance(preset, 20);
      expect(tol).not.toBeNull();
    }
  });
});
