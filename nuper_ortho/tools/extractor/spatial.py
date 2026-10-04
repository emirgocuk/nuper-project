from typing import List, Dict, Any, Optional


def match_spatial_bbox(
    target_str: str,
    items: List[Dict[str, Any]],
    default_box: Optional[List[float]] = None,
) -> List[float]:
    if default_box is None:
        default_box = [100.0, 100.0, 200.0, 120.0]

    clean_target = target_str.replace("Ø", "").replace("R", "").strip()
    if not clean_target:
        return default_box

    for item in items:
        item_text = item.get("text", "")
        if clean_target in item_text:
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
