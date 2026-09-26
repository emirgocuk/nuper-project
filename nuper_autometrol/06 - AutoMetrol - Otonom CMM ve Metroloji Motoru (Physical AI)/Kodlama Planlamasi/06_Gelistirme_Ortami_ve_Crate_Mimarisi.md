# 📦 06. Geliştirme Ortamı ve Crate Mimarisi (Rust Workspace)

> **"AutoMetrol'ün 5 katmanlı derleyici yapısını hayata geçiren Cargo workspace mimarisi, kütüphane bağımlılıkları ve PTB akreditasyon test koşucusu planı."**

---

## 📌 1. Cargo Workspace Hiyerarşisi

Kod tabanı, sorumlulukların net ayrılması ve modüler derleme süresi avantajı için çoklu crate (multi-crate) mimarisiyle yapılandırılır:

```
autometrol/
├── Cargo.toml                  # Workspace kök yapılandırması
├── crates/
│   ├── autometrol-brep/        # Katman 1: OpenCASCADE C++ FFI & B-Rep
│   ├── autometrol-ast/         # Katman 2: Nötr Teftiş AST & Doğrulayıcı
│   ├── autometrol-kinematics/  # Katman 3: PH10/MH20i Çözücü & Örnekleyiciler
│   ├── autometrol-router/      # Katman 4: Emniyet Zarfı & Çarpışmasız Rota
│   ├── autometrol-emitter/     # Katman 5: Tera Şablonlu DMIS Derleyici
│   └── autometrol-cli/         # Geliştirici CLI & Headless Test Aracı
├── src-tauri/                  # Tauri 2.0 Masaüstü Backend Köprüsü
├── ui/                         # React + Three.js Ön Yüz Kodları
└── tests/
    └── ptb_benchmarks/         # Alman Metroloji Enstitüsü PTB Test Verileri
```

---

## ⚙️ 2. Kök `Cargo.toml` Yapılandırması

```toml
[workspace]
members = [
    "crates/autometrol-brep",
    "crates/autometrol-ast",
    "crates/autometrol-kinematics",
    "crates/autometrol-router",
    "crates/autometrol-emitter",
    "crates/autometrol-cli",
    "src-tauri",
]
resolver = "2"

[workspace.dependencies]
# Matematik ve Vektör Geometrisi
glam = { version = "0.29", features = ["serde"] }
approx = "0.5"

# Paralelleştirme ve Performans
rayon = "1.10"

# Serileştirme ve Şablon Motoru
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tera = "1.19"

# C++ Köprüsü
cxx = "1.0"

# Çizge Eşleme ve Çarpışma Hesaplama
petgraph = "0.6"
parry3d = "0.13"

# Günlükleme ve Teşhis
tracing = "0.1"
tracing-subscriber = "0.3"
thiserror = "1.0"
```

---

## 🧪 3. PTB / NIST Doğrulama Test Koşucusu (`ptb_benchmarks`)

Algoritmaların havacılık ve savunma regülasyonlarına uygunluğunu kanıtlamak için otomatik test koşucusu:

```rust
// tests/ptb_benchmarks/cylinder_test.rs
use approx::assert_relative_eq;
use autometrol_kinematics::fitting::fit_chebyshev_cylinder;

#[test]
fn test_ptb_reference_cylinder_evaluation() {
    // PTB resmi test veri seti: "PTB-Cyl-01.dat"
    let sample_points = load_ptb_test_points("tests/data/ptb_cyl_01.dat");
    let result = fit_chebyshev_cylinder(&sample_points).expect("Fitting başarısız");

    // PTB sertifikalı nominal çap: 50.0023 mm
    let certified_diameter = 50.0023;
    assert_relative_eq!(result.diameter, certified_diameter, epsilon = 1e-6);
}
```

Bu testler her `git push` işleminde CI (Continuous Integration) hattında koşar; böylece algoritmaların metrolojik doğruluğu her zaman resmi olarak belgelenmiş kalır.
