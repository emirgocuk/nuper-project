import os
import sys
import sqlite3
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

db_path = os.path.join(os.path.dirname(__file__), '..', 'test_assets', 'benchmarks.db')
json_path = os.path.join(os.path.dirname(__file__), '..', 'test_assets', 'BENCH_LAB', 'master_laboratory_index.json')

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# 1. Standartlar Tablosu
cur.execute('''
CREATE TABLE IF NOT EXISTS standards (
    code TEXT PRIMARY KEY,
    title TEXT,
    domain TEXT,
    key_requirements TEXT
)
''')

standards_data = [
    ("ISO 1101", "Geometrical product specifications (GPS) - Geometrical tolerancing", "GD&T", "Tolerances of form, orientation, location and run-out."),
    ("ASME Y14.5", "Dimensioning and Tolerancing", "GD&T", "Datum Reference Frames (DRF), MMC/LMC modifiers, Composite tolerances."),
    ("ISO 14253-1", "Decision rules for proving conformity or nonconformity with specifications", "Metroloji", "Guard-banding: Pass, Suspect, Fail zones using expanded uncertainty U95."),
    ("ISO 15530-3", "Coordinate measuring machines (CMM) - Evaluation of measurement uncertainty", "CMM Uncertainty", "Calibrated workpieces technique for evaluating task-specific uncertainty."),
    ("AS9100 Rev D", "Quality Management Systems - Requirements for Aviation, Space and Defense", "Savunma/Havacılık", "Tam izlenebilirlik, dijital imza (SHA-256) ve tahrifat önleme.")
]

cur.executemany('INSERT OR REPLACE INTO standards VALUES (?, ?, ?, ?)', standards_data)

# 2. Benchmark Numuneleri Tablosu
cur.execute('''
CREATE TABLE IF NOT EXISTS specimens (
    specimen_index INTEGER PRIMARY KEY,
    specimen_id TEXT,
    name TEXT,
    category TEXT,
    part_number TEXT,
    cad_file TEXT,
    drawing_file TEXT,
    description TEXT
)
''')

cur.execute('''
CREATE TABLE IF NOT EXISTS specimen_tolerances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specimen_id TEXT,
    feature TEXT,
    tolerance_type TEXT,
    value REAL,
    unit TEXT
)
''')

if os.path.exists(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        specimens = json.load(f)
        for s in specimens:
            cur.execute('''
            INSERT OR REPLACE INTO specimens (specimen_index, specimen_id, name, category, part_number, cad_file, drawing_file, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                s.get('specimen_index'),
                s.get('specimen_id'),
                s.get('name'),
                s.get('category'),
                s.get('part_number'),
                s.get('cad_file'),
                s.get('drawing_file'),
                s.get('description')
            ))

            for t in s.get('target_tolerances', []):
                cur.execute('''
                INSERT INTO specimen_tolerances (specimen_id, feature, tolerance_type, value, unit)
                VALUES (?, ?, ?, ?, ?)
                ''', (
                    s.get('specimen_id'),
                    t.get('feature'),
                    t.get('tolerance_type'),
                    t.get('value'),
                    t.get('unit')
                ))

conn.commit()
conn.close()
print(f"✓ SQLite veritabanı başarıyla oluşturuldu ve indekslendi: {os.path.abspath(db_path)}")
