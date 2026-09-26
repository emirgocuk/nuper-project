# 🏭 13. Gerçek Atölye Şartları ve İleri Saha Güvenliği

> **"Parçanın uzaydaki yönelimi çözüldükten sonra, programın sahada operatör müdahalesine gerek kalmadan, tek bir prob kırmadan veya sahte tolerans sapması vermeden çalışabilmesini sağlayan 5 hayati saha parametresi."**

---

## 📌 1. Döküm/Dövme Talaş Payı ve Arama Mesafesi (Stock Allowance & Search Distance)

### 🔴 Kaza Senaryosu:
CAD modeli parçanın işlenmiş nihai (nominal) formunu temsil eder. Ancak tezgaha bağlanan parça kaba talaştan, dökümden veya dövmeden yeni çıkmış olabilir (örneğin yüzeyde $+2.0\text{ mm} - +3.0\text{ mm}$ döküm talaş fazlalığı vardır).
* CMM kontrol ünitesi hızlı intikal hızıyla ($\text{RAPID } 250\text{ mm/sn}$) parçanın $2\text{ mm}$ yakınına inmeyi planlar ve ardından ölçüm hızına ($\text{TOUCH } 3\text{ mm/sn}$) geçmeyi hedefler.
* Yüzeyde $+2.5\text{ mm}$ döküm fazlalığı varsa; prob daha ölçüm hızına geçemeden **$250\text{ mm/sn}$ hızla katı malzemeye çarpar ve prob şaftı tuzla buz olur**.

### 🟢 Yazılım Çözümü:
1. **İşleme Durumu Seçimi (Stock State Toggle):**
   * Arayüze iki çalışma modu eklenir:
     * `Finish Machined` (Hassas İşlenmiş - Standart paylar).
     * `Raw Stock / Casting` (Kaba Döküm/Dövme - Genişletilmiş zarf).
2. **Dinamik Yaklaşma ve Arama Mesafeleri:**
   * Döküm modu seçildiğinde DMIS parametreleri otomatik genişletilir:
   ```plaintext
   $$ DOKUM / KABA PARCA GUVENLIK BLOKLARI
   SNSET/APPRCH, 12.0000  $$ Parçaya 12 mm kala yavaşlama başlar
   SNSET/SEARCH, 10.0000  $$ Nominalden 10 mm önce temas aramaya başlar
   SNSET/RETRCT, 8.0000   $$ Geri çekilme mesafesi 8 mm'ye çıkarılır
   ```

---

## 🧪 2. Yakut Bilye Malzeme Sıvanması (Ruby Ball Pick-up / Adhesion)

### 🔴 Fiziksel Hata Mekanizması:
Havacılık ve savunma parçalarında yaygın olarak kullanılan alüminyum (6000 ve 7000 serisi) alaşımları işlenirken en sık yaşanan gizli metroloji hatasıdır:
* Standart yakut ($\text{Al}_2\text{O}_3$) bilyeler, alüminyum parçalara sürekli vurduğunda mikron düzeyinde alüminyum atomları yakutun yüzeyine kimyasal olarak sıvanır (adhesion/pick-up).
* 50 parçalık bir seri ölçümün sonunda yakut bilyenin efektif çapı $4.000\text{ mm}$'den $4.015\text{ mm}$'ye çıkar.
* **Sonuç:** CMM bilyenin büyüdüğünü bilmediği için ölçülen tüm delikleri **$15\ \mu\text{m}$ daha küçük** raporlar; sağlam parçalar haksız yere hurdaya çıkar.

```
       [ Normal Yakut ]                     [ Alüminyum Sıvanmış Yakut ]
        Ø = 4.000 mm                             Ø = 4.015 mm (+15 µm Hata!)
        ┌──────────┐                             ┌──────────┐
        │  Temiz   │                             │  Alüminyum│
        │  Yakut   │                             │  Tabakası │
        └──────────┘                             └──────────┘
```

### 🟢 Yazılım Çözümü:
1. **Malzeme Bazlı Prob Ucu Uyarısı:**
   * Operatör parça malzemesini Alüminyum seçtiğinde sistem doğrudan ikaz basar:
   * ⚠️ *"Uyarı: Alüminyum alaşımlarında yapışmayı (pick-up) önlemek için Yakut yerine Silikon Nitrür ($\text{Si}_3\text{N}_4$) prob ucu kullanılması zorunludur."*
2. **Otomatik Yeniden Kalibrasyon Bloğu (`REQUAL`):**
   * Seri üretim döngülerinde her $N$ parçada bir probun referans kalibrasyon küresine gidip çapını teyit etmesini sağlayan kontrol rutini gömülür:
   ```plaintext
   IF/(CYCLE_COUNT .GT. 25)
     CALIB/SPHERE, QUAL, F(CALIB_SPHERE)
     ASSIGN/CYCLE_COUNT = 0
   ENDIF
   ```

---

## 🔩 3. Çok Gövdeli Montaj STEP Dosyaları (Multi-Body & Fasteners Filtering)

### 🔴 Problem:
Tasarım ofisinden gelen STEP dosyası nadiren tek bir katı gövdeden ibarettir. Genellikle montaj montaj modelinde preslenmiş burçlar, helicoil yaylar, montaj cıvataları veya pimler de katı gövde olarak yer alır.
* B-Rep ayrıştırıcı parçadaki her silindiri ölçmeye kalkarsa; cıvatanın metrik diş profilini, yay kıvrımlarını veya $0.5\text{ mm}$'lik mikro montaj pahlarını teftiş unsuru sanıp yüzlerce anlamsız prob rotası üretir.

### 🟢 Çözüm Mimarisi: Hedef Katı İzolasyonu ve Geometrik Filtreleme

1. **Katı Gövde Hacim Sıralaması (Volume Sorting):**
   * STEP dosyasındaki tüm bağımsız katılar (`TopoDS_Solid`) hacimlerine göre sıralanır:
   $$\text{Volume}(\text{Solid}_1) > \text{Volume}(\text{Solid}_2) > \dots$$
   * En büyük ana gövde otomatik olarak `Primary Workpiece` seçilir; bağlantı elemanları arka plana atılır.
2. **Geometrik Gürültü Eşiği (Noise Threshold):**
   * Genişliği $< 1.0\text{ mm}$ olan mikro pahlar ve standart metrik cıvata vida adımları (pitch) filtre algoritmasıyla ölçüm listesinden otomatik düşürülür.
3. **Kullanıcı Onayı:**
   * Arayüzde tespit edilen diğer gövdeler (ör. presli bronz burç) *"Ölçüme dahil edilsin mi?"* seçeneğiyle operatöre listelenir.

---

## 🚀 4. Makine Güvenli Park ve Başlangıç Pozisyonu (Home/Park Handshake)

### 🔴 Kaza Senaryosu:
Her CMM operatörü tezgaha parçayı bağlarken prob kafasını tablanın rastgele bir köşesinde (sol üstte, arkada vs.) bırakmış olabilir.
* Üretilen programın ilk satırı doğrudan parçanın üzerindeki emniyet noktasına gitmekse (`GOTO / X100, Y100, Z150`); kafa bulunduğu yerden o noktaya doğrudan **çapraz (diagonal)** bir hatla iner.
* Bu çapraz iniş esnasında prob, granit tablaya dikilmiş yüksek bir bağlama kulesine veya parçanın arka cidar kütlesine çarparak kırılır.

### 🟢 Yazılım Çözümü: "Z-First Absolute Traversal" Kuralı

Derleyicinin ürettiği her programın ilk ve son hareketleri katı bir kurala bağlanır:

```
[ Kafa Başlangıç Noktası (Rastgele) ]
                 │
                 ▼ 1. Önce Z Ekseninde En Tepeye Çıkış (Z_max - 10mm)
[ Makine Tavan Güvenlik Düzlemi ]
                 │
                 ▼ 2. Yatayda (X/Y) Parçanın Üstüne İntikal
[ Parça Clearance Box Üstü ]
                 │
                 ▼ 3. Parçaya Yalnızca Dikey (Z) İniş
[ İlk Ölçüm Noktası ]
```

```plaintext
$$ ============================================================
$$ GUVENLI BASLANGIC VE PARK EL SIKISMASI (Z-FIRST TRAVERSAL)
$$ ============================================================
$$ 1. Bulunulan noktadan bagimsiz olarak Z eksenini tavana cek
GOTO/CART, CURRENT_X, CURRENT_Y, 750.0000

$$ 2. Guvenli tavanda parca merkezine intikal et
GOTO/CART, 150.0000, 200.0000, 750.0000

$$ 3. Parcanin +50mm Clearance Box emniyet kutusuna dikey in
GOTO/CART, 150.0000, 200.0000, 200.0000
```

---

## 🔒 5. Denetim İzi ve Değiştirilemezlik (Tamper-Proof Audit Trail / AS9100 Rev D)

### 🔴 Regülasyon Kuralı:
Savunma ve havacılık ana yüklenicilerinde (Lockheed Martin, Airbus, ASELSAN, TUSAŞ) ölçüm programlarının manipüle edilmesine karşı katı regülasyonlar uygulanır.
* Bir parça hatalı çıktığında, operatörün metin düzenleyiciyle DMIS dosyasını açıp tolerans değerini $0.02\text{ mm}$'den $0.05\text{ mm}$'ye elle yükseltmesi ve parçayı sahte olarak sağlam göstermesi kesinlikle engellenmelidir.

### 🟢 Yazılım Çözümü: Kriptografik SHA-256 Hash ve Dijital İmza

1. **Geometrik Veri Özeti (Hash Generation):**
   * Üretilen her DMIS kodunun son satırına, program içeriğindeki tüm koordinat ve tolerans değerlerinden hesaplanan **SHA-256 Dijital İmzası** gömülür:
   ```plaintext
   $$ ============================================================
   $$ METROLOGICAL INTEGRITY & AUDIT TRAIL
   $$ HASH: a9f8e4b7c12d3e5f6081a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3
   $$ TIMESTAMP: 2026-09-26T14:00:00Z
   $$ SIGNATURE: VALIDATED_BY_AUTOMETROL_CORE_V0.1
   $$ ============================================================
   ```
2. **Rapor Doğrulama Kilidi:**
   * CMM ölçüm raporu ürettiğinde, bu hash değeri programla karşılaştırılır. Eğer dosyada tek bir karakter veya tolerans elle değiştirilmişse hash uyuşmazlığı tespit edilir ve rapor **"TAMPERED / GEÇERSİZ ÖLÇÜM"** olarak işaretlenerek sisteme kilit vurulur.
