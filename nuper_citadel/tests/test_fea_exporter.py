import pytest
from engine.core.fea_exporter import FEAExporter


def test_interpolate_psd_log_log():
    exporter = FEAExporter()
    bps = [
        {"frequency_hz": 20.0, "psd_value": 0.0053},
        {"frequency_hz": 150.0, "psd_value": 0.0400},
        {"frequency_hz": 1000.0, "psd_value": 0.0400},
        {"frequency_hz": 2000.0, "psd_value": 0.0100},
    ]

    points = exporter.interpolate_psd_log_log(bps, num_points=120)
    assert len(points) == 120
    assert abs(points[0][0] - 20.0) < 0.1
    assert abs(points[-1][0] - 2000.0) < 0.1
    assert abs(points[0][1] - 0.0053) < 0.001
    assert abs(points[-1][1] - 0.0100) < 0.001


def test_generate_nx_ansys_csv():
    exporter = FEAExporter()
    bps = [
        {"frequency_hz": 20.0, "psd_value": 0.0053},
        {"frequency_hz": 150.0, "psd_value": 0.0400},
        {"frequency_hz": 1000.0, "psd_value": 0.0400},
        {"frequency_hz": 2000.0, "psd_value": 0.0100},
    ]

    csv_text = exporter.generate_nx_ansys_csv(
        platform_name="Taktik İHA Kanat Altı",
        standard_code="MIL-STD-810H",
        category="Cat 14",
        target_grms=7.70,
        breakpoints=bps,
        num_points=120,
    )

    assert "## Nuper Citadel FEA Pre-Processor" in csv_text
    assert "Frequency(Hz),PSD(g^2/Hz)" in csv_text
    lines = csv_text.strip().splitlines()
    data_lines = [l for l in lines if not l.startswith("##") and not l.startswith("Frequency")]
    assert len(data_lines) == 120


def test_generate_ansys_apdl_snippet():
    exporter = FEAExporter()
    bps = [
        {"frequency_hz": 20.0, "psd_value": 0.01},
        {"frequency_hz": 1000.0, "psd_value": 0.01},
    ]

    apdl = exporter.generate_ansys_apdl_snippet(table_name="NUPER_PSD", breakpoints=bps)
    assert "*DIM,NUPER_PSD,TABLE,50,1,1,FREQ" in apdl
    assert "NUPER_PSD(1,0) = 20.00" in apdl


def test_generate_simulation_directive():
    exporter = FEAExporter()
    cad_dummy = {
        "mounting_interface": {
            "detected_holes_count": 4,
            "diagonal_span_mm": 110.0,
        }
    }
    mission_dummy = {
        "vibration": {
            "frequency_range_hz": [20.0, 2000.0]
        }
    }

    directive = exporter.generate_simulation_directive(cad_dummy, mission_dummy)
    assert "boundary_conditions" in directive
    assert "modal_setup" in directive
    assert "acceptance_criteria" in directive
    assert "SOL 103" in directive["modal_setup"]["solution_type"]
