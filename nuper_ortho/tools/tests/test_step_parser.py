import os
import re
import pytest

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(current_dir))
test_assets_dir = os.path.join(root_dir, "test_assets")


def parse_step_entities(step_content: str):
    """
    Kalıcı STEP AP214/AP242 B-Rep ayrıştırıcı yardımcı fonksiyonu.
    (scratch/test_brep.py mantığından kalıcı teste aktarılmıştır)
    """
    points = {}
    for m in re.finditer(
        r"#(\d+)\s*=\s*CARTESIAN_POINT\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*\(\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*\)\s*\)",
        step_content,
    ):
        points[m.group(1)] = (float(m.group(2)), float(m.group(3)), float(m.group(4)))

    cylinders = {}
    for m in re.finditer(
        r"#(\d+)\s*=\s*CYLINDRICAL_SURFACE\s*\(\s*(?:\'[^\']*\'|\$)\s*,\s*#(\d+)\s*,\s*([-\d.eE+]+)\s*\)",
        step_content,
    ):
        cylinders[m.group(1)] = {"axis2_id": m.group(2), "radius": float(m.group(3))}

    faces = re.findall(r"#\d+\s*=\s*ADVANCED_FACE\b", step_content)

    return {
        "points": points,
        "cylinders": cylinders,
        "advanced_face_count": len(faces),
    }


def test_step_parser_aski_kancasi():
    """
    Askı Kulbu 164849_aski_kancasi.stp dosyasının B-Rep unsurlarını doğrular.
    """
    step_path = os.path.join(test_assets_dir, "Askı Kulbu", "164849_aski_kancasi.stp")
    if not os.path.exists(step_path):
        pytest.skip(f"Test dosyası bulunamadı: {step_path}")

    with open(step_path, "r", encoding="latin-1") as f:
        content = f.read()

    res = parse_step_entities(content)

    assert len(res["points"]) > 50, "En az 50 Cartesian Point bulunmalıdır"
    assert res["advanced_face_count"] > 10, "En az 10 Advanced Face bulunmalıdır"
    assert len(res["cylinders"]) > 0, "Silindirik delik/yüzey tespit edilmelidir"


def test_step_parser_anten_kapak():
    """
    Anten Kapak TM.stp modelinin silindir ve yüzey topolojisini doğrular.
    """
    step_path = os.path.join(test_assets_dir, "KPT - 2736 Anten Kapak Tm-TR", "Anten Kapak TM.stp")
    if not os.path.exists(step_path):
        pytest.skip(f"Test dosyası bulunamadı: {step_path}")

    with open(step_path, "r", encoding="latin-1") as f:
        content = f.read()

    res = parse_step_entities(content)

    assert len(res["points"]) > 100
    assert res["advanced_face_count"] >= 18
    # Anten kapak modelinde en az 4 montaj deliği (silindir) bulunmalıdır
    assert len(res["cylinders"]) >= 4
