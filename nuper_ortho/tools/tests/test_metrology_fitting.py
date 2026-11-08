import math
import numpy as np
import pytest
from tools.extractor.metrology_fitting import (
    fit_plane_least_squares,
    fit_circle_least_squares_2d,
    fit_cylinder_least_squares,
    fit_sphere_least_squares,
    evaluate_gdt_feature,
)


def test_fit_plane_least_squares():
    # Plane at Z = 5.0 with small noise
    np.random.seed(42)
    x = np.linspace(0, 100, 10)
    y = np.linspace(0, 50, 10)
    xx, yy = np.meshgrid(x, y)
    zz = 5.0 + (np.random.rand(*xx.shape) - 0.5) * 0.004

    pts = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    res = fit_plane_least_squares(pts)

    assert res["success"] is True
    assert res["feature_type"] == "PLANE"
    assert abs(abs(res["normal"][2]) - 1.0) < 1e-4
    assert res["flatness"] < 0.005
    assert res["rms_error"] < 0.002


def test_fit_circle_least_squares_2d():
    # Circle at (10, 20) with radius 12.5 (diameter 25.0)
    angles = np.linspace(0, 2 * math.pi, 16, endpoint=False)
    r_nom = 12.5
    cx, cy = 10.0, 20.0
    pts_2d = np.column_stack([cx + r_nom * np.cos(angles), cy + r_nom * np.sin(angles)])

    res = fit_circle_least_squares_2d(pts_2d)

    assert res["success"] is True
    assert abs(res["radius"] - 12.5) < 1e-5
    assert abs(res["diameter"] - 25.0) < 1e-5
    assert abs(res["center_2d"][0] - 10.0) < 1e-5
    assert abs(res["center_2d"][1] - 20.0) < 1e-5
    assert res["circularity"] < 1e-5


def test_fit_cylinder_least_squares():
    # Cylinder along Z-axis at (5, 5), radius 4.0 (diameter 8.0)
    angles = np.linspace(0, 2 * math.pi, 8, endpoint=False)
    z_levels = [0.0, 10.0, 20.0]
    pts = []
    r = 4.0
    for z in z_levels:
        for a in angles:
            pts.append([5.0 + r * math.cos(a), 5.0 + r * math.sin(a), z])
    pts = np.array(pts)

    res = fit_cylinder_least_squares(pts)

    assert res["success"] is True
    assert abs(res["diameter"] - 8.0) < 1e-4
    assert abs(abs(res["axis"][2]) - 1.0) < 1e-4
    assert res["cylindricity"] < 1e-4


def test_fit_sphere_least_squares():
    # Sphere at (1, 2, 3), radius 7.5 (diameter 15.0)
    u = np.linspace(0, 2 * math.pi, 10)
    v = np.linspace(0, math.pi, 10)
    pts = []
    for u_i in u:
        for v_i in v:
            x = 1.0 + 7.5 * math.sin(v_i) * math.cos(u_i)
            y = 2.0 + 7.5 * math.sin(v_i) * math.sin(u_i)
            z = 3.0 + 7.5 * math.cos(v_i)
            pts.append([x, y, z])
    pts = np.array(pts)

    res = fit_sphere_least_squares(pts)

    assert res["success"] is True
    assert abs(res["diameter"] - 15.0) < 1e-4
    assert abs(res["center"][0] - 1.0) < 1e-4
    assert abs(res["center"][1] - 2.0) < 1e-4
    assert abs(res["center"][2] - 3.0) < 1e-4


def test_evaluate_gdt_feature():
    # Hole evaluation with nominal diameter 10.0 mm
    angles = np.linspace(0, 2 * math.pi, 8, endpoint=False)
    pts = np.array([[5.01 * math.cos(a), 5.01 * math.sin(a), 0.0] for a in angles])

    eval_res = evaluate_gdt_feature(
        pts,
        expected_type="INTERNAL_CYLINDER",
        nominal_dimension=10.0,
        nominal_center=[0.0, 0.0, 0.0],
        nominal_normal=[0.0, 0.0, 1.0],
    )

    assert eval_res["success"] is True
    assert abs(eval_res["size_deviation"] - 0.02) < 1e-3


def test_fit_with_outlier_rejection():
    from tools.extractor.metrology_fitting import fit_with_outlier_rejection
    pts = np.array([
        [0.0, 0.0, 0.001],
        [10.0, 0.0, -0.001],
        [10.0, 10.0, 0.002],
        [0.0, 10.0, -0.002],
        [5.0, 5.0, 0.000],
        [2.0, 8.0, 0.001],
        [8.0, 2.0, -0.001],
        [5.0, 2.0, 0.250],
    ])
    res = fit_with_outlier_rejection(pts, "PLANE")
    assert res["success"] is True
    assert res["suspected_burr_count"] == 1
    assert res["clean_point_count"] == 7
    assert res["outliers"][0]["tag"] == "SUSPECTED_BURR_OUTLIER"
    assert res["outliers"][0]["index"] == 7

