import pytest
from engine.core.license_engine import LicenseEngine


def test_hardware_fingerprint():
    hw_id = LicenseEngine.get_hardware_fingerprint()
    assert hw_id.startswith("NUPER-")
    parts = hw_id.split("-")
    assert len(parts) == 5  # NUPER, 4-char, 4-char, 4-char, 4-char


def test_rsa_license_sign_and_verify():
    priv_pem, pub_pem = LicenseEngine.generate_rsa_keypair()
    hw_id = LicenseEngine.get_hardware_fingerprint()

    payload = {
        "company_name": "TUSAŞ Aviyonik Sistemler",
        "license_type": "ENTERPRISE",
        "machine_id": hw_id,
        "expiry_date": "2030-12-31",
        "features": ["CAD_PARSER", "RULE_ENGINE", "FEA_EXPORT", "LOCAL_LLM", "FIXTURE_DESIGN"]
    }

    signed_b64 = LicenseEngine.create_signed_license(payload, priv_pem)
    assert len(signed_b64) > 100

    engine = LicenseEngine(public_key_pem=pub_pem)
    verification = engine.verify_license(signed_b64)

    assert verification["valid"] is True
    assert verification["company_name"] == "TUSAŞ Aviyonik Sistemler"
    assert verification["license_type"] == "ENTERPRISE"
    assert verification["days_remaining"] > 300


def test_license_tamper_detection():
    priv_pem, pub_pem = LicenseEngine.generate_rsa_keypair()
    hw_id = LicenseEngine.get_hardware_fingerprint()

    payload = {
        "company_name": "ASELSAN",
        "machine_id": hw_id,
        "expiry_date": "2030-12-31"
    }
    signed_b64 = LicenseEngine.create_signed_license(payload, priv_pem)

    # Decode and tamper with company name
    import base64, json
    raw = json.loads(base64.b64decode(signed_b64).decode("utf-8"))
    raw["payload"]["company_name"] = "HACKED_CORP"
    tampered_b64 = base64.b64encode(json.dumps(raw).encode("utf-8")).decode("utf-8")

    engine = LicenseEngine(public_key_pem=pub_pem)
    verification = engine.verify_license(tampered_b64)

    assert verification["valid"] is False
    assert "oynanmış" in verification["reason"] or "geçersiz" in verification["reason"]
