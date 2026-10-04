export interface AiStatusBadgeInfo {
  text: string;
  className: string;
  title: string;
  color: string;
  isAiActive: boolean;
}

export class AiStatusIndicator {
  private static endpoint: string = 'http://localhost:11434';

  public static formatAiStatusBadge(isAiActive: boolean): AiStatusBadgeInfo {
    if (isAiActive) {
      return {
        text: '🤖 AI Destekli (Ollama)',
        className: 'hw-pill ai-active',
        title: 'Yerel LLM (Qwen2.5-Coder) aktif: Semantik GD&T ve tolerans ayrıştırma hızlandırıldı.',
        color: '#38BDF8',
        isAiActive: true,
      };
    }
    return {
      text: '⚙️ Kural Motoru (Yerel)',
      className: 'hw-pill ai-inactive',
      title: 'Deterministik CPU Kural Motoru devrede: Güvenli ve sıfır VRAM ile çalışıyor.',
      color: '#94A3B8',
      isAiActive: false,
    };
  }

  public static async checkOllamaStatus(customUrl?: string): Promise<boolean> {
    const url = customUrl || this.endpoint;
    try {
      if (typeof fetch === 'undefined') return false;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${url}/`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const text = await res.text();
        return text.toLowerCase().includes('ollama');
      }
      return false;
    } catch {
      return false;
    }
  }

  public static async mountOrUpdateBadge(container?: HTMLElement | null): Promise<HTMLElement | null> {
    if (typeof document === 'undefined') return null;

    const targetContainer = container || document.querySelector('.titlebar-center') as HTMLElement | null;
    if (!targetContainer) return null;

    let badge = document.getElementById('ai-status-indicator') as HTMLElement | null;
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'ai-status-indicator';
      badge.style.cursor = 'pointer';
      badge.style.transition = 'all 0.2s ease';
      targetContainer.appendChild(badge);
    }

    const isAvailable = await this.checkOllamaStatus();
    const info = this.formatAiStatusBadge(isAvailable);

    badge.className = info.className;
    badge.title = info.title;
    badge.style.color = info.color;
    badge.innerHTML = `<span>${info.text}</span>`;

    return badge;
  }
}
