import os
import sys
import pytest

# Add parent directory to sys.path so tools and models are importable
current_dir = os.path.dirname(os.path.abspath(__file__))
tools_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(tools_dir)
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from drawing_extractor import parse_text_to_metrology
from tools.models.generated_drawing_data import DrawingExtractionResult


def test_drawing_extractor_basic_metrology():
    sample_text = """
    DOKUMAN NO: 050-164849-000
    MALZEME: SAE 4340
    SERTLİK: 38-44 HRC
    DATUM [A] [B] [C]
    Ø20 H7
    Ø15.45 MIN
    R2.5
    51.6 ±0.2
    14.4 ±0.1
    """

    data = parse_text_to_metrology(sample_text, 1, "test_part.pdf")

    # 1. Assert required fields
    assert data["success"] is True
    assert data["filename"] == "test_part.pdf"
    assert data["title_block"]["material"] == "SAE 4340"
    assert "38-44 HRC" in data["title_block"]["hardness"]
    assert "A" in data["datums"]
    assert "B" in data["datums"]
    assert "C" in data["datums"]

    # 2. Check dimensions extracted
    nominals = [d["nominal"] for d in data["dimensions"]]
    assert 20.0 in nominals
    assert 15.45 in nominals
    assert 2.5 in nominals

    # 3. Validate against Pydantic schema (Single Source of Truth)
    validated = DrawingExtractionResult.model_validate(data)
    assert validated.success is True
    assert len(validated.dimensions) > 0
    assert validated.dimensions[0].status.value == "PASS"


def test_drawing_extractor_empty_text():
    data = parse_text_to_metrology("", 0, "empty.pdf")
    validated = DrawingExtractionResult.model_validate(data)
    assert validated.success is True
    assert validated.filename == "empty.pdf"
    # When text is empty, extractor provides 4 default fallback metrology features
    assert len(validated.dimensions) == 4

