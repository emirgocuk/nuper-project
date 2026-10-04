import * as THREE from 'three';
import { CADViewer } from './modules/cad/CADViewer';
import { SimulationController } from './modules/cad/SimulationController';
import { DrawingCanvas } from './modules/drawing/DrawingCanvas';
import { InspectionTable } from './modules/inspection/InspectionTable';
import { IpcClient, type SelectedCadFile, type SelectedDrawingFile, type BenchmarkSpecimenSuite } from './modules/ipc/IpcClient';
import { PRECISION, isEqual } from './modules/core/math/precision';
import type { DrawingExtractionResult } from './types/generated/drawing_data';
import { SetupWizard } from './modules/inspection/utils/SetupWizard';

export class NuperApp {
  private cadViewer: CADViewer;
  private drawingCanvas: DrawingCanvas;
  private inspectionTable: InspectionTable;
  private ipcClient: IpcClient;
  private setupWizard: SetupWizard;

  constructor() {
    this.cadViewer = new CADViewer();
    this.drawingCanvas = new DrawingCanvas();
    this.inspectionTable = new InspectionTable();
    this.ipcClient = IpcClient.getInstance();
    this.setupWizard = new SetupWizard(this);

    this.inspectionTable.onSelectionChange((row) => {
      if (row) {
        this.drawingCanvas.selectBalloon(String(row.id));
        this.cadViewer.highlightFeature(row.feature_key);
      } else {
        this.drawingCanvas.selectBalloon(null);
        this.cadViewer.highlightFeature(undefined);
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
      if (cadFile.metadata) {
        this.setupWizard.setCadMetadata(cadFile.metadata);
      }
      const sx = cadFile.metadata?.bbox?.size?.[0] ?? 50;
      const sy = cadFile.metadata?.bbox?.size?.[1] ?? 30;
      const sz = cadFile.metadata?.bbox?.size?.[2] ?? 20;
      const geometry = new THREE.BoxGeometry(sx, sy, sz);
      this.cadViewer.setModelGeometry(geometry);
    }
    return cadFile;
  }

  public async openAndLoadDrawingFile(): Promise<DrawingExtractionResult | null> {
    const drawingFile: SelectedDrawingFile | null = await this.ipcClient.selectDrawingFile();
    if (!drawingFile) {
      return null;
    }
    const result = await this.ipcClient.extractDrawingData(drawingFile.filePath);
    if (result) {
      this.loadDrawingData(result);
    }
    return result;
  }

  public async loadBenchmark(specimenIndex: number | string): Promise<BenchmarkSpecimenSuite | null> {
    const suite = await this.ipcClient.loadBenchmarkSpecimen(specimenIndex);
    if (!suite) {
      return null;
    }

    if (suite.cad) {
      if (suite.cad.metadata) {
        this.setupWizard.setCadMetadata(suite.cad.metadata);
      }
      const sx = suite.cad.metadata?.bbox?.size?.[0] ?? 50;
      const sy = suite.cad.metadata?.bbox?.size?.[1] ?? 30;
      const sz = suite.cad.metadata?.bbox?.size?.[2] ?? 20;
      const geometry = new THREE.BoxGeometry(sx, sy, sz);
      this.cadViewer.setModelGeometry(geometry);
    }

    if (suite.drawing?.filePath) {
      const extracted = await this.ipcClient.extractDrawingData(suite.drawing.filePath);
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
    const simCtrl = app.getCADViewer().getSimulationController();
    simCtrl.setSpeedMultiplier(5.0);
    SimulationController.wireSpeedButtons('.speed-controls', simCtrl);

    const win = window as unknown as {
      generateDynamicProbeTrajectory?: () => void;
      syncSimControllerWaypoints?: () => void;
      isSimulating?: boolean;
      openAiInspectionModal?: () => void;
      trigger2dUpload?: () => void;
      setupWizard?: SetupWizard;
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
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}


