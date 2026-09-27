//! # End-to-End Integration Test: FAZ 4
//! 
//! 1. Çoklu Bağlama (Multi-Setup Routing - OP10 / OP20 & 180° Flip)
//! 2. I++ DME v1.7/v2.0 Endüstriyel Ağ Protokolü & CMM Sanal Simülatörü
//! 3. Kapalı Döngü Kalite Geri Bildirimi (Closed-Loop CNC Kompanzasyonu & Takım Kırılma Emniyeti)
//! 4. GUM / ISO 15530-3 Metrolojik Belirsizlik Bütçesi, ISO 14253-1 Guard-Banding & ISO 16610-31 Filtresi

use glam::DVec3;
use ortho_ast::{
    DatumReferenceFrame, GeometricFeature, InspectionPlan, ToleranceConstraint,
};
use ortho_emitter::closed_loop::{ClosedLoopEngine, ClosedLoopError, CncControllerType};
use ortho_kinematics::uncertainty::{ConformanceDecision, RobustOutlierFilter, UncertaintyBudget};
use ortho_router::ipp::{trajectory_to_ipp_stream, IppCmmSimulator, IppProtocol, IppResponse};
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, MotionSegment};

#[test]
fn test_phase4_multi_setup_ipp_closed_loop_and_uncertainty_pipeline() {
    println!(">>> FAZ 4 ENTEGRASYON TESTİ BAŞLIYOR...");

    // =========================================================================
    // 1. ADIM 4.1: ÇOKLU BAĞLAMA (OP10 / OP20) AYRIŞTIRMASI & I++ DME YÜRÜTÜMÜ
    // =========================================================================
    let drf = DatumReferenceFrame::new_3_2_1("PCS_BASE", 1, 2, 3);
    let mut plan = InspectionPlan::new("HYDRAULIC_MANIFOLD_REV_D", "manifold.step", drf);

    // Üst yüzey unsurları (Z-Normal = +Z, OP10'da ölçülebilir)
    let top_plane = GeometricFeature::new_plane(
        1,
        "TOP_SEALING_FACE",
        DVec3::new(50.0, 50.0, 60.0),
        DVec3::Z,
        2500.0,
        10.0,
    )
    .unwrap();

    let top_bore = GeometricFeature::new_internal_cylinder(
        2,
        "PORT_A_CYL",
        DVec3::new(30.0, 30.0, 60.0),
        DVec3::Z,
        20.0,
        30.0,
        1884.0,
        10.0,
    )
    .unwrap();

    // Alt taban unsurları (Z-Normal = -Z, prob üstten erişemez, OP20 gerektirir)
    let bottom_plane = GeometricFeature::new_plane(
        3,
        "BOTTOM_MOUNTING_FACE",
        DVec3::new(50.0, 50.0, 0.0),
        DVec3::NEG_Z,
        2500.0,
        10.0,
    )
    .unwrap();

    let bottom_pocket = GeometricFeature::new_internal_cylinder(
        4,
        "BOTTOM_DRAIN_PORT",
        DVec3::new(30.0, 30.0, 0.0),
        DVec3::NEG_Z,
        16.0,
        15.0,
        754.0,
        10.0,
    )
    .unwrap();

    plan.features = vec![top_plane, top_bore, bottom_plane, bottom_pocket];
    plan.tolerances = vec![
        ToleranceConstraint::new_h7_hole(102, 2, 20.0, 0.021),
        ToleranceConstraint::new_h7_hole(104, 4, 16.0, 0.018),
    ];

    // Çoklu bağlama analizi (Multi-Setup Routing) - Tabla normali +Z kabul edilir
    let multi_setup = plan.split_into_multi_setup(DVec3::Z);
    assert_eq!(multi_setup.op10.features.len(), 2, "OP10 2 üst unsuru içermeli");
    assert!(multi_setup.op20.is_some(), "Alt unsurlar için OP20 oluşturulmalı");

    let op20 = multi_setup.op20.as_ref().unwrap();
    assert_eq!(op20.features.len(), 2, "OP20 2 alt unsuru içermeli");
    assert!(multi_setup.setup_instructions.iter().any(|s| s.contains("180°")), "Operatör yönergeleri parça çevirme içermeli");

    println!("  [OK] Çoklu Bağlama Analizi: OP10 ({} unsur) | OP20 ({} unsur)", multi_setup.op10.features.len(), op20.features.len());

    // 1.2 I++ DME v1.7 / v2.0 Protokol Akışı ve Sanal CMM Simülatörü
    let clearance = ClearanceBox::from_bounding_box(DVec3::new(-10.0, -10.0, -10.0), DVec3::new(100.0, 100.0, 100.0));
    let segments = vec![
        MotionSegment::RapidLinear { target: DVec3::new(30.0, 30.0, 80.0) },
        MotionSegment::TouchApproach { target: DVec3::new(20.0, 30.0, 50.0), normal: DVec3::X },
        MotionSegment::Retract { target: DVec3::new(30.0, 30.0, 80.0) },
        MotionSegment::TouchApproach { target: DVec3::new(40.0, 30.0, 50.0), normal: DVec3::NEG_X },
        MotionSegment::Retract { target: DVec3::new(30.0, 30.0, 80.0) },
    ];
    let op10_trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance, vec![]);

    let ipp_stream = trajectory_to_ipp_stream(&op10_trajectory, "STYLUS_STAR_2MM");
    assert!(!ipp_stream.is_empty(), "I++ DME komut akışı üretilmeli");

    let mut simulator = IppCmmSimulator::new();
    let mut total_touch_reports = 0;

    for line in &ipp_stream {
        let (tag, cmd) = IppProtocol::parse_command(line).expect("Komut geçerli I++ formatında olmalı");
        let responses = simulator.execute_command(tag, &cmd);
        for resp in responses {
            if let IppResponse::Data { payload, .. } = resp {
                if payload.contains("PtMeasReport") {
                    total_touch_reports += 1;
                }
            }
        }
    }

    assert!(!simulator.is_session_active, "Tüm akış sonunda EndSession() ile oturum temiz şekilde kapatılmış olmalı");
    assert!(simulator.is_homed, "Simülatör oturum boyunca homed kalmalı");
    assert_eq!(total_touch_reports, 2, "2 adet dokunma noktası telemetrisi alınmalı");
    println!("  [OK] I++ DME Simülatörü: {} komut işletildi, {} temas raporu alındı ve oturum kapatıldı", ipp_stream.len(), total_touch_reports);

    // =========================================================================
    // 2. ADIM 4.2: KAPALI DÖNGÜ CNC TAKIM KOMPANZASYONU & EMNİYET KİLİDİ
    // =========================================================================
    // Simüle CMM Ölçüm Raporu (CSV Formatında)
    let cmm_csv_report = "\
# NUPER ORTHO CMM INSPECTION REPORT
# FEATURE_NAME, NOMINAL, MEASURED, USL, LSL
PORT_A_CYL, 20.000, 20.012, 20.021, 20.000
BOSS_PIN_10, 10.000, 9.994, 10.000, 9.985
";
    let deviations = ClosedLoopEngine::parse_csv_report(cmm_csv_report).expect("CSV raporu başarıyla ayrıştırılmalı");
    assert_eq!(deviations.len(), 2);
    assert!((deviations[0].deviation - 0.012).abs() < 1e-6);

    // 2.1 Fanuc Kontrol Ünitesi için Aşınma G-Kodu Üretimi
    let mut fanuc_engine = ClosedLoopEngine::new(CncControllerType::Fanuc);
    fanuc_engine.add_tool_mapping("PORT_A_CYL", 1, true, 0.050); // Delik (İç çap), T01, max wear 0.050mm
    fanuc_engine.add_tool_mapping("BOSS_PIN_10", 2, false, 0.050); // Pim (Dış çap), T02, max wear 0.050mm

    let fanuc_gcode = fanuc_engine.generate_compensation_program(&deviations).expect("Fanuc kompanzasyonu üretilmeli");
    assert!(fanuc_gcode.contains("G10 L12 P1 R-0.0060"), "İç çap delik büyüdüğünde takım yarıçapı negatif kompanze edilmeli (-0.0060)");
    assert!(fanuc_gcode.contains("G10 L12 P2 R-0.0030"), "Dış çap pim küçüldüğünde takım yarıçapı negatif kompanze edilmeli (-0.0030)");
    println!("  [OK] Fanuc Kapalı Döngü Aşınma G-Kodu Doğrulandı (G10 L12)");

    // 2.2 Siemens Sinumerik 840D için R-Parametresi Üretimi
    let mut siemens_engine = ClosedLoopEngine::new(CncControllerType::SiemensSinumerik);
    siemens_engine.add_tool_mapping("PORT_A_CYL", 1, true, 0.050);
    siemens_engine.add_tool_mapping("BOSS_PIN_10", 2, false, 0.050);

    let siemens_code = siemens_engine.generate_compensation_program(&deviations).expect("Siemens kompanzasyonu üretilmeli");
    assert!(siemens_code.contains("$TC_DP13[1, 1] = $TC_DP13[1, 1] + (-0.0060)"), "Siemens $TC_DP13 yarıçap aşınması doğru hesaplanmalı");
    println!("  [OK] Siemens Sinumerik Kapalı Döngü Aşınma Kodu Doğrulandı ($TC_DP13)");

    // 2.3 Takım Kırılma Emniyet Kilidi Testi (Fail-Safe)
    let catastrophic_csv = "\
PORT_A_CYL, 20.000, 20.120, 20.021, 20.000
";
    let catastrophic_devs = ClosedLoopEngine::parse_csv_report(catastrophic_csv).unwrap();
    let breakage_result = fanuc_engine.generate_compensation_program(&catastrophic_devs);
    match breakage_result {
        Err(ClosedLoopError::ToolBreakageDetected { tool_number, deviation, threshold }) => {
            assert_eq!(tool_number, 1);
            assert!((deviation - 0.120).abs() < 1e-6);
            assert!((threshold - 0.050).abs() < 1e-6);
            println!("  [OK] Emniyet Kilidi Devrede: Takım T01 sapması (0.120mm > 0.050mm) kırılma olarak yakalandı ve kompanzasyon durduruldu!");
        }
        _ => panic!("Aşırı sapma durumunda ToolBreakageDetected hatası fırlatılmalıydı!"),
    }

    // =========================================================================
    // 3. ADIM 4.3: METROLOJİK BELİRSİZLİK, GUARD-BANDING & SAĞLAM FİLTRELEME
    // =========================================================================
    let budget = UncertaintyBudget::default_cmm_budget(50.0, 100.0);
    let u_combined = budget.calculate_combined();
    let u_expanded = budget.calculate_expanded(2.0); // k=2, %95 güven aralığı
    assert!(u_expanded > u_combined);
    assert!(u_expanded < 0.010, "100mm parça ve 50mm uzatma için genişletilmiş belirsizlik 10 mikron altında olmalı");

    // TUR Doğrulaması (H7 Toleransı = 0.021 mm)
    let (tur, tur_pass) = budget.evaluate_tur(0.021);
    assert!(tur > 0.0);
    println!("  [OK] GUM Belirsizlik Bütçesi: u_c = {:.4} mm | U_95 = {:.4} mm | TUR = {:.2}:1 (Uygunluk: {})",
        u_combined, u_expanded, tur, tur_pass);

    // ISO 14253-1 Guard-Banding Karar Matrisi
    let usl = 20.021;
    let lsl = 20.000;

    // A. Net Kabul (Safe Zone)
    let (dec_pass, _) = budget.evaluate_guard_banding(20.010, usl, lsl);
    assert_eq!(dec_pass, ConformanceDecision::Pass);

    // B. Şüpheli Bölge (Muhafaza bandı içinde, toleransın ucunda)
    let (dec_suspect, msg_suspect) = budget.evaluate_guard_banding(20.0205, usl, lsl);
    assert_eq!(dec_suspect, ConformanceDecision::Suspect);
    assert!(msg_suspect.contains("ŞÜPHELİ"));

    // C. Net Ret (Tolerans dışı)
    let (dec_fail, _) = budget.evaluate_guard_banding(20.028, usl, lsl);
    assert_eq!(dec_fail, ConformanceDecision::Fail);
    println!("  [OK] ISO 14253-1 Guard-Banding Kararları: Pass / Suspect / Fail doğrulandı");

    // ISO 16610-31 Robust Outlier / Çapak Filtreleme (MAD Algoritması)
    let contaminated_deviations = vec![
        0.0021, 0.0023, 0.0019, 0.0020, 0.0022, 0.0025, 0.0018,
        0.0850, // Yüzeyde metal çapak veya toz zerresi
        0.0022, 0.0019, 0.0020,
    ];
    let cleaned_deviations = RobustOutlierFilter::filter_outliers(&contaminated_deviations);
    assert_eq!(cleaned_deviations.len(), 10, "0.0850 mm'lik çapak noktası ayıklanmalı");
    assert!(!cleaned_deviations.iter().any(|&d| d > 0.050), "Temizlenen veri setinde çapak kalmamalı");
    println!("  [OK] ISO 16610-31 Robust Filtreleme: 11 noktadan çapak noktası ayıklandı, 10 temiz nokta korundu");

    println!(">>> FAZ 4 TÜM ALT MODÜLLERİYLE %100 BAŞARIYLA TAMAMLANDI!");
}
