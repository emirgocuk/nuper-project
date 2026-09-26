//! # ortho-emitter
//! 
//! Katman 5: Nötr Teftiş AST'sini ve sertifikalı rotayı PC-DMIS, ANSI DMIS 5.3
//! ve Calypso lehçelerine derleyen post-processor şablon motoru.

use std::fmt::Write;
use ortho_ast::{FeatureType, FittingAlgorithm, InspectionPlan, ToleranceType};
use ortho_router::{CertifiedCollisionFreeTrajectory, MotionSegment};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum EmitterError {
    #[error("Şablon derleme hatası: {0}")]
    TemplateError(String),

    #[error("Kod biçimlendirme hatası: {0}")]
    FormatError(#[from] std::fmt::Error),
}

pub struct DmisEmitter;

impl Default for DmisEmitter {
    fn default() -> Self {
        Self::new()
    }
}

impl DmisEmitter {
    pub fn new() -> Self {
        Self
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
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out)?;

        // 2. TERMAL KOMPANZASYON VE EMNİYET LİMİTLERİ
        writeln!(out, "TEMPR/PART, 20.0, MATL, 23.4000  $$ 20C Referans, Alüminyum genleşme")?;
        writeln!(out, "SNSET/APPRCH, 4.0000")?;
        writeln!(out, "SNSET/RETRCT, 5.0000")?;
        writeln!(out, "SNSET/SEARCH, 8.0000")?;
        writeln!(out, "SNSET/CLRSRF, {:.4}", trajectory.clearance_box.z_clearance)?;
        writeln!(out)?;

        // 3. MANUEL ÖN-HİZALAMA BLOĞU (MODE/MAN)
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

        // 4. OTONOM DCC MODA GEÇİŞ VE GÜVENLİ Z-FIRST HAREKET
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ 2. OTONOM DCC MODU VE EMNIYETLI Z-FIRST BASLANGIC")?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "MODE/PROG, MAN")?;
        writeln!(out, "SNSLCT/SA(A0.0B0.0)")?;
        writeln!(out, "GOTO/CART, 0.0000, 0.0000, {:.4}", trajectory.clearance_box.z_clearance)?;
        writeln!(out)?;

        // 5. TEFTİŞ UNSURLARI VE TEMAS NOKTALARI
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ 3. HASSAS GEOMETRIK UNSUR OLCUMLERI")?;
        writeln!(out, "$$ ==============================================================")?;

        for feature in &plan.features {
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
                _ => {}
            }
        }

        // 8. GÜVENLİ BİTİŞ VE EMNİYET TAVANINA DÖNÜŞ
        writeln!(out)?;
        writeln!(out, "$$ GUVENLI BITIS")?;
        writeln!(out, "GOTO/CART, 0.0000, 0.0000, {:.4}", trajectory.clearance_box.z_clearance)?;
        writeln!(out, "ENDFIL")?;

        Ok(out)
    }
}
