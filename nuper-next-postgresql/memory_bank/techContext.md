# Technology Context

This document outlines the technological shift from the legacy stack to the target stack.

## 1. Legacy Stack (`nuper-react-firebase`)

- **Frontend:** React (Create React App), Client-Side Rendering (CSR)
- **Routing:** `react-router-dom`
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Firestore, Firebase Authentication, Firebase Functions)
- **Deployment:** Vercel/Firebase Hosting

## 2. Target Stack (`nuper-next-postgresql`)

- **Framework:** Next.js (App Router)
- **Rendering:** Server-Side Rendering (SSR) and Static Site Generation (SSG) where applicable.
- **Database:** PostgreSQL
- **ORM:** Prisma (for type-safe database access)
- **Authentication:** NextAuth.js (or a similar JWT-based solution)
- **Styling:** Tailwind CSS (migrated configuration)
- **Deployment:** Vercel

## 3. Key Dependencies to Install

- `next`
- `react`, `react-dom`
- `prisma` (ORM)
- `@prisma/client` (Prisma client)
- `next-auth` (Authentication)
- `pg` (Node.js PostgreSQL driver)
- `tailwindcss` (already installed via `create-next-app`)