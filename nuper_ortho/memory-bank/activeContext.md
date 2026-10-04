# Nuper Ortho — Aktif Bağlam

Son güncelleme: 4 Ekim 2026.

## 1. Mevcut durum

Proje, çalışan bileşenleri bulunan fakat kullanıcı akışı tamamlanmamış bir geliştirme prototipidir. Electron açılıyor; modül testleri ve workspace derleme kontrolü geçiyor. Gerçek STEP/PDF → eşleştirme → operatör onayı → plan → dışa aktarma zinciri doğrulanmış değildir. Bazı arayüz yollarında ölçüm yapılmadan ölçülen değer ve PASS üretilmektedir.

Önceki “tüm fazlar tamamlandı”, “altın sürüm mühürlendi”, “tam saha kabulü” ve “sıfır çarpışma garantisi” beyanları güncel kabul kaydı değildir. Geçmiş çalışmalar Git geçmişinde korunur; bir bileşenin varlığı veya test sayısı ürünün tamamlandığını göstermez.

Bu güncelleme yalnızca plan ve durum belgelerini düzenler. Açık sorunların kodda düzeltildiği anlamına gelmez.

## 2. Belge rolleri ve okuma sırası

1. [AGENTS.md](../AGENTS.md): görev kapsamı ve değişiklik sınırları.
2. [architectureBlueprint.md](architectureBlueprint.md): Y1–Y9 değişmezleri ve hedef mimari.
3. Bu belge: mevcut odak ve doğrulanmış engeller.
4. [progress.md](progress.md): tek güncel iş sırası, durum ve kabul koşulları.
5. [developmentInfrastructureRules.md](developmentInfrastructureRules.md): geliştirme ve kanıt üretme kuralları.
6. İlgili merkezi şema, kod ve testler.

Bu üç güncel plan belgesi eski faz tablolarının durum/sıra beyanlarının yerini alır; mimari yasaları gevşetmez. Blueprint içindeki ilk kod taraması ve F0–F8 listesi tarihsel başlangıçtır; güncel karşılığı progress.md içindedir.

projectbrief.md, productContext.md, systemPatterns.md ve techContext.md içindeki Tauri/React/OCCT, performans ve sertifikasyon ifadeleri mevcut uygulamanın doğrulanmış envanteri olarak okunmamalıdır. Bu belgeler ürün hedefleri ve tarihsel tasarım bağlamıdır; gerçekleşme durumu aşağıdaki envanter ve progress.md üzerinden belirlenir.

## 3. Gerçekte kullanılan çalışma yolları

| Alan | Gözlenen uygulama | Henüz kanıtlanmayan hedef |
|---|---|---|
| Masaüstü | package.json → electron-main.js → ui/dist/index.html | Paketlenmiş, çevrimdışı ve güvenli dağıtım |
| Arayüz | Eski ui/index.html betikleri + Vite/TypeScript modülleri | Tek durum modeli ve tek olay sahipliği |
| CAD | Eski sahneye STEP yükleme; ayrıca Rust ayrıştırıcı kodu | Görüntüleyici ve eşleştiricinin aynı gerçek B-Rep unsur verisini kullanması |
| PDF | Python çıkarıcı ve ayrı tarayıcı ayrıştırıcısı | Menşei kayıtlı, sonuç uydurmayan tek çıkarım hattı |
| Sözleşme | Üç JSON şeması; TS/Python üretim betiği | Runtime doğrulama, şema sürümü ve Rust üretimi |
| Plan/emitter | Rust modülleri ve ayrı UI kod metni indirme yolu | Onay ve rota denetimini atlayamayan üretim zinciri |

src-tauri dizini olması çalışan Tauri kabuğu kanıtı değildir; mevcut manifestte Tauri bağımlılığı bulunmaz. Bu onarım planı mevcut Electron akışını esas alır. Kabuk veya CAD çekirdeği değişimi ayrıca değerlendirilir.

## 4. Doğrulanmış engeller

| Kimlik | Sorun | Etki / kanıt |
|---|---|---|
| B01 | PDF, görsel ve manuel unsur yollarında sabit ölçüm/PASS | Çıkarım ile ölçüm karışıyor; P0 öncelik |
| B02 | CAD yükleme eşleştiriciye metadata aktarmıyor | Gerçek valve_block.step yüklemesi sonrası CAD metadata ve sonuç null |
| B03 | Sihirbaz window.electronIpc, eski kod üst düzey let electronIpc kullanıyor | Beklenen alan undefined; Python yolu atlanıyor |
| B04 | Sihirbaz panelleri inline !important ile gizliyor | Çift Kanvas aktifken panel gizli; manuel unsur eski gizli ağaca yazılıyor |
| B05 | Onay, simülasyon ve DMIS aynı planı tüketmiyor | UI codeSnippets indiriyor; gerçek onaylı plan bağlantısı yok |
| B06 | Eski bridge üretim paketinde yok | ERR_FILE_NOT_FOUND; bridge'in kendisi de sabit ölçüm verisi taşıyor |
| B07 | Kabul testleri kullanıcı akışını korumuyor | Görsel test yalnızca başlık/body kontrol ediyor |
| B08 | Codegen ve onay koruması eksik | Python üretim hatası yutuluyor; onaysız emitter girişleri mevcut |

Kaynaklar: [inceleme raporu](../docs/project-audit-2026-10-04.md), [codegen](../scripts/codegen.mjs), [review](../crates/ortho-ast/src/review.rs), [emitter](../crates/ortho-emitter/src/lib.rs).

## 5. Doğrulama tabanı

4 Ekim incelemesinde ayrı ayrı çalıştırıldı: TypeScript kontrolü başarılı; 16 UI test dosyasında 75 test başarılı; 24 Python testi başarılı; cargo check --workspace başarılı, uyarılar mevcut; Vite build başarılı, paketleme uyarıları mevcut.

Rust testleri, fiziksel CMM ve üretici yazılımında çıktı kabulü bu incelemede çalıştırılmadı. Gerçek Electron denemeleri CAD metadata kopukluğunu ve panel sorunlarını doğruladı; Prob Seç penceresi açıldı. verify_live_ui.mjs başarısızdır ve gerçek uygulama IPC'sini kurmayan ayrı pencere kullanır. Komut kapsamları progress.md içinde korunur.

## 6. Şimdiki odak

Ürün akışı kullanıcının CMM programlama sırasına göre tanımlandı: çizim/genel notlar → gerçek datumlar veya açık operatör referansları → bağlama/erişim → düzlem/daire/kenar/kurgu çizgisiyle hizalama → tam karakteristik ve düzenlenebilir balon kontrolü → ölçüm stratejisi/onay → program. X yönü için uygun kenar veya operatörün seçtiği iki daire merkezinden çizgi desteklenecek; belirli geometriye zorlanmayacak. Bu davranışlar henüz uygulamada yoktur.

İlk kabul adayı KPT-3150 Kör Tapa'nın iki sayfalı PDF'i ve yerel STEP dosyasıdır. PDF'in metin katmanından içerik çıkarılamadı; OCR gerekir. Görsel incelemede açık A/B/C datum etiketi saptanmadı; pafta harfleri/not numaraları datum sayılmayacak. Antet/genel not, diş tablosu ve kaplama sonrası ölçüm şartı plan kapsamındadır. Tek bağlama sonucu prob/fikstür/erişim doğrulaması olmadan verilmeyecek. Kaynak hash'leri ve gözlem sınırları progress.md §7'de bulunur.

Balon düzenleme ve PDF üzerinde sağ tıkla yeni balon tanımlama temel işlevdir. Kaynak bölgesi ile taşınabilir balon etiketi ayrılır; zoom/pan/sayfa dönüşümünde ankraj korunur; kaydet/yeniden aç ve undo/redo desteklenir. Tam ölçü kapsamı, yalnız OCR satır sayısıyla değil operatörün doğruladığı sayfa envanteriyle kabul edilir. Ayrıntılar progress.md §6'daki O1–O7 ve B1–B6 koşullarıdır.

Aktif öncelik **R0 — sonuç uyduran yolların kaldırılması**. Uygulama onarımı henüz başlamadı.

İlk atomik aday R0.1: DrawingPdfParser.ts içindeki nominalden ölçüm türetme ve dosya adına göre sabit veri üretme davranışını kaldırmak; davranışı bağımsız regresyonla korumak. Değişecek dosyalar görev başında seçilir; en fazla üç bağımsız modül dosyası sınırı korunur.

Sonraki sıra: R1 sözleşmeler → R2 başlatma/IPC → R3 CAD/PDF akışı → R4 ortak arayüz durumu → R5 eşleştirme → R6 onay/rota/emitter → R7 kabul → R8 saha. Ayrıntılar yalnızca [progress.md](progress.md) içinde yönetilir.

## 7. Kapsam ilkeleri

- ui/index.html dosyasına yeni kod eklenmez; kaldırılan davranış modüler ui/src bileşenlerine taşınır.
- Ölçüm sonucu, CAD eşleşmesi ve operatör onayı ayrıdır. Eşleşen veya onaylanan nominal otomatik PASS olmaz.
- Örnek veri gerçek projeye yedek değildir. Başarısız veya desteklenmeyen çıkarım görünür hata/bilinmiyor sonucu verir.
- Yeni IPC alanı için önce şema ve codegen işi tamamlanır; tüketiciler geçmeden yeni sözleşme etkinleştirilmez.
- Modül testleri, gerçek Electron akışı ve saha kabulü ayrı kanıt seviyeleridir.
- İleri AI, yeni sağlayıcılar, Tauri geçişi, lisans/dongle ve CNC kapalı döngüsü ilk çalışan dikey dilimin önüne alınmaz.
- Sonraki çalışma iş kimliğini, değişen dosyaları, test girdilerini, komut sonuçlarını ve kalan engelleri kaydeder. Kanıtsız yüzde veya mühür ifadesi kullanılmaz.
