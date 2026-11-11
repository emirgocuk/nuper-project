from tools.extractor.code_simplifier import audit_code_simplification


def test_detects_trivial_wrapper():
    code = """
def compute_distance(a, b):
    return math.dist(a, b)
"""
    notices = audit_code_simplification(code)
    wrapper_notices = [n for n in notices if n.rule == "YAGNI_TRIVIAL_WRAPPER"]
    assert len(wrapper_notices) == 1
    assert wrapper_notices[0].line == 2


def test_detects_stdlib_preference():
    code = """
import requests
import json
"""
    notices = audit_code_simplification(code)
    stdlib_notices = [n for n in notices if n.rule == "PONYTAIL_STDLIB_PREFERENCE"]
    assert len(stdlib_notices) == 1
    assert "requests" in stdlib_notices[0].message


def test_clean_standard_code_has_no_notices():
    code = """
import math
from typing import List

def calculate_mean(values: List[float]) -> float:
    if not values:
        return 0.0
    return sum(values) / len(values)
"""
    notices = audit_code_simplification(code)
    assert len(notices) == 0
