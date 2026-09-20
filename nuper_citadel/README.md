# 🛡️ Nuper Citadel

> **Savunma sanayii ve ileri donanım mühendisliği için yerel (air-gapped), deterministik ve yapay zekâ destekli askeri kalifikasyon (MIL-STD-810H) ve pre-FEA simülasyon hazırlık motoru.**

---

## 📌 Obsidian Kasası ve Dokümantasyon Girişi
Bu proje, kaynak kodların temiz kalması ve Obsidian'ın kod derleme çıktılarından etkilenmemesi için tüm dokümantasyon, mimari ve **Memory Bank (Hafıza Bankası)** dosyalarını **`obsidian/`** dizini altında barındırır.

- **Obsidian Vault Yolu:** `obsidian/` *(Obsidian uygulamasında "Open folder as vault" diyerek doğrudan bu klasörü açabilirsiniz)*
- **Obsidian Ana Harita (MOC):** [`obsidian/00_Nuper_Citadel_MOC.md`](obsidian/00_Nuper_Citadel_MOC.md)
- **İnteraktif Mimari Görseli:** [`obsidian/Nuper_Citadel_Canvas.canvas`](obsidian/Nuper_Citadel_Canvas.canvas)
- **Proje Hafıza Bankası:** [`obsidian/memory-bank/`](obsidian/memory-bank/)
- **Proje Zekası ve Yönetim Kuralları:** [`AGENTS.md`](AGENTS.md)

---

## 🗂️ Kasa Dizin Yapısı (`obsidian/`)
- **`obsidian/00_Nuper_Citadel_MOC.md`**: Tüm sistemin merkezi Map of Content (MOC) gezinim panosu.
- **`obsidian/memory-bank/`**: Proje durumunu yöneten 6 çekirdek hafıza dosyası (`projectbrief`, `productContext`, `activeContext`, `systemPatterns`, `techContext`, `progress`) ve yönetim protokolü.
- **`obsidian/01 - System Architecture/`**: Tauri, OpenCASCADE CAD parser, SQLite kural motoru, FEA ön-işlemcisi, yerel LLM/DPO ve uçtan uca veri akışı.
- **`obsidian/02 - Defense Standards & Engineering/`**: MIL-STD-810H Metot 514 (Titreşim), 501/502 (Sıcaklık), 516 (Şok), resmi ETP doküman standardı ve FEA sınır şartları modelleme kılavuzu.
- **`obsidian/03 - Brainstorming & Fikir Gelistirme/`**: Projeyi derinleştirecek ve ileride tartışılacak 5 adet teknik RFC ve fikir havuzu.
- **`obsidian/.obsidian/`**: Görsel grafik (Graph View) renk paletleri ve editör ayarları.
