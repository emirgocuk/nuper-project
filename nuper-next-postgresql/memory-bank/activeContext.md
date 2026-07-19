# Active Context: Nuper Industries İnovasyon Portalı

## Şu Anki Odak
- **Altyapı Güncellemesi (Tamamlandı):** Prisma 7 (v7.8.0) sürümüne geçiş yapıldı. Next.js Edge Middleware'de derleme hatası yaşanmaması için NextAuth v5 yapılandırması `auth.config.ts` ve `auth.ts` olarak ikiye ayrıldı.
- **Sergiye Dönüşüm Faz 1 (Tamamlandı):** Proje isimlendirmeleri "NUPER INDUSTRIES" olarak güncellendi. Giriş/kayıt akışları admin odaklı kısıtlandı. Fikirler ve Projeler sayfaları veritabanı durumuna göre filtrelenerek koyu uzay temasına uyarlandı.

## Son Değişiklikler
1. **Prisma 7 & Driver Adapter Geçişi:** `schema.prisma` dosyasından `url` ve `directUrl` temizlendi. Yeni bağlantı yapısı `prisma.config.ts` dosyasına taşındı. `src/lib/db.ts` üzerinde `pg` Pool ve `@prisma/adapter-pg` kullanılarak runtime database erişimi sağlandı.
2. **NextAuth Split Yapılandırması:** Next.js Edge Middleware'in PostgreSQL ve bcrypt sürücülerine doğrudan bağımlı olmasını önlemek amacıyla `src/auth.config.ts` oluşturuldu, `src/auth.ts` ve `src/middleware.ts` bu yapıya uyarlandı.
3. **Tema Değişikliği:** Navbar, Footer, `/projects`, `/ideas` ve `/about` sayfaları `bg-[#0b1120]` arka planı, `bg-glass` cam kart tasarımları ve modern neon çerçevelerle koyu temaya uyarlandı.
4. **Kayıt Engelleme:** Ziyaretçilerin `/register` üzerinden kaydolması engellenerek otomatik olarak giriş sayfasına yönlendirilmeleri sağlandı.

## Aktif Kararlar & Tercihler
- **Prisma Modeli Kullanımı:** Yeni bir veritabanı modeli eklemek yerine, mevcut `Project` modelindeki `status` alanını `"IDEA"` olarak set ederek fikirleri; `"COMPLETED"` veya `"ONGOING"` olarak set ederek projeleri segmente etme kararı alındı. Bu sayede veritabanı şeması ve mevcut migrasyonlar korunmuş oldu.
- **Koyu Uzay Estetiği:** Tüm iç sayfaların da ana sayfadaki gibi premium uzay/teknoloji estetiğini koruması zorunlu tutulmuştur.

## Sonraki Adımlar
1. Admin panelindeki proje onaylama ve detay sayfalarının (`/admin/projects/[id]` ve `/admin/ideas/[id]`) mock yerine veritabanına bağlanacak şekilde güncellenmesi.
2. `/projects/[slug]` ve `/ideas/[slug]` şeklinde ziyaretçilere açık detaylı teknik vitrin sayfalarının yapılması.
