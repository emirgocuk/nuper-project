//! # Doğal Dilde Çarpışma ve Hareket Teşhisi (Doc 14 Bölüm 4)
//!
//! RRT* veya GJK/EPA çarpışma motoru engel bulduğunda kuru koordinat logları yerine
//! atölye dilinde, operatörün anlayacağı net arıza açıklamaları ve çözüm önerileri üretir.

use glam::DVec3;
use serde::{Deserialize, Serialize};

/// Doğal Dil Teşhis Raporu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CollisionDiagnosticReport {
    pub feature_name: String,
    pub collision_point: DVec3,
    pub colliding_element: String,
    pub obstacle_name: String,
    pub natural_language_explanation: String,
    pub suggested_remedy: String,
}

pub struct NaturalLanguageDiagnostics;

impl NaturalLanguageDiagnostics {
    /// Prob ve pabuç/parça çakışma logunu operatör dostu Türkçe açıklamaya döker
    pub fn explain_collision(
        feature_name: &str,
        collision_pt: DVec3,
        colliding_element: &str, // Örn: "Prob Gövdesi (PH10M)" veya "Karbon Uzatma Çubuğu"
        obstacle_name: &str,     // Örn: "2 Numaralı Çelik Pabuç" veya "Flanş Yan Duvarı"
        current_angle_deg: (f64, f64),
    ) -> CollisionDiagnosticReport {
        let (a_deg, b_deg) = current_angle_deg;

        let explanation = format!(
            "Uyarı: '{}' ölçülürken A{:.1}° B{:.1}° kafa açısında {} elemanı, '{}' engeline sürtüyor (Temas X:{:.1}, Y:{:.1}, Z:{:.1}).",
            feature_name, a_deg, b_deg, colliding_element, obstacle_name,
            collision_pt.x, collision_pt.y, collision_pt.z
        );

        let remedy = if colliding_element.contains("Uzatma") || colliding_element.contains("Şaft") {
            format!("Öneri: Prob uzatmasını 50 mm'ye çıkarın veya kafa açısını A{:.1}° B{:.1}° konumuna revize edin.", (a_deg - 15.0).max(0.0), b_deg)
        } else {
            format!("Öneri: '{}' pabuç konumunu parçanın dışına doğru en az 15 mm kaydırın veya Lift-and-Hop emniyet seviyesini artırın.", obstacle_name)
        };

        CollisionDiagnosticReport {
            feature_name: feature_name.to_string(),
            collision_point: collision_pt,
            colliding_element: colliding_element.to_string(),
            obstacle_name: obstacle_name.to_string(),
            natural_language_explanation: explanation,
            suggested_remedy: remedy,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_natural_language_collision_report() {
        let report = NaturalLanguageDiagnostics::explain_collision(
            "FLANGE_HOLE_04",
            DVec3::new(120.0, 45.0, 30.0),
            "Karbon Uzatma Çubuğu",
            "2 Numaralı Çelik Pabuç",
            (90.0, 180.0),
        );

        assert!(report.natural_language_explanation.contains("FLANGE_HOLE_04"));
        assert!(report.natural_language_explanation.contains("2 Numaralı Çelik Pabuç"));
        assert!(report.suggested_remedy.contains("Öneri:"));
    }
}
