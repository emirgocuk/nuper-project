# 🔄 08. Saha Operasyonları, Fikstürleme ve Kapalı Döngü (Closed-Loop)

> **"Çoklu bağlama (Setup 1 / Setup 2) ayrıştırması, Renishaw MCR20 prob magazini yönetimi, M2/M3 prob montaj kütüphanesi ve CMM ölçüm sapmalarını doğrudan CNC takım aşınma ofsetine çeviren kapalı döngü zekâsı."**

---

## 📌 1. Fikstürleme ve Çoklu Bağlama Ayrıştırması (Multi-Setup Routing)

Gerçek atölye ortamında hiçbir parça tek bağlamada her yönünden ölçülemez; parçanın alt yüzeyi doğrudan granit tablaya veya bağlama pleytine basar.

Eğer parçanın tabanında da kritik toleranslı delikler veya faturalar varsa, prob fiziksel olarak oraya ulaşamaz.

```
┌─────────────────────────────────────────────────────────────┐
│                      STEP CAD Modeli                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     [ SETUP 1 / OP 10 ]             [ SETUP 2 / OP 20 ]
   Parça Normal Duruşta (Z-Up)     Parça Ters Çevrildi (Flip Part)
   • Üst yüzeyler                  • Alt taban yüzeyi
   • Yan delikler                  • Taban faturaları ve delikler
   • Kendi Manuel 3-2-1 Sıfırı     • Kendi Manuel 3-2-1 Sıfırı
```

### AutoMetrol Çözümü:
1. Geometri motoru yüzey normallerini bağlama yönüne ($Z_{\text{up}}$) göre filtreler.
2. Aşağıya bakan ($N_z \approx -1.0$) veya fikstür basma tabanıyla çakışan yüzeyleri tespit eder.
3. Teftiş programını otomatik olarak ikiye böler:
   - **`OP10_UST_VE_YANLAR.dmi`**
   - **`OP20_ALT_TABAN.dmi`**
4. Her iki operasyon için operatöre görsel çevirme ve ayrı kaba sıfırlama talimatı üretir.

---

## 🧲 2. Otomatik Prob Değiştirici (Stylus Changing Rack - MCR20 / SCR200) Yönetimi

Derin ve kademeli parçalarda tek bir prob boyutu yetersiz kalır. Dar bir delik için $\varnothing 1\text{ mm}$ uçlu kısa prob gerekirken, derin bir cep için $100\text{ mm}$ uzatmalı $\varnothing 4\text{ mm}$ prob gerekir.

Modern CMM tezgahlarında manyetik prob değiştirme istasyonları (Renishaw MCR20, FCR25) bulunur:

```
        [ Prob Kafası PH10M ]
                  │
                  ▼ (Otonom Park ve Değişim Hareketi)
     ┌──────────────────────────────────────────────┐
     │  PORT 1: TP20 Standart - ∅2mm x 20mm         │
     │  PORT 2: TP20 Low Force - ∅1mm x 10mm        │
     │  PORT 3: TP20 Extended - ∅4mm x 100mm        │
     └──────────────────────────────────────────────┘
```

### Otonom Değişim Optimizasyonu:
1. Parçadaki unsurlar derinlik/çap oranlarına göre sınıflandırılır.
2. Port 1 probu ile erişilebilen tüm unsurlar tek seferde ölçülür.
3. Rota planlayıcı probu güvenli $Z$ düzleminde magazin koordinatına götürür. Manyetik bağlantı yuvasına bırakılır, Port 3'teki uzatmalı prob takılır ve kalan derin cepler sıfır operatör müdahalesiyle ölçülür.

---

## 🔩 3. Stylus Kütüphanesi ve Diş Standartları (M2 vs M3)

Prob uzatmaları gelişi güzel takılamaz; probun kütlesi, boyu ve ataleti dinamik ölçüm hassasiyetini etkiler:
- **M2 Vida Dişi:** Dokunmatik TP20 ve TP200 serisinde standarttır. Küçük çaplı yakut bilyeler ve hafif alüminyum/seramik şaftlar kullanılır.
- **M3 Vida Dişi:** Analog tarama SP25M sistemlerinde kullanılır. Yüksek rijitlik gerektirir.
- **Karbon Fiber vs. Çelik Uzatmalar:** $100\text{ mm}$ üzerindeki uzatmalarda çelik şaftlar kendi ağırlığıyla sarkar; karbon fiber uzatmalar zorunludur.

AutoMetrol arayüzünde operatörün tezgahtaki donanımını 10 saniyede seçmesini sağlayan **"Prob Montaj Sihirbazı (Stylus Configurator)"** modülü yer alır.

---

## 🔄 4. Kapalı Döngü Kalite Geri Bildirimi (Closed-Loop Manufacturing)

Kalite kontrol bir "bekleme odası" veya hurda ayıklama istasyonu olmaktan çıkıp, CNC tezgahını gerçek zamanlı düzelten aktif bir geri besleme halkasına dönüşür:

```
[ AutoMetrol ] ──► [ CMM Teftiş ] ──► [ CSV / Q-DAS Raporu ]
                           │                      │
                           ▼                      │
            [ Sapma Analizi (Deviation) ] ◄───────┘
                           │
                           ▼
             [ CNC Takım Aşınma Ofseti ]
             (Örn: T03 Çap Kompanzasyonu: -0.012 mm)
```

### İş Akışı ve Değer:
1. CMM parçayı ölçtükten sonra standart bir sapma raporu (.csv, .xml veya Q-DAS formatında) üretir.
2. AutoMetrol bu raporu okur:
   > *"Operasyon 2'deki $\varnothing 30\text{ H7}$ deliği nominalden $+0.015\text{ mm}$ büyük çıkıyor; rayba aşınması sınır değere ulaştı."*
3. CNC kontrol ünitesine (Fanuc, Siemens Sinumerik, Heidenhain) doğrudan yüklenebilir takım ofset düzeltme komutu üretilir (T03 Wear: $-0.012\text{ mm}$).
4. Sonuç: Parça hatalı çıkmadan önce CNC tezgahı kendi kendini düzeltir; hurda oranı sıfıra iner.
