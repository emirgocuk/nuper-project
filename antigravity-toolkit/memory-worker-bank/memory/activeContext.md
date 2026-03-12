# Active Context

## Current Work Focus
Proje, kapsamlı 20 Fazlık "Nuper Elite Roadmap" planlaması tamamlandı. Şu an **Faz 1: Çekirdek Hataların Giderilmesi** aşamasına geçmeye hazırız.

## Projenin Son Bilinen Durumu
- ✅ 20 Fazlık detaylı master plan oluşturuldu ve `active-plan.md`'e işlendi.
- ✅ Vizyona 4 yeni konsept dahil edildi: **Video Pitch, Data Room, Double Opt-in (Tinder for Startups), Syndicate Havuzu.**
- ✅ Tüm memory bank dosyaları (`projectbrief`, `productContext`, `systemPatterns`, `techContext`) nihai vizyona göre güncellendi.

## Bir Sonraki Adım: FAZ 1
`active-plan.md`'deki Faz 1 başlaması için yapılacaklar:
1. `types/next-auth.d.ts` → Session ve JWT arayüzleri genişletilir.
2. `auth.ts` → `as any` kaçışları, type-safe versiyonlarıyla değiştirilir.
3. `prisma/schema.prisma` → `Event.date` `DateTime`'a dönüştürülür.
4. `src/middleware.ts` → Admin rotaları ADMIN rolü kontrolüne bağlanır.

## Aktif Kararlar ve Tercihler
- Video yükleme için IMGBB yetersiz kalacağından, ileride **Cloudflare R2 veya AWS S3** değerlendirilmeli.
- Syndicate havuzu veritabanına `SyndicatePool` ve `SyndicateMember` modelleri olarak eklenmeli (Faz 14).
- Landing Page revizyonu (Faz 5), Faz 3 Design System hazır olmadan başlatılmamalı.
