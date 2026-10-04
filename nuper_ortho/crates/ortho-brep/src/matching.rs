use glam::DVec3;
use ortho_ast::{FeatureType, GeometricFeature, InspectionPlan, ToleranceConstraint};
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

    /// Bu kesit düzlemi üzerinde yer alan tüm unsurları filtreler
    pub fn find_intersecting_features<'a>(
        &self,
        features: &'a [GeometricFeature],
        tolerance_mm: f64,
    ) -> Vec<&'a GeometricFeature> {
        features
            .iter()
            .filter(|f| self.contains_feature(f, tolerance_mm))
            .collect()
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
        let mut assigned_feature_ids = std::collections::HashSet::new();

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
                    if assigned_feature_ids.contains(&feat.id) {
                        continue;
                    }
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
                    assigned_feature_ids.insert(feat_id);
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

    /// Onaylanmış açıklama eşleşmelerini Nötr Teftiş Planına (InspectionPlan) otomatik tolerans olarak uygular
    pub fn apply_matches_to_inspection_plan(
        matches: &[FeatureMatch],
        sheets: &[DrawingSheet],
        plan: &mut InspectionPlan,
    ) {
        let mut next_tol_id = plan.tolerances.len() as u32 + 1;

        for m in matches {
            let ann_opt = sheets
                .iter()
                .flat_map(|s| &s.annotations)
                .find(|a| a.id == m.annotation_id);

            if let Some(ann) = ann_opt {
                if let Some(mut tol) = ann.tolerance.clone() {
                    tol.id = next_tol_id;
                    tol.feature_id = m.feature_id;
                    plan.tolerances.push(tol);
                    next_tol_id += 1;
                } else if let Some(mut comp_tol) = ann.composite_tolerance.clone() {
                    if !comp_tol.feature_ids.contains(&m.feature_id) {
                        comp_tol.feature_ids.push(m.feature_id);
                    }
                    if !plan.composite_tolerances.iter().any(|c| c.id == comp_tol.id) {
                        plan.composite_tolerances.push(comp_tol);
                    }
                } else {
                    match &ann.annotation_type {
                        AnnotationType::DiameterDimension {
                            nominal_dia,
                            tolerance_band,
                            ..
                        } => {
                            let upper = *tolerance_band;
                            let tol = ToleranceConstraint {
                                id: next_tol_id,
                                feature_id: m.feature_id,
                                tolerance_type: ortho_ast::ToleranceType::Diameter,
                                nominal_value: *nominal_dia,
                                upper_tolerance: upper,
                                lower_tolerance: 0.0,
                                datum_precedence: Vec::new(),
                                material_modifier: ortho_ast::MaterialModifier::RFS,
                                recommended_fitting: ortho_ast::FittingAlgorithm::ChebyshevMaximumInscribed,
                                is_composite: false,
                                profile_disposition: None,
                            };
                            plan.tolerances.push(tol);
                            next_tol_id += 1;
                        }
                        _ => {}
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ortho_ast::DatumReferenceFrame;
    use crate::drawing::{BoundingBox2D, DrawingImagePreprocessor};

    #[test]
    fn test_apply_matches_to_plan() {
        let mut sheet = DrawingSheet::new_overview(1, 420.0, 297.0);
        let ann = ExtractedAnnotation {
            id: 101,
            sheet_number: 1,
            raw_text: "Ø25 H7".to_string(),
            bbox: BoundingBox2D::new(0.1, 0.1, 0.2, 0.2),
            annotation_type: AnnotationType::DiameterDimension {
                nominal_dia: 25.0,
                tolerance_band: 0.021,
                quantity: 1,
            },
            tolerance: None,
            composite_tolerance: None,
            confidence: 0.95,
        };
        sheet.annotations.push(ann);

        let hole = GeometricFeature::new_internal_cylinder(
            15,
            "BORE_25",
            DVec3::new(50.0, 50.0, 10.0),
            DVec3::Z,
            25.0,
            30.0,
            2000.0,
            15.0,
        )
        .unwrap();

        let matches = vec![FeatureMatch {
            annotation_id: 101,
            feature_id: 15,
            confidence_score: 0.95,
            rationale: "Tam çap uyumu".to_string(),
        }];

        let drf = DatumReferenceFrame::new_3_2_1("DRF_1", 1, 2, 3);
        let mut plan = InspectionPlan::new("VALVE_BODY", "valve.step", drf);
        plan.features.push(hole);

        DrawingToStepMatcher::apply_matches_to_inspection_plan(&matches, &[sheet], &mut plan);

        assert_eq!(plan.tolerances.len(), 1);
        let tol = &plan.tolerances[0];
        assert_eq!(tol.feature_id, 15);
        assert_eq!(tol.nominal_value, 25.0);
        assert_eq!(tol.upper_tolerance, 0.021);
    }

    #[test]
    fn test_multi_sheet_classification() {
        // Kesit sayfası tespiti
        let s2 = DrawingSheet::classify_from_text(2, "KESİT A-A ÖLÇEK 1:1", 420.0, 297.0);
        match s2.sheet_type {
            SheetType::SectionView { section_label, .. } => {
                assert_eq!(section_label, "A-A");
            }
            _ => panic!("Sheet 2 should be classified as SectionView"),
        }

        // Detay sayfası tespiti
        let s3 = DrawingSheet::classify_from_text(3, "DETAIL B 5:1", 420.0, 297.0);
        match s3.sheet_type {
            SheetType::DetailView { detail_label, scale } => {
                assert_eq!(detail_label, "B");
                assert_eq!(scale, "5:1");
            }
            _ => panic!("Sheet 3 should be classified as DetailView"),
        }
    }

    #[test]
    fn test_rgb_stamp_removal() {
        // 2x2 piksel görüntü: (0,0) Kırmızı Kaşe, (1,1) Siyah çizim çizgisi
        let rgb = vec![
            255, 0, 0,   // Piksel 0: Kırmızı Kaşe
            255, 255, 255, // Piksel 1: Beyaz arka plan
            255, 255, 255, // Piksel 2: Beyaz arka plan
            0, 0, 0,     // Piksel 3: Siyah çizgi
        ];

        let processed = DrawingImagePreprocessor::process_rgb_image(&rgb, 2, 2);
        assert_eq!(processed.len(), 4);
        assert_eq!(processed[0], 255, "Kırmızı kaşe beyaza dönüştürülmeli");
        assert_eq!(processed[3], 0, "Siyah çizim çizgisi siyah kalmalı");
    }
}
