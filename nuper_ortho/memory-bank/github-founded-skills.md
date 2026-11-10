# Nuper Ortho — GitHub'da Keşfedilen Beceriler ve Standartlar (github-founded-skills)

> **Kalıcı Kural:** Kullanıcı herhangi bir oturumda bir GitHub repo linki paylaşıp *"bunu ekle"*, *"bunu da kaydet"* veya benzeri bir talepte bulunduğunda, bu repo doğrudan bu dosyaya (`memory-bank/github-founded-skills.md`) yeni bir madde olarak özet, felsefe ve Nuper Ortho entegrasyon bağlamıyla kaydedilir.

---

## 1. Kayıtlı Beceriler ve Referans Repolar

### 1. `obra/superpowers`
* **URL:** https://github.com/obra/superpowers
* **Geliştirici:** Jesse Vincent (`obra`)
* **Temel Felsefe ve Amaç:** AI kodlama ajanlarına (Claude Code, Cursor, Codex vb.) aceleci ve rastgele kod yazmak yerine, kıdemli bir yazılım mühendisi gibi disiplinli bir Yazılım Geliştirme Yaşam Döngüsü (SDLC) uygulatan agentic metodoloji kütüphanesidir.
* **7 Aşamalı Metodoloji:**
  1. *Brainstorming & Design:* Kod yazmadan önce tasarım ve gereksinimleri netleştirme.
  2. *Git Worktree Setup:* Temiz ve izole çalışma ortamı oluşturma.
  3. *Planning:* Görevi atomik adımlara bölme.
  4. *Execution:* Plan doğrultusunda odaklı geliştirme.
  5. *Test-Driven Development (TDD):* Önce başarısız test, ardından minimal yeşil kod ve refaktör.
  6. *Code Review:* Kendi yazdığı kodu bağımsız gözle denetleme.
  7. *Branch Finishing & Cleanup:* Temiz birleştirme ve artık temizliği.
* **Nuper Ortho ile İlişkisi:** Projede uygulanan atomik faz geliştirme, izole worktree mantığı ve her modül değişikliğinde TDD doğrulama standardının temel referansıdır.

---

### 2. `Graphify-Labs/graphify`
* **URL:** https://github.com/Graphify-Labs/graphify
* **Geliştirici:** Graphify-Labs
* **Temel Felsefe ve Amaç:** Kod tabanlarını, SQL şemalarını, mimari dokümanları, konfigürasyonları ve PDF'leri ağır vektör veritabanlarına (RAG) ihtiyaç duymadan, deterministik yerel AST ayrıştırıcılar (`tree-sitter`) aracılığıyla tam sorgulanabilir bir yerel Bilgi Grafiğine (Knowledge Graph) dönüştüren araç ve agent skill'idir.
* **Öne Çıkan Özellikler:**
  - Vektör embedding bağımlılığı yoktur; doğrudan deterministik AST grafiği çıkarır.
  - Model Context Protocol (MCP) üzerinden AI ajanlarına tek komutla (`/graphify`) kod mimarisinin bağlantılarını sunar.
  - Kod, şema ve dökümantasyon arasındaki uçtan uca ilişki haritasını çıkarır.
* **Nuper Ortho ile İlişkisi:** B-Rep STEP topolojisi, IPC sözleşmeleri (`schemas/*.json`) ve UI/Rust/Python çekirdekleri arasındaki ilişkilerin ve etki analizlerinin (impact analysis) haritalanmasında referans modeldir.

---

### 3. `juliusbrussee/caveman`
* **URL:** https://github.com/juliusbrussee/caveman
* **Geliştirici:** Julius Brussee
* **Temel Felsefe ve Amaç:** AI kodlama ajanlarının çıktı token tüketimini ve gereksiz laf kalabalığını %65+ oranında düşüren, kontrollü dil kurallarına (ASD-STE100 benzeri) dayalı ultra-kompakt iletişim protokolüdür.
* **Öne Çıkan Özellikler:**
  - *Sıfır Nezaket / Sıfır Dolgu:* "Tabii ki", "Harika bir fikir", "Umarım yardımcı olmuştur" gibi AI tiyatrosunu tamamen eler.
  - *Mutlak Teknik Doğruluk:* Kod blokları, dosya yolları, hata mesajları ve değişken isimleri kesinlikle kısaltılmaz; byte-byte tam doğrulukta kalır.
  - *Güvenlik Kalkanı:* Güvenlik uyarısı, geri döndürülemez bir işlem veya kritik bir çelişki olduğunda protokolü durdurup tam cümlelerle net alarm verir.
* **Nuper Ortho ile İlişkisi:** `AGENTS.md` ve `.agents/rules/agent-behavior.md` içinde yer alan **"Direkt İletişim ve Düşük Bilişsel Yük (ADHD-Friendly Standardı)"** kuralının kaynağıdır.

---

### 4. `DietrichGebert/ponytail`
* **URL:** https://github.com/DietrichGebert/ponytail/tree/main
* **Geliştirici:** Dietrich Gebert
* **Temel Felsefe ve Amaç:** *"En iyi kod hiç yazılmamış koddur."* Ajanın "odadaki en tembel kıdemli mühendis" gibi düşünmesini sağlayarak erken soyutlamayı (over-engineering), gereksiz sarmalayıcıları (wrappers) ve farazi esneklikleri engelleyen katı YAGNI kural setidir.
* **Öne Çıkan Özellikler:**
  - *Minimal Kod Değişikliği:* İstenen işi yapan en kısa ve en yalın kod yazılır.
  - *Standart Kütüphane Önceliği:* Dış bağımlılık eklemek yasaktır; yerel dil araçları kullanılır.
  - *Şeffaf Hesap Verebilirlik (Accountability):* Atlanan, test edilmeyen veya farazi kalan hususlar tek satırda şeffafça kullanıcıya bildirilir.
* **Nuper Ortho ile İlişkisi:** `AGENTS.md` Madde 5 ve `.agents/rules/agent-behavior.md` Madde 2'de tanımlı kurumsal **Ponytail Standardı**'nın doğrudan kaynağıdır.

---

### 5. `multica-ai/andrej-karpathy-skills`
* **URL:** https://github.com/multica-ai/andrej-karpathy-skills
* **Geliştirici:** multica-ai (Andrej Karpathy'nin gözlemlerinden derlenmiştir)
* **Temel Felsefe ve Amaç:** Büyük Dil Modellerinin (LLM) yazılım geliştirme sırasında en sık düştüğü 4 temel ölümcül tuzağı engelleyen davranış kalkanları kütüphanesidir.
* **4 Temel Koruma İlkesi:**
  1. *Sessiz Varsayımları Engelleme (No Silent Assumptions):* Gereksinim belirsizse tahmin yürütme; kullanıcıya doğrudan sor.
  2. *Aşırı Mühendisliği Önleme (No Speculative Over-engineering):* Yalnızca mevcut gereksinimi karşıla; spekülatif mimari katmanlar ekleme.
  3. *Yan Etki / Yan Hasar Önleme (No Collateral Damage):* İlgisiz modülleri, testleri veya çalışan kodları değiştirme.
  4. *Açık Başarı Kriteri (Clear Success Criteria):* Doğrulama döngüsü olmadan işi bitti sayma.
* **Nuper Ortho ile İlişkisi:** Nuper Ortho'nun **Sıfır Uydurma İlkesi (No-Fabrication Invariant)**, atomik modül sınırlaması (tek görevde maks 3 dosya) ve her adımda tip/test doğrulama kapılarının felsefi temelidir.
