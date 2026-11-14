import base64
import math
import os
import re
import struct
import sys
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

try:
    from tools.extractor.pmi_extractor import extract_pmi_schema_payload
except ImportError:
    try:
        from pmi_extractor import extract_pmi_schema_payload
    except ImportError:
        extract_pmi_schema_payload = None

try:
    from OCP.STEPControl import STEPControl_Reader
    from OCP.IFSelect import IFSelect_ReturnStatus
    from OCP.BRepMesh import BRepMesh_IncrementalMesh
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopAbs import TopAbs_FACE, TopAbs_EDGE, TopAbs_REVERSED
    from OCP.TopoDS import TopoDS
    from OCP.BRep import BRep_Tool
    from OCP.BRepTools import BRepTools
    from OCP.TopLoc import TopLoc_Location
    from OCP.BRepAdaptor import BRepAdaptor_Surface, BRepAdaptor_Curve
    from OCP.GeomAbs import (
        GeomAbs_Plane,
        GeomAbs_Cylinder,
        GeomAbs_Cone,
        GeomAbs_Sphere,
        GeomAbs_Torus,
        GeomAbs_BezierSurface,
        GeomAbs_BSplineSurface,
        GeomAbs_SurfaceOfRevolution,
        GeomAbs_SurfaceOfExtrusion,
        GeomAbs_OffsetSurface,
        GeomAbs_OtherSurface,
    )
    from OCP.Bnd import Bnd_Box
    from OCP.BRepBndLib import BRepBndLib
    from OCP.GProp import GProp_GProps
    from OCP.BRepGProp import BRepGProp
    from OCP.GCPnts import GCPnts_QuasiUniformDeflection
    OCP_AVAILABLE = True
except ImportError:
    OCP_AVAILABLE = False


HOLE_MIN_SPAN_RAD = math.radians(330.0)
BOSS_MIN_SPAN_RAD = math.radians(180.0)


def _canon_vec(v: Tuple[float, float, float]) -> Tuple[float, float, float]:
    for x in v:
        if abs(x) > 1e-6:
            return tuple(-y for y in v) if x < 0 else v
    return v


def _dot(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def _cross(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> Tuple[float, float, float]:
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def _norm_vec(v: Tuple[float, float, float]) -> Tuple[float, float, float]:
    length = math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
    if length < 1e-12:
        return (0.0, 1.0, 0.0)
    return (v[0] / length, v[1] / length, v[2] / length)


def _apply_rot(
    v: Tuple[float, float, float],
    ex: Tuple[float, float, float],
    ey: Tuple[float, float, float],
    ez: Tuple[float, float, float],
) -> Tuple[float, float, float]:
    return (
        v[0] * ex[0] + v[1] * ex[1] + v[2] * ex[2],
        v[0] * ey[0] + v[1] * ey[1] + v[2] * ey[2],
        v[0] * ez[0] + v[1] * ez[1] + v[2] * ez[2],
    )


def extract_cad_metadata_ocp(step_path: str) -> Dict[str, Any]:
    if not OCP_AVAILABLE:
        return {"success": False, "error": "OpenCASCADE (OCP) modülü mevcut değil."}

    reader = STEPControl_Reader()
    status = reader.ReadFile(step_path)
    tmp_step_path: Optional[str] = None
    if status != IFSelect_ReturnStatus.IFSelect_RetDone:
        import shutil
        import tempfile
        try:
            fd, tmp_step_path = tempfile.mkstemp(suffix=".stp", prefix="nuper_ocp_")
            os.close(fd)
            shutil.copyfile(step_path, tmp_step_path)
            reader = STEPControl_Reader()
            status = reader.ReadFile(tmp_step_path)
        except Exception:
            pass
    try:
        if status != IFSelect_ReturnStatus.IFSelect_RetDone:
            return {"success": False, "error": f"STEP dosyası OpenCASCADE ile okunamadı: {step_path}"}
    finally:
        if tmp_step_path and os.path.exists(tmp_step_path):
            try:
                os.remove(tmp_step_path)
            except Exception:
                pass

    reader.TransferRoots()
    shape = reader.OneShape()
    if shape.IsNull():
        return {"success": False, "error": "STEP gövdesi boş veya geçerli bir katı içermiyor."}

    bbox_obj = Bnd_Box()
    BRepBndLib.AddOptimal_s(shape, bbox_obj, False, False)
    if bbox_obj.IsVoid():
        return {"success": False, "error": "STEP geometrisi için sınır kutusu hesaplanamadı."}

    min_x, min_y, min_z = bbox_obj.GetXMin(), bbox_obj.GetYMin(), bbox_obj.GetZMin()
    max_x, max_y, max_z = bbox_obj.GetXMax(), bbox_obj.GetYMax(), bbox_obj.GetZMax()
    size_x = max(0.0, max_x - min_x)
    size_y = max(0.0, max_y - min_y)
    size_z = max(0.0, max_z - min_z)
    solid_centroid = [(min_x + max_x) / 2.0, (min_y + max_y) / 2.0, (min_z + max_z) / 2.0]

    max_span = max(size_x, size_y, size_z, 1.0)
    linear_deflection = max(0.01, min(0.08, max_span * 0.001))
    angular_deflection = 0.25
    BRepMesh_IncrementalMesh(shape, linear_deflection, False, angular_deflection, True)

    surface_type_names = {
        GeomAbs_Plane: "PLANE",
        GeomAbs_Cylinder: "CYLINDER",
        GeomAbs_Cone: "CONE",
        GeomAbs_Sphere: "SPHERE",
        GeomAbs_Torus: "TORUS",
        GeomAbs_BezierSurface: "BEZIER",
        GeomAbs_BSplineSurface: "BSPLINE",
        GeomAbs_SurfaceOfRevolution: "REVOLUTION",
        GeomAbs_SurfaceOfExtrusion: "EXTRUSION",
        GeomAbs_OffsetSurface: "OFFSET",
        GeomAbs_OtherSurface: "OTHER",
    }

    all_positions: List[float] = []
    all_normals: List[float] = []
    all_indices: List[int] = []
    mesh_faces: List[Dict[str, Any]] = []
    extracted_features: List[Dict[str, Any]] = []

    face_exp = TopExp_Explorer(shape, TopAbs_FACE)
    face_idx = 0
    current_vert_offset = 0

    cylinder_groups: Dict[Tuple[float, Tuple[float, float, float], Tuple[float, float, float], str], Dict[str, Any]] = {}

    while face_exp.More():
        face_idx += 1
        face = TopoDS.Face(face_exp.Current())
        face_id = f"FACE_{face_idx}"
        is_rev = face.Orientation() == TopAbs_REVERSED

        adaptor = BRepAdaptor_Surface(face, True)
        stype_enum = adaptor.GetType()
        stype_name = surface_type_names.get(stype_enum, "OTHER")

        props = GProp_GProps()
        BRepGProp.SurfaceProperties_s(face, props)
        area = props.Mass()
        cm = props.CentreOfMass()
        center_vec = [round(cm.X(), 4), round(cm.Y(), 4), round(cm.Z(), 4)]

        loc = TopLoc_Location()
        tri = BRep_Tool.Triangulation_s(face, loc)
        tri_start = len(all_indices) // 3
        tri_count = 0

        if tri is not None:
            trsf = loc.Transformation()
            nb_nodes = tri.NbNodes()
            nb_triangles = tri.NbTriangles()
            tri_count = nb_triangles

            if not tri.HasNormals():
                tri.ComputeNormals()

            for n_i in range(1, nb_nodes + 1):
                pnt = tri.Node(n_i).Transformed(trsf)
                all_positions.extend([round(pnt.X(), 4), round(pnt.Y(), 4), round(pnt.Z(), 4)])

                norm = tri.Normal(n_i)
                sign = -1.0 if is_rev else 1.0
                all_normals.extend([round(norm.X() * sign, 4), round(norm.Y() * sign, 4), round(norm.Z() * sign, 4)])

            for t_i in range(1, nb_triangles + 1):
                i1, i2, i3 = tri.Triangle(t_i).Get()
                idx1 = current_vert_offset + (i1 - 1)
                idx2 = current_vert_offset + (i2 - 1)
                idx3 = current_vert_offset + (i3 - 1)
                if is_rev:
                    all_indices.extend([idx1, idx3, idx2])
                else:
                    all_indices.extend([idx1, idx2, idx3])

            current_vert_offset += nb_nodes

        mesh_faces.append({
            "id": face_id,
            "surface_type": stype_name,
            "triangle_start": tri_start,
            "triangle_count": tri_count,
            "area": round(area, 4),
        })

        if stype_enum == GeomAbs_Plane:
            pln = adaptor.Plane()
            d = pln.Axis().Direction()
            sign = -1.0 if is_rev else 1.0
            normal = [round(d.X() * sign, 4), round(d.Y() * sign, 4), round(d.Z() * sign, 4)]
            to_face = [center_vec[0] - solid_centroid[0], center_vec[1] - solid_centroid[1], center_vec[2] - solid_centroid[2]]
            dot_out = to_face[0] * normal[0] + to_face[1] * normal[1] + to_face[2] * normal[2]
            if dot_out < -1e-3 and (abs(to_face[0]) > 0.5 or abs(to_face[1]) > 0.5 or abs(to_face[2]) > 0.5):
                normal = [-normal[0], -normal[1], -normal[2]]
            extracted_features.append({
                "id": f"CAD_PLANE_{face_idx}",
                "feature_type": "PLANE",
                "center": center_vec,
                "normal": normal,
                "area_or_length": round(area, 4),
                "face_ids": [face_id],
                "description": f"Düzlem Yüzey (Alan: {area:.1f} mm²)",
            })
        elif stype_enum == GeomAbs_Cylinder:
            cyl = adaptor.Cylinder()
            radius = cyl.Radius()
            diameter = round(radius * 2.0, 4)
            axis_dir = cyl.Axis().Direction()
            ax_x, ax_y, ax_z = axis_dir.X(), axis_dir.Y(), axis_dir.Z()
            if ax_z < -1e-6 or (abs(ax_z) <= 1e-6 and ax_y < -1e-6) or (abs(ax_z) <= 1e-6 and abs(ax_y) <= 1e-6 and ax_x < 0):
                canon_axis = (-ax_x, -ax_y, -ax_z)
            else:
                canon_axis = (ax_x, ax_y, ax_z)
            canon_axis_r = (round(canon_axis[0], 3), round(canon_axis[1], 3), round(canon_axis[2], 3))

            ftype = "INTERNAL_CYLINDER" if is_rev else "EXTERNAL_CYLINDER"
            loc_pnt = cyl.Location()
            axis_pnt = (loc_pnt.X(), loc_pnt.Y(), loc_pnt.Z())
            rad_vec = (center_vec[0] - axis_pnt[0], center_vec[1] - axis_pnt[1], center_vec[2] - axis_pnt[2])
            proj_r = rad_vec[0] * canon_axis[0] + rad_vec[1] * canon_axis[1] + rad_vec[2] * canon_axis[2]
            rad_ortho = (rad_vec[0] - proj_r * canon_axis[0], rad_vec[1] - proj_r * canon_axis[1], rad_vec[2] - proj_r * canon_axis[2])
            rad_len = math.hypot(rad_ortho[0], rad_ortho[1], rad_ortho[2])
            if rad_len > 1e-4 and tri is not None and len(all_normals) >= 3:
                norm_sample = (all_normals[-3], all_normals[-2], all_normals[-1])
                normal_dot_rad = (norm_sample[0] * rad_ortho[0] + norm_sample[1] * rad_ortho[1] + norm_sample[2] * rad_ortho[2]) / rad_len
                if abs(normal_dot_rad) >= 0.15:
                    ftype = "INTERNAL_CYLINDER" if normal_dot_rad < 0.0 else "EXTERNAL_CYLINDER"
            c_polarity = "INTERNAL_BORE" if ftype == "INTERNAL_CYLINDER" else "EXTERNAL_BOSS"
            proj_dist = loc_pnt.X() * canon_axis[0] + loc_pnt.Y() * canon_axis[1] + loc_pnt.Z() * canon_axis[2]
            ortho_vec = (
                round(loc_pnt.X() - proj_dist * canon_axis[0], 2),
                round(loc_pnt.Y() - proj_dist * canon_axis[1], 2),
                round(loc_pnt.Z() - proj_dist * canon_axis[2], 2),
            )
            u_min, u_max, _v_min, _v_max = BRepTools.UVBounds_s(face)
            face_span = u_max - u_min
            proj_min_f = float("inf")
            proj_max_f = float("-inf")
            if tri is not None:
                trsf_cyl = loc.Transformation()
                for n_i in range(1, tri.NbNodes() + 1):
                    pnt_cyl = tri.Node(n_i).Transformed(trsf_cyl)
                    t_val = (
                        (pnt_cyl.X() - loc_pnt.X()) * canon_axis[0]
                        + (pnt_cyl.Y() - loc_pnt.Y()) * canon_axis[1]
                        + (pnt_cyl.Z() - loc_pnt.Z()) * canon_axis[2]
                    )
                    if t_val < proj_min_f:
                        proj_min_f = t_val
                    if t_val > proj_max_f:
                        proj_max_f = t_val

            grp_key = (round(diameter, 3), canon_axis_r, ortho_vec, ftype)
            if grp_key not in cylinder_groups:
                cylinder_groups[grp_key] = {
                    "diameter": diameter,
                    "radius": radius,
                    "feature_type": ftype,
                    "axis": [round(canon_axis[0], 4), round(canon_axis[1], 4), round(canon_axis[2], 4)],
                    "axis_origin": (loc_pnt.X(), loc_pnt.Y(), loc_pnt.Z()),
                    "centers": [center_vec],
                    "total_area": area,
                    "total_span": face_span,
                    "proj_min": proj_min_f,
                    "proj_max": proj_max_f,
                    "face_ids": [face_id],
                }
            else:
                grp_ref = cylinder_groups[grp_key]
                grp_ref["centers"].append(center_vec)
                grp_ref["total_area"] += area
                grp_ref["total_span"] += face_span
                o_ref = grp_ref["axis_origin"]
                origin_shift = (
                    (loc_pnt.X() - o_ref[0]) * canon_axis[0]
                    + (loc_pnt.Y() - o_ref[1]) * canon_axis[1]
                    + (loc_pnt.Z() - o_ref[2]) * canon_axis[2]
                )
                if proj_min_f + origin_shift < grp_ref["proj_min"]:
                    grp_ref["proj_min"] = proj_min_f + origin_shift
                if proj_max_f + origin_shift > grp_ref["proj_max"]:
                    grp_ref["proj_max"] = proj_max_f + origin_shift
                grp_ref["face_ids"].append(face_id)

        elif stype_enum == GeomAbs_Cone:
            cone = adaptor.Cone()
            radius = cone.RefRadius()
            axis_dir = cone.Axis().Direction()
            ax_pnt = cone.Axis().Location()
            angle_deg = round(math.degrees(abs(cone.SemiAngle())), 2)
            comp_angle_deg = round(90.0 - angle_deg, 2)
            max_cone_r = radius
            h_min_c = float("inf")
            h_max_c = float("-inf")
            if tri is not None:
                trsf_c = loc.Transformation()
                for n_i in range(1, tri.NbNodes() + 1):
                    pnt_c = tri.Node(n_i).Transformed(trsf_c)
                    dx_c = pnt_c.X() - ax_pnt.X()
                    dy_c = pnt_c.Y() - ax_pnt.Y()
                    dz_c = pnt_c.Z() - ax_pnt.Z()
                    h_c = dx_c * axis_dir.X() + dy_c * axis_dir.Y() + dz_c * axis_dir.Z()
                    if h_c < h_min_c:
                        h_min_c = h_c
                    if h_c > h_max_c:
                        h_max_c = h_c
                    rx_c = dx_c - h_c * axis_dir.X()
                    ry_c = dy_c - h_c * axis_dir.Y()
                    rz_c = dz_c - h_c * axis_dir.Z()
                    r_c = math.sqrt(rx_c * rx_c + ry_c * ry_c + rz_c * rz_c)
                    if r_c > max_cone_r:
                        max_cone_r = r_c
            cone_dia = round(max_cone_r * 2.0, 4)
            cone_span = round(max(0.0, h_max_c - h_min_c), 2) if h_max_c > h_min_c else 0.0
            norm_c = [round(axis_dir.X(), 4), round(axis_dir.Y(), 4), round(axis_dir.Z(), 4)]
            extracted_features.append({
                "id": f"CAD_CONE_{face_idx}",
                "feature_type": "CONE",
                "nominal_dimension": cone_dia,
                "center": center_vec,
                "normal": norm_c,
                "area_or_length": angle_deg,
                "face_ids": [face_id],
                "description": f"Konik Yüzey (Açı: {angle_deg}° / {comp_angle_deg}°, Ø{cone_dia:.2f})",
            })
            if comp_angle_deg > 0.5 and abs(comp_angle_deg - angle_deg) > 0.1:
                extracted_features.append({
                    "id": f"CAD_CONE_ANGLE_{face_idx}",
                    "feature_type": "CONE",
                    "nominal_dimension": comp_angle_deg,
                    "center": center_vec,
                    "normal": norm_c,
                    "area_or_length": angle_deg,
                    "face_ids": [face_id],
                    "description": f"Konik Eğim Açısı ({comp_angle_deg}°)",
                })
            if abs(angle_deg - 45.0) <= 1.0 and cone_span >= 0.2:
                extracted_features.append({
                    "id": f"CAD_CHAMFER_{face_idx}",
                    "feature_type": "CONE",
                    "nominal_dimension": cone_span,
                    "center": center_vec,
                    "normal": norm_c,
                    "area_or_length": 45.0,
                    "face_ids": [face_id],
                    "description": f"Pah Yüzeyi ({cone_span:.1f}x45°)",
                })
        elif stype_enum == GeomAbs_Sphere:
            sphere = adaptor.Sphere()
            r = sphere.Radius()
            extracted_features.append({
                "id": f"CAD_SPHERE_{face_idx}",
                "feature_type": "SPHERE",
                "nominal_dimension": round(r * 2.0, 4),
                "center": center_vec,
                "area_or_length": round(area, 4),
                "face_ids": [face_id],
                "description": f"Küre (Ø{r*2:.2f})",
            })
        elif stype_enum == GeomAbs_Torus:
            torus = adaptor.Torus()
            min_r = torus.MinorRadius()
            maj_r = torus.MajorRadius()
            extracted_features.append({
                "id": f"CAD_TORUS_{face_idx}",
                "feature_type": "TORUS",
                "nominal_dimension": round(min_r * 2.0, 4),
                "center": center_vec,
                "area_or_length": round(maj_r, 4),
                "face_ids": [face_id],
                "description": f"Toroid/Radyüs (R={min_r:.2f}, R_maj={maj_r:.2f})",
            })
        else:
            extracted_features.append({
                "id": f"CAD_FREEFORM_{face_idx}",
                "feature_type": "FREEFORM",
                "center": center_vec,
                "area_or_length": round(area, 4),
                "face_ids": [face_id],
                "description": f"Serbest Yüzey ({stype_name})",
            })

        face_exp.Next()

    cyl_idx = 1
    for grp in cylinder_groups.values():
        is_int = grp["feature_type"] == "INTERNAL_CYLINDER"
        min_span = HOLE_MIN_SPAN_RAD if is_int else BOSS_MIN_SPAN_RAD
        if grp["total_span"] < min_span:
            continue
        c_list = grp["centers"]
        mean_x = sum(c[0] for c in c_list) / len(c_list)
        mean_y = sum(c[1] for c in c_list) / len(c_list)
        mean_z = sum(c[2] for c in c_list) / len(c_list)
        o = grp["axis_origin"]
        a = grp["axis"]
        if math.isfinite(grp["proj_min"]) and math.isfinite(grp["proj_max"]) and grp["proj_max"] >= grp["proj_min"]:
            t = (grp["proj_min"] + grp["proj_max"]) / 2.0
            p_start = [o[i] + grp["proj_min"] * a[i] for i in range(3)]
            p_end = [o[i] + grp["proj_max"] * a[i] for i in range(3)]
            axial_axis = 1 if abs(a[1]) >= abs(a[2]) and abs(a[1]) >= abs(a[0]) else (2 if abs(a[2]) >= abs(a[0]) else 0)
            ax_min = min(p_start[axial_axis], p_end[axial_axis])
            ax_max = max(p_start[axial_axis], p_end[axial_axis])
        else:
            t = (mean_x - o[0]) * a[0] + (mean_y - o[1]) * a[1] + (mean_z - o[2]) * a[2]
            ax_min = avg_y if abs(a[1]) >= abs(a[2]) else avg_z
            ax_max = ax_min
        avg_x = o[0] + t * a[0]
        avg_y = o[1] + t * a[1]
        avg_z = o[2] + t * a[2]
        axial_min_bound = min_y if axial_axis == 1 else (min_z if axial_axis == 2 else min_x)
        is_blind = is_int and (ax_min > axial_min_bound + 0.8)
        floor_z = ax_min if is_blind else None
        label = "Delik" if is_int else "Mil / Silindir"
        feat_id = f"CAD_{'HOLE' if is_int else 'CYL'}_Ø{grp['diameter']:.2f}_{cyl_idx}"
        extracted_features.append({
            "id": feat_id,
            "feature_type": grp["feature_type"],
            "cylinder_polarity": "INTERNAL_BORE" if is_int else "EXTERNAL_BOSS",
            "nominal_dimension": grp["diameter"],
            "center": [round(avg_x, 4), round(avg_y, 4), round(avg_z, 4)],
            "normal": grp["axis"],
            "area_or_length": round(grp["total_area"], 4),
            "axial_min": round(ax_min, 4),
            "axial_max": round(ax_max, 4),
            "z_top": round(ax_max, 4),
            "z_bottom": round(ax_min, 4),
            "is_blind": is_blind,
            "floor_z": round(floor_z, 4) if floor_z is not None else None,
            "face_ids": grp["face_ids"],
            "description": f"{label} Ø{grp['diameter']:.2f} mm ({len(grp['face_ids'])} yüzey parçası)",
        })
        cyl_idx += 1

    edge_exp = TopExp_Explorer(shape, TopAbs_EDGE)
    all_edge_segments: List[float] = []

    while edge_exp.More():
        edge = TopoDS.Edge(edge_exp.Current())
        curve = BRepAdaptor_Curve(edge)
        discr = GCPnts_QuasiUniformDeflection(curve, linear_deflection * 1.5)
        if discr.IsDone():
            nb_pts = discr.NbPoints()
            for p_i in range(1, nb_pts):
                pA = discr.Value(p_i)
                pB = discr.Value(p_i + 1)
                all_edge_segments.extend([
                    round(pA.X(), 4), round(pA.Y(), 4), round(pA.Z(), 4),
                    round(pB.X(), 4), round(pB.Y(), 4), round(pB.Z(), 4)
                ])
        edge_exp.Next()

    planes = [
        f for f in extracted_features
        if f.get("feature_type") == "PLANE" and f.get("normal") and f.get("area_or_length", 0) > 0
    ]
    planes.sort(key=lambda p: p.get("area_or_length", 0), reverse=True)

    ex: Tuple[float, float, float] = (1.0, 0.0, 0.0)
    ey: Tuple[float, float, float] = (0.0, 1.0, 0.0)
    ez: Tuple[float, float, float] = (0.0, 0.0, 1.0)
    base_plane_detected = False

    if planes and len(all_positions) >= 3:
        base_plane_detected = True
        p0 = planes[0]
        n0 = _norm_vec((float(p0["normal"][0]), float(p0["normal"][1]), float(p0["normal"][2])))

        n_verts = len(all_positions) // 3
        cx_part = sum(all_positions[0::3]) / n_verts
        cy_part = sum(all_positions[1::3]) / n_verts
        cz_part = sum(all_positions[2::3]) / n_verts
        c0 = p0.get("center", [cx_part, cy_part, cz_part])
        to_centroid = (cx_part - c0[0], cy_part - c0[1], cz_part - c0[2])

        if _dot(to_centroid, n0) < -1e-4:
            ey = (-n0[0], -n0[1], -n0[2])
        else:
            ey = n0

        ys_test = [all_positions[i] * ey[0] + all_positions[i + 1] * ey[1] + all_positions[i + 2] * ey[2] for i in range(0, len(all_positions), 3)]
        min_y_test, max_y_test = min(ys_test), max(ys_test)
        span_y_test = max_y_test - min_y_test
        if span_y_test > 1e-3:
            area_near_min = 0.0
            area_near_max = 0.0
            for pl_item in planes:
                np_vec = _norm_vec((float(pl_item["normal"][0]), float(pl_item["normal"][1]), float(pl_item["normal"][2])))
                if abs(_dot(np_vec, ey)) > 0.95:
                    cp = pl_item.get("center", [cx_part, cy_part, cz_part])
                    cy_proj = cp[0] * ey[0] + cp[1] * ey[1] + cp[2] * ey[2]
                    if cy_proj - min_y_test <= span_y_test * 0.15:
                        area_near_min += float(pl_item.get("area_or_length", 0.0))
                    if max_y_test - cy_proj <= span_y_test * 0.15:
                        area_near_max += float(pl_item.get("area_or_length", 0.0))
            if area_near_max > area_near_min + 1.0:
                ey = (-ey[0], -ey[1], -ey[2])

        sec_groups: Dict[Tuple[float, float, float], Dict[str, Any]] = {}
        for p_sec in planes[1:]:
            ns = _norm_vec((float(p_sec["normal"][0]), float(p_sec["normal"][1]), float(p_sec["normal"][2])))
            if abs(_dot(ns, ey)) < 0.25:
                proj = _norm_vec((
                    ns[0] - _dot(ns, ey) * ey[0],
                    ns[1] - _dot(ns, ey) * ey[1],
                    ns[2] - _dot(ns, ey) * ey[2],
                ))
                canon = _canon_vec(proj)
                key = (round(canon[0], 2), round(canon[1], 2), round(canon[2], 2))
                if key not in sec_groups:
                    sec_groups[key] = {"vec": canon, "area": 0.0}
                sec_groups[key]["area"] += float(p_sec.get("area_or_length", 0.0))

        sec_cand: Optional[Tuple[float, float, float]] = None
        if sec_groups:
            best_sec = max(sec_groups.values(), key=lambda g: g["area"])
            sec_cand = best_sec["vec"]

        if sec_cand is None:
            ref = (1.0, 0.0, 0.0) if abs(ey[0]) < 0.85 else (0.0, 0.0, 1.0)
            proj = (
                ref[0] - _dot(ref, ey) * ey[0],
                ref[1] - _dot(ref, ey) * ey[1],
                ref[2] - _dot(ref, ey) * ey[2],
            )
            sec_cand = _norm_vec(proj)

        ez = sec_cand
        ex = _norm_vec(_cross(ey, ez))
        ez = _norm_vec(_cross(ex, ey))

        xs_test = [all_positions[i] * ex[0] + all_positions[i + 1] * ex[1] + all_positions[i + 2] * ex[2] for i in range(0, len(all_positions), 3)]
        zs_test = [all_positions[i] * ez[0] + all_positions[i + 1] * ez[1] + all_positions[i + 2] * ez[2] for i in range(0, len(all_positions), 3)]
        span_x = max(xs_test) - min(xs_test)
        span_z = max(zs_test) - min(zs_test)
        if span_z > span_x + 1e-3:
            ex, ez = ez, (-ex[0], -ex[1], -ex[2])

        for i in range(0, len(all_positions), 3):
            rx, ry, rz = _apply_rot((all_positions[i], all_positions[i + 1], all_positions[i + 2]), ex, ey, ez)
            all_positions[i] = round(rx, 4)
            all_positions[i + 1] = round(ry, 4)
            all_positions[i + 2] = round(rz, 4)

        for i in range(0, len(all_normals), 3):
            nx, ny, nz = _apply_rot((all_normals[i], all_normals[i + 1], all_normals[i + 2]), ex, ey, ez)
            all_normals[i] = round(nx, 4)
            all_normals[i + 1] = round(ny, 4)
            all_normals[i + 2] = round(nz, 4)

        for i in range(0, len(all_edge_segments), 3):
            ex_p, ey_p, ez_p = _apply_rot((all_edge_segments[i], all_edge_segments[i + 1], all_edge_segments[i + 2]), ex, ey, ez)
            all_edge_segments[i] = round(ex_p, 4)
            all_edge_segments[i + 1] = round(ey_p, 4)
            all_edge_segments[i + 2] = round(ez_p, 4)

        for feat in extracted_features:
            if feat.get("center"):
                fc = feat["center"]
                rcx, rcy, rcz = _apply_rot((float(fc[0]), float(fc[1]), float(fc[2])), ex, ey, ez)
                feat["center"] = [round(rcx, 4), round(rcy, 4), round(rcz, 4)]
            if feat.get("normal"):
                fn = feat["normal"]
                rnx, rny, rnz = _apply_rot((float(fn[0]), float(fn[1]), float(fn[2])), ex, ey, ez)
                feat["normal"] = [round(rnx, 4), round(rny, 4), round(rnz, 4)]

        xs_aligned = all_positions[0::3]
        ys_aligned = all_positions[1::3]
        zs_aligned = all_positions[2::3]
        min_x, max_x = min(xs_aligned), max(xs_aligned)
        min_y, max_y = min(ys_aligned), max(ys_aligned)
        min_z, max_z = min(zs_aligned), max(zs_aligned)
        size_x = max_x - min_x
        size_y = max_y - min_y
        size_z = max_z - min_z

        shift_x = (min_x + max_x) / 2.0
        shift_y = min_y
        shift_z = (min_z + max_z) / 2.0

        for i in range(0, len(all_positions), 3):
            all_positions[i] = round(all_positions[i] - shift_x, 4)
            all_positions[i + 1] = round(all_positions[i + 1] - shift_y, 4)
            all_positions[i + 2] = round(all_positions[i + 2] - shift_z, 4)

        for i in range(0, len(all_edge_segments), 3):
            all_edge_segments[i] = round(all_edge_segments[i] - shift_x, 4)
            all_edge_segments[i + 1] = round(all_edge_segments[i + 1] - shift_y, 4)
            all_edge_segments[i + 2] = round(all_edge_segments[i + 2] - shift_z, 4)

        for feat in extracted_features:
            if feat.get("center"):
                fc = feat["center"]
                feat["center"] = [
                    round(float(fc[0]) - shift_x, 4),
                    round(float(fc[1]) - shift_y, 4),
                    round(float(fc[2]) - shift_z, 4),
                ]

        min_x, max_x = round(-size_x / 2.0, 4), round(size_x / 2.0, 4)
        min_y, max_y = 0.0, round(size_y, 4)
        min_z, max_z = round(-size_z / 2.0, 4), round(size_z / 2.0, 4)

    pos_bytes = struct.pack(f"<{len(all_positions)}f", *all_positions)
    norm_bytes = struct.pack(f"<{len(all_normals)}f", *all_normals)
    idx_bytes = struct.pack(f"<{len(all_indices)}I", *all_indices)
    edge_bytes = struct.pack(f"<{len(all_edge_segments)}f", *all_edge_segments)

    positions_b64 = base64.b64encode(pos_bytes).decode("ascii")
    normals_b64 = base64.b64encode(norm_bytes).decode("ascii")
    indices_b64 = base64.b64encode(idx_bytes).decode("ascii")
    edges_b64 = base64.b64encode(edge_bytes).decode("ascii")

    stat = os.stat(step_path)

    res_dict = {
        "success": True,
        "kernel": "OpenCASCADE 8.0 (OCP)",
        "model_name": os.path.basename(step_path),
        "file_path": os.path.abspath(step_path),
        "file_format": "step",
        "file_size_bytes": stat.st_size,
        "vertex_count": len(all_positions) // 3,
        "triangle_count": len(all_indices) // 3,
        "bbox": {
            "min": [round(min_x, 3), round(min_y, 3), round(min_z, 3)],
            "max": [round(max_x, 3), round(max_y, 3), round(max_z, 3)],
            "size": [round(size_x, 3), round(size_y, 3), round(size_z, 3)],
        },
        "features": extracted_features,
        "mesh": {
            "positions_b64": positions_b64,
            "normals_b64": normals_b64,
            "indices_b64": indices_b64,
            "edges_b64": edges_b64,
            "linear_deflection": linear_deflection,
            "faces": mesh_faces,
        },
        "alignment": {
            "base_plane_detected": base_plane_detected,
            "table_clearance_min_z": 0.0,
            "orientation_matrix": [
                round(ex[0], 6), round(ex[1], 6), round(ex[2], 6),
                round(ey[0], 6), round(ey[1], 6), round(ey[2], 6),
                round(ez[0], 6), round(ez[1], 6), round(ez[2], 6),
            ],
        },
    }
    if extract_pmi_schema_payload:
        pmi_data = extract_pmi_schema_payload(step_path)
        if pmi_data:
            res_dict["pmi"] = pmi_data
    return res_dict


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

    spheres: List[Dict[str, Any]] = []
    for m in re.finditer(
        r"#(\d+)\s*=\s*SPHERICAL_SURFACE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*([-\d.eE+]+)\s*\)",
        content,
    ):
        s_id = m.group(1)
        axis_id = m.group(2)
        r_val = float(m.group(3))
        placement = axis_placements.get(axis_id, {"origin": (0.0, 0.0, 0.0), "axis": (0.0, 0.0, 1.0)})
        spheres.append({
            "id": s_id,
            "radius": round(r_val, 4),
            "diameter": round(r_val * 2.0, 4),
            "placement": placement,
            "center": placement["origin"],
            "is_face": (s_id in face_surface_ids) if face_surface_ids else True,
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
        "spheres": spheres,
        "circles": circles,
        "linear_distances": linear_distances,
        "rotational_diameters": rotational_diameters,
        "total_points": len(points),
        "total_cylinders": len(cylinders),
        "total_planes": len(planes),
        "total_cones": len(cones),
        "total_toroids": len(toroids),
        "total_spheres": len(spheres),
    }


def _project_3d_point_to_view(pt: List[float], view_plane: str) -> Tuple[float, float]:
    vp = str(view_plane or "XY").upper()
    if "XZ" in vp or "FRONT" in vp:
        return float(pt[0]), float(pt[2])
    if "YZ" in vp or "SIDE" in vp:
        return float(pt[1]), float(pt[2])
    return float(pt[0]), float(pt[1])


def _solve_linear_3x3(a: List[List[float]], b: List[float]) -> Optional[List[float]]:
    m = [
        [a[0][0], a[0][1], a[0][2], b[0]],
        [a[1][0], a[1][1], a[1][2], b[1]],
        [a[2][0], a[2][1], a[2][2], b[2]],
    ]
    for col in range(3):
        piv = col
        for r in range(col + 1, 3):
            if abs(m[r][col]) > abs(m[piv][col]):
                piv = r
        if abs(m[piv][col]) < 1e-10:
            return None
        m[col], m[piv] = m[piv], m[col]
        div = m[col][col]
        for k in range(col, 4):
            m[col][k] /= div
        for r in range(3):
            if r != col:
                fac = m[r][col]
                for k in range(col, 4):
                    m[r][k] -= fac * m[col][k]
    return [m[0][3], m[1][3], m[2][3]]


def align_view_to_3d_projection(
    view_circles_2d: List[Any],
    cad_cylinders_3d: List[Any],
    view_plane: str = "XY",
) -> Optional[Dict[str, Any]]:
    pts_2d: List[Tuple[float, float, float]] = []
    for c in view_circles_2d:
        if isinstance(c, dict):
            ctr = c.get("center")
            if isinstance(ctr, (list, tuple)) and len(ctr) >= 2:
                pts_2d.append((float(ctr[0]), float(ctr[1]), float(c.get("radius_pt", 0.0) or 0.0)))
            elif "u" in c and "v" in c:
                pts_2d.append((float(c["u"]), float(c["v"]), float(c.get("r", c.get("radius_pt", 0.0)) or 0.0)))
            elif "circle_cx" in c and "circle_cy" in c:
                pts_2d.append((float(c["circle_cx"]), float(c["circle_cy"]), float(c.get("circle_r_pt", 0.0) or 0.0)))
        elif isinstance(c, (list, tuple)) and len(c) >= 2:
            r_pt = float(c[2]) if len(c) >= 3 else 0.0
            pts_2d.append((float(c[0]), float(c[1]), r_pt))

    pts_3d: List[Tuple[float, float, float]] = []
    for f in cad_cylinders_3d:
        if isinstance(f, dict):
            ctr = f.get("center", f.get("origin"))
            if isinstance(ctr, (list, tuple)) and len(ctr) >= 3:
                u3, v3 = _project_3d_point_to_view([float(ctr[0]), float(ctr[1]), float(ctr[2])], view_plane)
                r_mm = float(f.get("radius", float(f.get("diameter", 0.0) or 0.0) * 0.5) or 0.0)
                pts_3d.append((u3, v3, r_mm))
        elif isinstance(f, (list, tuple)) and len(f) >= 3:
            u3, v3 = _project_3d_point_to_view([float(f[0]), float(f[1]), float(f[2])], view_plane)
            pts_3d.append((u3, v3, 0.0))

    if not pts_2d or not pts_3d:
        return None

    vp_clean = str(view_plane or "XY").upper()
    plane_tag = "XZ" if ("XZ" in vp_clean or "FRONT" in vp_clean) else ("YZ" if ("YZ" in vp_clean or "SIDE" in vp_clean) else "XY")

    if len(pts_2d) == 1 or len(pts_3d) == 1:
        p0 = pts_2d[0]
        q0 = pts_3d[0]
        s = (q0[2] / p0[2]) if (p0[2] > 0.1 and q0[2] > 0.05) else 1.0
        tu = q0[0] - s * p0[0]
        tv = q0[1] - s * p0[1]
        return {
            "view_plane": plane_tag,
            "scale": round(s, 6),
            "flip_y": False,
            "matrix": [[round(s, 6), 0.0], [0.0, round(s, 6)]],
            "translation": [round(tu, 6), round(tv, 6)],
            "inliers": 1,
            "residual_error": 0.0,
        }

    us_3 = [p[0] for p in pts_3d]
    vs_3 = [p[1] for p in pts_3d]
    bbox_diag = math.hypot(max(us_3) - min(us_3), max(vs_3) - min(vs_3))
    inlier_tol = max(1.5, bbox_diag * 0.04)

    max_pts_2d = pts_2d[:16]
    max_pts_3d = pts_3d[:16]

    best_score: Optional[Tuple[int, float]] = None
    best_model: Optional[Tuple[float, float, float, float, float, float, bool, float, List[Tuple[Tuple[float, float], Tuple[float, float]]]]] = None

    for i1 in range(len(max_pts_2d)):
        for i2 in range(i1 + 1, len(max_pts_2d)):
            u1, v1, r2_1 = max_pts_2d[i1]
            u2, v2, r2_2 = max_pts_2d[i2]
            if math.hypot(u2 - u1, v2 - v1) < 1.0:
                continue
            for j1 in range(len(max_pts_3d)):
                for j2 in range(len(max_pts_3d)):
                    if j1 == j2:
                        continue
                    U1, V1, R3_1 = max_pts_3d[j1]
                    U2, V2, R3_2 = max_pts_3d[j2]
                    d3 = math.hypot(U2 - U1, V2 - V1)
                    if d3 < 0.1:
                        continue
                    d2 = math.hypot(u2 - u1, v2 - v1)
                    cand_s = d3 / d2
                    if r2_1 > 0.5 and R3_1 > 0.1:
                        if abs(r2_1 * cand_s - R3_1) > max(1.5, R3_1 * 0.35):
                            continue
                    if r2_2 > 0.5 and R3_2 > 0.1:
                        if abs(r2_2 * cand_s - R3_2) > max(1.5, R3_2 * 0.35):
                            continue

                    for flip_y in (False, True):
                        sy = -1.0 if flip_y else 1.0
                        dx2 = u2 - u1
                        dy2 = (v2 - v1) * sy
                        denom = dx2 * dx2 + dy2 * dy2
                        dX3 = U2 - U1
                        dY3 = V2 - V1
                        a_coef = (dx2 * dX3 + dy2 * dY3) / denom
                        b_coef = (dx2 * dY3 - dy2 * dX3) / denom
                        m00 = a_coef
                        m01 = -b_coef * sy
                        m10 = b_coef
                        m11 = a_coef * sy
                        tu = U1 - (m00 * u1 + m01 * v1)
                        tv = V1 - (m10 * u1 + m11 * v1)

                        inliers_pairs: List[Tuple[Tuple[float, float], Tuple[float, float]]] = []
                        err_sum = 0.0
                        for pu, pv, pr in max_pts_2d:
                            pred_u = m00 * pu + m01 * pv + tu
                            pred_v = m10 * pu + m11 * pv + tv
                            min_d = float("inf")
                            best_q = None
                            for qU, qV, qR in max_pts_3d:
                                dist = math.hypot(pred_u - qU, pred_v - qV)
                                if dist < min_d:
                                    min_d = dist
                                    best_q = (qU, qV)
                            if best_q is not None and min_d <= inlier_tol:
                                inliers_pairs.append(((pu, pv), best_q))
                                err_sum += min_d

                        inlier_cnt = len(inliers_pairs)
                        if inlier_cnt < 2:
                            continue
                        avg_err = err_sum / inlier_cnt
                        rank_key = (inlier_cnt, -avg_err)
                        if best_score is None or rank_key > best_score:
                            best_score = rank_key
                            best_model = (m00, m01, m10, m11, tu, tv, flip_y, cand_s, inliers_pairs)

    if best_model is None:
        return None

    m00, m01, m10, m11, tu, tv, flip_y, scale_est, inliers_pairs = best_model

    if len(inliers_pairs) >= 3:
        ata = [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]]
        atb_u = [0.0, 0.0, 0.0]
        atb_v = [0.0, 0.0, 0.0]
        for (pu, pv), (qU, qV) in inliers_pairs:
            row = [pu, pv, 1.0]
            for r in range(3):
                atb_u[r] += row[r] * qU
                atb_v[r] += row[r] * qV
                for c_idx in range(3):
                    ata[r][c_idx] += row[r] * row[c_idx]
        sol_u = _solve_linear_3x3(ata, atb_u)
        sol_v = _solve_linear_3x3(ata, atb_v)
        if sol_u is not None and sol_v is not None:
            m00, m01, tu = sol_u
            m10, m11, tv = sol_v
            scale_est = math.sqrt(max(1e-12, abs(m00 * m11 - m01 * m10)))

    total_err = 0.0
    for (pu, pv), (qU, qV) in inliers_pairs:
        pred_u = m00 * pu + m01 * pv + tu
        pred_v = m10 * pu + m11 * pv + tv
        total_err += math.hypot(pred_u - qU, pred_v - qV)
    residual = total_err / max(1, len(inliers_pairs))

    return {
        "view_plane": plane_tag,
        "scale": round(scale_est, 6),
        "flip_y": bool(flip_y),
        "matrix": [[round(m00, 6), round(m01, 6)], [round(m10, 6), round(m11, 6)]],
        "translation": [round(tu, 6), round(tv, 6)],
        "inliers": len(inliers_pairs),
        "residual_error": round(residual, 4),
    }


def transform_2d_to_3d(
    point_2d: List[float],
    alignment: Dict[str, Any],
    step_bbox: Optional[Dict[str, Any]] = None,
) -> List[float]:
    u = float(point_2d[0])
    v = float(point_2d[1])
    mat = alignment.get("matrix", [[1.0, 0.0], [0.0, 1.0]])
    trans = alignment.get("translation", [0.0, 0.0])
    U = mat[0][0] * u + mat[0][1] * v + trans[0]
    V = mat[1][0] * u + mat[1][1] * v + trans[1]

    b_min = (step_bbox or {}).get("min", [0.0, 0.0, 0.0])
    b_max = (step_bbox or {}).get("max", [0.0, 0.0, 0.0])
    mid_x = (float(b_min[0]) + float(b_max[0])) * 0.5
    mid_y = (float(b_min[1]) + float(b_max[1])) * 0.5
    mid_z = (float(b_min[2]) + float(b_max[2])) * 0.5

    vp = str(alignment.get("view_plane", "XY")).upper()
    if vp == "XZ":
        return [round(U, 4), round(mid_y, 4), round(V, 4)]
    if vp == "YZ":
        return [round(mid_x, 4), round(U, 4), round(V, 4)]
    return [round(U, 4), round(V, 4), round(mid_z, 4)]


def compute_topological_match_score(
    dim: Dict[str, Any],
    candidate_feature: Dict[str, Any],
    step_bbox: Dict[str, Any],
    view_name: Optional[str] = None,
    alignment: Optional[Dict[str, Any]] = None,
) -> float:
    dim_nom = float(dim.get("nominal", 0.0))
    cand_nom = float(candidate_feature.get("nominal", candidate_feature.get("diameter", candidate_feature.get("radius", candidate_feature.get("value", 0.0)))))
    delta = abs(dim_nom - cand_nom)

    if delta <= 0.02:
        score_nom = 40.0
    elif delta <= 0.05:
        score_nom = 35.0
    elif delta <= 0.15:
        score_nom = 25.0
    elif delta <= 0.50:
        score_nom = 15.0
    elif delta <= 1.0:
        score_nom = 5.0
    else:
        score_nom = 0.0

    d_type = str(dim.get("type", "LINEAR")).upper()
    c_type = str(candidate_feature.get("type", "")).upper()
    if d_type in ("DIAMETER", "HOLE") and ("CYLINDER" in c_type or "CIRCLE" in c_type or "ROTATIONAL" in c_type or "CONE" in c_type):
        score_type = 20.0
    elif d_type == "RADIUS" and ("TOROID" in c_type or "RADIUS" in c_type or "FILLET" in c_type):
        score_type = 20.0
    elif d_type in ("LINEAR", "CHAMFER") and ("PLANE" in c_type or "SPAN" in c_type or "DISTANCE" in c_type or "SLOT" in c_type or "STEP" in c_type):
        score_type = 20.0
    elif d_type == "THREAD" and ("CYLINDER" in c_type or "THREAD" in c_type):
        score_type = 20.0
    else:
        score_type = 10.0

    score_axis = 10.0
    dim_axis = dim.get("inferred_axis")
    cand_axis = candidate_feature.get("axis")
    if dim_axis and cand_axis and isinstance(cand_axis, (list, tuple)) and len(cand_axis) == 3:
        if dim_axis == "X" and abs(cand_axis[0]) > 0.8:
            score_axis = 15.0
        elif dim_axis == "Y" and abs(cand_axis[1]) > 0.8:
            score_axis = 15.0
        elif dim_axis == "Z" and abs(cand_axis[2]) > 0.8:
            score_axis = 15.0

    score_datum = 5.0
    if dim.get("datum_reference"):
        score_datum = 10.0

    b_min = step_bbox.get("min", [0.0, 0.0, 0.0])
    b_max = step_bbox.get("max", [100.0, 100.0, 100.0])
    center = candidate_feature.get("center", candidate_feature.get("origin", [0.0, 0.0, 0.0]))
    if not isinstance(center, (list, tuple)) or len(center) != 3:
        center = [0.0, 0.0, 0.0]

    cx, cy, cz = float(center[0]), float(center[1]), float(center[2])
    xmin, ymin, zmin = float(b_min[0]), float(b_min[1]), float(b_min[2])
    xmax, ymax, zmax = float(b_max[0]), float(b_max[1]), float(b_max[2])

    v_clean = str(view_name or dim.get("view_name", "VIEW_FRONT_XZ")).upper()

    active_align = alignment or dim.get("view_alignment")
    att = dim.get("attachments") if isinstance(dim.get("attachments"), dict) else {}
    target_2d: Optional[List[float]] = None
    if att.get("circle_cx") is not None and att.get("circle_cy") is not None:
        target_2d = [float(att["circle_cx"]), float(att["circle_cy"])]
    elif isinstance(att.get("leader_tip"), (list, tuple)) and len(att["leader_tip"]) >= 2:
        target_2d = [float(att["leader_tip"][0]), float(att["leader_tip"][1])]
    elif isinstance(dim.get("bbox"), (list, tuple)) and len(dim["bbox"]) >= 4:
        db = dim["bbox"]
        target_2d = [(float(db[0]) + float(db[2])) * 0.5, (float(db[1]) + float(db[3])) * 0.5]

    score_proximity = 8.0
    if active_align and target_2d is not None:
        pred_3d = transform_2d_to_3d(target_2d, active_align, step_bbox)
        vp = str(active_align.get("view_plane", "XY")).upper()
        if vp == "XZ":
            dist_mm = math.hypot(cx - pred_3d[0], cz - pred_3d[2])
            plane_diag = max(1.0, math.hypot(xmax - xmin, zmax - zmin))
        elif vp == "YZ":
            dist_mm = math.hypot(cy - pred_3d[1], cz - pred_3d[2])
            plane_diag = max(1.0, math.hypot(ymax - ymin, zmax - zmin))
        else:
            dist_mm = math.hypot(cx - pred_3d[0], cy - pred_3d[1])
            plane_diag = max(1.0, math.hypot(xmax - xmin, ymax - ymin))
        score_proximity = max(0.0, 25.0 * math.exp(-dist_mm / max(2.0, plane_diag * 0.12)))
    else:
        if "XZ" in v_clean or "FRONT" in v_clean:
            u_3d = (cx - xmin) / max(xmax - xmin, 1e-6)
            v_3d = (cz - zmin) / max(zmax - zmin, 1e-6)
        elif "YZ" in v_clean or "SIDE" in v_clean:
            u_3d = (cy - ymin) / max(ymax - ymin, 1e-6)
            v_3d = (cz - zmin) / max(zmax - zmin, 1e-6)
        else:
            u_3d = (cx - xmin) / max(xmax - xmin, 1e-6)
            v_3d = (cy - ymin) / max(ymax - ymin, 1e-6)

        u_3d = max(0.0, min(1.0, u_3d))
        v_3d = max(0.0, min(1.0, v_3d))

        rel_pos = dim.get("rel_position")
        if rel_pos and len(rel_pos) >= 2:
            u_2d, v_2d = float(rel_pos[0]), float(rel_pos[1])
            dist = math.sqrt((u_3d - u_2d)**2 + (v_3d - v_2d)**2)
            score_proximity = max(0.0, 15.0 * (1.0 - dist / 1.4142))

    score_section = 0.0
    is_sec_view = bool(dim.get("is_section_view")) or ("SECTION" in v_clean)
    if is_sec_view:
        f_type_up = str(candidate_feature.get("feature_type", "")).upper()
        is_internal_feat = (
            bool(candidate_feature.get("is_internal"))
            or bool(candidate_feature.get("is_blind"))
            or "INTERNAL" in c_type
            or "INTERNAL" in f_type_up
            or "COUNTERBORE" in c_type
            or "GROOVE" in c_type
            or "STEP_HEIGHT" in c_type
            or "BORE" in c_type
            or "CYLINDER" in c_type
        )
        if is_internal_feat:
            score_section = 20.0

    total = score_nom + score_type + score_axis + score_datum + score_proximity + score_section
    return round(min(100.0, max(0.0, total)), 2)


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
    step_spheres = step_data.get("spheres", [])
    step_circles = step_data.get("circles", [])
    step_linear = step_data.get("linear_distances", [])
    step_rot_dia = step_data.get("rotational_diameters", [])
    step_bbox = step_data.get("bbox", {})
    step_bbox_sizes = step_bbox.get("size", [0.0, 0.0, 0.0])
    max_box = max(step_bbox_sizes) if step_bbox_sizes else 0.0

    verified_dimensions = []
    pruned_dimensions = []

    al_matcher = None
    try:
        from extractor.active_learning_engine import ActiveLearningMatcher
        al_matcher = ActiveLearningMatcher()
    except Exception:
        try:
            from tools.extractor.active_learning_engine import ActiveLearningMatcher
            al_matcher = ActiveLearningMatcher()
        except Exception:
            al_matcher = None

    view_circles_by_view: Dict[str, List[Dict[str, Any]]] = {}
    extra_view_circles = step_data.get("view_circles_2d")
    if isinstance(extra_view_circles, dict):
        for vk, clist in extra_view_circles.items():
            if isinstance(clist, list):
                view_circles_by_view[str(vk)] = list(clist)

    for dim in dimensions:
        att = dim.get("attachments")
        if isinstance(att, dict) and att.get("circle_cx") is not None and att.get("circle_cy") is not None:
            vkey = str(dim.get("view_name") or dim.get("view_cluster") or "VIEW_TOP_XY")
            view_circles_by_view.setdefault(vkey, []).append({
                "center": [float(att["circle_cx"]), float(att["circle_cy"])],
                "radius_pt": float(att.get("circle_r_pt") or 0.0),
            })

    view_alignments: Dict[str, Optional[Dict[str, Any]]] = {}
    for vkey, clist in view_circles_by_view.items():
        if clist and step_cylinders:
            v_up = vkey.upper()
            vp = "XZ" if ("XZ" in v_up or "FRONT" in v_up) else ("YZ" if ("YZ" in v_up or "SIDE" in v_up) else "XY")
            view_alignments[vkey] = align_view_to_3d_projection(clist, step_cylinders, view_plane=vp)

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

        candidate_features: List[Dict[str, Any]] = []

        if d_type in ("DIAMETER", "HOLE", "THREAD") or "ø" in dim_str:
            for c in step_cylinders:
                if abs(c["diameter"] - nom) <= tol_dia:
                    candidate_features.append({
                        "type": "CYLINDER",
                        "diameter": c["diameter"],
                        "nominal": c["diameter"],
                        "id": c["id"],
                        "center": c.get("center", [0.0, 0.0, 0.0]),
                        "axis": c.get("axis", [0.0, 0.0, 1.0]),
                        "is_internal": c.get("is_internal", True),
                    })
            for circ in step_circles:
                if abs(circ["diameter"] - nom) <= tol_dia:
                    candidate_features.append({
                        "type": "CIRCLE_EDGE",
                        "diameter": circ["diameter"],
                        "nominal": circ["diameter"],
                        "id": circ["id"],
                        "center": circ.get("center", [0.0, 0.0, 0.0]),
                        "axis": circ.get("axis", [0.0, 0.0, 1.0]),
                    })
            if d_type == "DIAMETER":
                for cone in step_cones:
                    cone_d = cone["radius"] * 2.0
                    if abs(cone_d - nom) <= tol_dia:
                        candidate_features.append({
                            "type": "CONE_BASE",
                            "diameter": cone_d,
                            "nominal": cone_d,
                            "id": cone["id"],
                            "center": cone.get("placement", {}).get("origin", [0.0, 0.0, 0.0]),
                            "axis": cone.get("placement", {}).get("axis", [0.0, 0.0, 1.0]),
                        })
                for rd in step_rot_dia:
                    if abs(rd - nom) <= tol_dia:
                        candidate_features.append({
                            "type": "ROTATIONAL_PROFILE_DIAMETER",
                            "diameter": rd,
                            "nominal": rd,
                            "id": 0,
                            "center": [0.0, 0.0, 0.0],
                            "axis": [0.0, 0.0, 1.0],
                        })

        if d_type == "RADIUS" or "r" in dim_str:
            for t in step_toroids:
                if abs(t["minor_radius"] - nom) <= tol_dia:
                    candidate_features.append({
                        "type": "TOROID_FILLET",
                        "radius": t["minor_radius"],
                        "nominal": t["minor_radius"],
                        "id": t["id"],
                        "center": t.get("placement", {}).get("origin", [0.0, 0.0, 0.0]),
                        "axis": t.get("placement", {}).get("axis", [0.0, 0.0, 1.0]),
                    })
            for s in step_spheres:
                if abs(s["radius"] - nom) <= tol_dia:
                    candidate_features.append({
                        "type": "SPHERE_RADIUS",
                        "radius": s["radius"],
                        "nominal": s["radius"],
                        "id": s["id"],
                        "center": s.get("center", [0.0, 0.0, 0.0]),
                        "axis": [0.0, 0.0, 1.0],
                    })
            for c in step_cylinders:
                if abs(c["radius"] - nom) <= tol_dia:
                    candidate_features.append({
                        "type": "CYLINDER_RADIUS",
                        "radius": c["radius"],
                        "nominal": c["radius"],
                        "id": c["id"],
                        "center": c.get("center", [0.0, 0.0, 0.0]),
                        "axis": c.get("axis", [0.0, 0.0, 1.0]),
                    })
            for circ in step_circles:
                if abs(circ["radius"] - nom) <= tol_dia:
                    candidate_features.append({
                        "type": "CIRCLE_RADIUS",
                        "radius": circ["radius"],
                        "nominal": circ["radius"],
                        "id": circ["id"],
                        "center": circ.get("center", [0.0, 0.0, 0.0]),
                        "axis": circ.get("axis", [0.0, 0.0, 1.0]),
                    })

        if d_type == "CHAMFER":
            for cone in step_cones:
                if abs(cone["angle_deg"] - 45.0) <= tol_angle or abs(cone["angle_deg"] - 90.0) <= tol_angle:
                    candidate_features.append({
                        "type": "CHAMFER_CONE",
                        "angle": cone["angle_deg"],
                        "nominal": nom,
                        "id": cone["id"],
                        "center": cone.get("placement", {}).get("origin", [0.0, 0.0, 0.0]),
                        "axis": cone.get("placement", {}).get("axis", [0.0, 0.0, 1.0]),
                    })
            for ld in step_linear:
                if abs(ld["value"] - nom) <= tol_linear:
                    candidate_features.append({
                        "type": "CHAMFER_SPAN",
                        "value": ld["value"],
                        "nominal": ld["value"],
                        "id": 0,
                        "center": [0.0, 0.0, 0.0],
                        "axis": ld.get("axis", [0.0, 0.0, 1.0]),
                    })

        if d_type in ("LINEAR", "THREAD", "CUSTOM"):
            for ld in step_linear:
                if abs(ld["value"] - nom) <= tol_linear:
                    candidate_features.append({
                        "type": ld["type"],
                        "value": ld["value"],
                        "nominal": ld["value"],
                        "id": 0,
                        "center": [0.0, 0.0, 0.0],
                        "axis": ld.get("axis", [0.0, 0.0, 1.0]),
                    })

        matched_feature: Optional[Dict[str, Any]] = None
        best_score = 0.0
        vkey = str(dim.get("view_name") or dim.get("view_cluster") or "VIEW_TOP_XY")
        dim_align = view_alignments.get(vkey)

        if candidate_features:
            for feat in candidate_features:
                score = compute_topological_match_score(dim, feat, step_bbox, dim.get("view_name"), alignment=dim_align)
                if al_matcher is not None:
                    try:
                        ml_prob = al_matcher.predict_surface_match_probability(dim, feat)
                        score = min(100.0, max(0.0, score + (ml_prob - 0.5) * 12.0))
                    except Exception:
                        pass
                if score > best_score:
                    best_score = score
                    matched_feature = feat

        if matched_feature and best_score >= 75.0:
            dim["verification"] = "CAD_VERIFIED"
            dim["status"] = "UNMEASURED"
            dim["cad_match"] = matched_feature
            dim["match_confidence"] = round(best_score, 2)
            dim["match_status"] = "VERIFIED_EXACT" if best_score >= 85.0 else "VERIFIED_TOPOLOGY"
            fid = matched_feature.get("id")
            if isinstance(fid, int) and fid > 0:
                dim["matched_face_ids"] = [fid]
            verified_dimensions.append(dim)
        else:
            dim["verification"] = "PARSED"
            dim["status"] = "UNMEASURED"
            dim["cad_match"] = None
            dim["match_confidence"] = 0.0
            dim["match_status"] = "UNMATCHED"
            dim["matched_face_ids"] = []
            verified_dimensions.append(dim)

    return verified_dimensions, pruned_dimensions



def extract_cad_metadata(step_path: str) -> Dict[str, Any]:
    if OCP_AVAILABLE:
        try:
            ocp_res = extract_cad_metadata_ocp(step_path)
            if ocp_res.get("success") and ocp_res.get("vertex_count", 0) > 0:
                return ocp_res
        except Exception:
            pass

    step_data = parse_step_file(step_path)
    if not step_data.get("success"):
        return {"success": False, "error": step_data.get("error")}

    features: List[Dict[str, Any]] = []

    for c in step_data.get("cylinders", []):
        dia = round(c["diameter"], 4)
        c_id = f"DELIK_Ø{dia:.2f}_{c['id']}"
        features.append({
            "id": c_id,
            "feature_type": "INTERNAL_CYLINDER",
            "nominal_dimension": dia,
            "center": [round(v, 4) for v in c["center"]],
            "normal": [round(v, 4) for v in c["axis"]],
            "area_or_length": round(c["radius"] * 2 * math.pi, 3),
        })

    for p in step_data.get("planes", []):
        p_id = f"DUZLEM_{p['id']}"
        features.append({
            "id": p_id,
            "feature_type": "PLANE",
            "nominal_dimension": round(abs(p["offset"]), 4),
            "center": [round(v, 4) for v in p["origin"]],
            "normal": [round(v, 4) for v in p["axis"]],
            "area_or_length": 0.0,
        })

    for cone in step_data.get("cones", []):
        cone_id = f"KONIK_{cone['id']}"
        features.append({
            "id": cone_id,
            "feature_type": "CONE",
            "nominal_dimension": round(cone["radius"] * 2.0, 4),
            "center": [round(v, 4) for v in cone["placement"]["origin"]],
            "normal": [round(v, 4) for v in cone["placement"]["axis"]],
            "area_or_length": cone["angle_deg"],
        })

    stat = os.stat(step_path)
    file_size = stat.st_size
    filename = os.path.basename(step_path)

    fallback_dict = {
        "success": True,
        "kernel": "Regex / Parser Fallback",
        "model_name": filename,
        "file_path": os.path.abspath(step_path),
        "file_format": "step",
        "file_size_bytes": file_size,
        "vertex_count": step_data.get("total_points", 0),
        "triangle_count": 0,
        "bbox": step_data.get("bbox", {"min": [0.0, 0.0, 0.0], "max": [0.0, 0.0, 0.0], "size": [0.0, 0.0, 0.0]}),
        "features": features,
    }
    if extract_pmi_schema_payload:
        pmi_data = extract_pmi_schema_payload(step_path)
        if pmi_data:
            fallback_dict["pmi"] = pmi_data
    return fallback_dict


def verify_reconstructed_surface(feature: Dict[str, Any]) -> bool:
    if not isinstance(feature, dict):
        return False
    ft = feature.get("feature_type")
    if ft not in ("PLANE", "CYLINDER", "CONE", "SPHERE", "TORUS"):
        return False
    center = feature.get("center")
    if not isinstance(center, (list, tuple)) or len(center) != 3:
        return False
    normal = feature.get("normal")
    if not isinstance(normal, (list, tuple)) or len(normal) != 3:
        return False
    length = math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2)
    if length < 1e-6:
        return False
    return True


if __name__ == "__main__":
    import json
    if len(sys.argv) > 1:
        step_input = sys.argv[1]
        meta = extract_cad_metadata(step_input)
        print(json.dumps(meta, ensure_ascii=True))
