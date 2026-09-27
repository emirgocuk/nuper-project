use serde::{Deserialize, Serialize};

use crate::datum::DatumLabel;
use crate::error::AstError;
use crate::feature::GeometricFeature;
use crate::tolerance::{MaterialModifier, ToleranceType};

/// ASME Y14.5 uyarınca tekil bir tolerans seviyesi (PLTZF veya FRTZF)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SingleToleranceZone {
    /// Tolerans bandı genişliği (örneğin 0.80 mm veya 0.15 mm)
    pub tolerance_value: f64,
    /// Datum öncelik zinciri (örneğin [A, B, C] veya [A])
    pub datum_precedence: Vec<DatumLabel>,
    /// Malzeme durumu modifikatörü (RFS, MMC, LMC)
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

/// ASME Y14.5 Bileşik Tolerans Çerçevesi (Composite Feature Control Frame)
/// Çok delikli flanşlar ve desenler için 2 katmanlı hiyerarşik tolerans:
/// 1. PLTZF (Pattern-Locating Tolerance Zone Framework): Örüntünün parçaya göre konumu.
/// 2. FRTZF (Feature-Relating Tolerance Zone Framework): Unsurların birbirine göre konumu ve yönelimi.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CompositeTolerance {
    pub id: u32,
    pub name: String,
    /// Bu bileşik toleransın denetlediği geometrik unsur ID'leri (örn. desen delikleri)
    pub feature_ids: Vec<u32>,
    /// Tolerans tipi (Genellikle Position veya ProfileOfSurface)
    pub tolerance_type: ToleranceType,
    /// 1. Katman: PLTZF (Pattern-Locating)
    pub pltzf: SingleToleranceZone,
    /// 2. Katman: FRTZF (Feature-Relating)
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

    /// ASME Y14.5 standardına göre bileşik tolerans tutarlılık kurallarını denetler
    pub fn validate(&self, features: &[GeometricFeature]) -> Result<(), AstError> {
        if self.feature_ids.is_empty() {
            return Err(AstError::InvalidTolerance(format!(
                "Bileşik tolerans #{} en az bir unsura bağlanmalıdır.",
                self.id
            )));
        }

        // Tüm feature_id'ler mevcut mu?
        for &fid in &self.feature_ids {
            if !features.iter().any(|f| f.id == fid) {
                return Err(AstError::FeatureNotFound { feature_id: fid });
            }
        }

        // Kural 1: FRTZF toleransı PLTZF toleransından büyük olamaz (FRTZF <= PLTZF)
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

        // Kural 2: FRTZF datumları, PLTZF datumlarının aynı sıradaki bir alt kümesi olmalıdır.
        // Yeni bir datum türetilemez veya sıralama değiştirilemez.
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
