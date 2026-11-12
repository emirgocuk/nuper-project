import math
import re
from typing import List, Dict, Any, Optional, Tuple


def get_point_coords(pt: Any) -> Tuple[float, float]:
    if hasattr(pt, "x") and hasattr(pt, "y"):
        return float(pt.x), float(pt.y)
    if isinstance(pt, (list, tuple)) and len(pt) >= 2:
        return float(pt[0]), float(pt[1])
    return 0.0, 0.0


def get_drawing_bbox(d: Dict[str, Any]) -> Optional[List[float]]:
    r = d.get("rect")
    if r is None:
        return None
    if hasattr(r, "x0"):
        return [float(r.x0), float(r.y0), float(r.x1), float(r.y1)]
    if isinstance(r, (list, tuple)) and len(r) >= 4:
        return [float(r[0]), float(r[1]), float(r[2]), float(r[3])]
    return None


def bbox_distance(b1: List[float], b2: List[float]) -> float:
    dx = max(0.0, max(b1[0] - b2[2], b2[0] - b1[2]))
    dy = max(0.0, max(b1[1] - b2[3], b2[1] - b1[3]))
    return (dx**2 + dy**2)**0.5


def cluster_micro_drawings(
    drawings: List[Dict[str, Any]],
    max_dist: float = 2.5,
    min_size: float = 1.5,
    max_size: float = 22.0,
) -> List[List[Dict[str, Any]]]:
    candidates = []
    for d in drawings:
        box = get_drawing_bbox(d)
        if not box:
            continue
        w = box[2] - box[0]
        h = box[3] - box[1]
        if max(w, h) >= min_size and w <= max_size and h <= max_size:
            candidates.append((d, box))

    if not candidates:
        return []

    clusters: List[List[Tuple[Dict[str, Any], List[float]]]] = []
    for d, box in candidates:
        matched_indices = []
        for idx, cl in enumerate(clusters):
            for _, c_box in cl:
                if bbox_distance(box, c_box) <= max_dist:
                    matched_indices.append(idx)
                    break
        if not matched_indices:
            clusters.append([(d, box)])
        elif len(matched_indices) == 1:
            clusters[matched_indices[0]].append((d, box))
        else:
            first_idx = matched_indices[0]
            new_cl = clusters[first_idx]
            new_cl.append((d, box))
            for other_idx in sorted(matched_indices[1:], reverse=True):
                new_cl.extend(clusters[other_idx])
                clusters.pop(other_idx)

    result = []
    for cl in clusters:
        result.append([item[0] for item in cl])
    return result


def classify_vector_symbol_cluster(cluster: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    min_x = float("inf")
    min_y = float("inf")
    max_x = float("-inf")
    max_y = float("-inf")

    lines: List[Tuple[Tuple[float, float], Tuple[float, float]]] = []
    curves: List[Tuple[Tuple[float, float], Tuple[float, float], Tuple[float, float], Tuple[float, float]]] = []
    rects: List[List[float]] = []
    has_closed_loop = False

    for d in cluster:
        box = get_drawing_bbox(d)
        if box:
            min_x = min(min_x, box[0])
            min_y = min(min_y, box[1])
            max_x = max(max_x, box[2])
            max_y = max(max_y, box[3])

        if d.get("closePath", False):
            has_closed_loop = True

        for it in d.get("items", []):
            cmd = it[0] if isinstance(it, (list, tuple)) and len(it) > 0 else ""
            if cmd == "l" and len(it) >= 3:
                p1 = get_point_coords(it[1])
                p2 = get_point_coords(it[2])
                lines.append((p1, p2))
            elif cmd == "c" and len(it) >= 5:
                p1 = get_point_coords(it[1])
                p2 = get_point_coords(it[2])
                p3 = get_point_coords(it[3])
                p4 = get_point_coords(it[4])
                curves.append((p1, p2, p3, p4))
            elif cmd == "re" and len(it) >= 2:
                r_box = get_drawing_bbox({"rect": it[1]})
                if r_box:
                    rects.append(r_box)

    cw = max_x - min_x
    ch = max_y - min_y
    if cw < 1.5 or ch < 1.5 or cw > 24.0 or ch > 24.0:
        return None

    aspect = cw / ch if ch > 0 else 1.0
    cx = (min_x + max_x) / 2.0
    cy = (min_y + max_y) / 2.0

    circle_candidates = 0
    if len(curves) >= 2 and 0.70 <= aspect <= 1.40:
        circle_candidates += 1
    if len(curves) >= 4 and 0.75 <= aspect <= 1.30:
        circle_candidates += 1
    if not curves and len(lines) >= 6 and 0.75 <= aspect <= 1.30:
        circle_candidates += 1
    if has_closed_loop and (curves or len(lines) >= 4) and 0.75 <= aspect <= 1.30:
        circle_candidates += 1

    has_circle = circle_candidates >= 1

    horiz_lines = []
    vert_lines = []
    diag_lines = []

    for p1, p2 in lines:
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        length = (dx**2 + dy**2)**0.5
        if length < 0.6:
            continue
        angle = math.degrees(math.atan2(abs(dy), abs(dx)))
        if angle <= 20.0:
            horiz_lines.append((p1, p2, length))
        elif angle >= 78.0:
            vert_lines.append((p1, p2, length))
        elif 20.0 < angle < 78.0:
            diag_lines.append((p1, p2, length))

    symbol = None
    confidence = 0.95

    if has_circle:
        if diag_lines:
            symbol = "Ø"
            confidence = 1.0
        elif horiz_lines and vert_lines:
            symbol = "⌖"
            confidence = 0.98
        elif len(curves) >= 4 and len(cluster) >= 2:
            symbol = "◎"
            confidence = 0.90
        elif any(c == "M" for c in cluster if isinstance(c.get("text"), str)):
            symbol = "Ⓜ"
            confidence = 0.95

    if not symbol:
        if horiz_lines and vert_lines and not curves:
            h_line = min(horiz_lines, key=lambda hl: hl[0][1])
            v_line = vert_lines[0]
            v_bottom = max(v_line[0][1], v_line[1][1])
            h_y = h_line[0][1]
            if abs(v_bottom - h_y) <= 4.0:
                symbol = "⊥"
                confidence = 0.98
        elif len(diag_lines) >= 2 and len(lines) == 2:
            p1_a, p2_a, _ = diag_lines[0]
            p1_b, p2_b, _ = diag_lines[1]
            a1 = math.atan2(abs(p2_a[1] - p1_a[1]), abs(p2_a[0] - p1_a[0]))
            a2 = math.atan2(abs(p2_b[1] - p1_b[1]), abs(p2_b[0] - p1_b[0]))
            if abs(a1 - a2) <= math.radians(15.0):
                symbol = "∥"
                confidence = 0.95
        elif len(lines) == 4 and (len(diag_lines) >= 2 or len(horiz_lines) >= 2):
            symbol = "▱"
            confidence = 0.92
        elif len(curves) == 1 and not lines and 0.6 <= aspect <= 2.2:
            symbol = "⌒"
            confidence = 0.90

    if not symbol:
        return None

    return {
        "symbol": symbol,
        "bbox": [round(min_x, 2), round(min_y, 2), round(max_x, 2), round(max_y, 2)],
        "confidence": confidence,
        "cluster_size": len(cluster),
    }


def trace_dimension_attachments(
    dim_bbox: List[float],
    drawings: List[Dict[str, Any]],
    nominal_val: Optional[float] = None,
    page_scale: Optional[float] = None,
) -> Dict[str, Any]:
    x0, y0, x1, y1 = dim_bbox
    cx = (x0 + x1) / 2.0
    cy = (y0 + y1) / 2.0
    bw = x1 - x0
    bh = y1 - y0

    all_lines: List[Tuple[Tuple[float, float], Tuple[float, float]]] = []
    for d in drawings:
        for it in d.get("items", []):
            cmd = it[0] if isinstance(it, (list, tuple)) and len(it) > 0 else ""
            if cmd == "l" and len(it) >= 3:
                p1 = get_point_coords(it[1])
                p2 = get_point_coords(it[2])
                all_lines.append((p1, p2))

    best_dim_line = None
    min_dist = float("inf")
    dim_is_horiz = bw >= bh

    for p1, p2 in all_lines:
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        line_len = (dx**2 + dy**2)**0.5
        if line_len < 10.0:
            continue
        angle = math.degrees(math.atan2(abs(dy), abs(dx)))
        line_cx = (p1[0] + p2[0]) / 2.0
        line_cy = (p1[1] + p2[1]) / 2.0

        if dim_is_horiz and angle <= 20.0:
            dist = abs(line_cy - cy)
            if dist <= 35.0 and abs(line_cx - cx) <= line_len * 0.6:
                if dist < min_dist:
                    min_dist = dist
                    best_dim_line = (p1, p2, line_len, "HORIZONTAL")
        elif not dim_is_horiz and angle >= 70.0:
            dist = abs(line_cx - cx)
            if dist <= 35.0 and abs(line_cy - cy) <= line_len * 0.6:
                if dist < min_dist:
                    min_dist = dist
                    best_dim_line = (p1, p2, line_len, "VERTICAL")

    p_start = None
    p_end = None
    line_length = 0.0
    attachments = []

    if best_dim_line:
        p1, p2, line_length, orientation = best_dim_line
        if p1[0] < p2[0] or (p1[0] == p2[0] and p1[1] < p2[1]):
            p_start = [round(p1[0], 2), round(p1[1], 2)]
            p_end = [round(p2[0], 2), round(p2[1], 2)]
        else:
            p_start = [round(p2[0], 2), round(p2[1], 2)]
            p_end = [round(p1[0], 2), round(p1[1], 2)]

        for p_target in (p_start, p_end):
            matched_for_target = False
            for lp1, lp2 in all_lines:
                for candidate_pt, other_pt in ((lp1, lp2), (lp2, lp1)):
                    dist_to_end = ((candidate_pt[0] - p_target[0])**2 + (candidate_pt[1] - p_target[1])**2)**0.5
                    if dist_to_end <= 4.0:
                        ldx = other_pt[0] - candidate_pt[0]
                        ldy = other_pt[1] - candidate_pt[1]
                        l_len = (ldx**2 + ldy**2)**0.5
                        if l_len >= 8.0:
                            l_angle = math.degrees(math.atan2(abs(ldy), abs(ldx)))
                            if orientation == "HORIZONTAL" and l_angle >= 65.0:
                                attachments.append([round(other_pt[0], 2), round(other_pt[1], 2)])
                                matched_for_target = True
                                break
                            elif orientation == "VERTICAL" and l_angle <= 25.0:
                                attachments.append([round(other_pt[0], 2), round(other_pt[1], 2)])
                                matched_for_target = True
                                break
                if matched_for_target:
                    break

    leader_tip = None
    if not best_dim_line or line_length < 15.0:
        leader_segments = []
        for lp1, lp2 in all_lines:
            d1 = min(((lp1[0] - cx)**2 + (lp1[1] - cy)**2)**0.5, ((lp2[0] - cx)**2 + (lp2[1] - cy)**2)**0.5)
            if d1 <= max(bw, bh) * 1.5 + 25.0:
                leader_segments.append((lp1, lp2))

        if leader_segments:
            furthest_pt = None
            max_d = float("-inf")
            for lp1, lp2 in leader_segments:
                for pt in (lp1, lp2):
                    d_from_center = ((pt[0] - cx)**2 + (pt[1] - cy)**2)**0.5
                    if d_from_center > max_d:
                        max_d = d_from_center
                        furthest_pt = pt
            if furthest_pt and max_d >= 15.0:
                leader_tip = [round(furthest_pt[0], 2), round(furthest_pt[1], 2)]

    scale_consistent = True
    ratio = None
    if best_dim_line and nominal_val is not None and page_scale is not None and nominal_val > 0.0:
        computed_dist = line_length * page_scale
        ratio = computed_dist / nominal_val
        if ratio < 0.65 or ratio > 1.45:
            scale_consistent = False

    return {
        "has_dimension_line": best_dim_line is not None,
        "dimension_line_length_pt": round(line_length, 2),
        "p_start": p_start,
        "p_end": p_end,
        "attachment_points": attachments,
        "leader_tip": leader_tip,
        "scale_consistent": scale_consistent,
        "computed_scale_ratio": round(ratio, 3) if ratio is not None else None,
    }


def normalize_span_to_local_frame(
    bbox: List[float],
    rotation_deg: float,
) -> List[float]:
    deg = rotation_deg % 360.0
    x0, y0, x1, y1 = bbox
    corners = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
    rad = math.radians(-deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)
    tx = []
    ty = []
    for x, y in corners:
        lx = x * cos_a - y * sin_a
        ly = x * sin_a + y * cos_a
        tx.append(lx)
        ty.append(ly)
    return [round(min(tx), 2), round(min(ty), 2), round(max(tx), 2), round(max(ty), 2)]


def recognize_vector_gdt_symbols(
    drawings: List[Dict[str, Any]],
    page_rect: Any = None,
) -> List[Dict[str, Any]]:
    if not drawings:
        return []

    clusters = cluster_micro_drawings(drawings)
    recognized = []
    for cl in clusters:
        sym = classify_vector_symbol_cluster(cl)
        if sym:
            recognized.append(sym)
    return recognized


def match_spatial_bbox(
    target_str: str,
    items: List[Dict[str, Any]],
    default_box: Optional[List[float]] = None,
) -> List[float]:
    if default_box is None:
        default_box = [100.0, 100.0, 200.0, 120.0]

    clean_target = target_str.replace("Ø", "").replace("R", "").replace("±", "").strip()
    if not clean_target:
        return default_box

    norm_target = re.sub(r"[°\*\^]", "", clean_target).strip()
    target_pat = re.compile(r"(?<![A-Za-z0-9_\-\.])" + re.escape(norm_target) + r"(?![A-Za-z0-9_\-\.])", re.IGNORECASE)
    for item in items:
        item_text = item.get("text", "")
        norm_item = re.sub(r"[°\*\^]", "", item_text).strip()
        if target_pat.search(norm_item):
            return item.get("bbox", default_box)

    ch_m = re.match(r"(\d+(?:\.\d+)?)\s*x\s*45", norm_target, re.I)
    if ch_m:
        n_val = ch_m.group(1)
        for item in items:
            t = item.get("text", "")
            if "45" in t and (f"{n_val} x45" in t or f"{n_val}x45" in t or (n_val in t and "x" in t)):
                return item.get("bbox", default_box)

    if len(clean_target) > 2:
        for item in items:
            if clean_target in item.get("text", ""):
                return item.get("bbox", default_box)

    return default_box


def normalize_spatial_tokens(raw_tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    tokens = []
    for t in raw_tokens:
        text = t.get("text", "").strip()
        bbox = t.get("bbox", [0.0, 0.0, 0.0, 0.0])
        conf = float(t.get("confidence", 1.0))
        if text:
            tokens.append({
                "text": text,
                "bbox": [round(c, 2) for c in bbox],
                "confidence": round(conf, 4),
            })
    return tokens


def find_spatial_tolerances_near(
    box: List[float],
    items: List[Dict[str, Any]],
    max_dist: float = 35.0,
) -> Tuple[Optional[str], Optional[str]]:
    candidates = []
    for it in items:
        t = it.get("text", "").strip()
        b = it.get("bbox", [0.0, 0.0, 0.0, 0.0])
        dx = min(abs(b[0] - box[2]), abs(b[2] - box[0])) if not (b[0] <= box[2] and b[2] >= box[0]) else 0
        dy = min(abs(b[1] - box[3]), abs(b[3] - box[1])) if not (b[1] <= box[3] and b[3] >= box[1]) else 0
        dist = (dx**2 + dy**2)**0.5
        if dist <= max_dist and t:
            m_pm = re.match(r"^±\s*([0-9]+(?:\.[0-9]+)?)$", t)
            m_plus = re.match(r"^\+\s*([0-9]+(?:\.[0-9]+)?)$", t)
            m_minus = re.match(r"^-\s*([0-9]+(?:\.[0-9]+)?)$", t)
            if m_pm:
                val = m_pm.group(1)
                candidates.append((dist, "pm", f"+{val}", f"-{val}"))
            elif m_plus:
                val = m_plus.group(1)
                candidates.append((dist, "plus", f"+{val}", None))
            elif m_minus:
                val = m_minus.group(1)
                candidates.append((dist, "minus", None, f"-{val}"))
            elif t == "+0":
                candidates.append((dist, "plus", "+0", None))
            elif t in ["0", "-0"]:
                candidates.append((dist, "zero", None, "0"))

    upper = None
    lower = None
    candidates.sort(key=lambda c: c[0])
    for dist, kind, u, l in candidates:
        if kind == "pm":
            return u, l
        if kind == "plus" and upper is None:
            upper = u
        elif (kind == "minus" or kind == "zero") and lower is None:
            lower = l
    if upper is not None and lower is None:
        lower = "0"
    elif lower is not None and upper is None:
        upper = "+0"
    return upper, lower


def detect_orthographic_views(
    drawings: List[Dict[str, Any]],
    page_width: float,
    page_height: float,
    text_items: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    w_half = page_width * 0.5
    h_half = page_height * 0.5

    views = [
        {
            "name": "VIEW_TOP_XY",
            "plane": "XY",
            "bbox": [50.0, 50.0, round(w_half, 1), round(h_half, 1)],
        },
        {
            "name": "VIEW_FRONT_XZ",
            "plane": "XZ",
            "bbox": [50.0, round(h_half, 1), round(w_half, 1), round(page_height - 50.0, 1)],
        },
        {
            "name": "VIEW_SIDE_YZ",
            "plane": "YZ",
            "bbox": [round(w_half, 1), round(h_half, 1), round(page_width - 50.0, 1), round(page_height - 50.0, 1)],
        },
        {
            "name": "VIEW_SECTION",
            "plane": "XZ",
            "bbox": [round(w_half, 1), 50.0, round(page_width - 50.0, 1), round(h_half, 1)],
        },
    ]

    if text_items:
        for it in text_items:
            t = str(it.get("text", "")).upper()
            b = it.get("bbox", [0, 0, 0, 0])
            if any(k in t for k in ("KESIT", "KESİT", "SECTION", "A-A", "B-B")):
                for v in views:
                    if v["bbox"][0] <= b[0] <= v["bbox"][2] and v["bbox"][1] <= b[1] <= v["bbox"][3]:
                        v["name"] = "VIEW_SECTION"

    return views


def assign_view_to_dimension(
    dim_bbox: List[float],
    views: List[Dict[str, Any]],
    dim_type: str = "LINEAR",
) -> Dict[str, Any]:
    cx = (dim_bbox[0] + dim_bbox[2]) / 2.0
    cy = (dim_bbox[1] + dim_bbox[3]) / 2.0

    best_view = views[0] if views else {
        "name": "VIEW_FRONT_XZ",
        "plane": "XZ",
        "bbox": [0.0, 0.0, 1000.0, 1000.0],
    }
    min_dist = float("inf")

    for v in views:
        vb = v["bbox"]
        if vb[0] <= cx <= vb[2] and vb[1] <= cy <= vb[3]:
            best_view = v
            break
        vx_c = (vb[0] + vb[2]) / 2.0
        vy_c = (vb[1] + vb[3]) / 2.0
        dist = ((cx - vx_c)**2 + (cy - vy_c)**2)**0.5
        if dist < min_dist:
            min_dist = dist
            best_view = v

    vb = best_view["bbox"]
    span_x = max(vb[2] - vb[0], 1.0)
    span_y = max(vb[3] - vb[1], 1.0)
    rel_x = max(0.0, min(1.0, (cx - vb[0]) / span_x))
    rel_y = max(0.0, min(1.0, (cy - vb[1]) / span_y))

    clean_type = str(dim_type).upper()
    if any(k in clean_type for k in ("DIAMETER", "HOLE", "RADIUS", "THREAD")):
        inferred_axis = "RADIAL"
    else:
        bw = dim_bbox[2] - dim_bbox[0]
        bh = dim_bbox[3] - dim_bbox[1]
        if bw >= bh:
            inferred_axis = "X" if best_view["plane"] in ("XY", "XZ") else "Y"
        else:
            inferred_axis = "Y" if best_view["plane"] == "XY" else "Z"

    return {
        "view_name": best_view["name"],
        "inferred_axis": inferred_axis,
        "rel_position": [round(rel_x, 4), round(rel_y, 4)],
        "view_bbox": vb,
    }


def validate_scale_consistency(
    nominal_val: float,
    line_length: float,
    page_scale: Optional[float] = None,
) -> bool:
    if nominal_val <= 0.0 or line_length <= 0.0:
        return True
    if page_scale is not None and page_scale > 0.0:
        computed = line_length * page_scale
        ratio = computed / nominal_val
        return 0.4 <= ratio <= 2.5
    return True

