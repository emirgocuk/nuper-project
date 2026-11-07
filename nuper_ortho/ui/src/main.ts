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
    this.inspectionTable.setExtractionResult(data);
    this.drawingCanvas.setTotalPages(data.page_count || 1);

    if (data.dimensions) {
      this.drawingCanvas.setBalloons(
        data.dimensions.map((dim) => ({
          id: dim.id,
          page: dim.page || 1,
          nominal: dim.nominal,
          tolerance: `${dim.lower_tol}/${dim.upper_tol}`,
          bbox: dim.bbox,
          pageHeight: 595.28,
          confirmed: dim.status === 'PASS',
          feature_label: dim.nominal_str || (dim.nominal !== undefined && dim.nominal !== null ? `${dim.nominal}` : ''),
        }))
      );
    }

    this.setupWizard.setExtractedData(data);
  }

  public loadSampleData(data: DrawingExtractionResult): void {
    this.loadDrawingData(data);
  }

  public async openAndLoadCadFile(): Promise<SelectedCadFile | null> {
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
  }

  public async openAndLoadDrawingFile(): Promise<DrawingExtractionResult | null> {
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
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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

    const bindWorkflowEvents = () => {
      const stepCadBtn = document.querySelector('[data-workflow-id="step_cad"]');
      if (stepCadBtn) {
        stepCadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          app.openAndLoadCadFile().then((res) => {
            if (res) {
              const shortName = res.name.length > 20 ? res.name.substring(0, 18) + '...' : res.name;
              workflowRibbon.setStepLabel('step_cad', `Katı Model: ${shortName}`);
              workflowRibbon.advanceToStep(2);
              workflowRibbon.mount('.app-ribbon');
              bindWorkflowEvents();
            }
          });
        });
      }

      const stepFixtureBtn = document.querySelector('[data-workflow-id="step_fixture"]');
      if (stepFixtureBtn) {
        stepFixtureBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof win.openClampingModal === 'function') {
            win.openClampingModal();
          }
          workflowRibbon.advanceToStep(3);
          workflowRibbon.mount('.app-ribbon');
          bindWorkflowEvents();
        });
      }

      const stepDrawingBtn = document.querySelector('[data-workflow-id="step_drawing"]');
      if (stepDrawingBtn) {
        stepDrawingBtn.addEventListener('click', (e) => {
          e.preventDefault();
          wizard.handleTeknikResimClick();
          workflowRibbon.advanceToStep(4);
          workflowRibbon.mount('.app-ribbon');
          bindWorkflowEvents();
        });
      }

      const stepAlignBtn = document.querySelector('[data-workflow-id="step_align"]');
      if (stepAlignBtn) {
        stepAlignBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof win.open321Modal === 'function') {
            win.open321Modal();
          } else if (typeof win.apply321Alignment === 'function') {
            win.apply321Alignment();
          }
        });
      }

      const stepSimBtn = document.querySelector('[data-workflow-id="step_simulation"]');
      if (stepSimBtn) {
        stepSimBtn.addEventListener('click', (e) => {
          e.preventDefault();
          workflowRibbon.advanceToStep(5);
          workflowRibbon.mount('.app-ribbon');
          bindWorkflowEvents();
          simCtrl.togglePlay();
        });
      }

      const benchBtn = document.getElementById('wf-btn-bench');
      if (benchBtn) {
        benchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof win.openBenchmarkLabModal === 'function') {
            win.openBenchmarkLabModal();
          }
        });
      }

      const diagBtn = document.getElementById('wf-btn-diag');
      if (diagBtn) {
        diagBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof win.toggleDiagnosticsDrawer === 'function') {
            win.toggleDiagnosticsDrawer();
          }
        });
      }
    };

    bindWorkflowEvents();

    const origApply321 = win.apply321Alignment;
    win.apply321Alignment = () => {
      if (typeof origApply321 === 'function') {
        origApply321();
      }
      workflowRibbon.advanceToStep(5);
      workflowRibbon.mount('.app-ribbon');
      bindWorkflowEvents();
    };

    if (win.blockGroup) win.blockGroup.visible = true;
    if (typeof win.generateDynamicProbeTrajectory === 'function') {
      win.generateDynamicProbeTrajectory();
    }
    if (win.trajLine) win.trajLine.visible = true;

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


