# Nuper Ortho — Havacılık & Savunma Teknik Resim Standartları ve Metroloji Kuralları

> **Işık masası uygulama planı:** [Yetkinlikler, ekran akışı, veri sözleşmeleri ve kabul koşulları](lightTableCapabilityPlan.md). Bu belgedeki alan örneklerinin algoritmaya dönüşmeden önce doğrulanması gereken noktalar planın §6 bölümündedir. Güncel iş sırası ve uygulama durumu [progress.md](progress.md) içinde tutulur.

> **Belge Konumu:** `memory-bank/gdtStandardsAndDrawingRules.md`  
> **Kapsam:** ASELSAN, TAI, TEI ve NATO savunma/havacılık teknik resimlerinde (ASME Y14.5-2018, MBD, MIL-STD, ISO 2768) uygulanan resmi kurallar, semboloji, antet hiyerarşisi ve Nuper Ortho algoritma geliştirme gereksinimleri.

---

## 📌 1. Çekirdek Standartlar Matrisi (Normatif Referanslar)

Teknik resimlerin antetinde (Title Block) ve genel notlarında yer alan tüm kurallar uluslararası askeri ve endüstriyel standartlara dayanır:

| Alan / Kural | İlgili Standart | Paftadaki İfadesi / Karşılığı | Nuper Ortho Çekirdeğindeki Rolü |
|---|---|---|---|
| **GD&T (Geometrik Tolerans)** | **ASME Y14.5-2018** (veya ASME Y14.5M-1994) | `GEOMETRIC DIMENSIONING AND TOLERANCING: ASME Y14.5-2018` | Temel geometrik tolerans motoru, Zarf Kuralı (Rule #1), FCF ayrıştırma |
| **Model Tabanlı Tanım (MBD)** | **ASME Y14.41-2019 / ISO 16792** | `VERİLMEYEN ÖLÇÜLER: EKLİ 3B MODEL (UNDESIGNATED DIMS: ATTACHED 3D MODEL)` | Teknik resimde verilmeyen ölçülerin nominal değeri doğrudan STEP B-Rep'ten alınır |
| **Genel Lineer/Açısal Tolerans** | **ISO 2768-1 / Blok Tolerans** | `GENEL TOLERANSLAR: ±0.2 / ±1°` veya `ISO 2768-m` | Toleransı belirtilmemiş ölçülere antetteki blok tolerans veya ISO tablosu atanır |
| **Metrik Vida ve Helicoil** | **ASME B1.13M / ASME B1.16M** | `METRİK DİŞLER: ASME B1.13M`, `DİŞ MASTARI: ASME B1.16M`, `4X M3 HELICOIL` | CMM probunun doğrudan diş içine vurmasını engeller; prob stratejisini silindirik kılavuza çevirir |
| **Delik Derinliği Toleransı** | Özel Blok Toleransı | `DELİK DERİNLİĞİ GENEL TOLERANSLARI: ±0.5` (veya `±0.2`) | Kılavuz ve kör deliklerin Z-ekseni dip derinlik kontrol sınırı |
| **Görünüş Projeksiyonu** | **ASME Y14.3 / ISO 5456-2** | 3. Açı Projeksiyon Sembolü (Üçüncü Açı / Third Angle) | 2D pafta görünümlerini 3D model eksenlerine (X, Y, Z) eşleme kuralı |
| **Yüzey İşlem / Kaplama** | **MIL-DTL-5541F / MIL-A-8625** | `MIL-DTL-5541F TİP 2 SINIF 3 ALODİN`, `ÖLÇÜLER KAPLAMA SONRASI İÇİNDİR` | Parçanın ölçüm durumu; kaplama kalınlığı tolerans limitlerine dahildir |
| **İzlenebilirlik ve Etiketleme** | **MIL-STD-130N / AS9100 Rev D** | `MIL-STD-130'A GÖRE ETİKETLEYİNİZ (CAGE CODE, P/N, REV)` | Ölçüm raporuna (AS9102 Form 1-3 / FAI) girecek zorunlu antet üstverileri |

---

## 📐 2. Tolerans Hiyerarşisi (Resolution Order)

Teknik resimde bir unsurun (delik, yüzey, kanal) toleransı belirlenirken algoritma şu katı sırayı işletmek **zorundadır**:

```
[1. Unsurun Doğrudan Toleransı] (Örn: Ø25 H7, 50 ±0.05, 3X 2 +0.2/0)
                 │  (Yoksa)
                 ▼
[2. Geometrik Tolerans Çerçevesi (FCF)] (Örn: ⌖ Ø0.2 | A | B | C | veya ⌓ 0.05 | B | C)
                 │  (Ölçü kutu içindeyse: [53.9] -> Temel Ölçü / Basic Dimension)
                 ▼
[3. Tablo Tipi Ölçülendirme] (Örn: A Yüzeyi: 3.3 ±0.1, B Yüzeyi: 4.5 ±0.1)
                 │  (Yoksa)
                 ▼
[4. Antet Özel Toleransı] (Örn: Delik Derinliği: ±0.5 mm)
                 │  (Yoksa)
                 ▼
[5. Antet Genel Blok Toleransı] (Örn: ±0.2 mm / ±1° veya ISO 2768-m tablosu)
                 │  (Yoksa)
                 ▼
[6. EKLİ 3B MODEL (MBD)] (STEP model nominali + Genel Profil Toleransı)
```

> ⚠️ **Altın Kural:** Kutu içerisindeki ölçüler (Basic Dimension - örn: `[40]`, `[27.2]`, `[53.9]`) **asla** antetteki `±0.2` gibi genel toleranslarla değerlendirilemez. Bunların toleransı, kendilerini kontrol eden Geometrik Tolerans Çerçevesidir (FCF - Konum/Profil).

---

## 🎯 3. Datum Referans Çerçevesi (DRF) ve Özel Semboller

### 3.1. Datum Hiyerarşisi (`| A | B | C |`)
1. **Birincil Datum (Primary - [A]):** 3 serbestlik derecesini (1 öteleme, 2 dönme) kısıtlar. Genellikle en geniş oturma tabanı veya en uzun eksendir.
2. **İkincil Datum (Secondary - [B]):** 2 serbestlik derecesini (1 öteleme, 1 dönme) kısıtlar. Genellikle birincile dik bir kenar veya delik merkezidir.
3. **Üçüncül Datum (Tertiary - [C]):** Son kalan 1 serbestlik derecesini (dönme veya öteleme) kısıtlayarak parçanın uzaydaki 6 serbestlik derecesini (6-DOF) tamamen kilitler.

### 3.2. Paftalarda Görülen Özel Semboller ve Algoritmik Karşılıkları

* **`[CF]` (Continuous Feature - Sürekli Unsur):**
  * *Paftadaki Örnek:* `⏥ 0.05 [CF] | A` (6 YERDE / 6 PLACES).
  * *Mühendislik Anlamı:* Aralarında boşluklar olan 6 farklı ayrı düzlem parçacığı, imalatta ve kontrolde **tek bir kesintisiz düzlemmiş gibi** ele alınacaktır.
  * *CMM Stratejisi:* Her 6 pedden en az 3'er nokta alınır ve tüm noktalar tek bir global Gauss En Düşük Kareler Düzlemine (Least Squares Plane) fit edilir. Düzlemsellik sapması tüm bu noktaların ortak bandından hesaplanır.
* **`Ⓛ` (Least Material Condition - LMC / En Az Malzeme Durumu):**
  * *Paftadaki Örnek:* `⏊ Ø0.1 Ⓛ | F`.
  * *Mühendislik Anlamı:* Delik en büyük çapına (veya pim en küçük çapına) ulaştığında diklik toleransı 0.1 mm'dir. Malzeme miktarı arttıkça (delik küçüldükçe) toleransa "bonus tolerans" eklenir. Özellikle et kalınlığının patlamasını (breakthrough) önlemek için savunma parçalarında kullanılır.
* **`Ⓜ` (Maximum Material Condition - MMC):**
  * Pim en kalın, delik en dar iken geçerlidir. Montajlanabilirliği garanti eder.
* **`4X M3 HELICOIL 1 DIA ↧3.5 MAX`:**
  * *Mühendislik Anlamı:* Bu delik standart diş değil, tel yaylı Helicoil çeliği takılacak yay yuvasıdır.
  * *CMM Stratejisi:* Prob doğrudan diş profiline vurursa prob ucu kırılabilir veya sinyal hatası verir. Mastar (gage) pimi takılarak pimin silindirik dış yüzeyinden eksen ölçülür.
* **`A1`, `B1` (Datum Targets - Datum Hedefleri):**
  * Parçanın tüm tabanı değil, yalnızca belirtilen lokal dairesel veya noktasal hedef alanı datum düzlemini oluşturur.

---

## 🔄 4. 2D Pafta Görünüşleri ve 3D STEP Oryantasyonu (3rd Angle Projection)

ASELSAN paftalarının antetinde koni sembolüyle belirtilen **3. Açı Projeksiyon (Third Angle Projection)** kuralı geçerlidir:

```
        ┌────────────────┐
        │  ÜST GÖRÜNÜŞ   │  (Top View: Z+ veya Y+)
        └────────────────┘
                 ▲
                 │
┌───────────────┐┌────────────────┐┌────────────────┐
│ SOL GÖRÜNÜŞ   ││  ÖN GÖRÜNÜŞ    ││  SAĞ GÖRÜNÜŞ   │ (Right View: X+)
└───────────────┘│ (Front: X-Z)   │└────────────────┘
                 └────────────────┘
                         │
                         ▼
        ┌────────────────┐
        │  ALT GÖRÜNÜŞ   │
        └────────────────┘
```

* **Avrupa (1. Açı) ile Farkı:** 1. açıda nesneye soldan bakıldığında çizim sağa konur. 3. açıda ise **sağdan bakılan yüz sağa konur**, **üstten bakılan yüz üste konur**.
* **Nuper Ortho Eşleme Kuralı:** 2D paftadaki kesit (`A-A`, `B-B`) ve görünüş oklarının yönü, 3D STEP modelinin B-Rep normal vektörleriyle ($N_x, N_y, N_z$) doğrudan 1'e 1 ilişkilidir. Kesit oku nereyi gösteriyorsa, CAD kesim düzlemi o vektör yönünde dilimlenmelidir.

---

## 🧪 5. İmalat Notları ve Süreç Sıralaması (Process Order)

Paftalardaki 1, 2, 3 numaralı notlar ölçüm stratejisinin ne zaman ve nasıl uygulanacağını dikte eder:

1. **"Ölçü ve toleranslar işlemlerden sonra uygulanacaktır" / "Ölçüler kaplama sonrası içindir":**
   - Eloksal (Anodizing), Alodin (Chemical Film per MIL-DTL-5541F Type II Class 3) veya boya kalınlıkları parçaya mikron seviyesinde et kalınlığı ekler.
   - CMM denetimi kaplama tesisinden çıkan nihai parçada yapılmalıdır. Ham talaşlı imalat aşamasında tolerans aralığının kaplama payı kadar iç sınırında tutulması gerekir.
2. **Tablo Tipi Ölçülendirme (Tabular / Coordinate Dimensioning):**
   - Paftada `YÜZEY / SURFACE | A DATUMUNA OLAN MESAFE | ADET` şeklinde verilen tablolar:
   - `A`: 4 adet yüzey, mesafe `3.3 ±0.1 mm`
   - `B`: 4 adet yüzey, mesafe `4.5 ±0.1 mm`
   - `C`: 7 adet yüzey, mesafe `2 ±0.1 mm`
   - **Gereksinim:** OCR ve LLM çıkarıcı motoru bu tabloyu tespit ettiğinde, paftadaki `A`, `B`, `C` harfli referans dairelerini 3D STEP'teki Z-yükseklikleriyle eşleştirmelidir.

---

## 💻 6. Nuper Ortho İçin Yazılım Mimarisi ve Kod Kuralları

Bu standartların kod tabanında hatasız uygulanabilmesi için:

1. **`ToleranceClass` Modeli Genişletmesi (`crates/ortho-ast` & `schemas`):**
   - `Basic` (Kutu içi temel ölçü), `Direct` (Doğrudan tolerans), `GeneralBlock` (Antet genel toleransı), `TableDriven` (Tablo kontrollü) ve `MbdDerived` (3B modelden türetilmiş) ayrımı kesinleşmelidir.
2. **Datum Referans Çözücü (`ortho-plan`):**
   - `[CF]` (Continuous Feature) tespit edildiğinde tek bir delik/yüzey yerine ilişkili $N$ adet yüzeyin ortak fit edilmesi planlanmalıdır.
3. **Sıfır Uydurma İlkesi (Y1 / Y2):**
   - Kutu içindeki temel ölçü için tolerans alanı boş bırakılmalı, tolerans yalnızca FCF çerçevesine (örn. `⌖ Ø0.2 A B C`) bağlanmalıdır. Çıplak sayıya asla varsayılan `±0.2` atanmamalıdır.

---

## 7. Deterministik Topolojik Eşleştirme ve Çift Yüzey Kaliper Kinematiği

### 7.1. B-Rep Topolojik Mesafe Grafı
1. **Paralel Düzlem Çiftleri:** $|\vec{n}_i \cdot \vec{n}_j| \ge 0.998$ şartını sağlayan tüm düzlemler taranır ve dik mesafe $d_{ij} = |(\vec{C}_i - \vec{C}_j) \cdot \vec{n}_i|$ hesaplanır.
2. **Geometrik Tip Sınıflandırması:**
   - `STEP_HEIGHT`: Normaller aynı yöne bakıyor ($\vec{n}_i \cdot \vec{n}_j > 0.95$).
   - `INTERNAL_SLOT`: Normaller birbirine doğru içe bakıyor ($\vec{n}_i \cdot (\vec{C}_j - \vec{C}_i) > 0$).
   - `EXTERNAL_WIDTH`: Normaller dışa doğru bakıyor.
   - `AXIS_DISTANCE`: Paralel silindir eksenleri arası mesafe.
3. **Tekillik ve Veri Zenginliği:** Key bazlı kataloglama ile aynı nominal mesafeye sahip farklı bölgelerdeki unsurlar elenmez; `faceA_center`, `faceB_center`, `faceA_normal`, `faceB_normal` değerleriyle tam fiziksel koordinatlarına bağlanır. $d < 0.5\text{ mm}$ olan parazit pah/gürültü mesafeleri filtrelenir.

### 7.2. Çok Kriterli Güven Skoru (Confidence Scoring - 100 Puan)
- **Nominal Boyut Uyumu (40 Puan):** $|\Delta| \le 0.02\text{ mm} \to 40$, $\le 0.05\text{ mm} \to 35$, $\le 0.15\text{ mm} \to 25$, $\le 0.50\text{ mm} \to 15$, $\le 0.85\text{ mm} \to 5$.
- **Geometrik Unsur Tipi Uyumu (20 Puan):** Çap $\leftrightarrow$ Silindir, Doğrusal $\leftrightarrow$ Düzlem Çifti/BBox, Radyus $\leftrightarrow$ Kavis/Dış Silindir (Radyusun delikle eşleşmesi kesinlikle engellenir).
- **Unsur Adedi / Kalıp Deseni (15 Puan):** Çizimdeki desen sayısı ile CAD gruplaması uyumu.
- **2D Görünüş / Eksen İzdüşümü (15 Puan):** Vektörel çizim açısı ve görünüş adası ile 3D yüzey normali uyumu.
- **Datum Uyumu (10 Puan):** İlişkili datum referans yüzeyi doğrulaması.
- **Durum Skalası:**
  - $\ge 85$: `VERIFIED_EXACT`
  - $70 - 84$: `VERIFIED_TOPOLOGY`
  - $45 - 69$: `NEEDS_REVIEW`
  - $< 45$: `UNMATCHED`
  - Operatör Doğrulaması: `ENGINEER_LOCKED` (%100)

### 7.3. Fiziksel Çift Yüzey Kaliper Teması & Kinematik İyileştirme
- Doğrusal boyutlar için tek bir havada asılı nokta yerine, mesafe sınırını oluşturan `Face A` ve `Face B` yüzeylerinin ağırlık merkezlerine ayrı ayrı temas edilir.
- Yakut küre yarıçapı ($R_{\text{tip}}$) telafisi doğrudan yüzey normali doğrultusunda eklenir.
- Granite tabla $Y=0$ sınırlandırması yalnızca dikey eksen için uygulanır; $Z<0$ veya $X<0$ yatay koordinatlarının sıfıra ezilerek havada yapay düz çizgiler oluşturması engellenmiştir.
- Trajektori görselleştirme boru yarıçapı $0.015\text{ mm}$ seviyesine inceltilerek şeffaf ve zarif (hairline) mühendislik çizgisi elde edilmiştir.

---

## 🛠️ 8. Endüstriyel Mükemmellik Standartları (Paket 4 / Havacılık Savunma Uyumu)

### 8.1. ISO 2768-1 Genel Tolerans Tablosu Otomatik Atayıcısı
Teknik resim antetinde tanımlı `ISO 2768-f`, `m`, `c`, `v` (veya `mK`, `fH`) sınıfına göre, yanında açık tolerans belirtilmemiş tüm doğrusal ölçülere standart tolerans aralık tablosu otomatik uygulanır:
- $0.5 \text{–} 3\text{ mm} \implies \pm 0.1\text{ mm}$ (Orta / m sınıfı)
- $> 3 \text{–} 6\text{ mm} \implies \pm 0.1\text{ mm}$
- $> 6 \text{–} 30\text{ mm} \implies \pm 0.2\text{ mm}$
- $> 30 \text{–} 120\text{ mm} \implies \pm 0.3\text{ mm}$
- $> 120 \text{–} 400\text{ mm} \implies \pm 0.5\text{ mm}$
- $> 400 \text{–} 1000\text{ mm} \implies \pm 0.8\text{ mm}$
- Menşe etiketi `tolerance_source: 'ISO_2768_M'` olarak kaydedilir.

### 8.2. Dişli Deliklerde Minör Çap ve Helisel Ofset Koruması
- Metrik ve UNF dişlerde (M6x1, M8, M4 vb.) prob asla nominal dış anma çapına ($\varnothing 6.0\text{ mm}$) gönderilmez.
- Hedef kontrol çapı minör/matkap çapı ($D_{\text{minor}} = D_{\text{major}} - 1.082532 \times P$) olarak hesaplanır; prob $r = D_{\text{minor}}/2$ silindirine temas eder.
- Dört temas noktasına helisel faz ofseti ($\Delta z_i = (i / 4.0) \times P$) eklenerek probun diş sırtına bindirmesi ve yan yüzeylerde kilitlenmesi engellenir.

### 8.3. Kör Delik ve Havşa Tabanı Çarpışma Koruması
- STEP B-Rep modelinde tabanı kapalı olan (`is_blind: true`) kör deliklerde taban seviyesi `floor_z` çıkarılır.
- Dalma kotu $Z_{\text{meas}} = \max(\text{floor\_z} + R_{\text{tip}} + 2.0\text{ mm}, \text{desiredZ})$ ile tabandan en az $2.0\text{ mm} + R_{\text{tip}}$ yukarıda tutulur.

### 8.4. ANSI DMIS 5.3 Koordinat Sistemi (`DATSET` / `PCS`) ve OP20 Çevirme
- Ölçüm programında Primer, Sekonder, Tersiyer datumların ardından ANSI DMIS 5.3 uyumlu `DATDEF`/`DATSET` ve `SAVE/D(PCS_OP10)` blokları üretilir.
- OP20 kurulumunda operatöre `TEXT/OPER,'LUTFEN PARCAYI OP20 ICIN 180 DERECE CEVIRIP GRANIT TABLAYA BAGLAYIN'` ve `RECALL/D(MCS)` yönlendirmesi basılır.

### 8.5. Trapezoidal Kinematik Profil ile Çevrim Süresi
- $a_{\max} = 450\text{ mm/s}^2$ ivme limitiyle gerçekçi ivmelenme/yavaşlama süresi:
  - $d \ge v^2/a \implies \Delta t = d/v + v/a$ (Trapezoidal)
  - $d < v^2/a \implies \Delta t = 2\sqrt{d/a}$ (Üçgensel)
- Her fiziksel `TOUCH` için $+0.25\text{ s}$ tetikleme/sönümleme, her PH10 kafa dönüşü için $+1.80\text{ s}$ mekanik indeksleme bekleme süresi eklenir.

### 8.6. SAE AS9102 Rev C (FAI Form 3) Resmi Rapor Üreticisi
- Resmi First Article Inspection standardına uygun 7 sütunlu Form 3 tablosu:
  `Char No | Ref Location | Characteristic Designator | Requirement (Nom+Tol+GD&T+Source) | Results (Measured/Dev/Verdict) | Qualified Tooling | Non-Conformance No (NCR)`.

### 8.7. STEP AP242 3D PMI Öncelikli Okuma
- STEP dosyasında gömülü AP242 semantik PMI (`GEOMETRIC_TOLERANCE`, `DATUM`) mevcut olduğunda doğrudan okunur, `match_confidence: 100.0` ve `match_status: 'AP242_NATIVE_PMI'` etiketiyle 2D pafta verisine öncelikli olarak bağlanır.
