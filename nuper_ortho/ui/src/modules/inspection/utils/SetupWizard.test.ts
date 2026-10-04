import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SetupWizard } from './SetupWizard';

class MockStyle {
  private props: Record<string, string> = {};

  public setProperty(k: string, v: string): void {
    this.props[k] = v;
  }

  public getPropertyValue(k: string): string {
    return this.props[k] || '';
  }

  get display(): string {
    return this.props['display'] || '';
  }
  set display(v: string) {
    this.props['display'] = v;
  }

  get transform(): string {
    return this.props['transform'] || '';
  }
  set transform(v: string) {
    this.props['transform'] = v;
  }

  get width(): string {
    return this.props['width'] || '';
  }
  set width(v: string) {
    this.props['width'] = v;
  }

  get gridTemplateColumns(): string {
    return this.props['grid-template-columns'] || '';
  }
  set gridTemplateColumns(v: string) {
    this.props['grid-template-columns'] = v;
  }
}

class MockClassList {
  private classes = new Set<string>();

  constructor(initial = '') {
    initial.split(' ').filter(Boolean).forEach((c) => this.classes.add(c));
  }

  public add(...tokens: string[]): void {
    tokens.forEach((t) => this.classes.add(t));
  }

  public remove(...tokens: string[]): void {
    tokens.forEach((t) => this.classes.delete(t));
  }

  public contains(token: string): boolean {
    return this.classes.has(token);
  }

  public toString(): string {
    return Array.from(this.classes).join(' ');
  }
}

class MockElement {
  public tagName: string;
  public id: string = '';
  public classList: MockClassList = new MockClassList();
  public style: MockStyle = new MockStyle();
  public innerHTML: string = '';
  public innerText: string = '';
  public value: string = '';
  public children: MockElement[] = [];
  public parentElement: MockElement | null = null;
  public attributes: Record<string, string> = {};
  public onclick: ((e: unknown) => void) | null = null;
  private listeners: Record<string, Array<(e?: unknown) => void>> = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  get className(): string {
    return this.classList.toString();
  }
  set className(v: string) {
    this.classList = new MockClassList(v);
  }

  get textContent(): string {
    return this.innerText;
  }
  set textContent(v: string) {
    this.innerText = v;
  }

  public appendChild(child: MockElement): void {
    child.parentElement = this;
    this.children.push(child);
  }

  public setAttribute(k: string, v: string): void {
    this.attributes[k] = v;
    if (k === 'id') this.id = v;
    if (k === 'class') this.className = v;
  }

  public getAttribute(k: string): string | null {
    if (k === 'id') return this.id || null;
    if (k === 'class') return this.className || null;
    return this.attributes[k] ?? null;
  }

  public addEventListener(ev: string, fn: (e?: unknown) => void): void {
    if (!this.listeners[ev]) this.listeners[ev] = [];
    this.listeners[ev].push(fn);
  }

  public click(): void {
    if (this.onclick) this.onclick({});
    if (this.listeners['click']) {
      this.listeners['click'].forEach((fn) => fn({}));
    }
  }

  public remove(): void {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter((c) => c !== this);
      this.parentElement = null;
    }
  }

  public querySelector(sel: string): MockElement | null {
    return this.querySelectorAll(sel)[0] || null;
  }

  public querySelectorAll(sel: string): MockElement[] {
    const matches: MockElement[] = [];

    const check = (el: MockElement): boolean => {
      if (sel.startsWith('#')) {
        return el.id === sel.slice(1);
      }
      if (sel.startsWith('.')) {
        return el.classList.contains(sel.slice(1));
      }
      if (sel.startsWith('[')) {
        const attrMatch = sel.match(/\[([a-zA-Z0-9_-]+)(?:="?([^"\]]*)"?)?\]/);
        if (attrMatch) {
          const attr = attrMatch[1];
          const val = attrMatch[2];
          if (val === undefined) return el.getAttribute(attr) !== null;
          return el.getAttribute(attr) === val;
        }
      }
      return el.tagName.toLowerCase() === sel.toLowerCase();
    };

    const walk = (el: MockElement) => {
      for (const child of el.children) {
        if (check(child)) matches.push(child);
        walk(child);
      }
    };

    walk(this);
    return matches;
  }
}

class MockDocument {
  public body = new MockElement('BODY');
  public head = new MockElement('HEAD');
  private elementRegistry = new Map<string, MockElement>();

  public createElement(tag: string): MockElement {
    return new MockElement(tag);
  }

  public register(id: string, el: MockElement): void {
    el.id = id;
    this.elementRegistry.set(id, el);
  }

  public getElementById(id: string): MockElement | null {
    if (this.elementRegistry.has(id)) {
      return this.elementRegistry.get(id)!;
    }
    const fromBody = this.body.querySelector(`#${id}`);
    if (fromBody) return fromBody;
    const fromHead = this.head.querySelector(`#${id}`);
    if (fromHead) return fromHead;
    return null;
  }

  public querySelector(sel: string): MockElement | null {
    return this.body.querySelector(sel);
  }

  public querySelectorAll(sel: string): MockElement[] {
    return this.body.querySelectorAll(sel);
  }
}

const mockDoc = new MockDocument();

if (typeof (globalThis as unknown as { document?: unknown }).document === 'undefined') {
  (globalThis as unknown as { document: unknown }).document = mockDoc;
  (globalThis as unknown as { HTMLElement: unknown }).HTMLElement = MockElement;
  (globalThis as unknown as { HTMLInputElement: unknown }).HTMLInputElement = MockElement;
  (globalThis as unknown as { Event: unknown }).Event = class {
    constructor(public type: string) {}
  };
  (globalThis as unknown as { window: unknown }).window = {
    dispatchEvent: () => true,
    addEventListener: () => {},
  };
}

describe('SetupWizard — Sıfır Durum ve Beyaz Temalı Işık Masası Modalı', () => {
  let wizard: SetupWizard;

  beforeEach(() => {
    mockDoc.body.children = [];
    mockDoc.head.children = [];

    const mainWorkspace = new MockElement('div');
    mainWorkspace.className = 'main-workspace';

    const sidebarLeft = new MockElement('aside');
    sidebarLeft.className = 'sidebar-left';
    const tabBar = new MockElement('div');
    tabBar.className = 'sidebar-tab-bar';
    const treeScroll = new MockElement('div');
    treeScroll.className = 'tree-scroll';
    const drawScroll = new MockElement('div');
    drawScroll.id = 'sidebar-drawing-scroll';
    sidebarLeft.appendChild(tabBar);
    sidebarLeft.appendChild(treeScroll);
    sidebarLeft.appendChild(drawScroll);

    const centerWorkspace = new MockElement('main');
    centerWorkspace.className = 'center-workspace';

    const pane2d = new MockElement('section');
    pane2d.id = 'dual-canvas-2d';
    pane2d.className = 'canvas-2d-pane active';
    pane2d.style.display = 'flex';

    const cadViewport = new MockElement('section');
    cadViewport.id = 'cad-viewport';
    cadViewport.className = 'viewport-3d-pane';

    const hudName = new MockElement('div');
    hudName.id = 'hud-feature-name';
    const hudCoords = new MockElement('div');
    hudCoords.id = 'hud-feature-coords';
    const hudDetails = new MockElement('div');
    hudDetails.id = 'hud-feature-details';
    cadViewport.appendChild(hudName);
    cadViewport.appendChild(hudCoords);
    cadViewport.appendChild(hudDetails);

    centerWorkspace.appendChild(pane2d);
    centerWorkspace.appendChild(cadViewport);

    const sidebarRight = new MockElement('aside');
    sidebarRight.className = 'sidebar-right';

    mainWorkspace.appendChild(sidebarLeft);
    mainWorkspace.appendChild(centerWorkspace);
    mainWorkspace.appendChild(sidebarRight);
    mockDoc.body.appendChild(mainWorkspace);

    const timeDisplay = new MockElement('span');
    timeDisplay.id = 'time-display';
    timeDisplay.innerText = '00:00 / 00:34';
    mockDoc.body.appendChild(timeDisplay);

    const diagBadge = new MockElement('span');
    diagBadge.id = 'diag-badge-status';
    diagBadge.innerText = '0 Çarpışma';
    mockDoc.body.appendChild(diagBadge);

    const diagContent = new MockElement('div');
    diagContent.id = 'diag-content';
    mockDoc.body.appendChild(diagContent);

    const fileInput = new MockElement('input');
    fileInput.id = 'drawing-file-input';
    mockDoc.body.appendChild(fileInput);

    const ribbonBtnDual = new MockElement('button');
    ribbonBtnDual.id = 'ribbon-btn-dual';
    ribbonBtnDual.className = 'ribbon-btn active primary';
    const ribbonLabel = new MockElement('span');
    ribbonLabel.className = 'ribbon-label';
    ribbonLabel.innerText = '✓ Çift Kanvas';
    ribbonBtnDual.appendChild(ribbonLabel);
    mockDoc.body.appendChild(ribbonBtnDual);

    mockDoc.register('dual-canvas-2d', pane2d);
    mockDoc.register('cad-viewport', cadViewport);
    mockDoc.register('sidebar-drawing-scroll', drawScroll);
    mockDoc.register('hud-feature-name', hudName);
    mockDoc.register('hud-feature-coords', hudCoords);
    mockDoc.register('hud-feature-details', hudDetails);
    mockDoc.register('ribbon-btn-dual', ribbonBtnDual);
    mockDoc.register('time-display', timeDisplay);
    mockDoc.register('diag-badge-status', diagBadge);
    mockDoc.register('diag-content', diagContent);
    mockDoc.register('drawing-file-input', fileInput);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    wizard?.destroy();
  });

  it('Açılışta otomatik mock verisi yüklenmez; temiz sıfır durum (clean slate) ile açılır', () => {
    wizard = new SetupWizard();
    wizard.startWorkflow();

    expect(wizard.getDimensions().length).toBe(0);
    expect(wizard.isPlanConfirmed()).toBe(false);

    const cleanPanel = mockDoc.getElementById('clean-features-panel');
    expect(cleanPanel).not.toBeNull();
    expect(cleanPanel?.innerHTML).toContain('Yüklü Ölçüm Planı Yok');
    expect(cleanPanel?.innerHTML).toContain('Lütfen STEP ve Teknik Resim yükleyin');

    const timeDisplay = mockDoc.getElementById('time-display');
    expect(timeDisplay?.innerText).toBe('--:--');

    const diagBadge = mockDoc.getElementById('diag-badge-status');
    expect(diagBadge?.innerText).toBe('--:--');

    const pane2d = mockDoc.getElementById('dual-canvas-2d');
    expect(pane2d?.style.display).toBe('none');

    const center = mockDoc.querySelector('.center-workspace') as MockElement;
    expect(center.style.gridTemplateColumns).toBe('1fr');
  });

  it('"Teknik Resim" tıklandığında sol üstte dosya yükle ve sol kenar çubuğunda sayfalar olan Işık Masası açılır', () => {
    wizard = new SetupWizard();
    wizard.handleTeknikResimClick();

    expect(wizard.isDrawingAuditOpen()).toBe(true);

    const modalEl = mockDoc.getElementById('modal-drawing-audit');
    expect(modalEl).not.toBeNull();
    expect(modalEl?.style.display).toBe('flex');
    expect(modalEl?.innerHTML).toContain('Nuper Drawing Inspector / 2D Metroloji Işık Masası');
    expect(modalEl?.innerHTML).toContain('✓ Onayla ve Ölçüm Planına Aktar');
    expect(modalEl?.innerHTML).toContain('btn-audit-upload-file');
    expect(modalEl?.innerHTML).toContain('nuper-audit-pages-sidebar');
    expect(modalEl?.innerHTML).toContain('Sayfa 1');
  });

  it('Işık Masasında mouse tekerleğiyle Zoom In/Out (0.5x - 3.0x) ve Pan yapılır', () => {
    wizard = new SetupWizard();
    wizard.handleTeknikResimClick();
    wizard.loadDrawingSample();

    const stage = new MockElement('div');
    stage.id = 'audit-canvas-stage';
    mockDoc.register('audit-canvas-stage', stage);

    wizard.setZoom(1.8);
    expect(wizard.getZoom()).toBe(1.8);
    expect(stage.style.transform).toContain('scale(1.8)');

    wizard.setZoom(0.3);
    expect(wizard.getZoom()).toBe(0.5);

    wizard.setZoom(5.0);
    expect(wizard.getZoom()).toBe(3.0);

    wizard.setPan(150, -60);
    expect(wizard.getPan()).toEqual({ x: 150, y: -60 });
    expect(stage.style.transform).toContain('translate(150px, -60px)');
  });

  it('Sayfalar arasında geçiş yapıldığında ilgili teknik resim ve balonlar güncellenir', () => {
    wizard = new SetupWizard();
    wizard.handleTeknikResimClick();
    wizard.loadDrawingSample();

    wizard.setActivePage(2);
    expect(wizard.getActivePage()).toBe(2);
    let modalEl = mockDoc.getElementById('modal-drawing-audit');
    expect(modalEl?.innerHTML).toContain('395.5 ±0.800 mm');

    wizard.setActivePage(3);
    expect(wizard.getActivePage()).toBe(3);
    modalEl = mockDoc.getElementById('modal-drawing-audit');
    expect(modalEl?.innerHTML).toContain('DETAY M');
    expect(modalEl?.innerHTML).toContain('KESIT G-G');

    wizard.setActivePage(1);
    expect(wizard.getActivePage()).toBe(1);
    modalEl = mockDoc.getElementById('modal-drawing-audit');
    expect(modalEl?.innerHTML).toContain('DATUM [A] TABAN TEMAS DÜZLEMİ');
  });

  it('"Onayla ve Ölçüm Planına Aktar" butonuna basıldığında modal kapanır ve ölçüler sol panele aktarılır', () => {
    wizard = new SetupWizard();
    wizard.handleTeknikResimClick();
    expect(wizard.isDrawingAuditOpen()).toBe(true);

    wizard.confirmAndTransferPlan();
    expect(wizard.isDrawingAuditOpen()).toBe(false);
    expect(wizard.isPlanConfirmed()).toBe(true);

    const modalEl = mockDoc.getElementById('modal-drawing-audit');
    expect(modalEl?.style.display).toBe('none');

    const cleanPanel = mockDoc.getElementById('clean-features-panel');
    expect(cleanPanel?.innerHTML).toContain('ÖLÇÜLECEK ÖZELLİKLER');
    expect(cleanPanel?.innerHTML).toContain('12 Unsur');
    expect(cleanPanel?.innerHTML).toContain('clean-feature-item');
    expect(cleanPanel?.innerHTML).toContain('395.5');

    const timeDisplay = mockDoc.getElementById('time-display');
    expect(timeDisplay?.innerText).toBe('00:00 / 00:34');
  });
});
