---
title: Askeri İhale ve Savunma İtiraz Veri Tabanı (Audit & Objection Defense)
created: 2026-09-20
tags:
  - engineering
  - defense-audit
  - objection-engine
  - tdp
  - mil-std-810h
  - qualification
---

# 🛡️ Askeri İhale ve Savunma İtiraz Veri Tabanı (Audit & Objection Defense)

Savunma projelerinde donanım geliştiren alt yüklenicilerin karşılaştığı en yıpratıcı anlardan biri; ana yüklenicilerin (ASELSAN, ROKETSAN, MKE vb.) kalite kurullarının veya akredite test laboratuvarlarının (TÜBİTAK SAGE, TRTEST) **parçayı bir test anomalisi veya doküman eksikliği nedeniyle reddetmesidir**.

Nuper Citadel, yalnızca test hazırlayan bir mühendislik aracı değil; **mühendisin elini güçlendiren, askeri standart maddelerine dayalı teknik itiraz argümanları üreten ve Teknik Veri Paketini (TDP) denetleyen bir savunma kalkanıdır.**

---

## 1. Citadel’in Mühendislik Beyni (Genişletilmiş Karar Akışı)

```
[CAD / STEP Geometrisi] + [Operasyonel Görev Şartı]
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
   [Geometri & Kütle]             [Askeri Standart DB]
   - CoG & Moment Kolu            - Titreşim / Şok Matrisi
   - Delik ve Fikstür Arayüzü     - Sıcaklık Limitleri
         │                                 │
         └────────────────┬────────────────┘
                          ▼
            ┌───────────────────────────┐
            │   CITADEL ANALİTİK MOTOR  │
            │  1. Fikstür İsterleri     │
            │  2. PSD & Çözücü Girdisi  │
            │  3. Yorulma & Risk Sınırı │
            └─────────────┬─────────────┘
                          │
                          ▼
             [FEA Çözücü Geri Beslemesi]
             (Doğal Frekanslar & 3-Sigma Stres)
                          │
                          ▼
            ┌───────────────────────────┐
            │    NİHAİ SAVUNMA RAPORU   │
            │  - Test Merkezi Kabul Föyü│
            │  - Kümülatif Hasar (D)    │
            │  - Standart İtiraz Dayanağı│
            └───────────────────────────┘
```

---

## 2. Test Anomalisi İtiraz Motoru (Objection Defense Engine)

Fiziksel sarsıcı (shaker) testleri sırasında hidrolik veya elektrodinamik armatürün ani rezonansı, şebeke dalgalanması veya kablo gürültüsü nedeniyle ivmeölçer grafiklerinde anlık kontrol dışı sıçramalar (**spike**) görülebilir. Test teknisyeni bu sıçramayı gerekçe göstererek testi durdurup "Numune aşırı yüke maruz kaldı, test başarısız" diyebilir.

### Citadel’in Otonom İtiraz Metni Üretimi:
Citadel, test loglarındaki anomaliyi MIL-STD-810H tolerans matrisi ile kıyaslar ve test kuruluna sunulacak resmi teknik savunma dilekçesini hazırlar:

> **TEKNİK İTİRAZ VE SAVUNMA GEREKÇESİ:**
> *"Test sırasında 420 Hz frekansında ölçülen +2.4 dB'lik anlık kontrol sapması incelenmiştir.*
> ***MIL-STD-810H Metot 514.8 Bölüm 4.2.2 ('Test Tolerances and Control')*** *hükümlerine göre; rastgele titreşim testlerinde $\pm 1.5\text{ dB}$ nominal kontrol bandı haricinde, test süresinin %1'ini aşmayan dar bantlı piklerde $\mathbf{\pm 3.0\text{ dB}}$ **izin verilen maksimum sapma sınırları dahilindedir**.*
> *Parçanın test öncesi ve test sonrası rezonans arama (sine sweep) taramalarında birinci mod frekansı 340 Hz olarak sabit kalmış olup, frekans kayması $\Delta f = \%0.8 < \%5$ kabul limitinin altındadır.*
> *Bu teknik dayanaklar doğrultusunda söz konusu anomali kalifikasyon reddi sebebi sayılamaz; test başarıyla tamamlanmış kabul edilmelidir."*

---

## 3. TDP (Teknik Veri Paketi) Uyumluluk ve Eksiklik İndeksi

Bir parçanın askeri denetimden geçebilmesi için sadece geometrisinin doğru olması yetmez; teknik resminde ve imalat föyünde savunma standartlarının eksiksiz belirtilmesi gerekir. Citadel şu kontrolleri otonom yapar:

| Denetim Alanı | Askeri Standart Referansı | Citadel Kontrolü ve Uyarısı |
| :--- | :--- | :--- |
| **Yüzey Koruma & Korozyon** | **MIL-DTL-5541 Type II Class 3** veya **MIL-A-8625 Type II Anodize** | *"Al 6061-T6 parçada tuz sisi (Method 509) korozyon direnci için kimyasal dönüşüm kaplaması (Alodine) teknik resme işlenmelidir."* |
| **Cıvata & Tork Standardı** | **MS / NAS Standartları (MS35307, NAS1351)** | *"Kullanılan M4 cıvataların tork değeri ISO/MS standartlarına göre 3.2 Nm olarak belirtilmeli ve Nord-Lock pul şart koşulmalıdır."* |
| **Boya & Kamuflaj** | **MIL-PRF-23377 Primer + MIL-DTL-53039 CARC** | *"Hava platformu dış yükü için kimyasal ajanlara dayanıklı CARC kaplama kodu teknik veri paketinde eksiktir."* |
| **Temiz Oda & Yağdan Arındırma** | **MIL-STD-1246 / IEST-STD-CC1246** | *"Aviyonik bölmesine girecek optik ve pod parçalarında uçucu organik bileşen (outgassing) limit kontrolü."* |

---

## 4. Stratejik Değer: "Mühendislik Kalkanı"
Bu katman devreye girdiğinde Nuper Citadel;
1. Mühendisi test merkezinde haksız test tekrarlarından (test günü başına 5.000$ - 15.000$ tasarruf) korur.
2. Ana yüklenici kalite denetimlerinde teknik şartname eksikliklerinden dolayı projenin aylarca kilitlenmesini engeller.
3. Donanımın tasarım masasından akredite kabul sertifikasına kadar olan tüm yolculuğunu zırh altına alır.

---
Bağlantılı Notlar:
- [[00_System_Architecture_Blueprint|Sistem Mimarisi Blueprint]]
- [[Environmental_Test_Plan_ETP_Spec|Resmi ETP Standardı]]
- [[Palmgren_Miner_Fatigue_Life|Malzeme Yorulma Ömrü ve Miner Kuralı]]
- [[Fixture_Design_and_Resonance_Envelope|Fikstür Tasarım İsterleri]]
