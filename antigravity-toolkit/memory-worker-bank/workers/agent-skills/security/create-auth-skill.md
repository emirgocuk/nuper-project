# create-auth-skill
Source: https://antigravity.codes/agent-skills/security/create-auth

## AI Worker Instructions
When the user requests functionality related to create-auth-skill, follow these guidelines and utilize this context.

## Scraped Content

# create-auth-skill
```
Is this a new/empty project?├─ YES → New project setup│   1. Identify framework│   2. Choose database│   3. Install better-auth│   4. Create auth.ts + auth-client.ts│   5. Set up route handler│   6. Run CLI migrate/generate│   7. Add features via plugins│└─ NO → Does project have existing auth?    ├─ YES → Migration/enhancement    │   • Audit current auth for gaps    │   • Plan incremental migration    │   • See migration guides in docs    │    └─ NO → Add auth to existing project        1. Analyze project structure        2. Install better-auth        3. Create auth config        4. Add route handler        5. Run schema migrations        6. Integrate into existing pages
```
```
Is this a new/empty project?├─ YES → New project setup│   1. Identify framework│   2. Choose database│   3. Install better-auth│   4. Create auth.ts + auth-client.ts│   5. Set up route handler│   6. Run CLI migrate/generate│   7. Add features via plugins│└─ NO → Does project have existing auth?    ├─ YES → Migration/enhancement    │   • Audit current auth for gaps    │   • Plan incremental migration    │   • See migration guides in docs    │    └─ NO → Add auth to existing project        1. Analyze project structure        2. Install better-auth        3. Create auth config        4. Add route handler        5. Run schema migrations        6. Integrate into existing pages
```
```
npm install better-auth
```
```
@better-auth/passkey
```
```
@better-auth/sso
```
```
@better-auth/stripe
```
```
@better-auth/scim
```
```
@better-auth/expo
```
```
BETTER_AUTH_SECRET=<32+ chars, generate with: openssl rand -base64 32>BETTER_AUTH_URL=http://localhost:3000DATABASE_URL=<your database connection string>
```
```
BETTER_AUTH_SECRET=<32+ chars, generate with: openssl rand -base64 32>BETTER_AUTH_URL=http://localhost:3000DATABASE_URL=<your database connection string>
```
```
GITHUB_CLIENT_ID
```
```
GITHUB_CLIENT_SECRET
```
```
GOOGLE_CLIENT_ID
```
```
lib/auth.ts
```
```
src/lib/auth.ts
```
```
database
```
```
emailAndPassword: { enabled: true }
```
```
socialProviders
```
```
emailVerification.sendVerificationEmail
```
```
emailAndPassword.sendResetPassword
```
```
plugins
```
```
session
```
```
account.accountLinking
```
```
rateLimit
```
```
export type Session = typeof auth.$Infer.Session
```
```
better-auth/react
```
```
better-auth/vue
```
```
better-auth/svelte
```
```
better-auth/solid
```
```
better-auth/client
```
```
createAuthClient({ plugins: [...] })
```
```
signIn
```
```
signUp
```
```
signOut
```
```
useSession
```
```
getSession
```
```
app/api/auth/[...all]/route.ts
```
```
toNextJsHandler(auth)
```
```
{ GET, POST }
```
```
pages/api/auth/[...all].ts
```
```
toNextJsHandler(auth)
```
```
app.all("/api/auth/*", toNodeHandler(auth))
```
```
src/hooks.server.ts
```
```
svelteKitHandler(auth)
```
```
solidStartHandler(auth)
```
```
auth.handler(c.req.raw)
```
```
nextCookies()
```
```
npx @better-auth/cli@latest migrate
```
```
npx @better-auth/cli@latest generate --output prisma/schema.prisma
```
```
npx prisma migrate dev
```
```
npx @better-auth/cli@latest generate --output src/db/auth-schema.ts
```
```
npx drizzle-kit push
```
```
better-sqlite3
```
```
bun:sqlite
```
```
pg.Pool
```
```
mysql2
```
```
prismaAdapter(prisma, { provider: "postgresql" })
```
```
better-auth/adapters/prisma
```
```
drizzleAdapter(db, { provider: "pg" })
```
```
better-auth/adapters/drizzle
```
```
mongodbAdapter(db)
```
```
better-auth/adapters/mongodb
```
```
twoFactor
```
```
better-auth/plugins
```
```
twoFactorClient
```
```
organization
```
```
better-auth/plugins
```
```
organizationClient
```
```
admin
```
```
better-auth/plugins
```
```
adminClient
```
```
bearer
```
```
better-auth/plugins
```
```
openAPI
```
```
better-auth/plugins
```
```
passkey
```
```
@better-auth/passkey
```
```
passkeyClient
```
```
sso
```
```
@better-auth/sso
```
```
signIn.email({ email, password })
```
```
signIn.social({ provider, callbackURL })
```
```
error
```
```
useSession()
```
```
{ data: session, isPending }
```
```
auth.api.getSession({ headers: await headers() })
```
```
/sign-in
```
```
BETTER_AUTH_SECRET
```
```
advanced.useSecureCookies: true
```
```
trustedOrigins
```
```
account.accountLinking
```
```
BETTER_AUTH_SECRET
```
```
trustedOrigins
```
```
baseURL
```
The `create-auth-skill` empowers AI assistants to expertly guide developers through implementing robust authentication layers. Leveraging the Better Auth library, this skill streamlines the process of adding secure user management, from initial project setup to migrating existing systems. It offers a structured approach, ensuring that modern web applications benefit from comprehensive security features like passkeys and SSO, all while simplifying complex configurations. This skill is invaluable for anyone building secure, scalable TypeScript/JavaScript applications, providing step-by-step assistance for both new and mature projects.

# When to Use This Skill
- •Scaffolding a new TypeScript/JavaScript project with integrated authentication from scratch.
- •Migrating an existing application from a legacy authentication system to Better Auth.
- •Adding advanced authentication features like WebAuthn (passkeys) or enterprise SSO to an existing project.
- •Troubleshooting common authentication setup issues in a Better Auth-powered application.

# Pro Tips
- 💡Always begin by consulting the official Better Auth documentation (better-auth.com/docs) for the latest syntax and best practices, especially when dealing with specific framework integrations.
- 💡When migrating existing authentication, plan for incremental adoption. Focus on one part of the auth flow at a time (e.g., login, then registration, then session management) to minimize disruption.
- 💡Utilize the Better Auth CLI commands for migrations and generation (`npm run better-auth migrate`, `npm run better-auth generate`) to ensure your database schema and configuration files are correctly synchronized.

