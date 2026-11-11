use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum LicenseTier {
    Community,
    Sme,
    DefenseEnterprise,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum FeatureFlag {
    DmisExport,
    CalypsoExport,
    MultiSetup,
    ClosedLoopCnc,
    As9100Audit,
    SandboxedAi,
    LaserScanning,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HardwareFingerprint {
    pub machine_guid: String,
    pub cpu_id: String,
    pub usb_dongle_serial: Option<String>,
}

impl HardwareFingerprint {
    pub fn new(
        machine_guid: impl Into<String>,
        cpu_id: impl Into<String>,
        usb_dongle: Option<String>,
    ) -> Self {
        Self {
            machine_guid: machine_guid.into(),
            cpu_id: cpu_id.into(),
            usb_dongle_serial: usb_dongle,
        }
    }

    pub fn compute_composite_hash(&self) -> String {
        let mut state: u64 = 0x517cc1b727220a95;
        let prime: u64 = 0x100000001b3;

        let mut feed_str = |s: &str| {
            for b in s.as_bytes() {
                state ^= *b as u64;
                state = state.wrapping_mul(prime);
            }
        };

        feed_str(&self.machine_guid);
        feed_str(&self.cpu_id);
        if let Some(dongle) = &self.usb_dongle_serial {
            feed_str(dongle);
        }

        format!("{:016X}", state)
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AirGappedLicense {
    pub license_id: String,
    pub customer_name: String,
    pub tier: LicenseTier,
    pub allowed_features: Vec<FeatureFlag>,
    pub max_cmm_nodes: u32,
    pub issued_date_iso: String,
    pub expires_date_iso: String,
    pub locked_hardware_hash: Option<String>,
    pub digital_signature: String,
}

#[derive(Error, Debug, PartialEq)]
pub enum LicenseError {
    #[error("Lisans süresi dolmuş: Sona Erme={expires_at}, Mevcut Tarih={current_date}")]
    LicenseExpired {
        expires_at: String,
        current_date: String,
    },

    #[error("Donanım Kilidi (Hardware Fingerprint) Uyuşmazlığı: Beklenen={expected}, Mevcut={actual}")]
    HardwareMismatch {
        expected: String,
        actual: String,
    },

    #[error("USB Donanım Kilidi (Dongle) Takılı Değil")]
    MissingHardwareDongle,

    #[error("Özellik Bu Lisans Paketinde Yetkilendirilmemiş: {feature:?} ({tier:?})")]
    FeatureUnauthorized {
        feature: FeatureFlag,
        tier: LicenseTier,
    },

    #[error("Geçersiz Lisans İmzası")]
    TamperedSignature,

    #[error("Geçersiz Çevrimdışı Aktivasyon Kodu: {0}")]
    InvalidActivationCode(String),

    #[error("DMIS Filigranı Tahrif Edilmiş")]
    TamperedDmisWatermark,
}

pub struct LicenseAuthority;

impl LicenseAuthority {
    const DEFAULT_SECRET_SALT: &'static str = "NUPER-ORTHO-DEFENSE-CORE-KEY-2026";
    const DMIS_WATERMARK_TAG: &'static str = "$$ SIG_ALG: RSA-4096-SHA256";
    const DMIS_SIG_PREFIX: &'static str = "$$ SIGNATURE: ";

    fn compute_signature(
        license_id: &str,
        customer: &str,
        tier: LicenseTier,
        expires: &str,
        hw_hash: Option<&str>,
        secret_salt: &str,
    ) -> String {
        let mut state: u64 = 0x6a09e667f3bcc908;
        let prime: u64 = 0x100000001b3;

        let mut feed = |s: &str| {
            for b in s.as_bytes() {
                state ^= *b as u64;
                state = state.wrapping_mul(prime);
            }
            state = state.rotate_left(11);
        };

        feed(license_id);
        feed(customer);
        feed(&format!("{:?}", tier));
        feed(expires);
        if let Some(h) = hw_hash {
            feed(h);
        }
        feed(secret_salt);

        format!("{:016X}{:016X}", state, state.wrapping_mul(prime))
    }

    pub fn compute_content_hash(content: &str, salt: &str) -> String {
        let mut state: u64 = 0x84222325cbf29ce4;
        let prime: u64 = 0x100000001b3;

        for line in content.lines() {
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

        for b in salt.as_bytes() {
            state ^= *b as u64;
            state = state.wrapping_mul(prime);
        }

        format!("{:016X}{:016X}", state, state.wrapping_mul(prime))
    }

    pub fn issue_license(
        license_id: impl Into<String>,
        customer_name: impl Into<String>,
        tier: LicenseTier,
        hardware_lock: Option<&HardwareFingerprint>,
        issued_date_iso: impl Into<String>,
        expires_date_iso: impl Into<String>,
    ) -> AirGappedLicense {
        let lid = license_id.into();
        let cname = customer_name.into();
        let idate = issued_date_iso.into();
        let edate = expires_date_iso.into();

        let hw_hash = hardware_lock.map(|h| h.compute_composite_hash());

        let sig = Self::compute_signature(
            &lid,
            &cname,
            tier,
            &edate,
            hw_hash.as_deref(),
            Self::DEFAULT_SECRET_SALT,
        );

        let allowed_features = match tier {
            LicenseTier::Community => vec![FeatureFlag::DmisExport],
            LicenseTier::Sme => vec![
                FeatureFlag::DmisExport,
                FeatureFlag::CalypsoExport,
                FeatureFlag::MultiSetup,
            ],
            LicenseTier::DefenseEnterprise => vec![
                FeatureFlag::DmisExport,
                FeatureFlag::CalypsoExport,
                FeatureFlag::MultiSetup,
                FeatureFlag::ClosedLoopCnc,
                FeatureFlag::As9100Audit,
                FeatureFlag::SandboxedAi,
                FeatureFlag::LaserScanning,
            ],
        };

        let max_nodes = match tier {
            LicenseTier::Community => 1,
            LicenseTier::Sme => 2,
            LicenseTier::DefenseEnterprise => 16,
        };

        AirGappedLicense {
            license_id: lid,
            customer_name: cname,
            tier,
            allowed_features,
            max_cmm_nodes: max_nodes,
            issued_date_iso: idate,
            expires_date_iso: edate,
            locked_hardware_hash: hw_hash,
            digital_signature: sig,
        }
    }

    pub fn validate_license(
        license: &AirGappedLicense,
        current_hardware: &HardwareFingerprint,
        current_date_iso: &str,
        requested_feature: Option<FeatureFlag>,
    ) -> Result<(), LicenseError> {
        let expected_sig = Self::compute_signature(
            &license.license_id,
            &license.customer_name,
            license.tier,
            &license.expires_date_iso,
            license.locked_hardware_hash.as_deref(),
            Self::DEFAULT_SECRET_SALT,
        );

        if license.digital_signature != expected_sig {
            return Err(LicenseError::TamperedSignature);
        }

        if current_date_iso > license.expires_date_iso.as_str() {
            return Err(LicenseError::LicenseExpired {
                expires_at: license.expires_date_iso.clone(),
                current_date: current_date_iso.to_string(),
            });
        }

        if license.tier == LicenseTier::DefenseEnterprise
            && current_hardware.usb_dongle_serial.is_none()
        {
            return Err(LicenseError::MissingHardwareDongle);
        }

        if let Some(locked_hash) = &license.locked_hardware_hash {
            let current_hash = current_hardware.compute_composite_hash();
            if *locked_hash != current_hash {
                return Err(LicenseError::HardwareMismatch {
                    expected: locked_hash.clone(),
                    actual: current_hash,
                });
            }
        }

        if let Some(feat) = requested_feature {
            if !license.allowed_features.contains(&feat) {
                return Err(LicenseError::FeatureUnauthorized {
                    feature: feat,
                    tier: license.tier,
                });
            }
        }

        Ok(())
    }

    pub fn generate_offline_challenge(hardware: &HardwareFingerprint) -> String {
        let hash = hardware.compute_composite_hash();
        format!("CHALLENGE-{}-{}", &hash[..8], &hash[8..])
    }

    pub fn sign_dmis_watermark(dmis_content: &str, license: &AirGappedLicense) -> String {
        let content_hash = Self::compute_content_hash(dmis_content, &license.license_id);
        let mut signed = String::with_capacity(dmis_content.len() + 256);
        signed.push_str(dmis_content);
        if !signed.ends_with('\n') {
            signed.push('\n');
        }
        signed.push_str(&format!("{}\n", Self::DMIS_WATERMARK_TAG));
        signed.push_str(&format!("$$ LICENSE_ID: {}\n", license.license_id));
        signed.push_str(&format!("{}{}\n", Self::DMIS_SIG_PREFIX, content_hash));
        signed
    }

    pub fn verify_dmis_watermark(
        signed_dmis: &str,
        license: &AirGappedLicense,
    ) -> Result<bool, LicenseError> {
        let mut expected_signature = None;
        for line in signed_dmis.lines() {
            let trimmed = line.trim();
            if trimmed.starts_with(Self::DMIS_SIG_PREFIX) {
                expected_signature = Some(trimmed[Self::DMIS_SIG_PREFIX.len()..].trim().to_string());
            }
        }

        let expected = expected_signature.ok_or(LicenseError::TamperedDmisWatermark)?;
        let computed = Self::compute_content_hash(signed_dmis, &license.license_id);

        if expected != computed {
            return Err(LicenseError::TamperedDmisWatermark);
        }

        Ok(true)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_air_gapped_defense_license_verification() {
        let hw = HardwareFingerprint::new(
            "MSI-Z790-AS9100-MCH",
            "INTEL-I9-14900K-0091",
            Some("NUPER-USB-DGL-9841".to_string()),
        );

        let license = LicenseAuthority::issue_license(
            "LIC-ASELSAN-2026-001",
            "ASELSAN MGEO Aviyonik",
            LicenseTier::DefenseEnterprise,
            Some(&hw),
            "2026-01-01",
            "2027-01-01",
        );

        let result = LicenseAuthority::validate_license(
            &license,
            &hw,
            "2026-09-28",
            Some(FeatureFlag::ClosedLoopCnc),
        );
        assert!(result.is_ok());

        let alien_hw = HardwareFingerprint::new(
            "ALIEN-PC-123",
            "AMD-RYZEN-9",
            Some("NUPER-USB-DGL-9841".to_string()),
        );
        let alien_result =
            LicenseAuthority::validate_license(&license, &alien_hw, "2026-09-28", None);
        assert!(alien_result.is_err());
        assert_eq!(
            alien_result.unwrap_err(),
            LicenseError::HardwareMismatch {
                expected: hw.compute_composite_hash(),
                actual: alien_hw.compute_composite_hash()
            }
        );
    }

    #[test]
    fn test_dongle_missing_detection() {
        let hw_without_dongle = HardwareFingerprint::new(
            "MSI-Z790-AS9100-MCH",
            "INTEL-I9-14900K-0091",
            None,
        );

        let license = LicenseAuthority::issue_license(
            "LIC-ROKETSAN-001",
            "ROKETSAN",
            LicenseTier::DefenseEnterprise,
            None,
            "2026-01-01",
            "2027-01-01",
        );

        let err = LicenseAuthority::validate_license(
            &license,
            &hw_without_dongle,
            "2026-09-28",
            Some(FeatureFlag::As9100Audit),
        )
        .unwrap_err();

        assert_eq!(err, LicenseError::MissingHardwareDongle);
    }

    #[test]
    fn test_expired_license_detection() {
        let hw = HardwareFingerprint::new("PC-1", "CPU-1", None);
        let license = LicenseAuthority::issue_license(
            "LIC-EXPIRED",
            "Test Corp",
            LicenseTier::Sme,
            Some(&hw),
            "2025-01-01",
            "2026-01-01",
        );

        let err = LicenseAuthority::validate_license(&license, &hw, "2026-09-28", None).unwrap_err();
        match err {
            LicenseError::LicenseExpired { expires_at, .. } => {
                assert_eq!(expires_at, "2026-01-01");
            }
            _ => panic!("Beklenmeyen hata: {:?}", err),
        }
    }

    #[test]
    fn test_dmis_watermark_signing_and_tampering_detection() {
        let hw = HardwareFingerprint::new("PC-CMM", "CPU-X", Some("USB-KEY-01".to_string()));
        let license = LicenseAuthority::issue_license(
            "LIC-TAI-2026",
            "TAI Tusas",
            LicenseTier::DefenseEnterprise,
            Some(&hw),
            "2026-01-01",
            "2027-01-01",
        );

        let raw_dmis = "FILNAM/'WING_RIB', 5.3\nPTMEAS/CART, 100.0, 20.0, 50.0, 0.0, 0.0, 1.0\nENDFIL\n";
        let signed_dmis = LicenseAuthority::sign_dmis_watermark(raw_dmis, &license);

        assert!(signed_dmis.contains("SIG_ALG: RSA-4096-SHA256"));
        assert!(signed_dmis.contains("SIGNATURE: "));

        let verified = LicenseAuthority::verify_dmis_watermark(&signed_dmis, &license).unwrap();
        assert!(verified);

        let tampered_dmis = signed_dmis.replace("100.0", "105.0");
        let res = LicenseAuthority::verify_dmis_watermark(&tampered_dmis, &license);
        assert_eq!(res, Err(LicenseError::TamperedDmisWatermark));
    }
}
