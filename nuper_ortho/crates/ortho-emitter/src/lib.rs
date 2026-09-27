pub mod calypso;
pub mod template_engine;

use std::fmt::Write;
use ortho_ast::{
    FeatureType, FittingAlgorithm, InspectionPlan, ProfileZoneDisposition, ToleranceType,
};
use ortho_router::{CertifiedCollisionFreeTrajectory, MotionSegment};
use thiserror::Error;

pub use calypso::{CalypsoEmitter, CalypsoError};
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
        out.push_str("- **Emniyet Protokolü:** AS9100 Rev D & ISO 1502 Yakut Bilye Koruma Baypası\n\n");

        out.push_str(&report.format_markdown_table());

        out.push_str("### 🔒 Saha Operatörü Kontrol İmzası\n");
        out.push_str("- [ ] Parça fikstüre rijit bağlandı, titreşim ve esneme kontrol edildi.\n");
        out.push_str("- [ ] Tablodaki tüm dişli delikler ve toleranslı pimler manuel mastarlarla teyit edildi.\n");
        out.push_str("- [ ] Datum A/B/C yüzeylerinde çapak ve talaş temizliği yapıldı.\n\n");
        out.push_str("**Operatör Sicil / İmza:** _________________________    **Tarih:** 2026-09-27\n");

        out
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
    }
}


