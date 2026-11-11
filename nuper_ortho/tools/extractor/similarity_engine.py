import json
import math
import sqlite3
from typing import Any, Dict, List, Optional, Sequence, Tuple


FEATURE_VECTOR_KEYS = (
    "bbox_x",
    "bbox_y",
    "bbox_z",
    "hole_count",
    "cylinder_ratio",
    "min_tolerance",
    "surface_area",
)

DEFAULT_SCALES = (100.0, 100.0, 100.0, 10.0, 1.0, 0.1, 10000.0)
DEFAULT_WEIGHTS = (1.0, 1.0, 1.0, 1.5, 1.2, 1.0, 0.8)


def extract_feature_vector(geometry_data: Dict[str, Any]) -> List[float]:
    bbox = geometry_data.get("bounding_box", {})
    bx = float(geometry_data.get("bbox_x", bbox.get("x", bbox.get("dx", 100.0))))
    by = float(geometry_data.get("bbox_y", bbox.get("y", bbox.get("dy", 100.0))))
    bz = float(geometry_data.get("bbox_z", bbox.get("z", bbox.get("dz", 100.0))))

    sorted_bbox = sorted([abs(bx), abs(by), abs(bz)], reverse=True)

    hole_count = float(geometry_data.get("hole_count", geometry_data.get("num_holes", 0.0)))
    cylinder_ratio = float(geometry_data.get("cylinder_ratio", 0.0))
    min_tolerance = float(geometry_data.get("min_tolerance", geometry_data.get("min_tol", 0.1)))
    surface_area = float(geometry_data.get("surface_area", geometry_data.get("area", 1000.0)))

    return [
        round(sorted_bbox[0], 3),
        round(sorted_bbox[1], 3),
        round(sorted_bbox[2], 3),
        round(hole_count, 1),
        round(cylinder_ratio, 4),
        round(min_tolerance, 4),
        round(surface_area, 2),
    ]


def cosine_similarity(
    vec1: Sequence[float],
    vec2: Sequence[float],
    weights: Optional[Sequence[float]] = None,
    scales: Optional[Sequence[float]] = DEFAULT_SCALES,
) -> float:
    if len(vec1) != len(vec2) or not vec1:
        return 0.0

    w = weights if weights and len(weights) == len(vec1) else [1.0] * len(vec1)
    s = scales if scales and len(scales) == len(vec1) else [1.0] * len(vec1)

    dot_product = 0.0
    norm1_sq = 0.0
    norm2_sq = 0.0

    for u, v, weight, scale in zip(vec1, vec2, w, s):
        sc = scale if abs(scale) > 1e-9 else 1.0
        wu = (u / sc) * weight
        wv = (v / sc) * weight
        dot_product += wu * wv
        norm1_sq += wu * wu
        norm2_sq += wv * wv

    if norm1_sq <= 1e-12 or norm2_sq <= 1e-12:
        return 0.0

    sim = dot_product / (math.sqrt(norm1_sq) * math.sqrt(norm2_sq))
    return max(0.0, min(1.0, float(sim)))


class PartSetupDatabase:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or ":memory:"
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        with self.conn:
            self.conn.execute(
                """
                CREATE TABLE IF NOT EXISTS part_setups (
                    part_id TEXT PRIMARY KEY,
                    part_name TEXT NOT NULL,
                    vector_json TEXT NOT NULL,
                    fixtures_json TEXT NOT NULL,
                    ph10_angles_json TEXT NOT NULL,
                    strategy_json TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

    def register_setup(
        self,
        part_id: str,
        part_name: str,
        vector: Sequence[float],
        op_fixtures: Dict[str, Any],
        ph10_angles: List[Tuple[float, float]],
        strategy: Optional[Dict[str, Any]] = None,
    ) -> None:
        strategy_dict = strategy or {}
        with self.conn:
            self.conn.execute(
                """
                INSERT OR REPLACE INTO part_setups (
                    part_id, part_name, vector_json, fixtures_json, ph10_angles_json, strategy_json
                ) VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    part_id,
                    part_name,
                    json.dumps(list(vector)),
                    json.dumps(op_fixtures),
                    json.dumps(ph10_angles),
                    json.dumps(strategy_dict),
                ),
            )

    def query_similar(
        self,
        query_vector: Sequence[float],
        min_similarity: float = 0.85,
        top_k: int = 5,
        weights: Optional[Sequence[float]] = None,
        scales: Optional[Sequence[float]] = DEFAULT_SCALES,
    ) -> List[Dict[str, Any]]:
        cursor = self.conn.cursor()
        cursor.execute("SELECT part_id, part_name, vector_json, fixtures_json, ph10_angles_json, strategy_json FROM part_setups")
        rows = cursor.fetchall()

        results = []
        for row in rows:
            stored_vec = json.loads(row["vector_json"])
            sim = cosine_similarity(query_vector, stored_vec, weights=weights, scales=scales)
            if sim >= min_similarity:
                results.append(
                    {
                        "part_id": row["part_id"],
                        "part_name": row["part_name"],
                        "similarity": round(sim, 4),
                        "similarity_pct": round(sim * 100.0, 1),
                        "vector": stored_vec,
                        "op_fixtures": json.loads(row["fixtures_json"]),
                        "ph10_angles": json.loads(row["ph10_angles_json"]),
                        "strategy": json.loads(row["strategy_json"]),
                    }
                )

        results.sort(key=lambda r: r["similarity"], reverse=True)
        return results[:top_k]

    def format_recommendation_card(self, match: Dict[str, Any]) -> str:
        part_name = match.get("part_name", match.get("part_id", "Bilinmeyen Parça"))
        sim_pct = match.get("similarity_pct", 0.0)
        return (
            f"💡 Bu parça daha önce onaylanan [{part_name}] parçasına geometrik olarak "
            f"%{sim_pct:.1f} benziyor. Önceki OP10/OP20 bağlama stratejisini, fikstür pabuçlarını "
            f"ve PH10 prob açılarını otomatik uygulamak ister misiniz?"
        )

    def close(self) -> None:
        self.conn.close()
