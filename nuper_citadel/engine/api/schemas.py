from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


# --- GENERIC & HEALTH ---
class HealthResponse(BaseModel):
    status: str = "ok"
    engine_version: str = "1.0.0-alpha"
    standards_db_connected: bool
    materials_db_connected: bool


# --- PLATFORMS & STANDARDS ---
class BreakpointSchema(BaseModel):
    frequency_hz: float
    psd_value: float
    slope_db_oct: Optional[float] = None


class PlatformSummarySchema(BaseModel):
    id: int
    name: str
    category: str
    standard_code: str
    description: Optional[str] = None


# --- CAD PARSING ---
class CADParseRequest(BaseModel):
    step_file_path: Optional[str] = None
    material_density_kg_m3: float = 2700.0  # Al 6061 default
    material_name: Optional[str] = "Aluminium 6061-T6"


class CADParseResponse(BaseModel):
    metadata: Dict[str, Any]
    physical_properties: Dict[str, Any]
    bounding_box_mm: Dict[str, Any]
    mounting_interface: Dict[str, Any]
    fastener_analysis: Optional[Dict[str, Any]] = None
    tessellation: Optional[Dict[str, Any]] = None


# --- RULE EVALUATION ---
class RuleEvaluationRequest(BaseModel):
    platform_id: int
    part_mass_kg: Optional[float] = None


class MissionProfileResponse(BaseModel):
    platform_name: str
    platform_category: str
    standard_code: str
    vibration_profile: Optional[Dict[str, Any]] = None
    temperature_profile: Optional[Dict[str, Any]] = None
    shock_profile: Optional[Dict[str, Any]] = None


# --- FEA EXPORT ---
class FEABreakpointInput(BaseModel):
    frequency_hz: float
    psd_value: float


class FEAExportRequest(BaseModel):
    platform_name: str = "UAV Store"
    standard_code: str = "MIL-STD-810H"
    category: str = "Cat 14"
    target_grms: float = 7.70
    breakpoints: List[FEABreakpointInput]
    num_points: int = 120
    cad_info: Optional[Dict[str, Any]] = None


class FEAExportResponse(BaseModel):
    csv_content: str
    apdl_snippet: str
    directives: Optional[Dict[str, Any]] = None


# --- FATIGUE CALCULATION ---
class FatigueCalculationRequest(BaseModel):
    resonant_freq_hz: float = 250.0
    rms_stress_1sigma_mpa: float = 20.0
    test_duration_seconds: float = 3600.0  # 1 hour
    material_name: Optional[str] = "Aluminium 6061-T6"
    basquin_a_mpa: Optional[float] = None
    basquin_b_exponent: Optional[float] = None
    yield_strength_mpa: Optional[float] = None
    safety_factor: float = 1.25


class FatigueCalculationResponse(BaseModel):
    inputs: Dict[str, Any]
    bands_breakdown: List[Dict[str, Any]]
    fatigue_results: Dict[str, Any]
    static_yield_check: Dict[str, Any]
    overall_qualification_verdict: str


# --- FIXTURE ENVELOPE ---
class FixtureEnvelopeRequest(BaseModel):
    part_mass_kg: float
    bounding_box: Dict[str, float]  # lx, ly, lz
    mounting_holes: Optional[List[Dict[str, Any]]] = None
    overturning_moment_arm_mm: float = 0.0
    max_test_frequency_hz: float = 2000.0
    shaker_grid_pitch_mm: float = 50.0
    shaker_bolt_size: str = "M10"
    safety_factor: float = 1.20


class MaterialOptionSchema(BaseModel):
    material_name: str
    density_kg_m3: float
    elastic_modulus_gpa: float
    min_thickness_mm: float
    recommended_thickness_mm: float
    actual_first_mode_hz: float
    estimated_fixture_mass_kg: float
    total_shaker_payload_kg: float
    stiffness_to_weight_ratio: float


class FixtureEnvelopeResponse(BaseModel):
    part_mass_kg: float
    part_bounding_box_mm: Dict[str, float]
    mounting_hole_span_mm: Dict[str, float]
    shaker_grid_pitch_mm: float
    shaker_bolt_size: str
    fixture_dimensions_mm: Dict[str, float]
    target_frequency_hz: float
    safety_factor: float
    overturning_moment_warning: bool
    overturning_moment_note: str
    shaker_attachment_bolts_count: int
    recommended_option: Optional[MaterialOptionSchema]
    alternative_options: List[MaterialOptionSchema]
    directives: List[str]


# --- PHASE 2: LLM, ETP, OBJECTION & DPO ---
class ETPGenerateRequest(BaseModel):
    cad_data: Dict[str, Any]
    mission_profile: Dict[str, Any]
    fixture_envelope: Optional[Dict[str, Any]] = None
    fatigue_results: Optional[Dict[str, Any]] = None
    model_name: Optional[str] = None
    custom_notes: Optional[str] = None
    force_fallback: bool = False


class ETPGenerateResponse(BaseModel):
    source: str
    model_used: str
    document_markdown: str
    etp_markdown: Optional[str] = None


class ObjectionGenerateRequest(BaseModel):
    part_name: Optional[str] = "Savunma Bileseni"
    platform_name: Optional[str] = "Aviyonik Bolme"
    anomaly_description: Optional[str] = "Titreşim tepe noktası aşıldı"
    recorded_frequency_hz: Optional[float] = 250.0
    recorded_peak_g: Optional[float] = 12.0
    nominal_grms: Optional[float] = 7.7
    fixture_resonance_hz: Optional[float] = None
    model_name: Optional[str] = None
    # Frontend flexible aliases
    measured_anomaly_hz: Optional[float] = None
    measured_peak_g: Optional[float] = None
    laboratory_notes: Optional[str] = None
    nominal_profile: Optional[Dict[str, Any]] = None
    target_standard: Optional[str] = None


class ObjectionGenerateResponse(BaseModel):
    source: str
    model_used: str
    letter_text: str
    target_standard: str
    objection_letter: Optional[str] = None


class DPOFeedbackRequest(BaseModel):
    feature_area: str
    prompt_context: Any
    rejected_text: str
    chosen_text: str
    engineer_rating: int = 5
    engineer_notes: Optional[str] = None
    tags: Optional[List[str]] = None


class DPOFeedbackResponse(BaseModel):
    record_id: int
    status: str = "recorded_locally"
    created_at: str


# --- PHASE 4: LICENSING & GD&T BRIDGE ---
class MachineIdResponse(BaseModel):
    machine_id: str
    status: str = "air_gapped_hardware_locked"


class LicenseVerifyRequest(BaseModel):
    license_b64: str


class LicenseVerifyResponse(BaseModel):
    valid: bool
    company_name: Optional[str] = None
    license_type: Optional[str] = None
    expiry_date: Optional[str] = None
    days_remaining: Optional[int] = None
    features: Optional[List[str]] = None
    machine_id: str
    reason: Optional[str] = None
    security: Optional[str] = None


class CMMVerificationRequest(BaseModel):
    holes: List[Dict[str, Any]]
    flatness_points_z: Optional[List[float]] = None
    flatness_tolerance_mm: float = 0.08


class CMMVerificationResponse(BaseModel):
    overall_status: str
    standard_basis: str
    total_holes_evaluated: int
    holes_inspection: List[Dict[str, Any]]
    surface_flatness: Dict[str, Any]
    directives: List[str]


# --- SEQUENTIAL STUDY: DRAWING & FASTENERS ---
class DrawingUploadResponse(BaseModel):
    file_name: str
    file_type: str
    page_count: int
    detected_drawing_no: str
    part_name: Optional[str] = "Savunma Şasisi / Braket"
    detected_material: str
    standard_material_match: Optional[str] = "Aluminium 6061-T6"
    detected_standard: str
    detected_finish: str
    heat_treatment: Optional[str] = "T6 Yapay Yaşlandırma"
    extracted_notes: List[str]
    full_text_sample: str
    ai_extracted: Optional[bool] = False


class FastenerEvaluationRequest(BaseModel):
    holes: List[Dict[str, Any]]
    chassis_mass_kg: float = 1.0
    hcg_mm: float = 20.0
    preferred_grade: str = "8.8"
    friction_factor_k: float = 0.18


class FastenerEvaluationResponse(BaseModel):
    total_holes_count: int
    pattern_summary: Dict[str, int]
    chassis_mass_kg: float
    overturning_moment_arm_mm: float
    total_clamping_force_kn: float
    selected_grade: str
    fasteners: List[Dict[str, Any]]
    directives: List[str]


class PostFEAEvaluationRequest(BaseModel):
    resonant_frequencies_hz: List[float]
    peak_von_mises_stress_mpa: float
    yield_strength_mpa: float = 275.0
    damping_ratio: float = 0.02
    safety_factor: float = 1.25
    excitation_range_hz: Optional[List[float]] = None
    platform_name: Optional[str] = None


class PostFEAEvaluationResponse(BaseModel):
    first_mode_hz: float
    second_mode_hz: float
    third_mode_hz: float
    dynamic_amplification_q: float
    peak_von_mises_stress_mpa: float
    allowable_stress_mpa: float
    margin_of_safety: float
    is_yield_safe: bool
    resonance_status: str
    resonance_message: str
    notching_required: bool
    suggested_notch_depth_db: float
    notch_frequency_band_hz: List[float]
    recommended_actions: List[str]


class PDFExportRequest(BaseModel):
    cad_data: Dict[str, Any]
    mission_profile: Dict[str, Any]
    fastener_data: Optional[Dict[str, Any]] = None
    fixture_data: Optional[Dict[str, Any]] = None
    fatigue_data: Optional[Dict[str, Any]] = None
    post_fea_data: Optional[Dict[str, Any]] = None
    document_no: Optional[str] = None
    classification: Optional[str] = "TASNİF DIŞI / UNCLASSIFIED"


# --- CUSTOM PLATFORM & MATERIAL ---
class CustomBreakpointInput(BaseModel):
    frequency_hz: float
    psd_value: float
    slope_db_oct: Optional[float] = 0.0


class CustomVibrationInput(BaseModel):
    method_code: str = "CUSTOM"
    category_id: int = 99
    annex_figure: str = "User Defined Spectrum"
    duration_per_axis_minutes: int = 60
    axes: str = "X,Y,Z"
    mass_attenuation_applicable: bool = False
    breakpoints: List[CustomBreakpointInput]


class CustomTemperatureInput(BaseModel):
    climatic_category: str = "Custom Thermal Profile"
    operational_high_c: float = 60.0
    storage_high_c: float = 70.0
    operational_low_c: float = -40.0
    storage_low_c: float = -50.0


class CustomShockInput(BaseModel):
    procedure_name: str = "Custom Shock"
    pulse_shape: str = "Half-Sine"
    peak_acceleration_g: float = 20.0
    duration_ms: float = 11.0
    num_shocks_per_axis: int = 6


class CustomPlatformCreateRequest(BaseModel):
    platform_name: str
    platform_category: str = "CUSTOM_PLATFORM"
    standard_code: str = "ÖZEL ŞİRKET STANDARDI"
    description: Optional[str] = "Kullanıcı tanımlı özel görev profili"
    vibration: CustomVibrationInput
    temperature: Optional[CustomTemperatureInput] = None
    shock: Optional[CustomShockInput] = None


class CustomPlatformResponse(BaseModel):
    id: int
    platform_name: str
    standard_code: str
    status: str = "created"


class CustomMaterialCreateRequest(BaseModel):
    name: str
    category: str = "CUSTOM_ALLOY"
    density_kg_m3: float
    elastic_modulus_gpa: float
    poissons_ratio: float
    yield_strength_mpa: float
    ultimate_strength_mpa: float
    cte_per_k: float
    basquin_a_mpa: Optional[float] = None
    basquin_b_exponent: Optional[float] = None
    description: Optional[str] = None


class CustomMaterialResponse(BaseModel):
    id: int
    name: str
    status: str = "created"



