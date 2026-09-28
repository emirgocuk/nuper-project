//! # Hibrit Metroloji: Optik Lazer Çizgi Tarama Yolu Üreticisi (Doc 11 Bölüm 2)
//!
//! Dokunmatik probun erişemediği veya yoğun nokta bulutu gerektiren serbest formlu yüzeyler için
//! optik lazer tarayıcı (Hexagon RS6, Zeiss LineScan) paralel tarama şeritleri (scan stripes) üretir.

use glam::DVec3;
use serde::{Deserialize, Serialize};
use ortho_ast::SensorType;
use ortho_brep::surface::ParametricFace;

/// Lazer Tarama Şeridi (Laser Scan Stripe)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct LaserScanStripe {
    /// Şerit başlangıç noktası (sensör optik merkezi)
    pub start_point: DVec3,
    /// Şerit bitiş noktası
    pub end_point: DVec3,
    /// Yüzeye dik yaklaşma normali (Kamera görüş ekseni)
    pub optical_axis: DVec3,
    /// Lazer çizgi genişliği (mm)
    pub stripe_width_mm: f64,
    /// Çalışma mesafesi (Standoff distance, mm)
    pub standoff_distance_mm: f64,
    /// Tahmini nokta sayısı
    pub estimated_points: usize,
}

pub struct LaserScanPlanner;

impl LaserScanPlanner {
    /// Serbest yüzey üzerinde paralel lazer tarama şeritleri üretir
    pub fn plan_stripes_for_surface(
        surface: &ParametricFace,
        sensor: &SensorType,
        step_over_overlap: f64, // Örn: %20 örtüşme (overlap = 0.20)
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

        // U yönünde ilerleyen şeritler, V yönünde adımlama
        let num_stripes = ((surface.v_max - surface.v_min) * 50.0 / effective_step_over).ceil().max(2.0) as usize;

        for i in 0..num_stripes {
            let v_ratio = (i as f64 + 0.5) / (num_stripes as f64);
            let v = surface.v_min + v_ratio * (surface.v_max - surface.v_min);

            let pt_start = surface.evaluate_point(surface.u_min, v);
            let pt_end = surface.evaluate_point(surface.u_max, v);
            let n_start = surface.evaluate_normal(surface.u_min, v);

            // Standoff mesafesi kadar normal doğrultusunda yukarı kaldır
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
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_laser_stripe_generation() {
        let face = ParametricFace::sample_plane_z50();
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
            assert!(stripe.start_point.z >= 130.0, "Standoff (80mm) + Z (50mm) = 130mm olmalı");
            assert!(stripe.estimated_points > 0);
        }
    }
}
