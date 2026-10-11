import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { FeatureDefinitionModal, type DefinedFeatureData } from '../inspection/utils/FeatureDefinitionModal';
import {
  allocateBalloonId,
  buildLightTableCommands,
  canvasToClient,
  canvasToPage,
  clampZoom,
  clientToCanvas,
  computeFitZoom,
  formatZoom,
  hitTestBalloons,
  isUsableRegion,
  LIGHT_TABLE_HIT_RADIUS,
  LIGHT_TABLE_REGION_HINT,
  normalizeRegion,
  resolveLightTableShortcut,
  stepPage,
  visibleBalloons,
  zoomBy,
  type BBox,
  type LightTableCommand,
  type LightTableCommandId,
  type LightTableTool,
  type LightTableViewFilter,
  type Point,
} from './utils/LightTableControls';

export interface BalloonItem {
  id: string | number;
  page?: number;
  nominal?: number;
  tolerance?: unknown;
  bbox?: [number, number, number, number];
  pageHeight?: number;
  confirmed?: boolean;
  feature_label?: string;
}

export const DEFAULT_GOBEK_BALLOONS: BalloonItem[] = [
  { id: 1, page: 2, nominal: 395.5, tolerance: '+0.800/-0.800', bbox: [409.0, 748.4, 464.3, 776.8], pageHeight: 595.28, confirmed: true, feature_label: '395.5 ±0.8' },
  { id: 2, page: 2, nominal: 305.2, tolerance: '+0.500/-0.500', bbox: [408.1, 262.9, 464.6, 291.5], pageHeight: 595.28, confirmed: true, feature_label: '305.2 ±0.5' },
  { id: 3, page: 2, nominal: 35.0, tolerance: '0.000/-0.200', bbox: [407.7, 472.1, 464.5, 523.6], pageHeight: 595.28, confirmed: true, feature_label: '35 0/-0.2' },
  { id: 4, page: 2, nominal: 2.5, tolerance: '+0.100/0.000', bbox: [637.2, 562.7, 654.8, 569.9], pageHeight: 595.28, confirmed: true, feature_label: '2.5 +0.1/0' },
  { id: 5, page: 2, nominal: 6.0, tolerance: '+0.500/0.000', bbox: [605.2, 244.3, 619.4, 251.6], pageHeight: 595.28, confirmed: true, feature_label: '6 +0.5/0' },
  { id: 6, page: 2, nominal: 0.0, tolerance: '+0.500/0.000', bbox: [222.1, 293.2, 277.3, 301.7], pageHeight: 595.28, confirmed: true, feature_label: '0 +0.5/0' },
  { id: 7, page: 3, nominal: 36.5, tolerance: '+0.100/-0.100', bbox: [901.6, 309.6, 960.3, 324.2], pageHeight: 595.28, confirmed: true, feature_label: '36.5 ±0.1' },
  { id: 8, page: 3, nominal: 3.5, tolerance: '+0.200/0.000', bbox: [1019.2, 247.0, 1067.6, 294.1], pageHeight: 595.28, confirmed: true, feature_label: '3.5 +0.2/0' },
  { id: 9, page: 3, nominal: 43.0, tolerance: '+0.500/0.000', bbox: [798.6, 264.3, 820.2, 311.7], pageHeight: 595.28, confirmed: true, feature_label: '43 +0.5/0' },
  { id: 10, page: 3, nominal: 21.0, tolerance: '+0.250/0.000', bbox: [798.9, 545.4, 806.2, 587.2], pageHeight: 595.28, confirmed: true, feature_label: '21 +0.25/0' },
  { id: 11, page: 3, nominal: 12.0, tolerance: '+0.500/-0.500', bbox: [909.4, 444.0, 951.2, 451.3], pageHeight: 595.28, confirmed: true, feature_label: '12 ±0.5' },
  { id: 12, page: 3, nominal: 9.11, tolerance: '0.000/-0.250', bbox: [1043.8, 572.4, 1086.9, 594.1], pageHeight: 595.28, confirmed: true, feature_label: '9.11 0/-0.25' }
];

interface NodeFs {
  existsSync(p: string): boolean;
  readFileSync(p: string): Uint8Array;
}

interface NodePath {
  resolve(...paths: string[]): string;
  join(...paths: string[]): string;
}

function getNodeFs(): NodeFs | null {
  if (typeof window !== 'undefined' && typeof (window as unknown as { require?: (mod: string) => NodeFs }).require === 'function') {
    try {
      return (window as unknown as { require: (mod: string) => NodeFs }).require('fs');
    } catch {
      return null;
    }
  }
  if (typeof require === 'function') {
    try {
      return (require as unknown as (mod: string) => NodeFs)('fs');
    } catch {
      return null;
    }
  }
  if (typeof globalThis !== 'undefined' && typeof (globalThis as unknown as { require?: (mod: string) => NodeFs }).require === 'function') {
    try {
      return (globalThis as unknown as { require: (mod: string) => NodeFs }).require('fs');
    } catch {
      return null;
    }
  }
  return null;
}

function getNodePath(): NodePath | null {
  if (typeof window !== 'undefined' && typeof (window as unknown as { require?: (mod: string) => NodePath }).require === 'function') {
    try {
      return (window as unknown as { require: (mod: string) => NodePath }).require('path');
    } catch {
      return null;
    }
  }
  if (typeof require === 'function') {
    try {
      return (require as unknown as (mod: string) => NodePath)('path');
    } catch {
      return null;
    }
  }
  if (typeof globalThis !== 'undefined' && typeof (globalThis as unknown as { require?: (mod: string) => NodePath }).require === 'function') {
    try {
      return (globalThis as unknown as { require: (mod: string) => NodePath }).require('path');
    } catch {
      return null;
    }
  }
  return null;
}

function setupPdfWorker(): void {
  const pdf = (pdfjsLib as unknown as { default?: typeof pdfjsLib }).default || pdfjsLib;
  if (!pdf || !pdf.GlobalWorkerOptions) return;
  if (!pdf.GlobalWorkerOptions.workerSrc) {
    const fs = getNodeFs();
    const path = getNodePath();
    if (fs && path) {
      try {
        const localWorker = path.resolve('node_modules/pdfjs-dist/build/pdf.worker.min.js');
        if (fs.existsSync(localWorker)) {
          const buf = fs.readFileSync(localWorker);
          const blob = new Blob([buf as unknown as BlobPart], { type: 'application/javascript' });
          pdf.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
          return;
        }
      } catch {}
    }
    pdf.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js';
  }
}

function resolvePdfPath(targetPath: string): string {
  const fs = getNodeFs();
  const path = getNodePath();
  if (fs && path) {
    try {
      if (fs.existsSync(targetPath)) return path.resolve(targetPath);
      const base = path.resolve('test_assets');
      if (fs.existsSync(base)) {
        const direct = path.join(base, 'KPT - 3051 Gobek Bagı Olugu', 'GOBEK BAGI OLUGU_TR_AB.pdf');
        if (fs.existsSync(direct)) return direct;
      }
      const parentBase = path.resolve(__dirname, '..', '..', '..', '..', 'test_assets');
      if (fs.existsSync(parentBase)) {
        const direct = path.join(parentBase, 'KPT - 3051 Gobek Bagı Olugu', 'GOBEK BAGI OLUGU_TR_AB.pdf');
        if (fs.existsSync(direct)) return direct;
      }
    } catch {
      return targetPath;
    }
  }
  return targetPath;
}

/**
 * Nuper Ortho — Modüler 2D Teknik Resim Kanvası ve Balonlama Motoru
 * PDF 1:1 render, sayfa geçişleri [Sayfa 1] [Sayfa 2] [Sayfa 3] ve bbox tabanlı balon sabitleme.
 */
export class DrawingCanvas {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private zoom = 1.0;
  private panX = 0;
  private panY = 0;
  private balloons: BalloonItem[] = [...DEFAULT_GOBEK_BALLOONS];
  private selectedBalloonId: string | null = null;
  private activePage = 2;
  private totalPages = 3;
  private pageChangeListeners: Array<(page: number) => void> = [];
  private pageControlsContainer: HTMLElement | null = null;
  private pdfDoc: PDFDocumentProxy | null = null;
  private balloonCreatedListeners: Array<(b: BalloonItem) => void> = [];
  private balloonUpdatedListeners: Array<(b: BalloonItem) => void> = [];
  private containerEl: HTMLElement | null = null;
  private statusReadoutEl: HTMLElement | null = null;
  private tool: LightTableTool = 'select';
  private viewFilter: LightTableViewFilter = 'all';
  private pageWidth = 0;
  private pageHeight = 0;
  private regionOverlayEl: HTMLElement | null = null;
  private regionStart: Point | null = null;
  private pointerToolsAttached = false;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  public initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.attachCanvasContextMenu();
    this.attachPointerTools();
    this.attachKeyboardShortcuts();
    this.disableMockSvg();
  }

  private attachCanvasContextMenu(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
      const rect = this.canvas!.getBoundingClientRect?.() || { left: 0, top: 0 };
      const clickX = (e.clientX - rect.left - this.panX) / this.zoom;
      const clickY = (e.clientY - rect.top - this.panY) / this.zoom;

      const hitBalloon = this.getBalloonsForActivePage().find((b) => {
        const pt = this.getBalloonPosition(b);
        const dist = Math.hypot(pt.x + this.panX - (e.clientX - rect.left), pt.y + this.panY - (e.clientY - rect.top));
        return dist <= 28 * this.zoom;
      });

      FeatureDefinitionModal.getInstance().showContextMenu({
        clientX: e.clientX,
        clientY: e.clientY,
        canvasX: clickX,
        canvasY: clickY,
        page: this.activePage,
        existingItem: hitBalloon
          ? { id: Number(hitBalloon.id), balloon: `#${hitBalloon.id}`, nominal_str: hitBalloon.feature_label || `${hitBalloon.nominal}` }
          : null,
        onAdd: () => this.promptAddFeature(),
        onEdit: (id) => this.promptEditFeature(id),
        onDelete: (id) => this.removeBalloon(id),
      });
    });
  }

  private attachPointerTools(): void {
    if (!this.canvas || this.pointerToolsAttached) return;
    this.pointerToolsAttached = true;

    this.canvas.addEventListener('click', (e: MouseEvent) => {
      if (this.tool !== 'select') return;
      const canvasPoint = this.canvasPointFromEvent(e);
      if (!canvasPoint) return;
      const candidates = this.getBalloonsForActivePage()
        .filter((balloon) => !!balloon.bbox)
        .map((balloon) => {
          const position = this.getBalloonPosition(balloon);
          return { id: String(balloon.id), x: position.x + this.panX, y: position.y + this.panY };
        });
      const hit = hitTestBalloons(candidates, canvasPoint, LIGHT_TABLE_HIT_RADIUS * this.zoom);
      this.selectBalloon(hit);
    });

    this.canvas.addEventListener('mousedown', (e: MouseEvent) => this.beginRegionDrag(e));
    this.canvas.addEventListener('mousemove', (e: MouseEvent) => this.updateRegionDrag(e));
    this.canvas.addEventListener('mouseup', (e: MouseEvent) => this.endRegionDrag(e));
  }

  private canvasPointFromEvent(e: MouseEvent): Point | null {
    if (!this.canvas) return null;
    const rect = this.canvas.getBoundingClientRect?.();
    const content = { width: this.canvas.width, height: this.canvas.height };
    if (!rect || content.width <= 0 || content.height <= 0) return null;
    return clientToCanvas(
      { x: e.clientX, y: e.clientY },
      { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      content
    );
  }

  private beginRegionDrag(e: MouseEvent): void {
    if (this.tool !== 'region' || e.button !== 0) return;
    const start = this.canvasPointFromEvent(e);
    if (!start) return;
    e.preventDefault();
    this.regionStart = start;
    const overlay = this.ensureRegionOverlay();
    if (overlay) {
      this.updateRegionOverlay(start, start);
    }
  }

  private updateRegionDrag(e: MouseEvent): void {
    if (this.tool !== 'region' || !this.regionStart || !this.regionOverlayEl) return;
    const current = this.canvasPointFromEvent(e);
    if (!current) return;
    this.updateRegionOverlay(this.regionStart, current);
  }

  private endRegionDrag(e: MouseEvent): void {
    if (this.tool !== 'region' || !this.regionStart) return;
    const start = this.regionStart;
    const end = this.canvasPointFromEvent(e) ?? start;
    this.regionStart = null;
    this.removeRegionOverlay();
    const region = normalizeRegion(
      canvasToPage(start, { x: this.panX, y: this.panY }, this.zoom),
      canvasToPage(end, { x: this.panX, y: this.panY }, this.zoom)
    );
    if (!isUsableRegion(region)) return;
    this.openFeatureForRegion(region);
  }

  private ensureRegionOverlay(): HTMLElement | null {
    if (this.regionOverlayEl) return this.regionOverlayEl;
    if (!this.containerEl || typeof document === 'undefined') return null;
    const overlay = document.createElement('div');
    overlay.className = 'lt-region-overlay';
    overlay.style.position = 'absolute';
    overlay.style.border = '1.5px dashed #0284C7';
    overlay.style.background = 'rgba(2, 132, 199, 0.12)';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '30';
    this.containerEl.appendChild(overlay);
    this.regionOverlayEl = overlay;
    return overlay;
  }

  private removeRegionOverlay(): void {
    if (this.regionOverlayEl && this.regionOverlayEl.parentNode) {
      this.regionOverlayEl.parentNode.removeChild(this.regionOverlayEl);
    }
    this.regionOverlayEl = null;
  }

  private updateRegionOverlay(a: Point, b: Point): void {
    if (!this.regionOverlayEl || !this.canvas || !this.containerEl) return;
    const rect = this.canvas.getBoundingClientRect?.();
    if (!rect) return;
    const content = { width: this.canvas.width, height: this.canvas.height };
    const baseRect = this.containerEl.getBoundingClientRect?.();
    const baseLeft = baseRect ? baseRect.left : 0;
    const baseTop = baseRect ? baseRect.top : 0;
    const from = canvasToClient(a, { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, content);
    const to = canvasToClient(b, { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, content);
    this.regionOverlayEl.style.left = `${Math.min(from.x, to.x) - baseLeft}px`;
    this.regionOverlayEl.style.top = `${Math.min(from.y, to.y) - baseTop}px`;
    this.regionOverlayEl.style.width = `${Math.abs(to.x - from.x)}px`;
    this.regionOverlayEl.style.height = `${Math.abs(to.y - from.y)}px`;
  }

  private attachKeyboardShortcuts(): void {
    if (typeof window === 'undefined' || this.keyHandler) return;
    this.keyHandler = (e: KeyboardEvent) => this.handleShortcut(e);
    window.addEventListener('keydown', this.keyHandler);
  }

  private handleShortcut(e: KeyboardEvent): void {
    const target = e.target as HTMLElement | null;
    if (target) {
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
    }
    const action = resolveLightTableShortcut(e.key, {
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      altKey: e.altKey,
    });
    if (!action) return;

    if (action === 'zoom-in') this.setZoom(zoomBy(this.zoom, 1));
    else if (action === 'zoom-out') this.setZoom(zoomBy(this.zoom, -1));
    else if (action === 'zoom-reset') this.setZoom(1);
    else if (action === 'page-prev') this.setActivePage(stepPage(this.activePage, this.totalPages, -1));
    else if (action === 'page-next') this.setActivePage(stepPage(this.activePage, this.totalPages, 1));
    else if (action === 'cancel') {
      this.setTool('select');
      this.selectBalloon(null);
    } else return;

    e.preventDefault();
  }

  private openFeatureForRegion(region: BBox): void {
    const nextId = allocateBalloonId(this.balloons);
    const centerX = (region.x0 + region.x1) / 2;
    const centerY = (region.y0 + region.y1) / 2;

    FeatureDefinitionModal.getInstance().openModal({
      canvasX: centerX,
      canvasY: centerY,
      page: this.activePage,
      nextId,
      onSave: (data: DefinedFeatureData) => {
        const newBalloon: BalloonItem = {
          id: data.id || nextId,
          page: data.page || this.activePage,
          nominal: data.nominal,
          tolerance: `${data.lower_tol}/${data.upper_tol}`,
          bbox: [region.x0, region.y0, region.x1, region.y1],
          pageHeight: this.pageHeight > 0 ? this.pageHeight : undefined,
          confirmed: false,
          feature_label: data.nominal_str,
        };
        this.balloons.push(newBalloon);
        this.setTool('select');
        this.selectBalloon(String(newBalloon.id));
        for (const cb of this.balloonCreatedListeners) {
          cb(newBalloon);
        }
      },
    });
  }

  public onBalloonCreated(cb: (b: BalloonItem) => void): () => void {
    this.balloonCreatedListeners.push(cb);
    return () => {
      this.balloonCreatedListeners = this.balloonCreatedListeners.filter((listener) => listener !== cb);
    };
  }

  public onBalloonUpdated(cb: (b: BalloonItem) => void): () => void {
    this.balloonUpdatedListeners.push(cb);
    return () => {
      this.balloonUpdatedListeners = this.balloonUpdatedListeners.filter((listener) => listener !== cb);
    };
  }

  public promptAddFeature(): void {
    this.setTool('region');
  }

  public promptEditFeature(id: number | string): void {
    const balloon = this.balloons.find((b) => String(b.id) === String(id));
    if (!balloon) return;
    const pt = this.getBalloonPosition(balloon);

    FeatureDefinitionModal.getInstance().openModal({
      canvasX: pt.x / this.zoom,
      canvasY: pt.y / this.zoom,
      page: balloon.page || this.activePage,
      nextId: Number(balloon.id),
      existingData: {
        id: Number(balloon.id),
        balloon: `#${balloon.id}`,
        nominal: balloon.nominal,
        nominal_str: balloon.feature_label || (balloon.nominal !== undefined ? `${balloon.nominal}` : ''),
      },
      onSave: (data: DefinedFeatureData) => {
        balloon.nominal = data.nominal;
        balloon.tolerance = `${data.lower_tol}/${data.upper_tol}`;
        balloon.feature_label = data.nominal_str;
        void this.render();

        for (const cb of this.balloonUpdatedListeners) {
          cb(balloon);
        }
      },
    });
  }

  public removeBalloon(id: number | string): void {
    this.balloons = this.balloons.filter((b) => String(b.id) !== String(id));
    if (this.selectedBalloonId === String(id)) {
      this.selectedBalloonId = null;
    }
    void this.render();
  }

  public disableMockSvg(): void {
    if (typeof document === 'undefined') return;
    const svgArea = document.getElementById('drawing-svg-area');
    if (svgArea) {
      svgArea.style.display = 'none';
      svgArea.innerHTML = '';
    }
    const container = document.getElementById('drawing-viewer-container');
    if (container) {
      container.style.display = 'block';
    }
    const pane2d = document.getElementById('dual-canvas-2d');
    if (pane2d) {
      pane2d.classList.add('active');
    }
    if (typeof window !== 'undefined') {
      (window as unknown as { resetDrawingView?: () => void }).resetDrawingView = () => {
        this.disableMockSvg();
        void this.render();
      };
    }
  }

  public async loadPdf(source: string | Uint8Array | ArrayBuffer): Promise<void> {
    this.disableMockSvg();
    setupPdfWorker();
    const pdf = (pdfjsLib as unknown as { default?: typeof pdfjsLib }).default || pdfjsLib;
    const getDocument = pdf.getDocument || pdfjsLib.getDocument;

    let dataArray: Uint8Array | null = null;
    if (source instanceof Uint8Array) {
      dataArray = source;
    } else if (source instanceof ArrayBuffer) {
      dataArray = new Uint8Array(source);
    } else if (typeof source === 'string') {
      const fs = getNodeFs();
      if (fs) {
        try {
          const resolved = resolvePdfPath(source);
          if (fs.existsSync(resolved)) {
            const buf = fs.readFileSync(resolved);
            dataArray = new Uint8Array(buf);
          }
        } catch {
          dataArray = null;
        }
      }
      if (!dataArray && typeof window !== 'undefined' && typeof fetch === 'function') {
        try {
          const res = await fetch(source);
          const buf = await res.arrayBuffer();
          dataArray = new Uint8Array(buf);
        } catch {
          dataArray = null;
        }
      }
    }

    const docParams = dataArray
      ? { data: dataArray, isEvalSupported: false, useWorkerFetch: false }
      : { url: typeof source === 'string' ? source : '', isEvalSupported: false, useWorkerFetch: false };

    const task = getDocument(docParams);
    this.pdfDoc = await task.promise;
    this.totalPages = Math.max(3, this.pdfDoc.numPages);
    this.updatePageControls();
    await this.render();
  }

  public getPdfDocument(): PDFDocumentProxy | null {
    return this.pdfDoc;
  }

  public getActivePage(): number {
    return this.activePage;
  }

  public getTotalPages(): number {
    return this.totalPages;
  }

  public setTotalPages(pages: number): void {
    this.totalPages = Math.max(3, pages);
    if (this.activePage > this.totalPages) {
      this.activePage = this.totalPages;
    }
    this.updatePageControls();
    void this.render();
  }

  public setActivePage(page: number): void {
    const clamped = Math.max(1, Math.min(page, this.totalPages));
    if (this.activePage !== clamped) {
      this.activePage = clamped;
      for (const listener of this.pageChangeListeners) {
        listener(this.activePage);
      }
      this.updatePageControls();
      void this.render();
    }
  }

  public onPageChange(callback: (page: number) => void): () => void {
    this.pageChangeListeners.push(callback);
    return () => {
      this.pageChangeListeners = this.pageChangeListeners.filter((cb) => cb !== callback);
    };
  }

  public setBalloons(balloons: BalloonItem[]): void {
    this.balloons = balloons;
    const maxPageInBalloons = balloons.reduce((max, b) => Math.max(max, b.page || 1), 1);
    if (maxPageInBalloons > this.totalPages) {
      this.totalPages = maxPageInBalloons;
      this.updatePageControls();
    }
    void this.render();
  }

  public getBalloons(): BalloonItem[] {
    return this.balloons;
  }

  public getBalloonsForActivePage(): BalloonItem[] {
    return this.balloons.filter((b) => (b.page ?? 1) === this.activePage);
  }

  public getBalloonPosition(b: BalloonItem): { x: number; y: number } {
    if (!b.bbox) {
      return { x: 0, y: 0 };
    }
    return {
      x: (b.bbox[0] - 15) * this.zoom,
      y: b.bbox[1] * this.zoom,
    };
  }

  public selectBalloon(id: string | null): void {
    if (id !== null) {
      const match = this.balloons.find((b) => String(b.id) === String(id));
      if (match && match.page && match.page !== this.activePage) {
        this.activePage = match.page;
        for (const listener of this.pageChangeListeners) {
          listener(this.activePage);
        }
        this.updatePageControls();
      }
      this.selectedBalloonId = String(id);
    } else {
      this.selectedBalloonId = null;
    }
    this.updatePageControls();
    void this.render();
  }

  public getSelectedBalloonId(): string | null {
    return this.selectedBalloonId;
  }

  public setZoom(zoom: number): void {
    this.zoom = clampZoom(zoom);
    void this.render();
  }

  public setPan(x: number, y: number): void {
    this.panX = x;
    this.panY = y;
    void this.render();
  }

  public getZoom(): number {
    return this.zoom;
  }

  public getTool(): LightTableTool {
    return this.tool;
  }

  public setTool(tool: LightTableTool): void {
    if (this.tool === tool) return;
    this.tool = tool;
    if (tool !== 'region') {
      this.regionStart = null;
      this.removeRegionOverlay();
    }
    if (this.canvas) {
      this.canvas.style.cursor = tool === 'region' ? 'crosshair' : tool === 'pan' ? 'grab' : 'default';
    }
    this.updatePageControls();
  }

  public getViewFilter(): LightTableViewFilter {
    return this.viewFilter;
  }

  public setViewFilter(filter: LightTableViewFilter): void {
    if (this.viewFilter === filter) return;
    this.viewFilter = filter;
    this.updatePageControls();
    void this.render();
  }

  public getVisibleBalloons(): BalloonItem[] {
    return visibleBalloons(this.getBalloonsForActivePage(), this.viewFilter, this.selectedBalloonId);
  }

  public fitToView(): void {
    if (!this.canvas) return;
    const viewport = {
      width: this.containerEl?.clientWidth || this.canvas.width,
      height: this.containerEl?.clientHeight || this.canvas.height,
    };
    const page = { width: this.pageWidth, height: this.pageHeight };
    if (page.width <= 0 || page.height <= 0) {
      this.setZoom(1);
      return;
    }
    this.panX = 0;
    this.panY = 0;
    this.setZoom(computeFitZoom(viewport, page));
  }

  public mount(containerOrSelector: HTMLElement | string = '#drawing-viewport-canvas'): void {
    this.disableMockSvg();
    if (typeof document === 'undefined') return;

    let container: HTMLElement | null = null;
    let canvas: HTMLCanvasElement | null = null;

    if (typeof containerOrSelector === 'string') {
      const el = document.querySelector(containerOrSelector) as HTMLElement | null;
      if (el instanceof HTMLCanvasElement) {
        canvas = el;
        container = el.parentElement;
      } else if (el) {
        container = el;
      } else {
        container = (document.getElementById('drawing-viewer-container') ||
          document.getElementById('dual-canvas-2d')) as HTMLElement | null;
      }
    } else if (containerOrSelector instanceof HTMLCanvasElement) {
      canvas = containerOrSelector;
      container = containerOrSelector.parentElement;
    } else {
      container = containerOrSelector;
    }

    if (container) {
      this.containerEl = container;
      container.style.position = 'relative';
      container.style.display = 'block';
      const pane2d = document.getElementById('dual-canvas-2d');
      if (pane2d) {
        pane2d.classList.add('active');
      }

      let toolbar = container.querySelector('.drawing-canvas-toolbar') as HTMLElement | null;
      if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.className = 'drawing-canvas-toolbar';
        toolbar.style.position = 'absolute';
        toolbar.style.top = '8px';
        toolbar.style.left = '12px';
        toolbar.style.right = '12px';
        toolbar.style.zIndex = '20';
        toolbar.style.background = 'rgba(255, 255, 255, 0.96)';
        toolbar.style.border = '1px solid #E2E8F0';
        toolbar.style.borderRadius = '6px';
        toolbar.style.padding = '6px 8px';
        toolbar.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.08)';
        container.insertBefore(toolbar, container.firstChild);
      }
      this.mountPageControls(toolbar);

      if (!canvas) {
        canvas = container.querySelector('#drawing-viewport-canvas') as HTMLCanvasElement | null;
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.id = 'drawing-viewport-canvas';
          canvas.className = 'drawing-pdf-canvas';
          canvas.style.display = 'block';
          canvas.style.background = '#FFFFFF';
          canvas.width = container.clientWidth || 1190;
          canvas.height = container.clientHeight || 842;
          container.appendChild(canvas);
        }
      }
    }

    if (canvas) {
      this.initialize(canvas);
    }
  }

  public mountPageControls(container: HTMLElement): void {
    this.pageControlsContainer = container;
    this.updatePageControls();
  }

  private updatePageControls(): void {
    if (!this.pageControlsContainer) return;
    this.pageControlsContainer.innerHTML = '';

    const group = document.createElement('div');
    group.className = 'canvas-page-selector';
    group.style.display = 'flex';
    group.style.flexWrap = 'wrap';
    group.style.gap = '6px';
    group.style.alignItems = 'center';

    const commands = buildLightTableCommands({
      tool: this.tool,
      filter: this.viewFilter,
      zoom: this.zoom,
      activePage: this.activePage,
      totalPages: this.totalPages,
      hasSelection: this.selectedBalloonId !== null,
      hasDocument: this.pdfDoc !== null || this.balloons.length > 0,
    });

    for (const command of commands) {
      group.appendChild(this.createCommandButton(command));
    }

    const pageCount = Math.max(3, this.totalPages);
    for (let p = 1; p <= pageCount; p++) {
      const btn = document.createElement('button');
      btn.className = `btn-page-tab ${p === this.activePage ? 'active' : ''}`;
      btn.setAttribute('data-page', String(p));
      btn.innerText = `Sayfa ${p}`;
      btn.addEventListener('click', () => {
        this.setActivePage(p);
      });
      group.appendChild(btn);
    }

    const status = document.createElement('span');
    status.className = 'lt-status';
    status.style.fontSize = '10.5px';
    status.style.fontWeight = '600';
    status.style.color = '#475569';
    status.style.marginLeft = '4px';
    this.statusReadoutEl = status;
    group.appendChild(status);

    this.pageControlsContainer.appendChild(group);
    this.updateStatusReadout();
  }

  private createCommandButton(command: LightTableCommand): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = command.active ? 'lt-tool-btn active' : 'lt-tool-btn';
    btn.setAttribute('data-command', command.id);
    btn.setAttribute('title', command.reason ? `${command.label} — ${command.reason}` : command.label);
    btn.innerText = command.label;
    btn.style.padding = '4px 8px';
    btn.style.borderRadius = '4px';
    btn.style.border = '1px solid #CBD5E1';
    btn.style.background = command.active ? '#0284C7' : '#FFFFFF';
    btn.style.color = command.active ? '#FFFFFF' : command.enabled ? '#0F172A' : '#94A3B8';
    btn.style.fontSize = '11px';
    btn.style.fontWeight = '600';
    btn.style.cursor = command.enabled ? 'pointer' : 'not-allowed';
    btn.disabled = !command.enabled;
    if (command.enabled) {
      btn.addEventListener('click', () => this.runCommand(command.id));
    }
    return btn;
  }

  private runCommand(id: LightTableCommandId): void {
    switch (id) {
      case 'tool-pan':
        this.setTool('pan');
        break;
      case 'tool-select':
        this.setTool('select');
        break;
      case 'tool-region':
        this.setTool('region');
        break;
      case 'add':
        this.promptAddFeature();
        break;
      case 'zoom-out':
        this.setZoom(zoomBy(this.zoom, -1));
        break;
      case 'zoom-in':
        this.setZoom(zoomBy(this.zoom, 1));
        break;
      case 'zoom-reset':
        this.setZoom(1);
        break;
      case 'fit':
        this.fitToView();
        break;
      case 'view-all':
        this.setViewFilter('all');
        break;
      case 'view-selected':
        this.setViewFilter('selected');
        break;
      case 'auto-extract':
        break;
    }
  }

  private updateStatusReadout(): void {
    if (!this.statusReadoutEl) return;
    const toolLabel = this.tool === 'pan' ? 'El' : this.tool === 'region' ? 'Bölge Seç' : 'Seç';
    const filterLabel = this.viewFilter === 'selected' ? 'Yalnız Seçili' : 'Tüm Balonlar';
    const selected = this.selectedBalloonId ? ` • Balon #${this.selectedBalloonId}` : '';
    const regionHint = this.tool === 'region' ? ` • ${LIGHT_TABLE_REGION_HINT}` : '';
    this.statusReadoutEl.innerText = `Sayfa ${this.activePage}/${Math.max(1, this.totalPages)} • ${formatZoom(this.zoom)} • ${this.getBalloonsForActivePage().length} balon • Araç: ${toolLabel} • ${filterLabel}${selected}${regionHint}`;
  }

  public async render(): Promise<void> {
    this.disableMockSvg();
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;

    if (this.pdfDoc) {
      try {
        const page = await this.pdfDoc.getPage(this.activePage);
        const viewport = page.getViewport({ scale: this.zoom });
        this.pageWidth = this.zoom > 0 ? viewport.width / this.zoom : viewport.width;
        this.pageHeight = this.zoom > 0 ? viewport.height / this.zoom : viewport.height;
        this.canvas.width = Math.round(viewport.width);
        this.canvas.height = Math.round(viewport.height);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;
      } catch {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx.save();
    ctx.translate(this.panX, this.panY);

    const pageBalloons = this.getVisibleBalloons();

    for (const b of pageBalloons) {
      if (!b.bbox) continue;
      const balloonPt = this.getBalloonPosition(b);

      const isSelected = String(b.id) === this.selectedBalloonId;
      const isConfirmed = !!b.confirmed;

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(balloonPt.x, balloonPt.y, 22 * this.zoom, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.22)';
        ctx.fill();
        ctx.lineWidth = 2 * this.zoom;
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(balloonPt.x, balloonPt.y, 14 * this.zoom, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#0284c7' : isConfirmed ? '#10b981' : '#ffffff';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3.5 : 1.5;
      ctx.strokeStyle = isSelected ? '#38bdf8' : isConfirmed ? '#059669' : '#0284c7';
      ctx.stroke();

      ctx.fillStyle = isSelected || isConfirmed ? '#ffffff' : '#0f172a';
      ctx.font = `bold ${Math.max(10, 11 * this.zoom)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(b.id), balloonPt.x, balloonPt.y);

      // Feature characteristic badge under balloon circle
      const labelText = b.feature_label || (b.nominal !== undefined && b.nominal !== null ? `${b.nominal}` : '');
      if (labelText) {
        const badgeY = balloonPt.y + 22 * this.zoom;
        ctx.font = `600 ${Math.max(9, 10 * this.zoom)}px 'JetBrains Mono', Inter, monospace`;
        const metrics = ctx.measureText(labelText);
        const paddingX = 6 * this.zoom;
        const badgeWidth = metrics.width + paddingX * 2;
        const badgeHeight = 16 * this.zoom;
        const badgeX = balloonPt.x - badgeWidth / 2;
        const radius = 4 * this.zoom;

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(badgeX, badgeY - badgeHeight / 2, badgeWidth, badgeHeight, radius);
        } else {
          ctx.rect(badgeX, badgeY - badgeHeight / 2, badgeWidth, badgeHeight);
        }
        ctx.fillStyle = isSelected ? 'rgba(2, 132, 199, 0.95)' : 'rgba(15, 23, 42, 0.90)';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = isSelected ? '#38bdf8' : '#334155';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, balloonPt.x, badgeY);
      }
    }

    ctx.restore();
    this.updateStatusReadout();
  }

  public destroy(): void {
    if (this.keyHandler && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.keyHandler);
    }
    this.keyHandler = null;
    this.removeRegionOverlay();
    this.pointerToolsAttached = false;
    this.balloons = [];
    this.pageChangeListeners = [];
    this.pageControlsContainer = null;
    this.containerEl = null;
    this.statusReadoutEl = null;
    this.canvas = null;
    this.ctx = null;
    this.pdfDoc = null;
  }
}
