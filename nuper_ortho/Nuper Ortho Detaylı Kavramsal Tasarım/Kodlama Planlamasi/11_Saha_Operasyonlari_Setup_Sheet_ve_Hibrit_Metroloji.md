# 📋 11. Saha Operasyonları, Setup Sheet ve Hibrit Metroloji

> **"Bir metroloji yazılımını atölye zemininde 'tek başına çalışan tam bir ürün' haline getiren son 3 operasyonel boyut: Otomatik PDF Kurulum Föyü (Setup Sheet), Lazer Çizgi/Optik Tarama genişlemesi ve Endüstriyel IP/Standart isimlendirme mimarisi."**

---

## 📌 1. Operatör Kurulum Sayfası (Inspection Setup Sheet) Çıktısı

Yazılımın yalnızca CMM'e DMIS kodu üretmesi atölye operasyonu için yeterli değildir. Tezgaha giden operatörün parçayı granit tablaya nasıl bağlayacağını, hangi prob ucunu takacağını ve nereden kaba sıfır alacağını gösteren bir **Setup Sheet (Kurulum Föyü)** zorunludur.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NUPER ORTHO INSPECTION SETUP SHEET                    │
│ Parça Adı: GOVDE_VALF_REV3         Tarih: 2026-09-26     Sayfa: 1 / 1  │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. PARÇA YERLEŞİMİ & PABUÇLAR     │ 2. PROB KONFİGÜRASYONU             │
│ [ 3D İzometrik Render ]           │ • Kafa: Renishaw PH10M             │
│ • Parça Konumu: X: 250, Y: 150    │ • Modül: TP20 Standart Force       │
│ • Pabuç Alanları: (Kırmızı Hacim) │ • Uzatma: PEL1 (50 mm Karbon)      │
│   - Pabuç 1: Delik 4'ten 30mm uzak│ • Stylus: ∅2.0 mm x 20 mm Yakut    │
│   - Pabuç 2: Arka flanş kenarı    │ • Kalibre Açılar: A0B0, A45B90     │
├───────────────────────────────────┴────────────────────────────────────┤
│ 3. MANUEL ÖN-HİZALAMA ADIMLARI (MODE/MAN - Kaba Sıfır Alma)             │
│                                                                        │
│   (1) ● ─── Nokta 1: Üst yüzey sol köşe (+Z Düzlem A)                  │
│   (2) ● ─── Nokta 2: Üst yüzey sağ köşe                                │
│   (3) ● ─── Nokta 3: Üst yüzey ön kenar                                │
│   [!] 3 dokunuş tamamlandıktan sonra tezgah otomatik CNC moduna geçer. │
└────────────────────────────────────────────────────────────────────────┘
```

### Teknik Çözüm:
* DMIS kodu derlendiği anda, Rust tarafında `printpdf` veya HTML/Canvas headless PDF motoru tetiklenir.
* Parçanın Three.js üzerinden alınmış izometrik görseli, prob montaj reçetesi ve pabuç yasaklı alanları tek sayfalık kompakt bir PDF olarak dışa aktarılır.
* Operatör tezgah başına bu sayfayı alıp gider; sıfır soru işaretiyle parçayı bağlayıp çalıştırır.

---

## 🔦 2. Hibrit Metroloji Desteği (Optik / Lazer Tarama Genişlemesi)

Talaşlı imalat dünyasında parçalar yalnızca dokunmatik problarla ölçülmez; portatif kollar (Faro/Romer) ve optik lazer tarayıcılar (Hexagon RS6, Zeiss LineScan) giderek yaygınlaşmaktadır.

### A. Genişleme İhtiyacı:
* **Dokunmatik Prob:** Kritik delik toleranslarını ($H7$, konum sapması) mikron hassasiyetinde temasla ölçer.
* **Optik/Lazer Tarayıcı:** Serbest yüzey formunu (yüzey profil sapması, döküm kabuğu) saniyede yüz binlerce nokta alarak dakikalar içinde haritalandırır.

### B. Kodlama Mimarisi ve AST Hazırlığı:
AST yapısında sensör tipi polimorfik olarak genişletilebilir tutulur:

```rust
// crates/core-metrology/src/ast.rs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SensorType {
    TactileTouchTrigger {
        stylus_diameter: f64,
        stem_length: f64,
        force_mode: TouchForceMode,
    },
    TactileContinuousScanning {
        stylus_diameter: f64,
        scan_speed_mms: f64,
    },
    OpticalLaserLine {
        stripe_width_mm: f64,
        standoff_distance_mm: f64,
        point_density: f64,
    },
}
```

* **Lazer Seçildiğinde Davranış:** Motor diskret temas noktaları üretmek yerine, yüzeyi tarayan paralel şerit hatları (scan stripes) ve uygun lazer yaklaşma oryantasyonu derler.

---

## 🏛️ 3. Fikri Mülkiyet (IP), Evrensel Terminoloji ve Semantik Sürümleme

### A. Bağımsız ve Standart Terminoloji:
Yazılımın arayüzünde, dokümantasyonunda ve Post-Processor yapısında tescilli ticari marka isimleri doğrudan telif riski oluşturmayacak şekilde **uluslararası açık standartlarla** ifade edilir:
* ❌ *"PC-DMIS Converter"* $\longrightarrow$ ✅ **"ANSI/CAM-I DMIS 5.3 Compliant Post-Processor (Hexagon Dialect)"**
* ❌ *"Zeiss Calypso Compiler"* $\longrightarrow$ ✅ **"VDA-FS / DMIS Native Post-Processor (Zeiss Dialect)"**
* ❌ *"Renishaw Engine"* $\longrightarrow$ ✅ **"Discrete 5-Axis Kinematic Orientation Solver"**

### B. Semantik Sürümleme Yol Haritası:
* **`v0.1.0-alpha` (Mevcut Hedef):** Çekirdek matematik (`core-metrology`), kinematik çözücü (`core-kinematics`) ve DMIS derleyici (`core-post`).
* **`v0.2.0-beta`:** OpenCASCADE C++ FFI (`core-cad`) ve tam STEP model ayrıştırma.
* **`v1.0.0`:** Tauri v2 masaüstü arayüzü, 3D Three.js görselleştirme ve PDF Setup Sheet çıktısı.

---

## 🏁 Nihai Değerlendirme ve Kodlama Başlangıcı

Nuper Ortho projesinin;
1. **Derleyici Mimarisi & AST:** 5 katmanlı ayrık pipeline,
2. **Matematik & Kinematik:** PH10 720 LUT, Gauss/Chebyshev fitting,
3. **Emniyet & Rota:** Clearance Box, pabuç AABB, şaft sürtünme denetimi,
4. **Uluslararası Standartlar:** GUM, ISO 15530-3 (Virtual CMM), ISO 16610, ISO 5459, ISO 14253-1,
5. **Teknik Darboğaz Çözümleri:** Bipartite 2D/3D eşleme, 5-DoF RRT*, cxx bellek izolasyonu, Hammersley örneklemesi,
6. **Saha ve Operasyon:** PDF Kurulum Föyü, Setup 1/2 çevirme, Hibrit lazer desteği ve kapalı döngü CNC geri beslemesi

olmak üzere tüm boyutları **sıfır belirsizlikle** planlanmıştır.

Bundan sonraki adım doğrudan Rust çalışma alanını (`crates/core-metrology`) ayağa kaldırmak ve ilk üretim kodunu yazmaktır.
