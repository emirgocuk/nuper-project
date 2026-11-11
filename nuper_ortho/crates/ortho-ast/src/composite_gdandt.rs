use serde::{Deserialize, Serialize};

use crate::datum::DatumLabel;
use crate::error::AstError;
use crate::feature::GeometricFeature;
use crate::tolerance::{MaterialModifier, ProfileZoneDisposition, ToleranceType};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SingleToleranceZone {
    pub tolerance_value: f64,
    pub datum_precedence: Vec<DatumLabel>,
    pub material_modifier: MaterialModifier,
}

impl SingleToleranceZone {
    pub fn new(
        tolerance_value: f64,
        datum_precedence: Vec<DatumLabel>,
        material_modifier: MaterialModifier,
    ) -> Self {
        Self {
            tolerance_value,
            datum_precedence,
            material_modifier,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CompositeTolerance {
    pub id: u32,
    pub name: String,
    pub feature_ids: Vec<u32>,
    pub tolerance_type: ToleranceType,
    pub pltzf: SingleToleranceZone,
    pub frtzf: SingleToleranceZone,
}

impl CompositeTolerance {
    pub fn new_composite_position(
        id: u32,
        name: impl Into<String>,
        feature_ids: Vec<u32>,
        pltzf_tol: f64,
        pltzf_datums: Vec<DatumLabel>,
        frtzf_tol: f64,
        frtzf_datums: Vec<DatumLabel>,
    ) -> Self {
        Self {
            id,
            name: name.into(),
            feature_ids,
            tolerance_type: ToleranceType::Position,
            pltzf: SingleToleranceZone::new(pltzf_tol, pltzf_datums, MaterialModifier::RFS),
            frtzf: SingleToleranceZone::new(frtzf_tol, frtzf_datums, MaterialModifier::RFS),
        }
    }

    pub fn validate(&self, features: &[GeometricFeature]) -> Result<(), AstError> {
        if self.feature_ids.is_empty() {
            return Err(AstError::InvalidTolerance(format!(
                "Bileşik tolerans #{} en az bir unsura bağlanmalıdır.",
                self.id
            )));
        }

        for &fid in &self.feature_ids {
            if !features.iter().any(|f| f.id == fid) {
                return Err(AstError::FeatureNotFound { feature_id: fid });
            }
        }

        if self.frtzf.tolerance_value > self.pltzf.tolerance_value {
            return Err(AstError::InvalidTolerance(format!(
                "ASME Y14.5 Kural İhlali (#{}: {}): FRTZF ({:.4} mm) PLTZF'den ({:.4} mm) daha geniş olamaz!",
                self.id, self.name, self.frtzf.tolerance_value, self.pltzf.tolerance_value
            )));
        }

        if self.pltzf.tolerance_value <= 0.0 || self.frtzf.tolerance_value <= 0.0 {
            return Err(AstError::InvalidTolerance(format!(
                "Bileşik tolerans değerleri pozitif olmalıdır (#{}: {})",
                self.id, self.name
            )));
        }

        if self.frtzf.datum_precedence.len() > self.pltzf.datum_precedence.len() {
            return Err(AstError::InvalidTolerance(format!(
                "ASME Y14.5 Kural İhlali (#{}: {}): FRTZF datum sayısı PLTZF datum sayısından fazla olamaz!",
                self.id, self.name
            )));
        }

        for (i, frtzf_datum) in self.frtzf.datum_precedence.iter().enumerate() {
            if self.pltzf.datum_precedence.get(i) != Some(frtzf_datum) {
                return Err(AstError::InvalidTolerance(format!(
                    "ASME Y14.5 Kural İhlali (#{}: {}): FRTZF datum önceliği ({:?}) PLTZF ile ({:?}) uyumsuz!",
                    self.id, self.name, self.frtzf.datum_precedence, self.pltzf.datum_precedence
                )));
            }
        }

        Ok(())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct BonusToleranceResult {
    pub specified_tolerance: f64,
    pub bonus: f64,
    pub total_allowable_tolerance: f64,
    pub departure_from_material_condition: f64,
}

pub fn compute_bonus_tolerance(
    modifier: MaterialModifier,
    is_internal: bool,
    measured_size: f64,
    material_limit_size: f64,
    specified_tolerance: f64,
) -> BonusToleranceResult {
    let bonus = match modifier {
        MaterialModifier::RFS => 0.0,
        MaterialModifier::MMC => {
            if is_internal {
                (measured_size - material_limit_size).max(0.0)
            } else {
                (material_limit_size - measured_size).max(0.0)
            }
        }
        MaterialModifier::LMC => {
            if is_internal {
                (material_limit_size - measured_size).max(0.0)
            } else {
                (measured_size - material_limit_size).max(0.0)
            }
        }
    };

    BonusToleranceResult {
        specified_tolerance,
        bonus,
        total_allowable_tolerance: specified_tolerance + bonus,
        departure_from_material_condition: bonus,
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GdAndTEvaluation {
    pub tolerance_type: ToleranceType,
    pub measured_deviation: f64,
    pub allowable_tolerance: f64,
    pub bonus: f64,
    pub is_pass: bool,
    pub margin: f64,
}

pub struct GdAndTEvaluator;

impl GdAndTEvaluator {
    pub fn evaluate_flatness(deviations_from_best_plane: &[f64], specified_tol: f64) -> GdAndTEvaluation {
        if deviations_from_best_plane.is_empty() {
            return GdAndTEvaluation {
                tolerance_type: ToleranceType::Flatness,
                measured_deviation: 0.0,
                allowable_tolerance: specified_tol,
                bonus: 0.0,
                is_pass: true,
                margin: specified_tol,
            };
        }
        let min_d = deviations_from_best_plane.iter().copied().fold(f64::INFINITY, f64::min);
        let max_d = deviations_from_best_plane.iter().copied().fold(f64::NEG_INFINITY, f64::max);
        let peak_to_valley = (max_d - min_d).abs();

        GdAndTEvaluation {
            tolerance_type: ToleranceType::Flatness,
            measured_deviation: peak_to_valley,
            allowable_tolerance: specified_tol,
            bonus: 0.0,
            is_pass: peak_to_valley <= specified_tol,
            margin: specified_tol - peak_to_valley,
        }
    }

    pub fn evaluate_circularity(radii: &[f64], specified_tol: f64) -> GdAndTEvaluation {
        if radii.is_empty() {
            return GdAndTEvaluation {
                tolerance_type: ToleranceType::Circularity,
                measured_deviation: 0.0,
                allowable_tolerance: specified_tol,
                bonus: 0.0,
                is_pass: true,
                margin: specified_tol,
            };
        }
        let r_min = radii.iter().copied().fold(f64::INFINITY, f64::min);
        let r_max = radii.iter().copied().fold(f64::NEG_INFINITY, f64::max);
        let rad_zone = r_max - r_min;

        GdAndTEvaluation {
            tolerance_type: ToleranceType::Circularity,
            measured_deviation: rad_zone,
            allowable_tolerance: specified_tol,
            bonus: 0.0,
            is_pass: rad_zone <= specified_tol,
            margin: specified_tol - rad_zone,
        }
    }

    pub fn evaluate_cylindricity(radii: &[f64], specified_tol: f64) -> GdAndTEvaluation {
        if radii.is_empty() {
            return GdAndTEvaluation {
                tolerance_type: ToleranceType::Cylindricity,
                measured_deviation: 0.0,
                allowable_tolerance: specified_tol,
                bonus: 0.0,
                is_pass: true,
                margin: specified_tol,
            };
        }
        let r_min = radii.iter().copied().fold(f64::INFINITY, f64::min);
        let r_max = radii.iter().copied().fold(f64::NEG_INFINITY, f64::max);
        let radial_spread = r_max - r_min;

        GdAndTEvaluation {
            tolerance_type: ToleranceType::Cylindricity,
            measured_deviation: radial_spread,
            allowable_tolerance: specified_tol,
            bonus: 0.0,
            is_pass: radial_spread <= specified_tol,
            margin: specified_tol - radial_spread,
        }
    }

    pub fn evaluate_true_position_2d(
        measured_xy: (f64, f64),
        nominal_xy: (f64, f64),
        bonus: f64,
        specified_tol: f64,
    ) -> GdAndTEvaluation {
        let dx = measured_xy.0 - nominal_xy.0;
        let dy = measured_xy.1 - nominal_xy.1;
        let diametral_deviation = 2.0 * (dx * dx + dy * dy).sqrt();
        let allowable = specified_tol + bonus;

        GdAndTEvaluation {
            tolerance_type: ToleranceType::Position,
            measured_deviation: diametral_deviation,
            allowable_tolerance: allowable,
            bonus,
            is_pass: diametral_deviation <= allowable,
            margin: allowable - diametral_deviation,
        }
    }

    pub fn evaluate_perpendicularity(
        measured_sin_or_tan_dev: f64,
        evaluation_length: f64,
        bonus: f64,
        specified_tol: f64,
    ) -> GdAndTEvaluation {
        let deviation = measured_sin_or_tan_dev.abs() * evaluation_length;
        let allowable = specified_tol + bonus;

        GdAndTEvaluation {
            tolerance_type: ToleranceType::Perpendicularity,
            measured_deviation: deviation,
            allowable_tolerance: allowable,
            bonus,
            is_pass: deviation <= allowable,
            margin: allowable - deviation,
        }
    }

    pub fn evaluate_parallelism(
        height_spread: f64,
        bonus: f64,
        specified_tol: f64,
    ) -> GdAndTEvaluation {
        let allowable = specified_tol + bonus;

        GdAndTEvaluation {
            tolerance_type: ToleranceType::Parallelism,
            measured_deviation: height_spread.abs(),
            allowable_tolerance: allowable,
            bonus,
            is_pass: height_spread.abs() <= allowable,
            margin: allowable - height_spread.abs(),
        }
    }

    pub fn evaluate_concentricity(axis_offset: f64, specified_tol: f64) -> GdAndTEvaluation {
        let diametral = 2.0 * axis_offset.abs();

        GdAndTEvaluation {
            tolerance_type: ToleranceType::Concentricity,
            measured_deviation: diametral,
            allowable_tolerance: specified_tol,
            bonus: 0.0,
            is_pass: diametral <= specified_tol,
            margin: specified_tol - diametral,
        }
    }

    pub fn evaluate_surface_profile(
        deviations: &[f64],
        specified_tol: f64,
        disposition: ProfileZoneDisposition,
    ) -> GdAndTEvaluation {
        if deviations.is_empty() {
            return GdAndTEvaluation {
                tolerance_type: ToleranceType::ProfileOfSurface,
                measured_deviation: 0.0,
                allowable_tolerance: specified_tol,
                bonus: 0.0,
                is_pass: true,
                margin: specified_tol,
            };
        }

        let (min_allow, max_allow, total_width) = match disposition {
            ProfileZoneDisposition::BilateralSymmetric => {
                let half = specified_tol / 2.0;
                (-half, half, specified_tol)
            }
            ProfileZoneDisposition::UnequallyDisposed {
                total_width,
                outward_offset,
            } => {
                let inward = -(total_width - outward_offset);
                (inward, outward_offset, total_width)
            }
        };

        let mut max_abs_dev = 0.0;
        let mut is_pass = true;

        for &d in deviations {
            if d < min_allow || d > max_allow {
                is_pass = false;
            }
            let spread = d.abs() * 2.0;
            if spread > max_abs_dev {
                max_abs_dev = spread;
            }
        }

        GdAndTEvaluation {
            tolerance_type: ToleranceType::ProfileOfSurface,
            measured_deviation: max_abs_dev,
            allowable_tolerance: total_width,
            bonus: 0.0,
            is_pass,
            margin: total_width - max_abs_dev,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use glam::DVec3;

    fn make_test_hole(id: u32, name: &str) -> GeometricFeature {
        GeometricFeature::new_internal_cylinder(
            id,
            name,
            DVec3::ZERO,
            DVec3::Z,
            10.0,
            20.0,
            600.0,
            5.0,
        )
        .unwrap()
    }

    #[test]
    fn test_composite_validation_rule_frtzf_le_pltzf() {
        let valid_comp = CompositeTolerance::new_composite_position(
            1,
            "Pattern Holes",
            vec![101, 102],
            0.50,
            vec![DatumLabel::A, DatumLabel::B, DatumLabel::C],
            0.20,
            vec![DatumLabel::A, DatumLabel::B],
        );

        let features = vec![make_test_hole(101, "Hole1"), make_test_hole(102, "Hole2")];

        assert!(valid_comp.validate(&features).is_ok());

        let invalid_comp = CompositeTolerance::new_composite_position(
            2,
            "Pattern Holes",
            vec![101, 102],
            0.20,
            vec![DatumLabel::A],
            0.50,
            vec![DatumLabel::A],
        );
        assert!(invalid_comp.validate(&features).is_err());
    }

    #[test]
    fn test_composite_validation_rule_datum_hierarchy() {
        let features = vec![make_test_hole(101, "Hole1")];

        let invalid_datum = CompositeTolerance::new_composite_position(
            3,
            "Pattern",
            vec![101],
            0.40,
            vec![DatumLabel::A, DatumLabel::B],
            0.15,
            vec![DatumLabel::B],
        );
        assert!(invalid_datum.validate(&features).is_err());
    }

    #[test]
    fn test_mmc_bonus_internal_hole() {
        let res = compute_bonus_tolerance(MaterialModifier::MMC, true, 10.05, 10.00, 0.10);
        assert!((res.bonus - 0.05).abs() < 1e-6);
        assert!((res.total_allowable_tolerance - 0.15).abs() < 1e-6);
    }

    #[test]
    fn test_mmc_bonus_external_shaft() {
        let res = compute_bonus_tolerance(MaterialModifier::MMC, false, 19.96, 20.00, 0.05);
        assert!((res.bonus - 0.04).abs() < 1e-6);
        assert!((res.total_allowable_tolerance - 0.09).abs() < 1e-6);
    }

    #[test]
    fn test_lmc_bonus_internal_hole() {
        let res = compute_bonus_tolerance(MaterialModifier::LMC, true, 9.97, 10.02, 0.08);
        assert!((res.bonus - 0.05).abs() < 1e-6);
        assert!((res.total_allowable_tolerance - 0.13).abs() < 1e-6);
    }

    #[test]
    fn test_rfs_bonus_is_zero() {
        let res = compute_bonus_tolerance(MaterialModifier::RFS, true, 10.08, 10.00, 0.10);
        assert_eq!(res.bonus, 0.0);
        assert_eq!(res.total_allowable_tolerance, 0.10);
    }

    #[test]
    fn test_flatness_evaluation_pass_and_fail() {
        let pass_pts = vec![0.005, -0.004, 0.002, -0.003];
        let eval_pass = GdAndTEvaluator::evaluate_flatness(&pass_pts, 0.02);
        assert!(eval_pass.is_pass);
        assert!((eval_pass.measured_deviation - 0.009).abs() < 1e-6);

        let fail_pts = vec![0.015, -0.018];
        let eval_fail = GdAndTEvaluator::evaluate_flatness(&fail_pts, 0.02);
        assert!(!eval_fail.is_pass);
    }

    #[test]
    fn test_circularity_evaluation() {
        let radii = vec![10.002, 10.006, 10.001, 10.004];
        let eval = GdAndTEvaluator::evaluate_circularity(&radii, 0.01);
        assert!(eval.is_pass);
        assert!((eval.measured_deviation - 0.005).abs() < 1e-6);
    }

    #[test]
    fn test_cylindricity_evaluation() {
        let radii = vec![25.001, 25.007, 24.998, 25.003];
        let eval = GdAndTEvaluator::evaluate_cylindricity(&radii, 0.015);
        assert!(eval.is_pass);
        assert!((eval.measured_deviation - 0.009).abs() < 1e-6);
    }

    #[test]
    fn test_true_position_with_bonus() {
        let eval = GdAndTEvaluator::evaluate_true_position_2d(
            (50.04, 30.03),
            (50.00, 30.00),
            0.03,
            0.10,
        );
        assert!((eval.measured_deviation - 0.10).abs() < 1e-4);
        assert!(eval.is_pass);

        let eval_fail = GdAndTEvaluator::evaluate_true_position_2d(
            (50.08, 30.06),
            (50.00, 30.00),
            0.00,
            0.10,
        );
        assert!((eval_fail.measured_deviation - 0.20).abs() < 1e-4);
        assert!(!eval_fail.is_pass);
    }

    #[test]
    fn test_perpendicularity_evaluation() {
        let eval = GdAndTEvaluator::evaluate_perpendicularity(0.0002, 100.0, 0.01, 0.05);
        assert!(eval.is_pass);
        assert!((eval.measured_deviation - 0.02).abs() < 1e-6);
    }

    #[test]
    fn test_parallelism_evaluation() {
        let eval = GdAndTEvaluator::evaluate_parallelism(0.025, 0.0, 0.030);
        assert!(eval.is_pass);
        assert!((eval.margin - 0.005).abs() < 1e-6);
    }

    #[test]
    fn test_concentricity_evaluation() {
        let eval = GdAndTEvaluator::evaluate_concentricity(0.012, 0.030);
        assert!(eval.is_pass);
        assert!((eval.measured_deviation - 0.024).abs() < 1e-6);
    }

    #[test]
    fn test_surface_profile_bilateral() {
        let devs = vec![-0.03, 0.02, -0.01, 0.04];
        let eval = GdAndTEvaluator::evaluate_surface_profile(
            &devs,
            0.10,
            ProfileZoneDisposition::BilateralSymmetric,
        );
        assert!(eval.is_pass);
    }

    #[test]
    fn test_surface_profile_unequally_disposed() {
        let devs_pass = vec![-0.30, 0.15, -0.10, 0.18];
        let eval_pass = GdAndTEvaluator::evaluate_surface_profile(
            &devs_pass,
            0.80,
            ProfileZoneDisposition::UnequallyDisposed {
                total_width: 0.80,
                outward_offset: 0.20,
            },
        );
        assert!(eval_pass.is_pass);

        let devs_fail = vec![0.25];
        let eval_fail = GdAndTEvaluator::evaluate_surface_profile(
            &devs_fail,
            0.80,
            ProfileZoneDisposition::UnequallyDisposed {
                total_width: 0.80,
                outward_offset: 0.20,
            },
        );
        assert!(!eval_fail.is_pass);
    }
}
