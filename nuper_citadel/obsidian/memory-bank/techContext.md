# Tech Context: Nuper Citadel

## 1. Teknoloji Yığını (Tech Stack)

### İstemci ve Masaüstü Kabuğu (Desktop Shell & Frontend)
- **Kabuk:** **Tauri v2 (Rust)**
  - Neden: Minimum bellek tüketimi (~30MB RAM vs Electron 300MB+), yerel C/Rust API çağrıları, üst düzey yerel güvenlik.
- **Arayüz Çerçevesi:** **Next.js / React 19**
  - Modern UI bileşenleri, hızlı durum yönetimi, dinamik reaktif formlar.
- **Stil & Tasarım:** **Tailwind CSS + Lucide React**
  - Askeri/endüstriyel temalı karanlık mod (Dark Slate / Tactical Cyan / HUD styling).
- **3D Görselleştirme:** **Three.js / @react-three/fiber**
  - STEP dosyasının dönüştürülmüş GLTF/mesh önizlemesi, montaj deliklerinin ve CoG noktasının 3D sahne üzerinde interaktif gösterimi.

### Yerel Çekirdek Servisi (Local Backend Engine)
- **Çalışma Zamanı:** **Python 3.11**
- **Web Çerçevesi:** **FastAPI + Uvicorn**
  - Asenkron REST endpoint'leri, yerel IPC veya loopback `127.0.0.1:8765` iletişimi.
  - Pydantic v2 ile katı veri şeması doğrulaması.
- **CAD Geometri Kütüphanesi:** **pythonocc-core 7.7.x (OpenCASCADE 7.7 C++ Wrapper)**
  - STEP/STP BRep okuma, kütle özellikleri hesabı (`BRepGProp`), topolojik delik taraması (`TopExp_Explorer`).
  - Alternatif/Hızlı Yardımcı: `cadquery` veya `trimesh` (görselleştirme mesh jenerasyonu için).
- **Veritabanı:** **SQLite 3 (WAL mode)**
  - `standards.db`: MIL-STD-810H, RTCA DO-160G, STANAG tabloları ve kırılma frekansları.
  - `telemetry.db`: Mühendis tercih logları (DPO veri seti hazırlığı için `prompt`, `chosen`, `rejected`).

### Yerel Yapay Zekâ Katmanı (Local LLM Runtime)
- **Çalışma Motoru:** **Ollama** veya dahili **`llama-cpp-python`** (GGUF)
- **Hedef Modeller:**
  - Birincil: `Qwen 2.5 Coder 14B-Instruct` (Q4_K_M quantize, ~9GB VRAM / RAM)
  - Yedek / Düşük Donanım: `Llama 3.3 8B-Instruct` veya `Qwen 2.5 7B` (Q4_K_M, ~5GB VRAM)
- **Prompting:** Yapılandırılmış JSON enjeksiyonu, katı sistem rolü, sıfır dış serbest bilgi.

---

## 2. Dışa Aktarma Formatları ve Simülasyon Köprüleri

| Yazılım | Format | Açıklama |
| :--- | :--- | :--- |
| **Simcenter NX** | `.csv` / `.afu` | NX Response Simulation için log-log interpolasyonlu PSD frekans-ivme eğrisi. |
| **ANSYS Mechanical** | `.csv` / `.mac` (APDL) | Random Vibration analiz bloğunda Table PSD olarak içe aktarılır. |
| **Abaqus FEA** | `.inp` (Snippet) | `*AMPLITUDE, TYPE=PSD` veri blokları. |
| **Test Merkezi Dokümanı** | `.pdf` / `.docx` | A4 formatında resmi Çevresel Test Planı (ETP) ve Kabul Kriterleri. |

---

## 3. Donanım ve Sistem Gereksinimleri

- **İşletim Sistemi:** Windows 10/11 Pro (Savunma sanayii iş istasyonları) ve Red Hat Enterprise Linux / Ubuntu LTS.
- **RAM:** Minimum 16 GB, Önerilen 32 GB (OpenCASCADE meshleme ve 14B LLM için).
- **GPU (İsteğe Bağlı ama Önerilen):** NVIDIA RTX 3060/4060 veya üstü (8-16 GB VRAM, CUDA hızlandırma). GPU yoksa CPU üzerinde AVX2/AVX-512 ile llama.cpp çalıştırılabilir.
- **Ağ Durumu:** **Air-gapped (İnternetsiz)**. Dış dünyayla bağlantı kesilse dahi tüm fonksiyonlar eksiksiz çalışır.

---

## 4. Dizin ve Dosya Mimarisi Planı

```
nuper-citadel/
├── AGENTS.md                   # Proje ilkeleri ve Memory Bank kuralları
├── README.md                   # Kök karşılama ve yönlendirme
├── obsidian/                   # Obsidian Mühendislik Kasası
│   ├── 00_Nuper_Citadel_MOC.md # Master Map of Content
│   ├── memory-bank/            # Proje hafıza bankası
│   └── ...
├── src-tauri/                  # Masaüstü yerel kabuk (Rust/Tauri)
│   ├── Cargo.toml
│   └── src/main.rs
├── frontend/                   # Arayüz (Next.js 14 / Tailwind / Three.js)
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── StepViewer.tsx      # 3D model görüntüleyici
│       ├── ProfileSelector.tsx # Standart seçim matrisi
│       └── ReportViewer.tsx    # ETP görüntüleme ve düzenleme
├── engine/                     # Yerel Python Servisi (FastAPI)
│   ├── api/
│   │   ├── routes.py           # REST endpoint'leri
│   │   └── schemas.py          # Pydantic şemaları
│   ├── core/
│   │   ├── cad_parser.py       # pythonocc-core STEP analiz motoru
│   │   ├── rule_engine.py      # MIL-STD-810 kural ve karar ağacı
│   │   └── fea_exporter.py     # CSV / AFU / APDL spektrum üreticisi
│   ├── data/
│   │   ├── standards.db        # SQLite askeri standartlar kütüphanesi
│   │   └── telemetry.db        # DPO için mühendis düzeltme logları
│   └── llm/
│       ├── local_client.py     # Ollama / llama.cpp REST köprüsü
│       └── prompts.py          # Deterministik sistem şablonları
└── models/                     # Yerel quantize model ağırlıkları (.gguf)
```
