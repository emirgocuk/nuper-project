import json
import re
import urllib.request
from typing import Any, Dict, List, Optional, Tuple


def normalize_engineering_callout(raw_text: str) -> Dict[str, Any]:
    cleaned = raw_text.strip()
    cleaned = re.sub(r"[\u00d8\u00f8\u2300\u2349\xa2@]", "Ø", cleaned)
    cleaned = re.sub(r"\b[Oo]([0-9]+(?:\.[0-9]+)?)\b", r"Ø\1", cleaned)
    cleaned = cleaned.replace("+-", "±").replace("+/-", "±")

    thread_match = re.search(r"(\d+)\s*[xX]\s*M([0-9]+(?:\.[0-9]+)?)", cleaned, re.IGNORECASE)
    if thread_match:
        qty = int(thread_match.group(1))
        nom = float(thread_match.group(2))
        return {
            "type": "HOLE",
            "type_label": f"Montaj Diş/Delik Grubu ({qty}x)",
            "count": qty,
            "nominal": nom,
            "nominal_str": f"{qty}x M{nom}",
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Dikey Z-probu ile üstten tek bağlamada ölçülebilir dişli delik.",
        }

    hole_group_match = re.search(r"(\d+)\s*[xX]\s*(?:Ø|DIA)\s*([0-9]+(?:\.[0-9]+)?)", cleaned, re.IGNORECASE)
    if hole_group_match:
        qty = int(hole_group_match.group(1))
        nom = float(hole_group_match.group(2))
        return {
            "type": "HOLE",
            "type_label": f"Montaj Delik Grubu ({qty}x)",
            "count": qty,
            "nominal": nom,
            "nominal_str": f"{qty}x Ø{nom}",
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Dikey Z-probu ile üstten tek bağlamada ölçülebilir.",
        }

    dia_match = re.search(r"(?:Ø|DIA)\s*([0-9]+(?:\.[0-9]+)?)(?:\s*([A-Za-z]\d+))?", cleaned)
    if dia_match:
        nom = float(dia_match.group(1))
        fit = dia_match.group(2) or ""
        u_tol = "+0.021" if fit == "H7" and 18.0 <= nom <= 30.0 else "+0.05"
        l_tol = "0.0" if fit == "H7" else "-0.05"
        return {
            "type": "DIAMETER",
            "type_label": "Silindirik Çap / Delik",
            "count": 1,
            "nominal": nom,
            "nominal_str": f"Ø{nom} {fit}".strip(),
            "fit": fit,
            "upper_tol": u_tol,
            "lower_tol": l_tol,
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Dikey mil/delik geometrisi.",
        }

    rad_match = re.search(r"(?:(\d+)\s*[xX]\s*)?R\s*([0-9]+(?:\.[0-9]+)?)(?:\s*\(x(\d+)\))?", cleaned, re.IGNORECASE)
    if rad_match:
        q1 = int(rad_match.group(1)) if rad_match.group(1) else None
        q2 = int(rad_match.group(3)) if rad_match.group(3) else None
        qty = q1 or q2 or 1
        nom = float(rad_match.group(2))
        return {
            "type": "RADIUS",
            "type_label": "Kavis / Yarıçap (Fillet/Round)",
            "count": qty,
            "nominal": nom,
            "nominal_str": f"R{nom}" if qty == 1 else f"{qty}x R{nom}",
            "upper_tol": "+0.2",
            "lower_tol": "-0.2",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Parça dış/iç kavis yüzeyi.",
        }

    rep_lin_match = re.search(r"(\d+)\s*[xX]\s*([0-9]+(?:\.[0-9]+)?)(?:\s*(?:±|\+-)\s*([0-9]+(?:\.[0-9]+)?))?", cleaned)
    if rep_lin_match:
        qty = int(rep_lin_match.group(1))
        nom = float(rep_lin_match.group(2))
        tol_val = float(rep_lin_match.group(3)) if rep_lin_match.group(3) else 0.1
        return {
            "type": "LINEAR",
            "type_label": f"Doğrusal Boyut ({qty}x)",
            "count": qty,
            "nominal": nom,
            "nominal_str": f"{qty}x {nom}" + (f" ±{tol_val}" if rep_lin_match.group(3) else ""),
            "upper_tol": f"+{tol_val}",
            "lower_tol": f"-{tol_val}",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Ana sınır kutusu veya kademe boyutu.",
        }

    lin_tol_match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*(?:±|\+-)\s*([0-9]+(?:\.[0-9]+)?)", cleaned)
    if lin_tol_match:
        nom = float(lin_tol_match.group(1))
        tol_val = float(lin_tol_match.group(2))
        return {
            "type": "LINEAR",
            "type_label": "Doğrusal Boyut (Toleranslı)",
            "count": 1,
            "nominal": nom,
            "nominal_str": f"{nom} ±{tol_val}",
            "upper_tol": f"+{tol_val}",
            "lower_tol": f"-{tol_val}",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Parça üst yüzey derinliği / mesafesi.",
        }

    asym_match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*([+-][0-9\.]+)\s*/\s*([+-][0-9\.]+)", cleaned)
    if asym_match:
        nom = float(asym_match.group(1))
        u_tol = asym_match.group(2)
        l_tol = asym_match.group(3)
        return {
            "type": "LINEAR",
            "type_label": "Doğrusal Boyut (Asimetrik Tolerans)",
            "count": 1,
            "nominal": nom,
            "nominal_str": f"{nom} {u_tol}/{l_tol}",
            "upper_tol": u_tol,
            "lower_tol": l_tol,
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Hassas işlenmiş basamak / referans kademesi.",
        }

    num_match = re.search(r"([0-9]+(?:\.[0-9]+)?)", cleaned)
    if num_match:
        nom = float(num_match.group(1))
        is_large = nom > 100.0
        return {
            "type": "LINEAR",
            "type_label": "Toplam Boy / Genişlik" if is_large else "Doğrusal Boyut",
            "count": 1,
            "nominal": nom,
            "nominal_str": str(nom),
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Ana sınır kutusu veya kademe boyutu.",
        }

    return {
        "type": "CUSTOM",
        "type_label": "Özel Ölçü / Not",
        "count": 1,
        "nominal": 0.0,
        "nominal_str": cleaned,
        "upper_tol": "",
        "lower_tol": "",
        "unit": "mm",
        "op": "OP10",
        "op_reason": "Genel özellik.",
    }


def parse_fcf_cells(
    fcf_box: Dict[str, Any],
    text_spans: List[Dict[str, Any]],
    vertical_dividers: Optional[List[float]] = None,
) -> Dict[str, Any]:
    bbox = fcf_box.get("bbox", [0.0, 0.0, 0.0, 0.0])
    x0, y0, x1, y1 = bbox

    divs = sorted([d for d in (vertical_dividers or []) if x0 < d < x1])
    divs_clean: List[float] = []
    for d in divs:
        if not divs_clean or abs(d - divs_clean[-1]) > 3.0:
            divs_clean.append(d)

    boundary_x = [x0] + divs_clean + [x1]
    cell_intervals = []
    for idx in range(len(boundary_x) - 1):
        cell_intervals.append((boundary_x[idx], boundary_x[idx + 1]))

    spans_inside = []
    for s in text_spans:
        sb = s.get("bbox", [0.0, 0.0, 0.0, 0.0])
        scx = (sb[0] + sb[2]) / 2.0
        scy = (sb[1] + sb[3]) / 2.0
        if x0 - 2.0 <= scx <= x1 + 2.0 and y0 - 3.0 <= scy <= y1 + 3.0:
            spans_inside.append((scx, s))

    spans_inside.sort(key=lambda pair: pair[0])

    cells_data: List[Dict[str, Any]] = []
    for cell_idx, (cx0, cx1) in enumerate(cell_intervals):
        cell_spans = []
        for scx, s in spans_inside:
            if cx0 <= scx < cx1 or (cell_idx == len(cell_intervals) - 1 and cx0 <= scx <= cx1 + 2.0):
                cell_spans.append(s.get("text", "").strip())
        content = " ".join([t for t in cell_spans if t]).strip()
        cells_data.append({
            "cell_index": cell_idx,
            "boundary": [round(cx0, 1), round(cx1, 1)],
            "content": content,
        })

    char_map = {
        "⌖": "POSITION",
        "⌒": "PROFILE",
        "⊥": "PERPENDICULARITY",
        "▱": "FLATNESS",
        "∥": "PARALLELISM",
        "◎": "CONCENTRICITY",
        "∠": "ANGULARITY",
        "↗": "CIRCULAR_RUNOUT",
        "⌰": "TOTAL_RUNOUT",
        "⌯": "SYMMETRY",
        "-": "STRAIGHTNESS",
        "○": "CIRCULARITY",
        "⌭": "CYLINDRICITY",
    }

    characteristic = "UNKNOWN"
    symbol = ""
    tol_val = 0.0
    is_dia = False
    mod = None
    primary_datum = None
    secondary_datum = None
    tertiary_datum = None

    if cells_data:
        c0_text = cells_data[0]["content"]
        for sym_char, char_name in char_map.items():
            if sym_char in c0_text:
                characteristic = char_name
                symbol = sym_char
                break
        if not symbol:
            c0_upper = c0_text.upper()
            if "POS" in c0_upper or "CONC" in c0_upper:
                characteristic = "POSITION"
                symbol = "⌖"
            elif "PROF" in c0_upper:
                characteristic = "PROFILE"
                symbol = "⌒"
            elif "PERP" in c0_upper:
                characteristic = "PERPENDICULARITY"
                symbol = "⊥"
            elif "FLAT" in c0_upper:
                characteristic = "FLATNESS"
                symbol = "▱"
            elif "PARA" in c0_upper:
                characteristic = "PARALLELISM"
                symbol = "∥"

    if len(cells_data) > 1:
        c1_text = cells_data[1]["content"]
        if "Ø" in c1_text or "DIA" in c1_text.upper():
            is_dia = True
        if "Ⓜ" in c1_text or re.search(r"\bM\b", c1_text):
            mod = "MMC"
        elif "Ⓛ" in c1_text or re.search(r"\bL\b", c1_text):
            mod = "LMC"
        elif "Ⓟ" in c1_text or re.search(r"\bP\b", c1_text):
            mod = "PROJECTED"

        val_m = re.search(r"([0-9]+(?:\.[0-9]+)?)", c1_text)
        if val_m:
            tol_val = float(val_m.group(1))

    datum_cells = cells_data[2:]
    datums_extracted = []
    for d_cell in datum_cells:
        raw_d = d_cell["content"].strip()
        d_clean = re.sub(r"[ⓂⓁⓅ]", "", raw_d).strip()
        dm = re.search(r"([A-Z](?:-[A-Z])?)", d_clean)
        if dm:
            datums_extracted.append(dm.group(1))

    if len(datums_extracted) >= 1:
        primary_datum = datums_extracted[0]
    if len(datums_extracted) >= 2:
        secondary_datum = datums_extracted[1]
    if len(datums_extracted) >= 3:
        tertiary_datum = datums_extracted[2]

    all_contents = [c["content"] for c in cells_data if c["content"]]
    raw_fcf = " | ".join(all_contents)
    if not raw_fcf.startswith("|"):
        raw_fcf = f"| {raw_fcf} |"

    return {
        "characteristic": characteristic,
        "symbol": symbol,
        "tolerance_value": tol_val,
        "is_diameter_zone": is_dia,
        "material_condition": mod,
        "primary_datum": primary_datum,
        "secondary_datum": secondary_datum,
        "tertiary_datum": tertiary_datum,
        "raw_fcf": raw_fcf,
        "cells": cells_data,
        "bbox": bbox,
    }


def build_321_alignment(datums: List[str]) -> Dict[str, Any]:
    alignment_scheme = {
        "strategy": "3-2-1 Alignment",
        "primary": None,
        "secondary": None,
        "tertiary": None,
        "dof_locked": 6,
    }

    if "A" in datums or len(datums) >= 1:
        alignment_scheme["primary"] = {
            "datum": "A",
            "geometry": "PLANE",
            "points": 3,
            "role": "Taban Yüzeyi (Primer) — Z Yönelimi ve Z Ötelemesi Kilitler (3 DOF)",
        }
    if "B" in datums or len(datums) >= 2:
        alignment_scheme["secondary"] = {
            "datum": "B",
            "geometry": "CYLINDER",
            "points": 2,
            "role": "Merkez Delik / Kenar Ekseni (Sekonder) — X/Y Yönelim ve 1 Öteleme Kilitler (2 DOF)",
        }
    if "C" in datums or len(datums) >= 3:
        alignment_scheme["tertiary"] = {
            "datum": "C",
            "geometry": "PLANE",
            "points": 1,
            "role": "Yan Dayama / Kanal Yüzeyi (Tersiyer) — Son Kalan Öteleme Kilitler (1 DOF)",
        }

    return alignment_scheme


def classify_operation_setup(feature: Dict[str, Any], normal_z: float = 1.0) -> Tuple[str, str]:
    f_type = feature.get("type", "")

    if abs(normal_z) < 0.3:
        return "OP20", "PH10 A90 / B açılı prob kafası veya parça çevirme gerektirir."

    if f_type in ("HOLE", "DIAMETER", "LINEAR", "RADIUS"):
        return "OP10", "Dikey Z- probu (A0B0) ile parça tablaya düz bağlıyken doğrudan taranabilir."

    return "OP10", "Standart üst kurulum (OP10)."


def try_local_llm_semantic_parse(text_snippet: str) -> Optional[Dict[str, Any]]:
    url = "http://localhost:11434/api/generate"
    prompt = (
        f"You are a CMM metrology parser. Parse this callout into JSON with keys: "
        f"type, count, nominal, upper_tol, lower_tol. Text: '{text_snippet}'"
    )
    payload = json.dumps({
        "model": "qwen2.5-coder:3b",
        "prompt": prompt,
        "stream": False,
        "format": "json",
    }).encode("utf-8")

    try:
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=0.15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return json.loads(data.get("response", "{}"))
    except Exception:
        return None
