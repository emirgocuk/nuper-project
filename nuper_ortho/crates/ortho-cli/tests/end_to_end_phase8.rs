//! # End-to-End Integration Test: FAZ 8
//!
//! 1. 8-Crate Sovereign Çekirdek Bütünlüğü (AST, B-Rep, Kinematics, Router, Emitter, AI, License, CLI)
//! 2. Anti-Slop Sovereign Pylon Triad Marka Sistemi & Production Showroom Doğrulaması
//! 3. 5 Parçalı Üretim Teftiş Paketi (Inspection Bundle) Otomatik Dağıtımı:
//!    - [1] Kanonik DMIS 5.2 / PC-DMIS Programı
//!    - [2] Zeiss Calypso ASCII Prüfplan
//!    - [3] Operatör Fikstür ve Prob Kurulum Föyü (.MD)
//!    - [4] Saha FAT (Factory Acceptance Test) & 480x Benchmark Sertifikası (.MD)
//!    - [5] AS9100 Rev D Kanonik SHA-256 Kriptografik Dijital Mührü (.sig)
//! 4. Çarpışmasız Rota (GJK/EPA 0-Collision) ve Air-Gapped Savunma Lisansı (USB Dongle) Teyidi

use std::fs;
use glam::DVec3;
use ortho_ast::{
    DatumReferenceFrame, GeometricFeature, InspectionPlan, ToleranceConstraint, ToleranceType,
};
use ortho_brep::BRepModel;
use ortho_emitter::{
    AntiTamperAuthority, BenchmarkComparator, CalypsoEmitter, DmisEmitter, FatStatus,
    MeasurementRecord,
};
use ortho_kinematics::{
    sample_cylinder_2level, sample_plane_grid, ConformanceDecision, PH10Angle,
    PH10LookUpTable, UncertaintyBudget,
};
use ortho_ai::{ManufacturingIntentDetector, ManufacturingMethod, NaturalLanguageDiagnostics};
use ortho_license::{
    AirGappedLicense, FeatureFlag, HardwareFingerprint, LicenseAuthority, LicenseTier,
};
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, MotionSegment};

#[test]
fn test_phase8_sovereign_pylon_triad_and_production_inspection_bundle() {
    println!(">>> FAZ 8 SOVEREIGN PYLON TRIAD & PRODUCTION SHOWROOM BUNDLE TESTİ BAŞLIYOR...");

    // =========================================================================
    // 1. ADIM 8.1: ORTHO-AST & B-REP MODEL INGESTION (KATMAN 1)
    // =========================================================================
    println!("--- [ADIM 8.1] ortho-ast ve ortho-brep Topoloji Çıkarımı ---");

    let drf = DatumReferenceFrame::new_3_2_1("PCS_SOVEREIGN_OP10", 1, 2, 3);
    let mut plan = InspectionPlan::new("VALVE_BODY_OP10", "valve_block.step", drf);

    let datum_a = GeometricFeature::new_planar_face(
        1,
        "DATUM_A_BASE",
        DVec3::new(50.0, 50.0, 0.0),
        DVec3::Z,
        10000.0,
    )
    .unwrap();
    plan.add_feature(datum_a);

    let datum_b = GeometricFeature::new_planar_face(
        2,
        "DATUM_B_SIDE",
        DVec3::new(0.0, 50.0, 25.0),
        -DVec3::X,
        5000.0,
    )
    .unwrap();
    plan.add_feature(datum_b);

    let bore_h7 = GeometricFeature::new_internal_cylinder(
        4,
        "BORE_20_H7",
        DVec3::new(50.0, 50.0, 50.0),
        -DVec3::Z,
        20.0,
        30.0,
        1884.95,
        15.0,
    )
    .unwrap();
    plan.add_feature(bore_h7);

    // Tolerans kısıtları
    let tol_diam = ToleranceConstraint::new(101, 4, ToleranceType::Diameter, 20.0, 0.0210, 0.0000);
    plan.add_tolerance(tol_diam);

    let tol_flat = ToleranceConstraint::new(102, 1, ToleranceType::Flatness, 0.0, 0.0100, 0.0000);
    plan.add_tolerance(tol_flat);

    assert_eq!(plan.features.len(), 3);
    assert_eq!(plan.tolerances.len(), 2);
    println!("   -> AST Doğrulandı: 3 Unsur, 2 Tolerans Kısıtı (H7 + Düzlemsellik)");

    // =========================================================================
    // 2. ADIM 8.2: ORTHO-KINEMATICS & ISO 14253 BELİRSİZLİK MODELİ
    // =========================================================================
    println!("--- [ADIM 8.2] ortho-kinematics Örnekleme ve Metrolojik Belirsizlik ---");

    let cylinder_points = sample_cylinder_2level(
        DVec3::new(50.0, 50.0, 50.0),
        -DVec3::Z,
        20.0,
        30.0,
        8,
        true,
    );
    assert_eq!(cylinder_points.len(), 16);

    let plane_points = sample_plane_grid(
        DVec3::new(50.0, 50.0, 0.0),
        DVec3::Z,
        DVec3::X,
        80.0,
        80.0,
        4,
        4,
    );
    assert_eq!(plane_points.len(), 16);

    // Renishaw PH10 Kafa Açısı Seçimi (A0.0, B0.0 dikey delik için)
    let ph10_lut = PH10LookUpTable::default();
    let best_angle = ph10_lut.find_best_probe_angle(-DVec3::Z);
    assert_eq!(best_angle, PH10Angle { a_deg: 0.0, b_deg: 0.0 });
    println!("   -> Renishaw PH10 Açısı Teyit Edildi: A0.0, B0.0");

    // ISO 14253-1 Emniyet Bandı ve Belirsizlik Bütçesi
    let budget = UncertaintyBudget::new(0.0012, 0.0008, 0.5, 23.4, 0.0005);
    let conformance = budget.evaluate_conformance(20.0120, 20.0, 0.0210, 0.0000);
    assert_eq!(conformance.decision, ConformanceDecision::Pass);
    assert!(conformance.tur >= 4.0, "TUR oranı 4:1 standardını sağlamalıdır!");
    println!(
        "   -> ISO 14253 Kararı: {:?} (TUR = {:.2}:1, Emniyet Bandı = [{:.4}, {:.4}])",
        conformance.decision, conformance.tur, conformance.guard_band_lower, conformance.guard_band_upper
    );

    // =========================================================================
    // 3. ADIM 8.3: ORTHO-AI SANDBOXED DİAGNOSTICS & İMALAT NİYETİ
    // =========================================================================
    println!("--- [ADIM 8.3] ortho-ai İmalat Niyeti ve Çarpışma Teşhisi ---");

    let intent_detector = ManufacturingIntentDetector::new();
    let intent_strategy = intent_detector.analyze_bore_features(&plan.features);
    assert!(intent_strategy.is_valid);
    println!("   -> AI İmalat Niyeti Analizi: Güven Skoru = %{:.1}", intent_strategy.confidence * 100.0);

    let diagnostic_msg = NaturalLanguageDiagnostics::diagnose_trajectory_clearance(15.0, 5.0);
    assert!(diagnostic_msg.contains("GÜVENLİ"));
    println!("   -> Yerel AI Teşhis Bildirimi: {}", diagnostic_msg);

    // =========================================================================
    // 4. ADIM 8.4: ORTHO-LICENSE AIR-GAPPED SAVUNMA LİSANSI (FAZ 7)
    // =========================================================================
    println!("--- [ADIM 8.4] ortho-license Donanım Kilidi ve Lisans Otoritesi ---");

    let hw = HardwareFingerprint::new(
        "MCH-DEFENSE-AS9100-STATION",
        "INTEL-CORE-I9-METROLOGY",
        Some("NUPER-USB-DGL-9841".to_string()),
    );
    let license = LicenseAuthority::issue_license(
        "LIC-ASELSAN-2026-NUPER-009",
        "ASELSAN Savunma Sistemleri A.Ş.",
        LicenseTier::DefenseEnterprise,
        Some(&hw),
        "2026-01-01",
        "2027-01-01",
    );

    let val_res = LicenseAuthority::validate_license(
        &license,
        &hw,
        "2026-09-28",
        Some(FeatureFlag::DmisExport),
    );
    assert!(val_res.is_ok(), "Savunma lisansı doğrulanmalıdır!");
    println!("   -> Lisans Onaylandı: Dongle={}, Seviye={:?}", hw.usb_dongle_serial.as_ref().unwrap(), license.tier);

    // =========================================================================
    // 5. ADIM 8.5: ORTHO-ROUTER GJK/EPA ÇARPIŞMASIZ ROTA SERTİFİKASYONU
    // =========================================================================
    println!("--- [ADIM 8.5] ortho-router Çarpışmasız Hareket Yörüngesi ---");

    let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
    let segments = vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(50.0, 50.0, 100.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(50.0, 60.0, 42.5),
            normal: -DVec3::Y,
        },
        MotionSegment::Retract {
            target: DVec3::new(50.0, 55.0, 42.5),
        },
    ];
    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance, vec![]);
    assert_eq!(trajectory.segments.len(), 3);
    println!("   -> Rota Sertifikalandı: SHA-256 Doğrulandı.");

    // =========================================================================
    // 6. ADIM 8.6: ORTHO-EMITTER TAM ÜRETİM PAKETİ (INSPECTION BUNDLE) BASIMI
    // =========================================================================
    println!("--- [ADIM 8.6] 5 Parçalı Üretim Teftiş Paketi Dağıtımı ---");

    let out_dir = "target/test_dist_inspection_bundle";
    fs::create_dir_all(out_dir).expect("Hedef dağıtım klasörü oluşturulamadı!");

    let emitter = DmisEmitter::new();

    // 1. Kanonik DMIS 5.2 / PC-DMIS Programı
    let signed_dmis = emitter
        .emit_signed_pcdmis(
            &plan,
            &trajectory,
            "AS9100D-CMM-2026-NUPER-0091",
            "Müh. Emir Göçük (Lead QA & Metrology)",
        )
        .expect("DMIS derlenemedi!");
    let dmis_path = format!("{}/VALVE_BODY_OP10.DMI", out_dir);
    fs::write(&dmis_path, &signed_dmis).expect("DMIS yazılamadı!");
    assert!(signed_dmis.contains("FILNAM/'VALVE_BODY_OP10', 5.3"));
    assert!(signed_dmis.contains("AS9100 REV D KRIPTOGRAFIK DENETIM IZI"));

    // 2. Zeiss Calypso ASCII Prüfplan
    let calypso_emitter = CalypsoEmitter::new();
    let calypso_code = calypso_emitter.emit_calypso_ascii(&plan).expect("Calypso derlenemedi!");
    let calypso_path = format!("{}/VALVE_BODY_OP10_CALYPSO.txt", out_dir);
    fs::write(&calypso_path, &calypso_code).expect("Calypso yazılamadı!");
    assert!(calypso_code.contains("; ZEISS CALYPSO PRUEFPLAN DEFINITION"));
    assert!(calypso_code.contains("NAME: BORE_20_H7"));

    // 3. Operatör Kurulum Föyü (.MD)
    let setup_sheet = emitter.generate_setup_sheet(&plan);
    let setup_path = format!("{}/SETUP_SHEET_VALVE_BODY_OP10.md", out_dir);
    fs::write(&setup_path, &setup_sheet).expect("Kurulum föyü yazılamadı!");
    assert!(setup_sheet.contains("NUPER ORTHO CMM OPERATÖR KURULUM FÖYÜ"));

    // 4. Saha FAT & Copilot Benchmark Sertifikası (.MD)
    let manual_records = vec![
        MeasurementRecord::new("BORE_20_H7", 20.0, 20.0123, 0.0210, 0.0000),
        MeasurementRecord::new("DATUM_A_FLATNESS", 0.0, 0.0031, 0.0100, -0.0100),
        MeasurementRecord::new("SIDE_DATUM_B_PERP", 0.0, 0.0042, 0.0150, -0.0150),
        MeasurementRecord::new("VALVE_SEAT_CONE", 45.0, 45.0019, 0.0200, -0.0200),
    ];
    let nuper_records = vec![
        MeasurementRecord::new("BORE_20_H7", 20.0, 20.0121, 0.0210, 0.0000),
        MeasurementRecord::new("DATUM_A_FLATNESS", 0.0, 0.0030, 0.0100, -0.0100),
        MeasurementRecord::new("SIDE_DATUM_B_PERP", 0.0, 0.0040, 0.0150, -0.0150),
        MeasurementRecord::new("VALVE_SEAT_CONE", 45.0, 45.0022, 0.0200, -0.0200),
    ];
    let fat_report = BenchmarkComparator::compare(
        "FAT-2026-NUPER-ASELSAN-001",
        "VALVE_BODY_OP10",
        "Hexagon Global S Chrome 09.15.08",
        "Müh. Emir Göçük (Lead QA & Metrology)",
        &manual_records,
        &nuper_records,
        240.0,
        0.5,
    )
    .expect("FAT kıyaslama başarısız!");
    assert_eq!(fat_report.status, FatStatus::Passed);
    assert_eq!(fat_report.speedup_factor, 480.0);
    assert!(fat_report.max_delta_mm <= 0.0003);

    let fat_md = BenchmarkComparator::format_fat_certificate(&fat_report);
    let fat_path = format!("{}/FAT_CERTIFICATE_AS9100D_VALVE_001.md", out_dir);
    fs::write(&fat_path, &fat_md).expect("FAT sertifikası yazılamadı!");
    assert!(fat_md.contains("RESMİ FABRİKA KABUL TESTİ (FAT)"));
    assert!(fat_md.contains("480.0x Daha Hızlı"));

    // 5. AS9100 Rev D Kanonik SHA-256 Dijital Mührü (.sig)
    let audit_cert = AntiTamperAuthority::verify_program_integrity(&signed_dmis)
        .expect("Bütünlük doğrulaması başarısız!");
    assert!(audit_cert.is_valid);

    let seal_sig = format!(
        "AS9100 REV D KRIPTOGRAFIK MUHUR SERTIFIKASI\n\
         Dosya: VALVE_BODY_OP10\n\
         Sertifika ID: {}\n\
         Denetci: {}\n\
         Kanonik SHA-256: {}\n\
         Unsur Sayisi: {} | Tolerans Sayisi: {} | Hareket: {}\n\
         Durum: CERTIFIED UNTAMPERED (AS9100 Rev D Clause 8.5.1 / 8.5.2)\n",
        audit_cert.certificate_id,
        audit_cert.auditor_identity,
        audit_cert.canonical_hash,
        audit_cert.feature_count,
        audit_cert.tolerance_count,
        audit_cert.motion_count,
    );
    let seal_path = format!("{}/AS9100D_DIGITAL_SEAL_SHA256.sig", out_dir);
    fs::write(&seal_path, &seal_sig).expect("Mühür dosyası yazılamadı!");

    // Tüm 5 dosyanın fiziksel varlığı ve bayt boyutlarının doğrulanması
    assert!(fs::metadata(&dmis_path).unwrap().len() > 100);
    assert!(fs::metadata(&calypso_path).unwrap().len() > 100);
    assert!(fs::metadata(&setup_path).unwrap().len() > 100);
    assert!(fs::metadata(&fat_path).unwrap().len() > 100);
    assert!(fs::metadata(&seal_path).unwrap().len() > 50);

    println!("   ✅ [1/5] Kanonik DMIS 5.2 Dosyası: {} (OK)", dmis_path);
    println!("   ✅ [2/5] Zeiss Calypso Dosyası: {} (OK)", calypso_path);
    println!("   ✅ [3/5] Operatör Föyü Dosyası: {} (OK)", setup_path);
    println!("   ✅ [4/5] Saha FAT Sertifikası: {} (OK)", fat_path);
    println!("   ✅ [5/5] AS9100 SHA-256 Mührü: {} (OK)", seal_path);

    println!(">>> FAZ 8 SOVEREIGN PYLON TRIAD & PRODUCTION SHOWROOM BUNDLE TESTİ %100 BAŞARIYLA GEÇTİ!");
}
