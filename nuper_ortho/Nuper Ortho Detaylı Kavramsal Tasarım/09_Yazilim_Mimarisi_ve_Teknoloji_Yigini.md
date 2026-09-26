# 💻 09. Yazılım Mimarisi ve Teknoloji Yığını (Tech Stack)

> **"Tauri, Rust, OpenCASCADE ve yerel GGUF Vision yapay zekâsını bir araya getiren; sıfır bellek sızıntılı, tamamen çevrimdışı (air-gapped) çalışan yüksek performanslı masaüstü mimarisi."**

---

## 📌 1. Katmanlı Sistem Mimarisi

Nuper Ortho, web veya bulut tabanlı bir servis değildir. Savunma ve hassas imalat tesislerinin güvenlik gereksinimleri (ITAR, CMMC, gizlilik) nedeniyle **tamamen yerel bilgisayarda çalışan bir masaüstü uygulamasıdır.**

```
┌─────────────────────────────────────────────────────────────┐
│ Ön Yüz (UI): Tauri + React + TypeScript + Three.js / WebGPU │
│ - 3D STEP model görüntüleme ve prob yolu simülasyonu        │
│ - Etkileşimli pabuç / fikstür Keep-Out kutusu çizimi        │
│ - CMM tezgahı, prob kafası ve kalibre açı seçim paneli      │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Zero-Overhead IPC / Binary Buffers)
┌──────────────────────────────▼──────────────────────────────┐
│ Çekirdek Motor: Rust                                         │
│ ├── OpenCASCADE C++ FFI (B-Rep geometri ayrıştırma)         │
│ ├── Kinematik Çözücü (720 diskret PH10 projeksiyonu & k-means)│
│ ├── Emniyet Zarfı & Çarpışma Engelleyici Rota Planlayıcı    │
│ ├── Metroloji Fitting Motoru (Gauss & Chebyshev Inscribed)  │
│ └── Post-Processor Engine (Jinja/Tera şablon derleyici)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Yerel Akıl Yürütme: Embedded Vision-LLM / OCR (GGUF)        │
│ - 2D PDF teknik resimden GD&T kutularını okuma              │
│ - llama.cpp / Candle üzerinden CPU/yerel GPU ile çalışma    │
│ - Tamamen çevrimdışı (Air-Gapped), sıfır veri sızıntısı    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ 2. Ön Yüz Mimarisi (Tauri + React + Three.js: Solid Slate Light)

- **Tauri 2.0:** Electron'un getirdiği ağır bellek (RAM) yükünü ve yavaşlığı ortadan kaldırır. Kurulum paketi $< 80\text{ MB}$, başlangıç süresi $< 1\text{ saniye}$, arayüz RAM tüketimi $80-150\text{ MB}$.
- **Solid Slate Light Mühendislik Teması:** Kalite kontrol odalarındaki teknik resim kağıdı ile ekran arasındaki göz uyumunu koruyan açık gri-beyaz `#F1F5F9` zemin, saf beyaz kartlar ve $1\text{px}$ `#CBD5E1` kenarlıklar.
- **Sıfır İsraf Three.js Mimarisi:**
  - PBR, SSAO, HDR ve gölgeler devre dışı; SolidWorks tarzı hafif mat CAD görünümü (`MeshLambertMaterial`) ve koyu gri kenar çizgileri (`LineSegments` `#475569`). VRAM tüketimi 800 MB'dan 60 MB'a iner.
  - **On-Demand Rendering:** Sabit dururken ekran saniyede 60 kez çizilmez; yalnızca kullanıcı modeli döndürdüğünde veya simülasyon oynarken render tetiklenir (boşta %0 GPU).
  - Ölçülecek delikler açık mavi (`#0284C7`), datumlar zümrüt yeşili (`#059669`), prob yolu koyu amber (`#D97706`), çarpışmalar net kırmızı (`#DC2626`).
  - Sanal Liste (Virtual Scrolling) ile 1.000 unsurlu havacılık parçalarında bile DOM şişmesi engellenir.


---

## 🦀 3. Çekirdek Motor (Rust + OpenCASCADE C++ FFI)

C++ tabanlı OpenCASCADE (OCCT) kütüphanesi, modern ve bellek-güvenli (memory-safe) Rust katmanı ile `cxx` köprüsü üzerinden bağlanır:
- **Zero-Copy Serialization:** Yüz binlerce yüzey ve kenar verisi kopyalanmadan doğrudan Rust bellek alanına referanslanır.
- **Ray-Tracing ve OBB (Oriented Bounding Box):** Prob şaftı ile parça arasındaki dinamik mesafe sorguları Rust tarafında çok çekirdekli (Rayon) paralelleştirme ile milisaniyeler içinde çözülür.

---

## 🧠 4. Yerel Yapay Zekâ ve OCR Hattı (Air-Gapped Vision)

- **Çalışma Modeli:** `llama.cpp` veya Rust yerel kütüphanesi `Candle` üzerinden entegre edilen quantize (Q4_K_M / Q8) Vision modelleri.
- **Donanım Uyumluluğu:** Harici bir NVIDIA GPU olmadan da standart bir ofis i7/i9 işlemcisi üzerinde 3-5 saniyede 2D PDF sayfasını ayrıştırır.
- **Sıfır Bulut Bağımlılığı:** Hiçbir veri şirket dışına çıkmaz; internet bağlantısı tamamen kapatılmış askeri üslerde dahi kusursuz çalışır.
