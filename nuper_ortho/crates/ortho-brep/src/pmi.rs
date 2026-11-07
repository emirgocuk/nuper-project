use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;
use ortho_ast::datum::DatumLabel;
use ortho_ast::tolerance::{FittingAlgorithm, MaterialModifier, ToleranceConstraint, ToleranceType};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PmiError {
    #[error("STEP AP242 dosyası açılamadı: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Geçersiz veya desteklenmeyen PMI sözdizimi: {0}")]
    SyntaxError(String),
}

pub struct StepPmiReader;

impl StepPmiReader {
    pub fn has_semantic_pmi(path: impl AsRef<Path>) -> Result<bool, PmiError> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);

        for line_res in reader.lines().take(500) {
            let line = line_res?;
            if line.contains("GEOMETRIC_TOLERANCE")
                || line.contains("DATUM_SYSTEM")
                || line.contains("DIMENSIONAL_CHARACTERISTIC")
                || line.contains("FLATNESS_TOLERANCE")
                || line.contains("POSITION_TOLERANCE")
                || line.contains("CYLINDRICITY_TOLERANCE")
            {
                return Ok(true);
            }
        }
        Ok(false)
    }

    pub fn extract_embedded_tolerances(
        path: impl AsRef<Path>,
    ) -> Result<Vec<ToleranceConstraint>, PmiError> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);

        let mut constraints = Vec::new();
        let mut next_id = 1u32;

        for line_res in reader.lines() {
            let line = line_res?;
            let trimmed = line.trim();

            let (tol_type, fitting, default_val) = if trimmed.contains("FLATNESS_TOLERANCE") {
                (ToleranceType::Flatness, FittingAlgorithm::MinimumZone, 0.015)
            } else if trimmed.contains("CYLINDRICITY_TOLERANCE") {
                (ToleranceType::Cylindricity, FittingAlgorithm::MinimumZone, 0.020)
            } else if trimmed.contains("ROUNDNESS_TOLERANCE") {
                (ToleranceType::Circularity, FittingAlgorithm::MinimumZone, 0.010)
            } else if trimmed.contains("PERPENDICULARITY_TOLERANCE") {
                (ToleranceType::Perpendicularity, FittingAlgorithm::GaussLeastSquares, 0.025)
            } else if trimmed.contains("PARALLELISM_TOLERANCE") {
                (ToleranceType::Parallelism, FittingAlgorithm::GaussLeastSquares, 0.020)
            } else if trimmed.contains("POSITION_TOLERANCE") {
                (ToleranceType::Position, FittingAlgorithm::ChebyshevMaximumInscribed, 0.050)
            } else if trimmed.contains("SURFACE_PROFILE_TOLERANCE") {
                (ToleranceType::ProfileOfSurface, FittingAlgorithm::MinimumZone, 0.100)
            } else {
                continue;
            };

            // Parse tolerance value if present as float in the parameter list
            let mut tol_val = default_val;
            if let Some(open_paren) = trimmed.find('(') {
                if let Some(close_paren) = trimmed[open_paren..].rfind(')') {
                    let inside = &trimmed[open_paren + 1..open_paren + close_paren];
                    for part in inside.split(',') {
                        let token = part.trim();
                        if let Ok(v) = token.parse::<f64>() {
                            if v > 0.0 && v < 100.0 {
                                tol_val = v;
                                break;
                            }
                        }
                    }
                }
            }

            // Extract datum precedence if references exist
            let mut datums = Vec::new();
            if trimmed.contains("'A'") {
                datums.push(DatumLabel::A);
            }
            if trimmed.contains("'B'") {
                datums.push(DatumLabel::B);
            }
            if trimmed.contains("'C'") {
                datums.push(DatumLabel::C);
            }

            constraints.push(ToleranceConstraint {
                id: next_id,
                feature_id: next_id,
                tolerance_type: tol_type,
                nominal_value: 0.0,
                upper_tolerance: tol_val,
                lower_tolerance: 0.0,
                datum_precedence: datums,
                material_modifier: MaterialModifier::RFS,
                recommended_fitting: fitting,
                is_composite: false,
                profile_disposition: None,
            });

            next_id += 1;
        }

        Ok(constraints)
    }
}
