import { CoordinateAdapter, type PDFPoint, type CanvasPoint } from './adapters/CoordinateAdapter';

export interface BalloonItem {
  id: string;
  nominal: number;
  tolerance: { upper: number; lower: number };
  bbox: [number, number, number, number];
  pageHeight: number;
  confirmed?: boolean;
}

/**
 * Nuper Ortho — Modüler 2D Teknik Resim Kanvası ve Balonlama Motoru
 * Pan, zoom ve interaktif çift yönlü eşleme (cross-highlighting) yönetimi.
 */
export class DrawingCanvas {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private zoom = 1.0;
  private panX = 0;
  private panY = 0;
  private balloons: BalloonItem[] = [];
  private selectedBalloonId: string | null = null;

  public initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  public setBalloons(balloons: BalloonItem[]): void {
    this.balloons = balloons;
    this.render();
  }

  public selectBalloon(id: string | null): void {
    this.selectedBalloonId = id;
    this.render();
  }

  public setZoom(zoom: number): void {
    this.zoom = Math.max(0.2, Math.min(zoom, 5.0));
    this.render();
  }

  public setPan(x: number, y: number): void {
    this.panX = x;
    this.panY = y;
    this.render();
  }

  public render(): void {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const { width, height } = this.canvas;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(this.panX, this.panY);

    // Balonları çiz
    for (const b of this.balloons) {
      const pdfPt: PDFPoint = { x: b.bbox[0], y: b.bbox[1], pageHeight: b.pageHeight };
      const canvasPt: CanvasPoint = CoordinateAdapter.pdfToCanvas(pdfPt, this.zoom);

      const isSelected = b.id === this.selectedBalloonId;
      const isConfirmed = !!b.confirmed;

      // Balon halkası
      ctx.beginPath();
      ctx.arc(canvasPt.x, canvasPt.y, 14 * this.zoom, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#0284c7' : isConfirmed ? '#10b981' : '#f8fafc';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? '#0369a1' : isConfirmed ? '#059669' : '#64748b';
      ctx.stroke();

      // Balon metni
      ctx.fillStyle = isSelected || isConfirmed ? '#ffffff' : '#0f172a';
      ctx.font = `bold ${Math.max(10, 11 * this.zoom)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.id, canvasPt.x, canvasPt.y);
    }

    ctx.restore();
  }

  public destroy(): void {
    this.balloons = [];
    this.canvas = null;
    this.ctx = null;
  }
}
