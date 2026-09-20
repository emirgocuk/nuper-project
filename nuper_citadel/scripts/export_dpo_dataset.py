"""
Nuper Citadel - DPO Dataset Exporter & LoRA Fine-Tuning Pipeline
================================================================
Extracts human engineer corrections and preference pairs (prompt, chosen, rejected)
from the local SQLite telemetry database (telemetry.db) and generates:
1. Standard HuggingFace / TRL / Unsloth DPO training dataset (JSONL).
2. LoRA fine-tuning hyperparameters configuration for local air-gapped Qwen 2.5 models.
"""

import json
import os
import sqlite3
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(ROOT_DIR, "engine", "data")
TELEMETRY_DB = os.path.join(DATA_DIR, "telemetry.db")
OUTPUT_DIR = os.path.join(ROOT_DIR, "engine", "training")


def ensure_telemetry_table(conn: sqlite3.Connection):
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback_dpo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        component TEXT NOT NULL,
        prompt TEXT NOT NULL,
        chosen TEXT NOT NULL,
        rejected TEXT NOT NULL,
        engineer_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()


def seed_sample_defense_dpo(conn: sqlite3.Connection):
    """Provides initial defense calibration pairs if the database is newly initialized."""
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM feedback_dpo")
    count = cursor.fetchone()[0]
    if count > 0:
        return

    sample_records = [
        (
            "ETP_SYNTHESIS",
            "Generate MIL-STD-810H Method 514.8 Category 14 vibration section for Aluminium 6061-T6 bracket under 7.70 gRMS.",
            "## 3. Titreşim Test Spektrumu ve Prosedürü\n\nMIL-STD-810H Metot 514.8 Kategori 14 uyarınca 20-2000 Hz bandında 7.70 gRMS rastgele titreşim uygulanacaktır. Kütle sönümleme faktörü W = 0.85 uygulanmış olup, her 3 eksende 60'ar dakika test icra edilecektir.",
            "Titreşim testi yapılacaktır. Değerler normaldir ve parçanın dayanması beklenmektedir.",
            "Standart askeri format ve kesin parametrik frekans kırılımları içermelidir.",
        ),
        (
            "OBJECTION_LETTER",
            "Draft objection letter to customer against 12 gRMS over-testing on tactical UAV pod.",
            "T.C. MİLLİ SAVUNMA BAKANLIĞI / İLGİLİ TEDARİK DAİRE BAŞKANLIĞI'NA\n\nİlgi: 12 gRMS Yüksek Seviye Titreşim Test Talebi hk.\n\nSöz konusu aviyonik pod birimi MIL-STD-810H Kategori 14 uyarınca 7.70 gRMS seviyesinde kalifiye edilmek üzere tasarlanmıştır. Talep edilen 12.0 gRMS seviyesi, gövde montaj cıvatalarında Palmgren-Miner hasar indeksini D = 0.84 seviyesine çıkararak erken yorulma hasarına yol açacaktır. MIL-STD-810H Bölüm 514.8 Paragraf 4.2 uyarınca test spektrumuna 240-260 Hz bandında -6 dB çentikleme (notching) uygulanmasını arz ederiz.",
            "Testi bu seviyede yapamayız, parçamız kırılabilir.",
            "Resmi savunma dili, standart madde numaraları ve teknik gerekçeler sunulmalıdır.",
        ),
    ]

    cursor.executemany(
        """
        INSERT INTO feedback_dpo (component, prompt, chosen, rejected, engineer_notes)
        VALUES (?, ?, ?, ?, ?);
        """,
        sample_records,
    )
    conn.commit()
    print(f"[DPO Exporter] {len(sample_records)} referans askeri kalibrasyon çifti eklendi.")


def export_dpo_pipeline(output_jsonl: str = None):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if not output_jsonl:
        output_jsonl = os.path.join(OUTPUT_DIR, "dpo_preference_dataset.jsonl")

    conn = sqlite3.connect(TELEMETRY_DB)
    ensure_telemetry_table(conn)
    seed_sample_defense_dpo(conn)

    cursor = conn.cursor()
    cursor.execute("SELECT id, component, prompt, chosen, rejected, engineer_notes, created_at FROM feedback_dpo")
    rows = cursor.fetchall()
    conn.close()

    records = []
    for r in rows:
        record_id, comp, prompt_text, chosen_text, rejected_text, notes, created_at = r
        dpo_item = {
            "id": f"nuper_dpo_{record_id}",
            "component": comp,
            "prompt": prompt_text,
            "chosen": chosen_text,
            "rejected": rejected_text,
            "metadata": {
                "source": "nuper_citadel_telemetry",
                "notes": notes,
                "created_at": created_at,
            },
        }
        records.append(dpo_item)

    with open(output_jsonl, "w", encoding="utf-8") as f:
        for item in records:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    # Generate LoRA Hyperparameter Config
    lora_config = {
        "model_name_or_path": "Qwen/Qwen2.5-Coder-7B-Instruct",
        "lora_r": 16,
        "lora_alpha": 32,
        "lora_dropout": 0.05,
        "target_modules": ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        "dpo_beta": 0.1,
        "learning_rate": 5e-5,
        "batch_size": 2,
        "gradient_accumulation_steps": 4,
        "epochs": 3,
        "warmup_ratio": 0.1,
        "dataset_path": output_jsonl,
        "air_gapped_training": True,
        "output_dir": os.path.join(OUTPUT_DIR, "qwen_citadel_lora_checkpoint"),
    }

    config_path = os.path.join(OUTPUT_DIR, "lora_dpo_config.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(lora_config, f, indent=2, ensure_ascii=False)

    print(f"[DPO Exporter] Başarıyla ihraç edildi: {len(records)} kayıt -> {output_jsonl}")
    print(f"[DPO Exporter] LoRA eğitim konfigürasyonu üretildi: {config_path}")
    return len(records)


if __name__ == "__main__":
    count = export_dpo_pipeline()
    sys.exit(0 if count > 0 else 1)
