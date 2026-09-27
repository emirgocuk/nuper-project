use glam::DVec3;
use serde::{Deserialize, Serialize};

use crate::feature::{FeatureType, GeometricFeature};
use crate::threads::ThreadSpecification;

/// Fatura Silindiri (Counterbore Pocket)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CounterborePocket {
    pub feature_id: u32,
    pub diameter: f64,
    pub depth: f64,
    pub centroid: DVec3,
    pub step_face_feature_id: Option<u32>,
}

/// Giriş Havşa Konisi (Countersink Chamfer)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CountersinkChamfer {
    pub feature_id: u32,
    pub entry_diameter: f64,
    /// Koni yarı tepe açısı (radyan - örneğin 90° havşa için 45° = PI/4)
    pub half_angle_rad: f64,
    pub depth: f64,
    pub centroid: DVec3,
}

/// Ana Delik Gövdesi (Main Bore Segment)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BoreSegment {
    pub feature_id: u32,
    pub diameter: f64,
    pub depth: f64,
    pub centroid: DVec3,
    pub is_through: bool,
}

/// Fatura Taban / Oturma Düzlemi (Step Face)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StepPlaneFace {
    pub feature_id: u32,
    pub centroid: DVec3,
    pub normal: DVec3,
}

/// Eşmerkezlilik ve Eksen Kaçıklığı Değerlendirme Raporu (ISO 1101 Coaxiality)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ConcentricityEvaluation {
    /// Eksenler arası radyal kaçıklık Δr (mm)
    pub radial_eccentricity_mm: f64,
    /// ISO 1101 Koaksiyellik Çap Hatası (2 * Δr) (mm)
    pub coaxiality_error_mm: f64,
    /// Tanımlı tolerans limiti (mm)
    pub tolerance_limit_mm: f64,
    /// Tolerans dahilinde mi?
    pub within_tolerance: bool,
}

/// Kademeli Delikler (Fatura + Havşa + Delik) ve Bileşik Unsur Ağacı (SteppedFeatureHierarchy)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CompoundHoleFeature {
    pub id: u32,
    pub name: String,
    /// Ortak eksen birim vektörü
    pub common_axis: DVec3,
    /// Parçanın dış yüzeyindeki delik giriş merkezi
    pub entry_point: DVec3,
    /// Varsa giriş faturası (Counterbore)
    pub counterbore: Option<CounterborePocket>,
    /// Varsa giriş havşası (Countersink)
    pub countersink: Option<CountersinkChamfer>,
    /// Ana delik gövdesi (Main Bore)
    pub main_bore: BoreSegment,
    /// Varsa fatura oturma taban düzlemi (Step Face)
    pub step_face: Option<StepPlaneFace>,
    /// Varsa vida dişi teknik spesifikasyonu
    pub thread_spec: Option<ThreadSpecification>,
    /// Eşmerkezlilik (Coaxiality) toleransı (mm)
    pub concentricity_tolerance_mm: Option<f64>,
}

impl CompoundHoleFeature {
    /// Basit düz bir delikten bileşik unsur oluşturur
    pub fn new_simple_bore(
        id: u32,
        name: impl Into<String>,
        feature_id: u32,
        diameter: f64,
        depth: f64,
        centroid: DVec3,
        axis: DVec3,
        entry: DVec3,
    ) -> Self {
        Self {
            id,
            name: name.into(),
            common_axis: axis.normalize(),
            entry_point: entry,
            counterbore: None,
            countersink: None,
            main_bore: BoreSegment {
                feature_id,
                diameter,
                depth,
                centroid,
                is_through: true,
            },
            step_face: None,
            thread_spec: None,
            concentricity_tolerance_mm: None,
        }
    }

    /// Fatura ve ana delik arasındaki eşmerkezlilik (Coaxiality) hatasını hesaplar
    pub fn evaluate_concentricity(&self) -> Option<ConcentricityEvaluation> {
        let cb = self.counterbore.as_ref()?;
        let axis = self.common_axis.normalize();

        // Fatura merkezi ile delik merkezi arasındaki 3D vektör
        let delta = cb.centroid - self.main_bore.centroid;

        // Eksen doğrultusundaki bileşeni çıkararak eksene dik radyal kaçıklığı bul:
        // delta_radial = delta - (delta . axis) * axis
        let axial_proj = delta.dot(axis);
        let radial_vec = delta - axis * axial_proj;
        let radial_eccentricity_mm = radial_vec.length();
        let coaxiality_error_mm = 2.0 * radial_eccentricity_mm;

        let tol = self.concentricity_tolerance_mm.unwrap_or(0.05);
        let within_tolerance = coaxiality_error_mm <= tol;

        Some(ConcentricityEvaluation {
            radial_eccentricity_mm,
            coaxiality_error_mm,
            tolerance_limit_mm: tol,
            within_tolerance,
        })
    }

    /// Tüm kademenin toplam derinliğini hesaplar
    pub fn total_stepped_depth(&self) -> f64 {
        let mut depth = self.main_bore.depth;
        if let Some(cb) = &self.counterbore {
            depth += cb.depth;
        }
        if let Some(cs) = &self.countersink {
            depth += cs.depth;
        }
        depth
    }

    /// Probun teftişe başlarken yaklaşacağı en dış emniyetli giriş konumu
    pub fn safe_approach_entry(&self) -> DVec3 {
        self.entry_point
    }
}

/// Modeldeki geometrik unsurları tarayarak koaksiyel silindir ve konileri kademeli cepler olarak kümeleyen otonom dedektör
pub fn detect_compound_holes(features: &[GeometricFeature]) -> Vec<CompoundHoleFeature> {
    let mut compound_holes = Vec::new();
    let mut assigned_feature_ids = std::collections::HashSet::new();

    // 1. İç silindirleri (Bore ve Counterbore adayları) filtrele
    let cylinders: Vec<&GeometricFeature> = features
        .iter()
        .filter(|f| f.feature_type == FeatureType::InternalCylinder && f.axis_vector.is_some())
        .collect();

    let cones: Vec<&GeometricFeature> = features
        .iter()
        .filter(|f| f.feature_type == FeatureType::Cone && f.axis_vector.is_some())
        .collect();

    let planes: Vec<&GeometricFeature> = features
        .iter()
        .filter(|f| f.feature_type == FeatureType::Plane)
        .collect();

    let mut hole_counter = 1u32;

    for i in 0..cylinders.len() {
        let cyl1 = cylinders[i];
        if assigned_feature_ids.contains(&cyl1.id) {
            continue;
        }

        let axis1 = cyl1.axis_vector.unwrap().normalize();
        let center1 = cyl1.centroid;
        let d1 = cyl1.diameter.unwrap_or(10.0);

        // Bu silindirle aynı ekseni paylaşan koaksiyel diğer silindirleri ara
        let mut coaxial_cylinders = vec![cyl1];

        for j in (i + 1)..cylinders.len() {
            let cyl2 = cylinders[j];
            if assigned_feature_ids.contains(&cyl2.id) {
                continue;
            }

            let axis2 = cyl2.axis_vector.unwrap().normalize();
            let axis_dot = axis1.dot(axis2).abs();

            if axis_dot > 0.999 {
                // Eksen doğrultuları paralel. Şimdi merkezlerin eksen doğrusu üzerindeki kaçıklığına bak:
                let delta = cyl2.centroid - center1;
                let cross = delta.cross(axis1).length();
                if cross < 0.5 {
                    // Merkezler aynı eksen çizgisi üzerinde!
                    coaxial_cylinders.push(cyl2);
                }
            }
        }

        // Koaksiyel konileri (Countersink adayları) ara
        let mut coaxial_cone: Option<&GeometricFeature> = None;
        for cone in &cones {
            if assigned_feature_ids.contains(&cone.id) {
                continue;
            }
            let cone_axis = cone.axis_vector.unwrap().normalize();
            if axis1.dot(cone_axis).abs() > 0.995 {
                let delta = cone.centroid - center1;
                if delta.cross(axis1).length() < 0.8 {
                    coaxial_cone = Some(cone);
                    break;
                }
            }
        }

        // Eğer birden fazla silindir varsa, çapı büyük olan Counterbore, küçük olan Main Bore'dur.
        if coaxial_cylinders.len() >= 2 {
            coaxial_cylinders.sort_by(|a, b| {
                b.diameter
                    .unwrap_or(0.0)
                    .partial_cmp(&a.diameter.unwrap_or(0.0))
                    .unwrap()
            });

            let cb_feat = coaxial_cylinders[0];
            let mb_feat = coaxial_cylinders[1];

            assigned_feature_ids.insert(cb_feat.id);
            assigned_feature_ids.insert(mb_feat.id);

            let counterbore = CounterborePocket {
                feature_id: cb_feat.id,
                diameter: cb_feat.diameter.unwrap_or(20.0),
                depth: cb_feat.depth_or_length.unwrap_or(10.0),
                centroid: cb_feat.centroid,
                step_face_feature_id: None,
            };

            let main_bore = BoreSegment {
                feature_id: mb_feat.id,
                diameter: mb_feat.diameter.unwrap_or(10.0),
                depth: mb_feat.depth_or_length.unwrap_or(25.0),
                centroid: mb_feat.centroid,
                is_through: true,
            };

            let countersink = if let Some(c) = coaxial_cone {
                assigned_feature_ids.insert(c.id);
                Some(CountersinkChamfer {
                    feature_id: c.id,
                    entry_diameter: c.diameter.unwrap_or(cb_feat.diameter.unwrap_or(20.0) + 2.0),
                    half_angle_rad: c.cone_half_angle_rad.unwrap_or(std::f64::consts::FRAC_PI_4),
                    depth: c.depth_or_length.unwrap_or(2.0),
                    centroid: c.centroid,
                })
            } else {
                None
            };

            // Fatura oturma basamağı düzlemini ara (cb_feat ile mb_feat arasında, eksene dik düzlem)
            let mut step_face = None;
            for plane in &planes {
                let normal = plane.normal_vector.normalize();
                if normal.dot(axis1).abs() > 0.99 {
                    let d = (plane.centroid - cb_feat.centroid).length();
                    if d < cb_feat.depth_or_length.unwrap_or(10.0) * 1.5 {
                        step_face = Some(StepPlaneFace {
                            feature_id: plane.id,
                            centroid: plane.centroid,
                            normal: plane.normal_vector,
                        });
                        break;
                    }
                }
            }

            let entry_point = cb_feat.centroid + axis1 * (cb_feat.depth_or_length.unwrap_or(5.0) / 2.0);

            compound_holes.push(CompoundHoleFeature {
                id: hole_counter,
                name: format!("C'BORE_HOLE_{:02}", hole_counter),
                common_axis: axis1,
                entry_point,
                counterbore: Some(counterbore),
                countersink,
                main_bore,
                step_face,
                thread_spec: mb_feat.thread_spec.clone(),
                concentricity_tolerance_mm: Some(0.05),
            });
            hole_counter += 1;
        } else if let Some(c) = coaxial_cone {
            // Fatura yok ama havşa + delik var (Countersink Hole)
            assigned_feature_ids.insert(cyl1.id);
            assigned_feature_ids.insert(c.id);

            let main_bore = BoreSegment {
                feature_id: cyl1.id,
                diameter: d1,
                depth: cyl1.depth_or_length.unwrap_or(20.0),
                centroid: cyl1.centroid,
                is_through: true,
            };

            let countersink = CountersinkChamfer {
                feature_id: c.id,
                entry_diameter: c.diameter.unwrap_or(d1 + 4.0),
                half_angle_rad: c.cone_half_angle_rad.unwrap_or(std::f64::consts::FRAC_PI_4),
                depth: c.depth_or_length.unwrap_or(2.0),
                centroid: c.centroid,
            };

            let entry_point = c.centroid + axis1 * (c.depth_or_length.unwrap_or(2.0) / 2.0);

            compound_holes.push(CompoundHoleFeature {
                id: hole_counter,
                name: format!("C'SINK_HOLE_{:02}", hole_counter),
                common_axis: axis1,
                entry_point,
                counterbore: None,
                countersink: Some(countersink),
                main_bore,
                step_face: None,
                thread_spec: cyl1.thread_spec.clone(),
                concentricity_tolerance_mm: Some(0.05),
            });
            hole_counter += 1;
        }
    }

    compound_holes
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compound_hole_concentricity_calculation() {
        let mut hole = CompoundHoleFeature::new_simple_bore(
            1,
            "TEST_CBORE",
            10,
            10.0,
            30.0,
            DVec3::new(50.0, 50.0, 20.0),
            DVec3::Z,
            DVec3::new(50.0, 50.0, 50.0),
        );

        // Faturayı X ekseninde 0.015 mm kaçık yerleştir
        hole.counterbore = Some(CounterborePocket {
            feature_id: 11,
            diameter: 18.0,
            depth: 8.0,
            centroid: DVec3::new(50.015, 50.0, 46.0),
            step_face_feature_id: None,
        });
        hole.concentricity_tolerance_mm = Some(0.04);

        let eval = hole.evaluate_concentricity().expect("Concentricity eval failed");
        assert!((eval.radial_eccentricity_mm - 0.015).abs() < 1e-5);
        // Koaksiyellik çap hatası = 2 * delta_r = 0.030 mm
        assert!((eval.coaxiality_error_mm - 0.030).abs() < 1e-5);
        assert!(eval.within_tolerance);
    }

    #[test]
    fn test_detect_stepped_holes_auto_grouping() {
        // Modelde bir fatura silindiri (Ø16 mm) ve bir ana delik silindiri (Ø8 mm) olsun
        let cb = GeometricFeature::new_internal_cylinder(
            1,
            "CBORE_POCKET",
            DVec3::new(100.0, 100.0, 45.0),
            DVec3::Z,
            16.0,
            10.0,
            500.0,
            20.0,
        )
        .unwrap();

        let bore = GeometricFeature::new_internal_cylinder(
            2,
            "MAIN_BORE",
            DVec3::new(100.0, 100.0, 20.0),
            DVec3::Z,
            8.0,
            30.0,
            750.0,
            20.0,
        )
        .unwrap();

        let features = vec![cb, bore];
        let compounds = detect_compound_holes(&features);

        assert_eq!(compounds.len(), 1);
        let ch = &compounds[0];
        assert!(ch.counterbore.is_some());
        assert_eq!(ch.counterbore.as_ref().unwrap().diameter, 16.0);
        assert_eq!(ch.main_bore.diameter, 8.0);
    }
}
