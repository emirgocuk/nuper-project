# Active Context: Nuper Industries İnovasyon Portalı

## Şu Anki Odak
- **Obsidian Vault & Yaratıcılık Manifestosu (Tamamlandı):** `memory-bank` dizini tam teşekküllü bir Obsidian Vault'a dönüştürüldü. Onur Yanık'ın *Yaratıcılık* kitabı eksiksiz olarak `[[Kitap - Yaratıcılık - Onur Yanık]]` formatında sisteme işlendi ve bu ilkeleri savunma/mühendislik kültürüne entegre eden `[[Nuper Marka Rehberi ve Yaratıcılık Manifestosu]]` ile `[[00 - Nuper İkinci Beyin & Vault İndeksi]]` oluşturuldu.
- **İkinci Beyin & Geri Besleme Döngüsü (Faz 3):** AI analizlerini kurucunun zihinsel süzgeciyle hizalayacak olan "Human-in-the-Loop" (insan geri bildirim) katmanının tasarlanması. Düzeltme formları ve `userScore`/`userNotes` alanlarının veritabanı/UI entegrasyonu.
- **On-Demand Kaynakça Analizörü (Tamamlandı):** AI otomatik cron analizleri kapatılarak sıfır maliyete düşürüldü. AI analizleri sadece talep üzerine (on-demand) teknik literatür ve akademik dökümantasyon (arXiv, GitHub) odaklı çalıştırılıyor.

## Son Değişiklikler
1. **Obsidian Vault Entegrasyonu:** `.obsidian/app.json` ayarları tanımlandı, tüm hafıza çift yönlü wikilink bağlantılarıyla haritalandırıldı.
2. **Yaratıcılık Kitabı Eksiksiz Markdown Dönüşümü:** Kitaptaki tüm teoriler (Wallas, Harris, Hadamard, Torrance, De Bono, Bentley, Rawlinson, Hürel, Asher), tablolar, 12 zihin egzersizi, 9 kutu ve kaynakça eksiksiz `[[Kitap - Yaratıcılık - Onur Yanık]]` dosyasına aktarıldı.
3. **Nuper Marka Rehberi & Yaratıcılık Manifestosu:** YC/Savunma sanayii odaklı mühendislik vizyonu, çift beyin mimarisi, 9 kutu kalkanı, 17 yasaklı düş katili söz ve görsel tasarım sistemi `[[Nuper Marka Rehberi ve Yaratıcılık Manifestosu]]` belgesiyle tescillendi.
4. **İkinci Beyin Strateji Belgesi:** `memory-bank/innovationEnginePlan.md` güncellenerek gürültü eleme, pgvector, insan geri bildirim döngüsü ve otomasyon planları mimariye işlendi.

## Aktif Kararlar & Tercihler
- **Trigger.dev & pgvector Ertelendi:** Maliyet, API bağımlılığı ve yerel limitler sebebiyle pgvector (vektörel hafıza) ve Trigger.dev entegrasyonları sonraki fazlara ertelendi. Şu aşamada on-demand ve standart PostgreSQL aramaları ile sıfır bütçeli ilerleniyor.
- **İnsan Geri Bildirimi:** Gelecekte kendi modelimizi eğitecek altın veri setini oluşturmak için `TrendFeed` tablosuna kurucu düzeltme alanları (`userScore`, `userNotes`, `status`) eklenmesine karar verildi.

## Sonraki Adımlar
1. `TrendFeed` tablosuna feedback sütunlarının eklenmesi (`prisma db push` & `generate`).
2. `TrendsClient.tsx` üzerine "Kurucu Kararı & Düzeltme Formu" arayüzünün yazılması.

