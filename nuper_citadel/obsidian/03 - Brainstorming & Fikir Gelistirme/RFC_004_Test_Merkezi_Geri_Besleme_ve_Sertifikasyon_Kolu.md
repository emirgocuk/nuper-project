---
title: RFC-004: Test Merkezi İvmeölçer Verisi ile FEA Korelasyonu
created: 2026-09-20
tags:
  - rfc
  - brainstorming
  - test-correlation
  - shaker
  - tubitak-sage
  - trtest
---

# 💡 RFC-004: Test Merkezi İvmeölçer Verisi ile FEA Korelasyonu

## 1. Giriş ve Motivasyon
Fiziksel test bittiğinde hikaye sonlanmaz. Test merkezindeki (TÜBİTAK SAGE, TRTEST, şirket içi çevre laboratuvarı) shaker kontrol sistemi (LDS Dactron, Siemens LMS, m+p vb.) ivmeölçerlerden yüzbinlerce satır FRF (Frekans Tepki Fonksiyonu) ve PSD zaman serisi kaydeder.
Şu anki durumda mühendisler bu veriyi USB ile alıp Excel'de göz kararı inceler. **Nuper Citadel, test çıktısını içeri aktarıp FEA modelini otomatik kalibre eden kapalı bir öğrenme döngüsü kurabilir.**

---

## 2. Kapalı Çevrim Korelasyon Mimarisi (Closed-Loop Correlation)

```
┌─────────────────────────┐         ┌─────────────────────────┐
│  SİMULTANİ TEST MERKEZİ │         │      SIMCENTER NX /     │
│  (TÜBİTAK SAGE / TRTEST)│         │     ANSYS FEA MODELİ    │
│  - Shaker İvmeölçerleri │         │  - Modal Frekanslar     │
│  - FRF / PSD Verisi     │         │  - Gerilme Haritası     │
└────────────┬────────────┘         └────────────┬────────────┘
             │ .csv / .unv / .dat                │ .op2 / .rst
             ▼                                   ▼
       ┌───────────────────────────────────────────────┐
       │             NUPER CITADEL KORELASYON          │
       │  1. MAC (Modal Assurance Criterion) Analizi   │
       │  2. Gerçek Sönümleme Oranı (ζ) Tespiti        │
       │  3. Cıvata Rijitlik Optimizasyonu (CBUSH)     │
       └───────────────────────┬───────────────────────┘
                               │
                               ▼
       ┌───────────────────────────────────────────────┐
       │       RESMİ KALİFİKASYON KABUL SERTİFİKASI    │
       │  "Standart Koşulları Karşılanmıştır (PASS)"   │
       └───────────────────────────────────────────────┘
```

---

## 3. Otomatik Kalibrasyon Mekanizması
1. **Deneysel Rezonans vs FEA Modu:**
   - FEA 1. mod: 340 Hz, Gerçek Shaker 1. mod: 318 Hz (%6.4 fark).
2. **Korelasyon Motoru:**
   - Nuper Citadel, cıvataların mikro-esnekliğini (`CBUSH stiffness`) ve gerçek yapısal sönümlemeyi ($\zeta_{\text{real}} = 0.027$) matematiksel optimizasyonla FEA dosyasına geri besler.
3. **Nihai Kalifikasyon Sertifikası:**
   - Şartnamenin tüm gereksinimlerinin karşılandığını belgeleyen resmi "Çevresel Test Başarı Sertifikası" (PDF) otonom üretilir.

---
Bağlantılı Notlar:
- [[Fikir_Havuzu_ve_Vizyon|Fikir Havuzu]]
- [[Environmental_Test_Plan_ETP_Spec|Resmi ETP Standardı]]
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
