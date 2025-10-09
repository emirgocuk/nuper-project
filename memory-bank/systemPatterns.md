# System Patterns

## Architecture Overview
The system follows a classic **JAMstack** (JavaScript, APIs, Markup) pattern.
- **Frontend:** React SPA.
- **Backend:** Firebase (Serverless BaaS).
- **APIs:** Direct interaction with Firebase Firestore and Authentication.

## Core Component Pattern
Content management (Events and Bulletins) uses a centralized `AdminContentForm.js` component parameterized by a `type` prop (`event` or `bulletin`). This promotes code reuse.

## Image Handling Pattern
**Offloading Storage:** All primary images (Card Images, Editor Content Images) are uploaded directly to **ImgBB** (a third-party image hosting API) to avoid Firebase Storage costs. The resulting URL is stored in Firestore.

## User Data & Authorization
1. **User Role:** All new sign-ups default to a `user` role stored in Firestore.
2. **Admin Auth:** The Admin Panel explicitly checks for `role: 'admin'` before granting access.
3. **Project Data Segregation:** User project submissions are stored within a sub-collection specific to the user (`users/{uid}/projects`), logically scoping data access.

## Data Models

### Event Model
```typescript
interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: Timestamp;
    isFeatured: boolean;
    location: string;
    organizer: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
```

### Bulletin Model
```typescript
interface Bulletin {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
```

### User Model
```typescript
interface User {
    uid: string;
    email: string;
    role: 'user' | 'admin' | 'corporate';
    profile: {
        name: string;
        avatar?: string;
        organization?: string;
    };
    settings: {
        notifications: boolean;
    };
    verifiedSkills: {
        skillName: string;
        projectId: string;
        verifiedDate: Timestamp;
        badgeUrl: string;
    }[];
    innovationParticipation?: {
        challengesSubmitted: string[];
        challengesWon: string[];
    };
}
```

### InnovationChallenge Model
```typescript
interface InnovationChallenge {
    id: string;
    companyId: string;
    title: string;
    description: string;
    status: 'open' | 'review' | 'closed';
    reward: string;
    requirements: string[];
    deadline: Timestamp;
    submittedSolutions: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    visibility: 'public' | 'private';
    category: string[];
    subscriptionTier: 'basic' | 'premium' | 'enterprise';
}
```

### ProjectBadge Model
```typescript
interface ProjectBadge {
    id: string;
    projectId: string;
    userId: string;
    skills: string[];
    issueDate: Timestamp;
    verificationHash: string;
    blockchainTxId?: string;
    validationStatus: 'pending' | 'verified' | 'rejected';
    corporateEndorsements: {
        companyId: string;
        endorsementDate: Timestamp;
        comments: string;
    }[];
}
```

## Critical Implementation Paths
1. **Authentication Flow:** `AuthPage.js` → `LoginForm.js`/`RegisterForm.js` → `UserDashboard.js`
2. **Admin Content Creation:** `AdminPanel.js` → `AdminContentForm.js` → Firestore
3. **Featured Events Display:** `Events.js` → Filter by `isFeatured` → Homepage placement