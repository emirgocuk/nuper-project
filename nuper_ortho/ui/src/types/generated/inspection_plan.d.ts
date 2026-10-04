/* eslint-disable */
/**
 * Bu dosya schemas/inspection_plan.schema.json üzerinden otomatik üretilmiştir.
 * ELLE DEĞİŞTİRMEYİN. 'npm run codegen' ile güncelleyin.
 */

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
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
