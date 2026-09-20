import os
import pytest
import tempfile
from engine.core.feedback_engine import FeedbackEngine


def test_feedback_engine_lifecycle():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_path = tmp.name

    try:
        engine = FeedbackEngine(db_path=db_path)
        
        # 1. Record DPO feedback
        rec_id = engine.record_feedback(
            feature_area="ETP_REPORT",
            prompt_context={"part": "bracket.step", "grms": 7.70},
            rejected_text="Parça 20g şoka dayanmalıdır.",
            chosen_text="Parça MIL-STD-810H Metot 516.8 Prosedür I gereği 40g TPS şoka tabi tutulmalıdır.",
            engineer_rating=5,
            engineer_notes="Şok prosedürü ve dalga formu düzeltildi.",
            tags=["MIL-STD-810H", "Shock", "ETP"]
        )
        assert rec_id == 1

        # 2. List feedback
        records = engine.list_feedback()
        assert len(records) == 1
        r = records[0]
        assert r["feature_area"] == "ETP_REPORT"
        assert "40g TPS" in r["chosen_text"]
        assert "20g" in r["rejected_text"]
        assert r["engineer_rating"] == 5
        assert "Shock" in r["tags"]

        # 3. Stats
        stats = engine.get_stats()
        assert stats["total_feedback_records"] == 1
        assert stats["average_rating"] == 5.0
    finally:
        if os.path.exists(db_path):
            os.remove(db_path)
