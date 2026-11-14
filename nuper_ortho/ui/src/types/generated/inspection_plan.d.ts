export interface InspectionPlanPayload {
  plan_id: string;
  created_at?: string;
  part_number: string;
  cad_reference?: string;
  drawing_reference?: string;
  audit_hash: string;
  items: {
    order: number;
    item_id: string;
    feature_id?: string;
    balloon_id?: number;
    type: "DATUM_PRIMARY" | "DATUM_SECONDARY" | "DATUM_TERTIARY" | "GEOMETRIC_TOL" | "LINEAR_DIM";
    datum_reference?: string[];
    priority: "MANDATORY" | "STANDARD" | "LEAN_FILTERED";
    feature_key?: string;
    characteristic?: string;
    nominal?: number;
    nominal_str?: string;
    upper_tol?: number;
    lower_tol?: number;
    measured?: number;
    status: "PASS" | "WARN" | "FAIL" | "SUSPECT" | "PENDING";
    op?: string;
    op_reason?: string;
    operator_approved?: boolean;
    approval_timestamp?: string;
    risk_level?: "NORMAL" | "WARNING" | "CRITICAL";
    risk_reasons?: string[];
    match_confidence?: number;
    match_status?: "VERIFIED_EXACT" | "VERIFIED_TOPOLOGY" | "NEEDS_REVIEW" | "UNMATCHED" | "ENGINEER_LOCKED";
    matched_face_ids?: string[];
    tolerance_source?: string;
    recommended_touch_count?: number;
    recommended_touch_speed_mms?: number;
    attachment_points?: number[][];
    rel_position?: number[];
    inferred_axis?: "X" | "Y" | "Z";
    requires_manual_3d_binding?: boolean;
    is_reference_dimension?: boolean;
    cylinder_polarity?: "INTERNAL_BORE" | "EXTERNAL_BOSS" | "PLANAR" | "UNKNOWN";
    recommended_stylus?: string;
    learning_applied?: boolean;
    [k: string]: unknown;
  }[];
  similar_parts?: {
    [k: string]: unknown;
  }[];
  contract_summary?: {
    [k: string]: unknown;
  };
  thermal_compensation_summary?: {
    [k: string]: unknown;
  };
  ollama_status?: string;
  learning_applied?: boolean;
  [k: string]: unknown;
}
