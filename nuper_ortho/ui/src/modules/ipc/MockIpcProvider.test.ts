import { describe, it, expect } from 'vitest';
import { MockIpcProvider } from './MockIpcProvider';
import type { DrawingExtractionResult } from '../../types/generated/drawing_data';

describe('Mock IPC Sağlayıcısı ve İzole UI Geliştirme (Kural 1 & 4)', () => {
  it('Mock modunda IPC çağrılarını yakalar ve şemaya uygun veri döner', async () => {
    MockIpcProvider.initialize();

    const win = (typeof window !== 'undefined' ? window : globalThis) as unknown as {
      ipcRenderer: { invoke: (ch: string, ...args: unknown[]) => Promise<unknown> };
    };

    expect(win.ipcRenderer).toBeDefined();

    // 1. Benchmark catalog
    const catalog = await win.ipcRenderer.invoke('get-benchmark-catalog') as { success: boolean; totalCount: number };
    expect(catalog.success).toBe(true);
    expect(catalog.totalCount).toBe(12);

    // 2. Drawing extraction schema validation
    const drawing = await win.ipcRenderer.invoke('extract-drawing-data') as DrawingExtractionResult;
    expect(drawing.success).toBe(true);
    expect(drawing.filename).toBe('050-164849-000 - Kopya.pdf');
    expect(drawing.title_block.material).toBe('SAE 4340 Çelik');
    expect(drawing.datums).toContain('A');
    expect(drawing.dimensions.length).toBeGreaterThan(0);
    expect(drawing.dimensions[0].nominal).toBe(20.0);
    expect(drawing.dimensions[0].status).toBe('PASS');
  });
});
