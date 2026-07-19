# Active Context: Nuper Industries İnovasyon Portalı

## Şu Anki Odak
- **İkinci Beyin & Geri Besleme Döngüsü (Faz 3):** AI analizlerini kurucunun zihinsel süzgeciyle hizalayacak olan "Human-in-the-Loop" (insan geri bildirim) katmanının tasarlanması. Düzeltme formları ve `userScore`/`userNotes` alanlarının veritabanı/UI entegrasyonu.
- **On-Demand Kaynakça Analizörü (Tamamlandı):** AI otomatik cron analizleri kapatılarak sıfır maliyete düşürüldü. AI analizleri sadece talep üzerine (on-demand) teknik literatür ve akademik dökümantasyon (arXiv, GitHub) odaklı çalıştırılıyor.

## Son Değişiklikler
1. **İkinci Beyin Strateji Belgesi:** `memory-bank/innovationEnginePlan.md` güncellenerek gürültü eleme, pgvector, insan geri bildirim döngüsü ve otomasyon planları mimariye işlendi.
2. **On-Demand AI ve Sıfır Cron Maliyeti:** `/api/cron/fetch-trends` rotasından otomatik AI analiz bloğu kaldırıldı. Sadece ham RSS verisi çekilip kaydediliyor.
3. **Akademik Literatür Promptları:** `src/lib/openrouter.ts` içindeki promptlar arXiv makaleleri ve GitHub repolarını (Kaynakça) saptayacak şekilde revize edildi.
4. **Keşif ve Dedektör Sayfası:** AI tarafından haberlerin içinde tespit edilen aktörleri (kişiler, kurumlar, devlet politikaları) onaylayıp doğrudan taranan kaynaklara eklemeyi sağlayan `/admin/trends/discoveries` onay ekranı kuruldu.

## Aktif Kararlar & Tercihler
- **Trigger.dev & pgvector Ertelendi:** Maliyet, API bağımlılığı ve yerel limitler sebebiyle pgvector (vektörel hafıza) ve Trigger.dev entegrasyonları sonraki fazlara ertelendi. Şu aşamada on-demand ve standart PostgreSQL aramaları ile sıfır bütçeli ilerleniyor.
- **İnsan Geri Bildirimi:** Gelecekte kendi modelimizi eğitecek altın veri setini oluşturmak için `TrendFeed` tablosuna kurucu düzeltme alanları (`userScore`, `userNotes`, `status`) eklenmesine karar verildi.

## Sonraki Adımlar
1. `TrendFeed` tablosuna feedback sütunlarının eklenmesi (`prisma db push` & `generate`).
2. `TrendsClient.tsx` üzerine "Kurucu Kararı & Düzeltme Formu" arayüzünün yazılması.

