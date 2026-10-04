from typing import Optional, Dict, Any
import re

THREAD_PATTERN = re.compile(
    r"\b((?:M\d+(?:\s*x\s*[\d\.]+)?(?:\s*-\s*[0-9A-Za-z]+)?)|(?:\d+/\d+-\d+\s*(?:UNF|UNC|UN))|(?:G\s*\d+(?:/\d+)?))\b",
    re.IGNORECASE,
)


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

    return {
        "raw": raw,
        "thread_type": thread_type,
    }
