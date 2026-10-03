import { CoordinateAdapter, type PDFPoint, type CanvasPoint } from './adapters/CoordinateAdapter';

export interface BalloonItem {
  id: string | number;
  page?: number;
  nominal?: number;
  tolerance?: unknown;
  bbox?: [number, number, number, number];
  pageHeight: number;
  confirmed?: boolean;
}

/**
 * Nuper Ortho — Modüler 2D Teknik Resim Kanvası ve Balonlama Motoru
 * Pan, zoom, çoklu sayfa (Page 1/2/3) seçimi ve interaktif çift yönlü eşleme (cross-highlighting) yönetimi.
 */
export class DrawingCanvas {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private zoom = 1.0;
  private panX = 0;
  private panY = 0;
  private balloons: BalloonItem[] = [];
  private selectedBalloonId: string | null = null;
  private activePage = 1;
  private totalPages = 1;
  private pageChangeListeners: Array<(page: number) => void> = [];
  private pageControlsContainer: HTMLElement | null = null;

  public initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  public getActivePage(): number {
    return this.activePage;
  }

  public getTotalPages(): number {
    return this.totalPages;
  }

  public setTotalPages(pages: number): void {
    this.totalPages = Math.max(1, pages);
    if (this.activePage > this.totalPages) {
      this.activePage = this.totalPages;
    }
    this.updatePageControls();
    this.render();
  }

  public setActivePage(page: number): void {
    const clamped = Math.max(1, Math.min(page, this.totalPages));
    if (this.activePage !== clamped) {
      this.activePage = clamped;
      for (const listener of this.pageChangeListeners) {
        listener(this.activePage);
      }
      this.updatePageControls();
      this.render();
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
    this.render();
  }

  public getBalloons(): BalloonItem[] {
    return this.balloons;
  }

  public getBalloonsForActivePage(): BalloonItem[] {
    return this.balloons.filter((b) => (b.page ?? 1) === this.activePage);
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
    this.render();
  }

  public getSelectedBalloonId(): string | null {
    return this.selectedBalloonId;
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
    group.style.gap = '6px';
    group.style.alignItems = 'center';

    for (let p = 1; p <= this.totalPages; p++) {
      const btn = document.createElement('button');
      btn.className = `btn-page-tab ${p === this.activePage ? 'active' : ''}`;
      btn.innerText = `Sayfa ${p}`;
      btn.addEventListener('click', () => {
        this.setActivePage(p);
      });
      group.appendChild(btn);
    }

    this.pageControlsContainer.appendChild(group);
  }

  public render(): void {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const { width, height } = this.canvas;

    ctx.clearRect(0, 0, width, height);

    // Sayfa Başlığı ve Filigranı
    ctx.save();
    ctx.fillStyle = '#64748b';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillText(`Sayfa ${this.activePage} / ${this.totalPages}`, 16, 22);
    ctx.restore();

    ctx.save();
    ctx.translate(this.panX, this.panY);

    // Yalnızca geçerli sayfaya ait balonları çiz
    const visibleBalloons = this.getBalloonsForActivePage();

    for (const b of visibleBalloons) {
      if (!b.bbox) continue;
      const pdfPt: PDFPoint = { x: b.bbox[0], y: b.bbox[1], pageHeight: b.pageHeight };
      const canvasPt: CanvasPoint = CoordinateAdapter.pdfToCanvas(pdfPt, this.zoom);

      const isSelected = String(b.id) === this.selectedBalloonId;
      const isConfirmed = !!b.confirmed;

      // Seçili balona parlama efekti (Glow Highlight)
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(canvasPt.x, canvasPt.y, 22 * this.zoom, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.22)';
        ctx.fill();
        ctx.lineWidth = 2 * this.zoom;
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();
      }

      // Balon halkası
      ctx.beginPath();
      ctx.arc(canvasPt.x, canvasPt.y, 14 * this.zoom, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#0284c7' : isConfirmed ? '#10b981' : '#f8fafc';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3.5 : 1.5;
      ctx.strokeStyle = isSelected ? '#38bdf8' : isConfirmed ? '#059669' : '#64748b';
      ctx.stroke();

      // Balon metni
      ctx.fillStyle = isSelected || isConfirmed ? '#ffffff' : '#0f172a';
      ctx.font = `bold ${Math.max(10, 11 * this.zoom)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(b.id), canvasPt.x, canvasPt.y);
    }

    ctx.restore();
  }

  public destroy(): void {
    this.balloons = [];
    this.pageChangeListeners = [];
    this.pageControlsContainer = null;
    this.canvas = null;
    this.ctx = null;
  }
}

