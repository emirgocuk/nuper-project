# Nuper Ortho — Büyük Mimari ve Fiziksel AI Yol Haritası (Faz 6 – Faz 25)

> **Amaç ve Vizyon:** YC RFS 2026 "Physical AI" vizyonu doğrultusunda, Nuper Ortho'yu CAD/B-Rep geometrisi, 2D teknik resimler, CMM kinematik yolu, metrolojik kalite denetimi ve kapalı döngü (closed-loop) CNC takım aşınma düzeltmesini otonom olarak icra eden **Dünyanın İlk Egemen Otonom Kalite Derleyicisi (Sovereign Autonomous Quality Compiler)** seviyesine taşımaktır.

---

## 1. Metodolojik Temeller (GitHub Kaynaklı Beceriler Sentezi)

Bu yol haritasındaki tüm fazlar, [memory-bank/github-founded-skills.md](github-founded-skills.md) belgesindeki 5 temel açık kaynak metodolojisinin kurumsal senteziyle yürütülür:

1. **`obra/superpowers` (Disiplinli Agentic SDLC & TDD):**
   - Her faz; Tasarım $\to$ İzole Geliştirme $\to$ Planlama $\to$ TDD (Önce Başarısız Test) $\to$ Kod İnceleme $\to$ Doğrulama adımlarıyla tamamlanır.
2. **`Graphify-Labs/graphify` (Deterministik Topolojik Bilgi Grafiği):**
   - Kod tabanı, IPC sözleşmeleri ve STEP B-Rep katı modelleri vektör veritabanına gerek duymadan yönlü çizge (DAG) olarak modellenir.
3. **`juliusbrussee/caveman` (Zero-Fluff ve Yüksek Verimli İkili Haberleşme):**
   - Ajan içi ve CMM telemetri haberleşmesinde metin tabanlı gürültü elenir; byte-byte hassas ikili (binary) arabellekler kullanılır.
4. **`DietrichGebert/ponytail` (Minimalizm ve YAGNI Kuralı):**
   - "En iyi kod hiç yazılmamış koddur." Erken soyutlamalar, gereksiz wrapper'lar ve kullanılmayan farazi özellikler yasaktır.
5. **`multica-ai/andrej-karpathy-skills` (LLM Hata Kalkanı):**
   - Sessiz varsayım yasaktır; belirsiz ölçülerde mühendis kararı istenir; hiçbir kod değişikliği çalışan diğer modüllere yan hasar (collateral damage) veremez.

---

## 2. Faz Matrisi ve Aşama Özeti

| Faz | Başlık | Temel Sorumluluk Alanı | Hedef Teknolojiler / Standartlar |
|---|---|---|---|
| **Faz 6** | B-Rep Topolojik Bilgi Grafiği | B-Rep CAD Çekirdeği | `ortho-brep`, OpenCASCADE, DAG Topoloji |
| **Faz 7** | ASME Y14.5 / ISO 1101 GD&T Motoru | Metroloji Semantik Kural Motoru | `ortho-ast`, ASME Y14.5-2018, MMC $\textcircled{\small M}$ |
| **Faz 8** | PTB Onaylı Fitting & GUM Belirsizlik | Matematiksel Fitting & Kalite | LSQ, Chebyshev (MZPL), GUM ISO 15530-3 |
| **Faz 9** | Zero-Copy Yüksek Hızlı IPC | Sistem Performansı | SharedArrayBuffer, FlatBuffers, 60+ FPS |
| **Faz 10** | 5-Eksen Kesintisiz Tarama Kinematiği | CMM Kinematik & Prob | Renishaw REVO-2, PH20, Kesintisiz Spline |
| **Faz 11** | Lazer Çizgi Sensörü & Scan-to-CAD | Hibrit Optik Metroloji | Lazer Çizgi Probu (LLP), ICP, Renkli Isı Haritası |
| **Faz 12** | MCR20 Prob Magazini Değişim Yolu | CMM Donanım HAL | Renishaw MCR20/FCR25, Otomatik Prob Değişimi |
| **Faz 13** | I++ DME v1.7 / v2.0 Kontrolcü Köprüsü | Fiziksel Makine Entegrasyonu | I++ DME Standart TCP/IP Soket Sürücüsü |
| **Faz 14** | Tam Gövde BVH + GJK/EPA Çarpışma Fiziği | Çarpışmasızlık Garantisi | `parry3d`, GJK/EPA, Fikstür & Mengene |
| **Faz 15** | Çoklu CNC G10 & SPC Aşınma Tahmini | Kapalı Döngü İmalat (Physical AI) | Fanuc, Siemens, Heidenhain, Haas, $C_{pk}$ |
| **Faz 16** | AS9102 Rev C FAI Resmi Rapor Motoru | Havacılık & Savunma Kalite | AS9102 Rev C Form 1, Form 2, Form 3 |
| **Faz 17** | Çoklu Parça Paletleme & Seri Teftiş | Seri İmalat İstasyonu | Palletizing, Nesting, Çoklu PCS Koordinat |
| **Faz 18** | Karpathy Güvenlik Kalkanı & Mühendis Paneli | AI Güvenilirliği (Human-in-Loop) | `NEEDS_REVIEW` Kuyruğu, Görsel Onay Kartı |
| **Faz 19** | Ponytail Kod Temizliği & VRAM Stres Testi | Stabilite & Kaynak Yönetimi | `SceneCleaner`, Bellek Regresyonu, Sıfır Ölü Kod |
| **Faz 20** | Superpowers Headless E2E Test Hattı | Sürekli Doğrulama (CI/CD) | Playwright, Sanal GPU, Headless Electron |
| **Faz 21** | Savunma Sanayii Air-Gapped Güvenlik Kalkanı | Siber Güvenlik & Savunma | FIPS 140-2, ITAR, RSA-4096, Dijital DMIS İmzası |
| **Faz 22** | Atölye Dokunmatik CMM Operatör Kokpiti | UI/UX & Atölye Şartları | High-Contrast, Touch-First ($>48\text{px}$) |
| **Faz 23** | Dinamik Termal Gradyan Simülasyonu | İleri Fiziksel Modelleme | Çok Noktalı Isıl Gradyan Enterpolasyonu |
| **Faz 24** | Tersine Mühendislik Scan-to-STEP | Geometrik Rekonstrüksiyon | As-Built CAD, Parametrik B-Rep İhracı |
| **Faz 25** | Otonom Kalite Derleyicisi 2.0 (Sovereign Loop) | Nihai Physical AI Otonomi | Sıfır Operatörlü Kapalı Döngü İmalat |

---

## 3. Detaylı Faz Planları ve Kabul Kriterleri

### FAZ 6: B-Rep Topolojik Bilgi Grafiği (`BRepGraphEngine`)
* **Amaç:** Regex veya gevşek metin taraması yerine STEP dosyasındaki `Solid -> Shell -> Face -> Wire -> Edge -> Vertex` hiyerarşisini deterministik yönlü çizgeye (DAG) dökmek.
* **Etkilenen Modüller:** `crates/ortho-brep/src/graph.rs`, `crates/ortho-brep/src/step_parser.rs`, `tools/extractor/brep_verifier.py`.
* **Kritik Algoritmalar:** Topolojik adjacency listesi, eş eksenli silindir kümeleme, paralel düzlem mesafeleri tablosu.
* **Kabul Kriteri:** 10142739 plaka ve karmaşık valf gövdesinde tüm delik, cep ve feder ilişkileri sıfır regex ile O(1) topolojik grafikten doğrulanır.

### FAZ 7: ASME Y14.5-2018 ve ISO 1101 GD&T Kural Motoru
* **Amaç:** Mevcut temel mesafe/çap kontrollerini 15 GD&T geometrik toleransının tamamını kapsayacak şekilde genişletmek.
* **Etkilenen Modüller:** `crates/ortho-ast/src/tolerance.rs`, `composite_gdandt.rs`, `ui/src/modules/inspection/utils/InspectionCardFormatter.ts`.
* **Kritik Algoritmalar:** Form, Yönelim, Konum, Profil ve Salgı değerlendirmesi; MMC ($\textcircled{\small M}$) ve LMC ($\textcircled{\small L}$) bonus tolerans matematiği, İzdüşürülmüş Tolerans Bölgesi ($\textcircled{\small P}$).
* **Kabul Kriteri:** 15 GD&T sembolünün tamamı için matematiksel sapma hesabı birim testlerle %100 yeşil doğrulanır.

### FAZ 8: PTB Onaylı Metrolojik Fitting ve GUM ISO 15530-3 Belirsizlik Motoru
* **Amaç:** Yalnızca Gauss LSQ değil; Chebyshev (Minimum Bölge), Maksimum İç Teğet ve Minimum Dış Çevrel fitting algoritmalarını devreye almak.
* **Etkilenen Modüller:** `crates/ortho-kinematics/src/fitting.rs`, `uncertainty.rs`, `tools/extractor/metrology_fitting.py`.
* **Kritik Algoritmalar:** MIC (delik MMC), MCC (mil MMC), MZPL (düzlem), MZCY (silindir); Genişletilmiş Belirsizlik ($U_{95}$, $k=2$) ve TUR oranı.
* **Kabul Kriteri:** PTB referans veri setlerinde fitting doğruluğu $< 0.0001\text{ mm}$ hata payıyla onaylanır.

### FAZ 9: Zero-Copy Yüksek Hızlı İkili IPC Protokolü
* **Amaç (Caveman İlkesi):** Yüksek frekanslı prob telemetrisinde metin tabanlı JSON serileştirme yükünü ortadan kaldırmak.
* **Etkilenen Modüller:** `crates/ortho-router/src/ipc.rs`, `electron-main.js`, `ui/src/modules/ipc/IpcClient.ts`.
* **Kritik Algoritmalar:** SharedArrayBuffer veya FlatBuffers tabanlı ikili telemetri paketi; 60-120 FPS sıfır GC duraklamalı veri akışı.
* **Kabul Kriteri:** 50.000 nokta aktarılırken UI ana iş parçacığı gecikmesi $< 2\text{ ms}$ olarak ölçülür.

### FAZ 10: Sürekli 5-Eksen Tarama Kinematiği (Renishaw REVO-2 & PH20)
* **Amaç:** İndeksli $7.5^\circ$ kafa yerine kesintisiz servo bilek açısıyla sürekli tarama (Scanning) yolu üretmek.
* **Etkilenen Modüller:** `crates/ortho-kinematics/src/ph10.rs`, `plan.rs`, `ui/src/modules/cad/utils/Ph10Kinematics.ts`.
* **Kritik Algoritmalar:** Yüzey temas normalini koruyan spiral ve çizgisel 5 eksen spline takım yolu enterpolasyonu.
* **Kabul Kriteri:** Silindir ve küre taramalarında açısal ivme sınırları aşılmadan pürüzsüz 5 eksen spline yolu oluşturulur.

### FAZ 11: Hibrit Metroloji: Optik ve Lazer Çizgi Sensörü (Scan-to-CAD)
* **Amaç:** Sac metal, plastik ve karmaşık kavisli yüzeyler için optik ve lazer çizgi tarama rotaları planlamak.
* **Etkilenen Modüller:** `crates/ortho-kinematics/src/laser.rs`, `crates/ortho-brep/src/surface.rs`.
* **Kritik Algoritmalar:** Görüş alanı (FOV), stand-off ($65\text{ mm}$), tarama şerit bindirmesi (%30); ICP ile nokta bulutu CAD hizalaması ve renkli sapma haritası.
* **Kabul Kriteri:** Lazer tarama yolu parça yüzeyini kör nokta bırakmadan kapsar ve renkli sapma haritası üretir.

### FAZ 12: Otomatik Prob Magazini Değişim Kinematiği (Renishaw MCR20 / FCR25)
* **Amaç:** Farklı unsurlar için tezgâhtaki prob değiştirme rafına (rack) çarpışmasız gidiş-dönüş rotası üretmek.
* **Etkilenen Modüller:** `crates/ortho-router/src/stylus.rs`, `hal.rs`, `ui/src/modules/cad/utils/StylusSelector.ts`.
* **Kritik Algoritmalar:** Magazin portu yaklaşma, yuvaya eksenel iniş, kilit açma/bırakma, yeni prob alma ve emniyet tavanına çıkış makroları.
* **Kabul Kriteri:** Prob değiştirme döngüsü simülasyonda görselleştirilir ve magazin sınırlarına bindirme olmadan tamamlanır.

### FAZ 13: I++ DME v1.7 / v2.0 Endüstriyel CMM Denetleyici Köprüsü
* **Amaç:** Nuper Ortho'nun fiziksel CMM kontrol ünitelerine doğrudan TCP/IP üzerinden komut göndermesini sağlamak.
* **Etkilenen Modüller:** `crates/ortho-router/src/ipp.rs`, `hal.rs`.
* **Kritik Algoritmalar:** I++ DME istemci protokolü (`StartSession`, `GoTo`, `PtMeas`, `GetDMEVersion`).
* **Kabul Kriteri:** Sanal I++ DME sunucusuna bağlanılarak teftiş planı uzaktan başarıyla icra edilir.

### FAZ 14: Tam Gövde BVH + GJK/EPA Çarpışma Fiziği ve Çoklu Fikstür
* **Amaç:** Parça, fikstür pabuçları, mengene ve CMM hareketli köprüsünü kapsayan tam gövde çarpışma denetimi.
* **Etkilenen Modüller:** `crates/ortho-router/src/collision.rs`, `clearance.rs`, `ui/src/modules/cad/utils/SetupPrep.ts`.
* **Kritik Algoritmalar:** Bounding Volume Hierarchy (BVH) geniş fazı; Minkowski farkı GJK/EPA dar fazı ($0.1\text{ mm}$ hassasiyet).
* **Kabul Kriteri:** Pabuç veya mengene üzerinden geçen tüm geçersiz yollar anında tespit edilip alternatif bypass rotası üretilir.

### FAZ 15: Çoklu CNC Kapalı Döngü Desteği ve SPC Aşınma Tahmini
* **Amaç:** Fanuc/Siemens'e ek olarak Heidenhain, Haas ve Mazak tezgahlarına kompanzasyon aktarmak ve aşınma trendini önceden tahmin etmek.
* **Etkilenen Modüller:** `crates/ortho-emitter/src/closed_loop.rs`, `ui/src/modules/inspection/utils/CodeSnippetGenerator.ts`.
* **Kritik Algoritmalar:** $C_{pk}$ süreç yeterlilik analizi; $N$ parçalık regresyon analizi ile takım aşınma eğilimini tahmin edip dinamik ofset basma.
* **Kabul Kriteri:** 10 simüle edilmiş parçanın aşınma trendi üzerinden 11. parça tolerans dışına çıkmadan önce otomatik ofset üretilir.

### FAZ 16: AS9102 Rev C FAI Resmi İlk Numune Denetim Raporu Motoru
* **Amaç:** Havacılık ve savunma sanayiinde zorunlu resmi AS9102 formatında rapor üretmek.
* **Etkilenen Modüller:** `tools/extractor/title_block.py`, `ui/src/modules/inspection/utils/InspectionTable.ts`.
* **Kritik Algoritmalar:** Form 1 (Parça İntibakı), Form 2 (İmalat Süreci İntibakı) ve Form 3 (Karakteristik Ölçüm Tablosu) otomatik derleyicisi.
* **Kabul Kriteri:** 38 unsurlu plaka için resmi AS9102 Rev C Form 3 tablosu eksiksiz doldurularak PDF/Excel formatında dışa aktarılır.

### FAZ 17: Çoklu Parça Paletleme, Yuvalama (Nesting) ve Seri Teftiş
* **Amaç:** CMM tablasına bağlanan çoklu parçaları ($N_1, N_2, \dots, N_k$) tek kurulumda sırayla ölçmek.
* **Etkilenen Modüller:** `crates/ortho-ast/src/alignment.rs`, `ui/src/modules/cad/CADViewer.ts`.
* **Kritik Algoritmalar:** Çoklu PCS koordinat sistemi yönetimi; parçalar arası güvenli tavan intikal optimizasyonu.
* **Kabul Kriteri:** 4'lü bir fikstürde parçalar arası emniyet tavanına çıkarak kesintisiz teftiş rotası icra edilir.

### FAZ 18: Karpathy Güvenlik Kalkanı: Belirsizlik Karar Paneli
* **Amaç (Karpathy İlkesi):** AI veya OCR bir ölçüyü net okuyamadığında sessizce varsayım yapmasını engellemek.
* **Etkilenen Modüller:** `crates/ortho-ai/src/guardrail.rs`, `ui/src/modules/inspection/utils/FeatureDefinitionModal.ts`.
* **Kritik Algoritmalar:** Güven skoru $<\%80$ olan ölçüleri `NEEDS_REVIEW` kuyruğuna alma; split-screen onay arayüzü.
* **Kabul Kriteri:** Şüpheli bir ölçüde sistem otomatik işlem yapmayı durdurur; mühendis onay verene kadar CMM kodu derlenmez.

### FAZ 19: Ponytail Kod Temizliği ve VRAM Stres Testi
* **Amaç (Ponytail İlkesi):** Kullanılmayan prototipleri, eski mock dallarını ve bellek sızıntılarını temizlemek.
* **Etkilenen Modüller:** `ui/src/modules/cad/utils/SceneCleaner.ts`, tüm modüller.
* **Kritik Algoritmalar:** WebGL context ve VRAM profil analizi; 100 ardışık model yükleme döngüsü stres testi.
* **Kabul Kriteri:** 100 model değişiminden sonra bellek artışı $< 5\text{ MB}$ seviyesinde sabit kalır.

### FAZ 20: Superpowers Metodolojisi ile Uçtan Uca Headless E2E Test Hattı
* **Amaç (Superpowers İlkesi):** Gerçek kullanıcı akışını sanal GPU ve Electron test motoruyla her commit'te doğrulamak.
* **Etkilenen Modüller:** `tests/e2e/`, `.github/workflows/ci.yml`.
* **Kritik Algoritmalar:** Playwright ile dosya yükleme $\to$ balonlama $\to$ 3D yol derleme $\to$ simülasyon akış testi.
* **Kabul Kriteri:** E2E test hattı yerel ve CI ortamında sıfır insan müdahalesiyle %100 yeşil tamamlanır.

### FAZ 21: Savunma Sanayii Air-Gapped Güvenlik Kalkanı ve Dijital İmzalı DMIS
* **Amaç:** Ağ bağlantısız askeri tesislerde kod bütünlüğünü ve lisans otoritesini korumak.
* **Etkilenen Modüller:** `crates/ortho-license/src/lib.rs`, `crates/ortho-emitter/src/audit.rs`.
* **Kritik Algoritmalar:** TPM 2.0 / Donanım Parmak İzi, RSA-4096 lisans otoritesi, SHA-256 dijital DMIS filigranı.
* **Kabul Kriteri:** Değiştirilmiş 1 baytlık bir DMIS dosyasında lisans ve imza kalkanı anında kırmızı alarm üretir.

### FAZ 22: Atölye Tipi Yüksek Kontrast CMM Operatör Kokpiti
* **Amaç:** Atölye ışığı ve toz altında endüstriyel dokunmatik ekran kullanımını kolaylaştırmak.
* **Etkilenen Modüller:** `ui/src/modules/core/`, `ui/index.html`.
* **Kritik Algoritmalar:** High-Contrast UI teması, $>48\text{px}$ dokunmatik butonlar, devasa PASS/FAIL göstergeleri.
* **Kabul Kriteri:** 10 inçlik bir endüstriyel panelde tüm butonlar dokunmatik dostu olarak doğrulanır.

### FAZ 23: Dinamik Termal Gradyan Simülasyonu
* **Amaç:** Büyük parçalarda homojen olmayan sıcaklık farklarını yerel olarak kompanze etmek.
* **Etkilenen Modüller:** `crates/ortho-emitter/src/closed_loop.rs`, `crates/ortho-kinematics/src/fitting.rs`.
* **Kritik Algoritmalar:** 3B sıcaklık alanı enterpolasyonu; her temas noktası için yerel genleşme telafisi hesabı.
* **Kabul Kriteri:** 1000 mm'lik büyük gövdede gradyan kompanzasyonu ile ölçüm hatası $< 2\ \mu\text{m}$ seviyesine indirilir.

### FAZ 24: Tersine Mühendislik ve Parametrik B-Rep Rekonstrüksiyonu (Scan-to-STEP)
* **Amaç:** İmal edilen parçanın ölçüm bulutundan As-Built nominal STEP modeli üretmek.
* **Etkilenen Modüller:** `crates/ortho-brep/src/surface.rs`, `tools/extractor/brep_verifier.py`.
* **Kritik Algoritmalar:** Ölçülen delik merkezleri ve yüzey sapmalarından parametrik B-Rep geometrisi rekonstrüksiyonu.
* **Kabul Kriteri:** Ölçüm bulutundan üretilen As-Built STEP modeli OpenCASCADE ile hatasız açılır.

### FAZ 25: Otonom Kalite Derleyicisi 2.0 (Sovereign Autonomous Loop)
* **Amaç (Nihai Vizyon):** CMM teftişi, kalite analizi ve CNC takım düzeltmesini tek bir otonom kapalı döngüde birleştirmek.
* **Etkilenen Modüller:** Tüm sistem modülleri ve I++ DME / CNC ağ arayüzü.
* **Kritik Algoritmalar:** CMM ölçümü $\to$ sapma analizi $\to$ CNC ofset enjeksiyonu $\to$ yeni parça işleme otonom döngüsü.
* **Kabul Kriteri:** 5 ardışık parça simülasyonunda sapmaların 0'a yakınsayarak $C_{pk} > 1.67$ standardına ulaştığı kanıtlanır.
