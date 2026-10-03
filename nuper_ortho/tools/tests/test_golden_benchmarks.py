import os
import sqlite3
import pytest

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(current_dir))
db_path = os.path.join(root_dir, "test_assets", "benchmarks.db")


def get_db_connection():
    if not os.path.exists(db_path):
        pytest.skip(f"SQLite benchmark veritabanı bulunamadı: {db_path}")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def test_sqlite_benchmark_specimens_count():
    """
    Faz 5.2 gereği: Veritabanında en az 10 adet referans test numunesi bulunmalıdır.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM specimens")
    count = cur.fetchone()[0]
    conn.close()

    assert count >= 10, f"En az 10 numune bekleniyordu, mevcut: {count}"


def test_sqlite_benchmark_standards_catalog():
    """
    Metroloji standartlarının (ASME Y14.5, ISO 1101, AS9100 Rev D vb.) veritabanında tanımlı olduğunu doğrular.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT code, title FROM standards")
    standards = {row["code"]: row["title"] for row in cur.fetchall()}
    conn.close()

    assert "ASME Y14.5" in standards
    assert "ISO 1101" in standards
    assert "AS9100 Rev D" in standards
    assert "ISO 15530-3" in standards


def test_sqlite_golden_specimens_integrity():
    """
    12 amiral gemisi numunenin CAD dosya yolları ve kategori tanımlarını doğrular.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT specimen_index, specimen_id, name, category, cad_file FROM specimens ORDER BY specimen_index")
    rows = cur.fetchall()
    conn.close()

    assert len(rows) == 12

    for row in rows:
        assert row["specimen_id"].startswith("BENCH_")
        assert len(row["name"]) > 3
        assert len(row["category"]) > 3
        assert row["cad_file"].endswith(".stp")


def test_sqlite_specimen_tolerances_validity():
    """
    Her numuneye ait toleransların matematiksel geçerliliğini doğrular:
    - Tolerans değeri pozitif (> 0)
    - Tolerans tipleri (FLATNESS, CYLINDRICITY, TRUE_POSITION vb.)
    """
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT s.name, t.feature, t.tolerance_type, t.value, t.unit
        FROM specimen_tolerances t
        JOIN specimens s ON t.specimen_id = s.specimen_id
    """)
    tolerances = cur.fetchall()
    conn.close()

    assert len(tolerances) >= 30, f"En az 30 adet kritik tolerans kaydı bekleniyordu, mevcut: {len(tolerances)}"

    for tol in tolerances:
        assert tol["value"] > 0, f"Tolerans değeri pozitif olmalıdır: {tol['feature']} = {tol['value']}"
        assert tol["unit"] in ["mm", "deg"]
        assert len(tol["tolerance_type"]) > 2
