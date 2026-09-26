use serde::{Deserialize, Serialize};

use crate::error::AstError;
use crate::feature::{FeatureType, GeometricFeature};

/// ASME Y14.5 ve ISO 5459 Datum Harf Etiketleri
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum DatumLabel {
    A,
    B,
    C,
    D,
    E,
    Custom(String),
}

impl std::fmt::Display for DatumLabel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::A => write!(f, "A"),
            Self::B => write!(f, "B"),
            Self::C => write!(f, "C"),
            Self::D => write!(f, "D"),
            Self::E => write!(f, "E"),
            Self::Custom(s) => write!(f, "{}", s),
        }
    }
}

/// Datum Öncelik Derecesi
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum DatumPrecedence {
    /// Birincil Datum: 3 Serbestlik Derecesini kilitler (1 öteleme, 2 dönme)
    Primary = 1,
    /// İkincil Datum: 2 Serbestlik Derecesini kilitler (1 öteleme, 1 dönme)
    Secondary = 2,
    /// Üçüncül Datum: Kalan son 1 Serbestlik Derecesini kilitler (1 öteleme)
    Tertiary = 3,
}

/// Nötr AST içindeki tekil Datum tanımı
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DatumFeature {
    pub label: DatumLabel,
    pub feature_id: u32,
    pub precedence: DatumPrecedence,
    pub min_touch_points: usize,
}

/// 3-2-1 Hizalama Zincirini ve 6 Serbestlik Derecesini (6-DoF) Kitleyen Referans Çerçevesi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DatumReferenceFrame {
    pub name: String,
    pub primary: DatumFeature,
    pub secondary: Option<DatumFeature>,
    pub tertiary: Option<DatumFeature>,
}

impl DatumReferenceFrame {
    /// Yeni bir 3-2-1 Datum Çerçevesi oluşturur
    pub fn new_3_2_1(
        name: impl Into<String>,
        primary_id: u32,
        secondary_id: u32,
        tertiary_id: u32,
    ) -> Self {
        Self {
            name: name.into(),
            primary: DatumFeature {
                label: DatumLabel::A,
                feature_id: primary_id,
                precedence: DatumPrecedence::Primary,
                min_touch_points: 3,
            },
            secondary: Some(DatumFeature {
                label: DatumLabel::B,
                feature_id: secondary_id,
                precedence: DatumPrecedence::Secondary,
                min_touch_points: 2,
            }),
            tertiary: Some(DatumFeature {
                label: DatumLabel::C,
                feature_id: tertiary_id,
                precedence: DatumPrecedence::Tertiary,
                min_touch_points: 1,
            }),
        }
    }

    /// Verilen geometrik unsurlar listesine göre 3-2-1 datum zincirinin tutarlılığını doğrular
    pub fn validate(&self, features: &[GeometricFeature]) -> Result<usize, AstError> {
        let find_feature = |id: u32| {
            features
                .iter()
                .find(|f| f.id == id)
                .ok_or(AstError::FeatureNotFound { feature_id: id })
        };

        // 1. Birincil Datum Kontrolü
        let primary_f = find_feature(self.primary.feature_id)?;
        if primary_f.feature_type != FeatureType::Plane {
            return Err(AstError::IncompleteDatumFrame {
                reason: format!(
                    "Primer Datum (A) daima bir düzlem (Plane) olmalıdır; bulunan tip: {:?}",
                    primary_f.feature_type
                ),
            });
        }

        let mut locked_dof = 3; // Düzlem ile Tz, Rx, Ry kilitlenir

        // 2. İkincil Datum Kontrolü
        if let Some(sec) = &self.secondary {
            if sec.feature_id == self.primary.feature_id {
                return Err(AstError::IncompleteDatumFrame {
                    reason: "Sekonder Datum (B), Primer Datum (A) ile aynı yüzey olamaz."
                        .to_string(),
                });
            }
            let _sec_f = find_feature(sec.feature_id)?;
            locked_dof += 2; // Çizgi veya eksen ile Ty, Rz kilitlenir
        }

        // 3. Üçüncül Datum Kontrolü
        if let Some(tert) = &self.tertiary {
            if let Some(sec) = &self.secondary {
                if tert.feature_id == sec.feature_id || tert.feature_id == self.primary.feature_id {
                    return Err(AstError::IncompleteDatumFrame {
                        reason: "Tersiyer Datum (C), A veya B datumuyla aynı unsur olamaz."
                            .to_string(),
                    });
                }
            }
            let _tert_f = find_feature(tert.feature_id)?;
            locked_dof += 1; // Kalan son Tx kilitlenir
        }

        if locked_dof < 6 {
            return Err(AstError::UnderconstrainedDatumFrame { rank: locked_dof });
        }

        Ok(locked_dof)
    }
}
