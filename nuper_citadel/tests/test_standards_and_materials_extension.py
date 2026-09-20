import uuid
import pytest
from fastapi.testclient import TestClient
from engine.main import app
from engine.core.rule_engine import RuleEngine

client = TestClient(app)


def test_platforms_list_and_filter():
    engine = RuleEngine()
    all_platforms = engine.list_platforms()
    assert len(all_platforms) >= 8

    do160_platforms = engine.list_platforms(standard_filter="DO-160G")
    assert len(do160_platforms) >= 3
    for p in do160_platforms:
        assert "DO-160G" in p["standard_code"]

    stanag_platforms = engine.list_platforms(standard_filter="STANAG")
    assert len(stanag_platforms) >= 2
    for p in stanag_platforms:
        assert "STANAG" in p["standard_code"]

    mil_platforms = engine.list_platforms(standard_filter="MIL-STD-810H")
    assert len(mil_platforms) >= 3


def test_do160g_and_stanag_profile_evaluation():
    engine = RuleEngine()
    do160_platforms = engine.list_platforms(standard_filter="DO-160G")
    plat_id = do160_platforms[0]["id"]

    res = engine.evaluate_profile(platform_id=plat_id, part_mass_kg=2.5)
    assert res["platform"]["standard"] == "RTCA DO-160G"
    assert res["vibration"]["integrated_grms"] > 0
    assert len(res["vibration"]["breakpoints"]) >= 4
    assert res["temperature"]["operational_high_c"] >= 55.0
    assert res["shock"]["peak_acceleration_g"] > 0


def test_expanded_materials_list():
    engine = RuleEngine()
    materials = engine.list_materials()
    mat_names = [m["name"] for m in materials]

    expected_new = [
        "Kovar (Fe-Ni29-Co17)",
        "Invar 36 (Fe-Ni36)",
        "Inconel 718 (Nickel Superalloy)",
        "Beryllium Copper CuBe2 (C17200)",
        "PEEK (Polyetheretherketone)",
        "Carbon Fiber CFRP (Quasi-Isotropic)",
    ]
    for exp in expected_new:
        assert exp in mat_names, f"{exp} bulunamadı!"

    kovar = engine.get_material("Kovar (Fe-Ni29-Co17)")
    assert kovar["density_kg_m3"] == 8360.0
    assert kovar["yield_strength_mpa"] == 340.0

    inconel = engine.get_material("Inconel 718 (Nickel Superalloy)")
    assert inconel["yield_strength_mpa"] == 1100.0


def test_custom_platform_and_material_api():
    unique_suffix = uuid.uuid4().hex[:6]
    plat_name = f"ASELSAN Özel Test Kutusu {unique_suffix}"
    mat_name = f"Titanyum Alüminid TiAl-{unique_suffix}"

    # 1. Custom Platform Creation
    custom_plat_payload = {
        "platform_name": plat_name,
        "platform_category": "CUSTOM_AVIONICS",
        "standard_code": "ASELSAN MYS-101",
        "description": "ASELSAN şirket içi zorlu çevre koşulları standart profili",
        "vibration": {
            "method_code": "MYS-101 Sec 4",
            "category_id": 101,
            "annex_figure": "Figure MYS-4.1",
            "duration_per_axis_minutes": 45,
            "axes": "X,Y,Z",
            "mass_attenuation_applicable": False,
            "breakpoints": [
                {"frequency_hz": 15.0, "psd_value": 0.015, "slope_db_oct": 3.0},
                {"frequency_hz": 80.0, "psd_value": 0.050, "slope_db_oct": 0.0},
                {"frequency_hz": 600.0, "psd_value": 0.050, "slope_db_oct": -6.0},
                {"frequency_hz": 2000.0, "psd_value": 0.005, "slope_db_oct": 0.0},
            ]
        },
        "temperature": {
            "climatic_category": "Şirket İçi Ekstrem",
            "operational_high_c": 75.0,
            "storage_high_c": 85.0,
            "operational_low_c": -45.0,
            "storage_low_c": -55.0,
        },
        "shock": {
            "procedure_name": "Şok Prosedürü",
            "pulse_shape": "Sawtooth",
            "peak_acceleration_g": 30.0,
            "duration_ms": 11.0,
            "num_shocks_per_axis": 6,
        }
    }

    resp = client.post("/api/standards/custom", json=custom_plat_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "created"
    custom_id = data["id"]

    # Check listing with filter
    filter_resp = client.get("/api/platforms?standard=ASELSAN")
    assert filter_resp.status_code == 200
    filter_data = filter_resp.json()
    assert any(p["name"] == plat_name for p in filter_data)

    # 2. Custom Material Creation
    custom_mat_payload = {
        "name": mat_name,
        "category": "INTERMETALLIC_ALLOY",
        "density_kg_m3": 3900.0,
        "elastic_modulus_gpa": 170.0,
        "poissons_ratio": 0.26,
        "yield_strength_mpa": 450.0,
        "ultimate_strength_mpa": 550.0,
        "cte_per_k": 11.0e-6,
        "basquin_a_mpa": 680.0,
        "basquin_b_exponent": -0.090,
        "description": "Türbin kanatçıkları için hafif intermetalik titanyum alüminid."
    }

    mat_resp = client.post("/api/materials/custom", json=custom_mat_payload)
    assert mat_resp.status_code == 200
    mat_data = mat_resp.json()
    assert mat_data["status"] == "created"

    # Verify material in list
    all_mat_resp = client.get("/api/materials")
    assert all_mat_resp.status_code == 200
    all_mats = all_mat_resp.json()
    assert any(m["name"] == mat_name for m in all_mats)
