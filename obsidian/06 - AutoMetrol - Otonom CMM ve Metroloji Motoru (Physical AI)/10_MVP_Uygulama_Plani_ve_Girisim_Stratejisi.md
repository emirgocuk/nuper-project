# 🚀 10. MVP Uygulama Planı ve Girişim Stratejisi

> **"6 haftalık çalışan çekirdek prototip geliştirme takvimi, PTB doğrulama testleri, pilot atölye saha doğrulama stratejisi ve YC 2026 başvuru anlatısı."**

---

## 📅 1. 6 Haftalık MVP Sprint Takvimi

```
[ Hafta 1 ] ──► STEP Ayrıştırma & B-Rep Çekirdeği (Rust + OpenCASCADE)
[ Hafta 2 ] ──► Kafa Kinematiği (PH10 720 Açı) & Emniyet Zarfı (+50mm)
[ Hafta 3 ] ──► DMIS 5.3 Derleyici (Manuel Ön-Hizalama & Termal Blok)
[ Hafta 4 ] ──► Metroloji Fitting (Chebyshev/Gauss) & PTB Test Paketi
[ Hafta 5 ] ──► Tauri + Three.js 3D Arayüzü & Pabuç Keep-Out Kutuları
[ Hafta 6 ] ──► Gerçek CMM Tezgahında (PC-DMIS) Saha Testi & Demo Videosu
```

### Hafta 1: Geometri Çekirdeği
- Rust + OpenCASCADE C++ bağlayıcısının (`cxx`) kurulması.
- Basit bir prizmatik ve delikli STEP dosyasının okunarak düzlemlerin ve silindirlerin merkez/normal vektörlerinin terminale basılması.

### Hafta 2: Kinematik ve Çarpışmasız Rota
- Hedef yüzey normallerine göre PH10 motorize kafa açısı optimizasyon algoritmasının kodlanması ($\theta \to \min$).
- Parçanın dış sınırlarına $+50\text{ mm}$ emniyet kutusu (Clearance Box) ve $5\text{ mm}$ normal geri çekilme mantığının işletilmesi.

### Hafta 3: Post-Processor ve Manuel Sıfırlama
- Nötr ara yoldan ANSI DMIS 5.3 ve PC-DMIS formatında kod üreten Tera şablon motorunun yazılması.
- Koda `MODE/MAN` operatör rehberliği ve malzeme sıcaklık genleşme bloğunun (`TEMPR/PART`) eklenmesi.

### Hafta 4: Metroloji Matematiği ve PTB Akreditasyon Testleri
- H7 delikler için Chebyshev Maksimum İç Teğet ve Gauss algoritmalarının Rust birim testlerine dökülmesi.
- Alman Ulusal Metroloji Enstitüsü'nün (PTB) açık referans test koordinat kümeleriyle algoritmaların doğrulanması.

### Hafta 5: Masaüstü Arayüzü ve 3D Görselleştirme
- Tauri 2.0 ve Three.js ile 3D CAD görüntüleme bileşeninin tamamlanması.
- Operatörün bağlama pabuçlarını işaretleyebileceği 3D Keep-Out kutusu aracının eklenmesi.
- "Generate DMIS" butonunun Rust çekirdeğine bağlanması.

### Hafta 6: Saha Doğrulaması ve YC Demo Çekimi
- Anlaşmalı bir savunma/havacılık atölyesinde gerçek bir CMM tezgahında (Hexagon PC-DMIS) üretilen kodun test edilmesi.
- Manuel 4 saatlik programlama ile AutoMetrol'ün 30 saniyelik çıktısının ölçüm sonuçlarının karşılaştırılması.
- Y Combinator başvurusu için 1 dakikalık tezgah başı demo videosunun kaydedilmesi.

---

## 🎯 2. Pilot Dağıtım ve Saha Doğrulama Stratejisi

1. **Test Parçası Seçimi:** Savunma sanayiinde çok yaygın olan prizmatik, 4-6 delikli ve 1 adet eğimli faturaya sahip bir hidrolik valf bloğu seçilir.
2. **Kıyaslama Testi (A/B Testi):**
   - **Grup A (Manuel):** Kıdemli CMM operatörü PC-DMIS'te parçayı sıfırdan tıklar ve programlar (Süre ölçülür: ~3.5 saat).
   - **Grup B (AutoMetrol):** STEP ve PDF yazılıma verilir, 30 saniyede DMIS kodu alınır, tezgaha yüklenir ve çalıştırılır.
3. **Boyutsal Tutarlılık Kontrolü:** İki programın ölçtüğü çap, diklik ve konum sapmaları karşılaştırılır. Mikron düzeyinde birebir uyum kanıtlanır.

---

## 💼 3. Satış ve Ticarileşme Kanalları

- **Doğrudan Saha Satışı:** Savunma ve otomotiv yan sanayii kalite kontrol müdürleri ve fabrika sahipleri.
- **Donanım Kilitli Dongle:** Air-gapped (çevrimdışı) askeri ortamlarda izinsiz kopyalamayı engelleyen USB donanım anahtarı (Hardware Dongle).
- **Fiyatlandırma Stratejisi:**
  - KOBİ: Yıllık **4.500$** (CMM başına).
  - Kurumsal / Havuz: Yıllık **25.000$** (Büyük savunma tesisleri).

---

## 🏆 4. Y Combinator ve Yatırımcı Anlatısı (The Narrative)

> *"Modern imalat dünyasında CAM yazılımları CNC tezgahlarının takım yollarını dakikalar içinde otonomlaştırarak devasa şirketlere dönüştü (Autodesk, Dassault). Ancak parçanın kalite kontrol tarafı 25 yıldır karanlıkta kaldı. Biz CMM teftişini otonomlaştıran ilk Physical AI motoruyuz. Parça başına 4 saatlik uzman emeğini 30 saniyeye indiriyor; savunma ve havacılık fabrikalarının kalite kontrol darboğazını kökten açıyoruz."*
