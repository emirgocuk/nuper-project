import os
import math
import sqlite3
from typing import Dict, Any, List, Optional

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
STANDARDS_DB_PATH = os.path.join(DATA_DIR, "standards.db")
MATERIALS_DB_PATH = os.path.join(DATA_DIR, "materials.db")


class RuleEngine:
    def __init__(
        self,
        standards_db_path: str = STANDARDS_DB_PATH,
        materials_db_path: str = MATERIALS_DB_PATH
    ):
        self.standards_db_path = standards_db_path
        self.materials_db_path = materials_db_path

    def list_platforms(self, standard_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.standards_db_path)
        cursor = conn.cursor()
        if standard_filter:
            cursor.execute(
                "SELECT id, platform_name, platform_category, standard_code, description FROM military_platforms WHERE standard_code LIKE ?",
                (f"%{standard_filter}%",)
            )
        else:
            cursor.execute("SELECT id, platform_name, platform_category, standard_code, description FROM military_platforms")
        rows = cursor.fetchall()
        conn.close()
        return [
            {
                "id": r[0],
                "platform_name": r[1],
                "platform_category": r[2],
                "standard_code": r[3],
                "description": r[4]
            }
            for r in rows
        ]

    def add_custom_platform(
        self,
        platform_name: str,
        platform_category: str,
        standard_code: str,
        description: str,
        vibration_data: Dict[str, Any],
        temperature_data: Optional[Dict[str, Any]] = None,
        shock_data: Optional[Dict[str, Any]] = None,
    ) -> int:
        conn = sqlite3.connect(self.standards_db_path)
        cursor = conn.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
                VALUES (?, ?, ?, ?)
                """,
                (platform_name, platform_category, standard_code, description),
            )
            platform_id = cursor.lastrowid

            # Vibration profile
            method_code = vibration_data.get("method_code", "CUSTOM")
            category_id = vibration_data.get("category_id", 99)
            annex_figure = vibration_data.get("annex_figure", "User Defined Spectrum")
            duration = vibration_data.get("duration_per_axis_minutes", 60)
            axes = vibration_data.get("axes", "X,Y,Z")
            mass_atten = 1 if vibration_data.get("mass_attenuation_applicable") else 0
            breakpoints = vibration_data.get("breakpoints", [])

            calc_grms = self.calculate_grms(breakpoints) if breakpoints else 0.0

            cursor.execute(
                """
                INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (platform_id, method_code, category_id, annex_figure, calc_grms, duration, axes, mass_atten),
            )
            prof_id = cursor.lastrowid

            for idx, bp in enumerate(breakpoints, start=1):
                cursor.execute(
                    """
                    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (prof_id, idx, bp["frequency_hz"], bp["psd_value"], bp.get("slope_db_oct", 0.0)),
                )

            # Temperature profile
            if temperature_data:
                cursor.execute(
                    """
                    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        platform_id,
                        temperature_data.get("climatic_category", "Custom Thermal"),
                        temperature_data.get("operational_high_c", 60.0),
                        temperature_data.get("storage_high_c", 70.0),
                        temperature_data.get("operational_low_c", -40.0),
                        temperature_data.get("storage_low_c", -50.0),
                    ),
                )

            # Shock profile
            if shock_data:
                cursor.execute(
                    """
                    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        platform_id,
                        shock_data.get("procedure_name", "Custom Shock"),
                        shock_data.get("pulse_shape", "Half-Sine"),
                        shock_data.get("peak_acceleration_g", 20.0),
                        shock_data.get("duration_ms", 11.0),
                        shock_data.get("num_shocks_per_axis", 6),
                    ),
                )

            conn.commit()
            return platform_id
        finally:
            conn.close()

    def add_custom_material(
        self,
        name: str,
        category: str,
        density_kg_m3: float,
        elastic_modulus_gpa: float,
        poissons_ratio: float,
        yield_strength_mpa: float,
        ultimate_strength_mpa: float,
        cte_per_k: float,
        basquin_a_mpa: Optional[float] = None,
        basquin_b_exponent: Optional[float] = None,
        description: Optional[str] = None,
    ) -> int:
        if basquin_a_mpa is None:
            basquin_a_mpa = round(ultimate_strength_mpa * 1.3, 1)
        if basquin_b_exponent is None:
            basquin_b_exponent = -0.100

        conn = sqlite3.connect(self.materials_db_path)
        cursor = conn.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO materials (
                    name, category, density_kg_m3, elastic_modulus_gpa, poissons_ratio,
                    yield_strength_mpa, ultimate_strength_mpa, cte_per_k,
                    basquin_a_mpa, basquin_b_exponent, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    name, category, density_kg_m3, elastic_modulus_gpa, poissons_ratio,
                    yield_strength_mpa, ultimate_strength_mpa, cte_per_k,
                    basquin_a_mpa, basquin_b_exponent, description or "Özel kullanıcı tanımlı malzeme"
                ),
            )
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()

    def list_materials(self) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.materials_db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, category, density_kg_m3, elastic_modulus_gpa,
                   poissons_ratio, yield_strength_mpa, ultimate_strength_mpa,
                   cte_per_k, basquin_a_mpa, basquin_b_exponent, description
            FROM materials
        """)
        rows = cursor.fetchall()
        conn.close()
        return [
            {
                "id": r[0],
                "name": r[1],
                "category": r[2],
                "density_kg_m3": r[3],
                "elastic_modulus_gpa": r[4],
                "poissons_ratio": r[5],
                "yield_strength_mpa": r[6],
                "ultimate_strength_mpa": r[7],
                "cte_per_k": r[8],
                "basquin_a_mpa": r[9],
                "basquin_b_exponent": r[10],
                "description": r[11]
            }
            for r in rows
        ]

    def get_material(self, material_name: str) -> Dict[str, Any]:
        conn = sqlite3.connect(self.materials_db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, category, density_kg_m3, elastic_modulus_gpa,
                   poissons_ratio, yield_strength_mpa, ultimate_strength_mpa,
                   cte_per_k, basquin_a_mpa, basquin_b_exponent, description
            FROM materials WHERE name = ?
        """, (material_name,))
        r = cursor.fetchone()
        conn.close()
        if not r:
            raise ValueError(f"Malzeme bulunamadı: '{material_name}'")
        return {
            "id": r[0],
            "name": r[1],
            "category": r[2],
            "density_kg_m3": r[3],
            "elastic_modulus_gpa": r[4],
            "poissons_ratio": r[5],
            "yield_strength_mpa": r[6],
            "ultimate_strength_mpa": r[7],
            "cte_per_k": r[8],
            "basquin_a_mpa": r[9],
            "basquin_b_exponent": r[10],
            "description": r[11]
        }

    @staticmethod
    def calculate_grms(breakpoints: List[Dict[str, float]]) -> float:
        """
        Rastgele titreşim PSD eğrisinin log-log integralini alarak
        toplam Grms değerini analitik olarak hesaplar.
        """
        if len(breakpoints) < 2:
            return 0.0

        total_area = 0.0
        for i in range(len(breakpoints) - 1):
            f1 = breakpoints[i]["frequency_hz"]
            w1 = breakpoints[i]["psd_value"]
            f2 = breakpoints[i + 1]["frequency_hz"]
            w2 = breakpoints[i + 1]["psd_value"]

            if f1 <= 0 or f2 <= 0 or w1 <= 0 or w2 <= 0:
                continue

            # Logaritmik eğim (slope m)
            m = math.log10(w2 / w1) / math.log10(f2 / f1)

            # İntegral alanı
            if abs(m + 1.0) > 1e-6:
                # m != -1
                area = (w1 / (f1**m * (m + 1.0))) * (f2**(m + 1.0) - f1**(m + 1.0))
            else:
                # m == -1
                area = w1 * f1 * math.log(f2 / f1)

            total_area += area

        return round(math.sqrt(max(0.0, total_area)), 3)

    def evaluate_mission_profile(
        self,
        platform_name: str,
        payload_mass_kg: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Platform seçimine göre MIL-STD-810H titreşim, sıcaklık ve şok profillerini çeker,
        Grms değerini doğrular ve kütle düzeltme faktörünü hesaplar.
        """
        conn = sqlite3.connect(self.standards_db_path)
        cursor = conn.cursor()

        # 1. Platform Bilgisi
        cursor.execute("""
            SELECT id, platform_name, platform_category, standard_code, description
            FROM military_platforms WHERE platform_name = ?
        """, (platform_name,))
        platform_row = cursor.fetchone()
        if not platform_row:
            conn.close()
            raise ValueError(f"Platform bulunamadı: '{platform_name}'")

        p_id, p_name, p_cat, std_code, desc = platform_row

        # 2. Titreşim Profili
        cursor.execute("""
            SELECT id, method_code, category_id, annex_figure, calculated_grms,
                   duration_per_axis_minutes, axes, mass_attenuation_applicable
            FROM vibration_profiles WHERE platform_id = ?
        """, (p_id,))
        vib_row = cursor.fetchone()

        if not vib_row:
            conn.close()
            raise ValueError(f"Platforma ait titreşim profili bulunamadı: '{platform_name}'")

        v_id, method_code, cat_id, annex_fig, nominal_grms, duration_min, axes_str, mass_atten_flag = vib_row

        # 3. Breakpoint'ler
        cursor.execute("""
            SELECT frequency_hz, psd_value, slope_db_oct
            FROM vibration_breakpoints WHERE profile_id = ? ORDER BY seq_order
        """, (v_id,))
        bp_rows = cursor.fetchall()
        breakpoints = [
            {"frequency_hz": r[0], "psd_value": r[1], "slope_db_oct": r[2]}
            for r in bp_rows
        ]

        # Sayısal Grms Hesabı ve Doğrulaması
        integrated_grms = self.calculate_grms(breakpoints)

        # Kütle Zayıflatma Faktörü (Mass Attenuation)
        effective_grms = integrated_grms
        attenuation_factor = 1.0
        if mass_atten_flag and payload_mass_kg and payload_mass_kg > 20.0:
            # MIL-STD-810H Method 514.8 Annex C: Grms_eff = Grms_nom * (20 / M)^0.15
            attenuation_factor = round((20.0 / payload_mass_kg) ** 0.15, 3)
            effective_grms = round(integrated_grms * attenuation_factor, 2)

        # 4. Sıcaklık Profili
        cursor.execute("""
            SELECT climatic_category, operational_high_c, storage_high_c,
                   operational_low_c, storage_low_c
            FROM temperature_profiles WHERE platform_id = ?
        """, (p_id,))
        temp_row = cursor.fetchone()
        temperature_data = {}
        if temp_row:
            temperature_data = {
                "method_code": "501.7 / 502.7",
                "climatic_category": temp_row[0],
                "operational_high_c": temp_row[1],
                "storage_high_c": temp_row[2],
                "operational_low_c": temp_row[3],
                "storage_low_c": temp_row[4]
            }

        # 5. Şok Profili
        cursor.execute("""
            SELECT procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis
            FROM shock_profiles WHERE platform_id = ?
        """, (p_id,))
        shock_row = cursor.fetchone()
        shock_data = {}
        if shock_row:
            shock_data = {
                "method_code": "516.8",
                "procedure_name": shock_row[0],
                "pulse_shape": shock_row[1],
                "peak_acceleration_g": shock_row[2],
                "duration_ms": shock_row[3],
                "num_shocks_per_axis": shock_row[4]
            }

        conn.close()

        return {
            "platform": {
                "name": p_name,
                "category": p_cat,
                "standard": std_code,
                "description": desc
            },
            "vibration": {
                "method": f"Method {method_code}",
                "category": f"Category {cat_id}",
                "annex_figure": annex_fig,
                "nominal_grms": nominal_grms,
                "integrated_grms": integrated_grms,
                "effective_grms": effective_grms,
                "attenuation_factor": attenuation_factor,
                "duration_per_axis_minutes": duration_min,
                "axes": [a.strip() for a in axes_str.split(",")],
                "frequency_range_hz": [breakpoints[0]["frequency_hz"], breakpoints[-1]["frequency_hz"]],
                "breakpoints": breakpoints
            },
            "temperature": temperature_data,
            "shock": shock_data
        }

    def evaluate_profile(
        self,
        platform_id: Optional[int] = None,
        platform_name: Optional[str] = None,
        part_mass_kg: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        platform_id veya platform_name ile profil sorgulaması yapar.
        """
        if platform_id is not None:
            conn = sqlite3.connect(self.standards_db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT platform_name FROM military_platforms WHERE id = ?", (platform_id,))
            row = cursor.fetchone()
            conn.close()
            if not row:
                raise ValueError(f"Platform id bulunamadı: {platform_id}")
            p_name = row[0]
        elif platform_name:
            p_name = platform_name
        else:
            raise ValueError("platform_id veya platform_name belirtilmelidir.")

        return self.evaluate_mission_profile(platform_name=p_name, payload_mass_kg=part_mass_kg)

