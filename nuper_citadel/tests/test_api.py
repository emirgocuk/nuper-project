import os
import pytest
from fastapi.testclient import TestClient

from engine.main import app

client = TestClient(app)
SAMPLE_STEP = os.path.join(os.path.dirname(__file__), "fixtures", "sample_bracket.step")


def test_root_endpoint():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["engine"] == "Nuper Citadel"
    assert data["status"] == "online"


def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["standards_db_connected"] is True
    assert data["materials_db_connected"] is True


def test_platforms_endpoint():
    resp = client.get("/api/platforms")
    assert resp.status_code == 200
    platforms = resp.json()
    assert len(platforms) >= 3
    names = [p["name"] for p in platforms]
    assert any("Taktik İHA" in n for n in names)


def test_materials_endpoint():
    resp = client.get("/api/materials")
    assert resp.status_code == 200
    materials = resp.json()
    assert len(materials) >= 5
    mat_names = [m["name"] for m in materials]
    assert any("Aluminium 6061-T6" in m for m in mat_names)
    assert any("Alumec 89" in m for m in mat_names)


def test_cad_parse_endpoint():
    assert os.path.exists(SAMPLE_STEP)
    resp = client.post(
        "/api/cad/parse",
        json={"step_file_path": SAMPLE_STEP, "material_density_kg_m3": 2700.0},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["metadata"]["is_manifold_valid"] is True
    assert data["physical_properties"]["volume_mm3"] > 50000.0
    assert data["physical_properties"]["mass_kg"] > 0.20
    assert data["mounting_interface"]["detected_holes_count"] == 4
    assert abs(data["bounding_box_mm"]["length_x"] - 120.0) < 1.0


def test_rules_evaluate_endpoint():
    # Platform 1: Taktik İHA Kanat Altı (Cat 14)
    resp = client.post(
        "/api/rules/evaluate",
        json={"platform_id": 1, "part_mass_kg": 0.385},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "İHA" in data["platform_name"]
    assert data["vibration_profile"] is not None
    assert len(data["vibration_profile"]["breakpoints"]) == 4
    assert data["temperature_profile"]["operational_high_c"] == 71.0
    assert data["shock_profile"]["peak_acceleration_g"] == 40.0


def test_fea_export_psd_endpoint():
    resp = client.post(
        "/api/fea/export-psd",
        json={
            "platform_name": "Taktik İHA",
            "standard_code": "MIL-STD-810H",
            "category": "Cat 14",
            "target_grms": 7.70,
            "breakpoints": [
                {"frequency_hz": 20.0, "psd_value": 0.0053},
                {"frequency_hz": 150.0, "psd_value": 0.0400},
                {"frequency_hz": 1000.0, "psd_value": 0.0400},
                {"frequency_hz": 2000.0, "psd_value": 0.0100},
            ],
            "num_points": 120,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "Frequency(Hz),PSD(g^2/Hz)" in data["csv_content"]
    assert "*DIM,NUPER_PSD" in data["apdl_snippet"]


def test_fatigue_calculate_endpoint():
    resp = client.post(
        "/api/fatigue/calculate",
        json={
            "resonant_freq_hz": 250.0,
            "rms_stress_1sigma_mpa": 20.0,
            "test_duration_seconds": 3600.0,
            "material_name": "Aluminium 6061-T6",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["overall_qualification_verdict"] == "PASS"
    assert data["fatigue_results"]["cumulative_damage_index_D"] < 0.20


def test_fixture_envelope_endpoint():
    resp = client.post(
        "/api/fixture/envelope",
        json={
            "part_mass_kg": 0.385,
            "bounding_box": {"lx": 120.0, "ly": 85.0, "lz": 45.0},
            "overturning_moment_arm_mm": 22.5,
            "max_test_frequency_hz": 2000.0,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["target_frequency_hz"] == 2400.0
    assert data["recommended_option"] is not None
    assert "Alumec 89" in data["recommended_option"]["material_name"]
    assert data["recommended_option"]["recommended_thickness_mm"] >= 20.0


def test_machine_id_endpoint():
    resp = client.get("/api/license/machine-id")
    assert resp.status_code == 200
    data = resp.json()
    assert data["machine_id"].startswith("NUPER-")
    assert data["status"] == "air_gapped_hardware_locked"


def test_gdt_verify_cmm_endpoint():
    resp = client.post(
        "/api/gdt/verify-cmm",
        json={
            "holes": [
                {"hole_id": "H1", "nominal_x": 20.0, "nominal_y": 15.0, "measured_x": 20.02, "measured_y": 15.02, "nominal_diameter": 4.5, "measured_diameter": 4.51},
                {"hole_id": "H2", "nominal_x": 100.0, "nominal_y": 15.0, "measured_x": 100.01, "measured_y": 15.02, "nominal_diameter": 4.5, "measured_diameter": 4.50},
            ],
            "flatness_points_z": [0.01, 0.02, -0.01],
            "flatness_tolerance_mm": 0.08,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["overall_status"] == "CONFORMANT"
    assert data["total_holes_evaluated"] == 2
    assert data["surface_flatness"]["is_conformant"] is True

