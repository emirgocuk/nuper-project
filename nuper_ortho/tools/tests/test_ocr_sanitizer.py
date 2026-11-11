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

from extractor.vision_ai_extractor import sanitize_engineering_ocr_tokens


def test_sanitize_diameter_and_tolerance_tokens():
    assert sanitize_engineering_ocr_tokens("O25.4") == "Ø25.4"
    assert sanitize_engineering_ocr_tokens("0/12 H7") == "Ø12 H7"
    assert sanitize_engineering_ocr_tokens("3l.5 +- 0.1") == "31.5 ± 0.1"


def test_sanitize_digits_inside_numbers():
    assert sanitize_engineering_ocr_tokens("2S.4") == "25.4"
    assert sanitize_engineering_ocr_tokens("3B.0") == "38.0"
    assert sanitize_engineering_ocr_tokens("1Z.5") == "12.5"
    assert sanitize_engineering_ocr_tokens("1I.2") == "11.2"


def test_sanitize_thread_callout():
    assert sanitize_engineering_ocr_tokens("4x M8xl.Z") == "4x M8x1.2"
