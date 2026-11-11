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

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CncControllerType {
    Fanuc,
    SiemensSinumerik,
    Heidenhain,
    Haas,
}

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

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ToolCompensationMapping {
    pub feature_name: String,
    pub tool_number: u32,
    pub is_internal_feature: bool,
    pub max_safe_wear_limit_mm: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SpcAnalysisResult {
    pub mean: f64,
    pub std_dev: f64,
    pub cp: f64,
    pub cpk: f64,
    pub slope: f64,
    pub intercept: f64,
    pub predicted_next: f64,
    pub tolerance_consumed_ratio: f64,
    pub requires_predictive_compensation: bool,
    pub suggested_compensation_mm: f64,
}

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

    pub fn parse_csv_report(csv_content: &str) -> Result<Vec<FeatureDeviation>, ClosedLoopError> {
        let mut deviations = Vec::new();

        for line in csv_content.lines() {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with('#') || trimmed.starts_with("FEATURE") {
                continue;
            }

            let parts: Vec<&str> = trimmed.split(',').map(|s| s.trim()).collect();
            if parts.len() < 5 {
                return Err(ClosedLoopError::InvalidReportFormat(format!(
                    "Yetersiz sütun sayısı: {}",
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

    pub fn analyze_spc_trend(measurements: &[f64], usl: f64, lsl: f64) -> SpcAnalysisResult {
        let n = measurements.len();
        if n == 0 {
            return SpcAnalysisResult {
                mean: 0.0,
                std_dev: 0.0,
                cp: 0.0,
                cpk: 0.0,
                slope: 0.0,
                intercept: 0.0,
                predicted_next: 0.0,
                tolerance_consumed_ratio: 0.0,
                requires_predictive_compensation: false,
                suggested_compensation_mm: 0.0,
            };
        }

        let mean = measurements.iter().sum::<f64>() / (n as f64);
        let variance = if n > 1 {
            measurements.iter().map(|&x| (x - mean).powi(2)).sum::<f64>() / ((n - 1) as f64)
        } else {
            0.0
        };
        let std_dev = variance.sqrt();

        let tolerance = usl - lsl;
        let cp = if std_dev > 1e-9 {
            tolerance / (6.0 * std_dev)
        } else {
            99.99
        };

        let cpk = if std_dev > 1e-9 {
            let cpu = (usl - mean) / (3.0 * std_dev);
            let cpl = (mean - lsl) / (3.0 * std_dev);
            cpu.min(cpl)
        } else {
            99.99
        };

        let (slope, intercept) = if n >= 2 {
            let t_mean = (n as f64 + 1.0) / 2.0;
            let mut num = 0.0;
            let mut den = 0.0;
            for (i, &y) in measurements.iter().enumerate() {
                let t = (i + 1) as f64;
                num += (t - t_mean) * (y - mean);
                den += (t - t_mean).powi(2);
            }
            let s = if den.abs() > 1e-12 { num / den } else { 0.0 };
            let inter = mean - s * t_mean;
            (s, inter)
        } else {
            (0.0, mean)
        };

        let next_t = (n + 1) as f64;
        let predicted_next = intercept + slope * next_t;
        let nominal = (usl + lsl) * 0.5;
        let half_tol = tolerance * 0.5;
        let pred_dev = (predicted_next - nominal).abs();
        let consumption_ratio = if half_tol > 1e-9 {
            pred_dev / half_tol
        } else {
            0.0
        };

        let requires_predictive = consumption_ratio >= 0.70;
        let suggested_compensation = if requires_predictive {
            -(predicted_next - nominal)
        } else {
            0.0
        };

        SpcAnalysisResult {
            mean,
            std_dev,
            cp,
            cpk,
            slope,
            intercept,
            predicted_next,
            tolerance_consumed_ratio: consumption_ratio,
            requires_predictive_compensation: requires_predictive,
            suggested_compensation_mm: suggested_compensation,
        }
    }

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
            CncControllerType::Haas => {
                gcode.push_str("%\nO9901 (NUPER ORTHO HAAS WEAR UPDATE)\n");
            }
        }

        let mut compensated_count = 0;

        for dev in deviations {
            if let Some(mapping) = self
                .tool_mappings
                .iter()
                .find(|m| m.feature_name == dev.feature_name)
            {
                let wear_delta = if mapping.is_internal_feature {
                    -dev.deviation / 2.0
                } else {
                    dev.deviation / 2.0
                };

                if dev.deviation.abs() > mapping.max_safe_wear_limit_mm {
                    return Err(ClosedLoopError::ToolBreakageDetected {
                        tool_number: mapping.tool_number,
                        deviation: dev.deviation,
                        threshold: mapping.max_safe_wear_limit_mm,
                    });
                }

                match self.controller_type {
                    CncControllerType::Fanuc => {
                        gcode.push_str(&format!(
                            "(UNSUR: {} | SAPMA: {:+.4} mm)\n",
                            dev.feature_name, dev.deviation
                        ));
                        gcode.push_str(&format!(
                            "G10 L12 P{} R{:.4}\n",
                            mapping.tool_number, wear_delta
                        ));
                    }
                    CncControllerType::Haas => {
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
            CncControllerType::Fanuc | CncControllerType::Haas => gcode.push_str("M30\n%\n"),
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

    pub fn generate_spc_predictive_compensation(
        &self,
        tool_number: u32,
        is_internal_feature: bool,
        spc: &SpcAnalysisResult,
    ) -> Option<String> {
        if !spc.requires_predictive_compensation {
            return None;
        }

        let wear_delta = if is_internal_feature {
            spc.suggested_compensation_mm / 2.0
        } else {
            -spc.suggested_compensation_mm / 2.0
        };

        match self.controller_type {
            CncControllerType::Fanuc | CncControllerType::Haas => Some(format!(
                "G10 L12 P{} R{:.4}",
                tool_number, wear_delta
            )),
            CncControllerType::SiemensSinumerik => Some(format!(
                "$TC_DP13[{}, 1] = $TC_DP13[{}, 1] + ({:.4})",
                tool_number, tool_number, wear_delta
            )),
            CncControllerType::Heidenhain => Some(format!(
                "TOOL CALL {} DR{:.4}",
                tool_number, wear_delta
            )),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum WorkpieceMaterial {
    Aluminum,
    Steel,
    Titanium,
}

impl WorkpieceMaterial {
    pub fn cte(&self) -> f64 {
        match self {
            WorkpieceMaterial::Aluminum => 23.1e-6,
            WorkpieceMaterial::Steel => 11.5e-6,
            WorkpieceMaterial::Titanium => 8.6e-6,
        }
    }
}

pub fn compensate_thermal_expansion(
    nominal_length_mm: f64,
    raw_deviation_mm: f64,
    material: WorkpieceMaterial,
    part_temp_c: f64,
    cmm_temp_c: f64,
) -> (f64, f64, f64) {
    let alpha_part = material.cte();
    let alpha_cmm = 8.0e-6;
    let delta_part = part_temp_c - 20.0;
    let delta_cmm = cmm_temp_c - 20.0;

    let thermal_expansion = nominal_length_mm * (alpha_part * delta_part - alpha_cmm * delta_cmm);
    let net_wear_deviation = raw_deviation_mm - thermal_expansion;
    let net_wear_offset = -net_wear_deviation / 2.0;

    (thermal_expansion, net_wear_deviation, net_wear_offset)
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
        engine.add_tool_mapping("BORE_20_H7", 3, true, 0.050);

        let devs = vec![FeatureDeviation::new(
            "BORE_20_H7",
            20.0000,
            20.0140,
            20.0210,
            20.0000,
        )];

        let gcode = engine.generate_compensation_program(&devs).unwrap();
        assert!(gcode.contains("G10 L12 P3 R-0.0070"));
        assert!(gcode.contains("M30"));
    }

    #[test]
    fn test_haas_wear_compensation_generation() {
        let mut engine = ClosedLoopEngine::new(CncControllerType::Haas);
        engine.add_tool_mapping("BORE_20_H7", 2, true, 0.050);

        let devs = vec![FeatureDeviation::new(
            "BORE_20_H7",
            20.0000,
            20.0100,
            20.0210,
            20.0000,
        )];

        let gcode = engine.generate_compensation_program(&devs).unwrap();
        assert!(gcode.contains("G10 L12 P2 R-0.0050"));
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
        engine.add_tool_mapping("BORE_20_H7", 3, true, 0.050);

        let catastrophic_dev = vec![FeatureDeviation::new(
            "BORE_20_H7",
            20.0000,
            20.2500,
            20.0210,
            20.0000,
        )];

        let result = engine.generate_compensation_program(&catastrophic_dev);
        assert!(matches!(
            result,
            Err(ClosedLoopError::ToolBreakageDetected { .. })
        ));
    }

    #[test]
    fn test_spc_wear_trend_prediction_and_trigger_at_part_8() {
        let nominal = 20.000;
        let usl = 20.030;
        let lsl = 19.970;

        let mut measurements = Vec::new();
        for i in 1..=8 {
            measurements.push(nominal + (i as f64) * 0.003);
        }

        let spc = ClosedLoopEngine::analyze_spc_trend(&measurements, usl, lsl);
        assert!((spc.slope - 0.003).abs() < 1e-6);
        assert_eq!(measurements.len(), 8);
        assert!((measurements[7] - 20.024).abs() < 1e-6);
        assert!((spc.predicted_next - 20.027).abs() < 1e-4);
        assert!(spc.tolerance_consumed_ratio >= 0.70);
        assert!(spc.requires_predictive_compensation);

        let engine = ClosedLoopEngine::new(CncControllerType::Fanuc);
        let gcode_line = engine
            .generate_spc_predictive_compensation(4, true, &spc)
            .expect("G10 compensation must be generated");
        assert!(gcode_line.contains("G10 L12 P4 R-0.0135"));
    }

    #[test]
    fn test_thermal_expansion_compensation_aluminum_28c() {
        let (thermal_expansion, net_wear_dev, net_wear_offset) = compensate_thermal_expansion(
            395.5,
            0.0800,
            WorkpieceMaterial::Aluminum,
            28.0,
            20.0,
        );
        let diff = (thermal_expansion - 0.0731).abs();
        assert!(diff < 0.001);
        assert!((net_wear_dev - (0.0800 - thermal_expansion)).abs() < 1e-6);
        assert!((net_wear_offset - (-net_wear_dev / 2.0)).abs() < 1e-6);
    }
}
