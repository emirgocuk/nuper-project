---
title: Nuper Citadel - Savunma Kalifikasyon ve Pre-FEA Mühendislik Motoru
created: 2026-09-20
tags:
  - moc
  - nuper-citadel
  - defense-engineering
  - mil-std-810h
  - fea
  - cad
---

# 🛡️ Nuper Citadel: Master Map of Content (MOC)

> **"Savunma donanımlarının tasarım masası ile akredite test merkezi arasındaki haftalar süren standart tarama, FEA yükü hazırlama ve test dokümantasyonu çilesini ortadan kaldıran, tamamen güvenli ve yerel çalışan askeri kalifikasyon kalkanı."**

```
                       ┌─────────────────────────┐
                       │   3D STEP + GÖREV ADI   │
                       └────────────┬────────────┘
                                    │
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │                 NUPER CITADEL (YEREL ÇEKİRDEK)           │
       │  - OpenCASCADE Geometri Analizi (Kütle, CoG, Delikler)   │
       │  - Deterministik MIL-STD-810H Standart Matrisi           │
       │  - Simcenter NX / ANSYS PSD Sınır Koşulu Üretimi         │
       │  - Yerel LLM Askeri Test Planı (ETP) Sentezi             │
       └───────┬────────────────────┬────────────────────┬────────┘
               │                    │                    │
               ▼                    ▼                    ▼
     [Simülasyon Ön-İşlemci]  [Risk ve Uygunluk]  [Resmi ETP Raporu]
      (PSD .csv / Yönerge)    (Emniyet Katsayısı)   (A4 PDF / Onay)
```

---

## 🧭 Vault Navigasyonu ve Modül Haritası

### 🧠 1. Memory Bank (Proje Hafıza Bankası)
Bu proje, oturumlar ve yapay zekâ asistanları arasında kesintisiz hafıza aktarımı sağlayan **Memory Bank** mimarisi ile yönetilmektedir:
- [[memory-bank/MEMORY_BANK_PROTOCOL|📖 Hafıza Bankası Yönetim Protokolü]] - Çalışma modları, kurallar ve hiyerarşi.
- [[memory-bank/projectbrief|📋 Proje Özeti (Project Brief)]] - Temel hedefler, varoluş sebebi ve vizyon.
- [[memory-bank/productContext|🎯 Ürün ve Pazar Bağlamı (Product Context)]] - Çözülen sektörel darboğazlar ve kullanıcı deneyimi.
- [[memory-bank/activeContext|⚡ Aktif Bağlam (Active Context)]] - Mevcut odak, son kararlar ve anlık gündem.
- [[memory-bank/systemPatterns|📐 Sistem Mimarisi (System Patterns)]] - Deterministik katman ve yerel yapay zekâ ayrımı.
- [[memory-bank/techContext|💻 Teknoloji Yığını (Tech Context)]] - Tauri, FastAPI, pythonocc-core, SQLite, Qwen/Llama.
- [[memory-bank/progress|📊 İlerleme ve Durum (Progress)]] - Tamamlananlar, yol haritası ve risk matrisi.
- [[AGENTS|📜 Proje Zekası ve Kuralları (AGENTS.md)]] - Askeri mühendislik ve kodlama kuralları.
- [[nuper_citadel_review|🔍 Kapsamlı Proje İncelemesi ve Teknik Öneriler (Review)]] - Mimari analiz, pazar değerlendirmesi ve uygulama yol haritası.

---

### 🏗️ 2. Sistem Mimarisi ve Çekirdek Modüller
- [[00_Master_Roadmap|🚀 00. Master Geliştirme Yol Haritası (Faz 1 - Faz 5)]] - Uçtan uca faz faz geliştirme sırası ve teslim planı.
- [[00_System_Architecture_Blueprint|🏛️ 00. Sistem Mimarisi Ana Tasarımı (Blueprint)]] - Katmanlı mimari, modül ayrıntıları ve kod tabanı.
- [[01_Tauri_Desktop_Shell|🖥️ 01. Tauri & Next.js Masaüstü Kabuğu]] - Air-gapped yerel arayüz, Three.js 3D STEP viewer.
- [[02_CAD_Geometry_Engine|📐 02. CAD & Geometri Ayrıştırıcı]] - OpenCASCADE tabanlı kütle, CoG, BBox ve montaj delik hesabı.
- [[03_Deterministic_Rule_Engine|⚖️ 03. Deterministik Standart & Kural Motoru]] - MIL-STD-810H ilişkisel SQLite kural matrisi.
- [[04_FEA_Bridge_PreProcessor|🌉 04. FEA Ön-İşlemci Jeneratörü]] - NX Response Sim & ANSYS Random Vibration PSD CSV/AFU köprüsü.
- [[05_Local_LLM_DPO_Pipeline|🤖 05. Yerel LLM ve Adaptif Öğrenme (DPO)]] - Air-gapped Qwen 2.5/Llama 3.3, ETP sentezi ve LoRA geri bildirimi.
- [[06_Data_Flow_End_to_End|🔄 06. Uçtan Uca Veri Akış Şeması]] - STEP yüklemeden nihai kabul paketine adım adım boru hattı.
- [[07_Commercial_and_Operational_Pillars|💼 07. Operasyonel Güvenlik, Lisanslama ve Doğrulama]] - Offline RSA lisanslama, STEP denetimi, EULA ve Golden Bench.

---

### 🛡️ 3. Askeri Kalifikasyon ve Savunma Kalkanı Katmanları
Nuper Citadel'i sadece bir parametre üreticisi olmaktan çıkarıp uçtan uca koruma sağlayan bir savunma kalkanına dönüştüren 5 ileri mühendislik katmanı:
- [[Fixture_Design_and_Resonance_Envelope|🔩 Fikstür Tasarım İsterleri & Rezonans Güvenlik Zarfı]] - Sarsıcı tablada kontrolsüz rezonans önleme ve et kalınlığı hesabı.
- [[GDT_and_CMM_Tolerance_Bridge|📏 İmalat Toleransı & CMM Doğrulama Entegrasyonu (GD&T Bridge)]] - Gerçek işlenen parçanın tolerans sapmasını FEA matrisine aktarma.
- [[Combined_Environmental_Profiles|🌪️ Çoklu Çevresel Koşul Kombinasyonları]] - Sıcaklık döngüsü ile titreşimin kesişiminde cıvata ön yükü ve gevşeme analizi.
- [[Palmgren_Miner_Fatigue_Life|⏳ Malzeme Yorulma Ömrü & Miner Kümülatif Hasar Kuralı]] - Gauss 3-bant yaklaşımı ve Wöhler (S-N) döngü hasar hesabı ($D < 0.20$).
- [[Audit_and_Objection_Defense_Engine|🛡️ Askeri İhale ve Savunma İtiraz Veri Tabanı]] - Test anomali itiraz motoru ve TDP şartname denetim kütüphanesi.

### 🎖️ 4. Askeri Standartlar ve Test Kütüphanesi
- [[MIL_STD_810H_Method_514_Vibration|🔊 MIL-STD-810H Metot 514.8 (Titreşim)]] - Kategori 4, 14, 20 PSD kırılma frekansları, $g_{\text{rms}}$ ve formüller.
- [[MIL_STD_810H_Method_501_502_Temperature|🌡️ MIL-STD-810H Metot 501.7 & 502.7 (Yüksek/Düşük Sıcaklık)]] - Basic Hot/Cold döngüleri ve malzeme genleşmesi.
- [[MIL_STD_810H_Method_516_Shock|💥 MIL-STD-810H Metot 516.8 (Mekanik Şok)]] - Klasik darbe şoku (sawtooth, half-sine) ve SRS spektrumları.
- [[Environmental_Test_Plan_ETP_Spec|📄 Resmi Çevresel Test Planı (ETP) Standardı]] - TÜBİTAK SAGE / TRTEST uyumlu A4 doküman şablonu.
- [[FEA_Boundary_Conditions_Guidelines|🔬 FEA Sınır Şartları ve Modelleme Kılavuzu]] - Efektif kütle katılımı (%85 kuralı), sönümleme ($\zeta$) ve cıvata rijitliği.

---

### 💡 5. Fikir Geliştirme, İnovasyon ve Ar-Ge (Brainstorming & RFCs)
Nuper Citadel'i bir sonraki seviyeye taşıyacak tartışmaya ve geliştirmeye açık Ar-Ge başlıkları:
- [[Fikir_Havuzu_ve_Vizyon|🚀 Fikir Havuzu ve Vizyoner Yol Haritası]] - Tartışma bekleyen açık konular ve stratejik hedefler.
- [[RFC_001_Cok_Eksenli_Titresim_ve_Yorulma|💡 RFC-001: Çok Eksenli Eşzamanlı Titreşim ve Steinberg Yorulma Analizi]] - 3-Sigma kuralı ve Basquin yorulma ömrü tahmini.
- [[RFC_002_Topoloji_Optimizasyonu_ve_Hafifletme|💡 RFC-002: MIL-STD Yükleri Altında Generative Topoloji Optimizasyonu]] - Ağırlık azaltma ve parça mukavemet sentezi.
- [[RFC_003_NATO_STANAG_4370_ve_RTCA_DO_160G|💡 RFC-003: Çoklu Standart Genişlemesi (NATO STANAG 4370 & DO-160G)]] - Sivil havacılık ve NATO müttefik sertifikasyonu.
- [[RFC_004_Test_Merkezi_Geri_Besleme_ve_Sertifikasyon_Kolu|💡 RFC-004: Test Merkezi İvmeölçer Verisi ile FEA Korelasyonu]] - TÜBİTAK SAGE / TRTEST shaker ivme verisini geri besleme döngüsü.
- [[RFC_005_Edge_Hardware_in_the_Loop_Sensor_Baglantisi|💡 RFC-005: Uçuş Testi Telemetrisi ile Gerçek Zamanlı Spektrum Türetimi]] - Canlı uçuş verisinden mission tailoring PSD profili çıkarma.

---

## 📊 Hızlı Sistem Durumu
| Bileşen | Durum | Öncelikli Hedef |
| :--- | :---: | :--- |
| **Hafıza ve Mimari Tanımı** | 🟢 Tamamlandı | Obsidian & Memory Bank senkronizasyonu (%100) |
| **CAD Ayrıştırıcı (pythonocc)** | 🟢 Tamamlandı | OpenCASCADE BRep mesh, kütle, CoG ve delik tespiti |
| **Kural Motoru (SQLite)** | 🟢 Tamamlandı | MIL-STD-810H Cat 14/4/20 ve kütle sönümleme |
| **FEA Köprüsü (NX/ANSYS)** | 🟢 Tamamlandı | 120-noktalı PSD CSV ve ANSYS APDL üretimi |
| **Post-FEA Kapalı Döngü** | 🟢 Tamamlandı | Rezonans kaçınma, dinamik Q ve notching derinliği |
| **Resmi Savunma A4 PDF** | 🟢 Tamamlandı | ReportLab antetli, doküman no'lu askeri ETP PDF |
| **Yerel LLM (Ollama/Qwen)** | 🟢 Tamamlandı | ETP sentezi, over-testing itiraz ajanı ve DPO |
| **Masaüstü Kabuğu (Tauri)** | 🟡 Sırada | Tek tıkla installer ve embedded Python yönetimi |
| **Birim & Entegrasyon Testleri** | 🟢 52/52 PASSED | %100 Başarı (14 saniye) |

---
*Bu kasa, savunma standartlarının deterministik kesinliği ile yerel yapay zekânın üretken gücünü birleştiren bir mühendislik rehberi olarak tasarlanmıştır.*
