# cloudflare-worker-base
Source: https://antigravity.codes/agent-skills/backend/cloudflare-worker-base

## AI Worker Instructions
When the user requests functionality related to cloudflare-worker-base, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-worker-base
```
wrangler deploy --x-autoconfig
```
```
WorkerEntrypoint
```
```
# 1. Scaffold projectnpm create cloudflare@latest my-worker -- --type hello-world --ts --git --deploy false --framework none# 2. Install dependenciescd my-workernpm install hono@4.11.3npm install -D @cloudflare/vite-plugin@1.17.1 vite@7.3.1# 3. Create wrangler.jsonc{  "name": "my-worker",  "main": "src/index.ts",  "account_id": "YOUR_ACCOUNT_ID",  "compatibility_date": "2025-11-11",  "assets": {    "directory": "./public/",    "binding": "ASSETS",    "not_found_handling": "single-page-application",    "run_worker_first": ["/api/*"]  // CRITICAL: Prevents SPA fallback from intercepting API routes  }}# 4. Create vite.config.tsimport { defineConfig } from 'vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({ plugins: [cloudflare()] })# 5. Create src/index.tsimport { Hono } from 'hono'type Bindings = { ASSETS: Fetcher }const app = new Hono<{ Bindings: Bindings }>()app.get('/api/hello', (c) => c.json({ message: 'Hello!' }))app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))export default app  // CRITICAL: Use this pattern (NOT { fetch: app.fetch })# 6. Deploynpm run dev              # Local: http://localhost:8787wrangler deploy          # Production
```
```
# 1. Scaffold projectnpm create cloudflare@latest my-worker -- --type hello-world --ts --git --deploy false --framework none# 2. Install dependenciescd my-workernpm install hono@4.11.3npm install -D @cloudflare/vite-plugin@1.17.1 vite@7.3.1# 3. Create wrangler.jsonc{  "name": "my-worker",  "main": "src/index.ts",  "account_id": "YOUR_ACCOUNT_ID",  "compatibility_date": "2025-11-11",  "assets": {    "directory": "./public/",    "binding": "ASSETS",    "not_found_handling": "single-page-application",    "run_worker_first": ["/api/*"]  // CRITICAL: Prevents SPA fallback from intercepting API routes  }}# 4. Create vite.config.tsimport { defineConfig } from 'vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({ plugins: [cloudflare()] })# 5. Create src/index.tsimport { Hono } from 'hono'type Bindings = { ASSETS: Fetcher }const app = new Hono<{ Bindings: Bindings }>()app.get('/api/hello', (c) => c.json({ message: 'Hello!' }))app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))export default app  // CRITICAL: Use this pattern (NOT { fetch: app.fetch })# 6. Deploynpm run dev              # Local: http://localhost:8787wrangler deploy          # Production
```
```
run_worker_first: ["/api/*"]
```
```
index.html
```
```
export default app
```
```
{ fetch: app.fetch }
```
```
export default app
```
```
{ fetch: app.fetch }
```
```
index.html
```
```
"run_worker_first": ["/api/*"]
```
```
export default {  fetch: app.fetch,  scheduled: async (event, env, ctx) => { /* ... */ }}
```
```
export default {  fetch: app.fetch,  scheduled: async (event, env, ctx) => { /* ... */ }}
```
```
@cloudflare/vite-plugin@1.13.13
```
```
index-a1b2c3d4.js
```
```
index-a1b2c3d4.js
```
```
index-m3n4o5p6.js
```
```
run_worker_first
```
```
!/pattern
```
```
run_worker_first
```
```
Calling require for "buffer" in an environment that doesn't expose the require function
```
```
require()
```
```
import
```
```
require()
```
```
// vite.config.ts - Add esmExternalRequirePluginimport { defineConfig } from 'vite'import { cloudflare } from '@cloudflare/vite-plugin'import { esmExternalRequirePlugin } from 'vite'import { builtinModules } from 'node:module'export default defineConfig({  plugins: [    cloudflare(),    esmExternalRequirePlugin({      external: [/^node:/, ...builtinModules],    }),  ],})
```
```
// vite.config.ts - Add esmExternalRequirePluginimport { defineConfig } from 'vite'import { cloudflare } from '@cloudflare/vite-plugin'import { esmExternalRequirePlugin } from 'vite'import { builtinModules } from 'node:module'export default defineConfig({  plugins: [    cloudflare(),    esmExternalRequirePlugin({      external: [/^node:/, ...builtinModules],    }),  ],})
```
```
curl http://localhost:5173/prefix
```
```
assets.base
```
```
// worker.ts - Strip base path in developmentif (import.meta.env.DEV) {  url.pathname = url.pathname.replace(import.meta.env.BASE_URL, '');  if (url.pathname === '/') {    return this.env.ASSETS.fetch(request);  }  request = new Request(url, request);}
```
```
// worker.ts - Strip base path in developmentif (import.meta.env.DEV) {  url.pathname = url.pathname.replace(import.meta.env.BASE_URL, '');  if (url.pathname === '/') {    return this.env.ASSETS.fetch(request);  }  request = new Request(url, request);}
```
```
assets.base
```
```
"not_found_handling": "single-page-application"
```
```
index.html
```
```
run_worker_first
```
```
run_worker_first: ["/api/*"]
```
```
/api/hello
```
```
/
```
```
index.html
```
```
/styles.css
```
```
styles.css
```
```
/unknown
```
```
index.html
```
```
<link href="/styles.css?v=1.0.0">
```
```
run_worker_first
```
```
!/pattern
```
```
binding
```
```
database_name
```
```
bucket_name
```
```
wrangler dev
```
```
database_id
```
```
database_name
```
```
binding
```
```
// ❌ DON'T: Binding-only creates database named "DB"{  "d1_databases": [{ "binding": "DB" }]}// ✅ DO: Explicit names prevent confusion{  "d1_databases": [    {      "binding": "DB",      "database_name": "my-app-db"  // Always specify!    }  ],  "r2_buckets": [    {      "binding": "STORAGE",      "bucket_name": "my-app-files"  // Always specify!    }  ],  "kv_namespaces": [    {      "binding": "CACHE",      "title": "my-app-cache"  // Always specify!    }  ]}
```
```
// ❌ DON'T: Binding-only creates database named "DB"{  "d1_databases": [{ "binding": "DB" }]}// ✅ DO: Explicit names prevent confusion{  "d1_databases": [    {      "binding": "DB",      "database_name": "my-app-db"  // Always specify!    }  ],  "r2_buckets": [    {      "binding": "STORAGE",      "bucket_name": "my-app-files"  // Always specify!    }  ],  "kv_namespaces": [    {      "binding": "CACHE",      "title": "my-app-cache"  // Always specify!    }  ]}
```
```
# Deploy - resources auto-provisioned if they don't existwrangler deploy# Disable auto-provisioning (use existing resources only)wrangler deploy --no-x-provision
```
```
# Deploy - resources auto-provisioned if they don't existwrangler deploy# Disable auto-provisioning (use existing resources only)wrangler deploy --no-x-provision
```
```
wrangler d1 create
```
```
wrangler r2 create
```
```
wrangler dev
```
```
import { WorkerEntrypoint } from 'cloudflare:workers'export class AuthService extends WorkerEntrypoint<Env> {  async verifyToken(token: string): Promise<{ userId: string; valid: boolean }> {    // Access bindings via this.env    const session = await this.env.SESSIONS.get(token)    return session ? { userId: session.userId, valid: true } : { userId: '', valid: false }  }  async createSession(userId: string): Promise<string> {    const token = crypto.randomUUID()    await this.env.SESSIONS.put(token, JSON.stringify({ userId }), { expirationTtl: 3600 })    return token  }}// Default export still handles HTTP requestsexport default { fetch: ... }
```
```
import { WorkerEntrypoint } from 'cloudflare:workers'export class AuthService extends WorkerEntrypoint<Env> {  async verifyToken(token: string): Promise<{ userId: string; valid: boolean }> {    // Access bindings via this.env    const session = await this.env.SESSIONS.get(token)    return session ? { userId: session.userId, valid: true } : { userId: '', valid: false }  }  async createSession(userId: string): Promise<string> {    const token = crypto.randomUUID()    await this.env.SESSIONS.put(token, JSON.stringify({ userId }), { expirationTtl: 3600 })    return token  }}// Default export still handles HTTP requestsexport default { fetch: ... }
```
```
// wrangler.jsonc{  "services": [    { "binding": "AUTH", "service": "auth-worker", "entrypoint": "AuthService" }  ]}// In your main Workerconst { valid, userId } = await env.AUTH.verifyToken(authHeader)
```
```
// wrangler.jsonc{  "services": [    { "binding": "AUTH", "service": "auth-worker", "entrypoint": "AuthService" }  ]}// In your main Workerconst { valid, userId } = await env.AUTH.verifyToken(authHeader)
```
```
wrangler dev
```
```
[connected]
```
```
ResponseSentError: The response has already been sent to the browser and cannot be altered
```
```
wrangler dev
```
```
.wrangler
```
```
# Clear all cachesrm -rf .wrangler dist node_modules/.vite# Rebuildnpm run build# Recreate local D1 databases if neededwrangler d1 execute DB --local --file schema.sql
```
```
# Clear all cachesrm -rf .wrangler dist node_modules/.vite# Rebuildnpm run build# Recreate local D1 databases if neededwrangler d1 execute DB --local --file schema.sql
```
```
@cloudflare/vite-plugin
```
```
vite-tsconfig-paths@5.1.4
```
```
npm install vite-tsconfig-paths@5.1.4
```
```
npm install vite-tsconfig-paths@5.1.4
```
```
uuid@11
```
```
// ✅ Native Workers API (recommended)const uuid = crypto.randomUUID();// ❌ Avoid uuid package in Workersimport { v4 as uuidv4 } from 'uuid';  // May crash
```
```
// ✅ Native Workers API (recommended)const uuid = crypto.randomUUID();// ❌ Avoid uuid package in Workersimport { v4 as uuidv4 } from 'uuid';  // May crash
```
```
/deploy
```
```
wrangler deploy
```
```
templates/
```
```
mcp__cloudflare-docs__search_cloudflare_documentation
```
```
{  "dependencies": {    "hono": "^4.11.3"  },  "devDependencies": {    "@cloudflare/vite-plugin": "^1.17.1",    "@cloudflare/workers-types": "^4.20260103.0",    "vite": "^7.3.1",    "wrangler": "^4.54.0",    "typescript": "^5.9.3"  }}
```
```
{  "dependencies": {    "hono": "^4.11.3"  },  "devDependencies": {    "@cloudflare/vite-plugin": "^1.17.1",    "@cloudflare/workers-types": "^4.20260103.0",    "vite": "^7.3.1",    "wrangler": "^4.54.0",    "typescript": "^5.9.3"  }}
```
```
/* ❌ Causes "Cannot read properties of undefined" */export default { fetch: app.fetch }/* ✅ Correct pattern */export default app
```
```
/* ❌ Causes "Cannot read properties of undefined" */export default { fetch: app.fetch }/* ✅ Correct pattern */export default app
```
```
"not_found_handling": "single-page-application"
```
```
index.html
```
```
/* wrangler.jsonc - MUST include run_worker_first */{  "assets": {    "directory": "./public/",    "binding": "ASSETS",    "not_found_handling": "single-page-application",    "run_worker_first": ["/api/*"]  // ← Critical: ensures Worker handles API routes  }}
```
```
/* wrangler.jsonc - MUST include run_worker_first */{  "assets": {    "directory": "./public/",    "binding": "ASSETS",    "not_found_handling": "single-page-application",    "run_worker_first": ["/api/*"]  // ← Critical: ensures Worker handles API routes  }}
```
```
# ❌ Older format (still works but not recommended)wrangler.toml# ✅ Current format (supports comments, better DX)wrangler.jsonc
```
```
# ❌ Older format (still works but not recommended)wrangler.toml# ✅ Current format (supports comments, better DX)wrangler.jsonc
```
```
/* ❌ Service Worker format (deprecated) */addEventListener('fetch', (event) => {  event.respondWith(handleRequest(event.request))})/* ✅ ES Module format (required) */export default {  async fetch(request, env, ctx) {    return new Response('Hello')  }}/* ✅ Or with Hono */import { Hono } from 'hono'const app = new Hono()export default app
```
```
/* ❌ Service Worker format (deprecated) */addEventListener('fetch', (event) => {  event.respondWith(handleRequest(event.request))})/* ✅ ES Module format (required) */export default {  async fetch(request, env, ctx) {    return new Response('Hello')  }}/* ✅ Or with Hono */import { Hono } from 'hono'const app = new Hono()export default app
```
```
/* ✅ Combining fetch + scheduled */export default {  fetch: app.fetch,  scheduled: async (event, env, ctx) => {    // Cron job logic  }}
```
```
/* ✅ Combining fetch + scheduled */export default {  fetch: app.fetch,  scheduled: async (event, env, ctx) => {    // Cron job logic  }}
```
```
type Bindings = {  DB: D1Database  KV: KVNamespace  BUCKET: R2Bucket  ASSETS: Fetcher  MY_SECRET: string}const app = new Hono<{ Bindings: Bindings }>()
```
```
type Bindings = {  DB: D1Database  KV: KVNamespace  BUCKET: R2Bucket  ASSETS: Fetcher  MY_SECRET: string}const app = new Hono<{ Bindings: Bindings }>()
```
```
# ❌ Native Integrations (removed from dashboard June 2025)# Set up via Cloudflare dashboard# ✅ CLI-based approachwrangler secret put MY_SECRET
```
```
# ❌ Native Integrations (removed from dashboard June 2025)# Set up via Cloudflare dashboard# ✅ CLI-based approachwrangler secret put MY_SECRET
```
```
/* ❌ Node.js APIs don't exist */import fs from 'fs'import path from 'path'process.env.MY_VAR/* ✅ Use Web APIs and env bindings */const response = await fetch(url)const data = env.MY_VAR
```
```
/* ❌ Node.js APIs don't exist */import fs from 'fs'import path from 'path'process.env.MY_VAR/* ✅ Use Web APIs and env bindings */const response = await fetch(url)const data = env.MY_VAR
```
```
/* vite.config.ts */import { defineConfig } from 'vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({  plugins: [cloudflare()]})
```
```
/* vite.config.ts */import { defineConfig } from 'vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({  plugins: [cloudflare()]})
```
```
export default { fetch: app.fetch }
```
```
export default app
```
```
wrangler.toml
```
```
wrangler.jsonc
```
```
addEventListener
```
```
export default
```
```
process.env.X
```
```
env.X
```
```
wrangler secret put
```
```
run_worker_first
```
This skill empowers developers to quickly scaffold and manage Cloudflare Worker projects. It leverages a robust, production-tested stack including Hono for building fast APIs, Vite for efficient bundling, and Wrangler for seamless deployment and local development. Designed for modern web development, it integrates cutting-edge features like automatic provisioning for R2, D1, and KV bindings, and offers streamlined workflows for serverless applications at the edge. Whether you're building APIs, full-stack applications, or static sites with dynamic backends, this skill provides a solid foundation, ensuring high performance and developer velocity on the Cloudflare platform.

# When to Use This Skill
- •Building fast APIs and microservices on the Cloudflare edge.
- •Creating full-stack applications with a serverless backend and static frontend.
- •Developing event-driven services using Cloudflare's platform features (R2, D1, KV, Durable Objects).
- •Migrating existing backend logic to a high-performance, globally distributed serverless environment.

# Pro Tips
- 💡Leverage Wrangler's auto-provisioning for R2, D1, and KV bindings to simplify resource management and accelerate development setup.
- 💡Utilize Hono's enhanced TypeScript RPC type inference to maintain strong type safety across your client and server, enhancing developer experience and reducing errors.
- 💡Explore Cloudflare Workers' `WorkerEntrypoint` for JavaScript-native RPC to create well-defined service interfaces for complex multi-worker architectures.

