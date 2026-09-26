use serde::{Deserialize, Serialize};

/// Standart Vida Dişi Standartları
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ThreadStandard {
    /// Metrik Normal Hatve (ISO 261 / DIN 13)
    MetricCoarse { nominal_d: f64, pitch: f64 },
    /// Metrik İnce Hatve
    MetricFine { nominal_d: f64, pitch: f64 },
    /// İnç Amerikan Standardı (UNC / UNF)
    UnifiedInch { size: String, tpi: u32 },
    /// Gaz / Boru Dişi (BSPP / G)
    PipeGas { size: String },
}

/// Dişli Delikler İçin Emniyet ve Baypas Stratejisi
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum ThreadBypassStrategy {
    /// Güvenli Baypas (Varsayılan): Prob deliğe girmez; Kurulum Föyüne diş mastarı talimatı basılır.
    BypassAndGaugeSheet,
    /// Giriş Havşasından Konum: Diş helisine girilmez; giriş havşa konisinden delik merkezi bulunur.
    CountersinkCenterOnly,
    /// Diş Adaptör Pimi: Operatör deliğe mastar pimi vidalar; prob bu pimin dış silindirini ölçer.
    ThreadLocatorPin,
}

/// Nötr AST içindeki Vida Dişi Spesifikasyonu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ThreadSpecification {
    pub standard: ThreadStandard,
    pub class_of_fit: String,
    /// Kılavuz matkap çapı (mm)
    pub tap_drill_diameter: f64,
    pub nominal_major_diameter: f64,
    pub thread_depth: f64,
    pub bypass_strategy: ThreadBypassStrategy,
}

impl ThreadSpecification {
    /// Standart bir Metrik Normal vida dişi oluşturur (ISO 261)
    pub fn new_metric_coarse(nominal_d: f64, depth: f64) -> Option<Self> {
        let (pitch, tap_drill) = match nominal_d.round() as u32 {
            3 => (0.50, 2.5),
            4 => (0.70, 3.3),
            5 => (0.80, 4.2),
            6 => (1.00, 5.0),
            8 => (1.25, 6.8),
            10 => (1.50, 8.5),
            12 => (1.75, 10.2),
            14 => (2.00, 12.0),
            16 => (2.00, 14.0),
            20 => (2.50, 17.5),
            _ => return None,
        };

        Some(Self {
            standard: ThreadStandard::MetricCoarse { nominal_d, pitch },
            class_of_fit: "6H".to_string(),
            tap_drill_diameter: tap_drill,
            nominal_major_diameter: nominal_d,
            thread_depth: depth,
            bypass_strategy: ThreadBypassStrategy::BypassAndGaugeSheet,
        })
    }

    /// Bir silindir çapının matkap çapı mı yoksa anma çapı mı olduğunu test eder
    pub fn matches_diameter(&self, measured_or_cad_d: f64, tol: f64) -> bool {
        (measured_or_cad_d - self.tap_drill_diameter).abs() <= tol
            || (measured_or_cad_d - self.nominal_major_diameter).abs() <= tol
    }
}
