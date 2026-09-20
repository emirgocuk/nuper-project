import pytest
from engine.core.composite_engine import CompositeEngine


def test_composite_reduced_stiffness_q():
    """Validates Q matrix computation for carbon/epoxy."""
    Q = CompositeEngine.calculate_reduced_stiffness_q(
        e1=142000.0,
        e2=10300.0,
        g12=7200.0,
        nu12=0.27
    )

    assert Q.shape == (3, 3)
    # Q11 should be slightly higher than E1 due to 1/(1 - nu12*nu21)
    assert Q[0, 0] > 142000.0
    assert Q[1, 1] > 10300.0
    assert Q[2, 2] == 7200.0
    assert Q[0, 1] == Q[1, 0]


def test_composite_quasi_isotropic_layup():
    """Validates symmetric quasi-isotropic [0/45/-45/90]s laminate."""
    angles = [0.0, 45.0, -45.0, 90.0, 90.0, -45.0, 45.0, 0.0]
    res = CompositeEngine.evaluate_laminate(
        material_preset="AS4/3501-6 Carbon/Epoxy",
        layup_angles=angles,
        ply_thickness_mm=0.125,
        force_nx=100.0,  # 100 N/mm tension
        force_ny=100.0,
        shear_nxy=0.0
    )

    assert res["num_plies"] == 8
    assert res["total_thickness_mm"] == 1.0
    assert res["qualification_verdict"] == "PASS"
    assert res["tsai_wu_margin_of_safety"] > 0.0

    # For quasi-isotropic laminate, Ex and Ey should be virtually identical
    ex = res["effective_engineering_constants"]["ex_gpa"]
    ey = res["effective_engineering_constants"]["ey_gpa"]
    assert abs(ex - ey) < 1.0  # quasi-isotropic symmetry


def test_composite_overload_failure():
    """Validates Tsai-Wu failure under extreme transverse load."""
    angles = [0.0, 0.0]  # Unidirectional 0 deg fibers
    res = CompositeEngine.evaluate_laminate(
        material_preset="AS4/3501-6 Carbon/Epoxy",
        layup_angles=angles,
        ply_thickness_mm=0.125,
        force_nx=0.0,
        force_ny=200.0,  # Extreme transverse tension exceeding Yt (57 MPa) * 0.25mm = 14.25 N/mm
        shear_nxy=0.0
    )

    assert res["qualification_verdict"] == "FAIL"
    assert res["tsai_wu_margin_of_safety"] < 0.0
