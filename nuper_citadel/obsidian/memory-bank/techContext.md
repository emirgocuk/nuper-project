# Tech Context: Nuper Citadel

## 1. Teknoloji Yığını (Tech Stack)

### İstemci ve Masaüstü Kabuğu (Desktop Shell & Frontend)
- **Arayüz Çerçevesi:** **React 19 + Vite + TypeScript**
  - Ultra hızlı HMR, tip güvenliği ve reaktif durum yönetimi.
- **Stil & Tasarım:** **Tailwind CSS v4 + Lucide React**
  - Havacılık ve savunma seviyesinde aydınlık stüdyo teması (`#f8fafc`, `#0f172a`, saten alüminyum, yüksek kontrast).
- **3D Görselleştirme:** **Three.js (0.174+)**
  - Gerçek OpenCASCADE BRep triangulated mesh (`BufferGeometry`), çoklu parça montaj renklendirmesi, bileşik CoG küresi, delik yönelim halkaları, koordinat HUD paneli.
- **Masaüstü Kabuğu (Yol Haritası Hedefi):** **Tauri v2 (Rust)**
  - Minimum bellek tüketimi (~30MB RAM vs Electron 300MB+), gömülü Python/Ollama yönetimi, tek tıkla `.exe` / `.msi` kurulumu.

### Yerel Çekirdek Servisi (Local Backend Engine)
- **Çalışma Zamanı:** **Python 3.11 / 3.13** (Air-gapped yerel ortam).
- **Web Çerçevesi:** **FastAPI + Uvicorn + Pydantic v2**
  - Asenkron REST endpoint'leri (`127.0.0.1:8765`), katı veri tipleri, sıfır dış ağ bağlantısı.
- **CAD & Montaj Geometri Kütüphanesi:** **pythonocc-core 7.7.x / OCP (OpenCASCADE 7.7 C++ Wrapper)**
  - STEP/STP BRep manifold kontrolü (`BRepCheck`), kütle ve CoG özellikleri (`BRepGProp`), topolojik delik taraması (`TopExp_Explorer`), dış radyüs eliminasyonu (`TopAbs_REVERSED`), gerçek yüzey meshleme (`BRepMesh_IncrementalMesh`).
  - **AssemblyEngine:** Çoklu katı gövdeli tek STEP ve çoklu STEP dosyalarının bileşik CoG integrali ve cıvata eşlemesi.
- **Resmi Dokümantasyon & PDF Motoru:** **ReportLab 4.x**
  - Saf Python ile vektörel A4 PDF üretimi. Sistem düzeyinde GTK/Cairo/Pango gibi C bağımlılıkları gerektirmez; air-gapped savunma iş istasyonlarında sıfır konfigürasyonla çalışır.
- **Veritabanları (SQLite 3 - WAL Mode):**
  - `engine/data/standards.db`: MIL-STD-810H, RTCA DO-160G, STANAG 4370 ve özel şirket profilleri.
  - `engine/data/materials.db`: 13 MMPDS alaşımı ve kompoziti (Al, Ti, Çelik, Kovar, Invar, Inconel, CuBe2, PEEK, CFRP) ve kullanıcı özel malzemeleri.
  - `engine/data/telemetry.db`: Mühendis tercih logları (DPO veri seti: `prompt`, `chosen`, `rejected`).
- **Güvenlik & Kriptografi:** **cryptography (RSA-2048 & SHA-256)**
  - Anakart UUID, CPU ID ve MAC adresinden donanım parmak izi türetme ve çevrimdışı `.lic` lisans doğrulama.

### Yerel Yapay Zekâ Katmanı (Local LLM Runtime)
- **Çalışma Motoru:** **Ollama** veya dahili **`llama-cpp-python`** (`127.0.0.1:11434`).
- **Hedef Modeller:**
  - Birincil: `qwen2.5-coder:7b` / `14b` (CUDA hızlandırmalı, 4-bit quantize).
  - Yedek / CPU: `llama3.3:8b` (AVX2/AVX-512).
- **Yedek Mekanizması:** LLM çevrimdışı olsa dahi %100 deterministik acil durum şablon motoru (`prompts.py`) devreye girer; sistem asla kilitlenmez.

---

## 2. API Endpoint Haritası (`127.0.0.1:8765`) - Toplam 24 Endpoint

| Endpoint | Metot | Açıklama |
| :--- | :---: | :--- |
| `/api/health` | GET | Servis ve çalışma durumu kontrolü |
| `/api/platforms` | GET | Standart ve platform listesi (`?standard=...` filtresi destekli) |
| `/api/standards/custom` | POST | Kullanıcı tanımlı özel standart platformu ve profili ekleme |
| `/api/materials` | GET | Malzeme ve mekanik özellik matrisi |
| `/api/materials/custom` | POST | Kullanıcı tanımlı özel test kuponu malzemesi kaydetme |
| `/api/cad/parse` | POST | STEP dosyasını ayrıştırma (Kütle, CoG, Delikler) |
| `/api/cad/upload` | POST | STEP dosyası yükleme ve geçici dizinde işleme |
| `/api/cad/upload-assembly` | POST | Çoklu STEP veya montaj dosyalarını yükleme ve birleşik analiz |
| `/api/fasteners/calculate` | POST | Montaj deliklerine DIN 912 cıvata ve tork hesabı |
| `/api/drawing/parse` | POST | 2D Teknik Resim PDF/Görsel GD&T çıkarımı |
| `/api/rules/evaluate` | POST | Görev profili ve standart sınır şartı eşleme |
| `/api/fea/export-psd` | POST | 120-noktalı PSD CSV ve ANSYS APDL kodu üretimi |
| `/api/fea/evaluate-post` | POST | Post-FEA rezonans, Q faktörü ve notching hesabı |
| `/api/fea/upload-solver-log` | POST | **Doğrudan NASTRAN .f06 ve ANSYS modal log yükleme ve ayrıştırma (YENİ)** |
| `/api/qualification/thermal-check` | POST | **MIL-STD-810H Metot 501.7/502.7 ısıl genleşme ve cıvata ön yük hesabı (YENİ)** |
| `/api/fixture/envelope` | POST | Shaker tabla grid eşleme ve $t_{\min}$ kalınlık hesabı |
| `/api/fatigue/calculate` | POST | Steinberg 3-bant ve Palmgren-Miner S-N hasar analizi |
| `/api/gdt/verify-cmm` | POST | CMM delik sapmaları ve ASME Y14.5 MMC denetimi |
| `/api/llm/status` | GET | Yerel Ollama servis ve model durumu |
| `/api/llm/generate-etp` | POST | Askeri ETP rapor sentezi |
| `/api/llm/generate-objection` | POST | Shaker anomalisi itiraz ve çentikleme savunma mektubu |
| `/api/feedback/submit` | POST | DPO mühendis düzeltme çifti kaydı |
| `/api/license/machine-id` | GET | Çevrimdışı donanım parmak izi sorgulama |
| `/api/license/verify` | POST | RSA-2048 lisans anahtarı doğrulama |
| `/api/export/etp/pdf` | POST | Resmi Askeri A4 PDF ETP Raporu İndirme |

---

## 3. Dizin ve Dosya Mimarisi

```
nuper-citadel/
├── AGENTS.md                                # Proje ilkeleri ve Memory Bank kuralları
├── README.md                                # Proje tanıtımı ve kurulum kılavuzu
├── .gitignore                               # Git yoksayma kuralları (cad_models dahil)
├── run_citadel.bat                          # Tek tıkla yerel masaüstü başlatıcı
├── scripts/                                 # Masaüstü ve operasyon scriptleri
│   ├── desktop_launcher.py                  # Zombi-önleme child process yöneticisi
│   ├── generate_icons.py                    # Askeri siber kalkan ikon üreticisi
│   └── export_dpo_dataset.py                # telemetry.db DPO LoRA ihraç scripti
├── src-tauri/                               # Tauri 2 Masaüstü Dağıtım Ağacı
│   ├── Cargo.toml                           # Tauri 2 Rust paket tanımı
│   ├── tauri.conf.json                      # 1440x920, CSP 127.0.0.1, tray yapılandırması
│   ├── build.rs                             # Standart Tauri derleme scripti
│   ├── icons/                               # icon.png, 128x128, 32x32, icon.ico
│   └── src/
│       ├── lib.rs                           # Python backend yöneticisi ve tray menüsü
│       └── main.rs                          # Tauri ana giriş noktası
├── obsidian/                                # Obsidian Mühendislik Kasası
│   ├── nuper_citadel_review.md              # Kapsamlı teknik inceleme ve yol haritası
│   └── memory-bank/                         # Kesintisiz bağlam hafıza bankası
│       ├── projectbrief.md
│       ├── productContext.md
│       ├── activeContext.md
│       ├── systemPatterns.md
│       ├── techContext.md
│       └── progress.md
├── cad_models/                              # Örnek ve gerçek CAD/Teknik Resim modelleri
├── engine/                                  # Yerel Python Servisi (FastAPI)
│   ├── main.py                              # Uygulama giriş noktası ve CORS
│   ├── api/
│   │   ├── routes.py                        # 24 REST endpoint'i
│   │   └── schemas.py                       # Pydantic v2 veri şemaları
│   ├── core/
│   │   ├── cad_parser.py                    # OpenCASCADE BRep analiz motoru
│   │   ├── assembly_engine.py               # Çoklu parça & montaj CoG/cıvata motoru
│   │   ├── thermal_engine.py                # MIL-STD-810H Metot 501/502 termal analiz motoru (YENİ)
│   │   ├── drawing_parser.py                # 2D teknik resim GD&T çıkarıcı
│   │   ├── fastener_engine.py               # DIN 912 / ISO 273 cıvata/tork motoru
│   │   ├── rule_engine.py                   # Çoklu standart karar motoru
│   │   ├── fea_exporter.py                  # PSD CSV / APDL kod üreticisi
│   │   ├── fixture_engine.py                # Sarsıcı tabla fikstür rezonans motoru
│   │   ├── fatigue_engine.py                # Steinberg & Palmgren-Miner yorulma
│   │   ├── gdt_bridge.py                    # ASME Y14.5 MMC CMM köprüsü
│   │   ├── license_engine.py                # RSA-2048 offline lisans motoru
│   │   ├── post_fea_engine.py               # Post-FEA + NASTRAN .f06 / ANSYS ayrıştırıcı
│   │   ├── pdf_report_generator.py          # ReportLab resmi savunma A4 PDF motoru
│   │   └── feedback_engine.py               # DPO telemetry.db kayıt motoru
│   ├── training/                            # Yerel LLM Fine-Tuning Veri Seti
│   │   ├── dpo_preference_dataset.jsonl     # HuggingFace / Unsloth formatı
│   │   └── lora_dpo_config.json             # Qwen 2.5 7B LoRA parametreleri
│   ├── data/
│   │   ├── standards.db                     # SQLite askeri & havacılık standartları
│   │   ├── materials.db                     # SQLite 13 MMPDS malzemesi
│   │   └── telemetry.db                     # SQLite DPO tercih çiftleri
│   └── llm/
│       ├── local_client.py                  # Ollama REST köprüsü
│       ├── prompts.py                       # Deterministik prompt şablonları
│       └── objection_agent.py               # Aşırı test itiraz savunma ajanı
├── frontend/                                # Modern React / Vite İş İstasyonu
│   ├── src/
│   │   ├── App.tsx                          # 5 Aşamalı Sıralı Analiz İş İstasyonu
│   │   ├── index.css                        # Tailwind v4 stilleri
│   │   └── components/
│   │       ├── CADViewer3D.tsx              # Three.js 3D interaktif CAD motoru
│   │       ├── FastenerTable.tsx            # Cıvata ve tork tablosu
│   │       └── DrawingViewer.tsx            # 2D teknik resim inceleyici
│   └── package.json                         # Tauri CLI/API, React 19, Tailwind v4
└── tests/                                   # 19 Test Modülü, 67 Test (%100 Başarı)
    ├── test_api.py                          # 15 REST API testi
    ├── test_assembly_engine.py              # 3 Çoklu parça montaj testi
    ├── test_cad_parser.py                   # 2 OpenCASCADE testi
    ├── test_drawing_parser.py               # 3 Teknik resim testi
    ├── test_fastener_engine.py              # 2 Cıvata/tork testi
    ├── test_fatigue_engine.py               # 3 Yorulma testi
    ├── test_fea_exporter.py                 # 4 FEA ihraç testi
    ├── test_feedback_engine.py              # 1 DPO testi
    ├── test_fixture_engine.py               # 2 Fikstür testi
    ├── test_gdt_bridge.py                   # 2 GD&T CMM testi
    ├── test_golden_bench.py                 # 4 Referans senaryo testi
    ├── test_license_engine.py               # 3 Lisans testi
    ├── test_llm_integration.py              # 4 LLM entegrasyon testi
    ├── test_objection_agent.py              # 1 İtiraz ajanı testi
    ├── test_pdf_report_generator.py         # 3 Resmi A4 PDF testi
    ├── test_post_fea_engine.py              # 4 Post-FEA + NASTRAN/ANSYS testi
    ├── test_rule_engine.py                  # 4 Kural motoru testi
    ├── test_standards_and_materials_extension.py # 4 Çoklu standart & malzeme testi
    └── test_thermal_engine.py               # 3 MIL-STD-810H termal analiz testi (YENİ)
```
