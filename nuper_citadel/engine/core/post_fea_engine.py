import math
from typing import List, Dict, Any, Optional


class PostFEAEngine:
    """
    Sonlu Elemanlar Analizi (FEA) sonuçlarını (doğal frekanslar, pik von Mises gerilmesi)
    askeri çevre koşulları sınır şartlarına göre kapalı döngüde doğrulayan,
    rezonans kaçınma, dinamik büyütme (Q) ve MIL-STD-810H Notching hesabı yapan motor.
    """

    DEFAULT_SAFETY_FACTOR = 1.25  # Havacılık/Savunma yapısal emniyet katsayısı
    DEFAULT_DAMPING_RATIO = 0.02  # Metalik yapılar için nominal %2 sönümleme (Q=25)

    def evaluate_post_fea(
        self,
        resonant_frequencies_hz: List[float],
        peak_von_mises_stress_mpa: float,
        yield_strength_mpa: float,
        damping_ratio: float = DEFAULT_DAMPING_RATIO,
        safety_factor: float = DEFAULT_SAFETY_FACTOR,
        excitation_range_hz: Optional[List[float]] = None,
        platform_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        FEA mod analizinden ve dinamik gerilme çıktılarından
        kapalı döngü uygunluk doğrulaması yapar.
        """
        sorted_modes = sorted([f for f in resonant_frequencies_hz if f > 0.0])
        if not sorted_modes:
            f1 = 0.0
            f2 = 0.0
            f3 = 0.0
        else:
            f1 = sorted_modes[0]
            f2 = sorted_modes[1] if len(sorted_modes) > 1 else f1 * 2.0
            f3 = sorted_modes[2] if len(sorted_modes) > 2 else f2 * 1.5

        # 1. Dinamik Büyütme Faktörü (Q)
        damping = max(0.001, min(damping_ratio, 0.50))
        q_factor = round(1.0 / (2.0 * damping), 1)

        # 2. Rezonans Kaçınma Değerlendirmesi
        # Askeri standart kuralı: 1. mod frekansı f1 mümkünse 100-150 Hz üzerinde olmalı,
        # shaker alt bant tepe titreşimlerinden (20-80 Hz) uzak durmalıdır.
        if f1 <= 0.0:
            resonance_status = "UNKNOWN"
            resonance_message = "Geçerli modal frekans girilmedi."
        elif f1 < 60.0:
            resonance_status = "CRITICAL_RESONANCE"
            resonance_message = (
                f"Kritik Rezonans Riski: 1. doğal mod ({f1:.1f} Hz) sarsıcı alt bant "
                f"şok ve yüksek genlikli yer değiştirme bölgesinde (<60 Hz). Gövde aşırı salınım yapabilir."
            )
        elif f1 < 120.0:
            resonance_status = "WARNING"
            resonance_message = (
                f"Düşük Rijitlik Uyarısı: 1. doğal frekans ({f1:.1f} Hz) askeri spektrumun "
                f"yüksek enerjili bölgesinde. Montaj rijitliği veya et kalınlığı artırılmalı."
            )
        else:
            resonance_status = "SAFE"
            resonance_message = (
                f"Yüksek Rijitlik (Emniyetli): 1. doğal frekans ({f1:.1f} Hz) birincil "
                f"rezonans eşiğinin (>120 Hz) üzerinde. Gövde dinamik olarak kararlı."
            )

        # 3. İzin Verilen Gerilme ve Kapalı Döngü Emniyet Marjı (Margin of Safety - MS)
        allowable_stress = yield_strength_mpa / safety_factor
        if peak_von_mises_stress_mpa > 0.0:
            margin_of_safety = round((allowable_stress / peak_von_mises_stress_mpa) - 1.0, 2)
        else:
            margin_of_safety = 99.0

        is_yield_safe = margin_of_safety >= 0.0

        # 4. MIL-STD-810H Notching Değerlendirmesi
        # Eğer pik gerilme izin verilen sınırın üzerindeyse veya MS < 0.15 ise
        # test esnasında parçanın tahribatsız test edilebilmesi için rezonans frekansında
        # PSD girişine uygulanması gereken Notching (dB zayıflatma) derinliği hesaplanır.
        notching_required = False
        suggested_notch_depth_db = 0.0
        notch_band = [round(f1 * 0.90, 1), round(f1 * 1.10, 1)] if f1 > 0 else [0.0, 0.0]

        if peak_von_mises_stress_mpa > allowable_stress and peak_von_mises_stress_mpa > 0:
            notching_required = True
            # Delta dB = 20 * log10(allowable / peak)
            ratio = allowable_stress / peak_von_mises_stress_mpa
            if ratio > 0:
                suggested_notch_depth_db = round(20.0 * math.log10(ratio), 1)
        elif margin_of_safety < 0.10 and f1 < 250.0:
            # Rezonans bölgesinde çok dar marj
            notching_required = True
            suggested_notch_depth_db = -3.0

        # 5. Mühendislik Aksiyon Önerileri
        recommended_actions = []
        if not is_yield_safe:
            recommended_actions.append(
                f"KRİTİK GERİLME AŞIMI: Pik gerilme ({peak_von_mises_stress_mpa:.1f} MPa), "
                f"izin verilen sınırı ({allowable_stress:.1f} MPa) aşıyor (MS = {margin_of_safety}). "
                f"Gövde köşelerine feder eklenmesi veya malzeme sınıfının yükseltilmesi (ör. 7075-T6) gereklidir."
            )
        else:
            recommended_actions.append(
                f"Akma emniyet marjı pozitif (MS = +{margin_of_safety:.2f}). Statik ve dinamik akma riski bulunmuyor."
            )

        if notching_required:
            recommended_actions.append(
                f"MIL-STD-810H NOTCHING İSTERİ: Sarsıcı testinde {notch_band[0]}-{notch_band[1]} Hz "
                f"bandında {suggested_notch_depth_db:.1f} dB PSD çentikleme (notching) uygulanmalıdır."
            )

        if resonance_status != "SAFE":
            recommended_actions.append(
                f"REVERSED DÖNGÜ MODAL İYİLEŞTİRME: 1. mod frekansını f1={f1:.1f} Hz seviyesinden "
                f"en az 200 Hz üzerine çekmek için cıvata montaj tabanı mesnet aralıkları daraltılmalıdır."
            )

        return {
            "first_mode_hz": round(f1, 2),
            "second_mode_hz": round(f2, 2),
            "third_mode_hz": round(f3, 2),
            "dynamic_amplification_q": q_factor,
            "peak_von_mises_stress_mpa": peak_von_mises_stress_mpa,
            "allowable_stress_mpa": round(allowable_stress, 2),
            "margin_of_safety": margin_of_safety,
            "is_yield_safe": is_yield_safe,
            "resonance_status": resonance_status,
            "resonance_message": resonance_message,
            "notching_required": notching_required,
            "suggested_notch_depth_db": suggested_notch_depth_db,
            "notch_frequency_band_hz": notch_band,
            "recommended_actions": recommended_actions
        }

    @classmethod
    def parse_solver_log(cls, content: str, filename: str = "") -> Dict[str, Any]:
        """
        Parses raw text from FEA solver outputs (NASTRAN .f06, ANSYS modal report, generic solver log)
        and deterministically extracts natural frequencies (Hz) and peak von Mises stress (MPa).
        """
        import re

        filename_lower = filename.lower()
        frequencies: List[float] = []
        peak_stress: Optional[float] = None
        solver_type = "GENERIC_SOLVER"

        # 1. NASTRAN .f06 EIGENVALUE Extraction
        # Format: MODE NO. | EXTRACTION ORDER | EIGENVALUE | RADIANS | CYCLES (Hz) | GEN MASS | GEN STIFFNESS
        is_f06 = ".f06" in filename_lower or "NASTRAN" in content.upper() or "EIGENVALUE" in content.upper()
        if is_f06:
            solver_type = "NASTRAN_F06"
            # Pattern: 1 to 3 digits (mode), 1 to 3 digits, float, float, float (CYCLES/Hz)
            # Example: 1    1    2.348E+06    1.532E+03    243.88    1.000E+00
            nastran_pattern = re.compile(
                r"^\s*(\d+)\s+\d+\s+[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?\s+[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)"
            )
            for line in content.splitlines():
                m = nastran_pattern.match(line)
                if m:
                    try:
                        freq_hz = float(m.group(2))
                        if 1.0 <= freq_hz <= 50000.0 and freq_hz not in frequencies:
                            frequencies.append(round(freq_hz, 2))
                    except ValueError:
                        pass

        # 2. ANSYS Modal Summary Extraction
        # Format: SET  TIME/FREQ  LOAD STEP  SUBSTEP
        is_ansys = "ANSYS" in content.upper() or "SUBSTEP" in content.upper() or "SET   TIME/FREQ" in content.upper()
        if is_ansys or not frequencies:
            if is_ansys:
                solver_type = "ANSYS_LOG"
            ansys_pattern = re.compile(
                r"^\s*(\d+)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+\d+\s+\d+"
            )
            for line in content.splitlines():
                m = ansys_pattern.match(line)
                if m:
                    try:
                        freq_hz = float(m.group(2))
                        if 1.0 <= freq_hz <= 50000.0 and freq_hz not in frequencies:
                            frequencies.append(round(freq_hz, 2))
                    except ValueError:
                        pass

        # 3. Direct Key-Value Regex Matchers (e.g. "Mode 1: 245.5 Hz", "Frequency = 312.4 Hz")
        if not frequencies:
            kv_pattern = re.compile(
                r"(?:mode\s*\d+|freq(?:uency)?|f\d+)\s*[:=]\s*([-+]?[0-9]*\.?[0-9]+)\s*(?:hz)?",
                re.IGNORECASE,
            )
            for line in content.splitlines():
                m = kv_pattern.search(line)
                if m:
                    try:
                        val = float(m.group(1))
                        if 1.0 <= val <= 50000.0 and val not in frequencies:
                            frequencies.append(round(val, 2))
                    except ValueError:
                        pass

        # 4. Stress Extraction (von Mises / Max Stress)
        stress_pattern = re.compile(
            r"(?:(?:maximum|max|peak|eqv)?\s*(?:von\s*mises)?\s*stress|von\s*mises(?:\s*stress)?)\s*[:=]?\s*([-+]?[0-9]*\.?[0-9]+)",
            re.IGNORECASE,
        )
        for line in content.splitlines():
            m = stress_pattern.search(line)
            if m:
                try:
                    val = float(m.group(1))
                    if 0.1 <= val <= 5000.0:
                        if peak_stress is None or val > peak_stress:
                            peak_stress = round(val, 2)
                except ValueError:
                    pass

        frequencies.sort()

        return {
            "solver_type": solver_type,
            "filename": filename,
            "extracted_modes_count": len(frequencies),
            "resonant_frequencies_hz": frequencies,
            "peak_von_mises_stress_mpa": peak_stress,
            "first_mode_hz": frequencies[0] if frequencies else None,
            "second_mode_hz": frequencies[1] if len(frequencies) > 1 else None,
            "third_mode_hz": frequencies[2] if len(frequencies) > 2 else None,
        }

