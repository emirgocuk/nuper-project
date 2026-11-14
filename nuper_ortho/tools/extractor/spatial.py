import math
import re
from typing import List, Dict, Any, Optional, Tuple, Sequence


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


def extract_circle_primitives(
    drawings: List[Dict[str, Any]],
    min_radius: float = 1.5,
    max_radius: float = 300.0,
) -> List[Dict[str, Any]]:
    circles: List[Dict[str, Any]] = []
    if not drawings:
        return circles

    for d in drawings:
        if d.get("is_hatching"):
            continue
        if "circle_center" in d and "circle_radius" in d:
            cc = d["circle_center"]
            cr = float(d["circle_radius"])
            if min_radius <= cr <= max_radius:
                circles.append({
                    "center": [round(float(cc[0]), 2), round(float(cc[1]), 2)],
                    "radius_pt": round(cr, 2),
                    "bbox": [
                        round(float(cc[0]) - cr, 2),
                        round(float(cc[1]) - cr, 2),
                        round(float(cc[0]) + cr, 2),
                        round(float(cc[1]) + cr, 2),
                    ],
                })
            continue

        items = d.get("items", [])
        curve_count = 0
        line_count = 0
        pts_x: List[float] = []
        pts_y: List[float] = []

        for it in items:
            cmd = it[0] if isinstance(it, (list, tuple)) and len(it) > 0 else ""
            if cmd == "c" and len(it) >= 5:
                curve_count += 1
                for k in (1, 4):
                    px, py = get_point_coords(it[k])
                    pts_x.append(px)
                    pts_y.append(py)
            elif cmd == "l" and len(it) >= 3:
                line_count += 1
                for k in (1, 2):
                    px, py = get_point_coords(it[k])
                    pts_x.append(px)
                    pts_y.append(py)

        box = get_drawing_bbox(d)
        if not box and pts_x and pts_y:
            box = [min(pts_x), min(pts_y), max(pts_x), max(pts_y)]
        if not box:
            continue

        w = box[2] - box[0]
        h = box[3] - box[1]
        if w <= 0.0 or h <= 0.0:
            continue
        aspect = w / h
        r = (w + h) * 0.25
        if not (min_radius <= r <= max_radius):
            continue

        is_bezier_circle = curve_count >= 2 and 0.80 <= aspect <= 1.25
        is_poly_circle = curve_count == 0 and line_count >= 8 and 0.85 <= aspect <= 1.18 and d.get("closePath", True)
        if is_bezier_circle or is_poly_circle:
            ccx = (box[0] + box[2]) * 0.5
            ccy = (box[1] + box[3]) * 0.5
            circles.append({
                "center": [round(ccx, 2), round(ccy, 2)],
                "radius_pt": round(r, 2),
                "bbox": [round(box[0], 2), round(box[1], 2), round(box[2], 2), round(box[3], 2)],
            })

    deduped: List[Dict[str, Any]] = []
    for c in circles:
        duplicate = False
        for ex in deduped:
            dist_c = math.hypot(c["center"][0] - ex["center"][0], c["center"][1] - ex["center"][1])
            if dist_c <= 2.0 and abs(c["radius_pt"] - ex["radius_pt"]) <= 2.0:
                duplicate = True
                break
        if not duplicate:
            deduped.append(c)
    return deduped


def build_page_geometry_index(drawings: List[Dict[str, Any]]) -> Dict[str, Any]:
    lines: List[Tuple[Tuple[float, float], Tuple[float, float], float, float, float, float]] = []
    horiz_lines: List[Tuple[Tuple[float, float], Tuple[float, float], float, float, float, float]] = []
    vert_lines: List[Tuple[Tuple[float, float], Tuple[float, float], float, float, float, float]] = []
    endpoint_cells: Dict[Tuple[int, int], List[Tuple[int, Tuple[float, float], Tuple[float, float], float, float]]] = {}
    segment_grid = SpatialHashGrid(cell_size=32.0)
    overflow_lines: List[int] = []

    if drawings:
        for d in drawings:
            if d.get("is_hatching"):
                continue
            for it in d.get("items", []):
                cmd = it[0] if isinstance(it, (list, tuple)) and len(it) > 0 else ""
                if cmd == "l" and len(it) >= 3:
                    p1 = get_point_coords(it[1])
                    p2 = get_point_coords(it[2])
                    dx = p2[0] - p1[0]
                    dy = p2[1] - p1[1]
                    line_len = math.hypot(dx, dy)
                    angle_deg = math.degrees(math.atan2(abs(dy), abs(dx)))
                    mid_x = (p1[0] + p2[0]) * 0.5
                    mid_y = (p1[1] + p2[1]) * 0.5
                    line_idx = len(lines)
                    rec = (p1, p2, line_len, angle_deg, mid_x, mid_y)
                    lines.append(rec)

                    if line_len >= 10.0:
                        if angle_deg <= 20.0:
                            horiz_lines.append(rec)
                        elif angle_deg >= 70.0:
                            vert_lines.append(rec)

                    c1 = (int(math.floor(p1[0] / 6.0)), int(math.floor(p1[1] / 6.0)))
                    c2 = (int(math.floor(p2[0] / 6.0)), int(math.floor(p2[1] / 6.0)))
                    endpoint_cells.setdefault(c1, []).append((line_idx, p1, p2, line_len, angle_deg))
                    endpoint_cells.setdefault(c2, []).append((line_idx, p2, p1, line_len, angle_deg))

                    min_x = p1[0] if p1[0] <= p2[0] else p2[0]
                    max_x = p2[0] if p1[0] <= p2[0] else p1[0]
                    min_y = p1[1] if p1[1] <= p2[1] else p2[1]
                    max_y = p2[1] if p1[1] <= p2[1] else p1[1]
                    gx0 = int(math.floor(min_x / 32.0))
                    gy0 = int(math.floor(min_y / 32.0))
                    gx1 = int(math.floor(max_x / 32.0))
                    gy1 = int(math.floor(max_y / 32.0))
                    if (gx1 - gx0 + 1) * (gy1 - gy0 + 1) <= 64:
                        segment_grid.insert([min_x, min_y, max_x, max_y], line_idx)
                    else:
                        overflow_lines.append(line_idx)

    circles = extract_circle_primitives(drawings)
    return {
        "lines": lines,
        "horiz_lines": horiz_lines,
        "vert_lines": vert_lines,
        "endpoint_cells": endpoint_cells,
        "segment_grid": segment_grid,
        "overflow_lines": overflow_lines,
        "circles": circles,
    }


def _query_endpoint_candidates(
    endpoint_cells: Dict[Tuple[int, int], List[Tuple[int, Tuple[float, float], Tuple[float, float], float, float]]],
    px: float,
    py: float,
) -> List[Tuple[int, Tuple[float, float], Tuple[float, float], float, float]]:
    cx_cell = int(math.floor(px / 6.0))
    cy_cell = int(math.floor(py / 6.0))
    out: List[Tuple[int, Tuple[float, float], Tuple[float, float], float, float]] = []
    for gx in range(cx_cell - 1, cx_cell + 2):
        for gy in range(cy_cell - 1, cy_cell + 2):
            bucket = endpoint_cells.get((gx, gy))
            if bucket:
                out.extend(bucket)
    return out


def trace_dimension_attachments(
    dim_bbox: List[float],
    drawings: List[Dict[str, Any]],
    nominal_val: Optional[float] = None,
    page_scale: Optional[float] = None,
    text_spans: Optional[List[Dict[str, Any]]] = None,
    precomputed: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    x0, y0, x1, y1 = dim_bbox
    cx = (x0 + x1) / 2.0
    cy = (y0 + y1) / 2.0
    bw = x1 - x0
    bh = y1 - y0

    geom = precomputed if precomputed is not None else build_page_geometry_index(drawings)
    lines = geom["lines"]
    horiz_lines = geom["horiz_lines"]
    vert_lines = geom["vert_lines"]
    endpoint_cells = geom["endpoint_cells"]
    segment_grid = geom["segment_grid"]
    overflow_lines = geom["overflow_lines"]
    circles = geom["circles"]

    best_dim_line = None
    min_dist = float("inf")
    dim_is_horiz = bw >= bh
    topology_type = "UNRESOLVED"

    if dim_is_horiz:
        for p1, p2, line_len, angle, line_cx, line_cy in horiz_lines:
            dist = abs(line_cy - cy)
            if dist <= 35.0 and abs(line_cx - cx) <= line_len * 0.6:
                if dist < min_dist:
                    min_dist = dist
                    best_dim_line = (p1, p2, line_len, "HORIZONTAL")
    else:
        for p1, p2, line_len, angle, line_cx, line_cy in vert_lines:
            dist = abs(line_cx - cx)
            if dist <= 35.0 and abs(line_cy - cy) <= line_len * 0.6:
                if dist < min_dist:
                    min_dist = dist
                    best_dim_line = (p1, p2, line_len, "VERTICAL")

    p_start = None
    p_end = None
    line_length = 0.0
    attachments: List[List[float]] = []

    if best_dim_line:
        topology_type = "LINEAR_INSIDE"
        p1, p2, line_length, orientation = best_dim_line
        if p1[0] < p2[0] or (p1[0] == p2[0] and p1[1] < p2[1]):
            p_start = [round(p1[0], 2), round(p1[1], 2)]
            p_end = [round(p2[0], 2), round(p2[1], 2)]
        else:
            p_start = [round(p2[0], 2), round(p2[1], 2)]
            p_end = [round(p1[0], 2), round(p1[1], 2)]

        for p_target in (p_start, p_end):
            ptx, pty = p_target[0], p_target[1]
            cands = _query_endpoint_candidates(endpoint_cells, ptx, pty)
            cands.sort(key=lambda item: item[0])
            for _, candidate_pt, other_pt, l_len, l_angle in cands:
                if l_len < 8.0:
                    continue
                if abs(candidate_pt[0] - ptx) > 4.0 or abs(candidate_pt[1] - pty) > 4.0:
                    continue
                if math.hypot(candidate_pt[0] - ptx, candidate_pt[1] - pty) <= 4.0:
                    if orientation == "HORIZONTAL" and l_angle >= 65.0:
                        attachments.append([round(other_pt[0], 2), round(other_pt[1], 2)])
                        break
                    elif orientation == "VERTICAL" and l_angle <= 25.0:
                        attachments.append([round(other_pt[0], 2), round(other_pt[1], 2)])
                        break
    else:
        ext_lines = []
        rx = max(bw * 1.5, 45.0)
        ry = max(bh * 1.5, 45.0)
        search_box = (
            [cx - rx, cy - 35.0, cx + rx, cy + 35.0]
            if dim_is_horiz
            else [cx - 35.0, cy - ry, cx + 35.0, cy + ry]
        )
        local_indices = list(segment_grid.query_radius(search_box, 4.0))
        if overflow_lines:
            local_indices.extend(overflow_lines)
        for line_idx in local_indices:
            lp1, lp2, l_len, l_angle, mid_x, mid_y = lines[line_idx]
            if l_len < 8.0:
                continue
            if dim_is_horiz and l_angle >= 75.0 and abs(mid_y - cy) <= 35.0 and abs(mid_x - cx) <= rx:
                ext_lines.append((mid_x, lp1, lp2))
            elif not dim_is_horiz and l_angle <= 15.0 and abs(mid_x - cx) <= 35.0 and abs(mid_y - cy) <= ry:
                ext_lines.append((mid_y, lp1, lp2))

        if len(ext_lines) >= 2:
            ext_lines.sort(key=lambda item: item[0])
            best_pair = None
            min_gap = float("inf")
            for idx_e in range(len(ext_lines) - 1):
                gap = abs(ext_lines[idx_e + 1][0] - ext_lines[idx_e][0])
                if 1.0 <= gap < min_gap:
                    min_gap = gap
                    best_pair = (ext_lines[idx_e], ext_lines[idx_e + 1])
            if best_pair and min_gap <= 30.0:
                e1, e2 = best_pair
                topology_type = "LINEAR_OUTSIDE_NARROW"
                line_length = min_gap
                if dim_is_horiz:
                    p_start = [round(e1[0], 2), round(cy, 2)]
                    p_end = [round(e2[0], 2), round(cy, 2)]
                else:
                    p_start = [round(cx, 2), round(e1[0], 2)]
                    p_end = [round(cx, 2), round(e2[0], 2)]
                attachments.append([round(e1[2][0], 2), round(e1[2][1], 2)])
                attachments.append([round(e2[2][0], 2), round(e2[2][1], 2)])

    leader_tip: Optional[List[float]] = None
    circle_cx: Optional[float] = None
    circle_cy: Optional[float] = None
    circle_r_pt: Optional[float] = None

    if not best_dim_line or line_length < 15.0 or len(attachments) < 2:
        shelf_pts: List[Tuple[float, float]] = []
        shelf_r = max(bw, bh) + 20.0
        shelf_indices = list(segment_grid.query_radius([cx, cy, cx, cy], shelf_r + 2.0))
        if overflow_lines:
            shelf_indices.extend(overflow_lines)
        for line_idx in shelf_indices:
            lp1, lp2, l_len, angle, _, _ = lines[line_idx]
            if l_len < 4.0 or angle > 15.0:
                continue
            d_box = min(
                math.hypot(lp1[0] - cx, lp1[1] - cy),
                math.hypot(lp2[0] - cx, lp2[1] - cy),
            )
            if d_box <= shelf_r:
                shelf_pts.extend([lp1, lp2])

        leader_idx_set = set()
        max_r = max(bw, bh) * 1.5 + 25.0
        near_indices = list(segment_grid.query_radius([cx, cy, cx, cy], max_r + 2.0))
        if overflow_lines:
            near_indices.extend(overflow_lines)
        for line_idx in near_indices:
            lp1, lp2, _, _, _, _ = lines[line_idx]
            d1 = min(math.hypot(lp1[0] - cx, lp1[1] - cy), math.hypot(lp2[0] - cx, lp2[1] - cy))
            if d1 <= max_r:
                leader_idx_set.add(line_idx)

        for sp in shelf_pts:
            spx, spy = sp[0], sp[1]
            for line_idx, ep, _, _, _ in _query_endpoint_candidates(endpoint_cells, spx, spy):
                if line_idx not in leader_idx_set:
                    if abs(ep[0] - spx) <= 4.5 and abs(ep[1] - spy) <= 4.5:
                        if math.hypot(ep[0] - spx, ep[1] - spy) <= 4.5:
                            leader_idx_set.add(line_idx)

        if leader_idx_set:
            furthest_pt = None
            max_d = float("-inf")
            for line_idx in leader_idx_set:
                lp1, lp2, _, _, _, _ = lines[line_idx]
                for pt in (lp1, lp2):
                    d_from_center = math.hypot(pt[0] - cx, pt[1] - cy)
                    if d_from_center > max_d:
                        max_d = d_from_center
                        furthest_pt = pt
            if furthest_pt and max_d >= 12.0:
                leader_tip = [round(furthest_pt[0], 2), round(furthest_pt[1], 2)]

    if leader_tip and circles:
        tx, ty = leader_tip[0], leader_tip[1]
        best_circle = None
        best_err = float("inf")
        for c in circles:
            ccx, ccy = c["center"]
            cr = c["radius_pt"]
            dist_to_center = math.hypot(tx - ccx, ty - ccy)
            rim_err = abs(dist_to_center - cr)
            tol_rim = max(5.0, cr * 0.22)
            if rim_err <= tol_rim or dist_to_center <= 5.0:
                score_err = min(rim_err, dist_to_center)
                if score_err < best_err:
                    best_err = score_err
                    best_circle = c
        if best_circle is not None:
            circle_cx = best_circle["center"][0]
            circle_cy = best_circle["center"][1]
            circle_r_pt = best_circle["radius_pt"]
            topology_type = "LEADER_CIRCLE"
            if not attachments:
                attachments.append([circle_cx, circle_cy])

    is_ordinate = False
    ordinate_origin: Optional[List[float]] = None
    if text_spans and not best_dim_line and circle_cx is None:
        for sp in text_spans:
            st = str(sp.get("text", "")).strip()
            if st in ("0", "0.0", "0,0"):
                sb = sp.get("bbox", [0.0, 0.0, 0.0, 0.0])
                scx = (sb[0] + sb[2]) * 0.5
                scy = (sb[1] + sb[3]) * 0.5
                if abs(scy - cy) <= 18.0 and abs(scx - cx) > 8.0:
                    is_ordinate = True
                    ordinate_origin = [round(scx, 2), round(scy, 2)]
                    line_length = abs(cx - scx)
                    topology_type = "ORDINATE_BASELINE"
                    break
                if abs(scx - cx) <= 18.0 and abs(scy - cy) > 8.0:
                    is_ordinate = True
                    ordinate_origin = [round(scx, 2), round(scy, 2)]
                    line_length = abs(cy - scy)
                    topology_type = "ORDINATE_BASELINE"
                    break

    scale_consistent = True
    ratio = None
    if (best_dim_line or is_ordinate or topology_type == "LINEAR_OUTSIDE_NARROW") and nominal_val is not None and page_scale is not None and nominal_val > 0.0 and line_length > 0.0:
        computed_dist = line_length * page_scale
        ratio = computed_dist / nominal_val
        if ratio < 0.65 or ratio > 1.45:
            scale_consistent = False

    return {
        "has_dimension_line": best_dim_line is not None or topology_type == "LINEAR_OUTSIDE_NARROW",
        "dimension_line_length_pt": round(line_length, 2),
        "p_start": p_start,
        "p_end": p_end,
        "attachment_points": attachments,
        "leader_tip": leader_tip,
        "circle_cx": circle_cx,
        "circle_cy": circle_cy,
        "circle_r_pt": circle_r_pt,
        "is_ordinate": is_ordinate,
        "ordinate_origin": ordinate_origin,
        "topology_type": topology_type,
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
            "is_section_view": False,
            "section_label": None,
            "section_plane_rel": None,
        },
        {
            "name": "VIEW_FRONT_XZ",
            "plane": "XZ",
            "bbox": [50.0, round(h_half, 1), round(w_half, 1), round(page_height - 50.0, 1)],
            "view_scale_ratio": 1.0,
            "is_section_view": False,
            "section_label": None,
            "section_plane_rel": None,
        },
        {
            "name": "VIEW_SIDE_YZ",
            "plane": "YZ",
            "bbox": [round(w_half, 1), round(h_half, 1), round(page_width - 50.0, 1), round(page_height - 50.0, 1)],
            "view_scale_ratio": 1.0,
            "is_section_view": False,
            "section_label": None,
            "section_plane_rel": None,
        },
        {
            "name": "VIEW_SECTION",
            "plane": "XZ",
            "bbox": [round(w_half, 1), 50.0, round(page_width - 50.0, 1), round(h_half, 1)],
            "view_scale_ratio": 1.0,
            "is_section_view": False,
            "section_label": None,
            "section_plane_rel": None,
        },
    ]

    cut_markers: Dict[str, List[Tuple[float, float]]] = {}

    if text_items:
        for it in text_items:
            t_raw = str(it.get("text", "")).strip()
            t = t_raw.upper()
            b = it.get("bbox", [0, 0, 0, 0])
            if re.match(r"^[A-Z]$", t) and len(b) >= 4:
                cut_markers.setdefault(t, []).append(((b[0] + b[2]) * 0.5, (b[1] + b[3]) * 0.5))

            detail_match = re.search(r'(?:DETAY|DETAIL|ÖLÇEK|SCALE)\s*([A-Z])?\s*\(?\s*([1-9][0-9]*)\s*:\s*([1-9][0-9]*)', t)
            local_ratio = 1.0
            if detail_match:
                n_str, d_str = detail_match.group(2), detail_match.group(3)
                if n_str and d_str and float(d_str) > 0:
                    local_ratio = float(n_str) / float(d_str)
            elif "DETAY" in t or "DETAIL" in t:
                local_ratio = 2.0

            sec_match = re.search(r'(?:KESIT|KESİT|SECTION)\s*([A-Z]\s*-\s*[A-Z])?', t)
            plain_pair = re.search(r'\b([A-Z])\s*-\s*\1\b', t)
            if sec_match or plain_pair:
                sec_lbl = None
                if sec_match and sec_match.group(1):
                    sec_lbl = sec_match.group(1).replace(" ", "")
                elif plain_pair:
                    sec_lbl = f"{plain_pair.group(1)}-{plain_pair.group(1)}"
                for v in views:
                    if v["bbox"][0] <= b[0] <= v["bbox"][2] and v["bbox"][1] <= b[1] <= v["bbox"][3]:
                        v["name"] = "VIEW_SECTION"
                        v["is_section_view"] = True
                        if sec_lbl:
                            v["section_label"] = sec_lbl
            elif local_ratio > 1.0:
                for v in views:
                    if v["bbox"][0] <= b[0] <= v["bbox"][2] and v["bbox"][1] <= b[1] <= v["bbox"][3]:
                        v["name"] = "VIEW_DETAIL"
                        v["view_scale_ratio"] = local_ratio

    for v in views:
        if v.get("is_section_view") and v.get("section_label"):
            letter = v["section_label"].split("-")[0]
            pts = cut_markers.get(letter, [])
            if len(pts) >= 2:
                mx = sum(p[0] for p in pts) / len(pts)
                my = sum(p[1] for p in pts) / len(pts)
                host_view = None
                for hv in views:
                    if not hv.get("is_section_view"):
                        hb = hv["bbox"]
                        if hb[0] <= mx <= hb[2] and hb[1] <= my <= hb[3]:
                            host_view = hv
                            break
                if host_view:
                    hb = host_view["bbox"]
                    rx = (mx - hb[0]) / max(hb[2] - hb[0], 1.0)
                    ry = (my - hb[1]) / max(hb[3] - hb[1], 1.0)
                    v["section_plane_rel"] = [round(rx, 4), round(ry, 4)]

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
        "is_section_view": bool(best_view.get("is_section_view", False)),
        "section_label": best_view.get("section_label"),
        "section_plane_rel": best_view.get("section_plane_rel"),
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


TABLE_HEADER_KEYWORDS = (
    "YÜZEY",
    "YUZEY",
    "ADET",
    "PARÇA NO",
    "PARCA NO",
    "REVİZYON",
    "REVIZYON",
    "MALZEME",
    "MİKTAR",
    "MIKTAR",
    "SIRA",
    "TANIM",
    "AÇIKLAMA",
    "ACIKLAMA",
    "TOLERANS TABLOSU",
    "DELİK TABLOSU",
    "DELIK TABLOSU",
    "HOLE TABLE",
    "PART NO",
    "DESCRIPTION",
    "QTY",
)


def _contains_table_header(box: Sequence[float], text_spans: Sequence[Dict[str, Any]], pad: float = 6.0) -> bool:
    rx0, ry0, rx1, ry1 = box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad
    for sp in text_spans:
        sb = sp.get("bbox")
        if not sb or len(sb) < 4:
            continue
        cx = (float(sb[0]) + float(sb[2])) * 0.5
        cy = (float(sb[1]) + float(sb[3])) * 0.5
        if rx0 <= cx <= rx1 and ry0 <= cy <= ry1:
            upper_t = str(sp.get("text", "")).upper()
            if any(kw in upper_t for kw in TABLE_HEADER_KEYWORDS):
                return True
    return False


def _merge_overlapping_regions(regions: List[List[float]]) -> List[List[float]]:
    if not regions:
        return []
    merged: List[List[float]] = []
    for reg in regions:
        x0, y0, x1, y1 = reg
        placed = False
        for m in merged:
            if not (x1 < m[0] - 4.0 or x0 > m[2] + 4.0 or y1 < m[1] - 4.0 or y0 > m[3] + 4.0):
                m[0] = round(min(m[0], x0), 2)
                m[1] = round(min(m[1], y0), 2)
                m[2] = round(max(m[2], x1), 2)
                m[3] = round(max(m[3], y1), 2)
                placed = True
                break
        if not placed:
            merged.append([round(x0, 2), round(y0, 2), round(x1, 2), round(y1, 2)])
    return merged


def detect_table_regions(
    drawings: List[Dict[str, Any]],
    text_spans: List[Dict[str, Any]],
    page_w: float,
    page_h: float,
) -> List[List[float]]:
    max_area = max(page_w * page_h, 1.0) * 0.55
    cell_rects: List[List[float]] = []
    horiz_segs: List[Tuple[float, float, float]] = []
    vert_segs: List[Tuple[float, float, float]] = []

    for d in drawings or []:
        if d.get("is_hatching"):
            continue
        box = get_drawing_bbox(d)
        if box:
            w = box[2] - box[0]
            h = box[3] - box[1]
            if 8.0 <= w <= max(page_w * 0.65, 250.0) and 7.0 <= h <= 80.0:
                cell_rects.append(box)
        for it in d.get("items", []):
            cmd = it[0] if isinstance(it, (list, tuple)) and len(it) > 0 else ""
            if cmd == "re" and len(it) >= 2:
                rb = get_drawing_bbox({"rect": it[1]})
                if rb:
                    rw = rb[2] - rb[0]
                    rh = rb[3] - rb[1]
                    if 8.0 <= rw <= max(page_w * 0.65, 250.0) and 7.0 <= rh <= 80.0:
                        cell_rects.append(rb)
            elif cmd == "l" and len(it) >= 3:
                p1 = get_point_coords(it[1])
                p2 = get_point_coords(it[2])
                dx = p2[0] - p1[0]
                dy = p2[1] - p1[1]
                length = math.hypot(dx, dy)
                if length < 12.0:
                    continue
                deg = math.degrees(math.atan2(abs(dy), abs(dx)))
                if deg <= 5.0 and length >= 20.0:
                    horiz_segs.append((min(p1[0], p2[0]), max(p1[0], p2[0]), (p1[1] + p2[1]) * 0.5))
                elif deg >= 85.0:
                    vert_segs.append(((p1[0] + p2[0]) * 0.5, min(p1[1], p2[1]), max(p1[1], p2[1])))

    regions: List[List[float]] = []

    if len(cell_rects) >= 4:
        grid = SpatialHashGrid(cell_size=40.0)
        for idx, rb in enumerate(cell_rects):
            grid.insert(rb, idx)
        visited = [False] * len(cell_rects)
        for i in range(len(cell_rects)):
            if visited[i]:
                continue
            visited[i] = True
            stack = [i]
            comp = [cell_rects[i]]
            while stack:
                curr = stack.pop()
                for nb in grid.query_radius(cell_rects[curr], 4.0):
                    if not visited[nb]:
                        visited[nb] = True
                        stack.append(nb)
                        comp.append(cell_rects[nb])
            if len(comp) >= 4:
                gx0 = min(c[0] for c in comp)
                gy0 = min(c[1] for c in comp)
                gx1 = max(c[2] for c in comp)
                gy1 = max(c[3] for c in comp)
                distinct_rows = len({round(c[1] / 6.0) for c in comp})
                distinct_cols = len({round(c[0] / 12.0) for c in comp})
                area = (gx1 - gx0) * (gy1 - gy0)
                if area < max_area and distinct_rows >= 2 and distinct_cols >= 2:
                    gbox = [gx0, gy0, gx1, gy1]
                    if _contains_table_header(gbox, text_spans) or len(comp) >= 6:
                        regions.append(gbox)

    if len(horiz_segs) >= 3 and len(vert_segs) >= 3:
        used_h = [False] * len(horiz_segs)
        used_v = [False] * len(vert_segs)
        for hi in range(len(horiz_segs)):
            if used_h[hi]:
                continue
            queue_h = [hi]
            used_h[hi] = True
            comp_h = [horiz_segs[hi]]
            comp_v: List[Tuple[float, float, float]] = []
            while queue_h:
                cur_h = queue_h.pop()
                hx0, hx1, hy = horiz_segs[cur_h]
                for vi, (vx, vy0, vy1) in enumerate(vert_segs):
                    if not used_v[vi] and hx0 - 2.5 <= vx <= hx1 + 2.5 and vy0 - 2.5 <= hy <= vy1 + 2.5:
                        used_v[vi] = True
                        comp_v.append((vx, vy0, vy1))
                        for nh_i, (nhx0, nhx1, nhy) in enumerate(horiz_segs):
                            if not used_h[nh_i] and nhx0 - 2.5 <= vx <= nhx1 + 2.5 and vy0 - 2.5 <= nhy <= vy1 + 2.5:
                                used_h[nh_i] = True
                                queue_h.append(nh_i)
                                comp_h.append((nhx0, nhx1, nhy))
            distinct_y = {round(h[2] / 5.0) for h in comp_h}
            distinct_x = {round(v[0] / 8.0) for v in comp_v}
            if len(distinct_y) >= 3 and len(distinct_x) >= 3:
                lx0 = min(min(h[0] for h in comp_h), min(v[0] for v in comp_v))
                lx1 = max(max(h[1] for h in comp_h), max(v[0] for v in comp_v))
                ly0 = min(min(h[2] for h in comp_h), min(v[1] for v in comp_v))
                ly1 = max(max(h[2] for h in comp_h), max(v[2] for v in comp_v))
                area = (lx1 - lx0) * (ly1 - ly0)
                if area < max_area:
                    lbox = [lx0, ly0, lx1, ly1]
                    if _contains_table_header(lbox, text_spans) or (len(distinct_y) >= 4 and len(distinct_x) >= 4):
                        regions.append(lbox)

    header_spans: List[Tuple[float, float, float, float]] = []
    for sp in text_spans or []:
        sb = sp.get("bbox")
        if not sb or len(sb) < 4:
            continue
        up = str(sp.get("text", "")).upper()
        if any(kw in up for kw in TABLE_HEADER_KEYWORDS):
            header_spans.append((float(sb[0]), float(sb[1]), float(sb[2]), float(sb[3])))

    if len(header_spans) >= 2:
        header_spans.sort(key=lambda b: b[1])
        row_groups: List[List[Tuple[float, float, float, float]]] = []
        for hb in header_spans:
            cy = (hb[1] + hb[3]) * 0.5
            placed = False
            for rg in row_groups:
                rg_y = (rg[0][1] + rg[0][3]) * 0.5
                if abs(cy - rg_y) <= 12.0:
                    rg.append(hb)
                    placed = True
                    break
            if not placed:
                row_groups.append([hb])

        for rg in row_groups:
            if len(rg) >= 2:
                rx0 = min(b[0] for b in rg) - 10.0
                ry0 = min(b[1] for b in rg) - 4.0
                rx1 = max(b[2] for b in rg) + 10.0
                row_y_top = min(b[1] for b in rg)
                max_row_y = max(b[3] for b in rg)
                for sp in text_spans or []:
                    sb = sp.get("bbox")
                    if not sb or len(sb) < 4:
                        continue
                    scx = (float(sb[0]) + float(sb[2])) * 0.5
                    scy = (float(sb[1]) + float(sb[3])) * 0.5
                    if rx0 <= scx <= rx1 and row_y_top <= scy <= min(page_h, row_y_top + 180.0):
                        max_row_y = max(max_row_y, float(sb[3]))
                if (rx1 - rx0) * (max_row_y - ry0) < max_area:
                    regions.append([rx0, ry0, rx1, max_row_y + 4.0])

    return _merge_overlapping_regions(regions)


def is_bbox_in_table_region(
    bbox: Sequence[float],
    table_regions: Sequence[Sequence[float]],
    pad: float = 2.0,
) -> bool:
    if not bbox or len(bbox) < 4 or not table_regions:
        return False
    cx = (float(bbox[0]) + float(bbox[2])) * 0.5
    cy = (float(bbox[1]) + float(bbox[3])) * 0.5
    for reg in table_regions:
        if len(reg) >= 4:
            if (float(reg[0]) - pad) <= cx <= (float(reg[2]) + pad) and (float(reg[1]) - pad) <= cy <= (float(reg[3]) + pad):
                return True
    return False


