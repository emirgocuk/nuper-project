# clerk-auth
Source: https://antigravity.codes/agent-skills/nextjs/clerk-auth

## AI Worker Instructions
When the user requests functionality related to clerk-auth, follow these guidelines and utilize this context.

## Scraped Content

# clerk-auth
```
// 1. Add the component for self-service API key managementimport { APIKeys } from '@clerk/nextjs'export default function SettingsPage() {  return (    <div>      <h2>API Keys</h2>      <APIKeys />  {/* Full CRUD UI for user's API keys */}    </div>  )}
```
```
// 1. Add the component for self-service API key managementimport { APIKeys } from '@clerk/nextjs'export default function SettingsPage() {  return (    <div>      <h2>API Keys</h2>      <APIKeys />  {/* Full CRUD UI for user's API keys */}    </div>  )}
```
```
import { verifyToken } from '@clerk/backend'// API keys are verified like session tokensconst { data, error } = await verifyToken(apiKey, {  secretKey: process.env.CLERK_SECRET_KEY,  authorizedParties: ['https://yourdomain.com'],})// Check token typeif (data?.tokenType === 'api_key') {  // Handle API key auth}
```
```
import { verifyToken } from '@clerk/backend'// API keys are verified like session tokensconst { data, error } = await verifyToken(apiKey, {  secretKey: process.env.CLERK_SECRET_KEY,  authorizedParties: ['https://yourdomain.com'],})// Check token typeif (data?.tokenType === 'api_key') {  // Handle API key auth}
```
```
// v6.36.0+: Middleware can distinguish token typesclerkMiddleware((auth, req) => {  const { userId, tokenType } = auth()  if (tokenType === 'api_key') {    // API key auth - programmatic access  } else if (tokenType === 'session_token') {    // Regular session - web UI access  }})
```
```
// v6.36.0+: Middleware can distinguish token typesclerkMiddleware((auth, req) => {  const { userId, tokenType } = auth()  if (tokenType === 'api_key') {    // API key auth - programmatic access  } else if (tokenType === 'session_token') {    // Regular session - web UI access  }})
```
```
x-middleware-subrequest: true
```
```
middleware.ts
```
```
proxy.ts
```
```
Next.js 15 and earlier: middleware.tsNext.js 16+:            proxy.ts
```
```
Next.js 15 and earlier: middleware.tsNext.js 16+:            proxy.ts
```
```
// src/proxy.ts (NOT middleware.ts!)import { clerkMiddleware } from '@clerk/nextjs/server'export default clerkMiddleware()export const config = {  matcher: [    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',    '/(api|trpc)(.*)',  ],}
```
```
// src/proxy.ts (NOT middleware.ts!)import { clerkMiddleware } from '@clerk/nextjs/server'export default clerkMiddleware()export const config = {  matcher: [    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',    '/(api|trpc)(.*)',  ],}
```
```
import { clerkClient } from '@clerk/backend'// Force password reset for a userawait clerkClient.users.updateUser(userId, {  passwordDigest: 'compromised',  // Triggers reset on next sign-in})
```
```
import { clerkClient } from '@clerk/backend'// Force password reset for a userawait clerkClient.users.updateUser(userId, {  passwordDigest: 'compromised',  // Triggers reset on next sign-in})
```
```
/commerce/
```
```
/billing/
```
```
GET /v1/commerce/plans → GET /v1/billing/plans  GET /v1/commerce/statements → GET /v1/billing/statements  POST /v1/me/commerce/checkouts → POST /v1/me/billing/checkouts
```
```
GET /v1/commerce/plans → GET /v1/billing/plans  GET /v1/commerce/statements → GET /v1/billing/statements  POST /v1/me/commerce/checkouts → POST /v1/me/billing/checkouts
```
```
payment_source
```
```
payment_method
```
```
// OLD (deprecated)  { payment_source_id: "...", payment_source: {...} }  // NEW (required)  { payment_method_id: "...", payment_method: {...} }
```
```
// OLD (deprecated)  { payment_source_id: "...", payment_source: {...} }  // NEW (required)  { payment_method_id: "...", payment_method: {...} }
```
```
amount
```
```
amount_formatted
```
```
fee.amount
```
```
currency
```
```
currency_symbol
```
```
payer_type
```
```
for_payer_type
```
```
annual_monthly_amount
```
```
annual_amount
```
```
null
```
```
auth()
```
```
// ❌ OLD (v5 - synchronous)const { userId } = auth()// ✅ NEW (v6 - asynchronous)const { userId } = await auth()
```
```
// ❌ OLD (v5 - synchronous)const { userId } = auth()// ✅ NEW (v6 - asynchronous)const { userId } = await auth()
```
```
auth.protect()
```
```
// ❌ OLD (v5)auth.protect()// ✅ NEW (v6)await auth.protect()
```
```
// ❌ OLD (v5)auth.protect()// ✅ NEW (v6)await auth.protect()
```
```
import { auth } from '@clerk/nextjs/server'export default async function Page() {  const { userId } = await auth()  // ← Must await  if (!userId) {    return <div>Unauthorized</div>  }  return <div>User ID: {userId}</div>}
```
```
import { auth } from '@clerk/nextjs/server'export default async function Page() {  const { userId } = await auth()  // ← Must await  if (!userId) {    return <div>Unauthorized</div>  }  return <div>User ID: {userId}</div>}
```
```
authorizedParties
```
```
import { verifyToken } from '@clerk/backend'const { data, error } = await verifyToken(token, {  secretKey: c.env.CLERK_SECRET_KEY,  // REQUIRED: Prevent CSRF attacks  authorizedParties: ['https://yourdomain.com'],})
```
```
import { verifyToken } from '@clerk/backend'const { data, error } = await verifyToken(token, {  secretKey: c.env.CLERK_SECRET_KEY,  // REQUIRED: Prevent CSRF attacks  authorizedParties: ['https://yourdomain.com'],})
```
```
authorizedParties
```
```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'// Define protected routesconst isProtectedRoute = createRouteMatcher([  '/dashboard(.*)',  '/api/private(.*)',])const isAdminRoute = createRouteMatcher(['/admin(.*)'])export default clerkMiddleware(async (auth, req) => {  // Protect routes  if (isProtectedRoute(req)) {    await auth.protect()  // Redirects unauthenticated users  }  // Require specific permissions  if (isAdminRoute(req)) {    await auth.protect({      role: 'org:admin',  // Requires organization admin role    })  }})
```
```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'// Define protected routesconst isProtectedRoute = createRouteMatcher([  '/dashboard(.*)',  '/api/private(.*)',])const isAdminRoute = createRouteMatcher(['/admin(.*)'])export default clerkMiddleware(async (auth, req) => {  // Protect routes  if (isProtectedRoute(req)) {    await auth.protect()  // Redirects unauthenticated users  }  // Require specific permissions  if (isAdminRoute(req)) {    await auth.protect({      role: 'org:admin',  // Requires organization admin role    })  }})
```
```
debug
```
```
boolean
```
```
jwtKey
```
```
string
```
```
clockSkewInMs
```
```
number
```
```
organizationSyncOptions
```
```
object
```
```
signInUrl
```
```
string
```
```
signUpUrl
```
```
string
```
```
clerkMiddleware()
```
```
authenticateRequest()
```
```
Sec-Fetch-Dest
```
```
clerkMiddleware({  organizationSyncOptions: {    organizationPatterns: ['/orgs/:slug', '/orgs/:slug/(.*)'],    personalAccountPatterns: ['/personal', '/personal/(.*)'],  },})
```
```
clerkMiddleware({  organizationSyncOptions: {    organizationPatterns: ['/orgs/:slug', '/orgs/:slug/(.*)'],    personalAccountPatterns: ['/personal', '/personal/(.*)'],  },})
```
```
import { Webhook } from 'svix'export async function POST(req: Request) {  const payload = await req.text()  const headers = {    'svix-id': req.headers.get('svix-id')!,    'svix-timestamp': req.headers.get('svix-timestamp')!,    'svix-signature': req.headers.get('svix-signature')!,  }  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!)  try {    const event = wh.verify(payload, headers)    // Process event    return Response.json({ success: true })  } catch (err) {    return Response.json({ error: 'Invalid signature' }, { status: 400 })  }}
```
```
import { Webhook } from 'svix'export async function POST(req: Request) {  const payload = await req.text()  const headers = {    'svix-id': req.headers.get('svix-id')!,    'svix-timestamp': req.headers.get('svix-timestamp')!,    'svix-signature': req.headers.get('svix-signature')!,  }  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!)  try {    const event = wh.verify(payload, headers)    // Process event    return Response.json({ success: true })  } catch (err) {    return Response.json({ error: 'Invalid signature' }, { status: 400 })  }}
```
```
user.created
```
```
user.updated
```
```
user.deleted
```
```
session.created
```
```
session.ended
```
```
organization.created
```
```
organization.membership.created
```
```
const isPublicRoute = createRouteMatcher([  '/api/webhooks/clerk(.*)',  // Clerk webhooks are public])clerkMiddleware((auth, req) => {  if (!isPublicRoute(req)) {    auth.protect()  }})
```
```
const isPublicRoute = createRouteMatcher([  '/api/webhooks/clerk(.*)',  // Clerk webhooks are public])clerkMiddleware((auth, req) => {  if (!isPublicRoute(req)) {    auth.protect()  }})
```
```
<SignIn />
```
```
<SignUp />
```
```
<SignInButton />
```
```
<SignUpButton />
```
```
<SignedIn>
```
```
<SignedOut>
```
```
<UserButton />
```
```
<UserProfile />
```
```
<OrganizationSwitcher />
```
```
<OrganizationProfile />
```
```
<CreateOrganization />
```
```
<APIKeys />
```
```
useAuth()
```
```
{ userId, sessionId, isLoaded, isSignedIn, getToken }
```
```
useUser()
```
```
{ user, isLoaded, isSignedIn }
```
```
useClerk()
```
```
useSession()
```
```
useOrganization()
```
```
useOrganizationList()
```
```
// ✅ GOOD: Minimal claims{  "user_id": "{{user.id}}",  "email": "{{user.primary_email_address}}",  "role": "{{user.public_metadata.role}}"}// ❌ BAD: Exceeds limit{  "bio": "{{user.public_metadata.bio}}",  // 6KB field  "all_metadata": "{{user.public_metadata}}"  // Entire object}
```
```
// ✅ GOOD: Minimal claims{  "user_id": "{{user.id}}",  "email": "{{user.primary_email_address}}",  "role": "{{user.public_metadata.role}}"}// ❌ BAD: Exceeds limit{  "bio": "{{user.public_metadata.bio}}",  // 6KB field  "all_metadata": "{{user.public_metadata}}"  // Entire object}
```
```
{{user.id}}
```
```
{{user.first_name}}
```
```
{{user.last_name}}
```
```
{{user.full_name}}
```
```
"John Doe"
```
```
{{user.primary_email_address}}
```
```
{{user.primary_phone_address}}
```
```
"john@example.com"
```
```
{{user.image_url}}
```
```
{{user.username}}
```
```
{{user.created_at}}
```
```
"https://..."
```
```
{{user.email_verified}}
```
```
{{user.phone_number_verified}}
```
```
true
```
```
{{user.public_metadata}}
```
```
{{user.public_metadata.FIELD}}
```
```
{"role": "admin"}
```
```
org_id
```
```
org_slug
```
```
org_role
```
```
"org:admin"
```
```
"{{user.last_name}} {{user.first_name}}"
```
```
"{{user.public_metadata.role || 'user'}}"
```
```
"{{user.public_metadata.profile.interests}}"
```
```
john+clerk_test@example.comjane+clerk_test@gmail.com
```
```
john+clerk_test@example.comjane+clerk_test@gmail.com
```
```
+12015550100+19735550133
```
```
+12015550100+19735550133
```
```
424242
```
```
scripts/generate-session-token.js
```
```
# Generate tokenCLERK_SECRET_KEY=sk_test_... node scripts/generate-session-token.js# Create new test userCLERK_SECRET_KEY=sk_test_... node scripts/generate-session-token.js --create-user# Auto-refresh token every 50 secondsCLERK_SECRET_KEY=sk_test_... node scripts/generate-session-token.js --refresh
```
```
# Generate tokenCLERK_SECRET_KEY=sk_test_... node scripts/generate-session-token.js# Create new test userCLERK_SECRET_KEY=sk_test_... node scripts/generate-session-token.js --create-user# Auto-refresh token every 50 secondsCLERK_SECRET_KEY=sk_test_... node scripts/generate-session-token.js --refresh
```
```
POST /v1/users
```
```
POST /v1/sessions
```
```
POST /v1/sessions/{session_id}/tokens
```
```
Authorization: Bearer <token>
```
```
@clerk/testing
```
```
npm install -D @clerk/testing
```
```
npm install -D @clerk/testing
```
```
global.setup.ts
```
```
import { clerkSetup } from '@clerk/testing/playwright'import { test as setup } from '@playwright/test'setup('global setup', async ({}) => {  await clerkSetup()})
```
```
import { clerkSetup } from '@clerk/testing/playwright'import { test as setup } from '@playwright/test'setup('global setup', async ({}) => {  await clerkSetup()})
```
```
auth.spec.ts
```
```
import { setupClerkTestingToken } from '@clerk/testing/playwright'import { test } from '@playwright/test'test('sign up', async ({ page }) => {  await setupClerkTestingToken({ page })  await page.goto('/sign-up')  await page.fill('input[name="emailAddress"]', 'test+clerk_test@example.com')  await page.fill('input[name="password"]', 'TestPassword123!')  await page.click('button[type="submit"]')  // Verify with fixed OTP  await page.fill('input[name="code"]', '424242')  await page.click('button[type="submit"]')  await expect(page).toHaveURL('/dashboard')})
```
```
import { setupClerkTestingToken } from '@clerk/testing/playwright'import { test } from '@playwright/test'test('sign up', async ({ page }) => {  await setupClerkTestingToken({ page })  await page.goto('/sign-up')  await page.fill('input[name="emailAddress"]', 'test+clerk_test@example.com')  await page.fill('input[name="password"]', 'TestPassword123!')  await page.click('button[type="submit"]')  // Verify with fixed OTP  await page.fill('input[name="code"]', '424242')  await page.click('button[type="submit"]')  await expect(page).toHaveURL('/dashboard')})
```
```
.env.local
```
```
wrangler secret put
```
```
apiKey
```
```
secretKey
```
```
authorizedParties: ['https://yourdomain.com']
```
```
const { userId } = await auth()
```
```
NEXT_PUBLIC_
```
```
VITE_
```
```
__clerk_handshake
```
```
package.json
```
```
{  "scripts": {    "dev": "NODE_OPTIONS='--max-http-header-size=32768' vite"  }}
```
```
{  "scripts": {    "dev": "NODE_OPTIONS='--max-http-header-size=32768' vite"  }}
```
```
useUser()
```
```
UserResource
```
```
currentUser()
```
```
User
```
```
fullName
```
```
primaryEmailAddress
```
```
primaryEmailAddressId
```
```
privateMetadata
```
```
// ✅ CORRECT: Use properties that exist in bothconst primaryEmailAddress = user.emailAddresses.find(  ({ id }) => id === user.primaryEmailAddressId)// ✅ CORRECT: Separate typestype ClientUser = ReturnType<typeof useUser>['user']type ServerUser = Awaited<ReturnType<typeof currentUser>>
```
```
// ✅ CORRECT: Use properties that exist in bothconst primaryEmailAddress = user.emailAddresses.find(  ({ id }) => id === user.primaryEmailAddressId)// ✅ CORRECT: Separate typestype ClientUser = ReturnType<typeof useUser>['user']type ServerUser = Awaited<ReturnType<typeof currentUser>>
```
```
authenticateRequest()
```
```
authenticateRequest()
```
```
acceptsToken
```
```
['session_token', 'api_key']
```
```
// This now works in @clerk/backend@2.29.2+const result = await authenticateRequest(request, {  acceptsToken: ['session_token', 'api_key'],  // Fixed!})
```
```
// This now works in @clerk/backend@2.29.2+const result = await authenticateRequest(request, {  acceptsToken: ['session_token', 'api_key'],  // Fixed!})
```
```
deriveUrlFromHeaders()
```
```
x-forwarded-host: 'example.com[invalid]'
```
```
pending
```
```
treatPendingAsSignedOut: false
```
```
// Default: pending = signed outconst user = await currentUser()  // null if status is 'pending'// Treat pending as signed inconst user = await currentUser({ treatPendingAsSignedOut: false })  // defined if pending
```
```
// Default: pending = signed outconst user = await currentUser()  // null if status is 'pending'// Treat pending as signed inconst user = await currentUser({ treatPendingAsSignedOut: false })  // defined if pending
```
```
jwtKey
```
```
clerkMiddleware({  jwtKey: process.env.CLERK_JWT_KEY,  // Allows offline token verification})
```
```
clerkMiddleware({  jwtKey: process.env.CLERK_JWT_KEY,  // Allows offline token verification})
```
```
jwtKey
```
```
/clerk/clerk-docs
```
```
{  "dependencies": {    "@clerk/nextjs": "^6.36.7",    "@clerk/clerk-react": "^5.59.2",    "@clerk/backend": "^2.29.2",    "@clerk/testing": "^1.13.26"  }}
```
```
{  "dependencies": {    "@clerk/nextjs": "^6.36.7",    "@clerk/clerk-react": "^5.59.2",    "@clerk/backend": "^2.29.2",    "@clerk/testing": "^1.13.26"  }}
```
```
@clerk/backend@2.x
```
```
2025-04-10
```
```
@clerk/backend@2.x
```
```
@clerk/nextjs@6.x
```
```
/* ❌ v5 (synchronous) */import { auth } from '@clerk/nextjs/server'const { userId } = auth()/* ✅ v6 (asynchronous) */import { auth } from '@clerk/nextjs/server'const { userId } = await auth()
```
```
/* ❌ v5 (synchronous) */import { auth } from '@clerk/nextjs/server'const { userId } = auth()/* ✅ v6 (asynchronous) */import { auth } from '@clerk/nextjs/server'const { userId } = await auth()
```
```
/* ❌ v5 */auth.protect()/* ✅ v6 */await auth.protect()
```
```
/* ❌ v5 */auth.protect()/* ✅ v6 */await auth.protect()
```
```
@clerk/backend
```
```
verifyToken
```
```
import { verifyToken } from '@clerk/backend';// Verify JWT from Authorization headerconst token = request.headers.get('Authorization')?.replace('Bearer ', '');const payload = await verifyToken(token, {  secretKey: env.CLERK_SECRET_KEY,  authorizedParties: ['https://yourdomain.com'],  // REQUIRED for Cloudflare Workers});
```
```
import { verifyToken } from '@clerk/backend';// Verify JWT from Authorization headerconst token = request.headers.get('Authorization')?.replace('Bearer ', '');const payload = await verifyToken(token, {  secretKey: env.CLERK_SECRET_KEY,  authorizedParties: ['https://yourdomain.com'],  // REQUIRED for Cloudflare Workers});
```
```
authorizedParties
```
```
{  "user_id": "{{user.id}}",  "email": "{{user.primary_email_address}}",  "role": "{{user.public_metadata.role}}"}
```
```
{  "user_id": "{{user.id}}",  "email": "{{user.primary_email_address}}",  "role": "{{user.public_metadata.role}}"}
```
```
sid
```
```
v
```
```
sid
```
```
v
```
```
pla
```
```
fea
```
```
/* ❌ Old field names */{ payment_source_id: "...", payment_source: {...} }/* ✅ New field names */{ payment_method_id: "...", payment_method: {...} }/* ❌ Old endpoints */GET /v1/commerce/plans/* ✅ New endpoints */GET /v1/billing/plans
```
```
/* ❌ Old field names */{ payment_source_id: "...", payment_source: {...} }/* ✅ New field names */{ payment_method_id: "...", payment_method: {...} }/* ❌ Old endpoints */GET /v1/commerce/plans/* ✅ New endpoints */GET /v1/billing/plans
```
```
// package.json - Increase header limit{  "scripts": {    "dev": "NODE_OPTIONS='--max-http-header-size=32768' vite"  }}
```
```
// package.json - Increase header limit{  "scripts": {    "dev": "NODE_OPTIONS='--max-http-header-size=32768' vite"  }}
```
```
const { userId } = auth()
```
```
const { userId } = await auth()
```
```
auth.protect()
```
```
await auth.protect()
```
```
apiKey
```
```
secretKey
```
```
authorizedParties
```
```
authorizedParties: ['https://yourdomain.com']
```
```
/v1/commerce/*
```
```
/v1/billing/*
```
```
payment_source
```
```
payment_method
```
This Clerk Auth agent skill serves as a crucial guide for developers integrating Clerk authentication into their Next.js projects. It provides timely insights into recent breaking changes, helping users proactively prevent common errors and ensure seamless migration. Furthermore, it introduces advanced features like user-scoped API key management, complete with backend verification examples. By utilizing this skill, developers can maintain secure and up-to-date authentication flows, enhancing both application integrity and user experience in complex web environments.

# When to Use This Skill
- •Migrating an existing Next.js application to a newer Clerk Auth version to handle breaking changes and ensure compatibility.
- •Implementing secure user-scoped or organization-scoped API keys for third-party integrations or internal tools within a Next.js app.
- •Troubleshooting authentication errors related to Clerk Auth updates or configuration changes in Next.js projects.
- •Understanding best practices for verifying tokens and handling different token types within Clerk middleware for robust authorization.

# Pro Tips
- 💡Always consult Clerk's official changelog alongside this skill to ensure you have the very latest updates, as authentication solutions evolve rapidly.
- 💡Thoroughly test all authentication flows in a staging environment after any Clerk package updates or significant configuration changes to catch regressions early.
- 💡Leverage Clerk's provided UI components for API key management to reduce development effort and maintain a consistent user experience for key generation and revocation.

