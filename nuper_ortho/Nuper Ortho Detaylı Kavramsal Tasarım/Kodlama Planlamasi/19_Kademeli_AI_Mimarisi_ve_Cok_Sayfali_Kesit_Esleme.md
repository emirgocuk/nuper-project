# 🧠 19. Kademeli AI Mimarisi ve Çok Sayfalı Kesit Görünüş Eşleme

> **"Eski atölye iş istasyonlarında dahi kilitlenmeyen 4 seviyeli kademeli AI/OCR çıkarım hattı; çok sayfalı teknik resimler, kesit görünüşler (Section Views) ve taranmış/kaşeli çizimler için sağlam ön işleme mimarisi."**

---

## 📌 1. Saha Gerçeği: Atölye Bilgisayarları ve Çizim Karmaşıklığı

CMM odalarındaki bilgisayarlar genellikle son model yapay zekâ iş istasyonları değildir:
- **Donanım:** 5-8 yıllık Intel Core i5/i7 işlemci, 16 GB RAM ve harici GPU'su olmayan veya zayıf bir Quadro T400 kartına sahip bilgisayarlar.
- **7B VLM Felaketi:** Böyle bir makinede 7 milyar parametreli bir modeli (Qwen2-VL) CPU üzerinden çalıştırmaya kalkmak sistemi kilitler; sayfa başına 2 dakika bekletir.
- **Teknik Resim Karmaşıklığı:** Parçanın ölçüleri tek sayfada değildir. 4 sayfalı bir teknik resimde; Sayfa 1'de genel görünüş, Sayfa 2'de *Kesit A-A*, Sayfa 3'te *Detay B (5:1)* ve üzerinde kalite kontrol mührü/kaşesi yer alır.

---

## ⚡ 2. Dört Kademeli Akıllı Çıkarım Hattı (Tiered AI Pipeline)

Nuper Ortho, sistemi yormamak için **en hafiften en ağıra doğru** kademeli bir strateji izler:

```
┌─────────────────────────────────────────────────────────────┐
│ Girdi: CAD Modeli + 2D PDF Teknik Resim                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 🟢 SEVİYE 0: Doğrudan STEP AP242 Semantik PMI Ayrıştırma    │
│ • Modelde gömülü 3D tolerans varsa AI tamamen atlanır.      │
│ • Süre: < 0.2 saniye | RAM: 0 MB                             │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Modelde PMI yoksa Seviye 1'e geç)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 🟡 SEVİYE 1: Kural Tabanlı Klasik OCR & Geometrik Ayrıştırıcı│
│ • PaddleOCR / Tesseract + OpenCV Kontur Analizi             │
│ • Standart çaplar (Ø20 H7) ve basit tolerans kutuları       │
│ • Süre: 1 – 2 saniye | RAM: < 200 MB (Saf CPU)               │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Anlaşılamayan karmaşık semboller için)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 🟠 SEVİYE 2: Kompakt Vision SLM (Moondream2 / SmolVLM-1.7B) │
│ • 1.5 - 2.0 Milyar parametreli ultra hafif model (Q4 GGUF)  │
│ • ASME Feature Control Frame ve Lider çizgisi takibi        │
│ • Süre: 3 – 5 saniye | RAM: ~1.5 GB (Dahili GPU / CPU)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Sadece sistemde harici GPU varsa)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 🔴 SEVİYE 3: İleri Çok Modlu VLM (Qwen2-VL-7B)               │
│ • Yalnızca donanımda ≥ 8 GB VRAM NVIDIA GPU tespit edilirse │
│ • Çok karmaşık izometrik kesit ve el yazısı revizyon analizi │
└─────────────────────────────────────────────────────────────┘
```

---

## 📑 3. Çok Sayfalı (Multi-Sheet) PDF Yönetimi

Çizim yüklendiğinde `pdf-extract` katmanı sayfaları analiz eder ve etiketler:
1. **Sayfa 1 (Genel Görünüş):** Başlık bloğu (Title Block), malzeme türü, genel toleranslar (ISO 2768-mK) ve Primer Datum $A-B-C$.
2. **Sayfa 2..N (Kesit & Detay Görünüşler):** Alt parçalar, kademeli delikler ve derinlik toleransları.
3. **Sayfa İndeksleme:** Her tolerans kutusu ait olduğu sayfa numarasıyla etiketlenir (`Sheet: 2, Region: [x, y, w, h]`).

---

## ✂️ 4. Kesit Görünüşler (Section Views A-A) ve İzdüşüm Eşleme

Kesit görünüşlerdeki delikleri 3D STEP modeliyle eşleştirmek için **İzdüşüm Düzlemi Eşleme (Cutting Plane Alignment)** algoritması kullanılır:

```
2D TEKNİK RESİM:                           3D STEP CAD MODELİ:
┌────────────────────────┐                 ┌────────────────────────┐
│   KESİT A-A (1:1)      │                 │     Sanal Kesit        │
│   ├── Ø15 H7 Delik     │                 │   (OpenCASCADE BRep)   │
│   └── Derinlik: 35 mm  │                 │    Plane: Z = 45.0 mm  │
└───────────┬────────────┘                 └───────────┬────────────┘
            │                                          │
            └──────────────► [ EŞLEŞTİRME ] ◄──────────┘
                      Kesit Düzlemi Üzerindeki
                      Nominal Çap ve Derinlik Uyumu
```

### Algoritma Adımları:
1. Teknik resimdeki "KESİT A-A" kesme çizgisi ve ok yönü yakalanır.
2. STEP modeli üzerinde sanal bir kesme düzlemi (`gp_Pln`) oluşturulur.
3. 2D kesitte görünen delik çapı ve derinliği, bu düzlemin kestiği iç yüzeylerle (`TopoDS_Face`) eşleştirilir.
4. Eşleşme doğrulandığında tolerans doğrudan o iç silindire atanır.

---

## 🧹 5. Taranmış, Kaşeli ve Kirli Çizimler İçin Ön İşleme

Saha çizimlerinde sıkça görülen kırmızı onay kaşeleri ve tarayıcı eğrilikleri için OpenCV filtreleme hattı çalışır:

1. **Eğrilik Düzeltme (Deskewing):**
   Sayfa kenarları Hough Dönüşümü ile tespit edilerek $\pm 5^\circ$ dönüklükler düzeltilir.
2. **Kaşe Maskeleme (Stamp Removal via HSV):**
   Savunma fabrikalarındaki mavi/kırmızı kalite kontrol kaşeleri HSV renk uzayında izole edilerek metin arkasından silinir:
   $$\text{Hue}_{\text{red}} \in [0, 10] \cup [170, 180] \implies \text{Maskelenir ve Beyaza Çevrilir}$$
3. **Adaptif İkileştirme (Sauvola Binarization):**
   Fotokopi lekeleri ve gölgeler temizlenerek jilet gibi net siyah-beyaz vektör hatlar elde edilir.

---

## 🖥️ 6. Etkileşimli İkili Kanvas (Split-Screen Ballooning UI)

Otomasyonun $<0.80$ güven skoruna düştüğü durumlarda operatörü yormayan ultra hızlı ikili ekran açılır:

```
┌────────────────────────────────────────┬────────────────────────────────────────┐
│ SOL: 2D PDF TEKNİK RESİM               │ SAĞ: 3D STEP KANVASI                   │
│                                        │                                        │
│     [ ① Ø20 H7 (A-A) ]                 │              (Model Önizleme)          │
│                \                       │                                        │
│                 \ (Sürükle - Bırak)    │            ┌─────┐                     │
│                  └─────────────────────┼──────────► │  ●  │ <-- İlgili Delik    │
│                                        │            └─────┘     Yeşil Yanar     │
│ [ Otomatik Balonları Doğrula ]         │ [ Seçili Eşlemeyi Onayla ]             │
└────────────────────────────────────────┴────────────────────────────────────────┘
```

- **Tek Tıkla Balonlama (Auto-Balloon):** PDF üzerindeki tüm tolerans kutularına otomatik numara (①, ②, ③) atanır.
- **Sürükle-Bırak:** Eşleşmemiş sarı bir balon fareyle 3D modeldeki deliğin üzerine bırakıldığında eşleme **1 saniyede** tamamlanır.

Bu kademeli yaklaşım, Nuper Ortho'nun hem $50.000$'lık sunucularda hem de atölyedeki eski bir ofis bilgisayarında saniyeler içinde akıcı çalışmasını garanti eder.
