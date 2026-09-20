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


def test_parse_nastran_f06():
    """Validates real MSC/NX Nastran .f06 eigenvalue table extraction."""
    sample_f06 = """
                R E A L   E I G E N V A L U E S
 MODE    EXTRACTION      EIGENVALUE            RADIANS             CYCLES            GENERALIZED         GENERALIZED
  NO.       ORDER                                                                       MASS              STIFFNESS
    1         1        2.348123E+06        1.532359E+03        2.438827E+02        1.000000E+00        2.348123E+06
    2         2        1.294829E+07        3.598373E+03        5.727005E+02        1.000000E+00        1.294829E+07
    3         3        4.891024E+07        6.993586E+03        1.113067E+03        1.000000E+00        4.891024E+07

    MAXIMUM VON MISES STRESS = 48.75 MPA
    """
    parsed = PostFEAEngine.parse_solver_log(sample_f06, filename="avionics_chassis.f06")
    assert parsed["solver_type"] == "NASTRAN_F06"
    assert parsed["extracted_modes_count"] == 3
    assert parsed["first_mode_hz"] == 243.88
    assert parsed["second_mode_hz"] == 572.70
    assert parsed["third_mode_hz"] == 1113.07
    assert parsed["peak_von_mises_stress_mpa"] == 48.75


def test_parse_ansys_log():
    """Validates ANSYS modal table extraction."""
    sample_ansys = """
    ***** INDEX OF DATA SETS ON RESULTS FILE *****
    SET   TIME/FREQ    LOAD STEP   SUBSTEP
      1    184.25          1          1
      2    412.80          1          2
      3    890.15          1          3

    Peak Stress: 76.4 MPa
    """
    parsed = PostFEAEngine.parse_solver_log(sample_ansys, filename="bracket_modal.txt")
    assert parsed["solver_type"] == "ANSYS_LOG"
    assert parsed["extracted_modes_count"] == 3
    assert parsed["first_mode_hz"] == 184.25
    assert parsed["second_mode_hz"] == 412.80
    assert parsed["third_mode_hz"] == 890.15
    assert parsed["peak_von_mises_stress_mpa"] == 76.4

