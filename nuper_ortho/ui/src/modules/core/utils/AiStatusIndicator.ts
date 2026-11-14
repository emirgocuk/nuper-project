export interface AiStatusBadgeInfo {
  text: string;
  className: string;
  title: string;
  color: string;
  isAiActive: boolean;
}

export class AiStatusIndicator {
  private static endpoint: string = 'http://127.0.0.1:11434';

  public static formatAiStatusBadge(isAiActive: boolean): AiStatusBadgeInfo {
    if (isAiActive) {
      return {
        text: '🤖 AI Destekli | GPU: Aktif | Yerel AI + Öğrenen Motor',
        className: 'hw-pill ai-active',
        title: 'Yerel Ollama AI (Qwen2.5-Coder / Qwen2.5-VL) + Active Learning Motoru aktif.',
        color: '#38BDF8',
        isAiActive: true,
      };
    }
    return {
      text: '⚙️ Kural Motoru (Yerel) | Öğrenen Motor',
      className: 'hw-pill ai-inactive',
      title: 'Deterministik CPU Kural Motoru + Öğrenen Motor devrede.',
      color: '#94A3B8',
      isAiActive: false,
    };
  }

  public static async checkOllamaStatus(customUrl?: string): Promise<boolean> {
    const url = (customUrl || this.endpoint).replace(/\/+$/, '');
    try {
      if (typeof fetch === 'undefined') return false;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      try {
        const tagsRes = await fetch(`${url}/api/tags`, {
          method: 'GET',
          signal: controller.signal,
        });
        if (tagsRes.ok) {
          const raw = typeof tagsRes.text === 'function' ? await tagsRes.text() : '';
          if (raw.toLowerCase().includes('ollama')) {
            return true;
          }
          try {
            const parsed = JSON.parse(raw) as { models?: unknown[] };
            if (Array.isArray(parsed?.models)) {
              return parsed.models.length > 0;
            }
          } catch {
          }
        }
      } finally {
        clearTimeout(timeoutId);
      }

      const rootController = new AbortController();
      const rootTimeout = setTimeout(() => rootController.abort(), 1000);
      try {
        const res = await fetch(`${url}/`, {
          method: 'GET',
          signal: rootController.signal,
        });
        if (res.ok) {
          const text = await res.text();
          return text.toLowerCase().includes('ollama');
        }
        return false;
      } finally {
        clearTimeout(rootTimeout);
      }
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

    const gpuEl = document.getElementById('gpu-indicator');
    if (gpuEl) {
      gpuEl.textContent = isAvailable ? 'GPU: Aktif | Yerel AI + Öğrenen Motor' : 'GPU: Yerel AI + Öğrenen Motor';
      gpuEl.style.color = isAvailable ? '#34D399' : '#94A3B8';
    }

    return badge;
  }
}
