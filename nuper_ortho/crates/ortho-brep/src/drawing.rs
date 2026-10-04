use serde::{Deserialize, Serialize};

use ortho_ast::{CompositeTolerance, ToleranceConstraint};

/// 2D Sayfa üzerindeki sınır kutusu (normalize edilmiş [0.0..1.0] koordinatlar)
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct BoundingBox2D {
    pub min_x: f64,
    pub min_y: f64,
    pub max_x: f64,
    pub max_y: f64,
}

impl BoundingBox2D {
    pub fn new(min_x: f64, min_y: f64, max_x: f64, max_y: f64) -> Self {
        Self {
            min_x,
            min_y,
            max_x,
            max_y,
        }
    }

    pub fn center(&self) -> (f64, f64) {
        ((self.min_x + self.max_x) / 2.0, (self.min_y + self.max_y) / 2.0)
    }
}

/// Çok sayfalı teknik resimlerde sayfa tipi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SheetType {
    /// Sayfa 1: Genel parça görünüşü ve ana datumlar
    Overview,
    /// Kesit görünüş (Örn. Kesit A-A, Kesit B-B)
    SectionView {
        section_label: String,
        cutting_plane_name: String,
    },
    /// Detay görünüş (Örn. Detay B 5:1)
    DetailView {
        detail_label: String,
        scale: String,
    },
}

/// Teknik resim başlık bloğu (Title Block) bilgileri
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TitleBlock {
    pub part_name: Option<String>,
    pub drawing_number: Option<String>,
    pub revision: Option<String>,
    pub material: Option<String>,
    pub general_tolerance: Option<String>,
    pub primary_datums: Vec<String>,
}

/// 2D Teknik resimden çıkarılan ham açıklama veya tolerans tipi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum AnnotationType {
    /// Çap / Boyut Ölçüsü (Örn: Ø20 H7 veya 4x Ø12)
    DiameterDimension {
        nominal_dia: f64,
        tolerance_band: f64,
        quantity: usize,
    },
    /// Derinlik ölçüsü (Örn: Derinlik 35 mm)
    DepthDimension { depth_mm: f64 },
    /// ASME / ISO Tolerans Kontrol Çerçevesi (FCF)
    FeatureControlFrame,
    /// ASME Y14.5 Bileşik Tolerans Çerçevesi (PLTZF / FRTZF)
    CompositeControlFrame,
    /// Datum Referans Sembolü (Örn: [A], [B], [C])
    DatumIdentifier { label: String },
    /// Dişli delik çağrısı (Örn: M8x1.25 - 6H)
    ThreadCallout { thread_name: String, depth_mm: f64 },
    /// Genel Üretim / Kalite Notu
    QualityNote(String),
}

/// Çıkarılmış tekil bir teknik resim açıklaması
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ExtractedAnnotation {
    pub id: u32,
    pub sheet_number: usize,
    pub raw_text: String,
    pub bbox: BoundingBox2D,
    pub annotation_type: AnnotationType,
    pub tolerance: Option<ToleranceConstraint>,
    pub composite_tolerance: Option<CompositeTolerance>,
    pub confidence: f64,
}

/// Etkileşimli İkili Kanvas Balon Öğesi (Split-Screen Balloon Item)
/// ISO 9001 / AS9102 İlk Parça Teftişi (FAI - First Article Inspection) standardında balon numarası
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BalloonItem {
    /// Balon numarası (①, ②, ③, ...)
    pub balloon_number: u32,
    pub sheet_number: usize,
    pub position: (f64, f64),
    pub annotation_id: u32,
    /// Eşleşen 3D GeometricFeature ID'si (varsa)
    pub matched_feature_id: Option<u32>,
    /// Çıkarım ve eşleştirme güven skoru [0.0 .. 1.0]
    pub confidence_score: f64,
    /// Güven skoru < 0.80 ise operatör doğrulaması gerektirir
    pub needs_human_confirmation: bool,
}

impl BalloonItem {
    pub fn new(
        balloon_number: u32,
        sheet_number: usize,
        position: (f64, f64),
        annotation_id: u32,
        confidence_score: f64,
    ) -> Self {
        let needs_human = confidence_score < 0.80;
        Self {
            balloon_number,
            sheet_number,
            position,
            annotation_id,
            matched_feature_id: None,
            confidence_score,
            needs_human_confirmation: needs_human,
        }
    }
}

/// Çok sayfalı bir teknik resim sayfası
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DrawingSheet {
    pub sheet_number: usize,
    pub sheet_type: SheetType,
    pub width_mm: f64,
    pub height_mm: f64,
    pub title_block: Option<TitleBlock>,
    pub annotations: Vec<ExtractedAnnotation>,
    pub balloons: Vec<BalloonItem>,
}

impl DrawingSheet {
    pub fn new_overview(sheet_number: usize, width_mm: f64, height_mm: f64) -> Self {
        Self {
            sheet_number,
            sheet_type: SheetType::Overview,
            width_mm,
            height_mm,
            title_block: None,
            annotations: Vec::new(),
            balloons: Vec::new(),
        }
    }

    pub fn new_section_view(
        sheet_number: usize,
        label: impl Into<String>,
        plane: impl Into<String>,
        width_mm: f64,
        height_mm: f64,
    ) -> Self {
        Self {
            sheet_number,
            sheet_type: SheetType::SectionView {
                section_label: label.into(),
                cutting_plane_name: plane.into(),
            },
            width_mm,
            height_mm,
            title_block: None,
            annotations: Vec::new(),
            balloons: Vec::new(),
        }
    }

    /// Sayfadaki açıklamaları sırayla otomatik balonlar (Auto-Ballooning)
    pub fn generate_balloons(&mut self, starting_number: u32) -> u32 {
        let mut current_num = starting_number;
        self.balloons.clear();

        for ann in &self.annotations {
            // Sadece boyut veya tolerans kutuları balonlanır
            match &ann.annotation_type {
                AnnotationType::DiameterDimension { .. }
                | AnnotationType::FeatureControlFrame
                | AnnotationType::CompositeControlFrame
                | AnnotationType::ThreadCallout { .. } => {
                    let balloon = BalloonItem::new(
                        current_num,
                        self.sheet_number,
                        ann.bbox.center(),
                        ann.id,
                        ann.confidence,
                    );
                    self.balloons.push(balloon);
                    current_num += 1;
                }
                _ => {}
            }
        }

        current_num
    }

    /// Metin içeriğinden sayfa tipini (Genel Bakış, Kesit A-A, Detay B) otomatik sınıflandırır (Doc 19 Section 3)
    pub fn classify_from_text(sheet_number: usize, text: &str, width_mm: f64, height_mm: f64) -> Self {
        let upper = text.to_uppercase();

        // 1. Kesit Görünüş Tespiti ("SECTION A-A", "KESİT B-B", "SECTION C-C")
        if let Some(pos) = upper.find("SECTION").or_else(|| upper.find("KESİT")).or_else(|| upper.find("KESIT")) {
            let rest = &upper[pos..];
            let mut label = "A-A".to_string();
            for word in rest.split_whitespace().skip(1).take(2) {
                let clean_word = word.trim_matches(|c: char| !c.is_alphanumeric() && c != '-');
                if clean_word.contains('-') || (clean_word.len() == 1 && clean_word.chars().all(|c| c.is_alphabetic())) {
                    label = clean_word.to_string();
                    break;
                }
            }
            let plane_name = format!("PLANE_SECTION_{}", label);
            return Self::new_section_view(sheet_number, label, plane_name, width_mm, height_mm);
        }

        // 2. Detay Görünüş Tespiti ("DETAIL B", "DETAY C")
        if let Some(pos) = upper.find("DETAIL").or_else(|| upper.find("DETAY")) {
            let rest = &upper[pos..];
            let mut label = "B".to_string();
            let mut scale = "2:1".to_string();
            for word in rest.split_whitespace().skip(1).take(3) {
                let clean = word.trim_matches(|c: char| !c.is_alphanumeric() && c != ':');
                if clean.contains(':') {
                    scale = clean.to_string();
                } else if clean.len() <= 2 && clean.chars().all(|c| c.is_alphabetic()) {
                    label = clean.to_string();
                }
            }
            return Self {
                sheet_number,
                sheet_type: SheetType::DetailView {
                    detail_label: label,
                    scale,
                },
                width_mm,
                height_mm,
                title_block: None,
                annotations: Vec::new(),
                balloons: Vec::new(),
            };
        }

        // 3. Genel Bakış (Overview)
        Self::new_overview(sheet_number, width_mm, height_mm)
    }

    pub fn extract_title_block(&mut self, text: &str) {
        let upper = text.to_uppercase();
        let mut part_name = None;
        let mut drawing_number = None;
        let mut revision = None;
        let mut material = None;
        let mut general_tolerance = None;
        let primary_datums = Vec::new();

        for line in upper.lines() {
            let trimmed = line.trim();
            if trimmed.contains("PART NO") || trimmed.contains("PARÇA NO") || trimmed.contains("DWG NO") {
                if let Some(idx) = trimmed.find(':') {
                    drawing_number = Some(trimmed[idx + 1..].trim().to_string());
                }
            } else if trimmed.contains("PART NAME") || trimmed.contains("PARÇA ADI") {
                if let Some(idx) = trimmed.find(':') {
                    part_name = Some(trimmed[idx + 1..].trim().to_string());
                }
            } else if trimmed.contains("REV") {
                if let Some(idx) = trimmed.find(':') {
                    revision = Some(trimmed[idx + 1..].trim().to_string());
                }
            } else if trimmed.contains("MATERIAL") || trimmed.contains("MALZEME") {
                if let Some(idx) = trimmed.find(':') {
                    material = Some(trimmed[idx + 1..].trim().to_string());
                }
            } else if trimmed.contains("ISO 2768") || trimmed.contains("TOLERANCE") {
                general_tolerance = Some(trimmed.to_string());
            }
        }

        if part_name.is_some()
            || drawing_number.is_some()
            || revision.is_some()
            || material.is_some()
            || general_tolerance.is_some()
        {
            self.title_block = Some(TitleBlock {
                part_name,
                drawing_number,
                revision,
                material,
                general_tolerance,
                primary_datums,
            });
        }
    }
}

/// Taranmış ve kaşeli çizimler için renk filtreleme ve eğrilik düzeltme ön-işlemcisi
pub struct DrawingImagePreprocessor;

impl DrawingImagePreprocessor {
    /// Kırmızı kalite kontrol / onay kaşesi rengini izole eden HSV filtresi kuralı
    /// Hue aralığı: [0..10] U [170..180] (Kırmızı tonları maskelenip beyaza dönüştürülür)
    pub fn is_red_stamp_pixel(h: f32, s: f32, v: f32) -> bool {
        let is_red_hue = (0.0..=10.0).contains(&h) || (170.0..=180.0).contains(&h);
        let has_saturation = s >= 0.35;
        let has_brightness = v >= 0.30;
        is_red_hue && has_saturation && has_brightness
    }

    /// Sayfa eğriliğini (Deskew angle) doğrular (-5.0° .. +5.0° sınırında kabul edilir)
    pub fn sanitize_deskew_angle(detected_angle_deg: f64) -> f64 {
        if detected_angle_deg.abs() > 45.0 {
            // Çok büyük dönmeler muhtemelen portre/manzara 90° rotasyonudur
            0.0
        } else {
            detected_angle_deg.clamp(-5.0, 5.0)
        }
    }

    /// RGB piksel dizisi üzerinde kırmızı kaşe temizleme ve Sauvola/adaptif ikileştirme simülasyonu
    /// Kırmızı kaşeler beyaza (255) dönüştürülür, çizim çizgileri siyah (0) yapılır.
    pub fn process_rgb_image(
        rgb_data: &[u8],
        width: usize,
        height: usize,
    ) -> Vec<u8> {
        let mut out = vec![255u8; width * height];
        for i in 0..(width * height) {
            let r = rgb_data.get(i * 3).copied().unwrap_or(255) as f32;
            let g = rgb_data.get(i * 3 + 1).copied().unwrap_or(255) as f32;
            let b = rgb_data.get(i * 3 + 2).copied().unwrap_or(255) as f32;

            // RGB -> HSV dönüşümü
            let max_c = r.max(g).max(b);
            let min_c = r.min(g).min(b);
            let delta = max_c - min_c;

            let h = if delta < 1e-4 {
                0.0
            } else if (max_c - r).abs() < 1e-4 {
                60.0 * (((g - b) / delta) % 6.0)
            } else if (max_c - g).abs() < 1e-4 {
                60.0 * (((b - r) / delta) + 2.0)
            } else {
                60.0 * (((r - g) / delta) + 4.0)
            };
            let h = if h < 0.0 { h + 360.0 } else { h };
            let s = if max_c < 1e-4 { 0.0 } else { delta / max_c };
            let v = max_c / 255.0;

            // Kırmızı kaşe pikseli ise beyaza çevir
            if Self::is_red_stamp_pixel(h, s, v) {
                out[i] = 255;
            } else {
                // Standart gri ton ve ikileştirme
                let gray = 0.299 * r + 0.587 * g + 0.114 * b;
                out[i] = if gray < 180.0 { 0 } else { 255 };
            }
        }
        out
    }
}
