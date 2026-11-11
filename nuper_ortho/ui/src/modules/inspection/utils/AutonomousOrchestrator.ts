export interface AutonomousLoopConfigDto {
  targetCpk: number;
  maxIterations: number;
  toolBreakageLimitMm: number;
  nominal: number;
  usl: number;
  lsl: number;
}

export interface LoopIterationRecordDto {
  partIndex: number;
  measuredVal: number;
  deviationMm: number;
  appliedOffsetMm: number;
  currentCpk: number;
}

export interface AutonomousLoopResultDto {
  converged: boolean;
  totalIterations: number;
  initialCpk: number;
  finalCpk: number;
  records: LoopIterationRecordDto[];
  safetyAborted: boolean;
  abortReason?: string;
}

export class AutonomousOrchestrator {
  public static computeCpk(measurements: number[], usl: number, lsl: number): number {
    const n = measurements.length;
    if (n < 2) return 1.0;

    const mean = measurements.reduce((a, b) => a + b, 0) / n;
    const variance = measurements.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);

    if (stdDev < 1e-9) return 99.99;

    const cpu = (usl - mean) / (3 * stdDev);
    const cpl = (mean - lsl) / (3 * stdDev);
    return Math.min(cpu, cpl);
  }

  public static executeLoop(
    config: AutonomousLoopConfigDto,
    machineFn: (partIndex: number, cumulativeOffset: number) => number
  ): AutonomousLoopResultDto {
    const records: LoopIterationRecordDto[] = [];
    const measurements: number[] = [];
    let cumulativeOffset = 0.0;
    let initialCpk = 0.0;

    for (let partIdx = 1; partIdx <= config.maxIterations; partIdx++) {
      const measured = machineFn(partIdx, cumulativeOffset);
      const dev = measured - config.nominal;

      if (Math.abs(dev) > config.toolBreakageLimitMm) {
        records.push({
          partIndex: partIdx,
          measuredVal: measured,
          deviationMm: dev,
          appliedOffsetMm: 0.0,
          currentCpk: 0.0,
        });
        return {
          converged: false,
          totalIterations: partIdx,
          initialCpk,
          finalCpk: 0.0,
          records,
          safetyAborted: true,
          abortReason: `Kritik sapma: ${dev.toFixed(4)} mm eşiği (${config.toolBreakageLimitMm.toFixed(4)} mm) aştı`,
        };
      }

      measurements.push(measured);
      const windowStart = measurements.length > 5 ? measurements.length - 5 : 0;
      const currentCpk = this.computeCpk(measurements.slice(windowStart), config.usl, config.lsl);

      if (partIdx === 1) {
        const initialStd = (config.usl - config.lsl) / 6.0;
        const cpu = (config.usl - measured) / (3 * initialStd);
        const cpl = (measured - config.lsl) / (3 * initialStd);
        initialCpk = Math.min(cpu, cpl);
      }

      const nextComp = -(measured - config.nominal);
      cumulativeOffset += nextComp;

      records.push({
        partIndex: partIdx,
        measuredVal: measured,
        deviationMm: dev,
        appliedOffsetMm: nextComp,
        currentCpk: parseFloat(currentCpk.toFixed(3)),
      });

      if (partIdx >= 5 && currentCpk >= config.targetCpk) {
        return {
          converged: true,
          totalIterations: partIdx,
          initialCpk: parseFloat(initialCpk.toFixed(3)),
          finalCpk: parseFloat(currentCpk.toFixed(3)),
          records,
          safetyAborted: false,
        };
      }
    }

    const windowStart = measurements.length > 5 ? measurements.length - 5 : 0;
    const finalCpk = this.computeCpk(measurements.slice(windowStart), config.usl, config.lsl);
    return {
      converged: finalCpk >= config.targetCpk,
      totalIterations: records.length,
      initialCpk: parseFloat(initialCpk.toFixed(3)),
      finalCpk: parseFloat(finalCpk.toFixed(3)),
      records,
      safetyAborted: false,
    };
  }
}
