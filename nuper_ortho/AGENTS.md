# NUPER ORTHO — AI AGENT PROTOKOLÜ (AGENTS.MD)

Tüm AI ajanları (Antigravity, Cursor, Claude, Copilot vb.) bu depoda kod yazarken veya değişiklik yaparken aşağıdaki 4 kurumsal kurala istisnasız uymak zorundadır:

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

---
Detaylı kurallar ve mimari standartlar için: [memory-bank/developmentInfrastructureRules.md](file:///d:/Projects/nuper-project/nuper_ortho/memory-bank/developmentInfrastructureRules.md)
