# ⚙️ 08. Kritik Alt Sistemler ve Teknik Çözüm Mimarisi

> **"Nuper Ortho kod tabanını inşa ederken sahada mikron seviyesinde doğruluğu, çarpışmasız çalışmayı ve yüksek performansı garanti eden 6 temel alt sistem ve bunların düşük seviyeli (low-level) teknik çözüm mimarisi."**

---

## 📌 1. B-Rep'ten Örnekleme Noktalarına Yüzey Parametrizasyonu ($u, v$ Mapping)

OpenCASCADE ile bir yüzeyi (`TopoDS_Face`) yakaladığınızda elinizde basit analitik bir düzlem değil, parametrik bir yüzey fonksiyonu $S(u, v)$ bulunur.

### 🔴 Kritik Sorun:
Temas noktaları rastgele $(X, Y, Z)$ olarak seçilemez. Üretilen her nokta yüzeyin gerçek katı geometrisi üzerinde olmak, delik/oyuk boşluklarına düşmemek ve parçanın kenar sınırlarından (trimming boundaries) güvenli mesafede içeride kalmak zorundadır.

### 🟢 Teknik Çözüm ve Algoritma:
1. **Parametrik Aralık Taraması:**
   Yüzeyin UV uzayı belirlenir: $u \in [u_{\min}, u_{\max}], \quad v \in [v_{\min}, v_{\max}]$.
2. **Kırpma Sınırı ve Boşluk Doğrulaması (`BRepClass_FaceClassifier`):**
   UV ızgarasından seçilen adayın katı gövde içinde olup olmadığı test edilir:
   ```cpp
   // C++ FFI Katmanı
   BRepClass_FaceClassifier classifier;
   classifier.Perform(face, gp_Pnt2d(u, v), Precision::PConfusion());
   if (classifier.State() != TopAbs_IN) {
       // Nokta deliğe veya yüzey dışına denk geliyor -> Ele
   }
   ```
3. **Diferansiyel Yüzey Normali Hesabı:**
   Geçerli $(u, v)$ noktasında birinci kısmi türevlerin vektörel çarpımı ile birim dış normal vektörü $\vec{N}(u, v)$ hesaplanır:
   $$\vec{N}(u, v) = \frac{\frac{\partial S}{\partial u} \times \frac{\partial S}{\partial v}}{\left\| \frac{\partial S}{\partial u} \times \frac{\partial S}{\partial v} \right\|}$$
4. **Çapak Emniyet Payı Ofseti ($1.5\text{ mm}$):**
   İmalat kaynaklı çapakların (burrs) prob bilyesini saptırmasını önlemek için kenar eğrilerinden (wire/edges) içeriye doğru $1.5\text{ mm}$ UV ofseti uygulanır.

---

## 🦾 2. Prob Geometrisi ve İleri Kinematik Ağaç (Forward Kinematics Tree)

Prob tek bir bilyeden ibaret değildir; rijit bir eklem zinciridir:
$$\text{PH10 Kafa Montajı} \longrightarrow \text{TP20 Modülü} \longrightarrow \text{Uzatma Çubuğu } (L_{ext}) \longrightarrow \text{Prob Şaftı } (L_{stem}, \varnothing_{stem}) \longrightarrow \text{Yakut Bilye } (\varnothing_{ball})$$

### 🔴 Kritik Sorun:
Prob kafası ($A, B$) açılarında döndüğünde prob ucunun temas ettiği nokta ile CMM kafa merkezinin (PH10 pivot point) uzaydaki konumu farklılaşır. Sadece bilyeyi planlamak kafanın parçaya çarpmasına neden olur.

### 🟢 Kinematik Dönüşüm Matrisi:
Her $A$ ve $B$ rotasyonunda prob bilyesinin merkez koordinatı ($\vec{P}_{tip}$), kafanın montaj merkezine ($P_{pivot}$) göre homojen dönüşüm matrisiyle hesaplanır:

$$\begin{bmatrix} X_{tip} \\ Y_{tip} \\ Z_{tip} \end{bmatrix} = \mathbf{R}_z(B) \cdot \mathbf{R}_y(A) \cdot \begin{bmatrix} 0 \\ 0 \\ -(L_{head} + L_{mod} + L_{ext} + L_{stem}) \end{bmatrix}$$

```rust
// ortho-kinematics/src/probe_tree.rs
pub struct ProbeKinematics {
    pub l_head: f64,    // PH10 montaj flanşı - mafsal mesafesi
    pub l_module: f64,  // TP20 gövde boyu
    pub l_ext: f64,     // PEL uzatma boyu
    pub l_stem: f64,    // Stylus şaft boyu
    pub d_ball: f64,    // Yakut bilye çapı
}

impl ProbeKinematics {
    pub fn compute_tip_offset(&self, a_deg: f64, b_deg: f64) -> glam::DVec3 {
        let total_length = self.l_head + self.l_module + self.l_ext + self.l_stem;
        let a_rad = a_deg.to_radians();
        let b_rad = b_deg.to_radians();
        
        let ry = glam::DMat3::from_rotation_y(a_rad);
        let rz = glam::DMat3::from_rotation_z(b_rad);
        let base_vector = glam::DVec3::new(0.0, 0.0, -total_length);
        
        rz * (ry * base_vector)
    }
}
```

---

## 🚏 3. Geometrik Yol Optimizasyonu (Traveling Salesperson Problem - TSP)

Bir parçada 20 delik ve 15 düzlem varsa, teftiş sırası rastgele belirlenemez. Aksi takdirde kafa sürekli gereksiz A/B açıları çevirir ve 5 dakikalık çevrim süresi 25 dakikaya çıkar.

### 🔴 Yol Maliyet Fonksiyonu (Cost Function):
İki teftiş hedefi ($Step_i \to Step_j$) arasındaki maliyet ağırlıklı olarak hesaplanır:
$$\text{Cost}(i, j) = w_1 \cdot \|\vec{P}_j - \vec{P}_i\| + w_2 \cdot (|\Delta A| + |\Delta B|) + w_3 \cdot C_{rack}$$

* $w_1 = 1.0$: Doğrusal mesafe ağırlığı.
* $w_2 = 8.5$: Kafa döndürme maliyeti (Kafa motorunu döndürmek doğrusal intikalden çok daha yavaştır).
* $w_3 = 50.0$: Magazinden prob değiştirme maliyeti ($C_{rack}$).

### 🟢 Optimizasyon Algoritması (Nearest Neighbor + 2-Opt):
1. **Açısal Kümeleme (Clustering):** Ölçülecek unsurlar önce ihtiyaç duydukları $A/B$ açılarına göre gruplanır; aynı açıyla ölçülebilecek tüm yüzeyler tek seferde tamamlanır.
2. **2-Opt İyileştirmesi:** Her küme içinde çapraz geçen yollar (crossing edges) 2-opt yerel arama algoritmasıyla çözülerek global en kısa 3D yol bulunur.

---

## 📐 4. Koordinat Sistemi Hiyerarşisi (Alignment Stack)

CMM kontrol ünitesinde birden fazla koordinat sistemi iç içedir:

```
[ MCS: Machine Coordinate System ] ──► CMM'in Granit Tabla Sıfırı (X0, Y0, Z0)
               │
               ▼
[ FCS: Fixture Coordinate System ] ──► Pabuç veya Fikstür Konum Sıfırı
               │
               ▼
[ PCS: Part Coordinate System ]    ──► Parçanın CAD Modelindeki Datum A-B-C Sıfırı
```

### 🔴 DMIS Kodlama Kuralı:
* **İlk Hareketler (Kaba Sıfırlama):** Yazılımın bastığı ilk teftiş hareketleri **MCS** koordinatlarındadır. Operatör parçayı rastgele bağladığı için `MODE/MAN` komutuyla parçanın tepesinden kaba bir sıfır alınır.
* **Eksen Transferi:** Kaba sıfır alındıktan sonra yazılım `DATDEF/F(...)` ve `RECALL/ALIGN` komutlarını basarak eksen takımını anında parçanın CAD koordinatlarına (**PCS**) kilitler.
* **Hassas Ölçüm:** Bu adımdan sonraki tüm noktalar parçanın orijinal STEP dosyasındaki nominal koordinatlarıyla ($X,Y,Z,I,J,K$) birebir eşleşir.

---

## ⚡ 5. Tarayıcı Arayüzü & Rust IPC Veri Serileştirme (Tauri Zero-Copy Layer)

3D STEP modeli ve binlerce prob hareket noktası kullanıcı arayüzüne (UI) aktarılırken standart `JSON.stringify` kullanımı büyük modellerde tarayıcıyı kilitler.

### 🟢 Teknik Çözüm:
1. **İkili Dizi Paketleme (Binary Buffer):** OpenCASCADE tarafından çıkarılan üçgen mesh ve hareket koordinatları Rust tarafında `Float32Array` ikili bellek bloklarına sıkıştırılır.
2. **Zero-Copy IPC:** Tauri v2'nin `tauri::ipc::Response` binary stream özelliği kullanılarak veri kopyalanmadan doğrudan JavaScript V8 belleğine enjekte edilir.
3. **Three.js BufferGeometry:** Ön yüzde bu tampon doğrudan GPU'ya gönderilir; $50\text{ MB}$ büyüklüğündeki karmaşık havacılık motor blokları dahi arayüzde **60 FPS** akıcılıkla simüle edilir.

---

## 🛡️ 6. Hata Yönetimi ve Geri Dönüş Güvencesi (Failsafe & Fallbacks)

Her parça tek seferde %100 otonom ölçülemeyebilir. Yazılım tıkandığında programı çökertmemek için iki katı geri çekilme protokolü işletilir:

### 1. Ulaşılamayan Unsur Bayrağı (Unreachable Feature Flag):
* Eğer bir deliğin derinliği prob şaft boyunu aşıyorsa veya 720 açıdan hiçbiri deliğe dik bakamıyorsa:
  * Motor bu deliği atlar ve DMIS koduna **dahil etmez** (Probun kırılmasını engeller).
  * 3D arayüzde bu geometri **parlak sarı/kırmızı** renkle işaretlenir.
  * Operatör raporuna *"Manuel Doğrulama Gerektirir: Prob boyu yetersiz veya açı ulaşılamadı"* uyarısı düşülür.

### 2. İptal Durumunda Otomatik Geri Çekilme (Auto-Retract on Abort):
* Operatör tezgaha acil durdurma verdiğinde veya bir limit aşımı tetiklendiğinde probun parçaya sürtünmesini önlemek için, her hareket bloğunun arasına **en son okunan yüzey normalinin tersine doğru $10\text{ mm}$ doğrusal geri çekilme komutu** gömülür.
