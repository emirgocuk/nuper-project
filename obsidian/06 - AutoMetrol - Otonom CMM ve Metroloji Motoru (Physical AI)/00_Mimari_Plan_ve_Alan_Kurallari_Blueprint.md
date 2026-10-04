# Nuper Ortho — Mimari Plan ve Alan Kuralları (Architecture Blueprint)

> Bu belge `memory-bank/architectureBlueprint.md` olarak durur. `developmentInfrastructureRules.md` **geliştirme altyapısını** (hook, codegen, task runner) anlatır. Bu belge ise **ürünün iç yapısını** anlatır: veri hattı, tipler, değişmezler (invariants), modül sınırları ve test düzeni.
>
> Amaç: yapı o kadar net olsun ki zayıf bir model bile yanlış yere kod yazamasın, yanlış tipi kullanamasın ve derleyici ya da test hatayı yakalasın.

---

## 0. Ajan İçin Okuma Sırası

1. `AGENTS.md`
2. Bu belge: önce §1 (Değişmez Yasalar), sonra görevin ilgili bölümü
3. `developmentInfrastructureRules.md` (yalnızca altyapı görevi ise)
4. İlgili `schemas/*.schema.json`

Görev bu belgedeki bir yasayla çelişiyorsa **kod yazma**, çelişkiyi raporla.

---

## 1. Değişmez Yasalar (Hiçbir Görev Bunları Çiğneyemez)

| No | Yasa | Neden |
|---|---|---|
| Y1 | **Uydurma değer yok.** Okunamayan değer `None`/`Unverified` olur. Varsayılan ölçü, tolerans, malzeme, datum yazılmaz. | Metrolojide yanlış sayı, doğru "bilinmiyor" cevabından daha tehlikelidir. |
| Y2 | **Çıkarım ölçüm değildir.** PDF'ten okunan nominal/tolerans ile CMM'in ölçtüğü değer ayrı tiplerdir. Çıkarım katmanı `measured`, `deviation`, `status` üretemez. | Aksi halde hiç ölçülmemiş parça "PASS" görünür. |
| Y3 | **Her değerin menşei (provenance) vardır:** dosya hash'i, sayfa, bbox, yöntem, sürüm. | AS9100/AS9102 izlenebilirliği. |
| Y4 | **Dosya adı davranışı değiştiremez.** `if "gobek" in filename` gibi dallanma yasak. | Test verisi üretime sızar. |
| Y5 | **Onaylanmamış ölçü emitter'a gidemez.** Tip sistemi bunu zorlar (§6). | Operatör onayı atlanamaz. |
| Y6 | **Çekirdekte yapay zeka yok.** B-Rep, eşleştirme, rota, emitter deterministiktir. AI yalnızca "aday üretir", doğrulamayı deterministik kod yapar. | Tekrarlanabilirlik. |
| Y7 | **Birim tipli.** Uzunluk `Mm`, açı `Deg`/`Rad` newtype'ıdır. Çıplak `f64` ölçü taşımaz. | Birim ve eksen karışıklığı derleme anında yakalanır. |
| Y8 | **Sessiz yutma yok.** `unwrap_or(1)`, `unwrap_or_default()`, `catch: pass` ile eksik veri gizlenemez. Hata ya `Result::Err` ya da açık `Unverified` durumudur. | Hata gizlenirse kimse görmez. |
| Y9 | **Sabit sayı (magic number) yok.** Eşikler `config/thresholds.toml` içinde adlandırılır, testlerle korunur. | 0.80, 0.05, 2.5 gibi değerler gerekçesiz kalır. |

---

## 2. Mevcut Kodda Tespit Edilen Yasa İhlalleri (Öncelik Sırasıyla)

Bunlar yüklediğin dosyalardan okundu. `drawing_extractor.py`'nin yalnızca ilk 140 ve son 185 satırını, `step_parser.rs` ile `surface.rs`'in ise yalnızca imzalarını/`unwrap` kullanımını taradım. Bu yüzden listeyi başlangıç say, kendi kod taramanla genişlet.

### P0 — Güvenlik/Doğruluk (hemen düzelt)

1. **`drawing_extractor.py` ölçüm uyduruyor.**
   - `"measured": f"{(nom + 0.004):.3f} mm"`, `"status": "PASS"` ve benzeri satırlar PDF'ten okunan nominalin üzerine sabit sapma ekleyip her şeyi PASS gösteriyor. Hiçbir ölçüm yapılmadı.
   - Dişler için `"measured": "GEÇER (GO/NO-GO)"` ve `"Diş Emniyet Protokolü Baypas ✓"` yazılıyor.
   - Hiç ölçü bulunamazsa `len(dims) == 0` dalı **sahte Ø20 H7, 50 ±0.05, M8x1.25 listesi** döndürüyor.
   - `is_gobek_olugu` dosya adında "gobek" veya "3051" geçerse **sabit kodlanmış 12 ölçü** döndürüyor (Y1, Y2, Y4 ihlali).
   - `title_block` içinde `general_tolerance` varsayılanı `"ISO 2768-mK"` ve `datums` varsayılanı `["A","B","C"]` her çizim için yazılıyor.
   - Bu çıktı arayüzde gerçek çıkarım gibi görünür. Bir operatör hiç ölçülmemiş parçayı PASS sanabilir.
2. **`drawing_data.schema.json` bu ihlali zorunlu kılıyor.** `measured`, `deviation`, `status` alanları `required`. Şema, çıkarım çıktısının ölçüm içermesini şart koşuyor. Önce şema düzeltilmeli (§4).
3. **`pmi.rs::extract_embedded_tolerances` her `GEOMETRIC_TOLERANCE` satırı için aynı sahte toleransı üretiyor:** `feature_id: 1`, `upper_tolerance: 0.05`, datumlar `A,B,C`. Gerçek STEP varlığı ayrıştırılmıyor. `has_semantic_pmi` ise ilk 500 satırda "AP242" geçmesini PMI var sayıyor (AP242 başlığı PMI garantisi değildir).
4. **`DrawingSheet::extract_title_block` varsayılan değer uyduruyor:** `PART_1`, `DWG_001`, `REV_A`, `ALUMINUM_6061_T6`. Bulunamayan alan `Option::None` olmalı.

### P1 — Doğruluk

5. **`Tier1RuleBasedParser::parse_diameter_callout`**
   - H7 bandı 4 basamaklı `if` ile yazılmış (`<=18 → 0.018`). ISO 286 IT7 değerleri 3 mm altı, 3–6, 6–10, 10–18 gibi aralıklarda farklıdır. Örneğin 6–10 mm için 0.015'tir, kodda 0.018 çıkar. Tablo standarttan gömülmeli (§5).
   - `clean.find(['x','X'])` ilk `x` harfini miktar ayırıcı sayıyor. `M8x1.25` gibi metinlerde yanlış dallanır.
   - `qty_str.parse().unwrap_or(1)` bozuk miktarı sessizce 1 yapıyor (Y8).
   - Tolerans yoksa `0.050` varsayılanı uyduruluyor. Gerçekte bu "ISO 2768 genel tolerans" tablosuna bağlıdır ve nominale göre değişir.
6. **`DrawingToStepMatcher`**
   - Her açıklama en iyi unsuru bağımsız seçiyor. **Bire-bir atama yok:** iki farklı Ø12 ölçüsü aynı deliğe eşlenebilir, `4x Ø12` tek deliğe eşlenir.
   - Eşit skorlarda ilk unsur kazanıyor (belirsizlik raporlanmıyor).
   - `FeatureControlFrame` her unsura sabit `0.75` veriyor, yani anlamlı bir eşleme değil.
   - `rationale` metni sabit ("Çap ve geometrik profil uyumu") ve gerçek nedeni taşımıyor.
7. **Eşik gerekçesiz:** `0.80` güven eşiği, `0.05`/`0.5` çap farkı, `2.0`/`5.0` mm kesit toleransı kod içine gömülü (Y9).

### P2 — Mimari

8. **Tipler elle yazılmış.** `drawing.rs`, `tier.rs`, `matching.rs` kendi struct'larını tanımlıyor. `AGENTS.md` kural 3 ("tipleri şemadan türet") ihlal ediliyor. Şemadaki alanlar (`balloon`, `feature_key`, `gdt` düz string) ile Rust tipleri (`BalloonItem`, `AnnotationType`) birbirinden bağımsız evrilmiş.
9. **`lib.rs` başlığı OpenCASCADE diyor, `step_parser.rs` saf Rust.** Belgeler gerçeği yansıtmıyor. Ajanlar bu yüzden yanlış varsayımla çalışır.
10. **`drawing.rs` birden fazla sorumluluk taşıyor:** veri modeli + sayfa sınıflandırma + başlık bloğu metin ayrıştırma + görüntü ön işleme (HSV filtre). Ayrı modüllere bölünmeli (§3).
11. **PyMuPDF (AGPL).** `drawing_extractor.py` `pymupdf` import ediyor. Kapalı kaynak ticari üründe ticari lisans gerekir. Alternatif: `pdfplumber`/`pypdfium2` (lisansları kendi sürümünde doğrula).

---

## 3. Hedef Katman ve Crate Yapısı

### 3.1 Bağımlılık yönü (yalnızca aşağı doğru)

```
ortho-cli / src-tauri / ui          (sunum, IPC)
        |
ortho-review      <- onay durum makinesi, audit zinciri
        |
ortho-plan        <- InspectionPlan oluşturma, sıralama
        |
ortho-match       <- 2D açıklama <-> 3D unsur eşleştirme
        |
ortho-tolerance   <- ISO 286, ISO 2768, çözümleme (Fit -> Limits)
        |
ortho-drawing     <- çizim veri modeli (sadece tipler + saf fonksiyonlar)
ortho-brep        <- STEP ayrıştırma, unsur çıkarma
        |
ortho-units       <- Mm, Deg, Rad, EPS sabitleri
ortho-ast         <- ortak alan tipleri (şemadan üretilen)
```

Kurallar:
- Üst katman alt katmanı çağırır, tersi **yasak**. `ortho-brep` çizim bilmez, `ortho-drawing` STEP bilmez.
- `ortho-match` ikisini de bilen **tek** yerdir.
- `ortho-emitter` yalnızca `ortho-review` çıktısını (`ApprovedPlan`) kabul eder (§6).
- Çizim ön işleme (HSV, deskew) `ortho-drawing` içinde değil, `ortho-vision` (veya Python tarafı) altında olmalı. Veri modeli görüntü işlemeyi bilmemeli.

### 3.2 `ortho-brep` bölünmesi

Mevcut `lib.rs`/`drawing.rs`/`matching.rs`/`pmi.rs`/`tier.rs` dosyaları şuraya taşınır:

| Mevcut | Hedef |
|---|---|
| `step_parser.rs`, `surface.rs`, `multi_body.rs` | `ortho-brep` (kalır) |
| `drawing.rs` (tipler) | `ortho-drawing/src/model.rs` (şemadan üretilen) |
| `drawing.rs::classify_from_text`, `extract_title_block` | `ortho-drawing/src/sheet_classify.rs`, `title_block.rs` |
| `drawing.rs::DrawingImagePreprocessor` | `ortho-vision` |
| `matching.rs` | `ortho-match` |
| `pmi.rs` | `ortho-brep/src/pmi/` (gerçek AP242 ayrıştırıcı olana kadar `Unsupported` döner) |
| `tier.rs::HardwareProfile` | `ortho-ai/src/tier.rs` |
| `tier.rs::Tier1RuleBasedParser` | `ortho-drawing/src/parse/` (saf fonksiyonlar) |

Her dosya hedefi: **<300 satır**, tek sorumluluk, kendi birim testi yanında.

---

## 4. Veri Sözleşmeleri (Şema Düzeni)

### 4.1 Çıkarım ile ölçüm ayrılır

`drawing_data.schema.json` şu iki sözleşmeye bölünür:

- `drawing_extraction.schema.json` — PDF'ten **okunan** veri. Ölçüm alanı yok.
- `measurement_result.schema.json` — CMM çalıştıktan sonra **ölçülen** değerler. Çıkarım alanlarına `item_id` ile bağlanır.

Çıkarım boyutu (öneri, kısaltılmış):

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ExtractedDimension",
  "type": "object",
  "required": ["id", "kind", "raw_text", "provenance", "verification"],
  "properties": {
    "id": { "type": "string" },
    "kind": { "type": "string", "enum": ["LINEAR", "DIAMETER", "RADIUS", "ANGLE", "THREAD", "GDT_FRAME", "DATUM", "NOTE"] },
    "raw_text": { "type": "string" },
    "nominal_mm": { "type": ["number", "null"] },
    "quantity": { "type": "integer", "minimum": 1 },
    "tolerance": { "$ref": "#/definitions/ToleranceSpec" },
    "provenance": { "$ref": "#/definitions/Provenance" },
    "verification": { "$ref": "#/definitions/Verification" }
  },
  "definitions": {
    "Provenance": {
      "type": "object",
      "required": ["source_sha256", "page", "bbox", "method", "extractor_version"],
      "properties": {
        "source_sha256": { "type": "string", "pattern": "^[0-9a-f]{64}$" },
        "page": { "type": "integer", "minimum": 1 },
        "bbox": { "type": "array", "items": { "type": "number" }, "minItems": 4, "maxItems": 4 },
        "method": { "type": "string", "enum": ["VECTOR_TEXT", "OCR", "VLM", "MANUAL"] },
        "extractor_version": { "type": "string" }
      }
    },
    "Verification": {
      "type": "string",
      "enum": ["UNVERIFIED", "CAD_CROSS_CHECKED", "CAD_MISMATCH", "AMBIGUOUS", "OPERATOR_APPROVED", "REJECTED"]
    }
  }
}
```

Kurallar:
- `bbox` formatı tek yerde tanımlı: **`[x_min, y_min, x_max, y_max]`**, PDF noktası (pt), sayfa sol-üst orijin. Normalize [0..1] koordinat ayrı alandır (`bbox_norm`); iki format aynı alanda karışmaz (`drawing.rs` normalize, Python PDF pt kullanıyor).
- Şemada olmayan alan JSON'a eklenmez, `additionalProperties: false` kullanılır.
- Codegen çıktıları: TypeScript + Pydantic (mevcut) **+ Rust** (`typify` ile `build.rs` veya `scripts/codegen.mjs` içinden). Böylece Rust tarafındaki el yazısı struct'lar da şemadan türer.
- Şema değişince `npm run codegen` ve **şema sürümü** (`schema_version`) güncellenir. Uyumsuz sürüm okunduğunda hata verilir.

### 4.2 Tolerans temsili

```rust
pub enum ToleranceSpec {
    Bilateral { upper: Mm, lower: Mm },
    Symmetric { plus_minus: Mm },
    Limits { min: Mm, max: Mm },
    Fit { designation: FitDesignation },
    General { standard: GeneralToleranceStd },
    Unspecified,
}
```

- Çıkarım `Fit` veya `General` döndürebilir, sınırlara çevirme **yalnızca** `ortho-tolerance` içinde yapılır (§5).
- `Unspecified` meşru bir durumdur ve diğerine dönüştürülmez.

---

## 5. Tolerans Motoru (`ortho-tolerance`)

- **ISO 286-1/-2 tablolarını** (IT dereceleri ve temel sapmalar) standart metninden doğrulanmış şekilde bir veri dosyasına (`data/iso286.toml`) al. Elle uydurma sayı yok.
- Fonksiyon imzası:

```rust
pub fn resolve_fit(nominal: Mm, designation: &FitDesignation) -> Result<LimitPair, ToleranceError>
```

- Aralık dışı veya tanınmayan sınıf → `Err(ToleranceError::OutOfRange)`. Varsayılan yok.
- ISO 2768 (genel tolerans) için ayrı `resolve_general(nominal, class)` kullan.
- **Altın testler** (örnekler, standarttan doğrula):

| Giriş | Beklenen |
|---|---|
| Ø25 H7 | +0.021 / 0 |
| Ø12 H7 | +0.018 / 0 |
| Ø8 H7 | +0.015 / 0 |
| Ø40 H7 | +0.025 / 0 |
| Ø60 H7 | +0.030 / 0 |

- Sınır değerleri (aralık geçişleri: 3, 6, 10, 18, 30, 50, 80, 120 mm) için özel test yaz. Hatalar tam bu sınırlarda çıkar.
- Çizimde yazılan değer (`25 +0.021/0`) ile `H7`'den hesaplanan değer çelişirse `Verification::AMBIGUOUS` + uyarı kodu `TOL_FIT_CONFLICT`.

---

## 6. Güvenlik Zinciri: Tip Seviyesinde Onay

Onay atlamayı derleyici engellesin:

```rust
pub struct UnreviewedItem { pub dim: ExtractedDimension }
pub struct ApprovedItem {
    dim: ExtractedDimension,
    approval: Approval,
}
pub struct Approval {
    pub operator_id: String,
    pub at: Timestamp,
    pub source_sha256: String,
}

impl UnreviewedItem {
    pub fn approve(self, operator_id: String, at: Timestamp) -> Result<ApprovedItem, ReviewError>
}

pub struct ApprovedPlan { items: Vec<ApprovedItem>, audit_hash: AuditHash }

pub fn emit_pcdmis(plan: &ApprovedPlan) -> Result<String, EmitError>
```

- `ApprovedItem` alanları `pub` değildir ve yalnızca `approve` ile oluşur. Emitter başka tip kabul etmez.
- `approve` şu durumlarda `Err` döner: `CAD_MISMATCH`, `AMBIGUOUS` (çözülmemiş), `REJECTED`, nominal `None`.
- **Audit zinciri:** her plan öğesi `hash(önceki_hash || öğe_json)` ile bağlanır, `audit_hash` planın son hash'idir. Kayıt sonradan değiştirilirse zincir bozulur.
- Operatör kararları (onay/ret/düzeltme) `audit.log` olarak yalnızca eklenir (append-only). Düzeltmede eski değer silinmez, yeni kayıt eklenir.
- `inspection_plan.schema.json` içindeki `measured` alanı bu planın parçası değil, `measurement_result` sözleşmesine taşınır.

---

## 7. Eşleştirme Motoru (`ortho-match`)

### 7.1 Algoritma

1. **Aday üret:** her çizim ölçüsü için uygun tipteki (silindir, düzlem...) CAD unsurları. Tipe uymayan elenir.
2. **Skor bileşenleri** ayrı ayrı hesapla ve sakla:
   - `diameter_score` (nominal farka göre, eşikler `thresholds.toml`'dan)
   - `type_score`, `section_plane_score`, `quantity_score`
3. **Küresel atama (assignment problem):** tüm açıklamalar × unsurlar maliyet matrisinde Macar algoritması (Kuhn–Munkres) ile bire-bir eşle. `quantity: n` olan ölçü n unsura bölünür, n'den az bulunursa `AMBIGUOUS`.
4. **Belirsizlik:** en iyi iki adayın skor farkı `ambiguity_margin`'den küçükse eşleme `AMBIGUOUS` olarak işaretlenir, ilk bulunan seçilmez.
5. **Gerekçe yapısal:** `rationale` string değil, bileşen skorlarını taşıyan struct olur:

```rust
pub struct MatchEvidence {
    pub diameter_delta: Mm,
    pub type_match: bool,
    pub section_plane_distance: Option<Mm>,
    pub runner_up_margin: f64,
}
```

### 7.2 GD&T çerçeveleri

- FCF için sabit `0.75` skor kaldırılır. Çerçeve, referans verdiği **boyuta/unsura** (leader satırı, bbox yakınlığı, aynı balon) bağlanır. Bağ bulunamazsa `UNVERIFIED` kalır.
- Datum etiketi çizimde tanımlanıp CAD'de eşlenmemişse plan `blocked` olur.

### 7.3 Zorunlu testler

- İki aynı çaplı delik, iki ayrı ölçü → ikisi farklı unsura gider.
- `4x Ø12` ve CAD'de 3 delik → `AMBIGUOUS`.
- Eşit skorlu iki aday → `AMBIGUOUS`, rastgele seçim yok.
- Hiç aday yok → `CAD_MISMATCH`.
- Aynı girdi iki kez çalıştırılınca **bit-bit aynı** çıktı (determinizm).

---

## 8. Çıkarım Hattı (Python Tarafı)

### 8.1 Modül yapısı

```
tools/extractor/
├── pipeline.py          # akış: sadece birleştirir, mantık içermez
├── sources/
│   ├── vector_text.py   # vektör PDF'ten kelime + bbox
│   ├── raster_ocr.py    # raster sayfa: tiling + OCR
│   └── vlm_regions.py   # sadece bölge sınıflandırma, sayı okumaz
├── parse/
│   ├── dimension.py     # saf: str -> ParsedDimension | None
│   ├── tolerance.py
│   ├── gdt_frame.py
│   └── thread.py
├── title_block.py       # bulunamayan alan None
├── models/              # codegen: Pydantic (elle düzenleme yasak)
└── tests/
    ├── test_dimension.py
    ├── test_title_block.py
    └── golden/          # BENCH_LAB'dan beklenen JSON'lar
```

### 8.2 Kurallar

- `parse/*` fonksiyonları **saf**: girdi `str`, çıktı veri. Dosya, ağ, global durum yok. Bu sayede ajan tek başına test edebilir.
- `Decimal` kullan. Para/ölçüde `float` ile string-biçimleme (`f"{x:.3f}"`) yapma.
- Bulunamayan değer `None`. Hiçbir "yedek liste", "örnek veri" veya dosya adı dalı bulunmaz (Y1, Y4).
- Her çıktı öğesi `Provenance` taşır (sayfa, bbox, yöntem). `bbox` PDF noktası cinsinden `[x_min, y_min, x_max, y_max]`.
- Birleşik çıktı metrikleri: `n_found`, `n_unparsed_tokens` (sayıya benzeyip ayrıştırılamayanlar). Ayrıştırılamayan token **sessizce atılmaz**, `unparsed` listesinde raporlanır.
- Kapsam dışı bırakılan sayfa/bölge `warnings` içinde açıkça belirtilir.
- Doğrulama sırası: vektör metin → (gerekirse) raster OCR → CAD çapraz doğrulama → operatör. VLM sayı okumaz, sadece "burada tolerans çerçevesi var" der.
- Modeller yerel çalışır, ağırlık dosyalarının SHA-256 değeri `models.lock` içinde kayıtlıdır; hash uyuşmazsa başlatma reddedilir.
- Her çalıştırmada `extractor_version` + giriş PDF `sha256` + model hash'i çıktıya yazılır (tekrar üretilebilirlik).

---

## 9. Hata Sınıflandırması

Her crate kendi `thiserror` enum'unu tanımlar. Ortak kural:

| Sınıf | Anlamı | Davranış |
|---|---|---|
| `InputInvalid` | Dosya bozuk/desteklenmiyor | Hata döner, devam etme |
| `Unsupported` | Özellik henüz yok (ör. PMI) | `Err(Unsupported)`, sahte sonuç yok |
| `Unverified` | Değer okundu, doğrulanmadı | Planda işaretlenir, onay bekler |
| `Conflict` | Kaynaklar çelişiyor | Operatöre gider |
| `Internal` | Kod hatası | Loglanır, kullanıcıya genel mesaj |

- Hata kodları sabit string (`TOL_FIT_CONFLICT`, `MATCH_AMBIGUOUS`...) ve `docs/error_codes.md` içinde listelenir. Arayüz kodu çevirir, serbest metne bağlı kalmaz.
- Loglama `tracing` ile; `print`/`console.log` yasak (AGENTS.md kural 4).

---

## 10. Test Piramidi

| Seviye | Ne test eder | Araç | Hız |
|---|---|---|---|
| Birim | Saf ayrıştırıcılar, ISO tabloları, skor bileşenleri | `cargo test`, `pytest`, `vitest` | ms |
| Özellik (property) | Ayrıştırıcı rastgele girdide çökmez; `parse(format(x)) == x` | `proptest`, `hypothesis` | s |
| Altın dosya | Bilinen STEP/PDF → beklenen JSON | `insta` (Rust snapshot), `pytest` | s |
| Entegrasyon | PDF → plan → emitter uçtan uca | `cargo test -p ortho-cli` | s |
| Görsel | Balon konumu, 3D görünüm | Playwright snapshot | dk |
| Metrik | Alan bazlı doğruluk (nominal, üst/alt tol., GD&T tipi) | `tools/eval/` betiği, CI | dk |

Altın veri kuralları:
- `test_assets/BENCH_LAB` her numune için **`expected.json`** taşır: elle doğrulanmış ölçü listesi + hangi CAD unsuruna eşlendiği.
- Beklenen dosyayı kodu yazan ajan **değiştiremez**. Değişiklik ayrı, insan onaylı bir commit'tir.
- Metrik regresyonu (ör. nominal doğruluk düşerse) CI'ı kırar.
- `output_calypso.txt` ve `output_pcdmis.dmi` snapshot test olur. Her satır farkı yakalanır.
- Sentetik veriye ek olarak izinli birkaç **gerçek** çizim en erken aşamada alınır.

Rust test kodunda `unwrap()` serbest, üretim kodunda yasaktır. `clippy.toml` içinde `allow-unwrap-in-tests = true` ve `allow-expect-in-tests = true` ayarla.

---

## 11. Performans ve Kaynak Politikası

Hedef donanım: mühendislik iş istasyonu. Bu yüzden kaynağı kullanabiliriz, ama ölçülebilir ve kontrollü:

- Sayfa/kare düzeyinde paralellik: Rust'ta `rayon`, Python'da `ProcessPoolExecutor`. İş parçacığı sayısı `HardwareProfile`'dan gelir, sabit yazılmaz.
- Önbellek anahtarı: `sha256(pdf) + extractor_version + models.lock hash`. Eşleşirse yeniden hesaplanmaz.
- Ağır model (VLM) yalnızca raster ve belirsiz bölgelerde çalışır. Vektör PDF'te hiç yüklenmez.
- UI ana iş parçacığı bloklanmaz (Web Worker, 16 ms kuralı).
- Her aşama süre ve bellek ölçümünü `tracing` span'ı ile kaydeder. Performans hedefi aşıldığında CI uyarır.
- Tier seçimi (`select_optimal_tier`) test edilebilir saf fonksiyon kalır. Kirlilik göstergesi de sabit bir bool değil, ölçülebilir kalite sinyallerinden (OCR güveni, metin yoğunluğu) üretilir.

---

## 12. Elektron/IPC Sınırı

- `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, `preload.js` ile `contextBridge`.
- IPC kanalları tek dosyada (`ipc/channels.ts`) adlandırılır, her kanalın girdi/çıktısı şemada tanımlıdır, girdi main tarafında doğrulanır.
- Dosya yolu alan kanallar yalnızca izinli kök dizinlerde çalışır (`path.resolve` + `startsWith` kontrolü). `read-local-cad` içindeki özyinelemeli dosya arama kaldırılır.
- Dış süreç (`python`) yalnızca pakete gömülü yorumlayıcının mutlak yoluyla çağrılır, argümanlar dizi olarak geçilir.
- `ipcMain.handle` kayıtları `createWindow` dışında, uygulama başlangıcında bir kez yapılır.
- Ağ erişimi yok: Electron `session.webRequest` ile dış istekler engellenir (savunma ortamı kuralı).

---

## 13. Görev Şablonu (Ajana Verilecek)

```
GÖREV: <tek cümle>
KATMAN: <hangi crate/modül, §3.1>
YASALAR: Y1..Y9 geçerli, ayrıca: <ilgili §>
GİRDİ TİPİ / ÇIKTI TİPİ: <şema veya Rust imzası>
ÖNCE YAZILAN TEST: <dosya + test adı, kırmızı>
DEĞİŞEBİLECEK DOSYALAR (<=3): ...
DOKUNULAMAZ: tests/**/expected*.json, schemas/** (ayrı görev)
BİTİŞ KOŞULU: npm run check:all yeşil + yeni test yeşil
RAPOR: değişen dosya, çalıştırılan komut çıktısı, bilinen eksikler
```

Ajan için ek kurallar:
- "Yaptım" demek yetmez. **Komut çıktısı** kanıt olarak eklenir.
- Mevcut testi geçirmek için testi değiştirmek yasaktır.
- Kapsam dışı sorun görünce düzeltmez, rapora yazar.
- Şüphe halinde varsayım yapmaz, soru sorar.

---

## 14. Uygulama Yol Haritası (Her Adım En Fazla 3 Dosya)

| Faz | İş | Çıktı kanıtı |
|---|---|---|
| **F0** | `drawing_extractor.py`'den tüm sabit/uydurma veriyi sil (gobek dalı, `len(dims)==0` yedek listesi, `measured/deviation/status` üretimi). Bulunamayan alan `None`. | `pytest` ile "boş PDF → boş liste" ve "sabit dosya adı etkisizdir" testleri |
| **F1** | Şemayı böl: `drawing_extraction` (ölçümsüz) ve `measurement_result`. Codegen'e Rust ekle. | `npm run codegen` + `check:types` |
| **F2** | `pmi.rs`'yi `Unsupported` döndür hale getir (sahte tolerans üretimi biter). `extract_title_block` varsayılanlarını `Option` yap. | `cargo test -p ortho-brep` |
| **F3** | `ortho-tolerance` crate'i: ISO 286 H/h tablosu + sınır testleri. `parse_diameter_callout` bu crate'i kullanır. | altın tolerans tablosu testi |
| **F4** | Çıkarıcıyı §8.1 yapısına böl, `parse/*` saf fonksiyonlar + özellik testleri. PyMuPDF yerine lisans-uyumlu kütüphane. | golden JSON karşılaştırması |
| **F5** | `ortho-match`: bire-bir atama, belirsizlik, yapısal kanıt, eşikler `thresholds.toml`. | §7.3 testleri |
| **F6** | `ortho-review`: `ApprovedPlan` tip zinciri + audit hash. Emitter yalnızca bunu kabul eder. | derleme hatası testi (`trybuild`) + snapshot |
| **F7** | Electron güvenlik sertleştirmesi (§12). | Playwright + IPC doğrulama testi |
| **F8** | `BENCH_LAB` için `expected.json` ve CI metrik betiği. | metrik raporu |

F0 hepsinden önce yapılmalıdır. Sahte veri varken geri kalan her ölçüm iyileştirmesi yanıltıcı olur.

---

## 15. Pull Request Kontrol Listesi

- [ ] Uydurma/varsayılan ölçü, tolerans veya malzeme eklenmedi (Y1)
- [ ] Çıkarım katmanı ölçüm alanı üretmiyor (Y2)
- [ ] Her yeni değer `Provenance` taşıyor (Y3)
- [ ] Dosya adına bağlı dallanma yok (Y4)
- [ ] Eşik değerleri `thresholds.toml` içinde (Y9)
- [ ] Yeni tip şemadan türedi, elle yazılmadı
- [ ] Bağımlılık yönü §3.1'e uygun
- [ ] Yeni mantık için önce yazılmış test var, altın dosyalar değişmedi
- [ ] `unwrap`/`expect`/`print`/`console.log`/yorumlanmış kod yok
- [ ] `npm run check:all` çıktısı PR açıklamasında
