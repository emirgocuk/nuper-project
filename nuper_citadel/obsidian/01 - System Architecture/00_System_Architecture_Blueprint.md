---
title: 00. Nuper Citadel Sistem Mimarisi Ana Tasarımı (Blueprint)
created: 2026-09-20
tags:
  - architecture
  - blueprint
  - master-spec
  - air-gapped
  - determinism
  - local-llm
---

# 🏛️ 00. Nuper Citadel Sistem Mimarisi Ana Tasarımı (Blueprint)

Nuper Citadel; **deterministik mühendislik katmanı** ile **üretken yerel zeka katmanını** birbirinden izole eden, veri sızıntısını sıfıra indiren ve tamamen yerel donanımda (air-gapped) çalışan katmanlı bir mimari üzerinde inşa edilir.

---

## 1. Katmanlı Sistem Mimarisi Şeması

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 KULLANICI ARAYÜZÜ                                      │
│                (Tauri / Next.js Desktop Shell - 127.0.0.1:Port)                        │
│   - STEP/STP Drag & Drop           - Standart & Görev Profili Seçimi                   │
│   - 3D Geometri Önizleme           - FEA Geri Besleme & Düzenleme Arayüzü              │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ IPC / Yerel HTTP REST
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               FASTAPI YEREL ÇEKİRDEK                                  │
│                                                                                        │
│  ┌───────────────────────┐   ┌────────────────────────┐   ┌─────────────────────────┐  │
│  │ 1. CAD & GEOMETRİ     │   │ 2. DETERMINİSTİK KURAL │   │ 3. FEA ÖN-İŞLEMCİ       │  │
│  │    AYRIŞTIRICI        │   │    MOTORU (STANDART DB)│   │    JENERATÖRÜ           │  │
│  │  - pythonocc-core     │──►│  - SQLite Standart Matrisi│──►│  - PSD CSV/AFU Dışa     │  │
│  │  - OpenCASCADE        │   │  - MIL-STD-810H Metot 514 │   │    Aktarma              │  │
│  │  - Kütle, BBox, CoG,  │   │  - Sıcaklık Metot 501/502  │   │  - NX/ANSYS Yük         │  │
│  │    Delik Taraması     │   │  - Analitik Karar Ağacı│   │    Yönergesi            │  │
│  └───────────────────────┘   └───────────┬────────────┘   └─────────────────────────┘  │
│                                          │                                             │
│                                          ▼ Context Enjeksiyonu                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. YEREL AJAN & SENTEZ KATMANI                                                   │  │
│  │  - LLM Runtime: Ollama / llama.cpp (Qwen 2.5 Coder 14B / Llama 3.3 8B Quantized) │  │
│  │  - Görev: Yapılandırılmış JSON verisini resmi ETP/Analiz Doğrulama Raporuna dökme │  │
│  └───────────────────────────────────────┬──────────────────────────────────────────┘  │
│                                          │                                             │
│                                          ▼ Doğrulama / Diff                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. ADAPTİF GERİ BİLDİRİM & ÖĞRENME MOTORU (Local LoRA Pipeline)                  │  │
│  │  - Mühendisin onay/düzeltme logları (SQLite: prompt, chosen, rejected)          │  │
│  │  - Periyodik yerel LoRA/DPO veri seti derleyici                                 │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Çıktı Üretimi
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                     ÇIKTI MODÜLÜ                                       │
│   - Simcenter NX / ANSYS Uyumlu PSD Spektrum Tablosu (.csv / .txt)                     │
│   - Resmi Çevresel Test Planı (ETP - PDF / A4 Şablon)                                  │
│   - FEA Sonrası Standart Uygunluk & Risk Raporu                                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Modül Detayları ve Çalışma Prensipleri

### 1. STEP/CAD Ayrıştırıcı Modülü (`cad_engine.py`)
Modelin 3D geometriyi "tahmin etmesini" engeller, doğrudan matematiksel sınırları çıkarır.
- **Teknoloji:** `pythonocc-core` (OpenCASCADE Python C++ wrapper) veya `cadquery`.
- **Girdi:** `.step` veya `.stp` dosyası + Malzeme seçimi (Örn: Alüminyum 6061-T6, Ti-6Al-4V).
- **İşlem Mantığı:**
  1. Parça topolojisini tarar (`BRepGProp` ile kütle özellikleri).
  2. Bounding Box ($L \times W \times H$) sınırlarını çıkarır.
  3. Kütle merkezini ($CoG: x, y, z$) ve montaj deliklerinin yerleşim düzlemini hesaplar.
  4. Taban bağlantısından kütle merkezine olan yüksekliği ($h_{cg}$) bularak devrilme momenti kolunu türetir.
- **Üretilen JSON Çıktısı:**
```json
{
  "volume_mm3": 142500.0,
  "calculated_mass_kg": 0.385,
  "bounding_box_mm": {"x": 120.0, "y": 85.0, "z": 45.0},
  "cog_mm": {"x": 60.0, "y": 42.5, "z": 22.5},
  "mounting_holes": {"count": 4, "diameter_mm": 4.2, "pattern_span_mm": 70.0}
}
```

---

### 2. Deterministik Standart & Kural Motoru (`rule_engine.py`)
Mühendislik kararlarının ve askeri sınırların kesin kodlandığı alandır; halüsinasyon riski sıfırdır.
- **Teknoloji:** Python 3.11 + SQLite (Yerel ilişkisel veri tabanı: `standards.db`).
- **Veri Seti:**
  - **MIL-STD-810H Method 514.8 (Vibration):** Kategori 4 (Kamyon/Araç), Kategori 14 (Dış Yük/Jet/İHA), Kategori 20 (Helikopter).
  - **MIL-STD-810H Method 501.7 / 502.7 (High/Low Temp):** Basic Hot (A1), Cold (C1), Induced sıcaklık limitleri.
- **İşlem Mantığı:**
  - Kullanıcı arayüzden **Platform: Taktik İHA Kanat Altı** seçtiğinde:
    1. Method 514.8 Annex C, Cat 14 tablosunu çeker.
    2. Frekans kırılma noktalarını ($f_1 = 20\text{ Hz}$, $f_2 = 150\text{ Hz}$, $f_3 = 1000\text{ Hz}$, $f_4 = 2000\text{ Hz}$) ve ilgili PSD eğimlerini ($+6\text{ dB/oct}$, $0.04\text{ }g^2/\text{Hz}$, $-6\text{ dB/oct}$) çıkarır.
    3. Toplam $g_{\text{rms}}$ değerini ($7.7\text{ }g_{\text{rms}}$) ve eksen başına test süresini (1 saat) belirler.

---

### 3. FEA Ön-İşlemci Jeneratörü (`fea_bridge.py`)
Analiz mühendisinin Simcenter NX veya ANSYS'e doğrudan veri aktarmasını sağlayan köprüdür.
- **İşlev 1 (PSD Fonksiyon Dosyası):** Standardın logaritmik kırılma noktalarını interpolasyonla 100+ ayrık noktaya böler ve NX Response Simulation / ANSYS Random Vibration modüllerinin doğrudan okuduğu `.csv` dosyasını oluşturur:
```csv
## Nuper Citadel - MIL-STD-810H Cat 14 PSD Table
Frequency(Hz),PSD(g^2/Hz)
20.00,0.0053
150.00,0.0400
1000.00,0.0400
2000.00,0.0100
```
- **İşlev 2 (Simcenter NX Kurulum Yönergesi):** Parçanın 4 adet montaj deliğine **User Defined Constraint (Fixed)** uygulanması gerektiğini, analizin 0–2500 Hz arasında en az **%85 kütle katılımı (Effective Mass)** sağlayacak mod sayısıyla çözülmesini öneren teknik notları derler.

---

### 4. Yerel LLM ve Doğrulama Katmanı (`agent_core.py`)
Mühendislik dilini bilen, raporlayan ve sentezleyen yerel model.
- **Teknoloji:** Ollama veya dahili `llama.cpp` kütüphanesi.
- **Model:** Qwen 2.5 Coder 14B-Instruct (4-bit Q4_K_M) veya Llama 3.3 8B.
- **Prompt Mimarisi:** Modele açık uçlu sohbet ettirilmez; sadece `cad_engine` ve `rule_engine` çıktısı olan JSON verisi verilir:
```text
[SİSTEM]: Sen savunma sanayii kalifikasyon uzmanısın. 
Girdi olarak verilen parça geometrisini ve MIL-STD test parametrelerini kullanarak,
akredite test merkezine sunulacak resmi Çevresel Test Planı (ETP) metnini oluştur.
[GİRDİ]: { ...cad_summary_json, ...standard_rules_json... }
```

---

### 5. Adaptif Geri Bildirim & Öğrenme Motoru (Local LoRA Pipeline)
Kullanıcı rapordaki bir paragrafı düzelttiğinde arayüz şu kaydı yerel veritabanına (`telemetry.db`) atar:
- `prompt`: Sistemin girdiği parametreler.
- `rejected`: Modelin ilk ürettiği taslak.
- `chosen`: Mühendisin son kaydettiği onaylı metin.
Bu veriler zamanla yerel DPO / LoRA eğitimi için derlenerek sistemin şirket içi tolerans kültürüne uyum sağlamasını gerçekleştirir.

---

## 4. Citadel’in Mühendislik Beyni (Genişletilmiş Karar Akışı)

```
[CAD / STEP Geometrisi] + [Operasyonel Görev Şartı]
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
   [Geometri & Kütle]             [Askeri Standart DB]
   - CoG & Moment Kolu            - Titreşim / Şok Matrisi
   - Delik ve Fikstür Arayüzü     - Sıcaklık Limitleri
         │                                 │
         └────────────────┬────────────────┘
                          ▼
            ┌───────────────────────────┐
            │   CITADEL ANALİTİK MOTOR  │
            │  1. Fikstür İsterleri     │
            │  2. PSD & Çözücü Girdisi  │
            │  3. Yorulma & Risk Sınırı │
            └─────────────┬─────────────┘
                          │
                          ▼
             [FEA Çözücü Geri Beslemesi]
             (Doğal Frekanslar & 3-Sigma Stres)
                          │
                          ▼
            ┌───────────────────────────┐
            │    NİHAİ SAVUNMA RAPORU   │
            │  - Test Merkezi Kabul Föyü│
            │  - Kümülatif Hasar (D)    │
            │  - Standart İtiraz Dayanağı│
            └───────────────────────────┘
```

---

## 5. Kalifikasyon Kalkanı Katmanları (The Citadel Shield)

Bu kavramsal katmanlar eklendiğinde Nuper Citadel; mühendise sadece "test parametresi veren" bir rehber olmaktan çıkar, parçanın tasarımından fikstürlenmesine, FEA doğrulamasından olası kalite itirazına kadar tüm kalifikasyon sürecini koruma altına alan gerçek bir **savunma kalkanına (Citadel)** dönüşür:

1. **[[Fixture_Design_and_Resonance_Envelope|Fikstür Tasarım İsterleri & Rezonans Güvenlik Zarfı]]:** Sarsıcı tablaların standart $50 \times 50\text{ mm}$ grid arayüzü ile parça deliklerini eşleyerek rezonans modunu $>2400\text{ Hz}$'e taşıyan minimum et kalınlığı ve malzeme zarfı üretimi.
2. **[[GDT_and_CMM_Tolerance_Bridge|İmalat Toleransı & CMM Doğrulama Entegrasyonu (GD&T Bridge)]]:** Gerçek imalattan çıkan CMM ölçüm sapmalarını (ör. $-0.15\text{ mm}$ et kalınlığı) alıp FEA kütle/rijitlik matrisini ve %14 yorulma ömrü düşüşünü hesaplama.
3. **[[Combined_Environmental_Profiles|Çoklu Çevresel Koşul Kombinasyonları]]:** Aşırı soğuk ($-40^\circ\text{C}$) ve çöl sıcağında ($+71^\circ\text{C}$) Alüminyum/Çelik genleşme farkının cıvata ön yükü ve gevşeme üzerindeki etkisini titreşimle birleşik analiz etme.
4. **[[Palmgren_Miner_Fatigue_Life|Malzeme Yorulma Ömrü & Miner Kümülatif Hasar Kuralı]]:** Normal dağılımlı $1\sigma, 2\sigma, 3\sigma$ gerilmeleri Basquin S-N eğrisiyle eşleyerek kümülatif hasar indeksi ($D < 0.20$) ve uçuş saati ömrü tahmini.
5. **[[Audit_and_Objection_Defense_Engine|Askeri İhale ve Savunma İtiraz Veri Tabanı]]:** Shaker ivmeölçer anomalisinde ($\pm 3\text{ dB}$ pikler) MIL-STD-810H standart maddelerine dayalı resmi teknik itiraz metni ve TDP şartname denetimi.

---

## 6. Kod Tabanı Dizin Mimarisi

```text
nuper-citadel/
├── AGENTS.md                  # Proje ilkeleri ve Memory Bank kuralları
├── README.md                  # Kök karşılama ve rehber
├── obsidian/                  # Obsidian Mühendislik Kasası ve Hafıza Bankası
├── src-tauri/                 # Masaüstü yerel kabuk (Rust/Tauri)
├── frontend/                  # Arayüz (Next.js / Tailwind / Three.js STEP Viewer)
├── engine/                    # Yerel Python Servisi (FastAPI)
│   ├── api/
│   │   └── routes.py          # REST endpoint'leri
│   ├── core/
│   │   ├── cad_parser.py      # pythonocc-core STEP analiz motoru
│   │   ├── rule_engine.py     # MIL-STD-810 kural ve karar ağacı
│   │   ├── fea_exporter.py    # CSV / AFU / APDL spektrum üreticisi
│   │   ├── fatigue_engine.py  # Palmgren-Miner S-N yorulma motoru
│   │   └── fixture_engine.py  # Fikstür zarfı ve rezonans doğrulayıcı
│   ├── data/
│   │   ├── standards.db       # SQLite askeri standartlar kütüphanesi
│   │   ├── materials.db       # S-N katsayıları, CTE ve akma dayanımları
│   │   └── telemetry.db       # DPO için mühendis düzeltme logları
│   └── llm/
│       ├── local_client.py    # Ollama / llama.cpp REST köprüsü
│       ├── prompts.py         # Deterministik sistem şablonları
│       └── objection_agent.py # Askeri itiraz ve TDP denetim sentezleyici
└── models/                    # Yerel quantize model ağırlıkları (.gguf)
```

---
Bağlantılı Notlar:
- [[06_Data_Flow_End_to_End|06. Uçtan Uca Veri Akış Şeması]]
- [[Fixture_Design_and_Resonance_Envelope|Fikstür Tasarım İsterleri]]
- [[GDT_and_CMM_Tolerance_Bridge|GD&T ve CMM Köprüsü]]
- [[Combined_Environmental_Profiles|Çoklu Çevresel Koşullar]]
- [[Palmgren_Miner_Fatigue_Life|Malzeme Yorulma Ömrü]]
- [[Audit_and_Objection_Defense_Engine|Askeri İhale ve Savunma İtirazı]]
- [[00_Nuper_Citadel_MOC|Master MOC]]
