//! # ortho-ai
//!
//! Nuper Ortho Yerel Sandboxed AI & Deterministik Gardiyan Sandığı (Doc 14).
//!
//! 1. `guardrail`: GBNF JSON Şema Kısıtı & B-Rep Ground-Truth Doğrulaması.
//! 2. `intent`: İmalat Niyeti & Tornalanmış Parça 3-Köşe Loblanma Tespiti.
//! 3. `diagnostics`: Doğal Dilde Çarpışma ve Hareket Teşhisi.
//! 4. `root_cause`: Kapalı Döngü Kök Neden Analiz Asistanı (G54 vs Aşınma vs Mengene).

pub mod diagnostics;
pub mod guardrail;
pub mod intent;
pub mod root_cause;

pub use diagnostics::{CollisionDiagnosticReport, NaturalLanguageDiagnostics};
pub use guardrail::{AiGdtExtraction, DeterministicGuardrail, GuardrailError, ValidatedGdtExtraction};
pub use intent::{ManufacturingIntentDetector, ManufacturingIntentStrategy, ManufacturingMethod};
pub use root_cause::{RootCauseAnalyzer, RootCauseReport, RootCauseType};
