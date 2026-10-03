# -*- coding: utf-8 -*-
import json
import os
import pytest

from tools.inspection_planner import generate_inspection_plan
from tools.models.generated_inspection_plan import Priority, Type


@pytest.fixture
def aski_kancasi_data():
    mock_path = os.path.join(
        os.path.dirname(__file__), "..", "..", ".dev", "mocks", "aski_kancasi.json"
    )
    with open(mock_path, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def avionic_panel_data():
    mock_path = os.path.join(
        os.path.dirname(__file__), "..", "..", ".dev", "mocks", "avionic_panel.json"
    )
    with open(mock_path, "r", encoding="utf-8") as f:
        return json.load(f)


def test_321_datum_hierarchy_order(aski_kancasi_data):
    plan = generate_inspection_plan(aski_kancasi_data)

    assert len(plan.items) >= 3
    # 1. Primary Datum A (3 DOF)
    assert plan.items[0].order == 1
    assert plan.items[0].item_id == "DATUM_A"
    assert plan.items[0].type == Type.DATUM_PRIMARY
    assert plan.items[0].priority == Priority.MANDATORY

    # 2. Secondary Datum B (2 DOF)
    assert plan.items[1].order == 2
    assert plan.items[1].item_id == "DATUM_B"
    assert plan.items[1].type == Type.DATUM_SECONDARY
    assert plan.items[1].priority == Priority.MANDATORY

    # 3. Tertiary Datum C (1 DOF)
    assert plan.items[2].order == 3
    assert plan.items[2].item_id == "DATUM_C"
    assert plan.items[2].type == Type.DATUM_TERTIARY
    assert plan.items[2].priority == Priority.MANDATORY


def test_geometric_tolerance_precedence_and_datums(aski_kancasi_data):
    plan = generate_inspection_plan(aski_kancasi_data)

    # Datumlar ölçüldükten sonra türetilmiş geometrik toleranslar gelir
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
    # 3 Datum + 1 Konsolide R2.5 + 1 Geometrik toleranslı delik = 5 öğe (tekrarlayan kopya elendi)
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

    # Tüm öğelerin order sırası artan şekilde olmalıdır
    orders = [it.order for it in plan.items]
    assert orders == sorted(orders)
    assert orders[0] == 1


def test_print_inspection_plan_summary(aski_kancasi_data):
    plan = generate_inspection_plan(aski_kancasi_data)

    print("\n" + "=" * 70)
    print(f"CMM METROLOJİ ÖLÇÜM PLANI: {plan.part_number} (Audit: {plan.audit_hash[:16]}...)")
    print("=" * 70)
    for it in plan.items:
        datums_str = ",".join(it.datum_reference or [])
        print(
            f"[{it.order:02d}] {it.type.value:<16} | ID: {it.item_id:<10} | "
            f"Nominal: {it.nominal_str:<12} | Datums: [{datums_str:<5}] | Priority: {it.priority.value}"
        )
    print("=" * 70)
