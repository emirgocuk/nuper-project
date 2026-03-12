# Tech Context

## Technologies Used
| Katman | Teknoloji |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Dil** | TypeScript (strict mod) |
| **Stil** | Tailwind CSS v4 + shadcn/ui (Radix UI tabanlı) |
| **Animasyon** | Framer Motion |
| **Veritabanı** | PostgreSQL + Prisma ORM v5 |
| **Auth** | NextAuth.js v5 beta (Google OAuth + Credentials + Prisma Adapter) |
| **E-posta** | Nodemailer (Gmail) / Resend |
| **Bildirim** | Sonner |
| **Rich Text** | EditorJS |
| **Grafik** | Recharts (Admin Dashboard & Radar Chart) |
| **OG İmaj** | @vercel/og (Profil ve proje linkleri için dinamik sosyal medya kartları) |
| **Uluslararasılaştırma** | next-intl (Faz 20'de devreye girer) |

## Yeni Eklenecek Teknolojiler (İlerleyen Fazlar)
| Faz | Teknoloji | Kullanım |
|---|---|---|
| Faz 6 | S3 / IMGBB | Girişimci Video Pitch yükleme |
| Faz 11 | Özel Prisma Sorgusu | Tag kesişim Match Algoritması |
| Faz 13 | SWR veya TanStack Query | Infinite Scroll Showcase Feed |
| Faz 14 | Prisma Polling / WebSocket (isteğe bağlı) | Mesajlaşma MVP |
| Faz 18 | Upstash Redis | API Rate Limiting + ISR Caching |

## Geliştirme Ortamı
- Node.js + npm
- `.env` — DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_ID, GOOGLE_SECRET, GMAIL_USER, GMAIL_PASS, IMGBB_API_KEY
- `npx prisma generate` — Her şema değişikliğinden sonra çalıştırılmalı
- `npm run dev` — Geliştirme sunucusu (localhost:3000)

## Teknik Kısıtlamalar
- NextAuth `PrismaAdapter` tip tanımı genişletme gerektiriyor (`types/next-auth.d.ts`).
- `Event.date` alanı `String?` olarak tutulmuş; form validasyonuyla uyuşmazlık yaratıyor; `DateTime`'a geçiş planlanıyor.
- Video Upload: IMGBB video desteklemez — S3/Cloudflare R2 değerlendiriliyor.
