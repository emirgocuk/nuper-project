/**
 * Nuper Ortho — Geometri ve PCA Web Worker'ı
 * Kural 3 gereği: 16 ms'den uzun süren ağır geometrik hesaplamalar
 * UI ana iş parçacığından koparılır ve bu arka plan worker'ında yürütülür.
 */

export interface WorkerMessagePayload {
  action: 'COMPUTE_PCA' | 'TRIANGULATE_EARCLIP';
  points: Float64Array;
}

export interface WorkerResponsePayload {
  action: string;
  result: Float64Array;
  executionTimeMs: number;
}

// Global worker event listener
self.onmessage = (event: MessageEvent<WorkerMessagePayload>) => {
  const startTime = performance.now();
  const { action, points } = event.data;

  if (action === 'COMPUTE_PCA') {
    const result = computeJacobiPCA(points);
    const executionTimeMs = performance.now() - startTime;
    const response: WorkerResponsePayload = {
      action,
      result,
      executionTimeMs
    };
    // Zero-copy transfer using Transferable ArrayBuffer
    (self as unknown as Worker).postMessage(response, [result.buffer]);
  } else {
    // Default pass-through
    const result = new Float64Array(points);
    const executionTimeMs = performance.now() - startTime;
    (self as unknown as Worker).postMessage({ action, result, executionTimeMs }, [result.buffer]);
  }
};

/**
 * 3D Noktalar üzerinden ağırlık merkezi (centroid), kovaryans matrisi
 * ve ana boyutsal eksenleri (Jacobi Eigensolver) hesaplar.
 */
function computeJacobiPCA(points: Float64Array): Float64Array {
  const n = points.length / 3;
  if (n < 3) {
    // Yetersiz nokta durumunda birim matris dön
    return new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }

  // 1. Centroid hesabı
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < points.length; i += 3) {
    cx += points[i];
    cy += points[i + 1];
    cz += points[i + 2];
  }
  cx /= n; cy /= n; cz /= n;

  // 2. 3x3 Kovaryans Matrisi
  let cxx = 0, cxy = 0, cxz = 0, cyy = 0, cyz = 0, czz = 0;
  for (let i = 0; i < points.length; i += 3) {
    const dx = points[i] - cx;
    const dy = points[i + 1] - cy;
    const dz = points[i + 2] - cz;

    cxx += dx * dx;
    cxy += dx * dy;
    cxz += dx * dz;
    cyy += dy * dy;
    cyz += dy * dz;
    czz += dz * dz;
  }
  cxx /= n; cxy /= n; cxz /= n;
  cyy /= n; cyz /= n; czz /= n;

  // 3. Jacobi Rotasyonları ile 3x3 Simetrik Matris Özvektör Hesabı
  const a = [
    [cxx, cxy, cxz],
    [cxy, cyy, cyz],
    [cxz, cyz, czz]
  ];
  const v = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  for (let iter = 0; iter < 20; iter++) {
    let maxOffDiag = 0;
    let p = 0, q = 1;
    for (let r = 0; r < 3; r++) {
      for (let c = r + 1; c < 3; c++) {
        const val = Math.abs(a[r][c]);
        if (val > maxOffDiag) {
          maxOffDiag = val;
          p = r;
          q = c;
        }
      }
    }

    if (maxOffDiag < 1e-9) break;

    const diff = a[q][q] - a[p][p];
    let t: number;
    if (Math.abs(diff) < 1e-12) {
      t = 1.0;
    } else {
      const phi = diff / (2.0 * a[p][q]);
      t = 1.0 / (Math.abs(phi) + Math.sqrt(phi * phi + 1.0));
      if (phi < 0) t = -t;
    }

    const c = 1.0 / Math.sqrt(t * t + 1.0);
    const s = t * c;
    const tau = s / (1.0 + c);

    const app = a[p][p];
    const aqq = a[q][q];
    const apq = a[p][q];

    a[p][p] = app - t * apq;
    a[q][q] = aqq + t * apq;
    a[p][q] = 0;

    for (let r = 0; r < 3; r++) {
      if (r !== p && r !== q) {
        const arp = a[r][p];
        const arq = a[r][q];
        a[r][p] = arp - s * (arq + tau * arp);
        a[p][r] = a[r][p];
        a[r][q] = arq + s * (arp - tau * arq);
        a[q][r] = a[r][q];
      }
      const vrp = v[r][p];
      const vrq = v[r][q];
      v[r][p] = vrp - s * (vrq + tau * vrp);
      v[r][q] = vrq + s * (vrp - tau * vrq);
    }
  }

  // Çıktı: 3x3 Özvektör matrisi düzleştirilmiş Float64Array
  return new Float64Array([
    v[0][0], v[0][1], v[0][2],
    v[1][0], v[1][1], v[1][2],
    v[2][0], v[2][1], v[2][2]
  ]);
}
