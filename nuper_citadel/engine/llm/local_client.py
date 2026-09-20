import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional


class LocalLLMClient:
    """
    Yerel (air-gapped) Ollama REST API istemcisi.
    Sıfır bulut bağımlılığı ile 127.0.0.1:11434 üzerinden çalışır.
    """

    DEFAULT_HOST = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
    DEFAULT_MODEL = os.environ.get("NUPER_LLM_MODEL", "qwen2.5-coder:7b")

    def __init__(self, host: Optional[str] = None, default_model: Optional[str] = None):
        self.host = (host or self.DEFAULT_HOST).rstrip("/")
        self.default_model = default_model or self.DEFAULT_MODEL

    def check_connection(self) -> Dict[str, Any]:
        """
        Ollama servisinin ayakta olup olmadığını ve yüklü modelleri denetler.
        """
        try:
            url = f"{self.host}/api/tags"
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=2.0) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    models = [m.get("name") for m in data.get("models", [])]
                    return {
                        "connected": True,
                        "models": models,
                        "active_model": self.default_model if self.default_model in models else (models[0] if models else self.default_model),
                        "host": self.host
                    }
        except Exception as e:
            return {
                "connected": False,
                "models": [],
                "active_model": self.default_model,
                "host": self.host,
                "error": str(e)
            }

        return {"connected": False, "models": [], "active_model": self.default_model}

    def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.15,
        max_tokens: int = 4096,
        timeout_seconds: float = 60.0
    ) -> str:
        """
        Ollama REST API üzerinden metin üretir.
        """
        target_model = model or self.default_model
        payload = {
            "model": target_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "top_p": 0.9,
                "repeat_penalty": 1.1
            }
        }
        if system:
            payload["system"] = system

        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{self.host}/api/generate",
            data=data_bytes,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=timeout_seconds) as resp:
                if resp.status == 200:
                    result = json.loads(resp.read().decode("utf-8"))
                    return result.get("response", "").strip()
                raise RuntimeError(f"Ollama yanıt kodu: {resp.status}")
        except urllib.error.URLError as ue:
            raise ConnectionError(f"Yerel Ollama servisine bağlanılamadı ({self.host}): {str(ue)}")
