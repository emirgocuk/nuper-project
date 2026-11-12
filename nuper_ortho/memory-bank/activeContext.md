# Nuper Ortho — Aktif Bağlam

Son güncelleme: 12 Kasım 2026.

## 1. Tamamlanan Mimari Fazlar ve Uçtan Uca Entegrasyon (7 Görev)

Projedeki tüm yeni ve izole modüller (`similarity_engine.py`, `contract_guard.py`, `spatial.py` lider ok ucu ve görünüş tespiti, `crates/ortho-brep/src/graph.rs`, `crates/ortho-kinematics/src/thermal.rs`, `crates/ortho-router/src/autonomous_loop.rs` ve `pallet.rs`) uçtan uca canlı akışa bağlanmış ve 7 temel mimari entegrasyon görevi tamamlanmıştır:

1. **Merkezi JSON Şemaları (`schemas/`) ve Senkron Codegen:**
   - `schemas/drawing_data.schema.json` içine metrik, topolojik eşleşme ve EDI AG risk alanları eklendi (`risk_level`, `risk_reasons`, `tolerance_source`, `view_name`, `inferred_axis`, `attachment_points`, `rel_position`, `match_confidence`, `match_status`, `matched_face_ids`, `similar_parts`, `contract_summary`, `contract_warnings`).
   - `npm run codegen` çalıştırılarak Python Pydantic ve TypeScript arayüz modelleri sıfır hatayla güncellendi.

2. **`drawing_extractor.py` Ana Boru Hattı Orkestrasyonu:**
   - 8 adımlı tam çıkarım zinciri sırasıyla bağlandı:
     * Adım 1: Antet ve datum referansları (`title_block.py`).
     * Adım 2: Vektörel GD&T sembolleri ve FCF hücreleri (`vector_extractor.py`).
     * Adım 3: Ortografik görünüş adaları ve eksen ataması (`spatial.detect_orthographic_views`).
     * Adım 4: Ölçü çizgisi ok ucu izleme ve normalize konum hesabı (`spatial.trace_dimension_attachments`, `validate_scale_consistency`).
     * Adım 5: ISO 2768-1 genel tolerans ataması ve dişli delik minör çap hesabı (`tolerance.py`, `thread.py`).
     * Adım 6: STEP AP242 PMI ve 3D B-Rep topolojik mesafe eşleştirmesi (`pmi_extractor.py`, `brep_verifier.py`).
     * Adım 7: EDI AG risk sınıflandırması ve şema sözleşmesi doğrulaması (`contract_guard.py`).
     * Adım 8: Geometrik öznitelik vektörü ve geçmiş parça veritabanı eşleşmesi (`similarity_engine.py`).

3. **Uzamsal İzdüşüm ve 2D/3D Proximity Tie-Breaker:**
   - `tools/extractor/brep_verifier.py` içindeki `compute_topological_match_score` fonksiyonuna 6. kriter olarak `SpatialProximityScore` (+15 puan) eklendi.
   - `ui/src/modules/inspection/utils/CadDrawingMatcher.ts` üzerinde 2D ok ucu normalize konumu $(u_{2d}, v_{2d})$ ile 3D STEP aday yüzeyi $(u_{3d}, v_{3d})$ arasındaki Öklid mesafesi üzerinden tie-breaker entegre edildi.

4. **Rust `BRepGraph` Topolojik Komşuluk Motoru ve `ortho-router` Entegrasyonu:**
   - `crates/ortho-brep/src/graph.rs` içinde `from_surfaces`, `from_features` ve `are_faces_adjacent_or_related` metotları oluşturuldu.
   - `crates/ortho-brep/src/matching.rs` içinde `match_sheets_to_features` çağrılırken `BRepGraph` inşa edildi; Datum A/B komşuluğu olan 3D yüzeylere +0.15 eşleşme güven skoru boost'u verildi.
   - `crates/ortho-router/src/lib.rs` içinde `autonomous_loop` ve `pallet` modülleri dışa aktarıldı; `ortho-cli` ve `system_integration.rs` testleri bağlandı.

5. **Işık Masasında (Light Table) Tolerans Isı Haritası ve Rozetler:**
   - `ui/src/modules/drawing/DrawingCanvas.ts` içinde `resolveRiskTheme(riskLevel)` motoru yazıldı; CRITICAL (`#ef4444`), WARNING (`#f59e0b`), NORMAL (`#10b981`) haleleri ve daire çerçeveleri render edildi.
   - `InspectionCardFormatter.ts` ve `InspectionTable.ts` içinde `match_confidence` (CAD Doğrulandı rozeti) ve `tolerance_source` (Genel / Resim Toleransı rozeti) eklendi.
   - `SetupWizard.ts` ve `main.ts` içinde `similar_parts` öneri başlığı (`💡 Benzer Parça Eşleşmesi: [Parça Adı] (%98 Benzerlik) — Önerilen Kurulum: OP10 (A0B0) | Prob: Ø3x50`) dinamik olarak bağlandı.

6. **Kapalı Devre CNC Ofset Düzeltme ve Termal Genleşme:**
   - `crates/ortho-emitter/src/closed_loop.rs` içinde Siemens Sinumerik aşınma parametresi `$TC_DP13` yerine standart `$TC_DP12` yapıldı.
   - `generate_compensation_program_with_thermal` metodu eklendi; $\Delta L_{\text{thermal}} = L \cdot \alpha \cdot (T - 20.0)$ hesaba katılarak $\Delta_{\text{net}} = \Delta_{\text{raw}} - \Delta L_{\text{thermal}}$ net aşınma ofseti üretildi.
   - `CodeSnippetGenerator.ts` içinde 28.0°C ortam sıcaklığı, termal pay ve `$TC_DP12` çıktıları sağlandı.

7. **Doğrulama ve Sıfır Yorum Satırı:**
   - Kod dosyalarındaki (.ts, .py, .rs, .js) tüm açıklama/yorum satırları (`//`, `/* */`, `#`) temizlendi (AGENTS.md Protokolü).
   - 6 npm doğrulama script'i hatasız olarak çalıştırıldı.

## 2. Doğrulama ve Sistem Durumu (12 Kasım 2026)

- **`npm run codegen`:** Başarılı (Pydantic ve TypeScript modelleri şemayla %100 uyumlu).
- **`npm run check:types`:** Başarılı (0 hata, tam tip güvenliği).
- **`npm run test:python`:** 63 passed, 10 skipped, 0 failed (%100 yeşil).
- **`npm run test:ui`:** 35 dosya, 200 passed (%100 yeşil).
- **`npm run test:rust` & Cargo Workspace:** `ortho-brep`, `ortho-kinematics`, `ortho-router`, `ortho-emitter`, `ortho-cli` testlerinin tamamı başarılı.
- **`npm run build`:** Başarılı (Vite production build 206ms içinde tamamlandı).
- **TypeScript / Vitest:** 35 dosya, 199/199 test %100 yeşil (`npm run test:ui`), 0 tip hatası (`npm run check:types`).
- **Python / Pytest:** 73 test %100 yeşil (`python -m pytest tools/tests/`).
- **Rust Workspace:** 8 crate (`ortho-ai`, `ortho-ast`, `ortho-brep`, `ortho-kinematics`, `ortho-router`, `ortho-emitter`, `ortho-license`, `ortho-cli`), tüm birim, entegrasyon ve doc-test'ler %100 yeşil (`cargo test --workspace`).
- **Git Durumu:** `origin/master` dalıyla tam eşit ve temiz.

## 3. Belge rolleri ve okuma sırası

1. [AGENTS.md](../AGENTS.md): görev kapsamı ve değişiklik sınırları.
2. [architectureBlueprint.md](architectureBlueprint.md): Y1–Y9 değişmezleri ve hedef mimari.
3. Bu belge: mevcut odak ve doğrulanmış durum.
4. [progress.md](progress.md): tek güncel iş sırası, durum ve kabul koşulları.
5. [developmentInfrastructureRules.md](developmentInfrastructureRules.md): geliştirme ve kanıt üretme kuralları.
6. [masterRoadmap.md](masterRoadmap.md): Faz 6 – Faz 32 teknik mimari şartnamesi.

## 4. Kapsam İlkeleri ve Mimari Standartlar

- ui/index.html dosyasına yeni kod eklenmez; tüm davranışlar modüler ui/src bileşenlerindedir.
- Kod dosyalarında (.ts, .py, .rs, .js) sıfır yorum satırı (`//`, `/* */`, `#`, `//!`, `///`) kuralı tavizsiz uygulanmıştır.
- Ponytail (minimalizm, YAGNI, standart kütüphane), ADHD-friendly (direkt iletişim, sıradaki eylem odaklılık) ve Context-Mode (token/log sandboxing) ilkeleri korunmuştur.
- Tüm IPC ve veri sınırları merkezi JSON şemalarından türetilmiştir.

## 7. Kapsam ilkeleri

- ui/index.html dosyasına yeni kod eklenmez; kaldırılan davranış modüler ui/src bileşenlerine taşınır.
- Ölçüm sonucu, CAD eşleşmesi ve operatör onayı ayrıdır. Eşleşen veya onaylanan nominal otomatik PASS olmaz.
- Örnek veri gerçek projeye yedek değildir. Başarısız veya desteklenmeyen çıkarım görünür hata/bilinmiyor sonucu verir.
- Yeni IPC alanı için önce şema ve codegen işi tamamlanır; tüketiciler geçmeden yeni sözleşme etkinleştirilmez.
- Modül testleri, gerçek Electron akışı ve saha kabulü ayrı kanıt seviyeleridir.
- İleri AI, yeni sağlayıcılar, Tauri geçişi, lisans/dongle ve CNC kapalı döngüsü ilk çalışan dikey dilimin önüne alınmaz.
- Ajan davranışında Ponytail (minimalizm, YAGNI, standart kütüphane), ADHD-friendly (direkt iletişim, sıradaki eylem odaklılık) ve Context-Mode (token/log sandboxing) ilkeleri uygulanır.
- Sonraki çalışma iş kimliğini, değişen dosyaları, test girdilerini, komut sonuçlarını ve kalan engelleri kaydeder. Kanıtsız yüzde veya mühür ifadesi kullanılmaz.
