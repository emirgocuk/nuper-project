import { describe, it, expect } from 'vitest';
import {
  BALLOON_DRAG_THRESHOLD_PX,
  exceedsDragThreshold,
  screenDeltaToStage,
  applyLabelOffset,
  escapeHtmlText,
} from './BalloonEditing';

describe('BalloonEditing — Işık Masası balon etiketi sürükleme geometrisi', () => {
  it('Sürükleme eşiği altındaki hareketleri tıklama olarak değerlendirir', () => {
    expect(exceedsDragThreshold(100, 100, 101, 101)).toBe(false);
    expect(exceedsDragThreshold(100, 100, 100, 100)).toBe(false);
    expect(BALLOON_DRAG_THRESHOLD_PX).toBe(4);
  });

  it('Sürükleme eşiğini aşan hareketi gerçek sürükleme sayar', () => {
    expect(exceedsDragThreshold(100, 100, 110, 100)).toBe(true);
    expect(exceedsDragThreshold(100, 100, 100, 90)).toBe(true);
    expect(exceedsDragThreshold(0, 0, 3, 3, 5)).toBe(false);
  });

  it('Zoom uygulanmış ekran farkını sahne (stage) birimine çevirir', () => {
    expect(screenDeltaToStage(100, 50, 2)).toEqual({ x: 50, y: 25 });
    expect(screenDeltaToStage(100, 50, 1)).toEqual({ x: 100, y: 50 });
  });

  it('Sıfır/geçersiz zoom değerinde sahne farkını bozmaz', () => {
    expect(screenDeltaToStage(40, -20, 0)).toEqual({ x: 40, y: -20 });
    expect(screenDeltaToStage(40, -20, -3)).toEqual({ x: 40, y: -20 });
  });

  it('Mevcut etiket ofsetini yeni sürükleme farkıyla birleştirir (kaynak bbox değişmez)', () => {
    expect(applyLabelOffset(undefined, { x: 10, y: -5 })).toEqual({ dx: 10, dy: -5 });
    expect(applyLabelOffset({ dx: 10, dy: -5 }, { x: -4, y: 2 })).toEqual({ dx: 6, dy: -3 });
  });

  it('Etiket metnini HTML enjeksiyonuna karşı kaçışlar', () => {
    expect(escapeHtmlText('Ø86 <script>"x" & \'y\'')).toBe(
      'Ø86 &lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;'
    );
  });
});
