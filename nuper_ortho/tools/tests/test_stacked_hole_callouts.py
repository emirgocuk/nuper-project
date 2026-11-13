from tools.extractor.spatial import recognize_vector_gdt_symbols
from tools.extractor.semantic_grammar import merge_stacked_hole_callouts


def test_recognize_vector_hole_symbols_cbore_csink_depth() -> None:
    cbore_drawings = [
        {"rect": [100.0, 100.0, 100.0, 110.0], "items": [("l", (100.0, 100.0), (100.0, 110.0))]},
        {"rect": [100.0, 110.0, 110.0, 110.0], "items": [("l", (100.0, 110.0), (110.0, 110.0))]},
        {"rect": [110.0, 100.0, 110.0, 110.0], "items": [("l", (110.0, 100.0), (110.0, 110.0))]},
    ]
    csink_drawings = [
        {"rect": [200.0, 100.0, 205.0, 110.0], "items": [("l", (200.0, 100.0), (205.0, 110.0))]},
        {"rect": [205.0, 100.0, 210.0, 110.0], "items": [("l", (210.0, 100.0), (205.0, 110.0))]},
    ]
    depth_drawings = [
        {"rect": [300.0, 100.0, 310.0, 100.0], "items": [("l", (300.0, 100.0), (310.0, 100.0))]},
        {"rect": [305.0, 100.0, 305.0, 112.0], "items": [("l", (305.0, 100.0), (305.0, 112.0))]},
        {"rect": [302.0, 108.0, 305.0, 112.0], "items": [("l", (302.0, 108.0), (305.0, 112.0))]},
        {"rect": [305.0, 108.0, 308.0, 112.0], "items": [("l", (308.0, 108.0), (305.0, 112.0))]},
    ]

    all_drawings = cbore_drawings + csink_drawings + depth_drawings
    recognized = recognize_vector_gdt_symbols(all_drawings)
    symbols = {item["symbol"] for item in recognized}

    assert "⌴" in symbols
    assert "∨" in symbols
    assert "↧" in symbols


def test_merge_stacked_hole_callouts_counterbore_and_thru() -> None:
    dims = [
        {
            "raw_text": "4x Ø6.6 THRU",
            "nominal": 6.6,
            "bbox": [120.0, 200.0, 195.0, 212.0],
            "page": 1,
        },
        {
            "raw_text": "⌴ Ø11 ↧ 6.8",
            "nominal": 11.0,
            "bbox": [121.0, 215.0, 190.0, 227.0],
            "page": 1,
        },
        {
            "raw_text": "50 ±0.1",
            "nominal": 50.0,
            "bbox": [400.0, 300.0, 445.0, 312.0],
            "page": 1,
        },
    ]

    merged = merge_stacked_hole_callouts(dims)
    assert len(merged) == 2

    hole = merged[0]
    assert hole["nominal"] == 6.6
    assert hole["is_compound_hole"] is True
    assert hole["is_thru"] is True
    assert hole["counterbore_diameter"] == 11.0
    assert hole["counterbore_depth"] == 6.8
    assert hole["bbox"] == [120.0, 200.0, 195.0, 227.0]


def test_merge_stacked_hole_callouts_countersink_and_depth() -> None:
    dims = [
        {
            "raw_text": "2x M8x1.25 - 6H",
            "nominal": 8.0,
            "bbox": [100.0, 100.0, 180.0, 110.0],
            "page": 1,
        },
        {
            "raw_text": "↧ 16.0",
            "nominal": 16.0,
            "bbox": [102.0, 112.0, 145.0, 122.0],
            "page": 1,
        },
        {
            "raw_text": "∨ Ø9.2 x 90°",
            "nominal": 9.2,
            "bbox": [101.0, 124.0, 175.0, 134.0],
            "page": 1,
        },
    ]

    merged = merge_stacked_hole_callouts(dims)
    assert len(merged) == 1
    comp = merged[0]
    assert comp["is_compound_hole"] is True
    assert comp["hole_depth"] == 16.0
    assert comp["countersink_diameter"] == 9.2
    assert comp["countersink_angle"] == 90.0
