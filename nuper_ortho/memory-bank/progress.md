# Nuper Ortho — Kanıta Dayalı Durum ve Onarım Planı

Son güncelleme: 4 Ekim 2026. Güncel iş sırasının ve kabul durumunun tek kaynağı bu belgedir. Önceki FAZ 1–14, altyapı FAZ 1–5 ve “Trusted Drawing Ingestion mühürlendi” tablolarının yerini alır. Eski çalışmaların ayrıntıları Git geçmişinde bulunur.

## 1. Hedef ve sınır

Uygulama bileşen düzeyinde ilerlemiştir; gerçek dosyalardan güvenilir ölçüm planı üretme akışı tamamlanmamıştır. İlk hedef, desteklenen analitik yüzeyleri bulunan bir STEP/PDF çifti için kaynağı izlenebilir çıkarım, bağlama/erişim değerlendirmesi, operatörün kurduğu hizalama, düzenlenebilir balonlar, gerçek CAD eşleştirmesi ve tek hedef lehçede doğrulanabilir taslak çıktı üretmektir. İlk kullanıcı kabul örneği KPT-3150 Kör Tapa'dır; davranış bu dosyanın adına özel kodlanmaz. Desteklenmeyen durum açıkça bildirilir; örnek model veya varsayılan ölçü kullanılmaz.

Çalışan dikey dilim ve fiziksel tezgah kabulü ayrı kilometre taşlarıdır. Kodda “certify”, “FAT” veya “golden master” adının bulunması sertifikasyon kanıtı değildir.

Bağlayıcı kaynaklar: [AGENTS.md](../AGENTS.md), [mimari yasalar](architectureBlueprint.md), [geliştirme kuralları](developmentInfrastructureRules.md). İnceleme tabanı: [rapor](../docs/project-audit-2026-10-04.md).

## 2. Durum sözlüğü

| Durum | Anlamı |
|---|---|
| Planlandı | Uygulama ve kabul kanıtı yok |
| Kısmi | Kod/test mevcut; kabul koşullarının tamamı sağlanmıyor |
| Açık hata | Kod veya canlı çalışma ile hata doğrulandı |
| Doğrulama bekliyor | İddia/kod var; ilgili senaryo çalıştırılmadı |
| Kabul edildi | Belirtilen kapsam, girdi, sürüm ve kanıtla tüm koşullar sağlandı |

Bir komut yalnızca kendi kapsamını doğrular. Faz kabulü alt işlerin ve gerçek kullanıcı senaryosunun birlikte geçmesini gerektirir. Henüz kabul edilmiş onarım fazı yoktur.

## 3. Mevcut envanter

| Alan | Durum | Gözlenen kanıt / eksik |
|---|---|---|
| Electron açılışı | Kısmi | Gerçek pencere açılıyor; eksik bridge ve CDN bağımlılıkları var |
| Vite/TypeScript/Vitest | Kısmi | Build, tür kontrolü ve 75 test geçti; dev sunucusu Electron'a bağlı değil |
| Python çıkarımı | Kısmi | 24 test geçti; üretim UI'sinin aynı yolu kullandığı doğrulanmıyor |
| STEP görünümü | Kısmi | Test STEP'i görünümü güncelliyor; eşleştirici metadata almıyor |
| PDF/ölçü aktarımı | Kısmi | IPC ve kanvas senkronize; görsel yüklemede mockup temizlendi; balon altı özellik etiketleri devrede |
| Araç çubuğu/çift kanvas | Kısmi | Sağ tık bağlam menüsü ve ➕ Unsur Ekle butonuyla kanvas/ışık masası üzerinden interaktif unsur tanımlama aktif |
| CAD/çizim eşleştirme | Kısmi | Gerçek yüklemede sonuç null olmaması için FeatureDefinitionModal ve InspectionTable dinamik satır köprüsü kuruldu |
| Rust workspace | Kısmi | cargo check geçti; bu incelemede cargo test çalıştırılmadı |
| Onay tipleri | Kısmi | review.rs var; eski emitter girişleri ve deserialize/değişiklik yolları denetlenmeli |
| Onay audit özeti | Açık hata | ApprovedPlan::new özel 64 bit özet üretiyor; tolerans/onay alanlarının tamamını kapsamıyor; SHA-256 zinciri değil |
| Onaylı emitter | Kısmi | emit_pcdmis_from_approved_plan yalnızca açıklama satırları üretiyor; tam makine programı değil |
| Sözleşme/codegen | Kısmi | TS/Python üretimi var; Python hatası yutuluyor, Rust üretimi yok |
| SceneCleaner/worker | Kısmi | Modül ve testler var; tüm canlı yolların bunları kullandığı kanıtlanmadı |
| PMI/tolerans bileşenleri | Doğrulama bekliyor | Önceki düzeltmelerin kodu var; tam kapsam ve standart sınır testleri ayrıca doğrulanmalı |
| Fiziksel CMM/üretici kabulü/FAT | Doğrulama bekliyor | Bu incelemede saha kanıtı üretilmedi |

drawing_data.schema.json hâlâ çıkarım öğesinde measured, deviation ve status istiyor. verification/provenance alanlarının bulunması, çıkarım ve ölçüm sözleşmelerinin ayrıldığı veya menşein zorunlu tutulduğu anlamına gelmez.

## 4. Doğrulama kaydı

Aşağıdaki sonuçlar 4 Ekim 2026 incelemesine aittir; plan düzenlemesinde yeniden test çalıştırıldığı iddia edilmez.

| Kontrol | Sonuç | Kanıt sınırı |
|---|---|---|
| npm run check:types | Başarılı | TypeScript tür kontrolü |
| npm run test:ui | 16 dosya / 75 test başarılı | Modül testleri |
| python -m pytest tools/tests -q | 24 test başarılı | Python test kapsamı |
| cargo check --workspace | Başarılı, 8 uyarı | Derleme kontrolü; Rust testi değil |
| npm run build | Başarılı, uyarılar var | Eksik klasik script build'i durdurmuyor |
| node scripts/verify_live_ui.mjs | Başarısız | 2D alan 0; gerçek IPC kurulmayan ayrı pencere |
| Gerçek Electron + valve_block.step | Hata yeniden üretildi | Model görünür; metadata/eşleşme null |
| Çift Kanvas, iki ardışık geçiş | Hata yeniden üretildi | Aktif sınıf değişiyor, display hep none |
| Prob Seç / Düzlem ekleme | Kısmi | Prob modalı açılıyor; unsur ağacı gizli |

npm run check:all mevcut haliyle Rust testlerini, production build'ini veya gerçek Electron kabulünü içermez. Tek başına ürün kabul kapısı değildir.

## 5. Bağımlılık sırası ve görev boyutu

**R0 → R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8**

Bunlar tek görev değil, fazlardır. Her atomik görevde en fazla üç bağımsız modül dosyası değiştirilir; testler ve codegen çıktıları görev envanterinde gösterilir. Üç dosyaya sığmayan alt iş uygulamadan önce bölünür. Faz kapısı kapanmadan bağımlı özellik kabul edilmiş sayılmaz.

### R0 — Sonuç uyduran yolları kaldır

**Durum:** Açık hata. **Öncelik:** P0. **Bağımlılık:** Yok.

| Alt iş | Kapsam / aday dosyalar | Kabul kanıtı |
|---|---|---|
| R0.1 | DrawingPdfParser.ts ve regresyon testi | Aynı PDF farklı adla aynı çıkarımı verir; nominalden measured/PASS türemez; boş içerik ölçü üretmez |
| R0.2 | SetupWizard.ts, davranış testi; gerekirse bir saf yardımcı | Bozuk PDF/görsel/iptal durumunda örnek ölçü yüklenmez; boş yeni girdi eski ölçüleri tutmaz; hata görünür |
| R0.3 | Eski bridge, manuel unsur ve dışa aktarma girişleri için ayrı atomik işler | Sabit/rastgele ölçüm ve sahte başarı üretim yolunda çalışmaz; bridge yalnızca kopyalanarak etkinleştirilmez |

**Faz kapısı:** Menü, ribbon, seçim ve sürükle-bırak üzerinden ölçüm yapılmadan PASS üretilemez; doğrulanmış onay/rota zinciri olmayan dışa aktarma kapalı kalır. Mevcut şema değişmeden zorunlu alanlar silinmez veya yeni alan eklenmez. Y2 ile mevcut ölçüm alanı zorunluluğunun birlikte sağlanamadığı üretim yolu sonuç üretmek yerine açık hata ve boş ölçü listesi verir; doğru sözleşmeyle yeniden açılması R1'e bağlıdır. Eksik nominal/tolerans uydurulmaz. ui/index.html içine kod eklenmez; eski davranış kaldırılır veya modüler girişten devreden çıkarılır.

### R1 — Sözleşmeler ve güvenilir codegen

**Durum:** Kısmi. **Bağımlılık:** R0.

- R1.1: Eksik şema/bağımlılık veya Python üretim hatası codegen'i başarısız kılsın; hata enjeksiyonuyla doğrula. Rust tip üretimini ayrı atomik işte ekle.
- R1.2: Çıkarım ve fiziksel ölçüm sonucu sözleşmelerini ayır. Şema sürümü, zorunlu provenance, hata/uyarı, birim ve bbox sözleşmesini belirle. Bilinmeyen değer gerçek sıfırdan ayrılır. Bunlar hedef alanlardır; mevcut payload'a önceden eklenmez.
- R1.3: CAD, eşleştirme, onay ve plan sınırlarını şemalaştır; üretici/tüketicileri aşamalı geçir. Gerçek payload her sınırda doğrulanır.
- R1.4: Mevcut verification enum'u ile hedef yaşam döngüsü arasında açık geçiş tablosu ve sürüm reddi oluştur; iki bağımsız durum sözlüğü bırakma.
- R1.5: Operatör akışı için kaynak/revizyon, standart/not, datum, bağlama, kurgu geometrisi, hizalama, karakteristik ve balon yerleşimi sözleşmelerini ayrı atomik şema işlerine böl. Kalıcı karakteristik kimliği ile görünen balon numarası ayrılır; önizleme geometrisi ile fiziksel ölçüm ayrı kalır. Bunlar henüz uygulanmış payload alanları değildir.

**Faz kapısı:** İlgili TS/Python/Rust tipleri sözleşmeden türer; üretim hatası kırmızı sonuç verir; bozuk/sürümü uyumsuz payload reddedilir; yeniden üretim beklenmeyen fark bırakmaz. Üretim kapsamı üç modülü aşıyorsa önce seçili şema/hedef desteği planlanır; sınır sessizce aşılmaz. Bütün tüketiciler geçmeden yeni sözleşme etkinleştirilmez.

### R2 — Başlatma, paket ve IPC

**Durum:** Açık hata. **Bağımlılık:** R1.

- R2.1: Dev/production girişlerini ayır; Electron dev modunda hazır Vite sunucusunu, production modunda güncel paketi kullansın. Eksik build anlaşılır hata versin; başlangıç komutu test edilsin.
- R2.2: Three.js, loader, font ve PDF worker varlıklarını yerel paketle; gerekli varlık eksikliği kabul testini düşürsün. R0'da kaldırılan sahte bridge geri getirilmesin.
- R2.3: Blueprint §12'ye uygun preload/contextBridge ve tek IPC istemcisine geç. Girişleri main tarafında doğrula, kanalları bir kez kaydet, dosya erişimini izinli yollarla sınırla.
- R2.4: Python yorumlayıcısı/bağımlılıklarını tekrarlanabilir tanımla. Süreç hatası, timeout ve bozuk JSON sessiz null olmamalı. Üretimde gömülü yorumlayıcı mutlak yoluyla çağrılsın.

**Faz kapısı:** Gerçek Electron'da eksik dosya/modül isteği yok; dış ağ kapalıyken desteklenen akış açılıyor; IPC nesnesi ayrılığı yok; dosya seçimi tek işlem; eksik Python görünür hata. nodeIntegration: false, contextIsolation: true, sandbox: true davranış testleriyle doğrulanır.

### R3 — Gerçek CAD/PDF verisinin tek projede buluşması

**Durum:** Açık hata. **Bağımlılık:** R2.

- R3.1: Gerçek CAD unsur ID, analitik tip, geometri, merkez/normal, bbox, birim ve kaynak kimliğini şemadan üret. Sabit yüzey/delik sayısı veya kutu önizlemesi B-Rep yerine geçmez. Desteklenmeyen varlık raporlanır.
- R3.2: CAD yükleme, mesh görünümü ve eşleştirici aynı kaydı kullansın; bütün içe aktarma girişleri aynı komutu çağırsın. Yeni model eski eşleşme/onay/rotayı geçersiz kılsın.
- R3.3: Python çıkarımı ve PDF önizlemesini aynı belge kimliğine bağla. Vektör, raster/OCR ve desteklenmeyen içerik ayrı raporlansın; önizleme ölçü çıkarımı kabulü olmasın.
- R3.4: CAD→Three.js ve PDF→Canvas dönüşümlerini adaptörlerle doğrula. Gerçek sayfa boyutu/dönüklüğü, ölçek ve birimler korunmalı; sabit sayfa yüksekliği kaldırılmalı.
- R3.5: Antet/genel not/diş tablosu/datum işaretleri/ölçü çağrıları tüm sayfalardan kaynak konumlarıyla ayrı çıkarılsın. Metin katmanı olmayan sayfa OCR yoluna gitsin; OCR başarısızlığı başarılı boş çıkarım gibi gösterilmesin. OCR piksel bbox'ı, render dönüşümünün tersiyle kanonik PDF koordinatına çevrilsin.
- R3.6: Teknik resim ile CAD'nin aynı parça/revizyona ait olduğu kullanıcıya görünür olsun; dosya adı tek kanıt sayılmasın. Eşleşme doğrulanmadan eski model üzerinde yeni çizime ait onay/rota üretilmesin.

**Faz kapısı:** İnsan tarafından kontrol edilmiş STEP/PDF çiftinde gerçek metadata dolu, her çıkarımın menşei mevcut; farklı yükleme sırası aynı sonucu verir; ardışık model/çizim değişimi eski veri taşımaz. Referans çerçevesi dönüşümleri sayısal testle doğrulanır.

### R4 — Araç çubuğu ve ortak arayüz durumu

**Durum:** Açık hata. **Bağımlılık:** R3.

- R4.1: Kanvas/panel görünürlüğünü tek modül yönetsin; inline gizleme ile sınıf değişimi yarışmasın.
- R4.2: Unsur listesi, seçim, balon, 3D vurgu ve sihirbaz aynı durumu kullansın. CAD koordinatı yerine örnek ID tablosu kullanılmasın.
- R4.3: Manuel unsur gerçek geometri seçimi veya doğrulanmış operatör girdisi gerektirsin. Geri al/yinele/sil/sıfırla gerçek durum değişimi ve onay geçersizleştirmesi yapsın.
- R4.4: Her ribbon/menü komutunun önkoşulu, sonucu ve hatası tanımlansın. Uygulanmamış araç başarı mesajı yerine gerekçeli kullanılamaz durum göstersin. Bir tıklama tek işlem üretmeli.
- R4.5: Balon editörünü aşağıdaki B1–B6 kabul ölçütleriyle kur: sağ tık ekle, kaynak bölgesi seç, lider/etiket taşı, alan düzenle, yeniden numaralandır, sil/geri al ve kaydet/yeniden aç. Her alt davranış üç dosyayı aşmayan ayrı işe bölünür.
- R4.6: Operatör adımları çizim inceleme → datum/referans → bağlama → hizalama → kapsam kontrolü → programlama olarak görünür olsun. Bağlama ve hizalama adayları erişim sonucuna göre geri dönülerek değiştirilebilsin; tek adımda koşulsuz “Onayla ve Aktar” kullanılmasın.

**Faz kapısı:** Çift Kanvas iki yönde çalışır; yeni unsur görünür listede ve doğru modelde seçilir; undo/redo veriyi geri getirir; model değişimi eski seçimi siler. Prob/hizalama/fikstür/ayar/simülasyon ayrı test edilir; modal açılması işlev kabulü değildir.

### R5 — Tolerans ve eşleştirme doğruluğu

**Durum:** Kısmi. **Bağımlılık:** R3, R4.

- R5.1: Tolerans çözümünü doğrulanmış kaynak ve sınır testleriyle koru; bilinmeyen fit/genel tolerans tahmin edilmez. Eşikler adlandırılmış yapılandırmaya taşınır.
- R5.2: Küresel bire bir atama, adet açılımı, eşit/yakın aday belirsizliği ve yapısal gerekçe ekle. Kullanılmış ID kümesi tek başına bu algoritmanın tamamı değildir.
- R5.3: GD&T/datum ve kesit ilişkisini kanıtla kur. Sayfa numarasından OP10/OP20 veya bbox yakınlığından kesin delik eşleşmesi türetme.
- R5.4: Operatörün seçtiği kenar veya iki daire merkezinden kurgu çizgisiyle hizalama oluştur. LEVEL/ROTATE/ORIGIN rolleri, eksen işareti ve kalan serbestlikler gösterilsin; çakışık merkez/yetersiz izdüşüm/çelişen yön reddedilsin. Referans geometrileri ve hizalama bağımlılık grafiği ayrı modül/test işlerine bölünür.

**Faz kapısı:** İki eş çaplı delik farklı unsura atanır; 4x çağrıya üç delik belirsizlik üretir; eşit aday/hiç aday ayrılır; desteklenmeyen GD&T açık kalır; aynı girdi aynı sonucu verir. Belirsizlik operatöre gider, otomatik PASS/onay üretmez.

### R6 — Onay, rota, emitter ve ölçüm sonucu

**Durum:** Kısmi; uçtan uca bağlantı açık. **Bağımlılık:** R5.

- R6.1: Onay yalnız doğrulanmış geçişten oluşsun. Eksik nominal/tolerans politikası açık olsun. Deserialize ve eski API üzerinden onay atlama engellensin; veri değişimi önceki onayı geçersiz kılsın.
- R6.2: Plan öğesi, kaynak, tolerans, eşleşme, operatör ve kararı kapsayan kanonik SHA-256 audit zinciri kur. Özel 64 bit özet kriptografik kabul değildir; SHA-256 tek başına dijital imza/standart uygunluğu da değildir.
- R6.3: Onaylı planı gerçek prob/tezgah/bağlama/fikstür verisiyle rota motoruna bağla. Simülasyon ve emitter aynı rotayı kullansın; çarpışma/erişim sorunu dışa aktarmayı durdursun.
- R6.4: İlk hedef lehçe/sürümü belirle; gerçek hareket ve ölçüm komutlarını emitter'dan üret. UI codeSnippets indirme yolunu kaldır; yalnız açıklama satırı program kabulü değildir. Diğer lehçeler ayrı kabul alır.
- R6.5: Fiziksel CMM sonuçlarını ayrı ölçüm sözleşmesiyle içe al; kaynak/plan/kalibrasyon bağını doğrula. Çıkarım, CAD kontrolü ve animasyon fiziksel sonuç yerine geçmesin.
- R6.6: Tek bağlama kararı için her karakteristiği prob erişimi, fikstür engeli ve ölçüm yöntemiyle değerlendir. OP20 gerekiyorsa hangi öğeler için ve hangi yeniden hizalama/transfer referansıyla gerektiğini göster. Eksik prob/fikstür verisi “bilinmiyor”dur; görünüş veya sayfa sayısından bağlama adedi çıkarılmaz.

**Faz kapısı:** Onaysız veya değişmiş plan tüm export girişlerinde reddedilir; tolerans/koordinat/karar değişimi audit doğrulamasını bozar; simülasyon/emitter aynı rotayı kullanır. Üretici ortamında doğrulanmadan çıktı tezgah kabulü almaz.

### R7 — Ürün kabulü ve performans

**Durum:** Planlandı. **Bağımlılık:** R0–R6.

Gerçek Electron/main/IPC/paket ile kurulum → içe aktarma → eşleştirme → düzeltme/onay → simülasyon → çıktı senaryosu çalıştırılır. İnsan tarafından doğrulanmış STEP/PDF çifti; boş/bozuk PDF, raster/OCR eksikliği, desteklenmeyen CAD, eşit aday, iptal ve eski veri senaryolarıyla korunur. Beklenen veri uygulama sonucuna göre değiştirilmez.

Açılış/yükleme/çıkarım süresi, uzun UI görevleri ve art arda model değişiminde kaynak kullanımı ölçülür. Donanım, girdi boyutu ve tekrar sayısı yazılmadan performans hedefi gerçekleşmiş sayılmaz. SceneCleaner, worker, dinleyiciler ve WebGL bağlamının gerçek yaşam döngüsü doğrulanır; dispose mock testinden sıfır sızıntı sonucu çıkarılmaz.

**Faz kapısı:** İlgili modül testleri, gerçek Rust testleri, build, görsel regresyon ve Electron akışı geçer; P0/P1 açık hata kalmaz; desteklenen kapsam ve sınırlamalar yazılır. Bu kapı fiziksel CMM güvenlik sertifikası değildir.

### R8 — Kontrollü saha kabulü ve sonraki kapsam

**Durum:** Planlandı. **Bağımlılık:** R7 ve belgelenmiş tezgah/prob/üretici ortamı.

Üretici yazılımında çıktı kontrolü, yetkili operatörle kontrollü kuru çalışma, ölçümün referansla karşılaştırılması ve saha kabul kaydı ayrı yürütülür. Temel tek/çoklu bağlama ihtiyacı ve referans aktarımı R6 kapsamındadır; gelişmiş otomatik fikstür optimizasyonu, lisans/dongle, ileri AI, semantik PMI, serbest yüzey, diğer lehçeler ve CNC kapalı döngüsü ayrı doğruluk/kabul planı gerektirir. Eski fazda yer alması tamamlanma kanıtı değildir.

## 6. Operatörün hedef çalışma akışı

Bu bölüm 4 Ekim'de kullanıcının tarif ettiği çalışma biçimini ürün kabul koşuluna çevirir. Uygulama geliştirme sırası R0–R8'dir; operatöre gösterilen sıra aşağıdadır. Bu akış henüz uygulanmış değildir.

| Adım | Operatörün sorusu / eylemi | Ekranın vermesi gereken sonuç | İlgili işler |
|---|---|---|---|
| O1 — Kaynak ve resim inceleme | Doğru CAD/resim/revizyon mu? Genel standart/notlar ne? | CAD ve PDF kimliği; gerçek sayfa küçük resimleri; antet, genel tolerans, diş, kaplama ve özel notlar kaynaklarıyla | R1.5, R3.3–R3.6 |
| O2 — Datum ve referans | A/B/C neresi? Hangi yüzeye/eksene bağlı? | Resimde gerçekten tanımlı datumun 2D kaynağı ve 3D karşılığı; bulunmayan datum açıkça eksik | R3.5, R5.3 |
| O3 — Bağlama ve erişim | Nasıl bağlarım; tek bağlama yeter mi? | Operatörün seçtiği dayama/sıkma bölgeleri, prob/tezgah bilgisi ve karakteristik başına erişim değerlendirmesi | R4.6, R6.3, R6.6 |
| O4 — Hizalama kurulumu | Eksenleri/orijini hangi geometrilere oturturum? | Düzlem, daire/silindir, kenar veya kurgu çizgisi seçimi; yön ve sıfır önizlemesi; kalan serbestlikler | R4.3, R5.4 |
| O5 — Karakteristik ve balon kontrolü | Bütün ölçüler/notlar alındı mı; balon doğru yerde mi? | Kaynakla yan yana düzenlenebilir liste, balon editörü, çözülemeyen bölgeler ve kapsam farkları | R3.5, R4.5, R5 |
| O6 — Ölçüm planı | Neyi hangi bağlamada ve yöntemle kontrol edeceğim? | CMM, mastar veya diğer kontrol yöntemi; hizalama/unsur bağımlılıkları; erişilemeyenler ve eksikler | R5, R6 |
| O7 — Programlama | Hangi öğeler programlanmaya hazır? | Onaylı planla aynı hizalama ve rotayı kullanan program önizlemesi; eksik varsa gerekçeli engel | R6, R7 |

Genel notlar ilk incelemede görünür; sonraki seçimlerde uygulanabilirliği yeniden kontrol edilir. Bağlama ve hizalama bir defalık karar değildir: prob erişimi başarısızsa O3/O4'e dönülür. CAD önizlemesinde hizalama kurmak, fiziksel parçanın tezgah koordinat sistemini ölçerek kurmakla aynı işlem değildir; programda başlangıç hizalaması için gerekli gerçek ölçüm sırası ayrıca bulunur.

### Datum, kurgu geometri ve eksen seçimi

- Çizimin datum referans sistemi, operatörün programlama koordinat sistemi ve fikstür temas yüzeyleri ayrı tutulur. Operatörün seçtiği bir düzlem kendiliğinden çizimin “A datumu” olmaz; resim datum vermiyorsa “operatör referansı” olarak kayıt edilir.
- Datum etiketi gerçek geometrik işaret/bağlantıdan okunur. Pafta çerçevesindeki A/B/C harfleri ve kutulu not numaraları datum değildir. Her tolerans çerçevesinin kendi datum sırası ve varsa değiştiricileri korunur.
- X yönü için tek reçete yoktur. Operatör uygun bir gerçek kenarı/ölçülmüş çizgiyi ya da seçtiği iki dairenin merkezlerinden oluşturulmuş çizgiyi kullanabilir. Geometri isimleri, seçim sırası, çalışma düzlemi/izdüşüm ve +X/-X yönü görünürdür.
- İki eşmerkezli daire, seçili düzlemde sıfır uzunluklu izdüşüm veya LEVEL eksenine paralel çizgi, o eksen etrafındaki dönmeyi belirleyemiyorsa sistem bunu açıklar. Aynı silindirin iki kesitinden elde edilen eksen otomatik olarak ikinci bağımsız yön sayılmaz.
- LEVEL, ROTATE ve X/Y/Z ORIGIN seçimleri ayrı gösterilir. Seçim değişince triad/orijin ve bağımlı ölçüler önizlemede güncellenir. Çizimin izin verdiği serbestlikler keyfi datumla kapatılmaz; program hareketi için yetersiz hizalama engellenir.
- Daire → merkez → kurgu çizgisi → hizalama → ölçüm/rota bağımlılığı korunur. Kaynak geometri değişirse kurgu güncellenir ve etkilenmiş onaylar yeniden istenir; döngüsel bağımlılık oluşturulamaz.

Yöntem dayanağı: [Hexagon Plane/Circle/Circle ve diğer hizalamalar](https://docs.hexagonmi.com/pcdmis/2020.2/en/helpcenter/mergedprojects/core/10_view_topics/Quick_Start_Align_Toolbar.htm), [LEVEL/ROTATE/ORIGIN sırası](https://docs.hexagonmi.com/pcdmis/2019.2/en/helpcenter/mergedProjects/core/18_alignment_topics/Alignment_Overview.htm), [datum değerlendirme süreci](https://docs.hexagonmi.com/pcdmis/2020.2/en/helpcenter/mergedProjects/core/geometric_tolerances/How_PC-DMIS_Solves_Datums.htm). Bunlar hizalama yaklaşımının kaynaklarıdır; hedef PC-DMIS sürümündeki çıktı ayrıca doğrulanır.

### Tek bağlama kararının kabul koşulu

Her karakteristik için “bu bağlamada erişilebilir”, “fikstür/tezgah/prob nedeniyle engelli”, “başka kontrol yöntemi”, “henüz değerlendirilemedi” sonucu ve gerekçesi bulunmalıdır. Sadece bilye temas noktası değil şaft/kafa, kalibre edilmiş açılar, yaklaşma/geri çekilme ve gerekli örnekleme bölgesi değerlendirilir. Fikstürün örttüğü yüzeyi ölçülmüş saymak veya görünen yüzeyden bütün karakteristik için erişim sonucu çıkarmak yasaktır.

Tek bağlama sonucu ancak kapsamı tanımlı CMM karakteristiklerinin tamamı o bağlamada doğrulanınca verilir. “Tüm kontrol planı tamam” için CMM dışındaki kontroller de ayrı kapatılmalıdır. OP20 önerisi; taşınacak karakteristikler, neden, tekrar bulunacak referanslar ve bağlamalar arası dönüşümü içerir. Fikstür/prob verisi yoksa sonuç bilinmiyor kalır. Kullanıcı ekranındaki makine/prob etiketi gerçek yapılandırma doğrulaması yerine geçmez.

### Balon editörü — zorunlu kabul ölçütleri

| Kimlik | Kullanıcı davranışı | Beklenen sonuç |
|---|---|---|
| B1 | Ölçüye/listedeki öğeye/balona tıkla | Doğru sayfa ve kaynak bölgesi seçilir; eşleşmişse doğru CAD unsuru vurgulanır |
| B2 | Balonu veya lider ucunu sürükle | Etiket ve lider geometrisi ayrı düzenlenir; ölçünün kaynak bbox'ı ve nominali değişmez |
| B3 | PDF üzerinde sağ tık → Yeni balon | Sayfa koordinatı alınır; kaynak bölgesi seçilir; otomatik okuma veya manuel karakteristik girişi açılır; eksik alan uydurulmaz |
| B4 | Düzenle / numaralandır / sil / geri al | Kimlik kalıcıdır; görünür numara değişebilir; mükerrer numara engellenir; silinen öğe iz bırakır ve geri alınabilir |
| B5 | Zoom/pan/sayfa dönüşü/değişimi | Ölçü ankrajı yerinde kalır; etiket kaynak yazıyı örtmeyecek şekilde taşınabilir; başka sayfaya sürüklenmez |
| B6 | Kaydet, kapat, aynı projeyi yeniden aç | Kaynak/revizyon, manuel değişiklikler, bağlantılar ve sayfa bazlı yerleşim korunur |

Sağ tık pan hareketini başlatmaz; menü hedeflediği sayfa/balona uygulanır. Yeni balon OCR'de bulunamayan bir ölçüyü ekleyebilir; kullanıcı nominal/tolerans/yöntemi doğrulamadan onaylı ölçüye dönüşmez. Resimdeki kutulu 4/5 gibi mevcut not çağrıları otomatik balon numarası olarak ele geçirilmez.

Yalnız etiket konumu/numarası değişikliği ölçüm semantiğini değiştirmez; ölçüm onayını gereksiz yere silmez. Nominal, tolerans, kaynak bölgesi, datum, CAD bağlantısı, yöntem veya kurgu geometrisi değişikliği etkilenen onay/plan/rotayı geçersizleştirir. Orijinal çıkarım ve operatör düzeltmesi ayrı audit kaydıdır; kaynağın üstüne sessizce yazılmaz.

### Ölçü kapsamı ve genel standartlar

“Tamamı alındı” sayacı OCR'nin bulduğu satır sayısına dayanamaz. İnsan tarafından sayfa sayfa kontrol edilmiş karakteristik/not envanteriyle karşılaştırılır. Okunamayan bölge, eksik tolerans, çözülemeyen tablo ve eşleşmeyen unsur görünür listelenir. Sıfır öğe veya açık eksiklerle tam kapsam onayı verilemez.

Tekrarlı görünüşler, adetli delikler, çap/yarıçap, açılar, pah, diş/tablo limitleri, GD&T, yüzey şartı ve kontrol gerektiren notlar ayrı ele alınır. Referans ölçü ve not aynı otomatik tolerans kuralına sokulmaz. Açık özel tolerans, uygulanabilir genel toleranstan önce değerlendirilir; standardın kapsamı dışındaki karakteristiğe genel tablo uygulanmaz. Belirsiz/eksik standart baskısı veya çelişen not operatör incelemesine gider; global UI başlığı resmin standardı yerine geçmez.

## 7. İlk kabul örneği: KPT-3150 Kör Tapa

**Kaynaklar:** test_assets/KPT - 3150 Kör Tapa/KOR TAPA_TR_AA.pdf ve aynı dizindeki KOR TAPA_AA.stp. Bunlar yerel kabul adayıdır; aynı dizinde bulunmaları geometrik/revizyon eşleşmesi kanıtı değildir. Git dışında kalan verinin paylaşımı/CI temini ayrıca düzenlenir.

- PDF SHA-256: f6a2fdcca144b98b10aa3302f97dd35d62e3dd1dafdf37847e702e039c66d32d.
- CAD SHA-256: dd2b959e15332e217e6962c02da01a8c629fe75ff77194b430ecbc931974dd22.
- İki sayfa görsel olarak incelendi. pypdf her iki sayfadan 0 metin karakteri çıkardı; yalnız metin katmanını okuyan ayrıştırıcı bu belgeyi karşılayamaz. OCR ve sayfa kaynaklı kutular gereklidir.
- Açık A/B/C datum etiketi görsel incelemede saptanmadı. Kenar harfleri pafta bölgesidir; kutulu 4 markalama, 5 maskeleme notuna işaret eder. Bu gözlem otomatik çıkarıcının doğru çalıştığı kanıtı değildir; operatör kontrolü gerekir.
- Antette ASME Y14.5 ve genel tolerans ISO 2768-m okunuyor. Not 3 ölçülerin kaplama sonrası olduğunu söylüyor. İlk sayfadaki diş tablosu, ikinci sayfanın diş çağrısıyla birlikte incelenmelidir; parantezli ölçüler bağımsız toleranslı imalat ölçüsü gibi onaylanmamalıdır.
- Kullanıcı ekranında Kör Tapa PDF'iyle birlikte altta Göbek Bağı Oluğu adı görünüyor. Bunun eski konsol bilgisi mi yanlış aktif CAD mi olduğu yeni canlı akışta kontrol edilmelidir; görüntüden kesin eşleşme hatası ilan edilmez.
- Kod incelemesinde Python OCR kutuları 150 dpi görüntü piksellerinden alınıp doğrudan bbox'a yazılıyor. PDF noktası dönüşümü görünmüyor; görüntü/pafta dönüşümüyle birlikte giderilmesi gereken R3.5 bulgusudur. Başlangıçta yalnız ölçek varsa 72/150 dönüşümü gerekir; crop/dönüklük varsa tam ters dönüşüm kullanılır.

Bu örnek için henüz onaylı datum, fikstür, tek bağlama kararı, tam karakteristik adedi veya makine programı oluşturulmadı. Kabul testi: iki sayfa/genel notlar → operatör referansları → kenar veya iki daireyle uygun yön seçimi → bağlama başına erişim → eksik ölçüyü sağ tıkla ekleme → balon taşı/düzelt/kaydet → eşleştirme/onay → program. Aynı dosyayı farklı adla, ardından başka parçayla açma testleri özel dosya dallanmasını ve eski veri sızıntısını yakalamalıdır.

## 8. Önceki planların karşılığı

| Önceki başlık | Güncel karşılık | Korunan kapsam |
|---|---|---|
| Blueprint F0 / çıkarım ara fazları | R0, R1, R3 | Uydurmasız çıkarım, provenance, modüler ayrıştırma |
| Blueprint F1 / altyapı FAZ 1 | R1 | Şema ayrımı, sürümleme, TS/Python/Rust codegen |
| Blueprint F2–F5 | R3, R5 | PMI Unsupported, tolerans, B-Rep/çizim eşleştirme |
| Blueprint F6 / onay ara fazı | R6 | Onay tipleri ve tüm emitter girişleri |
| Blueprint F7 / masaüstü fazları | R2, R4 | Güvenli Electron ve gerçek araç akışları |
| Blueprint F8 / altyapı FAZ 2–5 | R7 ve geliştirme kuralları | Regresyon, hook, worker, kaynak yaşam döngüsü |
| Eski FAZ 1–3, 9, 11–14 | R3–R7 | Temel ürün dilimi; ileri parçalar R8 sonrası |
| Eski FAZ 4–8 ve 10 | R6–R8 | Sonuç/audit/çıktı/saha; sertifikasyon kanıt bekliyor |

## 9. İş kapatma kaydı

Her alt iş şu bilgilerle kapanır: iş kimliği; değişen dosyalar; başlangıç hatası; yeni davranış; girdi/hash ve şema sürümü; test komutları/çıkış kodları; gerçek akış kanıtı; kalan sınırlamalar. Commit varsa kimliği, yoksa çalışma ağacı bilgisi yazılır.

Gerçekleşmemiş işler yeşile çevrilmez. Yeni bulgu kabulü geçersiz kılıyorsa ilgili iş yeniden açılır. Şu anda ilk uygulanacak görev R0.1'dir.
