import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AiStatusIndicator } from './AiStatusIndicator';

describe('AiStatusIndicator (Pure Utility)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Ollama aktif olduğunda AI Destekli rozetini doğru formatlar', () => {
    const info = AiStatusIndicator.formatAiStatusBadge(true);
    expect(info.isAiActive).toBe(true);
    expect(info.text).toContain('AI Destekli');
    expect(info.className).toContain('ai-active');
  });

  it('Ollama pasif olduğunda Kural Motoru (Yerel) rozetini doğru formatlar', () => {
    const info = AiStatusIndicator.formatAiStatusBadge(false);
    expect(info.isAiActive).toBe(false);
    expect(info.text).toContain('Kural Motoru (Yerel)');
    expect(info.className).toContain('ai-inactive');
  });

  it('checkOllamaStatus HTTP başarılı olduğunda true döner', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'Ollama is running',
    } as unknown as Response);

    const status = await AiStatusIndicator.checkOllamaStatus('http://localhost:11434');
    expect(status).toBe(true);
  });

  it('checkOllamaStatus bağlantı koptuğunda fail-safe false döner', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'));

    const status = await AiStatusIndicator.checkOllamaStatus('http://localhost:11434');
    expect(status).toBe(false);
  });
});
