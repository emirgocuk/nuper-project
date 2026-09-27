use glam::DVec3;
use ortho_ast::{
    detect_compound_holes, recommend_adaptive_alignment, AlignmentStrategyType,
    DatumReferenceFrame, GeometricFeature, InspectionPlan, ThreadBypassStrategy,
    ThreadSpecification,
};
use ortho_emitter::DmisEmitter;
use ortho_kinematics::{OrientedSamplingPlan, PH10LookUpTable, ProbeStack};
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, CmmMachineProfile, StylusAssembly};


#[test]
fn test_phase2_complete_stepped_threaded_hal_pipeline() {
    // 1. Kademeli Dişli Delik Oluştur: Fatura (Ø18mm) + Havşa (Ø14mm, 45°) + M8 Vida Dişi (Ø6.8mm matkap deliği)
    let spec_m8 = ThreadSpecification::new_metric_coarse(8.0, 22.0).unwrap();
    assert_eq!(spec_m8.tap_drill_diameter, 6.8);
    assert_eq!(spec_m8.nominal_major_diameter, 8.0);
    assert_eq!(spec_m8.bypass_strategy, ThreadBypassStrategy::BypassAndGaugeSheet);

    // B-Rep seviyesinde unsurlar
    let datum_a = GeometricFeature::new_plane(
        1,
        "TOP_DATUM_A",
        DVec3::new(50.0, 50.0, 50.0),
        DVec3::Z,
        10000.0,
        25.0,
    )
    .unwrap();

    let datum_b = GeometricFeature::new_plane(
        2,
        "FRONT_DATUM_B",
        DVec3::new(50.0, 0.0, 25.0),
        DVec3::new(0.0, -1.0, 0.0),
        5000.0,
        25.0,
    )
    .unwrap();

    let datum_c = GeometricFeature::new_plane(
        3,
        "SIDE_DATUM_C",
        DVec3::new(0.0, 50.0, 25.0),
        DVec3::new(-1.0, 0.0, 0.0),
        2500.0,
        25.0,
    )
    .unwrap();

    let cb_pocket = GeometricFeature::new_internal_cylinder(
        10,
        "CBORE_POCKET",
        DVec3::new(50.0, 50.0, 45.0),
        DVec3::Z,
        18.0,
        10.0,
        500.0,
        20.0,
    )
    .unwrap();

    let csink_cone = GeometricFeature::new_cone(
        11,
        "CSINK_CHAMFER",
        DVec3::new(50.0, 50.0, 39.0),
        DVec3::Z,
        14.0,
        std::f64::consts::FRAC_PI_4,
        2.0,
        100.0,
        20.0,
    )
    .unwrap();

    let main_bore_m8 = GeometricFeature::new_tapped_hole(
        12,
        "THREAD_M8_HOLE",
        DVec3::new(50.0, 50.0, 20.0),
        DVec3::Z,
        spec_m8.clone(),
        600.0,
        20.0,
    )
    .unwrap();

    let features = vec![
        datum_a.clone(),
        datum_b.clone(),
        datum_c.clone(),
        cb_pocket.clone(),
        csink_cone.clone(),
        main_bore_m8.clone(),
    ];

    // 2. Kademeli Delik Dedektörü
    let compounds = detect_compound_holes(&features);
    assert_eq!(compounds.len(), 1);
    let ch = &compounds[0];
    assert!(ch.counterbore.is_some());
    assert_eq!(ch.counterbore.as_ref().unwrap().diameter, 18.0);
    assert!(ch.countersink.is_some());
    assert_eq!(ch.countersink.as_ref().unwrap().entry_diameter, 14.0);

    // 3. Otonom Adaptif Hizalama ve Jacobian Rank Analizi
    let rec = recommend_adaptive_alignment(&features).expect("Adaptive alignment recommendation failed");
    // Modelde iki silindirik delik ve bir düzlem olduğu için Flanş şablonunu otonom seçer
    assert_eq!(rec.strategy, AlignmentStrategyType::PlaneTwoHoles);
    assert!(rec.is_6dof_locked, "6-DoF Jacobian Rank 6 olmalı");
    assert!(rec.stability_score > 0.85);

    // 4. Prob Kinematiği ve Yönlendirilmiş Örnekleme Planı
    let probe_stack = ProbeStack::default();
    let lut = PH10LookUpTable::new();
    let qualified = vec![
        ortho_kinematics::PH10Angle::new(0.0, 0.0),
        ortho_kinematics::PH10Angle::new(90.0, 0.0),
    ];

    let sampling_plan = OrientedSamplingPlan::build_with_compounds(
        "AERO_MANIFOLD",
        &features,
        &compounds,
        &probe_stack,
        &lut,
        &qualified,
    );

    // Fatura ölçülmeli (8 nokta), havşa ölçülmeli (4 nokta), ama M8 helisine GIRILMEMELI (0 nokta)
    assert_eq!(sampling_plan.compound_targets.len(), 1);
    let ct = &sampling_plan.compound_targets[0];
    assert!(ct.is_thread_bypassed);
    assert_eq!(ct.main_bore_inspection.contact_points.len(), 0);
    assert!(ct.counterbore_inspection.is_some());
    assert_eq!(ct.counterbore_inspection.as_ref().unwrap().contact_points.len(), 8);

    // Setup sheet raporuna eklenmiş olmalı
    assert_eq!(sampling_plan.setup_sheet_report.len(), 1);
    let gauge_report = sampling_plan.setup_sheet_report.format_markdown_table();
    assert!(gauge_report.contains("M8x1.25"));
    assert!(gauge_report.contains("ISO 1502 / DIN 13 (6H)"));

    // 5. HAL Makine Profili ve MCR20 Yerel Makro
    let machine_profile = CmmMachineProfile::default_hexagon_global_s();
    let macro_code = machine_profile.dispatch_tool_change_macro(1, None).unwrap();
    assert!(macro_code.contains("LOADPROBE/PH10M_TP20_M2_20MM.prb"));
    assert!(macro_code.contains("TIP/T1A0B0"));

    // 6. Çarpışmasız Hareket Rotalama ve Mühürleme
    let clearance_box = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
    let stylus = StylusAssembly::default();
    let trajectory = CertifiedCollisionFreeTrajectory::verify_and_certify(
        &[],
        clearance_box,
        vec![],
        &stylus,
    )
    .unwrap();

    // 7. Post-Processor ve AS9100 Rev D Kriptografik Çıktı
    let drf = DatumReferenceFrame::new_3_2_1("PCS_1", 1, 2, 3);
    let mut plan = InspectionPlan::new("AERO_MANIFOLD", "manifold.step", drf);
    for f in &features {
        plan.features.push(f.clone());
    }

    let emitter = DmisEmitter::new();
    let dmis_code = emitter.emit_pcdmis(&plan, &trajectory).unwrap();

    assert!(dmis_code.contains("AS9100 REV D / ISO 1502: YAKUT BİLYE KORUMA PROTOKOLU AKTIF"));
    assert!(dmis_code.contains("PROB VIDA HELISINE DALMAYACAKTIR"));
    assert!(dmis_code.contains("OPERATOR KURULUM FOYU: MANUEL DIS MASTAR (GO/NOGO) LISTESI"));
    assert!(dmis_code.contains("METROLOGICAL INTEGRITY & AUDIT TRAIL (AS9100 REV D)"));

    // Setup Sheet oluşturma
    let setup_sheet = emitter.generate_setup_sheet(&plan);
    assert!(setup_sheet.contains("THREAD_M8_HOLE"));
    assert!(setup_sheet.contains("Saha Operatörü Kontrol İmzası"));
}
