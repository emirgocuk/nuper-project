//! # ortho-brep
//! 
//! Katman 1: STEP (AP214 / AP242) Ingestion ve OpenCASCADE B-Rep Geometri Çekirdeği.
//! Modelin analitik yüzeylerini, ters normal vektörlerini ve cidar kalınlıklarını çıkarır.

use std::path::Path;
use glam::DVec3;
use ortho_ast::{GeometricFeature, AstError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum BRepError {
    #[error("STEP dosyası bulunamadı veya açılamadı: {0}")]
    FileNotFound(String),

    #[error("OpenCASCADE ayrıştırma hatası: {0}")]
    ParsingError(String),

    #[error("AST dönüşüm hatası: {0}")]
    AstConversion(#[from] AstError),
}

/// OpenCASCADE tarafından ayrıştırılmış B-Rep modeli
#[derive(Debug, Clone)]
pub struct BRepModel {
    pub file_path: String,
    pub features: Vec<GeometricFeature>,
    pub bounding_box_min: DVec3,
    pub bounding_box_max: DVec3,
}

impl BRepModel {
    /// STEP dosyasını okuyarak analitik B-Rep modelini oluşturur
    pub fn from_step_file(path: impl AsRef<Path>) -> Result<Self, BRepError> {
        let path_ref = path.as_ref();
        let path_str = path_ref.to_string_lossy().to_string();

        if !path_ref.exists() {
            return Err(BRepError::FileNotFound(path_str));
        }

        // TODO: CXX FFI üzerinden OpenCASCADE STEPControl_Reader çağrısı bağlanacak.
        // Şu aşamada mimari sözleşmeyi karşılayan temel yapıyı oluşturuyoruz.
        Ok(Self {
            file_path: path_str,
            features: Vec::new(),
            bounding_box_min: DVec3::ZERO,
            bounding_box_max: DVec3::ZERO,
        })
    }

    /// Modele analitik bir unsur ekler
    pub fn add_feature(&mut self, feature: GeometricFeature) {
        self.features.push(feature);
    }
}
