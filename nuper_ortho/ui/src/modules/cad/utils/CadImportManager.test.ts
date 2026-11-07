import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  updateCadModalTelemetry,
  safeTriggerCadImport,
  installCadImportInterceptor,
  resetCadImportLock,
} from './CadImportManager';

interface MockEl {
  id: string;
  textContent: string;
  click: () => void;
  addEventListener: (event: string, fn: (e: unknown) => void) => void;
}

describe('CadImportManager', () => {
  const elements = new Map<string, MockEl>();

  beforeEach(() => {
    resetCadImportLock();
    elements.clear();
    const createMockEl = (id: string): MockEl => ({
      id,
      textContent: '',
      click: vi.fn(),
      addEventListener: vi.fn(),
    });

    const mockDoc = {
      getElementById: (id: string) => {
        if (!elements.has(id)) {
          elements.set(id, createMockEl(id));
        }
        return elements.get(id);
      },
      querySelectorAll: () => [],
      querySelector: () => null,
    };

    (global as unknown as { document: typeof mockDoc }).document = mockDoc;
    (global as unknown as { window: unknown }).window = {
      document: mockDoc,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('updateCadModalTelemetry DOM elemanlarını mevcut CAD verisiyle günceller', () => {
    updateCadModalTelemetry({
      name: 'valve_block.step',
      protocol: 'ISO 10303-21 (AP214)',
      bbox: '100.0 x 50.0 x 100.0 mm',
      faces: 14,
      cylinders: 4,
      wallThickness: 'min 4.2 mm (Güvenli)',
    });

    const nameEl = elements.get('cad-stat-name');
    const protoEl = elements.get('cad-stat-protocol');
    const bboxEl = elements.get('cad-stat-bbox');
    const facesEl = elements.get('cad-stat-faces');
    const cylEl = elements.get('cad-stat-cylinders');
    const wallsEl = elements.get('cad-stat-walls');

    expect(nameEl?.textContent).toBe('valve_block.step');
    expect(protoEl?.textContent).toBe('ISO 10303-21 (AP214)');
    expect(bboxEl?.textContent).toBe('100.0 x 50.0 x 100.0 mm');
    expect(facesEl?.textContent).toBe('14 ADVANCED_FACE');
    expect(cylEl?.textContent).toBe('4 Delik');
    expect(wallsEl?.textContent).toBe('min 4.2 mm (Güvenli)');
  });

  it('Electron modunda select-cad-file çağrıldığında asla web input click yapmaz (çift pencereyi önler)', async () => {
    const handleCadDataMock = vi.fn();
    const fileInput = elements.get('step-file-input') || { id: 'step-file-input', textContent: '', click: vi.fn(), addEventListener: vi.fn() };
    elements.set('step-file-input', fileInput);

    const mockIpc = {
      invoke: vi.fn().mockResolvedValue({
        name: 'sample.step',
        ext: 'step',
        dataText: 'ISO-10303-21;',
      }),
    };

    const win = global.window as unknown as {
      electronIpc: typeof mockIpc;
      handleCadData: typeof handleCadDataMock;
    };
    win.electronIpc = mockIpc;
    win.handleCadData = handleCadDataMock;

    await safeTriggerCadImport();

    expect(mockIpc.invoke).toHaveBeenCalledWith('select-cad-file');
    expect(handleCadDataMock).toHaveBeenCalled();
    expect(fileInput.click).not.toHaveBeenCalled();
  });

  it('Electron modunda kullanıcı dosya seçimini iptal ederse fallback yapmaz', async () => {
    const fileInput = { id: 'step-file-input', textContent: '', click: vi.fn(), addEventListener: vi.fn() };
    elements.set('step-file-input', fileInput);

    const mockIpc = {
      invoke: vi.fn().mockResolvedValue(null),
    };

    const win = global.window as unknown as {
      electronIpc: typeof mockIpc;
    };
    win.electronIpc = mockIpc;

    await safeTriggerCadImport();

    expect(mockIpc.invoke).toHaveBeenCalledWith('select-cad-file');
    expect(fileInput.click).not.toHaveBeenCalled();
  });

  it('Web modunda (Electron yokken) hidden file input tetiklenir', async () => {
    const fileInput = { id: 'step-file-input', textContent: '', click: vi.fn(), addEventListener: vi.fn() };
    elements.set('step-file-input', fileInput);

    const win = global.window as unknown as {
      electronIpc?: unknown;
    };
    delete win.electronIpc;

    await safeTriggerCadImport();

    expect(fileInput.click).toHaveBeenCalled();
  });

  it('installCadImportInterceptor global nesneye bağlar ve sahne yönetimini güvene alır', () => {
    installCadImportInterceptor();

    const win = global.window as unknown as {
      updateCadModalTelemetry?: unknown;
      triggerCadImport?: unknown;
      applyUploadedCadToScene?: () => void;
      build3DModelFromStep?: (s: string, f: string) => void;
    };

    expect(typeof win.updateCadModalTelemetry).toBe('function');
    expect(typeof win.triggerCadImport).toBe('function');
    expect(typeof win.applyUploadedCadToScene).toBe('function');
    expect(typeof win.build3DModelFromStep).toBe('function');
  });
});
