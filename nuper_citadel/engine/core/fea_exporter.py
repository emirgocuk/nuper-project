import math
from typing import List, Dict, Any, Tuple


class FEAExporter:
    """
    Simcenter NX, ANSYS Mechanical ve Abaqus için log-log interpolasyonlu
    PSD titreşim spektrum tabloları ve simülasyon sınır şartı yönergeleri üretir.
    """

    @staticmethod
    def interpolate_psd_log_log(
        breakpoints: List[Dict[str, float]],
        num_points: int = 120
    ) -> List[Tuple[float, float]]:
        """
        Frekans kırılma noktaları arasında log-log enterpolasyon yaparak
        FEA çözücüsünün doğru mod entegrasyonu için 100+ ayrık frekans noktası üretir.
        """
        if len(breakpoints) < 2:
            return [(bp["frequency_hz"], bp["psd_value"]) for bp in breakpoints]

        f_start = breakpoints[0]["frequency_hz"]
        f_end = breakpoints[-1]["frequency_hz"]

        log_f_start = math.log10(f_start)
        log_f_end = math.log10(f_end)
        step = (log_f_end - log_f_start) / (num_points - 1)

        interpolated_points = []

        for i in range(num_points):
            f_current = 10 ** (log_f_start + i * step)

            # İlgili segmenti bul
            val = breakpoints[0]["psd_value"]
            for seg in range(len(breakpoints) - 1):
                f1 = breakpoints[seg]["frequency_hz"]
                w1 = breakpoints[seg]["psd_value"]
                f2 = breakpoints[seg + 1]["frequency_hz"]
                w2 = breakpoints[seg + 1]["psd_value"]

                if f1 <= f_current <= f2 or (seg == len(breakpoints) - 2 and f_current >= f2):
                    if f1 == f2 or w1 == w2:
                        val = w1
                    else:
                        m = math.log10(w2 / w1) / math.log10(f2 / f1)
                        val = w1 * ((f_current / f1) ** m)
                    break

            interpolated_points.append((round(f_current, 2), round(val, 6)))

        return interpolated_points

    def generate_nx_ansys_csv(
        self,
        platform_name: str,
        standard_code: str,
        category: str,
        target_grms: float,
        breakpoints: List[Dict[str, float]],
        num_points: int = 120
    ) -> str:
        """
        Simcenter NX Response Simulation ve ANSYS Mechanical Random Vibration
        modüllerinin doğrudan sürükle-bırak ile okuduğu CSV metnini üretir.
        """
        points = self.interpolate_psd_log_log(breakpoints, num_points=num_points)

        lines = [
            f"## Nuper Citadel FEA Pre-Processor",
            f"## Platform: {platform_name}",
            f"## Standard: {standard_code} {category}",
            f"## Target Grms: {target_grms:.2f} g",
            f"## Interpolation: Log-Log Discrete Spectrum",
            f"Frequency(Hz),PSD(g^2/Hz)"
        ]

        for freq, psd in points:
            lines.append(f"{freq:.2f},{psd:.6f}")

        return "\n".join(lines)

    def generate_ansys_apdl_snippet(
        self,
        table_name: str,
        breakpoints: List[Dict[str, float]]
    ) -> str:
        """
        ANSYS MAPDL / Workbench Command Snippet formatında Table PSD kartları üretir.
        """
        points = self.interpolate_psd_log_log(breakpoints, num_points=50)
        lines = [
            f"! Nuper Citadel ANSYS APDL PSD Table Generator",
            f"*DIM,{table_name},TABLE,{len(points)},1,1,FREQ",
            f"! Frequency and Acceleration Spectral Density (g^2/Hz)"
        ]
        for idx, (f, psd) in enumerate(points, start=1):
            lines.append(f"{table_name}({idx},0) = {f:.2f}")
            lines.append(f"{table_name}({idx},1) = {psd:.6f}")
        return "\n".join(lines)

    def generate_simulation_directive(
        self,
        cad_info: Dict[str, Any],
        mission_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        FEA mühendisine adım adım modelleme, sınır şartları ve mod kuralı yönergesini derler.
        """
        holes_count = cad_info["mounting_interface"]["detected_holes_count"]
        span_diag = cad_info["mounting_interface"]["diagonal_span_mm"]
        f_max = mission_info["vibration"]["frequency_range_hz"][1]
        recommended_max_freq = max(2500.0, f_max * 1.25)

        return {
            "boundary_conditions": {
                "fixed_surfaces": f"Tabandaki {holes_count} adet montaj deliğinin silindirik yüzeyleri veya vida oturma halkaları",
                "constraint_type": "User Defined Fixed Support (UX, UY, UZ = 0, Rotasyonlar Serbest)",
                "recommended_connection": "RBE2 rijit elemanlar ile delik merkezleri tek bir master node'a bağlanarak taban ivmesi uygulanmalı"
            },
            "modal_setup": {
                "solution_type": "Simcenter NX SOL 103 / ANSYS Modal (Block Lanczos)",
                "frequency_cutoff_hz": recommended_max_freq,
                "effective_mass_rule": "Test eksenlerinde (X, Y, Z) kümülatif modal efektif kütle katılımı >= %85 olmalıdır.",
                "recommended_modes_count": "15 - 30 Mod"
            },
            "damping_recommendation": {
                "structural_damping_ratio": 0.02,
                "equivalent_q_factor": 25.0,
                "note": "Cıvatalı alüminyum gövdeler için MIL-HDBK-340A gereği %2 kritik sönümleme (zeta = 0.02) önerilir."
            },
            "acceptance_criteria": {
                "resonance_search": "Parçanın 1. doğal frekansı mümkünse standart pik bölgesinin (>200 Hz) üzerinde kalmalıdır.",
                "stress_evaluation": "Maksimum 3-Sigma RMS von Mises gerilmesi akma dayanımının (yield) 1.25 emniyet katsayısıyla altında kalmalıdır."
            }
        }
