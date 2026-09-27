//! # ortho-router::hal
//! 
//! CMM Donanım Soyutlama Katmanı (HAL - Hardware Abstraction Layer).
//! Makine çalışma hacmi (strok limitleri), prob ID eşleme sözlüğü (.prb),
//! yerel magazin değişim makrolarını (Renishaw MCR20 / FCR25) ve çoklu CMM lehçelerini yönetir.

use glam::DVec3;
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::CertifiedCollisionFreeTrajectory;

#[derive(Error, Debug, PartialEq)]
pub enum HalError {
    #[error("CMM Eksen Strok Sınırı İhlali: {axis} ekseninde {position:.2} mm pozisyonu sınır limitini ({limit:.2} mm) aştı! Tavsiye: {advice}")]
    StrokeViolation {
        axis: String,
        position: f64,
        limit: f64,
        advice: String,
    },

    #[error("Kalibre Edilmemiş Prob Açısı: A{a_deg:.1}° B{b_deg:.1}° tezgah .prb dosyasında tanımlı veya kalibreli değil! En yakın kalibre açı: {closest_advice}")]
    UncalibratedTipRequested {
        a_deg: f64,
        b_deg: f64,
        closest_advice: String,
    },

    #[error("Magazin Yuva Hatası: İstenen port ({requested_port}) mevcut magazin kapasitesini ({max_ports}) aşıyor!")]
    RackPortOutOfRange {
        requested_port: u8,
        max_ports: u8,
    },

    #[error("JSON Serileştirme Hatası: {0}")]
    SerializationError(String),
}

/// CMM Eksen Çalışma Hacmi Sınırları (Strokes)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StrokeLimits {
    pub x_min: f64,
    pub x_max: f64,
    pub y_min: f64,
    pub y_max: f64,
    pub z_min: f64,
    pub z_max: f64,
}

impl StrokeLimits {
    pub fn contains(&self, pt: DVec3) -> bool {
        pt.x >= self.x_min
            && pt.x <= self.x_max
            && pt.y >= self.y_min
            && pt.y <= self.y_max
            && pt.z >= self.z_min
            && pt.z <= self.z_max
    }
}

/// Kalibre Edilmiş Prob Ucu Tanımı
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ProbeTipDefinition {
    pub tip_id: String, // "T1A0B0", "T1A90B-90"
    pub a_deg: f64,
    pub b_deg: f64,
    pub calibrated: bool,
}

/// Prob Değiştirme Magazini (Rack) Tipi
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum RackType {
    MCR20,
    FCR25,
    SCR200,
    Custom(String),
}

/// Magazin Yapılandırması
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RackConfiguration {
    pub rack_type: RackType,
    pub num_ports: u8,
    pub use_native_macro: bool,
}

/// CMM Tezgah Donanım Profili (Machine Profile)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CmmMachineProfile {
    pub machine_id: String,
    pub vendor: String,
    pub software: String,
    pub stroke_limits: StrokeLimits,
    pub max_rapid_speed: f64,
    pub default_probe_file: String,
    pub available_tips: Vec<ProbeTipDefinition>,
    pub rack: Option<RackConfiguration>,
}

impl CmmMachineProfile {
    /// JSON metninden tezgah profili yükler
    pub fn from_json(json_str: &str) -> Result<Self, HalError> {
        serde_json::from_str(json_str).map_err(|e| HalError::SerializationError(e.to_string()))
    }

    /// Tezgah profilini JSON formatına serileştirir
    pub fn to_json(&self) -> Result<String, HalError> {
        serde_json::to_string_pretty(self)
            .map_err(|e| HalError::SerializationError(e.to_string()))
    }

    /// Standart Hexagon Global S CMM Tezgah Profili Preseti (PC-DMIS)
    pub fn default_hexagon_global_s() -> Self {
        Self {
            machine_id: "HEXAGON_GLOBAL_S_091208".to_string(),
            vendor: "Hexagon Metrology".to_string(),
            software: "PCDMIS_2023".to_string(),
            stroke_limits: StrokeLimits {
                x_min: 0.0,
                x_max: 900.0,
                y_min: 0.0,
                y_max: 1200.0,
                z_min: 0.0,
                z_max: 800.0,
            },
            max_rapid_speed: 300.0,
            default_probe_file: "PH10M_TP20_M2_20MM.prb".to_string(),
            available_tips: vec![
                ProbeTipDefinition {
                    tip_id: "T1A0B0".to_string(),
                    a_deg: 0.0,
                    b_deg: 0.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "T1A0B180".to_string(),
                    a_deg: 0.0,
                    b_deg: -180.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "T1A45B0".to_string(),
                    a_deg: 45.0,
                    b_deg: 0.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "T1A90B0".to_string(),
                    a_deg: 90.0,
                    b_deg: 0.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "T1A90B90".to_string(),
                    a_deg: 90.0,
                    b_deg: 90.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "T1A90B-90".to_string(),
                    a_deg: 90.0,
                    b_deg: -90.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "T1A90B180".to_string(),
                    a_deg: 90.0,
                    b_deg: 180.0,
                    calibrated: true,
                },
            ],
            rack: Some(RackConfiguration {
                rack_type: RackType::MCR20,
                num_ports: 6,
                use_native_macro: true,
            }),
        }
    }

    /// Zeiss Contura G2 CMM Tezgah Profili Preseti (Calypso)
    pub fn default_zeiss_contura_g2() -> Self {
        Self {
            machine_id: "ZEISS_CONTURA_G2_091208".to_string(),
            vendor: "Carl Zeiss IMT".to_string(),
            software: "CALYPSO_7.4".to_string(),
            stroke_limits: StrokeLimits {
                x_min: 0.0,
                x_max: 900.0,
                y_min: 0.0,
                y_max: 1200.0,
                z_min: 0.0,
                z_max: 800.0,
            },
            max_rapid_speed: 250.0,
            default_probe_file: "RDS_XXT_TL3.prb".to_string(),
            available_tips: vec![
                ProbeTipDefinition {
                    tip_id: "TIP_A0_B0".to_string(),
                    a_deg: 0.0,
                    b_deg: 0.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "TIP_A90_B0".to_string(),
                    a_deg: 90.0,
                    b_deg: 0.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "TIP_A90_B90".to_string(),
                    a_deg: 90.0,
                    b_deg: 90.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "TIP_A90_BN90".to_string(),
                    a_deg: 90.0,
                    b_deg: -90.0,
                    calibrated: true,
                },
            ],
            rack: Some(RackConfiguration {
                rack_type: RackType::FCR25,
                num_ports: 6,
                use_native_macro: true,
            }),
        }
    }

    /// Mitutoyo Crysta-Apex V574 CMM Preseti (MCOSMOS)
    pub fn default_mitutoyo_crysta_apex() -> Self {
        Self {
            machine_id: "MITUTOYO_CRYSTA_APEX_V574".to_string(),
            vendor: "Mitutoyo Corporation".to_string(),
            software: "MCOSMOS_4.3".to_string(),
            stroke_limits: StrokeLimits {
                x_min: 0.0,
                x_max: 500.0,
                y_min: 0.0,
                y_max: 700.0,
                z_min: 0.0,
                z_max: 400.0,
            },
            max_rapid_speed: 250.0,
            default_probe_file: "TP200_PH10M.prb".to_string(),
            available_tips: vec![
                ProbeTipDefinition {
                    tip_id: "T1A0B0".to_string(),
                    a_deg: 0.0,
                    b_deg: 0.0,
                    calibrated: true,
                },
                ProbeTipDefinition {
                    tip_id: "T1A90B0".to_string(),
                    a_deg: 90.0,
                    b_deg: 0.0,
                    calibrated: true,
                },
            ],
            rack: Some(RackConfiguration {
                rack_type: RackType::SCR200,
                num_ports: 4,
                use_native_macro: true,
            }),
        }
    }

    /// İstenen A ve B açılarına karşılık gelen kalibre edilmiş ucu bulur
    pub fn find_calibrated_tip(&self, a_deg: f64, b_deg: f64, tol: f64) -> Option<&ProbeTipDefinition> {
        self.available_tips.iter().find(|tip| {
            tip.calibrated
                && (tip.a_deg - a_deg).abs() <= tol
                && ((tip.b_deg - b_deg).abs() <= tol
                    || ((tip.b_deg - b_deg).abs() - 360.0).abs() <= tol)
        })
    }

    /// İstenen prob açısını çözer; kalibre edilmemişse en yakın kalibre ucu tavsiye eder
    pub fn resolve_or_recommend_tip(&self, a_deg: f64, b_deg: f64) -> Result<&ProbeTipDefinition, HalError> {
        if let Some(tip) = self.find_calibrated_tip(a_deg, b_deg, 1.0) {
            return Ok(tip);
        }

        // En yakın kalibre ucu bul
        let mut min_diff = f64::MAX;
        let mut best_tip: Option<&ProbeTipDefinition> = None;

        for tip in &self.available_tips {
            if !tip.calibrated {
                continue;
            }
            let diff = (tip.a_deg - a_deg).hypot(tip.b_deg - b_deg);
            if diff < min_diff {
                min_diff = diff;
                best_tip = Some(tip);
            }
        }

        let closest_advice = if let Some(best) = best_tip {
            format!("{} (A{:.1}° B{:.1}° - Açı Farkı: {:.1}°)", best.tip_id, best.a_deg, best.b_deg, min_diff)
        } else {
            "Tezgahta kalibre edilmiş prob ucu bulunamadı!".to_string()
        };

        Err(HalError::UncalibratedTipRequested {
            a_deg,
            b_deg,
            closest_advice,
        })
    }

    /// Güvenli magazin prob değişimi için hedef kontrolör lehçesinde yerel makro kodu üretir (Doc 18 Section 4)
    pub fn dispatch_tool_change_macro(&self, target_port: u8, probe_file_override: Option<&str>) -> Result<String, HalError> {
        let rack = self.rack.as_ref().ok_or_else(|| HalError::RackPortOutOfRange {
            requested_port: target_port,
            max_ports: 0,
        })?;

        if target_port == 0 || target_port > rack.num_ports {
            return Err(HalError::RackPortOutOfRange {
                requested_port: target_port,
                max_ports: rack.num_ports,
            });
        }

        let probe_file = probe_file_override.unwrap_or(&self.default_probe_file);
        let mut out = String::new();

        match self.software.to_uppercase().as_str() {
            s if s.contains("PCDMIS") => {
                out.push_str("$$ ==============================================================\n");
                out.push_str(&format!("$$ NUPER ORTHO GUVENLI PROB DEGISTIRME (YEREL MAKRO) - MCR20 PORT {}\n", target_port));
                out.push_str("$$ DIKKAT: MAGASIN YUVASINA ASLA HAM KOORDINATLA GIRILMEZ!\n");
                out.push_str("$$ ==============================================================\n");
                out.push_str(&format!("LOADPROBE/{}\n", probe_file));
                out.push_str("TIP/T1A0B0\n");
            }
            s if s.contains("CALYPSO") => {
                out.push_str(&format!("// ZEISS CALYPSO TOOL_MAGAZINE_CHANGE SLOT_{}\n", target_port));
                out.push_str(&format!("// MOUNT_PROBE_SYSTEM: {}\n", probe_file));
            }
            _ => {
                // Standart ANSI DMIS 5.3
                out.push_str("$$ ANSI DMIS 5.3 NATIVE RACK TOOL CHANGE\n");
                out.push_str(&format!("CALL/EXTERN, 'TOOL_CHANGE', 'PORT_{}'\n", target_port));
                out.push_str("SNSLCT/SA(A0.0B0.0)\n");
            }
        }

        Ok(out)
    }

    /// Rota segmentlerinin tezgahın çalışma hacmi içinde kalıp kalmadığını denetler
    pub fn validate_trajectory_envelope(
        &self,
        trajectory: &CertifiedCollisionFreeTrajectory,
        part_offset_on_granite: DVec3,
    ) -> Result<(), HalError> {
        for seg in &trajectory.segments {
            let pt = match seg {
                crate::MotionSegment::RapidLinear { target } => *target + part_offset_on_granite,
                crate::MotionSegment::TouchApproach { target, .. } => *target + part_offset_on_granite,
                crate::MotionSegment::Retract { target } => *target + part_offset_on_granite,
                crate::MotionSegment::RotateHead { .. } => continue,
            };

            if pt.x < self.stroke_limits.x_min {
                return Err(HalError::StrokeViolation {
                    axis: "X (Eksi Sınır)".to_string(),
                    position: pt.x,
                    limit: self.stroke_limits.x_min,
                    advice: format!("Parçayı granitte +X yönünde {:.1} mm kaydırınız.", (self.stroke_limits.x_min - pt.x) + 20.0),
                });
            }
            if pt.x > self.stroke_limits.x_max {
                return Err(HalError::StrokeViolation {
                    axis: "X (Artı Sınır)".to_string(),
                    position: pt.x,
                    limit: self.stroke_limits.x_max,
                    advice: format!("Parçayı granitte -X yönünde {:.1} mm kaydırınız.", (pt.x - self.stroke_limits.x_max) + 20.0),
                });
            }
            if pt.y < self.stroke_limits.y_min {
                return Err(HalError::StrokeViolation {
                    axis: "Y (Eksi Sınır)".to_string(),
                    position: pt.y,
                    limit: self.stroke_limits.y_min,
                    advice: format!("Parçayı granitte +Y yönünde {:.1} mm kaydırınız.", (self.stroke_limits.y_min - pt.y) + 20.0),
                });
            }
            if pt.y > self.stroke_limits.y_max {
                return Err(HalError::StrokeViolation {
                    axis: "Y (Artı Sınır)".to_string(),
                    position: pt.y,
                    limit: self.stroke_limits.y_max,
                    advice: format!("Parçayı granitte -Y yönünde {:.1} mm kaydırınız.", (pt.y - self.stroke_limits.y_max) + 20.0),
                });
            }
            if pt.z < self.stroke_limits.z_min {
                return Err(HalError::StrokeViolation {
                    axis: "Z (Granit Çarpması)".to_string(),
                    position: pt.z,
                    limit: self.stroke_limits.z_min,
                    advice: "Ölçüm noktası granit tabla seviyesinin altına inemez! Fikstür yükseltici kullanınız.".to_string(),
                });
            }
            if pt.z > self.stroke_limits.z_max {
                return Err(HalError::StrokeViolation {
                    axis: "Z (Tavan Limiti)".to_string(),
                    position: pt.z,
                    limit: self.stroke_limits.z_max,
                    advice: "CMM Z ekseni tavan limit switch'ine ulaştı. Emniyet zarfını (Clearance Z) düşürünüz.".to_string(),
                });
            }
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{ClearanceBox, MotionSegment};

    #[test]
    fn test_cmm_profile_json_roundtrip() {
        let profile = CmmMachineProfile::default_hexagon_global_s();
        let json = profile.to_json().expect("Serialization failed");
        assert!(json.contains("HEXAGON_GLOBAL_S_091208"));
        assert!(json.contains("MCR20"));

        let restored = CmmMachineProfile::from_json(&json).expect("Deserialization failed");
        assert_eq!(restored.machine_id, profile.machine_id);
        assert_eq!(restored.available_tips.len(), profile.available_tips.len());
    }

    #[test]
    fn test_cmm_profile_tip_lookup_and_recommendation() {
        let profile = CmmMachineProfile::default_hexagon_global_s();
        let tip = profile.resolve_or_recommend_tip(0.0, 0.0);
        assert!(tip.is_ok());
        assert_eq!(tip.unwrap().tip_id, "T1A0B0");

        // Tanımlı olmayan açı: A=45°, B=90°
        let err = profile.resolve_or_recommend_tip(45.0, 90.0);
        assert!(matches!(err, Err(HalError::UncalibratedTipRequested { .. })));
    }

    #[test]
    fn test_native_rack_tool_change_dispatch() {
        let profile = CmmMachineProfile::default_hexagon_global_s();
        let macro_code = profile.dispatch_tool_change_macro(2, None).expect("Tool change macro failed");
        assert!(macro_code.contains("LOADPROBE/PH10M_TP20_M2_20MM.prb"));
        assert!(macro_code.contains("TIP/T1A0B0"));

        // Kapasiteyi aşan port (Port 7 > 6)
        let err = profile.dispatch_tool_change_macro(7, None);
        assert!(matches!(err, Err(HalError::RackPortOutOfRange { requested_port: 7, max_ports: 6 })));
    }

    #[test]
    fn test_stroke_limit_validation_pass() {
        let profile = CmmMachineProfile::default_hexagon_global_s();
        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
        let segs = vec![
            MotionSegment::RapidLinear { target: DVec3::new(50.0, 50.0, 100.0) },
        ];
        let traj = CertifiedCollisionFreeTrajectory::new(segs, clearance, vec![]);

        assert!(profile.validate_trajectory_envelope(&traj, DVec3::new(200.0, 200.0, 0.0)).is_ok());
    }

    #[test]
    fn test_stroke_limit_violation_caught() {
        let profile = CmmMachineProfile::default_hexagon_global_s();
        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
        let segs = vec![
            MotionSegment::RapidLinear { target: DVec3::new(50.0, 50.0, 100.0) },
        ];
        let traj = CertifiedCollisionFreeTrajectory::new(segs, clearance, vec![]);

        let res = profile.validate_trajectory_envelope(&traj, DVec3::new(200.0, 1180.0, 0.0));
        assert!(matches!(res, Err(HalError::StrokeViolation { .. })));
    }
}
