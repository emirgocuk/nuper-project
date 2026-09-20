import pytest
from engine.core.pdf_report_generator import PDFReportGenerator


def test_pdf_report_generator_basic():
    generator = PDFReportGenerator()
    cad_data = {
        "metadata": {"part_name": "Taktik İHA Pod Montaj Braketi"},
        "physical_properties": {
            "mass_kg": 1.450,
            "volume_mm3": 537000.0,
            "material_name": "Aluminium 7075-T6",
            "yield_strength_mpa": 503.0,
            "center_of_gravity_mm": {"x": 12.5, "y": -4.2, "z": 45.0}
        },
        "bounding_box_mm": {"length_x": 180.0, "width_y": 95.0, "height_z": 60.0},
        "mounting_interface": {
            "mounting_holes_count": 4,
            "hole_diameters_mm": [6.6],
            "overturning_moment_arm_hcg_mm": 45.0
        }
    }
    mission_profile = {
        "platform_name": "Taktik İHA Kanat Altı",
        "standard_code": "MIL-STD-810H",
        "vibration": {
            "effective_grms": 7.70,
            "duration_per_axis_minutes": 60,
            "axes": ["X", "Y", "Z"],
            "breakpoints": [
                {"frequency_hz": 20.0, "psd_value": 0.0053, "slope_db_oct": 6.0},
                {"frequency_hz": 150.0, "psd_value": 0.0400, "slope_db_oct": 0.0},
                {"frequency_hz": 1000.0, "psd_value": 0.0400, "slope_db_oct": -6.0},
                {"frequency_hz": 2000.0, "psd_value": 0.0100, "slope_db_oct": 0.0}
            ]
        },
        "temperature": {
            "operational_low_c": -40.0,
            "operational_high_c": 71.0,
            "storage_low_c": -51.0,
            "storage_high_c": 85.0
        },
        "shock": {
            "peak_acceleration_g": 40.0,
            "duration_ms": 11.0,
            "pulse_shape": "Terminal Peak Sawtooth (TPS)"
        }
    }

    pdf_bytes = generator.generate_etp_pdf(
        cad_data=cad_data,
        mission_profile=mission_profile,
        classification="TASNİF DIŞI / UNCLASSIFIED"
    )

    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 50000  # En az 50KB olmalı
    assert pdf_bytes.startswith(b"%PDF-1.")


def test_pdf_report_generator_with_post_fea():
    generator = PDFReportGenerator()
    cad_data = {
        "metadata": {"part_name": "Helikopter Aviyonik Kutusu"},
        "physical_properties": {
            "mass_kg": 2.100,
            "volume_mm3": 780000.0,
            "material_name": "Aluminium 6061-T6",
            "yield_strength_mpa": 275.0,
            "center_of_gravity_mm": {"x": 0.0, "y": 0.0, "z": 20.0}
        },
        "bounding_box_mm": {"length_x": 120.0, "width_y": 120.0, "height_z": 50.0},
        "mounting_interface": {
            "mounting_holes_count": 4,
            "hole_diameters_mm": [5.5],
            "overturning_moment_arm_hcg_mm": 20.0
        }
    }
    mission_profile = {
        "platform_name": "Helikopter Aviyonik Bölmesi",
        "standard_code": "MIL-STD-810H",
        "vibration": {
            "effective_grms": 4.12,
            "duration_per_axis_minutes": 120,
            "axes": ["X", "Y", "Z"],
            "breakpoints": []
        }
    }
    post_fea_data = {
        "first_mode_hz": 185.0,
        "dynamic_amplification_q": 25.0,
        "resonance_message": "Rijitlik emniyetli seviyede.",
        "notching_required": False,
        "suggested_notch_depth_db": 0.0
    }

    pdf_bytes = generator.generate_etp_pdf(
        cad_data=cad_data,
        mission_profile=mission_profile,
        post_fea_data=post_fea_data
    )

    assert len(pdf_bytes) > 40000
    assert pdf_bytes.startswith(b"%PDF-1.")
