# NextAuth.js (Auth.js) v5 Setup
Source: https://antigravity.codes/workflows/integrations/setup-nextauth-v5-google-github-authentication

## AI Worker Instructions
When the user requests functionality related to NextAuth.js (Auth.js) v5 Setup, follow these guidelines and utilize this context.

## Scraped Content

# NextAuth.js (Auth.js) v5 Setup
```
npm install next-auth@beta
```
```
.env.local
```
```
AUTH_SECRET="your-secret-here"   AUTH_GOOGLE_ID="your-google-client-id"   AUTH_GOOGLE_SECRET="your-google-client-secret"   NEXTAUTH_URL="http://localhost:3000"
```
```
AUTH_SECRET="your-secret-here"   AUTH_GOOGLE_ID="your-google-client-id"   AUTH_GOOGLE_SECRET="your-google-client-secret"   NEXTAUTH_URL="http://localhost:3000"
```
```
AUTH_SECRET
```
```
openssl rand -base64 32
```
```
auth.ts
```
```
src/auth.ts
```
```
import NextAuth from "next-auth"   import Google from "next-auth/providers/google"   export const { handlers, auth, signIn, signOut } = NextAuth({     providers: [       Google({         clientId: process.env.AUTH_GOOGLE_ID!,         clientSecret: process.env.AUTH_GOOGLE_SECRET!,       })     ],   })
```
```
import NextAuth from "next-auth"   import Google from "next-auth/providers/google"   export const { handlers, auth, signIn, signOut } = NextAuth({     providers: [       Google({         clientId: process.env.AUTH_GOOGLE_ID!,         clientSecret: process.env.AUTH_GOOGLE_SECRET!,       })     ],   })
```
```
src/app/api/auth/[...nextauth]/route.ts
```
```
import { handlers } from "@/auth"   export const { GET, POST } = handlers
```
```
import { handlers } from "@/auth"   export const { GET, POST } = handlers
```
```
src/middleware.ts
```
```
export { auth as middleware } from "@/auth"      export const config = {     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],   }
```
```
export { auth as middleware } from "@/auth"      export const config = {     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],   }
```
```
useSession
```
```
npm install next-auth@beta
```
```
GitHub
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-nextauth-v5-google-github-authentication.md
```
setup-nextauth-v5-google-github-authentication.md
```
- In Antigravity, type /setup_nextauth_v5_google_github_authentication or just describe what you want to do
```
/setup_nextauth_v5_google_github_authentication
```
Learn more about workflows →

# Related Workflows

# Supabase Row Level Security (RLS)

# Stripe Checkout Integration

# Setup Local Database (Postgres)

