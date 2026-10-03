import { describe, it, expect } from 'vitest';
import { InspectionCardFormatter, type FormattedInspectionCard } from './InspectionCardFormatter';

describe('InspectionCardFormatter (Pure Utility)', () => {
  it('GD&T dizesinden [A], [A|B], [A|B|C] datum referanslarını başarıyla ayrıştırır', () => {
    expect(InspectionCardFormatter.extractDatumReference('| A')).toBe('[A]');
    expect(InspectionCardFormatter.extractDatumReference('| A | B')).toBe('[A|B]');
    expect(InspectionCardFormatter.extractDatumReference('⌖ Ø 0.100 | A | B | C')).toBe('[A|B|C]');
    expect(InspectionCardFormatter.extractDatumReference(undefined, ['A', 'B'])).toBe('[A|B]');
    expect(InspectionCardFormatter.extractDatumReference(undefined, [])).toBe('[A]');
  });

  it('Tolerans aralıklarını temiz ve okunaklı biçimlendirir', () => {
    expect(InspectionCardFormatter.formatToleranceRange('-0.100', '+0.100')).toBe('±0.1');
    expect(InspectionCardFormatter.formatToleranceRange('-0.500', '+0.500')).toBe('±0.5');
    expect(InspectionCardFormatter.formatToleranceRange('0.000', '+0.200')).toBe('+0.2 / 0');
    expect(InspectionCardFormatter.formatToleranceRange('-0.200', '0.000', '35 (-0.2 / 0)')).toBe('-0.2 / 0');
    expect(InspectionCardFormatter.formatToleranceRange('-0.100', '+0.100', '36.5 ±0.1')).toBe('±0.1');
  });

  it('Unsur adını ve nominal değeri anlaşılır başlığa çevirir', () => {
    const title1 = InspectionCardFormatter.formatFeatureTitle('Tam Boy (Overall Length)', '395.5');
    expect(title1).toContain('Tam Boy');
    expect(title1).toContain('395.5');

    const title2 = InspectionCardFormatter.formatFeatureTitle('Montaj Delik Grubu', '4x Ø2.5');
    expect(title2).toContain('4x Ø2.5');

    const title3 = InspectionCardFormatter.formatFeatureTitle('Yüzey Profili', 'Profil 0.5 | A');
    expect(title3).toContain('Çatı Profil Toleransı');
  });

  it('renderCardHtml ve renderListContainerHtml doğru HTML çıktısı ve 4 ana alanı içerir', () => {
    const card: FormattedInspectionCard = {
      id: 8,
      balloon: '#8',
      page: 3,
      featureTitle: 'Kare Flanş Bağlantı Delikleri (4x Ø3.5)',
      nominalStr: '4x Ø3.5 (+0.2 / 0)',
      toleranceRange: '+0.2 / 0',
      datumReference: '[A|B|C]',
      status: 'PASS',
      featureKey: 'detay_m_holes_4x_dia_3_5',
      selected: true,
    };

    const cardHtml = InspectionCardFormatter.renderCardHtml(card);
    expect(cardHtml).toContain('#8');
    expect(cardHtml).toContain('S.3');
    expect(cardHtml).toContain('Kare Flanş Bağlantı Delikleri');
    expect(cardHtml).toContain('+0.2 / 0');
    expect(cardHtml).toContain('[A|B|C]');
    expect(cardHtml).toContain('active');

    const listHtml = InspectionCardFormatter.renderListContainerHtml([card]);
    expect(listHtml).toContain('Ölçülecek Özellikler');
    expect(listHtml).toContain('Top: 1 Eleman');
  });
});
