# nuxthub
Source: https://antigravity.codes/agent-skills/nuxt/nuxthub

## AI Worker Instructions
When the user requests functionality related to nuxthub, follow these guidelines and utilize this context.

## Scraped Content

# nuxthub
```
nuxt
```
```
nuxt-content
```
```
npx nuxi module add hub
```
```
npx nuxi module add hub
```
```
// nuxt.config.tsexport default defineNuxtConfig({  modules: ['@nuxthub/core'],  hub: {    db: 'sqlite', // 'sqlite' | 'postgresql' | 'mysql'    kv: true,    blob: true,    cache: true,    dir: '.data', // local storage directory    remote: false // use production bindings in dev (v0.10.4+)  }})
```
```
// nuxt.config.tsexport default defineNuxtConfig({  modules: ['@nuxthub/core'],  hub: {    db: 'sqlite', // 'sqlite' | 'postgresql' | 'mysql'    kv: true,    blob: true,    cache: true,    dir: '.data', // local storage directory    remote: false // use production bindings in dev (v0.10.4+)  }})
```
```
hub: {  db: {    dialect: 'postgresql',    driver: 'postgres-js', // Optional: auto-detected    casing: 'snake_case',  // camelCase JS -> snake_case DB    migrationsDirs: ['server/db/custom-migrations/'],    applyMigrationsDuringBuild: true // default  },  remote: true // Use production Cloudflare bindings in dev (v0.10.4+)}
```
```
hub: {  db: {    dialect: 'postgresql',    driver: 'postgres-js', // Optional: auto-detected    casing: 'snake_case',  // camelCase JS -> snake_case DB    migrationsDirs: ['server/db/custom-migrations/'],    applyMigrationsDuringBuild: true // default  },  remote: true // Use production Cloudflare bindings in dev (v0.10.4+)}
```
```
db
```
```
schema
```
```
server/db/schema.ts
```
```
server/db/schema/*.ts
```
```
// server/db/schema.ts (SQLite)import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'export const users = sqliteTable('users', {  id: integer().primaryKey({ autoIncrement: true }),  name: text().notNull(),  email: text().notNull().unique(),  createdAt: integer({ mode: 'timestamp' }).notNull()})
```
```
// server/db/schema.ts (SQLite)import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'export const users = sqliteTable('users', {  id: integer().primaryKey({ autoIncrement: true }),  name: text().notNull(),  email: text().notNull().unique(),  createdAt: integer({ mode: 'timestamp' }).notNull()})
```
```
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'export const users = pgTable('users', {  id: serial().primaryKey(),  name: text().notNull(),  email: text().notNull().unique(),  createdAt: timestamp().notNull().defaultNow()})
```
```
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'export const users = pgTable('users', {  id: serial().primaryKey(),  name: text().notNull(),  email: text().notNull().unique(),  createdAt: timestamp().notNull().defaultNow()})
```
```
// db and schema are auto-imported on server-sideimport { db, schema } from 'hub:db'// Selectconst users = await db.select().from(schema.users)const user = await db.query.users.findFirst({ where: eq(schema.users.id, 1) })// Insertconst [newUser] = await db.insert(schema.users).values({ name: 'John', email: 'john@example.com' }).returning()// Updateawait db.update(schema.users).set({ name: 'Jane' }).where(eq(schema.users.id, 1))// Deleteawait db.delete(schema.users).where(eq(schema.users.id, 1))
```
```
// db and schema are auto-imported on server-sideimport { db, schema } from 'hub:db'// Selectconst users = await db.select().from(schema.users)const user = await db.query.users.findFirst({ where: eq(schema.users.id, 1) })// Insertconst [newUser] = await db.insert(schema.users).values({ name: 'John', email: 'john@example.com' }).returning()// Updateawait db.update(schema.users).set({ name: 'Jane' }).where(eq(schema.users.id, 1))// Deleteawait db.delete(schema.users).where(eq(schema.users.id, 1))
```
```
npx nuxt db generate                  # Generate migrations from schemanpx nuxt db migrate                   # Apply pending migrationsnpx nuxt db sql "SELECT * FROM users" # Execute raw SQLnpx nuxt db drop <TABLE>              # Drop a specific tablenpx nuxt db drop-all                  # Drop all tables (v0.10.4+)npx nuxt db squash                    # Squash migrations into one (v0.10.4+)npx nuxt db mark-as-migrated [NAME]   # Mark as migrated without running
```
```
npx nuxt db generate                  # Generate migrations from schemanpx nuxt db migrate                   # Apply pending migrationsnpx nuxt db sql "SELECT * FROM users" # Execute raw SQLnpx nuxt db drop <TABLE>              # Drop a specific tablenpx nuxt db drop-all                  # Drop all tables (v0.10.4+)npx nuxt db squash                    # Squash migrations into one (v0.10.4+)npx nuxt db mark-as-migrated [NAME]   # Mark as migrated without running
```
```
npx nuxi dev
```
```
npx nuxi build
```
```
_hub_migrations
```
```
.data/db/sqlite.db
```
```
TURSO_DATABASE_URL
```
```
TURSO_AUTH_TOKEN
```
```
DATABASE_URL
```
```
DATABASE_URL
```
```
DATABASE_URL
```
```
MYSQL_URL
```
```
kv
```
```
import { kv } from 'hub:kv'await kv.set('key', { data: 'value' })await kv.set('key', value, { ttl: 60 }) // TTL in secondsconst value = await kv.get('key')const exists = await kv.has('key')await kv.del('key')const keys = await kv.keys('prefix:')await kv.clear('prefix:')
```
```
import { kv } from 'hub:kv'await kv.set('key', { data: 'value' })await kv.set('key', value, { ttl: 60 }) // TTL in secondsconst value = await kv.get('key')const exists = await kv.has('key')await kv.del('key')const keys = await kv.keys('prefix:')await kv.clear('prefix:')
```
```
@upstash/redis
```
```
UPSTASH_REDIS_REST_URL
```
```
UPSTASH_REDIS_REST_TOKEN
```
```
ioredis
```
```
REDIS_URL
```
```
KV
```
```
KV_REST_API_URL
```
```
KV_REST_API_TOKEN
```
```
blob
```
```
import { blob } from 'hub:blob'// Uploadconst result = await blob.put('path/file.txt', body, {  contentType: 'text/plain',  access: 'public', // 'public' | 'private' (v0.10.4+)  addRandomSuffix: true,  prefix: 'uploads'})// Returns: { pathname, contentType, size, httpEtag, uploadedAt }// Downloadconst file = await blob.get('path/file.txt') // Returns Blob or null// Listconst { blobs, cursor, hasMore, folders } = await blob.list({ prefix: 'uploads/', limit: 10, folded: true })// Serve (with proper headers)return blob.serve(event, 'path/file.txt')// Deleteawait blob.del('path/file.txt')await blob.del(['file1.txt', 'file2.txt']) // Multiple// Metadata onlyconst meta = await blob.head('path/file.txt')
```
```
import { blob } from 'hub:blob'// Uploadconst result = await blob.put('path/file.txt', body, {  contentType: 'text/plain',  access: 'public', // 'public' | 'private' (v0.10.4+)  addRandomSuffix: true,  prefix: 'uploads'})// Returns: { pathname, contentType, size, httpEtag, uploadedAt }// Downloadconst file = await blob.get('path/file.txt') // Returns Blob or null// Listconst { blobs, cursor, hasMore, folders } = await blob.list({ prefix: 'uploads/', limit: 10, folded: true })// Serve (with proper headers)return blob.serve(event, 'path/file.txt')// Deleteawait blob.del('path/file.txt')await blob.del(['file1.txt', 'file2.txt']) // Multiple// Metadata onlyconst meta = await blob.head('path/file.txt')
```
```
// Server: Validate + upload handlerexport default eventHandler(async (event) => {  return blob.handleUpload(event, {    formKey: 'files',    multiple: true,    ensure: { maxSize: '10MB', types: ['image/png', 'image/jpeg'] },    put: { addRandomSuffix: true, prefix: 'images' }  })})// Validate before manual uploadensureBlob(file, { maxSize: '10MB', types: ['image'] })// Multipart upload for large files (>10MB)export default eventHandler(async (event) => {  return blob.handleMultipartUpload(event) // Route: /api/files/multipart/[action]/[...pathname]})
```
```
// Server: Validate + upload handlerexport default eventHandler(async (event) => {  return blob.handleUpload(event, {    formKey: 'files',    multiple: true,    ensure: { maxSize: '10MB', types: ['image/png', 'image/jpeg'] },    put: { addRandomSuffix: true, prefix: 'images' }  })})// Validate before manual uploadensureBlob(file, { maxSize: '10MB', types: ['image'] })// Multipart upload for large files (>10MB)export default eventHandler(async (event) => {  return blob.handleMultipartUpload(event) // Route: /api/files/multipart/[action]/[...pathname]})
```
```
// Simple uploadconst upload = useUpload('/api/upload')const result = await upload(inputElement)// Multipart with progressconst mpu = useMultipartUpload('/api/files/multipart')const { completed, progress, abort } = mpu(file)
```
```
// Simple uploadconst upload = useUpload('/api/upload')const result = await upload(inputElement)// Multipart with progressconst mpu = useMultipartUpload('/api/files/multipart')const { completed, progress, abort } = mpu(file)
```
```
BLOB
```
```
@vercel/blob
```
```
BLOB_READ_WRITE_TOKEN
```
```
aws4fetch
```
```
S3_ACCESS_KEY_ID
```
```
S3_SECRET_ACCESS_KEY
```
```
S3_BUCKET
```
```
S3_REGION
```
```
export default cachedEventHandler((event) => {  return { data: 'cached', date: new Date().toISOString() }}, {  maxAge: 60 * 60, // 1 hour  getKey: event => event.path})
```
```
export default cachedEventHandler((event) => {  return { data: 'cached', date: new Date().toISOString() }}, {  maxAge: 60 * 60, // 1 hour  getKey: event => event.path})
```
```
export const getStars = defineCachedFunction(  async (event: H3Event, repo: string) => {    const data = await $fetch(https://api.github.com/repos/${repo})    return data.stargazers_count  },  { maxAge: 3600, name: 'ghStars', getKey: (event, repo) => repo })
```
```
export const getStars = defineCachedFunction(  async (event: H3Event, repo: string) => {    const data = await $fetch(https://api.github.com/repos/${repo})    return data.stargazers_count  },  { maxAge: 3600, name: 'ghStars', getKey: (event, repo) => repo })
```
```
https://api.github.com/repos/${repo}
```
```
// Remove specificawait useStorage('cache').removeItem('nitro:functions:getStars:repo-name.json')// Clear by prefixawait useStorage('cache').clear('nitro:handlers')
```
```
// Remove specificawait useStorage('cache').removeItem('nitro:functions:getStars:repo-name.json')// Clear by prefixawait useStorage('cache').clear('nitro:handlers')
```
```
${group}:${name}:${getKey(...args)}.json
```
```
wrangler.json
```
```
// nuxt.config.tsexport default defineNuxtConfig({  hub: {    db: {      dialect: 'sqlite',      driver: 'd1',      connection: { databaseId: '<database-id>' }    },    kv: {      driver: 'cloudflare-kv-binding',      namespaceId: '<kv-namespace-id>'    },    cache: {      driver: 'cloudflare-kv-binding',      namespaceId: '<cache-namespace-id>'    },    blob: {      driver: 'cloudflare-r2',      bucketName: '<bucket-name>'    }  }})
```
```
// nuxt.config.tsexport default defineNuxtConfig({  hub: {    db: {      dialect: 'sqlite',      driver: 'd1',      connection: { databaseId: '<database-id>' }    },    kv: {      driver: 'cloudflare-kv-binding',      namespaceId: '<kv-namespace-id>'    },    cache: {      driver: 'cloudflare-kv-binding',      namespaceId: '<cache-namespace-id>'    },    blob: {      driver: 'cloudflare-r2',      bucketName: '<bucket-name>'    }  }})
```
```
// wrangler.jsonc (optional){  "observability": {    "logs": {      "enabled": true,      "head_sampling_rate": 1,      "invocation_logs": true,      "persist": true    }  }}
```
```
// wrangler.jsonc (optional){  "observability": {    "logs": {      "enabled": true,      "head_sampling_rate": 1,      "invocation_logs": true,      "persist": true    }  }}
```
```
npx wrangler d1 create my-db              # Get database-idnpx wrangler kv namespace create KV       # Get kv-namespace-idnpx wrangler kv namespace create CACHE    # Get cache-namespace-idnpx wrangler r2 bucket create my-bucket   # Get bucket-name
```
```
npx wrangler d1 create my-db              # Get database-idnpx wrangler kv namespace create KV       # Get kv-namespace-idnpx wrangler kv namespace create CACHE    # Get cache-namespace-idnpx wrangler r2 bucket create my-bucket   # Get bucket-name
```
```
CLOUDFLARE_ENV=preview
```
```
hub: {  db: { dialect: 'sqlite', driver: 'd1-http' }}
```
```
hub: {  db: { dialect: 'sqlite', driver: 'd1-http' }}
```
```
NUXT_HUB_CLOUDFLARE_ACCOUNT_ID
```
```
NUXT_HUB_CLOUDFLARE_API_TOKEN
```
```
NUXT_HUB_CLOUDFLARE_DATABASE_ID
```
```
// Extend schemanuxt.hook('hub:db:schema:extend', async ({ dialect, paths }) => {  paths.push(await resolvePath(./schema/custom.${dialect}))})// Add migration directoriesnuxt.hook('hub:db:migrations:dirs', (dirs) => {  dirs.push(resolve('./db-migrations'))})// Post-migration queries (idempotent)nuxt.hook('hub:db:queries:paths', (paths, dialect) => {  paths.push(resolve(./seed.${dialect}.sql))})
```
```
// Extend schemanuxt.hook('hub:db:schema:extend', async ({ dialect, paths }) => {  paths.push(await resolvePath(./schema/custom.${dialect}))})// Add migration directoriesnuxt.hook('hub:db:migrations:dirs', (dirs) => {  dirs.push(resolve('./db-migrations'))})// Post-migration queries (idempotent)nuxt.hook('hub:db:queries:paths', (paths, dialect) => {  paths.push(resolve(./seed.${dialect}.sql))})
```
```
./schema/custom.${dialect}
```
```
./seed.${dialect}.sql
```
```
// shared/types/db.tsimport type { users } from '~/server/db/schema'export type User = typeof users.$inferSelectexport type NewUser = typeof users.$inferInsert
```
```
// shared/types/db.tsimport type { users } from '~/server/db/schema'export type User = typeof users.$inferSelectexport type NewUser = typeof users.$inferInsert
```
```
// nuxt.config.tsnitro: { experimental: { websocket: true } }
```
```
// nuxt.config.tsnitro: { experimental: { websocket: true } }
```
```
// server/routes/ws/chat.tsexport default defineWebSocketHandler({  open(peer) {    peer.subscribe('chat')    peer.publish('chat', 'User joined')  },  message(peer, message) {    peer.publish('chat', message.text())  },  close(peer) {    peer.unsubscribe('chat')  }})
```
```
// server/routes/ws/chat.tsexport default defineWebSocketHandler({  open(peer) {    peer.subscribe('chat')    peer.publish('chat', 'User joined')  },  message(peer, message) {    peer.publish('chat', message.text())  },  close(peer) {    peer.unsubscribe('chat')  }})
```
```
hubAI()
```
```
hubBrowser()
```
```
hubVectorize()
```
```
npx nuxthub deploy
```
```
import { db, schema } from 'hub:db'
```
```
db.select()
```
```
db.insert()
```
```
import { kv } from 'hub:kv'
```
```
kv.get()
```
```
kv.set()
```
```
import { blob } from 'hub:blob'
```
```
blob.put()
```
```
blob.get()
```
The NuxtHub Agent Skill empowers your AI coding assistant to provide expert guidance on building modern, full-stack Nuxt applications. With deep knowledge of NuxtHub v0.10.4, it can help you integrate type-safe databases using Drizzle ORM, manage KV and blob storage, and implement caching strategies. Whether you're configuring a new project, defining database schemas, handling migrations, or deploying to multi-cloud environments like Cloudflare or Vercel, this skill ensures you receive precise, context-aware assistance. It understands the nuances of NuxtHub's virtual modules, making complex full-stack development more accessible and efficient.

# When to Use This Skill
- •Setting up a new NuxtHub project, including initial configuration for database dialect (SQLite, PostgreSQL, MySQL), KV, blob, and cache.
- •Designing and implementing database schemas using Drizzle ORM within a NuxtHub application, including defining relationships and types.
- •Generating and applying database migrations for schema changes in development and production environments.
- •Troubleshooting deployment issues related to NuxtHub applications on Cloudflare Workers, Vercel, or other supported platforms.

# Pro Tips
- 💡When facing local vs. production data discrepancies, instruct the agent to enable `remote: true` in `hub` config for testing with live Cloudflare bindings during development.
- 💡For complex database operations, combine this skill with a general `drizzle-orm` skill to leverage advanced query building and schema definition.
- 💡Always specify the exact NuxtHub version (e.g., v0.10.4) in your prompts to ensure the most accurate and up-to-date advice from the skill.

