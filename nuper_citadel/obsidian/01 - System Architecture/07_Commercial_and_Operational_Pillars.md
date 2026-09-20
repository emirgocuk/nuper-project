---
title: 07. Operasyonel Güvenlik, Lisanslama ve Doğrulama Sütunları
created: 2026-09-20
tags:
  - architecture
  - licensing
  - anti-tamper
  - input-sanitation
  - liability
  - golden-bench
  - commercialization
---

# 🛡️ 07. Operasyonel Güvenlik, Lisanslama ve Doğrulama Sütunları

Nuper Citadel'in bir mühendislik teorisinden çıkıp savunma sanayiinde para kazanan, güvenle kullanılan ve hukuki/ticari olarak korunan bir **ürün** haline gelmesini sağlayan 4 temel operasyonel sütun:

---

## 1. Yerel Lisanslama ve Kilit Mekanizması (Licensing & Anti-Tamper)

Uygulama hava boşluklu (air-gapped) ortamlarda, internete hiç bağlanmayan gizli askeri iş istasyonlarında çalışacaktır. Bu nedenle bulut tabanlı lisans doğrulama (Auth0, Stripe API vb.) kullanılamaz.

```
┌───────────────────────────┐         ┌───────────────────────────┐
│   MÜŞTERİ İŞ İSTASYONU    │         │  NUPER INNOVATION PORTAL  │
│  (Air-Gapped / Çevrimdışı)│         │     (Web / Lisans Sunucu) │
└─────────────┬─────────────┘         └─────────────┬─────────────┘
              │                                     │
              │ 1. Donanım Özeti (Machine ID)       │
              │    (Anakart UUID + CPU ID + MAC)    │
              ├────────────────────────────────────►│
              │                                     │ 2. RSA-2048 Özel Anahtar
              │                                     │    ile İmzalama
              │ 3. lisans_nuper.lic İndir           │    (Bitiş Tarihi, Yetkiler)
              │◄────────────────────────────────────┤
              │                                     │
              ▼                                     ▼
┌───────────────────────────┐
│  TAURI RUST ÇEKİRDEĞİ     │
│  - Gömülü RSA Public Key  │
│  - Yerel İmza Doğrulama   │
│  - Süre Dolumu Kontrolü   │
└───────────────────────────┘
```

### A. Donanım Parmak İzi (Hardware Fingerprint):
- Rust tabanlı Tauri çekirdeği işletim sisteminden şu bileşenleri sorgular:
  - Anakart Seri Numarası / UUID (`wmic csproduct get uuid`)
  - CPU Kimliği ve Çekirdek Sayısı
  - Birincil Ağ Kartı MAC Adresi
- Bu veriler tek yönlü bir SHA-256 algoritmasıyla özetlenerek tekil bir **Machine ID** (`NUPER-8F92-BC14-990A`) üretilir.

### B. Çevrimdışı Lisans Dosyası (`.lic`):
- Müşteri Nuper portalına bu Machine ID'yi girer.
- Portal, şirketin gizli RSA-2048 özel anahtarı (`private_key.pem`) ile lisans süresini (30 günlük deneme, 1 yıllık kurumsal abonelik) ve aktif modülleri imzalayarak bir `.lic` dosyası üretir.
- Nuper Citadel'in Tauri çekirdeğinde gömülü bulunan açık anahtar (`public_key.pem`) bu dosyayı yerel olarak saniyeler içinde doğrular. Tersine mühendislik yapılsa dahi özel anahtar olmadan yeni lisans üretilemez.

### C. Lisans Süre Sonu Denetimi:
- Bitiş tarihi geçtiğinde yazılım analitik motorları kilitler; kullanıcıdan yeni bir `.lic` dosyası talep eder.

---

## 2. Girdi Güvenliği ve Geometrik Hata Toleransı (Input Sanitation)

Gerçek dünyada mühendislerin sisteme yükleyeceği STEP dosyaları her zaman temiz NURBS katı gövdeler olmayacaktır.

### A. Bozuk Topoloji ve Açık Yüzey Kontrolü (Non-Manifold Geometry):
- Bazı CAD araçlarından dışa aktarılırken yüzey dikişleri (stitching) kaybolur, model katı (Solid) yerine açık kabuk (Open Shell) olarak gelir; hacim integralinde `NaN` hatası döner.
- **Citadel Çözümü (`cad_parser.py`):**
  - Dosya okunurken ilk adımda `BRepCheck_Analyzer` çalıştırılır.
  - Eğer model kapalı bir katı gövde (`TopAbs_SOLID`) değilse analiz durdurulur ve mühendise net bir yönlendirme mesajı verilir:
    > *"UYARI: Yüklenen modelde yüzey dikişleri eksik, kapalı bir katı gövde oluşturulamadı. Lütfen CAD programınızdan parçayı 'Sew Surfaces' yaparak veya STEP AP214 / AP242 standardında katı gövde olarak dışa aktarınız."*

### B. Büyük Montaj Yönetimi (Assemblies vs. Single Parts):
- Mühendis bazen tek bir braket yerine 50 parçalık bir optik pod montajını yükler.
- **Citadel Çözümü:**
  - Eğer modelde birden fazla katı gövde tespit edilirse sistem:
    1. Kütlesi en büyük olan ana taşıyıcı gövdeyi otomatik "Referans Gövde" olarak işaretler.
    2. Arayüzde 3D sahnede kullanıcıya: *"Montaj tespit edildi. Lütfen analiz edilecek ana taşıyıcı parçayı seçiniz"* listesi sunar.

---

## 3. Hukuki ve Mühendislik Sorumluluk Sınırı (Disclaimer & Liability / EULA)

Savunma sanayiinde bir parçanın testte patlaması veya sahada kaza kırması durumunda yazılım üreticisinin hukuki sorumluluk altında kalmaması zorunludur.

### Yasal Feragatname ve EULA Maddesi:
Nuper Citadel, kurulum ve her analiz çıktısında şu yasal bildirimi bağlar:
> **MÜHENDİSLİK KARAR DESTEK BİLDİRİMİ:**
> *"Nuper Citadel tarafından üretilen PSD spektrum tabloları, FEA sınır koşulu yönergeleri, fikstür tavsiyeleri ve resmi Çevresel Test Planı (ETP) taslakları; mühendislik ekiplerine yönelik bir **'Ön Doğrulama ve Karar Destek Aracı'** olarak lisanslanmıştır.*
> *Bu çıktılar, nihai fiziksel test ve yapısal analiz sorumluluğunu devralmaz. Tasarımın onaylanması, test planının imzalanması ve askeri standartlara nihai uyumluluk kararı tamamen kullanıcı kurumun **sertifikalı sistem ve test başmühendislerinin yetkisi ve yasal sorumluluğundadır**.*
> *Nuper Innovation; simülasyon veya fiziksel test esnasında oluşabilecek malzeme hasarı, fikstür kırılması veya proje gecikmelerinden sorumlu tutulamaz."*

---

## 4. İlk Doğrulama Veri Seti (Golden Test Bench / Ground Truth)

Savunma sanayii müşterilerine (ASELSAN, ROKETSAN, BAYKAR vb.) sunum yaparken en kritik soru şudur: **"Bu sistemin doğru çalıştığını nereden bileceğiz?"**

### Satış Kanıtı ve Kıyaslama (Case Studies):
Citadel'in doğruluğu, daha önce TÜBİTAK SAGE veya TRTEST'te başarıyla kalifiye edilmiş **3 adet gerçek savunma parçası senaryosu** ile kanıtlanır:

| Test Senaryosu | Parça Tipi | Uygulanan Standart | Fiziksel Test Çıktısı | Citadel Doğrulama Sonucu |
| :--- | :--- | :--- | :--- | :--- |
| **Benchmark 1** | Aviyonik Şasi Kutusu (Al 6061-T6) | MIL-STD-810H Cat 14 ($7.7\text{ }g_{\text{rms}}$) | 1. Mod: 318 Hz, $3\sigma$: 135 MPa | Citadel Mod: 324 Hz (%1.8 Sapma), ETP Birebir Uyumlu |
| **Benchmark 2** | Sensör Montaj Braketi (Ti-6Al-4V) | MIL-STD-810H Metot 516.8 ($40\text{ g}, 11\text{ ms}$) | Cıvata Kesme: 14.2 kN | Citadel Analitik: 13.8 kN (%2.8 Sapma) |
| **Benchmark 3** | İHA Pylon Aksamı | Metot 501/502 + 514 (Kombine Termo-Mekanik) | $-40^\circ\text{C}$ Tork Kaybı: %12 | Citadel Preload Uyarısı: %14 Tahmin |

Bu kıyaslama tabloları ve gerçek test grafikleri, yazılımın web sitesindeki ve satış broşüründeki en büyük teknik güven kanıtı (Ground Truth) olacaktır.

---
Bağlantılı Notlar:
- [[00_System_Architecture_Blueprint|Sistem Mimarisi Blueprint]]
- [[Audit_and_Objection_Defense_Engine|Askeri İhale ve Savunma İtirazı]]
- [[00_Nuper_Citadel_MOC|Master MOC]]
