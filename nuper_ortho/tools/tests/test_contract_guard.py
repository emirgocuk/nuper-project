from pathlib import Path
from tools.extractor.contract_guard import (
    audit_silent_assumptions,
    detect_unauthorized_keys,
    validate_contract,
)

SCHEMA_PATH = Path("schemas/drawing_data.schema.json")


def test_detect_unauthorized_keys():
    allowed = {"id", "name", "value"}
    data = {"id": 1, "name": "test", "extra_bad_field": 123}
    unauth = detect_unauthorized_keys(data, allowed)
    assert unauth == ["extra_bad_field"]


def test_audit_silent_assumptions_flags_silent_default():
    dims = [
        {
            "balloon": "B1",
            "nominal": 50.0,
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
            "tolerance_source": None,
        },
        {
            "balloon": "B2",
            "nominal": 20.0,
            "upper_tol": "+0.021",
            "lower_tol": "0.0",
            "tolerance_source": "DRAWING_EXPLICIT",
        },
    ]

    flagged = audit_silent_assumptions(dims, general_tolerance_standard=None)
    assert len(flagged) == 1
    assert flagged[0]["balloon"] == "B1"
    assert flagged[0]["unresolved_assumption"] is True


def test_audit_silent_assumptions_passes_with_iso2768_standard():
    dims = [
        {
            "balloon": "B1",
            "nominal": 50.0,
            "upper_tol": "+0.3",
            "lower_tol": "-0.3",
            "tolerance_source": "ISO_2768_MK",
        }
    ]
    flagged = audit_silent_assumptions(dims, general_tolerance_standard="ISO 2768-mK")
    assert len(flagged) == 0


def test_validate_contract_rejects_unauthorized_fields():
    payload = {
        "success": True,
        "filename": "part.pdf",
        "title_block": {
            "part_number": "P1",
            "material": "AL",
            "hardness": "N/A",
            "roughness": "N/A",
            "general_tolerance": "ISO 2768-m",
            "drawing_number": "D1",
        },
        "datums": ["A", "B", "C"],
        "dimensions": [
            {
                "id": 1,
                "balloon": "B1",
                "type": "LINEAR",
                "type_label": "Linear",
                "nominal": 50.0,
                "nominal_str": "50",
                "upper_tol": "0.1",
                "lower_tol": "-0.1",
                "measured": "50.02",
                "deviation": "0.02",
                "status": "PASS",
                "random_injected_key": "COLLATERAL_DAMAGE",
            }
        ],
    }

    is_valid, errors = validate_contract(payload, SCHEMA_PATH)
    assert not is_valid
    assert any("random_injected_key" in e for e in errors)
