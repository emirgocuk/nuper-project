# Technical Context

## Core Stack
- **Frontend:** React (CRA)
- **Styling:** Tailwind CSS (with `@tailwindcss/typography` plugin for markdown content)
- **Database/Auth:** Firebase (Firestore, Auth, Analytics)
- **Image Editor:** `react-easy-crop` and custom `getCroppedImg.js` utility for card image preparation
- **Content Editor:** EditorJS (used in `AdminContentForm.js`)
- **3D/Visuals:** Three.js (`three`) and React-Three-Fiber/Drei (`@react-three/fiber`, `@react-three/drei`) in `SpaceHero.js` and `SharedStarfield.js`

## Libraries of Note
- `framer-motion`: Used for animation, particularly in `About.js` and `HowItWorks.js`
- `react-markdown` and `DOMPurify`: Used together in `LegalPage.js` and content display components for safe HTML rendering
- `react-router-dom` v6 or v7: Used for routing

## Configuration
- Environment variables for Firebase and ImgBB are loaded via the `.env` file (e.g., `REACT_APP_IMGBB_API_KEY`)

## Development Environment
- Node.js v16+
- npm/yarn for package management
- VS Code with recommended extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Build & Deploy Process
1. **Development:**
   ```bash
   npm install
   npm start
   ```

2. **Production Build:**
   ```bash
   npm run build
   ```

3. **Deployment:**
   - Automated deployment via Vercel/Netlify
   - Environment variables must be configured in deployment platform

## Performance Optimization
1. Route-based code splitting
2. Image optimization via ImgBB
3. Lazy loading of Three.js components
4. Firebase offline persistence enabled

## Security Measures
1. Content sanitization with DOMPurify
2. Firebase Security Rules implementation
3. Environment variable protection
4. Rate limiting on image uploads