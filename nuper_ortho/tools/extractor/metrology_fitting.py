import math
from typing import Any, Dict, List, Optional, Tuple
import numpy as np


def fit_plane_least_squares(points: np.ndarray) -> Dict[str, Any]:
    if len(points) < 3:
        return {"success": False, "error": "Düzlem uydurma için en az 3 nokta gereklidir."}

    pts = np.asarray(points, dtype=np.float64)
    centroid = np.mean(pts, axis=0)
    shifted = pts - centroid

    _, _, vh = np.linalg.svd(shifted)
    normal = vh[2, :]
    norm_len = np.linalg.norm(normal)
    if norm_len < 1e-12:
        return {"success": False, "error": "Dejenere nokta bulutu (noktalar doğrusal)."}
    normal = normal / norm_len

    distances = np.dot(shifted, normal)
    flatness = float(np.max(distances) - np.min(distances))
    rms_error = float(np.sqrt(np.mean(distances ** 2)))

    return {
        "success": True,
        "feature_type": "PLANE",
        "centroid": [round(float(v), 8) for v in centroid],
        "normal": [round(float(v), 8) for v in normal],
        "d_offset": round(float(np.dot(normal, centroid)), 8),
        "flatness": round(flatness, 8),
        "rms_error": round(rms_error, 8),
        "points_count": len(pts),
        "iso_14405_type": "GG",
    }


def fit_plane_chebyshev_minimum_zone(points: np.ndarray) -> Dict[str, Any]:
    lsq = fit_plane_least_squares(points)
    if not lsq["success"]:
        return lsq

    pts = np.asarray(points, dtype=np.float64)
    centroid = np.array(lsq["centroid"], dtype=np.float64)
    best_normal = np.array(lsq["normal"], dtype=np.float64)
    min_flatness = lsq["flatness"]

    ref = np.array([1.0, 0.0, 0.0]) if abs(best_normal[0]) < 0.9 else np.array([0.0, 1.0, 0.0])
    u_axis = np.cross(best_normal, ref)
    u_axis = u_axis / np.linalg.norm(u_axis)
    v_axis = np.cross(best_normal, u_axis)
    v_axis = v_axis / np.linalg.norm(v_axis)

    step = 0.01
    for _ in range(6):
        improved = False
        for du in (-step, 0.0, step):
            for dv in (-step, 0.0, step):
                if du == 0.0 and dv == 0.0:
                    continue
                cand = best_normal + du * u_axis + dv * v_axis
                cand = cand / np.linalg.norm(cand)
                dists = np.dot(pts - centroid, cand)
                cand_flatness = float(np.max(dists) - np.min(dists))
                if cand_flatness < min_flatness:
                    min_flatness = cand_flatness
                    best_normal = cand
                    improved = True
        if not improved:
            step *= 0.25

    return {
        "success": True,
        "feature_type": "PLANE",
        "centroid": [round(float(v), 8) for v in centroid],
        "normal": [round(float(v), 8) for v in best_normal],
        "d_offset": round(float(np.dot(best_normal, centroid)), 8),
        "flatness": round(min_flatness, 8),
        "points_count": len(pts),
        "iso_14405_type": "MZ",
    }


def fit_circle_least_squares_2d(points_2d: np.ndarray) -> Dict[str, Any]:
    if len(points_2d) < 3:
        return {"success": False, "error": "Daire uydurma için en az 3 nokta gereklidir."}

    pts = np.asarray(points_2d, dtype=np.float64)
    x = pts[:, 0]
    y = pts[:, 1]

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
        "center_2d": [round(cx, 8), round(cy, 8)],
        "radius": round(radius, 8),
        "diameter": round(radius * 2.0, 8),
        "circularity": round(circularity, 8),
        "rms_error": round(rms, 8),
        "points_count": len(pts),
        "iso_14405_type": "GG",
    }


def fit_circle_chebyshev_minimum_zone_2d(points_2d: np.ndarray) -> Dict[str, Any]:
    lsq = fit_circle_least_squares_2d(points_2d)
    if not lsq["success"]:
        return lsq

    pts = np.asarray(points_2d, dtype=np.float64)
    cx, cy = lsq["center_2d"]
    best_c = np.array([cx, cy], dtype=np.float64)

    dists = np.linalg.norm(pts - best_c, axis=1)
    min_circ = float(np.max(dists) - np.min(dists))

    step = 0.05
    for _ in range(6):
        improved = False
        for dx in (-step, 0.0, step):
            for dy in (-step, 0.0, step):
                if dx == 0.0 and dy == 0.0:
                    continue
                cand_c = best_c + np.array([dx, dy])
                cand_dists = np.linalg.norm(pts - cand_c, axis=1)
                cand_circ = float(np.max(cand_dists) - np.min(cand_dists))
                if cand_circ < min_circ:
                    min_circ = cand_circ
                    best_c = cand_c
                    improved = True
        if not improved:
            step *= 0.25

    final_dists = np.linalg.norm(pts - best_c, axis=1)
    r_min = float(np.min(final_dists))
    r_max = float(np.max(final_dists))
    r_mid = (r_min + r_max) / 2.0

    return {
        "success": True,
        "feature_type": "CIRCLE",
        "center_2d": [round(float(best_c[0]), 8), round(float(best_c[1]), 8)],
        "radius": round(r_mid, 8),
        "diameter": round(r_mid * 2.0, 8),
        "circularity": round(r_max - r_min, 8),
        "points_count": len(pts),
        "iso_14405_type": "MZ",
    }


def fit_circle_maximum_inscribed_2d(points_2d: np.ndarray) -> Dict[str, Any]:
    lsq = fit_circle_least_squares_2d(points_2d)
    if not lsq["success"]:
        return lsq

    pts = np.asarray(points_2d, dtype=np.float64)
    cx, cy = lsq["center_2d"]
    best_c = np.array([cx, cy], dtype=np.float64)

    dists = np.linalg.norm(pts - best_c, axis=1)
    max_inscribed_r = float(np.min(dists))

    step = 0.05
    for _ in range(6):
        improved = False
        for dx in (-step, 0.0, step):
            for dy in (-step, 0.0, step):
                if dx == 0.0 and dy == 0.0:
                    continue
                cand_c = best_c + np.array([dx, dy])
                cand_dists = np.linalg.norm(pts - cand_c, axis=1)
                cand_min_r = float(np.min(cand_dists))
                if cand_min_r > max_inscribed_r:
                    max_inscribed_r = cand_min_r
                    best_c = cand_c
                    improved = True
        if not improved:
            step *= 0.25

    return {
        "success": True,
        "feature_type": "CIRCLE",
        "center_2d": [round(float(best_c[0]), 8), round(float(best_c[1]), 8)],
        "radius": round(max_inscribed_r, 8),
        "diameter": round(max_inscribed_r * 2.0, 8),
        "points_count": len(pts),
        "iso_14405_type": "MI",
    }


def fit_circle_minimum_circumscribed_2d(points_2d: np.ndarray) -> Dict[str, Any]:
    lsq = fit_circle_least_squares_2d(points_2d)
    if not lsq["success"]:
        return lsq

    pts = np.asarray(points_2d, dtype=np.float64)
    cx, cy = lsq["center_2d"]
    best_c = np.array([cx, cy], dtype=np.float64)

    dists = np.linalg.norm(pts - best_c, axis=1)
    min_circum_r = float(np.max(dists))

    step = 0.05
    for _ in range(6):
        improved = False
        for dx in (-step, 0.0, step):
            for dy in (-step, 0.0, step):
                if dx == 0.0 and dy == 0.0:
                    continue
                cand_c = best_c + np.array([dx, dy])
                cand_dists = np.linalg.norm(pts - cand_c, axis=1)
                cand_max_r = float(np.max(cand_dists))
                if cand_max_r < min_circum_r:
                    min_circum_r = cand_max_r
                    best_c = cand_c
                    improved = True
        if not improved:
            step *= 0.25

    return {
        "success": True,
        "feature_type": "CIRCLE",
        "center_2d": [round(float(best_c[0]), 8), round(float(best_c[1]), 8)],
        "radius": round(min_circum_r, 8),
        "diameter": round(min_circum_r * 2.0, 8),
        "points_count": len(pts),
        "iso_14405_type": "MC",
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
        _, _, vh = np.linalg.svd(shifted)
        axis = vh[0, :]
        axis = axis / (np.linalg.norm(axis) + 1e-12)

    center_3d = centroid
    radius = 1.0
    cylindricity = 0.0
    rms_error = 0.0

    for _ in range(max_iter):
        if abs(axis[0]) < 0.9:
            ref = np.array([1.0, 0.0, 0.0])
        else:
            ref = np.array([0.0, 1.0, 0.0])
        u = np.cross(axis, ref)
        u = u / np.linalg.norm(u)
        v = np.cross(axis, u)

        pts_2d = np.column_stack([np.dot(shifted, u), np.dot(shifted, v)])
        circ_fit = fit_circle_least_squares_2d(pts_2d)
        if not circ_fit["success"]:
            break

        c_u, c_v = circ_fit["center_2d"]
        radius = circ_fit["radius"]

        center_3d = centroid + c_u * u + c_v * v

        vec_to_pts = pts - center_3d
        proj_on_axis = np.dot(vec_to_pts, axis)[:, np.newaxis] * axis
        radial_vecs = vec_to_pts - proj_on_axis
        radial_dists = np.linalg.norm(radial_vecs, axis=1)

        cylindricity = float(np.max(radial_dists) - np.min(radial_dists))
        rms_error = float(np.sqrt(np.mean((radial_dists - radius) ** 2)))

        if abs(c_u) < 1e-5 and abs(c_v) < 1e-5:
            break

        centroid = center_3d
        shifted = pts - centroid

    return {
        "success": True,
        "feature_type": "CYLINDER",
        "center": [round(float(v), 8) for v in center_3d],
        "axis": [round(float(v), 8) for v in axis],
        "radius": round(float(radius), 8),
        "diameter": round(float(radius * 2.0), 8),
        "cylindricity": round(cylindricity, 8),
        "rms_error": round(rms_error, 8),
        "points_count": len(pts),
        "iso_14405_type": "GG",
    }


def fit_sphere_least_squares(points: np.ndarray) -> Dict[str, Any]:
    if len(points) < 4:
        return {"success": False, "error": "Küre uydurma için en az 4 nokta gereklidir."}

    pts = np.asarray(points, dtype=np.float64)
    x = pts[:, 0]
    y = pts[:, 1]
    z = pts[:, 2]

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
        "center": [round(cx, 8), round(cy, 8), round(cz, 8)],
        "radius": round(radius, 8),
        "diameter": round(radius * 2.0, 8),
        "sphericity": round(sphericity, 8),
        "rms_error": round(rms, 8),
        "points_count": len(pts),
    }


def evaluate_measurement_uncertainty(
    u_geo: float,
    u_probe: float,
    u_temp: float,
    u_rep: float,
    tolerance_band: float,
    measured_deviation: float,
) -> Dict[str, Any]:
    u_c = math.sqrt(u_geo**2 + u_probe**2 + u_temp**2 + u_rep**2)
    u_95 = 2.0 * u_c
    tur = tolerance_band / (2.0 * u_95) if u_95 > 1e-12 else 999.0

    half_tol = tolerance_band / 2.0
    safe_limit = half_tol - u_95

    abs_dev = abs(measured_deviation)
    if abs_dev <= safe_limit:
        decision = "PASS"
    elif abs_dev <= half_tol + u_95:
        decision = "SUSPECT"
    else:
        decision = "FAIL"

    return {
        "combined_uncertainty_uc": round(u_c, 8),
        "expanded_uncertainty_u95": round(u_95, 8),
        "test_uncertainty_ratio_tur": round(tur, 2),
        "tur_acceptable": tur >= 4.0,
        "conformance_decision": decision,
        "safe_acceptance_limit": round(safe_limit, 8),
    }


def compensate_probe_radius(
    points: np.ndarray,
    approach_normals: np.ndarray,
    effective_tip_radius: float,
    polarity: str = "INTERNAL_BORE",
) -> np.ndarray:
    pts = np.asarray(points, dtype=np.float64)
    norms = np.asarray(approach_normals, dtype=np.float64)
    if len(pts) == 0:
        return pts
    norm_lens = np.linalg.norm(norms, axis=1, keepdims=True)
    norm_lens = np.where(norm_lens < 1e-12, 1.0, norm_lens)
    unit_norms = norms / norm_lens
    return pts - effective_tip_radius * unit_norms


def compensate_cylinder_diameter(
    center_fit_diameter: float,
    effective_tip_radius: float,
    polarity: str = "INTERNAL_BORE",
) -> float:
    if polarity.upper() in ("INTERNAL_BORE", "INTERNAL_CYLINDER", "HOLE", "BORE"):
        return float(center_fit_diameter + 2.0 * effective_tip_radius)
    return float(max(0.0, center_fit_diameter - 2.0 * effective_tip_radius))
