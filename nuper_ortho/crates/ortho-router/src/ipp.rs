use std::io::{BufRead, BufReader, Write};
use std::net::TcpStream;
use std::time::Duration;
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

    #[error("Oturum başlatılmadı")]
    SessionNotActive,

    #[error("CMM Home pozisyonuna gönderilmedi")]
    NotHomed,

    #[error("Strok limiti aşıldı: {0}")]
    StrokeLimitExceeded(String),

    #[error("I++ DME TCP bağlantı hatası: {0}")]
    ConnectionError(String),

    #[error("I++ DME I/O hatası: {0}")]
    IoError(String),

    #[error("I++ DME zaman aşımı: {0}")]
    Timeout(String),

    #[error("Beklenmeyen prob teması: Tag {tag}, {message}")]
    UnexpectedContactError { tag: u32, message: String },

    #[error("I++ DME komutu reddedildi: Tag {tag}, {error_code}: {message}")]
    CommandRejected {
        tag: u32,
        error_code: String,
        message: String,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum IppCommand {
    StartSession,
    EndSession,
    GetDMEVersion,
    GetCoordSystem,
    SetCoordSystem { name: String },
    Home,
    GoTo { target: DVec3, speed_mms: Option<f64> },
    PtMeas { target: DVec3, normal: DVec3 },
    ChangeTool { tool_name: String },
    AbortE,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum IppResponse {
    Ack { tag: u32 },
    Complete { tag: u32 },
    Data { tag: u32, payload: String },
    Error {
        tag: u32,
        error_code: String,
        message: String,
    },
}

pub struct IppProtocol;

impl IppProtocol {
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

    pub fn parse_response(line: &str) -> Result<IppResponse, IppError> {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            return Err(IppError::InvalidSyntax("Boş satır".to_string()));
        }

        let parts: Vec<&str> = trimmed.splitn(3, ' ').collect();
        if parts.is_empty() {
            return Err(IppError::InvalidSyntax("Boş satır".to_string()));
        }

        let tag = parts[0]
            .parse::<u32>()
            .map_err(|_| IppError::InvalidSyntax(format!("Geçersiz etiket: {}", parts[0])))?;

        if parts.len() < 2 {
            return Err(IppError::InvalidSyntax("Yanıt tipi eksik".to_string()));
        }

        let op = parts[1];
        match op {
            "#" => Ok(IppResponse::Ack { tag }),
            "%" => Ok(IppResponse::Complete { tag }),
            "&" => {
                let payload = if parts.len() > 2 { parts[2] } else { "" };
                Ok(IppResponse::Data {
                    tag,
                    payload: payload.to_string(),
                })
            }
            "!" => {
                let err_payload = if parts.len() > 2 { parts[2] } else { "" };
                let (code, msg) = Self::parse_error_payload(err_payload);
                Ok(IppResponse::Error {
                    tag,
                    error_code: code,
                    message: msg,
                })
            }
            _ => Err(IppError::InvalidSyntax(format!("Bilinmeyen yanıt sembolü: {}", op))),
        }
    }

    fn parse_error_payload(payload: &str) -> (String, String) {
        let trimmed = payload.trim();
        if let Some(inner) = trimmed.strip_prefix("Error(").and_then(|s| s.strip_suffix(')')) {
            if let Some(paren_pos) = inner.find('(') {
                let code = inner[..paren_pos].trim().to_string();
                let msg = inner[paren_pos + 1..]
                    .trim_end_matches(')')
                    .trim_matches('"')
                    .to_string();
                return (code, msg);
            }
            return (inner.to_string(), inner.to_string());
        }
        ("UnknownError".to_string(), trimmed.to_string())
    }

    fn extract_inside_parens(s: &str) -> Result<String, IppError> {
        let start = s.find('(').ok_or_else(|| IppError::InvalidSyntax("Açılış parantezi eksik".into()))?;
        let end = s.rfind(')').ok_or_else(|| IppError::InvalidSyntax("Kapanış parantezi eksik".into()))?;
        if start >= end {
            return Err(IppError::InvalidSyntax("Hatalı parantez yapısı".into()));
        }
        Ok(s[start + 1..end].trim().to_string())
    }

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

pub fn trajectory_to_ipp_stream(
    trajectory: &CertifiedCollisionFreeTrajectory,
    tool_name: &str,
) -> Vec<String> {
    let mut stream = Vec::new();
    let mut tag = 1;

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

    for seg in &trajectory.segments {
        match seg {
            MotionSegment::RapidLinear { target } => {
                stream.push(IppProtocol::format_command(
                    tag,
                    &IppCommand::GoTo {
                        target: *target,
                        speed_mms: Some(150.0),
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
                        speed_mms: Some(25.0),
                    },
                ));
                tag += 1;
            }
            MotionSegment::RotateHead { a_deg, b_deg } => {
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

    stream.push(IppProtocol::format_command(tag, &IppCommand::EndSession));

    stream
}

#[derive(Debug, Clone)]
pub struct IppCmmSimulator {
    pub is_session_active: bool,
    pub is_homed: bool,
    pub current_position: DVec3,
    pub current_coord_system: String,
    pub current_tool: String,
    pub measured_points_count: usize,
    pub dme_version: String,
    pub simulate_unexpected_contact: bool,
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
            simulate_unexpected_contact: false,
        }
    }

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
                } else if self.simulate_unexpected_contact {
                    responses.push(IppResponse::Error {
                        tag,
                        error_code: "UnexpectedContactError".into(),
                        message: "Beklenmeyen temas algılandı".into(),
                    });
                } else {
                    self.current_position = *target;
                    self.measured_points_count += 1;
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

pub struct IppClient {
    stream: Option<TcpStream>,
    tag_counter: u32,
    pub is_session_active: bool,
    pub is_homed: bool,
    pub active_coord_system: String,
    pub last_known_position: DVec3,
}

impl Default for IppClient {
    fn default() -> Self {
        Self::new()
    }
}

impl IppClient {
    pub fn new() -> Self {
        Self {
            stream: None,
            tag_counter: 0,
            is_session_active: false,
            is_homed: false,
            active_coord_system: "MCS".to_string(),
            last_known_position: DVec3::ZERO,
        }
    }

    pub fn connect(&mut self, addr: &str, timeout_ms: u64) -> Result<(), IppError> {
        let stream = match addr.parse() {
            Ok(socket_addr) => TcpStream::connect_timeout(&socket_addr, Duration::from_millis(timeout_ms))
                .map_err(|e| IppError::ConnectionError(e.to_string()))?,
            Err(_) => TcpStream::connect(addr).map_err(|e| IppError::ConnectionError(e.to_string()))?,
        };

        let dur = Duration::from_millis(timeout_ms);
        stream
            .set_read_timeout(Some(dur))
            .map_err(|e| IppError::IoError(e.to_string()))?;
        stream
            .set_write_timeout(Some(dur))
            .map_err(|e| IppError::IoError(e.to_string()))?;

        self.stream = Some(stream);
        Ok(())
    }

    pub fn disconnect(&mut self) -> Result<(), IppError> {
        if self.is_session_active {
            let _ = self.send_command(&IppCommand::EndSession);
            self.is_session_active = false;
        }
        self.stream = None;
        Ok(())
    }

    pub fn send_command(&mut self, cmd: &IppCommand) -> Result<(u32, Vec<IppResponse>), IppError> {
        let stream = self
            .stream
            .as_mut()
            .ok_or_else(|| IppError::ConnectionError("Bağlantı açık değil".to_string()))?;

        self.tag_counter += 1;
        let tag = self.tag_counter;
        let formatted = IppProtocol::format_command(tag, cmd);
        let wire = format!("{}\r\n", formatted);

        stream
            .write_all(wire.as_bytes())
            .map_err(|e| IppError::IoError(e.to_string()))?;
        stream.flush().map_err(|e| IppError::IoError(e.to_string()))?;

        let mut reader = BufReader::new(stream.try_clone().map_err(|e| IppError::IoError(e.to_string()))?);
        let mut responses = Vec::new();
        let mut line_buf = String::new();

        loop {
            line_buf.clear();
            let bytes_read = reader
                .read_line(&mut line_buf)
                .map_err(|e| IppError::Timeout(e.to_string()))?;
            if bytes_read == 0 {
                return Err(IppError::ConnectionError("Sunucu bağlantıyı kapattı".to_string()));
            }

            let resp = IppProtocol::parse_response(&line_buf)?;
            let is_terminal = match &resp {
                IppResponse::Complete { tag: resp_tag } if *resp_tag == tag => true,
                IppResponse::Error { tag: resp_tag, error_code, message } if *resp_tag == tag => {
                    if error_code.contains("UnexpectedContact") {
                        return Err(IppError::UnexpectedContactError {
                            tag,
                            message: message.clone(),
                        });
                    }
                    return Err(IppError::CommandRejected {
                        tag,
                        error_code: error_code.clone(),
                        message: message.clone(),
                    });
                }
                _ => false,
            };

            responses.push(resp);
            if is_terminal {
                break;
            }
        }

        match cmd {
            IppCommand::StartSession => self.is_session_active = true,
            IppCommand::EndSession => self.is_session_active = false,
            IppCommand::Home => self.is_homed = true,
            IppCommand::SetCoordSystem { name } => self.active_coord_system = name.clone(),
            IppCommand::GoTo { target, .. } => self.last_known_position = *target,
            _ => {}
        }

        Ok((tag, responses))
    }

    pub fn perform_handshake(&mut self, coord_system: &str) -> Result<String, IppError> {
        self.send_command(&IppCommand::StartSession)?;
        let (_, ver_resps) = self.send_command(&IppCommand::GetDMEVersion)?;
        let mut version = "UNKNOWN".to_string();
        for r in ver_resps {
            if let IppResponse::Data { payload, .. } = r {
                if let Some(inner) = payload.strip_prefix("DMEVersion(\"").and_then(|s| s.strip_suffix("\")")) {
                    version = inner.to_string();
                }
            }
        }

        self.send_command(&IppCommand::Home)?;
        self.send_command(&IppCommand::SetCoordSystem {
            name: coord_system.to_string(),
        })?;

        Ok(version)
    }

    pub fn measure_point(&mut self, target: DVec3, normal: DVec3) -> Result<DVec3, IppError> {
        let res = self.send_command(&IppCommand::PtMeas { target, normal });
        match res {
            Ok((_, responses)) => {
                self.last_known_position = target;
                for resp in responses {
                    if let IppResponse::Data { payload, .. } = resp {
                        if payload.starts_with("PtMeasReport") {
                            let (x, y, z) = IppProtocol::parse_xyz_params(&payload)?;
                            return Ok(DVec3::new(x, y, z));
                        }
                    }
                }
                Ok(target)
            }
            Err(IppError::UnexpectedContactError { tag, message }) => {
                self.last_known_position = target;
                let _ = self.recover_unexpected_contact(normal);
                Err(IppError::UnexpectedContactError { tag, message })
            }
            Err(e) => Err(e),
        }
    }

    pub fn recover_unexpected_contact(&mut self, surface_normal: DVec3) -> Result<DVec3, IppError> {
        let _ = self.send_command(&IppCommand::AbortE);
        let safe_retract_vector = if surface_normal.length_squared() > 1e-6 {
            surface_normal.normalize() * 10.0
        } else {
            DVec3::new(0.0, 0.0, 10.0)
        };
        let retract_target = self.last_known_position + safe_retract_vector;
        let _ = self.send_command(&IppCommand::GoTo {
            target: retract_target,
            speed_mms: Some(20.0),
        });
        self.last_known_position = retract_target;
        Ok(retract_target)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ClearanceBox;
    use std::net::TcpListener;
    use std::thread;

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

        let r1 = sim.execute_command(1, &IppCommand::StartSession);
        assert_eq!(r1, vec![IppResponse::Complete { tag: 1 }]);
        assert!(sim.is_session_active);

        let r_fail = sim.execute_command(2, &IppCommand::GoTo { target: DVec3::new(10.0, 10.0, 10.0), speed_mms: None });
        assert!(matches!(r_fail[0], IppResponse::Error { .. }));

        let r_home = sim.execute_command(3, &IppCommand::Home);
        assert_eq!(r_home, vec![IppResponse::Complete { tag: 3 }]);
        assert!(sim.is_homed);

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
        assert!(stream.len() >= 8);
        assert!(stream[0].contains("StartSession"));
        assert!(stream.iter().any(|s| s.contains("PtMeas")));
        assert!(stream.last().unwrap().contains("EndSession"));
    }

    #[test]
    fn test_ipp_client_tcp_handshake_and_12_points_measurement() {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let addr = listener.local_addr().unwrap();

        let server_handle = thread::spawn(move || {
            let (mut stream, _) = listener.accept().unwrap();
            let mut sim = IppCmmSimulator::new();
            let reader_stream = stream.try_clone().unwrap();
            let mut reader = BufReader::new(reader_stream);
            let mut line = String::new();

            loop {
                line.clear();
                if reader.read_line(&mut line).unwrap_or(0) == 0 {
                    break;
                }
                if let Ok((tag, cmd)) = IppProtocol::parse_command(&line) {
                    let is_end = cmd == IppCommand::EndSession;
                    let responses = sim.execute_command(tag, &cmd);
                    for resp in responses {
                        let wire = IppProtocol::format_response(&resp);
                        let _ = stream.write_all(wire.as_bytes());
                    }
                    let _ = stream.flush();
                    if is_end {
                        break;
                    }
                }
            }
        });

        let mut client = IppClient::new();
        client.connect(&addr.to_string(), 2000).unwrap();

        let ver = client.perform_handshake("PCS").unwrap();
        assert_eq!(ver, "1.7.0");
        assert!(client.is_session_active);
        assert!(client.is_homed);
        assert_eq!(client.active_coord_system, "PCS");

        for i in 0..12 {
            let target = DVec3::new(10.0 * (i as f64 + 1.0), 25.0, 15.0);
            let normal = DVec3::new(0.0, 0.0, 1.0);
            let measured = client.measure_point(target, normal).unwrap();
            assert!((measured.x - target.x).abs() < 1e-3);
            assert!((measured.y - target.y).abs() < 1e-3);
            assert!((measured.z - target.z).abs() < 1e-3);
        }

        client.disconnect().unwrap();
        server_handle.join().unwrap();
    }

    #[test]
    fn test_ipp_unexpected_contact_recovery() {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let addr = listener.local_addr().unwrap();

        let server_handle = thread::spawn(move || {
            let (mut stream, _) = listener.accept().unwrap();
            let mut sim = IppCmmSimulator::new();
            let reader_stream = stream.try_clone().unwrap();
            let mut reader = BufReader::new(reader_stream);
            let mut line = String::new();

            loop {
                line.clear();
                if reader.read_line(&mut line).unwrap_or(0) == 0 {
                    break;
                }
                if let Ok((tag, cmd)) = IppProtocol::parse_command(&line) {
                    if matches!(cmd, IppCommand::PtMeas { .. }) {
                        sim.simulate_unexpected_contact = true;
                    }
                    let responses = sim.execute_command(tag, &cmd);
                    for resp in responses {
                        let wire = IppProtocol::format_response(&resp);
                        let _ = stream.write_all(wire.as_bytes());
                    }
                    let _ = stream.flush();
                    if cmd == IppCommand::EndSession {
                        break;
                    }
                }
            }
        });

        let mut client = IppClient::new();
        client.connect(&addr.to_string(), 2000).unwrap();
        client.perform_handshake("PCS").unwrap();

        let target = DVec3::new(50.0, 50.0, 10.0);
        let normal = DVec3::new(0.0, 0.0, 1.0);
        let res = client.measure_point(target, normal);

        assert!(matches!(res, Err(IppError::UnexpectedContactError { .. })));
        assert!(client.last_known_position.z > 10.0);

        client.disconnect().unwrap();
        server_handle.join().unwrap();
    }
}
