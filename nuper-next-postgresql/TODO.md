# ÖNERİLER - BAŞLAMAK İÇİN ÖNCELIK SIRASI

## HEMEN (1-2 gün)
- [ ] Fix Prisma Schema Mismatch - Event model validation
- [ ] Remove @ts-ignore - Add proper type definitions
- [ ] **Fix Admin Routing - Consolidate /admin/login vs /adminlogin (TASK 1.3)**
  - Mevcut durum: `/admin/login`, `/adminlogin` (duplicate), `/(admin)/admin/*`
  - [ ] **DELETE**: `src/app/admin/` folder (entirely)
  - [ ] **DELETE**: `src/app/adminlogin/page.tsx`
  - [ ] **UPDATE**: `src/app/(admin)/layout.tsx`
    - Import `auth` and `redirect`
    - Check session: `if (!session?.user) redirect("/login")`
    - Check role: `if (session.user.role !== "ADMIN") redirect("/login?error=unauthorized")`
  - [ ] **CREATE/UPDATE**: `src/app/(admin)/admin/login/page.tsx`
    - "use client"
    - `signIn("credentials", { email, password, isAdminLogin: "true", redirect: false })`
  - [ ] **UPDATE**: `src/app/(public)/login/page.tsx`
    - Remove `isAdminLogin` flag (Standard user login only)
  - [ ] **UPDATE**: `src/auth.ts`
    - Check `isAdminLogin` flag in credentials provider.
    - If `isAdminLogin` & user not admin -> throw error.
    - If !`isAdminLogin` & user is admin -> throw error (optional/enforce separation).

## KISA TERM (1 hafta)
- [ ] **Add .env.example file (TASK 2.1)**
  - [ ] **CREATE**: `.env.example` in root with placeholders:
    - Database (URL, Direct URL)
    - NextAuth (URL, Secret)
    - Google OAuth (ID, Secret)
    - Email (Gmail User, Pass)
    - Image Upload (ImgBB API Key)
    - Node Env
  - [ ] **CHECK**: `.gitignore` (Ignore `.env`, Keep `.env.example`)
  - [ ] **UPDATE**: `README.md` with "Setup Instructions" (Clone, Install, CP .env, Migrate, Run)

- [ ] **Add error logging (TASK 2.2)**
  - [ ] **CREATE**: `src/lib/logger.ts`
    - `Logger` class: `debug`, `info`, `warn`, `error` methods.
    - Properties: `LogLevel`, `LogContext`.
    - Console output with ANSI colors (Cyan/Info, Red/Error, etc.)
    - Format: `[LEVEL] timestamp - message` + JSON metadata.
  - [ ] **UPDATE**: `src/lib/mail.ts`
    - Import `logger`.
    - Replace console usage with `logger.info`, `logger.error`.

- [ ] **Optimize database queries (TASK 2.3)**
  - [ ] **UPDATE**: `src/app/(admin)/admin/page.tsx` (Dashboard)
    - Wrap queries in `Promise.all` (Event, Bulletin, Project, User counts).
    - Add try-catch with `logger.error`.
  - [ ] **UPDATE**: `src/app/(admin)/admin/events/page.tsx`
    - Implement pagination (`PAGE_SIZE = 10`).
    - Use `Promise.all` for `findMany` and `count`.
  - [ ] **UPDATE**: `prisma/schema.prisma`
    - Add `@@index` to:
      - Event: `published`, `isFeatured`, `createdAt`
      - Project: `status`, `userId`
      - User: `email`
      - Bulletin: `published`
  - [ ] **MIGRATE**: `npx prisma migrate dev --name add_indexes`
  - [ ] **TEST**: Performance verification (Dashboard < 500ms).

- [ ] Test email verification flow end-to-end

## ORTA TERM (2-3 hafta)
- [ ] Add API rate limiting & security headers
- [ ] Write E2E tests for critical flows
- [ ] Add Sentry/error monitoring
- [ ] Document API endpoints

## UZUN TERM
- [ ] User messaging system
- [ ] Advanced search/filtering
- [ ] Performance metrics dashboard
- [ ] Mobile app (if needed)
