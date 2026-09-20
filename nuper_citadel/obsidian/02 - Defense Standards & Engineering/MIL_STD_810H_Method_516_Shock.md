---
title: MIL-STD-810H Metot 516.8 Mekanik Şok Kılavuzu
created: 2026-09-20
tags:
  - standards
  - mil-std-810h
  - shock
  - srs
  - dynamics
---

# 💥 MIL-STD-810H Metot 516.8 (Mekanik Şok)

Mekanik şok testleri; ani frenleme, fırlatma, roket motoru ateşlemesi, top atışı veya iniş çarpması gibi yüksek ivmeli, kısa süreli dinamik yüklerin donanıma etkisini belirler.

---

## 1. Prosedürler ve Standart Şok Profilleri

### Prosedür I - Fonksiyonel Şok (Functional Shock)
- **Amaç:** Donanımın çalışma sırasında maruz kalacağı tipik darbeleri simüle etmek ve parça fonksiyonunun devam ettiğini kanıtlamak.
- **Tipik Profil:**
  - **Dalga Şekli:** Terminal Peak Sawtooth (TPS - Testere Dişi) veya Yarım Sinüs (Half-Sine).
  - **Tepe İvmesi:** $20\text{ g}$ veya $40\text{ g}$.
  - **Darbe Süresi:** $11\text{ ms}$ (Milisaniye).
  - **Uygulama:** Her 3 eksende pozitif ve negatif yönlerde 3'er darbe (Toplam $3 \times 2 \times 3 = 18$ şok).

### Prosedür V - Çarpışma Tehlikesi Şoku (Crash Hazard / Safety)
- **Amaç:** Kaza durumunda parçanın yuvasından fırlayıp personele veya kritik aviyoniklere zarar vermesini önlemek.
- **Tepe İvmesi:** $75\text{ g}$, $6\text{ ms}$ darbe.

---

## 2. Şok Tepki Spektrumu (Shock Response Spectrum - SRS)
Karmaşık patlama veya piroteknik şoklarda zaman tanım alanındaki dalga yerine frekans tanım alanındaki SRS kullanılır:
- Spektrum, tek serbestlik dereceli (SDOF) osilatörlerin her frekanstaki maksimum tepkisini gösterir ($Q = 10, \zeta = 0.05$).
- Genellikle $100\text{ Hz}$ ile $2000\text{ Hz}$ arasında $+6\text{ dB/octave}$ artışla $1000\text{ g}$ mertebelerine ulaşır.

---

## 3. Nuper Citadel Analitik Şok Doğrulaması (Cıvata Kesme ve Çekme)

Nuper Citadel, parçanın katı modelinden elde edilen $m$ (kütle), $h_{cg}$ (devrilme kolu) ve montaj açıklığı ($Span$) verilerini kullanarak şok anındaki cıvata yüklerini analitik olarak doğrular:

$$F_{\text{inertial}} = m \cdot a_{\text{peak}} \cdot g = m \cdot 40 \cdot 9.81$$

Devrilme momenti:
$$M_{\text{overturn}} = F_{\text{inertial}} \cdot h_{cg}$$

Montaj deliklerine binen ilave çekme kuvveti ($F_{\text{tension}}$) ve kesme kuvveti ($F_{\text{shear}}$):
$$F_{\text{tension, max}} \approx \frac{M_{\text{overturn}}}{Span_y}, \quad F_{\text{shear}} = \frac{F_{\text{inertial}}}{N_{\text{holes}}}$$

Bu analitik hesap, FEA modeline gerek kalmadan cıvataların (ör. 4x M4 8.8 kalite cıvata) şok anında kopup kopmayacağını **0.1 saniyede** belirler.

---
Bağlantılı Notlar:
- [[02_CAD_Geometry_Engine|02. CAD & Geometri Ayrıştırıcı]]
- [[MIL_STD_810H_Method_514_Vibration|MIL-STD-810H Titreşim Kılavuzu]]
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
