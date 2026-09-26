use glam::DVec3;
use serde::{Deserialize, Serialize};

use crate::compound::CompoundHoleFeature;
use crate::datum::DatumReferenceFrame;
use crate::error::AstError;
use crate::feature::GeometricFeature;
use crate::tolerance::ToleranceConstraint;

/// Teftiş Planı Uzunluk Birimi
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum LengthUnit {
    Millimeters,
    Inches,
}

/// Nuper Ortho Nötr Teftiş Planı (Intermediate Representation - AST)
/// Donanım ve yazılımdan bağımsız, tam geometrik ve metrolojik veri sözleşmesi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct InspectionPlan {
    /// Parça veya operasyon adı (örneğin "VALVE_BODY_OP10")
    pub part_name: String,
    /// Kaynak STEP dosyasının adı
    pub cad_source_file: String,
    /// Ölçü birimi
    pub unit: LengthUnit,
    /// Parça Koordinat Sistemi (PCS) Datum Referans Çerçevesi
    pub datum_frame: DatumReferenceFrame,
    /// B-Rep modelinden çıkarılan analitik unsurlar listesi
    pub features: Vec<GeometricFeature>,
    /// Kademeli ve vida dişli bileşik delik grupları
    pub compound_holes: Vec<CompoundHoleFeature>,
    /// Geometrik tolerans kısıtları (Feature Control Frames)
    pub tolerances: Vec<ToleranceConstraint>,
    /// Parçanın dış sınır kutusu minimum köşe [X, Y, Z] (mm)
    pub bounding_box_min: DVec3,
    /// Parçanın dış sınır kutusu maksimum köşe [X, Y, Z] (mm)
    pub bounding_box_max: DVec3,
}

impl InspectionPlan {
    /// Yeni ve boş bir Teftiş Planı oluşturur
    pub fn new(
        part_name: impl Into<String>,
        cad_source_file: impl Into<String>,
        datum_frame: DatumReferenceFrame,
    ) -> Self {
        Self {
            part_name: part_name.into(),
            cad_source_file: cad_source_file.into(),
            unit: LengthUnit::Millimeters,
            datum_frame,
            features: Vec::new(),
            compound_holes: Vec::new(),
            tolerances: Vec::new(),
            bounding_box_min: DVec3::ZERO,
            bounding_box_max: DVec3::ZERO,
        }
    }

    /// AST ağacının tüm tutarlılık kurallarını doğrular
    pub fn validate(&self) -> Result<(), AstError> {
        // 1. Tüm unsurların fiziksel geçerliliğini denetle
        for feature in &self.features {
            feature.validate()?;
        }

        // 2. Datum çerçevesinin 6-DoF kilitlenmesini doğrula
        self.datum_frame.validate(&self.features)?;

        // 3. Toleransların var olan unsurlara bağlı olduğunu doğrula
        for tol in &self.tolerances {
            if !self.features.iter().any(|f| f.id == tol.feature_id) {
                return Err(AstError::FeatureNotFound {
                    feature_id: tol.feature_id,
                });
            }
        }

        Ok(())
    }

    /// JSON formatına serileştirir
    pub fn to_json(&self) -> Result<String, AstError> {
        serde_json::to_string_pretty(self)
            .map_err(|e| AstError::SerializationError(e.to_string()))
    }

    /// JSON formatından ayrıştırır
    pub fn from_json(json: &str) -> Result<Self, AstError> {
        let plan: Self = serde_json::from_str(json)
            .map_err(|e| AstError::SerializationError(e.to_string()))?;
        plan.validate()?;
        Ok(plan)
    }

    /// Hızlı binary (Bincode) serileştirme
    pub fn to_binary(&self) -> Result<Vec<u8>, AstError> {
        bincode::serialize(self)
            .map_err(|e| AstError::SerializationError(e.to_string()))
    }

    /// Binary (Bincode) tamponundan ayrıştırır
    pub fn from_binary(bytes: &[u8]) -> Result<Self, AstError> {
        let plan: Self = bincode::deserialize(bytes)
            .map_err(|e| AstError::SerializationError(e.to_string()))?;
        plan.validate()?;
        Ok(plan)
    }
}
