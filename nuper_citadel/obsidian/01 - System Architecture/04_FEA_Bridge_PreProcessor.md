---
title: 04. FEA Ön-İşlemci Jeneratörü
created: 2026-09-20
tags:
  - architecture
  - fea
  - ansys
  - simcenter-nx
  - psd
---

# 🌉 04. FEA Ön-İşlemci Jeneratörü (`fea_exporter.py`)

FEA (Sonlu Elemanlar Analizi) mühendisinin en büyük zaman kaybı ve hata kaynağı, standart föylerindeki 4-5 kırılma noktalı kaba grafikleri elle ANSYS veya Simcenter NX'e girmeye çalışmaktır. **Nuper Citadel FEA Köprüsü**, log-log eğrilerini otomatik enterpole ederek doğrudan yazılımların tanıyacağı spektrum dosyalarını (`.csv`, `.afu`, APDL script) ve simülasyon sınır şartı reçetesini üretir.

```
       ┌───────────────────────────────┐
       │   KURAL MOTORU BREAKPOINT'LERİ│
       │    (20 Hz, 150 Hz, 1000 Hz..) │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │    LOG-LOG İNTERPOLASYON      │
       │  (100+ Ayrık Frekans Noktası) │
       └───────────────┬───────────────┘
                       │
       ┌───────────────┴───────────────┐
       │                               │
       ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│    SPEKTRUM DOSYA FORMATLARI │ │   SINIR KOŞULU YÖNERGESİ    │
│  - Simcenter NX: .csv / .afu│ │  - Montaj Delikleri: Fixed  │
│  - ANSYS: Table PSD / APDL  │ │  - Çözüm Aralığı: 0-2500 Hz │
│  - Abaqus: *AMPLITUDE       │ │  - Min %85 Efektif Kütle    │
└─────────────────────────────┘ └─────────────────────────────┘
```

---

## 1. Logaritmik İnterpolasyon Algoritması
Rastgele titreşimde PSD eğrileri frekans ekseninde logaritmiktir. Basit lineer interpolasyon yapılırsa enerji dağılımı ($g_{\text{rms}}$) bozulur. Nuper Citadel log-log enterpolasyon uygular:

Verilen iki nokta $(f_1, W_1)$ ve $(f_2, W_2)$ için ara frekans $f_i$:

$$W(f_i) = W_1 \cdot \left( \frac{f_i}{f_1} \right)^{\frac{\log_{10}(W_2 / W_1)}{\log_{10}(f_2 / f_1)}}$$

Bu formül ile 20 Hz ile 2000 Hz arasında 120 ayrık nokta üretilir; bu sayede analiz çözücüsü (NX Nastran SOL 103/111 veya ANSYS MAPDL) rezonans tepkilerini pürüzsüz entegre eder.

---

## 2. Üretilen Simcenter NX / ANSYS CSV Çıktısı

Simcenter NX Response Simulation modülü ve ANSYS Mechanical Workbench tarafından doğrudan sürükle-bırak ile okunabilen çıktı:

```csv
## Nuper Citadel FEA Pre-Processor
## Profile: MIL-STD-810H Method 514.8 Cat 14 (Tactical UAV Wing Pod)
## Calculated Target GRMS: 7.70 g
## Interpolation: Log-Log 1/12th Octave Equivalent
Frequency(Hz),PSD(g^2/Hz)
20.00,0.005300
25.00,0.008281
31.50,0.013149
40.00,0.021184
50.00,0.033100
63.00,0.040000
100.00,0.040000
150.00,0.040000
200.00,0.040000
400.00,0.040000
800.00,0.040000
1000.00,0.040000
1250.00,0.032000
1600.00,0.019531
2000.00,0.010000
```

---

## 3. Simülasyon Kurulum Yönergesi (Simulation Directive)

Nuper Citadel yalnızca tablo üretmekle kalmaz; FEA mühendisine adım adım analiz reçetesi sunar:

### A. Sınır Şartları (Boundary Conditions)
- **Tespit Edilen Montaj Arayüzü:** Taban yüzeyindeki 4 adet M4 delik (`detected_holes_count: 4`).
- **Uygulanacak Kısıt:** Delik silindirik yüzeylerine veya cıvata başı oturma alanlarına **Fixed Support (1-6 DOF kısıtlı)** veya cıvata ön yükü (Bolt Pretension) uygulanmalı.
- **Rijit Eleman (RBE2):** Eğer parça rijit bir mastara bağlanacaksa, 4 delik merkezi `RBE2` (Rigid Body Element) ile tek bir master node'a bağlanıp ivme girdisi master node üzerinden verilmelidir.

### B. Modal Analiz Parametreleri
- **Frekans Çözüm Aralığı:** $0 - 2500\text{ Hz}$ (Standart üst sınırı olan 2000 Hz'in en az 1.25 katı).
- **Kütle Katılım Kuralı:** Titreşim eksenlerinde (özellikle montaja dik Z ekseni) **kümülatif modal efektif kütle katılımı (Cumulative Effective Mass Participation) en az %85** olmalıdır. Bunun için en az 15-25 mod çıkarılmalıdır.
- **Sönümleme Oranı (Damping Ratio):** MIL-STD-810H parçaları için önerilen yapısal sönümleme:
  - Cıvatalı alüminyum gövdeler için: $\zeta = 0.02$ (%2 kritik sönümleme)
  - Monoblok işlenmiş parçalar için: $\zeta = 0.01$ - $0.015$

---

## 4. Analiz Sonrası Doğrulama ve Emniyet Katsayısı (Post-FEA Check)
Mühendis analizi çözdükten sonra elde ettiği sonuçları Nuper Citadel'e girdiğinde:
1. **1. Doğal Frekans ($f_n$):** Standart pik aralığı ($20-150\text{ Hz}$) ile kıyaslanır. $f_n > 200\text{ Hz}$ ise rezonans amplifikasyon riski düşük kabul edilir.
2. **3-Sigma RMS Gerilme ($\sigma_{3\sigma}$):**
   $$\sigma_{3\sigma} = 3 \times \sigma_{1\sigma}$$
   (Gaussian dağılımda parçanın zamanın %99.73'ünde bu gerilmenin altında kalacağını ifade eder.)
3. **Güvenlik Marjı (Margin of Safety - MS):**
   $$MS = \frac{\sigma_{\text{yield}}}{\sigma_{3\sigma} \times SF} - 1$$
   - $SF = 1.25$ (Havacılık yapısal güvenlik katsayısı)
   - $MS > 0$ ise parça standart açısından onaylanır.

---
Bağlantılı Notlar:
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
- [[02_CAD_Geometry_Engine|02. CAD & Geometri Ayrıştırıcı]]
- [[03_Deterministic_Rule_Engine|03. Deterministik Standart & Kural Motoru]]
