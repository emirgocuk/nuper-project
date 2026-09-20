---
title: Fikstür Tasarım İsterleri & Rezonans Güvenlik Zarfı (Fixture Rule)
created: 2026-09-20
tags:
  - engineering
  - fixture-design
  - shaker
  - resonance
  - mil-std-810h
---

# 🔩 Fikstür Tasarım İsterleri & Rezonans Güvenlik Zarfı (Fixture Rule)

Test merkezlerinde (sarsıcı tablalarda) parçalar havada asılı test edilmez; özel olarak işlenmiş bir ara bağlantı aparatına (**test fikstürü**) cıvatalanarak bağlanır. Savunma testlerindeki **en büyük başarısızlık nedeni**, fikstürün kendi doğal frekansının parçanın test frekansı aralığına girip kontrolsüz rezonansa girmesi ve sarsıcıdan gelen ivmeyi 5-10 kat büyüterek numuneyi parçalamasıdır.

```
┌────────────────────────────────────────────────────────────────────────┐
│               TEST FİKSTÜRÜ REZONANS GÜVENLİK ZARFI                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   PARÇA TEST BANT ARALIĞI             GÜVENLİ FİKSTÜR BÖLGESİ          │
│   [ 20 Hz ─────────────► 2000 Hz ]     [ > 2400 Hz ──────────► ]       │
│                                           ▲                            │
│                                           │ Fikstür 1. Rezonans Modu   │
│                                                                        │
│   ⚠️ TEHLİKELİ BÖLGE: Fikstür modu < 2000 Hz ise test GEÇERSİZDİR!    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Askeri Standart Kuralı (MIL-STD-810H Annex C)

MIL-STD-810H, test fikstürünün birinci doğal rezonans modunun ($f_{\text{fixture}}$), hem parçanın rezonansının hem de test profilinin en yüksek frekansının üzerinde olmasını şart koşar:

$$f_{\text{fixture, 1st}} \ge 1.20 \times f_{\text{max, test}}$$

- **Örnek:** $2000\text{ Hz}$'e kadar koşturulan bir İHA kanat altı podu testinde fikstürün birinci rezonans modu **en az $2400\text{ Hz}$** olmalıdır.
- Eğer fikstür $1200\text{ Hz}$'de rezonansa girerse, shaker kontrolcüsü enerjiyi kısamaz (notching yetersiz kalır), çapraz eksen (cross-axis) titreşimi tetiklenir ve test laboratuvar tarafından derhal durdurulur.

---

## 2. Nuper Citadel Analitik Fikstür Zarfı Üreticisi

Nuper Citadel, parçanın katı modelini yükler yüklemez fikstür gereksinimlerini şu adımlarla türetir:

```
[STEP Taban Geometrisi] ──► [Montaj Delik Şablonu]
                                  │
                                  ▼
                    [Sarsıcı Tabla Grid Eşleme]
                    (Örn: 50x50 mm M10 / M12 Matrix)
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ FİKSTÜR TASARIM REÇETESİ  │
                    │ - Malzeme: Alumec 89      │
                    │ - Min Kalınlık: 25 mm     │
                    │ - Hedef Mod: > 2200 Hz    │
                    │ - Tahmini Kütle: 4.2 kg   │
                    └───────────────────────────┘
```

### A. Montaj Delik Düzeni & Taban Temas Alanı Taraması:
- Parçanın taban montaj delikleri arasındaki yayılım ($Span_x = 100\text{ mm}, Span_y = 65\text{ mm}$) taranır.
- Parçanın taban yüzey alanı ($A_{\text{contact}}$) ve kütlesi ($m_{\text{part}}$) hesaplanır.

### B. Sarsıcı Tablası ile Arayüz Eşleme:
- Test merkezlerindeki standart shaker tabla delik matrisi (genellikle $50 \times 50\text{ mm}$ M10 grid veya $100 \times 100\text{ mm}$ M12 grid) ile parçanın delik şablonu kıyaslanır.
- Fikstürün tablaya kaç cıvatayla bağlanacağı ve minimum plaka boyutları ($L_{\text{fix}} \times W_{\text{fix}}$) çıkarılır.

### C. Fikstür Plaka Kalınlığı Analitik Hesabı:
Dört kenarından cıvatalanmış bir fikstür plakasının yaklaşık birinci eğilme frekansı:

$$f_1 \approx \frac{\pi}{2} \sqrt{\frac{D}{\rho \cdot t}} \left( \frac{1}{L^2} + \frac{1}{W^2} \right)$$

Burada eğilme rijitliği:
$$D = \frac{E \cdot t^3}{12 (1 - \nu^2)}$$

- $E$: Fikstür malzemesinin elastisite modülü (GPa)
- $t$: Fikstür plaka et kalınlığı (mm)
- $\rho$: Malzeme yoğunluğu ($\text{kg/m}^3$)
- $\nu$: Poisson oranı

Nuper Citadel bu denklemi tersten işletir: $f_1 \ge 2400\text{ Hz}$ hedefini sağlamak için **gerekli minimum plaka et kalınlığını ($t_{\text{min}}$)** milimetrik olarak mühendise bildirir.

---

## 3. Mühendise Sunulan Çıktı Örneği

```text
================================================================================
NUPER CITADEL - TEST FİKSTÜRÜ TASARIM ÖN-RAPORU
================================================================================
Test Edilen Parça: payload_bracket.step (Kütle: 0.385 kg)
Hedef Test Profili: MIL-STD-810H Cat 14 (Üst Frekans: 2000 Hz)

[FİKSTÜR RİJİTLİK VE MALZEME ZARFI]
- Tavsiye Edilen Malzeme: Alumec 89 / Alüminyum 7075-T6 (Yüksek rijitlik/kütle oranı)
- Alternatif Malzeme: Yekpare C45 Islah Çeliği (Ağır parçalar için)
- Minimum Plaka Et Kalınlığı (t_min): 25.0 mm
- Hedeflenen 1. Fikstür Rezonansı: > 2400 Hz (Güvenlik faktörü: 1.2x)
- Shaker Bağlantı Deseni: 50x50 mm M10 Grid, En Az 6 Noktadan Bağlantı
- Devrilme Torku Koruması: h_cg = 22.5 mm için taban flanşı genişletme önerilir.
================================================================================
```

---
Bağlantılı Notlar:
- [[00_System_Architecture_Blueprint|Sistem Mimarisi Blueprint]]
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
- [[Environmental_Test_Plan_ETP_Spec|Resmi ETP Doküman Standardı]]
