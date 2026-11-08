from typing import Optional, Dict, Any
import re

THREAD_PATTERN = re.compile(
    r"\b((?:M\d+(?:\s*x\s*[\d\.]+)?(?:\s*-\s*[0-9A-Za-z]+)?)|(?:\d+/\d+-\d+\s*(?:UNF|UNC|UN))|(?:G\s*\d+(?:/\d+)?))\b",
    re.IGNORECASE,
)


METRIC_COARSE_PITCH = {
    1.0: 0.25,
    1.2: 0.25,
    1.4: 0.3,
    1.6: 0.35,
    1.8: 0.35,
    2.0: 0.4,
    2.5: 0.45,
    3.0: 0.5,
    3.5: 0.6,
    4.0: 0.7,
    5.0: 0.8,
    6.0: 1.0,
    7.0: 1.0,
    8.0: 1.25,
    10.0: 1.5,
    12.0: 1.75,
    14.0: 2.0,
    16.0: 2.0,
    18.0: 2.5,
    20.0: 2.5,
    22.0: 2.5,
    24.0: 3.0,
}


def lookup_metric_pitch(nominal_dia: float) -> float:
    rounded = round(nominal_dia, 1)
    if rounded in METRIC_COARSE_PITCH:
        return METRIC_COARSE_PITCH[rounded]
    for dia, pitch in sorted(METRIC_COARSE_PITCH.items()):
        if abs(dia - nominal_dia) < 0.25:
            return pitch
    if nominal_dia < 3.0:
        return 0.4
    if nominal_dia < 6.0:
        return 0.8
    if nominal_dia < 12.0:
        return 1.5
    return 2.0


def compute_thread_minor_diameter(major_dia: float, pitch: Optional[float] = None) -> float:
    p = pitch if pitch is not None and pitch > 0 else lookup_metric_pitch(major_dia)
    return round(major_dia - 1.082532 * p, 4)


def parse_thread_callout(text: str) -> Optional[Dict[str, Any]]:
    match = THREAD_PATTERN.search(text)
    if not match:
        return None
    raw = match.group(1).strip()
    thread_type = "METRIC"
    if "UNF" in raw.upper():
        thread_type = "UNF"
    elif "UNC" in raw.upper():
        thread_type = "UNC"
    elif raw.upper().startswith("G"):
        thread_type = "PIPE_G"

    nom_dia = 0.0
    pitch = None
    minor_dia = 0.0
    m_match = re.search(r"M(\d+(?:\.\d+)?)(?:\s*[xX]\s*([\d\.]+))?", raw)
    if m_match:
        nom_dia = float(m_match.group(1))
        if m_match.group(2):
            pitch = float(m_match.group(2))
        else:
            pitch = lookup_metric_pitch(nom_dia)
        minor_dia = compute_thread_minor_diameter(nom_dia, pitch)

    return {
        "raw": raw,
        "thread_type": thread_type,
        "nominal_dia": nom_dia,
        "pitch": pitch,
        "minor_dia": minor_dia,
    }
