export type WorkflowStepId = 'step_cad' | 'step_fixture' | 'step_drawing' | 'step_align' | 'step_simulation';

export interface WorkflowStep {
  id: WorkflowStepId;
  stepNumber: number;
  label: string;
  icon: string;
  tooltip: string;
  status: 'pending' | 'active' | 'completed';
}

export const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'step_cad',
    stepNumber: 1,
    label: 'Katı Model Yükle',
    icon: '📂',
    tooltip: 'Adım 1: 3D STEP/B-Rep modelini yükle',
    status: 'active',
  },
  {
    id: 'step_fixture',
    stepNumber: 2,
    label: 'Fikstür & Bağlama',
    icon: '🗜️',
    tooltip: 'Adım 2: Parçayı CMM tablasına en kararlı açıyla oturt',
    status: 'pending',
  },
  {
    id: 'step_drawing',
    stepNumber: 3,
    label: 'Teknik Resim',
    icon: '📄',
    tooltip: 'Adım 3: 2D PDF teknik resmi yükle ve B-Rep ile eşleştir',
    status: 'pending',
  },
  {
    id: 'step_align',
    stepNumber: 4,
    label: '3-2-1 Sıfırlama',
    icon: '🎯',
    tooltip: 'Adım 4: Granit tabla ve dayamalar ile makine sıfırını kilitle',
    status: 'pending',
  },
  {
    id: 'step_simulation',
    stepNumber: 5,
    label: 'Otonom Simülasyon',
    icon: '▶️',
    tooltip: 'Adım 5: Prob yollarını adım adım PC-DMIS stili takip et',
    status: 'pending',
  },
];

export class WorkflowRibbon {
  private steps: WorkflowStep[];
  private currentStepIndex = 0;

  constructor(initialSteps: WorkflowStep[] = DEFAULT_WORKFLOW_STEPS) {
    this.steps = initialSteps.map((s) => ({ ...s }));
  }

  public getSteps(): WorkflowStep[] {
    return this.steps;
  }

  public getCurrentStep(): WorkflowStep {
    return this.steps[this.currentStepIndex];
  }

  public setStepStatus(id: WorkflowStepId, status: 'pending' | 'active' | 'completed'): void {
    const step = this.steps.find((s) => s.id === id);
    if (step) {
      step.status = status;
      if (status === 'active') {
        this.currentStepIndex = this.steps.indexOf(step);
      }
    }
  }

  public setStepLabel(id: WorkflowStepId, label: string): void {
    const step = this.steps.find((s) => s.id === id);
    if (step) {
      step.label = label;
    }
  }

  public advanceToStep(stepNumber: number): void {
    this.steps.forEach((s) => {
      if (s.stepNumber < stepNumber) {
        s.status = 'completed';
      } else if (s.stepNumber === stepNumber) {
        s.status = 'active';
        this.currentStepIndex = this.steps.indexOf(s);
      } else {
        s.status = 'pending';
      }
    });
  }

  public renderRibbonHtml(): string {
    return `
      <div class="workflow-ribbon-bar" style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 6px 14px; background: #FFFFFF; border-bottom: 1px solid #CBD5E1; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
        <div class="workflow-steps-group" style="display: flex; align-items: center; gap: 8px;">
          ${this.steps
            .map((s) => {
              const isActive = s.status === 'active';
              const isCompleted = s.status === 'completed';
              const bg = isActive ? '#0284C7' : (isCompleted ? '#ECFDF5' : '#F8FAFC');
              const border = isActive ? '#0369A1' : (isCompleted ? '#A7F3D0' : '#E2E8F0');
              const textColor = isActive ? '#FFFFFF' : (isCompleted ? '#047857' : '#64748B');
              const badgeBg = isActive ? 'rgba(255,255,255,0.25)' : (isCompleted ? '#D1FAE5' : '#E2E8F0');
              const badgeColor = isActive ? '#FFFFFF' : (isCompleted ? '#065F46' : '#475569');
              const badgeIcon = isCompleted ? '✓' : `${s.stepNumber}`;

              return `
                <button
                  class="workflow-step-btn ${s.status}"
                  data-workflow-id="${s.id}"
                  title="${s.tooltip}"
                  style="display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: ${bg}; border: 1px solid ${border}; border-radius: 6px; color: ${textColor}; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; box-shadow: ${isActive ? '0 1px 3px rgba(2, 132, 199, 0.25)' : 'none'};"
                >
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: ${badgeBg}; color: ${badgeColor}; font-size: 11px; font-weight: 800;">${badgeIcon}</span>
                  <span>${s.icon} ${s.label}</span>
                </button>
              `;
            })
            .join('<span style="color: #94A3B8; font-size: 11px; font-weight: 700;">➔</span>')}
        </div>
        <div class="workflow-secondary-group" style="display: flex; align-items: center; gap: 6px;">
          <button id="wf-btn-bench" class="ribbon-btn" style="padding: 5px 12px; font-size: 11.5px; font-weight: 600; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 5px; color: #334155; cursor: pointer;" title="Savunma Sanayii Benchmark Laboratuvarı">🧪 Benchmark Lab</button>
          <button id="wf-btn-diag" class="ribbon-btn" style="padding: 5px 12px; font-size: 11.5px; font-weight: 600; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 5px; color: #334155; cursor: pointer;" title="Metroloji Teşhis Masası (F10)">🩺 Teşhis</button>
        </div>
      </div>
    `;
  }

  public mount(containerOrSelector: HTMLElement | string = '.app-ribbon'): void {
    let el: HTMLElement | null = null;
    if (typeof containerOrSelector === 'object' && containerOrSelector !== null) {
      el = containerOrSelector;
    } else if (typeof document !== 'undefined') {
      el = document.querySelector(containerOrSelector) as HTMLElement | null;
    }
    if (!el) return;

    el.innerHTML = this.renderRibbonHtml();

    if (typeof el.querySelector === 'function' && typeof window !== 'undefined') {
      const win = window as unknown as {
        triggerCadImport?: () => void;
        openClampingModal?: () => void;
        open321Modal?: () => void;
        apply321Alignment?: () => void;
        openBenchmarkLabModal?: () => void;
        toggleDiagnosticsDrawer?: () => void;
        setupWizard?: { handleTeknikResimClick?: () => void };
        nuperApp?: {
          openAndLoadCadFile?: () => Promise<{ name: string } | null>;
          getCADViewer?: () => { getSimulationController: () => { togglePlay: () => void } };
        };
      };

      const stepCadBtn = el.querySelector<HTMLElement>('[data-workflow-id="step_cad"]');
      if (stepCadBtn) {
        stepCadBtn.onclick = (e) => {
          e.preventDefault();
          if (win.nuperApp?.openAndLoadCadFile) {
            void win.nuperApp.openAndLoadCadFile().then((res) => {
              if (res) {
                const shortName = res.name.length > 20 ? res.name.substring(0, 18) + '...' : res.name;
                this.setStepLabel('step_cad', `Katı Model: ${shortName}`);
                this.advanceToStep(2);
                this.mount(containerOrSelector);
              }
            });
          } else if (typeof win.triggerCadImport === 'function') {
            win.triggerCadImport();
          }
        };
      }

      const stepFixtureBtn = el.querySelector<HTMLElement>('[data-workflow-id="step_fixture"]');
      if (stepFixtureBtn) {
        stepFixtureBtn.onclick = (e) => {
          e.preventDefault();
          if (typeof win.openClampingModal === 'function') {
            win.openClampingModal();
          }
          this.advanceToStep(3);
          this.mount(containerOrSelector);
        };
      }

      const stepDrawingBtn = el.querySelector<HTMLElement>('[data-workflow-id="step_drawing"]');
      if (stepDrawingBtn) {
        stepDrawingBtn.onclick = (e) => {
          e.preventDefault();
          if (win.setupWizard && typeof win.setupWizard.handleTeknikResimClick === 'function') {
            win.setupWizard.handleTeknikResimClick();
          }
          this.advanceToStep(4);
          this.mount(containerOrSelector);
        };
      }

      const stepAlignBtn = el.querySelector<HTMLElement>('[data-workflow-id="step_align"]');
      if (stepAlignBtn) {
        stepAlignBtn.onclick = (e) => {
          e.preventDefault();
          if (typeof win.apply321Alignment === 'function') {
            win.apply321Alignment();
          } else if (typeof win.open321Modal === 'function') {
            win.open321Modal();
          }
          this.advanceToStep(5);
          this.mount(containerOrSelector);
        };
      }

      const stepSimBtn = el.querySelector<HTMLElement>('[data-workflow-id="step_simulation"]');
      if (stepSimBtn) {
        stepSimBtn.onclick = (e) => {
          e.preventDefault();
          this.advanceToStep(5);
          this.mount(containerOrSelector);
          win.nuperApp?.getCADViewer?.()?.getSimulationController?.()?.togglePlay?.();
        };
      }

      const benchBtn = el.querySelector<HTMLElement>('#wf-btn-bench');
      if (benchBtn) {
        benchBtn.onclick = (e) => {
          e.preventDefault();
          win.openBenchmarkLabModal?.();
        };
      }

      const diagBtn = el.querySelector<HTMLElement>('#wf-btn-diag');
      if (diagBtn) {
        diagBtn.onclick = (e) => {
          e.preventDefault();
          win.toggleDiagnosticsDrawer?.();
        };
      }
    }
  }
}
