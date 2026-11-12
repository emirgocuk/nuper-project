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
    Symmetry,
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

/// Yüzey Profili Tolerans Bölgesi Konfigürasyonu (Bilateral vs Unilateral / Unequally Disposed)
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ProfileZoneDisposition {
    /// İki taraflı simetrik: [-t/2, +t/2]
    BilateralSymmetric,
    /// ASME Y14.5 Unilateral / Unequally Disposed (Ⓤ Modifikatörü):
    /// total_width: t (toplam tolerans genişliği, örn. 0.80 mm)
    /// outward_offset: u (nominal yüzeyden dışarı / artı yöne izin verilen sapma, örn. 0.20 mm)
    /// İçeri sapma sınırı: -(t - u) = -0.60 mm
    UnequallyDisposed {
        total_width: f64,
        outward_offset: f64,
    },
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
    /// Yüzey Profili için bölge dağılımı (Bilateral veya ASME Ⓤ Unilateral)
    #[serde(default)]
    pub profile_disposition: Option<ProfileZoneDisposition>,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct DynamicBonusResult {
    pub mmc_size: f64,
    pub lmc_size: f64,
    pub bonus_tolerance: f64,
    pub total_tolerance: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct MmcBonusResult {
    pub mmc_size: f64,
    pub bonus_tolerance: f64,
    pub total_tolerance: f64,
}

impl ToleranceConstraint {
    pub fn compute_dynamic_bonus_tolerance(
        nominal_size: f64,
        upper_tol: f64,
        lower_tol: f64,
        measured_size: f64,
        stated_geom_tol: f64,
        is_internal: bool,
        material_modifier: MaterialModifier,
    ) -> DynamicBonusResult {
        let (d_mmc, d_lmc) = if is_internal {
            (nominal_size + lower_tol, nominal_size + upper_tol)
        } else {
            (nominal_size + upper_tol, nominal_size + lower_tol)
        };

        let bonus = match material_modifier {
            MaterialModifier::MMC => {
                if is_internal {
                    (measured_size - d_mmc).max(0.0)
                } else {
                    (d_mmc - measured_size).max(0.0)
                }
            }
            MaterialModifier::LMC => {
                if is_internal {
                    (d_lmc - measured_size).max(0.0)
                } else {
                    (measured_size - d_lmc).max(0.0)
                }
            }
            MaterialModifier::RFS => 0.0,
        };

        DynamicBonusResult {
            mmc_size: d_mmc,
            lmc_size: d_lmc,
            bonus_tolerance: bonus,
            total_tolerance: stated_geom_tol + bonus,
        }
    }

    pub fn compute_mmc_bonus(
        nominal: f64,
        upper_tol: f64,
        lower_tol: f64,
        actual_size: f64,
        stated_pos_tol: f64,
        is_internal: bool,
    ) -> MmcBonusResult {
        let dyn_res = Self::compute_dynamic_bonus_tolerance(
            nominal,
            upper_tol,
            lower_tol,
            actual_size,
            stated_pos_tol,
            is_internal,
            MaterialModifier::MMC,
        );
        MmcBonusResult {
            mmc_size: dyn_res.mmc_size,
            bonus_tolerance: dyn_res.bonus_tolerance,
            total_tolerance: dyn_res.total_tolerance,
        }
    }
    pub fn new(
        id: u32,
        feature_id: u32,
        tolerance_type: ToleranceType,
        nominal_value: f64,
        upper_tolerance: f64,
        lower_tolerance: f64,
    ) -> Self {
        Self {
            id,
            feature_id,
            tolerance_type,
            nominal_value,
            upper_tolerance,
            lower_tolerance,
            datum_precedence: Vec::new(),
            material_modifier: MaterialModifier::RFS,
            recommended_fitting: FittingAlgorithm::GaussLeastSquares,
            is_composite: false,
            profile_disposition: None,
        }
    }

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
            profile_disposition: None,
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
            profile_disposition: None,
        }
    }

    /// ASME Y14.5 / ISO 1101 Yüzey Profili (Profile of a Surface) toleransı oluşturur
    pub fn new_surface_profile(
        id: u32,
        feature_id: u32,
        total_tolerance: f64,
        disposition: ProfileZoneDisposition,
        datums: Vec<DatumLabel>,
    ) -> Self {
        let (upper, lower) = match disposition {
            ProfileZoneDisposition::BilateralSymmetric => (total_tolerance / 2.0, -total_tolerance / 2.0),
            ProfileZoneDisposition::UnequallyDisposed {
                total_width,
                outward_offset,
            } => (outward_offset, -(total_width - outward_offset)),
        };
        Self {
            id,
            feature_id,
            tolerance_type: ToleranceType::ProfileOfSurface,
            nominal_value: 0.0,
            upper_tolerance: upper,
            lower_tolerance: lower,
            datum_precedence: datums,
            material_modifier: MaterialModifier::RFS,
            recommended_fitting: FittingAlgorithm::MinimumZone,
            is_composite: false,
            profile_disposition: Some(disposition),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_internal_hole_mmc_bonus() {
        let res = ToleranceConstraint::compute_mmc_bonus(20.0, 0.021, 0.0, 20.015, 0.050, true);
        assert!((res.mmc_size - 20.0).abs() < 1e-6);
        assert!((res.bonus_tolerance - 0.015).abs() < 1e-6);
        assert!((res.total_tolerance - 0.065).abs() < 1e-6);
    }

    #[test]
    fn test_external_shaft_mmc_bonus() {
        let res = ToleranceConstraint::compute_mmc_bonus(25.0, 0.0, -0.013, 24.990, 0.040, false);
        assert!((res.mmc_size - 25.0).abs() < 1e-6);
        assert!((res.bonus_tolerance - 0.010).abs() < 1e-6);
        assert!((res.total_tolerance - 0.050).abs() < 1e-6);
    }

    #[test]
    fn test_dynamic_lmc_bonus() {
        let res = ToleranceConstraint::compute_dynamic_bonus_tolerance(
            20.0,
            0.021,
            0.0,
            20.015,
            0.050,
            true,
            MaterialModifier::LMC,
        );
        assert!((res.lmc_size - 20.021).abs() < 1e-6);
        assert!((res.bonus_tolerance - 0.006).abs() < 1e-6);
        assert!((res.total_tolerance - 0.056).abs() < 1e-6);
    }
}
