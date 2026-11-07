import os
import re
from typing import Any, Dict, List, Optional


TOLERANCE_ENTITY_TYPES = {
    "FLATNESS_TOLERANCE": "FLATNESS",
    "CYLINDRICITY_TOLERANCE": "CYLINDRICITY",
    "ROUNDNESS_TOLERANCE": "CIRCULARITY",
    "STRAIGHTNESS_TOLERANCE": "STRAIGHTNESS",
    "PERPENDICULARITY_TOLERANCE": "PERPENDICULARITY",
    "PARALLELISM_TOLERANCE": "PARALLELISM",
    "ANGULARITY_TOLERANCE": "ANGULARITY",
    "POSITION_TOLERANCE": "POSITION",
    "SURFACE_PROFILE_TOLERANCE": "SURFACE_PROFILE",
    "LINE_PROFILE_TOLERANCE": "LINE_PROFILE",
    "CIRCULAR_RUNOUT_TOLERANCE": "CIRCULAR_RUNOUT",
    "TOTAL_RUNOUT_TOLERANCE": "TOTAL_RUNOUT",
    "COAXIALITY_TOLERANCE": "CONCENTRICITY",
    "CONCENTRICITY_TOLERANCE": "CONCENTRICITY",
    "SYMMETRY_TOLERANCE": "SYMMETRY",
}


def parse_step_pmi(step_path_or_content: str, is_content: bool = False) -> Dict[str, Any]:
    if is_content:
        content = step_path_or_content
    else:
        if not os.path.exists(step_path_or_content):
            return {"success": False, "error": f"Dosya bulunamadı: {step_path_or_content}"}
        with open(step_path_or_content, "r", encoding="latin-1", errors="ignore") as f:
            content = f.read()

    is_ap242 = "AP242" in content.upper()

    # 1. Parse Datums
    datums: List[Dict[str, Any]] = []
    datum_regex = re.compile(
        r"#(\d+)\s*=\s*DATUM\s*\(\s*'([^']*)'\s*,\s*(?:\([^)]*\)|#[0-9]+)\s*,\s*(?:\$|'[^']*')\s*,\s*#(\d+)\s*,\s*\.(T|F)\.\s*,\s*'([^']*)'\s*\)",
        re.IGNORECASE,
    )
    for m in datum_regex.finditer(content):
        datums.append({
            "step_id": m.group(1),
            "label": m.group(2) or m.group(5),
            "feature_id": m.group(3),
            "is_datum": True,
        })

    # Simpler fallback datum match
    if not datums:
        simple_datum_regex = re.compile(r"#(\d+)\s*=\s*DATUM\s*\(\s*'([^']*)'", re.IGNORECASE)
        for m in simple_datum_regex.finditer(content):
            datums.append({
                "step_id": m.group(1),
                "label": m.group(2),
                "is_datum": True,
            })

    # 2. Parse Geometric Tolerances
    tolerances: List[Dict[str, Any]] = []
    # Match geometric tolerances
    for entity_name, gdt_type in TOLERANCE_ENTITY_TYPES.items():
        pattern = re.compile(
            rf"#(\d+)\s*=\s*{entity_name}\s*\(\s*'([^']*)'\s*,\s*(?:'[^']*'|\$)\s*,\s*#?([-\d.eE+]+|#\d+)",
            re.IGNORECASE,
        )
        for m in pattern.finditer(content):
            tol_id = m.group(1)
            name = m.group(2)
            val_raw = m.group(3)
            tol_val = 0.0
            if not val_raw.startswith("#"):
                try:
                    tol_val = float(val_raw)
                except ValueError:
                    tol_val = 0.0

            tolerances.append({
                "step_id": tol_id,
                "type": gdt_type,
                "name": name,
                "value": tol_val,
                "entity": entity_name,
            })

    # Length measures / tolerance values resolution: #id = LENGTH_MEASURE_WITH_UNIT(LENGTH_MEASURE(0.05), ...)
    measure_regex = re.compile(
        r"#(\d+)\s*=\s*(?:LENGTH_MEASURE_WITH_UNIT|MEASURE_WITH_UNIT)\s*\(\s*LENGTH_MEASURE\s*\(\s*([-\d.eE+]+)\s*\)",
        re.IGNORECASE,
    )
    measure_map = {}
    for m in measure_regex.finditer(content):
        measure_map[m.group(1)] = float(m.group(2))

    for tol in tolerances:
        if tol["value"] == 0.0:
            # Check if reference to a length measure
            for mid, mval in measure_map.items():
                if f"#{mid}" in content[max(0, content.find(f"#{tol['step_id']}")):content.find(f"#{tol['step_id']}") + 200]:
                    tol["value"] = mval
                    break

    # 3. Parse Saved Views (ASME Y14.41 / AP242 Model Geometric Views)
    saved_views: List[Dict[str, Any]] = []
    view_regex = re.compile(
        r"#(\d+)\s*=\s*(?:DEFAULT_MODEL_GEOMETRIC_VIEW|MODEL_GEOMETRIC_VIEW)\s*\(\s*'([^']*)'",
        re.IGNORECASE,
    )
    for m in view_regex.finditer(content):
        saved_views.append({
            "step_id": m.group(1),
            "name": m.group(2),
        })

    # 4. Parse Dimensional Characteristic / Sizes
    dimensions: List[Dict[str, Any]] = []
    dim_regex = re.compile(
        r"#(\d+)\s*=\s*DIMENSIONAL_CHARACTERISTIC_REPRESENTATION\s*\(\s*#(\d+)\s*,\s*#(\d+)\s*\)",
        re.IGNORECASE,
    )
    for m in dim_regex.finditer(content):
        dimensions.append({
            "step_id": m.group(1),
            "characteristic_id": m.group(2),
            "representation_id": m.group(3),
        })

    has_pmi = len(datums) > 0 or len(tolerances) > 0 or len(saved_views) > 0

    return {
        "success": True,
        "is_ap242": is_ap242,
        "has_semantic_pmi": has_pmi,
        "datums": datums,
        "geometric_tolerances": tolerances,
        "saved_views": saved_views,
        "dimensions_count": len(dimensions),
    }


def extract_pmi_schema_payload(step_path: str) -> Optional[Dict[str, Any]]:
    res = parse_step_pmi(step_path)
    if not res.get("success") or not res.get("has_semantic_pmi"):
        return None

    datums_payload = [{"label": d.get("label", ""), "target_type": "SURFACE"} for d in res.get("datums", []) if d.get("label")]
    tolerances_payload = [
        {
            "tolerance_type": t.get("type", "UNKNOWN"),
            "magnitude": float(t.get("value", 0.0)),
            "zone_unit": "mm",
            "datums": [],
        }
        for t in res.get("geometric_tolerances", [])
    ]
    views_payload = [{"name": v.get("name", "")} for v in res.get("saved_views", []) if v.get("name")]

    return {
        "datums": datums_payload,
        "tolerances": tolerances_payload,
        "dimensions": [],
        "views": views_payload,
    }

