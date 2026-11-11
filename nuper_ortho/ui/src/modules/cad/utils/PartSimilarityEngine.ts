export interface PartGeometrySummary {
  bbox_x?: number;
  bbox_y?: number;
  bbox_z?: number;
  hole_count?: number;
  cylinder_ratio?: number;
  min_tolerance?: number;
  surface_area?: number;
}

export interface PreviousSetupRecord {
  part_id: string;
  part_name: string;
  vector: number[];
  op_fixtures: Record<string, unknown>;
  ph10_angles: Array<[number, number]>;
  strategy?: Record<string, unknown>;
}

export interface SimilarPartMatch {
  part_id: string;
  part_name: string;
  similarity: number;
  similarity_pct: number;
  vector: number[];
  op_fixtures: Record<string, unknown>;
  ph10_angles: Array<[number, number]>;
  strategy?: Record<string, unknown>;
}

export const DEFAULT_SCALES: readonly number[] = [100.0, 100.0, 100.0, 10.0, 1.0, 0.1, 10000.0];
export const DEFAULT_WEIGHTS: readonly number[] = [1.0, 1.0, 1.0, 1.5, 1.2, 1.0, 0.8];

export class PartSimilarityEngine {
  public static computeFeatureVector(part: PartGeometrySummary): number[] {
    const rawBox = [
      Math.abs(part.bbox_x ?? 100.0),
      Math.abs(part.bbox_y ?? 100.0),
      Math.abs(part.bbox_z ?? 100.0),
    ].sort((a, b) => b - a);

    return [
      parseFloat(rawBox[0].toFixed(3)),
      parseFloat(rawBox[1].toFixed(3)),
      parseFloat(rawBox[2].toFixed(3)),
      parseFloat((part.hole_count ?? 0).toFixed(1)),
      parseFloat((part.cylinder_ratio ?? 0).toFixed(4)),
      parseFloat((part.min_tolerance ?? 0.1).toFixed(4)),
      parseFloat((part.surface_area ?? 1000.0).toFixed(2)),
    ];
  }

  public static cosineSimilarity(
    vec1: number[],
    vec2: number[],
    weights: readonly number[] = DEFAULT_WEIGHTS,
    scales: readonly number[] = DEFAULT_SCALES
  ): number {
    if (vec1.length !== vec2.length || vec1.length === 0) {
      return 0.0;
    }

    let dot = 0.0;
    let norm1Sq = 0.0;
    let norm2Sq = 0.0;

    for (let i = 0; i < vec1.length; i++) {
      const sc = scales[i] && Math.abs(scales[i]) > 1e-9 ? scales[i] : 1.0;
      const w = weights[i] ?? 1.0;
      const wu = (vec1[i] / sc) * w;
      const wv = (vec2[i] / sc) * w;

      dot += wu * wv;
      norm1Sq += wu * wu;
      norm2Sq += wv * wv;
    }

    if (norm1Sq <= 1e-12 || norm2Sq <= 1e-12) {
      return 0.0;
    }

    const sim = dot / (Math.sqrt(norm1Sq) * Math.sqrt(norm2Sq));
    return Math.max(0.0, Math.min(1.0, sim));
  }

  public static findSimilarParts(
    queryVector: number[],
    catalog: PreviousSetupRecord[],
    minSimilarity: number = 0.85,
    topK: number = 5,
    weights: readonly number[] = DEFAULT_WEIGHTS,
    scales: readonly number[] = DEFAULT_SCALES
  ): SimilarPartMatch[] {
    const results: SimilarPartMatch[] = [];

    for (const record of catalog) {
      const sim = this.cosineSimilarity(queryVector, record.vector, weights, scales);
      if (sim >= minSimilarity) {
        results.push({
          part_id: record.part_id,
          part_name: record.part_name,
          similarity: parseFloat(sim.toFixed(4)),
          similarity_pct: parseFloat((sim * 100.0).toFixed(1)),
          vector: [...record.vector],
          op_fixtures: { ...record.op_fixtures },
          ph10_angles: [...record.ph10_angles],
          strategy: record.strategy ? { ...record.strategy } : undefined,
        });
      }
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  public static formatRecommendationCard(match: SimilarPartMatch): string {
    return `💡 Bu parça daha önce onaylanan [${match.part_name}] parçasına geometrik olarak %${match.similarity_pct.toFixed(1)} benziyor. Önceki OP10/OP20 bağlama stratejisini, fikstür pabuçlarını ve PH10 prob açılarını otomatik uygulamak ister misiniz?`;
  }
}
