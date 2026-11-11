import math
import numpy as np
import pytest
from tools.extractor.metrology_fitting import (
    fit_plane_least_squares,
    fit_plane_chebyshev_minimum_zone,
    fit_circle_least_squares_2d,
    fit_circle_chebyshev_minimum_zone_2d,
    fit_circle_maximum_inscribed_2d,
    fit_circle_minimum_circumscribed_2d,
    evaluate_measurement_uncertainty,
)


def test_fit_plane_least_squares_canonical_ptb():
    pts = []
    for x in np.linspace(0.0, 100.0, 11):
        for y in np.linspace(0.0, 100.0, 11):
            pts.append([x, y, 0.0])
    pts = np.array(pts)

    res = fit_plane_least_squares(pts)
    assert res["success"] is True
    assert res["flatness"] < 1e-7
    assert abs(res["normal"][2] - 1.0) < 1e-7


def test_fit_plane_chebyshev_minimum_zone():
    pts = np.array([
        [0.0, 0.0, 0.002],
        [50.0, 0.0, -0.003],
        [50.0, 50.0, 0.001],
        [0.0, 50.0, -0.002],
        [25.0, 25.0, 0.000],
    ])

    lsq = fit_plane_least_squares(pts)
    mz = fit_plane_chebyshev_minimum_zone(pts)

    assert mz["success"] is True
    assert mz["flatness"] <= lsq["flatness"] + 1e-9
    assert mz["iso_14405_type"] == "MZ"


def test_fit_circle_least_squares_and_chebyshev_canonical():
    angles = np.linspace(0, 2 * math.pi, 24, endpoint=False)
    r_nom = 25.0
    cx_nom = 10.0
    cy_nom = 30.0

    pts = np.column_stack([
        cx_nom + r_nom * np.cos(angles),
        cy_nom + r_nom * np.sin(angles),
    ])

    lsq = fit_circle_least_squares_2d(pts)
    assert lsq["success"] is True
    assert abs(lsq["radius"] - r_nom) < 1e-7
    assert abs(lsq["center_2d"][0] - cx_nom) < 1e-7
    assert abs(lsq["center_2d"][1] - cy_nom) < 1e-7
    assert lsq["circularity"] < 1e-7

    mz = fit_circle_chebyshev_minimum_zone_2d(pts)
    assert mz["success"] is True
    assert abs(mz["radius"] - r_nom) < 1e-7
    assert mz["circularity"] < 1e-7


def test_mic_and_mcc_circle_bounds():
    angles = np.linspace(0, 2 * math.pi, 16, endpoint=False)
    base_r = 20.0
    variations = [0.01 * math.sin(3 * a) for a in angles]
    pts = np.column_stack([
        (base_r + v) * np.cos(a) for a, v in zip(angles, variations)
    ])
    pts = np.column_stack([
        [(base_r + v) * math.cos(a) for a, v in zip(angles, variations)],
        [(base_r + v) * math.sin(a) for a, v in zip(angles, variations)],
    ])

    lsq = fit_circle_least_squares_2d(pts)
    mic = fit_circle_maximum_inscribed_2d(pts)
    mcc = fit_circle_minimum_circumscribed_2d(pts)

    assert mic["radius"] <= lsq["radius"] + 1e-6
    assert mcc["radius"] >= lsq["radius"] - 1e-6
    assert mic["radius"] < mcc["radius"]


def test_evaluate_measurement_uncertainty_gum():
    res = evaluate_measurement_uncertainty(
        u_geo=0.0015,
        u_probe=0.0006,
        u_temp=0.0005,
        u_rep=0.0003,
        tolerance_band=0.040,
        measured_deviation=0.005,
    )

    assert res["combined_uncertainty_uc"] > 0.001
    assert res["expanded_uncertainty_u95"] > res["combined_uncertainty_uc"]
    assert res["test_uncertainty_ratio_tur"] >= 4.0
    assert res["tur_acceptable"] is True
    assert res["conformance_decision"] == "PASS"

    fail_res = evaluate_measurement_uncertainty(
        u_geo=0.0015,
        u_probe=0.0006,
        u_temp=0.0005,
        u_rep=0.0003,
        tolerance_band=0.040,
        measured_deviation=0.035,
    )
    assert fail_res["conformance_decision"] == "FAIL"
