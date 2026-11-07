import base64
import hashlib
import json
import os
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

tools_dir = os.path.dirname(os.path.abspath(__file__))
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)

from extractor.title_block import extract_title_block_fields, extract_datum_labels
from extractor.parse.dimension import parse_diameter_callouts, parse_radius_callouts, parse_linear_callouts
from extractor.parse.thread import parse_thread_callout
from extractor.spatial import match_spatial_bbox, find_spatial_tolerances_near
from extractor.vector_extractor import extract_vector_dimensions_from_page, get_title_block_mask, is_inside_mask
from extractor.semantic_grammar import normalize_engineering_callout, build_321_alignment, classify_operation_setup
from extractor.brep_verifier import parse_step_file, verify_dimensions_against_step
from extractor.vision_ai_extractor import run_local_or_hybrid_ai_extraction


def is_feature_in_title_or_notes(box: List[float], items: List[Dict[str, Any]], masks: List[Tuple[float, float, float, float]], page_w: float, page_h: float) -> bool:
    if is_inside_mask(tuple(box), masks):
        return True
    cx = (box[0] + box[2]) / 2.0
    cy = (box[1] + box[3]) / 2.0
    if cx < 65.0 or cx > page_w - 40.0 or cy < 40.0 or cy > page_h - 40.0:
        return True
    for it in items:
        ib = it.get("bbox", [0, 0, 0, 0])
        if max(ib[0], box[0]) <= min(ib[2], box[2]) and max(ib[1], box[1]) <= min(ib[3], box[3]):
            txt = (it.get("text") or "").upper()
            if any(k in txt for k in ["NOTLAR", "BAKINIZ", "NOTE", "STANDART", "STANDARD", "ARIAL", "BUYUKLUGU", "YUKSEKLIG", "MALZEME", "KAPLAMA", "BOYA", "DOKUMAN", "SAYFA", "SHEET", "OLCEK", "SCALE", "ASME", "ISO 2768", "TARALI"]):
                return True
    return False


def resolve_feature_bbox(target_str: str, items: List[Dict[str, Any]], default_box: List[float]) -> List[float]:
    clean_target = target_str.replace("Ø", "").replace("R", "").replace("±", "").strip()
    if clean_target:
        candidates = [target_str, clean_target]
        ch_m = re.match(r"(\d+(?:\.\d+)?)\s*x\s*45", clean_target, re.I)
        if ch_m:
            ch_num = float(ch_m.group(1))
            ch_int = str(int(ch_num)) if ch_num.is_integer() else str(ch_num)
            candidates.insert(0, f"{ch_int} x45")
            candidates.insert(1, f"{ch_int}x45")
            candidates.insert(2, f"{ch_m.group(1)} x45")
        try:
            parts = clean_target.split()
            first_num = parts[0].replace("x", "").strip()
            if first_num:
                candidates.append(first_num)
            val = float(first_num)
            if val >= 4.0:
                if val.is_integer():
                    candidates.append(str(int(val)))
                candidates.append(f"{val:.1f}")
        except Exception:
            pass
        for cand in dict.fromkeys(c for c in candidates if c):
            if re.match(r"^[0-9]$", cand):
                continue
            pat = re.compile(r"(?<![A-Za-z0-9_\-\.])" + re.escape(cand) + r"(?![A-Za-z0-9_\-\.])", re.IGNORECASE)
            for it in items:
                if pat.search(it.get("text", "")):
                    return it.get("bbox", default_box)
    return match_spatial_bbox(target_str, items, default_box)


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


def find_matching_step_file(pdf_path: str) -> Optional[str]:
    pdf_dir = os.path.dirname(os.path.abspath(pdf_path))
    pdf_stem = os.path.splitext(os.path.basename(pdf_path))[0].lower()
    norm_stem = re.sub(r"[\s_\-]+", "", pdf_stem)

    step_candidates = []
    if os.path.exists(pdf_dir):
        for f in os.listdir(pdf_dir):
            if f.lower().endswith((".stp", ".step")):
                cand_path = os.path.join(pdf_dir, f)
                cand_stem = re.sub(r"[\s_\-]+", "", os.path.splitext(f)[0].lower())
                if cand_stem in norm_stem or norm_stem in cand_stem:
                    return cand_path
                step_candidates.append(cand_path)
        if len(step_candidates) == 1:
            return step_candidates[0]

    return None


def extract_from_pdf(pdf_path: str, step_path: Optional[str] = None) -> Dict[str, Any]:
    resolved = resolve_pdf_path(pdf_path)
    if not os.path.exists(resolved):
        return {
            "success": False,
            "error": f"Dosya bulunamadi: {pdf_path} (cozumlenen: {resolved})",
            "filename": os.path.basename(pdf_path),
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
            "pages": [],
        }

    rendered_pages: List[Dict[str, Any]] = []
    try:
        import pymupdf
        doc_render = pymupdf.open(resolved)
        for i, page in enumerate(doc_render):
            pix = page.get_pixmap(dpi=72)
            b64 = "data:image/jpeg;base64," + base64.b64encode(pix.tobytes("jpeg", 80)).decode("ascii")
            rendered_pages.append({
                "page": i + 1,
                "width": pix.width,
                "height": pix.height,
                "image_data": b64,
            })
        doc_render.close()
    except Exception:
        pass

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
                    step_path=step_path,
                    rendered_pages=rendered_pages,
                )
        except Exception:
            pass

    pages_data = []
    text_content = ""
    page_count = len(rendered_pages) if rendered_pages else 1
    vector_dims_all = []

    try:
        import pymupdf
        doc = pymupdf.open(resolved)
        page_count = len(doc)
        total_vector_text = sum(len((page.get_text() or "").strip()) for page in doc)
        use_ocr = (total_vector_text < 50)

        if not use_ocr:
            for i, page in enumerate(doc):
                p_num = i + 1
                v_res = extract_vector_dimensions_from_page(page, p_num)
                txt = page.get_text() or ""
                text_content += f"\n--- SAYFA {p_num} ---\n" + txt

                words = page.get_text("words")
                items = [{
                    "text": w[4],
                    "bbox": [round(w[0], 1), round(w[1], 1), round(w[2], 1), round(w[3], 1)],
                    "confidence": 1.0,
                } for w in words]

                pages_data.append({
                    "page": p_num,
                    "text": txt,
                    "items": items,
                    "vector_dims": v_res.get("dimensions", []),
                    "fcf_annotations": v_res.get("fcf_annotations", []),
                    "method": "vector",
                })
                vector_dims_all.extend(v_res.get("dimensions", []))
            doc.close()

            if len(vector_dims_all) > 0:
                return parse_text_to_metrology(
                    text_content,
                    page_count,
                    os.path.basename(resolved),
                    resolved,
                    pages_data,
                    step_path=step_path,
                    rendered_pages=rendered_pages,
                )
        else:
            doc.close()
    except Exception:
        pass

    ai_result = run_local_or_hybrid_ai_extraction(resolved, max_duration_seconds=4.2)
    if ai_result and ai_result.get("dimensions"):
        dims = ai_result["dimensions"]
        if step_path and os.path.exists(step_path):
            step_data = parse_step_file(step_path)
            if step_data.get("success"):
                verified, _ = verify_dimensions_against_step(dims, step_data)
                dims = verified
        for idx, d in enumerate(dims, 1):
            d["id"] = idx
            d["balloon"] = f"#{idx}"
        return {
            "success": True,
            "filename": os.path.basename(resolved),
            "page_count": len(rendered_pages) if rendered_pages else 1,
            "pages": rendered_pages,
            "raw_text_length": 0,
            "title_block": ai_result.get("title_block", {}),
            "datums": ai_result.get("datums", []),
            "dimensions": dims,
        }

    ocr_engine = None
    try:
        from rapidocr_onnxruntime import RapidOCR
        ocr_engine = RapidOCR()
    except Exception:
        pass

    try:
        import pymupdf
        doc = pymupdf.open(resolved)
        for i, page in enumerate(doc):
            p_num = i + 1
            txt = page.get_text() or ""
            ocr_items = []
            ocr_lines = []

            if ocr_engine is not None:
                pix = page.get_pixmap(dpi=150)
                img_bytes = pix.tobytes("png")
                scale_x = page.rect.width / pix.width if pix.width > 0 else 1.0
                scale_y = page.rect.height / pix.height if pix.height > 0 else 1.0
                res, _ = ocr_engine(img_bytes)
                if res:
                    for box, text_val, score in res:
                        x0 = min(pt[0] for pt in box) * scale_x
                        y0 = min(pt[1] for pt in box) * scale_y
                        x1 = max(pt[0] for pt in box) * scale_x
                        y1 = max(pt[1] for pt in box) * scale_y
                        clean_t = text_val.replace("\ufffd", "±").replace("@", "Ø")
                        score_val = float(score) if isinstance(score, (int, float)) else 0.85
                        ocr_items.append({
                            "text": clean_t,
                            "bbox": [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)],
                            "confidence": score_val,
                        })
                        ocr_lines.append(clean_t)

                try:
                    import io
                    from PIL import Image
                    img = Image.open(io.BytesIO(img_bytes))
                    w, h = img.size
                    rot90 = img.rotate(90, expand=True)
                    buf = io.BytesIO()
                    rot90.save(buf, format="PNG")
                    res90, _ = ocr_engine(buf.getvalue())
                    if res90:
                        for box, text_val, score in res90:
                            x0_r = min(pt[0] for pt in box)
                            y0_r = min(pt[1] for pt in box)
                            x1_r = max(pt[0] for pt in box)
                            y1_r = max(pt[1] for pt in box)
                            orig_x0 = (w - y1_r) * scale_x
                            orig_x1 = (w - y0_r) * scale_x
                            orig_y0 = x0_r * scale_y
                            orig_y1 = x1_r * scale_y
                            clean_t = text_val.replace("\ufffd", "±").replace("@", "Ø")
                            score_val = float(score) if isinstance(score, (int, float)) else 0.85
                            ocr_items.append({
                                "text": clean_t,
                                "bbox": [round(orig_x0, 1), round(orig_y0, 1), round(orig_x1, 1), round(orig_y1, 1)],
                                "confidence": score_val,
                            })
                            ocr_lines.append(clean_t)
                except Exception:
                    pass

            page_txt = "\n".join(ocr_lines) if ocr_lines else txt
            pages_data.append({"page": p_num, "text": page_txt, "items": ocr_items, "method": "ocr"})
            text_content += f"\n--- SAYFA {p_num} ---\n" + page_txt
        doc.close()

        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump({
                "text_content": text_content,
                "page_count": page_count,
                "pages_data": pages_data,
            }, f, ensure_ascii=False)
    except Exception:
        pass

    return parse_text_to_metrology(
        text_content,
        page_count,
        os.path.basename(resolved),
        resolved,
        pages_data,
        step_path=step_path,
        rendered_pages=rendered_pages,
    )


def parse_text_to_metrology(
    text: str,
    page_count: int,
    filename: str,
    full_path: str = "",
    pages_data=None,
    step_path: Optional[str] = None,
    rendered_pages: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
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
        "pages": rendered_pages if rendered_pages is not None else [],
    }

    result["title_block"] = extract_title_block_fields(text, filename)
    result["datums"] = extract_datum_labels(text)

    # 3-2-1 Hizalama Şeması (Katman 2)
    alignment_321 = build_321_alignment(result["datums"])

    dims = []
    balloon_idx = 1
    seen_nominals = set()

    page_entries = pages_data if pages_data and len(pages_data) > 0 else [{"page": 1, "text": text, "items": [], "method": "vector"}]

    ref_w = 1190.55
    ref_h = 841.89
    if rendered_pages and len(rendered_pages) > 0:
        ref_w = float(rendered_pages[0].get("width") or 1190.55)
        ref_h = float(rendered_pages[0].get("height") or 841.89)
    page_masks = get_title_block_mask(ref_w, ref_h)

    # 1. Katman 1'den gelen vektörel ölçüleri al
    has_vector_dims = False
    for p_info in page_entries:
        p_num = p_info.get("page", 1)
        p_text = p_info.get("text", "")
        v_dims = p_info.get("vector_dims", [])
        if v_dims:
            has_vector_dims = True
            for vd in v_dims:
                raw_txt = vd.get("raw_text", "")
                norm = normalize_engineering_callout(raw_txt)
                nom = norm.get("nominal", vd.get("nominal", 0.0))

                key = f"V_{p_num}_{norm.get('type')}_{nom}_{vd.get('upper_tol')}_{vd.get('lower_tol')}"
                if key in seen_nominals:
                    continue
                seen_nominals.add(key)

                u_tol = vd.get("upper_tol") or norm.get("upper_tol", "")
                l_tol = vd.get("lower_tol") or norm.get("lower_tol", "")

                dims.append({
                    "id": balloon_idx,
                    "balloon": f"#{balloon_idx}",
                    "page": p_num,
                    "type": norm.get("type", "LINEAR"),
                    "type_label": norm.get("type_label", "Doğrusal Boyut"),
                    "icon": "⭕" if norm.get("type") in ("HOLE", "DIAMETER") else ("📐" if norm.get("type") == "RADIUS" else "📏"),
                    "nominal": nom,
                    "nominal_str": norm.get("nominal_str", str(nom)),
                    "upper_tol": str(u_tol),
                    "lower_tol": str(l_tol),
                    "measured": "",
                    "deviation": "",
                    "status": "UNMEASURED",
                    "verification": "PARSED",
                    "feature_key": f"feat_{nom}_{balloon_idx}".replace(".", "_"),
                    "gdt": "",
                    "datum_reference": f"[{result['datums'][0]}]" if result["datums"] else "",
                    "op": norm.get("op", "OP10"),
                    "op_reason": norm.get("op_reason", "Standart üst kurulum."),
                    "bbox": vd.get("bbox", [100.0, 100.0, 150.0, 120.0]),
                })
                balloon_idx += 1

    # 2. Vektörel ölçü bulunamadıysa (taranmış resim veya klasik metin analizi)
    if not has_vector_dims:
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
                if any(abs(d.get("nominal", 0) - nom) < 0.6 and d.get("page") == p_num for d in dims):
                    continue
                key = f"DIA_{p_num}_{qty}_{nom}_{fit}_{limit}_{parsed_dia['upper_tol']}_{parsed_dia['lower_tol']}"
                if key in seen_nominals:
                    continue
                box = resolve_feature_bbox(parsed_dia["nominal_str"], p_items, [200.0, 200.0, 250.0, 220.0])
                if is_feature_in_title_or_notes(box, p_items, page_masks, ref_w, ref_h):
                    continue
                seen_nominals.add(key)

                norm = normalize_engineering_callout(f"{qty}x Ø{nom} {fit}")
                dia_upper = parsed_dia["upper_tol"]
                dia_lower = parsed_dia["lower_tol"]
                if not dia_upper and not dia_lower:
                    s_u, s_l = find_spatial_tolerances_near(box, p_items)
                    if s_u or s_l:
                        dia_upper = s_u or ""
                        dia_lower = s_l or ""

                dims.append({
                    "id": balloon_idx,
                    "balloon": f"#{balloon_idx}",
                    "page": p_num,
                    "type": "DIAMETER",
                    "type_label": norm.get("type_label", "Silindirik Çap / Delik"),
                    "icon": "⭕",
                    "nominal": nom,
                    "nominal_str": parsed_dia["nominal_str"],
                    "upper_tol": dia_upper,
                    "lower_tol": dia_lower,
                    "measured": "",
                    "deviation": "",
                    "status": "UNMEASURED",
                    "verification": "PARSED",
                    "feature_key": f"dia_{nom}_{balloon_idx}".replace(".", "_"),
                    "gdt": "",
                    "datum_reference": f"[{result['datums'][0]}]" if result["datums"] else "",
                    "op": norm.get("op", "OP10"),
                    "op_reason": norm.get("op_reason", "Dikey Z- probu ile taranabilir."),
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
                box = resolve_feature_bbox(parsed_rad["nominal_str"], p_items, [500.0, 500.0, 550.0, 520.0])
                if is_feature_in_title_or_notes(box, p_items, page_masks, ref_w, ref_h):
                    continue
                seen_nominals.add(key)

                norm = normalize_engineering_callout(f"{qty}x R{r_val}")
                dims.append({
                    "id": balloon_idx,
                    "balloon": f"#{balloon_idx}",
                    "page": p_num,
                    "type": "RADIUS",
                    "type_label": norm.get("type_label", "Kavis / Yarıçap (Fillet/Round)"),
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
                    "op": norm.get("op", "OP10"),
                    "op_reason": norm.get("op_reason", "Kavis prob taraması."),
                    "bbox": box,
                })
                balloon_idx += 1

            # (C) Metrik / Vida Dişleri
            thread_matches = re.finditer(r"\b((?:M\d+(?:\s*x\s*[\d\.]+)?(?:\s*-\s*[0-9A-Za-z]+)?)|(?:\d+/\d+-\d+\s*(?:UNF|UNC|UN)))\b", p_text, re.IGNORECASE)
            for m in thread_matches:
                th = m.group(1).strip()
                key = f"TH_{p_num}_{th}"
                if key in seen_nominals:
                    continue
                box = resolve_feature_bbox(th, p_items, [350.0, 200.0, 400.0, 220.0])
                if is_feature_in_title_or_notes(box, p_items, page_masks, ref_w, ref_h):
                    continue
                seen_nominals.add(key)
                dims.append({
                    "id": balloon_idx,
                    "balloon": f"#{balloon_idx}",
                    "page": p_num,
                    "type": "THREAD",
                    "type_label": "Vida / Diş (Thread Callout)",
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
                    "op": "OP10",
                    "op_reason": "Diş ölçümü.",
                    "bbox": box,
                })
                balloon_idx += 1

            # (D) Açık Toleranslı Doğrusal Boyutlar
            for parsed_lin in parse_linear_callouts(p_text):
                val = parsed_lin["nominal"]
                if any(abs(d.get("nominal", 0) - val) < 0.01 and d.get("page") == p_num for d in dims):
                    continue
                key = f"LIN_{p_num}_{val}_{parsed_lin['nominal_str']}"
                if key in seen_nominals:
                    continue
                box = resolve_feature_bbox(parsed_lin["nominal_str"], p_items, [400.0, 500.0, 450.0, 520.0])
                if is_feature_in_title_or_notes(box, p_items, page_masks, ref_w, ref_h):
                    continue
                seen_nominals.add(key)

                feat_type = parsed_lin.get("type", "LINEAR")
                if feat_type == "ANGULAR":
                    type_label = "Açısal Boyut / Koniklik"
                    icon = "📐"
                    op_reason = "Açı ve konik kafa probu."
                elif feat_type == "CHAMFER":
                    type_label = "Pah Boyutu (Chamfer)"
                    icon = "📐"
                    op_reason = "Pah kenar taraması."
                else:
                    norm = normalize_engineering_callout(f"{val} {parsed_lin['upper_tol']}")
                    type_label = norm.get("type_label", "Doğrusal Boyut (Linear Distance)")
                    icon = "📏"
                    op_reason = norm.get("op_reason", "Doğrusal mesafe probu.")

                lin_upper = parsed_lin["upper_tol"]
                lin_lower = parsed_lin["lower_tol"]
                if not lin_upper or not lin_lower or lin_lower == "0.000":
                    s_u, s_l = find_spatial_tolerances_near(box, p_items)
                    if s_u and not lin_upper:
                        lin_upper = s_u
                    if s_l and (not lin_lower or lin_lower == "0.000"):
                        lin_lower = s_l
                dims.append({
                    "id": balloon_idx,
                    "balloon": f"#{balloon_idx}",
                    "page": p_num,
                    "type": feat_type,
                    "type_label": type_label,
                    "icon": icon,
                    "nominal": val,
                    "nominal_str": parsed_lin["nominal_str"],
                    "upper_tol": lin_upper,
                    "lower_tol": lin_lower,
                    "measured": "",
                    "deviation": "",
                    "status": "UNMEASURED",
                    "verification": "PARSED",
                    "feature_key": f"lin_{str(val).replace('.', '_')}_{balloon_idx}",
                    "gdt": "",
                    "datum_reference": f"[{result['datums'][0]}]" if result["datums"] else "",
                    "op": "OP10",
                    "op_reason": op_reason,
                    "bbox": box,
                })
                balloon_idx += 1

    # 3. KATMAN 3: 3D STEP B-Rep Çapraz Doğrulama & Hakem Katmanı (Sanity Check)
    if step_path and os.path.exists(step_path):
        step_data = parse_step_file(step_path)
        if step_data.get("success"):
            verified, pruned = verify_dimensions_against_step(dims, step_data)
            dims = verified

    for d in dims:
        b = d.get("bbox")
        if b and len(b) >= 4:
            if b[0] > ref_w * 1.2 or b[1] > ref_h * 1.2 or b[2] > ref_w * 1.2 or b[3] > ref_h * 1.2:
                scale = ref_w / 2481.0
                d["bbox"] = [
                    round(b[0] * scale, 1),
                    round(b[1] * scale, 1),
                    round(b[2] * scale, 1),
                    round(b[3] * scale, 1),
                ]

    for idx, d in enumerate(dims, 1):
        d["id"] = idx
        d["balloon"] = f"#{idx}"

    result["dimensions"] = dims
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Dosya yolu belirtilmedi."}))
        sys.exit(1)

    file_path = sys.argv[1]
    step_file = sys.argv[2] if len(sys.argv) > 2 else None
    res = extract_from_pdf(file_path, step_path=step_file)
    print(json.dumps(res, ensure_ascii=False, indent=2))
