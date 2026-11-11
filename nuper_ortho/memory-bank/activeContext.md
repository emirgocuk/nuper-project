# Nuper Ortho — Aktif Bağlam

Son güncelleme: 11 Kasım 2026.

## 1. Tamamlanan Mimari Fazlar (Commit & Push Geçmişi: Faz 1 – Faz 32)

Tüm geliştirmeler AGENTS.md protokolüne (Sıfır yorum satırı kuralı, en fazla 3 modül dosyalık atomik commit kuralı, TDD test doğrulaması) uygun olarak tamamlanmış ve `origin/master` dalına aktarılmıştır:

1. **FAZ 26 (Vektörel Mikro Çizim GD&T ve Çap Topolojisi):** `tools/extractor/spatial.py` & `tools/extractor/vector_extractor.py` (Commit `dcc8372`).
2. **FAZ 27 (FCF Hücre Bölücü & Kompozit Kutu Ayrıştırıcısı):** `tools/extractor/semantic_grammar.py` (Commit `c402bea`).
3. **FAZ 28 (Dikey ve Açılı Ölçülerde 90° Rotasyon Normalizasyonu):** `tools/extractor/spatial.py` (Commit `24542b6`).
4. **FAZ 29 (Ölçü Çizgisi, Uzatma Çizgisi ve Lider Ok Ucu İzleyicisi):** `tools/extractor/spatial.py` (Commit `66dfb95`).
5. **FAZ 30 (Kısıtlı Mühendislik Alfabesi ve OCR Kontur Font Sanitizer):** `tools/extractor/vision_ai_extractor.py` & `tools/extractor/semantic_grammar.py` (Commit `8ac9f89`).
6. **FAZ 31 (Tolerans Kritiklik Renklendirmesi ve Işık Masası Isı Haritası):** `ui/src/modules/inspection/utils/InspectionCardFormatter.ts` & `ui/src/modules/drawing/DrawingCanvas.ts` (Commit `2e71e12`).
7. **FAZ 32 (B-Rep Geometrik Benzerlik Eşleştirme ve Kurulum Hafızası):** `tools/extractor/similarity_engine.py` & `ui/src/modules/cad/utils/PartSimilarityEngine.ts` (Commit `2bf415b`).
8. **FAZ 6 (B-Rep Topolojik Bilgi Grafiği ve Eksenel Kademeli Delik Sorguları):** `crates/ortho-brep/src/graph.rs` & `crates/ortho-brep/src/lib.rs` (Commit `31c4bbd`, `a9c9bf6`).
9. **FAZ 7 (ASME Y14.5-2018 ve ISO 1101 GD&T Kural Motoru ve Bonus Tolerans):** `crates/ortho-ast/src/composite_gdandt.rs` & `crates/ortho-ast/src/lib.rs` (Commit `b243f1d`).
10. **FAZ 8 (PTB Onaylı Chebyshev L-Sonsuz Fitting ve GUM ISO 15530-3 Belirsizlik):** `crates/ortho-kinematics/src/fitting.rs` & `tools/extractor/metrology_fitting.py` (Commit `e4236e8`, `889befe`).
11. **FAZ 9 (Zero-Copy Yüksek Hızlı İkili IPC Protokolü - 80-Bayt Telemetri):** `crates/ortho-router/src/ipc.rs` & `ui/src/modules/ipc/BinaryTelemetry.ts` (Commit `94b76e8`, `889befe`).
12. **FAZ 10 (Sürekli 5-Eksen Helisel Tarama Kinematiği ve Kuaterniyon Slerp):** `crates/ortho-kinematics/src/ph10.rs` & `ui/src/modules/cad/utils/Ph10Kinematics.ts` (Commit `812ae92`, `889befe`).
13. **FAZ 11 (Hibrit Metroloji: Optik & Lazer Çizgi Sensörü Scan-to-CAD Heatmap):** `crates/ortho-kinematics/src/laser.rs` & `ui/src/modules/cad/utils/ScanToCadHeatmap.ts` (Commit `da20085`).
14. **FAZ 12 (Renishaw MCR20/FCR25 6 Adımlı Otomatik Prob Magazini Değişimi):** `crates/ortho-router/src/stylus.rs` & `crates/ortho-router/src/hal.rs` (Commit `80eb4fa`).
15. **FAZ 13 (I++ DME v1.7/v2.0 Asenkron CMM TCP Köprüsü):** `crates/ortho-router/src/ipp.rs` & `crates/ortho-router/src/hal.rs` (Commit `0d155f8`).
16. **FAZ 14 (BVH + GJK/EPA Çarpışma Fiziği, CCD ve Çoklu Fikstür Atlama Rotası):** `crates/ortho-router/src/collision.rs` & `crates/ortho-router/src/clearance.rs` (Commit `b5fdd04`, `ad64a27`).
17. **FAZ 15 (Çoklu CNC Kapalı Döngü Desteği ve SPC Aşınma Tahmini):** `crates/ortho-emitter/src/closed_loop.rs` (Commit `ecf92c2`).
18. **FAZ 16 (AS9102 Rev C Resmi FAI Raporu ve Dijital HMAC Mührü):** `crates/ortho-emitter/src/as9102.rs` (Commit `0662de1`, `a9a5216`).
19. **FAZ 17 (Çoklu Parça Paletleme, Yuvalama ve Boş Yuva Atlama):** `crates/ortho-router/src/pallet.rs` (Commit `2caab5a`).
20. **FAZ 18 (Karpathy LLM Kalkanı: Sıfır Sessiz Varsayım ve Şema Hasar Koruması):** `crates/ortho-ai/src/karpathy_guard.rs` (Commit `881a4cb`).
21. **FAZ 19 (Ponytail Yalın Kod Analizcisi ve YAGNI Koruması):** `crates/ortho-ai/src/ponytail_guard.rs` (Commit `803f4de`).
22. **FAZ 20 (Superpowers Metodolojisi Uçtan Uca CI E2E Test Koşucusu):** `crates/ortho-cli/src/bin/ci_e2e_runner.rs` (Commit `9b3bc0e`).
23. **FAZ 21 (Savunma Sanayii Air-Gapped Donanım Kilidi ve DMIS Filigranı):** `crates/ortho-license/src/lib.rs` (Commit `b697eeb`, `ad64a27`).
24. **FAZ 22 (Atölye Tipi Yüksek Kontrast CMM Operatör Kokpiti):** `ui/src/modules/inspection/OperatorCockpit.ts` (Commit `2b5bd36`).
25. **FAZ 23 (Dinamik 3B Termal Gradyan ve Işın Genleşme Kompanzasyonu):** `crates/ortho-kinematics/src/thermal.rs` (Commit `27bd3cd`).
26. **FAZ 24 (Tersine Mühendislik RANSAC Parametrik B-Rep Rekonstrüksiyonu):** `crates/ortho-brep/src/surface.rs` (Commit `3d4f9ad`).
27. **FAZ 25 (Otonom Kalite Derleyicisi 2.0 Sovereign Loop & Cpk Yakınsaması):** `crates/ortho-router/src/autonomous_loop.rs` (Commit `62213d7`).
28. **Entegrasyon Düzeltmeleri ve Test Altyapı Senkronizasyonu:** `e054247`, `a3e0355`, `ad64a27`, `a9a5216`, `889befe`, `9b7e48a`.

## 2. Doğrulama ve Sistem Durumu

11 Kasım 2026 itibarıyla sistemin tüm bileşenleri en katı standartlarda doğrulanmıştır:
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
