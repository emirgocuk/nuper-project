import pytest
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
tools_dir = os.path.dirname(current_dir)
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)

from extractor.parse.tolerance import resolve_iso_fit, parse_symmetric_tolerance, parse_bilateral_tolerance
from extractor.parse.thread import parse_thread_callout
from extractor.parse.dimension import parse_diameter_callouts, parse_radius_callouts, parse_linear_callouts
from extractor.title_block import extract_title_block_fields, extract_datum_labels


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
