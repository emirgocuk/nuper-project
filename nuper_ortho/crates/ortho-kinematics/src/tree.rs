use glam::{DMat3, DVec3};
use serde::{Deserialize, Serialize};

/// Prob Donanım Montaj Zinciri (Forward Kinematics Stack)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ProbeStack {
    /// PH10 kafa mafsal flanşı ile pivot merkezi arası mesafe (mm)
    pub l_head: f64,
    /// TP20 modül gövde boyu (mm)
    pub l_module: f64,
    /// Varsa PEL uzatma çubuğu boyu (mm)
    pub l_ext: f64,
    /// Stylus şaft boyu (mm)
    pub l_stem: f64,
    /// Yakut bilye anma çapı (mm)
    pub d_ball: f64,
}

impl Default for ProbeStack {
    fn default() -> Self {
        Self {
            l_head: 65.0,
            l_module: 30.0,
            l_ext: 0.0,
            l_stem: 20.0,
            d_ball: 2.0,
        }
    }
}

impl ProbeStack {
    /// Toplam prob montaj boyunu hesaplar (Pivot noktasından bilye merkezine)
    pub fn total_length(&self) -> f64 {
        self.l_head + self.l_module + self.l_ext + self.l_stem
    }

    /// Verilen A ve B kafa açılarında bilye merkezinin kafa pivotuna göre ofset vektörünü hesaplar
    pub fn compute_tip_offset(&self, a_deg: f64, b_deg: f64) -> DVec3 {
        let total_l = self.total_length();
        let a_rad = a_deg.to_radians();
        let b_rad = b_deg.to_radians();

        let ry = DMat3::from_rotation_y(a_rad);
        let rz = DMat3::from_rotation_z(b_rad);

        // Varsayılan duruş: Kafa pivotundan düşey aşağı (-Z)
        let base_vector = DVec3::new(0.0, 0.0, -total_l);

        rz * (ry * base_vector)
    }
}
