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


def test_compute_angular_coverage_fillet_rejection():
    import math
    # 90° köşe kavisi (fillet) -> 90° (< 270°) elenmeli
    cov_fillet = CADParser._compute_angular_coverage([(0.0, math.pi / 2.0)])
    assert cov_fillet < 270.0
    assert abs(cov_fillet - 90.0) <= 1.0

    # Aynı eksende üst üste binmiş 4 adet 90° köşe kavisi -> Net kapalılık 90° kalmalı (< 270°)
    cov_stacked = CADParser._compute_angular_coverage([
        (0.0, math.pi / 2.0),
        (0.0, math.pi / 2.0),
        (0.0, math.pi / 2.0),
        (0.0, math.pi / 2.0)
    ])
    assert cov_stacked < 270.0
    assert abs(cov_stacked - 90.0) <= 1.0

    # Tek parçada 360° tam silindir -> 360° (>= 270°) kabul edilmeli
    cov_full = CADParser._compute_angular_coverage([(0.0, 2.0 * math.pi)])
    assert cov_full >= 270.0
    assert cov_full == 360.0

    # 180°'lik iki yarı silindirden oluşan delik -> 360° (>= 270°) kabul edilmeli
    cov_split = CADParser._compute_angular_coverage([
        (0.0, math.pi),
        (math.pi, 2.0 * math.pi)
    ])
    assert cov_split >= 270.0
    assert cov_split == 360.0


def test_cad_fillet_rejection_on_real_models():
    """cad_models dizini mevcutsa gerçek modeller üzerinde köşe radyüsü elemesini doğrular."""
    parser = CADParser()
    cad_dir = os.path.join(os.path.dirname(TESTS_DIR), "cad_models")
    if not os.path.isdir(cad_dir):
        pytest.skip("cad_models dizini bulunamadı.")

    # 1. ROLE BAGLANTI PARCA: Teknik resme göre tam 4 delik (2x M4, 2x M3)
    role_step = os.path.join(cad_dir, "ROLE BAGLANTI PARCA_AA (1).stp")
    if os.path.exists(role_step):
        res = parser.parse_step(role_step)
        assert res["mounting_interface"]["detected_holes_count"] == 4

    # 2. Anten Kapak TM: 2 montaj deliği
    anten_step = os.path.join(cad_dir, "Anten Kapak TM.stp")
    if os.path.exists(anten_step):
        res = parser.parse_step(anten_step)
        assert res["mounting_interface"]["detected_holes_count"] == 2

    # 3. kartTutucuUstKapak: Ceplerdeki 15 adet R=6.35mm (D=12.7) ve R=4/5mm köşe kavisleri elenmeli
    kart_step = os.path.join(cad_dir, "kartTutucuUstKapak_TM_LGK (1) (1).stp")
    if os.path.exists(kart_step):
        res = parser.parse_step(kart_step)
        holes = res["mounting_interface"]["holes"]
        # Hiçbir delik D=12.7 (cep köşe kavisi) veya D=10.0 (cep geçiş kavisi) olmamalı
        fillet_diameters = [h["diameter_mm"] for h in holes if abs(h["diameter_mm"] - 12.7) < 0.1 or abs(h["diameter_mm"] - 10.0) < 0.1]
        assert len(fillet_diameters) == 0, f"Köşe kavisleri delik olarak algılandı: {fillet_diameters}"

