# Progress: Nuper Industries İnovasyon Portalı

Bu dosya, projenin mevcut geliştirme durumunu, tamamlanan özellikleri ve uzun vadeli planlamayı takip eder.

## Tamamlanan Özellikler

### Markalama & Tasarım Sistemi
- [x] Tüm sayfaların (Ana Sayfa, Projeler, Fikirler, Hakkımızda) premium koyu uzay temasına (`bg-[#0b1120]`) ve glassmorphic (cam) kart tasarım diline taşınması.
- [x] Navbar'ın "NUPER INDUSTRIES" markalaması ile güncellenmesi ve giriş/kayıt bağlantılarının genel görünümden gizlenmesi.
- [x] Footer alanının marka ve tema uyumluluğunun sağlanması.

### Veri Akışı ve Segmentasyon
- [x] Projeler (`/projects`) sayfasının `status != 'IDEA'` olan verileri çekecek şekilde veritabanı filtresinin yazılması.
- [x] Fikirler (`/ideas`) sayfasının `status == 'IDEA'` olan verileri çekecek şekilde veritabanı filtresinin yazılması.
- [x] Prisma 7.8.0 sürümüne yükseltme, `db.ts` üzerinde pg driver adapter bağlantısı ve SSL/TLS self-signed sertifika uyumluluğunun sağlanması.
- [x] Next.js Edge Middleware için NextAuth split (auth.config.ts / auth.ts) mimarisinin kurularak derleme hatalarının giderilmesi.
- [x] Supabase ücretsiz veritabanının duraklatılmasını otomatik engelleyen `/api/cron/keep-alive` endpoint ve `vercel.json` cron görevinin kurulması.

### Güvenlik ve Yetkilendirme
- [x] Ziyaretçilerin üye olmasının engellenmesi amacıyla `/register` sayfasının doğrudan `/login` adresine yönlendirilmesi.


---

## Yapılacak İşler (Roadmap)

### 1. Kısa Vadeli Hedefler (1 Hafta)
- [ ] **Fix Admin Routing:** `/admin/login` sayfasının güvenli bir şekilde `(admin)` layout'u dışına taşınması ve yönlendirme hatalarının giderilmesi.
- [ ] **TypeScript Temizliği:** NextAuth ve Prisma için `@ts-ignore` içeren dosyaların temizlenmesi ve tip güvenliğinin tam sağlanması.
- [ ] **Proje/Fikir Detay Sayfaları:** Her proje ve fikir için dinamik slug tabanlı (`/projects/[slug]` ve `/ideas/[slug]`) sayfaların yazılması ve EditorJS içeriklerinin render edilmesi.

### 2. Orta Vadeli Hedefler (2-3 Hafta)
- [ ] **Medya Sunucu Entegrasyonu:** Proje ve bülten kartları için admin panelinden resim yüklemeyi sağlayan ImageBB API entegrasyonunun aktif edilmesi.
- [ ] **İnteraktif Proje Filtreleme:** Projeler ve fikirler arasında etiket bazlı hızlı geçişler ve Framer Motion ile akışkan animasyonlar.

### 3. Uzun Vadeli Sergi & İnovasyon Planları
- [ ] **Ar-Ge Günlükleri (Devlogs):** Fikirlerin fikir aşamasından lansmana kadar olan süreçlerini gösteren interaktif bir zaman tüneli (timeline) bileşeni.
- [ ] **İnteraktif 3D Sergi Odası:** Three.js / Canvas teknolojisi kullanılarak, projeleri sembolize eden interaktif 3D modellerin detay sayfalarında gösterilmesi.
- [ ] **Teknik Mimari Görünümü:** Her proje detayında Mermaid diyagramı desteği ile projenin veritabanı ve sunucu mimarisinin sergilendiği bir teknik sekme.
- [ ] **Özel İş Birliği Gateway'i:** Projelerle ilgilenen akredite yatırımcılar ve endüstriyel ortaklar için SMTP destekli şık bir başvuru/talep formu.
- [ ] **Dinamik Kapak Resimleri (OG Images):** `@vercel/og` kullanılarak sosyal medyada paylaşılan her proje için otomatik isimlendirilmiş kapak görselleri üretilmesi.
