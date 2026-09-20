---
title: Malzeme Yorulma Ömrü & Miner Kümülatif Hasar Kuralı (Palmgren-Miner S-N)
created: 2026-09-20
tags:
  - engineering
  - fatigue
  - palmgren-miner
  - random-vibration
  - sn-curve
  - steinberg
---

# ⏳ Malzeme Yorulma Ömrü & Miner Kümülatif Hasar Kuralı (Palmgren-Miner S-N)

Rastgele titreşim (Random Vibration) testlerinde bir parçanın arızalanması genellikle statik akma sınırının aşılmasıyla değil, saatlerce süren milyonlarca mikro-gerilme döngüsü altında **Yüksek Çevrimli Yorulma (High Cycle Fatigue - HCF)** ile gerçekleşir. 
Statik bir FEA analizi parçanın anlık akma gerilmesini ($3\sigma < \sigma_{\text{yield}}$) kurtardığını gösterebilir; ancak parça 3 saatlik testin 2. saatinde yorulma çatlağıyla kırılabilir.

---

## 1. Gauss Dağılımı ve Gerilme Bantları (Steinberg Yöntemi)

Rastgele titreşim altında parça üzerindeki gerilme zaman tanım alanında normal (Gaussian) bir dağılım sergiler. Dave Steinberg'in havacılık ve aviyonik kalifikasyonunda kabul gören 3-Bant yaklaşımı uyarınca, toplam test süresi ($T$, saniye) ve parçanın 1. doğal frekansı ($f_0$, Hz) kullanılarak döngü sayıları ($n_i$) hesaplanır:

```
            GAUSS GERİLME BANTLARI VE DÖNGÜ DAĞILIMI
                              ▲
                             /│\
                            / │ \   %68.3 (1-Sigma)
                           /  │  \
                          /   │   \
                   ──────/────┼────\────── %27.1 (2-Sigma)
             ───────────/─────┼─────\─────────── %4.33 (3-Sigma)
           -3σ        -2σ    -1σ  0  +1σ   +2σ   +3σ
```

| Gerilme Düzeyi | Genlik ($\sigma_i$) | Zaman Yüzdesi | Test Boyunca Gerçekleşen Döngü ($n_i$) |
| :--- | :--- | :---: | :--- |
| **1-Sigma Bandı** | $\sigma_1 = 1.0 \times \sigma_{\text{RMS}}$ | %68.30 | $n_1 = 0.683 \times f_0 \times T$ |
| **2-Sigma Bandı** | $\sigma_2 = 2.0 \times \sigma_{\text{RMS}}$ | %27.10 | $n_2 = 0.271 \times f_0 \times T$ |
| **3-Sigma Bandı** | $\sigma_3 = 3.0 \times \sigma_{\text{RMS}}$ | %4.33 | $n_3 = 0.0433 \times f_0 \times T$ |

- **Örnek:** $f_0 = 340\text{ Hz}$ olan bir İHA braketi 1 saat ($T = 3600\text{ s}$) test edildiğinde:
  - Toplam döngü sayısı: $N_{\text{total}} = 340 \times 3600 = 1.224.000\text{ döngü}$!
  - $n_1 = 835.992\text{ döngü}$ ($1\sigma$)
  - $n_2 = 331.704\text{ döngü}$ ($2\sigma$)
  - $n_3 = 53.000\text{ döngü}$ ($3\sigma$)

---

## 2. Basquin S-N Denklemi ve Dayanım Sınırı ($N_i$)

Malzemenin yüksek çevrimli yorulma eğrisi (Wöhler / S-N) Basquin formülasyonu ile ifade edilir:

$$\sigma_a = A \cdot (N)^b \quad \Longrightarrow \quad N_i = \left( \frac{\sigma_i}{A} \right)^{1/b}$$

- $\sigma_i$: Uygulanan gerilme genliği (MPa)
- $N_i$: O gerilme seviyesinde kırılmaya yol açacak döngü sayısı
- $b$: Basquin yorulma mukavemet üssü (Al 6061-T6 için tipik olarak $b \approx -0.10$ ile $-0.12$)
- $A$: Malzeme yorulma katsayısı

---

## 3. Palmgren-Miner Kümülatif Hasar İndeksi ($D$)

Farklı gerilme genliklerindeki döngülerin parçada biriktirdiği toplam hasar lineer olarak toplanır:

$$D = \sum_{i=1}^{3} \frac{n_i}{N_i} = \frac{n_1}{N_1} + \frac{n_2}{N_2} + \frac{n_3}{N_3}$$

### Savunma Sanayii Kabul Kriteri:
- **Teorik Kırılma Sınırı:** $D = 1.0$ (Hasar indeksi 1.0'a ulaştığında çatlak oluşur ve parça kopar).
- **Askeri Emniyet Marjı (Safety Margin):** Savunma projelerinde (MIL-HDBK-727 ve NASA standartları) parça varyasyonları ve yüzey pürüzlülüğü nedeniyle kabul sınırı:
  $$D_{\text{max}} \le 0.20 \quad (\text{Havacılık Kritikliği: } D \le 0.10)$$

---

## 4. Nuper Citadel Analitik Çıktısı

FEA analizinden dönen gerilme değeriyle Citadel anında şu analitik yorulma karnesini çıkarır:

```text
================================================================================
NUPER CITADEL - PALMGREN-MINER YORULMA HASARI RAPORU
================================================================================
Malzeme: Alüminyum 6061-T6 (Akma: 275 MPa, b = -0.108, A = 490 MPa)
Rezonans Frekansı: f0 = 340 Hz | Test Süresi: 3 Eksen x 3600 sn = 10.800 sn
1-Sigma RMS Gerilme: 47.3 MPa  | 3-Sigma Tepe Gerilmesi: 142.0 MPa

[DÖNGÜ VE HASAR DAĞILIMI]
- 1-Sigma Bandı (47.3 MPa) : n1 = 2.508.000 | N1 = 3.8 x 10^8 döngü | D1 = 0.0066
- 2-Sigma Bandı (94.6 MPa) : n2 = 995.000   | N2 = 6.2 x 10^5 döngü | D2 = 0.0160
- 3-Sigma Bandı (142.0 MPa): n3 = 159.000   | N3 = 1.8 x 10^5 döngü | D3 = 0.0883

Toplam Miner Kümülatif Hasarı (D): 0.1109 (%11.1 Ömür Tüketimi)
Askeri Emniyet Sınırı (D <= 0.20): SAĞLANDI (GÜVENLİ)
Tahmini Kırılmaya Kalan Güvenli Test Süresi: 27 Saat
================================================================================
```

Bu modül sayesinde mühendis; parçanın laboratuvarda testi bitirdiğinde sağlam çıkıp çıkmayacağını ve test sonrasında sahada kaç saat daha güvenle uçabileceğini net bir yüzdeyle görür.

---
Bağlantılı Notlar:
- [[04_FEA_Bridge_PreProcessor|04. FEA Ön-İşlemci Jeneratörü]]
- [[GDT_and_CMM_Tolerance_Bridge|İmalat Toleransı ve CMM Köprüsü]]
- [[Combined_Environmental_Profiles|Çoklu Çevresel Koşul Kombinasyonları]]
