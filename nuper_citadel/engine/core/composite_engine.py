"""
NUPER CITADEL - Composite Material & Classical Laminate Theory (CLT) Engine
Deterministic multi-layer aerospace composite structural qualification.
Calculates [A, B, D] stiffness matrices, ply-by-ply stress/strain transformation,
and failure criteria (Tsai-Wu and Maximum Stress).
Strictly deterministic: SI units (N, mm, MPa).
"""

import math
from typing import Dict, Any, List, Optional
import numpy as np


class CompositeEngine:
    # Standard Aerospace Prepreg Material Database
    PRESETS: Dict[str, Dict[str, Any]] = {
        "AS4/3501-6 Carbon/Epoxy": {
            "name": "AS4/3501-6 Carbon/Epoxy",
            "type": "Unidirectional Carbon/Epoxy",
            "e1_mpa": 142000.0,
            "e2_mpa": 10300.0,
            "g12_mpa": 7200.0,
            "nu12": 0.27,
            "xt_mpa": 2280.0,
            "xc_mpa": 1440.0,
            "yt_mpa": 57.0,
            "yc_mpa": 228.0,
            "s_mpa": 71.0,
            "density_kg_m3": 1580.0,
            "nominal_ply_thickness_mm": 0.125
        },
        "IM7/8552 Carbon/Epoxy": {
            "name": "IM7/8552 Carbon/Epoxy (High Modulus)",
            "type": "Tough Toughened Carbon/Epoxy",
            "e1_mpa": 165000.0,
            "e2_mpa": 8500.0,
            "g12_mpa": 4800.0,
            "nu12": 0.32,
            "xt_mpa": 2500.0,
            "xc_mpa": 1600.0,
            "yt_mpa": 65.0,
            "yc_mpa": 250.0,
            "s_mpa": 90.0,
            "density_kg_m3": 1570.0,
            "nominal_ply_thickness_mm": 0.130
        },
        "S2-Glass/Epoxy": {
            "name": "S2-Glass/Epoxy (Structural Glass)",
            "type": "Unidirectional High-Strength S2-Glass",
            "e1_mpa": 43000.0,
            "e2_mpa": 8900.0,
            "g12_mpa": 4500.0,
            "nu12": 0.27,
            "xt_mpa": 1280.0,
            "xc_mpa": 690.0,
            "yt_mpa": 49.0,
            "yc_mpa": 158.0,
            "s_mpa": 69.0,
            "density_kg_m3": 1970.0,
            "nominal_ply_thickness_mm": 0.150
        },
        "Kevlar 49/Epoxy": {
            "name": "Kevlar 49/Epoxy (Aramid)",
            "type": "Unidirectional Aramid Ballistic/Structure",
            "e1_mpa": 76000.0,
            "e2_mpa": 5500.0,
            "g12_mpa": 2100.0,
            "nu12": 0.34,
            "xt_mpa": 1380.0,
            "xc_mpa": 280.0,
            "yt_mpa": 30.0,
            "yc_mpa": 140.0,
            "s_mpa": 45.0,
            "density_kg_m3": 1380.0,
            "nominal_ply_thickness_mm": 0.125
        }
    }

    @classmethod
    def get_material_properties(
        cls,
        preset_name: str,
        custom_props: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """Retrieves preset material properties or overrides with custom allowables."""
        base = cls.PRESETS.get(preset_name, cls.PRESETS["AS4/3501-6 Carbon/Epoxy"]).copy()
        if custom_props:
            for k, v in custom_props.items():
                if v is not None:
                    base[k] = v
        return base

    @staticmethod
    def calculate_reduced_stiffness_q(
        e1: float,
        e2: float,
        g12: float,
        nu12: float
    ) -> np.ndarray:
        """
        Computes the 3x3 reduced stiffness matrix [Q] in the principal material coordinate system (1-2).
        Units: MPa (N/mm^2)
        """
        nu21 = nu12 * (e2 / e1)
        delta = 1.0 - (nu12 * nu21)
        if delta <= 0.0:
            raise ValueError(f"Invalid Poisson ratio combination: 1 - nu12*nu21 = {delta} <= 0")

        q11 = e1 / delta
        q22 = e2 / delta
        q12 = (nu12 * e2) / delta
        q66 = g12

        Q = np.array([
            [q11, q12, 0.0],
            [q12, q22, 0.0],
            [0.0, 0.0, q66]
        ], dtype=float)
        return Q

    @staticmethod
    def transform_q_bar(Q: np.ndarray, theta_deg: float) -> np.ndarray:
        """
        Transforms [Q] matrix to the laminate global coordinate system (x-y) by angle theta (degrees).
        Uses standard tensor transformation matrices [T] and [R].
        """
        rad = math.radians(theta_deg)
        m = math.cos(rad)
        n = math.sin(rad)

        m2 = m * m
        n2 = n * n
        m4 = m2 * m2
        n4 = n2 * n2
        m3n = m2 * m * n
        mn3 = m * n2 * n
        m2n2 = m2 * n2

        q11, q12, q22, q66 = Q[0, 0], Q[0, 1], Q[1, 1], Q[2, 2]

        qbar11 = q11 * m4 + 2.0 * (q12 + 2.0 * q66) * m2n2 + q22 * n4
        qbar22 = q11 * n4 + 2.0 * (q12 + 2.0 * q66) * m2n2 + q22 * m4
        qbar12 = (q11 + q22 - 4.0 * q66) * m2n2 + q12 * (m4 + n4)
        qbar66 = (q11 + q22 - 2.0 * q12 - 2.0 * q66) * m2n2 + q66 * (m4 + n4)
        qbar16 = (q11 - q12 - 2.0 * q66) * m3n + (q12 - q22 + 2.0 * q66) * mn3
        qbar26 = (q11 - q12 - 2.0 * q66) * mn3 + (q12 - q22 + 2.0 * q66) * m3n

        Q_bar = np.array([
            [qbar11, qbar12, qbar16],
            [qbar12, qbar22, qbar26],
            [qbar16, qbar26, qbar66]
        ], dtype=float)
        return Q_bar

    @classmethod
    def calculate_abd_matrices(
        cls,
        layup_angles: List[float],
        ply_thicknesses: List[float],
        q_matrices: List[np.ndarray]
    ) -> Dict[str, np.ndarray]:
        """
        Integrates [A], [B], [D] laminate stiffness matrices across thickness z.
        A_ij = sum Q_bar_ij * (z_k - z_{k-1})
        B_ij = 1/2 * sum Q_bar_ij * (z_k^2 - z_{k-1}^2)
        D_ij = 1/3 * sum Q_bar_ij * (z_k^3 - z_{k-1}^3)
        """
        total_thickness = sum(ply_thicknesses)
        h = total_thickness
        z_curr = -h / 2.0

        A = np.zeros((3, 3), dtype=float)
        B = np.zeros((3, 3), dtype=float)
        D = np.zeros((3, 3), dtype=float)

        for ply_idx, (angle, t, Q) in enumerate(zip(layup_angles, ply_thicknesses, q_matrices)):
            Q_bar = cls.transform_q_bar(Q, angle)
            z_next = z_curr + t

            dz1 = z_next - z_curr
            dz2 = (z_next**2 - z_curr**2) / 2.0
            dz3 = (z_next**3 - z_curr**3) / 3.0

            A += Q_bar * dz1
            B += Q_bar * dz2
            D += Q_bar * dz3

            z_curr = z_next

        return {"A": A, "B": B, "D": D, "total_thickness": total_thickness}

    @staticmethod
    def calculate_effective_constants(A: np.ndarray, total_thickness: float) -> Dict[str, float]:
        """Computes equivalent engineering constants for in-plane behavior."""
        h = max(total_thickness, 0.001)
        a_matrix = np.linalg.inv(A)

        ex = 1.0 / (h * a_matrix[0, 0])
        ey = 1.0 / (h * a_matrix[1, 1])
        gxy = 1.0 / (h * a_matrix[2, 2])
        nuxy = -a_matrix[0, 1] / a_matrix[0, 0]

        return {
            "ex_gpa": round(ex / 1000.0, 2),
            "ey_gpa": round(ey / 1000.0, 2),
            "gxy_gpa": round(gxy / 1000.0, 2),
            "nu_xy": round(nuxy, 3)
        }

    @staticmethod
    def transform_stress_to_ply_axes(stress_xy: np.ndarray, theta_deg: float) -> np.ndarray:
        """
        Transforms global stress vector [sigma_x, sigma_y, tau_xy]^T
        to local material coordinate axes (1-2) [sigma_1, sigma_2, tau_12]^T.
        """
        rad = math.radians(theta_deg)
        m = math.cos(rad)
        n = math.sin(rad)

        m2 = m * m
        n2 = n * n
        mn = m * n

        T = np.array([
            [m2, n2, 2.0 * mn],
            [n2, m2, -2.0 * mn],
            [-mn, mn, m2 - n2]
        ], dtype=float)

        return T @ stress_xy

    @staticmethod
    def evaluate_tsai_wu(
        sigma_1: float,
        sigma_2: float,
        tau_12: float,
        xt: float,
        xc: float,
        yt: float,
        yc: float,
        s: float
    ) -> Dict[str, float]:
        """
        Computes Tsai-Wu failure criterion with strength ratio (SR) and Margin of Safety.
        F1*s1 + F2*s2 + F11*s1^2 + F22*s2^2 + F66*t12^2 + 2*F12*s1*s2 <= 1
        """
        f1 = (1.0 / xt) - (1.0 / xc)
        f11 = 1.0 / (xt * xc)
        f2 = (1.0 / yt) - (1.0 / yc)
        f22 = 1.0 / (yt * yc)
        f66 = 1.0 / (s * s)
        f12 = -0.5 * math.sqrt(max(f11 * f22, 1e-12))  # Mises/Hoffman interaction

        # Tsai-Wu Index at current load
        tw_index = (
            f1 * sigma_1 +
            f2 * sigma_2 +
            f11 * (sigma_1**2) +
            f22 * (sigma_2**2) +
            f66 * (tau_12**2) +
            2.0 * f12 * sigma_1 * sigma_2
        )

        # Solve for Strength Ratio R: a * R^2 + b * R - 1 = 0
        a = (
            f11 * (sigma_1**2) +
            f22 * (sigma_2**2) +
            f66 * (tau_12**2) +
            2.0 * f12 * sigma_1 * sigma_2
        )
        b = f1 * sigma_1 + f2 * sigma_2

        if abs(a) < 1e-12:
            r_ratio = 1.0 / max(b, 1e-9) if b > 0 else 999.0
        else:
            discriminant = b * b + 4.0 * a
            if discriminant >= 0.0:
                r_ratio = (-b + math.sqrt(discriminant)) / (2.0 * a)
            else:
                r_ratio = 0.0

        r_ratio = max(r_ratio, 0.0)
        ms = r_ratio - 1.0

        return {
            "tsai_wu_index": round(tw_index, 4),
            "strength_ratio": round(r_ratio, 3),
            "margin_of_safety": round(ms, 3)
        }

    @staticmethod
    def evaluate_max_stress(
        sigma_1: float,
        sigma_2: float,
        tau_12: float,
        xt: float,
        xc: float,
        yt: float,
        yc: float,
        s: float
    ) -> Dict[str, float]:
        """Computes Maximum Stress failure indices for 1, 2, and shear directions."""
        r1 = sigma_1 / xt if sigma_1 > 0 else abs(sigma_1) / xc
        r2 = sigma_2 / yt if sigma_2 > 0 else abs(sigma_2) / yc
        r6 = abs(tau_12) / s

        max_ratio = max(r1, r2, r6)
        rf = 1.0 / max(max_ratio, 1e-9)
        ms = rf - 1.0

        return {
            "max_stress_index": round(max_ratio, 4),
            "strength_ratio": round(rf, 3),
            "margin_of_safety": round(ms, 3),
            "governing_mode": "Longitudinal Tension/Compression" if max_ratio == r1 else (
                "Transverse Matrix" if max_ratio == r2 else "In-Plane Shear"
            )
        }

    @classmethod
    def evaluate_laminate(
        cls,
        material_preset: str = "AS4/3501-6 Carbon/Epoxy",
        layup_angles: Optional[List[float]] = None,
        ply_thickness_mm: float = 0.125,
        force_nx: float = 120.0,      # N/mm
        force_ny: float = 40.0,       # N/mm
        shear_nxy: float = 25.0,      # N/mm
        moment_mx: float = 0.0,       # N*mm/mm
        moment_my: float = 0.0,       # N*mm/mm
        moment_mxy: float = 0.0,      # N*mm/mm
        custom_allowables: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Executes full Classical Laminate Theory analysis on arbitrary ply sequence.
        Returns ABD matrices, equivalent engineering constants, ply-by-ply stress states,
        and Tsai-Wu / Maximum Stress safety margins.
        """
        if not layup_angles:
            layup_angles = [0.0, 45.0, -45.0, 90.0, 90.0, -45.0, 45.0, 0.0]

        mat = cls.get_material_properties(material_preset, custom_allowables)
        e1 = mat["e1_mpa"]
        e2 = mat["e2_mpa"]
        g12 = mat["g12_mpa"]
        nu12 = mat["nu12"]
        xt = mat["xt_mpa"]
        xc = mat["xc_mpa"]
        yt = mat["yt_mpa"]
        yc = mat["yc_mpa"]
        s = mat["s_mpa"]

        num_plies = len(layup_angles)
        ply_thicknesses = [ply_thickness_mm] * num_plies
        Q_single = cls.calculate_reduced_stiffness_q(e1, e2, g12, nu12)
        q_list = [Q_single] * num_plies

        abd_dict = cls.calculate_abd_matrices(layup_angles, ply_thicknesses, q_list)
        A = abd_dict["A"]
        B = abd_dict["B"]
        D = abd_dict["D"]
        total_thickness = abd_dict["total_thickness"]

        # Build 6x6 ABD matrix
        abd_6x6 = np.block([
            [A, B],
            [B, D]
        ])

        # Applied load vector [Nx, Ny, Nxy, Mx, My, Mxy]^T
        load_vector = np.array([force_nx, force_ny, shear_nxy, moment_mx, moment_my, moment_mxy], dtype=float)

        # Midplane strains and curvatures: [epsilon_0; kappa] = [ABD]^-1 * [N; M]
        try:
            abd_inv = np.linalg.inv(abd_6x6)
            midplane_response = abd_inv @ load_vector
            eps0 = midplane_response[:3]
            kappa = midplane_response[3:]
        except np.linalg.LinAlgError:
            eps0 = np.zeros(3)
            kappa = np.zeros(3)

        effective_props = cls.calculate_effective_constants(A, total_thickness)

        # Ply-by-ply stress calculations & failure criteria
        ply_results = []
        z_curr = -total_thickness / 2.0

        min_tw_ms = 999.0
        min_maxstress_ms = 999.0
        critical_ply_idx = 0
        critical_angle = 0.0

        for idx, (angle, t) in enumerate(zip(layup_angles, ply_thicknesses)):
            z_mid = z_curr + (t / 2.0)
            z_curr += t

            # Laminate global strain at ply center: eps = eps0 + z * kappa
            eps_xy = eps0 + z_mid * kappa
            Q_bar = cls.transform_q_bar(Q_single, angle)
            # Global stress: sigma_xy = Q_bar * eps_xy
            stress_xy = Q_bar @ eps_xy

            # Transform to principal material axes (1-2)
            stress_12 = cls.transform_stress_to_ply_axes(stress_xy, angle)
            sigma_1 = float(stress_12[0])
            sigma_2 = float(stress_12[1])
            tau_12 = float(stress_12[2])

            tw = cls.evaluate_tsai_wu(sigma_1, sigma_2, tau_12, xt, xc, yt, yc, s)
            ms_stress = cls.evaluate_max_stress(sigma_1, sigma_2, tau_12, xt, xc, yt, yc, s)

            if tw["margin_of_safety"] < min_tw_ms:
                min_tw_ms = tw["margin_of_safety"]
                critical_ply_idx = idx + 1
                critical_angle = angle

            if ms_stress["margin_of_safety"] < min_maxstress_ms:
                min_maxstress_ms = ms_stress["margin_of_safety"]

            ply_results.append({
                "ply_index": idx + 1,
                "angle_deg": angle,
                "thickness_mm": t,
                "z_mid_mm": round(z_mid, 3),
                "sigma_1_mpa": round(sigma_1, 2),
                "sigma_2_mpa": round(sigma_2, 2),
                "tau_12_mpa": round(tau_12, 2),
                "tsai_wu": tw,
                "max_stress": ms_stress
            })

        verdict = "PASS" if min_tw_ms >= 0.0 and min_maxstress_ms >= 0.0 else "FAIL"

        layup_repr = "[" + "/".join(f"{int(a) if a.is_integer() else a}°" for a in layup_angles) + "]"

        summary = (
            f"{mat['name']} kompozit katman ({layup_repr}, {num_plies} kat, toplam {total_thickness:.2f} mm) "
            f"CLT analizinde en kritik katman #{critical_ply_idx} ({critical_angle:.0f}°) tespit edildi. "
            f"Tsai-Wu Güvenlik Marjı MS = {min_tw_ms:+.2f} ({verdict}). E_x={effective_props['ex_gpa']} GPa, "
            f"E_y={effective_props['ey_gpa']} GPa."
        )

        return {
            "material_name": mat["name"],
            "layup_sequence": layup_repr,
            "num_plies": num_plies,
            "total_thickness_mm": round(total_thickness, 3),
            "laminate_stiffness_matrix_abd": {
                "A_n_mm": [[round(val, 2) for val in row] for row in A],
                "B_n": [[round(val, 2) for val in row] for row in B],
                "D_n_mm": [[round(val, 2) for val in row] for row in D]
            },
            "effective_engineering_constants": effective_props,
            "critical_ply_index": critical_ply_idx,
            "critical_ply_angle": critical_angle,
            "tsai_wu_max_index": round(1.0 / max(min_tw_ms + 1.0, 1e-4), 3),
            "tsai_wu_margin_of_safety": round(min_tw_ms, 2),
            "max_stress_margin_of_safety": round(min_maxstress_ms, 2),
            "qualification_verdict": verdict,
            "ply_results": ply_results,
            "engineering_summary": summary
        }
