# Nuper Ortho — Ürün Bağlamı ve Deneyim Tasarımı (Product Context)

## 1. Nuper Ortho Neden Var?

Yüksek hassasiyetli imalatta (havacılık, savunma, hassas mekanik) Koordinat Ölçüm Cihazları (CMM), fabrikanın en kritik kalite kapısıdır. CNC frezeler bir parçayı 45 dakikada işleyip bitirirken, parça kalite kontrol odasına geldiğinde süreç tamamen tıkanır:

1. **Fabrika Zeminindeki Darboğaz:** Parça CMM odasında 4 ila 8 saat boyunca kıdemli bir ölçüm teknisyeninin ekranda tek tek delik tıklamasını ve el yordamıyla kafa açısı aramasını bekler. Bu esnada milyon dolarlık CNC tezgahları ilk parça onayı (FAI) alamadığı için boş yatar.
2. **Kaza Korkusu ve Yavaşlatılmış Çevrim:** Hızlı intikal hızlarında ($200 - 300\text{ mm/sn}$) $5.000$'lık motorize kafayı (Renishaw PH10M) parçaya veya çelik bağlama pabucuna çarpma korkusu, operatörleri programları %20 - %30 potansiyometre hızında çalıştırmaya iter.
3. **MBD ve 3D PMI Hayali:** Metroloji devlerinin (Hexagon PC-DMIS Quick Inspect, Zeiss Calypso PMI) otomatik kodlama modülleri yalnızca 3D CAD dosyasının içine gömülmüş kusursuz tolerans verisi (MBD/PMI) varsa çalışır. Fason imalatçıların önüne gelen dosyaların %90'ı ise çıplak bir STEP dosyası ve kağıt çıktısı alınan 2D PDF teknik resimden ibarettir.

Nuper Ortho, çıplak STEP dosyası ile 2D PDF teknik resmi deterministik bir geometri ve emniyet motoruyla birleştirerek bu 25 yıllık verimsizliği ortadan kaldırmak için doğmuştur.

---

## 2. Hedef Kullanıcı Personaları

### A. Kıdemli CMM Metroloji Mühendisi
- **Günlük Çilesi:** Mesaisinin %70'ini sıradan 40-50 deliği tek tek tıklayarak, yaklaşma vektörlerini el yordamıyla düzelterek geçirir. Katma değerli kök neden analizine vakit bulamaz.
- **Beklentisi:** Parçayı attığı anda güvenli bir taslak program ve hatasız H7 Chebyshev silindir fittingi alması; karmaşık açıları yazılımın optimize etmesi.

### B. CNC Tezgah Operatörü / Atölye Teknisyeni
- **Günlük Çilesi:** CMM kodlamayı bilmez. Parçayı bağlayıp onay alamazsa CNC tezgahı bekler.
- **Beklentisi:** Parçayı tablaya nasıl bağlayacağını, hangi prob ucunu takacağını ve joystick ile hangi 3 noktaya dokunarak sıfır alacağını gösteren tek sayfalık, resimli, net bir **PDF Kurulum Föyü (Setup Sheet)**.

### C. Fabrika Sahibi ve Kalite Kontrol Müdürü
- **Günlük Çilesi:** Kırılan prob faturaları ($2.000 - $6.000), kalibrasyon nedeniyle 3-5 gün duran CMM tezgahı, hatalı sıfırlama yüzünden haksız yere hurdaya çıkan yüz binlerce liralık gövdeler.
- **Beklentisi:** Sıfır çarpışma garantisi, askeri standartlarda AS9100 denetim izi (SHA-256 imzası) ve internete bağlanmayan (air-gapped) güvenli yerel yazılım.

---

## 3. Uçtan Uca Kullanıcı Deneyimi ve İş Akışı

```
[ STEP 3D CAD Modeli ]  +  [ 2D PDF Teknik Resim ]
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Sürükle-Bırak İçe Aktarma (< 2 saniye)                   │
│ • B-Rep topolojisi ayrıştırılır (düzlemler, silindirler).   │
│ • 2D PDF toleransları kademeli OCR/AI ile okunur.           │
│ • Dişli delikler tespit edilir ve otomatik baypas edilir.   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Rehberli Hizalama & Pabuç İşaretleme (< 30 saniye)       │
│ • Sistem 6-DoF kilitlenmesi için en kararlı 3-2-1'i önerir.  │
│ • Operatör çelik pabuçların üzerine 3D kutu çizer (Keep-Out)│
│ • CMM makine strok sınırları arka planda doğrulanır.        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Tek Tıkla Sentez & Dijital İkiz Doğrulaması (< 5 saniye) │
│ • Renishaw PH10 için minimum dönüşlü 720 açı çözülür.       │
│ • GJK/EPA süpürülmüş hacim çarpışma simülasyonu koşar.      │
│ • Operatör ekranda yeşil emniyetli prob rotasını izler.     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Tezgaha Aktarım ve Kurulum Föyü                          │
│ • PC-DMIS (.dmi/.bas) veya Calypso planı dışa aktarılır.    │
│ • 1 sayfalık resimli PDF Setup Sheet yazdırılır.             │
│ • Operatör tezgaha yükler, joystick ile 3 temas alır, DCC   │
│   modunda %100 hızla sıfır korkuyla programı çalıştırır.    │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Tasarım, Arayüz ve Ergonomi İlkeleri

1. **Solid Slate Light Paleti:**
   Kalite kontrol laboratuvarlarının florasan aydınlatması altında, beyaz teknik resim kağıdı ile ekran arasında gözün kamaşmasını ve yorulmasını önleyen açık gri `#F1F5F9` zemin, saf beyaz paneller ve $1\text{px}$ slate kenarlıklar.
2. **Sıfır Kriptik Kod Zorunluluğu:**
   Operatör ekranda asla `FEAT/CYLNDR,IN,CART` gibi karmaşık DMIS sözdizimi görmek zorunda bırakılmaz. Süreç görsel modeller üzerinden yönetilir; DMIS konsolu dileyen uzmanlar için alt çekmecede opsiyonel olarak yer alır.
3. **Varsayılan Olarak Hata Korumalı (Fail-Safe by Default):**
   Bir delik prob şaftı için çok derinse, kafa açısı kalibre edilmemişse veya pabuç mesafesi şüpheliyse sistem asla tahmin yürütmez; ilgili unsuru sarı/kırmızı ile işaretleyerek açık ve net bir mühendislik tavsiyesi sunar.
4. **Hafif Masaüstü Ayak İzi (80 – 150 MB RAM):**
   Tauri 2.0 ve Rust omurgası sayesinde 1 saniyenin altında açılır. Three.js viewport'unda on-demand rendering işletilir; model döndürülmediğinde GPU tüketimi tam olarak **%0**'dır.
