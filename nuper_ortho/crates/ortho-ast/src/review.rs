use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ReviewError {
    #[error("Onaylanamaz durum: Boyut reddedilmiş")]
    RejectedItem,

    #[error("Onaylanamaz durum: CAD ve Çizim uyumsuzluğu")]
    CadMismatch,

    #[error("Onaylanamaz durum: Belirsiz eşleştirme çözülmemiş")]
    AmbiguousMatch,

    #[error("Onaylanamaz durum: Nominal değer eksik")]
    MissingNominal,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Approval {
    pub operator_id: String,
    pub timestamp_iso: String,
    pub source_sha256: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct UnreviewedItem {
    pub id: u32,
    pub feature_name: String,
    pub nominal: Option<f64>,
    pub tolerance: Option<f64>,
    pub is_mismatch: bool,
    pub is_ambiguous: bool,
    pub is_rejected: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApprovedItem {
    pub(crate) id: u32,
    pub(crate) feature_name: String,
    pub(crate) nominal: f64,
    pub(crate) tolerance: f64,
    pub(crate) approval: Approval,
}

impl ApprovedItem {
    pub fn id(&self) -> u32 {
        self.id
    }

    pub fn feature_name(&self) -> &str {
        &self.feature_name
    }

    pub fn nominal(&self) -> f64 {
        self.nominal
    }

    pub fn tolerance(&self) -> f64 {
        self.tolerance
    }

    pub fn approval(&self) -> &Approval {
        &self.approval
    }
}

impl UnreviewedItem {
    pub fn approve(
        self,
        operator_id: impl Into<String>,
        timestamp_iso: impl Into<String>,
        source_sha256: impl Into<String>,
    ) -> Result<ApprovedItem, ReviewError> {
        if self.is_rejected {
            return Err(ReviewError::RejectedItem);
        }
        if self.is_mismatch {
            return Err(ReviewError::CadMismatch);
        }
        if self.is_ambiguous {
            return Err(ReviewError::AmbiguousMatch);
        }
        let nominal = self.nominal.ok_or(ReviewError::MissingNominal)?;
        let tolerance = self.tolerance.unwrap_or(0.0);

        Ok(ApprovedItem {
            id: self.id,
            feature_name: self.feature_name,
            nominal,
            tolerance,
            approval: Approval {
                operator_id: operator_id.into(),
                timestamp_iso: timestamp_iso.into(),
                source_sha256: source_sha256.into(),
            },
        })
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApprovedPlan {
    pub plan_name: String,
    pub items: Vec<ApprovedItem>,
    pub audit_hash: String,
}

impl ApprovedPlan {
    pub fn new(plan_name: impl Into<String>, items: Vec<ApprovedItem>, source_sha256: &str) -> Self {
        let mut hash_state: u64 = 0x84222325cbf29ce4;
        let prime: u64 = 0x100000001b3;
        for b in source_sha256.as_bytes() {
            hash_state ^= *b as u64;
            hash_state = hash_state.wrapping_mul(prime);
        }
        for item in &items {
            for b in item.feature_name.as_bytes() {
                hash_state ^= *b as u64;
                hash_state = hash_state.wrapping_mul(prime);
            }
            let nom_bytes = item.nominal.to_bits().to_le_bytes();
            for b in &nom_bytes {
                hash_state ^= *b as u64;
                hash_state = hash_state.wrapping_mul(prime);
            }
        }
        let audit_hash = format!("{:016X}", hash_state);

        Self {
            plan_name: plan_name.into(),
            items,
            audit_hash,
        }
    }
}
