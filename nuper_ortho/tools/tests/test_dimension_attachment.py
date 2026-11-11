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

from extractor.spatial import trace_dimension_attachments


def test_trace_dimension_horizontal_line_and_scale():
    dim_bbox = [140.0, 140.0, 160.0, 152.0]
    drawings = [
        {
            "rect": [100.0, 150.0, 200.0, 150.0],
            "items": [
                ("l", (100.0, 150.0), (200.0, 150.0)),
            ],
        },
        {
            "rect": [100.0, 150.0, 100.0, 180.0],
            "items": [
                ("l", (100.0, 150.0), (100.0, 180.0)),
            ],
        },
        {
            "rect": [200.0, 150.0, 200.0, 180.0],
            "items": [
                ("l", (200.0, 150.0), (200.0, 180.0)),
            ],
        },
    ]

    res = trace_dimension_attachments(dim_bbox, drawings, nominal_val=36.5, page_scale=0.365)

    assert res["has_dimension_line"] is True
    assert abs(res["dimension_line_length_pt"] - 100.0) <= 0.5
    assert res["p_start"] == [100.0, 150.0]
    assert res["p_end"] == [200.0, 150.0]
    assert res["scale_consistent"] is True
    assert len(res["attachment_points"]) == 2


def test_trace_leader_line_tip():
    dim_bbox = [300.0, 200.0, 350.0, 215.0]
    drawings = [
        {
            "rect": [250.0, 250.0, 305.0, 208.0],
            "items": [
                ("l", (305.0, 208.0), (280.0, 220.0)),
                ("l", (280.0, 220.0), (250.0, 250.0)),
            ],
        },
    ]

    res = trace_dimension_attachments(dim_bbox, drawings, nominal_val=3.5)

    assert res["leader_tip"] == [250.0, 250.0]


def test_scale_inconsistency_filter():
    dim_bbox = [100.0, 100.0, 120.0, 112.0]
    drawings = [
        {
            "rect": [100.0, 110.0, 115.0, 110.0],
            "items": [
                ("l", (100.0, 110.0), (115.0, 110.0)),
            ],
        },
    ]

    res = trace_dimension_attachments(dim_bbox, drawings, nominal_val=500.0, page_scale=0.5)

    assert res["has_dimension_line"] is True
    assert res["scale_consistent"] is False
