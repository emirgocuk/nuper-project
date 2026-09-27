use glam::DVec3;
use ortho_ast::{FeatureType, GeometricFeature};
use serde::{Deserialize, Serialize};

use crate::drawing::{AnnotationType, DrawingSheet, ExtractedAnnotation, SheetType};

/// 3D STEP modeli üzerinde sanal bir kesme düzlemi (Cutting Plane - gp_Pln)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CuttingPlane {
    pub label: String,
    pub origin: DVec3,
    pub normal: DVec3,
}

impl CuttingPlane {
    pub fn new(label: impl Into<String>, origin: DVec3, normal: DVec3) -> Self {
        Self {
            label: label.into(),
            origin,
            normal: normal.normalize(),
        }
    }

    /// Bir noktanın kesit düzlemine olan dik mesafesini hesaplar
    pub fn distance_to_point(&self, point: DVec3) -> f64 {
        (point - self.origin).dot(self.normal).abs()
    }

    /// Bir geometrik unsurun bu kesit düzlemi üzerinde yer alıp almadığını kontrol eder (tolerans: 2.0 mm)
    pub fn contains_feature(&self, feature: &GeometricFeature, tolerance_mm: f64) -> bool {
        self.distance_to_point(feature.centroid) <= tolerance_mm
    }
}

/// 2D Açıklama ile 3D Geometrik Unsur arasındaki eşleştirme sonucu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FeatureMatch {
    pub annotation_id: u32,
    pub feature_id: u32,
    pub confidence_score: f64,
    pub rationale: String,
}

/// 2D PDF Çizim ile 3D STEP B-Rep Arasındaki Deterministik Eşleştirme Motoru
pub struct DrawingToStepMatcher;

impl DrawingToStepMatcher {
    /// Tekil bir 2D açıklama ile 3D unsur arasındaki uyum skorunu [0.0 .. 1.0] hesaplar
    pub fn calculate_match_score(
        annotation: &ExtractedAnnotation,
        feature: &GeometricFeature,
        active_cutting_plane: Option<&CuttingPlane>,
    ) -> f64 {
        match &annotation.annotation_type {
            AnnotationType::DiameterDimension {
                nominal_dia,
                quantity: _,
                ..
            } => {
                // Sadece silindirik unsurlarla eşleşebilir
                if feature.feature_type != FeatureType::InternalCylinder
                    && feature.feature_type != FeatureType::ExternalCylinder
                {
                    return 0.0;
                }

                let feat_dia = feature.diameter.unwrap_or(0.0);
                let dia_diff = (feat_dia - *nominal_dia).abs();

                // Çap tam uyumlu ise (örneğin fark < 0.05 mm)
                if dia_diff < 0.05 {
                    let mut score = 0.95;
                    // Eğer kesit düzlemi varsa ve delik o düzlem üzerindeyse tam puan
                    if let Some(plane) = active_cutting_plane {
                        if plane.contains_feature(feature, 5.0) {
                            score = 1.0;
                        }
                    }
                    score
                } else if dia_diff < 0.5 {
                    0.65 // Kısmi uyum, onay gerekebilir
                } else {
                    0.0
                }
            }
            AnnotationType::ThreadCallout { thread_name: _, depth_mm } => {
                if !feature.is_threaded && feature.feature_type != FeatureType::InternalCylinder {
                    return 0.0;
                }
                let mut score = 0.85;
                if let Some(d) = feature.depth_or_length {
                    if (d - *depth_mm).abs() < 1.0 {
                        score = 0.98;
                    }
                }
                score
            }
            AnnotationType::FeatureControlFrame | AnnotationType::CompositeControlFrame => {
                // FCF'ler doğrudan yüzey tipine göre eşleşir
                0.75
            }
            _ => 0.0,
        }
    }

    /// Çok sayfalı teknik resim sayfalarındaki açıklamaları 3D STEP unsurlarıyla eşleştirir
    pub fn match_sheets_to_features(
        sheets: &mut [DrawingSheet],
        features: &[GeometricFeature],
        cutting_planes: &[CuttingPlane],
    ) -> Vec<FeatureMatch> {
        let mut matches = Vec::new();

        for sheet in sheets.iter_mut() {
            // Kesit sayfası ise ilgili sanal kesme düzlemini bul
            let active_plane = match &sheet.sheet_type {
                SheetType::SectionView { section_label, .. } => {
                    cutting_planes.iter().find(|p| p.label == *section_label)
                }
                _ => None,
            };

            for ann in &mut sheet.annotations {
                let mut best_match: Option<(u32, f64, String)> = None;

                for feat in features {
                    let score = Self::calculate_match_score(ann, feat, active_plane);
                    if score > 0.50 {
                        if let Some((_, best_score, _)) = best_match {
                            if score > best_score {
                                best_match = Some((
                                    feat.id,
                                    score,
                                    format!("Çap ve geometrik profil uyumu (Skor: {:.2})", score),
                                ));
                            }
                        } else {
                            best_match = Some((
                                feat.id,
                                score,
                                format!("Çap ve geometrik profil uyumu (Skor: {:.2})", score),
                            ));
                        }
                    }
                }

                if let Some((feat_id, score, rationale)) = best_match {
                    ann.confidence = score;

                    // Balon listesinde ilgili balonu güncelle
                    if let Some(balloon) = sheet
                        .balloons
                        .iter_mut()
                        .find(|b| b.annotation_id == ann.id)
                    {
                        balloon.matched_feature_id = Some(feat_id);
                        balloon.confidence_score = score;
                        balloon.needs_human_confirmation = score < 0.80;
                    }

                    matches.push(FeatureMatch {
                        annotation_id: ann.id,
                        feature_id: feat_id,
                        confidence_score: score,
                        rationale,
                    });
                }
            }
        }

        matches
    }
}
