# drizzle-orm-d1
Source: https://antigravity.codes/agent-skills/database/drizzle-orm-d1

## AI Worker Instructions
When the user requests functionality related to drizzle-orm-d1, follow these guidelines and utilize this context.

## Scraped Content

# drizzle-orm-d1
```
# 1. Installnpm install drizzle-ormnpm install -D drizzle-kit# 2. Configure drizzle.config.tsimport { defineConfig } from 'drizzle-kit';export default defineConfig({  schema: './src/db/schema.ts',  out: './migrations',  dialect: 'sqlite',  driver: 'd1-http',  dbCredentials: {    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,    token: process.env.CLOUDFLARE_D1_TOKEN!,  },});# 3. Configure wrangler.jsonc{  "d1_databases": [{    "binding": "DB",    "database_name": "my-database",    "database_id": "your-database-id",    "migrations_dir": "./migrations"  // CRITICAL: Points to Drizzle migrations  }]}# 4. Define schema (src/db/schema.ts)import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';export const users = sqliteTable('users', {  id: integer('id').primaryKey({ autoIncrement: true }),  email: text('email').notNull().unique(),  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),});# 5. Generate & apply migrationsnpx drizzle-kit generatenpx wrangler d1 migrations apply my-database --local   # Test firstnpx wrangler d1 migrations apply my-database --remote  # Then production# 6. Query in Workerimport { drizzle } from 'drizzle-orm/d1';import { users } from './db/schema';const db = drizzle(env.DB);const allUsers = await db.select().from(users).all();
```
```
# 1. Installnpm install drizzle-ormnpm install -D drizzle-kit# 2. Configure drizzle.config.tsimport { defineConfig } from 'drizzle-kit';export default defineConfig({  schema: './src/db/schema.ts',  out: './migrations',  dialect: 'sqlite',  driver: 'd1-http',  dbCredentials: {    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,    token: process.env.CLOUDFLARE_D1_TOKEN!,  },});# 3. Configure wrangler.jsonc{  "d1_databases": [{    "binding": "DB",    "database_name": "my-database",    "database_id": "your-database-id",    "migrations_dir": "./migrations"  // CRITICAL: Points to Drizzle migrations  }]}# 4. Define schema (src/db/schema.ts)import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';export const users = sqliteTable('users', {  id: integer('id').primaryKey({ autoIncrement: true }),  email: text('email').notNull().unique(),  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),});# 5. Generate & apply migrationsnpx drizzle-kit generatenpx wrangler d1 migrations apply my-database --local   # Test firstnpx wrangler d1 migrations apply my-database --remote  # Then production# 6. Query in Workerimport { drizzle } from 'drizzle-orm/d1';import { users } from './db/schema';const db = drizzle(env.DB);const allUsers = await db.select().from(users).all();
```
```
db.batch()
```
```
--local
```
```
--remote
```
```
integer
```
```
mode: 'timestamp'
```
```
.$defaultFn()
```
```
.default()
```
```
migrations_dir
```
```
./migrations
```
```
BEGIN TRANSACTION
```
```
drizzle-kit push
```
```
generate
```
```
apply
```
```
npx drizzle-kit studio# Opens http://local.drizzle.studio# For remote D1 databasenpx drizzle-kit studio --port 3001
```
```
npx drizzle-kit studio# Opens http://local.drizzle.studio# For remote D1 databasenpx drizzle-kit studio --port 3001
```
```
drizzle-kit generate
```
```
drizzle-kit push
```
```
drizzle-kit pull
```
```
drizzle-kit check
```
```
drizzle-kit up
```
```
# Introspect existing D1 databasenpx drizzle-kit pull# Validate migrations haven't collidednpx drizzle-kit check
```
```
# Introspect existing D1 databasenpx drizzle-kit pull# Validate migrations haven't collidednpx drizzle-kit check
```
```
.$dynamic()
```
```
import { eq, and, or, like, sql } from 'drizzle-orm';// Base queryfunction getUsers(filters: { name?: string; email?: string; active?: boolean }) {  let query = db.select().from(users).$dynamic();  if (filters.name) {    query = query.where(like(users.name, %${filters.name}%));  }  if (filters.email) {    query = query.where(eq(users.email, filters.email));  }  if (filters.active !== undefined) {    query = query.where(eq(users.active, filters.active));  }  return query;}// Usageconst results = await getUsers({ name: 'John', active: true });
```
```
import { eq, and, or, like, sql } from 'drizzle-orm';// Base queryfunction getUsers(filters: { name?: string; email?: string; active?: boolean }) {  let query = db.select().from(users).$dynamic();  if (filters.name) {    query = query.where(like(users.name, %${filters.name}%));  }  if (filters.email) {    query = query.where(eq(users.email, filters.email));  }  if (filters.active !== undefined) {    query = query.where(eq(users.active, filters.active));  }  return query;}// Usageconst results = await getUsers({ name: 'John', active: true });
```
```
%${filters.name}%
```
```
import { users } from './schema';// Insert or ignore if existsawait db.insert(users)  .values({ id: 1, email: 'test@example.com', name: 'Test' })  .onConflictDoNothing();// Insert or update specific fields on conflictawait db.insert(users)  .values({ id: 1, email: 'test@example.com', name: 'Test' })  .onConflictDoUpdate({    target: users.email,  // Conflict on unique email    set: {      name: sqlexcluded.name,  // Use value from INSERT      updatedAt: new Date(),    },  });
```
```
import { users } from './schema';// Insert or ignore if existsawait db.insert(users)  .values({ id: 1, email: 'test@example.com', name: 'Test' })  .onConflictDoNothing();// Insert or update specific fields on conflictawait db.insert(users)  .values({ id: 1, email: 'test@example.com', name: 'Test' })  .onConflictDoUpdate({    target: users.email,  // Conflict on unique email    set: {      name: sqlexcluded.name,  // Use value from INSERT      updatedAt: new Date(),    },  });
```
```
excluded.name
```
```
import { drizzle } from 'drizzle-orm/d1';// Enable query loggingconst db = drizzle(env.DB, { logger: true });// Custom loggerconst db = drizzle(env.DB, {  logger: {    logQuery(query, params) {      console.log('SQL:', query);      console.log('Params:', params);    },  },});// Get SQL without executing (for debugging)const query = db.select().from(users).where(eq(users.id, 1));const sql = query.toSQL();console.log(sql.sql, sql.params);
```
```
import { drizzle } from 'drizzle-orm/d1';// Enable query loggingconst db = drizzle(env.DB, { logger: true });// Custom loggerconst db = drizzle(env.DB, {  logger: {    logQuery(query, params) {      console.log('SQL:', query);      console.log('Params:', params);    },  },});// Get SQL without executing (for debugging)const query = db.select().from(users).where(eq(users.id, 1));const sql = query.toSQL();console.log(sql.sql, sql.params);
```
```
D1_ERROR: Cannot use BEGIN TRANSACTION
```
```
BEGIN TRANSACTION
```
```
db.batch([...])
```
```
db.transaction()
```
```
FOREIGN KEY constraint failed: SQLITE_CONSTRAINT
```
```
PRAGMA foreign_keys = OFF;
```
```
.references(() => users.id, { onDelete: 'cascade' })
```
```
Error: No such module "wrangler"
```
```
wrangler
```
```
import { drizzle } from 'drizzle-orm/d1'
```
```
wrangler
```
```
TypeError: Cannot read property 'prepare' of undefined
```
```
"binding": "DB"
```
```
env.DB
```
```
Migration failed to apply: near "...": syntax error
```
```
--local
```
```
Type instantiation is excessively deep and possibly infinite
```
```
InferSelectModel<typeof users>
```
```
.all()
```
```
.get()
```
```
strict: true
```
```
Promise<User | undefined>
```
```
Cannot find drizzle.config.ts
```
```
drizzle.config.ts
```
```
--local
```
```
--remote
```
```
wrangler.jsonc
```
```
too many SQL variables at offset
```
```
(rows × columns) > 100
```
```
// 35 rows × 3 columns = 105 parameters → FAILSconst books = Array(35).fill({}).map((_, i) => ({  id: i.toString(),  title: "Book",  author: "Author",}));await db.insert(schema.books).values(books);// Error: too many SQL variables at offset
```
```
// 35 rows × 3 columns = 105 parameters → FAILSconst books = Array(35).fill({}).map((_, i) => ({  id: i.toString(),  title: "Book",  author: "Author",}));await db.insert(schema.books).values(books);// Error: too many SQL variables at offset
```
```
async function batchInsert<T>(  db: any,  table: any,  items: T[],  chunkSize = 32) {  for (let i = 0; i < items.length; i += chunkSize) {    await db.insert(table).values(items.slice(i, i + chunkSize));  }}await batchInsert(db, schema.books, books);
```
```
async function batchInsert<T>(  db: any,  table: any,  items: T[],  chunkSize = 32) {  for (let i = 0; i < items.length; i += chunkSize) {    await db.insert(table).values(items.slice(i, i + chunkSize));  }}await batchInsert(db, schema.books, books);
```
```
const D1_MAX_PARAMETERS = 100;async function autochunk<T extends Record<string, unknown>, U>(  { items, otherParametersCount = 0 }: {    items: T[];    otherParametersCount?: number;  },  cb: (chunk: T[]) => Promise<U>,) {  const chunks: T[][] = [];  let chunk: T[] = [];  let chunkParameters = 0;  for (const item of items) {    const itemParameters = Object.keys(item).length;    if (chunkParameters + itemParameters + otherParametersCount > D1_MAX_PARAMETERS) {      chunks.push(chunk);      chunkParameters = itemParameters;      chunk = [item];      continue;    }    chunk.push(item);    chunkParameters += itemParameters;  }  if (chunk.length) chunks.push(chunk);  const results: U[] = [];  for (const c of chunks) {    results.push(await cb(c));  }  return results.flat();}// Usageconst inserted = await autochunk(  { items: books },  (chunk) => db.insert(schema.books).values(chunk).returning());
```
```
const D1_MAX_PARAMETERS = 100;async function autochunk<T extends Record<string, unknown>, U>(  { items, otherParametersCount = 0 }: {    items: T[];    otherParametersCount?: number;  },  cb: (chunk: T[]) => Promise<U>,) {  const chunks: T[][] = [];  let chunk: T[] = [];  let chunkParameters = 0;  for (const item of items) {    const itemParameters = Object.keys(item).length;    if (chunkParameters + itemParameters + otherParametersCount > D1_MAX_PARAMETERS) {      chunks.push(chunk);      chunkParameters = itemParameters;      chunk = [item];      continue;    }    chunk.push(item);    chunkParameters += itemParameters;  }  if (chunk.length) chunks.push(chunk);  const results: U[] = [];  for (const c of chunks) {    results.push(await cb(c));  }  return results.flat();}// Usageconst inserted = await autochunk(  { items: books },  (chunk) => db.insert(schema.books).values(chunk).returning());
```
```
drizzle-seed
```
```
seed(db, schema, { count: 10 })
```
```
findFirst
```
```
TypeError: Cannot read properties of undefined (reading '0')
```
```
findFirst
```
```
null
```
```
undefined
```
```
pnpm patch
```
```
findFirst
```
```
// Works fine - returns null/undefined when not foundconst result = await db.query.table.findFirst({  where: eq(schema.table.key, 'not-existing'),});// Throws TypeError instead of returning undefinedconst [result] = await db.batch([  db.query.table.findFirst({    where: eq(schema.table.key, 'not-existing'),  }),]);// Error: TypeError: Cannot read properties of undefined (reading '0')
```
```
// Works fine - returns null/undefined when not foundconst result = await db.query.table.findFirst({  where: eq(schema.table.key, 'not-existing'),});// Throws TypeError instead of returning undefinedconst [result] = await db.batch([  db.query.table.findFirst({    where: eq(schema.table.key, 'not-existing'),  }),]);// Error: TypeError: Cannot read properties of undefined (reading '0')
```
```
# Create patch with pnpmpnpm patch drizzle-orm
```
```
# Create patch with pnpmpnpm patch drizzle-orm
```
```
node_modules/drizzle-orm/d1/session.js
```
```
// In mapGetResult method, add null check:if (!result) {  return undefined;}if (this.customResultMapper) {  return this.customResultMapper([result]);}
```
```
// In mapGetResult method, add null check:if (!result) {  return undefined;}if (this.customResultMapper) {  return this.customResultMapper([result]);}
```
```
// Instead of batch with findFirst, use separate queriesconst result = await db.query.table.findFirst({  where: eq(schema.table.key, key),});
```
```
// Instead of batch with findFirst, use separate queriesconst result = await db.query.table.findFirst({  where: eq(schema.table.key, key),});
```
```
-- D1 supports this, but Drizzle has no JS equivalentCREATE TABLE products (  id INTEGER PRIMARY KEY,  data TEXT,  price REAL GENERATED ALWAYS AS (json_extract(data, '$.price')) STORED);CREATE INDEX idx_price ON products(price);
```
```
-- D1 supports this, but Drizzle has no JS equivalentCREATE TABLE products (  id INTEGER PRIMARY KEY,  data TEXT,  price REAL GENERATED ALWAYS AS (json_extract(data, '$.price')) STORED);CREATE INDEX idx_price ON products(price);
```
```
import { sql } from 'drizzle-orm';// Current workaround - raw SQL onlyawait db.run(sql  CREATE TABLE products (    id INTEGER PRIMARY KEY,    data TEXT,    price REAL GENERATED ALWAYS AS (json_extract(data, '$.price')) STORED  ));// Or in migration file (migrations/XXXX_add_generated.sql)CREATE INDEX idx_price ON products(price);
```
```
import { sql } from 'drizzle-orm';// Current workaround - raw SQL onlyawait db.run(sql  CREATE TABLE products (    id INTEGER PRIMARY KEY,    data TEXT,    price REAL GENERATED ALWAYS AS (json_extract(data, '$.price')) STORED  ));// Or in migration file (migrations/XXXX_add_generated.sql)CREATE INDEX idx_price ON products(price);
```
```
CREATE TABLE products (    id INTEGER PRIMARY KEY,    data TEXT,    price REAL GENERATED ALWAYS AS (json_extract(data, '$.price')) STORED  )
```
```
PRAGMA foreign_keys=OFF
```
```
onDelete: "cascade"
```
```
// Schema with cascade relationshipsexport const account = sqliteTable("account", {  accountId: integer("account_id").primaryKey(),  name: text("name"),});export const property = sqliteTable("property", {  propertyId: integer("property_id").primaryKey(),  accountId: integer("account_id").references(() => account.accountId, {    onDelete: "cascade"  // ⚠️ CASCADE DELETE  }),});// Change account schema (e.g., add a column)// npx drizzle-kit generate creates:// DROP TABLE account;  -- ⚠️ Silently destroys ALL properties via cascade!// CREATE TABLE account (...);
```
```
// Schema with cascade relationshipsexport const account = sqliteTable("account", {  accountId: integer("account_id").primaryKey(),  name: text("name"),});export const property = sqliteTable("property", {  propertyId: integer("property_id").primaryKey(),  accountId: integer("account_id").references(() => account.accountId, {    onDelete: "cascade"  // ⚠️ CASCADE DELETE  }),});// Change account schema (e.g., add a column)// npx drizzle-kit generate creates:// DROP TABLE account;  -- ⚠️ Silently destroys ALL properties via cascade!// CREATE TABLE account (...);
```
```
-- Manually rewrite migration to backup related dataPRAGMA foreign_keys=OFF;  -- D1 ignores this, but include anyway-- 1. Backup related tablesCREATE TABLE backup_property AS SELECT * FROM property;-- 2. Drop and recreate parent tableDROP TABLE account;CREATE TABLE account (  account_id INTEGER PRIMARY KEY,  name TEXT,  -- new columns here);-- 3. Restore related dataINSERT INTO property SELECT * FROM backup_property;DROP TABLE backup_property;PRAGMA foreign_keys=ON;
```
```
-- Manually rewrite migration to backup related dataPRAGMA foreign_keys=OFF;  -- D1 ignores this, but include anyway-- 1. Backup related tablesCREATE TABLE backup_property AS SELECT * FROM property;-- 2. Drop and recreate parent tableDROP TABLE account;CREATE TABLE account (  account_id INTEGER PRIMARY KEY,  name TEXT,  -- new columns here);-- 3. Restore related dataINSERT INTO property SELECT * FROM backup_property;DROP TABLE backup_property;PRAGMA foreign_keys=ON;
```
```
DROP TABLE
```
```
onDelete: "cascade"
```
```
onDelete: "set null"
```
```
"cascade"
```
```
sql
```
```
TypeError: Cannot read properties of undefined (reading 'bind')
```
```
sql
```
```
db.batch()
```
```
sql
```
```
const upsertSql = sqlinsert into ${schema.subscriptions}  (id, status) values (${id}, ${status})  on conflict (id) do update set status = ${status}  returning *;// Works fineconst [subscription] = await db.all<Subscription>(upsertSql);// Throws TypeError: Cannot read properties of undefined (reading 'bind')const [[batchSubscription]] = await db.batch([  db.all<Subscription>(upsertSql),]);
```
```
const upsertSql = sqlinsert into ${schema.subscriptions}  (id, status) values (${id}, ${status})  on conflict (id) do update set status = ${status}  returning *;// Works fineconst [subscription] = await db.all<Subscription>(upsertSql);// Throws TypeError: Cannot read properties of undefined (reading 'bind')const [[batchSubscription]] = await db.batch([  db.all<Subscription>(upsertSql),]);
```
```
insert into ${schema.subscriptions}  (id, status) values (${id}, ${status})  on conflict (id) do update set status = ${status}  returning *
```
```
// Use Drizzle query builder insteadconst [result] = await db.batch([  db.insert(schema.subscriptions)    .values({ id, status })    .onConflictDoUpdate({      target: schema.subscriptions.id,      set: { status }    })    .returning()]);
```
```
// Use Drizzle query builder insteadconst [result] = await db.batch([  db.insert(schema.subscriptions)    .values({ id, status })    .onConflictDoUpdate({      target: schema.subscriptions.id,      set: { status }    })    .returning()]);
```
```
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';const sqliteDialect = new SQLiteSyncDialect();const upsertQuery = sqliteDialect.sqlToQuery(upsertSql);const [result] = await D1.batch([  D1.prepare(upsertQuery.sql).bind(...upsertQuery.params),]);
```
```
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';const sqliteDialect = new SQLiteSyncDialect();const upsertQuery = sqliteDialect.sqlToQuery(upsertSql);const [result] = await D1.batch([  D1.prepare(upsertQuery.sql).bind(...upsertQuery.params),]);
```
```
wrangler d1 migrations apply
```
```
# Drizzle 1.0 beta generates this:migrations/  20260116123456_random/    migration.sql  20260117234567_another/    migration.sql# But wrangler expects this:migrations/  20260116123456_random.sql  20260117234567_another.sql
```
```
# Drizzle 1.0 beta generates this:migrations/  20260116123456_random/    migration.sql  20260117234567_another/    migration.sql# But wrangler expects this:migrations/  20260116123456_random.sql  20260117234567_another.sql
```
```
npx wrangler d1 migrations apply my-db --remote# Output: "No migrations found" (even though migrations exist)
```
```
npx wrangler d1 migrations apply my-db --remote# Output: "No migrations found" (even though migrations exist)
```
```
// scripts/flatten-migrations.tsimport fs from 'fs/promises';import path from 'path';const migrationsDir = './migrations';async function flattenMigrations() {  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });  for (const entry of entries) {    if (entry.isDirectory()) {      const sqlFile = path.join(migrationsDir, entry.name, 'migration.sql');      const flatFile = path.join(migrationsDir, ${entry.name}.sql);      // Move migration.sql out of folder      await fs.rename(sqlFile, flatFile);      // Remove empty folder      await fs.rmdir(path.join(migrationsDir, entry.name));      console.log(Flattened: ${entry.name}/migration.sql → ${entry.name}.sql);    }  }}flattenMigrations().catch(console.error);
```
```
// scripts/flatten-migrations.tsimport fs from 'fs/promises';import path from 'path';const migrationsDir = './migrations';async function flattenMigrations() {  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });  for (const entry of entries) {    if (entry.isDirectory()) {      const sqlFile = path.join(migrationsDir, entry.name, 'migration.sql');      const flatFile = path.join(migrationsDir, ${entry.name}.sql);      // Move migration.sql out of folder      await fs.rename(sqlFile, flatFile);      // Remove empty folder      await fs.rmdir(path.join(migrationsDir, entry.name));      console.log(Flattened: ${entry.name}/migration.sql → ${entry.name}.sql);    }  }}flattenMigrations().catch(console.error);
```
```
${entry.name}.sql
```
```
Flattened: ${entry.name}/migration.sql → ${entry.name}.sql
```
```
{  "scripts": {    "db:generate": "drizzle-kit generate",    "db:flatten": "tsx scripts/flatten-migrations.ts",    "db:migrate": "npm run db:generate && npm run db:flatten && wrangler d1 migrations apply my-db"  }}
```
```
{  "scripts": {    "db:generate": "drizzle-kit generate",    "db:flatten": "tsx scripts/flatten-migrations.ts",    "db:migrate": "npm run db:generate && npm run db:flatten && wrangler d1 migrations apply my-db"  }}
```
```
npx drizzle-kit generatetsx scripts/flatten-migrations.tsnpx wrangler d1 migrations apply my-db --remote
```
```
npx drizzle-kit generatetsx scripts/flatten-migrations.tsnpx wrangler d1 migrations apply my-db --remote
```
```
flat: true
```
```
// ❌ DON'T: Use traditional transactions (fails with D1_ERROR)await db.transaction(async (tx) => { /* ... */ });// ✅ DO: Use D1 batch APIconst results = await db.batch([  db.insert(users).values({ email: 'test@example.com', name: 'Test' }),  db.insert(posts).values({ title: 'Post', content: 'Content', authorId: 1 }),]);// With error handlingtry {  await db.batch([...]);} catch (error) {  console.error('Batch failed:', error);  // Manual cleanup if needed}
```
```
// ❌ DON'T: Use traditional transactions (fails with D1_ERROR)await db.transaction(async (tx) => { /* ... */ });// ✅ DO: Use D1 batch APIconst results = await db.batch([  db.insert(users).values({ email: 'test@example.com', name: 'Test' }),  db.insert(posts).values({ title: 'Post', content: 'Content', authorId: 1 }),]);// With error handlingtry {  await db.batch([...]);} catch (error) {  console.error('Batch failed:', error);  // Manual cleanup if needed}
```
```
./scripts/check-versions.sh
```
```
./scripts/check-versions.sh
```
```
Checking Drizzle ORM versions...✓ drizzle-orm: 0.44.7 (latest)✓ drizzle-kit: 0.31.5 (latest)
```
```
Checking Drizzle ORM versions...✓ drizzle-orm: 0.44.7 (latest)✓ drizzle-kit: 0.31.5 (latest)
```
```
drizzle-orm@0.45.1
```
```
drizzle-kit@0.31.8
```
```
better-sqlite3@12.4.6
```
```
@cloudflare/workers-types@4.20251125.0
```
```
/drizzle-team/drizzle-orm-docs
```
```
{  "dependencies": {    "drizzle-orm": "^0.45.1"  },  "devDependencies": {    "drizzle-kit": "^0.31.8",    "@cloudflare/workers-types": "^4.20260103.0",    "better-sqlite3": "^12.5.0"  }}
```
```
{  "dependencies": {    "drizzle-orm": "^0.45.1"  },  "devDependencies": {    "drizzle-kit": "^0.31.8",    "@cloudflare/workers-types": "^4.20260103.0",    "better-sqlite3": "^12.5.0"  }}
```
```
/* ❌ D1 doesn't support SQL BEGIN/COMMIT */await db.transaction(async (tx) => {  await tx.insert(users).values({ ... })  await tx.insert(posts).values({ ... })})// Error: D1_ERROR: Cannot use BEGIN TRANSACTION/* ✅ Use D1 batch API instead */await db.batch([  db.insert(users).values({ email: 'test@example.com' }),  db.insert(posts).values({ title: 'Post', authorId: 1 }),])
```
```
/* ❌ D1 doesn't support SQL BEGIN/COMMIT */await db.transaction(async (tx) => {  await tx.insert(users).values({ ... })  await tx.insert(posts).values({ ... })})// Error: D1_ERROR: Cannot use BEGIN TRANSACTION/* ✅ Use D1 batch API instead */await db.batch([  db.insert(users).values({ email: 'test@example.com' }),  db.insert(posts).values({ title: 'Post', authorId: 1 }),])
```
```
# ❌ drizzle-kit push doesn't work reliably with D1npx drizzle-kit push# ✅ Generate SQL then apply with Wranglernpx drizzle-kit generatenpx wrangler d1 migrations apply my-database --local   # Test firstnpx wrangler d1 migrations apply my-database --remote  # Production
```
```
# ❌ drizzle-kit push doesn't work reliably with D1npx drizzle-kit push# ✅ Generate SQL then apply with Wranglernpx drizzle-kit generatenpx wrangler d1 migrations apply my-database --local   # Test firstnpx wrangler d1 migrations apply my-database --remote  # Production
```
```
{  "d1_databases": [{    "binding": "DB",    "database_name": "my-database",    "database_id": "your-database-id",    "migrations_dir": "./migrations"  // Points to Drizzle output  }]}
```
```
{  "d1_databases": [{    "binding": "DB",    "database_name": "my-database",    "database_id": "your-database-id",    "migrations_dir": "./migrations"  // Points to Drizzle output  }]}
```
```
/* ❌ D1 has no native DATE type */createdAt: text('created_at')/* ✅ Use integer with timestamp mode */createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
```
```
/* ❌ D1 has no native DATE type */createdAt: text('created_at')/* ✅ Use integer with timestamp mode */createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
```
```
/* ❌ May fail during migrations */authorId: integer('author_id').references(() => users.id)/* ✅ Add cascading to prevent constraint failures */authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' })
```
```
/* ❌ May fail during migrations */authorId: integer('author_id').references(() => users.id)/* ✅ Add cascading to prevent constraint failures */authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' })
```
```
/* ❌ Fails in production */import { ... } from 'wrangler'/* ✅ Use drizzle-orm/d1 */import { drizzle } from 'drizzle-orm/d1'const db = drizzle(env.DB)
```
```
/* ❌ Fails in production */import { ... } from 'wrangler'/* ✅ Use drizzle-orm/d1 */import { drizzle } from 'drizzle-orm/d1'const db = drizzle(env.DB)
```
```
db.transaction()
```
```
db.batch([...])
```
```
npx drizzle-kit push
```
```
npx drizzle-kit generate
```
```
wrangler d1 migrations apply
```
```
migrations_dir
```
```
text()
```
```
integer('col', { mode: 'timestamp' })
```
```
.default(new Date())
```
```
.$defaultFn(() => new Date())
```
```
wrangler.toml
```
```
wrangler.jsonc
```
This agent skill empowers developers to seamlessly integrate Drizzle ORM with Cloudflare D1, making serverless database management straightforward. It provides a comprehensive guide for setting up your environment, defining schemas, and managing migrations, all tailored for Cloudflare's edge database. Whether you're building a new application or refactoring an existing one, this skill ensures your AI coding assistant can generate accurate, efficient Drizzle ORM code for your D1 database, accelerating your development workflow and reducing common errors related to database interactions in a serverless context.

# When to Use This Skill
- •Scaffolding a new Cloudflare Worker project that requires a persistent database layer using Drizzle ORM and D1.
- •Generating Drizzle ORM schema definitions (tables, columns, relations) based on application requirements for a Cloudflare D1 database.
- •Assisting with Drizzle ORM migration generation and application for Cloudflare D1, ensuring database schema evolution is smooth.
- •Troubleshooting common Drizzle ORM or Cloudflare D1 configuration issues within a serverless environment.

# Pro Tips
- 💡Always define your Drizzle schema with explicit types and constraints to leverage TypeScript's full power and prevent runtime errors in your D1 interactions.
- 💡Utilize Drizzle's `sqlite-core` dialect specific features for D1, such as `primaryKey({ autoIncrement: true })`, for optimal performance and integration.
- 💡Regularly review your `drizzle.config.ts` and `wrangler.jsonc` to ensure migration paths and database bindings are correctly configured for both local development and production deployments.

