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
  /**
   * Geometriyi okuyan B-Rep çekirdeği ve sürümü.
   */
  kernel?: string;
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
    feature_type: "PLANE" | "INTERNAL_CYLINDER" | "EXTERNAL_CYLINDER" | "CONE" | "SPHERE" | "TORUS" | "FREEFORM";
    /**
     * Silindir/küre/koni: çap. Torus: 2 x küçük yarıçap.
     */
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
    /**
     * Dönel yüzeyin toplam açısal kapsamı (360 = tam delik/mil).
     */
    angular_span_deg?: number;
    description?: string;
    /**
     * Unsuru oluşturan B-Rep yüzey kimlikleri (mesh.faces[].id).
     */
    face_ids?: string[];
    [k: string]: unknown;
  }[];
  /**
   * B-Rep çekirdeğinin ürettiği yüzey bazlı üçgen ağı. Diziler little-endian base64.
   */
  mesh?: {
    /**
     * Float32 x,y,z.
     */
    positions_b64: string;
    /**
     * Float32 nx,ny,nz.
     */
    normals_b64: string;
    /**
     * Uint32 üçgen indeksleri.
     */
    indices_b64: string;
    /**
     * Float32 B-Rep kenar çizgi parçaları (x1,y1,z1,x2,y2,z2).
     */
    edges_b64: string;
    linear_deflection: number;
    faces: {
      id: string;
      surface_type:
        | "PLANE"
        | "CYLINDER"
        | "CONE"
        | "SPHERE"
        | "TORUS"
        | "BSPLINE"
        | "BEZIER"
        | "REVOLUTION"
        | "EXTRUSION"
        | "OFFSET"
        | "OTHER";
      triangle_start: number;
      triangle_count: number;
      area?: number;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
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
