# project-planning
Source: https://antigravity.codes/agent-skills/workflow/project-planning

## AI Worker Instructions
When the user requests functionality related to project-planning, follow these guidelines and utilize this context.

## Scraped Content

# project-planning
```
/plan-project
```
```
/plan-feature
```
```
1. Authentication: Public tool or user accounts? Social auth? Roles?2. Data Model: Entities mentioned - relationships? (one-to-many, many-to-many)3. Key Features: Real-time? File uploads? Email? Payments? AI?4. Scope: MVP or full-featured?5. Timeline: Any constraints?
```
```
1. Authentication: Public tool or user accounts? Social auth? Roles?2. Data Model: Entities mentioned - relationships? (one-to-many, many-to-many)3. Key Features: Real-time? File uploads? Email? Payments? AI?4. Scope: MVP or full-featured?5. Timeline: Any constraints?
```
```
⚠️ Phase 4 "Complete User Management" is too large (12 files, 8-10 hours).Suggested split:- Phase 4a: User CRUD API (5 files, 4 hours)- Phase 4b: User Profile UI (6 files, 5 hours)
```
```
⚠️ Phase 4 "Complete User Management" is too large (12 files, 8-10 hours).Suggested split:- Phase 4a: User CRUD API (5 files, 4 hours)- Phase 4b: User Profile UI (6 files, 5 hours)
```
```
# Implementation Phases: [Project Name]**Project Type**: [Web App / Dashboard / API / etc]**Stack**: Cloudflare Workers + Vite + React + D1**Estimated Total**: [X hours] (~[Y minutes] human time)---## Phase 1: [Name]**Type**: [Infrastructure/Database/API/UI/Integration/Testing]**Estimated**: [X hours]**Files**: [file1.ts, file2.tsx, ...]**Tasks**:- [ ] Task 1- [ ] Task 2- [ ] Task 3- [ ] Test basic functionality**Verification Criteria**:- [ ] Specific test 1- [ ] Specific test 2- [ ] Specific test 3**Exit Criteria**: [Clear definition of when this phase is complete]---## Phase 2: [Name][... repeat structure ...]---## Notes**Testing Strategy**: [Inline per-phase / Separate testing phase / Both]**Deployment Strategy**: [Deploy per phase / Deploy at milestones / Final deploy]**Context Management**: Phases sized to fit in single session with verification
```
```
# Implementation Phases: [Project Name]**Project Type**: [Web App / Dashboard / API / etc]**Stack**: Cloudflare Workers + Vite + React + D1**Estimated Total**: [X hours] (~[Y minutes] human time)---## Phase 1: [Name]**Type**: [Infrastructure/Database/API/UI/Integration/Testing]**Estimated**: [X hours]**Files**: [file1.ts, file2.tsx, ...]**Tasks**:- [ ] Task 1- [ ] Task 2- [ ] Task 3- [ ] Test basic functionality**Verification Criteria**:- [ ] Specific test 1- [ ] Specific test 2- [ ] Specific test 3**Exit Criteria**: [Clear definition of when this phase is complete]---## Phase 2: [Name][... repeat structure ...]---## Notes**Testing Strategy**: [Inline per-phase / Separate testing phase / Both]**Deployment Strategy**: [Deploy per phase / Deploy at milestones / Final deploy]**Context Management**: Phases sized to fit in single session with verification
```
```
# Database Schema: [Project Name]**Database**: Cloudflare D1**Migrations**: Located in migrations/**ORM**: [Drizzle / Raw SQL / None]---## Tables### users**Purpose**: User accounts and authentication| Column | Type | Constraints | Notes ||--------|------|-------------|-------|| id | INTEGER | PRIMARY KEY | Auto-increment || email | TEXT | UNIQUE, NOT NULL | Used for login || created_at | INTEGER | NOT NULL | Unix timestamp |**Indexes**:- idx_users_email on email (for login lookups)**Relationships**:- One-to-many with tasks---### tasks[... repeat structure ...]---## Migrations### Migration 1: Initial Schema**File**: migrations/0001_initial.sql**Creates**: users, tasks tables### Migration 2: Add Tags**File**: migrations/0002_tags.sql**Creates**: tags, task_tags tables---## Seed DataFor development, seed with:- 3 sample users- 10 sample tasks across users- 5 tags
```
```
# Database Schema: [Project Name]**Database**: Cloudflare D1**Migrations**: Located in migrations/**ORM**: [Drizzle / Raw SQL / None]---## Tables### users**Purpose**: User accounts and authentication| Column | Type | Constraints | Notes ||--------|------|-------------|-------|| id | INTEGER | PRIMARY KEY | Auto-increment || email | TEXT | UNIQUE, NOT NULL | Used for login || created_at | INTEGER | NOT NULL | Unix timestamp |**Indexes**:- idx_users_email on email (for login lookups)**Relationships**:- One-to-many with tasks---### tasks[... repeat structure ...]---## Migrations### Migration 1: Initial Schema**File**: migrations/0001_initial.sql**Creates**: users, tasks tables### Migration 2: Add Tags**File**: migrations/0002_tags.sql**Creates**: tags, task_tags tables---## Seed DataFor development, seed with:- 3 sample users- 10 sample tasks across users- 5 tags
```
```
migrations/
```
```
users
```
```
idx_users_email
```
```
email
```
```
tasks
```
```
tasks
```
```
migrations/0001_initial.sql
```
```
migrations/0002_tags.sql
```
```
# API Endpoints: [Project Name]**Base URL**: /api**Auth**: Clerk JWT (custom template with email + metadata)**Framework**: Hono (on Cloudflare Workers)---## Authentication### POST /api/auth/verify**Purpose**: Verify JWT token**Auth**: None (public)**Request**:
```
```
# API Endpoints: [Project Name]**Base URL**: /api**Auth**: Clerk JWT (custom template with email + metadata)**Framework**: Hono (on Cloudflare Workers)---## Authentication### POST /api/auth/verify**Purpose**: Verify JWT token**Auth**: None (public)**Request**:
```
```
/api
```
```
**Responses**:- 200: Token valid → { "valid": true, "email": "user@example.com" }- 401: Token invalid → { "error": "Invalid token" }---## Users### GET /api/users/me**Purpose**: Get current user profile**Auth**: Required (JWT)**Responses**:- 200: { "id": 1, "email": "user@example.com", "created_at": 1234567890 }- 401: Not authenticated[... repeat for all endpoints ...]---## Error HandlingAll endpoints return errors in this format:
```
```
**Responses**:- 200: Token valid → { "valid": true, "email": "user@example.com" }- 401: Token invalid → { "error": "Invalid token" }---## Users### GET /api/users/me**Purpose**: Get current user profile**Auth**: Required (JWT)**Responses**:- 200: { "id": 1, "email": "user@example.com", "created_at": 1234567890 }- 401: Not authenticated[... repeat for all endpoints ...]---## Error HandlingAll endpoints return errors in this format:
```
```
{ "valid": true, "email": "user@example.com" }
```
```
{ "error": "Invalid token" }
```
```
{ "id": 1, "email": "user@example.com", "created_at": 1234567890 }
```
```
**Standard Codes**:- 400: Bad request (validation failed)- 401: Unauthorized (not logged in / invalid token)- 403: Forbidden (insufficient permissions)- 404: Not found- 500: Internal server error
```
```
**Standard Codes**:- 400: Bad request (validation failed)- 401: Unauthorized (not logged in / invalid token)- 403: Forbidden (insufficient permissions)- 404: Not found- 500: Internal server error
```
```
# Architecture: [Project Name]**Deployment**: Cloudflare Workers**Frontend**: Vite + React (served as static assets)**Backend**: Worker handles API routes---## System Overview
```
```
# Architecture: [Project Name]**Deployment**: Cloudflare Workers**Frontend**: Vite + React (served as static assets)**Backend**: Worker handles API routes---## System Overview
```
```
---## Data Flow### User Authentication1. User submits login form2. Frontend sends credentials to Clerk3. Clerk returns JWT4. Frontend includes JWT in API requests5. Worker middleware verifies JWT6. Protected routes accessible### Task Creation1. User submits task form2. Frontend validates with Zod3. POST /api/tasks with validated data4. Worker validates again server-side5. Insert into D1 database6. Return created task7. Frontend updates UI via TanStack Query[... more flows as needed ...]---## Service Boundaries**Frontend Responsibilities**:- User interaction- Client-side validation- Optimistic updates- State management (TanStack Query + Zustand)**Worker Responsibilities**:- Request routing- Authentication/authorization- Server-side validation- Business logic- Database operations- Third-party API calls**Cloudflare Services**:- D1: Persistent relational data- R2: File storage (images, documents)- KV: Configuration, feature flags, cache---## Security**Authentication**: Clerk JWT with custom claims**Authorization**: Middleware checks user ownership before mutations**Input Validation**: Zod schemas on client AND server**CORS**: Restricted to production domain**Secrets**: Environment variables in wrangler.jsonc (not committed)
```
```
---## Data Flow### User Authentication1. User submits login form2. Frontend sends credentials to Clerk3. Clerk returns JWT4. Frontend includes JWT in API requests5. Worker middleware verifies JWT6. Protected routes accessible### Task Creation1. User submits task form2. Frontend validates with Zod3. POST /api/tasks with validated data4. Worker validates again server-side5. Insert into D1 database6. Return created task7. Frontend updates UI via TanStack Query[... more flows as needed ...]---## Service Boundaries**Frontend Responsibilities**:- User interaction- Client-side validation- Optimistic updates- State management (TanStack Query + Zustand)**Worker Responsibilities**:- Request routing- Authentication/authorization- Server-side validation- Business logic- Database operations- Third-party API calls**Cloudflare Services**:- D1: Persistent relational data- R2: File storage (images, documents)- KV: Configuration, feature flags, cache---## Security**Authentication**: Clerk JWT with custom claims**Authorization**: Middleware checks user ownership before mutations**Input Validation**: Zod schemas on client AND server**CORS**: Restricted to production domain**Secrets**: Environment variables in wrangler.jsonc (not committed)
```
```
# UI Components: [Project Name]**Framework:** shadcn/ui + Tailwind v4**Installation:** Components copied to @/components/ui (fully customizable)**Strategy:** Install components as needed per phase (not all upfront)---## Installation Strategy: By Phase### Phase [N]: [Phase Name] ([X] components)**When:** During [description of when this phase happens]**Components:**- button - [specific use cases in this phase]- input - [specific use cases]- card - [specific use cases][... list all components for this phase ...]**Install:**\\\bashpnpm dlx shadcn@latest add button input card [...]\\\**Usage:** [Which routes/features use these]**Critical Notes:**- [Any gotchas, e.g., "Use sonner instead of toast for better UX"]- [Component-specific warnings, e.g., "data-table essential for TanStack Table integration"]---[Repeat for each phase...]---## Quick Reference Commands### MVP Install (All Core Components)\\\bashpnpm dlx shadcn@latest add button input label card sonner [essential components...]\\\### Full Featured Install\\\bashpnpm dlx shadcn@latest add button input [all components...]\\\### Update All Components\\\bashpnpm dlx shadcn@latest update\\\---## Component Usage by Route### [Route Name] (\/route\)- [List of components used][Repeat for each major route...]---## Design Decisions### [Component Choice 1]**Recommendation:** [Chosen component]**Why:** [Justification]**Alternatives considered:** [What else was evaluated]**Savings:** [Time/token savings if applicable][Repeat for each significant component decision...]---## Component Count Breakdown### By Category- **Forms:** X components ([list])- **Data Display:** X components ([list])- **Feedback:** X components ([list])- **Layout:** X components ([list])- **Navigation:** X components ([list])### By Priority- **Essential (MVP):** X components- **Recommended:** X additional components- **Optional (Enhanced UX):** X additional components---## Installation Checklist### Phase [N]: [Name] ✅- [ ] component1- [ ] component2[...][Repeat for each phase...]---## Best Practices1. **Install as Needed** - Don't install all components upfront. Add them when implementing the feature.2. **Customize After Installation** - All components copied to @/components/ui are fully customizable.3. **Keep Components Updated** - Run \pnpm dlx shadcn@latest update\ periodically.4. **Check for New Components** - shadcn/ui adds new components regularly.5. **Dark Mode Works Automatically** - All components respect Tailwind v4 theming.6. **Bundle Size Optimization** - Only installed components are included - unused code is tree-shaken.---## References- **shadcn/ui Docs:** https://ui.shadcn.com/docs/components- **Tailwind v4 Integration:** See \tailwind-v4-shadcn\ skill- **Component Installation:** https://ui.shadcn.com/docs/installation/vite
```
```
# UI Components: [Project Name]**Framework:** shadcn/ui + Tailwind v4**Installation:** Components copied to @/components/ui (fully customizable)**Strategy:** Install components as needed per phase (not all upfront)---## Installation Strategy: By Phase### Phase [N]: [Phase Name] ([X] components)**When:** During [description of when this phase happens]**Components:**- button - [specific use cases in this phase]- input - [specific use cases]- card - [specific use cases][... list all components for this phase ...]**Install:**\\\bashpnpm dlx shadcn@latest add button input card [...]\\\**Usage:** [Which routes/features use these]**Critical Notes:**- [Any gotchas, e.g., "Use sonner instead of toast for better UX"]- [Component-specific warnings, e.g., "data-table essential for TanStack Table integration"]---[Repeat for each phase...]---## Quick Reference Commands### MVP Install (All Core Components)\\\bashpnpm dlx shadcn@latest add button input label card sonner [essential components...]\\\### Full Featured Install\\\bashpnpm dlx shadcn@latest add button input [all components...]\\\### Update All Components\\\bashpnpm dlx shadcn@latest update\\\---## Component Usage by Route### [Route Name] (\/route\)- [List of components used][Repeat for each major route...]---## Design Decisions### [Component Choice 1]**Recommendation:** [Chosen component]**Why:** [Justification]**Alternatives considered:** [What else was evaluated]**Savings:** [Time/token savings if applicable][Repeat for each significant component decision...]---## Component Count Breakdown### By Category- **Forms:** X components ([list])- **Data Display:** X components ([list])- **Feedback:** X components ([list])- **Layout:** X components ([list])- **Navigation:** X components ([list])### By Priority- **Essential (MVP):** X components- **Recommended:** X additional components- **Optional (Enhanced UX):** X additional components---## Installation Checklist### Phase [N]: [Name] ✅- [ ] component1- [ ] component2[...][Repeat for each phase...]---## Best Practices1. **Install as Needed** - Don't install all components upfront. Add them when implementing the feature.2. **Customize After Installation** - All components copied to @/components/ui are fully customizable.3. **Keep Components Updated** - Run \pnpm dlx shadcn@latest update\ periodically.4. **Check for New Components** - shadcn/ui adds new components regularly.5. **Dark Mode Works Automatically** - All components respect Tailwind v4 theming.6. **Bundle Size Optimization** - Only installed components are included - unused code is tree-shaken.---## References- **shadcn/ui Docs:** https://ui.shadcn.com/docs/components- **Tailwind v4 Integration:** See \tailwind-v4-shadcn\ skill- **Component Installation:** https://ui.shadcn.com/docs/installation/vite
```
```
button
```
```
input
```
```
card
```
```
\
```
```
bashpnpm dlx shadcn@latest add button input card [...]\
```
```
\
```
```
\
```
```
bashpnpm dlx shadcn@latest add button input label card sonner [essential components...]\
```
```
\
```
```
\
```
```
bashpnpm dlx shadcn@latest add button input [all components...]\
```
```
\
```
```
\
```
```
bashpnpm dlx shadcn@latest update\
```
```
\
```
```
/route\
```
```
pnpm dlx shadcn@latest update\
```
```
tailwind-v4-shadcn\
```
```
# Critical Workflows: [Project Name]**Purpose:** Document non-obvious setup steps and order-sensitive workflows to prevent getting stuck**Date:** [YYYY-MM-DD]---## ⚠️ [Workflow Name 1] ([Phase it applies to])**STOP! Read this before [starting X].****Context:** [Why this workflow is tricky]**Order matters:**1. [Step 1 with specific command/action]2. [Step 2]3. [Step 3][...]**Why this order:** [Explanation of what breaks if done wrong]**Code Example:**\\\bash# Step 1: [Description][command]# Step 2: [Description][command]\\\**Common Mistake:** [What people typically do wrong]**Fix if broken:** [How to recover]---## ⚠️ [Workflow Name 2][Repeat structure...]---## Quick ChecklistBefore starting each phase, check if it has critical workflows:- [ ] Phase [N]: [Workflow name] (see above)- [ ] Phase [N+1]: No critical workflows- [ ] Phase [N+2]: [Workflow name] (see above)---## References- **[Link to official docs]**- **[Link to GitHub issue explaining gotcha]**- **[Link to skill that prevents this issue]**
```
```
# Critical Workflows: [Project Name]**Purpose:** Document non-obvious setup steps and order-sensitive workflows to prevent getting stuck**Date:** [YYYY-MM-DD]---## ⚠️ [Workflow Name 1] ([Phase it applies to])**STOP! Read this before [starting X].****Context:** [Why this workflow is tricky]**Order matters:**1. [Step 1 with specific command/action]2. [Step 2]3. [Step 3][...]**Why this order:** [Explanation of what breaks if done wrong]**Code Example:**\\\bash# Step 1: [Description][command]# Step 2: [Description][command]\\\**Common Mistake:** [What people typically do wrong]**Fix if broken:** [How to recover]---## ⚠️ [Workflow Name 2][Repeat structure...]---## Quick ChecklistBefore starting each phase, check if it has critical workflows:- [ ] Phase [N]: [Workflow name] (see above)- [ ] Phase [N+1]: No critical workflows- [ ] Phase [N+2]: [Workflow name] (see above)---## References- **[Link to official docs]**- **[Link to GitHub issue explaining gotcha]**- **[Link to skill that prevents this issue]**
```
```
\
```
```
bash# Step 1: [Description][command]# Step 2: [Description][command]\
```
```
\
```
```
# Installation Commands: [Project Name]**Purpose:** Copy-paste commands for each phase (no more "what was that command again?")**Date:** [YYYY-MM-DD]---## Phase 0: Planning[None - just docs]---## Phase 1: [Phase Name]### Scaffold Project\\\bashnpm create cloudflare@latest -- --framework=[framework]cd [project-name]\\\### Install Dependencies\\\bashpnpm add [packages]pnpm add -D [dev-packages]\\\### Initialize Tools\\\bashnpx [tool] init\\\### Verify Setup\\\bashpnpm dev# Should see: [expected output]\\\---## Phase 2: [Phase Name][Repeat structure for each phase...]---## Database Commands (Phase [N])### Create Database\\\bashnpx wrangler d1 create [db-name]# Copy database_id and add to wrangler.jsonc under [[d1_databases]]\\\### Run Migrations\\\bash# Local (dev)npx wrangler d1 execute [db-name] --local --file=migrations/0001_initial.sql# Productionnpx wrangler d1 execute [db-name] --remote --file=migrations/0001_initial.sql\\\### Query Database\\\bash# Localnpx wrangler d1 execute [db-name] --local --command="SELECT * FROM users"# Productionnpx wrangler d1 execute [db-name] --remote --command="SELECT * FROM users"\\\---## Deployment Commands### Deploy to Cloudflare\\\bashnpm run buildnpx wrangler deploy\\\### Set Production Secrets\\\bashnpx wrangler secret put [SECRET_NAME]# Enter value when prompted\\\### Check Deployment\\\bashnpx wrangler tail# Watch logs in real-time\\\---## Development Commands### Start Dev Server\\\bashpnpm dev\\\### Run Tests\\\bashpnpm test\\\### Lint & Format\\\bashpnpm lintpnpm format\\\---## Troubleshooting Commands### Clear Build Cache\\\bashrm -rf dist/ .wrangler/pnpm dev\\\### Check Wrangler Version\\\bashnpx wrangler --version# Should be: [expected version]\\\### Verify Bindings\\\bashnpx wrangler d1 listnpx wrangler r2 bucket list\\\
```
```
# Installation Commands: [Project Name]**Purpose:** Copy-paste commands for each phase (no more "what was that command again?")**Date:** [YYYY-MM-DD]---## Phase 0: Planning[None - just docs]---## Phase 1: [Phase Name]### Scaffold Project\\\bashnpm create cloudflare@latest -- --framework=[framework]cd [project-name]\\\### Install Dependencies\\\bashpnpm add [packages]pnpm add -D [dev-packages]\\\### Initialize Tools\\\bashnpx [tool] init\\\### Verify Setup\\\bashpnpm dev# Should see: [expected output]\\\---## Phase 2: [Phase Name][Repeat structure for each phase...]---## Database Commands (Phase [N])### Create Database\\\bashnpx wrangler d1 create [db-name]# Copy database_id and add to wrangler.jsonc under [[d1_databases]]\\\### Run Migrations\\\bash# Local (dev)npx wrangler d1 execute [db-name] --local --file=migrations/0001_initial.sql# Productionnpx wrangler d1 execute [db-name] --remote --file=migrations/0001_initial.sql\\\### Query Database\\\bash# Localnpx wrangler d1 execute [db-name] --local --command="SELECT * FROM users"# Productionnpx wrangler d1 execute [db-name] --remote --command="SELECT * FROM users"\\\---## Deployment Commands### Deploy to Cloudflare\\\bashnpm run buildnpx wrangler deploy\\\### Set Production Secrets\\\bashnpx wrangler secret put [SECRET_NAME]# Enter value when prompted\\\### Check Deployment\\\bashnpx wrangler tail# Watch logs in real-time\\\---## Development Commands### Start Dev Server\\\bashpnpm dev\\\### Run Tests\\\bashpnpm test\\\### Lint & Format\\\bashpnpm lintpnpm format\\\---## Troubleshooting Commands### Clear Build Cache\\\bashrm -rf dist/ .wrangler/pnpm dev\\\### Check Wrangler Version\\\bashnpx wrangler --version# Should be: [expected version]\\\### Verify Bindings\\\bashnpx wrangler d1 listnpx wrangler r2 bucket list\\\
```
```
\
```
```
bashnpm create cloudflare@latest -- --framework=[framework]cd [project-name]\
```
```
\
```
```
\
```
```
bashpnpm add [packages]pnpm add -D [dev-packages]\
```
```
\
```
```
\
```
```
bashnpx [tool] init\
```
```
\
```
```
\
```
```
bashpnpm dev# Should see: [expected output]\
```
```
\
```
```
\
```
```
bashnpx wrangler d1 create [db-name]# Copy database_id and add to wrangler.jsonc under [[d1_databases]]\
```
```
\
```
```
\
```
```
bash# Local (dev)npx wrangler d1 execute [db-name] --local --file=migrations/0001_initial.sql# Productionnpx wrangler d1 execute [db-name] --remote --file=migrations/0001_initial.sql\
```
```
\
```
```
\
```
```
bash# Localnpx wrangler d1 execute [db-name] --local --command="SELECT * FROM users"# Productionnpx wrangler d1 execute [db-name] --remote --command="SELECT * FROM users"\
```
```
\
```
```
\
```
```
bashnpm run buildnpx wrangler deploy\
```
```
\
```
```
\
```
```
bashnpx wrangler secret put [SECRET_NAME]# Enter value when prompted\
```
```
\
```
```
\
```
```
bashnpx wrangler tail# Watch logs in real-time\
```
```
\
```
```
\
```
```
bashpnpm dev\
```
```
\
```
```
\
```
```
bashpnpm test\
```
```
\
```
```
\
```
```
bashpnpm lintpnpm format\
```
```
\
```
```
\
```
```
bashrm -rf dist/ .wrangler/pnpm dev\
```
```
\
```
```
\
```
```
bashnpx wrangler --version# Should be: [expected version]\
```
```
\
```
```
\
```
```
bashnpx wrangler d1 listnpx wrangler r2 bucket list\
```
```
\
```
```
# Environment Variables: [Project Name]**Purpose:** All secrets, API keys, and configuration needed for this project**Date:** [YYYY-MM-DD]---## Development (.dev.vars)**File:** \.dev.vars\ (local file, NOT committed to git)\\\bash# AuthCLERK_PUBLISHABLE_KEY=pk_test_...CLERK_SECRET_KEY=sk_test_...# DatabaseDATABASE_URL=local# API Keys[SERVICE]_API_KEY=[value]# Feature FlagsENABLE_[FEATURE]=true\\\**How to get these keys:**1. **Clerk Keys:** https://dashboard.clerk.com → API Keys2. **[Other Service]:** [Steps to obtain]---## Production (wrangler.jsonc secrets)**Secrets (set via CLI):**\\\bash# Set via: npx wrangler secret put SECRET_NAMECLERK_SECRET_KEY=sk_live_...[SERVICE]_API_KEY=[production-value]\\\**Bindings (configured in wrangler.jsonc):**\\\jsonc{  "name": "[project-name]",  "d1_databases": [    {      "binding": "DB",      "database_name": "[db-name]",      "database_id": "[copy from wrangler d1 create output]"    }  ],  "r2_buckets": [    {      "binding": "BUCKET",      "bucket_name": "[bucket-name]"    }  ],  "kv_namespaces": [    {      "binding": "KV",      "id": "[namespace-id]"    }  ]}\\\---## Environment Variable Reference| Variable | Required | Where Used | Notes ||----------|----------|------------|-------|| CLERK_PUBLISHABLE_KEY | Yes | Frontend | Public, safe to commit in example files || CLERK_SECRET_KEY | Yes | Worker | SECRET - never commit || DATABASE_URL | Local only | Development | Points to local .wrangler/state || [OTHER_VAR] | [Yes/No] | [Where] | [Notes] |---## Setup Checklist### Local Development- [ ] Create \.dev.vars\ in project root- [ ] Add \.dev.vars\ to \.gitignore\ (should already be there)- [ ] Copy values from \.dev.vars.example\ (if exists)- [ ] Get API keys from services (links above)- [ ] Run \pnpm dev\ to verify### Production Deployment- [ ] Set all secrets via \npx wrangler secret put\- [ ] Configure all bindings in \wrangler.jsonc\- [ ] Deploy: \npx wrangler deploy\- [ ] Verify secrets are set: \npx wrangler secret list\- [ ] Test production deployment---## Security Notes**Never commit:**- \.dev.vars\- Any file with actual secret values- Production API keys**Safe to commit:**- \.dev.vars.example\ (with placeholder values)- \wrangler.jsonc\ (bindings config, NOT secret values)- Public keys (Clerk publishable key, etc.)**If secrets leaked:**1. Rotate all affected keys immediately2. Update production secrets: \npx wrangler secret put [KEY]\3. Revoke old keys in service dashboards4. Check git history for leaked secrets---## References- **Cloudflare Secrets:** https://developers.cloudflare.com/workers/configuration/secrets/- **Wrangler Configuration:** https://developers.cloudflare.com/workers/wrangler/configuration/- **[Service] API Docs:** [link]
```
```
# Environment Variables: [Project Name]**Purpose:** All secrets, API keys, and configuration needed for this project**Date:** [YYYY-MM-DD]---## Development (.dev.vars)**File:** \.dev.vars\ (local file, NOT committed to git)\\\bash# AuthCLERK_PUBLISHABLE_KEY=pk_test_...CLERK_SECRET_KEY=sk_test_...# DatabaseDATABASE_URL=local# API Keys[SERVICE]_API_KEY=[value]# Feature FlagsENABLE_[FEATURE]=true\\\**How to get these keys:**1. **Clerk Keys:** https://dashboard.clerk.com → API Keys2. **[Other Service]:** [Steps to obtain]---## Production (wrangler.jsonc secrets)**Secrets (set via CLI):**\\\bash# Set via: npx wrangler secret put SECRET_NAMECLERK_SECRET_KEY=sk_live_...[SERVICE]_API_KEY=[production-value]\\\**Bindings (configured in wrangler.jsonc):**\\\jsonc{  "name": "[project-name]",  "d1_databases": [    {      "binding": "DB",      "database_name": "[db-name]",      "database_id": "[copy from wrangler d1 create output]"    }  ],  "r2_buckets": [    {      "binding": "BUCKET",      "bucket_name": "[bucket-name]"    }  ],  "kv_namespaces": [    {      "binding": "KV",      "id": "[namespace-id]"    }  ]}\\\---## Environment Variable Reference| Variable | Required | Where Used | Notes ||----------|----------|------------|-------|| CLERK_PUBLISHABLE_KEY | Yes | Frontend | Public, safe to commit in example files || CLERK_SECRET_KEY | Yes | Worker | SECRET - never commit || DATABASE_URL | Local only | Development | Points to local .wrangler/state || [OTHER_VAR] | [Yes/No] | [Where] | [Notes] |---## Setup Checklist### Local Development- [ ] Create \.dev.vars\ in project root- [ ] Add \.dev.vars\ to \.gitignore\ (should already be there)- [ ] Copy values from \.dev.vars.example\ (if exists)- [ ] Get API keys from services (links above)- [ ] Run \pnpm dev\ to verify### Production Deployment- [ ] Set all secrets via \npx wrangler secret put\- [ ] Configure all bindings in \wrangler.jsonc\- [ ] Deploy: \npx wrangler deploy\- [ ] Verify secrets are set: \npx wrangler secret list\- [ ] Test production deployment---## Security Notes**Never commit:**- \.dev.vars\- Any file with actual secret values- Production API keys**Safe to commit:**- \.dev.vars.example\ (with placeholder values)- \wrangler.jsonc\ (bindings config, NOT secret values)- Public keys (Clerk publishable key, etc.)**If secrets leaked:**1. Rotate all affected keys immediately2. Update production secrets: \npx wrangler secret put [KEY]\3. Revoke old keys in service dashboards4. Check git history for leaked secrets---## References- **Cloudflare Secrets:** https://developers.cloudflare.com/workers/configuration/secrets/- **Wrangler Configuration:** https://developers.cloudflare.com/workers/wrangler/configuration/- **[Service] API Docs:** [link]
```
```
.dev.vars\
```
```
\
```
```
bash# AuthCLERK_PUBLISHABLE_KEY=pk_test_...CLERK_SECRET_KEY=sk_test_...# DatabaseDATABASE_URL=local# API Keys[SERVICE]_API_KEY=[value]# Feature FlagsENABLE_[FEATURE]=true\
```
```
\
```
```
\
```
```
bash# Set via: npx wrangler secret put SECRET_NAMECLERK_SECRET_KEY=sk_live_...[SERVICE]_API_KEY=[production-value]\
```
```
\
```
```
\
```
```
jsonc{  "name": "[project-name]",  "d1_databases": [    {      "binding": "DB",      "database_name": "[db-name]",      "database_id": "[copy from wrangler d1 create output]"    }  ],  "r2_buckets": [    {      "binding": "BUCKET",      "bucket_name": "[bucket-name]"    }  ],  "kv_namespaces": [    {      "binding": "KV",      "id": "[namespace-id]"    }  ]}\
```
```
\
```
```
.dev.vars\
```
```
.dev.vars\
```
```
.gitignore\
```
```
.dev.vars.example\
```
```
pnpm dev\
```
```
npx wrangler secret put\
```
```
wrangler.jsonc\
```
```
npx wrangler deploy\
```
```
npx wrangler secret list\
```
```
.dev.vars\
```
```
.dev.vars.example\
```
```
wrangler.jsonc\
```
```
npx wrangler secret put [KEY]\
```
```
# Session State**Current Phase**: Phase 0 (Planning)**Current Stage**: Planning**Last Checkpoint**: None yet**Planning Docs**: \docs/IMPLEMENTATION_PHASES.md\, \docs/CRITICAL_WORKFLOWS.md\ (if exists)---## Phase 0: Planning ✅**Completed**: [YYYY-MM-DD]**Summary**: Planning docs created**Deliverables**: [List generated docs]## Phase 1: [Name] ⏸️**Spec**: \docs/IMPLEMENTATION_PHASES.md#phase-1\**Type**: [Infrastructure/Database/API/UI/Integration]**Time**: [X hours]**Progress**: Not started**Next Action**: [Specific file + line + what to do]## Phase 2: [Name] ⏸️**Spec**: \docs/IMPLEMENTATION_PHASES.md#phase-2\**Type**: [Type]**Time**: [X hours]**Progress**: Not started[Collapse remaining phases to 2-3 lines each...]---## Critical Reminders**Before Starting:**- [ ] Read \docs/CRITICAL_WORKFLOWS.md\ (if exists)- [ ] Review \docs/INSTALLATION_COMMANDS.md\ for phase commands- [ ] Check \docs/ENV_VARIABLES.md\ for required secrets**Critical Workflows:**[Link to specific workflows from CRITICAL_WORKFLOWS.md, if exists]---## Known Risks**High-Risk Phases:**- Phase [N]: [Name] - [Why risky]- Phase [N+1]: [Name] - [Why risky]**Mitigation:** [Strategy]---**Status Legend**: ⏸️ Pending | 🔄 In Progress | ✅ Complete | 🚫 Blocked | ⚠️ Issues
```
```
# Session State**Current Phase**: Phase 0 (Planning)**Current Stage**: Planning**Last Checkpoint**: None yet**Planning Docs**: \docs/IMPLEMENTATION_PHASES.md\, \docs/CRITICAL_WORKFLOWS.md\ (if exists)---## Phase 0: Planning ✅**Completed**: [YYYY-MM-DD]**Summary**: Planning docs created**Deliverables**: [List generated docs]## Phase 1: [Name] ⏸️**Spec**: \docs/IMPLEMENTATION_PHASES.md#phase-1\**Type**: [Infrastructure/Database/API/UI/Integration]**Time**: [X hours]**Progress**: Not started**Next Action**: [Specific file + line + what to do]## Phase 2: [Name] ⏸️**Spec**: \docs/IMPLEMENTATION_PHASES.md#phase-2\**Type**: [Type]**Time**: [X hours]**Progress**: Not started[Collapse remaining phases to 2-3 lines each...]---## Critical Reminders**Before Starting:**- [ ] Read \docs/CRITICAL_WORKFLOWS.md\ (if exists)- [ ] Review \docs/INSTALLATION_COMMANDS.md\ for phase commands- [ ] Check \docs/ENV_VARIABLES.md\ for required secrets**Critical Workflows:**[Link to specific workflows from CRITICAL_WORKFLOWS.md, if exists]---## Known Risks**High-Risk Phases:**- Phase [N]: [Name] - [Why risky]- Phase [N+1]: [Name] - [Why risky]**Mitigation:** [Strategy]---**Status Legend**: ⏸️ Pending | 🔄 In Progress | ✅ Complete | 🚫 Blocked | ⚠️ Issues
```
```
docs/IMPLEMENTATION_PHASES.md\
```
```
docs/CRITICAL_WORKFLOWS.md\
```
```
docs/IMPLEMENTATION_PHASES.md#phase-1\
```
```
docs/IMPLEMENTATION_PHASES.md#phase-2\
```
```
docs/CRITICAL_WORKFLOWS.md\
```
```
docs/INSTALLATION_COMMANDS.md\
```
```
docs/ENV_VARIABLES.md\
```
```
### File Map- src/routes/tasks.ts (~150 lines) - CRUD endpoints  - Purpose, Key exports, Dependencies, Used by- src/lib/schemas.ts (~80 lines) - Validation schemas- src/middleware/auth.ts (existing, no changes)
```
```
### File Map- src/routes/tasks.ts (~150 lines) - CRUD endpoints  - Purpose, Key exports, Dependencies, Used by- src/lib/schemas.ts (~80 lines) - Validation schemas- src/middleware/auth.ts (existing, no changes)
```
```
src/routes/tasks.ts
```
```
src/lib/schemas.ts
```
```
src/middleware/auth.ts
```
```
\\\mermaidsequenceDiagram    Client->>Worker: POST /api/tasks    Worker->>Auth: authenticateUser()    Auth->>Worker: user object    Worker->>D1: INSERT INTO tasks    D1->>Worker: task record    Worker->>Client: 201 + JSON\\\
```
```
\\\mermaidsequenceDiagram    Client->>Worker: POST /api/tasks    Worker->>Auth: authenticateUser()    Auth->>Worker: user object    Worker->>D1: INSERT INTO tasks    D1->>Worker: task record    Worker->>Client: 201 + JSON\\\
```
```
\
```
```
mermaidsequenceDiagram    Client->>Worker: POST /api/tasks    Worker->>Auth: authenticateUser()    Auth->>Worker: user object    Worker->>D1: INSERT INTO tasks    D1->>Worker: task record    Worker->>Client: 201 + JSON\
```
```
\
```
```
**Internal**: auth.ts, schemas.ts, D1 binding**External**: zod, hono, @clerk/backend**Configuration**: CLERK_SECRET_KEY**Bindings**: DB (D1)**Gotchas**:- Ownership verification (PATCH/DELETE must check user_id)- Pagination required (50 max per page)- Soft delete (deleted_at, not DELETE FROM)- UTC timestamps (convert in frontend only)
```
```
**Internal**: auth.ts, schemas.ts, D1 binding**External**: zod, hono, @clerk/backend**Configuration**: CLERK_SECRET_KEY**Bindings**: DB (D1)**Gotchas**:- Ownership verification (PATCH/DELETE must check user_id)- Pagination required (50 max per page)- Soft delete (deleted_at, not DELETE FROM)- UTC timestamps (convert in frontend only)
```
```
## Phase 3: Tasks API**Type**: API | **Estimated**: 4 hours**Files**: src/routes/tasks.ts, src/lib/schemas.ts, src/middleware/auth.ts (modify)### File Map- src/routes/tasks.ts (~150 lines) - CRUD endpoints- src/lib/schemas.ts (+40 lines) - Validation schemas### Data Flow\\\mermaidsequenceDiagram    Client->>Worker: POST /api/tasks    Worker->>Auth: authenticateUser()    Worker->>D1: INSERT    D1->>Worker: task    Worker->>Client: 201\\\### Dependencies & Gotchas**Internal**: auth.ts, schemas.ts, D1**External**: zod, hono, @clerk/backend**Gotchas**: Ownership checks, pagination (50 max), soft delete, UTC timestamps### Tasks- [ ] Create schemas- [ ] GET /api/tasks (paginated)- [ ] POST /api/tasks (validated)- [ ] PATCH /api/tasks/:id (ownership check)- [ ] DELETE /api/tasks/:id (soft delete)### Verification- [ ] GET returns 200 + array- [ ] POST valid→201, invalid→400- [ ] PATCH checks ownership (403 if wrong user)- [ ] DELETE sets deleted_at- [ ] All require JWT (401 if missing)### Exit CriteriaAll CRUD works with correct status codes, validation, auth, ownership. Paginated. Soft deletes.
```
```
## Phase 3: Tasks API**Type**: API | **Estimated**: 4 hours**Files**: src/routes/tasks.ts, src/lib/schemas.ts, src/middleware/auth.ts (modify)### File Map- src/routes/tasks.ts (~150 lines) - CRUD endpoints- src/lib/schemas.ts (+40 lines) - Validation schemas### Data Flow\\\mermaidsequenceDiagram    Client->>Worker: POST /api/tasks    Worker->>Auth: authenticateUser()    Worker->>D1: INSERT    D1->>Worker: task    Worker->>Client: 201\\\### Dependencies & Gotchas**Internal**: auth.ts, schemas.ts, D1**External**: zod, hono, @clerk/backend**Gotchas**: Ownership checks, pagination (50 max), soft delete, UTC timestamps### Tasks- [ ] Create schemas- [ ] GET /api/tasks (paginated)- [ ] POST /api/tasks (validated)- [ ] PATCH /api/tasks/:id (ownership check)- [ ] DELETE /api/tasks/:id (soft delete)### Verification- [ ] GET returns 200 + array- [ ] POST valid→201, invalid→400- [ ] PATCH checks ownership (403 if wrong user)- [ ] DELETE sets deleted_at- [ ] All require JWT (401 if missing)### Exit CriteriaAll CRUD works with correct status codes, validation, auth, ownership. Paginated. Soft deletes.
```
```
\
```
```
mermaidsequenceDiagram    Client->>Worker: POST /api/tasks    Worker->>Auth: authenticateUser()    Worker->>D1: INSERT    D1->>Worker: task    Worker->>Client: 201\
```
```
\
```
Navigating the complexities of web application development requires meticulous planning. This specialized Project Planning Agent Skill empowers AI coding assistants to act as your strategic partner, transforming initial concepts into structured, actionable development roadmaps. It goes beyond simple task lists, generating detailed documentation for every phase, from initial setup to feature integration, ensuring clarity and alignment across your entire project. Leverage its capabilities to streamline your workflow and lay a robust foundation for successful development outcomes.

# When to Use This Skill
- •Initiating a new web application project from scratch with comprehensive planning.
- •Integrating a major new feature into an existing web application project.
- •Generating detailed architectural or database schema documentation for a complex system.
- •Structuring a project's development into clear, manageable phases.

# Pro Tips
- 💡Always start by answering the clarifying questions. The more context you provide initially, the more accurate and tailored your planning documents will be.
- 💡Leverage the `/plan-project` and `/plan-feature` automation commands to quickly scaffold new projects or integrate new features seamlessly into existing documentation.
- 💡Review the generated `IMPLEMENTATION_PHASES.md` thoroughly before starting coding, using it as a living document to guide development and track progress.

