use glam::DVec3;
use serde::{Deserialize, Serialize};

use crate::error::AstError;

/// B-Rep modelinden çıkarılan analitik veya serbest geometrik unsur tipleri
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum FeatureType {
    /// Düzlemsel yüzey (Datum veya teftiş düzlemi)
    Plane,
    /// İç silindirik yüzey (Dişi delik / Delik deseni)
    InternalCylinder,
    /// Dış silindirik yüzey (Erkek mil / Fatura / Pim)
    ExternalCylinder,
    /// Konik yüzey (Havşa veya valf yuvası)
    Cone,
    /// Küresel yüzey (Kalibrasyon bilyesi veya küresel yuva)
    Sphere,
    /// Torus (O-ring kanalı veya dairesel radyus)
    Torus,
    /// Serbest formlu yüzey (NURBS / B-Spline kanat profili veya kalıp yüzeyi)
    FreeformBSpline,
}

/// Nötr Teftiş AST'sinde temsil edilen tekil bir geometrik unsur
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GeometricFeature {
    /// Model içi benzersiz topolojik unsur kimliği
    pub id: u32,
    /// İnsan okunabilir etiket (örneğin "PLN_TOP", "CYL_H7_BORE_01")
    pub name: String,
    /// Geometrik sınıf
    pub feature_type: FeatureType,
    /// Yüzey ağırlık merkezi [X, Y, Z] (mm)
    pub centroid: DVec3,
    /// Malzemeden boşluğa bakan dış birim normal vektörü [I, J, K]
    pub normal_vector: DVec3,
    /// Silindir veya koni için eksen birim doğrultu vektörü
    pub axis_vector: Option<DVec3>,
    /// Silindir, koni veya küre ise nominal çap (mm)
    pub diameter: Option<f64>,
    /// Delik derinliği veya mil boyu (mm)
    pub depth_or_length: Option<f64>,
    /// Konik yüzeyler için yarı tepe açısı (radyan cinsinden)
    pub cone_half_angle_rad: Option<f64>,
    /// Yüzey alanı (mm^2)
    pub area: f64,
    /// Karşı duvara olan minimum et kalınlığı (mm)
    pub min_wall_thickness: f64,
    /// 3-2-1 hizalama için referans (Datum) adayı olabilir mi?
    pub is_datum_candidate: bool,
    /// Unsur vida dişi içeriyor mu? (M-Thread vb.)
    pub is_threaded: bool,
    /// Varsa ayrıntılı vida dişi teknik özellikleri
    pub thread_spec: Option<crate::threads::ThreadSpecification>,
    /// Yüzeyin dış sınır tel poligonu (mm cinsinden köşe koordinatları)
    pub boundary_polygon: Vec<DVec3>,
}

impl GeometricFeature {
    /// Yeni bir analitik düzlem oluşturur
    pub fn new_plane(
        id: u32,
        name: impl Into<String>,
        centroid: DVec3,
        normal_vector: DVec3,
        area: f64,
        min_wall_thickness: f64,
    ) -> Result<Self, AstError> {
        let feature = Self {
            id,
            name: name.into(),
            feature_type: FeatureType::Plane,
            centroid,
            normal_vector,
            axis_vector: None,
            diameter: None,
            depth_or_length: None,
            cone_half_angle_rad: None,
            area,
            min_wall_thickness,
            is_datum_candidate: true,
            is_threaded: false,
            thread_spec: None,
            boundary_polygon: Vec::new(),
        };
        feature.validate()?;
        Ok(feature)
    }

    /// Yeni bir serbest formlu yüzey (NURBS / B-Spline) oluşturur
    pub fn new_freeform_surface(
        id: u32,
        name: impl Into<String>,
        centroid: DVec3,
        average_normal: DVec3,
        area: f64,
        min_wall_thickness: f64,
    ) -> Result<Self, AstError> {
        let feature = Self {
            id,
            name: name.into(),
            feature_type: FeatureType::FreeformBSpline,
            centroid,
            normal_vector: average_normal.normalize(),
            axis_vector: None,
            diameter: None,
            depth_or_length: None,
            cone_half_angle_rad: None,
            area,
            min_wall_thickness,
            is_datum_candidate: false,
            is_threaded: false,
            thread_spec: None,
            boundary_polygon: Vec::new(),
        };
        feature.validate()?;
        Ok(feature)
    }

    /// Yeni bir iç delik silindiri (Internal Cylinder) oluşturur
    pub fn new_internal_cylinder(
        id: u32,
        name: impl Into<String>,
        centroid: DVec3,
        axis_vector: DVec3,
        diameter: f64,
        depth: f64,
        area: f64,
        min_wall_thickness: f64,
    ) -> Result<Self, AstError> {
        let feature = Self {
            id,
            name: name.into(),
            feature_type: FeatureType::InternalCylinder,
            centroid,
            normal_vector: axis_vector.normalize(),
            axis_vector: Some(axis_vector.normalize()),
            diameter: Some(diameter),
            depth_or_length: Some(depth),
            cone_half_angle_rad: None,
            area,
            min_wall_thickness,
            is_datum_candidate: true,
            is_threaded: false,
            thread_spec: None,
            boundary_polygon: Vec::new(),
        };
        feature.validate()?;
        Ok(feature)
    }

    /// Yeni bir dişli delik (Tapped Hole) oluşturur
    pub fn new_tapped_hole(
        id: u32,
        name: impl Into<String>,
        centroid: DVec3,
        axis_vector: DVec3,
        thread: crate::threads::ThreadSpecification,
        area: f64,
        min_wall_thickness: f64,
    ) -> Result<Self, AstError> {
        let feature = Self {
            id,
            name: name.into(),
            feature_type: FeatureType::InternalCylinder,
            centroid,
            normal_vector: axis_vector.normalize(),
            axis_vector: Some(axis_vector.normalize()),
            diameter: Some(thread.nominal_major_diameter),
            depth_or_length: Some(thread.thread_depth),
            cone_half_angle_rad: None,
            area,
            min_wall_thickness,
            is_datum_candidate: false,
            is_threaded: true,
            thread_spec: Some(thread),
            boundary_polygon: Vec::new(),
        };
        feature.validate()?;
        Ok(feature)
    }

    /// Yeni bir dış mil / fatura silindiri (External Cylinder) oluşturur
    pub fn new_external_cylinder(
        id: u32,
        name: impl Into<String>,
        centroid: DVec3,
        axis_vector: DVec3,
        diameter: f64,
        length: f64,
        area: f64,
        min_wall_thickness: f64,
    ) -> Result<Self, AstError> {
        let feature = Self {
            id,
            name: name.into(),
            feature_type: FeatureType::ExternalCylinder,
            centroid,
            normal_vector: axis_vector.normalize(),
            axis_vector: Some(axis_vector.normalize()),
            diameter: Some(diameter),
            depth_or_length: Some(length),
            cone_half_angle_rad: None,
            area,
            min_wall_thickness,
            is_datum_candidate: true,
            is_threaded: false,
            thread_spec: None,
            boundary_polygon: Vec::new(),
        };
        feature.validate()?;
        Ok(feature)
    }

    /// Yeni bir konik yüzey (havşa veya valf yuvası) oluşturur
    pub fn new_cone(
        id: u32,
        name: impl Into<String>,
        centroid: DVec3,
        axis_vector: DVec3,
        diameter: f64,
        cone_half_angle_rad: f64,
        depth: f64,
        area: f64,
        min_wall_thickness: f64,
    ) -> Result<Self, AstError> {
        let axis = axis_vector.normalize();
        let feature = Self {
            id,
            name: name.into(),
            feature_type: FeatureType::Cone,
            centroid,
            normal_vector: axis,
            axis_vector: Some(axis),
            diameter: Some(diameter),
            depth_or_length: Some(depth),
            cone_half_angle_rad: Some(cone_half_angle_rad),
            area,
            min_wall_thickness,
            is_datum_candidate: false,
            is_threaded: false,
            thread_spec: None,
            boundary_polygon: Vec::new(),
        };
        feature.validate()?;
        Ok(feature)
    }

    /// Geometrinin fiziksel geçerlilik sınırlarını denetler
    pub fn validate(&self) -> Result<(), AstError> {
        let normal_len = self.normal_vector.length();
        if (normal_len - 1.0).abs() > 1e-4 {
            return Err(AstError::InvalidNormalVector {
                feature_id: self.id,
                length: normal_len,
            });
        }

        if let Some(axis) = self.axis_vector {
            let axis_len = axis.length();
            if (axis_len - 1.0).abs() > 1e-4 {
                return Err(AstError::InvalidFeature {
                    feature_id: self.id,
                    reason: format!("Eksen vektörü birim uzunlukta değil: {}", axis_len),
                });
            }
        }

        if let Some(d) = self.diameter {
            if d <= 0.0 {
                return Err(AstError::InvalidDiameter {
                    feature_id: self.id,
                    diameter: d,
                });
            }
        }

        if self.area < 0.0 {
            return Err(AstError::InvalidFeature {
                feature_id: self.id,
                reason: format!("Yüzey alanı negatif olamaz: {}", self.area),
            });
        }

        Ok(())
    }

    /// Unsurun ince cidarlı olup olmadığını kontrol eder (t < 2.5 mm kuralı)
    pub fn is_thin_walled(&self) -> bool {
        self.min_wall_thickness > 0.0 && self.min_wall_thickness < 2.5
    }

    /// Probun bu yüzeye yaklaşması gereken teorik yön vektörü (ters normal)
    pub fn approach_vector(&self) -> DVec3 {
        -self.normal_vector
    }
}
