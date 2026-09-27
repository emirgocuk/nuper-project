use glam::DVec3;
use ortho_ast::{
    CompoundHoleFeature, ConcentricityEvaluation, GeometricFeature, SetupSheetGaugeReport,
    ThreadBypassStrategy,
};
use serde::{Deserialize, Serialize};

use crate::ph10::{AngleSelectionResult, PH10Angle, PH10LookUpTable};
use crate::sampling::{
    sample_annular_step_face, sample_cone_flank, sample_countersink_chamfer_for_center,
    sample_cylinder_2level, sample_external_cylinder, sample_freeform_feature_grid,
    sample_plane_grid, sample_sphere, sample_thread_locator_pin, SamplingPoint,
};
use crate::tree::ProbeStack;

/// Tekil bir unsurun kafa oryantasyonu ve temas noktalarıyla planlanmış teftişi (Doc 03 Section 4)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct OrientedFeatureInspection {
    pub feature_id: u32,
    pub feature_name: String,
    /// Seçilen prob açısı
    pub probe_angle: PH10Angle,
    /// Kafa pivotuna göre bilye ucu ofseti (mm)
    pub tip_offset: DVec3,
    /// Temas noktaları ve yaklaşma vektörleri (baypas durumunda boştur)
    pub contact_points: Vec<SamplingPoint>,
    /// Açı seçimi analizi (Kalibre edilmiş mi, hata payı nedir)
    pub angle_result: AngleSelectionResult,
    /// Pre-travel ve esneme kompanzasyon ofseti (µm)
    pub estimated_deflection_um: f64,
    /// Unsur vida dişi içerdiği için prob teması baypas edildi mi?
    pub is_bypassed_threaded_hole: bool,
    /// Baypas sebebi veya kural açıklaması
    pub bypass_reason: Option<String>,
    /// Varsa vida dişi ölçü çağrısı (ör. "M8x1.25 - 6H")
    pub thread_callout: Option<String>,
}

/// Kademeli deliklerin (Fatura + Havşa + Delik) hiyerarşik teftiş planı
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CompoundFeatureInspection {
    pub compound_id: u32,
    pub compound_name: String,
    /// Varsa fatura silindiri teftişi
    pub counterbore_inspection: Option<OrientedFeatureInspection>,
    /// Varsa havşa konisi teftişi
    pub countersink_inspection: Option<OrientedFeatureInspection>,
    /// Varsa fatura oturma taban düzlemi teftişi
    pub step_face_inspection: Option<OrientedFeatureInspection>,
    /// Ana delik silindiri teftişi (vida dişi ise baypas edilir)
    pub main_bore_inspection: OrientedFeatureInspection,
    /// Eşmerkezlilik (Coaxiality) değerlendirmesi
    pub concentricity_eval: Option<ConcentricityEvaluation>,
    /// Vida dişi sebebiyle CMM baypası uygulandı mı?
    pub is_thread_bypassed: bool,
    /// Operatör mastar föyü notu
    pub operator_gauge_note: Option<String>,
}

/// Tüm parçanın kafa açıları ve ayrık temas noktalarıyla yönlendirilmiş teftiş planı
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrientedSamplingPlan {
    pub part_id: String,
    pub targets: Vec<OrientedFeatureInspection>,
    pub compound_targets: Vec<CompoundFeatureInspection>,
    pub distinct_angles: Vec<PH10Angle>,
    pub total_contact_points: usize,
    pub setup_sheet_report: SetupSheetGaugeReport,
}

impl OrientedSamplingPlan {
    /// B-Rep/AST unsurlarını ve prob donanımını alarak yönlendirilmiş örnekleme planını otomatik kurar
    pub fn build(
        part_id: impl Into<String>,
        features: &[GeometricFeature],
        probe_stack: &ProbeStack,
        lut: &PH10LookUpTable,
        qualified_angles: &[PH10Angle],
    ) -> Self {
        Self::build_with_compounds(part_id, features, &[], probe_stack, lut, qualified_angles)
    }

    /// Kademeli delikleri ve standart unsurları birlikte işleyen tam teftiş planlayıcısı
    pub fn build_with_compounds(
        part_id: impl Into<String>,
        features: &[GeometricFeature],
        compound_holes: &[CompoundHoleFeature],
        probe_stack: &ProbeStack,
        lut: &PH10LookUpTable,
        qualified_angles: &[PH10Angle],
    ) -> Self {
        let mut targets = Vec::new();
        let mut compound_targets = Vec::new();
        let mut distinct_angles: Vec<PH10Angle> = Vec::new();
        let mut total_points = 0;
        let mut setup_sheet_report = SetupSheetGaugeReport::new();

        // Kademeli deliklere atanmış tekil unsur kimlikleri
        let mut compound_handled_ids = std::collections::HashSet::new();

        // 1. Kademeli Delikleri (Compound Holes) Planla
        for ch in compound_holes {
            let approach = -ch.common_axis.normalize();
            let angle_res = lut.solve_optimal_angle(approach, qualified_angles, 5.0);
            let angle = angle_res.selected_angle;

            if !distinct_angles.iter().any(|a| {
                (a.a_deg - angle.a_deg).abs() < 1e-3 && (a.b_deg - angle.b_deg).abs() < 1e-3
            }) {
                distinct_angles.push(angle);
            }

            let tip_offset = probe_stack.compute_tip_offset(angle.a_deg, angle.b_deg);
            let deflection_um = probe_stack.compute_stem_deflection_um();

            // Fatura Silindiri
            let mut cb_insp = None;
            if let Some(cb) = &ch.counterbore {
                compound_handled_ids.insert(cb.feature_id);
                let pts = sample_cylinder_2level(cb.centroid, ch.common_axis, cb.diameter, cb.depth);
                total_points += pts.len();
                cb_insp = Some(OrientedFeatureInspection {
                    feature_id: cb.feature_id,
                    feature_name: format!("{}_CBORE", ch.name),
                    probe_angle: angle,
                    tip_offset,
                    contact_points: pts,
                    angle_result: angle_res.clone(),
                    estimated_deflection_um: deflection_um,
                    is_bypassed_threaded_hole: false,
                    bypass_reason: None,
                    thread_callout: None,
                });
            }

            // Taban Oturma Düzlemi (Step Face)
            let mut step_insp = None;
            if let Some(step) = &ch.step_face {
                compound_handled_ids.insert(step.feature_id);
                let inner_r = ch.main_bore.diameter / 2.0;
                let outer_r = ch.counterbore.as_ref().map(|c| c.diameter / 2.0).unwrap_or(inner_r + 5.0);
                let pts = sample_annular_step_face(step.centroid, step.normal, inner_r, outer_r);
                total_points += pts.len();
                step_insp = Some(OrientedFeatureInspection {
                    feature_id: step.feature_id,
                    feature_name: format!("{}_STEP_FACE", ch.name),
                    probe_angle: angle,
                    tip_offset,
                    contact_points: pts,
                    angle_result: angle_res.clone(),
                    estimated_deflection_um: deflection_um,
                    is_bypassed_threaded_hole: false,
                    bypass_reason: None,
                    thread_callout: None,
                });
            }

            // Giriş Havşası (Countersink)
            let mut cs_insp = None;
            if let Some(cs) = &ch.countersink {
                compound_handled_ids.insert(cs.feature_id);
                let pts = sample_countersink_chamfer_for_center(
                    cs.centroid,
                    ch.common_axis,
                    cs.entry_diameter,
                    cs.half_angle_rad,
                    cs.depth,
                );
                total_points += pts.len();
                cs_insp = Some(OrientedFeatureInspection {
                    feature_id: cs.feature_id,
                    feature_name: format!("{}_CSINK", ch.name),
                    probe_angle: angle,
                    tip_offset,
                    contact_points: pts,
                    angle_result: angle_res.clone(),
                    estimated_deflection_um: deflection_um,
                    is_bypassed_threaded_hole: false,
                    bypass_reason: None,
                    thread_callout: None,
                });
            }

            // Ana Delik (Main Bore) — Vida dişi emniyet kontrolü
            compound_handled_ids.insert(ch.main_bore.feature_id);
            let (mb_pts, is_bypassed, bypass_reason, thread_callout, operator_note) =
                if let Some(spec) = &ch.thread_spec {
                    setup_sheet_report.add_item(spec.to_gauge_item(ch.main_bore.feature_id, &ch.name));
                    match spec.bypass_strategy {
                        ThreadBypassStrategy::BypassAndGaugeSheet => (
                            Vec::new(), // SIFIR temas noktası (vida dişi baypası)
                            true,
                            Some("ISO 1502 vida dişi baypası: Yakut bilye helis arasına sokulmaz.".to_string()),
                            Some(format!("Mastar: {}", spec.nominal_major_diameter)),
                            Some("CMM probu baypas edildi; Go/No-Go tampon mastar kullanınız.".to_string()),
                        ),
                        ThreadBypassStrategy::CountersinkCenterOnly => {
                            // Havşa üzerinden merkez alınıyor, deliğe girilmiyor
                            (
                                Vec::new(),
                                true,
                                Some("Giriş havşasından konum teyit edildi; helise girilmedi.".to_string()),
                                Some(format!("Mastar: {}", spec.nominal_major_diameter)),
                                Some("Havşa merkezi doğrulandı; diş adımı mastarla kontrol edilmeli.".to_string()),
                            )
                        }
                        ThreadBypassStrategy::ThreadLocatorPin => {
                            let pin_pts = sample_thread_locator_pin(
                                ch.entry_point,
                                ch.common_axis,
                                spec.nominal_major_diameter,
                                15.0,
                            );
                            total_points += pin_pts.len();
                            (
                                pin_pts,
                                false,
                                None,
                                Some("Diş Adaptör Pimi".to_string()),
                                Some("Operatör deliğe diş adaptör pimi takmalıdır.".to_string()),
                            )
                        }
                    }
                } else {
                    let pts = sample_cylinder_2level(
                        ch.main_bore.centroid,
                        ch.common_axis,
                        ch.main_bore.diameter,
                        ch.main_bore.depth,
                    );
                    total_points += pts.len();
                    (pts, false, None, None, None)
                };

            let main_bore_inspection = OrientedFeatureInspection {
                feature_id: ch.main_bore.feature_id,
                feature_name: format!("{}_MAIN_BORE", ch.name),
                probe_angle: angle,
                tip_offset,
                contact_points: mb_pts,
                angle_result: angle_res,
                estimated_deflection_um: deflection_um,
                is_bypassed_threaded_hole: is_bypassed,
                bypass_reason,
                thread_callout,
            };

            let conc_eval = ch.evaluate_concentricity();

            compound_targets.push(CompoundFeatureInspection {
                compound_id: ch.id,
                compound_name: ch.name.clone(),
                counterbore_inspection: cb_insp,
                countersink_inspection: cs_insp,
                step_face_inspection: step_insp,
                main_bore_inspection,
                concentricity_eval: conc_eval,
                is_thread_bypassed: is_bypassed,
                operator_gauge_note: operator_note,
            });
        }

        // 2. Kademeli deliklere girmeyen tekil standart unsurları planla
        for feat in features {
            if compound_handled_ids.contains(&feat.id) {
                continue;
            }

            let approach = feat.approach_vector();
            let angle_res = lut.solve_optimal_angle(approach, qualified_angles, 5.0);
            let angle = angle_res.selected_angle;

            if !distinct_angles.iter().any(|a| {
                (a.a_deg - angle.a_deg).abs() < 1e-3 && (a.b_deg - angle.b_deg).abs() < 1e-3
            }) {
                distinct_angles.push(angle);
            }

            let tip_offset = probe_stack.compute_tip_offset(angle.a_deg, angle.b_deg);
            let deflection_um = probe_stack.compute_stem_deflection_um();

            // Vida dişi kontrolü
            let (contact_points, is_bypassed, bypass_reason, thread_callout) = if feat.is_threaded {
                if let Some(spec) = &feat.thread_spec {
                    setup_sheet_report.add_item(spec.to_gauge_item(feat.id, &feat.name));
                    match spec.bypass_strategy {
                        ThreadBypassStrategy::BypassAndGaugeSheet => (
                            Vec::new(), // SIFIR temas noktası (diş baypası)
                            true,
                            Some("ISO 1502 Vida dişi baypası: Prob helise temas ettirilmez; Setup Sheet mastar listesine eklendi.".to_string()),
                            Some(format!("Mastar (Major D: {:.1}mm)", spec.nominal_major_diameter)),
                        ),
                        ThreadBypassStrategy::CountersinkCenterOnly => {
                            let d = feat.diameter.unwrap_or(10.0);
                            let pts = sample_countersink_chamfer_for_center(
                                feat.centroid,
                                feat.axis_vector.unwrap_or(DVec3::Z),
                                d + 2.0,
                                std::f64::consts::FRAC_PI_4,
                                2.0,
                            );
                            (
                                pts,
                                true,
                                Some("Giriş havşasından merkez teyidi yapıldı.".to_string()),
                                Some("Havşa Merkezleme".to_string()),
                            )
                        }
                        ThreadBypassStrategy::ThreadLocatorPin => {
                            let d = feat.diameter.unwrap_or(10.0);
                            let pts = sample_thread_locator_pin(
                                feat.centroid,
                                feat.axis_vector.unwrap_or(DVec3::Z),
                                d,
                                15.0,
                            );
                            (pts, false, None, Some("Mastar Pimi".to_string()))
                        }
                    }
                } else {
                    // Vida dişi bayrağı var ama spec yoksa yine de güvenli baypas
                    (
                        Vec::new(),
                        true,
                        Some("Bilinmeyen vida dişi: Yakut bilye güvenliği için baypas edildi.".to_string()),
                        None,
                    )
                }
            } else {
                let pts = match feat.feature_type {
                    ortho_ast::FeatureType::Plane => {
                        let half_span = (feat.area.sqrt() / 2.0).clamp(5.0, 30.0);
                        sample_plane_grid(feat.centroid, feat.normal_vector, half_span)
                    }
                    ortho_ast::FeatureType::InternalCylinder => {
                        let d = feat.diameter.unwrap_or(20.0);
                        let l = feat.depth_or_length.unwrap_or(30.0);
                        let axis = feat.axis_vector.unwrap_or(DVec3::Z);
                        sample_cylinder_2level(feat.centroid, axis, d, l)
                    }
                    ortho_ast::FeatureType::ExternalCylinder => {
                        let d = feat.diameter.unwrap_or(20.0);
                        let l = feat.depth_or_length.unwrap_or(20.0);
                        let axis = feat.axis_vector.unwrap_or(DVec3::Z);
                        sample_external_cylinder(feat.centroid, axis, d, l)
                    }
                    ortho_ast::FeatureType::Cone => {
                        let d = feat.diameter.unwrap_or(20.0);
                        let angle_rad = feat.cone_half_angle_rad.unwrap_or(45.0_f64.to_radians());
                        let l = feat.depth_or_length.unwrap_or(15.0);
                        let axis = feat.axis_vector.unwrap_or(DVec3::Z);
                        sample_cone_flank(feat.centroid, axis, d, angle_rad, l)
                    }
                    ortho_ast::FeatureType::Sphere => {
                        let r = feat.diameter.unwrap_or(25.0) / 2.0;
                        sample_sphere(feat.centroid, r)
                    }
                    ortho_ast::FeatureType::FreeformBSpline => {
                        sample_freeform_feature_grid(
                            feat.centroid,
                            feat.normal_vector,
                            feat.area,
                            &feat.boundary_polygon,
                            4,
                            4,
                        )
                    }
                    _ => {
                        vec![SamplingPoint::new(feat.centroid, feat.normal_vector)]
                    }
                };
                (pts, false, None, None)
            };

            total_points += contact_points.len();

            targets.push(OrientedFeatureInspection {
                feature_id: feat.id,
                feature_name: feat.name.clone(),
                probe_angle: angle,
                tip_offset,
                contact_points,
                angle_result: angle_res,
                estimated_deflection_um: deflection_um,
                is_bypassed_threaded_hole: is_bypassed,
                bypass_reason,
                thread_callout,
            });
        }

        Self {
            part_id: part_id.into(),
            targets,
            compound_targets,
            distinct_angles,
            total_contact_points: total_points,
            setup_sheet_report,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ortho_ast::{BoreSegment, CounterborePocket, ThreadSpecification};

    #[test]
    fn test_oriented_sampling_plan_generation() {
        let plane = GeometricFeature::new_plane(
            1,
            "TOP_FACE",
            DVec3::new(0.0, 0.0, 50.0),
            DVec3::Z,
            5000.0,
            20.0,
        )
        .unwrap();

        let bore = GeometricFeature::new_internal_cylinder(
            2,
            "BORE_20",
            DVec3::new(25.0, 25.0, 50.0),
            DVec3::Z,
            20.0,
            40.0,
            2500.0,
            15.0,
        )
        .unwrap();

        let probe = ProbeStack::default();
        let lut = PH10LookUpTable::new();
        let qualified = vec![PH10Angle::new(0.0, 0.0)];

        let plan = OrientedSamplingPlan::build(
            "TEST_PART",
            &[plane, bore],
            &probe,
            &lut,
            &qualified,
        );

        assert_eq!(plan.targets.len(), 2);
        // Plane (4) + Bore (8) = 12 temas noktası
        assert_eq!(plan.total_contact_points, 12);
        assert!(!plan.distinct_angles.is_empty());
    }

    #[test]
    fn test_threaded_hole_bypass_protects_ruby_ball() {
        let spec_m8 = ThreadSpecification::new_metric_coarse(8.0, 20.0).unwrap();
        let threaded_hole = GeometricFeature::new_tapped_hole(
            10,
            "M8_THREAD_HOLE",
            DVec3::new(50.0, 50.0, 30.0),
            DVec3::Z,
            spec_m8,
            800.0,
            15.0,
        )
        .unwrap();

        let probe = ProbeStack::default();
        let lut = PH10LookUpTable::new();
        let qualified = vec![PH10Angle::new(0.0, 0.0)];

        let plan = OrientedSamplingPlan::build(
            "ENGINE_BLOCK",
            &[threaded_hole],
            &probe,
            &lut,
            &qualified,
        );

        assert_eq!(plan.targets.len(), 1);
        let target = &plan.targets[0];

        // Yakut prob bilyesini korumak için temas noktaları SIFIR olmalıdır!
        assert!(target.is_bypassed_threaded_hole);
        assert_eq!(target.contact_points.len(), 0);
        assert_eq!(plan.total_contact_points, 0);
        assert!(target.bypass_reason.is_some());

        // Setup Sheet mastar tablosuna otomatik kaydedilmiş olmalı
        assert_eq!(plan.setup_sheet_report.len(), 1);
        let gauge_table = plan.setup_sheet_report.format_ascii_table();
        assert!(gauge_table.contains("M8_THREAD_HOLE"));
        assert!(gauge_table.contains("M8x1.25"));
    }

    #[test]
    fn test_compound_stepped_hole_with_concentricity_and_bypass() {
        let spec_m8 = ThreadSpecification::new_metric_coarse(8.0, 20.0).unwrap();
        let compound = CompoundHoleFeature {
            id: 1,
            name: "STEPPED_M8_CBORE".to_string(),
            common_axis: DVec3::Z,
            entry_point: DVec3::new(10.0, 10.0, 50.0),
            counterbore: Some(CounterborePocket {
                feature_id: 201,
                diameter: 16.0,
                depth: 8.0,
                centroid: DVec3::new(10.01, 10.0, 46.0),
                step_face_feature_id: None,
            }),
            countersink: None,
            main_bore: BoreSegment {
                feature_id: 202,
                diameter: 8.0,
                depth: 25.0,
                centroid: DVec3::new(10.0, 10.0, 25.0),
                is_through: true,
            },
            step_face: None,
            thread_spec: Some(spec_m8),
            concentricity_tolerance_mm: Some(0.04),
        };

        let probe = ProbeStack::default();
        let lut = PH10LookUpTable::new();
        let qualified = vec![PH10Angle::new(0.0, 0.0)];

        let plan = OrientedSamplingPlan::build_with_compounds(
            "CYLINDER_HEAD",
            &[],
            &[compound],
            &probe,
            &lut,
            &qualified,
        );

        assert_eq!(plan.compound_targets.len(), 1);
        let ct = &plan.compound_targets[0];

        // Fatura ölçülür (8 nokta)
        assert!(ct.counterbore_inspection.is_some());
        assert_eq!(ct.counterbore_inspection.as_ref().unwrap().contact_points.len(), 8);

        // Ana delik dişli olduğu için baypas edilir (0 nokta)
        assert!(ct.is_thread_bypassed);
        assert_eq!(ct.main_bore_inspection.contact_points.len(), 0);

        // Eşmerkezlilik hesaplanmıştır
        assert!(ct.concentricity_eval.is_some());
        let eval = ct.concentricity_eval.as_ref().unwrap();
        assert!((eval.radial_eccentricity_mm - 0.01).abs() < 1e-4);
        assert!(eval.within_tolerance);
    }
}
