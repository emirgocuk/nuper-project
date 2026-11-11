use glam::DVec3;
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::{CertifiedCollisionFreeTrajectory, MotionSegment};

#[derive(Error, Debug, PartialEq)]
pub enum PalletError {
    #[error("Geçersiz palet yuvası: {slot_id}")]
    InvalidSlot { slot_id: usize },

    #[error("Palet tablasında hiçbir aktif/dolu parça yuvası yok")]
    NoOccupiedSlots,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PalletSlot {
    pub slot_id: usize,
    pub row: usize,
    pub col: usize,
    pub origin_offset: DVec3,
    pub is_occupied: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PalletGrid {
    pub rows: usize,
    pub cols: usize,
    pub base_origin: DVec3,
    pub delta_x: f64,
    pub delta_y: f64,
    pub slots: Vec<PalletSlot>,
}

impl PalletGrid {
    pub fn new_grid(
        rows: usize,
        cols: usize,
        base_origin: DVec3,
        delta_x: f64,
        delta_y: f64,
    ) -> Self {
        let mut slots = Vec::with_capacity(rows * cols);
        let mut slot_id = 0;

        for r in 0..rows {
            for c in 0..cols {
                let offset = DVec3::new(
                    base_origin.x + (c as f64) * delta_x,
                    base_origin.y + (r as f64) * delta_y,
                    base_origin.z,
                );
                slots.push(PalletSlot {
                    slot_id,
                    row: r,
                    col: c,
                    origin_offset: offset,
                    is_occupied: true,
                });
                slot_id += 1;
            }
        }

        Self {
            rows,
            cols,
            base_origin,
            delta_x,
            delta_y,
            slots,
        }
    }

    pub fn set_slot_occupied(&mut self, slot_id: usize, occupied: bool) -> Result<(), PalletError> {
        let slot = self
            .slots
            .get_mut(slot_id)
            .ok_or(PalletError::InvalidSlot { slot_id })?;
        slot.is_occupied = occupied;
        Ok(())
    }

    pub fn local_to_global_point(&self, slot_id: usize, local_pt: DVec3) -> Result<DVec3, PalletError> {
        let slot = self
            .slots
            .get(slot_id)
            .ok_or(PalletError::InvalidSlot { slot_id })?;
        Ok(slot.origin_offset + local_pt)
    }

    pub fn occupied_slots(&self) -> Vec<&PalletSlot> {
        self.slots.iter().filter(|s| s.is_occupied).collect()
    }
}

#[derive(Debug, Clone)]
pub struct OrientedSubPath {
    pub a_deg: f64,
    pub b_deg: f64,
    pub segments: Vec<MotionSegment>,
}

pub fn partition_trajectory_by_orientation(
    trajectory: &CertifiedCollisionFreeTrajectory,
) -> Vec<OrientedSubPath> {
    let mut groups: Vec<OrientedSubPath> = Vec::new();
    let mut current_a = 0.0;
    let mut current_b = 0.0;
    let mut current_segments = Vec::new();

    for seg in &trajectory.segments {
        match seg {
            MotionSegment::RotateHead { a_deg, b_deg } => {
                if !current_segments.is_empty() {
                    groups.push(OrientedSubPath {
                        a_deg: current_a,
                        b_deg: current_b,
                        segments: current_segments,
                    });
                    current_segments = Vec::new();
                }
                current_a = *a_deg;
                current_b = *b_deg;
            }
            _ => {
                current_segments.push(seg.clone());
            }
        }
    }

    if !current_segments.is_empty() {
        groups.push(OrientedSubPath {
            a_deg: current_a,
            b_deg: current_b,
            segments: current_segments,
        });
    }

    groups
}

pub fn optimize_cross_nest_pallet_inspection(
    single_part_trajectory: &CertifiedCollisionFreeTrajectory,
    grid: &PalletGrid,
    pallet_clearance_z: f64,
) -> Result<Vec<MotionSegment>, PalletError> {
    let occupied = grid.occupied_slots();
    if occupied.is_empty() {
        return Err(PalletError::NoOccupiedSlots);
    }

    let orientation_groups = partition_trajectory_by_orientation(single_part_trajectory);
    let mut global_stream = Vec::new();

    for group in orientation_groups {
        global_stream.push(MotionSegment::RapidLinear {
            target: DVec3::new(grid.base_origin.x, grid.base_origin.y, pallet_clearance_z),
        });
        global_stream.push(MotionSegment::RotateHead {
            a_deg: group.a_deg,
            b_deg: group.b_deg,
        });

        for slot in &occupied {
            global_stream.push(MotionSegment::RapidLinear {
                target: DVec3::new(slot.origin_offset.x, slot.origin_offset.y, pallet_clearance_z),
            });

            for seg in &group.segments {
                match seg {
                    MotionSegment::RapidLinear { target } => {
                        global_stream.push(MotionSegment::RapidLinear {
                            target: slot.origin_offset + *target,
                        });
                    }
                    MotionSegment::TouchApproach { target, normal } => {
                        global_stream.push(MotionSegment::TouchApproach {
                            target: slot.origin_offset + *target,
                            normal: *normal,
                        });
                    }
                    MotionSegment::Retract { target } => {
                        global_stream.push(MotionSegment::Retract {
                            target: slot.origin_offset + *target,
                        });
                    }
                    MotionSegment::RotateHead { .. } => {}
                }
            }

            if let Some(last) = group.segments.last() {
                let last_pt = match last {
                    MotionSegment::RapidLinear { target }
                    | MotionSegment::TouchApproach { target, .. }
                    | MotionSegment::Retract { target } => slot.origin_offset + *target,
                    MotionSegment::RotateHead { .. } => slot.origin_offset,
                };
                global_stream.push(MotionSegment::RapidLinear {
                    target: DVec3::new(last_pt.x, last_pt.y, pallet_clearance_z),
                });
            }
        }
    }

    Ok(global_stream)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ClearanceBox;

    #[test]
    fn test_pallet_grid_creation_and_offsets() {
        let grid = PalletGrid::new_grid(
            2,
            4,
            DVec3::new(100.0, 100.0, 50.0),
            120.0,
            150.0,
        );
        assert_eq!(grid.slots.len(), 8);
        assert_eq!(grid.slots[0].origin_offset, DVec3::new(100.0, 100.0, 50.0));
        assert_eq!(grid.slots[1].origin_offset, DVec3::new(220.0, 100.0, 50.0));
        assert_eq!(grid.slots[4].origin_offset, DVec3::new(100.0, 250.0, 50.0));
        assert_eq!(grid.slots[7].origin_offset, DVec3::new(460.0, 250.0, 50.0));

        let local_pt = DVec3::new(10.0, 20.0, 5.0);
        let global_pt = grid.local_to_global_point(7, local_pt).unwrap();
        assert_eq!(global_pt, DVec3::new(470.0, 270.0, 55.0));
    }

    #[test]
    fn test_pallet_cross_nest_reduces_rotations_from_24_to_3() {
        let grid = PalletGrid::new_grid(
            2,
            4,
            DVec3::new(50.0, 50.0, 0.0),
            100.0,
            100.0,
        );

        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(50.0, 50.0, 30.0));
        let single_plan_segments = vec![
            MotionSegment::RotateHead { a_deg: 0.0, b_deg: 0.0 },
            MotionSegment::TouchApproach { target: DVec3::new(25.0, 25.0, 30.0), normal: DVec3::Z },
            MotionSegment::Retract { target: DVec3::new(25.0, 25.0, 35.0) },
            MotionSegment::RotateHead { a_deg: 45.0, b_deg: 0.0 },
            MotionSegment::TouchApproach { target: DVec3::new(25.0, 50.0, 15.0), normal: DVec3::Y },
            MotionSegment::Retract { target: DVec3::new(25.0, 55.0, 15.0) },
            MotionSegment::RotateHead { a_deg: 90.0, b_deg: 0.0 },
            MotionSegment::TouchApproach { target: DVec3::new(50.0, 25.0, 15.0), normal: DVec3::X },
            MotionSegment::Retract { target: DVec3::new(55.0, 25.0, 15.0) },
        ];
        let single_traj = CertifiedCollisionFreeTrajectory::new(single_plan_segments, clearance, vec![]);

        let pallet_stream = optimize_cross_nest_pallet_inspection(&single_traj, &grid, 120.0).unwrap();

        let head_rotations_count = pallet_stream
            .iter()
            .filter(|s| matches!(s, MotionSegment::RotateHead { .. }))
            .count();

        assert_eq!(head_rotations_count, 3);

        let touch_count = pallet_stream
            .iter()
            .filter(|s| matches!(s, MotionSegment::TouchApproach { .. }))
            .count();
        assert_eq!(touch_count, 3 * 8);
    }

    #[test]
    fn test_pallet_empty_slot_bypass() {
        let mut grid = PalletGrid::new_grid(
            1,
            3,
            DVec3::new(0.0, 0.0, 0.0),
            100.0,
            100.0,
        );
        grid.set_slot_occupied(1, false).unwrap();
        assert_eq!(grid.occupied_slots().len(), 2);

        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(50.0, 50.0, 30.0));
        let traj = CertifiedCollisionFreeTrajectory::new(
            vec![
                MotionSegment::RotateHead { a_deg: 0.0, b_deg: 0.0 },
                MotionSegment::TouchApproach { target: DVec3::new(10.0, 10.0, 10.0), normal: DVec3::Z },
            ],
            clearance,
            vec![],
        );

        let pallet_stream = optimize_cross_nest_pallet_inspection(&traj, &grid, 100.0).unwrap();
        let touch_count = pallet_stream
            .iter()
            .filter(|s| matches!(s, MotionSegment::TouchApproach { .. }))
            .count();
        assert_eq!(touch_count, 2);
    }
}
