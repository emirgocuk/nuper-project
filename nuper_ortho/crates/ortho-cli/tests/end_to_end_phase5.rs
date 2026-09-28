//! # End-to-End Integration Test: FAZ 5
//! 
//! 1. Yerel Sandboxed AI & Deterministik Gardiyan (GBNF JSON Şema, B-Rep Ground-Truth & Halüsinasyon Kilidi)
//! 2. İmalat Niyeti & Tornalanmış Millerde 3-Köşe Loblanma (3-Point Lobing) Tespiti ve 7 Nokta Örnekleme
//! 3. Doğal Dilde Çarpışma Teşhisi ve Kapalı Döngü Kök Neden Analizi (G54 vs Aşınma vs Mengene Yaylanması)
//! 4. Gerçek Atölye Şartları & İleri Saha Güvenliği:
//!    - Döküm Talaş Payı ve Dinamik Arama Zarfı (RawStockCasting)
//!    - Alüminyum Malzeme Sıvanması (Pick-up) & Silikon Nitrür (Si3N4) Reçetesi
//!    - Çok Gövdeli STEP Montaj İzolasyonu (Multi-Body Primary Workpiece & Fastener Noise Filtering)
//!    - Z-First Absolute Traversal Emniyetli Tavan Yaklaşması & Güvenli Park
//! 5. Hibrit Metroloji: Optik Lazer Çizgi Tarayıcı (LaserScanPlanner) Paralel Şerit Üretimi

use glam::DVec3;
use ortho_ai::{
    CollisionDiagnosticReport, DeterministicGuardrail, GuardrailError,
    ManufacturingIntentDetector, ManufacturingMethod, NaturalLanguageDiagnostics,
    RootCauseAnalyzer, RootCauseType,
};
use ortho_ast::{
    DatumReferenceFrame, GeometricFeature, InspectionPlan, SensorType,
    StockAllowanceMode, WorkpieceMaterial,
};
use ortho_brep::multi_body::{MultiBodyFilter, SolidBody};
use ortho_brep::surface::ParametricFace;
use ortho_kinematics::laser::LaserScanPlanner;
use ortho_router::traversal::ZFirstTraversal;

#[test]
fn test_phase5_sandboxed_ai_shop_safety_and_hybrid_metrology_pipeline() {
    println!(">>> FAZ 5 ENTEGRASYON TESTİ BAŞLIYOR...");

    // =========================================================================
    // 1. ADIM 5.1: YEREL SANDBOXED AI & DETERMINİSTİK GARDİYAN DENETİMİ
    // =========================================================================
    let drf = DatumReferenceFrame::new_3_2_1("PCS_BASE", 1, 2, 3);
    let mut plan = InspectionPlan::new("AERO_HYDRAULIC_BODY", "manifold.step", drf);

    let main_bore = GeometricFeature::new_internal_cylinder(
        10,
        "PRESSURE_PORT_A",
        DVec3::new(40.0, 40.0, 50.0),
        DVec3::Z,
        25.0,
        40.0,
        3141.0,
        15.0,
    )
    .unwrap();

    let datum_plane = GeometricFeature::new_plane(
        1,
        "DATUM_A_FACE",
        DVec3::new(0.0, 0.0, 50.0),
        DVec3::Z,
        2500.0,
        15.0,
    )
    .unwrap();

    plan.features = vec![datum_plane, main_bore];

    // 1.1 GBNF Şema ve B-Rep Ground-Truth Doğrulaması
    let ai_proposal_valid_json = r#"{
        "feature_id": 10,
        "feature_type_hint": "InternalCylinder",
        "tolerance_type": "Position",
        "tolerance_value_mm": 0.020,
        "datum_precedence": ["A"],
        "confidence": 0.94
    }"#;

    let parsed_ai = DeterministicGuardrail::parse_and_validate_schema(ai_proposal_valid_json)
        .expect("AI çıktısı geçerli JSON şemasında olmalı");
    let validated_gdt = DeterministicGuardrail::verify_ground_truth(&parsed_ai, &plan)
        .expect("B-Rep geometrik denetiminden başarıyla geçmeli");

    assert_eq!(validated_gdt.feature_id, 10);
    assert!(validated_gdt.auto_approved, "0.94 güven skoru otomatik onay almalı");
    println!("  [OK] Deterministik Gardiyan: GBNF Şema ve B-Rep Ground-Truth Doğrulandı (Onaylı)");

    // 1.2 Halüsinasyon Blokajı: Modelde olmayan unsur (ID: 999)
    let ai_hallucination_json = r#"{
        "feature_id": 999,
        "feature_type_hint": "InternalCylinder",
        "tolerance_type": "Position",
        "tolerance_value_mm": 0.015,
        "datum_precedence": ["A"],
        "confidence": 0.99
    }"#;
    let parsed_h = DeterministicGuardrail::parse_and_validate_schema(ai_hallucination_json).unwrap();
    let res_h = DeterministicGuardrail::verify_ground_truth(&parsed_h, &plan);
    assert!(
        matches!(res_h, Err(GuardrailError::GroundTruthMismatch { .. })),
        "Halüsinasyon içeren unsur derleyiciye ulaşamadan gardiyan tarafından bloke edilmeli"
    );
    println!("  [OK] Gardiyan Koruması: Modelde olmayan hayali delik (ID: 999) başarıyla engellendi!");

    // =========================================================================
    // 2. İMALAT NİYETİ VE 3-KÖŞE LOBLANMA (3-POINT LOBING) TESPİTİ
    // =========================================================================
    let turned_shaft = GeometricFeature::new_external_cylinder(
        20,
        "MOTOR_SHAFT_JOURNAL",
        DVec3::ZERO,
        DVec3::Z,
        28.0,
        150.0,
        13194.0,
        20.0,
    )
    .unwrap();

    let mut shaft_plan = InspectionPlan::new("TURNING_SHAFT", "shaft.step", drf);
    shaft_plan.features.push(turned_shaft.clone());

    let method = ManufacturingIntentDetector::analyze_intent(&shaft_plan);
    assert_eq!(method, ManufacturingMethod::TurnedShaft, "Silindirik gövde tornalanmış şaft olarak tespit edilmeli");

    let lobing_strategy = ManufacturingIntentDetector::evaluate_cylinder_sampling_strategy(&turned_shaft, method);
    assert!(lobing_strategy.has_odd_point_lobing_risk, "Tornalanmış milde 3-köşe loblanma riski tespit edilmeli");
    assert_eq!(lobing_strategy.recommended_points_per_level, 7, "120° harmonikleri için 7 nokta önerilmeli");
    assert_eq!(lobing_strategy.recommended_fitting_algorithm, "Chebyshev Minimum Zone (ISO 1101)");
    println!("  [OK] İmalat Niyeti: Tornalanmış şaft tespit edildi, 3-köşe loblanma için 7-nokta Chebyshev stratejisi atandı");

    // =========================================================================
    // 3. DOĞAL DİLDE ÇARPIŞMA TEŞHİSİ VE KÖK NEDEN ANALİZİ
    // =========================================================================
    let diag_report = NaturalLanguageDiagnostics::explain_collision(
        "PRESSURE_PORT_A",
        DVec3::new(40.0, 40.0, 35.0),
        "PEL1 Prob Uzatması (50mm)",
        "1 Numaralı Çelik Fikstür Pabucu",
        (90.0, 0.0),
    );
    assert!(diag_report.natural_language_explanation.contains("PRESSURE_PORT_A"));
    assert!(diag_report.suggested_remedy.contains("Öneri:"));
    println!("  [OK] Doğal Dilde Teşhis: {}", diag_report.natural_language_explanation);

    // Kök Neden Analizi: Sistematik G54 parça sıfırı kayması testi
    let systematic_shift_devs = vec![
        ("PORT_1", 0.0210),
        ("PORT_2", 0.0215),
        ("PORT_3", 0.0208),
        ("PORT_4", 0.0212),
    ];
    let root_cause = RootCauseAnalyzer::diagnose_deviations(&systematic_shift_devs);
    assert!(matches!(root_cause.verdict, RootCauseType::PartZeroCoordinateShift { .. }));
    assert!(root_cause.action_advice.contains("G54"));
    println!("  [OK] Kök Neden Teşhisi: Sistematik kayma CNC G54 sıfır hatası olarak yakalandı");

    // =========================================================================
    // 4. ADIM 5.2: GERÇEK ATÖLYE ŞARTLARI & İLERİ SAHA GÜVENLİĞİ
    // =========================================================================
    // 4.1 Kaba Döküm / Dövme Talaş Payı (RawStockCasting)
    let casting_mode = StockAllowanceMode::raw_casting_default(3.0); // +3.0 mm kaba döküm payı
    assert!(casting_mode.is_casting());
    if let StockAllowanceMode::RawStockCasting { search_distance_mm, approach_distance_mm, .. } = casting_mode {
        assert!(search_distance_mm >= 10.0, "Dökümde arama mesafesi genişletilmeli");
        assert!(approach_distance_mm >= 12.0, "Dökümde yaklaşma mesafesi genişletilmeli");
    }
    println!("  [OK] Döküm Talaş Payı: Genişletilmiş emniyet yaklaşma ve arama zarfı doğrulandı");

    // 4.2 Alüminyum Malzeme Sıvanması & Si3N4 Prob Reçetesi
    let alu_mat = WorkpieceMaterial::Aluminum7000;
    assert!(alu_mat.ruby_ball_adhesion_risk(), "Alüminyum 7000 serisinde yakut yapışma riski olmalı");
    assert!(alu_mat.recommended_stylus_material().contains("Si3N4"), "Silikon Nitrür önerilmeli");
    println!("  [OK] Malzeme Uyumluluk: Alüminyum için Si3N4 prob ucu tavsiyesi ve sıvanma koruması devrede");

    // 4.3 Çok Gövdeli STEP Montaj Filtreleme (Multi-Body Isolation)
    let main_body = SolidBody::new(1, "VALVE_BLOCK_CASTING", 850000.0, 180.0);
    let bolt_m8 = SolidBody::new(2, "FASTENER_BOLT_M8", 950.0, 25.0);
    let spring = SolidBody::new(3, "HELICOIL_INSERT", 450.0, 12.0);
    let solids = vec![bolt_m8, main_body, spring];

    let (primary_solid, fasteners) = MultiBodyFilter::isolate_primary_workpiece(&solids).unwrap();
    assert_eq!(primary_solid.name, "VALVE_BLOCK_CASTING", "En büyük kütle Primary Workpiece olmalı");
    assert_eq!(fasteners.len(), 2, "Cıvata ve helikoil yay ikincil gövde olarak izole edilmeli");
    println!("  [OK] Çok Gövdeli STEP: Ana gövde izole edildi, cıvata ve bağlantı elemanları filtrelendi");

    // 4.4 Z-First Absolute Traversal & Home/Park El Sıkışması
    let curr_pos = DVec3::new(15.0, 25.0, 40.0);
    let target_entry = DVec3::new(100.0, 120.0, 60.0);
    let z_ceiling = 250.0;

    let traversal = ZFirstTraversal::plan_safe_approach(curr_pos, target_entry, z_ceiling).unwrap();
    assert_eq!(traversal.z_lift_point.z, 250.0, "1. Hareket: Tavana mutlak dikey çekilme");
    assert_eq!(traversal.horizontal_traverse_point, DVec3::new(100.0, 120.0, 250.0), "2. Hareket: Tavanda yatay intikal");
    assert_eq!(traversal.target_point, target_entry, "3. Hareket: Hedefe dikey iniş");
    println!("  [OK] Z-First Traversal: Tavana dik çıkış -> Yatay intikal -> Dikey iniş güvenliği doğrulandı");

    // =========================================================================
    // 5. ADIM 5.3: HİBRİT METROLOJİ (OPTİK LAZER ÇİZGİ TARAMA)
    // =========================================================================
    let laser_sensor = SensorType::OpticalLaserLine {
        stripe_width_mm: 65.0,
        standoff_distance_mm: 90.0,
        point_density_pts_per_mm: 30.0,
    };
    let test_surface = ParametricFace::sample_plane_z50();

    let scan_stripes = LaserScanPlanner::plan_stripes_for_surface(&test_surface, &laser_sensor, 0.20)
        .expect("Lazer tarama şeritleri üretilmeli");

    assert!(!scan_stripes.is_empty(), "En az bir paralel lazer şeridi planlanmalı");
    assert_eq!(scan_stripes[0].stripe_width_mm, 65.0);
    assert_eq!(scan_stripes[0].standoff_distance_mm, 90.0);
    assert!(scan_stripes[0].estimated_points > 100);
    println!("  [OK] Hibrit Metroloji: {} adet paralel optik lazer tarama şeridi başarıyla planlandı", scan_stripes.len());

    println!(">>> FAZ 5 (YEREL SANDBOXED AI, İLERİ SAHA EMNİYETİ & HİBRİT METROLOJİ) %100 BAŞARIYLA TAMAMLANDI!");
}
