//! # ortho-router::stylus
//! 
//! Prob gövdesi, yakut bilye ve TP20 şaft geometrisi modellemesi.
//! Şaft sürtünmesi (shank rub) ve prob gövdesi çarpışmalarını fiziksel sınırlarla denetler.

use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum StylusError {
    #[error("TP20 Gövde Çarpışması: Delik derinliği ({depth:.2} mm) şaft boyunu ({length:.2} mm) aşıyor ve delik yarıçapı ({radius:.2} mm) gövde yarıçapından ({module_r:.2} mm) dar")]
    ModuleGouging {
        depth: f64,
        length: f64,
        radius: f64,
        module_r: f64,
    },

    #[error("Şaft Kenar Sürtünmesi: Şaft ile delik ağzı arasındaki radyal boşluk ({clearance:.2} mm) minimum emniyet sınırının ({min_clearance:.2} mm) altında")]
    ShankRubbing {
        clearance: f64,
        min_clearance: f64,
    },
}

/// Standart CMM Prob Montaj Geometrisi (Renishaw TP20 / TP200 / SP25)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StylusAssembly {
    /// Yakut bilye yarıçapı R_ball (mm) (Standart: Ø2mm -> 1.0mm, Ø4mm -> 2.0mm)
    pub ball_radius: f64,
    /// Şaft gövdesi yarıçapı R_stem (mm) (Standart paslanmaz çelik/tungsten karbür: 0.75 - 1.0 mm)
    pub stem_radius: f64,
    /// Şaft serbest boyu L_stem (mm) (Standart: 20.0, 30.0, 50.0 mm)
    pub stem_length: f64,
    /// TP20 modül gövde yarıçapı R_module (mm) (Renishaw TP20 standart: Ø13.2mm -> 6.6 mm)
    pub module_radius: f64,
    /// TP20 modül gövde boyu L_module (mm)
    pub module_length: f64,
}

impl Default for StylusAssembly {
    /// Varsayılan endüstriyel prob konfigürasyonu: Ø2x20mm prob + TP20 modül
    fn default() -> Self {
        Self {
            ball_radius: 1.0,      // Ø2.0 mm Yakut
            stem_radius: 0.75,     // Ø1.5 mm Şaft
            stem_length: 20.0,     // 20 mm boy
            module_radius: 6.6,    // Ø13.2 mm TP20 gövde
            module_length: 30.0,   // 30 mm gövde boyu
        }
    }
}

impl StylusAssembly {
    pub fn new(
        ball_radius: f64,
        stem_radius: f64,
        stem_length: f64,
        module_radius: f64,
        module_length: f64,
    ) -> Self {
        Self {
            ball_radius,
            stem_radius,
            stem_length,
            module_radius,
            module_length,
        }
    }

    /// Maksimum güvenli ölçüm derinliği (Bilyenin ekvator hattından şaft bağlantısına kadar)
    pub fn max_safe_depth(&self) -> f64 {
        self.stem_length - (self.ball_radius - self.stem_radius)
    }

    /// Bir deliğe probun güvenle dalıp dalamayacağını ve şaft sürtünmesi olup olmadığını doğrular
    pub fn validate_bore_clearance(&self, hole_diameter: f64, hole_depth: f64) -> Result<(), StylusError> {
        let hole_radius = hole_diameter / 2.0;

        // 1. Şaft sürtünmesi (min 1.0 mm radyal güvenlik payı)
        let radial_clearance = hole_radius - self.stem_radius;
        let min_required_clearance = 0.5; // Minimum 0.5 mm boşluk
        if radial_clearance < min_required_clearance {
            return Err(StylusError::ShankRubbing {
                clearance: radial_clearance,
                min_clearance: min_required_clearance,
            });
        }

        // 2. TP20 gövde dalışı kontrolü: Delik boyu şafttan derinse ve delik TP20'den darsa çarpışma!
        if hole_depth > self.stem_length {
            let module_margin = 1.0;
            if hole_radius < (self.module_radius + module_margin) {
                return Err(StylusError::ModuleGouging {
                    depth: hole_depth,
                    length: self.stem_length,
                    radius: hole_radius,
                    module_r: self.module_radius,
                });
            }
        }

        Ok(())
    }

    /// Bir geometrik unsurun bu prob donanımıyla erişilebilir olup olmadığını analiz eder (Unreachable Feature Flag)
    pub fn check_feature_reachability(
        &self,
        feature_id: u32,
        diameter: Option<f64>,
        depth: Option<f64>,
    ) -> ReachabilityReport {
        if let (Some(d), Some(l)) = (diameter, depth) {
            match self.validate_bore_clearance(d, l) {
                Ok(_) => ReachabilityReport {
                    feature_id,
                    is_reachable: true,
                    failure_reason: None,
                },
                Err(e) => ReachabilityReport {
                    feature_id,
                    is_reachable: false,
                    failure_reason: Some(e.to_string()),
                },
            }
        } else {
            ReachabilityReport {
                feature_id,
                is_reachable: true,
                failure_reason: None,
            }
        }
    }
}

/// Ulaşılamayan Unsur Teşhis Raporu (Unreachable Feature Flag - Doc 08 Section 6)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ReachabilityReport {
    pub feature_id: u32,
    pub is_reachable: bool,
    pub failure_reason: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum StylusType {
    StraightSingle { length_mm: f64, ball_radius_mm: f64 },
    Star5Way { arm_length_mm: f64, ball_radius_mm: f64 },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StylusConfiguration {
    pub stylus_type: StylusType,
    pub active_tip_index: usize,
    pub ph10_a_deg: f64,
    pub ph10_b_deg: f64,
    pub ph10_label: String,
    pub effective_diameter_mm: f64,
}

pub fn select_optimal_stylus_configuration(
    housing_collision: bool,
    feature_normal: [f64; 3],
) -> StylusConfiguration {
    if housing_collision {
        let nx = feature_normal[0];
        let ny = feature_normal[1];
        let nz = feature_normal[2];
        let ax = nx.abs();
        let ay = ny.abs();
        let az = nz.abs();

        let tip_index = if az >= ax && az >= ay {
            1
        } else if ax >= ay && ax >= az {
            if nx >= 0.0 { 2 } else { 4 }
        } else {
            if ny >= 0.0 { 3 } else { 5 }
        };

        StylusConfiguration {
            stylus_type: StylusType::Star5Way { arm_length_mm: 30.0, ball_radius_mm: 1.0 },
            active_tip_index: tip_index,
            ph10_a_deg: 0.0,
            ph10_b_deg: 0.0,
            ph10_label: "A0.0° B0.0°".to_string(),
            effective_diameter_mm: 1.9992,
        }
    } else {
        StylusConfiguration {
            stylus_type: StylusType::StraightSingle { length_mm: 20.0, ball_radius_mm: 1.0 },
            active_tip_index: 1,
            ph10_a_deg: 0.0,
            ph10_b_deg: 0.0,
            ph10_label: "A0.0° B0.0°".to_string(),
            effective_diameter_mm: 1.9996,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_bore_access() {
        let stylus = StylusAssembly::default();
        assert!(stylus.validate_bore_clearance(15.0, 15.0).is_ok());
    }

    #[test]
    fn test_shank_rubbing_detected() {
        let stylus = StylusAssembly::default();
        let res = stylus.validate_bore_clearance(1.6, 10.0);
        assert!(matches!(res, Err(StylusError::ShankRubbing { .. })));
    }

    #[test]
    fn test_module_gouging_detected() {
        let stylus = StylusAssembly::default();
        let res = stylus.validate_bore_clearance(10.0, 35.0);
        assert!(matches!(res, Err(StylusError::ModuleGouging { .. })));
    }

    #[test]
    fn test_reachability_report_flagging() {
        let stylus = StylusAssembly::default();
        let rep1 = stylus.check_feature_reachability(1, Some(15.0), Some(15.0));
        assert!(rep1.is_reachable);
        assert!(rep1.failure_reason.is_none());

        let rep2 = stylus.check_feature_reachability(2, Some(10.0), Some(35.0));
        assert!(!rep2.is_reachable);
        assert!(rep2.failure_reason.is_some());
    }

    #[test]
    fn test_optimal_stylus_configuration_star_selection() {
        let cfg_normal = select_optimal_stylus_configuration(false, [0.0, 0.0, 1.0]);
        assert_eq!(cfg_normal.active_tip_index, 1);
        assert!(matches!(cfg_normal.stylus_type, StylusType::StraightSingle { .. }));

        let cfg_collision_x = select_optimal_stylus_configuration(true, [1.0, 0.0, 0.0]);
        assert_eq!(cfg_collision_x.active_tip_index, 2);
        assert_eq!(cfg_collision_x.ph10_label, "A0.0° B0.0°");
        assert!(matches!(cfg_collision_x.stylus_type, StylusType::Star5Way { .. }));
    }
}
