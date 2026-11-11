export interface DeviationAnalysisResult {
  deviations: Float32Array;
  colorsRgb: Float32Array;
  minDeviation: number;
  maxDeviation: number;
  meanDeviation: number;
  stdDeviation: number;
  pointCount: number;
}

export function deviationToRgb(deviation: number, maxTol: number): [number, number, number] {
  const safeTol = Math.max(1e-6, maxTol);
  const normVal = Math.max(-1.0, Math.min(1.0, deviation / safeTol));

  if (normVal < 0.0) {
    const t = normVal + 1.0;
    return [0.0, t, 1.0 - t];
  } else {
    const t = normVal;
    return [t, 1.0 - t, 0.0];
  }
}

export function computePlaneDeviations(
  pointsXyz: Float32Array,
  planeOrigin: [number, number, number],
  planeNormal: [number, number, number],
  toleranceBand: number
): DeviationAnalysisResult {
  const pointCount = Math.floor(pointsXyz.length / 3);
  const deviations = new Float32Array(pointCount);
  const colorsRgb = new Float32Array(pointCount * 3);

  const nLen = Math.hypot(planeNormal[0], planeNormal[1], planeNormal[2]) || 1.0;
  const nx = planeNormal[0] / nLen;
  const ny = planeNormal[1] / nLen;
  const nz = planeNormal[2] / nLen;

  let minDev = Infinity;
  let maxDev = -Infinity;
  let sumDev = 0;

  for (let i = 0; i < pointCount; i++) {
    const idx = i * 3;
    const px = pointsXyz[idx];
    const py = pointsXyz[idx + 1];
    const pz = pointsXyz[idx + 2];

    const dx = px - planeOrigin[0];
    const dy = py - planeOrigin[1];
    const dz = pz - planeOrigin[2];

    const signedDev = dx * nx + dy * ny + dz * nz;
    deviations[i] = signedDev;

    if (signedDev < minDev) minDev = signedDev;
    if (signedDev > maxDev) maxDev = signedDev;
    sumDev += signedDev;

    const [r, g, b] = deviationToRgb(signedDev, toleranceBand);
    colorsRgb[idx] = r;
    colorsRgb[idx + 1] = g;
    colorsRgb[idx + 2] = b;
  }

  const meanDev = pointCount > 0 ? sumDev / pointCount : 0;
  let varSum = 0;
  for (let i = 0; i < pointCount; i++) {
    const err = deviations[i] - meanDev;
    varSum += err * err;
  }
  const stdDev = pointCount > 0 ? Math.sqrt(varSum / pointCount) : 0;

  return {
    deviations,
    colorsRgb,
    minDeviation: pointCount > 0 ? minDev : 0,
    maxDeviation: pointCount > 0 ? maxDev : 0,
    meanDeviation: meanDev,
    stdDeviation: stdDev,
    pointCount,
  };
}
