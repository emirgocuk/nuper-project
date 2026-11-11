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

from extractor.semantic_grammar import parse_fcf_cells


def test_parse_fcf_cells_with_dividers():
    fcf_box = {
        "bbox": [100.0, 200.0, 250.0, 224.0],
        "width": 150.0,
        "height": 24.0,
    }
    dividers = [130.0, 190.0, 220.0]
    spans = [
        {"text": "⌖", "bbox": [105.0, 204.0, 125.0, 220.0]},
        {"text": "Ø0.1", "bbox": [135.0, 204.0, 165.0, 220.0]},
        {"text": "Ⓜ", "bbox": [170.0, 204.0, 182.0, 220.0]},
        {"text": "A", "bbox": [200.0, 204.0, 210.0, 220.0]},
        {"text": "B", "bbox": [230.0, 204.0, 240.0, 220.0]},
    ]

    res = parse_fcf_cells(fcf_box, spans, vertical_dividers=dividers)

    assert res["characteristic"] == "POSITION"
    assert res["symbol"] == "⌖"
    assert res["tolerance_value"] == 0.1
    assert res["is_diameter_zone"] is True
    assert res["material_condition"] == "MMC"
    assert res["primary_datum"] == "A"
    assert res["secondary_datum"] == "B"
    assert res["tertiary_datum"] is None
    assert len(res["cells"]) == 4


def test_parse_fcf_profile_with_three_datums():
    fcf_box = {
        "bbox": [50.0, 100.0, 220.0, 125.0],
        "width": 170.0,
        "height": 25.0,
    }
    dividers = [80.0, 130.0, 160.0, 190.0]
    spans = [
        {"text": "⌒", "bbox": [55.0, 104.0, 75.0, 121.0]},
        {"text": "0.5", "bbox": [88.0, 104.0, 115.0, 121.0]},
        {"text": "A", "bbox": [140.0, 104.0, 150.0, 121.0]},
        {"text": "B", "bbox": [170.0, 104.0, 180.0, 121.0]},
        {"text": "C", "bbox": [200.0, 104.0, 210.0, 121.0]},
    ]

    res = parse_fcf_cells(fcf_box, spans, vertical_dividers=dividers)

    assert res["characteristic"] == "PROFILE"
    assert res["symbol"] == "⌒"
    assert res["tolerance_value"] == 0.5
    assert res["is_diameter_zone"] is False
    assert res["primary_datum"] == "A"
    assert res["secondary_datum"] == "B"
    assert res["tertiary_datum"] == "C"
