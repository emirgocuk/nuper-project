//! # Kapalı Döngü Kök Neden Analiz Asistanı (Doc 14 Bölüm 5)
//!
//! Tolerans dışına çıkan ölçüm raporlarındaki sistematik örüntüleri analiz ederek
//! CNC parça sıfırı kayması (G54), Takım aşınması (Wear) veya Mengene sıkma esnemesini (Deflection) tespit eder.

use serde::{Deserialize, Serialize};

/// Kök Neden Karar Türü
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum RootCauseType {
    /// Tüm unsurlarda aynı yönde sabit kayma (Örn: X ekseninde +0.025 mm)
    PartZeroCoordinateShift {
        axis: char,
        average_shift_mm: f64,
    },
    /// Deliklerin daralması veya pimlerin büyümesi (Takım aşınması)
    ProgressiveToolWear {
        tool_affected: String,
        suggested_wear_comp_mm: f64,
    },
    /// Düzlemsellik ve eğrilikte yaylanma (Aşırı torkla sıkma / mengene deformasyonu)
    ClampingDistortion {
        max_springback_mm: f64,
    },
    /// Rastgele / Karışık sapmalar
    RandomScattered,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RootCauseReport {
    pub verdict: RootCauseType,
    pub explanation: String,
    pub action_advice: String,
}

pub struct RootCauseAnalyzer;

impl RootCauseAnalyzer {
    /// Tekrarlı ölçüm sapmalarını inceleyerek kök nedeni teşhis eder
    pub fn diagnose_deviations(
        feature_deviations: &[(&str, f64)], // (Unsur Adı, Sapma mm)
    ) -> RootCauseReport {
        if feature_deviations.is_empty() {
            return RootCauseReport {
                verdict: RootCauseType::RandomScattered,
                explanation: "Ölçüm verisi yok.".to_string(),
                action_advice: "Ölçüm yapınız.".to_string(),
            };
        }

        let devs: Vec<f64> = feature_deviations.iter().map(|(_, d)| *d).collect();
        let avg_dev: f64 = devs.iter().sum::<f64>() / devs.len() as f64;
        let all_positive = devs.iter().all(|&d| d > 0.005);
        let max_dev = devs.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
        let min_dev = devs.iter().cloned().fold(f64::INFINITY, f64::min);
        let spread = max_dev - min_dev;

        // 1. Örüntü: Tüm delikler veya unsurlar neredeyse aynı miktarda pozitif mi kaymış? (spread < 0.008 mm)
        if all_positive && spread < 0.008 && avg_dev > 0.010 {
            RootCauseReport {
                verdict: RootCauseType::PartZeroCoordinateShift {
                    axis: 'X',
                    average_shift_mm: avg_dev,
                },
                explanation: format!(
                    "Tüm ölçüm noktalarında ortalama +{:.4} mm sistematik ötelenme tespit edildi.",
                    avg_dev
                ),
                action_advice: format!(
                    "CNC parça sıfırı (G54) veya mengene mekanik dayaması gevşemiş olabilir. G54 ofsetine {:.4} mm düzeltme uygulayınız.",
                    -avg_dev
                ),
            }
        } else if devs.iter().any(|&d| d > 0.035) && devs.iter().any(|&d| d < -0.010) {
            // 2. Örüntü: Zıt yönlerde aşırı sapma (Parça sıkılınca eğilmiş, sökülünce yaylanmış)
            RootCauseReport {
                verdict: RootCauseType::ClampingDistortion {
                    max_springback_mm: spread,
                },
                explanation: format!(
                    "Parça üzerinde {:.4} mm seviyesinde zıt form yaylanması saptandı.",
                    spread
                ),
                action_advice: "Mengene veya fikstür pabuçları aşırı torkla sıkılmış olabilir. Pabuç torkunu düşürünüz veya destek pimi ekleyiniz.".to_string(),
            }
        } else {
            // 3. Örüntü: Takım aşınması
            RootCauseReport {
                verdict: RootCauseType::ProgressiveToolWear {
                    tool_affected: "T01_ENDMILL".to_string(),
                    suggested_wear_comp_mm: -avg_dev / 2.0,
                },
                explanation: format!(
                    "Nominalden +{:.4} mm tekdüze sapma gözlemlendi (Takım aşınma eğilimi).",
                    avg_dev
                ),
                action_advice: format!(
                    "Takım yarıçap aşınma parametresine {:.4} mm kompanzasyon giriniz.",
                    -avg_dev / 2.0
                ),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_zero_shift_detection() {
        let devs = vec![
            ("HOLE_01", 0.0252),
            ("HOLE_02", 0.0248),
            ("HOLE_03", 0.0250),
            ("HOLE_04", 0.0255),
        ];

        let report = RootCauseAnalyzer::diagnose_deviations(&devs);
        assert!(matches!(report.verdict, RootCauseType::PartZeroCoordinateShift { .. }));
        assert!(report.action_advice.contains("G54"));
    }

    #[test]
    fn test_clamping_distortion_detection() {
        let devs = vec![
            ("TOP_FLANGE", 0.0420),
            ("BOTTOM_BASE", -0.0150),
        ];

        let report = RootCauseAnalyzer::diagnose_deviations(&devs);
        assert!(matches!(report.verdict, RootCauseType::ClampingDistortion { .. }));
        assert!(report.action_advice.contains("Mengene"));
    }
}
