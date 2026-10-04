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

from drawing_extractor import parse_text_to_metrology, extract_from_pdf
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

    assert data["success"] is True
    assert data["filename"] == "test_part.pdf"
    assert data["title_block"]["material"] == "SAE 4340"
    assert "38-44 HRC" in data["title_block"]["hardness"]
    assert "A" in data["datums"]
    assert "B" in data["datums"]
    assert "C" in data["datums"]

    nominals = [d["nominal"] for d in data["dimensions"]]
    assert 20.0 in nominals
    assert 15.45 in nominals
    assert 2.5 in nominals

    validated = DrawingExtractionResult.model_validate(data)
    assert validated.success is True
    assert len(validated.dimensions) > 0

    # Y2 & Invariant: Drawing parser must emit UNMEASURED, no fake measurements
    for dim in validated.dimensions:
        assert dim.status.value == "UNMEASURED"
        assert dim.measured == ""
        assert dim.deviation == ""


def test_drawing_extractor_empty_text_zero_fabrication():
    """Invariant: Boş input -> sıfır fabricated characteristic."""
    data = parse_text_to_metrology("", 0, "empty.pdf")
    validated = DrawingExtractionResult.model_validate(data)
    assert validated.success is True
    assert validated.filename == "empty.pdf"
    assert len(validated.dimensions) == 0
    assert len(validated.datums) == 0
    assert validated.title_block.material == ""
    assert validated.title_block.roughness == ""
    assert validated.title_block.general_tolerance == ""


def test_filename_cannot_alter_behavior():
    """Invariant Y4: Dosya adı davranışı değiştiremez. 'gobek' veya '3051' sahte veri tetikleyemez."""
    data = parse_text_to_metrology("", 0, "KPT_3051_gobek_bagi_olugu.pdf", "path/to/3051_gobek.pdf")
    validated = DrawingExtractionResult.model_validate(data)
    assert validated.success is True
    assert len(validated.dimensions) == 0
    assert len(validated.datums) == 0
    assert validated.title_block.material == ""


def test_gobek_bagi_olugu_real_extraction():
    """Gerçek PDF dosyasından uydurmasız, deterministik ayıklama."""
    data = extract_from_pdf("test_assets/GOBEK_BAGI_OLUGU_TR_AB.pdf")
    assert data["success"] is True
    assert data["page_count"] == 3

    dims = data["dimensions"]
    assert len(dims) > 0

    # Tüm ayıklanan ölçüler UNMEASURED olmalı, sentetik PASS veya measured içermemeli
    for d in dims:
        assert d["status"] == "UNMEASURED"
        assert d["measured"] == ""
        assert d["deviation"] == ""

    # Pydantic şema doğrulaması
    validated = DrawingExtractionResult.model_validate(data)
    assert validated.success is True
    assert len(validated.dimensions) == len(dims)



