import pytest
from engine.core.fixture_engine import FixtureEngine


def test_fixture_engine_basic_envelope():
    engine = FixtureEngine()
    res = engine.calculate_envelope(
        part_mass_kg=0.5,
        bounding_box={"lx": 100.0, "ly": 80.0, "lz": 40.0},
        mounting_holes=[
            {"diameter_mm": 4.5, "center_x": 10.0, "center_y": 10.0, "center_z": 0.0},
            {"diameter_mm": 4.5, "center_x": 90.0, "center_y": 10.0, "center_z": 0.0},
            {"diameter_mm": 4.5, "center_x": 10.0, "center_y": 70.0, "center_z": 0.0},
            {"diameter_mm": 4.5, "center_x": 90.0, "center_y": 70.0, "center_z": 0.0},
        ],
        overturning_moment_arm_mm=20.0,
        max_test_frequency_hz=2000.0,
        shaker_grid_pitch_mm=50.0,
        shaker_bolt_size="M10",
        safety_factor=1.20,
    )

    assert res.target_frequency_hz == 2400.0
    assert res.fixture_dimensions_mm["length"] >= 150.0
    assert res.fixture_dimensions_mm["width"] >= 150.0
    # Must be multiple of 50mm
    assert res.fixture_dimensions_mm["length"] % 50.0 == 0
    assert res.fixture_dimensions_mm["width"] % 50.0 == 0

    assert res.recommended_option is not None
    assert res.recommended_option.material_name.startswith("Alumec 89")
    assert res.recommended_option.actual_first_mode_hz >= 2400.0
    assert res.recommended_option.recommended_thickness_mm >= res.recommended_option.min_thickness_mm

    # Verify C45 carbon steel alternative exists
    c45_opt = next((opt for opt in res.alternative_options if "C45" in opt.material_name), None)
    assert c45_opt is not None
    assert c45_opt.estimated_fixture_mass_kg > res.recommended_option.estimated_fixture_mass_kg


def test_fixture_engine_overturning_moment_warning():
    engine = FixtureEngine()
    # High overturning arm: hcg = 120 mm on a compact part
    res = engine.calculate_envelope(
        part_mass_kg=2.0,
        bounding_box={"lx": 60.0, "ly": 60.0, "lz": 150.0},
        overturning_moment_arm_mm=100.0,
        max_test_frequency_hz=2000.0,
        shaker_grid_pitch_mm=50.0,
    )

    # Base min dim will be 150mm. 100mm > 0.40 * 150 (60mm) -> should trigger warning!
    assert res.overturning_moment_warning is True
    assert "Kritik devrilme momenti" in res.overturning_moment_note
    assert any("devrilme momenti" in d for d in res.directives)
