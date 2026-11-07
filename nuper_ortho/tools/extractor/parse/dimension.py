from typing import List, Dict, Any, Optional
import re
from .tolerance import resolve_iso_fit, parse_symmetric_tolerance, parse_bilateral_tolerance


def parse_diameter_callouts(text: str) -> List[Dict[str, Any]]:
    results = []
    pattern = re.compile(
        r"(?:(\d+)[ \t]*x[ \t]*)?(?:[Ø\u00d8@⌀]|DIA|CAP|(?:(?<=\b)|(?<=^))[QD](?=[0-9]))[ \t]*([0-9]+(?:\.[0-9]+)?)[ \t]*(?:(H[678]|g6|f7|js7)|(MIN|MAKS|MAX)|(?:\([ \t]*([+-]?[0-9\.]+)[ \t]*(?:/|[ \t]+)[ \t]*([+-]?[0-9\.]+)[ \t]*\))|(?:([±\+])[ \t]*([0-9\.]+)))?",
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
        sym_sign = m.group(7) or ""
        sym_val = m.group(8) or ""

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


def parse_linear_callouts(text: str) -> List[Dict[str, Any]]:
    results = []
    seen = set()

    pattern = re.compile(
        r"(?<![A-Za-z0-9_\-\.])([0-9]{1,4}(?:\.[0-9]+)?)[ \t]*(?:([±\+]\s*[0-9]+(?:\.[0-9]+)?(?:\s*[\/\-]\s*[-+]?[0-9]+(?:\.[0-9]+)?)?)|(\(\s*[-+]?[0-9\.]+\s*[\/\s]+\s*[-+]?[0-9\.]+\s*\)))"
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

        nom_str = f"{val} {tol_str}".strip()
        seen.add(nom_str)
        seen.add(str(val))
        if val.is_integer():
            seen.add(str(int(val)))
        results.append({
            "type": "LINEAR",
            "quantity": 1,
            "nominal": val,
            "nominal_str": nom_str,
            "upper_tol": upper,
            "lower_tol": lower,
        })

    # Referans ölçüler: (291.9), (125.1)
    ref_pattern = re.compile(r"\(\s*([0-9]{1,4}(?:\.[0-9]+)?)\s*\)")
    for m in ref_pattern.finditer(text):
        val = float(m.group(1))
        nom_str = f"({val})"
        if nom_str not in seen and 2.0 <= val <= 3000.0:
            seen.add(nom_str)
            seen.add(str(val))
            if val.is_integer():
                seen.add(str(int(val)))
            results.append({
                "type": "LINEAR",
                "quantity": 1,
                "nominal": val,
                "nominal_str": nom_str,
                "upper_tol": "",
                "lower_tol": "",
            })

    # Pah ölçüleri: 3 x45°, 1 x45*
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
            })

    # Açısal ölçüler: 66.1°
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
                })

    # Standalone doğrusal ölçüler (ISO 2768 genel toleranslı tekil ölçüler: 146, 85, 14, 18)
    standalone_pattern = re.compile(r"(?<![A-Za-z0-9_\-\.\/])([0-9]{1,4}(?:\.[0-9]+)?)(?![A-Za-z0-9_\-\.\/°\*])")
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
            })

    return results
