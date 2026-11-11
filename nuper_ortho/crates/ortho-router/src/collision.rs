use glam::DVec3;
use parry3d::math::{Isometry, Point, Real, Vector};
use parry3d::query;
use parry3d::shape::{Capsule, Cuboid};
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::clearance::{ClearanceBox, KeepOutZone};
use crate::stylus::StylusAssembly;
use crate::MotionSegment;

#[derive(Error, Debug, PartialEq)]
pub enum CollisionError {
    #[error("Kritik Çarpışma: '{obstacle_name}' engeline temas tespit edildi (Başlangıç: {start:?}, Bitiş: {end:?})")]
    CollisionDetected {
        obstacle_name: String,
        start: DVec3,
        end: DVec3,
    },

    #[error("Ölçüm Temas Hatası: Ölçüm noktası ({touch:?}) yasaklı bölge içinde")]
    TouchPointInsideObstacle {
        obstacle_name: String,
        touch: DVec3,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CollisionReport {
    pub obstacle_name: String,
    pub segment_start: DVec3,
    pub segment_end: DVec3,
    pub description: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BvhAabb {
    pub min: DVec3,
    pub max: DVec3,
}

impl BvhAabb {
    pub fn from_points(p1: DVec3, p2: DVec3, radius: f64) -> Self {
        Self {
            min: DVec3::new(
                p1.x.min(p2.x) - radius,
                p1.y.min(p2.y) - radius,
                p1.z.min(p2.z) - radius,
            ),
            max: DVec3::new(
                p1.x.max(p2.x) + radius,
                p1.y.max(p2.y) + radius,
                p1.z.max(p2.z) + radius,
            ),
        }
    }

    pub fn from_keep_out(zone: &KeepOutZone) -> Self {
        Self {
            min: zone.min,
            max: zone.max,
        }
    }

    pub fn intersects(&self, other: &BvhAabb) -> bool {
        self.max.x >= other.min.x
            && self.min.x <= other.max.x
            && self.max.y >= other.min.y
            && self.min.y <= other.max.y
            && self.max.z >= other.min.z
            && self.min.z <= other.max.z
    }

    pub fn union(&self, other: &BvhAabb) -> Self {
        Self {
            min: DVec3::new(
                self.min.x.min(other.min.x),
                self.min.y.min(other.min.y),
                self.min.z.min(other.min.z),
            ),
            max: DVec3::new(
                self.max.x.max(other.max.x),
                self.max.y.max(other.max.y),
                self.max.z.max(other.max.z),
            ),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BvhNode {
    pub aabb: BvhAabb,
    pub left: Option<Box<BvhNode>>,
    pub right: Option<Box<BvhNode>>,
    pub obstacle_indices: Vec<usize>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BvhTree {
    pub root: Option<BvhNode>,
    pub obstacles: Vec<KeepOutZone>,
}

impl BvhTree {
    pub fn build(obstacles: Vec<KeepOutZone>) -> Self {
        if obstacles.is_empty() {
            return Self {
                root: None,
                obstacles,
            };
        }

        let indices: Vec<usize> = (0..obstacles.len()).collect();
        let root = Self::build_recursive(&indices, &obstacles);

        Self {
            root: Some(root),
            obstacles,
        }
    }

    fn build_recursive(indices: &[usize], obstacles: &[KeepOutZone]) -> BvhNode {
        let mut aabb = BvhAabb::from_keep_out(&obstacles[indices[0]]);
        for &idx in &indices[1..] {
            let next_aabb = BvhAabb::from_keep_out(&obstacles[idx]);
            aabb = aabb.union(&next_aabb);
        }

        if indices.len() <= 2 {
            return BvhNode {
                aabb,
                left: None,
                right: None,
                obstacle_indices: indices.to_vec(),
            };
        }

        let extent = aabb.max - aabb.min;
        let axis = if extent.x >= extent.y && extent.x >= extent.z {
            0
        } else if extent.y >= extent.x && extent.y >= extent.z {
            1
        } else {
            2
        };

        let mut sorted_indices = indices.to_vec();
        sorted_indices.sort_by(|&a, &b| {
            let ca = (obstacles[a].min + obstacles[a].max) * 0.5;
            let cb = (obstacles[b].min + obstacles[b].max) * 0.5;
            let val_a = if axis == 0 { ca.x } else if axis == 1 { ca.y } else { ca.z };
            let val_b = if axis == 0 { cb.x } else if axis == 1 { cb.y } else { cb.z };
            val_a.partial_cmp(&val_b).unwrap_or(std::cmp::Ordering::Equal)
        });

        let mid = sorted_indices.len() / 2;
        let left = Box::new(Self::build_recursive(&sorted_indices[..mid], obstacles));
        let right = Box::new(Self::build_recursive(&sorted_indices[mid..], obstacles));

        BvhNode {
            aabb,
            left: Some(left),
            right: Some(right),
            obstacle_indices: Vec::new(),
        }
    }

    pub fn query_candidates(&self, query_aabb: &BvhAabb, candidates: &mut Vec<usize>) {
        if let Some(ref root) = self.root {
            Self::query_node(root, query_aabb, candidates);
        }
    }

    fn query_node(node: &BvhNode, query_aabb: &BvhAabb, candidates: &mut Vec<usize>) {
        if !node.aabb.intersects(query_aabb) {
            return;
        }

        if !node.obstacle_indices.is_empty() {
            candidates.extend_from_slice(&node.obstacle_indices);
            return;
        }

        if let Some(ref left) = node.left {
            Self::query_node(left, query_aabb, candidates);
        }
        if let Some(ref right) = node.right {
            Self::query_node(right, query_aabb, candidates);
        }
    }

    pub fn query_collision(&self, start: DVec3, end: DVec3, radius: f64) -> Option<usize> {
        let query_aabb = BvhAabb::from_points(start, end, radius);
        let mut candidates = Vec::new();
        self.query_candidates(&query_aabb, &mut candidates);

        for idx in candidates {
            if test_swept_capsule_obstacle(start, end, radius, &self.obstacles[idx]) {
                return Some(idx);
            }
        }
        None
    }
}

pub fn test_swept_capsule_obstacle(
    start: DVec3,
    end: DVec3,
    radius: f64,
    obstacle: &KeepOutZone,
) -> bool {
    let seg_min_x = start.x.min(end.x) - radius;
    let seg_max_x = start.x.max(end.x) + radius;
    let seg_min_y = start.y.min(end.y) - radius;
    let seg_max_y = start.y.max(end.y) + radius;
    let seg_min_z = start.z.min(end.z) - radius;
    let seg_max_z = start.z.max(end.z) + radius;

    if seg_max_x < obstacle.min.x
        || seg_min_x > obstacle.max.x
        || seg_max_y < obstacle.min.y
        || seg_min_y > obstacle.max.y
        || seg_max_z < obstacle.min.z
        || seg_min_z > obstacle.max.z
    {
        return false;
    }

    let p1 = Point::new(start.x as Real, start.y as Real, start.z as Real);
    let p2 = Point::new(end.x as Real, end.y as Real, end.z as Real);

    let capsule = if (start - end).length_squared() < 1e-6 {
        let p_offset = Point::new(start.x as Real, start.y as Real, (start.z + 0.001) as Real);
        Capsule::new(p1, p_offset, radius as Real)
    } else {
        Capsule::new(p1, p2, radius as Real)
    };

    let obs_center = (obstacle.min + obstacle.max) * 0.5;
    let obs_half_extents = (obstacle.max - obstacle.min) * 0.5;

    let cuboid = Cuboid::new(Vector::new(
        obs_half_extents.x as Real,
        obs_half_extents.y as Real,
        obs_half_extents.z as Real,
    ));

    let cuboid_pos = Isometry::translation(
        obs_center.x as Real,
        obs_center.y as Real,
        obs_center.z as Real,
    );
    let capsule_pos = Isometry::identity();

    query::intersection_test(&capsule_pos, &capsule, &cuboid_pos, &cuboid).unwrap_or(false)
}

pub fn compute_penetration_mtv(
    start: DVec3,
    end: DVec3,
    radius: f64,
    obstacle: &KeepOutZone,
) -> Option<DVec3> {
    let p1 = Point::new(start.x as Real, start.y as Real, start.z as Real);
    let p2 = Point::new(end.x as Real, end.y as Real, end.z as Real);

    let capsule = if (start - end).length_squared() < 1e-6 {
        let p_offset = Point::new(start.x as Real, start.y as Real, (start.z + 0.001) as Real);
        Capsule::new(p1, p_offset, radius as Real)
    } else {
        Capsule::new(p1, p2, radius as Real)
    };

    let obs_center = (obstacle.min + obstacle.max) * 0.5;
    let obs_half_extents = (obstacle.max - obstacle.min) * 0.5;

    let cuboid = Cuboid::new(Vector::new(
        obs_half_extents.x as Real,
        obs_half_extents.y as Real,
        obs_half_extents.z as Real,
    ));

    let cuboid_pos = Isometry::translation(
        obs_center.x as Real,
        obs_center.y as Real,
        obs_center.z as Real,
    );
    let capsule_pos = Isometry::identity();

    if let Ok(Some(contact)) = query::contact(&capsule_pos, &capsule, &cuboid_pos, &cuboid, 0.0) {
        if contact.dist < 0.0 {
            let depth = -contact.dist as f64;
            let normal = DVec3::new(
                contact.normal1.x as f64,
                contact.normal1.y as f64,
                contact.normal1.z as f64,
            );
            return Some(normal * depth);
        }
    }
    None
}

pub fn generate_lift_and_hop(
    start: DVec3,
    end: DVec3,
    obstacle: &KeepOutZone,
    clearance_z: f64,
) -> Vec<MotionSegment> {
    generate_3point_detour(start, end, obstacle, clearance_z)
}

pub fn generate_3point_detour(
    start: DVec3,
    end: DVec3,
    obstacle: &KeepOutZone,
    clearance_z: f64,
) -> Vec<MotionSegment> {
    let hop_z = (obstacle.max.z + 40.0).max(clearance_z);

    vec![
        MotionSegment::RapidLinear {
            target: DVec3::new(start.x, start.y, hop_z),
        },
        MotionSegment::RapidLinear {
            target: DVec3::new(end.x, end.y, hop_z),
        },
        MotionSegment::RapidLinear { target: end },
    ]
}

pub fn ccd_check_trajectory(
    trajectory: &[MotionSegment],
    bvh: &BvhTree,
    radius: f64,
) -> Vec<CollisionReport> {
    let mut reports = Vec::new();
    let mut current_pos = DVec3::ZERO;

    for seg in trajectory {
        match seg {
            MotionSegment::RapidLinear { target } => {
                if let Some(hit_idx) = bvh.query_collision(current_pos, *target, radius) {
                    let obs = &bvh.obstacles[hit_idx];
                    reports.push(CollisionReport {
                        obstacle_name: obs.name.clone(),
                        segment_start: current_pos,
                        segment_end: *target,
                        description: format!("CCD temas: {}", obs.name),
                    });
                }
                current_pos = *target;
            }
            MotionSegment::TouchApproach { target, .. } | MotionSegment::Retract { target } => {
                current_pos = *target;
            }
            MotionSegment::RotateHead { .. } => {}
        }
    }
    reports
}

pub fn resolve_collision_free_path(
    raw_segments: &[MotionSegment],
    clearance_box: &ClearanceBox,
    keep_outs: &[KeepOutZone],
    stylus: &StylusAssembly,
) -> Result<Vec<MotionSegment>, CollisionError> {
    let bvh = BvhTree::build(keep_outs.to_vec());
    let mut resolved_segments = Vec::with_capacity(raw_segments.len() * 2);
    let mut current_pos = DVec3::new(0.0, 0.0, clearance_box.z_clearance);

    let collision_radius = stylus.ball_radius.max(stylus.stem_radius) + 1.0;

    for segment in raw_segments {
        match segment {
            MotionSegment::RapidLinear { target } => {
                let target_pt = *target;
                let collided_idx = bvh.query_collision(current_pos, target_pt, collision_radius);

                if let Some(idx) = collided_idx {
                    let obstacle = &bvh.obstacles[idx];
                    let hop_segments = generate_3point_detour(
                        current_pos,
                        target_pt,
                        obstacle,
                        clearance_box.z_clearance,
                    );
                    resolved_segments.extend(hop_segments);
                } else {
                    resolved_segments.push(segment.clone());
                }
                current_pos = target_pt;
            }
            MotionSegment::TouchApproach { target, normal: _ } => {
                for obstacle in keep_outs {
                    if obstacle.contains_point(*target) {
                        return Err(CollisionError::TouchPointInsideObstacle {
                            obstacle_name: obstacle.name.clone(),
                            touch: *target,
                        });
                    }
                }
                resolved_segments.push(segment.clone());
                current_pos = *target;
            }
            MotionSegment::Retract { target } => {
                resolved_segments.push(segment.clone());
                current_pos = *target;
            }
            MotionSegment::RotateHead { .. } => {
                if current_pos.z < (clearance_box.z_clearance - 0.1) {
                    resolved_segments.push(MotionSegment::RapidLinear {
                        target: DVec3::new(current_pos.x, current_pos.y, clearance_box.z_clearance),
                    });
                    current_pos.z = clearance_box.z_clearance;
                }
                resolved_segments.push(segment.clone());
            }
        }
    }

    Ok(resolved_segments)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_swept_capsule_hits_clamp() {
        let clamp = KeepOutZone::new(
            "CLAMP_FRONT_LEFT",
            DVec3::new(20.0, 20.0, 0.0),
            DVec3::new(40.0, 40.0, 30.0),
        );

        let start = DVec3::new(0.0, 30.0, 15.0);
        let end = DVec3::new(50.0, 30.0, 15.0);

        let hit = test_swept_capsule_obstacle(start, end, 2.0, &clamp);
        assert!(hit);
    }

    #[test]
    fn test_swept_capsule_clears_clamp_above() {
        let clamp = KeepOutZone::new(
            "CLAMP_FRONT_LEFT",
            DVec3::new(20.0, 20.0, 0.0),
            DVec3::new(40.0, 40.0, 30.0),
        );

        let start = DVec3::new(0.0, 30.0, 45.0);
        let end = DVec3::new(50.0, 30.0, 45.0);

        let hit = test_swept_capsule_obstacle(start, end, 2.0, &clamp);
        assert!(!hit);
    }

    #[test]
    fn test_autonomous_lift_and_hop_resolution() {
        let clamp = KeepOutZone::new(
            "CLAMP_FRONT_LEFT",
            DVec3::new(20.0, 20.0, 0.0),
            DVec3::new(40.0, 40.0, 30.0),
        );
        let clearance_box =
            ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
        let stylus = StylusAssembly::default();

        let raw_trajectory = vec![MotionSegment::RapidLinear {
            target: DVec3::new(50.0, 30.0, 15.0),
        }];

        let resolved = resolve_collision_free_path(
            &raw_trajectory,
            &clearance_box,
            &[clamp.clone()],
            &stylus,
        )
        .expect("Çözüm başarısız olmamalı");

        assert_eq!(resolved.len(), 3);
        if let MotionSegment::RapidLinear { target } = resolved[0] {
            assert!(target.z >= 70.0);
        } else {
            panic!("İlk hareket dikey tırmanış olmalıydı");
        }
    }

    #[test]
    fn test_bvh_multi_fixture_pruning_and_ccd() {
        let clamps = vec![
            KeepOutZone::new("VICE_BODY", DVec3::new(0.0, 0.0, 0.0), DVec3::new(100.0, 60.0, 40.0)),
            KeepOutZone::new("CLAMP_REAR", DVec3::new(150.0, 150.0, 0.0), DVec3::new(180.0, 180.0, 35.0)),
            KeepOutZone::new("TOE_CLAMP_1", DVec3::new(-50.0, 10.0, 0.0), DVec3::new(-20.0, 30.0, 20.0)),
            KeepOutZone::new("TOE_CLAMP_2", DVec3::new(-50.0, 50.0, 0.0), DVec3::new(-20.0, 70.0, 20.0)),
        ];

        let bvh = BvhTree::build(clamps);
        assert!(bvh.root.is_some());

        let traj = vec![
            MotionSegment::RapidLinear { target: DVec3::new(50.0, 30.0, 20.0) },
            MotionSegment::RapidLinear { target: DVec3::new(200.0, 200.0, 100.0) },
        ];

        let reports = ccd_check_trajectory(&traj, &bvh, 2.0);
        assert_eq!(reports.len(), 1);
        assert_eq!(reports[0].obstacle_name, "VICE_BODY");
    }

    #[test]
    fn test_penetration_mtv_computation() {
        let clamp = KeepOutZone::new(
            "TEST_BOX",
            DVec3::new(0.0, 0.0, 0.0),
            DVec3::new(20.0, 20.0, 20.0),
        );

        let start = DVec3::new(10.0, 10.0, 18.0);
        let end = DVec3::new(10.0, 10.0, 19.0);
        let mtv = compute_penetration_mtv(start, end, 3.0, &clamp);
        assert!(mtv.is_some());
        assert!(mtv.unwrap().length() > 0.0);
    }
}
