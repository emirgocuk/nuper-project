# Nuper Ortho — Teknik Bağlam ve Bağımlılıklar (Tech Context)

## 1. Temel Teknoloji Yığını

| Alan | Teknoloji / Kütüphane | Sürüm | Tercih Nedeni ve Rolü |
|---|---|---|---|
| **Çekirdek Sistem Dili** | **Rust** | 2021 Edition (stable) | Bellek güvenliği, sıfır maliyetli soyutlama, deterministik hız, veri yarışmasız paralelleştirme (`rayon`). |
| **CAD & B-Rep Geometri Çekirdeği**| **OpenCASCADE (OCCT)** | 7.7.x / 7.8.x (C++) | STEP AP214/AP242 formatlarını okuyan, analitik yüzey sorgularını yürüten endüstri standardı B-Rep kütüphanesi. |
| **Rust $\leftrightarrow$ C++ FFI Köprüsü** | **`cxx` crate** | 1.0.x | Bellek sızıntısız, derleme zamanında tip denetimli iki yönlü güvenli C++ FFI köprüsü. |
| **Masaüstü Uygulama Kabuğu** | **Tauri 2.0** | 2.x | Native Webview kullanımı, $<80\text{ MB}$ kurulum boyutu, 80–150 MB RAM tüketimi (Electron'un getirdiği ağırlığı eler). |
| **3D CAD Görselleştirici** | **Three.js / WebGL** | r168+ | Hafif CAD render, `MeshLambertMaterial`, on-demand çizim (hareketsizken %0 GPU). |
| **Ön Yüz Çatısı** | **React + TypeScript** | 18.x / 5.x | Tip güvenli arayüz mimarisi, 1.000+ unsurlu modellerde Sanal Liste (Virtual Scroll) akıcılığı. |
| **Vektör & Matris Matematiği** | **`glam`** | 0.29.x | SIMD hızlandırmalı yüksek performanslı 3D vektör ve matris hesaplamaları (`DVec3`, `DMat3`). |
| **Çarpışma & Katı Cisim Fiziği**| **`parry3d`** | 0.13.x | Hiyerarşik kutu ağacı (BVH) ve GJK/EPA algoritmalarıyla süpürülmüş kapsül çarpışma motoru. |
| **Çizge Eşleme Algoritmaları** | **`petgraph`** | 0.6.x | 2D PDF toleransları ile 3D STEP analitik silindirleri arasında ağırlıklı çift parçalı çizge (bipartite graph) eşleme. |
| **Post-Processor Şablon Motoru** | **`tera`** | 1.19.x | ANSI DMIS 5.3 ve PC-DMIS lehçelerini derleyen, derleme gerektirmeyen Jinja2 uyumlu şablonlama. |
| **Yerel AI & OCR Hattı** | **`llama.cpp` / GGUF** | Native C++/Rust | İnternetsiz (air-gapped) yerel SLM ve Vision modellerinin 4-bit (Q4) çalıştırılması. |

---

## 2. Cargo Workspace Mimarisi

```
nuper_ortho/
├── Cargo.toml                  # Workspace kök manifestosu
├── crates/
│   ├── ortho-brep/            # Katman 1: OpenCASCADE C++ FFI ve B-Rep ayrıştırma
│   ├── ortho-ast/             # Katman 2: Nötr Metroloji AST ve kural doğrulayıcı
│   ├── ortho-kinematics/      # Katman 3: PH10/MH20i kinematik çözücü ve örnekleyiciler
│   ├── ortho-router/          # Katman 4: Emniyet kutusu ve GJK/EPA çarpışmasız rota planlayıcı
│   ├── ortho-emitter/         # Katman 5: Tera şablonlu DMIS / PC-DMIS emitter
│   └── ortho-cli/             # Geliştirici komut satırı arayüzü ve test koşucusu
├── src-tauri/                  # Tauri 2.0 masaüstü backend ve Rust IPC köprüsü
├── ui/                         # React + Three.js Solid Slate Light ön yüz kodları
└── tests/
    └── ptb_benchmarks/         # Alman Ulusal Metroloji Enstitüsü (PTB) referans veri setleri
```

---

## 3. Geliştirme Ortamı ve Donanım Kısıtları

1. **Air-Gapped (Tamamen Çevrimdışı) Zorunluluğu:**
   Tüm ikili dosyalar, yerel yapay zekâ ağırlıkları ve şablonlar internet bağlantısı olmadan çalışmak üzere paketlenir. Savunma sanayii gizlilik (ITAR / CMMC) kurallarıyla tam uyumludur.
2. **Atölye Bilgisayarları Donanım Gerçeği:**
   - Kalite kontrol odalarındaki bilgisayarlar çoğunlukla 5-8 yıllık Intel Core i5/i7, 16 GB RAM ve harici güçlü GPU'su olmayan makinelerdir.
   - Bu nedenle sistem ağır 7B Vision modellerini zorunlu tutmaz; **4 Kademeli AI Hattı** ile donanıma göre dinamik ölçeklenir:
     - **Tier 0:** STEP AP242 Semantik PMI (0 ms / 0 MB RAM).
     - **Tier 1:** OpenCV kontur analizi + PaddleOCR (<200 MB RAM, saf CPU).
     - **Tier 2:** Moondream2 / SmolVLM-1.7B (~1.5 GB RAM, dahili GPU/CPU uyumlu).
     - **Tier 3:** Qwen2-VL-7B (Yalnızca $\ge 8\text{ GB}$ VRAM NVIDIA GPU tespit edilirse).
3. **Deterministik Derleyici Çıktısı:**
   Aynı STEP dosyası ve tolerans girdisi verildiğinde sistem her zaman bit seviyesinde aynı temas koordinatlarını ve prob açılarını üretir; bu durum SHA-256 hash'i ile mühürlenir.
4. **Hedef Platform:**
   Birincil hedef **Windows 10/11 64-bit** (CMM tezgahlarının %99'unun işletim sistemi). Headless testler ve CI/CD hattı için Linux desteği korunur.
