# Product Context: Nuper Citadel

## 1. Neden Bu Proje Var? (Pazar & Mühendislik İhtiyacı)
Savunma sanayiinde (ASELSAN, ROKETSAN, BAYKAR, TUSAŞ, STM ve tedarikçi ekosistemi) geliştirilen donanımların sahaya çıkabilmesi için en zorlu aşama **Çevresel Kalifikasyon Testleri**dir.
Bir parçanın CAD modelinin çizilmesi bazen birkaç gün sürerken, o parçanın MIL-STD-810H standartlarına göre test senaryolarının çıkarılması, FEA modellerinin doğru sınır şartlarıyla koşturulması, simülasyon sonrası rezonans/gerilme kontrolünün yapılması ve ETP (Environmental Test Plan) dokümanlarının yazılması **haftalar hatta aylar** almaktadır.

### Mühendisin Karşılaştığı Engel Zinciri:
1. **Standart Enformasyon Aşırı Yükü:** MIL-STD-810H 1.088 sayfadır. Sadece Titreşim (Metot 514.8) altında onlarca kategori, ek eğriler, katsayı hesapları ve dipnotlar bulunur.
2. **FEA Kurulumunda Kör Uçuş:** ANSYS Random Vibration veya Simcenter NX Response Simulation ortamlarında PSD analizi kurarken frekans-ivme eğrileri ve sönümleme oranları manuel hesaplandığında hata riski büyüktür.
3. **FEA Sonuçlarını Standartla Kapatamama (Closed-Loop Boşluğu):** Mühendis FEA çözdükten sonra mod frekanslarını ($f_1, f_2$) ve pik von Mises gerilmesini standart gereksinimleriyle (ör. $f_1 > 1.2 \times f_{\text{input}}$ rezonans kaçınma kuralı) manuel karşılaştırmak zorundadır. Rezonans riski varsa çentikleme (notching) hesabı elle yapılır.
4. **Resmi Dokümantasyon İhtiyacı:** Akredite test merkezleri (TRTEST, TÜBİTAK SAGE vb.) ham metin veya ekran görüntüsü değil; antetli, doküman numaralı, revizyon kontrollü ve imza bloklu resmi **A4 PDF Çevresel Test Planı (ETP)** bekler.
5. **Akredite Laboratuvarda Patlama Riski:** Test günlüğü $5.000 - $15.000 olan sarsıcı (shaker) testlerinde parça arızalandığında proje aylarca ötelenir.
6. **Gizlilik / Air-gap Duvarı:** Askeri CAD/STEP ve teknik şartnameler ITAR ve gizlilik nedeniyle asla harici bulut API'lerine (OpenAI vb.) taşınamaz.

---

## 2. Nuper Citadel Nasıl Çalışır? (Kullanıcı Deneyimi & İş Akışı)

### Hedef Kullanıcı Profili (Personas)
- **Mekanik Tasarım Mühendisi:** Parçanın CAD modelini çizen, kütle, CoG ve montaj deliklerini doğrulamak isteyen mühendis.
- **Yapısal Analiz (FEA) Mühendisi:** Titreşim, şok ve yorulma analizlerini ANSYS / NX / Nastran üzerinde koşan ve sınır şartı arayan analist.
- **Test ve Kalifikasyon Mühendisi:** ETP hazırlayan, shaker fikstür kalınlığını belirleyen ve resmi A4 PDF kabul raporunu test merkezine sunan uzman.
- **Proje Teknik Yöneticisi:** Parçanın testten önce risk skorunu görüp "Test Kabul / Revizyon Gerekli" kararı veren yönetici.

### 5 Aşamalı Sıralı Analiz İş İstasyonu Akışı (Sequential Study Pipeline)

```
[Adım 1: Girdi & Kurulum] ──► [Adım 2: 3D CAD & Bağlayıcılar] ──► [Adım 3: GD&T / CMM]
                                                                          │
[Adım 5: ETP Rapor & PDF] ◄── [Adım 4: Pre-FEA & Post-FEA Kapalı Döngü] ◄─┘
```

1. **Adım 1: Girdi & Görev Kurulumu:**
   - Mühendis 3D STEP dosyasını (`.step`, `.stp`) ve 2D Teknik Resmi (`.pdf`, `.png`) sisteme yükler.
   - Platform (örn. *Taktik İHA Kanat Altı*) ve Malzeme (örn. *Aluminium 6061-T6*) seçilir.
2. **Adım 2: 3D Geometri & Bağlayıcılar:**
   - Three.js WebGL ortamında saten alüminyum parça döner; gerçek tessellation mesh, kırmızı yanıp sönen CoG küresi ve montaj delikleri sergilenir.
   - DIN 912 / ISO 273 normlarına göre sıkma torku ($M_A$) ve ön yük ($F_M$) otomatik hesaplanır.
   - 2D Teknik resimdeki delik adetleri ile CAD delikleri otomatik çapraz doğrulanır (Helicoil / diş eşleşmesi).
3. **Adım 3: GD&T / CMM Denetimi:**
   - 2D çizimdeki datumlar, kritik boyutsal toleranslar ve ASME Y14.5 MMC True Position ($TP = 2\sqrt{\Delta x^2 + \Delta y^2}$) ile taban düzlemselliği CMM sapmaları üzerinden denetlenir.
4. **Adım 4: Pre-FEA & Post-FEA Kapalı Döngü Doğrulama:**
   - **Pre-FEA:** Simcenter NX / ANSYS için 120-noktalı log-log enterpolasyonlu PSD spektrum CSV'si ve APDL kodu üretilir. Shaker fikstür kalınlığı ($t_{\min}$) ve Palmgren-Miner S-N yorulma hasarı ($D \le 0.20$) hesaplanır.
   - **Post-FEA (Kapalı Döngü Doğrulama):** *(UYGULANDI - `PostFEAEngine`)*
     - Mühendis FEA'dan aldığı doğal frekansları ($f_1, f_2, f_3$) ve pik von Mises gerilmesini sisteme girer.
     - Sistem rezonans riskini ($f_1 > 1.2 \times f_{\max}$), dinamik büyütme katsayısını ($Q = 1 / (2\zeta)$) ve akma emniyet marjını ($MS$) hesaplar.
     - Güvenlik sınırı aşılıyorsa otomatik çentikleme (notching) derinliği ($\Delta \text{dB}$) önerir.
5. **Adım 5: Askeri Kabul, Yerel LLM & Resmi A4 PDF İhracı:**
   - Yerel LLM (Qwen 2.5 Coder) ve deterministik şablon motoruyla resmi Askeri ETP sentezlenir.
   - Mühendis düzenleme yaparsa DPO çifti (`prompt`, `chosen`, `rejected`) olarak yerel `telemetry.db` içine işlenir.
   - **Resmi Askeri A4 PDF İndirme:** *(UYGULANDI - `PDFReportGenerator`)*
     - ReportLab ile kurumsal antetli, doküman numaralı, gizlilik damgalı ("TASNİF DIŞI / UNCLASSIFIED"), tüm analiz tablolarını ve resmi onay imza bloklarını içeren A4 PDF raporu tek tıkla üretilir.
   - Sarsıcı tabla anomali durumlarında otonom itiraz ve savunma dilekçesi (`objection_agent.py`) oluşturulur.

---

## 3. Gerçek Parça Doğrulaması (Proof of Concept)
Sistem, gerçek savunma sanayii aviyonik parçası üzerinde uçtan uca doğrulanmıştır:
- **Parça:** ASELSAN Röle Bağlantı Parçası (`ROLE BAGLANTI PARCA_AA (1).stp`)
- **Teknik Resim:** `ROLE BAGLANTI PARCA_TR_AA-1.pdf` (Doküman No: `603739-00000-01-1Y2`)
- **Geometri:** $55.08 \times 31.66 \times 31.68\text{ mm}$, $35.7\text{ g}$ kütle, 4 montaj deliği (2x M4 Helicoil, 2x M3 Helicoil).
- **Bağlayıcı:** DIN 912 M4 ($2.7\text{ N}\cdot\text{m}$) ve M3 ($1.2\text{ N}\cdot\text{m}$) tork reçetesi.
- **Yorulma:** $D = 0.0069 \le 0.20$ ile güvenli kabul.
- **A4 PDF ETP:** Gerçek parça parametreleriyle eksiksiz resmi PDF üretildi ve doğrulandı.

---

## 4. Başarı Ölçütleri ve Hedefler
- **Hesaplama Hızı:** CAD geometrisinden PSD spektrumu üretimi < 3 saniye; A4 PDF üretimi < 2 saniye.
- **Deterministik Doğruluk:** Formüllerde %100 matematiksel tutarlılık (sıfır halüsinasyon).
- **Kapalı Döngü:** Pre-FEA sınır şartı hazırlama ve Post-FEA mod doğrulamasının tek ekranda tamamlanması.
- **Sıfır Veri Sızıntısı:** %100 yerel (`127.0.0.1`), air-gapped, harici ağa 0 bayt veri çıkışı.
- **Dokümantasyon:** Akredite test laboratuvarlarının doğrudan kabul ettiği resmi A4 PDF formatı.
