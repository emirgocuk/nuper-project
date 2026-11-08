import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeDrawingFingerprint,
  saveBalloonSessionState,
  loadBalloonSessionState,
  exceedsDragThreshold,
  screenDeltaToStage,
  applyLabelOffset,
  escapeHtmlText,
  type BalloonSessionState,
} from './BalloonEditing';

describe('BalloonEditing', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('computes deterministic drawing fingerprint', () => {
    const fp1 = computeDrawingFingerprint('10142739_dc_modul_plaka.pdf', 30);
    const fp2 = computeDrawingFingerprint('10142739_dc_modul_plaka.pdf', 30);
    const fpDiff = computeDrawingFingerprint('other_part.pdf', 12);

    expect(fp1).toMatch(/^ortho_cache_[0-9a-f]{8}$/);
    expect(fp1).toBe(fp2);
    expect(fp1).not.toBe(fpDiff);
  });

  it('saves and loads balloon session state without data loss', () => {
    const fp = computeDrawingFingerprint('sample_bracket.pdf', 15);
    const mockState: BalloonSessionState = {
      fingerprint: fp,
      timestamp: Date.now(),
      dimensions: [
        { id: 1, balloon: '#1', nominal: 25.4, upper_tol: '+0.05', lower_tol: '-0.05', status: 'PASS' },
        { id: 2, balloon: '#2', nominal: 10.0, upper_tol: '+0.02', lower_tol: '0.00', status: 'UNMEASURED' },
      ],
      lockedBalloons: ['#1'],
    };

    saveBalloonSessionState(mockState);
    const loaded = loadBalloonSessionState(fp);

    expect(loaded).not.toBeNull();
    expect(loaded?.fingerprint).toBe(fp);
    expect(loaded?.dimensions.length).toBe(2);
    expect((loaded?.dimensions[0] as { balloon: string }).balloon).toBe('#1');
    expect(loaded?.lockedBalloons).toEqual(['#1']);
  });

  it('calculates drag threshold and stage deltas accurately', () => {
    expect(exceedsDragThreshold(10, 10, 12, 12, 4)).toBe(false);
    expect(exceedsDragThreshold(10, 10, 15, 15, 4)).toBe(true);

    const stagePt = screenDeltaToStage(20, 10, 2.0);
    expect(stagePt).toEqual({ x: 10, y: 5 });

    const offset = applyLabelOffset({ dx: 5, dy: 5 }, { x: 10, y: -2 });
    expect(offset).toEqual({ dx: 15, dy: 3 });

    const escaped = escapeHtmlText('A & B < C > "D" \'E\'');
    expect(escaped).toBe('A &amp; B &lt; C &gt; &quot;D&quot; &#39;E&#39;');
  });
});
