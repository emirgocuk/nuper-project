import pytest
from engine.core.gdt_bridge import GDTBridge


def test_true_position_calculation():
    # Hole shifted by dx = 0.05 mm, dy = 0.05 mm
    # TP = 2 * sqrt(0.05^2 + 0.05^2) = 2 * 0.0707 = 0.1414 mm
    # Specified tol = 0.20 mm -> Should Pass!
    res = GDTBridge.calculate_true_position(
        nominal_x=20.0,
        nominal_y=15.0,
        measured_x=20.05,
        measured_y=15.05,
        nominal_d=4.5,
        measured_d=4.52,
        specified_pos_tol=0.20,
        mmc_applied=True
    )

    assert abs(res.true_position_error_mm - 0.141) < 0.01
    assert res.is_position_conformant is True
    assert res.status == "CONFORMANT"


def test_cmm_inspection_evaluation():
    bridge = GDTBridge()
    holes_data = [
        {"hole_id": "H1", "nominal_x": 20.0, "nominal_y": 15.0, "measured_x": 20.02, "measured_y": 15.01, "nominal_diameter": 4.5, "measured_diameter": 4.51},
        {"hole_id": "H2", "nominal_x": 100.0, "nominal_y": 15.0, "measured_x": 100.03, "measured_y": 15.02, "nominal_diameter": 4.5, "measured_diameter": 4.50},
        {"hole_id": "H3", "nominal_x": 20.0, "nominal_y": 70.0, "measured_x": 20.01, "measured_y": 70.04, "nominal_diameter": 4.5, "measured_diameter": 4.52},
        {"hole_id": "H4", "nominal_x": 100.0, "nominal_y": 70.0, "measured_x": 100.02, "measured_y": 70.01, "nominal_diameter": 4.5, "measured_diameter": 4.51},
    ]
    flatness_z = [0.01, 0.02, -0.01, 0.03]  # Spread = 0.04 mm <= 0.08 mm

    report = bridge.evaluate_cmm_inspection(holes=holes_data, flatness_points_z=flatness_z, flatness_tolerance_mm=0.08)

    assert report["overall_status"] == "CONFORMANT"
    assert report["total_holes_evaluated"] == 4
    assert report["surface_flatness"]["is_conformant"] is True
