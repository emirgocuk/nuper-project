use glam::DVec3;
use serde::{Deserialize, Serialize};

use crate::threads::ThreadSpecification;

/// Kademeli Delikler (Fatura + Havşa + Delik) ve Bileşik Unsur Ağacı
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CompoundHoleFeature {
    pub id: u32,
    pub name: String,
    /// Ana delik gövdesinin GeometricFeature ID'si
    pub main_bore_feature_id: u32,
    /// Varsa giriş faturasının (Counterbore) GeometricFeature ID'si
    pub counterbore_feature_id: Option<u32>,
    /// Varsa giriş havşa konisinin (Countersink) GeometricFeature ID'si
    pub countersink_feature_id: Option<u32>,
    /// Varsa vida dişi bilgisi
    pub thread_info: Option<ThreadSpecification>,
    /// Ortak eksen birim vektörü
    pub common_axis: DVec3,
    /// Parçanın dış yüzeyindeki giriş noktası
    pub entry_point: DVec3,
}

impl CompoundHoleFeature {
    pub fn new_simple_hole(
        id: u32,
        name: impl Into<String>,
        main_bore_feature_id: u32,
        axis: DVec3,
        entry: DVec3,
    ) -> Self {
        Self {
            id,
            name: name.into(),
            main_bore_feature_id,
            counterbore_feature_id: None,
            countersink_feature_id: None,
            thread_info: None,
            common_axis: axis.normalize(),
            entry_point: entry,
        }
    }
}
