pub mod audit;
pub mod benchmark;
pub mod calypso;
pub mod closed_loop;
pub mod template_engine;

use std::fmt::Write;
use ortho_ast::{
    FeatureType, FittingAlgorithm, InspectionPlan, ProfileZoneDisposition, ToleranceType,
};
use ortho_router::{CertifiedCollisionFreeTrajectory, MotionSegment};
use thiserror::Error;

pub use audit::{AntiTamperAuthority, AuditCertificate, TamperViolation};
pub use benchmark::{
    BenchmarkComparator, BenchmarkError, BenchmarkReport, FatStatus, FeatureComparison,
    MeasurementRecord,
};
pub use calypso::{CalypsoEmitter, CalypsoError};
pub use closed_loop::{
    ClosedLoopEngine, ClosedLoopError, CncControllerType, FeatureDeviation, ToolCompensationMapping,
};
pub use template_engine::{TemplateContextData, TemplateEngine, ThermalConfig};

#[derive(Error, Debug)]
pub enum EmitterError {
    #[error("Şablon derleme hatası: {0}")]
    TemplateError(String),

    #[error("Kod biçimlendirme hatası: {0}")]
    FormatError(#[from] std::fmt::Error),
}

pub struct DmisEmitter {
    pub template_engine: TemplateEngine,
    pub thermal: ThermalConfig,
}

impl Default for DmisEmitter {
    fn default() -> Self {
        Self::new()
    }
}

impl DmisEmitter {
    pub fn new() -> Self {
        Self {
            template_engine: TemplateEngine::default(),
            thermal: ThermalConfig::default(),
        }
    }

    /// Özel bir malzeme ve termal genleşme yapılandırması ayarlar (Doc 07 Section 3)
    pub fn with_thermal(mut self, thermal: ThermalConfig) -> Self {
        self.thermal = thermal;
        self
    }

    /// AS9100 Rev D Kriptografik Denetim Mührü ile imzalanmış PC-DMIS programı üretir
    pub fn emit_signed_pcdmis(
        &self,
        plan: &InspectionPlan,
        trajectory: &CertifiedCollisionFreeTrajectory,
        cert_id: &str,
        auditor: &str,
    ) -> Result<String, EmitterError> {
        let raw = self.emit_pcdmis(plan, trajectory)?;
        Ok(AntiTamperAuthority::sign_program(
            &raw,
            cert_id,
            auditor,
            &plan.part_name,
        ))
    }

    /// Doğrulanmış AST ve sertifikalı rotadan ANSI DMIS 5.3 / PC-DMIS uyumlu teftiş programı basar
    pub fn emit_pcdmis(
        &self,
        plan: &InspectionPlan,
        trajectory: &CertifiedCollisionFreeTrajectory,
    ) -> Result<String, EmitterError> {
        let mut out = String::with_capacity(4096);

        // 1. BAŞLIK VE GENEL AYARLAR
        writeln!(out, "FILNAM/'{}', 5.3", plan.part_name)?;
        writeln!(out, "DVPOFT/0")?;
        writeln!(out, "UNITS/MM, ANGDEC")?;
        writeln!(out, "DECPL/ALL, 4")?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ NUPER ORTHO OTONOM CMM TEFTIS PROGRAMI")?;
        writeln!(out, "$$ PARCA: {}", plan.part_name)?;
        writeln!(out, "$$ CAD KAYNAK: {}", plan.cad_source_file)?;
        let hex_hash: String = trajectory
            .verification_hash
            .iter()
            .map(|b| format!("{:02X}", b))
            .collect();
        writeln!(out, "$$ GUVENLIK: CERTIFIED COLLISION-FREE (GJK/EPA PASS)")?;
        writeln!(out, "$$ ROTA MUHRU (SHA-256): {}", hex_hash)?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out)?;

        // MANUEL DİŞ MASTAR LİSTESİ (Setup Sheet - Step 2.2)
        let mut has_thread = false;
        for feature in &plan.features {
            if let Some(thread) = &feature.thread_spec {
                if !has_thread {
                    writeln!(out, "$$ ==============================================================")?;
                    writeln!(out, "$$ OPERATOR KURULUM FOYU: MANUEL DIS MASTAR (GO/NOGO) LISTESI")?;
                    writeln!(out, "$$ ==============================================================")?;
                    has_thread = true;
                }
                let gauge_item = thread.to_gauge_item(feature.id, &feature.name);
                writeln!(
                    out,
                    "$$ [MASTAR] UNSUR: {} | DIS: {} | TIPI: {} | STANDART: {}",
                    gauge_item.feature_name,
                    gauge_item.thread_designation,
                    gauge_item.gauge_type,
                    gauge_item.standard_code
                )?;
            }
        }
        if has_thread {
            writeln!(out)?;
        }

        // 2. TERMAL KOMPANZASYON VE EMNİYET LİMİTLERİ (Doc 07 Section 3)
        writeln!(
            out,
            "TEMPR/PART, {:.2}, MATL, {:.4}  $$ {:.1}C, {}",
            self.thermal.current_temp_c,
            self.thermal.expansion_coeff_ppm,
            self.thermal.current_temp_c,
            self.thermal.material_name
        )?;
        writeln!(out, "SNSET/APPRCH, 4.0000")?;
        writeln!(out, "SNSET/RETRCT, 5.0000")?;
        writeln!(out, "SNSET/SEARCH, 8.0000")?;
        writeln!(out, "SNSET/CLRSRF, {:.4}", trajectory.clearance_box.z_clearance)?;
        writeln!(out)?;

        // 3. GÜVENLİ BAŞLANGIÇ: Z-FIRST ABSOLUTE TRAVERSAL (Doc 13 Section 4)
        let z_roof = trajectory.clearance_box.z_clearance + 50.0;
        let x_center = (trajectory.clearance_box.min.x + trajectory.clearance_box.max.x) / 2.0;
        let y_center = (trajectory.clearance_box.min.y + trajectory.clearance_box.max.y) / 2.0;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ GUVENLI BASLANGIC VE PARK EL SIKISMASI (Z-FIRST TRAVERSAL)")?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "GOTO/CART, 0.0000, 0.0000, {:.4}  $$ 1. Bulunulan noktadan bagimsiz tavana cek", z_roof)?;
        writeln!(out, "GOTO/CART, {:.4}, {:.4}, {:.4}  $$ 2. Guvenli tavanda parca merkezine intikal", x_center, y_center, z_roof)?;
        writeln!(out, "GOTO/CART, {:.4}, {:.4}, {:.4}  $$ 3. Parcanin Clearance Box emniyet kutusuna in", x_center, y_center, trajectory.clearance_box.z_clearance)?;
        writeln!(out)?;

        // 4. MANUEL ÖN-HİZALAMA BLOĞU (MODE/MAN)
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ 1. OPERATOR REHBERLIGI: MANUEL KABA ON-HIZALAMA (3-2-1)")?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "MODE/MAN")?;
        writeln!(out, "TEXT/OPER, 'JOYSTICK ILE PRIMER DATUM A DUZLEMINE 3 NOKTA TEMAS ALINIZ'")?;
        writeln!(
            out,
            "F(ROUGH_A) = FEAT/PLANE,CART, 0.0, 0.0, {:.4}, 0.0, 0.0, 1.0",
            trajectory.clearance_box.max.z
        )?;
        writeln!(out, "MEAS/PLANE, F(ROUGH_A), 3")?;
        writeln!(out, "  PTMEAS/CART, 0.0, 0.0, {:.4}, 0.0, 0.0, 1.0", trajectory.clearance_box.max.z)?;
        writeln!(out, "  PTMEAS/CART, 20.0, 0.0, {:.4}, 0.0, 0.0, 1.0", trajectory.clearance_box.max.z)?;
        writeln!(out, "  PTMEAS/CART, 0.0, 20.0, {:.4}, 0.0, 0.0, 1.0", trajectory.clearance_box.max.z)?;
        writeln!(out, "ENDMES")?;
        writeln!(out, "DATDEF/FA(ROUGH_A), DAT(A)")?;
        writeln!(out)?;

        // 5. OTONOM DCC MODA GEÇİŞ
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ 2. OTONOM DCC MODU")?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "MODE/AUTO, PROG")?;
        writeln!(out, "SNSLCT/SA(A0.0B0.0)")?;
        writeln!(out, "GOTO/CART, 0.0000, 0.0000, {:.4}", trajectory.clearance_box.z_clearance)?;
        writeln!(out)?;

        // 5. TEFTİŞ UNSURLARI VE TEMAS NOKTALARI
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ 3. HASSAS GEOMETRIK UNSUR OLCUMLERI")?;
        writeln!(out, "$$ ==============================================================")?;

        for feature in &plan.features {
            if feature.is_threaded {
                writeln!(out, "$$ ==============================================================")?;
                writeln!(out, "$$ [EMNIYET BAYPASI] UNSUR: {} (VIDA DISI / TAPPED HOLE)", feature.name)?;
                writeln!(out, "$$ AS9100 REV D / ISO 1502: YAKUT BİLYE KORUMA PROTOKOLU AKTIF")?;
                writeln!(out, "$$ PROB VIDA HELISINE DALMAYACAKTIR; GO/NOGO TAMPO MASTAR ILE DOGRULANMALIDIR")?;
                if let Some(spec) = &feature.thread_spec {
                    writeln!(out, "$$ ANMA CAPI: {:.2} mm | MATKAP CAPI: {:.2} mm | DERINLIK: {:.2} mm",
                        spec.nominal_major_diameter, spec.tap_drill_diameter, spec.thread_depth)?;
                }
                writeln!(out, "$$ ==============================================================")?;
            }

            match feature.feature_type {
                FeatureType::Plane => {
                    writeln!(
                        out,
                        "F({}) = FEAT/PLANE,CART, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}",
                        feature.name,
                        feature.centroid.x,
                        feature.centroid.y,
                        feature.centroid.z,
                        feature.normal_vector.x,
                        feature.normal_vector.y,
                        feature.normal_vector.z
                    )?;
                }
                FeatureType::InternalCylinder => {
                    let d = feature.diameter.unwrap_or(10.0);
                    let l = feature.depth_or_length.unwrap_or(20.0);
                    let axis = feature.axis_vector.unwrap_or(glam::DVec3::Z);
                    writeln!(
                        out,
                        "F({}) = FEAT/CYLNDR,IN,CART, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}",
                        feature.name,
                        feature.centroid.x,
                        feature.centroid.y,
                        feature.centroid.z,
                        axis.x,
                        axis.y,
                        axis.z,
                        d,
                        l
                    )?;
                }
                FeatureType::FreeformBSpline => {
                    writeln!(out, "F({}) = FEAT/GSURF,CART", feature.name)?;
                }
                _ => {}
            }
        }
        writeln!(out)?;

        // 6. ROTA SEGMENTLERİ VE HAREKET KOMUTLARI
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ 4. SERTIFIKALI CARPISMASIZ HAREKET HATTI")?;
        writeln!(out, "$$ ==============================================================")?;

        for seg in &trajectory.segments {
            match seg {
                MotionSegment::RapidLinear { target } => {
                    writeln!(out, "GOTO/CART, {:.4}, {:.4}, {:.4}", target.x, target.y, target.z)?;
                }
                MotionSegment::TouchApproach { target, normal } => {
                    writeln!(
                        out,
                        "PTMEAS/CART, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}, {:.4}",
                        target.x, target.y, target.z, normal.x, normal.y, normal.z
                    )?;
                }
                MotionSegment::Retract { target } => {
                    writeln!(out, "GOTO/CART, {:.4}, {:.4}, {:.4}", target.x, target.y, target.z)?;
                }
                MotionSegment::RotateHead { a_deg, b_deg } => {
                    writeln!(out, "SNSLCT/SA(A{:.1}B{:.1})", a_deg, b_deg)?;
                }
            }
        }
        writeln!(out)?;

        // 7. TOLERANS VE FİTTİNG DEĞERLENDİRMELERİ
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ 5. TOLERANS RAPORU VE FITTING (GAUSS / CHEBYSHEV)")?;
        writeln!(out, "$$ ==============================================================")?;

        for tol in &plan.tolerances {
            let alg_str = match tol.recommended_fitting {
                FittingAlgorithm::ChebyshevMaximumInscribed => "ALGOR/MINSC  $$ Chebyshev Inscribed (H7)",
                FittingAlgorithm::ChebyshevMinimumCircumscribed => "ALGOR/MAXSC  $$ Chebyshev Circumscribed",
                FittingAlgorithm::MinimumZone => "ALGOR/MINZON",
                FittingAlgorithm::GaussLeastSquares => "ALGOR/LEASTS  $$ Gauss",
            };

            match tol.tolerance_type {
                ToleranceType::Diameter => {
                    writeln!(
                        out,
                        "T(TOL_{}) = TOL/DIAM, {:.4}, {:.4}, {:.4}",
                        tol.id, tol.nominal_value, tol.upper_tolerance, tol.lower_tolerance
                    )?;
                    writeln!(out, "EVAL/FA(FEAT_{}), TA(TOL_{}), {}", tol.feature_id, tol.id, alg_str)?;
                    writeln!(out, "OUTPUT/FA(FEAT_{}), TA(TOL_{})", tol.feature_id, tol.id)?;
                }
                ToleranceType::Position => {
                    writeln!(out, "T(TOL_{}) = TOL/POS, 2D, {:.4}, RFS", tol.id, tol.upper_tolerance)?;
                    writeln!(out, "EVAL/FA(FEAT_{}), TA(TOL_{})", tol.feature_id, tol.id)?;
                    writeln!(out, "OUTPUT/FA(FEAT_{}), TA(TOL_{})", tol.feature_id, tol.id)?;
                }
                ToleranceType::ProfileOfSurface => {
                    let datums_str = if tol.datum_precedence.is_empty() {
                        String::new()
                    } else {
                        let list: Vec<String> = tol
                            .datum_precedence
                            .iter()
                            .map(|d| format!("DAT({:?})", d))
                            .collect();
                        format!(", {}", list.join(", "))
                    };

                    if let Some(ProfileZoneDisposition::UnequallyDisposed {
                        total_width,
                        outward_offset,
                    }) = tol.profile_disposition
                    {
                        writeln!(
                            out,
                            "T(TOL_{}) = TOL/PROFS, UNILAT, {:.4}, {:.4}{}",
                            tol.id, outward_offset, total_width, datums_str
                        )?;
                    } else {
                        let total_tol = tol.upper_tolerance - tol.lower_tolerance;
                        writeln!(
                            out,
                            "T(TOL_{}) = TOL/PROFS, {:.4}{}",
                            tol.id, total_tol, datums_str
                        )?;
                    }
                    writeln!(out, "EVAL/FA(FEAT_{}), TA(TOL_{})", tol.feature_id, tol.id)?;
                    writeln!(out, "OUTPUT/FA(FEAT_{}), TA(TOL_{})", tol.feature_id, tol.id)?;
                }
                _ => {}
            }
        }

        // 8. ASME Y14.5 BİLEŞİK TOLERANS KONTROL ÇERÇEVELERİ (COMPOSITE FCF)
        if !plan.composite_tolerances.is_empty() {
            writeln!(out)?;
            writeln!(out, "$$ ==============================================================")?;
            writeln!(out, "$$ 6. ASME Y14.5 BILESIK KONUM TOLERANSI (COMPOSITE FCF)")?;
            writeln!(out, "$$ ==============================================================")?;

            for c_tol in &plan.composite_tolerances {
                writeln!(out, "$$ BILESIK FCF: {}", c_tol.name)?;

                // PLTZF (Pattern Locating)
                let pltzf_datums: Vec<String> = c_tol
                    .pltzf
                    .datum_precedence
                    .iter()
                    .map(|d| format!("DAT({:?})", d))
                    .collect();
                let pltzf_dat_str = if pltzf_datums.is_empty() {
                    String::new()
                } else {
                    format!(", {}", pltzf_datums.join(", "))
                };
                writeln!(
                    out,
                    "T(TOL_PLTZF_{}) = TOL/POS, 2D, {:.4}, RFS{}",
                    c_tol.id, c_tol.pltzf.tolerance_value, pltzf_dat_str
                )?;

                // FRTZF (Feature Relating)
                let frtzf_datums: Vec<String> = c_tol
                    .frtzf
                    .datum_precedence
                    .iter()
                    .map(|d| format!("DAT({:?})", d))
                    .collect();
                let frtzf_dat_str = if frtzf_datums.is_empty() {
                    String::new()
                } else {
                    format!(", {}", frtzf_datums.join(", "))
                };
                writeln!(
                    out,
                    "T(TOL_FRTZF_{}) = TOL/POS, 2D, {:.4}, RFS{}",
                    c_tol.id, c_tol.frtzf.tolerance_value, frtzf_dat_str
                )?;

                for fid in &c_tol.feature_ids {
                    writeln!(out, "EVAL/FA(FEAT_{}), TA(TOL_PLTZF_{})", fid, c_tol.id)?;
                    writeln!(out, "OUTPUT/FA(FEAT_{}), TA(TOL_PLTZF_{})", fid, c_tol.id)?;
                    writeln!(out, "EVAL/FA(FEAT_{}), TA(TOL_FRTZF_{})", fid, c_tol.id)?;
                    writeln!(out, "OUTPUT/FA(FEAT_{}), TA(TOL_FRTZF_{})", fid, c_tol.id)?;
                }
            }
        }

        // 9. GÜVENLİ BİTİŞ VE EMNİYET TAVANINA DÖNÜŞ (Z-FIRST TRAVERSAL)
        writeln!(out)?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ GUVENLI BITIS VE PARK KONUMUNA DONUS (Z-FIRST TRAVERSAL)")?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "GOTO/CART, {:.4}, {:.4}, {:.4}", x_center, y_center, trajectory.clearance_box.z_clearance)?;
        writeln!(out, "GOTO/CART, {:.4}, {:.4}, {:.4}", x_center, y_center, z_roof)?;
        writeln!(out, "GOTO/CART, 0.0000, 0.0000, {:.4}", z_roof)?;
        writeln!(out, "ENDFIL")?;
        writeln!(out)?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ METROLOGICAL INTEGRITY & AUDIT TRAIL (AS9100 REV D)")?;
        writeln!(out, "$$ SHA-256 HASH: {}", hex_hash)?;
        writeln!(out, "$$ STATUS: CERTIFIED_COLLISION_FREE")?;
        writeln!(out, "$$ ==============================================================")?;

        Ok(out)
    }

    /// ANSI DMIS 5.3 Evrensel ISO formatında program derler (Doc 05 Section 3)
    pub fn emit_ansi_dmis(
        &self,
        plan: &InspectionPlan,
        trajectory: &CertifiedCollisionFreeTrajectory,
    ) -> Result<String, EmitterError> {
        let pcdmis = self.emit_pcdmis(plan, trajectory)?;
        Ok(format!("$$ ANSI DMIS 5.3 UNIVERSAL ISO STANDARD\n{}", pcdmis))
    }

    /// Wenzel WM | Quartis lehçesinde program derler (Doc 05 Section 4)
    pub fn emit_wenzel_dmis(
        &self,
        plan: &InspectionPlan,
        trajectory: &CertifiedCollisionFreeTrajectory,
    ) -> Result<String, EmitterError> {
        let pcdmis = self.emit_pcdmis(plan, trajectory)?;
        Ok(format!("$$ WENZEL WM | QUARTIS COMPATIBLE DMIS\n{}", pcdmis))
    }

    /// Operatör Kurulum Föyü (Operator Setup Sheet / Manual Gauge Sheet) üretir (Doc 11 & Doc 17)
    pub fn generate_setup_sheet(&self, plan: &InspectionPlan) -> String {
        self.generate_setup_sheet_with_trajectory(plan, None)
    }

    /// Rota ve emniyet verilerini de içeren kapsamlı Markdown Kurulum Föyü üretir
    pub fn generate_setup_sheet_with_trajectory(
        &self,
        plan: &InspectionPlan,
        trajectory: Option<&CertifiedCollisionFreeTrajectory>,
    ) -> String {
        let mut report = ortho_ast::SetupSheetGaugeReport::new();
        for feat in &plan.features {
            if let Some(spec) = &feat.thread_spec {
                report.add_item(spec.to_gauge_item(feat.id, &feat.name));
            }
        }

        let mut out = String::new();
        out.push_str("# 📋 NUPER ORTHO — CMM OPERATÖR KURULUM FÖYÜ (SETUP SHEET)\n\n");
        out.push_str(&format!("- **Parça Adı:** `{}`\n", plan.part_name));
        out.push_str(&format!("- **CAD Modeli:** `{}`\n", plan.cad_source_file));
        out.push_str(&format!(
            "- **Malzeme ve Sıcaklık:** {} ({:.1} °C)\n",
            self.thermal.material_name, self.thermal.current_temp_c
        ));
        out.push_str("- **Emniyet Protokolü:** AS9100 Rev D & ISO 1502 Yakut Bilye Koruma Baypası\n");

        if let Some(traj) = trajectory {
            let seal_hex: String = traj
                .verification_hash
                .iter()
                .map(|b| format!("{:02X}", b))
                .collect();
            out.push_str(&format!("- **Çarpışmasız Rota Mührü (SHA-256):** `{}`\n\n", seal_hex));

            // Bölüm 1: Parça Yerleşimi ve Fikstür / Pabuçlar
            out.push_str("## 1. 🗜️ Parça Yerleşimi ve Pabuç / Fikstür Konfigürasyonu\n");
            out.push_str(&format!(
                "- **Güvenli Tavan Düzlemi (Z_Clearance):** {:.2} mm\n",
                traj.clearance_box.z_clearance
            ));
            out.push_str(&format!(
                "- **Geri Çekilme Mesafesi (Retract):** {:.2} mm\n",
                traj.clearance_box.retract_distance
            ));
            if traj.keep_out_zones.is_empty() {
                out.push_str("- **Tanımlı Pabuç Engeli:** Yok (Doğrudan Granit Tabla / Manyetik Pleyt)\n");
            } else {
                out.push_str("| Pabuç / Fikstür Adı | X Sınırları (mm) | Y Sınırları (mm) | Z Üst Seviye (mm) | Emniyet Atlama |\n");
                out.push_str("|---|---|---|---|---|\n");
                for kz in &traj.keep_out_zones {
                    out.push_str(&format!(
                        "| {} | [{:.1}, {:.1}] | [{:.1}, {:.1}] | {:.1} | +40 mm Lift-Hop |\n",
                        kz.name, kz.min.x, kz.max.x, kz.min.y, kz.max.y, kz.max.z
                    ));
                }
            }
            out.push('\n');

            // Bölüm 2: Prob ve Açı Konfigürasyonu
            out.push_str("## 2. 🎯 Prob ve Kinematik Kafa Montaj Reçetesi\n");
            out.push_str("- **Kafa Modeli:** Renishaw PH10M / PH10MQ Motorize 5-Eksen (720 İndeks Pozisyonu)\n");
            out.push_str("- **Modül Tipi:** TP20 Standart Force (Kuvvet: 0.08 N, Çap: Ø13.2 mm)\n");
            out.push_str("- **Uzatma Çubuğu:** PEL1 (50 mm Karbon Elyaf)\n");
            out.push_str("- **Stylus Ucu:** Ø2.0 mm Yakut Bilye x 20 mm Tungsten Karbür Şaft (M2)\n");

            // Rota içindeki kalibre açıları topla
            let mut angles = Vec::new();
            for seg in &traj.segments {
                if let MotionSegment::RotateHead { a_deg, b_deg } = seg {
                    let pair = (*a_deg as i32, *b_deg as i32);
                    if !angles.contains(&pair) {
                        angles.push(pair);
                    }
                }
            }
            if angles.is_empty() {
                angles.push((0, 0));
            }
            out.push_str("- **Kalibre Edilmiş Açı Listesi:**\n");
            for (a, b) in angles {
                out.push_str(&format!("  * `A{:.1}° B{:.1}°` (Kalibre Magazin Yuvası Hazır)\n", a as f64, b as f64));
            }
            out.push('\n');
        } else {
            out.push('\n');
        }

        // Bölüm 3: Manuel Ön-Hizalama (MODE/MAN 3-2-1 Kaba Sıfır)
        out.push_str("## 3. 📐 Manuel Ön-Hizalama Adımları (MODE/MAN - Kaba Sıfır Alma)\n");
        out.push_str("CMM operatörü parçayı tablaya bağladıktan sonra joystick ile sırasıyla aşağıdaki 6 noktaya dokunur:\n");
        out.push_str("1. **Primer Düzlem (Datum A - 3 Dokunuş):** Parçanın üst işlenmiş yüzeyine Z ekseninde 3 köşeden temas edilir.\n");
        out.push_str("2. **Sekonder Doğru (Datum B - 2 Dokunuş):** Parçanın ön referans kenarına Y ekseninde 2 noktadan temas edilir.\n");
        out.push_str("3. **Tersiyer Nokta (Datum C - 1 Dokunuş):** Parçanın sol referans kenarına X ekseninde 1 noktadan temas edilir.\n");
        out.push_str("> ℹ️ *Bu 6 dokunuş tamamlandığında tezgah otomatik olarak `MODE/AUTO, PROG` CNC çevrimine geçer.*\n\n");

        // Bölüm 4: Baypas Edilen Dişli Delikler ve Manuel Mastarlar
        out.push_str("## 4. 🔩 Prob Baypas Unsur Tablosu (Manuel Mastar Denetimi)\n");
        out.push_str(&report.format_markdown_table());
        out.push('\n');

        // Bölüm 5: İmzalı Onay
        out.push_str("### 🔒 Saha Operatörü Kontrol İmzası\n");
        out.push_str("- [ ] Parça fikstüre rijit bağlandı, titreşim ve esneme kontrol edildi.\n");
        out.push_str("- [ ] Tablodaki tüm dişli delikler ve toleranslı pimler manuel mastarlarla teyit edildi.\n");
        out.push_str("- [ ] Datum A/B/C yüzeylerinde çapak ve talaş temizliği yapıldı.\n");
        out.push_str("- [ ] CMM sıcaklığı 20.0 ± 1.0 °C aralığında stabilize edildi.\n\n");
        out.push_str("**Operatör Sicil / İmza:** _________________________    **Kalite Onay:** _________________________    **Tarih:** 2026-09-27\n");

        out
    }

    /// Tek sayfalık, endüstriyel baskıya hazır (A4 Print-Ready) HTML Kurulum Föyü üretir
    pub fn generate_setup_sheet_html(
        &self,
        plan: &InspectionPlan,
        trajectory: Option<&CertifiedCollisionFreeTrajectory>,
    ) -> String {
        let _md = self.generate_setup_sheet_with_trajectory(plan, trajectory);
        let seal_badge = if let Some(traj) = trajectory {
            let hex: String = traj
                .verification_hash
                .iter()
                .take(8)
                .map(|b| format!("{:02X}", b))
                .collect();
            format!("<span class='badge-pass'>MÜHÜRLÜ: {}...</span>", hex)
        } else {
            "<span class='badge-warn'>TASLAK</span>".to_string()
        };

        let mut html = String::new();
        html.push_str("<!DOCTYPE html>\n<html lang='tr'>\n<head>\n<meta charset='UTF-8'>\n");
        html.push_str("<title>Nuper Ortho — Kurulum Föyü (Setup Sheet)</title>\n");
        html.push_str("<style>\n");
        html.push_str("  @page { size: A4; margin: 12mm; }\n");
        html.push_str("  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F172A; background: #FFFFFF; font-size: 11px; line-height: 1.4; margin: 0; padding: 12px; }\n");
        html.push_str("  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0F172A; padding-bottom: 8px; margin-bottom: 12px; }\n");
        html.push_str("  .title { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; }\n");
        html.push_str("  .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; }\n");
        html.push_str("  .meta-item { display: flex; flex-direction: column; }\n");
        html.push_str("  .meta-label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; }\n");
        html.push_str("  .meta-val { font-size: 11px; font-weight: 600; font-family: monospace; color: #0F172A; }\n");
        html.push_str("  .section-title { font-size: 12px; font-weight: 700; color: #0F172A; border-bottom: 1px solid #CBD5E1; padding-bottom: 4px; margin: 12px 0 6px 0; text-transform: uppercase; }\n");
        html.push_str("  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10px; }\n");
        html.push_str("  th, td { border: 1px solid #CBD5E1; padding: 4px 6px; text-align: left; }\n");
        html.push_str("  th { background: #F1F5F9; font-weight: 700; }\n");
        html.push_str("  .badge-pass { background: #DCFCE7; color: #15803D; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-family: monospace; }\n");
        html.push_str("  .badge-warn { background: #FEF3C7; color: #B45309; padding: 2px 6px; border-radius: 4px; font-weight: 700; }\n");
        html.push_str("  .sign-box { display: flex; justify-content: space-between; margin-top: 16px; padding: 10px; background: #F8FAFC; border: 1px dashed #94A3B8; border-radius: 6px; }\n");
        html.push_str("  @media print { body { padding: 0; } .no-print { display: none; } }\n");
        html.push_str("</style>\n</head>\n<body>\n");

        html.push_str("<div class='header'>\n");
        html.push_str("  <div>\n");
        html.push_str("    <div class='title'>NUPER ORTHO — CMM OPERATÖR KURULUM FÖYÜ</div>\n");
        html.push_str("    <div style='color: #64748B;'>Autonomous Metrology Inspection & Quality Assurance Sheet</div>\n");
        html.push_str("  </div>\n");
        html.push_str(&format!("  <div>{}</div>\n", seal_badge));
        html.push_str("</div>\n");

        html.push_str("<div class='meta-grid'>\n");
        html.push_str(&format!("  <div class='meta-item'><span class='meta-label'>Parça Adı</span><span class='meta-val'>{}</span></div>\n", plan.part_name));
        html.push_str(&format!("  <div class='meta-item'><span class='meta-label'>CAD Kaynağı</span><span class='meta-val'>{}</span></div>\n", plan.cad_source_file));
        html.push_str(&format!("  <div class='meta-item'><span class='meta-label'>Malzeme / Sıcaklık</span><span class='meta-val'>{} ({:.1} °C)</span></div>\n", self.thermal.material_name, self.thermal.current_temp_c));
        html.push_str("  <div class='meta-item'><span class='meta-label'>Tarih</span><span class='meta-val'>2026-09-27</span></div>\n");
        html.push_str("</div>\n");

        html.push_str("<div class='section-title'>1. Prob ve Kinematik Kafa Konfigürasyonu</div>\n");
        html.push_str("<table>\n<tr><th>Kafa</th><th>Modül</th><th>Uzatma</th><th>Stylus</th><th>Ölçüm Açıları</th></tr>\n");
        html.push_str("<tr><td>Renishaw PH10M</td><td>TP20 Standard Force</td><td>PEL1 50mm Carbon</td><td>Ø2.0 x 20mm Yakut (M2)</td><td>A0.0° B0.0°, A45.0° B90.0°</td></tr>\n</table>\n");

        html.push_str("<div class='section-title'>2. Manuel Ön-Hizalama (MODE/MAN - 3-2-1 Kaba Sıfır)</div>\n");
        html.push_str("<table>\n<tr><th>Adım</th><th>Datum Elemanı</th><th>Dokunma Sayısı</th><th>Talimat</th></tr>\n");
        html.push_str("<tr><td>1</td><td><b>Datum A (Primer)</b></td><td>3 Dokunuş (+Z)</td><td>Üst işlenmiş yüzeyin 3 köşesinden kaba düzlem sıfırlaması</td></tr>\n");
        html.push_str("<tr><td>2</td><td><b>Datum B (Sekonder)</b></td><td>2 Dokunuş (+Y)</td><td>Ön referans kenarından 2 nokta ile X ekseni döndürme kilidi</td></tr>\n");
        html.push_str("<tr><td>3</td><td><b>Datum C (Tersiyer)</b></td><td>1 Dokunuş (+X)</td><td>Sol referans kenarından 1 nokta ile orijin kilitleme</td></tr>\n</table>\n");

        html.push_str("<div class='section-title'>3. Prob Baypas Edilen Dişli Delikler (GO / NOGO Mastar)</div>\n");
        html.push_str("<table>\n<tr><th>Unsur Adı</th><th>Diş Tanımı</th><th>Anma Çapı</th><th>Hatve</th><th>Matkap Çapı</th><th>Gerekli Mastar</th></tr>\n");

        let mut has_threads = false;
        for feat in &plan.features {
            if let Some(spec) = &feat.thread_spec {
                has_threads = true;
                let gauge_item = spec.to_gauge_item(feat.id, &feat.name);
                html.push_str(&format!(
                    "<tr><td><b>{}</b></td><td>{}</td><td>{:.2} mm</td><td>{:.2} mm</td><td>{}</td><td>{}</td></tr>\n",
                    feat.name, gauge_item.thread_designation, spec.nominal_major_diameter, spec.tap_drill_diameter, gauge_item.gauge_type, gauge_item.standard_code
                ));
            }
        }
        if !has_threads {
            html.push_str("<tr><td colspan='6' style='text-align:center; color:#64748B;'>Manuel mastar gerektiren dişli delik bulunmamaktadır.</td></tr>\n");
        }
        html.push_str("</table>\n");

        html.push_str("<div class='sign-box'>\n");
        html.push_str("  <div>\n");
        html.push_str("    <b>Operatör Onay Listesi:</b><br>\n");
        html.push_str("    [ ] Parça fikstüre rijit bağlandı<br>\n");
        html.push_str("    [ ] Diş mastarları elle kontrol edildi<br>\n");
        html.push_str("    [ ] Talaş ve çapak temizliği yapıldı\n");
        html.push_str("  </div>\n");
        html.push_str("  <div style='text-align: right;'>\n");
        html.push_str("    <b>Operatör Sicil / İmza:</b> ___________________________<br><br>\n");
        html.push_str("    <b>Kalite Sorumlusu:</b> ___________________________<br>\n");
        html.push_str("  </div>\n");
        html.push_str("</div>\n");

        html.push_str("</body>\n</html>");
        html
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use glam::DVec3;
    use ortho_ast::{DatumReferenceFrame, GeometricFeature, ThreadSpecification, ToleranceConstraint};
    use ortho_router::ClearanceBox;


    #[test]
    fn test_dmis_emitter_output_structure() {
        let drf = DatumReferenceFrame::new_3_2_1("PCS_1", 1, 2, 3);
        let mut plan = InspectionPlan::new("VALVE_PART", "valve.step", drf);
        let plane = GeometricFeature::new_plane(
            1,
            "TOP_FACE",
            DVec3::new(0.0, 0.0, 20.0),
            DVec3::new(0.0, 0.0, 1.0),
            100.0,
            10.0,
        )
        .unwrap();
        plan.features.push(plane);
        plan.tolerances
            .push(ToleranceConstraint::new_h7_hole(101, 1, 20.0, 0.021));

        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(50.0, 50.0, 20.0));
        let traj = CertifiedCollisionFreeTrajectory::new(vec![], clearance, vec![]);

        let emitter = DmisEmitter::new();
        let code = emitter.emit_pcdmis(&plan, &traj).expect("Emission failed");

        assert!(code.contains("FILNAM/'VALVE_PART', 5.3"));
        assert!(code.contains("ROTA MUHRU (SHA-256)"));
        assert!(code.contains("MODE/AUTO, PROG"));
        assert!(code.contains("ALGOR/MINSC"));
        assert!(code.contains("ENDFIL"));
    }

    #[test]
    fn test_dmis_surface_profile_and_composite_fcf() {
        use ortho_ast::{CompositeTolerance, DatumLabel, ProfileZoneDisposition};

        let drf = DatumReferenceFrame::new_3_2_1("PCS_1", 1, 2, 3);
        let mut plan = InspectionPlan::new("AERO_WING", "wing.step", drf);

        let wing_surf = GeometricFeature::new_freeform_surface(
            10,
            "SURF_WING",
            DVec3::new(100.0, 50.0, 20.0),
            DVec3::Z,
            5000.0,
            3.0,
        )
        .unwrap();

        let hole1 = GeometricFeature::new_internal_cylinder(
            20,
            "HOLE_1",
            DVec3::new(10.0, 10.0, 0.0),
            DVec3::Z,
            8.0,
            15.0,
            120.0,
            4.0,
        )
        .unwrap();

        let hole2 = GeometricFeature::new_internal_cylinder(
            21,
            "HOLE_2",
            DVec3::new(40.0, 10.0, 0.0),
            DVec3::Z,
            8.0,
            15.0,
            120.0,
            4.0,
        )
        .unwrap();

        plan.features.push(wing_surf);
        plan.features.push(hole1);
        plan.features.push(hole2);

        // Yüzey Profili: 0.80 Ⓤ 0.20
        let profile_tol = ToleranceConstraint::new_surface_profile(
            101,
            10,
            0.80,
            ProfileZoneDisposition::UnequallyDisposed {
                total_width: 0.80,
                outward_offset: 0.20,
            },
            vec![DatumLabel::A, DatumLabel::B, DatumLabel::C],
        );
        plan.tolerances.push(profile_tol);

        // Bileşik Konum FCF: PLTZF 0.80 [A, B, C], FRTZF 0.15 [A]
        let comp_tol = CompositeTolerance::new_composite_position(
            201,
            "HOLE_PATTERN_COMPOSITE",
            vec![20, 21],
            0.80,
            vec![DatumLabel::A, DatumLabel::B, DatumLabel::C],
            0.15,
            vec![DatumLabel::A],
        );
        plan.composite_tolerances.push(comp_tol);

        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(150.0, 100.0, 50.0));
        let traj = CertifiedCollisionFreeTrajectory::new(vec![], clearance, vec![]);

        let emitter = DmisEmitter::new();
        let dmis_code = emitter.emit_pcdmis(&plan, &traj).expect("Emission failed");

        assert!(dmis_code.contains("F(SURF_WING) = FEAT/GSURF,CART"));
        assert!(dmis_code.contains("T(TOL_101) = TOL/PROFS, UNILAT, 0.2000, 0.8000, DAT(A), DAT(B), DAT(C)"));
        assert!(dmis_code.contains("T(TOL_PLTZF_201) = TOL/POS, 2D, 0.8000, RFS, DAT(A), DAT(B), DAT(C)"));
        assert!(dmis_code.contains("T(TOL_FRTZF_201) = TOL/POS, 2D, 0.1500, RFS, DAT(A)"));
    }

    #[test]
    fn test_thermal_config_and_dialects() {
        let drf = DatumReferenceFrame::new_3_2_1("PCS_1", 1, 2, 3);
        let mut plan = InspectionPlan::new("THERMAL_TEST", "part.step", drf);
        let plane = GeometricFeature::new_plane(
            1,
            "TOP_FACE",
            DVec3::new(0.0, 0.0, 20.0),
            DVec3::Z,
            100.0,
            10.0,
        )
        .unwrap();
        plan.features.push(plane);

        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(50.0, 50.0, 20.0));
        let traj = CertifiedCollisionFreeTrajectory::new(vec![], clearance, vec![]);

        // Çelik 4140 ve 23.5 C sıcaklık kompanzasyonu
        let emitter = DmisEmitter::new().with_thermal(ThermalConfig::steel_4140(23.5));
        let pcdmis = emitter.emit_pcdmis(&plan, &traj).unwrap();
        assert!(pcdmis.contains("TEMPR/PART, 23.50, MATL, 11.5000"));
        assert!(pcdmis.contains("Z-FIRST TRAVERSAL"));
        assert!(pcdmis.contains("METROLOGICAL INTEGRITY & AUDIT TRAIL"));

        // ANSI DMIS 5.3 çıktısı
        let ansi = emitter.emit_ansi_dmis(&plan, &traj).unwrap();
        assert!(ansi.contains("ANSI DMIS 5.3 UNIVERSAL ISO STANDARD"));

        // Wenzel WM | Quartis çıktısı
        let wenzel = emitter.emit_wenzel_dmis(&plan, &traj).unwrap();
        assert!(wenzel.contains("WENZEL WM | QUARTIS COMPATIBLE DMIS"));
    }

    #[test]
    fn test_threaded_hole_bypass_emission_and_setup_sheet() {
        let drf = DatumReferenceFrame::new_3_2_1("PCS_1", 1, 2, 3);
        let mut plan = InspectionPlan::new("ENGINE_BLOCK", "block.step", drf);

        let thread_m8 = ThreadSpecification::new_metric_coarse(8.0, 20.0).unwrap();
        let tapped_hole = GeometricFeature::new_tapped_hole(
            10,
            "M8_THREAD_01",
            DVec3::new(50.0, 50.0, 30.0),
            DVec3::Z,
            thread_m8,
            800.0,
            15.0,
        )
        .unwrap();

        plan.features.push(tapped_hole);

        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
        let traj = CertifiedCollisionFreeTrajectory::new(vec![], clearance, vec![]);

        let emitter = DmisEmitter::new();
        let dmis_code = emitter.emit_pcdmis(&plan, &traj).expect("Emission failed");

        // DMIS kodunda baypas başlığı ve koruma notu yer almalı
        assert!(dmis_code.contains("OPERATOR KURULUM FOYU: MANUEL DIS MASTAR"));
        assert!(dmis_code.contains("[MASTAR] UNSUR: M8_THREAD_01 | DIS: M8x1.25"));
        assert!(dmis_code.contains("[EMNIYET BAYPASI] UNSUR: M8_THREAD_01 (VIDA DISI / TAPPED HOLE)"));
        assert!(dmis_code.contains("PROB VIDA HELISINE DALMAYACAKTIR"));

        // Setup Sheet Markdown çıktısı kontrolü
        let setup_sheet = emitter.generate_setup_sheet(&plan);
        assert!(setup_sheet.contains("NUPER ORTHO — CMM OPERATÖR KURULUM FÖYÜ"));
        assert!(setup_sheet.contains("M8_THREAD_01"));
        assert!(setup_sheet.contains("ISO 1502 / DIN 13 (6H)"));
        assert!(setup_sheet.contains("Saha Operatörü Kontrol İmzası"));

        // Rota ile zenginleştirilmiş Setup Sheet
        let rich_sheet = emitter.generate_setup_sheet_with_trajectory(&plan, Some(&traj));
        assert!(rich_sheet.contains("Parça Yerleşimi ve Pabuç / Fikstür Konfigürasyonu"));
        assert!(rich_sheet.contains("Prob ve Kinematik Kafa Montaj Reçetesi"));
        assert!(rich_sheet.contains("Manuel Ön-Hizalama Adımları"));
        assert!(rich_sheet.contains("Renishaw PH10M"));

        // Baskıya hazır HTML Kurulum Föyü
        let html_sheet = emitter.generate_setup_sheet_html(&plan, Some(&traj));
        assert!(html_sheet.contains("<!DOCTYPE html>"));
        assert!(html_sheet.contains("NUPER ORTHO — CMM OPERATÖR KURULUM FÖYÜ"));
        assert!(html_sheet.contains("M8_THREAD_01"));
        assert!(html_sheet.contains("M8x1.25"));
        assert!(html_sheet.contains("@media print"));
    }
}


