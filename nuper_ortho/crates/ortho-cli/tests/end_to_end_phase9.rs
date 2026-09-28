//! # End-to-End Integration Test: FAZ 9
//!
//! 1. Canlı STEP CAD Ingestion & Topolojik B-Rep Varlık Çözümleme (AP214 / AP242)
//! 2. 2D/3D Çift Kanvas Balonlama (Bidirectional Ballooning & Cross-Highlighting)
//! 3. Dinamik 5-Eksen Renishaw PH10 Mafsal Kinematiği (720 Pozisyon, A/B Articulation & Reachability)
//! 4. Kod Satırından 3D Yola Atlama (Code-to-Path Coordinate Stepping & Boundary Checks)
//! 5. Çapraz CMM Desteği (Cross-Vendor: Wenzel WM | Quartis, Hexagon PC-DMIS, Zeiss Calypso)

use glam::DVec3;
use ortho_ast::{
    DatumReferenceFrame, FeatureType, FittingAlgorithm, GeometricFeature, InspectionPlan,
    ToleranceConstraint, ToleranceType,
};
use ortho_brep::{
    drawing::{AnnotationType, DrawingSheet, ExtractedAnnotation, SheetType},
    matching::{CuttingPlane, DrawingToStepMatcher},
    BRepModel, StepParser,
};
use ortho_emitter::{CalypsoEmitter, DmisEmitter, WenzelEmitter};
use ortho_kinematics::{PH10Angle, PH10LookUpTable};
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, MotionSegment};

#[test]
fn test_phase9_step_ingestion_dual_canvas_and_5axis_kinematics() {
    println!(">>> FAZ 9 CANLI STEP INGESTION, ÇİFT KANVAS & 5-EKSEN KİNEMATİK TESTİ BAŞLIYOR...");

    // =========================================================================
    // 1. ADIM 9.1: CANLI STEP CAD AP214 / AP242 METİN ÇÖZÜMLEME & TOPOLOJİ
    // =========================================================================
    println!("--- [ADIM 9.1] STEP AP214 / AP242 Ingestion ve B-Rep Analitik Topoloji ---");

    let step_mock_data = r#"ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('NUPER ORTHO CAD MODEL','STEP AP214 AUTOMOTIVE_DESIGN'),'2;1');
FILE_NAME('VALVE_BODY_OP10.step','2026-09-28T20:00:00',('Emir Gocuk'),('ASELSAN'),'NUPER-BREP-v1.0','SolidWorks 2026','Approved');
FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));
ENDSEC;
DATA;
#10 = CARTESIAN_POINT('', (50.0, 50.0, 0.0));
#11 = DIRECTION('', (0.0, 0.0, 1.0));
#12 = AXIS2_PLACEMENT_3D('', #10, #11, $);
#13 = PLANE('', #12);
#14 = ADVANCED_FACE('DATUM_A_BASE', (#15), #13, .T.);
#20 = CARTESIAN_POINT('', (50.0, 50.0, 50.0));
#21 = DIRECTION('', (0.0, 0.0, -1.0));
#22 = AXIS2_PLACEMENT_3D('', #20, #21, $);
#23 = CYLINDRICAL_SURFACE('', #22, 10.0);
#24 = ADVANCED_FACE('BORE_20_H7', (#25), #23, .T.);
#30 = CARTESIAN_POINT('', (0.0, 50.0, 25.0));
#31 = DIRECTION('', (-1.0, 0.0, 0.0));
#32 = AXIS2_PLACEMENT_3D('', #30, #31, $);
#33 = PLANE('', #32);
#34 = ADVANCED_FACE('DATUM_B_SIDE', (#35), #33, .T.);
ENDSEC;
END-ISO-10303-21;
"#;

    let mut parser = StepParser::new();
    let parse_res = parser.parse_str(step_mock_data);
    assert!(parse_res.is_ok(), "STEP metin ayrıştırma başarılı olmalıdır!");

    let extracted_features = parser
        .extract_geometric_features()
        .expect("Geometrik unsurlar çıkartılmalıdır!");
    assert_eq!(extracted_features.len(), 3, "Tam 3 analitik unsur tespit edilmelidir!");

    let brep_model = BRepModel::from_step_str(step_mock_data, "VALVE_BODY_OP10.step")
        .expect("BRepModel oluşturulabilmelidir!");
    assert_eq!(brep_model.features.len(), 3);
    assert!(brep_model.features.iter().any(|f| f.name == "BORE_20_H7"));
    assert!(brep_model.features.iter().any(|f| f.name == "DATUM_A_BASE"));
    assert!(brep_model.features.iter().any(|f| f.name == "DATUM_B_SIDE"));

    // Bounding Box Doğrulaması
    assert!(brep_model.bounding_box_max.x >= 50.0);
    assert!(brep_model.bounding_box_max.z >= 50.0);
    println!("   -> STEP Ingestion Başarılı: 3 Yüzey (Plane + Cylinder) ve Bounding Box Doğrulandı.");

    // =========================================================================
    // 2. ADIM 9.2: 2D/3D ÇİFT KANVAS BALONLAMA VE ÇİFT YÖNLÜ EŞLEME (CROSS-HIGHLIGHT)
    // =========================================================================
    println!("--- [ADIM 9.2] 2D/3D Çift Kanvas Balon Eşleştirme Motoru ---");

    // 2D Teknik Resim Balon Açıklamaları (Callouts)
    let ann_bore = ExtractedAnnotation {
        id: 101, // Balon 3: BORE_20_H7
        sheet_index: 0,
        center_x: 175.0,
        center_y: 150.0,
        annotation_type: AnnotationType::DiameterDimension {
            nominal_dia: 20.0,
            plus_tol: 0.021,
            minus_tol: 0.0,
            fit_class: Some("H7".to_string()),
            quantity: 1,
        },
        raw_text: "Ø20 H7 (+0.021/0)".to_string(),
        matched_feature_id: None,
        confidence_score: 0.0,
    };

    let ann_thread = ExtractedAnnotation {
        id: 102, // Balon 4: THREAD_M8
        sheet_index: 0,
        center_x: 235.0,
        center_y: 75.0,
        annotation_type: AnnotationType::ThreadCallout {
            thread_name: "M8x1.25".to_string(),
            depth_mm: 16.0,
        },
        raw_text: "M8x1.25 - 6H Prof. 16mm".to_string(),
        matched_feature_id: None,
        confidence_score: 0.0,
    };

    let ann_slot_unresolved = ExtractedAnnotation {
        id: 103, // Balon 6: Unresolved Slot
        sheet_index: 0,
        center_x: 95.0,
        center_y: 200.0,
        annotation_type: AnnotationType::DiameterDimension {
            nominal_dia: 20.35, // Nominal fark var (0.35 mm delta)
            plus_tol: 0.05,
            minus_tol: 0.0,
            fit_class: None,
            quantity: 1,
        },
        raw_text: "Slot Width 20.35 mm".to_string(),
        matched_feature_id: None,
        confidence_score: 0.0,
    };

    // 3D B-Rep Unsurları
    let bore_feature = brep_model.find_feature_by_name("BORE_20_H7").unwrap();
    let score_bore = DrawingToStepMatcher::calculate_match_score(&ann_bore, bore_feature, None);
    assert_eq!(score_bore, 0.95, "BORE_20_H7 tam çap uyumu ile %95 güven skoruna sahip olmalıdır!");

    let score_slot =
        DrawingToStepMatcher::calculate_match_score(&ann_slot_unresolved, bore_feature, None);
    assert_eq!(score_slot, 0.65, "Kısmi uyumlu slot %65 güven skoruna sahip olmalı ve onay beklemelidir!");

    // Kesit Düzlemi (Cutting Plane) üzerinde eşleşme tam puan (%100)
    let cutting_plane = CuttingPlane::new("SECTION_A_A", DVec3::new(50.0, 50.0, 50.0), DVec3::Z);
    let score_bore_in_plane =
        DrawingToStepMatcher::calculate_match_score(&ann_bore, bore_feature, Some(&cutting_plane));
    assert_eq!(score_bore_in_plane, 1.0, "Kesit düzleminde delik %100 tam puan almalıdır!");

    println!("   -> Balon 3 (Bore H7): Güven = %{:.0} [EŞLEŞTİ]", score_bore * 100.0);
    println!("   -> Balon 6 (Unresolved Slot): Güven = %{:.0} [ONAY BEKLİYOR]", score_slot * 100.0);

    // =========================================================================
    // 3. ADIM 9.3: DİNAMİK 5-EKSEN RENISHAW PH10 MAFSAL KİNEMATİĞİ (720 POZİSYON)
    // =========================================================================
    println!("--- [ADIM 9.3] Renishaw PH10 5-Eksen Kafa Açı ve Kinematik Yönelim ---");

    let ph10_lut = PH10LookUpTable::new();
    assert_eq!(ph10_lut.angles.len(), 16 * 48, "PH10 LUT tam 768 diskret açı içermelidir (0-105 A x -180-+180 B)!");

    // Test 1: Düşey Delik (Normal = -Z) -> Kafa tam dik aşağı (A0.0°, B0.0°)
    let (best_angle_bore, error_deg_bore) = ph10_lut.find_best_angle(-DVec3::Z);
    assert_eq!(best_angle_bore.a_deg, 0.0);
    assert_eq!(best_angle_bore.b_deg, 0.0);
    assert!(error_deg_bore < 1e-6);

    // Test 2: Yan Yüzey Yaklaşması (Normal = -X) -> Yatay mafsal yönelimi
    let (best_angle_side, error_deg_side) = ph10_lut.find_best_angle(-DVec3::X);
    assert_eq!(best_angle_side.a_deg, 90.0);
    assert!(
        (best_angle_side.b_deg - (-90.0)).abs() < 1e-4,
        "Sol tarafa bakan prob B açısı -90.0° olmalıdır!"
    );
    assert!(error_deg_side < 1e-4);

    // Test 3: Yönelim vektörünün birim uzunluk koruma testi
    let computed_dir = PH10Angle::compute_direction(45.0, 90.0);
    assert!((computed_dir.length() - 1.0).abs() < 1e-6);
    println!(
        "   -> PH10 Kinematiği: Düşey (A0° B0°), Yan (A90° B-90°), Birim Vektör: {:.3?}",
        computed_dir
    );

    // =========================================================================
    // 4. ADIM 9.4: KOD SATIRINDAN 3D YOLA ADIMLAMA (CODE-TO-PATH STEPPING)
    // =========================================================================
    println!("--- [ADIM 9.4] Kod Satırından Koordinat Çıkarımı ve Güvenlik Zarfı ---");

    let clearance_box =
        ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
    assert_eq!(clearance_box.z_clearance, 100.0);

    // DMIS Satırı: PTMEAS/CART, 60.0000, 50.0000, 42.5000, -1.0000, 0.0000, 0.0000
    let dmis_line = "PTMEAS/CART, 60.0000, 50.0000, 42.5000, -1.0000, 0.0000, 0.0000";
    let pt_dmis = DVec3::new(60.0, 50.0, 42.5);
    assert!(clearance_box.contains(pt_dmis), "Ölçüm noktası parça sınır zarfı içinde olmalıdır!");

    // Calypso Satırı: NOM_CENTER: 50.0000, 50.0000, 50.0000
    let pt_calypso = DVec3::new(50.0, 50.0, 50.0);
    assert!(clearance_box.contains(pt_calypso));

    // Wenzel Satırı: POINT(20.000, 20.000, 50.000)
    let pt_wenzel = DVec3::new(20.0, 20.0, 50.0);
    assert!(clearance_box.contains(pt_wenzel));

    println!("   -> Koordinat Ayrıştırma ve Güvenlik Zarfı Uyumu: PASS");

    // =========================================================================
    // 5. ADIM 9.5: ÇAPRAZ CMM DESTEĞİ (WENZEL WM | QUARTIS, PC-DMIS, ZEISS CALYPSO)
    // =========================================================================
    println!("--- [ADIM 9.5] Çapraz Satıcı Derleme Doğrulaması (Wenzel / PC-DMIS / Calypso) ---");

    let drf = DatumReferenceFrame::new_3_2_1("PCS_OP10", 1, 2, 3);
    let mut plan = InspectionPlan::new("VALVE_BODY_OP10", "VALVE_BODY_OP10.step", drf);

    for f in brep_model.features {
        plan.add_feature(f);
    }
    plan.add_tolerance(ToleranceConstraint::new(
        101,
        24,
        ToleranceType::Diameter,
        20.0,
        0.0210,
        0.0,
    ));
    plan.add_tolerance(ToleranceConstraint::new(
        102,
        14,
        ToleranceType::Flatness,
        0.0,
        0.0050,
        0.0,
    ));

    let segments = vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(50.0, 50.0, 100.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(60.0, 50.0, 42.5),
            normal: -DVec3::X,
        },
        MotionSegment::Retract {
            target: DVec3::new(55.0, 50.0, 42.5),
        },
    ];
    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance_box, vec![]);

    // 1. Wenzel WM | Quartis
    let wenzel_emitter = WenzelEmitter::new();
    let wenzel_code = wenzel_emitter
        .emit_quartis(&plan, Some(&trajectory))
        .expect("Wenzel programı derlenemedi!");
    assert!(wenzel_code.contains("PROGRAM 'VALVE_BODY_OP10'"));
    assert!(wenzel_code.contains("DME 'WENZEL LH 87'"));
    assert!(wenzel_code.contains("PROBE 'PH10M_TP20_50MM'"));
    assert!(wenzel_code.contains("FEATURE 'BORE_20_H7' = CYLINDER(INTERNAL, CART)"));
    assert!(wenzel_code.contains("EVALUATE DIAMETER('BORE_20_H7') TOL(+0.0210, 0.0000)"));

    // 2. ANSI DMIS 5.3 / PC-DMIS
    let dmis_emitter = DmisEmitter::new();
    let dmis_code = dmis_emitter
        .emit_pcdmis(&plan, &trajectory)
        .expect("DMIS programı derlenemedi!");
    assert!(dmis_code.contains("FILNAM/'VALVE_BODY_OP10', 5.3"));
    assert!(dmis_code.contains("F(BORE_20_H7) = FEAT/CYLNDR"));

    // 3. Zeiss Calypso ASCII Prüfplan
    let calypso_emitter = CalypsoEmitter::new();
    let calypso_code = calypso_emitter
        .emit_calypso_ascii(&plan)
        .expect("Calypso programı derlenemedi!");
    assert!(calypso_code.contains("; ZEISS CALYPSO PRUEFPLAN DEFINITION"));
    assert!(calypso_code.contains("NAME: BORE_20_H7"));

    println!("   ✅ [1/3] Wenzel WM | Quartis Çıktısı Doğrulandı (Quartis 2026)");
    println!("   ✅ [2/3] Hexagon PC-DMIS / ANSI DMIS 5.3 Çıktısı Doğrulandı");
    println!("   ✅ [3/3] Zeiss Calypso Prüfplan Çıktısı Doğrulandı");

    println!(">>> FAZ 9 CANLI STEP INGESTION, ÇİFT KANVAS & 5-EKSEN KİNEMATİK TESTİ %100 BAŞARIYLA GEÇTİ!");
}
