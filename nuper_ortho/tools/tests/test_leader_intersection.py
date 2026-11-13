from tools.extractor.spatial import extract_circle_primitives, trace_dimension_attachments


def test_leader_line_snaps_to_vector_circle_center() -> None:
    drawings = [
        {
            "rect": [100.0, 112.0, 145.0, 112.0],
            "items": [("l", (100.0, 112.0), (145.0, 112.0))],
        },
        {
            "rect": [145.0, 112.0, 200.0, 170.0],
            "items": [("l", (145.0, 112.0), (200.0, 170.0))],
        },
        {
            "rect": [190.0, 170.0, 230.0, 210.0],
            "closePath": True,
            "items": [
                ("c", (210.0, 170.0), (221.0, 170.0), (230.0, 179.0), (230.0, 190.0)),
                ("c", (230.0, 190.0), (230.0, 201.0), (221.0, 210.0), (210.0, 210.0)),
                ("c", (210.0, 210.0), (199.0, 210.0), (190.0, 201.0), (190.0, 190.0)),
                ("c", (190.0, 190.0), (190.0, 179.0), (199.0, 170.0), (210.0, 170.0)),
            ],
        },
    ]

    circles = extract_circle_primitives(drawings)
    assert len(circles) == 1
    assert circles[0]["center"] == [210.0, 190.0]
    assert circles[0]["radius_pt"] == 20.0

    att = trace_dimension_attachments([100.0, 100.0, 140.0, 110.0], drawings, nominal_val=10.0)
    assert att["topology_type"] == "LEADER_CIRCLE"
    assert att["circle_cx"] == 210.0
    assert att["circle_cy"] == 190.0
    assert att["circle_r_pt"] == 20.0


def test_narrow_outside_arrow_linear_dimension() -> None:
    drawings = [
        {
            "rect": [300.0, 190.0, 300.0, 225.0],
            "items": [("l", (300.0, 190.0), (300.0, 225.0))],
        },
        {
            "rect": [308.0, 190.0, 308.0, 225.0],
            "items": [("l", (308.0, 190.0), (308.0, 225.0))],
        },
    ]

    att = trace_dimension_attachments([312.0, 195.0, 338.0, 205.0], drawings, nominal_val=4.0)
    assert att["topology_type"] == "LINEAR_OUTSIDE_NARROW"
    assert att["has_dimension_line"] is True
    assert att["dimension_line_length_pt"] == 8.0


def test_ordinate_baseline_dimensioning() -> None:
    spans = [
        {"text": "0", "bbox": [100.0, 400.0, 108.0, 410.0]},
        {"text": "42.5", "bbox": [185.0, 400.0, 210.0, 410.0]},
    ]
    att = trace_dimension_attachments(
        [185.0, 400.0, 210.0, 410.0],
        drawings=[],
        nominal_val=42.5,
        text_spans=spans,
    )
    assert att["is_ordinate"] is True
    assert att["topology_type"] == "ORDINATE_BASELINE"
    assert att["ordinate_origin"] == [104.0, 405.0]
