use glam::DVec3;
use ortho_emitter::{
    AntiTamperAuthority, As9102Form1, As9102Form2, As9102Form3Entry, ClosedLoopEngine,
    CncControllerType, FeatureDeviation,
};
use ortho_router::{
    resolve_collision_free_path, trajectory_to_ipp_stream,
    CertifiedCollisionFreeTrajectory, ClearanceBox, IppCmmSimulator, IppProtocol,
    KeepOutZone, MotionSegment, StylusAssembly,
};

#[test]
fn test_end_to_end_inspection_pipeline() {
    let clamp = KeepOutZone::new(
        "CLAMP_FRONT_LEFT",
        DVec3::new(20.0, 20.0, 0.0),
        DVec3::new(40.0, 40.0, 30.0),
    );
    let clearance_box =
        ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(400.0, 200.0, 60.0));
    let stylus = StylusAssembly::default();

    let raw_plan = vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(50.0, 30.0, 15.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(50.0, 50.0, 20.0),
            normal: DVec3::Z,
        },
        MotionSegment::Retract {
            target: DVec3::new(50.0, 50.0, 25.0),
        },
        MotionSegment::RapidLinear {
            target: DVec3::new(395.5, 50.0, 30.0),
        },
        MotionSegment::TouchApproach {
            target: DVec3::new(395.5, 50.0, 20.0),
            normal: DVec3::X,
        },
        MotionSegment::Retract {
            target: DVec3::new(390.5, 50.0, 20.0),
        },
    ];

    let safe_segments =
        resolve_collision_free_path(&raw_plan, &clearance_box, &[clamp.clone()], &stylus)
            .expect("Path resolution failed");

    assert!(safe_segments.len() > raw_plan.len());
    let hop_detected = safe_segments.iter().any(|s| {
        if let MotionSegment::RapidLinear { target } = s {
            target.z >= 70.0
        } else {
            false
        }
    });
    assert!(hop_detected);

    let traj = CertifiedCollisionFreeTrajectory::new(safe_segments, clearance_box, vec![]);
    let ipp_stream = trajectory_to_ipp_stream(&traj, "PH10M_TP20_D2");

    assert!(ipp_stream[0].contains("StartSession"));
    assert!(ipp_stream.last().unwrap().contains("EndSession"));
    assert!(ipp_stream.iter().any(|cmd| cmd.contains("PtMeas")));

    let mut sim = IppCmmSimulator::new();
    let mut measured_points = 0;

    for line in &ipp_stream {
        if let Ok((tag, cmd)) = IppProtocol::parse_command(line) {
            let resps = sim.execute_command(tag, &cmd);
            for r in resps {
                if let ortho_router::IppResponse::Data { payload, .. } = r {
                    if payload.starts_with("PtMeasReport") {
                        measured_points += 1;
                    }
                }
            }
        }
    }

    assert_eq!(measured_points, 2);

    let deviations = vec![
        FeatureDeviation::new("BORE_20_H7", 20.0000, 20.0140, 20.0210, 20.0000),
        FeatureDeviation::new("LENGTH_395_5", 395.5000, 395.4200, 396.0000, 395.0000),
    ];

    let mut closed_loop = ClosedLoopEngine::new(CncControllerType::Fanuc);
    closed_loop.add_tool_mapping("BORE_20_H7", 3, true, 0.050);

    let gcode = closed_loop
        .generate_compensation_program(&deviations)
        .expect("Closed loop compensation failed");

    assert!(gcode.contains("G10 L12 P3 R-0.0070"));
    assert!(gcode.contains("M30"));

    let form1 = As9102Form1 {
        part_number: "VALVE-BODY-001".to_string(),
        part_name: "Aviation Valve Body".to_string(),
        serial_number: "SN-2026-001".to_string(),
        fai_report_number: "FAI-2026-001".to_string(),
        drawing_number: "DWG-1002".to_string(),
        drawing_revision: "B".to_string(),
        organization_name: "Nuper Ortho Metrology".to_string(),
        cage_code: "TU123".to_string(),
        signature_authority: "Chief Quality Inspector".to_string(),
    };

    let form2 = As9102Form2 {
        material_spec: "AMS-QQ-A-250/11 (AL6061-T6)".to_string(),
        material_coc: "COC-2026-0012".to_string(),
        special_processes: vec!["MIL-A-8625 Anodize".to_string()],
        functional_test_reports: vec!["PRESSURE-TEST-01".to_string()],
    };

    let form3 = vec![
        As9102Form3Entry {
            char_index: 1,
            balloon_number: "B1".to_string(),
            feature_type: "BORE_DIA".to_string(),
            nominal: 20.000,
            upper_tol: 0.021,
            lower_tol: 0.000,
            measured: 20.014,
            deviation: 0.014,
            tool_used: "CMM - Renishaw TP20".to_string(),
            is_pass: true,
            conformance_status: "PASS".to_string(),
            is_key_characteristic: true,
        },
        As9102Form3Entry {
            char_index: 2,
            balloon_number: "B2".to_string(),
            feature_type: "LENGTH".to_string(),
            nominal: 395.500,
            upper_tol: 0.500,
            lower_tol: -0.500,
            measured: 395.420,
            deviation: -0.080,
            tool_used: "CMM - Renishaw TP20".to_string(),
            is_pass: true,
            conformance_status: "PASS".to_string(),
            is_key_characteristic: false,
        },
    ];

    let secret_key = "INTEGRATION_TEST_SECRET_KEY";
    let fai_pkg = AntiTamperAuthority::generate_as9102_package(form1, form2, form3, secret_key);

    assert_eq!(fai_pkg.total_characteristics, 2);
    assert_eq!(fai_pkg.passed_characteristics, 2);
    assert_eq!(fai_pkg.failed_characteristics, 0);
    assert!(AntiTamperAuthority::verify_as9102_package(&fai_pkg, secret_key));
}

#[test]
fn test_pallet_inspection_dispatch() {
    let grid = ortho_router::PalletGrid::new_grid(2, 2, DVec3::ZERO, 100.0, 100.0);
    assert_eq!(grid.slots.len(), 4);

    let cl_box = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(50.0, 50.0, 30.0));
    let base_traj = CertifiedCollisionFreeTrajectory::new(
        vec![
            MotionSegment::RapidLinear { target: DVec3::new(10.0, 10.0, 40.0) },
            MotionSegment::TouchApproach { target: DVec3::new(10.0, 10.0, 10.0), normal: DVec3::Z },
            MotionSegment::Retract { target: DVec3::new(10.0, 10.0, 40.0) },
        ],
        cl_box,
        vec![],
    );

    let pallet_segments = ortho_router::optimize_cross_nest_pallet_inspection(&base_traj, &grid, 80.0)
        .expect("Pallet inspection generation failed");
    assert!(!pallet_segments.is_empty());
}

#[test]
fn test_autonomous_closed_loop_orchestration() {
    let config = ortho_router::AutonomousLoopConfig {
        target_cpk: 1.5,
        max_iterations: 8,
        tool_breakage_limit_mm: 0.100,
        nominal: 25.000,
        usl: 25.025,
        lsl: 24.975,
    };

    let result = ortho_router::AutonomousQualityOrchestrator::run_autonomous_loop(&config, |_part_idx, offset| {
        config.nominal + 0.010 + offset
    });

    assert!(!result.safety_aborted);
    assert!(result.total_iterations <= config.max_iterations);
    assert!(!result.records.is_empty());
}
