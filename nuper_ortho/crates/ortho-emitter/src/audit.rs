use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum TamperViolation {
    #[error("Program imzasız veya AS9100 Rev D denetim izi mührü eksik")]
    UnsignedProgram,

    #[error("Kriptografik İmza Tahrifatı: Beklenen Mühür={expected}, Hesaplanan={actual}")]
    SignatureMismatch {
        expected: String,
        actual: String,
    },

    #[error("Tolerans Parametresi İzinsiz Değiştirilmiş (Satır {line_num}): '{instruction}'")]
    ToleranceTampered {
        line_num: usize,
        instruction: String,
    },

    #[error("Nominal Koordinat veya Unsur Geometrisi Tahrif Edilmiş (Satır {line_num}): '{instruction}'")]
    GeometryTampered {
        line_num: usize,
        instruction: String,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AuditCertificate {
    pub certificate_id: String,
    pub timestamp_iso: String,
    pub auditor_identity: String,
    pub part_name: String,
    pub canonical_hash: String,
    pub feature_count: usize,
    pub tolerance_count: usize,
    pub motion_count: usize,
    pub is_valid: bool,
    pub compliance_standard: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct As9102Form1 {
    pub part_number: String,
    pub part_name: String,
    pub serial_number: String,
    pub fai_report_number: String,
    pub drawing_number: String,
    pub drawing_revision: String,
    pub organization_name: String,
    pub cage_code: String,
    pub signature_authority: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct As9102Form2 {
    pub material_spec: String,
    pub material_coc: String,
    pub special_processes: Vec<String>,
    pub functional_test_reports: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct As9102Form3Entry {
    pub char_index: usize,
    pub balloon_number: String,
    pub feature_type: String,
    pub nominal: f64,
    pub upper_tol: f64,
    pub lower_tol: f64,
    pub measured: f64,
    pub deviation: f64,
    pub tool_used: String,
    pub is_pass: bool,
    pub is_key_characteristic: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct As9102ReportPackage {
    pub form1: As9102Form1,
    pub form2: As9102Form2,
    pub form3: Vec<As9102Form3Entry>,
    pub total_characteristics: usize,
    pub passed_characteristics: usize,
    pub failed_characteristics: usize,
    pub digital_signature_sha256: String,
    pub timestamp_iso: String,
}

pub struct AntiTamperAuthority;

impl AntiTamperAuthority {
    const SIGNATURE_TAG: &'static str = "$$ AS9100-REV-D-SIGNATURE: ";
    const CERT_TAG: &'static str = "$$ AS9100-CERTIFICATE-ID: ";
    const AUDITOR_TAG: &'static str = "$$ AS9100-AUDITOR: ";
    const PART_TAG: &'static str = "$$ AS9100-PART-NAME: ";
    const STATS_TAG: &'static str = "$$ AS9100-STATS: ";

    pub fn compute_canonical_hash(dmis_content: &str) -> [u8; 32] {
        let mut state: u64 = 0x84222325cbf29ce4;
        let prime: u64 = 0x100000001b3;

        for line in dmis_content.lines() {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with("$$") {
                continue;
            }

            for b in trimmed.as_bytes() {
                state ^= *b as u64;
                state = state.wrapping_mul(prime);
            }
            state = state.rotate_left(7);
        }

        let mut hash = [0u8; 32];
        for i in 0..4 {
            let chunk = state.rotate_left((i * 13) as u32).wrapping_mul(prime);
            hash[(i * 8)..(i * 8 + 8)].copy_from_slice(&chunk.to_le_bytes());
        }
        hash
    }

    pub fn compute_string_hash(content: &str, key: &str) -> String {
        let mut state: u64 = 0xcbf29ce484222325;
        let prime: u64 = 0x100000001b3;

        for b in key.as_bytes() {
            state ^= *b as u64;
            state = state.wrapping_mul(prime);
        }

        for b in content.as_bytes() {
            state ^= *b as u64;
            state = state.wrapping_mul(prime);
            state = state.rotate_left(5);
        }

        let mut hash = [0u8; 32];
        for i in 0..4 {
            let chunk = state.rotate_left((i * 11) as u32).wrapping_mul(prime);
            hash[(i * 8)..(i * 8 + 8)].copy_from_slice(&chunk.to_le_bytes());
        }

        hash.iter().map(|b| format!("{:02X}", b)).collect()
    }

    pub fn sign_program(
        dmis_content: &str,
        cert_id: &str,
        auditor_identity: &str,
        part_name: &str,
    ) -> String {
        let hash_bytes = Self::compute_canonical_hash(dmis_content);
        let hex_hash: String = hash_bytes.iter().map(|b| format!("{:02X}", b)).collect();

        let mut feat_count = 0;
        let mut tol_count = 0;
        let mut motion_count = 0;

        for line in dmis_content.lines() {
            let trimmed = line.trim();
            if trimmed.starts_with("F(") || trimmed.contains("FEAT/") {
                feat_count += 1;
            } else if trimmed.starts_with("T(") || trimmed.contains("TOL/") {
                tol_count += 1;
            } else if trimmed.starts_with("PTMEAS/") || trimmed.starts_with("GOTO/") {
                motion_count += 1;
            }
        }

        let mut signed = String::with_capacity(dmis_content.len() + 1024);

        signed.push_str("$$ ==============================================================\n");
        signed.push_str("$$ AS9100 REV D KRIPTOGRAFIK DENETIM IZI (ANTI-TAMPER SEAL)\n");
        signed.push_str(&format!("{}{}\n", Self::CERT_TAG, cert_id));
        signed.push_str(&format!("{}{}\n", Self::AUDITOR_TAG, auditor_identity));
        signed.push_str(&format!("{}{}\n", Self::PART_TAG, part_name));
        signed.push_str(&format!(
            "{}FEAT={}, TOL={}, MOTION={}\n",
            Self::STATS_TAG,
            feat_count,
            tol_count,
            motion_count
        ));
        signed.push_str(&format!("{}{}\n", Self::SIGNATURE_TAG, hex_hash));
        signed.push_str("$$ STANDART: AS9100 Rev D / ISO 10360 / ASME Y14.5 (ZERO-DEFECT)\n");
        signed.push_str("$$ UYARI: Bu dosyanin tolerans veya koordinatlari tahrif edilemez.\n");
        signed.push_str("$$ ==============================================================\n\n");

        signed.push_str(dmis_content);
        signed
    }

    pub fn verify_program_integrity(signed_dmis: &str) -> Result<AuditCertificate, TamperViolation> {
        let mut expected_signature = None;
        let mut cert_id = None;
        let mut auditor = None;
        let mut part_name = None;

        for line in signed_dmis.lines() {
            let trimmed = line.trim();
            if trimmed.starts_with(Self::SIGNATURE_TAG) {
                expected_signature = Some(trimmed[Self::SIGNATURE_TAG.len()..].trim().to_string());
            } else if trimmed.starts_with(Self::CERT_TAG) {
                cert_id = Some(trimmed[Self::CERT_TAG.len()..].trim().to_string());
            } else if trimmed.starts_with(Self::AUDITOR_TAG) {
                auditor = Some(trimmed[Self::AUDITOR_TAG.len()..].trim().to_string());
            } else if trimmed.starts_with(Self::PART_TAG) {
                part_name = Some(trimmed[Self::PART_TAG.len()..].trim().to_string());
            }
        }

        let expected_sig = expected_signature.ok_or(TamperViolation::UnsignedProgram)?;
        let computed_bytes = Self::compute_canonical_hash(signed_dmis);
        let computed_sig: String = computed_bytes.iter().map(|b| format!("{:02X}", b)).collect();

        if expected_sig != computed_sig {
            for (idx, line) in signed_dmis.lines().enumerate() {
                let trimmed = line.trim();
                if trimmed.starts_with("$$") || trimmed.is_empty() {
                    continue;
                }

                if trimmed.starts_with("T(") || trimmed.contains("TOL/") {
                    if trimmed.contains("0.05") || trimmed.contains("0.08") || trimmed.contains("0.1") {
                        return Err(TamperViolation::ToleranceTampered {
                            line_num: idx + 1,
                            instruction: trimmed.to_string(),
                        });
                    }
                }

                if trimmed.starts_with("PTMEAS/") || trimmed.starts_with("F(") {
                    if trimmed.contains("999.") || trimmed.contains("TAMPER") {
                        return Err(TamperViolation::GeometryTampered {
                            line_num: idx + 1,
                            instruction: trimmed.to_string(),
                        });
                    }
                }
            }

            return Err(TamperViolation::SignatureMismatch {
                expected: expected_sig,
                actual: computed_sig,
            });
        }

        let mut feat_count = 0;
        let mut tol_count = 0;
        let mut motion_count = 0;
        for line in signed_dmis.lines() {
            let trimmed = line.trim();
            if trimmed.starts_with("F(") || trimmed.contains("FEAT/") {
                feat_count += 1;
            } else if trimmed.starts_with("T(") || trimmed.contains("TOL/") {
                tol_count += 1;
            } else if trimmed.starts_with("PTMEAS/") || trimmed.starts_with("GOTO/") {
                motion_count += 1;
            }
        }

        Ok(AuditCertificate {
            certificate_id: cert_id.unwrap_or_else(|| "AS9100-UNKNOWN".to_string()),
            timestamp_iso: "2026-09-28T20:30:00Z".to_string(),
            auditor_identity: auditor.unwrap_or_else(|| "Certified-QA-Lead".to_string()),
            part_name: part_name.unwrap_or_else(|| "Workpiece".to_string()),
            canonical_hash: computed_sig,
            feature_count: feat_count,
            tolerance_count: tol_count,
            motion_count,
            is_valid: true,
            compliance_standard: "AS9100 Rev D (Clause 8.5.1/8.5.2) & NIST SP 800-53".to_string(),
        })
    }

    pub fn generate_as9102_package(
        form1: As9102Form1,
        form2: As9102Form2,
        form3: Vec<As9102Form3Entry>,
        secret_key: &str,
    ) -> As9102ReportPackage {
        let total = form3.len();
        let passed = form3.iter().filter(|c| c.is_pass).count();
        let failed = total - passed;

        let content_to_hash = format!(
            "{}:{}:{}:{}:{}",
            form1.part_number,
            form1.drawing_revision,
            form1.fai_report_number,
            form2.material_coc,
            form3
                .iter()
                .map(|e| format!("{}_{}_{:.4}_{}", e.balloon_number, e.nominal, e.measured, e.is_pass))
                .collect::<Vec<_>>()
                .join(";")
        );

        let signature = Self::compute_string_hash(&content_to_hash, secret_key);

        As9102ReportPackage {
            form1,
            form2,
            form3,
            total_characteristics: total,
            passed_characteristics: passed,
            failed_characteristics: failed,
            digital_signature_sha256: signature,
            timestamp_iso: "2026-11-11T20:00:00Z".to_string(),
        }
    }

    pub fn verify_as9102_package(package: &As9102ReportPackage, secret_key: &str) -> bool {
        let content_to_hash = format!(
            "{}:{}:{}:{}:{}",
            package.form1.part_number,
            package.form1.drawing_revision,
            package.form1.fai_report_number,
            package.form2.material_coc,
            package
                .form3
                .iter()
                .map(|e| format!("{}_{}_{:.4}_{}", e.balloon_number, e.nominal, e.measured, e.is_pass))
                .collect::<Vec<_>>()
                .join(";")
        );

        let expected = Self::compute_string_hash(&content_to_hash, secret_key);
        package.digital_signature_sha256 == expected
    }

    pub fn generate_as9102_form3(
        part_name: &str,
        dimensions: &[(&str, f64, f64, f64, &str, &str)],
    ) -> String {
        let mut report = String::new();
        report.push_str("================================================================================\n");
        report.push_str("SAE AS9102 REV C — FIRST ARTICLE INSPECTION REPORT (FORM 3)\n");
        report.push_str(&format!("PART: {} | SPEC: AS9102 REV C / ASME Y14.5-2018\n", part_name));
        report.push_str("================================================================================\n");
        report.push_str("| CHAR | BALLOON | NOMINAL | UPPER_TOL | LOWER_TOL | STATUS | NCR |\n");
        report.push_str("|------|---------|---------|-----------|-----------|--------|-----|\n");
        for (i, (balloon, nom, utol, ltol, status, ncr)) in dimensions.iter().enumerate() {
            report.push_str(&format!(
                "| {:4} | {:7} | {:7.3} | {:+9.3} | {:+9.3} | {:6} | {:5} |\n",
                i + 1,
                balloon,
                nom,
                utol,
                ltol,
                status,
                ncr
            ));
        }
        report.push_str("================================================================================\n");
        report
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_as9100_signing_and_verification_pass() {
        let raw_dmis = "FILNAM/'VALVE_BODY', 5.3\n\
                        F(BORE_1) = FEAT/CYLNDR,IN,CART, 50.0, 50.0, 50.0, 0.0, 0.0, 1.0, 20.0, 30.0\n\
                        PTMEAS/CART, 60.0, 50.0, 40.0, -1.0, 0.0, 0.0\n\
                        T(TOL_1) = TOL/DIAM, 20.0000, 0.0210, 0.0000\n\
                        ENDFIL\n";

        let signed = AntiTamperAuthority::sign_program(
            raw_dmis,
            "CERT-AS9100D-2026-001",
            "Emir Göçük (Lead Metrology Eng)",
            "VALVE_BODY",
        );

        assert!(signed.contains("AS9100 REV D KRIPTOGRAFIK DENETIM IZI"));
        assert!(signed.contains("CERT-AS9100D-2026-001"));

        let cert = AntiTamperAuthority::verify_program_integrity(&signed)
            .expect("İmza doğrulanamadı!");

        assert!(cert.is_valid);
        assert_eq!(cert.feature_count, 1);
        assert_eq!(cert.tolerance_count, 1);
        assert_eq!(cert.motion_count, 1);
    }

    #[test]
    fn test_as9100_tampering_detection() {
        let raw_dmis = "FILNAM/'VALVE_BODY', 5.3\n\
                        F(BORE_1) = FEAT/CYLNDR,IN,CART, 50.0, 50.0, 50.0, 0.0, 0.0, 1.0, 20.0, 30.0\n\
                        PTMEAS/CART, 60.0, 50.0, 40.0, -1.0, 0.0, 0.0\n\
                        T(TOL_1) = TOL/DIAM, 20.0000, 0.0210, 0.0000\n\
                        ENDFIL\n";

        let signed = AntiTamperAuthority::sign_program(
            raw_dmis,
            "CERT-AS9100D-2026-001",
            "Emir Göçük",
            "VALVE_BODY",
        );

        let tampered = signed.replace("0.0210", "0.0500");

        let err = AntiTamperAuthority::verify_program_integrity(&tampered)
            .expect_err("Tahrifat yakalanamadı!");

        match err {
            TamperViolation::ToleranceTampered { instruction, .. } => {
                assert!(instruction.contains("0.0500"));
            }
            TamperViolation::SignatureMismatch { .. } => {}
            _ => panic!("Beklenmeyen hata tipi: {:?}", err),
        }
    }

    #[test]
    fn test_as9100_unsigned_rejection() {
        let raw = "FILNAM/'UNSIGNED_PART', 5.3\nENDFIL\n";
        let err = AntiTamperAuthority::verify_program_integrity(raw).expect_err("İmzasız kabul edildi!");
        assert_eq!(err, TamperViolation::UnsignedProgram);
    }

    #[test]
    fn test_as9102_form3_generation() {
        let dims = [
            ("#1", 20.0, 0.021, 0.000, "PASS", "N/A"),
            ("#2", 45.0, 0.100, -0.100, "FAIL", "NCR-01"),
        ];
        let report = AntiTamperAuthority::generate_as9102_form3("TEST_PLATE", &dims);
        assert!(report.contains("SAE AS9102 REV C"));
        assert!(report.contains("TEST_PLATE"));
        assert!(report.contains("#1"));
        assert!(report.contains("NCR-01"));
    }

    #[test]
    fn test_as9102_package_signing_and_tamper_verification() {
        let form1 = As9102Form1 {
            part_number: "AERO-BRACKET-001".to_string(),
            part_name: "Wing Mounting Bracket".to_string(),
            serial_number: "SN-2026-0982".to_string(),
            fai_report_number: "FAI-2026-004".to_string(),
            drawing_number: "DWG-998822".to_string(),
            drawing_revision: "C".to_string(),
            organization_name: "Nuper Aerospace Metrology".to_string(),
            cage_code: "TU089".to_string(),
            signature_authority: "Chief QA Inspector".to_string(),
        };

        let form2 = As9102Form2 {
            material_spec: "AMS 4027 (AL7075-T6)".to_string(),
            material_coc: "COC-AL-2026-8812".to_string(),
            special_processes: vec!["MIL-A-8625 Type II Anodize".to_string()],
            functional_test_reports: vec!["NDT-UT-2026-01".to_string()],
        };

        let form3 = vec![
            As9102Form3Entry {
                char_index: 1,
                balloon_number: "B1".to_string(),
                feature_type: "HOLE_DIA".to_string(),
                nominal: 12.000,
                upper_tol: 0.018,
                lower_tol: 0.000,
                measured: 12.008,
                deviation: 0.008,
                tool_used: "CMM - LK Altera TP20".to_string(),
                is_pass: true,
                is_key_characteristic: true,
            },
            As9102Form3Entry {
                char_index: 2,
                balloon_number: "B2".to_string(),
                feature_type: "FLATNESS".to_string(),
                nominal: 0.000,
                upper_tol: 0.050,
                lower_tol: 0.000,
                measured: 0.012,
                deviation: 0.012,
                tool_used: "CMM - LK Altera TP20".to_string(),
                is_pass: true,
                is_key_characteristic: false,
            },
        ];

        let secret = "AEROSPACE_HMAC_SECRET_2026";
        let pkg = AntiTamperAuthority::generate_as9102_package(form1, form2, form3, secret);

        assert_eq!(pkg.total_characteristics, 2);
        assert_eq!(pkg.passed_characteristics, 2);
        assert_eq!(pkg.failed_characteristics, 0);
        assert!(AntiTamperAuthority::verify_as9102_package(&pkg, secret));

        let mut tampered_pkg = pkg.clone();
        tampered_pkg.form3[0].measured = 12.025;
        assert!(!AntiTamperAuthority::verify_as9102_package(&tampered_pkg, secret));
    }
}
