# 🧭 12. Otonom Hizalama ve Sıfırlama Öneri Motoru (Auto-Alignment Engine)

> **"Operatörün parça başında en çok zaman harcadığı ve hata yaptığı 'Hizalama (Alignment / Sıfırlama) stratejisi' kararını ortadan kaldıran; STEP modelini analiz ederek 6 serbestlik derecesini (6-DoF) en kararlı şekilde kilitleyen otonom 3-2-1 öneri motoru."**

---

## 📌 1. Sahadaki Problem: Operatör İkilemi

Geleneksel CMM yazılımlarında (PC-DMIS, Zeiss Calypso, Mitutoyo MCOSMOS) parçayı granit tablaya bağlayan teknisyen şu sorularla baş başa kalır:
* *"Önce üst yüzeyi mi almalıyım, yoksa merkezdeki büyük silindiri mi?"*
* *$X$ eksenini döküm yan kenardan mı çevirmeliyim, yoksa işlenmiş iki delik merkezinden mi?*
* *Yanlış bir yüzeyi referans alırsam açısal sapma parçanın diğer ucunda kaç mikron hata yaratır?*

Tecrübesiz bir operatörün yanlış referans seçmesi; parçanın tüm koordinat sistemini çarpık kurarak tolerans içindeki parçaların hurdaya çıkmasına veya probun çarpmasına yol açar.

---

## 🧮 2. Kararlılık ve Erişilebilirlik Puanlama Motoru (Stability & Accessibility Engine)

AutoMetrol, STEP dosyasını yüklediği anda geometriyi tarar ve 6 serbestlik derecesini ($T_x, T_y, T_z, R_x, R_y, R_z$) en düşük açısal hata yayılımıyla (error propagation) kilitleyecek en kararlı elemanları puanlar:

### 1. Primer Referans Seçimi (Düzlem $\to$ 3 Serbestlik Derecesi: $R_x, R_y, T_z$)
* **Kural:** Parçanın uzamsal yönelimini (spatial leveling) ve $Z$ sıfırını kilitler.
* **Puanlama Fonksiyonu:**
  $$\text{Score}_{\text{primary}} = w_1 \cdot \text{Area} + w_2 \cdot (\vec{n} \cdot \vec{z}_{\text{up}}) + w_3 \cdot \text{Span}$$
  * $\text{Area}$: Yüzey alanı ne kadar büyükse stabilite o kadar artar.
  * $\vec{n} \cdot \vec{z}_{\text{up}}$: Normali tabladan yukarı bakan ($+Z$) yüzeyler filtrelenir.
  * $\text{Span}$ (Açıklık/Aspect Ratio): Temas noktaları ne kadar geniş bir üçgene yayılırsa açısal hata o kadar düşer.

### 2. Sekonder Referans Seçimi (Çizgi veya 2 Delik $\to$ 2 Serbestlik Derecesi: $R_z, T_y$)
* **Kural:** $XY$ düzlemindeki dönüşü ($R_z$) ve bir eksendeki ötelemeyi ($T_y$) kilitler.
* **Senaryo A (Prizmatik Parça - Düzlem-Çizgi-Nokta):**
  * Primer düzleme tam dik ($90^\circ \pm 0.5^\circ$) olan en uzun düzlemsel kenar seçilir.
  * *Öneri:* "Ön uzun kenara 2 nokta dokunarak Çizgi oluştur ve bunu $X$ eksenine doğrult."
* **Senaryo B (Flanş / Gövde Parçası - Düzlem-2 Delik):**
  * Eğer parça üzerinde iki adet işlenmiş bağlantı deliği varsa; pürüzlü yan kenar yerine iki delik merkezini birleştiren eksen metrolojik olarak çok daha kararlıdır.
  * *Öneri:* "Merkezdeki $\varnothing 30$ delik ile kenardaki $\varnothing 12$ referans deliğini al; delik merkezlerini birleştiren vektörü $X$ eksenine çevir."

### 3. Tersiyer Referans Seçimi (Nokta / Stop $\to$ Son 1 Serbestlik Derecesi: $T_x$)
* **Kural:** Kalan son ötelemeyi kilitlemek için primer ve sekondere dik yan dayama yüzeyinden tek bir temas noktası seçilir.

---

## 🔄 3. Geometri Tipine Göre Hizalama Şablonları

Yazılım parçanın tipolojisine göre uygun kural setini otomatik tetikler:

| Parça Tipi | Primer Eleman (3 DoF) | Sekonder Eleman (2 DoF) | Tersiyer Eleman (1 DoF) |
|---|---|---|---|
| **Prizmatik Blok** | Üst Geniş Düzlem (Plane) | Ön Uzun Yan Yüz (Line / 2 pts) | Sol Yan Dayama (Point / 1 pt) |
| **Flanş / Kasa** | Taban Düzlemi (Plane) | İki Referans Deliği Eksen Vektörü | Ana Delik Merkezi ($X0, Y0$) |
| **Döner Simetrik (Torna)** | Ana Dış/İç Çap (Cylinder Axis) | Alın Faturası (Face Plane - $Z0$) | Kama Kanalı / İlk Delik ($R_z$ Kilidi) |

---

## 🖥️ 4. Kullanıcı Arayüzü (UI) ve 3D Kanvas Görselleştirmesi

Operatör STEP dosyasını yüklediğinde ekranda sihirbaz benzeri bir **"Hizalama Öneri Kartı"** açılır:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 OTOMATİK HİZALAMA ÖNERİSİ (En Yüksek Kararlılık: %98)    │
├─────────────────────────────────────────────────────────────┤
│ 1. DÜZLEM (Primer - Seviyeleme):                            │
│    -> Üst işlenmiş yüzey (Alan: 145 cm², Normal: [0, 0, 1]) │
│    -> Joystick ile bu yüzeye 3 nokta dokunun.               │
│                                                             │
│ 2. DÖNME / ÇİZGİ (Sekonder - Eksen Doğrultma):              │
│    -> Ön uzun referans kenarı (Uzunluk: 210 mm)             │
│    -> Joystick ile bu kenara 2 nokta dokunun.               │
│                                                             │
│ 3. SIFIR NOKTASI (Tersiyer - Orijin):                       │
│    -> Sol yan dayama yüzeyi                                 │
│    -> Joystick ile bu yüze 1 nokta dokunun.                 │
│                                                             │
│ [ Bu Hizalamayı Onayla ]  [ Alternatif Önerileri Gör (2) ]  │
└─────────────────────────────────────────────────────────────┘
```

### 3D Kanvasta Renk Kodlaması:
* **Yeşil Noktalar (3 Adet):** Üst yüzeyde dokunulacak alanlar parlar.
* **Mavi Noktalar (2 Adet):** Ön kenarda eksen çizgisini oluşturacak noktalar parlar.
* **Sarı Nokta (1 Adet):** Orijin dayama noktası parlar.

Operatör kumandayla bu 6 noktaya kabaca dokunduğu anda ($<30\text{ saniye}$); yazılım eksen takımını CAD nominaline kilitler (`RECALL/ALIGN`) ve tezgah doğrudan tam otomatik **DCC (Direct Computer Control)** ölçüm moduna geçer.

---

## 📜 5. DMIS Kodlama Karşılığı

Bu öneri onaylandığında derleyicinin ürettiği standart ön-hizalama bloğu:

```plaintext
$$ ============================================================
$$ AUTOMETROL OTOMATIK ON-HIZALAMA (3-2-1 ALIGNMENT RECIPE)
$$ ============================================================
MODE/MAN
SNSET/APPRCH, 5.0
SNSET/RETRCT, 5.0

$$ 1. PRIMER DUZLEM (Z-LEVEL)
F(PLN_TOP) = FEAT/PLANE,CART, 100.0, 50.0, 30.0, 0.0, 0.0, 1.0
MEAS/PLANE, F(PLN_TOP), 3
  PTMEAS/CART,  30.0, 20.0, 30.0, 0.0, 0.0, 1.0
  PTMEAS/CART, 170.0, 20.0, 30.0, 0.0, 0.0, 1.0
  PTMEAS/CART, 100.0, 80.0, 30.0, 0.0, 0.0, 1.0
ENDMES
DATDEF/F(PLN_TOP), DAT(A)

$$ 2. SEKONDER CIZGI (ROTATE TO X)
F(LIN_FRONT) = FEAT/LINE,CART, 50.0, 0.0, 15.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0
MEAS/LINE, F(LIN_FRONT), 2
  PTMEAS/CART,  40.0, 0.0, 15.0, 0.0, -1.0, 0.0
  PTMEAS/CART, 160.0, 0.0, 15.0, 0.0, -1.0, 0.0
ENDMES
DATDEF/F(LIN_FRONT), DAT(B)

$$ 3. TERSIYER NOKTA (X ORIGIN)
F(PNT_LEFT) = FEAT/POINT,CART, 0.0, 40.0, 15.0, -1.0, 0.0, 0.0
MEAS/POINT, F(PNT_LEFT), 1
  PTMEAS/CART, 0.0, 40.0, 15.0, -1.0, 0.0, 0.0
ENDMES
DATDEF/F(PNT_LEFT), DAT(C)

$$ EKSEN TAKIMINI KILITLE VE PCS'YE GEC
D(ALIGN_PCS) = DATSET/DAT(A), ZDIR, ZORIG, DAT(B), XDIR, YORIG, DAT(C), XORIG
RECALL/D(ALIGN_PCS)

$$ TAM OTOMATIK MODA GECIS
MODE/AUTO, PROG, MAN
```
