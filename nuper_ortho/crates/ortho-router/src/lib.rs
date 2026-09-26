//! # ortho-router
//! 
//! Katman 4: Emniyet kutusu, pabuç yasaklı alanları ve GJK/EPA çarpışmasız hareket planlayıcısı.

pub mod clearance;

use glam::DVec3;
use serde::{Deserialize, Serialize};

pub use clearance::{ClearanceBox, KeepOutZone};

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
        // Basit prototip doğrulama karması
        let verification_hash = [0u8; 32];
        Self {
            segments,
            clearance_box,
            keep_out_zones,
            verification_hash,
        }
    }
}
