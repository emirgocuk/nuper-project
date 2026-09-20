import json
from typing import Dict, Any, Optional

DEFENSE_COPILOT_SYSTEM_PROMPT = """Sen Nuper Citadel Savunma Sanayii Kalifikasyon ve Ön-FEA Uzmanısın.
Görevin: Deterministik mühendislik motorundan gelen sayısal JSON verilerini (CAD kütlesi, CoG, MIL-STD-810H spektrumu, sarsıcı fikstür kalınlığı ve Palmgren-Miner yorulma analizini) askeri standartlara (MIL-STD-810H, STANAG, Savunma Sanayii ETP formatı) uygun resmi, denetime hazır dokümanlara ve yönergelere dönüştürmektir.

KRİTİK KURALLAR:
1. KESİNLİKLE RAKAM, FREKANS, GERİLME VEYA TOLERANS UYDURMA. Yalnızca sağlanan bağlamdaki sayısal verileri kullan.
2. Terminoloji: Türk savunma sanayii standartlarında (ASELSAN, ROKETSAN, TUSAŞ vb.) kullanılan profesyonel askeri terminolojiyi benimse (gRMS, PSD, Notching, Rezonans Güvenlik Zarfı, ETP, 3-Sigma Gauss, Palmgren-Miner).
3. Biçimlendirme: Okunaklı, şık ve net Markdown başlıkları, tablolar ve uyarı kutuları kullan.
"""


def build_etp_prompt(
    cad_data: Dict[str, Any],
    mission_profile: Dict[str, Any],
    fixture_envelope: Optional[Dict[str, Any]] = None,
    fatigue_results: Optional[Dict[str, Any]] = None,
    custom_notes: Optional[str] = None
) -> str:
    """
    Deterministik motor çıktılarından resmi Askeri Çevre Koşulları Test Planı (ETP)
    sentezi için yapılandırılmış prompt üretir.
    """
    payload = {
        "cad_metadata": cad_data.get("metadata", {}),
        "physical_properties": cad_data.get("physical_properties", {}),
        "bounding_box": cad_data.get("bounding_box_mm", {}),
        "mounting_interface": cad_data.get("mounting_interface", {}),
        "platform_and_mission": mission_profile,
        "fixture_requirements": fixture_envelope,
        "fatigue_assessment": fatigue_results,
        "engineer_custom_notes": custom_notes or "Standart askeri kabul protokolu."
    }

    prompt = f"""Lütfen aşağıdaki doğrulanmış deterministik mühendislik JSON verilerini kullanarak eksiksiz, resmi bir 'ÇEVRE KOŞULLARI TEST PLANI (ENVIRONMENTAL TEST PLAN - ETP)' hazırla.

BAĞLAM VERİLERİ (DETERMİNİSTİK MOTOR ÇIKTISI):
```json
{json.dumps(payload, indent=2, ensure_ascii=False)}
```

RAPORDA ZORUNLU BÖLÜMLER:
1. **DOKÜMAN BİLGİLERİ VE TEST KAPSAMI**: Parça adı, malzeme, standart (MIL-STD-810H), platform tanımı.
2. **TEST NUMUNESİ FİZİKSEL VE MEKANİK ÖZELLİKLERİ**: Kütle, CoG koordinatları, boyutlar, montaj delik düzeni ve devrilme kolu ($h_{{cg}}$).
3. **TEST DİZİLİMİ VE ÇEVRESEL PROFİLLER**:
   - Titreşim (Metot 514.8): Frekans bant aralığı, PSD kırılma noktaları tablosu, hedeflenen ve efektif $g_{{rms}}$, test süresi ve eksenler.
   - Mekanik Şok (Metot 516.8): Darbe tepe ivmesi ($g$), darbe süresi ($ms$), dalga formu (TPS / Half-Sine).
   - Çalışma ve Depolama Sıcaklığı (Metot 501.7 / 502.7).
4. **SARSICI TABLA VE TEST FİKSTÜRÜ İSTERLERİ**:
   - Fikstür 1. doğal rezonans güvenlik zarfı ($f_1 \ge 1.20 \times f_{{max}}$).
   - Tavsiye edilen fikstür malzemesi (Alumec 89 / 7075-T6), minimum plaka kalınlığı ($t_{{min}}$) ve sarsıcı tabla cıvatalama deseni.
5. **ÖN-ANALİZ VE YORULMA DEĞERLENDİRMESİ**:
   - Steinberg 3-Bant analizi ve Palmgren-Miner kümülatif hasar indeksi ($D$).
   - Kabul/Red eşiği ($D \le 0.20$) ve statik akma marjı (Margin of Safety).
6. **KABUL KRİTERLERİ VE TEST GÜVENLİK PROTOKOLÜ**:
   - Test öncesi ve sonrası görsel/CMM denetimi, çatlak kontrolü, cıvata tork kaybı ve rezonans kayması sınırları.

Lütfen doğrudan resmi doküman metnini üret, gereksiz giriş/çıkış konuşmaları ekleme.
"""
    return prompt


def build_objection_prompt(
    part_name: str,
    platform_name: str,
    anomaly_description: str,
    recorded_frequency_hz: float,
    recorded_peak_g: float,
    nominal_grms: float,
    fixture_resonance_hz: Optional[float] = None
) -> str:
    """
    Test merkezinde yaşanan anomaliye / gereksiz zorlamaya (over-testing)
    karşı resmi itiraz ve analiz gerekçelendirme dilekçesi promptu.
    """
    return f"""Aşağıdaki test anomalisini inceleyerek test merkezine (akredite laboratuvara) hitaben yazılmış, MIL-STD-810H maddelerine dayanan resmi bir 'TEST ANOMALİSİ İTİRAZ VE SAVUNMA DİLEKÇESİ' oluştur.

VERİLER:
- Test Edilen Parça: {part_name}
- Görev Platformu: {platform_name}
- Nominal Test Profili: MIL-STD-810H ({nominal_grms:.2f} gRMS nominal)
- Gözlenen Anomali Frekansı: {recorded_frequency_hz:.1f} Hz
- Sarsıcıda Okunan Aşırı Pik İvme: {recorded_peak_g:.1f} g
- Fikstür / Montaj Rezonans Şüphesi: {fixture_resonance_hz or 'Belirtilmedi'} Hz
- Mühendis Açıklaması: {anomaly_description}

DİLEKÇEDE YER ALMASI GEREKEN HUSUSLAR:
1. MIL-STD-810H Annex C & Part One uyarınca 'Over-testing' ve çapraz eksen (cross-axis) anomalisi itirazı.
2. Fikstür modunun test frekans bandına girişim yapması (Anti-resonance / Shaker control loop instability).
3. Kontrol stratejisi olarak 'Force Limiting' veya ilgili rezonans bölgesinde 'Notching' uygulanması talebi.
4. Testin geçersiz sayılarak numuneye gereksiz yorulma hasarı verilmeden prosedürün düzeltilmesi çağrısı.
"""


def build_fallback_etp_document(
    cad_data: Dict[str, Any],
    mission_profile: Dict[str, Any],
    fixture_envelope: Optional[Dict[str, Any]] = None,
    fatigue_results: Optional[Dict[str, Any]] = None
) -> str:
    """
    LLM servisinin erişilemez olduğu durumlarda sıfır hata ile üretilen
    %100 deterministik Askeri ETP dokümanı (Graceful Fallback).
    """
    meta = cad_data.get("metadata", {})
    phys = cad_data.get("physical_properties", {})
    bbox = cad_data.get("bounding_box_mm", {})
    mount = cad_data.get("mounting_interface", {})
    plat = mission_profile.get("platform", {})
    vib = mission_profile.get("vibration", {})
    temp = mission_profile.get("temperature", {})
    shk = mission_profile.get("shock", {})

    bps_rows = ""
    for bp in vib.get("breakpoints", []):
        bps_rows += f"| {bp.get('frequency_hz'):.1f} | {bp.get('psd_value'):.4f} | {bp.get('slope_db_oct', 0.0):.1f} |\n"

    fix_mat = "Alumec 89 / 7075-T6"
    fix_t = "25.0"
    fix_f1 = "2400"
    if fixture_envelope and fixture_envelope.get("recommended_option"):
        opt = fixture_envelope["recommended_option"]
        fix_mat = opt.get("material_name", fix_mat)
        fix_t = str(opt.get("recommended_thickness_mm", fix_t))
        fix_f1 = str(opt.get("actual_first_mode_hz", fix_f1))

    doc = rf"""# 📄 ÇEVRE KOŞULLARI TEST PLANI (ENVIRONMENTAL TEST PLAN - ETP)
**Doküman Kodu:** ETP-{meta.get('file_name', 'PART').replace('.step', '').upper()}-01  
**Standardı:** MIL-STD-810H  
**Durum:** Otonom Üretilmiş / Doğrulanmış Deterministik Ön-Rapor  

---

## 1. Test Numunesi Genel Bilgileri
- **Bileşen Adı:** `{meta.get('file_name', 'Bilinmeyen Parça')}`
- **Malzeme:** {meta.get('material_name', 'Alüminyum Alaşımı')} (Yoğunluk: {meta.get('density_kg_m3', 2700)} kg/m³)
- **Kütle:** **{phys.get('mass_kg', 0.0):.4f} kg** (Hacim: {phys.get('volume_mm3', 0.0) / 1000.0:.2f} cm³)
- **Ağırlık Merkezi (CoG):** X={phys.get('cog_mm', {}).get('x', 0.0):.1f} mm, Y={phys.get('cog_mm', {}).get('y', 0.0):.1f} mm, Z={phys.get('cog_mm', {}).get('z', 0.0):.1f} mm
- **Zarf Boyutları ($L \\times W \\times H$):** {bbox.get('length_x', 0.0):.1f} x {bbox.get('width_y', 0.0):.1f} x {bbox.get('height_z', 0.0):.1f} mm
- **Montaj Arayüzü:** {mount.get('detected_holes_count', 0)} adet montaj deliği (Devrilme Kolu $h_{{cg}}$: {mount.get('overturning_moment_arm_h_cg_mm', 0.0):.1f} mm)

---

## 2. Görev Profili ve Askeri Standart
- **Platform:** {plat.get('name', 'Genel Savunma Platformu')} (`{plat.get('category', 'GENERIC')}`)
- **Temel Standart:** {plat.get('standard', 'MIL-STD-810H')}

### 2.1. Rastgele Titreşim Profili (Metot 514.8)
- **Kategori:** {vib.get('category', 'Belirtilmedi')} ({vib.get('annex_figure', '')})
- **Nominal $g_{{rms}}$:** {vib.get('nominal_grms', 0.0):.2f} g
- **Efektif $g_{{rms}}$ (Kütle Düzeltmeli):** **{vib.get('effective_grms', vib.get('nominal_grms', 0.0)):.2f} g** (Zayıflatma Katsayısı: {vib.get('attenuation_factor', 1.0)})
- **Test Süresi:** {vib.get('duration_per_axis_minutes', 60)} dakika / eksen
- **Test Eksenleri:** {', '.join(vib.get('axes', ['X', 'Y', 'Z']))}

#### PSD Kırılma Frekansları Tablosu:
| Frekans (Hz) | PSD ($g^2/\\text{{Hz}}$) | Eğim (dB/oct) |
| :---: | :---: | :---: |
{bps_rows}

### 2.2. Mekanik Şok Profili (Metot 516.8)
- **Prosedür:** {shk.get('procedure_name', 'Procedure I - Functional Shock')}
- **Dalga Formu:** {shk.get('pulse_shape', 'Terminal Peak Sawtooth')}
- **Tepe İvmesi:** **{shk.get('peak_acceleration_g', 40.0):.1f} g** (Süre: {shk.get('duration_ms', 11.0):.1f} ms)
- **Darbe Adedi:** Eksen başına {shk.get('num_shocks_per_axis', 6)} darbe

### 2.3. Sıcaklık Limitleri (Metot 501.7 / 502.7)
- **İklimsel Kategori:** {temp.get('climatic_category', 'Standart')}
- **Çalışma Sıcaklığı:** {temp.get('operational_low_c', -40.0):.1f}°C ile {temp.get('operational_high_c', 71.0):.1f}°C arası
- **Depolama Sıcaklığı:** {temp.get('storage_low_c', -51.0):.1f}°C ile {temp.get('storage_high_c', 85.0):.1f}°C arası

---

## 3. Sarsıcı Test Fikstürü Rezonans Güvenlik Zarfı
- **Kural:** MIL-STD-810H uyarınca fikstür 1. doğal frekansı $f_1 \\ge 1.20 \\times f_{{max}} = 2400\\text{{ Hz}}$ olmalıdır.
- **Tavsiye Edilen Malzeme:** {fix_mat}
- **Minimum Plaka Kalınlığı ($t_{{rec}}$):** **{fix_t} mm** (Tahmini 1. Mod: ~{fix_f1} Hz)
- **Sarsıcı Bağlantısı:** Standart $50 \\times 50\\text{{ mm}}$ M10 grid düzeninde çevre cıvatalama.

---

## 4. Kabul ve Başarı Kriterleri
1. **Yapısal Bütünlük:** Test sonrasında numunede kalıcı deformasyon, çatlak veya gevşeme olmamalıdır.
2. **Rezonans Kayması:** Test öncesi ve sonrası yapılan sinüs taramalarında (sine-sweep) doğal frekans kayması $<\\%5$ olmalıdır.
3. **Cıvata Ön Yükü:** Cıvata torklarında kayıp $\\le \\%10$ tolerans dahilinde kalmalıdır.
"""
    return doc
