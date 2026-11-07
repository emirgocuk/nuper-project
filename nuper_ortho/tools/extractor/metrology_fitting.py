import math
from typing import Any, Dict, List, Optional, Tuple
import numpy as np


def fit_plane_least_squares(points: np.ndarray) -> Dict[str, Any]:
    if len(points) < 3:
        return {"success": False, "error": "Düzlem uydurma için en az 3 nokta gereklidir."}

    pts = np.asarray(points, dtype=np.float64)
    centroid = np.mean(pts, axis=0)
    shifted = pts - centroid

    # SVD for singular vector with minimum singular value (normal)
    _, _, vh = np.linalg.svd(shifted)
    normal = vh[2, :]
    norm_len = np.linalg.norm(normal)
    if norm_len < 1e-12:
        return {"success": False, "error": "Dejenere nokta bulutu (noktalar doğrusal)."}
    normal = normal / norm_len

    # Distance of points to plane
    distances = np.dot(shifted, normal)
    # Peak to valley (flatness deviation)
    flatness = float(np.max(distances) - np.min(distances))
    rms_error = float(np.sqrt(np.mean(distances ** 2)))

    return {
        "success": True,
        "feature_type": "PLANE",
        "centroid": [round(float(v), 6) for v in centroid],
        "normal": [round(float(v), 6) for v in normal],
        "d_offset": round(float(np.dot(normal, centroid)), 6),
        "flatness": round(flatness, 6),
        "rms_error": round(rms_error, 6),
        "points_count": len(pts),
    }


def fit_circle_least_squares_2d(points_2d: np.ndarray) -> Dict[str, Any]:
    if len(points_2d) < 3:
        return {"success": False, "error": "Daire uydurma için en az 3 nokta gereklidir."}

    pts = np.asarray(points_2d, dtype=np.float64)
    x = pts[:, 0]
    y = pts[:, 1]

    # Linear system for circle: x^2 + y^2 + a*x + b*y + c = 0
    # Center: (cx = -a/2, cy = -b/2), R = sqrt(cx^2 + cy^2 - c)
    A = np.column_stack([x, y, np.ones_like(x)])
    B = -(x**2 + y**2)

    try:
        sol, residuals, rank, s = np.linalg.lstsq(A, B, rcond=None)
    except np.linalg.LinAlgError as e:
        return {"success": False, "error": f"Lineer denklem çözülemedi: {e}"}

    a, b, c = sol
    cx = float(-a / 2.0)
    cy = float(-b / 2.0)
    rad_sq = cx**2 + cy**2 - c
    if rad_sq <= 0:
        return {"success": False, "error": "Hesaplanan yarıçap negatif veya tanımsız."}
    radius = float(np.sqrt(rad_sq))

    dists = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    devs = dists - radius
    circularity = float(np.max(dists) - np.min(dists))
    rms = float(np.sqrt(np.mean(devs ** 2)))

    return {
        "success": True,
        "feature_type": "CIRCLE",
        "center_2d": [round(cx, 6), round(cy, 6)],
        "radius": round(radius, 6),
        "diameter": round(radius * 2.0, 6),
        "circularity": round(circularity, 6),
        "rms_error": round(rms, 6),
        "points_count": len(pts),
    }


def fit_cylinder_least_squares(
    points: np.ndarray,
    initial_axis: Optional[np.ndarray] = None,
    max_iter: int = 50,
) -> Dict[str, Any]:
    if len(points) < 5:
        return {"success": False, "error": "Silindir uydurma için en az 5 uzaysal nokta gereklidir."}

    pts = np.asarray(points, dtype=np.float64)
    centroid = np.mean(pts, axis=0)
    shifted = pts - centroid

    if initial_axis is not None:
        axis = np.asarray(initial_axis, dtype=np.float64)
        axis = axis / (np.linalg.norm(axis) + 1e-12)
    else:
        # Principal component analysis for axis estimate
        _, _, vh = np.linalg.svd(shifted)
        axis = vh[0, :]
        axis = axis / (np.linalg.norm(axis) + 1e-12)

    # Iterative refinement of axis direction
    for _ in range(max_iter):
        # Basis orthogonal to axis
        if abs(axis[0]) < 0.9:
            ref = np.array([1.0, 0.0, 0.0])
        else:
            ref = np.array([0.0, 1.0, 0.0])
        u = np.cross(axis, ref)
        u = u / np.linalg.norm(u)
        v = np.cross(axis, u)

        # Project points to 2D plane perpendicular to axis
        pts_2d = np.column_stack([np.dot(shifted, u), np.dot(shifted, v)])
        circ_fit = fit_circle_least_squares_2d(pts_2d)
        if not circ_fit["success"]:
            break

        c_u, c_v = circ_fit["center_2d"]
        radius = circ_fit["radius"]

        # 3D Center on axis
        center_3d = centroid + c_u * u + c_v * v

        # Calculate distances to axis line
        vec_to_pts = pts - center_3d
        proj_on_axis = np.dot(vec_to_pts, axis)[:, np.newaxis] * axis
        radial_vecs = vec_to_pts - proj_on_axis
        radial_dists = np.linalg.norm(radial_vecs, axis=1)

        cylindricity = float(np.max(radial_dists) - np.min(radial_dists))
        rms_error = float(np.sqrt(np.mean((radial_dists - radius) ** 2)))

        # Check convergence
        if abs(c_u) < 1e-5 and abs(c_v) < 1e-5:
            break

        # Shift centroid to refined center
        centroid = center_3d
        shifted = pts - centroid

    return {
        "success": True,
        "feature_type": "CYLINDER",
        "center": [round(float(v), 6) for v in center_3d],
        "axis": [round(float(v), 6) for v in axis],
        "radius": round(float(radius), 6),
        "diameter": round(float(radius * 2.0), 6),
        "cylindricity": round(cylindricity, 6),
        "rms_error": round(rms_error, 6),
        "points_count": len(pts),
        "iso_14405_type": "GG",  # Gaussian Least Squares
    }


def fit_sphere_least_squares(points: np.ndarray) -> Dict[str, Any]:
    if len(points) < 4:
        return {"success": False, "error": "Küre uydurma için en az 4 nokta gereklidir."}

    pts = np.asarray(points, dtype=np.float64)
    x = pts[:, 0]
    y = pts[:, 1]
    z = pts[:, 2]

    # Linear system: x^2 + y^2 + z^2 + a*x + b*y + c*z + d = 0
    A = np.column_stack([x, y, z, np.ones_like(x)])
    B = -(x**2 + y**2 + z**2)

    try:
        sol, residuals, rank, s = np.linalg.lstsq(A, B, rcond=None)
    except np.linalg.LinAlgError as e:
        return {"success": False, "error": f"Küre denklemi çözülemedi: {e}"}

    a, b, c, d = sol
    cx = float(-a / 2.0)
    cy = float(-b / 2.0)
    cz = float(-c / 2.0)
    rad_sq = cx**2 + cy**2 + cz**2 - d
    if rad_sq <= 0:
        return {"success": False, "error": "Hesaplanan küre yarıçapı negatif."}
    radius = float(np.sqrt(rad_sq))

    dists = np.sqrt((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2)
    sphericity = float(np.max(dists) - np.min(dists))
    rms = float(np.sqrt(np.mean((dists - radius) ** 2)))

    return {
        "success": True,
        "feature_type": "SPHERE",
        "center": [round(cx, 6), round(cy, 6), round(cz, 6)],
        "radius": round(radius, 6),
        "diameter": round(radius * 2.0, 6),
        "sphericity": round(sphericity, 6),
        "rms_error": round(rms, 6),
        "points_count": len(pts),
    }


def evaluate_gdt_feature(
    points: np.ndarray,
    expected_type: str,
    nominal_dimension: Optional[float] = None,
    nominal_center: Optional[List[float]] = None,
    nominal_normal: Optional[List[float]] = None,
) -> Dict[str, Any]:
    expected = expected_type.upper()
    pts = np.asarray(points, dtype=np.float64)

    if expected in ("PLANE", "SURFACE"):
        fit = fit_plane_least_squares(pts)
        if not fit["success"]:
            return fit
        if nominal_normal:
            nom_n = np.array(nominal_normal, dtype=np.float64)
            nom_n = nom_n / np.linalg.norm(nom_n)
            actual_n = np.array(fit["normal"], dtype=np.float64)
            dot_prod = float(np.clip(np.dot(actual_n, nom_n), -1.0, 1.0))
            angular_dev_deg = float(math.degrees(math.acos(abs(dot_prod))))
            fit["angular_deviation_deg"] = round(angular_dev_deg, 4)
        return fit

    elif expected in ("CYLINDER", "INTERNAL_CYLINDER", "EXTERNAL_CYLINDER", "BORE", "PIN"):
        axis_hint = np.array(nominal_normal) if nominal_normal else None
        fit = fit_cylinder_least_squares(pts, initial_axis=axis_hint)
        if not fit["success"]:
            return fit
        if nominal_dimension is not None:
            fit["size_deviation"] = round(fit["diameter"] - nominal_dimension, 6)
        if nominal_center is not None:
            c_actual = np.array(fit["center"])
            c_nom = np.array(nominal_center)
            fit["position_deviation_3d"] = round(float(np.linalg.norm(c_actual - c_nom)), 6)
        return fit

    elif expected in ("SPHERE",):
        fit = fit_sphere_least_squares(pts)
        if not fit["success"]:
            return fit
        if nominal_dimension is not None:
            fit["size_deviation"] = round(fit["diameter"] - nominal_dimension, 6)
        return fit

    return {"success": False, "error": f"Desteklenmeyen unsur türü: {expected_type}"}
