# Nuper Ortho — İlerleme Durumu, Faz Planları ve Zorunlu Kaynak Okuma Kılavuzu (Progress)

## 1. Proje Sağlığı ve Genel Durum
- **Mevcut Aşama:** Kavramsal Tasarım ve Mimari Spesifikasyon Tamamlandı $\longrightarrow$ **Kodlama Fazı Başlıyor**.
- **Tamamlanan Belgeler:** 11 Temel Kavramsal Doküman (`00` – `10`) + 21 Detaylı Kodlama/Derleyici Planı (`00` – `20`).
- **Memory Bank Durumu:** Tüm sistem mimarisi, teknik bağımlılıklar, ürün hedefleri ve geliştirme adımları Türkçe olarak işlendi.
- **Kritik Geliştirici Kuralı:** Geliştirici ajan veya mühendis, **ilgili adıma başlamadan önce o adım için listelenen tüm referans mimari belgeleri MUTLAKA okumalıdır**.

---

## 2. Uçtan Uca Faz Bazlı İnşa ve Zorunlu Okuma Kılavuzu

```
[ FAZ 1: Çekirdek Prizmatik Dikey Dilim PoC (Hafta 1 - 6) ] ────► [ ŞU AN BURADAYIZ ]
[ FAZ 2: Endüstriyel Emniyet ve Metroloji Sertifikasyonu (Hafta 7 - 12) ]
[ FAZ 3: İleri GD&T, Kademeli AI ve Modern Masaüstü UI (Hafta 13 - 18) ]
[ FAZ 4: Saha FAT, CMM Copilot & CNC Kapalı Döngü ]
```

---

### 🔹 FAZ 1: Çekirdek Prizmatik Dikey Dilim Prototipi (Hafta 1 – 6)
*Hedef: Prizmatik ve delikli bir STEP AP214 dosyasını alıp, analitik B-Rep'e çeviren, temel PH10 kafa açılarını seçen ve doğrudan PC-DMIS'te çalıştırılabilir bir `.dmi` kodu basan uçtan uca CLI derleyicisini ayağa kaldırmak.*

---

#### 📌 Adım 1.1: Kök Workspace ve Crate Altyapısı (`Cargo.toml`)
- **İş Paketi:** Multi-crate mimarisine sahip kök `Cargo.toml` dosyasının ve 6 alt crate iskeletinin (`ortho-ast`, `ortho-brep`, `ortho-kinematics`, `ortho-router`, `ortho-emitter`, `ortho-cli`) oluşturulması; ortak bağımlılıkların (`glam`, `serde`, `thiserror`, `tracing`, `cxx`, `tera`) tanımlanması.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [06_Gelistirme_Ortami_ve_Crate_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/06_Gelistirme_Ortami_ve_Crate_Mimarisi.md) *(Crate hiyerarşisi, kütüphane sürümleri ve workspace manifestosu)*
  2. [00_Derleyici_Mimarisi_Master_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/00_Derleyici_Mimarisi_Master_Plani.md) *(5 katmanın veri akışı ve decoupled mimari felsefesi)*
  3. [09_Yazilim_Mimarisi_ve_Teknoloji_Yigini.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/09_Yazilim_Mimarisi_ve_Teknoloji_Yigini.md) *(Masaüstü mühendisliği ve genel mimari yığın)*

---

#### 📌 Adım 1.2: Katman 2 — Nötr Metroloji AST (`ortho-ast`)
- **İş Paketi:** Donanım ve yazılımdan bağımsız Nötr Ara Temsilin (IR) yazılması: `InspectionPlan`, `GeometricFeature`, `FeatureType` (`Plane`, `InternalCylinder`, `ExternalCylinder`, `Cone`), `DatumReferenceFrame`, 3-2-1 kural doğrulayıcısı (6 DoF rank analizi) ve serileştirme testleri.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [02_Katman_2_Metrology_AST_Ara_Temsil_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/02_Katman_2_Metrology_AST_Ara_Temsil_Plani.md) *(Nötr AST veri yapıları, Datum Frame ve semantik doğrulayıcı)*
  2. [08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md) *(Bölüm 4: Koordinat Sistemi Hiyerarşisi MCS / FCS / PCS dönüşümleri)*
  3. [07_Uctan_Uca_Insa_ve_Dogrulama_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/07_Uctan_Uca_Insa_ve_Dogrulama_Plani.md) *(Bölüm 4, Aşama 1: Nötr AST ve Semantik Kurallar kapı testleri)*
  4. [03_2D_PDF_GDT_ve_Datum_Esleme_Motoru.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/03_2D_PDF_GDT_ve_Datum_Esleme_Motoru.md) *(Bölüm 4: ASME Y14.5 3-2-1 Hizalama Stratejisi)*

---

#### 📌 Adım 1.3: Katman 1 — B-Rep Geometri Çekirdeği (`ortho-brep`) [TAMAMLANDI]
- **İş Paketi:** Saf Rust ISO 10303-21 STEP (AP214/AP242) B-Rep ayrıştırıcısı (`StepParser`), `ADVANCED_FACE` analitik yüzey sınıflandırması (`Plane`, `InternalCylinder`, `ExternalCylinder`, `Cone`, `BSplineSurface`), tel/kenar poligonu çıkarma (`EDGE_LOOP`, `VERTEX_POINT`), Ray-Casting karşıt yüzey cidar kalınlığı analizi ($<2.5\text{ mm}$ thin wall bayrağı), Doc 08 Section 1 UV parametrizasyonu (`ParametricFace`), kırpma sınırları ve $1.5\text{ mm}$ çapak emniyet payı (burr safety offset).
- **Durum:** ✅ Tamamlandı. `ortho-brep::step_parser` ve `ortho-brep::surface` modülleri yazıldı; `valve_block.step` entegrasyonu tamamlandı; 9 birim ve entegrasyon testi %100 geçiyor.

---

#### 📌 Adım 1.4: Katman 3 — Kinematik ve Ayrık Nokta Örnekleme (`ortho-kinematics`) [TAMAMLANDI]
- **İş Paketi:** İleri kinematik ağaç (`ProbeStack` ve `StarProbeAssembly`), şaft esneme fiziği ve pre-travel lob hesaplayıcısı, PH10 720 diskret açı Look-Up Table (LUT), skaler çarpım tabanlı açı optimizasyonu, kalibre edilmiş açı önceliği (`solve_optimal_angle`), manuel kafa (MH20i) vektörel kümeleme ve yıldız prob önerisi (`cluster_manual_angles_mh20i`), ISO 10360 çoklu yüzey örnekleyicileri (`Plane`, `InternalCylinder`, `ExternalCylinder`, `Cone`, `Sphere`, `CurvatureAdaptive`), ve nihai `OrientedSamplingPlan` motoru.
- **Durum:** ✅ Tamamlandı. 22 birim ve akreditasyon testi %100 başarıyla geçiyor.

---

#### 📌 Adım 1.5: Katman 5 — Post-Processor Şablon Motoru (`ortho-emitter`)
- **İş Paketi:** Tera şablonları (`pcdmis_default.tera`, `dmis_53_ansi.tera`), zorunlu `MODE/MAN` operatör kaba sıfırlama rehberliği, `TEMPR/PART` termal kompanzasyon bloğu ve Z-First mutlak intikal el sıkışması.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [05_Katman_5_Post_Processor_Emitter_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/05_Katman_5_Post_Processor_Emitter_Plani.md) *(Tera şablon mimarisi ve DMIS blok yapısı)*
  2. [07_Post_Processor_ve_DMIS_Derleyici.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/07_Post_Processor_ve_DMIS_Derleyici.md) *(Manuel ön-hizalama, termal genleşme formülü ve tam DMIS kodu)*
  3. [10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md) *(Bölüm 5: Ayrık Bildirimsel Şablonlama via Tera)*
  4. [13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md) *(Bölüm 4: Z-First Absolute Traversal güvenli başlangıç)*

---

#### 📌 Adım 1.6: Geliştirici CLI Aracı (`ortho-cli`)
- **İş Paketi:** `ortho inspect input.step --format pcdmis -o output.dmi` komut satırı aracının kodlanması, uçtan uca prizmatik test parçasıyla derleme doğrulaması ve PC-DMIS sözdizim kontrolü.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [06_Gelistirme_Ortami_ve_Crate_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/06_Gelistirme_Ortami_ve_Crate_Mimarisi.md) *(CLI sandığı kurgusu)*
  2. [07_Uctan_Uca_Insa_ve_Dogrulama_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/07_Uctan_Uca_Insa_ve_Dogrulama_Plani.md) *(Faz 1 entegrasyonu ve kalite kapısı)*

---

### 🔹 FAZ 2: Endüstriyel Emniyet ve Metroloji Sertifikasyonu (Hafta 7 – 12)
*Hedef: Çarpışma risklerini sıfıra indirmek, standart fitting algoritmalarını PTB veri setleriyle akredite etmek ve tezgah donanım sınırlarını entegre etmek.*

---

#### 📌 Adım 2.1: Katman 4 — Süpürülmüş Kapsül Çarpışma Motoru (`ortho-router`) [TAMAMLANDI]
- **İş Paketi:** $+50\text{ mm}$ Clearance Box, $5\text{ mm}$ normal geri çekilme, pabuç 3D Keep-Out kutuları, `parry3d` BVH geniş fazı ve GJK/EPA dar faz çarpışma testi, `Lift-and-Hop` (+40 mm) engelden aşma ve rota mühürleme.
- **Durum:** ✅ Tamamlandı. `ortho-router::collision` ve `ortho-router::stylus` modülleri yazıldı; 6 birim test başarıyla geçiyor.

---

#### 📌 Adım 2.2: Dişli Delikler ve Kademeli Cep Yönetimi [TAMAMLANDI]
- **İş Paketi:** ISO 261 / DIN 3852 vida dişi sınıflandırıcısı, matkap çapı vs anma çapı ayrımı, prob dalışını baypas etme kuralı, fatura/havşa/ana delik eşmerkezlilik ağacı (`SteppedFeatureHierarchy`) ve kurulum föyüne diş mastarı talimatı ekleme (`setup_sheet.md`).
- **Durum:** ✅ Tamamlandı. `ortho-ast::threads` genişletildi, `ortho-ast::compound` kademeli delik dedektörü ve koaksiyellik analizi yazıldı; `ortho-kinematics::plan` yakut bilye koruma baypası ve `ortho-emitter` operatör föyü basımıyla doğrulandı.

---

#### 📌 Adım 2.3: Chebyshev H7 Fitting & PTB Akreditasyon Paketi [TAMAMLANDI]
- **İş Paketi:** Dişi delikler için Chebyshev Maksimum İç Teğet (Maximum Inscribed), erkek miller için Minimum Dış Teğet, düzlemler için Gauss En Küçük Kareler algoritmaları ve Alman PTB resmi test koordinat setleriyle otomatik birim testler ($<10^{-4}\text{ mm}$).
- **Durum:** ✅ Tamamlandı. `ortho-kinematics::fitting` çekirdeği yazıldı; `PTB-Cyl-01.dat` ve `PTB-Pln-01.dat` resmi koordinat setleriyle akreditasyon entegrasyon testleri başarıyla doğrulandı.

---

#### 📌 Adım 2.4: Donanım Soyutlama Katmanı (HAL) ve Tezgah Profilleri [TAMAMLANDI]
- **İş Paketi:** `machine_profile.json` şeması, tezgah eksen strok sınırları denetimi, PC-DMIS `.prb` dosyası ve kalibre kafa ID eşleme sözlüğü, Renishaw MCR20 magazininde native `LOADPROBE` makro çağrısı ve Zeiss Calypso ASCII/XML aktarım motoru.
- **Durum:** ✅ Tamamlandı. `ortho-router::hal` modülü yazıldı; Hexagon Global S, Zeiss Contura G2 ve Mitutoyo Crysta-Apex profilleri, MCR20 yerel makro üretimi ve strok zarfı testleri %100 doğrulandı.

---

#### 📌 Adım 2.5: Otonom 3-2-1 Hizalama ve Sıfırlama Öneri Motoru [TAMAMLANDI]
- **İş Paketi:** Parçanın 6 serbestlik derecesini en kararlı kilitleyen yüzeylerin puanlanması (Alan, açıklık ve $\vec{n} \cdot \vec{z}$), prizmatik blok/flanş/torna şablonları, 3D görselleştirme renk kodları (Yeşil/Mavi/Sarı) ve ISO 5459 6-DoF Jacobian Rank analizi.
- **Durum:** ✅ Tamamlandı. `ortho-ast::alignment` modülü genişletildi; adaptif parça şablonları, 3D görsel rehber noktaları ve Jacobian Rank 6 kilitlenme analizi birim ve entegrasyon testleriyle onaylandı.

---

### 🔹 FAZ 3: İleri GD&T, Kademeli AI ve Modern Masaüstü UI (Hafta 13 – 18)
*Hedef: Havacılık serbest formlu yüzeylerini desteklemek, 4 kademeli yerel AI ile 2D PDF teknik resimleri okumak ve hafif Tauri masaüstü uygulamasını tamamlamak.*

---

#### 📌 Adım 3.1: Serbest Yüzey Profili ($\char"2312$) ve Bileşik GD&T [TAMAMLANDI]
- **İş Paketi:** B-Spline yüzeylerde UV ızgarası normal sapması ($\Delta n$), De Boor eğri/yüzey hesaplayıcısı, Diferansiyel geometri Birinci ve İkinci Temel Formlar ($E, F, G, L, M, N$), Gauss ve Ortalama Eğrilik ($K, H$), bilateral ve unilateral ($U$) tolerans bantları, ASME Y14.5 Bileşik Konum Çerçeveleri (PLTZF $A|B|C$ + FRTZF $A$ ile Kabsch rijit uyum), adaptif eğrilik örneklemesi, 1.5 mm çapak emniyet payı, ve DMIS 5.3 `FEAT/GSURF,CART` / `TOL/PROFS, UNILAT` çıktısı.
- **Durum:** ✅ Tamamlandı. `ortho-brep::surface` ve `step_parser.rs` genişletildi, `ortho-kinematics::sampling` ve `fitting.rs` entegrasyonu tamamlandı; `end_to_end_phase3.rs` havacılık kanat profili testiyle doğrulandı (72/72 test %100 başarılı).

---

#### 📌 Adım 3.2: Dört Kademeli Yerel AI & Çok Sayfalı PDF Hattı [TAMAMLANDI]
- **İş Paketi:** Tier 0 (AP242 Semantik PMI `StepPmiReader`), Tier 1 (Kural Tabanlı OCR & Geometrik Ayrıştırıcı `Tier1RuleBasedParser`), Tier 2/3 (Vision SLM/VLM donanım tespit orkestrasyonu `HardwareProfile::select_optimal_tier`), çok sayfalı PDF sınıflandırıcısı (`DrawingSheet::classify_from_text`), başlık bloğu çıkarıcı (`extract_title_block`), Kesit A-A kesme düzlemi izdüşüm eşlemesi (`CuttingPlane::find_intersecting_features`), kırmızı kaşe temizleme filtresi (`DrawingImagePreprocessor::process_rgb_image`), ve onaylanan eşleşmelerin Nötr Teftiş Planına otomatik aktarımı (`apply_matches_to_inspection_plan`).
- **Durum:** ✅ Tamamlandı. `ortho-brep::tier`, `drawing.rs` ve `matching.rs` modülleri %100 doğrulandı (14/14 test başarılı).

---

#### 📌 Adım 3.3: Tauri 2.0 + Three.js Masaüstü Uygulaması (Solid Slate Light)
- **İş Paketi:** Tauri 2.0 kabuğu, açık gri `#F1F5F9` mühendislik teması, Three.js mat CAD görünümü (`MeshLambertMaterial`, koyu gri kenarlıklar), On-Demand GPU rendering, 3 bölmeli ekran düzeni ve 3D pabuç işaretleme aracı.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [16_UI_UX_Tasarim_Sistemi_ve_Performans_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/16_UI_UX_Tasarim_Sistemi_ve_Performans_Mimarisi.md) *(Solid Slate Light teması, sıfır israf performans kuralları ve ekran düzeni)*
  2. [09_Yazilim_Mimarisi_ve_Teknoloji_Yigini.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/09_Yazilim_Mimarisi_ve_Teknoloji_Yigini.md) *(Bölüm 2: Ön Yüz Mimarisi)*
  3. [08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md) *(Bölüm 5: Tauri Zero-Copy Binary IPC Katmanı)*

---

#### 📌 Adım 3.4: Çift Kanvas Balonlama ve Kurulum Föyü (Setup Sheet)
- **İş Paketi:** Sol 2D PDF, sağ 3D STEP çift kanvas arayüzü, otomatik tolerans balon numaralandırması (①, ②, ③), sürükle-bırak eşleme kanvası ve 1 sayfalık resimli PDF Kurulum Föyü (Setup Sheet) basma motoru.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [11_Saha_Operasyonlari_Setup_Sheet_ve_Hibrit_Metroloji.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/11_Saha_Operasyonlari_Setup_Sheet_ve_Hibrit_Metroloji.md) *(1 sayfalık PDF Kurulum Föyü mimarisi)*
  2. [19_Kademeli_AI_Mimarisi_ve_Cok_Sayfali_Kesit_Esleme.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/19_Kademeli_AI_Mimarisi_ve_Cok_Sayfali_Kesit_Esleme.md) *(Bölüm 6: İkili Kanvas Balonlama Arayüzü)*

---

### 🔹 FAZ 4: Saha FAT, CMM Copilot & CNC Kapalı Döngü [TAMAMLANDI]
*Hedef: Pilot savunma/havacılık fabrikalarında sahaya inmek, operatör güvenini kazanmak, CNC geri besleme döngüsünü kapatmak, I++ DME ağ protokolü ve GUM metrolojik belirsizlik bütçesi ile tam saha entegrasyonu.*

---

#### 📌 Adım 4.1: Çoklu Bağlama (Setup 1 / Setup 2) & I++ DME v1.7/v2.0 Ağ Protokolü
- **İş Paketi:** 
  - `MultiSetupPlan` ve `InspectionPlan::split_into_multi_setup`: Üstten erişilemeyen taban unsurlarını otomatik olarak OP10 (Setup 1) ve OP20 (Setup 2) olarak ayrıştırma, operatör için 180° parça çevirme yönergeleri oluşturma.
  - `ortho-router::ipp`: Tam çift yönlü TCP/IP I++ DME v1.7 / v2.0 protokol katmanı, komut serileştirici (`format_command`), yanıt ayrıştırıcı (`parse_response`), çarpışmasız rotayı I++ komut akışına dönüştüren `trajectory_to_ipp_stream` ve sanal CMM denetleyicisi `IppCmmSimulator`.
- **Durum:** ✅ Tamamlandı. Birim testleri ve simülatör yürütümü %100 başarılı.

---

#### 📌 Adım 4.2: Kapalı Döngü CNC Takım Aşınma Geri Beslemesi (Closed-Loop Manufacturing)
- **İş Paketi:** 
  - `ortho-emitter::closed_loop`: CMM'den çıkan CSV ölçüm sapma raporunu otomatik ayrıştırma (`parse_csv_report`).
  - Fanuc 0i/31i için `G10 L12 P{tool} R{wear}` yarıçap aşınma G-kodu programı üretimi.
  - Siemens Sinumerik 840D/ONE için `$TC_DP13[T, 1] = $TC_DP13[T, 1] + (wear)` artımlı aşınma programı üretimi.
  - Heidenhain `TOOL CALL DR` üretimi.
  - **Takım Kırılma Emniyet Kilidi (Fail-Safe Guard):** Sapma değeri maksimum güvenli eşiği (örn: $0.050\text{ mm}$) aştığında `ToolBreakageDetected` hatası fırlatarak tehlikeli ofset yazımını anında bloke etme.
- **Durum:** ✅ Tamamlandı. Fanuc, Siemens ve Takım Kırılma emniyet testleri %100 başarılı.

---

#### 📌 Adım 4.3: GUM / ISO 15530-3 Metrolojik Belirsizlik Bütçesi, ISO 14253-1 Guard-Banding & ISO 16610-31 Filtresi
- **İş Paketi:**
  - `ortho-kinematics::uncertainty`: GUM / ISO 15530-3 `UncertaintyBudget` (ISO 10360-2 $MPE_E$, prob esnemesi, sıcaklık ve tekrarlanabilirlik bileşenleri), birleşik standart belirsizlik ($u_c$), genişletilmiş belirsizlik ($U_{95}$, $k=2$) ve Test Uncertainty Ratio (TUR 4:1) doğrulaması.
  - ISO 14253-1 Karar Matrisi (`evaluate_guard_banding`): Emniyet muhafaza bandı ($U$) düşürülmüş net kabul (`Pass`), sınırda şüpheli (`Suspect`) ve net ret (`Fail`) sınıflandırması.
  - ISO 16610-31 Sağlam Gauss ve MAD (Median Absolute Deviation) Uç Değer Filtresi (`RobustOutlierFilter`): Metal talaşı, toz veya çapak sıçramalarını analitik yüzeyden izole ederek gerçek geometriyi koruma.
  - AS9100 Rev D Kriptografik SHA-256 denetim izi mührü ve dijital onay bloğu (`ortho-emitter`).
- **Durum:** ✅ Tamamlandı. Tüm metrolojik standart testleri %100 başarılı.

---

## 3. Güncel Durum ve İlerleme Özeti

| Modül / Görev | Durum | Tamamlanan Çıktılar / Dosyalar | Sıradaki Odak |
|---|:---:|---|---|
| **Kök `Cargo.toml` & Crate'ler** | ✅ **TAMAMLANDI** | [Cargo.toml](file:///c:/Projeler/nuper-project/nuper_ortho/Cargo.toml) (6 alt sandık tanımlandı) | Multi-crate workspace aktif |
| **`ortho-ast` Nötr Metroloji IR** | ✅ **TAMAMLANDI** | [lib.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-ast/src/lib.rs), `feature.rs`, `datum.rs`, `tolerance.rs`, `threads.rs`, `compound.rs`, `alignment.rs`, `plan.rs` | 6-DoF rank, H7 Chebyshev, M-diş baypası, Multi-Setup OP10/OP20 |
| **`ortho-brep` Geometri Çekirdeği** | ✅ **TAMAMLANDI** | [lib.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-brep/src/lib.rs), `step_parser.rs`, `surface.rs`, `matching.rs` | STEP AP214/242 parser, Ray-Casting cidar analizi, B-Spline diferansiyel eğrilik |
| **`ortho-kinematics` Prob Çözücü** | ✅ **TAMAMLANDI** | [ph10.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-kinematics/src/ph10.rs), `sampling.rs`, `fitting.rs`, `tree.rs`, `plan.rs`, `uncertainty.rs` | PTB akreditasyonu, GUM / ISO 15530-3 belirsizlik, ISO 14253-1 Guard-Banding |
| **`ortho-router` Emniyet & Rota** | ✅ **TAMAMLANDI** | [clearance.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-router/src/clearance.rs), [hal.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-router/src/hal.rs), `collision.rs`, `stylus.rs`, `tsp.rs`, `ipc.rs`, `ipp.rs` | I++ DME v1.7/v2.0, Virtual CMM Simülatörü, Zero-Copy Binary IPC |
| **`ortho-emitter` Post-Processor** | ✅ **TAMAMLANDI** | [lib.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-emitter/src/lib.rs), `template_engine.rs`, `calypso.rs`, `closed_loop.rs` | PC-DMIS, ANSI DMIS, Fanuc/Siemens Closed-Loop CNC, Setup Sheet, AS9100 SHA-256 |
| **`ortho-cli` Derleyici Koşucu** | ✅ **TAMAMLANDI** | [main.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-cli/src/main.rs), `end_to_end_phase2.rs`, `end_to_end_phase3.rs`, `end_to_end_phase3_ui_setup_sheet.rs`, `end_to_end_phase4.rs` | 4 adet uçtan uca entegrasyon testi, 89/89 test %100 geçiyor |
| **FAZ 1 (Çekirdek Dikey Dilim)** | ✅ **TAMAMLANDI** | Adım 1.1 — 1.6 %100 tamamlandı | FAZ 2'ye geçildi |
| **FAZ 2 (Emniyet & Sertifikasyon)** | ✅ **TAMAMLANDI** | Adım 2.1 — 2.5 %100 tamamlandı (69/69 test başarılı) | FAZ 3'e geçildi |
| **FAZ 3 (İleri GD&T & Kademeli AI)** | ✅ **TAMAMLANDI** | Adım 3.1 — 3.4 %100 tamamlandı (77/77 test başarılı) | FAZ 4'e geçildi |
| **FAZ 4 (Saha Entegrasyonu & CNC)** | ✅ **TAMAMLANDI** | **Adım 4.1 — 4.3 %100 TAMAMLANDI** (89/89 test başarılı) | Tüm fazlar tamamlandı |


