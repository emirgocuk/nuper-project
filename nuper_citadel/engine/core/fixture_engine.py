import math
import sqlite3
import os
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
MATERIALS_DB_PATH = os.path.join(DATA_DIR, "materials.db")

STANDARD_PLATE_THICKNESSES = [10.0, 12.0, 15.0, 20.0, 25.0, 30.0, 35.0, 40.0, 50.0, 60.0, 75.0, 90.0, 100.0]


@dataclass
class MaterialProperties:
    name: str
    density_kg_m3: float
    elastic_modulus_gpa: float
    poissons_ratio: float
    yield_strength_mpa: float


@dataclass
class MaterialOptionResult:
    material_name: str
    density_kg_m3: float
    elastic_modulus_gpa: float
    min_thickness_mm: float
    recommended_thickness_mm: float
    actual_first_mode_hz: float
    estimated_fixture_mass_kg: float
    total_shaker_payload_kg: float
    stiffness_to_weight_ratio: float


@dataclass
class FixtureEnvelopeResult:
    part_mass_kg: float
    part_bounding_box_mm: Dict[str, float]
    mounting_hole_span_mm: Dict[str, float]
    shaker_grid_pitch_mm: float
    shaker_bolt_size: str
    fixture_dimensions_mm: Dict[str, float]  # length, width
    target_frequency_hz: float
    safety_factor: float
    overturning_moment_warning: bool
    overturning_moment_note: str
    shaker_attachment_bolts_count: int
    recommended_option: MaterialOptionResult
    alternative_options: List[MaterialOptionResult]
    directives: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class FixtureEngine:
    """
    MIL-STD-810H Uyumlu Sarsıcı Test Fikstürü Tasarım ve Rezonans Güvenlik Zarfı Motoru.
    Fikstürün ilk rezonans modunun parçanın ve test profilinin en yüksek frekansının
    üzerinde olmasını (f_fixture >= 1.20 * f_max) analitik olarak garanti eder.
    """

    def __init__(self, materials_db_path: str = MATERIALS_DB_PATH):
        self.materials_db_path = materials_db_path

    def _get_material(self, material_name: str) -> Optional[MaterialProperties]:
        if not os.path.exists(self.materials_db_path):
            return None
        conn = sqlite3.connect(self.materials_db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT name, density_kg_m3, elastic_modulus_gpa, poissons_ratio, yield_strength_mpa
            FROM materials
            WHERE name LIKE ?
        """, (f"%{material_name}%",))
        row = cursor.fetchone()
        conn.close()
        if row:
            return MaterialProperties(
                name=row[0],
                density_kg_m3=float(row[1]),
                elastic_modulus_gpa=float(row[2]),
                poissons_ratio=float(row[3]),
                yield_strength_mpa=float(row[4]),
            )
        return None

    def calculate_envelope(
        self,
        part_mass_kg: float,
        bounding_box: Dict[str, float],
        mounting_holes: Optional[List[Dict[str, Any]]] = None,
        overturning_moment_arm_mm: float = 0.0,
        max_test_frequency_hz: float = 2000.0,
        shaker_grid_pitch_mm: float = 50.0,
        shaker_bolt_size: str = "M10",
        margin_mm: float = 40.0,
        safety_factor: float = 1.20,
    ) -> FixtureEnvelopeResult:
        """
        Parçanın geometrik ve kütle isterlerine göre fikstür boyutlarını ve minimum
        plaka et kalınlığı gereksinimlerini hesaplar.
        """
        # 1. Hedef Frekans
        f_target = safety_factor * max_test_frequency_hz

        # 2. Delik Yayılımı (Span) Hesabı
        span_x = 0.0
        span_y = 0.0
        if mounting_holes and len(mounting_holes) >= 2:
            xs = [h.get("center_x", 0.0) for h in mounting_holes]
            ys = [h.get("center_y", 0.0) for h in mounting_holes]
            span_x = max(xs) - min(xs)
            span_y = max(ys) - min(ys)

        part_lx = bounding_box.get("lx", 100.0)
        part_ly = bounding_box.get("ly", 100.0)
        part_lz = bounding_box.get("lz", 50.0)

        # 3. Fikstür Plaka Boyutları (Shaker Grid'e Eşleme)
        # Fikstür plaka boyutları parçayı ve sabitleme deliklerini içine alacak şekilde
        # shaker tablanın grid adımına (pitch) yukarı yuvarlanır.
        raw_length = max(part_lx, span_x) + 2 * margin_mm
        raw_width = max(part_ly, span_y) + 2 * margin_mm

        # Minimum 3 grid aralığı (örn. 150mm)
        min_dim = shaker_grid_pitch_mm * 3.0
        fixture_length = max(math.ceil(raw_length / shaker_grid_pitch_mm) * shaker_grid_pitch_mm, min_dim)
        fixture_width = max(math.ceil(raw_width / shaker_grid_pitch_mm) * shaker_grid_pitch_mm, min_dim)

        # Sarsıcı tabla bağlantı cıvata sayısı (dış çevre delikleri)
        nx = int(round(fixture_length / shaker_grid_pitch_mm)) + 1
        ny = int(round(fixture_width / shaker_grid_pitch_mm)) + 1
        perimeter_bolts = 2 * (nx + ny - 2)

        # 4. Devrilme Momenti (Overturning Moment) Değerlendirmesi
        # Eğer parçanın ağırlık merkezi yüksekliği (h_cg), fikstür taban genişliğinin %40'ını aşıyorsa uyarı üret
        min_base_span = min(fixture_length, fixture_width)
        moment_warning = False
        moment_note = "Ağırlık merkezi zarf içerisinde stabil."
        if overturning_moment_arm_mm > 0.40 * min_base_span:
            moment_warning = True
            moment_note = (
                f"Kritik devrilme momenti: h_cg ({overturning_moment_arm_mm:.1f} mm) > 0.40 x Min Taban Genişliği ({min_base_span:.1f} mm). "
                "Enine eksen titreşimlerinde rezonans yükselmesini önlemek için taban flanşı genişletilmeli veya yan destek gusset/nervürleri eklenmelidir."
            )

        # 5. Malzeme Seçenekleri ve Kalınlık Hesabı
        # Birincil: Alumec 89 / 7075-T6
        # İkincil: C45 Islah Çeliği, 6061-T6
        material_names = ["Alumec 89", "Aluminium 7075-T6", "C45 Carbon Steel", "Aluminium 6061-T6"]
        material_options: List[MaterialOptionResult] = []

        for mat_name in material_names:
            mat = self._get_material(mat_name)
            if not mat:
                continue

            opt = self._calculate_material_option(
                mat=mat,
                f_target=f_target,
                length_mm=fixture_length,
                width_mm=fixture_width,
                part_mass_kg=part_mass_kg,
            )
            material_options.append(opt)

        # Eğer Alumec 89 bulunamazsa ilk malzemeyi öner
        recommended = material_options[0] if material_options else None
        alternatives = material_options[1:] if len(material_options) > 1 else []

        # 6. Mühendislik Yönergeleri
        directives = [
            f"Fikstür 1. doğal rezonans modu MIL-STD-810H uyarınca en az {f_target:.0f} Hz olmalıdır (Güvenlik faktörü: {safety_factor:.2f}x).",
            f"Fikstür tablası {shaker_grid_pitch_mm:.0f}x{shaker_grid_pitch_mm:.0f} mm grid düzeninde en az {perimeter_bolts} adet {shaker_bolt_size} cıvata ile sarsıcıya bağlanmalıdır.",
            f"Önerilen fikstür malzemesi: {recommended.material_name if recommended else 'Alumec 89 / 7075-T6'}, minimum plaka et kalınlığı t_rec = {recommended.recommended_thickness_mm if recommended else 25.0:.1f} mm.",
            "Tüm montaj delikleri diş derinliği en az 1.5 x cıvata anma çapı olmalı ve Helicoil / Keensert paslanmaz çelik diş takviyeleri kullanılmalıdır.",
        ]
        if moment_warning:
            directives.append(moment_note)

        return FixtureEnvelopeResult(
            part_mass_kg=part_mass_kg,
            part_bounding_box_mm={"lx": part_lx, "ly": part_ly, "lz": part_lz},
            mounting_hole_span_mm={"span_x": span_x, "span_y": span_y},
            shaker_grid_pitch_mm=shaker_grid_pitch_mm,
            shaker_bolt_size=shaker_bolt_size,
            fixture_dimensions_mm={"length": fixture_length, "width": fixture_width},
            target_frequency_hz=f_target,
            safety_factor=safety_factor,
            overturning_moment_warning=moment_warning,
            overturning_moment_note=moment_note,
            shaker_attachment_bolts_count=perimeter_bolts,
            recommended_option=recommended,
            alternative_options=alternatives,
            directives=directives,
        )

    def _calculate_material_option(
        self,
        mat: MaterialProperties,
        f_target: float,
        length_mm: float,
        width_mm: float,
        part_mass_kg: float,
    ) -> MaterialOptionResult:
        """
        Plaka eğilme doğal frekansı analitik çözümü:
        f_1 = (pi / 2) * t * sqrt(E / (12 * rho * (1 - nu^2))) * (1/L^2 + 1/W^2)
        => t_min = f_target / [ (pi / 2) * sqrt(E / (12 * rho * (1 - nu^2))) * (1/L^2 + 1/W^2) ]
        """
        # SI Birimlerine Dönüşüm
        L_m = length_mm * 1e-3
        W_m = width_mm * 1e-3
        E_pa = mat.elastic_modulus_gpa * 1e9
        rho = mat.density_kg_m3
        nu = mat.poissons_ratio

        c_speed = math.sqrt(E_pa / (12.0 * rho * (1.0 - nu**2)))
        geom_factor = (1.0 / (L_m**2)) + (1.0 / (W_m**2))

        # t_min in meters
        t_min_m = f_target / (0.5 * math.pi * c_speed * geom_factor)
        t_min_mm = t_min_m * 1000.0

        # Standart et kalınlığına yukarı yuvarlama
        recommended_t = STANDARD_PLATE_THICKNESSES[-1]
        for std_t in STANDARD_PLATE_THICKNESSES:
            if std_t >= t_min_mm:
                recommended_t = std_t
                break

        # Tavsiye edilen kalınlık ile gerçekleşecek gerçek ilk mod frekansı
        t_rec_m = recommended_t * 1e-3
        actual_f1 = (0.5 * math.pi) * t_rec_m * c_speed * geom_factor

        # Tahmini Fikstür Kütlesi (kg)
        volume_m3 = L_m * W_m * t_rec_m
        fixture_mass_kg = volume_m3 * rho
        total_payload_kg = fixture_mass_kg + part_mass_kg

        # Rijitlik/Kütle Oranı göstergesi: sqrt(E/rho)
        stiffness_to_weight = math.sqrt(E_pa / rho)

        return MaterialOptionResult(
            material_name=mat.name,
            density_kg_m3=mat.density_kg_m3,
            elastic_modulus_gpa=mat.elastic_modulus_gpa,
            min_thickness_mm=round(t_min_mm, 2),
            recommended_thickness_mm=recommended_t,
            actual_first_mode_hz=round(actual_f1, 1),
            estimated_fixture_mass_kg=round(fixture_mass_kg, 3),
            total_shaker_payload_kg=round(total_payload_kg, 3),
            stiffness_to_weight_ratio=round(stiffness_to_weight, 1),
        )
