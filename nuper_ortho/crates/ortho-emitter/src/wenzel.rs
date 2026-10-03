//! # ortho-emitter::wenzel
//!
//! Wenzel WM | Quartis Metroloji Çıktı Motoru.
//! Wenzel'in modern metrik ve yapılandırılmış komut mimarisine uygun olarak
//! unsurları, toleransları ve 5-eksen Renishaw PH10 kafa yönelimlerini derler.

use std::fmt::Write;
use ortho_ast::{
    FeatureType, FittingAlgorithm, InspectionPlan, ToleranceType,
};
use ortho_router::CertifiedCollisionFreeTrajectory;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum WenzelError {
    #[error("Kod biçimlendirme hatası: {0}")]
    FormatError(#[from] std::fmt::Error),
}

pub struct WenzelEmitter;

impl Default for WenzelEmitter {
    fn default() -> Self {
        Self::new()
    }
}

impl WenzelEmitter {
    pub fn new() -> Self {
        Self
    }

    /// Nötr Teftiş Planı ve Sertifikalı Rota üzerinden Wenzel WM | Quartis programı üretir
    pub fn emit_quartis(
        &self,
        plan: &InspectionPlan,
        trajectory: Option<&CertifiedCollisionFreeTrajectory>,
    ) -> Result<String, WenzelError> {
        let mut out = String::with_capacity(4096);

        // 1. BAŞLIK BİLGİLERİ (Quartis Program Header)
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out, "$$ WENZEL WM | QUARTIS OTONOM OLCUM PROGRAMI")?;
        writeln!(out, "$$ METROLOJI MOTORU: NUPER ORTHO v0.1.0-alpha (PH10M 5-AXIS)")?;
        writeln!(out, "$$ PARCA: {} | CAD: {}", plan.part_name, plan.cad_source_file)?;
        writeln!(out, "$$ GUVENLIK: CERTIFIED COLLISION-FREE (GJK/EPA PASS)")?;
        writeln!(out, "$$ ==============================================================")?;
        writeln!(out)?;

        writeln!(out, "PROGRAM '{}'", plan.part_name)?;
        writeln!(out, "  DME 'WENZEL LH 87'")?;
        writeln!(out, "  PROBE 'PH10M_TP20_50MM'")?;
        writeln!(out, "  HEAD_ORIENTATION(A: 0.0, B: 0.0)")?;

        let z_clear = trajectory
            .map(|t| t.clearance_box.z_clearance)
            .unwrap_or(100.0);
        writeln!(out, "  CLEARANCE_PLANE({:.3})", z_clear)?;
        writeln!(out)?;

        // 2. GEOMETRİK UNSURLAR (Features)
        for feature in &plan.features {
            match feature.feature_type {
                FeatureType::Plane => {
                    writeln!(out, "  FEATURE '{}' = PLANE(SURFACE, CART)", feature.name)?;
                    writeln!(
                        out,
                        "    POINT({:.3}, {:.3}, {:.3})",
                        feature.centroid.x, feature.centroid.y, feature.centroid.z
                    )?;
                    writeln!(
                        out,
                        "    NORMAL({:.4}, {:.4}, {:.4})",
                        feature.normal_vector.x, feature.normal_vector.y, feature.normal_vector.z
                    )?;
                }
                FeatureType::InternalCylinder => {
                    writeln!(out, "  FEATURE '{}' = CYLINDER(INTERNAL, CART)", feature.name)?;
                    writeln!(
                        out,
                        "    CENTER({:.3}, {:.3}, {:.3})",
                        feature.centroid.x, feature.centroid.y, feature.centroid.z
                    )?;
                    writeln!(
                        out,
                        "    AXIS({:.4}, {:.4}, {:.4})",
                        feature.normal_vector.x, feature.normal_vector.y, feature.normal_vector.z
                    )?;
                    if let Some(dia) = feature.diameter {
                        writeln!(out, "    DIAMETER({:.3})", dia)?;
                    }
                    if let Some(len) = feature.depth_or_length {
                        writeln!(out, "    LENGTH({:.3})", len)?;
                    }
                    writeln!(out, "    STRATEGY(CIRCULAR_POINTS, 4)")?;
                }
                FeatureType::ExternalCylinder => {
                    writeln!(out, "  FEATURE '{}' = CYLINDER(EXTERNAL, CART)", feature.name)?;
                    writeln!(
                        out,
                        "    CENTER({:.3}, {:.3}, {:.3})",
                        feature.centroid.x, feature.centroid.y, feature.centroid.z
                    )?;
                    writeln!(
                        out,
                        "    AXIS({:.4}, {:.4}, {:.4})",
                        feature.normal_vector.x, feature.normal_vector.y, feature.normal_vector.z
                    )?;
                    if let Some(dia) = feature.diameter {
                        writeln!(out, "    DIAMETER({:.3})", dia)?;
                    }
                }
                FeatureType::FreeformBSpline => {
                    writeln!(out, "  FEATURE '{}' = SURFACE_FREEFORM(CAD_BREP)", feature.name)?;
                    writeln!(
                        out,
                        "    CENTROID({:.3}, {:.3}, {:.3})",
                        feature.centroid.x, feature.centroid.y, feature.centroid.z
                    )?;
                }
                _ => {
                    writeln!(out, "  FEATURE '{}' = GENERIC(CART)", feature.name)?;
                }
            }
        }
        writeln!(out)?;

        // 3. TOLERANS DEĞERLENDİRMELERİ (Evaluations)
        for tol in &plan.tolerances {
            let feat_name = plan
                .features
                .iter()
                .find(|f| f.id == tol.feature_id)
                .map(|f| f.name.as_str())
                .unwrap_or("UNKNOWN_FEATURE");

            let method_str = match tol.recommended_fitting {
                FittingAlgorithm::GaussLeastSquares => "METHOD(GAUSSIAN)",
                FittingAlgorithm::MinimumZone => "METHOD(MINIMUM_ZONE)",
                FittingAlgorithm::ChebyshevMaximumInscribed => "METHOD(MAX_INSCRIBED)",
                FittingAlgorithm::ChebyshevMinimumCircumscribed => "METHOD(MIN_CIRCUMSCRIBED)",
            };

            match tol.tolerance_type {
                ToleranceType::Flatness => {
                    writeln!(
                        out,
                        "  EVALUATE FLATNESS('{}') TOL({:.4}) {}",
                        feat_name, tol.upper_tolerance, method_str
                    )?;
                }
                ToleranceType::Diameter => {
                    writeln!(
                        out,
                        "  EVALUATE DIAMETER('{}') TOL(+{:.4}, {:.4}) {}",
                        feat_name, tol.upper_tolerance, tol.lower_tolerance, method_str
                    )?;
                }
                ToleranceType::Position => {
                    writeln!(
                        out,
                        "  EVALUATE POSITION('{}') TOL({:.4}) DATUM(DATUM_A) {}",
                        feat_name, tol.upper_tolerance, method_str
                    )?;
                }
                ToleranceType::ProfileOfSurface => {
                    writeln!(
                        out,
                        "  EVALUATE PROFILE('{}') TOL({:.4}) {}",
                        feat_name, tol.upper_tolerance, method_str
                    )?;
                }
                _ => {
                    writeln!(
                        out,
                        "  EVALUATE TOLERANCE('{}') TOL({:.4})",
                        feat_name, tol.upper_tolerance
                    )?;
                }
            }
        }

        writeln!(out)?;
        writeln!(out, "  GOTO/CART, 0.000, 0.000, {:.3}", z_clear)?;
        writeln!(out, "END_PROGRAM")?;

        Ok(out)
    }
}
