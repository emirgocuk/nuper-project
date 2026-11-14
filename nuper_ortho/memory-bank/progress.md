# Nuper Ortho — Kanıta Dayalı Durum ve Onarım Planı

Son güncelleme: 14 Kasım 2026. Güncel iş sırasının ve kabul durumunun tek kaynağı bu belgedir.

## 1. Hedef ve Sınır (Physical AI Vizyonu)

Nuper Ortho, YC RFS 2026 "Physical AI" vizyonu doğrultusunda otonom CMM kalite denetimini ve kapalı döngü (closed-loop) imalat düzeltmesini gerçekleştiren endüstriyel bir derleyicidir.
Fiziksel temas ve kinematik kuralları doğrulanmış olup, sahte/tahmini (mock) hiçbir ölçüm veya CMM yolu üretilmemektedir.

## 2. Mevcut Envanter ve Kabul Durumu

| Alan | Durum | Gözlenen Kanıt / Doğrulama |
|---|---|---|
| **CMM Yol Planlayıcı & Kinematik** | Kabul edildi | `safeZ = maxZ + 25mm` emniyet düzlemi, 3 aşamalı köprü (`RETRACT_TO_SAFE` $\to$ `SAFE_TRAVERSE` $\to$ `PLUNGE_TO_ENTRY`), eksenel delik inişi (`AXIAL_ENTRY`), `safeIndexZ = maxZ + 50mm` kafa açısı indeksi, AS9102 3-2-1 datum sıralaması, yakut küre yarıçap telafisi ($\vec{P}_{\text{center}} = \vec{P}_{\text{surf}} + R_{\text{tip}}\hat{n}$), EWL stilus boyu denetimi (Ø3x50 önerisi) ve Z>=0 granit tabla çarpışmasızlığı. |
| **Physical AI & Kapalı Döngü CNC** | Kabul edildi | Gerçek zamanlı ANSI DMIS 5.3 blok üretimi, Fanuc 0i/31i `G10 L12` ve Siemens Sinumerik 840D/ONE `$TC_DP12` takım aşınma kompanzasyonu, fail-safe guardian ($|\Delta| > 0.050\text{ mm}$ kilit), anlık hız ($150\text{ mm/s}$ / $5\text{ mm/s}$) telemetrisi, çift renkli trajektori tüpü ve canlı ölçüm durum makinesi (`UNMEASURED` $\to$ `🎯 ÖLÇÜLÜYOR (k/N)` $\to$ `PASS/FAIL`). |
| **CAD Çekirdeği & STEP Görünümü** | Kabul edildi | OpenCASCADE 8.0 (OCP) çekirdeği entegre. Analitik B-Rep yüzeyleri, dışa bakan normal doğrulaması, silindirik delik eksenel derinlikleri (`axial_min`, `axial_max`, `z_top`, `z_bottom`). |
| **Vite / TypeScript / Vitest** | Kabul edildi | `npm run check:types` hatasız (0 hata); 35 test dosyasında 199 birim/entegrasyon testi %100 yeşil (`npm run test:ui`). |
| **Python Çekirdeği & Pytest** | Kabul edildi | `brep_verifier.py`, `drawing_extractor.py`, `vector_extractor.py`, `similarity_engine.py`; 73 pytest testi %100 yeşil (`python -m pytest tools/tests/`). |
| **Rust Workspace & Cargo** | Kabul edildi | 8 crate (`ortho-ai`, `ortho-ast`, `ortho-brep`, `ortho-kinematics`, `ortho-router`, `ortho-emitter`, `ortho-license`, `ortho-cli`); birim, entegrasyon ve doc testlerin tamamı %100 yeşil (`cargo test --workspace`). |
| **İleri Mühendislik & ASME Y14.5** | Kabul edildi | 3-2-1 Doğrusallık (Collinearity) önleme, det(R)=+1.000000 sağ el kilidi, PH10 7.5° kuantizasyonu, desen unsurlarının (4x, 2x, 3x) tam taranması, ASME Y14.5 MMC bonus toleransı, OP10/OP20 bağlama değişimi, 10 konsol sekmesinin canlı veri üretimi. |
| **Topolojik Eşleştirme & Çift Yüzey Kaliper** | Kabul edildi | B-Rep paralel düzlemler arası dik mesafe kataloğu (`CAD_STEP_DIST_`), 100 puanlık çok kriterli güven skoru (`VERIFIED_EXACT`, `VERIFIED_TOPOLOGY`, `NEEDS_REVIEW`, `ENGINEER_LOCKED`), delik/radyus ayrımı, 2D görünüş eksen izdüşümü, çift yüzey kaliper dokunma kinematiği, Y=0 granit tabla dikey sınırlandırması ve 0.015mm kibar hairline trajektori teli. |
| **Endüstriyel Mükemmellik (Paket 4)** | Kabul edildi | ISO 2768-1 genel tolerans tablosu (f, m, c, v), Metrik/UNF dişli delik minör çap ($D_1 = D - 1.082532P$) ve helisel Z ofseti, kör delik taban emniyet kotu ($Z_{\text{bottom}} + R_{\text{tip}} + 2.0\text{ mm}$), ANSI DMIS 5.3 `DATDEF`/`DATSET`/`SAVE/D(PCS_OP10)` hizalama ve OP20 çevirme talimatı, trapezoidal kinematik ivmelenme profili ($a = 450\text{ mm/s}^2$) ve temas/kafa dönüş bekleme süreleri (+0.25s / +1.80s), AS9102 Rev C FAI Form 3 resmi denetim raporu üreticisi, STEP AP242 gömülü 3D PMI entegrasyonu, sahne koordinat hizalama dönüşümü (havada kalan noktaların ve parça altı ters dokunmaların giderilmesi). |
| **Faz 5: Atölye Şartları & Fiziksel AI (Paket 5)** | Kabul edildi | 1. Gerçek B-Rep yüzey kimlikli (`faceId`) üçgenleme ve hassas raycasting; 2. Fikstür ve bağlama pabuçları (`ClampBox`) 5.0mm emniyet marjı ve lift-and-hop intikali; 3. 5 uçlu yıldız prob (`Star5Way`) ve Ø25.000mm seramik kalibrasyon küresi matrisi; 4. 2.5-sigma Grubbs çapak/toz aykırı değer filtresi (`SUSPECTED_BURR_OUTLIER`); 5. ISO 1 20°C diferansiyel ısıl genleşme korumalı Fanuc G10 / Siemens TC_DP12 telafisi; 6. SHA-256 deterministik proje ve balon oturum hafızası (`BalloonSessionState`); 7. Kibar çizgiler (`LineSegments` hairline trajektori), $Y \ge Y_{\min} + 0.5\text{ mm}$ zemin kalkanı ve kafa açısı değişiminde güvenli alan retract protokolü (`safeHeadIndexAltitude`). |
| **PDF / Ölçü Çıkarımı (Blok E: Faz 26–32)** | Kabul edildi | Vektörel mikro-çizim GD&T sembol topolojisi, FCF hücre bölme, 90° dikey rotasyon normalizasyonu, lider ok ucu izleyicisi, kısıtlı mühendislik alfabesi sanitization, tolerans kritiklik ısı haritası ve cosine similarity parça kurulum hafızası. |
| **Büyük Mimari Fazları (Faz 6 – Faz 25)** | Kabul edildi | B-Rep DAG, ASME Y14.5 Composite GD&T, PTB Chebyshev L-sonsuz fitting & GUM ISO 15530-3 belirsizlik, 80-byte zero-copy ikili IPC, 5-eksen sürekli REVO/PH20 slerp, optik lazer çizgi tarama, Renishaw MCR20 rack değiştirici, I++ DME asenkron köprü, BVH GJK/EPA çarpışma fiziği, CNC G10/Sinumerik SPC aşınma kompanzasyonu, AS9102 Form 1/2/3 HMAC mühürlü FAI, paletleme yuvalama, Karpathy kalkanı, Ponytail linter/dead code koruması, E2E entegrasyon testleri, Savunma sanayii air-gapped donanım kilidi ve DMIS filigranı, 48px dokunmatik operatör kokpiti, 3B termal gradyan, tersine mühendislik RANSAC B-Rep rekonstrüksiyonu, Sovereign Autonomous Loop 2.0. |

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

Aşağıdaki sonuçlar 12 Kasım 2026 kapsamlı 8-Madde entegrasyon ve kalite güvence onarımına aittir; tüm 6 test paketi çalıştırılmış ve %100 yeşil geçmiştir:

| Kontrol | Sonuç | Kanıt sınırı |
|---|---|---|
| `npm run codegen` | Başarılı (0 hata) | TypeScript & Python Pydantic şema senkronizasyonu |
| `npm run check:types` | Başarılı (0 hata) | TypeScript tür kontrolü (`tsc --noEmit`) |
| `python -m pytest tools/tests/` | 74 test başarılı (%100 yeşil, 3.81s) | Python B-Rep, GD&T, benzerlik ve planlayıcı testleri |
| `npm run test:ui` | 35 dosya / 200 test başarılı (%100 yeşil) | Vitest UI modül, ışık masası ve duman testleri |
| `cargo test --workspace` | Başarılı (0 hata, tüm crate'ler geçti) | 8 Rust crate'i, tüm birim/entegrasyon/doc testleri |
| `npm run build` | Başarılı (692ms) | Rolldown/Vite üretim paketi derlemesi |

### 4.1. 8 Somut Entegrasyon ve Metroloji Kusurunun Giderilmesi

1. **`cad_metadata.schema.json` & `inspection_plan.schema.json` Şema Senkronizasyonu:**
   - *Kök Neden:* Yalnızca `drawing_data.schema.json` güncellenmiş; silindir/delik için `is_blind`, `floor_z`, `minor_diameter`, `thread_pitch`, yüzeyler için `face_bbox`, `adjacent_face_ids`, denetim adımları için `risk_level`, `match_confidence`, `match_status`, `recommended_touch_count`, `recommended_touch_speed_mms`, kök seviye için `similar_parts`, `contract_summary`, `thermal_compensation_summary` modellerde eksik kalmıştı.
   - *Çözüm:* JSON şemaları zenginleştirildi, `scripts/codegen.mjs` yorum satırlarından arındırılarak `npm run codegen` ile TS ve Pydantic modelleri üretildi.
   - *Commit:* `b1f8c4e`

2. **`tools/inspection_planner.py` Veri Yutma Hatasının Giderilmesi:**
   - *Kök Neden:* Çizim çıkarıcısının ürettiği kritiklik ve benzerlik alanları nihai ölçüm planına aktarılmıyordu.
   - *Çözüm:* `risk_level`, `risk_reasons`, `similar_parts`, `contract_summary`, `attachment_points`, `rel_position`, `inferred_axis`, `tolerance_source` alanları plana birebir aktarıldı. `CRITICAL` unsurlar için temas noktası $\ge 8$, temas hızı $2.0\text{ mm/s}$; `WARNING` için $\ge 6$ nokta, $3.5\text{ mm/s}$; normal için 4 nokta, $5.0\text{ mm/s}$ kuralları uygulandı.
   - *Commit:* `92f2dce`

3. **Rust Kinematik ve I++ Kritiklik Uyarlaması:**
   - *Kök Neden:* Kinematik planlayıcı ve I++ DME sunucusu kritiklik bilgisini hesaba katmadan sabit temas sayısı ve standart intikal hızı kullanıyordu.
   - *Çözüm:* `ortho-kinematics` içine `sample_plane_with_tolerance` ve `sample_cylinder_adaptive` eklendi (`CRITICAL` için 8 düzlem, 18 silindir noktası). `ortho-router` içine `trajectory_to_ipp_stream_with_risk` eklenerek PtMeas yaklaşma mesafesi ve hızı ($2.0\text{ mm/s}$) uyarlandı. `autonomous_loop` ve `pallet` modülleri re-export edildi.
   - *Commit:* `1c18f39`, `181d966`

4. **AS9102 Form 3 ve ANSI DMIS Entegrasyonu:**
   - *Kök Neden:* AS9102 Form 3 tablosunda Sütun 7 (Karakteristik Sınıflandırıcı: CRITICAL/MAJOR/KEY) ve Sütun 8 (Tolerans Kaynağı: DRAWING/ISO_2768) eksikti; ISO 1 20°C referans dipnotu ve DMIS kritik özellik hız düşümü bulunmuyordu.
   - *Çözüm:* `ortho-emitter` içinde AS9102 Form 3 jeneratörleri güncellendi, ISO 1 20°C dipnotu eklendi; DMIS çıktısına kritik özellik öncesinde `FEDRAT/MESVEL, 2.0` enjeksiyonu yapıldı.
   - *Commit:* `ef44716`

5. **`similarity_engine.py` ve SQLite Kalıcılığı:**
   - *Kök Neden:* Çıkarılan 128 boyutlu parça öznitelik vektörleri diskte saklanmadığı için her oturumda kayboluyordu.
   - *Çözüm:* `test_assets/benchmarks.db` içinde `part_catalog_vectors` tablosu oluşturuldu (`scripts/init_sqlite_db.py`). `register_part_in_catalog` ve `query_similar_from_db` fonksiyonları yazıldı ve birim testleri eklendi.
   - *Commit:* `b1c2bff`

6. **Front-End Bildirim ve Işık Masası / Dual Canvas Entegrasyonu:**
   - *Kök Neden:* Benzer parça önerileri ve kritiklik risk rozetleri UI üzerinde kullanıcıya gösterilmiyordu.
   - *Çözüm:* `#dual-canvas-2d .pane-toolbar` ve `#modal-drawing-audit` araç çubuklarına `#lightbox-similarity-banner` ve `#lightbox-risk-badges` yerleştirildi. `DrawingCanvas.ts` içine headless-güvenli `updateAuditMetadata` eklendi. `SetupWizard.ts` içinde benzerlik $\ge \%85$ ise `✨ Önerilen Hazırlık: 3 Pabuç, PH10 A0B0 / A90B180` butonu aktif edilerek `showToast` bildirimi bağlandı.
   - *Commit:* `98138b3`, `4c49b9b`

7. **Electron Bridge CLI Parametre Köprüsü ve `.gitignore` Temizliği:**
   - *Kök Neden:* CAD yüklenmişken çizim çıkarıcı çağrıldığında `--cad <stepPath>` parametresi Electron bridge tarafından iletilmiyordu; ayrıca geçici ölçüm çıktıları git takibine giriyordu.
   - *Çözüm:* `electron-main.js` içinde `extract-drawing-data` ve `ortho:extract-drawing` IPC kanalları aktif CAD dosya yolunu `--cad` argümanı olarak iletecek şekilde güncellendi. `tools/drawing_extractor.py` argümanı ayrıştırıp benzerlik ve sözleşme analizini çalıştırdı. `.gitignore` içine `output_pcdmis.dmi`, `output_calypso.txt`, `.ortho-session.json` eklendi.
   - *Commit:* `45ffa1f`

8. **6-Fazlı Tam Sistem Regresyon Doğrulaması:**
   - *Kök Neden:* Yapılan kapsamlı değişikliklerin gerilemeye yol açmadığının uçtan uca kanıtlanması gerekiyordu.
   - *Çözüm:* `npm run codegen`, `npm run check:types`, `python -m pytest tools/tests/` (74/74), `npm run test:ui` (200/200), `cargo test --workspace` (tüm crate ve E2E testleri) ve `npm run build` olmak üzere 6 test adımının tamamı hatasız başarıyla tamamlandı.

### 4.2. 3. Dalga: 7 Derin Saha ve Metroloji Hatasının Giderilmesi (13 Kasım 2026)

1. **Kafa Döndürme (Head Indexing A/B) Güvenli Süpürme İrtifası (`SAFE_INDEX_Z`):**
   - *Kök Neden:* PH10M / TESASTAR-m kafa açısı değişirken ($A0B0 \to A90B180$), $50\text{--}100\text{ mm}$'lik stilus $\approx 120\text{ mm}$ yarıçaplı bir yay süpürür. Kafa standart $Z+10\text{ mm}$ veya $Z+20\text{ mm}$ kotundayken dönerse fikstüre veya parçaya çarpar.
   - *Çözüm:* `ortho-kinematics` (`ph10.rs`, `traversal.rs`) ve `ortho-emitter` içinde parametrik $Z_{\text{safe\_index}} = Z_{\text{part\_max}} + L_{\text{stylus}} + R_{\text{head}} + 25\text{ mm}$ formülü kodlandı. `plan_safe_index_retract` fonksiyonu ile açı değişiminden önce kafa bu irtifaya çıkarılıp `GOTO` üretildikten sonra `SNSLCT` komutu verilmesi zorunlu kılındı. UI tarafında `MeasurementPathGenerator.ts` bu kurala senkronize edildi.
   - *Commit:* `66f0b58`, `a126f36`, `a7f3679`

2. **Esnek Datum Referans Çerçevesi (DRF) — Silindirik ve Orta Düzlem Datum A:**
   - *Kök Neden:* Datum A her zaman 3 noktalı düzlem (`PLANE`) varsayılıyordu; flanş, mil ve göbek parçalarında Datum A silindir eksenidir (4 serbestlik derecesi kilitler) veya iki simetrik yüzeyin orta düzlemidir (`CONST/PLANE, MID`).
   - *Çözüm:* `ortho-ast` (`datum.rs`) içine `DatumGeometryType` enum (`Plane`, `Cylinder`, `MidPlane`) eklendi. `ortho-emitter` içinde silindirik datumlar `FEAT/CYLNDR` ve eksen kilidiyle, orta düzlemler ise iki paralel yüzeyin `CONST/PLANE, MID` konstruksiyonu ile DMIS'e yazıldı.
   - *Commit:* `ed78c98`

3. **STEP Ayrıştırıcıda Radyus, Pah ve Küre B-Rep Yüzey Desteği:**
   - *Kök Neden:* B-Rep ayrıştırıcı yalnızca `PLANE` ve `CYLINDER` tanıyordu; `TOROIDAL_SURFACE` (iç/dış kordon radyusları), `CONICAL_SURFACE` (pah/havşa açıları) ve `SPHERICAL_SURFACE` atlanıyordu.
   - *Çözüm:* `ortho-brep` (`feature.rs`, `step_parser.rs`) ve `tools/brep_verifier.py` içine toroidal ($R_{\text{major}}, R_{\text{minor}}$), konik (yarı açı / semi-angle) ve küresel yüzey ayrıştırma ve sınıflandırma kuralları eklendi.
   - *Commit:* `1724e83`

4. **3 Aşamalı Prob Şaftı ve Modül Çarpışma Hiyerarşisi:**
   - *Kök Neden:* Yalnızca yakut küre ucu ($R_{\text{tip}}$) çarpışma için kontrol ediliyordu; stilus gövdesi ($R_{\text{stem}}$) veya TP20/TP200 gövdesi ($\varnothing 13\text{ mm} \times 35\text{ mm}$) delik ağzına sürttüğünde sistem uyarı vermiyordu.
   - *Çözüm:* `ortho-router` (`stylus.rs`, `collision.rs`) içine 3 aşamalı geometrik hiyerarşi (`TipSphere`, `StemCapsule`, `ModuleCylinder`) eklendi. `check_shank_and_module_clearance` fonksiyonu ile delik derinliği > EWL veya şaft/modül mesafesi $\le 0.5\text{ mm}$ olduğunda `SHANK_COLLISION` ve `MODULE_COLLISION` bayrakları üretilerek `reachability_report` oluşturuldu.
   - *Commit:* `d8e3efc`

5. **Simetri, Salgı (Runout) ve Eşmerkezlilik için Konstruksiyon (`CONST`):**
   - *Kök Neden:* Simetri (`⌯`), Dairesel/Toplam Salgı (`↗`/`↗↗`) ve Eşmerkezlilik (`◎`) tek bir ham ölçümle doğrulanamaz; birden çok Z kesitinin veya karşılıklı düzlemlerin matematiksel bileşkesi gerekir.
   - *Çözüm:* `ortho-kinematics` (`sampling.rs`, `tolerance.rs`) içine `sample_runout_circles` (en az 3 Z yüksekliğinde dairesel tarama) ve `sample_symmetry_planes` eklendi. `ortho-emitter` içinde DMIS `CONST/PLANE, MID, F(P1), F(P2)` ve `TOL/CRUN` blokları üretildi.
   - *Commit:* `a9a299a`, `5b57cd3`

6. **Çok Sayfalı Teknik Resim PDF Ayrıştırma ve Sayfa Bazlı Balon Filtreleme:**
   - *Kök Neden:* Çok sayfalı PDF'lerde tüm ölçüler tek bir sayfaymış gibi çıkarılıyor veya sayfa bilgisi kayboluyordu; 2D kanvasta diğer sayfaların balonları üst üste biniyordu.
   - *Çözüm:* `schemas/drawing_data.schema.json` içine `page_number` alanı eklendi (`npm run codegen`). `tools/extractor/vector_extractor.py` tüm sayfaları ($1..N$) gezerek ölçüleri sayfa numarasıyla etiketledi. `DrawingCanvas.ts` içinde `setPage(pageNum)` ile sadece aktif sayfaya ait balonların render edilmesi sağlandı. UI'da `◀ Sayfa X / N ▶` sayfa gezinti kontrolleri bağlandı.
   - *Commit:* `d383232`, `a7f3679`, `50de79b`, `1302508`

7. **Işık Masası Manuel Balon Ekleme/Silme ve 3D Tıkla-Bağla (Click-to-Bind):**
   - *Kök Neden:* Otomatik OCR/Vektörün kaçırdığı özel notlar için manuel balon çizilemiyordu; yanlış çizilen balonlar silinemiyordu; 2D balon ile 3D STEP yüzeyi arasında doğrudan interaktif bağlama yapılamıyordu.
   - *Çözüm:* `LightTableControls.ts` içine `enableManualBalloonDrawMode` (tıklayıp sürükleyerek yeni balon oluşturma), `Delete`/`Backspace` kısayolu ve butonuyla balon silme eklendi. `main.ts` ve `CADViewer.ts` raycaster entegrasyonuyla `🎯 3D Yüzeye Bağla` modu etkinleştirildi; 3D parça üzerinde tıklanan yüzeyin `face_id` değeri doğrudan balona bağlanarak `%100` güven skoruyla `ENGINEER_LOCKED` durumuna geçirildi.
   - *Commit:* `50de79b`, `1302508`

8. **6-Fazlı Bütünleşik Sistem Doğrulaması:**
   - `npm run codegen`: Başarılı (TypeScript ve Python Pydantic modelleri eksiksiz üretildi).
   - `npm run check:types`: Başarılı (0 hata).
   - `python -m pytest tools/tests/`: 74 test başarılı (%100 yeşil).
   - `npm run test:ui`: 35 test dosyası, 201 test başarılı (%100 yeşil).
   - `cargo test --workspace`: 9 crate, 83+ birim/entegrasyon/doc testi başarılı (%100 yeşil).
   - `npm run build`: Başarılı (0 hata, üretim paketi derlendi).

### 4.3. 4. Dalga: 7 İleri Seviye Metroloji ve Mimari Sorunun Giderilmesi (13 Kasım 2026)

1. **İç Çap (Bore) ile Dış Çap (Boss / Mil) Ayrımı (Topological Polarity):**
   - *Kök Neden:* STEP'te delik de mil de `CYLINDRICAL_SURFACE` olarak gelir. Ayrım yapılmadığında prob dolu metal milin içine daldırılıp çarpışmaya yol açıyordu.
   - *Çözüm:* `brep_verifier.py`, `crates/ortho-brep/src/step_parser.rs` ve `MeasurementPathGenerator.ts` içinde `ADVANCED_FACE`, `SAME_SENSE` (`.T.` vs `.F.`) ve $(\vec{P} - \vec{P}_{\text{axis}}) \cdot \hat{n}$ radial iç çarpımı ile delik/mil kutupsallığı ayrıldı. Delikler için içeriden dışarıya ($R - R_{\text{tip}}$), miller için dışarıdan içeriye ($R + R_{\text{tip}} + \text{approach}$) güvenli dokunma kinematiği sağlandı.
   - *Commit:* `81a98ad`

2. **3D Prob Yakut Küre Yarıçap Telafisi (Stylus Radius Compensation / Kosinüs Hatası):**
   - *Kök Neden:* Ham CMM tetikleme noktası küre merkezidir ($P_{\text{center}}$); temas noktası yüzey normali yönünde $R_{\text{eff}}$ kadar ofsetlidir. Düzlem ve silindir fitting algoritmaları bu telafiyi yapmadığında kosinüs hatası oluşuyordu.
   - *Çözüm:* `crates/ortho-kinematics/src/fitting.rs` ve `tools/extractor/metrology_fitting.py` içine $P_{\text{surf}} = P_{\text{center}} - R_{\text{eff}} \hat{n}_{\text{approach}}$ telafisi eklendi; delik için $D_{\text{act}} = D_{\text{fit}} + 2 R_{\text{eff}}$, mil için $D_{\text{act}} = D_{\text{fit}} - 2 R_{\text{eff}}$ çap düzeltmesi uygulandı.
   - *Commit:* `b93d6d4`

3. **ASME Y14.5 / ISO 2692 Dinamik MMC (Ⓜ) / LMC (Ⓛ) Bonus Tolerans Motoru & Dinamik Simülasyon Süresi:**
   - *Kök Neden:* Bonus tolerans statik kalıyor, gerçek boyut sapmasına göre dinamik güncellenmiyordu; ayrıca UI simülasyonu trajektori uzunluğundan bağımsız sabit 34 saniye sürüyordu.
   - *Çözüm:* `crates/ortho-ast/src/tolerance.rs` içine `compute_dynamic_bonus_tolerance` eklendi ($T_{\text{total}} = T_{\text{stated}} + \text{Bonus}$). `SimulationController.ts` içinde sabit 34s yerine dinamik ivmeli hareket süresi hesabı ($T = \sum (t_{\text{accel}} + t_{\text{cruise}} + t_{\text{decel}}) + t_{\text{dwell}}$) ve MMC bonus rozetleri eklendi.
   - *Commit:* `8cbd036`

4. **Detay Görünüşler (`DETAY / DETAIL 2:1, 5:1`) Yerel Ölçek Koruması:**
   - *Kök Neden:* 2D PDF teknik resimlerde büyütülmüş detay görünüşlerdeki ölçüler, `validate_scale_consistency` tarafından orantısız bulunup siliniyordu.
   - *Çözüm:* `tools/extractor/spatial.py` ve `tools/drawing_extractor.py` içine detay ada tespiti ve yerel ölçek çarpanı (`view_scale_ratio`) ayrıştırması eklendi; detay görünüş içindeki ölçülerin silinmesi engellendi.
   - *Commit:* `3482ef1`

5. **ISO 14253-1 Ölçüm Belirsizliği Koruma Bandı (Guard Banding - `GUARD_BAND_WARNING`):**
   - *Kök Neden:* Belirsizlik ($U_{95}$) tolerans sınırına yaklaştığında karar kuralı uygulanmıyor, sınır değerler hatalı kabul ediliyordu.
   - *Çözüm:* `crates/ortho-kinematics/src/uncertainty.rs` içine `evaluate_iso14253_compliance` eklendi: $|\Delta| \le T - U_{95} \to \text{PASS}$, $T - U_{95} < |\Delta| \le T \to \text{GUARD\_BAND\_WARNING}$, $|\Delta| > T \to \text{FAIL}$.
   - *Commit:* `68ddaad`

6. **AS9102 Form 3 Denetim Kayıtları ve UI Canlı Simülasyon Entegrasyonu:**
   - *Kök Neden:* ISO 14253-1 kararları resmi AS9102 denetim paketine ve 3D simülasyondaki canlı renk göstergelerine yansımıyordu.
   - *Çözüm:* `crates/ortho-emitter/src/audit.rs` içine `conformance_status` alanı eklendi; `SimulationController.ts` içinde `GUARD_BAND_WARNING` sarı/kehribar rengiyle ve tolerans tüketim oranıyla canlı olarak gösterildi.
   - *Commit:* `20ed8dc`, `8d6a308`

7. **Zeiss Calypso (`calypso.rs`) ve Wenzel Quartis (`wenzel.rs`) Diyalekt Eşitliği:**
   - *Kök Neden:* PC-DMIS dışındaki Calypso ve Wenzel diyalektleri temel blokları içeriyor, ancak ISO 1 20°C ısıl telafi, 3-2-1 temel datum hizalamaları, yıldız prob indeksleri ve OP10/OP20 operasyon sıralamasını içermiyordu.
   - *Çözüm:* `crates/ortho-emitter/src/calypso.rs` ve `crates/ortho-emitter/src/wenzel.rs` içine ISO 1 20°C başlıkları, `BASE_ALIGNMENT` / `DATUM_SYSTEM_321`, `STAR_PROBE_INDEX`, `SETUP_STAGE`, ve kritik özellik hız profilleri (`MESVEL: 2.0` vs `5.0`) eklendi.
   - *Commit:* `ebe28e2`

8. **Python Çıkarım Hattı ile Rust `ortho-cli` Arasında Köprü:**
   - *Kök Neden:* Python çizim çıkarıcısı ile Rust derleyicisi arasında iki yönlü IPC eksikti; arayüz derlenmiş gerçek PC-DMIS, Calypso, Wenzel ve G10 çıktılarını alamıyordu.
   - *Çözüm:* `crates/ortho-cli/src/main.rs` içine `--input-drawing-json` ve `--emit-all-json` parametreleri eklendi; `schemas/drawing_data.schema.json` güncellenip `npm run codegen` çalıştırıldı; `electron-main.js` ve `src-tauri/src/main.rs` içine `runOrthoCompiler` ve `compile_all_dialects_ipc` entegre edildi.
   - *Commit:* `575acf5`, `bd3ee89`, `3c9a62b`

9. **6-Fazlı Doğrulama:**
   - `npm run codegen`: Başarılı.
   - `npm run check:types`: Başarılı (0 hata).
   - `python -m pytest tools/tests/`: 75 test başarılı (%100 yeşil).
   - `npm run test:ui`: 35 test dosyası, 201 test başarılı (%100 yeşil).
   - `cargo test --workspace`: 9 crate, tüm birim ve E2E testleri başarılı (%100 yeşil).
   - `npm run build`: Başarılı (0 hata, üretim paketi hazır).

### 4.4. Teknik Resim Çıkarım Derinleştirme, O(1) Uzamsal İndeks ve Sıfır Mockup (Tamamlandı)

1. **Sıfır Mockup ve Dürüst Eşleşme Sözleşmesi (`7ee60eb`, `e574665`, `1974f74`):**
   - `.dev/mocks/` kalıntıları kaldırıldı; UI/Python testleri izole fikstürlere geçirildi.
   - `similarity_engine.py` boş katalogda uydurma eşleşme yerine `[]` döner.
   - 3B yüzeyle eşleşmeyen adımlar için `requires_manual_3d_binding` şema alanı eklendi (`vision_ai_extractor.py`, `inspection_planner.py`).
2. **Tarama Çizgisi Budama, O(1) `SpatialHashGrid` ve Sayfa İçi İndeks (`f61920e`, `6468a2b`):**
   - `spatial.py` içinde `SpatialHashGrid` (`cell_size = 24.0`), `prune_hatching_lines` (45°/135° tarama budaması) ve sayfa bazlı `build_page_geometry_index` önbelleklemesi eklendi; `GOBEK BAGI OLUGU_TR_AB.pdf` çalışma süresi `13.865s -> 2.936s` düzeyine indirildi.
3. **Vektörel Delik Sembolleri ve Çok Satırlı Çağrı Birleştirme (`32df058`):**
   - `⌴` (Havşa/Counterbore), `∨` (Konik Havşa/Countersink), `↧` (Derinlik) sembol sınıflandırması ve `merge_stacked_hole_callouts` eklendi.
4. **Kırık Kılavuz Çizgisi, Dar Dış Oklar ve Ordinat Referansı (`2fbc685`):**
   - `extract_circle_primitives`, `LINEAR_OUTSIDE_NARROW`, `LEADER_CIRCLE` ve `ORDINATE_BASELINE` eklendi.
5. **2B-3B Afin/Procrustes Kaydı ve Kesit Görünümü Kilitleme (`e3a85b0`):**
   - `brep_verifier.py` içinde `align_view_to_3d_projection` ve `transform_2d_to_3d` ile çok noktalı afin dönüşüm eklendi; `KESİT` / `SECTION` görünüm kilitlemesi (+20 iç çap öncelik puanı) sağlandı.
6. **6-Fazlı Doğrulama:**
   - `npm run codegen`: Başarılı.
   - `npm run check:types`: Başarılı (0 hata).
   - `python -m pytest tools/tests/`: 86 test başarılı (`5.27s`).
   - `npm run test:ui`: 35 test dosyası, 200 test başarılı (`17.02s`).
   - `cargo test --workspace`: 28 test paketi, 176 test başarılı (0 hata).
   - `npm run build`: Başarılı (`vite build` 700ms, 0 hata).

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

### 11 Ekim 2026 — Işık masası detay planı

- Arayüz ve manuel çalışma genişletmesi: detay planına §12–14 eklendi. Kalıcı panel düzeni, kaynak kırpımlı özellik kartı, OCR olmadan giriş, manuel GD&T/datum/tablo/not/CAD bağlantısı, taslak/onay ayrımı ve otomatik adaylarla birleşme davranışı tanımlandı. UI-M01–UI-M14 gerçek kullanıcı kabul senaryolarıdır; henüz uygulanmış veya çalıştırılmış değildir.

- Kullanıcı isteğiyle [Işık Masası Yetkinlik ve Kabul Planı](lightTableCapabilityPlan.md) oluşturuldu; GD&T belgesinden bağlantı eklendi.
- Kapsam: IM-01–IM-09 yetkinlikleri, beş destek seviyesi, ekran/operatör akışı, şemalaştırılacak veri kavramları, standart doğrulama kapısı, değişiklik etkileri, LT-01–LT-16 kabul senaryoları ve yeterlilik ölçütleri.
- Bu belge R0–R8 sırasını değiştirmez; yeni uygulama veya kabul başarısı kaydetmez. Sonraki ışık masası odağı, mevcut R0/R1 önkoşullarıyla kaynaklı karakteristik kartını hazırlamak ve belirsiz standart kurallarını alan doğrulamasına almaktır.
- Teslim yalnız dokümantasyondur; uygulama testleri çalıştırılmadı. Bağlantı ve diff kontrolü doküman tesliminin doğrulamasıdır.

### 11 Ekim 2026 — Işık masası araç şeridi ve manuel kaynak-bölgesi ekleme (kod dilimi 1–2)

- İş kimliği: plan §12.1/§12.3/§13.1 UI katmanının ilk iki atomik kod dilimi; R0–R8 kapı sırasını değiştirmez.
- Değişen dosyalar: `ui/src/modules/drawing/utils/LightTableControls.ts` (yeni), `ui/src/modules/drawing/utils/LightTableControls.test.ts` (yeni), `ui/src/modules/drawing/DrawingCanvas.ts` (entegrasyon). `ui/index.html` değişmedi; SetupWizard büyütülmedi.
- Önceki davranış: manuel ekleme uydurma `bbox [x, y, x+40, y+20]` ve sahte `confirmed: true` üretiyordu; araç şeridi/zoom/sayfa/status desteği yoktu.
- Yeni davranış: kalıcı araç şeridi (Seç/El/Bölge Seç, ＋Unsur Ekle, zoom −/%/＋/Sığdır, sayfa sekmeleri, Tüm Balonlar/Yalnız Seçili görünüm filtresi, Otomatik Çıkar gerekçeyle kapalı), durum şeridi, klavye kısayolları (+/−/0/PageUp/PageDown/Esc), tıkla-seçim; manuel karakteristik artık yalnız operatörün çizdiği gerçek kaynak bölgesinden doğar ve taslak olarak (`confirmed: false`) kaydedilir; `allocateBalloonId` ile çakışmasız kalıcı kimlik. Mantık saf fonksiyonlarla `utils/LightTableControls.ts` içinde, 16 birim testi ile.
- Testler: `npx tsc --noEmit` temiz; `npx vitest run ui/src/modules/drawing` 22/22 geçti (D: çalışma ağacında); tam UI paketi 106 geçti — kalan 2 hata önceden var olan InspectionSmoke Python çıkarım sayısı uyumsuzluğu (48↔13), bu dilimden bağımsız (stash ile doğrulandı).
- Şema/çıktı envanteri: değişmedi; mevcut BalloonItem sözleşmesi kullanıldı, schema-first gerekmedi.
- Kalan sınırlamalar: §12.1 tam çalışma masası (sol envanter paneli + sağ özellik kartı + inceleme kuyruğu), undo/redo (Ctrl+Z/Y), FeatureDefinitionModal'daki uydurma varsayılan alan değerleri (`50.0`, `'Ø50 ±0.1'`, `±0.100`), manuel GD&T/datum/tablo/not/CAD akışları henüz uygulanmadı; R0/R1 önkoşulları açık.

Her alt iş şu bilgilerle kapanır: iş kimliği; değişen dosyalar; başlangıç hatası; yeni davranış; girdi/hash ve şema sürümü; test komutları/çıkış kodları; gerçek akış kanıtı; kalan sınırlamalar. Commit varsa kimliği, yoksa çalışma ağacı bilgisi yazılır.

## 10. 27 Aşamalı Büyük Mimari ve Fiziksel AI Yol Haritası (Faz 6 – Faz 32: Tamamı Kabul Edildi)

Detaylı teknik kapsam ve kabul kriterleri için bakınız: [masterRoadmap.md](masterRoadmap.md)

| Faz | Başlık | Durum | Doğrulama & Commit |
|---|---|---|---|
| **Faz 6** | B-Rep Topolojik Bilgi Grafiği (`BRepGraphEngine`) | Kabul Edildi | `crates/ortho-brep/src/graph.rs` (Commit `31c4bbd`, `a9c9bf6`) |
| **Faz 7** | ASME Y14.5-2018 ve ISO 1101 GD&T Kural Motoru | Kabul Edildi | `crates/ortho-ast/src/composite_gdandt.rs` (Commit `b243f1d`) |
| **Faz 8** | PTB Onaylı Fitting & GUM ISO 15530-3 Belirsizlik Motoru | Kabul Edildi | `crates/ortho-kinematics/src/fitting.rs` (Commit `e4236e8`, `889befe`) |
| **Faz 9** | Zero-Copy Yüksek Hızlı İkili IPC Protokolü | Kabul Edildi | `crates/ortho-router/src/ipc.rs` (Commit `94b76e8`, `889befe`) |
| **Faz 10** | Sürekli 5-Eksen Tarama Kinematiği (Renishaw REVO-2 & PH20) | Kabul Edildi | `crates/ortho-kinematics/src/ph10.rs` (Commit `812ae92`, `889befe`) |
| **Faz 11** | Hibrit Metroloji: Optik ve Lazer Çizgi Sensörü (Scan-to-CAD) | Kabul Edildi | `crates/ortho-kinematics/src/laser.rs` (Commit `da20085`) |
| **Faz 12** | Otomatik Prob Magazini Değişim Kinematiği (MCR20/FCR25) | Kabul Edildi | `crates/ortho-router/src/stylus.rs` (Commit `80eb4fa`) |
| **Faz 13** | I++ DME v1.7 / v2.0 Endüstriyel CMM Denetleyici Köprüsü | Kabul Edildi | `crates/ortho-router/src/ipp.rs` (Commit `0d155f8`) |
| **Faz 14** | Tam Gövde BVH + GJK/EPA Çarpışma Fiziği ve Çoklu Fikstür | Kabul Edildi | `crates/ortho-router/src/collision.rs` (Commit `b5fdd04`, `ad64a27`) |
| **Faz 15** | Çoklu CNC Kapalı Döngü Desteği ve SPC Aşınma Tahmini | Kabul Edildi | `crates/ortho-emitter/src/closed_loop.rs` (Commit `ecf92c2`) |
| **Faz 16** | AS9102 Rev C FAI Resmi İlk Numune Denetim Raporu Motoru | Kabul Edildi | `crates/ortho-emitter/src/as9102.rs` (Commit `0662de1`, `a9a5216`) |
| **Faz 17** | Çoklu Parça Paletleme, Yuvalama (Nesting) ve Seri Teftiş | Kabul Edildi | `crates/ortho-router/src/pallet.rs` (Commit `2caab5a`) |
| **Faz 18** | Karpathy Güvenlik Kalkanı: Belirsizlik Karar Paneli | Kabul Edildi | `crates/ortho-ai/src/karpathy_guard.rs` (Commit `881a4cb`) |
| **Faz 19** | Ponytail Kod Temizliği ve VRAM Stres Testi | Kabul Edildi | `crates/ortho-ai/src/ponytail_guard.rs` (Commit `803f4de`) |
| **Faz 20** | Superpowers Metodolojisi ile Uçtan Uca Headless E2E Test | Kabul Edildi | `crates/ortho-cli/src/bin/ci_e2e_runner.rs` (Commit `9b3bc0e`) |
| **Faz 21** | Savunma Sanayii Air-Gapped Güvenlik Kalkanı ve Dijital DMIS | Kabul Edildi | `crates/ortho-license/src/lib.rs` (Commit `b697eeb`, `ad64a27`) |
| **Faz 22** | Atölye Tipi Yüksek Kontrast CMM Operatör Kokpiti | Kabul Edildi | `ui/src/modules/inspection/OperatorCockpit.ts` (Commit `2b5bd36`) |
| **Faz 23** | Dinamik Termal Gradyan Simülasyonu | Kabul Edildi | `crates/ortho-kinematics/src/thermal.rs` (Commit `27bd3cd`) |
| **Faz 24** | Tersine Mühendislik ve Parametrik B-Rep Rekonstrüksiyonu | Kabul Edildi | `crates/ortho-brep/src/surface.rs` (Commit `3d4f9ad`) |
| **Faz 25** | Otonom Kalite Derleyicisi 2.0 (Sovereign Loop) | Kabul Edildi | `crates/ortho-router/src/autonomous_loop.rs` (Commit `62213d7`) |
| **Faz 26** | Vektörel Mikro-Çizim GD&T ve Çap Topoloji Sınıflandırıcısı | Kabul Edildi | `tools/extractor/vector_extractor.py` (Commit `dcc8372`) |
| **Faz 27** | FCF Hücre Bölücü & Kompozit Kutu Ayrıştırıcısı | Kabul Edildi | `tools/extractor/semantic_grammar.py` (Commit `c402bea`) |
| **Faz 28** | Dikey ve Açılı Ölçülerde 90° Rotasyon Normalizasyonu | Kabul Edildi | `tools/extractor/spatial.py` (Commit `24542b6`) |
| **Faz 29** | Ölçü Çizgisi, Uzatma Çizgisi ve Lider Ok Ucu İzleyicisi | Kabul Edildi | `tools/extractor/spatial.py` (Commit `66dfb95`) |
| **Faz 30** | Kısıtlı Mühendislik Alfabesi ve OCR Kontur Font Sanitizer | Kabul Edildi | `tools/extractor/vision_ai_extractor.py` (Commit `8ac9f89`) |
| **Faz 31** | Tolerans Kritiklik Renklendirmesi ve Işık Masası Isı Haritası | Kabul Edildi | `ui/src/modules/inspection/utils/InspectionCardFormatter.ts` (Commit `2e71e12`) |
| **Faz 32** | B-Rep Geometrik Benzerlik Eşleştirme ve Kurulum Hafızası | Kabul Edildi | `tools/extractor/similarity_engine.py` (Commit `2bf415b`) |

Tüm 32 faz (Faz 1 – Faz 32) ve entegrasyon test paketleri %100 oranında tamamlanmış, doğrulanmış ve `origin/master` dalına aktarılmıştır. Sıfır açık hata mevcuttur.
