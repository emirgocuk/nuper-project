import * as THREE from 'three';
import { CADViewer } from './modules/cad/CADViewer';
import { SimulationController } from './modules/cad/SimulationController';
import { DrawingCanvas } from './modules/drawing/DrawingCanvas';
import { InspectionTable } from './modules/inspection/InspectionTable';
import { IpcClient, type SelectedCadFile, type SelectedDrawingFile, type BenchmarkSpecimenSuite } from './modules/ipc/IpcClient';
import { PRECISION, isEqual } from './modules/core/math/precision';
import type { DrawingExtractionResult } from './types/generated/drawing_data';
import type { CadMetadata } from './types/generated/cad_metadata';
import { SetupWizard } from './modules/inspection/utils/SetupWizard';
import { AiStatusIndicator } from './modules/core/utils/AiStatusIndicator';
import { installCadImportInterceptor, applyStepModelToScene } from './modules/cad/utils/CadImportManager';
import { WorkflowRibbon } from './modules/core/utils/WorkflowRibbon';

export class NuperApp {
  private cadViewer: CADViewer;
  private drawingCanvas: DrawingCanvas;
  private inspectionTable: InspectionTable;
  private ipcClient: IpcClient;
  private setupWizard: SetupWizard;
  private lastCadFilePath: string | null = null;
  private isSelectingCad = false;
  private isSelectingDrawing = false;
  private pendingBindBalloonId: number | null = null;

  constructor() {
    this.cadViewer = new CADViewer();
    this.drawingCanvas = new DrawingCanvas();
    this.inspectionTable = new InspectionTable();
    this.ipcClient = IpcClient.getInstance();
    this.setupWizard = new SetupWizard(this);

    this.inspectionTable.onSelectionChange((row) => {
      if (row) {
        this.drawingCanvas.selectBalloon(String(row.id), false);
        this.cadViewer.highlightFeature(row.feature_key);
      } else {
        this.drawingCanvas.selectBalloon(null, false);
        this.cadViewer.highlightFeature(undefined);
      }
    });

    this.drawingCanvas.onBalloonSelected((balloonId) => {
      if (balloonId !== null) {
        const row = this.inspectionTable.getRows().find((r) => String(r.id) === balloonId || r.balloon.replace('#', '') === balloonId);
        if (row) {
          this.inspectionTable.selectRow(row.id);
          this.cadViewer.highlightFeature(row.feature_key);
        }
      }
    });

    this.cadViewer.onFaceSelected((details) => {
      const targetId = this.pendingBindBalloonId ?? this.setupWizard.getPendingSurfaceBindDimensionId();
      if (targetId !== null) {
        this.pendingBindBalloonId = null;
        this.setupWizard.bindDimensionTo3DSurface(targetId, {
          faceId: details.faceId,
          featureId: details.featureId || `CAD_FACE_${details.faceId}`,
          center: details.center,
          normal: details.normal,
          area: details.area,
          featureType: details.surfaceType,
        });
        const row = this.inspectionTable.getRows().find((r) => r.id === targetId);
        if (row) {
          row.feature_key = details.featureId || `CAD_FACE_${details.faceId}`;
          const rowExt = row as unknown as { match_status?: string; match_confidence?: number; matched_face_ids?: number[] };
          rowExt.match_status = 'ENGINEER_LOCKED';
          rowExt.match_confidence = 1.0;
          rowExt.matched_face_ids = [details.faceId];
          this.inspectionTable.render();
        }
        this.cadViewer.highlightFaceById(details.faceId);
      }
    });

    this.cadViewer.onFeatureSelected((featureId) => {
      const row = this.inspectionTable.getRows().find((r) => r.feature_key === featureId || r.feature_key?.replace(/^CAD_/, '') === featureId.replace(/^CAD_/, ''));
      if (row) {
        this.inspectionTable.selectRow(row.id);
        this.drawingCanvas.selectBalloon(String(row.id), false);
      }
    });

    this.drawingCanvas.onBalloonCreated((b) => {
      this.inspectionTable.addRow({
        id: Number(b.id),
        balloon: `#${b.id}`,
        page: b.page || 1,
        type: 'LINEAR',
        type_label: b.feature_label || 'Ölçü',
        icon: '📏',
        nominal: b.nominal || 0,
        nominal_str: b.feature_label || `${b.nominal || 0}`,
        upper_tol: '',
        lower_tol: '',
        measured: '',
        deviation: '',
        status: 'UNMEASURED',
        datum_reference: '',
      });
    });

    this.drawingCanvas.onBalloonDeleted((id) => {
      this.inspectionTable.removeRow(Number(id));
    });
  }

  public startBindBalloonTo3DFace(balloonId: number): void {
    this.pendingBindBalloonId = balloonId;
  }

  public getCADViewer(): CADViewer {
    return this.cadViewer;
  }

  public getDrawingCanvas(): DrawingCanvas {
    return this.drawingCanvas;
  }

  public getInspectionTable(): InspectionTable {
    return this.inspectionTable;
  }

  public getIpcClient(): IpcClient {
    return this.ipcClient;
  }

  public checkPrecision(a: number, b: number): boolean {
    return isEqual(a, b, PRECISION.EPSILON_LINEAR);
  }

  public mountInspectionPanel(container: HTMLElement): void {
    this.inspectionTable.mount(container);
  }

  public selectInspectionItem(id: number | null): void {
    this.inspectionTable.selectRow(id);
  }

  public loadDrawingData(data: DrawingExtractionResult): void {
    const normalizedDims = data.dimensions
      ? data.dimensions.map((dim) => {
          const extDim = dim as typeof dim & { op?: string; datum_reference?: string };
          return {
            ...dim,
            datum_reference: extDim.datum_reference || '',
            op: extDim.op || 'OP10',
          };
        })
      : data.dimensions;
    const normalizedData: DrawingExtractionResult = {
      ...data,
      dimensions: normalizedDims,
    };

    this.inspectionTable.setExtractionResult(normalizedData);
    this.drawingCanvas.setTotalPages(normalizedData.page_count || 1);

    if (normalizedData.dimensions) {
      this.drawingCanvas.setBalloons(
        normalizedData.dimensions.map((dim) => ({
          id: dim.id,
          page: dim.page || 1,
          nominal: dim.nominal,
          tolerance: `${dim.lower_tol}/${dim.upper_tol}`,
          bbox: dim.bbox,
          pageHeight: 595.28,
          confirmed: dim.status === 'PASS',
          feature_label: dim.nominal_str || (dim.nominal !== undefined && dim.nominal !== null ? `${dim.nominal}` : ''),
          risk_level: dim.risk_level,
          risk_reasons: dim.risk_reasons,
          tolerance_source: dim.tolerance_source,
          match_confidence: dim.match_confidence,
          match_status: dim.match_status,
        }))
      );
    }

    if (normalizedData.similar_parts && normalizedData.similar_parts.length > 0 && typeof document !== 'undefined') {
      const topPart = normalizedData.similar_parts[0];
      const rawSim = topPart.similarity_score ?? (typeof topPart.similarity === 'number' ? topPart.similarity : 0);
      const simPercent = Math.round(rawSim * (rawSim <= 1.0 ? 100 : 1));
      const hudDetails = document.getElementById('hud-feature-details');
      if (hudDetails) {
        hudDetails.innerText = `💡 Benzer Parça Eşleşmesi: ${topPart.part_name || topPart.part_id} (%${simPercent} Benzerlik) — Önerilen Kurulum: OP10 (${topPart.recommended_setup_op10 || 'A0B0'}) | Prob: ${topPart.recommended_probe || 'Ø3x50'}`;
      }
    }

    const rawData = normalizedData as unknown as {
      similar_parts?: Array<{ part_name?: string; part_id?: string; similarity_pct?: number; similarity?: number }>;
      contract_summary?: { critical_count?: number; warning_count?: number; normal_count?: number; status?: string };
    };
    this.drawingCanvas.updateAuditMetadata(rawData.similar_parts, rawData.contract_summary);

    this.setupWizard.setExtractedData(normalizedData);
  }

  public loadSampleData(data: DrawingExtractionResult): void {
    this.loadDrawingData(data);
  }

  public async openAndLoadCadFile(): Promise<SelectedCadFile | null> {
    if (this.isSelectingCad) {
      return null;
    }
    this.isSelectingCad = true;
    try {
      const cadFile = await this.ipcClient.selectCadFile();
      if (cadFile) {
        if (cadFile.filePath) {
          this.lastCadFilePath = cadFile.filePath;
        }
        const tess = applyStepModelToScene(cadFile.name, cadFile.dataText || '', cadFile.metadata);
        const geometry = tess.geometry || new THREE.BoxGeometry(tess.bbox.size[0], tess.bbox.size[1], tess.bbox.size[2]);
        this.cadViewer.setModelGeometry(geometry);

        const ext = (cadFile.name.split('.').pop()?.toLowerCase() || 'stp') as 'step' | 'stp' | 'stl' | 'obj';
        const cadMeta: CadMetadata = cadFile.metadata || {
          model_name: cadFile.name,
          file_format: (['step', 'stp', 'stl', 'obj'].includes(ext) ? ext : 'stp') as 'step' | 'stp' | 'stl' | 'obj',
          vertex_count: tess.geometry ? tess.geometry.attributes.position.count : 0,
          triangle_count: tess.geometry && tess.geometry.index ? tess.geometry.index.count / 3 : 0,
          bbox: {
            min: tess.bbox.min,
            max: tess.bbox.max,
            size: tess.bbox.size,
          },
          features: (tess.cadFeatures as unknown as NonNullable<CadMetadata['features']>) || [],
        };
        this.cadViewer.setCadMetadata(cadMeta);
        this.setupWizard.setCadMetadata(cadMeta);
      } else {
        const fileInput = document.getElementById('step-file-input') || document.getElementById('real-3d-file-input');
        if (fileInput) {
          fileInput.click();
        }
      }
      return cadFile;
    } finally {
      this.isSelectingCad = false;
    }
  }

  public async openAndLoadDrawingFile(): Promise<DrawingExtractionResult | null> {
    if (this.isSelectingDrawing) {
      return null;
    }
    this.isSelectingDrawing = true;
    try {
      const drawingFile: SelectedDrawingFile | null = await this.ipcClient.selectDrawingFile();
      if (!drawingFile) {
        return null;
      }

      if (drawingFile.dataBase64) {
        try {
          const binaryString = atob(drawingFile.dataBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await this.drawingCanvas.loadPdf(bytes);
          await this.setupWizard.loadPdfData(bytes, drawingFile.name);
        } catch {}
      } else if (drawingFile.filePath) {
        try {
          await this.drawingCanvas.loadPdf(drawingFile.filePath);
        } catch {}
      }

      const result = await this.ipcClient.extractDrawingData(drawingFile.filePath, this.lastCadFilePath || undefined);
      if (result) {
        this.loadDrawingData(result);
        this.setupWizard.setExtractedData(result, drawingFile.name);
        this.setupWizard.openDrawingAuditModal();
      }
      return result;
    } finally {
      this.isSelectingDrawing = false;
    }
  }

  public async loadBenchmark(specimenIndex: number | string): Promise<BenchmarkSpecimenSuite | null> {
    const suite = await this.ipcClient.loadBenchmarkSpecimen(specimenIndex);
    if (!suite) {
      return null;
    }

    if (suite.cad) {
      if (suite.cad.filePath) {
        this.lastCadFilePath = suite.cad.filePath;
      }
      if (suite.cad.metadata) {
        this.cadViewer.setCadMetadata(suite.cad.metadata);
        this.setupWizard.setCadMetadata(suite.cad.metadata);
      }
      const tess = applyStepModelToScene(suite.cad.name, suite.cad.dataText || '', suite.cad.metadata);
      const geometry = tess.geometry || new THREE.BoxGeometry(tess.bbox.size[0], tess.bbox.size[1], tess.bbox.size[2]);
      this.cadViewer.setModelGeometry(geometry);
    }

    if (suite.drawing?.filePath) {
      const extracted = await this.ipcClient.extractDrawingData(suite.drawing.filePath, this.lastCadFilePath || undefined);
      if (extracted) {
        this.loadDrawingData(extracted);
      }
    }

    return suite;
  }

  public minimize(): void {
    this.ipcClient.minimizeWindow();
  }

  public maximize(): void {
    this.ipcClient.maximizeWindow();
  }

  public close(): void {
    this.ipcClient.closeWindow();
  }

  public getSetupWizard(): SetupWizard {
    return this.setupWizard;
  }

  public destroy(): void {
    this.cadViewer.destroy();
    this.drawingCanvas.destroy();
    this.inspectionTable.clear();
    this.setupWizard.destroy();
  }

  public mountDrawingCanvas(containerOrSelector: HTMLElement | string = '#drawing-viewport-canvas'): void {
    this.drawingCanvas.mount(containerOrSelector);
  }
}

if (typeof window !== 'undefined') {
  const app = new NuperApp();
  (window as unknown as { nuperApp: NuperApp; DrawingCanvas: typeof DrawingCanvas; SimulationController: typeof SimulationController; SetupWizard: typeof SetupWizard }).nuperApp = app;
  (window as unknown as { DrawingCanvas: typeof DrawingCanvas }).DrawingCanvas = DrawingCanvas;
  (window as unknown as { SimulationController: typeof SimulationController }).SimulationController = SimulationController;
  (window as unknown as { SetupWizard: typeof SetupWizard }).SetupWizard = SetupWizard;

  const initApp = () => {
    app.mountDrawingCanvas('#drawing-viewport-canvas');
    app.getDrawingCanvas().setBalloons([]);
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    const simCtrl = app.getCADViewer().getSimulationController();
    simCtrl.setSpeedMultiplier(1.0);
    SimulationController.wireSpeedButtons('.speed-controls', simCtrl);
    const speedBtns = document.querySelectorAll('.speed-controls button[data-speed]');
    speedBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-speed') === '1.0'));

    const win = window as unknown as {
      generateDynamicProbeTrajectory?: () => void;
      syncSimControllerWaypoints?: () => void;
      isSimulating?: boolean;
      openAiInspectionModal?: () => void;
      trigger2dUpload?: () => void;
      setupWizard?: SetupWizard;
      apply321Alignment?: () => void;
      open321Modal?: () => void;
      openClampingModal?: () => void;
      openBenchmarkLabModal?: () => void;
      toggleDiagnosticsDrawer?: () => void;
      switchSetup?: (op: 'OP10' | 'OP20') => void;
      requestRender?: () => void;
      trajLine?: { visible: boolean };
      blockGroup?: { visible: boolean };
    };
    win.isSimulating = false;
    simCtrl.pause();

    const wizard = app.getSetupWizard();
    win.setupWizard = wizard;
    win.openAiInspectionModal = () => {
      wizard.handleTeknikResimClick();
    };
    (win as unknown as { trigger2dUpload?: () => void }).trigger2dUpload = () => {
      wizard.handleTeknikResimClick();
    };

    const drawingBtns = document.querySelectorAll(
      'button[onclick*="trigger2dUpload"], .dropdown-row[onclick*="trigger2dUpload"], button[title*="2D PDF"]'
    );
    drawingBtns.forEach((btn) => {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        wizard.handleTeknikResimClick();
      });
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        wizard.handleTeknikResimClick();
      }
    });

    wizard.startWorkflow();
    installCadImportInterceptor();

    const workflowRibbon = new WorkflowRibbon();
    workflowRibbon.mount('.app-ribbon');
    (win as unknown as { workflowRibbon?: WorkflowRibbon }).workflowRibbon = workflowRibbon;

    const origApply321 = win.apply321Alignment;
    win.apply321Alignment = () => {
      const wAny = win as unknown as { optimizePartOrientation?: () => void };
      if (typeof wAny.optimizePartOrientation === 'function') {
        try {
          wAny.optimizePartOrientation();
        } catch {}
      }
      if (typeof origApply321 === 'function') {
        origApply321();
      }
      if (wizard.isPlanConfirmed() && wizard.getDimensions().length > 0) {
        wizard.applyActivePlanToWorkspace(wizard.getDimensions());
      }
      workflowRibbon.advanceToStep(5);
      workflowRibbon.mount('.app-ribbon');
    };

    win.open321Modal = () => {
      if (typeof win.apply321Alignment === 'function') {
        win.apply321Alignment();
      }
    };

    if (win.blockGroup) win.blockGroup.visible = false;
    if (win.trajLine) win.trajLine.visible = false;

    const togglePathBtn = document.getElementById('btn-toggle-path');
    if (togglePathBtn) {
      togglePathBtn.classList.add('active');
      togglePathBtn.innerText = 'Prob Yolunu Gizle';
      togglePathBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (win.trajLine) {
          win.trajLine.visible = !win.trajLine.visible;
          togglePathBtn.classList.toggle('active', win.trajLine.visible);
          togglePathBtn.innerText = win.trajLine.visible ? 'Prob Yolunu Gizle' : 'Prob Yolunu Göster';
          if (typeof win.requestRender === 'function') win.requestRender();
        }
      };
    }

    const ribbonSimBtns = document.querySelectorAll('button[onclick*="togglePlay"], .dropdown-row[onclick*="togglePlay"]');
    ribbonSimBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        simCtrl.togglePlay();
      });
    });

    const dc = app.getDrawingCanvas();
    const prevPageBtn = document.getElementById('btn-drawing-prev-page');
    if (prevPageBtn) {
      prevPageBtn.onclick = (e) => {
        e.preventDefault();
        const curr = dc.getActivePage();
        dc.setActivePage(Math.max(1, curr - 1));
      };
    }
    const nextPageBtn = document.getElementById('btn-drawing-next-page');
    if (nextPageBtn) {
      nextPageBtn.onclick = (e) => {
        e.preventDefault();
        const curr = dc.getActivePage();
        dc.setActivePage(curr + 1);
      };
    }
    const manualBalloonBtn = document.getElementById('btn-manual-balloon');
    if (manualBalloonBtn) {
      manualBalloonBtn.onclick = (e) => {
        e.preventDefault();
        dc.enableManualBalloonDrawMode();
      };
    }
    const deleteBalloonBtn = document.getElementById('btn-delete-balloon');
    if (deleteBalloonBtn) {
      deleteBalloonBtn.onclick = (e) => {
        e.preventDefault();
        dc.deleteSelectedBalloon();
      };
    }
    const bind3DFaceBtn = document.getElementById('btn-bind-3d-face');
    if (bind3DFaceBtn) {
      bind3DFaceBtn.onclick = (e) => {
        e.preventDefault();
        dc.bindBalloonTo3DFaceMode();
      };
    }
    dc.onPageChange((page: number) => {
      const ind = document.getElementById('drawing-page-indicator');
      if (ind) {
        ind.innerText = `Sayfa ${page} / ${Math.max(page, dc.getTotalPages())}`;
      }
    });

    const btnOp10 = document.getElementById('btn-setup-op10');
    const btnOp20 = document.getElementById('btn-setup-op20');
    if (btnOp10) {
      btnOp10.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wizard.switchOperationSetup('OP10');
      });
    }
    if (btnOp20) {
      btnOp20.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wizard.switchOperationSetup('OP20');
      });
    }
    win.switchSetup = (op: 'OP10' | 'OP20') => {
      wizard.switchOperationSetup(op);
    };

    if (typeof win.requestRender === 'function') {
      win.requestRender();
    }

    void AiStatusIndicator.mountOrUpdateBadge();
    setInterval(() => void AiStatusIndicator.mountOrUpdateBadge(), 15000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}


