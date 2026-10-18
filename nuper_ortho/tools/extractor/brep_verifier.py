import math
import os
import re
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple


def _canon_vec(v: Tuple[float, float, float]) -> Tuple[float, float, float]:
    for x in v:
        if abs(x) > 1e-6:
            return tuple(-y for y in v) if x < 0 else v
    return v


def _dot(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def parse_step_file(step_path: str) -> Dict[str, Any]:
    if not os.path.exists(step_path):
        return {"success": False, "error": f"STEP dosyası bulunamadı: {step_path}"}

    with open(step_path, "r", encoding="latin-1", errors="ignore") as f:
        content = f.read()

    points: Dict[str, Tuple[float, float, float]] = {}
    for m in re.finditer(
        r"#(\d+)\s*=\s*CARTESIAN_POINT\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*\(\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)\s*\)",
        content,
    ):
        points[m.group(1)] = (float(m.group(2)), float(m.group(3)), float(m.group(4)))

    directions: Dict[str, Tuple[float, float, float]] = {}
    for m in re.finditer(
        r"#(\d+)\s*=\s*DIRECTION\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*\(\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)\s*\)",
        content,
    ):
        directions[m.group(1)] = (float(m.group(2)), float(m.group(3)), float(m.group(4)))

    axis_placements: Dict[str, Dict[str, Any]] = {}
    for m in re.finditer(
        r"#(\d+)\s*=\s*AXIS2_PLACEMENT_3D\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*#(\d+)\s*(?:,\s*#(\d+))?\s*\)",
        content,
    ):
        pt_id, axis_id = m.group(2), m.group(3)
        axis_placements[m.group(1)] = {
            "origin": points.get(pt_id, (0.0, 0.0, 0.0)),
            "axis": directions.get(axis_id, (0.0, 0.0, 1.0)),
        }

    face_surface_ids = set()
    for m in re.finditer(r"#\d+\s*=\s*ADVANCED_FACE\s*\([^;]*#(\d+)\s*\)\s*;", content):
        face_surface_ids.add(m.group(1))

    cylinders: List[Dict[str, Any]] = []
    for m in re.finditer(
        r"#(\d+)\s*=\s*CYLINDRICAL_SURFACE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*([-\d.eE+]+)\s*\)",
        content,
    ):
        c_id = m.group(1)
        axis_id = m.group(2)
        radius = float(m.group(3))
        diameter = round(radius * 2.0, 4)
        placement = axis_placements.get(axis_id, {"origin": (0.0, 0.0, 0.0), "axis": (0.0, 0.0, 1.0)})
        origin = placement["origin"]
        raw_axis = placement["axis"]
        c_axis = _canon_vec(raw_axis)

        cylinders.append({
            "id": c_id,
            "radius": round(radius, 4),
            "diameter": diameter,
            "center": origin,
            "axis": raw_axis,
            "canon_axis": c_axis,
            "is_face": (c_id in face_surface_ids) if face_surface_ids else True,
        })

    planes_by_normal: Dict[Tuple[float, float, float], List[float]] = defaultdict(list)
    planes: List[Dict[str, Any]] = []
    for m in re.finditer(
        r"#(\d+)\s*=\s*PLANE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*\)",
        content,
    ):
        p_id = m.group(1)
        axis_id = m.group(2)
        placement = axis_placements.get(axis_id, {"origin": (0.0, 0.0, 0.0), "axis": (0.0, 0.0, 1.0)})
        origin = placement["origin"]
        raw_axis = placement["axis"]
        c_axis = _canon_vec(raw_axis)
        offset = round(_dot(origin, c_axis), 4)

        planes.append({
            "id": p_id,
            "origin": origin,
            "axis": raw_axis,
            "canon_axis": c_axis,
            "offset": offset,
            "is_face": (p_id in face_surface_ids) if face_surface_ids else True,
        })
        planes_by_normal[tuple(round(v, 3) for v in c_axis)].append(offset)

    cones: List[Dict[str, Any]] = []
    for m in re.finditer(
        r"#(\d+)\s*=\s*CONICAL_SURFACE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)",
        content,
    ):
        c_id = m.group(1)
        axis_id = m.group(2)
        r_val = float(m.group(3))
        angle_rad = float(m.group(4))
        angle_deg = round(math.degrees(angle_rad) if angle_rad < 6.28 else angle_rad, 3)
        placement = axis_placements.get(axis_id, {"origin": (0.0, 0.0, 0.0), "axis": (0.0, 0.0, 1.0)})

        cones.append({
            "id": c_id,
            "radius": round(r_val, 4),
            "angle_deg": angle_deg,
            "placement": placement,
            "is_face": (c_id in face_surface_ids) if face_surface_ids else True,
        })

    toroids: List[Dict[str, Any]] = []
    for m in re.finditer(
        r"#(\d+)\s*=\s*TOROIDAL_SURFACE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)",
        content,
    ):
        t_id = m.group(1)
        axis_id = m.group(2)
        major_r = float(m.group(3))
        minor_r = float(m.group(4))
        placement = axis_placements.get(axis_id, {"origin": (0.0, 0.0, 0.0), "axis": (0.0, 0.0, 1.0)})

        toroids.append({
            "id": t_id,
            "major_radius": round(major_r, 4),
            "minor_radius": round(minor_r, 4),
            "placement": placement,
            "is_face": (t_id in face_surface_ids) if face_surface_ids else True,
        })

    circles: List[Dict[str, Any]] = []
    for m in re.finditer(
        r"#(\d+)\s*=\s*CIRCLE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*([-\d.eE+]+)\s*\)",
        content,
    ):
        circ_id = m.group(1)
        axis_id = m.group(2)
        r_val = float(m.group(3))
        placement = axis_placements.get(axis_id, {"origin": (0.0, 0.0, 0.0), "axis": (0.0, 0.0, 1.0)})
        circles.append({
            "id": circ_id,
            "radius": round(r_val, 4),
            "diameter": round(r_val * 2.0, 4),
            "center": placement["origin"],
            "axis": placement["axis"],
        })

    bbox = {"min": [0.0, 0.0, 0.0], "max": [0.0, 0.0, 0.0], "size": [0.0, 0.0, 0.0]}
    linear_distances: List[Dict[str, Any]] = []
    rotational_diameters: List[float] = []

    if points:
        xs = [p[0] for p in points.values()]
        ys = [p[1] for p in points.values()]
        zs = [p[2] for p in points.values()]
        size_x = round(max(xs) - min(xs), 4)
        size_y = round(max(ys) - min(ys), 4)
        size_z = round(max(zs) - min(zs), 4)
        bbox = {
            "min": [round(min(xs), 3), round(min(ys), 3), round(min(zs), 3)],
            "max": [round(max(xs), 3), round(max(ys), 3), round(max(zs), 3)],
            "size": [size_x, size_y, size_z],
        }
        for axis_name, sz in [("X", size_x), ("Y", size_y), ("Z", size_z)]:
            linear_distances.append({
                "value": sz,
                "type": "BBOX_SPAN",
                "axis": axis_name,
            })
            rotational_diameters.append(sz)

    for n_vec, offs in planes_by_normal.items():
        uniq_offs = sorted(set(offs))
        for i in range(len(uniq_offs)):
            for j in range(i + 1, len(uniq_offs)):
                dist = round(abs(uniq_offs[j] - uniq_offs[i]), 4)
                if dist > 0.001:
                    linear_distances.append({
                        "value": dist,
                        "type": "PLANE_PAIR",
                        "normal": n_vec,
                        "offset1": uniq_offs[i],
                        "offset2": uniq_offs[j],
                    })

    for c in cylinders:
        c_origin = c["center"]
        c_axis = c["canon_axis"]
        for p in planes:
            p_axis = p["canon_axis"]
            dot_axes = abs(_dot(c_axis, p_axis))
            if dot_axes < 0.05:
                dist = round(abs(_dot(c_origin, p_axis) - p["offset"]), 4)
                if dist > 0.001:
                    linear_distances.append({
                        "value": dist,
                        "type": "CYLINDER_AXIS_TO_PLANE",
                        "cylinder_id": c["id"],
                        "plane_id": p["id"],
                    })

    axial_stations: Dict[Tuple[float, float, float], List[float]] = defaultdict(list)
    for p in planes:
        n = tuple(round(v, 3) for v in p["canon_axis"])
        axial_stations[n].append(p["offset"])

    for circ in circles:
        c_origin = circ["center"]
        c_norm = _canon_vec(circ["axis"])
        key = tuple(round(v, 3) for v in c_norm)
        axial_stations[key].append(round(_dot(c_origin, c_norm), 4))

    for cone in cones:
        c_origin = cone["placement"]["origin"]
        c_norm = _canon_vec(cone["placement"]["axis"])
        key = tuple(round(v, 3) for v in c_norm)
        axial_stations[key].append(round(_dot(c_origin, c_norm), 4))

    for norm_vec, st_list in axial_stations.items():
        uniq_st = sorted(set(st_list))
        for i in range(len(uniq_st)):
            for j in range(i + 1, len(uniq_st)):
                d_val = round(abs(uniq_st[j] - uniq_st[i]), 4)
                if d_val > 0.001:
                    linear_distances.append({
                        "value": d_val,
                        "type": "AXIAL_STATION_DISTANCE",
                        "axis": norm_vec,
                    })

    return {
        "success": True,
        "filename": os.path.basename(step_path),
        "bbox": bbox,
        "cylinders": cylinders,
        "planes": planes,
        "cones": cones,
        "toroids": toroids,
        "circles": circles,
        "linear_distances": linear_distances,
        "rotational_diameters": rotational_diameters,
        "total_points": len(points),
        "total_cylinders": len(cylinders),
        "total_planes": len(planes),
        "total_cones": len(cones),
    }


def verify_dimensions_against_step(
    dimensions: List[Dict[str, Any]],
    step_data: Dict[str, Any],
    tol_linear: float = 0.15,
    tol_dia: float = 0.08,
    tol_angle: float = 0.5,
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    if not step_data.get("success"):
        return dimensions, []

    step_cylinders = step_data.get("cylinders", [])
    step_planes = step_data.get("planes", [])
    step_cones = step_data.get("cones", [])
    step_toroids = step_data.get("toroids", [])
    step_circles = step_data.get("circles", [])
    step_linear = step_data.get("linear_distances", [])
    step_rot_dia = step_data.get("rotational_diameters", [])
    step_bbox_sizes = step_data.get("bbox", {}).get("size", [0.0, 0.0, 0.0])
    max_box = max(step_bbox_sizes) if step_bbox_sizes else 0.0

    verified_dimensions = []
    pruned_dimensions = []

    for dim in dimensions:
        d_type = str(dim.get("type", "LINEAR")).upper()
        nom = float(dim.get("nominal", 0.0))
        dim_str = str(dim.get("nominal_str", "")).lower()

        if any(bad in dim_str for bad in ["crni", "din", "iso", "astm", "unf", "unc", "malzeme", "notlar"]):
            pruned_dimensions.append({
                "dimension": dim,
                "reason": "3D B-Rep Geometrisi Yok (Malzeme / Standart Kodu İptal Edildi)",
            })
            continue

        if nom > max_box + 2.0 and max_box > 0.0:
            pruned_dimensions.append({
                "dimension": dim,
                "reason": f"Ölçü ({nom} mm), STEP sınır kutusundan ({max_box} mm) büyük.",
            })
            continue

        matched_feature: Optional[Dict[str, Any]] = None

        if d_type in ("DIAMETER", "HOLE", "THREAD") or "ø" in dim_str:
            for c in step_cylinders:
                if abs(c["diameter"] - nom) <= tol_dia:
                    matched_feature = {"type": "CYLINDER", "diameter": c["diameter"], "id": c["id"]}
                    break
            if not matched_feature:
                for circ in step_circles:
                    if abs(circ["diameter"] - nom) <= tol_dia:
                        matched_feature = {"type": "CIRCLE_EDGE", "diameter": circ["diameter"], "id": circ["id"]}
                        break
            if not matched_feature and d_type == "DIAMETER":
                for cone in step_cones:
                    cone_d = cone["radius"] * 2.0
                    if abs(cone_d - nom) <= tol_dia:
                        matched_feature = {"type": "CONE_BASE", "diameter": cone_d, "id": cone["id"]}
                        break
                if not matched_feature:
                    for rd in step_rot_dia:
                        if abs(rd - nom) <= tol_dia:
                            matched_feature = {"type": "ROTATIONAL_PROFILE_DIAMETER", "diameter": rd}
                            break

        if not matched_feature and (d_type == "RADIUS" or "r" in dim_str):
            for t in step_toroids:
                if abs(t["minor_radius"] - nom) <= tol_dia:
                    matched_feature = {"type": "TOROID_FILLET", "radius": t["minor_radius"], "id": t["id"]}
                    break
            if not matched_feature:
                for c in step_cylinders:
                    if abs(c["radius"] - nom) <= tol_dia:
                        matched_feature = {"type": "CYLINDER_RADIUS", "radius": c["radius"], "id": c["id"]}
                        break
            if not matched_feature:
                for circ in step_circles:
                    if abs(circ["radius"] - nom) <= tol_dia:
                        matched_feature = {"type": "CIRCLE_RADIUS", "radius": circ["radius"], "id": circ["id"]}
                        break

        if not matched_feature and d_type == "CHAMFER":
            for cone in step_cones:
                if abs(cone["angle_deg"] - 45.0) <= tol_angle or abs(cone["angle_deg"] - 90.0) <= tol_angle:
                    matched_feature = {"type": "CHAMFER_CONE", "angle": cone["angle_deg"], "id": cone["id"]}
                    break
            if not matched_feature:
                for ld in step_linear:
                    if abs(ld["value"] - nom) <= tol_linear:
                        matched_feature = {"type": "CHAMFER_SPAN", "value": ld["value"]}
                        break

        if not matched_feature and d_type in ("LINEAR", "THREAD", "CUSTOM"):
            for ld in step_linear:
                if abs(ld["value"] - nom) <= tol_linear:
                    matched_feature = {"type": ld["type"], "matched_value": ld["value"]}
                    break

        if matched_feature:
            dim["verification"] = "CAD_VERIFIED"
            dim["status"] = "UNMEASURED"
            dim["cad_match"] = matched_feature
            verified_dimensions.append(dim)
        else:
            dim["verification"] = "PARSED"
            dim["status"] = "UNMEASURED"
            dim["cad_match"] = None
            verified_dimensions.append(dim)

    return verified_dimensions, pruned_dimensions
