use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;
use ortho_ast::ToleranceConstraint;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PmiError {
    #[error("STEP AP242 dosyası açılamadı: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Geçersiz veya desteklenmeyen PMI sözdizimi: {0}")]
    SyntaxError(String),

    #[error("STEP AP242 semantik PMI doğrudan ayrıştırma henüz desteklenmiyor")]
    Unsupported,
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
            {
                return Ok(true);
            }
        }
        Ok(false)
    }

    pub fn extract_embedded_tolerances(
        _path: impl AsRef<Path>,
    ) -> Result<Vec<ToleranceConstraint>, PmiError> {
        Err(PmiError::Unsupported)
    }
}

