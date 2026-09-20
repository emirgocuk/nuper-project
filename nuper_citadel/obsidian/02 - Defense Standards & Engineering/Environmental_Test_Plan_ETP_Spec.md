---
title: Resmi Çevresel Test Planı (ETP) Standardı
created: 2026-09-20
tags:
  - documentation
  - etp
  - qualification
  - tubitak-sage
  - trtest
---

# 📄 Resmi Çevresel Test Planı (ETP) Standardı

Nuper Citadel'in yerel yapay zekâ motoru tarafından üretilen **Çevresel Test Planı (Environmental Test Plan - ETP)**, TÜBİTAK SAGE, TRTEST, ASELSAN ve ROKETSAN gibi akredite test laboratuvarları ve ana yükleniciler tarafından doğrudan kabul görecek askeri dokümantasyon formatında kurgulanmıştır.

---

## ETP Doküman Mimarisi ve Bölüm Başlıkları

```
┌────────────────────────────────────────────────────────────────────────┐
│             RESMİ ÇEVRESEL TEST PLANI (ETP) İÇERİK YAPISI              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. DOKÜMAN BİLGİLERİ VE ONAY BLOKLARI (Hazırlayan, Kontrol, Onay)      │
│ 2. AMAÇ VE KAPSAM (Testin Amacı, Uygulanan Standartlar)                │
│ 3. TEST EDİLEN BİRİM (UUT) TANIMI (Kütle, CoG, Malzeme, CAD Çıktıları)  │
│ 4. TEST FİKSTÜRÜ İSTERLERİ VE MONTAJ PROTOKOLÜ (Rijitlik Kuralı)        │
│ 5. ENSTRÜMANTASYON VE SENSÖR YERLEŞİM PLANI (Kontrol & Tepki İvmeölçer)│
│ 6. TEST PROFİLİ VE TOLERANSLAR (PSD Kırılma Frekansları, Süreler)      │
│ 7. ADIM ADIM TEST KOŞMA SIRALAMASI (Rezonans Arama, Rastgele Titreşim) │
│ 8. BAŞARI VE KABUL KRİTERLERİ (Rezonans Kayması, Tork, NDT Kontrolü)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Test Fikstürü Rijitlik Kuralı (Fixture Rigidity Criterion)
ETP'de yer alması zorunlu olan en kritik mühendislik şartı fikstür rezonansıdır:
- **Kural:** Test fikstürünün birinci doğal frekansı ($f_{\text{fixture}}$), test edilecek parçanın (UUT) birinci rezonans frekansının en az **1.5 katı** veya test üst sınır frekansı olan 2000 Hz'e yakın (**$\ge 1500\text{ Hz}$**) olmalıdır.
- **Gerekçe:** Fikstür rezonansa girerse, shaker'dan gelen enerji kontrolsüz katlanır ve test geçersiz sayılır.

---

## 2. Sensör ve Enstrümantasyon Planı
Test planında asgari 2 adet üç eksenli (tri-axial) ivmeölçer tanımlanır:
1. **Kontrol Sensörü ($A_{\text{ctrl}}$):** Fikstürün test tablasına bağlandığı en rijit noktaya konur; shaker kapalı çevrim kontrolü bu sensörden yürütülür.
2. **Tepki Sensörü ($A_{\text{resp}}$):** Parçanın deterministik olarak hesaplanan **Ağırlık Merkezine (CoG)** en yakın rijit düzleme yerleştirilir; parçanın rezonans amplifikasyon faktörü ($Q$) bu sensörle ölçülür.

---

## 3. Test İcra Sıralaması (Execution Sequence)
Her bir eksen (X, Y, Z) için sırasıyla:
1. **Titreşim Öncesi Rezonans Araması (Pre-Test Sine Sweep):**
   - $5 - 2000\text{ Hz}$, $0.5\text{ g}$ genlikte hızlı sinüs taraması ($1\text{ oct/min}$).
   - Amaç: Parçanın hasarsız doğal frekanslarını referans kaydetmek.
2. **Tam Düzey Rastgele Titreşim (Full Level Random Vibration):**
   - MIL-STD-810H Cat 14 profili ($7.70\text{ }g_{\text{rms}}$), 60 dakika kesintisiz.
3. **Titreşim Sonrası Rezonans Araması (Post-Test Sine Sweep):**
   - İlk taramayla birebir aynı $0.5\text{ g}$ sinüs taraması tekrarlanır.

---

## 4. Başarı ve Kabul Kriterleri (Pass/Fail Criteria)
Testin başarılı sayılması için aşağıdaki 3 askeri kriterin sağlanması şarttır:
1. **Rezonans Frekansı Kayması (Frequency Shift):**
   Test öncesi ve sonrası ölçülen rezonans frekansı arasındaki fark **%5'i aşmamalıdır**:
   $$\Delta f = \frac{|f_{\text{post}} - f_{\text{pre}}|}{f_{\text{pre}}} \times 100 \le 5\%$$
   *(%5'ten büyük kayma, parça içinde iç çatlak veya cıvata gevşemesi olduğunu gösterir).*
2. **Tork Kaybı Denetimi:**
   Montaj cıvatalarında test sonrası tork kaybı maksimum **%10** ile sınırlı kalmalıdır.
3. **Görsel ve NDT İnceleme:**
   Gözle veya penetrant sıvı (NDT) ile yapılan kontrollerde kalıcı plastik deformasyon, boya atması harici çatlak veya gevşeme tespit edilmemelidir.

---
Bağlantılı Notlar:
- [[05_Local_LLM_DPO_Pipeline|05. Yerel LLM ve Adaptif Öğrenme]]
- [[MIL_STD_810H_Method_514_Vibration|MIL-STD-810H Titreşim Kılavuzu]]
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
