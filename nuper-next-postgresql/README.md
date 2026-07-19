# Nuper Industries — Dijital Vitrin & Ar-Ge Arşivi

# Nuper Industries - İnovasyon & Ar-Ge Portalı

Nuper Industries bünyesinde geliştirilen konsept fikirlerin, Ar-Ge çalışmalarının, aktif projelerin ve teknoloji bültenlerinin sergilendiği, kurumsal vitrin ve inovasyon portalı.

## Özellikler

- 💡 **Fikir Vitrini:** Ar-Ge aşamasındaki yenilikçi fikirler ve konsept tasarımlar
- 📂 **Proje Vitrini:** Nuper Industries tarafından geliştirilen aktif veya tamamlanmış yüksek teknoloji projeleri
- 📢 **Teknoloji Bültenleri:** Lansman duyuruları, bilimsel/teknik loglar ve makaleler
- 🎫 **Lansman & Etkinlikler:** Proje sunumları ve Ar-Ge etkinliklerinin takvimi
- 🔐 **Yönetim Paneli:** Projeleri, fikirleri ve bültenleri yönetmek için kapsamlı admin arayüzü
- ✉️ **Bülten Aboneliği (Yakında):** Yeni teknoloji duyurularından anında haberdar olma sistemi

## Tech Stack

- **Framework:** Next.js 16 (App Router - Dynamic Render)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Premium Dark Space & Glassmorphic theme)
- **Database:** PostgreSQL + Prisma 5 (Supabase Cloud hosting)
- **Auth:** NextAuth.js (Admin Girişi için)
- **Email:** Nodemailer (Gmail SMTP)
- **Animations:** Framer Motion
- **Rich Text:** EditorJS (Admin İçerik Editörü)

## Kurulum

```bash
git clone <repository-url>
cd nuper-next-postgresql
npm install
cp .env.example .env.local
# .env.local dosyasını doldurun
npx prisma generate
npx prisma db push
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Ortam Değişkenleri

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | Supabase pooled connection (port 6543) |
| `DIRECT_URL` | Supabase direct connection (port 5432) — migration için |
| `AUTH_SECRET` | `openssl rand -base64 32` ile oluşturun |
| `NEXTAUTH_URL` | Uygulama URL'si |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth |
| `GMAIL_USER` / `GMAIL_PASS` | E-posta gönderimi (App Password) |
| `IMGBB_API_KEY` | Görsel yükleme |

## Proje Yapısı

```
src/
├── app/
│   ├── (public)/     # Herkese açık vitrin sayfaları
│   ├── (admin)/      # Admin paneli (middleware korumalı)
│   └── api/          # API rotaları
├── actions/          # Server Actions
├── components/       # UI bileşenleri
├── lib/              # Yardımcı fonksiyonlar
└── types/            # TypeScript tipleri
```

## Sayfa Haritası

| Rota | Açıklama |
|---|---|
| `/` | Ana sayfa — hero, nasıl çalışır, öne çıkan içerik |
| `/about` | Hakkımızda |
| `/ideas` | Ar-Ge fikirleri (status=IDEA) |
| `/projects` | Aktif/tamamlanan projeler |
| `/bulletins` | Teknoloji bültenleri |
| `/events` | Etkinlikler |
| `/admin` | Yönetim paneli (ADMIN rolü gerekli) |

## Admin Paneli

1. Admin hesabına veritabanından `role: ADMIN` atayın
2. [http://localhost:3000/admin/login](http://localhost:3000/admin/login) adresinden giriş yapın

## Dokümantasyon

Detaylı plan ve proje vizyonu için `antigravity-toolkit/memory-worker-bank/memory/` dizinine bakın.
