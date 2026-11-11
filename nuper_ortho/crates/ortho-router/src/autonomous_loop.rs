use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AutonomousLoopConfig {
    pub target_cpk: f64,
    pub max_iterations: usize,
    pub tool_breakage_limit_mm: f64,
    pub nominal: f64,
    pub usl: f64,
    pub lsl: f64,
}

impl Default for AutonomousLoopConfig {
    fn default() -> Self {
        Self {
            target_cpk: 1.67,
            max_iterations: 10,
            tool_breakage_limit_mm: 0.100,
            nominal: 20.000,
            usl: 20.030,
            lsl: 19.970,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct LoopIterationRecord {
    pub part_index: usize,
    pub measured_val: f64,
    pub deviation_mm: f64,
    pub applied_offset_mm: f64,
    pub current_cpk: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AutonomousLoopResult {
    pub converged: bool,
    pub total_iterations: usize,
    pub initial_cpk: f64,
    pub final_cpk: f64,
    pub records: Vec<LoopIterationRecord>,
    pub safety_aborted: bool,
    pub abort_reason: Option<String>,
}

pub struct AutonomousQualityOrchestrator;

impl AutonomousQualityOrchestrator {
    pub fn compute_cpk(measurements: &[f64], usl: f64, lsl: f64) -> f64 {
        let n = measurements.len();
        if n < 2 {
            return 1.0;
        }

        let mean = measurements.iter().sum::<f64>() / (n as f64);
        let variance = measurements
            .iter()
            .map(|&x| (x - mean).powi(2))
            .sum::<f64>()
            / ((n - 1) as f64);
        let std_dev = variance.sqrt();

        if std_dev < 1e-9 {
            return 99.99;
        }

        let cpu = (usl - mean) / (3.0 * std_dev);
        let cpl = (mean - lsl) / (3.0 * std_dev);
        cpu.min(cpl)
    }

    pub fn run_autonomous_loop<F>(
        config: &AutonomousLoopConfig,
        mut simulate_machining_and_measuring: F,
    ) -> AutonomousLoopResult
    where
        F: FnMut(usize, f64) -> f64,
    {
        let mut records = Vec::new();
        let mut measurements = Vec::new();
        let mut cumulative_offset = 0.0;
        let mut initial_cpk = 0.0;
        let mut safety_aborted = false;
        let mut abort_reason = None;

        for part_idx in 1..=config.max_iterations {
            let measured = simulate_machining_and_measuring(part_idx, cumulative_offset);
            let dev = measured - config.nominal;

            if dev.abs() > config.tool_breakage_limit_mm {
                safety_aborted = true;
                abort_reason = Some(format!(
                    "Kritik sapma: {:.4} mm eşiği ({:.4} mm) aştı, takım kırılmış olabilir",
                    dev, config.tool_breakage_limit_mm
                ));
                records.push(LoopIterationRecord {
                    part_index: part_idx,
                    measured_val: measured,
                    deviation_mm: dev,
                    applied_offset_mm: 0.0,
                    current_cpk: 0.0,
                });
                break;
            }

            measurements.push(measured);
            let window_start = if measurements.len() > 5 {
                measurements.len() - 5
            } else {
                0
            };
            let current_cpk = Self::compute_cpk(&measurements[window_start..], config.usl, config.lsl);

            if part_idx == 1 {
                let initial_pseudo_std = (config.usl - config.lsl) / 6.0;
                let pseudo_cpu = (config.usl - measured) / (3.0 * initial_pseudo_std);
                let pseudo_cpl = (measured - config.lsl) / (3.0 * initial_pseudo_std);
                initial_cpk = pseudo_cpu.min(pseudo_cpl);
            }

            let next_compensation = -(measured - config.nominal);
            cumulative_offset += next_compensation;

            records.push(LoopIterationRecord {
                part_index: part_idx,
                measured_val: measured,
                deviation_mm: dev,
                applied_offset_mm: next_compensation,
                current_cpk,
            });

            if part_idx >= 5 && current_cpk >= config.target_cpk {
                return AutonomousLoopResult {
                    converged: true,
                    total_iterations: part_idx,
                    initial_cpk,
                    final_cpk: current_cpk,
                    records,
                    safety_aborted: false,
                    abort_reason: None,
                };
            }
        }

        let window_start = if measurements.len() > 5 {
            measurements.len() - 5
        } else {
            0
        };
        let final_cpk = Self::compute_cpk(&measurements[window_start..], config.usl, config.lsl);
        let converged = !safety_aborted && final_cpk >= config.target_cpk;

        AutonomousLoopResult {
            converged,
            total_iterations: records.len(),
            initial_cpk,
            final_cpk,
            records,
            safety_aborted,
            abort_reason,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_autonomous_loop_convergence_above_cpk_target() {
        let config = AutonomousLoopConfig {
            target_cpk: 1.67,
            max_iterations: 8,
            tool_breakage_limit_mm: 0.100,
            nominal: 20.000,
            usl: 20.030,
            lsl: 19.970,
        };

        let result = AutonomousQualityOrchestrator::run_autonomous_loop(
            &config,
            |part_idx, cum_offset| {
                if part_idx == 1 {
                    20.022
                } else {
                    let machine_bias = 0.022;
                    let residual = machine_bias + cum_offset;
                    20.000 + residual * 0.15 + (part_idx as f64) * 0.0002
                }
            },
        );

        assert!(result.converged);
        assert!(result.total_iterations >= 5);
        assert!(result.final_cpk >= 1.67);
        assert!(!result.safety_aborted);
    }

    #[test]
    fn test_autonomous_loop_tool_breakage_safety_abort() {
        let config = AutonomousLoopConfig {
            target_cpk: 1.67,
            max_iterations: 5,
            tool_breakage_limit_mm: 0.080,
            nominal: 20.000,
            usl: 20.030,
            lsl: 19.970,
        };

        let result = AutonomousQualityOrchestrator::run_autonomous_loop(
            &config,
            |part_idx, _| {
                if part_idx == 1 {
                    20.005
                } else {
                    20.150
                }
            },
        );

        assert!(!result.converged);
        assert!(result.safety_aborted);
        assert!(result.abort_reason.is_some());
    }
}
