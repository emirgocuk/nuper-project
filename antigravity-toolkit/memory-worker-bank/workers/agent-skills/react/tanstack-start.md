# TanStack Start
Source: https://antigravity.codes/agent-skills/react/tanstack-start

## AI Worker Instructions
When the user requests functionality related to TanStack Start, follow these guidelines and utilize this context.

## Scraped Content

# TanStack Start
```
@tanstack/react-start@1.154.0
```
```
# Create new project (uses Vite)npm create cloudflare@latest my-app -- --framework=tanstack-startcd my-app# Install dependenciesnpm install# Developmentnpm run dev# Build and deploynpm run buildwrangler deploy
```
```
# Create new project (uses Vite)npm create cloudflare@latest my-app -- --framework=tanstack-startcd my-app# Install dependenciesnpm install# Developmentnpm run dev# Build and deploynpm run buildwrangler deploy
```
```
{  "dependencies": {    "@tanstack/react-start": "^1.154.0",    "@tanstack/react-router": "latest",    "react": "^19.0.0",    "react-dom": "^19.0.0"  },  "devDependencies": {    "vite": "latest",    "@cloudflare/vite-plugin": "latest",    "wrangler": "latest"  }}
```
```
{  "dependencies": {    "@tanstack/react-start": "^1.154.0",    "@tanstack/react-router": "latest",    "react": "^19.0.0",    "react-dom": "^19.0.0"  },  "devDependencies": {    "vite": "latest",    "@cloudflare/vite-plugin": "latest",    "wrangler": "latest"  }}
```
```
@tanstack/start
```
```
@tanstack/react-start
```
```
app.config.ts
```
```
vite.config.ts
```
```
createAPIFileRoute()
```
```
createServerFileRoute().methods()
```
```
ssr.tsx
```
```
client.tsx
```
```
server.tsx
```
```
app/
```
```
src/
```
```
vinxi dev
```
```
vite dev
```
```
# 1. Remove Vinxinpm uninstall vinxi @tanstack/start# 2. Install Vite and framework-specific adapternpm install vite @tanstack/react-start @cloudflare/vite-plugin# 3. Delete old configrm app.config.ts# 4. Delete default entry files (unless customized)rm app/ssr.tsx app/client.tsx# 5. Rename customized entriesmv app/ssr.tsx app/server.tsx  # If you customized SSR entry# 6. Move source files (optional, for consistency)mv app/ src/
```
```
# 1. Remove Vinxinpm uninstall vinxi @tanstack/start# 2. Install Vite and framework-specific adapternpm install vite @tanstack/react-start @cloudflare/vite-plugin# 3. Delete old configrm app.config.ts# 4. Delete default entry files (unless customized)rm app/ssr.tsx app/client.tsx# 5. Rename customized entriesmv app/ssr.tsx app/server.tsx  # If you customized SSR entry# 6. Move source files (optional, for consistency)mv app/ src/
```
```
import { defineConfig } from 'vite'import { tanstackStart } from '@tanstack/react-start/plugin/vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({  plugins: [    tanstackStart(),    cloudflare({      viteEnvironment: { name: 'ssr' } // Required for Workers    })  ]})
```
```
import { defineConfig } from 'vite'import { tanstackStart } from '@tanstack/react-start/plugin/vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({  plugins: [    tanstackStart(),    cloudflare({      viteEnvironment: { name: 'ssr' } // Required for Workers    })  ]})
```
```
{  "scripts": {    "dev": "vite dev --port 3000",    "build": "vite build",    "start": "node .output/server/index.mjs"  }}
```
```
{  "scripts": {    "dev": "vite dev --port 3000",    "build": "vite build",    "start": "node .output/server/index.mjs"  }}
```
```
// Old (Vinxi)import { createAPIFileRoute } from '@tanstack/start/api'export const Route = createAPIFileRoute('/api/users')({  GET: async () => {    return { users: [] }  }})// New (Vite)import { createServerFileRoute } from '@tanstack/react-start/api'export const Route = createServerFileRoute('/api/users').methods({  GET: async () => {    return { users: [] }  }})
```
```
// Old (Vinxi)import { createAPIFileRoute } from '@tanstack/start/api'export const Route = createAPIFileRoute('/api/users')({  GET: async () => {    return { users: [] }  }})// New (Vite)import { createServerFileRoute } from '@tanstack/react-start/api'export const Route = createServerFileRoute('/api/users').methods({  GET: async () => {    return { users: [] }  }})
```
```
createAPIFileRoute()
```
```
createServerFileRoute().methods()
```
```
node_modules/
```
```
package-lock.json
```
```
app.config.timestamp_*
```
```
app.config.*
```
```
name = "my-app"compatibility_date = "2026-01-21"compatibility_flags = ["nodejs_compat"] # REQUIRED# REQUIRED: Point to TanStack Start's server entrymain = "@tanstack/react-start/server-entry"[observability]enabled = true # Optional: Enable monitoring
```
```
name = "my-app"compatibility_date = "2026-01-21"compatibility_flags = ["nodejs_compat"] # REQUIRED# REQUIRED: Point to TanStack Start's server entrymain = "@tanstack/react-start/server-entry"[observability]enabled = true # Optional: Enable monitoring
```
```
import { defineConfig } from 'vite'import { tanstackStart } from '@tanstack/react-start/plugin/vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({  plugins: [    tanstackStart(),    cloudflare({      viteEnvironment: { name: 'ssr' } // REQUIRED    })  ]})
```
```
import { defineConfig } from 'vite'import { tanstackStart } from '@tanstack/react-start/plugin/vite'import { cloudflare } from '@cloudflare/vite-plugin'export default defineConfig({  plugins: [    tanstackStart(),    cloudflare({      viteEnvironment: { name: 'ssr' } // REQUIRED    })  ]})
```
```
# D1 Database[[d1_databases]]binding = "DB"database_name = "my-database"database_id = "your-database-id"# KV Namespace[[kv_namespaces]]binding = "KV"id = "your-kv-id"# R2 Bucket[[r2_buckets]]binding = "BUCKET"bucket_name = "my-bucket"
```
```
# D1 Database[[d1_databases]]binding = "DB"database_name = "my-database"database_id = "your-database-id"# KV Namespace[[kv_namespaces]]binding = "KV"id = "your-kv-id"# R2 Bucket[[r2_buckets]]binding = "BUCKET"bucket_name = "my-bucket"
```
```
import { createServerFn } from '@tanstack/react-start/server'export const getUser = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    // D1    const result = await env.DB.prepare('SELECT * FROM users').all()    // KV    const value = await env.KV.get('key')    // R2    const object = await env.BUCKET.get('file.txt')    return result.results  })
```
```
import { createServerFn } from '@tanstack/react-start/server'export const getUser = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    // D1    const result = await env.DB.prepare('SELECT * FROM users').all()    // KV    const value = await env.KV.get('key')    // R2    const object = await env.BUCKET.get('file.txt')    return result.results  })
```
```
loaders
```
```
export const Route = createFileRoute('/users')({  loader: async () => {    // This route queries D1  },  // Disable prerendering  prerender: false})
```
```
export const Route = createFileRoute('/users')({  loader: async () => {    // This route queries D1  },  // Disable prerendering  prerender: false})
```
```
wrangler dev
```
```
# In CI environmentexport CLOUDFLARE_INCLUDE_PROCESS_ENV=true# Use .env file (NOT .env.local) for CI# .env.local is gitignored and won't be in CI
```
```
# In CI environmentexport CLOUDFLARE_INCLUDE_PROCESS_ENV=true# Use .env file (NOT .env.local) for CI# .env.local is gitignored and won't be in CI
```
```
loader: async ({ context }) => {  // Skip DB queries during prerender  if (typeof context.cloudflare === 'undefined') {    return { users: [] }  }  const result = await context.cloudflare.env.DB.prepare('SELECT * FROM users').all()  return { users: result.results }}
```
```
loader: async ({ context }) => {  // Skip DB queries during prerender  if (typeof context.cloudflare === 'undefined') {    return { users: [] }  }  const result = await context.cloudflare.env.DB.prepare('SELECT * FROM users').all()  return { users: result.results }}
```
```
@tanstack/react-start@1.138.0+
```
```
import { createServerFn } from '@tanstack/react-start/server'export const getUsers = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    const result = await env.DB.prepare('SELECT * FROM users').all()    return result.results  })
```
```
import { createServerFn } from '@tanstack/react-start/server'export const getUsers = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    const result = await env.DB.prepare('SELECT * FROM users').all()    return result.results  })
```
```
import { getUsers } from './server-functions'function UserList() {  const users = await getUsers()  return (    <ul>      {users.map(user => <li key={user.id}>{user.name}</li>)}    </ul>  )}
```
```
import { getUsers } from './server-functions'function UserList() {  const users = await getUsers()  return (    <ul>      {users.map(user => <li key={user.id}>{user.name}</li>)}    </ul>  )}
```
```
await request.formData()
```
```
export const uploadFile = createServerFn()  .handler(async ({ request }) => {    // By the time this runs, the entire file is already in memory    const formData = await request.formData()    const file = formData.get('file') as File    // Too late to check size - file already loaded!    if (file.size > 10_000_000) {      throw new Error("File too large")    }  })
```
```
export const uploadFile = createServerFn()  .handler(async ({ request }) => {    // By the time this runs, the entire file is already in memory    const formData = await request.formData()    const file = formData.get('file') as File    // Too late to check size - file already loaded!    if (file.size > 10_000_000) {      throw new Error("File too large")    }  })
```
```
function FileUpload() {  const handleSubmit = async (e: FormEvent) => {    const file = e.currentTarget.querySelector('input[type="file"]').files[0]    if (file.size > 10_000_000) {      alert("File too large")      return    }    await uploadFile({ file })  }  return <form onSubmit={handleSubmit}>...</form>}
```
```
function FileUpload() {  const handleSubmit = async (e: FormEvent) => {    const file = e.currentTarget.querySelector('input[type="file"]').files[0]    if (file.size > 10_000_000) {      alert("File too large")      return    }    await uploadFile({ file })  }  return <form onSubmit={handleSubmit}>...</form>}
```
```
undefined
```
```
const login = createServerFn<{ username: string, password: string }, User>()  .handler(async ({ data, request }) => {    const user = await authenticateUser(data)    if (!user) {      // Redirect returns void, but type says it returns User      throw redirect({ to: '/login', status: 401 })    }    return user  })// In componentconst result = await login({ username, password })// result is undefined if redirected, User object otherwise// Check before using!if (result) {  console.log(result.name)}
```
```
const login = createServerFn<{ username: string, password: string }, User>()  .handler(async ({ data, request }) => {    const user = await authenticateUser(data)    if (!user) {      // Redirect returns void, but type says it returns User      throw redirect({ to: '/login', status: 401 })    }    return user  })// In componentconst result = await login({ username, password })// result is undefined if redirected, User object otherwise// Check before using!if (result) {  console.log(result.name)}
```
```
// This FAILS - cookies not forwardedconst getData = createServerFn()  .handler(async () => {    const response = await fetch('https://api.example.com/user')    // 401 Unauthorized - no cookies!  })
```
```
// This FAILS - cookies not forwardedconst getData = createServerFn()  .handler(async () => {    const response = await fetch('https://api.example.com/user')    // 401 Unauthorized - no cookies!  })
```
```
import { createIsomorphicFn } from '@tanstack/react-start/server'const getData = createIsomorphicFn()  .handler(async () => {    // Runs on client when possible, preserving cookies    const response = await fetch('https://api.example.com/user')    return response.json()  })
```
```
import { createIsomorphicFn } from '@tanstack/react-start/server'const getData = createIsomorphicFn()  .handler(async () => {    // Runs on client when possible, preserving cookies    const response = await fetch('https://api.example.com/user')    return response.json()  })
```
```
import { createServerFn } from '@tanstack/react-start/server'import { getRequestHeaders } from '@tanstack/react-start/server'const getData = createServerFn()  .handler(async () => {    const headers = getRequestHeaders() // Get browser's original headers    const response = await fetch('https://api.example.com/user', {      headers: {        'Cookie': headers.get('cookie') || '',        'X-XSRF-TOKEN': headers.get('x-xsrf-token') || '',        'Origin': headers.get('origin') || '',      }    })    return response.json()  })
```
```
import { createServerFn } from '@tanstack/react-start/server'import { getRequestHeaders } from '@tanstack/react-start/server'const getData = createServerFn()  .handler(async () => {    const headers = getRequestHeaders() // Get browser's original headers    const response = await fetch('https://api.example.com/user', {      headers: {        'Cookie': headers.get('cookie') || '',        'X-XSRF-TOKEN': headers.get('x-xsrf-token') || '',        'Origin': headers.get('origin') || '',      }    })    return response.json()  })
```
```
createIsomorphicFn
```
```
multiSession
```
```
lastLoginMethod
```
```
oneTap
```
```
import { betterAuth } from 'better-auth'import { reactStartCookies } from 'better-auth/plugins'export const auth = betterAuth({  plugins: [    reactStartCookies(), // Handles cookie setting for TanStack Start  ],  // ... other config})
```
```
import { betterAuth } from 'better-auth'import { reactStartCookies } from 'better-auth/plugins'export const auth = betterAuth({  plugins: [    reactStartCookies(), // Handles cookie setting for TanStack Start  ],  // ... other config})
```
```
// prisma/schema.prismagenerator client {  provider   = "prisma-client"  output     = "../src/generated/prisma"  engineType = "library"  runtime    = "cloudflare" // or "workerd"}
```
```
// prisma/schema.prismagenerator client {  provider   = "prisma-client"  output     = "../src/generated/prisma"  engineType = "library"  runtime    = "cloudflare" // or "workerd"}
```
```
generator client {  provider = "prisma-client-js"  previewFeatures = ["driverAdapters"]}datasource db {  provider = "postgresql"  url      = env("DATABASE_URL")}
```
```
generator client {  provider = "prisma-client-js"  previewFeatures = ["driverAdapters"]}datasource db {  provider = "postgresql"  url      = env("DATABASE_URL")}
```
```
import { PrismaClient } from '@prisma/client'import { PrismaPg } from '@prisma/adapter-pg'import { Pool } from 'pg'export const getUser = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    const pool = new Pool({ connectionString: env.HYPERDRIVE.connectionString })    const adapter = new PrismaPg(pool)    const prisma = new PrismaClient({ adapter })    return prisma.user.findMany()  })
```
```
import { PrismaClient } from '@prisma/client'import { PrismaPg } from '@prisma/adapter-pg'import { Pool } from 'pg'export const getUser = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    const pool = new Pool({ connectionString: env.HYPERDRIVE.connectionString })    const adapter = new PrismaPg(pool)    const prisma = new PrismaClient({ adapter })    return prisma.user.findMany()  })
```
```
export const getUsers = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    const result = await env.DB.prepare('SELECT * FROM users').all()    return result.results  })
```
```
export const getUsers = createServerFn()  .handler(async ({ request }) => {    const env = request.context.cloudflare.env    const result = await env.DB.prepare('SELECT * FROM users').all()    return result.results  })
```
```
drizzle-orm-d1
```
```
import { createMiddleware } from '@tanstack/react-start/server'const middleware = createMiddleware().server(async (ctx) => {  try {    const r = await ctx.next()    // Check for error in response object    if ('error' in r && r.error) {      throw r.error    }    return r  } catch (error: any) {    console.error("Middleware caught an error:", error)    return new Response("An error occurred", { status: 500 })  }})
```
```
import { createMiddleware } from '@tanstack/react-start/server'const middleware = createMiddleware().server(async (ctx) => {  try {    const r = await ctx.next()    // Check for error in response object    if ('error' in r && r.error) {      throw r.error    }    return r  } catch (error: any) {    console.error("Middleware caught an error:", error)    return new Response("An error occurred", { status: 500 })  }})
```
```
await request.formData()
```
```
const result = await login({ username, password })if (result) {  // Safe to use result  console.log(result.name)}
```
```
const result = await login({ username, password })if (result) {  // Safe to use result  console.log(result.name)}
```
```
createIsomorphicFn
```
```
runtime = "cloudflare"
```
```
reactStartCookies()
```
```
compatibility_flags = ["nodejs_compat"]
```
```
process.env.NODE_ENV
```
```
// This condition is statically evaluated and dead code eliminatedif (process.env.NODE_ENV === 'production') {  // Production-only code} else {  // Development-only code (removed in prod build)}
```
```
// This condition is statically evaluated and dead code eliminatedif (process.env.NODE_ENV === 'production') {  // Production-only code} else {  // Development-only code (removed in prod build)}
```
```
routeTree.gen.ts
```
```
autoCodeSplitting
```
```
cloudflare-worker-base
```
```
drizzle-orm-d1
```
```
ai-sdk-core
```
```
react-hook-form-zod
```
Unlock the full potential of TanStack Start with this specialized AI Agent Skill. Designed for developers utilizing this cutting-edge full-stack React framework, the skill provides instant access to best practices, common error prevention, and detailed guidance. Whether you're setting up type-safe routing, implementing server functions, optimizing SSR, or deploying to Cloudflare Workers, this assistant ensures a smoother, more efficient development workflow. Leverage comprehensive knowledge to accelerate your TanStack Start projects and build robust, high-performance applications with confidence.

# When to Use This Skill
- •Developing new full-stack React applications using TanStack Start and needing guidance on initial setup, routing, or data fetching strategies.
- •Migrating an existing TanStack Start project from Vinxi to Vite, requiring detailed steps, configuration help, and troubleshooting support.
- •Deploying a TanStack Start application to Cloudflare Workers and optimizing it for serverless environments, including edge caching and server functions.
- •Implementing complex server functions, authentication patterns, or database integrations within a TanStack Start project while adhering to best practices.

# Pro Tips
- 💡Always specify the exact TanStack Start package version (`@tanstack/react-start`) when asking for help to ensure the most relevant and up-to-date guidance, especially given its rapid development cycle.
- 💡Leverage the skill's deep knowledge on Cloudflare Workers for deployment and optimization. Frame your questions around specific CF Workers features (e.g., KV, Durable Objects) to get tailored advice.
- 💡When encountering errors, provide the full stack trace and your relevant code snippet. The skill is designed to prevent documented errors and can often diagnose issues quickly with sufficient context.
- 💡Utilize the skill to explore different server function patterns and authentication strategies. It can provide examples and best practices tailored to various use cases.

