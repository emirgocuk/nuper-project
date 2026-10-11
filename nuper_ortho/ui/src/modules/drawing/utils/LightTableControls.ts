export type LightTableTool = 'pan' | 'select' | 'region';

export type LightTableViewFilter = 'all' | 'selected';

export type LightTableCommandId =
  | 'tool-pan'
  | 'tool-select'
  | 'tool-region'
  | 'add'
  | 'zoom-out'
  | 'zoom-in'
  | 'zoom-reset'
  | 'fit'
  | 'view-all'
  | 'view-selected'
  | 'auto-extract';

export type LightTableAction =
  | 'zoom-in'
  | 'zoom-out'
  | 'zoom-reset'
  | 'page-prev'
  | 'page-next'
  | 'cancel';

export const LIGHT_TABLE_ZOOM_MIN = 0.25;
export const LIGHT_TABLE_ZOOM_MAX = 4;
export const LIGHT_TABLE_ZOOM_STEP = 0.25;
export const LIGHT_TABLE_ZOOM_RESET = 1;
export const LIGHT_TABLE_FIT_PADDING = 24;
export const LIGHT_TABLE_HIT_RADIUS = 24;
export const LIGHT_TABLE_REGION_MIN_SIZE = 8;

export const LIGHT_TABLE_AUTO_EXTRACT_REASON =
  'R0/R1 önkoşulu: güvenilir çıkarım sözleşmesi tamamlanmadan kapalı';
export const LIGHT_TABLE_ADD_REASON = 'Önce bir teknik resim yükleyin';
export const LIGHT_TABLE_REGION_HINT =
  'Manuel kayıt: ölçü/çağrı etrafında kaynak bölgesini sürükleyerek seçin';

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ContainTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface LightTableCommand {
  id: LightTableCommandId;
  label: string;
  enabled: boolean;
  active: boolean;
  reason?: string;
}

export interface LightTableCommandState {
  tool: LightTableTool;
  filter: LightTableViewFilter;
  zoom: number;
  activePage: number;
  totalPages: number;
  hasSelection: boolean;
  hasDocument: boolean;
}

export interface BalloonCandidate {
  id: string;
  x: number;
  y: number;
}

export function clampZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return LIGHT_TABLE_ZOOM_RESET;
  return Math.min(LIGHT_TABLE_ZOOM_MAX, Math.max(LIGHT_TABLE_ZOOM_MIN, zoom));
}

export function zoomBy(zoom: number, steps: number): number {
  const target = zoom + steps * LIGHT_TABLE_ZOOM_STEP;
  return clampZoom(Math.round(target * 100) / 100);
}

export function formatZoom(zoom: number): string {
  return `${Math.round(clampZoom(zoom) * 100)}%`;
}

export function stepPage(page: number, totalPages: number, delta: number): number {
  const safeTotal = Math.max(1, Math.floor(totalPages) || 1);
  const safePage = Math.min(safeTotal, Math.max(1, Math.floor(page) || 1));
  return Math.min(safeTotal, Math.max(1, safePage + delta));
}

export function computeFitZoom(viewport: Size, page: Size, padding: number = LIGHT_TABLE_FIT_PADDING): number {
  const availableWidth = viewport.width - padding * 2;
  const availableHeight = viewport.height - padding * 2;
  if (page.width <= 0 || page.height <= 0 || availableWidth <= 0 || availableHeight <= 0) {
    return LIGHT_TABLE_ZOOM_RESET;
  }
  return clampZoom(Math.min(availableWidth / page.width, availableHeight / page.height));
}

export function containTransform(rect: Rect, content: Size): ContainTransform {
  if (content.width <= 0 || content.height <= 0 || rect.width <= 0 || rect.height <= 0) {
    return { scale: 0, offsetX: 0, offsetY: 0 };
  }
  const scale = Math.min(rect.width / content.width, rect.height / content.height);
  return {
    scale,
    offsetX: (rect.width - content.width * scale) / 2,
    offsetY: (rect.height - content.height * scale) / 2,
  };
}

export function clientToCanvas(client: Point, rect: Rect, content: Size): Point {
  const { scale, offsetX, offsetY } = containTransform(rect, content);
  if (scale <= 0) return { x: 0, y: 0 };
  return {
    x: (client.x - rect.left - offsetX) / scale,
    y: (client.y - rect.top - offsetY) / scale,
  };
}

export function canvasToClient(canvas: Point, rect: Rect, content: Size): Point {
  const { scale, offsetX, offsetY } = containTransform(rect, content);
  return {
    x: rect.left + offsetX + canvas.x * scale,
    y: rect.top + offsetY + canvas.y * scale,
  };
}

export function canvasToPage(canvas: Point, pan: Point, zoom: number): Point {
  const safeZoom = zoom > 0 ? zoom : 1;
  return { x: (canvas.x - pan.x) / safeZoom, y: (canvas.y - pan.y) / safeZoom };
}

export function pageToCanvas(page: Point, pan: Point, zoom: number): Point {
  const safeZoom = zoom > 0 ? zoom : 1;
  return { x: page.x * safeZoom + pan.x, y: page.y * safeZoom + pan.y };
}

export function normalizeRegion(a: Point, b: Point): BBox {
  return {
    x0: Math.min(a.x, b.x),
    y0: Math.min(a.y, b.y),
    x1: Math.max(a.x, b.x),
    y1: Math.max(a.y, b.y),
  };
}

export function regionSize(region: BBox): Size {
  return { width: region.x1 - region.x0, height: region.y1 - region.y0 };
}

export function isUsableRegion(region: BBox, minSize: number = LIGHT_TABLE_REGION_MIN_SIZE): boolean {
  const size = regionSize(region);
  return size.width >= minSize && size.height >= minSize;
}

export function hitTestBalloons(
  candidates: BalloonCandidate[],
  point: Point,
  radius: number = LIGHT_TABLE_HIT_RADIUS
): string | null {
  let bestId: string | null = null;
  let bestDistance = Infinity;
  for (const candidate of candidates) {
    const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);
    if (distance <= radius && distance < bestDistance) {
      bestDistance = distance;
      bestId = candidate.id;
    }
  }
  return bestId;
}

export function visibleBalloons<T extends { id: string | number }>(
  balloons: T[],
  filter: LightTableViewFilter,
  selectedId: string | null
): T[] {
  if (filter === 'selected' && selectedId !== null) {
    return balloons.filter((balloon) => String(balloon.id) === selectedId);
  }
  return balloons;
}

export function allocateBalloonId(balloons: ReadonlyArray<{ id: string | number }>): number {
  let maxId = 0;
  for (const balloon of balloons) {
    const value = Number(balloon.id);
    if (Number.isFinite(value) && value > maxId) {
      maxId = value;
    }
  }
  return Math.floor(maxId) + 1;
}

export function resolveLightTableShortcut(
  key: string,
  modifiers: { ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean } = {}
): LightTableAction | null {
  if (modifiers.ctrlKey || modifiers.metaKey || modifiers.altKey) return null;
  switch (key) {
    case '+':
    case '=':
    case 'Add':
      return 'zoom-in';
    case '-':
    case '_':
    case 'Subtract':
      return 'zoom-out';
    case '0':
      return 'zoom-reset';
    case 'PageUp':
      return 'page-prev';
    case 'PageDown':
      return 'page-next';
    case 'Escape':
      return 'cancel';
    default:
      return null;
  }
}

export function buildLightTableCommands(state: LightTableCommandState): LightTableCommand[] {
  return [
    { id: 'tool-pan', label: 'El', enabled: true, active: state.tool === 'pan' },
    { id: 'tool-select', label: 'Seç', enabled: true, active: state.tool === 'select' },
    { id: 'tool-region', label: 'Bölge Seç', enabled: true, active: state.tool === 'region' },
    {
      id: 'add',
      label: '＋ Unsur Ekle',
      enabled: state.hasDocument,
      active: false,
      reason: state.hasDocument ? undefined : LIGHT_TABLE_ADD_REASON,
    },
    { id: 'zoom-out', label: '🔍 −', enabled: state.zoom > LIGHT_TABLE_ZOOM_MIN, active: false },
    { id: 'zoom-in', label: '🔍 ＋', enabled: state.zoom < LIGHT_TABLE_ZOOM_MAX, active: false },
    { id: 'zoom-reset', label: '100%', enabled: true, active: false },
    { id: 'fit', label: 'Sığdır', enabled: state.hasDocument, active: false },
    { id: 'view-all', label: 'Tüm Balonlar', enabled: true, active: state.filter === 'all' },
    {
      id: 'view-selected',
      label: 'Yalnız Seçili',
      enabled: state.hasSelection,
      active: state.filter === 'selected',
    },
    {
      id: 'auto-extract',
      label: 'Otomatik Çıkar',
      enabled: false,
      active: false,
      reason: LIGHT_TABLE_AUTO_EXTRACT_REASON,
    },
  ];
}
