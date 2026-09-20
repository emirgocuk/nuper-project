import pytest
from engine.core.fatigue_engine import FatigueEngine


def test_fatigue_engine_aluminium_6061_safe():
    engine = FatigueEngine()
    # Moderate stress scenario
    res = engine.evaluate_vibration_fatigue(
        resonant_freq_hz=250.0,
        rms_stress_1sigma_mpa=20.0,
        test_duration_seconds=3600.0,
        basquin_a_mpa=490.0,
        basquin_b_exponent=-0.108,
        yield_strength_mpa=275.0,
    )

    assert "bands_breakdown" in res
    assert len(res["bands_breakdown"]) == 3
    fatigue = res["fatigue_results"]
    assert fatigue["cumulative_damage_index_D"] < 0.20
    assert fatigue["is_fatigue_safe"] is True
    assert res["overall_qualification_verdict"] == "PASS"


def test_fatigue_engine_severe_damage():
    engine = FatigueEngine()
    # High stress scenario exceeding yield
    res = engine.evaluate_vibration_fatigue(
        resonant_freq_hz=400.0,
        rms_stress_1sigma_mpa=120.0,  # 3-sigma is 360 MPa > 275 MPa yield
        test_duration_seconds=7200.0,
        basquin_a_mpa=490.0,
        basquin_b_exponent=-0.108,
        yield_strength_mpa=275.0,
    )

    assert res["fatigue_results"]["cumulative_damage_index_D"] > 0.20
    assert res["fatigue_results"]["is_fatigue_safe"] is False
    assert res["static_yield_check"]["is_yield_safe"] is False
    assert res["overall_qualification_verdict"] == "FAIL"


def test_fatigue_engine_allowable_cycles():
    N = FatigueEngine.calculate_allowable_cycles(
        stress_mpa=100.0,
        basquin_a=490.0,
        basquin_b=-0.108,
    )
    assert N > 1000
