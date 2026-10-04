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

from extractor.vector_extractor import (
    get_title_block_mask,
    is_inside_mask,
    is_drawing_border_margin,
    extract_vector_dimensions_from_page,
)


def test_title_block_and_border_masks():
    w, h = 1000.0, 700.0
    masks = get_title_block_mask(w, h)
    assert len(masks) == 2

    # Sağ alt antet bölgesi: maskelenmeli
    antet_bbox = (800.0, 600.0, 950.0, 680.0)
    assert is_inside_mask(antet_bbox, masks) is True

    # Çizim ortası: maskelenmemeli
    drawing_bbox = (400.0, 300.0, 450.0, 320.0)
    assert is_inside_mask(drawing_bbox, masks) is False

    # Kenar grid bölgesi: border margin olarak yakalanmalı
    border_bbox = (10.0, 300.0, 20.0, 320.0)
    assert is_drawing_border_margin(border_bbox, w, h, margin=24.0) is True

    # Merkez: border margin olmamalı
    assert is_drawing_border_margin(drawing_bbox, w, h, margin=24.0) is False


def test_vector_extractor_with_real_pdf():
    import pymupdf
    pdf_path = os.path.join(root_dir, "test_assets", "Askı Kulbu", "050-164849-000.pdf")
    if not os.path.exists(pdf_path):
        pytest.skip(f"Test dosyası bulunamadı: {pdf_path}")

    doc = pymupdf.open(pdf_path)
    res = extract_vector_dimensions_from_page(doc[1], page_num=2)

    assert res["page"] == 2
    assert res["page_width"] > 100.0
    assert res["page_height"] > 100.0
    assert len(res["dimensions"]) > 10

    nominals = [d["nominal"] for d in res["dimensions"]]
    # 2. sayfada 27.2 ve 2.5 gibi belirgin ölçüler bulunmalıdır
    assert 27.2 in nominals or 2.5 in nominals
