import io
import json
import os
import sqlite3
import sys
import urllib.request

import pytest

TOOLS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if TOOLS_DIR not in sys.path:
    sys.path.insert(0, TOOLS_DIR)

import drawing_extractor
from extractor.active_learning_engine import (
    ActiveLearningMatcher,
    clear_feedback_for_part,
    ensure_learning_tables,
    undo_last_feedback,
)
from extractor.brep_verifier import OCP_AVAILABLE, extract_cad_metadata_ocp, verify_dimensions_against_step
from extractor.contract_guard import classify_dimension_risk
from extractor.parse.dimension import is_reference_dimension, parse_linear_callouts
from extractor.spatial import detect_table_regions, is_bbox_in_table_region
from extractor.title_block import extract_title_block_fields
from extractor.vision_ai_extractor import build_few_shot_system_prompt, check_local_ollama_status


def test_turkish_comma_decimals_and_warning_risk():
    parsed = parse_linear_callouts("59,2±0,1\n2x 1,4±0,05", include_reference=False)
    by_nom = {round(d["nominal"], 3): d for d in parsed}
    assert 59.2 in by_nom
    assert 1.4 in by_nom

    d59 = by_nom[59.2]
    assert float(d59["upper_tol"]) == pytest.approx(0.1)
    assert float(d59["lower_tol"]) == pytest.approx(-0.1)

    d14 = by_nom[1.4]
    assert d14["quantity"] == 2
    assert float(d14["upper_tol"]) == pytest.approx(0.05)
    assert float(d14["lower_tol"]) == pytest.approx(-0.05)

    risk14, reasons14 = classify_dimension_risk(d14)
    assert risk14 == "WARNING"
    assert len(reasons14) >= 1

    risk59, _ = classify_dimension_risk(d59)
    assert risk59 == "NORMAL"

    metrology = drawing_extractor.parse_text_to_metrology(
        "59,2±0,1\n2x 1,4±0,05",
        1,
        "turkish_comma_test.pdf",
    )
    dim_map = {round(float(d["nominal"]), 3): d for d in metrology["dimensions"]}
    assert 59.2 in dim_map
    assert 1.4 in dim_map
    assert dim_map[1.4]["risk_level"] == "WARNING"
    assert float(dim_map[59.2]["upper_tol"]) == pytest.approx(0.1)


def test_reference_dimension_and_table_region_exclusion():
    assert is_reference_dimension("(53,9)") is True
    assert is_reference_dimension("53,9") is False

    parsed_no_ref = parse_linear_callouts("(53,9)  25±0,1", include_reference=False)
    assert all(abs(d["nominal"] - 53.9) > 1e-4 for d in parsed_no_ref)
    assert any(abs(d["nominal"] - 25.0) < 1e-4 for d in parsed_no_ref)

    parsed_with_ref = parse_linear_callouts("(53,9)", include_reference=True)
    assert len(parsed_with_ref) == 1
    assert parsed_with_ref[0]["is_reference_dimension"] is True

    text_spans = [
        {"text": "YÜZEY", "bbox": [60.0, 500.0, 110.0, 512.0]},
        {"text": "ADET", "bbox": [130.0, 500.0, 170.0, 512.0]},
        {"text": "PARÇA NO", "bbox": [190.0, 500.0, 260.0, 512.0]},
        {"text": "12.5", "bbox": [135.0, 525.0, 165.0, 537.0]},
        {"text": "25.0", "bbox": [400.0, 200.0, 440.0, 215.0]},
    ]
    regions = detect_table_regions([], text_spans, page_w=842.0, page_h=595.0)
    assert len(regions) >= 1
    assert is_bbox_in_table_region([135.0, 525.0, 165.0, 537.0], regions) is True
    assert is_bbox_in_table_region([400.0, 200.0, 440.0, 215.0], regions) is False

    candidates = [
        {
            "id": 1,
            "page": 1,
            "nominal": 53.9,
            "nominal_str": "(53,9)",
            "bbox": [400.0, 150.0, 440.0, 165.0],
            "is_reference_dimension": True,
        },
        {
            "id": 2,
            "page": 1,
            "nominal": 12.5,
            "nominal_str": "12.5",
            "bbox": [135.0, 525.0, 165.0, 537.0],
        },
        {
            "id": 3,
            "page": 1,
            "nominal": 25.0,
            "nominal_str": "25.0±0.1",
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
            "bbox": [400.0, 200.0, 440.0, 215.0],
        },
    ]
    page_entries = [{"page": 1, "width": 842.0, "height": 595.0, "items": text_spans}]
    filtered = drawing_extractor._filter_and_learn_dimensions(candidates, page_entries)
    assert [round(float(d["nominal"]), 3) for d in filtered] == [25.0]


def test_thread_standard_not_assigned_as_general_tolerance():
    tb_thread_only = extract_title_block_fields(
        "DİŞ STANDARDI: ASME B1.13M\nVİDA: ISO 965-1\n4x M3x0.5",
        "10142739_dc_modul_plaka.pdf",
    )
    assert tb_thread_only["general_tolerance"] == ""

    tb_with_iso = extract_title_block_fields(
        "ASME B1.13M\nGENEL TOLERANS: ISO 2768-m\nISO 965",
        "10142739_dc_modul_plaka.pdf",
    )
    assert "2768-m" in tb_with_iso["general_tolerance"]
    assert tb_with_iso["iso_class"] == "m"


def test_brep_verifier_unmatched_threshold_and_no_synthetic_dist():
    step_data = {
        "success": True,
        "metadata": {
            "features": [
                {
                    "feature_id": "CAD_HOLE_4.00_1",
                    "type": "CYLINDER",
                    "diameter": 4.0,
                    "center": [10.0, 10.0, 0.0],
                    "axis": [0.0, 0.0, 1.0],
                    "face_id": "FACE_1",
                    "is_hole": True,
                }
            ],
            "bbox": {"size": [60.0, 40.0, 10.0]},
        },
    }
    dims = [
        {
            "id": 1,
            "balloon": "B1",
            "type": "LINEAR",
            "nominal": 99.5,
            "nominal_str": "99.5±0.1",
            "upper_tol": "+0.1",
            "lower_tol": "-0.1",
        }
    ]
    verified, _ = verify_dimensions_against_step(dims, step_data)
    assert len(verified) == 1
    item = verified[0]
    assert item["match_status"] == "UNMATCHED"
    assert item["verification"] == "PARSED"
    assert item["match_confidence"] == 0.0
    assert item.get("matched_face_ids", []) == []
    assert item.get("cad_match") is None
    assert "cad_center" not in item
    assert not str(item.get("cad_feature_id", "")).startswith(("CAD_DIST_", "CAD_STEP_DIST_", "MESAFE_"))

    real_step = os.path.abspath(
        os.path.join(TOOLS_DIR, "..", "test_assets", "KPT - 2997 Dc Modül Plaka", "10142739_dc_modul_plaka.stp")
    )
    if OCP_AVAILABLE and os.path.exists(real_step):
        meta = extract_cad_metadata_ocp(real_step)
        assert meta.get("success") is True
        feat_ids = [str(f.get("feature_id", "")) for f in meta.get("features", [])]
        assert len(feat_ids) > 0
        assert not any(fid.startswith(("CAD_DIST_", "CAD_STEP_DIST_", "MESAFE_")) for fid in feat_ids)


def test_active_learning_sqlite_feedback_and_few_shot_prompt(tmp_path, monkeypatch):
    db_file = tmp_path / "test_ortho_learning.db"
    db_path = ensure_learning_tables(str(db_file))
    assert os.path.exists(db_path)

    conn = sqlite3.connect(db_path)
    try:
        tables = {
            row[0]
            for row in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        }
    finally:
        conn.close()
    assert {"false_positive_patterns", "parsing_corrections", "surface_binding_samples", "learning_weights"}.issubset(tables)

    matcher = ActiveLearningMatcher(db_path=db_path)

    fp_candidate = {
        "raw_text": "PARÇA NO 12",
        "aspect_ratio": 2.4,
        "in_table_region": True,
        "has_leader_line": False,
        "relative_page_y": 0.9,
    }
    _, prob_before = matcher.predict_is_valid_dimension(fp_candidate)
    fp_res = matcher.record_feedback(
        {
            "event_type": "FALSE_POSITIVE_BALLOON",
            "raw_text": "PARÇA NO 12",
            "bbox": [10.0, 500.0, 58.0, 520.0],
            "in_table_region": True,
            "has_leader_line": False,
            "relative_page_y": 0.9,
        }
    )
    assert fp_res["recorded"] is True
    _, prob_after = matcher.predict_is_valid_dimension(fp_candidate)
    assert prob_after < prob_before

    corr_res = matcher.record_feedback(
        {
            "event_type": "PARSING_CORRECTION",
            "raw_text": "2x 1,4+0,05",
            "corrected": {
                "nominal": 1.4,
                "upper_tol": "+0.05",
                "lower_tol": "-0.05",
                "type": "LINEAR",
            },
        }
    )
    assert corr_res["recorded"] is True
    applied = matcher.apply_learned_parsing_correction("2x 1,4+0,05")
    assert applied is not None
    assert applied["nominal"] == pytest.approx(1.4)
    assert applied["upper_tol"] == "+0.05"
    assert applied["lower_tol"] == "-0.05"

    few_shot_prompt = build_few_shot_system_prompt(db_path=db_path)
    assert "ENGINEER VERIFIED FEW-SHOT PARSING CORRECTIONS" in few_shot_prompt
    assert "2x 1,4+0,05" in few_shot_prompt
    assert "1.4" in few_shot_prompt

    feature_2d = {"type": "HOLE", "nominal": 8.0, "axis": "Z"}
    surface_3d = {"type": "CYLINDER", "diameter": 8.0, "is_hole": True, "axis": [0.0, 0.0, 1.0]}
    surf_before = matcher.predict_surface_match_probability(feature_2d, surface_3d)
    sb_res = matcher.record_feedback(
        {
            "event_type": "SURFACE_BINDING_POSITIVE",
            "feature_2d": feature_2d,
            "surface_3d": surface_3d,
        }
    )
    assert sb_res["recorded"] is True
    surf_after = matcher.predict_surface_match_probability(feature_2d, surface_3d)
    assert surf_after > surf_before

    class _MockHttpResponse(io.BytesIO):
        def __init__(self, body_dict):
            super().__init__(json.dumps(body_dict).encode("utf-8"))
            self.status = 200

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            self.close()
            return False

    def _fake_urlopen(req, timeout=1.0):
        url = req.full_url if hasattr(req, "full_url") else str(req)
        if url.endswith("/api/tags"):
            return _MockHttpResponse({"models": [{"name": "qwen2.5vl:3b"}]})
        if url.endswith("/api/generate"):
            return _MockHttpResponse({"done": True})
        raise AssertionError(f"Unexpected URL: {url}")

    monkeypatch.setattr(urllib.request, "urlopen", _fake_urlopen)
    ollama_status = check_local_ollama_status(ollama_url="http://127.0.0.1:11434", verify_generate=True)
    assert ollama_status["active"] is True
    assert ollama_status["generate_ready"] is True
    assert ollama_status["selected_model"] == "qwen2.5vl:3b"
    assert ollama_status["status_label"] == "GPU: Aktif | Yerel AI + Öğrenen Motor"


def test_undo_and_clear_feedback_for_part(tmp_path):
    db_path = str(tmp_path / "undo_clear_test.db")
    matcher = ActiveLearningMatcher(db_path=db_path)

    matcher.record_feedback(
        {
            "event_type": "PARSING_CORRECTION",
            "part_hash": "PART_A",
            "raw_text": "12,5±0,1",
            "corrected": {"nominal": 12.5, "upper_tol": "+0.1", "lower_tol": "-0.1", "type": "LINEAR"},
        }
    )
    matcher.record_feedback(
        {
            "event_type": "FALSE_POSITIVE_BALLOON",
            "part_hash": "PART_B",
            "raw_text": "TABLO HUCRESI",
            "in_table_region": True,
        }
    )

    undo_res = undo_last_feedback(db_path=db_path)
    assert undo_res["status"] == "ok"
    assert undo_res["undone_table"] == "false_positive_patterns"

    part_a_corr = matcher.apply_learned_parsing_correction("12,5±0,1")
    assert part_a_corr is not None

    clear_a = clear_feedback_for_part("PART_A", db_path=db_path)
    assert clear_a["status"] == "ok"
    assert clear_a["deleted_count"] == 1
    assert matcher.apply_learned_parsing_correction("12,5±0,1") is None
