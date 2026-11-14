import argparse
from datetime import datetime, timezone
import json
import math
import os
import re
import sqlite3
import sys
from typing import Any, Dict, List, Optional, Tuple


DEFAULT_LEARNING_DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "test_assets", "ortho_learning.db")
)

DEFAULT_DIMENSION_WEIGHTS: Dict[str, float] = {
    "bias": 0.90,
    "in_table_region": -2.80,
    "has_leader_line": 0.90,
    "has_extension_line": 0.75,
    "aspect_ratio_norm": 0.12,
    "relative_page_y": -0.15,
    "is_reference_dimension": -3.20,
    "fp_similarity": -2.60,
}

DEFAULT_SURFACE_WEIGHTS: Dict[str, float] = {
    "bias": -1.60,
    "nominal_closeness": 1.60,
    "type_compatible": 1.10,
    "axis_aligned": 0.60,
    "spatial_proximity": 0.90,
    "positive_binding_sim": 2.60,
    "negative_binding_sim": -2.40,
}


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sigmoid(z: float) -> float:
    clamped = max(-30.0, min(30.0, float(z)))
    return 1.0 / (1.0 + math.exp(-clamped))


def _normalize_text_key(text: str) -> str:
    cleaned = re.sub(r"(\d),(\d)", r"\1.\2", str(text or ""))
    return re.sub(r"\s+", " ", cleaned).strip().upper()


def _text_similarity(a: str, b: str) -> float:
    na = _normalize_text_key(a)
    nb = _normalize_text_key(b)
    if not na or not nb:
        return 0.0
    if na == nb:
        return 1.0
    ta = set(re.findall(r"[A-Z0-9\.]+", na))
    tb = set(re.findall(r"[A-Z0-9\.]+", nb))
    if not ta or not tb:
        return 0.0
    inter = len(ta & tb)
    union = len(ta | tb)
    return inter / max(1, union)


def _ensure_column(cur: sqlite3.Cursor, table: str, column: str, col_type: str) -> None:
    cur.execute(f"PRAGMA table_info({table})")
    existing = {str(row[1]) for row in cur.fetchall()}
    if column not in existing:
        cur.execute(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}")


def ensure_learning_tables(db_path: Optional[str] = None) -> str:
    target = os.path.abspath(db_path or DEFAULT_LEARNING_DB_PATH)
    parent = os.path.dirname(target)
    if parent:
        os.makedirs(parent, exist_ok=True)
    conn = sqlite3.connect(target)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS false_positive_patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                raw_text TEXT,
                aspect_ratio REAL,
                in_table_region INTEGER,
                has_leader_line INTEGER,
                relative_page_y REAL,
                surrounding_tokens TEXT,
                part_hash TEXT,
                created_at TEXT
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS parsing_corrections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                raw_ocr_text TEXT,
                corrected_nominal REAL,
                corrected_upper_tol TEXT,
                corrected_lower_tol TEXT,
                corrected_type TEXT,
                part_hash TEXT,
                created_at TEXT
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS surface_binding_samples (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                feature_2d_json TEXT,
                surface_3d_json TEXT,
                label INTEGER,
                part_hash TEXT,
                created_at TEXT
            )
            """
        )
        _ensure_column(cur, "false_positive_patterns", "part_hash", "TEXT")
        _ensure_column(cur, "parsing_corrections", "part_hash", "TEXT")
        _ensure_column(cur, "surface_binding_samples", "part_hash", "TEXT")
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_weights (
                model_key TEXT PRIMARY KEY,
                weights_json TEXT,
                updated_at TEXT
            )
            """
        )
        now = _utc_now_iso()
        cur.execute(
            "INSERT OR IGNORE INTO learning_weights (model_key, weights_json, updated_at) VALUES (?, ?, ?)",
            ("dimension_validity", json.dumps(DEFAULT_DIMENSION_WEIGHTS), now),
        )
        cur.execute(
            "INSERT OR IGNORE INTO learning_weights (model_key, weights_json, updated_at) VALUES (?, ?, ?)",
            ("surface_match", json.dumps(DEFAULT_SURFACE_WEIGHTS), now),
        )
        conn.commit()
    finally:
        conn.close()
    return target


class ActiveLearningMatcher:
    def __init__(self, db_path: Optional[str] = None) -> None:
        self.db_path = ensure_learning_tables(db_path)

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _load_weights(self, model_key: str, defaults: Dict[str, float]) -> Dict[str, float]:
        weights = dict(defaults)
        conn = self._connect()
        try:
            cur = conn.cursor()
            cur.execute("SELECT weights_json FROM learning_weights WHERE model_key = ?", (model_key,))
            row = cur.fetchone()
            if row and row[0]:
                loaded = json.loads(row[0])
                if isinstance(loaded, dict):
                    for k, v in loaded.items():
                        if isinstance(v, (int, float)):
                            weights[k] = float(v)
        except Exception:
            pass
        finally:
            conn.close()
        return weights

    def _save_weights(self, model_key: str, weights: Dict[str, float]) -> None:
        conn = self._connect()
        try:
            cur = conn.cursor()
            cur.execute(
                "INSERT OR REPLACE INTO learning_weights (model_key, weights_json, updated_at) VALUES (?, ?, ?)",
                (model_key, json.dumps(weights), _utc_now_iso()),
            )
            conn.commit()
        finally:
            conn.close()

    def _compute_fp_similarity(self, candidate: Dict[str, Any]) -> float:
        raw_text = str(candidate.get("raw_text") or candidate.get("nominal_str") or "").strip()
        cand_ar = float(candidate.get("aspect_ratio", 1.0) or 1.0)
        cand_tbl = 1 if candidate.get("in_table_region") else 0
        cand_ldr = 1 if candidate.get("has_leader_line") else 0
        cand_y = float(candidate.get("relative_page_y", 0.5) or 0.5)

        conn = self._connect()
        rows: List[Tuple[Any, ...]] = []
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT raw_text, aspect_ratio, in_table_region, has_leader_line, relative_page_y FROM false_positive_patterns"
            )
            rows = cur.fetchall()
        finally:
            conn.close()

        best_sim = 0.0
        for row in rows:
            r_text, r_ar, r_tbl, r_ldr, r_y = row
            t_sim = _text_similarity(raw_text, str(r_text or ""))
            geom_score = 0.0
            if int(r_tbl or 0) == cand_tbl:
                geom_score += 0.25
            if int(r_ldr or 0) == cand_ldr:
                geom_score += 0.25
            if abs(float(r_ar or 1.0) - cand_ar) <= 0.6:
                geom_score += 0.25
            if abs(float(r_y or 0.5) - cand_y) <= 0.15:
                geom_score += 0.25
            combined = 0.6 * t_sim + 0.4 * geom_score
            if combined > best_sim:
                best_sim = combined
        return min(1.0, max(0.0, best_sim))

    def _extract_dimension_features(self, candidate: Dict[str, Any], fp_sim: float) -> Dict[str, float]:
        ar = float(candidate.get("aspect_ratio", 1.0) or 1.0)
        return {
            "bias": 1.0,
            "in_table_region": 1.0 if candidate.get("in_table_region") else 0.0,
            "has_leader_line": 1.0 if candidate.get("has_leader_line") else 0.0,
            "has_extension_line": 1.0 if candidate.get("has_extension_line") else 0.0,
            "aspect_ratio_norm": min(3.0, max(0.0, ar)) / 3.0,
            "relative_page_y": min(1.0, max(0.0, float(candidate.get("relative_page_y", 0.5) or 0.5))),
            "is_reference_dimension": 1.0 if candidate.get("is_reference_dimension") else 0.0,
            "fp_similarity": min(1.0, max(0.0, fp_sim)),
        }

    def predict_is_valid_dimension(self, candidate_features: Dict[str, Any]) -> Tuple[bool, float]:
        fp_sim = self._compute_fp_similarity(candidate_features)
        feats = self._extract_dimension_features(candidate_features, fp_sim)
        weights = self._load_weights("dimension_validity", DEFAULT_DIMENSION_WEIGHTS)
        z = sum(weights.get(k, 0.0) * v for k, v in feats.items())
        prob = _sigmoid(z)
        return prob >= 0.5, round(prob, 4)

    def _extract_surface_pair_features(
        self,
        feature_2d: Dict[str, Any],
        surface_3d: Dict[str, Any],
    ) -> Dict[str, float]:
        nom_2d = float(feature_2d.get("nominal") or 0.0)
        nom_3d = float(
            surface_3d.get("nominal")
            or surface_3d.get("nominal_dimension")
            or surface_3d.get("diameter")
            or 0.0
        )
        if nom_2d > 0.0 and nom_3d > 0.0:
            scale = max(1.0, 0.15 * nom_2d)
            nominal_closeness = math.exp(-abs(nom_2d - nom_3d) / scale)
        else:
            nominal_closeness = 0.25

        t2 = str(feature_2d.get("type") or "LINEAR").upper()
        t3 = str(surface_3d.get("feature_type") or surface_3d.get("surfaceType") or surface_3d.get("type") or "").upper()
        type_compatible = 0.0
        if t2 in ("DIAMETER", "HOLE", "THREAD") and any(k in t3 for k in ("CYLINDER", "HOLE", "CIRCLE", "CONE")):
            type_compatible = 1.0
        elif t2 in ("RADIUS",) and any(k in t3 for k in ("CYLINDER", "TORUS", "FILLET")):
            type_compatible = 1.0
        elif t2 in ("LINEAR", "DISTANCE", "ANGULAR", "CHAMFER") and ("PLANE" in t3 or "DIST" in t3 or not t3):
            type_compatible = 1.0

        axis_2d = str(feature_2d.get("inferred_axis") or "").upper()
        normal_3d = surface_3d.get("normal") or surface_3d.get("axis") or [0.0, 0.0, 1.0]
        axis_aligned = 0.35
        if isinstance(normal_3d, (list, tuple)) and len(normal_3d) >= 3:
            nx, ny, nz = abs(float(normal_3d[0])), abs(float(normal_3d[1])), abs(float(normal_3d[2]))
            if axis_2d == "X" and nx >= 0.7:
                axis_aligned = 1.0
            elif axis_2d == "Y" and ny >= 0.7:
                axis_aligned = 1.0
            elif axis_2d == "Z" and nz >= 0.7:
                axis_aligned = 1.0
            elif axis_2d == "RADIAL" and ("CYLINDER" in t3 or "HOLE" in t3):
                axis_aligned = 1.0

        spatial_proximity = float(surface_3d.get("spatial_proximity", 0.5) or 0.5)
        pos_sim, neg_sim = self._compute_surface_binding_similarity(feature_2d, surface_3d)

        return {
            "bias": 1.0,
            "nominal_closeness": min(1.0, max(0.0, nominal_closeness)),
            "type_compatible": type_compatible,
            "axis_aligned": axis_aligned,
            "spatial_proximity": min(1.0, max(0.0, spatial_proximity)),
            "positive_binding_sim": pos_sim,
            "negative_binding_sim": neg_sim,
        }

    def _compute_surface_binding_similarity(
        self,
        feature_2d: Dict[str, Any],
        surface_3d: Dict[str, Any],
    ) -> Tuple[float, float]:
        conn = self._connect()
        rows: List[Tuple[str, str, int]] = []
        try:
            cur = conn.cursor()
            cur.execute("SELECT feature_2d_json, surface_3d_json, label FROM surface_binding_samples")
            rows = cur.fetchall()
        finally:
            conn.close()

        nom_2d = float(feature_2d.get("nominal") or 0.0)
        fid_3d = str(surface_3d.get("id") or surface_3d.get("featureId") or surface_3d.get("faceId") or "")
        t2 = str(feature_2d.get("type") or "").upper()
        c3 = surface_3d.get("center") or [0.0, 0.0, 0.0]

        best_pos = 0.0
        best_neg = 0.0
        for f2_raw, s3_raw, label in rows:
            try:
                f2 = json.loads(f2_raw)
                s3 = json.loads(s3_raw)
            except Exception:
                continue
            sim = 0.0
            s_nom = float(f2.get("nominal") or 0.0)
            if nom_2d > 0.0 and s_nom > 0.0 and abs(nom_2d - s_nom) <= 0.2:
                sim += 0.35
            if t2 and str(f2.get("type") or "").upper() == t2:
                sim += 0.15
            s_fid = str(s3.get("id") or s3.get("featureId") or s3.get("faceId") or "")
            if fid_3d and s_fid and fid_3d == s_fid:
                sim += 0.50
            else:
                sc3 = s3.get("center") or [0.0, 0.0, 0.0]
                if len(c3) >= 3 and len(sc3) >= 3:
                    dist = math.sqrt(
                        (float(c3[0]) - float(sc3[0])) ** 2
                        + (float(c3[1]) - float(sc3[1])) ** 2
                        + (float(c3[2]) - float(sc3[2])) ** 2
                    )
                    if dist <= 1.0:
                        sim += 0.50
                    elif dist <= 5.0:
                        sim += 0.25
            sim = min(1.0, sim)
            if int(label) == 1:
                best_pos = max(best_pos, sim)
            else:
                best_neg = max(best_neg, sim)
        return best_pos, best_neg

    def predict_surface_match_probability(
        self,
        feature_2d: Dict[str, Any],
        surface_3d: Dict[str, Any],
    ) -> float:
        feats = self._extract_surface_pair_features(feature_2d, surface_3d)
        weights = self._load_weights("surface_match", DEFAULT_SURFACE_WEIGHTS)
        z = sum(weights.get(k, 0.0) * v for k, v in feats.items())
        return round(_sigmoid(z), 4)

    def _run_online_sgd(
        self,
        model_key: str,
        defaults: Dict[str, float],
        features: Dict[str, float],
        target: float,
        learning_rate: float = 0.45,
        steps: int = 4,
    ) -> Dict[str, float]:
        weights = self._load_weights(model_key, defaults)
        for _ in range(steps):
            z = sum(weights.get(k, 0.0) * v for k, v in features.items())
            pred = _sigmoid(z)
            err = target - pred
            for k, v in features.items():
                if v != 0.0:
                    weights[k] = round(weights.get(k, 0.0) + learning_rate * err * v, 6)
        self._save_weights(model_key, weights)
        return weights

    def record_feedback(self, event: Dict[str, Any]) -> Dict[str, Any]:
        ev_type = str(event.get("type") or event.get("event_type") or "").upper().strip()
        part_hash = str(event.get("part_hash") or event.get("part_name") or "").strip()
        now = _utc_now_iso()

        if ev_type == "UNDO_LAST":
            return self.undo_last_feedback()

        if ev_type == "CLEAR_PART":
            return self.clear_feedback_for_part(part_hash or "*")

        if ev_type in ("FALSE_POSITIVE_BALLOON", "FALSE_POSITIVE"):
            feat = event.get("feature") or event.get("candidate") or event
            raw_text = str(feat.get("raw_text") or feat.get("feature_label") or feat.get("nominal_str") or feat.get("nominal") or "").strip()
            bbox = feat.get("bbox")
            aspect_ratio = float(feat.get("aspect_ratio") or 1.0)
            if isinstance(bbox, (list, tuple)) and len(bbox) >= 4:
                bw = max(1.0, float(bbox[2]) - float(bbox[0]))
                bh = max(1.0, float(bbox[3]) - float(bbox[1]))
                aspect_ratio = round(bw / bh, 3)
            in_table = 1 if feat.get("in_table_region") else 0
            has_leader = 1 if feat.get("has_leader_line") else 0
            rel_y = float(feat.get("relative_page_y") or 0.5)
            surrounding = json.dumps(feat.get("surrounding_tokens") or [], ensure_ascii=False)

            conn = self._connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    INSERT INTO false_positive_patterns
                    (raw_text, aspect_ratio, in_table_region, has_leader_line, relative_page_y, surrounding_tokens, part_hash, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (raw_text, aspect_ratio, in_table, has_leader, rel_y, surrounding, part_hash, now),
                )
                conn.commit()
            finally:
                conn.close()

            neg_sample = {
                "raw_text": raw_text,
                "aspect_ratio": aspect_ratio,
                "in_table_region": in_table,
                "has_leader_line": has_leader,
                "has_extension_line": 1 if feat.get("has_extension_line") else 0,
                "relative_page_y": rel_y,
                "is_reference_dimension": 1 if feat.get("is_reference_dimension") else 0,
            }
            feats = self._extract_dimension_features(neg_sample, fp_sim=1.0)
            weights = self._run_online_sgd("dimension_validity", DEFAULT_DIMENSION_WEIGHTS, feats, target=0.0, learning_rate=0.45, steps=5)
            return {"recorded": True, "type": "FALSE_POSITIVE_BALLOON", "weights": weights}

        if ev_type == "PARSING_CORRECTION":
            corr = event.get("correctedFeature") or event.get("corrected") or {}
            raw_text = str(event.get("rawText") or event.get("raw_ocr_text") or event.get("raw_text") or corr.get("raw_text") or "").strip()
            raw_nominal = corr.get("nominal") if corr.get("nominal") is not None else event.get("nominal")
            corrected_nominal = float(raw_nominal if raw_nominal is not None else 0.0)
            corrected_upper = str(corr.get("upper_tol") or corr.get("upper_tolerance") or event.get("upper_tol") or "")
            corrected_lower = str(corr.get("lower_tol") or corr.get("lower_tolerance") or event.get("lower_tol") or "")
            corrected_type = str(corr.get("type") or corr.get("feature_type") or event.get("feature_type") or "LINEAR")

            conn = self._connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    INSERT INTO parsing_corrections
                    (raw_ocr_text, corrected_nominal, corrected_upper_tol, corrected_lower_tol, corrected_type, part_hash, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (raw_text, corrected_nominal, corrected_upper, corrected_lower, corrected_type, part_hash, now),
                )
                conn.commit()
            finally:
                conn.close()
            return {"recorded": True, "type": "PARSING_CORRECTION", "raw_ocr_text": raw_text}

        if ev_type in ("SURFACE_BINDING_POSITIVE", "SURFACE_BINDING", "SURFACE_BINDING_NEGATIVE"):
            f2 = event.get("feature2D") or event.get("feature_2d") or {}
            s3 = event.get("surface3D") or event.get("surface_3d") or {}
            label = 0 if ev_type == "SURFACE_BINDING_NEGATIVE" else int(event.get("label", 1))

            conn = self._connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    INSERT INTO surface_binding_samples
                    (feature_2d_json, surface_3d_json, label, part_hash, created_at)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (json.dumps(f2, ensure_ascii=False), json.dumps(s3, ensure_ascii=False), label, part_hash, now),
                )
                conn.commit()
            finally:
                conn.close()

            feats = self._extract_surface_pair_features(f2, s3)
            weights = self._run_online_sgd(
                "surface_match",
                DEFAULT_SURFACE_WEIGHTS,
                feats,
                target=float(label),
                learning_rate=0.50,
                steps=5,
            )
            return {"recorded": True, "type": ev_type, "label": label, "weights": weights}

        return {"recorded": False, "error": f"Unknown feedback type: {ev_type}"}

    def apply_learned_parsing_correction(self, raw_text: str) -> Optional[Dict[str, Any]]:
        norm = _normalize_text_key(raw_text)
        if not norm:
            return None
        conn = self._connect()
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT raw_ocr_text, corrected_nominal, corrected_upper_tol, corrected_lower_tol, corrected_type FROM parsing_corrections ORDER BY id DESC LIMIT 100"
            )
            for row in cur.fetchall():
                if _normalize_text_key(str(row[0] or "")) == norm:
                    return {
                        "nominal": float(row[1]),
                        "upper_tol": str(row[2] or ""),
                        "lower_tol": str(row[3] or ""),
                        "type": str(row[4] or "LINEAR"),
                    }
        finally:
            conn.close()
        return None

    def get_recent_parsing_corrections(self, limit: int = 8) -> List[Dict[str, Any]]:
        conn = self._connect()
        rows: List[Tuple[Any, ...]] = []
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT raw_ocr_text, corrected_nominal, corrected_upper_tol, corrected_lower_tol, corrected_type, created_at FROM parsing_corrections ORDER BY id DESC LIMIT ?",
                (max(1, int(limit)),),
            )
            rows = cur.fetchall()
        finally:
            conn.close()
        return [
            {
                "raw_ocr_text": str(r[0] or ""),
                "corrected_nominal": float(r[1] or 0.0),
                "corrected_upper_tol": str(r[2] or ""),
                "corrected_lower_tol": str(r[3] or ""),
                "corrected_type": str(r[4] or "LINEAR"),
                "created_at": str(r[5] or ""),
            }
            for r in rows
        ]

    def _reset_weights_if_empty(self, cur: sqlite3.Cursor) -> None:
        now = _utc_now_iso()
        cur.execute("SELECT COUNT(*) FROM false_positive_patterns")
        if int(cur.fetchone()[0]) == 0:
            cur.execute(
                "INSERT OR REPLACE INTO learning_weights (model_key, weights_json, updated_at) VALUES (?, ?, ?)",
                ("dimension_validity", json.dumps(DEFAULT_DIMENSION_WEIGHTS), now),
            )
        cur.execute("SELECT COUNT(*) FROM surface_binding_samples")
        if int(cur.fetchone()[0]) == 0:
            cur.execute(
                "INSERT OR REPLACE INTO learning_weights (model_key, weights_json, updated_at) VALUES (?, ?, ?)",
                ("surface_match", json.dumps(DEFAULT_SURFACE_WEIGHTS), now),
            )

    def undo_last_feedback(self) -> Dict[str, Any]:
        tables = ("false_positive_patterns", "parsing_corrections", "surface_binding_samples")
        conn = self._connect()
        latest_table: Optional[str] = None
        latest_id: Optional[int] = None
        latest_ts = ""
        try:
            cur = conn.cursor()
            for table in tables:
                cur.execute(f"SELECT id, COALESCE(created_at, '') FROM {table} ORDER BY created_at DESC, id DESC LIMIT 1")
                row = cur.fetchone()
                if row is not None:
                    row_id = int(row[0])
                    row_ts = str(row[1] or "")
                    if latest_table is None or row_ts > latest_ts:
                        latest_table = table
                        latest_id = row_id
                        latest_ts = row_ts
            if latest_table is None or latest_id is None:
                return {"status": "empty", "undone_table": None, "undone_id": None}
            cur.execute(f"DELETE FROM {latest_table} WHERE id = ?", (latest_id,))
            self._reset_weights_if_empty(cur)
            conn.commit()
        finally:
            conn.close()
        return {"status": "ok", "undone_table": latest_table, "undone_id": latest_id}

    def clear_feedback_for_part(self, part_hash: str = "") -> Dict[str, Any]:
        target_hash = str(part_hash or "").strip()
        tables = ("false_positive_patterns", "parsing_corrections", "surface_binding_samples")
        deleted_total = 0
        conn = self._connect()
        try:
            cur = conn.cursor()
            if not target_hash or target_hash == "*":
                for table in tables:
                    cur.execute(f"DELETE FROM {table}")
                    deleted_total += max(0, int(cur.rowcount))
            else:
                for table in tables:
                    cur.execute(f"DELETE FROM {table} WHERE part_hash = ?", (target_hash,))
                    deleted_total += max(0, int(cur.rowcount))
            self._reset_weights_if_empty(cur)
            conn.commit()
        finally:
            conn.close()
        return {"status": "ok", "part_hash": target_hash or "*", "deleted_count": deleted_total}


def record_feedback(event: Dict[str, Any], db_path: Optional[str] = None) -> Dict[str, Any]:
    matcher = ActiveLearningMatcher(db_path=db_path)
    return matcher.record_feedback(event)


def undo_last_feedback(db_path: Optional[str] = None) -> Dict[str, Any]:
    matcher = ActiveLearningMatcher(db_path=db_path)
    return matcher.undo_last_feedback()


def clear_feedback_for_part(part_hash: str = "", db_path: Optional[str] = None) -> Dict[str, Any]:
    matcher = ActiveLearningMatcher(db_path=db_path)
    return matcher.clear_feedback_for_part(part_hash)


def main() -> None:
    parser = argparse.ArgumentParser(description="Nuper Ortho Active Learning Feedback Engine")
    parser.add_argument("--record-json", type=str, default="", help="JSON string describing feedback event")
    parser.add_argument("--undo-last", action="store_true", help="Undo most recent active learning feedback")
    parser.add_argument("--clear-part", nargs="?", const="*", default=None, help="Clear active learning feedback for a part hash or all")
    parser.add_argument("--db-path", type=str, default="", help="Optional SQLite DB path")
    args = parser.parse_args()

    matcher = ActiveLearningMatcher(db_path=args.db_path or None)
    if args.undo_last:
        print(json.dumps(matcher.undo_last_feedback(), ensure_ascii=False))
        return

    if args.clear_part is not None:
        print(json.dumps(matcher.clear_feedback_for_part(args.clear_part), ensure_ascii=False))
        return

    if args.record_json:
        payload = json.loads(args.record_json)
        res = matcher.record_feedback(payload)
        print(json.dumps(res, ensure_ascii=False))
        return

    raw_stdin = sys.stdin.read().strip()
    if raw_stdin:
        payload = json.loads(raw_stdin)
        res = matcher.record_feedback(payload)
        print(json.dumps(res, ensure_ascii=False))
        return

    print(json.dumps({"ok": True, "db_path": matcher.db_path}, ensure_ascii=False))


if __name__ == "__main__":
    main()
