# System Patterns

## System Architecture
- **Next.js App Router (v16):** Tüm uygulama mantığı, route gruplarıyla ayrıştırılmıştır.
  - `(public)/` — Kullanıcı arayüzleri (Landing, Showcase, Profil, Onboarding, Dashboard)
  - `(admin)/` — Yalnızca ADMIN rolü için yönetim arayüzleri (middleware ile korumalı)
  - `api/` — Sunucu API endpoint'leri (NextAuth, OG Image üretimi, Data Room erişim)
- **Server Actions:** UI mutasyonları (form submit, video yükleme, Data Room erişim izni verme) doğrudan Server Action'lardan geçer.

## Temel Veri Modelleri (Prisma Schema)
| Model | Açıklama |
|---|---|
| `User` | Rol (INVESTOR / ENTREPRENEUR / ADMIN), Trust Level, Verification Badge listesi |
| `Project` | Girişim bilgileri, video pitch URL, aşama (SEED / SERIES_A), etiketler (tags), Data Room erişim listesi |
| `DataRoomAccess` | `projectId ↔ investorId` ilişkisi, erişim durumu (REQUESTED / GRANTED / DENIED) |
| `Match` | `investorId ↔ projectId`, çift opt-in durumu (LIKED / ACCEPTED / REJECTED) |
| `Message` | Yalnızca `ACCEPTED` Match'lere bağlı güvenli mesajlaşma |
| `SyndicatePool` | Lider yatırımcı başlatır; diğerleri `SyndicateMember` olarak katılır |
| `Event` | Etkinlikler, inviteOnly modu, TrustLevel gereksinimi |
| `Badge` | JSON veya ayrı tablo; Verified Investor, MVP Entrepreneur vb. |

## Kritik Tasarım Kararları
- **Video Önce:** Proje detay sayfasında ilk yüklenen içerik her zaman yatırımcıyı 60 saniye içinde yakalayan pitch videosudur.
- **Double Opt-in Zorunluluğu:** Hiçbir kullanıcı karşı tarafın onayı olmadan mesaj gönderemez; bu işlevsizliği `Match.status` veritabanı alanı yönetir.
- **Data Room Erişim Kapısı:** `DataRoomAccess` tablosundaki istek → onay → erişim akışı, projenin hassas verilerini korur.
- **Glassmorphism Design Token'ları:** `.glass-card`, `.glass-hover` gibi custom CSS class'lar arayüzdeki tüm kart bileşenlerinde kullanılır; tek bir yerden güncellenir.

## Bileşen İlişkileri
```
User (Investor)
  ├── Dashboard Feed → Faz 11 Match Algoritması ← Project + Tags
  ├── Swipe / Like → Match (LIKED)
  └── Accept edilirse → Message kanalı açılır 
  
User (Entrepreneur)
  ├── Onboarding → Video Pitch yükleme → Project kaydı
  ├── Data Room → Erişim talepleri yönetimi
  └── Syndicate Pool başlatma → SyndicateMember katılımları
```
