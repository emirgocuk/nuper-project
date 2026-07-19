export interface FeasibilityResult {
  budget: string;
  time: string;
  roles: string[];
  difficulty: number;
  report: string;
}

export interface TrendAnalysisResult {
  summary: string;
  feasibility: string;
  score: number;
  category: string;
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Aktif, ücretsiz OpenRouter modelleri (öncelik sırasıyla).
 * Bir model 404 veya rate-limit verirse otomatik bir sonrakine geçilir.
 */
const FREE_MODEL_FALLBACKS = [
  "tencent/hy3:free",           // 295B MoE - Güçlü genel amaçlı model
  "poolside/laguna-xs-2.1:free", // 33B coding odaklı - kalıcı ücretsiz
  "cohere/north-mini-code:free", // Cohere 30B - kalıcı ücretsiz
  "nex-agi/nex-n2-mini",        // 7B agentic model - çok ucuz ($0.025/1M)
];

/**
 * Helper to call OpenRouter API with a prompt.
 * Birden fazla modeli sırayla dener (fallback zinciri).
 */
async function callOpenRouter(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not defined in environment variables.");
  }

  // Ortam değişkeni varsa onu kullan, yoksa fallback zincirini dene
  const modelsToTry = process.env.OPENROUTER_MODEL
    ? [process.env.OPENROUTER_MODEL, ...FREE_MODEL_FALLBACKS]
    : FREE_MODEL_FALLBACKS;

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://nuper.vercel.app",
          "X-Title": "Nuper",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.error?.message || errorText;
        } catch { /* errorText is not JSON */ }

        // 404 (model bulunamadı) veya 429 (rate limit) → sonraki modeli dene
        if (response.status === 404 || response.status === 429) {
          console.warn(`[OpenRouter] Model "${model}" başarısız (${response.status}), sonraki deneniyor...`);
          lastError = new Error(`OpenRouter API error: ${response.status} - ${errorMessage}`);
          continue;
        }
        throw new Error(`OpenRouter API error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.warn(`[OpenRouter] Model "${model}" boş yanıt döndürdü, sonraki deneniyor...`);
        lastError = new Error("OpenRouter returned an empty response.");
        continue;
      }

      return content.trim();
    } catch (err: any) {
      // Fetch hatası (network vs.) → devam et
      lastError = err;
      console.warn(`[OpenRouter] Model "${model}" hata verdi:`, err.message);
    }
  }

  throw lastError || new Error("Tüm OpenRouter modelleri başarısız oldu.");
}

/**
 * Analyzes a project's feasibility, budget, timeframe, and resource needs.
 */
export async function analyzeProjectFeasibility(title: string, description: string): Promise<FeasibilityResult> {
  const systemPrompt = `You are the Nuper Industries AI Feasibility Analyzer. 
You must analyze the given project and provide a JSON response in Turkish.
Respond ONLY with a valid JSON object matching this structure, with no markdown wrappers or additional text:
{
  "budget": "Tahmini bütçe aralığı (örn: '$5,000 - $10,000')",
  "time": "Tahmini yapım süresi (örn: '3-4 ay')",
  "roles": ["Gerekli teknik rol 1", "Gerekli teknik rol 2"],
  "difficulty": 75, // 1-100 arası teknik zorluk derecesi
  "report": "Kısa ve öz fizibilite raporu (teknik mimari, pazar uyumu ve öneriler)"
}`;

  const prompt = `Project Title: ${title}\nDescription: ${description}`;

  try {
    const responseText = await callOpenRouter(prompt, systemPrompt);
    // Strip markdown JSON code blocks if present
    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText) as FeasibilityResult;
  } catch (error: any) {
    console.error("AI Project Analysis failed:", error);
    // Return a fallback result if AI fails
    return {
      budget: "Hesaplanamadı (AI hatası)",
      time: "Belirlenemedi",
      roles: ["Genel Geliştirici"],
      difficulty: 50,
      report: `Fizibilite analizi oluşturulurken hata oluştu: ${error.message}`
    };
  }
}

/**
 * Analyzes a technology news article or trend to see if it is viable for Nuper Industries.
 */
export async function analyzeTrendViability(title: string, content: string): Promise<TrendAnalysisResult> {
  const systemPrompt = `You are the Nuper Industries Tech Intelligence & Literature Agent.
Your job is to analyze the given technology news or project idea and evaluate its technical viability/feasibility for Nuper Industries (a boutique tech R&D and incubation start-up).
Specifically focus on mapping the academic literature, whitepapers, official technical documentations, and code repositories (technical bibliography) that one should study to understand or implement this technology.
Also, assign the technology/development to exactly one of the following MDPI-style technical subjects: "Sağlık & Tıp", "Yazılım & Yapay Zeka", "Enerji & Çevre", "Biyoteknoloji & Yaşam Bilimleri", "Malzeme Bilimi & Fizik", "Elektronik & Donanım", "Uzay & Havacılık", "Ekonomi & İş Modelleri".
Respond ONLY with a valid JSON object in Turkish matching this structure, with no markdown wrappers or backticks:
{
  "summary": "Teknoloji gelişmesinin Türkçe kısa teknik özeti.",
  "feasibility": "Teknik uygulanabilirlik ve pazar potansiyeli analizi. Ardından, mutlaka '### 📚 Önerilen Literatür & Kaynakça' başlığı ekleyerek okunması gereken arXiv makaleleri, resmi teknik dökümanlar ve referans GitHub depolarına ait spesifik bağlantılar/öneriler (Markdown formatında).",
  "score": 85, // 1-100 arası teknik fizibilite skoru
  "category": "Sağlık & Tıp" // Must be exactly one of the values listed above
}`;

  const prompt = `Title: ${title}\nContent Summary: ${content}`;

  try {
    const responseText = await callOpenRouter(prompt, systemPrompt);
    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText) as TrendAnalysisResult;
  } catch (error: any) {
    console.error("AI Trend Analysis failed:", error);
    return {
      summary: "Özet oluşturulamadı.",
      feasibility: `Haber analizi sırasında hata oluştu: ${error.message}`,
      score: 0,
      category: "Yazılım & Yapay Zeka"
    };
  }
}

export interface ExtractedEntity {
  name: string;
  type: "PERSON" | "ORGANIZATION" | "WEBSITE" | "STATE";
  url: string | null;
  reason: string;
}

export interface EntityExtractionResult {
  entities: ExtractedEntity[];
}

/**
 * Extracts key entities (people, organizations, states, websites) and their associated URLs from a news trend.
 */
export async function extractEntitiesFromTrend(title: string, content: string): Promise<EntityExtractionResult> {
  const systemPrompt = `You are the Nuper Industries Entity Extraction Agent.
Analyze the given news article title and content. Extract any notable people (thought leaders, researchers), organizations, states, or specific websites/URLs mentioned.
For each entity found, try to determine their official URL or homepage (use your knowledge base if not present in text).
Return ONLY a valid JSON object matching this structure, with no markdown formatting or code blocks:
{
  "entities": [
    {
      "name": "Entity Name (e.g. İlber Ortaylı, arXiv)",
      "type": "PERSON | ORGANIZATION | WEBSITE | STATE",
      "url": "https://example.com (Official homepage URL or null if completely unknown)",
      "reason": "Haberde geçme nedeni ve neden önemli olduğu (Türkçe kısa açıklama)"
    }
  ]
}`;

  const prompt = `Title: ${title}\nContent: ${content}`;

  try {
    const responseText = await callOpenRouter(prompt, systemPrompt);
    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText) as EntityExtractionResult;
  } catch (error: any) {
    console.error("AI Entity Extraction failed:", error);
    return { entities: [] };
  }
}

