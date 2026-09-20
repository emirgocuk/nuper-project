import math
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict


@dataclass
class FastenerRecommendation:
    hole_index: int
    hole_id: str
    hole_diameter_mm: float
    center_pos_mm: Dict[str, float]
    thread_size: str             # e.g. "M6"
    standard_spec: str           # e.g. "DIN 912 (ISO 4762) Soket Başlı Silindirik Cıvata"
    recommended_grade: str       # e.g. "8.8" or "A2-70"
    pitch_mm: float              # e.g. 1.0 mm
    stress_area_mm2: float       # Diş dibi gerilme alanı At (mm^2)
    proof_strength_mpa: float    # Akma / Deney gerilmesi Sp (MPa)
    recommended_torque_nm: float # Önerilen sıkma torku T = k * D * Fi (N*m)
    preload_force_kn: float      # Cıvata ön gerilme kuvveti Fi (kN)
    washer_recommendation: str   # e.g. "Nord-Lock NL6 Çift Kamalı Kilitli Rondela"
    vibration_risk_assessment: str # Askeri titreşim gevşeme risk değerlendirmesi


class FastenerEngine:
    """
    OpenCASCADE tarafından tespit edilen montaj delikleri ve gövde kütlesine göre
    askeri standartlarda cıvata, tork ve bağlantı emniyeti kurallarını belirleyen motor.
    """

    METRIC_BOLT_DATABASE = {
        "M3": {"nominal_d": 3.0, "pitch": 0.5, "stress_area": 5.03, "hole_min": 3.1, "hole_max": 3.6},
        "M4": {"nominal_d": 4.0, "pitch": 0.7, "stress_area": 8.78, "hole_min": 4.1, "hole_max": 4.8},
        "M5": {"nominal_d": 5.0, "pitch": 0.8, "stress_area": 14.2, "hole_min": 5.1, "hole_max": 5.8},
        "M6": {"nominal_d": 6.0, "pitch": 1.0, "stress_area": 20.1, "hole_min": 6.1, "hole_max": 7.0},
        "M8": {"nominal_d": 8.0, "pitch": 1.25, "stress_area": 36.6, "hole_min": 8.2, "hole_max": 9.2},
        "M10": {"nominal_d": 10.0, "pitch": 1.5, "stress_area": 58.0, "hole_min": 10.2, "hole_max": 11.8},
        "M12": {"nominal_d": 12.0, "pitch": 1.75, "stress_area": 84.3, "hole_min": 12.5, "hole_max": 14.2},
        "M16": {"nominal_d": 16.0, "pitch": 2.0, "stress_area": 157.0, "hole_min": 16.5, "hole_max": 18.5},
    }

    BOLT_GRADES = {
        "8.8": {"proof_strength_mpa": 580.0, "tensile_strength_mpa": 800.0, "desc": "Orta Mukavemetli Karbon Çeliği"},
        "10.9": {"proof_strength_mpa": 830.0, "tensile_strength_mpa": 1040.0, "desc": "Yüksek Mukavemetli Alaşımlı Çelik (Ağır Gövde & Şok)"},
        "A2-70": {"proof_strength_mpa": 450.0, "tensile_strength_mpa": 700.0, "desc": "Östenitik Paslanmaz Çelik (Korozyon Dirençli)"}
    }

    @classmethod
    def match_metric_thread(cls, hole_diameter_mm: float) -> Optional[str]:
        """Delik çapını en yakın ISO 273 cıvata çapıyla eşleştirir."""
        for name, spec in cls.METRIC_BOLT_DATABASE.items():
            if spec["hole_min"] <= hole_diameter_mm <= spec["hole_max"]:
                return name
            if abs(hole_diameter_mm - spec["nominal_d"]) <= 0.20:
                return name
        return None

    def evaluate_fasteners(
        self,
        holes: List[Dict[str, Any]],
        chassis_mass_kg: float = 1.0,
        hcg_mm: float = 20.0,
        preferred_grade: str = "8.8",
        friction_factor_k: float = 0.18
    ) -> Dict[str, Any]:
        """
        Tespit edilen delik listesini analiz eder; her delik için cıvata tipi,
        sıkma torku, ön gerilme yükü ve askeri titreşim kilit mekanizması üretir.
        """
        if preferred_grade not in self.BOLT_GRADES:
            preferred_grade = "8.8"

        grade_info = self.BOLT_GRADES[preferred_grade]
        sp = grade_info["proof_strength_mpa"]

        recommendations: List[FastenerRecommendation] = []
        pattern_summary: Dict[str, int] = {}
        total_clamping_force_kn = 0.0

        for idx, h in enumerate(holes):
            h_id = h.get("hole_id") or f"H{idx + 1}"
            d_mm = float(h.get("diameter_mm", h.get("diameter", 6.5)))
            center = h.get("center") or {"x": h.get("x", 0.0), "y": h.get("y", 0.0), "z": h.get("z", 0.0)}

            thread_name = self.match_metric_thread(d_mm) or ("M6" if d_mm <= 7.0 else "M8")
            bolt_spec = self.METRIC_BOLT_DATABASE.get(thread_name, self.METRIC_BOLT_DATABASE["M6"])

            # Sayım
            pattern_summary[thread_name] = pattern_summary.get(thread_name, 0) + 1

            # Ön Yük Hesabı: Fi = 0.75 * At * Sp (Askeri standartlarda elastik sınırın %75'i)
            at = bolt_spec["stress_area"]
            preload_n = 0.75 * at * sp
            preload_kn = round(preload_n / 1000.0, 2)
            total_clamping_force_kn += preload_kn

            # Tork Hesabı: T = k * D * Fi [N*m]
            nom_d_m = bolt_spec["nominal_d"] * 1e-3
            torque_nm = round(friction_factor_k * nom_d_m * preload_n, 1)

            # Titreşim Risk Değerlendirmesi
            # Gövde ağırsa veya hcg yüksekse gevşeme riski artar
            dynamic_risk = "DÜŞÜK (Standart Ön Yük Yeterli)"
            if chassis_mass_kg > 5.0 or hcg_mm > 50.0:
                dynamic_risk = "YÜKSEK (MIL-STD-810H Titreşimi Altında Kamalı Kilit / Nord-Lock Zorunlu)"
            elif chassis_mass_kg > 2.0:
                dynamic_risk = "ORTA (Yaylı Rondela veya Loctite 243 Orta Mukavemetli Sabitleyici Önerilir)"

            rec = FastenerRecommendation(
                hole_index=idx + 1,
                hole_id=h_id,
                hole_diameter_mm=round(d_mm, 2),
                center_pos_mm={"x": round(center.get("x", 0.0), 2), "y": round(center.get("y", 0.0), 2), "z": round(center.get("z", 0.0), 2)},
                thread_size=thread_name,
                standard_spec=f"DIN 912 (ISO 4762) {thread_name} Soket Başlı Silindirik Cıvata",
                recommended_grade=f"Sınıf {preferred_grade} ({grade_info['desc']})",
                pitch_mm=bolt_spec["pitch"],
                stress_area_mm2=bolt_spec["stress_area"],
                proof_strength_mpa=sp,
                recommended_torque_nm=torque_nm,
                preload_force_kn=preload_kn,
                washer_recommendation=f"Nord-Lock NL{bolt_spec['nominal_d']:.0f} Çift Kamalı Emniyet Rondelası",
                vibration_risk_assessment=dynamic_risk
            )
            recommendations.append(rec)

        # Montaj Direktifleri
        directives = [
            f"Toplam {len(holes)} adet montaj noktası için toplam {round(total_clamping_force_kn, 1)} kN arayüz baskı kuvveti hesaplandı.",
            "Tüm cıvatalar çapraz (yıldız) sıkma deseni ile ve 2 kademede (önce %50 tork, ardından nihai tork) torklanmalıdır.",
            "MIL-STD-810H titreşim testlerinde cıvata kafalarına test öncesi tork kontrol çizgisi (Torque Seal / Tamper Proof) çekilmesi zorunludur."
        ]

        return {
            "total_holes_count": len(holes),
            "pattern_summary": pattern_summary,
            "chassis_mass_kg": chassis_mass_kg,
            "overturning_moment_arm_mm": hcg_mm,
            "total_clamping_force_kn": round(total_clamping_force_kn, 2),
            "selected_grade": preferred_grade,
            "fasteners": [asdict(r) for r in recommendations],
            "directives": directives
        }
