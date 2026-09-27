//! # End-to-End Integration Test: FAZ 3 Adım 3.1
//! 
//! İleri GD&T, Serbest Form Yüzey Profili (Profile of a Surface ⌢),
//! Eğriliğe Göre Uyarlamalı Örnekleme (Curvature-Adaptive Sampling),
//! ASME Y14.5 Bileşik Konum Toleransı (Composite FCF - PLTZF / FRTZF) ve
//! DMIS 5.3 GSURF / PROFS Post-Processor Hattı.

use glam::DVec3;
use ortho_ast::{
    CompositeTolerance, DatumLabel, DatumReferenceFrame,
    GeometricFeature, InspectionPlan, ProfileZoneDisposition, ToleranceConstraint, ToleranceType,
};
use ortho_brep::ParametricFace;
use ortho_emitter::DmisEmitter;
use ortho_kinematics::{
    evaluate_composite_position_2d, evaluate_surface_profile,
    OrientedSamplingPlan, PH10Angle, PH10LookUpTable, ProbeStack,
};
use ortho_router::{
    CertifiedCollisionFreeTrajectory, ClearanceBox, CmmMachineProfile, StylusAssembly,
};

#[test]
fn test_phase3_freeform_surface_and_composite_gdt_pipeline() {
    // =========================================================================
    // 1. HAVACILIK KANAT/TÜRBİN SERBEST FORM B-SPLINE YÜZEYİ (B-Rep & Parametrik)
    // =========================================================================
    // 4x4 B-Spline kontrol ağı (Kavisli aerodinamik serbest form yüzeyi)
    let ctrl_net = vec![
        vec![
            DVec3::new(0.0, 0.0, 0.0),
            DVec3::new(30.0, 0.0, 5.0),
            DVec3::new(70.0, 0.0, 8.0),
            DVec3::new(100.0, 0.0, 2.0),
        ],
        vec![
            DVec3::new(0.0, 30.0, 2.0),
            DVec3::new(30.0, 30.0, 18.0), // Yüksek kamburluk (camber)
            DVec3::new(70.0, 30.0, 22.0),
            DVec3::new(100.0, 30.0, 5.0),
        ],
        vec![
            DVec3::new(0.0, 70.0, 1.0),
            DVec3::new(30.0, 70.0, 12.0),
            DVec3::new(70.0, 70.0, 15.0),
            DVec3::new(100.0, 70.0, 3.0),
        ],
        vec![
            DVec3::new(0.0, 100.0, 0.0),
            DVec3::new(30.0, 100.0, 2.0),
            DVec3::new(70.0, 100.0, 3.0),
            DVec3::new(100.0, 100.0, 0.0),
        ],
    ];

    let wing_face = ParametricFace::new_bspline(101, ctrl_net.clone(), 3, 3);

    // 1.1 Yüzey Geometrisi ve Diferansiyel Eğrilik Motoru Doğrulaması
    let p_mid = wing_face.evaluate_point(0.5, 0.5);
    assert!(p_mid.z > 5.0, "B-Spline kamburluk tepe noktası Z > 5 mm olmalı");

    let norm_mid = wing_face.evaluate_normal(0.5, 0.5);
    assert!(norm_mid.z > 0.8, "Yüzey normali yukarıya bakmalıdır");

    let curv_mid = wing_face.evaluate_curvature(0.5, 0.5);
    assert!(
        curv_mid.mean.abs() > 1e-5,
        "Kamburluk merkezinde ortalama eğrilik H > 0 olmalıdır"
    );

    // 1.2 Eğriliğe Göre Uyarlamalı Örnekleme ve 1.5 mm Çapak Emniyeti (Doc 20 Section 4)
    let adaptive_candidates = wing_face.generate_curvature_adaptive_grid(4, 4, 0.0005);
    assert!(
        adaptive_candidates.len() >= 8,
        "Uyarlamalı ızgara en az 8 temas noktası üretmelidir"
    );

    for cand in &adaptive_candidates {
        assert!(
            cand.distance_to_boundary_mm >= 1.5,
            "Doc 08 Kural İhlali: Kenar çapak payı mesafesi ({:.2} mm) 1.5 mm'den küçük!",
            cand.distance_to_boundary_mm
        );
        assert!(cand.surface_normal.length() > 0.99);
    }

    // =========================================================================
    // 2. ASME Y14.5 YÜZEY PROFİLİ (PROFILE OF A SURFACE ⌢) HESAPLAMA MOTORU
    // =========================================================================
    // Nominal noktalar ve birim yüzey normalleri
    let nominal_points: Vec<DVec3> = adaptive_candidates.iter().map(|c| c.point_3d).collect();
    let nominal_normals: Vec<DVec3> = adaptive_candidates.iter().map(|c| c.surface_normal).collect();

    // Ölçülen noktalar (CMM tezgahından gelen alt-mikron sapmalı koordinatlar: örn. +0.035 mm sapma)
    let measured_points: Vec<DVec3> = nominal_points
        .iter()
        .zip(&nominal_normals)
        .enumerate()
        .map(|(i, (p, n))| {
            let error_mm = if i % 2 == 0 { 0.035 } else { -0.020 };
            *p + *n * error_mm
        })
        .collect();

    // 2.1 Bilateral Simetrik Profil Testi (t = 0.100 mm -> [-0.050, +0.050] mm)
    let eval_bilateral = evaluate_surface_profile(
        &measured_points,
        &nominal_points,
        &nominal_normals,
        ProfileZoneDisposition::BilateralSymmetric,
        0.100,
    )
    .expect("Bilateral profil değerlendirmesi başarılı olmalı");

    assert!(eval_bilateral.is_in_tolerance);
    assert_eq!(eval_bilateral.point_count, adaptive_candidates.len());
    assert!((eval_bilateral.max_deviation - 0.035).abs() < 1e-4);
    assert!((eval_bilateral.min_deviation - (-0.020)).abs() < 1e-4);
    assert!((eval_bilateral.peak_to_valley - 0.055).abs() < 1e-4);

    // 2.2 Unilateral / Unequally Disposed Modifikatör U Testi (0.50 Ⓤ 0.15 mm -> [-0.35, +0.15] mm)
    let eval_unilateral = evaluate_surface_profile(
        &measured_points,
        &nominal_points,
        &nominal_normals,
        ProfileZoneDisposition::UnequallyDisposed {
            total_width: 0.500,
            outward_offset: 0.150,
        },
        0.500,
    )
    .expect("Unilateral profil değerlendirmesi başarılı olmalı");

    assert!(eval_unilateral.is_in_tolerance);
    assert!(eval_unilateral.conformity_margin > 0.10); // Güvenli tolerans payı

    // =========================================================================
    // 3. ASME Y14.5 BİLEŞİK KONUM TOLERANSI (COMPOSITE FCF - PLTZF / FRTZF)
    // =========================================================================
    // 4 delikli flanş bağlantı örüntüsü: Nominal [0,0], [60,0], [60,40], [0,40]
    let nominal_centers = vec![
        (0.0, 0.0),
        (60.0, 0.0),
        (60.0, 40.0),
        (0.0, 40.0),
    ];

    // Ölçülen delik merkezleri:
    // Tüm desen parça datumlarına göre X'te +0.20 mm, Y'de +0.15 mm genel kaçık (PLTZF)
    // Ancak deliklerin birbirine göre mesafeleri alt-mikron kusursuz (FRTZF)
    let measured_centers = vec![
        (0.20, 0.15),
        (60.20, 0.15),
        (60.20, 40.15),
        (0.20, 40.15),
    ];

    // PLTZF (Örüntü Konumu) = Ø0.60 mm
    // Sapma çapı = 2 * sqrt(0.20^2 + 0.15^2) = 2 * 0.25 = Ø0.50 mm <= Ø0.60 mm -> UYGUN
    // FRTZF (Delikler Arası Göreli Konum) = Ø0.10 mm
    // Rijit dönüşüm sonrası kalan iç hata = Ø0.00 mm <= Ø0.10 mm -> UYGUN
    let composite_eval = evaluate_composite_position_2d(
        &measured_centers,
        &nominal_centers,
        0.600,
        0.100,
    )
    .expect("Bileşik konum tolerans değerlendirmesi başarılı olmalı");

    assert!(composite_eval.pltzf_in_tolerance);
    assert!(composite_eval.frtzf_in_tolerance);
    assert!(composite_eval.is_in_tolerance);
    assert!((composite_eval.pltzf_max_deviation_diameter - 0.50).abs() < 1e-3);
    assert!(composite_eval.frtzf_max_deviation_diameter < 1e-4);

    // =========================================================================
    // 4. B-Rep AST UNSURLARI, BİLEŞİK TOLERANS DOĞRULAMASI VE TEFTİŞ PLANI
    // =========================================================================
    let datum_a = GeometricFeature::new_plane(1, "DATUM_A", DVec3::ZERO, DVec3::Z, 10000.0, 20.0).unwrap();
    let datum_b = GeometricFeature::new_plane(2, "DATUM_B", DVec3::ZERO, -DVec3::Y, 5000.0, 20.0).unwrap();
    let datum_c = GeometricFeature::new_plane(3, "DATUM_C", DVec3::ZERO, -DVec3::X, 5000.0, 20.0).unwrap();

    let mut wing_feature = GeometricFeature::new_freeform_surface(
        10,
        "SURF_AERO_WING",
        p_mid,
        norm_mid,
        8500.0,
        6.0,
    )
    .unwrap();
    wing_feature.boundary_polygon = adaptive_candidates.iter().map(|c| c.point_3d).collect();

    let hole_1 = GeometricFeature::new_internal_cylinder(20, "HOLE_1", DVec3::new(0.0, 0.0, -10.0), DVec3::Z, 10.0, 20.0, 500.0, 15.0).unwrap();
    let hole_2 = GeometricFeature::new_internal_cylinder(21, "HOLE_2", DVec3::new(60.0, 0.0, -10.0), DVec3::Z, 10.0, 20.0, 500.0, 15.0).unwrap();
    let hole_3 = GeometricFeature::new_internal_cylinder(22, "HOLE_3", DVec3::new(60.0, 40.0, -10.0), DVec3::Z, 10.0, 20.0, 500.0, 15.0).unwrap();
    let hole_4 = GeometricFeature::new_internal_cylinder(23, "HOLE_4", DVec3::new(0.0, 40.0, -10.0), DVec3::Z, 10.0, 20.0, 500.0, 15.0).unwrap();

    let features = vec![
        datum_a.clone(),
        datum_b.clone(),
        datum_c.clone(),
        wing_feature.clone(),
        hole_1.clone(),
        hole_2.clone(),
        hole_3.clone(),
        hole_4.clone(),
    ];

    // ASME Y14.5 Composite Tolerance Çerçevesi
    let comp_tol = CompositeTolerance::new_composite_position(
        1,
        "COMP_POS_4HOLES",
        vec![20, 21, 22, 23],
        0.600,
        vec![DatumLabel::A, DatumLabel::B, DatumLabel::C],
        0.100,
        vec![DatumLabel::A],
    );
    // Kural denetimi: FRTZF <= PLTZF ve datum alt küme hiyerarşisi
    comp_tol.validate(&features).expect("Composite tolerance validation must pass");

    // Yüzey profili toleransı (Unilateral Ⓤ)
    let prof_tol = ToleranceConstraint {
        id: 10,
        feature_id: 10,
        tolerance_type: ToleranceType::ProfileOfSurface,
        nominal_value: 0.0,
        upper_tolerance: 0.150,
        lower_tolerance: -0.350,
        datum_precedence: vec![DatumLabel::A, DatumLabel::B, DatumLabel::C],
        material_modifier: ortho_ast::MaterialModifier::RFS,
        recommended_fitting: ortho_ast::FittingAlgorithm::GaussLeastSquares,
        is_composite: false,
        profile_disposition: Some(ProfileZoneDisposition::UnequallyDisposed {
            total_width: 0.500,
            outward_offset: 0.150,
        }),
    };

    let drf = DatumReferenceFrame::new_3_2_1("PCS_1", 1, 2, 3);
    let mut plan = InspectionPlan::new("AERO_WING_AS9100_DEMO", "wing.step", drf);
    for f in &features {
        plan.features.push(f.clone());
    }
    plan.tolerances.push(prof_tol);
    plan.composite_tolerances.push(comp_tol);

    // =========================================================================
    // 5. KİNEMATİK ÖRNEKLEME PLANI VE HAREKET ROTASI
    // =========================================================================
    let stack = ProbeStack::default();
    let lut = PH10LookUpTable::default();
    let qualified = vec![
        PH10Angle::new(0.0, 0.0),
        PH10Angle::new(45.0, 0.0),
        PH10Angle::new(90.0, 0.0),
    ];

    let sampling_plan = OrientedSamplingPlan::build(
        "AERO_WING_PART",
        &features,
        &stack,
        &lut,
        &qualified,
    );

    // Serbest form yüzeyi tek bir noktaya değil, çoklu grid temas noktalarına sahip olmalı
    let wing_target = sampling_plan
        .targets
        .iter()
        .find(|t| t.feature_id == 10)
        .expect("Wing target inspection must exist");
    assert!(
        wing_target.contact_points.len() >= 8,
        "Serbest yüzey temas noktası sayısı en az 8 olmalıdır, bulunan: {}",
        wing_target.contact_points.len()
    );

    // =========================================================================
    // 6. DMIS 5.3 VE AS9100 GÖNDERİCİSİ (EMITTER)
    // =========================================================================
    let _machine_profile = CmmMachineProfile::default_hexagon_global_s();
    let clearance_box = ClearanceBox::from_bounding_box(
        DVec3::new(-20.0, -20.0, -20.0),
        DVec3::new(200.0, 200.0, 150.0),
    );
    let stylus = StylusAssembly::default();
    let trajectory = CertifiedCollisionFreeTrajectory::verify_and_certify(
        &[],
        clearance_box,
        vec![],
        &stylus,
    )
    .expect("Trajectory verification must succeed");

    let emitter = DmisEmitter::new();
    let dmis_code = emitter.emit_pcdmis(&plan, &trajectory).expect("DMIS emission failed");

    // DMIS 5.3 çıktı doğrulamaları:
    // 1. FEAT/GSURF,CART serbest yüzey tanımı bulunmalı
    assert!(dmis_code.contains("FEAT/GSURF,CART"), "DMIS must contain FEAT/GSURF,CART");
    // 2. TOL/PROFS, UNILAT serbest yüzey toleransı bulunmalı
    assert!(dmis_code.contains("TOL/PROFS, UNILAT, 0.1500, 0.5000"), "DMIS must contain TOL/PROFS, UNILAT");
    // 3. ASME Y14.5 Composite FCF 1. ve 2. katmanları bulunmalı
    assert!(dmis_code.contains("TOL_PLTZF_1"), "DMIS must contain TOL_PLTZF_1");
    assert!(dmis_code.contains("TOL_FRTZF_1"), "DMIS must contain TOL_FRTZF_1");
    assert!(dmis_code.contains("T(TOL_PLTZF_1) = TOL/POS, 2D, 0.6000, RFS, DAT(A), DAT(B), DAT(C)"));
    assert!(dmis_code.contains("T(TOL_FRTZF_1) = TOL/POS, 2D, 0.1000, RFS, DAT(A)"));
}
