export interface DrawingExtractionResult {
  success: boolean;
  error?: string;
  filename: string;
  page_count?: number;
  raw_text_length?: number;
  title_block: {
    part_number: string;
    material: string;
    hardness: string;
    roughness: string;
    general_tolerance: string;
    drawing_number: string;
    [k: string]: unknown;
  };
  datums: string[];
  pages?: {
    page: number;
    width?: number;
    height?: number;
    image_data: string;
    [k: string]: unknown;
  }[];
  dimensions: {
    id: number;
    balloon: string;
    page?: number;
    datum_reference?: string;
    type: string;
    type_label: string;
    icon?: string;
    nominal: number;
    nominal_str: string;
    upper_tol: string;
    lower_tol: string;
    measured: string;
    deviation: string;
    status: "PASS" | "WARN" | "FAIL" | "UNMEASURED";
    verification?:
      | "RAW"
      | "PARSED"
      | "DUAL_VERIFIED"
      | "CAD_VERIFIED"
      | "HUMAN_VERIFIED"
      | "NEEDS_REVIEW"
      | "CONFLICT"
      | "UNVERIFIED";
    provenance?: {
      source_sha256?: string;
      page?: number;
      /**
       * @minItems 4
       * @maxItems 4
       */
      bbox?: [number, number, number, number];
      method?: string;
      extractor_version?: string;
      [k: string]: unknown;
    };
    feature_key?: string;
    gdt?: string;
    op?: string;
    op_reason?: string;
    risk_level?: "NORMAL" | "WARNING" | "CRITICAL";
    risk_reasons?: string[];
    tolerance_source?: string;
    view_name?: string;
    inferred_axis?: "X" | "Y" | "Z" | "RADIAL" | "UNKNOWN";
    attachment_points?: number[][];
    rel_position?: number[];
    match_confidence?: number;
    match_status?:
      "AP242_NATIVE_PMI" | "VERIFIED_EXACT" | "VERIFIED_TOPOLOGY" | "ENGINEER_LOCKED" | "NEEDS_REVIEW" | "UNMATCHED";
    matched_face_ids?: number[];
    distance_type?: string;
    /**
     * @minItems 3
     * @maxItems 3
     */
    faceA_center?: [number, number, number];
    /**
     * @minItems 3
     * @maxItems 3
     */
    faceB_center?: [number, number, number];
    /**
     * @minItems 3
     * @maxItems 3
     */
    faceA_normal?: [number, number, number];
    /**
     * @minItems 3
     * @maxItems 3
     */
    faceB_normal?: [number, number, number];
    /**
     * @minItems 4
     * @maxItems 4
     */
    bbox?: [number, number, number, number];
    [k: string]: unknown;
  }[];
  similar_parts?: {
    part_id?: string;
    part_name?: string;
    similarity_score?: number;
    recommended_setup_op10?: string;
    recommended_probe?: string;
    [k: string]: unknown;
  }[];
  contract_summary?: {
    critical_count?: number;
    warning_count?: number;
    min_tolerance_mm?: number;
    requires_special_probing?: boolean;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
