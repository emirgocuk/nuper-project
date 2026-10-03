import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { NuperApp } from '../../main';
import { InspectionTable } from './InspectionTable';
import type { DrawingExtractionResult } from '../../types/generated/drawing_data';

describe('InspectionTable & Multi-Page Sol Panel Senkronizasyonu', () => {
  let app: NuperApp;
  let gobekData: DrawingExtractionResult;
  const rootDir = path.resolve(__dirname, '..', '..', '..', '..');
  const pdfPath = path.join(
    rootDir,
    'test_assets',
    'KPT - 3051 Gobek Bagı Olugu',
    'GOBEK BAGI OLUGU_TR_AB.pdf'
  );

  beforeEach(() => {
    app = new NuperApp();
    const scriptPath = path.join(rootDir, 'tools', 'drawing_extractor.py');
    const stdout = execFileSync('python', [scriptPath, pdfPath], { encoding: 'utf8' });
    gobekData = JSON.parse(stdout);
  });

  afterEach(() => {
    app.destroy();
  });

  it('Python ayrıştırıcısından 3 sayfalık ve en az 12 doğrulanmış ölçü başarıyla alınır', () => {
    expect(gobekData.success).toBe(true);
    expect(gobekData.page_count).toBe(3);
    expect(gobekData.dimensions.length).toBeGreaterThanOrEqual(12);

    const page2Dims = gobekData.dimensions.filter((d) => d.page === 2);
    const page3Dims = gobekData.dimensions.filter((d) => d.page === 3);

    expect(page2Dims.length).toBe(6);
    expect(page3Dims.length).toBe(6);
  });

  it('Sol panel tek bir birleşik "Ölçülecek Özellikler (Top: X Eleman)" listesi üretir', () => {
    const table = new InspectionTable();
    table.setExtractionResult(gobekData);

    const mockContainer = { innerHTML: '' } as unknown as HTMLElement;
    table.mount(mockContainer);

    expect(mockContainer.innerHTML).toContain('Ölçülecek Özellikler');
    expect(mockContainer.innerHTML).toContain('Top: 12 Eleman');

    // 12 ölçünün tümünün render edildiğini doğrula
    const cards = table.getFormattedCards();
    expect(cards.length).toBe(12);

    // Her kartın 4 kritik bilgiyi içerdiğini doğrula
    for (const card of cards) {
      expect(card.balloon).toMatch(/^#\d+$/);
      expect(card.featureTitle.length).toBeGreaterThan(0);
      expect(card.nominalStr.length).toBeGreaterThan(0);
      expect(card.toleranceRange.length).toBeGreaterThan(0);
      expect(card.datumReference).toMatch(/^\[[A-Z](\|[A-Z])*\]$/);
    }
  });

  it('Sayfa 2 ve Sayfa 3 özel ölçüleri ve tolerans aralıkları eksiksiz listelenir', () => {
    const table = new InspectionTable();
    table.setExtractionResult(gobekData);
    const cards = table.getFormattedCards();

    // Sayfa 2 ölçüleri:
    const dim1 = cards.find((c) => c.id === 1);
    expect(dim1?.nominalStr).toBe('395.5');
    expect(dim1?.datumReference).toBe('[A]');
    expect(dim1?.page).toBe(2);

    const dim3 = cards.find((c) => c.id === 3);
    expect(dim3?.nominalStr).toContain('35');
    expect(dim3?.toleranceRange).toBe('-0.2 / 0');
    expect(dim3?.datumReference).toBe('[A|B]');

    const dim4 = cards.find((c) => c.id === 4);
    expect(dim4?.nominalStr).toBe('4x Ø2.5');

    // Sayfa 3 kritik ölçüleri:
    const dim7 = cards.find((c) => c.id === 7);
    expect(dim7?.nominalStr).toBe('36.5 ±0.1');
    expect(dim7?.toleranceRange).toBe('±0.1');
    expect(dim7?.page).toBe(3);

    const dim8 = cards.find((c) => c.id === 8);
    expect(dim8?.nominalStr).toBe('4x Ø3.5 (+0.2 / 0)');
    expect(dim8?.toleranceRange).toBe('+0.2 / 0');
    expect(dim8?.datumReference).toBe('[A|B|C]');

    const dim9 = cards.find((c) => c.id === 9);
    expect(dim9?.nominalStr).toBe('Ø43 (+0.5 / 0)');

    const dim10 = cards.find((c) => c.id === 10);
    expect(dim10?.nominalStr).toBe('Ø21 (+0.25 / 0)');

    const dim11 = cards.find((c) => c.id === 11);
    expect(dim11?.nominalStr).toBe('12 ±0.5');

    const dim12 = cards.find((c) => c.id === 12);
    expect(dim12?.nominalStr).toBe('9.11 (+0 / -0.25)');
    expect(dim12?.toleranceRange).toBe('+0 / -0.25');
  });

  it('Sol listeden bir ölçü seçildiğinde ilgili sayfa otomatik açılır, 2D balon parlar ve 3D CAD vurgulanır', () => {
    app.loadDrawingData(gobekData);

    const drawingCanvas = app.getDrawingCanvas();
    const cadViewer = app.getCADViewer();
    const table = app.getInspectionTable();

    expect(drawingCanvas.getTotalPages()).toBe(3);

    // Başlangıçta Sayfa 1
    drawingCanvas.setActivePage(1);
    expect(drawingCanvas.getActivePage()).toBe(1);

    // 1. Senaryo: Sayfa 3'teki #8 (4x Ø3.5) seçildiğinde
    table.selectRow(8);

    // Sayfa 3 otomatik aktif olmalı
    expect(drawingCanvas.getActivePage()).toBe(3);
    // 2D Kanvasta Balon #8 seçilmeli
    expect(drawingCanvas.getSelectedBalloonId()).toBe('8');
    // 3D CAD üzerinde ilgili delik grubu vurgulanmalı
    expect(cadViewer.getHighlightedFeature()).toBe('detay_m_holes_4x_dia_3_5');

    // 2. Senaryo: Sayfa 2'deki #1 (Tam Boy) seçildiğinde
    table.selectRow(1);

    // Sayfa 2 otomatik aktif olmalı
    expect(drawingCanvas.getActivePage()).toBe(2);
    expect(drawingCanvas.getSelectedBalloonId()).toBe('1');
    expect(cadViewer.getHighlightedFeature()).toBe('overall_length_395_5');
  });

  it('DrawingCanvas sayfa filtrelemesi yalnızca aktif sayfaya ait balonları döndürür', () => {
    app.loadDrawingData(gobekData);
    const drawingCanvas = app.getDrawingCanvas();

    drawingCanvas.setActivePage(2);
    const p2Balloons = drawingCanvas.getBalloonsForActivePage();
    expect(p2Balloons.length).toBe(6);
    expect(p2Balloons.every((b) => b.page === 2)).toBe(true);

    drawingCanvas.setActivePage(3);
    const p3Balloons = drawingCanvas.getBalloonsForActivePage();
    expect(p3Balloons.length).toBe(6);
    expect(p3Balloons.every((b) => b.page === 3)).toBe(true);
  });
});
