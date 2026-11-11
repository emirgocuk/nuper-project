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

from extractor.spatial import recognize_vector_gdt_symbols
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

    antet_bbox = (800.0, 600.0, 950.0, 680.0)
    assert is_inside_mask(antet_bbox, masks) is True

    drawing_bbox = (400.0, 300.0, 450.0, 320.0)
    assert is_inside_mask(drawing_bbox, masks) is False

    border_bbox = (10.0, 300.0, 20.0, 320.0)
    assert is_drawing_border_margin(border_bbox, w, h, margin=24.0) is True

    assert is_drawing_border_margin(drawing_bbox, w, h, margin=24.0) is False


def test_recognize_vector_diameter_symbol():
    drawings = [
        {
            "rect": [100.0, 100.0, 110.0, 110.0],
            "closePath": True,
            "items": [
                ("c", (100.0, 105.0), (100.0, 102.0), (103.0, 100.0), (105.0, 100.0)),
                ("c", (105.0, 100.0), (107.0, 100.0), (110.0, 102.0), (110.0, 105.0)),
                ("c", (110.0, 105.0), (110.0, 107.0), (107.0, 110.0), (105.0, 110.0)),
                ("c", (105.0, 110.0), (103.0, 110.0), (100.0, 107.0), (100.0, 105.0)),
            ],
        },
        {
            "rect": [99.0, 99.0, 111.0, 111.0],
            "items": [
                ("l", (99.0, 111.0), (111.0, 99.0)),
            ],
        },
    ]

    symbols = recognize_vector_gdt_symbols(drawings)
    assert len(symbols) == 1
    assert symbols[0]["symbol"] == "Ø"
    assert symbols[0]["confidence"] >= 0.95
    assert symbols[0]["bbox"] == [99.0, 99.0, 111.0, 111.0]


def test_recognize_vector_true_position_symbol():
    drawings = [
        {
            "rect": [200.0, 150.0, 212.0, 162.0],
            "closePath": True,
            "items": [
                ("c", (200.0, 156.0), (200.0, 153.0), (203.0, 150.0), (206.0, 150.0)),
                ("c", (206.0, 150.0), (209.0, 150.0), (212.0, 153.0), (212.0, 156.0)),
                ("c", (212.0, 156.0), (212.0, 159.0), (209.0, 162.0), (206.0, 162.0)),
                ("c", (206.0, 162.0), (203.0, 162.0), (200.0, 159.0), (200.0, 156.0)),
            ],
        },
        {
            "rect": [198.0, 156.0, 214.0, 156.0],
            "items": [
                ("l", (198.0, 156.0), (214.0, 156.0)),
            ],
        },
        {
            "rect": [206.0, 148.0, 206.0, 164.0],
            "items": [
                ("l", (206.0, 148.0), (206.0, 164.0)),
            ],
        },
    ]

    symbols = recognize_vector_gdt_symbols(drawings)
    assert len(symbols) == 1
    assert symbols[0]["symbol"] == "⌖"
    assert symbols[0]["confidence"] >= 0.95


def test_recognize_vector_perpendicularity_symbol():
    drawings = [
        {
            "rect": [50.0, 60.0, 62.0, 60.0],
            "items": [
                ("l", (50.0, 60.0), (62.0, 60.0)),
            ],
        },
        {
            "rect": [56.0, 50.0, 56.0, 60.0],
            "items": [
                ("l", (56.0, 50.0), (56.0, 60.0)),
            ],
        },
    ]

    symbols = recognize_vector_gdt_symbols(drawings)
    assert len(symbols) == 1
    assert symbols[0]["symbol"] == "⊥"


def test_recognize_vector_flatness_symbol():
    drawings = [
        {
            "rect": [10.0, 20.0, 24.0, 30.0],
            "closePath": True,
            "items": [
                ("l", (13.0, 20.0), (24.0, 20.0)),
                ("l", (24.0, 20.0), (21.0, 30.0)),
                ("l", (21.0, 30.0), (10.0, 30.0)),
                ("l", (10.0, 30.0), (13.0, 20.0)),
            ],
        },
    ]

    symbols = recognize_vector_gdt_symbols(drawings)
    assert len(symbols) == 1
    assert symbols[0]["symbol"] == "▱"


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
    assert 27.2 in nominals or 2.5 in nominals
