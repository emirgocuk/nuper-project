import { describe, it, expect, vi } from 'vitest';
import { MockIpcProvider } from './MockIpcProvider';
import type { DrawingExtractionResult } from '../../types/generated/drawing_data';
import type { CadMetadata } from '../../types/generated/cad_metadata';

describe('Mock IPC Sağlayıcısı ve İzole UI Geliştirme (FAZ 4 / Kural 1 & 4)', () => {
  it('Mock modunda IPC çağrılarını yakalar ve şemaya uygun veri döner', async () => {
    MockIpcProvider.initialize();

    const win = (typeof window !== 'undefined' ? window : globalThis) as unknown as {
      ipcRenderer: { invoke: (ch: string, ...args: unknown[]) => Promise<unknown> };
    };

    expect(win.ipcRenderer).toBeDefined();

    // 1. Benchmark catalog
    const catalog = await win.ipcRenderer.invoke('get-benchmark-catalog') as { success: boolean; totalCount: number; specimens: unknown[] };
    expect(catalog.success).toBe(true);
    expect(catalog.totalCount).toBe(12);
    expect(catalog.specimens.length).toBe(2);

    // 2. Drawing extraction schema validation
    const drawing = await win.ipcRenderer.invoke('extract-drawing-data') as DrawingExtractionResult;
    expect(drawing.success).toBe(true);
    expect(drawing.filename).toBe('050-164849-000 - Kopya.pdf');
    expect(drawing.title_block.material).toBe('SAE 4340 Çelik');
    expect(drawing.datums).toContain('A');
    expect(drawing.dimensions.length).toBe(3);
    expect(drawing.dimensions[0].nominal).toBe(20.0);
    expect(drawing.dimensions[0].status).toBe('PASS');

    // 3. CAD metadata schema validation
    const cad = await win.ipcRenderer.invoke('select-cad-file') as CadMetadata;
    expect(cad.model_name).toBe('164849_aski_kancasi.stp');
    expect(cad.file_format).toBe('step');
    expect(cad.vertex_count).toBe(2325);
    expect(cad.triangle_count).toBe(775);
    expect(cad.bbox.size).toEqual([53.03, 33.25, 32.12]);
    expect(cad.alignment?.base_plane_detected).toBe(true);

    // 4. Load benchmark specimen
    const specimenRes = await win.ipcRenderer.invoke('load-benchmark-specimen') as { success: boolean; cad: { ext: string }; drawing: { ext: string } };
    expect(specimenRes.success).toBe(true);
    expect(specimenRes.cad.ext).toBe('step');
    expect(specimenRes.drawing.ext).toBe('pdf');

    // 5. Bilinmeyen kanal çağrısı null döner
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const unknownRes = await win.ipcRenderer.invoke('unknown-channel');
    expect(unknownRes).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
