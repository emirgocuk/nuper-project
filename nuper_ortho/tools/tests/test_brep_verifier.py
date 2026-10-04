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

from extractor.brep_verifier import parse_step_file, verify_dimensions_against_step


def test_brep_parser_and_verification():
    step_path = os.path.join(root_dir, "test_assets", "Askı Kulbu", "164849_aski_kancasi.stp")
    if not os.path.exists(step_path):
        pytest.skip(f"Test dosyası bulunamadı: {step_path}")

    step_data = parse_step_file(step_path)
    assert step_data["success"] is True
    assert step_data["total_points"] > 50
    assert step_data["total_cylinders"] > 0
    assert step_data["bbox"]["size"][0] > 0

    # Test boyutları:
    # 1. 27.2 mm gerçek silindir (Modelde var -> CAD_VERIFIED olmalı)
    # 2. 7.0 mm delik (Modelde 4x var -> CAD_VERIFIED olmalı)
    # 3. 999.0 mm hayali ölçü (Model sınırından büyük -> elenmeli)
    # 4. "34CrNiMo 6" malzeme kodu -> elenmeli
    test_dims = [
        {"nominal": 27.2, "nominal_str": "Ø27.2", "type": "DIAMETER"},
        {"nominal": 7.0, "nominal_str": "4x Ø7.0", "type": "HOLE"},
        {"nominal": 999.0, "nominal_str": "999.0", "type": "LINEAR"},
        {"nominal": 34.0, "nominal_str": "34CrNiMo 6", "type": "CUSTOM"},
    ]

    verified, pruned = verify_dimensions_against_step(test_dims, step_data)

    verified_noms = [d["nominal"] for d in verified]
    assert 27.2 in verified_noms
    assert 7.0 in verified_noms

    # 27.2 ve 7.0 CAD_VERIFIED olmalı
    v_map = {d["nominal"]: d for d in verified}
    assert v_map[27.2]["verification"] == "CAD_VERIFIED"
    assert v_map[7.0]["verification"] == "CAD_VERIFIED"

    # 999.0 ve 34CrNiMo 6 elenmiş (pruned) olmalı
    pruned_reasons = [p["reason"] for p in pruned]
    assert any("3D B-Rep Geometrisi Yok" in r for r in pruned_reasons)
    assert any("STEP sınır kutusundan" in r for r in pruned_reasons)
