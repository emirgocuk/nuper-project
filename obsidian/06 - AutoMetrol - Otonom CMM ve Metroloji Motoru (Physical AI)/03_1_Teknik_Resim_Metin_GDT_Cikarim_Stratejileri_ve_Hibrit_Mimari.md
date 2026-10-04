# 📄 03.1. Teknik Resim Metin, GD&T Çıkarım Stratejileri ve Hibrit Mimari

> **"Teknik resimlerdeki semantik bilgiyi (ölçüler, toleranslar, datumlar ve antet verileri) sıfır halüsinasyon, minimum donanım ayak izi ve deterministik doğrulukla çıkaran çok katmanlı hibrit çıkarma mimarisi."**
> 
> *İlgili Temel Doküman:* [[03_2D_PDF_GDT_ve_Datum_Esleme_Motoru|03. 2D PDF GD&T ve Datum Eşleme Motoru]]  
> *Sistem:* Nuper Ortho / AutoMetrol  

---

## 🎯 1. Kök Neden Analizi: CAD ve PDF Çıktılarındaki Temel Darboğazlar

Endüstriyel imalatta (özellikle Aselsan, Roketsan, TUSAŞ gibi savunma sanayii standartlarındaki teknik resimlerde) metin çıkarma süreçlerinde karşılaşılan **3 ana kök neden** bulunmaktadır:

### 1.1. Parçalanmış Font Kodlaması (Identity-H / CID)
Siemens NX, CATIA, SolidWorks ve Creo gibi CAD yazılımları, 2D teknik resim dokümanlarını PDF formatına dışa aktarırken fontları glif bazında Identity-H CID encoding ile gömer. Bu durum şu sonuçları doğurur:
- **Token Parçalanması:** Ölçü ve toleranslar tek bir string olarak değil, bağımsız parçalar olarak basılır. Örneğin 39 ±0.1 ifadesi PDF akışında ["39"], ["±"], ["0.1"] şeklinde 3 ayrı koordinatlı metin nesnesi olarak yer alır. 2X M3 HELICOIL ifadesi 3 farklı bağımsız blok halinde dağılır.
- **Glif Kaybı (Missing ToUnicode Map):** Özel mühendislik karakterleri (çap sembolü Ø, tolerans ±, kare □, derece °) standart ASCII haritasında bulunmaz. Gömülü ToUnicode CMap tablosu eksik veya bozuk olduğunda, bu karakterler U+FFFD (Replacement Character) veya rastgele ASCII glifleri (^Z^N, |) olarak okunur.
- **Dönüşüm Matrisleri (Matrix Transformations):** Dikey veya açılı ölçülerde metinler 90° veya keyfi açılarla döndürülür ([cos θ, sin θ, -sin θ, cos θ, tx, ty]). Standart satır bazlı okuyucular bu blokları kaçırır.

### 1.2. Taranmış (Raster / Scanned) ve Patlatılmış (Stroked) PDF'ler
- Bazı tedarikçi veya arşiv teknik resimleri doğrudan taranmış tiff/png görüntülerinden PDF'e dönüştürülmüştür (Örn: KOR TAPA_TR.pdf, pistonUcu_TR.pdf, GOBEK BAGI OLUGU).
- Bazı CAD dışa aktarıcıları ise metinleri font olarak değil, doğrudan vektörel çizgi yollarına (stroke / polyline) patlatarak basar.
- **Sonuç:** Vektörel PDF ayrıştırıcıları (PyMuPDF, pdfjs, pdfplumber) bu dosyalarda **0 metin katmanı (0 karakter)** bulur. OCR olmaksızın bu dosyalardan tek bir harf dahi okunamaz.

### 1.3. Karmaşık 2D Uzamsal Düzen ve Gürültü Elemanları
- Teknik resimlerde metinler rastgele serpiştirilmez; geometrik unsurlara lider çizgileri (leader lines), ölçü bağlama çizgileri ve Feature Control Frame (FCF) kutuları ile bağlanır.
- Sayfa kenarlarındaki bölge indeksleri (A, B, C, D, 1..8), antet tablosu (Tolerans: ISO 2768-mK, Malzeme: 7075-T6), revizyon blokları ve telif metinleri (ALL RIGHTS RESERVED, HER HAKKI MAHFUZDUR) ölçü filtreleme motorunu yanıltabilecek uzamsal gürültü oluşturur.

---

## 🔬 2. Açık Kaynak Çözümler ve Araç Karşılaştırma Matrisi

Endüstriyel teknik resim ayrıştırma problemi için incelenen açık kaynak teknolojiler 4 ana katmana ayrılmıştır:

`
┌────────────────────────────────────────────────────────────────────────┐
│                      KATMAN 4: Vision-Language Modeller                │
│             Qwen2-VL, Qwen3-VL, Florence-2, Donut (4-8 GB VRAM)        │
├────────────────────────────────────────────────────────────────────────┤
│                  KATMAN 3: Mühendislik Çizimine Özel Projeler          │
│        eDOCr, PaddleOCR_Engineering_Drawings, Werk24, MechVQA          │
├────────────────────────────────────────────────────────────────────────┤
│                       KATMAN 2: Yerel OCR Motorları                    │
│            Surya OCR, PaddleOCR (PP-OCRv4), docTR, EasyOCR             │
├────────────────────────────────────────────────────────────────────────┤
│                 KATMAN 1: Deterministik Vektör Ayrıştırma              │
│                 PyMuPDF (fitz), pdfjs-dist, pdfplumber, ezdxf          │
└────────────────────────────────────────────────────────────────────────┘
`

### Detaylı Karşılaştırma Tablosu

| Teknoloji / Kütüphane | Kategori | VRAM Tüketimi | Hız (Sayfa Başı) | Doğruluk (Metin Katmanlı) | Doğruluk (Taranmış/Görüntü) | Açık Kaynak / Lisans | Güçlü Yönleri | Zayıf Yönleri |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---|
| **PyMuPDF (fitz)** | Katman 1 | 0 MB (CPU) | <10 ms | **%99.9** | %0 | AGPL / Ticari | Ultra hızlı, font boyutu, rotasyon matrisi ve çizim ilkellerini verir. | Raster görüntülerde 0 döner. |
| **pdfjs-dist (Mozilla)** | Katman 1 | 0 MB (Tarayıcı) | <30 ms | **%95** | %0 | Apache 2.0 | İstemci tarafında sıfır kurulumla tarayıcıda çalışır. | ToUnicode harita eksikliklerinde glif bozulması. |
| **ezdxf** | Katman 1 | 0 MB (CPU) | <20 ms | **%100** | N/A (CAD formatı) | MIT | Doğrudan DXF/DWG entity'lerini (DIMENSION, MTEXT, LEADER) çeker. | PDF dosyasını desteklemez. |
| **Surya OCR** ⭐ | Katman 2 | ~1.5 - 2 GB | 0.8 - 1.5 sn | %96 | **%95+** | Apache 2.0 | 90+ dil, çok dilli font tespiti, satır ve sütun layout tespiti, hafif transformer mimarisi. | 650M model ağırlığı indirmesi gerektirir. |
| **PaddleOCR (PP-OCRv4)** ⭐ | Katman 2 | ~1.5 - 2 GB | 0.5 - 1.2 sn | %95 | **%94+** | Apache 2.0 | Açılı/döndürülmüş metin algılama (DBNet++), kompakt model boyutu. | C++ / Python kütüphane bağımlılıkları. |
| **docTR (Mindee)** | Katman 2 | ~2 GB | 1.0 - 2.0 sn | %93 | %92 | Apache 2.0 | TensorFlow ve PyTorch desteği, doküman yönü düzeltme. | Küçük sembollerde (çap, tolerans) kaçırma yapabilir. |
| **EasyOCR** | Katman 2 | ~2 GB | 1.5 - 3.0 sn | %89 | %88 | Apache 2.0 | PyTorch tabanlı, kolay kurulum. | Dar fontlarda ve karmaşık teknik sembollerde zayıf. |
| **Tesseract OCR** | Katman 2 | 0 MB (CPU) | 0.8 - 2.5 sn | %82 | %78 | Apache 2.0 | Klasik OCR, harici GPU istemez. | Mühendislik sembolleri ve düşük çözünürlükte yüksek hata payı. |
| **eDOCr** | Katman 3 | ~2.5 GB | 2.0 - 4.0 sn | %94 | %93 | MIT | Makine mühendisliği çizimlerine özel eğitilmiş karakter kümesi. | Bakım aktivitesi düşük, TensorFlow 2 kısıtları. |
| **PaddleOCR_Engineering** | Katman 3 | ~3.5 - 4 GB | 2.5 - 5.0 sn | %96 | %95 | Apache 2.0 | PP-OCRv4 + Qwen3-0.6B VLM ile yapısal JSON üretimi. | Yüksek VRAM gereksinimi (4 GB civarı). |
| **Qwen2-VL / Qwen3-VL** | Katman 4 | 4.5 - 8 GB | 3.0 - 8.0 sn | %97 | %96 | Apache 2.0 | Tam sayfa bağlamsal anlama, lider çizgisi takibi. | 6 GB VRAM sınırında tepe noktaya ulaşır, yavaş. |

---

## 🏛️ 3. Nuper Ortho Hibrit Stratejisi (Mimari ve Akış)

Donanım kısıtları (6 GB VRAM hedefi, yerel / air-gapped savunma regülasyonları) ve mutlak güvenilirlik ilkesi gereği **Deterministik Vektörel Ayrıştırma** ile **Hafif Yerel OCR** motorunu birleştiren **Hibrit Çıkarım Hattı** uygulanır:

`mermaid
graph TD
    A[Teknik Resim PDF Yüklendi] --> B[Adım 1: Deterministik Vektör & Metin Ön-Analizi]
    
    B --> C{Metin Katmanı Yeterli mi?\ntext_len >= 50 ve token_count >= 15}
    
    C -- EVET (Vektörel PDF) --> D[Yol A: Deterministik 2D Uzamsal Kümeleme]
    D --> E[Yatay / Dikey BBox Sıralama]
    E --> F[Token Birleştirme: 39 + ± + 0.1 -> 39 ±0.1]
    F --> G[RegEx & GD&T Dilbilgisi Ayrıştırıcı]
    
    C -- HAYIR (Taranmış / Raster PDF) --> H[Yol B: 300 DPI Raster Görüntü Çıkarımı]
    H --> I[Yerel OCR Motoru / Surya OCR / PP-OCR]
    I --> J[Koordinatlı Kelime Kutuları: text, bbox, confidence]
    J --> G
    
    G --> K[Hallucination Guard & Antet Filtresi]
    K --> L[Nominal, Üst/Alt Tolerans, GD&T, BBox, Datum AST]
    L --> M[CadDrawingMatcher: STEP B-Rep Eşleştirme]
    M --> N[Çift Kanvas Senkronizasyonu & Teftiş Kartları]
`

### Stratejinin 4 Temel İlkesi

1. **Sıfır VRAM Önceliği:** Doküman eğer Siemens NX veya CATIA'dan doğrudan vektörel basılmışsa (test kütüphanemizdeki dosyaların %70'i), hiçbir nöral model veya GPU kullanılmaz. PyMuPDF / pdfjs ile mikrosaniyeler içinde saf matematiksel kümeleme yapılır.
2. **Otomatik Algılama ve Şeffaf Geçiş:** Kullanıcı teknik resim yüklediğinde dosyanın raster mı vektörel mi olduğunu seçmek zorunda kalmaz. Sistem ham metin yoğunluğunu saniyeden kısa sürede analiz eder; metin katmanı yoksa otomatik olarak 300 DPI render alıp OCR motorunu tetikler.
3. **Tek Birleşik AST Sözleşmesi:** Çıktı formatı ister vektörel yoldan ister OCR yolundan gelsin, DrawingExtractionResult şemasına dönüştürülür. Tolerans, nominal değer, datum ve koordinat kutuları tek merkezde toplanır.
4. **Kesin Sahte Veri Yasağı (No Mockup Rule):** Dosya adı gobek veya kpt diye önceden hazırlanmış sabit JSON verileri dönülmez. Çizimde ne varsa o okunur; okunamayan unsur varsa açıkça güven skoru (confidence score) ile raporlanır.

---

## 🛠️ 4. Kod Düzeyinde Uygulama Planı ve Entegrasyon

### 4.1. Python Arka Uç Motoru (	ools/drawing_extractor.py)
- pymupdf üzerinden ham sayfa metin tespiti yapılır.
- len(text.strip()) < 50 ise veya karakter yoğunluğu eşiğin altındaysa:
  - page.get_pixmap(dpi=300) ile yüksek çözünürlüklü sayfa görüntüsü belleğe alınır.
  - OCR hattı (Surya / Paddle / hafif fallback) çalıştırılarak metin kutuları (box, 	ext, confidence) elde edilir.
  - Sabit is_gobek_olugu mockup bloğu kaldırılarak tüm çizimler dinamik pipeline'dan geçirilir.

### 4.2. TypeScript Arayüz Ayrıştırıcısı (ui/src/modules/inspection/utils/DrawingPdfParser.ts)
- pdfjs-dist metin içeriği sıfır veya yetersiz olduğunda:
  - Sayfa canvas üzerine 2.0x ölçeğinde çizilir.
  - Varsa IPC üzerinden Python OCR servisinden koordinatlı veriler talep edilir; yoksa görsel tespit tabanlı dinamik fallback devreye girer.
  - Mockup blokları kaldırılarak tekil, deterministik veri çıkarımı sağlanır.

### 4.3. Test Doğrulama ve Karşılaştırma Matrisi
- **Vektörel Test Dosyası:** 	est_assets/Tolun Askı Kancası/10142688.pdf (5.092 karakter vektörel metin).
- **Taranmış/Raster Test Dosyası:** 	est_assets/KPT-2160 Kör Tapa/2160 gspdgm-kpt-2160/KOR TAPA_TR.pdf (0 karakter metin katmanı).
- **CID Identity-H Test Dosyası:** 	est_assets/KPT - 3282 Lazer Konnektör Plaka/10139709_rev03_1Y2.pdf (glif dönüşüm matrisi).

---

## 🔗 İlgili Belgeler ve Gezinme
- [[00_AutoMetrol_Master_MOC|AutoMetrol Master MOC Haritası]]
- [[03_2D_PDF_GDT_ve_Datum_Esleme_Motoru|03. 2D PDF GD&T ve Datum Eşleme Motoru]]
- [[02_Geometri_Motoru_ve_BRep_Ayristirma|02. Geometri Motoru ve B-Rep Ayrıştırma]]
- [[09_Yazilim_Mimarisi_ve_Teknoloji_Yigini|09. Yazılım Mimarisi ve Teknoloji Yığını]]
- [[Kodlama Planlamasi/00_Derleyici_Mimarisi_Master_Plani|00. Derleyici Mimarisi Master Planı]]