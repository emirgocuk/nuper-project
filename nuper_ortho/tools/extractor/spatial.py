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
