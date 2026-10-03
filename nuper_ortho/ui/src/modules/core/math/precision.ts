/**
 * Nuper Ortho — Küresel Sayısal Hassasiyet ve EPSILON Modülü
 * Kural 5 gereği: Float kıyaslamalarında doğrudan '==' kullanılamaz.
 */

export const PRECISION = {
  EPSILON_LINEAR: 1e-4,  // 0.1 mikron (0.0001 mm)
  EPSILON_ANGULAR: 1e-3, // ~0.057 derece (radyan)
} as const;

export function isEqual(a: number, b: number, eps = PRECISION.EPSILON_LINEAR): boolean {
  return Math.abs(a - b) <= eps;
}

export function isZero(a: number, eps = PRECISION.EPSILON_LINEAR): boolean {
  return Math.abs(a) <= eps;
}

export function isVectorEqual(
  v1: [number, number, number],
  v2: [number, number, number],
  eps = PRECISION.EPSILON_LINEAR
): boolean {
  return (
    Math.abs(v1[0] - v2[0]) <= eps &&
    Math.abs(v1[1] - v2[1]) <= eps &&
    Math.abs(v1[2] - v2[2]) <= eps
  );
}
