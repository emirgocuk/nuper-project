"""
Nuper Citadel - Phase 5: Golden Benchmark Validation Suite
Tests all 3 defense qualification benchmark cases across all deterministic modules:
1. Aviyonik Şasi Kutusu (Helikopter Aviyonik Bölmesi)
2. Zırhlı Araç Titanyum Sensör Braketi (Taktik Tekerlekli Zırhlı Araç)
3. İHA Kanat Altı Pod Pylon Aksamı (Taktik İHA Kanat Altı)
"""

import json
from pathlib import Path
import pytest

from engine.core.rule_engine import RuleEngine
from engine.core.fixture_engine import FixtureEngine
from engine.core.fatigue_engine import FatigueEngine
from engine.core.fea_exporter import FEAExporter
from engine.core.gdt_bridge import GDTBridge
from engine.core.license_engine import LicenseEngine
from engine.core.feedback_engine import FeedbackEngine

GOLDEN_CASES_PATH = Path(__file__).parent / "golden_benchmarks" / "cases.json"

@pytest.fixture
def golden_cases():
    with open(GOLDEN_CASES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["benchmark_cases"]

def test_case_01_avionics_chassis(golden_cases):
    """Vaka 1: Aviyonik Şasi Kutusu (MIL-STD-810H Cat 20 Helikopter Titreşimi)"""
    case = next(c for c in golden_cases if c["id"] == "CASE-01-AVIONICS-CHASSIS")
    
    rule_engine = RuleEngine()
    fixture_engine = FixtureEngine()
    fatigue_engine = FatigueEngine()
    fea_exporter = FEAExporter()
    gdt_bridge = GDTBridge()

    # 1. Deterministic Rule Engine Evaluation
    eval_result = rule_engine.evaluate_mission_profile(
        platform_name=case["platform_name"],
        payload_mass_kg=case["mass_kg"]
    )
    assert eval_result["platform"]["name"] == case["platform_name"]
    assert eval_result["vibration"]["integrated_grms"] > 0
    assert 0 < eval_result["vibration"]["attenuation_factor"] <= 1.0

    # 2. Fixture Resonance Envelope Check
    fixture_res = fixture_engine.calculate_envelope(
        part_mass_kg=case["mass_kg"],
        bounding_box={"lx": case["dimensions_mm"][0], "ly": case["dimensions_mm"][1], "lz": case["dimensions_mm"][2]},
        overturning_moment_arm_mm=case["hcg_mm"],
        max_test_frequency_hz=2000.0,
        shaker_grid_pitch_mm=50.0,
        safety_factor=1.20
    )
    assert fixture_res.target_frequency_hz >= case["acceptance_criteria"]["min_fixture_natural_freq_hz"]
    assert fixture_res.recommended_option is not None
    assert fixture_res.recommended_option.recommended_thickness_mm >= 15.0

    # 3. Steinberg 3-Band Cumulative Fatigue Damage
    fatigue_res = fatigue_engine.evaluate_vibration_fatigue(
        resonant_freq_hz=180.0,
        rms_stress_1sigma_mpa=25.0,
        test_duration_seconds=float(case["test_duration_sec"]),
        basquin_a_mpa=490.0,
        basquin_b_exponent=-0.108,
        yield_strength_mpa=275.0
    )
    assert fatigue_res["fatigue_results"]["cumulative_damage_index_D"] <= case["acceptance_criteria"]["max_cumulative_damage_miner"]
    assert fatigue_res["overall_qualification_verdict"] == "PASS"

    # 4. ASME Y14.5 CMM True Position & Flatness Inspection
    cmm_holes = [
        {"hole_id": "H1", "nominal_x": 20.0, "nominal_y": 20.0, "nominal_diameter": 6.5, "measured_x": 20.04, "measured_y": 20.02, "measured_diameter": 6.55, "position_tolerance_mm": 0.25},
        {"hole_id": "H2", "nominal_x": 220.0, "nominal_y": 20.0, "nominal_diameter": 6.5, "measured_x": 219.95, "measured_y": 20.03, "measured_diameter": 6.53, "position_tolerance_mm": 0.25},
        {"hole_id": "H3", "nominal_x": 20.0, "nominal_y": 140.0, "nominal_diameter": 6.5, "measured_x": 20.02, "measured_y": 139.96, "measured_diameter": 6.54, "position_tolerance_mm": 0.25},
        {"hole_id": "H4", "nominal_x": 220.0, "nominal_y": 140.0, "nominal_diameter": 6.5, "measured_x": 220.05, "measured_y": 140.04, "measured_diameter": 6.56, "position_tolerance_mm": 0.25}
    ]
    cmm_res = gdt_bridge.evaluate_cmm_inspection(
        holes=cmm_holes,
        flatness_points_z=[0.01, 0.03, -0.01, 0.02],
        flatness_tolerance_mm=case["acceptance_criteria"]["max_flatness_mm"]
    )
    assert cmm_res["overall_status"] == "CONFORMANT"
    assert cmm_res["surface_flatness"]["is_conformant"] is True

    # 5. Discrete 120-pt FEA PSD Export
    csv_data = fea_exporter.generate_nx_ansys_csv(
        platform_name=case["platform_name"],
        standard_code="MIL-STD-810H",
        category="Cat 20",
        target_grms=eval_result["vibration"]["integrated_grms"],
        breakpoints=eval_result["vibration"]["breakpoints"],
        num_points=120
    )
    lines = csv_data.strip().split("\n")
    assert len(lines) >= 121

def test_case_02_armored_sensor_bracket(golden_cases):
    """Vaka 2: Zırhlı Araç Titanyum Sensör Braketi (MIL-STD-810H Cat 4 Kara Aracı)"""
    case = next(c for c in golden_cases if c["id"] == "CASE-02-ARMORED-SENSOR-BRACKET")
    
    rule_engine = RuleEngine()
    fixture_engine = FixtureEngine()
    fatigue_engine = FatigueEngine()
    gdt_bridge = GDTBridge()

    eval_result = rule_engine.evaluate_mission_profile(
        platform_name=case["platform_name"],
        payload_mass_kg=case["mass_kg"]
    )
    assert eval_result["platform"]["name"] == case["platform_name"]
    assert eval_result["vibration"]["integrated_grms"] > 0.50

    fixture_res = fixture_engine.calculate_envelope(
        part_mass_kg=case["mass_kg"],
        bounding_box={"lx": case["dimensions_mm"][0], "ly": case["dimensions_mm"][1], "lz": case["dimensions_mm"][2]},
        overturning_moment_arm_mm=case["hcg_mm"],
        max_test_frequency_hz=2000.0,
        shaker_grid_pitch_mm=50.0,
        safety_factor=1.20
    )
    assert fixture_res.target_frequency_hz >= 2400.0

    fatigue_res = fatigue_engine.evaluate_vibration_fatigue(
        resonant_freq_hz=220.0,
        rms_stress_1sigma_mpa=35.0,
        test_duration_seconds=float(case["test_duration_sec"]),
        basquin_a_mpa=1100.0,
        basquin_b_exponent=-0.095,
        yield_strength_mpa=880.0
    )
    assert fatigue_res["fatigue_results"]["cumulative_damage_index_D"] <= case["acceptance_criteria"]["max_cumulative_damage_miner"]
    assert fatigue_res["overall_qualification_verdict"] == "PASS"

    # Precision CMM check
    cmm_holes = [
        {"hole_id": "H1", "nominal_x": 15.0, "nominal_y": 32.5, "nominal_diameter": 8.5, "measured_x": 15.02, "measured_y": 32.51, "measured_diameter": 8.52, "position_tolerance_mm": 0.15},
        {"hole_id": "H2", "nominal_x": 95.0, "nominal_y": 32.5, "nominal_diameter": 8.5, "measured_x": 94.98, "measured_y": 32.49, "measured_diameter": 8.53, "position_tolerance_mm": 0.15}
    ]
    cmm_res = gdt_bridge.evaluate_cmm_inspection(
        holes=cmm_holes,
        flatness_points_z=[0.005, 0.012, -0.008],
        flatness_tolerance_mm=case["acceptance_criteria"]["max_flatness_mm"]
    )
    assert cmm_res["overall_status"] == "CONFORMANT"

def test_case_03_uav_wing_pylon(golden_cases):
    """Vaka 3: İHA Kanat Altı Pod Pylon Aksamı (Aşırı Devrilme Momenti & Yüksek Kütle Zayıflatması)"""
    case = next(c for c in golden_cases if c["id"] == "CASE-03-UAV-WING-PYLON")
    
    rule_engine = RuleEngine()
    fixture_engine = FixtureEngine()
    fatigue_engine = FatigueEngine()

    eval_result = rule_engine.evaluate_mission_profile(
        platform_name=case["platform_name"],
        payload_mass_kg=case["mass_kg"]
    )
    assert eval_result["platform"]["name"] == case["platform_name"]
    # 52 kg mass causes notable attenuation on UAV wing (nominal 20 kg threshold)
    assert eval_result["vibration"]["attenuation_factor"] < 0.90

    # Overturning moment flag check (hcg = 120.0 mm high overturning arm)
    fixture_res = fixture_engine.calculate_envelope(
        part_mass_kg=case["mass_kg"],
        bounding_box={"lx": 100.0, "ly": 100.0, "lz": 180.0},
        overturning_moment_arm_mm=120.0,
        max_test_frequency_hz=2000.0,
        shaker_grid_pitch_mm=50.0,
        safety_factor=1.20
    )
    assert fixture_res.overturning_moment_warning is True
    assert "Kritik devrilme momenti" in fixture_res.overturning_moment_note

    # Cumulative fatigue under high stress
    fatigue_res = fatigue_engine.evaluate_vibration_fatigue(
        resonant_freq_hz=140.0,
        rms_stress_1sigma_mpa=40.0,
        test_duration_seconds=float(case["test_duration_sec"]),
        basquin_a_mpa=600.0,
        basquin_b_exponent=-0.115,
        yield_strength_mpa=503.0
    )
    assert fatigue_res["fatigue_results"]["cumulative_damage_index_D"] <= case["acceptance_criteria"]["max_cumulative_damage_miner"]

def test_enterprise_licensing_and_feedback_integrity(tmp_path):
    """Yerel RSA-2048 Lisanslama & SQLite DPO Geri Besleme Döngü Bütünlüğü"""
    # 1. License Engine Lifecycle
    priv_pem, pub_pem = LicenseEngine.generate_rsa_keypair()
    hw_id = LicenseEngine.get_hardware_fingerprint()
    assert hw_id.startswith("NUPER-")

    payload = {
        "company_name": "TUSAŞ - Türk Havacılık ve Uzay Sanayii A.Ş.",
        "license_type": "ENTERPRISE",
        "machine_id": hw_id,
        "expiry_date": "2030-12-31",
        "features": ["CAD_PARSER", "RULE_ENGINE", "FEA_EXPORT", "LOCAL_LLM", "FIXTURE_DESIGN"]
    }

    signed_token = LicenseEngine.create_signed_license(payload, priv_pem)
    assert len(signed_token) > 50

    lic_engine = LicenseEngine(public_key_pem=pub_pem)
    verified = lic_engine.verify_license(signed_token)
    assert verified["valid"] is True
    assert verified["company_name"] == "TUSAŞ - Türk Havacılık ve Uzay Sanayii A.Ş."
    assert verified["license_type"] == "ENTERPRISE"

    # 2. Feedback Telemetry Lifecycle (DPO)
    db_file = tmp_path / "telemetry_test.db"
    fb_engine = FeedbackEngine(db_path=str(db_file))
    
    rec_id = fb_engine.record_feedback(
        feature_area="GOLDEN_BENCHMARK",
        prompt_context={"case_id": "CASE-01", "standard": "MIL-STD-810H Method 514.8"},
        rejected_text="The vibration level is normal and should pass.",
        chosen_text="MIL-STD-810H Cat 20 requires 4.12 g_rms with Steinberg D=0.088 <= 0.20.",
        engineer_rating=5,
        engineer_notes="Corrected generic statement with exact analytical numbers.",
        tags=["MIL-STD-810H", "RotaryWing", "MinerD"]
    )
    assert rec_id > 0

    stats = fb_engine.get_stats()
    assert stats["total_feedback_records"] == 1
    assert stats["average_rating"] == 5.0
