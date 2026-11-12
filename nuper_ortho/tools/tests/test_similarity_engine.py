import os
import pytest
from tools.extractor.similarity_engine import (
    extract_feature_vector,
    cosine_similarity,
    PartSetupDatabase,
    register_part_in_catalog,
    query_similar_from_db,
)


def test_extract_feature_vector_sorted_bbox():
    geom = {
        "bbox_x": 45.0,
        "bbox_y": 150.0,
        "bbox_z": 20.0,
        "hole_count": 8,
        "cylinder_ratio": 0.25,
        "min_tolerance": 0.015,
        "surface_area": 12500.0,
    }
    vec = extract_feature_vector(geom)
    assert len(vec) == 7
    assert vec[0] == 150.0
    assert vec[1] == 45.0
    assert vec[2] == 20.0
    assert vec[3] == 8.0
    assert vec[4] == 0.25
    assert vec[5] == 0.015
    assert vec[6] == 12500.0


def test_cosine_similarity_identity_and_orthogonality():
    v1 = [100.0, 50.0, 20.0, 4.0, 0.1, 0.02, 5000.0]
    assert cosine_similarity(v1, v1) == pytest.approx(1.0, rel=1e-5)

    v_zero = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    assert cosine_similarity(v1, v_zero) == 0.0

    v_variant = [105.0, 48.0, 20.0, 4.0, 0.1, 0.02, 5100.0]
    sim = cosine_similarity(v1, v_variant)
    assert sim > 0.99


def test_part_setup_database_workflow():
    db = PartSetupDatabase()

    p1_vec = extract_feature_vector({
        "bbox_x": 120.0,
        "bbox_y": 60.0,
        "bbox_z": 30.0,
        "hole_count": 6,
        "cylinder_ratio": 0.18,
        "min_tolerance": 0.02,
        "surface_area": 8400.0,
    })
    fixtures_op10 = {"clamping_type": "step_clamp", "points": [[10, 10], [110, 50]]}
    ph10_angles = [(0.0, 0.0), (45.0, 90.0), (90.0, 180.0)]

    db.register_setup(
        part_id="FLANGE-A01",
        part_name="Flanş Gövde Rev A",
        vector=p1_vec,
        op_fixtures=fixtures_op10,
        ph10_angles=ph10_angles,
        strategy={"strategy_id": "OP10_BASE_DATUM"},
    )

    query_variant = extract_feature_vector({
        "bbox_x": 122.0,
        "bbox_y": 59.0,
        "bbox_z": 30.0,
        "hole_count": 6,
        "cylinder_ratio": 0.17,
        "min_tolerance": 0.02,
        "surface_area": 8500.0,
    })

    matches = db.query_similar(query_variant, min_similarity=0.90)
    assert len(matches) == 1
    top = matches[0]
    assert top["part_id"] == "FLANGE-A01"
    assert top["similarity_pct"] >= 95.0
    assert len(top["ph10_angles"]) == 3

    card_text = db.format_recommendation_card(top)
    assert "Flanş Gövde Rev A" in card_text
    assert "OP10/OP20" in card_text
    assert "PH10 prob açılarını" in card_text

    query_dissimilar = extract_feature_vector({
        "bbox_x": 15.0,
        "bbox_y": 10.0,
        "bbox_z": 5.0,
        "hole_count": 0,
        "cylinder_ratio": 0.0,
        "min_tolerance": 0.5,
        "surface_area": 120.0,
    })
    no_matches = db.query_similar(query_dissimilar, min_similarity=0.90)
    assert len(no_matches) == 0

    db.close()


def test_part_catalog_vectors_persistence_and_query():
    db_test_path = os.path.join(os.path.dirname(__file__), "..", "..", "test_assets", "benchmarks.db")
    register_part_in_catalog(
        part_id="CATALOG_P1",
        part_name="Test Bracket Rev 1",
        material="AL7075",
        bbox_x=100.0,
        bbox_y=50.0,
        bbox_z=20.0,
        hole_count=4,
        min_tol=0.015,
        setup_json={"fixtures": ["clamp1", "clamp2"], "ph10": ["A0B0"]},
        db_path=db_test_path,
    )
    query_vec = extract_feature_vector({
        "bbox_x": 102.0,
        "bbox_y": 49.0,
        "bbox_z": 20.0,
        "hole_count": 4,
        "min_tolerance": 0.015,
    })
    matches = query_similar_from_db(query_vec, db_path=db_test_path, min_similarity=0.85)
    assert len(matches) >= 1
    found = next((m for m in matches if m["part_id"] == "CATALOG_P1"), None)
    assert found is not None
    assert found["similarity_pct"] >= 85.0
    assert found["setup"]["fixtures"] == ["clamp1", "clamp2"]

