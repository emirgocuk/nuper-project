# Project Brief: Nuper Citadel

## 1. Yönetici Özeti (Executive Summary)
**Nuper Citadel**, savunma sanayii ve ileri donanım mühendisliği geliştiren ekiplerin (İHA, robotik, aviyonik, mekanik alt sistemler) tasarladıkları parçaları fiziksel teste sokmadan veya sonlu elemanlar analizine (FEA) almadan önce, askeri çevre koşulları standartlarına (başta **MIL-STD-810H**, yol haritasında RTCA DO-160G ve STANAG 4370) uygunluğunu yerel ortamda saniyeler içinde doğrulayan, analiz sınır koşullarını türeten, FEA sonrası kapalı döngü rezonans/notching doğrulamasını yapan ve resmi test kabul dokümantasyonunu (askeri A4 PDF ETP) otonom üreten yerel bir mühendislik motorudur.

---

## 2. Çözülen Temel Sorun (Varoluş Sebebi)
Savunma ve havacılık projelerinde bir mekanik gövde veya aviyonik kutu tasarlandığında en büyük darboğaz CAD çizimi değil; parçanın askeri kalifikasyon sürecidir:

1. **Standart Karmaşası:** 1.000+ sayfalık MIL-STD-810 dokümanları arasında doğru platform kategorisini (ör. Kanat altı pod titreşimi, zırhlı araç şoku) ve kırılma frekanslarını elle aramak günler sürer.
2. **FEA Kurulum Belirsizliği:** Simcenter NX, ANSYS veya Nastran gibi araçlarda simülasyon çözecek mühendis; eğitim föylerindeki hazır yükleme reçeteleri gerçek projelerde olmadığı için hangi frekansta kaç $g^2/\text{Hz}$ PSD tablosu gireceğini, hangi sönümleme oranını ($\zeta$) seçeceğini kestiremez.
3. **Mali ve Zamansal Kayıp:** Yanlış test profiliyle veya eksik sınır parametresiyle akredite test merkezine (TÜBİTAK SAGE, TRTEST vb.) gidildiğinde, tek bir test gününün maliyeti binlerce doları bulur ve parça arızalandığında proje aylarca geriye düşer.
4. **Veri Güvenliği Duvarı:** Askeri tasarım verileri (CAD/STEP) gizlilik protokolleri (NDA / ITAR / Askeri Gizlilik Derecesi) nedeniyle bulut tabanlı yapay zekâ araçlarına (ChatGPT, Claude vb.) yüklenemez.
5. **FEA Sonrası Doğrulama Kopukluğu:** Simülasyon çözüldükten sonra mod frekansları ve stres değerlerinin standart limitleriyle ve rezonans kaçınma eşikleriyle karşılaştırılması genellikle manuel ve hataya açık kalır.

---

## 3. Operasyonel Amaç ve 4 Temel Sütun
Nuper Citadel, kullanıcının iş istasyonunda **tamamen yerel ve çevrimdışı (air-gapped)** çalışarak şu 4 ana görevi yerine getirir:

```
[3D STEP Modeli + 2D Teknik Resim + Görev Profili]
                         │
                         ▼
        ┌──────────────────────────────────┐
        │          NUPER CITADEL           │
        │   (Deterministik + Yerel AI)     │
        └──────────────────────────────────┘
           │          │          │          │
           ▼          ▼          ▼          ▼
       [1. Pre-FEA] [2. Risk] [3. Post-FEA] [4. A4 PDF ETP]
```

1. **Katı Model Geometrisini & Bağlayıcıları Standartla Eşleştirir:**
   - Yüklenen `.step` dosyasından parçanın net hacmini, kütlesini, ağırlık merkezini (CoG), montaj delik aralıklarını ve kritik boyutsal sınırlarını deterministik olarak çıkarır (`cad_parser.py`).
   - DIN 912 / ISO 273 normlarına göre tork ve ön yük reçetesi hazırlar (`fastener_engine.py`).
2. **Simülasyon Ön-İşlemcisi (Pre-FEA Copilot) Görevi Görür:**
   - Simcenter NX, ANSYS veya Abaqus için doğrudan içe aktarılabilir titreşim spektrum tablolarını (`.csv` formatında 120-noktalı PSD eğrileri), APDL kodunu ve sınır koşulu yönergesini hazırlar (`fea_exporter.py`).
3. **FEA Sonrası Kapalı Döngü Doğrulama & Çentikleme (Post-FEA Closed-Loop):** *(UYGULANDI)*
   - Simülasyon çıktısı olan mod frekanslarını ve pik von Mises gerilmesini alarak rezonans kaçınma ($f_1 > 1.2 \times f_{\max}$), dinamik büyütme ($Q$), akma emniyeti ($MS$) ve gerekliyse çentikleme (notching) derinliği ($\Delta \text{dB}$) önerisini hesaplar (`post_fea_engine.py`).
4. **Resmi Test Planı (ETP) ve Savunma Kabul Dokümantasyonu Üretir:** *(UYGULANDI)*
   - Yerel LLM sentezi ve ReportLab vektörel motoruyla akredite test merkezine veya ana yükleniciye doğrudan sunulacak resmi A4 formatında, antetli, revizyonlu ve imza bloklu Çevresel Test Planı (ETP) üretir (`pdf_report_generator.py`).

---

## 4. Kendi Kendini Geliştirme Mekanizması (DPO / Local Learning)
Proje statik bir hesap makinesi olarak kalmaz. Mühendisin onayladığı veya üzerinde değişiklik yaptığı test kriterleri ve rapor düzenlemeleri, yerel veri tabanında bir tercih verisi (`prompt`, `chosen`, `rejected`) olarak birikir. Sistem, kullanıcının mühendislik kararlarından ve şirket içi tolerans kabullerinden yerel olarak beslenerek zamanla ekibin teknik diline ve tasarım reflekslerine bütünüyle uyum sağlar.

---

## 5. Pazar Konumlandırması ve Ticarileştirme Perspektifi
*(nuper_citadel_review.md doğrultusunda işlenmiştir)*

### 5.1. Rekabet Karşılaştırması

| Çözüm | Standart Arama | CAD / Delik Analizi | Pre-FEA Reçetesi | Post-FEA Döngüsü | Yerel AI & A4 PDF | ITAR / Air-Gap |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **NI-PAD / MIL-SPEC Pro** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **HBK / m+p VibControl** | ❌ | ❌ | ❌ (Sarsıcı kontrol) | ❌ | ❌ | Kısmi |
| **Altair SimSolid** | ❌ | Kısmi | ❌ (Meshsiz FEA) | ❌ | ❌ | Kısmi |
| **Nuper Citadel** | **✅** | **✅** | **✅** | **✅** | **✅** | **✅ %100** |

### 5.2. Hedef Müşteri Segmentleri
1. **Ana Yükleniciler:** ASELSAN, ROKETSAN, TUSAŞ, TEI, BMC (Kurumsal lisans, şirket içi standart şablonları).
2. **Alt Yüklenici & KOBİ Savunma Ekosistemi:** Nurol Makina, SDT, ARES Tersanesi, Katmerciler (Floating lisans, hızlı ETP hazırlığı).
3. **Akademi ve Araştırma Merkezleri:** TÜBİTAK SAGE, TÜBİTAK MAM, İTÜ, ODTÜ Savunma Teknolojileri (Akademik lisans).
4. **Dost/Müttefik İhracat Pazarı:** Suudi Arabistan, Katar, Pakistan, Azerbaycan savunma üreticileri (İngilizce lokalizasyon ile).

### 5.3. Lisanslama Modeli
- **Akademik Lisans:** Ücretsiz (Tek kullanıcı, watermark'lı PDF rapor).
- **Mühendis Lisansı:** $2.500 / yıl (Tek kullanıcı, tam deterministik motor + LLM + PDF export).
- **Takım Lisansı:** $8.000 / yıl (5 seat, paylaşımlı özel standartlar DB).
- **Kurumsal (Enterprise):** $25.000+ / yıl (Sınırsız kullanıcı, özel şirket standart entegrasyonu, yerel model desteği, offline lisans sunucusu).

---

## 6. Tek Cümlelik Vizyon Özeti
> **"Nuper Citadel; savunma donanımlarının tasarım masası ile akredite test merkezi arasındaki haftalar süren standart tarama, FEA yükü hazırlama, post-FEA rezonans doğrulama ve test dokümantasyonu çilesini ortadan kaldıran, tamamen güvenli ve yerel çalışan askeri kalifikasyon kalkanıdır."**
