import os
import sqlite3

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
STANDARDS_DB_PATH = os.path.join(DATA_DIR, "standards.db")
MATERIALS_DB_PATH = os.path.join(DATA_DIR, "materials.db")


def seed_standards_db():
    if os.path.exists(STANDARDS_DB_PATH):
        os.remove(STANDARDS_DB_PATH)

    conn = sqlite3.connect(STANDARDS_DB_PATH)
    cursor = conn.cursor()

    # 1. Platformlar
    cursor.execute("""
    CREATE TABLE military_platforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_name TEXT NOT NULL UNIQUE,
        platform_category TEXT NOT NULL,
        standard_code TEXT NOT NULL,
        description TEXT
    );
    """)

    # 2. Titreşim Profilleri (MIL-STD-810H, RTCA DO-160G, STANAG 4370)
    cursor.execute("""
    CREATE TABLE vibration_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        method_code TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        annex_figure TEXT NOT NULL,
        calculated_grms REAL NOT NULL,
        duration_per_axis_minutes INTEGER NOT NULL,
        axes TEXT NOT NULL,
        mass_attenuation_applicable BOOLEAN DEFAULT 0,
        FOREIGN KEY(platform_id) REFERENCES military_platforms(id)
    );
    """)

    # 3. Kırılma Noktaları (Breakpoints)
    cursor.execute("""
    CREATE TABLE vibration_breakpoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER NOT NULL,
        seq_order INTEGER NOT NULL,
        frequency_hz REAL NOT NULL,
        psd_value REAL NOT NULL,
        slope_db_oct REAL,
        FOREIGN KEY(profile_id) REFERENCES vibration_profiles(id)
    );
    """)

    # 4. Sıcaklık Profilleri
    cursor.execute("""
    CREATE TABLE temperature_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        climatic_category TEXT NOT NULL,
        operational_high_c REAL NOT NULL,
        storage_high_c REAL NOT NULL,
        operational_low_c REAL NOT NULL,
        storage_low_c REAL NOT NULL,
        FOREIGN KEY(platform_id) REFERENCES military_platforms(id)
    );
    """)

    # 5. Mekanik Şok Profilleri
    cursor.execute("""
    CREATE TABLE shock_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform_id INTEGER NOT NULL,
        procedure_name TEXT NOT NULL,
        pulse_shape TEXT NOT NULL,
        peak_acceleration_g REAL NOT NULL,
        duration_ms REAL NOT NULL,
        num_shocks_per_axis INTEGER NOT NULL,
        FOREIGN KEY(platform_id) REFERENCES military_platforms(id)
    );
    """)

    # --- VERİ GİRİŞLERİ ---
    # Platform 1: Taktik İHA Kanat Altı (External Stores - MIL-STD-810H)
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('Taktik İHA Kanat Altı', 'UAV_EXTERNAL_STORE', 'MIL-STD-810H', 'Taktik ve Stratejik İHA kanat altı pylon ve pod donanımları.');
    """)
    p1_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, '514.8', 14, 'Annex C, Figure 514.8C-1', 7.70, 60, 'X,Y,Z', 1);
    """, (p1_id,))
    prof1_id = cursor.lastrowid

    bp1 = [
        (prof1_id, 1, 20.0, 0.0053, 6.0),
        (prof1_id, 2, 150.0, 0.0400, 0.0),
        (prof1_id, 3, 1000.0, 0.0400, -6.0),
        (prof1_id, 4, 2000.0, 0.0100, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp1)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'Basic Hot (A1) & Severe Cold (C2)', 71.0, 85.0, -40.0, -51.0);
    """, (p1_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Procedure I - Functional Shock', 'Terminal Peak Sawtooth (TPS)', 40.0, 11.0, 6);
    """, (p1_id,))

    # Platform 2: Taktik Tekerlekli Zırhlı Araç (MIL-STD-810H - Cat 4)
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('Taktik Tekerlekli Zırhlı Araç', 'GROUND_VEHICLE', 'MIL-STD-810H', '4x4 / 8x8 Zırhlı Muharebe Aracı gövde ve kule içi elektroniği.');
    """)
    p2_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, '514.8', 4, 'Annex A, Figure 514.8A-1', 2.24, 60, 'Vertical,Transverse,Longitudinal', 0);
    """, (p2_id,))
    prof2_id = cursor.lastrowid

    bp2 = [
        (prof2_id, 1, 5.0, 0.0050, 0.0),
        (prof2_id, 2, 10.0, 0.0100, 3.0),
        (prof2_id, 3, 40.0, 0.0100, -6.0),
        (prof2_id, 4, 500.0, 0.0001, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp2)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'Hot Dry (A2) & Basic Cold (C1)', 60.0, 71.0, -32.0, -40.0);
    """, (p2_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Procedure I - Functional Shock', 'Half-Sine', 20.0, 11.0, 6);
    """, (p2_id,))

    # Platform 3: Helikopter Aviyonik Bölmesi (MIL-STD-810H - Cat 20)
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('Helikopter Aviyonik Bölmesi', 'ROTARY_WING', 'MIL-STD-810H', 'Genel maksat ve taarruz helikopterleri kokpit ve aviyonik kompartmanı.');
    """)
    p3_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, '514.8', 20, 'Annex D, Figure 514.8D-1', 4.12, 120, 'X,Y,Z', 0);
    """, (p3_id,))
    prof3_id = cursor.lastrowid

    bp3 = [
        (prof3_id, 1, 10.0, 0.0020, 3.0),
        (prof3_id, 2, 40.0, 0.0150, 0.0),
        (prof3_id, 3, 500.0, 0.0150, -6.0),
        (prof3_id, 4, 2000.0, 0.0010, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp3)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'Basic Hot (A1) & Cold (C1)', 55.0, 71.0, -40.0, -46.0);
    """, (p3_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Procedure V - Crash Hazard Shock', 'Half-Sine', 75.0, 6.0, 2);
    """, (p3_id,))

    # Platform 4: RTCA DO-160G Curve S (Taktik İHA & Jet Aviyonik - Robust Random)
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('RTCA DO-160G Curve S - İHA & Jet Aviyonik', 'AIRBORNE_CIVIL_UAV', 'RTCA DO-160G', 'Sivil/askeri havacılık ve taktik İHA gövde içi aviyonik sistemleri (Section 8 Curve S Robust).');
    """)
    p4_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, 'Section 8', 8, 'Section 8, Curve S (Robust Random)', 8.25, 60, 'X,Y,Z', 0);
    """, (p4_id,))
    prof4_id = cursor.lastrowid

    bp4 = [
        (prof4_id, 1, 10.0, 0.0100, 3.0),
        (prof4_id, 2, 40.0, 0.0800, 0.0),
        (prof4_id, 3, 500.0, 0.0800, -6.0),
        (prof4_id, 4, 2000.0, 0.0050, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp4)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'Category B2/C - High/Low Temp', 70.0, 85.0, -55.0, -65.0);
    """, (p4_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Section 7 - Operational Shock', 'Half-Sine', 20.0, 11.0, 6);
    """, (p4_id,))

    # Platform 5: RTCA DO-160G Curve B/C (Sabit Kanatlı Uçak Gövdesi - Standard Random)
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('RTCA DO-160G Curve B/C - Sabit Kanatlı Uçak', 'FIXED_WING_AIRCRAFT', 'RTCA DO-160G', 'Sabit kanatlı turbojet ve turboprop uçak gövde ve kabin ekipmanları (Section 8 Standard Random).');
    """)
    p5_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, 'Section 8', 8, 'Section 8, Curve B/C (Standard Random)', 3.05, 60, 'X,Y,Z', 0);
    """, (p5_id,))
    prof5_id = cursor.lastrowid

    bp5 = [
        (prof5_id, 1, 10.0, 0.0010, 3.0),
        (prof5_id, 2, 40.0, 0.0100, 0.0),
        (prof5_id, 3, 500.0, 0.0100, -6.0),
        (prof5_id, 4, 2000.0, 0.0010, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp5)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'Category A1/A2 - Temperature & Altitude', 55.0, 70.0, -40.0, -55.0);
    """, (p5_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Section 7 - Crash Safety', 'Half-Sine', 6.0, 20.0, 2);
    """, (p5_id,))

    # Platform 6: RTCA DO-160G Curve F (Helikopter Döner Kanat)
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('RTCA DO-160G Curve F - Döner Kanat / Helikopter', 'ROTARY_WING_CIVIL', 'RTCA DO-160G', 'Döner kanatlı hava araçları ve genel maksat helikopter kompartmanı (Section 8 Curve F).');
    """)
    p6_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, 'Section 8', 8, 'Section 8, Curve F (Helicopter)', 4.30, 90, 'X,Y,Z', 0);
    """, (p6_id,))
    prof6_id = cursor.lastrowid

    bp6 = [
        (prof6_id, 1, 10.0, 0.0020, 3.0),
        (prof6_id, 2, 50.0, 0.0200, 0.0),
        (prof6_id, 3, 500.0, 0.0200, -6.0),
        (prof6_id, 4, 2000.0, 0.0020, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp6)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'Category B1/C - Helicopter Temp', 60.0, 75.0, -45.0, -55.0);
    """, (p6_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Section 7 - Operational Shock', 'Half-Sine', 15.0, 11.0, 6);
    """, (p6_id,))

    # Platform 7: STANAG 4370 NATO Paletli Zırhlı Muharebe Aracı
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('STANAG 4370 NATO Paletli Zırhlı Araç', 'TRACKED_COMBAT_VEHICLE', 'STANAG 4370', 'NATO müttefik çevresel test koşulları - Taktik paletli zırhlı muharebe araçları (AECTP-400 Method 401).');
    """)
    p7_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, 'AECTP-400 Method 401', 401, 'Method 401, Figure 401-1 Tracked', 3.45, 90, 'Vertical,Transverse,Longitudinal', 0);
    """, (p7_id,))
    prof7_id = cursor.lastrowid

    bp7 = [
        (prof7_id, 1, 5.0, 0.0050, 6.0),
        (prof7_id, 2, 15.0, 0.0400, 0.0),
        (prof7_id, 3, 50.0, 0.0400, -6.0),
        (prof7_id, 4, 500.0, 0.0010, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp7)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'A1 Extreme Hot & C2 Extreme Cold', 65.0, 75.0, -46.0, -55.0);
    """, (p7_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Method 403 - Functional Shock', 'Terminal Peak Sawtooth (TPS)', 30.0, 11.0, 6);
    """, (p7_id,))

    # Platform 8: STANAG 4370 NATO Taktik Tekerlekli Araç
    cursor.execute("""
    INSERT INTO military_platforms (platform_name, platform_category, standard_code, description)
    VALUES ('STANAG 4370 NATO Taktik Tekerlekli Araç', 'WHEELED_COMBAT_VEHICLE', 'STANAG 4370', 'NATO müttefik taktik lojistik ve zırhlı tekerlekli kara araçları (AECTP-400 Method 401 Wheeled).');
    """)
    p8_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO vibration_profiles (platform_id, method_code, category_id, annex_figure, calculated_grms, duration_per_axis_minutes, axes, mass_attenuation_applicable)
    VALUES (?, 'AECTP-400 Method 401', 401, 'Method 401, Figure 401-2 Wheeled', 1.49, 90, 'Vertical,Transverse,Longitudinal', 0);
    """, (p8_id,))
    prof8_id = cursor.lastrowid

    bp8 = [
        (prof8_id, 1, 5.0, 0.0020, 6.0),
        (prof8_id, 2, 20.0, 0.0200, 0.0),
        (prof8_id, 3, 60.0, 0.0200, -6.0),
        (prof8_id, 4, 500.0, 0.0005, 0.0),
    ]
    cursor.executemany("""
    INSERT INTO vibration_breakpoints (profile_id, seq_order, frequency_hz, psd_value, slope_db_oct)
    VALUES (?, ?, ?, ?, ?);
    """, bp8)

    cursor.execute("""
    INSERT INTO temperature_profiles (platform_id, climatic_category, operational_high_c, storage_high_c, operational_low_c, storage_low_c)
    VALUES (?, 'A2 Hot Dry & C1 Basic Cold', 58.0, 71.0, -35.0, -45.0);
    """, (p8_id,))

    cursor.execute("""
    INSERT INTO shock_profiles (platform_id, procedure_name, pulse_shape, peak_acceleration_g, duration_ms, num_shocks_per_axis)
    VALUES (?, 'Method 403 - Functional Shock', 'Half-Sine', 20.0, 11.0, 6);
    """, (p8_id,))

    conn.commit()
    conn.close()
    print(f"Standards database created and seeded at: {STANDARDS_DB_PATH}")


def seed_materials_db():
    if os.path.exists(MATERIALS_DB_PATH):
        os.remove(MATERIALS_DB_PATH)

    conn = sqlite3.connect(MATERIALS_DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        density_kg_m3 REAL NOT NULL,
        elastic_modulus_gpa REAL NOT NULL,
        poissons_ratio REAL NOT NULL,
        yield_strength_mpa REAL NOT NULL,
        ultimate_strength_mpa REAL NOT NULL,
        cte_per_k REAL NOT NULL,
        basquin_a_mpa REAL NOT NULL,
        basquin_b_exponent REAL NOT NULL,
        description TEXT
    );
    """)

    materials = [
        (
            "Aluminium 6061-T6",
            "ALUMINIUM_ALLOY",
            2700.0,
            68.9,
            0.33,
            275.0,
            310.0,
            23.0e-6,
            490.0,
            -0.108,
            "Havacılık ve savunma gövde yapılarında en yaygın kullanılan hafif alaşım."
        ),
        (
            "Aluminium 7075-T6",
            "ALUMINIUM_ALLOY",
            2810.0,
            71.7,
            0.33,
            503.0,
            572.0,
            23.4e-6,
            780.0,
            -0.112,
            "Yüksek mukavemetli uçak ve füze kanat/pylon bağlantı braketleri."
        ),
        (
            "Titanium Ti-6Al-4V (Grade 5)",
            "TITANIUM_ALLOY",
            4430.0,
            113.8,
            0.34,
            880.0,
            950.0,
            8.6e-6,
            1200.0,
            -0.095,
            "Yüksek sıcaklık dayanımı ve korozyon direnci gerektiren kritik savunma elemanları."
        ),
        (
            "Structural Steel 4340",
            "STEEL_ALLOY",
            7850.0,
            205.0,
            0.29,
            470.0,
            740.0,
            12.3e-6,
            950.0,
            -0.090,
            "Ağır yük taşıyıcı mafsallar ve kara araçları şasi elemanları."
        ),
        (
            "Stainless Steel 304 / A2-70",
            "FASTENER_STEEL",
            7900.0,
            193.0,
            0.29,
            450.0,
            700.0,
            17.3e-6,
            850.0,
            -0.100,
            "Standart askeri aviyonik ve şasi montaj cıvataları."
        ),
        (
            "Alumec 89 (Fixture Alloy)",
            "FIXTURE_ALLOY",
            2830.0,
            72.0,
            0.33,
            590.0,
            640.0,
            23.0e-6,
            750.0,
            -0.110,
            "Yüksek rijitlik/kütle oranına sahip sarsıcı tabla fikstür alüminyum alaşımı."
        ),
        (
            "C45 Carbon Steel (1.0503)",
            "STEEL_ALLOY",
            7850.0,
            210.0,
            0.30,
            430.0,
            650.0,
            12.0e-6,
            800.0,
            -0.095,
            "Ağır yük ve rijit sarsıcı test fikstürleri için yekpare ıslah çeliği."
        ),
        (
            "Kovar (Fe-Ni29-Co17)",
            "LOW_EXPANSION_ALLOY",
            8360.0,
            138.0,
            0.30,
            340.0,
            520.0,
            5.5e-6,
            600.0,
            -0.095,
            "Hermetik mikroelektronik ve aviyonik paket gövde kapağı alaşımı (cam/seramik uyumlu genleşme)."
        ),
        (
            "Invar 36 (Fe-Ni36)",
            "LOW_EXPANSION_ALLOY",
            8050.0,
            144.0,
            0.28,
            240.0,
            490.0,
            1.2e-6,
            520.0,
            -0.090,
            "Ultra düşük ısıl genleşmeli elektro-optik, lazer ve jiroskop yatak gövdesi alaşımı."
        ),
        (
            "Inconel 718 (Nickel Superalloy)",
            "SUPERALLOY",
            8190.0,
            205.0,
            0.29,
            1100.0,
            1375.0,
            13.0e-6,
            1500.0,
            -0.085,
            "Roket motoru, gaz türbini ve yüksek sıcaklık aşırı yük savunma bileşenleri."
        ),
        (
            "Beryllium Copper CuBe2 (C17200)",
            "COPPER_ALLOY",
            8250.0,
            131.0,
            0.30,
            965.0,
            1140.0,
            17.0e-6,
            1200.0,
            -0.092,
            "Yüksek mukavemet, aşınma direnci ve RF iletkenliği sağlayan askeri konektör ve yay alaşımı."
        ),
        (
            "PEEK (Polyetheretherketone)",
            "ENGINEERING_POLYMER",
            1320.0,
            4.0,
            0.38,
            100.0,
            115.0,
            47.0e-6,
            130.0,
            -0.110,
            "Hafif, korozyonsuz ve yüksek dielektrik dayanımlı havacılık yapısal termoplastiği."
        ),
        (
            "Carbon Fiber CFRP (Quasi-Isotropic)",
            "COMPOSITE_LAMINATE",
            1550.0,
            65.0,
            0.31,
            550.0,
            720.0,
            2.0e-6,
            800.0,
            -0.075,
            "T300/Epoksi [0/45/90/-45]s dengeli simetrik kuasi-izotropik havacılık laminatı."
        ),
    ]

    cursor.executemany("""
    INSERT INTO materials (
        name, category, density_kg_m3, elastic_modulus_gpa, poissons_ratio,
        yield_strength_mpa, ultimate_strength_mpa, cte_per_k,
        basquin_a_mpa, basquin_b_exponent, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, materials)

    conn.commit()
    conn.close()
    print(f"Materials database created and seeded at: {MATERIALS_DB_PATH}")


if __name__ == "__main__":
    seed_standards_db()
    seed_materials_db()
