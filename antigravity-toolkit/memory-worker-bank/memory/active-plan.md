# 🚀 NUPER ELITE - DETAYLI MASTER ROADMAP (Faz 1 - Faz 20)

Bu doküman, projenin "Nuper Elite" premium ekosistemine dönüşmesini sağlayacak 20 fazın sadece başlıklarını değil, **nasıl ve hangi teknolojilerle (Nasıl Olacağı)** inşa edileceğini adım adım açıklar.

---

## BÖLÜM 1: TEMELLER VE TEKNİK BORÇLAR (FOUNDATION)
*Bu bölüm sistemin üzerine inşa edileceği sağlam, hatasız ve güvenli zemini hazırlar.*

### Faz 1: Çekirdek Hataların Giderilmesi (Core Fixes)
- [x] **NextAuth Tip Düzeltmeleri (`auth.ts`):** 
  - *Nasıl*: `types/next-auth.d.ts` genişletildi. Tüm `as any` kaçışları kaldırıldı. `isAdminLogin` typed credential oldu.
- [x] **Prisma Schema Uyuşmazlığı:** 
  - *Nasıl*: `Event.date` → `DateTime?`. `directUrl` eklenerek `npx prisma db push` Supabase'e uygulandı.
- [x] **Admin Routing Güvenliği:** 
  - *Nasıl*: `src/middleware.ts` oluşturuldu. ADMIN rol kontrolü, `isVerified` yönlendirmesi ve anonim kullanıcı koruması eklendi. `npm run build` başarılı.

### Faz 2: Sistem Altyapısı ve Loglama
- [x] **Kapsamlı Hata Loglama:** 
  - *Nasıl*: `src/lib/logger.ts` tamamen yeniden yazıldı. JSON formatlı, typed `LogMeta`, Error name/message/stack serializasyonu, `debug` production'da sessiz. `auth.ts`'e entegre edildi.
- [x] **Ortam Değişkenleri:** 
  - *Nasıl*: `.env.example` bölüm bölüm belgelendi: `DIRECT_URL` (migration), gelecek Faz 6 R2 değişkenleri, Faz 18 Upstash değişkenleri eklendi.

---

## BÖLÜM 2: TASARIM SİSTEMİ VE MVP ARAYÜZ (ELITE BRAND)
*Vizyondaki "Premium/Glassmorphism" ruhunu üfler.*

### Faz 3: Elite Design System Kurulumu
- [ ] **Tailwind Konfigürasyonu:** 
  - *Nasıl*: `tailwind.config.ts` içinde `colors` genişletilecek. Koyu lacivert (Dark Blue/Navy) arka planlar, neon turkuaz/mavi vurgular (`nuper-neon`) eklenecek.
- [ ] **Glassmorphism:** 
  - *Nasıl*: `bg-white/10 backdrop-blur-md border border-white/20` standartları içeren özel utility class'lar (örn: `.glass-card`) olarak `globals.css` içerisine `@[layer](components)` altında eklenecek.
- [ ] **Tipografi:** 
  - *Nasıl*: `next/font/google` üzerinden `Space_Grotesk` başlıklar (Heading) için, `Inter` ise gövde metinleri için yüklenecek ve Tailwind konfigürasyonuna default olarak atanacak.

### Faz 4: Animasyon Kütüphanesi (Framer Motion)
- [ ] **Global Wrappers:** 
  - *Nasıl*: `src/components/animations/` altında `FadeIn.tsx` ve `SlideUp.tsx` Client Component'ları oluşturulacak. Ekrandaki her listeleme ve kart çıkışı bu framework'e sarılacak.
- [ ] **Tilt ve Magnetic:** 
  - *Nasıl*: `framer-motion`'ın `useMouse` kancası (hook) yardımıyla butonlar mouse'a doğru hafif çekilecek (magnetic). Proje ve Etkinlik kartları üzerine gelindiğinde hafifçe üç boyutlu dönmesi sağlanacak (3D Tilt).

### Faz 5: Landing Page (Açılış Sayfası) Revizyonu
- [ ] **Deep Space Hero:** 
  - *Nasıl*: Koyu arka plan üzerinde yavaş hareket eden CSS tabanlı yıldız partikülleri veya bulanık (glow) gradient dairelerle premium bir karşılama ekranı kodlanacak.
- [ ] **Scroll Animasyonları:** 
  - *Nasıl*: Ana sayfadaki özellik/nasıl çalışır bileşenleri `framer-motion`'ın `useScroll` ve `whileInView` propları kullanılarak aşağı inildikçe şık bir şekilde belirecek.

---

## BÖLÜM 3: KİŞİSELLEŞTİRME VE PROFİLLEŞTİRME (PERSONALIZATION)
*Kullanıcıların platformda değer hissedeceği yetenek akışları.*

### Faz 6: Görsel Onboarding (Çok Adımlı Kayıt) ve 1 Dakikalık Elevator Pitch
- [ ] **Stepped Form:** 
  - *Nasıl*: Standart login formları yerine, kayıt sonrası araya giren Next.js rotası oluşturulacak (`/onboarding`). 1. Adım: Rol seçimi (Yatırımcı/Girişimci). 2. Adım: Yetenek tagleri girilmesi. Hepsi `react-hook-form` ve `zod` ile çok aşamalı (Multi-step) tek bir durum (state) içinde tutulup veritabanında `profileData` alanına yazılacak.
- [ ] **1-Dakikalık Video Pitch:** 
  - *Nasıl*: Girişimcilerden projelerini kısaca anlatan maksimum 60 saniyelik bir `mp4` videosunu veya formunu yüklemeleri istenecek, bu medya daha sonra ana sayfa Shorts/Reels akışında kullanılacak.

### Faz 7: Nuper Profile Card (Profil Vitrinleri)
- [ ] **Açık URL:** 
  - *Nasıl*: Next.js Dynamic Routing (`src/app/u/[username]/page.tsx`) kurularak dışarıya açık profil sayfaları üretilecek.
- [ ] **Glassmorphic Tasarım:** 
  - *Nasıl*: Kullanıcı verileri (sosyal linkler, kapak fotoğrafı) Faz 3'teki `.glass-card` CSS stilleri ile şık bir vitrindeki gibi gösterilecek.

### Faz 8: Yetenek ve Başarı Bildirimi
- [ ] **Radar Chart:** 
  - *Nasıl*: `recharts` veya `chart.js` (React sarmalayıcısıyla) entegre edilerek `profileData` içinde tutulan yeteneklere grafiksel görünüm kazandırılacak.
- [ ] **Zaman Çizelgesi (Timeline):** 
  - *Nasıl*: `Project` tablosundaki yaratılan/bitirilen projeler ve `Event` katılımları zaman damgasına (timestamp) göre sıralanıp dikey bir CSS çizgisi üzerinde noktalı animasyonlarla listelenecek.

---

## BÖLÜM 4: GÜVEN VE EKOSİSTEM (TRUST & MATCHING)
*Platformu kapalı ve güvenilir yapan özellikler.*

### Faz 9: Doğrulama Sistemi Altyapısı (Verification)
- [ ] **Zorunlu Onay:** 
  - *Nasıl*: Kullanıcı login olsa bile, eğer veritabanında `isVerified` false ise, tüm rotalardan (middleware.ts aracılığıyla) `/verify-email` bekleme sayfasına atılacak. Sadece Nodemailer ile atılan token Prisma üzerinden doğrulandıktan sonra platforma alınacak.

### Faz 10: Elite Rozet (Badge) Sistemi
- [ ] **Görsel Rozetler:** 
  - *Nasıl*: Profil modeline JSON türünde `badges` listesi (veya ayrı bir `Badge` tablosu relation'ı) eklenecek. Bunlar UI tarafında parlak SVG ikonları olarak (`Verified Investor`, `Approved Project`) kullanıcı adının yanında belirecek. Tooltip (`shadcn/Tooltip`) ile ne anlama geldikleri açıklanacak.

### Faz 11: Nuper Match (Akıllı Eşleşme) Feed'i
- [ ] **Filtreli Ana Ekran:** 
  - *Nasıl*: Kullanıcı `dashboard`'a girdiğinde Backend/Prisma'da özel bir sorgu dönecek. Eğer kullanıcı "Yatırımcı" rolündeyse "SUBMITTED" statüsündeki ve kendi yetenek/ilgi alanlarına %50 ve üzeri eşleşen "Projeleri" listeleyecek algoritma yazılacak (Basit etiket/tag kesişim algoritması = `intersect(user.tags, project.tags)`).

---

## BÖLÜM 5: İÇERİK VE TOPLULUK (CONTENT & COMMUNITY)
*Etkileşimin kalbi.*

### Faz 12: Premium Etkinlik (Event) Yönetimi
- [ ] **Özel Event Logic:** 
  - *Nasıl*: `Event` Prisma modeline `isInviteOnly` veya `trustLevelRequired` (Int) alanları eklenecek. Rota seviyesinde (`/events/[slug]`) kullanıcının `TrustLevel`'ı yetmiyorsa "Bilet/Kayıt" butonu grileşecek (Disabled) ve Elite kilit simgesi konulacak.

### Faz 13: Startup / Proje Pazarı (Video Showcase & Data Room)
- [ ] **Video First Proje Dizinleme (Shorts Akışı):** 
  - *Nasıl*: Ana sayfada şık bir Infinite Scroll dizini yapılacak. Projeler, Girişimcilerin Faz 6'da yüklediği "1 Dakikalık Video Pitch" formatıyla sıralanacak.
- [ ] **Gizli Veri Odası (Data Room):** 
  - *Nasıl*: Sadece "Verified Investor" onayına sahip kullanıcılar ve Girişimcinin erişim izni verdiği (`grantAccess(projectId, investorId)`) kişiler, projenin iç detayına (Finansallar, Pitch Deck PDF'i) ulaşabilecek. Aksi takdirde sadece "Elevator Pitch" videosu gözükecek.

### Faz 14: Mesajlaşma MVP (Tinder for Startups) & Syndicate (Ortak Yatırım) Modülü
- [ ] **Double Opt-in (Çift Onaylı) Mesajlaşma:** 
  - *Nasıl*: Veritabanına `Match(userId, projectId, status: 'PENDING'|'ACCEPTED')` ve `Message` tabloları eklenecek. Yatırımcıların gelen kutusunun spam ile dolmaması için, yatırımcı projeyi sağa kaydırdığında (Beğendiğinde) ve girişimci de yatırımcının ilgisini "Accept" ettiğinde mesajlaşma kanalı açılacak.
- [ ] **Syndicate (Ortak Yatırım Birlikteliği):** 
  - *Nasıl*: Sistemde "Lead Investor" (Lider Yatırımcı) rolündekiler, Data Room'da inandıkları projelere `SyndicatePool` başlatabilecek. Küçük onaylı yatırımcılar bu havuza katılarak yatırım sepetine ortak (co-invest) olabilecek.
  
---

## BÖLÜM 6: BÜYÜME VE ANALİTİK (GROWTH & ANALYTICS)
*Prestiji ve platform trafiğini ölçümleme.*

### Faz 15: Liderlik ve İtibar Skoru (Reputation)
- [ ] **Aksiyon Odaklı Puan:** 
  - *Nasıl*: Profil modelinde `reputationScore` alanı (Int) açılacak. Platformda her etkinlik katılımında (+10), eklenen projelerde (+50) server-side hesaplama yapılıp bu puan güncellenecek. `src/app/leaderboard` sayfasında en yüksek skorlar `ORDER BY reputationScore DESC` ile ilk 10'da listelenecek.

### Faz 16: Dinamik Sosyal Paylaşım Açık Grafiği (OG Images)
- [ ] **@vercel/og ile İmaj Üretimi:** 
  - *Nasıl*: `src/app/api/og/route.tsx` yazılarak, profil (örneğin `/u/emir`) veya proje linkleri Twitter/Linkedin'de paylaşıldığında otomatik olarak o adresteki kişinin adını, seviyesini ve Glassmorphism kart arkaplanını içeren PNG çıktısı dinamik olarak basılacak.

### Faz 17: Gelişmiş Admin Dashboard
- [ ] **Metrik ve Onay Kontrolü:** 
  - *Nasıl*: Admin panel (`/admin/dashboard`) Recharts kullanılarak günlük yeni kullanıcı sayısını, sistemde aktif olan proje (Startup) grafiğini çizecek. Ayrıca Datatable (shadcn) kullanılarak onay bekleyen Projeleri "Approve/Reject" etme butonları (Prisma `update` Mutation) eklenecek.

---

## BÖLÜM 7: ÜRETİM, OPTİMİZASYON VE LANSMAN (PRODUCTION)
*Dünya standartlarında performans ve güvence.*

### Faz 18: Veritabanı ve Performans İstekleri
- [ ] **Rate Limiting & Caching:** 
  - *Nasıl*: Upstash/Redis ekosistemi veya `next/cache` kullanılarak, herkesin gördüğü Etkinlik (Event) ve Ana sayfa projeleri ISR (`revalidate: 60` vb.) üzerinden sunulacak. Böylece veritabanı yorulmayacak. API endpointlerinde ardışık 1 dakikada 50'den fazla istek atan IP engellenecek (`Next.js Middleware Layer`).

### Faz 19: Güvenlik Sıkılaştırma (Security Hardening)
- [ ] **Endpoint Güvencesi:** 
  - *Nasıl*: Tüm Server Actions içeriğinde "kullanıcı kendi ID'si üzerinden mi istek atıyor" kontrolü katılaştırılacak. Başkasının mesajlarını okuma riskleri kapatılacak. Veritabanı `DIRECT_URL` IP izolasyonuyla kapatılacak.

### Faz 20: Global Lansman (Internationalization)
- [ ] **Büyük Çıkış (i18n):** 
  - *Nasıl*: Elite yapının İngilizce dilinde de hizmet verebilmesi için `next-intl` kütüphanesi kurulacak. Metinler JSON dosyalarından (`/messages/en.json`, `/messages/tr.json`) çekilir hale getirilecek. Tüm URL yapıları locale (Dil) yapısına göre (`/en/dashboard`, `/tr/dashboard`) yönlendirilecek ve prod deploy'u geçilecek.
