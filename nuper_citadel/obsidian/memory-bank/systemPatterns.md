# System Patterns: Nuper Citadel

## 1. Mimari Felsefe: "Deterministik Çekirdek + Ayrık Üretken Ajan + Kapalı Döngü Doğrulama"
Nuper Citadel, savunma mühendisliğinin sıfır tolerans gereksinimini karşılamak için **katı bir katman ayrımı (Strict Separation of Concerns)** ve **kapalı döngü (closed-loop)** bir mühendislik akışı uygular:

1. **Deterministik Mühendislik Katmanı:** Geometri hesapları (kütle, atalet, CoG), montaj deliği tespiti, standart sınır şartları, PSD integralleri, fikstür rezonans kalınlığı, Palmgren-Miner yorulma hasarı ve FEA sonrası rezonans/notching hesapları **asla yapay zekâya bırakılmaz**. C++ tabanlı OpenCASCADE (`pythonocc-core`) ve ilişkisel veri tabanı (`SQLite`) ile matematiksel olarak çözülür.
2. **Üretken Yerel Zekâ Katmanı:** LLM (Qwen 2.5 Coder / Llama 3.3), deterministik katmanın ürettiği yapılandırılmış JSON verisini girdi alarak yalnızca metin sentezi, askeri ETP şablonu oluşturma ve arıza modu açıklamalarını derleme görevini üstlenir.
3. **Resmi Dokümantasyon Katmanı:** ReportLab vektörel motoruyla, akredite test laboratuvarlarının doğrudan kabul ettiği kurumsal A4 formatında, antetli, revizyonlu ve imza bloklu resmi PDF üretilir.
4. **Kapalı Döngü (Closed-Loop) Geri Besleme:** Pre-FEA çıktısından sonra, çözülen simülasyonun modal ve stres sonuçları sisteme geri beslenerek rezonans kaçınma ($f_1 > 1.2 \times f_{\max}$), dinamik amplifikasyon ($Q$) ve notching doğrulaması yapılır.
5. **Dinamik ve Genişletilebilir Standart/Malzeme Altyapısı:** Kullanıcılar askeri ve havacılık standartları (MIL-STD-810H, RTCA DO-160G, STANAG 4370) arasında geçiş yapabilir; kurumsal iç şartnamelerini (ASELSAN MYS vb.) ve özel test kuponu malzemelerini anında sisteme kaydedebilir.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           KULLANICI ARAYÜZÜ                                            │
│                       (Vite / Next.js / Tauri Desktop Shell - 127.0.0.1:Port)                          │
│   - STEP/STP Drag & Drop                   - 3D Gerçek B-Rep Mesh Önizleme & CoG / Delikler            │
│   - Standart Filtreleri (MIL/DO/STANAG/ÖZEL)- Malzeme Seçici & Canlı Özellik HUD Kartı (Akma, CTE vb.) │
│   - Özel Standart & Malzeme Modalları      - DIN 912 Tork & Ön Yük Tablosu                             │
│   - Pre-FEA Spektrum & APDL Kod İhracı    - Post-FEA Mod/Gerilme Doğrulama & Notching Kartı            │
│   - Askeri ETP Metin Düzenleyici (DPO)     - Resmi Askeri A4 PDF Rapor İndirme                         │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │ IPC / Yerel HTTP REST (127.0.0.1:8765)
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         FASTAPI YEREL ÇEKİRDEK                                         │
│                                                                                                        │
│  ┌────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────────────────┐  │
│  │ 1. CAD & BAĞLAYICILAR  │   │ 2. DETERMINİSTİK KURAL   │   │ 3. PRE-FEA ÖN-İŞLEMCİ                │  │
│  │  - OpenCASCADE C++     │──►│  - SQLite: MIL-STD-810H  │──►│  - 120-noktalı Log-Log PSD CSV       │  │
│  │  - Kütle, BBox, CoG    │   │  - RTCA DO-160G / STANAG │   │  - ANSYS APDL / Simcenter NX         │  │
│  │  - TopAbs_REVERSED Delik   │  - Özel Standart & Malzeme│  - Sınır Şartı & Fikstür Kalınlığı   │  │
│  │  - DIN 912 Tork/Ön Yük │   │  - Palmgren-Miner S-N    │   │  - ASME Y14.5 MMC CMM Köprüsü        │  │
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
│  │  - Kurumsal Antet, Tasnif Damgası, Doküman No, Tablolar, İmza Blokları                           │  │
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

### Modül 1: STEP/CAD & Bağlayıcı Ayrıştırıcı (`cad_parser.py`, `fastener_engine.py`)
- **Teknoloji:** `pythonocc-core` (`BRepMesh_IncrementalMesh`, `BRepGProp`, `TopExp_Explorer`, `TopAbs_REVERSED`).
- **Türetilen Değerler:**
  - Net hacim, kütle, bounding box, CoG koordinatları.
  - Sadece iç delikleri filtreleme (`TopAbs_REVERSED`), dış radyüsleri eleme.
  - ISO 273 normal/yakın geçme ve DIN 912 metrik cıvata boyutlandırması.
  - Sıkma torku ($M_A$), nominal ön yük ($F_M$) ve Nord-Lock pul reçetesi.

### Modül 2: Çoklu Standart ve Dinamik Kural Motoru (`rule_engine.py`)
- **Desteklenen Standart Aileleri:**
  - `MIL-STD-810H`: Kategori 14 Jet Uçak, Kategori 4 Kamyon/Treyler, Kategori 20 Helikopter.
  - `RTCA DO-160G`: Section 8 Titreşim (Curve S Robust Random, Curve B/C Uçak, Curve F Helikopter), Section 4 Sıcaklık/İrtifa, Section 7 Şok.
  - `STANAG 4370 / AECTP-400`: Method 401 Paletli ve Tekerlekli Zırhlı Araç Profilleri.
  - `ÖZEL ŞİRKET STANDARTLARI`: ASELSAN MYS, TUSAŞ vb. kullanıcı tarafından tanımlanan çok noktalı PSD kırılma frekansları, sıcaklık ve şok profilleri.
- **Kütle Sönümleme:** $((20 / M)^{0.15})$ analitik formülü.

### Modül 3: Pre-FEA & Fikstür Ön-İşlemcisi (`fea_exporter.py`, `fixture_engine.py`)
- **Formatlar:** 120-noktalı log-log enterpolasyonlu Simcenter NX ve ANSYS Table PSD `.csv`, APDL makrosu.
- **Fikstür Zarfı:** Sarsıcı tabla $50\times 50\text{ mm}$ M10 grid eşlemesi, analitik plaka bükülme frekansı ($f_1 \ge 1.20 \times f_{\max}$), $t_{\min}$ kalınlığı ve Alumec 89 / 7075-T6 malzeme seçimi.

### Modül 4: Post-FEA Kapalı Döngü Doğrulama Motoru (`post_fea_engine.py`)
- **Algoritmalar:**
  - **Rezonans Kaçınma Eşiği:** $f_1 > 1.20 \times f_{\max}$ (Güvenli) / $f_1 < f_{\max}$ (Kritik Rezonans).
  - **Dinamik Amplifikasyon Faktörü:** $Q = \frac{1}{2\zeta}$.
  - **Akma Emniyet Marjı:** $MS = \frac{\sigma_y}{\sigma_{\text{peak}} \times SF} - 1$.
  - **Çentikleme (Notching) Hesabı:**
    $$\Delta \text{dB} = 20 \log_{10}\left(\frac{\sigma_{\text{allowable}}}{\sigma_{\text{peak}}}\right)$$

### Modül 5: Resmi Askeri A4 PDF Rapor Motoru (`pdf_report_generator.py`)
- **Teknoloji:** Saf Python **ReportLab** vektörel motoru (Air-gapped, harici binary bağımsız).
- **Bölümler:** Resmi antet, doküman no, gizlilik damgası, parça kimliği, PSD kırılma tablosu, sıcaklık & şok profili, cıvata tork reçetesi, CMM toleransları, yorulma kabulü, post-FEA rezonans bloğu ve resmi onay/imza blokları.

### Modül 6: İleri Malzeme Kütüphanesi & Özel Malzeme Motoru
- **13 MMPDS / CMH-17 Malzemesi:** Al 6061-T6, Al 7075-T6, Alumec 89, Ti-6Al-4V, 4340 Çelik, 304 SS, C45, Kovar (Fe-Ni29-Co17), Invar 36, Inconel 718, CuBe2, PEEK, CFRP Quasi-Isotropic.
- **Özel Malzeme Tanımlama:** Akma dayanımı ($\sigma_y$), elastisite modülü ($E$), yoğunluk ($\rho$) ve CTE ($\alpha$) verilerini test kuponundan veritabanına işleme.

### Modül 7: Yerel LLM & Savunma Ajanı (`local_client.py`, `prompts.py`, `objection_agent.py`)
- **LLM:** Ollama / llama.cpp (`qwen2.5-coder:7b` / `14b`).
- **İtiraz Ajanı:** Sarsıcı ivmeölçer piklerinde ($\pm 3\text{ dB}$) resmi itiraz ve savunma mektubu üretir.

### Modül 8: DPO Telemetri Motoru (`feedback_engine.py`)
- Mühendis düzenlemelerini SQLite `telemetry.db` içinde `(prompt, chosen, rejected)` olarak depolar.

---

## 3. Gelecek Mimari Kalıpları (Roadmap System Patterns)

### 3.1. Çoklu Parça / Montaj (Assembly) Deseni (Sırada ⏳)
- Hiyerarşik montaj yapısı (`AssemblyNode: parent, children, transformation_matrix`).
- Çoklu STEP dosyalarının ayrıştırılması, birleşik kütle merkezi:
  $$\vec{R}_{\text{assembly}} = \frac{\sum m_i \vec{r}_i}{\sum m_i}$$
- Parçalar arası cıvata çemberi (bolt pattern) ve temas yüzeylerinin otomatik eşlenmesi.

### 3.2. Tauri 2 Yerel Masaüstü IPC Kalıbı (Sırada ⏳)
- Rust tabanlı Tauri v2 shell ile Python runtime'ının gömülü yönetimi.
- Tek `.exe` / `.msi` kurulumu ve Explorer'dan doğrudan sürükle-bırak.
