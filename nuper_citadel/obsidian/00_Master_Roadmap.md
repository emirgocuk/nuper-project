---
title: Nuper Citadel - Master Geliştirme Yol Haritası (Faz 1 - Faz 5)
created: 2026-09-20
tags:
  - roadmap
  - implementation-plan
  - master-plan
  - phases
---

# 🚀 Nuper Citadel: Master Geliştirme Yol Haritası (Faz 1 - Faz 5)

Nuper Citadel'in kavramsal tasarımını; sahada çalışan, air-gapped çalışan, lisans korumalı ve akredite test laboratuvarları tarafından doğrulanabilir ticari bir savunma mühendisliği ürününe dönüştürmek için 5 ana fazdan oluşan geliştirme planıdır.

```
┌─────────────────────────────────────────────────────────────────────────┐
│              NUPER CITADEL GÖREV VE FAZ DAĞILIM ÇİZELGESİ               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [FAZ 1: Deterministik Çekirdek] ──► OpenCASCADE + SQLite + PSD CSV    │
│            │                                                            │
│            ▼                                                            │
│  [FAZ 2: Yerel LLM & Sentez]     ──► Ollama/Qwen + ETP + İtiraz Motoru  │
│            │                                                            │
│            ▼                                                            │
│  [FAZ 3: Masaüstü Arayüzü]       ──► Tauri v2 + Next.js + Three.js 3D   │
│            │                                                            │
│            ▼                                                            │
│  [FAZ 4: Operasyonel Güvenlik]   ──► Offline RSA Lisans + STEP Sanitizer│
│            │                                                            │
│            ▼                                                            │
│  [FAZ 5: Golden Test & Dağıtım]  ──► 3 Savunma Vaka Doğrulaması + Setup │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 Faz Özeti ve Teslim Edilecek Çıktılar

| Faz | Odak Alanı | Çekirdek Teknolojiler | Temel Çıktı / Miladi |
| :--- | :--- | :--- | :--- |
| **FAZ 1** | **Deterministik Çekirdek & Matematik** | Python 3.11, OpenCASCADE, SQLite | `cad_parser.py`, `rule_engine.py`, `fea_exporter.py`, `fatigue_engine.py`, `fixture_engine.py` |
| **FAZ 2** | **Yerel LLM & Doküman Sentezi** | Ollama, Qwen 2.5 Coder 14B, SQLite | `local_client.py`, `prompts.py`, `objection_agent.py`, `telemetry.db` (DPO) |
| **FAZ 3** | **Masaüstü Kabuğu & 3D Arayüz** | Tauri v2 (Rust), Next.js, Three.js | 3D CoG/delik HUD önizleme, profil yapılandırıcı, canlı ETP editörü |
| **FAZ 4** | **Operasyonel Güvenlik & Lisans** | Rust FFI, Asimetrik RSA-2048 | Donanım kilitli Machine ID, `.lic` dosya doğrulaması, EULA sorumluluk modalı |
| **FAZ 5** | **Golden Test Bench & Dağıtım** | Pytest, TÜBİTAK SAGE Benchmarks | 3 gerçek savunma vaka doğrulaması (Ground truth kıyaslaması), tek tık kurulum `.msi` |

---

## 🛠️ Detaylı Faz Kırılımları

### FAZ 1: Deterministik Çekirdek ve Matematik Omurgası (Engine Core)
- **`engine/core/cad_parser.py`**:
  - OpenCASCADE `STEPControl_Reader` ile geometri aktarımı.
  - `BRepCheck_Analyzer` ile manifold/katı gövde kontrolü (Input Sanitization).
  - `BRepGProp` ile hacim, kütle, CoG koordinatları ve atalet tensörü hesabı.
  - `TopExp_Explorer` ile silindirik yüzey taraması (Montaj delik çapları, merkezleri ve yayılım açıklığı).
  - Devrilme kolu ($h_{cg} = |Z_{cg} - Z_{mount}|$) hesabı.
  - Çoklu katı gövde (assembly) tespitinde en büyük ana parçayı seçme mantığı.
- **`engine/data/standards.db` & `seed_standards.py`**:
  - SQLite şemasının kurulması (`military_platforms`, `vibration_profiles`, `vibration_breakpoints`, `temperature_profiles`).
  - MIL-STD-810H Metot 514.8 Kategori 14 (İHA Dış Yük), Kategori 4 (Kara Aracı), Kategori 20 (Helikopter) verilerinin seed edilmesi.
  - Metot 501.7 / 502.7 Basic Hot / Basic Cold sıcaklık sınırlarının eklenmesi.
- **`engine/core/rule_engine.py`**:
  - Görev profili eşleme motoru (Seçilen platform $\rightarrow$ ilgili standart profili).
  - Kırılma frekansları ($f_1..f_4$) ve log-log eğimleri ($\text{dB/octave}$) üzerinden $g_{\text{rms}}$ integrasyonunun matematiksel hesabı.
  - Kütle sönümleme faktörü (Mass attenuation) düzeltmeleri.
- **`engine/core/fea_exporter.py`**:
  - 20 Hz - 2000 Hz arasında 100+ ayrık frekans noktasına log-log interpolasyon.
  - Simcenter NX (`.csv`, `.afu`) ve ANSYS Mechanical Table PSD formatında dışa aktarma.
  - Modal analiz ve sınır şartı tavsiye yönergesi derleyicisi (%85 kütle katılımı kuralı, Fixed constraint).
- **`engine/core/fatigue_engine.py`**:
  - Steinberg 3-Bant Gauss gerilme döngü dağılımı ($1\sigma, 2\sigma, 3\sigma$).
  - Basquin S-N eğrisi parametreleri ile Palmgren-Miner kümülatif hasar ($D = \sum n_i/N_i$) hesabı ($D \le 0.20$).
- **`engine/core/fixture_engine.py`**:
  - Sarsıcı tablası grid eşleme ($50\times 50\text{ mm}$ M10 grid).
  - Plaka eğilme formülleri ile minimum et kalınlığı ($t_{\text{min}}$) ve Alumec 89 / 7075-T6 zarfı türetimi ($f_1 > 2400\text{ Hz}$).
- **`engine/api/routes.py`**:
  - FastAPI yerel REST endpoint'leri (`/api/cad/parse`, `/api/rules/evaluate`, `/api/fea/export-psd`, `/api/fatigue/calculate`).

---

### FAZ 2: Yerel Yapay Zekâ ve Dokümantasyon Sentezi (Local LLM & DPO)
- **`engine/llm/local_client.py`**: Ollama REST API köprüsü (`http://127.0.0.1:11434`) ve Qwen 2.5 Coder 14B bağlantısı.
- **`engine/llm/prompts.py`**: Sayısal tolerans uydurmayı yasaklayan strict prompt ve resmi 8 bölümlük ETP şablonu.
- **`engine/llm/objection_agent.py`**: Shaker piklerinde ($\pm 3\text{ dB}$) MIL-STD-810H Bölüm 4.2.2 tolerans hükümlerine dayalı teknik itiraz dilekçesi ve TDP şartname denetimi.
- **`engine/data/telemetry.db` & `feedback_engine.py`**: Mühendisin arayüzdeki düzenlemelerini kaydeden DPO veri tabanı (`prompt`, `rejected`, `chosen`).

---

### FAZ 3: Masaüstü Kabuk ve Görsel Arayüz (Tauri v2 + Next.js + Three.js)
- **`src-tauri/`**: Rust yerel kabuk, yerel IPC yönetimi ve FastAPI yan sürecini (sidecar daemon) başlatma/kapatma.
- **`frontend/`**:
  - **3D STEP Viewer (`StepViewer.tsx`):** CoG kırmızı küresi, montaj delik halkaları ve $h_{cg}$ ölçü çizgisi.
  - **Görev Yapılandırıcı (`MissionConfigurator.tsx`):** Platform, malzeme ve standart seçim matrisi.
  - **PSD Grafiği (`PsdChart.tsx`):** Log-log interaktif frekans grafiği.
  - **Canlı ETP Editörü (`ReportEditor.tsx`):** A4 Markdown önizleme, inline düzenleme ve DPO onayı.

---

### FAZ 4: Operasyonel Güvenlik, Lisanslama ve Hukuki Koruma
- **`src-tauri/src/licensing.rs`**: Anakart UUID + CPU ID + MAC adresinden SHA-256 Machine ID donanım parmak izi.
- **Çevrimdışı RSA-2048 Doğrulama**: Gömülü public key ile `.lic` dosyasını çevrimdışı doğrulama ve süre kilit sistemi.
- **`frontend/components/EulaModal.tsx`**: "Ön Doğrulama ve Karar Destek Aracı" yasal feragatname onay ekranı.

---

### FAZ 5: Golden Test Bench, Doğrulama ve Dağıtım - [x] %100 TAMAMLANDI
- **Savunma Kıyaslama Vakaları (`tests/golden_benchmarks/`):**
  - Vaka 1: Aviyonik Şasi Kutusu (MIL-STD-810H Cat 14 Titreşim).
  - Vaka 2: Titanyum Sensör Bağlantı Braketi (Metot 516.8 Şok).
  - Vaka 3: İHA Kanat Altı Pod Pylon Aksamı (Termo-Mekanik Kombine).
- **Test Başarısı:** 44/44 test başarıyla geçti.

---

### FAZ 6: Sıralı Analiz İş İstasyonu & Gerçek Savunma Parçası Doğrulaması - [x] %100 TAMAMLANDI
- **5 Aşamalı Sıralı Analiz Boru Hattı:** Girdi/Kurulum $\rightarrow$ 3D CAD & Bağlayıcılar $\rightarrow$ GD&T/CMM $\rightarrow$ Pre-FEA $\rightarrow$ Askeri Kabul.
- **Gerçek Parça Doğrulaması:** ASELSAN Röle Bağlantı Parçası (`ROLE BAGLANTI PARCA_AA (1).stp`) ve 2D çizimi (`ROLE BAGLANTI PARCA_TR_AA-1.pdf`).
- **OpenCASCADE `TopAbs_REVERSED`:** İç delik / dış kavis ayrımı kesinleştirildi.
- **FastenerEngine:** DIN 912 tork ve ön yük hesaplama tablosu entegre edildi.

---

### FAZ 6.2: Post-FEA Kapalı Döngü & Resmi Askeri A4 PDF Raporu - [x] %100 TAMAMLANDI *(UYGULANDI)*
- **`engine/core/post_fea_engine.py`**:
  - Rezonans kaçınma kontrolü ($f_1 > 1.20 \times f_{\max}$).
  - Dinamik büyütme faktörü ($Q = 1/(2\zeta)$).
  - Akma emniyet marjı ($MS = (\sigma_y / (\sigma_{\text{peak}} \times SF)) - 1$).
  - Otomatik çentikleme (notching) derinliği ($\Delta \text{dB} = 20 \log_{10}(\sigma_{\text{allowable}} / \sigma_{\text{peak}})$).
- **`engine/core/pdf_report_generator.py`**:
  - ReportLab ile kurumsal antetli, doküman no'lu, gizlilik damgalı ("TASNİF DIŞI / UNCLASSIFIED"), tüm analiz tablolarını ve resmi onay imza bloklarını içeren A4 PDF üretimi.
- **Frontend & API Entegrasyonu:** Step 4 Post-FEA paneli ve Step 5 A4 PDF indirme akışı tamamlandı.
- **Testler:** 52/52 PASSED (%100 Başarı).

---

### 🔮 Nuper Citadel Kapsamlı İnceleme (Review) İleri Yol Haritası
*(Detaylar için bkz: [[nuper_citadel_review|nuper_citadel_review.md]])*

| Zaman Çizelgesi | Hedef Özellik / Modül | Durum |
| :--- | :--- | :---: |
| **Kısa Vade (1-3 Ay)** | Resmi A4 PDF ETP Raporu (ReportLab) | **TAMAMLANDI ✅** |
| **Kısa Vade (1-3 Ay)** | Post-FEA Kapalı Döngü & Notching | **TAMAMLANDI ✅** |
| **Kısa Vade (1-3 Ay)** | RTCA DO-160G Standardı Ekleme (Sivil Havacılık) | **SIRADA ⏳** |
| **Kısa Vade (1-3 Ay)** | Tauri 2 Desktop Paketleme (Tek .exe / embedded Python) | **SIRADA ⏳** |
| **Orta Vade (3-6 Ay)** | Çoklu Parça / Montaj (Assembly CoG & Cıvata Matrisi) | **Yol Haritasında** |
| **Orta Vade (3-6 Ay)** | STANAG 4370 / AECTP-400 (NATO Çevre Standartları) | **Yol Haritasında** |
| **Orta Vade (3-6 Ay)** | Kompozit Malzeme Katmanı (CFRP/GFRP Ply Stack) | **Yol Haritasında** |
| **Orta Vade (3-6 Ay)** | Uluslararasılaştırma (İngilizce i18n Lokalizasyon) | **Yol Haritasında** |
| **Uzun Vade (6-12 Ay)** | telemetry.db DPO Verisi ile Yerel LoRA Fine-Tuning | **Yol Haritasında** |
| **Uzun Vade (6-12 Ay)** | ANSYS .rst / NX .op2 Doğrudan Sonuç Ayrıştırıcı | **Yol Haritasında** |
| **Uzun Vade (6-12 Ay)** | Termo-Mekanik Sıcaklık Gradyanı ve Ön Yük Kaybı Analizi | **Yol Haritasında** |
| **Uzun Vade (6-12 Ay)** | Kurumsal PLM/PDM (Teamcenter / Windchill) Entegrasyonu | **Yol Haritasında** |

---
Bağlantılı Notlar:
- [[00_System_Architecture_Blueprint|Sistem Mimarisi Blueprint]]
- [[07_Commercial_and_Operational_Pillars|Operasyonel Güvenlik ve Lisanslama]]
- [[00_Nuper_Citadel_MOC|Master MOC]]
- [[nuper_citadel_review|Kapsamlı Proje İncelemesi ve Öneriler]]
