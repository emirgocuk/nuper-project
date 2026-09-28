//! # İmalat Niyeti & Metroloji Strateji Ajanı (Doc 14 Bölüm 3)
//!
//! STEP geometrisini ve en-boy oranlarını inceleyerek parçanın nasıl üretildiğini
//! (tornalama, frezeleme, sac şekillendirme) anlar.
//! Özellikle tornalanmış millerde görülen 3-köşe loblanma (3-point lobing / form of odd-lobed polygon)
//! hatasını yakalamak için deterministik motora standart 4 nokta yerine 120° harmoniklerini yakalayan
//! 7 nokta örnekleme ve Chebyshev silindir fitting stratejisi önerir.

use serde::{Deserialize, Serialize};
use ortho_ast::{FeatureType, GeometricFeature, InspectionPlan};

/// Tahmin Edilen İmalat Yöntemi
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ManufacturingMethod {
    TurnedShaft,       // Torna parçası (Miller, burçlar, flanşlar)
    MilledPrismatic,   // Freze parçası (Prizmatik bloklar, manifoldlar)
    SheetMetalStamped, // Sac parça
    Unknown,
}

/// İmalat Niyeti Örnekleme Önerisi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ManufacturingIntentStrategy {
    pub detected_method: ManufacturingMethod,
    pub has_odd_point_lobing_risk: bool,
    pub recommended_points_per_level: usize,
    pub recommended_point_distribution_degrees: Vec<f64>,
    pub recommended_fitting_algorithm: &'static str,
    pub reasoning: String,
}

pub struct ManufacturingIntentDetector;

impl ManufacturingIntentDetector {
    /// Parçadaki silindirik ve düzlemsel unsurların geometrik dağılımından imalat yöntemini tespit eder
    pub fn analyze_intent(plan: &InspectionPlan) -> ManufacturingMethod {
        let mut cyl_count = 0;
        let mut plane_count = 0;

        for feature in &plan.features {
            match feature.feature_type {
                FeatureType::InternalCylinder | FeatureType::ExternalCylinder => cyl_count += 1,
                FeatureType::Plane => plane_count += 1,
                _ => {}
            }
        }

        // Eğer harici silindirler ve eksenel simetri baskınsa tornalama parçasıdır
        let has_external_cyl = plan
            .features
            .iter()
            .any(|f| f.feature_type == FeatureType::ExternalCylinder);

        if has_external_cyl && cyl_count >= plane_count {
            ManufacturingMethod::TurnedShaft
        } else {
            ManufacturingMethod::MilledPrismatic
        }
    }

    /// Tornalanmış bir silindir için 3-köşe loblanma riskini denetler ve özel örnekleme stratejisi üretir
    pub fn evaluate_cylinder_sampling_strategy(
        feature: &GeometricFeature,
        method: ManufacturingMethod,
    ) -> ManufacturingIntentStrategy {
        let is_cyl = matches!(
            feature.feature_type,
            FeatureType::InternalCylinder | FeatureType::ExternalCylinder
        );

        if method == ManufacturingMethod::TurnedShaft && is_cyl {
            // Tornalama işleminde punta/ayna ve titreşimlerden dolayı 3-köşe üçgenleşme (triangular lobing) riski yüksektir.
            // 4 nokta veya 8 nokta bu 3'lü harmonikleri yakalayamaz. En az 7 nokta (120° / 3 = ~51.4°) gereklidir.
            let points_count = 7;
            let step = 360.0 / points_count as f64;
            let angles = (0..points_count).map(|i| i as f64 * step).collect();

            ManufacturingIntentStrategy {
                detected_method: ManufacturingMethod::TurnedShaft,
                has_odd_point_lobing_risk: true,
                recommended_points_per_level: points_count,
                recommended_point_distribution_degrees: angles,
                recommended_fitting_algorithm: "Chebyshev Minimum Zone (ISO 1101)",
                reasoning: "Tornalanmış şaftlarda 3-köşe loblanma (triangular lobing) hatasını yakalamak için 120° harmoniklerine duyarlı 7 nokta örneklemesi önerilir.".to_string(),
            }
        } else {
            ManufacturingIntentStrategy {
                detected_method: method,
                has_odd_point_lobing_risk: false,
                recommended_points_per_level: 4,
                recommended_point_distribution_degrees: vec![0.0, 90.0, 180.0, 270.0],
                recommended_fitting_algorithm: "Gauss Least Squares",
                reasoning: "Prizmatik frezelenmiş delikler için standart 4 nokta Gauss dağılımı yeterlidir.".to_string(),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use glam::DVec3;
    use ortho_ast::DatumReferenceFrame;

    #[test]
    fn test_turned_shaft_intent_and_lobing() {
        let drf = DatumReferenceFrame::new_3_2_1("PCS", 1, 2, 3);
        let mut plan = InspectionPlan::new("PINION_SHAFT", "shaft.step", drf);

        let shaft_body = GeometricFeature::new_external_cylinder(
            1,
            "MAIN_JOURNAL",
            DVec3::ZERO,
            DVec3::Z,
            30.0,
            120.0,
            11300.0,
            15.0,
        )
        .unwrap();

        let shaft_end = GeometricFeature::new_plane(
            2,
            "SHAFT_END_FACE",
            DVec3::new(0.0, 0.0, 120.0),
            DVec3::Z,
            700.0,
            15.0,
        )
        .unwrap();

        plan.features = vec![shaft_body.clone(), shaft_end];

        let method = ManufacturingIntentDetector::analyze_intent(&plan);
        assert_eq!(method, ManufacturingMethod::TurnedShaft);

        let strat = ManufacturingIntentDetector::evaluate_cylinder_sampling_strategy(&shaft_body, method);
        assert!(strat.has_odd_point_lobing_risk);
        assert_eq!(strat.recommended_points_per_level, 7, "3-köşe loblanma için 7 nokta önerilmeli");
        assert_eq!(strat.recommended_point_distribution_degrees.len(), 7);
        assert_eq!(strat.recommended_fitting_algorithm, "Chebyshev Minimum Zone (ISO 1101)");
    }
}
