use glam::{DMat3, DVec3};
use serde::{Deserialize, Serialize};

/// Prob şaft malzemesi ve elastisite modülü (GPa)
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum StemMaterial {
    /// Tungsten Karbür (E = 620 GPa) - En yüksek rijitlik, kısa şaftlar için ideal
    TungstenCarbide,
    /// Karbon Fiber (E = 450 GPa) - Hafif ve termal kararlı, >50mm uzun şaftlar için ideal
    CarbonFiber,
    /// Seramik (E = 380 GPa) - Çarpışma anında kırılarak kafayı korur
    Ceramic,
    /// Paslanmaz Çelik (E = 210 GPa) - Standart ekonomik şaft
    StainlessSteel,
}

impl StemMaterial {
    pub fn young_modulus_pa(&self) -> f64 {
        match self {
            StemMaterial::TungstenCarbide => 620e9,
            StemMaterial::CarbonFiber => 450e9,
            StemMaterial::Ceramic => 380e9,
            StemMaterial::StainlessSteel => 210e9,
        }
    }
}

/// Prob Donanım Montaj Zinciri (Forward Kinematics Stack - Doc 08 Section 2)
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
    /// Stylus şaft çapı (mm)
    pub d_stem: f64,
    /// Yakut bilye anma çapı (mm)
    pub d_ball: f64,
    /// Şaft malzemesi
    pub material: StemMaterial,
    /// Tetikleme dokunma kuvveti (N) (Standart TP20 = 0.08 N, LF = 0.05 N)
    pub trigger_force_n: f64,
}

impl Default for ProbeStack {
    fn default() -> Self {
        Self {
            l_head: 65.0,
            l_module: 30.0,
            l_ext: 0.0,
            l_stem: 20.0,
            d_stem: 1.5,
            d_ball: 2.0,
            material: StemMaterial::TungstenCarbide,
            trigger_force_n: 0.08,
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

    /// Stylus şaft esnemesi kaynaklı Pre-Travel sapmasını hesaplar (Doc 06 Section 4)
    /// $$\delta = \frac{F \cdot L^3}{3 E \cdot I}, \quad I = \frac{\pi \cdot d^4}{64}$$
    pub fn compute_stem_deflection_um(&self) -> f64 {
        let l_m = self.l_stem * 1e-3;
        let d_m = self.d_stem * 1e-3;
        let e = self.material.young_modulus_pa();
        let f = self.trigger_force_n;

        let inertia = (std::f64::consts::PI * d_m.powi(4)) / 64.0;
        let deflection_m = (f * l_m.powi(3)) / (3.0 * e * inertia);

        deflection_m * 1e6 // Mikrometre (µm) cinsinden döndür
    }

    /// 3-Noktalı kinematik oturma yuvası lob sapması (Triangular Lobing Effect, Doc 06 Section 4)
    /// Yaklaşma açısına göre lob sapması: $\Delta R(\phi) = A_{\text{lobe}} \cdot \cos(3 \phi)$
    pub fn compute_pretravel_lobing_um(&self, approach_angle_rad: f64) -> f64 {
        // Tipik Renishaw TP20 için üçgen lob genliği ~1.2 µm
        let lobe_amplitude_um = 1.2;
        lobe_amplitude_um * (3.0 * approach_angle_rad).cos()
    }
}

/// 5-Yollu Yıldız Prob Konfigürasyonu (Star Stylus Assembly - Doc 04 Section 3)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StarProbeAssembly {
    pub base_stack: ProbeStack,
    /// Yıldız gövdesinden radyal uçlara olan kol boyu (mm)
    pub star_arm_length: f64,
}

impl StarProbeAssembly {
    pub fn new(base_stack: ProbeStack, star_arm_length: f64) -> Self {
        Self {
            base_stack,
            star_arm_length,
        }
    }

    /// Verilen A/B açılarında 5 farklı bilye ucunun uzaydaki konumlarını döndürür
    /// Uçlar: [0: Düşey Merkez (-Z), 1: +X Kolu, 2: -X Kolu, 3: +Y Kolu, 4: -Y Kolu]
    pub fn compute_all_tip_offsets(&self, a_deg: f64, b_deg: f64) -> [DVec3; 5] {
        let a_rad = a_deg.to_radians();
        let b_rad = b_deg.to_radians();

        let ry = DMat3::from_rotation_y(a_rad);
        let rz = DMat3::from_rotation_z(b_rad);
        let rot = rz * ry;

        let center_z = -self.base_stack.total_length();
        let arm = self.star_arm_length;

        let local_tips = [
            DVec3::new(0.0, 0.0, center_z),       // 0: Merkez
            DVec3::new(arm, 0.0, center_z),       // 1: +X
            DVec3::new(-arm, 0.0, center_z),      // 2: -X
            DVec3::new(0.0, arm, center_z),       // 3: +Y
            DVec3::new(0.0, -arm, center_z),      // 4: -Y
        ];

        [
            rot * local_tips[0],
            rot * local_tips[1],
            rot * local_tips[2],
            rot * local_tips[3],
            rot * local_tips[4],
        ]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_stem_deflection_calculation() {
        let mut probe = ProbeStack::default();
        probe.l_stem = 50.0; // 50 mm uzun şaft
        probe.d_stem = 1.5;

        let def_carbide = probe.compute_stem_deflection_um();
        assert!(def_carbide > 0.0 && def_carbide < 30.0, "Karbür şaft esnemesi makul mikron sınırında olmalı: {} um", def_carbide);

        // Çelik şaft daha fazla esnemeli (E_steel < E_carbide)
        probe.material = StemMaterial::StainlessSteel;
        let def_steel = probe.compute_stem_deflection_um();
        assert!(def_steel > def_carbide, "Çelik şaft karbürden daha çok esnemeli");
    }

    #[test]
    fn test_star_probe_offsets() {
        let probe = ProbeStack::default();
        let star = StarProbeAssembly::new(probe, 20.0);

        let tips = star.compute_all_tip_offsets(0.0, 0.0);
        assert_eq!(tips.len(), 5);

        // A=0, B=0 iken merkez uç düşey aşağıda olmalı
        assert!((tips[0].x).abs() < 1e-4);
        assert!((tips[0].y).abs() < 1e-4);
        assert!(tips[0].z < -100.0);

        // +X kolu +20 mm X ofsetine sahip olmalı
        assert!((tips[1].x - 20.0).abs() < 1e-4);
    }
}
