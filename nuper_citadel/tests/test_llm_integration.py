import pytest
from fastapi.testclient import TestClient

from engine.main import app

client = TestClient(app)


def test_llm_status_endpoint():
    resp = client.get("/api/llm/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "connected" in data
    assert "active_model" in data


def test_llm_generate_etp_fallback():
    cad_dummy = {
        "metadata": {
            "file_name": "payload_pod.step",
            "material_name": "Aluminium 7075-T6",
            "density_kg_m3": 2810.0,
            "is_manifold_valid": True,
        },
        "physical_properties": {
            "volume_mm3": 120000.0,
            "mass_kg": 0.337,
            "cog_mm": {"x": 10.0, "y": 20.0, "z": 15.0},
        },
        "bounding_box_mm": {
            "length_x": 120.0,
            "width_y": 80.0,
            "height_z": 45.0,
        },
        "mounting_interface": {
            "detected_holes_count": 4,
            "overturning_moment_arm_h_cg_mm": 22.5,
        }
    }

    mission_dummy = {
        "platform": {
            "name": "Taktik İHA Kanat Altı",
            "category": "UAV_EXTERNAL_STORE",
            "standard": "MIL-STD-810H",
        },
        "vibration": {
            "category": "Category 14",
            "nominal_grms": 7.70,
            "effective_grms": 7.70,
            "attenuation_factor": 1.0,
            "duration_per_axis_minutes": 60,
            "axes": ["X", "Y", "Z"],
            "breakpoints": [
                {"frequency_hz": 20.0, "psd_value": 0.0053, "slope_db_oct": 6.0},
                {"frequency_hz": 150.0, "psd_value": 0.0400, "slope_db_oct": 0.0},
                {"frequency_hz": 1000.0, "psd_value": 0.0400, "slope_db_oct": -6.0},
                {"frequency_hz": 2000.0, "psd_value": 0.0100, "slope_db_oct": 0.0},
            ]
        },
        "temperature": {
            "climatic_category": "Basic Hot & Cold",
            "operational_high_c": 71.0,
            "operational_low_c": -40.0,
        },
        "shock": {
            "procedure_name": "Procedure I",
            "peak_acceleration_g": 40.0,
            "duration_ms": 11.0,
        }
    }

    resp = client.post(
        "/api/llm/generate-etp",
        json={
            "cad_data": cad_dummy,
            "mission_profile": mission_dummy,
            "force_fallback": True,
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["source"] == "DETERMINISTIC_FALLBACK"
    assert "MIL-STD-810H" in data["document_markdown"]
    assert "payload_pod" in data["document_markdown"]
    assert "7.70" in data["document_markdown"]


def test_llm_generate_objection_endpoint():
    resp = client.post(
        "/api/llm/generate-objection",
        json={
            "part_name": "wing_bracket.step",
            "platform_name": "Taktik İHA Kanat Altı",
            "anomaly_description": "Shaker tablosunda 500 Hz'de kontrol rezonansı patlaması yaşandı.",
            "recorded_frequency_hz": 500.0,
            "recorded_peak_g": 38.5,
            "nominal_grms": 7.70,
            "fixture_resonance_hz": 510.0,
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "letter_text" in data
    assert "MIL-STD-810H" in data["letter_text"]


def test_dpo_feedback_lifecycle_endpoint():
    # 1. Submit feedback
    resp = client.post(
        "/api/feedback/submit",
        json={
            "feature_area": "ETP_SYNTHESIS",
            "prompt_context": {"step": "bracket.step"},
            "rejected_text": "Metot 514 Titreşim yapılmalı.",
            "chosen_text": "MIL-STD-810H Metot 514.8 Kategori 14 uyarınca 7.70 gRMS titreşim testi icra edilmelidir.",
            "engineer_rating": 5,
            "engineer_notes": "Standart başlığı ve kategori detayı eklendi.",
            "tags": ["Vibration", "Cat14"]
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "recorded_locally"
    assert data["record_id"] > 0

    # 2. List feedback
    list_resp = client.get("/api/feedback/list")
    assert list_resp.status_code == 200
    items = list_resp.json()
    assert len(items) >= 1

    # 3. Stats
    stats_resp = client.get("/api/feedback/stats")
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert stats["total_feedback_records"] >= 1
