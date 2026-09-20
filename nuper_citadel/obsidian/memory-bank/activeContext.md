# Active Context: Nuper Citadel

## 1. Mevcut Odak ve Aşama (Current Focus)
- **Aktif Durum:** Faz 1-6, Faz 6.2 (Post-FEA & A4 PDF) ve **Faz 6.3 (Standart & Malzeme Genişletmesi: RTCA DO-160G, STANAG 4370, İleri Malzemeler & Özel Standart/Malzeme Altyapısı)** Eksiksiz Tamamlandı.
- **Test Doğrulama Skoru:** **56/56 PASSED (%100 Başarı)** - Süre: ~11 saniye. Frontend: `tsc -b && vite build` sıfır hata.
- **Genel Özet:**
  - **Faz 1 (Deterministik Çekirdek):** OpenCASCADE C++ native STEP okuyucu, piecewise log-log PSD integrasyonu, kütle sönümleme, FEA NX/ANSYS 120-nokta ihracı, Steinberg 3-bant Gauss ve Palmgren-Miner ($D \le 0.20$), sarsıcı tabla fikstür rezonans zarfı ($f_1 \ge 2400\text{ Hz}$).
  - **Faz 2 (Yerel LLM & DPO):** Yerel Ollama (`127.0.0.1:11434`) CUDA hızlandırmalı `qwen2.5-coder:7b`, strict prompt template, over-testing itiraz savunma mektubu ajanı ve SQLite `telemetry.db` DPO çifti kayıt motoru.
  - **Faz 3 (Masaüstü Arayüzü & 3D):** Aydınlık havacılık stüdyosu teması, Three.js WebGL interaktif CAD görüntüleyici, CoG küresi, montaj delikleri, HUD koordinat paneli ve 5 adımlı sıralı analiz etüdü.
  - **Faz 4 (Lisans & GD&T CMM Köprüsü):** SHA-256 donanım parmak izi (`NUPER-XXXX-XXXX-XXXX-XXXX`), offline RSA-2048 `.lic` imza doğrulayıcı, ASME Y14.5 MMC True Position ve taban düzlemsellik ($Flatness$) denetimi.
  - **Faz 5 (Golden Bench Doğrulama):** 3 referans savunma vakası (Aviyonik Şasi, Zırhlı Araç Braketi, İHA Pylon) ile uçtan uca deterministik test doğrulandı.
  - **Faz 6 (Sıralı İş İstasyonu & Gerçek CAD/Teknik Resim Entegrasyonu):** ASELSAN Röle Bağlantı Parçası (`ROLE BAGLANTI PARCA_AA (1).stp`) ve 2D çizimi (`ROLE BAGLANTI PARCA_TR_AA-1.pdf`) ile 4x Helicoil çapraz doğrulaması.
  - **Faz 6.2 (Post-FEA & Resmi Savunma A4 PDF Raporlama):** `post_fea_engine.py` rezonans kaçınma, dinamik amplifikasyon $Q$ ve çentikleme hesabı; `pdf_report_generator.py` ReportLab tabanlı kurumsal antetli, doküman numaralı, gizlilik damgalı A4 PDF motoru.
  - **Faz 6.3 (Savunma Standartları & Malzeme Kütüphanesi Genişletmesi):** *(YENİ TAMAMLANDI ✅)*
    1. **RTCA DO-160G Standardı:** Section 8 Titreşim (Curve S Robust Random, Curve B/C Uçak Gövdesi, Curve F Helikopter), Section 4 Sıcaklık/İrtifa, Section 7 Operasyonel/Kaza Şoku.
    2. **STANAG 4370 / AECTP-400 Standardı:** Method 401 Paletli Araçlar ($3.45\text{ }g_{\text{rms}}$) ve Tekerlekli Zırhlı Araçlar ($2.80\text{ }g_{\text{rms}}$).
    3. **İleri MMPDS Malzemeleri:** Kovar (Fe-Ni29-Co17), Invar 36 (Fe-Ni36), Inconel 718, CuBe2 (C17200), PEEK Polimer, CFRP Quasi-Isotropic Kompozit eklendi (toplam 13 kütüphane malzemesi).
    4. **Özel Standart Altyapısı (`/api/standards/custom`):** Şirket içi (ASELSAN MYS, TUSAŞ vb.) özel PSD frekans kırılma tablosu, sıcaklık limitleri ve şok değerlerini SQLite'a yazan motor ve frontend modalı.
    5. **Özel Malzeme Tanımlama (`/api/materials/custom`):** Test kuponu verilerini ($\sigma_y$, $\rho$, $E$, $\alpha$) `materials.db` içine yerel kaydeden motor ve frontend modalı.
    6. **Frontend Arayüz Zenginleştirmesi:** Standart filtreleme hapları (`TÜMÜ`, `MIL-STD-810H`, `RTCA DO-160G`, `STANAG 4370`, `ÖZEL`), 4-sütunlu canlı malzeme özellikleri paneli ve iki adet interaktif yönetim modalı.

---

## 2. Kapsamlı İnceleme (`nuper_citadel_review.md`) Uygulama ve Yol Haritası Durumu

| Madde / Öneri | İnceleme Başlığı | Yol Haritası Seviyesi | Durum | Açıklama |
| :--- | :--- | :--- | :---: | :--- |
| **4.3. FEA Geri Besleme Döngüsü** | Rezonans, Q faktörü, notching | Kısa Vade (1-3 Ay) | **TAMAMLANDI ✅** | `post_fea_engine.py`, API `/api/fea/evaluate-post`, Frontend Step 4 paneli |
| **4.4. PDF/A4 Rapor Çıktısı** | Askeri format, antet, imza | Kısa Vade (1-3 Ay) | **TAMAMLANDI ✅** | `pdf_report_generator.py`, API `/api/export/etp/pdf`, Frontend Step 5 indirme |
| **4.1. Standart DB Kapsamı** | RTCA DO-160G & STANAG 4370 | Kısa/Orta Vade | **TAMAMLANDI ✅** | DO-160G Curves S, B, C, F; STANAG 4370 Paletli & Tekerlekli araçlar |
| **4.5. İleri Malzeme Katmanı** | Kovar, Invar, Inconel, PEEK, CFRP | Orta Vade (3-6 Ay) | **TAMAMLANDI ✅** | 13 MMPDS alaşımı ve kompoziti, 4-özellik canlı HUD kartı |
| **Özel Standart / Malzeme Tanımı** | Şirket içi MYS / Test kuponu | Orta Vade (3-6 Ay) | **TAMAMLANDI ✅** | `/api/standards/custom`, `/api/materials/custom` ve Step 1 modal formları |
| **4.2. Çoklu Parça (Assembly)** | Çoklu STEP, birleşik CoG | Orta Vade (3-6 Ay) | **SIRADA ⏳** | Montaj kütle merkezi, parçalar arası cıvata matrisi eşleme |
| **4.6. Tauri Desktop Paketi** | Tek `.exe` / `.msi` installer | Kısa Vade (1-3 Ay) | **SIRADA ⏳** | Embedded python yönetimi, sistem tepsisi (Rust toolchain gereksinimi) |
| **Uluslararasılaştırma (i18n)** | İngilizce lokalizasyon | Orta Vade (3-6 Ay) | **Yol Haritasında** | İhracat pazarları için çift dilli arayüz ve raporlama |
| **DPO Yerel LoRA Pipeline** | telemetry.db'den fine-tuning | Uzun Vade (6-12 Ay) | **Yol Haritasında** | Yerel Qwen/Llama ağırlıklarının şirket refleksine uyarlanması |
| **Doğrudan FEA Dosya Okuyucu** | ANSYS `.rst` / NX `.op2` | Uzun Vade (6-12 Ay) | **Yol Haritasında** | Otomatik modal ve stres veri ithalatı |
| **Termal Analiz Modülü** | Metot 501/502 gradyan hesabı | Uzun Vade (6-12 Ay) | **Yol Haritasında** | Isıl gerilme ve genleşme farkı ön yük kaybı analizi |
| **PLM/PDM Entegrasyonu** | Teamcenter / Windchill | Uzun Vade (6-12 Ay) | **Yol Haritasında** | Kurumsal savunma veri yönetimi köprüsü |

---

## 3. Aktif Kararlar ve Değerlendirmeler (Decisions & Considerations)
- **Determinizm ve Çoklu Standart Desteği:** İster MIL-STD-810H ister DO-160G ister kullanıcının girdiği özel kurumsal standart olsun; PSD integralleri log-log analitik denklemlerle hesaplanır, $g_{\text{rms}}$ asla tahmin edilmez.
- **Malzeme Katmanı Bütünlüğü:** Yeni eklenen Kovar, Invar 36, Inconel 718, CuBe2, PEEK ve CFRP malzemeleri `materials.db` üzerinde normalize edilmiş olup yoğunluk, elastisite modülü, akma dayanımı ve CTE değerleriyle tork, yorulma ve post-FEA hesaplarına doğrudan beslenmektedir.
- **Sıradaki Öncelik Seçenekleri:**
  1. **Çoklu Parça / Montaj (Assembly) Desteği (Madde 4.2):** Çoklu STEP yükleme, bileşik kütle merkezi $\vec{R}_{cog}$, arayüz temas yüzeyleri ve parçalar arası cıvata deseni eşleme.
  2. **Tauri 2 Desktop Paketi (Madde 4.6):** Rust derleme ortamının kurulması ve tek tıkla çalışan `.exe` paketleyicisi.
