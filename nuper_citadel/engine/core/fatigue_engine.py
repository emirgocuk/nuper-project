import math
from typing import Dict, Any, Optional


class FatigueEngine:
    """
    Rastgele titreşim altında Steinberg 3-Bant Gauss dağılımı ve Basquin S-N eğrisi
    kullanarak Palmgren-Miner kümülatif yorulma hasarını (D) hesaplar.
    """

    # Steinberg 3-Bant Normal Dağılım Çevrim Oranları
    BAND_1_SIGMA_RATIO = 0.6830  # Zamanın %68.3'ü
    BAND_2_SIGMA_RATIO = 0.2710  # Zamanın %27.1'i
    BAND_3_SIGMA_RATIO = 0.0433  # Zamanın %4.33'ü

    # Askeri Kabul Eşik Değerleri
    THEORETICAL_FAILURE_LIMIT = 1.0
    DEFENSE_CONSERVATIVE_LIMIT = 0.20  # Havacılık/savunma emniyet hedefi (D <= 0.20)

    @staticmethod
    def calculate_allowable_cycles(stress_mpa: float, basquin_a: float, basquin_b: float) -> float:
        """
        Basquin S-N denklemi: sigma = A * N^b  ==>  N = (sigma / A)^(1 / b)
        """
        if stress_mpa <= 0.0 or basquin_a <= 0.0 or basquin_b >= 0.0:
            return 1e12  # Sonsuz ömür varsayımı

        ratio = stress_mpa / basquin_a
        if ratio <= 0.0:
            return 1e12

        exponent = 1.0 / basquin_b
        try:
            cycles = ratio ** exponent
            return max(1.0, min(cycles, 1e12))
        except (OverflowError, ValueError):
            return 1e12

    def evaluate_vibration_fatigue(
        self,
        resonant_freq_hz: float,
        rms_stress_1sigma_mpa: float,
        test_duration_seconds: float,
        basquin_a_mpa: float,
        basquin_b_exponent: float,
        yield_strength_mpa: float,
        safety_factor: float = 1.25
    ) -> Dict[str, Any]:
        """
        1-Sigma RMS gerilme, doğal frekans ve test süresinden
        Miner kümülatif hasar indeksini ve emniyet marjını hesaplar.
        """
        # Toplam çevrim sayısı N_total = f0 * T
        total_cycles = resonant_freq_hz * test_duration_seconds

        n1 = self.BAND_1_SIGMA_RATIO * total_cycles
        n2 = self.BAND_2_SIGMA_RATIO * total_cycles
        n3 = self.BAND_3_SIGMA_RATIO * total_cycles

        sigma_1 = 1.0 * rms_stress_1sigma_mpa
        sigma_2 = 2.0 * rms_stress_1sigma_mpa
        sigma_3 = 3.0 * rms_stress_1sigma_mpa

        N1 = self.calculate_allowable_cycles(sigma_1, basquin_a_mpa, basquin_b_exponent)
        N2 = self.calculate_allowable_cycles(sigma_2, basquin_a_mpa, basquin_b_exponent)
        N3 = self.calculate_allowable_cycles(sigma_3, basquin_a_mpa, basquin_b_exponent)

        d1 = n1 / N1 if N1 > 0 else 0.0
        d2 = n2 / N2 if N2 > 0 else 0.0
        d3 = n3 / N3 if N3 > 0 else 0.0

        total_damage_d = d1 + d2 + d3
        life_consumed_percent = round(total_damage_d * 100.0, 2)

        # Statik Akma Marjı (Margin of Safety - MS)
        allowable_stress = yield_strength_mpa / safety_factor
        margin_of_safety = round((allowable_stress / sigma_3) - 1.0, 2) if sigma_3 > 0 else 99.0

        is_yield_safe = margin_of_safety >= 0.0
        is_fatigue_safe = total_damage_d <= self.DEFENSE_CONSERVATIVE_LIMIT

        # Kalan güvenli test süresi tahmini
        remaining_safe_hours = 0.0
        if total_damage_d > 0.0:
            current_hours = test_duration_seconds / 3600.0
            damage_rate_per_hour = total_damage_d / current_hours
            if damage_rate_per_hour > 0:
                remaining_safe_hours = round((self.DEFENSE_CONSERVATIVE_LIMIT - total_damage_d) / damage_rate_per_hour, 1)
                remaining_safe_hours = max(0.0, remaining_safe_hours)

        return {
            "inputs": {
                "resonant_frequency_hz": resonant_freq_hz,
                "rms_stress_1sigma_mpa": rms_stress_1sigma_mpa,
                "peak_stress_3sigma_mpa": round(sigma_3, 2),
                "test_duration_hours": round(test_duration_seconds / 3600.0, 2),
                "material_yield_mpa": yield_strength_mpa
            },
            "bands_breakdown": [
                {
                    "band": "1-Sigma (68.3%)",
                    "stress_mpa": round(sigma_1, 2),
                    "applied_cycles": int(n1),
                    "allowable_cycles": int(N1),
                    "damage_fraction": round(d1, 6)
                },
                {
                    "band": "2-Sigma (27.1%)",
                    "stress_mpa": round(sigma_2, 2),
                    "applied_cycles": int(n2),
                    "allowable_cycles": int(N2),
                    "damage_fraction": round(d2, 6)
                },
                {
                    "band": "3-Sigma (4.33%)",
                    "stress_mpa": round(sigma_3, 2),
                    "applied_cycles": int(n3),
                    "allowable_cycles": int(N3),
                    "damage_fraction": round(d3, 6)
                }
            ],
            "fatigue_results": {
                "cumulative_damage_index_D": round(total_damage_d, 4),
                "life_consumed_percent": life_consumed_percent,
                "defense_limit_D": self.DEFENSE_CONSERVATIVE_LIMIT,
                "is_fatigue_safe": is_fatigue_safe,
                "remaining_safe_vibration_hours": remaining_safe_hours
            },
            "static_yield_check": {
                "peak_stress_3sigma_mpa": round(sigma_3, 2),
                "allowable_yield_mpa": round(allowable_stress, 2),
                "margin_of_safety": margin_of_safety,
                "is_yield_safe": is_yield_safe
            },
            "overall_qualification_verdict": "PASS" if (is_yield_safe and is_fatigue_safe) else "FAIL"
        }
