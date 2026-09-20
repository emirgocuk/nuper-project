import pytest
from engine.core.fastener_engine import FastenerEngine


def test_fastener_engine_metric_thread_matching():
    fe = FastenerEngine()
    # 4.5 mm hole -> M4 clearance hole
    assert fe.match_metric_thread(4.5) == "M4"
    # 6.6 mm hole -> M6 clearance hole
    assert fe.match_metric_thread(6.6) == "M6"
    # 9.0 mm hole -> M8 clearance hole
    assert fe.match_metric_thread(9.0) == "M8"
    # 11.0 mm hole -> M10 clearance hole
    assert fe.match_metric_thread(11.0) == "M10"


def test_fastener_engine_evaluation_and_torque():
    fe = FastenerEngine()
    holes = [
        {"hole_id": "H1", "diameter_mm": 6.5, "center": {"x": 20.0, "y": 20.0, "z": 0.0}},
        {"hole_id": "H2", "diameter_mm": 6.5, "center": {"x": 180.0, "y": 20.0, "z": 0.0}},
        {"hole_id": "H3", "diameter_mm": 6.5, "center": {"x": 20.0, "y": 100.0, "z": 0.0}},
        {"hole_id": "H4", "diameter_mm": 6.5, "center": {"x": 180.0, "y": 100.0, "z": 0.0}},
    ]

    res = fe.evaluate_fasteners(
        holes=holes,
        chassis_mass_kg=4.5,
        hcg_mm=35.0,
        preferred_grade="8.8"
    )

    assert res["total_holes_count"] == 4
    assert res["pattern_summary"]["M6"] == 4
    assert res["total_clamping_force_kn"] > 0
    assert len(res["fasteners"]) == 4

    # Check bolt specification and torque
    f1 = res["fasteners"][0]
    assert "DIN 912" in f1["standard_spec"]
    assert f1["thread_size"] == "M6"
    assert f1["recommended_torque_nm"] > 8.0  # M6 Grade 8.8 is typically ~9.5-10.5 N*m
    assert "Nord-Lock" in f1["washer_recommendation"]
