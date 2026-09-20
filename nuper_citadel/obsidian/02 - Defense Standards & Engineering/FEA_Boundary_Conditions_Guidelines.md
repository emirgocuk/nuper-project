---
title: FEA Sınır Şartları ve Modelleme Kılavuzu
created: 2026-09-20
tags:
  - engineering
  - fea
  - ansys
  - simcenter-nx
  - nastran
  - boundary-conditions
---

# 🔬 FEA Sınır Şartları ve Modelleme Kılavuzu

Nuper Citadel, analiz mühendisinin önüne sadece bir veri tablosu koymakla yetinmez; simülasyonun akredite test laboratuvarı sonuçlarıyla birebir örtüşmesi (korelasyon) için kritik FEA modelleme yönergelerini dikkate sunar.

---

## 1. Efektif Modal Kütle Katılımı (%85 Kuralı)

Askeri standartlarda (MIL-HDBK-340A ve NASA-HDBK-7005) rastgele titreşim analizi çözülürken en yaygın yapılan hata, yetersiz sayıda mod çıkararak kütlenin büyük kısmını gözden kaçırmaktır.

- **Kural:** Titreşim uygulanan ana yönlerdeki (özellikle montaja dik yön) kümülatif efektif kütle katılımı (Cumulative Effective Mass Fraction):
  $$\sum_{i=1}^{M} m_{\text{eff}, i} \ge 0.85 \times M_{\text{total}} \quad (\ge \%85)$$
- **Nuper Citadel Tavsiyesi:** Parçanın üst test frekansı $2000\text{ Hz}$ ise, modal analiz çözücüsü (Simcenter NX SOL 103 veya ANSYS Modal) en az **$2500 - 3000\text{ Hz}$** tavan frekansına kadar koşturulmalı ve tüm katılım faktörleri denetlenmelidir.

---

## 2. Sönümleme Oranı Seçimi ($\zeta$ ve $Q$ Faktörü)

Rastgele titreşim analizinde rezonans tepkisinin genliğini doğrudan sönümleme belirler. Sönümleme iki katına çıkarsa gerilme yarıya iner!

$$Q = \frac{1}{2\zeta}$$

| Parça / Montaj Tipi | Önerilen $\zeta$ (Kritik Sönümleme) | Kalite Faktörü ($Q$) |
| :--- | :---: | :---: |
| **Monoblok İşlenmiş Metal (Alüminyum/Titanyum yekpare)** | $\zeta = 0.010 - 0.015$ | $Q \approx 33 - 50$ |
| **Cıvatalı / Perçinli Birleşimler (Sürtünmeli sönümleme)** | $\zeta = 0.020 - 0.030$ | $Q \approx 17 - 25$ |
| **İçinde Elektronik Kart (PCB) ve Dolgu (Potting) Olan Kutular** | $\zeta = 0.030 - 0.050$ | $Q \approx 10 - 16$ |

*Nuper Citadel varsayılan olarak cıvatalı arayüzler için $\zeta = 0.02$ (%2) kabulünü kullanır.*

---

## 3. Montaj Arayüzü Modelleme Yöntemleri

```
[YÖNTEM 1: BASİT SABİTLEME]       [YÖNTEM 2: RBE2 MERKEZLİ]
    Delik Yüzeyi (Fixed)             Delik Yüzeyi
        │       │                        ╲   │   ╱
    ════╧═══════╧════               ───────●─────── (Master Node)
                                           │ (Taban İvmesi)
```

1. **Yöntem 1 - Direkt Yüzey Kısıtı (User Defined Fixed Constraint):**
   - Delik iç silindirlerine 1-6 serbestlik derecesi (DOF 123456 = 0) verilir.
   - Hızlıdır ancak deliğin etrafında yapay (gerçek dışı) gerilme yığılmaları yaratabilir.
2. **Yöntem 2 - RBE2 Çok Noktalı Rijit Bağlantı (Önerilen):**
   - Nuper Citadel'in tespit ettiği 4 montaj deliğinin merkezleri birer master node'a rijit elemanlarla (`RBE2`) bağlanır.
   - Sarsıcı tablasından gelen PSD ivmesi doğrudan bu master node'lara uygulanır. Fikstür esnekliği varsa master node'lara yay elemanları (`CBUSH`) tanımlanabilir.

---

## 4. 3-Sigma Gerilme ve Güvenlik Marjı Hesabı

Rastgele titreşimde gerilme deterministik tek bir sayı değildir; istatistiksel bir RMS büyüklüğüdür:
- **$1\sigma$ RMS Gerilme:** Zamanın %68.3'ünde bu gerilmenin altında kalınır.
- **$2\sigma$ RMS Gerilme:** Zamanın %95.4'ünde.
- **$3\sigma$ RMS Gerilme:** Zamanın **%99.73**'ünde bu değer aşılmaz.

Savunma kalifikasyonunda akma kriteri olarak her zaman $3\sigma$ değeri alınır:
$$\sigma_{\text{peak}} = 3 \times \sigma_{\text{RMS}}$$

Emniyet katsayısı ($SF = 1.25$ kabulüyle):
$$\text{Margin of Safety (MS)} = \frac{\sigma_{\text{yield}}}{\sigma_{3\sigma} \times 1.25} - 1$$
$MS > 0$ ise parça rastgele titreşimi statik akma açısından başarıyla geçer.

---
Bağlantılı Notlar:
- [[04_FEA_Bridge_PreProcessor|04. FEA Ön-İşlemci Jeneratörü]]
- [[MIL_STD_810H_Method_514_Vibration|MIL-STD-810H Titreşim Kılavuzu]]
- [[RFC_001_Cok_Eksenli_Titresim_ve_Yorulma|RFC-001: Yorulma Ömrü Hesabı]]
