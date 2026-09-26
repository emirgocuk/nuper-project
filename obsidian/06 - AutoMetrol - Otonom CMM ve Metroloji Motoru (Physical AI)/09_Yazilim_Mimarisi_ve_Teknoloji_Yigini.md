# 💻 09. Yazılım Mimarisi ve Teknoloji Yığını (Tech Stack)

> **"Tauri, Rust, OpenCASCADE ve yerel GGUF Vision yapay zekâsını bir araya getiren; sıfır bellek sızıntılı, tamamen çevrimdışı (air-gapped) çalışan yüksek performanslı masaüstü mimarisi."**

---

## 📌 1. Katmanlı Sistem Mimarisi

AutoMetrol, web veya bulut tabanlı bir servis değildir. Savunma ve hassas imalat tesislerinin güvenlik gereksinimleri (ITAR, CMMC, gizlilik) nedeniyle **tamamen yerel bilgisayarda çalışan bir masaüstü uygulamasıdır.**

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

## 🖥️ 2. Ön Yüz Mimarisi (Tauri + React + Three.js)

- **Tauri 2.0:** Electron'un getirdiği ağır bellek (RAM) yükünü ve yavaşlığı ortadan kaldırır. Kurulum paketi $< 80\text{ MB}$, başlangıç süresi $< 1\text{ saniye}$.
- **Three.js / WebGL-WebGPU:**
  - Rust tarafından tesellasyon (tessellation) ile üretilen mesh verisi doğrudan GPU'ya aktarılır.
  - Ölçülecek yüzeyler yeşil, silindirik delikler mavi, kör/ulaşılamayan noktalar kırmızı ile vurgulanır.
  - Probun izleyeceği hareket yolları sarı çizgilerle, $+50\text{ mm}$ emniyet kutusu (Clearance Box) yarı saydam bir zarf olarak görselleştirilir.
  - Operatör için tam animasyonlu prob hareket simülasyonu sunulur.

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
