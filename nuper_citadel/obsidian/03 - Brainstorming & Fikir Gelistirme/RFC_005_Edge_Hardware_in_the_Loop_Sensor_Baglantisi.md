---
title: RFC-005: Uçuş Testi Telemetrisi ile Göreve Özel (Tailored) Spektrum
created: 2026-09-20
tags:
  - rfc
  - brainstorming
  - mission-tailoring
  - flight-test
  - telemetry
---

# 💡 RFC-005: Uçuş Testi Telemetrisi ile Göreve Özel (Tailored) Spektrum

## 1. Giriş ve Motivasyon (MIL-STD-810H Bölüm 1 Felsefesi)
MIL-STD-810H standardının en çok gözden kaçan ancak en önemli kuralı **"Environmental Tailoring (Çevresel Uyarlama)"** ilkesidir. Standardın 1. Bölümü açıkça belirtir:
> *"Kitaptaki jenerik tablolar (ör. Cat 14) yalnızca gerçek ölçüm verisi olmadığında kullanılacak kaba kılavuzlardır. Elinizde uçuş testi veya saha ölçüm verisi varsa, standart profiller yerine özel spektrum türetmek ZORUNDASINIZ."*

---

## 2. Teknik Öneri: Telemetriden PSD Spektrumu Sentezi (Mission Tailoring Engine)

Uçuş testi sırasında İHA gövdesine veya pylonuna takılan telemetri ivmeölçerlerinden kaydedilen ham zaman serisi verisi ($g$ vs $t$, 10 kHz örnekleme):

```
       ┌───────────────────────────────┐
       │   UÇUŞ TESTİ HAM TELEMETRİSİ  │
       │   (Zaman Serisi: g vs zaman)  │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │     WELCH YÖNTEMİ İLE PSD     │
       │  - Hanning Window             │
       │  - %50 Overlap                │
       │  - Frekans Çözünürlüğü: 1 Hz  │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │     ZARF (ENVELOPE) ÇIKARMA   │
       │  - Standart Muhafazakarlık    │
       │    Marjı (+3 dB Emniyet)      │
       │  - Kırılma Noktalarını Sıkıştır│
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │    ÖZEL MİSYON PSD PROFİLİ    │
       │  "Bayraktar TB2 / ANKA Pylon  │
       │   Gerçek Uçuş Spektrumu"      │
       └───────────────────────────────┘
```

---

## 3. Mühendislik ve Ticari Kazanım
1. **Gereksiz Parça Ağırlığını Önler:** Jenerik standartlar en kötü senaryoyu kapsadığı için parçayı aşırı ağırlaştırır. Gerçek uçuş verisiyle türetilen spektrum genellikle %20-30 daha hafiftir.
2. **Kişiselleştirilmiş Platform Kütüphanesi:** Nuper Citadel, zamanla şirketin kendi İHA'larına (TB2, TB3, Anka, Aksungur, Kızılelma vb.) özel gerçek spektrum kütüphanesini oluşturur.

---
Bağlantılı Notlar:
- [[Fikir_Havuzu_ve_Vizyon|Fikir Havuzu]]
- [[MIL_STD_810H_Method_514_Vibration|MIL-STD-810H Titreşim Kılavuzu]]
- [[03_Deterministic_Rule_Engine|03. Deterministik Standart & Kural Motoru]]
