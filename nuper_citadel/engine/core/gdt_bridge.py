import math
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict


@dataclass
class CMMMeasuredHole:
    hole_id: str
    nominal_x: float
    nominal_y: float
    nominal_diameter: float
    measured_x: float
    measured_y: float
    measured_diameter: float
    position_tolerance_mm: float = 0.20  # Standart savunma şasisi delik konum toleransı


@dataclass
class CMMInspectionResult:
    hole_id: str
    deviation_x_mm: float
    deviation_y_mm: float
    true_position_error_mm: float
    allowable_tolerance_mm: float
    diameter_error_mm: float
    is_position_conformant: bool
    is_diameter_conformant: bool
    status: str


class GDTBridge:
    """
    ASME Y14.5 / ISO 1101 ve MIL-STD Geometrik Ölçülendirme ve Toleranslandırma (GD&T)
    ile İmalat Sonrası CMM (Koordinat Ölçüm Cihazı) Doğrulama Köprüsü.
    """

    @staticmethod
    def calculate_true_position(
        nominal_x: float,
        nominal_y: float,
        measured_x: float,
        measured_y: float,
        nominal_d: float,
        measured_d: float,
        specified_pos_tol: float = 0.20,
        mmc_applied: bool = True
    ) -> CMMInspectionResult:
        """
        True Position Denklemi: TP = 2 * sqrt(dx^2 + dy^2)
        MMC (Maximum Material Condition) varsa delik büyüdükçe bonus tolerans eklenir.
        """
        dx = measured_x - nominal_x
        dy = measured_y - nominal_y
        true_position = 2.0 * math.sqrt(dx**2 + dy**2)

        diameter_diff = measured_d - nominal_d
        bonus_tolerance = max(0.0, diameter_diff) if mmc_applied else 0.0
        total_allowable_tol = specified_pos_tol + bonus_tolerance

        is_pos_safe = true_position <= total_allowable_tol
        is_diam_safe = abs(diameter_diff) <= 0.15

        status = "CONFORMANT" if (is_pos_safe and is_diam_safe) else "NON_CONFORMANT"

        return CMMInspectionResult(
            hole_id="",
            deviation_x_mm=round(dx, 3),
            deviation_y_mm=round(dy, 3),
            true_position_error_mm=round(true_position, 3),
            allowable_tolerance_mm=round(total_allowable_tol, 3),
            diameter_error_mm=round(diameter_diff, 3),
            is_position_conformant=is_pos_safe,
            is_diameter_conformant=is_diam_safe,
            status=status
        )

    def evaluate_cmm_inspection(
        self,
        holes: List[Dict[str, Any]],
        flatness_points_z: Optional[List[float]] = None,
        flatness_tolerance_mm: float = 0.08
    ) -> Dict[str, Any]:
        """
        Montaj arayüzünün CMM ölçümlerini değerlendirir ve titreşim testi öncesi
        bağlantı emniyeti (Fitment Guarantee) raporu üretir.
        """
        inspections = []
        overall_pass = True

        for h in holes:
            h_id = str(h.get("hole_id", "H1"))
            nom_x = float(h.get("nominal_x", 0.0))
            nom_y = float(h.get("nominal_y", 0.0))
            nom_d = float(h.get("nominal_diameter", 4.5))
            meas_x = float(h.get("measured_x", nom_x))
            meas_y = float(h.get("measured_y", nom_y))
            meas_d = float(h.get("measured_diameter", nom_d))
            pos_tol = float(h.get("position_tolerance_mm", 0.20))

            res = self.calculate_true_position(
                nominal_x=nom_x,
                nominal_y=nom_y,
                measured_x=meas_x,
                measured_y=meas_y,
                nominal_d=nom_d,
                measured_d=meas_d,
                specified_pos_tol=pos_tol
            )
            res.hole_id = h_id

            if not (res.is_position_conformant and res.is_diameter_conformant):
                overall_pass = False

            inspections.append(asdict(res))

        # Taban Düzlemselliği (Flatness) Kontrolü
        flatness_result = {
            "evaluated": False,
            "measured_flatness_mm": 0.0,
            "allowable_tolerance_mm": flatness_tolerance_mm,
            "is_conformant": True
        }
        if flatness_points_z and len(flatness_points_z) >= 3:
            z_spread = max(flatness_points_z) - min(flatness_points_z)
            is_flat_ok = z_spread <= flatness_tolerance_mm
            if not is_flat_ok:
                overall_pass = False
            flatness_result = {
                "evaluated": True,
                "measured_flatness_mm": round(z_spread, 3),
                "allowable_tolerance_mm": flatness_tolerance_mm,
                "is_conformant": is_flat_ok
            }

        return {
            "overall_status": "CONFORMANT" if overall_pass else "OUT_OF_TOLERANCE",
            "standard_basis": "ASME Y14.5 / ISO 1101 (True Position @ MMC)",
            "total_holes_evaluated": len(inspections),
            "holes_inspection": inspections,
            "surface_flatness": flatness_result,
            "directives": [
                "Tüm montaj delikleri konum toleransı dahilindedir; fikstür cıvatalaması sırasında aşırı montaj gerilmesi (pre-stress) oluşmayacaktır."
                if overall_pass else
                "DİKKAT: Konum toleransı aşımı tespit edildi! Sarsıcı fikstürüne zorlayarak cıvatalama yapılması montaj ön gerilmesini ve erken yorulma çatlağını tetikler."
            ]
        }
