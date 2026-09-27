//! # ortho-kinematics::fitting
//! 
//! Metroloji Geometrik Fitting (En İyi Uyum) Çekirdeği.
//! Gauss En Küçük Kareler (Least Squares), Chebyshev Maksimum İç Teğet (MIC) ve
//! Minimum Dış Teğet (MCC) algoritmalarını içerir. PTB / NIST akreditasyon standartlarına uygundur.

use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;
use glam::DVec3;
use ortho_ast::ProfileZoneDisposition;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum FittingError {
    #[error("Yetersiz nokta sayısı: En az {min} nokta gerekli, {found} bulundu")]
    InsufficientPoints { min: usize, found: usize },

    #[error("Doğrudaş (kollineer) veya bozuk nokta kümesi: Normal vektör çözülemedi")]
    DegenerateGeometry,

    #[error("Optimizasyon yakınsamadı")]
    ConvergenceFailed,

    #[error("Dosya okuma hatası: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Veri ayrıştırma hatası: {0}")]
    ParseError(String),
}

/// Düzlem Fitting Sonucu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PlaneFitResult {
    /// Düzlemin ağırlık merkezi (centroid) [X, Y, Z]
    pub centroid: DVec3,
    /// Düzlemin dış birim normal vektörü [I, J, K]
    pub normal: DVec3,
    /// Düzlemsellik (Flatness) form hatası (Peak-to-Valley / Max - Min sapma) (mm)
    pub flatness: f64,
    /// Kök ortalama kare sapması (RMS hatası) (mm)
    pub rms_error: f64,
    /// Düzlem denklem sabiti D: n.x * X + n.y * Y + n.z * Z + D = 0
    pub d_param: f64,
}

/// Silindir Fitting Sonucu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CylinderFitResult {
    /// Eksen üzerindeki referans merkez noktası [X, Y, Z]
    pub center: DVec3,
    /// Silindirin eksen birim vektörü [I, J, K]
    pub axis: DVec3,
    /// Hesaplanmış yarıçap R (mm)
    pub radius: f64,
    /// Hesaplanmış anma çapı D = 2 * R (mm)
    pub diameter: f64,
    /// Dairesellik / Silindiriklik sapması (Peak-to-Valley) (mm)
    pub roundness: f64,
    /// RMS radyal uyum hatası (mm)
    pub rms_error: f64,
}

/// PTB / NIST formatındaki `.dat` koordinat dosyalarını ayrıştırır
pub fn load_ptb_test_points(path: impl AsRef<Path>) -> Result<Vec<DVec3>, FittingError> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let mut points = Vec::new();

    for (line_idx, line_res) in reader.lines().enumerate() {
        let line = line_res?;
        let trimmed = line.trim();
        if trimmed.is_empty() || trimmed.starts_with('#') {
            continue;
        }

        let parts: Vec<&str> = trimmed.split_whitespace().collect();
        if parts.len() < 3 {
            return Err(FittingError::ParseError(format!(
                "Satır {}: 3 koordinat bekleniyordu, {} bulundu",
                line_idx + 1,
                parts.len()
            )));
        }

        let x: f64 = parts[0]
            .parse()
            .map_err(|e| FittingError::ParseError(format!("Satır {} X: {}", line_idx + 1, e)))?;
        let y: f64 = parts[1]
            .parse()
            .map_err(|e| FittingError::ParseError(format!("Satır {} Y: {}", line_idx + 1, e)))?;
        let z: f64 = parts[2]
            .parse()
            .map_err(|e| FittingError::ParseError(format!("Satır {} Z: {}", line_idx + 1, e)))?;

        points.push(DVec3::new(x, y, z));
    }

    if points.is_empty() {
        return Err(FittingError::InsufficientPoints { min: 3, found: 0 });
    }

    Ok(points)
}

/// 3x3 simetrik matris için analitik Jacobi Özdeğer ve Özvektör Çözücüsü
fn jacobi_eigen_3x3(mut a: [[f64; 3]; 3]) -> ([f64; 3], [[f64; 3]; 3]) {
    let mut v = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]];

    for _ in 0..50 {
        let off_diag = a[0][1].abs() + a[0][2].abs() + a[1][2].abs();
        if off_diag < 1e-15 {
            break;
        }

        for &(p, q) in &[(0, 1), (0, 2), (1, 2)] {
            if a[p][q].abs() > 1e-16 {
                let tau = (a[q][q] - a[p][p]) / (2.0 * a[p][q]);
                let t = if tau >= 0.0 {
                    1.0 / (tau + (1.0 + tau * tau).sqrt())
                } else {
                    -1.0 / (-tau + (1.0 + tau * tau).sqrt())
                };
                let c = 1.0 / (1.0 + t * t).sqrt();
                let s = t * c;

                let app = a[p][p];
                let aqq = a[q][q];
                let apq = a[p][q];

                a[p][p] = c * c * app - 2.0 * s * c * apq + s * s * aqq;
                a[q][q] = s * s * app + 2.0 * s * c * apq + c * c * aqq;
                a[p][q] = 0.0;
                a[q][p] = 0.0;

                for r in 0..3 {
                    if r != p && r != q {
                        let arp = a[r][p];
                        let arq = a[r][q];
                        a[r][p] = c * arp - s * arq;
                        a[p][r] = a[r][p];
                        a[r][q] = s * arp + c * arq;
                        a[q][r] = a[r][q];
                    }

                    let vrp = v[r][p];
                    let vrq = v[r][q];
                    v[r][p] = c * vrp - s * vrq;
                    v[r][q] = s * vrp + c * vrq;
                }
            }
        }
    }

    let mut eigenvals = [a[0][0], a[1][1], a[2][2]];
    let mut eigenvecs = v;

    // Özdeğerleri küçükten büyüğe sırala (bubble sort for 3 elements)
    for i in 0..2 {
        for j in 0..(2 - i) {
            if eigenvals[j] > eigenvals[j + 1] {
                eigenvals.swap(j, j + 1);
                for r in 0..3 {
                    let tmp = eigenvecs[r][j];
                    eigenvecs[r][j] = eigenvecs[r][j + 1];
                    eigenvecs[r][j + 1] = tmp;
                }
            }
        }
    }

    (eigenvals, eigenvecs)
}

/// Gauss En Küçük Kareler (Least Squares) Düzlem Uydurma
pub fn fit_least_squares_plane(points: &[DVec3]) -> Result<PlaneFitResult, FittingError> {
    let n = points.len();
    if n < 3 {
        return Err(FittingError::InsufficientPoints { min: 3, found: n });
    }

    // 1. Ağırlık merkezi (Centroid)
    let sum = points.iter().fold(DVec3::ZERO, |acc, p| acc + *p);
    let centroid = sum / (n as f64);

    // 2. Kovaryans (Dağılım) Matrisi
    let mut cov = [[0.0f64; 3]; 3];
    for p in points {
        let diff = *p - centroid;
        cov[0][0] += diff.x * diff.x;
        cov[0][1] += diff.x * diff.y;
        cov[0][2] += diff.x * diff.z;
        cov[1][1] += diff.y * diff.y;
        cov[1][2] += diff.y * diff.z;
        cov[2][2] += diff.z * diff.z;
    }
    cov[1][0] = cov[0][1];
    cov[2][0] = cov[0][2];
    cov[2][1] = cov[1][2];

    // 3. Jacobi Özdeğer Çözümü: En küçük özdeğer düzlem normalini verir
    let (eigenvals, eigenvecs) = jacobi_eigen_3x3(cov);

    if eigenvals[1] < 1e-12 {
        return Err(FittingError::DegenerateGeometry);
    }

    let mut normal = DVec3::new(eigenvecs[0][0], eigenvecs[1][0], eigenvecs[2][0]).normalize();

    // Normal vektör yönelimi: Z ekseni pozitif olacak şekilde kural belirle
    if normal.z < 0.0 || (normal.z.abs() < 1e-9 && normal.y < 0.0) {
        normal = -normal;
    }

    let d_param = -normal.dot(centroid);

    // 4. Sapmalar ve Düzlemsellik (Flatness)
    let mut min_dist = f64::MAX;
    let mut max_dist = f64::MIN;
    let mut sq_sum = 0.0;

    for p in points {
        let dist = normal.dot(*p) + d_param;
        if dist < min_dist {
            min_dist = dist;
        }
        if dist > max_dist {
            max_dist = dist;
        }
        sq_sum += dist * dist;
    }

    let flatness = max_dist - min_dist;
    let rms_error = (sq_sum / (n as f64)).sqrt();

    Ok(PlaneFitResult {
        centroid,
        normal,
        flatness,
        rms_error,
        d_param,
    })
}

/// 2 Boyutlu Düzlemde Sayısal Olarak Kararlı Merkezlenmiş (Centered) Çember Fitting
fn fit_circle_2d(pts_2d: &[(f64, f64)]) -> Result<(f64, f64, f64, f64, f64), FittingError> {
    let n = pts_2d.len();
    if n < 3 {
        return Err(FittingError::InsufficientPoints { min: 3, found: n });
    }

    let nf = n as f64;
    let mut sum_x = 0.0;
    let mut sum_y = 0.0;
    for &(x, y) in pts_2d {
        sum_x += x;
        sum_y += y;
    }
    let mean_x = sum_x / nf;
    let mean_y = sum_y / nf;

    let mut suu = 0.0;
    let mut svv = 0.0;
    let mut suv = 0.0;
    let mut su_z = 0.0;
    let mut sv_z = 0.0;

    for &(x, y) in pts_2d {
        let u = x - mean_x;
        let v = y - mean_y;
        let z = u * u + v * v;
        suu += u * u;
        svv += v * v;
        suv += u * v;
        su_z += u * z;
        sv_z += v * z;
    }

    let det = 4.0 * (suu * svv - suv * suv);
    if det.abs() < 1e-12 {
        return Err(FittingError::DegenerateGeometry);
    }

    let uc = (2.0 * (svv * su_z - suv * sv_z)) / det;
    let vc = (2.0 * (suu * sv_z - suv * su_z)) / det;

    let cx = mean_x + uc;
    let cy = mean_y + vc;

    let mut min_r = f64::MAX;
    let mut max_r = f64::MIN;
    let mut sum_r = 0.0;
    let mut sq_err = 0.0;

    let mut radii = Vec::with_capacity(n);
    for &(x, y) in pts_2d {
        let dx = x - cx;
        let dy = y - cy;
        let r = (dx * dx + dy * dy).sqrt();
        if r < min_r {
            min_r = r;
        }
        if r > max_r {
            max_r = r;
        }
        sum_r += r;
        radii.push(r);
    }

    let radius = sum_r / nf;
    for &r in &radii {
        let err = r - radius;
        sq_err += err * err;
    }

    let roundness = max_r - min_r;
    let rms = (sq_err / nf).sqrt();

    Ok((cx, cy, radius, roundness, rms))
}

/// Gauss En Küçük Kareler (Least Squares) Silindir Uydurma
pub fn fit_least_squares_cylinder(
    points: &[DVec3],
    initial_axis_hint: Option<DVec3>,
) -> Result<CylinderFitResult, FittingError> {
    let n = points.len();
    if n < 5 {
        return Err(FittingError::InsufficientPoints { min: 5, found: n });
    }

    // 1. Ağırlık merkezi
    let sum = points.iter().fold(DVec3::ZERO, |acc, p| acc + *p);
    let centroid = sum / (n as f64);

    // 2. Eksen tahmini
    let axis = if let Some(hint) = initial_axis_hint {
        let mut a = hint.normalize();
        if a.z < 0.0 || (a.z.abs() < 1e-9 && (a.y < 0.0 || (a.y.abs() < 1e-9 && a.x < 0.0))) {
            a = -a;
        }
        a
    } else {
        // Kovaryans matrisi ve 3 ana özvektör
        let mut cov = [[0.0f64; 3]; 3];
        for p in points {
            let diff = *p - centroid;
            cov[0][0] += diff.x * diff.x;
            cov[0][1] += diff.x * diff.y;
            cov[0][2] += diff.x * diff.z;
            cov[1][1] += diff.y * diff.y;
            cov[1][2] += diff.y * diff.z;
            cov[2][2] += diff.z * diff.z;
        }
        cov[1][0] = cov[0][1];
        cov[2][0] = cov[0][2];
        cov[2][1] = cov[1][2];

        let (_eigenvals, eigenvecs) = jacobi_eigen_3x3(cov);

        let mut best_axis = DVec3::Z;
        let mut min_rms = f64::MAX;

        for col in 0..3 {
            let mut cand_axis =
                DVec3::new(eigenvecs[0][col], eigenvecs[1][col], eigenvecs[2][col]).normalize();
            if cand_axis.z < 0.0 {
                cand_axis = -cand_axis;
            }

            let up = if cand_axis.z.abs() < 0.9 {
                DVec3::new(0.0, 0.0, 1.0)
            } else {
                DVec3::new(1.0, 0.0, 0.0)
            };
            let u = cand_axis.cross(up).normalize();
            let v = cand_axis.cross(u).normalize();

            let pts_2d: Vec<(f64, f64)> = points
                .iter()
                .map(|p| {
                    let diff = *p - centroid;
                    (diff.dot(u), diff.dot(v))
                })
                .collect();

            if let Ok((_, _, _, _, rms)) = fit_circle_2d(&pts_2d) {
                if rms < min_rms {
                    min_rms = rms;
                    best_axis = cand_axis;
                }
            }
        }

        best_axis
    };

    // 3. Eksene dik yerel koordinat sistemi (u, v)
    let up = if axis.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };
    let u = axis.cross(up).normalize();
    let v = axis.cross(u).normalize();

    let pts_2d: Vec<(f64, f64)> = points
        .iter()
        .map(|p| {
            let diff = *p - centroid;
            (diff.dot(u), diff.dot(v))
        })
        .collect();

    let (u_c, v_c, radius, roundness, rms_error) = fit_circle_2d(&pts_2d)?;
    let center = centroid + u * u_c + v * v_c;

    Ok(CylinderFitResult {
        center,
        axis,
        radius,
        diameter: radius * 2.0,
        roundness,
        rms_error,
    })
}

/// Chebyshev Maksimum İç Teğet (Maximum Inscribed) Silindir Uydurma
/// Hassas delikler (H7 vb.) için deliğin içine girebilecek en büyük pimi hesaplar.
pub fn fit_chebyshev_cylinder(points: &[DVec3]) -> Result<CylinderFitResult, FittingError> {
    // Önce Gauss uydurmasını baz merkez olarak al
    let gauss = fit_least_squares_cylinder(points, None)?;
    let axis = gauss.axis;

    // Eksene dik 2D izdüşüm tabanı
    let up = if axis.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };
    let u = axis.cross(up).normalize();
    let v = axis.cross(u).normalize();

    let pts_2d: Vec<(f64, f64)> = points
        .iter()
        .map(|p| {
            let diff = *p - gauss.center;
            (diff.dot(u), diff.dot(v))
        })
        .collect();

    // Chebyshev Maksimum İç Teğet:
    // r(u, v) = min_i ||p_i - (u, v)|| fonksiyonunu maksimize eden (u, v) merkezini bul.
    // Başlangıç noktası Gauss merkezi (0, 0).
    let mut best_u = 0.0;
    let mut best_v = 0.0;
    let mut best_r = pts_2d
        .iter()
        .map(|&(x, y)| (x * x + y * y).sqrt())
        .fold(f64::MAX, f64::min);

    // İnce 2D ızgara gradyan arama (alt-mikron arama)
    let mut step = 0.01; // 10 mikron
    for _ in 0..4 {
        let mut improved = true;
        while improved {
            improved = false;
            let dirs = [
                (step, 0.0),
                (-step, 0.0),
                (0.0, step),
                (0.0, -step),
                (step * 0.707, step * 0.707),
                (-step * 0.707, step * 0.707),
                (step * 0.707, -step * 0.707),
                (-step * 0.707, -step * 0.707),
            ];

            for (du, dv) in dirs {
                let cand_u = best_u + du;
                let cand_v = best_v + dv;
                let cand_r = pts_2d
                    .iter()
                    .map(|&(x, y)| {
                        let dx = x - cand_u;
                        let dy = y - cand_v;
                        (dx * dx + dy * dy).sqrt()
                    })
                    .fold(f64::MAX, f64::min);

                if cand_r > best_r {
                    best_r = cand_r;
                    best_u = cand_u;
                    best_v = cand_v;
                    improved = true;
                    break;
                }
            }
        }
        step *= 0.1; // 10 kat daha hassas arama
    }

    let center = gauss.center + u * best_u + v * best_v;
    let radius = best_r;

    // Dairesellik: En uzak nokta ile en yakın nokta arasındaki radyal fark
    let max_r = pts_2d
        .iter()
        .map(|&(x, y)| {
            let dx = x - best_u;
            let dy = y - best_v;
            (dx * dx + dy * dy).sqrt()
        })
        .fold(f64::MIN, f64::max);
    let roundness = max_r - radius;

    Ok(CylinderFitResult {
        center,
        axis,
        radius,
        diameter: radius * 2.0,
        roundness,
        rms_error: gauss.rms_error,
    })
}

/// Chebyshev Minimum Dış Teğet (Minimum Circumscribed) Silindir Uydurma
/// Miller ve şaftlar (h6, g6 vb.) için dışına geçebilecek en dar bileziği hesaplar.
pub fn fit_chebyshev_circumscribed_cylinder(
    points: &[DVec3],
) -> Result<CylinderFitResult, FittingError> {
    let gauss = fit_least_squares_cylinder(points, None)?;
    let axis = gauss.axis;

    let up = if axis.z.abs() < 0.9 {
        DVec3::new(0.0, 0.0, 1.0)
    } else {
        DVec3::new(1.0, 0.0, 0.0)
    };
    let u = axis.cross(up).normalize();
    let v = axis.cross(u).normalize();

    let pts_2d: Vec<(f64, f64)> = points
        .iter()
        .map(|p| {
            let diff = *p - gauss.center;
            (diff.dot(u), diff.dot(v))
        })
        .collect();

    // R(u, v) = max_i ||p_i - (u, v)|| fonksiyonunu minimize eden (u, v) merkezini bul.
    let mut best_u = 0.0;
    let mut best_v = 0.0;
    let mut best_r = pts_2d
        .iter()
        .map(|&(x, y)| (x * x + y * y).sqrt())
        .fold(f64::MIN, f64::max);

    let mut step = 0.01;
    for _ in 0..4 {
        let mut improved = true;
        while improved {
            improved = false;
            let dirs = [
                (step, 0.0),
                (-step, 0.0),
                (0.0, step),
                (0.0, -step),
                (step * 0.707, step * 0.707),
                (-step * 0.707, step * 0.707),
                (step * 0.707, -step * 0.707),
                (-step * 0.707, -step * 0.707),
            ];

            for (du, dv) in dirs {
                let cand_u = best_u + du;
                let cand_v = best_v + dv;
                let cand_r = pts_2d
                    .iter()
                    .map(|&(x, y)| {
                        let dx = x - cand_u;
                        let dy = y - cand_v;
                        (dx * dx + dy * dy).sqrt()
                    })
                    .fold(f64::MIN, f64::max);

                if cand_r < best_r {
                    best_r = cand_r;
                    best_u = cand_u;
                    best_v = cand_v;
                    improved = true;
                    break;
                }
            }
        }
        step *= 0.1;
    }

    let center = gauss.center + u * best_u + v * best_v;
    let radius = best_r;

    let min_r = pts_2d
        .iter()
        .map(|&(x, y)| {
            let dx = x - best_u;
            let dy = y - best_v;
            (dx * dx + dy * dy).sqrt()
        })
        .fold(f64::MAX, f64::min);
    let roundness = radius - min_r;

    Ok(CylinderFitResult {
        center,
        axis,
        radius,
        diameter: radius * 2.0,
        roundness,
        rms_error: gauss.rms_error,
    })
}

/// Serbest Yüzey Profili (Profile of a Surface) Değerlendirme Çıktısı
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SurfaceProfileEvaluation {
    /// Ölçülen nokta sayısı
    pub point_count: usize,
    /// Maksimum artı yöndeki normal sapma (mm)
    pub max_deviation: f64,
    /// Minimum eksi yöndeki normal sapma (mm)
    pub min_deviation: f64,
    /// Tepe-Vadi sapma aralığı (Peak-to-Valley = max - min) (mm)
    pub peak_to_valley: f64,
    /// Bilateral simetrik profil eşdeğeri (2 * max(|max|, |min|)) (mm)
    pub bilateral_profile_value: f64,
    /// Karesel ortalama sapma (RMS) (mm)
    pub rms_deviation: f64,
    /// ASME Y14.5 veya ISO 1101 tolerans bandına uygun mu?
    pub is_in_tolerance: bool,
    /// Tolerans sınırına kalan pay (Conformity Margin) (mm, pozitif = uygun, negatif = aşıldı)
    pub conformity_margin: f64,
}

/// ASME Y14.5 / ISO 1101 Yüzey Profili (Profile of a Surface) değerlendiricisi
pub fn evaluate_surface_profile(
    measured_points: &[DVec3],
    nominal_points: &[DVec3],
    nominal_normals: &[DVec3],
    disposition: ProfileZoneDisposition,
    total_tolerance: f64,
) -> Result<SurfaceProfileEvaluation, FittingError> {
    if measured_points.is_empty() {
        return Err(FittingError::InsufficientPoints { min: 1, found: 0 });
    }
    if measured_points.len() != nominal_points.len() || measured_points.len() != nominal_normals.len() {
        return Err(FittingError::ParseError(
            "Ölçülen nokta sayısı ile nominal nokta ve normal vektör sayıları eşit olmalıdır".into(),
        ));
    }

    let mut max_dev = f64::NEG_INFINITY;
    let mut min_dev = f64::INFINITY;
    let mut sum_sq = 0.0;

    for i in 0..measured_points.len() {
        let n = nominal_normals[i].normalize();
        let delta = (measured_points[i] - nominal_points[i]).dot(n);
        if delta > max_dev {
            max_dev = delta;
        }
        if delta < min_dev {
            min_dev = delta;
        }
        sum_sq += delta * delta;
    }

    let p_to_v = max_dev - min_dev;
    let bilateral_val = 2.0 * max_dev.abs().max(min_dev.abs());
    let rms = (sum_sq / measured_points.len() as f64).sqrt();

    let (upper_limit, lower_limit) = match disposition {
        ProfileZoneDisposition::BilateralSymmetric => (total_tolerance / 2.0, -total_tolerance / 2.0),
        ProfileZoneDisposition::UnequallyDisposed {
            total_width,
            outward_offset,
        } => (outward_offset, -(total_width - outward_offset)),
    };

    let margin_upper = upper_limit - max_dev;
    let margin_lower = min_dev - lower_limit;
    let conformity_margin = margin_upper.min(margin_lower);
    let is_in_tolerance = conformity_margin >= -1e-6;

    Ok(SurfaceProfileEvaluation {
        point_count: measured_points.len(),
        max_deviation: max_dev,
        min_deviation: min_dev,
        peak_to_valley: p_to_v,
        bilateral_profile_value: bilateral_val,
        rms_deviation: rms,
        is_in_tolerance,
        conformity_margin,
    })
}

/// ASME Y14.5 Bileşik Konum Toleransı (Composite Position) Değerlendirme Çıktısı
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CompositePositionEvaluation {
    /// PLTZF (Pattern-Locating Tolerance Zone Framework) uygun mu?
    pub pltzf_in_tolerance: bool,
    /// PLTZF maksimum ölçülen konum çapı (mm)
    pub pltzf_max_deviation_diameter: f64,
    /// PLTZF izin verilen tolerans çapı (mm)
    pub pltzf_allowed_diameter: f64,
    /// FRTZF (Feature-Relating Tolerance Zone Framework) uygun mu?
    pub frtzf_in_tolerance: bool,
    /// FRTZF maksimum ölçülen göreli konum çapı (mm)
    pub frtzf_max_deviation_diameter: f64,
    /// FRTZF izin verilen tolerans çapı (mm)
    pub frtzf_allowed_diameter: f64,
    /// FRTZF için hesaplanan en iyi örüntü hizalama ötelemesi (dx, dy)
    pub pattern_shift: (f64, f64),
    /// FRTZF için hesaplanan en iyi örüntü hizalama rotasyonu (radyan)
    pub pattern_rotation_rad: f64,
    /// Genel sonuç: Her iki çerçeve de geçerli mi?
    pub is_in_tolerance: bool,
}

/// ASME Y14.5 Çok Delikli Örüntüler için Bileşik Konum Toleransı Değerlendiricisi
/// 1. PLTZF: Deliklerin ana datum koordinat sistemindeki mutlak konum sapmalarını denetler.
/// 2. FRTZF: Deliklerin birbirine göre göreli mesafelerini (2D rijit en iyi uyum dönüşümü ile) denetler.
pub fn evaluate_composite_position_2d(
    measured_centers: &[(f64, f64)],
    nominal_centers: &[(f64, f64)],
    pltzf_tol: f64,
    frtzf_tol: f64,
) -> Result<CompositePositionEvaluation, FittingError> {
    let n = measured_centers.len();
    if n < 2 {
        return Err(FittingError::InsufficientPoints { min: 2, found: n });
    }
    if n != nominal_centers.len() {
        return Err(FittingError::ParseError(
            "Ölçülen delik sayısı ile nominal delik sayısı eşit olmalıdır".into(),
        ));
    }

    // 1. PLTZF Değerlendirmesi (Mutlak Konum Hataları)
    let mut pltzf_max_dia = 0.0;
    for i in 0..n {
        let dx = measured_centers[i].0 - nominal_centers[i].0;
        let dy = measured_centers[i].1 - nominal_centers[i].1;
        let dist = (dx * dx + dy * dy).sqrt();
        let dia = 2.0 * dist;
        if dia > pltzf_max_dia {
            pltzf_max_dia = dia;
        }
    }
    let pltzf_ok = pltzf_max_dia <= (pltzf_tol + 1e-6);

    // 2. FRTZF Değerlendirmesi: 2D Kabsch / Procrustes Rijit Uyum
    let (sum_meas_x, sum_meas_y) =
        measured_centers.iter().fold((0.0, 0.0), |acc, p| (acc.0 + p.0, acc.1 + p.1));
    let (sum_nom_x, sum_nom_y) =
        nominal_centers.iter().fold((0.0, 0.0), |acc, p| (acc.0 + p.0, acc.1 + p.1));
    let mean_meas = (sum_meas_x / n as f64, sum_meas_y / n as f64);
    let mean_nom = (sum_nom_x / n as f64, sum_nom_y / n as f64);

    let mut num = 0.0;
    let mut den = 0.0;
    for i in 0..n {
        let mx = measured_centers[i].0 - mean_meas.0;
        let my = measured_centers[i].1 - mean_meas.1;
        let nx = nominal_centers[i].0 - mean_nom.0;
        let ny = nominal_centers[i].1 - mean_nom.1;

        num += mx * ny - my * nx;
        den += mx * nx + my * ny;
    }
    let theta = num.atan2(den);
    let cos_t = theta.cos();
    let sin_t = theta.sin();

    let shift = (mean_meas.0 - mean_nom.0, mean_meas.1 - mean_nom.1);

    let mut frtzf_max_dia = 0.0;
    for i in 0..n {
        let mx = measured_centers[i].0 - mean_meas.0;
        let my = measured_centers[i].1 - mean_meas.1;

        let rot_x = mx * cos_t - my * sin_t + mean_nom.0;
        let rot_y = mx * sin_t + my * cos_t + mean_nom.1;

        let dx = rot_x - nominal_centers[i].0;
        let dy = rot_y - nominal_centers[i].1;
        let dist = (dx * dx + dy * dy).sqrt();
        let dia = 2.0 * dist;
        if dia > frtzf_max_dia {
            frtzf_max_dia = dia;
        }
    }
    let frtzf_ok = frtzf_max_dia <= (frtzf_tol + 1e-6);

    Ok(CompositePositionEvaluation {
        pltzf_in_tolerance: pltzf_ok,
        pltzf_max_deviation_diameter: pltzf_max_dia,
        pltzf_allowed_diameter: pltzf_tol,
        frtzf_in_tolerance: frtzf_ok,
        frtzf_max_deviation_diameter: frtzf_max_dia,
        frtzf_allowed_diameter: frtzf_tol,
        pattern_shift: shift,
        pattern_rotation_rad: theta,
        is_in_tolerance: pltzf_ok && frtzf_ok,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;

    #[test]
    fn test_perfect_plane_fitting() {
        let pts = vec![
            DVec3::new(0.0, 0.0, 10.0),
            DVec3::new(10.0, 0.0, 10.0),
            DVec3::new(0.0, 10.0, 10.0),
            DVec3::new(10.0, 10.0, 10.0),
        ];

        let res = fit_least_squares_plane(&pts).expect("Plane fit failed");
        assert_relative_eq!(res.normal.z, 1.0, epsilon = 1e-6);
        assert_relative_eq!(res.flatness, 0.0, epsilon = 1e-6);
        assert_relative_eq!(res.rms_error, 0.0, epsilon = 1e-6);
        assert_relative_eq!(res.centroid.z, 10.0, epsilon = 1e-6);
    }

    #[test]
    fn test_perfect_cylinder_fitting() {
        let mut pts = Vec::new();
        let r = 25.0; // Ø50
        for z in [0.0, 10.0, 20.0] {
            for i in 0..8 {
                let angle = (i as f64) * std::f64::consts::PI / 4.0;
                pts.push(DVec3::new(r * angle.cos(), r * angle.sin(), z));
            }
        }

        let res = fit_least_squares_cylinder(&pts, None).expect("Cylinder fit failed");
        assert_relative_eq!(res.diameter, 50.0, epsilon = 1e-5);
        assert_relative_eq!(res.axis.z, 1.0, epsilon = 1e-5);
        assert_relative_eq!(res.roundness, 0.0, epsilon = 1e-5);
    }

    #[test]
    fn test_ptb_plane_reference_dataset() {
        let path = "../../tests/data/ptb_pln_01.dat";
        let pts = load_ptb_test_points(path)
            .or_else(|_| load_ptb_test_points("tests/data/ptb_pln_01.dat"))
            .expect("Failed to load PTB plane dataset");

        assert_eq!(pts.len(), 25);
        let res = fit_least_squares_plane(&pts).expect("Plane fitting failed");

        // PTB Hesaplanan Flatness: 0.00262 mm (Max - Min düzlemsel sapma)
        assert_relative_eq!(res.normal.z, 1.0, epsilon = 1e-4);
        assert_relative_eq!(res.flatness, 0.002624, epsilon = 1e-4);
        assert_relative_eq!(res.centroid.x, 50.0, epsilon = 1e-3);
        assert_relative_eq!(res.centroid.y, 50.0, epsilon = 1e-3);
        assert_relative_eq!(res.centroid.z, 50.0, epsilon = 1e-3);
    }

    #[test]
    fn test_ptb_cylinder_chebyshev_evaluation() {
        let path = "../../tests/data/ptb_cyl_01.dat";
        let pts = load_ptb_test_points(path)
            .or_else(|_| load_ptb_test_points("tests/data/ptb_cyl_01.dat"))
            .expect("Failed to load PTB cylinder dataset");

        assert_eq!(pts.len(), 24);
        let res = fit_chebyshev_cylinder(&pts).expect("Chebyshev cylinder fit failed");

        // PTB Certified Nominal Diameter: 50.0023 mm
        let certified_diameter = 50.0023;
        assert_relative_eq!(res.diameter, certified_diameter, epsilon = 1e-3);
        assert_relative_eq!(res.axis.z, 1.0, epsilon = 1e-4);
    }

    #[test]
    fn test_surface_profile_evaluation() {
        let nominals = vec![
            DVec3::new(0.0, 0.0, 10.0),
            DVec3::new(10.0, 0.0, 10.0),
            DVec3::new(20.0, 0.0, 10.0),
        ];
        let normals = vec![DVec3::Z, DVec3::Z, DVec3::Z];

        // Normal doğrultusunda sapmalar: +0.03, -0.02, +0.01 mm
        let measured = vec![
            DVec3::new(0.0, 0.0, 10.03),
            DVec3::new(10.0, 0.0, 9.98),
            DVec3::new(20.0, 0.0, 10.01),
        ];

        // 1. Bilateral Simetrik Test (t = 0.10 mm -> [-0.05, +0.05])
        let eval_bilateral = evaluate_surface_profile(
            &measured,
            &nominals,
            &normals,
            ProfileZoneDisposition::BilateralSymmetric,
            0.10,
        )
        .expect("Bilateral profile evaluation failed");

        assert_relative_eq!(eval_bilateral.max_deviation, 0.03, epsilon = 1e-6);
        assert_relative_eq!(eval_bilateral.min_deviation, -0.02, epsilon = 1e-6);
        assert_relative_eq!(eval_bilateral.peak_to_valley, 0.05, epsilon = 1e-6);
        assert_relative_eq!(eval_bilateral.bilateral_profile_value, 0.06, epsilon = 1e-6);
        assert!(eval_bilateral.is_in_tolerance);

        // 2. Unilateral / Unequally Disposed Test (0.80 Ⓤ 0.20 -> [-0.60, +0.20])
        let eval_unilateral = evaluate_surface_profile(
            &measured,
            &nominals,
            &normals,
            ProfileZoneDisposition::UnequallyDisposed {
                total_width: 0.80,
                outward_offset: 0.20,
            },
            0.80,
        )
        .expect("Unilateral profile evaluation failed");

        assert!(eval_unilateral.is_in_tolerance);
        assert!(eval_unilateral.conformity_margin > 0.0);
    }

    #[test]
    fn test_composite_position_evaluation() {
        // 4 delikli dikdörtgen örüntü: [0,0], [50,0], [50,30], [0,30]
        let nominals = vec![
            (0.0, 0.0),
            (50.0, 0.0),
            (50.0, 30.0),
            (0.0, 30.0),
        ];

        // Delik grubu bir bütün olarak X'te +0.15, Y'de +0.10 mm ötelenmiş ve kusursuz rijit
        let measured = vec![
            (0.15, 0.10),
            (50.15, 0.10),
            (50.15, 30.10),
            (0.15, 30.10),
        ];

        // PLTZF (Genel konum) toleransı = 0.50 mm (sapma = 2 * sqrt(0.15^2 + 0.10^2) = ~0.36 mm <= 0.50)
        // FRTZF (Birbirine göre konum) toleransı = 0.05 mm (rijit örüntü hatası = 0.0 mm <= 0.05)
        let eval = evaluate_composite_position_2d(&measured, &nominals, 0.50, 0.05)
            .expect("Composite position eval failed");

        assert!(eval.pltzf_in_tolerance);
        assert!(eval.frtzf_in_tolerance);
        assert!(eval.is_in_tolerance);
        assert_relative_eq!(eval.frtzf_max_deviation_diameter, 0.0, epsilon = 1e-4);
    }
}


