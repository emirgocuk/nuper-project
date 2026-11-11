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
    /// Serbest formlu B-Spline / NURBS yüzeyi (Kontrol noktaları ve düğüm vektörleri)
    BSpline {
        control_points: Vec<Vec<DVec3>>,
        degree_u: usize,
        degree_v: usize,
        #[serde(default)]
        knots_u: Option<Vec<f64>>,
        #[serde(default)]
        knots_v: Option<Vec<f64>>,
    },
}

/// Diferansiyel geometri yüzey eğrilik tensörü çıktısı (Gauss ve Ortalama Eğrilikler)
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct SurfaceCurvature {
    /// Gauss Eğriliği K = kappa_1 * kappa_2 (mm^-2)
    pub gaussian: f64,
    /// Ortalama Eğrilik H = (kappa_1 + kappa_2) / 2 (mm^-1)
    pub mean: f64,
    /// Birinci Asli Eğrilik (Maksimum normal eğrilik) (mm^-1)
    pub k1: f64,
    /// İkinci Asli Eğrilik (Minimum normal eğrilik) (mm^-1)
    pub k2: f64,
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
    pub curvature: Option<SurfaceCurvature>,
}

/// Tekdüze kenetlenmiş (clamped uniform) düğüm vektörü üretir
pub fn generate_clamped_uniform_knots(num_ctrl_pts: usize, degree: usize) -> Vec<f64> {
    let p = degree.min(num_ctrl_pts.saturating_sub(1));
    let num_knots = num_ctrl_pts + p + 1;
    let mut knots = Vec::with_capacity(num_knots);
    for _ in 0..=p {
        knots.push(0.0);
    }
    let num_interior = num_ctrl_pts.saturating_sub(p + 1);
    for i in 1..=num_interior {
        knots.push((i as f64) / ((num_interior + 1) as f64));
    }
    for _ in 0..=p {
        knots.push(1.0);
    }
    knots
}

/// De Boor algoritması ile B-Spline eğrisi üzerinde bir nokta değerlendirir
pub fn evaluate_bspline_curve(
    degree: usize,
    knots: &[f64],
    ctrl: &[DVec3],
    mut u: f64,
) -> DVec3 {
    let n = ctrl.len().saturating_sub(1);
    let p = degree.min(n);
    if n == 0 {
        return ctrl.first().copied().unwrap_or(DVec3::ZERO);
    }

    let min_k = knots[p];
    let max_k = knots[n + 1];
    u = u.clamp(min_k, max_k);

    if u >= max_k {
        return ctrl[n];
    }
    if u <= min_k {
        return ctrl[0];
    }

    // Düğüm aralığı k bul: knots[k] <= u < knots[k+1]
    let mut k = p;
    while k <= n && knots[k + 1] <= u {
        k += 1;
    }

    let mut d = Vec::with_capacity(p + 1);
    for j in 0..=p {
        let idx = (k as isize - p as isize + j as isize) as usize;
        d.push(ctrl[idx]);
    }

    for r in 1..=p {
        for j in (r..=p).rev() {
            let i = k - p + j;
            let denom = knots[i + p - r + 1] - knots[i];
            let alpha = if denom.abs() < 1e-12 {
                0.0
            } else {
                (u - knots[i]) / denom
            };
            d[j] = d[j - 1] * (1.0 - alpha) + d[j] * alpha;
        }
    }

    d[p]
}

/// İki boyutlu tensör çarpımı (tensor-product) B-Spline yüzeyini değerlendirir
pub fn evaluate_bspline_surface(
    control_points: &[Vec<DVec3>],
    degree_u: usize,
    degree_v: usize,
    knots_u: Option<&[f64]>,
    knots_v: Option<&[f64]>,
    u_norm: f64,
    v_norm: f64,
) -> DVec3 {
    let rows = control_points.len();
    if rows == 0 {
        return DVec3::ZERO;
    }
    let cols = control_points[0].len();
    if cols == 0 {
        return DVec3::ZERO;
    }

    let default_knots_u;
    let u_knots = match knots_u {
        Some(k) if k.len() == cols + degree_u.min(cols.saturating_sub(1)) + 1 => k,
        _ => {
            default_knots_u = generate_clamped_uniform_knots(cols, degree_u);
            &default_knots_u[..]
        }
    };

    let default_knots_v;
    let v_knots = match knots_v {
        Some(k) if k.len() == rows + degree_v.min(rows.saturating_sub(1)) + 1 => k,
        _ => {
            default_knots_v = generate_clamped_uniform_knots(rows, degree_v);
            &default_knots_v[..]
        }
    };

    // 1. Her satırı u yönünde değerlendir -> her satırdan 1 nokta üret
    let mut q_rows = Vec::with_capacity(rows);
    for row in control_points {
        q_rows.push(evaluate_bspline_curve(degree_u, u_knots, row, u_norm));
    }

    // 2. q_rows noktalarını v yönünde değerlendir -> yüzey üzerindeki nihai 3D nokta
    evaluate_bspline_curve(degree_v, v_knots, &q_rows, v_norm)
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

    /// Yeni bir serbest formlu B-Spline parametrik yüzeyi oluşturur (Doc 20 Section 4)
    pub fn new_bspline(
        surface_id: u32,
        control_points: Vec<Vec<DVec3>>,
        degree_u: usize,
        degree_v: usize,
    ) -> Self {
        let rows = control_points.len();
        let cols = if rows > 0 { control_points[0].len() } else { 0 };

        let knots_u = generate_clamped_uniform_knots(cols, degree_u);
        let knots_v = generate_clamped_uniform_knots(rows, degree_v);

        let outer_boundary = vec![
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
        ];

        Self {
            surface_id,
            geometry: SurfaceGeometry::BSpline {
                control_points,
                degree_u,
                degree_v,
                knots_u: Some(knots_u),
                knots_v: Some(knots_v),
            },
            u_min: 0.0,
            u_max: 1.0,
            v_min: 0.0,
            v_max: 1.0,
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
            SurfaceGeometry::BSpline {
                control_points,
                degree_u,
                degree_v,
                knots_u,
                knots_v,
            } => {
                let u_norm = if (self.u_max - self.u_min).abs() > 1e-12 {
                    ((u - self.u_min) / (self.u_max - self.u_min)).clamp(0.0, 1.0)
                } else {
                    0.0
                };
                let v_norm = if (self.v_max - self.v_min).abs() > 1e-12 {
                    ((v - self.v_min) / (self.v_max - self.v_min)).clamp(0.0, 1.0)
                } else {
                    0.0
                };

                evaluate_bspline_surface(
                    control_points,
                    *degree_u,
                    *degree_v,
                    knots_u.as_deref(),
                    knots_v.as_deref(),
                    u_norm,
                    v_norm,
                )
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
                // Sayısal merkezi türevler (Central Finite Differences)
                let du = (self.u_max - self.u_min).abs() * 1e-4;
                let dv = (self.v_max - self.v_min).abs() * 1e-4;
                let h_u = if du > 1e-7 { du } else { 1e-4 };
                let h_v = if dv > 1e-7 { dv } else { 1e-4 };

                let pu_plus = self.evaluate_point(u + h_u, v);
                let pu_minus = self.evaluate_point(u - h_u, v);
                let pv_plus = self.evaluate_point(u, v + h_v);
                let pv_minus = self.evaluate_point(u, v - h_v);

                let ds_du = (pu_plus - pu_minus) / (2.0 * h_u);
                let ds_dv = (pv_plus - pv_minus) / (2.0 * h_v);
                let cross = ds_du.cross(ds_dv);
                if cross.length() > 1e-6 {
                    cross.normalize()
                } else {
                    DVec3::Z
                }
            }
        }
    }

    /// Birinci ve İkinci Temel Formlar (First & Second Fundamental Forms) ile yüzey eğriliklerini hesaplar (Doc 20 Section 4)
    /// Gauss Eğriliği $K = \frac{L N - M^2}{E G - F^2}$
    /// Ortalama Eğrilik $H = \frac{E N - 2 F M + G L}{2 (E G - F^2)}$
    pub fn evaluate_curvature(&self, u: f64, v: f64) -> SurfaceCurvature {
        match &self.geometry {
            SurfaceGeometry::Plane { .. } => SurfaceCurvature {
                gaussian: 0.0,
                mean: 0.0,
                k1: 0.0,
                k2: 0.0,
            },
            SurfaceGeometry::Cylinder { radius, is_internal, .. } => {
                let sign = if *is_internal { -1.0 } else { 1.0 };
                let k_circ = sign / radius;
                SurfaceCurvature {
                    gaussian: 0.0,
                    mean: k_circ / 2.0,
                    k1: k_circ,
                    k2: 0.0,
                }
            }
            _ => {
                let du = (self.u_max - self.u_min).abs() * 1e-4;
                let dv = (self.v_max - self.v_min).abs() * 1e-4;
                let h_u = if du > 1e-7 { du } else { 1e-4 };
                let h_v = if dv > 1e-7 { dv } else { 1e-4 };

                let p0 = self.evaluate_point(u, v);
                let pu_plus = self.evaluate_point(u + h_u, v);
                let pu_minus = self.evaluate_point(u - h_u, v);
                let pv_plus = self.evaluate_point(u, v + h_v);
                let pv_minus = self.evaluate_point(u, v - h_v);

                let ds_du = (pu_plus - pu_minus) / (2.0 * h_u);
                let ds_dv = (pv_plus - pv_minus) / (2.0 * h_v);

                let e_val = ds_du.dot(ds_du);
                let f_val = ds_du.dot(ds_dv);
                let g_val = ds_dv.dot(ds_dv);
                let w_det = e_val * g_val - f_val * f_val;

                if w_det < 1e-14 {
                    return SurfaceCurvature {
                        gaussian: 0.0,
                        mean: 0.0,
                        k1: 0.0,
                        k2: 0.0,
                    };
                }

                let cross = ds_du.cross(ds_dv);
                let n_vec = if cross.length() > 1e-7 {
                    cross.normalize()
                } else {
                    DVec3::Z
                };

                let d2s_du2 = (pu_plus - 2.0 * p0 + pu_minus) / (h_u * h_u);
                let d2s_dv2 = (pv_plus - 2.0 * p0 + pv_minus) / (h_v * h_v);

                let pu_plus_v_plus = self.evaluate_point(u + h_u, v + h_v);
                let pu_plus_v_minus = self.evaluate_point(u + h_u, v - h_v);
                let pu_minus_v_plus = self.evaluate_point(u - h_u, v + h_v);
                let pu_minus_v_minus = self.evaluate_point(u - h_u, v - h_v);

                let d2s_dudv = (pu_plus_v_plus - pu_plus_v_minus - pu_minus_v_plus + pu_minus_v_minus)
                    / (4.0 * h_u * h_v);

                let l_val = d2s_du2.dot(n_vec);
                let m_val = d2s_dudv.dot(n_vec);
                let n_form = d2s_dv2.dot(n_vec);

                let gaussian = (l_val * n_form - m_val * m_val) / w_det;
                let mean = (e_val * n_form - 2.0 * f_val * m_val + g_val * l_val) / (2.0 * w_det);

                let discr = (mean * mean - gaussian).max(0.0);
                let sqrt_discr = discr.sqrt();
                let k1 = mean + sqrt_discr;
                let k2 = mean - sqrt_discr;

                SurfaceCurvature {
                    gaussian,
                    mean,
                    k1,
                    k2,
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
        if let SurfaceGeometry::BSpline { .. } = &self.geometry {
            let p = self.evaluate_point(u, v);
            let p_u_min = self.evaluate_point(self.u_min, v);
            let p_u_max = self.evaluate_point(self.u_max, v);
            let p_v_min = self.evaluate_point(u, self.v_min);
            let p_v_max = self.evaluate_point(u, self.v_max);

            let d1 = p.distance(p_u_min);
            let d2 = p.distance(p_u_max);
            let d3 = p.distance(p_v_min);
            let d4 = p.distance(p_v_max);

            return d1.min(d2).min(d3).min(d4);
        }

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
                let curvature = Some(self.evaluate_curvature(u, v));

                candidates.push(SurfaceSamplingCandidate {
                    u,
                    v,
                    point_3d,
                    surface_normal,
                    approach_vector,
                    distance_to_boundary_mm: dist,
                    curvature,
                });
            }
        }

        candidates
    }

    /// Eğriliğe göre uyarlamalı serbest yüzey örnekleme noktaları üretir (Doc 20 Section 4)
    /// Düz ve az eğimli alanlarda baz ızgara sıklığı kullanılırken; yüksek eğrilikli
    /// geçiş bölgelerinde nokta yoğunluğu $\rho(u, v) \propto \sqrt{|H| + \epsilon}$ kuralıyla artırılır.
    /// Tüm noktalarda 1.5 mm çapak emniyet payı katı şekilde korunur.
    pub fn generate_curvature_adaptive_grid(
        &self,
        base_u: usize,
        base_v: usize,
        curvature_threshold: f64,
    ) -> Vec<SurfaceSamplingCandidate> {
        let mut candidates = Vec::new();
        let u_step = if base_u > 1 {
            (self.u_max - self.u_min) / ((base_u - 1) as f64)
        } else {
            0.0
        };
        let v_step = if base_v > 1 {
            (self.v_max - self.v_min) / ((base_v - 1) as f64)
        } else {
            0.0
        };

        for i in 0..base_u {
            let u = self.u_min + (i as f64) * u_step;
            for j in 0..base_v {
                let v = self.v_min + (j as f64) * v_step;

                // Temel ızgara adayını ekle
                self.try_add_candidate(u, v, &mut candidates);

                // Yüksek eğrilik durumunda alt hücre (subdivision) noktaları ekle
                if i + 1 < base_u && j + 1 < base_v {
                    let u_mid = u + 0.5 * u_step;
                    let v_mid = v + 0.5 * v_step;
                    let curv = self.evaluate_curvature(u_mid, v_mid);
                    if curv.mean.abs() >= curvature_threshold
                        || curv.gaussian.abs() >= (curvature_threshold * curvature_threshold)
                    {
                        self.try_add_candidate(u_mid, v_mid, &mut candidates);
                        self.try_add_candidate(u + 0.5 * u_step, v, &mut candidates);
                        self.try_add_candidate(u, v + 0.5 * v_step, &mut candidates);
                    }
                }
            }
        }

        candidates
    }

    fn try_add_candidate(&self, u: f64, v: f64, list: &mut Vec<SurfaceSamplingCandidate>) {
        if self.classify_uv_point(u, v) != ClassifierState::Inside {
            return;
        }
        let dist = self.distance_to_boundary(u, v);
        if dist < self.burr_safety_offset_mm {
            return; // Çapak emniyet payı ihlali (< 1.5 mm)
        }

        let pt = self.evaluate_point(u, v);
        // Çok yakın nokta çiftlerini filtrele
        if list.iter().any(|c| c.point_3d.distance(pt) < 1.0) {
            return;
        }

        let normal = self.evaluate_normal(u, v);
        let curv = self.evaluate_curvature(u, v);

        list.push(SurfaceSamplingCandidate {
            u,
            v,
            point_3d: pt,
            surface_normal: normal,
            approach_vector: -normal,
            distance_to_boundary_mm: dist,
            curvature: Some(curv),
        });
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

pub fn ransac_fit_plane(
    points: &[DVec3],
    distance_threshold: f64,
    max_iterations: usize,
) -> Option<(DVec3, DVec3, Vec<usize>)> {
    let n = points.len();
    if n < 3 {
        return None;
    }

    let mut best_inliers = Vec::new();
    let mut best_plane = (DVec3::ZERO, DVec3::Z);

    for it in 0..max_iterations {
        let idx1 = (it * 7 + 1) % n;
        let idx2 = (it * 13 + 3) % n;
        let idx3 = (it * 31 + 5) % n;

        if idx1 == idx2 || idx2 == idx3 || idx1 == idx3 {
            continue;
        }

        let p1 = points[idx1];
        let p2 = points[idx2];
        let p3 = points[idx3];

        let normal = (p2 - p1).cross(p3 - p1);
        if normal.length_squared() < 1e-10 {
            continue;
        }
        let normal = normal.normalize();

        let mut current_inliers = Vec::new();
        for (i, p) in points.iter().enumerate() {
            let dist = ((p - p1).dot(normal)).abs();
            if dist <= distance_threshold {
                current_inliers.push(i);
            }
        }

        if current_inliers.len() > best_inliers.len() {
            best_inliers = current_inliers;
            best_plane = (p1, normal);
        }
    }

    if best_inliers.len() < 3 {
        return None;
    }

    let inliers_sum: DVec3 = best_inliers.iter().map(|&i| points[i]).sum();
    let centroid = inliers_sum / (best_inliers.len() as f64);

    Some((centroid, best_plane.1, best_inliers))
}

pub fn ransac_fit_cylinder(
    points: &[DVec3],
    distance_threshold: f64,
    max_iterations: usize,
) -> Option<(DVec3, DVec3, f64, Vec<usize>)> {
    let n = points.len();
    if n < 5 {
        return None;
    }

    let candidate_axes = [
        DVec3::X,
        DVec3::Y,
        DVec3::Z,
        DVec3::new(1.0, 1.0, 0.0).normalize(),
        DVec3::new(0.0, 1.0, 1.0).normalize(),
    ];

    let mut best_inliers = Vec::new();
    let mut best_result = (DVec3::ZERO, DVec3::Z, 0.0);

    for axis in candidate_axes {
        for it in 0..max_iterations {
            let idx1 = (it * 11 + 2) % n;
            let idx2 = (it * 23 + 7) % n;
            let idx3 = (it * 37 + 13) % n;
            if idx1 == idx2 || idx2 == idx3 || idx1 == idx3 {
                continue;
            }

            let p1 = points[idx1];
            let p2 = points[idx2];
            let p3 = points[idx3];

            let a = p1 - p1.dot(axis) * axis;
            let b = p2 - p2.dot(axis) * axis;
            let c = p3 - p3.dot(axis) * axis;

            let v1 = b - a;
            let v2 = c - a;
            let cross_v = v1.cross(v2);
            let cross_sq = cross_v.length_squared();

            if cross_sq < 1e-8 {
                continue;
            }

            let v1_sq = v1.length_squared();
            let v2_sq = v2.length_squared();
            let num = (v1_sq * v2 - v2_sq * v1).cross(cross_v);
            let center_est = a + num / (2.0 * cross_sq);
            let r_est = a.distance(center_est);

            if r_est < 0.5 || r_est > 1000.0 {
                continue;
            }

            let mut inliers = Vec::new();
            for (i, p) in points.iter().enumerate() {
                let proj = p - p.dot(axis) * axis;
                let d = (proj.distance(center_est) - r_est).abs();
                if d <= distance_threshold {
                    inliers.push(i);
                }
            }

            if inliers.len() > best_inliers.len() {
                best_inliers = inliers;
                best_result = (center_est, axis, r_est);
            }
        }
    }

    if best_inliers.len() < 5 {
        return None;
    }

    Some((best_result.0, best_result.1, best_result.2, best_inliers))
}

pub fn reconstruct_parametric_plane(
    surface_id: u32,
    inliers: &[DVec3],
    normal: DVec3,
) -> ParametricFace {
    let centroid = inliers.iter().sum::<DVec3>() / (inliers.len().max(1) as f64);
    let u_dir = if normal.cross(DVec3::Z).length_squared() > 1e-4 {
        normal.cross(DVec3::Z).normalize()
    } else {
        normal.cross(DVec3::X).normalize()
    };
    let v_dir = normal.cross(u_dir).normalize();

    let mut u_min = f64::MAX;
    let mut u_max = f64::MIN;
    let mut v_min = f64::MAX;
    let mut v_max = f64::MIN;

    for p in inliers {
        let diff = *p - centroid;
        let u = diff.dot(u_dir);
        let v = diff.dot(v_dir);
        u_min = u_min.min(u);
        u_max = u_max.max(u);
        v_min = v_min.min(v);
        v_max = v_max.max(v);
    }

    let u_len = (u_max - u_min).max(10.0);
    let v_len = (v_max - v_min).max(10.0);

    ParametricFace::new_plane(surface_id, centroid, normal, u_len, v_len)
}

pub fn reconstruct_parametric_cylinder(
    surface_id: u32,
    inliers: &[DVec3],
    origin: DVec3,
    axis: DVec3,
    radius: f64,
    is_internal: bool,
) -> ParametricFace {
    let mut h_min = f64::MAX;
    let mut h_max = f64::MIN;

    for p in inliers {
        let h = (*p - origin).dot(axis);
        h_min = h_min.min(h);
        h_max = h_max.max(h);
    }

    let height = (h_max - h_min).max(10.0);
    ParametricFace::new_cylinder(surface_id, origin, axis, radius, height, is_internal)
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

    #[test]
    fn test_parametric_plane_and_cylinder_curvature() {
        // Düzlem için Gauss ve Ortalama eğrilik sıfır olmalıdır
        let plane = ParametricFace::new_plane(
            1,
            DVec3::new(50.0, 50.0, 0.0),
            DVec3::Z,
            100.0,
            100.0,
        );
        let curv_plane = plane.evaluate_curvature(0.0, 0.0);
        assert_eq!(curv_plane.gaussian, 0.0);
        assert_eq!(curv_plane.mean, 0.0);
        assert_eq!(curv_plane.k1, 0.0);
        assert_eq!(curv_plane.k2, 0.0);

        // Silindir (R = 20 mm): kappa_1 = 1/R = 0.05, kappa_2 = 0.0, H = 0.025, K = 0.0
        let cyl = ParametricFace::new_cylinder(
            2,
            DVec3::ZERO,
            DVec3::Z,
            20.0,
            50.0,
            false,
        );
        let curv_cyl = cyl.evaluate_curvature(0.0, 25.0);
        assert_eq!(curv_cyl.gaussian, 0.0);
        assert!((curv_cyl.k1 - 0.05).abs() < 1e-6);
        assert!((curv_cyl.mean - 0.025).abs() < 1e-6);
        assert_eq!(curv_cyl.k2, 0.0);
    }

    #[test]
    fn test_bspline_surface_evaluation_and_adaptive_sampling() {
        // 3x3 Serbest formlu kontrol ağı (Merkezde Z=15 mm yükselti/büküm)
        let ctrl_pts = vec![
            vec![
                DVec3::new(0.0, 0.0, 0.0),
                DVec3::new(50.0, 0.0, 0.0),
                DVec3::new(100.0, 0.0, 0.0),
            ],
            vec![
                DVec3::new(0.0, 50.0, 0.0),
                DVec3::new(50.0, 50.0, 15.0), // Z Bükümü (yüksek eğrilik)
                DVec3::new(100.0, 50.0, 0.0),
            ],
            vec![
                DVec3::new(0.0, 100.0, 0.0),
                DVec3::new(50.0, 100.0, 0.0),
                DVec3::new(100.0, 100.0, 0.0),
            ],
        ];

        let bspline_face = ParametricFace::new_bspline(10, ctrl_pts, 2, 2);

        // Köşe noktaları enterpolasyonu
        let p_corner = bspline_face.evaluate_point(0.0, 0.0);
        assert!((p_corner.x - 0.0).abs() < 1e-4);
        assert!((p_corner.y - 0.0).abs() < 1e-4);

        let p_center = bspline_face.evaluate_point(0.5, 0.5);
        assert!((p_center.z - 3.75).abs() < 1e-3, "Center Z should be 3.75 mm, found: {}", p_center.z);

        // Merkezde eğrilik sıfırdan farklı olmalı
        let curv_center = bspline_face.evaluate_curvature(0.5, 0.5);
        assert!(curv_center.mean.abs() > 1e-4, "Curvature at bump center must be non-zero");

        // Uyarlamalı örnekleme: Düz bölgelere göre bükümlü alanda daha yoğun nokta
        let adaptive_pts = bspline_face.generate_curvature_adaptive_grid(4, 4, 0.001);
        assert!(!adaptive_pts.is_empty());

        // Tüm noktaların 1.5 mm çapak emniyet payına uyduğu doğrulanır
        for pt in &adaptive_pts {
            assert!(
                pt.distance_to_boundary_mm >= 1.5,
                "Adaptive sampling point burr violation: {:.3} mm",
                pt.distance_to_boundary_mm
            );
            assert!(pt.curvature.is_some());
        }
    }

    #[test]
    fn test_ransac_fit_plane_and_reconstruction() {
        let mut points = Vec::new();
        for i in 0..10 {
            for j in 0..10 {
                let noise = ((i + j) % 3) as f64 * 0.01;
                points.push(DVec3::new(i as f64 * 10.0, j as f64 * 10.0, 50.0 + noise));
            }
        }
        points.push(DVec3::new(20.0, 20.0, 100.0));
        points.push(DVec3::new(30.0, 30.0, -20.0));

        let res = ransac_fit_plane(&points, 0.05, 50);
        assert!(res.is_some());
        let (centroid, normal, inliers) = res.unwrap();
        assert!(inliers.len() >= 95);
        assert!((normal.z.abs() - 1.0).abs() < 1e-3);
        assert!((centroid.z - 50.0).abs() < 0.1);

        let reconstructed = reconstruct_parametric_plane(1, &points[..100], normal);
        assert_eq!(reconstructed.surface_id, 1);
        let normal_eval = reconstructed.evaluate_normal(0.0, 0.0);
        assert!((normal_eval.z.abs() - 1.0).abs() < 1e-3);
    }

    #[test]
    fn test_ransac_fit_cylinder_and_reconstruction() {
        let mut points = Vec::new();
        let radius = 25.0;
        for h in 0..8 {
            let z = h as f64 * 10.0;
            for a in 0..12 {
                let theta = (a as f64) * std::f64::consts::PI / 6.0;
                let x = radius * theta.cos();
                let y = radius * theta.sin();
                points.push(DVec3::new(x, y, z));
            }
        }

        let res = ransac_fit_cylinder(&points, 0.1, 80);
        assert!(res.is_some());
        let (origin, axis, r_est, inliers) = res.unwrap();
        assert!(inliers.len() >= 80);
        assert!((r_est - radius).abs() < 1.0);
        assert!((axis.z.abs() - 1.0).abs() < 1e-3);

        let reconstructed = reconstruct_parametric_cylinder(2, &points, origin, axis, r_est, true);
        assert_eq!(reconstructed.surface_id, 2);
    }
}
