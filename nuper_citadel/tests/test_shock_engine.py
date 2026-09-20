import pytest
from engine.core.shock_engine import ShockEngine


def test_shock_srs_calculation():
    """Validates SRS calculation for standard TPS 40g 11ms pulse."""
    srs = ShockEngine.calculate_srs(
        peak_acceleration_g=40.0,
        duration_ms=11.0,
        pulse_shape="Terminal Peak Sawtooth (TPS)",
        num_points=25
    )

    assert len(srs) == 25
    assert srs[0]["frequency_hz"] == 10.0
    # Low frequency response should be lower than peak (velocity step)
    assert srs[0]["srs_acceleration_g"] < 40.0
    # Resonant frequency (around 80-150 Hz) should show amplification > 40g
    max_accel = max(p["srs_acceleration_g"] for p in srs)
    assert max_accel > 55.0  # Dynamic amplification factor reaches ~1.65+
    # High frequency response should approach peak acceleration ~40g
    assert abs(srs[-1]["srs_acceleration_g"] - 40.0) < 5.0


def test_shock_qualification_pass():
    """Validates full structural shock qualification evaluation for 0.4 kg bracket."""
    res = ShockEngine.evaluate_shock_qualification(
        part_mass_kg=0.40,
        yield_strength_mpa=275.0,
        first_natural_freq_hz=240.0,
        num_bolts=4,
        bolt_tensile_area_mm2=8.78,  # M4
        bolt_yield_strength_mpa=640.0,  # 8.8 grade
        peak_acceleration_g=40.0,
        duration_ms=11.0,
        pulse_shape="Terminal Peak Sawtooth (TPS)"
    )

    assert res["standard"] == "MIL-STD-810H Method 516.8"
    assert res["qualification_status"] == "PASS"
    assert res["fastener_safety_margins"]["is_passed"] is True
    assert res["fastener_safety_margins"]["bolt_tensile_margin_of_safety"] > 1.0
    assert len(res["srs_spectrum"]) > 10


def test_shock_qualification_fail_overload():
    """Tests that very heavy part with single undersized bolt fails shock margin."""
    res = ShockEngine.evaluate_shock_qualification(
        part_mass_kg=25.0,  # Heavy 25 kg box
        yield_strength_mpa=275.0,
        first_natural_freq_hz=45.0,
        num_bolts=1,  # Only 1 bolt
        bolt_tensile_area_mm2=3.39,  # M2.5 tiny bolt
        bolt_yield_strength_mpa=400.0,
        peak_acceleration_g=75.0,
        duration_ms=6.0,
        pulse_shape="Half-Sine"
    )

    assert res["qualification_status"] == "FAIL"
    assert res["fastener_safety_margins"]["is_passed"] is False
    assert res["fastener_safety_margins"]["bolt_tensile_margin_of_safety"] < 0.0
