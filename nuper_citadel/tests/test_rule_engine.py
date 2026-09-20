import pytest
from engine.core.rule_engine import RuleEngine


def test_list_platforms():
    re = RuleEngine()
    platforms = re.list_platforms()
    assert len(platforms) >= 3
    names = [p["platform_name"] for p in platforms]
    assert "Taktik İHA Kanat Altı" in names
    assert "Taktik Tekerlekli Zırhlı Araç" in names


def test_evaluate_uav_wing_profile():
    re = RuleEngine()
    profile = re.evaluate_mission_profile("Taktik İHA Kanat Altı")

    assert profile["platform"]["standard"] == "MIL-STD-810H"
    assert profile["vibration"]["category"] == "Category 14"
    assert profile["vibration"]["nominal_grms"] == 7.70
    # Doğrulanan analitik log-log integrali 7.5 - 7.8 grms arasında olmalıdır
    assert abs(profile["vibration"]["integrated_grms"] - 7.70) < 0.20
    assert profile["vibration"]["duration_per_axis_minutes"] == 60
    assert len(profile["vibration"]["breakpoints"]) == 4

    # Sıcaklık kontrolü
    assert profile["temperature"]["operational_high_c"] == 71.0
    assert profile["temperature"]["operational_low_c"] == -40.0

    # Şok kontrolü
    assert profile["shock"]["peak_acceleration_g"] == 40.0
    assert profile["shock"]["duration_ms"] == 11.0


def test_mass_attenuation():
    re = RuleEngine()
    # Hafif parça (10 kg): Zayıflatma olmamalı
    light = re.evaluate_mission_profile("Taktik İHA Kanat Altı", payload_mass_kg=10.0)
    assert light["vibration"]["attenuation_factor"] == 1.0

    # Ağır parça (50 kg): (20/50)^0.15 ~= 0.871
    heavy = re.evaluate_mission_profile("Taktik İHA Kanat Altı", payload_mass_kg=50.0)
    assert heavy["vibration"]["attenuation_factor"] < 1.0
    assert heavy["vibration"]["effective_grms"] < heavy["vibration"]["nominal_grms"]


def test_materials_query():
    re = RuleEngine()
    mat = re.get_material("Aluminium 6061-T6")
    assert mat["yield_strength_mpa"] == 275.0
    assert mat["density_kg_m3"] == 2700.0
    assert mat["basquin_b_exponent"] < 0
