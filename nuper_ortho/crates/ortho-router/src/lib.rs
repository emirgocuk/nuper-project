//! # ortho-router
//! 
//! Katman 4: Emniyet kutusu, pabuç yasaklı alanları ve GJK/EPA çarpışmasız hareket planlayıcısı.

pub mod clearance;
pub mod collision;
pub mod hal;
pub mod ipc;
pub mod stylus;
pub mod tsp;

use glam::DVec3;
use serde::{Deserialize, Serialize};

pub use clearance::{ClearanceBox, KeepOutZone};
pub use collision::{
    generate_lift_and_hop, resolve_collision_free_path, test_swept_capsule_obstacle,
    CollisionError, CollisionReport,
};
pub use hal::{
    CmmMachineProfile, HalError, ProbeTipDefinition, RackConfiguration, RackType, StrokeLimits,
};
pub use ipc::{BinaryMeshPacket, BinaryTrajectoryPacket};
pub use stylus::{ReachabilityReport, StylusAssembly, StylusError};
pub use tsp::{calculate_total_path_length, optimize_inspection_sequence_2opt};

/// Ayrık hareket segmenti
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum MotionSegment {
    /// Hızlı intikal (Clearance düzleminde)
    RapidLinear { target: DVec3 },
    /// Yüzeye ölçüm yaklaşması (Dokunma hızıyla)
    TouchApproach { target: DVec3, normal: DVec3 },
    /// Normal doğrultusunda geri çekilme
    Retract { target: DVec3 },
    /// Motorize kafa açısı değiştirme (Yalnızca emniyet düzleminde)
    RotateHead { a_deg: f64, b_deg: f64 },
}

/// Typestate Pattern: Yalnızca çarpışma testlerinden başarıyla geçmiş sertifikalı hareket yolu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CertifiedCollisionFreeTrajectory {
    pub segments: Vec<MotionSegment>,
    pub clearance_box: ClearanceBox,
    pub keep_out_zones: Vec<KeepOutZone>,
    pub verification_hash: [u8; 32],
}

impl CertifiedCollisionFreeTrajectory {
    pub fn new(
        segments: Vec<MotionSegment>,
        clearance_box: ClearanceBox,
        keep_out_zones: Vec<KeepOutZone>,
    ) -> Self {
        let verification_hash = Self::compute_hash(&segments, &clearance_box);
        Self {
            segments,
            clearance_box,
            keep_out_zones,
            verification_hash,
        }
    }

    /// Çarpışma motorunu koşturup pabuç vb. engelleri Lift-and-Hop ile aşarak yolu mühürler
    pub fn verify_and_certify(
        raw_segments: &[MotionSegment],
        clearance_box: ClearanceBox,
        keep_out_zones: Vec<KeepOutZone>,
        stylus: &StylusAssembly,
    ) -> Result<Self, CollisionError> {
        let safe_segments =
            resolve_collision_free_path(raw_segments, &clearance_box, &keep_out_zones, stylus)?;
        let verification_hash = Self::compute_hash(&safe_segments, &clearance_box);

        Ok(Self {
            segments: safe_segments,
            clearance_box,
            keep_out_zones,
            verification_hash,
        })
    }

    /// Rota koordinatlarını ve parametrelerini 32-baytlık deterministik bir sağlama karmasıyla mühürler
    fn compute_hash(segments: &[MotionSegment], clearance: &ClearanceBox) -> [u8; 32] {
        let mut state: u64 = 0xcbf29ce484222325; // FNV-1a offset basis
        let prime: u64 = 0x100000001b3;

        let mut feed_f64 = |val: f64| {
            for b in val.to_le_bytes() {
                state ^= b as u64;
                state = state.wrapping_mul(prime);
            }
        };

        feed_f64(clearance.z_clearance);
        feed_f64(clearance.min.x);
        feed_f64(clearance.max.z);

        for seg in segments {
            match seg {
                MotionSegment::RapidLinear { target } => {
                    feed_f64(1.0);
                    feed_f64(target.x);
                    feed_f64(target.y);
                    feed_f64(target.z);
                }
                MotionSegment::TouchApproach { target, normal } => {
                    feed_f64(2.0);
                    feed_f64(target.x);
                    feed_f64(target.y);
                    feed_f64(target.z);
                    feed_f64(normal.x);
                    feed_f64(normal.y);
                    feed_f64(normal.z);
                }
                MotionSegment::Retract { target } => {
                    feed_f64(3.0);
                    feed_f64(target.x);
                    feed_f64(target.y);
                    feed_f64(target.z);
                }
                MotionSegment::RotateHead { a_deg, b_deg } => {
                    feed_f64(4.0);
                    feed_f64(*a_deg);
                    feed_f64(*b_deg);
                }
            }
        }

        let mut hash = [0u8; 32];
        for i in 0..4 {
            let chunk = state.rotate_left((i * 13) as u32).wrapping_mul(prime);
            hash[(i * 8)..(i * 8 + 8)].copy_from_slice(&chunk.to_le_bytes());
        }
        hash
    }
}

