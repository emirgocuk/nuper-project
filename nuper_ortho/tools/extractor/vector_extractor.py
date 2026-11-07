import math
import os
import re
from typing import Any, Dict, List, Optional, Tuple


def get_title_block_mask(page_width: float, page_height: float) -> List[Tuple[float, float, float, float]]:
    """
    Standart teknik resim antet ve revizyon maskeleri.
    Bu bölgelerdeki metinler ve notlar ölçü havuzuna karışmaması için elenir.
    """
    return [
        # Sağ alt antet ve genel toleranslar bölgesi (~%52 en, ~%24 boy)
        (page_width * 0.46, page_height * 0.76, page_width, page_height),
        # Sağ üst revizyon tablosu bölgesi (~%32 en, ~%20 boy)
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
    """
    Teknik resim pafta kenarındaki harf/rakam koordinat gridlerini (A,B,C.. 1,2,3..) eler.
    """
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
    """
    Feature Control Frame (FCF) kutularını ve hücrelerini (page.get_drawings) çıkarır.
    Kapalı dikdörtgen ve bölücü dikey çizgileri yakalar.
    """
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
    """
    Katman 1: Deterministik Vektör & Bölge Ayrıştırma (Sıfır VRAM, Saf CPU).
    PyMuPDF sayfasından font boyutu, baseline, rotasyon açısı ve uzamsal ilişkilerle
    ölçüleri ve FCF kutularını ayrıştırır.
    """
    rect = page.rect
    page_w = rect.width
    page_h = rect.height
    masks = get_title_block_mask(page_w, page_h)
    fcf_boxes = extract_fcf_boxes(page)

    page_dict = page.get_text("dict")
    spans_pool = []

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
                # Antet, revizyon ve pafta kenar gridi kontrolü
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

    # 1. Karakter ve Font Analizi & Küçük Fontlu Tolerans Eşleme (Örn: 35 +0.0/-0.2)
    grouped_dimensions = []
    used_spans = set()

    for i, s in enumerate(spans_pool):
        if i in used_spans:
            continue
        txt = s["text"]

        # Sıcaklık, standart numarası, sertlik vb. teknik not değerlerini ele
        if re.search(r"[°\^]C|OC\b|ASTM|MIL-STD|SAE\b|HRC|HB\b|DIN\b|EN\b\s*\d+|ISO\b\s*\d+", txt, re.I):
            continue

        # Sayısal veya sembolik ölçü kalıbı (Ø, R, M veya yalın ölçü)
        nom_match = re.search(r"(?:[Ø\u00d8@]|R|M)?\s*([0-9]+(?:\.[0-9]+)?)", txt)
        if not nom_match:
            continue

        # Kenar harf/sayı veya parça no tek haneli grid filtresi
        if re.match(r"^[A-Z]$", txt) or (re.match(r"^[0-9]$", txt) and s["size"] < 11.0):
            continue

        base_nom = float(nom_match.group(1))
        if base_nom < 0.2 or base_nom > 3500.0:
            continue
        if base_nom in [2375.0, 1907.0, 1444.0, 2417.0, 2024.0, 2025.0, 2026.0]:
            continue

        main_size = s["size"]
        main_bbox = s["bbox"]

        # Çevredeki daha küçük fontlu tolerans span'lerini ara (~%50-%85 font boyutu, sağ bitişiğinde)
        tol_candidates = []
        for j, other in enumerate(spans_pool):
            if i == j or j in used_spans:
                continue
            dx = other["bbox"][0] - main_bbox[2]
            dy = abs(other["bbox"][1] - main_bbox[1])
            is_smaller = other["size"] <= main_size * 0.85
            if -6.0 <= dx <= 28.0 and dy <= 22.0 and is_smaller:
                other_text = other["text"]
                if re.search(r"[+-]?[0-9\.]+|[0-9\.]+", other_text):
                    tol_candidates.append((j, other))

        upper_tol = ""
        lower_tol = ""
        combined_str = txt

        if len(tol_candidates) >= 2:
            c1 = tol_candidates[0][1]
            c2 = tol_candidates[1][1]
            used_spans.add(tol_candidates[0][0])
            used_spans.add(tol_candidates[1][0])
            upper_cand = c1 if c1["bbox"][1] < c2["bbox"][1] else c2
            lower_cand = c2 if c1["bbox"][1] < c2["bbox"][1] else c1
            upper_tol = upper_cand["text"]
            lower_tol = lower_cand["text"]
            combined_str = f"{txt} {upper_tol}/{lower_tol}"
        elif len(tol_candidates) == 1:
            used_spans.add(tol_candidates[0][0])
            c = tol_candidates[0][1]
            t_txt = c["text"]
            if "±" in t_txt:
                val = t_txt.replace("±", "").strip()
                upper_tol = f"+{val}"
                lower_tol = f"-{val}"
            elif "+" in t_txt:
                upper_tol = t_txt.strip()
            elif "-" in t_txt:
                lower_tol = t_txt.strip()
            combined_str = f"{txt} {t_txt}"

        used_spans.add(i)
        grouped_dimensions.append({
            "raw_text": combined_str,
            "nominal": base_nom,
            "upper_tol": upper_tol,
            "lower_tol": lower_tol,
            "bbox": main_bbox,
            "rotation": s["rotation"],
            "font_size": s["size"],
            "page": page_num,
        })

    # 2. FCF Kutuları ile sembol ve datum kesişimi (box.contains(point))
    fcf_annotations = []
    for fbox in fcf_boxes:
        fb = fbox["bbox"]
        inside_texts = []
        for s in spans_pool:
            sb = s["bbox"]
            cx = (sb[0] + sb[2]) / 2.0
            cy = (sb[1] + sb[3]) / 2.0
            if fb[0] <= cx <= fb[2] and fb[1] <= cy <= fb[3]:
                inside_texts.append(s["text"])

        if inside_texts:
            fcf_annotations.append({
                "bbox": fb,
                "symbols": inside_texts,
                "raw_fcf": " | ".join(inside_texts),
            })

    return {
        "page": page_num,
        "page_width": page_w,
        "page_height": page_h,
        "dimensions": grouped_dimensions,
        "fcf_annotations": fcf_annotations,
        "total_text_spans": len(spans_pool),
    }
