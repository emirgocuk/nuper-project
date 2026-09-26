use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum AstError {
    #[error("Geçersiz geometrik unsur (#{feature_id}): {reason}")]
    InvalidFeature {
        feature_id: u32,
        reason: String,
    },

    #[error("Normal vektörü sıfır olamaz veya birim uzunlukta olmalıdır (#{feature_id}): uzunluk = {length}")]
    InvalidNormalVector {
        feature_id: u32,
        length: f64,
    },

    #[error("Silindirik unsur çapı sıfır veya negatif olamaz (#{feature_id}): çap = {diameter}")]
    InvalidDiameter {
        feature_id: u32,
        diameter: f64,
    },

    #[error("Eksik veya tutarsız Datum Çerçevesi: {reason}")]
    IncompleteDatumFrame {
        reason: String,
    },

    #[error("Yetersiz serbestlik derecesi (6-DoF Rank = {rank} < 6). Koordinat sistemi uzayda kilitlenemedi.")]
    UnderconstrainedDatumFrame {
        rank: usize,
    },

    #[error("Tolerans atanmış geometrik unsur bulunamadı: Feature ID #{feature_id}")]
    FeatureNotFound {
        feature_id: u32,
    },

    #[error("Geçersiz tolerans kısıtı: {0}")]
    InvalidTolerance(String),

    #[error("Serileştirme / Deserileştirme hatası: {0}")]
    SerializationError(String),
}
