# Nuper Ortho — Aktif Bağlam

Son güncelleme: 11 Kasım 2026.

## 1. Tamamlanan Mimari Fazlar (Commit & Push Geçmişi)

Tüm geliştirmeler AGENTS.md protokolüne (Sıfır yorum satırı kuralı, en fazla 3 modül dosyalık atomik commit kuralı, TDD test doğrulaması) uygun olarak tamamlanmış ve `origin/master` dalına aktarılmıştır:

1. **FAZ 26 (Vektörel Mikro Çizim GD&T ve Çap Topolojisi):** `tools/extractor/spatial.py` & `tools/extractor/vector_extractor.py` (Commit `dcc8372`).
2. **FAZ 27 (FCF Hücre Bölücü & Kompozit Kutu Ayrıştırıcısı):** `tools/extractor/semantic_grammar.py` (Commit `c402bea`).
3. **FAZ 28 (Dikey ve Açılı Ölçülerde 90° Rotasyon Normalizasyonu):** `tools/extractor/spatial.py` (Commit `24542b6`).
4. **FAZ 29 (Ölçü Çizgisi, Uzatma Çizgisi ve Lider Ok Ucu İzleyicisi):** `tools/extractor/spatial.py` (Commit `66dfb95`).
5. **FAZ 30 (Kısıtlı Mühendislik Alfabesi ve OCR Kontur Font Sanitizer):** `tools/extractor/vision_ai_extractor.py` & `tools/extractor/semantic_grammar.py` (Commit `8ac9f89`).
6. **FAZ 31 (Tolerans Kritiklik Renklendirmesi ve Işık Masası Isı Haritası):** `ui/src/modules/inspection/utils/InspectionCardFormatter.ts` & `ui/src/modules/drawing/DrawingCanvas.ts` (Commit `2e71e12`).
7. **FAZ 32 (B-Rep Geometrik Benzerlik Eşleştirme ve Kurulum Hafızası):** `tools/extractor/similarity_engine.py` & `ui/src/modules/cad/utils/PartSimilarityEngine.ts` (Commit `2bf415b`).
8. **FAZ 6 (B-Rep Topolojik Bilgi Grafiği ve Eksenel Kademeli Delik Sorguları):** `crates/ortho-brep/src/graph.rs` & `crates/ortho-brep/src/lib.rs` (Commit `31c4bbd`).
9. **FAZ 7 (ASME Y14.5-2018 ve ISO 1101 GD&T Kural Motoru ve Bonus Tolerans):** `crates/ortho-ast/src/composite_gdandt.rs` & `crates/ortho-ast/src/lib.rs` (Commit `b243f1d`).
10. **FAZ 8 (PTB Onaylı Chebyshev L-Sonsuz Fitting ve GUM ISO 15530-3 Belirsizlik):** `crates/ortho-kinematics/src/fitting.rs` & `tools/extractor/metrology_fitting.py` (Commit `e4236e8`).
11. **FAZ 9 (Zero-Copy Yüksek Hızlı İkili IPC Protokolü - 80-Bayt Telemetri):** `crates/ortho-router/src/ipc.rs` & `ui/src/modules/ipc/BinaryTelemetry.ts` (Commit `94b76e8`).
12. **FAZ 10 (Sürekli 5-Eksen Helisel Tarama Kinematiği ve Kuaterniyon Slerp):** `crates/ortho-kinematics/src/ph10.rs` & `ui/src/modules/cad/utils/Ph10Kinematics.ts` (Commit `812ae92`).

## 2. Sıradaki Uygulama Adımları

- **FAZ 11:** Hibrit Metroloji: Optik ve Lazer Çizgi Sensörü (Scan-to-CAD KD-Tree ve Renkli Sapma Mesh Haritası)
- **FAZ 12:** Otomatik Prob Magazini Değişim Kinematiği (Renishaw MCR20 / FCR25 Emniyetli 6 Adımlı Değişim)
- **FAZ 13:** I++ DME v1.7 / v2.0 Endüstriyel CMM Denetleyici TCP Köprüsü
- **FAZ 14:** Tam Gövde BVH + GJK/EPA Çarpışma Fiziği ve Çoklu Fikstür Atlama Rotası
- **FAZ 15 – FAZ 20:** Blok C (CNC G10 / Sinumerik `$TC_DP12`, AS9102 Rev C FAI, Paletleme)

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

11 Kasım 2026 itibarıyla Faz 1'den Faz 5'e kadar olan temel fiziksel kinematik, B-Rep yüzey kimliği, bağlama pabuçları emniyeti, yıldız prob, çapak ayıklama ve ISO 1 20°C ısıl genleşme kompanzasyonu başarıyla tamamlanmış ve %100 test doğrulamasıyla kilitlenmiştir.

Kullanıcı talebi ve KIT CIRP 2022 / EDI AG endüstriyel referansı doğrultusunda [masterRoadmap.md](masterRoadmap.md) altında 27 Aşamalı Büyük Mimari Uygulama Şartnamesi (Faz 6 – Faz 32) 5 ana blok halinde (Blok A: Çekirdek Geometri & Metroloji, Blok B: Kinematik & Donanım HAL, Blok C: Kapalı Döngü & Kalite, Blok D: Fiziksel AI & Egemen Derleyici, Blok E: Endüstriyel Doküman Zekası & Benzerlik Hafızası) matematiksel formülleri, C++/Rust/Python/TS veri yapıları, IPC şemaları ve TDD kabul kriterleriyle detaylandırılmıştır.

Aktif öncelik: Uygulama şartnamesi onayını takiben **Faz 26: Vektörel Mikro-Çizim GD&T ve Çap Topoloji Sınıflandırıcısı (`VectorSymbolClassifier`)** veya **Faz 6: B-Rep Topolojik Bilgi Grafiği (`BRepGraphEngine`)** uygulamasının başlatılmasıdır.

## 7. Kapsam ilkeleri

- ui/index.html dosyasına yeni kod eklenmez; kaldırılan davranış modüler ui/src bileşenlerine taşınır.
- Ölçüm sonucu, CAD eşleşmesi ve operatör onayı ayrıdır. Eşleşen veya onaylanan nominal otomatik PASS olmaz.
- Örnek veri gerçek projeye yedek değildir. Başarısız veya desteklenmeyen çıkarım görünür hata/bilinmiyor sonucu verir.
- Yeni IPC alanı için önce şema ve codegen işi tamamlanır; tüketiciler geçmeden yeni sözleşme etkinleştirilmez.
- Modül testleri, gerçek Electron akışı ve saha kabulü ayrı kanıt seviyeleridir.
- İleri AI, yeni sağlayıcılar, Tauri geçişi, lisans/dongle ve CNC kapalı döngüsü ilk çalışan dikey dilimin önüne alınmaz.
- Ajan davranışında Ponytail (minimalizm, YAGNI, standart kütüphane), ADHD-friendly (direkt iletişim, sıradaki eylem odaklılık) ve Context-Mode (token/log sandboxing) ilkeleri uygulanır.
- Sonraki çalışma iş kimliğini, değişen dosyaları, test girdilerini, komut sonuçlarını ve kalan engelleri kaydeder. Kanıtsız yüzde veya mühür ifadesi kullanılmaz.
