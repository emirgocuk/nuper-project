# 🔄 Katman 3 Planı: Kinematik ve Örnekleme Motoru (`autometrol-kinematics`)

> **"Soyut AST hedeflerini fiziksel prob kafa açılarına (PH10 720 diskret projeksiyon & MH20i kümeleme) ve ISO 10360 standardında temas koordinatlarına dönüştüren kinematik katman planı."**

---

## 📌 1. Modülün Amacı ve Sorumluluğu

`autometrol-kinematics` kütüphanesi, sistemin **Fizik ve Örnekleme** katmanıdır. Görevi:
1. Katman 2'deki her `InspectionTarget` için en uygun prob kafası oryantasyonunu ($A, B$ açıları) hesaplamak.
2. Motorize kafalarda (PH10) 720 açı arasından en dik projeksiyonu milisaniyeler içinde bulmak.
3. Manuel kafalarda (MH20i) operatörün elle kafa çevirme sayısını k-means ile minimize etmek.
4. Makinenin önceden kalibre edilmiş açı listesine öncelik vermek.
5. Her geometrik unsur için ISO 10360 standardında temas noktası koordinatlarını ($X,Y,Z$) ve yaklaşma normal vektörlerini ($I,J,K$) üretmek.

---

## 📐 2. PH10 Diskret Açı Çözücü Mimarisi (`ph10_solver`)

Çözücü, başlangıçta 720 açının tüm birim vektörlerini içeren bir **Arama Tablosu (Lookup Table - LUT)** oluşturur:

```rust
// autometrol-kinematics/src/ph10_solver.rs
use glam::DVec3;

pub struct Ph10Orientation {
    pub a_deg: f64, // 0.0 .. 105.0 (7.5 adım)
    pub b_deg: f64, // -180.0 .. 180.0 (7.5 adım)
    pub vector: DVec3,
}

pub struct Ph10KinematicTable {
    pub positions: Vec<Ph10Orientation>, // 720 elemanlı LUT
}

impl Ph10KinematicTable {
    pub fn new() -> Self {
        let mut positions = Vec::with_capacity(720);
        let mut a = 0.0;
        while a <= 105.01 {
            let mut b = -180.0;
            while b <= 180.01 {
                let a_rad = a.to_radians();
                let b_rad = b.to_radians();
                let v = DVec3::new(
                    a_rad.sin() * b_rad.sin(),
                    -a_rad.sin() * b_rad.cos(),
                    -a_rad.cos(),
                );
                positions.push(Ph10Orientation { a_deg: a, b_deg: b, vector: v });
                b += 7.5;
            }
            a += 7.5;
        }
        Self { positions }
    }

    /// Hedef yaklaşma vektörüne en yakın kalibre açıyı seçer
    pub fn solve_best_angle(&self, target_approach: DVec3, qualified_angles: &[Ph10Orientation]) -> Ph10Orientation {
        // Öncelik: Kullanıcının makinesinde daha önce kalibre edilmiş açılar
        if let Some(best_qualified) = qualified_angles.iter()
            .max_by(|p1, p2| p1.vector.dot(target_approach).partial_cmp(&p2.vector.dot(target_approach)).unwrap()) {
            if best_qualified.vector.dot(target_approach) >= 0.996 { // < 5 derece sapma
                return best_qualified.clone();
            }
        }
        // Kalibre açılar yetersizse genel 720'lik tablodan en dik olanı seç
        self.positions.iter()
            .max_by(|p1, p2| p1.vector.dot(target_approach).partial_cmp(&p2.vector.dot(target_approach)).unwrap())
            .unwrap()
            .clone()
    }
}
```

---

## 🎯 3. Standart Temas Noktası Üreticileri (`samplers`)

Farklı yüzey tipleri için ISO 10360 ve ASME Y14.5 standartlarına uygun örnekleyiciler:

```rust
// autometrol-kinematics/src/sampler.rs
use glam::DVec3;

#[derive(Debug, Clone)]
pub struct TouchPoint {
    pub position: DVec3,
    pub approach_normal: DVec3, // Yüzeye tam dik: V_touch . N_surface = -1.0
}

/// Düzlem için çapak marjı ofsetli 4 noktalı Gauss/Chebyshev örnekleyici
pub fn sample_plane_corners(center: DVec3, normal: DVec3, half_w: f64, half_h: f64, probe_radius: f64) -> Vec<TouchPoint> {
    let margin = probe_radius + 1.5; // Çapak ve radyus tuzağı güvenlik payı
    let eff_w = (half_w - margin).max(1.0);
    let eff_h = (half_h - margin).max(1.0);

    // Düzlem içi iki dik eksen (u, v)
    let u = normal.any_orthonormal_vector().normalize();
    let v = normal.cross(u).normalize();

    vec![
        TouchPoint { position: center + eff_w * u + eff_h * v, approach_normal: -normal },
        TouchPoint { position: center - eff_w * u + eff_h * v, approach_normal: -normal },
        TouchPoint { position: center - eff_w * u - eff_h * v, approach_normal: -normal },
        TouchPoint { position: center + eff_w * u - eff_h * v, approach_normal: -normal },
    ]
}

/// Dişi delik için 2 seviyeli 4'er noktalı (toplam 8 nokta) dairesellik/silindiriklik örnekleyicisi
pub fn sample_cylinder_hole(center: DVec3, axis: DVec3, radius: f64, depth: f64) -> Vec<TouchPoint> {
    let mut points = Vec::with_capacity(8);
    let z_levels = [depth * 0.25, depth * 0.75]; // 2 derinlik seviyesi
    let u = axis.any_orthonormal_vector().normalize();
    let v = axis.cross(u).normalize();

    for &z in &z_levels {
        let level_center = center + axis * z;
        for i in 0..4 {
            let angle = (i as f64) * std::f64::consts::FRAC_PI_2; // 0, 90, 180, 270 derece
            let dir = angle.cos() * u + angle.sin() * v;
            let touch_pos = level_center + dir * radius;
            points.push(TouchPoint {
                position: touch_pos,
                approach_normal: -dir, // Merkezden duvara doğru radyal temas
            });
        }
    }
    points
}
```

---

## 📦 4. Katman Çıktısı: `OrientedSamplingPlan`

Bu katman, her teftiş hedefinin hangi kafa açısıyla ve hangi koordinatlardan ölçüleceğini belirleyen **`OrientedSamplingPlan`** nesnesini bir sonraki rota katmanına teslim eder.
