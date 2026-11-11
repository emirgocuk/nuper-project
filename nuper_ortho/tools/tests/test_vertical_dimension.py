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

from extractor.spatial import normalize_span_to_local_frame
from extractor.vector_extractor import extract_vector_dimensions_from_page


def test_normalize_span_to_local_frame_90deg():
    bbox = [100.0, 200.0, 112.0, 240.0]
    loc_box = normalize_span_to_local_frame(bbox, 90.0)
    w_loc = loc_box[2] - loc_box[0]
    h_loc = loc_box[3] - loc_box[1]

    assert abs(w_loc - 40.0) <= 0.1
    assert abs(h_loc - 12.0) <= 0.1


def test_vertical_dimension_clustering():
    class MockPage:
        def __init__(self):
            class MockRect:
                width = 800.0
                height = 600.0
            self.rect = MockRect()

        def get_drawings(self):
            return []

        def get_text(self, kind="dict"):
            return {
                "blocks": [
                    {
                        "type": 0,
                        "lines": [
                            {
                                "dir": (0.0, 1.0),
                                "spans": [
                                    {
                                        "text": "35",
                                        "font": "Arial",
                                        "size": 12.0,
                                        "bbox": [100.0, 200.0, 112.0, 230.0],
                                    },
                                    {
                                        "text": "+0.0",
                                        "font": "Arial",
                                        "size": 8.0,
                                        "bbox": [98.0, 232.0, 106.0, 245.0],
                                    },
                                    {
                                        "text": "-0.2",
                                        "font": "Arial",
                                        "size": 8.0,
                                        "bbox": [106.0, 232.0, 114.0, 245.0],
                                    },
                                ],
                            }
                        ],
                    }
                ]
            }

    page = MockPage()
    res = extract_vector_dimensions_from_page(page, page_num=1)
    dims = res["dimensions"]

    assert len(dims) == 1
    d = dims[0]
    assert d["nominal"] == 35.0
    assert d["orientation"] == "VERTICAL"
    assert "+0.0" in d["raw_text"]
    assert "-0.2" in d["raw_text"]
    assert d["upper_tol"] != ""
    assert d["lower_tol"] != ""
