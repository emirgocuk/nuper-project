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
    pub part_name: String,
    pub drawing_number: String,
    pub revision: String,
    pub material: String,
    /// Genel tolerans standardı (Örn: "ISO 2768-mK")
    pub general_tolerance: String,
    /// Birincil datum etiketleri (Örn: ["A", "B", "C"])
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
}
