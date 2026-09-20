---
title: İmalat Toleransı & CMM Doğrulama Entegrasyonu (GD&T Bridge)
created: 2026-09-20
tags:
  - engineering
  - gdt
  - cmm
  - manufacturing-tolerances
  - quality-control
---

# 📏 İmalat Toleransı & CMM Doğrulama Entegrasyonu (GD&T Bridge)

Tasarım masasında ideal CAD geometrisi üzerinde yapılan sonlu elemanlar analizleri (FEA), gerçekte tezgâhtan çıkan parçayla **birebir örtüşmez**. Bir parçanın sac metal büküm radyüsünde incelme varsa veya talaşlı imalatta et kalınlığı alt sınır toleransında ($Lower\text{ }Spec\text{ }Limit$) işlenmişse; parça test masasında simülasyonda hesaplanandan **çok daha düşük gerilmede rezonansa girip yorulma çatlağıyla patlar**.

```
┌────────────────────────────────────────────────────────────────────────┐
│               NOMİNAL CAD VS GERÇEK İMAL EDİLEN PARÇA                  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   NOMİNAL CAD GEOMETRİSİ                GERÇEK CMM / İMALAT ÖLÇÜMÜ     │
│   - Et Kalınlığı: 2.00 mm (İdeal)       - Et Kalınlığı: 1.85 mm (-%7.5)│
│   - Yüzey Düzlemselliği: 0.00 mm        - Düzlemsellik Sapması: 0.12 mm│
│   - Titreşim Dayanımı: 100 Saat         - Titreşim Dayanımı: 86 Saat   │
│                                           (Ömürde %14 Düşüş!)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Sorunun Fiziksel Temeli: Tolerans Sapmalarının Dinamik Etkisi

Rastgele titreşimde ince cidarlı plakaların ve braketlerin doğal frekansı et kalınlığı ($t$) ile doğru orantılıdır:

$$f_n \propto \sqrt{\frac{D}{\rho \cdot t}} \propto t$$

Rijitlik ise kalınlığın küpüyle ($t^3$) orantılıdır:
$$K \propto t^3$$

- Eğer bir sac braket imalatta $2.00\text{ mm}$ yerine $1.85\text{ mm}$ olarak basılırsa ($-\%7.5$ sapma):
  - Rijitlik kaybı: $(1.85 / 2.00)^3 = 0.791 \rightarrow$ **%20.9 rijitlik kaybı!**
  - Gerilme artışı: Eğilme gerilmesi $\sigma \propto 1/t^2 \rightarrow (2.00 / 1.85)^2 = 1.168 \rightarrow$ **%16.8 daha yüksek gerilme!**
  - Bu durum parçanın rezonans frekansını doğrudan shaker pik enerji bölgesine kaydırabilir.

---

## 2. Nuper Citadel GD&T ve CMM Köprüsü Nasıl Çalışır?

```
       ┌───────────────────────────────┐
       │   1. ADIM: STEP MODEL TARAMA  │
       │   - Kritik Gerilme Bölgeleri  │
       │   - Montaj Flanş Düzlemselliği│
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   2. ADIM: CMM VERİ GİRDİSİ   │
       │   (Zeiss / Hexagon / CSV / UI)│
       │   - Ölçülen Kritik Kalınlıklar│
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   3. ADIM: DİNAMİK GÜNCELLEME │
       │   - FEA Kütle/Rijitlik Ölçeği │
       │   - %14 Ömür Düşüş Uyarısı    │
       │   - Simülasyonu Yeniden Uyarla│
       └───────────────────────────────┘
```

### A. Kritik GD&T Kontrol Noktalarının Tespiti:
- OpenCASCADE topoloji motoru parçadaki en ince federleri, büküm radyüslerini ve montaj flanşlarını tespit eder.
- Kalite kontrol ekibi için CMM (Coordinate Measuring Machine) kontrol listesi hazırlar:
  - *Ölçüm Noktası 1:* Montaj tabanı düzlemselliği (Tolerans: $\le 0.05\text{ mm}$)
  - *Ölçüm Noktası 2:* Ana taşıyıcı boyun et kalınlığı (Nominal: $2.00 \pm 0.10\text{ mm}$)

### B. CMM Ölçüm Geri Beslemesi:
Kalite mühendisi tezgâhtan çıkan ilk numunenin CMM ölçüm raporunu (CSV veya doğrudan arayüzden) sisteme girer:
- Girdi: `measured_thickness: 1.85 mm`
- Girdi: `flange_flatness_error: 0.12 mm`

### C. Analitik Hassasiyet Uyarısı ve FEA Matris Güncellemesi:
Sistem anında şu raporu üretir:
> **"DİKKAT: İmal edilen parçada et kalınlığı nominal $2.00\text{ mm}$ yerine $1.85\text{ mm}$ ölçüldü.**
> **Bu imalat toleransı sapması, eğilme gerilmesini %16.8 artırarak yorulma ömrünü %14 düşürmektedir.**
> **Simcenter NX / ANSYS kütle ve rijitlik matrisi güncellenmiş PSD tablosuyla yeniden koşulmalıdır."**

---

## 3. Montaj Yüzeyi Düzlemsellik Hatası (Preload & Prying Force)
Eğer parçanın tabanı düzlemsel değilse ($0.12\text{ mm}$ bombe varsa), cıvatalar torklandığında parça henüz test başlamadan önce **kalıcı montaj ön gerilmesine (assembly pre-stress)** maruz kalır. Nuper Citadel bu gerilmeyi titreşim $3\sigma$ gerilmesine ekleyerek akma sınırını kontrol eder.

---
Bağlantılı Notlar:
- [[02_CAD_Geometry_Engine|02. CAD & Geometri Ayrıştırıcı]]
- [[Palmgren_Miner_Fatigue_Life|Malzeme Yorulma Ömrü ve Miner Kuralı]]
- [[04_FEA_Bridge_PreProcessor|04. FEA Ön-İşlemci Jeneratörü]]
