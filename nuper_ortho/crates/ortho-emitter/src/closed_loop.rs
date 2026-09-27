//! # Kapalı Döngü Kalite Geri Bildirimi ve CNC Takım Aşınma Kompanzasyonu (Doc 08 & Doc 13)
//! 
//! CMM ölçüm sapmalarını (.csv, Q-DAS .dfq) ayrıştırarak Fanuc, Siemens Sinumerik ve
//! Heidenhain CNC tezgahlarına doğrudan yüklenebilir takım aşınma ofseti (Wear Offset) üretir.

use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ClosedLoopError {
    #[error("Geçersiz rapor formatı: {0}")]
    InvalidReportFormat(String),

    #[error("Kritik takım aşınması / kırılma eşiği aşıldı: Takım T{tool_number} sapması {deviation:.4} mm (Eşik: {threshold:.4} mm)")]
    ToolBreakageDetected {
        tool_number: u32,
        deviation: f64,
        threshold: f64,
    },

    #[error("Unsur için takım eşlemesi bulunamadı: {0}")]
    ToolMappingNotFound(String),
}

/// CNC Kontrol Ünitesi Tipi
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CncControllerType {
    /// Fanuc 0i / 31i (G10 L12 / G10 L10 Ofset Komutları)
    Fanuc,
    /// Siemens Sinumerik 840D / ONE ($TC_DP12, $TC_DP13 R-Parametreleri)
    SiemensSinumerik,
    /// Heidenhain TNC 640 / iTNC 530 (TOOL CALL DL/DR)
    Heidenhain,
}

/// CMM Ölçüm Raporundan Çıkarılan Sapma Verisi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FeatureDeviation {
    pub feature_name: String,
    pub nominal_value: f64,
    pub measured_value: f64,
    pub deviation: f64,
    pub upper_spec_limit: f64,
    pub lower_spec_limit: f64,
    pub is_in_tolerance: bool,
}

impl FeatureDeviation {
    pub fn new(
        feature_name: impl Into<String>,
        nominal: f64,
        measured: f64,
        usl: f64,
        lsl: f64,
    ) -> Self {
        let dev = measured - nominal;
        let in_tol = measured >= lsl && measured <= usl;
        Self {
            feature_name: feature_name.into(),
            nominal_value: nominal,
            measured_value: measured,
            deviation: dev,
            upper_spec_limit: usl,
            lower_spec_limit: lsl,
            is_in_tolerance: in_tol,
        }
    }
}

/// Unsur ile CNC Takım Eşleşmesi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ToolCompensationMapping {
    pub feature_name: String,
    pub tool_number: u32,
    /// Çap / Radyal aşınma kompanzasyon katsayısı (İç çap için ters işaret, dış çap için doğru işaret)
    pub is_internal_feature: bool,
    /// Maksimum güvenli aşınma düzeltme eşiği (Örn: 0.050 mm). Bu değer aşılırsa kompanzasyon durdurulur!
    pub max_safe_wear_limit_mm: f64,
}

/// Kapalı Döngü CNC Kompanzasyon Motoru
pub struct ClosedLoopEngine {
    pub controller_type: CncControllerType,
    pub tool_mappings: Vec<ToolCompensationMapping>,
}

impl ClosedLoopEngine {
    pub fn new(controller_type: CncControllerType) -> Self {
        Self {
            controller_type,
            tool_mappings: Vec::new(),
        }
    }

    pub fn add_tool_mapping(
        &mut self,
        feature_name: impl Into<String>,
        tool_number: u32,
        is_internal_feature: bool,
        max_safe_wear_limit_mm: f64,
    ) {
        self.tool_mappings.push(ToolCompensationMapping {
            feature_name: feature_name.into(),
            tool_number,
            is_internal_feature,
            max_safe_wear_limit_mm,
        });
    }

    /// CSV formatındaki CMM ölçüm raporunu ayrıştırır
    /// Satır formatı: `FEATURE_NAME, NOMINAL, MEASURED, USL, LSL`
    pub fn parse_csv_report(csv_content: &str) -> Result<Vec<FeatureDeviation>, ClosedLoopError> {
        let mut deviations = Vec::new();

        for line in csv_content.lines() {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with('#') || trimmed.starts_with("FEATURE") {
                continue; // Başlık veya açıklama satırlarını atla
            }

            let parts: Vec<&str> = trimmed.split(',').map(|s| s.trim()).collect();
            if parts.len() < 5 {
                return Err(ClosedLoopError::InvalidReportFormat(format!(
                    "Yetersiz sütun sayısı (en az 5 olmalı): {}",
                    trimmed
                )));
            }

            let name = parts[0];
            let nom = parts[1].parse::<f64>().map_err(|_| {
                ClosedLoopError::InvalidReportFormat(format!("Geçersiz nominal: {}", parts[1]))
            })?;
            let meas = parts[2].parse::<f64>().map_err(|_| {
                ClosedLoopError::InvalidReportFormat(format!("Geçersiz ölçülen: {}", parts[2]))
            })?;
            let usl = parts[3].parse::<f64>().map_err(|_| {
                ClosedLoopError::InvalidReportFormat(format!("Geçersiz USL: {}", parts[3]))
            })?;
            let lsl = parts[4].parse::<f64>().map_err(|_| {
                ClosedLoopError::InvalidReportFormat(format!("Geçersiz LSL: {}", parts[4]))
            })?;

            deviations.push(FeatureDeviation::new(name, nom, meas, usl, lsl));
        }

        Ok(deviations)
    }

    /// Sapma verilerinden CNC kontrol ünitesine doğrudan yüklenebilir aşınma blokları üretir
    pub fn generate_compensation_program(
        &self,
        deviations: &[FeatureDeviation],
    ) -> Result<String, ClosedLoopError> {
        let mut gcode = String::new();

        match self.controller_type {
            CncControllerType::Fanuc => {
                gcode.push_str("%\nO9901 (NUPER ORTHO CLOSED-LOOP WEAR UPDATE)\n");
                gcode.push_str("(FANUC 0i/31i TOOL WEAR COMPENSATION)\n");
            }
            CncControllerType::SiemensSinumerik => {
                gcode.push_str("; NUPER ORTHO CLOSED-LOOP WEAR UPDATE\n");
                gcode.push_str("; SIEMENS SINUMERIK 840D / ONE\n");
            }
            CncControllerType::Heidenhain => {
                gcode.push_str("BEGIN PGM WEAR_UPDATE MM\n");
            }
        }

        let mut compensated_count = 0;

        for dev in deviations {
            if let Some(mapping) = self
                .tool_mappings
                .iter()
                .find(|m| m.feature_name == dev.feature_name)
            {
                // İç çapta (delik) delik büyük çıktıysa (+sapma), freze/rayba takımı aşınmış veya esnemiştir:
                // Nominal boyuta çekmek için takım yarıçapına kompanzasyon uygulanır.
                let wear_delta = if mapping.is_internal_feature {
                    -dev.deviation / 2.0 // Yarıçap düzeltmesi
                } else {
                    dev.deviation / 2.0
                };

                // Güvenlik Kilidi: Aşırı sapma varsa takım kırılmış olabilir!
                if dev.deviation.abs() > mapping.max_safe_wear_limit_mm {
                    return Err(ClosedLoopError::ToolBreakageDetected {
                        tool_number: mapping.tool_number,
                        deviation: dev.deviation,
                        threshold: mapping.max_safe_wear_limit_mm,
                    });
                }

                match self.controller_type {
                    CncControllerType::Fanuc => {
                        // G10 L12 P{tool} R{wear_delta} -> Takım Geometri/Aşınma Yarıçapı Güncelleme
                        gcode.push_str(&format!(
                            "(UNSUR: {} | SAPMA: {:+.4} mm)\n",
                            dev.feature_name, dev.deviation
                        ));
                        gcode.push_str(&format!(
                            "G10 L12 P{} R{:.4}\n",
                            mapping.tool_number, wear_delta
                        ));
                    }
                    CncControllerType::SiemensSinumerik => {
                        // $TC_DP13[T,D] = Aşınma Yarıçapı
                        gcode.push_str(&format!(
                            "; UNSUR: {} | SAPMA: {:+.4} mm\n",
                            dev.feature_name, dev.deviation
                        ));
                        gcode.push_str(&format!(
                            "$TC_DP13[{}, 1] = $TC_DP13[{}, 1] + ({:.4})\n",
                            mapping.tool_number, mapping.tool_number, wear_delta
                        ));
                    }
                    CncControllerType::Heidenhain => {
                        gcode.push_str(&format!(
                            "; UNSUR: {} | SAPMA: {:+.4} mm\n",
                            dev.feature_name, dev.deviation
                        ));
                        gcode.push_str(&format!(
                            "TOOL CALL {} DR{:.4}\n",
                            mapping.tool_number, wear_delta
                        ));
                    }
                }
                compensated_count += 1;
            }
        }

        match self.controller_type {
            CncControllerType::Fanuc => gcode.push_str("M30\n%\n"),
            CncControllerType::SiemensSinumerik => gcode.push_str("M30\n"),
            CncControllerType::Heidenhain => gcode.push_str("END PGM WEAR_UPDATE MM\n"),
        }

        if compensated_count == 0 {
            return Err(ClosedLoopError::ToolMappingNotFound(
                "Raporlanan hiçbir unsur için tanımlı takım eşleşmesi bulunamadı".into(),
            ));
        }

        Ok(gcode)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_csv_deviation_parsing() {
        let csv = r#"
FEATURE_NAME, NOMINAL, MEASURED, USL, LSL
BORE_20_H7, 20.0000, 20.0120, 20.0210, 20.0000
PIN_10_M6, 10.0000, 9.9940, 10.0090, 9.9910
"#;
        let devs = ClosedLoopEngine::parse_csv_report(csv).unwrap();
        assert_eq!(devs.len(), 2);
        assert_eq!(devs[0].feature_name, "BORE_20_H7");
        assert!((devs[0].deviation - 0.0120).abs() < 1e-6);
        assert!(devs[0].is_in_tolerance);
    }

    #[test]
    fn test_fanuc_wear_compensation_generation() {
        let mut engine = ClosedLoopEngine::new(CncControllerType::Fanuc);
        engine.add_tool_mapping("BORE_20_H7", 3, true, 0.050); // Takım 3: Rayba / Freze

        let devs = vec![FeatureDeviation::new(
            "BORE_20_H7",
            20.0000,
            20.0140, // +0.014 mm büyük çıkmış
            20.0210,
            20.0000,
        )];

        let gcode = engine.generate_compensation_program(&devs).unwrap();
        assert!(gcode.contains("G10 L12 P3 R-0.0070"));
        assert!(gcode.contains("M30"));
    }

    #[test]
    fn test_siemens_sinumerik_compensation_generation() {
        let mut engine = ClosedLoopEngine::new(CncControllerType::SiemensSinumerik);
        engine.add_tool_mapping("BORE_20_H7", 5, true, 0.050);

        let devs = vec![FeatureDeviation::new(
            "BORE_20_H7",
            20.0000,
            20.0080,
            20.0210,
            20.0000,
        )];

        let gcode = engine.generate_compensation_program(&devs).unwrap();
        assert!(gcode.contains("$TC_DP13[5, 1] = $TC_DP13[5, 1] + (-0.0040)"));
    }

    #[test]
    fn test_tool_breakage_safety_guard_aborts() {
        let mut engine = ClosedLoopEngine::new(CncControllerType::Fanuc);
        engine.add_tool_mapping("BORE_20_H7", 3, true, 0.050); // Maksimum 0.050 mm

        let catastrophic_dev = vec![FeatureDeviation::new(
            "BORE_20_H7",
            20.0000,
            20.2500, // +0.250 mm sapma (Takım kesin kırılmış!)
            20.0210,
            20.0000,
        )];

        let result = engine.generate_compensation_program(&catastrophic_dev);
        assert!(matches!(
            result,
            Err(ClosedLoopError::ToolBreakageDetected { .. })
        ));
    }
}
