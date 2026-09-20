---
title: Çoklu Çevresel Koşul Kombinasyonları (Combined Environments)
created: 2026-09-20
tags:
  - engineering
  - combined-environments
  - thermo-mechanical
  - thermal-vibration
  - mil-std-810h
---

# 🌪️ Çoklu Çevresel Koşul Kombinasyonları (Combined Environments)

Savunma ve havacılık standartlarında çevresel etkiler laboratuvar föylerindeki gibi **tekil gelmez**. Gerçek bir görev profilinde donanım aynı anda birden fazla aşırı yüke maruz kalır:
- FL350 irtifada $-51^\circ\text{C}$ dondurucu soğukta jet motoru titreşimi,
- Çöl operasyonunda $+71^\circ\text{C}$ güneş radyasyonu altında top atış şoku veya paletli araç titreşimi.

Nuper Citadel, ortamları birbirinden bağımsız silolar olarak değil, **birleşik termo-mekanik yük zarfı** olarak değerlendirir.

```
┌────────────────────────────────────────────────────────────────────────┐
│             BİRLEŞİK ÇEVRESEL KOŞUL MATRİSİ (COMBINED)                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   MIL-STD-810H METOT 501/502             MIL-STD-810H METOT 514.8      │
│   (Sıcaklık Döngüsü: -40°C / +71°C)   +   (Rastgele Titreşim: 7.7 Grms)│
│                                │                                       │
│                                ▼                                       │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 TERMO-MEKANİK ETKİLEŞİM ALANI                  │   │
│   │  1. CTE Uyuşmazlığı: Civata Ön Yükünde Artış/Gevşeme           │   │
│   │  2. Sıcakta Akma Düşüşü: Titreşim Gerilme Marjı Daralması      │   │
│   │  3. Soğukta Gevrek Kırılma: Şok ve Rezonans Kırılganlığı       │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Termo-Mekanik Gerilme Kesişimi (Thermo-Mechanical Preload Shift)

Savunma donanımlarında en sık rastlanan montaj biçimi: **Alüminyum 6061-T6 veya 7075-T6 gövdeye paslanmaz çelik (A2/A4-70 veya 8.8 kalite çelik) cıvatalarla montaj yapılmasıdır.**

### Isıl Genleşme Katsayısı Farkı ($\Delta \alpha$):
- $\alpha_{\text{Alüminyum}} \approx 23.0 \times 10^{-6}\text{ K}^{-1}$
- $\alpha_{\text{Çelik}} \approx 11.5 \times 10^{-6}\text{ K}^{-1}$
- $\Delta \alpha = \alpha_{\text{Al}} - \alpha_{\text{Çelik}} \approx 11.5 \times 10^{-6}\text{ K}^{-1}$

Montaj $T_{\text{ref}} = +20^\circ\text{C}$ oda sıcaklığında sıkıldığında cıvatada nominal bir ön gerilim ($F_{\text{preload}}$) oluşur. Sıcaklık değiştiğinde cıvataya binen ilave termal eksenel kuvvet:

$$\Delta F_{\text{th}} = \frac{(\alpha_{\text{Al}} - \alpha_{\text{Çelik}}) \cdot \Delta T}{\frac{1}{K_{\text{bolt}}} + \frac{1}{K_{\text{chassis}}}}$$

---

## 2. İki Kritik Uç Noktada Citadel Uyarı Mekanizması

### Senaryo A: Aşırı Soğukta Uçuş Titreşimi ($-40^\circ\text{C}$ ile $-51^\circ\text{C}$)
- $\Delta T = -40 - 20 = -60\text{ K}$.
- Alüminyum gövde çelik cıvatadan neredeyse iki kat daha fazla büzülür!
- **Sonuç:** Cıvata ön gerilimi gevşer ($\Delta F_{\text{th}} < 0$).
- **Citadel Dinamik Uyarısı:**
  > *"DİKKAT: $-40^\circ\text{C}$ çalışma koşulunda Alüminyum/Çelik genleşme farkı cıvata ön gerilimini %22 oranında azaltmaktadır. Bu durum 7.7 Grms titreşim altında montaj tabanında mikro-ayrılmaya (joint separation) ve cıvatalarda gevşemeye yol açabilir. Çözüm: Nord-Lock rondela veya cıvata boyu/çap oranı $>4$ olan uzun cıvata tasarımı önerilir."*

### Senaryo B: Aşırı Sıcakta Titreşim ($+71^\circ\text{C}$ ile $+85^\circ\text{C}$)
- $\Delta T = +85 - 20 = +65\text{ K}$.
- Alüminyum çelikten daha fazla uzar; cıvatayı aşırı gerer ($\Delta F_{\text{th}} > 0$).
- Aynı anda Alüminyumun akma dayanımı $275\text{ MPa}$'dan $245\text{ MPa}$ seviyesine geriler.
- **Citadel Gerilme Yığılması Uyarısı:**
  > *"DİKKAT: $+85^\circ\text{C}$ sıcaklıkta termal ön gerilme artışı ile $3\sigma$ dinamik titreşim gerilmesi toplandığında delik etrafındaki von Mises gerilmesi 252 MPa seviyesine ulaşmaktadır. Malzemenin bu sıcaklıktaki düşen akma dayanımı (245 MPa) aşıldığı için montaj deliklerinde kalıcı plastik sünme (creep) riski mevcuttur!"*

---

## 3. Akredite Test Odası İçin Birleşik Test Protokolü (AGREE Shaker)
Nuper Citadel, ETP üretiminde bağımsız testler yerine kombine iklimlendirmeli sarsıcı (**AGREE Shaker Chamber**) test yönergesi yazar:
1. Parça iklim kabini içindeki sarsıcıya bağlanır.
2. Sıcaklık $+71^\circ\text{C}$'ye çıkarılıp termal dengeye ulaşılır (2 saat bekleme).
3. Bu sıcaklık korunurken 1 saat tam düzey rastgele titreşim ($7.70\text{ }g_{\text{rms}}$) uygulanır.
4. Sıcaklık $-40^\circ\text{C}$'ye indirilip titreşim tekrarlanır.

---
Bağlantılı Notlar:
- [[MIL_STD_810H_Method_501_502_Temperature|Sıcaklık Standartları]]
- [[MIL_STD_810H_Method_514_Vibration|Titreşim Standartları]]
- [[Palmgren_Miner_Fatigue_Life|Malzeme Yorulma Ömrü ve Miner Kuralı]]
