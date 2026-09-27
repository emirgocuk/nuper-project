//! # End-to-End Integration Test: FAZ 3 Adım 3.3 & Adım 3.4
//! 
//! 1. Tauri 2.0 + Three.js Masaüstü Mimarisi (Solid Slate Light)
//! 2. Zero-Copy Binary IPC (BinaryTrajectoryPacket & BinaryMeshPacket)
//! 3. 2D Teknik Resim Balonlama & Çift Kanvas Eşleme (Dual Canvas Matching)
//! 4. Kapsamlı CMM Operatör Kurulum Föyü (Inspection Setup Sheet - Markdown & HTML A4)

use glam::DVec3;
use ortho_ast::{
    DatumReferenceFrame, GeometricFeature, InspectionPlan, ThreadSpecification, ToleranceConstraint,
};
use ortho_brep::{
    drawing::DrawingSheet,
    matching::DrawingToStepMatcher,
};
use ortho_emitter::DmisEmitter;
use ortho_router::{
    BinaryMeshPacket, BinaryTrajectoryPacket, CertifiedCollisionFreeTrajectory, ClearanceBox,
    KeepOutZone, MotionSegment,
};

#[test]
fn test_phase3_ui_zero_copy_ipc_and_setup_sheet_pipeline() {
    // =========================================================================
    // 1. TEFTİŞ PLANI VE CAD UNSURLARI OLUŞTURMA
    // =========================================================================
    let drf = DatumReferenceFrame::new_3_2_1("PCS_VALVE_321", 1, 2, 3);
    let mut plan = InspectionPlan::new("VALVE_BODY_OP10", "valve_block.step", drf);

    // 1.1 Primer Datum A (Üst Yüzey Z=50)
    let datum_a = GeometricFeature::new_plane(
        1,
        "DATUM_A_TOP",
        DVec3::new(50.0, 50.0, 50.0),
        DVec3::Z,
        10000.0,
        5.0,
    )
    .unwrap();
    plan.features.push(datum_a);

    // 1.2 Sekonder Datum B (Ön Yüzey Y=0)
    let datum_b = GeometricFeature::new_plane(
        2,
        "DATUM_B_FRONT",
        DVec3::new(50.0, 0.0, 25.0),
        -DVec3::Y,
        5000.0,
        5.0,
    )
    .unwrap();
    plan.features.push(datum_b);

    // 1.3 Tersiyer Datum C (Sol Yüzey X=0)
    let datum_c = GeometricFeature::new_plane(
        3,
        "DATUM_C_LEFT",
        DVec3::new(0.0, 50.0, 25.0),
        -DVec3::X,
        5000.0,
        5.0,
    )
    .unwrap();
    plan.features.push(datum_c);

    // 1.4 H7 Kritik Delik (Ø20 H7)
    let bore_h7 = GeometricFeature::new_internal_cylinder(
        4,
        "BORE_20_H7",
        DVec3::new(50.0, 50.0, 50.0),
        -DVec3::Z,
        20.0,
        30.0,
        1884.95,
        5.0,
    )
    .unwrap();
    plan.features.push(bore_h7);
    plan.tolerances
        .push(ToleranceConstraint::new_h7_hole(101, 4, 20.0, 0.021));

    // 1.5 M8 Vida Dişli Delik (Prob Baypas - Manuel Mastar)
    let thread_spec = ThreadSpecification::new_metric_coarse(8.0, 16.0).unwrap();
    let thread_feat = GeometricFeature::new_tapped_hole(
        5,
        "THREAD_M8_BOLT",
        DVec3::new(80.0, 20.0, 50.0),
        -DVec3::Z,
        thread_spec,
        500.0,
        16.0,
    )
    .unwrap();
    plan.features.push(thread_feat);

    // =========================================================================
    // 2. SERTİFİKALI HAREKET ROTASI VE FİKSTÜR PABUÇLARI (COLLISION-FREE)
    // =========================================================================
    let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
    let clamp = KeepOutZone::new(
        "FIXTURE_CLAMP_OP10",
        DVec3::new(-15.0, 5.0, 0.0),
        DVec3::new(5.0, 45.0, 35.0),
    );

    let segments = vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(0.0, 0.0, 100.0),
        },
        MotionSegment::RotateHead {
            a_deg: 0.0,
            b_deg: 0.0,
        },
        MotionSegment::RapidLinear {
            target: DVec3::new(20.0, 20.0, 100.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(20.0, 20.0, 50.0),
            normal: DVec3::Z,
        },
        MotionSegment::Retract {
            target: DVec3::new(20.0, 20.0, 55.0),
        },
        MotionSegment::RapidLinear {
            target: DVec3::new(50.0, 50.0, 100.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(60.0, 50.0, 35.0),
            normal: -DVec3::X,
        },
        MotionSegment::Retract {
            target: DVec3::new(50.0, 50.0, 35.0),
        },
        MotionSegment::RotateHead {
            a_deg: 45.0,
            b_deg: 90.0,
        },
        MotionSegment::RapidLinear {
            target: DVec3::new(0.0, 0.0, 100.0),
        },
    ];

    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance, vec![clamp]);

    // =========================================================================
    // 3. ZERO-COPY BINARY IPC KATMANI DOĞRULAMASI (Doc 08 & Doc 16)
    // =========================================================================
    // 3.1 Binary Trajectory Packet
    let traj_packet = BinaryTrajectoryPacket::from_certified_trajectory(&trajectory);
    assert_eq!(traj_packet.segment_count, 10);
    assert_eq!(traj_packet.waypoints.len(), 10 * 4); // [X, Y, Z, TypeCode]
    assert!(traj_packet.total_distance_mm > 0.0);
    assert!(traj_packet.estimated_duration_sec > 0.0);
    assert_eq!(traj_packet.sha256_seal.len(), 64); // SHA-256 Hex

    let traj_raw_bytes = traj_packet.to_raw_bytes();
    assert_eq!(traj_raw_bytes.len(), 40 * 4); // 160 bayt bellek haritası (Float32Array)

    // 3.2 Binary Mesh Packet (CAD Üçgenleme ve B-Rep Streaming)
    let mesh_packet = BinaryMeshPacket::new_box(
        DVec3::new(0.0, 0.0, 0.0),
        DVec3::new(100.0, 100.0, 50.0),
        1, // Feature ID #1
    );
    assert_eq!(mesh_packet.triangle_count(), 12);
    assert_eq!(mesh_packet.vertices.len(), 12 * 3 * 3); // 108 floats
    assert_eq!(mesh_packet.normals.len(), 108);
    assert_eq!(mesh_packet.triangle_feature_ids.len(), 12);

    let mesh_v_bytes = mesh_packet.to_vertex_bytes();
    assert_eq!(mesh_v_bytes.len(), 108 * 4); // 432 bayt
    let mesh_n_bytes = mesh_packet.to_normal_bytes();
    assert_eq!(mesh_n_bytes.len(), 108 * 4);

    // =========================================================================
    // 4. 2D TEKNİK RESİM BALONLAMA VE ÇİFT KANVAS EŞLEME
    // =========================================================================
    let mut sheet = DrawingSheet::new_overview(1, 420.0, 297.0);

    // Balon 3: BORE_20_H7
    let ann3 = ortho_brep::drawing::ExtractedAnnotation {
        id: 3,
        sheet_number: 1,
        raw_text: "Ø20 H7".to_string(),
        bbox: ortho_brep::drawing::BoundingBox2D::new(0.4, 0.4, 0.6, 0.6),
        annotation_type: ortho_brep::drawing::AnnotationType::DiameterDimension {
            nominal_dia: 20.0,
            tolerance_band: 0.021,
            quantity: 1,
        },
        tolerance: None,
        composite_tolerance: None,
        confidence: 0.95,
    };
    sheet.annotations.push(ann3);

    // Balon 4: THREAD_M8
    let ann4 = ortho_brep::drawing::ExtractedAnnotation {
        id: 4,
        sheet_number: 1,
        raw_text: "M8x1.25".to_string(),
        bbox: ortho_brep::drawing::BoundingBox2D::new(0.7, 0.2, 0.8, 0.3),
        annotation_type: ortho_brep::drawing::AnnotationType::ThreadCallout {
            thread_name: "M8x1.25".to_string(),
            depth_mm: 16.0,
        },
        tolerance: None,
        composite_tolerance: None,
        confidence: 0.90,
    };
    sheet.annotations.push(ann4);

    let mut sheets = vec![sheet];
    let matches = DrawingToStepMatcher::match_sheets_to_features(&mut sheets, &plan.features, &[]);
    assert_eq!(matches.len(), 2);
    assert_eq!(matches[0].feature_id, 4); // BORE_20_H7
    assert_eq!(matches[1].feature_id, 5); // THREAD_M8_BOLT
    assert!(matches[0].confidence_score >= 0.80);
    assert!(matches[1].confidence_score >= 0.80);

    // =========================================================================
    // 5. CMM OPERATÖR KURULUM FÖYÜ (SETUP SHEET) DOĞRULAMASI (Doc 11 & Doc 17)
    // =========================================================================
    let emitter = DmisEmitter::new();

    // 5.1 Kapsamlı Markdown Kurulum Föyü
    let setup_md = emitter.generate_setup_sheet_with_trajectory(&plan, Some(&trajectory));
    assert!(setup_md.contains("# 📋 NUPER ORTHO — CMM OPERATÖR KURULUM FÖYÜ"));
    assert!(setup_md.contains("VALVE_BODY_OP10"));
    assert!(setup_md.contains("Çarpışmasız Rota Mührü (SHA-256)"));
    assert!(setup_md.contains("1. 🗜️ Parça Yerleşimi ve Pabuç / Fikstür Konfigürasyonu"));
    assert!(setup_md.contains("FIXTURE_CLAMP_OP10"));
    assert!(setup_md.contains("+40 mm Lift-Hop"));
    assert!(setup_md.contains("2. 🎯 Prob ve Kinematik Kafa Montaj Reçetesi"));
    assert!(setup_md.contains("Renishaw PH10M"));
    assert!(setup_md.contains("TP20 Standart Force"));
    assert!(setup_md.contains("PEL1"));
    assert!(setup_md.contains("A0.0° B0.0°"));
    assert!(setup_md.contains("A45.0° B90.0°"));
    assert!(setup_md.contains("3. 📐 Manuel Ön-Hizalama Adımları (MODE/MAN - Kaba Sıfır Alma)"));
    assert!(setup_md.contains("Primer Düzlem (Datum A - 3 Dokunuş)"));
    assert!(setup_md.contains("Sekonder Doğru (Datum B - 2 Dokunuş)"));
    assert!(setup_md.contains("Tersiyer Nokta (Datum C - 1 Dokunuş)"));
    assert!(setup_md.contains("4. 🔩 Prob Baypas Unsur Tablosu (Manuel Mastar Denetimi)"));
    assert!(setup_md.contains("THREAD_M8_BOLT"));
    assert!(setup_md.contains("ISO 1502 / DIN 13 (6H)"));
    assert!(setup_md.contains("Saha Operatörü Kontrol İmzası"));

    // 5.2 Endüstriyel Baskıya Hazır A4 HTML Kurulum Föyü
    let setup_html = emitter.generate_setup_sheet_html(&plan, Some(&trajectory));
    assert!(setup_html.contains("<!DOCTYPE html>"));
    assert!(setup_html.contains("<title>Nuper Ortho — Kurulum Föyü (Setup Sheet)</title>"));
    assert!(setup_html.contains("@page { size: A4; margin: 12mm; }"));
    assert!(setup_html.contains("@media print"));
    assert!(setup_html.contains("VALVE_BODY_OP10"));
    assert!(setup_html.contains("Renishaw PH10M"));
    assert!(setup_html.contains("THREAD_M8_BOLT"));
    assert!(setup_html.contains("M8x1.25"));
    assert!(setup_html.contains("badge-pass"));
    assert!(setup_html.contains("Operatör Sicil / İmza"));
}
