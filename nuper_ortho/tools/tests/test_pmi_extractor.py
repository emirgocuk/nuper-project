import os
import pytest
from tools.extractor.pmi_extractor import parse_step_pmi


def test_parse_step_pmi_synthetic_snippet():
    mock_step_ap242 = """
    ISO-10303-21;
    HEADER;
    FILE_SCHEMA(('AP242_MANAGED_MODEL_BASED_3D_ENGINEERING_MIM_LF { 1 0 10303 442 3 1 4 }'));
    ENDSEC;
    DATA;
    #10=DATUM('A',(#11),$,#12,.T.,'DATUM_A');
    #20=DATUM('B',(#21),$,#22,.T.,'DATUM_B');
    #30=FLATNESS_TOLERANCE('FLATNESS_01',$,0.015,#10);
    #40=POSITION_TOLERANCE('POS_HOLES',$,0.050,#50);
    #60=DEFAULT_MODEL_GEOMETRIC_VIEW('Isometric','',#61,#62,'','',#63,*);
    #70=MODEL_GEOMETRIC_VIEW('Top','',#71,#72);
    ENDSEC;
    END-ISO-10303-21;
    """

    res = parse_step_pmi(mock_step_ap242, is_content=True)

    assert res["success"] is True
    assert res["is_ap242"] is True
    assert res["has_semantic_pmi"] is True

    # Check Datums
    labels = [d["label"] for d in res["datums"]]
    assert "A" in labels
    assert "B" in labels

    # Check Tolerances
    tol_types = [t["type"] for t in res["geometric_tolerances"]]
    assert "FLATNESS" in tol_types
    assert "POSITION" in tol_types

    flatness = next(t for t in res["geometric_tolerances"] if t["type"] == "FLATNESS")
    assert abs(flatness["value"] - 0.015) < 1e-4

    pos = next(t for t in res["geometric_tolerances"] if t["type"] == "POSITION")
    assert abs(pos["value"] - 0.050) < 1e-4

    # Check Saved Views
    view_names = [v["name"] for v in res["saved_views"]]
    assert "Isometric" in view_names
    assert "Top" in view_names


def test_parse_step_pmi_on_real_asset():
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    step_file = os.path.join(root, "test_assets", "BENCH_LAB", "specimens", "01_STRUCTURAL_HOOKS_CASES_BENCH_004", "model.stp")
    if not os.path.exists(step_file):
        pytest.skip("Test asset missing")

    res = parse_step_pmi(step_file)
    assert res["success"] is True
    assert "has_semantic_pmi" in res
