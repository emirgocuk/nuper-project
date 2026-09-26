# 📐 Katman 1 Planı: Girdi ve Geometrik Ayrıştırma (`autometrol-brep`)

> **"STEP dosyasını analitik B-Rep matematik modellerine çözen, yüzey tiplerini ve ters normal vektörlerini çıkaran C++ FFI ve Rust veri yapısı planı."**

---

## 📌 1. Modülün Amacı ve Sorumluluğu

`autometrol-brep` kütüphanesi, sistemin **Lexer/Parser** katmanıdır. Görevi:
1. STEP AP214 / AP242 dosyasını diskten okumak.
2. OpenCASCADE (OCCT) C++ FFI köprüsü üzerinden topolojik elemanları (`TopoDS_Face`, `TopoDS_Edge`) ayrıştırmak.
3. Her yüzey için analitik geometri tipini, ağırlık merkezini, dış normal vektörünü ve et kalınlığını hesaplamak.
4. Katman 2'nin tüketeceği bellek-güvenli (memory-safe) bir `BRepModel` yapısı üretmek.

---

## 🌉 2. C++ FFI Köprüsü (`cxx` Tanımı)

Rust ve C++ arasındaki iletişim `cxx` crate'i ile sıfır ek yükle (zero-overhead) sağlanır:

```rust
// autometrol-brep/src/ffi.rs
#[cxx::bridge(namespace = "autometrol::occt")]
pub mod ffi {
    #[derive(Debug, Clone)]
    pub struct NativeFeature {
        pub id: u32,
        pub surface_type: u8, // 0: Plane, 1: Cylinder, 2: Cone, 3: BSpline
        pub center_x: f64,
        pub center_y: f64,
        pub center_z: f64,
        pub normal_i: f64,
        pub normal_j: f64,
        pub normal_k: f64,
        pub diameter: f64,     // Delik/mil için çap (yoksa 0.0)
        pub length: f64,       // Derinlik/boy (yoksa 0.0)
        pub is_reversed: bool, // Topoloji yönelimi ters mi?
    }

    unsafe extern "C++" {
        include!("autometrol_occt.hpp");
        type OcctReader;

        fn create_occt_reader() -> UniquePtr<OcctReader>;
        fn load_step_file(self: Pin<&mut OcctReader>, filepath: &str) -> bool;
        fn extract_features(self: &OcctReader) -> Vec<NativeFeature>;
        fn compute_min_wall_thickness(self: &OcctReader, feature_id: u32) -> f64;
    }
}
```

---

## 🦀 3. Rust Tarafındaki Nihai Veri Modeli

C++ tarafından gelen ham veriler, analitik matematik kütüphaneleri (`glam` / `nalgebra`) ile donatılmış zengin Rust yapılarına dönüştürülür:

```rust
// autometrol-brep/src/model.rs
use glam::{DVec3};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum SurfaceType {
    Plane,
    InternalCylinder, // Delik içi
    ExternalCylinder, // Dış pim / şaft
    Cone,             // Havşa
    BSpline,          // Serbest form
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BRepFeature {
    pub id: u32,
    pub surface_type: SurfaceType,
    pub centroid: DVec3,
    /// Yüzeyden dışa doğru (malzemeden boşluğa) bakan birim normal vektörü
    pub normal: DVec3,
    /// Silindir veya koni için merkez eksen doğrultusu
    pub axis: Option<DVec3>,
    pub diameter: Option<f64>,
    pub depth: Option<f64>,
    pub min_wall_thickness: f64,
    pub is_thin_walled: bool, // thickness < 2.5mm ise true
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BRepModel {
    pub file_path: String,
    pub bounding_box_min: DVec3,
    pub bounding_box_max: DVec3,
    pub features: Vec<BRepFeature>,
}
```

---

## 🔬 4. Kritik Algoritmik Kurallar (Implementation Logic)

1. **Yönelim (Orientation) Düzeltmesi:**
   - Eğer `TopoDS_Face` yönelimi `TopAbs_REVERSED` ise, normal vektörü $-1$ ile çarpılır.
   - Silindirlerde normal içeri bakıyorsa (`InternalCylinder` / delik), eksene dik yaklaşma vektörü yüzey merkezinden dışarı doğru kurgulanır.
2. **Et Kalınlığı Filtresi (`is_thin_walled`):**
   - Karşıt yüzey mesafesi $< 2.5\text{ mm}$ ise yüzey etiketlenir. İlerleyen katmanlarda bu bilgi prob yaklaşma hızını yavaşlatmak için kullanılacaktır.
3. **Paralel Ayrıştırma (`rayon`):**
   - 1.000'den fazla yüzeyi olan karmaşık motor gövdelerinde, yüzeylerin normal ve et kalınlığı hesapları CPU çekirdeklerine dağıtılır.
