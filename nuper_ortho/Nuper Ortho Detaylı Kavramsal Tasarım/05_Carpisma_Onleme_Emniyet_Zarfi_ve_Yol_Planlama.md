# 🛡️ 05. Çarpışma Önleme, Emniyet Zarfı ve Yol Planlama

> **"Parçanın etrafına dinamik emniyet kutusu (Clearance Box) ören; pabuç ve fikstürleri 3D yasaklı bölge (Keep-Out Zone) olarak atlayan; prob şaftı sürtünmesini ve kenar çapak tuzaklarını engelleyen kaza-önleyici rota planlayıcı."**

---

## 📌 1. CMM Kazalarının Anatomisi

CMM laboratuvarlarında prob kırılmaları ve kafa hasarları (%95 oranında) yüzeye temas anında değil; **bir delikten çıkıp diğer deliğe geçerken prob gövdesinin parçaya, fikstüre veya pabuca çarpmasıyla** gerçekleşir.

CMM eksenleri hızlı intikalde (rapid feed) $200 - 300\text{ mm/sn}$ hızla hareket eder. Yanlış bir $Z$ seviyesi veya hatalı bir geri çekilme vektörü probu saniyeler içinde kırar ($2.000$ - $6.000$ dolar hasar).

```
         [ Emniyet Düzlemi: Clearance Box (+50mm) ]
                  ▲                             │
                  │ (Geri Çekilme: +5mm)        │ (Hızlı İntikal: 250 mm/sn)
                  │                             ▼
          [ Temas Noktası 1 ] ────────► [ Temas Noktası 2 ]
     ════════════════════════════════════════════════════════════
                  İşlenmiş Parça / Metal Gövde
```

---

## 📦 2. Dinamik Emniyet Zarfı (Clearance Box)

Nuper Ortho, parça sınırlarını ($X_{\min}, X_{\max}, Y_{\min}, Y_{\max}, Z_{\max}$) aldıktan sonra çevresine sanal bir koruma kabuğu örer:

1. **Üst Emniyet Seviyesi ($Z_{\text{clearance}}$):**
   $$Z_{\text{clearance}} = Z_{\max} + 50.0\text{ mm}$$
2. **Yanal Emniyet Seviyeleri ($X/Y_{\text{clearance}}$):**
   $$X_{\text{offset}} = 30.0\text{ mm}, \quad Y_{\text{offset}} = 30.0\text{ mm}$$
3. **Geri Çekilme Protokolü ($R_{\text{retract}}$):**
   Prob yüzeye dokunduktan sonra anında yana hareket edemez. Yüzeyin ters normali yönünde $5.0\text{ mm}$ geri çekilir (Retract):
   $$\vec{P}_{\text{retract}} = \vec{P}_{\text{touch}} + 5.0 \cdot \vec{N}_{\text{surface}}$$
4. **İntikal Hiyerarşisi:**
   Farklı bir geometrik unsura veya delik grubuna geçilirken prob önce $Z_{\text{clearance}}$ seviyesine tırmanır, yatay hareketini tamamen bu güvenli düzlemde yapar, ardından yeni yüzeye dik olarak iner.

---

## 🗜️ 3. Bağlama Pabuçları ve Fikstür Yasaklı Bölgeleri (Keep-Out Zones)

Parça granit tablaya yapıştırılmaz; çelik pabuçlar (clamps), modüler kuleler veya mengenelerle sabitlenir. STEP dosyasında bu pabuçlar görünmez.

```
       [ Prob Rotası: Pabuç Üzerinden +40mm Atlama ]
             ╭──────────────────────╮
             │                      │
             ▼                      │
       [ Ölçüm Yüzeyi ]      ┌──────────────┐
     ══════════════════════  │ Çelik Pabuç  │ ════════════════
                             │ (Clamp Box)  │
                             └──────────────┘
```

### Nuper Ortho Çözümü:
- **3D Etkileşimli Kanvas:** Operatör arayüzde parçanın üzerine basan pabuçların yerini fareyle 3D sınırlayıcı kutu (Bounding Box) olarak işaretler (örneğin 4 adet köşe pabucu).
- **Atlama Zarfı (Leap Envelope):** Rota planlayıcı bu kutuları mutlak engel ilan eder. Pabuçların üzerinden geçerken rota otomatik olarak pabuç yüksekliğinin $+40\text{ mm}$ üzerine çıkar ve engeli atlar.

---

## 🔴 4. Kalıcı Statik Engeller (Kalıcı Keep-Out Zones)

Granit tabla üzerinde parçadan bağımsız olarak duran sabit bileşenler vardır:
1. **Referans Kalibrasyon Küresi (Qualification Sphere):** Granit tablanın sağ veya sol köşesinde dikilen çelik bilyeli sütun.
2. **Prob Magazini (MCR20 Stylus Changing Rack):** Tablanın arka kenarında duran manyetik prob yuvaları.
3. **CMM Granit Sütunları ve Limitleri:** Makinenin $X_{\text{limit}}, Y_{\text{limit}}, Z_{\text{limit}}$ mutlak hareket sınırları.

Nuper Ortho tezgah profilinde bu koordinatlar **"Kalıcı Statik Engel"** olarak tanımlanır. Rota üretilirken bu hacimlerin içine hiçbir şartta yaklaşma veya intikal kodu üretilmez.

---

## 📏 5. Prob Şaftı ve Gövde Çarpışma Doğrulaması (Shank vs Tip Contact)

Ölçüm temasını probun ucundaki yakut bilye (Ruby Ball) almalıdır. Derin deliklerde veya dikey duvar diplerinde yakut bilye temas etmeden önce probun çelik şaftı (stem) veya gövdesi parçaya çarpabilir.

```
       [ TP20 Prob Gövdesi: ∅13.5 mm ]  ──► Emniyet Açıklığı ≥ 1.5 mm
                   │
                   │ (Şaft Boyu L_stem)
                   │
         [ Çelik Şaft: ∅1.5 mm ]
                   │
             (●) [ Yakut Bilye: ∅2.0 mm / ∅4.0 mm ]
```

### Matematiksel Kısıt Formülü:
Maksimum güvenli ölçüm derinliği prob şaft geometrisine bağlıdır:

$$\text{Derinlik}_{\max} < L_{\text{stem}} - \frac{D_{\text{ball}} - D_{\text{stem}}}{2}$$

- **Çarpışma Kontrolü:** Nuper Ortho prob modelini (Yakut Bilye + Şaft Silindiri + TP20 Gövde Silindiri) 3 boyutlu birleştirilmiş silindir gövde olarak modeller.
- Parçanın duvarları ile prob gövdesi arasında minimum **$1.5\text{ mm}$ emniyet mesafesi** kalmadığı durumlarda o kafa açısını iptal eder veya operatöre uzatma çubuğu (Extension Bar) önerir.

---

## ⚠️ 6. Çapak, Talaş ve Radyus Tuzakları (Feature Boundary Offset)

CAD modelinde yüzey sınırları matematiksel olarak keskindir ($R = 0.000\text{ mm}$). Ancak işlenmiş gerçek parçada:
- Dış kenarlarda freze çapağı veya köşe pahı,
- İç köşelerde takım radyusu ($R1, R2$),
- Yüzeyde freze tarama takım izleri bulunur.

### Saha Gerçeği:
Eğer prob noktası yüzeyin dış sınırına çok yakın (örneğin $0.3\text{ mm}$) atılırsa, yakut bilye düzleme değil çapağa veya pah kırığına çarpar. Parçanın düzlemselliği $0.01\text{ mm}$ olması gerekirken $0.12\text{ mm}$ çıkar ve hatasız parça reddedilir.

### Emniyet Marjı Kuralı (Margin Offset):
Nuper Ortho, ölçüm noktalarını yüzey sınırlarından içeriye doğru zorunlu bir güvenlik marjıyla sınırlar:

$$\text{Margin Offset} \ge R_{\text{probe\_ball}} + 1.5\text{ mm}$$

Noktalar daima yüzeyin topolojik iç çekirdeğine dağıtılarak çapak ve radyus tuzakları tamamen elenir.
