---
title: 01. Tauri & Next.js Masaüstü Kabuğu
created: 2026-09-20
tags:
  - architecture
  - tauri
  - nextjs
  - threejs
  - air-gapped
---

# 🖥️ 01. Tauri & Next.js Masaüstü Kabuğu

Nuper Citadel'in kullanıcıyla buluştuğu ilk temas noktası, savunma sanayii iş istasyonlarının yüksek güvenlik ve performans isterlerine uygun olarak tasarlanmış **Tauri v2 + Next.js** masaüstü kabuğudur.

```
┌───────────────────────────────────────────────────────────────────────┐
│                    TAURI DESKTOP SHELL (RUST CORE)                    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     NEXT.JS / REACT FRONTEND                    │  │
│  │                                                                 │  │
│  │   ┌─────────────────────┐             ┌─────────────────────┐   │  │
│  │   │  STEP DRAG & DROP   │             │   STANDART & PROFIL │   │  │
│  │   │  - .step / .stp     │             │   - İHA / Zırhlı    │   │  │
│  │   └──────────┬──────────┘             └──────────┬──────────┘   │  │
│  │              │                                   │              │  │
│  │              ▼                                   ▼              │  │
│  │   ┌─────────────────────────────────────────────────────────┐   │  │
│  │   │             THREE.JS INTERAKTIF 3D VIEWER               │   │  │
│  │   │  - Geometri Render       - CoG Gösterimi (Kırmızı Nokta)│   │  │
│  │   │  - Montaj Delikleri      - Eksenel Oryantasyon (X/Y/Z)  │   │  │
│  │   └──────────────────────────┬──────────────────────────────┘   │  │
│  │                              │                                  │  │
│  │   ┌──────────────────────────▼──────────────────────────────┐   │  │
│  │   │          ETP GÖRÜNTÜLEYİCİ & SATIR İÇİ DÜZENLEME        │   │  │
│  │   │  - Canlı Markdown/PDF    - Geri Bildirim Butonu (DPO)   │   │  │
│  │   └─────────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │ IPC / Yerel HTTP (127.0.0.1:8765)
                                   ▼
                       [FASTAPI YEREL PYTHON MOTORU]
```

---

## 1. Neden Electron Değil de Tauri?
Savunma sanayiinde mühendislerin kullandığı iş istasyonlarında ANSYS, Simcenter NX, SolidWorks, CATIA gibi RAM ve GPU canavarı simülasyon yazılımları aynı anda çalışır.

| Kriter | Electron | **Tauri v2 (Tercihimiz)** | Savunma Mühendisliği Kazanımı |
| :--- | :---: | :---: | :--- |
| **Bellek Tüketimi (RAM)** | ~250 - 450 MB | **~25 - 40 MB** | FEA çözerken arka planda sıfır yük. |
| **Kurulum Boyutu** | 120 - 200 MB | **10 - 25 MB** | Hava boşluklu (air-gapped) sistemlere USB ile hızlı dağıtım. |
| **Güvenlik Mimarisi** | Node.js izin riskleri | **Rust tabanlı katı CSP** | Dışarıya veri sızıntısını kernel/Rust seviyesinde engelleme. |
| **Yerel Donanım Erişimi** | Yavaş köprüler | **Yerel C/C++ FFI** | OpenCASCADE ve Python çekirdeğiyle ultra hızlı IPC. |

---

## 2. Temel Arayüz Fonksiyonları

### A. STEP Drag & Drop ve Ön-İşleme
- Kullanıcı herhangi bir `.step` veya `.stp` dosyasını arayüzün üzerine sürüklediğinde, dosya geçici yerel dizine alınır.
- Rust dosya işleyicisi (file handler) dosya bütünlüğünü ve uzantısını doğrular, ardından Python FastAPI motorundaki `/api/cad/parse` endpoint'ine yerel soket üzerinden iletir.

### B. Three.js / WebGL 3D Model Önizleyici
- Parçanın CAD geometrisi, Python tarafında hafif bir üçgen mesh yapısına (`.gltf` / `.obj`) çevrilir ve arayüze aktarılır.
- **HUD (Head-Up Display) Katmanı:**
  - **Ağırlık Merkezi (CoG):** Parçanın içine yerleştirilen parlayan kırmızı bir küre ve koordinat vektörleri ($x, y, z$).
  - **Montaj Yüzeyi & Delikleri:** Sabitlenen delikler yeşil halkalarla vurgulanır.
  - **Devrilme Kolu ($h_{cg}$):** Taban düzlemi ile CoG arasındaki mesafe ekranda dinamik ölçülendirme çizgisi olarak gösterilir.

### C. Profil Seçim Matrisi (Mission Configurator)
Mühendise sade, hataya yer bırakmayan çok adımlı seçim akışı:
1. **Platform:** Taktik İHA Kanat Altı / Döner Kanat (Helikopter) Gövde İçi / Zırhlı Paletli Araç / Füze Burun Bölmesi.
2. **Malzeme:** Önceden tanımlı kütüphane (Al 6061-T6, Al 7075-T6, Ti-6Al-4V, Paslanmaz 304, Karbon Fiber Kompozit) veya özel yoğunluk/akma gerilmesi girişi.
3. **Standart Kuralı:** MIL-STD-810H / RTCA DO-160G.

### D. Satır İçi Düzenleme (Inline Editing) ve DPO Tetikleyicisi
- Yerel LLM tarafından sentezlenen ETP (Environmental Test Plan) raporu ekranda zengin metin düzenleyici (Rich Text / Markdown) olarak gösterilir.
- Mühendis bir paragrafı düzelttiğinde (Örn: "Test sıcaklığı +71°C yerine müşteri şartnamesi gereği +85°C alınmalıdır"):
  - Arayüz otomatik olarak hem orijinal metni (`rejected`) hem de mühendisin düzelttiği metni (`chosen`) yakalar.
  - "Onayla ve Dışa Aktar" butonuna basıldığında bu çift `telemetry.db` içine işlenir.

---

## 3. Güvenlik ve Air-Gap Kuralı
- Next.js istemcisi ve Tauri kabuğu üzerinde **katı Content Security Policy (CSP)** uygulanır:
  ```
  default-src 'self' http://127.0.0.1:8765;
  connect-src 'self' http://127.0.0.1:8765 ws://127.0.0.1:8765;
  img-src 'self' data: blob:;
  script-src 'self';
  ```
- Dış internete (`google.com`, harici CDN'ler, analitik servisleri) yönelik TÜM istekler bloklanır. Tüm fontlar (Inter / JetBrains Mono) ve kütüphaneler yerel paketlenir.

---
Bağlantılı Notlar:
- [[02_CAD_Geometry_Engine|02. CAD & Geometri Ayrıştırıcı]]
- [[05_Local_LLM_DPO_Pipeline|05. Yerel LLM ve Adaptif Öğrenme]]
- [[00_Nuper_Citadel_MOC|Master MOC]]
