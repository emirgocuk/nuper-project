# NUPER ORTHO — AI AGENT PROTOKOLÜ (AGENTS.MD)

Tüm AI ajanları (Antigravity, Cursor, Claude, Copilot vb.) bu depoda kod yazarken veya değişiklik yaparken aşağıdaki kurumsal kurallara istisnasız uymak zorundadır:

## 1. ATOMİK MODÜL KURALI
- Tek bir görevde / istemde en fazla 3 bağımsız modül dosyasını değiştirebilirsin.
- Yeni bir algoritma veya iş mantığı eklerken var olan dosyayı şişirme; `ui/src/modules/<alan>/utils/` altında bağımsız (pure) bir fonksiyon olarak yaz ve birim testini ekle, sonra ana bileşene import et.
- `ui/index.html` dosyasına yeni kod eklemek KESİNLİKLE YASAKTIR. Tüm geliştirmeler modüler `ui/src/` yapısında yapılmalıdır.

## 2. SIFIR YORUM SATIRI BIRAKMA KURALI
- Değiştirilen, geçersiz kalan veya eskiyen kod blokları ASLA yorum satırı (`//`, `/* ... */`, `#`) olarak dosyada bırakılamaz.
- Eski kodlar doğrudan silinecektir. Gerektiğinde Git versiyon geçmişi mevcuttur.

## 3. SÖZLEŞME VE IPC KURALI (SINGLE SOURCE OF TRUTH)
- Python veya Rust ile haberleşen yeni bir parametre gerektiğinde, KOD YAZMADAN ÖNCE `schemas/*.schema.json` dosyasını güncelle ve `npm run codegen` çalıştır.
- Şemada tanımlı olmayan hiçbir key-value alanını rastgele JSON payload içine ekleme.
- Tipleri asla el ile TypeScript veya Python dosyalarında tanımlama; daima merkezi şemadan türet.

## 4. HATA RAPORLAMA VE LOGGING STANDARDI
- Kod tabanına geçici `console.log` veya Python `print` bırakılamaz.
- Rust tarafında `unwrap()` ve `expect()` yasaktır (`thiserror` açık tipler kullanılır).
- UI tarafında `Error Boundary` kullanılmalı, kullanıcıya şık hata bildirimi gösterilmeli ve WebGL bağlamı `SceneCleaner` ile serbest bırakılmalıdır.

## 5. MİNİMALİZM VE YAGNI KURALI (PONYTAIL STANDARDI)
- "En iyi kod hiç yazılmamış koddur": İstenmeyen yardımcı fonksiyonlar, farazi "ileride gerekir" esneklikleri veya erken soyutlama katmanları (wrapper'lar) eklenemez.
- Standart kütüphane önceliklidir; yeni harici kütüphane eklenmez.
- En kısa ve en yalın çalışan çözüm üretilir. Atlanan/test edilmeyen kısımlar tek satırda şeffafça bildirilir.

## 6. DİREKT İLETİŞİM VE DÜŞÜK BİLİŞSEL YÜK (ADHD-FRIENDLY STANDARDI)
- Yanıtlara doğrudan sıradaki somut eylem veya birincil sonuç ile başlanır.
- Nezaket ifadeleri, gereksiz dolaylı açıklamalar ve laf kalabalığı elenir.
- Çok adımlı işler net numaralandırılır, kazanımlar ve durum ölçülebilir biçimde sunulur.

## 7. BAĞLAM VE TOKEN KORUMA (CONTEXT-MODE STANDARDI)
- Devasa terminal çıktıları, ham CMM ölçüm dosyaları (`.dmi`, `.txt`) ve yüzlerce satırlık loglar doğrudan bağlama dökülemez; filtrelenerek ve dilimlenerek okunur.

---
Detaylı mimari plan, değişmez yasalar ve standartlar için:
- Ajan Davranış ve İletişim Protokolü: [.agents/rules/agent-behavior.md](file:///.agents/rules/agent-behavior.md)
- Mimari Plan ve Değişmez Yasalar (Zorunlu): [memory-bank/architectureBlueprint.md](file:///d:/Projects/nuper-project/nuper_ortho/memory-bank/architectureBlueprint.md)
- Geliştirme Altyapı Kuralları: [memory-bank/developmentInfrastructureRules.md](file:///d:/Projects/nuper-project/nuper_ortho/memory-bank/developmentInfrastructureRules.md)
