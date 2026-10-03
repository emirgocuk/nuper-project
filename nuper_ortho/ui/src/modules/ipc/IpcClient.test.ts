import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IpcClient } from './IpcClient';
import { MockIpcProvider } from './MockIpcProvider';
import { NuperApp } from '../../main';

describe('Production IPC Wiring & Schema Enforcement (IpcClient)', () => {
  beforeEach(() => {
    MockIpcProvider.initialize();
  });

  it('IpcClient örneği oluşturulabilir ve IPC kullanılabilir durumdadır', () => {
    const client = IpcClient.getInstance();
    expect(client).toBeDefined();
    expect(client.isElectronAvailable()).toBe(true);
  });

  it('selectCadFile çağrısı CadMetadata şemasına uygun veri döner', async () => {
    const client = IpcClient.getInstance();
    const cad = await client.selectCadFile();

    expect(cad).not.toBeNull();
    expect(cad?.name).toBe('164849_aski_kancasi.stp');
    expect(cad?.metadata).toBeDefined();
    expect(cad?.metadata?.file_format).toBe('step');
    expect(cad?.metadata?.bbox.size).toEqual([53.03, 33.25, 32.12]);
  });

  it('extractDrawingData çağrısı DrawingExtractionResult şemasına uygun veri döner', async () => {
    const client = IpcClient.getInstance();
    const result = await client.extractDrawingData('050-164849-000 - Kopya.pdf');

    expect(result).not.toBeNull();
    expect(result?.success).toBe(true);
    expect(result?.filename).toContain('.pdf');
    expect(result?.title_block.part_number).toBe('050-164849-000');
    expect(result?.datums).toContain('A');
    expect(result?.dimensions.length).toBeGreaterThan(0);
    expect(result?.dimensions[0].status).toBe('PASS');
  });

  it('loadBenchmarkSpecimen CAD ve Teknik Resim verilerini senkronize döner', async () => {
    const client = IpcClient.getInstance();
    const suite = await client.loadBenchmarkSpecimen(1);

    expect(suite).not.toBeNull();
    expect(suite?.success).toBe(true);
    expect(suite?.specimen.name).toBe('Aselsan Askı Kancası');
    expect(suite?.cad?.ext).toBe('step');
  });

  it('NuperApp openAndLoadCadFile ve openAndLoadDrawingFile olaylarını bileşenlere bağlar', async () => {
    const app = new NuperApp();
    const cadViewer = app.getCADViewer();
    const drawingCanvas = app.getDrawingCanvas();

    const setModelGeometrySpy = vi.spyOn(cadViewer, 'setModelGeometry');
    const setBalloonsSpy = vi.spyOn(drawingCanvas, 'setBalloons');

    const cad = await app.openAndLoadCadFile();
    expect(cad).not.toBeNull();
    expect(setModelGeometrySpy).toHaveBeenCalled();

    const drawing = await app.openAndLoadDrawingFile();
    expect(drawing).not.toBeNull();
    expect(setBalloonsSpy).toHaveBeenCalled();

    app.destroy();
  });

  it('Pencere kontrol komutları (minimize, maximize, close) sorunsuz tetiklenir', () => {
    const client = IpcClient.getInstance();
    expect(() => {
      client.minimizeWindow();
      client.maximizeWindow();
      client.closeWindow();
    }).not.toThrow();
  });
});
