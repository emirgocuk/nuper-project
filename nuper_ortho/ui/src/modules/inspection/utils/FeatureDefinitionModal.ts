export interface DefinedFeatureData {
  id?: number;
  balloon?: string;
  type: string;
  type_label: string;
  icon: string;
  nominal: number;
  nominal_str: string;
  upper_tol: string;
  lower_tol: string;
  datum_reference: string;
  gdt?: string;
  description?: string;
  page: number;
  x: number;
  y: number;
}

export interface ContextMenuOptions {
  clientX: number;
  clientY: number;
  canvasX: number;
  canvasY: number;
  page: number;
  existingItem?: {
    id: number;
    balloon: string;
    nominal_str: string;
  } | null;
  onAdd: (coords: { x: number; y: number; page: number }) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export interface FeatureModalOptions {
  canvasX: number;
  canvasY: number;
  page: number;
  nextId: number;
  existingData?: Partial<DefinedFeatureData> | null;
  onSave: (data: DefinedFeatureData) => void;
  onCancel?: () => void;
}

export class FeatureDefinitionModal {
  private static instance: FeatureDefinitionModal | null = null;
  private menuEl: HTMLElement | null = null;
  private modalEl: HTMLElement | null = null;
  private currentSaveCallback: ((data: DefinedFeatureData) => void) | null = null;
  private currentCancelCallback: (() => void) | null = null;

  public static getInstance(): FeatureDefinitionModal {
    if (!FeatureDefinitionModal.instance) {
      FeatureDefinitionModal.instance = new FeatureDefinitionModal();
    }
    return FeatureDefinitionModal.instance;
  }

  public showContextMenu(options: ContextMenuOptions): void {
    if (typeof document === 'undefined') return;
    this.hideContextMenu();

    const menu = document.createElement('div');
    menu.id = 'nuper-canvas-context-menu';
    menu.className = 'nuper-context-menu';
    menu.style.position = 'fixed';
    menu.style.left = `${options.clientX}px`;
    menu.style.top = `${options.clientY}px`;
    menu.style.zIndex = '99999';
    menu.style.background = '#0F172A';
    menu.style.border = '1px solid #334155';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
    menu.style.padding = '6px';
    menu.style.minWidth = '200px';
    menu.style.fontFamily = "'Inter', -apple-system, sans-serif";
    menu.style.fontSize = '12px';
    menu.style.color = '#F8FAFC';

    const items: Array<{
      icon: string;
      label: string;
      shortcut?: string;
      action: () => void;
      danger?: boolean;
    }> = [];

    if (options.existingItem) {
      items.push({
        icon: '✏️',
        label: `Unsuru Düzenle (${options.existingItem.balloon})`,
        action: () => {
          this.hideContextMenu();
          if (options.onEdit) options.onEdit(options.existingItem!.id);
        },
      });
      items.push({
        icon: '🗑️',
        label: `Unsuru Kaldır (${options.existingItem.balloon})`,
        danger: true,
        action: () => {
          this.hideContextMenu();
          if (options.onDelete) options.onDelete(options.existingItem!.id);
        },
      });
    }

    items.push({
      icon: '➕',
      label: 'Buraya Yeni Ölçü / Unsur Ekle',
      shortcut: 'Sağ Tık',
      action: () => {
        this.hideContextMenu();
        options.onAdd({ x: options.canvasX, y: options.canvasY, page: options.page });
      },
    });

    for (const item of items) {
      const btn = document.createElement('button');
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.width = '100%';
      btn.style.padding = '8px 10px';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.background = 'transparent';
      btn.style.color = item.danger ? '#EF4444' : '#F1F5F9';
      btn.style.cursor = 'pointer';
      btn.style.textAlign = 'left';
      btn.style.gap = '8px';
      btn.style.fontSize = '12px';
      btn.style.fontWeight = '500';

      btn.addEventListener('mouseenter', () => {
        btn.style.background = item.danger ? 'rgba(239, 68, 68, 0.15)' : '#1E293B';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.action();
      });

      btn.innerHTML = `
        <span>${item.icon}</span>
        <span style="flex:1;">${item.label}</span>
        ${item.shortcut ? `<span style="font-size:10px; color:#64748B;">${item.shortcut}</span>` : ''}
      `;
      menu.appendChild(btn);
    }

    document.body.appendChild(menu);
    this.menuEl = menu;

    const onDismiss = (e: MouseEvent) => {
      if (menu && !menu.contains(e.target as Node)) {
        this.hideContextMenu();
        window.removeEventListener('click', onDismiss);
      }
    };
    setTimeout(() => {
      window.addEventListener('click', onDismiss);
    }, 10);
  }

  public hideContextMenu(): void {
    if (this.menuEl && this.menuEl.parentNode) {
      this.menuEl.parentNode.removeChild(this.menuEl);
    }
    this.menuEl = null;
  }

  public openModal(options: FeatureModalOptions): void {
    if (typeof document === 'undefined') return;
    this.closeModal();

    this.currentSaveCallback = options.onSave;
    this.currentCancelCallback = options.onCancel || null;

    const existing = options.existingData;
    const isEdit = !!(existing && existing.id !== undefined);
    const featureId = isEdit ? existing.id! : options.nextId;
    const initialBalloon = isEdit ? existing.balloon || `#${featureId}` : `#${featureId}`;

    const parsedInitial = this.parseCallout(existing?.nominal_str || '');
    const initialType = existing?.type || parsedInitial.type || 'DIAMETER';
    const initialNominal = existing?.nominal ?? parsedInitial.nominal ?? 50.0;
    const initialNomStr = existing?.nominal_str || parsedInitial.nominal_str || 'Ø50 ±0.1';
    const initialUpper = existing?.upper_tol ?? parsedInitial.upper_tol ?? '+0.100';
    const initialLower = existing?.lower_tol ?? parsedInitial.lower_tol ?? '-0.100';
    const initialDatum = existing?.datum_reference || '[A]';
    const initialDesc = existing?.description || existing?.type_label || '';

    const modal = document.createElement('div');
    modal.id = 'modal-feature-definition';
    modal.className = 'feature-definition-modal-overlay';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(15, 23, 42, 0.75)';
    modal.style.backdropFilter = 'blur(4px)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '100000';
    modal.style.fontFamily = "'Inter', -apple-system, sans-serif";

    modal.innerHTML = `
      <div class="feature-modal-card" style="width: 480px; background: #0F172A; border: 1px solid #334155; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; color: #F8FAFC;">
        <div style="padding: 16px 20px; border-bottom: 1px solid #1E293B; display: flex; align-items: center; justify-content: space-between; background: #1E293B;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #0284C7; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; color: #FFF;">
              ${initialBalloon}
            </div>
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #F8FAFC;">
                ${isEdit ? 'Metroloji Unsurunu Düzenle' : 'Yeni Metroloji Unsuru / Ölçü Tanımla'}
              </h3>
              <p style="margin: 2px 0 0; font-size: 11px; color: #94A3B8;">
                Sayfa ${options.page} • Konum: X:${Math.round(options.canvasX)} Y:${Math.round(options.canvasY)}
              </p>
            </div>
          </div>
          <button id="btn-feature-modal-close" style="background: none; border: none; font-size: 18px; color: #64748B; cursor: pointer;">✕</button>
        </div>

        <form id="feature-modal-form" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94A3B8; margin-bottom: 6px;">
              Unsur Tipi
            </label>
            <select id="feat-type" style="width: 100%; padding: 8px 10px; background: #1E293B; border: 1px solid #334155; border-radius: 6px; color: #F8FAFC; font-size: 13px;">
              <option value="DIAMETER" ${initialType === 'DIAMETER' ? 'selected' : ''}>⭕ Çap (DIAMETER)</option>
              <option value="LINEAR" ${initialType === 'LINEAR' ? 'selected' : ''}>📏 Doğrusal Boyut (LINEAR)</option>
              <option value="RADIUS" ${initialType === 'RADIUS' ? 'selected' : ''}>📐 Radyus / Kavis (RADIUS)</option>
              <option value="ANGLE" ${initialType === 'ANGLE' ? 'selected' : ''}>📐 Açı / Koniklik (ANGLE)</option>
              <option value="CHAMFER" ${initialType === 'CHAMFER' ? 'selected' : ''}>✂️ Pah (CHAMFER)</option>
              <option value="THREAD" ${initialType === 'THREAD' ? 'selected' : ''}>🔩 Vida / Diş (THREAD)</option>
              <option value="POSITION" ${initialType === 'POSITION' ? 'selected' : ''}>🎯 Konum / GD&T (POSITION)</option>
            </select>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94A3B8;">
                Teknik Resim İfadesi (Callout / Etiket)
              </label>
              <div style="display: flex; gap: 4px;">
                <button type="button" class="btn-symbol-insert" data-symbol="Ø" style="padding: 2px 6px; font-size: 10px; background: #334155; border: none; border-radius: 3px; color: #38BDF8; cursor: pointer;">Ø</button>
                <button type="button" class="btn-symbol-insert" data-symbol="±" style="padding: 2px 6px; font-size: 10px; background: #334155; border: none; border-radius: 3px; color: #38BDF8; cursor: pointer;">±</button>
                <button type="button" class="btn-symbol-insert" data-symbol="°" style="padding: 2px 6px; font-size: 10px; background: #334155; border: none; border-radius: 3px; color: #38BDF8; cursor: pointer;">°</button>
                <button type="button" class="btn-symbol-insert" data-symbol="R" style="padding: 2px 6px; font-size: 10px; background: #334155; border: none; border-radius: 3px; color: #38BDF8; cursor: pointer;">R</button>
                <button type="button" class="btn-symbol-insert" data-symbol="x45°" style="padding: 2px 6px; font-size: 10px; background: #334155; border: none; border-radius: 3px; color: #38BDF8; cursor: pointer;">x45°</button>
              </div>
            </div>
            <input type="text" id="feat-nom-str" value="${initialNomStr}" placeholder="örn: Ø86 ±0.5, 3 x45°, R3, (291.9)" style="width: 100%; padding: 8px 10px; background: #1E293B; border: 1px solid #334155; border-radius: 6px; color: #F8FAFC; font-size: 13px; font-family: 'JetBrains Mono', monospace;" />
            <span style="font-size: 10px; color: #64748B; margin-top: 3px; display: block;">Balonun altında çizimde tam olarak bu özellik etiketi görünecektir.</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94A3B8; margin-bottom: 6px;">
                Nominal (mm)
              </label>
              <input type="number" step="any" id="feat-nominal" value="${initialNominal}" style="width: 100%; padding: 8px 10px; background: #1E293B; border: 1px solid #334155; border-radius: 6px; color: #F8FAFC; font-size: 13px;" required />
            </div>
            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94A3B8; margin-bottom: 6px;">
                Üst Tol (+)
              </label>
              <input type="text" id="feat-upper-tol" value="${initialUpper}" placeholder="+0.100" style="width: 100%; padding: 8px 10px; background: #1E293B; border: 1px solid #334155; border-radius: 6px; color: #F8FAFC; font-size: 13px; font-family: 'JetBrains Mono', monospace;" />
            </div>
            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94A3B8; margin-bottom: 6px;">
                Alt Tol (-)
              </label>
              <input type="text" id="feat-lower-tol" value="${initialLower}" placeholder="-0.100" style="width: 100%; padding: 8px 10px; background: #1E293B; border: 1px solid #334155; border-radius: 6px; color: #F8FAFC; font-size: 13px; font-family: 'JetBrains Mono', monospace;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px;">
            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94A3B8; margin-bottom: 6px;">
                Datum Ref
              </label>
              <input type="text" id="feat-datum" value="${initialDatum}" placeholder="[A]" style="width: 100%; padding: 8px 10px; background: #1E293B; border: 1px solid #334155; border-radius: 6px; color: #F8FAFC; font-size: 13px;" />
            </div>
            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94A3B8; margin-bottom: 6px;">
                Açıklama / Unsur Adı
              </label>
              <input type="text" id="feat-desc" value="${initialDesc}" placeholder="örn: Ana Silindirik Çap" style="width: 100%; padding: 8px 10px; background: #1E293B; border: 1px solid #334155; border-radius: 6px; color: #F8FAFC; font-size: 13px;" />
            </div>
          </div>

          <div style="margin-top: 10px; display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" id="btn-feature-cancel" style="padding: 8px 14px; background: #334155; border: none; border-radius: 6px; color: #F1F5F9; font-weight: 600; font-size: 12px; cursor: pointer;">
              Vazgeç
            </button>
            <button type="submit" id="btn-feature-save" style="padding: 8px 18px; background: #0284C7; border: none; border-radius: 6px; color: #FFF; font-weight: 600; font-size: 12px; cursor: pointer;">
              ✓ Unsuru Kaydet
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    const closeBtn = modal.querySelector('#btn-feature-modal-close');
    closeBtn?.addEventListener('click', () => this.closeModal());

    const cancelBtn = modal.querySelector('#btn-feature-cancel');
    cancelBtn?.addEventListener('click', () => this.closeModal());

    const nomStrInput = modal.querySelector<HTMLInputElement>('#feat-nom-str');
    const typeSelect = modal.querySelector<HTMLSelectElement>('#feat-type');
    const nominalInput = modal.querySelector<HTMLInputElement>('#feat-nominal');
    const upperInput = modal.querySelector<HTMLInputElement>('#feat-upper-tol');
    const lowerInput = modal.querySelector<HTMLInputElement>('#feat-lower-tol');

    modal.querySelectorAll<HTMLButtonElement>('.btn-symbol-insert').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sym = btn.getAttribute('data-symbol') || '';
        if (nomStrInput) {
          const curPos = nomStrInput.selectionStart || nomStrInput.value.length;
          const val = nomStrInput.value;
          nomStrInput.value = val.slice(0, curPos) + sym + val.slice(curPos);
          nomStrInput.focus();
          nomStrInput.setSelectionRange(curPos + sym.length, curPos + sym.length);
          this.syncFromNomStr(nomStrInput.value, typeSelect, nominalInput, upperInput, lowerInput);
        }
      });
    });

    nomStrInput?.addEventListener('input', () => {
      this.syncFromNomStr(nomStrInput.value, typeSelect, nominalInput, upperInput, lowerInput);
    });

    const form = modal.querySelector<HTMLFormElement>('#feature-modal-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nomStr = nomStrInput?.value.trim() || '';
      const inferred = this.parseCallout(nomStr);
      let type = typeSelect?.value || inferred.type || 'LINEAR';
      if ((!typeSelect || typeSelect.value === 'LINEAR') && inferred.type) {
        type = inferred.type;
      }
      const nominal = parseFloat(nominalInput?.value || (inferred.nominal !== undefined ? String(inferred.nominal) : '0'));
      const upper = upperInput?.value.trim() || inferred.upper_tol || '';
      const lower = lowerInput?.value.trim() || inferred.lower_tol || '';
      const datum = (modal.querySelector<HTMLInputElement>('#feat-datum')?.value || '').trim();
      const desc = (modal.querySelector<HTMLInputElement>('#feat-desc')?.value || '').trim();

      const typeLabelMap: Record<string, { label: string; icon: string }> = {
        DIAMETER: { label: 'Silindirik Çap / Delik', icon: '⭕' },
        LINEAR: { label: 'Doğrusal Ölçü', icon: '📏' },
        RADIUS: { label: 'Kavis / Yarıçap (Fillet)', icon: '📐' },
        ANGLE: { label: 'Açı / Koniklik', icon: '📐' },
        CHAMFER: { label: 'Pah Kırma', icon: '✂️' },
        THREAD: { label: 'Vida / Diş', icon: '🔩' },
        POSITION: { label: 'Konum / GD&T', icon: '🎯' },
      };

      const meta = typeLabelMap[type] || { label: 'Doğrusal Ölçü', icon: '📏' };

      const resultData: DefinedFeatureData = {
        id: featureId,
        balloon: initialBalloon,
        type: type,
        type_label: desc || meta.label,
        icon: meta.icon,
        nominal: isNaN(nominal) ? 0 : nominal,
        nominal_str: nomStr,
        upper_tol: upper,
        lower_tol: lower,
        datum_reference: datum,
        description: desc,
        page: options.page,
        x: options.canvasX,
        y: options.canvasY,
      };

      if (this.currentSaveCallback) {
        this.currentSaveCallback(resultData);
      }
      this.closeModal();
    });

    setTimeout(() => {
      nomStrInput?.focus();
      nomStrInput?.select();
    }, 50);
  }

  public closeModal(): void {
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.parentNode.removeChild(this.modalEl);
    }
    this.modalEl = null;
    if (this.currentCancelCallback) {
      this.currentCancelCallback();
      this.currentCancelCallback = null;
    }
    this.currentSaveCallback = null;
  }

  public parseCallout(text: string): {
    type?: string;
    nominal?: number;
    nominal_str?: string;
    upper_tol?: string;
    lower_tol?: string;
  } {
    const raw = text.trim();
    if (!raw) return {};

    const clean = raw.replace(/[@D]/, 'Ø');

    const diaMatch = clean.match(/(?:Ø|DIA|CAP)\s*([0-9]+(?:\.[0-9]+)?)(?:\s*([±\+]\s*[0-9]+(?:\.[0-9]+)?))?/i);
    if (diaMatch) {
      const nom = parseFloat(diaMatch[1]);
      let upper = '';
      let lower = '';
      if (diaMatch[2]) {
        if (diaMatch[2].includes('±')) {
          const val = diaMatch[2].replace('±', '').trim();
          upper = `+${val}`;
          lower = `-${val}`;
        } else if (diaMatch[2].includes('+')) {
          upper = diaMatch[2].trim();
          lower = '0.000';
        }
      }
      return {
        type: 'DIAMETER',
        nominal: nom,
        nominal_str: clean,
        upper_tol: upper,
        lower_tol: lower,
      };
    }

    const radMatch = clean.match(/R\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (radMatch) {
      return {
        type: 'RADIUS',
        nominal: parseFloat(radMatch[1]),
        nominal_str: clean,
        upper_tol: '',
        lower_tol: '',
      };
    }

    const chamferMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*x\s*45[°\*\^]?/i);
    if (chamferMatch) {
      return {
        type: 'CHAMFER',
        nominal: parseFloat(chamferMatch[1]),
        nominal_str: clean,
        upper_tol: '',
        lower_tol: '',
      };
    }

    const angleMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*[°\*\^]/i);
    if (angleMatch) {
      return {
        type: 'ANGLE',
        nominal: parseFloat(angleMatch[1]),
        nominal_str: clean,
        upper_tol: '',
        lower_tol: '',
      };
    }

    const refMatch = clean.match(/\(\s*([0-9]+(?:\.[0-9]+)?)\s*\)/);
    if (refMatch) {
      return {
        type: 'LINEAR',
        nominal: parseFloat(refMatch[1]),
        nominal_str: clean,
        upper_tol: '',
        lower_tol: '',
      };
    }

    const linMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)(?:\s*([±\+]\s*[0-9]+(?:\.[0-9]+)?))?/);
    if (linMatch) {
      const nom = parseFloat(linMatch[1]);
      let upper = '';
      let lower = '';
      if (linMatch[2]) {
        if (linMatch[2].includes('±')) {
          const val = linMatch[2].replace('±', '').trim();
          upper = `+${val}`;
          lower = `-${val}`;
        }
      }
      return {
        type: 'LINEAR',
        nominal: nom,
        nominal_str: clean,
        upper_tol: upper,
        lower_tol: lower,
      };
    }

    return { nominal_str: clean };
  }

  private syncFromNomStr(
    nomStr: string,
    typeSelect: HTMLSelectElement | null,
    nominalInput: HTMLInputElement | null,
    upperInput: HTMLInputElement | null,
    lowerInput: HTMLInputElement | null
  ): void {
    const parsed = this.parseCallout(nomStr);
    if (typeSelect && parsed.type) {
      typeSelect.value = parsed.type;
    }
    if (nominalInput && parsed.nominal !== undefined && !isNaN(parsed.nominal)) {
      nominalInput.value = String(parsed.nominal);
    }
    if (upperInput && parsed.upper_tol !== undefined) {
      upperInput.value = parsed.upper_tol;
    }
    if (lowerInput && parsed.lower_tol !== undefined) {
      lowerInput.value = parsed.lower_tol;
    }
  }
}
