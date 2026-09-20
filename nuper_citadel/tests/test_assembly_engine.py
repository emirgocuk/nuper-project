import os
import pytest
from fastapi.testclient import TestClient

from engine.main import app
from engine.core.assembly_engine import AssemblyEngine
from engine.core.cad_parser import CADParser

TESTS_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_STEP_PATH = os.path.join(TESTS_DIR, "fixtures", "sample_bracket.step")


def test_multi_step_files_assembly():
    """İki STEP dosyasının çoklu montaj olarak birleştirilip kütle ve CoG integrali testi."""
    assert os.path.exists(SAMPLE_STEP_PATH), "Test fixture dosyası eksik!"

    engine = AssemblyEngine(default_density_kg_m3=2700.0)
    
    # 2 adet parçayı montaj olarak analiz et
    result = engine.parse_multi_step_files(
        file_paths=[SAMPLE_STEP_PATH, SAMPLE_STEP_PATH],
        material_mappings={
            os.path.basename(SAMPLE_STEP_PATH): "Aluminium 6061-T6"
        },
        density_mappings={
            os.path.basename(SAMPLE_STEP_PATH): 2700.0
        }
    )

    # 1. Metadata ve Parça Sayısı
    meta = result["metadata"]
    assert meta["is_assembly"] is True
    assert meta["parts_count"] == 2
    assert meta["is_manifold_valid"] is True

    # 2. Montaj Ağacı (Assembly Tree)
    tree = result["assembly_tree"]
    assert len(tree) == 2
    assert tree[0]["part_id"] == "PART-01"
    assert tree[1]["part_id"] == "PART-02"
    assert abs(tree[0]["mass_share_percent"] - 50.0) < 1.0

    # 3. Kütle ve Analitik Bileşik CoG
    phys = result["physical_properties"]
    single_mass = tree[0]["mass_kg"]
    assert abs(phys["mass_kg"] - (2 * single_mass)) < 1e-3
    assert "x" in phys["cog_mm"]
    assert "y" in phys["cog_mm"]
    assert "z" in phys["cog_mm"]

    # 4. Parçalar Arası Cıvata Eşleşmesi (Aynı parça çakıştığı için delikler koaksiyel eşleşir)
    joints = result["inter_part_joints"]
    assert len(joints) >= 1
    assert "joint_id" in joints[0]
    assert "nominal_diameter_mm" in joints[0]
    assert "screw_fit" in joints[0]

    # 5. Tessellation Mesh
    tess = result["tessellation"]
    assert tess["has_mesh"] is True
    assert tess["triangles_count"] > 0


def test_inter_part_joints_logic():
    """Parçalar arası cıvata eşleme algoritmasının tolerans ve sınıflandırma testi."""
    engine = AssemblyEngine()

    mock_parts = [
        {
            "part_id": "PART-01",
            "part_name": "Şasi Gövdesi",
            "holes": [
                {
                    "diameter_mm": 4.2,
                    "center": {"x": 50.0, "y": 50.0, "z": 40.0},
                    "direction": {"x": 0.0, "y": 0.0, "z": 1.0},
                    "screw_fit": "M4 Normal Geçme (ISO 273)"
                },
                {
                    "diameter_mm": 6.5,
                    "center": {"x": 10.0, "y": 10.0, "z": 0.0},
                    "direction": {"x": 0.0, "y": 0.0, "z": 1.0},
                    "screw_fit": "M6 Normal Geçme (ISO 273)"
                }
            ]
        },
        {
            "part_id": "PART-02",
            "part_name": "Üst Kapak",
            "holes": [
                {
                    "diameter_mm": 4.5,
                    "center": {"x": 50.2, "y": 49.9, "z": 45.0},  # 0.2 mm tolerans içinde
                    "direction": {"x": 0.0, "y": 0.0, "z": 1.0},
                    "screw_fit": "M4 Normal Geçme (ISO 273)"
                }
            ]
        }
    ]

    joints, base_holes = engine.match_inter_part_joints(
        parts=mock_parts,
        z_min_base=0.0,
        tolerance_xy_mm=1.0
    )

    # 1 adet parçalar arası ortak cıvata eşleşmeli (Gövde-Kapak M4)
    assert len(joints) == 1
    assert joints[0]["part_a_id"] == "PART-01"
    assert joints[0]["part_b_id"] == "PART-02"
    assert abs(joints[0]["nominal_diameter_mm"] - 4.2) < 0.1
    assert "M4" in joints[0]["screw_fit"]

    # 1 adet taban sabitleme deliği kalmalı (M6 z=0)
    assert len(base_holes) == 1
    assert base_holes[0]["part_id"] == "PART-01"
    assert abs(base_holes[0]["diameter_mm"] - 6.5) < 0.1
    assert "M6" in base_holes[0]["screw_fit"]


def test_api_upload_assembly():
    """POST /api/cad/upload-assembly REST endpoint testi."""
    client = TestClient(app)

    with open(SAMPLE_STEP_PATH, "rb") as f1, open(SAMPLE_STEP_PATH, "rb") as f2:
        files = [
            ("files", ("chassis.step", f1, "application/octet-stream")),
            ("files", ("cover.step", f2, "application/octet-stream")),
        ]
        data = {
            "material_density_kg_m3": "2700.0",
            "material_name": "Aluminium 6061-T6",
        }

        response = client.post("/api/cad/upload-assembly", files=files, data=data)

    assert response.status_code == 200
    res = response.json()

    assert res["metadata"]["is_assembly"] is True
    assert res["metadata"]["parts_count"] == 2
    assert "assembly_tree" in res
    assert len(res["assembly_tree"]) == 2
    assert res["physical_properties"]["mass_kg"] > 0.0
    assert "mounting_interface" in res
    assert "fastener_analysis" in res
