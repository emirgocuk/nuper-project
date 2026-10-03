import type { DrawingExtractionResult } from '../../types/generated/drawing_data';

export interface InspectionTableRow {
  id: number;
  balloon: string;
  type: string;
  type_label: string;
  icon: string;
  nominal: number;
  nominal_str: string;
  upper_tol: string;
  lower_tol: string;
  measured: string;
  deviation: string;
  status: 'PASS' | 'WARN' | 'FAIL' | 'UNMEASURED';
  feature_key?: string;
  gdt?: string;
  selected?: boolean;
}

export interface InspectionSummary {
  total: number;
  pass: number;
  warn: number;
  fail: number;
  unmeasured: number;
}

export class InspectionTable {
  private rows: InspectionTableRow[] = [];
  private selectedId: number | null = null;
  private datums: string[] = [];
  private titleBlock: Record<string, string> = {};
  private listeners: Array<(row: InspectionTableRow | null) => void> = [];

  public setExtractionResult(data: DrawingExtractionResult): void {
    this.datums = [...(data.datums || [])];
    this.titleBlock = {
      part_number: data.title_block?.part_number || '',
      material: data.title_block?.material || '',
      hardness: data.title_block?.hardness || '',
      general_tolerance: data.title_block?.general_tolerance || 'ISO 2768-mK',
    };

    this.rows = (data.dimensions || []).map((dim) => ({
      id: dim.id,
      balloon: dim.balloon || `#${dim.id}`,
      type: dim.type,
      type_label: dim.type_label,
      icon: dim.icon || '📏',
      nominal: dim.nominal,
      nominal_str: dim.nominal_str,
      upper_tol: dim.upper_tol,
      lower_tol: dim.lower_tol,
      measured: dim.measured,
      deviation: dim.deviation,
      status: dim.status,
      feature_key: dim.feature_key,
      gdt: dim.gdt,
      selected: dim.id === this.selectedId,
    }));
  }

  public getRows(): InspectionTableRow[] {
    return this.rows;
  }

  public getDatums(): string[] {
    return this.datums;
  }

  public getTitleBlock(): Record<string, string> {
    return this.titleBlock;
  }

  public selectRow(id: number | null): void {
    this.selectedId = id;
    let selectedRow: InspectionTableRow | null = null;
    for (const row of this.rows) {
      row.selected = row.id === id;
      if (row.selected) {
        selectedRow = row;
      }
    }
    for (const listener of this.listeners) {
      listener(selectedRow);
    }
  }

  public getSelectedRow(): InspectionTableRow | null {
    return this.rows.find((r) => r.id === this.selectedId) || null;
  }

  public onSelectionChange(callback: (row: InspectionTableRow | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public getSummary(): InspectionSummary {
    return {
      total: this.rows.length,
      pass: this.rows.filter((r) => r.status === 'PASS').length,
      warn: this.rows.filter((r) => r.status === 'WARN').length,
      fail: this.rows.filter((r) => r.status === 'FAIL').length,
      unmeasured: this.rows.filter((r) => r.status === 'UNMEASURED').length,
    };
  }

  public clear(): void {
    this.rows = [];
    this.selectedId = null;
    this.datums = [];
    this.titleBlock = {};
    this.listeners = [];
  }
}
