# Ölçüm Sıralama ve Takım Yolu Kuralları (Datum → Mesafe → Konum → Kalınlık)

> **Durum:** Taslak kural seti. Çalışan özellik listesi değildir; uygulama durumu için [progress.md](progress.md).
> **Referans parça:** `10142739_dc_modul_plaka` (ASELSAN, KPT-2997). Aşağıdaki "Doğrulanmış gerçekler" PDF ve STEP'ten birlikte okunmuştur; örnek veri değildir.
> **İlişkili:** [gdtStandardsAndDrawingRules.md](gdtStandardsAndDrawingRules.md), [lightTableCapabilityPlan.md](lightTableCapabilityPlan.md) (IM-04).

---

## 0. Sıfır Uydurma İlkeleri (değişmez)

| # | Kural |
|---|---|
| Z1 | Her nominal, tolerans, adet, datum referansı pafta üzerinde bir **kaynağa** (sayfa + bbox) bağlanır. Kaynağı olmayan değer plana girmez. |
| Z2 | Veri eksikse varsayılan değer atanmaz; kayıt `EKSİK` durumunda kalır ve insan onayı ister. |
| Z3 | CAD nominali (STEP) yalnızca "Verilmeyen ölçüler: EKLİ 3B MODEL" notu varsa ve ölçü paftada yoksa kullanılır. |
| Z4 | Mock/demo/örnek veri üretim planına karışamaz. Kaynağı pafta+STEP olmayan unsur ölçüm listesine giremez. |
| Z5 | Bir kural parçadan türetilmiş sayı içeremez (ör. `13.08`, `53.9`). Kurallar yalnızca sembol, ilişki ve sıra tanımlar; sayılar paftadan okunur. |

---

## 1. Paftadaki harfleri ayırma (bu pafta dört ayrı "A/B/C" kullanıyor)

| Harf kaynağı | Örnek | Datum mudur? |
|---|---|---|
| Pafta çerçeve bölge harfleri (A–D) ve rakamları (1–8) | kenar şeridi | **Hayır** |
| Datum unsuru sembolü (kutulu harf + dolu üçgen) | `▼C`, `▲B`, `▶A` | **Evet** |
| Yüzey grubu işareti (daire/dikdörtgen içinde harf, ok ve nokta) | dairede `A`, dikdörtgende `B`, noktalı `C` | **Hayır** — "YÜZEY" tablosundaki gruptur |
| FCF datum referansı | `⌖ Ø0.2 A B C` | Evet (sıra korunur) |

Kural: Tablo satırı `A/B/C` ile datum `A/B/C` asla birleştirilmez (IM-04).

---

## 2. Aşama 1 — Datum kurulumu (her ölçümden önce)

Amaç: PCS_ABC koordinat sistemi. Tüm sonraki ölçümler bu sistemde raporlanır.

| Adım | Datum | Geometri | Min. nokta | Ölçülen unsur |
|---|---|---|---|---|
| D1 | **A** (birincil) | Düzlem | 3 (üçgen oluşturacak şekilde yayılmış, doğrusal olmayan) | Datum A işaretli yüz |
| D2 | **B** (ikincil) | Çizgi (A'ya dik) | 2 | Datum B işaretli kenar |
| D3 | **C** (üçüncül) | Nokta/çizgi (A ve B'ye dik) | 1 (tercihen 2) | Datum C işaretli kenar |

Kurallar:
- D1 → D2 → D3 sırası değişmez. Datum ölçülmeden hiçbir unsura geçilmez.
- Sıfır noktası = B çizgisi ∩ C çizgisi, A düzlemi üzerinde. Pafta "0" işaretleri bu sıfırı verir.
- Eksen eşlemesi pafta etiketinden değil, **B ve C kenar uzunluklarıyla** çözülür: paftada B'den ölçülen aralık STEP'te hangi boyuta (ör. 39 / 60.6) uyuyorsa o eksen seçilir. Belirsizse dur ve sor.
- Kenar noktaları STEP'ten bulunan **düz kenar segmentlerinde** seçilir; köşe, kesik, R ve çıkıntılardan en az 3 mm uzakta. Kenar yüksekliği (ör. 1.2 mm) top çapına göre uygun değilse "probe edilemez" uyarısı verilir.
- Datum noktaları ölçülünce PCS'e hizalama sapması (artık hata) raporlanır; bir eşiği aşarsa plan durur.
- Ölçümlere datum adı verilir: `DATUM_A`, `DATUM_B`, `DATUM_C`, ardından `PCS_ABC`.

---

## 3. Aşama 2 — Datum'a bağlı mesafeler

Paftada ölçüler iki sıfır çizgisinden (B ve C) **taban ölçülendirme** ile verilir; her ölçü sıfırdan bağımsız mutlak konumdur. Zincir (komşu unsurdan komşu unsura) değildir.

Kurallar:
1. Her mesafe `from` (hangi datum/sıfır) + `axis` + `feature` + `nominal` + `tolerans kaynağı` olarak kaydedilir.
2. Ölçü sırası: önce B'den (bir eksende) artan sırayla, sonra C'den (diğer eksende) artan sırayla. Aynı bölgedeki noktalar peş peşe alınarak kafa hareketi azaltılır.
3. Ölçülen değer `PCS_ABC` koordinatındaki unsur konumudur (kenar/düzlem noktası − sıfır).
4. Tolerans çözümü (gdtStandardsAndDrawingRules.md §2 hiyerarşisi):
   - Doğrudan toleranslı (`59.2±0.1`) → o tolerans.
   - Kutulu temel ölçü (`[53.9]`) → tolerans yok; yalnızca bağlı FCF değerlendirir. Genel `±0.2` **uygulanmaz**.
   - Tolerans yok, kutu yok → antet genel toleransı (`±0.2/±1°`).
5. Karşı karşıya duran iki yüz arasındaki mesafe (ör. 60.6, 39 genel boyutlar) iki ayrı yüzeyin PCS konumlarının farkıdır; B/C ile aynı noktada alınmaz.
6. `2X`, `4X` gibi adet çarpanı, bağlanan CAD unsur sayısıyla karşılaştırılır; uyuşmazsa uyarı (adet tablosu da dahil).

---

## 4. Aşama 3 — Datum'lu geometrik toleranslar (konum)

Tetik: FCF'te sıralı datum referansı olan tolerans (ör. `⌖ Ø0.2 A B C`).

Sıra: Aşama 1 ve 2 tamam → A-B-C sırasıyla kurulu DRF → unsurlar.

Konum hesabı (silindirik bölge, MMC/LMC yoksa):

```
dx = ölçülen_x − temel_x,  dy = ölçülen_y − temel_y   (PCS_ABC, temel ölçüler kutulu değerler)
konum_sapması = 2 · √(dx² + dy²)      → ≤ toleranslı bölge çapı ise PASS
```

Kurallar:
- Temel ölçüler (kutulu) paftadan okunur; birden fazla unsuru kapsayan ölçü ve `NX` çarpanları tek tek unsura dağıtılır.
- Datum sırası (A B C) hesapta korunur; farklı sırada hesap yapılırsa "semantik değişiklik" kaydı oluşur.
- Delik çapı, ölçülen tam daireden (≥4 nokta, aynı yükseklikte) hesaplanır; merkez ve çap birlikte raporlanır.
- Dişli/helicoil notlarında (`M3 HELICOIL`) prob diş profiline vurmaz; hangi silindirik yüzeyin ölçüleceği (pilot delik/mastar) açıkça seçilir ve kayda yazılır.
- MMC/LMC değiştiricisi yoksa bonus tolerans uygulanmaz.

---

## 5. Aşama 4 — Kalınlık ve yükseklikler

Tetik: kalınlık / yükseklik / "A DATUMUNA OLAN MESAFE" tablosu.

Kurallar:
1. Yükseklikler Datum A düzlemine göre PCS Y (veya normal) ekseninde hesaplanır: `h = yüzey_noktası_konumu − A_düzlemi`.
2. "YÜZEY / A DATUMUNA OLAN MESAFE / ADET" tablosundaki her satır için ilgili yüzey grubundaki **tüm** yüzeyler ölçülür; ölçülen yüzey sayısı tablodaki adetle eşleşmelidir (aksi halde `EKSİK`).
3. Kalınlık (ör. levha kalınlığı) iki karşıt yüzeyin PCS konumları farkıdır; alt yüz için A0 B90 ile alttan alım kullanılır (bağlama aparatı yüksekliği yeterliyse).
4. Aşağıda kalan/erişilemeyen yüz varsa operatöre fikstür yüksekliği önerilir (ör. çift taraflı bantla yükseltme).

---

## 6. Takım yolu (prob) kuralları

| # | Kural |
|---|---|
| T1 | Dikey eksenli (eksen ∥ stylus) delikler **A0° B0°** ile üstten ölçülür. A0 B90 yalnızca delik ekseni yatay ise veya üstten erişim engelli ise kullanılır. |
| T2 | A0B0 üstten iniş için stylus + gövde koridoru (`ball r`, `stem r`) delik çevresindeki yüksek unsurlara (ör. 5.7 mm pedler) karşı kontrol edilir. Çarpışırsa B90 veya başka açı seçilir. |
| T3 | Top çapı delik çapına uygun seçilir: `top_çapı ≤ 0.6 · delik_çapı`. Seçilen top bu sınırı sağlamıyorsa plan dur ve "uygun stylus yok" der. |
| T4 | Daire ölçümü derinliği: delik derinliğinin ortası (veya ASME tanımlı derinlik); ince plakada top çapı bu derinliğe sığmıyorsa uyarı. |
| T5 | Yaklaşma yönü her zaman yüzeyin dışarı bakan normali üzerinden, serbest hava tarafından olur; parçaya gömülü nokta üzerinden yaklaşılmaz. |
| T6 | Hızlı hareketler (rapid) en yüksek yapının üzerindeki güvenli Z'de yapılır; datum kenar ölçümlerinde yatay yaklaşma mesafesi, komşu pad/duvar yüksekliğine göre arttırılır. |
| T7 | Aşama sırası tek bir rota içinde korunur: Datum → Mesafe → Konum → Kalınlık. Aşamalar içinde bölgesel gruplama ve en kısa gezinti. |
| T8 | Bir aşamanın hatalı (FAIL/EKSİK) çıkması sonraki aşamayı durdurur (datum hizası bozuksa mesafe/konum hesaplanmaz). |

---

## 7. Doğrulanmış gerçekler: `10142739_dc_modul_plaka`

PDF (sayfa 2) ve STEP birlikte okunmuştur.

| Konu | Paftadan | STEP'ten doğrulama |
|---|---|---|
| Genel boyut | `60.6±0.1`, `39±0.1` | bbox `60.6 × 39.0`, kalınlık `5.7` (= levha 1.2 + en yüksek pad 4.5) |
| Datum B / C | `▲B` sol kenar (0), `▼C` alt kenar (0) | bu kenarlardan taban ölçülendirme |
| Datum A | levha ön yüzü (pad tarafı), pad yükseklikleri buradan | Y düzlemleri: `1.2` levha üstü |
| Yüzey tablosu | A: `3.3±0.1` ×4, B: `4.5±0.1` ×4, C: `2±0.1` ×7 | Y seviyeleri (düzlemler): `4.5` ×4 (=1.2+3.3), `5.7` ×4 (=1.2+4.5), `3.2` ×7 (=1.2+2.0). Tablo adetleri STEP ile uyuşuyor. |
| Delikler | `4X M3 HELICOIL ⌖Ø0.2 A B C`, `Ø2.5 THRU` | **5 gerçek delik:** 4× Ø3.0 + 1× Ø2.5 |
| Helicoil konumları | kutulu `53.9`, `6.7` (×2), `6.42`, `32.58` (×2) | pafta ofsetleri bbox merkezinden `±23.6`, `±13.08` verir; STEP delik eksenleriyle birebir uyuşuyor |
| Cep | `4X R2`, cep derinliği `0.4` | STEP'te `0.8` cep tabanı seviyesi (1.2 − 0.8 = 0.4) |

Notlar:
- `53.9`, `6.7`, `6.42`, `32.58` kutulu temel ölçülerdir; konum toleransı yalnızca `⌖ Ø0.2 A B C` ile değerlendirilir.
- `Ø2.5 THRU` deliğine bağlı FCF veya ayrı konum ölçüsü paftada yoktur; konumu "EKLİ 3B MODEL" notuyla STEP'ten alınır, tolerans kaynağı açık soru (§9).

---

## 8. Mevcut kodda tespit edilen hatalar (bu kurallara göre düzeltilecek)

| # | Bulgu | Yer |
|---|---|---|
| H1 | **Delikler birleştiriliyor.** Silindirler `(çap, eksen yönü, eksenin orijine uzaklığı)` anahtarıyla gruplanıyor. Orijine eşit uzaklıktaki simetrik 4 delik tek unsur olur ve merkezi ortalama alınıp **(0, y, 0)** çıkar. Bu parçada 4 helicoil deliği tek `CAD_HOLE_Ø3.00` olarak parça merkezine yazılıyor; takım yolu delikler yerine parça merkezine iniyor. | [brep_verifier.py L257–L271, L374–L391](file:///d:/Projects/nuper-project/nuper_ortho/tools/extractor/brep_verifier.py#L257-L391) |
| H2 | **Pah/yuvarlatmalar delik sayılıyor.** Açısal kapsam kontrolü yok. Köşe R1 ve cep R2 yüzeyleri `CAD_HOLE_Ø2.00` ve `CAD_HOLE_Ø4.00` olarak listeleniyor. Gerçek delik tam 360° (ör. iki yarım yüz) olmalı. Bu parçada 9 "delik" çıkıyor, gerçekte 5. | [brep_verifier.py L237–L271](file:///d:/Projects/nuper-project/nuper_ortho/tools/extractor/brep_verifier.py#L237-L271) |
| H3 | **Aşama sırası yok.** Rota balon sırasıyla üretiliyor; datum kurulumu ve datum→mesafe→konum→kalınlık gruplaması yok. | [MeasurementPathGenerator.ts L118](file:///d:/Projects/nuper-project/nuper_ortho/ui/src/modules/cad/utils/MeasurementPathGenerator.ts#L118) |
| H4 | **Stylus uygunluğu kontrol edilmiyor.** Top çapı/delik çapı, kafa-gövde koridoru ve ince plakada daire derinliği doğrulanmıyor (T3, T4, T2). | [MeasurementPathGenerator.ts](file:///d:/Projects/nuper-project/nuper_ortho/ui/src/modules/cad/utils/MeasurementPathGenerator.ts) |
| H5 | **Kafa açısı seçimi yüzey normaline bağlı, T1 kuralına değil.** Delik ekseni ile stylus ekseninin ilişkisi açık kural olarak tanımlı değil; yatay normalli unsurlar B90'a düşüyor. | [MeasurementPathGenerator.ts L236–L283](file:///d:/Projects/nuper-project/nuper_ortho/ui/src/modules/cad/utils/MeasurementPathGenerator.ts#L236-L283) |

---

## 9. Açık sorular (kod yazmadan önce karara bağlanacak)

1. Ø2.5 THRU deliğinin konum toleransı: antet genel `±0.2` mi, yoksa yalnızca çap ve "var/yok" kontrolü mü?
2. Tolerans belirtilmemiş, kutusuz ölçüler (`16`, `25.9`, `30`, `49.4`, `48`, `26.3`, `20.3`): antet `±0.2` uygulansın mı yoksa EKLİ 3B MODEL'den profil kontrolüne mi bağlansın?
3. Datum kenarlarında (1.2 mm yükseklik) kullanılacak top çapı ve hangi stylus ile alınacağı.
