import json
import re
import urllib.request
from typing import Any, Dict, List, Optional, Tuple


def normalize_engineering_callout(raw_text: str) -> Dict[str, Any]:
    """
    1. Mühendislik Grameri ve Sözdizimi Düzeltme:
    Çizgilerle kesiştiği için bozulabilen metinleri standart kalıplarla yapılandırır:
    - '4x O2.5' -> Type: HOLE, Count: 4, Nominal: 2.5, Unit: mm
    - '12 +- 0.5' -> Type: LINEAR, Nominal: 12.0, UpperTol: +0.5, LowerTol: -0.5
    - '2X R2.5' -> Type: RADIUS, Count: 2, Nominal: 2.5
    - '20 H7' -> Type: HOLE/DIAMETER, Nominal: 20.0, Fit: H7
    """
    cleaned = raw_text.strip()
    # Farklı font çap sembolleri (\xa2, \xd8, \xf8, @, O, o)
    cleaned = re.sub(r"[\u00d8\u00f8\u2300\u2349\xa2@]", "Ø", cleaned)
    cleaned = re.sub(r"\b[Oo]([0-9]+(?:\.[0-9]+)?)\b", r"Ø\1", cleaned)
    cleaned = cleaned.replace("+-", "±").replace("+/-", "±")

    # 1. Delik Grubu (Örn: 4x Ø2.5, 4X 2.5, 6x M5, R6.3(x2))
    hole_group_match = re.search(r"(\d+)\s*[xX]\s*(?:Ø|DIA)?\s*([0-9]+(?:\.[0-9]+)?)", cleaned)
    if hole_group_match:
        qty = int(hole_group_match.group(1))
        nom = float(hole_group_match.group(2))
        return {
            "type": "HOLE",
            "type_label": f"Montaj Delik Grubu ({qty}x)",
            "count": qty,
            "nominal": nom,
            "nominal_str": f"{qty}x Ø{nom}",
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Dikey Z-probu ile üstten tek bağlamada ölçülebilir.",
        }

    # 2. Çap / Delik (Ø20 H7, Ø35 +0.0/-0.2, Ø17, Ø2.5)
    dia_match = re.search(r"(?:Ø|DIA)\s*([0-9]+(?:\.[0-9]+)?)(?:\s*([A-Za-z]\d+))?", cleaned)
    if dia_match:
        nom = float(dia_match.group(1))
        fit = dia_match.group(2) or ""
        u_tol = "+0.021" if fit == "H7" and 18.0 <= nom <= 30.0 else "+0.05"
        l_tol = "0.0" if fit == "H7" else "-0.05"
        return {
            "type": "DIAMETER",
            "type_label": "Silindirik Çap / Delik",
            "count": 1,
            "nominal": nom,
            "nominal_str": f"Ø{nom} {fit}".strip(),
            "fit": fit,
            "upper_tol": u_tol,
            "lower_tol": l_tol,
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Dikey mil/delik geometrisi.",
        }

    # 3. Yarıçap / Radyüs (R2.5, 2x R6.3, R6.3(x2))
    rad_match = re.search(r"(?:(\d+)\s*[xX]\s*)?R\s*([0-9]+(?:\.[0-9]+)?)(?:\s*\(x(\d+)\))?", cleaned, re.IGNORECASE)
    if rad_match:
        q1 = int(rad_match.group(1)) if rad_match.group(1) else None
        q2 = int(rad_match.group(3)) if rad_match.group(3) else None
        qty = q1 or q2 or 1
        nom = float(rad_match.group(2))
        return {
            "type": "RADIUS",
            "type_label": "Kavis / Yarıçap (Fillet/Round)",
            "count": qty,
            "nominal": nom,
            "nominal_str": f"R{nom}" if qty == 1 else f"{qty}x R{nom}",
            "upper_tol": "+0.2",
            "lower_tol": "-0.2",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Parça dış/iç kavis yüzeyi.",
        }

    # 4. Doğrusal Ölçü ve Tolerans (Örn: 12 +- 0.5, 12 ± 0.5, 35 +0.0/-0.2)
    lin_tol_match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*(?:±|\+-)\s*([0-9]+(?:\.[0-9]+)?)", cleaned)
    if lin_tol_match:
        nom = float(lin_tol_match.group(1))
        tol_val = float(lin_tol_match.group(2))
        return {
            "type": "LINEAR",
            "type_label": "Doğrusal Boyut (Toleranslı)",
            "count": 1,
            "nominal": nom,
            "nominal_str": f"{nom} ±{tol_val}",
            "upper_tol": f"+{tol_val}",
            "lower_tol": f"-{tol_val}",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Parça üst yüzey derinliği / mesafesi.",
        }

    # Asimetrik tolerans (Örn: 35 +0.0/-0.2)
    asym_match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*([+-][0-9\.]+)\s*/\s*([+-][0-9\.]+)", cleaned)
    if asym_match:
        nom = float(asym_match.group(1))
        u_tol = asym_match.group(2)
        l_tol = asym_match.group(3)
        return {
            "type": "LINEAR",
            "type_label": "Doğrusal Boyut (Asimetrik Tolerans)",
            "count": 1,
            "nominal": nom,
            "nominal_str": f"{nom} {u_tol}/{l_tol}",
            "upper_tol": u_tol,
            "lower_tol": l_tol,
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Hassas işlenmiş basamak / referans kademesi.",
        }

    # 5. Yalın Sayısal Boyut
    num_match = re.search(r"([0-9]+(?:\.[0-9]+)?)", cleaned)
    if num_match:
        nom = float(num_match.group(1))
        is_large = nom > 100.0
        return {
            "type": "LINEAR",
            "type_label": "Toplam Boy / Genişlik" if is_large else "Doğrusal Boyut",
            "count": 1,
            "nominal": nom,
            "nominal_str": str(nom),
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
            "unit": "mm",
            "op": "OP10",
            "op_reason": "Ana sınır kutusu veya kademe boyutu.",
        }

    return {
        "type": "CUSTOM",
        "type_label": "Özel Ölçü / Not",
        "count": 1,
        "nominal": 0.0,
        "nominal_str": cleaned,
        "upper_tol": "",
        "lower_tol": "",
        "unit": "mm",
        "op": "OP10",
        "op_reason": "Genel özellik.",
    }


def build_321_alignment(datums: List[str]) -> Dict[str, Any]:
    """
    2. Ölçüm Stratejisi ve Datum Sıralaması (3-2-1 Alignment):
    Datum A: Taban Yüzeyi (Düzlem -> 3 nokta / Primer)
    Datum B: Merkez Delik Ekseni / Yan Kenar (Silindir/Doğru -> 2 nokta / Sekonder)
    Datum C: Yan Kanal Yüzeyi / Stop (Düzlem/Nokta -> 1 nokta / Tersiyer)
    """
    alignment_scheme = {
        "strategy": "3-2-1 Alignment",
        "primary": None,
        "secondary": None,
        "tertiary": None,
        "dof_locked": 6,
    }

    if "A" in datums or len(datums) >= 1:
        alignment_scheme["primary"] = {
            "datum": "A",
            "geometry": "PLANE",
            "points": 3,
            "role": "Taban Yüzeyi (Primer) — Z Yönelimi ve Z Ötelemesi Kilitler (3 DOF)",
        }
    if "B" in datums or len(datums) >= 2:
        alignment_scheme["secondary"] = {
            "datum": "B",
            "geometry": "CYLINDER",
            "points": 2,
            "role": "Merkez Delik / Kenar Ekseni (Sekonder) — X/Y Yönelim ve 1 Öteleme Kilitler (2 DOF)",
        }
    if "C" in datums or len(datums) >= 3:
        alignment_scheme["tertiary"] = {
            "datum": "C",
            "geometry": "PLANE",
            "points": 1,
            "role": "Yan Dayama / Kanal Yüzeyi (Tersiyer) — Son Kalan Öteleme Kilitler (1 DOF)",
        }

    return alignment_scheme


def classify_operation_setup(feature: Dict[str, Any], normal_z: float = 1.0) -> Tuple[str, str]:
    """
    3. Operasyon Ayrımı (OP10 / OP20):
    - OP10: Parça tablaya düz bağlıyken dikey Z- probuyla ölçülebilen yüzey ve dikey delikler.
    - OP20: Parçayı çevirerek veya açılı kafayla (PH10 A/B açıları, yan delikler) ölçülmesi gereken unsurlar.
    """
    f_type = feature.get("type", "")

    # Yan veya açılı yüzey
    if abs(normal_z) < 0.3:
        return "OP20", "PH10 A90 / B açılı prob kafası veya parça çevirme gerektirir."

    if f_type in ("HOLE", "DIAMETER", "LINEAR", "RADIUS"):
        return "OP10", "Dikey Z- probu (A0B0) ile parça tablaya düz bağlıyken doğrudan taranabilir."

    return "OP10", "Standart üst kurulum (OP10)."


def try_local_llm_semantic_parse(text_snippet: str) -> Optional[Dict[str, Any]]:
    """
    Ollama yerel dil modeli (Qwen2.5-Coder-3B veya Llama-3.2-3B) aktif ise semantik düzeltme çağrısı yapar.
    Model kapalıysa veya yanıt gecikirse anında None döner ve deterministik motor devreye girer.
    """
    url = "http://localhost:11434/api/generate"
    prompt = (
        f"You are a CMM metrology parser. Parse this callout into JSON with keys: "
        f"type, count, nominal, upper_tol, lower_tol. Text: '{text_snippet}'"
    )
    payload = json.dumps({
        "model": "qwen2.5-coder:3b",
        "prompt": prompt,
        "stream": False,
        "format": "json",
    }).encode("utf-8")

    try:
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=0.15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return json.loads(data.get("response", "{}"))
    except Exception:
        return None
