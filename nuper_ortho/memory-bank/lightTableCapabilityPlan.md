# Nuper Ortho — Işık Masası Yetkinlik ve Kabul Planı

Belge tarihi: 11 Ekim 2026.

Bu belge geliştirilmesi hedeflenen davranışları tanımlar; çalışan veya kabul edilmiş özellik listesi değildir. İş sırası, uygulama durumu ve teslim kanıtının tek kaynağı [progress.md](progress.md) dosyasıdır. Buradaki IM kimlikleri kalıcı gereksinim kimlikleridir, yeni faz sırası değildir.

Bağlayıcı kaynaklar: [AGENTS.md](../AGENTS.md), [mimari yasalar](architectureBlueprint.md), [geliştirme kuralları](developmentInfrastructureRules.md). Alan girdisi: [GD&T ve teknik resim kuralları](gdtStandardsAndDrawingRules.md). Çelişen alan kuralları doğrulanmadan algoritmaya dönüştürülmez.

## 1. Amaç ve ürün sınırı

Işık masası; teknik resimdeki gereksinimleri kaynaklarıyla tanımlayan, operatörün düzenlemesini sağlayan, CAD unsurlarına bağlayan ve kontrol planına aktarım için inceleyen çalışma alanıdır.

Temel çıktı, kaynağı izlenebilir karakteristik envanteri ve bu envantere bağlı onay kayıtlarıdır. Bir karakteristik birden fazla CAD unsuruna uygulanabilir; aynı CAD unsuru boyut, konum ve yüzey şartı gibi birden fazla karakteristik taşıyabilir. Balon, karakteristiğin görünür etiketidir; karakteristiğin kalıcı kimliği değildir.

Işık masası fiziksel ölçüm sonucu üretmez. CAD nominali, OCR okuması, operatör onayı, erişim değerlendirmesi ve fiziksel ölçüm sonucu ayrı kavramlardır. Çıkarılan veya onaylanan kayıt PASS/FAIL olarak gösterilmez.

Başarı ölçütü: operatör her gereksinim için “nereden geldi, ne anlama geliyor, neye uygulanıyor, nasıl kontrol edilecek, hangi bilgi eksik?” sorularını ekrandan cevaplayabilmelidir.

## 2. Yetkinlik seviyeleri

Her yetkinlik için aşağıdaki seviyeler ayrı değerlendirilir. Sembolü göstermek, o sembolü yorumlama veya programlama desteği anlamına gelmez.

| Seviye | Destek anlamı | Gerekli kanıt |
|---|---|---|
| Tanıma | Kaynak bölgesini ve ham ifadeyi bulma | İnsan doğrulamalı kaynak bölgeleriyle karşılaştırma |
| Yapılandırma | İfadeyi ayrı alanlara ayırma, manuel düzeltme | Alan bazlı beklenen değer ve kaydet/aç testi |
| Yorumlama | Standart ve kapsam üzerinden deterministik anlam çözme | Standart maddesi, baskı, sınır ve çelişki testleri |
| Planlama | CAD ve kontrol yöntemiyle bağ kurma | Geometrik eşleşme ve yöntem uygunluğu kanıtı |
| Aktarım | Onaylı gereksinimi desteklenen çıktı hattına verme | Onay koruması ve hedef yazılım doğrulaması |

Desteklenmeyen üst seviye için alt seviyedeki veri korunur. Örneğin birleşik FCF kaynakta gösterilip kaydedilebilirken yorumlama desteklenmiyorsa program aktarımı gerekçesiyle engellenir.

## 3. Ekran düzeni ve çalışma akışı

### 3.1. Ekran bölgeleri

| Bölge | İçerik ve davranış |
|---|---|
| Üst kaynak şeridi | PDF/CAD kimliği, revizyon, etkin sayfa, standart profili ve kaydedilmemiş değişiklik |
| Sol envanter | Sayfa/karakteristik/not listesi; tür, eksik bilgi, çelişki, eşleşme ve onay filtreleri |
| Orta pafta | Gerçek PDF/görsel, kaynak bölgeleri, balonlar, liderler, görünüş/kesit sınırları |
| Sağ özellik kartı | Ham kaynak, yorumlanmış alanlar, kural dayanağı, CAD bağlantıları, yöntem, inceleme geçmişi |
| İsteğe bağlı CAD paneli | Bağlı yüzey/eksenlerin vurgusu, adaylar, görünüş dönüşümü ve seçimin gerekçesi |
| Alt inceleme kuyruğu | Okunamayan bölgeler, belirsiz eşleşmeler, eksik standartlar ve aktarımı engelleyen nedenler |

Kartta temel alanlar önce, ileri GD&T seçenekleri ilgili tür seçildiğinde açılır. Bir alanın yanında kaynağa git eylemi bulunur. Renk tek başına durum taşımaz; metin ve simge eşlik eder. Klavye odağı görünür; seçim ve düzenleme klavyeyle de yapılır.

### 3.2. Operatör akışı

1. Kaynakları yükle; dosya/revizyon/birim kimliğini incele.
2. Antet, genel notlar ve standart profilini kaynaklarıyla doğrula.
3. Otomatik çıkarım adaylarını gözden geçir; eksik bölgeyi seçerek manuel kayıt ekle.
4. Boyut, GD&T, datum, tablo ve not bağlantılarını kur.
5. Gereken karakteristikleri gerçek CAD unsurlarına bağla; belirsizliği çöz.
6. Kontrol yöntemini ve ilgili bağlama/hizalama bağımlılıklarını incele.
7. Sayfa bazlı kapsam kontrolü yap; uygun kayıtları onayla.
8. Yalnız desteklenen ve onaylı kapsamı plan katmanına aktar.

Adımlar arasında geri dönüş mümkündür. Kaynak veya semantik değişiklik bağımlı onayları yeniden incelemeye açar. CMM dışı bir kontrol için CAD eşleştirmesi gerekmiyorsa bunun gerekçesi tutulur; gereksiz zorunlu alan oluşturulmaz.

## 4. Detaylı yetkinlik gereksinimleri

### IM-01 — Kaynak, antet ve standart profili

- PDF/CAD dosya hash'i, sayfa, parça numarası, revizyon ve birim ayrı tutulur. Aynı dosya adı eşleşme kanıtı değildir.
- Standart ailesi, baskı yılı, paftadaki ham atıf ve uygulanacağı alan kaydedilir. ASME geometrik tolerans ve ISO genel boyut toleransı gibi birlikte kullanılan atıflar tek global seçimle kaybedilmez.
- Genel lineer/açısal tolerans, özel delik derinliği şartı, projeksiyon sembolü ve kaplama/işlem durumu ayrı kaynak bölgelerine bağlanır.
- Eksik baskı veya çelişen not için operatör incelemesi açılır; şirket adı standart veya projeksiyon varsayımı üretmez.
- Kabul: anteti okunamayan paftada tolerans ve datum uydurulmaz; farklı revizyona geçişte eski profil taşınmaz.

### IM-02 — Boyut karakteristikleri ve tolerans çözümleme

- Uzunluk, çap, yarıçap, açı, pah, derinlik, adet, limit, simetrik/asimetrik tolerans ve geçme çağrıları ayrı alanlara ayrılır.
- Doğrudan, temel, referans, tablo kaynaklı ve model kaynaklı değerler ayrılır. Ham metin korunur; operatör düzeltmesi ayrı kayıttır.
- Boyut toleransı ve geometrik kontroller aynı karakteristik/unsur üzerinde birlikte temsil edilir. Bir FCF bulunması doğrudan boyut toleransını silmez.
- Genel tolerans yalnız kapsamı uygun ve açık özel toleransı bulunmayan ölçüye uygulanır; kullanılan tablo satırı ve kural sürümü görünür.
- Temel ölçüye otomatik ± tolerans atanmaz. İlgili geometrik kontrol çözülemiyorsa bağlantı eksik olarak gösterilir.
- Referans ölçü bağımsız kabul ölçütüne otomatik çevrilmez. Model nominalinden tolerans türetilmez.
- Kabul: aynı deliğin çap toleransı ve konum kontrolü kaydet/aç sonrasında ayrı korunur; sıfır tolerans boş değer sanılmaz; birim dönüşümünde anlam değişmez.

### IM-03 — GD&T çerçeve editörü

- Ham FCF görüntüsü ile yapılandırılmış sembol, tolerans değeri, bölge biçimi, değiştiriciler ve sıralı datum referansları yan yana gösterilir.
- Form, yönelim, konum, profil ve salgı kontrolleri için destek matrisi tutulur. Her sembolün yorumlama desteği ilgili standart/baskı bazında belirtilir.
- MMC/LMC gibi unsur koşulları ile datum referansındaki sınır değiştiricileri aynı alan veya aynı hesap gibi ele alınmaz.
- Birleşik/çok segmentli çerçeveler, ortak bölge ve ileri değiştiriciler kayıpsız saklanır; desteklenmeyen yorum açıkça işaretlenir.
- Operatöre sınırsız serbest metin yerine bağlama uygun alanlar sunulur; orijinal metin her zaman erişilebilirdir.
- Kabul: datum sırası değiştirildiğinde semantik değişiklik kaydedilir; eksik hücre tamamlanmış sayılmaz; desteklenmeyen sembol sessizce başka sembole dönüşmez.

### IM-04 — Datumlar, hedefler ve hizalama bağlantısı

- Datum etiketi, kaynak unsur ve varsa hedef nokta/çizgi/alanı birbirine bağlanır. Pafta koordinat harfleri datum olarak alınmaz.
- Her FCF kendi datum sırasını korur. Ortak veya ileri datum yapıları destek durumuyla gösterilir.
- Çizim datum sistemi, operatör programlama hizalaması ve fikstür temasları ayrı kayıtlardır.
- Serbestlik kısıtları geometri ve seçilen kurala göre değerlendirilir; bütün yapılara sabit 3–2–1 uygulanmaz.
- İki merkezden çizgi gibi kurgu geometriler kaynaklarına, çalışma düzlemine ve yön işaretine bağlanır. Döngüsel veya yetersiz bağımlılık reddedilir.
- Kabul: resimde datum yokken A/B/C oluşmaz; eşmerkezli dairelerden bağımsız yön üretilemediği açıklanır; kaynak geometri değişince bağımlı hizalama yeniden incelenir.

### IM-05 — Genel notlar, tablolar ve süreç şartları

- Not, tablo başlığı, satır, sütun, dipnot ve çağrı işareti kaynakları korunur. Çok sayfalı tablo/çağrı ilişkisi kurulabilir.
- Not kapsamı tüm parça, seçili unsur grubu veya belirli işlem olarak açıkça gösterilir. Kapsam çözülemiyorsa operatör seçimi gerekir.
- Diş/insert, yüzey şartı, kaplama, markalama ve sertifika gereksinimleri kontrol envanterine alınır; hepsi CMM ölçüsüne çevrilmez.
- Kaplama öncesi/sonrası şart kaydedilir; belgelenmiş proses verisi olmadan sayısal kaplama telafisi hesaplanmaz.
- Tablo harfleri otomatik datum etiketi sayılmaz. Satırdaki adet ile bağlanan unsur sayısı karşılaştırılır.
- Kabul: farklı sayfadaki çağrı doğru tablo satırına ulaşır; çelişen yerel/genel not görünür; not silinince bağlı kontroller etkilenir.

### IM-06 — Görünüş, kesit ve 2D–3D eşleştirme

- Ana görünüş, detay, kesit ve yardımcı görünüş bölgeleri tanımlanır; kaynak sayfa ve dönüşümleri korunur.
- Projeksiyon bilgisi ile STEP koordinat dönüşümü ayrı ele alınır. Kesit oku tek başına doğrudan bir model ekseni kabul edilmez.
- Çap, geometri türü, yön, konum, adet ve komşuluk gibi kanıtlarla eşleşme adayları açıklanır; eşik yapılandırması sürümlenir.
- Tek unsura, unsur grubuna ve aynı unsur üzerindeki farklı karakteristiklere bağlantı desteklenir. Yinelenen görünüşler otomatik yeni gereksinim sayılmaz.
- Operatör aday seçebilir veya eşleşmeyi kaldırabilir. Yakın puanlı adaylar sessizce ilk unsura atanmaz.
- Kabul: 4X çağrı dört uygun unsurla ilişkilendirilir veya eksik adet açıklanır; mesh önizlemesi analitik B-Rep doğrulaması sayılmaz.

### IM-07 — Balon ve kapsam editörü

- Balon etiketi, lider ucu, kaynak bbox'ı ve karakteristik kimliği ayrı tutulur.
- Sağ tıkla ekleme, kaynak bölgesi seçme, düzenleme, numaralandırma, silme ve geri alma desteklenir. Sağ tık sürükleme ile menü açma ayrılır.
- Zoom, pan, DPI, sayfa döndürme ve crop dönüşümleri kalıcı PDF koordinatlarından türetilir. Ekran pikseli kalıcı kaynak konumu olmaz.
- Tek karakteristiğin farklı görünüşlerdeki kaynak bağlantıları korunur. Delik grubu üyeleri ve görünür balon politikası açıkça gösterilir.
- Kaydet/aç sonrasında sayfa bazlı konumlar ve manuel düzeltmeler korunur. Mükerrer balon numarası engellenir; kalıcı kimlik numaradan bağımsızdır.
- Kabul: progress.md B1–B6 koşulları gerçek Electron akışında geçer; etiket taşıma nominali veya kaynak bbox'ını değiştirmez.

### IM-08 — Kontrol yöntemi ve plan bağlantısı

- CMM, diş mastarı, pürüzlülük ölçümü, görsel kontrol, sertifika kontrolü ve operatörce tanımlı diğer yöntemler gerekçesiyle atanır.
- Işık masası yöntem önerisini ve gereksinimi gösterir; rota ve ölçüm stratejisi deterministik plan katmanında oluşturulur.
- Diş veya insert çağrısına evrensel prob reçetesi atanmaz. Mastar/yardımcı aparat kullanımı ilgili kontrol prosedürü ve donanımla doğrulanır.
- Bağlama, prob, fikstür ve hizalama eksikliği ayrı gösterilir. Bilinmeyen erişim erişilebilir sayılmaz.
- CMM dışı kontroller genel kapsam hesabında kalır; CMM programına dahil edilmemeleri gereksinimi ortadan kaldırmaz.
- Kabul: yöntem değişikliği etkilenen plan onayını kaldırır; eksik donanımla tek bağlama başarısı üretilmez.

### IM-09 — İnceleme, onay ve değişiklik etkisi

- Çıkarım, kural çözümleme, CAD eşleştirme ve operatör onayı ayrı durum boyutlarıdır. Tek bir güven yüzdesi bunların yerine geçmez.
- Kavramsal inceleme durumları: aday, bilgi eksik, çelişkili, incelemeye hazır, onaylı, yeniden inceleme gerekli. Bunlar mevcut IPC enum'u değildir; şema çalışmasında kesinleşir.
- Bir kaydın onayı yalnız o kaydın tanımlı kapsamını kapsar. Toplu onayda etkilenecek kayıtlar ve engeller önceden listelenir.
- Gerekçeli kapsam dışı bırakma audit kaydı üretir; çözülemeyen kayıt gizlenerek tam kapsam elde edilemez.
- Onay kim, ne zaman, hangi kaynak/kural/karakteristik sürümü için verildi bilgilerini içerir. Sonraki düzenleme önceki onayı sessizce güncellemez.
- Kabul: onaysız veya desteklenmeyen kayıt emitter'a ulaşmaz; kaynak değişimi eski onayı geçersizleştirir; UI butonu dışında da aynı koruma uygulanır.

## 5. Şemalaştırılacak veri kavramları

Aşağıdaki tablo kavramsal tasarımdır; mevcut payload'a serbest key ekleme izni değildir. Mevcut drawing_data, cad_metadata ve inspection_plan şemalarının kapsamı incelenerek ayrı sözleşme işi açılır. Önce şema, sonra codegen ve runtime doğrulama, ardından üretici/tüketici geçişi yapılır.

| Kavram | Taşınması gereken bilgi |
|---|---|
| Kaynak belge | Dosya hash'i, belge/revizyon kimliği, sayfalar, birim ve kaynak türü |
| Kaynak bölgesi | Sayfa, PDF noktası cinsinden bbox, dönüşüm bilgisi, ham metin, yöntem/sürüm |
| Standart atfı | Aile, baskı, ham atıf, uygulanma kapsamı, doğrulanmış kural bağlantısı |
| Karakteristik | Kalıcı kimlik, tür, nominal, adet, boyut toleransı, geometrik kontrol bağlantıları |
| Datum/FCF | Kaynak tanımı, sıralı ilişkiler, değiştiriciler, hedefler ve destek seviyesi |
| Not/tablo ilişkisi | Kaynak satır/hücre, çağrı, uygulandığı karakteristikler ve süreç şartı |
| CAD ilişkisi | Model hash'i, unsur kimlikleri, aday kanıtları, seçimin yöntemi ve durumu |
| Balon yerleşimi | Karakteristik kimliği, görünür numara, sayfa, etiket ve lider geometrisi |
| Kontrol gereksinimi | Yöntem, gerekçe, bağlama/hizalama bağımlılığı, eksik donanım bilgisi |
| İnceleme/audit | Aktör, zaman, önceki/yeni değer, gerekçe, sürüm ve onay kapsamı |

Boş, sıfır, uygulanamaz, okunamadı ve desteklenmiyor ayrıştırılır. Fiziksel ölçüm alanları çıkarım kaydının zorunlu alanları olamaz. Sayısal değerler birim ve hassasiyetiyle korunur; gösterim yuvarlaması mühendislik değerini değiştirmez.

## 6. Standart kurallarının doğrulanma kapısı

GD&T belgesindeki örnekler tek başına normatif algoritma kaynağı değildir. Her yürütülebilir kural için standart/baskı, madde, uygulanabilirlik koşulu, istisna, doğrulayan uzman ve insan onaylı örnekler gerekir. Belgeye erişim yoksa ilgili yorumlama seviyesi bekler; kaynak gösterimi ve manuel kayıt devam edebilir.

| İncelenecek mevcut ifade | Planlanan netleştirme |
|---|---|
| Tek doğrusal tolerans hiyerarşisi | Boyut toleransı çözümlemesini geometrik kontrol ilişkisinden ayır; çelişki davranışını tanımla |
| MBD son basamak olarak nominal + genel profil | Nominalin kaynağı ve uygulanabilir toleransın kaynağını bağımsız doğrula |
| Datumlar her durumda 3–2–1 kısıtlar | Geometri, datum yapısı ve izin verilen serbestliklere bağlı kurallar tanımla |
| CF örneği, datumlu düzlemsellik ve ortak least-squares fit | Sembolün geçerliliği, birleşik unsur anlamı ve değerlendirme yöntemini ayrı doğrula |
| Her pedden en az üç nokta | Örnekleme planını biçim değerlendirmesinin yeterlilik kanıtından ayır |
| Kesit oku ile B-Rep normalinin doğrudan eşitliği | Görünüş/model dönüşümü ve kesit tanımını açık geometriyle doğrula |
| Helicoil için tek mastar/prob reçetesi | Çağrı, montaj durumu, kontrol prosedürü ve yardımcı aparat koşullarını tanımla |
| Kaplama için otomatik tolerans payı | Ölçüm aşaması ile sayısal proses telafisini ayır |
| Müşteri adına göre projeksiyon/standart | Yalnız gerçek pafta atfından veya kayıtlı operatör doğrulamasından türet |

Bu tablo mevcut kuralların sessizce değiştirildiği anlamına gelmez. Çelişkili kuralın uygulama işi, alan doğrulaması tamamlanmadan başlatılmaz.

## 7. Değişiklik ve kalıcılık politikası

| Değişiklik | Beklenen etki |
|---|---|
| Balon etiketi taşıma/numaralandırma | Yerleşim/audit güncellenir; ölçüm semantiği onayı korunur; etiketli rapor yeniden üretilir |
| Nominal, tolerans, datum, yöntem, kaynak bölgesi | İlgili karakteristik ve bağımlı plan/rota yeniden incelemeye açılır |
| Genel tolerans veya standart profili | Etkilenen kayıtlar önizlenir; yeniden çözümleme ve onay gerekir |
| CAD revizyonu veya unsur eşleşmesi | İlgili eşleşme, kurgu geometri, hizalama ve plan geçersizleşir |
| Yeni PDF revizyonu | Eski kayıtlar arşivlenir; taşınacak ilişkiler aday olarak sunulur, sessizce uygulanmaz |
| Kayıt silme/geri alma | Audit ve bağımlılıklar korunur; eski onay geçerliliği güncel semantiğe göre yeniden kontrol edilir |

Kaydetme atomik olmalı; yarım yazma önceki geçerli projeyi bozmamalıdır. Proje biçimi sürümlenir, uyumsuz sürüm açık hata verir. Harici dosya kaybolduğunda kaynak bağlantısı eksik gösterilir; başka dosya otomatik yerine geçirilmez.

## 8. Mimari sorumluluklar ve ana plana bağlantı

UI kaynak gösterimi, seçim ve düzenleme komutlarını yönetir. Çıkarım aday üretir; tolerans katmanı kuralları çözer; eşleştirme katmanı CAD bağını kurar; review katmanı onayı; plan katmanı yöntem/rota bağımlılıklarını yönetir. Ağır işler UI iş parçacığında çalışmaz. Mevcut SetupWizard yeni iş mantığıyla büyütülmez.

| Yetkinlik | progress.md karşılığı | Önkoşul |
|---|---|---|
| IM-01, IM-02 | R0, R1, R3, R5 | Varsayılan veri yollarının kaldırılması, güvenilir sözleşme ve kaynak koordinatları |
| IM-03, IM-04 | R1, R3, R5 | Yapılandırılmış GD&T/datum sözleşmesi, doğrulanmış alan kuralları |
| IM-05 | R1, R3, R5 | Not/tablo kaynakları ve kapsam ilişkileri |
| IM-06 | R3, R4, R5 | Gerçek CAD metadata, birim/koordinat dönüşümleri |
| IM-07 | R4, R5 | Tek durum sahibi, kalıcı kimlik ve sayfa dönüşümleri |
| IM-08, IM-09 | R5, R6 | Yöntem/bağımlılık modeli, onay koruması |
| Bütün yetkinliklerin kabulü | R7; fiziksel saha kapsamı R8 | Gerçek uygulama akışı ve insan doğrulamalı veri |

Yeni UI iş mantığı ilgili alanın utils dizininde saf fonksiyon ve birim testi olarak ele alınır. IPC/çekirdek tipleri merkezi şemadan türetilir. Hata sınırı, SceneCleaner, iptal/timeout ve eski sonucun temizlenmesi bütün akışlarda doğrulanır. Çevrimdışı ürün politikası korunur; çizimler harici AI servislerine gönderilmez.

Her uygulama istemi en fazla üç bağımsız modül dosyasıyla sınırlandırılır; şema/test/üretilen çıktı envanteri baştan yazılır. Büyük sözleşme geçişi aynı istemi yapay alt adımlara bölerek yürütülmez. Atomik iş seçimi ve bağımlılık sırası progress.md üzerinden yapılır.

## 9. Kabul senaryoları

| Kimlik | Senaryo | Beklenen sonuç |
|---|---|---|
| LT-01 | Boş, bozuk veya iptal edilen kaynak | Açık hata/boş envanter; eski parçanın ölçüleri görünmez |
| LT-02 | Aynı içerik farklı dosya adı | Aynı semantik çıkarım; dosya adına bağlı özel davranış yok |
| LT-03 | Temel ölçü + ilgili FCF | ± genel tolerans atanmaz; geometrik kontrol bağlantısı korunur |
| LT-04 | Aynı delikte boyut + konum toleransı | İki gereksinim birlikte ve bağımsız korunur |
| LT-05 | Eksik standart baskısı/çelişen not | Açık inceleme gereksinimi; otomatik varsayım yok |
| LT-06 | Pafta harfleri ve kutulu not numaraları | Sahte datum veya balon üretilmez |
| LT-07 | 4X delik grubu, belirsiz adaylar | Adet kontrolü ve belirsizlik; ilk adaya sessiz atama yok |
| LT-08 | Çok sayfalı tablo ve diş çağrısı | Doğru satır/çağrı bağı; CMM dışı yöntem korunur |
| LT-09 | Zoom/pan/döndür/crop ardından balon düzenleme | Kaynak koordinatı doğru; başka sayfaya veri sızmaz |
| LT-10 | Kaydet/kapat/aç, undo/redo | Kimlik, değer, kaynak, ilişki ve yerleşim korunur |
| LT-11 | Etiket taşıma ardından tolerans değiştirme | İlki semantik onayı korur, ikincisi bağımlı onayı geçersizleştirir |
| LT-12 | PDF/CAD revizyon değişimi | Eski eşleşme/onay sessiz kullanılmaz |
| LT-13 | Desteklenmeyen GD&T | Ham veri korunur; yorumlama/aktarım sınırı görünür |
| LT-14 | Eksik prob/fikstür ve dış yöntemler | Erişim bilinmiyor; tam kontrol veya tek bağlama başarısı yok |
| LT-15 | Onaysız kaydı UI dışından aktarma girişimi | Çekirdek/sözleşme katmanında reddedilir |
| LT-16 | İş sürerken kaynak değişimi, iptal veya timeout | Geç kalan sonuç yeni projeye yazılmaz; kaynaklar temizlenir |

İlk gerçek kabul adayı progress.md §7'deki KPT-3150 Kör Tapa'dır. GD&T kapsamının tamamını tek başına temsil etmez; ayrıca izinli ve insan doğrulamalı boyut+konum, datum hedefi, tablo, çoklu görünüş ve desteklenmeyen sembol örnekleri gerekir. Sentetik örnekler sınır durumlarını test eder; gerçek pafta kabulünün yerine geçmez.

## 10. Yeterlilik ölçümü ve tamamlanma kapısı

- Çıkarım doğruluğu nominal, tolerans, birim, adet, sembol ve datum için ayrı raporlanır. Ortalama puan kritik alan hatasını gizlemez.
- Kapsam paydası OCR çıktısı değil, insan tarafından sayfa bazında doğrulanmış karakteristik/not envanteridir. Eksik ve fazla bulunan öğeler ayrı sayılır.
- Semantik kapsam, CAD eşleşme kapsamı ve kontrol yöntemi kapsamı ayrı oranlardır. Uygulanamaz kayıtların nedenleri görünürdür.
- Her otomatik çözümün kaynak/kural izlenebilirliği, her onayın güncel sürüme bağlılığı kabul kümesinde kontrol edilir.
- Desteklenen kabul kümesinde uydurulmuş değer, kaybolan semantik ilişki ve onaysız aktarım sıfır olmalıdır. Bu, test kümesi dışı genel doğruluk iddiası değildir.
- Performans için donanım, sayfa/unsur sayısı, dosya boyutu, tekrar sayısı ve süre/bellek ölçümü kaydedilir. Sayısal eşikler ölçümden sonra gerekçesiyle belirlenir; rastgele FPS/süre vaadi verilmez.
- İlgili birim/entegrasyon testleri, check:all, production build, gerekli Rust testleri, görsel regresyon ve gerçek Electron senaryoları kanıtıyla kaydedilir. Komutların kapsamı geliştirme kurallarındaki tanımla raporlanır.

Bir yetkinlik ancak destek seviyesi, standart kapsamı, kabul örnekleri, test sonucu ve kalan sınırlamaları progress.md içinde kayıtlıysa kabul edilir. Fiziksel CMM çıktısının saha kabulü ayrıca R8 kapsamında yürür.

## 11. Yeni yetkinlik ekleme şablonu

Kullanıcı yeterliliği artırırken her öneri aşağıdaki biçimde eklenir. Henüz verilmemiş ürün kararları uygulanmış kabul edilmez.

| Alan | Doldurulacak bilgi |
|---|---|
| Kimlik ve kullanıcı ihtiyacı | IM kimliği; operatörün çözemediği somut iş |
| İzinli örnek | Pafta bölgesi/çağrı; beklenen anlam ve kaynak |
| Hedef seviye | Tanıma, yapılandırma, yorumlama, planlama veya aktarım |
| Standart kapsamı | Aile, baskı, madde; doğrulama gereksinimi |
| Ekran davranışı | Kullanıcının eylemi ve gözlenebilir sonuç |
| Eksik/çelişkili veri | Gösterilecek durum ve engellenecek işlem |
| Veri ve bağımlılık | Şema ihtiyacı, kaynak/CAD/onay ilişkileri |
| Kabul | Pozitif, negatif ve sınır örnekleri; gerçek kullanıcı senaryosu |
| Ana plan bağlantısı | progress.md işi; atomik kapsam ve önkoşullar |

İlk kapsam kararları: başlangıçta desteklenecek standart baskıları, GD&T yorumlama alt kümesi, izinli gerçek örnekler, grup balonlama politikası ve ilk hedef kontrol yazılımı sürümü. Bu kararlar alınana kadar kaynak gösterimi/manüel kayıt tasarlanabilir; belirsiz normatif hesaplar otomatikleştirilmez.

## 12. Arayüz tasarımı — kalıcı çalışma masası

Tasarım hedefi: operatör düzenlediği ölçünün paftadaki yerini kaybetmeden çalışmalıdır. Ana çalışma alanı kalıcı bir sayfa/panel düzenidir; art arda açılan modal pencereler ana düzenleme yöntemi olmaz. Otomatik ve manuel kayıtlar aynı envanteri, kartı ve doğrulama kurallarını kullanır.

### 12.1. Yerleşim taslağı

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Proje / PDF revizyonu / CAD revizyonu     Kaydetme durumu     İnceleme özeti   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Seç  El  Bölge seç │ + Ekle ▾ │ Otomatik çıkar │ Geri al │ Görünüm ▾          │
├──────────────┬───────────────────────────────────────┬───────────────────────┤
│ Sayfalar     │                                       │ Seçili karakteristik  │
│ Envanter     │           PDF / teknik resim          │ Kaynak kırpımı        │
│ Filtre / ara │                                       │ Tanım ve değerler     │
│              │      Balon + kaynak vurgusu            │ Tolerans / GD&T       │
│ #12 Çap      │                                       │ Datum / CAD / yöntem  │
│ #13 Konum    ├───────────────────────────────────────┤                       │
│ #14 Not      │  İsteğe bağlı CAD paneli              │ Eksikler ve gerekçe   │
│              │  (yan yana görünüm de seçilebilir)     │ Kaydet / İncele       │
├──────────────┴───────────────────────────────────────┴───────────────────────┤
│ İnceleme kuyruğu: eksik kaynak • çözülemeyen tolerans • eşleşmeyen unsur       │
└──────────────────────────────────────────────────────────────────────────────┘
```

Bu şema tasarım önerisidir; mevcut ekranın görüntüsü veya uygulanmış arayüz değildir. Panel genişlikleri sürüklenerek değiştirilebilir ve proje tercihi olarak saklanır. Başlangıçta sol envanter yaklaşık 240 px, sağ kart 340–400 px hedeflenir; gerçek ekran ve metin uzunluğuyla doğrulanır. Pafta kalan alanı alır. Dar pencerede sol panel kapanabilir; sağ kart çekmeceye dönüşür. Düzenleme sırasında kaynak kırpımı görünür kalır; pafta okunamayacak kadar daraltılmaz.

### 12.2. Görsel dil ve bilgi önceliği

- Pafta nötr açık zemin üzerinde yüksek kontrastla gösterilir. Çevre panelleri paftadan hafif ton farkıyla ayrılır; teknik resmin özgün renkleri değiştirilmez.
- Seçili kayıt mavi vurgu, eksik bilgi kehribar etiket, çelişki kırmızı etiketle gösterilebilir. Her durumun yazılı adı ve simgesi vardır. “Onaylı” etiketi fiziksel uygunluk/PASS çağrışımı yapan ölçüm sonucu sütununa yazılmaz.
- Bir kayıt satırında balon numarası, kısa ad, nominal/birim, kaynak yöntemi ve inceleme durumu bulunur. Ayrıntılar sağ karta açılır.
- “Manuel”, “Vektör metin”, “OCR”, “Model” kaynak etiketleridir; doğruluk/onay etiketi değildir. Alan bazında farklı kaynaklar bulunabilir.
- Ana komutlar görünürdür: Ekle, Kaydet, İncele. İleri işlemler bağlama göre açılır; bilinmeyen işlevi yalnız simgeyle sunma.
- Paftada tüm kaynak kutuları aynı anda yoğunlaştırılmaz. Varsayılan seçili öğe ve ilgili bağlantılarıdır; tüm balonlar/kaynaklar görünüm filtresinden açılabilir.
- Eksik bilgi bildirimi alanın yanında açıklanır. Bildirim/toast tek hata kaydı olmaz; inceleme kuyruğunda kalıcı erişim sağlanır.

### 12.3. Seçim, gezinme ve bağlam menüsü

Liste, balon, kaynak bölgesi ve CAD seçimleri tek seçili karakteristik kimliğine bağlanır. Listeden seçim doğru sayfayı açar, kaynağı görünür alana getirir; operatör yakınlaştırması gerekmedikçe sıfırlanmaz. Üst üste bölgelerde aday seçici açılır. Bir CAD yüzeyine bağlı birden fazla karakteristik varsa liste gösterilir.

Sağ tık menüsü hedefe göre değişir: boş paftada “Yeni karakteristik / Yeni not / Kaynak bölgesi seç”; balonda “Düzenle / Kaynağa git / Bağlantılar / Numaralandır / Sil”; CAD unsurunda “Seçili karakteristiğe bağla / Bağlantıyı kaldır”. Silme işlemi bağımlılık etkisini gösterir ve geri alınabilir.

Esc etkin çizim/seçim aracını iptal eder; taslağı sessizce silmez. Ctrl+Z/Ctrl+Y çalışma alanı geçmişini yönetir; metin kutusu odaktayken önce o alanın metin düzenlemesi geçerlidir. Delete metin odağında karakteristik silmez. Komutların klavye ve menü yolları aynı durum değişimini kullanır.

## 13. Manuel çalışma — otomatik çıkarımdan bağımsız tam akış

Manuel giriş, OCR başarısız olduğunda kullanılacak eksik bir form değildir. Operatör yalnız paftayı yükleyerek, otomatik çıkarımı çalıştırmadan kaynaklı envanter oluşturabilmelidir. Manuel giriş onay korumasını veya standart doğrulamasını atlamaz.

### 13.1. Manuel karakteristik ekleme

1. **Başlat:** “+ Ekle → Karakteristik” veya paftada sağ tık. Araç durumu “Kaynak bölgesini seç” olarak görünür; mevcut pan aracı geçici olarak bırakılır.
2. **Kaynağı işaretle:** Ölçü metni/çağrı etrafında bölge çizilir. Sağ kartta büyütülmüş kırpım açılır. Yanlış bölge yeniden seçilebilir; sayfa ve koordinat korunur.
3. **Türü seç:** Boyut, geometrik kontrol, datum, not/yüzey şartı veya tablo bağlantısı. Tür seçilmeden zorunlu olmayan alanlar doldurulmaz.
4. **Değerleri gir:** Nominal, birim, adet ve türün ilgili alanları. İstenirse “Bu bölgeyi oku” aday doldurma işlemi çalışır; manuel devam her zaman mümkündür.
5. **İlişkileri kur:** İlgili FCF, datum, not, tablo satırı veya CAD unsurunu seç. Bu bağlantılar kaydetmek için her durumda zorunlu değildir; eksiklik durum olarak tutulur.
6. **Taslağı kaydet:** Kalıcı kimlik oluşur, görünür balon atanır, kaynak korunur. Eksik alan varsa kayıt eksik durumuyla saklanır ve inceleme kuyruğunda görünür.
7. **İncele ve onayla:** Ayrı eylem; alanlar, kaynak ve eksikler özetlenir. Gereksinimler karşılanmıyorsa nedenleriyle onay engellenir. Kaydetmek onaylamak değildir.

Kaynak bulunmadan listeden “Taslak ekle” de mümkündür. Bu taslakta balon paftaya rastgele yerleştirilmez. Çizim gereksinimi olarak onay için kaynak bağlantısı gerekir. Çizim dışı operatör kontrolü ayrı köken, gerekçe ve tanımlı onay politikasıyla saklanır; çizimden okunmuş gereksinim gibi sunulmaz.

### 13.2. Sağ özellik kartının içeriği

| Grup | Alan / etkileşim | Manuel giriş davranışı |
|---|---|---|
| Kaynak | Kırpım, sayfa, ham metin, ek kaynaklar | Bölgeyi değiştir, ikinci kaynak ekle, orijinale git |
| Kimlik | Balon, ad, tür, adet | Kalıcı kimlik gizli/sabit; balon değişikliği semantik değerleri değiştirmez |
| Değer | Nominal, birim, ölçü niteliği | Temel/referans/doğrudan ayrımı; boş başlangıç, örnek değer otomatik kayıt olmaz |
| Boyut toleransı | ±, üst/alt sapma, alt/üst limit, geçme, genel kural bağlantısı | Modlar açık seçilir; birbirine dönüşüm önizlemesi ve kaynak gerekir |
| Geometrik kontrol | FCF satırı, sembol, bölge, değer, değiştirici | Hücre bazlı düzenleme; desteklenmeyen yorum görünür |
| Datum / bağlantı | Datum sırası, hedef, not, tablo | Mevcut kaynaklı tanımlardan seç; bulunamıyorsa yeni tanım akışına git |
| CAD | Bağlı unsurlar ve adaylar | Elle seç, gruba ekle/çıkar, gerekçe yaz, bağı kaldır |
| Yöntem | Kontrol yöntemi, aşama, bağlama ilişkisi | Bilinmeyen yöntem açık kalır; otomatik CMM varsayımı yok |
| İnceleme | Eksikler, değişiklik özeti, audit | Taslak kaydet, incelemeye gönder, uygun kapsamı onayla |

Sayısal giriş yerel ondalık virgülü veya noktayı açık bir kuralla kabul eder; belirsiz binlik ayırıcıyı tahmin etmez. Üst/alt sapma ile mutlak limit etiketleri karıştırılmaz. Birim değişiminde dönüştürülecek değerler önizlenir. Nominalden sonuç veya sapma türetilmez.

### 13.3. Manuel GD&T ve datum tanımlama

FCF editörü çizimdeki hücre yapısını yansıtır. Kullanıcı sembol seçer, tolerans bölgesi/değerini girer, uygun değiştiriciyi ekler ve datum hücrelerini sırayla bağlar. Bir datum referansını yazmak yeni bir çizim datumu yaratmaz. Tanımsız etiket bağlantı eksikliği olarak gösterilir.

Datum tanımlamada önce paftadaki gerçek işaret, ardından işaretin bağlı olduğu unsur seçilir. İsteğe bağlı CAD bağlantısı ayrı adımda kurulur. Hedef tanımında nokta/çizgi/alan ve kaynak bölgesi kaydedilir. Operatör hizalama referansı oluşturmak isterse ayrı adlandırılmış akışa geçer.

Bir geometrik kontrolün birden fazla temel ölçüyle ilişkisi karttan yönetilir. İleri çerçeve desteklenmiyorsa kullanıcı ham kaynak ve açıklamayı kaydedebilir; onay düğmesi bunu desteklenen hesap gibi kabul ettirmez.

### 13.4. Manuel tablo, not ve unsur grubu

- Tablo bölgesi seçilir, satır/sütun başlıkları işaretlenir; hücreler kaynak kırpımı yanında elle yazılabilir. Hücre bağlantısı sayfa ve kaynakla saklanır.
- Bir satır birden fazla yüzeye uygulanıyorsa grup üyeleri ayrı seçilir; beklenen adet ve bağlanan adet birlikte gösterilir.
- Not oluştururken “Tüm parça / Seçili karakteristikler / Belirli işlem” kapsamı seçilir. Kapsam belirlenmemişse eksik kalır.
- Yeni karakteristiğe şablon uygulanabilir; şablon yalnız alan düzenini taşır. Başka kaydın nominalini, datumunu, CAD bağını veya onayını sessizce kopyalamaz.
- “Benzer kayıt oluştur” eyleminde taşınacak alanlar önizlenir; yeni kimlik ve yeni kaynak gerekir, onay taşınmaz. Toplu yöntem/not ataması etkilenen kayıtları ve onay etkisini önce gösterir.

### 13.5. CAD bağlantısını elle kurma

Operatör “CAD'e bağla” ile ilgili karakteristiğe uygun seçim kipine geçer; yüzey/kenar/eksen veya unsur grubu seçer. Seçili geometri ve kimliği iki panelde görünür. Sistem tür, adet ve birim uyuşmazlığını gösterir; kullanıcı seçimi geometrik doğrulama yapılmış gibi etiketlenmez.

Bağlantı yöntemi “Operatör seçimi”, geometrik kontrol durumu ayrıca tutulur. Belirsiz eşleşme gerekçeli seçimle çözülebilir; desteklenmeyen geometri sırf kullanıcı seçti diye çekirdekte desteklenmiş olmaz. CAD olmadan taslak ve çizim incelemesi yapılabilir; CAD gerektiren planlama/aktarım kapsamı engelli kalır.

### 13.6. Otomatik sonuçlarla birleşme ve düzenleme güvenliği

Otomatik çıkarım sonradan çalıştırıldığında manuel kayıtların üzerine yazılmaz. Benzer kaynak bölgesindeki adaylar “Yeni / Olası mükerrer / Mevcut kayıtla çelişiyor” olarak sunulur. Operatör bağla, yeni kayıt tut veya adayı reddet eylemi seçer; tüm kararlarda kaynak geçmişi korunur.

Kullanıcı düzenlenmiş taslak varken başka kayda geçerse kaydet, taslak olarak koru veya değişikliği bırak seçenekleri sunulur; sessiz veri kaybı olmaz. Kaynak değişimi sırasında devam eden okuma işi iptal edilir veya sonucu eski kaynak sürümüne hapsedilir. Manuel alanın otomatik yenilemeyle değişmesi açık inceleme gerektirir.

## 14. Manuel arayüz kabul senaryoları

| Kimlik | Kullanıcı testi | Beklenen sonuç |
|---|---|---|
| UI-M01 | OCR çalıştırmadan kaynak seç ve ölçü ekle | Kaynaklı manuel kayıt oluşur; otomatik sistem bağımlılığı yok |
| UI-M02 | Eksik toleransla taslak kaydet | Kayıt korunur; tolerans uydurulmaz; onay gereksinimi görünür |
| UI-M03 | Kaynaksız listeden taslak ekle | Rastgele balon yok; çizim kaynağı eksik olarak işaretli |
| UI-M04 | FCF ve datum hücrelerini elle düzenle | Kaynak ve sıra korunur; tanımsız datum otomatik oluşturulmaz |
| UI-M05 | Temel ölçü seç, ardından genel tolerans incele | Temel ölçüye ± ataması yapılamaz; ilgili kontrol bağlantısı istenir |
| UI-M06 | Manuel kayıttan sonra otomatik çıkarım çalıştır | Mevcut değerlerin üstüne yazılmaz; mükerrer aday incelemeye gelir |
| UI-M07 | CAD olmadan çizim incele | Kayıt/düzenleme çalışır; yalnız CAD gerektiren işlemler gerekçeyle engelli |
| UI-M08 | Grup üyelerini elle seç ve azalt | Beklenen/bağlı adet farkı görünür; plan etkisi hesaplanır |
| UI-M09 | Yanlış birim, alt/üst sınır veya sayı gir | Alan yanında açıklama; hatalı değer onaylanamaz; giriş kaybolmaz |
| UI-M10 | Taslak açıkken kayıt/sayfa değiştir | Kaydetme/koruma/iptal davranışı açık; veri sessizce silinmez |
| UI-M11 | Yalnız klavyeyle ekle/düzenle/kaydet | Odağın yeri görünür; kısayollar metin girişini bozmaz |
| UI-M12 | Dar pencere, uzun not ve büyütülmüş metin | Ana eylemler erişilebilir; kaynak kırpımı ve alanlar okunabilir |
| UI-M13 | Manuel onaydan sonra kaynak/tolerans değiştir | Etkilenen onaylar yeniden incelemeye açılır; eski onay geçmişi korunur |
| UI-M14 | Tablo/not kaydını kapatıp yeniden aç | Hücre kaynakları, kapsam ve karakteristik bağlantıları korunur |

Arayüzün ilk değerlendirmesi şu görevlerle yapılır: manuel boyut ekle; boyut+konum kontrolü bağla; notu unsur grubuna uygula; yanlış kaydı düzelt ve yeniden aç. Görev tamamlama, yanlış alan girişi, kaynağa dönüş ve veri kaybı gözlenir. Kabul, ekranın görünmesine veya düğmenin toast göstermesine dayanmaz. Bu senaryolar R4/R5 arayüz çalışmalarını ve R7 gerçek Electron kabulünü ayrıntılandırır; ana iş sırasını değiştirmez.
