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

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StylusAssembly {
    pub ball_radius: f64,
    pub stem_radius: f64,
    pub stem_length: f64,
    pub module_radius: f64,
    pub module_length: f64,
}

impl Default for StylusAssembly {
    fn default() -> Self {
        Self {
            ball_radius: 1.0,
            stem_radius: 0.75,
            stem_length: 20.0,
            module_radius: 6.6,
            module_length: 30.0,
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

    pub fn max_safe_depth(&self) -> f64 {
        self.stem_length - (self.ball_radius - self.stem_radius)
    }

    pub fn validate_bore_clearance(&self, hole_diameter: f64, hole_depth: f64) -> Result<(), StylusError> {
        let hole_radius = hole_diameter / 2.0;
        let radial_clearance = hole_radius - self.stem_radius;
        let min_required_clearance = 0.5;
        if radial_clearance < min_required_clearance {
            return Err(StylusError::ShankRubbing {
                clearance: radial_clearance,
                min_clearance: min_required_clearance,
            });
        }

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

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ProbeRackPort {
    pub port_id: usize,
    pub stylus_id: String,
    pub dock_pos: glam::DVec3,
    pub approach_vec: glam::DVec3,
    pub is_occupied: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ProbeChangeWaypoint {
    pub step_index: usize,
    pub name: String,
    pub target: glam::DVec3,
    pub speed_mms: f64,
    pub action: String,
}

pub fn plan_mcr20_probe_change(
    current_pos: glam::DVec3,
    current_port: &ProbeRackPort,
    target_port: &ProbeRackPort,
    safe_altitude_z: f64,
) -> Vec<ProbeChangeWaypoint> {
    let mut waypoints = Vec::with_capacity(8);

    let app_vec_curr = current_port.approach_vec.normalize();
    let curr_pre_dock = current_port.dock_pos - app_vec_curr * 50.0;
    let curr_elevated = current_port.dock_pos + glam::DVec3::new(0.0, 0.0, 15.0);

    let app_vec_tgt = target_port.approach_vec.normalize();
    let tgt_pre_dock = target_port.dock_pos - app_vec_tgt * 50.0;
    let tgt_elevated = target_port.dock_pos + glam::DVec3::new(0.0, 0.0, 15.0);

    waypoints.push(ProbeChangeWaypoint {
        step_index: 1,
        name: "RetractToSafeAltitude".to_string(),
        target: glam::DVec3::new(current_pos.x, current_pos.y, safe_altitude_z),
        speed_mms: 150.0,
        action: "Traverse".to_string(),
    });

    waypoints.push(ProbeChangeWaypoint {
        step_index: 2,
        name: "MoveAboveOldPortApproach".to_string(),
        target: glam::DVec3::new(curr_pre_dock.x, curr_pre_dock.y, safe_altitude_z),
        speed_mms: 150.0,
        action: "Traverse".to_string(),
    });

    waypoints.push(ProbeChangeWaypoint {
        step_index: 3,
        name: "DescendToApproachHeight".to_string(),
        target: curr_pre_dock,
        speed_mms: 50.0,
        action: "Descent".to_string(),
    });

    waypoints.push(ProbeChangeWaypoint {
        step_index: 4,
        name: "EnterPortReleaseLock".to_string(),
        target: current_port.dock_pos,
        speed_mms: 20.0,
        action: "DockRelease".to_string(),
    });

    waypoints.push(ProbeChangeWaypoint {
        step_index: 5,
        name: "AscendLeavingModule".to_string(),
        target: curr_elevated,
        speed_mms: 20.0,
        action: "ModuleRelease".to_string(),
    });

    waypoints.push(ProbeChangeWaypoint {
        step_index: 6,
        name: "MoveAboveNewPort".to_string(),
        target: glam::DVec3::new(tgt_elevated.x, tgt_elevated.y, safe_altitude_z),
        speed_mms: 150.0,
        action: "Traverse".to_string(),
    });

    waypoints.push(ProbeChangeWaypoint {
        step_index: 7,
        name: "DescendAndEngageLock".to_string(),
        target: target_port.dock_pos,
        speed_mms: 20.0,
        action: "DockEngage".to_string(),
    });

    waypoints.push(ProbeChangeWaypoint {
        step_index: 8,
        name: "ExitPortToSafeAltitude".to_string(),
        target: glam::DVec3::new(tgt_pre_dock.x, tgt_pre_dock.y, safe_altitude_z),
        speed_mms: 50.0,
        action: "Retract".to_string(),
    });

    waypoints
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

    #[test]
    fn test_mcr20_probe_change_planning() {
        let port1 = ProbeRackPort {
            port_id: 1,
            stylus_id: "STYLUS_DIA2_L20".to_string(),
            dock_pos: glam::DVec3::new(50.0, -100.0, 40.0),
            approach_vec: glam::DVec3::new(0.0, 1.0, 0.0),
            is_occupied: true,
        };
        let port2 = ProbeRackPort {
            port_id: 2,
            stylus_id: "STYLUS_DIA4_L50".to_string(),
            dock_pos: glam::DVec3::new(100.0, -100.0, 40.0),
            approach_vec: glam::DVec3::new(0.0, 1.0, 0.0),
            is_occupied: false,
        };

        let waypoints = plan_mcr20_probe_change(
            glam::DVec3::new(200.0, 150.0, 60.0),
            &port1,
            &port2,
            150.0,
        );

        assert_eq!(waypoints.len(), 8);
        assert_eq!(waypoints[0].target.z, 150.0);
        assert_eq!(waypoints[3].speed_mms, 20.0);
        assert_eq!(waypoints[6].speed_mms, 20.0);
        assert_eq!(waypoints[6].target, port2.dock_pos);
    }
}
