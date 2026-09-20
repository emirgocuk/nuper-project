import pytest
from fastapi.testclient import TestClient
from engine.main import app

client = TestClient(app)


def test_api_shock_srs_evaluation():
    """Tests POST /api/qualification/shock-srs."""
    payload = {
        "part_mass_kg": 0.40,
        "yield_strength_mpa": 275.0,
        "first_natural_freq_hz": 240.0,
        "num_bolts": 4,
        "bolt_tensile_area_mm2": 8.78,
        "bolt_yield_strength_mpa": 640.0,
        "procedure_name": "Prosedür I - Fonksiyonel Şok",
        "pulse_shape": "Terminal Peak Sawtooth (TPS)",
        "peak_acceleration_g": 40.0,
        "duration_ms": 11.0,
        "q_factor": 10.0,
        "safety_factor": 1.25
    }
    response = client.post("/api/qualification/shock-srs", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["standard"] == "MIL-STD-810H Method 516.8"
    assert data["qualification_status"] == "PASS"
    assert data["part_modal_response"]["srs_amplified_acceleration_g"] > 40.0
    assert len(data["srs_spectrum"]) > 0


def test_api_composite_evaluate():
    """Tests POST /api/materials/composite-evaluate."""
    payload = {
        "material_preset": "AS4/3501-6 Carbon/Epoxy",
        "layup_angles": [0.0, 45.0, -45.0, 90.0, 90.0, -45.0, 45.0, 0.0],
        "ply_thickness_mm": 0.125,
        "force_nx_n_mm": 100.0,
        "force_ny_n_mm": 50.0,
        "shear_nxy_n_mm": 20.0
    }
    response = client.post("/api/materials/composite-evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["material_name"] == "AS4/3501-6 Carbon/Epoxy"
    assert data["num_plies"] == 8
    assert data["qualification_verdict"] == "PASS"
    assert "effective_engineering_constants" in data
    assert data["effective_engineering_constants"]["ex_gpa"] > 0


def test_api_plm_sync():
    """Tests POST /api/plm/sync."""
    payload = {
        "system_type": "Siemens Teamcenter",
        "item_id": "TEST-PART-100",
        "revision": "A.01",
        "part_name": "Test_Bracket",
        "metadata": {"qualification_verdict": "PASS"},
        "mock_mode": True
    }
    response = client.post("/api/plm/sync", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["item_id"] == "TEST-PART-100"
    assert data["plm_object_uid"].startswith("PLM-")


def test_api_export_etp_docx():
    """Tests POST /api/export/etp/docx."""
    payload = {
        "cad_data": {
            "filename": "TestBracket.step",
            "mass_kg": 0.5,
            "volume_mm3": 185000.0,
            "bounding_box": {"lx": 100.0, "ly": 80.0, "lz": 30.0},
            "center_of_gravity": {"x": 50.0, "y": 40.0, "z": 15.0},
            "material": "Aluminium 6061-T6"
        },
        "mission_profile": {
            "standard_id": "MIL-STD-810H",
            "category": "Metot 514.8",
            "duration_hours_per_axis": 1.0,
            "overall_g_rms": 7.67,
            "psd_breakpoints": [
                {"frequency_hz": 20.0, "psd_g2_hz": 0.04, "slope_db_octave": 0.0},
                {"frequency_hz": 2000.0, "psd_g2_hz": 0.04, "slope_db_octave": 0.0}
            ]
        },
        "classification": "TASNİF DIŞI / UNCLASSIFIED"
    }
    response = client.post("/api/export/etp/docx", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    assert len(response.content) > 1000
