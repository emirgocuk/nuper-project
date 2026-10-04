/* eslint-disable */
/**
 * Bu dosya schemas/drawing_data.schema.json üzerinden otomatik üretilmiştir.
 * ELLE DEĞİŞTİRMEYİN. 'npm run codegen' ile güncelleyin.
 */

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
    /**
     * @minItems 4
     * @maxItems 4
     */
    bbox?: [number, number, number, number];
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
