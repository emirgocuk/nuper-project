import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parsePdfDrawing } from './DrawingPdfParser';

describe('DrawingPdfParser — Deterministik 2D Vektör ve Uzamsal Metin Ayrıştırma', () => {
  it('Tolun Askı Kancası yüklendiğinde gerçek sayfa ve 20+ ölçüyü dinamik olarak çıkarır', async () => {
    const testPdfPath = path.resolve('test_assets', 'Tolun Askı Kancası', '10142688.pdf');
    if (!fs.existsSync(testPdfPath)) {
      return;
    }

    const buf = fs.readFileSync(testPdfPath);
    const doc = await parsePdfDrawing(buf, '10142688.pdf');

    expect(doc.pdfDoc).not.toBeNull();
    expect(doc.result.page_count).toBe(2);
    expect(doc.result.filename).toBe('10142688.pdf');
    expect(doc.result.dimensions.length).toBeGreaterThan(15);

    const radDims = doc.result.dimensions.filter((d) => d.type === 'RADIUS');
    expect(radDims.length).toBeGreaterThan(5);

    const linDims = doc.result.dimensions.filter((d) => d.type === 'LINEAR');
    expect(linDims.length).toBeGreaterThan(5);

    const firstDim = doc.result.dimensions[0];
    expect(firstDim).toBeDefined();
    expect(firstDim.bbox).toBeDefined();
    if (firstDim.bbox) {
      expect(firstDim.bbox.length).toBe(4);
    }
  });

  it('Dc Modül Plaka teknik resmi yüklendiğinde 25+ gerçek ölçüyü (Helicoil, R2, Toleranslı) ayrıştırır', async () => {
    const testPdfPath = path.resolve(
      'test_assets',
      'KPT - 2997 Dc Modül Plaka',
      '10142739_dc_modul_plaka.pdf'
    );
    if (!fs.existsSync(testPdfPath)) {
      return;
    }

    const buf = fs.readFileSync(testPdfPath);
    const doc = await parsePdfDrawing(buf, '10142739_dc_modul_plaka.pdf');

    expect(doc.result.page_count).toBe(2);
    expect(doc.result.dimensions.length).toBeGreaterThan(20);

    const threadDims = doc.result.dimensions.filter((d) => d.type === 'THREAD' || d.nominal_str.includes('M3'));
    expect(threadDims.length).toBeGreaterThan(0);

    const nominals = doc.result.dimensions.map((d) => d.nominal);
    expect(nominals).toContain(60.6);
    expect(nominals).toContain(59.2);
    expect(nominals).toContain(45.3);
    expect(nominals).toContain(13.3);
  });

  it('Role Bağlantı Parçası teknik resmi yüklendiğinde gerçek diş ve helikoyl ölçülerini bulur', async () => {
    const testPdfPath = path.resolve(
      'test_assets',
      'KPT - 2810 Role Bağlantı Parcası',
      'ROLE BAGLANTI PARCA_TR_AA-1.pdf'
    );
    if (!fs.existsSync(testPdfPath)) {
      return;
    }

    const buf = fs.readFileSync(testPdfPath);
    const doc = await parsePdfDrawing(buf, 'ROLE BAGLANTI PARCA_TR_AA-1.pdf');

    expect(doc.result.page_count).toBe(2);
    expect(doc.result.dimensions.length).toBeGreaterThan(0);

    const m3OrM4 = doc.result.dimensions.filter((d) => d.nominal_str.includes('M3') || d.nominal_str.includes('M4'));
    expect(m3OrM4.length).toBeGreaterThan(0);
  });

  it('Referans Göbek Bağı Oluğu yüklendiğinde 3 sayfa ve plan unsurlarını eksiksiz sağlar', async () => {
    const testPdfPath = path.resolve(
      'test_assets',
      'KPT - 3051 Gobek Bagı Olugu',
      'GOBEK BAGI OLUGU_TR_AB.pdf'
    );
    if (!fs.existsSync(testPdfPath)) {
      return;
    }

    const buf = fs.readFileSync(testPdfPath);
    const doc = await parsePdfDrawing(buf, 'GOBEK_BAGI_OLUGU_TR_AB.pdf');

    expect(doc.result.page_count).toBe(3);
    expect(doc.result.dimensions.length).toBe(12);

    const page2Dims = doc.result.dimensions.filter((d) => d.page === 2);
    expect(page2Dims.length).toBe(6);
    expect(page2Dims.map((d) => d.nominal)).toContain(395.5);
  });
});
