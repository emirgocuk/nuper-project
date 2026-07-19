# Technical Context: Nuper Industries İnovasyon Portalı

Bu belgede kullanılan teknolojiler, geliştirme ortamı ayarları ve teknik kısıtlamalar açıklanmıştır.

## Teknolojik Altyapı

- **Ana Framework:** Next.js 16.0.10 (App Router, Turbopack)
- **Programlama Dili:** TypeScript
- **Veritabanı ORM:** Prisma Client 7.8.0 (with `@prisma/adapter-pg` and `pg` driver)
- **Veritabanı Motoru:** PostgreSQL (Supabase barındırmalı bulut veritabanı, JS Driver Adapter ile)
- **Kimlik Doğrulama:** NextAuth.js (Edge-compatible split config ve Credentials Provider)
- **Tasarım & CSS:** Tailwind CSS + shadcn/ui (Radix UI)
- **Animasyonlar:** Framer Motion
- **Zengin İçerik Editörü:** EditorJS
- **Bildirimler:** Sonner (Toast mesajları)
- **E-posta Gönderimi:** Nodemailer (Gmail SMTP servis sağlayıcısı)

## Geliştirme Ortamı

### Gereksinimler
- Node.js (v18+)
- PostgreSQL veritabanı (yerel veya Supabase bulut servisi)

### Yapılandırma Dosyaları
- `prisma.config.ts`: Prisma 7 veritabanı bağlantı konfigürasyonu (şema yolu ve `DATABASE_URL` eşlemesi)
- `prisma/schema.prisma`: Veri modeli şeması (depreke olan `url` ve `directUrl` satırları kaldırılmıştır)
- `src/lib/db.ts`: `pg` Pool ve `@prisma/adapter-pg` ile ilklendirilen Prisma Client singleton'ı
- `src/auth.config.ts` ve `src/auth.ts`: Middleware üzerinde Edge Runtime uyumluluğunu sağlamak için ayrıştırılan NextAuth yapılandırması
- Kök dizindeki `.env` dosyası: Bağlantı adreslerini ve şifreleri barındırır.

## Teknik Kısıtlamalar & Kararlar

1. **Prisma Client Sürümü:** Prisma v5 sürümü kullanılmaktadır. Schema üzerinde yapılan her değişiklikten sonra `npx prisma generate` komutunun çalıştırılması zorunludur.
2. **Derleme (Build) Kararlılığı:** Projedeki statik sayfa üretimi veritabanına bağımlı olduğundan, veritabanının çevrimdışı olması durumunda build hatası yaşanıyordu. Bu durum `layout.tsx` üzerinde dynamic render (`force-dynamic`) zorlanarak çözülmüştür.
3. **Kayıt Sistemi:** Genel üye alımı kapalıdır. Yeni admin tanımlamaları manuel olarak veritabanı veya `scripts/make-admin.ts` yardımıyla yapılmalıdır.
