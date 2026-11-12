import json
import os
import pytest

from tools.inspection_planner import generate_inspection_plan
from tools.models.generated_inspection_plan import Priority, Type


@pytest.fixture
def aski_kancasi_data():
    return {
        "success": True,
        "filename": "164849_aski_kancasi.pdf",
        "page_count": 1,
        "title_block": {
            "part_number": "050-164849-000",
            "drawing_number": "050-164849-000",
            "material": "SAE 4340 Çelik",
            "hardness": "38-44 HRC",
            "roughness": "Ra 1.6 µm",
            "general_tolerance": "ISO 2768-mK",
        },
        "datums": ["A", "B", "C"],
        "dimensions": [
            {
                "id": 1,
                "balloon": "#1",
                "type": "DIAMETER",
                "type_label": "Silindirik Çap (Bore/Shaft)",
                "icon": "⭕",
                "nominal": 20.0,
                "nominal_str": "Ø20.000 H7 (+0.021/0)",
                "upper_tol": "+0.021",
                "lower_tol": "0.000",
                "measured": "20.004 mm",
                "deviation": "+0.004 mm",
                "status": "PASS",
                "feature_key": "cyl_20",
                "gdt": "⌖ Ø 0.020 Ⓜ | A | B | C",
                "bbox": [120, 340, 220, 390],
            },
            {
                "id": 2,
                "balloon": "#2",
                "type": "LINEAR",
                "type_label": "Doğrusal Boyut",
                "icon": "📏",
                "nominal": 51.6,
                "nominal_str": "51.60 ±0.20 mm",
                "upper_tol": "+0.200",
                "lower_tol": "-0.200",
                "measured": "51.615 mm",
                "deviation": "+0.015 mm",
                "status": "PASS",
                "feature_key": "dim_51_6",
                "gdt": "∥ 0.015 | A",
                "bbox": [300, 200, 410, 250],
            },
            {
                "id": 3,
                "balloon": "#3",
                "type": "RADIUS",
                "type_label": "Kavis / Yarıçap (Fillet/Round)",
                "icon": "📐",
                "nominal": 5.0,
                "nominal_str": "R5.00 ±0.10 mm",
                "upper_tol": "+0.100",
                "lower_tol": "-0.100",
                "measured": "5.008 mm",
                "deviation": "+0.008 mm",
                "status": "PASS",
                "feature_key": "rad_5",
                "bbox": [210, 110, 270, 150],
            },
        ],
    }


@pytest.fixture
def avionic_panel_data():
    return {
        "success": True,
        "filename": "DACP_Avionic_Panel.pdf",
        "page_count": 2,
        "title_block": {
            "part_number": "DACP-AV-002",
            "drawing_number": "DACP-AV-002-REV-B",
            "material": "Al 6061-T6 Alüminyum",
            "hardness": "95 HB",
            "roughness": "Ra 0.8 µm",
            "general_tolerance": "ISO 2768-mK",
        },
        "datums": ["A", "B", "C"],
        "dimensions": [
            {
                "id": 1,
                "balloon": "#1",
                "type": "DIAMETER",
                "type_label": "Montaj Deliği (Pin Hole)",
                "icon": "⭕",
                "nominal": 6.0,
                "nominal_str": "Ø6.000 H7 (+0.012/0)",
                "upper_tol": "+0.012",
                "lower_tol": "0.000",
                "measured": "6.003 mm",
                "deviation": "+0.003 mm",
                "status": "PASS",
                "feature_key": "bore_pin_6",
                "gdt": "⌖ Ø 0.015 | A | B | C",
                "bbox": [150, 220, 210, 270],
            },
            {
                "id": 2,
                "balloon": "#2",
                "type": "LINEAR",
                "type_label": "Panel Genişliği",
                "icon": "📏",
                "nominal": 120.0,
                "nominal_str": "120.00 ±0.10 mm",
                "upper_tol": "+0.100",
                "lower_tol": "-0.100",
                "measured": "120.045 mm",
                "deviation": "+0.045 mm",
                "status": "PASS",
                "feature_key": "panel_width_120",
                "gdt": "⏢ 0.020",
                "bbox": [50, 450, 550, 500],
            },
        ],
    }


def test_321_datum_hierarchy_order(aski_kancasi_data):
    plan = generate_inspection_plan(aski_kancasi_data)

    assert len(plan.items) >= 3
    assert plan.items[0].order == 1
    assert plan.items[0].item_id == "DATUM_A"
    assert plan.items[0].type == Type.DATUM_PRIMARY
    assert plan.items[0].priority == Priority.MANDATORY

    assert plan.items[1].order == 2
    assert plan.items[1].item_id == "DATUM_B"
    assert plan.items[1].type == Type.DATUM_SECONDARY
    assert plan.items[1].priority == Priority.MANDATORY

    assert plan.items[2].order == 3
    assert plan.items[2].item_id == "DATUM_C"
    assert plan.items[2].type == Type.DATUM_TERTIARY
    assert plan.items[2].priority == Priority.MANDATORY


def test_geometric_tolerance_precedence_and_datums(aski_kancasi_data):
    plan = generate_inspection_plan(aski_kancasi_data)

    geometric_items = [it for it in plan.items if it.type == Type.GEOMETRIC_TOL]
    assert len(geometric_items) >= 1

    for it in geometric_items:
        assert it.order > 3
        assert it.priority == Priority.MANDATORY
        assert it.datum_reference is not None


def test_lean_inspection_filter_removes_redundant_patterns():
    data = {
        "filename": "test_plate.pdf",
        "title_block": {"part_number": "PLATE-001"},
        "datums": ["A", "B", "C"],
        "dimensions": [
            {
                "id": 1,
                "nominal_str": "4x R2.5",
                "nominal": 2.5,
                "upper_tol": "+0.1",
                "lower_tol": "-0.1",
                "feature_key": "corner_radius",
            },
            {
                "id": 2,
                "nominal_str": "4x R2.5",
                "nominal": 2.5,
                "upper_tol": "+0.1",
                "lower_tol": "-0.1",
                "feature_key": "corner_radius_dup",
            },
            {
                "id": 3,
                "nominal_str": "Ø20.0 H7",
                "nominal": 20.0,
                "upper_tol": "+0.021",
                "lower_tol": "0.0",
                "gdt": "⌖ Ø 0.020 | A | B | C",
                "feature_key": "precision_bore",
            },
        ],
    }

    plan = generate_inspection_plan(data)
    assert len(plan.items) == 5
    feature_keys = [it.feature_key for it in plan.items]
    assert "corner_radius" in feature_keys
    assert "corner_radius_dup" not in feature_keys


def test_avionic_panel_plan_schema_conformance(avionic_panel_data):
    plan = generate_inspection_plan(avionic_panel_data)

    assert plan.part_number == "DACP-AV-002"
    assert plan.audit_hash is not None
    assert len(plan.audit_hash) == 64
    assert len(plan.items) > 3

    orders = [it.order for it in plan.items]
    assert orders == sorted(orders)
    assert orders[0] == 1


def test_critical_risk_level_touch_parameters_and_root_summaries():
    data = {
        "filename": "critical_bracket.pdf",
        "title_block": {"part_number": "CRIT-001"},
        "datums": ["A", "B", "C"],
        "similar_parts": [{"part_id": "PREV-001", "similarity": 0.92}],
        "contract_summary": {"unresolved_count": 0, "status": "VERIFIED"},
        "thermal_compensation_summary": {"material": "Steel", "ref_temp_c": 20.0},
        "dimensions": [
            {
                "id": 1,
                "nominal": 25.0,
                "nominal_str": "Ø25.0 ±0.005",
                "upper_tol": "+0.005",
                "lower_tol": "-0.005",
                "risk_level": "CRITICAL",
                "risk_reasons": ["Tight tolerance <= 0.025mm"],
                "tolerance_source": "DRAWING_EXPLICIT",
                "match_confidence": 0.98,
                "feature_key": "cyl_25",
            },
            {
                "id": 2,
                "nominal": 50.0,
                "nominal_str": "50.0 ±0.05",
                "upper_tol": "+0.05",
                "lower_tol": "-0.05",
                "risk_level": "WARNING",
                "tolerance_source": "ISO_2768_mK",
                "feature_key": "dist_50",
            },
            {
                "id": 3,
                "nominal": 100.0,
                "nominal_str": "100.0 ±0.2",
                "upper_tol": "+0.2",
                "lower_tol": "-0.2",
                "risk_level": "NORMAL",
                "feature_key": "dist_100",
            },
        ],
    }
    plan = generate_inspection_plan(data)
    assert plan.similar_parts is not None
    assert len(plan.similar_parts) == 1
    assert plan.similar_parts[0]["part_id"] == "PREV-001"
    assert plan.contract_summary is not None
    assert plan.contract_summary["status"] == "VERIFIED"
    assert plan.thermal_compensation_summary is not None
    assert plan.thermal_compensation_summary["ref_temp_c"] == 20.0

    crit_item = next(it for it in plan.items if it.feature_key == "cyl_25")
    assert crit_item.risk_level.value == "CRITICAL"
    assert crit_item.recommended_touch_count == 8
    assert crit_item.recommended_touch_speed_mms == 2.0
    assert crit_item.tolerance_source == "DRAWING_EXPLICIT"
    assert crit_item.match_confidence == 0.98

    warn_item = next(it for it in plan.items if it.feature_key == "dist_50")
    assert warn_item.risk_level.value == "WARNING"
    assert warn_item.recommended_touch_count == 6
    assert warn_item.recommended_touch_speed_mms == 3.5

    norm_item = next(it for it in plan.items if it.feature_key == "dist_100")
    assert norm_item.risk_level.value == "NORMAL"
    assert norm_item.recommended_touch_count == 4
    assert norm_item.recommended_touch_speed_mms == 5.0
