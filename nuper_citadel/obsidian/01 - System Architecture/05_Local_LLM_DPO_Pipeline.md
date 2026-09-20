---
title: 05. Yerel LLM ve Adaptif Öğrenme (DPO) Hattı
created: 2026-09-20
tags:
  - architecture
  - local-llm
  - dpo
  - lora
  - ollama
  - air-gapped
---

# 🤖 05. Yerel LLM ve Adaptif Öğrenme (DPO) Hattı (`agent_core.py`)

Nuper Citadel'in yapay zekâ katmanı, **asla sayısal toleransları veya PSD spektrumlarını türetmez**. Yapay zekânın tek ve en güçlü görevi; deterministik motorların (`cad_parser` ve `rule_engine`) ürettiği doğrulanmış teknik JSON verilerini alıp, savunma sanayii dilinde **resmi Çevresel Test Planı (ETP)**, arıza modu analizi ve test merkezi kabul raporuna dönüştürmektir.

```
       ┌───────────────────────────────┐
       │   DETERMİNİSTİK JSON CONTEXT  │
       │   (Kütle, CoG, Delikler,      │
       │    MIL-STD PSD Parametreleri) │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │     YEREL MODEL RUNTIME       │
       │  (Ollama / llama-cpp-python)  │
       │  - Qwen 2.5 Coder 14B Q4_K_M  │
       │  - Air-Gapped (Çevrimdışı)    │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │     İLK METİN ÇIKTISI         │
       │  (Resmi Test Planı Taslağı)   │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │    MÜHENDİS DÜZENLEME & ONAY  │
       │  - Paragrafı düzeltme/onay    │
       └───────┬───────────────┬───────┘
               │               │
       [Seçilen Metin]   [İlk Taslak]
         ("chosen")      ("rejected")
               │               │
               ▼               ▼
       ┌───────────────────────────────┐
       │     SQLITE: telemetry.db      │
       │   (Yerel DPO Veri Seti Havuzu)│
       └───────────────┬───────────────┘
                       │
                       ▼ (Periyodik Yerel Script)
       ┌───────────────────────────────┐
       │    YEREL LORA / DPO EĞİTİMİ   │
       │  (Şirket İç Terminolojisine   │
       │   Uyum Sağlayan Özel Model)   │
       └───────────────────────────────┘
```

---

## 1. Neden Qwen 2.5 Coder 14B?
1. **Teknik Şartname ve Yapılandırılmış Veri Hakimiyeti:** Qwen 2.5 Coder serisi, kod ve yapılandırılmış JSON verilerini Markdown tablolarına ve mühendislik dokümanlarına dönüştürmede piyasadaki en yetenekli açık kaynaklı modellerdendir.
2. **Yerel İş İstasyonu Verimliliği:** 4-bit quantized (Q4_K_M) sürümü yaklaşık 9 GB VRAM kaplar. RTX 3060/4060 veya 16GB VRAM'li kurumsal NVIDIA kartlarında 35-45 token/saniye hızla çalışır.
3. **Alternatif:** VRAM kısıtlı iş istasyonları için `Llama 3.3 8B Q4_K_M` (~5.5 GB VRAM) veya saf CPU çalışması için `Qwen 2.5 7B`.

---

## 2. Strict Prompt Mimarisi

Modele açık uçlu sohbet veya varsayım alanı bırakılmaz. Sistem promptu şu katı kurallarla beslenir:

```text
[SİSTEM]: Sen T.C. Savunma Sanayii standartlarına (özellikle MIL-STD-810H) tam hakim bir Çevresel Kalifikasyon ve Test Başmühendisisin.
Görevin: Girdi olarak sana verilen doğrulanmış JSON verilerini kullanarak, TÜBİTAK SAGE, TRTEST veya Ana Yükleniciye sunulacak resmi Çevresel Test Planı (ETP) metnini oluşturmaktır.

KESİN KURALLAR:
1. Asla JSON girdisi dışından sayısal tolerans, frekans veya ivme uydurma.
2. Tüm başlıklar askeri şartname formatında olmalıdır (1. Amaç, 2. Test Edilen Birim, 3. Fikstür İsterleri, 4. Test Profili ve Toleransları, 5. Başarı ve Kabul Kriterleri).
3. Parçanın CoG mesafesini ve montaj deliklerini göz önünde bulundurarak fikstür rijitlik tavsiyesini açıkça belirt.
4. Çıktıyı doğrudan Markdown formatında üret.

[GİRDİ]:
{
  "cad": { ... },
  "standard": { ... },
  "fea_recommendations": { ... }
}
```

---

## 3. Yerel DPO (Direct Preference Optimization) Öğrenme Döngüsü

Nuper Citadel'in en devrimci yönü, şirketin kurum içi teknik dilini zamanla benimsemesidir. 

### Veri Tabanı Şeması (`telemetry.db`):
```sql
CREATE TABLE dpo_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    prompt_context TEXT NOT NULL,       -- Giriş JSON ve sistem promptu
    rejected_output TEXT NOT NULL,      -- Modelin ilk ürettiği metin
    chosen_output TEXT NOT NULL,        -- Mühendisin onayladığı / düzelttiği metin
    diff_summary TEXT,                  -- Değişen kelime/cümle farkları
    engineer_role TEXT                  -- "Lead Qualification Engineer"
);
```

### Örnek Öğrenme Vakası:
- **Modelin İlk Metni (Rejected):** *"Titreşim testi öncesi ve sonrası parçada çatlak kontrolü yapılmalıdır."*
- **Mühendisin Revizyonu (Chosen):** *"Titreşim testi öncesi ve sonrası MIL-STD-810H Metot 514.8 Paragraf 4.2 uyarınca penetrant sıvı kontrolü (NDT) ve montaj cıvatalarında %10 tork kaybı kontrolü yapılacaktır."*
- **Kazanım:** Bu tercih kaydı yerel veritabanında saklanır. Ayda bir kez yerel donanımda koşturulan hafif bir LoRA eğitimi ile model, bir sonraki sefere doğrudan şirketin NDT ve tork kontrolü protokolünü kendi refleksine dönüştürür.

---
Bağlantılı Notlar:
- [[Environmental_Test_Plan_ETP_Spec|Resmi ETP Şablonu Detayları]]
- [[01_Tauri_Desktop_Shell|01. Tauri & Next.js Masaüstü Kabuğu]]
- [[06_Data_Flow_End_to_End|06. Uçtan Uca Veri Akış Şeması]]
