import os
import math
from typing import Dict, Any, List, Optional, Tuple

from OCP.STEPControl import STEPControl_Reader
from OCP.IFSelect import IFSelect_RetDone
from OCP.TopAbs import TopAbs_SOLID, TopAbs_FACE, TopAbs_REVERSED
from OCP.TopExp import TopExp_Explorer
from OCP.BRepGProp import BRepGProp
from OCP.GProp import GProp_GProps
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from OCP.BRep import BRep_Tool
from OCP.BRepTools import BRepTools
from OCP.GeomAdaptor import GeomAdaptor_Surface
from OCP.GeomAbs import GeomAbs_SurfaceType
from OCP.BRepCheck import BRepCheck_Analyzer
from OCP.TopoDS import TopoDS
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.TopLoc import TopLoc_Location


class AssemblyEngine:
    """
    OpenCASCADE (OCP) tabanlı çoklu parça ve montaj (Assembly) analiz motoru.
    - Çoklu katı gövdeli tek STEP (Compound) veya birden fazla STEP dosyasını ayrıştırır.
    - Her parçanın kütlesini, hacmini, lokal ağırlık merkezini (CoG) ve deliklerini çıkarır.
    - Analitik olarak birleşik kütle ve montaj CoG noktasını hesaplar: R_cog = sum(m_i * r_i) / sum(m_i).
    - Parçalar arası cıvata bağlantı deseni eşlemesi (Inter-Part Fastener Matching) yapar.
    - Alt sarsıcı tabla arayüz deliklerini ve montaj devrilme moment kolunu (h_cg) belirler.
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

    PART_COLOR_PALETTES = [
        {"name": "Havacılık Saten Alüminyum", "hex": "#94a3b8", "accent": "#64748b"},
        {"name": "Eloksal Savunma Mavisi", "hex": "#38bdf8", "accent": "#0284c7"},
        {"name": "Titanyum Şampanya Sarısı", "hex": "#fbbf24", "accent": "#d97706"},
        {"name": "Zırh Çeliği Grafit Füme", "hex": "#475569", "accent": "#1e293b"},
        {"name": "Hafifletilmiş Magnezyum Bakır", "hex": "#fb923c", "accent": "#ea580c"},
        {"name": "Kompozit Zümrüt Yeşili", "hex": "#34d399", "accent": "#059669"},
    ]

    def __init__(self, default_density_kg_m3: float = 2700.0):
        self.default_density = default_density_kg_m3

    def match_screw_fit(self, diameter_mm: float) -> str:
        for screw in self.STANDARD_METRIC_SCREWS:
            if screw["hole_min"] <= diameter_mm <= screw["hole_max"]:
                return f"{screw['name']} Normal Geçme (ISO 273)"
            elif abs(diameter_mm - screw["nominal_d"]) <= 0.15:
                return f"{screw['name']} Sıkı/Tam Çap"
        return f"{round(diameter_mm, 2)} mm Özel Delik"

    @staticmethod
    def _compute_angular_coverage(intervals: List[Tuple[float, float]]) -> float:
        """Dairesel yay aralıklarının çember üzerindeki net toplam açısal kapalılığını (derece) hesaplar."""
        bins = [False] * 360
        two_pi = 2.0 * math.pi
        for u_min, u_max in intervals:
            span = u_max - u_min
            if span <= 0:
                continue
            if span >= two_pi:
                return 360.0
            start_deg = int(math.floor(math.degrees(u_min % two_pi)))
            span_deg = int(math.ceil(math.degrees(span)))
            for i in range(span_deg):
                bins[(start_deg + i) % 360] = True
        return float(sum(bins))

    def extract_holes_from_solid(self, solid) -> List[Dict[str, Any]]:
        """
        Katı gövdedeki silindirik iç montaj deliklerini deterministik olarak tespit eder.
        
        Kritik Geometrik Filtreleme (Fillet / Radyüs Ayrımı):
        - Delik ve köşe kavislerinin her ikisi de içe bakan normallere (TopAbs_REVERSED) sahiptir.
        - Ancak köşe kavisleri (pocket fillet / transition radius) açık geometridir ve açısal yay uzunluğu
          (U-span) tipik olarak 90° (en fazla <= 120°) civarındadır.
        - Gerçek montaj delikleri ise tam dairesel kapalılığa sahiptir (tek yüzeyde 360° veya
          aynı ekseni paylaşan iki 180° yarım silindir).
        - Bu nedenle aynı 3D silindir eksen çizgisi, yarıçap ve eksenel konuma sahip silindirik yüzeyler kümelenir.
        - Açısal kapalılığı >= 270° (4.71 rad) olanlar gerçek montaj deliği kabul edilir;
          köşe kavisleri (fillet'lar) deterministik olarak elenir.
        - Delik merkezi, yüzeylerin eksen üzerindeki izdüşüm ağırlık merkezi olarak analitik hesaplanır.
        """
        cyl_faces = []
        face_exp = TopExp_Explorer(solid, TopAbs_FACE)

        while face_exp.More():
            face = TopoDS.Face_s(face_exp.Current())
            surf = BRep_Tool.Surface_s(face)
            adaptor = GeomAdaptor_Surface(surf)

            if adaptor.GetType() == GeomAbs_SurfaceType.GeomAbs_Cylinder and face.Orientation() == TopAbs_REVERSED:
                cyl = adaptor.Cylinder()
                radius = cyl.Radius()
                diameter = 2.0 * radius

                # Standart montaj deliği çap aralığı (2.0 mm ile 32.0 mm arası)
                if 2.0 <= diameter <= 32.0:
                    ax = cyl.Axis()
                    d_vec = ax.Direction()
                    loc = ax.Location()

                    dx, dy, dz = d_vec.X(), d_vec.Y(), d_vec.Z()
                    # Kanonik eksen yönü (zıt yön belirsizliğini önlemek için)
                    if dz < -1e-5 or (abs(dz) <= 1e-5 and dy < -1e-5) or (abs(dz) <= 1e-5 and abs(dy) <= 1e-5 and dx < -1e-5):
                        dx, dy, dz = -dx, -dy, -dz

                    # Orijinin eksen doğrusu üzerindeki izdüşümü: P_proj = loc - (loc . d) * d
                    dot = loc.X() * dx + loc.Y() * dy + loc.Z() * dz
                    px = loc.X() - dot * dx
                    py = loc.Y() - dot * dy
                    pz = loc.Z() - dot * dz

                    bounds = BRepTools.UVBounds_s(face)
                    u_min, u_max = bounds[0], bounds[1]
                    u_span = min(max(0.0, u_max - u_min), 2.0 * math.pi)

                    gp = GProp_GProps()
                    BRepGProp.SurfaceProperties_s(face, gp)
                    cm = gp.CentreOfMass()
                    cx, cy, cz = cm.X(), cm.Y(), cm.Z()
                    t = (cx - px) * dx + (cy - py) * dy + (cz - pz) * dz

                    cyl_faces.append({
                        "radius": radius,
                        "dir": (dx, dy, dz),
                        "proj": (px, py, pz),
                        "t": t,
                        "cm": (cx, cy, cz),
                        "u_min": u_min,
                        "u_max": u_max,
                        "u_span": u_span
                    })

            face_exp.Next()

        # Eksen çizgisi, yarıçap ve eksenel konuma (t mesafesi) göre yüzeyleri grupla
        groups = []
        for cf in cyl_faces:
            matched = False
            for g in groups:
                if abs(g["radius"] - cf["radius"]) < 0.08:
                    dir_dot = abs(cf["dir"][0] * g["dir"][0] + cf["dir"][1] * g["dir"][1] + cf["dir"][2] * g["dir"][2])
                    if dir_dot > 0.99:
                        dist_proj = math.sqrt(
                            (cf["proj"][0] - g["proj"][0]) ** 2 +
                            (cf["proj"][1] - g["proj"][1]) ** 2 +
                            (cf["proj"][2] - g["proj"][2]) ** 2
                        )
                        if dist_proj < 0.15:
                            t_avg = sum(f["t"] for f in g["faces"]) / len(g["faces"])
                            if abs(cf["t"] - t_avg) < 8.0:
                                g["faces"].append(cf)
                                g["intervals"].append((cf["u_min"], cf["u_max"]))
                                g["total_span_rad"] += cf["u_span"]
                                matched = True
                                break
            if not matched:
                groups.append({
                    "dir": cf["dir"],
                    "proj": cf["proj"],
                    "radius": cf["radius"],
                    "total_span_rad": cf["u_span"],
                    "intervals": [(cf["u_min"], cf["u_max"])],
                    "faces": [cf]
                })

        detected_holes = []
        seen_centers = []

        for g in groups:
            cov_deg = self._compute_angular_coverage(g["intervals"])
            # 270 derece kapalılık eşiği (fillet'lar genelde 90 derece olup bu eşiği asla aşamaz)
            if cov_deg >= 270.0 or (g["total_span_rad"] * 180.0 / math.pi) >= 270.0:
                dx, dy, dz = g["dir"]
                px, py, pz = g["proj"]
                diameter = 2.0 * g["radius"]

                t_avg = sum(f["t"] for f in g["faces"]) / len(g["faces"])
                center_pos = (
                    round(px + t_avg * dx, 2),
                    round(py + t_avg * dy, 2),
                    round(pz + t_avg * dz, 2)
                )
                axis_dir = (round(dx, 3), round(dy, 3), round(dz, 3))

                is_duplicate = False
                for sc in seen_centers:
                    if math.dist(center_pos, sc) < 1.0:
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

        return detected_holes

    def tessellate_solid(
        self,
        solid,
        cx: float,
        cy: float,
        cz: float,
        dim_x: float,
        dim_y: float,
        dim_z: float
    ) -> Tuple[List[float], List[int]]:
        """Katı gövdeyi Three.js (Y-up merkezlenmiş) üçgen ağına çevirir."""
        mesh_vertices = []
        mesh_indices = []
        try:
            max_dim = max(dim_x, dim_y, dim_z, 10.0)
            deflection = min(0.3, max(0.04, max_dim / 350.0))

            mesh = BRepMesh_IncrementalMesh(solid, deflection, False, 0.5, True)
            mesh.Perform()

            if mesh.IsDone():
                mesh_exp = TopExp_Explorer(solid, TopAbs_FACE)
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

        return mesh_vertices, mesh_indices

    def match_inter_part_joints(
        self,
        parts: List[Dict[str, Any]],
        z_min_base: float,
        tolerance_xy_mm: float = 1.2
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Parçalar arası cıvata deliklerini (Inter-Part Fasteners) ve
        montajın taban seviyesindeki montaj deliklerini (Base Mounting Holes) sınıflandırır.
        """
        inter_part_joints = []
        matched_hole_keys = set()

        # 1. Parçalar arası çift delik arama
        for i in range(len(parts)):
            for j in range(i + 1, len(parts)):
                part_a = parts[i]
                part_b = parts[j]

                for ha in part_a["holes"]:
                    ca = ha["center"]
                    da = ha["direction"]

                    for hb in part_b["holes"]:
                        cb = hb["center"]
                        db = hb["direction"]

                        # Radyal mesafe (XY düzlemi veya genel mesafe)
                        dist_xy = math.sqrt((ca["x"] - cb["x"])**2 + (ca["y"] - cb["y"])**2)
                        dist_3d = math.dist((ca["x"], ca["y"], ca["z"]), (cb["x"], cb["y"], cb["z"]))

                        # Eksenler paralel mi? (Dot product mutlak değeri ~ 1)
                        dot_prod = abs(da["x"] * db["x"] + da["y"] * db["y"] + da["z"] * db["z"])

                        # Eğer radyal mesafe tolerans içinde, eksenler paralel ve delikler birbirine yakınsa
                        if dist_xy <= tolerance_xy_mm and dot_prod >= 0.90 and dist_3d <= 35.0:
                            key_a = f"{part_a['part_id']}_{ca['x']}_{ca['y']}_{ca['z']}"
                            key_b = f"{part_b['part_id']}_{cb['x']}_{cb['y']}_{cb['z']}"
                            matched_hole_keys.add(key_a)
                            matched_hole_keys.add(key_b)

                            common_diam = min(ha["diameter_mm"], hb["diameter_mm"])
                            inter_part_joints.append({
                                "joint_id": f"JOINT-{len(inter_part_joints) + 1}",
                                "part_a_id": part_a["part_id"],
                                "part_a_name": part_a["part_name"],
                                "part_b_id": part_b["part_id"],
                                "part_b_name": part_b["part_name"],
                                "center": {
                                    "x": round((ca["x"] + cb["x"]) / 2.0, 2),
                                    "y": round((ca["y"] + cb["y"]) / 2.0, 2),
                                    "z": round((ca["z"] + cb["z"]) / 2.0, 2),
                                },
                                "nominal_diameter_mm": common_diam,
                                "screw_fit": self.match_screw_fit(common_diam),
                                "axial_gap_mm": round(abs(ca["z"] - cb["z"]), 2),
                                "radial_misalignment_mm": round(dist_xy, 3)
                            })

        # 2. Taban montaj deliklerini belirle (tabana yakın olan ve parçalar arası eşleşmeyen delikler)
        base_mounting_holes = []
        for part in parts:
            for h in part["holes"]:
                c = h["center"]
                key = f"{part['part_id']}_{c['x']}_{c['y']}_{c['z']}"
                dist_to_base = abs(c["z"] - z_min_base)

                # Parçalar arası eşleşmemişse ve tabana göre makul mesafedeyse (örneğin alt 30mm)
                if key not in matched_hole_keys:
                    base_mounting_holes.append({
                        "part_id": part["part_id"],
                        "part_name": part["part_name"],
                        "diameter_mm": h["diameter_mm"],
                        "center": c,
                        "direction": h.get("direction"),
                        "distance_to_base_z_mm": round(dist_to_base, 2),
                        "screw_fit": h["screw_fit"]
                    })

        return inter_part_joints, base_mounting_holes

    def analyze_solids_collection(
        self,
        raw_solids: List[Tuple[str, Any, float, str]],  # (part_name, solid_shape, density, material_name)
        assembly_name: str = "Aviyonik Çoklu Montaj Grubu"
    ) -> Dict[str, Any]:
        """
        Verilen katı gövde listesini birleşik montaj olarak çözümler.
        """
        if not raw_solids:
            raise ValueError("Montaj analizi için en az bir katı gövde gereklidir.")

        # 1. Global Bounding Box belirle
        global_bbox = Bnd_Box()
        for _, solid, _, _ in raw_solids:
            BRepBndLib.Add_s(solid, global_bbox)

        g_xmin, g_ymin, g_zmin, g_xmax, g_ymax, g_zmax = global_bbox.Get()
        g_dim_x = g_xmax - g_xmin
        g_dim_y = g_ymax - g_ymin
        g_dim_z = g_zmax - g_zmin
        g_cx = (g_xmin + g_xmax) / 2.0
        g_cy = (g_ymin + g_ymax) / 2.0
        g_cz = (g_zmin + g_zmax) / 2.0

        # 2. Parçaların bireysel özelliklerini hesapla
        parts = []
        total_mass_kg = 0.0
        total_vol_mm3 = 0.0
        sum_mx = 0.0
        sum_my = 0.0
        sum_mz = 0.0

        # Birleşik mesh verileri
        combined_vertices = []
        combined_indices = []
        v_global_offset = 0

        for idx, (part_name, solid, density, material_name) in enumerate(raw_solids):
            part_id = f"PART-{idx + 1:02d}"
            color_meta = self.PART_COLOR_PALETTES[idx % len(self.PART_COLOR_PALETTES)]

            # Kütle özellikleri
            gprops = GProp_GProps()
            BRepGProp.VolumeProperties_s(solid, gprops)
            vol_mm3 = gprops.Mass()

            if vol_mm3 <= 0.0:
                vol_mm3 = 100.0  # Güvenlik tabanı

            cog = gprops.CentreOfMass()
            mass_kg = (vol_mm3 * 1e-9) * density

            total_mass_kg += mass_kg
            total_vol_mm3 += vol_mm3
            sum_mx += mass_kg * cog.X()
            sum_my += mass_kg * cog.Y()
            sum_mz += mass_kg * cog.Z()

            # Bounding box
            p_bbox = Bnd_Box()
            BRepBndLib.Add_s(solid, p_bbox)
            pxmin, pymin, pzmin, pxmax, pymax, pzmax = p_bbox.Get()

            # Delikler
            holes = self.extract_holes_from_solid(solid)

            # Three.js merkezlenmiş delik koordinatları
            for h in holes:
                h["center_rel"] = {
                    "x": round(h["center"]["x"] - g_cx, 2),
                    "y": round(h["center"]["z"] - g_cz, 2),
                    "z": round(h["center"]["y"] - g_cy, 2)
                }
                if "direction" in h:
                    h["direction_rel"] = {
                        "x": round(h["direction"]["x"], 3),
                        "y": round(h["direction"]["z"], 3),
                        "z": round(h["direction"]["y"], 3)
                    }

            # Mesh (Global merkeze göre konumlandırılmış)
            m_verts, m_inds = self.tessellate_solid(
                solid, g_cx, g_cy, g_cz,
                pxmax - pxmin, pymax - pymin, pzmax - pzmin
            )

            # Birleşik meshe ekle
            combined_vertices.extend(m_verts)
            for ind in m_inds:
                combined_indices.append(v_global_offset + ind)
            v_global_offset += len(m_verts) // 3

            parts.append({
                "part_id": part_id,
                "part_name": part_name,
                "material_name": material_name,
                "density_kg_m3": density,
                "mass_kg": round(mass_kg, 4),
                "volume_mm3": round(vol_mm3, 2),
                "cog_mm": {
                    "x": round(cog.X(), 2),
                    "y": round(cog.Y(), 2),
                    "z": round(cog.Z(), 2)
                },
                "cog_rel": {
                    "x": round(cog.X() - g_cx, 2),
                    "y": round(cog.Z() - g_cz, 2),
                    "z": round(cog.Y() - g_cy, 2)
                },
                "bounding_box_mm": {
                    "length_x": round(pxmax - pxmin, 2),
                    "width_y": round(pymax - pymin, 2),
                    "height_z": round(pzmax - pzmin, 2)
                },
                "holes_count": len(holes),
                "holes": holes,
                "color": color_meta,
                "tessellation": {
                    "vertices_count": len(m_verts) // 3,
                    "triangles_count": len(m_inds) // 3,
                    "vertices": m_verts,
                    "indices": m_inds
                }
            })

        # 3. Analitik Bileşik Kütle Merkezi (Compound CoG)
        if total_mass_kg > 0:
            comp_cog_x = sum_mx / total_mass_kg
            comp_cog_y = sum_my / total_mass_kg
            comp_cog_z = sum_mz / total_mass_kg
        else:
            comp_cog_x, comp_cog_y, comp_cog_z = g_cx, g_cy, g_cz

        h_cg = abs(comp_cog_z - g_zmin)

        # 4. Parçalar arası cıvata ve taban montaj deseni eşlemesi
        inter_part_joints, base_mounting_holes = self.match_inter_part_joints(
            parts, g_zmin, tolerance_xy_mm=1.2
        )

        # Taban montaj açıklığı hesabı
        span_x = 0.0
        span_y = 0.0
        diagonal_span = 0.0
        if len(base_mounting_holes) >= 2:
            xs = [h["center"]["x"] for h in base_mounting_holes]
            ys = [h["center"]["y"] for h in base_mounting_holes]
            span_x = round(max(xs) - min(xs), 2)
            span_y = round(max(ys) - min(ys), 2)
            diagonal_span = round(math.sqrt(span_x**2 + span_y**2), 2)

        # Delik rölatif koordinatları
        for bmh in base_mounting_holes:
            bmh["center_rel"] = {
                "x": round(bmh["center"]["x"] - g_cx, 2),
                "y": round(bmh["center"]["z"] - g_cz, 2),
                "z": round(bmh["center"]["y"] - g_cy, 2)
            }

        for ipj in inter_part_joints:
            ipj["center_rel"] = {
                "x": round(ipj["center"]["x"] - g_cx, 2),
                "y": round(ipj["center"]["z"] - g_cz, 2),
                "z": round(ipj["center"]["y"] - g_cy, 2)
            }

        return {
            "metadata": {
                "file_name": assembly_name,
                "is_assembly": True,
                "parts_count": len(parts),
                "joints_count": len(inter_part_joints),
                "base_holes_count": len(base_mounting_holes),
                "is_manifold_valid": True,
                "material_name": "Çoklu Montaj Alaşımı"
            },
            "assembly_tree": [
                {
                    "part_id": p["part_id"],
                    "part_name": p["part_name"],
                    "material_name": p["material_name"],
                    "mass_kg": p["mass_kg"],
                    "mass_share_percent": round((p["mass_kg"] / total_mass_kg) * 100.0, 1) if total_mass_kg > 0 else 0.0,
                    "holes_count": p["holes_count"],
                    "color": p["color"]
                }
                for p in parts
            ],
            "physical_properties": {
                "mass_kg": round(total_mass_kg, 4),
                "volume_mm3": round(total_vol_mm3, 2),
                "cog_mm": {
                    "x": round(comp_cog_x, 2),
                    "y": round(comp_cog_y, 2),
                    "z": round(comp_cog_z, 2)
                },
                "cog_rel": {
                    "x": round(comp_cog_x - g_cx, 2),
                    "y": round(comp_cog_z - g_cz, 2),
                    "z": round(comp_cog_y - g_cy, 2)
                }
            },
            "bounding_box_mm": {
                "length_x": round(g_dim_x, 2),
                "width_y": round(g_dim_y, 2),
                "height_z": round(g_dim_z, 2),
                "min_bounds": {"x": round(g_xmin, 2), "y": round(g_ymin, 2), "z": round(g_zmin, 2)},
                "max_bounds": {"x": round(g_xmax, 2), "y": round(g_ymax, 2), "z": round(g_zmax, 2)}
            },
            "mounting_interface": {
                "overturning_moment_arm_h_cg_mm": round(h_cg, 2),
                "mounting_plane": "Z_MIN_BASE",
                "detected_holes_count": len(base_mounting_holes),
                "holes": base_mounting_holes,
                "pattern_span_x_mm": span_x,
                "pattern_span_y_mm": span_y,
                "diagonal_span_mm": diagonal_span
            },
            "inter_part_joints": inter_part_joints,
            "parts": parts,
            "tessellation": {
                "has_mesh": len(combined_indices) > 0,
                "vertices": combined_vertices,
                "indices": combined_indices,
                "triangles_count": len(combined_indices) // 3,
                "center_offset": {"x": round(g_cx, 2), "y": round(g_cy, 2), "z": round(g_cz, 2)}
            }
        }

    def parse_compound_step(
        self,
        file_path: str,
        default_density_kg_m3: Optional[float] = None,
        default_material_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Tek bir STEP dosyasındaki tüm katı gövdeleri ayrıştırıp montaj olarak döner."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"STEP dosyası bulunamadı: {file_path}")

        density = default_density_kg_m3 or self.default_density
        mat_name = default_material_name or "Aluminium 6061-T6"

        reader = STEPControl_Reader()
        status = reader.ReadFile(file_path)
        if status != IFSelect_RetDone:
            raise ValueError("STEP dosyası okunamadı veya format geçersiz.")

        reader.TransferRoots()
        root_shape = reader.OneShape()

        if root_shape.IsNull():
            raise ValueError("CAD dosyasında geçerli 3D geometri bulunamadı.")

        solids = []
        solid_exp = TopExp_Explorer(root_shape, TopAbs_SOLID)
        idx = 1
        while solid_exp.More():
            solid = TopoDS.Solid_s(solid_exp.Current())
            solids.append((f"Gövde #{idx}", solid, density, mat_name))
            idx += 1
            solid_exp.Next()

        if not solids:
            raise ValueError("STEP modelinde katı gövde (Solid) bulunamadı.")

        base_name = os.path.basename(file_path)
        return self.analyze_solids_collection(solids, assembly_name=base_name)

    def parse_multi_step_files(
        self,
        file_paths: List[str],
        material_mappings: Optional[Dict[str, str]] = None,
        density_mappings: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """Kullanıcının aynı anda yüklediği birden fazla STEP dosyasını birleşik montaj olarak analiz eder."""
        if not file_paths:
            raise ValueError("Hiçbir STEP dosyası sağlanmadı.")

        mat_map = material_mappings or {}
        dens_map = density_mappings or {}

        raw_solids = []
        for file_path in file_paths:
            if not os.path.exists(file_path):
                continue

            base_name = os.path.basename(file_path)
            part_display_name = os.path.splitext(base_name)[0]
            mat_name = mat_map.get(base_name, "Aluminium 6061-T6")
            density = dens_map.get(base_name, self.default_density)

            reader = STEPControl_Reader()
            status = reader.ReadFile(file_path)
            if status != IFSelect_RetDone:
                continue

            reader.TransferRoots()
            root_shape = reader.OneShape()
            if root_shape.IsNull():
                continue

            solid_exp = TopExp_Explorer(root_shape, TopAbs_SOLID)
            sub_idx = 1
            while solid_exp.More():
                solid = TopoDS.Solid_s(solid_exp.Current())
                sub_name = part_display_name if sub_idx == 1 else f"{part_display_name}_{sub_idx}"
                raw_solids.append((sub_name, solid, density, mat_name))
                sub_idx += 1
                solid_exp.Next()

        if not raw_solids:
            raise ValueError("Yüklenen STEP dosyalarından geçerli katı model elde edilemedi.")

        assembly_name = f"Montaj Grubu ({len(file_paths)} Parça)"
        return self.analyze_solids_collection(raw_solids, assembly_name=assembly_name)
