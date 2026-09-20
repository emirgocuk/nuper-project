# AGENTS.md - Nuper Citadel Proje Kuralları ve Hafıza Yönetimi

## 1. Temel Varoluş ve Çalışma Prensibi
- **Proje Adı:** Nuper Citadel
- **Ana Misyon:** Savunma sanayii ve ileri donanım geliştiren ekipler için yerel (air-gapped), deterministik ve yapay zekâ destekli askeri kalifikasyon (MIL-STD-810H vb.) ve pre-FEA simülasyon hazırlık motoru.
- **Kritik Güvenlik İlkesi:** "Sıfır Bulut Bağımlılığı ve Sıfır Veri Sızıntısı". Hiçbir CAD verisi, analiz çıktısı veya telemetri dış ağa aktarılamaz. Sistem tamamen `127.0.0.1` üzerinde yerel çalışır.

---

## 2. Memory Bank (Hafıza Bankası) Protokolü
Bu proje, oturumlar arası kesintisiz bağlam sürekliliği sağlayan **Memory Bank** mimarisi ile yönetilir:
- **Konum:** Tüm hafıza bankası dosyaları **`obsidian/memory-bank/`** dizinindedir.
- **Zorunlu Adım:** Her yeni oturum başlangıcında ve kapsamlı görevlerden önce `obsidian/memory-bank/` altındaki dosyalar okunmalıdır:
  1. `projectbrief.md` (Vizyon ve hedefler)
  2. `productContext.md` (Problem tanımı ve UX)
  3. `activeContext.md` (Aktif odak ve kararlar)
  4. `systemPatterns.md` (Mimari kalıplar ve determinizm sınırı)
  5. `techContext.md` (Teknolojiler ve ortam)
  6. `progress.md` (Tamamlananlar ve yapılacaklar)
- **Güncelleme Kuralı:** Kullanıcı **"update memory bank"** veya **"hafıza bankasını güncelle"** dediğinde ya da kritik bir mimari karar alındığında tüm bu dosyalar anında güncellenir.

---

## 3. Mühendislik ve Kod Standartları
- **Determinizm vs. AI Sınırı:**
  - Kütle, CoG, montaj açıklıkları, standart PSD kırılma frekansları ve sıcaklık limitleri **KESİNLİKLE deterministik kodla** (OpenCASCADE / SQLite) çözülür.
  - LLM (Qwen/Llama), **asla sayısal toleransları veya spektrum frekanslarını tahmin etmez**; yalnızca deterministik motordan gelen JSON verisini askeri şablonlara (ETP, kabul raporu, simülasyon yönergesi) sentezler.
- **Birim Sistemi:**
  - Tüm iç veri akışında SI/mm standardı esastır:
    - Uzunluk: mm
    - Kütle: kg
    - Kuvvet: N
    - Gerilme / Basınç: MPa ($N/mm^2$)
    - Frekans: Hz
    - İvme Spektral Yoğunluğu: $g^2/\text{Hz}$
    - Sıcaklık: °C
- **Veritabanı & Tercih Kaydı (DPO):**
  - Mühendisin yaptığı her düzenleme (`prompt`, `chosen`, `rejected`) SQLite `telemetry.db` içine yerel olarak işlenir. Dışarıya telemetri gönderilmez.

---

## 4. Dokümantasyon ve Obsidian Entegrasyonu
- Tüm dokümantasyon `obsidian/` kasası altında barındırılır.
- Notlar arası bağlantılarda çift köşeli parantez `[[Not_Adi]]` formatı kullanılır.
- Kod tabanı (`src-tauri`, `frontend`, `engine`) doğrudan kök dizinde inşa edilecek, Obsidian kasası ise `obsidian/` altında izole kalacaktır.
