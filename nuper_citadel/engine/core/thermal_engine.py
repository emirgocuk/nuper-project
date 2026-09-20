"""
Nuper Citadel - Thermal Analysis Engine (MIL-STD-810H Methods 501.7 & 502.7)
============================================================================
Deterministic evaluation of:
1. Dimensional thermal expansion and contraction (Delta L = L0 * alpha * Delta T).
2. Clamped flange / body vs. fastener differential CTE mismatch (e.g. Al body vs. Steel bolt).
3. Hot condition fastener yield verification (pre-load + thermal expansion stress <= Sy).
4. Cold condition fastener pre-load relaxation / joint separation verification.
5. Fully constrained thermal stress and margin of safety (MS).
"""

import math
from typing import Any, Dict, List, Optional


class ThermalEngine:
    """
    MIL-STD-810H Method 501.7 (High Temperature) and Method 502.7 (Low Temperature)
    thermal expansion and differential joint stress engine.
    """

    T_REF = 20.0  # Standard room / assembly temperature in Celsius

    # Typical fastener materials default properties
    FASTENER_PROPERTIES = {
        "Steel Grade 8.8": {
            "name": "Steel Grade 8.8",
            "elastic_modulus_gpa": 205.0,
            "cte_per_k": 12.3e-6,
            "yield_strength_mpa": 640.0,
            "ultimate_strength_mpa": 800.0,
        },
        "Steel Grade 10.9": {
            "name": "Steel Grade 10.9",
            "elastic_modulus_gpa": 205.0,
            "cte_per_k": 12.3e-6,
            "yield_strength_mpa": 900.0,
            "ultimate_strength_mpa": 1000.0,
        },
        "Stainless Steel A2-70 (304)": {
            "name": "Stainless Steel A2-70 (304)",
            "elastic_modulus_gpa": 193.0,
            "cte_per_k": 17.2e-6,
            "yield_strength_mpa": 450.0,
            "ultimate_strength_mpa": 700.0,
        },
        "Titanium Ti-6Al-4V Grade 5": {
            "name": "Titanium Ti-6Al-4V Grade 5",
            "elastic_modulus_gpa": 113.8,
            "cte_per_k": 8.6e-6,
            "yield_strength_mpa": 880.0,
            "ultimate_strength_mpa": 950.0,
        },
        "Inconel 718 Fastener": {
            "name": "Inconel 718 Fastener",
            "elastic_modulus_gpa": 205.0,
            "cte_per_k": 13.0e-6,
            "yield_strength_mpa": 1100.0,
            "ultimate_strength_mpa": 1375.0,
        },
    }

    # ISO Metric thread tensile stress areas (mm^2)
    THREAD_AREAS = {
        "M2": 2.07,
        "M2.5": 3.39,
        "M3": 5.03,
        "M4": 8.78,
        "M5": 14.2,
        "M6": 20.1,
        "M8": 36.6,
        "M10": 58.0,
        "M12": 84.3,
    }

    @classmethod
    def evaluate_thermal_qualification(
        cls,
        body_material_name: str,
        body_cte_per_k: float,
        body_elastic_modulus_gpa: float,
        body_yield_strength_mpa: float,
        dimensions_mm: Dict[str, float],
        operational_high_c: float = 71.0,
        operational_low_c: float = -40.0,
        storage_high_c: float = 85.0,
        storage_low_c: float = -51.0,
        fastener_material_key: str = "Steel Grade 8.8",
        fastener_size: str = "M4",
        grip_length_mm: float = 15.0,
        initial_preload_n: Optional[float] = None,
        dynamic_load_per_bolt_n: float = 250.0,
    ) -> Dict[str, Any]:
        """
        Executes complete MIL-STD-810H Method 501.7 / 502.7 thermal stress and pre-load check.
        """
        # Fastener material setup
        fastener = cls.FASTENER_PROPERTIES.get(
            fastener_material_key, cls.FASTENER_PROPERTIES["Steel Grade 8.8"]
        )
        fastener_cte = fastener["cte_per_k"]
        fastener_e_mpa = fastener["elastic_modulus_gpa"] * 1000.0  # GPa to MPa
        fastener_sy_mpa = fastener["yield_strength_mpa"]

        # Body material setup
        body_e_mpa = body_elastic_modulus_gpa * 1000.0  # GPa to MPa
        body_sy_mpa = body_yield_strength_mpa

        # Dimensions
        lx = dimensions_mm.get("length", 100.0)
        ly = dimensions_mm.get("width", 80.0)
        lz = dimensions_mm.get("height", 30.0)

        # 1. Delta T Calculations (from Reference 20 C)
        dt_op_hot = operational_high_c - cls.T_REF
        dt_op_cold = operational_low_c - cls.T_REF
        dt_stor_hot = storage_high_c - cls.T_REF
        dt_stor_cold = storage_low_c - cls.T_REF

        # 2. Free Thermal Expansion / Contraction (Operational Extremes)
        delta_lx_hot = lx * body_cte_per_k * dt_op_hot
        delta_ly_hot = ly * body_cte_per_k * dt_op_hot
        delta_lz_hot = lz * body_cte_per_k * dt_op_hot

        delta_lx_cold = lx * body_cte_per_k * dt_op_cold
        delta_ly_cold = ly * body_cte_per_k * dt_op_cold
        delta_lz_cold = lz * body_cte_per_k * dt_op_cold

        # 3. Fastener Tensile Area and Initial Preload
        bolt_area = cls.THREAD_AREAS.get(fastener_size, 8.78)  # default M4
        if initial_preload_n is None:
            # 65% of proof stress: F_preload = 0.65 * S_y * A_bolt
            initial_preload_n = 0.65 * fastener_sy_mpa * bolt_area

        initial_preload_stress_mpa = initial_preload_n / bolt_area

        # 4. Joint Elastic Stiffness & Differential CTE (VDI 2230)
        # Joint compliance factor Phi (typically 0.20 for metal-to-metal flange)
        phi_joint = 0.22
        delta_cte = body_cte_per_k - fastener_cte

        # Thermal force change on bolt:
        # Delta F_th = (1 - Phi) * A_bolt * E_bolt * (alpha_body - alpha_fastener) * Delta T
        delta_f_th_hot = (1.0 - phi_joint) * bolt_area * fastener_e_mpa * delta_cte * dt_op_hot
        delta_sigma_th_hot = delta_f_th_hot / bolt_area

        delta_f_th_cold = (1.0 - phi_joint) * bolt_area * fastener_e_mpa * delta_cte * dt_op_cold
        delta_sigma_th_cold = delta_f_th_cold / bolt_area

        # 5. Hot Operational Condition Check (Fastener Yield Risk)
        # When alpha_body > alpha_fastener, heating stretches bolt further
        bolt_load_hot_n = initial_preload_n + delta_f_th_hot
        bolt_stress_hot_mpa = initial_preload_stress_mpa + delta_sigma_th_hot

        ms_yield_hot = (fastener_sy_mpa / max(bolt_stress_hot_mpa, 1.0)) - 1.0
        hot_pass = ms_yield_hot >= 0.0

        # 6. Cold Operational Condition Check (Preload Loss & Separation Risk)
        # When alpha_body > alpha_fastener, cooling shrinks body faster, relaxing bolt
        bolt_load_cold_n = max(initial_preload_n + delta_f_th_cold, 0.0)
        preload_retention_pct = (bolt_load_cold_n / max(initial_preload_n, 1.0)) * 100.0

        # Margin of safety against separation under dynamic vibration load
        ms_separation_cold = (bolt_load_cold_n / max(dynamic_load_per_bolt_n, 1.0)) - 1.0
        cold_pass = (bolt_load_cold_n > 0.0) and (ms_separation_cold >= 0.15)

        # 7. Fully Constrained Boundary Thermal Stress (Worst-Case Constrained Plate)
        # sigma_constrained = E_body * alpha_body * |Delta T_max|
        max_dt = max(abs(dt_op_hot), abs(dt_op_cold))
        max_constrained_stress_mpa = body_e_mpa * body_cte_per_k * max_dt
        ms_body_constrained = (body_sy_mpa / max(max_constrained_stress_mpa, 1.0)) - 1.0

        # 8. Overall Qualification Assessment
        if hot_pass and cold_pass:
            status = "PASS"
            summary_note = (
                f"MIL-STD-810H Metot 501.7 (+{operational_high_c:.0f}°C) ve Metot 502.7 "
                f"({operational_low_c:.0f}°C) termal kalifikasyon kriterlerini tam sağlar. "
                f"Sıcakta cıvata güvenlik marjı MS=+{ms_yield_hot:.2f}, soğukta ön yük koruma oranı %{preload_retention_pct:.1f}."
            )
        elif hot_pass and not cold_pass:
            status = "MARGINAL_COLD_RELAXATION"
            summary_note = (
                f"Düşük sıcaklıkta ({operational_low_c:.0f}°C) diferansiyel büzülme nedeniyle "
                f"cıvata ön yükü %{100.0 - preload_retention_pct:.1f} gevşemektedir. "
                "Disk yay (Belleville washer) veya Helicoil vida kilitleyici kullanımı önerilir."
            )
        elif not hot_pass and cold_pass:
            status = "MARGINAL_HOT_YIELD"
            summary_note = (
                f"Yüksek sıcaklıkta (+{operational_high_c:.0f}°C) ısıl gerilme cıvata akma limitine "
                f"yaklaşmaktadır (MS={ms_yield_hot:.2f}). 10.9 kalite cıvata veya Titanyum cıvata önerilir."
            )
        else:
            status = "FAIL"
            summary_note = (
                "Hem aşırı sıcakta akma hem de aşırı soğukta cıvata ön yük kaybı riski tespit edildi. "
                "Bağlantı arayüzü geometrisi ve malzeme seçimi revize edilmelidir."
            )

        return {
            "standards": ["MIL-STD-810H Method 501.7", "MIL-STD-810H Method 502.7"],
            "temperature_profile": {
                "t_ref_c": cls.T_REF,
                "operational_high_c": operational_high_c,
                "operational_low_c": operational_low_c,
                "storage_high_c": storage_high_c,
                "storage_low_c": storage_low_c,
                "dt_op_hot_c": dt_op_hot,
                "dt_op_cold_c": dt_op_cold,
            },
            "body_expansion": {
                "material": body_material_name,
                "cte_ppm_per_k": round(body_cte_per_k * 1e6, 2),
                "hot_delta_mm": {
                    "dx": round(delta_lx_hot, 4),
                    "dy": round(delta_ly_hot, 4),
                    "dz": round(delta_lz_hot, 4),
                },
                "cold_delta_mm": {
                    "dx": round(delta_lx_cold, 4),
                    "dy": round(delta_ly_cold, 4),
                    "dz": round(delta_lz_cold, 4),
                },
                "max_constrained_stress_mpa": round(max_constrained_stress_mpa, 2),
                "ms_body_constrained": round(ms_body_constrained, 2),
            },
            "joint_thermal_analysis": {
                "fastener_material": fastener["name"],
                "fastener_size": fastener_size,
                "fastener_cte_ppm_per_k": round(fastener_cte * 1e6, 2),
                "delta_cte_ppm_per_k": round(delta_cte * 1e6, 2),
                "initial_preload_n": round(initial_preload_n, 1),
                "initial_preload_stress_mpa": round(initial_preload_stress_mpa, 1),
                "hot_condition": {
                    "temp_c": operational_high_c,
                    "delta_load_n": round(delta_f_th_hot, 1),
                    "total_bolt_load_n": round(bolt_load_hot_n, 1),
                    "total_bolt_stress_mpa": round(bolt_stress_hot_mpa, 1),
                    "fastener_yield_strength_mpa": fastener_sy_mpa,
                    "margin_of_safety_yield": round(ms_yield_hot, 2),
                    "passed": hot_pass,
                },
                "cold_condition": {
                    "temp_c": operational_low_c,
                    "delta_load_n": round(delta_f_th_cold, 1),
                    "residual_preload_n": round(bolt_load_cold_n, 1),
                    "preload_retention_pct": round(preload_retention_pct, 1),
                    "dynamic_load_per_bolt_n": dynamic_load_per_bolt_n,
                    "margin_of_safety_separation": round(ms_separation_cold, 2),
                    "passed": cold_pass,
                },
            },
            "qualification_status": status,
            "engineering_summary": summary_note,
        }
