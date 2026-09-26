# 🏭 01. Problem Tanımı ve Pazar Dinamikleri

> **"İmalat sanayiinde talaş kaldırma dakikalar içinde otonom planlanırken; kalite kontrol teftişi 25 yıl önceki manuel tıklama yöntemleriyle üretimi kilitliyor."**

---

## 📌 1. Çözülen Temel İmalat Problemi

Modern talaşlı imalatta (CNC işleme merkezleri) **CAM yazılımları (Mastercam, Siemens NX, PowerMill, hyperMILL)** 3D modeli alır; takım yollarını, paso derinliklerini ve çarpışmasız hareketleri dakikalar içinde simüle edip CNC G-kodunu otomatik basar.

Ancak aynı parça tezgahtan çıkıp **Koordinat Ölçüm Cihazı (CMM)** odasına geldiğinde süreç tamamen çöker:

```
[ CAD / STEP Tasarımı ]
         │
         ▼
[ CAM Yazılımı (Otonom) ] ──────────► [ CNC Tezgahı: Parça İşleme (Dakikalar) ]
                                                            │
                                                            ▼ (Parça CMM Odasına Gelir)
[ CMM Programlama: MANUEL TIKLAMA ] ◄───────────────────────┘
  ├── Her delik ve düzlem için tek tek tıkla
  ├── Kafa açısını (A/B) el yordamıyla çevir
  ├── Yaklaşma vektörünü manuel ayarla
  └── 3 İLA 8 SAAT ZAMAN KAYBI!
```

### A. Zaman Kaybı ve Kapasite Darboğazı
- Bir CMM operatörü veya kalite mühendisi, PC-DMIS veya Calypso ekranı karşısında parçanın 40-50 farklı geometrik unsurunu tek tek fareyle tıklar.
- Her delik için prob kafasını el yordamıyla çevirir (A0B0, A90B-45 vb.), yaklaşma ve geri çekilme mesafelerini girer.
- Karmaşık bir havacılık motor parçası, hidrolik blok veya dişli kutusu gövdesinin programlanması **3 ila 8 saat** sürer.
- CNC tezgahı 1 saatte parçayı üretirken, CMM programı yetişemediği için milyon dolarlık tezgahlar durur veya onay almadan devam eden üretim risk altına girer.

### B. Kaza, Prob Kırılması ve Hurda Maliyeti
- **Maddi Hasar:** Yanlış hesaplanan bir yaklaşma vektörü veya eksik tanımlanan bir emniyet düzlemi nedeniyle probun parçaya veya bağlama pabucuna hızla çarpması durumunda:
  - Renishaw TP20 modülü: ~800$ - 1.200$
  - Renishaw PH10M motorize kafa gövdesi hasarı: ~3.000$ - 6.000$
  - Tezgahın servis ve yeniden kalibrasyon süresi: 2 - 5 iş günü (on binlerce dolar duruş maliyeti).
- **Hatalı Sıfırlama ve Parça Hurdaya Çıkması:** Manuel kaba sıfırlama hatasından dolayı parça yanlış koordinatta ölçülür; tolerans içinde olan 100.000 TL'lik savunma gövdesi "hatalı" damgasıyla hurdaya ayrılabilir.

### C. Mevcut Devlerin (Hexagon & Zeiss) "Otomasyon" Kısıtı
Metroloji devleri (Hexagon PC-DMIS Quick-Inspect, Zeiss Calypso PMI) kendi otomatik kodlama modüllerini sunar. Ancak bu çözümler sahada neredeyse **hiçbir işe yaramaz**:
- **3D PMI / MBD (Model Based Definition) Bağımlılığı:** Bu yazılımların otomatik çalışabilmesi için 3D CAD dosyasının içine Siemens NX veya CATIA lisanslarıyla tek tek gömülmüş kusursuz 3D tolerans verisi (PMI) bulunmalıdır.
- **Saha Gerçeği:** Savunma, havacılık ve otomotiv yan sanayiinde fason üreticiye gelen verilerin **%90'ı "çıplak bir STEP dosyası" ve yanında taranmış "2D PDF Teknik Resim"den ibarettir.**
- Tasarım ofisleri fasoncuya pahalı yerel CAD dosyasını vermez; nötr STEP ve PDF teknik resim gönderir. Mevcut metroloji yazılımları bu 2D PDF'i okuyamadığı için otomasyonları çöker ve operatör yine manuel tıklamaya mahkûm kalır.

---

## 🎯 2. Pazar Konumlandırması (Market Positioning)

Nuper Ortho büyük metroloji devleriyle donanım tarafında yarışmaz; onların devasa yazılımlarının verimsizliğini kapatan ve doğrudan tezgaha yüklenebilir kod üreten bir **"Köprü Zekâ Motoru (CAM-to-CMM Add-on Engine)"** olarak konumlanır.

```
┌─────────────────────────────────────────────────────────────┐
│                    Girdi Verileri                           │
│     [ .STEP 3D Geometri ]  +  [ 2D PDF Teknik Resim ]       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nuper Ortho Desktop                       │
│    (Deterministik Geometri + Yerel GD&T + Kinematik Çözücü) │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌────────────────────────┐            ┌────────────────────────┐
│  PC-DMIS (.dmi / .bas) │            │   Zeiss Calypso / DMIS │
└───────────┬────────────┘            └───────────┬────────────┘
            │                                     │
            ▼                                     ▼
   Hexagon CMM Tezgahı                   Zeiss / Diğer CMM'ler
```

---

## 💰 3. Gelir Modeli ve Fiyatlandırma

| Lisans Türü | Hedef Kitle | Fiyatlandırma | Özellikler |
|---|---|---|---|
| **Node-Locked Kurumsal Lisans** | KOBİ ve Orta Ölçekli Talaşlı İmalat Atölyeleri | **4.000$ – 7.500$ / yıl** (Makine Başı) | Tek CMM tezgahı veya programlama iş istasyonuna donanım kilitli (Hardware ID / Dongle). |
| **Enterprise Floating Lisans** | Büyük Savunma ve Havacılık Fabrikaları (TUSAŞ, ASELSAN tedarikçileri) | **20.000$ – 45.000$ / yıl** (Havuz Lisansı) | Yerel şirket içi ağda (Local LAN) eşzamanlı çoklu kullanıcı, sınırsız post-processor desteği. |
| **Closed-Loop Add-On Modülü** | Yüksek Hacimli Seri İmalat Tesisleri | **Ek 2.500$ / yıl** | CMM ölçüm sapmalarını CNC takım kompanzasyonuna (wear offset) otomatik çeviren entegrasyon. |

### Maliyet - Fayda Analizi (ROI)
- Ortalama bir havacılık fasoncusunda 2 adet CMM tezgahı ve 2 adet tam zamanlı CMM programcısı bulunur.
- Programcıların aylık toplam maliyeti: ~5.000$ - 7.000$.
- Bir parçanın programlama süresinin 4 saatten 30 saniyeye düşmesi, CMM kapasitesini **%300 artırır**.
- Tek bir prob kafası çarpışmasının önlenmesi (3.000$ - 6.000$) dahi yazılımın yıllık lisans bedelini **ilk günden amorti eder.**

---

## 🛡️ 4. Neden Bu Fikir? (Kurucu & Pazar Uyumu / Defensibility)

1. **Aşırı Yüksek Giriş Bariyeri (Moat):**
   - Sıradan bir SaaS veya LLM geliştiricisi prob açısı kinematiğini, ASME Y14.5 Feature Control Frame mantığını, DMIS sözdizimini, granit tabla sıfırlama prosedürünü ve Chebyshev/Gauss fitting algoritmalarını bilmediği için bu pazara giremez.
   - Yazılım hem derin makine mühendisliği/metroloji uzmanlığı hem de modern sistem programlama (Rust, C++, WebGL) yetkinliği gerektirir.
2. **Yüksek Ödeme İsteği (High Willingness to Pay):**
   - Savunma sanayiinde üretilen füzeler, uçak gövde parçaları ve zırhlı araç aktarma organları mikron toleranslarla üretilir.
   - Kalite kontrol departmanı fabrikanın çıkış kapısıdır; burası tıkandığında sevkiyat durur, gecikme cezaları başlar. Bu darboğazı açan bir araca karşı hiçbir bütçe direnci oluşmaz.
3. **Y Combinator "Physical AI" Kriteriyle Birebir Uyum:**
   - YC'nin en çok aradığı alanlardan biri; salt dijital yazılımlardan çıkıp, fiziksel dünyadaki somut makinelerin (CNC, CMM, Robot) otonomlaşmasını sağlayan endüstriyel derin teknolojidir.
   - Nuper Ortho, fabrika zeminindeki somut bir prob kafasının 5 eksenli uzaydaki mikron hareketlerini otonomlaştırır.
