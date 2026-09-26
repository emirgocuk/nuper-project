# 📐 20. Serbest Yüzey Profili ve Bileşik Toleranslar (Advanced GD&T)

> **"Havacılık kanat profilleri ve 5 eksen kalıp parçaları için Yüzey Profili (Profile of a Surface) hesaplamaları; ASME Y14.5 Bileşik Tolerans Çerçeveleri (Composite FCF - PLTZF / FRTZF) ve adaptif eğrilik örnekleme mimarisi."**

---

## 📌 1. Havacılık ve Savunma Gerçeği: Serbest Form Yüzeyler

Prizmatik bloklarda delik ve düzlemler yeterlidir; ancak uçak gövde braketleri, türbin kanatçıkları, kompozit kalıplar ve karmaşık döküm gövdelerde en yaygın tolerans **Yüzey Profili (Profile of a Surface - $\char"2312$)** toleransıdır.

```
            Nominal B-Spline Yüzeyi
        ╭──────────────────────────────╮
     ───┼──────────────────────────────┼───  +t/2 (Üst Tolerans Sınırı)
      • │  •      •        •      •    │     Ölçülen Noktalar
     ───┼──────────────────────────────┼───  -t/2 (Alt Tolerans Sınırı)
        ╰──────────────────────────────╯
```

---

## 🧮 2. Yüzey Profili ($\char"2312$) Matematiksel Modeli

Yüzey profili, ölçülen her temas noktasının CAD nominal yüzeyine olan en kısa dik mesafesini (normal doğrultusundaki sapmayı) denetler.

### A. Normal Doğrultusunda Sapma Hesabı:
Her ölçüm noktası $\vec{P}_{\text{meas}}$ için nominal CAD yüzeyindeki en yakın izdüşüm noktası $\vec{P}_{\text{nom}}(u, v)$ ve birim yüzey normali $\vec{N}(u, v)$ bulunur:

$$\Delta n_i = (\vec{P}_{\text{meas}, i} - \vec{P}_{\text{nom}, i}) \cdot \vec{N}_i$$

### B. Tolerans Bölgesi Tipleri:
1. **Bilateral (İki Taraflı Simetrik):**
   Sapma aralığı $[-\frac{t}{2}, +\frac{t}{2}]$ içinde kalmalıdır.
2. **Unilateral (Tek Taraflı Modifikatör $U$):**
   ASME Y14.5 uyarınca malzeme ekleme veya malzeme çıkarma yönünde ötelenmiş tolerans sınırı:
   $$\text{Profil Toleransı} = 0.8\ \text{mm } \text{Ⓤ}\ 0.2\ \text{mm}$$
   Malzeme dışına doğru $+0.2\text{ mm}$, malzeme içine doğru $-0.6\text{ mm}$ tolerans bandı kurulur.

---

## 🔗 3. ASME Y14.5 Bileşik Konum Toleransları (Composite FCF)

Çok delikli flanşlarda ve havacılık bağlantı plakalarında iki katmanlı bileşik tolerans çerçevesi kullanılır:

```
┌──────┬──────────────┬─────────┬─────────┬─────────┐
│  ⨁   │ ∅0.80        │    A    │    B    │    C    │  <-- 1. PLTZF (Örüntü Konumu)
├──────┼──────────────┼─────────┴─────────┴─────────┤
│  ⨁   │ ∅0.15        │    A    │                   │  <-- 2. FRTZF (Delikler Arası Mesafe)
└──────┴──────────────┴─────────┘
```

1. **PLTZF (Pattern-Locating Tolerance Zone Framework):**
   - Delik grubunun parçanın ana datumlarına ($A \mid B \mid C$) göre genel yerleşimini belirler ($\varnothing 0.80\text{ mm}$).
2. **FRTZF (Feature-Relating Tolerance Zone Framework):**
   - Deliklerin **birbirine göre** olan eksen kaçıklığını ve paralelliğini çok daha sıkı bir aralıkta kilitler ($\varnothing 0.15\text{ mm}$).

### AST Veri Modeli:
```rust
// ortho-ast/src/composite_gdandt.rs
pub struct CompositePositionTolerance {
    pub feature_ids: Vec<u32>,
    pub pattern_locating_zone: SingleToleranceZone {
        pub tolerance_value: f64,              // 0.80 mm
        pub datum_reference_frame: Vec<Datum>, // [A, B, C]
    },
    pub feature_relating_zone: SingleToleranceZone {
        pub tolerance_value: f64,              // 0.15 mm
        pub datum_reference_frame: Vec<Datum>, // [A]
    },
}
```

---

## 🎯 4. Eğriliğe Göre Uyarlamalı Örnekleme (Curvature-Adaptive Sampling)

Serbest formlu bir yüzeyde noktalar düzgün ızgara şeklinde atılamaz. Düz bölgelerde seyrek nokta yeterliyken, büküm ve radyus bölgelerinde nokta sıklığı artırılmalıdır.

```
       Düz Bölge (Seyrek)              Keskin Radyus (Yoğun)
    •         •         •          •   •   •   •   •   •
  ─────────────────────────╮     ╭───────────────────────
                           ╰─────╯
```

### Algoritma Kuralı:
1. OpenCASCADE üzerinden her $(u, v)$ noktasındaki **Ortalama Eğrilik (Mean Curvature - $H$)** ve **Gauss Eğriliği ($K$)** hesaplanır:
   $$H = \frac{\kappa_1 + \kappa_2}{2}, \quad K = \kappa_1 \cdot \kappa_2$$
2. Nokta yoğunluğu eğrilikle orantılı olarak artırılır:
   $$\text{Nokta Yoğunluğu } \rho(u, v) \propto \sqrt{|H| + \epsilon}$$
3. Böylece prob gereksiz düz alanlarda zaman kaybetmez; geometrik geçiş bölgelerinde maksimum yoğunlukta veri toplar.

---

## 📜 5. DMIS 5.3 ve PC-DMIS Profil Kod Çıktısı

Derleyicinin ürettiği standart yüzey profili denetim bloğu:

```plaintext
$$ ============================================================
$$ HAVACILIK SERBEST YUZEY PROFILI DENETIMI
$$ ============================================================
F(SURF_WING) = FEAT/GSURF,CART
$$ 8 Adet Adaptif Olcum Noktasi
MEAS/GSURF, F(SURF_WING), 8
  PTMEAS/CART, 120.450, 45.200, 15.300, 0.120, 0.450, 0.885
  PTMEAS/CART, 135.100, 46.100, 16.800, 0.115, 0.460, 0.880
  PTMEAS/CART, 150.250, 48.000, 19.100, 0.100, 0.500, 0.860
  PTMEAS/CART, 165.000, 51.300, 22.400, 0.080, 0.550, 0.832
ENDMES

$$ ASME Y14.5 YUZEY PROFILI DEGERLENDIRMESI
T(TOL_PROFILE) = TOL/PROFS, 0.1000, DAT(A), DAT(B), DAT(C)
EVAL/FA(SURF_WING), TA(TOL_PROFILE)
OUTPUT/FA(SURF_WING), TA(TOL_PROFILE)
```

Bu modül, Nuper Ortho'yu yalnızca prizmatik motor bloklarıyla sınırlı kalmaktan kurtararak havacılık türbin kanatçıkları, kompozit aeroyapılar ve otomotiv kalıpları pazarında vazgeçilmez kılar.
