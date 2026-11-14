import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple


class ContractViolation(Exception):
    pass


def load_json_schema(schema_path: str | Path) -> Dict[str, Any]:
    with open(schema_path, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_schema_property_keys(schema: Dict[str, Any]) -> Set[str]:
    props = set()
    if "properties" in schema and isinstance(schema["properties"], dict):
        props.update(schema["properties"].keys())
    return props


def detect_unauthorized_keys(data: Dict[str, Any], allowed_keys: Set[str]) -> List[str]:
    violations = []
    for key in data.keys():
        if key not in allowed_keys:
            violations.append(key)
    return violations


def audit_silent_assumptions(
    dimensions: List[Dict[str, Any]],
    general_tolerance_standard: Optional[str] = None,
) -> List[Dict[str, Any]]:
    unresolved = []

    for dim in dimensions:
        balloon = dim.get("balloon", "UNKNOWN")
        utol_str = str(dim.get("upper_tol", "")).strip()
        ltol_str = str(dim.get("lower_tol", "")).strip()
        tol_source = dim.get("tolerance_source")

        is_default_pm01 = (utol_str == "0.1" or utol_str == "+0.1") and (
            ltol_str == "-0.1" or ltol_str == "0.1"
        )
        is_zero_or_empty = (not utol_str or utol_str == "0" or utol_str == "0.0") and (
            not ltol_str or ltol_str == "0" or ltol_str == "0.0"
        )

        has_legit_source = tol_source in (
            "DRAWING_EXPLICIT",
            "ISO_2768_MK",
            "ISO_2768_FH",
            "ISO_2768_M",
            "ISO_2768_F",
            "ASME_Y14_5",
            "TITLE_BLOCK_DEFAULT",
        )

        if not has_legit_source:
            if not general_tolerance_standard and (is_default_pm01 or is_zero_or_empty):
                flagged = dict(dim)
                flagged["unresolved_assumption"] = True
                flagged["assumption_reason"] = (
                    "Toleransı çizimde yazmıyor ve antette genel tolerans standardı tanımlı değil"
                )
                unresolved.append(flagged)

    return unresolved


def validate_contract(
    payload: Dict[str, Any],
    schema_path: str | Path,
) -> Tuple[bool, List[str]]:
    schema = load_json_schema(schema_path)
    allowed_root_keys = extract_schema_property_keys(schema)

    errors = []
    unauth = detect_unauthorized_keys(payload, allowed_root_keys)
    if unauth:
        errors.append(f"Şemada tanımlı olmayan kök anahtarlar tespit edildi: {unauth}")

    required = schema.get("required", [])
    for req in required:
        if req not in payload:
            errors.append(f"Zorunlu alan eksik: '{req}'")

    if "dimensions" in payload and isinstance(payload["dimensions"], list):
        dim_schema = schema.get("properties", {}).get("dimensions", {}).get("items", {})
        if dim_schema:
            allowed_dim_keys = extract_schema_property_keys(dim_schema)
            for i, dim in enumerate(payload["dimensions"]):
                if isinstance(dim, dict):
                    dim_unauth = detect_unauthorized_keys(dim, allowed_dim_keys)
                    if dim_unauth:
                        errors.append(
                            f"Boyut index={i} ({dim.get('balloon')}) izinsiz anahtar içeriyor: {dim_unauth}"
                        )

    return len(errors) == 0, errors


def classify_dimension_risk(dim: Dict[str, Any]) -> Tuple[str, List[str]]:
    reasons = []
    upper_str = str(dim.get("upper_tol", "")).strip()
    lower_str = str(dim.get("lower_tol", "")).strip()
    nom_str = str(dim.get("nominal_str", "")).strip()
    gdt_str = str(dim.get("gdt", "")).strip()

    span = None
    try:
        u_val = float(upper_str)
        l_val = float(lower_str)
        span = abs(u_val - l_val)
    except (ValueError, TypeError):
        if "±" in nom_str or "+/-" in nom_str:
            import re
            m = re.search(r"[±\+]\s*([0-9\.]+)", nom_str)
            if m:
                span = float(m.group(1)) * 2.0

    is_mmc = "Ⓜ" in gdt_str or "(M)" in gdt_str or "|M|" in gdt_str or "MMC" in gdt_str
    is_tight_gdt = any(sym in gdt_str for sym in ("⌖", "⌒", "PROFILE", "POSITION", "CONCENTRICITY", "RUNOUT"))
    is_fit = any(fit in nom_str.upper() for fit in ("H7", "H6", "G6", "H8", "P7", "N7", "JS7", "M6"))

    if span is not None and span <= 0.025:
        reasons.append(f"Tolerans aralığı kritik derecede dar: {span:.4f} mm <= 0.025 mm")
        return "CRITICAL", reasons

    if is_mmc:
        reasons.append("Malzeme Durumu Değiştiricisi (MMC) içeriyor")
        return "CRITICAL", reasons

    if is_tight_gdt:
        reasons.append("Hassas Geometrik Boyutlandırma ve Toleranslandırma (GD&T)")
        return "CRITICAL", reasons

    if (span is not None and span <= 0.1001) or is_fit:
        if is_fit:
            reasons.append("ISO Geçme / Alıştırma Toleransı tanımlı")
        if span is not None and span <= 0.1001:
            reasons.append(f"Tolerans aralığı dar: {span:.4f} mm <= 0.1000 mm")
        return "WARNING", reasons

    return "NORMAL", reasons


def generate_contract_summary(dimensions: List[Dict[str, Any]]) -> Dict[str, Any]:
    critical_count = 0
    warning_count = 0
    min_tol = 999.0

    for d in dimensions:
        lvl = d.get("risk_level", "NORMAL")
        if lvl == "CRITICAL":
            critical_count += 1
        elif lvl == "WARNING":
            warning_count += 1

        try:
            u = float(d.get("upper_tol", 0.0))
            l = float(d.get("lower_tol", 0.0))
            diff = abs(u - l)
            if 0.0 < diff < min_tol:
                min_tol = diff
        except Exception:
            pass

    min_tol_val = round(min_tol, 4) if min_tol < 900.0 else 0.05
    requires_special = critical_count > 0 or min_tol_val <= 0.025

    return {
        "critical_count": critical_count,
        "warning_count": warning_count,
        "min_tolerance_mm": min_tol_val,
        "requires_special_probing": requires_special,
    }


def apply_contract_guard(
    drawing_data: Dict[str, Any],
    schema_path: Optional[str | Path] = None,
) -> Dict[str, Any]:
    dimensions = drawing_data.get("dimensions", [])
    for dim in dimensions:
        level, reasons = classify_dimension_risk(dim)
        dim["risk_level"] = level
        dim["risk_reasons"] = reasons

    summary = generate_contract_summary(dimensions)
    drawing_data["contract_summary"] = summary

    if schema_path and Path(schema_path).exists():
        valid, errors = validate_contract(drawing_data, schema_path)
        if not valid:
            drawing_data["contract_warnings"] = errors

    return drawing_data

