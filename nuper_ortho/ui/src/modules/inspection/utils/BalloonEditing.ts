export const BALLOON_DRAG_THRESHOLD_PX = 4;

export interface StagePoint {
  x: number;
  y: number;
}

export interface LabelOffset {
  dx: number;
  dy: number;
}

export interface BalloonSessionState {
  fingerprint: string;
  timestamp: number;
  dimensions: unknown[];
  overrides?: Record<string, unknown>;
  lockedBalloons?: string[];
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

export function computeDrawingFingerprint(fileName: string, fileSize = 0): string {
  const input = `${(fileName || '').trim().toLowerCase()}_${fileSize}`;
  let hash1 = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash1 ^= input.charCodeAt(i);
    hash1 = Math.imul(hash1, 0x01000193);
  }
  const hex = (hash1 >>> 0).toString(16).padStart(8, '0');
  return `ortho_cache_${hex}`;
}

const memorySessionStore: Record<string, string> = {};

export function saveBalloonSessionState(state: BalloonSessionState): void {
  try {
    const serialized = JSON.stringify(state);
    memorySessionStore[state.fingerprint] = serialized;
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function') {
      localStorage.setItem(state.fingerprint, serialized);
      localStorage.setItem('ortho_latest_session', serialized);
    }
  } catch {}

  try {
    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        electronAPI?: {
          saveSessionFile?: (data: unknown) => void;
        };
        ipcRenderer?: {
          invoke?: (channel: string, ...args: unknown[]) => Promise<unknown>;
        };
      };
      if (typeof win.electronAPI?.saveSessionFile === 'function') {
        win.electronAPI.saveSessionFile(state);
      } else if (typeof win.ipcRenderer?.invoke === 'function') {
        win.ipcRenderer.invoke('ortho:save-session', state);
      }
    }
  } catch {}
}

export function loadBalloonSessionState(fingerprint: string): BalloonSessionState | null {
  try {
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
      const raw = localStorage.getItem(fingerprint);
      if (raw) {
        return JSON.parse(raw) as BalloonSessionState;
      }
    }
  } catch {}
  if (memorySessionStore[fingerprint]) {
    try {
      return JSON.parse(memorySessionStore[fingerprint]) as BalloonSessionState;
    } catch {}
  }
  return null;
}
