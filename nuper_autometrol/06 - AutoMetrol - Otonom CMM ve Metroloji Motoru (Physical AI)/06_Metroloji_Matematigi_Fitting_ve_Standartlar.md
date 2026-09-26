# 📐 06. Metroloji Matematiği, Fitting Algoritmaları ve Standartlar

> **"Dokunulan ham koordinatlardan mikron altı doğrulukta ideal geometri çıkaran fitting algoritmaları (Gauss, Chebyshev); prob esneme fiziği, tarama vs. dokunmatik ayrımı ve PTB/NIST akreditasyonu."**

---

## 📌 1. Ham Noktalardan Geometriye: En İyi Uyum (Fitting) Algoritmaları

CMM probunun parçaya dokunduğu noktalar doğrudan ölçüm sonucu değildir; bu ayrık temas noktalarından geçen ideal geometrinin (daire, silindir, düzlem) matematiksel olarak optimize edilmesi gerekir.

Yanlış fitting algoritması seçilirse, tolerans içinde olan bir delik hatalı çıkabilir veya tam tersi montajda birbirine girmeyen parçalar tezgaha göre sağlam görünebilir.

```
       [ Ham Temas Noktaları (x_i, y_i, z_i) ]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ Gauss (En Küçük Kareler) ]    [ Chebyshev (Maksimum İç Teğet) ]
  • Ortalama boyutu bulur          • Deliğe giren en büyük pimi bulur
  • Genel toleranslar için         • H7 hassas delikler için zorunlu!
```

---

## 🧮 2. Temel Fitting Algoritması Çeşitleri

### A. En Küçük Kareler (Least Squares - Gauss)
- **Mantık:** Ölçülen tüm noktaların ideal geometriye olan radyal mesafelerinin kareler toplamını minimize eder:
  $$\sum_{i=1}^{n} (r_i - R)^2 \to \min$$
- **Kullanım:** Standart serbest toleranslı düzlemler, dış yüzeyler ve ortalama boyut tayini.

### B. Maksimum İç Teğet (Maximum Inscribed - Chebyshev)
- **Mantık:** Ölçülen temas noktalarının oluşturduğu sınırların içine sığabilecek **en büyük kusursuz pimi (çemberi/silindiri)** hesaplar.
- **Saha Gerçeği:** Dişi delikler ve geçme toleransları ($\varnothing 20\text{ H7}$) için zorunludur. Eğer standart Gauss kullanılırsa, deliğin içindeki çapak veya form bozukluğu ortalamaya katılır ve delik olduğundan geniş görünür. Montaj hattında pim deliğe girmez!
- **DMIS Kodu Çıktısı:**
  ```plaintext
  F(DELIK_H7) = FEAT/CYLNDR,IN,CART, 50.0, 50.0, 30.0, 0.0, 0.0, 1.0, 20.000, 25.000
  T(TOL_CAP) = TOL/DIAM, 20.000, 0.021, 0.000
  EVAL/FA(DELIK_H7), TA(TOL_CAP), ALGOR/MINSC  $$ Chebyshev / Inscribed
  ```

### C. Minimum Dış Teğet (Minimum Circumscribed)
- **Mantık:** Ölçülen erkek silindirin (mil veya faturanın) dışına geçebilecek **en dar kusursuz bileziği** hesaplar.
- **Kullanım:** Şaft ve mil geçme toleransları (h6, g6).

### D. Minimum Bölge (Minimum Zone - Form Toleransları)
- **Mantık:** İki paralel düzlem veya iki eşmerkezli silindir arasındaki mesafeyi minimize eder.
- **Kullanım:** Düzlemsellik (Flatness), Doğrusallık (Straightness) ve Silindiriklik (Cylindricity).

---

## 🔬 3. Dokunmatik Ölçüm (Touch-Trigger) vs. Kesintisiz Tarama (Continuous Scanning)

Atölyelerde iki temel prob teknolojisi kullanılır:

| Özellik | Dokunmatik (Touch-Trigger: TP20 / TP200) | Analog Tarama (Scanning: SP25M / Renishaw REVO) |
|---|---|---|
| **Çalışma Prensibi** | Parçaya tek tek dokunup mikro switch açar. | Yüzeye oturur ve kesintisiz sürünerek nokta toplar. |
| **Örnekleme Hızı** | Saniyede 1 – 2 nokta. | Saniyede 500 – 1.000 nokta. |
| **Form Hatası Riski** | 4 noktada üçgenleşmiş (lobing) bir delik kusursuz dairesel sanılabilir. | Gerçek yüzey dalgalanması eksiksiz haritalanır. |
| **Standart Kuralı** | ISO 12180 gereği delikte minimum 8-12 nokta alınmalıdır. | Spiral veya dairesel tarama yolu üretilir. |
| **DMIS Direktifi** | `MEAS/CYLNDR, F(DELIK), 8` ... `PTMEAS/...` | `SCNMOD/CENT` <br> `SCNPATH/CIRCLE, ...` |

AutoMetrol, seçilen kafa profiline göre SP25M takılıysa doğrudan dairesel tarama kodu (`SCNPATH`), TP20 takılıysa 2 derinlikte 8-12 diskret temas noktası üretir.

---

## ⚡ 4. Prob Esnemesi ve Tetikleme Öncesi Hata (Pre-Travel & Probe Deflection)

Touch-trigger problar (TP20) parçaya dokunduğu anda sinyal üretmez; içerisindeki kinematik 3 ayaklı yay mekanizmasının elektrik devresini kesebilmesi için şaftın mekanik olarak esnemesi (deflection) gerekir:

```
        Yüzeye Tam Dik Temas (90°)           Yüzeye Açılı Temas (35°)
        ┌───────────────────────┐            ┌───────────────────────┐
        │  Esneme: ~1.2 mikron  │            │  Esneme: ~5.8 mikron  │
        │  (Yazılımla Dengeli)  │            │  (4.6 µm ÖLÇÜM HATASI)│
        └───────────────────────┘            └───────────────────────┘
```

- **Fiziksel Sorun:** Açı dik olmadığında prob şaftı yana doğru bükülür ve CMM kontrol ünitesi parçanın koordinatını $2\text{ ila }8\ \mu\text{m}$ hatalı okur.
- **AutoMetrol Kuralı:** Temas vektörü ($\vec{V}_{\text{touch}}$), yüzeyin lokal normal vektörüne ($\vec{N}_{\text{surface}}$) daima birebir paralel ve zıt yönde kilitlenir:
  $$\vec{V}_{\text{touch}} \cdot \vec{N}_{\text{surface}} = -1.000$$

---

## 🪶 5. İnce Cidarlı Parçalar ve Prob Kuvvet Deformasyonu

Havacılık braketlerinde veya sac metal parçalarda et kalınlığı $1.0\text{ mm} - 2.5\text{ mm}$ seviyesine inebilir.
- **Fiziksel Risk:** Standart TP20 modülü parçaya $0.08\text{ N} - 0.10\text{ N}$ kuvvet uygular. İnce cidar bu kuvvet altında mikron düzeyinde esner; delik veya cidar basık ölçülür.
- **Sistem Müdahalesi:**
  1. Geometri motoru cidar kalınlığının $< 2.5\text{ mm}$ olduğunu tespit ederse operatörü uyarır: *"İnce cidar tespit edildi. Low Force (LF) prob modülü kullanılması tavsiye edilir."*
  2. DMIS kodunun içine yaklaşma hızını düşüren direktif eklenir:
     ```plaintext
     SNSET/APPRCH, 1.5000  $$ Hız düşürülerek dinamik temas darbesi söndürülür
     ```

---

## 📜 6. Metroloji Akreditasyonu ve PTB / NIST Standart Test Veri Setleri

Savunma ve havacılık sektörlerinde kalite direktörlerinin ilk sorusu şudur: *"Yazılımınızın hesapladığı silindir ve düzlemin doğruluğunu nasıl garanti ediyorsunuz?"*

### Akreditasyon Metodolojisi:
1. **PTB (Physikalisch-Technische Bundesanstalt - Almanya):** Alman Ulusal Metroloji Enstitüsü'nün yayınladığı açık referans koordinat veri setleri (Reference Data Sets for Geometric Tolerancing).
2. **NIST (National Institute of Standards and Technology - ABD):** Özel form bozukluğuna sahip standart test noktaları.
3. **Doğrulama Sertifikası (Validation Certificate):** AutoMetrol'ün Rust matematik çekirdeği PTB veri kümeleriyle birim testlere (unit tests) sokulur. Algoritmaların hata payının $10^{-6}\text{ mm}$ (nanometre) altında olduğu belgelenerek müşteriye resmi test raporu olarak sunulur.

---

## 🏛️ 7. Uluslararası Standartlar ve Belirsizlik Yönetimi

| Akademik / Endüstriyel Konu | Referans Standart | Koddaki Algoritmik Karşılığı |
|---|---|---|
| **Belirsizlik & Simülasyon** | **ISO 15530-3 / GUM** | Sanal CMM Monte Carlo simülasyonu ve Test Belirsizlik Oranı ($\text{TUR} \ge 4:1$) kontrolü |
| **Uç Değer & Filtreleme** | **ISO 16610-21 / 31** | Robust Gaussian profil filtresi ve 3-Sigma çapak/toz ayıklama |
| **Datum Kinematiği** | **ISO 5459 / ISO 1101** | $A \mid B \mid C$ datum önceliği ve 6 Serbestlik Derecesi (DoF) rank analizi matrisi |
| **CAD Veri Protokolü** | **ISO 10303 (AP214 / AP242)** | STEP AP242 doğrudan semantik PMI okuma; AP214'te 2D PDF Vision-LLM fallback |
| **Kalite Karar Eşiği** | **ISO 14253-1** | Guard-Banding ($[LSL + U, USL - U]$) ile şüpheli sınır toleransı koruması |

