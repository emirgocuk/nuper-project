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
import { FeatureDefinitionModal } from './FeatureDefinitionModal';
import {
  exceedsDragThreshold,
  screenDeltaToStage,
  applyLabelOffset,
  escapeHtmlText,
  type LabelOffset,
} from './BalloonEditing';
import {
  getFeatureTypeSvg,
  getFeatureTypeOptions,
  parseDatumReference,
  formatDatumReference,
} from './MetrologyIcons';
import * as THREE from 'three';
import { MeasurementPathGenerator, type PathFeatureInput } from '../../cad/utils/MeasurementPathGenerator';
import { SetupPrep, type SetupRecommendation } from '../../cad/utils/SetupPrep';
import { type CADViewer } from '../../cad/CADViewer';
import { type SimulationState } from '../../cad/SimulationController';
import { StepModelTessellator } from '../../cad/utils/StepModelTessellator';
import { applyStepModelToScene } from '../../cad/utils/CadImportManager';

export interface SetupWizardOptions {
  onConfirm?: (dimensions: InspectionDimension[]) => void;
}

export class SetupWizard {
  private knownDatums: string[] = ['A', 'B', 'C'];
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
  private pageImages: Map<number, { width: number; height: number; image_data: string }> = new Map();
  private confirmCallback?: (dimensions: InspectionDimension[]) => void;
  private appInstance: unknown = null;
  private currentCadMetadata: CadMetadata | null = null;
  private activeCadModelName: string | null = null;
  private matchResult: CadDrawingMatchResult | null = null;
  private currentActiveOperation: 'OP10' | 'OP20' = 'OP10';
  private simUnregister: (() => void) | null = null;
  private lastActiveFeatureId: number | null = null;

  private zoom: number = 1.0;
  private panX: number = 0;
  private panY: number = 0;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;

  private editingId: number | null = null;
  private isAddingInline: boolean = false;
  private pendingAddX: number = 0;
  private pendingAddY: number = 0;
  private pendingAddPage: number = 1;
  private balloonLabelOffsets: Map<number, LabelOffset> = new Map();

  private rightDragCandidateId: number | null = null;
  private rightDragStartX: number = 0;
  private rightDragStartY: number = 0;
  private rightDragMoved: boolean = false;
  private dragPreviewNode: SVGGElement | null = null;
  private dragPreviewDx: number = 0;
  private dragPreviewDy: number = 0;
  private activeMoveHandler: ((e: MouseEvent) => void) | null = null;
  private activeUpHandler: ((e: MouseEvent) => void) | null = null;
  private activeKeyHandler: ((e: KeyboardEvent) => void) | null = null;

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

  public getKnownDatums(): string[] {
    const set = new Set(this.knownDatums);
    for (const d of this.dimensions) {
      if (d.datum_reference) {
        for (const dat of parseDatumReference(d.datum_reference)) {
          set.add(dat);
        }
      }
    }
    return Array.from(set).sort();
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

  private setupRecommendation: SetupRecommendation | null = null;

  public isPlanConfirmed(): boolean {
    return this.isConfirmed;
  }

  public getSetupRecommendation(): SetupRecommendation | null {
    return this.setupRecommendation;
  }

  public setCadMetadata(cad: CadMetadata): void {
    this.currentCadMetadata = cad;
    if (cad.model_name) {
      this.activeCadModelName = cad.model_name;
    }
    if (cad.bbox) {
      this.setupRecommendation = SetupPrep.recommendPartSetup(cad.bbox, cad.features);
      this.updateSetupTelemetry();
    }
    if (typeof document !== 'undefined') {
      const modelBadge = document.getElementById('model-badge-name');
      if (modelBadge && cad.model_name) modelBadge.textContent = cad.model_name;

      const modelSize = document.getElementById('model-badge-size');
      if (modelSize && cad.bbox?.size) {
        modelSize.textContent = `Boyut: ${cad.bbox.size[0].toFixed(1)} x ${cad.bbox.size[1].toFixed(1)} x ${cad.bbox.size[2].toFixed(1)} mm`;
      }

      const hudStatus = document.getElementById('hud-status-pill');
      if (hudStatus) {
        hudStatus.textContent = 'HAZIR / OP10';
        hudStatus.style.setProperty('background', '#D1FAE5', 'important');
        hudStatus.style.setProperty('color', '#065F46', 'important');
      }

      const hudFeature = document.getElementById('hud-feature-name');
      if (hudFeature && cad.model_name) {
        hudFeature.textContent = `${cad.model_name} (B-Rep Doğrulandı)`;
      }
    }
    if (this.dimensions.length > 0) {
      this.recomputeCadMatch();
      this.renderDrawingAuditModal();
    }
  }

  private updateSetupTelemetry(): void {
    if (typeof document === 'undefined' || !this.setupRecommendation) return;
    const hudDetails = document.getElementById('hud-feature-details');
    if (hudDetails) {
      hudDetails.innerText = this.setupRecommendation.summaryMessage;
    }
    const win = window as unknown as { showToast?: (msg: string) => void };
    if (typeof win.showToast === 'function') {
      win.showToast(this.setupRecommendation.summaryMessage);
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
        target.cad_center = matchedDim.cad_center;
        target.cad_normal = matchedDim.cad_normal;
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

    const modelBadge = document.getElementById('model-badge-name');
    if (modelBadge) {
      modelBadge.textContent = this.currentCadMetadata?.model_name || 'Model: Yüklenmedi';
    }

    const hudStatus = document.getElementById('hud-status-pill');
    if (hudStatus) {
      hudStatus.textContent = this.currentCadMetadata ? 'HAZIR / OP10' : 'BEKLEMEDE';
    }

    const hudFeature = document.getElementById('hud-feature-name');
    if (hudFeature) {
      hudFeature.textContent = this.currentCadMetadata?.model_name
        ? `${this.currentCadMetadata.model_name} (B-Rep Doğrulandı)`
        : 'CAD / STEP Modeli Bekleniyor';
    }

    const modelSize = document.getElementById('model-badge-size');
    if (modelSize) {
      modelSize.textContent = this.currentCadMetadata?.bbox?.size
        ? `Boyut: ${this.currentCadMetadata.bbox.size[0].toFixed(1)} x ${this.currentCadMetadata.bbox.size[1].toFixed(1)} x ${this.currentCadMetadata.bbox.size[2].toFixed(1)} mm`
        : 'Boyut: -- x -- x -- mm';
    }

    const hudCoords = document.getElementById('hud-feature-coords');
    if (hudCoords) hudCoords.textContent = 'Orijin (PCS): --';

    const hudDetails = document.getElementById('hud-feature-details');
    if (hudDetails) {
      hudDetails.textContent = this.setupRecommendation?.summaryMessage || 'Lütfen STEP veya CAD dosyası seçin.';
    }

    const app = this.appInstance as { getDrawingCanvas?: () => { setBalloons: (b: unknown[]) => void } } | null;
    if (app && typeof app.getDrawingCanvas === 'function') {
      app.getDrawingCanvas()?.setBalloons([]);
    }

    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        isDualCanvas?: boolean;
        isSimulating?: boolean;
        blockGroup?: { visible: boolean };
        trajLine?: { visible: boolean };
        probeGroup?: { position: { set: (x: number, y: number, z: number) => void } };
        requestRender?: () => void;
      };

      win.isDualCanvas = false;
      win.isSimulating = false;
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
        }
        return;
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

    const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
      electronIpc?: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> };
    };

    if (win.electronIpc) {
      try {
        const fileRes = (await win.electronIpc.invoke('read-local-cad', 'GOBEK BAGI OLUGU_TR_AB.pdf')) as { dataBase64?: string } | null;
        if (fileRes && fileRes.dataBase64) {
          const binaryString = atob(fileRes.dataBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const doc = await parsePdfDrawing(bytes, 'GOBEK_BAGI_OLUGU_TR_AB.pdf');
          this.pdfDoc = doc.pdfDoc;
        }
      } catch {}
    }

    if (!this.pdfDoc && typeof fetch === 'function') {
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

  public async loadPdfData(data: Uint8Array | ArrayBuffer, fileName: string): Promise<void> {
    this.loadedFileName = fileName;
    this.hasLoadedDrawing = true;
    try {
      const extracted = await parsePdfDrawing(data, fileName);
      this.pdfDoc = extracted.pdfDoc;
      this.loadedImageUrl = null;
      this.totalPages = Math.max(1, extracted.pdfDoc?.numPages || extracted.result.page_count || 1);
      this.activePage = 1;
      this.renderDrawingAuditModal();
    } catch {
      this.pdfDoc = null;
    }
  }

  public async loadDrawingFile(file: File): Promise<void> {
    this.loadedFileName = file.name;
    this.hasLoadedDrawing = true;

    const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
      electronIpc?: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> };
      nuperApp?: { loadDrawingData: (data: unknown) => void };
    };

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      try {
        const buf = await file.arrayBuffer();
        const extractedLocal = await parsePdfDrawing(buf, file.name);
        this.pdfDoc = extractedLocal.pdfDoc;
        this.loadedImageUrl = null;
        this.totalPages = Math.max(1, extractedLocal.pdfDoc?.numPages || extractedLocal.result.page_count || 1);
        this.activePage = 1;

        if (win.electronIpc && (file as unknown as { path?: string }).path) {
          try {
            const filePath = (file as unknown as { path: string }).path;
            const aiExtracted = (await win.electronIpc.invoke('extract-drawing-data', filePath)) as {
              dimensions?: InspectionDimension[];
              page_count?: number;
              filename?: string;
            } | null;
            if (aiExtracted && aiExtracted.dimensions && aiExtracted.dimensions.length > 0) {
              this.setExtractedData(aiExtracted, file.name);
              if (win.nuperApp) {
                win.nuperApp.loadDrawingData(aiExtracted);
              }
              this.renderDrawingAuditModal();
              return;
            }
          } catch {}
        }

        this.setExtractedData(extractedLocal.result, file.name);
        if (win.nuperApp) {
          win.nuperApp.loadDrawingData(extractedLocal.result);
        }
        this.renderDrawingAuditModal();
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
      if (win.electronIpc && (file as unknown as { path?: string }).path) {
        try {
          const filePath = (file as unknown as { path: string }).path;
          const aiExtracted = (await win.electronIpc.invoke('extract-drawing-data', filePath)) as {
            dimensions?: InspectionDimension[];
            page_count?: number;
            filename?: string;
          } | null;
          if (aiExtracted && aiExtracted.dimensions && aiExtracted.dimensions.length > 0) {
            this.setExtractedData(aiExtracted, file.name);
            if (win.nuperApp) {
              win.nuperApp.loadDrawingData(aiExtracted);
            }
          }
        } catch {}
      }
      this.renderDrawingAuditModal();
      return;
    }
  }

  public setExtractedData(
    data: {
      page_count?: number;
      filename?: string;
      pages?: Array<{
        page?: number;
        width?: number;
        height?: number;
        image_data?: string;
        [k: string]: unknown;
      }>;
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
    if ((data as { datums?: string[] }).datums && Array.isArray((data as { datums?: string[] }).datums)) {
      for (const d of (data as { datums?: string[] }).datums || []) {
        if (d && typeof d === 'string') {
          const letter = d.trim().toUpperCase();
          if (/^[A-Z][0-9]?$/.test(letter) && !this.knownDatums.includes(letter)) {
            this.knownDatums.push(letter);
          }
        }
      }
    }

    if (data.pages && Array.isArray(data.pages)) {
      this.pageImages.clear();
      for (const p of data.pages) {
        if (p.page && p.image_data) {
          this.pageImages.set(p.page, {
            width: p.width || 1200,
            height: p.height || 840,
            image_data: p.image_data,
          });
        }
      }
      if (data.pages.length > 0) {
        this.totalPages = Math.max(this.totalPages, data.pages.length);
      }
    }

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
        measured: d.measured || '',
        deviation: d.deviation || '',
        status: (d.status as 'PASS' | 'WARN' | 'FAIL' | 'UNMEASURED') || 'UNMEASURED',
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
      if (this.dimensions[0].page) {
        this.activePage = this.dimensions[0].page;
      }
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
    if (!this.hasLoadedDrawing && this.dimensions.length === 0) {
      this.loadDrawingSample();
    }
    this.isConfirmed = true;
    this.closeDrawingAuditModal();
    this.applyActivePlanToWorkspace(this.dimensions);
    if (this.confirmCallback) {
      this.confirmCallback(this.dimensions);
    }

    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        workflowRibbon?: { advanceToStep: (step: number) => void; mount: (c: string) => void };
        open321Modal?: () => void;
      };
      if (win.workflowRibbon) {
        win.workflowRibbon.advanceToStep(4);
        win.workflowRibbon.mount('.app-ribbon');
      }
      if (typeof win.open321Modal === 'function') {
        setTimeout(() => {
          win.open321Modal?.();
        }, 200);
      }
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
          </div>

          <div class="nuper-audit-zoom-controls">
            <button class="audit-tool-btn" id="btn-audit-zoom-out" title="Uzaklaştır">🔍 −</button>
            <span class="audit-zoom-readout" id="audit-zoom-level">${Math.round(this.zoom * 100)}% (${this.zoom.toFixed(1)}x)</span>
            <button class="audit-tool-btn" id="btn-audit-zoom-in" title="Yakınlaştır">🔍 +</button>
            <button class="audit-tool-btn reset" id="btn-audit-zoom-reset" title="Sıfırla">⟲ 100% Sıfırla</button>
          </div>

          <div class="nuper-audit-tip">
            <span>🖱️ Tekerlek: <b>Zoom</b> | Sol tık sürükle: <b>Pan</b> | Sağ tık sürükle: <b>Balonu Taşı</b> | Çift tık: <b>Unsuru Düzenle</b> | Seç + <b>Del</b>: Sil</span>
          </div>
        </div>

        <div class="nuper-audit-body-container">
          <div class="nuper-audit-pages-sidebar">
            ${this.renderAuditSidebar()}
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

    const pageImg = this.pageImages.get(page);
    if (pageImg) {
      return `
        <div class="audit-img-render-wrap" style="position: relative; display: inline-block;">
          <img src="${pageImg.image_data}" style="display: block; width: ${pageImg.width}px; max-width: 100%; height: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.12); border-radius: 4px; background: #FFFFFF;" />
          <svg id="audit-balloon-overlay" viewBox="0 0 ${pageImg.width} ${pageImg.height}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto;">
            ${balloonNodes}
          </svg>
        </div>
      `;
    }

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
            <span class="thumb-page-sub">${balloonCount > 0 ? `${balloonCount} Ölçü Balonlandı` : 'Genel Notlar & 3D Model'}</span>
          </div>
        </div>
      `);
    }
    return items.join('');
  }

  private renderAuditSidebar(): string {
    if (this.isAddingInline) {
      return this.renderInlineEditor(null);
    }
    if (this.editingId !== null) {
      const dim = this.dimensions.find((d) => d.id === this.editingId);
      if (dim) {
        return this.renderInlineEditor(dim);
      }
      this.editingId = null;
    }
    return `
      <div class="audit-pages-sidebar-header">
        <span class="sidebar-header-title">SAYFALAR</span>
        <span class="sidebar-header-badge">${this.totalPages} Sayfa</span>
      </div>
      <div class="audit-pages-sidebar-list">
        ${this.renderPageThumbnails()}
      </div>
    `;
  }

  private resolveFeatureMeta(type: string): { label: string; icon: string } {
    const map: Record<string, { label: string; icon: string }> = {
      DIAMETER: { label: 'Silindirik Çap / Delik', icon: '⭕' },
      LINEAR: { label: 'Doğrusal Ölçü', icon: '📏' },
      RADIUS: { label: 'Kavis / Yarıçap (Fillet)', icon: '📐' },
      ANGLE: { label: 'Açı / Koniklik', icon: '📐' },
      CHAMFER: { label: 'Pah Kırma', icon: '✂️' },
      THREAD: { label: 'Vida / Diş', icon: '🔩' },
      POSITION: { label: 'Konum / GD&T', icon: '🎯' },
    };
    return map[type] || map.LINEAR;
  }

  private nextFeatureId(): number {
    const ids = this.dimensions.map((d) => d.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  private renderInlineEditor(dim: InspectionDimension | null): string {
    const isEdit = !!dim;
    const id = dim ? dim.id : this.nextFeatureId();
    const balloon = dim ? dim.balloon : `#${id}`;
    const type = dim?.type || 'DIAMETER';
    const callout = dim?.nominal_str || '';
    const nominal = dim?.nominal ?? 0;
    const upper = dim?.upper_tol || '';
    const lower = dim?.lower_tol || '';
    const datum = dim?.datum_reference || '[A]';
    const desc = dim?.type_label || '';
    const page = dim?.page || this.pendingAddPage;

    const knownDatums = this.getKnownDatums();
    const activeDatums = new Set(parseDatumReference(datum));
    const typeOptions = getFeatureTypeOptions();
    const currentSvg = getFeatureTypeSvg(type);

    const datumChipsHtml = knownDatums
      .map(
        (d) =>
          `<button type="button" class="datum-chip ${activeDatums.has(d) ? 'active' : ''}" data-datum="${escapeHtmlText(d)}">${escapeHtmlText(d)}</button>`
      )
      .join('');

    return `
      <div class="audit-pages-sidebar-header audit-inline-header">
        <button type="button" class="audit-inline-back" id="btn-inline-back" title="Sayfalar listesine dön">← Sayfalar</button>
        <span class="sidebar-header-badge">${escapeHtmlText(balloon)}</span>
      </div>
      <form class="audit-inline-editor" id="audit-inline-form" data-mode="${isEdit ? 'edit' : 'add'}" data-feature-id="${id}" data-page="${page}">
        <div class="audit-inline-editor-title">
          ${isEdit ? 'UNSUR DÜZENLE' : 'YENİ UNSUR'}
          <span class="audit-inline-editor-sub">Sayfa ${page} • Işık masası üzerinde canlı düzenleme</span>
        </div>

        <div class="audit-inline-section">
          <label class="audit-inline-label">Unsur Tipi</label>
          <div class="audit-type-select-wrapper">
            <span class="audit-type-icon-preview" id="audit-type-icon-preview">
              ${currentSvg}
            </span>
            <select id="audit-inline-type" class="audit-inline-field audit-type-select">
              ${typeOptions
                .map((opt) => `<option value="${opt.value}" ${opt.value === type ? 'selected' : ''}>${opt.label}</option>`)
                .join('')}
            </select>
          </div>
        </div>

        <div class="audit-inline-section">
          <label class="audit-inline-label">Teknik Resim İfadesi (Callout)</label>
          <input type="text" id="audit-inline-callout" class="audit-inline-field" value="${escapeHtmlText(callout)}" placeholder="örn: Ø86 ±0.5, 3 x45°, R3" />
          <div class="audit-inline-symbols">
            ${['Ø', '±', '°', 'R', 'x45°']
              .map((sym) => `<button type="button" class="audit-inline-symbol" data-symbol="${sym}">${sym}</button>`)
              .join('')}
          </div>
        </div>

        <div class="audit-inline-section">
          <label class="audit-inline-label">Nominal Değer (mm)</label>
          <input type="number" step="any" id="audit-inline-nominal" class="audit-inline-field audit-field-stacked" value="${nominal}" placeholder="0.000" />
        </div>

        <div class="audit-inline-section">
          <label class="audit-inline-label">Üst Tolerans (+mm)</label>
          <input type="text" id="audit-inline-upper" class="audit-inline-field audit-field-stacked" value="${escapeHtmlText(upper)}" placeholder="+0.100" />
        </div>

        <div class="audit-inline-section">
          <label class="audit-inline-label">Alt Tolerans (-mm)</label>
          <input type="text" id="audit-inline-lower" class="audit-inline-field audit-field-stacked" value="${escapeHtmlText(lower)}" placeholder="-0.100" />
        </div>

        <div class="audit-inline-section">
          <label class="audit-inline-label">Datum Referansı</label>
          <div class="audit-datum-container">
            <div class="audit-inline-datum-chips" id="audit-inline-datum-chips">
              ${datumChipsHtml}
            </div>
            <button type="button" class="datum-chip-add" id="btn-inline-add-datum" title="Yeni Datum Harfi Ekle">+ Harf</button>
          </div>
          <input type="hidden" id="audit-inline-datum" value="${escapeHtmlText(datum)}" />
        </div>

        <div class="audit-inline-section">
          <label class="audit-inline-label">Açıklama / Unsur Adı</label>
          <input type="text" id="audit-inline-desc" class="audit-inline-field audit-field-stacked" value="${escapeHtmlText(desc)}" placeholder="örn: Toplam Boy / Genişlik" />
        </div>

        <div class="audit-inline-actions">
          <button type="submit" class="audit-inline-save" id="btn-inline-save">✓ Kaydet</button>
          <button type="button" class="audit-inline-cancel" id="btn-inline-cancel">Vazgeç</button>
          ${isEdit ? '<button type="button" class="audit-inline-delete" id="btn-inline-delete">🗑️ Sil</button>' : ''}
        </div>
      </form>
    `;
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
    if (page === 1) {
      sheetContent = `
        <g stroke="#CBD5E1" stroke-width="1.5">
          <rect x="40" y="30" width="1120" height="580" fill="#FFFFFF" rx="4"/>
        </g>
        <line x1="60" y1="320" x2="1140" y2="320" stroke="#0284C7" stroke-width="0.8" stroke-dasharray="10 5 2 5" opacity="0.3"/>
        <line x1="600" y1="40" x2="600" y2="600" stroke="#0284C7" stroke-width="0.8" stroke-dasharray="10 5 2 5" opacity="0.3"/>
        <text x="600" y="300" text-anchor="middle" fill="#64748B" font-size="16" font-weight="700" font-family="'JetBrains Mono', monospace">
          📄 ${this.loadedFileName || 'TEKNİK RESİM PAFTASI'} — PAFTA 1 / ${this.totalPages}
        </text>
        <text x="600" y="335" text-anchor="middle" fill="#059669" font-size="12" font-weight="700" font-family="'JetBrains Mono', monospace">
          DATUM [A] TABAN TEMAS DÜZLEMİ
        </text>
      `;
    } else if (page === 2) {
      sheetContent = `
        <g stroke="#CBD5E1" stroke-width="1.5">
          <rect x="40" y="30" width="1120" height="580" fill="#FFFFFF" rx="4"/>
        </g>
        <line x1="60" y1="320" x2="1140" y2="320" stroke="#0284C7" stroke-width="0.8" stroke-dasharray="10 5 2 5" opacity="0.3"/>
        <line x1="600" y1="40" x2="600" y2="600" stroke="#0284C7" stroke-width="0.8" stroke-dasharray="10 5 2 5" opacity="0.3"/>
        <text x="600" y="300" text-anchor="middle" fill="#64748B" font-size="16" font-weight="700" font-family="'JetBrains Mono', monospace">
          📄 ${this.loadedFileName || 'TEKNİK RESİM PAFTASI'} — PAFTA 2 / ${this.totalPages}
        </text>
        <text x="600" y="335" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="700" font-family="'JetBrains Mono', monospace">
          395.5 ±0.800 mm
        </text>
      `;
    } else {
      sheetContent = `
        <g stroke="#CBD5E1" stroke-width="1.5">
          <rect x="40" y="30" width="1120" height="580" fill="#FFFFFF" rx="4"/>
        </g>
        <line x1="60" y1="320" x2="1140" y2="320" stroke="#0284C7" stroke-width="0.8" stroke-dasharray="10 5 2 5" opacity="0.3"/>
        <line x1="600" y1="40" x2="600" y2="600" stroke="#0284C7" stroke-width="0.8" stroke-dasharray="10 5 2 5" opacity="0.3"/>
        <text x="600" y="290" text-anchor="middle" fill="#64748B" font-size="16" font-weight="700" font-family="'JetBrains Mono', monospace">
          📄 ${this.loadedFileName || 'TEKNİK RESİM PAFTASI'} — PAFTA ${page} / ${this.totalPages}
        </text>
        <text x="600" y="325" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="700" font-family="'JetBrains Mono', monospace">
          DETAY M
        </text>
        <text x="600" y="350" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="700" font-family="'JetBrains Mono', monospace">
          KESIT G-G
        </text>
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
    uploadBtn?.addEventListener('click', () => {
      void this.handleTeknikResimClick();
    });

    const dropzoneSelectBtn = modalEl.querySelector('#btn-dropzone-select');
    dropzoneSelectBtn?.addEventListener('click', () => {
      void this.handleTeknikResimClick();
    });

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
        if (e.button === 0) {
          this.isDragging = true;
          this.dragStartX = e.clientX - this.panX;
          this.dragStartY = e.clientY - this.panY;
          viewport.style.cursor = 'grabbing';
          return;
        }
        if (e.button === 2) {
          const hit = this.pickBalloonAt(e.clientX, e.clientY, viewport);
          this.rightDragCandidateId = hit ? hit.id : null;
          this.rightDragStartX = e.clientX;
          this.rightDragStartY = e.clientY;
          this.rightDragMoved = false;
          this.dragPreviewDx = 0;
          this.dragPreviewDy = 0;
          this.dragPreviewNode = hit ? this.findBalloonNode(modalEl, hit.id) : null;
          if (hit) this.selectedId = hit.id;
        }
      });

      const onMouseMove = (e: MouseEvent) => {
        if (this.isDragging) {
          this.setPan(e.clientX - this.dragStartX, e.clientY - this.dragStartY);
          return;
        }
        if (this.rightDragCandidateId === null) return;

        if (
          !this.rightDragMoved &&
          exceedsDragThreshold(this.rightDragStartX, this.rightDragStartY, e.clientX, e.clientY)
        ) {
          this.rightDragMoved = true;
          if (this.dragPreviewNode) {
            this.dragPreviewNode.style.transition = 'none';
            viewport.style.cursor = 'grabbing';
          }
        }

        if (this.rightDragMoved) {
          this.dragPreviewDx = e.clientX - this.rightDragStartX;
          this.dragPreviewDy = e.clientY - this.rightDragStartY;
          if (this.dragPreviewNode) {
            const stageX = this.dragPreviewDx / this.zoom;
            const stageY = this.dragPreviewDy / this.zoom;
            this.dragPreviewNode.style.transform = `translate(${stageX}px, ${stageY}px)`;
          }
        }
      };

      const onMouseUp = (e: MouseEvent) => {
        if (this.isDragging && e.button === 0) {
          this.isDragging = false;
          viewport.style.cursor = 'grab';
        }
        if (e.button === 2) {
          this.finishBalloonPointer(e.clientX, e.clientY, viewport);
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Delete') return;
        if (!this.isAuditOpen || this.selectedId === null) return;
        const target = e.target as HTMLElement | null;
        if (target && typeof target.closest === 'function' && target.closest('input, textarea, select, [contenteditable="true"]')) {
          return;
        }
        e.preventDefault();
        this.removeFeature(this.selectedId);
      };

      if (typeof window !== 'undefined') {
        if (this.activeMoveHandler) window.removeEventListener('mousemove', this.activeMoveHandler);
        if (this.activeUpHandler) window.removeEventListener('mouseup', this.activeUpHandler);
        if (this.activeKeyHandler) window.removeEventListener('keydown', this.activeKeyHandler);
        this.activeMoveHandler = onMouseMove;
        this.activeUpHandler = onMouseUp;
        this.activeKeyHandler = onKeyDown;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('keydown', onKeyDown);
      }

      viewport.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
      });

      const addFeatureBtn = modalEl.querySelector('#btn-audit-add-feature');
      addFeatureBtn?.addEventListener('click', () => {
        this.promptAddFeature(500, 350, this.activePage);
      });
    }

    this.attachInlineEditorEvents(modalEl);

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
          this.startInlineEdit(parseInt(idAttr, 10));
        }
      });
    });
  }

  private findBalloonNode(modalEl: HTMLElement, id: number): SVGGElement | null {
    const nodes = modalEl.querySelectorAll<SVGGElement>('.audit-balloon-node');
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute('data-balloon-id') === String(id)) {
        return nodes[i];
      }
    }
    return null;
  }

  private pickBalloonAt(clientX: number, clientY: number, viewport: HTMLElement): InspectionDimension | null {
    const stage = (typeof document !== 'undefined' ? document.getElementById('audit-canvas-stage') : null) as HTMLElement | null;
    const rect = (stage || viewport).getBoundingClientRect?.() || { left: 0, top: 0 };
    const canvasX = (clientX - rect.left) / this.zoom;
    const canvasY = (clientY - rect.top) / this.zoom;
    return this.findBalloonNear(canvasX, canvasY, this.activePage, 35);
  }

  private finishBalloonPointer(clientX: number, clientY: number, viewport: HTMLElement): void {
    const candidateId = this.rightDragCandidateId;
    const moved = this.rightDragMoved;
    const dx = this.dragPreviewDx;
    const dy = this.dragPreviewDy;
    const preview = this.dragPreviewNode;

    this.rightDragCandidateId = null;
    this.rightDragMoved = false;
    this.dragPreviewDx = 0;
    this.dragPreviewDy = 0;
    this.dragPreviewNode = null;

    if (preview) {
      preview.style.transform = '';
      preview.style.transition = '';
    }
    viewport.style.cursor = 'grab';

    if (candidateId !== null && moved) {
      const stageDelta = screenDeltaToStage(dx, dy, this.zoom);
      const current = this.balloonLabelOffsets.get(candidateId);
      this.balloonLabelOffsets.set(candidateId, applyLabelOffset(current, stageDelta));
      this.selectedId = candidateId;
      this.renderDrawingAuditModal();
      this.syncBalloonsToCanvas();
      return;
    }

    this.showBalloonContextMenu(clientX, clientY, viewport, candidateId);
  }

  private showBalloonContextMenu(clientX: number, clientY: number, viewport: HTMLElement, candidateId: number | null): void {
    const stage = (typeof document !== 'undefined' ? document.getElementById('audit-canvas-stage') : null) as HTMLElement | null;
    const rect = (stage || viewport).getBoundingClientRect?.() || { left: 0, top: 0 };
    const canvasX = Math.round((clientX - rect.left) / this.zoom);
    const canvasY = Math.round((clientY - rect.top) / this.zoom);
    const hitDim = candidateId !== null
      ? this.dimensions.find((d) => d.id === candidateId) || null
      : this.findBalloonNear(canvasX, canvasY, this.activePage, 35);

    FeatureDefinitionModal.getInstance().showContextMenu({
      clientX,
      clientY,
      canvasX,
      canvasY,
      page: this.activePage,
      existingItem: hitDim ? { id: hitDim.id, balloon: hitDim.balloon, nominal_str: hitDim.nominal_str } : null,
      onAdd: (coords) => this.promptAddFeature(coords.x, coords.y, coords.page),
      onEdit: (id) => this.promptEditFeature(id),
      onDelete: (id) => this.removeFeature(id),
    });
  }

  private attachInlineEditorEvents(modalEl: HTMLElement): void {
    const form = modalEl.querySelector<HTMLFormElement>('#audit-inline-form');
    if (!form) return;

    const backBtn = modalEl.querySelector('#btn-inline-back');
    backBtn?.addEventListener('click', () => this.closeInlineEditor());

    const cancelBtn = modalEl.querySelector('#btn-inline-cancel');
    cancelBtn?.addEventListener('click', () => this.closeInlineEditor());

    const deleteBtn = modalEl.querySelector('#btn-inline-delete');
    deleteBtn?.addEventListener('click', () => {
      const idAttr = form.getAttribute('data-feature-id');
      if (idAttr) {
        this.removeFeature(parseInt(idAttr, 10));
      }
      this.closeInlineEditor();
    });

    const calloutInput = modalEl.querySelector<HTMLInputElement>('#audit-inline-callout');
    const typeSelect = modalEl.querySelector<HTMLSelectElement>('#audit-inline-type');
    const nominalInput = modalEl.querySelector<HTMLInputElement>('#audit-inline-nominal');
    const upperInput = modalEl.querySelector<HTMLInputElement>('#audit-inline-upper');
    const lowerInput = modalEl.querySelector<HTMLInputElement>('#audit-inline-lower');

    modalEl.querySelectorAll<HTMLButtonElement>('.audit-inline-symbol').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!calloutInput) return;
        const sym = btn.getAttribute('data-symbol') || '';
        const start = calloutInput.selectionStart ?? calloutInput.value.length;
        const end = calloutInput.selectionEnd ?? start;
        calloutInput.value = calloutInput.value.slice(0, start) + sym + calloutInput.value.slice(end);
        this.syncInlineCallout(calloutInput, typeSelect, nominalInput, upperInput, lowerInput);
      });
    });

    calloutInput?.addEventListener('input', () => {
      this.syncInlineCallout(calloutInput, typeSelect, nominalInput, upperInput, lowerInput);
    });

    const datumHiddenInput = modalEl.querySelector<HTMLInputElement>('#audit-inline-datum');
    const datumChipsContainer = modalEl.querySelector<HTMLElement>('#audit-inline-datum-chips');
    const updateDatumFromChips = () => {
      if (!datumHiddenInput || !datumChipsContainer) return;
      const activeChips = Array.from(datumChipsContainer.querySelectorAll<HTMLButtonElement>('.datum-chip.active'));
      const activeLetters = activeChips.map((c) => c.getAttribute('data-datum') || '').filter(Boolean);
      datumHiddenInput.value = formatDatumReference(activeLetters);
    };

    datumChipsContainer?.querySelectorAll<HTMLButtonElement>('.datum-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        updateDatumFromChips();
      });
    });

    const addDatumBtn = modalEl.querySelector<HTMLButtonElement>('#btn-inline-add-datum');
    addDatumBtn?.addEventListener('click', () => {
      const letter = (typeof window !== 'undefined' && window.prompt ? window.prompt('Eklenecek Datum Harfi (örn: D, E):', '') : 'D')?.trim().toUpperCase();
      if (letter && /^[A-Z][0-9]?$/.test(letter)) {
        if (!this.knownDatums.includes(letter)) {
          this.knownDatums.push(letter);
        }
        if (datumChipsContainer) {
          const newChip = document.createElement('button');
          newChip.type = 'button';
          newChip.className = 'datum-chip active';
          newChip.setAttribute('data-datum', letter);
          newChip.textContent = letter;
          newChip.addEventListener('click', () => {
            newChip.classList.toggle('active');
            updateDatumFromChips();
          });
          datumChipsContainer.appendChild(newChip);
          updateDatumFromChips();
        }
      }
    });

    const iconPreview = modalEl.querySelector<HTMLElement>('#audit-type-icon-preview');
    typeSelect?.addEventListener('change', () => {
      if (iconPreview && typeSelect) {
        iconPreview.innerHTML = getFeatureTypeSvg(typeSelect.value);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveInlineEditor(form, calloutInput, typeSelect, nominalInput, upperInput, lowerInput, modalEl);
    });
  }

  private syncInlineCallout(
    calloutInput: HTMLInputElement,
    typeSelect: HTMLSelectElement | null,
    nominalInput: HTMLInputElement | null,
    upperInput: HTMLInputElement | null,
    lowerInput: HTMLInputElement | null
  ): void {
    const parsed = FeatureDefinitionModal.getInstance().parseCallout(calloutInput.value);
    if (typeSelect && parsed.type) typeSelect.value = parsed.type;
    if (nominalInput && parsed.nominal !== undefined && !isNaN(parsed.nominal)) {
      nominalInput.value = String(parsed.nominal);
    }
    if (upperInput && parsed.upper_tol !== undefined) upperInput.value = parsed.upper_tol;
    if (lowerInput && parsed.lower_tol !== undefined) lowerInput.value = parsed.lower_tol;
  }

  private saveInlineEditor(
    form: HTMLFormElement,
    calloutInput: HTMLInputElement | null,
    typeSelect: HTMLSelectElement | null,
    nominalInput: HTMLInputElement | null,
    upperInput: HTMLInputElement | null,
    lowerInput: HTMLInputElement | null,
    modalEl: HTMLElement
  ): void {
    const mode = form.getAttribute('data-mode');
    const idAttr = form.getAttribute('data-feature-id');
    const id = idAttr ? parseInt(idAttr, 10) : this.nextFeatureId();
    const callout = calloutInput?.value.trim() || '';
    const inferred = FeatureDefinitionModal.getInstance().parseCallout(callout);
    let type = typeSelect?.value || inferred.type || 'LINEAR';
    if ((!typeSelect || typeSelect.value === 'LINEAR') && inferred.type) {
      type = inferred.type;
    }
    const meta = this.resolveFeatureMeta(type);
    const parsedNominal = parseFloat(nominalInput?.value || '0');
    const nominal = isNaN(parsedNominal) ? 0 : parsedNominal;
    const upper = upperInput?.value.trim() || inferred.upper_tol || '';
    const lower = lowerInput?.value.trim() || inferred.lower_tol || '';
    const datum = (modalEl.querySelector<HTMLInputElement>('#audit-inline-datum')?.value || '').trim();
    const desc = (modalEl.querySelector<HTMLInputElement>('#audit-inline-desc')?.value || '').trim();
    const typeLabel = desc || meta.label;

    if (mode === 'edit') {
      const dim = this.dimensions.find((d) => d.id === id);
      if (dim) {
        dim.type = type;
        dim.type_label = typeLabel;
        dim.icon = meta.icon;
        dim.nominal = nominal;
        dim.nominal_str = callout;
        dim.upper_tol = upper;
        dim.lower_tol = lower;
        dim.datum_reference = datum;
        this.updateBalloonMeta(dim);
      }
    } else {
      const page = parseInt(form.getAttribute('data-page') || String(this.pendingAddPage), 10);
      const storedBbox: [number, number, number, number] = this.pdfDoc
        ? [
            Math.round(this.pendingAddX / 1.25),
            Math.round(this.pendingAddY / 1.25),
            Math.round(this.pendingAddX / 1.25) + 40,
            Math.round(this.pendingAddY / 1.25) + 20,
          ]
        : [this.pendingAddX, this.pendingAddY, this.pendingAddX + 40, this.pendingAddY + 20];

      const newDim: InspectionDimension = {
        id,
        balloon: `#${id}`,
        page,
        type,
        type_label: typeLabel,
        icon: meta.icon,
        nominal,
        nominal_str: callout,
        upper_tol: upper,
        lower_tol: lower,
        measured: '',
        deviation: '',
        status: 'UNMEASURED',
        feature_key: `feat_${id}_${nominal}`.replace(/[^a-zA-Z0-9_]/g, '_'),
        datum_reference: datum,
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
      this.selectedId = id;
      this.activePage = page;
    }

    this.editingId = null;
    this.isAddingInline = false;
    this.renderDrawingAuditModal();
    this.syncBalloonsToCanvas();
  }

  private updateBalloonMeta(dim: InspectionDimension): void {
    const balloon = this.balloons.find((b) => b.id === dim.id);
    if (!balloon) return;
    balloon.nominal = dim.nominal;
    balloon.tolerance = `${dim.lower_tol}/${dim.upper_tol}`;
    balloon.feature_label = dim.nominal_str;
  }

  private syncBalloonsToCanvas(): void {
    const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
      nuperApp?: { getDrawingCanvas: () => { setBalloons: (b: unknown[]) => void } };
    };
    if (win.nuperApp) {
      win.nuperApp.getDrawingCanvas().setBalloons(this.balloons);
    }
  }

  public getBalloonStageCoords(d: InspectionDimension): { cx: number; cy: number } {
    const base = this.getBalloonBaseCoords(d);
    const offset = this.balloonLabelOffsets.get(d.id);
    if (!offset) return base;
    return { cx: Math.round(base.cx + offset.dx), cy: Math.round(base.cy + offset.dy) };
  }

  private getBalloonBaseCoords(d: InspectionDimension): { cx: number; cy: number } {
    const page = d.page || 1;
    const pageImg = this.pageImages.get(page);

    if (d.bbox && d.bbox.length >= 2) {
      let x = d.bbox[0];
      let y = d.bbox[1];
      if (pageImg) {
        if (x > pageImg.width && pageImg.width > 0) {
          const ratio = x / pageImg.width;
          if (ratio > 1.3) {
            x = (x / 2481) * pageImg.width;
            y = (y / 1754) * pageImg.height;
          }
        }
        if (x <= 1200 && pageImg.width > 1200) {
          const scaleX = pageImg.width / 1190.55;
          const scaleY = pageImg.height / 841.89;
          return { cx: Math.round(x * scaleX), cy: Math.round(y * scaleY) };
        }
        const cx = Math.max(25, Math.min(pageImg.width - 25, Math.round(x)));
        const cy = Math.max(25, Math.min(pageImg.height - 25, Math.round(y)));
        return { cx, cy };
      }
      if (this.pdfDoc) {
        return { cx: Math.round(x * 1.25), cy: Math.round(y * 1.25) };
      }
      return { cx: Math.round(x), cy: Math.round(y) };
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
    const pageDims = this.dimensions.filter((item) => (item.page || 1) === (d.page || 1));
    const localIdx = Math.max(1, pageDims.indexOf(d) + 1);
    const coordsMap = (d.page || 1) === 2 ? coordsMapP2 : coordsMapP3;
    const pt =
      coordsMap[d.id] ||
      coordsMap[localIdx] ||
      coordsMap[localIdx + 6] || {
        cx: 250 + ((localIdx * 130) % 650),
        cy: 180 + Math.floor(localIdx / 5) * 130,
      };
    if (pageImg && pageImg.width > 1200) {
      const scaleX = pageImg.width / 1200;
      const scaleY = pageImg.height / 640;
      return { cx: Math.round(pt.cx * scaleX), cy: Math.round(pt.cy * scaleY) };
    }
    return pt;
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
    this.startInlineAdd(canvasX, canvasY, page);
  }

  public promptEditFeature(id: number): void {
    this.startInlineEdit(id);
  }

  public startInlineEdit(id: number): void {
    const dim = this.dimensions.find((d) => d.id === id);
    if (!dim) return;
    this.selectedId = id;
    if (dim.page && dim.page !== this.activePage) {
      this.activePage = dim.page;
    }
    this.isAddingInline = false;
    this.editingId = id;
    this.renderDrawingAuditModal();
  }

  private startInlineAdd(canvasX: number, canvasY: number, page: number): void {
    this.pendingAddX = canvasX;
    this.pendingAddY = canvasY;
    this.pendingAddPage = page;
    this.editingId = null;
    this.isAddingInline = true;
    this.renderDrawingAuditModal();
  }

  public closeInlineEditor(): void {
    this.editingId = null;
    this.isAddingInline = false;
    this.renderDrawingAuditModal();
  }

  public removeFeature(id: number): void {
    this.dimensions = this.dimensions.filter((d) => d.id !== id);
    this.balloons = this.balloons.filter((b) => b.id !== id);
    this.balloonLabelOffsets.delete(id);
    if (this.editingId === id) this.editingId = null;
    if (this.selectedId === id) {
      this.selectedId = this.dimensions.length > 0 ? this.dimensions[0].id : null;
    }
    this.renderDrawingAuditModal();
    this.syncBalloonsToCanvas();
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

    const bbox = (this.currentCadMetadata?.bbox?.min && this.currentCadMetadata?.bbox?.max)
      ? { min: this.currentCadMetadata.bbox.min, max: this.currentCadMetadata.bbox.max }
      : { min: [0, 0, 0] as [number, number, number], max: [120, 60, 45] as [number, number, number] };

    const pathFeatures: PathFeatureInput[] = dims.map((d) => {
      const coords = d.cad_center
        ? { x: d.cad_center[0], y: d.cad_center[1], z: d.cad_center[2] }
        : InspectionSynchronizer.getFeatureCoordinates(d.id);
      return {
        id: d.id,
        balloon: d.balloon,
        type: d.type,
        type_label: d.type_label,
        nominal: typeof d.nominal === 'number' ? d.nominal : parseFloat(String(d.nominal)) || 10,
        cad_center: [coords.x, coords.y, coords.z],
        cad_normal: d.cad_normal || [0, 0, 1],
        operation: (d.operation as 'OP10' | 'OP20') || 'OP10',
      };
    });

    const activeOp = this.currentActiveOperation;
    const plan = MeasurementPathGenerator.generatePlan(pathFeatures, bbox, {
      activeOperation: activeOp,
      verticalAxis: 'Y',
      clearanceZMarginMm: 15.0,
    });

    const app = this.appInstance as { getCADViewer?: () => CADViewer } | null;
    if (app && typeof app.getCADViewer === 'function') {
      const cadViewer = app.getCADViewer();
      cadViewer?.renderTrajectory(plan);
      const simCtrl = cadViewer?.getSimulationController();
      if (simCtrl) {
        simCtrl.setWaypoints(plan.allWaypoints);
        simCtrl.setSpeedMultiplier(1.0);
        if (this.simUnregister) {
          this.simUnregister();
        }
        this.simUnregister = simCtrl.onUpdate((state) => {
          this.handleSimulationStateChange(state);
        });
      }
    }

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
      timeDisplay.innerText = '00:00 / 00:34';
    }

    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        isDualCanvas?: boolean;
        blockGroup?: THREE.Group & { visible: boolean };
        uploadedMeshGroup?: THREE.Group | null;
        currentUploadedCad?: { name?: string };
        trajLine?: { visible: boolean; geometry?: { dispose?: () => void } };
        touchPointMeshes?: Array<unknown>;
        trajectoryPoints?: Array<unknown>;
        probeGroup?: { position: { set: (x: number, y: number, z: number) => void } };
        scene?: THREE.Scene;
        requestRender?: () => void;
        eval?: (code: string) => unknown;
        dispatchEvent?: (e: Event) => boolean;
        nuperApp?: { getCADViewer: () => { getSimulationController: () => { setWaypoints: (w: unknown[]) => void; bindProbeObject: (o: unknown, v: unknown) => void; reset: () => void; onUpdate: (fn: (state: SimulationState) => void) => () => void } } };
      };

      win.isDualCanvas = false;

      const cadName = win.currentUploadedCad?.name ||
        this.activeCadModelName ||
        this.currentCadMetadata?.model_name ||
        (this.loadedFileName && StepModelTessellator.isDcModulPlaka(this.loadedFileName) ? this.loadedFileName : '') ||
        (this.loadedFileName ? this.loadedFileName : 'active_part.stp');

      applyStepModelToScene(cadName);

      if (win.blockGroup) {
        win.blockGroup.visible = true;
      }
      if (win.uploadedMeshGroup) {
        win.uploadedMeshGroup.visible = true;
      }

      if (win.nuperApp) {
        try {
          const simCtrl = win.nuperApp.getCADViewer().getSimulationController();
          if (this.simUnregister) {
            this.simUnregister();
          }
          this.simUnregister = simCtrl.onUpdate((state) => {
            this.handleSimulationStateChange(state);
          });
        } catch {}
      }

      if (typeof win.eval === 'function') {
        try {
          win.eval(`
            if (typeof uploadedMeshGroup !== 'undefined') {
              uploadedMeshGroup = window.uploadedMeshGroup;
            }
            if (typeof blockGroup !== 'undefined' && blockGroup) {
              blockGroup.visible = true;
            }
            if (typeof camera !== 'undefined') window.camera = camera;
            if (typeof controls !== 'undefined') window.controls = controls;
            if (typeof renderer !== 'undefined') window.renderer = renderer;
            if (typeof requestRender === 'function') {
              window.requestRender = requestRender;
              requestRender();
            }
            if (typeof focusPart === 'function') {
              window.focusPart = focusPart;
              focusPart();
            }
          `);
        } catch {}
      }

      const toggleBtn = document.getElementById('btn-toggle-path');
      if (toggleBtn) {
        toggleBtn.classList.add('active');
        toggleBtn.innerText = 'Prob Yolunu Gizle';
      }

      if (typeof win.dispatchEvent === 'function') {
        try {
          win.dispatchEvent(new Event('resize'));
        } catch {}
      }
      if (typeof win.requestRender === 'function') {
        win.requestRender();
      }
    }
  }

  public getActiveOperation(): 'OP10' | 'OP20' {
    return this.currentActiveOperation;
  }

  public switchOperationSetup(op: 'OP10' | 'OP20'): void {
    this.currentActiveOperation = op;

    if (typeof document !== 'undefined') {
      const btnOp10 = document.getElementById('btn-setup-op10');
      const btnOp20 = document.getElementById('btn-setup-op20');
      if (btnOp10) btnOp10.classList.toggle('active', op === 'OP10');
      if (btnOp20) btnOp20.classList.toggle('active', op === 'OP20');
    }

    const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
      uploadedMeshGroup?: THREE.Group | null;
      blockGroup?: THREE.Group | null;
      requestRender?: () => void;
      showToast?: (msg: string) => void;
      currentUploadedCad?: { name?: string };
    };

    const targetMesh = win.uploadedMeshGroup || win.blockGroup;
    if (targetMesh) {
      if (op === 'OP20') {
        targetMesh.rotation.x = Math.PI;
      } else {
        targetMesh.rotation.x = 0;
      }
      targetMesh.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(targetMesh);
      targetMesh.position.y -= box.min.y;
      targetMesh.updateMatrixWorld(true);
    }

    const app = this.appInstance as { getCADViewer?: () => CADViewer } | null;
    if (app && typeof app.getCADViewer === 'function') {
      const cadViewer = app.getCADViewer();
      cadViewer?.applyOperationSetup(op);
    }

    const dims = this.matchResult ? this.matchResult.dimensions : this.dimensions;
    const bbox = (this.currentCadMetadata?.bbox?.min && this.currentCadMetadata?.bbox?.max)
      ? { min: this.currentCadMetadata.bbox.min, max: this.currentCadMetadata.bbox.max }
      : { min: [0, 0, 0] as [number, number, number], max: [120, 60, 45] as [number, number, number] };

    const pathFeatures: PathFeatureInput[] = dims.map((d) => {
      const coords = d.cad_center
        ? { x: d.cad_center[0], y: d.cad_center[1], z: d.cad_center[2] }
        : InspectionSynchronizer.getFeatureCoordinates(d.id);
      return {
        id: d.id,
        balloon: d.balloon,
        type: d.type,
        type_label: d.type_label,
        nominal: typeof d.nominal === 'number' ? d.nominal : parseFloat(String(d.nominal)) || 10,
        cad_center: [coords.x, coords.y, coords.z],
        cad_normal: d.cad_normal || [0, 0, 1],
        operation: (d.operation as 'OP10' | 'OP20') || 'OP10',
      };
    });

    const plan = MeasurementPathGenerator.generatePlan(pathFeatures, bbox, {
      activeOperation: op,
      verticalAxis: 'Y',
      clearanceZMarginMm: 15.0,
    });

    if (app && typeof app.getCADViewer === 'function') {
      const cadViewer = app.getCADViewer();
      cadViewer?.renderTrajectory(plan);
      const simCtrl = cadViewer?.getSimulationController();
      if (simCtrl) {
        simCtrl.setWaypoints(plan.allWaypoints);
        simCtrl.setSpeedMultiplier(1.0);
        if (this.simUnregister) {
          this.simUnregister();
        }
        this.simUnregister = simCtrl.onUpdate((state) => {
          this.handleSimulationStateChange(state);
        });
      }
    }

    if (typeof window !== 'undefined') {
      const wAny = window as unknown as {
        trajLine?: { visible: boolean; geometry?: { dispose?: () => void } };
        touchPointMeshes?: Array<unknown>;
        trajectoryPoints?: Array<unknown>;
        scene?: { add: (obj: unknown) => void; remove: (obj: unknown) => void };
      };

      if (wAny.trajLine) {
        if (typeof wAny.trajLine.geometry?.dispose === 'function') {
          wAny.trajLine.geometry.dispose();
        }
        if (plan.allWaypoints.length > 0) {
          const waypoints = plan.allWaypoints.map((w) => w.position.clone());
          (wAny.trajLine as unknown as { geometry: unknown }).geometry = new THREE.BufferGeometry().setFromPoints(waypoints);
          wAny.trajLine.visible = true;
          if (wAny.trajectoryPoints) {
            wAny.trajectoryPoints.length = 0;
            wAny.trajectoryPoints.push(...waypoints);
          }
        }
      }

      if (wAny.scene) {
        if (wAny.touchPointMeshes) {
          wAny.touchPointMeshes.forEach((m) => wAny.scene?.remove(m));
        }
        wAny.touchPointMeshes = [];

        const dotGeo = new THREE.SphereGeometry(1.5, 12, 12);
        for (const fp of plan.featurePaths) {
          for (const tp of fp.touchPoints) {
            const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
            const dotMesh = new THREE.Mesh(dotGeo, dotMat);
            dotMesh.position.set(tp.position[0], tp.position[1], tp.position[2]);
            dotMesh.userData = { label: `${fp.balloon} Temas Noktası` };
            wAny.scene.add(dotMesh);
            wAny.touchPointMeshes.push(dotMesh);
          }
        }
      }
    }

    if (typeof document !== 'undefined') {
      const sidebarLeft = document.querySelector('.sidebar-left') as HTMLElement | null;
      if (sidebarLeft) {
        this.renderVerifiedFeaturesList(sidebarLeft, dims);
      }

      const badge = document.getElementById('part-name-badge');
      const baseName = this.loadedFileName || win.currentUploadedCad?.name || 'Parça';
      if (badge) {
        badge.innerText = `${baseName} (${op === 'OP20' ? '180° Ters Çevrildi' : 'OP10'})`;
        badge.style.color = op === 'OP20' ? '#D97706' : '#0284C7';
      }
    }

    const opPoints = plan.allWaypoints.length;
    const msg = op === 'OP20'
      ? `🔄 OP20 Kurulumu: Parça CMM tablasında 180° ters çevrildi. Alt yüzey için ${opPoints} yol noktası oluşturuldu.`
      : `🔄 OP10 Kurulumu: Üst ve yan yüzey için ${opPoints} yol noktası aktif.`;
    if (typeof win.showToast === 'function') {
      win.showToast(msg);
    }

    if (typeof win.requestRender === 'function') {
      win.requestRender();
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
                  <span class="clean-status-pill ${d.status === 'PASS' ? 'pass' : (d.status === 'UNMEASURED' ? 'unmeasured' : 'warn')}">${d.status} ✓</span>
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

    const coords = dim.cad_center
      ? { x: dim.cad_center[0], y: dim.cad_center[1], z: dim.cad_center[2] }
      : InspectionSynchronizer.getFeatureCoordinates(id);
    const hudName = document.getElementById('hud-feature-name');
    const hudCoords = document.getElementById('hud-feature-coords');
    const hudDetails = document.getElementById('hud-feature-details');

    if (hudName) {
      const cadTag = dim.cad_feature_id ? ` ➔ CAD: ${dim.cad_feature_id}` : '';
      hudName.innerText = `${dim.balloon} [${dim.type_label || dim.nominal_str}]${cadTag}`;
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

  public handleSimulationStateChange(state: SimulationState): void {
    if (typeof document === 'undefined') return;

    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.innerText = state.isPlaying ? '❚❚' : '▶';
    }

    const timeSlider = document.getElementById('time-slider') as HTMLInputElement | null;
    if (timeSlider && document.activeElement !== timeSlider) {
      timeSlider.value = String(Math.round(state.progress * 100));
    }

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
      const totalSec = 34;
      const curSec = Math.floor(state.progress * totalSec);
      const curStr = curSec < 10 ? `0${curSec}` : `${curSec}`;
      timeDisplay.innerText = `00:${curStr} / 00:${totalSec}`;
    }

    const panel = document.getElementById('clean-features-panel');
    if (!panel) return;

    const featureItems = Array.from(panel.querySelectorAll<HTMLElement>('.clean-feature-item'));
    if (featureItems.length === 0) return;

    if (state.phase === 'COMPLETED') {
      featureItems.forEach((item) => {
        item.classList.remove('measuring-now');
        const pill = item.querySelector('.clean-status-pill');
        if (pill) {
          pill.className = 'clean-status-pill pass';
          pill.textContent = 'PASS ✓';
        }
      });
      return;
    }

    const activeId = state.activeFeatureId;
    if (activeId !== undefined && activeId !== null) {
      if (this.lastActiveFeatureId !== activeId) {
        this.lastActiveFeatureId = activeId;
        let foundActive = false;

        featureItems.forEach((item) => {
          const id = Number(item.getAttribute('data-clean-id'));
          const pill = item.querySelector('.clean-status-pill');

          if (id === activeId) {
            foundActive = true;
            item.classList.add('measuring-now');
            if (pill) {
              pill.className = 'clean-status-pill measuring';
              pill.textContent = '🎯 ÖLÇÜLÜYOR...';
            }
            if (typeof item.scrollIntoView === 'function') {
              item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          } else {
            item.classList.remove('measuring-now');
            if (!foundActive) {
              if (pill && !pill.classList.contains('pass')) {
                pill.className = 'clean-status-pill pass';
                pill.textContent = 'PASS ✓';
              }
            }
          }
        });

        const dim = this.dimensions.find((d) => d.id === activeId);
        if (dim) {
          const hudName = document.getElementById('hud-feature-name');
          const hudCoords = document.getElementById('hud-feature-coords');
          const hudDetails = document.getElementById('hud-feature-details');

          if (hudName) {
            const cadTag = dim.cad_feature_id ? ` ➔ CAD: ${dim.cad_feature_id}` : '';
            hudName.innerText = `${dim.balloon} [${dim.type_label || dim.nominal_str}]${cadTag}`;
          }
          if (hudCoords) {
            hudCoords.innerText = `Prob (PCS): X: ${state.currentPosition.x.toFixed(2)} | Y: ${state.currentPosition.y.toFixed(2)} | Z: ${state.currentPosition.z.toFixed(2)} mm | Faz: ${state.phase}`;
          }
          if (hudDetails) {
            hudDetails.innerText = `${dim.gdt || 'ASME Y14.5'} | Tol: ${dim.lower_tol} / ${dim.upper_tol} | Ölçülen: ${dim.measured}`;
          }
        }
      } else {
        const hudCoords = document.getElementById('hud-feature-coords');
        if (hudCoords) {
          hudCoords.innerText = `Prob (PCS): X: ${state.currentPosition.x.toFixed(2)} | Y: ${state.currentPosition.y.toFixed(2)} | Z: ${state.currentPosition.z.toFixed(2)} mm | Faz: ${state.phase}`;
        }
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
      .clean-feature-item.measuring-now {
        background: #F0FDF4 !important;
        border-color: #10B981 !important;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.35) !important;
        transform: translateX(4px);
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
      .clean-status-pill.unmeasured {
        background: #FEF3C7;
        color: #B45309;
      }
      .clean-status-pill.measuring {
        background: #DCFCE7 !important;
        color: #15803D !important;
        font-weight: 800 !important;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.4) !important;
        animation: nuperPulseGlow 1.2s infinite ease-in-out !important;
      }
      @keyframes nuperPulseGlow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(0.97); }
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
      .audit-inline-header {
        gap: 8px;
      }
      .audit-inline-back {
        padding: 4px 8px;
        background: #FFFFFF;
        color: #0284C7;
        border: 1px solid #BAE6FD;
        border-radius: 4px;
        font-size: 10.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .audit-inline-back:hover {
        background: #F0F9FF;
        border-color: #0284C7;
      }
      .audit-inline-editor {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        margin: 0;
        padding: 12px 12px 20px;
        display: flex;
        flex-direction: column;
        gap: 7px;
        background: #FFFFFF;
      }
      .audit-inline-editor-title {
        font-size: 11px;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: 0.5px;
        padding-bottom: 6px;
        border-bottom: 1px solid #E2E8F0;
      }
      .audit-inline-editor-sub {
        display: block;
        margin-top: 2px;
        font-size: 9.5px;
        font-weight: 500;
        color: #64748B;
        letter-spacing: 0;
      }
      .audit-inline-label {
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        color: #64748B;
        letter-spacing: 0.3px;
      }
      .audit-inline-field {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        color: #0F172A;
        font-size: 12px;
      }
      .audit-inline-field:focus {
        outline: none;
        border-color: #0284C7;
        box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.12);
      }
      .audit-inline-symbols {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .audit-inline-symbol {
        padding: 2px 7px;
        font-size: 10px;
        font-weight: 700;
        background: #F1F5F9;
        border: 1px solid #CBD5E1;
        border-radius: 3px;
        color: #0284C7;
        cursor: pointer;
      }
      .audit-inline-symbol:hover {
        background: #E0F2FE;
        border-color: #0284C7;
      }
      .audit-inline-section {
        margin-bottom: 7px;
      }
      .audit-type-select-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #F8FAFC;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        padding: 3px 8px;
      }
      .audit-type-icon-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0284C7;
        flex-shrink: 0;
      }
      .audit-type-select {
        flex: 1;
        border: none !important;
        background: transparent !important;
        padding: 3px 0 !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        color: #0F172A !important;
        outline: none !important;
      }
      .audit-field-stacked {
        width: 100%;
        box-sizing: border-box;
      }
      .audit-datum-container {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .audit-inline-datum-chips {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .datum-chip {
        padding: 3px 9px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        background: #F1F5F9;
        border: 1px solid #CBD5E1;
        color: #475569;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .datum-chip:hover {
        background: #E2E8F0;
        border-color: #94A3B8;
      }
      .datum-chip.active {
        background: #0284C7;
        border-color: #0284C7;
        color: #FFFFFF;
        box-shadow: 0 1px 3px rgba(2, 132, 199, 0.3);
      }
      .datum-chip-add {
        padding: 3px 7px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        background: transparent;
        border: 1px dashed #94A3B8;
        color: #64748B;
        cursor: pointer;
      }
      .datum-chip-add:hover {
        border-color: #0284C7;
        color: #0284C7;
        background: #F0F9FF;
      }
      .audit-inline-grid3 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 6px;
      }
      .audit-inline-grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }
      .audit-inline-actions {
        display: flex;
        gap: 6px;
        margin-top: 6px;
      }
      .audit-inline-save {
        flex: 1;
        padding: 7px 10px;
        background: #0284C7;
        color: #FFFFFF;
        border: none;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      .audit-inline-save:hover {
        background: #0369A1;
      }
      .audit-inline-cancel {
        padding: 7px 10px;
        background: #F1F5F9;
        color: #334155;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      .audit-inline-cancel:hover {
        background: #E2E8F0;
      }
      .audit-inline-delete {
        padding: 7px 10px;
        background: #FEF2F2;
        color: #DC2626;
        border: 1px solid #FCA5A5;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      .audit-inline-delete:hover {
        background: #FEE2E2;
      }
    `;
    document.head.appendChild(style);
  }

  public destroy(): void {
    if (this.simUnregister) {
      this.simUnregister();
      this.simUnregister = null;
    }
    if (typeof window !== 'undefined') {
      if (this.activeMoveHandler) window.removeEventListener('mousemove', this.activeMoveHandler);
      if (this.activeUpHandler) window.removeEventListener('mouseup', this.activeUpHandler);
      if (this.activeKeyHandler) window.removeEventListener('keydown', this.activeKeyHandler);
    }
    this.activeMoveHandler = null;
    this.activeUpHandler = null;
    this.activeKeyHandler = null;
    if (typeof document !== 'undefined') {
      const modal = document.getElementById('modal-drawing-audit');
      if (modal) modal.remove();
      const style = document.getElementById('nuper-audit-light-styles');
      if (style) style.remove();
    }
  }
}
