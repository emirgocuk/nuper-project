# Nuper Ortho — Proje Özeti (Project Brief)

## 1. Yönetici Özeti ve Temel Misyon
**Nuper Ortho**, koordinat ölçüm cihazları (CMM - Coordinate Measuring Machine) için geliştirilen yeni nesil, otonom bir **Bilgisayar Destekli Teftiş (CAI - Computer-Aided Inspection) derleyicisi ve masaüstü yazılımıdır**. 

Temel misyonu; ham 3D CAD tasarım modellerini (STEP AP214/AP242) ve 2D PDF teknik resimleri alarak, geleneksel metrolojide 3 ila 8 saat süren manuel prob öğretme ve tıklama sürecini **30 saniyeye indirmek**; doğrudan tezgaha yüklenebilir, çarpışmasız, sertifikalı PC-DMIS, ANSI DMIS 5.3 ve Zeiss Calypso teftiş kodları üretmektir.

* **YC 2026 RFS Kategorisi:** Physical AI / New Industrial Software / AI-Native CAM-to-Inspection.
* **Proje Konumu:** `nuper_citadel` çekirdek geometri yeteneklerini sahaya indiren amiral gemisi Physical AI ürünü.

---

## 2. Çözülen Temel İmalat Problemleri

1. **CAM ve CMM Arasındaki 25 Yıllık Uçurum:** Modern talaşlı imalatta CNC takım yolları CAM yazılımlarıyla (Mastercam, Siemens NX, hyperMILL) dakikalar içinde otonom planlanırken; parça CMM odasına geldiğinde süreç 25 yıl önceki fareyle tek tek delik tıklama ve el yordamıyla kafa çevirme yöntemlerine mahkûmdur.
2. **Kaza, Prob Kırılması ve Hurda Maliyeti:** Yanlış hesaplanan yaklaşma açıları veya pabuç engelleri nedeniyle probun parçaya çarpması tek seferde $2.000 - $6.000 hasara ve tezgahın günlerce durmasına yol açar.
3. **Kusursuz 3D PMI / MBD İllüzyonu:** Hexagon ve Zeiss gibi devlerin mevcut otomasyon modülleri, CAD modelinin içine Siemens NX veya CATIA ile gömülmüş kusursuz 3D tolerans verisi (PMI) talep eder. Oysa savunma, havacılık ve otomotiv yan sanayiine gelen parçaların **%90'ı yalnızca "çıplak bir STEP dosyası" ve taranmış "2D PDF Teknik Resim"den ibarettir**.

---

## 3. Sistem Kapsamı ve Çözüm Mimarisi

### A. Geometri ve B-Rep Ayrıştırma (Katman 1: `ortho-brep`)
- STEP AP214 ve AP242 dosyalarını OpenCASCADE (OCCT) C++ çekirdeği ile analitik B-Rep topolojisine dönüştürme.
- Analitik yüzey sınıflandırması: Düzlemler (`Plane`), İç/Dış Silindirler (`Cylinder`), Konikler (`Cone`), B-Spline serbest yüzeyler.
- Ters normal vektörlerinin tespiti, kenar sınır ofsetleri ($1.5\text{ mm}$ çapak marjı) ve cidar kalınlığı ($t < 2.5\text{ mm}$ ince cidar) analizi.
- Rust $\leftrightarrow$ C++ arasında sıfır ham işaretçi sızıntılı `cxx` sınır izolasyonu.

### B. Nötr Teftiş AST ve Kural Doğrulayıcı (Katman 2: `ortho-ast`)
- Donanımdan ve CMM markalarından bağımsız Nötr Metroloji Ara Temsili (Intermediate Representation - IR).
- ASME Y14.5 ve ISO 1101 standartlarında 3-2-1 Datum hiyerarşisi ($A \mid B \mid C$) ve 6 Serbestlik Derecesi (6-DoF) Jacobian rank kilitlenme denetimi.
- Dişli deliklerin (M-Thread, Inch, Boru) tespiti, yakut bilye koruma baypası ve kurulum föyüne mastar talimatı düşme.

### C. Prob Kinematiği ve Örnekleme (Katman 3: `ortho-kinematics`)
- İleri kinematik ağaç ($\text{PH10 Kafa} \to \text{TP20 Modül} \to \text{Uzatma} \to \text{Şaft} \to \text{Bilye}$).
- Renishaw PH10 motorize kafa için 720 diskret açı Look-Up Table (LUT) ve minimum açısal sapma optimizasyonu ($\theta \to \min$).
- Renishaw MH20i manuel kafa için operatör müdahalesini en aza indiren K-Means açı kümelemesi.
- Düzlemler için Gauss/Chebyshev ızgarası; delikler için 2 seviyeli 4 nokta (8 temas) dağıtıcısı.
- Serbest formlu yüzeyler için eğriliğe uyarlamalı (Curvature-Adaptive) örnekleme.

### D. Çarpışmasız Rota ve Emniyet Zarfı (Katman 4: `ortho-router`)
- Parça sınırlarına dinamik $+50\text{ mm}$ Emniyet Kutusu (Clearance Box) ve $5\text{ mm}$ yüzey normali geri çekilme vektörü.
- Bağlama pabuçları ve fikstürler için 3D Bounding Box Keep-Out yasaklı alanları.
- Süpürülmüş Kapsül (Swept Volume Capsule) modeli üzerinde geniş fazda BVH, dar fazda `parry3d` GJK/EPA sürekli çarpışma fiziği.
- 2-Opt Traveling Salesperson (TSP) yol optimizasyonu.

### E. Post-Processor ve Donanım HAL (Katman 5: `ortho-emitter`)
- Bildirimsel Tera/Jinja şablonlama mimarisi (PC-DMIS `.dmi`/`.bas`, ANSI DMIS 5.3, Zeiss Calypso XML/ASCII).
- `MODE/MAN` operatör kaba sıfırlama rehberliği, `TEMPR/PART` termal kompanzasyon bloğu ve Z-First mutlak intikal protokolü.
- Prob magazini (MCR20) değişimlerinde tezgahın mastarlanmış yerel makrolarını (`LOADPROBE`) çağırma; asla ham koordinat basmama.
- SHA-256 kriptografik dijital imza ile AS9100 denetim izi ve değiştirilemezlik garantisi.

### F. Kademeli AI ve Hafif Arayüz
- Zayıf atölye iş istasyonlarında donmayan 4 Kademeli AI Hattı (Tier 0: AP242, Tier 1: OpenCV/OCR, Tier 2: Moondream2 SLM, Tier 3: Qwen2-VL).
- Katı GBNF JSON gramer kısıtları ve B-Rep zemin gerçekliği (Ground-Truth) denetimi.
- Tauri 2.0 + React + Three.js Solid Slate Light arayüzü: 80-150 MB RAM, on-demand render ile %0 boşta GPU tüketimi.

---

## 4. Pazar Konumlandırması ve İş Modeli

| Lisans Modeli | Hedef Kitle | Yıllık Fiyatlandırma | Kapsam |
|---|---|---|---|
| **Node-Locked Kurumsal Lisans** | KOBİ ve Fason İmalatçılar | **4.000$ – 7.500$ / yıl** (Makine başı) | Tek CMM tezgahına donanım kilitli (Dongle / HWID), çevrimdışı çalışma. |
| **Enterprise Floating Lisans** | Büyük Savunma ve Havacılık Üreticileri | **20.000$ – 45.000$ / yıl** (Havuz) | Yerel şirket içi ağda çoklu kullanıcı, sınırsız post-processor desteği. |
| **Closed-Loop Add-On Modülü** | Yüksek Hacimli Seri İmalat | **Ek 2.500$ / yıl** | CMM sapma raporlarını CNC takım aşınma ofsetine çeviren kapalı döngü. |

### Yatırım Geri Dönüşü (ROI):
- Ayda 5.000$ - 7.000$ maliyetli 2 CMM programcısının rutin iş yükünü %90 azaltarak CMM kapasitesini %300 artırır.
- Tek bir prob kafası kazasının önlenmesi ($3.000 - $6.000) yazılımın yıllık bedelini ilk günden amorti eder.

---

## 5. Başarı Kriterleri ve Temel Performans Göstergeleri (KPI)

1. **Programlama Hızı:** Prizmatik parçalarda 4 saatlik manuel süreyi $<30$ saniyeye indirmek.
2. **Sıfır Çarpışma Sertifikasyonu:** GJK/EPA süpürülmüş hacim doğrulamasıyla tezgaha aktarılan her kod için %100 çarpışmasızlık garantisi.
3. **Metrolojik Doğruluk:** Alman Ulusal Metroloji Enstitüsü (PTB) referans veri setlerinde nominal çapa $10^{-6}\text{ mm}$ (nanometre) altı sapmayla uyum.
4. **Air-Gapped Güvenlik:** Askeri üslerde ve gizli tesislerde sıfır internet bağımlılığıyla çalışabilme.
