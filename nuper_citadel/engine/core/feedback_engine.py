import os
import sqlite3
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
TELEMETRY_DB_PATH = os.path.join(DATA_DIR, "telemetry.db")


class FeedbackEngine:
    """
    Yerel (air-gapped) DPO ve Mühendis Tercih Kayıt Motoru.
    Mühendisin onayladığı veya düzelttiği doküman revizyonlarını
    yerel SQLite veri tabanına (prompt, chosen, rejected) çiftleri olarak kaydeder.
    Kesinlikle dış ağa veri göndermez.
    """

    def __init__(self, db_path: str = TELEMETRY_DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dpo_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            feature_area TEXT NOT NULL,
            prompt_context TEXT NOT NULL,
            rejected_text TEXT NOT NULL,
            chosen_text TEXT NOT NULL,
            engineer_rating INTEGER DEFAULT 5,
            engineer_notes TEXT,
            tags TEXT,
            created_at TEXT NOT NULL
        );
        """)
        conn.commit()
        conn.close()

    def record_feedback(
        self,
        feature_area: str,
        prompt_context: Any,
        rejected_text: str,
        chosen_text: str,
        engineer_rating: int = 5,
        engineer_notes: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> int:
        """
        Yeni bir mühendis revizyonunu (DPO çifti) kaydeder.
        """
        if isinstance(prompt_context, (dict, list)):
            context_str = json.dumps(prompt_context, ensure_ascii=False)
        else:
            context_str = str(prompt_context)

        tags_str = ",".join(tags) if tags else ""
        now_iso = datetime.now(timezone.utc).isoformat()

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO dpo_feedback (
                feature_area, prompt_context, rejected_text, chosen_text,
                engineer_rating, engineer_notes, tags, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            feature_area,
            context_str,
            rejected_text,
            chosen_text,
            engineer_rating,
            engineer_notes or "",
            tags_str,
            now_iso
        ))
        row_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return row_id

    def list_feedback(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Kayıtlı DPO çiftlerini listeler (yerel model inceleme ve LoRA eğitimi için).
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, feature_area, prompt_context, rejected_text, chosen_text,
                   engineer_rating, engineer_notes, tags, created_at
            FROM dpo_feedback
            ORDER BY id DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        conn.close()

        results = []
        for r in rows:
            results.append({
                "id": r[0],
                "feature_area": r[1],
                "prompt_context": r[2],
                "rejected_text": r[3],
                "chosen_text": r[4],
                "engineer_rating": r[5],
                "engineer_notes": r[6],
                "tags": r[7].split(",") if r[7] else [],
                "created_at": r[8]
            })
        return results

    def get_stats(self) -> Dict[str, Any]:
        """
        Yerel DPO veri tabanı istatistiklerini döndürür.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*), AVG(engineer_rating) FROM dpo_feedback")
        count, avg_rating = cursor.fetchone()
        conn.close()
        return {
            "total_feedback_records": count or 0,
            "average_rating": round(avg_rating, 2) if avg_rating else 5.0,
            "air_gapped_location": self.db_path
        }
