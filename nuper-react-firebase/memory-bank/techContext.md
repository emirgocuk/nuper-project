# Technical Context

## Core Stack
- **Frontend:** React (Next.js'e taşınıyor)
- **Framework:** **Next.js** (Frontend ve Backend API katmanını birleştirmek için seçildi.)
- **Styling:** Tailwind CSS (with `@tailwindcss/typography` plugin for content rendering)
- **Database:** **PostgreSQL** (Veri bütünlüğü, ilişkisel tutarlılık ve ölçeklenebilirlik için seçildi.)
- **ORM:** **Prisma/Knex.js** (PostgreSQL ile Node.js arasındaki iletişimi yönetmek için önerilir.)
- **Auth/Backend:** **JWT/NextAuth** (Firebase Auth yerine geçecektir.)
- **Image Editor:** `react-easy-crop` and custom `getCroppedImg.js` utility
- **Content Editor:** EditorJS (Artırılmış yeteneklerle birlikte `AdminContentForm.js` ve `ProjectUploadForm.js` içinde kullanılır.)
- **3D/Visuals:** Three.js (`three`) and R3F/Drei (`@react-three/fiber`, `@react-three/drei`)

## Libraries of Note
- `framer-motion`: Used for animation
- `react-markdown` and `DOMPurify`: Used together for safe content rendering
- `react-router-dom`: **Kaldırılacak.** Next.js'in dosya tabanlı routing sistemi kullanılacaktır.

## Configuration
- Environment variables for Firebase and ImgBB are loaded via the `.env` file (e.g., `REACT_APP_IMGBB_API_KEY`)
- **Yeni Konfigürasyon:** PostgreSQL bağlantı dizgisi (connection string) ve JWT sırrı (secret) .env dosyasına eklenecektir.

## Development Environment
- Node.js v16+
- npm/yarn for package management
- VS Code with recommended extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Build & Deploy Process
1. **Development:** `npm install` ve `npm run dev` (Next.js)
2. **Production Build:** `npm run build`
3. **Deployment:** Automated deployment via Vercel/Netlify veya Self-Host (Yeni mimari ile daha kolay self-host imkanı).

## Performance Optimization
1. Next.js ile Server-Side Rendering (SSR) ve Static Site Generation (SSG) kullanımı.
2. Image optimization via ImgBB
3. Lazy loading of Three.js components

## Security Measures
1. Content sanitization with DOMPurify
2. **Yeni Güvenlik:** PostgreSQL'de veri bütünlüğü ve Next.js API'lerinde JWT tabanlı oturum yönetimi.