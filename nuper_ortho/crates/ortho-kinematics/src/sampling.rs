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

    // Normal vektörüne dik iki teğet eksen bul (u, v)
    let up = if n.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = n.cross(up).normalize();
    let v = n.cross(u).normalize();

    // 4 köşe noktası
    let offsets = [
        centroid + u * half_span + v * half_span,
        centroid - u * half_span + v * half_span,
        centroid - u * half_span - v * half_span,
        centroid + u * half_span - v * half_span,
    ];

    offsets.iter().map(|&pt| SamplingPoint::new(pt, n)).collect()
}

/// Silindirik delikler için ISO 10360 standardında 2 seviyeli 8 temas noktası (4 x 2)
pub fn sample_cylinder_2level(
    centroid: DVec3,
    axis: DVec3,
    diameter: f64,
    depth: f64,
) -> Vec<SamplingPoint> {
    let axis_norm = axis.normalize();
    let radius = diameter / 2.0;

    // Eksenine dik düzlem baz vektörleri
    let ref_dir = if axis_norm.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };

    let u = axis_norm.cross(ref_dir).normalize();
    let v = axis_norm.cross(u).normalize();

    // İki derinlik seviyesi: Üstten %25 ve alttan %25
    let z_levels = [
        centroid + axis_norm * (depth * 0.25),
        centroid + axis_norm * (depth * 0.75),
    ];

    let mut points = Vec::with_capacity(8);

    for center_at_z in z_levels {
        // 90° adımlarla 4 radyal temas noktası
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
