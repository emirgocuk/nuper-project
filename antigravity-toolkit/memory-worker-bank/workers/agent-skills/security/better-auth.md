# better-auth
Source: https://antigravity.codes/agent-skills/security/better-auth

## AI Worker Instructions
When the user requests functionality related to better-auth, follow these guidelines and utilize this context.

## Scraped Content

# better-auth
```
d1Adapter()
```
```
drizzleAdapter(db, { provider: "sqlite" })
```
```
new Kysely({ dialect: new D1Dialect({ database: env.DB }) })
```
```
backgroundTasks
```
```
disableRedirect
```
```
@better-auth/sso
```
```
teamId
```
```
teamMembers
```
```
src/auth.ts
```
```
import { betterAuth } from "better-auth";import { Kysely, CamelCasePlugin } from "kysely";import { D1Dialect } from "kysely-d1";type Env = {  DB: D1Database;  BETTER_AUTH_SECRET: string;  // ... other env vars};export function createAuth(env: Env) {  return betterAuth({    secret: env.BETTER_AUTH_SECRET,    // Kysely with D1Dialect    database: {      db: new Kysely({        dialect: new D1Dialect({          database: env.DB,        }),        plugins: [          // CRITICAL: Required if using Drizzle schema with snake_case          new CamelCasePlugin(),        ],      }),      type: "sqlite",    },    emailAndPassword: {      enabled: true,    },    // ... other config  });}
```
```
import { betterAuth } from "better-auth";import { Kysely, CamelCasePlugin } from "kysely";import { D1Dialect } from "kysely-d1";type Env = {  DB: D1Database;  BETTER_AUTH_SECRET: string;  // ... other env vars};export function createAuth(env: Env) {  return betterAuth({    secret: env.BETTER_AUTH_SECRET,    // Kysely with D1Dialect    database: {      db: new Kysely({        dialect: new D1Dialect({          database: env.DB,        }),        plugins: [          // CRITICAL: Required if using Drizzle schema with snake_case          new CamelCasePlugin(),        ],      }),      type: "sqlite",    },    emailAndPassword: {      enabled: true,    },    // ... other config  });}
```
```
snake_case
```
```
email_verified
```
```
camelCase
```
```
emailVerified
```
```
CamelCasePlugin
```
```
fetch()
```
```
// ❌ WRONG - DB binding not available outside requestconst db = drizzle(env.DB, { schema }) // env.DB doesn't exist hereexport const auth = betterAuth({ database: drizzleAdapter(db, { provider: "sqlite" }) })// ✅ CORRECT - Create auth instance per-requestexport default {  fetch(request, env, ctx) {    const db = drizzle(env.DB, { schema })    const auth = betterAuth({ database: drizzleAdapter(db, { provider: "sqlite" }) })    return auth.handler(request)  }}
```
```
// ❌ WRONG - DB binding not available outside requestconst db = drizzle(env.DB, { schema }) // env.DB doesn't exist hereexport const auth = betterAuth({ database: drizzleAdapter(db, { provider: "sqlite" }) })// ✅ CORRECT - Create auth instance per-requestexport default {  fetch(request, env, ctx) {    const db = drizzle(env.DB, { schema })    const auth = betterAuth({ database: drizzleAdapter(db, { provider: "sqlite" }) })    return auth.handler(request)  }}
```
```
reactStartCookies
```
```
import { betterAuth } from "better-auth";import { drizzleAdapter } from "better-auth/adapters/drizzle";import { reactStartCookies } from "better-auth/react-start";export const auth = betterAuth({  database: drizzleAdapter(db, { provider: "sqlite" }),  plugins: [    twoFactor(),    organization(),    reactStartCookies(), // ⚠️ MUST be LAST plugin  ],});
```
```
import { betterAuth } from "better-auth";import { drizzleAdapter } from "better-auth/adapters/drizzle";import { reactStartCookies } from "better-auth/react-start";export const auth = betterAuth({  database: drizzleAdapter(db, { provider: "sqlite" }),  plugins: [    twoFactor(),    organization(),    reactStartCookies(), // ⚠️ MUST be LAST plugin  ],});
```
```
signInEmail()
```
```
signUpEmail()
```
```
reactStartCookies
```
```
useSession()
```
```
session.user
```
```
session.session
```
```
null
```
```
const { data: session } = authClient.useSession()// When NOT logged in:console.log(session) // { user: null, session: null }console.log(!!session) // true (unexpected!)// Correct check:if (session?.user) {  // User is logged in}
```
```
const { data: session } = authClient.useSession()// When NOT logged in:console.log(session) // { user: null, session: null }console.log(!!session) // true (unexpected!)// Correct check:if (session?.user) {  // User is logged in}
```
```
session?.user
```
```
session?.session
```
```
session
```
```
/src/routes/api/auth/$.ts
```
```
import { auth } from '@/lib/auth'import { createFileRoute } from '@tanstack/react-router'export const Route = createFileRoute('/api/auth/$')({  server: {    handlers: {      GET: ({ request }) => auth.handler(request),      POST: ({ request }) => auth.handler(request),    },  },})
```
```
import { auth } from '@/lib/auth'import { createFileRoute } from '@tanstack/react-router'export const Route = createFileRoute('/api/auth/$')({  server: {    handlers: {      GET: ({ request }) => auth.handler(request),      POST: ({ request }) => auth.handler(request),    },  },})
```
```
better-auth/plugins
```
```
better-auth/plugins
```
```
better-auth/plugins
```
```
better-auth/plugins
```
```
better-auth/expo
```
```
webBrowserOptions
```
```
import { betterAuth } from "better-auth";import { oauthProvider } from "better-auth/plugins";import { jwt } from "better-auth/plugins";export const auth = betterAuth({  plugins: [    jwt(), // Required for token signing    oauthProvider({      // Token expiration (seconds)      accessTokenExpiresIn: 3600,      // 1 hour      refreshTokenExpiresIn: 2592000,  // 30 days      authorizationCodeExpiresIn: 600, // 10 minutes    }),  ],});
```
```
import { betterAuth } from "better-auth";import { oauthProvider } from "better-auth/plugins";import { jwt } from "better-auth/plugins";export const auth = betterAuth({  plugins: [    jwt(), // Required for token signing    oauthProvider({      // Token expiration (seconds)      accessTokenExpiresIn: 3600,      // 1 hour      refreshTokenExpiresIn: 2592000,  // 30 days      authorizationCodeExpiresIn: 600, // 10 minutes    }),  ],});
```
```
authorization_code
```
```
refresh_token
```
```
client_credentials
```
```
/oauth2/userinfo
```
```
// app/api/.well-known/oauth-authorization-server/route.tsexport async function GET() {  return Response.json({    issuer: process.env.BETTER_AUTH_URL,    authorization_endpoint: ${process.env.BETTER_AUTH_URL}/api/auth/oauth2/authorize,    token_endpoint: ${process.env.BETTER_AUTH_URL}/api/auth/oauth2/token,    // ... other metadata  });}
```
```
// app/api/.well-known/oauth-authorization-server/route.tsexport async function GET() {  return Response.json({    issuer: process.env.BETTER_AUTH_URL,    authorization_endpoint: ${process.env.BETTER_AUTH_URL}/api/auth/oauth2/authorize,    token_endpoint: ${process.env.BETTER_AUTH_URL}/api/auth/oauth2/token,    // ... other metadata  });}
```
```
${process.env.BETTER_AUTH_URL}/api/auth/oauth2/authorize
```
```
${process.env.BETTER_AUTH_URL}/api/auth/oauth2/token
```
```
const client = await auth.api.createOAuthClient({  body: {    name: "My MCP Server",    redirectURLs: ["https://claude.ai/callback"],    type: "public", // or "confidential"  },});// Returns: { clientId, clientSecret (if confidential) }
```
```
const client = await auth.api.createOAuthClient({  body: {    name: "My MCP Server",    redirectURLs: ["https://claude.ai/callback"],    type: "public", // or "confidential"  },});// Returns: { clientId, clientSecret (if confidential) }
```
```
import { bearer } from "better-auth/plugins";import { bearerClient } from "better-auth/client/plugins";// Serverexport const auth = betterAuth({  plugins: [bearer()],});// Client - Store token after sign-inconst { token } = await authClient.signIn.email({ email, password });localStorage.setItem("auth_token", token);// Client - Configure fetch to include tokenconst authClient = createAuthClient({  plugins: [bearerClient()],  fetchOptions: {    auth: { type: "Bearer", token: () => localStorage.getItem("auth_token") },  },});
```
```
import { bearer } from "better-auth/plugins";import { bearerClient } from "better-auth/client/plugins";// Serverexport const auth = betterAuth({  plugins: [bearer()],});// Client - Store token after sign-inconst { token } = await authClient.signIn.email({ email, password });localStorage.setItem("auth_token", token);// Client - Configure fetch to include tokenconst authClient = createAuthClient({  plugins: [bearerClient()],  fetchOptions: {    auth: { type: "Bearer", token: () => localStorage.getItem("auth_token") },  },});
```
```
import { oneTap } from "better-auth/plugins";import { oneTapClient } from "better-auth/client/plugins";// Serverexport const auth = betterAuth({  plugins: [oneTap()],});// ClientauthClient.oneTap({  onSuccess: (session) => {    window.location.href = "/dashboard";  },});
```
```
import { oneTap } from "better-auth/plugins";import { oneTapClient } from "better-auth/client/plugins";// Serverexport const auth = betterAuth({  plugins: [oneTap()],});// ClientauthClient.oneTap({  onSuccess: (session) => {    window.location.href = "/dashboard";  },});
```
```
import { anonymous } from "better-auth/plugins";// Serverexport const auth = betterAuth({  plugins: [    anonymous({      emailDomainName: "anon.example.com", // temp@{id}.anon.example.com      onLinkAccount: async ({ anonymousUser, newUser }) => {        // Migrate anonymous user data to linked account        await migrateUserData(anonymousUser.id, newUser.id);      },    }),  ],});// Clientawait authClient.signIn.anonymous();// Later: user can link to real account via signIn.social/email
```
```
import { anonymous } from "better-auth/plugins";// Serverexport const auth = betterAuth({  plugins: [    anonymous({      emailDomainName: "anon.example.com", // temp@{id}.anon.example.com      onLinkAccount: async ({ anonymousUser, newUser }) => {        // Migrate anonymous user data to linked account        await migrateUserData(anonymousUser.id, newUser.id);      },    }),  ],});// Clientawait authClient.signIn.anonymous();// Later: user can link to real account via signIn.social/email
```
```
import { genericOAuth } from "better-auth/plugins";export const auth = betterAuth({  plugins: [    genericOAuth({      config: [        {          providerId: "linear",          clientId: env.LINEAR_CLIENT_ID,          clientSecret: env.LINEAR_CLIENT_SECRET,          discoveryUrl: "https://linear.app/.well-known/openid-configuration",          scopes: ["openid", "email", "profile"],          pkce: true, // Recommended        },      ],    }),  ],});
```
```
import { genericOAuth } from "better-auth/plugins";export const auth = betterAuth({  plugins: [    genericOAuth({      config: [        {          providerId: "linear",          clientId: env.LINEAR_CLIENT_ID,          clientSecret: env.LINEAR_CLIENT_SECRET,          discoveryUrl: "https://linear.app/.well-known/openid-configuration",          scopes: ["openid", "email", "profile"],          pkce: true, // Recommended        },      ],    }),  ],});
```
```
{baseURL}/api/auth/oauth2/callback/{providerId}
```
```
export const auth = betterAuth({  rateLimit: {    window: 60,  // seconds (default: 60)    max: 100,    // requests per window (default: 100)    // Custom rules for sensitive endpoints    customRules: {      "/sign-in/email": { window: 10, max: 3 },      "/two-factor/*": { window: 10, max: 3 },      "/forget-password": { window: 60, max: 5 },    },    // Use Redis/KV for distributed systems    storage: "secondary-storage", // or "database"  },  // Secondary storage for rate limiting  secondaryStorage: {    get: async (key) => env.KV.get(key),    set: async (key, value, ttl) => env.KV.put(key, value, { expirationTtl: ttl }),    delete: async (key) => env.KV.delete(key),  },});
```
```
export const auth = betterAuth({  rateLimit: {    window: 60,  // seconds (default: 60)    max: 100,    // requests per window (default: 100)    // Custom rules for sensitive endpoints    customRules: {      "/sign-in/email": { window: 10, max: 3 },      "/two-factor/*": { window: 10, max: 3 },      "/forget-password": { window: 60, max: 5 },    },    // Use Redis/KV for distributed systems    storage: "secondary-storage", // or "database"  },  // Secondary storage for rate limiting  secondaryStorage: {    get: async (key) => env.KV.get(key),    set: async (key, value, ttl) => env.KV.put(key, value, { expirationTtl: ttl }),    delete: async (key) => env.KV.delete(key),  },});
```
```
auth.api.*
```
```
export const auth = betterAuth({  session: {    // Stateless: No database storage, session lives in cookie only    storage: undefined, // or omit entirely    // Cookie configuration    cookieCache: {      enabled: true,      maxAge: 60 * 60 * 24 * 7, // 7 days      encoding: "jwt", // Use JWT for stateless (not "compact")    },    // Session expiration    expiresIn: 60 * 60 * 24 * 7, // 7 days  },});
```
```
export const auth = betterAuth({  session: {    // Stateless: No database storage, session lives in cookie only    storage: undefined, // or omit entirely    // Cookie configuration    cookieCache: {      enabled: true,      maxAge: 60 * 60 * 24 * 7, // 7 days      encoding: "jwt", // Use JWT for stateless (not "compact")    },    // Session expiration    expiresIn: 60 * 60 * 24 * 7, // 7 days  },});
```
```
encoding: "jwt"
```
```
"jwe"
```
```
BETTER_AUTH_SECRET
```
```
import { jwt } from "better-auth/plugins";export const auth = betterAuth({  plugins: [    jwt({      // Key rotation (optional, enterprise security)      keyRotation: {        enabled: true,        rotationInterval: 60 * 60 * 24 * 30, // Rotate every 30 days        keepPreviousKeys: 3, // Keep 3 old keys for validation      },      // Custom signing algorithm (default: HS256)      algorithm: "RS256", // Requires asymmetric keys      // JWKS endpoint (auto-generated at /api/auth/jwks)      exposeJWKS: true,    }),  ],});
```
```
import { jwt } from "better-auth/plugins";export const auth = betterAuth({  plugins: [    jwt({      // Key rotation (optional, enterprise security)      keyRotation: {        enabled: true,        rotationInterval: 60 * 60 * 24 * 30, // Rotate every 30 days        keepPreviousKeys: 3, // Keep 3 old keys for validation      },      // Custom signing algorithm (default: HS256)      algorithm: "RS256", // Requires asymmetric keys      // JWKS endpoint (auto-generated at /api/auth/jwks)      exposeJWKS: true,    }),  ],});
```
```
/api/auth/jwks
```
```
openid
```
```
email
```
```
profile
```
```
user:email
```
```
read:user
```
```
openid
```
```
email
```
```
profile
```
```
User.Read
```
```
identify
```
```
email
```
```
name
```
```
email
```
```
identity
```
```
identity[email]
```
```
socialProviders: {  google: {    clientId: env.GOOGLE_CLIENT_ID,    clientSecret: env.GOOGLE_CLIENT_SECRET,    scope: ["openid", "email", "profile"], // All user data  },  github: {    clientId: env.GITHUB_CLIENT_ID,    clientSecret: env.GITHUB_CLIENT_SECRET,    scope: ["user:email", "read:user"], // Email + full profile  },  microsoft: {    clientId: env.MS_CLIENT_ID,    clientSecret: env.MS_CLIENT_SECRET,    scope: ["openid", "email", "profile", "User.Read"],  },}
```
```
socialProviders: {  google: {    clientId: env.GOOGLE_CLIENT_ID,    clientSecret: env.GOOGLE_CLIENT_SECRET,    scope: ["openid", "email", "profile"], // All user data  },  github: {    clientId: env.GITHUB_CLIENT_ID,    clientSecret: env.GITHUB_CLIENT_SECRET,    scope: ["user:email", "read:user"], // Email + full profile  },  microsoft: {    clientId: env.MS_CLIENT_ID,    clientSecret: env.MS_CLIENT_SECRET,    scope: ["openid", "email", "profile", "User.Read"],  },}
```
```
export const auth = betterAuth({  session: {    cookieCache: {      enabled: true,      maxAge: 300, // 5 minutes      encoding: "compact", // or "jwt" or "jwe"    },    freshAge: 60 * 60 * 24, // 1 day - operations requiring fresh session  },});
```
```
export const auth = betterAuth({  session: {    cookieCache: {      enabled: true,      maxAge: 300, // 5 minutes      encoding: "compact", // or "jwt" or "jwe"    },    freshAge: 60 * 60 * 24, // 1 day - operations requiring fresh session  },});
```
```
freshAge
```
```
socialProviders: {  // Patreon - Creator economy  patreon: {    clientId: env.PATREON_CLIENT_ID,    clientSecret: env.PATREON_CLIENT_SECRET,    scope: ["identity", "identity[email]"],  },  // Kick - Streaming platform (with refresh tokens)  kick: {    clientId: env.KICK_CLIENT_ID,    clientSecret: env.KICK_CLIENT_SECRET,  },  // Vercel - Developer platform  vercel: {    clientId: env.VERCEL_CLIENT_ID,    clientSecret: env.VERCEL_CLIENT_SECRET,  },}
```
```
socialProviders: {  // Patreon - Creator economy  patreon: {    clientId: env.PATREON_CLIENT_ID,    clientSecret: env.PATREON_CLIENT_SECRET,    scope: ["identity", "identity[email]"],  },  // Kick - Streaming platform (with refresh tokens)  kick: {    clientId: env.KICK_CLIENT_ID,    clientSecret: env.KICK_CLIENT_SECRET,  },  // Vercel - Developer platform  vercel: {    clientId: env.VERCEL_CLIENT_ID,    clientSecret: env.VERCEL_CLIENT_SECRET,  },}
```
```
# wrangler.tomlcompatibility_flags = ["nodejs_compat"]# or for older Workers:# compatibility_flags = ["nodejs_als"]
```
```
# wrangler.tomlcompatibility_flags = ["nodejs_compat"]# or for older Workers:# compatibility_flags = ["nodejs_als"]
```
```
export const auth = betterAuth({  databaseHooks: {    user: {      create: {        before: async (user, ctx) => {          // Validate or modify before creation          if (user.email?.endsWith("@blocked.com")) {            throw new APIError("BAD_REQUEST", { message: "Email domain not allowed" });          }          return { data: { ...user, role: "member" } };        },        after: async (user, ctx) => {          // Send welcome email, create related records, etc.          await sendWelcomeEmail(user.email);          await createDefaultWorkspace(user.id);        },      },    },    session: {      create: {        after: async (session, ctx) => {          // Audit logging          await auditLog.create({ action: "session_created", userId: session.userId });        },      },    },  },});
```
```
export const auth = betterAuth({  databaseHooks: {    user: {      create: {        before: async (user, ctx) => {          // Validate or modify before creation          if (user.email?.endsWith("@blocked.com")) {            throw new APIError("BAD_REQUEST", { message: "Email domain not allowed" });          }          return { data: { ...user, role: "member" } };        },        after: async (user, ctx) => {          // Send welcome email, create related records, etc.          await sendWelcomeEmail(user.email);          await createDefaultWorkspace(user.id);        },      },    },    session: {      create: {        after: async (session, ctx) => {          // Audit logging          await auditLog.create({ action: "session_created", userId: session.userId });        },      },    },  },});
```
```
create
```
```
update
```
```
user
```
```
session
```
```
account
```
```
verification
```
```
// Client setup with secure storageimport { expoClient } from "@better-auth/expo";import * as SecureStore from "expo-secure-store";const authClient = createAuthClient({  baseURL: "https://api.example.com",  plugins: [expoClient({ storage: SecureStore })],});// OAuth with deep linkingawait authClient.signIn.social({  provider: "google",  callbackURL: "myapp://auth/callback", // Deep link});// Or use ID token verification (no redirect)await authClient.signIn.social({  provider: "google",  idToken: {    token: googleIdToken,    nonce: generatedNonce,  },});// Authenticated requestsconst cookie = await authClient.getCookie();await fetch("https://api.example.com/data", {  headers: { Cookie: cookie },  credentials: "omit",});
```
```
// Client setup with secure storageimport { expoClient } from "@better-auth/expo";import * as SecureStore from "expo-secure-store";const authClient = createAuthClient({  baseURL: "https://api.example.com",  plugins: [expoClient({ storage: SecureStore })],});// OAuth with deep linkingawait authClient.signIn.social({  provider: "google",  callbackURL: "myapp://auth/callback", // Deep link});// Or use ID token verification (no redirect)await authClient.signIn.social({  provider: "google",  idToken: {    token: googleIdToken,    nonce: generatedNonce,  },});// Authenticated requestsconst cookie = await authClient.getCookie();await fetch("https://api.example.com/data", {  headers: { Cookie: cookie },  credentials: "omit",});
```
```
{  "expo": {    "scheme": "myapp"  }}
```
```
{  "expo": {    "scheme": "myapp"  }}
```
```
trustedOrigins: ["exp://**", "myapp://"]
```
```
trustedOrigins: ["exp://**", "myapp://"]
```
```
auth.handler()
```
```
/api/auth/*
```
```
auth.api.*
```
```
auth.api.*
```
```
/api/auth/*
```
```
auth.handler()
```
```
/sign-up/email
```
```
/sign-in/email
```
```
/sign-out
```
```
/change-password
```
```
/forget-password
```
```
/reset-password
```
```
/send-verification-email
```
```
/verify-email
```
```
?token=<token>
```
```
/get-session
```
```
/list-sessions
```
```
/revoke-session
```
```
/revoke-other-sessions
```
```
/revoke-sessions
```
```
/update-user
```
```
/change-email
```
```
/set-password
```
```
/delete-user
```
```
/list-accounts
```
```
/link-social
```
```
/unlink-account
```
```
/sign-in/social
```
```
/callback/:provider
```
```
/callback/google
```
```
/get-access-token
```
```
// Client initiatesawait authClient.signIn.social({  provider: "google",  callbackURL: "/dashboard",});// better-auth handles redirect to Google// Google redirects back to /api/auth/callback/google// better-auth creates session automatically
```
```
// Client initiatesawait authClient.signIn.social({  provider: "google",  callbackURL: "/dashboard",});// better-auth handles redirect to Google// Google redirects back to /api/auth/callback/google// better-auth creates session automatically
```
```
import { twoFactor } from "better-auth/plugins";
```
```
import { twoFactor } from "better-auth/plugins";
```
```
/two-factor/enable
```
```
/two-factor/disable
```
```
/two-factor/get-totp-uri
```
```
/two-factor/verify-totp
```
```
/two-factor/send-otp
```
```
/two-factor/verify-otp
```
```
/two-factor/generate-backup-codes
```
```
/two-factor/verify-backup-code
```
```
/two-factor/view-backup-codes
```
```
import { organization } from "better-auth/plugins";
```
```
import { organization } from "better-auth/plugins";
```
```
/organization/create
```
```
/organization/list
```
```
/organization/get-full
```
```
/organization/update
```
```
/organization/delete
```
```
/organization/check-slug
```
```
/organization/set-active
```
```
/organization/list-members
```
```
/organization/add-member
```
```
/organization/remove-member
```
```
/organization/update-member-role
```
```
/organization/get-active-member
```
```
/organization/leave
```
```
/organization/invite-member
```
```
/organization/accept-invitation
```
```
/organization/reject-invitation
```
```
/organization/cancel-invitation
```
```
/organization/get-invitation
```
```
/organization/list-invitations
```
```
/organization/list-user-invitations
```
```
/organization/create-team
```
```
/organization/list-teams
```
```
/organization/update-team
```
```
/organization/remove-team
```
```
/organization/set-active-team
```
```
/organization/list-team-members
```
```
/organization/add-team-member
```
```
/organization/remove-team-member
```
```
/organization/has-permission
```
```
/organization/create-role
```
```
/organization/delete-role
```
```
/organization/list-roles
```
```
/organization/get-role
```
```
/organization/update-role
```
```
import { admin } from "better-auth/plugins";// v1.4.10 configuration optionsadmin({  defaultRole: "user",  adminRoles: ["admin"],  adminUserIds: ["user_abc123"], // Always grant admin to specific users  impersonationSessionDuration: 3600, // 1 hour (seconds)  allowImpersonatingAdmins: false, // ⚠️ Default changed in v1.4.6  defaultBanReason: "Violation of Terms of Service",  bannedUserMessage: "Your account has been suspended",})
```
```
import { admin } from "better-auth/plugins";// v1.4.10 configuration optionsadmin({  defaultRole: "user",  adminRoles: ["admin"],  adminUserIds: ["user_abc123"], // Always grant admin to specific users  impersonationSessionDuration: 3600, // 1 hour (seconds)  allowImpersonatingAdmins: false, // ⚠️ Default changed in v1.4.6  defaultBanReason: "Violation of Terms of Service",  bannedUserMessage: "Your account has been suspended",})
```
```
/admin/create-user
```
```
/admin/list-users
```
```
/admin/set-role
```
```
/admin/set-user-password
```
```
/admin/update-user
```
```
/admin/remove-user
```
```
/admin/ban-user
```
```
/admin/unban-user
```
```
/admin/list-user-sessions
```
```
/admin/revoke-user-session
```
```
/admin/revoke-user-sessions
```
```
/admin/impersonate-user
```
```
/admin/stop-impersonating
```
```
allowImpersonatingAdmins
```
```
false
```
```
true
```
```
import { createAccessControl } from "better-auth/plugins/access";// Define resources and permissionsconst ac = createAccessControl({  user: ["create", "read", "update", "delete", "ban", "impersonate"],  project: ["create", "read", "update", "delete", "share"],} as const);// Create custom rolesconst supportRole = ac.newRole({  user: ["read", "ban"],      // Can view and ban users  project: ["read"],          // Can view projects});const managerRole = ac.newRole({  user: ["read", "update"],  project: ["create", "read", "update", "delete"],});// Use in pluginadmin({  ac,  roles: {    support: supportRole,    manager: managerRole,  },})
```
```
import { createAccessControl } from "better-auth/plugins/access";// Define resources and permissionsconst ac = createAccessControl({  user: ["create", "read", "update", "delete", "ban", "impersonate"],  project: ["create", "read", "update", "delete", "share"],} as const);// Create custom rolesconst supportRole = ac.newRole({  user: ["read", "ban"],      // Can view and ban users  project: ["read"],          // Can view projects});const managerRole = ac.newRole({  user: ["read", "update"],  project: ["create", "read", "update", "delete"],});// Use in pluginadmin({  ac,  roles: {    support: supportRole,    manager: managerRole,  },})
```
```
/passkey/add
```
```
/sign-in/passkey
```
```
/passkey/list
```
```
/passkey/delete
```
```
/passkey/update
```
```
/sign-in/magic-link
```
```
/magic-link/verify
```
```
/sign-in/username
```
```
/username/is-available
```
```
/sign-in/phone-number
```
```
/phone-number/send-otp
```
```
/phone-number/verify
```
```
/phone-number/request-password-reset
```
```
/phone-number/reset-password
```
```
/email-otp/send-verification-otp
```
```
/email-otp/check-verification-otp
```
```
/sign-in/email-otp
```
```
/email-otp/verify-email
```
```
/forget-password/email-otp
```
```
/email-otp/reset-password
```
```
/sign-in/anonymous
```
```
/token
```
```
/jwks
```
```
/reference
```
```
/generate-openapi-schema
```
```
auth.api.*
```
```
// Authenticationawait auth.api.signUpEmail({  body: { email, password, name },  headers: request.headers,});await auth.api.signInEmail({  body: { email, password, rememberMe: true },  headers: request.headers,});await auth.api.signOut({ headers: request.headers });// Session Managementconst session = await auth.api.getSession({ headers: request.headers });await auth.api.listSessions({ headers: request.headers });await auth.api.revokeSession({  body: { token: "session_token_here" },  headers: request.headers,});// User Managementawait auth.api.updateUser({  body: { name: "New Name", image: "https://..." },  headers: request.headers,});await auth.api.changeEmail({  body: { newEmail: "newemail@example.com" },  headers: request.headers,});await auth.api.deleteUser({  body: { password: "current_password" },  headers: request.headers,});// Account Linkingawait auth.api.linkSocialAccount({  body: { provider: "google" },  headers: request.headers,});await auth.api.unlinkAccount({  body: { providerId: "google", accountId: "google_123" },  headers: request.headers,});
```
```
// Authenticationawait auth.api.signUpEmail({  body: { email, password, name },  headers: request.headers,});await auth.api.signInEmail({  body: { email, password, rememberMe: true },  headers: request.headers,});await auth.api.signOut({ headers: request.headers });// Session Managementconst session = await auth.api.getSession({ headers: request.headers });await auth.api.listSessions({ headers: request.headers });await auth.api.revokeSession({  body: { token: "session_token_here" },  headers: request.headers,});// User Managementawait auth.api.updateUser({  body: { name: "New Name", image: "https://..." },  headers: request.headers,});await auth.api.changeEmail({  body: { newEmail: "newemail@example.com" },  headers: request.headers,});await auth.api.deleteUser({  body: { password: "current_password" },  headers: request.headers,});// Account Linkingawait auth.api.linkSocialAccount({  body: { provider: "google" },  headers: request.headers,});await auth.api.unlinkAccount({  body: { providerId: "google", accountId: "google_123" },  headers: request.headers,});
```
```
// Enable 2FAconst { totpUri, backupCodes } = await auth.api.enableTwoFactor({  body: { issuer: "MyApp" },  headers: request.headers,});// Verify TOTP codeawait auth.api.verifyTOTP({  body: { code: "123456", trustDevice: true },  headers: request.headers,});// Generate backup codesconst { backupCodes } = await auth.api.generateBackupCodes({  headers: request.headers,});
```
```
// Enable 2FAconst { totpUri, backupCodes } = await auth.api.enableTwoFactor({  body: { issuer: "MyApp" },  headers: request.headers,});// Verify TOTP codeawait auth.api.verifyTOTP({  body: { code: "123456", trustDevice: true },  headers: request.headers,});// Generate backup codesconst { backupCodes } = await auth.api.generateBackupCodes({  headers: request.headers,});
```
```
// Create organizationconst org = await auth.api.createOrganization({  body: { name: "Acme Corp", slug: "acme" },  headers: request.headers,});// Add memberawait auth.api.addMember({  body: {    userId: "user_123",    role: "admin",    organizationId: org.id,  },  headers: request.headers,});// Check permissionsconst hasPermission = await auth.api.hasPermission({  body: {    organizationId: org.id,    permission: "users:delete",  },  headers: request.headers,});
```
```
// Create organizationconst org = await auth.api.createOrganization({  body: { name: "Acme Corp", slug: "acme" },  headers: request.headers,});// Add memberawait auth.api.addMember({  body: {    userId: "user_123",    role: "admin",    organizationId: org.id,  },  headers: request.headers,});// Check permissionsconst hasPermission = await auth.api.hasPermission({  body: {    organizationId: org.id,    permission: "users:delete",  },  headers: request.headers,});
```
```
// List users with paginationconst users = await auth.api.listUsers({  query: {    search: "john",    limit: 10,    offset: 0,    sortBy: "createdAt",    sortOrder: "desc",  },  headers: request.headers,});// Ban userawait auth.api.banUser({  body: {    userId: "user_123",    reason: "Violation of ToS",    expiresAt: new Date("2025-12-31"),  },  headers: request.headers,});// Impersonate user (for admin support)const impersonationSession = await auth.api.impersonateUser({  body: {    userId: "user_123",    expiresIn: 3600, // 1 hour  },  headers: request.headers,});
```
```
// List users with paginationconst users = await auth.api.listUsers({  query: {    search: "john",    limit: 10,    offset: 0,    sortBy: "createdAt",    sortOrder: "desc",  },  headers: request.headers,});// Ban userawait auth.api.banUser({  body: {    userId: "user_123",    reason: "Violation of ToS",    expiresAt: new Date("2025-12-31"),  },  headers: request.headers,});// Impersonate user (for admin support)const impersonationSession = await auth.api.impersonateUser({  body: {    userId: "user_123",    expiresIn: 3600, // 1 hour  },  headers: request.headers,});
```
```
auth.api.*
```
```
import { Hono } from "hono";import { createAuth } from "./auth";import { createDatabase } from "./db";const app = new Hono<{ Bindings: Env }>();// Middleware using server-side APIapp.use("/api/protected/*", async (c, next) => {  const db = createDatabase(c.env.DB);  const auth = createAuth(db, c.env);  // Use server-side method  const session = await auth.api.getSession({    headers: c.req.raw.headers,  });  if (!session) {    return c.json({ error: "Unauthorized" }, 401);  }  // Attach to context  c.set("user", session.user);  c.set("session", session.session);  await next();});// Protected routeapp.get("/api/protected/profile", async (c) => {  const user = c.get("user");  return c.json({ user });});
```
```
import { Hono } from "hono";import { createAuth } from "./auth";import { createDatabase } from "./db";const app = new Hono<{ Bindings: Env }>();// Middleware using server-side APIapp.use("/api/protected/*", async (c, next) => {  const db = createDatabase(c.env.DB);  const auth = createAuth(db, c.env);  // Use server-side method  const session = await auth.api.getSession({    headers: c.req.raw.headers,  });  if (!session) {    return c.json({ error: "Unauthorized" }, 401);  }  // Attach to context  c.set("user", session.user);  c.set("session", session.session);  await next();});// Protected routeapp.get("/api/protected/profile", async (c) => {  const user = c.get("user");  return c.json({ user });});
```
```
import { betterAuth } from "better-auth";import { openAPI } from "better-auth/plugins";export const auth = betterAuth({  database: /* ... */,  plugins: [    openAPI(), // Adds /api/auth/reference endpoint  ],});
```
```
import { betterAuth } from "better-auth";import { openAPI } from "better-auth/plugins";export const auth = betterAuth({  database: /* ... */,  plugins: [    openAPI(), // Adds /api/auth/reference endpoint  ],});
```
```
http://localhost:8787/api/auth/reference
```
```
const schema = await auth.api.generateOpenAPISchema();console.log(JSON.stringify(schema, null, 2));// Returns full OpenAPI 3.0 spec
```
```
const schema = await auth.api.generateOpenAPISchema();console.log(JSON.stringify(schema, null, 2));// Returns full OpenAPI 3.0 spec
```
```
auth.handler()
```
```
import { d1Adapter } from 'better-auth/adapters/d1'
```
```
// ❌ WRONG - This doesn't existimport { d1Adapter } from 'better-auth/adapters/d1'database: d1Adapter(env.DB)// ✅ CORRECT - Use Drizzleimport { drizzleAdapter } from 'better-auth/adapters/drizzle'import { drizzle } from 'drizzle-orm/d1'const db = drizzle(env.DB, { schema })database: drizzleAdapter(db, { provider: "sqlite" })// ✅ CORRECT - Use Kyselyimport { Kysely } from 'kysely'import { D1Dialect } from 'kysely-d1'database: {  db: new Kysely({ dialect: new D1Dialect({ database: env.DB }) }),  type: "sqlite"}
```
```
// ❌ WRONG - This doesn't existimport { d1Adapter } from 'better-auth/adapters/d1'database: d1Adapter(env.DB)// ✅ CORRECT - Use Drizzleimport { drizzleAdapter } from 'better-auth/adapters/drizzle'import { drizzle } from 'drizzle-orm/d1'const db = drizzle(env.DB, { schema })database: drizzleAdapter(db, { provider: "sqlite" })// ✅ CORRECT - Use Kyselyimport { Kysely } from 'kysely'import { D1Dialect } from 'kysely-d1'database: {  db: new Kysely({ dialect: new D1Dialect({ database: env.DB }) }),  type: "sqlite"}
```
```
npx better-auth migrate
```
```
# Generate migration from Drizzle schemanpx drizzle-kit generate# Apply to D1wrangler d1 migrations apply my-app-db --remote
```
```
# Generate migration from Drizzle schemanpx drizzle-kit generate# Apply to D1wrangler d1 migrations apply my-app-db --remote
```
```
email_verified
```
```
emailVerified
```
```
CamelCasePlugin
```
```
_joined_user_user_id
```
```
_joinedUserUserId
```
```
// DB for better-auth (no CamelCasePlugin)const authDb = new Kysely({  dialect: new D1Dialect({ database: env.DB }),})// DB for app queries (with CamelCasePlugin)const appDb = new Kysely({  dialect: new D1Dialect({ database: env.DB }),  plugins: [new CamelCasePlugin()],})export const auth = betterAuth({  database: { db: authDb, type: "sqlite" },})
```
```
// DB for better-auth (no CamelCasePlugin)const authDb = new Kysely({  dialect: new D1Dialect({ database: env.DB }),})// DB for app queries (with CamelCasePlugin)const appDb = new Kysely({  dialect: new D1Dialect({ database: env.DB }),  plugins: [new CamelCasePlugin()],})export const auth = betterAuth({  database: { db: authDb, type: "sqlite" },})
```
```
getSession()
```
```
import { betterAuth } from "better-auth";export function createAuth(db: Database, env: Env) {  return betterAuth({    database: drizzleAdapter(db, { provider: "sqlite" }),    session: {      storage: {        get: async (sessionId) => {          const session = await env.SESSIONS_KV.get(sessionId);          return session ? JSON.parse(session) : null;        },        set: async (sessionId, session, ttl) => {          await env.SESSIONS_KV.put(sessionId, JSON.stringify(session), {            expirationTtl: ttl,          });        },        delete: async (sessionId) => {          await env.SESSIONS_KV.delete(sessionId);        },      },    },  });}
```
```
import { betterAuth } from "better-auth";export function createAuth(db: Database, env: Env) {  return betterAuth({    database: drizzleAdapter(db, { provider: "sqlite" }),    session: {      storage: {        get: async (sessionId) => {          const session = await env.SESSIONS_KV.get(sessionId);          return session ? JSON.parse(session) : null;        },        set: async (sessionId, session, ttl) => {          await env.SESSIONS_KV.put(sessionId, JSON.stringify(session), {            expirationTtl: ttl,          });        },        delete: async (sessionId) => {          await env.SESSIONS_KV.delete(sessionId);        },      },    },  });}
```
```
wrangler.toml
```
```
[[kv_namespaces]]binding = "SESSIONS_KV"id = "your-kv-namespace-id"
```
```
[[kv_namespaces]]binding = "SESSIONS_KV"id = "your-kv-namespace-id"
```
```
Access-Control-Allow-Origin
```
```
trustedOrigins
```
```
import { cors } from "hono/cors";// CRITICAL: Both must match frontend origin exactlyapp.use(  "/api/auth/*",  cors({    origin: "http://localhost:5173", // Frontend URL (no trailing slash)    credentials: true, // Allow cookies    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  }));// And in better-auth configexport const auth = betterAuth({  trustedOrigins: ["http://localhost:5173"], // Same as CORS origin  // ...});
```
```
import { cors } from "hono/cors";// CRITICAL: Both must match frontend origin exactlyapp.use(  "/api/auth/*",  cors({    origin: "http://localhost:5173", // Frontend URL (no trailing slash)    credentials: true, // Allow cookies    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  }));// And in better-auth configexport const auth = betterAuth({  trustedOrigins: ["http://localhost:5173"], // Same as CORS origin  // ...});
```
```
trustedOrigins
```
```
Provider setting: https://yourdomain.com/api/auth/callback/googlebetter-auth URL:  https://yourdomain.com/api/auth/callback/google❌ Wrong: http vs https, trailing slash, subdomain mismatch✅ Right: Exact character-for-character match
```
```
Provider setting: https://yourdomain.com/api/auth/callback/googlebetter-auth URL:  https://yourdomain.com/api/auth/callback/google❌ Wrong: http vs https, trailing slash, subdomain mismatch✅ Right: Exact character-for-character match
```
```
// It's always: {baseURL}/api/auth/callback/{provider}const callbackURL = ${env.BETTER_AUTH_URL}/api/auth/callback/google;console.log("Configure this URL in Google Console:", callbackURL);
```
```
// It's always: {baseURL}/api/auth/callback/{provider}const callbackURL = ${env.BETTER_AUTH_URL}/api/auth/callback/google;console.log("Configure this URL in Google Console:", callbackURL);
```
```
${env.BETTER_AUTH_URL}/api/auth/callback/google
```
```
Cannot find module 'drizzle-orm'
```
```
npm install better-auth drizzle-orm drizzle-kit @cloudflare/workers-types
```
```
npm install better-auth drizzle-orm drizzle-kit @cloudflare/workers-types
```
```
npm install better-auth kysely kysely-d1 @cloudflare/workers-types
```
```
npm install better-auth kysely kysely-d1 @cloudflare/workers-types
```
```
sendVerificationEmail
```
```
export const auth = betterAuth({  database: /* ... */,  emailAndPassword: {    enabled: true,    requireEmailVerification: true,  },  emailVerification: {    sendVerificationEmail: async ({ user, url }) => {      // Use your email service (SendGrid, Resend, etc.)      await sendEmail({        to: user.email,        subject: "Verify your email",        html:           <p>Click the link below to verify your email:</p>          <a href="${url}">Verify Email</a>        ,      });    },    sendOnSignUp: true,    autoSignInAfterVerification: true,    expiresIn: 3600, // 1 hour  },});
```
```
export const auth = betterAuth({  database: /* ... */,  emailAndPassword: {    enabled: true,    requireEmailVerification: true,  },  emailVerification: {    sendVerificationEmail: async ({ user, url }) => {      // Use your email service (SendGrid, Resend, etc.)      await sendEmail({        to: user.email,        subject: "Verify your email",        html:           <p>Click the link below to verify your email:</p>          <a href="${url}">Verify Email</a>        ,      });    },    sendOnSignUp: true,    autoSignInAfterVerification: true,    expiresIn: 3600, // 1 hour  },});
```
```
<p>Click the link below to verify your email:</p>          <a href="${url}">Verify Email</a>
```
```
export const auth = betterAuth({  database: /* ... */,  session: {    expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)    updateAge: 60 * 60 * 24, // Update session every 24 hours  },});
```
```
export const auth = betterAuth({  database: /* ... */,  session: {    expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)    updateAge: 60 * 60 * 24, // Update session every 24 hours  },});
```
```
session.user.name
```
```
socialProviders: {  google: {    clientId: env.GOOGLE_CLIENT_ID,    clientSecret: env.GOOGLE_CLIENT_SECRET,    scope: ["openid", "email", "profile"], // Include 'profile' for name/image  },  github: {    clientId: env.GITHUB_CLIENT_ID,    clientSecret: env.GITHUB_CLIENT_SECRET,    scope: ["user:email", "read:user"], // 'read:user' for full profile  },}
```
```
socialProviders: {  google: {    clientId: env.GOOGLE_CLIENT_ID,    clientSecret: env.GOOGLE_CLIENT_SECRET,    scope: ["openid", "email", "profile"], // Include 'profile' for name/image  },  github: {    clientId: env.GITHUB_CLIENT_ID,    clientSecret: env.GITHUB_CLIENT_SECRET,    scope: ["user:email", "read:user"], // 'read:user' for full profile  },}
```
```
Type 'DrizzleD1Database' is not assignable to...
```
```
// src/db/index.tsimport { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";import * as schema from "./schema";export type Database = DrizzleD1Database<typeof schema>;export function createDatabase(d1: D1Database): Database {  return drizzle(d1, { schema });}
```
```
// src/db/index.tsimport { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";import * as schema from "./schema";export type Database = DrizzleD1Database<typeof schema>;export function createDatabase(d1: D1Database): Database {  return drizzle(d1, { schema });}
```
```
wrangler dev
```
```
# Apply migrations to local D1wrangler d1 migrations apply my-app-db --local# Then run dev serverwrangler dev
```
```
# Apply migrations to local D1wrangler d1 migrations apply my-app-db --local# Then run dev serverwrangler dev
```
```
useSession()
```
```
queryClient.invalidateQueries()
```
```
queryClient.invalidateQueries()
```
```
// Update user dataconst { data, error } = await authClient.updateUser({  image: newAvatarUrl,  name: newName})if (!error) {  // Manually invalidate better-auth session state  authClient.$store.notify('$sessionSignal')  // Optional: Also invalidate React Query if using it for other data  queryClient.invalidateQueries({ queryKey: ['user-profile'] })}
```
```
// Update user dataconst { data, error } = await authClient.updateUser({  image: newAvatarUrl,  name: newName})if (!error) {  // Manually invalidate better-auth session state  authClient.$store.notify('$sessionSignal')  // Optional: Also invalidate React Query if using it for other data  queryClient.invalidateQueries({ queryKey: ['user-profile'] })}
```
```
refetch()
```
```
useSession()
```
```
$store.notify()
```
```
const { data: session, refetch } = authClient.useSession()// After updateawait refetch()
```
```
const { data: session, refetch } = authClient.useSession()// After updateawait refetch()
```
```
$store
```
```
npx @better-auth/cli generate
```
```
CREATE TABLE api_key (  id TEXT PRIMARY KEY NOT NULL,  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,  name TEXT,  start TEXT,  prefix TEXT,  key TEXT NOT NULL,  enabled INTEGER DEFAULT 1,  rate_limit_enabled INTEGER,  rate_limit_time_window INTEGER,  rate_limit_max INTEGER,  request_count INTEGER DEFAULT 0,  last_request INTEGER,  remaining INTEGER,  refill_interval INTEGER,  refill_amount INTEGER,  last_refill_at INTEGER,  expires_at INTEGER,  permissions TEXT,  metadata TEXT,  created_at INTEGER NOT NULL,  updated_at INTEGER NOT NULL);
```
```
CREATE TABLE api_key (  id TEXT PRIMARY KEY NOT NULL,  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,  name TEXT,  start TEXT,  prefix TEXT,  key TEXT NOT NULL,  enabled INTEGER DEFAULT 1,  rate_limit_enabled INTEGER,  rate_limit_time_window INTEGER,  rate_limit_max INTEGER,  request_count INTEGER DEFAULT 0,  last_request INTEGER,  remaining INTEGER,  refill_interval INTEGER,  refill_amount INTEGER,  last_refill_at INTEGER,  expires_at INTEGER,  permissions TEXT,  metadata TEXT,  created_at INTEGER NOT NULL,  updated_at INTEGER NOT NULL);
```
```
snake_case
```
```
rate_limit_time_window
```
```
rateLimitTimeWindow
```
```
ALTER TABLE DROP COLUMN
```
```
apikey
```
```
-- Drop in reverse dependency orderDROP TABLE IF EXISTS api_key;DROP TABLE IF EXISTS session;-- ... other tables-- Recreate with clean schemaCREATE TABLE api_key (...);
```
```
-- Drop in reverse dependency orderDROP TABLE IF EXISTS api_key;DROP TABLE IF EXISTS session;-- ... other tables-- Recreate with clean schemaCREATE TABLE api_key (...);
```
```
listUsers
```
```
requireAdmin
```
```
auth.api.listUsers()
```
```
user.role === 'admin'
```
```
-- Fix for existing usersUPDATE user SET role = 'admin' WHERE email = 'admin@example.com';
```
```
-- Fix for existing usersUPDATE user SET role = 'admin' WHERE email = 'admin@example.com';
```
```
listUsers
```
```
banUser
```
```
impersonateUser
```
```
user.role
```
```
wrangler tail
```
```
wrangler tail
```
```
Failed query: insert into "organization" ... values (?, ?, ?, null, null, ?, null)
```
```
null
```
```
updated_at
```
```
NOT NULL
```
```
updated_at
```
```
// Drizzle schema - CORRECTexport const organization = sqliteTable('organization', {  // ...  updatedAt: integer('updated_at', { mode: 'timestamp' }), // No .notNull()});export const team = sqliteTable('team', {  // ...  updatedAt: integer('updated_at', { mode: 'timestamp' }), // No .notNull()});
```
```
// Drizzle schema - CORRECTexport const organization = sqliteTable('organization', {  // ...  updatedAt: integer('updated_at', { mode: 'timestamp' }), // No .notNull()});export const team = sqliteTable('team', {  // ...  updatedAt: integer('updated_at', { mode: 'timestamp' }), // No .notNull()});
```
```
-- Migration - CORRECTCREATE TABLE organization (  -- ...  updated_at INTEGER  -- No NOT NULL);
```
```
-- Migration - CORRECTCREATE TABLE organization (  -- ...  updated_at INTEGER  -- No NOT NULL);
```
```
organization
```
```
team
```
```
wrangler tail
```
```
{ members: { members: [...], total: N } }
```
```
listMembers
```
```
{ members: [...], total: N }
```
```
c.json({ members: result })
```
```
// ❌ WRONG - Double nestingconst result = await auth.api.listMembers({ ... });return c.json({ members: result });// Returns: { members: { members: [...], total: N } }// ✅ CORRECT - Extract arrayconst result = await auth.api.listMembers({ ... });const members = result?.members || [];return c.json({ members });// Returns: { members: [...] }
```
```
// ❌ WRONG - Double nestingconst result = await auth.api.listMembers({ ... });return c.json({ members: result });// Returns: { members: { members: [...], total: N } }// ✅ CORRECT - Extract arrayconst result = await auth.api.listMembers({ ... });const members = result?.members || [];return c.json({ members });// Returns: { members: [...] }
```
```
listMembers
```
```
{ members: [...], total: N }
```
```
listUsers
```
```
{ users: [...], total: N, limit: N }
```
```
listOrganizations
```
```
{ organizations: [...] }
```
```
listInvitations
```
```
{ invitations: [...] }
```
```
expoClient
```
```
@better-auth/expo/client
```
```
TypeError: Cannot read property 'fromJSONSchema' of undefined
```
```
f4a9f15
```
```
// Crashes on v1.4.16import { expoClient } from '@better-auth/expo/client'// Workaround: Use continuous build at f4a9f15// Or wait for fix in next release
```
```
// Crashes on v1.4.16import { expoClient } from '@better-auth/expo/client'// Workaround: Use continuous build at f4a9f15// Or wait for fix in next release
```
```
additionalFields
```
```
type: 'string[]'
```
```
'["a","b"]'
```
```
user.notificationTokens
```
```
string[]
```
```
mode: 'json'
```
```
internalAdapter
```
```
internalAdapter
```
```
.jsonb()
```
```
// ConfigadditionalFields: {  notificationTokens: {    type: 'string[]',    required: true,    input: true,  },}// Create usernotificationTokens: ['token1', 'token2']// Result in DB (when querying via Drizzle directly)// '["token1","token2"]' (string, not array)
```
```
// ConfigadditionalFields: {  notificationTokens: {    type: 'string[]',    required: true,    input: true,  },}// Create usernotificationTokens: ['token1', 'token2']// Result in DB (when querying via Drizzle directly)// '["token1","token2"]' (string, not array)
```
```
returned: false
```
```
additionalFields
```
```
input: true
```
```
returned: false
```
```
input: true
```
```
returned: false
```
```
auth.api.*
```
```
// Organization plugin configadditionalFields: {  secretField: {    type: 'string',    required: true,    input: true,      // Should allow API writes    returned: false,  // Should only block reads, but blocks writes too  },}// API request to create organization// secretField is never saved to database
```
```
// Organization plugin configadditionalFields: {  secretField: {    type: 'string',    required: true,    input: true,      // Should allow API writes    returned: false,  // Should only block reads, but blocks writes too  },}// API request to create organization// secretField is never saved to database
```
```
session.freshAge
```
```
freshAge
```
```
freshSessionMiddleware
```
```
Date.now() - (session.updatedAt || session.createdAt)
```
```
updatedAt
```
```
updateAge
```
```
updateAge > freshAge
```
```
updatedAt
```
```
updateAge <= freshAge
```
```
// Configsession: {  expiresIn: 60 * 60 * 24 * 7,    // 7 days  freshAge: 60 * 60 * 24,          // 24 hours  updateAge: 60 * 60 * 24 * 3,     // 3 days (> freshAge!) ⚠️ PROBLEM  // CORRECT - updateAge <= freshAge  updateAge: 60 * 60 * 12,         // 12 hours (< freshAge)}// Timeline with bad config:// T+0h: User signs in (createdAt = now)// T+12h: User makes requests (session active, still fresh)// T+25h: User makes request (session active, BUT NOT FRESH - freshAge elapsed)// Result: "Fresh session required" endpoints reject active session
```
```
// Configsession: {  expiresIn: 60 * 60 * 24 * 7,    // 7 days  freshAge: 60 * 60 * 24,          // 24 hours  updateAge: 60 * 60 * 24 * 3,     // 3 days (> freshAge!) ⚠️ PROBLEM  // CORRECT - updateAge <= freshAge  updateAge: 60 * 60 * 12,         // 12 hours (< freshAge)}// Timeline with bad config:// T+0h: User signs in (createdAt = now)// T+12h: User makes requests (session active, still fresh)// T+25h: User makes request (session active, BUT NOT FRESH - freshAge elapsed)// Result: "Fresh session required" endpoints reject active session
```
```
{ "response": { ...tokens... } }
```
```
{ "access_token": "...", "token_type": "bearer" }
```
```
Bearer undefined
```
```
invalid_token
```
```
{ response, headers, status }
```
```
.response
```
```
// Expected (spec-compliant){ "access_token": "...", "token_type": "bearer", "expires_in": 3600 }// Actual (wrapped){ "response": { "access_token": "...", "token_type": "bearer", "expires_in": 3600 } }// Result: OAuth clients fail to parse, send Bearer undefined
```
```
// Expected (spec-compliant){ "access_token": "...", "token_type": "bearer", "expires_in": 3600 }// Actual (wrapped){ "response": { "access_token": "...", "token_type": "bearer", "expires_in": 3600 } }// Result: OAuth clients fail to parse, send Bearer undefined
```
```
Bearer undefined
```
```
// migration script   const clerkUsers = await fetchClerkUsers();   for (const clerkUser of clerkUsers) {     await db.insert(user).values({       id: clerkUser.id,       email: clerkUser.email,       emailVerified: clerkUser.email_verified,       name: clerkUser.first_name + " " + clerkUser.last_name,       image: clerkUser.profile_image_url,     });   }
```
```
// migration script   const clerkUsers = await fetchClerkUsers();   for (const clerkUser of clerkUsers) {     await db.insert(user).values({       id: clerkUser.id,       email: clerkUser.email,       emailVerified: clerkUser.email_verified,       name: clerkUser.first_name + " " + clerkUser.last_name,       image: clerkUser.profile_image_url,     });   }
```
```
// Before (Clerk)   import { useUser } from "@clerk/nextjs";   const { user } = useUser();   // After (better-auth)   import { authClient } from "@/lib/auth-client";   const { data: session } = authClient.useSession();   const user = session?.user;
```
```
// Before (Clerk)   import { useUser } from "@clerk/nextjs";   const { user } = useUser();   // After (better-auth)   import { authClient } from "@/lib/auth-client";   const { data: session } = authClient.useSession();   const user = session?.user;
```
```
// Before (Auth.js)   import NextAuth from "next-auth";   import GoogleProvider from "next-auth/providers/google";   export default NextAuth({     providers: [GoogleProvider({ /* ... */ })],   });   // After (better-auth)   import { betterAuth } from "better-auth";   export const auth = betterAuth({     socialProviders: {       google: { /* ... */ },     },   });
```
```
// Before (Auth.js)   import NextAuth from "next-auth";   import GoogleProvider from "next-auth/providers/google";   export default NextAuth({     providers: [GoogleProvider({ /* ... */ })],   });   // After (better-auth)   import { betterAuth } from "better-auth";   export const auth = betterAuth({     socialProviders: {       google: { /* ... */ },     },   });
```
```
// Before   import { useSession } from "next-auth/react";   // After   import { authClient } from "@/lib/auth-client";   const { data: session } = authClient.useSession();
```
```
// Before   import { useSession } from "next-auth/react";   // After   import { authClient } from "@/lib/auth-client";   const { data: session } = authClient.useSession();
```
```
d1Adapter
```
```
better-auth@1.4.10
```
```
drizzle-orm@0.45.1
```
```
drizzle-kit@0.31.8
```
```
kysely@0.28.9
```
```
kysely-d1@0.4.0
```
```
@cloudflare/workers-types@latest
```
```
hono@4.11.3
```
```
allowImpersonatingAdmins
```
```
false
```
```
/* ❌ This doesn't exist */import { d1Adapter } from 'better-auth/adapters/d1'database: d1Adapter(env.DB)/* ✅ Use Drizzle instead */import { drizzleAdapter } from 'better-auth/adapters/drizzle'import { drizzle } from 'drizzle-orm/d1'const db = drizzle(env.DB, { schema })database: drizzleAdapter(db, { provider: "sqlite" })/* ✅ Or use Kysely */import { Kysely } from 'kysely'import { D1Dialect } from 'kysely-d1'database: {  db: new Kysely({ dialect: new D1Dialect({ database: env.DB }) }),  type: "sqlite"}
```
```
/* ❌ This doesn't exist */import { d1Adapter } from 'better-auth/adapters/d1'database: d1Adapter(env.DB)/* ✅ Use Drizzle instead */import { drizzleAdapter } from 'better-auth/adapters/drizzle'import { drizzle } from 'drizzle-orm/d1'const db = drizzle(env.DB, { schema })database: drizzleAdapter(db, { provider: "sqlite" })/* ✅ Or use Kysely */import { Kysely } from 'kysely'import { D1Dialect } from 'kysely-d1'database: {  db: new Kysely({ dialect: new D1Dialect({ database: env.DB }) }),  type: "sqlite"}
```
```
/* ❌ CommonJS no longer supported (v1.4.0) */const { betterAuth } = require('better-auth')/* ✅ ESM only */import { betterAuth } from 'better-auth'/* ❌ MCP plugin deprecated (v1.4.9) */import { mcp } from 'better-auth/plugins'/* ✅ Use OAuth 2.1 Provider instead */import { oauthProvider, jwt } from 'better-auth/plugins'plugins: [jwt(), oauthProvider({ accessTokenExpiresIn: 3600 })]/* ❌ Admin impersonation of admins (v1.4.6 default changed) */admin() // allowImpersonatingAdmins now defaults to false/* ✅ Explicit if you need admin-on-admin impersonation */admin({ allowImpersonatingAdmins: true })
```
```
/* ❌ CommonJS no longer supported (v1.4.0) */const { betterAuth } = require('better-auth')/* ✅ ESM only */import { betterAuth } from 'better-auth'/* ❌ MCP plugin deprecated (v1.4.9) */import { mcp } from 'better-auth/plugins'/* ✅ Use OAuth 2.1 Provider instead */import { oauthProvider, jwt } from 'better-auth/plugins'plugins: [jwt(), oauthProvider({ accessTokenExpiresIn: 3600 })]/* ❌ Admin impersonation of admins (v1.4.6 default changed) */admin() // allowImpersonatingAdmins now defaults to false/* ✅ Explicit if you need admin-on-admin impersonation */admin({ allowImpersonatingAdmins: true })
```
```
/* ❌ Cookies won't set properly */export const auth = betterAuth({  plugins: [twoFactor(), organization()],})/* ✅ reactStartCookies MUST be last */import { reactStartCookies } from 'better-auth/react-start'export const auth = betterAuth({  plugins: [    twoFactor(),    organization(),    reactStartCookies(), // MUST be LAST  ],})
```
```
/* ❌ Cookies won't set properly */export const auth = betterAuth({  plugins: [twoFactor(), organization()],})/* ✅ reactStartCookies MUST be last */import { reactStartCookies } from 'better-auth/react-start'export const auth = betterAuth({  plugins: [    twoFactor(),    organization(),    reactStartCookies(), // MUST be LAST  ],})
```
```
/* ❌ TanStack Query invalidation doesn't update session */queryClient.invalidateQueries({ queryKey: ['user-profile'] })/* ✅ Notify nanostore after user updates */const { data, error } = await authClient.updateUser({ image: newAvatarUrl })if (!error) {  authClient.$store.notify('$sessionSignal')}
```
```
/* ❌ TanStack Query invalidation doesn't update session */queryClient.invalidateQueries({ queryKey: ['user-profile'] })/* ✅ Notify nanostore after user updates */const { data, error } = await authClient.updateUser({ image: newAvatarUrl })if (!error) {  authClient.$store.notify('$sessionSignal')}
```
```
# ❌ better-auth migrate doesn't work well with D1npx better-auth migrate# ✅ Use Drizzle Kit insteadnpx drizzle-kit generatewrangler d1 migrations apply my-db --remote
```
```
# ❌ better-auth migrate doesn't work well with D1npx better-auth migrate# ✅ Use Drizzle Kit insteadnpx drizzle-kit generatewrangler d1 migrations apply my-db --remote
```
```
d1Adapter(env.DB)
```
```
drizzleAdapter(db, { provider: "sqlite" })
```
```
require('better-auth')
```
```
import { betterAuth } from 'better-auth'
```
```
reactStartCookies()
```
```
queryClient.invalidateQueries
```
```
authClient.$store.notify('$sessionSignal')
```
```
npx better-auth migrate
```
```
npx drizzle-kit generate
```
The `better-auth` agent skill is an indispensable tool for developers aiming to implement robust and modern authentication systems. It goes beyond basic login flows, offering advanced features like OAuth 2.1 provider capabilities and integrations for popular social platforms such as Patreon and Vercel. Crucially, it guides users through integrating with D1 databases using recommended ORMs like Drizzle or Kysely, ensuring data integrity and preventing common pitfalls. With built-in security enhancements, including admin impersonation prevention, this skill helps create secure, high-performance authentication layers for any application.

# When to Use This Skill
- •Implementing secure authentication for a new web application using D1 database.
- •Integrating social login options (Patreon, Kick, Vercel) into an existing platform.
- •Building a custom OAuth 2.1 provider for internal or external services.
- •Enhancing administrative security by preventing impersonation vulnerabilities.

# Pro Tips
- 💡Always use Drizzle ORM or Kysely for D1 integration, as `better-auth` explicitly states it lacks a direct D1 adapter. This is a critical requirement.
- 💡Leverage the new OAuth 2.1 Provider plugin to build highly customizable and compliant authentication services tailored to your application's needs.
- 💡Configure `backgroundTasks` globally to defer non-critical actions, significantly improving the perceived performance and responsiveness of your authentication flows.

