/**
 * Nuper Ortho — Işık Masası Balon Etiketi Sürükleme Yardımcıları (Saf Geometri)
 * ASME Y14.5 / ISO 15530-3 balon editöründe etiketi kaynak bbox'tan bağımsız taşır.
 */

export const BALLOON_DRAG_THRESHOLD_PX = 4;

export interface StagePoint {
  x: number;
  y: number;
}

export interface LabelOffset {
  dx: number;
  dy: number;
}

export function exceedsDragThreshold(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  threshold: number = BALLOON_DRAG_THRESHOLD_PX
): boolean {
  return Math.hypot(currentX - startX, currentY - startY) >= threshold;
}

export function screenDeltaToStage(dxScreen: number, dyScreen: number, zoom: number): StagePoint {
  const safeZoom = zoom > 0 ? zoom : 1;
  return { x: dxScreen / safeZoom, y: dyScreen / safeZoom };
}

export function applyLabelOffset(current: LabelOffset | undefined, delta: StagePoint): LabelOffset {
  const base = current || { dx: 0, dy: 0 };
  return { dx: base.dx + delta.x, dy: base.dy + delta.y };
}

export function escapeHtmlText(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
