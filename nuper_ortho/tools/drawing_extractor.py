import hashlib
import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

tools_dir = os.path.dirname(os.path.abspath(__file__))
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)

from extractor.title_block import extract_title_block_fields, extract_datum_labels
from extractor.parse.dimension import parse_diameter_callouts, parse_radius_callouts, parse_linear_callouts
from extractor.parse.thread import parse_thread_callout
from extractor.spatial import match_spatial_bbox


def resolve_pdf_path(path_str: str) -> str:
    if os.path.exists(path_str):
        return os.path.abspath(path_str)

    base_dirs = [
        os.path.abspath("test_assets"),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "test_assets")),
    ]

    raw_target = os.path.basename(path_str).lower()
    norm_target = re.sub(r"[\s_\-]+", "", raw_target)

    for base in base_dirs:
        if os.path.exists(base):
            for root, _, files in os.walk(base):
                for f in files:
                    if re.sub(r"[\s_\-]+", "", f.lower()) == norm_target or f.lower() == raw_target:
                        return os.path.join(root, f)

    return os.path.abspath(path_str)


def extract_from_pdf(pdf_path: str):
    resolved = resolve_pdf_path(pdf_path)
    if not os.path.exists(resolved):
        return {
            "success": False,
            "error": f"Dosya bulunamadi: {pdf_path} (cozumlenen: {resolved})",
            "filename": os.path.basename(pdf_path),
            "title_block": {},
            "datums": [],
            "dimensions": [],
        }

    cache_dir = os.path.join(os.path.dirname(__file__), ".ocr_cache")
    os.makedirs(cache_dir, exist_ok=True)
    with open(resolved, "rb") as f:
        file_hash = hashlib.md5(f.read()).hexdigest()
    cache_file = os.path.join(cache_dir, f"{file_hash}.json")

    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cached_data = json.load(f)
                return parse_text_to_metrology(
                    cached_data["text_content"],
                    cached_data["page_count"],
                    os.path.basename(resolved),
                    resolved,
                    cached_data.get("pages_data", []),
                )
        except Exception:
            pass

    pages_data = []
    text_content = ""
    page_count = 0

    try:
        import pymupdf
        doc = pymupdf.open(resolved)
        page_count = len(doc)
        total_vector_text = 0

        for i, page in enumerate(doc):
            txt = page.get_text() or ""
            total_vector_text += len(txt.strip())

        use_ocr = (total_vector_text < 50)
        ocr_engine = None
        if use_ocr:
            try:
                from rapidocr_onnxruntime import RapidOCR
                ocr_engine = RapidOCR()
            except Exception:
                ocr_engine = None

        for i, page in enumerate(doc):
            txt = page.get_text() or ""
            page_num = i + 1
            items = []

            if not use_ocr:
                words = page.get_text("words")
                for w in words:
                    items.append({
                        "text": w[4],
                        "bbox": [round(w[0], 1), round(w[1], 1), round(w[2], 1), round(w[3], 1)],
                        "confidence": 1.0,
                    })
                pages_data.append({"page": page_num, "text": txt, "items": items, "method": "vector"})
                text_content += f"\n--- SAYFA {page_num} ---\n" + txt
            else:
                ocr_items = []
                ocr_lines = []
                if ocr_engine is not None:
                    pix = page.get_pixmap(dpi=150)
                    img_bytes = pix.tobytes("png")
                    res, _ = ocr_engine(img_bytes)
                    if res:
                        for box, text_val, score in res:
                            x0 = min(pt[0] for pt in box)
                            y0 = min(pt[1] for pt in box)
                            x1 = max(pt[0] for pt in box)
                            y1 = max(pt[1] for pt in box)
                            clean_t = text_val.replace("\ufffd", "±").replace("@", "Ø")
                            score_val = float(score) if isinstance(score, (int, float)) else 0.85
                            ocr_items.append({
                                "text": clean_t,
                                "bbox": [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)],
                                "confidence": score_val,
                            })
                            ocr_lines.append(clean_t)

                page_txt = "\n".join(ocr_lines) if ocr_lines else txt
                pages_data.append({"page": page_num, "text": page_txt, "items": ocr_items, "method": "ocr"})
                text_content += f"\n--- SAYFA {page_num} ---\n" + page_txt

        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump({
                "text_content": text_content,
                "page_count": page_count,
                "pages_data": pages_data,
            }, f, ensure_ascii=False)

    except Exception:
        try:
            import pypdf
            reader = pypdf.PdfReader(resolved)
            page_count = len(reader.pages)
            for i, page in enumerate(reader.pages):
                txt = page.extract_text() or ""
                pages_data.append({"page": i + 1, "text": txt, "items": [], "method": "vector"})
                text_content += f"\n--- SAYFA {i+1} ---\n" + txt
        except Exception:
            pass

    return parse_text_to_metrology(text_content, page_count, os.path.basename(resolved), resolved, pages_data)


def parse_text_to_metrology(text: str, page_count: int, filename: str, full_path: str = "", pages_data=None):
    result = {
        "success": True,
        "filename": filename,
        "page_count": page_count if page_count > 0 else 1,
        "raw_text_length": len(text),
        "title_block": {
            "part_number": "",
            "material": "",
            "hardness": "",
            "roughness": "",
            "general_tolerance": "",
            "drawing_number": "",
        },
        "datums": [],
        "dimensions": [],
    }

    result["title_block"] = extract_title_block_fields(text, filename)
    result["datums"] = extract_datum_labels(text)

    dims = []
    balloon_idx = 1
    seen_nominals = set()

    page_entries = pages_data if pages_data and len(pages_data) > 0 else [{"page": 1, "text": text, "items": [], "method": "vector"}]

    for p_info in page_entries:
        p_num = p_info.get("page", 1)
        p_text = p_info.get("text", "")
        p_items = p_info.get("items", [])

        # (A) Çap ve Delik Ölçüleri (Ø)
        for parsed_dia in parse_diameter_callouts(p_text):
            nom = parsed_dia["nominal"]
            qty = parsed_dia["quantity"]
            fit = parsed_dia["fit"] or ""
            limit = parsed_dia["limit"] or ""
            key = f"DIA_{p_num}_{qty}_{nom}_{fit}_{limit}_{parsed_dia['upper_tol']}_{parsed_dia['lower_tol']}"
            if key in seen_nominals:
                continue
            seen_nominals.add(key)

            label = f"Montaj Delik Grubu ({qty}x)" if qty > 1 else "Silindirik Cap / Delik"
            box = match_spatial_bbox(str(nom), p_items, [200.0, 200.0, 250.0, 220.0])

            dims.append({
                "id": balloon_idx,
                "balloon": f"#{balloon_idx}",
                "page": p_num,
                "type": "DIAMETER",
                "type_label": label,
                "icon": "⭕",
                "nominal": nom,
                "nominal_str": parsed_dia["nominal_str"],
                "upper_tol": parsed_dia["upper_tol"],
                "lower_tol": parsed_dia["lower_tol"],
                "measured": "",
                "deviation": "",
                "status": "UNMEASURED",
                "verification": "PARSED",
                "feature_key": f"dia_{nom}_{balloon_idx}".replace(".", "_"),
                "gdt": "",
                "datum_reference": f"[{result['datums'][0]}]" if result["datums"] else "",
                "bbox": box,
            })
            balloon_idx += 1

        # (B) Yarıçap Ölçüleri (R)
        for parsed_rad in parse_radius_callouts(p_text):
            r_val = parsed_rad["nominal"]
            qty = parsed_rad["quantity"]
            key = f"RAD_{p_num}_{qty}_{r_val}"
            if key in seen_nominals:
                continue
            seen_nominals.add(key)

            box = match_spatial_bbox(str(r_val), p_items, [500.0, 500.0, 550.0, 520.0])
            dims.append({
                "id": balloon_idx,
                "balloon": f"#{balloon_idx}",
                "page": p_num,
                "type": "RADIUS",
                "type_label": "Kavis / Yaricap (Fillet/Round)",
                "icon": "📐",
                "nominal": r_val,
                "nominal_str": parsed_rad["nominal_str"],
                "upper_tol": "",
                "lower_tol": "",
                "measured": "",
                "deviation": "",
                "status": "UNMEASURED",
                "verification": "PARSED",
                "feature_key": f"radius_{r_val}_{balloon_idx}".replace(".", "_"),
                "gdt": "",
                "datum_reference": f"[{result['datums'][0]}]" if result["datums"] else "",
                "bbox": box,
            })
            balloon_idx += 1

        # (C) Metrik / UNC / UNF Vida Dişleri
        thread_matches = re.finditer(r"\b((?:M\d+(?:\s*x\s*[\d\.]+)?(?:\s*-\s*[0-9A-Za-z]+)?)|(?:\d+/\d+-\d+\s*(?:UNF|UNC|UN)))\b", p_text, re.IGNORECASE)
        for m in thread_matches:
            th = m.group(1).strip()
            key = f"TH_{p_num}_{th}"
            if key in seen_nominals:
                continue
            seen_nominals.add(key)
            box = match_spatial_bbox(th, p_items, [350.0, 200.0, 400.0, 220.0])
            dims.append({
                "id": balloon_idx,
                "balloon": f"#{balloon_idx}",
                "page": p_num,
                "type": "THREAD",
                "type_label": "Vida / Dis (Thread Callout)",
                "icon": "🧵",
                "nominal": 0.0,
                "nominal_str": th,
                "upper_tol": "",
                "lower_tol": "",
                "measured": "",
                "deviation": "",
                "status": "UNMEASURED",
                "verification": "PARSED",
                "feature_key": f"thread_{balloon_idx}",
                "gdt": "",
                "datum_reference": f"[{result['datums'][0]}]" if result["datums"] else "",
                "bbox": box,
            })
            balloon_idx += 1

        # (D) Açık Toleranslı Doğrusal Boyutlar (±, +, -)
        for parsed_lin in parse_linear_callouts(p_text):
            val = parsed_lin["nominal"]
            key = f"LIN_{p_num}_{val}_{parsed_lin['nominal_str']}"
            if key in seen_nominals:
                continue
            seen_nominals.add(key)

            box = match_spatial_bbox(str(val), p_items, [400.0, 500.0, 450.0, 520.0])
            dims.append({
                "id": balloon_idx,
                "balloon": f"#{balloon_idx}",
                "page": p_num,
                "type": "LINEAR",
                "type_label": "Dogrusal Boyut (Linear Distance)",
                "icon": "📏",
                "nominal": val,
                "nominal_str": parsed_lin["nominal_str"],
                "upper_tol": parsed_lin["upper_tol"],
                "lower_tol": parsed_lin["lower_tol"],
                "measured": "",
                "deviation": "",
                "status": "UNMEASURED",
                "verification": "PARSED",
                "feature_key": f"lin_{val}_{balloon_idx}".replace(".", "_"),
                "gdt": "",
                "datum_reference": f"[{result['datums'][0]}]" if result["datums"] else "",
                "bbox": box,
            })
            balloon_idx += 1

    result["dimensions"] = dims
    return result



if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Dosya yolu belirtilmedi."}))
        sys.exit(1)

    file_path = sys.argv[1]
    res = extract_from_pdf(file_path)
    print(json.dumps(res, ensure_ascii=False, indent=2))
