//! # Multi-Body STEP Montaj İzolasyonu ve Geometrik Filtreleme (Doc 13 Bölüm 3)
//!
//! Tasarım ofislerinden gelen STEP dosyalarındaki çoklu katı gövdeleri (TopoDS_Solid)
//! hacimlerine göre sıralayarak Primary Workpiece (ana iş parçası) gövdesini izole eder;
//! cıvata, pim, presli burç gibi bağlantı elemanlarını ve mikro pah gürültülerini filtreler.

use serde::{Deserialize, Serialize};
use ortho_ast::GeometricFeature;

/// Bağımsız Katı Gövde (Solid Body)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SolidBody {
    pub id: usize,
    pub name: String,
    pub volume_mm3: f64,
    pub bounding_box_diag_mm: f64,
}

impl SolidBody {
    pub fn new(id: usize, name: impl Into<String>, volume_mm3: f64, diag: f64) -> Self {
        Self {
            id,
            name: name.into(),
            volume_mm3,
            bounding_box_diag_mm: diag,
        }
    }
}

/// Çok Gövdeli STEP Montaj Filtresi
pub struct MultiBodyFilter;

impl MultiBodyFilter {
    /// Katı gövdeleri hacimlerine göre azalan sırada sıralar ve en büyük gövdeyi Primary Workpiece seçer
    pub fn isolate_primary_workpiece(solids: &[SolidBody]) -> Option<(&SolidBody, Vec<&SolidBody>)> {
        if solids.is_empty() {
            return None;
        }

        let mut sorted: Vec<&SolidBody> = solids.iter().collect();
        sorted.sort_by(|a, b| b.volume_mm3.partial_cmp(&a.volume_mm3).unwrap_or(std::cmp::Ordering::Equal));

        let primary = sorted[0];
        let secondary = sorted[1..].to_vec();

        Some((primary, secondary))
    }

    /// Genişliği < min_feature_size_mm olan mikro pahları ve gürültü unsurlarını filtreler
    pub fn filter_geometric_noise(
        features: &[GeometricFeature],
        min_feature_size_mm: f64,
    ) -> Vec<GeometricFeature> {
        features
            .iter()
            .filter(|f| {
                // Alanı veya boyutu küçük mikro pahları/gürültüleri filtrele
                f.area >= min_feature_size_mm * min_feature_size_mm
            })
            .cloned()
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_multi_body_isolation() {
        let manifold = SolidBody::new(1, "VALVE_BLOCK_MAIN", 500000.0, 150.0);
        let bolt_1 = SolidBody::new(2, "M8_HEX_BOLT_01", 1200.0, 30.0);
        let bolt_2 = SolidBody::new(3, "M8_HEX_BOLT_02", 1200.0, 30.0);
        let bushing = SolidBody::new(4, "BRONZE_BUSHING_PRESS", 8500.0, 40.0);

        let solids = vec![bolt_1, manifold.clone(), bolt_2, bushing];
        let (primary, secondary) = MultiBodyFilter::isolate_primary_workpiece(&solids).expect("Birincil gövde bulunmalı");

        assert_eq!(primary.name, "VALVE_BLOCK_MAIN");
        assert_eq!(primary.volume_mm3, 500000.0);
        assert_eq!(secondary.len(), 3);
        assert_eq!(secondary[0].name, "BRONZE_BUSHING_PRESS"); // 2. en büyük
    }
}
