# System Patterns

## 1. Monorepo Structure

The project is organized within a single GitHub repository, containing two distinct applications:
- `nuper-react-firebase/`: The legacy application, preserved for reference.
- `nuper-next-postgresql/`: The new, active development project.

## 2. Full-Stack with Next.js

The application will follow a traditional full-stack pattern, but unified within the Next.js framework:
- **UI Components:** Located in `src/components/`, these will be largely shared between client and server components.
- **API Logic:** All backend and database interactions will be handled via API Routes located in `src/app/api/`.
- **Data Fetching:** Data will be fetched on the server within Server Components to improve performance and security.

## 3. Database Schema (Initial Draft)

Based on the legacy Firestore model, the PostgreSQL schema will include tables for:
- `User`
- `Project`
- `Event`
- `Bulletin`
- (Relationships like one-to-many between `User` and `Project` will be defined.)

## 4. Authentication Flow

1. User signs in via a form (Client Component).
2. Credentials are sent to a NextAuth.js API route (`/api/auth/...`).
3. The server validates credentials against the `User` table in the database.
4. Upon success, a JWT session is created and a cookie is sent back to the client.
5. Subsequent requests from the client include this cookie, allowing the server to identify the authenticated user.