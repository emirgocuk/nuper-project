use glam::DVec3;
use serde::{Deserialize, Serialize};

/// Dinamik Emniyet Zarfı (Clearance Box)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ClearanceBox {
    pub min: DVec3,
    pub max: DVec3,
    /// Parça tepesinden yukarıdaki güvenli intikal seviyesi: Z_max + 50.0 mm
    pub z_clearance: f64,
    /// Temastan sonra yüzey normali yönünde geri çekilme: 5.0 mm
    pub retract_distance: f64,
}

impl ClearanceBox {
    pub fn from_bounding_box(min: DVec3, max: DVec3) -> Self {
        let z_clearance = max.z + 50.0;
        let retract_distance = 5.0;

        let margin = DVec3::new(30.0, 30.0, 0.0);
        Self {
            min: min - margin,
            max: DVec3::new(max.x + margin.x, max.y + margin.y, z_clearance),
            z_clearance,
            retract_distance,
        }
    }
}

/// Çelik pabuç ve fikstürler için 3D Yasaklı Bölge (Keep-Out Zone)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct KeepOutZone {
    pub name: String,
    pub min: DVec3,
    pub max: DVec3,
}

impl KeepOutZone {
    pub fn new(name: impl Into<String>, min: DVec3, max: DVec3) -> Self {
        Self {
            name: name.into(),
            min,
            max,
        }
    }

    /// Bir noktanın yasaklı alan içinde olup olmadığını test eder
    pub fn contains_point(&self, pt: DVec3) -> bool {
        pt.x >= self.min.x
            && pt.x <= self.max.x
            && pt.y >= self.min.y
            && pt.y <= self.max.y
            && pt.z >= self.min.z
            && pt.z <= self.max.z
    }
}
