//! # End-to-End Integration Test: FAZ 6
//!
//! 1. Saha FAT Kör Uçuş & Manuel 3-Nokta Sıfırlamadan Otonom CNC Geçişi Simülasyonu
//! 2. CMM Copilot Shadow Mode A/B Benchmark Doğrulaması (4 Saat Manuel vs 30 Sn Otonom)
//! 3. Sub-Mikron Boyutsal Uyum (< 0.5 µm Concordance) & 480x Süre Tasarrufu Analizi
//! 4. AS9100 Rev D Kriptografik Anti-Tamper Denetim İzi & Dijital Mühürleme
//! 5. Tahrifat Algılama (İzinsiz tolerans veya koordinat değişikliğini anında bloke etme)
//! 6. Resmi Fabrika Kabul Testi (FAT) Akreditasyon Sertifikası Üretimi

use glam::DVec3;
use ortho_ast::{
    DatumReferenceFrame, FeatureType, GeometricFeature, InspectionPlan, ToleranceConstraint,
    ToleranceType,
};
use ortho_emitter::{
    AntiTamperAuthority, BenchmarkComparator, DmisEmitter, FatStatus, MeasurementRecord,
    TamperViolation,
};
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, MotionSegment};

#[test]
fn test_phase6_saha_fat_copilot_benchmark_and_anti_tamper_pipeline() {
    println!(">>> FAZ 6 ENDÜSTRİYEL SAHA FAT & BENCHMARK ENTEGRASYON TESTİ BAŞLIYOR...");

    // =========================================================================
    // 1. ADIM 6.1: SAHA FAT KÖR UÇUŞ VE MANUEL HİZALAMADAN OTONOM CNC GEÇİŞİ
    // =========================================================================
    println!("--- [ADIM 6.1] Saha FAT Kör Uçuş & 3-Nokta Hizalama Senaryosu ---");

    let drf = DatumReferenceFrame::new_3_2_1("PCS_AERO_FAT", 1, 2, 3);
    let mut plan = InspectionPlan::new("AERO_HYDRAULIC_VALVE_FAT", "valve_block.step", drf);

    let datum_a = GeometricFeature::new_plane(
        1,
        "DATUM_A_PRIMARY_FACE",
        DVec3::new(50.0, 50.0, 0.0),
        DVec3::Z,
        10000.0,
        10.0,
    );
    let bore_h7 = GeometricFeature::new_internal_cylinder(
        2,
        "BORE_20_H7",
        DVec3::new(50.0, 50.0, 50.0),
        -DVec3::Z,
        20.0,
        30.0,
        1884.0,
        10.0,
    )
    .unwrap();
    let side_face = GeometricFeature::new_plane(
        3,
        "SIDE_DATUM_B",
        DVec3::new(0.0, 50.0, 25.0),
        -DVec3::X,
        5000.0,
        10.0,
    );

    plan.add_feature(datum_a);
    plan.add_feature(bore_h7);
    plan.add_feature(side_face);

    // H7 Toleransı Ekle
    plan.add_tolerance(ToleranceConstraint {
        id: 101,
        feature_id: 2,
        tolerance_type: ToleranceType::Diameter,
        nominal_value: 20.0,
        upper_tolerance: 0.021,
        lower_tolerance: 0.0,
        datum_refs: vec![],
    });

    // Simüle edilen güvenli ve sertifikalı prob rotası
    let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
    let segments = vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(0.0, 0.0, 150.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(50.0, 50.0, 50.0),
            normal: -DVec3::Z,
        },
        MotionSegment::Retract {
            target: DVec3::new(50.0, 50.0, 60.0),
        },
    ];
    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance, vec![]);

    // =========================================================================
    // 2. ADIM 6.2: CMM COPILOT SHADOW MODE A/B BENCHMARK DOĞRULAMASI
    // =========================================================================
    println!("--- [ADIM 6.2] Copilot Shadow Mode A/B Benchmark (4 Saat Manuel vs 30 Sn Otonom) ---");

    // Savunma sanayii kıdemli CMM operatörünün 4 saatte yazdığı manuel ölçümler
    let manual_records = vec![
        MeasurementRecord::new("BORE_20_H7", 20.0, 20.0123, 0.0210, 0.0000),
        MeasurementRecord::new("DATUM_A_FLATNESS", 0.0, 0.0031, 0.0100, -0.0100),
        MeasurementRecord::new("SIDE_DATUM_B_PERP", 0.0, 0.0042, 0.0150, -0.0150),
        MeasurementRecord::new("VALVE_SEAT_CONE", 45.0, 45.0019, 0.0200, -0.0200),
    ];

    // Nuper Ortho'nun 30 saniyede derlediği otonom CMM ölçümleri
    let nuper_records = vec![
        MeasurementRecord::new("BORE_20_H7", 20.0, 20.0121, 0.0210, 0.0000), // Delta: 0.0002 mm (0.2 µm)
        MeasurementRecord::new("DATUM_A_FLATNESS", 0.0, 0.0030, 0.0100, -0.0100), // Delta: 0.0001 mm (0.1 µm)
        MeasurementRecord::new("SIDE_DATUM_B_PERP", 0.0, 0.0040, 0.0150, -0.0150), // Delta: 0.0002 mm (0.2 µm)
        MeasurementRecord::new("VALVE_SEAT_CONE", 45.0, 45.0022, 0.0200, -0.0200), // Delta: 0.0003 mm (0.3 µm)
    ];

    let benchmark_report = BenchmarkComparator::compare(
        "FAT-2026-NUPER-ASELSAN-001",
        "AERO_HYDRAULIC_VALVE_FAT",
        "Hexagon Global S Chrome 09.15.08",
        "Müh. Emir Göçük (Lead QA & Metrology)",
        &manual_records,
        &nuper_records,
        240.0, // Manuel: 4 Saat (240 dakika)
        0.5,   // Nuper Ortho: 30 Saniye (0.5 dakika)
    )
    .expect("A/B Benchmark karşılaştırması başarısız!");

    // Doğrulamalar:
    assert_eq!(benchmark_report.status, FatStatus::CertifiedApproved);
    assert_eq!(benchmark_report.speedup_factor, 480.0);
    assert!(benchmark_report.time_savings_percent >= 99.7);
    assert_eq!(benchmark_report.submicron_concordance_rate, 100.0);
    assert!(benchmark_report.max_delta_mm <= 0.0003); // Maksimum 0.3 µm fark!
    assert!(benchmark_report.confidence_score >= 99.0);

    println!(
        "   -> Benchmark Sonucu: {:?} | Hızlanma: {:.1}x | Süre Tasarrufu: %{:.2}",
        benchmark_report.status, benchmark_report.speedup_factor, benchmark_report.time_savings_percent
    );
    println!(
        "   -> Sub-Mikron Uyum Oranı: %{:.1} | Maks Delta: {:.4} µm",
        benchmark_report.submicron_concordance_rate, benchmark_report.max_delta_mm * 1000.0
    );

    // =========================================================================
    // 3. ADIM 6.3: AS9100 REV D KRİPTOGRAFİK ANTİ-TAMPER MÜHÜRLEME VE İMZA
    // =========================================================================
    println!("--- [ADIM 6.3] AS9100 Rev D Kriptografik Anti-Tamper Mühürleme ---");

    let emitter = DmisEmitter::new();
    let signed_dmis = emitter
        .emit_signed_pcdmis(
            &plan,
            &trajectory,
            "CERT-AS9100D-FAT-2026",
            "Müh. Emir Göçük",
        )
        .expect("İmzalı PC-DMIS üretilemedi!");

    assert!(signed_dmis.contains("AS9100 REV D KRIPTOGRAFIK DENETIM IZI"));
    assert!(signed_dmis.contains("CERT-AS9100D-FAT-2026"));
    assert!(signed_dmis.contains("AS9100-REV-D-SIGNATURE:"));

    // Orijinal dosyanın bütünlüğünü AS9100 otoritesiyle doğrula
    let audit_cert = AntiTamperAuthority::verify_program_integrity(&signed_dmis)
        .expect("AS9100 Orijinal imza doğrulanamadı!");

    assert!(audit_cert.is_valid);
    assert_eq!(audit_cert.certificate_id, "CERT-AS9100D-FAT-2026");
    assert_eq!(audit_cert.auditor_identity, "Müh. Emir Göçük");
    assert_eq!(audit_cert.feature_count, 3);
    assert_eq!(audit_cert.tolerance_count, 1);
    println!("   -> AS9100 Mühür Doğrulandı: Hash={}", audit_cert.canonical_hash);

    // =========================================================================
    // 4. ADIM 6.4: İZİNSİZ TAHRİFAT DENETİMİ (ANTI-TAMPER FAIL-SAFE)
    // =========================================================================
    println!("--- [ADIM 6.4] Tahrifat Simülasyonu: Tolerans ve Koordinat Güvenliği ---");

    // Senaryo A: Yetkisiz operatör H7 toleransını 0.0210'dan 0.0500'e gevşetiyor!
    let tampered_tol_dmis = signed_dmis.replace("0.0210", "0.0500");
    let tamper_result = AntiTamperAuthority::verify_program_integrity(&tampered_tol_dmis);
    assert!(
        tamper_result.is_err(),
        "Tolerans tahrifatı güvenlik denetimini atlatamadı!"
    );

    match tamper_result.unwrap_err() {
        TamperViolation::ToleranceTampered { instruction, .. } => {
            println!("   -> Emniyet Kilidi Aktif: Tolerans tahrifatı yakalandı: '{}'", instruction);
            assert!(instruction.contains("0.0500"));
        }
        TamperViolation::SignatureMismatch { expected, actual } => {
            println!("   -> Kriptografik İmza Kırıldı: Beklenen={}, Hesaplanan={}", expected, actual);
        }
        other => panic!("Beklenmeyen hata: {:?}", other),
    }

    // Senaryo B: İmzasız doğrudan dışarıdan getirilmiş DMIS kodu
    let raw_unsigned = "FILNAM/'HACKED_PART', 5.3\nMODE/AUTO\nENDFIL\n";
    let unsigned_err = AntiTamperAuthority::verify_program_integrity(raw_unsigned).unwrap_err();
    assert_eq!(unsigned_err, TamperViolation::UnsignedProgram);
    println!("   -> İmzasız CMM kodu derhal bloke edildi: {:?}", unsigned_err);

    // =========================================================================
    // 5. ADIM 6.5: RESMİ FAT KABUL SERTİFİKASI ÜRETİMİ
    // =========================================================================
    println!("--- [ADIM 6.5] Resmi Fabrika Kabul Testi (FAT) Akreditasyon Sertifikası ---");

    let fat_certificate_md = BenchmarkComparator::format_fat_certificate(&benchmark_report);
    assert!(fat_certificate_md.contains("FABRİKA KABUL TESTİ (FAT)"));
    assert!(fat_certificate_md.contains("FAT PASSED"));
    assert!(fat_certificate_md.contains("480.0x"));
    assert!(fat_certificate_md.contains("Hexagon Global S Chrome"));
    assert!(fat_certificate_md.contains("AS9100 Rev D"));

    println!(">>> FAZ 6 ENDÜSTRİYEL SAHA FAT & BENCHMARK ENTEGRASYON TESTİ %100 BAŞARIYLA GEÇTİ!");
}
