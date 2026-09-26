use glam::DVec3;
use serde::{Deserialize, Serialize};

/// Tekil bir Renishaw PH10 A/B açı konfigürasyonu
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct PH10Angle {
    /// Düşey eksenden yatma açısı: 0.0° - 105.0° (7.5° adımlarla)
    pub a_deg: f64,
    /// Yatay düzlemde dönüş açısı: -180.0° - +180.0° (7.5° adımlarla)
    pub b_deg: f64,
    /// Uzaydaki birim prob yönelim vektörü
    pub direction_vector: DVec3,
}

impl PH10Angle {
    /// A ve B açılarına göre küresel yönelim vektörünü hesaplar
    pub fn compute_direction(a_deg: f64, b_deg: f64) -> DVec3 {
        let a_rad = a_deg.to_radians();
        let b_rad = b_deg.to_radians();

        // Renishaw Kinematik Standart Yönelim Dönüşümü:
        // A=0, B=0 iken prob tam düşey aşağı (-Z) bakar.
        let x = a_rad.sin() * b_rad.sin();
        let y = -a_rad.sin() * b_rad.cos();
        let z = -a_rad.cos();

        DVec3::new(x, y, z).normalize()
    }

    pub fn new(a_deg: f64, b_deg: f64) -> Self {
        let direction_vector = Self::compute_direction(a_deg, b_deg);
        Self {
            a_deg,
            b_deg,
            direction_vector,
        }
    }
}

/// Renishaw PH10 720 Açı Arama Tablosu (Look-Up Table - LUT)
#[derive(Debug, Clone)]
pub struct PH10LookUpTable {
    pub angles: Vec<PH10Angle>,
}

impl Default for PH10LookUpTable {
    fn default() -> Self {
        Self::new()
    }
}

impl PH10LookUpTable {
    /// 720 diskret kombinasyonu önceden hesaplayarak LUT oluşturur
    pub fn new() -> Self {
        let mut angles = Vec::with_capacity(15 * 49);

        // A ekseni: 0° - 105° (15 adım)
        let a_steps = 15;
        // B ekseni: -180° - +180° (48 adım)
        let b_steps = 48;

        for i in 0..=a_steps {
            let a_deg = (i as f64) * 7.5;
            for j in 0..b_steps {
                let b_deg = -180.0 + (j as f64) * 7.5;
                angles.push(PH10Angle::new(a_deg, b_deg));
            }
        }

        Self { angles }
    }

    /// Verilen hedef yaklaşma vektörüne en dik (skaler çarpımı en yüksek) kafa açısını bulur
    pub fn find_best_angle(&self, target_approach: DVec3) -> (PH10Angle, f64) {
        let target_norm = target_approach.normalize();
        let mut best_angle = self.angles[0];
        let mut max_dot = -1.0;

        for angle in &self.angles {
            let dot = angle.direction_vector.dot(target_norm);
            if dot > max_dot {
                max_dot = dot;
                best_angle = *angle;
            }
        }

        // Açısal sapma (derece): theta = acos(dot)
        let clamped_dot = max_dot.clamp(-1.0, 1.0);
        let angular_error_deg = clamped_dot.acos().to_degrees();

        (best_angle, angular_error_deg)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vertical_down_angle() {
        let lut = PH10LookUpTable::new();
        // Hedef aşağı doğru (-Z)
        let target = DVec3::new(0.0, 0.0, -1.0);
        let (best, error) = lut.find_best_angle(target);

        assert_eq!(best.a_deg, 0.0);
        assert!(error < 0.01, "Açısal hata sıfıra yakın olmalı");
    }

    #[test]
    fn test_horizontal_lateral_angle() {
        let lut = PH10LookUpTable::new();
        // Hedef pozitif X yönünde
        let target = DVec3::new(1.0, 0.0, 0.0);
        let (best, error) = lut.find_best_angle(target);

        assert_eq!(best.a_deg, 90.0);
        assert!(error < 0.01, "90 derece yatay açı mükemmel bulunmalı");
    }
}
