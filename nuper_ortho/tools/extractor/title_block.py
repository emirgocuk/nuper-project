from typing import Dict, Any, List
import re


def extract_title_block_fields(text: str, filename: str) -> Dict[str, Any]:
    title_block = {
        "part_number": "",
        "drawing_number": "",
        "material": "",
        "hardness": "",
        "roughness": "",
        "general_tolerance": "",
    }

    clean_name = re.sub(r"[\.\-\s]+pdf$", "", filename, flags=re.I)
    title_block["drawing_number"] = clean_name
    title_block["part_number"] = clean_name

    doc_match = re.search(r"(?:DOKUMAN|DRAWING|RES[Iİ]M)\s*NO[^\w]*([A-Z0-9\-_/]{4,35})", text, re.IGNORECASE)
    if doc_match:
        title_block["drawing_number"] = doc_match.group(1).strip()
        title_block["part_number"] = doc_match.group(1).strip()

    num_code_match = re.search(r"\b(60\d{4}-\d{5}-\d{2}|101\d{5}(?:-[0-9A-Z]+)?)\b", text)
    if num_code_match:
        title_block["drawing_number"] = num_code_match.group(1).strip()
        title_block["part_number"] = num_code_match.group(1).strip()

    mat_match = re.search(r"MALZEME[^\w]*([^\n\r]+)", text, re.IGNORECASE)
    if mat_match:
        title_block["material"] = mat_match.group(1).strip()[:100]
    else:
        for m in [
            "Alüminyum 7075-T6", "7075 T6/T651", "7075-T6", "SAE 4340", "SAE 1030/1040/1045",
            "34CrNiMo6", "6082-T6", "AISI 316", "Ti-6Al-4V", "17-4PH"
        ]:
            if m.lower() in text.lower():
                title_block["material"] = m
                break

    hard_match = re.search(r"(\d+[-–]\d+\s*HRC|\d+\s*HRC|\d+\s*HB(?:\s*\(T6\))?)", text, re.IGNORECASE)
    if hard_match:
        title_block["hardness"] = hard_match.group(1).strip()

    rough_match = re.search(r"\b(Ra\s*[\d\.]+\s*(?:µm|um)?)\b", text, re.IGNORECASE)
    if rough_match:
        title_block["roughness"] = rough_match.group(1).strip()

    tol_match = re.search(r"\b(ISO\s*2768(?:-[a-zA-Z]+)?|ASME\s*B1\.13M)\b", text, re.IGNORECASE)
    if tol_match:
        title_block["general_tolerance"] = tol_match.group(1).strip()

    return title_block


def extract_datum_labels(text: str) -> List[str]:
    datum_matches = re.findall(r"DATUM\s*([A-Z])|\[([A-Z])\]|\|\s*([A-Z])\s*\|", text)
    found_datums = set()
    for d in datum_matches:
        v = d[0] or d[1] or d[2]
        if v and v in "ABCDEF":
            found_datums.add(v)
    return sorted(list(found_datums))
