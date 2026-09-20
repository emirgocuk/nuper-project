import os
import shutil
import tempfile
import sqlite3
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Response

from engine.api.schemas import (
    HealthResponse,
    PlatformSummarySchema,
    CADParseRequest,
    CADParseResponse,
    RuleEvaluationRequest,
    MissionProfileResponse,
    FEAExportRequest,
    FEAExportResponse,
    FatigueCalculationRequest,
    FatigueCalculationResponse,
    FixtureEnvelopeRequest,
    FixtureEnvelopeResponse,
    MaterialOptionSchema,
    ETPGenerateRequest,
    ETPGenerateResponse,
    ObjectionGenerateRequest,
    ObjectionGenerateResponse,
    DPOFeedbackRequest,
    DPOFeedbackResponse,
    MachineIdResponse,
    LicenseVerifyRequest,
    LicenseVerifyResponse,
    CMMVerificationRequest,
    CMMVerificationResponse,
    DrawingUploadResponse,
    FastenerEvaluationRequest,
    FastenerEvaluationResponse,
    PostFEAEvaluationRequest,
    PostFEAEvaluationResponse,
    PDFExportRequest,
    DOCXExportRequest,
    CustomPlatformCreateRequest,
    CustomPlatformResponse,
    CustomMaterialCreateRequest,
    CustomMaterialResponse,
    ThermalCheckRequest,
    ThermalCheckResponse,
    SolverLogUploadResponse,
    ShockSRSRequest,
    ShockSRSResponse,
    CompositeEvaluateRequest,
    CompositeEvaluateResponse,
    PLMSyncRequest,
    PLMSyncResponse,
)
from engine.core.rule_engine import RuleEngine
from engine.core.cad_parser import CADParser
from engine.core.fea_exporter import FEAExporter
from engine.core.fatigue_engine import FatigueEngine
from engine.core.fixture_engine import FixtureEngine
from engine.core.feedback_engine import FeedbackEngine
from engine.core.license_engine import LicenseEngine
from engine.core.gdt_bridge import GDTBridge
from engine.core.fastener_engine import FastenerEngine
from engine.core.drawing_parser import DrawingParser
from engine.core.post_fea_engine import PostFEAEngine
from engine.core.pdf_report_generator import PDFReportGenerator
from engine.core.docx_report_generator import DocxReportGenerator
from engine.core.thermal_engine import ThermalEngine
from engine.core.shock_engine import ShockEngine
from engine.core.composite_engine import CompositeEngine
from engine.core.plm_bridge import PLMBridge
from engine.llm.local_client import LocalLLMClient
from engine.llm.prompts import (
    DEFENSE_COPILOT_SYSTEM_PROMPT,
    build_etp_prompt,
    build_fallback_etp_document,
)
from engine.llm.objection_agent import ObjectionDefenseAgent

router = APIRouter(prefix="/api")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
STANDARDS_DB_PATH = os.path.join(DATA_DIR, "standards.db")
MATERIALS_DB_PATH = os.path.join(DATA_DIR, "materials.db")


# ---------------------------------------------------------------------------
# 1. HEALTH & SYSTEM STATUS
# ---------------------------------------------------------------------------
@router.get("/health", response_model=HealthResponse)
def get_health():
    std_ok = os.path.exists(STANDARDS_DB_PATH)
    mat_ok = os.path.exists(MATERIALS_DB_PATH)
    return HealthResponse(
        status="ok" if (std_ok and mat_ok) else "degraded",
        standards_db_connected=std_ok,
        materials_db_connected=mat_ok,
    )


# ---------------------------------------------------------------------------
# 2. STANDARDS & PLATFORMS
# ---------------------------------------------------------------------------
@router.get("/platforms", response_model=List[PlatformSummarySchema])
def list_platforms(standard: Optional[str] = None):
    if not os.path.exists(STANDARDS_DB_PATH):
        raise HTTPException(status_code=500, detail="Standards database not found.")
    
    engine = RuleEngine()
    platforms = engine.list_platforms(standard_filter=standard)
    return [
        PlatformSummarySchema(
            id=p["id"],
            name=p["platform_name"],
            category=p["platform_category"],
            standard_code=p["standard_code"],
            description=p["description"],
        )
        for p in platforms
    ]


@router.post("/standards/custom", response_model=CustomPlatformResponse)
def create_custom_platform(req: CustomPlatformCreateRequest):
    try:
        engine = RuleEngine()
        vib_dict = req.vibration.model_dump()
        temp_dict = req.temperature.model_dump() if req.temperature else None
        shock_dict = req.shock.model_dump() if req.shock else None

        plat_id = engine.add_custom_platform(
            platform_name=req.platform_name,
            platform_category=req.platform_category,
            standard_code=req.standard_code,
            description=req.description or "Özel şirket standart profili",
            vibration_data=vib_dict,
            temperature_data=temp_dict,
            shock_data=shock_dict,
        )
        return CustomPlatformResponse(
            id=plat_id,
            platform_name=req.platform_name,
            standard_code=req.standard_code,
            status="created",
        )
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail=f"Platform '{req.platform_name}' zaten kayıtlı.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Özel standart oluşturma hatası: {str(e)}")


@router.post("/materials/custom", response_model=CustomMaterialResponse)
def create_custom_material(req: CustomMaterialCreateRequest):
    try:
        engine = RuleEngine()
        mat_id = engine.add_custom_material(
            name=req.name,
            category=req.category,
            density_kg_m3=req.density_kg_m3,
            elastic_modulus_gpa=req.elastic_modulus_gpa,
            poissons_ratio=req.poissons_ratio,
            yield_strength_mpa=req.yield_strength_mpa,
            ultimate_strength_mpa=req.ultimate_strength_mpa,
            cte_per_k=req.cte_per_k,
            basquin_a_mpa=req.basquin_a_mpa,
            basquin_b_exponent=req.basquin_b_exponent,
            description=req.description,
        )
        return CustomMaterialResponse(
            id=mat_id,
            name=req.name,
            status="created",
        )
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail=f"Malzeme '{req.name}' zaten kayıtlı.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Özel malzeme oluşturma hatası: {str(e)}")


@router.get("/materials")
def list_materials():
    if not os.path.exists(MATERIALS_DB_PATH):
        raise HTTPException(status_code=500, detail="Materials database not found.")
    
    conn = sqlite3.connect(MATERIALS_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, category, density_kg_m3, elastic_modulus_gpa,
               poissons_ratio, yield_strength_mpa, ultimate_strength_mpa,
               cte_per_k, basquin_a_mpa, basquin_b_exponent, description
        FROM materials
        ORDER BY id ASC
    """)
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": r[0],
            "name": r[1],
            "category": r[2],
            "density_kg_m3": r[3],
            "elastic_modulus_gpa": r[4],
            "poissons_ratio": r[5],
            "yield_strength_mpa": r[6],
            "ultimate_strength_mpa": r[7],
            "cte_per_k": r[8],
            "basquin_a_mpa": r[9],
            "basquin_b_exponent": r[10],
            "description": r[11],
        }
        for r in rows
    ]


# ---------------------------------------------------------------------------
# 3. CAD PARSING
# ---------------------------------------------------------------------------
@router.post("/cad/parse", response_model=CADParseResponse)
def parse_cad_file(req: CADParseRequest):
    if not req.step_file_path or not os.path.exists(req.step_file_path):
        raise HTTPException(status_code=400, detail="Valid STEP file path must be provided.")
    
    try:
        parser = CADParser(default_density_kg_m3=req.material_density_kg_m3)
        res = parser.parse_step(
            file_path=req.step_file_path,
            density_kg_m3=req.material_density_kg_m3,
            material_name=req.material_name,
        )
        # Otomatik cıvata ve bağlayıcı analizi ekle
        fastener_engine = FastenerEngine()
        holes = res.get("mounting_interface", {}).get("holes", [])
        mass_kg = res.get("physical_properties", {}).get("mass_kg", 1.0)
        hcg_mm = res.get("mounting_interface", {}).get("overturning_moment_arm_h_cg_mm", 20.0)
        res["fastener_analysis"] = fastener_engine.evaluate_fasteners(
            holes=holes,
            chassis_mass_kg=mass_kg,
            hcg_mm=hcg_mm
        )
        return CADParseResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CAD Parsing error: {str(e)}")


@router.post("/cad/upload", response_model=CADParseResponse)
async def upload_cad_file(
    file: UploadFile = File(...),
    material_density_kg_m3: float = Form(2700.0),
    material_name: str = Form("Aluminium 6061-T6"),
):
    if not file.filename.lower().endswith((".step", ".stp")):
        raise HTTPException(status_code=400, detail="Only .step or .stp files are supported.")
    
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        req = CADParseRequest(
            step_file_path=tmp_path,
            material_density_kg_m3=material_density_kg_m3,
            material_name=material_name,
        )
        result = parse_cad_file(req)
        result.metadata["file_name"] = file.filename
        return result
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.post("/cad/upload-assembly", response_model=CADParseResponse)
async def upload_assembly_files(
    files: List[UploadFile] = File(...),
    material_density_kg_m3: float = Form(2700.0),
    material_name: str = Form("Aluminium 6061-T6"),
):
    if not files:
        raise HTTPException(status_code=400, detail="En az bir STEP dosyası gereklidir.")
    
    saved_paths = []
    try:
        for f in files:
            if not f.filename.lower().endswith((".step", ".stp")):
                continue
            suffix = os.path.splitext(f.filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                shutil.copyfileobj(f.file, tmp)
                saved_paths.append((tmp.name, f.filename))
        
        if not saved_paths:
            raise HTTPException(status_code=400, detail="Geçerli .step veya .stp dosyası bulunamadı.")
        
        from engine.core.assembly_engine import AssemblyEngine
        engine = AssemblyEngine(default_density_kg_m3=material_density_kg_m3)
        
        if len(saved_paths) == 1:
            res = engine.parse_compound_step(
                file_path=saved_paths[0][0],
                default_density_kg_m3=material_density_kg_m3,
                default_material_name=material_name
            )
            res["metadata"]["file_name"] = saved_paths[0][1]
        else:
            file_paths = [p[0] for p in saved_paths]
            res = engine.parse_multi_step_files(
                file_paths=file_paths,
                material_mappings={os.path.basename(p[0]): material_name for p in saved_paths},
                density_mappings={os.path.basename(p[0]): material_density_kg_m3 for p in saved_paths}
            )
            name_map = {os.path.basename(p[0]): os.path.splitext(p[1])[0] for p in saved_paths}
            for part in res.get("parts", []):
                for tmp_bname, orig_name in name_map.items():
                    if tmp_bname in part["part_name"]:
                        part["part_name"] = orig_name
            for item in res.get("assembly_tree", []):
                for tmp_bname, orig_name in name_map.items():
                    if tmp_bname in item["part_name"]:
                        item["part_name"] = orig_name
            res["metadata"]["file_name"] = f"Montaj Grubu ({len(saved_paths)} Parça)"
        
        fastener_engine = FastenerEngine()
        holes = res.get("mounting_interface", {}).get("holes", [])
        mass_kg = res.get("physical_properties", {}).get("mass_kg", 1.0)
        hcg_mm = res.get("mounting_interface", {}).get("overturning_moment_arm_h_cg_mm", 20.0)
        res["fastener_analysis"] = fastener_engine.evaluate_fasteners(
            holes=holes,
            chassis_mass_kg=mass_kg,
            hcg_mm=hcg_mm
        )
        return CADParseResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Montaj analizi hatası: {str(e)}")
    finally:
        for p, _ in saved_paths:
            if os.path.exists(p):
                try:
                    os.remove(p)
                except Exception:
                    pass


@router.post("/drawing/upload", response_model=DrawingUploadResponse)
async def upload_drawing_file(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg", ".dxf"]:
        raise HTTPException(status_code=400, detail="Desteklenen dosya formatları: .pdf, .png, .jpg, .dxf")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        if ext == ".pdf":
            result = DrawingParser.parse_pdf_drawing(tmp_path)
        else:
            result = DrawingParser.parse_image_drawing(tmp_path)
        result["file_name"] = file.filename
        return DrawingUploadResponse(**result)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.post("/fasteners/recommend", response_model=FastenerEvaluationResponse)
def recommend_fasteners(req: FastenerEvaluationRequest):
    fe = FastenerEngine()
    res = fe.evaluate_fasteners(
        holes=req.holes,
        chassis_mass_kg=req.chassis_mass_kg,
        hcg_mm=req.hcg_mm,
        preferred_grade=req.preferred_grade,
        friction_factor_k=req.friction_factor_k
    )
    return FastenerEvaluationResponse(**res)


# ---------------------------------------------------------------------------
# 4. RULE ENGINE EVALUATION
# ---------------------------------------------------------------------------
@router.post("/rules/evaluate", response_model=MissionProfileResponse)
def evaluate_rules(req: RuleEvaluationRequest):
    try:
        engine = RuleEngine()
        res = engine.evaluate_profile(platform_id=req.platform_id, part_mass_kg=req.part_mass_kg)
        return MissionProfileResponse(
            platform_name=res["platform"]["name"],
            platform_category=res["platform"]["category"],
            standard_code=res["platform"]["standard"],
            vibration_profile=res.get("vibration"),
            temperature_profile=res.get("temperature"),
            shock_profile=res.get("shock"),
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rule evaluation error: {str(e)}")


# ---------------------------------------------------------------------------
# 5. FEA EXPORT (NX / ANSYS)
# ---------------------------------------------------------------------------
@router.post("/fea/export-psd", response_model=FEAExportResponse)
def export_fea_psd(req: FEAExportRequest):
    try:
        exporter = FEAExporter()
        bps_dict = [{"frequency_hz": bp.frequency_hz, "psd_value": bp.psd_value} for bp in req.breakpoints]

        csv_text = exporter.generate_nx_ansys_csv(
            platform_name=req.platform_name,
            standard_code=req.standard_code,
            category=req.category,
            target_grms=req.target_grms,
            breakpoints=bps_dict,
            num_points=req.num_points,
        )

        apdl_text = exporter.generate_ansys_apdl_snippet(
            table_name="NUPER_PSD",
            breakpoints=bps_dict,
        )

        directives = None
        if req.cad_info:
            mission_dummy = {
                "vibration": {
                    "frequency_range_hz": [bps_dict[0]["frequency_hz"], bps_dict[-1]["frequency_hz"]]
                }
            }
            directives = exporter.generate_simulation_directive(
                cad_info=req.cad_info,
                mission_info=mission_dummy,
            )

        return FEAExportResponse(
            csv_content=csv_text,
            apdl_snippet=apdl_text,
            directives=directives,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"FEA Export error: {str(e)}")


# ---------------------------------------------------------------------------
# 6. FATIGUE CALCULATION (STEINBERG + PALMGREN-MINER)
# ---------------------------------------------------------------------------
@router.post("/fatigue/calculate", response_model=FatigueCalculationResponse)
def calculate_fatigue(req: FatigueCalculationRequest):
    try:
        engine = FatigueEngine()
        
        # Basquin katsayıları verilmemişse veritabanından al
        a_mpa = req.basquin_a_mpa
        b_exp = req.basquin_b_exponent
        yield_str = req.yield_strength_mpa

        if (a_mpa is None or b_exp is None or yield_str is None) and os.path.exists(MATERIALS_DB_PATH):
            conn = sqlite3.connect(MATERIALS_DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
                SELECT basquin_a_mpa, basquin_b_exponent, yield_strength_mpa
                FROM materials
                WHERE name LIKE ?
            """, (f"%{req.material_name}%",))
            row = cursor.fetchone()
            conn.close()
            if row:
                a_mpa = a_mpa or float(row[0])
                b_exp = b_exp or float(row[1])
                yield_str = yield_str or float(row[2])

        # Varsayılan emniyetli değerler
        a_mpa = a_mpa or 490.0
        b_exp = b_exp or -0.108
        yield_str = yield_str or 275.0

        res = engine.evaluate_vibration_fatigue(
            resonant_freq_hz=req.resonant_freq_hz,
            rms_stress_1sigma_mpa=req.rms_stress_1sigma_mpa,
            test_duration_seconds=req.test_duration_seconds,
            basquin_a_mpa=a_mpa,
            basquin_b_exponent=b_exp,
            yield_strength_mpa=yield_str,
            safety_factor=req.safety_factor,
        )

        return FatigueCalculationResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fatigue calculation error: {str(e)}")


# ---------------------------------------------------------------------------
# 7. FIXTURE RESONANCE ENVELOPE
# ---------------------------------------------------------------------------
@router.post("/fixture/envelope", response_model=FixtureEnvelopeResponse)
def calculate_fixture_envelope(req: FixtureEnvelopeRequest):
    try:
        engine = FixtureEngine()
        res = engine.calculate_envelope(
            part_mass_kg=req.part_mass_kg,
            bounding_box=req.bounding_box,
            mounting_holes=req.mounting_holes,
            overturning_moment_arm_mm=req.overturning_moment_arm_mm,
            max_test_frequency_hz=req.max_test_frequency_hz,
            shaker_grid_pitch_mm=req.shaker_grid_pitch_mm,
            shaker_bolt_size=req.shaker_bolt_size,
            safety_factor=req.safety_factor,
        )

        rec_opt = None
        if res.recommended_option:
            rec_opt = MaterialOptionSchema(**res.recommended_option.__dict__)

        alt_opts = [MaterialOptionSchema(**opt.__dict__) for opt in res.alternative_options]

        return FixtureEnvelopeResponse(
            part_mass_kg=res.part_mass_kg,
            part_bounding_box_mm=res.part_bounding_box_mm,
            mounting_hole_span_mm=res.mounting_hole_span_mm,
            shaker_grid_pitch_mm=res.shaker_grid_pitch_mm,
            shaker_bolt_size=res.shaker_bolt_size,
            fixture_dimensions_mm=res.fixture_dimensions_mm,
            target_frequency_hz=res.target_frequency_hz,
            safety_factor=res.safety_factor,
            overturning_moment_warning=res.overturning_moment_warning,
            overturning_moment_note=res.overturning_moment_note,
            shaker_attachment_bolts_count=res.shaker_attachment_bolts_count,
            recommended_option=rec_opt,
            alternative_options=alt_opts,
            directives=res.directives,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fixture envelope error: {str(e)}")


# ---------------------------------------------------------------------------
# 8. LOCAL LLM STATUS & ETP SYNTHESIS
# ---------------------------------------------------------------------------
@router.get("/llm/status")
def get_llm_status():
    client = LocalLLMClient()
    return client.check_connection()


@router.post("/llm/generate-etp", response_model=ETPGenerateResponse)
def generate_etp_document(req: ETPGenerateRequest):
    """
    Yerel LLM (Ollama) ile veya zorunlu/hata durumunda deterministik şablon
    motoru ile resmi Askeri Çevre Koşulları Test Planı (ETP) üretir.
    """
    client = LocalLLMClient()
    conn = client.check_connection()

    if not req.force_fallback and conn.get("connected"):
        try:
            prompt = build_etp_prompt(
                cad_data=req.cad_data,
                mission_profile=req.mission_profile,
                fixture_envelope=req.fixture_envelope,
                fatigue_results=req.fatigue_results,
                custom_notes=req.custom_notes,
            )
            model_to_use = req.model_name or conn.get("active_model", "qwen2.5-coder:7b")
            doc = client.generate(
                prompt=prompt,
                system=DEFENSE_COPILOT_SYSTEM_PROMPT,
                model=model_to_use,
                temperature=0.15,
                timeout_seconds=90.0,
            )
            return ETPGenerateResponse(
                source="LLM_GENERATED",
                model_used=model_to_use,
                document_markdown=doc,
                etp_markdown=doc,
            )
        except Exception:
            # Fallback on LLM timeout or runtime error
            pass

    # Deterministik Graceful Fallback
    doc = build_fallback_etp_document(
        cad_data=req.cad_data,
        mission_profile=req.mission_profile,
        fixture_envelope=req.fixture_envelope,
        fatigue_results=req.fatigue_results,
    )
    return ETPGenerateResponse(
        source="DETERMINISTIC_FALLBACK",
        model_used="Template Engine (Zero-Cloud)",
        document_markdown=doc,
        etp_markdown=doc,
    )


# ---------------------------------------------------------------------------
# 9. OBJECTION & DEFENSE AGENT
# ---------------------------------------------------------------------------
@router.post("/llm/generate-objection", response_model=ObjectionGenerateResponse)
def generate_objection_letter(req: ObjectionGenerateRequest):
    agent = ObjectionDefenseAgent()
    p_name = req.part_name or "Savunma Parçası"
    p_plat = req.platform_name or "Aviyonik Bölme"
    anom_desc = req.anomaly_description or req.laboratory_notes or "Rezonans frekansında tepe ivme aşımı"
    freq_hz = req.recorded_frequency_hz or req.measured_anomaly_hz or 250.0
    peak_g = req.recorded_peak_g or req.measured_peak_g or 12.0
    nom_grms = req.nominal_grms or 7.7

    res = agent.generate_defense_letter(
        part_name=p_name,
        platform_name=p_plat,
        anomaly_description=anom_desc,
        recorded_frequency_hz=freq_hz,
        recorded_peak_g=peak_g,
        nominal_grms=nom_grms,
        fixture_resonance_hz=req.fixture_resonance_hz,
        model_name=req.model_name,
    )
    res["objection_letter"] = res.get("letter_text", "")
    return ObjectionGenerateResponse(**res)


# ---------------------------------------------------------------------------
# 10. LOCAL DPO TELEMETRY & FEEDBACK
# ---------------------------------------------------------------------------
@router.post("/feedback/submit", response_model=DPOFeedbackResponse)
def submit_feedback(req: DPOFeedbackRequest):
    engine = FeedbackEngine()
    record_id = engine.record_feedback(
        feature_area=req.feature_area,
        prompt_context=req.prompt_context,
        rejected_text=req.rejected_text,
        chosen_text=req.chosen_text,
        engineer_rating=req.engineer_rating,
        engineer_notes=req.engineer_notes,
        tags=req.tags,
    )
    import datetime
    return DPOFeedbackResponse(
        record_id=record_id,
        status="recorded_locally",
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    )


@router.get("/feedback/list")
def list_feedback(limit: int = 50):
    engine = FeedbackEngine()
    return engine.list_feedback(limit=limit)


@router.get("/feedback/stats")
def get_feedback_stats():
    engine = FeedbackEngine()
    return engine.get_stats()


# ---------------------------------------------------------------------------
# 11. OFFLINE LICENSING (RSA-2048 & HARDWARE FINGERPRINT)
# ---------------------------------------------------------------------------
@router.get("/license/machine-id", response_model=MachineIdResponse)
def get_machine_id():
    return MachineIdResponse(
        machine_id=LicenseEngine.get_hardware_fingerprint(),
        status="air_gapped_hardware_locked",
    )


@router.post("/license/verify", response_model=LicenseVerifyResponse)
def verify_license_file(req: LicenseVerifyRequest):
    engine = LicenseEngine()
    res = engine.verify_license(req.license_b64)
    return LicenseVerifyResponse(**res)


# ---------------------------------------------------------------------------
# 12. GD&T & CMM TOLERANCE BRIDGE
# ---------------------------------------------------------------------------
@router.post("/gdt/verify-cmm", response_model=CMMVerificationResponse)
def verify_cmm_inspection(req: CMMVerificationRequest):
    bridge = GDTBridge()
    res = bridge.evaluate_cmm_inspection(
        holes=req.holes,
        flatness_points_z=req.flatness_points_z,
        flatness_tolerance_mm=req.flatness_tolerance_mm,
    )
    return CMMVerificationResponse(**res)


# ---------------------------------------------------------------------------
# 13. POST-FEA CLOSED-LOOP VALIDATION & NOTCHING
# ---------------------------------------------------------------------------
@router.post("/fea/evaluate-post", response_model=PostFEAEvaluationResponse)
def evaluate_post_fea(req: PostFEAEvaluationRequest):
    engine = PostFEAEngine()
    res = engine.evaluate_post_fea(
        resonant_frequencies_hz=req.resonant_frequencies_hz,
        peak_von_mises_stress_mpa=req.peak_von_mises_stress_mpa,
        yield_strength_mpa=req.yield_strength_mpa,
        damping_ratio=req.damping_ratio,
        safety_factor=req.safety_factor,
        excitation_range_hz=req.excitation_range_hz,
        platform_name=req.platform_name,
    )
    return PostFEAEvaluationResponse(**res)


# ---------------------------------------------------------------------------
# 14. OFFICIAL DEFENSE A4 PDF REPORT EXPORT
# ---------------------------------------------------------------------------
@router.post("/export/etp/pdf")
def export_etp_pdf(req: PDFExportRequest):
    generator = PDFReportGenerator()
    try:
        pdf_bytes = generator.generate_etp_pdf(
            cad_data=req.cad_data,
            mission_profile=req.mission_profile,
            fastener_data=req.fastener_data,
            fixture_data=req.fixture_data,
            fatigue_data=req.fatigue_data,
            post_fea_data=req.post_fea_data,
            thermal_data=req.thermal_data,
            document_no=req.document_no,
            classification=req.classification or "TASNİF DIŞI / UNCLASSIFIED",
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=Nuper_Citadel_Official_ETP.pdf"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.post("/export/etp/docx")
def export_etp_docx(req: DOCXExportRequest):
    try:
        docx_bytes = DocxReportGenerator.generate_etp_docx(
            cad_data=req.cad_data,
            mission_profile=req.mission_profile,
            fastener_data=req.fastener_data,
            fixture_data=req.fixture_data,
            fatigue_data=req.fatigue_data,
            post_fea_data=req.post_fea_data,
            thermal_data=req.thermal_data,
            shock_data=req.shock_data,
            composite_data=req.composite_data,
            document_no=req.document_no,
            classification=req.classification or "TASNİF DIŞI / UNCLASSIFIED",
        )
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": "attachment; filename=Nuper_Citadel_Official_ETP.docx"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DOCX generation failed: {str(e)}")


# ---------------------------------------------------------------------------
# 15. THERMAL QUALIFICATION (MIL-STD-810H METHODS 501.7 & 502.7)
# ---------------------------------------------------------------------------
@router.post("/qualification/thermal-check", response_model=ThermalCheckResponse)
def evaluate_thermal_check(req: ThermalCheckRequest):
    try:
        res = ThermalEngine.evaluate_thermal_qualification(
            body_material_name=req.body_material_name,
            body_cte_per_k=req.body_cte_per_k,
            body_elastic_modulus_gpa=req.body_elastic_modulus_gpa,
            body_yield_strength_mpa=req.body_yield_strength_mpa,
            dimensions_mm=req.dimensions_mm,
            operational_high_c=req.operational_high_c,
            operational_low_c=req.operational_low_c,
            storage_high_c=req.storage_high_c,
            storage_low_c=req.storage_low_c,
            fastener_material_key=req.fastener_material_key,
            fastener_size=req.fastener_size,
            grip_length_mm=req.grip_length_mm,
            initial_preload_n=req.initial_preload_n,
            dynamic_load_per_bolt_n=req.dynamic_load_per_bolt_n,
        )
        return ThermalCheckResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Thermal evaluation failed: {str(e)}")


# ---------------------------------------------------------------------------
# 16. DIRECT FEA SOLVER LOG UPLOAD (.f06 / ANSYS summary)
# ---------------------------------------------------------------------------
@router.post("/fea/upload-solver-log", response_model=SolverLogUploadResponse)
async def upload_solver_log(
    file: UploadFile = File(...),
    yield_strength_mpa: Optional[float] = Form(None),
    damping_ratio: float = Form(0.02),
    safety_factor: float = Form(1.25),
    platform_name: Optional[str] = Form(None),
):
    try:
        content_bytes = await file.read()
        content = content_bytes.decode("utf-8", errors="replace")
        parsed = PostFEAEngine.parse_solver_log(content, filename=file.filename or "")

        evaluation = None
        if parsed["resonant_frequencies_hz"] and yield_strength_mpa is not None:
            engine = PostFEAEngine()
            peak_stress = parsed["peak_von_mises_stress_mpa"] or 50.0
            evaluation = engine.evaluate_post_fea(
                resonant_frequencies_hz=parsed["resonant_frequencies_hz"],
                peak_von_mises_stress_mpa=peak_stress,
                yield_strength_mpa=yield_strength_mpa,
                damping_ratio=damping_ratio,
                safety_factor=safety_factor,
                platform_name=platform_name,
            )

        return SolverLogUploadResponse(
            solver_type=parsed["solver_type"],
            filename=parsed["filename"],
            extracted_modes_count=parsed["extracted_modes_count"],
            resonant_frequencies_hz=parsed["resonant_frequencies_hz"],
            peak_von_mises_stress_mpa=parsed["peak_von_mises_stress_mpa"],
            first_mode_hz=parsed["first_mode_hz"],
            second_mode_hz=parsed["second_mode_hz"],
            third_mode_hz=parsed["third_mode_hz"],
            evaluation=evaluation,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Solver log parsing failed: {str(e)}")


# ---------------------------------------------------------------------------
# 17. MECHANICAL SHOCK & SRS (MIL-STD-810H METHOD 516.8)
# ---------------------------------------------------------------------------
@router.post("/qualification/shock-srs", response_model=ShockSRSResponse)
def evaluate_shock_srs(req: ShockSRSRequest):
    try:
        res = ShockEngine.evaluate_shock_qualification(
            part_mass_kg=req.part_mass_kg,
            yield_strength_mpa=req.yield_strength_mpa,
            first_natural_freq_hz=req.first_natural_freq_hz,
            num_bolts=req.num_bolts,
            bolt_tensile_area_mm2=req.bolt_tensile_area_mm2,
            bolt_yield_strength_mpa=req.bolt_yield_strength_mpa,
            procedure_name=req.procedure_name,
            pulse_shape=req.pulse_shape,
            peak_acceleration_g=req.peak_acceleration_g,
            duration_ms=req.duration_ms,
            q_factor=req.q_factor,
            safety_factor=req.safety_factor,
        )
        return ShockSRSResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Shock SRS evaluation failed: {str(e)}")


# ---------------------------------------------------------------------------
# 18. COMPOSITE CLASSICAL LAMINATE THEORY (CLT) & FAILURE CRITERIA
# ---------------------------------------------------------------------------
@router.post("/materials/composite-evaluate", response_model=CompositeEvaluateResponse)
def evaluate_composite_laminate(req: CompositeEvaluateRequest):
    try:
        custom_props = {}
        if req.custom_e1_gpa is not None:
            custom_props["e1_mpa"] = req.custom_e1_gpa * 1000.0
        if req.custom_e2_gpa is not None:
            custom_props["e2_mpa"] = req.custom_e2_gpa * 1000.0
        if req.custom_g12_gpa is not None:
            custom_props["g12_mpa"] = req.custom_g12_gpa * 1000.0
        if req.custom_nu12 is not None:
            custom_props["nu12"] = req.custom_nu12
        if req.custom_xt_mpa is not None:
            custom_props["xt_mpa"] = req.custom_xt_mpa
        if req.custom_xc_mpa is not None:
            custom_props["xc_mpa"] = req.custom_xc_mpa
        if req.custom_yt_mpa is not None:
            custom_props["yt_mpa"] = req.custom_yt_mpa
        if req.custom_yc_mpa is not None:
            custom_props["yc_mpa"] = req.custom_yc_mpa
        if req.custom_s_mpa is not None:
            custom_props["s_mpa"] = req.custom_s_mpa

        res = CompositeEngine.evaluate_laminate(
            material_preset=req.material_preset,
            layup_angles=req.layup_angles,
            ply_thickness_mm=req.ply_thickness_mm,
            force_nx=req.force_nx_n_mm,
            force_ny=req.force_ny_n_mm,
            shear_nxy=req.shear_nxy_n_mm,
            moment_mx=req.moment_mx_nmm_mm,
            moment_my=req.moment_my_nmm_mm,
            moment_mxy=req.moment_mxy_nmm_mm,
            custom_allowables=custom_props or None,
        )
        return CompositeEvaluateResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Composite evaluation failed: {str(e)}")


# ---------------------------------------------------------------------------
# 19. CORPORATE PLM/PDM INTEGRATION BRIDGE
# ---------------------------------------------------------------------------
@router.post("/plm/sync", response_model=PLMSyncResponse)
def sync_plm_record(req: PLMSyncRequest):
    try:
        res = PLMBridge.sync_qualification_record(
            system_type=req.system_type,
            item_id=req.item_id,
            revision=req.revision,
            part_name=req.part_name,
            qualification_metadata=req.metadata,
            mock_mode=req.mock_mode,
        )
        return PLMSyncResponse(
            status=res["status"],
            system_type=res["system_type"],
            item_id=res["item_id"],
            revision=res["revision"],
            sync_timestamp=res["sync_timestamp"],
            message=res["message"],
            plm_object_uid=res["plm_object_uid"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PLM synchronization failed: {str(e)}")
