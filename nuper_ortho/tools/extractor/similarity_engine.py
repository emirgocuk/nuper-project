import json
import math
import os
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

DEFAULT_DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "test_assets", "benchmarks.db")
)


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
        if self.db_path != ":memory:":
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
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
            self.conn.execute(
                """
                CREATE TABLE IF NOT EXISTS part_catalog_vectors (
                    part_id TEXT PRIMARY KEY,
                    part_name TEXT,
                    material TEXT,
                    bbox_x REAL,
                    bbox_y REAL,
                    bbox_z REAL,
                    hole_count INTEGER,
                    min_tol REAL,
                    setup_json TEXT
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


def find_similar_parts(
    drawing_data: Dict[str, Any],
    db_path: Optional[str] = None,
) -> List[Dict[str, Any]]:
    dims = drawing_data.get("dimensions", [])
    dia_dims = [d for d in dims if d.get("type") in ("DIAMETER", "HOLE", "THREAD")]
    hole_count = float(len(dia_dims))
    cyl_ratio = hole_count / max(len(dims), 1)

    max_dim = 100.0
    for d in dims:
        nom = float(d.get("nominal", 0.0))
        if nom > max_dim:
            max_dim = nom

    summary = drawing_data.get("contract_summary", {})
    min_tol = float(summary.get("min_tolerance_mm", 0.05))

    geom = {
        "bbox_x": max_dim,
        "bbox_y": max_dim * 0.75,
        "bbox_z": max_dim * 0.25,
        "hole_count": hole_count,
        "cylinder_ratio": cyl_ratio,
        "min_tolerance": min_tol,
        "surface_area": max_dim * max_dim * 2.5,
    }
    query_vec = extract_feature_vector(geom)

    db = PartSetupDatabase(db_path)
    cursor = db.conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM part_setups")
    if cursor.fetchone()[0] == 0:
        db.register_setup(
            part_id="KPT_3051_GOBEK",
            part_name="KPT - 3051 Göbek Bağı Oluğu",
            vector=extract_feature_vector({
                "bbox_x": 395.5,
                "bbox_y": 305.2,
                "bbox_z": 55.0,
                "hole_count": 12.0,
                "cylinder_ratio": 0.65,
                "min_tolerance": 0.02,
                "surface_area": 18500.0,
            }),
            op_fixtures={"op10": "V-Block + Pabuç", "op20": "Ayna Mandreni"},
            ph10_angles=[(0.0, 0.0), (90.0, 45.0), (180.0, 0.0)],
            strategy={
                "recommended_setup_op10": "OP10 (A0B0) + OP20 (180°)",
                "recommended_probe": "Ø3x50",
            },
        )
        db.register_setup(
            part_id="FLANGE_ADAPTER",
            part_name="Flanş Adaptörü",
            vector=extract_feature_vector({
                "bbox_x": 120.0,
                "bbox_y": 120.0,
                "bbox_z": 40.0,
                "hole_count": 6.0,
                "cylinder_ratio": 0.50,
                "min_tolerance": 0.05,
                "surface_area": 4500.0,
            }),
            op_fixtures={"op10": "Manyetik Tabla"},
            ph10_angles=[(0.0, 0.0)],
            strategy={
                "recommended_setup_op10": "OP10 (A0B0)",
                "recommended_probe": "Ø2x20",
            },
        )
        db.register_setup(
            part_id="VALVE_BODY_OP10",
            part_name="Valf Gövdesi (Valve Body)",
            vector=extract_feature_vector({
                "bbox_x": 150.0,
                "bbox_y": 100.0,
                "bbox_z": 80.0,
                "hole_count": 8.0,
                "cylinder_ratio": 0.40,
                "min_tolerance": 0.03,
                "surface_area": 7200.0,
            }),
            op_fixtures={"op10": "Modüler Pabuç Seti"},
            ph10_angles=[(0.0, 0.0), (90.0, 0.0)],
            strategy={
                "recommended_setup_op10": "OP10 (A0B0) + OP20 (90°)",
                "recommended_probe": "Ø3x40",
            },
        )

    matches = db.query_similar(query_vec, min_similarity=0.60, top_k=3)
    results = []
    for m in matches:
        strat = m.get("strategy", {})
        results.append({
            "part_id": m["part_id"],
            "part_name": m["part_name"],
            "similarity_score": round(m["similarity"], 4),
            "recommended_setup_op10": strat.get("recommended_setup_op10", "OP10 (A0B0) + OP20 (180°)"),
            "recommended_probe": strat.get("recommended_probe", "Ø3x50"),
        })

    db.close()
    return results


def register_part_in_catalog(
    part_id: str,
    part_name: str,
    material: str,
    bbox_x: float,
    bbox_y: float,
    bbox_z: float,
    hole_count: int,
    min_tol: float,
    setup_json: Dict[str, Any] | str,
    db_path: Optional[str] = None,
) -> None:
    target_path = db_path or DEFAULT_DB_PATH
    if target_path != ":memory:":
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
    conn = sqlite3.connect(target_path)
    try:
        with conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS part_catalog_vectors (
                    part_id TEXT PRIMARY KEY,
                    part_name TEXT,
                    material TEXT,
                    bbox_x REAL,
                    bbox_y REAL,
                    bbox_z REAL,
                    hole_count INTEGER,
                    min_tol REAL,
                    setup_json TEXT
                )
                """
            )
            s_json = setup_json if isinstance(setup_json, str) else json.dumps(setup_json)
            conn.execute(
                """
                INSERT OR REPLACE INTO part_catalog_vectors (
                    part_id, part_name, material, bbox_x, bbox_y, bbox_z, hole_count, min_tol, setup_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (part_id, part_name, material, float(bbox_x), float(bbox_y), float(bbox_z), int(hole_count), float(min_tol), s_json),
            )
    finally:
        conn.close()


def query_similar_from_db(
    query_vector: Sequence[float],
    db_path: Optional[str] = None,
    min_similarity: float = 0.85,
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    target_path = db_path or DEFAULT_DB_PATH
    if target_path != ":memory:" and not os.path.exists(target_path):
        return []
    conn = sqlite3.connect(target_path)
    conn.row_factory = sqlite3.Row
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS part_catalog_vectors (
                part_id TEXT PRIMARY KEY,
                part_name TEXT,
                material TEXT,
                bbox_x REAL,
                bbox_y REAL,
                bbox_z REAL,
                hole_count INTEGER,
                min_tol REAL,
                setup_json TEXT
            )
            """
        )
        cursor.execute("SELECT part_id, part_name, material, bbox_x, bbox_y, bbox_z, hole_count, min_tol, setup_json FROM part_catalog_vectors")
        rows = cursor.fetchall()
        results = []
        for row in rows:
            candidate_geom = {
                "bbox_x": row["bbox_x"],
                "bbox_y": row["bbox_y"],
                "bbox_z": row["bbox_z"],
                "hole_count": row["hole_count"],
                "cylinder_ratio": 0.0,
                "min_tolerance": row["min_tol"],
                "surface_area": 1000.0,
            }
            cand_vec = extract_feature_vector(candidate_geom)
            sim = cosine_similarity(query_vector, cand_vec)
            if sim >= min_similarity:
                results.append({
                    "part_id": row["part_id"],
                    "part_name": row["part_name"],
                    "material": row["material"],
                    "similarity": round(sim, 4),
                    "similarity_pct": round(sim * 100.0, 1),
                    "setup": json.loads(row["setup_json"]) if row["setup_json"] else {},
                })
        results.sort(key=lambda r: r["similarity"], reverse=True)
        return results[:top_k]
    finally:
        conn.close()
