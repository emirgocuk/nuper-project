#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nuper Ortho — Teknik Resim Datum Önceliklendirme ve Asgari Ölçü Planlayıcı (Inspection Plan Engine)
3-2-1 Datum hiyerarşisi (A -> B -> C) ve "Ne Eksik Ne Fazla" asgari ölçüm filtresi (Lean Inspection).
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from tools.models.generated_inspection_plan import (
    InspectionPlanPayload,
    Item,
    Priority,
    Status,
    Type,
)


def parse_datums_from_gdt(gdt_str: Optional[str]) -> List[str]:
    if not gdt_str:
        return []
    segments = gdt_str.split("|")
    datums: List[str] = []
    if len(segments) > 1:
        for part in segments[1:]:
            matches = re.findall(r"\b([A-Z])\b", part.strip())
            for m in matches:
                if m not in datums:
                    datums.append(m)
    return datums


def compute_plan_audit_hash(part_number: str, items: List[Item]) -> str:
    content = f"{part_number}:" + ",".join(
        f"{it.order}:{it.item_id}:{it.type.value}:{it.priority.value}:{it.nominal}"
        for it in items
    )
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def generate_inspection_plan(
    drawing_data: Dict[str, Any],
    cad_reference: Optional[str] = None,
    plan_id: Optional[str] = None,
) -> InspectionPlanPayload:
    title_block = drawing_data.get("title_block", {})
    part_number = (
        title_block.get("part_number")
        or drawing_data.get("filename", "UNKNOWN_PART")
    )
    drawing_ref = drawing_data.get("filename", "")

    items: List[Item] = []
    current_order = 1

    # 1. Datum Hiyerarşisi ve Sıralama Kuralı (3-2-1 Alignment)
    # [A] Birincil (Primary): 3 DOF kilitler (Z yönelimi + Z ötelemesi)
    # [B] İkincil (Secondary): 2 DOF kilitler (X/Y eksen rotasyonu + 1 öteleme)
    # [C] Üçüncül (Tertiary): 1 DOF kilitler (Kalan son öteleme)
    raw_datums = drawing_data.get("datums", ["A", "B", "C"])
    datum_types = [
        ("A", Type.DATUM_PRIMARY, "Taban Düzlemi (3 Temas Noktası, 3 DOF)"),
        ("B", Type.DATUM_SECONDARY, "Referans Kenar/Delik (2 Temas Noktası, 2 DOF)"),
        ("C", Type.DATUM_TERTIARY, "Dayama Yüzeyi/Stop (1 Temas Noktası, 1 DOF)"),
    ]

    for label, d_type, desc in datum_types:
        if label in raw_datums or not raw_datums:
            items.append(
                Item(
                    order=current_order,
                    item_id=f"DATUM_{label}",
                    feature_id=f"DATUM_{label}",
                    balloon_id=None,
                    type=d_type,
                    datum_reference=[label],
                    priority=Priority.MANDATORY,
                    feature_key=f"datum_{label.lower()}",
                    characteristic=f"Datum Reference [{label}] — {desc}",
                    nominal=0.0,
                    nominal_str=f"[{label}]",
                    upper_tol=0.005,
                    lower_tol=-0.005,
                    measured=0.0,
                    status=Status.PASS,
                    operator_approved=True,
                )
            )
            current_order += 1

    # 2. "Ne Eksik Ne Fazla" Asgari Ölçüm Filtresi (Lean Inspection Filter)
    raw_dimensions = drawing_data.get("dimensions", [])
    geometric_items: List[Dict[str, Any]] = []
    linear_items: List[Dict[str, Any]] = []
    seen_patterns: set[str] = set()

    for dim in raw_dimensions:
        gdt_str = dim.get("gdt") or ""
        nom_str = dim.get("nominal_str", "")
        feature_key = dim.get("feature_key", "")
        referenced_datums = parse_datums_from_gdt(gdt_str)

        # FCF içinde atıfta bulunulan veya geometrik tolerans içeren unsurlar
        has_fcf = bool(referenced_datums or any(sym in gdt_str for sym in ["⌖", "∥", "⌒", "⟂", "⌯", "◎", "⌓"]))

        # Tekrarlayan yardımcı ölçü patern kontrolü (ör. '2x R2.5', '4x Ø5')
        is_pattern = bool(re.match(r"^\d+x\s+", nom_str, re.IGNORECASE))
        base_feature = re.sub(r"^\d+x\s+", "", nom_str).strip()

        if is_pattern and base_feature in seen_patterns and not has_fcf:
            # Tekrarlayan yardımcı unsuru LEAN_FILTERED olarak ele
            continue

        if is_pattern:
            seen_patterns.add(base_feature)

        if has_fcf:
            geometric_items.append({
                "dim": dim,
                "datums": referenced_datums,
                "priority": Priority.MANDATORY,
                "type": Type.GEOMETRIC_TOL,
            })
        else:
            # Kritik tolerans (küçük tolerans aralığı) kontrolü
            try:
                upper = float(str(dim.get("upper_tol", "0.5")).replace("+", ""))
                lower = float(str(dim.get("lower_tol", "-0.5")).replace("+", ""))
                is_tight = abs(upper - lower) <= 0.4
            except (ValueError, TypeError):
                is_tight = False

            linear_items.append({
                "dim": dim,
                "datums": referenced_datums,
                "priority": Priority.MANDATORY if is_tight else Priority.STANDARD,
                "type": Type.LINEAR_DIM,
            })

    # Sıralama: Önce datum bağımlılığına göre geometrik toleranslar (A -> AB -> ABC)
    def datum_sort_key(entry: Dict[str, Any]) -> int:
        d_list = entry["datums"]
        if "C" in d_list:
            return 3
        if "B" in d_list:
            return 2
        if "A" in d_list:
            return 1
        return 0

    geometric_items.sort(key=datum_sort_key)

    all_sorted = geometric_items + linear_items

    for entry in all_sorted:
        dim = entry["dim"]
        dim_id = dim.get("id", current_order)
        balloon_id = dim.get("id")

        try:
            nominal_val = float(dim.get("nominal", 0.0))
        except (ValueError, TypeError):
            nominal_val = 0.0

        try:
            upper_tol_val = float(str(dim.get("upper_tol", "0.1")).replace("+", ""))
        except (ValueError, TypeError):
            upper_tol_val = 0.1

        try:
            lower_tol_val = float(str(dim.get("lower_tol", "-0.1")).replace("+", ""))
        except (ValueError, TypeError):
            lower_tol_val = -0.1

        items.append(
            Item(
                order=current_order,
                item_id=f"ITEM_{dim_id:03d}",
                feature_id=dim.get("feature_key") or f"FEAT_{dim_id:03d}",
                balloon_id=balloon_id,
                type=entry["type"],
                datum_reference=entry["datums"] or ["A"],
                priority=entry["priority"],
                feature_key=dim.get("feature_key"),
                characteristic=dim.get("type_label") or dim.get("type", "DIMENSION"),
                nominal=nominal_val,
                nominal_str=dim.get("nominal_str", str(nominal_val)),
                upper_tol=upper_tol_val,
                lower_tol=lower_tol_val,
                measured=nominal_val,
                status=Status.PASS,
                operator_approved=False,
            )
        )
        current_order += 1

    generated_id = plan_id or f"PLAN-{part_number}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    audit_hash = compute_plan_audit_hash(part_number, items)

    return InspectionPlanPayload(
        plan_id=generated_id,
        created_at=datetime.now(timezone.utc).isoformat(),
        part_number=part_number,
        cad_reference=cad_reference or f"{part_number}.stp",
        drawing_reference=drawing_ref,
        audit_hash=audit_hash,
        items=items,
    )


if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_path = sys.argv[1]
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        plan = generate_inspection_plan(data)
        print(plan.model_dump_json(indent=2))
    else:
        sample_data = {
            "filename": "164849_aski_kancasi.pdf",
            "title_block": {"part_number": "164849-001"},
            "datums": ["A", "B", "C"],
            "dimensions": [
                {
                    "id": 1,
                    "nominal": 20.0,
                    "nominal_str": "Ø20.0 H7",
                    "upper_tol": "+0.021",
                    "lower_tol": "0.000",
                    "gdt": "⌖ Ø 0.020 | A | B | C",
                    "type": "DIAMETER",
                    "feature_key": "bore_20",
                }
            ],
        }
        plan = generate_inspection_plan(sample_data)
        print(plan.model_dump_json(indent=2))
