import os
from tools.extractor.spatial import detect_orthographic_views, assign_view_to_dimension
from tools.extractor.brep_verifier import (
    align_view_to_3d_projection,
    transform_2d_to_3d,
    verify_dimensions_against_step,
    compute_topological_match_score,
)


def test_affine_registration_distinguishes_identical_diameter_holes() -> None:
    cad_cylinders = [
        {"id": 101, "diameter": 8.5, "radius": 4.25, "center": [15.0, 20.0, 5.0], "axis": [0.0, 0.0, 1.0], "is_internal": True},
        {"id": 102, "diameter": 8.5, "radius": 4.25, "center": [85.0, 40.0, 5.0], "axis": [0.0, 0.0, 1.0], "is_internal": True},
        {"id": 103, "diameter": 14.0, "radius": 7.0, "center": [50.0, 60.0, 5.0], "axis": [0.0, 0.0, 1.0], "is_internal": True},
    ]

    circles_2d = [
        {"center": [130.0, 260.0], "radius_pt": 8.5},
        {"center": [270.0, 220.0], "radius_pt": 8.5},
        {"center": [200.0, 180.0], "radius_pt": 14.0},
    ]

    align = align_view_to_3d_projection(circles_2d, cad_cylinders, view_plane="XY")
    assert align is not None
    assert align["inliers"] == 3
    assert align["residual_error"] < 0.05

    mapped = transform_2d_to_3d([270.0, 220.0], align, {"min": [0.0, 0.0, 0.0], "max": [100.0, 80.0, 10.0]})
    assert abs(mapped[0] - 85.0) < 0.1
    assert abs(mapped[1] - 40.0) < 0.1

    step_data = {
        "success": True,
        "cylinders": cad_cylinders,
        "planes": [],
        "cones": [],
        "toroids": [],
        "spheres": [],
        "circles": [],
        "linear_distances": [],
        "rotational_diameters": [],
        "bbox": {"min": [0.0, 0.0, 0.0], "max": [100.0, 80.0, 10.0], "size": [100.0, 80.0, 10.0]},
        "view_circles_2d": {"VIEW_TOP_XY": circles_2d},
    }

    dims = [
        {
            "type": "HOLE",
            "nominal": 8.5,
            "nominal_str": "Ø8.5",
            "view_name": "VIEW_TOP_XY",
            "bbox": [310.0, 200.0, 345.0, 212.0],
            "attachments": {"circle_cx": 270.0, "circle_cy": 220.0, "circle_r_pt": 8.5},
        },
        {
            "type": "HOLE",
            "nominal": 8.5,
            "nominal_str": "Ø8.5",
            "view_name": "VIEW_TOP_XY",
            "bbox": [70.0, 270.0, 105.0, 282.0],
            "attachments": {"circle_cx": 130.0, "circle_cy": 260.0, "circle_r_pt": 8.5},
        },
    ]

    verified, _ = verify_dimensions_against_step(dims, step_data)
    assert verified[0]["cad_match"]["id"] == 102
    assert verified[1]["cad_match"]["id"] == 101


def test_section_view_plane_locking_boosts_internal_features() -> None:
    text_items = [
        {"text": "KESİT A-A", "bbox": [520.0, 80.0, 580.0, 95.0]},
        {"text": "A", "bbox": [120.0, 140.0, 130.0, 150.0]},
        {"text": "A", "bbox": [300.0, 140.0, 310.0, 150.0]},
    ]
    views = detect_orthographic_views([], 842.0, 595.0, text_items=text_items)
    sec_views = [v for v in views if v.get("is_section_view")]
    assert len(sec_views) >= 1
    assert sec_views[0]["section_label"] == "A-A"
    assert sec_views[0]["section_plane_rel"] is not None

    assigned = assign_view_to_dimension([540.0, 160.0, 590.0, 172.0], views, dim_type="LINEAR")
    assert assigned["is_section_view"] is True
    assert assigned["section_label"] == "A-A"

    bbox = {"min": [0.0, 0.0, 0.0], "max": [100.0, 100.0, 20.0]}
    dim_sec = {
        "type": "LINEAR",
        "nominal": 12.0,
        "view_name": "VIEW_SECTION",
        "is_section_view": True,
    }
    ext_cand = {"type": "EXTERNAL_WIDTH", "nominal": 12.0, "center": [50.0, 50.0, 10.0], "is_internal": False}
    int_cand = {"type": "INTERNAL_SLOT", "nominal": 12.0, "center": [50.0, 50.0, 10.0], "is_internal": True}

    score_ext = compute_topological_match_score(dim_sec, ext_cand, bbox, view_name="VIEW_SECTION")
    score_int = compute_topological_match_score(dim_sec, int_cand, bbox, view_name="VIEW_SECTION")
    assert score_int >= score_ext + 19.9


def test_zero_dev_mocks_remaining() -> None:
    mocks_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".dev", "mocks")
    if os.path.isdir(mocks_dir):
        entries = [f for f in os.listdir(mocks_dir) if f.endswith(".json")]
        assert entries == []
