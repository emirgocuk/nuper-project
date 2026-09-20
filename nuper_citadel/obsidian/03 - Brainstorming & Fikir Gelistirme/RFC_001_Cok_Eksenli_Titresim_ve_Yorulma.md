---
title: RFC-001: Çok Eksenli Titreşim ve Steinberg Yorulma Analizi
created: 2026-09-20
tags:
  - rfc
  - brainstorming
  - fatigue
  - multi-axis
  - steinberg
---

# 💡 RFC-001: Çok Eksenli Titreşim ve Steinberg Yorulma Analizi

## 1. Giriş ve Motivasyon
MIL-STD-810H'de testler geleneksel olarak X, Y ve Z eksenlerinde ardışık (sequential) olarak 1'er saat koşturulur. Ancak sahada (örneğin bir İHA kanadında) titreşim **3 eksende eşzamanlı (multi-axial simultaneous)** etki eder. Ayrıca tek başına statik $3\sigma$ akma gerilmesi parçanın 3 saatlik titreşim süresince yorulup yorulmayacağını (High Cycle Fatigue - HCF) göstermez.

---

## 2. Teknik Öneri: Steinberg 3-Bant Rastgele Titreşim Yorulma Modeli
Dave Steinberg tarafından geliştirilen ve askeri/aviyonik donanımlarda endüstri standardı kabul edilen yöntem Nuper Citadel motoruna entegre edilebilir:

Gaussian dağılımına sahip bir rastgele titreşim sürecinde gerilme döngüleri 3 banda ayrılır:

| Gerilme Seviyesi | Döngü Dağılım Oranı (%) | Toplam Döngü Sayısı ($n_i$) |
| :--- | :---: | :--- |
| **$1\sigma$ Gerilme** ($\sigma_1 = 1 \times \sigma_{\text{RMS}}$) | %68.3 | $n_1 = 0.683 \times f_0 \times T$ |
| **$2\sigma$ Gerilme** ($\sigma_2 = 2 \times \sigma_{\text{RMS}}$) | %27.1 | $n_2 = 0.271 \times f_0 \times T$ |
| **$3\sigma$ Gerilme** ($\sigma_3 = 3 \times \sigma_{\text{RMS}}$) | %4.33 | $n_3 = 0.0433 \times f_0 \times T$ |

- $f_0$: Parçanın 1. doğal rezonans frekansı (Hz)
- $T$: Toplam test süresi (saniye, ör. 1 saat = 3600 s)

### Kümülatif Hasar (Palmgren-Miner Kuralı):
Malzemenin S-N (Wöhler) eğrisi veya Basquin denkleminden her gerilme seviyesi için kırılma döngüsü ($N_i$) hesaplanır:

$$D = \sum_{i=1}^{3} \frac{n_i}{N_i} = \frac{n_1}{N_1} + \frac{n_2}{N_2} + \frac{n_3}{N_3}$$

- **Kabul Kriteri:** $D < 1.0$ (Havacılık güvenliği için $D \le 0.70$ veya $0.50$ tavsiye edilir).

---

## 3. Nuper Citadel Entegrasyon Mimarisi
1. **Girdi:** FEA'dan gelen $\sigma_{\text{RMS}}$ gerilmesi ve $f_0$ doğal frekansı.
2. **Kural:** Seçilen malzemenin (Al 6061-T6) yorulma katsayıları $b$ ve $C$.
3. **Çıktı:** Tek tıkla "Yorulma Ömrü Tüketim Yüzdesi" (%Damage = $D \times 100$) ve "Kırılmaya Kalan Güvenli Uçuş Saati".

---
Bağlantılı Notlar:
- [[Fikir_Havuzu_ve_Vizyon|Fikir Havuzu]]
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
