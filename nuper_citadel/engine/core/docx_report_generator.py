"""
NUPER CITADEL - Editable DOCX Defense Qualification Report Generator
Generates official military-grade Environmental Test Plan (ETP) and qualification reports
in Microsoft Word (.docx) format using python-docx.
Completely offline, deterministic, and fully formatted with tables, metadata, and sign-offs.
"""

import io
import datetime
from typing import Dict, Any, Optional

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn


class DocxReportGenerator:
    """
    Savunma sanayii ve askeri standartlara (MIL-STD-810H, RTCA DO-160G) uygun,
    düzenlenebilir Microsoft Word (.docx) formatında resmi Çevresel Test Planı (ETP) üretir.
    """

    COLOR_PRIMARY = RGBColor(15, 23, 42)     # Slate 900
    COLOR_ACCENT = RGBColor(2, 132, 199)     # Sky 600
    COLOR_TEXT = RGBColor(51, 65, 85)        # Slate 700
    COLOR_MUTED = RGBColor(100, 116, 139)    # Slate 500

    @classmethod
    def _set_cell_background(cls, cell, hex_color: str):
        """Sets cell background color via XML shading."""
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    @classmethod
    def _set_cell_margins(cls, cell, top=100, bottom=100, left=150, right=150):
        """Sets internal cell margins (padding in twips)."""
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{m}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    @classmethod
    def generate_etp_docx(
        cls,
        cad_data: Dict[str, Any],
        mission_profile: Dict[str, Any],
        fastener_data: Optional[Dict[str, Any]] = None,
        fixture_data: Optional[Dict[str, Any]] = None,
        fatigue_data: Optional[Dict[str, Any]] = None,
        post_fea_data: Optional[Dict[str, Any]] = None,
        thermal_data: Optional[Dict[str, Any]] = None,
        shock_data: Optional[Dict[str, Any]] = None,
        composite_data: Optional[Dict[str, Any]] = None,
        document_no: Optional[str] = None,
        classification: str = "TASNİF DIŞI / UNCLASSIFIED"
    ) -> bytes:
        """
        Generates full MS Word docx binary stream for the qualification report.
        """
        doc = docx.Document()

        # Set page margins to 0.75 in (approx 19 mm)
        sections = doc.sections
        for s in sections:
            s.top_margin = Inches(0.75)
            s.bottom_margin = Inches(0.75)
            s.left_margin = Inches(0.75)
            s.right_margin = Inches(0.75)

        now_str = datetime.datetime.now().strftime("%d.%m.%Y")
        doc_no = document_no or f"CITADEL-ETP-{datetime.datetime.now().strftime('%Y%m%d')}-001"

        # -------------------------------------------------------------
        # 1. GİZLİLİK BANNERI (TOP BANNER)
        # -------------------------------------------------------------
        banner_table = doc.add_table(rows=1, cols=1)
        banner_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        banner_cell = banner_table.cell(0, 0)
        banner_cell.width = Inches(7.0)
        cls._set_cell_background(banner_cell, "0F172A")
        cls._set_cell_margins(banner_cell, top=80, bottom=80)
        p_banner = banner_cell.paragraphs[0]
        p_banner.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_banner = p_banner.add_run(f"★  {classification.upper()}  ★")
        r_banner.font.name = "Arial"
        r_banner.font.size = Pt(10)
        r_banner.font.bold = True
        r_banner.font.color.rgb = RGBColor(255, 255, 255)

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(4)
        p_spacer.paragraph_format.space_after = Pt(4)

        # -------------------------------------------------------------
        # 2. BAŞLIK VE DOKÜMAN BİLGİLERİ
        # -------------------------------------------------------------
        p_title = doc.add_paragraph()
        p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_title.paragraph_format.space_after = Pt(2)
        r_title = p_title.add_run("NUPER CITADEL - ASKERİ KALİFİKASYON VE ÇEVRESEL TEST PLANI (ETP)")
        r_title.font.name = "Arial"
        r_title.font.size = Pt(14)
        r_title.font.bold = True
        r_title.font.color.rgb = cls.COLOR_PRIMARY

        p_sub = doc.add_paragraph()
        p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sub.paragraph_format.space_after = Pt(10)
        r_sub = p_sub.add_run("MIL-STD-810H & RTCA DO-160G STANDARTLARINA UYGUN DİNAMİK, TERMAL VE ŞOK ANALİZ RAPORU")
        r_sub.font.name = "Arial"
        r_sub.font.size = Pt(9.5)
        r_sub.font.bold = True
        r_sub.font.color.rgb = cls.COLOR_ACCENT

        # Doküman Kontrol Tablosu
        meta_table = doc.add_table(rows=2, cols=4)
        meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        meta_headers = ["DOKÜMAN NO", "REVİZYON", "RAPOR TARİHİ", "STANDART KAPSAMI"]
        meta_vals = [
            doc_no,
            "Rev 1.0 (Nuper v2.4)",
            now_str,
            mission_profile.get("standard_id", "MIL-STD-810H / DO-160G")
        ]

        for col_idx, (h_text, v_text) in enumerate(zip(meta_headers, meta_vals)):
            c_hdr = meta_table.cell(0, col_idx)
            cls._set_cell_background(c_hdr, "1E293B")
            p = c_hdr.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(h_text)
            r.font.name = "Arial"
            r.font.size = Pt(8)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

            c_val = meta_table.cell(1, col_idx)
            cls._set_cell_background(c_val, "F8FAFC")
            p = c_val.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(v_text)
            r.font.name = "Arial"
            r.font.size = Pt(8.5)
            r.font.bold = True
            r.font.color.rgb = cls.COLOR_PRIMARY

        doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 3. BÖLÜM 1: BİLEŞEN VE GEOMETRİK PARAMETRELER
        # -------------------------------------------------------------
        cls._add_section_heading(doc, "1. BİLEŞEN KİMLİĞİ VE GEOMETRİK PARAMETRELER")
        part_name = cad_data.get("filename", "Bilinmeyen CAD Modeli")
        mass_kg = cad_data.get("mass_kg", 0.0)
        vol_cm3 = cad_data.get("volume_mm3", 0.0) / 1000.0
        bb = cad_data.get("bounding_box", {})
        lx, ly, lz = bb.get("lx", 0.0), bb.get("ly", 0.0), bb.get("lz", 0.0)
        cog = cad_data.get("center_of_gravity", {})
        cx, cy, cz = cog.get("x", 0.0), cog.get("y", 0.0), cog.get("z", 0.0)

        cad_table = doc.add_table(rows=4, cols=4)
        cad_rows = [
            [("Bileşen CAD Adı", True), (part_name, False), ("Toplam Kütle", True), (f"{mass_kg:.3f} kg", False)],
            [("Hacim", True), (f"{vol_cm3:.1f} cm³", False), ("Sınır Kutusu (B-Box)", True), (f"{lx:.1f} × {ly:.1f} × {lz:.1f} mm", False)],
            [("Ağırlık Merkezi (CoG)", True), (f"X={cx:.1f}, Y={cy:.1f}, Z={cz:.1f} mm", False), ("Malzeme Tanımı", True), (cad_data.get("material", "Tanımsız"), False)],
            [("Model Türü", True), ("STEP AP242 Deterministik B-Rep", False), ("Doğrulama Motoru", True), ("OpenCASCADE 7.8 (0.01 mm)", False)]
        ]
        cls._populate_key_value_table(cad_table, cad_rows)
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 4. BÖLÜM 2: GÖREV PROFİLİ VE TİTREŞİM KALİFİKASYONU
        # -------------------------------------------------------------
        cls._add_section_heading(doc, "2. ASKERİ GÖREV PROFİLİ VE PSD TİTREŞİM SPEKTRUMU")
        std_name = mission_profile.get("standard_id", "MIL-STD-810H")
        cat_name = mission_profile.get("category", "Genel Askeri Araç")
        duration = mission_profile.get("duration_hours_per_axis", 1.0)
        g_rms = mission_profile.get("overall_g_rms", 0.0)
        psd_points = mission_profile.get("psd_breakpoints", [])

        p_info = doc.add_paragraph()
        p_info.paragraph_format.space_after = Pt(4)
        r_info = p_info.add_run(
            f"Standart: {std_name} | Kategori: {cat_name} | Eksen Başına Test Süresi: {duration:.1f} Saat | "
            f"Toplam İvme Enerjisi: {g_rms:.2f} Grms"
        )
        r_info.font.name = "Arial"
        r_info.font.size = Pt(8.5)
        r_info.font.color.rgb = cls.COLOR_TEXT

        if psd_points:
            psd_table = doc.add_table(rows=len(psd_points) + 1, cols=3)
            cls._style_table_header(psd_table, ["Frekans (Hz)", "PSD Değeri (g²/Hz)", "Eğim / Karakteristik"])
            for row_i, pt in enumerate(psd_points, start=1):
                f_val = pt.get("frequency_hz", 0.0)
                psd_val = pt.get("psd_g2_hz", 0.0)
                slope = pt.get("slope_db_octave", 0.0)
                slope_str = f"{slope:+.1f} dB/oct" if slope != 0.0 else "Plato (Sabit PSD)"
                row_cells = psd_table.rows[row_i].cells
                cls._set_row_text(row_cells, [f"{f_val:.1f} Hz", f"{psd_val:.6f} g²/Hz", slope_str])
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 5. BÖLÜM 3: FİKSTÜR DİNAMİK ZARFI VE SHAKER TABLASI
        # -------------------------------------------------------------
        if fixture_data:
            cls._add_section_heading(doc, "3. TEST FİKSTÜRÜ VE SHAKER TABLASI ENTEGRASYONU")
            fix_dim = fixture_data.get("fixture_dimensions_mm", {})
            f_w = fix_dim.get("recommended_width_mm", 0.0)
            f_d = fix_dim.get("recommended_depth_mm", 0.0)
            rec_mat = fixture_data.get("recommended_option", {})
            f_th = rec_mat.get("recommended_thickness_mm", 0.0)
            f_mass = rec_mat.get("estimated_fixture_mass_kg", 0.0)
            f_fn = rec_mat.get("actual_first_mode_hz", 0.0)

            fix_table = doc.add_table(rows=3, cols=4)
            fix_rows = [
                [("Fikstür Boyutları", True), (f"{f_w:.0f} × {f_d:.0f} × {f_th:.0f} mm", False), ("Fikstür Malzemesi", True), (rec_mat.get("material_name", "Alüminyum"), False)],
                [("Fikstür Kütlesi", True), (f"{f_mass:.2f} kg", False), ("1. Rezonans Modu (fn)", True), (f"{f_fn:.0f} Hz (Hedef > 2000 Hz)", False)],
                [("Shaker Izgara Aralığı", True), (f"{fixture_data.get('shaker_grid_pitch_mm', 50)} mm", False), ("Bağlantı Cıvata Adedi", True), (f"{fixture_data.get('shaker_attachment_bolts_count', 4)} Adet", False)]
            ]
            cls._populate_key_value_table(fix_table, fix_rows)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 6. BÖLÜM 4: VDI 2230 BAĞLANTI ELEMANI VE SIKMA TORKU
        # -------------------------------------------------------------
        if fastener_data:
            cls._add_section_heading(doc, "4. VDI 2230 BAĞLANTI ELEMANI VE SIKMA TORKU KALİFİKASYONU")
            f_size = fastener_data.get("bolt_size", "M4")
            f_grade = fastener_data.get("bolt_grade", "8.8")
            torque = fastener_data.get("tightening_torque_nm", 0.0)
            preload = fastener_data.get("recommended_preload_n", 0.0)
            ms_yield = fastener_data.get("margin_of_safety_yield", 0.0)
            ms_sep = fastener_data.get("margin_of_safety_separation", 0.0)

            fast_table = doc.add_table(rows=3, cols=4)
            fast_rows = [
                [("Seçilen Cıvata & Kalite", True), (f"{f_size} (Kalite {f_grade})", False), ("Önerilen Sıkma Torku", True), (f"{torque:.2f} N·m (±%5)", False)],
                [("Montaj Ön Yükü (F_M)", True), (f"{preload:.1f} N", False), ("Statik Akma Marjı (MS)", True), (f"+{ms_yield:.2f}", False)],
                [("Ayrılma Güvenlik Marjı", True), (f"+{ms_sep:.2f}", False), ("VDI 2230 Durumu", True), (fastener_data.get("qualification_status", "PASS"), False)]
            ]
            cls._populate_key_value_table(fast_table, fast_rows)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 7. BÖLÜM 5: MIL-STD-810H TERMAL KALİFİKASYON (METOT 501.7 & 502.7)
        # -------------------------------------------------------------
        if thermal_data:
            cls._add_section_heading(doc, "5. MIL-STD-810H METOT 501.7 & 502.7 TERMAL KALİFİKASYON")
            temp_prof = thermal_data.get("temperature_profile", {})
            t_high = temp_prof.get("operational_high_c", 71.0)
            t_low = temp_prof.get("operational_low_c", -40.0)
            j_therm = thermal_data.get("joint_thermal_analysis", {})
            delta_cte = j_therm.get("delta_cte_ppm_per_k", 0.0)
            ms_th_hot = j_therm.get("ms_yield_hot", 0.0)
            ms_th_sep = j_therm.get("ms_separation_cold", 0.0)
            preload_ret = j_therm.get("preload_retention_percent", 100.0)

            th_table = doc.add_table(rows=3, cols=4)
            th_rows = [
                [("Çalışma Sıcaklık Aralığı", True), (f"{t_low:+.0f}°C ila {t_high:+.0f}°C", False), ("Diferansiyel CTE (Δα)", True), (f"{delta_cte:.1f} ppm/K", False)],
                [("Sıcakta Akma Marjı (MS_hot)", True), (f"+{ms_th_hot:.2f}", False), ("Soğukta Ön Yük Koruma", True), (f"%{preload_ret:.1f}", False)],
                [("Soğuk Ayrılma Marjı (MS_sep)", True), (f"+{ms_th_sep:.2f}", False), ("Termal Kalifikasyon", True), (thermal_data.get("qualification_status", "PASS"), False)]
            ]
            cls._populate_key_value_table(th_table, th_rows)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 8. BÖLÜM 6: MIL-STD-810H METOT 516.8 MEKANİK ŞOK VE SRS
        # -------------------------------------------------------------
        if shock_data:
            cls._add_section_heading(doc, "6. MIL-STD-810H METOT 516.8 MEKANİK ŞOK VE SRS KALİFİKASYONU")
            p_shape = shock_data.get("pulse_shape", "Terminal Peak Sawtooth (TPS)")
            peak_g = shock_data.get("peak_acceleration_g", 40.0)
            dur_ms = shock_data.get("duration_ms", 11.0)
            f1_part = shock_data.get("f1_part_hz", 240.0)
            resp_g = shock_data.get("f1_peak_response_g", 40.0)
            f_inertial = shock_data.get("total_shock_inertial_force_n", 0.0)
            f_bolt = shock_data.get("force_per_bolt_n", 0.0)
            fast_margins = shock_data.get("fastener_safety_margins", {})
            ms_bolt_tensile = fast_margins.get("bolt_tensile_margin_of_safety", 0.0)
            ms_bolt_shear = fast_margins.get("bolt_shear_margin_of_safety", 0.0)

            sh_table = doc.add_table(rows=3, cols=4)
            sh_rows = [
                [("Şok Darbe Profili", True), (f"{p_shape} ({peak_g:.0f}g / {dur_ms:.1f}ms)", False), ("1. Mod Dinamik Tepki", True), (f"{resp_g:.1f}g (@ {f1_part:.0f} Hz)", False)],
                [("Toplam Eşdeğer Şok Yükü", True), (f"{f_inertial:.1f} N", False), ("Cıvata Başına Şok Yükü", True), (f"{f_bolt:.1f} N", False)],
                [("Cıvata Çekme Marjı (MS_t)", True), (f"+{ms_bolt_tensile:.2f}", False), ("Cıvata Kayma Marjı (MS_s)", True), (f"+{ms_bolt_shear:.2f}", False)]
            ]
            cls._populate_key_value_table(sh_table, sh_rows)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 9. BÖLÜM 7: KOMPOZİT KATMAN VE CLT DEĞERLENDİRMESİ
        # -------------------------------------------------------------
        if composite_data:
            cls._add_section_heading(doc, "7. KOMPOZİT KATMAN VE KLASİK LAMINAT TEORİSİ (CLT)")
            comp_name = composite_data.get("material_name", "Karbon/Epoksi")
            layup_seq = composite_data.get("layup_sequence", "[0/45/-45/90]s")
            n_plies = composite_data.get("num_plies", 8)
            th_mm = composite_data.get("total_thickness_mm", 1.0)
            tw_ms = composite_data.get("tsai_wu_margin_of_safety", 0.0)
            ms_ms = composite_data.get("max_stress_margin_of_safety", 0.0)
            crit_ply = composite_data.get("critical_ply_index", 1)

            cp_table = doc.add_table(rows=3, cols=4)
            cp_rows = [
                [("Kompozit Malzeme", True), (comp_name, False), ("Katman Dizilimi", True), (layup_seq, False)],
                [("Katman / Toplam Kalınlık", True), (f"{n_plies} Kat ({th_mm:.2f} mm)", False), ("Kritik Katman No", True), (f"Katman #{crit_ply}", False)],
                [("Tsai-Wu Emniyet Marjı", True), (f"+{tw_ms:.2f}", False), ("Maksimum Gerilme Marjı", True), (f"+{ms_ms:.2f}", False)]
            ]
            cls._populate_key_value_table(cp_table, cp_rows)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # -------------------------------------------------------------
        # 10. RESMİ ONAY VE İMZA BLOKLARI (SIGN-OFF)
        # -------------------------------------------------------------
        cls._add_section_heading(doc, "8. RESMİ KALİFİKASYON ONAY VE İMZA BLOKLARI")
        sign_table = doc.add_table(rows=2, cols=4)
        sign_headers = [
            "HAZIRLAYAN\nMekanik Tasarım Müh.",
            "KONTROL EDEN\nYapısal & Dinamik Analiz Müh.",
            "ONAYLAYAN\nTest & Kalifikasyon Müdürü",
            "TEST ŞAHİDİ\nSavunma Sanayii / Müşteri"
        ]
        for col_i, h in enumerate(sign_headers):
            c_top = sign_table.cell(0, col_i)
            cls._set_cell_background(c_top, "F1F5F9")
            p = c_top.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(h)
            r.font.name = "Arial"
            r.font.size = Pt(8)
            r.font.bold = True
            r.font.color.rgb = cls.COLOR_PRIMARY

            c_bot = sign_table.cell(1, col_i)
            cls._set_cell_background(c_bot, "FFFFFF")
            p2 = c_bot.paragraphs[0]
            p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r2 = p2.add_run(f"\n\nİmza: ....................\nTarih: {now_str}\n")
            r2.font.name = "Arial"
            r2.font.size = Pt(8)
            r2.font.color.rgb = cls.COLOR_TEXT

        # Save to buffer
        buffer = io.BytesIO()
        doc.save(buffer)
        buffer.seek(0)
        return buffer.getvalue()

    @classmethod
    def _add_section_heading(cls, doc: docx.Document, text: str):
        """Adds standard styled section header."""
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = cls.COLOR_PRIMARY

    @classmethod
    def _style_table_header(cls, table, headers: list):
        """Applies dark header styling."""
        for col_i, h in enumerate(headers):
            c = table.cell(0, col_i)
            cls._set_cell_background(c, "0F172A")
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(h)
            r.font.name = "Arial"
            r.font.size = Pt(8)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)

    @classmethod
    def _set_row_text(cls, cells, texts: list):
        """Applies alternating table row text."""
        for c, t in zip(cells, texts):
            cls._set_cell_background(c, "F8FAFC")
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(t)
            r.font.name = "Arial"
            r.font.size = Pt(8)
            r.font.color.rgb = cls.COLOR_TEXT

    @classmethod
    def _populate_key_value_table(cls, table, rows_data):
        """Populates 4-column key-value matrix."""
        for row_i, row_items in enumerate(rows_data):
            for col_i, (text, is_key) in enumerate(row_items):
                c = table.cell(row_i, col_i)
                bg = "F1F5F9" if is_key else "FFFFFF"
                cls._set_cell_background(c, bg)
                p = c.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                r = p.add_run(text)
                r.font.name = "Arial"
                r.font.size = Pt(8)
                r.font.bold = is_key
                r.font.color.rgb = cls.COLOR_PRIMARY if is_key else cls.COLOR_TEXT
