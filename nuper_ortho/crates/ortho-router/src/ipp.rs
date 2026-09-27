//! # I++ DME v1.7 / v2.0 Endüstriyel Ağ Protokolü Katmanı
//! 
//! CMM kontrol üniteleri (Hexagon, Zeiss, Mitutoyo, Wenzel, LK) ile çift yönlü
//! TCP/IP haberleşme, komut serileştirme, yanıt ayrıştırma ve simülasyon motoru.

use glam::DVec3;
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::{CertifiedCollisionFreeTrajectory, MotionSegment};

#[derive(Error, Debug, PartialEq)]
pub enum IppError {
    #[error("Geçersiz I++ DME sözdizimi: {0}")]
    InvalidSyntax(String),

    #[error("Bilinmeyen veya desteklenmeyen I++ komutu: {0}")]
    UnknownCommand(String),

    #[error("Oturum başlatılmadı (StartSession çağrılmalı)")]
    SessionNotActive,

    #[error("CMM Home pozisyonuna gönderilmedi")]
    NotHomed,

    #[error("Strok limiti aşıldı: {0}")]
    StrokeLimitExceeded(String),
}

/// I++ DME Komut Tipleri (v1.7 / v2.0 Standart)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum IppCommand {
    /// Oturum Başlatma: `StartSession()`
    StartSession,
    /// Oturum Sonlandırma: `EndSession()`
    EndSession,
    /// Protokol ve CMM Versiyonu Sorgulama: `GetDMEVersion()`
    GetDMEVersion,
    /// Aktif Koordinat Sistemi Sorgulama: `GetCoordSystem()`
    GetCoordSystem,
    /// Koordinat Sistemi Değiştirme: `SetCoordSystem(PCS)` veya `SetCoordSystem(MCS)`
    SetCoordSystem { name: String },
    /// CMM'i Mekanik Referans / Sıfır Noktasına Gönderme: `Home()`
    Home,
    /// Hızlı İntikal Hareketi: `GoTo(X(...), Y(...), Z(...))`
    GoTo { target: DVec3, speed_mms: Option<f64> },
    /// Yüzey Dokunmatik Ölçüm: `PtMeas(X(...), Y(...), Z(...), I(...), J(...), K(...))`
    PtMeas { target: DVec3, normal: DVec3 },
    /// Prob Takımı Değişimi: `ChangeTool("TOOL_NAME")`
    ChangeTool { tool_name: String },
    /// Acil Durum Hareketi Durdurma: `AbortE()`
    AbortE,
}

/// I++ DME Sunucu Yanıt Tipleri
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum IppResponse {
    /// İlerleme Bilgisi: `00001 #` (Komut kabul edildi, çalışıyor)
    Ack { tag: u32 },
    /// Başarıyla Tamamlandı: `00001 %`
    Complete { tag: u32 },
    /// Veri Yanıtı: `00001 & ...`
    Data { tag: u32, payload: String },
    /// Hata Yanıtı: `00001 ! Error(...)`
    Error { tag: u32, error_code: String, message: String },
}

/// I++ DME Protokol Ayrıştırıcı ve Biçimlendirici
pub struct IppProtocol;

impl IppProtocol {
    /// Komutu numaralandırılmış I++ DME metin satırına dönüştürür (Örn: `00001 GoTo(X(10.0), ...)`)
    pub fn format_command(tag: u32, cmd: &IppCommand) -> String {
        let tag_str = format!("{:05}", tag);
        match cmd {
            IppCommand::StartSession => format!("{} StartSession()", tag_str),
            IppCommand::EndSession => format!("{} EndSession()", tag_str),
            IppCommand::GetDMEVersion => format!("{} GetDMEVersion()", tag_str),
            IppCommand::GetCoordSystem => format!("{} GetCoordSystem()", tag_str),
            IppCommand::SetCoordSystem { name } => {
                format!("{} SetCoordSystem({})", tag_str, name)
            }
            IppCommand::Home => format!("{} Home()", tag_str),
            IppCommand::GoTo { target, speed_mms } => {
                if let Some(spd) = speed_mms {
                    format!(
                        "{} GoTo(X({:.4}), Y({:.4}), Z({:.4}), Speed({:.1}))",
                        tag_str, target.x, target.y, target.z, spd
                    )
                } else {
                    format!(
                        "{} GoTo(X({:.4}), Y({:.4}), Z({:.4}))",
                        tag_str, target.x, target.y, target.z
                    )
                }
            }
            IppCommand::PtMeas { target, normal } => {
                format!(
                    "{} PtMeas(X({:.4}), Y({:.4}), Z({:.4}), I({:.4}), J({:.4}), K({:.4}))",
                    tag_str, target.x, target.y, target.z, normal.x, normal.y, normal.z
                )
            }
            IppCommand::ChangeTool { tool_name } => {
                format!("{} ChangeTool(\"{}\")", tag_str, tool_name)
            }
            IppCommand::AbortE => format!("{} AbortE()", tag_str),
        }
    }

    /// I++ DME metin satırını ayrıştırır
    pub fn parse_command(line: &str) -> Result<(u32, IppCommand), IppError> {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            return Err(IppError::InvalidSyntax("Boş satır".to_string()));
        }

        let parts: Vec<&str> = trimmed.splitn(2, ' ').collect();
        if parts.len() < 2 {
            return Err(IppError::InvalidSyntax("Etiket veya komut eksik".to_string()));
        }

        let tag = parts[0]
            .parse::<u32>()
            .map_err(|_| IppError::InvalidSyntax(format!("Geçersiz etiket: {}", parts[0])))?;

        let cmd_str = parts[1].trim();

        if cmd_str.starts_with("StartSession") {
            Ok((tag, IppCommand::StartSession))
        } else if cmd_str.starts_with("EndSession") {
            Ok((tag, IppCommand::EndSession))
        } else if cmd_str.starts_with("GetDMEVersion") {
            Ok((tag, IppCommand::GetDMEVersion))
        } else if cmd_str.starts_with("GetCoordSystem") {
            Ok((tag, IppCommand::GetCoordSystem))
        } else if cmd_str.starts_with("SetCoordSystem") {
            let name = Self::extract_inside_parens(cmd_str)?;
            Ok((tag, IppCommand::SetCoordSystem { name }))
        } else if cmd_str.starts_with("Home") {
            Ok((tag, IppCommand::Home))
        } else if cmd_str.starts_with("AbortE") {
            Ok((tag, IppCommand::AbortE))
        } else if cmd_str.starts_with("ChangeTool") {
            let tool = Self::extract_inside_parens(cmd_str)?
                .trim_matches('"')
                .to_string();
            Ok((tag, IppCommand::ChangeTool { tool_name: tool }))
        } else if cmd_str.starts_with("GoTo") {
            let (x, y, z) = Self::parse_xyz_params(cmd_str)?;
            Ok((tag, IppCommand::GoTo { target: DVec3::new(x, y, z), speed_mms: None }))
        } else if cmd_str.starts_with("PtMeas") {
            let (x, y, z, i, j, k) = Self::parse_xyzi_params(cmd_str)?;
            Ok((tag, IppCommand::PtMeas {
                target: DVec3::new(x, y, z),
                normal: DVec3::new(i, j, k),
            }))
        } else {
            Err(IppError::UnknownCommand(cmd_str.to_string()))
        }
    }

    /// Parantez içindeki parametre metnini çıkarır
    fn extract_inside_parens(s: &str) -> Result<String, IppError> {
        let start = s.find('(').ok_or_else(|| IppError::InvalidSyntax("Açılış parantezi eksik".into()))?;
        let end = s.rfind(')').ok_or_else(|| IppError::InvalidSyntax("Kapanış parantezi eksik".into()))?;
        if start >= end {
            return Err(IppError::InvalidSyntax("Hatalı parantez yapısı".into()));
        }
        Ok(s[start + 1..end].trim().to_string())
    }

    /// `X(...)`, `Y(...)`, `Z(...)` koordinatlarını okur
    fn parse_xyz_params(s: &str) -> Result<(f64, f64, f64), IppError> {
        let extract = |axis: &str| -> Result<f64, IppError> {
            let pattern = format!("{}(", axis);
            let start = s.find(&pattern).ok_or_else(|| IppError::InvalidSyntax(format!("{} parametresi eksik", axis)))?;
            let rest = &s[start + pattern.len()..];
            let end = rest.find(')').ok_or_else(|| IppError::InvalidSyntax(format!("{} kapanışı eksik", axis)))?;
            rest[..end]
                .trim()
                .parse::<f64>()
                .map_err(|_| IppError::InvalidSyntax(format!("{} sayısal değere çevrilemedi", axis)))
        };

        Ok((extract("X")?, extract("Y")?, extract("Z")?))
    }

    /// `X(...)`, `Y(...)`, `Z(...)`, `I(...)`, `J(...)`, `K(...)` parametrelerini okur
    fn parse_xyzi_params(s: &str) -> Result<(f64, f64, f64, f64, f64, f64), IppError> {
        let (x, y, z) = Self::parse_xyz_params(s)?;
        let extract = |axis: &str| -> Result<f64, IppError> {
            let pattern = format!("{}(", axis);
            let start = s.find(&pattern).ok_or_else(|| IppError::InvalidSyntax(format!("{} parametresi eksik", axis)))?;
            let rest = &s[start + pattern.len()..];
            let end = rest.find(')').ok_or_else(|| IppError::InvalidSyntax(format!("{} kapanışı eksik", axis)))?;
            rest[..end]
                .trim()
                .parse::<f64>()
                .map_err(|_| IppError::InvalidSyntax(format!("{} sayısal değere çevrilemedi", axis)))
        };

        Ok((x, y, z, extract("I")?, extract("J")?, extract("K")?))
    }

    /// Yanıtı metin satırına çevirir
    pub fn format_response(resp: &IppResponse) -> String {
        match resp {
            IppResponse::Ack { tag } => format!("{:05} #\r\n", tag),
            IppResponse::Complete { tag } => format!("{:05} %\r\n", tag),
            IppResponse::Data { tag, payload } => format!("{:05} & {}\r\n", tag, payload),
            IppResponse::Error { tag, error_code, message } => {
                format!("{:05} ! Error({}(\"{}\"))\r\n", tag, error_code, message)
            }
        }
    }
}

/// Sertifikalı teftiş rotasını I++ DME komut dizisine dönüştürür
pub fn trajectory_to_ipp_stream(
    trajectory: &CertifiedCollisionFreeTrajectory,
    tool_name: &str,
) -> Vec<String> {
    let mut stream = Vec::new();
    let mut tag = 1;

    // 1. Oturum Başlatma ve Başlangıç El Sıkışması
    stream.push(IppProtocol::format_command(tag, &IppCommand::StartSession));
    tag += 1;
    stream.push(IppProtocol::format_command(tag, &IppCommand::GetDMEVersion));
    tag += 1;
    stream.push(IppProtocol::format_command(tag, &IppCommand::Home));
    tag += 1;
    stream.push(IppProtocol::format_command(
        tag,
        &IppCommand::ChangeTool {
            tool_name: tool_name.to_string(),
        },
    ));
    tag += 1;
    stream.push(IppProtocol::format_command(
        tag,
        &IppCommand::SetCoordSystem {
            name: "PCS".to_string(),
        },
    ));
    tag += 1;

    // 2. Hareket Segmentlerini I++ Formatında Bas
    for seg in &trajectory.segments {
        match seg {
            MotionSegment::RapidLinear { target } => {
                stream.push(IppProtocol::format_command(
                    tag,
                    &IppCommand::GoTo {
                        target: *target,
                        speed_mms: Some(150.0), // 150 mm/s hızlı intikal
                    },
                ));
                tag += 1;
            }
            MotionSegment::TouchApproach { target, normal } => {
                stream.push(IppProtocol::format_command(
                    tag,
                    &IppCommand::PtMeas {
                        target: *target,
                        normal: *normal,
                    },
                ));
                tag += 1;
            }
            MotionSegment::Retract { target } => {
                stream.push(IppProtocol::format_command(
                    tag,
                    &IppCommand::GoTo {
                        target: *target,
                        speed_mms: Some(25.0), // 25 mm/s geri çekilme
                    },
                ));
                tag += 1;
            }
            MotionSegment::RotateHead { a_deg, b_deg } => {
                // I++ kafa rotasyonu takım yönelimi olarak aktarılır
                stream.push(IppProtocol::format_command(
                    tag,
                    &IppCommand::ChangeTool {
                        tool_name: format!("{}_A{:.0}_B{:.0}", tool_name, a_deg, b_deg),
                    },
                ));
                tag += 1;
            }
        }
    }

    // 3. Oturum Kapatma
    stream.push(IppProtocol::format_command(tag, &IppCommand::EndSession));

    stream
}

/// CMM Donanım ve Kontrol Ünitesi Simülatörü (Virtual I++ Controller)
#[derive(Debug, Clone)]
pub struct IppCmmSimulator {
    pub is_session_active: bool,
    pub is_homed: bool,
    pub current_position: DVec3,
    pub current_coord_system: String,
    pub current_tool: String,
    pub measured_points_count: usize,
    pub dme_version: String,
}

impl Default for IppCmmSimulator {
    fn default() -> Self {
        Self::new()
    }
}

impl IppCmmSimulator {
    pub fn new() -> Self {
        Self {
            is_session_active: false,
            is_homed: false,
            current_position: DVec3::ZERO,
            current_coord_system: "MCS".to_string(),
            current_tool: "DEFAULT_STYLUS".to_string(),
            measured_points_count: 0,
            dme_version: "1.7.0".to_string(),
        }
    }

    /// Bir komutu yürütür ve I++ yanıtını üretir
    pub fn execute_command(&mut self, tag: u32, cmd: &IppCommand) -> Vec<IppResponse> {
        let mut responses = Vec::new();

        match cmd {
            IppCommand::StartSession => {
                self.is_session_active = true;
                responses.push(IppResponse::Complete { tag });
            }
            IppCommand::EndSession => {
                self.is_session_active = false;
                responses.push(IppResponse::Complete { tag });
            }
            IppCommand::GetDMEVersion => {
                if !self.is_session_active {
                    responses.push(IppResponse::Error {
                        tag,
                        error_code: "SessionError".into(),
                        message: "Oturum aktif değil".into(),
                    });
                } else {
                    responses.push(IppResponse::Data {
                        tag,
                        payload: format!("DMEVersion(\"{}\")", self.dme_version),
                    });
                    responses.push(IppResponse::Complete { tag });
                }
            }
            IppCommand::Home => {
                if !self.is_session_active {
                    responses.push(IppResponse::Error {
                        tag,
                        error_code: "SessionError".into(),
                        message: "Oturum aktif değil".into(),
                    });
                } else {
                    self.is_homed = true;
                    self.current_position = DVec3::ZERO;
                    responses.push(IppResponse::Complete { tag });
                }
            }
            IppCommand::GetCoordSystem => {
                responses.push(IppResponse::Data {
                    tag,
                    payload: format!("CoordSystem({})", self.current_coord_system),
                });
                responses.push(IppResponse::Complete { tag });
            }
            IppCommand::SetCoordSystem { name } => {
                self.current_coord_system = name.clone();
                responses.push(IppResponse::Complete { tag });
            }
            IppCommand::ChangeTool { tool_name } => {
                self.current_tool = tool_name.clone();
                responses.push(IppResponse::Complete { tag });
            }
            IppCommand::GoTo { target, .. } => {
                if !self.is_session_active || !self.is_homed {
                    responses.push(IppResponse::Error {
                        tag,
                        error_code: "MachineNotReady".into(),
                        message: "CMM Home edilmedi veya oturum kapalı".into(),
                    });
                } else {
                    self.current_position = *target;
                    responses.push(IppResponse::Complete { tag });
                }
            }
            IppCommand::PtMeas { target, normal } => {
                if !self.is_session_active || !self.is_homed {
                    responses.push(IppResponse::Error {
                        tag,
                        error_code: "MachineNotReady".into(),
                        message: "CMM hazır değil".into(),
                    });
                } else {
                    self.current_position = *target;
                    self.measured_points_count += 1;
                    // Dokunma noktası gerçek koordinat telemetrisi
                    responses.push(IppResponse::Data {
                        tag,
                        payload: format!(
                            "PtMeasReport(X({:.4}), Y({:.4}), Z({:.4}), I({:.4}), J({:.4}), K({:.4}))",
                            target.x, target.y, target.z, normal.x, normal.y, normal.z
                        ),
                    });
                    responses.push(IppResponse::Complete { tag });
                }
            }
            IppCommand::AbortE => {
                responses.push(IppResponse::Complete { tag });
            }
        }

        responses
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ClearanceBox;

    #[test]
    fn test_ipp_command_formatting_and_parsing() {
        let cmd = IppCommand::GoTo {
            target: DVec3::new(120.5, 45.2, 100.0),
            speed_mms: None,
        };
        let formatted = IppProtocol::format_command(1, &cmd);
        assert_eq!(formatted, "00001 GoTo(X(120.5000), Y(45.2000), Z(100.0000))");

        let (tag, parsed) = IppProtocol::parse_command(&formatted).unwrap();
        assert_eq!(tag, 1);
        assert_eq!(parsed, cmd);

        // PtMeas testi
        let pt_cmd = IppCommand::PtMeas {
            target: DVec3::new(50.0, 50.0, 30.0),
            normal: DVec3::new(0.0, 0.0, 1.0),
        };
        let formatted_pt = IppProtocol::format_command(2, &pt_cmd);
        assert!(formatted_pt.contains("PtMeas"));

        let (tag_pt, parsed_pt) = IppProtocol::parse_command(&formatted_pt).unwrap();
        assert_eq!(tag_pt, 2);
        assert_eq!(parsed_pt, pt_cmd);
    }

    #[test]
    fn test_ipp_simulator_session_execution() {
        let mut sim = IppCmmSimulator::new();

        // 1. Oturum başlat
        let r1 = sim.execute_command(1, &IppCommand::StartSession);
        assert_eq!(r1, vec![IppResponse::Complete { tag: 1 }]);
        assert!(sim.is_session_active);

        // 2. Home etmeden GoTo yapılırsa hata vermeli
        let r_fail = sim.execute_command(2, &IppCommand::GoTo { target: DVec3::new(10.0, 10.0, 10.0), speed_mms: None });
        assert!(matches!(r_fail[0], IppResponse::Error { .. }));

        // 3. Home et
        let r_home = sim.execute_command(3, &IppCommand::Home);
        assert_eq!(r_home, vec![IppResponse::Complete { tag: 3 }]);
        assert!(sim.is_homed);

        // 4. Nokta ölçümü yap
        let r_meas = sim.execute_command(4, &IppCommand::PtMeas {
            target: DVec3::new(50.0, 50.0, 20.0),
            normal: DVec3::Z,
        });
        assert_eq!(r_meas.len(), 2);
        assert!(matches!(r_meas[0], IppResponse::Data { .. }));
        assert_eq!(sim.measured_points_count, 1);
        assert_eq!(sim.current_position, DVec3::new(50.0, 50.0, 20.0));
    }

    #[test]
    fn test_trajectory_to_ipp_stream_conversion() {
        let clearance = ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
        let segments = vec![
            MotionSegment::RapidLinear { target: DVec3::new(0.0, 0.0, 100.0) },
            MotionSegment::TouchApproach { target: DVec3::new(50.0, 50.0, 50.0), normal: DVec3::Z },
            MotionSegment::Retract { target: DVec3::new(50.0, 50.0, 55.0) },
        ];
        let traj = CertifiedCollisionFreeTrajectory::new(segments, clearance, vec![]);

        let stream = trajectory_to_ipp_stream(&traj, "PH10M_TP20_D2");
        assert!(stream.len() >= 8); // StartSession, GetDMEVersion, Home, ChangeTool, SetCoordSystem, 3 segments, EndSession
        assert!(stream[0].contains("StartSession"));
        assert!(stream.iter().any(|s| s.contains("PtMeas")));
        assert!(stream.last().unwrap().contains("EndSession"));
    }
}
