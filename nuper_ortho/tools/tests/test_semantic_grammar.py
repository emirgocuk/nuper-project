import os
import sys
import pytest

current_dir = os.path.dirname(os.path.abspath(__file__))
tools_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(tools_dir)
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from extractor.semantic_grammar import (
    normalize_engineering_callout,
    build_321_alignment,
    classify_operation_setup,
)


def test_engineering_grammar_normalization():
    # 1. Delik Grubu: 4x O2.5
    h1 = normalize_engineering_callout("4x O2.5")
    assert h1["type"] == "HOLE"
    assert h1["count"] == 4
    assert h1["nominal"] == 2.5
    assert h1["unit"] == "mm"

    # 2. Toleranslı Doğrusal Ölçü: 12 +- 0.5
    l1 = normalize_engineering_callout("12 +- 0.5")
    assert l1["type"] == "LINEAR"
    assert l1["nominal"] == 12.0
    assert l1["upper_tol"] == "+0.5"
    assert l1["lower_tol"] == "-0.5"

    # 3. Yarıçap: 2X R2.5
    r1 = normalize_engineering_callout("2X R2.5")
    assert r1["type"] == "RADIUS"
    assert r1["count"] == 2
    assert r1["nominal"] == 2.5

    # 4. Asimetrik Tolerans: 35 +0.0/-0.2
    a1 = normalize_engineering_callout("35 +0.0/-0.2")
    assert a1["type"] == "LINEAR"
    assert a1["nominal"] == 35.0
    assert a1["upper_tol"] == "+0.0"
    assert a1["lower_tol"] == "-0.2"


def test_321_alignment_strategy():
    datums = ["A", "B", "C"]
    alignment = build_321_alignment(datums)

    assert alignment["strategy"] == "3-2-1 Alignment"
    assert alignment["dof_locked"] == 6

    # Primer: Datum A (Düzlem, 3 nokta)
    assert alignment["primary"]["datum"] == "A"
    assert alignment["primary"]["geometry"] == "PLANE"
    assert alignment["primary"]["points"] == 3

    # Sekonder: Datum B (Silindir / Eksen, 2 nokta)
    assert alignment["secondary"]["datum"] == "B"
    assert alignment["secondary"]["geometry"] == "CYLINDER"
    assert alignment["secondary"]["points"] == 2

    # Tersiyer: Datum C (Düzlem / Stop, 1 nokta)
    assert alignment["tertiary"]["datum"] == "C"
    assert alignment["tertiary"]["points"] == 1


def test_op10_op20_classification():
    # Dikey delik (Z probu) -> OP10
    op10, reason10 = classify_operation_setup({"type": "HOLE", "nominal": 2.5}, normal_z=1.0)
    assert op10 == "OP10"

    # Yan delik / kafa rotasyonu -> OP20
    op20, reason20 = classify_operation_setup({"type": "HOLE", "nominal": 2.5}, normal_z=0.0)
    assert op20 == "OP20"
