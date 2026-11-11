# Nuper Ortho — Büyük Mimari ve Fiziksel AI Uygulama Şartnamesi (Faz 6 – Faz 25)

> **Amaç ve Vizyon:** YC RFS 2026 "Physical AI" vizyonu doğrultusunda, Nuper Ortho'yu CAD/B-Rep geometrisi, 2D teknik resimler, CMM kinematik yolu, metrolojik kalite denetimi ve kapalı döngü (closed-loop) CNC takım aşınma düzeltmesini otonom olarak icra eden **Dünyanın İlk Egemen Otonom Kalite Derleyicisi (Sovereign Autonomous Quality Compiler)** seviyesine taşımaktır.

---

## 1. Metodolojik Temeller (GitHub Kaynaklı Beceriler Sentezi)

Bu yol haritasındaki tüm fazlar, [memory-bank/github-founded-skills.md](github-founded-skills.md) belgesindeki 5 temel açık kaynak metodolojisinin kurumsal senteziyle yürütülür:

1. **`obra/superpowers` (Disiplinli Agentic SDLC & TDD):**
   - Her faz; Tasarım $\to$ İzole Geliştirme $\to$ Planlama $\to$ TDD (Önce Başarısız Test) $\to$ Kod İnceleme $\to$ Doğrulama adımlarıyla tamamlanır. Kod yazılmadan önce doğrulama testi hazırdır.
2. **`Graphify-Labs/graphify` (Deterministik Topolojik Bilgi Grafiği):**
   - Kod tabanı, IPC sözleşmeleri ve STEP B-Rep katı modelleri vektör veritabanına veya yapay zeka halüsinasyonuna gerek duymadan yönlü çizge (DAG) olarak modellenir.
3. **`juliusbrussee/caveman` (Zero-Fluff ve Yüksek Verimli İkili Haberleşme):**
   - Ajan içi ve CMM telemetri haberleşmesinde metin tabanlı gürültü elenir; byte-byte hassas ikili (binary) arabellekler kullanılır.
4. **`DietrichGebert/ponytail` (Minimalizm ve YAGNI Kuralı):**
   - "En iyi kod hiç yazılmamış koddur." Erken soyutlamalar, gereksiz wrapper'lar ve kullanılmayan farazi özellikler yasaktır.
5. **`multica-ai/andrej-karpathy-skills` (LLM Hata Kalkanı):**
   - Sessiz varsayım yasaktır; belirsiz ölçülerde mühendis kararı istenir; hiçbir kod değişikliği çalışan diğer modüllere yan hasar (collateral damage) veremez.

---

## 2. Faz Matrisi ve Blok Sınıflandırması

| Blok | Kapsanan Fazlar | Temel Odak Alanı | Çıktı Standardı |
|---|---|---|---|
| **Blok A** | **Faz 6 – Faz 8** | Çekirdek Geometri, Topoloji ve Metrolojik Standartlar | OpenCASCADE B-Rep DAG, ASME Y14.5-2018 GD&T, PTB Onaylı Chebyshev/GUM |
| **Blok B** | **Faz 9 – Faz 14** | Kinematik, Prob Donanımı ve Makine Sürücüleri | Zero-Copy Binary IPC, 5-Eksen REVO/PH20, Lazer Çizgi, MCR20 Rack, I++ DME, BVH GJK/EPA |
| **Blok C** | **Faz 15 – Faz 20** | Kapalı Döngü İmalat, Raporlama ve Kalite Güvencesi | Çoklu CNC G10/$TC_DP12, AS9102 Rev C FAI, Paletleme, Karpathy Kalkanı, E2E Test |
| **Blok D** | **Faz 21 – Faz 25** | Fiziksel AI ve Egemen Otonom Derleyici | FIPS/Air-Gap Lisans, Dokunmatik UI, Termal Gradyan, Scan-to-STEP, Sovereign Loop 2.0 |

---

## 3. Blok A: Çekirdek Geometri, Topoloji ve Metroloji (Faz 6 – Faz 8)

### FAZ 6: B-Rep Topolojik Bilgi Grafiği (`BRepGraphEngine`)
* **Problem ve Kök Neden:** Regex veya metin eşleştirmesi, STEP dosyasındaki unsur içi ve unsurlar arası geometrik ilişkileri (örneğin kademeli havşa delikler, karşıt paralel et kalınlıkları, teğet pah ve radyuslar) göremez. Bu durum 2D ölçülerin 3D katı modelle eşleştirilmesinde yanılgıya yol açar.
* **Matematiksel ve Algoritmik Altyapı:**
  - OpenCASCADE B-Rep topolojisi yönlü çizge (DAG) yapısına dönüştürülür:
    $$\text{Solid} \longrightarrow \text{Shell} \longrightarrow \text{Face} \longrightarrow \text{Wire} \longrightarrow \text{Edge} \longrightarrow \text{Vertex}$$
  - `petgraph::graph::DiGraph<BRepNode, BRepEdge>` veri yapısı kurulur.
  - Düğüm (Node) Tipleri: `FaceNode` (Düzlem, Silindir, Koni, Torus, B-Spline parametreleri, yüzey alanı, normal vektörü $\vec{n}$, eksen $\vec{a}$, tepe/taban kotları).
  - Kenar (Edge) Tipleri:
    1. `AdjacentFaces`: Ortak bir B-Rep kenarını (`TopoDS_Edge`) paylaşan komşu yüzeyler.
    2. `CoaxialCylinders`: Eksenleri çakışan silindirik yüzeyler ($|\vec{a}_1 \times \vec{a}_2| < 10^{-5}$ ve $|(\vec{p}_1 - \vec{p}_2) \times \vec{a}_1| < 10^{-4}\text{ mm}$). Kademeli delik ve pim gruplarını temsil eder.
    3. `ParallelPlanes`: Normalleri paralel ($|\vec{n}_1 \times \vec{n}_2| < 10^{-5}$) ve dik mesafesi $d = |(\vec{p}_2 - \vec{p}_1) \cdot \vec{n}_1|$ olan yüzey çiftleri.
    4. `OppositeNormals`: $\vec{n}_1 \cdot \vec{n}_2 \approx -1.0$ olan karşıt yüzeyler (et kalınlığı ve kanal genişlikleri).
* **Etkilenen Dosyalar:**
  - `crates/ortho-brep/src/graph.rs`
  - `crates/ortho-brep/src/step_parser.rs`
  - `tools/extractor/brep_verifier.py`
  - `ui/src/modules/cad/utils/StepModelTessellator.ts`
* **Kabul Kriteri ve Doğrulama:**
  - 10142739 nolu parçadaki kademeli delikler ve cıvata dairesi desenleri sıfır metin araması ile $O(1)$ sürede grafikten sorgulanır.

---

### FAZ 7: ASME Y14.5-2018 ve ISO 1101 GD&T Kural Motoru
* **Problem ve Kök Neden:** Basit iki nokta mesafe ve çap ölçümleri, havacılık ve otomotiv parçalarındaki geometrik toleransları (GD&T) ve malzeme durumu modifiyerlerini (MMC/LMC) doğrulayamaz.
* **Matematiksel ve Algoritmik Altyapı:**
  - 15 Geometrik Tolerans Sembolünün Matematiksel Değerlendirmesi:
    1. *Form:* Düzlemsellik (Flatness: $\min_{\text{planes}} |z_{\max} - z_{\min}|$), Doğrusallık (Straightness), Yuvarlaklık (Circularity), Silindiriklik (Cylindricity).
    2. *Yönelim:* Diklik (Perpendicularity: $|\vec{n} \cdot \vec{d}_{\text{datum}}| \approx 0$), Açısallık (Angularity), Paralellik (Parallelism).
    3. *Konum:* Konum Doğruluğu (True Position: $2\sqrt{(x_m - x_t)^2 + (y_m - y_t)^2}$), Eşmerkezlilik (Concentricity), Simetri (Symmetry).
    4. *Profil:* Yüzey Profili (Profile of a Surface), Çizgi Profili (Profile of a Line) — iki taraflı (bilateral) ve tek taraflı (unilateral).
    5. *Salgı:* Dairesel Salgı (Circular Runout), Toplam Salgı (Total Runout).
  - Malzeme Durumu Modifiyerleri (Material Condition Modifiers):
    - En Çok Malzeme Durumu (MMC $\textcircled{\small M}$): Delikler için bonus tolerans formülü:
      $$B = \max(0.0, D_{\text{measured}} - D_{\text{MMC}})$$
      Miller/şaftlar için bonus tolerans formülü:
      $$B = \max(0.0, D_{\text{MMC}} - D_{\text{measured}})$$
      Toplam İzin Verilen Tolerans Bölgesi = $T_{\text{specified}} + B$.
    - En Az Malzeme Durumu (LMC $\textcircled{\small L}$): Kritik et kalınlığı emniyeti için ters bonus hesabı.
    - İzdüşürülmüş Tolerans Bölgesi (Projected Tolerance Zone $\textcircled{\small P}$): Cıvata bağlantıları için parça dışına taşan $h_{\text{proj}}$ silindirik hacmi.
* **Etkilenen Dosyalar:**
  - `crates/ortho-ast/src/composite_gdandt.rs`
  - `crates/ortho-ast/src/tolerance.rs`
  - `ui/src/modules/inspection/utils/InspectionCardFormatter.ts`
* **Kabul Kriteri ve Doğrulama:**
  - MMC ve bileşik tolerans çerçevesi (Composite Feature Control Frame: PLTZF ve FRTZF) içeren 15 sentetik tolerans testi %100 yeşil geçer.

---

### FAZ 8: PTB Onaylı Metrolojik Fitting ve GUM ISO 15530-3 Belirsizlik Motoru
* **Problem ve Kök Neden:** Standart Gauss En Küçük Kareler (LSQ) yöntemi hataları kareleyerek ortalama geometri üretir; ancak montaj ve geçme şartlarında parçanın fiziksel temas sınırını temsil edemez (delik içine geçecek pimin sıkışması).
* **Matematiksel ve Algoritmik Altyapı:**
  - 4 Temel Metrolojik Fitting Algoritması:
    1. *Gauss LSQ:* $\min \sum d_i^2$ (Genel geometrik form değerlendirmesi).
    2. *Minimum Zone Chebyshev ($L_\infty$):* $\min \max_i |d_i|$ (Düzlemsellik ve silindiriklikte ISO 1101 standardı). Doğrusal programlama (Simplex / Interior Point) ile çözülür.
    3. *Maksimum İç Teğet Eleman (MIC):* Ölçülen nokta bulutunun içine sığabilen en büyük silindir/çember (Delik montajında en kritik geçme zarfı).
    4. *Minimum Dış Çevrel Eleman (MCC):* Ölçülen noktaları içine alan en küçük silindir/çember (Mil montajında en kritik geçme zarfı).
  - ISO/IEC Guide 98-3 (GUM) ve ISO 15530-3 Ölçüm Belirsizliği:
    - Birleşik standart belirsizlik:
      $$u_c = \sqrt{u_{\text{rep}}^2 + u_{\text{cal}}^2 + u_{\text{geo}}^2 + u_{\text{temp}}^2 + u_{\text{fixture}}^2}$$
    - Genişletilmiş Belirsizlik: $U_{95} = 2.0 \cdot u_c$ ($k=2$, $\%95$ güven aralığı).
    - Test Belirsizlik Oranı (TUR):
      $$\text{TUR} = \frac{\text{Tolerans Aralığı}}{2 \cdot U_{95}}$$
    - Eğer $\text{TUR} < 4.0$ ise sistem ISO 14253-1 Karar Kuralı (Guardbanding) uygulayarak kabul bölgesini $U_{95}$ kadar daraltır.
* **Etkilenen Dosyalar:**
  - `crates/ortho-kinematics/src/fitting.rs`
  - `crates/ortho-kinematics/src/uncertainty.rs`
  - `tools/extractor/metrology_fitting.py`
* **Kabul Kriteri ve Doğrulama:**
  - Physikalisch-Technische Bundesanstalt (PTB) referans veri setleri üzerinde fitting hesaplama sapması $< 10^{-7}\text{ mm}$ olarak onaylanır.

---

## 4. Blok B: Kinematik, Prob Donanımı ve Makine Sürücüleri (Faz 9 – Faz 14)

### FAZ 9: Zero-Copy Yüksek Hızlı İkili IPC Protokolü
* **Problem ve Kök Neden (Caveman İlkesi):** Yüksek hızlı prob hareketinde veya 50.000 noktalık lazer taramasında JSON string serileştirme ana iş parçacığında çöptoplar (GC) takılmalarına ve FPS düşüşlerine neden olur.
* **Matematiksel ve Algoritmik Altyapı:**
  - Sabit Başlıklı 80-Byte İkili Telemetri Paketi (Binary Layout):
    - `magic`: 4 bayt (`0x4E555052` - "NUPR")
    - `timestamp_ns`: 8 bayt tam sayı (`u64`)
    - `probe_pos`: 24 bayt (`[f64; 3]` - X, Y, Z merkez koordinatları)
    - `probe_normal`: 24 bayt (`[f64; 3]` - temas yüzeyi normali)
    - `head_a, head_b`: 16 bayt (`[f64; 2]` - PH10 veya REVO bilek açıları)
    - `status_flags`: 4 bayt bit maskesi (Hareket, Temas, Tetikleme, E-Stop)
  - Taşıma Katmanı:
    - Electron tarafında `SharedArrayBuffer` ve `Atomics.wait()` / `Atomics.notify()` ile kilitlenmeyen çift arabellekli (double-buffered ring queue) bellek paylaşımı.
    - Rust tarafında Windows Named Pipe (`\\.\pipe\nuper_ortho_cmm_ipc`).
* **Etkilenen Dosyalar:**
  - `crates/ortho-router/src/ipc.rs`
  - `electron-main.js`
  - `ui/src/modules/ipc/IpcClient.ts`
* **Kabul Kriteri ve Doğrulama:**
  - 100.000 telemetri paketi 120 FPS hızında aktarılırken UI ana iş parçacığı gecikmesi $< 1.5\text{ ms}$ olarak kilitlenir.

---

### FAZ 10: Sürekli 5-Eksen Tarama Kinematiği (Renishaw REVO-2 & PH20)
* **Problem ve Kök Neden:** PH10 kafa $7.5^\circ$ kesikli adımlarla sınırlıdır. Yüksek hızlı kesintisiz tarama probu (Renishaw REVO-2 ve PH20), CMM köprüsü düz hat üzerinde yavaş ilerlerken prob ucunu iki döner servo eksenle yüzey normaline teğet tutarak binlerce noktayı kesintisiz tarar.
* **Matematiksel ve Algoritmik Altyapı:**
  - Kuaterniyon Tabanlı Açısal Enterpolasyon:
    $$q(t) = \text{Slerp}(q_1, q_2, \tau) = \frac{\sin((1 - \tau)\Omega)}{\sin \Omega} q_1 + \frac{\sin(\tau \Omega)}{\sin \Omega} q_2$$
  - Kinematik Hız Ayrışımı:
    $$\vec{v}_{\text{tip}}(t) = \vec{v}_{\text{bridge}}(t) + \vec{\omega}_{\text{head}}(t) \times \vec{r}_{\text{stylus}}(t)$$
  - Takım Yolu Algoritmaları:
    - Silindirik delikler için sabit adımlı helisel (helical scan) takım yolu.
    - Düzlemler için sabit yüzey hızlı spiral tarama.
    - Sabit sapma kuvveti kontrolü ($0.05\text{ N}$ hedef yaylanma kuvveti).
* **Etkilenen Dosyalar:**
  - `crates/ortho-kinematics/src/ph10.rs`
  - `crates/ortho-kinematics/src/plan.rs`
  - `ui/src/modules/cad/utils/Ph10Kinematics.ts`
* **Kabul Kriteri ve Doğrulama:**
  - Ø40mm x 60mm delik helisel tarama simülasyonunda açısal ivme sınırları aşılmadan yüzey temas hatası $< 0.0002\text{ mm}$ ile tamamlanır.

---

### FAZ 11: Hibrit Metroloji: Optik ve Lazer Çizgi Sensörü (Scan-to-CAD)
* **Problem ve Kök Neden:** Sac metal, plastik enjeksiyon ve serbest formlu (freeform) kavisli yüzeyler dokunmatik tek nokta probuyla saatler sürer; lazer çizgi probu (LLP) ile milyonlarca nokta taranmalıdır.
* **Matematiksel ve Algoritmik Altyapı:**
  - Lazer Çizgi Optik Geometrisi:
    - Çalışma mesafesi (Standoff) $d_s = 65.0\text{ mm}$, Alan derinliği $DoF = \pm 20.0\text{ mm}$, Şerit genişliği $W = 40.0\text{ mm}$.
  - Tarama Yolu Planlama:
    - Boustrophedon (çift yönlü tarama) rotası; şeritler arası $\%30$ örtüşme payı ($w_{\text{step}} = 0.70 \cdot W$).
  - Nokta Bulutu $\longleftrightarrow$ CAD Mesafe Analizi:
    - $M$ adet nokta bulutu $\mathcal{P} = \{\vec{p}_i\}$ için KD-Tree hızlandırması.
    - En yakın CAD üçgenine dik izdüşüm ile sapma vektörü: $e_i = (\vec{p}_i - \vec{q}_i) \cdot \vec{n}_j$.
    - Üç boyutlu renklendirilmiş sapma ısı haritası (Color Heatmap Mesh LUT).
* **Etkilenen Dosyalar:**
  - `crates/ortho-kinematics/src/laser.rs`
  - `crates/ortho-brep/src/surface.rs`
  - `ui/src/modules/cad/CADViewer.ts`
* **Kabul Kriteri ve Doğrulama:**
  - 250.000 sentetik lazer tarama noktası $< 120\text{ ms}$ içinde CAD modeline izdüşürülerek renkli sapma haritası oluşturulur.

---

### FAZ 12: Otomatik Prob Magazini Değişim Kinematiği (Renishaw MCR20 / FCR25)
* **Problem ve Kök Neden:** Derin kanallar ve yanal delikler tek bir stilus ile ölçülemez. CMM tablasındaki prob değiştirme istasyonuna (rack) çarpışmasız gidip prob modülü değiştirecek deterministik bir kinematik rota gerekir.
* **Matematiksel ve Algoritmik Altyapı:**
  - Magazin Yuva Konfigürasyonu: $K$ adet port için sabit tabla koordinatları $(x_k, y_k, z_k)$ ve yaklaşma vektörü $\vec{d}_{\text{dock}} = [0, 1, 0]$.
  - 6 Adımlı Güvenli Değişim Protokolü:
    1. Emniyet kotunda magazin yaklaşma noktasına intikal ($(x_k, y_k - 50.0, z_{\text{rack\_safe}})$).
    2. $20\text{ mm/s}$ hızla yatay olarak porta giriş ve manyetik kilidin açılması.
    3. Z ekseninde $+15.0\text{ mm}$ yükselerek modülü yuvada bırakma.
    4. Yeni prob portuna emniyet kotundan intikal.
    5. Z ekseninde dikey iniş ve manyetik kilidin oturması ($< 0.5\ \mu\text{m}$ tekrarlanabilirlik).
    6. Ters yönde yatay çıkış ve prob elektrik süreklilik doğrulaması.
* **Etkilenen Dosyalar:**
  - `crates/ortho-router/src/stylus.rs`
  - `crates/ortho-router/src/hal.rs`
  - `ui/src/modules/cad/utils/StylusSelector.ts`
* **Kabul Kriteri ve Doğrulama:**
  - Ø1mm ve Ø4mm stilus gerektiren bir teftiş planı magazin rotasını otomatik araya ekler ve simülasyonda bindirme olmadan icra eder.

---

### FAZ 13: I++ DME v1.7 / v2.0 Endüstriyel CMM Denetleyici Köprüsü
* **Problem ve Kök Neden:** DMIS dosyalarını USB ile CMM bilgisayarına taşımak otonom Physical AI döngüsünü bozar. Sistemin Hexagon, Zeiss, Renishaw UCC ve Mitutoyo CMM kontrol üniteleriyle doğrudan TCP/IP üzerinden konuşması gerekir.
* **Matematiksel ve Algoritmik Altyapı:**
  - Rust Tabanlı Asenkron I++ DME Protokol İstemcisi:
    - Komutlar: `StartSession()`, `Init()`, `Home()`, `SetCoordSystem(PCS)`, `GoTo(X,Y,Z,Speed)`, `PtMeas(X,Y,Z,I,J,K)`.
    - Asenkron Yanıt Ayrıştırıcı: `#00001`, `!00001 Error`, `%00001 PtMeas(X,Y,Z)`.
  - Hata Kurtarma ve Güvenli Durdurma:
    - Beklenmeyen dokunmada (`UnexpectedContactError`) acil durdurma ve köprü geri çekme prosedürü.
* **Etkilenen Dosyalar:**
  - `crates/ortho-router/src/ipp.rs`
  - `crates/ortho-router/src/hal.rs`
* **Kabul Kriteri ve Doğrulama:**
  - Sanal I++ DME test sunucusuna TCP üzerinden bağlanılarak el sıkışma, kalibrasyon ve 12 ölçüm noktası hatasız tamamlanır.

---

### FAZ 14: Tam Gövde BVH + GJK/EPA Çarpışma Fiziği ve Çoklu Fikstür
* **Problem ve Kök Neden:** Yalnızca parça kutusu (AABB) üzerinden yapılan kontroller pabuçların, mengenelerin veya hareketli CMM köprüsünün çarpmalarını yakalayamaz.
* **Matematiksel ve Algoritmik Altyapı:**
  - Üç Kademeli Çarpışma Denetimi Hattı:
    1. *Geniş Faz (Broadphase):* Bounding Volume Hierarchy (BVH) AABB ağacı budaması.
    2. *Dar Faz (Narrowphase):* Gilbert-Johnson-Keerthi (GJK) algoritması ile prob montajı ($C_1$) ve engeller ($C_2$) arasındaki mesafe hesabı.
    3. *Penetrasyon Vektörü:* Expanding Polytope Algorithm (EPA) ile temas anında en kısa kurtulma yönü (MTV) hesabı.
  - Süpürülmüş Hacim Sürekli Çarpışma Denetimi (Continuous Collision Detection - CCD):
    - $(\vec{A} \to \vec{B})$ hareket doğru parçası kapsül hacmine genişletilerek taranır.
  - Otonom Rota Onarımı: Pabuç veya engelle çakışan rota $A^*$ yol bulma algoritmasıyla emniyet kutusu etrafından dolandırılır.
* **Etkilenen Dosyalar:**
  - `crates/ortho-router/src/collision.rs`
  - `crates/ortho-router/src/clearance.rs`
  - `ui/src/modules/cad/utils/SetupPrep.ts`
* **Kabul Kriteri ve Doğrulama:**
  - Mengene üzerinden geçen tehlikeli bir rota otomatik tespit edilerek 3 noktalı atlama rotasıyla teğet geçilir.

---

## 5. Blok C: Kapalı Döngü İmalat, Raporlama ve Kalite Güvencesi (Faz 15 – Faz 20)

### FAZ 15: Çoklu CNC Kapalı Döngü Desteği ve SPC Aşınma Tahmini
* **Problem ve Kök Neden:** Parça bozulduktan sonra ofset vermek ıskartaya neden olur. Takım aşınması parça dizisi boyunca istatistiksel trend analizi ile takip edilmeli ve parça tolerans dışına çıkmadan önce CNC'ye kompanzasyon gönderilmelidir.
* **Matematiksel ve Algoritmik Altyapı:**
  - Çoklu CNC Kontrolcü Diyalektleri:
    - Fanuc 0i/31i: `G10 L12 P{tool} R{wear_val}` (geometri aşınma) ve `G10 L13` (boy aşınma).
    - Siemens Sinumerik 840D/ONE: `$TC_DP12[{tool},1] = {val}` (boy) ve `$TC_DP13[{tool},1] = {val}` (yarıçap).
    - Heidenhain TNC 640: `TOOL DEF {tool} DL{val} DR{val}`.
    - Haas CNC: `G10 L12 P{tool} R{val}`.
  - İstatistiksel Süreç Kontrolü (SPC) ve Doğrusal Aşınma Regresyonu:
    $$C_p = \frac{\text{USL} - \text{LSL}}{6\sigma}, \quad C_{pk} = \min\left(\frac{\text{USL} - \bar{x}}{3\sigma}, \frac{\bar{x} - \text{LSL}}{3\sigma}\right)$$
    $$y(t) = \beta_0 + \beta_1 t, \quad \beta_1 = \frac{\sum (t_i - \bar{t})(y_i - \bar{y})}{\sum (t_i - \bar{t})^2}$$
    - Eğer $y(N+1)$ tahmini toleransın $\%70$'ini aşıyorsa, $\Delta_{\text{comp}} = -(\bar{y} - y_{\text{nominal}})$ ofseti otomatik üretilir.
* **Etkilenen Dosyalar:**
  - `crates/ortho-emitter/src/closed_loop.rs`
  - `ui/src/modules/inspection/utils/CodeSnippetGenerator.ts`
* **Kabul Kriteri ve Doğrulama:**
  - Her parçada $+0.003\text{ mm}$ aşınan bir delik operasyonunda 8. parçada kestirimci G10 kompanzasyonu tetiklenerek 9. ve 10. parçalar nominalde tutulur.

---

### FAZ 16: AS9102 Rev C FAI Resmi İlk Numune Denetim Raporu Motoru
* **Problem ve Kök Neden:** Havacılık ve savunma projelerinde denetim sonuçlarının elle AS9102 formlarına girilmesi saatler sürer ve insan hatasına açıktır.
* **Matematiksel ve Algoritmik Altyapı:**
  - Üç Resmi Formun Otomatik Derlenmesi:
    - Form 1 (Part Number Accountability): Parça Adı, Çizim Numarası, Revizyon, Seri No, CMM Makine ID, Denetçi.
    - Form 2 (Product Process Accountability): Hammadde sertifikaları, ısıl işlem, kaplama, prob kalibrasyon sertifika referansları.
    - Form 3 (Characteristic Accountability, Verification and Compatibility Evaluation):
      - Sütun 5: Balon No ($1, 2, \dots, N$).
      - Sütun 6: Çizim Izgara Koordinatı (Örn: `C-3`).
      - Sütun 8: Nominal Boyut ve Tolerans (`35.000 ±0.050`).
      - Sütun 9: CMM Ölçülen Değer.
      - Sütun 10: Kullanılan Prob / Stilus ID.
      - Sütun 14: PASS / FAIL Uygunluk İntibakı.
  - İhracat Biçimleri: Sayısal imzalı PDF ve biçimlendirilmiş OpenXML `.xlsx`.
* **Etkilenen Dosyalar:**
  - `tools/extractor/title_block.py`
  - `crates/ortho-emitter/src/audit.rs`
  - `ui/src/modules/inspection/utils/InspectionTable.ts`
* **Kabul Kriteri ve Doğrulama:**
  - 38 unsurlu plaka için resmi AS9102 Rev C Form 3 tablosu sıfır boş hücre ile PDF ve Excel olarak üretilir.

---

### FAZ 17: Çoklu Parça Paletleme, Yuvalama (Nesting) ve Seri Teftiş
* **Problem ve Kök Neden:** Seri imalatta CMM tablasına çoklu parça bağlanır. Parçalar arasında geçerken probun komşu parçalara veya fikstürlere çarpmaması ve her parçanın kendi koordinat sisteminde ($PCS_k$) ölçülmesi gerekir.
* **Matematiksel ve Algoritmik Altyapı:**
  - Palet Koordinat Dönüşüm Matrisi:
    $$T_{\text{pallet\_to\_part}}(k) = \begin{bmatrix} R_k & \vec{p}_k \\ \vec{0}^T & 1 \end{bmatrix}$$
  - Parçalar Arası Güvenli İntikal Tavanı:
    $$Z_{\text{pallet\_safe}} = \max_k (Z_{\max, k}) + 30.0\text{ mm}$$
  - Operatör Arayüzü: Çoklu ızgara yerleşimi $(N_X, N_Y, \Delta X, \Delta Y)$ tanımlama ve tek tıkla seri çalıştırma.
* **Etkilenen Dosyalar:**
  - `crates/ortho-ast/src/alignment.rs`
  - `crates/ortho-kinematics/src/plan.rs`
  - `ui/src/modules/cad/CADViewer.ts`
* **Kabul Kriteri ve Doğrulama:**
  - 4 parçalık fikstürde parçalar arası emniyet tavanına çıkılarak 4 bağımsız PCS kaydı hatasız oluşturulur.

---

### FAZ 18: Karpathy Güvenlik Kalkanı: Belirsizlik Karar Paneli
* **Problem ve Kök Neden (Karpathy İlkesi):** OCR veya LLM modelleri silik teknik resimlerde sessizce sayı uydurabilir (hallucination). Metrolojide sessiz varsayım yasaktır.
* **Matematiksel ve Algoritmik Altyapı:**
  - Çok Kriterli Güven Skoru ($\mathcal{S} \in [0, 100]$):
    $$\mathcal{S} = w_{\text{ocr}} S_{\text{ocr}} + w_{\text{cad}} S_{\text{cad}} + w_{\text{syntax}} S_{\text{syntax}} + w_{\text{topology}} S_{\text{topology}}$$
  - Güvenlik Karantina Eşiği:
    - $\mathcal{S} < \%80$ olan tüm unsurlar otomatik olarak `NEEDS_REVIEW` karantina kuyruğuna alınır.
    - Sistem CMM kodu derlemesini mühendis onaylayana kadar kilitler.
  - Bölünmüş Ekran (Split-Screen) Onay Modalı: 3D CAD yüzeyi ile 2D teknik resim kırpıntısını yan yana gösterir.
* **Etkilenen Dosyalar:**
  - `crates/ortho-ai/src/guardrail.rs`
  - `ui/src/modules/inspection/utils/FeatureDefinitionModal.ts`
  - `ui/src/modules/inspection/utils/InspectionTable.ts`
* **Kabul Kriteri ve Doğrulama:**
  - Güven skoru $\%65$ olan şüpheli bir ölçüde sistem CMM kod üretimini durdurur; mühendis paneli üzerinden nominal onaylanmadan ilerlenemez.

---

### FAZ 19: Ponytail Kod Temizliği ve VRAM Stres Testi
* **Problem ve Kök Neden (Ponytail İlkesi):** "En iyi kod yazılmamış koddur." Geliştirme sürecinde biriken prototip dalları, ölü kodlar ve Three.js bellek sızıntıları uzun çalışan CMM istasyonlarını çökertir.
* **Matematiksel ve Algoritmik Altyapı:**
  - Kod Tabanı Tasfiyesi: Kullanılmayan sarmalayıcı sınıflar, eski mock fonksiyonları tamamen silinir.
  - Three.js / WebGL VRAM Temizleme Protokolü (`SceneCleaner`):
    - Geometri, materyal ve dokuların VRAM'den tahliyesi (`dispose()`).
    - WebGL RenderLists ve Framebuffer tahliyesi.
  - 100 Döngülü Model Yükleme/Boşaltma Stres Testi: Büyük STEP modelleri peş peşe yüklenip temizlenir.
* **Etkilenen Dosyalar:**
  - `ui/src/modules/cad/utils/SceneCleaner.ts`
  - Tüm modüller.
* **Kabul Kriteri ve Doğrulama:**
  - 100 model değişiminden sonra bellek artışı $< 5.0\text{ MB}$ seviyesinde sabit kalır (sıfır bellek sızıntısı).

---

### FAZ 20: Superpowers Metodolojisi ile Uçtan Uca Headless E2E Test Hattı
* **Problem ve Kök Neden (Superpowers İlkesi):** Birim testlerin geçmesi tüm sistemin bir arada çalıştığını kanıtlamaz. Gerçek kullanıcı akışını test eden tam otomatik bir E2E hattı şarttır.
* **Matematiksel ve Algoritmik Altyapı:**
  - Playwright ve Headless Electron ile Tam Uçtan Uca Kullanıcı Yolculuğu:
    1. Uygulama açılışı ve pencere doğrulaması.
    2. STEP dosyası yükleme $\to$ 3B B-Rep ağacının kurulması.
    3. 2D PDF teknik resim yükleme $\to$ Otomatik balonlama.
    4. Topolojik CAD-Resim eşleştirmesi.
    5. Çarpışmasız CMM yol derleyicisi çalıştırma.
    6. Sanal simülasyon ve canlı telemetri doğrulaması.
    7. ANSI DMIS 5.3 ve CNC G-Code indirme doğrulaması.
* **Etkilenen Dosyalar:**
  - `tests/e2e/metrology_pipeline.spec.ts`
  - `.github/workflows/ci.yml`
* **Kabul Kriteri ve Doğrulama:**
  - `npm run test:e2e:headless` komutu sıfır kullanıcı müdahalesiyle tüm senaryoyu %100 yeşil tamamlar.

---

## 6. Blok D: Fiziksel AI ve Egemen Otonom Derleyici (Faz 21 – Faz 25)

### FAZ 21: Savunma Sanayii Air-Gapped Güvenlik Kalkanı ve Dijital İmzalı DMIS
* **Problem ve Kök Neden:** Savunma tesislerinde internet bağlantısı yasaktır. Üretilen CMM programlarının ve tolerans raporlarının yetkisiz kişilerce değiştirilmediği kriptografik olarak kanıtlanmalıdır.
* **Matematiksel ve Algoritmik Altyapı:**
  - Donanıma Bağlı Çevrimdışı Lisanslama:
    - CPU ID, Anakart Seri No ve TPM 2.0 anahtarları üzerinden SHA-256 donanım parmak izi.
    - RSA-4096 açık anahtar şifrelemesi ile çevrimdışı lisans doğrulaması.
  - Dijital DMIS Filigranı ve Sağlama Toplamı (Tamper-Evident DMIS):
    - Üretilen DMIS hareket bloklarının SHA-256 özeti hesaplanır.
    - Dosya sonuna dijital imza bloğu eklenir:
      ```dmis
      $$ SIG_ALG: RSA-4096-SHA256
      $$ SIGNATURE: 3f8a9e...
      ```
    - CMM denetleyicisi imzada 1 bitlik uyuşmazlık tespit ederse programı çalıştırmayı reddeder.
* **Etkilenen Dosyalar:**
  - `crates/ortho-license/src/lib.rs`
  - `crates/ortho-emitter/src/audit.rs`
* **Kabul Kriteri ve Doğrulama:**
  - DMIS dosyasında tek bir karakter değiştirildiğinde sistem anında imza ihlali alarmı üretir.

---

### FAZ 22: Atölye Tipi Yüksek Kontrast CMM Operatör Kokpiti
* **Problem ve Kök Neden:** Atölye şartlarında eldivenle çalışan operatörler küçük butonları tıklayamaz; yüksek ortam ışığı standart gri temaları okunamaz kılar.
* **Matematiksel ve Algoritmik Altyapı:**
  - Endüstriyel Dokunmatik Standartlar:
    - WCAG 2.2 AAA Kontrast Oranı ($> 7:1$) — derin obsidyen zemin üzerine neon emniyet renkleri.
    - Tüm tıklanabilir butonlarda minimum $48 \times 48\text{ piksel}$ temas hedefi.
    - 5 metreden okunabilen $72\text{pt}$ devasa PASS / FAIL durum panosu.
    - Tek dokunuşla acil durdurma ve döngü devam ettirme.
* **Etkilenen Dosyalar:**
  - `ui/src/modules/core/utils/WorkflowRibbon.ts`
  - `ui/src/modules/inspection/InspectionTable.ts`
  - `ui/index.html`
* **Kabul Kriteri ve Doğrulama:**
  - CSS dokunmatik hedef denetiminde tüm butonların $\ge 48\text{px}$ olduğu doğrulanır.

---

### FAZ 23: Dinamik Termal Gradyan Simülasyonu
* **Problem ve Kök Neden:** Büyük havacılık parçalarında ($> 1\text{ metre}$) sıcaklık homojen değildir; alt yüzey soğuk granit tablaya temas ederken üst yüzey atölye ışıklarıyla ısınır. Sabit $20^\circ\text{C}$ kompanzasyonu yetersiz kalır.
* **Matematiksel ve Algoritmik Altyapı:**
  - Üç Boyutlu Sıcaklık Alanı Enterpolasyonu (RBF):
    $$T(\vec{p}) = \frac{\sum_{k=1}^M w_k(\vec{p}) T_k}{\sum_{k=1}^M w_k(\vec{p})}, \quad w_k(\vec{p}) = \frac{1}{\|\vec{p} - \vec{s}_k\|^2 + \epsilon^2}$$
  - Temas Noktası Diferansiyel Genleşme Telafisi:
    $$\Delta \vec{p} = \int_{0}^{\vec{p}} \alpha(T(\vec{r})) \cdot (T(\vec{r}) - 20.0) \, d\vec{r}$$
    $$\vec{p}_{\text{compensated}} = \vec{p}_{\text{measured}} - \Delta \vec{p}$$
* **Etkilenen Dosyalar:**
  - `crates/ortho-kinematics/src/fitting.rs`
  - `crates/ortho-emitter/src/closed_loop.rs`
* **Kabul Kriteri ve Doğrulama:**
  - $1500\text{ mm}$ alüminyum kirişte $18^\circ\text{C} - 24^\circ\text{C}$ gradyan telafisi ile ölçüm hatası $< 1.5\ \mu\text{m}$ seviyesine indirilir.

---

### FAZ 24: Tersine Mühendislik ve Parametrik B-Rep Rekonstrüksiyonu (Scan-to-STEP)
* **Problem ve Kök Neden:** CAD modeli olmayan eski parçaların veya imal edilmiş gerçek parçanın as-built geometrisinin parametrik katı modele dönüştürülmesi gerekir.
* **Matematiksel ve Algoritmik Altyapı:**
  - Nokta Bulutundan Analitik Yüzey Çıkarımı:
    - RANSAC ile düzlem, silindir, küre ve koni yüzeylerinin segmente edilmesi.
    - Levenberg-Marquardt ile yüzey parametrelerinin optimize edilmesi.
    - Kesişen yüzeylerden B-Rep kenar döngülerinin (`TopoDS_Wire`) oluşturulması.
  - OpenCASCADE STEP İhracı:
    - `BRepBuilderAPI_MakeFace` ve `BRepBuilderAPI_Sewing` ile kapalı katı (`TopoDS_Solid`) derlenmesi ve STEP AP214/AP242 olarak yazılması.
* **Etkilenen Dosyalar:**
  - `crates/ortho-brep/src/surface.rs`
  - `tools/extractor/brep_verifier.py`
* **Kabul Kriteri ve Doğrulama:**
  - Taranmış nokta bulutundan üretilen STEP dosyası OpenCASCADE çekirdeğinde hatasız katı gövde olarak açılır.

---

### FAZ 25: Otonom Kalite Derleyicisi 2.0 (Sovereign Autonomous Loop)
* **Problem ve Kök Neden (Nihai Hedef):** Parça ölçümü, hata teşhisi, CNC ofset hesaplama ve yeni parça işleme süreçleri birbirinden kopuktur. Physical AI vizyonu bu döngüyü sıfır insan müdahalesiyle kapatmayı gerektirir.
* **Matematiksel ve Algoritmik Altyapı:**
  - Egemen Otonom İmalat ve Kalite Döngüsü:
    1. **Derle:** CAD ve teknik resimden çarpışmasız CMM takım yolunu üret.
    2. **Ölç:** I++ DME protokolü ile CMM tezgâhını uzaktan yöneterek parçayı ölç.
    3. **Teşhis:** PTB fitting ve GUM belirsizlik analizi ile sapmaları belirle.
    4. **Düzelt:** Çoklu parça regresyonu ile takım aşınmasını tahmin et; Fanuc/Siemens CNC kontrolcüsüne G10 ofsetini doğrudan ağdan bas.
    5. **Yakınsa:** CNC yeni parçayı işler; döngü süreç yeterliliği $C_{pk} > 1.67$ seviyesine çıkana kadar otonom tekrarlanır.
  - Emniyet Kilidi: Hesaplanan ofset $|\Delta| > 0.100\text{ mm}$ ise takım kırılması şüphesiyle döngü anında durur ve sesli alarm verir.
* **Etkilenen Dosyalar:**
  - Tüm çekirdek kütüphaneler ve otonom orkestrasyon servisi.
* **Kabul Kriteri ve Doğrulama:**
  - 5 parçalık kapalı döngü simülasyonunda süreç yeterliliği $C_{pk} = 0.95$'ten $C_{pk} = 1.78$'e otonom olarak yükseltilir.
