# 🎨 16. UI/UX Tasarım Sistemi, Ekran Mimarisi ve Sıfır İsraf Performans Rehberi

> **"Bambu Studio / PrusaSlicer sadeliği, Fusion 360 kanvas ergonomisi ve Cursor/VS Code operasyon akışını bir araya getiren; 90'lardan kalma gri CMM arayüzlerini tarihe gömen, floresan ışıklı kalite laboratuvarları için optimize edilmiş açık renkli (Solid Slate Light) ve 80-150 MB RAM tüketen hafif mühendislik arayüzü."**

---

## 📌 1. Zihinsel Model ve Tasarım İlhamı

Geleneksel CMM programlarının (PC-DMIS, Quindos, Calypso) en büyük kusuru; 90'lardan kalma Windows 95 pencereleri, karmaşık menü labirentleri ve yüzlerce parametreyle operatörü boğmasıdır.

Nuper Ortho arayüzü geleneksel CMM programlarına **asla benzemez**. Referans alınan modern araçlar:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Bambu Studio / PrusaSlicer (Dilimleyici Sadeliği):                       │
│    • Kullanıcı parçayı atar, "Slice" der; arka planda binlerce satır        │
│      G-code çıkar ama operatör yalnızca görsel yeşil yolu inceler.          │
│    • Nuper Ortho: STEP ve PDF'i at, "Generate Path" de; karmaşık DMIS        │
│      kodlarıyla değil, ekrandaki güvenli yeşil prob rotasıyla muhatap ol.   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. Fusion 360 (Manufacturing / CAM Ergonomisi):                             │
│    • Soldan sağa kronolojik çalışma disiplini:                              │
│      Setup (Fikstür) ──► Alignment (Sıfırlama) ──► Features (Ölçüm).        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Cursor / VS Code (Hiyerarşik Sol Panel Deneyimi):                        │
│    • Tertemiz dosya ve unsur ağacı, klavye odaklı hızlı kontrol.            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ☀️ 2. Açık Renk Mühendislik Paleti (Solid Slate Light)

Floresan aydınlatmalı kalite kontrol odalarında beyaz teknik resim kağıdı ile ekran arasında gidip gelen operatörün göz uyumunu korumak için nötr endüstriyel açık renk paleti kullanılır:

### A. Zemin ve Panel Katmanları:
* **Çalışma Alanı & 3D Kanvas Zemin:** `#F1F5F9` (Slate 100) — Metalik CAD parçasıyla yüksek kontrast oluşturur, gözü kamaştırmaz.
* **Paneller ve Kartlar:** `#FFFFFF` (Saf Beyaz) — `$1\text{px}` `#CBD5E1` (Slate 300) net sınır çizgisiyle ayrılır.
* **Ana Metinler & Başlıklar:** `#0F172A` (Slate 900) — Jilet gibi net okunabilir kurumsal tipografi.
* **İkincil Metinler & Etiketler:** `#64748B` (Slate 500).

### B. Semantik Metroloji Renkleri:
* **Datum / Referans Elemanları:** `#059669` (Tok Zümrüt Yeşili - güvenli baz).
* **Ölçüm Unsurları / Delikler:** `#0284C7` (Mühendislik Mavisi - nötr hedef).
* **Prob İntikal Çizgisi & Vektörler:** `#D97706` (Koyu Amber Sarısı - hareket/yol ikazı).
* **Çarpışma / İhlal Bölgeleri:** `#DC2626` (Net Endüstriyel Kırmızı - kritik engel).
* **Yasaklı Alan (Pabuç/Fikstür):** `#F97316` (Turuncu yarı saydam kafes).

### C. Tipografi Sistemi:
* **Arayüz ve Düğmeler:** `Inter` veya `Geist Sans` (Temiz, kurumsal sans-serif).
* **Koordinatlar ve Ölçü Değerleri:** `JetBrains Mono` veya `Fira Code` (Sabit basamak genişliği; $X, Y, Z$ alt alta geldiğinde sayılar kaymaz).

---

## ⚡ 3. RAM ve GPU Tasarrufu: Sıfır İsraf Kuralları (80-150 MB RAM Hedefi)

Bir masaüstü uygulamasında belleği şişiren şey iş mantığı değil, modern web dünyasının süslü ama kaynak canavarı grafik hileleridir:

| Yasaklanan Kaynak Canavarı | Neden Yasak? | Nuper Ortho Çözümü |
|---|---|---|
| `backdrop-filter: blur(...)` | GPU'ya her karede tüm arka planı yeniden filtreletir, VRAM'i tüketir. | **Sıfır Bulanıklık.** Net `#FFFFFF` paneller ve $1\text{px}$ `#CBD5E1` kenarlıklar. |
| **Ağır Gölgeler (`box-shadow`)** | Rasterizer'ı gereksiz yorar, pencereler arası geçişte FPS düşürür. | **Düz Mühendislik Kenarlığı ($1\text{px}$ Border).** Hem CAD netliği sağlar hem GPU harcamaz. |
| **PBR / SSAO / HDR / castShadow** | Three.js içinde gerçekçi gölge ve yansıma hesaplamak dahili GPU'larda 400-800 MB yer. | **Mat CAD Stili (`MeshLambertMaterial`).** Tek yönlü `DirectionalLight` + `AmbientLight`. Sadece 60 MB VRAM! |
| **Sürekli 60 FPS Render Döngüsü** | Sahne sabitken bile CPU/GPU'yu $\%20$ meşgul eder. | **On-Demand Rendering.** Yalnızca fareyle model döndürüldüğünde veya animasyon oynarken çizilir; boşta **%0 GPU**. |
| **JS Animasyon Kütüphaneleri** | Framer Motion vb. tarayıcı JS thread'ini kilitler. | **Saf CSS Geçişleri (`transition: transform 0.15s ease`).** |
| **Ağır Liste DOM Yükü** | 100+ delik listelendiğinde DOM şişer. | **Virtual Scrolling (Sanal Liste).** Yalnızca ekranda görünen 15 satır DOM'a basılır. |

---

## 🖥️ 4. Üç Bölmeli Ekran Düzeni (3-Column Dashboard)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Üst Bar 48px]  Nuper Ortho v0.1.0-alpha  |  CMM: LK-Altera 10.7.6  |  Stylus: Ø2x20mm  [RAM: 110MB]│
├──────────────────┬─────────────────────────────────────────────────────────────┬───────────────┤
│ SOL PANEL (320px)│ ORTA ALAN (BÜYÜK 3D KANVAS - #F1F5F9)                       │ SAĞ PANEL     │
│ (İşlem Ağacı)    │                                                             │ (300px)       │
│                  │             Mat Gri CAD Modeli (#94A3B8)                    │ (Akıllı Unsur │
│ ▼ 📁 Part Setup  │                          +                                  │  Teşhis Kartı)│
│   ├─ 🟩 Datum A  │                [ Koyu Gri Kenar Çizgileri ]                 │               │
│   └─ 🟩 Datum B  │                          +                                  │ • Delik_01    │
│ ▼ 📁 Features    │                 Mavi Delikler (#0284C7)                     │ • Çap: 20 H7  │
│   ├─ 🔵 Hole_01  │                          +                                  │ • Fit: Chev   │
│   └─ 🔵 Hole_02  │             Amber Prob Yolu (#D97706)                       │ • Açı: A45B90 │
│                  ├─────────────────────────────────────────────────────────────┤ • 0 Çarpışma  │
│                  │ ALT BAR (56px -> 240px Çekmece)                             │               │
│                  │ [ ▶ Oynat ]  |═══════════●══════════════════| 00:34 / 01:20  │               │
└──────────────────┴─────────────────────────────────────────────────────────────┴───────────────┘
```

### A. Üst Araç Çubuğu (Top Bar - $48\text{px}$):
* **Sol:** Nuper Ortho Logosu + Parça Adı (`Govde_OP20.step`).
* **Orta:** 4 Aşamalı Süreç Kılavuzu (Stepper):
  ```
  [ 1. İçe Aktar ] ──► [ 2. Fikstür & Sıfır ] ──► [ 3. Rota & Denetim ] ──► [ 4. DMIS Dışa Aktar ]
  ```
* **Sağ Donanım Rozeti:** CMM Profili (`LK Altera`), Prob Kafası (`PH10M`), Stylus Konfigürasyonu (`Ø2x20mm`), Canlı Bellek Göstergesi (`RAM: 110 MB`).

### B. Sol Panel: Explorer & Operasyon Ağacı ($320\text{px}$):
* Klasik dosya gezgini netliğinde hiyerarşik yapı.
* Listenin üzerine gelindiğinde (hover) 3D sahnedeki ilgili delik anında parlar.
* Sanal Liste (Virtual Scroll) ile 1.000 unsurlu havacılık modellerinde bile sıfır takılma.

### C. Orta Alan: 3D Viewport & Yüzen Araç Kutusu:
* **Mat CAD Görünümü:** `MeshLambertMaterial` ve parçanın keskin sınırlarını jilet gibi gösteren koyu gri kenar çizgileri (`LineSegments` `#475569`).
* **Dokunma Noktaları:** Ağır küreler yerine düşük poligonlu `IcosahedronGeometry(detail: 1)` veya 2D sprite'lar.
* **Görünüm Küpü (ViewCube):** Sağ üstte Üst, Ön, Yan ve İzometrik açılara tek tıkla geçiş.
* **Yüzen Araç Çubuğu (Floating Toolbar):**
  * Hızlı Mesafe Cetveli.
  * Kesit Alma Düzlemi (Section View - İç delikleri görmek için).
  * Tel Çerçeve / Katı Model Geçişi.
  * Prob Yolunu Gizle / Göster.

### D. Sağ Panel: Akıllı Unsur ve Teşhis Kartı ($300\text{px}$):
* Kanvasta veya ağaçta bir deliğe tıklandığında anında açılır:
  * **Nominal Boyut:** $\varnothing 20.000\text{ mm}$, Derinlik: $25.000\text{ mm}$.
  * **Strateji Seçici (Büyük Düğmeler):** `[ 4 Nokta ]` `[ 8 Nokta ]` `[ Spiral ]`.
  * **Fitting Tercihi:** `[ Gauss ]` `[ Chebyshev Inscribed (H7) ]`.
  * **Önerilen Kafa Açısı:** $A45^\circ B90^\circ$ (Sapma: $0.0^\circ$).
  * **AI Açıklama Notu:** *"ASME Y14.5 uyarınca pim geçme yüzeyi olduğu için Chebyshev seçildi."*

### E. Alt Bar: Simülasyon Çubuğu ve Konsol Çekmecesi ($56\text{px} \to 240\text{px}$):
* **Kapalı Durumda:** `[ ▶ Oynat ]  |===●===| 00:34 / 01:20  [ 1x ▾ ]  [ DMIS Kodu ^ ]`.
* **Yukarı Çekildiğinde:** Gerçek zamanlı akan DMIS kod konsolu açılır; prob ekranda hareket ettikçe o an çalışan DMIS satırı sarı renkle vurgulanır. Kod bilmek istemeyen operatör için bu çekmece daima kapalı kalır.

---

## 🎯 5. Kolay Öğrenilebilir Yapan 3 Altın Kural

1. **Sıfır DMIS Sözdizimi Zorunluluğu:**
   Operatör ekranda asla `FEAT/CYLNDR,IN,CART` gibi kriptik kodlar görmek zorunda kalmaz. Kod arka planda sessizce derlenir.
2. **Büyük Eylemler, Az Seçenek (Tek Baskın CTA):**
   * Parça yüklendiğinde $\longrightarrow$ `[ Hizalamayı Öner ]`
   * Toleranslar eşleştiğinde $\longrightarrow$ `[ Rotaları Hesapla ]`
   * Simülasyon bittiğinde $\longrightarrow$ `[ DMIS Kodunu İndir ]`
3. **Görsel Önizleme / Tooltip Desteği:**
   "Chebyshev Fitting" üzerine gelindiğinde 2 saniyelik görsel şemayla mantığı gösterilir: *"H7 deliklerde montaj garantisi için deliğin en dar yerini baz alır."*

---

## ⌨️ 6. Klavye Kısayolları ve Saha Ergonomisi

* `Space`: Simülasyonu Başlat / Duraklat.
* `F`: Kamerayı seçili deliğe veya parça merkezine odakla (Focus).
* `1` / `2` / `3`: Üst / Ön / İzometrik görünüme anında geçiş.
* `Ctrl + E`: DMIS Dışa Aktarma penceresini tetikleme.
* `Delete`: Seçili pabucu veya manuel noktayı sahneden kaldırma.
* `Fare Kontrolleri:` Tekerlek: Zoom, Tekerleğe basılı tutma: Pan, Sağ tık veya Shift+Sol tık: Rotate.

Bu arayüz mimarisi sayesinde, daha önce yalnızca kumpas ve mikrometre kullanmış bir stajyer mühendis bile **10 dakika içinde hiçbir eğitim almadan** ilk hatasız CMM programını üretebilir.
