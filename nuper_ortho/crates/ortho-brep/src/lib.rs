//! # ortho-brep
//! 
//! Katman 1: STEP (AP214 / AP242) Ingestion ve OpenCASCADE B-Rep Geometri Çekirdeği.
//! Modelin analitik yüzeylerini, ters normal vektörlerini ve cidar kalınlıklarını çıkarır.
//! 2D PDF teknik resim GD&T eşleme, 4 kademeli yerel AI mimarisi ve kesit görünüş (Section View) motorunu içerir.

pub mod drawing;
pub mod matching;
pub mod pmi;
pub mod multi_body;
pub mod step_parser;
pub mod surface;
pub mod tier;

use std::path::Path;
use glam::DVec3;
use ortho_ast::{AstError, GeometricFeature};
use thiserror::Error;

pub use drawing::{
    AnnotationType, BalloonItem, BoundingBox2D, DrawingImagePreprocessor, DrawingSheet,
    ExtractedAnnotation, SheetType, TitleBlock,
};
pub use matching::{CuttingPlane, DrawingToStepMatcher, FeatureMatch};
pub use multi_body::{MultiBodyFilter, SolidBody};
pub use pmi::{PmiError, StepPmiReader};
pub use step_parser::StepParser;
pub use surface::{
    ClassifierState, ParametricFace, SurfaceCurvature, SurfaceGeometry, SurfaceSamplingCandidate,
};
pub use tier::{HardwareProfile, InferenceTier, Tier1RuleBasedParser};

#[derive(Error, Debug)]
pub enum BRepError {
    #[error("STEP dosyası bulunamadı veya açılamadı: {0}")]
    FileNotFound(String),

    #[error("OpenCASCADE / STEP ayrıştırma hatası: {0}")]
    ParsingError(String),

    #[error("AST dönüşüm hatası: {0}")]
    AstConversion(#[from] AstError),
}

/// STEP ve OpenCASCADE tarafından ayrıştırılmış B-Rep modeli
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

        let mut parser = StepParser::new();
        parser.parse_file(path_ref)?;
        let features = parser.extract_geometric_features()?;

        let mut bbox_min = DVec3::splat(f64::INFINITY);
        let mut bbox_max = DVec3::splat(f64::NEG_INFINITY);

        for feat in &features {
            bbox_min = bbox_min.min(feat.centroid);
            bbox_max = bbox_max.max(feat.centroid);
            for p in &feat.boundary_polygon {
                bbox_min = bbox_min.min(*p);
                bbox_max = bbox_max.max(*p);
            }
        }

        if features.is_empty() {
            bbox_min = DVec3::ZERO;
            bbox_max = DVec3::ZERO;
        }

        Ok(Self {
            file_path: path_str,
            features,
            bounding_box_min: bbox_min,
            bounding_box_max: bbox_max,
        })
    }

    /// Bellekteki bir STEP dizesini okuyarak analitik B-Rep modelini oluşturur
    pub fn from_step_str(content: &str, file_name: impl Into<String>) -> Result<Self, BRepError> {
        let mut parser = StepParser::new();
        parser.parse_str(content)?;
        let features = parser.extract_geometric_features()?;

        let mut bbox_min = DVec3::splat(f64::INFINITY);
        let mut bbox_max = DVec3::splat(f64::NEG_INFINITY);

        for feat in &features {
            bbox_min = bbox_min.min(feat.centroid);
            bbox_max = bbox_max.max(feat.centroid);
            for p in &feat.boundary_polygon {
                bbox_min = bbox_min.min(*p);
                bbox_max = bbox_max.max(*p);
            }
        }

        if features.is_empty() {
            bbox_min = DVec3::ZERO;
            bbox_max = DVec3::ZERO;
        }

        Ok(Self {
            file_path: file_name.into(),
            features,
            bounding_box_min: bbox_min,
            bounding_box_max: bbox_max,
        })
    }

    /// Modele analitik bir unsur ekler
    pub fn add_feature(&mut self, feature: GeometricFeature) {
        self.features.push(feature);
    }

    /// İnce cidarlı unsurları listeler (t < 2.5 mm, Doc 02 Section 5)
    pub fn thin_walled_features(&self) -> Vec<&GeometricFeature> {
        self.features.iter().filter(|f| f.is_thin_walled()).collect()
    }

    /// Datum adayı unsurları listeler
    pub fn datum_candidates(&self) -> Vec<&GeometricFeature> {
        self.features.iter().filter(|f| f.is_datum_candidate).collect()
    }

    /// İsim üzerinden unsuru bulur
    pub fn find_feature_by_name(&self, name: &str) -> Option<&GeometricFeature> {
        self.features.iter().find(|f| f.name == name)
    }

    /// ID üzerinden unsuru bulur
    pub fn find_feature_by_id(&self, id: u32) -> Option<&GeometricFeature> {
        self.features.iter().find(|f| f.id == id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use glam::DVec3;
    use ortho_ast::{DatumLabel, MaterialModifier, ToleranceType};

    #[test]
    fn test_tiered_inference_hardware_selection() {
        let workshop_pc = HardwareProfile::workshop_standard_pc();
        let workstation = HardwareProfile::high_end_workstation();

        // 1. Modelde AP242 PMI varsa donanım ne olursa olsun Tier 0
        assert_eq!(
            workshop_pc.select_optimal_tier(true, false),
            InferenceTier::Tier0StepPmi
        );
        assert_eq!(
            workstation.select_optimal_tier(true, true),
            InferenceTier::Tier0StepPmi
        );

        // 2. Standart temiz çizim + standart PC -> Tier 1 (CPU Kural Tabanlı OCR)
        assert_eq!(
            workshop_pc.select_optimal_tier(false, false),
            InferenceTier::Tier1RuleBasedOcr
        );

        // 3. Çok zorlu/kirli çizim + standart PC (8GB RAM) -> Tier 2 (Kompakt Vision SLM)
        assert_eq!(
            workshop_pc.select_optimal_tier(false, true),
            InferenceTier::Tier2CompactVisionSlm
        );

        // 4. Çok zorlu/kirli çizim + RTX GPU'lu Workstation -> Tier 3 (Qwen2-VL-7B)
        assert_eq!(
            workstation.select_optimal_tier(false, true),
            InferenceTier::Tier3AdvancedVlm
        );
    }

    #[test]
    fn test_tier1_rule_based_parser() {
        // Çap ve miktar ayrıştırma
        let (qty, dia, tol) = Tier1RuleBasedParser::parse_diameter_callout("4x Ø20 H7")
            .expect("Diameter callout should parse");
        assert_eq!(qty, 4);
        assert_eq!(dia, 20.0);
        assert_eq!(tol, 0.021);

        // Feature Control Frame ayrıştırma
        let fcf = Tier1RuleBasedParser::parse_fcf_string(10, "[POS | 0.05(M) | A | B | C]")
            .expect("FCF string should parse");
        assert_eq!(fcf.id, 10);
        assert_eq!(fcf.tolerance_type, ToleranceType::Position);
        assert_eq!(fcf.upper_tolerance, 0.05);
        assert_eq!(fcf.material_modifier, MaterialModifier::MMC);
        assert_eq!(fcf.datum_precedence, vec![DatumLabel::A, DatumLabel::B, DatumLabel::C]);
    }

    #[test]
    fn test_multi_sheet_and_auto_ballooning() {
        let mut sheet1 = DrawingSheet::new_overview(1, 420.0, 297.0); // A3
        sheet1.annotations.push(ExtractedAnnotation {
            id: 101,
            sheet_number: 1,
            raw_text: "Ø20 H7".into(),
            bbox: BoundingBox2D::new(0.2, 0.3, 0.25, 0.35),
            annotation_type: AnnotationType::DiameterDimension {
                nominal_dia: 20.0,
                tolerance_band: 0.021,
                quantity: 1,
            },
            tolerance: None,
            composite_tolerance: None,
            confidence: 0.95,
        });

        sheet1.annotations.push(ExtractedAnnotation {
            id: 102,
            sheet_number: 1,
            raw_text: "[POS | 0.08 | A]".into(),
            bbox: BoundingBox2D::new(0.5, 0.6, 0.6, 0.65),
            annotation_type: AnnotationType::FeatureControlFrame,
            tolerance: None,
            composite_tolerance: None,
            confidence: 0.72, // Düşük güven skoru
        });

        let next_balloon = sheet1.generate_balloons(1);
        assert_eq!(next_balloon, 3);
        assert_eq!(sheet1.balloons.len(), 2);

        // Birinci balon yüksek güven skoruna sahip
        assert_eq!(sheet1.balloons[0].balloon_number, 1);
        assert!(!sheet1.balloons[0].needs_human_confirmation);

        // İkinci balon < 0.80 olduğu için operatör doğrulaması bayrağı taşır
        assert_eq!(sheet1.balloons[1].balloon_number, 2);
        assert!(sheet1.balloons[1].needs_human_confirmation);
    }

    #[test]
    fn test_section_view_cutting_plane_matching() {
        let mut sheet2 = DrawingSheet::new_section_view(
            2,
            "A-A",
            "PLANE_Z45",
            420.0,
            297.0,
        );
        sheet2.annotations.push(ExtractedAnnotation {
            id: 201,
            sheet_number: 2,
            raw_text: "KESIT A-A: Ø15 H7 Derinlik 35 mm".into(),
            bbox: BoundingBox2D::new(0.3, 0.4, 0.4, 0.5),
            annotation_type: AnnotationType::DiameterDimension {
                nominal_dia: 15.0,
                tolerance_band: 0.018,
                quantity: 1,
            },
            tolerance: None,
            composite_tolerance: None,
            confidence: 0.90,
        });

        // 3D STEP'teki delik (Kesit düzlemi Z=45 üzerinde)
        let hole_on_plane = GeometricFeature::new_internal_cylinder(
            15,
            "SECTION_HOLE_15",
            DVec3::new(30.0, 30.0, 45.0),
            DVec3::Z,
            15.0,
            35.0,
            1600.0,
            10.0,
        )
        .unwrap();

        let other_hole = GeometricFeature::new_internal_cylinder(
            16,
            "FAR_HOLE_25",
            DVec3::new(10.0, 10.0, 10.0),
            DVec3::Z,
            25.0,
            10.0,
            500.0,
            5.0,
        )
        .unwrap();

        let cutting_plane = CuttingPlane::new(
            "A-A",
            DVec3::new(0.0, 0.0, 45.0),
            DVec3::Z,
        );

        let mut sheets = vec![sheet2];
        let features = vec![hole_on_plane, other_hole];
        let matches = DrawingToStepMatcher::match_sheets_to_features(
            &mut sheets,
            &features,
            &[cutting_plane],
        );

        assert_eq!(matches.len(), 1);
        assert_eq!(matches[0].feature_id, 15);
        assert_eq!(matches[0].confidence_score, 1.0); // Kesit düzlemi teyitli tam skor
    }

    #[test]
    fn test_step_parser_valve_block_ingestion() {
        let step_path = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../tests/data/valve_block.step");
        let model = BRepModel::from_step_file(&step_path).expect("valve_block.step should parse successfully");

        assert_eq!(model.features.len(), 8);

        // Unsurların varlığını ve tiplerini doğrula
        let bore = model.find_feature_by_name("BORE_25").expect("BORE_25 should exist");
        assert_eq!(bore.diameter, Some(25.0));
        assert_eq!(bore.feature_type, ortho_ast::FeatureType::InternalCylinder);

        let pin = model.find_feature_by_name("PIN_12").expect("PIN_12 should exist");
        assert_eq!(pin.diameter, Some(12.0));
        assert_eq!(pin.feature_type, ortho_ast::FeatureType::ExternalCylinder);

        let cone = model.find_feature_by_name("CONE_32").expect("CONE_32 should exist");
        assert_eq!(cone.diameter, Some(32.0));
        assert_eq!(cone.feature_type, ortho_ast::FeatureType::Cone);

        // Sınır kutusu kontrolü (0..100, 0..80, 0..50)
        assert!(model.bounding_box_min.x <= 0.0);
        assert!(model.bounding_box_max.x >= 100.0);
        assert!(model.bounding_box_max.y >= 80.0);
        assert!(model.bounding_box_max.z >= 50.0);

        // Datum adayları kontrolü
        let datums = model.datum_candidates();
        assert!(datums.len() >= 4); // Düzlemler ve delikler datum adayıdır
    }

    #[test]
    fn test_step_parser_thin_wall_analysis() {
        let step_path = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../tests/data/valve_block.step");
        let model = BRepModel::from_step_file(&step_path).expect("valve_block.step should parse");

        let thin_walls = model.thin_walled_features();
        // X=0 ve X=2.0 karşıt yüzeyleri 2.0 mm cidar kalınlığına sahiptir (< 2.5 mm eşiği)
        assert!(
            thin_walls.iter().any(|f| (f.min_wall_thickness - 2.0).abs() < 1e-3 && f.is_thin_walled()),
            "At least one feature must have 2.0 mm thin wall detected"
        );
    }
}
