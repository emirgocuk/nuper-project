use serde::{Deserialize, Serialize};

/// Standart Vida Dişi Standartları
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ThreadStandard {
    /// Metrik Normal Hatve (ISO 261 / ISO 965-1 / DIN 13)
    MetricCoarse { nominal_d: f64, pitch: f64 },
    /// Metrik İnce Hatve (ISO 261 / DIN 13-2..11)
    MetricFine { nominal_d: f64, pitch: f64 },
    /// İnç Amerikan Standardı (ASME B1.1 UNC / UNF)
    UnifiedInch { size: String, tpi: u32, is_fine: bool },
    /// Gaz / Silindirik Boru Dişi (BSPP / ISO 228-1 / DIN EN ISO 228)
    PipeGas { size: String },
    /// Konik Amerikan Boru Dişi (ASME B1.20.1 NPT)
    NptPipe { size: String },
}

/// CAD Silindir Çapının Temsil Türü
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum ThreadDiameterKind {
    /// Kılavuz matkap deliği çapı (Tap Drill Diameter)
    TapDrill,
    /// Anma tepe çapı (Nominal Major Diameter)
    NominalMajor,
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
    /// Anma büyük çapı (mm)
    pub nominal_major_diameter: f64,
    /// Vida dişi boyu / derinliği (mm)
    pub thread_depth: f64,
    /// Seçilen prob güvenlik ve baypas stratejisi
    pub bypass_strategy: ThreadBypassStrategy,
}

impl ThreadSpecification {
    /// Standart bir Metrik Normal vida dişi oluşturur (ISO 261 / ISO 965-1)
    pub fn new_metric_coarse(nominal_d: f64, depth: f64) -> Option<Self> {
        let (pitch, tap_drill) = match (nominal_d * 10.0).round() as u32 {
            20 => (0.40, 1.6),
            25 => (0.45, 2.05),
            30 => (0.50, 2.5),
            40 => (0.70, 3.3),
            50 => (0.80, 4.2),
            60 => (1.00, 5.0),
            80 => (1.25, 6.8),
            100 => (1.50, 8.5),
            120 => (1.75, 10.2),
            140 => (2.00, 12.0),
            160 => (2.00, 14.0),
            180 => (2.50, 15.5),
            200 => (2.50, 17.5),
            220 => (2.50, 19.5),
            240 => (3.00, 21.0),
            270 => (3.00, 24.0),
            300 => (3.50, 26.5),
            360 => (4.00, 32.0),
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

    /// Standart bir Metrik İnce vida dişi oluşturur (ISO 261 / DIN 13)
    pub fn new_metric_fine(nominal_d: f64, pitch: f64, depth: f64) -> Option<Self> {
        let tap_drill = nominal_d - pitch;
        Some(Self {
            standard: ThreadStandard::MetricFine { nominal_d, pitch },
            class_of_fit: "6H".to_string(),
            tap_drill_diameter: (tap_drill * 100.0).round() / 100.0,
            nominal_major_diameter: nominal_d,
            thread_depth: depth,
            bypass_strategy: ThreadBypassStrategy::BypassAndGaugeSheet,
        })
    }

    /// Amerikan İnç vida dişi oluşturur (ASME B1.1 UNC / UNF)
    pub fn new_unified_inch(size: &str, depth: f64) -> Option<Self> {
        let (nom, tap, tpi, is_fine) = match size {
            "#4-40" | "#4-40 UNC" => (2.84, 2.30, 40, false),
            "#6-32" | "#6-32 UNC" => (3.51, 2.85, 32, false),
            "#8-32" | "#8-32 UNC" => (4.17, 3.50, 32, false),
            "#10-24" | "#10-24 UNC" => (4.83, 3.90, 24, false),
            "1/4-20" | "1/4-20 UNC" => (6.35, 5.10, 20, false),
            "5/16-18" | "5/16-18 UNC" => (7.94, 6.60, 18, false),
            "3/8-16" | "3/8-16 UNC" => (9.53, 8.00, 16, false),
            "7/16-14" | "7/16-14 UNC" => (11.11, 9.40, 14, false),
            "1/2-13" | "1/2-13 UNC" => (12.70, 10.80, 13, false),
            "5/8-11" | "5/8-11 UNC" => (15.88, 13.50, 11, false),
            "3/4-10" | "3/4-10 UNC" => (19.05, 16.50, 10, false),
            // UNF
            "1/4-28" | "1/4-28 UNF" => (6.35, 5.50, 28, true),
            "5/16-24" | "5/16-24 UNF" => (7.94, 6.90, 24, true),
            "3/8-24" | "3/8-24 UNF" => (9.53, 8.50, 24, true),
            "1/2-20" | "1/2-20 UNF" => (12.70, 11.50, 20, true),
            _ => return None,
        };

        Some(Self {
            standard: ThreadStandard::UnifiedInch {
                size: size.to_string(),
                tpi,
                is_fine,
            },
            class_of_fit: "2B".to_string(),
            tap_drill_diameter: tap,
            nominal_major_diameter: nom,
            thread_depth: depth,
            bypass_strategy: ThreadBypassStrategy::BypassAndGaugeSheet,
        })
    }

    /// Gaz / Boru Dişi oluşturur (BSPP / ISO 228-1)
    pub fn new_pipe_gas(size: &str, depth: f64) -> Option<Self> {
        let (tap_drill, nominal_d) = match size {
            "G 1/8\"" | "G1/8" | "G 1/8" => (8.80, 9.73),
            "G 1/4\"" | "G1/4" | "G 1/4" => (11.80, 13.16),
            "G 3/8\"" | "G3/8" | "G 3/8" => (15.25, 16.66),
            "G 1/2\"" | "G1/2" | "G 1/2" => (19.00, 20.95),
            "G 3/4\"" | "G3/4" | "G 3/4" => (24.50, 26.44),
            "G 1\"" | "G1" | "G 1" => (30.75, 33.25),
            _ => return None,
        };

        Some(Self {
            standard: ThreadStandard::PipeGas {
                size: size.to_string(),
            },
            class_of_fit: "Class A".to_string(),
            tap_drill_diameter: tap_drill,
            nominal_major_diameter: nominal_d,
            thread_depth: depth,
            bypass_strategy: ThreadBypassStrategy::BypassAndGaugeSheet,
        })
    }

    /// NPT Konik Amerikan Boru Dişi oluşturur (ASME B1.20.1)
    pub fn new_npt(size: &str, depth: f64) -> Option<Self> {
        let (tap_drill, nominal_d) = match size {
            "1/8 NPT" | "1/8-27 NPT" => (8.60, 10.24),
            "1/4 NPT" | "1/4-18 NPT" => (11.10, 13.62),
            "3/8 NPT" | "3/8-18 NPT" => (14.50, 17.06),
            "1/2 NPT" | "1/2-14 NPT" => (17.90, 21.22),
            "3/4 NPT" | "3/4-14 NPT" => (23.20, 26.57),
            _ => return None,
        };

        Some(Self {
            standard: ThreadStandard::NptPipe {
                size: size.to_string(),
            },
            class_of_fit: "Standard".to_string(),
            tap_drill_diameter: tap_drill,
            nominal_major_diameter: nominal_d,
            thread_depth: depth,
            bypass_strategy: ThreadBypassStrategy::BypassAndGaugeSheet,
        })
    }

    /// Bir silindir çapının matkap çapı mı yoksa anma çapı mı olduğunu test eder
    pub fn matches_diameter(&self, measured_or_cad_d: f64, tol: f64) -> bool {
        self.matched_diameter_kind(measured_or_cad_d, tol).is_some()
    }

    /// CAD silindir çapının matkap çapına mı yoksa anma çapına mı denk geldiğini döndürür
    pub fn matched_diameter_kind(&self, measured_or_cad_d: f64, tol: f64) -> Option<ThreadDiameterKind> {
        if (measured_or_cad_d - self.tap_drill_diameter).abs() <= tol {
            Some(ThreadDiameterKind::TapDrill)
        } else if (measured_or_cad_d - self.nominal_major_diameter).abs() <= tol {
            Some(ThreadDiameterKind::NominalMajor)
        } else {
            None
        }
    }

    /// Kurulum föyü için operatör mastar föyü öğesine dönüştürür
    pub fn to_gauge_item(&self, feature_id: u32, feature_name: &str) -> ManualGaugeItem {
        let (designation, standard_code, gauge_type) = match &self.standard {
            ThreadStandard::MetricCoarse { nominal_d, pitch } => (
                format!("M{:.0}x{:.2}", nominal_d, pitch),
                format!("ISO 1502 / DIN 13 ({})", self.class_of_fit),
                "Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge)".to_string(),
            ),
            ThreadStandard::MetricFine { nominal_d, pitch } => (
                format!("M{:.0}x{:.2} Fine", nominal_d, pitch),
                format!("ISO 1502 / DIN 13 ({})", self.class_of_fit),
                "Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge)".to_string(),
            ),
            ThreadStandard::UnifiedInch { size, tpi, .. } => (
                format!("{}-{} UNC/UNF", size, tpi),
                format!("ASME B1.2 ({})", self.class_of_fit),
                "Geçer / Geçmez Diş Tampon Mastarı (GO/NOGO Plug Gauge)".to_string(),
            ),
            ThreadStandard::PipeGas { size } => (
                size.clone(),
                format!("ISO 228-1 / DIN EN ISO 228 ({})", self.class_of_fit),
                "Silindirik Gaz Diş Tampon Mastarı (Cylindrical Thread Gauge)".to_string(),
            ),
            ThreadStandard::NptPipe { size } => (
                size.clone(),
                format!("ASME B1.20.1 ({})", self.class_of_fit),
                "Konik Diş Sınır Mastarı (NPT L1 Thread Plug Gauge)".to_string(),
            ),
        };

        ManualGaugeItem {
            feature_id,
            feature_name: feature_name.to_string(),
            thread_designation: designation,
            gauge_type,
            standard_code,
            thread_depth: self.thread_depth,
            bypass_note: match self.bypass_strategy {
                ThreadBypassStrategy::BypassAndGaugeSheet => {
                    "CMM probu yakut bilye kırılması riskine karşı bu deliğe girmez; operatör manuel mastarla doğrulamalıdır."
                        .to_string()
                }
                ThreadBypassStrategy::CountersinkCenterOnly => {
                    "CMM deliğin sadece giriş havşasını (chamfer) ölçerek merkezini doğrular; diş adımı mastarla kontrol edilmelidir."
                        .to_string()
                }
                ThreadBypassStrategy::ThreadLocatorPin => {
                    "Operatör dişli pimi vidalar; CMM bu pimin dış silindirini ölçerek pozisyon alır."
                        .to_string()
                }
            },
        }
    }
}

/// CAD silindir çapı ve derinliğinden standart vidayı otomatik tespit eden sınıflandırıcı
pub fn classify_thread_from_bore(diameter: f64, depth: f64) -> Option<ThreadSpecification> {
    let metric_coarse_sizes = [
        (2.0, 1.6),
        (2.5, 2.05),
        (3.0, 2.5),
        (4.0, 3.3),
        (5.0, 4.2),
        (6.0, 5.0),
        (8.0, 6.8),
        (10.0, 8.5),
        (12.0, 10.2),
        (14.0, 12.0),
        (16.0, 14.0),
        (18.0, 15.5),
        (20.0, 17.5),
        (22.0, 19.5),
        (24.0, 21.0),
        (27.0, 24.0),
        (30.0, 26.5),
        (36.0, 32.0),
    ];

    let tol = 0.25; // 0.25 mm tolerans bandı
    for &(nom, tap) in &metric_coarse_sizes {
        if (diameter - tap).abs() <= tol || (diameter - nom).abs() <= tol {
            return ThreadSpecification::new_metric_coarse(nom, depth);
        }
    }

    // Gaz dişleri kontrolü
    let pipe_sizes = [
        ("G 1/8\"", 8.80, 9.73),
        ("G 1/4\"", 11.80, 13.16),
        ("G 3/8\"", 15.25, 16.66),
        ("G 1/2\"", 19.00, 20.95),
        ("G 3/4\"", 24.50, 26.44),
        ("G 1\"", 30.75, 33.25),
    ];

    for &(name, tap, nom) in &pipe_sizes {
        if (diameter - tap).abs() <= tol || (diameter - nom).abs() <= tol {
            return ThreadSpecification::new_pipe_gas(name, depth);
        }
    }

    None
}

/// 2D Resim Metin Çağrısı (Callout) ve Delik Boyutundan Vida Tespiti
pub fn classify_thread_from_callout(
    callout_text: &str,
    depth: f64,
    bore_diameter: Option<f64>,
) -> Option<ThreadSpecification> {
    let text = callout_text.to_uppercase();

    // Metrik ayrıştırma (ör: "M8", "M8X1.25", "4X M10 - 6H", "M12X1.5")
    if let Some(m_idx) = text.find('M') {
        let remainder = &text[m_idx + 1..];
        // Rakamları topla
        let num_str: String = remainder
            .chars()
            .take_while(|c| c.is_ascii_digit() || *c == '.')
            .collect();
        if let Ok(nom_d) = num_str.parse::<f64>() {
            // Hatve var mı? (ör: "X1.5")
            if let Some(x_idx) = remainder.find('X') {
                let pitch_str: String = remainder[x_idx + 1..]
                    .chars()
                    .take_while(|c| c.is_ascii_digit() || *c == '.')
                    .collect();
                if let Ok(pitch) = pitch_str.parse::<f64>() {
                    return ThreadSpecification::new_metric_fine(nom_d, pitch, depth);
                }
            }
            if let Some(spec) = ThreadSpecification::new_metric_coarse(nom_d, depth) {
                return Some(spec);
            }
        }
    }

    // Gaz dişi ayrıştırma (ör: "G 1/4", "G1/4", "G 1/2")
    if text.contains("G 1/8") || text.contains("G1/8") {
        return ThreadSpecification::new_pipe_gas("G 1/8\"", depth);
    }
    if text.contains("G 1/4") || text.contains("G1/4") {
        return ThreadSpecification::new_pipe_gas("G 1/4\"", depth);
    }
    if text.contains("G 3/8") || text.contains("G3/8") {
        return ThreadSpecification::new_pipe_gas("G 3/8\"", depth);
    }
    if text.contains("G 1/2") || text.contains("G1/2") {
        return ThreadSpecification::new_pipe_gas("G 1/2\"", depth);
    }
    if text.contains("G 3/4") || text.contains("G3/4") {
        return ThreadSpecification::new_pipe_gas("G 3/4\"", depth);
    }

    // Amerikan UNC/UNF ayrıştırma
    if text.contains("1/4-20") {
        return ThreadSpecification::new_unified_inch("1/4-20 UNC", depth);
    }
    if text.contains("5/16-18") {
        return ThreadSpecification::new_unified_inch("5/16-18 UNC", depth);
    }
    if text.contains("3/8-16") {
        return ThreadSpecification::new_unified_inch("3/8-16 UNC", depth);
    }
    if text.contains("1/2-13") {
        return ThreadSpecification::new_unified_inch("1/2-13 UNC", depth);
    }

    // Eğer metinden tam çıkmadıysa ama çap verilmişse çap sınıflandırmasına başvur
    if let Some(d) = bore_diameter {
        return classify_thread_from_bore(d, depth);
    }

    None
}

/// Operatör Manuel Mastar Doğrulama Listesi Öğesi (Setup Sheet)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ManualGaugeItem {
    pub feature_id: u32,
    pub feature_name: String,
    pub thread_designation: String,
    pub gauge_type: String,
    pub standard_code: String,
    pub thread_depth: f64,
    pub bypass_note: String,
}

/// CMM Kurulum Föyü İçin Operatör Mastar Doğrulama Raporu (Setup Sheet Gauge Table)
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct SetupSheetGaugeReport {
    pub items: Vec<ManualGaugeItem>,
}

impl SetupSheetGaugeReport {
    pub fn new() -> Self {
        Self { items: Vec::new() }
    }

    pub fn add_item(&mut self, item: ManualGaugeItem) {
        self.items.push(item);
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    pub fn len(&self) -> usize {
        self.items.len()
    }

    /// Operatör için terminal veya setup sheet ASCII tablosu üretir
    pub fn format_ascii_table(&self) -> String {
        if self.items.is_empty() {
            return "Manuel mastar gerektiren vida dişi unsuru bulunmamaktadır.\n".to_string();
        }

        let mut out = String::new();
        out.push_str("┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐\n");
        out.push_str("│ 🛠️  NUPER ORTHO — MANUEL MASTAR DOĞRULAMA KURULUM FÖYÜ (SETUP SHEET)                                                  │\n");
        out.push_str("│    (Yakut prob bilyesini korumak için CMM tarafından baypas edilen vida dişleri ve mastar talimatları)               │\n");
        out.push_str("├────┬────────────────────┬──────────────┬───────────────────────────────┬──────────────────────┬─────────┬──────────────┤\n");
        out.push_str("│ No │ Unsur Adı          │ Diş Ölçüsü   │ Mastar Tipi                   │ Standart / Tolerans  │ Derinlik│ Saha Durumu  │\n");
        out.push_str("├────┼────────────────────┼──────────────┼───────────────────────────────┼──────────────────────┼─────────┼──────────────┤\n");

        for (idx, item) in self.items.iter().enumerate() {
            out.push_str(&format!(
                "│ {:<2} │ {:<18} │ {:<12} │ {:<29} │ {:<20} │ {:>5.1}mm │ [ ] BEKLİYOR │\n",
                idx + 1,
                Self::truncate(&item.feature_name, 18),
                Self::truncate(&item.thread_designation, 12),
                Self::truncate(&item.gauge_type, 29),
                Self::truncate(&item.standard_code, 20),
                item.thread_depth
            ));
        }

        out.push_str("└────┴────────────────────┴──────────────┴───────────────────────────────┴──────────────────────┴─────────┴──────────────┘\n");
        out
    }

    /// Markdown formatında rapor tablosu üretir
    pub fn format_markdown_table(&self) -> String {
        if self.items.is_empty() {
            return "_Manuel mastar kontrolü gerektiren dişli delik bulunmamaktadır._\n".to_string();
        }

        let mut out = String::new();
        out.push_str("### 🛠️ Manuel Mastar Doğrulama Listesi (Operator Setup Sheet)\n\n");
        out.push_str("| No | Unsur Adı | Diş Tanımı | Kullanılacak Mastar | Standart / Sınıf | Derinlik | Koruma Notu |\n");
        out.push_str("|:--:|:---|:---|:---|:---|:--:|:---|\n");

        for (idx, item) in self.items.iter().enumerate() {
            out.push_str(&format!(
                "| {} | `{}` | **{}** | {} | {} | {:.1} mm | {} |\n",
                idx + 1,
                item.feature_name,
                item.thread_designation,
                item.gauge_type,
                item.standard_code,
                item.thread_depth,
                item.bypass_note
            ));
        }
        out.push('\n');
        out
    }

    fn truncate(s: &str, max_len: usize) -> String {
        if s.chars().count() <= max_len {
            s.to_string()
        } else {
            let mut res: String = s.chars().take(max_len - 2).collect();
            res.push_str("..");
            res
        }
    }
}
