/* eslint-disable */
/**
 * Bu dosya schemas/cad_metadata.schema.json üzerinden otomatik üretilmiştir.
 * ELLE DEĞİŞTİRMEYİN. 'npm run codegen' ile güncelleyin.
 */

export interface CadMetadata {
  model_name: string;
  file_path?: string;
  file_format: "step" | "stp" | "stl" | "obj";
  file_size_bytes?: number;
  vertex_count: number;
  triangle_count: number;
  bbox: {
    /**
     * @minItems 3
     * @maxItems 3
     */
    min: [number, number, number];
    /**
     * @minItems 3
     * @maxItems 3
     */
    max: [number, number, number];
    /**
     * @minItems 3
     * @maxItems 3
     */
    size: [number, number, number];
    [k: string]: unknown;
  };
  features?: {
    id: string;
    feature_type: "PLANE" | "INTERNAL_CYLINDER" | "EXTERNAL_CYLINDER" | "CONE" | "SPHERE" | "FREEFORM";
    nominal_dimension?: number;
    /**
     * @minItems 3
     * @maxItems 3
     */
    center?: [number, number, number];
    /**
     * @minItems 3
     * @maxItems 3
     */
    normal?: [number, number, number];
    area_or_length?: number;
    [k: string]: unknown;
  }[];
  alignment?: {
    base_plane_detected?: boolean;
    table_clearance_min_z?: number;
    /**
     * @minItems 9
     * @maxItems 9
     */
    orientation_matrix?: [number, number, number, number, number, number, number, number, number];
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
