# Nuper Ortho — Geliştirme ve Doğrulama Kuralları

Son güncelleme: 4 Ekim 2026.

## 1. Belge sınırı

Bu belge geliştirme yöntemini ve gerekli kanıtı tanımlar. İş sırası/durum yalnızca [progress.md](progress.md) içinde tutulur; ikinci bir faz listesi yoktur. [AGENTS.md](../AGENTS.md) ve [architectureBlueprint.md](architectureBlueprint.md) değişmezleri geçerlidir.

Codegen, SceneCleaner, worker, mock IPC ve test koşucularının varlığı tüm canlı akışlarda doğru kullanıldıklarını göstermez. Gerçek kabul durumu ana planda yazılır.

## 2. Atomik görev sınırı

- Bir görevde en fazla üç bağımsız modül dosyası değişir. Uygulama, test, şema ve üretilen çıktılar başlangıçta listelenir; otomatik üretim genel muafiyet sayılmaz.
- Yeni UI algoritması/iş mantığı ui/src/modules/<alan>/utils/ altında saf fonksiyon ve birim testi olur; ana bileşen yalnızca bağlar.
- ui/index.html dosyasına yeni kod eklenmez. Mevcut hook'un on satıra kadar eklemeyi kaçırması izin değildir. Eski kod kaldırılabilir; modüler giriş kullanılır.
- Geçersiz kod yorum satırı olarak bırakılmaz. Geçici console.log/Python print ve Rust unwrap()/expect() eklenmez. Daha gevşek tarihsel örnekler AGENTS.md kuralını değiştirmez.
- Kapsam büyürse aynı istemi yapay alt adımlara ayırarak sınırı aşma; görevi küçült ve bağımlı işleri planda açık bırak.
- İnsan tarafından doğrulanmış golden/expected veriler testi geçirmek için değiştirilmez. Eski test kusurlu davranışı zorunlu tutuyorsa çelişki raporlanır; uygulama sonucuna bakılarak beklenen değer uydurulmaz.

## 3. Mevcut ortam ve hedef

| Alan | Mevcut gerçek | Hedef / açık iş |
|---|---|---|
| Masaüstü | npm start / npm run app → Electron → ui/dist | Eksik build hatası ve dev/production ayrımı |
| Dev | Vite ve Electron birlikte başlar; Electron yine dist okur | Hazır Vite URL'sine bağlanan geliştirme |
| UI | Eski HTML/JS ve yeni TypeScript | Tek durum/olay sahipliği; React varsayılmaz |
| Python | PATH'teki python çağrılıyor | Tanımlı dev ortamı; üretimde gömülü mutlak yorumlayıcı |
| Rust | Workspace/CLI; src-tauri içinde Rust kodu | UI ile gerçek plan/emitter bağlantısı |
| Codegen | TS/Python; Python hatası uyarı kalabiliyor | Başarısızlık, Rust üretimi ve drift denetimi |
| Varlıklar | Three.js/loader/font/PDF worker dış yolları | Yerel, çevrimdışı paket ve eksik varlık testi |

Sürümlerin kaynağı manifestler ve mevcut kilit dosyalarıdır. Eski belgelerdeki sürüm/RAM/FPS ifadeleri ölçülmüş sonuç sayılmaz. Kabuk veya çekirdek değişimi bu onarımın kendiliğinden gereği değildir.

## 4. Şema ve IPC sözleşmesi

1. Python/Rust sınırında yeni alan veya anlam değişikliği için önce schemas/*.schema.json güncellenir, ardından npm run codegen çalıştırılır. Üretilen TS/Python tipleri elle yazılmaz; Rust üretimi hedefi ayrıca uygulanır.
2. Üretici/tüketici aynı şema sürümünü kullanır. Eksik zorunlu alan, uyumsuz sürüm ve desteklenmeyen değer sessizce dönüştürülmez.
3. Runtime doğrulama gerekir: TypeScript tipi gelen JSON'u doğrulamaz. IPC girişleri main tarafında, süreç çıktıları tüketilmeden önce kontrol edilir.
4. Codegen başarısı çıkış kodu ve bütün beklenen çıktılarla belirlenir. Python hatasıyla birlikte “başarılı” mesajı kabul değildir; R1 onarımına kadar her hedef ayrıca kontrol edilir.
5. Üretim sayısı dosya sınırına sığmıyorsa önce seçili şema/hedef desteği planlanır; çıktılar elle kırpılmaz. Tüketiciler geçmeden yeni sözleşme açılmaz.
6. Çıkarım, CAD doğrulaması, operatör onayı ve fiziksel ölçüm ayrı sorumluluklardır. PASS yalnızca gerçek ölçüm değerlendirmesidir; animasyon tamamlanması PASS değildir.
7. Kaynak hash'i, sayfa/bbox, yöntem ve sürüm korunur. Kaynak/geometri değişince eşleşme, onay ve rota geçersizleşir.

## 5. Tek uygulama durumu

- Menü/ribbon/kısayol/seçim/sürükle-bırak aynı komutları çağırır. Aynı eyleme inline ve modüler dinleyici birlikte bağlanmaz.
- CAD, çizim, seçili unsur, eşleşme, onay ve simülasyon tek durum sahibinden yönetilir. Global değişken ile window alanı ayrı kaynaklar olamaz.
- Geçişte bütün okuma/yazma noktaları envanterlenir. Gizli eski DOM'a yazmak yeni arayüze entegrasyon sayılmaz.
- BBox/mesh önizlemesi analitik B-Rep kabulü değildir. Örnek parça yalnız açık demo/test modundadır; eksik gerçek dosyaya yedek olamaz.
- Uygulanmamış özellik gerekçesiyle kullanılamaz görünür. Modal, toast veya sabit rapor işlem başarısı sayılmaz.

## 6. Hata ve kaynak yaşam döngüsü

- UI hata sınırı kullanıcıya işlem/hata bilgisini gösterir; teknik ayrıntı yapılandırılmış logda tutulur. Önceki proje verisi yeni sonuç gibi gösterilmez.
- Süreç iptali, timeout, çıkış kodu, bozuk çıktı ve eksik bağımlılık test edilir. Boş catch veya sessiz null ile veri kaybı gizlenmez.
- IPC kanalları bir kez kaydedilir. Blueprint §12 gereği preload/contextBridge, izolasyon, sandbox ve izinli dosya erişimi uygulanır.
- Geometri/material/texture/renderer sahipliği açıktır. SceneCleaner ile model değişimi ve unmount temizlenir; renderer yok edilirken WebGL bağlamı serbest bırakılır. Paylaşılan kaynak erken dispose edilmez.
- Worker, timer, olay dinleyicisi ve object URL da temizlenir. Geometri dispose testi tek başına sızıntısız uygulama kanıtı değildir.
- 16 ms'yi aşan hesaplamalar ana UI iş parçacığından taşınır; uygun yerde transferable buffer kullanılır. Worker dosyasının varlığından 60 FPS sonucu çıkarılmaz; ölçüm gerekir.

## 7. Birim ve koordinat doğruluğu

- Alan ölçüleri blueprint birim tipleriyle taşınır. CAD Z-yukarı, Three.js Y-yukarı ve PDF/Canvas dönüşümleri sınır adaptöründedir.
- Kanonik bbox [x_min, y_min, x_max, y_max], PDF noktası ve sol-üst başlangıçlıdır. Kaynak kütüphane farklıysa girişte dönüştürülür. Normalize koordinat aynı alana yazılmaz.
- Gerçek sayfa yüksekliği/dönüklüğü, CAD ölçeği ve matris kullanılır; her çizime aynı yükseklik atanmaz.
- Kayan nokta eşitliği adlandırılmış uygun epsilon ile yapılır. Sayısal epsilon mühendislik toleransı değildir; eşleme eşikleri yapılandırma ve testle gerekçelendirilir.
- Standart tablo kaynağı/sürümü ve sınır testleri kaydedilir. Bulunmayan nominal, tolerans, datum veya malzeme uydurulmaz.

## 8. Test komutlarının gerçek kapsamı

| Komut / test | Mevcut kapsam | Kullanım |
|---|---|---|
| npm run check:types | TypeScript tür kontrolü | UI/sözleşme değişikliği |
| npm run test:ui | Vitest modül testleri | Davranış/regresyon |
| npm run test:python | tools/tests pytest | Çıkarım/Python tüketicileri |
| npm run test:rust | cargo check --workspace | Derleme; test çalıştırdığı söylenmez |
| cargo test -p <crate> / cargo test --workspace | Gerçek Rust testleri | Çekirdek ve entegrasyon |
| npm run build | Production frontend paketi | Entry/varlık/paket |
| npm run test:visual | Şu an başlık/body smoke testi | Gerçek snapshot ve davranış kapsamı eklenmeli |
| npm run check:all | Types + UI + Python + Rust check | Temel kontrol; tam ürün kabulü değil |
| Gerçek Electron E2E | Yeterli kalıcı paket henüz yok | Gerçek main, IPC, dosya ve çıktı |

Her kod işi için ilgili test ve check:all sonucu kaydedilir. Kullanıcı akışında gerçek Electron davranışı ayrıca doğrulanır; grafik/balon/koordinat değişikliğinde görsel regresyon gerekir. Başarısızlık saklanmaz, iş kabul edilmez. Yalnız doküman değişikliğinde bağlantı/kapsam/diff kontrolü yeterlidir; eski testler yeniden çalıştırılmış gibi sunulmaz.

E2E testi yalnız yardımcı BrowserWindow açmaz; gerçek main/IPC yolu kullanılır. Mock IPC ve sentetik fixture hızlı modül geliştirme içindir; gerçek dosya akışının kabulünü tek başına karşılamaz. Girdi, beklenen sonuç ve mock/gerçek mod açıkça yazılır.

## 9. Depo koruması ve tekrarlanabilirlik

- Pre-commit/pre-push kancaları baypas edilmez. Hook staged farkı denetler; boş staging ile geçmesi tüm çalışma ağacının kontrol edildiği anlamına gelmez.
- scratch, build çıktıları ve geçici teşhis dosyaları uygulama kaynağına dönüşmez. Kalıcı regresyon uygun test dizinine taşınır.
- Git dışında kalan yerel test_assets temiz kurulumda var sayılmaz. Paylaşımı izinli, sürümlenmiş fixture veya belgelenmiş veri temini gerekir.
- Python/Node/Rust bağımlılıkları ve kilit dosyalarının yeniden kurulabilirliği R2/R7'de doğrulanır. Önceden kurulu araçlara dayanan başarı temiz kurulum kanıtı değildir.
- Yeniden üretimde beklenmeyen fark, eksik paket varlığı ve plansız dış ağ isteği kabul hatasıdır.

## 10. Görev ve teslim kaydı

Operatör akışı için aşağıdaki ek kurallar uygulanır; iş sırası ve kabul ölçütleri progress.md §6–7'dedir:

- Çizimin datum tanımı, programlama hizalaması ve fikstür teması farklı kayıtlardır. Operatör referansı resimde olmayan A/B/C etiketi üretmez.
- Kurgu geometri kaynak unsurlara bağlıdır. İki daire merkeziyle çizgi, uygun kenar ve seçili çalışma düzlemi/eksen işareti açık tutulur; yetersiz bağımsız yönler ve döngüsel bağımlılıklar reddedilir.
- Balon yerleşimi, ölçünün kaynak bbox'ı ve karakteristik kimliği ayrı kavramlardır. Ekran pikseli kalıcı kaynak koordinatı değildir. OCR render pikselleri DPI/crop/dönüş matrisiyle PDF noktasına çevrilir; UI zoom/pan dönüşümü bunun üzerine uygulanır ve yeni balon için tersine çevrilir.
- Kalıcı kimlik balon numarasından bağımsızdır. Etiket taşıma/numaralandırma ile nominal/tolerans/datum/CAD bağlantısı değişimi aynı onay geçersizleştirme politikasını kullanmaz; semantik değişikliklerin bağımlı planları yeniden incelemeye açılır.
- Kaydet/yeniden aç, undo/redo, sağ tıkla ekle ve farklı kaynak/revizyona geçiş gerçek kullanıcı testidir. Kaynak dosya revizyonu değişince eski balonlar sessizce yeni sayfaya uygulanmaz.
- Erişim ve kapsam hesapları gerçek prob/tezgah/fikstür ve karakteristik verisinden yapılır. Bilinmeyen veri tek bağlama başarısına dönüşmez. CMM dışı kontrollerin bulunması ve desteklenmeyen karakteristikler açık tutulur.
- Yeni kayıt alanları önce merkezi şema/codegen işidir; burada anlatılan ürün kavramları doğrudan el yazısı IPC tiplerine dönüştürülmez.

| Alan | Yazılacak bilgi |
|---|---|
| İş kimliği / bağımlılık | progress.md alt işi ve önkoşulu |
| Sorun | Somut tetikleyici ve yanlış davranış |
| Yeni davranış | Kullanıcı/veri açısından beklenen sonuç |
| Dosyalar | En fazla üç bağımsız modül; test/üretilen çıktı envanteri |
| Sözleşme | Mevcut şema veya önce tamamlanacak şema işi |
| Doğrulama | Hata yeniden üretimi, testler, gerçek akış ve çıkış kodları |
| Sınırlar | Desteklenmeyen durum, kalan hata ve bağımlılık |

Bir görev bütün fazın tamamlanması değildir. Sonuç [progress.md](progress.md) içine kanıt kapsamıyla, sonraki odak [activeContext.md](activeContext.md) içine kısa yazılır. Kanıtsız sertifikasyon, sıfır çarpışma, sıfır sızıntı veya yüzde yüz tamamlanma kullanılmaz.
