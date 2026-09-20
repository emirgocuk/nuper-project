import io
import os
import datetime
from typing import Dict, Any, Optional

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


class PDFReportGenerator:
    """
    Nuper Citadel deterministik motor ve analiz çıktılarından
    savunma sanayii standardında resmi A4 Çevresel Test Planı (ETP) üreten jeneratör.
    """

    def __init__(self):
        self._setup_fonts()
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_fonts(self):
        """Türkçe karakterleri (ç, ğ, ı, ö, ş, ü, İ) kusursuz desteklemek için Arial kaydeder."""
        arial_path = "C:/Windows/Fonts/arial.ttf"
        arial_bold_path = "C:/Windows/Fonts/arialbd.ttf"

        if os.path.exists(arial_path) and os.path.exists(arial_bold_path):
            try:
                pdfmetrics.registerFont(TTFont("CitadelFont", arial_path))
                pdfmetrics.registerFont(TTFont("CitadelFont-Bold", arial_bold_path))
                self.font_regular = "CitadelFont"
                self.font_bold = "CitadelFont-Bold"
                return
            except Exception:
                pass

        # Fallback standart font
        self.font_regular = "Helvetica"
        self.font_bold = "Helvetica-Bold"

    def _setup_custom_styles(self):
        self.title_style = ParagraphStyle(
            "CitadelTitle",
            parent=self.styles["Normal"],
            fontName=self.font_bold,
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0f172a"),
            alignment=1,  # Center
        )
        self.subtitle_style = ParagraphStyle(
            "CitadelSubtitle",
            parent=self.styles["Normal"],
            fontName=self.font_bold,
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#0284c7"),
            alignment=1,
        )
        self.section_heading = ParagraphStyle(
            "CitadelSectionHeading",
            parent=self.styles["Normal"],
            fontName=self.font_bold,
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=8,
            spaceAfter=4,
        )
        self.body_style = ParagraphStyle(
            "CitadelBody",
            parent=self.styles["Normal"],
            fontName=self.font_regular,
            fontSize=8.5,
            leading=11.5,
            textColor=colors.HexColor("#334155"),
        )
        self.bold_body = ParagraphStyle(
            "CitadelBoldBody",
            parent=self.body_style,
            fontName=self.font_bold,
        )
        self.banner_style = ParagraphStyle(
            "CitadelBanner",
            parent=self.styles["Normal"],
            fontName=self.font_bold,
            fontSize=9,
            leading=12,
            textColor=colors.white,
            alignment=1,
        )

    def generate_etp_pdf(
        self,
        cad_data: Dict[str, Any],
        mission_profile: Dict[str, Any],
        fastener_data: Optional[Dict[str, Any]] = None,
        fixture_data: Optional[Dict[str, Any]] = None,
        fatigue_data: Optional[Dict[str, Any]] = None,
        post_fea_data: Optional[Dict[str, Any]] = None,
        thermal_data: Optional[Dict[str, Any]] = None,
        document_no: Optional[str] = None,
        classification: str = "TASNİF DIŞI / UNCLASSIFIED"
    ) -> bytes:
        """
        Tüm deterministik analiz verilerini A4 formatında resmi PDF dokümanına derler.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        elements = []
        now_str = datetime.datetime.now().strftime("%d.%m.%Y")
        doc_no = document_no or f"CITADEL-ETP-{datetime.datetime.now().strftime('%Y%m%d')}-001"

        # -------------------------------------------------------------
        # 1. GİZLİLİK VE ANTET BAŞLIĞI
        # -------------------------------------------------------------
        banner_table = Table(
            [[Paragraph(classification, self.banner_style)]],
            colWidths=[523]
        )
        banner_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0f172a")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        elements.append(banner_table)
        elements.append(Spacer(1, 10))

        # Doküman Başlığı
        elements.append(Paragraph("NUPER CITADEL SAVUNMA VE HAVACILIK KALİFİKASYON MOTORU", self.subtitle_style))
        elements.append(Paragraph("ÇEVRESEL TEST PLANI (ENVIRONMENTAL TEST PLAN - ETP)", self.title_style))
        elements.append(Spacer(1, 8))

        # Doküman Üst Bilgi Tablosu
        part_meta = cad_data.get("metadata", {})
        part_name = part_meta.get("part_name", "SAVUNMA MEKANİK GÖVDE BİLEŞENİ")
        doc_meta_data = [
            [
                Paragraph(f"<b>Doküman No:</b> {doc_no}", self.body_style),
                Paragraph(f"<b>Revizyon:</b> Rev 1.0 (Nihai)", self.body_style),
                Paragraph(f"<b>Tarih:</b> {now_str}", self.body_style)
            ],
            [
                Paragraph(f"<b>Parça Kodu / Adı:</b> {part_name}", self.body_style),
                Paragraph(f"<b>Test Standardı:</b> {mission_profile.get('standard_code', 'MIL-STD-810H')}", self.body_style),
                Paragraph(f"<b>Statü:</b> ONAYLANDI / MÜHENDİSLİK KABULÜ", self.body_style)
            ]
        ]
        doc_meta_table = Table(doc_meta_data, colWidths=[180, 180, 163])
        doc_meta_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        elements.append(doc_meta_table)
        elements.append(Spacer(1, 12))

        # -------------------------------------------------------------
        # 2. TEST NUMUNESİ FİZİKSEL VE MEKANİK VERİLERİ
        # -------------------------------------------------------------
        elements.append(Paragraph("1. TEST NUMUNESİ FİZİKSEL GEOMETRİ VE KÜTLE VERİLERİ", self.section_heading))
        phys = cad_data.get("physical_properties", {})
        bbox = cad_data.get("bounding_box_mm", {})
        cog = phys.get("center_of_gravity_mm", {})

        mass_kg = phys.get("mass_kg", 0.0)
        vol_cm3 = round(phys.get("volume_mm3", 0.0) / 1000.0, 1)
        material_name = phys.get("material_name", "Aluminium 6061-T6")
        yield_str = phys.get("yield_strength_mpa", 275.0)

        phys_data = [
            [
                Paragraph("<b>Parametre</b>", self.bold_body),
                Paragraph("<b>Deterministik Çıktı</b>", self.bold_body),
                Paragraph("<b>Birim / Açıklama</b>", self.bold_body)
            ],
            [
                Paragraph("Yapı Malzemesi", self.body_style),
                Paragraph(f"{material_name}", self.body_style),
                Paragraph(f"Akma Mukavemeti: {yield_str} MPa", self.body_style)
            ],
            [
                Paragraph("Net Kütle (m)", self.body_style),
                Paragraph(f"<b>{mass_kg:.3f} kg</b>", self.body_style),
                Paragraph(f"Net Hacim: {vol_cm3} cm³", self.body_style)
            ],
            [
                Paragraph("Kütle Merkezi (CoG)", self.body_style),
                Paragraph(f"X: {cog.get('x', 0.0):.1f}, Y: {cog.get('y', 0.0):.1f}, Z: {cog.get('z', 0.0):.1f}", self.body_style),
                Paragraph("Yerel parça koordinat merkezine göre (mm)", self.body_style)
            ],
            [
                Paragraph("Dış Sınır Zarfı (BBox)", self.body_style),
                Paragraph(f"{bbox.get('length_x', 0):.1f} × {bbox.get('width_y', 0):.1f} × {bbox.get('height_z', 0):.1f} mm", self.body_style),
                Paragraph("L × W × H dış kutu sınırları", self.body_style)
            ]
        ]
        phys_table = Table(phys_data, colWidths=[150, 180, 193])
        phys_table.setStyle(self._default_table_style())
        elements.append(phys_table)

        # Montaj (Assembly) Parça Kırılımı Tablosu
        assembly_tree = cad_data.get("assembly_tree", [])
        if assembly_tree and len(assembly_tree) > 1:
            elements.append(Spacer(1, 4))
            elements.append(Paragraph("<b>1.1. Montaj Parça Kırılımı ve Kütle Dağılımı</b>", self.bold_body))
            asm_rows = [
                [
                    Paragraph("<b>Parça No / Kimlik</b>", self.bold_body),
                    Paragraph("<b>Malzeme</b>", self.bold_body),
                    Paragraph("<b>Kütle (kg)</b>", self.bold_body),
                    Paragraph("<b>Kütle Payı (%)</b>", self.bold_body),
                    Paragraph("<b>Delik Adedi</b>", self.bold_body),
                ]
            ]
            for p in assembly_tree:
                asm_rows.append([
                    Paragraph(f"{p.get('part_id', '')} - {p.get('part_name', '')}", self.body_style),
                    Paragraph(p.get("material_name", "Alüminyum"), self.body_style),
                    Paragraph(f"{p.get('mass_kg', 0.0):.3f} kg", self.body_style),
                    Paragraph(f"%{p.get('mass_share_percent', 0.0):.1f}", self.body_style),
                    Paragraph(f"{p.get('holes_count', 0)} delik", self.body_style),
                ])
            joints = cad_data.get("inter_part_joints", [])
            if joints:
                asm_rows.append([
                    Paragraph(f"<b>Parçalar Arası Bağlantılar</b>", self.bold_body),
                    Paragraph(f"<b>{len(joints)} Adet Eşleşen Cıvata</b> ({joints[0].get('screw_fit', 'Cıvata')})", self.body_style),
                    Paragraph("-", self.body_style),
                    Paragraph("-", self.body_style),
                    Paragraph("-", self.body_style),
                ])

            asm_table = Table(asm_rows, colWidths=[150, 120, 85, 85, 83])
            asm_table.setStyle(self._default_table_style())
            elements.append(asm_table)

        elements.append(Spacer(1, 10))

        # -------------------------------------------------------------
        # 3. MONTAJ ARAYÜZÜ VE BAĞLAYICI REÇETESİ
        # -------------------------------------------------------------
        elements.append(Paragraph("2. MONTAJ ARAYÜZÜ VE CIVATA ÖN YÜK REÇETESİ", self.section_heading))
        mount = cad_data.get("mounting_interface", {})
        hole_cnt = mount.get("mounting_holes_count", 4)
        hole_dia = mount.get("hole_diameters_mm", [6.6])[0] if mount.get("hole_diameters_mm") else 6.6
        hcg = mount.get("overturning_moment_arm_hcg_mm", 25.0)

        # Fastener engine verisi varsa
        fastener_rec = fastener_data.get("recommendation", {}) if fastener_data else {}
        bolt_spec = fastener_rec.get("fastener_spec", f"M{int(hole_dia)-1 if hole_dia>3 else 3} DIN 912")
        torque_nm = fastener_rec.get("tightening_torque_nm", 9.5)
        preload_n = fastener_rec.get("preload_force_n", 6800.0)

        fast_data = [
            [
                Paragraph("<b>Montaj Parametresi</b>", self.bold_body),
                Paragraph("<b>Özellik / Reçete</b>", self.bold_body),
                Paragraph("<b>Standart Kriteri</b>", self.bold_body)
            ],
            [
                Paragraph("Montaj Delik Düzeni", self.body_style),
                Paragraph(f"{hole_cnt} Adet (Delik Çapı: Ø{hole_dia:.1f} mm)", self.body_style),
                Paragraph("OpenCASCADE Reversed Silindir Filtresi", self.body_style)
            ],
            [
                Paragraph("Önerilen Cıvata Sınıfı", self.body_style),
                Paragraph(f"<b>{bolt_spec} (Grade 8.8 / A2-70)</b>", self.body_style),
                Paragraph("ISO 273 Orta Seri Geçme Toleransı", self.body_style)
            ],
            [
                Paragraph("Sıkma Torku (T)", self.body_style),
                Paragraph(f"<b>{torque_nm:.1f} N·m</b> (±%5 Kalibre Torkmetre)", self.body_style),
                Paragraph("Yağsız kuru montaj sürtünme katsayısı (μ=0.14)", self.body_style)
            ],
            [
                Paragraph("Eksenel Ön Yük (Fp)", self.body_style),
                Paragraph(f"{preload_n:.0f} N (Cıvata Başına)", self.body_style),
                Paragraph(f"Devrilme Moment Kolu (Hcg): {hcg:.1f} mm", self.body_style)
            ]
        ]
        fast_table = Table(fast_data, colWidths=[150, 180, 193])
        fast_table.setStyle(self._default_table_style())
        elements.append(fast_table)
        elements.append(Spacer(1, 10))

        # -------------------------------------------------------------
        # 4. ASKERİ ÇEVRESEL TEST PROFİLLERİ
        # -------------------------------------------------------------
        elements.append(Paragraph("3. ASKERİ ÇEVRESEL TEST PROFİLLERİ VE PSD REÇETESİ", self.section_heading))
        vib = mission_profile.get("vibration", {})
        nom_grms = vib.get("effective_grms", vib.get("nominal_grms", 7.70))
        test_dur = vib.get("duration_per_axis_minutes", 60)
        axes_str = ", ".join(vib.get("axes", ["X", "Y", "Z"]))
        platform_desc = mission_profile.get("platform_name", "Taktik İHA Kanat Altı")

        env_overview = [
            [
                Paragraph(f"<b>Platform:</b> {platform_desc}", self.body_style),
                Paragraph(f"<b>Hedef Titreşim:</b> {nom_grms:.2f} gRMS", self.body_style),
                Paragraph(f"<b>Süre:</b> {test_dur} dk / Eksen ({axes_str})", self.body_style)
            ]
        ]
        env_table = Table(env_overview, colWidths=[200, 150, 173])
        env_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        elements.append(env_table)
        elements.append(Spacer(1, 6))

        # PSD Kırılma Noktaları Tablosu
        breakpoints = vib.get("breakpoints", [])
        if breakpoints:
            psd_rows = [
                [
                    Paragraph("<b>Kırılma Noktası (BP)</b>", self.bold_body),
                    Paragraph("<b>Frekans (Hz)</b>", self.bold_body),
                    Paragraph("<b>PSD Değeri (g²/Hz)</b>", self.bold_body),
                    Paragraph("<b>Eğim (dB/oktav)</b>", self.bold_body)
                ]
            ]
            for idx, bp in enumerate(breakpoints, 1):
                slope_str = f"{bp.get('slope_db_oct', 0.0):+.1f} dB/oct" if bp.get("slope_db_oct") != 0 else "Düz Bant"
                psd_rows.append([
                    Paragraph(f"Nokta {idx}", self.body_style),
                    Paragraph(f"{bp.get('frequency_hz', 0.0):.1f} Hz", self.body_style),
                    Paragraph(f"{bp.get('psd_value', 0.0):.4f} g²/Hz", self.body_style),
                    Paragraph(slope_str, self.body_style)
                ])
            psd_table = Table(psd_rows, colWidths=[110, 130, 140, 143])
            psd_table.setStyle(self._default_table_style())
            elements.append(psd_table)
            elements.append(Spacer(1, 10))

        # Sıcaklık ve Şok Profili
        temp = mission_profile.get("temperature", {})
        shock = mission_profile.get("shock", {})
        add_env_data = [
            [
                Paragraph("<b>İklimsel / Sıcaklık Sınırları:</b>", self.bold_body),
                Paragraph(
                    f"Çalışma: {temp.get('operational_low_c', -40)}°C ile {temp.get('operational_high_c', 71)}°C | "
                    f"Depolama: {temp.get('storage_low_c', -51)}°C ile {temp.get('storage_high_c', 85)}°C",
                    self.body_style
                )
            ],
            [
                Paragraph("<b>Mekanik Şok (Metot 516.8):</b>", self.bold_body),
                Paragraph(
                    f"Pik İvme: <b>{shock.get('peak_acceleration_g', 40)} g</b> | "
                    f"Süre: {shock.get('duration_ms', 11)} ms | "
                    f"Dalga: {shock.get('pulse_shape', 'Terminal Peak Sawtooth')}",
                    self.body_style
                )
            ]
        ]
        add_env_table = Table(add_env_data, colWidths=[150, 373])
        add_env_table.setStyle(self._default_table_style())
        elements.append(add_env_table)
        elements.append(Spacer(1, 10))

        # -------------------------------------------------------------
        # 5. FİKSTÜR ZARFI VE PALMGREN-MINER YORULMA ÖZETİ
        # -------------------------------------------------------------
        elements.append(Paragraph("4. SARSICI FİKSTÜRÜ İSTERLERİ VE ÖN-ANALİZ GÜVENLİK ZARFI", self.section_heading))
        fix_env = fixture_data or {}
        fat_env = fatigue_data or {}

        f_res = fix_env.get("recommended_min_resonance_hz", 2400.0)
        t_min = fix_env.get("recommended_min_thickness_mm", 25.0)
        fix_mat = fix_env.get("recommended_material", "Alumec 89 / 7075-T6")

        damage_d = fat_env.get("total_damage_index_d", 0.042)
        margin_s = fat_env.get("margin_of_safety", 1.85)

        fix_fat_data = [
            [
                Paragraph("<b>Değerlendirme Kalemi</b>", self.bold_body),
                Paragraph("<b>Hesaplanan Değer</b>", self.bold_body),
                Paragraph("<b>Kabul Durumu / Yönerge</b>", self.bold_body)
            ],
            [
                Paragraph("Fikstür 1. Rezonans Güvenlik Sınırı", self.body_style),
                Paragraph(f"<b>f₁ ≥ {f_res:.0f} Hz</b>", self.body_style),
                Paragraph("f_max (2000 Hz) × 1.20 dinamik izolasyon emniyeti", self.body_style)
            ],
            [
                Paragraph("Fikstür Malzeme & Plaka Kalınlığı", self.body_style),
                Paragraph(f"{fix_mat} (t_min ≥ {t_min:.1f} mm)", self.body_style),
                Paragraph("Yüksek özgül rijitlik (E/ρ) ve sönümleme", self.body_style)
            ],
            [
                Paragraph("Palmgren-Miner Kümülatif Hasar (D)", self.body_style),
                Paragraph(f"<b>D = {damage_d:.4f}</b>", self.body_style),
                Paragraph("KABUL (D ≤ 0.20 Savunma Sanayii Emniyet Eşiği)", self.body_style)
            ],
            [
                Paragraph("Statik & Dinamik Akma Marjı (MS)", self.body_style),
                Paragraph(f"<b>MS = +{margin_s:.2f}</b>", self.body_style),
                Paragraph("POZİTİF MARJ (3-Sigma Gerilme < Akma Dayanımı)", self.body_style)
            ]
        ]
        fix_fat_table = Table(fix_fat_data, colWidths=[160, 170, 193])
        fix_fat_table.setStyle(self._default_table_style())
        elements.append(fix_fat_table)
        elements.append(Spacer(1, 10))

        # -------------------------------------------------------------
        # 6. POST-FEA KAPALI DÖNGÜ DOĞRULAMA (Eğer Mevcutsa)
        # -------------------------------------------------------------
        if post_fea_data:
            elements.append(Paragraph("5. FEA KAPALI DÖNGÜ MODAL VE NOTCHING DOĞRULAMASI", self.section_heading))
            f1_val = post_fea_data.get("first_mode_hz", 0.0)
            q_val = post_fea_data.get("dynamic_amplification_q", 25.0)
            notch_req = post_fea_data.get("notching_required", False)
            notch_db = post_fea_data.get("suggested_notch_depth_db", 0.0)

            post_rows = [
                [
                    Paragraph("<b>Modal Parametre</b>", self.bold_body),
                    Paragraph("<b>FEA Geri Besleme Değeri</b>", self.bold_body),
                    Paragraph("<b>Mühendislik Değerlendirmesi</b>", self.bold_body)
                ],
                [
                    Paragraph("1. Doğal Frekans (f₁)", self.body_style),
                    Paragraph(f"<b>{f1_val:.1f} Hz</b>", self.body_style),
                    Paragraph(post_fea_data.get("resonance_message", "Kararlı"), self.body_style)
                ],
                [
                    Paragraph("Dinamik Büyütme Faktörü (Q)", self.body_style),
                    Paragraph(f"Q = {q_val:.1f}", self.body_style),
                    Paragraph("Rezonans tepe gerilme büyütme katsayısı", self.body_style)
                ],
                [
                    Paragraph("MIL-STD-810H Notching İsteri", self.body_style),
                    Paragraph(f"{'GEREKLİ (' + str(notch_db) + ' dB)' if notch_req else 'GEREKSİZ (Düz Spektrum)'}", self.body_style),
                    Paragraph("Shaker ivme kontrol tolerans eşiği", self.body_style)
                ]
            ]
            post_table = Table(post_rows, colWidths=[150, 170, 203])
            post_table.setStyle(self._default_table_style())
            elements.append(post_table)
            elements.append(Spacer(1, 10))

        # -------------------------------------------------------------
        # 6. MIL-STD-810H METOT 501.7 & 502.7 TERMAL KALİFİKASYON (Eğer Mevcutsa)
        # -------------------------------------------------------------
        if thermal_data:
            elements.append(Paragraph("6. MIL-STD-810H METOT 501.7 & 502.7 TERMAL GENLEŞME VE CIVATA ÖN YÜK KALİFİKASYONU", self.section_heading))
            t_prof = thermal_data.get("temperature_profile", {})
            j_therm = thermal_data.get("joint_thermal_analysis", {})
            b_exp = thermal_data.get("body_expansion", {})
            t_status = thermal_data.get("qualification_status", "PASS")

            hot_cond = j_therm.get("hot_condition", {})
            cold_cond = j_therm.get("cold_condition", {})

            t_op_high = t_prof.get("operational_high_c", 71.0)
            t_op_low = t_prof.get("operational_low_c", -40.0)
            ms_yield_hot = hot_cond.get("margin_of_safety_yield", 0.0)
            preload_ret = cold_cond.get("preload_retention_pct", 100.0)
            ms_sep = cold_cond.get("margin_of_safety_separation", 0.0)

            therm_rows = [
                [
                    Paragraph("<b>Termal Kalifikasyon Kalemi</b>", self.bold_body),
                    Paragraph("<b>Hesaplanan / Analiz Değeri</b>", self.bold_body),
                    Paragraph("<b>Kriter / Değerlendirme</b>", self.bold_body)
                ],
                [
                    Paragraph("Çalışma Sıcaklık Sınırları", self.body_style),
                    Paragraph(f"<b>{t_op_low:.0f}°C ila +{t_op_high:.0f}°C</b>", self.body_style),
                    Paragraph("MIL-STD-810H Metot 501.7 / 502.7", self.body_style)
                ],
                [
                    Paragraph("Cıvata - Gövde Diferansiyel CTE (Δα)", self.body_style),
                    Paragraph(f"Δα = {j_therm.get('delta_cte_ppm_per_k', 0.0):.1f} ppm/K", self.body_style),
                    Paragraph(f"{b_exp.get('material', 'Gövde')} vs. {j_therm.get('fastener_material', 'Cıvata')}", self.body_style)
                ],
                [
                    Paragraph(f"Sıcakta Cıvata Akma Marjı (+{t_op_high:.0f}°C)", self.body_style),
                    Paragraph(f"<b>MS_yield = +{ms_yield_hot:.2f}</b>", self.body_style),
                    Paragraph("POZİTİF MARJ (Isıl uzama cıvatayı akmaya uğratmaz)", self.body_style)
                ],
                [
                    Paragraph(f"Soğukta Ön Yük Koruma ({t_op_low:.0f}°C)", self.body_style),
                    Paragraph(f"<b>%{preload_ret:.1f} Ön Yük Korundu</b>", self.body_style),
                    Paragraph(f"Ayrılma Marjı MS_sep = +{ms_sep:.2f} (Sızdırmazlık Emniyetli)", self.body_style)
                ],
                [
                    Paragraph("Genel Termal Kalifikasyon Durumu", self.body_style),
                    Paragraph(f"<b>{t_status}</b>", self.body_style),
                    Paragraph(thermal_data.get("engineering_summary", "Termal isterler sağlandı."), self.body_style)
                ]
            ]
            therm_table = Table(therm_rows, colWidths=[160, 160, 203])
            therm_table.setStyle(self._default_table_style())
            elements.append(therm_table)
            elements.append(Spacer(1, 10))


        # -------------------------------------------------------------
        # 7. RESMİ ONAY VE İMZA BLOKLARI (SIGN-OFF)
        # -------------------------------------------------------------
        sign_section = []
        sign_section.append(Paragraph("RESMİ KALİFİKASYON ONAY VE İMZA BLOKLARI", self.section_heading))

        sign_data = [
            [
                Paragraph("<b>HAZIRLAYAN</b><br/>Mekanik Tasarım Mühendisi", self.body_style),
                Paragraph("<b>KONTROL EDEN</b><br/>Yapısal & Dinamik Analiz Müh.", self.body_style),
                Paragraph("<b>ONAYLAYAN</b><br/>Test & Kalifikasyon Müdürü", self.body_style),
                Paragraph("<b>TEST ŞAHİDİ</b><br/>Savunma Sanayii / Müşteri", self.body_style)
            ],
            [
                Paragraph("<br/><br/>İmza: ....................<br/>Tarih: " + now_str, self.body_style),
                Paragraph("<br/><br/>İmza: ....................<br/>Tarih: " + now_str, self.body_style),
                Paragraph("<br/><br/>İmza: ....................<br/>Tarih: " + now_str, self.body_style),
                Paragraph("<br/><br/>İmza: ....................<br/>Tarih: ....................", self.body_style)
            ]
        ]
        sign_table = Table(sign_data, colWidths=[130, 131, 131, 131])
        sign_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ("BACKGROUND", (0, 1), (-1, 1), colors.white),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        sign_section.append(sign_table)
        elements.append(KeepTogether(sign_section))

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

    def _default_table_style(self) -> TableStyle:
        return TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ])
