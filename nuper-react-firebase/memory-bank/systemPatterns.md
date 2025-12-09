# System Patterns

## Architecture Overview
The system is transitioning from **JAMstack (React SPA + Firebase BaaS)** to a **Modern Full-Stack** pattern.
- **Frontend:** Next.js (React Framework, Vercel/Self-Host uyumlu).
- **Backend/API:** Next.js API Routes (Node.js/Express benzeri)
- **Database:** **PostgreSQL** (Hassas veri bütünlüğü ve ölçeklenebilirlik için seçildi.)

## Core Component Pattern
Content management (Events and Bulletins) uses a centralized `AdminContentForm.js` component parameterized by a `type` prop (`event` or `bulletin`). This promotes code reuse.

## Image Handling Pattern
**Offloading Storage:** All primary images (Card Images, Editor Content Images) are uploaded directly to **ImgBB** (a third-party image hosting API) to avoid Firebase Storage costs. The resulting URL is stored in Firestore.

## User Data & Authorization
1. **User Role:** All new sign-ups default to a `user` role stored in Firestore.
2. **Admin Auth:** The Admin Panel explicitly checks for `role: 'admin'` before granting access.
3. **Project Data Segregation:** User project submissions are stored within a sub-collection specific to the user (`users/{uid}/projects`), logically scoping data access.

## Data Models (PostgreSQL'e Hazırlık)

### Event Model (PostgreSQL)
```typescript
interface Event {
    id: string; // Primary Key
    title: string;
    description: string;
    imageUrl: string;
    date: string; // String olarak tutulacak
    isFeatured: boolean;
    location: string;
    organizer: string;
    createdAt: Date; // Timestamp yerine Date objesi
    updatedAt: Date;
}
```

### Bulletin Model (PostgreSQL)
```typescript
interface Bulletin {
    id: string; // Primary Key
    title: string;
    // content alanı artık EditorJS'den gelen JSON (Object/Block) formatındadır
    content: object; 
    imageUrl: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}
```

### Project Model (PostgreSQL)
```typescript
interface Project {
    id: string; // Primary Key
    user_id: string; // Foreign Key (Hangi kullanıcıya ait olduğunu belirler)
    ownerEmail: string;
    projectName: string;
    // content alanı EditorJS'den gelen JSON (Object/Block) formatındadır
    content: object; 
    status: 'submitted' | 'queued' | 'under_review' | 'revision_requested' | 'approved' | 'published' | 'rejected';
    history: object[]; // Log geçmişini tutan JSON array
    submittedAt: Date;
    updatedAt: Date;
    // Diğer revizyon alanları burada tutulur
}
```

### User Model (PostgreSQL)
```typescript
interface User {
    uid: string; // Primary Key
    email: string;
    role: 'user' | 'admin';
    profile: {
        name: string;
        avatar?: string;
        dateOfBirth: string;
        city: string;
        educationLevel: string;
        linkedinUrl: string;
    };
    settings: {
        notifications: boolean;
    };
    createdAt: Date;
}
```

## Critical Implementation Paths
1. **Authentication Flow:** `AuthPage.js` → **Next.js API Routes** (JWT) → `UserDashboard.js`
2. **Admin Content Creation:** `AdminPanel.js` → `AdminContentForm.js` → **Next.js API Routes** → PostgreSQL
3. **Project Management:** `ProjectUploadForm.js` (Rich Editor) → **Next.js API Routes** → PostgreSQL
4. **Content Security:** DOMPurify, istemci tarafında render edilen zengin içerik için kritik olmaya devam etmektedir.