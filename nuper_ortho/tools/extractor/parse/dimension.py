from typing import List, Dict, Any, Optional
import re
from .tolerance import resolve_iso_fit, parse_symmetric_tolerance, parse_bilateral_tolerance


def parse_diameter_callouts(text: str) -> List[Dict[str, Any]]:
    results = []
    pattern = re.compile(
        r"(?:(\d+)\s*x\s*)?(?:[Ø\u00d8]|DIA|CAP)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:(H[678]|g6|f7|js7)|(MIN|MAKS|MAX)|(?:\(\s*([+-]?[0-9\.]+)\s*(?:/|\s+)\s*([+-]?[0-9\.]+)\s*\))|(?:[±\+]\s*([0-9\.]+)))?",
        re.IGNORECASE,
    )
    for m in pattern.finditer(text):
        count_str = m.group(1) or ""
        quantity = int(count_str) if count_str else 1
        nominal = float(m.group(2))
        if nominal < 1.0 or nominal > 3000.0:
            continue

        fit = m.group(3) or ""
        limit = m.group(4) or ""
        upper_raw = m.group(5) or ""
        lower_raw = m.group(6) or ""
        sym_tol = m.group(7) or ""

        nom_str = f"{count_str}x Ø{nominal}" if count_str else f"Ø{nominal}"
        if fit:
            nom_str += f" {fit.upper()}"
        if limit:
            nom_str += f" {limit.upper()}"

        upper = ""
        lower = ""
        if fit or limit:
            upper, lower = resolve_iso_fit(fit or limit, nominal)
        elif upper_raw and lower_raw:
            upper, lower = parse_bilateral_tolerance(upper_raw, lower_raw)
        elif sym_tol:
            res = parse_symmetric_tolerance(f"±{sym_tol}")
            if res:
                upper, lower = res

        results.append({
            "type": "DIAMETER",
            "quantity": quantity,
            "nominal": nominal,
            "nominal_str": nom_str,
            "upper_tol": upper,
            "lower_tol": lower,
            "fit": fit.upper() if fit else None,
            "limit": limit.upper() if limit else None,
        })
    return results


def parse_radius_callouts(text: str) -> List[Dict[str, Any]]:
    results = []
    pattern = re.compile(r"(?:(\d+)\s*x\s*)?R\s*([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE)
    for m in pattern.finditer(text):
        count_str = m.group(1) or ""
        quantity = int(count_str) if count_str else 1
        r_val = float(m.group(2))
        if r_val < 0.2 or r_val > 500.0:
            continue

        nom_str = f"{count_str}x R{r_val}" if count_str else f"R{r_val}"
        results.append({
            "type": "RADIUS",
            "quantity": quantity,
            "nominal": r_val,
            "nominal_str": nom_str,
            "upper_tol": "",
            "lower_tol": "",
        })
    return results


def parse_linear_callouts(text: str) -> List[Dict[str, Any]]:
    results = []
    pattern = re.compile(
        r"([0-9]{1,4}(?:\.[0-9]+)?)\s*(?:([±\+]\s*[0-9]+(?:\.[0-9]+)?(?:\s*[\/\-]\s*[-+]?[0-9]+(?:\.[0-9]+)?)?)|(\(\s*[-+]?[0-9\.]+\s*[\/\s]+\s*[-+]?[0-9\.]+\s*\)))"
    )
    for m in pattern.finditer(text):
        val = float(m.group(1))
        tol_str = m.group(2) or m.group(3) or ""
        if val < 2.0 or val > 2500.0:
            continue

        upper = ""
        lower = ""
        if "±" in tol_str:
            res = parse_symmetric_tolerance(tol_str)
            if res:
                upper, lower = res
        elif "+" in tol_str:
            parts = re.findall(r"([+-]?[0-9\.]+)", tol_str)
            if len(parts) >= 2:
                upper, lower = parse_bilateral_tolerance(parts[0], parts[1])
            elif len(parts) == 1:
                upper = f"+{parts[0]}"
                lower = "0.000"
        elif "(" in tol_str:
            parts = re.findall(r"([+-]?[0-9\.]+)", tol_str)
            if len(parts) >= 2:
                upper, lower = parse_bilateral_tolerance(parts[0], parts[1])

        results.append({
            "type": "LINEAR",
            "quantity": 1,
            "nominal": val,
            "nominal_str": f"{val} {tol_str}".strip(),
            "upper_tol": upper,
            "lower_tol": lower,
        })
    return results
