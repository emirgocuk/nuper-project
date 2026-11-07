import { describe, it, expect, beforeEach } from 'vitest';
import { WorkflowRibbon } from './WorkflowRibbon';

describe('CAD-First Metroloji İş Akışı Üst Menüsü (WorkflowRibbon)', () => {
  let ribbon: WorkflowRibbon;

  beforeEach(() => {
    ribbon = new WorkflowRibbon();
  });

  it('Varsayılan olarak 5 sıralı iş akışı adımı ile başlar', () => {
    const steps = ribbon.getSteps();
    expect(steps.length).toBe(5);
    expect(steps[0].id).toBe('step_cad');
    expect(steps[0].status).toBe('active');
    expect(steps[1].id).toBe('step_fixture');
    expect(steps[2].id).toBe('step_drawing');
    expect(steps[3].id).toBe('step_align');
    expect(steps[4].id).toBe('step_simulation');
  });

  it('advanceToStep ile önceki adımları tamamlar, aktif adımı günceller', () => {
    // 2. Adıma geç: Fikstür & Bağlama
    ribbon.advanceToStep(2);
    expect(ribbon.getSteps()[0].status).toBe('completed');
    expect(ribbon.getSteps()[1].status).toBe('active');
    expect(ribbon.getSteps()[2].status).toBe('pending');

    // 4. Adıma geç: 3-2-1 Sıfırlama
    ribbon.advanceToStep(4);
    expect(ribbon.getSteps()[0].status).toBe('completed');
    expect(ribbon.getSteps()[1].status).toBe('completed');
    expect(ribbon.getSteps()[2].status).toBe('completed');
    expect(ribbon.getSteps()[3].status).toBe('active');
    expect(ribbon.getSteps()[4].status).toBe('pending');
  });

  it('renderRibbonHtml sıralı butonları ve ok göstergelerini üretir', () => {
    const html = ribbon.renderRibbonHtml();
    expect(html).toContain('workflow-ribbon-bar');
    expect(html).toContain('Katı Model Yükle');
    expect(html).toContain('Fikstür & Bağlama');
    expect(html).toContain('Teknik Resim');
    expect(html).toContain('3-2-1 Sıfırlama');
    expect(html).toContain('Otonom Simülasyon');
    expect(html).toContain('🧪 Benchmark');
    expect(html).toContain('🩺 Teşhis');
  });

  it('setStepLabel adımların etiketini günceller ve renderHtml içine yansıtır', () => {
    ribbon.setStepLabel('step_cad', 'Katı Model: 10142739_dc_modul_plaka.stp');
    const html = ribbon.renderRibbonHtml();
    expect(html).toContain('Katı Model: 10142739_dc_modul_plaka.stp');
  });

  it('DOM elementine veya mock hedefe sorunsuz monte edilir', () => {
    const mockContainer = {
      innerHTML: '',
    };

    ribbon.mount(mockContainer as unknown as HTMLElement);
    expect(mockContainer.innerHTML).toContain('workflow-ribbon-bar');
    expect(mockContainer.innerHTML).toContain('workflow-step-btn');
    expect(mockContainer.innerHTML).toContain('Katı Model Yükle');
  });
});
