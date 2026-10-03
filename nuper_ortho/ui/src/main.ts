import * as THREE from 'three';
import { CADViewer } from './modules/cad/CADViewer';
import { SimulationController } from './modules/cad/SimulationController';
import { DrawingCanvas } from './modules/drawing/DrawingCanvas';
import { InspectionTable } from './modules/inspection/InspectionTable';
import { IpcClient, type SelectedCadFile, type SelectedDrawingFile, type BenchmarkSpecimenSuite } from './modules/ipc/IpcClient';
import { PRECISION, isEqual } from './modules/core/math/precision';
import type { DrawingExtractionResult } from './types/generated/drawing_data';

export class NuperApp {
  private cadViewer: CADViewer;
  private drawingCanvas: DrawingCanvas;
  private inspectionTable: InspectionTable;
  private ipcClient: IpcClient;

  constructor() {
    this.cadViewer = new CADViewer();
    this.drawingCanvas = new DrawingCanvas();
    this.inspectionTable = new InspectionTable();
    this.ipcClient = IpcClient.getInstance();

    this.inspectionTable.onSelectionChange((row) => {
      if (row) {
        this.drawingCanvas.selectBalloon(String(row.id));
        this.cadViewer.highlightFeature(row.feature_key);
      } else {
        this.drawingCanvas.selectBalloon(null);
        this.cadViewer.highlightFeature(undefined);
      }
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
        }))
      );
    }
  }

  public loadSampleData(data: DrawingExtractionResult): void {
    this.loadDrawingData(data);
  }

  public async openAndLoadCadFile(): Promise<SelectedCadFile | null> {
    const cadFile = await this.ipcClient.selectCadFile();
    if (cadFile) {
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

  public destroy(): void {
    this.cadViewer.destroy();
    this.drawingCanvas.destroy();
    this.inspectionTable.clear();
  }

  public mountDrawingCanvas(containerOrSelector: HTMLElement | string = '#drawing-viewport-canvas'): void {
    this.drawingCanvas.mount(containerOrSelector);
  }
}

if (typeof window !== 'undefined') {
  const app = new NuperApp();
  (window as unknown as { nuperApp: NuperApp; DrawingCanvas: typeof DrawingCanvas; SimulationController: typeof SimulationController }).nuperApp = app;
  (window as unknown as { DrawingCanvas: typeof DrawingCanvas }).DrawingCanvas = DrawingCanvas;
  (window as unknown as { SimulationController: typeof SimulationController }).SimulationController = SimulationController;

  const initApp = () => {
    app.mountDrawingCanvas('#drawing-viewport-canvas');
    SimulationController.wireSpeedButtons('.speed-controls', app.getCADViewer().getSimulationController());

    const dc = app.getDrawingCanvas();
    const defaultPdf = 'test_assets/KPT - 3051 Gobek Bagı Olugu/GOBEK BAGI OLUGU_TR_AB.pdf';
    dc.loadPdf(defaultPdf)
      .then(() => {
        dc.setActivePage(2);
        void dc.render();
      })
      .catch(() => {
        void dc.render();
      });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}


