import pytest
from engine.core.thermal_engine import ThermalEngine


def test_thermal_al6061_steel_bolts_standard():
    """Validates Al 6061 body with Steel 8.8 M4 fasteners under MIL-STD-810H airborne profile."""
    res = ThermalEngine.evaluate_thermal_qualification(
        body_material_name="Aluminium 6061-T6",
        body_cte_per_k=23.0e-6,
        body_elastic_modulus_gpa=68.9,
        body_yield_strength_mpa=275.0,
        dimensions_mm={"length": 120.0, "width": 80.0, "height": 30.0},
        operational_high_c=71.0,
        operational_low_c=-40.0,
        fastener_material_key="Steel Grade 8.8",
        fastener_size="M4",
        grip_length_mm=15.0,
        dynamic_load_per_bolt_n=200.0,
    )

    assert "MIL-STD-810H Method 501.7" in res["standards"]
    assert "MIL-STD-810H Method 502.7" in res["standards"]

    # Expansion checks
    body_exp = res["body_expansion"]
    assert body_exp["hot_delta_mm"]["dx"] > 0
    assert body_exp["cold_delta_mm"]["dx"] < 0

    # Joint thermal checks
    joint = res["joint_thermal_analysis"]
    assert joint["delta_cte_ppm_per_k"] == pytest.approx(10.7, abs=0.1)

    # Hot condition: heating stretches bolt more (positive delta load)
    assert joint["hot_condition"]["delta_load_n"] > 0
    assert joint["hot_condition"]["margin_of_safety_yield"] > 0
    assert joint["hot_condition"]["passed"] is True

    # Cold condition: cooling relaxes bolt preload
    assert joint["cold_condition"]["delta_load_n"] < 0
    assert joint["cold_condition"]["residual_preload_n"] > 0
    assert joint["cold_condition"]["preload_retention_pct"] > 50.0
    assert joint["cold_condition"]["passed"] is True

    assert res["qualification_status"] == "PASS"


def test_thermal_matching_materials():
    """Validates joint when body and fastener have identical CTE (zero differential thermal force)."""
    res = ThermalEngine.evaluate_thermal_qualification(
        body_material_name="Structural Steel 4340",
        body_cte_per_k=12.3e-6,
        body_elastic_modulus_gpa=205.0,
        body_yield_strength_mpa=785.0,
        dimensions_mm={"length": 100.0, "width": 100.0, "height": 20.0},
        operational_high_c=71.0,
        operational_low_c=-40.0,
        fastener_material_key="Steel Grade 8.8",
        fastener_size="M6",
    )

    joint = res["joint_thermal_analysis"]
    assert joint["delta_cte_ppm_per_k"] == pytest.approx(0.0, abs=0.01)
    assert joint["hot_condition"]["delta_load_n"] == pytest.approx(0.0, abs=0.1)
    assert joint["cold_condition"]["delta_load_n"] == pytest.approx(0.0, abs=0.1)
    assert joint["cold_condition"]["preload_retention_pct"] == pytest.approx(100.0, abs=0.1)
    assert res["qualification_status"] == "PASS"


def test_thermal_extreme_cold_relaxation_alert():
    """Tests that very low pre-load with high dynamic load generates a MARGINAL / cold relaxation alert."""
    res = ThermalEngine.evaluate_thermal_qualification(
        body_material_name="Aluminium 6061-T6",
        body_cte_per_k=23.0e-6,
        body_elastic_modulus_gpa=68.9,
        body_yield_strength_mpa=275.0,
        dimensions_mm={"length": 100.0, "width": 50.0, "height": 20.0},
        operational_high_c=71.0,
        operational_low_c=-60.0,
        fastener_material_key="Steel Grade 8.8",
        fastener_size="M3",
        initial_preload_n=800.0,  # low initial pre-load
        dynamic_load_per_bolt_n=1500.0,  # large external dynamic load
    )

    joint = res["joint_thermal_analysis"]
    # Preload relaxation should lower residual load below dynamic load
    assert joint["cold_condition"]["passed"] is False
    assert "COLD_RELAXATION" in res["qualification_status"] or res["qualification_status"] == "FAIL"
