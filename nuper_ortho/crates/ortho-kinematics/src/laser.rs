use glam::DVec3;
use ortho_ast::SensorType;
use ortho_brep::surface::ParametricFace;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct LaserScanStripe {
    pub start_point: DVec3,
    pub end_point: DVec3,
    pub optical_axis: DVec3,
    pub stripe_width_mm: f64,
    pub standoff_distance_mm: f64,
    pub estimated_points: usize,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PointDeviation {
    pub point: DVec3,
    pub nearest_cad_point: DVec3,
    pub normal_deviation: f64,
    pub color_rgb: [f32; 3],
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ScanDeviationSummary {
    pub min_deviation: f64,
    pub max_deviation: f64,
    pub mean_deviation: f64,
    pub std_deviation: f64,
    pub point_count: usize,
}

pub fn deviation_to_rgb(deviation: f64, max_tol: f64) -> [f32; 3] {
    let norm_val = (deviation / max_tol.max(1e-6)).clamp(-1.0, 1.0);
    if norm_val < 0.0 {
        let t = (norm_val + 1.0) as f32;
        [0.0, t, 1.0 - t]
    } else {
        let t = norm_val as f32;
        [t, 1.0 - t, 0.0]
    }
}

pub struct LaserScanPlanner;

impl LaserScanPlanner {
    pub fn plan_stripes_for_surface(
        surface: &ParametricFace,
        sensor: &SensorType,
        step_over_overlap: f64,
    ) -> Result<Vec<LaserScanStripe>, String> {
        let (width, standoff, density) = match sensor {
            SensorType::OpticalLaserLine {
                stripe_width_mm,
                standoff_distance_mm,
                point_density_pts_per_mm,
            } => (*stripe_width_mm, *standoff_distance_mm, *point_density_pts_per_mm),
            _ => return Err("Lazer tarama planı için SensorType::OpticalLaserLine gereklidir".to_string()),
        };

        let effective_step_over = width * (1.0 - step_over_overlap.clamp(0.0, 0.8));
        let mut stripes = Vec::new();

        let num_stripes = ((surface.v_max - surface.v_min) * 50.0 / effective_step_over).ceil().max(2.0) as usize;

        for i in 0..num_stripes {
            let v_ratio = (i as f64 + 0.5) / (num_stripes as f64);
            let v = surface.v_min + v_ratio * (surface.v_max - surface.v_min);

            let pt_start = surface.evaluate_point(surface.u_min, v);
            let pt_end = surface.evaluate_point(surface.u_max, v);
            let n_start = surface.evaluate_normal(surface.u_min, v);

            let optical_start = pt_start + n_start * standoff;
            let optical_end = pt_end + n_start * standoff;

            let length = (pt_end - pt_start).length();
            let estimated_points = (length * density * (width / 10.0)).round() as usize;

            stripes.push(LaserScanStripe {
                start_point: optical_start,
                end_point: optical_end,
                optical_axis: -n_start,
                stripe_width_mm: width,
                standoff_distance_mm: standoff,
                estimated_points,
            });
        }

        Ok(stripes)
    }

    pub fn plan_boustrophedon_stripes(
        surface: &ParametricFace,
        sensor: &SensorType,
        step_over_overlap: f64,
    ) -> Result<Vec<LaserScanStripe>, String> {
        let mut stripes = Self::plan_stripes_for_surface(surface, sensor, step_over_overlap)?;
        for (i, stripe) in stripes.iter_mut().enumerate() {
            if i % 2 == 1 {
                std::mem::swap(&mut stripe.start_point, &mut stripe.end_point);
            }
        }
        Ok(stripes)
    }
}

pub struct ScanToCadAnalyzer;

impl ScanToCadAnalyzer {
    pub fn analyze_point_cloud_against_plane(
        points: &[DVec3],
        plane_origin: DVec3,
        plane_normal: DVec3,
        tolerance_band: f64,
    ) -> (Vec<PointDeviation>, ScanDeviationSummary) {
        let normal = plane_normal.normalize();
        let mut deviations = Vec::with_capacity(points.len());
        let mut sum_dev = 0.0;
        let mut min_dev = f64::MAX;
        let mut max_dev = f64::MIN;

        for p in points {
            let diff = *p - plane_origin;
            let signed_dev = diff.dot(normal);
            let projected_point = *p - signed_dev * normal;
            let color = deviation_to_rgb(signed_dev, tolerance_band);

            if signed_dev < min_dev {
                min_dev = signed_dev;
            }
            if signed_dev > max_dev {
                max_dev = signed_dev;
            }
            sum_dev += signed_dev;

            deviations.push(PointDeviation {
                point: *p,
                nearest_cad_point: projected_point,
                normal_deviation: signed_dev,
                color_rgb: color,
            });
        }

        let n = points.len() as f64;
        let mean = if n > 0.0 { sum_dev / n } else { 0.0 };
        let mut var_sum = 0.0;
        for d in &deviations {
            let err = d.normal_deviation - mean;
            var_sum += err * err;
        }
        let std = if n > 0.0 { (var_sum / n).sqrt() } else { 0.0 };

        (
            deviations,
            ScanDeviationSummary {
                min_deviation: min_dev,
                max_deviation: max_dev,
                mean_deviation: mean,
                std_deviation: std,
                point_count: points.len(),
            },
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_laser_stripe_generation() {
        let face = ParametricFace::new_plane(1, DVec3::new(0.0, 0.0, 50.0), DVec3::Z, 100.0, 100.0);
        let laser = SensorType::OpticalLaserLine {
            stripe_width_mm: 50.0,
            standoff_distance_mm: 80.0,
            point_density_pts_per_mm: 20.0,
        };

        let stripes = LaserScanPlanner::plan_stripes_for_surface(&face, &laser, 0.20)
            .expect("Lazer şeritleri başarıyla üretilmeli");

        assert!(!stripes.is_empty(), "En az bir lazer şeridi üretilmeli");
        for stripe in &stripes {
            assert_eq!(stripe.stripe_width_mm, 50.0);
            assert_eq!(stripe.standoff_distance_mm, 80.0);
            assert!(stripe.start_point.z >= 130.0);
            assert!(stripe.estimated_points > 0);
        }
    }

    #[test]
    fn test_boustrophedon_alternating_direction() {
        let face = ParametricFace::new_plane(1, DVec3::new(0.0, 0.0, 50.0), DVec3::Z, 100.0, 100.0);
        let laser = SensorType::OpticalLaserLine {
            stripe_width_mm: 40.0,
            standoff_distance_mm: 65.0,
            point_density_pts_per_mm: 10.0,
        };

        let stripes = LaserScanPlanner::plan_boustrophedon_stripes(&face, &laser, 0.30)
            .expect("Boustrophedon şeritleri üretilmeli");

        assert!(stripes.len() >= 2);
        let s0 = &stripes[0];
        let s1 = &stripes[1];
        assert!((s0.start_point.y - s1.end_point.y).abs() < 1e-4);
        assert!((s0.end_point.y - s1.start_point.y).abs() < 1e-4);
    }

    #[test]
    fn test_scan_to_cad_point_cloud_analysis() {
        let mut pts = Vec::with_capacity(1000);
        for i in 0..1000 {
            let x = (i % 30) as f64 * 3.0;
            let y = (i / 30) as f64 * 3.0;
            let dev = if i % 2 == 0 { 0.015 } else { -0.010 };
            pts.push(DVec3::new(x, y, 50.0 + dev));
        }

        let (devs, summary) = ScanToCadAnalyzer::analyze_point_cloud_against_plane(
            &pts,
            DVec3::new(0.0, 0.0, 50.0),
            DVec3::Z,
            0.05,
        );

        assert_eq!(devs.len(), 1000);
        assert_eq!(summary.point_count, 1000);
        assert!((summary.min_deviation - (-0.010)).abs() < 1e-4);
        assert!((summary.max_deviation - 0.015).abs() < 1e-4);
    }
}
