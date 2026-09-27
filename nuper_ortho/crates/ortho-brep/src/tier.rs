use serde::{Deserialize, Serialize};
use ortho_ast::{DatumLabel, MaterialModifier, ToleranceConstraint, ToleranceType};

/// Dört Kademeli Akıllı Çıkarım Seviyesi (Tiered Inference Engine)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum InferenceTier {
    /// Seviye 0: Doğrudan STEP AP242 Semantik PMI (AI tamamen atlanır, <0.2s, 0 MB RAM)
    Tier0StepPmi,
    /// Seviye 1: Kural Tabanlı Klasik OCR & Geometrik Regex (1-2s, <200 MB RAM, Saf CPU)
    Tier1RuleBasedOcr,
    /// Seviye 2: Kompakt Vision SLM (Moondream2 / SmolVLM-1.7B, 3-5s, ~1.5 GB RAM)
    Tier2CompactVisionSlm,
    /// Seviye 3: İleri Çok Modlu VLM (Qwen2-VL-7B, Yalnızca >= 8 GB VRAM GPU varsa)
    Tier3AdvancedVlm,
}

/// Atölye bilgisayarı donanım profili
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct HardwareProfile {
    /// Sistem bellek miktarı (MB)
    pub system_ram_mb: usize,
    /// Varsa harici GPU VRAM miktarı (MB)
    pub vram_mb: usize,
    /// Harici GPU mevcut mu?
    pub has_discrete_gpu: bool,
    /// CPU çekirdek sayısı
    pub cpu_cores: usize,
}

impl HardwareProfile {
    /// Tipik bir atölye ofis bilgisayarı profili (8 GB RAM, GPU yok)
    pub fn workshop_standard_pc() -> Self {
        Self {
            system_ram_mb: 8192,
            vram_mb: 0,
            has_discrete_gpu: false,
            cpu_cores: 4,
        }
    }

    /// İleri seviye kalite kontrol iş istasyonu (32 GB RAM, 12 GB RTX GPU)
    pub fn high_end_workstation() -> Self {
        Self {
            system_ram_mb: 32768,
            vram_mb: 12288,
            has_discrete_gpu: true,
            cpu_cores: 16,
        }
    }

    /// Donanım imkanlarına ve CAD/çizim durumuna göre en uygun çıkarım kademesini seçer
    pub fn select_optimal_tier(
        &self,
        step_has_pmi: bool,
        is_drawing_heavily_soiled: bool,
    ) -> InferenceTier {
        // Kural 1: Modelde AP242 PMI varsa donanım ne olursa olsun doğrudan oku!
        if step_has_pmi {
            return InferenceTier::Tier0StepPmi;
        }

        // Kural 2: Güçlü harici GPU (>= 8 GB VRAM) ve kirli/zorlu el yazılı çizim varsa Tier 3
        if self.has_discrete_gpu && self.vram_mb >= 8192 && is_drawing_heavily_soiled {
            return InferenceTier::Tier3AdvancedVlm;
        }

        // Kural 3: Yeterli bellek (>= 4 GB RAM) varsa ve standart kural tabanlı regex yetersizse Tier 2
        if self.system_ram_mb >= 4096 && is_drawing_heavily_soiled {
            return InferenceTier::Tier2CompactVisionSlm;
        }

        // Kural 4: Standart atölye bilgisayarı ve vektör/temiz PDF çizimleri için hafif Tier 1
        InferenceTier::Tier1RuleBasedOcr
    }
}

/// Seviye 1: Kural tabanlı metin ve tolerans kutusu ayrıştırıcısı
pub struct Tier1RuleBasedParser;

impl Tier1RuleBasedParser {
    /// Standart bir çap ve tolerans metnini ayrıştırır (Örn: "4x Ø20 H7", "Ø15 +0.021/0", "Ø10")
    pub fn parse_diameter_callout(text: &str) -> Option<(usize, f64, f64)> {
        let clean = text.trim();
        // Basit miktar ayrıştırma (Örn: "4x" veya "4X")
        let (qty, rest) = if let Some(idx) = clean.find(['x', 'X']) {
            let qty_str = clean[..idx].trim();
            let q = qty_str.parse::<usize>().unwrap_or(1);
            (q, clean[idx + 1..].trim())
        } else {
            (1, clean)
        };

        // Çap sembolü "Ø" veya "DIA" veya "O"
        let dia_str = rest
            .trim_start_matches(|c| c == 'Ø' || c == 'O' || c == 'o')
            .trim();

        // Sayısal çapı çıkar
        let mut num_str = String::new();
        let mut chars = dia_str.chars().peekable();
        while let Some(&c) = chars.peek() {
            if c.is_ascii_digit() || c == '.' {
                num_str.push(c);
                chars.next();
            } else {
                break;
            }
        }

        let dia = num_str.parse::<f64>().ok()?;

        // ISO H7 vb. fit kontrolü
        let remaining: String = chars.collect();
        let tol_band = if remaining.contains("H7") || remaining.contains("h7") {
            // Nominal çapa göre H7 bandı (basitleştirilmiş standart aralık)
            if dia <= 18.0 {
                0.018
            } else if dia <= 30.0 {
                0.021
            } else if dia <= 50.0 {
                0.025
            } else {
                0.030
            }
        } else {
            0.050 // Varsayılan genel tolerans
        };

        Some((qty, dia, tol_band))
    }

    /// Standart ASME/ISO Feature Control Frame ayrıştırma
    /// Format: "[POS | 0.05 | A | B | C]" veya "[FLAT | 0.02]"
    pub fn parse_fcf_string(id: u32, text: &str) -> Option<ToleranceConstraint> {
        let trimmed = text.trim().trim_matches(|c| c == '[' || c == ']' || c == '|');
        let parts: Vec<&str> = trimmed.split('|').map(|s| s.trim()).collect();
        if parts.len() < 2 {
            return None;
        }

        let symbol_str = parts[0].to_uppercase();
        let tol_type = match symbol_str.as_str() {
            "POS" | "POSITION" | "⨁" => ToleranceType::Position,
            "FLAT" | "FLATNESS" | "⏥" => ToleranceType::Flatness,
            "PERP" | "PERPENDICULARITY" | "⟂" => ToleranceType::Perpendicularity,
            "PARALLEL" | "PARALLELISM" | "∥" => ToleranceType::Parallelism,
            "PROF" | "PROFILE" | "⌓" => ToleranceType::ProfileOfSurface,
            _ => ToleranceType::Position,
        };

        // Tolerans değeri ve modifikatör
        let val_part = parts[1];
        let modifier = if val_part.contains("(M)") || val_part.contains("Ⓜ") {
            MaterialModifier::MMC
        } else if val_part.contains("(L)") || val_part.contains("Ⓛ") {
            MaterialModifier::LMC
        } else {
            MaterialModifier::RFS
        };

        let num_str: String = val_part
            .chars()
            .filter(|c| c.is_ascii_digit() || *c == '.')
            .collect();
        let val = num_str.parse::<f64>().ok()?;

        // Datum zinciri (A, B, C...)
        let mut datums = Vec::new();
        for &p in &parts[2..] {
            let d_clean = p.trim().to_uppercase();
            match d_clean.as_str() {
                "A" => datums.push(DatumLabel::A),
                "B" => datums.push(DatumLabel::B),
                "C" => datums.push(DatumLabel::C),
                "D" => datums.push(DatumLabel::D),
                _ => {}
            }
        }

        Some(ToleranceConstraint {
            id,
            feature_id: 0, // Sonradan eşleştirilecek
            tolerance_type: tol_type,
            nominal_value: 0.0,
            upper_tolerance: val,
            lower_tolerance: 0.0,
            datum_precedence: datums,
            material_modifier: modifier,
            recommended_fitting: ortho_ast::FittingAlgorithm::GaussLeastSquares,
            is_composite: false,
            profile_disposition: None,
        })
    }
}
