//! # Uluslararası Metroloji Standartları, Belirsizlik Bütçesi ve Karar Kuralları (Doc 09)
//! 
//! 1. GUM & ISO 15530-3 (Virtual CMM Belirsizlik Bütçesi & TUR 4:1 Analizi)
//! 2. ISO 14253-1 (Guard-Banding Güvenlik Bandı Karar Matrisi: PASS / SUSPECT / FAIL)
//! 3. ISO 16610-31 (Sağlam Gauss ve 3-Sigma Uç Değer / Çapak Ayıklama Filtresi)

use serde::{Deserialize, Serialize};

/// ISO 14253-1 Metrolojik Kabul Karar Durumu
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ConformanceDecision {
    /// Kesin Uygun (Ölçüm [LSL + U, USL - U] güvenli kabul bölgesi içinde)
    Pass,
    /// Şüpheli / Sınırda (Ölçüm [LSL - U, LSL + U] veya [USL - U, USL + U] güvenlik bandında)
    Suspect,
    /// Kesin Hatalı (Ölçüm < LSL - U veya > USL + U)
    Fail,
}

/// GUM & ISO 15530-3 Ölçüm Belirsizliği Bütçesi (Uncertainty Budget)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct UncertaintyBudget {
    /// CMM eksenlerinin lineer ve açısal geometrik sapması (ISO 10360-2 MPE_E) (mm)
    pub u_geo: f64,
    /// Prob uzatması, kafa açısı ve temas yönüne bağlı esneme belirsizliği (mm)
    pub u_probe: f64,
    /// Parça ve cetvel arasındaki sıcaklık farkı genleşme belirsizliği (mm)
    pub u_temp: f64,
    /// Tekrarlanabilirlik varyansı (mm)
    pub u_rep: f64,
}

impl UncertaintyBudget {
    pub fn new(u_geo: f64, u_probe: f64, u_temp: f64, u_rep: f64) -> Self {
        Self {
            u_geo,
            u_probe,
            u_temp,
            u_rep,
        }
    }

    /// Tipik CMM ve stylus konfigürasyonu için varsayılan belirsizlik bütçesi üretir
    pub fn default_cmm_budget(extension_length_mm: f64, measured_dimension_mm: f64) -> Self {
        // ISO 10360-2: MPE_E = 1.5 + L/350 um
        let u_geo = (1.5 + measured_dimension_mm / 350.0) / 1000.0;
        // Prob uzatması: her 50 mm uzatma için yaklaşık 0.4 um belirsizlik
        let u_probe = 0.0005 + (extension_length_mm / 50.0) * 0.0004;
        // Sıcaklık: 20 +/- 1 °C, alüminyum (23.4 um/m/°C)
        let u_temp = 1.0 * 23.4e-6 * measured_dimension_mm;
        // Tekrarlanabilirlik: standart dokunmatik prob için ~0.3 um
        let u_rep = 0.0003;

        Self {
            u_geo,
            u_probe,
            u_temp,
            u_rep,
        }
    }

    /// Bileşik Standart Belirsizlik: u_c = sqrt(u_geo^2 + u_probe^2 + u_temp^2 + u_rep^2)
    pub fn calculate_combined(&self) -> f64 {
        (self.u_geo.powi(2)
            + self.u_probe.powi(2)
            + self.u_temp.powi(2)
            + self.u_rep.powi(2))
        .sqrt()
    }

    /// Genişletilmiş Belirsizlik (k=2.0 -> %95 Güven Aralığı)
    pub fn calculate_expanded(&self, coverage_factor_k: f64) -> f64 {
        coverage_factor_k * self.calculate_combined()
    }

    /// Test Uncertainty Ratio (TUR) Doğrulaması (4:1 Prensibi - Doc 09 Bölüm 1.C)
    /// TUR = T / (2 * U) >= 4.0
    pub fn evaluate_tur(&self, tolerance_band_mm: f64) -> (f64, bool) {
        let expanded_u = self.calculate_expanded(2.0);
        let tur = tolerance_band_mm / (2.0 * expanded_u);
        let is_acceptable = tur >= 4.0;
        (tur, is_acceptable)
    }

    /// ISO 14253-1 Guard-Banding Karar Değerlendirmesi
    pub fn evaluate_guard_banding(
        &self,
        measured: f64,
        usl: f64,
        lsl: f64,
    ) -> (ConformanceDecision, String) {
        let u = self.calculate_expanded(2.0);

        let safe_lower = lsl + u;
        let safe_upper = usl - u;

        if measured >= safe_lower && measured <= safe_upper {
            (
                ConformanceDecision::Pass,
                format!("Ölçüm ({:.4} mm) güvenli kabul bandı [{:.4}, {:.4}] içinde (U = ±{:.4} mm).", measured, safe_lower, safe_upper, u),
            )
        } else if (measured >= lsl - u && measured <= lsl + u)
            || (measured >= usl - u && measured <= usl + u)
        {
            (
                ConformanceDecision::Suspect,
                format!("ÖLÇÜM ŞÜPHELİ: Ölçüm ({:.4} mm) belirsizlik güvenlik sınırında [{:.4}, {:.4}] (U = ±{:.4} mm). Laboratuvar doğrulaması gerekir.", measured, lsl, usl, u),
            )
        } else {
            (
                ConformanceDecision::Fail,
                format!("ÖLÇÜM HATALI: Ölçüm ({:.4} mm) tolerans sınırlarının dışında (USL: {:.4}, LSL: {:.4}).", measured, usl, lsl),
            )
        }
    }
}

/// ISO 16610-31 Sağlam Gauss ve 3-Sigma Uç Değer / Çapak Ayıklama Filtresi
pub struct RobustOutlierFilter;

impl RobustOutlierFilter {
    /// ISO 16610-31 Robust Median & MAD (Median Absolute Deviation) ile çapak, toz vb. uç değerleri ayıklar.
    /// Default olarak k=4.0 katsayısı kullanılır (küçük numune setlerinde yanlış pozitif ayıklamayı önler).
    pub fn filter_outliers(deviations: &[f64]) -> Vec<f64> {
        Self::filter_outliers_with_k(deviations, 4.0)
    }

    /// Özel k katsayısı ile uç değer ayıklama (örn. k=3.0 sıkı, k=4.0 toleranslı)
    pub fn filter_outliers_with_k(deviations: &[f64], k: f64) -> Vec<f64> {
        if deviations.len() < 4 {
            return deviations.to_vec();
        }

        // Medyan hesabı
        let mut sorted = deviations.to_vec();
        sorted.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
        let mid = sorted.len() / 2;
        let median = if sorted.len() % 2 == 0 {
            (sorted[mid - 1] + sorted[mid]) / 2.0
        } else {
            sorted[mid]
        };

        // Median Absolute Deviation (MAD)
        let mut abs_diffs: Vec<f64> = deviations.iter().map(|&d| (d - median).abs()).collect();
        abs_diffs.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
        let mad = if abs_diffs.len() % 2 == 0 {
            (abs_diffs[mid - 1] + abs_diffs[mid]) / 2.0
        } else {
            abs_diffs[mid]
        };

        // Normal dağılım eşdeğeri: sigma_hat = 1.4826 * MAD
        let sigma_hat = 1.4826 * mad.max(1e-6);
        let threshold = k * sigma_hat;

        deviations
            .iter()
            .copied()
            .filter(|&d| (d - median).abs() <= threshold)
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_uncertainty_budget_and_tur_calculation() {
        let budget = UncertaintyBudget::default_cmm_budget(50.0, 100.0);
        let u_c = budget.calculate_combined();
        let u_exp = budget.calculate_expanded(2.0);

        assert!(u_c > 0.001 && u_c < 0.010);
        assert!((u_exp - 2.0 * u_c).abs() < 1e-9);

        // H7 Toleransı: 0.021 mm
        let (tur, is_valid) = budget.evaluate_tur(0.021);
        assert!(tur > 0.0);
        // TUR doğrulaması kontrolü
        if tur >= 4.0 {
            assert!(is_valid);
        } else {
            assert!(!is_valid);
        }
    }

    #[test]
    fn test_iso_14253_guard_banding_decisions() {
        let budget = UncertaintyBudget::new(0.001, 0.0005, 0.0005, 0.0005);
        let u = budget.calculate_expanded(2.0); // ~0.0026 mm
        assert!(u > 0.0);

        let usl = 20.021;
        let lsl = 20.000;

        // 1. Güvenli kabul bölgesi ortası -> PASS
        let (dec_pass, _) = budget.evaluate_guard_banding(20.010, usl, lsl);
        assert_eq!(dec_pass, ConformanceDecision::Pass);

        // 2. Tam tolerans sınırında (USL'ye çok yakın: 20.0205) -> SUSPECT
        let (dec_suspect, msg_suspect) = budget.evaluate_guard_banding(20.0205, usl, lsl);
        assert_eq!(dec_suspect, ConformanceDecision::Suspect);
        assert!(msg_suspect.contains("ŞÜPHELİ"));

        // 3. Toleransın açıkça dışında (20.035) -> FAIL
        let (dec_fail, _) = budget.evaluate_guard_banding(20.035, usl, lsl);
        assert_eq!(dec_fail, ConformanceDecision::Fail);
    }

    #[test]
    fn test_iso_16610_outlier_filtering() {
        // Normal sapmalar + 1 tane çapak sıçraması (+0.050 mm)
        let raw_devs = vec![
            0.002, 0.003, 0.001, 0.002, 0.0025, 0.0018,
            0.0500, // Çapak / Toz tanesi
            0.0022, 0.0019, 0.0021,
        ];

        let filtered = RobustOutlierFilter::filter_outliers(&raw_devs);
        assert_eq!(filtered.len(), 9); // Çapak noktası ayıklandı
        assert!(!filtered.iter().any(|&d| d > 0.040));
    }
}
