# Nuper Ortho çalışma akışı incelemesi

Tarih: 4 Ekim 2026. Kapsam: yerel depo, mevcut Electron uygulaması, STEP yükleme, PDF çıkarımı, eşleştirme ve araç çubuğu. Kaynak kod değiştirilmedi; üretim paketi yeniden derlendi. Bu rapor ürünün tamamının doğrulandığı anlamına gelmez.

## Sonuç

Temel bağımlılıklar çalışıyor. Ana sorun, `ui/index.html` içindeki eski uygulama ile `ui/src/` modüllerinin ayrı durum ve veri akışları kullanması. Bir düğmenin fonksiyonunun bulunması, o fonksiyonun yüklenen parçayı işlediğini veya ölçüm yaptığını göstermiyor. Bazı işlemler görsel gösterim ya da sabit örnek veri seviyesinde.

## 1. P0 — Ölçüm yapılmadan ölçülen değer ve PASS üretiliyor

- `ui/src/modules/inspection/utils/DrawingPdfParser.ts:251`: PDF'ten okunan nominale sabit sapma eklenerek `measured` ve `PASS` üretiliyor. Aynı davranış farklı ayrıştırma dallarında tekrarlanıyor.
- Aynı dosyanın 440. satırında dosya adındaki `gobek`, `3051`, `olugu` ifadeleri özel veri üretim dalını seçiyor.
- `ui/src/modules/inspection/utils/SetupWizard.ts:384`: görsel yüklenince sabit 100 mm ölçü, 100.002 mm ölçülen değer ve PASS oluşturuluyor. PDF ayrıştırma hatası sessizce yutulup örnek yükleme yoluna geçebiliyor.
- `ui/index.html:3668`: manuel unsur ekleme, sabit nominal/tolerans ve PASS kaydı oluşturuyor; bazı konumlar rastgele belirleniyor.

Bu kayıtlar gerçek CMM ölçüm sonucu olarak kullanılamaz. Python çıkarıcısında ölçülen alanlar boş bırakılmış olsa da arayüzdeki alternatif yollar bu ayrımı korumuyor. İlk onarım, bu yolların sonuç uydurmasını kaldırmak ve eksik veriyi açıkça bildirmek olmalı (mimari Y1/Y2/Y4/Y8).

## 2. P1 — STEP yükleme eşleştiriciye veri aktarmıyor

- `ui/index.html:5733`: `handleCadData`, STEP'i eski `build3DModelFromStep` fonksiyonuna gönderiyor.
- `electron-main.js:53` ve `:146`: CAD IPC yanıtları dosyanın metnini/base64 içeriğini döndürüyor; eşleştiricinin kullandığı `metadata.features` üretilmiyor.
- `ui/src/main.ts:89`: yeni yükleme yolu yalnızca mevcutsa `metadata` alanını sihirbaza aktarıyor; geometri olarak bir kutu oluşturuyor. Araç çubuğunun eski yükleme yolu bu metodu kullanmıyor.
- `ui/src/modules/inspection/utils/SetupWizard.ts:113`: CAD metadata yoksa eşleştirme doğrudan sonlanıyor.

Canlı uygulamada `tests/data/valve_block.step`, gerçek `read-local-cad` IPC ve `handleCadData` üzerinden yüklendi. Model boyutu ekranda göründü; IPC metadata alanı yoktu, sihirbazdaki `currentCadMetadata` ve eşleştirme sonucu `null` kaldı.

Onarım hedefi: mevcut CAD şemasına uygun gerçek geometrik unsurları tek yükleme akışında üretmek, hem görünümü hem eşleştiriciyi aynı veriden beslemek. Sadece bounding box ölçülerini bağlamak delik/yüzey eşleştirmesini tamamlamaz.

## 3. P1 — Yeni PDF yükleyicisi Electron bağlantısını bulamıyor

- `ui/index.html:3225`: IPC nesnesi üst düzey `let electronIpc` değişkeninde tutuluyor.
- `ui/src/modules/inspection/utils/SetupWizard.ts:343`: sihirbaz `window.electronIpc` arıyor. Bunlar aynı erişim biçimi değil; canlı uygulamada `typeof window.electronIpc` sonucu `undefined`.
- Bu nedenle sihirbazın Python çıkarıcısını çağıran dalı devreye girmiyor; PDF tarayıcı ayrıştırıcısına gidiyor. Bu ayrıştırıcı yukarıdaki P0 verilerini üretiyor ve PDF worker dosyasını CDN'den yüklüyor.
- PDF seçim düğmelerinde hem inline `onclick` hem `ui/src/main.ts` tarafından eklenen dinleyiciler bulunuyor; aynı eylemi iki ayrı bağlama yolu yönetiyor.

Onarım hedefi: tek IPC istemcisi, tek dosya seçimi/çıkarım akışı ve görünür hata bildirimi. Görsel önizleme ile ölçü çıkarımının başarısı ayrı izlenmeli.

## 4. P1 — Üst araç çubuğu gizli veya farklı durumu güncelliyor

- `SetupWizard.ts:162` ve `:1107`: başlangıç ve plan aktarımı eski unsur ağacını, sağ paneli ve 2D alanı `display: none !important` ile gizliyor.
- `ui/index.html:4949`: Çift Kanvas yalnızca sınıf değiştiriyor; inline gizleme stilini kaldırmıyor.
- `ui/index.html:3693`: manuel unsur ekleme eski ağaç DOM'una yazıyor. Canlı testte Düzlem eklemeden sonra bu ağacın hesaplanan görünürlüğü `display: none` kaldı.
- `ui/index.html:3614`: Geri Al/Yinele yalnızca bildirim gösteriyor; durum geçmişini geri yüklemiyor.

Canlı açılışta 21 araç çubuğu eyleminin fonksiyonu tanımlıydı. Prob Seç penceresi açıldı. Dolayısıyla sorun tüm işleyicilerin eksik olması değil; görünür arayüz, veri modeli ve işlem sonuçları arasındaki kopukluk.

## 5. P1 — Plan, eşleştirme ve dışa aktarma tek zincir oluşturmuyor

- `SetupWizard.ts:528`: onaylama, çizim yoksa örnek yüklemeyi başlatabiliyor; CAD eşleşmesi zorunlu koşul değil.
- `ui/src/main.ts:23`: sihirbaz oluşturulurken Rust plan üretimine bağlanan `onConfirm` işleyicisi verilmiyor.
- `ui/index.html:3573`: DMIS dışa aktarma mevcut `codeSnippets.dmis` metnini indiriyor. Electron IPC işleyicilerinde Rust planlayıcı/emitter çağrısı bulunmuyor.
- `SetupWizard.ts:1227`: unsur seçimi CAD eşleşmesindeki merkez yerine `InspectionSynchronizer.getFeatureCoordinates(id)` örnek koordinat yolunu kullanıyor.
- `CadDrawingMatcher.ts`: ilk uygun nominali seçen sınırlı eşleştirme var; çoklu adet, eşit aday belirsizliği ve genel GD&T çözümlemesi tamamlanmış değil.

Onarım hedefi: çıkarım → CAD doğrulaması → operatör onayı → gerçek plan → emitter. Animasyonun hareket etmesi veya dosyanın indirilmesi bu zincirin doğrulandığı anlamına gelmez.

## 6. P2 — Paketleme ve geliştirme başlangıcı

- Üretim derlemesi `inspection_bridge.js` dosyasının modül olmadığı için paketlenmediğini bildiriyor.
- Gerçek Electron açılışında `ui/dist/src/modules/inspection/utils/inspection_bridge.js` için `ERR_FILE_NOT_FOUND`; `window.InspectionBridge` yok.
- Bu dosyanın kendisi de sabit ölçüm/PASS verisi taşıyor. Yalnızca pakete kopyalanması doğru onarım olmaz.
- `electron-main.js:29` her zaman `ui/dist/index.html` açıyor. `npm run dev` Vite'ı başlatsa da Electron geliştirme sunucusuna bağlanmıyor. `npm start` derleme yapmıyor.
- Three.js ve PDF worker için dış CDN bağımlılıkları çevrimdışı çalışma hedefiyle uyumsuz.

## Çalıştırılan kontroller

| Kontrol | Sonuç | Sınır |
|---|---|---|
| `npm run check:types` | Geçti | Tür denetimi, kullanıcı akışını doğrulamaz |
| `npm run test:ui` | 16 dosya, 75 test geçti | Gerçek Electron/STEP/PDF zincirinin kanıtı değil |
| `python -m pytest tools/tests -q` | 24 test geçti | Arayüzde kullanılan alternatif PDF yolu kapsam dışı |
| `cargo check --workspace` | Geçti, 8 uyarı | Rust testleri çalıştırılmadı; derleme kontrolü |
| `npm run build` | Geçti, uyarılar var | Eksik klasik script derlemeyi başarısız kılmıyor |
| `node scripts/verify_live_ui.mjs` | Başarısız | 2D alan genişliği 0; betik kendi penceresinde gerçek IPC işleyicilerini kurmuyor |
| Gerçek Electron açılışı | Açıldı | Eksik bridge isteği doğrulandı |
| Gerçek STEP IPC/yükleme | Görünüm güncellendi | Eşleştirici CAD verisi ve sonuç `null` |
| Prob Seç / manuel Düzlem | Pencere açıldı / eski ağaç gizli | Araç çubuğu için seçilmiş örnekler; tüm özellikler tek tek doğrulanmadı |

Mevcut Playwright görsel testi sadece sayfa başlığı ve görünür `body` kontrol ediyor. Gerçek eşleştirme, onay, dışa aktarma ve araçların sonucu için kabul testi bulunmuyor. `memory-bank` içindeki “tamamlandı/mühürlendi” ifadeleri bu incelemede ürün kabul kanıtı olarak kullanılmadı.

## Onarım sırası

1. Arayüzde sahte ölçüm/PASS ve sessiz örnek veri yedeklerini kaldır; gerçek çıkarım hatalarını göster.
2. CAD yükleme ile eşleştirme arasında şemaya uygun tek veri akışı kur; gerçek STEP/PDF çiftiyle doğrula.
3. Sihirbaz ve araç çubuğunu aynı görünür durum modeline bağla; çift kanvas ve manuel unsur akışını test et.
4. Onaylanan planı gerçek emitter'a bağla; onaysız/eşleşmemiş plan için dışa aktarmayı engelle.
5. Paketleme, yerel varlıklar ve geliştirme başlangıcını düzelt; kullanıcı akışlarını gerçek Electron kabul testleriyle koru.

Her onarım, depodaki en fazla üç modül dosyası kuralına uygun ayrı kapsamda yapılmalı. Yeni IPC alanı gerekiyorsa önce merkezi şema ve codegen güncellenmeli; `ui/index.html` dosyasına yeni kod eklenmemeli.
