import type { DrawingExtractionResult } from '../../types/generated/drawing_data';
import { InspectionCardFormatter, type FormattedInspectionCard } from './utils/InspectionCardFormatter';

export interface InspectionTableRow {
  id: number;
  balloon: string;
  page: number;
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
  datum_reference: string;
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
  private container: HTMLElement | null = null;

  public setExtractionResult(data: DrawingExtractionResult): void {
    this.datums = [...(data.datums || [])];
    this.titleBlock = {
      part_number: data.title_block?.part_number || '',
      material: data.title_block?.material || '',
      hardness: data.title_block?.hardness || '',
      general_tolerance: data.title_block?.general_tolerance || 'ISO 2768-mK',
    };

    this.rows = (data.dimensions || []).map((dim) => {
      const datumRef = dim.datum_reference || InspectionCardFormatter.extractDatumReference(dim.gdt, data.datums);
      return {
        id: dim.id,
        balloon: dim.balloon || `#${dim.id}`,
        page: dim.page || 1,
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
        datum_reference: datumRef,
        selected: dim.id === this.selectedId,
      };
    });

    if (this.container) {
      this.render();
    }
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

  public getFormattedCards(): FormattedInspectionCard[] {
    return this.rows.map((row) => ({
      id: row.id,
      balloon: row.balloon,
      page: row.page,
      featureTitle: InspectionCardFormatter.formatFeatureTitle(row.type_label, row.nominal_str),
      nominalStr: row.nominal_str,
      toleranceRange: InspectionCardFormatter.formatToleranceRange(row.lower_tol, row.upper_tol, row.nominal_str),
      datumReference: row.datum_reference,
      status: row.status,
      featureKey: row.feature_key,
      selected: row.selected,
    }));
  }

  public mount(container: HTMLElement): void {
    this.container = container;
    this.render();
  }

  public render(): void {
    if (!this.container) return;

    const cards = this.getFormattedCards();
    this.container.innerHTML = InspectionCardFormatter.renderListContainerHtml(cards);

    if (this.container.querySelectorAll) {
      const cardElements = this.container.querySelectorAll<HTMLElement>('.inspection-card');
      cardElements.forEach((el) => {
        el.addEventListener?.('click', () => {
          const idAttr = el.getAttribute?.('data-id');
          if (idAttr) {
            this.selectRow(parseInt(idAttr, 10));
          }
        });
      });
    }
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

    if (this.container?.querySelectorAll) {
      const cardElements = this.container.querySelectorAll<HTMLElement>('.inspection-card');
      cardElements.forEach((el) => {
        const idAttr = el.getAttribute?.('data-id');
        const cardId = idAttr ? parseInt(idAttr, 10) : null;
        if (cardId === id) {
          el.classList?.add('active');
        } else {
          el.classList?.remove('active');
        }
      });
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
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

