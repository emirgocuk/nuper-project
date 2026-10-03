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
    item_id: string;
    balloon_id: number;
    feature_key: string;
    characteristic?: string;
    nominal: number;
    upper_tol: number;
    lower_tol: number;
    measured?: number;
    status: "PASS" | "WARN" | "FAIL" | "SUSPECT" | "PENDING";
    operator_approved: boolean;
    approval_timestamp?: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
