# 🚧 10. Kritik Teknik Darboğazlar ve Çözüm Mimarisi

> **"Mimariden çalışan endüstriyel bir yazılıma geçerken karşılaşılan 5 temel teknik darboğaz, bellek/algoritma riskleri ve bunların Rust/C++ seviyesindeki kesin çözüm mimarileri."**

---

## 📌 1. 2D PDF Tolerans Eşleme Belirsizliği (2D-to-3D Matching)

### 🔴 Problem:
2D teknik resimden Vision/OCR ile okunan tolerans çerçevesi (Feature Control Frame - FCF) ile 3D STEP modelindeki yüzeyler (`TopoDS_Face`) arasında doğrudan bir kimlik bağı (ID bağı) bulunmaz. Çizimdeki tolerans oku bir kenarı işaret eder; ancak o kenar STEP dosyasında bir paha, bir delik silindirine veya bir faturaya ait olabilir. Yanlış eşleme probu alakasız bir geometriye gönderir.

### 🟢 Çözüm Mimarisi: İki Aşamalı Doğrulama (Bipartite Graph Matching + Kullanıcı Onayı)

```
[ 2D PDF Tolerans Düğümleri ]                [ 3D STEP B-Rep Silindirleri ]
      (∅20 H7, L=15, 4x)                           (ID: 101, 102, 103, 104)
              │                                                │
              └───────────────► [ Bipartite Graph ] ◄──────────┘
                                (petgraph Ağırlıklı Eşleme)
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
                Skor ≥ 0.95                   0.70 ≤ Skor < 0.95
             [ Otomatik Onay ]              [ Sarı Uyarı & Teyit ]
                                                       │
                                                       ▼
                                            [ 3D Ballooning Canvas ]
                                         (Sürükle-Bırak Manuel Eşleme)
```

1. **Ağırlıklı Çift Parçalı Çizge (Bipartite Graph - `petgraph`):**
   PDF'ten çıkarılan özellikler (çap, derinlik, delik deseni dizilimi) ile STEP analitik yüzeyleri arasında çok kriterli benzerlik matrisi kurulur.
2. **Güven Skoru (Confidence Score):**
   * **Skor $\ge 0.95$:** Otomatik eşleme onaylanır, sonraki aşamaya aktarılır.
   * **$0.70 \le \text{Skor} < 0.95$:** 3D model üzerinde ilgili delikler sarı renkle yanıp söner ve operatörün tek tıkla onayı istenir.
   * **Skor $< 0.70$:** Eşleşmemiş kabul edilir, kırmızı bayrak açılır.
3. **Etkileşimli Balonlama (Ballooning UI):**
   2D PDF arayüzde görüntülenir, tolerans kutularına otomatik balon numarası atanır. Operatör yanlış eşleşen balonu 3D yüzeye sürükleyip bırakarak 1 saniyede düzeltebilir.

---

## 🧭 2. Dar Alan ve Karmaşık Geometride Çarpışmasız Hareket Planlaması

### 🔴 Problem:
Basit prizmatik parçalarda doğrusal yaklaşma ve $+50\text{ mm}$ emniyet düzlemi yeterlidir. Ancak derin cepli döküm motor bloklarında veya iç kanallarda, prob bir delikten çıkıp diğerine giderken iç duvarlardan dolanmak zorundadır; aksi takdirde doğrusal intikal sırasında prob gövdesi parçaya çarpar.

### 🟢 Çözüm Mimarisi: 5-DoF RRT* & OBB Ağacı (`parry3d`)

1. **Konfigürasyon Uzayı (C-Space):**
   Probun $(X, Y, Z)$ koordinatları ve kafa açısı $(A, B)$ 5 boyutlu bir serbestlik uzayı ($\mathbb{R}^3 \times S^2$) olarak modellenir.
2. **OBB Ağacı (Oriented Bounding Box Hierarchy):**
   Parça mesh'i ve pabuç hacimleri `parry3d` ile hiyerarşik kutu ağaçlarına (BVH) bölünür. Ray-tracing ve şaft kesişim testleri SIMD paralelleştirmesiyle mikrosaniyeler içinde çözülür.
3. **RRT* (Rapidly-exploring Random Tree Star) Algoritması:**
   İki ölçüm noktası arasında doğrudan görüş hattı (Line of Sight) kapalıysa, RRT* algoritması boşluklar arasında dallanarak en kısa ve çarpışmasız serbest yolu türetir.

---

## 🌉 3. OpenCASCADE C++ Bellek ve FFI Kararsızlığı

### 🔴 Problem:
OpenCASCADE (OCCT), `Handle(Standard_Transient)` tabanlı kendi referans sayımını işleten devasa bir C++ kütüphanesidir. Rust ile C++ arasında köprü kurulurken bellek sızıntısı (memory leak) veya geçersiz işaretçi (segmentation fault) riski çok yüksektir.

### 🟢 Çözüm Mimarisi: Sınır İzolasyonu (Boundary Isolation via `cxx`)

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│        C++ (OCCT Motoru)        │           │           Rust Çekirdeği        │
│ ├── TopoDS_Shape                │   cxx     │ ├── BRepModel                   │
│ ├── Geom_Surface                │ ────────► │ ├── RawCadFace (POD Struct)     │
│ └── BRepAdaptor_Surface         │   Köprüsü │ └── glam::DVec3                 │
│ (Tüm C++ nesneleri burada silinir)          │ (Sıfır C++ referansı, saf Rust) │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

1. **Sıfır Ham İşaretçi Sızıntısı:**
   Ham OpenCASCADE nesneleri (`TopoDS_Shape`, `Geom_Surface`) asla Rust tarafına geçirilmez. Tüm hesaplama C++ wrapper içinde tamamlanır.
2. **Düz Veri Yapıları (Plain Old Data - POD):**
   Rust'a sadece saf veri taşıyan düz yapılar (`[f64; 3]` dizileri, `f64` skalerler ve `enum`'lar) aktarılır.
3. **Derleme Zamanı Güvenliği:**
   `cxx` kütüphanesi sayesinde tür uyuşmazlıkları ve bellek sınırları C++ ve Rust derleyicileri tarafından derleme aşamasında doğrulanır.

---

## 🎯 4. Tekrarlı Ölçümlerde Nokta Dağıtım Hatası (Aliasing & Sampling Bias)

### 🔴 Problem:
Dairesellik veya düzlemsellik ölçülürken noktalar tam periyodik aralıklarla (örneğin $90^\circ$ adımlarla 4 nokta) alınırsa; işleme tezgahının frezeleme dalgalanmaları (chatter marks veya 3-lob yapısı) tespit edilemez. Delik gerçekte oval veya üçgen formunda olduğu halde matematiksel olarak kusursuz yuvarlak çıkabilir.

### 🟢 Çözüm Mimarisi: Hammersley / Halton Yarı-Rastgele Örnekleme (Low-Discrepancy)

1. **Düşük Tutarsızlıklı Dizi (Low-Discrepancy Sequence):**
   Saf eşit aralıklı ızgara (grid) yerine **Hammersley** 2D yarı-rastgele dağılım fonksiyonu kullanılır:
   $$x_i = \frac{i}{N}, \quad y_i = \Phi_2(i) = \sum_{j=0}^{k-1} b_j \cdot 2^{-(j+1)}$$
2. **Harmonik Rezonans Koruması:**
   Noktalar yüzeye hem homojen olarak yayılır hem de imalat takımının periyodik harmonik izlerine denk gelmeyecek şekilde açısal kaymalarla yerleştirilir.

---

## 📄 5. CMM Sürücüleri ve Diyalekt Ayrışması (Dialect Variations)

### 🔴 Problem:
PC-DMIS'in v2018 sürümü ile v2024 sürümü bile bazı DMIS sözdizimlerinde (`OUTPUT` veya `FEAT/CYLNDR` sözdizimi) ufak farklılıklar gösterir. Katı olarak Rust kodunun içine gömülmüş (hardcoded) bir Post-Processor geriye dönük uyumsuzluk yaratır ve sahada tezgahın durmasına neden olur.

### 🟢 Çözüm Mimarisi: Bildirimsel Ayrık Şablonlama (Declarative Post-Processing via `tera`)

```
autometrol/
└── posts/
    ├── pcdmis_2024.tera       # Modern PC-DMIS komut seti
    ├── pcdmis_legacy.tera     # Eski Hexagon tezgahları için güvenli mod
    ├── dmis_53_ansi.tera      # Saf ANSI DMIS 5.3
    └── calypso_v6.tera        # Zeiss Calypso ASCII arayüzü
```

1. **Koddan Bağımsız Şablonlar:**
   Post-processor mantığı Rust kodunun içine gömülmez; dışarıda metin tabanlı Jinja/Tera şablonları olarak tutulur.
2. **Sıfır Derleme ile Saha Müdahalesi:**
   Bir atölyede sözdizimi uyuşmazlığı görüldüğünde ana programı yeniden derlemeye gerek kalmaz. Bir servis mühendisi şablon dosyasındaki ilgili satırı metin düzenleyiciyle 10 saniyede güncelleyebilir.

---

## 📊 6. Teknik Çözüm Matrisi Özeti

| Darboğaz | Risk Seviyesi | Çözüm Mimarisi | Kullanılan Araç / Kütüphane |
|---|---|---|---|
| **2D/3D Eşleme Belirsizliği** | Yüksek | Bipartite Graph + Güven Skoru + 3D Balonlama | `petgraph` + UI Canvas |
| **Dar Alan Yol Planlama** | Yüksek | 5-DoF RRT* + OBB Ağacı Çarpışma Testi | `parry3d` / Rust SIMD |
| **CAD FFI Bellek Güvenliği** | Kritik | Bellek İzolasyonu + CXX Güvenli Köprüsü | `cxx` crate + OCCT C++ |
| **Harmonik Örnekleme Hatası** | Orta | Hammersley / Halton Yarı-Rastgele Dağıtım | Saf Rust Matematik Modülü |
| **Yazılım Diyalekt Farkları** | Orta | Ayrık Bildirimsel Şablonlama (Declarative) | `tera` Şablon Motoru |
