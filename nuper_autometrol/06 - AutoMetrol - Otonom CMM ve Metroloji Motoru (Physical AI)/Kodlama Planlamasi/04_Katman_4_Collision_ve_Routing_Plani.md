# 🛡️ Katman 4 Planı: Emniyet Zarfı ve Çarpışmasız Rota (`autometrol-router`)

> **"Parça etrafına emniyet kutusu (Clearance Box) ören; pabuç ve fikstürleri atlayan; prob şaftı ve kafa gövdesi sürtünmesini engelleyen ve güvenli hareket graflarını üreten rota katmanı planı."**

---

## 📌 1. Modülün Amacı ve Sorumluluğu

`autometrol-router` kütüphanesi, sistemin **Emniyet ve Optimizasyon** katmanıdır. Görevi:
1. Katman 3'ten gelen ayrık temas noktalarını birbirine bağlayan güvenli hareket yollarını planlamak.
2. Parça etrafında $+50\text{ mm}$ üst ve $+30\text{ mm}$ yanal emniyet kutusunu (Clearance Box) yönetmek.
3. Operatörün işaretlediği bağlama pabuçlarını (clamps) ve mengene engellerini $+40\text{ mm}$ yukarıdan atlamak (Leap Envelope).
4. Kalibrasyon küresi ve prob şarj istasyonu gibi kalıcı statik engellerden kaçınmak.
5. Prob şaftı ve TP20 gövdesinin delik ağzına veya dik duvarlara sürtünmesini engellemek.
6. Katman 5'in tezgaha basacağı sıralı **`MotionTrajectory`** hareket listesini üretmek.

---

## 📦 2. Dinamik Emniyet Kutusu ve Yasaklı Bölgeler (`clearance`)

```rust
// autometrol-router/src/clearance.rs
use glam::DVec3;

#[derive(Debug, Clone)]
pub struct ClearanceBox {
    pub min: DVec3,
    pub max: DVec3,
    pub safe_z_plane: f64, // Z_max + 50.0 mm
}

impl ClearanceBox {
    pub fn from_part_bounds(min: DVec3, max: DVec3) -> Self {
        Self {
            min: DVec3::new(min.x - 30.0, min.y - 30.0, min.z),
            max: DVec3::new(max.x + 30.0, max.y + 30.0, max.z + 50.0),
            safe_z_plane: max.z + 50.0,
        }
    }
}

#[derive(Debug, Clone)]
pub struct KeepOutZone {
    pub id: u32,
    pub name: String, // "Kose_Pabucu_1", "Kalibrasyon_Kuresi"
    pub min: DVec3,
    pub max: DVec3,
    pub leap_z: f64,  // Engel yüksekliği + 40.0 mm
}
```

---

## 🔍 3. Prob Şaftı ve Gövde Çarpışma Doğrulaması (`shank_collision`)

Temasın sadece yakut bilyeden (Ruby Ball) alındığından emin olan silindirik gövde çarpışma kontrolörü:

```rust
// autometrol-router/src/shank_collision.rs
use glam::DVec3;

pub struct StylusAssembly {
    pub ball_radius: f64,   // 1.0 .. 2.0 mm (Yakut Bilye)
    pub stem_radius: f64,   // 0.75 mm (Şaft gövdesi)
    pub stem_length: f64,   // 20.0 .. 100.0 mm
    pub module_radius: f64, // 6.75 mm (TP20 gövde yarıçapı)
    pub module_length: f64, // 30.0 mm
}

impl StylusAssembly {
    /// Maksimum güvenli ölçüm derinliğini hesaplar
    pub fn max_safe_depth(&self) -> f64 {
        self.stem_length - (self.ball_radius - self.stem_radius)
    }

    /// Prob gövdesi ile delik cidarının veya duvarın mesafesini kontrol eder (min 1.5mm)
    pub fn validate_clearance(&self, hole_diameter: f64, hole_depth: f64) -> bool {
        let hole_radius = hole_diameter / 2.0;
        // Delik derinliği şaft boyundan fazlaysa TP20 gövdesi deliğe girer ve çarpar
        if hole_depth > self.stem_length {
            if hole_radius < (self.module_radius + 1.5) {
                return false; // TP20 gövde çarpışması!
            }
        }
        // Şaft ile delik ağzı arasında en az 1.5mm boşluk olmalıdır
        (hole_radius - self.stem_radius) >= 1.5
    }
}
```

---

## 🧭 4. Hareket Yolu ve Rota Komutları (`MotionTrajectory`)

Katman 4'ün ürettiği nihai deterministik hareket komut dizisi:

```rust
// autometrol-router/src/trajectory.rs
use glam::DVec3;

#[derive(Debug, Clone)]
pub enum MotionCommand {
    /// Emniyet düzleminde hızlı intikal (GOTO/CART)
    RapidMove { target: DVec3 },
    /// Yüzeye güvenli yaklaşma (Yaklaşma mesafesi: 4.0 mm)
    LinearApproach { target: DVec3, speed_mms: f64 },
    /// Ölçüm temas noktası (Ölçüm hızı: 2.0 mm/sn)
    TouchMeasure { target: DVec3, normal: DVec3 },
    /// Yüzey normali boyunca geri çekilme (Retract: 5.0 mm)
    NormalRetract { distance: f64 },
    /// Yalnızca güvenli Z düzleminde tetiklenen kafa rotasyonu
    ChangeHeadOrientation { a_deg: f64, b_deg: f64 },
    /// Otomatik prob magazini değiştirme hareketi
    ToolChange { rack_port: u8 },
}

#[derive(Debug, Clone)]
pub struct FeatureMotionBlock {
    pub feature_id: u32,
    pub feature_name: String,
    pub commands: Vec<MotionCommand>,
}
```

Bu yapı sayesinde, tezgaha giden her bir satır kodun arkasında fiziksel bir emniyet ve çarpışmasız intikal garantisi bulunur.
