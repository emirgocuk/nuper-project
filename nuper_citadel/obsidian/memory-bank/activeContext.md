# Active Context: Nuper Citadel

## 1. Mevcut Odak ve Aşama (Current Focus)
- **Aktif Durum:** 5 Fazın Tümü Eksiksiz Olarak Tamamlandı & Doğrulandı (%100 Başarı - 40/40 Test).
- **Genel Özet:**
  - **Faz 1 (Deterministik Çekirdek):** OpenCASCADE C++ native STEP okuyucu, piecewise log-log PSD integrasyonu, kütle sönümleme, FEA NX/ANSYS 120-nokta ihracı, Steinberg 3-bant Gauss ve Palmgren-Miner ($D \le 0.20$), sarsıcı tabla fikstür rezonans zarfı ($f_1 \ge 2400\text{ Hz}$).
  - **Faz 2 (Yerel LLM & DPO):** Yerel Ollama (`127.0.0.1:11434`) CUDA hızlandırmalı `qwen2.5-coder:7b`, strict prompt template, over-testing itiraz savunma mektubu ajanı ve SQLite `telemetry.db` DPO çifti kayıt motoru.
  - **Faz 3 (Masaüstü Arayüzü & 3D):** Aydınlık havacılık stüdyosu teması (`#f8fafc`), Three.js WebGL interaktif CAD görüntüleyici, CoG küresi, montaj delikleri, HUD koordinat paneli ve çok sekmeli operasyon merkezi.
  - **Faz 4 (Lisans & GD&T CMM Köprüsü):** SHA-256 donanım parmak izi (`NUPER-XXXX-XXXX-XXXX-XXXX`), offline RSA-2048 `.lic` imza doğrulayıcı, ASME Y14.5 MMC True Position ve taban düzlemsellik ($Flatness$) denetimi.
  - **Faz 5 (Golden Bench Doğrulama):** 3 referans savunma vakası (`tests/golden_benchmarks/cases.json` - Aviyonik Şasi, Zırhlı Araç Braketi, İHA Pylon) ile uçtan uca deterministik test doğrulandı.
- **Sistem Mimarisi İlkesi:** Sıfır bulut bağımlılığı, sıfır veri sızıntısı (`127.0.0.1`), deterministik mühendislik doğruluğu.

---

1. **Sıralı Analiz Etüdü & Havacılık CAD İş İstasyonu Tasarımı (Faz 6 UI Overhaul):**
   - Eski sıkışık, boş beyaz alan içeren ve sekmeli prototip yapısı tamamen kaldırıldı.
   - Ansys Workbench / Siemens Simcenter benzeri sıralı 5 adımlı analiz iş istasyonu mimarisine geçildi.
2. **Son Tamamlanan Geliştirmeler (2026-09-20):**
   - **Gerçek 3D STEP Tessellation (OpenCASCADE BRepMesh):**
     - Parametrik kutu fallback yerine `BRepMesh_IncrementalMesh` ve `BRep_Tool.Triangulation_s` ile STEP katısının gerçek tepe noktaları ve üçgen indeksleri üretilerek Three.js `BufferGeometry` ile render ediliyor.
     - Parça koordinat ofsetleri (örneğin $X \approx -1670\text{ mm}$) normalize edilerek model $(0,0,0)$ merkezine çekildi.
     - `BRepGProp.SurfaceProperties_s` ile delik merkezleri doğrudan kırpılmış silindir yüzeyinin kütle merkezinden alındı ve yüzey normaline göre 3D oryantasyon verildi.
   - **Three.js OrbitControls & Kamera Dock:**
     - Sol tık ile serbest küresel döndürme (Orbit).
     - Fare tekerleği ile pürüzsüz yakınlaşma / uzaklaşma (Dolly Zoom).
     - Sağ tık ile ekran düzleminde kaydırma (Pan).
     - Sağ üst köşede `Zoom In`, `Zoom Out`, `İZO`, `ÜST`, `ÖN`, `YAN` ve `Görünümü Sıfırla` dock butonları.
   - **Askeri Teknik Resim Çıkarımları (`ROLE BAGLANTI PARCA_TR_AA-1.pdf`):**
     - Çift dilli başlıklar, MIL-DTL-5541 F Alodine kaplama, ASME Y14.5 / ISO 2768-m toleransları, helicoil (tel diş) ve ASTM E1417 penetrant muayene kriterleri sisteme entegre edildi.
3. **Kullanıcı Savunma Parçası Doğrulaması (Röle Bağlantı Parçası):**
   - Kullanıcı tarafından `cad_models/` dizinine aktarılan gerçek ASELSAN aviyonik parçası analiz edildi:
     - Katı Model: `ROLE BAGLANTI PARCA_AA (1).stp` ($55.08 \times 31.66 \times 31.68\text{ mm}$, $35.7\text{ g}$ Alüminyum, Manifold geçerli, 2x M4 + 2x M3 Helicoil delikleri tam tespit edildi).
     - Teknik Resim: `ROLE BAGLANTI PARCA_TR_AA-1.pdf` (Doküman No: `603739-00000-01-1Y2`, Malzeme: `AL 5083 / Al6063` -> `Al 6061-T6`, Kaplama: `Alodine MIL-DTL-5541 F Sınıf 1A`, True Position $\varnothing 0.20\text{ mm}$ @ MMC).
     - FastenerEngine: DIN 912 M4 ($2.7\text{ N}\cdot\text{m}$, Nord-Lock NL4) ve M3 ($1.2\text{ N}\cdot\text{m}$, Nord-Lock NL3) reçetesi çizimdeki Helicoil ölçüleriyle %100 örtüştü.
     - Miner hasar indeksi $D = 0.0069 \le 0.20$ ile parça titreşim yorulmasında **KABUL EDİLDİ (PASS)**.
4. **Doğrulama:**
   - 45/45 birim/entegrasyon testi %100 başarıyla geçti.
   - Canlı API ve web arayüzü hatasız çalışıyor.

---

## 3. Aktif Kararlar ve Değerlendirmeler (Decisions & Considerations)
- **Determinizm Sınırı:** Sayısal toleranslar, PSD integralleri ve fikstür kalınlıkları doğrudan OpenCASCADE, C++ ve analitik Python modüllerinde çözülür; LLM sadece sentez ve dilekçe şablonlama görevi yürütür.
- **Güvenlik ve Lisans:** RSA-2048 çevrimdışı imza sayesinde sistem internete hiç bağlanmayan TUSAŞ, ASELSAN ve ROKETSAN gibi tesislerde güvenle çalışır.
- **Tasarım:** Sıkışık, ham ve boş form alanları barındıran prototip arayüzü yerine tam ekran (100vh) profesyonel havacılık CAD/FEA iş istasyonu tasarımı getirildi. Aydınlık, ferah ve yüksek kontrastlı modern bir savunma-havacılık mühendislik stüdyosu arayüzü kuruldu.
