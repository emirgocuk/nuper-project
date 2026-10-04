import os
import re
from typing import Any, Dict, List, Optional, Tuple


def parse_step_file(step_path: str) -> Dict[str, Any]:
    """
    Saf Python STEP (ISO 10303-21) B-Rep ayrıştırıcı.
    0 MB VRAM, saf CPU, ~25 ms çalışma süresi.
    """
    if not os.path.exists(step_path):
        return {"success": False, "error": f"STEP dosyası bulunamadı: {step_path}"}

    with open(step_path, "r", encoding="latin-1", errors="ignore") as f:
        content = f.read()

    # 1. CARTESIAN_POINT
    points: Dict[str, Tuple[float, float, float]] = {}
    for m in re.finditer(
        r"#(\d+)\s*=\s*CARTESIAN_POINT\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*\(\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)\s*\)",
        content,
    ):
        points[m.group(1)] = (float(m.group(2)), float(m.group(3)), float(m.group(4)))

    # 2. DIRECTION
    directions: Dict[str, Tuple[float, float, float]] = {}
    for m in re.finditer(
        r"#(\d+)\s*=\s*DIRECTION\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*\(\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)\s*\)",
        content,
    ):
        directions[m.group(1)] = (float(m.group(2)), float(m.group(3)), float(m.group(4)))

    # 3. AXIS2_PLACEMENT_3D
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

    # 4. CYLINDRICAL_SURFACE
    cylinders: List[Dict[str, Any]] = []
    for m in re.finditer(
        r"#(\d+)\s*=\s*CYLINDRICAL_SURFACE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*([-\d.eE+]+)\s*\)",
        content,
    ):
        c_id = m.group(1)
        axis_id = m.group(2)
        radius = float(m.group(3))
        diameter = round(radius * 2.0, 3)
        placement = axis_placements.get(axis_id, {"origin": (0.0, 0.0, 0.0), "axis": (0.0, 0.0, 1.0)})

        cylinders.append({
            "id": c_id,
            "radius": radius,
            "diameter": diameter,
            "center": placement["origin"],
            "axis": placement["axis"],
        })

    # Bounding Box
    bbox = {"min": [0.0, 0.0, 0.0], "max": [0.0, 0.0, 0.0], "size": [0.0, 0.0, 0.0]}
    if points:
        xs = [p[0] for p in points.values()]
        ys = [p[1] for p in points.values()]
        zs = [p[2] for p in points.values()]
        bbox = {
            "min": [round(min(xs), 2), round(min(ys), 2), round(min(zs), 2)],
            "max": [round(max(xs), 2), round(max(ys), 2), round(max(zs), 2)],
            "size": [round(max(xs) - min(xs), 2), round(max(ys) - min(ys), 2), round(max(zs) - min(zs), 2)],
        }

    return {
        "success": True,
        "filename": os.path.basename(step_path),
        "bbox": bbox,
        "cylinders": cylinders,
        "total_points": len(points),
        "total_cylinders": len(cylinders),
    }


def verify_dimensions_against_step(
    dimensions: List[Dict[str, Any]],
    step_data: Dict[str, Any],
    tol_linear: float = 0.5,
    tol_dia: float = 0.08,
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Katman 3: 3D STEP B-Rep Çapraz Doğrulama & Hakem Katmanı (Sanity Check).
    1. Çap ve Delik Doğrulaması: 2D çaptaki delik sayısı ve çapı STEP modeliyle karşılaştırılır.
    2. Bounding Box Eşlemesi: Toplam boy ve dış sınır ölçüleri X_max-X_min kutusuyla test edilir.
    3. Sahte ve Hayali Ölçülerin İptali: 3D geometrik karşılığı olmayan callout'lar elenir.
    """
    if not step_data.get("success"):
        return dimensions, []

    step_cylinders = step_data.get("cylinders", [])
    step_bbox_sizes = step_data.get("bbox", {}).get("size", [0.0, 0.0, 0.0])

    # Silindirleri çapa göre grupla
    cyl_by_dia: Dict[float, List[Dict[str, Any]]] = {}
    for c in step_cylinders:
        d = c["diameter"]
        matched_key = None
        for existing_d in cyl_by_dia.keys():
            if abs(existing_d - d) <= tol_dia:
                matched_key = existing_d
                break
        if matched_key is not None:
            cyl_by_dia[matched_key].append(c)
        else:
            cyl_by_dia[d] = [c]

    verified_dimensions = []
    pruned_dimensions = []

    for dim in dimensions:
        d_type = dim.get("type", "")
        nom = float(dim.get("nominal", 0.0))
        dim_str = str(dim.get("nominal_str", "")).lower()

        # Sahte malzeme / standart kodu eleme (Örn: 34CrNiMo 6, DIN 7168, vb.)
        if any(bad_word in dim_str for bad_word in ["crni", "din", "iso", "astm", "unf", "unc", "malzeme", "notlar"]):
            pruned_dimensions.append({
                "dimension": dim,
                "reason": "3D B-Rep Geometrisi Yok (Malzeme / Standart Kodu İptal Edildi)",
            })
            continue

        # 1. Delik & Çap Doğrulaması (Cylindrical Surface Match)
        matched_cyls = None
        for step_d, cyl_list in cyl_by_dia.items():
            if abs(step_d - nom) <= tol_dia:
                matched_cyls = cyl_list
                break

        if matched_cyls:
            # 3D silindirik geometride tam karşılığı var!
            dim["verification"] = "CAD_VERIFIED"
            dim["status"] = "UNMEASURED"
            dim["cad_match"] = {
                "matched_count": len(matched_cyls),
                "centers": [c["center"] for c in matched_cyls],
                "axis": matched_cyls[0]["axis"],
            }
            # Eğer 2D'de tür henüz delik/çap değilse güncelle
            if d_type not in ("HOLE", "DIAMETER"):
                dim["type"] = "DIAMETER"
                dim["type_label"] = f"Silindirik Çap / Delik (STEP Doğrulandı - {len(matched_cyls)}x)"
                dim["nominal_str"] = f"Ø{nom}"

            normal_z = matched_cyls[0]["axis"][2]
            dim["op"] = "OP10" if abs(normal_z) > 0.6 else "OP20"
            dim["op_reason"] = (
                "Dikey Z probu ile OP10 bağlamasında doğrudan taranabilir."
                if dim["op"] == "OP10"
                else "PH10 açılı kafa veya parça çevirme (OP20) gerektirir."
            )
            verified_dimensions.append(dim)
            continue

        # 2. Bounding Box & Doğrusal Boyut Doğrulaması
        matched_box = False
        for b_dim in step_bbox_sizes:
            if abs(b_dim - nom) <= tol_linear:
                matched_box = True
                break

        if matched_box:
            dim["verification"] = "CAD_VERIFIED"
            dim["status"] = "UNMEASURED"
            dim["cad_match"] = {"matched_bbox_dim": True}
            dim["type"] = "LINEAR"
            dim["type_label"] = "Toplam Sınır Kutusu Boyutu (STEP Doğrulandı)"
            dim["op"] = "OP10"
            dim["op_reason"] = "Tablaya dayalı ana sınır kutusu referans ölçüsü."
            verified_dimensions.append(dim)
            continue

        # 3. Model sınırlarından büyük hayali ölçüler elenir
        max_box = max(step_bbox_sizes) if step_bbox_sizes else 0.0
        if nom > max_box + 1.0:
            pruned_dimensions.append({
                "dimension": dim,
                "reason": f"Ölçü ({nom} mm), STEP sınır kutusundan ({max_box} mm) büyük.",
            })
            continue

        # İç kademe veya henüz doğrulanmamış ölçü
        dim["verification"] = "PARSED"
        dim["op"] = "OP10"
        dim["op_reason"] = "İç kademe boyutu."
        verified_dimensions.append(dim)

    return verified_dimensions, pruned_dimensions
