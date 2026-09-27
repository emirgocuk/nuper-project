use serde::{Deserialize, Serialize};

use crate::{CertifiedCollisionFreeTrajectory, MotionSegment};

/// Web / Desktop 3D Dijital İkiz Simülasyonu için İkili Tampon Paketi
/// JavaScript V8 belleğine doğrudan `Float32Array` olarak aktarılır (Zero-Copy IPC).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BinaryTrajectoryPacket {
    /// Düzleştirilmiş koordinatlar: her nokta için [X, Y, Z, TypeCode]
    /// TypeCode:
    /// 1.0 = RapidLinear (Hızlı intikal)
    /// 2.0 = TouchApproach (Ölçüm yaklaşması)
    /// 3.0 = Retract (Normal yönünde geri çekilme)
    /// 4.0 = RotateHead (Açı değiştirme)
    /// 5.0 = EmergencyRetract (Acil durum emniyet çekilmesi)
    pub waypoints: Vec<f32>,
    /// Toplam yol uzunluğu (mm)
    pub total_distance_mm: f64,
    /// Tahmini çevrim süresi (saniye, 150 mm/s hızlı, 5 mm/s dokunma, 3s kafa açısı)
    pub estimated_duration_sec: f64,
    /// SHA-256 doğrulama mührü (Hex)
    pub sha256_seal: String,
    /// Unsur ve nokta sayısı
    pub segment_count: usize,
}

impl BinaryTrajectoryPacket {
    /// Sertifikalı rotayı Three.js BufferGeometry için ikili pakete dönüştürür
    pub fn from_certified_trajectory(trajectory: &CertifiedCollisionFreeTrajectory) -> Self {
        let mut waypoints = Vec::with_capacity(trajectory.segments.len() * 4);
        let mut total_dist = 0.0;
        let mut est_time = 0.0;
        let mut last_pos = glam::DVec3::ZERO;

        for (idx, seg) in trajectory.segments.iter().enumerate() {
            match seg {
                MotionSegment::RapidLinear { target } => {
                    waypoints.push(target.x as f32);
                    waypoints.push(target.y as f32);
                    waypoints.push(target.z as f32);
                    waypoints.push(1.0); // Rapid

                    if idx > 0 {
                        let dist = (target - last_pos).length();
                        total_dist += dist;
                        est_time += dist / 150.0; // 150 mm/s hızlı intikal hızı
                    }
                    last_pos = *target;
                }
                MotionSegment::TouchApproach { target, normal: _ } => {
                    waypoints.push(target.x as f32);
                    waypoints.push(target.y as f32);
                    waypoints.push(target.z as f32);
                    waypoints.push(2.0); // Touch

                    if idx > 0 {
                        let dist = (target - last_pos).length();
                        total_dist += dist;
                        est_time += dist / 5.0; // 5 mm/s temas hızı
                    }
                    last_pos = *target;
                }
                MotionSegment::Retract { target } => {
                    waypoints.push(target.x as f32);
                    waypoints.push(target.y as f32);
                    waypoints.push(target.z as f32);
                    waypoints.push(3.0); // Retract

                    if idx > 0 {
                        let dist = (target - last_pos).length();
                        total_dist += dist;
                        est_time += dist / 25.0; // 25 mm/s geri çekilme
                    }
                    last_pos = *target;
                }
                MotionSegment::RotateHead { a_deg: _, b_deg: _ } => {
                    waypoints.push(last_pos.x as f32);
                    waypoints.push(last_pos.y as f32);
                    waypoints.push(last_pos.z as f32);
                    waypoints.push(4.0); // Rotate

                    est_time += 3.5; // PH10 motor kilit açma, dönme ve kilitleme süresi (~3.5s)
                }
            }
        }

        let seal = trajectory
            .verification_hash
            .iter()
            .map(|b| format!("{:02X}", b))
            .collect();

        Self {
            waypoints,
            total_distance_mm: total_dist,
            estimated_duration_sec: est_time,
            sha256_seal: seal,
            segment_count: trajectory.segments.len(),
        }
    }

    /// Tamponu ham binary bayt dizisine dönüştürür (Float32Array memory mapping)
    pub fn to_raw_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(self.waypoints.len() * 4);
        for &val in &self.waypoints {
            bytes.extend_from_slice(&val.to_le_bytes());
        }
        bytes
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use glam::DVec3;
    use crate::ClearanceBox;

    #[test]
    fn test_binary_packet_conversion_and_byte_stream() {
        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
        let segments = vec![
            MotionSegment::RapidLinear {
                target: DVec3::new(0.0, 0.0, 100.0),
            },
            MotionSegment::TouchApproach {
                target: DVec3::new(50.0, 50.0, 50.0),
                normal: DVec3::Z,
            },
            MotionSegment::Retract {
                target: DVec3::new(50.0, 50.0, 55.0),
            },
        ];

        let traj = CertifiedCollisionFreeTrajectory::new(segments, clearance, vec![]);
        let packet = BinaryTrajectoryPacket::from_certified_trajectory(&traj);

        assert_eq!(packet.segment_count, 3);
        assert_eq!(packet.waypoints.len(), 12); // 3 segment x 4 (X, Y, Z, Type)
        assert!(packet.total_distance_mm > 0.0);
        assert!(!packet.sha256_seal.is_empty());

        let raw_bytes = packet.to_raw_bytes();
        assert_eq!(raw_bytes.len(), 12 * 4); // 48 bytes
    }
}

