# 🧠 14. Yerel Yapay Zekâ Ajanları ve Deterministik Gardiyan (Sandboxed AI)

> **"Yapay zekâyı yalnızca bir OCR aracı olarak değil; metrolojik akıl yürüten, imalat niyetini sezen, çelişkileri denetleyen ve kök neden bulan bir 'Baş Denetçi' olarak konumlandıran; ancak halüsinasyon riskini sıfırlamak için tam yetkiyi deterministik Rust gardiyanına bırakan Sandboxed AI mimarisi."**

---

## 📌 1. Temel İlke: "Yapay Zekâya Asla Yürütme Yetkisi Verilmez"

Endüstriyel CMM ortamında yapay zekânın halüsinasyon görüp olmayan bir delik uydurması veya probu parçaya çarpacak bir rotaya sokması on binlerce dolarlık prob kafasının kırılmasına ve üretimin durmasına yol açar.

Bu nedenle Nuper Ortho mimarisinde yapay zekâ bir **"otobüs şoförü" değil, yan koltukta haritaya bakan bir "rehberdir"**:
* **Direksiyon, Gaz ve Fren (Deterministik Çekirdek):** Prob koordinatları, dot-product arama, çarpışma testleri, matematiksel fitting ve DMIS çıktısı tamamen matematiksel Rust motorunun elindedir.
* **Akıl Yürütme ve Anlama (Yerel AI):** Standart yorumlama, imalat niyeti tahmini, 2D çizim varyasyonları, doğal dilde arıza teşhisi ve kök neden analizini yürütür.

```
┌─────────────────────────────────────────────────────────────┐
│ 🧠 YEREL AKIL YÜRÜTME (Local AI / SLM & Vision)             │
│ • Qwen2-VL / Moondream2 (GGUF ~2-4 GB): 2D GD&T & Semboller │
│ • Llama-3.1-8B-Instruct (4-bit Q4_K_M): Metrolojik Muhakeme │
└──────────────────────────────┬──────────────────────────────┘
                               │ Sadece Öneri & JSON Şeması
┌──────────────────────────────▼──────────────────────────────┐
│ 🛡️ DETERMINİSTİK GARDİYAN (Rust Guardrail Layer)             │
│ 1. GBNF Dilbilgisi Kısıtı (Grammar-Constrained Decoding)    │
│ 2. B-Rep Geometrik Gerçeklik Denetimi (Ground-Truth Check) │
│ 3. Kinematik & Fiziksel Aralık Doğrulayıcı (Bounds Check)   │
│ 4. Güven Skoru & Operatör Onay Eşiği (Human-in-the-Loop)    │
│ 5. Sanal CMM Kuru Çalıştırma Simülasyonu (Dry-Run Sandbox)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Sertifikalı Veri
┌──────────────────────────────▼──────────────────────────────┐
│ ⚙️ DERLEYİCİ VE YÜRÜTME MOTORU (Rust Core)                  │
│ • Hatasız, Çarpışmasız, Sıfır Halüsinasyonlu DMIS Kodu      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧭 2. Yerel AI'ın 5 Stratejik Operasyonel Rolü

### 1. Alan: 2D Teknik Resim Ayrıştırma & Semantik GD&T Çıkarımı (Vision-LLM)
* **Model:** Qwen2-VL-7B veya Moondream2 (GGUF 4-bit, ~3-5 GB VRAM).
* **Görev:**
  * Çizimdeki Feature Control Frame (FCF) kutularını kırpar, sembolleri (⨁, ⊥, //), sayısal toleransları, malzeme durumu modifikatörlerini (MMC/LMC) ve datum sırasını ($A \mid B \mid C$) ayrıştırır.
  * Lider çizgilerini (leader lines) takip ederek toleransın hangi deliğe veya kenara ait olduğunu bulur.
  * "4x M8x1.25 - 6H ↓15" veya "Genel toleranslar ISO 2768-mK" gibi metinleri okuyup katı JSON yapısına döker.

### 2. Alan: B-Rep & GD&T Hibrit Eşleme Motoru (Multimodal Matchmaker)
* **Model:** Yerel Embedding (BGE-Micro / All-MiniLM-L6-v2) + Kural Tabanlı Ajan.
* **Görev:**
  * 2D resimdeki "Delik Grubu 1" ile 3D STEP dosyasındaki rastgele `Face_102, Face_105` kimliklerini; çap, derinlik, delik deseni ve projeksiyon görünüşleri üzerinden eşleştirir.
  * Güven skoru $\%90$'ın altındaysa 3D kanvasta operatöre tek tıkla onaylatır.

### 3. Alan: İmalat Niyeti ve Metroloji Strateji Ajanı (Manufacturing Intent Agent)
* **Model:** Llama-3.1-8B-Instruct (llama.cpp / candle üzerinden Rust'a gömülü).
* **Problem:** Deterministik kod tornalama ile frezeleme arasındaki metroloji farkını bilemez.
* **Görev:**
  * STEP geometrisini ve en-boy oranlarını inceleyerek parçanın nasıl üretildiğini anlar: *"Bu parça tornalanmış ve kama kanalı açılmış bir şafttır."*
  * İmalat yöntemine göre örnekleme stratejisi belirler: Tornalanmış millerde görülen 3-köşe loblanma (3-point lobing) hatasını yakalamak için deterministik motora şu kuralı iletir: *"Standart 4 nokta yerine $120^\circ$ harmoniklerini yakalamak için 7 nokta dağıt ve Chebyshev fit algoritması uygula."*

### 4. Alan: Çarpışma ve Hareket Teşhisi (Natural Language Diagnostics)
* **Model:** Llama-3.1-8B (Kompakt teşhis şablonu).
* **Problem:** RRT* veya Bounding-Box motoru hata bulduğunda ekrana yalnızca kuru bir koordinat basar (`Collision at X:124.2, Y:-45.1, Z:12.0`).
* **Görev:**
  * Matematiksel logları saha diline döker:
  * 🗣️ *"Uyarı: Sol flanştaki ∅8 delik ölçülürken $A90^\circ B180^\circ$ açısında probun $30\text{ mm}$'lik uzatması 2 numaralı pabuç cıvatasına sürtüyor. Öneri: Kafa açısını $A75^\circ B180^\circ$ yapın veya prob uzatmasını $50\text{ mm}$'ye çıkarın."*

### 5. Alan: Kapalı Döngü Kök Neden Analizi (Root-Cause Diagnostic Assistant)
* **Model:** Llama-3.1-8B-Instruct + Analitik Veri Yorumlayıcı.
* **Problem:** Parça kırmızıya (tolerans dışı) düştüğünde klasik yazılımlar sadece `OUT OF TOL: +0.035 mm` yazar.
* **Görev:**
  * CMM sapma raporundaki paternleri analiz eder:
    * Tüm delikler $X$'te $+0.025\text{ mm}$ mi kaymış? $\to$ *"CNC parça sıfırı (G54) hatalı veya mengene dayaması gevşek."*
    * Çaplar nominalden gitgide küçülüyor mu? $\to$ *"Takım aşınmış. Takım ofsetine (wear offset) $+0.012\text{ mm}$ girilmeli."*
    * Düzlemsellik $Z$'de konik mi basmış? $\to$ *"Mengene aşırı torkla sıkılmış; parça serbest kalınca yaylanmış."*

---

## 🎙️ 6. Ekstra Saha Kolaylığı: Sesli ve Hands-Free Asistan (Whisper.cpp)

* CMM operatörünün elleri yağlıyken veya kumanda tutarken bilgisayar faresine uzanmasını engellemek için yerel `whisper.cpp` modeli arka planda komut dinler:
  * *"Nuper Ortho, 2 numaralı pabucu Keep-Out alanı yap."*
  * *"Primer datumu merkez silindire kaydır."*
  * *"DCC moduna geç ve programı doğrula."*

---

## 🛡️ 7. Beş Aşamalı Deterministik Gardiyan Mimarisi (Guardrail Stack)

Yapay zekânın ürettiği hiçbir çıkarım aşağıdaki 5 güvenlik süzgecini aşmadan koda dönüşemez:

```
[ Yapay Zeka Çıktısı (Öneri) ]
              │
              ▼ 1. ŞEMA KONTROLÜ
[ GBNF Dilbilgisi & JSON Schema Kısıtı ] ──► (Geçersiz token anında reddedilir)
              │
              ▼ 2. GEOMETRİK GERÇEKLİK
[ B-Rep Ground-Truth Doğrulaması ]       ──► (STEP'te o delik yoksa çöpe atılır)
              │
              ▼ 3. KİNEMATİK SINIRLAR
[ KinematicBoundsValidator (0°-105°) ]   ──► (0.1 mm bile şüpheliyse fallback'e geçer)
              │
              ▼ 4. GÜVEN SKORU EŞİĞİ
[ Confidence Scoring & Operatör Onayı ]  ──► (<%70 ise operatöre sorulur)
              │
              ▼ 5. SANAL KURU ÇALIŞTIRMA
[ Sanal CMM Simülasyonu (Dry-Run) ]      ──► (Tek bir sürtünmede derleyici kilitlenir)
              │
              ▼
[ Onaylanmış Güvenli DMIS Kodu ]
```

### 1. Katı JSON Şema Kısıtı (GBNF Grammar-Constrained Decoding):
Yapay zekânın serbest sohbet metni üretmesi `llama.cpp` seviyesinde GBNF kurallarıyla engellenir. Model sadece önceden tanımlanmış katı JSON şeması üretmek zorundadır:
```json
{
  "feature_id": 14,
  "tolerance_type": "POSITION",
  "value": 0.05
}
```

### 2. Geometrik Gerçeklik Denetimi (Ground-Truth Cross-Check):
Model teknik resimden *"Burada $\varnothing 12$ delik var"* dediğinde, Rust motoru OpenCASCADE B-Rep modelini sorgular: Gerçekten orada $\varnothing 12 \pm 0.2\text{ mm}$ bir silindir var mı? Yoksa öneri "Halüsinasyon" olarak etiketlenip anında silinir. 2D'de 4 delik okunmuş ama STEP'te 3 delik varsa revizyon uyarısı verilir.

### 3. Kinematik ve Fiziksel Sınır Gardiyanı (Kinematic Bounds):
Yapay zekâ $A135^\circ$ gibi imkansız bir açı önerirse veya önerdiği prob şaftı deliğin ağzına $0.1\text{ mm}$ bile yaklaşıyorsa; öneri derhal veto edilir ve sistem deterministik RRT* rotasına (Fallback) geri döner.

### 4. Güven Skoru ve "Human-in-the-Loop" Eşiği:
* **Skor $\ge \%95$:** Otomatik kabul edilir.
* **$\%70 \le \text{Skor} < \%95$:** 3D model üzerinde sarı yanıp söner ve operatöre sorulur: *"Bu yüzey A datumu mu? [E/H]"*
* **Skor $< \%70$:** Reddedilir; operatörden manuel seçim istenir.

### 5. Geri Alınabilir Sanal Kuru Çalıştırma (Dry-Run Sandbox):
Yapay zekânın dahil olduğu tüm rotalar, dosya olarak kaydedilmeden önce yazılımın içindeki Sanal CMM motorunda mikron mikron simüle edilir. Pabuçlara, gövdeye veya strok limitlerine en ufak bir temas varsa DMIS çıktısı üretilmez, buton kilitlenir.

---

## 📊 Görev ve Sorumluluk Matrisi

| Görev / İşlem | İşlemci Katmanı | Neden? |
|---|---|---|
| **B-Rep Geometri & Normal Çıkarımı** | Deterministik (Rust / OpenCASCADE) | Sıfır tolerans, saf analitik matematik, kesin hız. |
| **Prob A/B Açıları & Emniyet Yolu** | Deterministik (Rust Kinematics) | Çarpışma riskinde olasılığa yer yoktur; deterministik güvenlik. |
| **2D Çizim Sembol & Balon Okuma** | Yerel Vision-LLM (Qwen2-VL) | İnsan elinden çıkmış çizim varyasyonlarını ve standart sembolleri çözer. |
| **İmalat Niyeti & Datum Muhakemesi**| Yerel SLM (Llama-3.1-8B) | Tornalama/frezeleme ve ASME Y14.5 mantık çıkarımını yürütür. |
| **Ölçüm Hata Teşhisi & Kök Neden** | Yerel SLM (Llama-3.1-8B) | Operatöre mühendislik seviyesinde düzeltici aksiyon sunar. |
| **Yürütme ve Kod Üretimi** | Deterministik Gardiyan (Rust) | AI önerilerini denetler, filtreler ve tezgah kodunu güvenle basar. |
