import {
  type InspectionDimension,
  GOBEK_ALL_12_DIMENSIONS,
  InspectionSynchronizer,
} from './InspectionSynchronizer';
import {
  type BalloonItem,
  DEFAULT_GOBEK_BALLOONS,
} from '../../drawing/DrawingCanvas';
import { parsePdfDrawing, renderPdfPageToCanvas } from './DrawingPdfParser';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { matchCadWithDrawing, type CadDrawingMatchResult } from './CadDrawingMatcher';
import type { CadMetadata } from '../../../types/generated/cad_metadata';
import type { DrawingExtractionResult } from '../../../types/generated/drawing_data';
import { FeatureDefinitionModal, type DefinedFeatureData } from './FeatureDefinitionModal';

export interface SetupWizardOptions {
  onConfirm?: (dimensions: InspectionDimension[]) => void;
}

export class SetupWizard {
  private dimensions: InspectionDimension[] = [];
  private balloons: BalloonItem[] = [];
  private selectedId: number | null = null;
  private activePage: number = 1;
  private totalPages: number = 3;
  private isAuditOpen: boolean = false;
  private isConfirmed: boolean = false;
  private hasLoadedDrawing: boolean = false;
  private loadedFileName: string = '';
  private pdfDoc: PDFDocumentProxy | null = null;
  private loadedImageUrl: string | null = null;
  private confirmCallback?: (dimensions: InspectionDimension[]) => void;
  private appInstance: unknown = null;
  private currentCadMetadata: CadMetadata | null = null;
  private matchResult: CadDrawingMatchResult | null = null;

  private zoom: number = 1.0;
  private panX: number = 0;
  private panY: number = 0;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;

  constructor(app?: unknown, options?: SetupWizardOptions) {
    this.appInstance = app || null;
    if (options?.onConfirm) {
      this.confirmCallback = options.onConfirm;
    }
    this.injectStyles();
  }

  public getApp(): unknown {
    return this.appInstance;
  }

  public getDimensions(): InspectionDimension[] {
    return this.dimensions;
  }

  public getBalloons(): BalloonItem[] {
    return this.balloons;
  }

  public getSelectedId(): number | null {
    return this.selectedId;
  }

  public getActivePage(): number {
    return this.activePage;
  }

  public getTotalPages(): number {
    return this.totalPages;
  }

  public getHasLoadedDrawing(): boolean {
    return this.hasLoadedDrawing;
  }

  public getLoadedFileName(): string {
    return this.loadedFileName;
  }

  public getZoom(): number {
    return this.zoom;
  }

  public getPan(): { x: number; y: number } {
    return { x: this.panX, y: this.panY };
  }

  public isDrawingAuditOpen(): boolean {
    return this.isAuditOpen;
  }

  public isPlanConfirmed(): boolean {
    return this.isConfirmed;
  }

  public setCadMetadata(cad: CadMetadata): void {
    this.currentCadMetadata = cad;
    if (this.dimensions.length > 0) {
      this.recomputeCadMatch();
      this.renderDrawingAuditModal();
    }
  }

  public getMatchResult(): CadDrawingMatchResult | null {
    return this.matchResult;
  }

  private recomputeCadMatch(): void {
    if (!this.currentCadMetadata || this.dimensions.length === 0) return;
    const drawingPayload: DrawingExtractionResult = {
      success: true,
      filename: this.loadedFileName || 'drawing.pdf',
      title_block: {
        part_number: this.loadedFileName || 'UNKNOWN',
        material: '',
        hardness: '',
        roughness: '',
        general_tolerance: 'ISO 2768-m',
        drawing_number: this.loadedFileName || '',
      },
      datums: ['A', 'B', 'C'],
      dimensions: this.dimensions.map((d) => ({
        id: d.id,
        balloon: d.balloon,
        page: d.page || 1,
        datum_reference: d.datum_reference,
        type: d.type,
        type_label: d.type_label || d.nominal_str,
        nominal: d.nominal,
        nominal_str: d.nominal_str,
        upper_tol: d.upper_tol,
        lower_tol: d.lower_tol,
        measured: d.measured,
        deviation: d.deviation,
        status: d.status,
        bbox: d.bbox,
      })),
    };
    this.matchResult = matchCadWithDrawing(this.currentCadMetadata, drawingPayload);
    for (const matchedDim of this.matchResult.dimensions) {
      const target = this.dimensions.find((d) => d.id === matchedDim.id);
      if (target) {
        target.cad_feature_id = matchedDim.cad_feature_id;
        target.operation = matchedDim.operation;
        target.match_confidence = matchedDim.match_confidence;
        if (matchedDim.match_confidence === 'UNMATCHED') {
          target.status = 'WARN';
        }
      }
    }
  }

  public startWorkflow(): void {
    this.applyCleanInitialState();
  }

  public applyCleanInitialState(): void {
    if (typeof document === 'undefined') return;

    this.isConfirmed = false;
    this.hasLoadedDrawing = false;
    this.loadedFileName = '';
    this.pdfDoc = null;
    this.loadedImageUrl = null;
    this.dimensions = [];
    this.balloons = [];
    this.selectedId = null;
    this.activePage = 1;
    this.totalPages = 3;

    const pane2d = document.getElementById('dual-canvas-2d');
    if (pane2d) {
      pane2d.style.setProperty('display', 'none', 'important');
      pane2d.classList.remove('active');
    }

    const centerWorkspace = document.querySelector('.center-workspace') as HTMLElement | null;
    if (centerWorkspace) {
      centerWorkspace.style.setProperty('display', 'flex', 'important');
      centerWorkspace.style.setProperty('grid-template-columns', '1fr', 'important');
      centerWorkspace.style.setProperty('flex', '1', 'important');
      centerWorkspace.style.setProperty('width', '100%', 'important');
    }

    const cadViewport = document.getElementById('cad-viewport');
    if (cadViewport) {
      cadViewport.style.setProperty('width', '100%', 'important');
      cadViewport.style.setProperty('flex', '1', 'important');
    }

    const sidebarRight = document.querySelector('.sidebar-right') as HTMLElement | null;
    if (sidebarRight) {
      sidebarRight.style.setProperty('display', 'none', 'important');
    }

    const sidebarLeft = document.querySelector('.sidebar-left') as HTMLElement | null;
    if (sidebarLeft) {
      sidebarLeft.style.setProperty('width', '24%', 'important');
      sidebarLeft.style.setProperty('min-width', '280px', 'important');
      sidebarLeft.style.setProperty('max-width', '340px', 'important');

      const tabBar = sidebarLeft.querySelector('.sidebar-tab-bar') as HTMLElement | null;
      if (tabBar) tabBar.style.setProperty('display', 'none', 'important');

      const treeScroll = sidebarLeft.querySelector('.tree-scroll') as HTMLElement | null;
      if (treeScroll) treeScroll.style.setProperty('display', 'none', 'important');

      const drawScroll = document.getElementById('sidebar-drawing-scroll');
      if (drawScroll) drawScroll.style.setProperty('display', 'none', 'important');

      this.renderEmptyStateLeftPanel(sidebarLeft);
    }

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
      timeDisplay.innerText = '--:--';
    }

    const diagBadge = document.getElementById('diag-badge-status');
    if (diagBadge) {
      diagBadge.innerText = '--:--';
    }

    const diagContent = document.getElementById('diag-content');
    if (diagContent) {
      diagContent.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; color: #64748B; font-size: 11px;">
          Beklemede (--:--). Lütfen önce bir model ve teknik resim yükleyin.
        </div>
      `;
    }

    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        isDualCanvas?: boolean;
        blockGroup?: { visible: boolean };
        trajLine?: { visible: boolean };
        probeGroup?: { position: { set: (x: number, y: number, z: number) => void } };
        requestRender?: () => void;
      };

      win.isDualCanvas = false;
      if (win.blockGroup) win.blockGroup.visible = false;
      if (win.trajLine) win.trajLine.visible = false;
      if (win.probeGroup) win.probeGroup.position.set(0, 100, 0);

      window.dispatchEvent(new Event('resize'));
      if (typeof win.requestRender === 'function') {
        win.requestRender();
      }
    }

    const ribbonDualBtn = document.getElementById('ribbon-btn-dual');
    if (ribbonDualBtn) {
      ribbonDualBtn.classList.remove('active', 'primary');
      const lbl = ribbonDualBtn.querySelector('.ribbon-label');
      if (lbl) lbl.textContent = 'Çift Kanvas';
    }
  }

  private renderEmptyStateLeftPanel(sidebarLeft: HTMLElement): void {
    let container = document.getElementById('clean-features-panel');
    if (!container) {
      container = document.createElement('div');
      container.id = 'clean-features-panel';
      container.className = 'clean-features-panel';
      sidebarLeft.appendChild(container);
    }

    container.innerHTML = `
      <div class="clean-features-header">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="clean-header-title">ÖLÇÜM PLANI</span>
          <span class="clean-header-badge" style="background:#F1F5F9; color:#64748B;">0 Unsur</span>
        </div>
        <div class="clean-header-sub">Sıfır Durum • Beklemede</div>
      </div>
      <div class="clean-empty-state-card">
        <div class="empty-state-icon">📄</div>
        <div class="empty-state-title">Yüklü Ölçüm Planı Yok</div>
        <div class="empty-state-desc">Lütfen STEP ve Teknik Resim yükleyin.</div>
        <button class="btn-empty-drawing" id="btn-empty-open-drawing">
          📄 Teknik Resim Aç (Işık Masası)
        </button>
      </div>
    `;

    const openBtn = container.querySelector('#btn-empty-open-drawing');
    openBtn?.addEventListener('click', () => {
      this.handleTeknikResimClick();
    });
  }

  public async handleTeknikResimClick(): Promise<void> {
    const app = this.appInstance as { openAndLoadDrawingFile?: () => Promise<unknown> } | null;
    if (app && typeof app.openAndLoadDrawingFile === 'function') {
      try {
        const res = await app.openAndLoadDrawingFile();
        if (res) {
          this.openDrawingAuditModal();
          return;
        }
      } catch {}
    }
    this.openDrawingAuditModal();
  }

  public triggerFilePicker(): void {
    if (typeof document === 'undefined') return;
    const internalInput = document.getElementById('audit-drawing-input-internal') as HTMLInputElement | null;
    const globalInput = document.getElementById('drawing-file-input') as HTMLInputElement | null;
    const target = internalInput || globalInput;
    if (target) {
      try {
        target.click();
      } catch {}
    }
  }

  public async loadDrawingSample(): Promise<void> {
    this.loadedFileName = 'GOBEK_BAGI_OLUGU_TR_AB.pdf';
    this.pdfDoc = null;
    this.loadedImageUrl = null;
    this.dimensions = GOBEK_ALL_12_DIMENSIONS.map((d) => ({ ...d }));
    this.balloons = DEFAULT_GOBEK_BALLOONS.map((b) => ({ ...b }));
    this.totalPages = 3;
    this.activePage = 1;
    this.selectedId = this.dimensions.length > 0 ? this.dimensions[0].id : null;
    this.hasLoadedDrawing = true;

    if (typeof fetch === 'function') {
      try {
        const res = await fetch('test_assets/KPT - 3051 Gobek Bagı Olugu/GOBEK BAGI OLUGU_TR_AB.pdf');
        if (res.ok) {
          const buf = await res.arrayBuffer();
          const doc = await parsePdfDrawing(buf, 'GOBEK_BAGI_OLUGU_TR_AB.pdf');
          this.pdfDoc = doc.pdfDoc;
        }
      } catch {}
    }

    this.renderDrawingAuditModal();
  }

  public async loadDrawingFile(file: File): Promise<void> {
    this.loadedFileName = file.name;
    this.hasLoadedDrawing = true;

    const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
      electronIpc?: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> };
      nuperApp?: { loadDrawingData: (data: unknown) => void };
    };

    if (win.electronIpc && (file as unknown as { path?: string }).path) {
      try {
        const filePath = (file as unknown as { path: string }).path;
        const extracted = (await win.electronIpc.invoke('extract-drawing-data', filePath)) as {
          dimensions?: InspectionDimension[];
          page_count?: number;
          filename?: string;
        } | null;
        if (extracted && extracted.dimensions && extracted.dimensions.length > 0) {
          this.setExtractedData(extracted, file.name);
          if (win.nuperApp) {
            win.nuperApp.loadDrawingData(extracted);
          }
          return;
        }
      } catch {}
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      try {
        const buf = await file.arrayBuffer();
        const extracted = await parsePdfDrawing(buf, file.name);
        this.pdfDoc = extracted.pdfDoc;
        this.loadedImageUrl = null;
        this.totalPages = Math.max(1, extracted.result.page_count || 1);
        this.activePage = 1;
        this.setExtractedData(extracted.result, file.name);

        if (win.nuperApp) {
          win.nuperApp.loadDrawingData(extracted.result);
        }
        return;
      } catch {}
    }

    if (file.type.startsWith('image/') || /\.(png|jpe?g|svg)$/i.test(file.name)) {
      this.pdfDoc = null;
      if (typeof URL !== 'undefined') {
        this.loadedImageUrl = URL.createObjectURL(file);
      }
      this.totalPages = 1;
      this.activePage = 1;
      this.dimensions = [];
      this.balloons = [];
      this.renderDrawingAuditModal();
      return;
    }

    void this.loadDrawingSample();
  }

  public setExtractedData(
    data: {
      page_count?: number;
      filename?: string;
      dimensions?: Array<{
        id: number;
        balloon: string;
        page?: number;
        datum_reference?: string;
        type?: string;
        type_label?: string;
        icon?: string;
        nominal?: number;
        nominal_str?: string;
        upper_tol?: string;
        lower_tol?: string;
        measured?: string;
        deviation?: string;
        status?: 'PASS' | 'WARN' | 'FAIL' | 'UNMEASURED' | string;
        gdt?: string;
        op?: string;
        op_reason?: string;
        bbox?: [number, number, number, number];
      }>;
    },
    fileName?: string
  ): void {
    if (fileName) this.loadedFileName = fileName;
    else if (data.filename) this.loadedFileName = data.filename;
    this.hasLoadedDrawing = true;
    if (data.page_count) this.totalPages = Math.max(1, data.page_count);

    if (data.dimensions && data.dimensions.length > 0) {
      this.dimensions = data.dimensions.map((d) => ({
        id: d.id,
        balloon: d.balloon,
        page: d.page || 1,
        datum_reference: d.datum_reference,
        type: d.type || 'linear',
        type_label: d.type_label || d.nominal_str || 'Ölçü',
        icon: d.icon || '📏',
        nominal: d.nominal ?? 0,
        nominal_str: d.nominal_str || String(d.nominal ?? 0),
        upper_tol: d.upper_tol || '+0.100',
        lower_tol: d.lower_tol || '-0.100',
        measured: d.measured || String(d.nominal ?? 0),
        deviation: d.deviation || '0.000',
        status: (d.status as 'PASS' | 'WARN' | 'FAIL' | 'UNMEASURED') || 'PASS',
        gdt: d.gdt || 'ASME Y14.5',
        op: d.op || 'OP10',
        op_reason: d.op_reason || 'Standart üst bağlama (Z- probu).',
        bbox: d.bbox,
      }));

      this.balloons = data.dimensions.map((d) => ({
        id: d.id,
        page: d.page || 1,
        nominal: d.nominal,
        tolerance: `${d.lower_tol || '-0.100'}/${d.upper_tol || '+0.100'}`,
        bbox: d.bbox,
        pageHeight: 595.28,
        confirmed: d.status === 'PASS',
      }));

      this.selectedId = this.dimensions[0].id;
      this.recomputeCadMatch();
    }
    this.renderDrawingAuditModal();
  }

  public openDrawingAuditModal(page?: number): void {
    if (page !== undefined) {
      this.activePage = page;
    }
    this.isAuditOpen = true;
    if (typeof document === 'undefined') return;

    let modalEl = document.getElementById('modal-drawing-audit');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'modal-drawing-audit';
      modalEl.className = 'nuper-audit-modal-overlay';
      document.body.appendChild(modalEl);
    }

    modalEl.style.display = 'flex';
    this.renderDrawingAuditModal();

    if (!this.hasLoadedDrawing) {
      this.triggerFilePicker();
    }
  }

  public closeDrawingAuditModal(): void {
    this.isAuditOpen = false;
    if (typeof document === 'undefined') return;

    const modalEl = document.getElementById('modal-drawing-audit');
    if (modalEl) {
      modalEl.style.display = 'none';
    }
  }

  public confirmAndTransferPlan(): void {
    if (!this.hasLoadedDrawing) {
      this.loadDrawingSample();
    }
    this.isConfirmed = true;
    this.closeDrawingAuditModal();
    this.applyActivePlanToWorkspace(this.dimensions);
    if (this.confirmCallback) {
      this.confirmCallback(this.dimensions);
    }
  }

  public setActivePage(page: number): void {
    this.activePage = Math.max(1, Math.min(this.totalPages, page));
    this.renderDrawingAuditModal();
  }

  public setZoom(newZoom: number, centerX?: number, centerY?: number): void {
    const oldZoom = this.zoom;
    const clamped = Math.min(3.0, Math.max(0.5, parseFloat(newZoom.toFixed(2))));
    if (Math.abs(oldZoom - clamped) < 0.001) return;

    if (centerX !== undefined && centerY !== undefined) {
      this.panX = centerX - (centerX - this.panX) * (clamped / oldZoom);
      this.panY = centerY - (centerY - this.panY) * (clamped / oldZoom);
    }
    this.zoom = clamped;
    this.applyStageTransform();
  }

  public setPan(x: number, y: number): void {
    this.panX = Math.round(x);
    this.panY = Math.round(y);
    this.applyStageTransform();
  }

  public resetZoomPan(): void {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.applyStageTransform();
  }

  public selectDimension(id: number | null): void {
    this.selectedId = id;
    if (id !== null) {
      const dim = this.dimensions.find((d) => d.id === id);
      if (dim && dim.page && dim.page !== this.activePage) {
        this.activePage = dim.page;
      }
    }
    this.renderDrawingAuditModal();
  }

  public renderDrawingAuditModal(): void {
    if (typeof document === 'undefined') return;
    const modalEl = document.getElementById('modal-drawing-audit');
    if (!modalEl) return;

    const selectedDim = this.dimensions.find((d) => d.id === this.selectedId) || this.dimensions[0];

    modalEl.innerHTML = `
      <div class="nuper-audit-dialog">
        <div class="nuper-audit-header">
          <div class="nuper-audit-header-left">
            <span class="nuper-audit-badge">2D METROLOJİ IŞIK MASASI</span>
            <h2 class="nuper-audit-title">Nuper Drawing Inspector / 2D Metroloji Işık Masası</h2>
            <p class="nuper-audit-subtitle">ASME Y14.5 / ISO 15530-3 • Mühendislik Çizim Masası ve Canlı Balon Doğrulama</p>
          </div>
          <div class="nuper-audit-header-right">
            <button class="nuper-audit-confirm-btn" id="btn-close-drawing-audit">
              <span>✓ Onayla ve Ölçüm Planına Aktar</span>
            </button>
          </div>
        </div>

        <div class="nuper-audit-toolbar">
          <div class="nuper-audit-toolbar-left">
            <button class="audit-upload-btn" id="btn-audit-upload-file" title="Teknik Resim PDF veya Çizim Yükle">
              📁 PDF / Çizim Yükle
            </button>
            <button class="audit-upload-btn" id="btn-audit-add-feature" style="background:#0284C7;color:#FFF;border-color:#0369A1;" title="Yeni Metroloji Unsuru / Ölçü Tanımla (veya çizime sağ tıklayın)">
              ➕ Unsur Ekle
            </button>
            <input type="file" id="audit-drawing-input-internal" accept=".pdf,.png,.jpg,.jpeg,.svg" style="display: none;" />
            <span class="audit-file-name-badge ${this.hasLoadedDrawing ? 'loaded' : 'empty'}" id="audit-file-badge">
              ${this.hasLoadedDrawing ? '📄 ' + (this.loadedFileName || 'Teknik_Resim.pdf') : 'Henüz Dosya Yüklenmedi'}
            </span>
            ${
              !this.hasLoadedDrawing
                ? `<button class="audit-demo-btn" id="btn-audit-load-sample" title="Referans Numune PDF'ini Yükle">⚡ Numune Çizimi Yükle (Demo)</button>`
                : ''
            }
          </div>

          <div class="nuper-audit-zoom-controls">
            <button class="audit-tool-btn" id="btn-audit-zoom-out" title="Uzaklaştır">🔍 −</button>
            <span class="audit-zoom-readout" id="audit-zoom-level">${Math.round(this.zoom * 100)}% (${this.zoom.toFixed(1)}x)</span>
            <button class="audit-tool-btn" id="btn-audit-zoom-in" title="Yakınlaştır">🔍 +</button>
            <button class="audit-tool-btn reset" id="btn-audit-zoom-reset" title="Sıfırla">⟲ 100% Sıfırla</button>
          </div>

          <div class="nuper-audit-tip">
            <span>🖱️ Mouse tekerleği: <b>Zoom (0.5x − 3.0x)</b> | Sürükle: <b>Pan</b></span>
          </div>
        </div>

        <div class="nuper-audit-body-container">
          <div class="nuper-audit-pages-sidebar">
            <div class="audit-pages-sidebar-header">
              <span class="sidebar-header-title">SAYFALAR</span>
              <span class="sidebar-header-badge">${this.totalPages} Sayfa</span>
            </div>
            <div class="audit-pages-sidebar-list">
              ${this.renderPageThumbnails()}
            </div>
          </div>

          <div class="nuper-audit-viewport" id="audit-viewport-area">
            ${
              !this.hasLoadedDrawing
                ? this.renderEmptyDropzone()
                : `<div class="nuper-audit-stage" id="audit-canvas-stage">
                    ${this.renderDrawingStageContent(this.activePage)}
                   </div>`
            }
          </div>
        </div>

        <div class="nuper-audit-footer">
          <div class="nuper-audit-footer-left">
            ${
              this.hasLoadedDrawing && selectedDim
                ? `<span>Aktif Unsur: <b style="color:#0284C7;">${selectedDim.balloon} [${selectedDim.type_label || selectedDim.nominal_str}]</b> • Nominal: <b>${selectedDim.nominal_str}</b> • Tol: <b>${selectedDim.lower_tol}/${selectedDim.upper_tol}</b> • Datum: <b>${selectedDim.datum_reference || '[A]'}</b> • Kurulum: <span class="audit-op-badge" style="background:${selectedDim.op === 'OP20' ? '#D97706' : '#0284C7'};color:#FFF;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700;" title="${selectedDim.op_reason || ''}">${selectedDim.op || 'OP10'}</span> <i style="color:#64748B;">(${selectedDim.op_reason || 'Z- probu ile OP10'})</i></span>`
                : `<span>Lütfen incelemek için bir teknik resim yükleyin veya balona tıklayın.</span>`
            }
          </div>
          <div class="nuper-audit-footer-right">
            ${
              this.matchResult
                ? `<span class="audit-legend pass" title="${this.matchResult.op10_count} OP10, ${this.matchResult.op20_count} OP20">🎯 STEP Eşleşme: ${this.matchResult.match_percentage}% (${this.matchResult.matched_count}/${this.matchResult.total_dimensions})</span>`
                : ''
            }
            <span class="audit-legend pass">● ${this.dimensions.length} Ölçü Doğrulandı</span>
            <span class="audit-legend scale">Işık Masası: Beyaz Mod (Solid Slate Light)</span>
          </div>
        </div>
      </div>
    `;

    this.attachAuditEvents(modalEl);
    this.applyStageTransform();

    if (this.pdfDoc) {
      const pdfCanvas = modalEl.querySelector('#audit-pdf-page-canvas') as HTMLCanvasElement | null;
      if (pdfCanvas) {
        void renderPdfPageToCanvas(this.pdfDoc, this.activePage, pdfCanvas, 1.25).then((size) => {
          const overlay = modalEl.querySelector('#audit-balloon-overlay') as SVGSVGElement | null;
          if (overlay) {
            overlay.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`);
            overlay.style.width = `${size.width}px`;
            overlay.style.height = `${size.height}px`;
          }
        });
      }
    }
  }

  private renderDrawingStageContent(page: number): string {
    const pageDims = this.dimensions.filter((d) => (d.page || 1) === page);

    const balloonNodes = pageDims
      .map((d) => {
        const pt = this.getBalloonStageCoords(d);
        const cx = pt.cx;
        const cy = pt.cy;

        const isSel = d.id === this.selectedId;
        const stroke = isSel ? '#D97706' : '#0284C7';
        const fill = isSel ? 'rgba(217, 119, 6, 0.22)' : 'rgba(2, 132, 199, 0.15)';
        const text = isSel ? '#B45309' : '#0284C7';

        const opTag = d.op ? ` [${d.op}]` : '';
        const labelText = (d.nominal_str || (d.nominal !== undefined && d.nominal !== null ? `${d.nominal}` : '')) + opTag;
        const badgeWidth = Math.max(54, labelText.length * 7.5 + 14);
        const badgeX = cx - badgeWidth / 2;
        const badgeY = cy + 22;

        return `
          <g class="audit-balloon-node ${isSel ? 'active' : ''}" data-balloon-id="${d.id}" style="cursor: pointer;">
            <circle cx="${cx}" cy="${cy}" r="${isSel ? '22' : '18'}" fill="${fill}" stroke="${stroke}" stroke-width="${isSel ? '3' : '2'}"/>
            <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="${isSel ? '12.5' : '11'}" font-weight="800" font-family="'JetBrains Mono', monospace" fill="${text}">
              ${d.balloon}
            </text>
            ${
              labelText
                ? `
            <g class="audit-balloon-badge" style="pointer-events: none;">
              <rect x="${badgeX}" y="${badgeY}" width="${badgeWidth}" height="18" rx="4"
                    fill="${isSel ? '#0284C7' : '#0F172A'}" opacity="0.94" stroke="${isSel ? '#38BDF8' : '#334155'}" stroke-width="1"/>
              <text x="${cx}" y="${badgeY + 12}" text-anchor="middle" font-size="9.5" font-weight="700"
                    font-family="'JetBrains Mono', monospace" fill="#FFFFFF">
                ${labelText}
              </text>
            </g>
            `
                : ''
            }
            <circle cx="${cx}" cy="${cy}" r="28" fill="transparent"/>
          </g>
        `;
      })
      .join('');

    if (this.pdfDoc) {
      return `
        <div class="audit-pdf-render-wrap" style="position: relative; display: inline-block;">
          <canvas id="audit-pdf-page-canvas" style="display: block; box-shadow: 0 4px 20px rgba(0,0,0,0.12); border-radius: 4px; background: #FFFFFF;"></canvas>
          <svg id="audit-balloon-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto;">
            ${balloonNodes}
          </svg>
        </div>
      `;
    }

    if (this.loadedImageUrl) {
      return `
        <div class="audit-img-render-wrap" style="position: relative; display: inline-block;">
          <img src="${this.loadedImageUrl}" style="max-width: 1200px; display: block; box-shadow: 0 4px 20px rgba(0,0,0,0.12); border-radius: 4px; background: #FFFFFF;" />
          <svg id="audit-balloon-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto;">
            ${balloonNodes}
          </svg>
        </div>
      `;
    }

    return this.renderDrawingSheetSvg(page);
  }

  private renderPageThumbnails(): string {
    const items: string[] = [];
    for (let p = 1; p <= this.totalPages; p++) {
      const pageDims = this.dimensions.filter((d) => (d.page || 1) === p);
      const balloonCount = pageDims.length;
      const isActive = this.activePage === p;
      items.push(`
        <div class="audit-page-thumb ${isActive ? 'active' : ''}" data-page="${p}">
          <div class="thumb-sheet-box">
            <div class="thumb-sheet-inner">
              <span class="thumb-sheet-preview-text">PAFTA ${p}</span>
              <span class="thumb-sheet-badge">${balloonCount > 0 ? `${balloonCount} Balon` : 'Genel'}</span>
            </div>
          </div>
          <div class="thumb-sheet-info">
            <span class="thumb-page-title">Sayfa ${p}</span>
            <span class="thumb-page-sub">${balloonCount > 0 ? `${balloonCount} Ölçü Balonlandı` : 'Montaj & Datum'}</span>
          </div>
        </div>
      `);
    }
    return items.join('');
  }

  private renderEmptyDropzone(): string {
    return `
      <div class="audit-empty-dropzone" id="audit-dropzone-click">
        <div class="dropzone-card">
          <div class="dropzone-icon">📐</div>
          <h3 class="dropzone-title">Teknik Resim PDF'i Yükleyin</h3>
          <p class="dropzone-desc">
            ASME Y14.5 / ISO 1101 metroloji teknik resmini buraya sürükleyin veya bilgisayarınızdan seçin.
          </p>
          <div class="dropzone-actions">
            <button class="dropzone-btn primary" id="btn-dropzone-select">
              📁 PDF Dosyası Seç
            </button>
            <button class="dropzone-btn secondary" id="btn-dropzone-sample">
              ⚡ Numune Teknik Resim Yükle
            </button>
          </div>
          <div class="dropzone-features">
            <span>✓ Çok Sayfalı Belge Gezgini</span>
            <span>✓ Otomatik Bounding Box & Balonlama</span>
            <span>✓ 3D Dijital İkiz Doğrulama</span>
          </div>
        </div>
      </div>
    `;
  }

  private renderDrawingSheetSvg(page: number): string {
    const isP1 = page === 1;
    const isP2 = page === 2;
    const pageDims = this.dimensions.filter((d) => (d.page || 1) === page);

    const balloonNodes = pageDims
      .map((d) => {
        const pt = this.getBalloonStageCoords(d);
        const isSel = d.id === this.selectedId;
        const stroke = isSel ? '#D97706' : '#0284C7';
        const fill = isSel ? 'rgba(217, 119, 6, 0.18)' : 'rgba(2, 132, 199, 0.12)';
        const text = isSel ? '#B45309' : '#0284C7';

        const opTag = d.op ? ` [${d.op}]` : '';
        const labelText = (d.nominal_str || (d.nominal !== undefined && d.nominal !== null ? `${d.nominal}` : '')) + opTag;
        const badgeWidth = Math.max(54, labelText.length * 7.5 + 14);
        const badgeX = pt.cx - badgeWidth / 2;
        const badgeY = pt.cy + 22;

        return `
          <g class="audit-balloon-node ${isSel ? 'active' : ''}" data-balloon-id="${d.id}" style="cursor: pointer;">
            <circle cx="${pt.cx}" cy="${pt.cy}" r="${isSel ? '22' : '18'}" fill="${fill}" stroke="${stroke}" stroke-width="${isSel ? '3' : '2'}"/>
            <text x="${pt.cx}" y="${pt.cy + 4}" text-anchor="middle" font-size="${isSel ? '12.5' : '11'}" font-weight="800" font-family="'JetBrains Mono', monospace" fill="${text}">
              ${d.balloon}
            </text>
            ${
              labelText
                ? `
            <g class="audit-balloon-badge" style="pointer-events: none;">
              <rect x="${badgeX}" y="${badgeY}" width="${badgeWidth}" height="18" rx="4"
                    fill="${isSel ? '#0284C7' : '#0F172A'}" opacity="0.94" stroke="${isSel ? '#38BDF8' : '#334155'}" stroke-width="1"/>
              <text x="${pt.cx}" y="${badgeY + 12}" text-anchor="middle" font-size="9.5" font-weight="700"
                    font-family="'JetBrains Mono', monospace" fill="#FFFFFF">
                ${labelText}
              </text>
            </g>
            `
                : ''
            }
            <circle cx="${pt.cx}" cy="${pt.cy}" r="28" fill="transparent"/>
          </g>
        `;
      })
      .join('');

    let sheetContent = '';
    if (isP1) {
      sheetContent = `
        <g stroke="#CBD5E1" stroke-width="1.5">
          <rect x="180" y="110" width="840" height="400" rx="4" fill="#FFFFFF"/>
        </g>
        <line x1="200" y1="310" x2="1000" y2="310" stroke="#0284C7" stroke-width="1" stroke-dasharray="10 5 2 5"/>
        <line x1="600" y1="120" x2="600" y2="490" stroke="#0284C7" stroke-width="1" stroke-dasharray="10 5 2 5"/>
        <rect x="260" y="180" width="680" height="260" rx="6" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
        
        <g transform="translate(260, 440)">
          <path d="M0,0 L-14,24 L14,24 Z" fill="#059669"/>
          <rect x="-18" y="24" width="36" height="24" fill="#059669" rx="2"/>
          <text x="0" y="41" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="'JetBrains Mono', monospace">A</text>
          <text x="25" y="38" fill="#059669" font-size="11" font-weight="700">DATUM [A] TABAN TEMAS DÜZLEMİ</text>
        </g>

        <g transform="translate(940, 310)">
          <path d="M0,0 L24,-14 L24,14 Z" fill="#0284C7"/>
          <rect x="24" y="-12" width="36" height="24" fill="#0284C7" rx="2"/>
          <text x="42" y="5" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="'JetBrains Mono', monospace">B</text>
          <text x="68" y="4" fill="#0284C7" font-size="11" font-weight="700">DATUM [B] ALIN</text>
        </g>

        <g transform="translate(600, 180)">
          <path d="M0,0 L-14,-24 L14,-24 Z" fill="#0284C7"/>
          <rect x="-18" y="-48" width="36" height="24" fill="#0284C7" rx="2"/>
          <text x="0" y="-32" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="'JetBrains Mono', monospace">C</text>
          <text x="25" y="-32" fill="#0284C7" font-size="11" font-weight="700">DATUM [C] YAN DÜZLEM</text>
        </g>
      `;
    } else if (isP2) {
      sheetContent = `
        <rect x="140" y="80" width="920" height="460" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="180" y="170" width="840" height="230" rx="4" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
        <line x1="180" y1="170" x2="1020" y2="170" stroke="#0284C7" stroke-width="1.5" stroke-dasharray="8 4"/>
        <line x1="180" y1="400" x2="1020" y2="400" stroke="#059669" stroke-width="3"/>
        <text x="200" y="426" fill="#059669" font-size="12" font-weight="700">DATUM [A] TABAN TEMAS DÜZLEMİ (Z=0.000 mm)</text>

        <circle cx="300" cy="285" r="18" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
        <circle cx="460" cy="285" r="18" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
        <circle cx="740" cy="285" r="18" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
        <circle cx="900" cy="285" r="18" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>

        <line x1="180" y1="130" x2="1020" y2="130" stroke="#64748B" stroke-width="1.5"/>
        <text x="600" y="122" text-anchor="middle" fill="#0F172A" font-size="13" font-family="'JetBrains Mono', monospace" font-weight="700">395.5 ±0.800 mm [Tam Boy]</text>

        <line x1="300" y1="460" x2="900" y2="460" stroke="#64748B" stroke-width="1.5"/>
        <text x="600" y="478" text-anchor="middle" fill="#0F172A" font-size="13" font-family="'JetBrains Mono', monospace" font-weight="700">305.2 ±0.500 mm [Eksenler Arası]</text>
      `;
    } else {
      sheetContent = `
        <rect x="140" y="80" width="920" height="460" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="220" y="140" width="300" height="300" rx="4" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
        <circle cx="370" cy="290" r="70" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
        <circle cx="280" cy="200" r="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
        <circle cx="460" cy="200" r="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
        <circle cx="280" cy="380" r="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
        <circle cx="460" cy="380" r="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
        <text x="370" y="465" text-anchor="middle" fill="#0F172A" font-size="12.5" font-weight="700">DETAY M (Kare Flanş Grubu 36.5 ±0.1)</text>

        <rect x="680" y="150" width="380" height="280" rx="4" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
        <path d="M680 220 H1060 V360 H680 Z" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
        <line x1="680" y1="150" x2="1060" y2="150" stroke="#059669" stroke-width="2" stroke-dasharray="6 3"/>
        <text x="870" y="460" text-anchor="middle" fill="#0F172A" font-size="12.5" font-weight="700">KESIT G-G (Ø43 Dış Çap / Ø21 İç Çap)</text>
      `;
    }

    return `
      <svg viewBox="0 0 1200 640" width="1200" height="640" class="nuper-light-table-svg" style="background: #FFFFFF; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <defs>
          <pattern id="light-table-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(2, 132, 199, 0.04)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="1200" height="640" fill="url(#light-table-grid)"/>

        <rect x="25" y="20" width="1150" height="600" fill="none" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="35" y="30" width="1130" height="580" fill="none" stroke="#E2E8F0" stroke-width="1"/>

        ${sheetContent}
        ${balloonNodes}

        <g transform="translate(860, 500)">
          <rect width="290" height="100" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" rx="3"/>
          <line x1="0" y1="32" x2="290" y2="32" stroke="#E2E8F0" stroke-width="1"/>
          <line x1="0" y1="66" x2="290" y2="66" stroke="#E2E8F0" stroke-width="1"/>
          <line x1="180" y1="0" x2="180" y2="100" stroke="#E2E8F0" stroke-width="1"/>
          
          <text x="12" y="21" fill="#64748B" font-size="9.5" font-weight="800" font-family="'JetBrains Mono', monospace">DÖKÜMAN</text>
          <text x="12" y="52" fill="#0F172A" font-size="11.5" font-weight="800">${this.loadedFileName || 'TEKNİK RESİM'}</text>
          <text x="12" y="85" fill="#0284C7" font-size="10" font-weight="700">ASME Y14.5 | ISO 1101</text>
          
          <text x="192" y="21" fill="#64748B" font-size="9.5" font-weight="800" font-family="'JetBrains Mono', monospace">PAFTA</text>
          <text x="192" y="52" fill="#0F172A" font-size="14" font-weight="900" font-family="'JetBrains Mono', monospace">${page} / ${this.totalPages}</text>
          <text x="192" y="85" fill="#059669" font-size="10" font-weight="700">DATUM [A][B][C]</text>
        </g>
      </svg>
    `;
  }

  private attachAuditEvents(modalEl: HTMLElement): void {
    const confirmBtn = modalEl.querySelector('#btn-close-drawing-audit');
    confirmBtn?.addEventListener('click', () => this.confirmAndTransferPlan());

    const uploadBtn = modalEl.querySelector('#btn-audit-upload-file');
    uploadBtn?.addEventListener('click', () => this.triggerFilePicker());

    const sampleBtn = modalEl.querySelector('#btn-audit-load-sample');
    sampleBtn?.addEventListener('click', () => this.loadDrawingSample());

    const dropzoneSelectBtn = modalEl.querySelector('#btn-dropzone-select');
    dropzoneSelectBtn?.addEventListener('click', () => this.triggerFilePicker());

    const dropzoneSampleBtn = modalEl.querySelector('#btn-dropzone-sample');
    dropzoneSampleBtn?.addEventListener('click', () => this.loadDrawingSample());

    const internalFileInput = modalEl.querySelector<HTMLInputElement>('#audit-drawing-input-internal');
    internalFileInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        void this.loadDrawingFile(target.files[0]);
      }
    });

    if (typeof document !== 'undefined') {
      const globalInput = document.getElementById('drawing-file-input') as HTMLInputElement | null;
      globalInput?.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          void this.loadDrawingFile(target.files[0]);
        }
      });
    }

    modalEl.querySelectorAll<HTMLElement>('.audit-page-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const pageAttr = thumb.getAttribute('data-page');
        if (pageAttr) {
          this.setActivePage(parseInt(pageAttr, 10));
        }
      });
    });

    const zoomInBtn = modalEl.querySelector('#btn-audit-zoom-in');
    zoomInBtn?.addEventListener('click', () => this.setZoom(this.zoom + 0.2));

    const zoomOutBtn = modalEl.querySelector('#btn-audit-zoom-out');
    zoomOutBtn?.addEventListener('click', () => this.setZoom(this.zoom - 0.2));

    const zoomResetBtn = modalEl.querySelector('#btn-audit-zoom-reset');
    zoomResetBtn?.addEventListener('click', () => this.resetZoomPan());

    const viewport = modalEl.querySelector<HTMLElement>('#audit-viewport-area');
    if (viewport) {
      viewport.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
        viewport.style.background = '#F0F9FF';
      });
      viewport.addEventListener('dragleave', () => {
        viewport.style.background = '#F1F5F9';
      });
      viewport.addEventListener('drop', (e: DragEvent) => {
        e.preventDefault();
        viewport.style.background = '#F1F5F9';
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          void this.loadDrawingFile(e.dataTransfer.files[0]);
        }
      });

      viewport.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect?.() || { left: 0, top: 0 };
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        this.setZoom(this.zoom + delta, mouseX, mouseY);
      });

      viewport.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button !== 0) return;
        this.isDragging = true;
        this.dragStartX = e.clientX - this.panX;
        this.dragStartY = e.clientY - this.panY;
        viewport.style.cursor = 'grabbing';
      });

      const onMouseMove = (e: MouseEvent) => {
        if (!this.isDragging) return;
        this.setPan(e.clientX - this.dragStartX, e.clientY - this.dragStartY);
      };

      const onMouseUp = () => {
        if (this.isDragging) {
          this.isDragging = false;
          if (viewport) viewport.style.cursor = 'grab';
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }

      viewport.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        const stage = document.getElementById('audit-canvas-stage');
        const rect = (stage || viewport).getBoundingClientRect?.() || { left: 0, top: 0 };
        const canvasX = Math.round((e.clientX - rect.left) / this.zoom);
        const canvasY = Math.round((e.clientY - rect.top) / this.zoom);

        const hitDim = this.findBalloonNear(canvasX, canvasY, this.activePage, 35);

        FeatureDefinitionModal.getInstance().showContextMenu({
          clientX: e.clientX,
          clientY: e.clientY,
          canvasX,
          canvasY,
          page: this.activePage,
          existingItem: hitDim ? { id: hitDim.id, balloon: hitDim.balloon, nominal_str: hitDim.nominal_str } : null,
          onAdd: (coords) => this.promptAddFeature(coords.x, coords.y, coords.page),
          onEdit: (id) => this.promptEditFeature(id),
          onDelete: (id) => this.removeFeature(id),
        });
      });

      const addFeatureBtn = modalEl.querySelector('#btn-audit-add-feature');
      addFeatureBtn?.addEventListener('click', () => {
        this.promptAddFeature(500, 350, this.activePage);
      });
    }

    modalEl.querySelectorAll<HTMLElement>('.audit-balloon-node').forEach((node) => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const idAttr = node.getAttribute('data-balloon-id');
        if (idAttr) {
          this.selectDimension(parseInt(idAttr, 10));
        }
      });
      node.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const idAttr = node.getAttribute('data-balloon-id');
        if (idAttr) {
          this.promptEditFeature(parseInt(idAttr, 10));
        }
      });
    });
  }

  public getBalloonStageCoords(d: InspectionDimension): { cx: number; cy: number } {
    if (d.bbox && d.bbox.length >= 2) {
      if (this.pdfDoc) {
        return { cx: Math.round(d.bbox[0] * 1.25), cy: Math.round(d.bbox[1] * 1.25) };
      }
      return { cx: Math.round(d.bbox[0]), cy: Math.round(d.bbox[1]) };
    }
    const coordsMapP2: Record<number, { cx: number; cy: number }> = {
      1: { cx: 620, cy: 110 },
      2: { cx: 580, cy: 460 },
      3: { cx: 340, cy: 260 },
      4: { cx: 880, cy: 230 },
      5: { cx: 280, cy: 300 },
      6: { cx: 820, cy: 420 },
    };
    const coordsMapP3: Record<number, { cx: number; cy: number }> = {
      7: { cx: 340, cy: 230 },
      8: { cx: 480, cy: 380 },
      9: { cx: 820, cy: 190 },
      10: { cx: 820, cy: 330 },
      11: { cx: 940, cy: 430 },
      12: { cx: 1010, cy: 260 },
    };
    const coordsMap = (d.page || 1) === 2 ? coordsMapP2 : coordsMapP3;
    return coordsMap[d.id] || { cx: 400, cy: 250 };
  }

  public findBalloonNear(x: number, y: number, page: number, maxDist: number = 35): InspectionDimension | null {
    const pageDims = this.dimensions.filter((d) => (d.page || 1) === page);
    for (const d of pageDims) {
      const pt = this.getBalloonStageCoords(d);
      const dist = Math.hypot(pt.cx - x, pt.cy - y);
      if (dist <= maxDist) {
        return d;
      }
    }
    return null;
  }

  public promptAddFeature(canvasX: number, canvasY: number, page: number = this.activePage): void {
    const existingIds = this.dimensions.map((d) => d.id);
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    FeatureDefinitionModal.getInstance().openModal({
      canvasX,
      canvasY,
      page,
      nextId,
      onSave: (data: DefinedFeatureData) => {
        const storedBbox: [number, number, number, number] = this.pdfDoc
          ? [Math.round(canvasX / 1.25), Math.round(canvasY / 1.25), Math.round(canvasX / 1.25) + 40, Math.round(canvasY / 1.25) + 20]
          : [canvasX, canvasY, canvasX + 40, canvasY + 20];

        const newDim: InspectionDimension = {
          id: data.id || nextId,
          balloon: data.balloon || `#${data.id || nextId}`,
          page: data.page || page,
          type: data.type,
          type_label: data.type_label,
          icon: data.icon,
          nominal: data.nominal,
          nominal_str: data.nominal_str,
          upper_tol: data.upper_tol,
          lower_tol: data.lower_tol,
          measured: '',
          deviation: '',
          status: 'UNMEASURED',
          feature_key: `feat_${data.id || nextId}_${data.nominal}`.replace(/[^a-zA-Z0-9_]/g, '_'),
          datum_reference: data.datum_reference,
          bbox: storedBbox,
        };

        this.dimensions.push(newDim);
        this.balloons.push({
          id: newDim.id,
          page: newDim.page,
          nominal: newDim.nominal,
          tolerance: `${newDim.lower_tol}/${newDim.upper_tol}`,
          bbox: storedBbox,
          pageHeight: 595.28,
          confirmed: true,
          feature_label: newDim.nominal_str,
        });

        this.selectedId = newDim.id;
        this.renderDrawingAuditModal();

        const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
          nuperApp?: { getDrawingCanvas: () => { setBalloons: (b: unknown[]) => void } };
        };
        if (win.nuperApp) {
          win.nuperApp.getDrawingCanvas().setBalloons(this.balloons);
        }
      },
    });
  }

  public promptEditFeature(id: number): void {
    const dim = this.dimensions.find((d) => d.id === id);
    if (!dim) return;
    const pt = this.getBalloonStageCoords(dim);

    FeatureDefinitionModal.getInstance().openModal({
      canvasX: pt.cx,
      canvasY: pt.cy,
      page: dim.page || this.activePage,
      nextId: dim.id,
      existingData: {
        id: dim.id,
        balloon: dim.balloon,
        type: dim.type,
        type_label: dim.type_label,
        nominal: dim.nominal,
        nominal_str: dim.nominal_str,
        upper_tol: dim.upper_tol,
        lower_tol: dim.lower_tol,
        datum_reference: dim.datum_reference,
        description: dim.type_label,
      },
      onSave: (data: DefinedFeatureData) => {
        dim.type = data.type;
        dim.type_label = data.type_label;
        dim.icon = data.icon;
        dim.nominal = data.nominal;
        dim.nominal_str = data.nominal_str;
        dim.upper_tol = data.upper_tol;
        dim.lower_tol = data.lower_tol;
        dim.datum_reference = data.datum_reference;

        const balloon = this.balloons.find((b) => b.id === id);
        if (balloon) {
          balloon.nominal = data.nominal;
          balloon.tolerance = `${data.lower_tol}/${data.upper_tol}`;
          balloon.feature_label = data.nominal_str;
        }

        this.renderDrawingAuditModal();

        const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
          nuperApp?: { getDrawingCanvas: () => { setBalloons: (b: unknown[]) => void } };
        };
        if (win.nuperApp) {
          win.nuperApp.getDrawingCanvas().setBalloons(this.balloons);
        }
      },
    });
  }

  public removeFeature(id: number): void {
    this.dimensions = this.dimensions.filter((d) => d.id !== id);
    this.balloons = this.balloons.filter((b) => b.id !== id);
    if (this.selectedId === id) {
      this.selectedId = this.dimensions.length > 0 ? this.dimensions[0].id : null;
    }
    this.renderDrawingAuditModal();

    const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
      nuperApp?: { getDrawingCanvas: () => { setBalloons: (b: unknown[]) => void } };
    };
    if (win.nuperApp) {
      win.nuperApp.getDrawingCanvas().setBalloons(this.balloons);
    }
  }

  private applyStageTransform(): void {
    if (typeof document === 'undefined') return;
    const stage = document.getElementById('audit-canvas-stage');
    if (stage) {
      stage.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
      stage.style.transformOrigin = '0 0';
    }
    const readout = document.getElementById('audit-zoom-level');
    if (readout) {
      readout.textContent = `${Math.round(this.zoom * 100)}% (${this.zoom.toFixed(1)}x)`;
    }
  }

  public applyActivePlanToWorkspace(dims: InspectionDimension[] = this.dimensions): void {
    if (typeof document === 'undefined') return;

    const pane2d = document.getElementById('dual-canvas-2d');
    if (pane2d) {
      pane2d.style.setProperty('display', 'none', 'important');
      pane2d.classList.remove('active');
    }

    const centerWorkspace = document.querySelector('.center-workspace') as HTMLElement | null;
    if (centerWorkspace) {
      centerWorkspace.style.setProperty('display', 'flex', 'important');
      centerWorkspace.style.setProperty('grid-template-columns', '1fr', 'important');
      centerWorkspace.style.setProperty('flex', '1', 'important');
      centerWorkspace.style.setProperty('width', '100%', 'important');
    }

    const cadViewport = document.getElementById('cad-viewport');
    if (cadViewport) {
      cadViewport.style.setProperty('width', '100%', 'important');
      cadViewport.style.setProperty('flex', '1', 'important');
    }

    const sidebarRight = document.querySelector('.sidebar-right') as HTMLElement | null;
    if (sidebarRight) {
      sidebarRight.style.setProperty('display', 'none', 'important');
    }

    const sidebarLeft = document.querySelector('.sidebar-left') as HTMLElement | null;
    if (sidebarLeft) {
      sidebarLeft.style.setProperty('width', '24%', 'important');
      sidebarLeft.style.setProperty('min-width', '280px', 'important');
      sidebarLeft.style.setProperty('max-width', '340px', 'important');

      const tabBar = sidebarLeft.querySelector('.sidebar-tab-bar') as HTMLElement | null;
      if (tabBar) tabBar.style.setProperty('display', 'none', 'important');

      const treeScroll = sidebarLeft.querySelector('.tree-scroll') as HTMLElement | null;
      if (treeScroll) treeScroll.style.setProperty('display', 'none', 'important');

      const drawScroll = document.getElementById('sidebar-drawing-scroll');
      if (drawScroll) drawScroll.style.setProperty('display', 'none', 'important');

      this.renderVerifiedFeaturesList(sidebarLeft, dims);
    }

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
      timeDisplay.innerText = '00:00 / 00:34';
    }

    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        isDualCanvas?: boolean;
        blockGroup?: { visible: boolean };
        trajLine?: { visible: boolean };
        probeGroup?: { position: { set: (x: number, y: number, z: number) => void } };
        requestRender?: () => void;
      };

      win.isDualCanvas = false;
      if (win.blockGroup) win.blockGroup.visible = true;
      if (win.trajLine) win.trajLine.visible = true;

      window.dispatchEvent(new Event('resize'));
      if (typeof win.requestRender === 'function') {
        win.requestRender();
      }
    }
  }

  private renderVerifiedFeaturesList(sidebarLeft: HTMLElement, dims: InspectionDimension[]): void {
    let container = document.getElementById('clean-features-panel');
    if (!container) {
      container = document.createElement('div');
      container.id = 'clean-features-panel';
      container.className = 'clean-features-panel';
      sidebarLeft.appendChild(container);
    }

    container.innerHTML = `
      <div class="clean-features-header">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="clean-header-title">ÖLÇÜLECEK ÖZELLİKLER</span>
          <span class="clean-header-badge">${dims.length} Unsur</span>
        </div>
        <div class="clean-header-sub">ASME Y14.5 Doğrulanmış Ölçüm Planı</div>
      </div>
      <div class="clean-features-list">
        ${dims
          .map((d) => {
            const isSel = d.id === this.selectedId;
            return `
              <div class="clean-feature-item ${isSel ? 'active' : ''}" data-clean-id="${d.id}">
                <div class="clean-feature-top">
                  <span class="clean-balloon-badge ${isSel ? 'active' : ''}">${d.balloon}</span>
                  <span class="clean-feature-name">${d.icon || '📏'} ${d.type_label || d.nominal_str}</span>
                  <span class="clean-operation-pill ${(d.operation || 'OP10').toLowerCase()}">${d.operation || 'OP10'}</span>
                  <span class="clean-status-pill ${d.status === 'PASS' ? 'pass' : 'warn'}">${d.status} ✓</span>
                </div>
                <div class="clean-feature-bottom">
                  <span>Nominal: <b>${d.nominal_str}</b></span>
                  <span>Tol: ${d.lower_tol}/${d.upper_tol}</span>
                  ${
                    d.cad_feature_id
                      ? `<span class="clean-cad-tag" title="CAD B-Rep Eşlendi: ${d.cad_feature_id}">🎯 ${d.cad_feature_id}</span>`
                      : `<span>Datum: ${d.datum_reference || '[A]'}</span>`
                  }
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;

    container.querySelectorAll<HTMLElement>('.clean-feature-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idAttr = item.getAttribute('data-clean-id');
        if (idAttr) {
          const id = parseInt(idAttr, 10);
          this.selectDimension(id);
          this.activateDimensionIn3d(id);
        }
      });
    });
  }

  public activateDimensionIn3d(id: number): void {
    const dim = this.dimensions.find((d) => d.id === id);
    if (!dim) return;

    const coords = InspectionSynchronizer.getFeatureCoordinates(id);
    const hudName = document.getElementById('hud-feature-name');
    const hudCoords = document.getElementById('hud-feature-coords');
    const hudDetails = document.getElementById('hud-feature-details');

    if (hudName) {
      hudName.innerText = `${dim.balloon} [${dim.type_label || dim.nominal_str}]`;
    }
    if (hudCoords) {
      hudCoords.innerText = `Prob (PCS): X: ${coords.x.toFixed(2)} | Y: ${coords.y.toFixed(2)} | Z: ${coords.z.toFixed(2)} mm`;
    }
    if (hudDetails) {
      hudDetails.innerText = `${dim.gdt || 'ASME Y14.5'} | Tol: ${dim.lower_tol} / ${dim.upper_tol} | Ölçülen: ${dim.measured}`;
    }

    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        probeGroup?: { position: { set: (x: number, y: number, z: number) => void } };
        triggerContactRipple?: (x: number, y: number, z: number) => void;
        requestRender?: () => void;
        showToast?: (msg: string) => void;
      };

      if (win.probeGroup) {
        win.probeGroup.position.set(coords.x, coords.y + 20, coords.z);
        if (typeof win.triggerContactRipple === 'function') {
          win.triggerContactRipple(coords.x, coords.y, coords.z);
        }
        if (typeof win.requestRender === 'function') {
          win.requestRender();
        }
      }

      if (typeof win.showToast === 'function') {
        win.showToast(`🎯 Balon ${dim.balloon}: ${dim.nominal_str} (Ölçülen: ${dim.measured}) ✓`);
      }
    }
  }

  public injectStyles(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById('nuper-audit-light-styles')) return;

    const style = document.createElement('style');
    style.id = 'nuper-audit-light-styles';
    style.textContent = `
      .nuper-audit-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: 'Inter', system-ui, sans-serif;
      }
      .nuper-audit-dialog {
        width: 1400px;
        max-width: 98vw;
        height: 92vh;
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: #0F172A;
      }
      .nuper-audit-header {
        height: 64px;
        padding: 0 20px;
        background: #F8FAFC;
        border-bottom: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .nuper-audit-badge {
        font-size: 9.5px;
        font-weight: 800;
        color: #0284C7;
        letter-spacing: 1px;
        font-family: 'JetBrains Mono', monospace;
      }
      .nuper-audit-title {
        font-size: 16px;
        font-weight: 700;
        color: #0F172A;
        margin: 2px 0 0 0;
      }
      .nuper-audit-subtitle {
        font-size: 11px;
        color: #64748B;
        margin: 2px 0 0 0;
      }
      .nuper-audit-confirm-btn {
        padding: 9px 20px;
        background: #0284C7;
        border: 1px solid #0369A1;
        border-radius: 6px;
        color: #FFFFFF;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: background 0.15s ease;
      }
      .nuper-audit-confirm-btn:hover {
        background: #0369A1;
      }
      .nuper-audit-toolbar {
        height: 52px;
        padding: 0 20px;
        background: #F8FAFC;
        border-bottom: 1px solid #CBD5E1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .nuper-audit-toolbar-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .audit-upload-btn {
        padding: 7px 15px;
        background: #0F172A;
        color: #FFFFFF;
        border: 1px solid #0F172A;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.15s ease;
      }
      .audit-upload-btn:hover {
        background: #1E293B;
      }
      .audit-file-name-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 4px;
        max-width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .audit-file-name-badge.empty {
        background: #F1F5F9;
        color: #64748B;
        border: 1px solid #E2E8F0;
      }
      .audit-file-name-badge.loaded {
        background: #ECFDF5;
        color: #059669;
        border: 1px solid #A7F3D0;
        font-weight: 700;
      }
      .audit-demo-btn {
        padding: 6px 12px;
        background: #FFFFFF;
        color: #0284C7;
        border: 1px solid #BAE6FD;
        border-radius: 5px;
        font-size: 11.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .audit-demo-btn:hover {
        background: #F0F9FF;
        border-color: #0284C7;
      }
      .nuper-audit-zoom-controls {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .audit-tool-btn {
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 4px;
        border: 1px solid #CBD5E1;
        background: #FFFFFF;
        color: #1E293B;
        cursor: pointer;
      }
      .audit-tool-btn:hover {
        background: #E2E8F0;
        border-color: #94A3B8;
      }
      .audit-tool-btn.reset {
        color: #0284C7;
      }
      .audit-zoom-readout {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #0284C7;
        font-weight: 700;
        min-width: 90px;
        text-align: center;
      }
      .nuper-audit-tip {
        font-size: 11px;
        color: #64748B;
      }
      .nuper-audit-body-container {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
        background: #F8FAFC;
      }
      .nuper-audit-pages-sidebar {
        width: 210px;
        min-width: 210px;
        max-width: 210px;
        background: #FFFFFF;
        border-right: 1px solid #CBD5E1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .audit-pages-sidebar-header {
        padding: 12px 14px;
        background: #F8FAFC;
        border-bottom: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sidebar-header-title {
        font-size: 11px;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: 0.5px;
      }
      .sidebar-header-badge {
        font-size: 10px;
        font-weight: 700;
        color: #0284C7;
        background: #E0F2FE;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .audit-pages-sidebar-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .audit-page-thumb {
        border: 1.5px solid #E2E8F0;
        border-radius: 6px;
        padding: 8px;
        background: #F8FAFC;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .audit-page-thumb:hover {
        border-color: #94A3B8;
        background: #FFFFFF;
      }
      .audit-page-thumb.active {
        border-color: #0284C7;
        background: #F0F9FF;
        box-shadow: 0 0 0 1px #0284C7;
      }
      .thumb-sheet-box {
        width: 100%;
        height: 74px;
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .thumb-sheet-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .thumb-sheet-preview-text {
        font-size: 9px;
        font-weight: 800;
        color: #64748B;
        font-family: 'JetBrains Mono', monospace;
      }
      .thumb-sheet-badge {
        font-size: 10px;
        font-weight: 700;
        color: #0284C7;
        background: #E0F2FE;
        padding: 1px 6px;
        border-radius: 3px;
      }
      .thumb-sheet-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .thumb-page-title {
        font-size: 11.5px;
        font-weight: 700;
        color: #0F172A;
      }
      .thumb-page-sub {
        font-size: 10px;
        color: #64748B;
      }
      .audit-empty-dropzone {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
      }
      .dropzone-card {
        background: #FFFFFF;
        border: 2px dashed #CBD5E1;
        border-radius: 10px;
        padding: 40px 32px;
        text-align: center;
        max-width: 540px;
        width: 100%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      }
      .dropzone-icon {
        font-size: 44px;
        margin-bottom: 12px;
      }
      .dropzone-title {
        font-size: 18px;
        font-weight: 800;
        color: #0F172A;
        margin: 0 0 8px 0;
      }
      .dropzone-desc {
        font-size: 13px;
        color: #64748B;
        margin: 0 0 20px 0;
        line-height: 1.5;
      }
      .dropzone-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 20px;
      }
      .dropzone-btn.primary {
        padding: 10px 20px;
        background: #0284C7;
        color: #FFFFFF;
        border: 1px solid #0369A1;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .dropzone-btn.primary:hover {
        background: #0369A1;
      }
      .dropzone-btn.secondary {
        padding: 10px 16px;
        background: #FFFFFF;
        color: #1E293B;
        border: 1px solid #CBD5E1;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .dropzone-btn.secondary:hover {
        background: #F8FAFC;
        border-color: #94A3B8;
      }
      .dropzone-features {
        display: flex;
        justify-content: center;
        gap: 14px;
        font-size: 11px;
        color: #059669;
        font-weight: 600;
        flex-wrap: wrap;
      }
      .nuper-audit-viewport {
        flex: 1;
        position: relative;
        overflow: hidden;
        background: #F1F5F9;
        cursor: grab;
      }
      .nuper-audit-stage {
        position: absolute;
        top: 0;
        left: 0;
        width: 1200px;
        height: 640px;
        transform-origin: 0 0;
        user-select: none;
      }
      .audit-balloon-node {
        transition: transform 0.15s ease;
      }
      .audit-balloon-node:hover circle:first-child {
        stroke: #D97706;
        fill: rgba(217, 119, 6, 0.25);
      }
      .nuper-audit-footer {
        height: 44px;
        padding: 0 20px;
        background: #F8FAFC;
        border-top: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11.5px;
      }
      .nuper-audit-footer-left {
        color: #475569;
      }
      .nuper-audit-footer-right {
        display: flex;
        gap: 16px;
      }
      .audit-legend.pass {
        color: #059669;
        font-weight: 700;
      }
      .audit-legend.scale {
        color: #64748B;
        font-family: 'JetBrains Mono', monospace;
      }
      .clean-features-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #FFFFFF;
      }
      .clean-features-header {
        padding: 12px 14px;
        background: #F8FAFC;
        border-bottom: 1px solid #E2E8F0;
      }
      .clean-header-title {
        font-size: 11px;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: 0.5px;
      }
      .clean-header-badge {
        font-size: 10px;
        font-weight: 700;
        background: #E0F2FE;
        color: #0284C7;
        padding: 2px 8px;
        border-radius: 10px;
        font-family: 'JetBrains Mono', monospace;
      }
      .clean-header-sub {
        font-size: 10.5px;
        color: #64748B;
        margin-top: 2px;
      }
      .clean-empty-state-card {
        padding: 32px 16px;
        text-align: center;
        color: #64748B;
        font-size: 12px;
        line-height: 1.6;
      }
      .empty-state-icon {
        font-size: 32px;
        margin-bottom: 10px;
      }
      .empty-state-title {
        font-weight: 700;
        color: #0F172A;
        font-size: 13px;
        margin-bottom: 4px;
      }
      .empty-state-desc {
        color: #64748B;
        font-size: 11.5px;
        margin-bottom: 16px;
      }
      .btn-empty-drawing {
        padding: 8px 14px;
        font-size: 11.5px;
        font-weight: 600;
        background: #0284C7;
        color: #FFFFFF;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .btn-empty-drawing:hover {
        background: #0369A1;
      }
      .clean-features-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }
      .clean-feature-item {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 6px;
        padding: 8px 10px;
        margin-bottom: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .clean-feature-item:hover {
        background: #F0F9FF;
        border-color: #0284C7;
      }
      .clean-feature-item.active {
        background: #EFF6FF;
        border-color: #0284C7;
        box-shadow: 0 0 0 1px #0284C7;
      }
      .clean-feature-top {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }
      .clean-balloon-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 11px;
        background: #0284C7;
        color: #FFFFFF;
        font-weight: 800;
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        flex-shrink: 0;
      }
      .clean-balloon-badge.active {
        background: #D97706;
      }
      .clean-feature-name {
        font-size: 11.5px;
        font-weight: 700;
        color: #0F172A;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .clean-status-pill {
        font-size: 9px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .clean-status-pill.pass {
        background: #D1FAE5;
        color: #059669;
      }
      .clean-status-pill.warn {
        background: #FEF3C7;
        color: #B45309;
      }
      .clean-operation-pill {
        font-size: 8.5px;
        font-weight: 800;
        padding: 1px 5px;
        border-radius: 3px;
        font-family: 'JetBrains Mono', monospace;
        margin-right: 4px;
      }
      .clean-operation-pill.op10 {
        background: #E0F2FE;
        color: #0369A1;
      }
      .clean-operation-pill.op20 {
        background: #FEF3C7;
        color: #B45309;
      }
      .clean-cad-tag {
        color: #059669;
        font-weight: 700;
        font-size: 9.5px;
      }
      .clean-feature-bottom {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #64748B;
        font-family: 'JetBrains Mono', monospace;
      }
    `;
    document.head.appendChild(style);
  }

  public destroy(): void {
    if (typeof document !== 'undefined') {
      const modal = document.getElementById('modal-drawing-audit');
      if (modal) modal.remove();
      const style = document.getElementById('nuper-audit-light-styles');
      if (style) style.remove();
    }
  }
}
