import pytest
from engine.core.post_fea_engine import PostFEAEngine


def test_post_fea_safe_condition():
    engine = PostFEAEngine()
    # f1 = 210 Hz (> 120 Hz -> SAFE), peak stress 80 MPa, yield 275 MPa
    res = engine.evaluate_post_fea(
        resonant_frequencies_hz=[210.0, 580.0, 1150.0],
        peak_von_mises_stress_mpa=80.0,
        yield_strength_mpa=275.0,
        damping_ratio=0.02,
        safety_factor=1.25
    )

    assert res["first_mode_hz"] == 210.0
    assert res["resonance_status"] == "SAFE"
    assert res["is_yield_safe"] is True
    assert res["margin_of_safety"] > 1.0
    assert res["notching_required"] is False
    assert res["dynamic_amplification_q"] == 25.0


def test_post_fea_critical_resonance_and_notching():
    engine = PostFEAEngine()
    # f1 = 48 Hz (< 60 Hz -> CRITICAL_RESONANCE), peak stress 290 MPa (exceeds allowable 220 MPa)
    res = engine.evaluate_post_fea(
        resonant_frequencies_hz=[48.0, 160.0],
        peak_von_mises_stress_mpa=290.0,
        yield_strength_mpa=275.0,
        damping_ratio=0.02,
        safety_factor=1.25
    )

    assert res["first_mode_hz"] == 48.0
    assert res["resonance_status"] == "CRITICAL_RESONANCE"
    assert res["is_yield_safe"] is False
    assert res["margin_of_safety"] < 0.0
    assert res["notching_required"] is True
    assert res["suggested_notch_depth_db"] < 0.0
    assert len(res["recommended_actions"]) >= 2
