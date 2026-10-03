import { CADViewer } from './modules/cad/CADViewer';
import { DrawingCanvas } from './modules/drawing/DrawingCanvas';
import { MockIpcProvider } from './modules/ipc/MockIpcProvider';
import { PRECISION, isEqual } from './modules/core/math/precision';
import type { DrawingExtractionResult } from './types/generated/drawing_data';

/**
 * Nuper Ortho — Modüler Frontend Giriş Noktası (Application Entry Point)
 * CADViewer, DrawingCanvas, Mock IPC ve merkezi matematik çekirdeğini birleştirir.
 */
export class NuperApp {
  private cadViewer: CADViewer;
  private drawingCanvas: DrawingCanvas;
  private isMockMode: boolean;

  constructor() {
    this.cadViewer = new CADViewer();
    this.drawingCanvas = new DrawingCanvas();
    this.isMockMode = typeof window !== 'undefined' && new URLSearchParams(window.location?.search).get('mock') === 'true';

    if (this.isMockMode) {
      MockIpcProvider.initialize();
    }
  }

  public getCADViewer(): CADViewer {
    return this.cadViewer;
  }

  public getDrawingCanvas(): DrawingCanvas {
    return this.drawingCanvas;
  }

  public checkPrecision(a: number, b: number): boolean {
    return isEqual(a, b, PRECISION.EPSILON_LINEAR);
  }

  public loadSampleData(data: DrawingExtractionResult): void {
    if (data.dimensions) {
      this.drawingCanvas.setBalloons(
        data.dimensions.map((dim) => ({
          id: dim.id,
          nominal: dim.nominal,
          tolerance: dim.tolerance,
          bbox: dim.bbox,
          pageHeight: 595.28,
        }))
      );
    }
  }

  public destroy(): void {
    this.cadViewer.destroy();
    this.drawingCanvas.destroy();
  }
}

// Global bootstrap for browser / electron environment
if (typeof window !== 'undefined') {
  (window as unknown as { nuperApp: NuperApp }).nuperApp = new NuperApp();
}
