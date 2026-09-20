from typing import Dict, Any, Optional
from engine.llm.local_client import LocalLLMClient
from engine.llm.prompts import (
    DEFENSE_COPILOT_SYSTEM_PROMPT,
    build_objection_prompt
)


class ObjectionDefenseAgent:
    """
    Test merkezlerinde (sarsıcı tablalarda) meydana gelen kontrol kaybı,
    aşırı test (over-testing), fikstür rezonans girişimi gibi durumlarda
    akredite laboratuvara sunulacak resmi savunma ve itiraz dilekçesini üretir.
    """

    def __init__(self, llm_client: Optional[LocalLLMClient] = None):
        self.llm = llm_client or LocalLLMClient()

    def generate_defense_letter(
        self,
        part_name: str,
        platform_name: str,
        anomaly_description: str,
        recorded_frequency_hz: float,
        recorded_peak_g: float,
        nominal_grms: float,
        fixture_resonance_hz: Optional[float] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        prompt = build_objection_prompt(
            part_name=part_name,
            platform_name=platform_name,
            anomaly_description=anomaly_description,
            recorded_frequency_hz=recorded_frequency_hz,
            recorded_peak_g=recorded_peak_g,
            nominal_grms=nominal_grms,
            fixture_resonance_hz=fixture_resonance_hz
        )

        conn_status = self.llm.check_connection()
        if conn_status.get("connected"):
            try:
                letter_text = self.llm.generate(
                    prompt=prompt,
                    system=DEFENSE_COPILOT_SYSTEM_PROMPT,
                    model=model_name or conn_status.get("active_model"),
                    temperature=0.2
                )
                return {
                    "source": "LLM_GENERATED",
                    "model_used": model_name or conn_status.get("active_model"),
                    "letter_text": letter_text,
                    "target_standard": "MIL-STD-810H Part One & Method 514.8 Annex C"
                }
            except Exception as e:
                pass

        # Fallback Deterministik İtiraz Şablonu
        fallback_letter = f"""# ⚠️ RESMİ TEST ANOMALİSİ İTİRAZ VE SAVUNMA BİLDİRİMİ
**Muhatap:** Akredite Test Laboratuvarı Titreşim ve Şok Test Direktörlüğü  
**Konu:** {part_name} Kalifikasyon Testinde Gözlenen Rezonans Anomalisi ve Notching / Durdurma Talebi  
**Standart Referansı:** MIL-STD-810H, Part One (General Program Guidelines) ve Method 514.8 Annex C  

---

### 1. Test Bilgileri ve Gözlenen Anomali
- **Test Edilen Numune:** {part_name}
- **Görev Profili:** {platform_name} ({nominal_grms:.2f} gRMS nominal)
- **Kritik Frekans:** {recorded_frequency_hz:.1f} Hz
- **Ölçülen Tepe İvme:** {recorded_peak_g:.1f} g (Nominal değerin çok üzerinde)
- **Fikstür Rezonansı Şüphesi:** {fixture_resonance_hz or 'Belirtilmedi'} Hz
- **Açıklama:** {anomaly_description}

### 2. Mühendislik ve Standart Dayanağı
MIL-STD-810H Method 514.8 Annex C uyarınca, test fikstürünün veya sarsıcı tablanın kontrol döngüsünün test edilen numuneye beklenmeyen dar bant rezonans aktarması **'Aşırı Test (Over-Testing)'** teşkil eder. Bu durum parça üzerinde gerçeğe aykırı kümülatif yorulma hasarı (Palmgren-Miner $D > 0.20$) oluşturmaktadır.

### 3. Talep Edilen Düzeltici Eylem
1. İlgili test döngüsünün derhal durdurulması,
2. {recorded_frequency_hz:.1f} Hz civarında dar bant **'Kuvvet Sınırlama (Force Limiting)'** veya **'PSD Çentikleme (Notching)'** uygulanması,
3. Numunenin gereksiz yıpranması önlenerek testin kontrollü şartlarda tekrarlanması talep edilmektedir.
"""
        return {
            "source": "DETERMINISTIC_FALLBACK",
            "model_used": "Template Engine",
            "letter_text": fallback_letter,
            "target_standard": "MIL-STD-810H Part One & Method 514.8 Annex C"
        }
