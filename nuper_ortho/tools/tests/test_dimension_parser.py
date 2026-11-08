import pytest
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
tools_dir = os.path.dirname(current_dir)
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)

from extractor.parse.tolerance import resolve_iso_fit, parse_symmetric_tolerance, parse_bilateral_tolerance, apply_iso2768_tolerance
from extractor.parse.thread import parse_thread_callout, compute_thread_minor_diameter
from extractor.parse.dimension import parse_diameter_callouts, parse_radius_callouts, parse_linear_callouts
from extractor.title_block import extract_title_block_fields, extract_datum_labels
from extractor.spatial import find_spatial_tolerances_near


def test_iso_fit_resolution():
    upper, lower = resolve_iso_fit("H7", 20.0)
    assert upper == "+0.021"
    assert lower == "0.000"

    upper_8, lower_8 = resolve_iso_fit("H7", 8.0)
    assert upper_8 == "+0.015"
    assert lower_8 == "0.000"

    upper_12, lower_12 = resolve_iso_fit("H7", 12.0)
    assert upper_12 == "+0.018"
    assert lower_12 == "0.000"

    upper_min, lower_min = resolve_iso_fit("MIN", 15.45)
    assert upper_min == "+0.050"
    assert lower_min == "0.000"


def test_tolerance_parsers():
    sym = parse_symmetric_tolerance("±0.15")
    assert sym == ("+0.15", "-0.15")

    bil = parse_bilateral_tolerance("0.02", "-0.01")
    assert bil == ("+0.02", "-0.01")


def test_diameter_parsing():
    sample = "4x Ø20 H7 ve Ø15.45 MIN ve Ø50 ( +0.03 / -0.01 )"
    dias = parse_diameter_callouts(sample)
    assert len(dias) == 3

    assert dias[0]["quantity"] == 4
    assert dias[0]["nominal"] == 20.0
    assert dias[0]["fit"] == "H7"
    assert dias[0]["upper_tol"] == "+0.021"

    assert dias[1]["quantity"] == 1
    assert dias[1]["nominal"] == 15.45
    assert dias[1]["limit"] == "MIN"
    assert dias[1]["upper_tol"] == "+0.050"

    assert dias[2]["quantity"] == 1
    assert dias[2]["nominal"] == 50.0
    assert dias[2]["upper_tol"] == "+0.03"
    assert dias[2]["lower_tol"] == "-0.01"


def test_radius_and_linear_parsing():
    rad_sample = "2x R2.5 ve R10.0"
    radii = parse_radius_callouts(rad_sample)
    assert len(radii) == 2
    assert radii[0]["quantity"] == 2
    assert radii[0]["nominal"] == 2.5
    assert radii[1]["nominal"] == 10.0

    lin_sample = "51.6 ±0.2 ve 14.4 +0.1/-0.05 ve (291.9) ve 3 x45°"
    linears = parse_linear_callouts(lin_sample)
    assert any(l["nominal"] == 51.6 and l["upper_tol"] == "+0.2" for l in linears)
    assert any(l["nominal"] == 291.9 and l["nominal_str"] == "(291.9)" for l in linears)
    assert any(l["nominal"] == 3.0 and l["type"] == "CHAMFER" for l in linears)

    ocr_dia_sample = "@86 ±0.5 ve @117.5"
    ocr_dias = parse_diameter_callouts(ocr_dia_sample)
    assert len(ocr_dias) == 2
    assert ocr_dias[0]["nominal"] == 86.0
    assert ocr_dias[0]["upper_tol"] == "+0.5"
    assert ocr_dias[1]["nominal"] == 117.5

    fake_rad_sample = "SEKTOR 0.25 ve KORIDOR 0.5"
    assert len(parse_radius_callouts(fake_rad_sample)) == 0


def test_spatial_tolerances_association():
    items = [
        {"text": "Ø21", "bbox": [1015.0, 250.0, 1035.0, 265.0]},
        {"text": "+0.25", "bbox": [1040.0, 245.0, 1065.0, 255.0]},
        {"text": "0", "bbox": [1040.0, 256.0, 1055.0, 265.0]},
    ]
    u, l = find_spatial_tolerances_near([1015.0, 250.0, 1035.0, 265.0], items)
    assert u == "+0.25"
    assert l == "0"


def test_thread_parsing():
    th1 = parse_thread_callout("M8x1.25 - 6H")
    assert th1 is not None
    assert th1["thread_type"] == "METRIC"

    th2 = parse_thread_callout("3/4-16 UNF")
    assert th2 is not None
    assert th2["thread_type"] == "UNF"


def test_title_block_and_datums():
    text = "MALZEME: SAE 4340\nSERTLİK: 38-44 HRC\nDATUM [A] [B] [C]\nISO 2768-m"
    tb = extract_title_block_fields(text, "sample.pdf")
    assert tb["material"] == "SAE 4340"
    assert tb["hardness"] == "38-44 HRC"
    assert tb["general_tolerance"] == "ISO 2768-m"

    datums = extract_datum_labels(text)
    assert datums == ["A", "B", "C"]


def test_page1_feature_discrimination():
    from tools.drawing_extractor import is_feature_in_title_or_notes
    from tools.extractor.vector_extractor import get_title_block_mask

    page_w = 1190.55
    page_h = 841.89
    masks = get_title_block_mask(page_w, page_h)

    # 1. Real drawing view feature on Page 1 (center of sheet, valid geometry)
    view_box = [400.0, 300.0, 450.0, 320.0]
    items = [{"text": "50.0 ±0.1", "bbox": [400.0, 300.0, 450.0, 320.0]}]
    assert not is_feature_in_title_or_notes(view_box, items, masks, page_w, page_h)

    # 2. Title block text (bottom right)
    title_box = [800.0, 760.0, 850.0, 780.0]
    assert is_feature_in_title_or_notes(title_box, items, masks, page_w, page_h)

    # 3. Note bullet text
    note_box = [150.0, 150.0, 180.0, 165.0]
    note_items = [{"text": "BOYA NOTLARI: 1- MASKELENECEKTIR", "bbox": [150.0, 150.0, 350.0, 165.0]}]
    assert is_feature_in_title_or_notes(note_box, note_items, masks, page_w, page_h)


def test_iso2768_table_assignment():
    u1, l1, src1 = apply_iso2768_tolerance(2.5, "m")
    assert u1 == "+0.1"
    assert l1 == "-0.1"
    assert src1 == "ISO_2768_M"

    u2, l2, src2 = apply_iso2768_tolerance(25.0, "m")
    assert u2 == "+0.2"
    assert l2 == "-0.2"

    u3, l3, src3 = apply_iso2768_tolerance(150.0, "m")
    assert u3 == "+0.5"
    assert l3 == "-0.5"

    u_f, l_f, src_f = apply_iso2768_tolerance(25.0, "f")
    assert u_f == "+0.1"
    assert l_f == "-0.1"
    assert src_f == "ISO_2768_F"


def test_thread_minor_diameter_computation():
    d_m6 = compute_thread_minor_diameter(6.0, 1.0)
    assert abs(d_m6 - 4.9175) < 0.01

    d_m8 = compute_thread_minor_diameter(8.0, 1.25)
    assert abs(d_m8 - (8.0 - 1.082532 * 1.25)) < 0.01

    parsed = parse_thread_callout("4x M6x1-6H Delik")
    assert parsed is not None
    assert parsed["nominal_dia"] == 6.0
    assert parsed["pitch"] == 1.0
    assert abs(parsed["minor_dia"] - 4.9175) < 0.01
