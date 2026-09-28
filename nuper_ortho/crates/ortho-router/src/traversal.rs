//! # Z-First Absolute Traversal & Makine Park El Sıkışması (Doc 13 Bölüm 4)
//!
//! Çapraz (diyagonal) intikallerde probun parçaya, kuleye veya pabuçlara çarpmasını engelleyen
//! 3 aşamalı Z-First tavan intikali ve güvenli park motoru.

use glam::DVec3;
use serde::{Deserialize, Serialize};

/// Z-First Emniyetli İntikal Yolu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SafeTraversalSequence {
    /// 1. Adım: Tavana dikey çekilme noktası [X_curr, Y_curr, Z_ceiling]
    pub z_lift_point: DVec3,
    /// 2. Adım: Tavan düzleminde yatay intikal [X_target, Y_target, Z_ceiling]
    pub horizontal_traverse_point: DVec3,
    /// 3. Adım: Dikey iniş noktası [X_target, Y_target, Z_target]
    pub target_point: DVec3,
}

pub struct ZFirstTraversal;

impl ZFirstTraversal {
    /// Bulunulan rastgele başlangıç noktasından hedef noktaya 3 adımlı Z-First emniyet rotası kurar
    pub fn plan_safe_approach(
        current_pos: DVec3,
        target_pos: DVec3,
        z_ceiling: f64,
    ) -> Result<SafeTraversalSequence, String> {
        if z_ceiling <= current_pos.z || z_ceiling <= target_pos.z {
            return Err(format!(
                "Z_ceiling ({:.1} mm) hem başlangıç ({:.1} mm) hem de hedef ({:.1} mm) Z seviyelerinden yüksek olmalıdır",
                z_ceiling, current_pos.z, target_pos.z
            ));
        }

        let z_lift_point = DVec3::new(current_pos.x, current_pos.y, z_ceiling);
        let horizontal_traverse_point = DVec3::new(target_pos.x, target_pos.y, z_ceiling);

        Ok(SafeTraversalSequence {
            z_lift_point,
            horizontal_traverse_point,
            target_point: target_pos,
        })
    }

    /// Teftiş bitiminde probu güvenli makine park pozisyonuna taşır
    pub fn plan_safe_park(
        current_pos: DVec3,
        park_pos: DVec3,
        z_ceiling: f64,
    ) -> Result<SafeTraversalSequence, String> {
        Self::plan_safe_approach(current_pos, park_pos, z_ceiling)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_z_first_traversal_approach() {
        let current_probe = DVec3::new(10.0, 20.0, 50.0);
        let clearance_box_entry = DVec3::new(150.0, 200.0, 100.0);
        let z_ceiling = 350.0;

        let seq = ZFirstTraversal::plan_safe_approach(current_probe, clearance_box_entry, z_ceiling)
            .expect("Z-First yaklaşma planı geçerli olmalı");

        assert_eq!(seq.z_lift_point, DVec3::new(10.0, 20.0, 350.0), "1. Önce doğrudan Z tavanına çıkmalı");
        assert_eq!(seq.horizontal_traverse_point, DVec3::new(150.0, 200.0, 350.0), "2. Tavanda yatay intikal etmeli");
        assert_eq!(seq.target_point, clearance_box_entry, "3. Hedefe dikey inmeli");
    }
}
