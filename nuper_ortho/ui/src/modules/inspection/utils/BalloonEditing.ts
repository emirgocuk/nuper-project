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

export type LearningFeedbackEventType =
  | 'FALSE_POSITIVE_BALLOON'
  | 'PARSING_CORRECTION'
  | 'SURFACE_BINDING_POSITIVE'
  | 'UNDO_LAST'
  | 'CLEAR_PART';

export interface LearningFeedbackEvent {
  event_type: LearningFeedbackEventType;
  raw_text?: string;
  bbox?: [number, number, number, number];
  in_table_region?: boolean;
  has_leader_line?: boolean;
  has_extension_line?: boolean;
  relative_page_y?: number;
  is_reference_dimension?: boolean;
  corrected?: {
    type?: string;
    nominal?: number;
    nominal_str?: string;
    upper_tol?: string;
    lower_tol?: string;
  };
  feature_2d?: Record<string, unknown>;
  surface_3d?: Record<string, unknown>;
  part_name?: string;
  timestamp?: number;
}

const recordedFeedbackHistory: LearningFeedbackEvent[] = [];

export function getRecordedFeedbackHistory(): LearningFeedbackEvent[] {
  return recordedFeedbackHistory.slice();
}

export function clearRecordedFeedbackHistory(): void {
  recordedFeedbackHistory.length = 0;
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem('ortho_learning_feedback_history');
    }
  } catch {}
}

interface ElectronFeedbackBridge {
  electronAPI?: {
    recordFeedback?: (payload: LearningFeedbackEvent) => Promise<unknown>;
    undoFeedback?: () => Promise<unknown>;
    resetLearning?: (partHash?: string) => Promise<unknown>;
  };
  electronIpc?: {
    invoke?: (channel: string, ...args: unknown[]) => Promise<unknown>;
  };
  ipcRenderer?: {
    invoke?: (channel: string, ...args: unknown[]) => Promise<unknown>;
  };
}

async function dispatchFeedbackIpc(channel: string, payload?: unknown): Promise<unknown> {
  try {
    if (typeof window === 'undefined') return null;
    const win = window as unknown as ElectronFeedbackBridge;
    if (channel === 'ortho:undo-feedback' && typeof win.electronAPI?.undoFeedback === 'function') {
      return await win.electronAPI.undoFeedback();
    }
    if (channel === 'ortho:reset-learning' && typeof win.electronAPI?.resetLearning === 'function') {
      return await win.electronAPI.resetLearning(typeof payload === 'string' ? payload : undefined);
    }
    if (channel === 'ortho:record-feedback' && typeof win.electronAPI?.recordFeedback === 'function') {
      return await win.electronAPI.recordFeedback(payload as LearningFeedbackEvent);
    }
    if (typeof win.electronIpc?.invoke === 'function') {
      return payload !== undefined
        ? await win.electronIpc.invoke(channel, payload)
        : await win.electronIpc.invoke(channel);
    }
    if (typeof win.ipcRenderer?.invoke === 'function') {
      return payload !== undefined
        ? await win.ipcRenderer.invoke(channel, payload)
        : await win.ipcRenderer.invoke(channel);
    }
  } catch {}
  return null;
}

export async function recordFeedback(event: LearningFeedbackEvent): Promise<unknown> {
  const enriched: LearningFeedbackEvent = {
    ...event,
    timestamp: event.timestamp ?? Date.now(),
  };
  if (event.event_type !== 'UNDO_LAST' && event.event_type !== 'CLEAR_PART') {
    recordedFeedbackHistory.push(enriched);
    if (recordedFeedbackHistory.length > 200) {
      recordedFeedbackHistory.shift();
    }
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem('ortho_learning_feedback_history', JSON.stringify(recordedFeedbackHistory));
      }
    } catch {}
  }

  return await dispatchFeedbackIpc('ortho:record-feedback', enriched);
}

export async function undoLastFeedback(): Promise<unknown> {
  if (recordedFeedbackHistory.length > 0) {
    recordedFeedbackHistory.pop();
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem('ortho_learning_feedback_history', JSON.stringify(recordedFeedbackHistory));
      }
    } catch {}
  }

  const res = await dispatchFeedbackIpc('ortho:undo-feedback');
  if (res !== null) return res;
  return await dispatchFeedbackIpc('ortho:record-feedback', { event_type: 'UNDO_LAST' });
}

export async function resetActiveLearning(partHash: string = '*'): Promise<unknown> {
  clearRecordedFeedbackHistory();
  for (const key of Object.keys(memorySessionStore)) {
    delete memorySessionStore[key];
  }
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem('ortho_latest_session');
      if (typeof localStorage.length === 'number' && typeof localStorage.key === 'function') {
        const toDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('ortho_cache_') || k.startsWith('nuper_balloon_session_v1'))) {
            toDelete.push(k);
          }
        }
        for (const k of toDelete) {
          localStorage.removeItem(k);
        }
      }
    }
  } catch {}

  const res = await dispatchFeedbackIpc('ortho:reset-learning', partHash);
  if (res !== null) return res;
  return await dispatchFeedbackIpc('ortho:record-feedback', { event_type: 'CLEAR_PART', part_name: partHash });
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
