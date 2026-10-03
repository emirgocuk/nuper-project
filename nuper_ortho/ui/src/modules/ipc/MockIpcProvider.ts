import type { DrawingExtractionResult } from '../../types/generated/drawing_data';
import type { CadMetadata } from '../../types/generated/cad_metadata';

/**
 * Nuper Ortho — Mock IPC Sağlayıcısı
 * Kural 1 & 3 gereği: Standart web tarayıcısında Electron veya Python olmadan
 * 1 saniyede açılan izole UI geliştirme ve Playwright test modu sağlar.
 */
export class MockIpcProvider {
  private static isInitialized = false;

  public static isMockMode(): boolean {
    if (typeof window === 'undefined') return true;
    const urlParams = new URLSearchParams(window.location.search);
    const hasMockParam = urlParams.has('mock');
    const hasNoElectron = !('require' in window);
    return hasMockParam || hasNoElectron;
  }

  public static initialize(): void {
    if (this.isInitialized || !this.isMockMode()) return;
    this.isInitialized = true;

    console.log('⚡ Nuper Ortho Mock IPC Modu Aktif (Electron/Python bağımsız hızlı geliştirme)');

    const mockHandlers: Record<string, (...args: unknown[]) => Promise<unknown>> = {
      'get-benchmark-catalog': async () => ({
        success: true,
        totalCount: 12,
        specimens: [
          {
            specimen_index: 1,
            specimen_id: 'flagship_aski_kancasi',
            name: 'Aselsan Askı Kancası',
            category: 'Yapısal / Havacılık Kancası',
            cad_file: '164849_aski_kancasi.stp',
            drawing_file: '050-164849-000 - Kopya.pdf'
          },
          {
            specimen_index: 2,
            specimen_id: 'flagship_dacp_avionic',
            name: 'DACP Avionic Panel 2. Üretim',
            category: 'Aviyonik Şase / Panel',
            cad_file: 'DACP_Avionic_Panel.stp',
            drawing_file: 'DACP_Avionic_Panel.pdf'
          }
        ]
      }),

      'extract-drawing-data': async (): Promise<DrawingExtractionResult> => ({
        success: true,
        filename: '050-164849-000 - Kopya.pdf',
        page_count: 1,
        raw_text_length: 1420,
        title_block: {
          part_number: '050-164849-000',
          drawing_number: '050-164849-000',
          material: 'SAE 4340 Çelik',
          hardness: '38-44 HRC',
          roughness: 'Ra 1.6 µm',
          general_tolerance: 'ISO 2768-mK'
        },
        datums: ['A', 'B', 'C'],
        dimensions: [
          {
            id: 1,
            balloon: '#1',
            type: 'DIAMETER',
            type_label: 'Silindirik Çap (Bore/Shaft)',
            icon: '⭕',
            nominal: 20.0,
            nominal_str: 'Ø20.000 H7 (+0.021/0)',
            upper_tol: '+0.021',
            lower_tol: '0.000',
            measured: '20.004 mm',
            deviation: '+0.004 mm',
            status: 'PASS',
            feature_key: 'cyl_20',
            gdt: '⌖ Ø 0.020 Ⓜ | A | B | C',
            bbox: [120, 340, 220, 390]
          },
          {
            id: 2,
            balloon: '#2',
            type: 'LINEAR',
            type_label: 'Doğrusal Boyut',
            icon: '📏',
            nominal: 51.6,
            nominal_str: '51.60 ±0.20 mm',
            upper_tol: '+0.200',
            lower_tol: '-0.200',
            measured: '51.615 mm',
            deviation: '+0.015 mm',
            status: 'PASS',
            feature_key: 'dim_51_6',
            gdt: '∥ 0.015 | A',
            bbox: [300, 200, 410, 250]
          },
          {
            id: 3,
            balloon: '#3',
            type: 'RADIUS',
            type_label: 'Yarıçap (Fillet/Corner)',
            icon: '📐',
            nominal: 2.5,
            nominal_str: 'R2.50 mm',
            upper_tol: '+0.100',
            lower_tol: '-0.100',
            measured: '2.502 mm',
            deviation: '+0.002 mm',
            status: 'PASS',
            feature_key: 'rad_2_5',
            gdt: '⌒ 0.010',
            bbox: [420, 480, 480, 520]
          }
        ]
      }),

      'load-benchmark-specimen': async (): Promise<unknown> => ({
        success: true,
        specimen: {
          specimen_index: 1,
          name: 'Aselsan Askı Kancası',
          cad_file: '164849_aski_kancasi.stp',
          drawing_file: '050-164849-000 - Kopya.pdf'
        },
        cad: {
          name: '164849_aski_kancasi.stp',
          ext: 'step',
          size: 48920,
          dataText: 'ISO-10303-21; HEADER; ... END-ISO-10303-21;'
        },
        drawing: {
          name: '050-164849-000 - Kopya.pdf',
          ext: 'pdf',
          size: 104230,
          dataBase64: ''
        }
      }),

      'select-cad-file': async (): Promise<CadMetadata> => ({
        model_name: '164849_aski_kancasi.stp',
        file_format: 'step',
        file_size_bytes: 48920,
        vertex_count: 2325,
        triangle_count: 775,
        bbox: {
          min: [-26.51, 0.0, -16.06],
          max: [26.51, 33.25, 16.06],
          size: [53.03, 33.25, 32.12]
        },
        alignment: {
          base_plane_detected: true,
          table_clearance_min_z: 0.0,
          orientation_matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1]
        }
      })
    };

    // Polyfill window.ipcRenderer for browser testing & vitest
    const globalTarget = typeof window !== 'undefined' ? window : (globalThis as unknown as Window);
    const win = globalTarget as unknown as Record<string, unknown>;
    win.ipcRenderer = {
      invoke: async (channel: string, ...args: unknown[]) => {
        if (mockHandlers[channel]) {
          return mockHandlers[channel](...args);
        }
        console.warn(`[MockIPC] İşlenmeyen kanal: ${channel}`);
        return null;
      },
      on: () => {},
      off: () => {},
      send: () => {}
    };
  }
}
