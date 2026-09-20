import pytest
from engine.llm.objection_agent import ObjectionDefenseAgent


def test_objection_agent_generation():
    agent = ObjectionDefenseAgent()
    result = agent.generate_defense_letter(
        part_name="avionics_chassis.step",
        platform_name="Taktik İHA Kanat Altı Pod",
        anomaly_description="Sarsıcı kontrol döngüsü 480 Hz civarında kontrolsüz rezonans başlattı ve 35g pik ivme okundu.",
        recorded_frequency_hz=480.0,
        recorded_peak_g=35.0,
        nominal_grms=7.70,
        fixture_resonance_hz=490.0
    )

    assert "letter_text" in result
    assert "target_standard" in result
    letter = result["letter_text"]
    assert "MIL-STD-810H" in letter
    assert ("Over-Testing" in letter or "Aşırı Test" in letter or "Notching" in letter or "Çentikleme" in letter)
