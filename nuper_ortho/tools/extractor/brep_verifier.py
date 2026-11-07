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


def _canon_vec(v: Tuple[float, float, float]) -> Tuple[float, float, float]:
    for x in v:
        if abs(x) > 1e-6:
            return tuple(-y for y in v) if x < 0 else v
    return v


def _dot(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def extract_cad_metadata_ocp(step_path: str) -> Dict[str, Any]:
    if not OCP_AVAILABLE:
        return {"success": False, "error": "OpenCASCADE (OCP) modülü mevcut değil."}

    reader = STEPControl_Reader()
    status = reader.ReadFile(step_path)
    if status != IFSelect_ReturnStatus.IFSelect_RetDone:
        return {"success": False, "error": f"STEP dosyası OpenCASCADE ile okunamadı: {step_path}"}

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

    cylinder_groups: Dict[Tuple[float, Tuple[float, float, float], float, str], Dict[str, Any]] = {}

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
            proj_dist = round(loc_pnt.X() * canon_axis[0] + loc_pnt.Y() * canon_axis[1] + loc_pnt.Z() * canon_axis[2], 1)
            ortho_x = loc_pnt.X() - proj_dist * canon_axis[0]
            ortho_y = loc_pnt.Y() - proj_dist * canon_axis[1]
            ortho_z = loc_pnt.Z() - proj_dist * canon_axis[2]
            ortho_hash = round(math.sqrt(ortho_x*ortho_x + ortho_y*ortho_y + ortho_z*ortho_z), 2)

            grp_key = (round(diameter, 3), canon_axis_r, ortho_hash, ftype)
            if grp_key not in cylinder_groups:
                cylinder_groups[grp_key] = {
                    "diameter": diameter,
                    "radius": radius,
                    "feature_type": ftype,
                    "axis": [round(canon_axis[0], 4), round(canon_axis[1], 4), round(canon_axis[2], 4)],
                    "centers": [center_vec],
                    "total_area": area,
                    "face_ids": [face_id],
                }
            else:
                cylinder_groups[grp_key]["centers"].append(center_vec)
                cylinder_groups[grp_key]["total_area"] += area
                cylinder_groups[grp_key]["face_ids"].append(face_id)

        elif stype_enum == GeomAbs_Cone:
            cone = adaptor.Cone()
            radius = cone.RefRadius()
            axis_dir = cone.Axis().Direction()
            angle_deg = round(math.degrees(cone.SemiAngle()), 2)
            extracted_features.append({
                "id": f"CAD_CONE_{face_idx}",
                "feature_type": "CONE",
                "nominal_dimension": round(radius * 2.0, 4),
                "center": center_vec,
                "normal": [round(axis_dir.X(), 4), round(axis_dir.Y(), 4), round(axis_dir.Z(), 4)],
                "area_or_length": angle_deg,
                "face_ids": [face_id],
                "description": f"Konik Yüzey (Yarım Açı: {angle_deg}°, Ø{radius*2:.2f})",
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
        c_list = grp["centers"]
        avg_x = sum(c[0] for c in c_list) / len(c_list)
        avg_y = sum(c[1] for c in c_list) / len(c_list)
        avg_z = sum(c[2] for c in c_list) / len(c_list)
        is_int = grp["feature_type"] == "INTERNAL_CYLINDER"
        label = "Delik" if is_int else "Mil / Silindir"
        feat_id = f"CAD_{'HOLE' if is_int else 'CYL'}_Ø{grp['diameter']:.2f}_{cyl_idx}"
        extracted_features.append({
            "id": feat_id,
            "feature_type": grp["feature_type"],
            "nominal_dimension": grp["diameter"],
            "center": [round(avg_x, 4), round(avg_y, 4), round(avg_z, 4)],
            "normal": grp["axis"],
            "area_or_length": round(grp["total_area"], 4),
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

    for idx, ld in enumerate(step_data.get("linear_distances", [])):
        dist_val = round(ld["value"], 4)
        ld_id = f"MESAFE_{ld['type']}_{dist_val:.2f}_{idx}"
        norm = ld.get("normal", [0.0, 0.0, 1.0])
        if isinstance(norm, (list, tuple)):
            norm_list = [round(float(v), 4) for v in norm]
        else:
            norm_list = [0.0, 0.0, 1.0]
        if len(norm_list) != 3:
            norm_list = [0.0, 0.0, 1.0]
        features.append({
            "id": ld_id,
            "feature_type": "PLANE",
            "nominal_dimension": dist_val,
            "center": [0.0, 0.0, 0.0],
            "normal": norm_list,
            "area_or_length": dist_val,
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


if __name__ == "__main__":
    import json
    if len(sys.argv) > 1:
        step_input = sys.argv[1]
        meta = extract_cad_metadata(step_input)
        print(json.dumps(meta, ensure_ascii=False))
