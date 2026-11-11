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
