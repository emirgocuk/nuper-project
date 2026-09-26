//! # ortho-ast
//! 
//! Nuper Ortho Nötr Metroloji Ara Temsili (Intermediate Representation - IR).
//! Bu sandık, CMM markalarından ve donanımlarından bağımsız olarak teftiş unsurlarını,
//! ASME Y14.5 ve ISO 1101 datum zincirlerini ve geometrik toleransları modelleyen tip-güvenli çekirdektir.

pub mod compound;
pub mod datum;
pub mod error;
pub mod feature;
pub mod plan;
pub mod threads;
pub mod tolerance;

// Kolay erişim için ana tipleri dışa aktar
pub use compound::CompoundHoleFeature;
pub use datum::{DatumFeature, DatumLabel, DatumPrecedence, DatumReferenceFrame};
pub use error::AstError;
pub use feature::{FeatureType, GeometricFeature};
pub use plan::{InspectionPlan, LengthUnit};
pub use threads::{ThreadBypassStrategy, ThreadSpecification, ThreadStandard};
pub use tolerance::{FittingAlgorithm, MaterialModifier, ToleranceConstraint, ToleranceType};

#[cfg(test)]
mod tests {
    use super::*;
    use glam::DVec3;

    #[test]
    fn test_valid_plane_creation() {
        let plane = GeometricFeature::new_plane(
            1,
            "TOP_DATUM_A",
            DVec3::new(0.0, 0.0, 50.0),
            DVec3::new(0.0, 0.0, 1.0),
            1200.0,
            15.0,
        )
        .expect("Düzlem geçerli olmalı");

        assert_eq!(plane.feature_type, FeatureType::Plane);
        assert!(!plane.is_thin_walled());
        assert_eq!(plane.approach_vector(), DVec3::new(0.0, 0.0, -1.0));
    }

    #[test]
    fn test_thin_wall_detection() {
        let thin_plane = GeometricFeature::new_plane(
            2,
            "THIN_RIB",
            DVec3::new(10.0, 0.0, 20.0),
            DVec3::new(1.0, 0.0, 0.0),
            400.0,
            1.8, // 1.8 mm < 2.5 mm
        )
        .expect("İnce cidar düzlemi geçerli olmalı");

        assert!(thin_plane.is_thin_walled());
    }

    #[test]
    fn test_invalid_normal_vector_fails() {
        let err = GeometricFeature::new_plane(
            3,
            "INVALID_NORMAL",
            DVec3::ZERO,
            DVec3::new(0.0, 0.0, 2.5), // Uzunluk = 2.5, birim değil
            500.0,
            10.0,
        );

        assert!(matches!(err, Err(AstError::InvalidNormalVector { .. })));
    }

    #[test]
    fn test_datum_reference_frame_validation() {
        let plane_a = GeometricFeature::new_plane(
            10,
            "DATUM_A",
            DVec3::new(0.0, 0.0, 100.0),
            DVec3::new(0.0, 0.0, 1.0),
            5000.0,
            20.0,
        )
        .unwrap();

        let cylinder_b = GeometricFeature::new_internal_cylinder(
            20,
            "DATUM_B_BORE",
            DVec3::new(50.0, 50.0, 50.0),
            DVec3::new(0.0, 0.0, 1.0),
            30.0,
            50.0,
            1500.0,
            10.0,
        )
        .unwrap();

        let plane_c = GeometricFeature::new_plane(
            30,
            "DATUM_C_STOP",
            DVec3::new(0.0, 50.0, 50.0),
            DVec3::new(1.0, 0.0, 0.0),
            800.0,
            12.0,
        )
        .unwrap();

        let features = vec![plane_a, cylinder_b, plane_c];
        let drf = DatumReferenceFrame::new_3_2_1("PCS_MAIN", 10, 20, 30);

        let locked_dof = drf.validate(&features).expect("3-2-1 geçerli olmalı");
        assert_eq!(locked_dof, 6);
    }

    #[test]
    fn test_thread_tap_drill_matching() {
        let thread_m8 = ThreadSpecification::new_metric_coarse(8.0, 20.0)
            .expect("M8 standardı bulunmalı");

        assert_eq!(thread_m8.tap_drill_diameter, 6.8);
        assert_eq!(thread_m8.nominal_major_diameter, 8.0);

        // CAD'de 6.8 mm matkap deliği olarak modellenmişse eşleşmeli
        assert!(thread_m8.matches_diameter(6.80, 0.05));
        // CAD'de 8.0 mm anma çapı olarak modellenmişse de eşleşmeli
        assert!(thread_m8.matches_diameter(8.00, 0.05));
        // Rastgele bir çap (örn. 7.5 mm) eşleşmemeli
        assert!(!thread_m8.matches_diameter(7.50, 0.05));
    }

    #[test]
    fn test_inspection_plan_json_roundtrip() {
        let plane_a = GeometricFeature::new_plane(
            1,
            "PLN_BASE",
            DVec3::ZERO,
            DVec3::new(0.0, 0.0, 1.0),
            2000.0,
            10.0,
        )
        .unwrap();

        let hole = GeometricFeature::new_internal_cylinder(
            2,
            "HOLE_H7",
            DVec3::new(20.0, 20.0, 10.0),
            DVec3::new(0.0, 0.0, 1.0),
            12.0,
            25.0,
            500.0,
            5.0,
        )
        .unwrap();

        let stop_c = GeometricFeature::new_plane(
            3,
            "PLN_STOP",
            DVec3::new(0.0, 0.0, 0.0),
            DVec3::new(1.0, 0.0, 0.0),
            500.0,
            10.0,
        )
        .unwrap();

        let drf = DatumReferenceFrame::new_3_2_1("DRF_1", 1, 2, 3);
        let mut plan = InspectionPlan::new("HYDRAULIC_BLOCK", "valve_body.step", drf);

        plan.features.push(plane_a);
        plan.features.push(hole);
        plan.features.push(stop_c);

        let tol_h7 = ToleranceConstraint::new_h7_hole(101, 2, 12.0, 0.018);
        plan.tolerances.push(tol_h7);

        let json = plan.to_json().expect("JSON serileştirme başarılı olmalı");
        assert!(json.contains("HYDRAULIC_BLOCK"));
        assert!(json.contains("ChebyshevMaximumInscribed"));

        let restored_plan =
            InspectionPlan::from_json(&json).expect("JSON deserileştirme başarılı olmalı");
        assert_eq!(restored_plan.part_name, "HYDRAULIC_BLOCK");
        assert_eq!(restored_plan.features.len(), 3);
    }
}
