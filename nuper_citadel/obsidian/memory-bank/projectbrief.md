# Project Brief: Nuper Citadel

## 1. Yönetici Özeti (Executive Summary)
**Nuper Citadel**, savunma sanayii ve ileri donanım mühendisliği geliştiren ekiplerin (İHA, robotik, aviyonik, mekanik alt sistemler) tasarladıkları parçaları fiziksel teste sokmadan veya sonlu elemanlar analizine (FEA) almadan önce, askeri çevre koşulları standartlarına (başta **MIL-STD-810H**) uygunluğunu yerel ortamda saniyeler içinde doğrulayan, analiz sınır koşullarını türeten ve test kabul dokümantasyonunu otonom üreten yerel bir mühendislik motorudur.

---

## 2. Çözülen Temel Sorun (Varoluş Sebebi)
Savunma ve havacılık projelerinde bir mekanik gövde veya aviyonik kutu tasarlandığında en büyük darboğaz CAD çizimi değil; parçanın askeri kalifikasyon sürecidir:

1. **Standart Karmaşası:** 1.000+ sayfalık MIL-STD-810 dokümanları arasında doğru platform kategorisini (ör. Kanat altı pod titreşimi, zırhlı araç şoku) ve kırılma frekanslarını elle aramak günler sürer.
2. **FEA Kurulum Belirsizliği:** Simcenter NX, ANSYS veya Nastran gibi araçlarda simülasyon çözecek mühendis; eğitim föylerindeki hazır yükleme reçeteleri gerçek projelerde olmadığı için hangi frekansta kaç $g^2/\text{Hz}$ PSD tablosu gireceğini, hangi sönümleme oranını ($\zeta$) seçeceğini kestiremez.
3. **Mali ve Zamansal Kayıp:** Yanlış test profiliyle veya eksik sınır parametresiyle akredite test merkezine (TÜBİTAK SAGE, TRTEST vb.) gidildiğinde, tek bir test gününün maliyeti binlerce doları bulur ve parça arızalandığında proje aylarca geriye düşer.
4. **Veri Güvenliği Duvarı:** Askeri tasarım verileri (CAD/STEP) gizlilik protokolleri (NDA / ITAR / Askeri Gizlilik Derecesi) nedeniyle bulut tabanlı yapay zekâ araçlarına (ChatGPT, Claude vb.) yüklenemez.

---

## 3. Operasyonel Amaç ve 3 Temel Sütun
Nuper Citadel, kullanıcının iş istasyonunda **tamamen yerel ve çevrimdışı (air-gapped)** çalışarak şu 3 ana görevi yerine getirir:

```
[3D STEP Modeli + Görev Profili]
              │
              ▼
    ┌──────────────────┐
    │  NUPER CITADEL   │
    │   (Yerel Motor)  │
    └──────────────────┘
       │        │        │
       ▼        ▼        ▼
   [1. FEA]  [2. Risk] [3. ETP]
```

1. **Katı Model Geometrisini Standartla Eşleştirir:**
   - Yüklenen `.step` dosyasından parçanın net hacmini, kütlesini, ağırlık merkezini (CoG), montaj delik aralıklarını ve kritik boyutsal sınırlarını deterministik olarak çıkarır; seçilen askeri platformun sınır değerleriyle kıyaslar.
2. **Simülasyon Ön-İşlemcisi (Pre-FEA Copilot) Görevi Görür:**
   - Simcenter NX, ANSYS veya Abaqus için doğrudan içe aktarılabilir titreşim spektrum tablolarını (`.csv` formatında PSD frekans-ivme eğrileri) ve sınır koşulu yönergesini hazırlar. Mühendise simülasyonu nasıl kuracağını adım adım söyler.
3. **Resmi Test Planı (ETP) ve Doğrulama Raporu Üretir:**
   - FEA'dan çıkan mod frekanslarını ve gerilmeleri geri besleme olarak alıp, akredite test merkezine veya ana yükleniciye doğrudan sunulacak resmi kabul/doğrulama dokümanını basar.

---

## 4. Kendi Kendini Geliştirme Mekanizması (DPO / Local Learning)
Proje statik bir hesap makinesi olarak kalmaz. Mühendisin onayladığı veya üzerinde değişiklik yaptığı test kriterleri ve rapor düzenlemeleri, yerel veri tabanında bir tercih verisi (`prompt`, `chosen`, `rejected`) olarak birikir. Sistem, kullanıcının mühendislik kararlarından ve şirket içi tolerans kabullerinden yerel olarak beslenerek zamanla ekibin teknik diline ve tasarım reflekslerine bütünüyle uyum sağlar.

---

## 5. Tek Cümlelik Vizyon Özeti
> **"Nuper Citadel; savunma donanımlarının tasarım masası ile akredite test merkezi arasındaki haftalar süren standart tarama, FEA yükü hazırlama ve test dokümantasyonu çilesini ortadan kaldıran, tamamen güvenli ve yerel çalışan askeri kalifikasyon kalkanıdır."**
