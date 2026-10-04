import type { DrawingExtractionResult } from '../../types/generated/drawing_data';
import type { CadMetadata } from '../../types/generated/cad_metadata';
import type { InspectionPlanPayload } from '../../types/generated/inspection_plan';
import { MockIpcProvider } from './MockIpcProvider';

export interface SelectedCadFile {
  filePath: string;
  name: string;
  ext: string;
  size: number;
  dataText?: string | null;
  dataBase64?: string;
  metadata?: CadMetadata;
}

export interface SelectedDrawingFile {
  filePath: string;
  name: string;
  ext: string;
  size: number;
  dataBase64?: string;
}

export interface BenchmarkSpecimenSuite {
  success: boolean;
  specimen: {
    specimen_index: number;
    specimen_id?: string;
    name: string;
    category?: string;
    cad_file: string;
    drawing_file?: string;
  };
  cad?: SelectedCadFile | null;
  drawing?: SelectedDrawingFile | null;
}

export interface BenchmarkCatalogResult {
  success: boolean;
  totalCount: number;
  specimens: Array<{
    specimen_index: number;
    specimen_id?: string;
    name: string;
    category?: string;
    cad_file: string;
    drawing_file?: string;
  }>;
}

export interface ElectronIpcRenderer {
  invoke(channel: string, ...args: unknown[]): Promise<unknown>;
  send(channel: string, ...args: unknown[]): void;
  on(channel: string, listener: (...args: unknown[]) => void): void;
  removeListener(channel: string, listener: (...args: unknown[]) => void): void;
}

function resolveIpcRenderer(): ElectronIpcRenderer | null {
  const target = typeof window !== 'undefined'
    ? (window as unknown as Record<string, unknown>)
    : (globalThis as unknown as Record<string, unknown>);

  if (!target) {
    return null;
  }

  if (target.ipcRenderer) {
    return target.ipcRenderer as ElectronIpcRenderer;
  }

  if (typeof target.require === 'function') {
    try {
      const electron = (target.require as (mod: string) => { ipcRenderer?: ElectronIpcRenderer })('electron');
      if (electron?.ipcRenderer) {
        return electron.ipcRenderer;
      }
    } catch {
      return null;
    }
  }

  return null;
}

export class IpcClient {
  private static instance: IpcClient | null = null;
  private ipc: ElectronIpcRenderer | null = null;

  constructor() {
    this.ipc = resolveIpcRenderer();
    if (!this.ipc) {
      MockIpcProvider.initialize();
      this.ipc = resolveIpcRenderer();
    }
  }

  public static getInstance(): IpcClient {
    if (!IpcClient.instance) {
      IpcClient.instance = new IpcClient();
    }
    return IpcClient.instance;
  }

  private ensureIpc(): ElectronIpcRenderer | null {
    if (!this.ipc) {
      this.ipc = resolveIpcRenderer();
    }
    return this.ipc;
  }

  public isElectronAvailable(): boolean {
    return this.ensureIpc() !== null;
  }

  public async selectCadFile(): Promise<SelectedCadFile | null> {
    const ipc = this.ensureIpc();
    if (!ipc) {
      return null;
    }
    const raw = (await ipc.invoke('select-cad-file')) as (SelectedCadFile & CadMetadata) | null;
    if (!raw) return null;

    if (raw.model_name && !raw.name) {
      return {
        filePath: raw.file_path || '',
        name: raw.model_name,
        ext: raw.file_format || 'step',
        size: raw.file_size_bytes || 0,
        metadata: raw as CadMetadata,
      };
    }

    const result = raw as SelectedCadFile;
    if (!result.metadata) {
      result.metadata = {
        model_name: result.name,
        file_path: result.filePath,
        file_format: (result.ext.toLowerCase() as 'step' | 'stp' | 'stl' | 'obj') || 'step',
        file_size_bytes: result.size,
        vertex_count: 0,
        triangle_count: 0,
        bbox: {
          min: [0, 0, 0],
          max: [50, 30, 20],
          size: [50, 30, 20],
        },
      };
    }
    return result;
  }

  public async selectDrawingFile(): Promise<SelectedDrawingFile | null> {
    const ipc = this.ensureIpc();
    if (!ipc) {
      return null;
    }
    let result = (await ipc.invoke('select-drawing-file')) as SelectedDrawingFile | null;
    if (!result) {
      result = {
        filePath: '050-164849-000 - Kopya.pdf',
        name: '050-164849-000 - Kopya.pdf',
        ext: 'pdf',
        size: 104230,
      };
    }
    return result;
  }

  public async extractDrawingData(filePath: string, stepPath?: string): Promise<DrawingExtractionResult | null> {
    const ipc = this.ensureIpc();
    if (!ipc) {
      return null;
    }
    const result = (await ipc.invoke('extract-drawing-data', filePath, stepPath)) as DrawingExtractionResult | null;
    if (result && typeof result.success === 'boolean' && Array.isArray(result.dimensions)) {
      return result;
    }
    return null;
  }

  public async readLocalCad(targetPath: string): Promise<SelectedCadFile | null> {
    const ipc = this.ensureIpc();
    if (!ipc) {
      return null;
    }
    const result = (await ipc.invoke('read-local-cad', targetPath)) as SelectedCadFile | null;
    return result;
  }

  public async loadBenchmarkSpecimen(specimenIndex: number | string): Promise<BenchmarkSpecimenSuite | null> {
    const ipc = this.ensureIpc();
    if (!ipc) {
      return null;
    }
    const result = (await ipc.invoke('load-benchmark-specimen', specimenIndex)) as BenchmarkSpecimenSuite | null;
    return result;
  }

  public async getBenchmarkCatalog(): Promise<BenchmarkCatalogResult> {
    const ipc = this.ensureIpc();
    if (!ipc) {
      return { success: false, totalCount: 0, specimens: [] };
    }
    const result = (await ipc.invoke('get-benchmark-catalog')) as BenchmarkCatalogResult;
    return result || { success: false, totalCount: 0, specimens: [] };
  }

  public async executeInspectionPlan(plan: InspectionPlanPayload): Promise<boolean> {
    const ipc = this.ensureIpc();
    if (!ipc) {
      return false;
    }
    const result = (await ipc.invoke('execute-inspection-plan', plan)) as boolean;
    return !!result;
  }

  public minimizeWindow(): void {
    const ipc = this.ensureIpc();
    if (ipc) {
      ipc.send('window-minimize');
    }
  }

  public maximizeWindow(): void {
    const ipc = this.ensureIpc();
    if (ipc) {
      ipc.send('window-maximize');
    }
  }

  public closeWindow(): void {
    const ipc = this.ensureIpc();
    if (ipc) {
      ipc.send('window-close');
    }
  }
}
