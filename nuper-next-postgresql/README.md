# Nuper - Girişimciler ve Yatırımcılar İçin Platform

Türkçe dilinde geliştirilmiş, girişimciler ve yatırımcıları buluşturan modern bir platform.

## Özellikler

- 👤 Kullanıcı Kaydı ve Girişi (Email + Google OAuth)
- 📧 Email Doğrulama Sistemi
- 🎫 Etkinlik Yönetimi
- 📢 Duyuru/Bülten Sistemi
- 💼 Proje Paylaşımı
- 👨‍💼 Admin Yönetim Paneli

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL + Prisma 5
- **Auth:** NextAuth.js (Google + Credentials)
- **Email:** Nodemailer (Gmail)
- **Notifications:** Sonner
- **Animations:** Framer Motion
- **Rich Text:** EditorJS

## Kurulum Talimatları

### 1. Reposu Klonlayın

```bash
git clone <repository-url>
cd nuper-next-postgresql
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyerek aşağıdaki bilgileri doldurun:

| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | PostgreSQL bağlantı stringi |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` komutu ile oluşturun |
| `GOOGLE_ID` | Google Cloud Console'dan alın |
| `GOOGLE_SECRET` | Google Cloud Console'dan alın |
| `GMAIL_USER` | Gmail adresiniz |
| `GMAIL_PASS` | Gmail App Password |
| `IMGBB_API_KEY` | IMGBB API Key |

### 4. Veritabanı Migrasyonlarını Çalıştırın

```bash
npx prisma migrate dev
```

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

### 6. Tarayıcıda Açın

[http://localhost:3000](http://localhost:3000) adresine gidin.

## Admin Paneli

Admin paneline erişmek için:

1. Normal kullanıcı olarak kayıt olun
2. Admin hesabına rol ataması yapın (veritabanından)
3. [http://localhost:3000/admin/login](http://localhost:3000/admin/login) adresinden giriş yapın

## Proje Yapısı

```
src/
├── app/
│   ├── (public)/        # Kullanıcı sayfaları
│   ├── (admin)/         # Admin sayfaları
│   ├── api/             # API rotaları
│   └── layout.tsx       # Root layout
├── actions/             # Server Actions
├── components/
│   ├── ui/              # shadcn/ui bileşenleri
│   └── admin/           # Admin bileşenleri
├── lib/                 # Yardımcı fonksiyonlar
├── context/             # React Context'ler
└── types/               # TypeScript tipleri
```

## Ortam Değişkenleri Referansı

### Database
- `DATABASE_URL` - Prisma PostgreSQL bağlantı stringi
- `DIRECT_URL` - Direct connection string (opsyonel)

### NextAuth
- `NEXTAUTH_URL` - Uygulama URL'si
- `NEXTAUTH_SECRET` - Oturum şifreleme anahtarı

### Google OAuth
- `GOOGLE_ID` - Google OAuth Client ID
- `GOOGLE_SECRET` - Google OAuth Client Secret

### Email (Gmail)
- `GMAIL_USER` - Gönderen email adresi
- `GMAIL_PASS` - App Password

### Image Upload
- `IMGBB_API_KEY` - IMGBB API Key

## Lisans

MIT
