import os
import math
from typing import Dict, Any, List, Optional, Tuple

from OCP.STEPControl import STEPControl_Reader
from OCP.IFSelect import IFSelect_RetDone
from OCP.TopAbs import TopAbs_SOLID, TopAbs_SHELL, TopAbs_FACE, TopAbs_ShapeEnum, TopAbs_REVERSED
from OCP.TopExp import TopExp_Explorer
from OCP.BRepGProp import BRepGProp
from OCP.GProp import GProp_GProps
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from OCP.BRep import BRep_Tool
from OCP.GeomAdaptor import GeomAdaptor_Surface
from OCP.GeomAbs import GeomAbs_SurfaceType
from OCP.BRepCheck import BRepCheck_Analyzer
from OCP.TopoDS import TopoDS
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.TopLoc import TopLoc_Location


class CADParser:
    """
    OpenCASCADE (OCP) tabanlı deterministik CAD & STEP analiz motoru.
    Katı model geometrisinden kütle, CoG, montaj delikleri, devrilme kolu
    ve imalat tolerans sınırlarını çıkarır.
    """

    STANDARD_METRIC_SCREWS = [
        {"name": "M2.5", "nominal_d": 2.5, "hole_min": 2.6, "hole_max": 2.9},
        {"name": "M3", "nominal_d": 3.0, "hole_min": 3.1, "hole_max": 3.6},
        {"name": "M4", "nominal_d": 4.0, "hole_min": 4.1, "hole_max": 4.7},
        {"name": "M5", "nominal_d": 5.0, "hole_min": 5.1, "hole_max": 5.8},
        {"name": "M6", "nominal_d": 6.0, "hole_min": 6.1, "hole_max": 6.9},
        {"name": "M8", "nominal_d": 8.0, "hole_min": 8.2, "hole_max": 9.2},
        {"name": "M10", "nominal_d": 10.0, "hole_min": 10.2, "hole_max": 11.5},
        {"name": "M12", "nominal_d": 12.0, "hole_min": 12.5, "hole_max": 14.0},
    ]

    def __init__(self, default_density_kg_m3: float = 2700.0):
        self.default_density = default_density_kg_m3

    def match_screw_fit(self, diameter_mm: float) -> str:
        for screw in self.STANDARD_METRIC_SCREWS:
            if screw["hole_min"] <= diameter_mm <= screw["hole_max"]:
                return f"{screw['name']} Normal Geçme (ISO 273)"
            elif abs(diameter_mm - screw["nominal_d"]) <= 0.15:
                return f"{screw['name']} Sıkı/Tam Çap"
        return f"{round(diameter_mm, 2)} mm Özel Delik Çapı"

    def parse_step(
        self,
        file_path: str,
        density_kg_m3: Optional[float] = None,
        material_name: Optional[str] = None
    ) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"STEP dosyası bulunamadı: {file_path}")

        density = density_kg_m3 or self.default_density

        # 1. STEP Okuma
        reader = STEPControl_Reader()
        status = reader.ReadFile(file_path)
        if status != IFSelect_RetDone:
            raise ValueError(
                "STEP dosyası okunamadı veya format hatalı. "
                "Lütfen STEP AP214 veya AP242 standardında dışa aktarınız."
            )

        reader.TransferRoots()
        root_shape = reader.OneShape()

        if root_shape.IsNull():
            raise ValueError("CAD dosyasında geçerli bir 3D geometri bulunamadı.")

        # 2. Input Sanitation: Manifold & Katı Gövde Kontrolü
        analyzer = BRepCheck_Analyzer(root_shape)
        is_valid = analyzer.IsValid()

        # Katı gövdeleri tespit et
        solids = []
        solid_exp = TopExp_Explorer(root_shape, TopAbs_SOLID)
        while solid_exp.More():
            solids.append(TopoDS.Solid_s(solid_exp.Current()))
            solid_exp.Next()

        # Eğer katı gövde yoksa açık yüzey (shell) kontrolü
        if len(solids) == 0:
            shell_exp = TopExp_Explorer(root_shape, TopAbs_SHELL)
            has_shells = shell_exp.More()
            if has_shells:
                raise ValueError(
                    "UYARI: Yüklenen modelde yüzey dikişleri eksik, kapalı bir katı gövde oluşturulamadı. "
                    "Lütfen CAD programınızdan parçayı 'Sew Surfaces' yaparak veya STEP AP214/AP242 "
                    "standardında katı gövde (Solid) olarak dışa aktarınız."
                )
            else:
                raise ValueError("Model içinde katı gövde veya kabuk yüzey bulunamadı.")

        # Çoklu montaj (Assembly) yönetimi: En büyük kütleli parçayı seç
        primary_solid = solids[0]
        assembly_info = {
            "is_assembly": len(solids) > 1,
            "total_bodies_count": len(solids),
            "primary_body_index": 0
        }

        if len(solids) > 1:
            max_vol = -1.0
            best_idx = 0
            for idx, sol in enumerate(solids):
                gprops_temp = GProp_GProps()
                BRepGProp.VolumeProperties_s(sol, gprops_temp)
                vol = gprops_temp.Mass()
                if vol > max_vol:
                    max_vol = vol
                    best_idx = idx
                    primary_solid = sol
            assembly_info["primary_body_index"] = best_idx
            assembly_info["note"] = f"Montaj tespit edildi. En yüksek kütleli ana gövde (Gövde #{best_idx + 1}) analiz referansı alındı."

        # 3. Kütle ve Atalet Analizi (BRepGProp)
        gprops = GProp_GProps()
        BRepGProp.VolumeProperties_s(primary_solid, gprops)
        vol_mm3 = gprops.Mass()

        if vol_mm3 <= 0.0:
            raise ValueError("Hesaplanan hacim tanımsız veya negatif. Geometri topolojisi bozuk.")

        cog = gprops.CentreOfMass()
        mass_kg = (vol_mm3 * 1e-9) * density
        inertia_matrix = gprops.MatrixOfInertia()

        # 4. Bounding Box ve Devrilme Kolu (hcg)
        bbox = Bnd_Box()
        BRepBndLib.Add_s(primary_solid, bbox)
        xmin, ymin, zmin, xmax, ymax, zmax = bbox.Get()

        dim_x = xmax - xmin
        dim_y = ymax - ymin
        dim_z = zmax - zmin

        # Taban yüzeyini Z_min kabul ederek devrilme moment kolu (h_cg)
        h_cg = abs(cog.Z() - zmin)

        # 5. Montaj Deliklerinin Taranması (TopExp_Explorer)
        detected_holes = []
        face_exp = TopExp_Explorer(primary_solid, TopAbs_FACE)

        seen_centers = []

        while face_exp.More():
            face = TopoDS.Face_s(face_exp.Current())
            surf = BRep_Tool.Surface_s(face)
            adaptor = GeomAdaptor_Surface(surf)

            if adaptor.GetType() == GeomAbs_SurfaceType.GeomAbs_Cylinder:
                # OpenCASCADE Katı Model Montaj Deliği Doğrulaması:
                # Delik iç silindirik boşluk olduğu için yüzey normali silindir eksenine doğrudur (TopAbs_REVERSED).
                # Dış köşe kavisleri / radyüsler (fillet) ise TopAbs_FORWARD'dur ve montaj deliği değildir.
                if face.Orientation() != TopAbs_REVERSED:
                    face_exp.Next()
                    continue

                cyl = adaptor.Cylinder()
                radius = cyl.Radius()
                diameter = 2.0 * radius

                # Standart montaj deliği çap aralığı (2.0 mm ile 25.0 mm arası)
                if 2.0 <= diameter <= 25.0:
                    gp = GProp_GProps()
                    BRepGProp.SurfaceProperties_s(face, gp)
                    cm = gp.CentreOfMass()
                    center_pos = (round(cm.X(), 2), round(cm.Y(), 2), round(cm.Z(), 2))

                    axis = cyl.Axis().Direction()
                    axis_dir = (round(axis.X(), 3), round(axis.Y(), 3), round(axis.Z(), 3))

                    # Duplicate delik yüzeylerini filtrele (aynı delik silindiri parçaları)
                    is_duplicate = False
                    for sc in seen_centers:
                        dist = math.dist(center_pos, sc)
                        if dist < 3.0:  # 3 mm'den yakınsa aynı delik merkezi
                            is_duplicate = True
                            break

                    if not is_duplicate:
                        seen_centers.append(center_pos)
                        detected_holes.append({
                            "diameter_mm": round(diameter, 2),
                            "center": {"x": center_pos[0], "y": center_pos[1], "z": center_pos[2]},
                            "direction": {"x": axis_dir[0], "y": axis_dir[1], "z": axis_dir[2]},
                            "screw_fit": self.match_screw_fit(diameter)
                        })

            face_exp.Next()

        # Montaj Açıklığı (Span) Hesabı
        span_x = 0.0
        span_y = 0.0
        diagonal_span = 0.0
        if len(detected_holes) >= 2:
            xs = [h["center"]["x"] for h in detected_holes]
            ys = [h["center"]["y"] for h in detected_holes]
            span_x = round(max(xs) - min(xs), 2)
            span_y = round(max(ys) - min(ys), 2)
            diagonal_span = round(math.sqrt(span_x**2 + span_y**2), 2)

        # 6. Gerçek 3D Geometri Triangulation (Tessellation Mesh)
        mesh_vertices = []
        mesh_indices = []
        cx = (xmin + xmax) / 2.0
        cy = (ymin + ymax) / 2.0
        cz = (zmin + zmax) / 2.0

        try:
            max_dim = max(dim_x, dim_y, dim_z, 10.0)
            deflection = min(0.3, max(0.04, max_dim / 350.0))

            mesh = BRepMesh_IncrementalMesh(primary_solid, deflection, False, 0.5, True)
            mesh.Perform()

            if mesh.IsDone():
                mesh_exp = TopExp_Explorer(primary_solid, TopAbs_FACE)
                v_offset = 0
                while mesh_exp.More():
                    face = TopoDS.Face_s(mesh_exp.Current())
                    loc = TopLoc_Location()
                    triangulation = BRep_Tool.Triangulation_s(face, loc)
                    if triangulation:
                        trsf = loc.Transformation()
                        for i in range(1, triangulation.NbNodes() + 1):
                            p = triangulation.Node(i)
                            if not loc.IsIdentity():
                                p = p.Transformed(trsf)
                            # Three.js koordinat sistemine (Y-up) uygun ve modele göre merkezlenmiş
                            mesh_vertices.extend([
                                round(p.X() - cx, 2),
                                round(p.Z() - cz, 2),
                                round(p.Y() - cy, 2)
                            ])
                        for i in range(1, triangulation.NbTriangles() + 1):
                            tri = triangulation.Triangle(i)
                            n1, n2, n3 = tri.Get()
                            mesh_indices.extend([
                                v_offset + n1 - 1,
                                v_offset + n2 - 1,
                                v_offset + n3 - 1
                            ])
                        v_offset += triangulation.NbNodes()
                    mesh_exp.Next()
        except Exception:
            mesh_vertices = []
            mesh_indices = []

        # Delik koordinatlarını ve eksen yönünü Three.js (Y-up) merkezlenmiş sisteme dönüştür
        for h in detected_holes:
            h["center_rel"] = {
                "x": round(h["center"]["x"] - cx, 2),
                "y": round(h["center"]["z"] - cz, 2),
                "z": round(h["center"]["y"] - cy, 2)
            }
            if "direction" in h:
                h["direction_rel"] = {
                    "x": round(h["direction"]["x"], 3),
                    "y": round(h["direction"]["z"], 3),
                    "z": round(h["direction"]["y"], 3)
                }

        return {
            "metadata": {
                "file_name": os.path.basename(file_path),
                "material_name": material_name or "Aluminium 6061-T6 (Varsayılan)",
                "density_kg_m3": density,
                "is_manifold_valid": is_valid,
                "assembly": assembly_info
            },
            "physical_properties": {
                "volume_mm3": round(vol_mm3, 2),
                "mass_kg": round(mass_kg, 4),
                "cog_mm": {
                    "x": round(cog.X(), 2),
                    "y": round(cog.Y(), 2),
                    "z": round(cog.Z(), 2)
                },
                "cog_rel": {
                    "x": round(cog.X() - cx, 2),
                    "y": round(cog.Z() - cz, 2),
                    "z": round(cog.Y() - cy, 2)
                },
                "inertia_tensor_kg_mm2": {
                    "Ixx": round(inertia_matrix.Value(1, 1) * (density * 1e-9), 3),
                    "Iyy": round(inertia_matrix.Value(2, 2) * (density * 1e-9), 3),
                    "Izz": round(inertia_matrix.Value(3, 3) * (density * 1e-9), 3)
                }
            },
            "bounding_box_mm": {
                "length_x": round(dim_x, 2),
                "width_y": round(dim_y, 2),
                "height_z": round(dim_z, 2),
                "min_bounds": {"x": round(xmin, 2), "y": round(ymin, 2), "z": round(zmin, 2)},
                "max_bounds": {"x": round(xmax, 2), "y": round(ymax, 2), "z": round(zmax, 2)}
            },
            "mounting_interface": {
                "overturning_moment_arm_h_cg_mm": round(h_cg, 2),
                "mounting_plane": "Z_MIN_BASE",
                "detected_holes_count": len(detected_holes),
                "holes": detected_holes,
                "pattern_span_x_mm": span_x,
                "pattern_span_y_mm": span_y,
                "diagonal_span_mm": diagonal_span
            },
            "tessellation": {
                "has_mesh": len(mesh_indices) > 0,
                "vertices": mesh_vertices,
                "indices": mesh_indices,
                "triangles_count": len(mesh_indices) // 3,
                "center_offset": {"x": round(cx, 2), "y": round(cy, 2), "z": round(cz, 2)}
            }
        }
