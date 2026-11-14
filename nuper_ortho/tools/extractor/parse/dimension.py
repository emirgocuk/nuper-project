from typing import List, Dict, Any, Optional, Tuple
import re
from .tolerance import (
    resolve_iso_fit,
    parse_symmetric_tolerance,
    parse_bilateral_tolerance,
    apply_iso2768_tolerance,
)


def normalize_decimal_commas(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"(\d),(\d)", r"\1.\2", text)


def is_reference_dimension(raw_text: str) -> bool:
    if not raw_text:
        return False
    norm = normalize_decimal_commas(str(raw_text)).strip()
    if re.match(r"^\(\s*[0-9]+(?:\.[0-9]+)?\s*\)$", norm):
        return True
    if re.search(r"\bREF\.?\b", norm, re.IGNORECASE):
        return True
    return False


def parse_tolerance(
    tol_str: str,
    nominal: Optional[float] = None,
    general_tol_class: Optional[str] = None,
) -> Tuple[str, str]:
    norm_tol = normalize_decimal_commas(tol_str or "").strip()
    upper = ""
    lower = ""
    if "±" in norm_tol:
        res = parse_symmetric_tolerance(norm_tol)
        if res:
            upper, lower = res
    elif "+" in norm_tol or "/" in norm_tol:
        parts = re.findall(r"([+-]?[0-9\.]+)", norm_tol)
        if len(parts) >= 2:
            upper, lower = parse_bilateral_tolerance(parts[0], parts[1])
        elif len(parts) == 1:
            upper = f"+{parts[0].lstrip('+')}"
            lower = "0.000"
    elif "(" in norm_tol:
        parts = re.findall(r"([+-]?[0-9\.]+)", norm_tol)
        if len(parts) >= 2:
            upper, lower = parse_bilateral_tolerance(parts[0], parts[1])
    elif general_tol_class and nominal is not None and nominal > 0.0:
        u, l, _ = apply_iso2768_tolerance(nominal, general_tol_class)
        upper, lower = u, l
    return upper, lower


def parse_diameter_callouts(text: str) -> List[Dict[str, Any]]:
    text = normalize_decimal_commas(text)
    results = []
    pattern = re.compile(
        r"(?:(\d+)[ \t]*x[ \t]*)?(?:[Ø\u00d8@⌀]|DIA|CAP|(?:(?<=\b)|(?<=^))[QD](?=[0-9]))[ \t]*([0-9]+(?:\.[0-9]+)?)[ \t]*(?:(H[678]|g6|f7|js7)|(MIN|MAKS|MAX)|(?:\([ \t]*([+-]?[0-9\.]+)[ \t]*(?:/|[ \t]+)[ \t]*([+-]?[0-9\.]+)[ \t]*\))|(?:([+-][0-9\.]+)[ \t]*/[ \t]*([+-]?[0-9\.]+))|(?:([±\+])[ \t]*([0-9\.]+)))?",
        re.IGNORECASE,
    )
    for m in pattern.finditer(text):
        count_str = m.group(1) or ""
        quantity = int(count_str) if count_str else 1
        nominal = float(m.group(2))
        if nominal < 0.2 or nominal > 3000.0:
            continue

        fit = m.group(3) or ""
        limit = m.group(4) or ""
        upper_paren = m.group(5) or ""
        lower_paren = m.group(6) or ""
        upper_slash = m.group(7) or ""
        lower_slash = m.group(8) or ""
        sym_sign = m.group(9) or ""
        sym_val = m.group(10) or ""

        nom_str = f"{count_str}x Ø{nominal}" if count_str else f"Ø{nominal}"
        if fit:
            nom_str += f" {fit.upper()}"
        if limit:
            nom_str += f" {limit.upper()}"

        upper = ""
        lower = ""
        if fit or limit:
            upper, lower = resolve_iso_fit(fit or limit, nominal)
        elif upper_paren and lower_paren:
            upper, lower = parse_bilateral_tolerance(upper_paren, lower_paren)
        elif upper_slash and lower_slash:
            upper, lower = parse_bilateral_tolerance(upper_slash, lower_slash)
        elif sym_val:
            res = None
            if sym_sign == "+":
                upper = f"+{sym_val}"
                lower = "0"
            else:
                res = parse_symmetric_tolerance(f"±{sym_val}")
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
    text = normalize_decimal_commas(text)
    results = []
    pattern = re.compile(r"(?<![A-Za-z0-9_\-\.])(?:(\d+)[ \t]*x[ \t]*)?R[ \t]*([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE)
    for m in pattern.finditer(text):
        count_str = m.group(1) or ""
        quantity = int(count_str) if count_str else 1
        r_val = float(m.group(2))
        if r_val < 0.3 or r_val > 500.0:
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


def parse_linear_callouts(text: str, include_reference: bool = True) -> List[Dict[str, Any]]:
    text = normalize_decimal_commas(text)
    results = []
    seen = set()

    pattern = re.compile(
        r"(?:(\d+)[ \t]*x[ \t]+)?(?<![A-Za-z0-9_\-\.])([0-9]{1,4}(?:\.[0-9]+)?)(?!\s*[°\*\^]|\s*x\s*45)[ \t]*(?:([±\+]\s*[0-9]+(?:\.[0-9]+)?(?:\s*[\/\-]\s*[-+]?[0-9]+(?:\.[0-9]+)?)?)|(\(\s*[-+]?[0-9\.]+\s*[\/\s]+\s*[-+]?[0-9\.]+\s*\)))"
    )
    for m in pattern.finditer(text):
        count_str = m.group(1) or ""
        quantity = int(count_str) if count_str else 1
        val = float(m.group(2))
        tol_str = m.group(3) or m.group(4) or ""
        if val < 0.1 or val > 2500.0:
            continue

        upper, lower = parse_tolerance(tol_str, nominal=val)
        prefix = f"{count_str}x " if count_str else ""
        nom_str = f"{prefix}{val} {tol_str}".strip()
        seen.add(nom_str)
        seen.add(str(val))
        if val.is_integer():
            seen.add(str(int(val)))
        results.append({
            "type": "LINEAR",
            "quantity": quantity,
            "nominal": val,
            "nominal_str": nom_str,
            "upper_tol": upper,
            "lower_tol": lower,
            "is_reference_dimension": False,
        })

    ref_pattern = re.compile(r"\(\s*([0-9]{1,4}(?:\.[0-9]+)?)\s*\)")
    for m in ref_pattern.finditer(text):
        val = float(m.group(1))
        nom_str = f"({val})"
        if 0.2 <= val <= 3000.0:
            seen.add(nom_str)
            seen.add(str(val))
            if val.is_integer():
                seen.add(str(int(val)))
            if include_reference:
                results.append({
                    "type": "LINEAR",
                    "quantity": 1,
                    "nominal": val,
                    "nominal_str": nom_str,
                    "upper_tol": "",
                    "lower_tol": "",
                    "is_reference_dimension": True,
                })

    chamfer_pattern = re.compile(r"(?:(\d+)\s*x\s*)?([0-9]+(?:\.[0-9]+)?)\s*x\s*45[°\*\^]?", re.IGNORECASE)
    for m in chamfer_pattern.finditer(text):
        cnt = m.group(1) or ""
        val = float(m.group(2))
        nom_str = f"{cnt}x {val} x45°" if cnt else f"{val} x45°"
        if nom_str not in seen:
            seen.add(nom_str)
            seen.add(str(val))
            if val.is_integer():
                seen.add(str(int(val)))
            results.append({
                "type": "CHAMFER",
                "quantity": int(cnt) if cnt else 1,
                "nominal": val,
                "nominal_str": nom_str,
                "upper_tol": "",
                "lower_tol": "",
                "is_reference_dimension": False,
            })

    ang_pattern = re.compile(r"([0-9]+(?:\.[0-9]+)?)\s*[°\^]")
    for m in ang_pattern.finditer(text):
        val = float(m.group(1))
        if 1.0 <= val <= 360.0 and val != 45.0:
            nom_str = f"{val}°"
            if nom_str not in seen:
                seen.add(nom_str)
                seen.add(str(val))
                if val.is_integer():
                    seen.add(str(int(val)))
                results.append({
                    "type": "ANGULAR",
                    "quantity": 1,
                    "nominal": val,
                    "nominal_str": nom_str,
                    "upper_tol": "+0.5°",
                    "lower_tol": "-0.5°",
                    "is_reference_dimension": False,
                })

    standalone_pattern = re.compile(
        r"(?<![A-Za-z0-9_\-\.\/\(])([0-9]{1,4}(?:\.[0-9]+)?)(?![A-Za-z0-9_\-\.\/°\*\)]|\s*[°\^])"
    )
    excluded_numbers = {1, 2, 3, 45, 163, 2024, 2025, 2026, 603181}
    for m in standalone_pattern.finditer(text):
        val = float(m.group(1))
        str_val = str(val) if not val.is_integer() else str(int(val))
        if str_val not in seen and 4.0 <= val <= 2500.0 and int(val) not in excluded_numbers:
            seen.add(str_val)
            results.append({
                "type": "LINEAR",
                "quantity": 1,
                "nominal": val,
                "nominal_str": str_val,
                "upper_tol": "+0.200",
                "lower_tol": "-0.200",
                "is_reference_dimension": False,
            })

    return results
