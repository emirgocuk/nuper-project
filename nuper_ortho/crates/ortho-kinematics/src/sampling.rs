use glam::DVec3;
use serde::{Deserialize, Serialize};

/// Tekil bir dokunmatik ölçüm temas noktası
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SamplingPoint {
    /// Parça yüzeyindeki temas koordinatı [X, Y, Z] (mm)
    pub touch_point: DVec3,
    /// Yaklaşma birim vektörü [I, J, K] (yüzey normalinin tersi)
    pub approach_vector: DVec3,
    /// Temastan sonra geri çekilme birim vektörü [I, J, K]
    pub retract_vector: DVec3,
    /// Yüzeyin dış birim normali
    pub surface_normal: DVec3,
}

impl SamplingPoint {
    pub fn new(touch: DVec3, normal: DVec3) -> Self {
        let n = normal.normalize();
        Self {
            touch_point: touch,
            approach_vector: -n,
            retract_vector: n,
            surface_normal: n,
        }
    }
}

/// Düzlemler için 4 köşeden içeri doğru standart ızgara örnekleyici
pub fn sample_plane_grid(centroid: DVec3, normal: DVec3, half_span: f64) -> Vec<SamplingPoint> {
    let n = normal.normalize();

    let up = if n.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = n.cross(up).normalize();
    let v = n.cross(u).normalize();

    let offsets = [
        centroid + u * half_span + v * half_span,
        centroid - u * half_span + v * half_span,
        centroid - u * half_span - v * half_span,
        centroid + u * half_span - v * half_span,
    ];

    offsets.iter().map(|&pt| SamplingPoint::new(pt, n)).collect()
}

/// Çapak emniyet payı ofsetli (1.5 mm + bilye yarıçapı) düzlem örnekleyici (Doc 03 Section 3)
pub fn sample_plane_with_margin(
    centroid: DVec3,
    normal: DVec3,
    half_w: f64,
    half_h: f64,
    burr_margin_mm: f64,
) -> Vec<SamplingPoint> {
    let n = normal.normalize();
    let up = if n.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = n.cross(up).normalize();
    let v = n.cross(u).normalize();

    let eff_w = (half_w - burr_margin_mm).max(1.0);
    let eff_h = (half_h - burr_margin_mm).max(1.0);

    vec![
        SamplingPoint::new(centroid + u * eff_w + v * eff_h, n),
        SamplingPoint::new(centroid - u * eff_w + v * eff_h, n),
        SamplingPoint::new(centroid - u * eff_w - v * eff_h, n),
        SamplingPoint::new(centroid + u * eff_w - v * eff_h, n),
    ]
}

/// Silindirik dişi delikler için ISO 10360 standardında 2 seviyeli 8 temas noktası (4 x 2)
pub fn sample_cylinder_2level(
    centroid: DVec3,
    axis: DVec3,
    diameter: f64,
    depth: f64,
) -> Vec<SamplingPoint> {
    let axis_norm = axis.normalize();
    let radius = diameter / 2.0;

    let ref_dir = if axis_norm.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = axis_norm.cross(ref_dir).normalize();
    let v = axis_norm.cross(u).normalize();

    let z_levels = [
        centroid + axis_norm * (depth * 0.25),
        centroid + axis_norm * (depth * 0.75),
    ];

    let mut points = Vec::with_capacity(8);

    for center_at_z in z_levels {
        for i in 0..4 {
            let angle = (i as f64) * std::f64::consts::FRAC_PI_2;
            let radial_dir = u * angle.cos() + v * angle.sin();
            let touch_pos = center_at_z + radial_dir * radius;

            // İç silindirde prob deliğin içine girip radyal olarak duvara dokunur;
            // yüzey normali duvarın içinden merkeze doğru bakar.
            let surface_normal = -radial_dir;
            points.push(SamplingPoint::new(touch_pos, surface_normal));
        }
    }

    points
}

/// Dış silindirik miller / faturalar / pimler için 2 seviyeli 8 temas noktası (4 x 2)
pub fn sample_external_cylinder(
    centroid: DVec3,
    axis: DVec3,
    diameter: f64,
    length: f64,
) -> Vec<SamplingPoint> {
    let axis_norm = axis.normalize();
    let radius = diameter / 2.0;

    let ref_dir = if axis_norm.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = axis_norm.cross(ref_dir).normalize();
    let v = axis_norm.cross(u).normalize();

    let z_levels = [
        centroid + axis_norm * (length * 0.25),
        centroid + axis_norm * (length * 0.75),
    ];

    let mut points = Vec::with_capacity(8);

    for center_at_z in z_levels {
        for i in 0..4 {
            let angle = (i as f64) * std::f64::consts::FRAC_PI_2;
            let radial_dir = u * angle.cos() + v * angle.sin();
            let touch_pos = center_at_z + radial_dir * radius;

            // Dış milde prob dışarıdan dokunur; yüzey normali dışarı bakar (+radial_dir)
            points.push(SamplingPoint::new(touch_pos, radial_dir));
        }
    }

    points
}

/// Konik yüzeyler (havşa veya valf yuvası) için 2 seviyeli 8 temas noktası
pub fn sample_cone_flank(
    apex_or_base: DVec3,
    axis: DVec3,
    base_diameter: f64,
    cone_half_angle_rad: f64,
    depth: f64,
) -> Vec<SamplingPoint> {
    let axis_norm = axis.normalize();
    let ref_dir = if axis_norm.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = axis_norm.cross(ref_dir).normalize();
    let v = axis_norm.cross(u).normalize();

    let base_r = base_diameter / 2.0;
    let z_levels = [depth * 0.25, depth * 0.75];
    let mut points = Vec::with_capacity(8);

    for &z in &z_levels {
        let r_at_z = base_r + z * cone_half_angle_rad.tan();
        let center_at_z = apex_or_base + axis_norm * z;
        for i in 0..4 {
            let angle = (i as f64) * std::f64::consts::FRAC_PI_2;
            let radial_dir = u * angle.cos() + v * angle.sin();
            let touch_pos = center_at_z + radial_dir * r_at_z;

            // Konik yüzey normali: radyal ve eksenel bileşenlerin eğimli birleşimi
            let normal = radial_dir * cone_half_angle_rad.cos() - axis_norm * cone_half_angle_rad.sin();
            points.push(SamplingPoint::new(touch_pos, normal.normalize()));
        }
    }

    points
}

/// Küresel yüzeyler (kalibrasyon bilyesi veya bilye yuvası) için 5 temas noktası
pub fn sample_sphere(center: DVec3, radius: f64) -> Vec<SamplingPoint> {
    let mut points = Vec::with_capacity(5);
    // 1 Tepe Kutup Noktası (+Z)
    points.push(SamplingPoint::new(center + DVec3::Z * radius, DVec3::Z));

    // 4 Ekvator Noktası
    let dirs = [DVec3::X, -DVec3::X, DVec3::Y, -DVec3::Y];
    for &d in &dirs {
        points.push(SamplingPoint::new(center + d * radius, d));
    }

    points
}

/// Kademeli cep oturma taban düzlemi (annular step face) için 3 noktalı eksenel derinlik örnekleyicisi
pub fn sample_annular_step_face(
    centroid: DVec3,
    normal: DVec3,
    inner_radius: f64,
    outer_radius: f64,
) -> Vec<SamplingPoint> {
    let n = normal.normalize();
    let ref_dir = if n.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = n.cross(ref_dir).normalize();
    let v = n.cross(u).normalize();

    let mid_r = (inner_radius + outer_radius) / 2.0;
    let mut points = Vec::with_capacity(3);

    // 120 derecelik aralıklarla 3 temas noktası (fatura derinliğini kararlı doğrulamak için)
    for i in 0..3 {
        let angle = (i as f64) * (2.0 * std::f64::consts::PI / 3.0);
        let radial = u * angle.cos() + v * angle.sin();
        let pt = centroid + radial * mid_r;
        points.push(SamplingPoint::new(pt, n));
    }

    points
}

/// Dişli delik Mod B: Giriş havşa konisinden (Countersink Chamfer) diş helisine girmeden merkez bulma örnekleyicisi
pub fn sample_countersink_chamfer_for_center(
    apex_or_base: DVec3,
    axis: DVec3,
    entry_diameter: f64,
    cone_half_angle_rad: f64,
    chamfer_depth: f64,
) -> Vec<SamplingPoint> {
    let axis_norm = axis.normalize();
    let ref_dir = if axis_norm.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = axis_norm.cross(ref_dir).normalize();
    let v = axis_norm.cross(u).normalize();

    // Havşa derinliğinin tam ortasından (%50) 4 nokta al
    let z_mid = chamfer_depth * 0.5;
    let base_r = entry_diameter / 2.0;
    // Havşa dibe doğru daraldığı için r_mid = base_r - z_mid * tan(half_angle)
    let r_mid = (base_r - z_mid * cone_half_angle_rad.tan()).max(1.0);
    let center_at_z = apex_or_base + axis_norm * z_mid;

    let mut points = Vec::with_capacity(4);
    for i in 0..4 {
        let angle = (i as f64) * std::f64::consts::FRAC_PI_2;
        let radial_dir = u * angle.cos() + v * angle.sin();
        let touch_pos = center_at_z + radial_dir * r_mid;

        // Havşa koni yüzey normali: içe ve eksene doğru
        let normal = -radial_dir * cone_half_angle_rad.cos() - axis_norm * cone_half_angle_rad.sin();
        points.push(SamplingPoint::new(touch_pos, normal.normalize()));
    }

    points
}

/// Dişli delik Mod C: Diş adaptör pimi (Thread Locator Pin) dış silindiri örnekleyicisi
pub fn sample_thread_locator_pin(
    hole_entry: DVec3,
    axis: DVec3,
    pin_diameter: f64,
    exposed_length: f64,
) -> Vec<SamplingPoint> {
    let axis_norm = axis.normalize();
    // Parçanın dışına doğru uzayan pim gövdesinin merkezi
    let pin_centroid = hole_entry + axis_norm * (exposed_length / 2.0);
    sample_external_cylinder(pin_centroid, axis_norm, pin_diameter, exposed_length)
}

/// Serbest formlu yüzeyler için eğrilik değerlendirme hücresi
#[derive(Debug, Clone, PartialEq)]
pub struct SurfaceEvalSample {
    pub point: DVec3,
    pub normal: DVec3,
    /// Ortalama eğrilik H = (k1 + k2) / 2
    pub mean_curvature: f64,
}

/// Serbest Form Yüzeyler İçin Eğriliğe Göre Uyarlamalı Örnekleyici (Curvature-Adaptive Surface Sampler)
pub fn sample_freeform_surface_adaptive(
    grid: &[Vec<SurfaceEvalSample>],
    base_step: usize,
    curvature_threshold: f64,
) -> Vec<SamplingPoint> {
    let mut sampled = Vec::new();
    let step = base_step.max(1);

    for (row_idx, row) in grid.iter().enumerate() {
        for (col_idx, cell) in row.iter().enumerate() {
            let is_boundary = row_idx == 0
                || row_idx == grid.len() - 1
                || col_idx == 0
                || col_idx == row.len() - 1;

            let is_high_curvature = cell.mean_curvature.abs() >= curvature_threshold;
            let is_sparse_grid_node = (row_idx % step == 0) && (col_idx % step == 0);

            if is_boundary || is_high_curvature || is_sparse_grid_node {
                sampled.push(SamplingPoint::new(cell.point, cell.normal));
            }
        }
    }

    sampled
}

/// B-Rep GeometricFeature serbest yüzeyinden (FreeformBSpline) güvenli temas noktaları üretir (Doc 20 Section 4)
/// Yüzey normali, yaklaşma vektörü ve 1.5 mm çapak emniyet payı katı şekilde korunur.
pub fn sample_freeform_feature_grid(
    centroid: DVec3,
    normal: DVec3,
    area: f64,
    boundary_polygon: &[DVec3],
    num_u: usize,
    num_v: usize,
) -> Vec<SamplingPoint> {
    let n = normal.normalize();
    let up = if n.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };
    let u_dir = n.cross(up).normalize();
    let v_dir = n.cross(u_dir).normalize();

    let mut points = Vec::new();

    // Sınır poligonu en az 4 nokta içeriyorsa (B-Spline kontrol ağı veya kenar döngüsü)
    if boundary_polygon.len() >= 4 {
        let mut min_u = f64::INFINITY;
        let mut max_u = f64::NEG_INFINITY;
        let mut min_v = f64::INFINITY;
        let mut max_v = f64::NEG_INFINITY;

        for p in boundary_polygon {
            let diff = *p - centroid;
            let u = diff.dot(u_dir);
            let v = diff.dot(v_dir);
            min_u = min_u.min(u);
            max_u = max_u.max(u);
            min_v = min_v.min(v);
            max_v = max_v.max(v);
        }

        // 1.5 mm çapak emniyeti payı ile içeri çek
        let safe_min_u = (min_u + 1.5).min(max_u - 1.5);
        let safe_max_u = (max_u - 1.5).max(min_u + 1.5);
        let safe_min_v = (min_v + 1.5).min(max_v - 1.5);
        let safe_max_v = (max_v - 1.5).max(min_v + 1.5);

        let step_u = if num_u > 1 {
            (safe_max_u - safe_min_u) / ((num_u - 1) as f64)
        } else {
            0.0
        };
        let step_v = if num_v > 1 {
            (safe_max_v - safe_min_v) / ((num_v - 1) as f64)
        } else {
            0.0
        };

        for i in 0..num_u {
            let u = safe_min_u + (i as f64) * step_u;
            for j in 0..num_v {
                let v = safe_min_v + (j as f64) * step_v;
                let pt = centroid + u_dir * u + v_dir * v;
                points.push(SamplingPoint::new(pt, n));
            }
        }
    } else {
        // Alandan türetilmiş boyut
        let side = area.sqrt().clamp(20.0, 100.0);
        let half = (side / 2.0 - 1.5).max(2.0); // 1.5 mm çapak emniyeti

        let step_u = if num_u > 1 {
            (2.0 * half) / ((num_u - 1) as f64)
        } else {
            0.0
        };
        let step_v = if num_v > 1 {
            (2.0 * half) / ((num_v - 1) as f64)
        } else {
            0.0
        };

        for i in 0..num_u {
            let u = -half + (i as f64) * step_u;
            for j in 0..num_v {
                let v = -half + (j as f64) * step_v;
                let pt = centroid + u_dir * u + v_dir * v;
                points.push(SamplingPoint::new(pt, n));
            }
        }
    }

    points
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plane_grid_sampling_count() {
        let pts = sample_plane_grid(DVec3::ZERO, DVec3::Z, 10.0);
        assert_eq!(pts.len(), 4);
        for p in pts {
            assert_eq!(p.surface_normal, DVec3::Z);
            assert_eq!(p.approach_vector, -DVec3::Z);
        }
    }

    #[test]
    fn test_plane_with_margin() {
        let pts = sample_plane_with_margin(DVec3::ZERO, DVec3::Z, 50.0, 50.0, 2.5);
        assert_eq!(pts.len(), 4);
        for p in pts {
            assert!(p.touch_point.x.abs() <= 47.5);
            assert!(p.touch_point.y.abs() <= 47.5);
        }
    }

    #[test]
    fn test_cylinder_sampling_count() {
        let pts = sample_cylinder_2level(DVec3::ZERO, DVec3::Z, 20.0, 40.0);
        assert_eq!(pts.len(), 8);
    }

    #[test]
    fn test_external_cylinder_sampling() {
        let pts = sample_external_cylinder(DVec3::ZERO, DVec3::Z, 12.0, 20.0);
        assert_eq!(pts.len(), 8);
        for p in pts {
            // Dış milde yaklaşma vektörü merkeze doğru bakar
            assert!(p.approach_vector.dot(DVec3::Z).abs() < 1e-4);
            assert!(p.surface_normal.length() > 0.99);
        }
    }

    #[test]
    fn test_cone_flank_sampling() {
        let pts = sample_cone_flank(DVec3::ZERO, DVec3::Z, 20.0, 45.0_f64.to_radians(), 10.0);
        assert_eq!(pts.len(), 8);
    }

    #[test]
    fn test_sphere_sampling() {
        let pts = sample_sphere(DVec3::new(10.0, 10.0, 10.0), 12.5);
        assert_eq!(pts.len(), 5);
    }

    #[test]
    fn test_curvature_adaptive_sampling() {
        let mut grid = Vec::new();
        for r in 0..5 {
            let mut row = Vec::new();
            for c in 0..5 {
                let curvature = if c >= 3 { 0.35 } else { 0.01 };
                row.push(SurfaceEvalSample {
                    point: DVec3::new(c as f64 * 10.0, r as f64 * 10.0, 0.0),
                    normal: DVec3::Z,
                    mean_curvature: curvature,
                });
            }
            grid.push(row);
        }

        let samples = sample_freeform_surface_adaptive(&grid, 2, 0.2);
        assert!(samples.len() > 10);
    }
}
