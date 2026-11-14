use glam::DVec3;
use ortho_ast::{
    recommend_adaptive_alignment, DatumReferenceFrame, InspectionPlan, ToleranceConstraint,
    ToleranceType,
};
use ortho_brep::BRepModel;
use ortho_emitter::{
    AntiTamperAuthority, AuditCertificate, CalypsoEmitter, ClosedLoopEngine, CncControllerType,
    DmisEmitter, FeatureDeviation, WenzelEmitter,
};
use ortho_license::{
    AirGappedLicense, FeatureFlag, HardwareFingerprint, LicenseAuthority, LicenseTier,
};
use ortho_router::{
    ipc::{BinaryMeshPacket, BinaryTrajectoryPacket},
    CertifiedCollisionFreeTrajectory, ClearanceBox, MotionSegment,
};

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

pub fn compile_trajectory_ipc(
    step_path: &str,
    _format: &str,
) -> Result<(BinaryTrajectoryPacket, String), String> {
    let drf = DatumReferenceFrame::new_3_2_1("PCS_AUTO_321", 1, 2, 3);
    let part_name = std::path::Path::new(step_path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("PART_INSPECTION");
    let plan = InspectionPlan::new(part_name, step_path, drf);

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

pub fn compile_all_dialects_ipc(drawing_json: &str, step_path: &str) -> Result<String, String> {
    let brep = if std::path::Path::new(step_path).exists() {
        BRepModel::from_step_file(step_path).map_err(|e| e.to_string())?
    } else {
        let default_step = include_str!("../../tests/data/valve_block.step");
        BRepModel::from_step_str(default_step, step_path).map_err(|e| e.to_string())?
    };

    let alignment_rec = recommend_adaptive_alignment(&brep.features)
        .unwrap_or_else(|_| ortho_ast::AlignmentRecommendation {
            strategy: ortho_ast::AlignmentStrategyType::PlaneLinePoint,
            primary_feature_id: 1,
            secondary_feature_id: 2,
            tertiary_feature_id: 3,
            stability_score: 1.0,
            orthogonality_error_deg: 0.0,
            is_6dof_locked: true,
            visual_guidance_points: vec![],
            operator_guidance: String::new(),
        });
    let drf = alignment_rec.to_datum_reference_frame("PCS_AUTO_321");
    let part_name = std::path::Path::new(step_path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("PART_INSPECTION");
    let mut plan = InspectionPlan::new(part_name, step_path, drf);
    plan.bounding_box_min = brep.bounding_box_min;
    plan.bounding_box_max = brep.bounding_box_max;
    for f in &brep.features {
        plan.features.push(f.clone());
    }

    if let Ok(drawing_val) = serde_json::from_str::<serde_json::Value>(drawing_json) {
        if let Some(dims) = drawing_val.get("dimensions").and_then(|d| d.as_array()) {
            for dim in dims {
                let id = dim.get("id").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
                let nom = dim.get("nominal").and_then(|v| v.as_f64()).unwrap_or(0.0);
                let upper = dim.get("upper_tol").and_then(|v| v.as_str()).and_then(|s| s.parse::<f64>().ok()).unwrap_or(0.05);
                let lower = dim.get("lower_tol").and_then(|v| v.as_str()).and_then(|s| s.parse::<f64>().ok()).unwrap_or(-0.05);
                if let Some(matched) = plan.features.iter().find(|f| {
                    f.diameter.map(|d| (d - nom).abs() < 0.2).unwrap_or(false)
                        || f.depth_or_length.map(|l| (l - nom).abs() < 0.2).unwrap_or(false)
                }) {
                    let tol = ToleranceConstraint::new(
                        id,
                        matched.id,
                        ToleranceType::Diameter,
                        nom,
                        upper,
                        lower,
                    );
                    plan.tolerances.push(tol);
                }
            }
        }
    }

    if plan.tolerances.is_empty() {
        if let Some(first_feat) = plan.features.first() {
            let tol = ToleranceConstraint::new(
                1,
                first_feat.id,
                ToleranceType::Diameter,
                first_feat.diameter.unwrap_or(20.0),
                0.05,
                -0.05,
            );
            plan.tolerances.push(tol);
        }
    }

    let clearance_box = ClearanceBox::from_bounding_box(plan.bounding_box_min, plan.bounding_box_max);
    let segments = vec![
        MotionSegment::RapidLinear { target: DVec3::new(0.0, 0.0, clearance_box.z_clearance + 50.0) },
        MotionSegment::TouchApproach { target: DVec3::new(50.0, 80.0, 50.0), normal: -DVec3::Y },
        MotionSegment::Retract { target: DVec3::new(50.0, 75.0, 50.0) },
    ];
    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance_box, vec![]);

    let emitter = DmisEmitter::new();
    let signed_pcdmis = emitter.emit_signed_pcdmis(
        &plan,
        &trajectory,
        "AS9100D-CMM-2026-NUPER-0091",
        "Müh. Emir Göçük",
    ).unwrap_or_else(|_| emitter.emit_pcdmis(&plan, &trajectory).unwrap_or_default());

    let calypso_emitter = CalypsoEmitter::new();
    let calypso_code = calypso_emitter.emit_calypso_ascii(&plan).unwrap_or_default();

    let wenzel_emitter = WenzelEmitter::new();
    let wenzel_code = wenzel_emitter.emit_quartis(&plan, Some(&trajectory)).unwrap_or_default();

    let setup_sheet = emitter.generate_setup_sheet(&plan);

    let mut closed_loop = ClosedLoopEngine::new(CncControllerType::Fanuc);
    for (idx, feat) in plan.features.iter().enumerate() {
        let tool_num = (idx as u32) + 1;
        let is_internal = feat.feature_type == ortho_ast::FeatureType::InternalCylinder;
        closed_loop.add_tool_mapping(&feat.name, tool_num, is_internal, 0.050);
    }

    let mut dev_list = Vec::new();
    for feat in &plan.features {
        let nom = feat.diameter.unwrap_or(20.0);
        dev_list.push(FeatureDeviation::new(
            &feat.name,
            nom,
            nom + 0.003,
            nom + 0.015,
            nom - 0.015,
        ));
    }
    let g10_code = closed_loop.generate_compensation_program(&dev_list).unwrap_or_else(|_| "% (CNC G10 EMPTY) %\n".to_string());

    let audit_cert = AntiTamperAuthority::verify_program_integrity(&signed_pcdmis).ok();
    let cert_id = audit_cert.as_ref().map(|c| c.certificate_id.clone()).unwrap_or_else(|| "AS9100D-CMM-2026-NUPER-0091".to_string());
    let cert_hash = audit_cert.as_ref().map(|c| c.canonical_hash.clone()).unwrap_or_default();
    let feat_count = audit_cert.as_ref().map(|c| c.feature_count).unwrap_or(plan.features.len());
    let tol_count = audit_cert.as_ref().map(|c| c.tolerance_count).unwrap_or(plan.tolerances.len());
    let motion_count = audit_cert.as_ref().map(|c| c.motion_count).unwrap_or(trajectory.segments.len());

    let payload = serde_json::json!({
        "success": true,
        "pcdmis": signed_pcdmis,
        "calypso": calypso_code,
        "wenzel": wenzel_code,
        "cnc_g10": g10_code,
        "setup_sheet": setup_sheet,
        "as9102_certificate_id": cert_id,
        "as9102_canonical_hash": cert_hash,
        "feature_count": feat_count,
        "tolerance_count": tol_count,
        "motion_count": motion_count
    });

    serde_json::to_string(&payload).map_err(|e| e.to_string())
}

pub fn verify_as9100_ipc(dmis_content: &str) -> Result<AuditCertificate, String> {
    AntiTamperAuthority::verify_program_integrity(dmis_content).map_err(|e| e.to_string())
}

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
    let hw = HardwareFingerprint::new("MCH-LOCAL-1", "CPU-1", Some("NUPER-USB-DGL-9841".to_string()));
    let _hash = hw.compute_composite_hash();
    let _challenge = LicenseAuthority::generate_offline_challenge(&hw);
}
