import os
import platform
import hashlib
import json
import base64
import uuid
import datetime
from typing import Dict, Any, Optional, Tuple

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.exceptions import InvalidSignature

DEFAULT_PUBLIC_KEY_PEM = b"""-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyvE23b2OslU2g9lZ53zX
2yB6Xf83O53M/xK24g72k/wR9V0d91n8gB1A6yD4uN5e1C7x8M8G7f4v2w1z3r5t
7y8u9i0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q
9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w
1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c
3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i
5wIDAQAB
-----END PUBLIC KEY-----"""


class LicenseEngine:
    """
    Sıfır Bulut Bağımlılığı (Air-Gapped) Asimetrik RSA-2048 Lisans ve
    Donanım Kilidi (Hardware Fingerprint) Doğrulama Motoru.
    """

    def __init__(self, public_key_pem: Optional[bytes] = None):
        self.public_key_pem = public_key_pem or DEFAULT_PUBLIC_KEY_PEM

    @staticmethod
    def get_hardware_fingerprint() -> str:
        """
        CPU mimarisi, makine kimliği ve MAC adresinden tekil
        bir donanım parmak izi (Machine ID) üretir.
        """
        raw_components = [
            platform.machine(),
            platform.processor(),
            platform.node(),
            str(uuid.getnode()),  # MAC address integer
        ]
        raw_str = ":".join(raw_components)
        h = hashlib.sha256(raw_str.encode("utf-8")).hexdigest().upper()
        # NUPER-XXXX-XXXX-XXXX-XXXX formatı
        return f"NUPER-{h[:4]}-{h[4:8]}-{h[8:12]}-{h[12:16]}"

    @staticmethod
    def generate_rsa_keypair() -> Tuple[bytes, bytes]:
        """
        Geliştirici veya lisans sunucusu için RSA-2048 anahtar çifti üretir.
        """
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        public_pem = private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        return private_pem, public_pem

    @staticmethod
    def create_signed_license(
        payload: Dict[str, Any],
        private_key_pem: bytes
    ) -> str:
        """
        Lisans içeriğini RSA-PSS ve SHA-256 ile imzalar ve Base64 .lic metni üretir.
        """
        private_key = serialization.load_pem_private_key(private_key_pem, password=None)
        payload_bytes = json.dumps(payload, sort_keys=True).encode("utf-8")

        signature = private_key.sign(
            payload_bytes,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )

        full_lic = {
            "payload": payload,
            "signature_b64": base64.b64encode(signature).decode("utf-8")
        }
        return base64.b64encode(json.dumps(full_lic).encode("utf-8")).decode("utf-8")

    def verify_license(
        self,
        license_b64_string: str,
        custom_public_key_pem: Optional[bytes] = None
    ) -> Dict[str, Any]:
        """
        Çevrimdışı RSA imzasını ve süre aşımını yerel olarak doğrular.
        """
        current_machine_id = self.get_hardware_fingerprint()

        try:
            raw_json = base64.b64decode(license_b64_string).decode("utf-8")
            lic_data = json.loads(raw_json)
            payload = lic_data.get("payload", {})
            signature = base64.b64decode(lic_data.get("signature_b64", ""))
        except Exception as e:
            return {
                "valid": False,
                "reason": f"Geçersiz lisans dosya formatı: {str(e)}",
                "machine_id": current_machine_id
            }

        # 1. Asimetrik İmza Doğrulama
        pub_pem = custom_public_key_pem or self.public_key_pem
        try:
            pub_key = serialization.load_pem_public_key(pub_pem)
            payload_bytes = json.dumps(payload, sort_keys=True).encode("utf-8")

            pub_key.verify(
                signature,
                payload_bytes,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
        except InvalidSignature:
            return {
                "valid": False,
                "reason": "RSA-2048 dijital imzası geçersiz veya lisans üzerinde oynanmış.",
                "machine_id": current_machine_id
            }
        except Exception as e:
            return {
                "valid": False,
                "reason": f"İmza doğrulama hatası: {str(e)}",
                "machine_id": current_machine_id
            }

        # 2. Donanım Kilidi (Machine ID) Kontrolü
        target_machine_id = payload.get("machine_id", "")
        if target_machine_id != "UNIVERSAL" and target_machine_id != current_machine_id:
            return {
                "valid": False,
                "reason": f"Donanım kilidi uyuşmuyor. Beklenen: {target_machine_id}, Mevcut: {current_machine_id}",
                "machine_id": current_machine_id
            }

        # 3. Süre Kontrolü
        expiry_str = payload.get("expiry_date", "2099-12-31")
        try:
            expiry_date = datetime.date.fromisoformat(expiry_str)
            today = datetime.date.today()
            if today > expiry_date:
                return {
                    "valid": False,
                    "reason": f"Lisans süresi doldu ({expiry_str}).",
                    "machine_id": current_machine_id
                }
            days_left = (expiry_date - today).days
        except Exception:
            days_left = 365

        return {
            "valid": True,
            "company_name": payload.get("company_name", "Savunma Mühendisliği"),
            "license_type": payload.get("license_type", "COMMERCIAL_ENTERPRISE"),
            "expiry_date": expiry_str,
            "days_remaining": days_left,
            "features": payload.get("features", ["CAD_PARSER", "RULE_ENGINE", "FEA_EXPORT", "LOCAL_LLM", "FIXTURE_DESIGN"]),
            "machine_id": current_machine_id,
            "security": "RSA-2048 PSS AIR-GAPPED VERIFIED"
        }
