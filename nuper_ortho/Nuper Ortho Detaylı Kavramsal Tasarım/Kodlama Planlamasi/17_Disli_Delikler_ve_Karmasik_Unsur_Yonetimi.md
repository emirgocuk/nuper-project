# 🔩 17. Dişli Delikler, Kademeli Cepler ve Karmaşık Unsur Yönetimi

> **"CAD modelindeki matkap/nominal silindiri ile 2D teknik resimdeki vida dişi (M-Thread) toleranslarını ayrıştıran; yakut bilye kırma ve sahte sapma tuzağını önleyen baypas kuralları, havşa/fatura sınıflandırması ve mastar kurulum föyü mimarisi."**

---

## 📌 1. Saha Gerçeği: Dişli Delik (Tapped Hole) Tuzağı

Talaşlı imalatta üretilen gövdelerin ve flanşların en az %40'ı cıvata bağlantısı için açılmış dişli deliklerden (Metrik, Whitworth, NPT, Helicoil) oluşur.

### 🔴 Fiziksel Çarpışma ve Ölçüm Çöküşü:
1. **CAD Model Çelişkisi:**
   - 3D STEP dosyalarında vida dişleri sarmal helis olarak taranmaz; bu dosya boyutunu devasa yapardı.
   - Parça tasarımcısı deliği ya **kılavuz matkap çapında** (örneğin M8x1.25 için $\varnothing 6.8\text{ mm}$ silindir) ya da **anma çapında** ($\varnothing 8.0\text{ mm}$ düz silindir) modeller.
2. **Yakut Bilyenin Mekanik Sıkışması:**
   - CMM probunun ucundaki $\varnothing 2\text{ mm}$ veya $\varnothing 4\text{ mm}$ yakut bilye, dişin tepe ve dip helislerine çarptığında:
     - Standart silindir fitting algoritması (Gauss) deliğin çapını ve eksenini tamamen rastgele/çarpık hesaplar.
     - Daha kötüsü; prob şaftı veya bilye vida helisi arasına sıkışarak yaklaşma vektöründe kasıntıya ve prob gövdesinin kırılmasına yol açar.

```
       [ Hatalı Dokunmatik Yaklaşım ]           [ Doğru Metrolojik Yaklaşım ]
           Diş Tepesine Çarpma                       Mastarla Manuel Kontrol
        ┌─┐                             
        │ │  (Yakut Bilye)                        ┌───────────────────────────────┐
        └┬┘                                       │ SETUP SHEET TALİMATI:         │
       ╱ ╲                                        │ "4x M8-6H Delikleri CMM ile   │
    ┌─┘   └─┐  <-- Diş Diplerinde                 │ ölçülmez; diş mastarı ile     │
    │ ╱╲ ╱╲ │      Sıkışma ve Sahte               │ (Go/No-Go) doğrulanmalıdır." │
    │ ╲╱ ╲╱ │      Eksen Kayması!                 └───────────────────────────────┘
    └───────┘
```

---

## 🧮 2. Dişli Delik Tespit ve Sınıflandırma Motoru (`ThreadClassifier`)

Nuper Ortho, B-Rep analitik silindiri ile 2D teknik resim metnini eşleştirirken katı bir **Dişli Delik Filtresi** işletir:

### A. Standart Diş Veritabanı (Rust LUT):
Sistem çekirdeğinde ISO 261 / ISO 965 (Metrik), ASME B1.1 (UN/UNF) ve DIN 3852 (Boru dişi) standart hatve ve matkap tabloları yer alır:

```rust
// ortho-ast/src/threads.rs
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ThreadStandard {
    MetricCoarse { nominal_d: f64, pitch: f64 }, // M8x1.25 (Matkap: 6.8mm)
    MetricFine { nominal_d: f64, pitch: f64 },   // M10x1.0 (Matkap: 9.0mm)
    UnifiedInch { size: String, tpi: u32 },       // 1/4-20 UNC
    PipeGas { size: String },                     // G 1/4"
}

pub struct ThreadSpecification {
    pub standard: ThreadStandard,
    pub class_of_fit: String,                     // 6H, 6g, 2B
    pub tap_drill_diameter: f64,                  // mm
    pub thread_depth: f64,                        // mm
    pub has_countersink: bool,                    // Giriş pahı var mı?
}
```

### B. Otomatik Eşleşme Mantığı:
1. 2D PDF metninde *"4x M8x1.25"* veya *"M8 - 6H ↓18"* ifadesi yakalanır.
2. STEP dosyasında çapı $6.75\text{ mm} \le D \le 6.90\text{ mm}$ (matkap çapı) veya $7.90\text{ mm} \le D \le 8.10\text{ mm}$ (anma çapı) olan silindirler taranır.
3. Bu silindirler tespit edildiği anda `is_threaded = true` bayrağı atanır.

---

## 🛑 3. Dişli Delikler İçin 3 Seviyeli Ölçüm Stratejisi

Yazılım, dişli delikler için kullanıcıya ve tezgaha 3 güvenli opsiyon sunar:

| Strateji Modu | Çalışma Mantığı | Saha Uygulaması |
|---|---|---|
| **Mod A: Güvenli Baypas (Varsayılan)** | Prob deliğin içine **asla sokulmaz**. Yalnızca Setup Sheet'e mastar talimatı düşülür. | Genel cıvata delikleri için %100 güvenli; prob kırma riski sıfır. |
| **Mod B: Giriş Havşasından Konum** | Dişin ağzındaki $90^\circ$ merkezleme havşasına (Chamfer) 3 nokta dokunarak delik merkezi bulunur. | Cıvatanın kaba konum toleransı ($\bigoplus \varnothing 0.2$) CMM ile teyit edilir, dişe girilmez. |
| **Mod C: Diş Adaptör Pimi (Thread Locator Pin)** | Operatör deliğe kalibre edilmiş dişli mastar pimi vidalar; prob bu pimin dış silindirini ölçer. | Havacılık ve savunmadaki kritik pozisyon toleranslı ($\bigoplus \varnothing 0.05$) mastar ölçümü. |

---

## 📐 4. Kademeli Delikler (Counterbore, Countersink, Spotface)

Gerçek parçalarda cıvata başı yuvaları kademelidir (Havşa + Delik veya Fatura + Delik).

```
         ┌───────────────┐           ┌───────────────┐
         │               │  Giriş    │               │
         │  Fatura / Cep │  Faturası │  Havşa Konisi │ (Countersink)
         │  (Counterbore)│  (90°)    │  (Cone Face)  │
         ├───┐       ┌───┤           └───┐       ┌───┘
         │   │       │   │               │   │       │   │
         │   │ Delik │   │               │   │ Delik │   │
```

### Hiyerarşik Eşmerkezlilik Ağacı (Sub-Feature Tree):
Nuper Ortho, açık delikleri tekil silindirler olarak değil, topolojik bir bileşik grup olarak modeller:

```rust
// ortho-ast/src/features.rs
pub struct CompoundHoleFeature {
    pub parent_group_id: u32,
    pub top_face_centroid: [f64; 3],
    pub axis_vector: [f64; 3],
    pub entry_counterbore: Option<CylindricalPocket>,  // C'Bore fatura
    pub entry_countersink: Option<ConicalChamfer>,     // C'Sink havşa
    pub main_bore: CylindricalHole,                    // Ana gövde
    pub thread_info: Option<ThreadSpecification>,      // Vida dişi bilgisi
}
```

### Ölçüm Rotalama Protokolü:
1. **Fatura (Counterbore):** Prob önce büyük çaptaki faturaya $Z$ seviyesinde dalar, faturayı 4 noktada ölçer.
2. **Merkez Eksen Doğrulaması:** Fatura merkezi ile ana delik merkezinin eşmerkezliliği (Coaxiality) otomatik hesaplanır.
3. **Taban Düzlemi (Step Face):** Cıvata başının oturduğu dip düzleme derinlik ölçümü için 3 nokta temas planlanır.

---

## 📑 5. Kurulum Föyü (Setup Sheet) Mastar Entegrasyonu

Nuper Ortho'nun derlediği Setup Sheet PDF çıktısında operatör için özel bir **"Manuel Mastar Listesi"** tablosu açılır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛠️ CMM ÖNCESİ / SONRASI MANUEL MASTAR DOĞRULAMA LİSTESİ                     │
├──────┬──────────────┬─────────────┬────────────────────┬────────────────────┤
│ No   │ Unsur Adı    │ Diş Tipi    │ Kullanılacak Mastar│ Tolerans / Standart│
├──────┼──────────────┼─────────────┼────────────────────┼────────────────────┤
│ 1    │ Thread_Hole4 │ 4x M8x1.25  │ Geçer/Geçmez Tampon│ 6H (ISO 1502)      │
│ 2    │ Port_Hydr    │ G 1/4" BSPP │ Konik Diş Mastarı  │ ISO 228-1          │
│ 3    │ Pin_Guide    │ Ø6 H7 Delik │ Ø6.000 / Ø6.012 Pim│ DIN 7162           │
└──────┴──────────────┴─────────────┴────────────────────┴────────────────────┘
```

Bu modül sayesinde Nuper Ortho, sahada vidalı deliklere yakut bilye daldırarak prob kıran amatör script'lerden ayrılır; savunma sanayiindeki baş denetçilerin (auditor) tam güvenini kazanır.
