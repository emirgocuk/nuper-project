import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DrawingCanvas, type BalloonItem } from './DrawingCanvas';
import type { DrawingExtractionResult } from '../../types/generated/drawing_data';

class SimpleMockElement {
  public tagName: string;
  public id: string = '';
  public className: string = '';
  public innerText: string = '';
  public innerHTML: string = '';
  public style: Record<string, string> = {};
  public children: SimpleMockElement[] = [];
  public attributes: Record<string, string> = {};
  private listeners: Record<string, Array<() => void>> = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  get textContent(): string {
    return this.innerText;
  }

  set textContent(v: string) {
    this.innerText = v;
  }

  public appendChild(child: SimpleMockElement): void {
    this.children.push(child);
  }

  public setAttribute(k: string, v: string): void {
    this.attributes[k] = v;
  }

  public getAttribute(k: string): string | null {
    return this.attributes[k] ?? null;
  }

  public addEventListener(event: string, cb: () => void): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }

  public querySelectorAll(selector: string): SimpleMockElement[] {
    const results: SimpleMockElement[] = [];
    const matchClass = selector.startsWith('.') ? selector.slice(1) : null;
    const walk = (el: SimpleMockElement) => {
      if (matchClass && el.className.split(' ').includes(matchClass)) {
        results.push(el);
      }
      for (const child of el.children) {
        walk(child);
      }
    };
    walk(this);
    return results;
  }

  public remove(): void {
    this.children = [];
  }
}

const mockStore: Record<string, SimpleMockElement> = {};

if (typeof (globalThis as unknown as { document?: unknown }).document === 'undefined') {
  (globalThis as unknown as { document: unknown }).document = {
    createElement(tag: string) {
      return new SimpleMockElement(tag);
    },
    getElementById(id: string) {
      return mockStore[id] ?? null;
    },
    body: new SimpleMockElement('BODY'),
  };
  (globalThis as unknown as { HTMLElement: unknown }).HTMLElement = SimpleMockElement;
  (globalThis as unknown as { HTMLCanvasElement: unknown }).HTMLCanvasElement = SimpleMockElement;
}

describe('DrawingCanvas — Gerçek PDF Render ve Balon Koordinat Sabitleme', () => {
  let canvas: DrawingCanvas;
  const rootDir = path.resolve(__dirname, '..', '..', '..', '..');
  const pdfPath = path.join(
    rootDir,
    'test_assets',
    'KPT - 3051 Gobek Bagı Olugu',
    'GOBEK BAGI OLUGU_TR_AB.pdf'
  );

  beforeEach(() => {
    canvas = new DrawingCanvas();
  });

  afterEach(() => {
    canvas.destroy();
  });

  it('1. Gerçek PDF test_assets üzerinden 3 sayfa olarak yüklenir ve sayfa kontrolleri [Sayfa 1, 2, 3] oluşur', async () => {
    expect(fs.existsSync(pdfPath)).toBe(true);

    await canvas.loadPdf(pdfPath);

    expect(canvas.getTotalPages()).toBe(3);
    const pdfDoc = canvas.getPdfDocument();
    expect(pdfDoc).toBeDefined();
    expect(pdfDoc?.numPages).toBe(3);

    const controlsContainer = document.createElement('div') as unknown as HTMLElement;
    canvas.mountPageControls(controlsContainer);

    const pageButtons = controlsContainer.querySelectorAll('.btn-page-tab');
    expect(pageButtons.length).toBe(3);
    expect(pageButtons[0].textContent).toBe('Sayfa 1');
    expect(pageButtons[1].textContent).toBe('Sayfa 2');
    expect(pageButtons[2].textContent).toBe('Sayfa 3');
  });

  it('1. Mock SVG çizimini (VALVE BODY) tamamen devre dışı bırakır', () => {
    const mockArea = new SimpleMockElement('div');
    mockArea.id = 'drawing-svg-area';
    mockArea.style.display = 'block';
    mockStore['drawing-svg-area'] = mockArea;

    const viewerContainer = new SimpleMockElement('div');
    viewerContainer.id = 'drawing-viewer-container';
    viewerContainer.style.display = 'none';
    mockStore['drawing-viewer-container'] = viewerContainer;

    canvas.disableMockSvg();

    expect(mockArea.style.display).toBe('none');
    expect(viewerContainer.style.display).toBe('block');

    delete mockStore['drawing-svg-area'];
    delete mockStore['drawing-viewer-container'];
  });

  it('2. Balonları doğrudan ölçü bbox koordinatlarının yanına (x = x0 - 15, y = y0) sabitler', () => {
    const scriptPath = path.join(rootDir, 'tools', 'drawing_extractor.py');
    const stdout = execFileSync('python', [scriptPath, pdfPath], { encoding: 'utf8' });
    const result: DrawingExtractionResult = JSON.parse(stdout);

    expect(result.dimensions.length).toBe(12);

    const balloonItems: BalloonItem[] = result.dimensions.map((dim) => ({
      id: dim.id,
      page: dim.page,
      nominal: dim.nominal,
      bbox: dim.bbox,
      pageHeight: 841.89,
    }));

    canvas.setBalloons(balloonItems);

    for (const item of balloonItems) {
      expect(item.bbox).toBeDefined();
      const pos = canvas.getBalloonPosition(item);
      expect(pos.x).toBe(item.bbox![0] - 15);
      expect(pos.y).toBe(item.bbox![1]);
    }
  });

  it('3. Sayfa 2 filtrelemesi yalnızca Sayfa 2 ölçülerini (395.5, 305.2, 35, 4x Ø2.5, 2x Ø6, Profil 0.5) listeler', () => {
    const scriptPath = path.join(rootDir, 'tools', 'drawing_extractor.py');
    const stdout = execFileSync('python', [scriptPath, pdfPath], { encoding: 'utf8' });
    const result: DrawingExtractionResult = JSON.parse(stdout);

    const balloonItems: BalloonItem[] = result.dimensions.map((dim) => ({
      id: dim.id,
      page: dim.page,
      nominal: dim.nominal,
      bbox: dim.bbox,
      pageHeight: 841.89,
    }));

    canvas.setBalloons(balloonItems);
    canvas.setActivePage(2);

    const p2Balloons = canvas.getBalloonsForActivePage();
    expect(p2Balloons.length).toBe(6);

    const nominals = p2Balloons.map((b) => b.nominal);
    expect(nominals).toEqual([395.5, 305.2, 35.0, 2.5, 6.0, 0.0]);

    for (const b of p2Balloons) {
      expect(b.page).toBe(2);
      expect(b.bbox).toBeDefined();
    }
  });

  it('3. Sayfa 3 filtrelemesi yalnızca Sayfa 3 ölçülerini (Detay M ve Kesit G-G: 36.5, 4x Ø3.5, Ø43, Ø21, 12, 9.11) listeler', () => {
    const scriptPath = path.join(rootDir, 'tools', 'drawing_extractor.py');
    const stdout = execFileSync('python', [scriptPath, pdfPath], { encoding: 'utf8' });
    const result: DrawingExtractionResult = JSON.parse(stdout);

    const balloonItems: BalloonItem[] = result.dimensions.map((dim) => ({
      id: dim.id,
      page: dim.page,
      nominal: dim.nominal,
      bbox: dim.bbox,
      pageHeight: 841.89,
    }));

    canvas.setBalloons(balloonItems);
    canvas.setActivePage(3);

    const p3Balloons = canvas.getBalloonsForActivePage();
    expect(p3Balloons.length).toBe(6);

    const nominals = p3Balloons.map((b) => b.nominal);
    expect(nominals).toEqual([36.5, 3.5, 43.0, 21.0, 12.0, 9.11]);

    for (const b of p3Balloons) {
      expect(b.page).toBe(3);
      expect(b.bbox).toBeDefined();
    }
  });
});
