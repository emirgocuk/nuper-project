# 📜 09. Uluslararası Metroloji Standartları, Belirsizlik Bütçesi ve Karar Kuralları

> **"Nuper Ortho'yu basit bir CAM script'inden ayıran ve havacılık/savunma (AS9100, MIL-STD) düzeyinde resmi geçerlilik kazandıran 5 uluslararası metroloji standardı, matematiksel belirsizlik bütçesi (GUM) ve kabul karar mimarisi."**

---

## 📌 1. Ölçüm Belirsizliği Bütçesi: GUM ve ISO 15530-3 (Virtual CMM)

Bir CMM asla mutlak kesinlikte ölçüm yapamaz; her ölçümün fiziksel bir **genişletilmiş belirsizliği ($U$)** vardır. AS9100 ve havacılık kalite denetçileri artık yalnızca ölçülen boyutu değil, bu ölçümün güven aralığını ($U$) talep etmektedir.

### A. GUM (Guide to the Expression of Uncertainty in Measurement)
Bileşik standart belirsizlik ($u_c$), ölçüm zincirindeki bağımsız hata kaynaklarının kareler toplamının kareköküyle modellenir:

$$u_c = \sqrt{u_{\text{geo}}^2 + u_{\text{probe}}^2 + u_{\text{temp}}^2 + u_{\text{rep}}^2}$$

* $u_{\text{geo}}$: CMM eksenlerinin lineer ve açısal geometrik sapması (ISO 10360-2 $MPE_E$).
* $u_{\text{probe}}$: Prob uzatması ($L_{ext}$), kafa açısı ve temas yönüne bağlı esneme sapması.
* $u_{\text{temp}}$: Parça ve cetvel arasındaki sıcaklık farkı genleşme belirsizliği ($\Delta T \cdot \alpha \cdot L$).
* $u_{\text{rep}}$: Tekrarlanabilirlik varyansı.

Genişletilmiş belirsizlik ($k=2$, $\%95$ güven aralığı):
$$U = k \cdot u_c = 2 \cdot u_c$$

### B. ISO 15530-3 (Sanal CMM / Monte Carlo Simülasyonu)
Yazılım, üretilen prob yolu için arka planda sanal bir simülasyon çalıştırır:
> *"Bu prob konfigürasyonu ($50\text{ mm}$ uzatma + $A45^\circ B90^\circ$ açısı) ile bu delik ölçüldüğünde beklenen belirsizlik $U = \pm 0.0028\text{ mm}$'dir."*

### C. TUR (Test Uncertainty Ratio) Doğrulama Kuralı (4:1 Prensibi):
Tolerans aralığı ($T = USL - LSL$) ile genişletilmiş belirsizlik ($2U$) arasındaki oran test edilir:

$$\text{TUR} = \frac{T}{2U} \ge 4.0$$

* **Sistem Müdahalesi:** Eğer $T = 0.005\text{ mm}$ ve hesaplanan belirsizlik $U = 0.003\text{ mm}$ ise ($\text{TUR} = 0.83 < 4$):
  * Sistem kodu üretmeyi durdurur ve operatörü uyarır:
  * ⚠️ *"Metrolojik Olarak Yetersiz Konfigürasyon: Bu toleransı denetlemek için prob uzatması çok uzun veya kafa açısı çok yatık (TUR < 4:1). Daha rijit prob şaftı seçin."*

---

## 🧹 2. Yüzey Filtreleme ve Uç Değer Ayıklama: ISO 16610 Serisi

Atölye ortamında parçanın yüzeyinde talaş kırıntısı, toz zerreciği, yağ filmi veya mikron düzeyinde çapaklar bulunabilir.

### A. Referans Standartlar:
* **ISO 16610-21:** Doğrusal profil filtreleri (Linear Profile Filters - Gaussian).
* **ISO 16610-31:** Sağlam Gauss filtrelemesi (Robust Gaussian Filtration).

### B. Algoritmik Süzgeç Mantığı:
Ham temas noktaları doğrudan silindir veya düzlem formülüne sokulmaz:
1. **Sapma Taraması:** Temas noktalarının geçici nominal geometriye olan radyal/dik uzaklıkları ($\delta_i$) çıkarılır.
2. **Chauvenet / 3-Sigma Kriteri:**
   $$\text{Eşik} = 3 \cdot \sigma_{\delta}$$
   Eğer bir noktada ani bir sıçrama varsa ($\delta_i > 3\sigma$, örneğin $50\ \mu\text{m}$ çapak çapak sıçraması), bu nokta **Uç Değer (Outlier)** olarak etiketlenir ve fitting hesabından düşürülür.
3. **Fayda:** Tek bir mikronluk toz tanesi yüzünden sağlam bir savunma gövdesinin haksız yere hurdaya (scrap) çıkması engellenir.

---

## 🔗 3. Geometrik Ürün Tanımlama (GPS) ve Datum Kinematiği: ISO 1101 & ISO 5459

Tolerans matematiğinde en kritik nokta, parçanın uzaydaki 6 serbestlik derecesinin (DoF - Degrees of Freedom) eksiksiz kilitlenmesidir.

### A. Datum Önceliği (Precedence: $A \mid B \mid C$):
* **Datum A (Birincil / Primary):** Düzlem yüzey $\to$ **3 Serbestlik Derecesi** kilitler ($1$ öteleme $T_z$, $2$ dönme $R_x, R_y$). Minimum 3 temas noktası.
* **Datum B (İkincil / Secondary):** Çizgi / Delik Ekseni $\to$ **2 Serbestlik Derecesi** kilitler ($1$ öteleme $T_y$, $1$ dönme $R_z$). Minimum 2 temas noktası.
* **Datum C (Üçüncül / Tertiary):** Durdurucu Yüzey / Pim $\to$ **Son 1 Serbestlik Derecesini** kilitler ($1$ öteleme $T_x$). Minimum 1 temas noktası.

### B. Değişmezlik Sınıfları ve 6 DoF Kilitlenme Matrisi:
Yazılım, kullanıcının veya AI'ın seçtiği yüzeylerin serbestlik derecesini Jacobian rank analiziyle doğrular:

$$\mathbf{J}_{\text{dof}} = \begin{bmatrix} 
\vec{n}_{1x} & \vec{n}_{1y} & \vec{n}_{1z} & (\vec{r}_1 \times \vec{n}_1)_x & (\vec{r}_1 \times \vec{n}_1)_y & (\vec{r}_1 \times \vec{n}_1)_z \\
\vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\
\vec{n}_{kx} & \vec{n}_{ky} & \vec{n}_{kz} & (\vec{r}_k \times \vec{n}_k)_x & (\vec{r}_k \times \vec{n}_k)_y & (\vec{r}_k \times \vec{n}_k)_z
\end{bmatrix}$$

$$\text{Rank}(\mathbf{J}_{\text{dof}}) = 6$$

Eğer rank $< 6$ ise sistem hata bayrağı kaldırır: *"Serbestlik derecesi eksik! Koordinat sistemi $X$ ekseninde serbestçe kayabilir; Datum C tanımlanmalıdır."*

---

## 📦 4. B-Rep ve STEP Standartları: ISO 10303 (AP203, AP214 vs. AP242)

Endüstriyel CAD dünyasında STEP dosyasının uygulama protokolleri (Application Protocol - AP) farklı seviyelerde veri taşır:

| STEP Standardı | İçerik Kapsamı | Nuper Ortho Entegrasyonu |
|---|---|---|
| **ISO 10303-203 / 214 (AP203 / AP214)** | Katı B-Rep geometrisi, yüzeyler, kenarlar, montaj ağacı, renkler. | **Varsayılan Girdi.** GD&T ve tolerans içermez; bu yüzden 2D PDF teknik resim ve yerel Vision-LLM motorumuz devreye girerek toleransları geometriye eşler. |
| **ISO 10303-242 (STEP AP242)** | Katı geometri + **Gömülü Semantik 3D PMI** (Product and Manufacturing Information), Datum etiketleri, geometrik toleranslar. | **Doğrudan Ayrıştırma (Bypass).** Müşteri doğrudan AP242 yüklerse OCR/Vision katmanı devre dışı bırakılır; toleranslar doğrudan STEP içindeki XML/B-Rep düğümlerinden anında okunur. |

---

## 🎯 5. Karar Verme Kuralları ve Güvenlik Payı: ISO 14253-1 (Guard-Banding)

Bir parçanın ölçülen boyutu tolerans sınırına çok yakın çıktığında uygulanacak yasal karar kuralıdır.

### A. Tolerans İkilemi:
* Parça toleransı: $20.000 \pm 0.050\text{ mm}$ (Üst Limit $USL = 20.050$).
* CMM Ölçümü: $20.048\text{ mm}$.
* CMM Ölçüm Belirsizliği: $U = \pm 0.003\text{ mm}$.
* **Soru:** Parça gerçekten sağlam mı, yoksa belirsizlik nedeniyle aslında $20.051\text{ mm}$ olup limit dışı mıdır?

### B. ISO 14253-1 Guard-Banding Çözümü:
Kabul bölgesi, belirsizlik ($U$) kadar içeriye daraltılır:

```
[ LSL ] ──►|◄── U ──►|=============================|◄── U ──►|◄── [ USL ]
           Güvenlik              KABUL BÖLGESİ              Güvenlik
            Bandı            (Kesin Uygun / PASS)             Bandı
```

$$\text{Kabul Bölgesi (Acceptance Zone)} = [LSL + U, \quad USL - U]$$

* **Karar Matrisi:**
  * **Ölçüm $\in [LSL + U, USL - U]$:** **PASS (Kesin Uygun).**
  * **Ölçüm $\in [USL - U, USL + U]$ veya $[LSL - U, LSL + U]$:** **SUSPECT (Şüpheli / Doğrulama Gerekir).** Sistem parçayı doğrudan onaylamaz; operatöre *"Ölçüm belirsizlik sınırında; daha hassas prob veya laboratuvar doğrulaması gerekir"* bayrağı açar.
  * **Ölçüm $> USL + U$ veya $< LSL - U$:** **FAIL (Kesin Hatalı).**

---

## 📊 6. Literatür ve Standart Karşılıkları Tablosu

| Akademik / Endüstriyel Konu | Referans Standart | Koddaki Karşılığı |
|---|---|---|
| **Belirsizlik & Simülasyon** | ISO 15530-3 / GUM | `ortho-kinematics`: TUR doğrulama denetleyicisi |
| **Uç Değer & Filtreleme** | ISO 16610-21 / 31 | `ortho-kinematics`: Robust Gaussian filtreleme fonksiyonu |
| **Datum Kinematiği** | ISO 5459 / ASME Y14.5 | `ortho-ast`: 6 DoF rank kilitlenme matrisi |
| **CAD Veri Protokolü** | ISO 10303-242 (AP242) | `ortho-brep`: Semantik PMI ayrıştırıcı ve AP214 fallback |
| **Kalite Karar Eşiği** | ISO 14253-1 | `ortho-emitter`: Guard-banding uygunluk değerlendirmesi |
