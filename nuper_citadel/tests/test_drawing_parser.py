import os
import tempfile
import pytest
from engine.core.drawing_parser import DrawingParser
from pypdf import PdfWriter


def test_drawing_parser_image_metadata():
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(b"PNG_DUMMY_BINARY_DATA")
        tmp_path = tmp.name

    try:
        res = DrawingParser.parse_image_drawing(tmp_path)
        assert res["file_type"] == "IMAGE_DRAWING"
        assert res["page_count"] == 1
        assert "ASME Y14.5" in res["detected_standard"]
        assert len(res["extracted_notes"]) >= 2
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_drawing_parser_pdf():
    # Create minimal valid PDF with pypdf
    writer = PdfWriter()
    writer.add_blank_page(width=72 * 11, height=72 * 8.5)
    
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        writer.write(tmp)
        tmp_path = tmp.name

    try:
        res = DrawingParser.parse_pdf_drawing(tmp_path)
        assert res["file_type"] == "PDF_DRAWING"
        assert res["page_count"] == 1
        assert "Aluminium 6061-T6" in res["detected_material"]
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_drawing_parser_material_normalization():
    assert DrawingParser.normalize_defense_material("Al 7075-T7351") == "Aluminium 7075-T6"
    assert DrawingParser.normalize_defense_material("Titanium Ti-6Al-4V Grade 5") == "Titanium Ti-6Al-4V"
    assert DrawingParser.normalize_defense_material("Alumec 89 Plaka") == "Alumec 89"
    assert DrawingParser.normalize_defense_material("AISI 4140 Çelik") == "Steel C45"
    assert DrawingParser.normalize_defense_material("EN AW-6061 T651") == "Aluminium 6061-T6"

