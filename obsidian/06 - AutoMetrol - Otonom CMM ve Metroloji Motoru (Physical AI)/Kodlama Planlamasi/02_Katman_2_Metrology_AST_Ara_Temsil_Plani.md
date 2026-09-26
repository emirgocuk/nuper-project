# 🌳 Katman 2 Planı: Metroloji Ara Temsili / IR (`autometrol-ast`)

> **"CMM markalarından ve donanımdan tamamen izole; 'neyin, hangi datum zincirine göre ve hangi toleransla ölçüleceğini' standartlaştıran Nötr Teftiş AST (Intermediate Representation) planı."**

---

## 📌 1. Modülün Amacı ve Sorumluluğu

`autometrol-ast` kütüphanesi, sistemin **Middle-End / IR (Intermediate Representation)** omurgasıdır. Görevi:
1. Donanıma (prob tipi, makine markası) dair hiçbir detay İÇERMEMEK.
2. Parçanın metrolojik niyetini (Design Intent & GD&T) standart bir ağaç yapısında toplamak.
3. 3-2-1 Datum zincirinin matematiksel bütünlüğünü ve semantik tutarlılığını doğrulamak (Semantics Checker).
4. İlerleyen katmanların (Kinematik, Rota, Emitter) üzerinde analiz ve optimizasyon yapabileceği değişmez (immutable) bir veri modeli sunmak.

---

## 🌲 2. AST Düğüm Yapıları (AST Node Definitions)

```rust
// autometrol-ast/src/ast.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InspectionPlan {
    pub part_name: String,
    pub revision: String,
    pub datum_frame: DatumReferenceFrame,
    pub features: Vec<InspectionTarget>,
    pub serial_loop_count: Option<u32>, // Dizi/palet üretim adedi
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatumReferenceFrame {
    pub primary: DatumDefinition,   // Düzlem (Min 3 nokta - 3 DOF)
    pub secondary: Option<DatumDefinition>, // Eksen/Çizgi (Min 2 nokta - 2 DOF)
    pub tertiary: Option<DatumDefinition>,  // Nokta (Min 1 nokta - 1 DOF)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatumDefinition {
    pub label: String,            // "A", "B", "C"
    pub brep_feature_id: u32,     // Katman 1'deki BRepFeature kimliği
    pub min_touch_points: usize,  // 3, 2 veya 1
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InspectionTarget {
    pub id: u32,
    pub brep_feature_id: u32,
    pub feature_name: String,     // Örn: "DELIK_1_H7"
    pub tolerances: Vec<ToleranceConstraint>,
    pub fit_strategy: FitStrategy,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum FitStrategy {
    LeastSquaresGauss,          // Genel yüzeyler
    ChebyshevMaximumInscribed,  // H7 dişi delikler için zorunlu
    MinimumCircumscribed,       // Erkek miller için
    MinimumZone,                // Düzlemsellik ve silindiriklik
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToleranceConstraint {
    pub tolerance_type: ToleranceType,
    pub value_mm: f64,
    pub material_condition: MaterialCondition,
    pub reference_datums: Vec<String>, // ["A", "B"]
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ToleranceType {
    Position,         // ⨁
    Perpendicularity, // ⊥
    Parallelism,      // //
    Flatness,         // ⏥
    Cylindricity,     // ⌭
    CircularRunout,   // ↗
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum MaterialCondition {
    RFS, // Regardless of Feature Size (Varsayılan)
    MMC, // Maximum Material Condition (Ⓜ)
    LMC, // Least Material Condition (Ⓛ)
}
```

---

## 🛡️ 3. Semantik Doğrulama Geçişi (AST Validator Pass)

Tıpkı bir derleyicinin tip kontrolü (type check) yapması gibi, `autometrol-ast` derleme öncesi semantik kuralları denetler:

```rust
// autometrol-ast/src/validator.rs
pub struct SemanticDiagnostic {
    pub level: DiagnosticLevel, // Error, Warning
    pub message: String,
}

pub fn validate_inspection_plan(plan: &InspectionPlan) -> Result<(), Vec<SemanticDiagnostic>> {
    let mut diagnostics = Vec::new();

    // Kural 1: Sekonder datum tanımlıysa Primer datum zorunludur
    if plan.datum_frame.secondary.is_some() && plan.datum_frame.primary.brep_feature_id == 0 {
        diagnostics.push(SemanticDiagnostic {
            level: DiagnosticLevel::Error,
            message: "Primer Datum (A) tanımlanmadan Sekonder Datum (B) kurulamaz.".into(),
        });
    }

    // Kural 2: Tolerans referans verdiği datumun varlığını kontrol eder
    for target in &plan.features {
        for tol in &target.tolerances {
            for datum in &tol.reference_datums {
                if datum != &plan.datum_frame.primary.label 
                    && plan.datum_frame.secondary.as_ref().map_or(true, |s| &s.label != datum) {
                    diagnostics.push(SemanticDiagnostic {
                        level: DiagnosticLevel::Error,
                        message: format!("Hedef '{}' tanımsız Datum '{}' referansı içeriyor.", target.feature_name, datum),
                    });
                }
            }
        }
    }

    if diagnostics.iter().any(|d| d.level == DiagnosticLevel::Error) {
        Err(diagnostics)
    } else {
        Ok(())
    }
}
```

Bu semantik katman sayesinde hatalı bir ölçüm sırası veya tanımsız bir referans daha kinematik çözücüye varmadan **derleme aşamasında** engellenir.
