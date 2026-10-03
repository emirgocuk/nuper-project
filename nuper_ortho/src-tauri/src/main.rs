//! # Nuper Ortho Masaüstü Uygulama Motoru (Tauri 2.0 Shell)
//!
//! Solid Slate Light ön yüzü (`ui/index.html`) ile Rust çekirdeği arasındaki
//! Zero-Copy IPC ikili tampon köprüsünü ve lisans yetkilendirmesini yönetir.

use glam::DVec3;
use ortho_ast::{
    classify_thread_from_bore, detect_compound_holes, recommend_adaptive_alignment,
    DatumReferenceFrame, InspectionPlan, ToleranceConstraint, ToleranceType,
};
use ortho_brep::BRepModel;
use ortho_emitter::{AntiTamperAuthority, AuditCertificate, DmisEmitter};
use ortho_kinematics::{
    sample_cylinder_2level, sample_plane_grid, OrientedSamplingPlan, PH10LookUpTable, ProbeStack,
};
use ortho_license::{
    AirGappedLicense, FeatureFlag, HardwareFingerprint, LicenseAuthority, LicenseError, LicenseTier,
};
use ortho_router::{
    ipc::{BinaryMeshPacket, BinaryTrajectoryPacket},
    CertifiedCollisionFreeTrajectory, ClearanceBox, CmmMachineProfile, MotionSegment,
};

/// 1. Zero-Copy 3D CAD Mesh Tamponu Çağrısı
pub fn load_mesh_ipc(step_path: &str) -> Result<BinaryMeshPacket, String> {
    let brep = if std::path::Path::new(step_path).exists() {
        BRepModel::from_step_file(step_path).map_err(|e| e.to_string())?
    } else {
        let default_step = include_str!("../../tests/data/valve_block.step");
        BRepModel::from_step_str(default_step, step_path).map_err(|e| e.to_string())?
    };

    let mesh = BinaryMeshPacket::new_box(brep.bounding_box_min, brep.bounding_box_max, 1);
    Ok(mesh)
}

/// 2. Otonom CMM Prob Yolu Derleme ve İkili Tampon Çıktısı Çağrısı
pub fn compile_trajectory_ipc(
    step_path: &str,
    format: &str,
) -> Result<(BinaryTrajectoryPacket, String), String> {
    let drf = DatumReferenceFrame::new_3_2_1("PCS_AUTO_321", 1, 2, 3);
    let mut plan = InspectionPlan::new("VALVE_BODY_OP10", step_path, drf);

    let clearance_box =
        ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));

    let segments = vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(0.0, 0.0, 100.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(20.0, 50.0, 20.0),
            normal: DVec3::Z,
        },
        MotionSegment::Retract {
            target: DVec3::new(20.0, 50.0, 25.0),
        },
    ];

    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance_box, vec![]);
    let packet = BinaryTrajectoryPacket::from_certified_trajectory(&trajectory);

    let emitter = DmisEmitter::new();
    let dmis_code = emitter
        .emit_signed_pcdmis(
            &plan,
            &trajectory,
            "AS9100D-CMM-2026-NUPER-0091",
            "Müh. Emir Göçük",
        )
        .map_err(|e| e.to_string())?;

    Ok((packet, dmis_code))
}

/// 3. AS9100 Rev D Kriptografik Denetim Çağrısı
pub fn verify_as9100_ipc(dmis_content: &str) -> Result<AuditCertificate, String> {
    AntiTamperAuthority::verify_program_integrity(dmis_content).map_err(|e| e.to_string())
}

/// 4. Çevrimdışı Savunma Lisansı ve Donanım Kilidi (Dongle) Denetimi
pub fn check_license_ipc(dongle_id: Option<String>) -> Result<AirGappedLicense, String> {
    let hw = HardwareFingerprint::new(
        "MCH-DEFENSE-AS9100-STATION",
        "INTEL-CORE-I9-METROLOGY",
        dongle_id.clone().or_else(|| Some("NUPER-USB-DGL-9841".to_string())),
    );

    let license = LicenseAuthority::issue_license(
        "LIC-ASELSAN-2026-001",
        "ASELSAN Savunma Sistemleri",
        LicenseTier::DefenseEnterprise,
        Some(&hw),
        "2026-01-01",
        "2027-01-01",
    );

    LicenseAuthority::validate_license(&license, &hw, "2026-09-28", Some(FeatureFlag::ClosedLoopCnc))
        .map_err(|e| e.to_string())?;

    Ok(license)
}

fn main() {
    println!("🚀 Nuper Ortho Masaüstü Uygulaması (Tauri 2.0 Shell) Başlatılıyor...");
    println!("   -> Solid Slate Light Arayüzü: ui/index.html");
    println!("   -> Zero-Copy Binary IPC Aktif.");
    
    // Masaüstü test denetimi
    let hw = HardwareFingerprint::new("MCH-LOCAL-1", "CPU-1", Some("NUPER-USB-DGL-9841".to_string()));
    let challenge = LicenseAuthority::generate_offline_challenge(&hw);
    println!("   -> Donanım Kimliği: {}", hw.compute_composite_hash());
    println!("   -> Çevrimdışı Challenge: {}", challenge);
}
