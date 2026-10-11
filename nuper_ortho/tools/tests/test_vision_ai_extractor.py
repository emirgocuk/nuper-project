import os
import sys
import time
from unittest.mock import patch, MagicMock

tools_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)

from extractor.vision_ai_extractor import (
    render_pdf_page_to_base64,
    select_best_vision_model,
    normalize_ai_dimensions,
    call_ollama_vision,
    run_local_or_hybrid_ai_extraction,
    parse_json_safely
)
from drawing_extractor import extract_from_pdf


def test_select_best_vision_model():
    models_moon = ["llama3.2:3b", "moondream:latest", "qwen2.5-coder:7b"]
    assert select_best_vision_model(models_moon) == "moondream:latest"

    models = ["llama3.2:3b", "qwen2.5-coder:7b", "qwen2.5vl:3b", "nomic-embed-text"]
    selected = select_best_vision_model(models)
    assert selected == "qwen2.5vl:3b"

    models_llama = ["mistral:7b", "llama3.2-vision:latest"]
    selected_llama = select_best_vision_model(models_llama)
    assert selected_llama == "llama3.2-vision:latest"

    models_none = ["qwen2.5-coder:7b", "gemma:2b"]
    assert select_best_vision_model(models_none) is None


def test_render_pdf_page_to_base64_performance():
    test_pdf = os.path.join(tools_dir, "..", "test_assets", "KPT - 3150 Kör Tapa", "KOR TAPA_TR_AA.pdf")
    if not os.path.exists(test_pdf):
        return

    t0 = time.time()
    result = render_pdf_page_to_base64(test_pdf, page_num=1, dpi=150)
    render_duration = time.time() - t0

    assert result is not None
    b64, width, height = result
    assert len(b64) > 1000
    assert width > 500 and height > 500
    assert render_duration < 1.0


def test_normalize_ai_dimensions_zero_fabrication():
    raw_ai_dims = [
        {
            "nominal": 25.0,
            "nominal_str": "Ø25 H7",
            "type": "DIAMETER",
            "upper_tol": "+0.021",
            "lower_tol": "0",
            "gdt": "⌖ 0.05 | A | B",
            "datum_reference": "[A]",
            "bbox": [100.0, 200.0, 150.0, 250.0]
        },
        {
            "nominal": 12.5,
            "nominal_str": "R12.5",
            "type": "RADIUS",
            "upper_tol": "",
            "lower_tol": "",
            "bbox": [300.0, 400.0, 320.0, 430.0]
        }
    ]

    normalized = normalize_ai_dimensions(raw_ai_dims, page_num=1, method_name="ollama_qwen2.5_vl")
    assert len(normalized) == 2

    dia_item = normalized[0]
    assert dia_item["nominal"] == 25.0
    assert dia_item["type"] == "DIAMETER"
    assert dia_item["status"] == "UNMEASURED"
    assert dia_item["measured"] == ""
    assert dia_item["deviation"] == ""
    assert dia_item["verification"] == "PARSED"
    assert dia_item["provenance"]["method"] == "ollama_qwen2.5_vl"


def test_parse_json_safely():
    valid = '{"dimensions": [{"nominal": 10.0}]}'
    assert parse_json_safely(valid) == {"dimensions": [{"nominal": 10.0}]}

    with_fences = '```json\n{"status": "ok"}\n```'
    assert parse_json_safely(with_fences) == {"status": "ok"}

    invalid = 'not json'
    assert parse_json_safely(invalid) is None


@patch("extractor.vision_ai_extractor.call_ollama_vision")
@patch("extractor.vision_ai_extractor.query_ollama_tags")
def test_mocked_local_vlm_under_5_seconds(mock_tags, mock_call):
    mock_tags.return_value = ["qwen2.5-vl:3b"]
    mock_call.return_value = {
        "title_block": {
            "part_number": "603181-00000-01",
            "drawing_number": "603181-00000-01",
            "material": "ALU 6061-T6",
            "general_tolerance": "ISO 2768-m"
        },
        "datums": ["A", "B"],
        "dimensions": [
            {
                "nominal": 50.0,
                "nominal_str": "50 ±0.1",
                "type": "LINEAR",
                "upper_tol": "+0.1",
                "lower_tol": "-0.1",
                "bbox": [100.0, 100.0, 150.0, 120.0]
            }
        ]
    }

    test_pdf = os.path.join(tools_dir, "..", "test_assets", "KPT - 3150 Kör Tapa", "KOR TAPA_TR_AA.pdf")
    if not os.path.exists(test_pdf):
        return

    t0 = time.time()
    res = run_local_or_hybrid_ai_extraction(test_pdf, max_duration_seconds=4.5)
    duration = time.time() - t0

    assert duration < 5.0
    assert res is not None
    assert res["success"] is True
    assert res["engine"] == "ollama_qwen2.5-vl:3b"
    assert len(res["dimensions"]) == 1
    assert res["dimensions"][0]["nominal"] == 50.0
    assert res["dimensions"][0]["status"] == "UNMEASURED"
