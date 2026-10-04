import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  FeatureDefinitionModal,
  type DefinedFeatureData,
} from './FeatureDefinitionModal';

class MockStyle {
  private props: Record<string, string> = {};
  public setProperty(k: string, v: string): void { this.props[k] = v; }
  public getPropertyValue(k: string): string { return this.props[k] || ''; }
  get display(): string { return this.props['display'] || ''; }
  set display(v: string) { this.props['display'] = v; }
  get position(): string { return this.props['position'] || ''; }
  set position(v: string) { this.props['position'] = v; }
  get left(): string { return this.props['left'] || ''; }
  set left(v: string) { this.props['left'] = v; }
  get top(): string { return this.props['top'] || ''; }
  set top(v: string) { this.props['top'] = v; }
}

class MockElement {
  public tagName: string;
  public id: string = '';
  public style: MockStyle = new MockStyle();
  private _innerHTML: string = '';
  public innerText: string = '';
  public value: string = '';
  public children: MockElement[] = [];
  public parentElement: MockElement | null = null;
  public attributes: Record<string, string> = {};
  public selectionStart: number = 0;
  private listeners: Record<string, Array<(e?: unknown) => void>> = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  get innerHTML(): string {
    return this._innerHTML;
  }
  set innerHTML(html: string) {
    this._innerHTML = html;
    this.children = [];
    const idRegex = /<([a-zA-Z0-9]+)[^>]*id=["']([^"']+)["'][^>]*>/g;
    let match;
    while ((match = idRegex.exec(html)) !== null) {
      const tag = match[1];
      const elId = match[2];
      const child = new MockElement(tag);
      child.id = elId;
      this.appendChild(child);
    }
  }

  get textContent(): string {
    if (this.innerText) return this.innerText;
    if (this._innerHTML) {
      return this._innerHTML.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    return this.children.map((c) => c.textContent).join(' ');
  }
  set textContent(v: string) {
    this.innerText = v;
  }

  get parentNode(): MockElement | null {
    return this.parentElement;
  }

  public appendChild(child: MockElement): void {
    child.parentElement = this;
    this.children.push(child);
  }

  public removeChild(child: MockElement): void {
    this.children = this.children.filter((c) => c !== child);
    child.parentElement = null;
  }

  public setAttribute(k: string, v: string): void {
    this.attributes[k] = v;
    if (k === 'id') this.id = v;
  }

  public getAttribute(k: string): string | null {
    if (k === 'id') return this.id || null;
    return this.attributes[k] ?? null;
  }

  public addEventListener(ev: string, fn: (e?: unknown) => void): void {
    if (!this.listeners[ev]) this.listeners[ev] = [];
    this.listeners[ev].push(fn);
  }

  public click(): void {
    if (this.listeners['click']) {
      this.listeners['click'].forEach((fn) => fn({ stopPropagation: () => {} }));
    }
  }

  public dispatchEvent(ev: { type: string }): void {
    if (this.listeners[ev.type]) {
      this.listeners[ev.type].forEach((fn) => fn({ preventDefault: () => {} }));
    }
  }

  public focus(): void {}
  public select(): void {}
  public setSelectionRange(s: number): void { this.selectionStart = s; }

  public querySelector(sel: string): MockElement | null {
    return this.querySelectorAll(sel)[0] || null;
  }

  public querySelectorAll(sel: string): MockElement[] {
    const matches: MockElement[] = [];
    const check = (el: MockElement): boolean => {
      if (sel.startsWith('#')) return el.id === sel.slice(1);
      if (sel.startsWith('.')) return el.attributes['class']?.includes(sel.slice(1)) || false;
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
  public createElement(tag: string): MockElement {
    return new MockElement(tag);
  }
  public getElementById(id: string): MockElement | null {
    return this.body.querySelector(`#${id}`);
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
  (globalThis as unknown as { HTMLSelectElement: unknown }).HTMLSelectElement = MockElement;
  (globalThis as unknown as { HTMLFormElement: unknown }).HTMLFormElement = MockElement;
  (globalThis as unknown as { Event: unknown }).Event = class { constructor(public type: string) {} };
  (globalThis as unknown as { window: unknown }).window = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

describe('FeatureDefinitionModal — İnteraktif Unsur Tanımlama ve Sağ Tık Menüsü', () => {
  let modalManager: FeatureDefinitionModal;

  beforeEach(() => {
    mockDoc.body.children = [];
    modalManager = FeatureDefinitionModal.getInstance();
  });

  afterEach(() => {
    modalManager.closeModal();
    modalManager.hideContextMenu();
    mockDoc.body.children = [];
  });

  it('Teknik resim çağrılarını akıllıca ayrıştırır (parseCallout)', () => {
    // Çap (Ø) ve tolerans
    const dia = modalManager.parseCallout('Ø86 ±0.5');
    expect(dia.type).toBe('DIAMETER');
    expect(dia.nominal).toBe(86);
    expect(dia.upper_tol).toBe('+0.5');
    expect(dia.lower_tol).toBe('-0.5');

    // OCR'den @ gelirse de Ø olarak düzeltir
    const diaAt = modalManager.parseCallout('@117.5');
    expect(diaAt.type).toBe('DIAMETER');
    expect(diaAt.nominal).toBe(117.5);

    // Radyus (R)
    const rad = modalManager.parseCallout('R3');
    expect(rad.type).toBe('RADIUS');
    expect(rad.nominal).toBe(3);

    // Pah (Chamfer)
    const chamfer = modalManager.parseCallout('3 x45°');
    expect(chamfer.type).toBe('CHAMFER');
    expect(chamfer.nominal).toBe(3);

    // Açı (Angle)
    const angle = modalManager.parseCallout('66.1°');
    expect(angle.type).toBe('ANGLE');
    expect(angle.nominal).toBe(66.1);

    // Referans ölçü (Parantez içi)
    const ref = modalManager.parseCallout('(291.9)');
    expect(ref.type).toBe('LINEAR');
    expect(ref.nominal).toBe(291.9);

    // Standart doğrusal
    const lin = modalManager.parseCallout('146');
    expect(lin.type).toBe('LINEAR');
    expect(lin.nominal).toBe(146);
  });

  it('Sağ tık bağlam menüsünü DOM üzerine yerleştirir ve yeni ekleme tıklandığında onAdd tetikler', () => {
    const onAddSpy = vi.fn();

    modalManager.showContextMenu({
      clientX: 250,
      clientY: 300,
      canvasX: 420,
      canvasY: 180,
      page: 1,
      onAdd: onAddSpy,
    });

    const menu = mockDoc.getElementById('nuper-canvas-context-menu');
    expect(menu).not.toBeNull();
    expect(menu?.textContent).toContain('Buraya Yeni Ölçü / Unsur Ekle');

    const addBtn = Array.from(menu!.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Buraya Yeni Ölçü / Unsur Ekle')
    );
    expect(addBtn).toBeDefined();
    addBtn?.click();

    expect(onAddSpy).toHaveBeenCalledWith({ x: 420, y: 180, page: 1 });
    expect(mockDoc.getElementById('nuper-canvas-context-menu')).toBeNull();
  });

  it('Var olan unsur tıklandığında Düzenle ve Kaldır seçenekleri sunar', () => {
    const onEditSpy = vi.fn();
    const onDeleteSpy = vi.fn();

    modalManager.showContextMenu({
      clientX: 100,
      clientY: 100,
      canvasX: 200,
      canvasY: 200,
      page: 2,
      existingItem: { id: 5, balloon: '#5', nominal_str: 'Ø86 ±0.5' },
      onAdd: vi.fn(),
      onEdit: onEditSpy,
      onDelete: onDeleteSpy,
    });

    const menu = mockDoc.getElementById('nuper-canvas-context-menu');
    expect(menu?.textContent).toContain('Unsuru Düzenle (#5)');
    expect(menu?.textContent).toContain('Unsuru Kaldır (#5)');

    const editBtn = Array.from(menu!.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Unsuru Düzenle')
    );
    editBtn?.click();
    expect(onEditSpy).toHaveBeenCalledWith(5);
  });

  it('Unsur tanımlama modali açılır ve form gönderildiğinde onSave callbacki çalışır', () => {
    let savedData: DefinedFeatureData | null = null;

    modalManager.openModal({
      canvasX: 350,
      canvasY: 210,
      page: 1,
      nextId: 13,
      onSave: (data) => {
        savedData = data;
      },
    });

    const modal = mockDoc.getElementById('modal-feature-definition');
    expect(modal).not.toBeNull();
    expect(modal?.textContent).toContain('Yeni Metroloji Unsuru / Ölçü Tanımla');

    const nomStrInput = modal!.querySelector('#feat-nom-str');
    const nomInput = modal!.querySelector('#feat-nominal');
    const upperInput = modal!.querySelector('#feat-upper-tol');
    const lowerInput = modal!.querySelector('#feat-lower-tol');
    const form = modal!.querySelector('#feature-modal-form');

    expect(nomStrInput).not.toBeNull();
    if (nomStrInput) nomStrInput.value = 'Ø117.5';
    if (nomInput) nomInput.value = '117.5';
    if (upperInput) upperInput.value = '+0.200';
    if (lowerInput) lowerInput.value = '-0.200';

    form?.dispatchEvent(new (globalThis as unknown as { Event: new (t: string) => { type: string } }).Event('submit'));

    expect(savedData).not.toBeNull();
    const result = savedData as unknown as DefinedFeatureData;
    expect(result.id).toBe(13);
    expect(result.nominal).toBe(117.5);
    expect(result.nominal_str).toBe('Ø117.5');
    expect(result.upper_tol).toBe('+0.200');
    expect(result.lower_tol).toBe('-0.200');
    expect(result.type).toBe('DIAMETER');
    expect(result.x).toBe(350);
    expect(result.y).toBe(210);

    expect(mockDoc.getElementById('modal-feature-definition')).toBeNull();
  });
});
