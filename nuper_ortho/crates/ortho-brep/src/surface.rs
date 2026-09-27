//! # Yüzey Parametrizasyonu, UV Haritalama ve Kırpma Sınırları (Doc 08 Section 1)
//! 
//! OpenCASCADE TopoDS_Face analitik ve serbest yüzeyleri için:
//! - Parametrik $S(u, v)$ yüzey fonksiyonları ve birinci kısmi türevler ($\partial S/\partial u, \partial S/\partial v$).
//! - Noktasal diferansiyel normal vektörü $\vec{N}(u, v)$.
//! - Kırpma sınırı ve delik içi/dışı doğrulaması (BRepClass_FaceClassifier eşdeğeri).
//! - 1.5 mm çapak emniyet payı (burr offset) ile kenardan güvenli mesafede örnekleme noktası üretimi.

use glam::DVec3;
use serde::{Deserialize, Serialize};

/// Yüzey sınıflandırma durumu (OpenCASCADE TopAbs_State eşdeğeri)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ClassifierState {
    /// Nokta yüzey sınırları içinde ve deliklerin dışında (güvenli)
    Inside,
    /// Nokta tam sınır eğrisi üzerinde
    OnBoundary,
    /// Nokta yüzeyin dışında veya bir delik/oyuk boşluğunda
    Outside,
}

/// Analitik veya serbest parametrik yüzey geometrisi
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SurfaceGeometry {
    /// Düzlemsel yüzey: $S(u, v) = P_0 + u \cdot \vec{U} + v \cdot \vec{V}$
    Plane {
        origin: DVec3,
        u_dir: DVec3,
        v_dir: DVec3,
        normal: DVec3,
    },
    /// Silindirik yüzey: $S(u, v) = P_0 + v \cdot \vec{A} + R \cdot (\cos(u)\vec{U} + \sin(u)\vec{V})$
    Cylinder {
        origin: DVec3,
        axis: DVec3,
        u_dir: DVec3,
        v_dir: DVec3,
        radius: f64,
        is_internal: bool,
    },
    /// Konik yüzey: $S(u, v) = P_0 + v \cdot \vec{A} + (R_0 + v \cdot \tan(\alpha)) \cdot (\cos(u)\vec{U} + \sin(u)\vec{V})$
    Cone {
        apex_or_origin: DVec3,
        axis: DVec3,
        u_dir: DVec3,
        v_dir: DVec3,
        semi_angle_rad: f64,
        base_radius: f64,
    },
    /// Serbest formlu B-Spline yüzeyi (Kontrol noktaları ve ağırlıklar ızgarası)
    BSpline {
        control_points: Vec<Vec<DVec3>>,
        degree_u: usize,
        degree_v: usize,
    },
}

/// B-Rep Yüzeyi UV Parametrik Tanımı ve Çapak Emniyeti Yöneticisi
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParametricFace {
    pub surface_id: u32,
    pub geometry: SurfaceGeometry,
    pub u_min: f64,
    pub u_max: f64,
    pub v_min: f64,
    pub v_max: f64,
    /// Kenar eğrilerinden içeri doğru uygulanacak çapak emniyet payı (varsayılan: 1.5 mm, Doc 08 Sec 1)
    pub burr_safety_offset_mm: f64,
    /// Yüzeyin dış sınır tel poligonu (UV uzayında [u, v])
    pub outer_boundary_uv: Vec<[f64; 2]>,
    /// İç oyuk/delik sınırları (Varsa her biri UV uzayında bir kapalı poligon)
    pub inner_holes_uv: Vec<Vec<[f64; 2]>>,
}

/// Güvenli teftiş örnekleme adayı
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SurfaceSamplingCandidate {
    pub u: f64,
    pub v: f64,
    pub point_3d: DVec3,
    pub surface_normal: DVec3,
    pub approach_vector: DVec3,
    pub distance_to_boundary_mm: f64,
}

impl ParametricFace {
    /// Yeni bir düzlemsel yüzey parametrik tanımı oluşturur
    pub fn new_plane(
        surface_id: u32,
        origin: DVec3,
        normal: DVec3,
        width: f64,
        height: f64,
    ) -> Self {
        let n = normal.normalize();
        let up = if n.z.abs() < 0.9 {
            DVec3::new(0.0, 0.0, 1.0)
        } else {
            DVec3::new(1.0, 0.0, 0.0)
        };
        let u_dir = n.cross(up).normalize();
        let v_dir = n.cross(u_dir).normalize();

        let half_w = width / 2.0;
        let half_h = height / 2.0;

        let outer_boundary = vec![
            [-half_w, -half_h],
            [half_w, -half_h],
            [half_w, half_h],
            [-half_w, half_h],
        ];

        Self {
            surface_id,
            geometry: SurfaceGeometry::Plane {
                origin,
                u_dir,
                v_dir,
                normal: n,
            },
            u_min: -half_w,
            u_max: half_w,
            v_min: -half_h,
            v_max: half_h,
            burr_safety_offset_mm: 1.5,
            outer_boundary_uv: outer_boundary,
            inner_holes_uv: Vec::new(),
        }
    }

    /// Yeni bir silindirik delik/şaft parametrik tanımı oluşturur
    pub fn new_cylinder(
        surface_id: u32,
        origin: DVec3,
        axis: DVec3,
        radius: f64,
        length: f64,
        is_internal: bool,
    ) -> Self {
        let a = axis.normalize();
        let up = if a.z.abs() < 0.9 {
            DVec3::new(0.0, 0.0, 1.0)
        } else {
            DVec3::new(1.0, 0.0, 0.0)
        };
        let u_dir = a.cross(up).normalize();
        let v_dir = a.cross(u_dir).normalize();

        // u: [0, 2*PI], v: [0, length]
        let outer_boundary = vec![
            [0.0, 0.0],
            [std::f64::consts::TAU, 0.0],
            [std::f64::consts::TAU, length],
            [0.0, length],
        ];

        Self {
            surface_id,
            geometry: SurfaceGeometry::Cylinder {
                origin,
                axis: a,
                u_dir,
                v_dir,
                radius,
                is_internal,
            },
            u_min: 0.0,
            u_max: std::f64::consts::TAU,
            v_min: 0.0,
            v_max: length,
            burr_safety_offset_mm: 1.5,
            outer_boundary_uv: outer_boundary,
            inner_holes_uv: Vec::new(),
        }
    }

    /// $S(u, v)$ yüzey fonksiyonunu 3D uzayda değerlendirir
    pub fn evaluate_point(&self, u: f64, v: f64) -> DVec3 {
        match &self.geometry {
            SurfaceGeometry::Plane { origin, u_dir, v_dir, .. } => {
                *origin + *u_dir * u + *v_dir * v
            }
            SurfaceGeometry::Cylinder { origin, axis, u_dir, v_dir, radius, .. } => {
                let radial = *u_dir * u.cos() + *v_dir * u.sin();
                *origin + *axis * v + radial * (*radius)
            }
            SurfaceGeometry::Cone { apex_or_origin, axis, u_dir, v_dir, semi_angle_rad, base_radius } => {
                let r = base_radius + v * semi_angle_rad.tan();
                let radial = *u_dir * u.cos() + *v_dir * u.sin();
                *apex_or_origin + *axis * v + radial * r
            }
            SurfaceGeometry::BSpline { control_points, .. } => {
                // Basit bilinear/bicubic enterpolasyon yaklaşımı
                if control_points.is_empty() || control_points[0].is_empty() {
                    return DVec3::ZERO;
                }
                let rows = control_points.len();
                let cols = control_points[0].len();
                let u_clamped = u.clamp(0.0, 1.0) * ((cols - 1) as f64);
                let v_clamped = v.clamp(0.0, 1.0) * ((rows - 1) as f64);

                let i = (u_clamped.floor() as usize).min(cols - 2);
                let j = (v_clamped.floor() as usize).min(rows - 2);
                let du = u_clamped - (i as f64);
                let dv = v_clamped - (j as f64);

                let p00 = control_points[j][i];
                let p10 = control_points[j][i + 1];
                let p01 = control_points[j + 1][i];
                let p11 = control_points[j + 1][i + 1];

                p00 * (1.0 - du) * (1.0 - dv)
                    + p10 * du * (1.0 - dv)
                    + p01 * (1.0 - du) * dv
                    + p11 * du * dv
            }
        }
    }

    /// Diferansiyel yüzey normalini $\vec{N}(u, v)$ hesaplar
    /// $$\vec{N}(u, v) = \frac{\frac{\partial S}{\partial u} \times \frac{\partial S}{\partial v}}{\left\| \frac{\partial S}{\partial u} \times \frac{\partial S}{\partial v} \right\|}$$
    pub fn evaluate_normal(&self, u: f64, v: f64) -> DVec3 {
        match &self.geometry {
            SurfaceGeometry::Plane { normal, .. } => *normal,
            SurfaceGeometry::Cylinder { u_dir, v_dir, is_internal, .. } => {
                let radial = (*u_dir * u.cos() + *v_dir * u.sin()).normalize();
                if *is_internal {
                    -radial // Delik içinde yüzey normali delik merkezine bakar
                } else {
                    radial  // Dış milde yüzey normali dışarı bakar
                }
            }
            SurfaceGeometry::Cone { axis, u_dir, v_dir, semi_angle_rad, .. } => {
                let radial = (*u_dir * u.cos() + *v_dir * u.sin()).normalize();
                let normal = radial * semi_angle_rad.cos() - *axis * semi_angle_rad.sin();
                normal.normalize()
            }
            SurfaceGeometry::BSpline { .. } => {
                // Sayısal kısmi türevler (Finite Differences)
                let eps = 1e-4;
                let p0 = self.evaluate_point(u, v);
                let pu = self.evaluate_point(u + eps, v);
                let pv = self.evaluate_point(u, v + eps);

                let ds_du = (pu - p0) / eps;
                let ds_dv = (pv - p0) / eps;
                let cross = ds_du.cross(ds_dv);
                if cross.length() > 1e-6 {
                    cross.normalize()
                } else {
                    DVec3::Z
                }
            }
        }
    }

    /// Kırpma sınırı ve delik içi/dışı doğrulaması (BRepClass_FaceClassifier algoritması)
    pub fn classify_uv_point(&self, u: f64, v: f64) -> ClassifierState {
        // 1. Dış sınır poligonu içinde mi?
        if !self.outer_boundary_uv.is_empty() {
            if !Self::point_in_polygon_2d([u, v], &self.outer_boundary_uv) {
                return ClassifierState::Outside;
            }
        } else {
            // Sınır kutusu kontrolü
            if u < self.u_min || u > self.u_max || v < self.v_min || v > self.v_max {
                return ClassifierState::Outside;
            }
        }

        // 2. Bir iç delik/oyuk boşluğuna mı denk geliyor?
        for hole in &self.inner_holes_uv {
            if Self::point_in_polygon_2d([u, v], hole) {
                return ClassifierState::Outside; // Deliğe denk geliyor -> reddet
            }
        }

        ClassifierState::Inside
    }

    /// Noktanın dış sınırlara olan minimum mesafesini hesaplar (mm)
    pub fn distance_to_boundary(&self, u: f64, v: f64) -> f64 {
        let mut min_dist = f64::INFINITY;

        if !self.outer_boundary_uv.is_empty() {
            let n = self.outer_boundary_uv.len();
            for i in 0..n {
                let p1 = self.outer_boundary_uv[i];
                let p2 = self.outer_boundary_uv[(i + 1) % n];
                let dist = Self::distance_point_to_segment([u, v], p1, p2);
                if dist < min_dist {
                    min_dist = dist;
                }
            }
        } else {
            let du = (u - self.u_min).min(self.u_max - u);
            let dv = (v - self.v_min).min(self.v_max - v);
            min_dist = du.min(dv).max(0.0);
        }

        // İç delik sınırlarına olan mesafe de dikkate alınır
        for hole in &self.inner_holes_uv {
            let n = hole.len();
            for i in 0..n {
                let p1 = hole[i];
                let p2 = hole[(i + 1) % n];
                let dist = Self::distance_point_to_segment([u, v], p1, p2);
                if dist < min_dist {
                    min_dist = dist;
                }
            }
        }

        min_dist
    }

    /// Çapak emniyet payı ($1.5\text{ mm}$) ofsetli güvenli örnekleme noktaları üretir (Doc 08 Section 1)
    pub fn generate_safe_sampling_grid(
        &self,
        num_u: usize,
        num_v: usize,
    ) -> Vec<SurfaceSamplingCandidate> {
        let mut candidates = Vec::new();
        let u_step = if num_u > 1 {
            (self.u_max - self.u_min) / ((num_u - 1) as f64)
        } else {
            0.0
        };
        let v_step = if num_v > 1 {
            (self.v_max - self.v_min) / ((num_v - 1) as f64)
        } else {
            0.0
        };

        for i in 0..num_u {
            let u = self.u_min + (i as f64) * u_step;
            for j in 0..num_v {
                let v = self.v_min + (j as f64) * v_step;

                // 1. Sınır içinde mi?
                if self.classify_uv_point(u, v) != ClassifierState::Inside {
                    continue;
                }

                // 2. Çapak emniyet payı mesafesi yeterli mi? (≥ 1.5 mm)
                let dist = self.distance_to_boundary(u, v);
                if dist < self.burr_safety_offset_mm {
                    continue; // Kenara çok yakın, çapak probu saptırabilir
                }

                let point_3d = self.evaluate_point(u, v);
                let surface_normal = self.evaluate_normal(u, v);
                let approach_vector = -surface_normal;

                candidates.push(SurfaceSamplingCandidate {
                    u,
                    v,
                    point_3d,
                    surface_normal,
                    approach_vector,
                    distance_to_boundary_mm: dist,
                });
            }
        }

        candidates
    }

    /// 2D Poligon içi nokta kontrolü (Ray-Casting Jordan Curve Teoremi)
    fn point_in_polygon_2d(p: [f64; 2], poly: &[[f64; 2]]) -> bool {
        let mut inside = false;
        let n = poly.len();
        if n < 3 {
            return false;
        }

        let mut j = n - 1;
        for i in 0..n {
            let pi = poly[i];
            let pj = poly[j];

            if ((pi[1] > p[1]) != (pj[1] > p[1]))
                && (p[0] < (pj[0] - pi[0]) * (p[1] - pi[1]) / (pj[1] - pi[1]) + pi[0])
            {
                inside = !inside;
            }
            j = i;
        }

        inside
    }

    /// 2D Noktanın bir doğru parçasına olan en kısa Öklid mesafesi
    fn distance_point_to_segment(p: [f64; 2], a: [f64; 2], b: [f64; 2]) -> f64 {
        let ab = [b[0] - a[0], b[1] - a[1]];
        let ap = [p[0] - a[0], p[1] - a[1]];
        let ab_len_sq = ab[0] * ab[0] + ab[1] * ab[1];

        if ab_len_sq < 1e-12 {
            return (ap[0] * ap[0] + ap[1] * ap[1]).sqrt();
        }

        let t = ((ap[0] * ab[0] + ap[1] * ab[1]) / ab_len_sq).clamp(0.0, 1.0);
        let closest = [a[0] + t * ab[0], a[1] + t * ab[1]];
        let dx = p[0] - closest[0];
        let dy = p[1] - closest[1];
        (dx * dx + dy * dy).sqrt()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parametric_plane_and_burr_offset() {
        // 100x100 mm Z=0 Düzlemi
        let plane = ParametricFace::new_plane(
            1,
            DVec3::new(50.0, 50.0, 0.0),
            DVec3::Z,
            100.0,
            100.0,
        );

        // Merkez noktası sınır içinde olmalı
        assert_eq!(plane.classify_uv_point(0.0, 0.0), ClassifierState::Inside);
        // Sınırın dışındaki nokta Outside olmalı
        assert_eq!(plane.classify_uv_point(60.0, 0.0), ClassifierState::Outside);

        // 1.5 mm çapak emniyet payı ile ızgara üretimi
        let candidates = plane.generate_safe_sampling_grid(5, 5);
        assert!(!candidates.is_empty());

        for c in &candidates {
            assert!(c.distance_to_boundary_mm >= 1.5, "Burr offset violation: {}", c.distance_to_boundary_mm);
            assert_eq!(c.surface_normal, DVec3::Z);
            assert_eq!(c.approach_vector, -DVec3::Z);
        }
    }

    #[test]
    fn test_parametric_cylinder_eval() {
        let cyl = ParametricFace::new_cylinder(
            2,
            DVec3::new(20.0, 20.0, 0.0),
            DVec3::Z,
            10.0, // R = 10 (Ø20 mm)
            40.0, // Derinlik = 40 mm
            true, // İç silindir
        );

        let pt = cyl.evaluate_point(0.0, 10.0);
        assert!((pt.z - 10.0).abs() < 1e-4);

        let normal = cyl.evaluate_normal(0.0, 10.0);
        // İç silindir normali merkeze doğru bakar
        assert!(normal.length() > 0.99);
    }
}
