use glam::DVec3;
use serde::{Deserialize, Serialize};

/// Tekil bir Renishaw PH10 A/B açı konfigürasyonu
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct PH10Angle {
    /// Düşey eksenden yatma açısı: 0.0° - 105.0° (7.5° adımlarla)
    pub a_deg: f64,
    /// Yatay düzlemde dönüş açısı: -180.0° - +180.0° (7.5° adımlarla)
    pub b_deg: f64,
    /// Uzaydaki birim prob yönelim vektörü
    pub direction_vector: DVec3,
}

impl PH10Angle {
    /// A ve B açılarına göre küresel yönelim vektörünü hesaplar (Doc 04 Section 2)
    pub fn compute_direction(a_deg: f64, b_deg: f64) -> DVec3 {
        let a_rad = a_deg.to_radians();
        let b_rad = b_deg.to_radians();

        // Renishaw Kinematik Standart Yönelim Dönüşümü:
        // A=0, B=0 iken prob tam düşey aşağı (-Z) bakar.
        let x = a_rad.sin() * b_rad.sin();
        let y = -a_rad.sin() * b_rad.cos();
        let z = -a_rad.cos();

        DVec3::new(x, y, z).normalize()
    }

    pub fn new(a_deg: f64, b_deg: f64) -> Self {
        let direction_vector = Self::compute_direction(a_deg, b_deg);
        Self {
            a_deg,
            b_deg,
            direction_vector,
        }
    }
}

/// Açı seçim ve optimizasyon sonucu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AngleSelectionResult {
    /// Seçilen prob açısı
    pub selected_angle: PH10Angle,
    /// Hedef yaklaşma vektörüne olan açısal sapma (derece)
    pub angular_error_deg: f64,
    /// Tezgahta önceden kalibre edilmiş (Qualified) bir açı mı?
    pub is_pre_qualified: bool,
    /// Kalibrasyon gereksinimi veya operatör uyarısı
    pub warning_message: Option<String>,
}

/// Manuel kafa (Renishaw MH20i) açı kümesi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ManualIndexCluster {
    pub cluster_id: usize,
    pub recommended_angle: PH10Angle,
    pub target_indices: Vec<usize>,
    pub max_cluster_deviation_deg: f64,
}

/// Renishaw PH10 720 Açı Arama Tablosu (Look-Up Table - LUT)
#[derive(Debug, Clone)]
pub struct PH10LookUpTable {
    pub angles: Vec<PH10Angle>,
}

impl Default for PH10LookUpTable {
    fn default() -> Self {
        Self::new()
    }
}

impl PH10LookUpTable {
    /// 720 diskret kombinasyonu önceden hesaplayarak LUT oluşturur
    pub fn new() -> Self {
        let mut angles = Vec::with_capacity(15 * 49);

        // A ekseni: 0° - 105° (15 adım)
        let a_steps = 15;
        // B ekseni: -180° - +180° (48 adım)
        let b_steps = 48;

        for i in 0..=a_steps {
            let a_deg = (i as f64) * 7.5;
            for j in 0..b_steps {
                let b_deg = -180.0 + (j as f64) * 7.5;
                angles.push(PH10Angle::new(a_deg, b_deg));
            }
        }

        Self { angles }
    }

    /// Verilen hedef yaklaşma vektörüne en dik (skaler çarpımı en yüksek) kafa açısını bulur
    pub fn find_best_angle(&self, target_approach: DVec3) -> (PH10Angle, f64) {
        let target_norm = target_approach.normalize();
        let mut best_angle = self.angles[0];
        let mut max_dot = -1.0;

        for angle in &self.angles {
            let dot = angle.direction_vector.dot(target_norm);
            if dot > max_dot {
                max_dot = dot;
                best_angle = *angle;
            }
        }

        // Açısal sapma (derece): theta = acos(dot)
        let clamped_dot = max_dot.clamp(-1.0, 1.0);
        let angular_error_deg = clamped_dot.acos().to_degrees();

        (best_angle, angular_error_deg)
    }

    /// Kalibre edilmiş açılara öncelik veren akıllı açı çözücü (Doc 04 Section 4)
    pub fn solve_optimal_angle(
        &self,
        target_approach: DVec3,
        qualified_angles: &[PH10Angle],
        max_qualified_dev_deg: f64,
    ) -> AngleSelectionResult {
        let target_norm = target_approach.normalize();

        // 1. Aşama: Kullanıcının makinesinde daha önce kalibre edilmiş açılar içinde ara
        let mut best_qual_angle = None;
        let mut best_qual_dot = -1.0;

        for q_angle in qualified_angles {
            let dot = q_angle.direction_vector.dot(target_norm);
            if dot > best_qual_dot {
                best_qual_dot = dot;
                best_qual_angle = Some(*q_angle);
            }
        }

        let min_required_dot = max_qualified_dev_deg.to_radians().cos();
        if let Some(qual_angle) = best_qual_angle {
            if best_qual_dot >= min_required_dot {
                let angular_err = best_qual_dot.clamp(-1.0, 1.0).acos().to_degrees();
                return AngleSelectionResult {
                    selected_angle: qual_angle,
                    angular_error_deg: angular_err,
                    is_pre_qualified: true,
                    warning_message: None,
                };
            }
        }

        // 2. Aşama: Kalibre açılar yetersizse genel 720'lik tablodan en iyi teorik açıyı seç
        let (theoretical_best, err) = self.find_best_angle(target_approach);
        let warning = format!(
            "Tezgahta kalibre edilmiş hazır açı bulunamadı. Bu program için A{:.1}° B{:.1}° prob açısının kalibrasyon küresinde tanıtılması gereklidir.",
            theoretical_best.a_deg, theoretical_best.b_deg
        );

        AngleSelectionResult {
            selected_angle: theoretical_best,
            angular_error_deg: err,
            is_pre_qualified: false,
            warning_message: Some(warning),
        }
    }

    /// Manuel kafalar (MH20i) için operatör kafa çevirme sayısını en aza indiren kümeleme (Doc 04 Section 3)
    pub fn cluster_manual_angles_mh20i(
        &self,
        target_approaches: &[DVec3],
        max_clusters: usize,
    ) -> (Vec<ManualIndexCluster>, Option<String>) {
        if target_approaches.is_empty() {
            return (Vec::new(), None);
        }

        let k = max_clusters.clamp(1, target_approaches.len());
        let mut clusters: Vec<ManualIndexCluster> = Vec::new();

        // Basit ve deterministik kümeleme:
        // Her hedef için en uygun açıyı bul ve açıları grupla
        let mut angle_to_targets: std::collections::HashMap<(i32, i32), Vec<usize>> =
            std::collections::HashMap::new();

        for (idx, target) in target_approaches.iter().enumerate() {
            let (angle, _) = self.find_best_angle(*target);
            let key = ((angle.a_deg * 10.0) as i32, (angle.b_deg * 10.0) as i32);
            angle_to_targets.entry(key).or_default().push(idx);
        }

        // En çok hedefe sahip açıları büyükten küçüğe sırala
        let mut sorted_groups: Vec<_> = angle_to_targets.into_iter().collect();
        sorted_groups.sort_by(|a, b| b.1.len().cmp(&a.1.len()));

        for (c_idx, (key, indices)) in sorted_groups.into_iter().take(k).enumerate() {
            let a_deg = (key.0 as f64) / 10.0;
            let b_deg = (key.1 as f64) / 10.0;
            let angle = PH10Angle::new(a_deg, b_deg);

            let mut max_dev = 0.0;
            for &t_idx in &indices {
                let dot = angle.direction_vector.dot(target_approaches[t_idx].normalize());
                let dev = dot.clamp(-1.0, 1.0).acos().to_degrees();
                if dev > max_dev {
                    max_dev = dev;
                }
            }

            clusters.push(ManualIndexCluster {
                cluster_id: c_idx + 1,
                recommended_angle: angle,
                target_indices: indices,
                max_cluster_deviation_deg: max_dev,
            });
        }

        // Yıldız prob (5-yollu Star Stylus) önerisi değerlendirmesi (Doc 04 Section 3)
        let star_probe_suggestion = if clusters.len() > 1 {
            Some(
                "Yüzey yönelimleri incelendiğinde; 5 yollu yıldız prob (Star Stylus) ucu kullanılması durumunda tüm ölçümler tek kafa açısıyla (A0 B0) tamamlanabilir."
                    .to_string(),
            )
        } else {
            None
        };

        (clusters, star_probe_suggestion)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vertical_down_angle() {
        let lut = PH10LookUpTable::new();
        let target = DVec3::new(0.0, 0.0, -1.0);
        let (best, error) = lut.find_best_angle(target);

        assert_eq!(best.a_deg, 0.0);
        assert!(error < 0.01, "Açısal hata sıfıra yakın olmalı");
    }

    #[test]
    fn test_horizontal_lateral_angle() {
        let lut = PH10LookUpTable::new();
        let target = DVec3::new(1.0, 0.0, 0.0);
        let (best, error) = lut.find_best_angle(target);

        assert_eq!(best.a_deg, 90.0);
        assert!(error < 0.01, "90 derece yatay açı mükemmel bulunmalı");
    }

    #[test]
    fn test_qualified_angle_priority() {
        let lut = PH10LookUpTable::new();
        // Tezgahta sadece A0B0 ve A90B0 kalibre edilmiş
        let qualified = vec![
            PH10Angle::new(0.0, 0.0),
            PH10Angle::new(90.0, 0.0),
        ];

        // 1. Hedef tam -Z: Kalibre A0B0 seçilmeli (0 setup time)
        let res1 = lut.solve_optimal_angle(DVec3::new(0.0, 0.0, -1.0), &qualified, 5.0);
        assert!(res1.is_pre_qualified);
        assert_eq!(res1.selected_angle.a_deg, 0.0);
        assert!(res1.warning_message.is_none());

        // 2. Hedef eğimli (A45 B90): Kalibre açı yok, uyarı basmalı
        let res2 = lut.solve_optimal_angle(DVec3::new(0.5, 0.5, -0.707).normalize(), &qualified, 5.0);
        assert!(!res2.is_pre_qualified);
        assert!(res2.warning_message.is_some());
    }

    #[test]
    fn test_mh20i_manual_clustering_and_star_probe() {
        let lut = PH10LookUpTable::new();
        // 4 üst hedef (-Z) ve 2 yan hedef (+X)
        let targets = vec![
            DVec3::new(0.0, 0.0, -1.0),
            DVec3::new(0.0, 0.0, -1.0),
            DVec3::new(0.0, 0.0, -1.0),
            DVec3::new(0.0, 0.0, -1.0),
            DVec3::new(1.0, 0.0, 0.0),
            DVec3::new(1.0, 0.0, 0.0),
        ];

        let (clusters, star_suggestion) = lut.cluster_manual_angles_mh20i(&targets, 2);
        assert_eq!(clusters.len(), 2);
        assert!(star_suggestion.is_some(), "Star probe suggestion must be given for multi-directional targets");
    }
}
