# neon-vercel-postgres
Source: https://antigravity.codes/agent-skills/database/neon-vercel-postgres

## AI Worker Instructions
When the user requests functionality related to neon-vercel-postgres, follow these guidelines and utilize this context.

## Scraped Content

# neon-vercel-postgres
```
@neondatabase/serverless@1.0.2
```
```
@vercel/postgres@0.10.0
```
```
drizzle-orm@0.45.1
```
```
drizzle-kit@0.31.8
```
```
neonctl@2.19.0
```
```
npm install @neondatabase/serverless
```
```
npm install @neondatabase/serverless
```
```
npm install @vercel/postgres
```
```
npm install @vercel/postgres
```
```
# Sign up at https://neon.tech# Create a project → Get connection string# Format: postgresql://user:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require
```
```
# Sign up at https://neon.tech# Create a project → Get connection string# Format: postgresql://user:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require
```
```
# In your Vercel projectvercel postgres createvercel env pull .env.local  # Automatically creates POSTGRES_URL and other vars
```
```
# In your Vercel projectvercel postgres createvercel env pull .env.local  # Automatically creates POSTGRES_URL and other vars
```
```
-pooler.region.aws.neon.tech
```
```
?sslmode=require
```
```
import { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);// Simple queryconst users = await sqlSELECT * FROM users WHERE id = ${userId};// Transactionsconst result = await sql.transaction([  sqlINSERT INTO users (name) VALUES (${name}),  sqlSELECT * FROM users WHERE name = ${name}]);
```
```
import { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);// Simple queryconst users = await sqlSELECT * FROM users WHERE id = ${userId};// Transactionsconst result = await sql.transaction([  sqlINSERT INTO users (name) VALUES (${name}),  sqlSELECT * FROM users WHERE name = ${name}]);
```
```
SELECT * FROM users WHERE id = ${userId}
```
```
INSERT INTO users (name) VALUES (${name})
```
```
SELECT * FROM users WHERE name = ${name}
```
```
import { sql } from '@vercel/postgres';// Simple queryconst { rows } = await sqlSELECT * FROM users WHERE id = ${userId};// Transactionsconst client = await sql.connect();try {  await client.sqlBEGIN;  await client.sqlINSERT INTO users (name) VALUES (${name});  await client.sqlCOMMIT;} finally {  client.release();}
```
```
import { sql } from '@vercel/postgres';// Simple queryconst { rows } = await sqlSELECT * FROM users WHERE id = ${userId};// Transactionsconst client = await sql.connect();try {  await client.sqlBEGIN;  await client.sqlINSERT INTO users (name) VALUES (${name});  await client.sqlCOMMIT;} finally {  client.release();}
```
```
SELECT * FROM users WHERE id = ${userId}
```
```
BEGIN
```
```
INSERT INTO users (name) VALUES (${name})
```
```
COMMIT
```
```
sql
```
```

```
```
) for automatic SQL injection protection- Never concatenate strings:
```
```
❌- Template tags automatically escape values and prevent SQL injection---## The 7-Step Setup Process### Step 1: Install PackageChoose based on your deployment platform:**Neon Direct** (Cloudflare Workers, multi-cloud, direct Neon access):npm install @neondatabase/serverless**Vercel Postgres** (Vercel-specific, zero-config):npm install @vercel/postgres**With ORM**:# Drizzle ORM (recommended for edge compatibility)npm install drizzle-orm@0.45.1 @neondatabase/serverless@1.0.2npm install -D drizzle-kit@0.31.8# Prisma (Node.js only)npm install prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless**Key Points:**- Both packages use HTTP/WebSocket (no TCP required)- Edge-compatible (works in Cloudflare Workers, Vercel Edge Runtime)- Connection pooling is built-in when using pooled connection strings- No need for separate connection pool libraries---### Step 2: Create Neon Database**Option A: Neon Dashboard**1. Sign up at https://neon.tech2. Create a new project3. Copy the **pooled connection string** (important!)4. Format:
```
```
npm install @neondatabase/serverless
```
```
npm install @neondatabase/serverless
```
```
npm install @vercel/postgres
```
```
npm install @vercel/postgres
```
```
# Drizzle ORM (recommended for edge compatibility)npm install drizzle-orm@0.45.1 @neondatabase/serverless@1.0.2npm install -D drizzle-kit@0.31.8# Prisma (Node.js only)npm install prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless
```
```
# Drizzle ORM (recommended for edge compatibility)npm install drizzle-orm@0.45.1 @neondatabase/serverless@1.0.2npm install -D drizzle-kit@0.31.8# Prisma (Node.js only)npm install prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless
```
```
**Option B: Vercel Dashboard**1. Go to your Vercel project → Storage → Create Database → Postgres2. Vercel automatically creates a Neon database3. Run
```
```
to get environment variables locally**Option C: Neon CLI** (neonctl@2.19.0)# Install CLInpm install -g neonctl@2.19.0# Authenticateneonctl auth# Create project and get connection stringneonctl projects create --name my-appneonctl connection-string main**CRITICAL:**- Always use the **pooled connection string** (ends with
```
```
# Install CLInpm install -g neonctl@2.19.0# Authenticateneonctl auth# Create project and get connection stringneonctl projects create --name my-appneonctl connection-string main
```
```
# Install CLInpm install -g neonctl@2.19.0# Authenticateneonctl auth# Create project and get connection stringneonctl projects create --name my-appneonctl connection-string main
```
```
)- Non-pooled connections are for direct connections (not serverless)- Include
```
```
in connection string---### Step 3: Configure Environment Variables**For Neon Direct:**# .env or .env.localDATABASE_URL="postgresql://user:password@ep-xyz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"**For Vercel Postgres:**# Automatically created by vercel env pullPOSTGRES_URL="..."               # Pooled connection (use this for queries)POSTGRES_PRISMA_URL="..."        # For Prisma migrationsPOSTGRES_URL_NON_POOLING="..."   # Direct connection (avoid in serverless)POSTGRES_USER="..."POSTGRES_HOST="..."POSTGRES_PASSWORD="..."POSTGRES_DATABASE="..."**For Cloudflare Workers** (wrangler.jsonc):{  "vars": {    "DATABASE_URL": "postgresql://user:password@ep-xyz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"  }}**Key Points:**- Use
```
```
# .env or .env.localDATABASE_URL="postgresql://user:password@ep-xyz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```
```
# .env or .env.localDATABASE_URL="postgresql://user:password@ep-xyz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```
```
# Automatically created by vercel env pullPOSTGRES_URL="..."               # Pooled connection (use this for queries)POSTGRES_PRISMA_URL="..."        # For Prisma migrationsPOSTGRES_URL_NON_POOLING="..."   # Direct connection (avoid in serverless)POSTGRES_USER="..."POSTGRES_HOST="..."POSTGRES_PASSWORD="..."POSTGRES_DATABASE="..."
```
```
# Automatically created by
```
```
POSTGRES_URL="..."               # Pooled connection (use this for queries)POSTGRES_PRISMA_URL="..."        # For Prisma migrationsPOSTGRES_URL_NON_POOLING="..."   # Direct connection (avoid in serverless)POSTGRES_USER="..."POSTGRES_HOST="..."POSTGRES_PASSWORD="..."POSTGRES_DATABASE="..."
```
```
{  "vars": {    "DATABASE_URL": "postgresql://user:password@ep-xyz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"  }}
```
```
{  "vars": {    "DATABASE_URL": "postgresql://user:password@ep-xyz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"  }}
```
```
(pooled) for queries- Use
```
```
for Prisma migrations- Never use
```
```
in serverless functions- Store secrets securely (Vercel env, Cloudflare secrets, etc.)---### Step 4: Create Database Schema**Option A: Raw SQL**// scripts/migrate.tsimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);await sql  CREATE TABLE IF NOT EXISTS users (    id SERIAL PRIMARY KEY,    name TEXT NOT NULL,    email TEXT UNIQUE NOT NULL,    created_at TIMESTAMP DEFAULT NOW()  );**Option B: Drizzle ORM** (recommended)// db/schema.tsimport { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';export const users = pgTable('users', {  id: serial('id').primaryKey(),  name: text('name').notNull(),  email: text('email').notNull().unique(),  createdAt: timestamp('created_at').defaultNow()});// db/index.tsimport { drizzle } from 'drizzle-orm/neon-http';import { neon } from '@neondatabase/serverless';import * as schema from './schema';const sql = neon(process.env.DATABASE_URL!);export const db = drizzle(sql, { schema });# Run migrationsnpx drizzle-kit generatenpx drizzle-kit migrate**Option C: Prisma**// prisma/schema.prismagenerator client {  provider = "prisma-client-js"}datasource db {  provider = "postgresql"  url      = env("POSTGRES_PRISMA_URL")}model User {  id        Int      @id @default(autoincrement())  name      String  email     String   @unique  createdAt DateTime @default(now()) @map("created_at")  @@map("users")}npx prisma migrate dev --name init**CRITICAL:**- Use Drizzle for edge-compatible ORM (works in Cloudflare Workers)- Prisma requires Node.js runtime (won't work in Cloudflare Workers)- Run migrations from Node.js environment, not from edge functions---### Step 5: Query Patterns**CRITICAL - Template Tag Syntax Required:**// ✅ Correct: Template tag syntax (prevents SQL injection)const users = await sqlSELECT * FROM users WHERE email = ${email};// ❌ Wrong: String concatenation (SQL injection risk)const users = await sql('SELECT * FROM users WHERE email = ' + email);**Neon Transaction API (Unique Features):**// Automatic transaction (array of queries)const results = await sql.transaction([  sqlINSERT INTO users (name) VALUES (${name}),  sqlUPDATE accounts SET balance = balance - ${amount} WHERE id = ${accountId}]);// Manual transaction with callback (for complex logic)const result = await sql.transaction(async (sql) => {  const [user] = await sqlINSERT INTO users (name) VALUES (${name}) RETURNING id;  await sqlINSERT INTO profiles (user_id) VALUES (${user.id});  return user;});**Vercel Postgres Transactions:**- Must use
```
```
// scripts/migrate.tsimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);await sql  CREATE TABLE IF NOT EXISTS users (    id SERIAL PRIMARY KEY,    name TEXT NOT NULL,    email TEXT UNIQUE NOT NULL,    created_at TIMESTAMP DEFAULT NOW()  );
```
```
// scripts/migrate.tsimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);await sql
```
```
;
```
```
// db/schema.tsimport { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';export const users = pgTable('users', {  id: serial('id').primaryKey(),  name: text('name').notNull(),  email: text('email').notNull().unique(),  createdAt: timestamp('created_at').defaultNow()});
```
```
// db/schema.tsimport { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';export const users = pgTable('users', {  id: serial('id').primaryKey(),  name: text('name').notNull(),  email: text('email').notNull().unique(),  createdAt: timestamp('created_at').defaultNow()});
```
```
// db/index.tsimport { drizzle } from 'drizzle-orm/neon-http';import { neon } from '@neondatabase/serverless';import * as schema from './schema';const sql = neon(process.env.DATABASE_URL!);export const db = drizzle(sql, { schema });
```
```
// db/index.tsimport { drizzle } from 'drizzle-orm/neon-http';import { neon } from '@neondatabase/serverless';import * as schema from './schema';const sql = neon(process.env.DATABASE_URL!);export const db = drizzle(sql, { schema });
```
```
# Run migrationsnpx drizzle-kit generatenpx drizzle-kit migrate
```
```
# Run migrationsnpx drizzle-kit generatenpx drizzle-kit migrate
```
```
// prisma/schema.prismagenerator client {  provider = "prisma-client-js"}datasource db {  provider = "postgresql"  url      = env("POSTGRES_PRISMA_URL")}model User {  id        Int      @id @default(autoincrement())  name      String  email     String   @unique  createdAt DateTime @default(now()) @map("created_at")  @@map("users")}
```
```
// prisma/schema.prismagenerator client {  provider = "prisma-client-js"}datasource db {  provider = "postgresql"  url      = env("POSTGRES_PRISMA_URL")}model User {  id        Int      @id @default(autoincrement())  name      String  email     String   @unique  createdAt DateTime @default(now()) @map("created_at")  @@map("users")}
```
```
npx prisma migrate dev --name init
```
```
npx prisma migrate dev --name init
```
```
// ✅ Correct: Template tag syntax (prevents SQL injection)const users = await sqlSELECT * FROM users WHERE email = ${email};// ❌ Wrong: String concatenation (SQL injection risk)const users = await sql('SELECT * FROM users WHERE email = ' + email);
```
```
// ✅ Correct: Template tag syntax (prevents SQL injection)const users = await sql
```
```
;// ❌ Wrong: String concatenation (SQL injection risk)const users = await sql('SELECT * FROM users WHERE email = ' + email);
```
```
// Automatic transaction (array of queries)const results = await sql.transaction([  sqlINSERT INTO users (name) VALUES (${name}),  sqlUPDATE accounts SET balance = balance - ${amount} WHERE id = ${accountId}]);// Manual transaction with callback (for complex logic)const result = await sql.transaction(async (sql) => {  const [user] = await sqlINSERT INTO users (name) VALUES (${name}) RETURNING id;  await sqlINSERT INTO profiles (user_id) VALUES (${user.id});  return user;});
```
```
// Automatic transaction (array of queries)const results = await sql.transaction([  sql
```
```
,  sql
```
```
]);// Manual transaction with callback (for complex logic)const result = await sql.transaction(async (sql) => {  const [user] = await sql
```
```
;  await sql
```
```
;  return user;});
```
```
+ manual
```
```
/
```
```
/
```
```
- Always call
```
```
in
```
```
block (prevents connection leaks)**Drizzle Transactions:**await db.transaction(async (tx) => {  await tx.insert(users).values({ name, email });  await tx.insert(profiles).values({ userId: user.id });});---### Step 6: Handle Connection Pooling**Connection String Format:**Pooled (serverless):     postgresql://user:pass@ep-xyz-pooler.region.aws.neon.tech/dbNon-pooled (direct):     postgresql://user:pass@ep-xyz.region.aws.neon.tech/db**When to Use Each:**- **Pooled** (
```
```
await db.transaction(async (tx) => {  await tx.insert(users).values({ name, email });  await tx.insert(profiles).values({ userId: user.id });});
```
```
await db.transaction(async (tx) => {  await tx.insert(users).values({ name, email });  await tx.insert(profiles).values({ userId: user.id });});
```
```
Pooled (serverless):     postgresql://user:pass@ep-xyz-pooler.region.aws.neon.tech/dbNon-pooled (direct):     postgresql://user:pass@ep-xyz.region.aws.neon.tech/db
```
```
Pooled (serverless):     postgresql://user:pass@ep-xyz-pooler.region.aws.neon.tech/dbNon-pooled (direct):     postgresql://user:pass@ep-xyz.region.aws.neon.tech/db
```
```
): Serverless functions, edge functions, high-concurrency- **Non-pooled**: Long-running servers, migrations, admin tasks, connection limits not a concern**Automatic Pooling (Neon/Vercel):**// Both packages handle pooling automatically when using pooled connection stringimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!); // Pooling is automatic**Connection Limits:**- **Neon Free Tier**: 100 concurrent connections- **Pooled Connection**: Shares connections across requests- **Non-Pooled**: Each request gets a new connection (exhausts quickly)**CRITICAL:**- Always use pooled connection strings in serverless environments- Non-pooled connections will cause "connection pool exhausted" errors- Monitor connection usage in Neon dashboard---### Step 7: Deploy and Test**Cloudflare Workers:**// src/index.tsimport { neon } from '@neondatabase/serverless';export default {  async fetch(request: Request, env: Env) {    const sql = neon(env.DATABASE_URL);    const users = await sqlSELECT * FROM users;    return Response.json(users);  }};# Deploynpx wrangler deploy**Vercel (Next.js API Route):**// app/api/users/route.tsimport { sql } from '@vercel/postgres';export async function GET() {  const { rows } = await sqlSELECT * FROM users;  return Response.json(rows);}# Deployvercel deploy --prod**Test Queries:**# Local testcurl http://localhost:8787/api/users# Production testcurl https://your-app.workers.dev/api/users**Key Points:**- Test locally before deploying- Monitor query performance in Neon dashboard- Set up alerts for connection pool exhaustion- Use Neon's query history for debugging---## Critical Rules (Neon/Vercel-Specific)**✅ MUST DO:**- Use **pooled connection strings** (
```
```
// Both packages handle pooling automatically when using pooled connection stringimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!); // Pooling is automatic
```
```
// Both packages handle pooling automatically when using pooled connection stringimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!); // Pooling is automatic
```
```
// src/index.tsimport { neon } from '@neondatabase/serverless';export default {  async fetch(request: Request, env: Env) {    const sql = neon(env.DATABASE_URL);    const users = await sqlSELECT * FROM users;    return Response.json(users);  }};
```
```
// src/index.tsimport { neon } from '@neondatabase/serverless';export default {  async fetch(request: Request, env: Env) {    const sql = neon(env.DATABASE_URL);    const users = await sql
```
```
;    return Response.json(users);  }};
```
```
# Deploynpx wrangler deploy
```
```
# Deploynpx wrangler deploy
```
```
// app/api/users/route.tsimport { sql } from '@vercel/postgres';export async function GET() {  const { rows } = await sqlSELECT * FROM users;  return Response.json(rows);}
```
```
// app/api/users/route.tsimport { sql } from '@vercel/postgres';export async function GET() {  const { rows } = await sql
```
```
;  return Response.json(rows);}
```
```
# Deployvercel deploy --prod
```
```
# Deployvercel deploy --prod
```
```
# Local testcurl http://localhost:8787/api/users# Production testcurl https://your-app.workers.dev/api/users
```
```
# Local testcurl http://localhost:8787/api/users# Production testcurl https://your-app.workers.dev/api/users
```
```
in hostname) for serverless- Include **
```
```
** in connection strings- Use **template tag syntax** (
```
```
sql
```
```

```
```
) to prevent SQL injection- Call **
```
```
** in
```
```
block (Vercel Postgres transactions only)- Use **Drizzle for Cloudflare Workers** (Prisma requires Node.js runtime)- Use **
```
```
** for queries, **
```
```
** for Prisma migrations**❌ NEVER DO:**- Use non-pooled connections or
```
```
in serverless- Concatenate SQL strings (use template tags only)- Omit
```
```
(connections will fail)- Use Prisma in Cloudflare Workers (V8 isolates don't support it)- Run migrations from edge functions (use Node.js environment)---## Known Issues PreventionThis skill prevents **19 documented issues**:### Issue #1: Connection Pool Exhausted**Error**:
```
```
or
```
```
**Source**: https://github.com/neondatabase/serverless/issues/12**Why It Happens**: Using non-pooled connection string in high-concurrency serverless environment**Prevention**: Always use pooled connection string (with
```
```
in hostname). Check your connection string format.### Issue #2: TCP Connections Not Supported**Error**:
```
```
**Source**: Cloudflare Workers documentation**Why It Happens**: Traditional Postgres clients use TCP sockets, which aren't available in edge runtimes**Prevention**: Use
```
```
(HTTP/WebSocket-based) instead of
```
```
or
```
```
packages.### Issue #3: SQL Injection from String Concatenation**Error**: Successful SQL injection attack or unexpected query results**Source**: OWASP SQL Injection Guide**Why It Happens**: Concatenating user input into SQL strings:
```
```
**Prevention**: Always use template tag syntax:
```
```
sql
```
```

```
```
. Template tags automatically escape values.### Issue #4: Missing SSL Mode**Error**:
```
```
or
```
```
**Source**: https://neon.tech/docs/connect/connect-securely**Why It Happens**: Connection string missing
```
```
parameter**Prevention**: Always append
```
```
to connection string.### Issue #5: Connection Leak (Vercel Postgres)**Error**: Gradually increasing memory usage, eventual timeout errors**Source**: https://github.com/vercel/storage/issues/45**Why It Happens**: Forgetting to call
```
```
after manual transactions**Prevention**: Always use try/finally block and call
```
```
in finally block.### Issue #6: Wrong Environment Variable (Vercel)**Error**:
```
```
or
```
```
**Source**: https://vercel.com/docs/storage/vercel-postgres/using-an-orm**Why It Happens**: Using
```
```
instead of
```
```
, or vice versa**Prevention**: Use
```
```
for queries,
```
```
for Prisma migrations.### Issue #7: Transaction Timeout in Edge Functions**Error**:
```
```
or
```
```
**Source**: https://neon.tech/docs/introduction/limits**Why It Happens**: Long-running transactions exceed edge function timeout (typically 30s)**Prevention**: Keep transactions short (<5s), batch operations, or move complex transactions to background workers.### Issue #8: Prisma in Cloudflare Workers**Error**:
```
```
or module resolution errors**Source**: https://github.com/prisma/prisma/issues/18765**Why It Happens**: Prisma requires Node.js runtime with filesystem access**Prevention**: Use Drizzle ORM for Cloudflare Workers. Prisma works in Vercel Edge/Node.js runtimes only.### Issue #9: Branch API Authentication Error**Error**:
```
```
when calling Neon API**Source**: https://neon.tech/docs/api/authentication**Why It Happens**: Missing or invalid
```
```
environment variable**Prevention**: Create API key in Neon dashboard → Account Settings → API Keys, set as environment variable.### Issue #10: Stale Connection After Branch Delete**Error**:
```
```
after deleting a branch**Source**: https://neon.tech/docs/guides/branching**Why It Happens**: Application still using connection string from deleted branch**Prevention**: Update
```
```
when switching branches, restart application after branch changes.### Issue #11: Query Timeout on Cold Start / Auto-Suspend**Error**:
```
```
on first request after idle period, or
```
```
**Source**: [Neon Docs - Auto-suspend](https://neon.tech/docs/introduction/auto-suspend) | [GitHub Issue #168](https://github.com/neondatabase/serverless/issues/168) | [Changelog Dec 2025](https://neon.com/docs/changelog/2025-12-05)**Why It Happens**: Neon auto-suspends compute after ~5 minutes of inactivity (free tier), causing ~1-2s wake-up delay or connection termination**Prevention**:- Set query timeout >= 10s to account for cold starts- Use HTTP client (
```
```
) which handles auto-suspend transparently- Handle connection termination errors with Pool:import { Pool } from '@neondatabase/serverless';const pool = new Pool({ connectionString: process.env.DATABASE_URL });// CRITICAL: Handle connection termination errorspool.on('error', (err) => {  console.error('Unexpected database error:', err);  // Implement reconnection logic or alerting});- **Production Configuration**: Disable auto-suspend for consistent performance  - In Neon console: Set minimum compute units > 0  - Or use compute size >= 16 CU (auto-disables scale-to-zero)  - Trade-off: Pay for idle time, get consistent <100ms queries  - Even with auto-suspend disabled, use pooled connection strings for best performance### Issue #12: Drizzle Schema Mismatch**Error**: TypeScript errors like
```
```
import { Pool } from '@neondatabase/serverless';const pool = new Pool({ connectionString: process.env.DATABASE_URL });// CRITICAL: Handle connection termination errorspool.on('error', (err) => {  console.error('Unexpected database error:', err);  // Implement reconnection logic or alerting});
```
```
import { Pool } from '@neondatabase/serverless';const pool = new Pool({ connectionString: process.env.DATABASE_URL });// CRITICAL: Handle connection termination errorspool.on('error', (err) => {  console.error('Unexpected database error:', err);  // Implement reconnection logic or alerting});
```
```
**Source**: https://orm.drizzle.team/docs/generate**Why It Happens**: Database schema changed but Drizzle types not regenerated**Prevention**: Run
```
```
after schema changes, commit generated files.### Issue #13: Migration Conflicts Across Branches**Error**:
```
```
or migration version conflicts**Source**: https://neon.tech/docs/guides/branching#schema-migrations**Why It Happens**: Multiple branches with different migration histories**Prevention**: Create branches AFTER running migrations on main, or reset branch schema before merging.### Issue #14: PITR Timestamp Out of Range**Error**:
```
```
**Source**: https://neon.tech/docs/introduction/point-in-time-restore**Why It Happens**: Trying to restore from a timestamp older than retention period (7 days on free tier)**Prevention**: Check retention period for your plan, restore within allowed window.### Issue #15: Wrong Adapter for Prisma**Error**:
```
```
or slow query performance**Source**: https://www.prisma.io/docs/orm/overview/databases/neon**Why It Happens**: Not using
```
```
for serverless environments**Prevention**: Install
```
```
and
```
```
, configure Prisma to use HTTP-based connection.### Issue #16: poolQueryViaFetch Required for Edge Runtimes**Error**:
```
```
or timeout during Next.js 15 prerender with
```
```
**Source**: [Neon Docs - Prisma Guide](https://neon.com/docs/guides/prisma) | [GitHub Issue #181](https://github.com/neondatabase/serverless/issues/181)**Why It Happens**: Edge runtimes like Cloudflare Workers require HTTP instead of WebSocket for Pool queries. Next.js 15's
```
```
directive can timeout when using Pool with
```
```
.**Prevention**: Set
```
```
before using Pool in edge environments.import { Pool, neonConfig } from '@neondatabase/serverless';// Enable Pool queries over HTTP fetch (required for edge)neonConfig.poolQueryViaFetch = true;const pool = new Pool({ connectionString: env.DATABASE_URL });export default {  async fetch(request: Request, env: Env) {    // Pool.query() now uses HTTP instead of WebSocket    const result = await pool.query('SELECT * FROM users');    return Response.json(result.rows);  }};**Caveat - Next.js 15
```
```
import { Pool, neonConfig } from '@neondatabase/serverless';// Enable Pool queries over HTTP fetch (required for edge)neonConfig.poolQueryViaFetch = true;const pool = new Pool({ connectionString: env.DATABASE_URL });export default {  async fetch(request: Request, env: Env) {    // Pool.query() now uses HTTP instead of WebSocket    const result = await pool.query('SELECT * FROM users');    return Response.json(result.rows);  }};
```
```
import { Pool, neonConfig } from '@neondatabase/serverless';// Enable Pool queries over HTTP fetch (required for edge)neonConfig.poolQueryViaFetch = true;const pool = new Pool({ connectionString: env.DATABASE_URL });export default {  async fetch(request: Request, env: Env) {    // Pool.query() now uses HTTP instead of WebSocket    const result = await pool.query('SELECT * FROM users');    return Response.json(result.rows);  }};
```
```
**: Avoid
```
```
with
```
```
directive - use
```
```
HTTP client instead:// ❌ Can timeout during prerenderimport { Pool, neonConfig } from '@neondatabase/serverless';neonConfig.poolQueryViaFetch = true;const pool = new Pool({ connectionString: process.env.DATABASE_URL });async function getData() {  'use cache';  return await pool.query('SELECT * FROM data');}// ✅ Works with prerenderimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);async function getData() {  'use cache';  return await sqlSELECT * FROM data;}### Issue #17: Node v20 Transaction Context Loss with Parallel Operations**Error**: Foreign key constraint violations in transactions when using
```
```
// ❌ Can timeout during prerenderimport { Pool, neonConfig } from '@neondatabase/serverless';neonConfig.poolQueryViaFetch = true;const pool = new Pool({ connectionString: process.env.DATABASE_URL });async function getData() {  'use cache';  return await pool.query('SELECT * FROM data');}// ✅ Works with prerenderimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);async function getData() {  'use cache';  return await sqlSELECT * FROM data;}
```
```
// ❌ Can timeout during prerenderimport { Pool, neonConfig } from '@neondatabase/serverless';neonConfig.poolQueryViaFetch = true;const pool = new Pool({ connectionString: process.env.DATABASE_URL });async function getData() {  'use cache';  return await pool.query('SELECT * FROM data');}// ✅ Works with prerenderimport { neon } from '@neondatabase/serverless';const sql = neon(process.env.DATABASE_URL!);async function getData() {  'use cache';  return await sql
```
```
;}
```
```
:
```
```
**Source**: [Drizzle Issue #2200](https://github.com/drizzle-team/drizzle-orm/issues/2200)**Why It Happens**: When using Node.js v20+ with Neon serverless driver and Drizzle ORM, parallel database operations within a transaction using
```
```
lose transaction context. Sequential operations work correctly. This is a transaction context management issue specific to Neon driver's session handling in Node v20.**Prevention**: Use sequential operations or switch to postgres-js driver (not edge-compatible) for Node.js environments.// ❌ FAILS in Node v20 with Neon driverawait db.transaction(async (tx) => {  const [user] = await tx.insert(users).values({ name: 'Alice' }).returning();  // Parallel inserts lose transaction context  await Promise.all([    tx.insert(userSettings).values({ userId: user.id, theme: 'dark' }),    tx.insert(userSettings).values({ userId: user.id, locale: 'en' })  ]);  // Error: Foreign key constraint violation (user.id not visible)});// ✅ WORKS - Sequential executionawait db.transaction(async (tx) => {  const [user] = await tx.insert(users).values({ name: 'Alice' }).returning();  await tx.insert(userSettings).values({ userId: user.id, theme: 'dark' });  await tx.insert(userSettings).values({ userId: user.id, locale: 'en' });});// ✅ ALTERNATIVE - Use postgres-js driver for Node.js (not edge-compatible)import { drizzle } from 'drizzle-orm/postgres-js';import postgres from 'postgres';const client = postgres(connectionString);const db = drizzle(client);// Promise.all() works correctly with this driver**Affected Configuration**:- Node.js: v20.12.2+- @neondatabase/serverless: v0.9.0+ (confirmed through v1.0.x)- drizzle-orm: v0.30.8+- Pattern: Using
```
```
// ❌ FAILS in Node v20 with Neon driverawait db.transaction(async (tx) => {  const [user] = await tx.insert(users).values({ name: 'Alice' }).returning();  // Parallel inserts lose transaction context  await Promise.all([    tx.insert(userSettings).values({ userId: user.id, theme: 'dark' }),    tx.insert(userSettings).values({ userId: user.id, locale: 'en' })  ]);  // Error: Foreign key constraint violation (user.id not visible)});// ✅ WORKS - Sequential executionawait db.transaction(async (tx) => {  const [user] = await tx.insert(users).values({ name: 'Alice' }).returning();  await tx.insert(userSettings).values({ userId: user.id, theme: 'dark' });  await tx.insert(userSettings).values({ userId: user.id, locale: 'en' });});// ✅ ALTERNATIVE - Use postgres-js driver for Node.js (not edge-compatible)import { drizzle } from 'drizzle-orm/postgres-js';import postgres from 'postgres';const client = postgres(connectionString);const db = drizzle(client);// Promise.all() works correctly with this driver
```
```
// ❌ FAILS in Node v20 with Neon driverawait db.transaction(async (tx) => {  const [user] = await tx.insert(users).values({ name: 'Alice' }).returning();  // Parallel inserts lose transaction context  await Promise.all([    tx.insert(userSettings).values({ userId: user.id, theme: 'dark' }),    tx.insert(userSettings).values({ userId: user.id, locale: 'en' })  ]);  // Error: Foreign key constraint violation (user.id not visible)});// ✅ WORKS - Sequential executionawait db.transaction(async (tx) => {  const [user] = await tx.insert(users).values({ name: 'Alice' }).returning();  await tx.insert(userSettings).values({ userId: user.id, theme: 'dark' });  await tx.insert(userSettings).values({ userId: user.id, locale: 'en' });});// ✅ ALTERNATIVE - Use postgres-js driver for Node.js (not edge-compatible)import { drizzle } from 'drizzle-orm/postgres-js';import postgres from 'postgres';const client = postgres(connectionString);const db = drizzle(client);// Promise.all() works correctly with this driver
```
```
for parallel inserts in transaction### Issue #18: process.env Access in Sandboxed Runtimes**Error**:
```
```
**Source**: [GitHub Issue #179](https://github.com/neondatabase/serverless/issues/179)**Why It Happens**: The Neon serverless driver unconditionally accesses
```
```
at the top level, which causes errors in sandboxed runtimes like Slack's Deno runtime that don't provide
```
```
.**Affected Environments**: Slack Deno runtime, sandboxed JavaScript environments without Node.js process global**Prevention**: No workaround available yet. Users must either:1. Polyfill
```
```
in their runtime2. Use a different Postgres driver (standard
```
```
with Deno compatibility)3. Wait for upstream fix in both
```
```
and
```
```
(which also accesses process.env)**Official Status**: Open issue with no fix timeline provided. Affects both Neon driver and underlying pg library.---## Migration from v0.x to v1.0+**Breaking Change**: v1.0.0 requires tagged-template syntax for all SQL queries.**Source**: [Neon Blog Post](https://neon.com/blog/serverless-driver-ga) | [GitHub Issue #3678](https://github.com/better-auth/better-auth/issues/3678)**Before (v0.x)**:const result = await sql("SELECT * FROM users WHERE id = $1", [userId]);**After (v1.0+)**:// Option 1: Tagged template (recommended)const result = await sqlSELECT * FROM users WHERE id = ${userId};// Option 2: .query() method for parameterized queriesconst result = await sql.query("SELECT * FROM users WHERE id = $1", [userId]);// Option 3: .unsafe() for trusted raw SQL (dynamic identifiers)const column = 'name';const result = await sqlSELECT ${sql.unsafe(column)} FROM users;**Why this change**: The v1.0.0 release enforces tagged-template syntax to prevent SQL injection vulnerabilities. Function-call syntax
```
```
const result = await sql("SELECT * FROM users WHERE id = $1", [userId]);
```
```
const result = await sql("SELECT * FROM users WHERE id = $1", [userId]);
```
```
// Option 1: Tagged template (recommended)const result = await sqlSELECT * FROM users WHERE id = ${userId};// Option 2: .query() method for parameterized queriesconst result = await sql.query("SELECT * FROM users WHERE id = $1", [userId]);// Option 3: .unsafe() for trusted raw SQL (dynamic identifiers)const column = 'name';const result = await sqlSELECT ${sql.unsafe(column)} FROM users;
```
```
// Option 1: Tagged template (recommended)const result = await sql
```
```
;// Option 2: .query() method for parameterized queriesconst result = await sql.query("SELECT * FROM users WHERE id = $1", [userId]);// Option 3: .unsafe() for trusted raw SQL (dynamic identifiers)const column = 'name';const result = await sql
```
```
;
```
```
now throws a runtime error.**Error Message**:This function can now be called only as a tagged-template function:sqlSELECT ${value}, not sql("SELECT $1", [value], options)**Migration Checklist**:- [ ] Replace all
```
```
This function can now be called only as a tagged-template function:sqlSELECT ${value}, not sql("SELECT $1", [value], options)
```
```
This function can now be called only as a tagged-template function:sql
```
```
, not sql("SELECT $1", [value], options)
```
```
calls with tagged templates- [ ] If using better-auth with Drizzle, upgrade drizzle-orm to v0.40.1+ (resolves incompatibility)- [ ] Test all dynamic queries with new syntax- [ ] Review SQL injection prevention patterns (template tags auto-escape)**better-auth Users**: If using better-auth v1.3.4+ with Neon v1.0.0+, upgrade drizzle-orm to v0.40.1 or later to resolve compatibility:{  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "better-auth": "^1.3.4",    "drizzle-orm": "^0.40.1"  }}**Alternative Workaround**: Use Kysely instead of Drizzle with better-auth (works without drizzle-orm updates):import { Kysely } from 'kysely';import { Pool } from '@neondatabase/serverless';const db = new Kysely({  dialect: new PostgresDialect({    pool: new Pool({ connectionString: process.env.DATABASE_URL })  })});---## Performance & Protocol Selection**Source**: [Neon Blog - HTTP vs WebSockets](https://neon.com/blog/http-vs-websockets-for-postgres-queries-at-the-edge)Performance characteristics differ significantly between HTTP and WebSocket protocols. The choice affects latency, throughput, and what Postgres features are available.### Performance Benchmarks- **HTTP single query**: ~37ms initial latency- **WebSocket initial connection**: ~15-20ms overhead- **WebSocket subsequent queries**: ~4-5ms per query- **Break-even point**: 2-3 sequential queries (WebSocket becomes faster)### Protocol Decision Matrix| Use Case | Recommended | Reason ||----------|-------------|--------|| Single query per request | HTTP (
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "better-auth": "^1.3.4",    "drizzle-orm": "^0.40.1"  }}
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "better-auth": "^1.3.4",    "drizzle-orm": "^0.40.1"  }}
```
```
import { Kysely } from 'kysely';import { Pool } from '@neondatabase/serverless';const db = new Kysely({  dialect: new PostgresDialect({    pool: new Pool({ connectionString: process.env.DATABASE_URL })  })});
```
```
import { Kysely } from 'kysely';import { Pool } from '@neondatabase/serverless';const db = new Kysely({  dialect: new PostgresDialect({    pool: new Pool({ connectionString: process.env.DATABASE_URL })  })});
```
```
) | Lower initial latency (~37ms) || 2+ sequential queries | WebSocket (
```
```
/
```
```
) | Lower per-query latency (~5ms) || Parallel independent queries | HTTP | Better parallelization || Interactive transactions | WebSocket (required) | Required for transaction context || Edge Functions (single-shot) | HTTP | No connection overhead || Long-running workers | WebSocket | Amortize connection cost |### Code Examples// HTTP: Best for single queriesimport { neon } from '@neondatabase/serverless';const sql = neon(env.DATABASE_URL);const users = await sqlSELECT * FROM users; // ~37ms// WebSocket: Best for multiple sequential queriesimport { Pool } from '@neondatabase/serverless';const pool = new Pool({ connectionString: env.DATABASE_URL });const client = await pool.connect(); // ~15ms setuptry {  const user = await client.query('SELECT * FROM users WHERE id = $1', [1]); // ~5ms  const posts = await client.query('SELECT * FROM posts WHERE user_id = $1', [1]); // ~5ms  const comments = await client.query('SELECT * FROM comments WHERE user_id = $1', [1]); // ~5ms  // Total: ~30ms (vs ~111ms with HTTP)} finally {  client.release();}### Important Limitations**HTTP does NOT support**:- Interactive transactions (BEGIN/COMMIT/ROLLBACK)- Session-level features (temporary tables, prepared statements)- LISTEN/NOTIFY- COPY protocol**WebSocket limitations in edge**:- Cannot persist connections across requests- Must connect, use, and close within single request handler---## Configuration Files Reference### package.json (Neon Direct){  "dependencies": {    "@neondatabase/serverless": "^1.0.2"  }}### package.json (Vercel Postgres){  "dependencies": {    "@vercel/postgres": "^0.10.0"  }}### package.json (With Drizzle ORM){  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "drizzle-orm": "^0.44.7"  },  "devDependencies": {    "drizzle-kit": "^0.31.7"  },  "scripts": {    "db:generate": "drizzle-kit generate",    "db:migrate": "drizzle-kit migrate",    "db:studio": "drizzle-kit studio"  }}### drizzle.config.tsimport { defineConfig } from 'drizzle-kit';export default defineConfig({  schema: './db/schema.ts',  out: './db/migrations',  dialect: 'postgresql',  dbCredentials: {    url: process.env.DATABASE_URL!  }});**Why these settings:**-
```
```
// HTTP: Best for single queriesimport { neon } from '@neondatabase/serverless';const sql = neon(env.DATABASE_URL);const users = await sqlSELECT * FROM users; // ~37ms// WebSocket: Best for multiple sequential queriesimport { Pool } from '@neondatabase/serverless';const pool = new Pool({ connectionString: env.DATABASE_URL });const client = await pool.connect(); // ~15ms setuptry {  const user = await client.query('SELECT * FROM users WHERE id = $1', [1]); // ~5ms  const posts = await client.query('SELECT * FROM posts WHERE user_id = $1', [1]); // ~5ms  const comments = await client.query('SELECT * FROM comments WHERE user_id = $1', [1]); // ~5ms  // Total: ~30ms (vs ~111ms with HTTP)} finally {  client.release();}
```
```
// HTTP: Best for single queriesimport { neon } from '@neondatabase/serverless';const sql = neon(env.DATABASE_URL);const users = await sql
```
```
; // ~37ms// WebSocket: Best for multiple sequential queriesimport { Pool } from '@neondatabase/serverless';const pool = new Pool({ connectionString: env.DATABASE_URL });const client = await pool.connect(); // ~15ms setuptry {  const user = await client.query('SELECT * FROM users WHERE id = $1', [1]); // ~5ms  const posts = await client.query('SELECT * FROM posts WHERE user_id = $1', [1]); // ~5ms  const comments = await client.query('SELECT * FROM comments WHERE user_id = $1', [1]); // ~5ms  // Total: ~30ms (vs ~111ms with HTTP)} finally {  client.release();}
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2"  }}
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2"  }}
```
```
{  "dependencies": {    "@vercel/postgres": "^0.10.0"  }}
```
```
{  "dependencies": {    "@vercel/postgres": "^0.10.0"  }}
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "drizzle-orm": "^0.44.7"  },  "devDependencies": {    "drizzle-kit": "^0.31.7"  },  "scripts": {    "db:generate": "drizzle-kit generate",    "db:migrate": "drizzle-kit migrate",    "db:studio": "drizzle-kit studio"  }}
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "drizzle-orm": "^0.44.7"  },  "devDependencies": {    "drizzle-kit": "^0.31.7"  },  "scripts": {    "db:generate": "drizzle-kit generate",    "db:migrate": "drizzle-kit migrate",    "db:studio": "drizzle-kit studio"  }}
```
```
import { defineConfig } from 'drizzle-kit';export default defineConfig({  schema: './db/schema.ts',  out: './db/migrations',  dialect: 'postgresql',  dbCredentials: {    url: process.env.DATABASE_URL!  }});
```
```
import { defineConfig } from 'drizzle-kit';export default defineConfig({  schema: './db/schema.ts',  out: './db/migrations',  dialect: 'postgresql',  dbCredentials: {    url: process.env.DATABASE_URL!  }});
```
```
is edge-compatible (HTTP/WebSocket-based)-
```
```
provides zero-config on Vercel-
```
```
works in all runtimes (Cloudflare Workers, Vercel Edge, Node.js)-
```
```
handles migrations and schema generation---## Common Patterns### Pattern 1: Cloudflare Worker with Neonimport { neon } from '@neondatabase/serverless';interface Env { DATABASE_URL: string; }export default {  async fetch(request: Request, env: Env) {    const sql = neon(env.DATABASE_URL);    const users = await sqlSELECT * FROM users;    return Response.json(users);  }};### Pattern 2: Vercel Postgres with Next.js'use server';import { sql } from '@vercel/postgres';export async function getUsers() {  const { rows } = await sqlSELECT * FROM users;  return rows;}### Pattern 3: Drizzle ORM Setup// db/index.tsimport { drizzle } from 'drizzle-orm/neon-http';import { neon } from '@neondatabase/serverless';import * as schema from './schema';const sql = neon(process.env.DATABASE_URL!);export const db = drizzle(sql, { schema });// Usage: Type-safe queries with JOINsconst postsWithAuthors = await db  .select({ postId: posts.id, authorName: users.name })  .from(posts)  .leftJoin(users, eq(posts.userId, users.id));---### Pattern 4: Neon Automatic TransactionsSee Step 5 for Neon's unique transaction API (array syntax or callback syntax)---### Pattern 5: Neon Branching for Preview Environments# Create branch for PRneonctl branches create --project-id my-project --name pr-123 --parent main# Get connection string for branchBRANCH_URL=$(neonctl connection-string pr-123)# Use in Vercel preview deploymentvercel env add DATABASE_URL preview# Paste $BRANCH_URL# Delete branch when PR is mergedneonctl branches delete pr-123# .github/workflows/preview.ymlname: Create Preview Databaseon:  pull_request:    types: [opened, synchronize]jobs:  preview:    runs-on: ubuntu-latest    steps:      - name: Create Neon Branch        run: |          BRANCH_NAME="pr-${{ github.event.pull_request.number }}"          neonctl branches create --project-id ${{ secrets.NEON_PROJECT_ID }} --name $BRANCH_NAME          BRANCH_URL=$(neonctl connection-string $BRANCH_NAME)      - name: Deploy to Vercel        env:          DATABASE_URL: ${{ steps.branch.outputs.url }}        run: vercel deploy --env DATABASE_URL=$DATABASE_URL**When to use**: Want isolated database for each PR/preview deployment---## Using Bundled Resources### Scripts (scripts/)**setup-neon.sh** - Creates Neon database and outputs connection stringchmod +x scripts/setup-neon.sh./scripts/setup-neon.sh my-project-name**test-connection.ts** - Verifies database connection and runs test querynpx tsx scripts/test-connection.ts### References (references/)-
```
```
import { neon } from '@neondatabase/serverless';interface Env { DATABASE_URL: string; }export default {  async fetch(request: Request, env: Env) {    const sql = neon(env.DATABASE_URL);    const users = await sqlSELECT * FROM users;    return Response.json(users);  }};
```
```
import { neon } from '@neondatabase/serverless';interface Env { DATABASE_URL: string; }export default {  async fetch(request: Request, env: Env) {    const sql = neon(env.DATABASE_URL);    const users = await sql
```
```
;    return Response.json(users);  }};
```
```
'use server';import { sql } from '@vercel/postgres';export async function getUsers() {  const { rows } = await sqlSELECT * FROM users;  return rows;}
```
```
'use server';import { sql } from '@vercel/postgres';export async function getUsers() {  const { rows } = await sql
```
```
;  return rows;}
```
```
// db/index.tsimport { drizzle } from 'drizzle-orm/neon-http';import { neon } from '@neondatabase/serverless';import * as schema from './schema';const sql = neon(process.env.DATABASE_URL!);export const db = drizzle(sql, { schema });// Usage: Type-safe queries with JOINsconst postsWithAuthors = await db  .select({ postId: posts.id, authorName: users.name })  .from(posts)  .leftJoin(users, eq(posts.userId, users.id));
```
```
// db/index.tsimport { drizzle } from 'drizzle-orm/neon-http';import { neon } from '@neondatabase/serverless';import * as schema from './schema';const sql = neon(process.env.DATABASE_URL!);export const db = drizzle(sql, { schema });// Usage: Type-safe queries with JOINsconst postsWithAuthors = await db  .select({ postId: posts.id, authorName: users.name })  .from(posts)  .leftJoin(users, eq(posts.userId, users.id));
```
```
# Create branch for PRneonctl branches create --project-id my-project --name pr-123 --parent main# Get connection string for branchBRANCH_URL=$(neonctl connection-string pr-123)# Use in Vercel preview deploymentvercel env add DATABASE_URL preview# Paste $BRANCH_URL# Delete branch when PR is mergedneonctl branches delete pr-123
```
```
# Create branch for PRneonctl branches create --project-id my-project --name pr-123 --parent main# Get connection string for branchBRANCH_URL=$(neonctl connection-string pr-123)# Use in Vercel preview deploymentvercel env add DATABASE_URL preview# Paste $BRANCH_URL# Delete branch when PR is mergedneonctl branches delete pr-123
```
```
# .github/workflows/preview.ymlname: Create Preview Databaseon:  pull_request:    types: [opened, synchronize]jobs:  preview:    runs-on: ubuntu-latest    steps:      - name: Create Neon Branch        run: |          BRANCH_NAME="pr-${{ github.event.pull_request.number }}"          neonctl branches create --project-id ${{ secrets.NEON_PROJECT_ID }} --name $BRANCH_NAME          BRANCH_URL=$(neonctl connection-string $BRANCH_NAME)      - name: Deploy to Vercel        env:          DATABASE_URL: ${{ steps.branch.outputs.url }}        run: vercel deploy --env DATABASE_URL=$DATABASE_URL
```
```
# .github/workflows/preview.ymlname: Create Preview Databaseon:  pull_request:    types: [opened, synchronize]jobs:  preview:    runs-on: ubuntu-latest    steps:      - name: Create Neon Branch        run: |          BRANCH_NAME="pr-${{ github.event.pull_request.number }}"          neonctl branches create --project-id ${{ secrets.NEON_PROJECT_ID }} --name $BRANCH_NAME          BRANCH_URL=$(neonctl connection-string $BRANCH_NAME)      - name: Deploy to Vercel        env:          DATABASE_URL: ${{ steps.branch.outputs.url }}        run: vercel deploy --env DATABASE_URL=$DATABASE_URL
```
```
chmod +x scripts/setup-neon.sh./scripts/setup-neon.sh my-project-name
```
```
chmod +x scripts/setup-neon.sh./scripts/setup-neon.sh my-project-name
```
```
npx tsx scripts/test-connection.ts
```
```
npx tsx scripts/test-connection.ts
```
```
- Complete guide to connection string formats, pooled vs non-pooled-
```
```
- Step-by-step Drizzle ORM setup with Neon-
```
```
- Prisma setup with Neon adapter-
```
```
- Comprehensive guide to Neon database branching-
```
```
- Migration patterns for different ORMs and tools-
```
```
- Extended troubleshooting guide**When Claude should load these**:- Load
```
```
when debugging connection issues- Load
```
```
when user wants to use Drizzle ORM- Load
```
```
when user wants to use Prisma- Load
```
```
when user asks about preview environments or database branching- Load
```
```
when encountering specific error messages### Assets (assets/)-
```
```
- Example database schema with users, posts, comments-
```
```
- Complete Drizzle schema template-
```
```
- Complete Prisma schema template---## Advanced Topics### Database Branching (Neon-Specific Feature)Neon provides git-like database branching:# Create branch from mainneonctl branches create --name dev --parent main# Create from point-in-time (PITR restore)neonctl branches create --name restore --parent main --timestamp "2025-10-28T10:00:00Z"# Get connection string for branchneonctl connection-string dev# Delete branchneonctl branches delete feature**Key Features:**- **Copy-on-write**: Branch creation is instant (no data copying)- **Preview deployments**: Create branch per PR, delete on merge- **Point-in-time restore**: Restore to specific timestamp (7-day retention on free tier)- **Compute sharing**: Branches share compute limits (free tier) or independent compute (paid plans)---### Performance & Security Notes**Connection Pool Monitoring:**- Check usage in Neon dashboard (connection limit: 100 free tier, ~10,000 with pooling)- Set alerts for >80% usage- Use pooled connection strings to avoid "connection pool exhausted" errors**Query Optimization:**- Use indexes for frequently queried columns- Avoid N+1 queries (use JOINs or Drizzle relations)- Use Drizzle prepared statements for repeated queries**Security:**- Never hardcode connection strings (use environment variables)- Template tag syntax prevents SQL injection- Use Row-Level Security (RLS) for multi-tenant apps- Validate input with Zod before queries---## Dependencies**Required**:-
```
```
# Create branch from mainneonctl branches create --name dev --parent main# Create from point-in-time (PITR restore)neonctl branches create --name restore --parent main --timestamp "2025-10-28T10:00:00Z"# Get connection string for branchneonctl connection-string dev# Delete branchneonctl branches delete feature
```
```
# Create branch from mainneonctl branches create --name dev --parent main# Create from point-in-time (PITR restore)neonctl branches create --name restore --parent main --timestamp "2025-10-28T10:00:00Z"# Get connection string for branchneonctl connection-string dev# Delete branchneonctl branches delete feature
```
```
- Neon serverless Postgres client (HTTP/WebSocket-based)-
```
```
- Vercel Postgres client (alternative to Neon direct, Vercel-specific)**Optional**:-
```
```
- TypeScript ORM (edge-compatible, recommended)-
```
```
- Drizzle schema migrations and introspection-
```
```
- Prisma ORM (Node.js only, not edge-compatible)-
```
```
- Prisma adapter for Neon serverless-
```
```
- Neon CLI for database management-
```
```
- Schema validation for input sanitization---## Official Documentation- **Neon Documentation**: https://neon.tech/docs- **Neon Serverless Package**: https://github.com/neondatabase/serverless- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres- **Vercel Storage (All)**: https://vercel.com/docs/storage- **Neon Branching Guide**: https://neon.tech/docs/guides/branching- **Neonctl CLI**: https://neon.tech/docs/reference/cli- **Drizzle + Neon**: https://orm.drizzle.team/docs/quick-postgresql/neon- **Prisma + Neon**: https://www.prisma.io/docs/orm/overview/databases/neon- **Context7 Library ID**:
```
```
,
```
```
---## Package Versions (Verified 2026-01-09){  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "@vercel/postgres": "^0.10.0",    "drizzle-orm": "^0.45.1"  },  "devDependencies": {    "drizzle-kit": "^0.31.8",    "neonctl": "^2.19.0"  }}**Latest Prisma (if needed)**:{  "dependencies": {    "@prisma/client": "^6.10.0",    "@prisma/adapter-neon": "^6.10.0"  },  "devDependencies": {    "prisma": "^6.10.0"  }}---## Production ExampleThis skill is based on production deployments of Neon and Vercel Postgres:- **Cloudflare Workers**: API with 50K+ daily requests, 0 connection errors- **Vercel Next.js App**: E-commerce site with 100K+ monthly users- **Build Time**: <5 minutes (initial setup), <30s (deployment)- **Errors**: 0 (all 19 known issues prevented)- **Validation**: ✅ Connection pooling, ✅ SQL injection prevention, ✅ Transaction handling, ✅ Branching workflows, ✅ Edge runtime compatibility, ✅ Node v20 transaction patterns---## Troubleshooting### Problem:
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "@vercel/postgres": "^0.10.0",    "drizzle-orm": "^0.45.1"  },  "devDependencies": {    "drizzle-kit": "^0.31.8",    "neonctl": "^2.19.0"  }}
```
```
{  "dependencies": {    "@neondatabase/serverless": "^1.0.2",    "@vercel/postgres": "^0.10.0",    "drizzle-orm": "^0.45.1"  },  "devDependencies": {    "drizzle-kit": "^0.31.8",    "neonctl": "^2.19.0"  }}
```
```
{  "dependencies": {    "@prisma/client": "^6.10.0",    "@prisma/adapter-neon": "^6.10.0"  },  "devDependencies": {    "prisma": "^6.10.0"  }}
```
```
{  "dependencies": {    "@prisma/client": "^6.10.0",    "@prisma/adapter-neon": "^6.10.0"  },  "devDependencies": {    "prisma": "^6.10.0"  }}
```
```
**Solution**:1. Verify you're using pooled connection string (ends with
```
```
)2. Check connection usage in Neon dashboard3. Upgrade to higher tier if consistently hitting limits4. Optimize queries to reduce connection hold time### Problem:
```
```
**Solution**:- Use
```
```
instead of
```
```
or
```
```
- Verify you're not importing traditional Postgres clients- Check bundle includes HTTP/WebSocket-based client### Problem:
```
```
**Solution**:- Verify
```
```
points to correct database- If using Neon branching, ensure branch still exists- Check connection string format (no typos)### Problem: Slow queries on cold start**Solution**:- Neon auto-suspends after 5 minutes of inactivity (free tier)- First query after wake takes ~1-2 seconds- Set query timeout >= 10s to account for cold starts- Disable auto-suspend on paid plans for always-on databases### Problem:
```
```
**Solution**:- Prisma doesn't work in Cloudflare Workers (V8 isolates)- Use Drizzle ORM for edge-compatible ORM- Prisma works in Vercel Edge/Node.js runtimes with
```
```
### Problem: Migration version conflicts across branches**Solution**:- Run migrations on main branch first- Create feature branches AFTER migrations- Or reset branch schema before merging:
```
```
### Problem: "WebSocket warning" with drizzle-kit (Community-Sourced)**Error**:
```
```
**Source**: [GitHub Discussion #12508](https://github.com/neondatabase/neon/discussions/12508)**Solution**: This warning is informational and can be safely ignored. Migrations work correctly despite the warning. The warning exists to inform users that WebSocket protocol is being used, which helps with debugging if something goes wrong. Adding
```
```
as a dev dependency eliminates the warning but is unnecessary.### Problem: VPN blocking Neon connections (Community-Sourced)**Error**:
```
```
**Source**: [GitHub Issue #146 comment](https://github.com/neondatabase/serverless/issues/146)**Solution**: Some VPNs block WebSocket or fetch connections to Neon's endpoints. This occurs primarily during development (localhost) with Next.js 14+ server actions. Disable VPN and test, or whitelist Neon domains in VPN configuration:# Whitelist these domains in VPN:*.neon.tech*.aws.neon.tech---## Complete Setup ChecklistUse this checklist to verify your setup:- [ ] Package installed (
```
```
# Whitelist these domains in VPN:*.neon.tech*.aws.neon.tech
```
```
# Whitelist these domains in VPN:*.neon.tech*.aws.neon.tech
```
```
or
```
```
)- [ ] Neon database created (or Vercel Postgres provisioned)- [ ] **Pooled connection string** obtained (ends with
```
```
)- [ ] Connection string includes
```
```
- [ ] Environment variables configured (
```
```
or
```
```
)- [ ] Database schema created (raw SQL, Drizzle, or Prisma)- [ ] Queries use template tag syntax (
```
```
sql
```
```

```
```
)- [ ] Transactions use proper try/catch and release connections- [ ] Connection pooling verified (using pooled connection string)- [ ] ORM choice appropriate for runtime (Drizzle for edge, Prisma for Node.js)- [ ] Tested locally with dev database- [ ] Deployed and tested in production/preview environment- [ ] Connection monitoring set up in Neon dashboard---**Questions? Issues?**1. Check
```
```
for extended troubleshooting2. Verify all steps in the 7-step setup process3. Check official docs: https://neon.tech/docs4. Ensure you're using **pooled connection string** for serverless environments5. Verify
```
```
is in connection string6. Test connection with
```
This specialized AI agent skill streamlines the integration of Neon and Vercel Postgres into your development workflow. It empowers developers to efficiently set up and manage robust serverless PostgreSQL databases, optimized for modern web applications and edge environments. By abstracting away complex configuration details, this skill allows you to focus on building features, ensuring your applications benefit from scalable, high-performance data storage with minimal overhead.

# When to Use This Skill
- •Setting up a new serverless backend with PostgreSQL for a web application.
- •Migrating an existing application to a Vercel-hosted or Neon-direct database solution.
- •Developing edge-compatible applications that require a flexible and scalable database.
- •Integrating a PostgreSQL database into serverless functions like Cloudflare Workers or AWS Lambda.

# Pro Tips
- 💡Always use environment variables for storing database connection strings to enhance security and simplify credential rotation.
- 💡Leverage Neon's branching feature to create isolated development and staging environments without impacting your production database.
- 💡When using Vercel Postgres, ensure your Vercel project is linked correctly for automatic environment variable injection and zero-config deployment.

