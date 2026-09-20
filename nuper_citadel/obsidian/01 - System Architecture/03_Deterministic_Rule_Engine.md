---
title: 03. Deterministik Standart & Kural Motoru
created: 2026-09-20
tags:
  - architecture
  - rule-engine
  - mil-std-810h
  - sqlite
  - determinism
---

# ⚖️ 03. Deterministik Standart & Kural Motoru (`rule_engine.py`)

Savunma ve havacılık kalifikasyonunda **%99 doğruluk yetersizdir; %100 determinizm şarttır.** Bir askeri standardın frekans sınırını veya ivme genliğini yanlış hesaplayan bir sistem, yüzbinlerce dolarlık test numunelerinin kırılmasına yol açar. Bu nedenle Nuper Citadel, askeri standart eşlemelerini dil modellerine sormaz; **SQLite tabanlı katı kural motoru ve analitik karar ağaçları** ile çözer.

```
       ┌───────────────────────────────┐
       │     GİRDİ: GÖREV PROFİLİ      │
       │  (Platform, Bölge, Malzeme)   │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   DETERMİNİSTİK KARAR AĞACI   │
       │     (Analitik Filtreleme)     │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │    SQLITE: standards.db       │
       │  - MIL-STD-810H Tabloları     │
       │  - Frekans Kırılma Noktaları  │
       │  - Eğimler (dB/oct) & Grms    │
       │  - Test Süreleri & Eksenleri  │
       └───────────────┬───────────────┘
                       │
       ┌───────────────┴───────────────┐
       │                               │
       ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│    FEA ÖN-İŞLEMCİYE AKTAR   │ │    YEREL LLM'E CONTEXT ET   │
│  - PSD Kırılma Eğrileri     │ │  - Standart Maddeleri       │
│  - 100+ Noktalı Tablo       │ │  - Kabul Kriterleri Metni   │
└─────────────────────────────┘ └─────────────────────────────┘
```

---

## 1. Veri Tabanı Şeması (`standards.db`)

Motorun kalbinde, MIL-STD-810H ve benzeri standartların sayısal tablolarını tutan ilişkisel bir SQLite yapısı bulunur:

```sql
-- Platform ve Kategori Tanımları
CREATE TABLE military_platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_name TEXT NOT NULL,          -- Örn: "Taktik İHA Kanat Altı"
    vehicle_type TEXT NOT NULL,           -- "UAV", "Rotary_Wing", "Ground_Wheeled", "Missile"
    standard_code TEXT NOT NULL           -- "MIL-STD-810H"
);

-- Titreşim Spektrum Profilleri (Metot 514.8)
CREATE TABLE vibration_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER,
    method_code TEXT NOT NULL,            -- "514.8"
    category_id INTEGER NOT NULL,         -- 14 (External Stores)
    annex_figure TEXT,                    -- "Annex C, Figure 514.8C-1"
    calculated_grms REAL NOT NULL,        -- 7.7
    duration_per_axis_minutes INTEGER,    -- 60
    FOREIGN KEY(platform_id) REFERENCES military_platforms(id)
);

-- Spektrum Frekans ve PSD Kırılma Noktaları (Break Points)
CREATE TABLE vibration_breakpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER,
    seq_order INTEGER NOT NULL,
    frequency_hz REAL NOT NULL,           -- 20, 150, 1000, 2000
    psd_value REAL NOT NULL,              -- 0.0053, 0.0400, 0.0400, 0.0100
    slope_db_oct REAL,                    -- +6.0, 0.0, -6.0
    FOREIGN KEY(profile_id) REFERENCES vibration_profiles(id)
);

-- Sıcaklık ve İklim Profilleri (Metot 501.7 / 502.7)
CREATE TABLE temperature_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER,
    climatic_category TEXT NOT NULL,      -- "Basic Hot (A1)", "Cold (C1)"
    operational_high_c REAL NOT NULL,     -- +71.0
    storage_high_c REAL NOT NULL,         -- +85.0
    operational_low_c REAL NOT NULL,      -- -40.0
    storage_low_c REAL NOT NULL           -- -51.0
);
```

---

## 2. Kırılma Noktaları ve $g_{\text{rms}}$ İntegral Hesabı

Rastgele titreşim (Random Vibration) profilinin toplam efektif enerjisi olan $g_{\text{rms}}$ (Root Mean Square Acceleration), deterministik motor tarafından spektrum altındaki alanın integrali alınarak doğrulanır:

$$g_{\text{rms}} = \sqrt{\int_{f_{min}}^{f_{max}} W(f) \, df}$$

İki kırılma noktası ($f_1, W_1$) ve ($f_2, W_2$) arasında logaritmik eğim (slope $m$):

$$m = \frac{\log_{10}(W_2 / W_1)}{\log_{10}(f_2 / f_1)}$$

- Eğim $\text{dB/octave}$ cinsinden: $S = 10 \cdot m \cdot \log_{10}(2) \approx 3.0103 \cdot m$
- İki nokta arasındaki alan ($A_{1-2}$):
  - Eğer $m \neq -1$:
    $$A_{1-2} = \frac{W_1}{f_1^m (m + 1)} \left( f_2^{m+1} - f_1^{m+1} \right)$$
  - Eğer $m = -1$ (özel durum):
    $$A_{1-2} = W_1 \cdot f_1 \cdot \ln\left(\frac{f_2}{f_1}\right)$$

Tüm bantların alanları toplanarak karekökü alınır ve tablodaki $g_{\text{rms}}$ değeri doğrulanır. Kullanıcı bir parametreyi esnettiğinde motor anında yeni $g_{\text{rms}}$ değerini hesaplar.

---

## 3. Deterministik Karar Mantığı Örneği (`rule_engine.py`)

```python
import math
import sqlite3

class RuleEngine:
    def __init__(self, db_path: str = "engine/data/standards.db"):
        self.db_path = db_path

    def evaluate_mission_profile(self, platform_name: str, payload_mass_kg: float) -> dict:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 1. Platform Profilini Çek
        cursor.execute("""
            SELECT vp.id, vp.method_code, vp.category_id, vp.calculated_grms, vp.duration_per_axis_minutes
            FROM military_platforms mp
            JOIN vibration_profiles vp ON mp.id = vp.platform_id
            WHERE mp.platform_name = ?
        """, (platform_name,))
        row = cursor.fetchone()
        
        if not row:
            raise ValueError(f"Platform bulunamadı: {platform_name}")
            
        profile_id, method, cat, grms, duration = row
        
        # 2. Breakpoint'leri Çek
        cursor.execute("""
            SELECT frequency_hz, psd_value, slope_db_oct 
            FROM vibration_breakpoints 
            WHERE profile_id = ? ORDER BY seq_order
        """, (profile_id,))
        breakpoints = cursor.fetchall()
        
        # 3. Kütle Düzeltme Faktörü (Mass Attenuation)
        # MIL-STD-810H bazı hafif parçalar için kütle faktörü uygulayabilir
        effective_grms = grms
        if payload_mass_kg > 20.0:
            effective_grms = round(grms * math.pow(20.0 / payload_mass_kg, 0.15), 2)
            
        conn.close()
        
        return {
            "standard": "MIL-STD-810H",
            "method": f"Method {method}",
            "category": f"Category {cat}",
            "nominal_grms": grms,
            "effective_grms": effective_grms,
            "duration_minutes_per_axis": duration,
            "axes": ["X (Uçuş Doğrultusu)", "Y (Yanal)", "Z (Düşey)"],
            "breakpoints": [
                {"freq_hz": f, "psd_g2_hz": p, "slope": s} for f, p, s in breakpoints
            ]
        }
```

---
Bağlantılı Notlar:
- [[MIL_STD_810H_Method_514_Vibration|MIL-STD-810H Metot 514.8 Titreşim Detayları]]
- [[04_FEA_Bridge_PreProcessor|04. FEA Ön-İşlemci Jeneratörü]]
- [[05_Local_LLM_DPO_Pipeline|05. Yerel LLM ve Adaptif Öğrenme]]
