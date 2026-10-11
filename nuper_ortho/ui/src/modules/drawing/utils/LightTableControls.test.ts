import { describe, it, expect } from 'vitest';
import {
  LIGHT_TABLE_ZOOM_MIN,
  LIGHT_TABLE_ZOOM_MAX,
  LIGHT_TABLE_ZOOM_RESET,
  LIGHT_TABLE_AUTO_EXTRACT_REASON,
  LIGHT_TABLE_REGION_HINT,
  allocateBalloonId,
  buildLightTableCommands,
  canvasToClient,
  canvasToPage,
  clampZoom,
  clientToCanvas,
  computeFitZoom,
  containTransform,
  formatZoom,
  hitTestBalloons,
  isUsableRegion,
  normalizeRegion,
  pageToCanvas,
  regionSize,
  resolveLightTableShortcut,
  stepPage,
  visibleBalloons,
  zoomBy,
  type LightTableCommandState,
} from './LightTableControls';

const baseState = (overrides: Partial<LightTableCommandState> = {}): LightTableCommandState => ({
  tool: 'select',
  filter: 'all',
  zoom: 1,
  activePage: 1,
  totalPages: 3,
  hasSelection: false,
  hasDocument: true,
  ...overrides,
});

describe('LightTableControls — Işık masası görünüm/gezinme çekirdeği', () => {
  it('clampZoom sınırların dışına taşmayı engeller ve geçersiz değerde başlangıç zoomuna döner', () => {
    expect(clampZoom(0.1)).toBe(LIGHT_TABLE_ZOOM_MIN);
    expect(clampZoom(12)).toBe(LIGHT_TABLE_ZOOM_MAX);
    expect(clampZoom(1.5)).toBe(1.5);
    expect(clampZoom(Number.NaN)).toBe(LIGHT_TABLE_ZOOM_RESET);
    expect(clampZoom(Number.POSITIVE_INFINITY)).toBe(LIGHT_TABLE_ZOOM_RESET);
  });

  it('zoomBy adımlarla yakınlaştırır/uzaklaştırır ve sınırları aşmaz', () => {
    expect(zoomBy(1, 1)).toBe(1.25);
    expect(zoomBy(1, -1)).toBe(0.75);
    expect(zoomBy(LIGHT_TABLE_ZOOM_MAX, 4)).toBe(LIGHT_TABLE_ZOOM_MAX);
    expect(zoomBy(LIGHT_TABLE_ZOOM_MIN, -4)).toBe(LIGHT_TABLE_ZOOM_MIN);
  });

  it('formatZoom yüzde etiketi üretir', () => {
    expect(formatZoom(1)).toBe('100%');
    expect(formatZoom(1.25)).toBe('125%');
    expect(formatZoom(0)).toBe('25%');
  });

  it('stepPage sayfa sınırları içinde kalır', () => {
    expect(stepPage(2, 3, 1)).toBe(3);
    expect(stepPage(3, 3, 1)).toBe(3);
    expect(stepPage(1, 3, -1)).toBe(1);
    expect(stepPage(1, 0, 1)).toBe(1);
  });

  it('computeFitZoom paftayı dolgu payı ile pencereye sığdırır', () => {
    expect(computeFitZoom({ width: 1000, height: 800 }, { width: 400, height: 400 }, 0)).toBe(2);
    expect(computeFitZoom({ width: 1000, height: 800 }, { width: 400, height: 400 }, 50)).toBe(1.75);
    expect(computeFitZoom({ width: 1000, height: 800 }, { width: 500, height: 800 }, 0)).toBe(1);
    expect(computeFitZoom({ width: 10, height: 10 }, { width: 500, height: 800 }, 24)).toBe(LIGHT_TABLE_ZOOM_RESET);
    expect(computeFitZoom({ width: 1000, height: 800 }, { width: 0, height: 800 })).toBe(LIGHT_TABLE_ZOOM_RESET);
  });

  it('containTransform object-fit contain letterbox dönüşümünü hesaplar', () => {
    const transform = containTransform({ left: 0, top: 0, width: 1000, height: 600 }, { width: 800, height: 400 });
    expect(transform.scale).toBe(1.25);
    expect(transform.offsetX).toBe(0);
    expect(transform.offsetY).toBe(50);
    expect(containTransform({ left: 0, top: 0, width: 0, height: 0 }, { width: 800, height: 400 }).scale).toBe(0);
  });

  it('clientToCanvas ve canvasToClient birbirinin tersidir', () => {
    const rect = { left: 100, top: 20, width: 1000, height: 600 };
    const content = { width: 800, height: 400 };
    const canvasPoint = clientToCanvas({ x: 100, y: 70 }, rect, content);
    expect(canvasPoint.x).toBeCloseTo(0, 6);
    expect(canvasPoint.y).toBeCloseTo(0, 6);
    const back = canvasToClient({ x: 400, y: 200 }, rect, content);
    expect(back.x).toBeCloseTo(600, 6);
    expect(back.y).toBeCloseTo(320, 6);
  });

  it('canvasToPage ve pageToCanvas pan/zoom dönüşümünde terstir', () => {
    const pan = { x: 30, y: -10 };
    const page = canvasToPage({ x: 130, y: 90 }, pan, 2);
    expect(page).toEqual({ x: 50, y: 50 });
    expect(pageToCanvas(page, pan, 2)).toEqual({ x: 130, y: 90 });
    expect(canvasToPage({ x: 10, y: 10 }, pan, 0)).toEqual({ x: -20, y: 20 });
  });

  it('hitTestBalloons en yakın balonu yarıçap içinde döndürür', () => {
    const candidates = [
      { id: '1', x: 100, y: 100 },
      { id: '2', x: 140, y: 100 },
    ];
    expect(hitTestBalloons(candidates, { x: 132, y: 100 }, 24)).toBe('2');
    expect(hitTestBalloons(candidates, { x: 300, y: 300 }, 24)).toBeNull();
    expect(hitTestBalloons(candidates, { x: 124, y: 100 }, 24)).toBe('2');
    expect(hitTestBalloons(candidates, { x: 110, y: 100 }, 24)).toBe('1');
  });

  it('normalizeRegion negatif çizimi normalize eder ve kullanılabilirliği ölçer', () => {
    const region = normalizeRegion({ x: 120, y: 90 }, { x: 40, y: 30 });
    expect(region).toEqual({ x0: 40, y0: 30, x1: 120, y1: 90 });
    expect(regionSize(region)).toEqual({ width: 80, height: 60 });
    expect(isUsableRegion(region)).toBe(true);
    expect(isUsableRegion(normalizeRegion({ x: 0, y: 0 }, { x: 3, y: 3 }))).toBe(false);
  });

  it('visibleBalloons görünüm filtresine göre balonları süzer', () => {
    const balloons = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(visibleBalloons(balloons, 'all', '2')).toEqual(balloons);
    expect(visibleBalloons(balloons, 'selected', '2')).toEqual([{ id: 2 }]);
    expect(visibleBalloons(balloons, 'selected', null)).toEqual(balloons);
    expect(visibleBalloons(balloons, 'selected', '9')).toEqual([]);
  });

  it('allocateBalloonId kalıcı kimlik için çakışmayan numara üretir', () => {
    expect(allocateBalloonId([])).toBe(1);
    expect(allocateBalloonId([{ id: 1 }, { id: 3 }, { id: 2 }])).toBe(4);
    expect(allocateBalloonId([{ id: '7' }, { id: 'abc' }, { id: 2 }])).toBe(8);
    expect(allocateBalloonId([{ id: '#12' }, { id: '' }])).toBe(1);
  });

  it('bölge ipucu metni manuel akışı tarif eder', () => {
    expect(LIGHT_TABLE_REGION_HINT.length).toBeGreaterThan(0);
  });

  it('resolveLightTableShortcut yalnız modifier olmayan kısayolları çözer', () => {
    expect(resolveLightTableShortcut('+')).toBe('zoom-in');
    expect(resolveLightTableShortcut('=')).toBe('zoom-in');
    expect(resolveLightTableShortcut('-')).toBe('zoom-out');
    expect(resolveLightTableShortcut('0')).toBe('zoom-reset');
    expect(resolveLightTableShortcut('PageUp')).toBe('page-prev');
    expect(resolveLightTableShortcut('PageDown')).toBe('page-next');
    expect(resolveLightTableShortcut('Escape')).toBe('cancel');
    expect(resolveLightTableShortcut('a')).toBeNull();
    expect(resolveLightTableShortcut('+', { ctrlKey: true })).toBeNull();
    expect(resolveLightTableShortcut('Escape', { metaKey: true })).toBeNull();
  });

  it('buildLightTableCommands araç durumunu ve devre dışı gerekçelerini üretir', () => {
    const commands = buildLightTableCommands(baseState({ tool: 'region' }));
    const byId = new Map(commands.map((command) => [command.id, command]));

    expect(byId.get('tool-region')?.active).toBe(true);
    expect(byId.get('tool-select')?.active).toBe(false);
    expect(byId.get('view-selected')?.enabled).toBe(false);
    expect(byId.get('auto-extract')?.enabled).toBe(false);
    expect(byId.get('auto-extract')?.reason).toBe(LIGHT_TABLE_AUTO_EXTRACT_REASON);
    expect(byId.get('add')?.enabled).toBe(true);
  });

  it('buildLightTableCommands belge yokken eklemeyi gerekçesiyle kapatır ve zoom sınırlarını yansıtır', () => {
    const commands = buildLightTableCommands(
      baseState({ hasDocument: false, zoom: LIGHT_TABLE_ZOOM_MIN, hasSelection: true, filter: 'selected' })
    );
    const byId = new Map(commands.map((command) => [command.id, command]));

    expect(byId.get('add')?.enabled).toBe(false);
    expect(byId.get('add')?.reason).toBeDefined();
    expect(byId.get('zoom-out')?.enabled).toBe(false);
    expect(byId.get('zoom-in')?.enabled).toBe(true);
    expect(byId.get('fit')?.enabled).toBe(false);
    expect(byId.get('view-selected')?.enabled).toBe(true);
    expect(byId.get('view-selected')?.active).toBe(true);
  });
});
