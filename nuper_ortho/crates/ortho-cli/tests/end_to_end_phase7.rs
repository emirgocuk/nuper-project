//! # End-to-End Integration Test: FAZ 7
//!
//! 1. Savunma ve Havacılık Air-Gapped Lisans Motoru (AS9100 & ITAR Uyumlu)
//! 2. Donanım Parmak İzi (CPUID + Anakart GUID) ve USB Donanım Kilidi (Dongle) Eşlemesi
//! 3. Donanım Uyuşmazlığı ve Dongle Çıkarılma Koruması (Fail-Safe Anti-Theft)
//! 4. Süresi Dolan ve Tahrif Edilmiş Lisans Sertifikasını Anında Bloke Etme
//! 5. Çevrimdışı Askeri Ağ Challenge-Response Aktivasyon Protokolü
//! 6. Lisanslı Çekirdek ile Uçtan Uca CMM Programı Derleme ve AS9100 Mühürleme

use glam::DVec3;
use ortho_ast::{DatumReferenceFrame, GeometricFeature, InspectionPlan, ToleranceConstraint, ToleranceType};
use ortho_emitter::{AntiTamperAuthority, DmisEmitter};
use ortho_license::{
    AirGappedLicense, FeatureFlag, HardwareFingerprint, LicenseAuthority, LicenseError, LicenseTier,
};
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, MotionSegment};

#[test]
fn test_phase7_air_gapped_defense_licensing_and_hardware_dongle_pipeline() {
    println!(">>> FAZ 7 AIR-GAPPED SAVUNMA LİSANSLAMA VE DAĞITIM ENTEGRASYON TESTİ BAŞLIYOR...");

    // =========================================================================
    // 1. ADIM 7.1: AIR-GAPPED SAVUNMA LİSANSI OLUŞTURMA VE GEÇERLİLİK
    // =========================================================================
    println!("--- [ADIM 7.1] Savunma Sanayii Air-Gapped Lisans Sertifikasyonu ---");

    let authorized_hw = HardwareFingerprint::new(
        "MCH-ASELSAN-CMM-LAB-01",
        "INTEL-XEON-W-3495X-SECURE",
        Some("NUPER-DGL-9841-DEFENSE".to_string()),
    );

    let license = LicenseAuthority::issue_license(
        "LIC-ASELSAN-2026-NUPER-009",
        "ASELSAN Savunma Sistemleri A.Ş.",
        LicenseTier::DefenseEnterprise,
        Some(&authorized_hw),
        "2026-01-01",
        "2027-01-01",
    );

    assert_eq!(license.tier, LicenseTier::DefenseEnterprise);
    assert_eq!(license.max_cmm_nodes, 16);
    assert!(license.allowed_features.contains(&FeatureFlag::ClosedLoopCnc));
    assert!(license.allowed_features.contains(&FeatureFlag::As9100Audit));
    assert!(license.allowed_features.contains(&FeatureFlag::LaserScanning));
    assert!(license.allowed_features.contains(&FeatureFlag::SandboxedAi));

    // Lisansı yetkili makinede doğrula
    let validation = LicenseAuthority::validate_license(
        &license,
        &authorized_hw,
        "2026-09-28",
        Some(FeatureFlag::As9100Audit),
    );
    assert!(validation.is_ok(), "Yetkili lisans doğrulamadan geçemedi!");
    println!("   -> Lisans Doğrulandı: Müşteri={}, Mühür={}", license.customer_name, license.digital_signature);

    // =========================================================================
    // 2. ADIM 7.2: DONANIM KİLİDİ (USB DONGLE) VE FINGERPRINT KORUMASI
    // =========================================================================
    println!("--- [ADIM 7.2] Donanım Uyuşmazlığı ve USB Dongle Ayrılma Koruması ---");

    // Senaryo A: Yetkisiz yabancı bir makinede çalıştırma girişimi
    let foreign_hw = HardwareFingerprint::new(
        "ALIEN-LAPTOP-UNAUTHORIZED",
        "AMD-RYZEN-5-DESKTOP",
        Some("NUPER-DGL-9841-DEFENSE".to_string()), // Dongle takılmış olsa bile makine parmak izi farklı!
    );
    let foreign_res = LicenseAuthority::validate_license(&license, &foreign_hw, "2026-09-28", None);
    assert!(foreign_res.is_err());
    match foreign_res.unwrap_err() {
        LicenseError::HardwareMismatch { expected, actual } => {
            println!("   -> Emniyet Kilidi Aktif: Donanım parmak izi reddedildi (Beklenen: {}, Gelen: {})", expected, actual);
            assert_ne!(expected, actual);
        }
        other => panic!("Beklenmeyen hata: {:?}", other),
    }

    // Senaryo B: USB Donanım Kilidi (Dongle) fiziksel olarak çıkarılmış
    let missing_dongle_hw = HardwareFingerprint::new(
        "MCH-ASELSAN-CMM-LAB-01",
        "INTEL-XEON-W-3495X-SECURE",
        None, // Dongle çıkarılmış!
    );
    let dongle_res = LicenseAuthority::validate_license(&license, &missing_dongle_hw, "2026-09-28", None);
    assert!(dongle_res.is_err());
    assert_eq!(dongle_res.unwrap_err(), LicenseError::MissingHardwareDongle);
    println!("   -> USB Donanım Kilidi Yok: Sistem otonom derlemeyi derhal kilitledi.");

    // =========================================================================
    // 3. ADIM 7.3: SÜRESİ DOLMUŞ VE TAHRİF EDİLMİŞ LİSANS ENGELLEMESİ
    // =========================================================================
    println!("--- [ADIM 7.3] Süre Aşımı ve Tahrif Edilmiş Lisans İmzası Denetimi ---");

    // Senaryo A: Süresi dolmuş lisans
    let expired_res = LicenseAuthority::validate_license(&license, &authorized_hw, "2027-06-15", None);
    assert!(expired_res.is_err());
    match expired_res.unwrap_err() {
        LicenseError::LicenseExpired { expires_at, current_date } => {
            println!("   -> Lisans Süresi Aşımı Tespit Edildi: Sona Erme={}, Güncel={}", expires_at, current_date);
            assert_eq!(expires_at, "2027-01-01");
        }
        other => panic!("Beklenmeyen hata: {:?}", other),
    }

    // Senaryo B: Tahrif edilmiş lisans sertifikası (Örneğin max_cmm_nodes değiştirilmiş)
    let mut tampered_license = license.clone();
    tampered_license.customer_name = "KORSAN SAVUNMA A.Ş.".to_string();
    let tamper_res = LicenseAuthority::validate_license(&tampered_license, &authorized_hw, "2026-09-28", None);
    assert!(tamper_res.is_err());
    assert_eq!(tamper_res.unwrap_err(), LicenseError::TamperedSignature);
    println!("   -> Lisans Sertifikası Tahrifatı: İmza uyuşmazlığı yakalandı.");

    // =========================================================================
    // 4. ADIM 7.4: ÇEVRİMDIŞI ASKERİ AĞ CHALLENGE-RESPONSE PROTOKOLÜ
    // =========================================================================
    println!("--- [ADIM 7.4] Askeri Ağ Çevrimdışı Challenge-Response Protokolü ---");

    let challenge = LicenseAuthority::generate_offline_challenge(&authorized_hw);
    assert!(challenge.starts_with("CHALLENGE-"));
    println!("   -> Çevrimdışı Üretilen Donanım Challenge Kodu: {}", challenge);

    // =========================================================================
    // 5. ADIM 7.5: LİSANSLI DERLEYİCİ İLE UÇTAN UCA CMM KODU VE MÜHÜR BASIMI
    // =========================================================================
    println!("--- [ADIM 7.5] Lisanslı Otonom Derleme ve AS9100 Mühürlü Çıktı ---");

    let drf = DatumReferenceFrame::new_3_2_1("PCS_AERO_LICENSED", 1, 2, 3);
    let mut plan = InspectionPlan::new("AERO_TURBINE_HOUSING", "turbine.step", drf);

    let bore = GeometricFeature::new_internal_cylinder(
        10,
        "BEARING_BORE_60",
        DVec3::new(50.0, 50.0, 50.0),
        -DVec3::Z,
        60.0,
        40.0,
        7539.0,
        15.0,
    )
    .unwrap();
    plan.add_feature(bore);

    let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(120.0, 120.0, 80.0));
    let segments = vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(0.0, 0.0, 150.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(50.0, 80.0, 50.0),
            normal: -DVec3::Y,
        },
        MotionSegment::Retract {
            target: DVec3::new(50.0, 75.0, 50.0),
        },
    ];
    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance, vec![]);

    let emitter = DmisEmitter::new();
    let signed_dmis = emitter
        .emit_signed_pcdmis(
            &plan,
            &trajectory,
            &license.license_id,
            "Müh. Emir Göçük (Lead QA)",
        )
        .expect("Lisanslı DMIS derlenemedi!");

    assert!(signed_dmis.contains(&license.license_id));
    assert!(signed_dmis.contains("AS9100 REV D KRIPTOGRAFIK DENETIM IZI"));

    let audit_cert = AntiTamperAuthority::verify_program_integrity(&signed_dmis).expect("Mühür geçersiz!");
    assert!(audit_cert.is_valid);
    println!("   -> Lisanslı Çıktı Doğrulandı: Sertifika={}, Hash={}", audit_cert.certificate_id, audit_cert.canonical_hash);

    println!(">>> FAZ 7 AIR-GAPPED SAVUNMA LİSANSLAMA VE DAĞITIM ENTEGRASYON TESTİ %100 BAŞARIYLA GEÇTİ!");
}
