use glam::DVec3;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ThermalError {
    #[error("Termal alan hesabı için en az bir sıcaklık sensörü tanımlanmalıdır")]
    NoSensorsDefined,

    #[error("Geçersiz integrasyon adımı sayısı: {0}")]
    InvalidStepCount(usize),
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum WorkpieceMaterialType {
    Aluminum,
    Steel,
    Titanium,
    Invar,
    CarbonFiber,
}

impl WorkpieceMaterialType {
    pub fn cte(&self) -> f64 {
        match self {
            WorkpieceMaterialType::Aluminum => 23.1e-6,
            WorkpieceMaterialType::Steel => 11.5e-6,
            WorkpieceMaterialType::Titanium => 8.6e-6,
            WorkpieceMaterialType::Invar => 1.2e-6,
            WorkpieceMaterialType::CarbonFiber => -0.5e-6,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TemperatureSensor {
    pub name: String,
    pub position: DVec3,
    pub temperature_c: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ThermalField3D {
    pub sensors: Vec<TemperatureSensor>,
    pub epsilon: f64,
    pub reference_temp_c: f64,
}

impl Default for ThermalField3D {
    fn default() -> Self {
        Self::new(20.0)
    }
}

impl ThermalField3D {
    pub fn new(reference_temp_c: f64) -> Self {
        Self {
            sensors: Vec::new(),
            epsilon: 1.0,
            reference_temp_c,
        }
    }

    pub fn add_sensor(&mut self, name: impl Into<String>, position: DVec3, temperature_c: f64) {
        self.sensors.push(TemperatureSensor {
            name: name.into(),
            position,
            temperature_c,
        });
    }

    pub fn interpolate_temperature(&self, point: DVec3) -> Result<f64, ThermalError> {
        if self.sensors.is_empty() {
            return Err(ThermalError::NoSensorsDefined);
        }

        let mut weight_sum = 0.0;
        let mut weighted_temp_sum = 0.0;

        for sensor in &self.sensors {
            let dist_sq = (point - sensor.position).length_squared();
            if dist_sq < 1e-6 {
                return Ok(sensor.temperature_c);
            }
            let weight = 1.0 / (dist_sq + self.epsilon * self.epsilon);
            weight_sum += weight;
            weighted_temp_sum += weight * sensor.temperature_c;
        }

        if weight_sum.abs() < 1e-12 {
            return Ok(self.reference_temp_c);
        }

        Ok(weighted_temp_sum / weight_sum)
    }

    pub fn compute_ray_expansion(
        &self,
        origin: DVec3,
        target: DVec3,
        material: WorkpieceMaterialType,
        steps: usize,
    ) -> Result<DVec3, ThermalError> {
        if steps == 0 {
            return Err(ThermalError::InvalidStepCount(0));
        }

        let alpha = material.cte();
        let ray_vec = target - origin;
        let total_dist = ray_vec.length();

        if total_dist < 1e-9 {
            return Ok(DVec3::ZERO);
        }

        let dir = ray_vec / total_dist;
        let step_len = total_dist / (steps as f64);
        let mut total_expansion_mm = 0.0;

        for i in 0..steps {
            let s_mid = (i as f64 + 0.5) * step_len;
            let sample_pt = origin + dir * s_mid;
            let temp = self.interpolate_temperature(sample_pt)?;
            let delta_t = temp - self.reference_temp_c;
            total_expansion_mm += alpha * delta_t * step_len;
        }

        Ok(dir * total_expansion_mm)
    }

    pub fn compensate_measured_point(
        &self,
        origin: DVec3,
        measured_pt: DVec3,
        material: WorkpieceMaterialType,
        steps: usize,
    ) -> Result<DVec3, ThermalError> {
        let expansion = self.compute_ray_expansion(origin, measured_pt, material, steps)?;
        Ok(measured_pt - expansion)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_thermal_field_exact_sensor_hit() {
        let mut field = ThermalField3D::new(20.0);
        field.add_sensor("S1", DVec3::new(0.0, 0.0, 0.0), 18.5);
        field.add_sensor("S2", DVec3::new(100.0, 0.0, 0.0), 24.5);

        let t1 = field.interpolate_temperature(DVec3::new(0.0, 0.0, 0.0)).unwrap();
        assert!((t1 - 18.5).abs() < 1e-4);

        let t_mid = field.interpolate_temperature(DVec3::new(50.0, 0.0, 0.0)).unwrap();
        assert!((t_mid - 21.5).abs() < 0.1);
    }

    #[test]
    fn test_1500mm_aluminum_beam_gradient_compensation() {
        let mut field = ThermalField3D::new(20.0);
        field.add_sensor("GRANITE_BOTTOM_START", DVec3::new(0.0, 0.0, 0.0), 18.0);
        field.add_sensor("GRANITE_BOTTOM_END", DVec3::new(1500.0, 0.0, 0.0), 18.0);
        field.add_sensor("SHOP_TOP_START", DVec3::new(0.0, 0.0, 200.0), 24.0);
        field.add_sensor("SHOP_TOP_END", DVec3::new(1500.0, 0.0, 200.0), 24.0);

        let origin = DVec3::new(0.0, 0.0, 100.0);
        let nominal_target = DVec3::new(1500.0, 0.0, 100.0);

        let expansion = field
            .compute_ray_expansion(origin, nominal_target, WorkpieceMaterialType::Aluminum, 100)
            .unwrap();

        assert!(expansion.x > 0.030);
        assert!(expansion.x < 0.040);

        let measured_distorted = nominal_target + expansion;
        let compensated = field
            .compensate_measured_point(origin, measured_distorted, WorkpieceMaterialType::Aluminum, 100)
            .unwrap();

        let residual_error_mm = (compensated - nominal_target).length();
        assert!(residual_error_mm < 0.0015);
    }

    #[test]
    fn test_invar_minimal_expansion() {
        let mut field = ThermalField3D::new(20.0);
        field.add_sensor("HOT", DVec3::new(0.0, 0.0, 0.0), 35.0);

        let origin = DVec3::ZERO;
        let target = DVec3::new(1000.0, 0.0, 0.0);

        let invar_exp = field
            .compute_ray_expansion(origin, target, WorkpieceMaterialType::Invar, 50)
            .unwrap();

        let alu_exp = field
            .compute_ray_expansion(origin, target, WorkpieceMaterialType::Aluminum, 50)
            .unwrap();

        assert!(invar_exp.x < alu_exp.x * 0.1);
    }
}
