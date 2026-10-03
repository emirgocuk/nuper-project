use glam::DVec3;
use serde::{Deserialize, Serialize};

use crate::compound::CompoundHoleFeature;
use crate::composite_gdandt::CompositeTolerance;
use crate::datum::DatumReferenceFrame;
use crate::error::AstError;
use crate::feature::GeometricFeature;
use crate::tolerance::ToleranceConstraint;

/// Teftiş Planı Uzunluk Birimi
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum LengthUnit {
    Millimeters,
    Inches,
}

/// Nuper Ortho Nötr Teftiş Planı (Intermediate Representation - AST)
/// Donanım ve yazılımdan bağımsız, tam geometrik ve metrolojik veri sözleşmesi
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct InspectionPlan {
    /// Parça veya operasyon adı (örneğin "VALVE_BODY_OP10")
    pub part_name: String,
    /// Kaynak STEP dosyasının adı
    pub cad_source_file: String,
    /// Ölçü birimi
    pub unit: LengthUnit,
    /// Parça Koordinat Sistemi (PCS) Datum Referans Çerçevesi
    pub datum_frame: DatumReferenceFrame,
    /// B-Rep modelinden çıkarılan analitik unsurlar listesi
    pub features: Vec<GeometricFeature>,
    /// Kademeli ve vida dişli bileşik delik grupları
    pub compound_holes: Vec<CompoundHoleFeature>,
    /// Geometrik tolerans kısıtları (Feature Control Frames)
    pub tolerances: Vec<ToleranceConstraint>,
    /// ASME Y14.5 Bileşik tolerans kısıtları (Composite FCFs - PLTZF / FRTZF)
    #[serde(default)]
    pub composite_tolerances: Vec<CompositeTolerance>,
    /// Parçanın dış sınır kutusu minimum köşe [X, Y, Z] (mm)
    pub bounding_box_min: DVec3,
    /// Parçanın dış sınır kutusu maksimum köşe [X, Y, Z] (mm)
    pub bounding_box_max: DVec3,
}

impl InspectionPlan {
    /// Yeni ve boş bir Teftiş Planı oluşturur
    pub fn new(
        part_name: impl Into<String>,
        cad_source_file: impl Into<String>,
        datum_frame: DatumReferenceFrame,
    ) -> Self {
        Self {
            part_name: part_name.into(),
            cad_source_file: cad_source_file.into(),
            unit: LengthUnit::Millimeters,
            datum_frame,
            features: Vec::new(),
            compound_holes: Vec::new(),
            tolerances: Vec::new(),
            composite_tolerances: Vec::new(),
            bounding_box_min: DVec3::ZERO,
            bounding_box_max: DVec3::ZERO,
        }
    }

    /// Yeni bir geometrik unsur ekler
    pub fn add_feature(&mut self, feature: GeometricFeature) {
        self.features.push(feature);
    }

    /// AST ağacının tüm tutarlılık kurallarını doğrular
    pub fn validate(&self) -> Result<(), AstError> {
        // 1. Tüm unsurların fiziksel geçerliliğini denetle
        for feature in &self.features {
            feature.validate()?;
        }

        // 2. Datum çerçevesinin 6-DoF kilitlenmesini doğrula
        self.datum_frame.validate(&self.features)?;

        // 3. Toleransların var olan unsurlara bağlı olduğunu doğrula
        for tol in &self.tolerances {
            if !self.features.iter().any(|f| f.id == tol.feature_id) {
                return Err(AstError::FeatureNotFound {
                    feature_id: tol.feature_id,
                });
            }
        }

        // 4. ASME Y14.5 Bileşik toleransları doğrula
        for c_tol in &self.composite_tolerances {
            c_tol.validate(&self.features)?;
        }

        Ok(())
    }

    /// JSON formatına serileştirir
    pub fn to_json(&self) -> Result<String, AstError> {
        serde_json::to_string_pretty(self)
            .map_err(|e| AstError::SerializationError(e.to_string()))
    }

    /// JSON formatından ayrıştırır
    pub fn from_json(json: &str) -> Result<Self, AstError> {
        let plan: Self = serde_json::from_str(json)
            .map_err(|e| AstError::SerializationError(e.to_string()))?;
        plan.validate()?;
        Ok(plan)
    }

    /// Hızlı binary (Bincode) serileştirme
    pub fn to_binary(&self) -> Result<Vec<u8>, AstError> {
        bincode::serialize(self)
            .map_err(|e| AstError::SerializationError(e.to_string()))
    }

    /// Binary (Bincode) tamponundan ayrıştırır
    pub fn from_binary(bytes: &[u8]) -> Result<Self, AstError> {
        let plan: Self = bincode::deserialize(bytes)
            .map_err(|e| AstError::SerializationError(e.to_string()))?;
        plan.validate()?;
        Ok(plan)
    }

    /// Parçanın Z_up duruşunda erişilemeyen alt taban unsurlarını OP10 ve OP20 olarak ikiye böler (Doc 08)
    pub fn split_into_multi_setup(&self, table_normal: DVec3) -> MultiSetupPlan {
        let normalized_table = table_normal.normalize();

        let mut op10_features = Vec::new();
        let mut op20_features = Vec::new();

        for feat in &self.features {
            // Tabla yüzeyine doğru bakan (N . (-table_normal) > 0.70) veya tabanla çakışan unsurlar OP20'ye
            let dot = feat.normal_vector.dot(normalized_table);
            if dot < -0.70 {
                op20_features.push(feat.clone());
            } else {
                op10_features.push(feat.clone());
            }
        }

        let op10_feat_ids: Vec<u32> = op10_features.iter().map(|f| f.id).collect();
        let op20_feat_ids: Vec<u32> = op20_features.iter().map(|f| f.id).collect();

        let op10_tolerances: Vec<ToleranceConstraint> = self
            .tolerances
            .iter()
            .filter(|t| op10_feat_ids.contains(&t.feature_id))
            .cloned()
            .collect();

        let op20_tolerances: Vec<ToleranceConstraint> = self
            .tolerances
            .iter()
            .filter(|t| op20_feat_ids.contains(&t.feature_id))
            .cloned()
            .collect();

        let op10 = Self {
            part_name: format!("{}_OP10", self.part_name),
            cad_source_file: self.cad_source_file.clone(),
            unit: self.unit,
            datum_frame: self.datum_frame.clone(),
            features: op10_features,
            compound_holes: self.compound_holes.clone(),
            tolerances: op10_tolerances,
            composite_tolerances: self.composite_tolerances.clone(),
            bounding_box_min: self.bounding_box_min,
            bounding_box_max: self.bounding_box_max,
        };
        // OP10 geçerlilik kontrolü
        let _ = op10.validate();

        let (op20, setup_instructions) = if !op20_features.is_empty() {
            // OP20 için parça 180 derece ters çevrilir (Z ekseni tersine döner)
            let op20_plan = Self {
                part_name: format!("{}_OP20", self.part_name),
                cad_source_file: self.cad_source_file.clone(),
                unit: self.unit,
                datum_frame: DatumReferenceFrame::new_3_2_1(
                    "PCS_OP20_FLIPPED",
                    op20_features.first().map(|f| f.id).unwrap_or(1),
                    op20_features.get(1).map(|f| f.id).unwrap_or(1),
                    op20_features.get(2).map(|f| f.id).unwrap_or(1),
                ),
                features: op20_features,
                compound_holes: Vec::new(),
                tolerances: op20_tolerances,
                composite_tolerances: Vec::new(),
                bounding_box_min: self.bounding_box_min,
                bounding_box_max: self.bounding_box_max,
            };

            let instructions = vec![
                format!("1. [OP10] Parçayı standart duruşta (Z-Up) bağlayın ve {} ana unsuru ölçün.", op10_feat_ids.len()),
                "2. [FLIP] OP10 tamamlandıktan sonra parçayı fikstürden söküp 180° ters çevirin.".to_string(),
                format!("3. [OP20] Alt taban ve ters faturalarda kalan {} unsuru ölçmek için kaba sıfır alın.", op20_feat_ids.len()),
            ];

            (Some(op20_plan), instructions)
        } else {
            let instructions = vec![
                format!("Tüm {} unsur tek bağlamada (OP10) ölçülebilir; parça çevirme gerekmez.", op10_feat_ids.len())
            ];
            (None, instructions)
        };

        MultiSetupPlan {
            op10,
            op20,
            setup_instructions,
        }
    }
}

/// Çoklu Bağlama Teftiş Planı (Multi-Setup Routing - Doc 08 & Doc 11)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MultiSetupPlan {
    /// Birincil bağlama: OP10 (Üst yüzeyler, yan delikler, normal duruş)
    pub op10: InspectionPlan,
    /// İkincil bağlama: OP20 (Ters çevrilmiş alt taban unsurları - varsa)
    pub op20: Option<InspectionPlan>,
    /// Çevirme / fikstürleme operatör yönergeleri
    pub setup_instructions: Vec<String>,
}

/// Hibrit Metroloji Sensör Tipi (Doc 11 Bölüm 2)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SensorType {
    /// Dokunmatik Tetiklemeli Prob (Renishaw TP20 vb.)
    TactileTouchTrigger {
        stylus_diameter: f64,
        stem_length: f64,
    },
    /// Sürekli Tarama Probu (Renishaw SP25M vb.)
    TactileContinuousScanning {
        stylus_diameter: f64,
        scan_speed_mms: f64,
    },
    /// Optik Lazer Çizgi Tarayıcı (Hexagon RS6 / Zeiss LineScan vb.)
    OpticalLaserLine {
        stripe_width_mm: f64,
        standoff_distance_mm: f64,
        point_density_pts_per_mm: f64,
    },
}

impl Default for SensorType {
    fn default() -> Self {
        Self::TactileTouchTrigger {
            stylus_diameter: 2.0,
            stem_length: 20.0,
        }
    }
}

/// Döküm/Dövme Talaş Payı ve Emniyet Zarfı Modu (Doc 13 Bölüm 1)
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum StockAllowanceMode {
    /// Hassas işlenmiş bitmiş parça (Standart paylar)
    FinishMachined,
    /// Kaba döküm veya dövme parça (Genişletilmiş arama ve yaklaşma zarfı)
    RawStockCasting {
        extra_stock_mm: f64,
        search_distance_mm: f64,
        approach_distance_mm: f64,
        retract_distance_mm: f64,
    },
}

impl Default for StockAllowanceMode {
    fn default() -> Self {
        Self::FinishMachined
    }
}

impl StockAllowanceMode {
    pub fn raw_casting_default(extra_stock: f64) -> Self {
        Self::RawStockCasting {
            extra_stock_mm: extra_stock,
            search_distance_mm: (extra_stock + 7.5).max(10.0),
            approach_distance_mm: (extra_stock + 9.5).max(12.0),
            retract_distance_mm: (extra_stock + 5.5).max(8.0),
        }
    }

    pub fn is_casting(&self) -> bool {
        matches!(self, Self::RawStockCasting { .. })
    }
}

/// Parça Malzemesi ve Prob Uyumluluk Yönetimi (Doc 13 Bölüm 2)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum WorkpieceMaterial {
    Steel,
    CastIron,
    Aluminum6000,
    Aluminum7000,
    Titanium,
    Inconel,
}

impl WorkpieceMaterial {
    /// Yakut bilye (Al2O3) kimyasal yapışma / sıvanma (pick-up) riski var mı?
    pub fn ruby_ball_adhesion_risk(&self) -> bool {
        matches!(self, Self::Aluminum6000 | Self::Aluminum7000)
    }

    /// Tavsiye edilen prob ucu malzemesi
    pub fn recommended_stylus_material(&self) -> &'static str {
        if self.ruby_ball_adhesion_risk() {
            "Silikon Nitrür (Si3N4) - Alüminyum sıvanmasını önler"
        } else {
            "Sentetik Yakut (Al2O3) - Yüksek aşınma direnci"
        }
    }
}
