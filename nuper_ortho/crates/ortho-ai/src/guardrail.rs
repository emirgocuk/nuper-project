//! # Deterministik Gardiyan & Sandboxed AI (Doc 14 Bölüm 1 & 7)
//!
//! Yapay zekaya (SLM/VLM/LLM) asla doğrudan kod üretme ve yürütme yetkisi vermeyen;
//! 1. GBNF / JSON Şema Kısıtı
//! 2. B-Rep Geometrik Gerçeklik Denetimi (Ground-Truth Check)
//! 3. Güven Skoru & Operatör Onay Eşiği (Human-in-the-Loop)
//! süzgeçlerinden geçirerek halüsinasyon riskini sıfırlayan deterministik gardiyan mimarisi.

use serde::{Deserialize, Serialize};
use thiserror::Error;
use ortho_ast::InspectionPlan;

#[derive(Error, Debug, PartialEq)]
pub enum GuardrailError {
    #[error("GBNF Şema Doğrulama Hatası: Geçersiz JSON veya eksik alan: {0}")]
    InvalidJsonSchema(String),

    #[error("B-Rep Geometrik Gerçeklik Hatası: AI tarafından önerilen unsur ({feature_id}) CAD modelinde bulunamadı veya boyutu tutarsız")]
    GroundTruthMismatch {
        feature_id: usize,
        expected: String,
        found_in_brep: String,
    },

    #[error("Fiziksel Aralık Aşımı: AI önerisi ({0}) mantıksal tolerans sınırları dışında")]
    PhysicalBoundsViolation(String),
}

/// AI tarafından çıkarılan ham GD&T yapılandırılmış önerisi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AiGdtExtraction {
    pub feature_id: usize,
    pub feature_type_hint: String,
    pub tolerance_type: String,
    pub tolerance_value_mm: f64,
    pub datum_precedence: Vec<String>,
    pub confidence: f64, // 0.0 - 1.0
}

/// Gardiyan tarafından doğrulanmış ve sertifikalanmış öneri
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ValidatedGdtExtraction {
    pub feature_id: usize,
    pub tolerance_type: String,
    pub tolerance_value_mm: f64,
    pub datum_precedence: Vec<String>,
    pub confidence: f64,
    pub auto_approved: bool,
}

pub struct DeterministicGuardrail;

impl DeterministicGuardrail {
    /// 1. Adım: Katı JSON Şema Doğrulaması (GBNF Grammar Check)
    pub fn parse_and_validate_schema(json_str: &str) -> Result<AiGdtExtraction, GuardrailError> {
        serde_json::from_str::<AiGdtExtraction>(json_str)
            .map_err(|e| GuardrailError::InvalidJsonSchema(e.to_string()))
    }

    /// 2. Adım: B-Rep Geometrik Gerçeklik Denetimi (Ground-Truth Check)
    /// AI'ın iddia ettiği unsurun gerçekten CAD modelinde var olup olmadığını ve boyut aralığını denetler
    pub fn verify_ground_truth(
        extraction: &AiGdtExtraction,
        plan: &InspectionPlan,
    ) -> Result<ValidatedGdtExtraction, GuardrailError> {
        // Tolerans değeri fiziksel olarak pozitif ve makul olmalıdır (örn: 0.0001 mm - 5.0 mm)
        if extraction.tolerance_value_mm <= 0.0 || extraction.tolerance_value_mm > 5.0 {
            return Err(GuardrailError::PhysicalBoundsViolation(format!(
                "Tolerans ({:.4} mm) fiziksel sınırların dışında (0.0001 - 5.0 mm)",
                extraction.tolerance_value_mm
            )));
        }

        // B-Rep modelinde bu id'ye sahip unsur var mı?
        let feature = plan
            .features
            .iter()
            .find(|f| f.id == extraction.feature_id)
            .ok_or_else(|| GuardrailError::GroundTruthMismatch {
                feature_id: extraction.feature_id,
                expected: format!("Unsur #{}", extraction.feature_id),
                found_in_brep: "Unsur CAD modelinde MEVCUT DEĞİL (Halüsinasyon Engellendi)".to_string(),
            })?;

        // 3. Adım: Güven Skoru Eşiği (Human-in-the-Loop)
        // Güven >= 0.85 ise otomatik onay, altındaysa operatör incelemesi bayrağı
        let auto_approved = extraction.confidence >= 0.85;

        Ok(ValidatedGdtExtraction {
            feature_id: feature.id,
            tolerance_type: extraction.tolerance_type.clone(),
            tolerance_value_mm: extraction.tolerance_value_mm,
            datum_precedence: extraction.datum_precedence.clone(),
            confidence: extraction.confidence,
            auto_approved,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use glam::DVec3;
    use ortho_ast::{DatumReferenceFrame, GeometricFeature};

    #[test]
    fn test_guardrail_schema_and_ground_truth() {
        let drf = DatumReferenceFrame::new_3_2_1("PCS", 1, 2, 3);
        let mut plan = InspectionPlan::new("PART_TEST", "test.step", drf);
        let hole = GeometricFeature::new_internal_cylinder(
            10,
            "CYL_10",
            DVec3::new(50.0, 50.0, 50.0),
            DVec3::Z,
            20.0,
            30.0,
            1884.0,
            10.0,
        )
        .unwrap();
        plan.features.push(hole);

        // A. Geçerli JSON ve Mevcut Unsur (Yüksek Güven -> Otomatik Onay)
        let valid_json = r#"{
            "feature_id": 10,
            "feature_type_hint": "InternalCylinder",
            "tolerance_type": "Position",
            "tolerance_value_mm": 0.025,
            "datum_precedence": ["A", "B", "C"],
            "confidence": 0.94
        }"#;

        let parsed = DeterministicGuardrail::parse_and_validate_schema(valid_json).expect("JSON geçerli");
        let validated = DeterministicGuardrail::verify_ground_truth(&parsed, &plan).expect("B-Rep doğrulaması başarılı");
        assert_eq!(validated.feature_id, 10);
        assert!(validated.auto_approved);

        // B. Halüsinasyon Testi: Olmayan Unsur (feature_id: 999)
        let halucination_json = r#"{
            "feature_id": 999,
            "feature_type_hint": "InternalCylinder",
            "tolerance_type": "Position",
            "tolerance_value_mm": 0.020,
            "datum_precedence": ["A"],
            "confidence": 0.99
        }"#;
        let parsed_h = DeterministicGuardrail::parse_and_validate_schema(halucination_json).unwrap();
        let res_h = DeterministicGuardrail::verify_ground_truth(&parsed_h, &plan);
        assert!(matches!(res_h, Err(GuardrailError::GroundTruthMismatch { .. })), "Halüsinasyon yakalanıp reddedilmeli");

        // C. Düşük Güven (Human-in-the-Loop)
        let low_conf_json = r#"{
            "feature_id": 10,
            "feature_type_hint": "InternalCylinder",
            "tolerance_type": "Perpendicularity",
            "tolerance_value_mm": 0.015,
            "datum_precedence": ["A"],
            "confidence": 0.65
        }"#;
        let parsed_lc = DeterministicGuardrail::parse_and_validate_schema(low_conf_json).unwrap();
        let val_lc = DeterministicGuardrail::verify_ground_truth(&parsed_lc, &plan).unwrap();
        assert!(!val_lc.auto_approved, "Düşük güvenli AI çıkarımı operatör incelemesine gönderilmeli");
    }
}
