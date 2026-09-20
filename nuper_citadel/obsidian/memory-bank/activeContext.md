# Active Context: Nuper Citadel

## 1. Mevcut Odak ve Aşama (Current Focus)
- **Aktif Durum:** CAD Montaj Deliği Doğrulama & Köşe Radyüsü/Kavisi (Fillet) Ayrımı Motoru Başarıyla Tamamlandı.
- **Kritik İyileştirme:** Cep köşe kavisleri (pocket fillets / transition radii) ile gerçek montaj deliklerinin (fastener bores) deterministik ayrımı. OpenCASCADE üzerinde içe bakan yüzey normaline (`TopAbs_REVERSED`) sahip ancak açık yay olan köşe radyüsleri (U-span ~90°), kanonik 3D eksen doğrusu, eksenel kümeleme ve net açısal kapalılık ($\ge 270^\circ$) algoritması ile %100 elendi.
- **Doğrulama:** `cad_models/` altındaki 14 gerçek savunma sanayii modelinin tamamı (Role Bağlantı, Anten Kapak, Kart Tutucu, Batarya Tutucu, Ön Gövde, Tetik Mekanizması vb.) test edildi; 100'lerce sahte köşe kavisi elenirken tüm gerçek cıvata delikleri eksiksiz korundu.
- **Test Doğrulama Skoru:** **82/82 PASSED (%100 Başarı)** - Süre: ~12.3 saniye. Frontend: `tsc -b && vite build` 0 hata ile 818 ms'de derlendi.
- **Kullanıcı Talimatı:** Dil çevrimi (i18n) projenin en sonuna ertelendi ("en son proje bittiğinde dil çevrimi yaparız 4.6'dan devam et").
- **Genel Özet:**
  - `cad_parser.py` & `assembly_engine.py`: `extract_holes_from_solid` motoru güncellendi. Silindirik yüzeyler sonsuz eksen doğrusu ($P_{\text{proj}}, \vec{D}$), yarıçap $R$ ve eksenel konuma ($t$) göre kümelenir. 360 derecelik açısal kapalılık analizi ile $\ge 270^\circ$ olanlar delik kabul edilir, $\le 120^\circ$ olan köşe kavisleri tamamen ayıklanır.
  - `tests/test_cad_parser.py`: 90° köşe kavisleri, üst üste binmiş cepler ve gerçek STEP modelleri üzerinde testler eklendi (4/4 passed).

---

## 2. Kapsamlı İnceleme (`nuper_citadel_review.md`) Uygulama ve Yol Haritası Durumu

| Madde / Öneri | İnceleme Başlığı | Yol Haritası Seviyesi | Durum | Açıklama |
| :--- | :--- | :--- | :---: | :--- |
| **4.3. FEA Geri Besleme Döngüsü** | Rezonans, Q faktörü, notching | Kısa Vade (1-3 Ay) | **TAMAMLANDI ✅** | `post_fea_engine.py`, API `/api/fea/evaluate-post`, Frontend Step 4 paneli |
| **4.4. PDF/A4 Rapor Çıktısı** | Askeri format, antet, imza | Kısa Vade (1-3 Ay) | **TAMAMLANDI ✅** | `pdf_report_generator.py`, API `/api/export/etp/pdf`, Frontend Step 5 indirme |
| **DOCX Düzenlenebilir ETP** | python-docx resmi Word çıktısı | Kısa Vade (1-3 Ay) | **TAMAMLANDI ✅** | `docx_report_generator.py`, API `/api/export/etp/docx`, Step 5 indirme |
| **4.1. Standart DB Kapsamı** | RTCA DO-160G & STANAG 4370 | Kısa/Orta Vade | **TAMAMLANDI ✅** | DO-160G Curves S, B, C, F; STANAG 4370 Paletli & Tekerlekli araçlar |
| **4.5. İleri Malzeme Katmanı** | Kovar, Invar, Inconel, PEEK, CFRP | Orta Vade (3-6 Ay) | **TAMAMLANDI ✅** | 13 MMPDS alaşımı ve kompoziti, 4-özellik canlı HUD kartı |
| **Özel Standart / Malzeme Tanımı** | Şirket içi MYS / Test kuponu | Orta Vade (3-6 Ay) | **TAMAMLANDI ✅** | `/api/standards/custom`, `/api/materials/custom` ve Step 1 modal formları |
| **4.2. Çoklu Parça (Assembly)** | Çoklu STEP, birleşik CoG, Exploded View | Orta Vade (3-6 Ay) | **TAMAMLANDI ✅** | `AssemblyEngine`, birleşik CoG integrali, inter-part cıvata eşleme, 3D patlatılmış görünüm |
| **4.6. Tauri Desktop Paketi** | Tek `.exe` / `.msi` installer | Kısa Vade (1-3 Ay) | **TAMAMLANDI ✅** | Tauri 2 Rust ağacı, sıfır-zombi yaşam döngüsü, tray, `desktop_launcher.py`, `run_citadel.bat` |
| **Termal Analiz Modülü** | Metot 501/502 sıcaklık gradyan hesabı | Uzun Vade (6-12 Ay) | **TAMAMLANDI ✅** | `thermal_engine.py`, `/qualification/thermal-check`, Step 4 termal kartı & A4 PDF |
| **Mekanik Şok & SRS Modülü** | Metot 516.8 TPS ve Half-sine analizi | Uzun Vade (6-12 Ay) | **TAMAMLANDI ✅** | `shock_engine.py`, `/qualification/shock-srs`, Step 4 şok kartı & SRS |
| **Kompozit CLT & Tsai-Wu** | Çok katmanlı laminat [A,B,D] matrisi | Uzun Vade (6-12 Ay) | **TAMAMLANDI ✅** | `composite_engine.py`, `/materials/composite-evaluate`, Step 4 kompozit kartı |
| **3D Shaker & Fikstür Sahnesi** | 50x50 mm M10 ızgara ve fikstür plakası | Uzun Vade (6-12 Ay) | **TAMAMLANDI ✅** | `CADViewer3D.tsx` Shaker Grid, Fixture Baseplate ve Exploded View |
| **Kurumsal PLM/PDM Köprüsü** | Teamcenter & Windchill senkronizasyonu | Uzun Vade (6-12 Ay) | **TAMAMLANDI ✅** | `plm_bridge.py`, `/plm/sync` ve Step 5 PLM kartı |
| **Doğrudan FEA Dosya Okuyucu** | NASTRAN `.f06` / ANSYS log | Uzun Vade (6-12 Ay) | **TAMAMLANDI ✅** | `post_fea_engine.py`, `/fea/upload-solver-log` ve Step 4 dosya yükleyici |
| **DPO Yerel LoRA Pipeline** | telemetry.db'den fine-tuning | Uzun Vade (6-12 Ay) | **TAMAMLANDI ✅** | `scripts/export_dpo_dataset.py`, HuggingFace JSONL & Qwen 2.5 LoRA konfig |
| **4.7. Uluslararasılaştırma (i18n)** | İngilizce lokalizasyon | Orta Vade (3-6 Ay) | **EN SONA ERTELENDİ ⏸** | Kullanıcı talimatı: "en son proje bittiğinde dil çevrimi yaparız" |

---

## 3. Aktif Kararlar ve Değerlendirmeler (Decisions & Considerations)
- **Termal & Yapısal Determinizm:** Isıl genleşme ($\alpha$) ve elastisite modülü ($E$) arasındaki fiziksel bağıntılar VDI 2230 flanş katsayısı ($\Phi=0.22$) ile modellenmiş olup, aşırı sıcakta cıvata akma riski ile aşırı soğukta cıvata ön yük gevşeme riski analitik olarak ayrılmıştır.
- **Doğrudan Çözücü Entegrasyonu:** MSC/NX Nastran `.f06` ve ANSYS çözüm özetleri otomatik metin ayrıştırma ile mod frekansları ve pik gerilmeleri çıkararak mühendisin manuel veri giriş yükünü sıfıra indirmektedir.
- **Sıfır Bulut Bağımlılığı:** Tüm sistem 127.0.0.1 üzerinde yerel çalışmakta, telemetri çiftleri yerel `telemetry.db` SQLite veritabanında tutulmakta ve `export_dpo_dataset.py` ile air-gapped sunucularda Qwen eğitimi için hazır hale getirilmektedir.
