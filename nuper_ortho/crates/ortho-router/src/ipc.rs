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

/// CAD Geometri Modellerinin Web / Desktop Viewport'a Zero-Copy Aktarımı için İkili Mesh Paketi
/// Three.js `BufferGeometry` içine doğrudan `Float32Array` olarak enjekte edilir (Doc 08 Bölüm 5).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BinaryMeshPacket {
    /// Üçgen köşe koordinatları: [X1, Y1, Z1, X2, Y2, Z2, X3, Y3, Z3, ...]
    pub vertices: Vec<f32>,
    /// Köşe normal vektörleri: [Nx1, Ny1, Nz1, Nx2, Ny2, Nz2, ...]
    pub normals: Vec<f32>,
    /// Bounding Box minimum koordinatları [X, Y, Z]
    pub bbox_min: [f32; 3],
    /// Bounding Box maksimum koordinatları [X, Y, Z]
    pub bbox_max: [f32; 3],
    /// Her üçgen için CAD Unsur / Yüzey ID'si (Raycast picking ve teşhis için)
    pub triangle_feature_ids: Vec<u32>,
}

impl BinaryMeshPacket {
    pub fn new(
        vertices: Vec<f32>,
        normals: Vec<f32>,
        bbox_min: [f32; 3],
        bbox_max: [f32; 3],
        triangle_feature_ids: Vec<u32>,
    ) -> Self {
        Self {
            vertices,
            normals,
            bbox_min,
            bbox_max,
            triangle_feature_ids,
        }
    }

    pub fn triangle_count(&self) -> usize {
        self.vertices.len() / 9
    }

    /// Köşe tamponunu doğrudan bayt dizisine çevirir (Float32Array Zero-Copy)
    pub fn to_vertex_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(self.vertices.len() * 4);
        for &val in &self.vertices {
            bytes.extend_from_slice(&val.to_le_bytes());
        }
        bytes
    }

    /// Normal tamponunu doğrudan bayt dizisine çevirir
    pub fn to_normal_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(self.normals.len() * 4);
        for &val in &self.normals {
            bytes.extend_from_slice(&val.to_le_bytes());
        }
        bytes
    }

    /// Prizmatik CAD gövdesi (Valf Bloğu vb.) için üçgen mesh üretici
    pub fn new_box(min: glam::DVec3, max: glam::DVec3, feature_id: u32) -> Self {
        let mut vertices = Vec::new();
        let mut normals = Vec::new();

        let corners = [
            [min.x as f32, min.y as f32, min.z as f32], // 0: ---
            [max.x as f32, min.y as f32, min.z as f32], // 1: +--
            [max.x as f32, max.y as f32, min.z as f32], // 2: ++-
            [min.x as f32, max.y as f32, min.z as f32], // 3: -+-
            [min.x as f32, min.y as f32, max.z as f32], // 4: --+
            [max.x as f32, min.y as f32, max.z as f32], // 5: +-+
            [max.x as f32, max.y as f32, max.z as f32], // 6: +++
            [min.x as f32, max.y as f32, max.z as f32], // 7: -++
        ];

        // 6 Yüz x 2 Üçgen = 12 Üçgen
        let faces = [
            // +Z (Top)
            (4, 5, 6, [0.0, 0.0, 1.0]),
            (4, 6, 7, [0.0, 0.0, 1.0]),
            // -Z (Bottom)
            (0, 2, 1, [0.0, 0.0, -1.0]),
            (0, 3, 2, [0.0, 0.0, -1.0]),
            // +X (Right)
            (1, 2, 6, [1.0, 0.0, 0.0]),
            (1, 6, 5, [1.0, 0.0, 0.0]),
            // -X (Left)
            (0, 7, 3, [-1.0, 0.0, 0.0]),
            (0, 4, 7, [-1.0, 0.0, 0.0]),
            // +Y (Front)
            (3, 7, 6, [0.0, 1.0, 0.0]),
            (3, 6, 2, [0.0, 1.0, 0.0]),
            // -Y (Back)
            (0, 1, 5, [0.0, -1.0, 0.0]),
            (0, 5, 4, [0.0, -1.0, 0.0]),
        ];

        let mut feature_ids = Vec::with_capacity(faces.len());
        for (i1, i2, i3, norm) in faces {
            for &idx in &[i1, i2, i3] {
                vertices.extend_from_slice(&corners[idx]);
                normals.extend_from_slice(&norm);
            }
            feature_ids.push(feature_id);
        }

        Self {
            vertices,
            normals,
            bbox_min: [min.x as f32, min.y as f32, min.z as f32],
            bbox_max: [max.x as f32, max.y as f32, max.z as f32],
            triangle_feature_ids: feature_ids,
        }
    }
}

pub const TELEMETRY_MAGIC: u32 = 0x4E555052;
pub const STATUS_MOVING: u32 = 0x01;
pub const STATUS_IN_CONTACT: u32 = 0x02;
pub const STATUS_TRIGGERED: u32 = 0x04;
pub const STATUS_ESTOP: u32 = 0x08;

#[repr(C)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct BinaryTelemetryPacket {
    pub magic: u32,
    pub status_flags: u32,
    pub timestamp_ns: u64,
    pub probe_pos: [f64; 3],
    pub probe_normal: [f64; 3],
    pub head_a: f64,
    pub head_b: f64,
}

impl BinaryTelemetryPacket {
    pub fn new(
        timestamp_ns: u64,
        probe_pos: [f64; 3],
        probe_normal: [f64; 3],
        head_a: f64,
        head_b: f64,
        status_flags: u32,
    ) -> Self {
        Self {
            magic: TELEMETRY_MAGIC,
            status_flags,
            timestamp_ns,
            probe_pos,
            probe_normal,
            head_a,
            head_b,
        }
    }

    pub fn to_bytes(&self) -> [u8; 80] {
        let mut buf = [0u8; 80];
        buf[0..4].copy_from_slice(&self.magic.to_le_bytes());
        buf[4..8].copy_from_slice(&self.status_flags.to_le_bytes());
        buf[8..16].copy_from_slice(&self.timestamp_ns.to_le_bytes());
        buf[16..24].copy_from_slice(&self.probe_pos[0].to_le_bytes());
        buf[24..32].copy_from_slice(&self.probe_pos[1].to_le_bytes());
        buf[32..40].copy_from_slice(&self.probe_pos[2].to_le_bytes());
        buf[40..48].copy_from_slice(&self.probe_normal[0].to_le_bytes());
        buf[48..56].copy_from_slice(&self.probe_normal[1].to_le_bytes());
        buf[56..64].copy_from_slice(&self.probe_normal[2].to_le_bytes());
        buf[64..72].copy_from_slice(&self.head_a.to_le_bytes());
        buf[72..80].copy_from_slice(&self.head_b.to_le_bytes());
        buf
    }

    pub fn from_bytes(bytes: &[u8; 80]) -> Result<Self, &'static str> {
        let magic = u32::from_le_bytes(bytes[0..4].try_into().unwrap());
        if magic != TELEMETRY_MAGIC {
            return Err("Invalid telemetry magic prefix");
        }
        let status_flags = u32::from_le_bytes(bytes[4..8].try_into().unwrap());
        let timestamp_ns = u64::from_le_bytes(bytes[8..16].try_into().unwrap());
        let p_x = f64::from_le_bytes(bytes[16..24].try_into().unwrap());
        let p_y = f64::from_le_bytes(bytes[24..32].try_into().unwrap());
        let p_z = f64::from_le_bytes(bytes[32..40].try_into().unwrap());
        let n_x = f64::from_le_bytes(bytes[40..48].try_into().unwrap());
        let n_y = f64::from_le_bytes(bytes[48..56].try_into().unwrap());
        let n_z = f64::from_le_bytes(bytes[56..64].try_into().unwrap());
        let head_a = f64::from_le_bytes(bytes[64..72].try_into().unwrap());
        let head_b = f64::from_le_bytes(bytes[72..80].try_into().unwrap());

        Ok(Self {
            magic,
            status_flags,
            timestamp_ns,
            probe_pos: [p_x, p_y, p_z],
            probe_normal: [n_x, n_y, n_z],
            head_a,
            head_b,
        })
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

    #[test]
    fn test_binary_mesh_packet_box_generation_and_memory_mapping() {
        let box_mesh = BinaryMeshPacket::new_box(
            DVec3::new(0.0, 0.0, 0.0),
            DVec3::new(100.0, 100.0, 50.0),
            42,
        );

        assert_eq!(box_mesh.triangle_count(), 12);
        assert_eq!(box_mesh.vertices.len(), 12 * 3 * 3); // 12 tri * 3 vert * 3 coords = 108 floats
        assert_eq!(box_mesh.normals.len(), 108);
        assert_eq!(box_mesh.triangle_feature_ids.len(), 12);
        assert_eq!(box_mesh.triangle_feature_ids[0], 42);

        let v_bytes = box_mesh.to_vertex_bytes();
        assert_eq!(v_bytes.len(), 108 * 4); // 432 bytes
        let n_bytes = box_mesh.to_normal_bytes();
        assert_eq!(n_bytes.len(), 108 * 4);
    }

    #[test]
    fn test_binary_telemetry_packet_layout_and_roundtrip() {
        assert_eq!(std::mem::size_of::<BinaryTelemetryPacket>(), 80);

        let packet = BinaryTelemetryPacket::new(
            1_700_000_000_123_456,
            [120.5, 45.2, -10.8],
            [0.0, 0.0, 1.0],
            45.0,
            90.0,
            STATUS_MOVING | STATUS_IN_CONTACT,
        );

        let bytes = packet.to_bytes();
        assert_eq!(bytes.len(), 80);

        let decoded = BinaryTelemetryPacket::from_bytes(&bytes).expect("Decode failed");
        assert_eq!(decoded.magic, TELEMETRY_MAGIC);
        assert_eq!(decoded.timestamp_ns, 1_700_000_000_123_456);
        assert_eq!(decoded.probe_pos, [120.5, 45.2, -10.8]);
        assert_eq!(decoded.probe_normal, [0.0, 0.0, 1.0]);
        assert_eq!(decoded.head_a, 45.0);
        assert_eq!(decoded.head_b, 90.0);
        assert_eq!(decoded.status_flags, STATUS_MOVING | STATUS_IN_CONTACT);

        let mut bad_bytes = bytes;
        bad_bytes[0] = 0x00;
        assert!(BinaryTelemetryPacket::from_bytes(&bad_bytes).is_err());
    }
}

