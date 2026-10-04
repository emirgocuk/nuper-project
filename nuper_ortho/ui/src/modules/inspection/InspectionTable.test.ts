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

    expect(page2Dims.length).toBeGreaterThan(0);
    expect(page3Dims.length).toBeGreaterThan(0);
  });

  it('Sol panel tek bir birleşik "Ölçülecek Özellikler (Top: X Eleman)" listesi üretir', () => {
    const table = new InspectionTable();
    table.setExtractionResult(gobekData);

    const mockContainer = { innerHTML: '' } as unknown as HTMLElement;
    table.mount(mockContainer);

    expect(mockContainer.innerHTML).toContain('Ölçülecek Özellikler');
    expect(mockContainer.innerHTML).toContain(`Top: ${gobekData.dimensions.length} Eleman`);

    // Ölçülerin tümünün render edildiğini doğrula
    const cards = table.getFormattedCards();
    expect(cards.length).toBe(gobekData.dimensions.length);

    // Her kartın kritik bilgileri içerdiğini doğrula
    for (const card of cards) {
      expect(card.balloon).toMatch(/^#\d+$/);
      expect(card.featureTitle.length).toBeGreaterThan(0);
      expect(card.nominalStr.length).toBeGreaterThan(0);
    }
  });

  it('Sayfa 2 ve Sayfa 3 özel ölçüleri ve tolerans aralıkları eksiksiz listelenir', () => {
    const table = new InspectionTable();
    table.setExtractionResult(gobekData);
    const cards = table.getFormattedCards();

    const page2Cards = cards.filter((c) => c.page === 2);
    const page3Cards = cards.filter((c) => c.page === 3);

    expect(page2Cards.length).toBeGreaterThan(0);
    expect(page3Cards.length).toBeGreaterThan(0);

    for (const c of cards) {
      expect(c.page).toBeGreaterThanOrEqual(1);
      expect(c.balloon).toMatch(/^#\d+$/);
      expect(c.nominalStr.length).toBeGreaterThan(0);
    }
  });

  it('Sol listeden bir ölçü seçildiğinde ilgili sayfa otomatik açılır, 2D balon parlar', () => {
    app.loadDrawingData(gobekData);

    const drawingCanvas = app.getDrawingCanvas();
    const table = app.getInspectionTable();

    expect(drawingCanvas.getTotalPages()).toBe(3);

    // Başlangıçta Sayfa 1
    drawingCanvas.setActivePage(1);
    expect(drawingCanvas.getActivePage()).toBe(1);

    const targetRow = gobekData.dimensions[0];
    table.selectRow(targetRow.id);

    expect(drawingCanvas.getActivePage()).toBe(targetRow.page);
    expect(drawingCanvas.getSelectedBalloonId()).toBe(String(targetRow.id));
  });

  it('DrawingCanvas sayfa filtrelemesi yalnızca aktif sayfaya ait balonları döndürür', () => {
    app.loadDrawingData(gobekData);
    const drawingCanvas = app.getDrawingCanvas();

    drawingCanvas.setActivePage(2);
    const p2Balloons = drawingCanvas.getBalloonsForActivePage();
    expect(p2Balloons.length).toBeGreaterThan(0);
    expect(p2Balloons.every((b) => b.page === 2)).toBe(true);

    drawingCanvas.setActivePage(3);
    const p3Balloons = drawingCanvas.getBalloonsForActivePage();
    expect(p3Balloons.length).toBeGreaterThan(0);
    expect(p3Balloons.every((b) => b.page === 3)).toBe(true);
  });
});
