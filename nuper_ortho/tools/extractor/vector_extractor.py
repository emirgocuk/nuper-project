import math
import os
import re
from typing import Any, Dict, List, Optional, Tuple

try:
    from extractor.spatial import (
        recognize_vector_gdt_symbols,
        get_point_coords,
        normalize_span_to_local_frame,
        trace_dimension_attachments,
        SpatialHashGrid,
        prune_hatching_lines,
    )
except ImportError:
    from .spatial import (
        recognize_vector_gdt_symbols,
        get_point_coords,
        normalize_span_to_local_frame,
        trace_dimension_attachments,
        SpatialHashGrid,
        prune_hatching_lines,
    )

try:
    from extractor.semantic_grammar import parse_fcf_cells, merge_stacked_hole_callouts
except ImportError:
    from .semantic_grammar import parse_fcf_cells, merge_stacked_hole_callouts


def get_title_block_mask(page_width: float, page_height: float) -> List[Tuple[float, float, float, float]]:
    return [
        (page_width * 0.46, page_height * 0.76, page_width, page_height),
        (page_width * 0.68, 0.0, page_width, page_height * 0.20),
    ]


def is_inside_mask(bbox: Tuple[float, float, float, float], masks: List[Tuple[float, float, float, float]]) -> bool:
    x0, y0, x1, y1 = bbox
    cx = (x0 + x1) / 2.0
    cy = (y0 + y1) / 2.0
    for mx0, my0, mx1, my1 in masks:
        if mx0 <= cx <= mx1 and my0 <= cy <= my1:
            return True
    return False


def is_drawing_border_margin(bbox: Tuple[float, float, float, float], page_width: float, page_height: float, margin: float = 45.0, text: str = "") -> bool:
    x0, y0, x1, y1 = bbox
    cx = (x0 + x1) / 2.0
    cy = (y0 + y1) / 2.0
    if cx < 75.0 or cx > page_width - margin or cy < margin or cy > page_height - margin:
        return True
    if text:
        clean = text.strip()
        if re.match(r"^[1-8A-H]$", clean):
            if cy < 50.0 or cy > page_height - 50.0 or cx < 90.0 or cx > page_width - 90.0:
                return True
    return False


def extract_fcf_boxes(page: Any) -> List[Dict[str, Any]]:
    fcf_boxes = []
    try:
        drawings = page.get_drawings()
        for d in drawings:
            rect = d.get("rect")
            if not rect:
                continue
            w = rect.width
            h = rect.height
            if 8.0 <= h <= 45.0 and 22.0 <= w <= 450.0:
                fcf_boxes.append({
                    "bbox": [round(rect.x0, 1), round(rect.y0, 1), round(rect.x1, 1), round(rect.y1, 1)],
                    "width": round(w, 1),
                    "height": round(h, 1),
                })
    except Exception:
        pass
    return fcf_boxes


def extract_vector_dimensions_from_page(page: Any, page_num: int = 1) -> Dict[str, Any]:
    rect = page.rect
    page_w = rect.width
    page_h = rect.height
    masks = get_title_block_mask(page_w, page_h)
    fcf_boxes = extract_fcf_boxes(page)

    page_dict = page.get_text("dict")
    spans_pool = []

    try:
        drawings = page.get_drawings()
    except Exception:
        drawings = []
    drawings = prune_hatching_lines(drawings)
    vector_symbols = recognize_vector_gdt_symbols(drawings, rect)

    for sym in vector_symbols:
        sb = sym["bbox"]
        spans_pool.append({
            "text": sym["symbol"],
            "font": "VectorGeometry",
            "size": round(max(sb[3] - sb[1], 10.0), 2),
            "origin": (sb[0], sb[3]),
            "bbox": sb,
            "rotation": 0.0,
            "flags": 0,
            "is_vector_symbol": True,
        })

    for block in page_dict.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            dir_x, dir_y = line.get("dir", (1.0, 0.0))
            rotation_deg = round(math.degrees(math.atan2(dir_y, dir_x)), 1)
            line_text = "".join(s.get("text", "") for s in line.get("spans", [])).strip()
            is_line_note = False
            if (
                len(line_text) > 40
                or re.search(r"\b(NOTLAR|NOTES|KAPLAMA|BOYA|PAINT|COATING|TEST|TESTE|BEL[Iİ]RT[Iİ]LM[Eİ]D[Iİ]K[CÇ]E|Y[UÜ]ZEY|PRZL|PURUZL|P[UÜ]R[UÜ]Z|KONTROL|UYGULANACAK|OLACAK|OLACAKTIR|YAPILACAK|YAPILACAKTIR|EN\s+AZ|EN\s+FAZLA|GER[Iİ]L[Iİ]M|DEFORMASYON|KAF[Iİ]LE|FIRIN|ISIL|MARKALAMA|MARKALANACAK|STANDART|STANDARD|MALZEME|MATERIAL|YAZI|BUYUKLUGU|MODEL|KOPYA|ONAY|APPROVED|SHEET|SAYFA|DOK[UÜ]MAN|TOLERANSLARI|OTHERS|D[Iİ][GĞ]ER)\b", line_text, re.I)
                or re.match(r"^\s*\d+[\.\-\)]\s+[A-Za-z\u00C0-\u017F]", line_text)
                or re.match(r"^\s*\d+[\.\-\)]\s*$", line_text)
            ):
                is_line_note = True

            for span in line.get("spans", []):
                txt = span.get("text", "").strip()
                if not txt:
                    continue
                bbox = span.get("bbox", (0, 0, 0, 0))
                if is_inside_mask(bbox, masks):
                    continue
                if is_drawing_border_margin(bbox, page_w, page_h, text=txt):
                    continue
                if re.search(r"MAHFUZDUR|RESERVED|DOK[UÜ]MANLARIN|ÇOĞALTILAMAZ|ASILSIZDIR|GİZLİDİR|PROPRIETARY", txt, re.I):
                    continue
                if re.search(r"AVİYONİK|AVIONICS|BUSINESS SECTOR|BAŞKANLIĞI", txt, re.I):
                    continue
                if is_line_note or len(txt) > 35:
                    continue
                if re.match(r"^\s*\d+\s*[\/\\]\s*\d+\s*$", txt):
                    continue
                if re.search(r"\b(KG|SAAT|HOUR|HOURS|M[Iİ]KRON|MICRON|PPM|RPM|SEC|SN)\b|[~µu]m\b", txt, re.I):
                    continue
                if re.match(r"^\s*\d+[\.\-\)]\s*$", txt) or re.match(r"^\s*\d+[\.\-\)]\s+[A-Za-z\u00C0-\u017F]", txt):
                    continue
                if re.search(r"\b\d{2}\.\d{2}\.\d{2,4}\b", txt):
                    continue

                spans_pool.append({
                    "text": txt,
                    "font": span.get("font", ""),
                    "size": round(span.get("size", 10.0), 2),
                    "origin": span.get("origin", (0, 0)),
                    "bbox": [round(b, 1) for b in bbox],
                    "rotation": rotation_deg,
                    "flags": span.get("flags", 0),
                })

    grouped_dimensions = []
    used_spans = set()
    span_grid = SpatialHashGrid(cell_size=24.0)
    for idx_s, sp in enumerate(spans_pool):
        span_grid.insert(sp["bbox"], (idx_s, sp))

    for i, s in enumerate(spans_pool):
        if i in used_spans:
            continue
        txt = s["text"]

        if re.search(r"[°\^]C|OC\b|ASTM|MIL-STD|SAE\b|HRC|HB\b|DIN\b|EN\b\s*\d+|ISO\b\s*\d+", txt, re.I):
            continue

        nom_match = re.search(r"(?:[Ø\u00d8@]|R|M)?\s*([0-9]+(?:\.[0-9]+)?)", txt)
        if not nom_match:
            continue

        if re.match(r"^[A-Z]$", txt) or (re.match(r"^[0-9]$", txt) and s["size"] < 11.0):
            continue

        base_nom = float(nom_match.group(1))
        if base_nom < 0.2 or base_nom > 3500.0:
            continue
        if base_nom in [2375.0, 1907.0, 1444.0, 2417.0, 2024.0, 2025.0, 2026.0]:
            continue

        main_size = s["size"]
        main_bbox = s["bbox"]
        nearby_spans = span_grid.query_radius(main_bbox, 35.0)

        sym_prefix = ""
        for j, other in nearby_spans:
            if i == j or j in used_spans:
                continue
            if other.get("is_vector_symbol"):
                ob = other["bbox"]
                dx = main_bbox[0] - ob[2]
                dy = abs(((main_bbox[1] + main_bbox[3]) / 2.0) - ((ob[1] + ob[3]) / 2.0))
                if -2.0 <= dx <= 8.0 and dy <= 6.0:
                    sym_prefix = other["text"]
                    used_spans.add(j)
                    break

        span_rot = s.get("rotation", 0.0)
        loc_main = normalize_span_to_local_frame(main_bbox, span_rot)

        tol_candidates = []
        for j, other in nearby_spans:
            if i == j or j in used_spans:
                continue
            loc_other = normalize_span_to_local_frame(other["bbox"], span_rot)
            dx = loc_other[0] - loc_main[2]
            dy = abs(loc_other[1] - loc_main[1])
            is_smaller = other["size"] <= main_size * 0.85
            if -6.0 <= dx <= 28.0 and dy <= 22.0 and is_smaller:
                other_text = other["text"]
                if re.search(r"[+-]?[0-9\.]+|[0-9\.]+", other_text):
                    tol_candidates.append((j, other, loc_other))

        upper_tol = ""
        lower_tol = ""
        combined_str = f"{sym_prefix}{txt}" if sym_prefix and not txt.startswith(sym_prefix) else txt

        if len(tol_candidates) >= 2:
            c1_idx, c1, loc_c1 = tol_candidates[0]
            c2_idx, c2, loc_c2 = tol_candidates[1]
            used_spans.add(c1_idx)
            used_spans.add(c2_idx)
            t1 = c1["text"]
            t2 = c2["text"]
            if "+" in t1 and ("-" in t2 or t2 in ("0", "-0")):
                upper_cand, lower_cand = c1, c2
            elif "+" in t2 and ("-" in t1 or t1 in ("0", "-0")):
                upper_cand, lower_cand = c2, c1
            else:
                upper_cand = c1 if loc_c1[1] > loc_c2[1] else c2
                lower_cand = c2 if loc_c1[1] > loc_c2[1] else c1
            upper_tol = upper_cand["text"]
            lower_tol = lower_cand["text"]
            combined_str = f"{combined_str} {upper_tol}/{lower_tol}"
        elif len(tol_candidates) == 1:
            c_idx, c, _ = tol_candidates[0]
            used_spans.add(c_idx)
            t_txt = c["text"]
            if "±" in t_txt:
                val = t_txt.replace("±", "").strip()
                upper_tol = f"+{val}"
                lower_tol = f"-{val}"
            elif "+" in t_txt:
                upper_tol = t_txt.strip()
            elif "-" in t_txt:
                lower_tol = t_txt.strip()
            combined_str = f"{combined_str} {t_txt}"

        used_spans.add(i)
        rot_val = abs(float(s.get("rotation", 0.0))) % 180.0
        if rot_val <= 25.0 or rot_val >= 155.0:
            dim_orientation = "HORIZONTAL"
        elif 65.0 <= rot_val <= 115.0:
            dim_orientation = "VERTICAL"
        else:
            dim_orientation = "ANGLED"

        dim_cx = (main_bbox[0] + main_bbox[2]) / 2.0
        dim_cy = (main_bbox[1] + main_bbox[3]) / 2.0

        if dim_cy < page_h * 0.5:
            dim_view = "VIEW_TOP_XY"
            dim_axis = "X" if dim_orientation == "HORIZONTAL" else "Z"
        elif dim_cx < page_w * 0.55:
            dim_view = "VIEW_FRONT_XZ"
            dim_axis = "X" if dim_orientation == "HORIZONTAL" else "Y"
        else:
            dim_view = "VIEW_SIDE_YZ"
            dim_axis = "Z" if dim_orientation == "HORIZONTAL" else "Y"

        attachment_info = trace_dimension_attachments(main_bbox, drawings, nominal_val=base_nom, text_spans=spans_pool)

        grouped_dimensions.append({
            "raw_text": combined_str,
            "nominal": base_nom,
            "upper_tol": upper_tol,
            "lower_tol": lower_tol,
            "bbox": main_bbox,
            "rotation": s["rotation"],
            "font_size": s["size"],
            "page": page_num,
            "page_number": page_num,
            "orientation": dim_orientation,
            "view_cluster": dim_view,
            "inferred_axis": dim_axis,
            "attachments": attachment_info,
        })

    fcf_annotations = []
    for fbox in fcf_boxes:
        fb = fbox["bbox"]
        dividers = []
        for d in drawings:
            for it in d.get("items", []):
                cmd = it[0] if isinstance(it, (list, tuple)) and len(it) > 0 else ""
                if cmd == "l" and len(it) >= 3:
                    p1 = get_point_coords(it[1])
                    p2 = get_point_coords(it[2])
                    if abs(p1[0] - p2[0]) <= 2.0:
                        lx = (p1[0] + p2[0]) / 2.0
                        ly_min = min(p1[1], p2[1])
                        ly_max = max(p1[1], p2[1])
                        if fb[0] < lx < fb[2] and ly_max >= fb[1] and ly_min <= fb[3]:
                            dividers.append(lx)

        fcf_res = parse_fcf_cells(fbox, spans_pool, vertical_dividers=dividers)
        if fcf_res.get("characteristic") != "UNKNOWN" or any(c.get("content") for c in fcf_res.get("cells", [])):
            fcf_annotations.append(fcf_res)
        else:
            inside_texts = []
            for s in spans_pool:
                sb = s["bbox"]
                cx = (sb[0] + sb[2]) / 2.0
                cy = (sb[1] + sb[3]) / 2.0
                if fb[0] <= cx <= fb[2] and fb[1] <= cy <= fb[3]:
                    inside_texts.append(s["text"])
            if inside_texts:
                fcf_annotations.append({
                    "characteristic": "UNKNOWN",
                    "symbol": "",
                    "tolerance_value": 0.0,
                    "is_diameter_zone": False,
                    "material_condition": None,
                    "primary_datum": None,
                    "secondary_datum": None,
                    "tertiary_datum": None,
                    "raw_fcf": " | ".join(inside_texts),
                    "cells": [],
                    "bbox": fb,
                })

    grouped_dimensions = merge_stacked_hole_callouts(grouped_dimensions)

    return {
        "page": page_num,
        "page_width": page_w,
        "page_height": page_h,
        "dimensions": grouped_dimensions,
        "fcf_annotations": fcf_annotations,
        "total_text_spans": len(spans_pool),
    }
