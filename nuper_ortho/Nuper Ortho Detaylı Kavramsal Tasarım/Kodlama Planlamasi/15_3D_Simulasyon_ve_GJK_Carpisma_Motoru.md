# 🛡️ 15. 3D Simülasyon, Süpürülmüş Hacim ve GJK Çarpışma Motoru

> **"CAM yazılımlarındaki (Mastercam, PowerMill) 'Gouge & Collision Check' mantığını CMM dünyasına taşıyan; Broad-Phase BVH, Narrow-Phase GJK/EPA algoritmaları, süpürülmüş kapsül fiziği ve otonom rota düzeltme (Lift-and-Hop) yeteneğine sahip 3D dijital ikiz simülasyon motoru."**

---

## 📌 1. İki Aşamalı Çarpışma Boru Hattı (Collision Pipeline)

Bir CMM yol simülasyonu yalnızca görsel bir animasyon değildir; arka planda milisaniyelik katı gövde çarpışma fiziği (Computational Geometry & Collision Detection) çalışır.

Parçanın yüz binlerce üçgenden oluşan mesh'ini her an prob montajıyla çarpıştırmak sistemi kilitler. Bu nedenle iki aşamalı endüstri standardı boru hattı kurulur:

```
[ Prob Hareketi: Nokta A ──► Nokta B ]
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ 1. GENİŞ FAZ (Broad-Phase): AABB / BVH Ağacı           │
│ • parry3d hiyerarşik kutu ağacı ile uzaktaki %90 elenir│
│ • CPU/GPU tasarrufu, mikrosaniyede filtreleme          │
└──────────────────────────┬─────────────────────────────┘
                           │ Kalan şüpheli potansiyel temas bölgeleri
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. DAR FAZ (Narrow-Phase): Süpürülmüş Kapsül & GJK/EPA │
│ • Silindir, şaft ve küre geometrileri üçgen ağla       │
│   Minkowski farkı üzerinden test edilir                │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    [ Çarpışma Yok ]            [ ÇARPIŞMA TESPİTİ ]
    • Yeşil Rota Onaylanır      • Kırmızı İkaz + Halo Efekti
    • Koda İzin Verilir         • Teşhis Kartı + Otomatik Düzeltme
```

---

## 📐 2. Süpürülmüş Hacim Modeli (Swept Volume Capsule)

Prob $A$ noktasından $B$ noktasına intikal ederken yalnızca o iki diskret noktada bulunmaz; hareket çizgisi boyunca 3 boyutlu bir hacim süpürür. Bu hacim matematikte **Kapsül (Swept Sphere-Cylinder)** olarak modellenir:

$$\mathbf{S}_{\text{capsule}}(t) = \mathbf{P}_A + t \cdot (\mathbf{P}_B - \mathbf{P}_A), \quad t \in [0, 1]$$

```
          [ Nokta A ] ══════════════════════════► [ Nokta B ]
         ┌───────────┐                          ┌───────────┐
       (   R_ball      ) ════════════════════ (   R_ball      )  <-- Bilye Kapsülü
         └───────────┘                          └───────────┘
               │                                      │
               │ R_stem                               │ R_stem
               ▼                                      ▼
         ┌───────────┐                          ┌───────────┐
         │  R_holder │ ════════════════════════ │  R_holder │  <-- Şaft / Kafa Kapsülü
         └───────────┘                          └───────────┘
```

* **Yakut Bilye İçin:** $R_{\text{ball}}$ yarıçapında süpürülen küresel kapsül.
* **Şaft ve Modül İçin:** $R_{\text{stem}}$ ($1.5\text{ mm}$) ve $R_{\text{holder}}$ ($12.5\text{ mm}$) yarıçaplarında silindirik süpürme hacimleri.

---

## 🧮 3. Gilbert-Johnson-Keerthi (GJK) ve EPA Algoritmaları

Rust tarafında `parry3d` kütüphanesi kullanılarak prob montajının dış bükey hacmi (Convex Hull $A$) ile parçanın üçgen mesh'i (Mesh $B$) arasında **Minkowski Farkı** hesaplanır:

$$A \ominus B = \{a - b \mid a \in A, b \in B\}$$

* **Çarpışma Kararı (GJK):** Eğer orijin $(0, 0, 0)$ bu Minkowski fark kümesinin içine düşüyorsa, sistem matematiksel kesinlikle çarpışma olduğunu kanıtlar:
  $$\mathbf{0} \in (A \ominus B) \iff A \cap B \neq \emptyset$$
* **Dalma Derinliği (EPA - Expanding Polytope Algorithm):** Orijin içerideyse, EPA algoritması orijinin fark polietopunun sınırına olan en kısa mesafesini bularak probun parçaya kaç milimetre daldığını (**Penetration Depth**) ve temas normal vektörünü hesaplar.

---

## ⚖️ 4. Geçerli Temas vs. Kaza Ayrımı (Intentional Touch vs. Collision)

CMM'in amacı zaten parçaya dokunmaktır. Yazılım "bilinçli ölçüm teması" ile "kaza/çarpışma" arasındaki farkı kesin kurallarla ayırır:

| Parametre | İzin Verilen Tek Temas (Valid Touch) | Kaza Sayılan Durumlar (Instant Flagged Collision) |
|---|---|---|
| **Temas Eden Eleman** | Yalnızca en uçtaki Yakut Bilye ($R_{\text{ball}}$) | Şaft sürtünmesi (Shank), TP20 gövdesi veya PH10 kafası |
| **İşlem Bloğu** | Yalnızca `MEAS` (Ölçüm) bloğu içinde | Hızlı intikal (`RAPID`) veya emniyet transferi anında |
| **Pozisyon Toleransı** | Nominal teftiş noktasına $\pm 2.0\text{ mm}$ mesafede | Beklenmeyen bir yüzeyde veya hava boşluğunda temas |
| **Temas Açısı** | Yüzey normali ile açı $\le 15^\circ$ | Yüzeye yandan sürtme veya şaftın kenara oturması |
| **Fikstür / Pabuç** | Kesinlikle YASAK | Pabuçlara, cıvatalara veya tablaya en ufak dokunma |

---

## 🖥️ 5. Kullanıcı Arayüzünde 3D Dijital İkiz (Tauri + Three.js)

Operatöre tezgaha gitmeden önce tam bir **Dijital İkiz (Digital Twin)** görselleştirmesi sunulur:

1. **Sanal Prob Animasyonu:**
   * Play butonuna basıldığında CMM kafası ekranda belirlenen hızda hareket eder, $A/B$ açılarını çevirir, $+50\text{ mm}$ emniyet kutusuna çıkar ve deliklere dalar.
2. **Görsel İhlal Uyarısı:**
   * Temiz yollar **yeşil** çizgilerle çizilir.
   * Çarpışma anında simülasyon tam o milisaniyede durur; temas bölgesi parça üzerinde **kırmızı parlama (halo effect)** ile yanıp söner.
3. **Otomatik Teşhis Kartı:**
   ```
   ❌ ÇARPIŞMA TESPİT EDİLDİ!
   Konum: X: 142.50, Y: -30.12, Z: 45.00
   Çarpan Eleman: Prob Uzatması (Extension 50mm, Ø11mm)
   Çarpılan Engel: Üst Fikstür Pabucu #2
   Dalma Derinliği: -3.42 mm (İhlal)
   ```

---

## 🚏 6. Otonom Rota Düzeltme (Auto-Correction / Path Re-Routing)

Simülasyon motoru bir çarpışma bulduğunda sadece durup beklemez; otonom düzeltme algoritmalarını çalıştırır:

```
[ Çarpışma Tespit Edildi ]
             │
             ├──► 1. Yükseklik Artırma (Lift-and-Hop)
             │    İki nokta arasındaki engel parça cidarıysa,
             │    ara emniyet noktasını parça yüksekliğinden +30 mm yukarı öteler.
             │
             └──► 2. Alternatif Kafa Açısı (Discrete Angle Fallback)
                  Kafa gövdesi pabuçla çakışıyorsa, aynı yüzeyi görebilen
                  bir sonraki en yakın A/B açısını (ör. A90B0 -> A75B0) test eder.
                  Temiz bir açı bulunursa rotayı otomatik günceller.
```

1. **Lift-and-Hop (Yüksel ve Aş):** Parça duvarı engel oluşturuyorsa, sistem iki nokta arasına otomatik bir ara nokta (`CLEARP`) ekleyerek probu engelin $+30\text{ mm}$ üzerine kaldırıp üzerinden aşırtır.
2. **Alternatif Açı Seçimi:** Kafa gövdesi çarpıyorsa, 720 diskret açı tablosundan aynı normal vektörüne en yakın ikinci kalibre açıyı seçip simülasyonu yeniden koşturur. Temiz rota bulunursa program onaylanır.

Bu motor sayesinde operatör DMIS kodunu tezgaha yüklemeden önce programın **%100 güvenli** olduğunu doğrular; sahada prob kırma korkusu tamamen ortadan kalkar.
