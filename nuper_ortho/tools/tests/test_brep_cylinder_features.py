import os
import sys
import tempfile

import pytest

current_dir = os.path.dirname(os.path.abspath(__file__))
tools_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(tools_dir)
for path in (tools_dir, root_dir):
    if path not in sys.path:
        sys.path.insert(0, path)

from extractor.brep_verifier import OCP_AVAILABLE, extract_cad_metadata_ocp

pytestmark = pytest.mark.skipif(not OCP_AVAILABLE, reason="OCP mevcut değil")


def _write_plate_step(path: str) -> None:
    from OCP.BRepAlgoAPI import BRepAlgoAPI_Cut
    from OCP.BRepFilletAPI import BRepFilletAPI_MakeFillet
    from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCylinder
    from OCP.STEPControl import STEPControl_AsIs, STEPControl_Writer
    from OCP.TopAbs import TopAbs_EDGE
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopoDS import TopoDS
    from OCP.BRepAdaptor import BRepAdaptor_Curve
    from OCP.gp import gp_Ax2, gp_Dir, gp_Pnt

    shape = BRepPrimAPI_MakeBox(gp_Pnt(-30.0, 0.0, -20.0), 60.0, 5.0, 40.0).Shape()

    fillet = BRepFilletAPI_MakeFillet(shape)
    edge_exp = TopExp_Explorer(shape, TopAbs_EDGE)
    while edge_exp.More():
        edge = TopoDS.Edge(edge_exp.Current())
        curve = BRepAdaptor_Curve(edge)
        a = curve.Value(curve.FirstParameter())
        b = curve.Value(curve.LastParameter())
        if abs(a.X() - b.X()) < 1e-6 and abs(a.Z() - b.Z()) < 1e-6:
            fillet.Add(2.0, edge)
        edge_exp.Next()
    shape = fillet.Shape()

    for hx in (-20.0, 20.0):
        for hz in (-10.0, 10.0):
            cyl = BRepPrimAPI_MakeCylinder(gp_Ax2(gp_Pnt(hx, -1.0, hz), gp_Dir(0, 1, 0)), 1.5, 7.0).Shape()
            shape = BRepAlgoAPI_Cut(shape, cyl).Shape()

    writer = STEPControl_Writer()
    writer.Transfer(shape, STEPControl_AsIs)
    writer.Write(path)


def test_symmetric_holes_stay_separate_and_fillets_are_not_holes():
    with tempfile.TemporaryDirectory() as tmp:
        step_path = os.path.join(tmp, "plate.stp")
        _write_plate_step(step_path)
        meta = extract_cad_metadata_ocp(step_path)

    holes = [f for f in meta["features"] if f["feature_type"] == "INTERNAL_CYLINDER"]
    assert len(holes) == 4

    xz = sorted((round(abs(h["center"][0]), 2), round(abs(h["center"][2]), 2)) for h in holes)
    assert sorted(set(xz)) in ([(10.0, 20.0)], [(20.0, 10.0)])

    signed = {(round(h["center"][0], 1), round(h["center"][2], 1)) for h in holes}
    assert len(signed) == 4
    assert all(h["nominal_dimension"] == 3.0 for h in holes)


def test_hole_axis_point_lies_on_axis_not_part_center():
    with tempfile.TemporaryDirectory() as tmp:
        step_path = os.path.join(tmp, "plate.stp")
        _write_plate_step(step_path)
        meta = extract_cad_metadata_ocp(step_path)

    holes = [f for f in meta["features"] if f["feature_type"] == "INTERNAL_CYLINDER"]
    assert not any(abs(h["center"][0]) < 1.0 and abs(h["center"][2]) < 1.0 for h in holes)
