import os
import pytest
from engine.core.cad_parser import CADParser

TESTS_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_STEP_PATH = os.path.join(TESTS_DIR, "fixtures", "sample_bracket.step")


def test_cad_parser_with_sample_bracket():
    assert os.path.exists(SAMPLE_STEP_PATH), "Test STEP fixture dosyası eksik!"

    parser = CADParser(default_density_kg_m3=2700.0)
    result = parser.parse_step(SAMPLE_STEP_PATH, material_name="Aluminium 6061-T6")

    # 1. Metadata ve Manifold Kontrolü
    meta = result["metadata"]
    assert meta["file_name"] == "sample_bracket.step"
    assert meta["density_kg_m3"] == 2700.0
    assert meta["is_manifold_valid"] is True
    assert meta["assembly"]["is_assembly"] is False

    # 2. Fiziksel ve Kütle Özellikleri
    phys = result["physical_properties"]
    assert phys["volume_mm3"] > 50000.0
    assert 0.20 <= phys["mass_kg"] <= 0.60  # Alüminyum braket ~0.35 kg civarında olmalı
    assert "x" in phys["cog_mm"]
    assert "y" in phys["cog_mm"]
    assert "z" in phys["cog_mm"]

    # 3. Bounding Box (120 x 85 x 45 mm civarında olmalı)
    bbox = result["bounding_box_mm"]
    assert abs(bbox["length_x"] - 120.0) < 1.0
    assert abs(bbox["width_y"] - 85.0) < 1.0
    assert abs(bbox["height_z"] - 45.0) < 1.0

    # 4. Montaj Delikleri ve Devrilme Kolu
    mount = result["mounting_interface"]
    assert mount["overturning_moment_arm_h_cg_mm"] > 0.0
    assert mount["detected_holes_count"] == 4

    # Delik çapı 4.2 mm (M4 Normal Geçme) olmalı
    for hole in mount["holes"]:
        assert abs(hole["diameter_mm"] - 4.2) < 0.2
        assert "M4" in hole["screw_fit"]

    # Delik açıklığı (Span)
    assert abs(mount["pattern_span_x_mm"] - 90.0) < 2.0
    assert abs(mount["pattern_span_y_mm"] - 55.0) < 2.0
    assert mount["diagonal_span_mm"] > 100.0


def test_cad_parser_file_not_found():
    parser = CADParser()
    with pytest.raises(FileNotFoundError):
        parser.parse_step("non_existent_file.step")
