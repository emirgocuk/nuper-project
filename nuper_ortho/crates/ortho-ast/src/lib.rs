//! # ortho-ast
//! 
//! Nuper Ortho Nötr Metroloji Ara Temsili (Intermediate Representation - IR).
//! Bu sandık, CMM markalarından ve donanımlarından bağımsız olarak teftiş unsurlarını,
//! ASME Y14.5 ve ISO 1101 datum zincirlerini ve geometrik toleransları modelleyen tip-güvenli çekirdektir.

pub mod alignment;
pub mod compound;
pub mod composite_gdandt;
pub mod datum;
pub mod error;
pub mod feature;
pub mod plan;
pub mod threads;
pub mod tolerance;

// Kolay erişim için ana tipleri dışa aktar
pub use alignment::{
    recommend_3_2_1_alignment, recommend_adaptive_alignment, verify_6dof_jacobian_rank,
    AlignmentColorRole, AlignmentPointGuidance, AlignmentRecommendation, AlignmentStrategyType,
};
pub use compound::{
    detect_compound_holes, BoreSegment, CompoundHoleFeature, ConcentricityEvaluation,
    CounterborePocket, CountersinkChamfer, StepPlaneFace,
};
pub use composite_gdandt::{CompositeTolerance, SingleToleranceZone};
pub use datum::{DatumFeature, DatumLabel, DatumPrecedence, DatumReferenceFrame};
pub use error::AstError;
pub use feature::{FeatureType, GeometricFeature};
pub use plan::{InspectionPlan, LengthUnit, MultiSetupPlan};
pub use threads::{
    classify_thread_from_bore, classify_thread_from_callout, ManualGaugeItem, SetupSheetGaugeReport,
    ThreadBypassStrategy, ThreadDiameterKind, ThreadSpecification, ThreadStandard,
};
pub use tolerance::{
    FittingAlgorithm, MaterialModifier, ProfileZoneDisposition, ToleranceConstraint, ToleranceType,
};

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

    #[test]
    fn test_surface_profile_unilateral_definition() {
        let profile_tol = ToleranceConstraint::new_surface_profile(
            201,
            1,
            0.8,
            ProfileZoneDisposition::UnequallyDisposed {
                total_width: 0.8,
                outward_offset: 0.2,
            },
            vec![DatumLabel::A, DatumLabel::B, DatumLabel::C],
        );

        assert_eq!(profile_tol.tolerance_type, ToleranceType::ProfileOfSurface);
        assert!((profile_tol.upper_tolerance - 0.2).abs() < 1e-6);
        assert!((profile_tol.lower_tolerance - (-0.6)).abs() < 1e-6);
        assert_eq!(profile_tol.recommended_fitting, FittingAlgorithm::MinimumZone);
    }

    #[test]
    fn test_composite_tolerance_validation() {
        let hole1 = GeometricFeature::new_internal_cylinder(
            10,
            "HOLE_1",
            DVec3::new(10.0, 10.0, 0.0),
            DVec3::Z,
            10.0,
            20.0,
            100.0,
            5.0,
        )
        .unwrap();

        let hole2 = GeometricFeature::new_internal_cylinder(
            20,
            "HOLE_2",
            DVec3::new(30.0, 10.0, 0.0),
            DVec3::Z,
            10.0,
            20.0,
            100.0,
            5.0,
        )
        .unwrap();

        let features = vec![hole1, hole2];

        // Geçerli ASME Y14.5 Bileşik Tolerans: PLTZF = 0.8 [A, B, C], FRTZF = 0.15 [A]
        let valid_comp = CompositeTolerance::new_composite_position(
            1,
            "COMP_HOLE_PATTERN",
            vec![10, 20],
            0.80,
            vec![DatumLabel::A, DatumLabel::B, DatumLabel::C],
            0.15,
            vec![DatumLabel::A],
        );
        assert!(valid_comp.validate(&features).is_ok());

        // Geçersiz: FRTZF PLTZF'den büyük (Kural ihlali)
        let invalid_tol = CompositeTolerance::new_composite_position(
            2,
            "INVALID_TOL",
            vec![10, 20],
            0.10,
            vec![DatumLabel::A],
            0.50, // 0.50 > 0.10
            vec![DatumLabel::A],
        );
        assert!(invalid_tol.validate(&features).is_err());

        // Geçersiz: FRTZF yeni veya sırası bozuk datum getiriyor
        let invalid_datum = CompositeTolerance::new_composite_position(
            3,
            "INVALID_DATUM",
            vec![10, 20],
            0.80,
            vec![DatumLabel::A, DatumLabel::B],
            0.20,
            vec![DatumLabel::B], // A atlanıp doğrudan B getirilemez
        );
        assert!(invalid_datum.validate(&features).is_err());
    }

    #[test]
    fn test_classify_thread_from_callout_and_gauge_report() {
        let spec_m10 = classify_thread_from_callout("4x M10 - 6H", 25.0, Some(8.5))
            .expect("M10 tespit edilmeli");
        assert_eq!(spec_m10.nominal_major_diameter, 10.0);
        assert_eq!(spec_m10.tap_drill_diameter, 8.5);

        let spec_gas = classify_thread_from_callout("Port G 1/4\" BSPP", 15.0, Some(11.8))
            .expect("G 1/4 tespit edilmeli");
        assert_eq!(spec_gas.tap_drill_diameter, 11.8);

        let spec_unc = classify_thread_from_callout("Bolt 1/4-20 UNC", 12.0, None)
            .expect("1/4-20 UNC tespit edilmeli");
        assert_eq!(spec_unc.tap_drill_diameter, 5.10);

        // Setup Sheet Rapor Tablosu Oluşturma
        let mut report = SetupSheetGaugeReport::new();
        report.add_item(spec_m10.to_gauge_item(101, "HOLE_M10_01"));
        report.add_item(spec_gas.to_gauge_item(102, "PORT_G14_PRESSURE"));

        assert_eq!(report.len(), 2);
        let ascii_table = report.format_ascii_table();
        assert!(ascii_table.contains("HOLE_M10_01"));
        assert!(ascii_table.contains("PORT_G14_PRESSURE"));
        assert!(ascii_table.contains("ISO 1502 / DIN 13"));

        let md_table = report.format_markdown_table();
        assert!(md_table.contains("M10x1.50"));
        assert!(md_table.contains("G 1/4\""));
    }

    #[test]
    fn test_multi_setup_plan_splitting() {
        let drf = DatumReferenceFrame::new_3_2_1("PCS_1", 1, 2, 3);
        let mut plan = InspectionPlan::new("MANIFOLD_BLOCK", "block.step", drf);

        // Üst yüzey (+Z normal)
        let top_face = GeometricFeature::new_plane(
            1,
            "TOP_FACE",
            glam::DVec3::new(50.0, 50.0, 50.0),
            glam::DVec3::Z,
            5000.0,
            10.0,
        ).unwrap();
        plan.features.push(top_face);

        // Yan delik (+X normal)
        let side_hole = GeometricFeature::new_internal_cylinder(
            2,
            "SIDE_BORE",
            glam::DVec3::new(100.0, 50.0, 25.0),
            glam::DVec3::X,
            15.0,
            20.0,
            942.0,
            5.0,
        ).unwrap();
        plan.features.push(side_hole);

        // Alt taban yüzeyi (-Z normal)
        let bottom_face = GeometricFeature::new_plane(
            3,
            "BOTTOM_FLANGE",
            glam::DVec3::new(50.0, 50.0, 0.0),
            -glam::DVec3::Z,
            5000.0,
            10.0,
        ).unwrap();
        plan.features.push(bottom_face);

        // Alt delik (-Z normal)
        let bottom_hole = GeometricFeature::new_internal_cylinder(
            4,
            "BOTTOM_PIN_BORE",
            glam::DVec3::new(50.0, 50.0, 0.0),
            -glam::DVec3::Z,
            8.0,
            15.0,
            376.0,
            5.0,
        ).unwrap();
        plan.features.push(bottom_hole);

        plan.tolerances.push(ToleranceConstraint::new_h7_hole(101, 2, 15.0, 0.018));
        plan.tolerances.push(ToleranceConstraint::new_h7_hole(102, 4, 8.0, 0.015));

        // Z_up tablası normaline göre OP10 ve OP20'ye böl
        let multi_setup = plan.split_into_multi_setup(glam::DVec3::Z);

        assert_eq!(multi_setup.op10.features.len(), 2); // TOP_FACE, SIDE_BORE
        assert_eq!(multi_setup.op10.tolerances.len(), 1); // Tol 101

        assert!(multi_setup.op20.is_some());
        let op20 = multi_setup.op20.unwrap();
        assert_eq!(op20.features.len(), 2); // BOTTOM_FLANGE, BOTTOM_PIN_BORE
        assert_eq!(op20.tolerances.len(), 1); // Tol 102
        assert_eq!(op20.part_name, "MANIFOLD_BLOCK_OP20");

        assert_eq!(multi_setup.setup_instructions.len(), 3);
        assert!(multi_setup.setup_instructions[1].contains("180° ters çevirin"));
    }
}

