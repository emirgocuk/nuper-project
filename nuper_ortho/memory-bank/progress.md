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

#### 📌 Adım 1.3: Katman 1 — B-Rep Geometri Çekirdeği (`ortho-brep`)
- **İş Paketi:** OpenCASCADE C++ FFI köprüsünün (`cxx`) kurulması, STEPControl_Reader ile STEP AP214/AP242 dosyalarını okuma, TopoDS_Face analitik yüzey sınıflandırması (`Plane`, `Cylinder`, `Cone`), normal vektörü yönelimi ($I, J, K$), sınır kutusu ve et kalınlığı analizi ($<2.5\text{ mm}$).
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [01_Katman_1_Ingestion_ve_BRep_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/01_Katman_1_Ingestion_ve_BRep_Plani.md) *(OpenCASCADE FFI, cxx bağlayıcısı ve TopoDS_Shape gezgini)*
  2. [02_Geometri_Motoru_ve_BRep_Ayristirma.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/02_Geometri_Motoru_ve_BRep_Ayristirma.md) *(Analitik yüzey tipleri, normal vektörü tersleme ve et kalınlığı hesabı)*
  3. [10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md) *(Bölüm 3: OpenCASCADE C++ Bellek İzolasyonu ve cxx sınır güvenliği)*
  4. [08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md) *(Bölüm 1: B-Rep UV Parametrizasyonu & BRepClass_FaceClassifier)*

---

#### 📌 Adım 1.4: Katman 3 — Kinematik ve Ayrık Nokta Örnekleme (`ortho-kinematics`)
- **İş Paketi:** İleri kinematik ağaç ($\text{PH10} \to \text{TP20} \to L_{ext} \to L_{stem} \to \text{Ball}$), PH10 720 diskret açı Look-Up Table (LUT), skaler çarpım tabanlı açı optimizasyonu ($\theta \to \min$), düzlemler için 4 noktalı ızgara ve delikler için 2 seviyeli 4 noktalı (8 temas) örnekleyici.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [03_Katman_3_Kinematics_ve_Sampling_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/03_Katman_3_Kinematics_ve_Sampling_Plani.md) *(PH10 LUT, açı optimizasyonu ve Gauss nokta üretimi)*
  2. [04_Prob_Kinematigi_ve_Aci_Optimizasyonu.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/04_Prob_Kinematigi_ve_Aci_Optimizasyonu.md) *(720 açı küresel dönüşüm formülü ve kalibre edilmiş açı önceliği)*
  3. [08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md) *(Bölüm 2: Prob Geometrisi ve İleri Kinematik Ağaç)*
  4. [06_Metroloji_Matematigi_Fitting_ve_Standartlar.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/06_Metroloji_Matematigi_Fitting_ve_Standartlar.md) *(Bölüm 4: Prob Esnemesi ve Pre-Travel sapma fiziği)*

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

#### 📌 Adım 2.1: Katman 4 — Süpürülmüş Kapsül Çarpışma Motoru (`ortho-router`)
- **İş Paketi:** $+50\text{ mm}$ Clearance Box, $5\text{ mm}$ normal geri çekilme, pabuç 3D Keep-Out kutuları, `parry3d` BVH geniş fazı ve GJK/EPA dar faz çarpışma testi, `Lift-and-Hop` (+30 mm) engelden aşma ve 2-Opt TSP intikal optimizasyonu.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [04_Katman_4_Collision_ve_Routing_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/04_Katman_4_Collision_ve_Routing_Plani.md) *(Clearance Box ve rota planlama mimarisi)*
  2. [15_3D_Simulasyon_ve_GJK_Carpisma_Motoru.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/15_3D_Simulasyon_ve_GJK_Carpisma_Motoru.md) *(GJK/EPA Minkowski farkı, kapsül modeli ve Lift-and-Hop)*
  3. [05_Carpisma_Onleme_Emniyet_Zarfi_ve_Yol_Planlama.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/05_Carpisma_Onleme_Emniyet_Zarfi_ve_Yol_Planlama.md) *(Pabuç engelleri ve şaft sürtünme kısıtları)*
  4. [08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md) *(Bölüm 3: TSP Yol Optimizasyonu Maliyet Fonksiyonu)*

---

#### 📌 Adım 2.2: Dişli Delikler ve Kademeli Cep Yönetimi
- **İş Paketi:** ISO 261 / DIN 3852 vida dişi sınıflandırıcısı, matkap çapı vs anma çapı ayrımı, prob dalışını baypas etme kuralı, fatura/havşa/ana delik eşmerkezlilik ağacı ve kurulum föyüne diş mastarı talimatı ekleme.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [17_Disli_Delikler_ve_Karmasik_Unsur_Yonetimi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/17_Disli_Delikler_ve_Karmasik_Unsur_Yonetimi.md) *(Vida dişi baypası, yakut bilye güvenliği, fatura/havşa ağacı)*
  2. [13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md) *(Bölüm 3: Çok Gövdeli Montajlar & Cıvata Filtreleme)*

---

#### 📌 Adım 2.3: Chebyshev H7 Fitting & PTB Akreditasyon Paketi
- **İş Paketi:** Dişi delikler için Chebyshev Maksimum İç Teğet (Maximum Inscribed), erkek miller için Minimum Dış Teğet, düzlemler için Gauss En Küçük Kareler algoritmaları ve Alman PTB resmi test koordinat setleriyle otomatik birim testler ($<10^{-6}\text{ mm}$).
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [06_Metroloji_Matematigi_Fitting_ve_Standartlar.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/06_Metroloji_Matematigi_Fitting_ve_Standartlar.md) *(Gauss vs Chebyshev matematiği ve PTB/NIST akreditasyonu)*
  2. [09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md) *(GUM belirsizlik bütçesi ve ISO 16610 Gauss filtresi)*
  3. [10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md) *(Bölüm 4: Hammersley / Halton Yarı-Rastgele Örnekleme)*

---

#### 📌 Adım 2.4: Donanım Soyutlama Katmanı (HAL) ve Tezgah Profilleri
- **İş Paketi:** `machine_profile.json` şeması, tezgah eksen strok sınırları denetimi, PC-DMIS `.prb` dosyası ve kalibre kafa ID eşleme sözlüğü, Renishaw MCR20 magazininde native `LOADPROBE` makro çağrısı ve Zeiss Calypso ASCII/XML aktarım motoru.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [18_CMM_Tezgah_Profili_Prob_ID_ve_Donanim_Lehceleri.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/18_CMM_Tezgah_Profili_Prob_ID_ve_Donanim_Lehceleri.md) *(HAL mimarisi, strok limitleri, .prb eşleme ve Calypso)*
  2. [08_Saha_Operasyonlari_Fiksturleme_ve_Kapali_Dongu.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/08_Saha_Operasyonlari_Fiksturleme_ve_Kapali_Dongu.md) *(Bölüm 2: MCR20 Magazin Yönetimi & Bölüm 3: Stylus Kütüphanesi)*

---

#### 📌 Adım 2.5: Otonom 3-2-1 Hizalama ve Sıfırlama Öneri Motoru
- **İş Paketi:** Parçanın 6 serbestlik derecesini en kararlı kilitleyen yüzeylerin puanlanması (Alan, açıklık ve $\vec{n} \cdot \vec{z}$), prizmatik blok/flanş/torna şablonları ve 3D görselleştirme renk kodları.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [12_Otonom_Hizalama_ve_Sifirlama_Oneri_Motoru.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/12_Otonom_Hizalama_ve_Sifirlama_Oneri_Motoru.md) *(Kararlılık puanlama motoru ve parça tipi hizalama kuralları)*
  2. [09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md) *(Bölüm 3: ISO 5459 6-DoF Jacobian Rank Kilitlenme Analizi)*

---

### 🔹 FAZ 3: İleri GD&T, Kademeli AI ve Modern Masaüstü UI (Hafta 13 – 18)
*Hedef: Havacılık serbest formlu yüzeylerini desteklemek, 4 kademeli yerel AI ile 2D PDF teknik resimleri okumak ve hafif Tauri masaüstü uygulamasını tamamlamak.*

---

#### 📌 Adım 3.1: Serbest Yüzey Profili ($\char"2312$) ve Bileşik GD&T
- **İş Paketi:** B-Spline yüzeylerde UV ızgarası normal sapması ($\Delta n$), bilateral ve unilateral ($U$) tolerans bantları, ASME Y14.5 Bileşik Konum Çerçeveleri (PLTZF $A|B|C$ + FRTZF $A$), adaptif eğrilik örneklemesi ve DMIS `TOL/PROFS` çıktısı.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [20_Serbest_Yuzey_Profili_ve_Bilesik_Toleranslar.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/20_Serbest_Yuzey_Profili_ve_Bilesik_Toleranslar.md) *(Yüzey profili formülü, PLTZF/FRTZF iki katmanlı AST ve adaptif örnekleme)*
  2. [02_Geometri_Motoru_ve_BRep_Ayristirma.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/02_Geometri_Motoru_ve_BRep_Ayristirma.md) *(GeomAbs_BSplineSurface UV normal matrisi)*

---

#### 📌 Adım 3.2: Dört Kademeli Yerel AI & Çok Sayfalı PDF Hattı
- **İş Paketi:** Tier 0 (AP242 PMI), Tier 1 (PaddleOCR/OpenCV), Tier 2 (Moondream2 / SmolVLM 1.5B GGUF), Tier 3 (Qwen2-VL), çok sayfalı PDF sınıflandırıcısı, Kesit A-A kesme düzlemi izdüşüm eşlemesi ve kırmızı kaşe temizleme filtresi.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [19_Kademeli_AI_Mimarisi_ve_Cok_Sayfali_Kesit_Esleme.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/19_Kademeli_AI_Mimarisi_ve_Cok_Sayfali_Kesit_Esleme.md) *(4 Kademeli AI, Kesit A-A eşleme ve HSV kaşe temizleme)*
  2. [14_Yerel_Yapay_Zeka_Ajanlari_ve_Deterministik_Gardiyan.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/14_Yerel_Yapay_Zeka_Ajanlari_ve_Deterministik_Gardiyan.md) *(5 AI rolü, GBNF grameri ve 5 aşamalı gardiyan mimarisi)*
  3. [03_2D_PDF_GDT_ve_Datum_Esleme_Motoru.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/03_2D_PDF_GDT_ve_Datum_Esleme_Motoru.md) *(Feature Control Frame ayrıştırma ve çap eşleme)*
  4. [10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md) *(Bölüm 1: Bipartite Graph Matching `petgraph`)*

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

### 🔹 FAZ 4: Saha FAT, CMM Copilot & CNC Kapalı Döngü
*Hedef: Pilot savunma/havacılık fabrikalarında sahaya inmek, operatör güvenini kazanmak ve CNC geri besleme döngüsünü kapatmak.*

---

#### 📌 Adım 4.1: Çevrimdışı CMM Copilot / Shadow Mode Dağıtımı
- **İş Paketi:** Pilot havacılık atölyesinde yazılımı "Çevrimdışı Taslak ve Doğrulayıcı" olarak kurma; kıdemli CMM operatörünün 4 saatlik programı ile Nuper Ortho'nun 30 saniyelik çıktısının mikron seviyesinde A/B boyutsal tutarlılık doğrulaması.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [10_MVP_Uygulama_Plani_ve_Girisim_Stratejisi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/10_MVP_Uygulama_Plani_ve_Girisim_Stratejisi.md) *(Bölüm 2: Truva Atı Giriş Stratejisi & A/B Benchmark)*
  2. [07_Uctan_Uca_Insa_ve_Dogrulama_Plani.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/07_Uctan_Uca_Insa_ve_Dogrulama_Plani.md) *(Bölüm 3 & Bölüm 6: Saha FAT Test Matrisi)*

---

#### 📌 Adım 4.2: Kapalı Döngü CNC Takım Aşınma Geri Beslemesi (Closed-Loop)
- **İş Paketi:** CMM'den çıkan CSV / Q-DAS ölçüm sapma raporunu otomatik ayrıştırma; tolerans limitine doğru aşınan takımlar için CNC kontrol ünitesine (Fanuc / Siemens Sinumerik) doğrudan takım aşınma ofseti (Wear Offset) düzeltme komutu üretme.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [08_Saha_Operasyonlari_Fiksturleme_ve_Kapali_Dongu.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/08_Saha_Operasyonlari_Fiksturleme_ve_Kapali_Dongu.md) *(Bölüm 4: Kapalı Döngü Kalite Geri Bildirimi & CNC Entegrasyonu)*

---

#### 📌 Adım 4.3: Kriptografik AS9100 Rev D Denetim İzi
- **İş Paketi:** Derlenen her DMIS kodunun sonuna koordinat ve tolerans verilerinden hesaplanan SHA-256 dijital imzasının gömülmesi; raporda dosya manipülasyonu tespit edilirse ölçümün geçersiz kılınması.
- **📖 Geliştirmeye Başlamadan Önce Okunması Zorunlu Dosyalar:**
  1. [13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md) *(Bölüm 5: Kriptografik SHA-256 Hash ve AS9100 Denetim İzi)*
  2. [09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md](file:///c:/Projeler/nuper-project/nuper_ortho/Nuper%20Ortho%20Detayl%C4%B1%20Kavramsal%20Tasar%C4%B1m/Kodlama%20Planlamasi/09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md) *(Bölüm 5: ISO 14253 Guard-Banding Karar Eşiği)*

## 3. Güncel Durum ve İlerleme Özeti

| Modül / Görev | Durum | Tamamlanan Çıktılar / Dosyalar | Sıradaki Odak |
|---|:---:|---|---|
| **Kök `Cargo.toml` & Crate'ler** | ✅ **TAMAMLANDI** | [Cargo.toml](file:///c:/Projeler/nuper-project/nuper_ortho/Cargo.toml) (6 alt sandık tanımlandı) | Multi-crate workspace aktif |
| **`ortho-ast` Nötr Metroloji IR** | ✅ **TAMAMLANDI** | [lib.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-ast/src/lib.rs), `feature.rs`, `datum.rs`, `tolerance.rs`, `threads.rs`, `compound.rs`, `plan.rs`, `error.rs` | 6-DoF rank, H7 Chebyshev, M-diş baypası |
| **`ortho-brep` Ingestion Katmanı** | 🟡 **İSKELET HAZIR** | [lib.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-brep/src/lib.rs) (`BRepModel`, `BRepError`) | OpenCASCADE FFI bağlayıcısı |
| **`ortho-kinematics` Prob Çözücü** | ✅ **TAMAMLANDI** | [ph10.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-kinematics/src/ph10.rs) (720 LUT), `sampling.rs` (4/8 nokta), `tree.rs` | Açı optimizasyonu & nokta üretimi |
| **`ortho-router` Emniyet & Rota** | ✅ **TAMAMLANDI** | [clearance.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-router/src/clearance.rs) (+50mm box, Keep-Out), [lib.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-router/src/lib.rs) | Typestate `CertifiedCollisionFreeTrajectory` |
| **`ortho-emitter` Post-Processor** | ✅ **TAMAMLANDI** | [lib.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-emitter/src/lib.rs) (`DmisEmitter`) | `MODE/MAN`, Z-First, `TEMPR/PART`, H7 Chebyshev |
| **`ortho-cli` Derleyici Koşucu** | ✅ **TAMAMLANDI** | [main.rs](file:///c:/Projeler/nuper-project/nuper_ortho/crates/ortho-cli/src/main.rs) | 5 katmanlı dikey dilim CLI testi |
