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


class SpatialHashGrid:
    def __init__(self, cell_size: float = 24.0) -> None:
        self.cell_size = max(1.0, float(cell_size))
        self.cells: Dict[Tuple[int, int], List[Tuple[int, List[float], Any]]] = {}
        self._next_id = 0

    def _cell_range(self, bbox: List[float], pad: float = 0.0) -> Tuple[int, int, int, int]:
        cs = self.cell_size
        gx0 = int(math.floor((bbox[0] - pad) / cs))
        gy0 = int(math.floor((bbox[1] - pad) / cs))
        gx1 = int(math.floor((bbox[2] + pad) / cs))
        gy1 = int(math.floor((bbox[3] + pad) / cs))
        return gx0, gy0, gx1, gy1

    def insert(self, bbox: List[float], item: Any) -> int:
        if not bbox or len(bbox) < 4:
            return -1
        b = [float(bbox[0]), float(bbox[1]), float(bbox[2]), float(bbox[3])]
        item_id = self._next_id
        self._next_id += 1
        gx0, gy0, gx1, gy1 = self._cell_range(b, 0.0)
        entry = (item_id, b, item)
        for gx in range(gx0, gx1 + 1):
            for gy in range(gy0, gy1 + 1):
                key = (gx, gy)
                bucket = self.cells.get(key)
                if bucket is None:
                    self.cells[key] = [entry]
                else:
                    bucket.append(entry)
        return item_id

    def query_radius(self, bbox: List[float], radius_pt: float) -> List[Any]:
        if not bbox or len(bbox) < 4:
            return []
        b = [float(bbox[0]), float(bbox[1]), float(bbox[2]), float(bbox[3])]
        r = max(0.0, float(radius_pt))
        gx0, gy0, gx1, gy1 = self._cell_range(b, r)
        seen: set = set()
        results: List[Any] = []
        for gx in range(gx0, gx1 + 1):
            for gy in range(gy0, gy1 + 1):
                bucket = self.cells.get((gx, gy))
                if not bucket:
                    continue
                for item_id, ib, item in bucket:
                    if item_id in seen:
                        continue
                    seen.add(item_id)
                    if bbox_distance(b, ib) <= r:
                        results.append(item)
        return results


def prune_hatching_lines(
    drawings: List[Dict[str, Any]],
    min_cluster_size: int = 5,
    max_spacing_pt: float = 25.0,
) -> List[Dict[str, Any]]:
    if not drawings:
        return []

    diag_groups: Dict[int, List[Tuple[float, float, int]]] = {45: [], 135: []}

    for idx, d in enumerate(drawings):
        items = d.get("items", [])
        if len(items) != 1:
            continue
        it = items[0]
        cmd = it[0] if isinstance(it, (list, tuple)) and len(it) > 0 else ""
        if cmd != "l" or len(it) < 3:
            continue
        p1 = get_point_coords(it[1])
        p2 = get_point_coords(it[2])
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        length = math.hypot(dx, dy)
        if length < 4.0:
            continue
        deg = math.degrees(math.atan2(dy, dx)) % 180.0
        if 42.5 <= deg <= 47.5:
            rad = math.radians(45.0)
            mid_x = (p1[0] + p2[0]) * 0.5
            mid_y = (p1[1] + p2[1]) * 0.5
            perp = -mid_x * math.sin(rad) + mid_y * math.cos(rad)
            para = mid_x * math.cos(rad) + mid_y * math.sin(rad)
            diag_groups[45].append((perp, para, idx))
        elif 132.5 <= deg <= 137.5:
            rad = math.radians(135.0)
            mid_x = (p1[0] + p2[0]) * 0.5
            mid_y = (p1[1] + p2[1]) * 0.5
            perp = -mid_x * math.sin(rad) + mid_y * math.cos(rad)
            para = mid_x * math.cos(rad) + mid_y * math.sin(rad)
            diag_groups[135].append((perp, para, idx))

    hatching_indices: set = set()
    for entries in diag_groups.values():
        if len(entries) < min_cluster_size:
            continue
        entries.sort(key=lambda e: (e[0], e[1]))
        run: List[int] = [entries[0][2]]
        for k in range(1, len(entries)):
            spacing = abs(entries[k][0] - entries[k - 1][0])
            para_diff = abs(entries[k][1] - entries[k - 1][1])
            if 0.2 <= spacing <= max_spacing_pt and para_diff <= 150.0:
                run.append(entries[k][2])
            else:
                if len(run) >= min_cluster_size:
                    hatching_indices.update(run)
                run = [entries[k][2]]
        if len(run) >= min_cluster_size:
            hatching_indices.update(run)

    pruned: List[Dict[str, Any]] = []
    for idx, d in enumerate(drawings):
        if idx in hatching_indices:
            d["is_hatching"] = True
        else:
            pruned.append(d)
    return pruned


def cluster_micro_drawings(
    drawings: List[Dict[str, Any]],
    max_dist: float = 2.5,
    min_size: float = 1.5,
    max_size: float = 22.0,
) -> List[List[Dict[str, Any]]]:
    candidates: List[Tuple[Dict[str, Any], List[float]]] = []
    for d in drawings:
        if d.get("is_hatching"):
            continue
        box = get_drawing_bbox(d)
        if not box:
            continue
        w = box[2] - box[0]
        h = box[3] - box[1]
        if max(w, h) >= min_size and w <= max_size and h <= max_size:
            candidates.append((d, box))

    if not candidates:
        return []

    grid = SpatialHashGrid(cell_size=24.0)
    for idx, (_, box) in enumerate(candidates):
        grid.insert(box, idx)

    visited = [False] * len(candidates)
    result: List[List[Dict[str, Any]]] = []

    for i in range(len(candidates)):
        if visited[i]:
            continue
        visited[i] = True
        queue = [i]
        comp = [candidates[i][0]]
        while queue:
            curr = queue.pop()
            _, curr_box = candidates[curr]
            for nb in grid.query_radius(curr_box, max_dist):
                if not visited[nb]:
                    visited[nb] = True
                    queue.append(nb)
                    comp.append(candidates[nb][0])
        result.append(comp)
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
        if len(horiz_lines) >= 1 and len(vert_lines) >= 1 and len(diag_lines) >= 1 and not curves:
            h_top = min(horiz_lines, key=lambda hl: min(hl[0][1], hl[1][1]))
            h_top_y = (h_top[0][1] + h_top[1][1]) * 0.5
            if abs(h_top_y - min_y) <= 4.0:
                symbol = "↧"
                confidence = 0.96
        elif len(vert_lines) == 2 and len(horiz_lines) == 1 and not diag_lines and not curves:
            h_line = horiz_lines[0]
            h_y = (h_line[0][1] + h_line[1][1]) * 0.5
            if abs(h_y - max_y) <= 4.0:
                symbol = "⌴"
                confidence = 0.97
        elif len(horiz_lines) == 1 and len(vert_lines) == 1 and not diag_lines and not curves:
            h_line = min(horiz_lines, key=lambda hl: hl[0][1])
            v_line = vert_lines[0]
            v_bottom = max(v_line[0][1], v_line[1][1])
            h_y = h_line[0][1]
            if abs(v_bottom - h_y) <= 4.0:
                symbol = "⊥"
                confidence = 0.98
        elif len(diag_lines) == 2 and len(lines) == 2 and not curves:
            p1_a, p2_a, _ = diag_lines[0]
            p1_b, p2_b, _ = diag_lines[1]
            bot_a = p1_a if p1_a[1] >= p2_a[1] else p2_a
            bot_b = p1_b if p1_b[1] >= p2_b[1] else p2_b
            top_a = p2_a if bot_a == p1_a else p1_a
            top_b = p2_b if bot_b == p1_b else p1_b
            bot_dist = math.hypot(bot_a[0] - bot_b[0], bot_a[1] - bot_b[1])
            top_dist = math.hypot(top_a[0] - top_b[0], top_a[1] - top_b[1])
            if bot_dist <= 3.5 and top_dist >= 4.0:
                symbol = "∨"
                confidence = 0.96
            else:
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

    filtered_drawings = prune_hatching_lines(drawings)
    clusters = cluster_micro_drawings(filtered_drawings)
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
            "view_scale_ratio": 1.0,
        },
        {
            "name": "VIEW_FRONT_XZ",
            "plane": "XZ",
            "bbox": [50.0, round(h_half, 1), round(w_half, 1), round(page_height - 50.0, 1)],
            "view_scale_ratio": 1.0,
        },
        {
            "name": "VIEW_SIDE_YZ",
            "plane": "YZ",
            "bbox": [round(w_half, 1), round(h_half, 1), round(page_width - 50.0, 1), round(page_height - 50.0, 1)],
            "view_scale_ratio": 1.0,
        },
        {
            "name": "VIEW_SECTION",
            "plane": "XZ",
            "bbox": [round(w_half, 1), 50.0, round(page_width - 50.0, 1), round(h_half, 1)],
            "view_scale_ratio": 1.0,
        },
    ]

    if text_items:
        for it in text_items:
            t = str(it.get("text", "")).upper()
            b = it.get("bbox", [0, 0, 0, 0])
            detail_match = re.search(r'(?:DETAY|DETAIL|ÖLÇEK|SCALE)\s*([A-Z])?\s*\(?\s*([1-9][0-9]*)\s*:\s*([1-9][0-9]*)', t)
            local_ratio = 1.0
            if detail_match:
                n_str, d_str = detail_match.group(2), detail_match.group(3)
                if n_str and d_str and float(d_str) > 0:
                    local_ratio = float(n_str) / float(d_str)
            elif "DETAY" in t or "DETAIL" in t:
                local_ratio = 2.0

            if any(k in t for k in ("KESIT", "KESİT", "SECTION", "A-A", "B-B")):
                for v in views:
                    if v["bbox"][0] <= b[0] <= v["bbox"][2] and v["bbox"][1] <= b[1] <= v["bbox"][3]:
                        v["name"] = "VIEW_SECTION"
            elif local_ratio > 1.0:
                for v in views:
                    if v["bbox"][0] <= b[0] <= v["bbox"][2] and v["bbox"][1] <= b[1] <= v["bbox"][3]:
                        v["name"] = "VIEW_DETAIL"
                        v["view_scale_ratio"] = local_ratio

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
        "view_scale_ratio": best_view.get("view_scale_ratio", 1.0),
        "inferred_axis": inferred_axis,
        "rel_position": [round(rel_x, 4), round(rel_y, 4)],
        "view_bbox": vb,
    }


def validate_scale_consistency(
    nominal_val: float,
    line_length: float,
    page_scale: Optional[float] = None,
    view_scale_ratio: float = 1.0,
) -> bool:
    if nominal_val <= 0.0 or line_length <= 0.0:
        return True
    effective_length = line_length / view_scale_ratio if view_scale_ratio > 0.0 else line_length
    if page_scale is not None and page_scale > 0.0:
        computed = effective_length * page_scale
        ratio = computed / nominal_val
        return 0.35 <= ratio <= 3.0
    return True

