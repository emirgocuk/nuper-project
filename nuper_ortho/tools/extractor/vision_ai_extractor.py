import base64
import json
import os
import re
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

VLM_SYSTEM_PROMPT = """You are a metrology CMM expert analyzing an engineering technical drawing.
Extract all dimensions, tolerances, datums, and title block info as strict JSON.
JSON format:
{
  "title_block": {
    "part_number": "string or empty",
    "drawing_number": "string or empty",
    "material": "string or empty",
    "general_tolerance": "string or empty"
  },
  "datums": ["A", "B", ...],
  "dimensions": [
    {
      "type": "DIAMETER | RADIUS | LINEAR | THREAD | GDT",
      "nominal": 0.0,
      "nominal_str": "e.g. Ø25 H7 or 50 ±0.1",
      "upper_tol": "e.g. +0.021 or empty",
      "lower_tol": "e.g. 0.0 or empty",
      "gdt": "e.g. ⌖ 0.05 | A | B or empty",
      "datum_reference": "e.g. [A] or empty",
      "bbox": [ymin, xmin, ymax, xmax]
    }
  ]
}
Return only pure JSON. No markdown fences. No commentary."""


def render_pdf_page_to_base64(pdf_path: str, page_num: int = 1, dpi: int = 150) -> Optional[Tuple[str, int, int]]:
    try:
        import pymupdf
        doc = pymupdf.open(pdf_path)
    except Exception:
        try:
            import fitz
            doc = fitz.open(pdf_path)
        except Exception:
            return None

    try:
        if page_num < 1 or page_num > len(doc):
            return None
        page = doc[page_num - 1]
        pix = page.get_pixmap(dpi=dpi)
        img_bytes = pix.tobytes("png")
        b64 = base64.b64encode(img_bytes).decode("utf-8")
        return b64, pix.width, pix.height
    except Exception:
        return None
    finally:
        doc.close()


def query_ollama_tags(ollama_url: str = "http://localhost:11434", timeout_s: float = 0.5) -> List[str]:
    url = f"{ollama_url.rstrip('/')}/api/tags"
    req = urllib.request.Request(url, headers={"User-Agent": "NuperOrtho/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = data.get("models", [])
            return [m.get("name", "") for m in models if m.get("name")]
    except Exception:
        return []


def select_best_vision_model(available_models: List[str]) -> Optional[str]:
    priority_keywords = [
        "moondream",
        "qwen2.5vl:3b",
        "qwen2.5vl",
        "qwen2.5-vl:3b",
        "qwen2.5-vl",
        "llama3.2-vision",
        "minicpm-v",
        "vl"
    ]
    for kw in priority_keywords:
        for model in available_models:
            if kw in model.lower():
                return model
    return None


def call_ollama_vision(
    b64_image: str,
    model: str,
    ollama_url: str = "http://localhost:11434",
    timeout_s: float = 4.2
) -> Optional[Dict[str, Any]]:
    endpoint = f"{ollama_url.rstrip('/')}/api/generate"
    payload = {
        "model": model,
        "prompt": VLM_SYSTEM_PROMPT,
        "images": [b64_image],
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.1,
            "num_predict": 1024
        }
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(endpoint, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
            content = raw.get("response", "")
            return parse_json_safely(content)
    except Exception:
        return None


def call_cloud_vlm(
    b64_image: str,
    api_key: str,
    endpoint: str = "https://openrouter.ai/api/v1/chat/completions",
    model: str = "google/gemini-2.0-flash-exp:free",
    timeout_s: float = 4.2
) -> Optional[Dict[str, Any]]:
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": VLM_SYSTEM_PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{b64_image}"}
                    }
                ]
            }
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.1,
        "max_tokens": 1500
    }
    body = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    req = urllib.request.Request(endpoint, data=body, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            choices = data.get("choices", [])
            if not choices:
                return None
            msg_content = choices[0].get("message", {}).get("content", "")
            return parse_json_safely(msg_content)
    except Exception:
        return None


def parse_json_safely(content: str) -> Optional[Dict[str, Any]]:
    if not content:
        return None
    cleaned = content.strip()
    match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(1)
    try:
        return json.loads(cleaned)
    except Exception:
        return None


def normalize_ai_dimensions(
    raw_dims: List[Dict[str, Any]],
    page_num: int,
    method_name: str
) -> List[Dict[str, Any]]:
    normalized: List[Dict[str, Any]] = []
    seen = set()

    for item in raw_dims:
        try:
            nominal = float(item.get("nominal", 0.0))
        except (ValueError, TypeError):
            continue

        if nominal <= 0.0 or nominal > 10000.0:
            continue

        raw_type = str(item.get("type", "LINEAR")).upper()
        if "DIA" in raw_type or "HOLE" in raw_type or "Ø" in str(item.get("nominal_str", "")):
            dim_type = "DIAMETER"
            type_label = "Silindirik Çap / Delik"
            icon = "⭕"
        elif "RAD" in raw_type or "R" in str(item.get("nominal_str", "")).upper():
            dim_type = "RADIUS"
            type_label = "Kavis / Yarıçap (Fillet/Round)"
            icon = "📐"
        elif "THREAD" in raw_type or "M" in str(item.get("nominal_str", "")).upper():
            dim_type = "THREAD"
            type_label = "Vida / Diş (Thread Callout)"
            icon = "🧵"
        else:
            dim_type = "LINEAR"
            type_label = "Doğrusal Boyut"
            icon = "📏"

        upper_tol = str(item.get("upper_tol", "")).strip()
        lower_tol = str(item.get("lower_tol", "")).strip()
        nom_str = str(item.get("nominal_str", "")).strip() or str(nominal)

        dedup_key = f"{page_num}_{dim_type}_{nominal}_{upper_tol}_{lower_tol}"
        if dedup_key in seen:
            continue
        seen.add(dedup_key)

        bbox = item.get("bbox")
        if not isinstance(bbox, list) or len(bbox) != 4:
            bbox = [100.0, 100.0, 150.0, 120.0]
        else:
            bbox = [round(float(c), 1) for c in bbox]

        normalized.append({
            "id": len(normalized) + 1,
            "balloon": f"#{len(normalized) + 1}",
            "page": page_num,
            "type": dim_type,
            "type_label": type_label,
            "icon": icon,
            "nominal": nominal,
            "nominal_str": nom_str,
            "upper_tol": upper_tol,
            "lower_tol": lower_tol,
            "measured": "",
            "deviation": "",
            "status": "UNMEASURED",
            "verification": "PARSED",
            "feature_key": f"feat_{str(nominal).replace('.', '_')}_{len(normalized) + 1}",
            "gdt": str(item.get("gdt", "")).strip(),
            "datum_reference": str(item.get("datum_reference", "")).strip(),
            "op": "OP10",
            "op_reason": "AI yerel model tarafından çıkarıldı.",
            "bbox": bbox,
            "provenance": {
                "source_sha256": "",
                "page": page_num,
                "bbox": bbox,
                "method": method_name,
                "extractor_version": "1.0.0"
            }
        })

    return normalized


def run_local_or_hybrid_ai_extraction(
    pdf_path: str,
    max_duration_seconds: float = 4.8
) -> Optional[Dict[str, Any]]:
    start_time = time.time()
    rendered = render_pdf_page_to_base64(pdf_path, page_num=1, dpi=150)
    if not rendered:
        return None

    b64_image, _, _ = rendered
    elapsed = time.time() - start_time
    time_left = max(0.5, max_duration_seconds - elapsed)

    ollama_url = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
    available_models = query_ollama_tags(ollama_url, timeout_s=0.4)
    best_model = select_best_vision_model(available_models)

    raw_result = None
    engine_used = "none"

    if best_model:
        raw_result = call_ollama_vision(
            b64_image=b64_image,
            model=best_model,
            ollama_url=ollama_url,
            timeout_s=time_left
        )
        if raw_result:
            engine_used = f"ollama_{best_model}"

    if not raw_result:
        cloud_api_key = os.environ.get("OPENROUTER_API_KEY") or os.environ.get("OPENAI_API_KEY")
        if cloud_api_key:
            time_left_cloud = max(0.5, max_duration_seconds - (time.time() - start_time))
            raw_result = call_cloud_vlm(
                b64_image=b64_image,
                api_key=cloud_api_key,
                timeout_s=time_left_cloud
            )
            if raw_result:
                engine_used = "cloud_vlm"

    if not raw_result or not isinstance(raw_result, dict):
        return None

    raw_dims = raw_result.get("dimensions", [])
    normalized_dims = normalize_ai_dimensions(raw_dims, page_num=1, method_name=engine_used)

    title_block = raw_result.get("title_block", {})
    if not isinstance(title_block, dict):
        title_block = {}

    datums = raw_result.get("datums", [])
    if not isinstance(datums, list):
        datums = []

    return {
        "success": True,
        "engine": engine_used,
        "duration_seconds": round(time.time() - start_time, 3),
        "title_block": {
            "part_number": str(title_block.get("part_number", "")),
            "drawing_number": str(title_block.get("drawing_number", "")),
            "material": str(title_block.get("material", "")),
            "hardness": "",
            "roughness": "",
            "general_tolerance": str(title_block.get("general_tolerance", ""))
        },
        "datums": [str(d) for d in datums if str(d).strip()],
        "dimensions": normalized_dims
    }
