from typing import Optional, Tuple
import re

IT7_TABLE = [
    (3.0, 0.010),
    (6.0, 0.012),
    (10.0, 0.015),
    (18.0, 0.018),
    (30.0, 0.021),
    (50.0, 0.025),
    (80.0, 0.030),
    (120.0, 0.035),
    (180.0, 0.040),
    (250.0, 0.046),
    (315.0, 0.052),
    (400.0, 0.057),
    (500.0, 0.063),
]

IT8_TABLE = [
    (3.0, 0.014),
    (6.0, 0.018),
    (10.0, 0.022),
    (18.0, 0.027),
    (30.0, 0.033),
    (50.0, 0.039),
    (80.0, 0.046),
    (120.0, 0.054),
    (180.0, 0.063),
    (250.0, 0.072),
    (315.0, 0.081),
    (400.0, 0.089),
    (500.0, 0.097),
]


def resolve_iso_fit(fit: str, nominal: float) -> Tuple[str, str]:
    fit_clean = fit.strip().upper()
    if fit_clean == "H7":
        for limit_dia, tol in IT7_TABLE:
            if nominal <= limit_dia:
                return (f"+{tol:.3f}", "0.000")
        return ("+0.063", "0.000")
    elif fit_clean == "H8":
        for limit_dia, tol in IT8_TABLE:
            if nominal <= limit_dia:
                return (f"+{tol:.3f}", "0.000")
        return ("+0.097", "0.000")
    elif fit_clean in ("MIN", "MINIMUM"):
        return ("+0.050", "0.000")
    elif fit_clean in ("MAX", "MAKS", "MAKSİMUM"):
        return ("0.000", "-0.050")
    return ("", "")


def parse_symmetric_tolerance(text: str) -> Optional[Tuple[str, str]]:
    match = re.search(r"[±\+]\s*([0-9]+(?:\.[0-9]+)?)", text)
    if match:
        val = match.group(1)
        return (f"+{val}", f"-{val}")
    return None


ISO_2768_1_LINEAR = {
    "f": [
        (3.0, 0.05),
        (6.0, 0.05),
        (30.0, 0.1),
        (120.0, 0.15),
        (400.0, 0.2),
        (1000.0, 0.3),
        (2000.0, 0.5),
    ],
    "m": [
        (3.0, 0.1),
        (6.0, 0.1),
        (30.0, 0.2),
        (120.0, 0.3),
        (400.0, 0.5),
        (1000.0, 0.8),
        (2000.0, 1.2),
    ],
    "c": [
        (3.0, 0.2),
        (6.0, 0.3),
        (30.0, 0.5),
        (120.0, 0.8),
        (400.0, 1.2),
        (1000.0, 2.0),
        (2000.0, 3.0),
    ],
    "v": [
        (3.0, 0.5),
        (6.0, 0.5),
        (30.0, 1.0),
        (120.0, 1.5),
        (400.0, 2.5),
        (1000.0, 4.0),
        (2000.0, 6.0),
    ],
}


def apply_iso2768_tolerance(nominal: float, tol_class: str = "m") -> Tuple[str, str, str]:
    c = tol_class.lower().strip()
    if c not in ISO_2768_1_LINEAR:
        c = "m"
    nom = abs(nominal)
    table = ISO_2768_1_LINEAR[c]
    val = table[-1][1]
    for limit, tol in table:
        if nom <= limit:
            val = tol
            break
    source_tag = f"ISO_2768_{c.upper()}"
    return (f"+{val:.3f}".rstrip("0").rstrip("."), f"-{val:.3f}".rstrip("0").rstrip("."), source_tag)


def parse_bilateral_tolerance(upper_raw: str, lower_raw: str) -> Tuple[str, str]:
    upper = upper_raw.strip()
    lower = lower_raw.strip()
    if upper and not upper.startswith(("+", "-")):
        upper = f"+{upper}"
    if lower and not lower.startswith(("+", "-")):
        lower = f"+{lower}"
    return (upper, lower)
