import pytest
from engine.core.plm_bridge import PLMBridge


def test_plm_bridge_teamcenter_mock_sync():
    """Validates Teamcenter qualification sync in air-gapped mode."""
    res = PLMBridge.sync_qualification_record(
        system_type="Siemens Teamcenter",
        item_id="004821-A",
        revision="B.02",
        part_name="Avionics_Cooling_Jacket",
        qualification_metadata={
            "qualification_verdict": "PASS",
            "standards": ["MIL-STD-810H Method 514.8", "Method 501.7", "Method 516.8"],
            "fastener_ms": 1.42,
            "thermal_ms": 0.88,
            "shock_ms": 2.10
        }
    )

    assert res["status"] == "SUCCESS"
    assert res["system_type"] == "Siemens Teamcenter"
    assert res["item_id"] == "004821-A"
    assert res["revision"] == "B.02"
    assert res["plm_object_uid"].startswith("PLM-")
    assert len(res["dataset_summary"]["attachments_cataloged"]) == 3


def test_plm_bridge_windchill_mock_sync():
    """Validates PTC Windchill qualification sync."""
    res = PLMBridge.sync_qualification_record(
        system_type="PTC Windchill",
        item_id="WND-99201",
        revision="A.01",
        part_name="Missile_Fin_Actuator_Bracket",
        qualification_metadata={"qualification_verdict": "PASS"}
    )

    assert res["status"] == "SUCCESS"
    assert res["system_type"] == "PTC Windchill"
