# System Patterns: Nuper Citadel

## 1. Mimari Felsefe: "Deterministik Çekirdek + Ayrık Üretken Ajan + Kapalı Döngü Doğrulama"
Nuper Citadel, savunma mühendisliğinin sıfır tolerans gereksinimini karşılamak için **katı bir katman ayrımı (Strict Separation of Concerns)** ve **kapalı döngü (closed-loop)** bir mühendislik akışı uygular:

1. **Deterministik Mühendislik Katmanı:** Geometri hesapları (kütle, atalet, CoG), montaj deliği tespiti, çoklu parça montaj integralleri ($\vec{R}_{\text{assembly}} = \sum m_i \vec{r}_i / M$), standart sınır şartları, PSD integralleri, fikstür rezonans kalınlığı, Palmgren-Miner yorulma hasarı ve FEA sonrası rezonans/notching hesapları **asla yapay zekâya bırakılmaz**. C++ tabanlı OpenCASCADE (`pythonocc-core`) ve ilişkisel veri tabanı (`SQLite`) ile matematiksel olarak çözülür.
2. **Üretken Yerel Zekâ Katmanı:** LLM (Qwen 2.5 Coder / Llama 3.3), deterministik katmanın ürettiği yapılandırılmış JSON verisini girdi alarak yalnızca metin sentezi, askeri ETP şablonu oluşturma ve arıza modu açıklamalarını derleme görevini üstlenir.
3. **Resmi Dokümantasyon Katmanı:** ReportLab vektörel motoruyla, akredite test laboratuvarlarının doğrudan kabul ettiği kurumsal A4 formatında, antetli, revizyonlu, montaj parça kırılımlı ve imza bloklu resmi PDF üretilir.
4. **Kapalı Döngü (Closed-Loop) Geri Besleme:** Pre-FEA çıktısından sonra, çözülen simülasyonun modal ve stres sonuçları sisteme geri beslenerek rezonans kaçınma ($f_1 > 1.2 \times f_{\max}$), dinamik amplifikasyon ($Q$) ve notching doğrulaması yapılır.
5. **Dinamik Montaj & Çoklu Standart Altyapısı:** Kullanıcılar tekil parça veya çoklu montaj gruplarını analiz edebilir; MIL-STD-810H, RTCA DO-160G, STANAG 4370 ve kurumsal iç şartnameler (ASELSAN MYS vb.) arasında geçiş yapabilir.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           KULLANICI ARAYÜZÜ                                            │
│                       (Vite / Next.js / Tauri Desktop Shell - 127.0.0.1:Port)                          │
│   - Tekil STEP veya Çoklu Montaj Drag & Drop - 3D Çoklu Parça Renklendirme & Bileşik CoG Küresi        │
│   - Montaj Hiyerarşisi Ağacı & Kütle Dağılımı- Parçalar Arası Bağlantı Cıvataları (Amber Halkalar)     │
│   - Standart Filtreleri (MIL/DO/STANAG/ÖZEL)- Malzeme Seçici & Canlı Özellik HUD Kartı (Akma, CTE vb.) │
│   - Pre-FEA Spektrum & APDL Kod İhracı    - Post-FEA Mod/Gerilme Doğrulama & Notching Kartı            │
│   - Askeri ETP Metin Düzenleyici (DPO)     - Resmi Askeri A4 PDF Rapor İndirme                         │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │ IPC / Yerel HTTP REST (127.0.0.1:8765)
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         FASTAPI YEREL ÇEKİRDEK                                         │
│                                                                                                        │
│  ┌────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────────────────┐  │
│  │ 1. CAD & MONTAJ MOTORU │   │ 2. DETERMINİSTİK KURAL   │   │ 3. PRE-FEA ÖN-İŞLEMCİ                │  │
│  │  - OpenCASCADE C++     │──►│  - SQLite: MIL-STD-810H  │──►│  - 120-noktalı Log-Log PSD CSV       │  │
│  │  - AssemblyEngine      │   │  - RTCA DO-160G / STANAG │   │  - ANSYS APDL / Simcenter NX         │  │
│  │  - Bileşik CoG & Kütle │   │  - Özel Standart & Malz. │   │  - Sınır Şartı & Fikstür Kalınlığı   │  │
│  │  - Inter-Part Delik Eş.│   │  - Kütle Sönümleme Kuralı│   │  - ASME Y14.5 MMC CMM Köprüsü        │  │
│  │  - DIN 912 Tork/Ön Yük │   │  - Palmgren-Miner S-N    │   │                                      │  │
│  └────────────────────────┘   └─────────────┬────────────┘   └──────────────────────────────────────┘  │
│                                             │                                                          │
│                                             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. POST-FEA KAPALI DÖNGÜ DOĞRULAMA (post_fea_engine.py)                                          │  │
│  │  - FEA Doğal Frekansları (f1, f2, f3) & Pik Gerilme Girdisi                                      │  │
│  │  - Rezonans Kaçınma Kontrolü: f1 > 1.20 * f_input                                                │  │
│  │  - Dinamik Büyütme Faktörü: Q = 1 / (2 * zeta)                                                   │  │
│  │  - Akma Emniyet Marjı: MS = (Sigma_y / (Sigma_peak * SF)) - 1                                     │  │
│  │  - Otomatik Çentikleme (Notching): Delta dB = 20 * log10(Sigma_allowable / Sigma_peak)           │  │
│  └──────────────────────────────────────────┬───────────────────────────────────────────────────────┘  │
│                                             │ Yapılandırılmış Context JSON                             │
│                                             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. YEREL LLM & SENTEZ KATMANI (local_client.py, prompts.py, objection_agent.py)                  │  │
│  │  - Ollama / llama.cpp (Qwen 2.5 Coder 7B / 14B)                                                  │  │
│  │  - Askeri ETP Şablonlama & Over-Testing İtiraz Savunma Mektubu                                   │  │
│  └──────────────────────────────────────────┬───────────────────────────────────────────────────────┘  │
│                                             │                                                          │
│                                             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 6. RESMİ SAVUNMA A4 PDF MOTORU (pdf_report_generator.py)                                         │  │
│  │  - ReportLab ile saf yerel A4 PDF üretimi (Harici C/GTK bağımlılığı yok)                         │  │
│  │  - Kurumsal Antet, Tasnif Damgası, Doküman No, Montaj Tablosu, İmza Blokları                     │  │
│  └──────────────────────────────────────────┬───────────────────────────────────────────────────────┘  │
│                                             │ Onay & Mühendis Revizyonu                                │
│                                             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 7. ADAPTİF GERİ BİLDİRİM & ÖĞRENME MOTORU (feedback_engine.py -> telemetry.db)                   │  │
│  │  - DPO çifti kaydı: (prompt, rejected, chosen, rating)                                            │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Temel Modüller ve İşlevleri

### Modül 1: Çoklu Parça / Montaj Analiz Motoru (`assembly_engine.py`, `cad_parser.py`)
- **Teknoloji:** `pythonocc-core` (`STEPControl_Reader`, `BRepGProp`, `BRepTools`, `TopExp_Explorer`, `TopAbs_SOLID`).
- **Türetilen Değerler & Deterministik Kurallar:**
  - Tekil compound STEP veya çoklu STEP dosyasından katı gövdeleri ayrıştırma.
  - Her parçanın hacmi, kütlesi ($m_i = V_i \times \rho_i$), CoG koordinatı ($\vec{r}_i$) ve delikleri.
  - **Deterministik Montaj Deliği vs. Köşe Radyüsü/Kavisi (Fillet) Ayrımı:**
    - Delik ve köşe kavislerinin her ikisi de `TopAbs_REVERSED` normaline sahiptir.
    - Silindirik yüzeyler kanonik 3D eksen doğrusu ($P_{\text{proj}}, \vec{D}$), yarıçap $R$ ve eksenel konuma ($t$) göre kümelenir.
    - $U$-aralığı üzerinden net çember açısal kapalılığı ($\ge 270^\circ$) hesaplanır. Açık geometriye sahip (tipik 90°) cep köşe kavisleri deterministik olarak elenir; $360^\circ$ dairesel kapalılığa sahip delikler ve split 180° yarım silindirler birleştirilerek gerçek montaj delikleri elde edilir.
  - Analitik bileşik kütle merkezi: $\vec{R}_{\text{assembly}} = \frac{\sum m_i \vec{r}_i}{\sum m_i}$.
  - Birleşik devrilme momenti kolu: $h_{cg} = |\vec{R}_{\text{assembly}, Z} - Z_{\min}|$.
  - Parçalar arası cıvata bağlantı deseni eşlemesi (`match_inter_part_joints`): Paralel eksenli ve $\le 1.2\text{ mm}$ radyal mesafeli delikleri montaj içi cıvata olarak sınıflandırma.
  - Taban sarsıcı montaj deliklerini (`BaseMountingInterface`) ayırma.
  - Çoklu parça tessellation meshleri ve havacılık renk kodları.

### Modül 2: Çoklu Standart ve Dinamik Kural Motoru (`rule_engine.py`)
- **Standart Aileleri:** MIL-STD-810H, RTCA DO-160G (Curve S, B/C, F), STANAG 4370 (Paletli/Tekerlekli), Özel Şirket Standartları (ASELSAN MYS vb.).
- **Kütle Sönümleme:** $((20 / M)^{0.15})$ analitik formülü.

### Modül 3: Pre-FEA & Fikstür Ön-İşlemcisi (`fea_exporter.py`, `fixture_engine.py`)
- **Formatlar:** 120-noktalı log-log enterpolasyonlu Simcenter NX ve ANSYS Table PSD `.csv`, APDL makrosu.
- **Fikstür Zarfı:** Sarsıcı tabla $50\times 50\text{ mm}$ M10 grid eşlemesi, analitik plaka bükülme frekansı ($f_1 \ge 1.20 \times f_{\max}$), $t_{\min}$ kalınlığı ve Alumec 89 / 7075-T6 malzeme seçimi.

### Modül 4: Post-FEA Kapalı Döngü Doğrulama & Çözücü Ayrıştırıcı (`post_fea_engine.py`)
- Rezonans kaçınma eşiği ($f_1 > 1.20 \times f_{\max}$), $Q$ faktörü, akma emniyet marjı ($MS$) ve çentikleme (notching) hesabı.
- **Doğrudan Çözücü Okuyucu:** MSC/NX Nastran `.f06` dosyalarından `REAL EIGENVALUES` modal frekanslarını ve tepe gerilmeyi otomatik regex ile çıkarma; ANSYS modal özetlerini çözümleme.

### Modül 5: Resmi Askeri A4 PDF Rapor Motoru (`pdf_report_generator.py`)
- ReportLab saf yerel motoruyla antetli, doküman numaralı, montaj parça kırılım tablolu, termal kalifikasyon dökümlü ve imza bloklu A4 PDF üretimi.

### Modül 6: İleri Malzeme Kütüphanesi & Özel Malzeme Motoru
- 13 MMPDS alaşımı ve kompoziti + test kuponu veri girişi.

### Modül 7: Yerel LLM & Savunma Ajanı (`local_client.py`, `prompts.py`, `objection_agent.py`)
- Ollama / llama.cpp (`qwen2.5-coder:7b`) ve aşırı test savunma dilekçesi ajanı.

### Modül 8: DPO Telemetri Motoru & LoRA Pipeline (`feedback_engine.py`, `export_dpo_dataset.py`)
- Mühendis düzenlemelerini SQLite `telemetry.db` içinde `(prompt, chosen, rejected)` olarak depolar.
- `export_dpo_dataset.py` ile HuggingFace / Unsloth formatında JSONL veri seti ve Qwen 2.5 7B LoRA fine-tuning konfigürasyonu üretir.

### Modül 9: MIL-STD-810H Metot 501.7 & 502.7 Termal Analiz Motoru (`thermal_engine.py`) *(YENİ)*
- Serbest boyutsal ısıl genleşme / büzülme ($\Delta L = L_0 \alpha \Delta T$).
- Gövde - Cıvata diferansiyel CTE gerilmesi ve VDI 2230 flanş yük hesabı ($\Delta F_{\text{th}}$).
- Sıcakta cıvata akma emniyeti ($MS_{\text{yield,hot}}$) ve soğukta ön yük gevşemesi / dinamik ayrılma emniyeti ($MS_{\text{separation}}$).

### Modül 10: Tauri 2 Masaüstü Mimarisi & Süreç Yaşam Döngüsü Yöneticisi (`src-tauri/`, `scripts/desktop_launcher.py`) *(YENİ)*
- Tauri 2 Rust kabuğu (`tray-icon`, `shell`, `fs`).
- Çocuk süreç yöneticisi: Uygulama açılışında FastAPI çekirdeğini başlatır, pencere kapandığında ağaç bazlı `kill` ile sıfır zombi süreç garantisi sağlar.
- `run_citadel.bat` ile tek tıkla yerel air-gapped masaüstü başlatıcı.

---

## 3. Gelecek Mimari Kalıpları (Roadmap System Patterns)

### 3.1. Uluslararasılaştırma (i18n) Mimarisi (Proje Bitiminde Yapılacak ⏸)
- Kullanıcı talimatı doğrultusunda projenin tüm teknik mühendislik geliştirmeleri bittikten sonra en son aşamada ele alınacaktır.
- React çift dilli mimari (Türkçe / İngilizce) ve A4 PDF raporunun hedef müşteriye göre (Savunma Sanayii Başkanlığı için Türkçe, NATO ihracatı için İngilizce) dinamik sentezi.

### 3.2. ANSYS `.rst` / NX `.op2` İkili (Binary) Dosya Ayrıştırıcı (Gelecek Aşama)
- Büyük ölçekli FEA sonuç dosyalarından yüzey gerilme tensörlerini ve deformasyon alanlarını ikili (binary) formatta doğrudan okuma.

