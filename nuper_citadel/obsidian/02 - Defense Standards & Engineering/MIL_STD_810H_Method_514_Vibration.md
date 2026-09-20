---
title: MIL-STD-810H Metot 514.8 Titreşim Kılavuzu
created: 2026-09-20
tags:
  - standards
  - mil-std-810h
  - vibration
  - psd
  - grms
---

# 🔊 MIL-STD-810H Metot 514.8 (Titreşim)

MIL-STD-810H Metot 514.8, askeri donanımların nakliye ve operasyonel ömürleri boyunca maruz kalacakları dinamik titreşim ortamını simüle eden en kapsamlı test prosedürüdür.

```
                  MIL-STD-810H METOT 514.8 TİTREŞİM
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
[KATEGORİ 4]                [KATEGORİ 14]               [KATEGORİ 20]
Kara Araçları               Hava Araçları Dış Yük       Döner Kanat (Helikopter)
(Kamyon, Taktik Tekerlekli,  (İHA Kanat Altı Podu,       (Gövde İçi Aviyonik,
 Paletli Zırhlı)            Füze Gövdesi)               Pylon Bağlantısı)
```

---

## 1. Temel Platform Kategorileri

### A. Kategori 14 - Dış Yükler (External Stores / UAV Wing Pods)
- **Referans:** Annex C, Şekil 514.8C-1
- **Uygulama:** Taktik İHA kanat altı faydalı yükleri, optik podlar, füze ray adaptörleri.
- **Karakteristik Spektrum:** Geniş bant rastgele (Broadband Random) titreşim.
- **Standart Kırılma Noktaları (Nominal Profile):**
  - $f_1 = 20\text{ Hz}$, $W_1 = 0.0053\text{ }g^2/\text{Hz}$ (+6 dB/octave eğim)
  - $f_2 = 150\text{ Hz}$, $W_2 = 0.0400\text{ }g^2/\text{Hz}$ (Düz tepe plato)
  - $f_3 = 1000\text{ Hz}$, $W_3 = 0.0400\text{ }g^2/\text{Hz}$ (-6 dB/octave iniş)
  - $f_4 = 2000\text{ Hz}$, $W_4 = 0.0100\text{ }g^2/\text{Hz}$
- **Toplam Enerji ($g_{\text{rms}}$):** $7.70\text{ }g_{\text{rms}}$
- **Test Süresi:** Her ortogonal eksen (X, Y, Z) için 60 dakika (toplam 3 saat).

### B. Kategori 4 - Kamyon ve Zırhlı Kara Araçları
- **Referans:** Annex A, Şekil 514.8A-1 / A-2
- **Uygulama:** Zırhlı araç üstü kule elektroniği, radar kabinleri, kara taşımacılığı.
- **Karakteristik:** Düşük frekansta (5 - 50 Hz) yüksek yer değiştirme, süspansiyon rezonans pikleri.
- **Frekans Aralığı:** 5 - 500 Hz ($g_{\text{rms}} \approx 1.5 - 2.8\text{ g}$).

### C. Kategori 20 - Döner Kanatlı Hava Araçları (Helikopter)
- **Referans:** Annex D
- **Karakteristik:** Ana rotor ve kuyruk rotoru harmoniklerini içeren **Geniş Bant Üzerine Sinüs (Sine-on-Random - SoR)** profili.
- **Zorluk:** Saf PSD yetersizdir; rotor kanat geçiş frekanslarına (1P, 2P, 4P blade pass frequencies) dar bantlı sinüs pikleri eklenmelidir.

---

## 2. Matematiksel Formüller ve Oktav Hesabı

### Eğim (Slope $m$ ve dB/Octave):
İki frekans $f_1, f_2$ ve PSD değerleri $W_1, W_2$ için eğim katsayısı:

$$m = \frac{\log_{10}(W_2 / W_1)}{\log_{10}(f_2 / f_1)}$$

$$\text{dB/octave} = 10 \cdot m \cdot \log_{10}(2) \approx 3.0103 \cdot m$$

*Örnek:* $m = 2$ ise eğim $+6\text{ dB/octave}$, $m = -2$ ise $-6\text{ dB/octave}$'dir.

### $g_{\text{rms}}$ İntegrasyonu:
Toplam efektif ivme:

$$g_{\text{rms}} = \sqrt{\sum_{i=1}^{n-1} A_{i, i+1}}$$

$$A_{i, i+1} = \begin{cases} 
\frac{W_i}{f_i^m (m + 1)} \left( f_{i+1}^{m+1} - f_i^{m+1} \right) & \text{eğer } m \neq -1 \\
W_i \cdot f_i \cdot \ln(f_{i+1} / f_i) & \text{eğer } m = -1 
\end{cases}$$

---

## 3. Test Odası Tolerans Sınırları (Test Tolerances)
Akredite test laboratuvarında shaker kontrolcüsünün (VR, LDS, Crystal vb.) uymak zorunda olduğu standart sınırlar:

| Frekans Bandı | Kontrol Toleransı | İzin Verilen Maksimum Sapma |
| :--- | :---: | :---: |
| 20 - 100 Hz | $\pm 1.5\text{ dB}$ | $\pm 3.0\text{ dB}$ |
| 100 - 1000 Hz | $\pm 1.5\text{ dB}$ | $\pm 3.0\text{ dB}$ |
| 1000 - 2000 Hz | $\pm 2.0\text{ dB}$ | $\pm 4.0\text{ dB}$ |
| **Toplam $g_{\text{rms}}$ Toleransı** | $\mathbf{\pm 10\%}$ | $\mathbf{\pm 15\%}$ |

---
Bağlantılı Notlar:
- [[03_Deterministic_Rule_Engine|03. Deterministik Standart & Kural Motoru]]
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
- [[Environmental_Test_Plan_ETP_Spec|Resmi ETP Doküman Standardı]]
