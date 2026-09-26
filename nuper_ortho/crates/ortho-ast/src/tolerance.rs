use serde::{Deserialize, Serialize};

use crate::datum::DatumLabel;

/// ASME Y14.5 ve ISO 1101 Geometrik Tolerans Türleri
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum ToleranceType {
    /// Konum Toleransı (Position - ⨁)
    Position,
    /// Düzlemsellik (Flatness - ⏥)
    Flatness,
    /// Diklik (Perpendicularity - ⟂)
    Perpendicularity,
    /// Paralellik (Parallelism - ∥)
    Parallelism,
    /// Eşmerkezlilik (Concentricity - ◎)
    Concentricity,
    /// Silindiriklik (Cylindricity - ⌭)
    Cylindricity,
    /// Dairesellik (Circularity - ○)
    Circularity,
    /// Dairesel Salgı (Circular Runout - ↗)
    CircularRunout,
    /// Toplam Salgı (Total Runout - ⌰)
    TotalRunout,
    /// Yüzey Profili (Profile of a Surface - ⌓)
    ProfileOfSurface,
    /// Çizgi Profili (Profile of a Line - ⌒)
    ProfileOfLine,
    /// Boyut / Çap Toleransı (Size / Diameter - ∅)
    Diameter,
}

/// Malzeme Durumu Modifikatörü (Material Condition)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum MaterialModifier {
    /// Regardless of Feature Size (RFS - Boyuttan Bağımsız, Varsayılan)
    RFS,
    /// Maximum Material Condition (MMC - Ⓜ En Fazla Malzeme Durumu)
    MMC,
    /// Least Material Condition (LMC - Ⓛ En Az Malzeme Durumu)
    LMC,
}

/// Metroloji Geometrik Fitting (En İyi Uyum) Algoritması
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum FittingAlgorithm {
    /// Gauss En Küçük Kareler (Least Squares - Ortalama Boyut)
    GaussLeastSquares,
    /// Chebyshev Maksimum İç Teğet (Maximum Inscribed - H7 Delik Zorunluluğu)
    ChebyshevMaximumInscribed,
    /// Chebyshev Minimum Dış Teğet (Minimum Circumscribed - h6 Mil Zorunluluğu)
    ChebyshevMinimumCircumscribed,
    /// Minimum Bölge (Minimum Zone - Form Toleransları)
    MinimumZone,
}

/// Nötr Teftiş AST'sinde tekil bir Geometrik Tolerans Kısıtı (Feature Control Frame)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ToleranceConstraint {
    pub id: u32,
    /// Toleransın bağlandığı geometrik unsurun ID'si
    pub feature_id: u32,
    pub tolerance_type: ToleranceType,
    /// Nominal değer (örneğin nominal çap 20.0 mm veya profil 0.0 mm)
    pub nominal_value: f64,
    /// Üst sapma sınırı (+0.021 mm)
    pub upper_tolerance: f64,
    /// Alt sapma sınırı (0.000 mm)
    pub lower_tolerance: f64,
    /// Referans Datum öncelik zinciri (örneğin [A, B, C])
    pub datum_precedence: Vec<DatumLabel>,
    pub material_modifier: MaterialModifier,
    /// Bu toleransı doğrulamak için zorunlu fitting algoritması
    pub recommended_fitting: FittingAlgorithm,
    /// ASME Y14.5 Bileşik Tolerans (Composite FCF) mu?
    pub is_composite: bool,
}

impl ToleranceConstraint {
    /// Standart bir H7 dişi delik çap toleransı oluşturur (Chebyshev zorunlu)
    pub fn new_h7_hole(id: u32, feature_id: u32, nominal_diameter: f64, tolerance_band: f64) -> Self {
        Self {
            id,
            feature_id,
            tolerance_type: ToleranceType::Diameter,
            nominal_value: nominal_diameter,
            upper_tolerance: tolerance_band,
            lower_tolerance: 0.0,
            datum_precedence: Vec::new(),
            material_modifier: MaterialModifier::RFS,
            recommended_fitting: FittingAlgorithm::ChebyshevMaximumInscribed,
            is_composite: false,
        }
    }

    /// Datum referanslı standart bir konum toleransı (Position FCF) oluşturur
    pub fn new_position(
        id: u32,
        feature_id: u32,
        tolerance_value: f64,
        datums: Vec<DatumLabel>,
        modifier: MaterialModifier,
    ) -> Self {
        Self {
            id,
            feature_id,
            tolerance_type: ToleranceType::Position,
            nominal_value: 0.0,
            upper_tolerance: tolerance_value,
            lower_tolerance: 0.0,
            datum_precedence: datums,
            material_modifier: modifier,
            recommended_fitting: FittingAlgorithm::GaussLeastSquares,
            is_composite: false,
        }
    }
}
