---
title: RFC-003: Çoklu Standart Genişlemesi (NATO STANAG & RTCA DO-160G)
created: 2026-09-20
tags:
  - rfc
  - brainstorming
  - stanag-4370
  - do-160g
  - certification
---

# 💡 RFC-003: Çoklu Standart Genişlemesi (NATO STANAG & RTCA DO-160G)

## 1. Giriş ve Motivasyon
Türk savunma şirketleri (BAYKAR, TAI, ASELSAN) sadece TSK'ya değil, NATO müttefiklerine ve sivil havacılık otoritelerine (EASA, FAA, SHGM) ihracat yapmaktadır.
Bir donanımın yalnızca MIL-STD-810H'ye göre doğrulanması yetmez; NATO ihalelerinde **STANAG 4370 (AECTP)**, çift kullanımlı (dual-use) İHA projelerinde ise **RTCA DO-160G** standartlarına uyum aranır.

---

## 2. Kapsama Alınacak Standart Aileleri

```
                  ÇOKLU STANDART EŞLEME MOTORU
                               │
      ┌────────────────────────┼────────────────────────┐
      ▼                        ▼                        ▼
[MIL-STD-810H]         [NATO STANAG 4370]         [RTCA DO-160G]
ABD & TSK Standartı     AECTP-200 (Avrupa NATO)    Sivil / Çift Kullanımlı
Metot 514.8 Titreşim   Leaflet 244 Titreşim      Section 8 Titreşim
Metot 501/502 Sıcaklık Leaflet 230 İklim         Section 4 Sıcaklık/İrtifa
```

### A. RTCA DO-160G (Environmental Conditions for Airborne Equipment)
- **Section 8 (Vibration):** Standart Titreşim Eğrileri:
  - Curve B / B1: Sabit Kanatlı Uçak Gövde İçi
  - Curve C / C1: Kanat ve Pylon
  - Curve R, U: Helikopter Döner Kanat
- **Section 4 (Temperature and Altitude):** Category A1 to F2 sıcaklık/irtifa profilleri.

### B. NATO STANAG 4370 / AECTP-200
- AECTP Metot 401 (Vibration) ve Metot 301 (Climatic).
- Avrupa Savunma Ajansı (EDA) ve NATO ortak tedarik şartnamelerine doğrudan uyumluluk.

---

## 3. "Standart Eşdeğerlik Çapraz Matrisi" (Cross-Standard Mapping)
Nuper Citadel kural motoruna eklenecek çapraz eşleme mantığı:
- Kullanıcı: *"Bu parça MIL-STD-810H Cat 14'ü geçti. Peki RTCA DO-160G Bölüm 8 Kategori S Eğri C'yi de kurtarır mı?"* sorusunu sorduğunda:
- Sistem iki spektrumu üst üste çizer (overlay PSD), enerjileri kıyaslar ve:
  **"DO-160G Curve C seviyesi MIL-STD spektrumunun altında kalmaktadır; parça ek analize gerek kalmaksızın DO-160G için de güvenlidir!"** onayını basar.

---
Bağlantılı Notlar:
- [[Fikir_Havuzu_ve_Vizyon|Fikir Havuzu]]
- [[03_Deterministic_Rule_Engine|03. Deterministik Standart & Kural Motoru]]
