# 🛡️ AutoMetrol Uçtan Uca Endüstriyel İnşa ve Doğrulama Planı (Zero-Defect Pipeline)

> **"Metroloji ve fiziksel yapay zekâda 'hızlı prototip' veya 'geçici çözüm' anlayışı kabul edilemez. Bir prob kafasının parçaya veya pabuca çarpması $10.000+ hasar; mikron seviyesindeki bir fitting hatası ise tüm havacılık/savunma partisinin hurdaya çıkması demektir. AutoMetrol, her katmanı matematiksel olarak doğrulanmış, sıfır sürprizli ve baştan sona planlı bir endüstriyel mühendislik yaklaşımıyla inşa edilir."**

---

## 🧭 1. Sıfır Hata (Zero-Defect) Mühendislik Prensipleri

Tüm yazılım mimarisi, aşağıdaki 4 değişmez kural etrafında şekillenir:

1. **Tip Seviyesinde Emniyet (Typestate Pattern):**
   - Geçersiz bir durumun derlenmesine Rust derleyicisi seviyesinde izin verilmez.
   - Örnek: `UncheckedTrajectory` tipi doğrudan `Emitter`'a gönderilemez; yalnızca `autometrol-router` tarafından doğrulanmış bir `CertifiedCollisionFreeTrajectory` tipi post-processor'a iletilebilir.
2. **Korumalı Hata Durumları (Fail-Safe by Default):**
   - Bir yüzeye dik açı bulunamadığında, pabuç mesafesi şüpheli olduğunda veya et kalınlığı $<2.5\text{ mm}$ tespit edildiğinde sistem asla "tahmin" yürütmez; işlemi durdurup operatöre 3D kanvasta görsel uyarı ve onay mekanizması sunar.
3. **Deterministik Çıktı:**
   - Aynı STEP dosyası ve aynı tolerans girdisi verildiğinde, sistem her zaman bit seviyesinde aynı temas koordinatlarını ve aynı prob açılarını üretir.
4. **Bağımsız Doğrulama Kapıları (Quality Gates):**
   - Her modül, bir sonrakine veri aktarmadan önce kendi matematiksel sınır testlerini (Invariant Checks) tamamlamak zorundadır.

---

## 🏗️ 2. Katı Veri Sözleşmeleri ve Katman İçi Değişmezler (Invariants)

Her katmanın giriş ve çıkış sözleşmeleri kesin kurallara bağlıdır:

```
[ STEP + PDF ] 
      │ 
      ▼ (Gate 1: Topolojik Geçerlilik Kontrolü)
┌────────────────────────────────────────────────────────┐
│ Katman 1: autometrol-brep                              │
│ - Çıktı: ValidatedBRepModel                            │
│ - Kural: Her yüzeyin kapalı normalleri ve sınırları tam│
└──────────────────────────┬─────────────────────────────┘
                           │ 
                           ▼ (Gate 2: Semantik ve Datum Tutarlılığı)
┌────────────────────────────────────────────────────────┐
│ Katman 2: autometrol-ast                               │
│ - Çıktı: ValidatedInspectionPlan (IR)                  │
│ - Kural: 3-2-1 Datum serbestlik dereceleri (DOF) tam   │
└──────────────────────────┬─────────────────────────────┘
                           │ 
                           ▼ (Gate 3: PTB Uyumlu Örnekleme ve Açı Doğrulaması)
┌────────────────────────────────────────────────────────┐
│ Katman 3: autometrol-kinematics                        │
│ - Çıktı: DiscreteSamplingPlan                          │
│ - Kural: Noktalar yüzey sınırından min 1.5R uzakta     │
└──────────────────────────┬─────────────────────────────┘
                           │ 
                           ▼ (Gate 4: Sıfır Çarpışma Sertifikasyonu)
┌────────────────────────────────────────────────────────┐
│ Katman 4: autometrol-router                            │
│ - Çıktı: CertifiedCollisionFreeTrajectory              │
│ - Kural: Şaft, gövde, pabuç ve parçayla 0 çakışma     │
└──────────────────────────┬─────────────────────────────┘
                           │ 
                           ▼ (Gate 5: Makine Sözdizimi Doğrulaması)
┌────────────────────────────────────────────────────────┐
│ Katman 5: autometrol-emitter                           │
│ - Çıktı: ValidatedMachineProgram (.dmi / .prg)         │
│ - Kural: MODE/MAN ön-hizalama ve termal blok eksiksiz  │
└────────────────────────────────────────────────────────┘
```

---

## 🛑 3. Hata Modları ve Emniyet Yönetimi (Failsafe Matrix)

| Risk Senaryosu | Olası Sonuç | AutoMetrol Önleyici Kuralı |
|---|---|---|
| **Kör Delik Dip Çarpması** | Prob ucunun kırılması | Prob ucu hiçbir zaman delik tabanına (bottom face) $2.0\text{ mm}$'den fazla yaklaşamaz. Noktalar delik boyunun $\%20$ ve $\%80$'ine konumlanır. |
| **Pabuç / Fikstür Çakışması** | Kafa gövdesinin ezilmesi | Arayüzden girilen her pabuç için $+15\text{ mm}$ ek şişirme payı (Keep-Out Buffer) eklenir. AABB ve Ray-Tracing testinde bu hacme teğet dahi geçilemez. |
| **Prob Şaft Sürtünmesi** | Yanlış tetikleme / sapma | Nokta yaklaşma açısı yüzey normali ile en fazla $15^\circ$ açı yapabilir. Şaft silindiri CAD mesh'i ile kesiştiğinde o açı doğrudan elenir. |
| **İnce Cidar Eğilmesi (<2.5mm)** | Parçanın esnemesi, hatalı ölçüm | Cidar $<2.5\text{ mm}$ ise temas hızı $\%50$ düşürülür (`TOUCHSPEED/0.5`) ve operatöre fikstür desteği uyarısı verilir. |
| **Eksik Datum Tanımı** | Hatalı koordinat sistemi | Eğer birincil datum 3 nokta, ikincil datum 2 nokta, üçüncül datum 1 nokta sağlamıyorsa kod üretimi kilitlenir; eksik serbestlik derecesi raporlanır. |

---

## 📋 4. Uçtan Uca 6 Aşamalı Deterministik İnşa Sırası

Süreç "önce dış arayüzü yapalım sonra arkasını doldururuz" şeklinde değil; **içten dışa, matematiksel çekirdekten kullanıcı arayüzüne doğru** sağlam temellerle inşa edilir:

### 🔹 Aşama 1: Nötr AST ve Semantik Kurallar (`autometrol-ast`)
* **Hedef:** Donanımdan bağımsız metroloji teftiş ağacının (IR) kurulması.
* **İş Paketleri:**
  1. `InspectionPlan`, `DatumReferenceFrame`, `ToleranceConstraint` veri modellerinin yazılması.
  2. ISO 1101 ve ASME Y14.5 standartlarına göre 3-2-1 datum kural doğrulayıcısının (`DatumValidator`) yazılması.
  3. AST serileştirme/deserileştirme (JSON/Bincode) ve tam kapsamlı Rust birim testleri.
* **Doğrulama Kapısı (Gate 1):** 50 farklı hatalı datum kombinasyonunun semantik denetleyiciden geçirilmesi ve %100 yakalanması.

### 🔹 Aşama 2: Kinematik Çözücü, Prob Ağacı ve Örnekleme Motoru (`autometrol-kinematics`)
* **Hedef:** Renishaw kafa kinematiği ve ISO 10360 temas noktası üretim motoru.
* **İş Paketleri:**
  1. **İleri Kinematik Ağaç:** Prob montaj zincirinin ($\text{PH10} \to \text{TP20} \to L_{ext} \to L_{stem} \to \varnothing_{ball}$) $R_z(B) \cdot R_y(A)$ rotasyon matrisiyle bilye ve pivot kafa ofsetinin hesaplanması.
  2. PH10 $720$ diskret açı tablosunun (LUT) oluşturulması ve kalibre açı önceliklendirme algoritması.
  3. MH20i manuel kafa için operatör kafa çevirmesini minimize eden K-Means açı kümeleyicisi.
  4. Düzlemler için Gauss/Chebyshev ızgara dağıtıcısı; silindirik delikler için 2 seviyeli 4 nokta (8 temas) algoritması.
  5. Alman PTB referans veri setleriyle Chebyshev Minimum Zone ve Gauss silindir fitting testlerinin yazılması.
* **Doğrulama Kapısı (Gate 2):** PTB test veri setlerinde nominal çapa $10^{-6}\text{ mm}$ (sub-mikron) hassasiyetle ulaşılması.

### 🔹 Aşama 3: Geometri Çekirdeği, $u,v$ Parametrizasyonu ve B-Rep Ayrıştırma (`autometrol-brep`)
* **Hedef:** STEP AP214 / AP242 modellerinden analitik geometri, UV dağılımı ve topoloji çıkarma.
* **İş Paketleri:**
  1. OpenCASCADE (OCCT 7.8+) C++ `cxx` köprüsünün kurulması.
  2. **Yüzey Parametrizasyonu ($u,v$):** $S(u,v)$ domeninde `BRepClass_FaceClassifier` ile katı gövde içi (`TopAbs_IN`) kontrolü ve kenarlardan $1.5\text{ mm}$ çapak ofseti.
  3. Lokal yüzey normal vektörlerinin türevler ($\frac{\partial S}{\partial u} \times \frac{\partial S}{\partial v}$) üzerinden analitik hesabı.
  4. Karşıt yüzey ray-casting yöntemiyle cidar kalınlığı (`min_wall_thickness`) analizi.
* **Doğrulama Kapısı (Gate 3):** Karmaşık 1.000 yüzeyli bir hidrolik blok STEP dosyasının $<500\text{ ms}$ içinde sıfır bellek sızıntısıyla (zero-leak) ayrıştırılması.

### 🔹 Aşama 4: Emniyet Zarfı, TSP Yol Optimizasyonu ve Çarpışmasız Rota (`autometrol-router`)
* **Hedef:** Probun tezgaha, parçaya veya pabuçlara çarpmasını engelleyen koruma ve en kısa yol planlayıcısı.
* **İş Paketleri:**
  1. **TSP Rota Optimizasyonu:** Nearest Neighbor + 2-Opt algoritmasıyla açı kümelemesi ve ağırlıklı maliyet ($w_1 \|\Delta P\| + w_2 (|\Delta A| + |\Delta B|) + w_3 C_{rack}$) minimizasyonu.
  2. Parça sınırlarına $+50\text{ mm}$ Clearance Box ve emniyet düzlemi ($Z_{clear}$) oluşturulması.
  3. Prob şaftı ve kafa gövdesi silindir modelleriyle B-Rep mesh'i arasında dinamik mesafe analizi.
  4. Kullanıcı tanımlı pabuç hacimleri için AABB (Axis-Aligned Bounding Box) Keep-Out koruması.
  5. **Hata Bayrakları (Fail-Safe):** Ulaşılamayan delikler için *Unreachable Feature Flag* ve acil iptalde $10\text{ mm}$ ters normal *Auto-Retract*.
* **Doğrulama Kapısı (Gate 4):** 3D simülasyonda 10.000 rastgele rota denemesinde pabuç veya şaft çakışma oranının %0 olması.

### 🔹 Aşama 5: Post-Processor ve Hizalama Hiyerarşisi (`autometrol-emitter`)
* **Hedef:** Sertifikalı rotayı CMM tezgahının anlayacağı ASCII koduna derleme.
* **İş Paketleri:**
  1. **Koordinat Hiyerarşisi (Alignment Stack):** $\text{MCS} \to \text{FCS} \to \text{PCS}$ dönüşümünün `DATDEF` ve `RECALL/ALIGN` komutlarıyla yönetilmesi.
  2. Tera şablon mimarisiyle ANSI DMIS 5.3 motorunun yazılması.
  3. Hexagon PC-DMIS (.dmi / .bas) ve Zeiss Calypso şablon motorlarının yazılması.
  4. Koda operatör için manuel sıfırlama adımları (`MODE/MAN`) ve parça sıcaklık kompanzasyon bloğu (`TEMPR/PART`) enjeksiyonu.
* **Doğrulama Kapısı (Gate 5):** Üretilen `.dmi` kodunun standart DMIS sözdizim analizöründen (Syntax Validator) sıfır hatayla geçmesi.

### 🔹 Aşama 6: Masaüstü Entegrasyonu ve Sıfır Kopyalı 3D Kanvas (`src-tauri` & `frontend`)
* **Hedef:** Operatörün tüm süreci görsel olarak izlediği, sıfır gecikmeli yerel masaüstü deneyimi.
* **İş Paketleri:**
  1. **Zero-Copy Binary IPC:** Mesh ve rota verilerinin `Float32Array` ikili bellek tamponu (Binary Buffer) ile Tauri üzerinden doğrudan JavaScript V8 belleğine aktarılması.
  2. Three.js `BufferGeometry` üzerinde donanım hızlandırmalı 3D CAD görselleştirmesi (ölçüm yüzeyleri yeşil, ulaşılamayanlar kırmızı).
  3. Etkileşimli 3D pabuç / fikstür yerleştirme aracı (Keep-Out Box Drawer).
  4. Prob hareketlerinin animasyonlu 3D simülasyonu ve tek tıkla "Export DMIS" çıktısı.
* **Doğrulama Kapısı (Gate 6):** 60 FPS akıcı 3D simülasyon ve $<100\text{ MB}$ RAM tüketimi.

> Detaylı alt sistem çözümleri için bkz: [**`08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/08_Kritik_Alt_Sistemler_ve_Cozum_Mimarisi.md)  
> Uluslararası metroloji ve GUM standartları için bkz: [**`09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/09_Metroloji_Standartlari_ve_Belirsizlik_Butcesi.md)  
> Kritik teknik darboğazlar ve algoritmik çözümler için bkz: [**`10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/10_Kritik_Teknik_Darbgazlar_ve_Cozumleri.md)  
> Saha operasyonları, Setup Sheet ve hibrit optik/lazer desteği için bkz: [**`11_Saha_Operasyonlari_Setup_Sheet_ve_Hibrit_Metroloji.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/11_Saha_Operasyonlari_Setup_Sheet_ve_Hibrit_Metroloji.md)  
> Otonom hizalama ve sıfırlama öneri motoru için bkz: [**`12_Otonom_Hizalama_ve_Sifirlama_Oneri_Motoru.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/12_Otonom_Hizalama_ve_Sifirlama_Oneri_Motoru.md)  
> Gerçek atölye şartları ve ileri saha güvenliği için bkz: [**`13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/13_Gercek_Atolye_Sartlari_ve_Ileri_Saha_Guvenligi.md)  
> Yerel yapay zeka ajanları ve deterministik gardiyan mimarisi için bkz: [**`14_Yerel_Yapay_Zeka_Ajanlari_ve_Deterministik_Gardiyan.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/14_Yerel_Yapay_Zeka_Ajanlari_ve_Deterministik_Gardiyan.md)  
> 3D simülasyon, süpürülmüş hacim ve GJK/EPA çarpışma motoru için bkz: [**`15_3D_Simulasyon_ve_GJK_Carpisma_Motoru.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/15_3D_Simulasyon_ve_GJK_Carpisma_Motoru.md)  
> UI/UX tasarım sistemi ve sıfır israf performans mimarisi için bkz: [**`16_UI_UX_Tasarim_Sistemi_ve_Performans_Mimarisi.md`**](file:///c:/Projeler/nuper-project/nuper_autometrol/06%20-%20AutoMetrol%20-%20Otonom%20CMM%20ve%20Metroloji%20Motoru%20(Physical%20AI)/Kodlama%20Planlamasi/16_UI_UX_Tasarim_Sistemi_ve_Performans_Mimarisi.md)

---

## 🎯 5. Saha Kabul Testi (Factory Acceptance Test - FAT)

Tüm kodlama tamamlandıktan sonra tezgah başında uygulanacak nihai doğrulama protokolü:

1. **Kör Uçuş Testi:** Programlanan parça tezgah tablasına rastgele bir açıyla bağlanır.
2. **Manuel 3 Nokta Sıfırlama:** Operatör ekrandaki `MODE/MAN` talimatıyla parçanın üst yüzeyine 3 dokunuş yapar.
3. **CNC Geçişi:** CMM otomatik moda (`MODE/AUTO`) geçer; parça etrafındaki pabuçları aşarak tüm delikleri ve düzlemleri sıfır insan müdahalesiyle ölçer.
4. **Doğruluk Doğrulaması:** Elde edilen teftiş raporu, kalibre edilmiş mastar parçanın sertifika değerleriyle mikron seviyesinde karşılaştırılır.
