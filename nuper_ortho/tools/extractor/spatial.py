import re
from typing import List, Dict, Any, Optional, Tuple


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
