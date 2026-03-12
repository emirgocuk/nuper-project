# cloudflare-hyperdrive
Source: https://antigravity.codes/agent-skills/database/cloudflare-hyperdrive

## AI Worker Instructions
When the user requests functionality related to cloudflare-hyperdrive, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-hyperdrive
```
# For PostgreSQLnpx wrangler hyperdrive create my-postgres-db \  --connection-string="postgres://user:password@db-host.cloud:5432/database"# For MySQLnpx wrangler hyperdrive create my-mysql-db \  --connection-string="mysql://user:password@db-host.cloud:3306/database"# Output:# ✅ Successfully created Hyperdrive configuration## [[hyperdrive]]# binding = "HYPERDRIVE"# id = "a76a99bc-7901-48c9-9c15-c4b11b559606"
```
```
# For PostgreSQLnpx wrangler hyperdrive create my-postgres-db \  --connection-string="postgres://user:password@db-host.cloud:5432/database"# For MySQLnpx wrangler hyperdrive create my-mysql-db \  --connection-string="mysql://user:password@db-host.cloud:3306/database"# Output:# ✅ Successfully created Hyperdrive configuration## [[hyperdrive]]# binding = "HYPERDRIVE"# id = "a76a99bc-7901-48c9-9c15-c4b11b559606"
```
```
id
```
```
wrangler.jsonc
```
```
{  "name": "my-worker",  "main": "src/index.ts",  "compatibility_date": "2024-09-23",  "compatibility_flags": ["nodejs_compat"],  // REQUIRED for database drivers  "hyperdrive": [    {      "binding": "HYPERDRIVE",                     // Available as env.HYPERDRIVE      "id": "a76a99bc-7901-48c9-9c15-c4b11b559606"  // From wrangler hyperdrive create    }  ]}
```
```
{  "name": "my-worker",  "main": "src/index.ts",  "compatibility_date": "2024-09-23",  "compatibility_flags": ["nodejs_compat"],  // REQUIRED for database drivers  "hyperdrive": [    {      "binding": "HYPERDRIVE",                     // Available as env.HYPERDRIVE      "id": "a76a99bc-7901-48c9-9c15-c4b11b559606"  // From wrangler hyperdrive create    }  ]}
```
```
nodejs_compat
```
```
binding
```
```
env.HYPERDRIVE
```
```
id
```
```
# For PostgreSQL (choose one)npm install pg           # node-postgres (most common)npm install postgres     # postgres.js (modern, minimum v3.4.5)# For MySQLnpm install mysql2       # mysql2 (minimum v3.13.0)
```
```
# For PostgreSQL (choose one)npm install pg           # node-postgres (most common)npm install postgres     # postgres.js (modern, minimum v3.4.5)# For MySQLnpm install mysql2       # mysql2 (minimum v3.13.0)
```
```
import { Client } from "pg";type Bindings = {  HYPERDRIVE: Hyperdrive;};export default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const client = new Client({      connectionString: env.HYPERDRIVE.connectionString    });    await client.connect();    try {      const result = await client.query('SELECT * FROM users LIMIT 10');      return Response.json({ users: result.rows });    } finally {      // Clean up connection AFTER response is sent      ctx.waitUntil(client.end());    }  }};
```
```
import { Client } from "pg";type Bindings = {  HYPERDRIVE: Hyperdrive;};export default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const client = new Client({      connectionString: env.HYPERDRIVE.connectionString    });    await client.connect();    try {      const result = await client.query('SELECT * FROM users LIMIT 10');      return Response.json({ users: result.rows });    } finally {      // Clean up connection AFTER response is sent      ctx.waitUntil(client.end());    }  }};
```
```
import { createConnection } from "mysql2/promise";export default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const connection = await createConnection({      host: env.HYPERDRIVE.host,      user: env.HYPERDRIVE.user,      password: env.HYPERDRIVE.password,      database: env.HYPERDRIVE.database,      port: env.HYPERDRIVE.port,      disableEval: true  // REQUIRED for Workers (eval() not supported)    });    try {      const [rows] = await connection.query('SELECT * FROM users LIMIT 10');      return Response.json({ users: rows });    } finally {      ctx.waitUntil(connection.end());    }  }};
```
```
import { createConnection } from "mysql2/promise";export default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const connection = await createConnection({      host: env.HYPERDRIVE.host,      user: env.HYPERDRIVE.user,      password: env.HYPERDRIVE.password,      database: env.HYPERDRIVE.database,      port: env.HYPERDRIVE.port,      disableEval: true  // REQUIRED for Workers (eval() not supported)    });    try {      const [rows] = await connection.query('SELECT * FROM users LIMIT 10');      return Response.json({ users: rows });    } finally {      ctx.waitUntil(connection.end());    }  }};
```
```
npx wrangler deploy
```
```
npx wrangler deploy
```
```
xxx.hyperdrive.local
```
```
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://user:password@localhost:5432/db"npx wrangler dev
```
```
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://user:password@localhost:5432/db"npx wrangler dev
```
```
wrangler dev --remote
```
```
// ❌ WRONG - IP address causes indefinite hangconst connection = "postgres://user:password@192.168.1.100:5432/db"// ✅ CORRECT - Use hostnameconst connection = "postgres://user:password@db.example.com:5432/db"
```
```
// ❌ WRONG - IP address causes indefinite hangconst connection = "postgres://user:password@192.168.1.100:5432/db"// ✅ CORRECT - Use hostnameconst connection = "postgres://user:password@db.example.com:5432/db"
```
```
ALTER USER 'username'@'%' IDENTIFIED WITH caching_sha2_password BY 'password';
```
```
ALTER USER 'username'@'%' IDENTIFIED WITH caching_sha2_password BY 'password';
```
```
caching_sha2_password
```
```
mysql_native_password
```
```
const url = env.isLocal ? env.DB_URL : env.HYPERDRIVE.connectionString;const client = postgres(url, {  fetch_types: false,  max: 2,});
```
```
const url = env.isLocal ? env.DB_URL : env.HYPERDRIVE.connectionString;const client = postgres(url, {  fetch_types: false,  max: 2,});
```
```
wrangler dev --remote
```
```
// ❌ WRONG - SET won't persist across queriesawait client.query('SET search_path TO myschema');await client.query('SELECT * FROM mytable'); // Uses default search_path!// ✅ CORRECT - SET within transactionawait client.query('BEGIN');await client.query('SET search_path TO myschema');await client.query('SELECT * FROM mytable'); // Now uses myschemaawait client.query('COMMIT');
```
```
// ❌ WRONG - SET won't persist across queriesawait client.query('SET search_path TO myschema');await client.query('SELECT * FROM mytable'); // Uses default search_path!// ✅ CORRECT - SET within transactionawait client.query('BEGIN');await client.query('SET search_path TO myschema');await client.query('SELECT * FROM mytable'); // Now uses myschemaawait client.query('COMMIT');
```
```
// ❌ WRONG - Global Prisma client reused across requestsconst prisma = new PrismaClient({ adapter });export default {  async fetch(request: Request, env: Bindings) {    // First request: works    // Subsequent requests: hang indefinitely    const users = await prisma.user.findMany();    return Response.json({ users });  }};// ✅ CORRECT - Create new client per requestexport default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const pool = new Pool({      connectionString: env.HYPERDRIVE.connectionString,      max: 5    });    const adapter = new PrismaPg(pool);    const prisma = new PrismaClient({ adapter });    try {      const users = await prisma.user.findMany();      return Response.json({ users });    } finally {      ctx.waitUntil(pool.end());    }  }};
```
```
// ❌ WRONG - Global Prisma client reused across requestsconst prisma = new PrismaClient({ adapter });export default {  async fetch(request: Request, env: Bindings) {    // First request: works    // Subsequent requests: hang indefinitely    const users = await prisma.user.findMany();    return Response.json({ users });  }};// ✅ CORRECT - Create new client per requestexport default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const pool = new Pool({      connectionString: env.HYPERDRIVE.connectionString,      max: 5    });    const adapter = new PrismaPg(pool);    const prisma = new PrismaClient({ adapter });    try {      const users = await prisma.user.findMany();      return Response.json({ users });    } finally {      ctx.waitUntil(pool.end());    }  }};
```
```
// ❌ WRONG - Neon serverless driver bypasses Hyperdriveimport { neon } from '@neondatabase/serverless';const sql = neon(env.HYPERDRIVE.connectionString);// This uses WebSockets, not TCP - Hyperdrive doesn't help// ✅ CORRECT - Use traditional TCP driver with Hyperdriveimport postgres from 'postgres';const sql = postgres(env.HYPERDRIVE.connectionString, {  prepare: true,  max: 5});
```
```
// ❌ WRONG - Neon serverless driver bypasses Hyperdriveimport { neon } from '@neondatabase/serverless';const sql = neon(env.HYPERDRIVE.connectionString);// This uses WebSockets, not TCP - Hyperdrive doesn't help// ✅ CORRECT - Use traditional TCP driver with Hyperdriveimport postgres from 'postgres';const sql = postgres(env.HYPERDRIVE.connectionString, {  prepare: true,  max: 5});
```
```
# ❌ WRONG - Using Supabase pooled connection (Supavisor)npx wrangler hyperdrive create my-supabase \  --connection-string="postgres://user:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres"# ✅ CORRECT - Use Supabase direct connectionnpx wrangler hyperdrive create my-supabase \  --connection-string="postgres://user:password@db.projectref.supabase.co:5432/postgres"
```
```
# ❌ WRONG - Using Supabase pooled connection (Supavisor)npx wrangler hyperdrive create my-supabase \  --connection-string="postgres://user:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres"# ✅ CORRECT - Use Supabase direct connectionnpx wrangler hyperdrive create my-supabase \  --connection-string="postgres://user:password@db.projectref.supabase.co:5432/postgres"
```
```
useDatabase
```
```
// ❌ WRONG - Nitro's useDatabase fails ~95% of the timeimport { useDatabase } from 'db0';import { drizzle } from 'db0/integrations/drizzle';export default eventHandler(async () => {  const db = useDatabase();  const users = await drizzle(db).select().from(usersTable);  // Fails ~95% of the time with 500 error});// ✅ CORRECT - Create Drizzle client directlyimport postgres from 'postgres';import { drizzle } from 'drizzle-orm/postgres-js';export default eventHandler(async (event) => {  const sql = postgres(event.context.cloudflare.env.HYPERDRIVE.connectionString, {    max: 5,    prepare: true  });  const db = drizzle(sql);  const users = await db.select().from(usersTable);  event.context.cloudflare.ctx.waitUntil(sql.end());  return { users };});
```
```
// ❌ WRONG - Nitro's useDatabase fails ~95% of the timeimport { useDatabase } from 'db0';import { drizzle } from 'db0/integrations/drizzle';export default eventHandler(async () => {  const db = useDatabase();  const users = await drizzle(db).select().from(usersTable);  // Fails ~95% of the time with 500 error});// ✅ CORRECT - Create Drizzle client directlyimport postgres from 'postgres';import { drizzle } from 'drizzle-orm/postgres-js';export default eventHandler(async (event) => {  const sql = postgres(event.context.cloudflare.env.HYPERDRIVE.connectionString, {    max: 5,    prepare: true  });  const db = drizzle(sql);  const users = await db.select().from(usersTable);  event.context.cloudflare.ctx.waitUntil(sql.end());  return { users };});
```
```
# Minimum version for Hyperdrive compatibilitynpm install postgres@3.4.5# Current recommended versionnpm install postgres@3.4.8
```
```
# Minimum version for Hyperdrive compatibilitynpm install postgres@3.4.5# Current recommended versionnpm install postgres@3.4.8
```
```
# PostgreSQLpostgres://user:password@host:5432/databasepostgres://user:password@host:5432/database?sslmode=require# MySQLmysql://user:password@host:3306/database# URL-encode special chars: p@ssw$rd → p%40ssw%24rd
```
```
# PostgreSQLpostgres://user:password@host:5432/databasepostgres://user:password@host:5432/database?sslmode=require# MySQLmysql://user:password@host:3306/database# URL-encode special chars: p@ssw$rd → p%40ssw%24rd
```
```
const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });await client.connect();const result = await client.query('SELECT ...');ctx.waitUntil(client.end());  // CRITICAL: Non-blocking cleanup
```
```
const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });await client.connect();const result = await client.query('SELECT ...');ctx.waitUntil(client.end());  // CRITICAL: Non-blocking cleanup
```
```
const pool = new Pool({  connectionString: env.HYPERDRIVE.connectionString,  max: 5  // CRITICAL: Workers limit is 6 connections (July 2025: configurable ~20 Free, ~100 Paid)});const [result1, result2] = await Promise.all([  pool.query('SELECT ...'),  pool.query('SELECT ...')]);ctx.waitUntil(pool.end());
```
```
const pool = new Pool({  connectionString: env.HYPERDRIVE.connectionString,  max: 5  // CRITICAL: Workers limit is 6 connections (July 2025: configurable ~20 Free, ~100 Paid)});const [result1, result2] = await Promise.all([  pool.query('SELECT ...'),  pool.query('SELECT ...')]);ctx.waitUntil(pool.end());
```
```
ctx.waitUntil(client.end())
```
```
await client.end()
```
```
import { drizzle } from "drizzle-orm/postgres-js";import postgres from "postgres";const sql = postgres(env.HYPERDRIVE.connectionString, { max: 5 });const db = drizzle(sql);const allUsers = await db.select().from(users);ctx.waitUntil(sql.end());
```
```
import { drizzle } from "drizzle-orm/postgres-js";import postgres from "postgres";const sql = postgres(env.HYPERDRIVE.connectionString, { max: 5 });const db = drizzle(sql);const allUsers = await db.select().from(users);ctx.waitUntil(sql.end());
```
```
import { PrismaPg } from "@prisma/adapter-pg";import { PrismaClient } from "@prisma/client";import { Pool } from "pg";// ❌ WRONG - Global client causes hangs after first requestconst prisma = new PrismaClient({ adapter });export default {  async fetch(request: Request, env: Bindings) {    const users = await prisma.user.findMany(); // Hangs after first request    return Response.json({ users });  }};// ✅ CORRECT - Per-request clientexport default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const pool = new Pool({ connectionString: env.HYPERDRIVE.connectionString, max: 5 });    const adapter = new PrismaPg(pool);    const prisma = new PrismaClient({ adapter });    try {      const users = await prisma.user.findMany();      return Response.json({ users });    } finally {      ctx.waitUntil(pool.end());    }  }};
```
```
import { PrismaPg } from "@prisma/adapter-pg";import { PrismaClient } from "@prisma/client";import { Pool } from "pg";// ❌ WRONG - Global client causes hangs after first requestconst prisma = new PrismaClient({ adapter });export default {  async fetch(request: Request, env: Bindings) {    const users = await prisma.user.findMany(); // Hangs after first request    return Response.json({ users });  }};// ✅ CORRECT - Per-request clientexport default {  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {    const pool = new Pool({ connectionString: env.HYPERDRIVE.connectionString, max: 5 });    const adapter = new PrismaPg(pool);    const prisma = new PrismaClient({ adapter });    try {      const users = await prisma.user.findMany();      return Response.json({ users });    } finally {      ctx.waitUntil(pool.end());    }  }};
```
```
@prisma/adapter-pg
```
```
const url = env.isLocal ? env.DB_URL : env.HYPERDRIVE.connectionString;const client = postgres(url, {  fetch_types: false,  max: 2,});
```
```
const url = env.isLocal ? env.DB_URL : env.HYPERDRIVE.connectionString;const client = postgres(url, {  fetch_types: false,  max: 2,});
```
```
wrangler dev --remote
```
```
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://user:password@localhost:5432/local_db"npx wrangler dev
```
```
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://user:password@localhost:5432/local_db"npx wrangler dev
```
```
{ "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "prod-id", "localConnectionString": "postgres://..." }] }
```
```
{ "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "prod-id", "localConnectionString": "postgres://..." }] }
```
```
npx wrangler dev --remote  # ⚠️ Uses PRODUCTION database
```
```
npx wrangler dev --remote  # ⚠️ Uses PRODUCTION database
```
```
const sql = postgres(env.HYPERDRIVE.connectionString, {  prepare: true  // REQUIRED for caching});
```
```
const sql = postgres(env.HYPERDRIVE.connectionString, {  prepare: true  // REQUIRED for caching});
```
```
response.headers.get('cf-cache-status');  // HIT, MISS, BYPASS, EXPIRED
```
```
response.headers.get('cf-cache-status');  // HIT, MISS, BYPASS, EXPIRED
```
```
require
```
```
verify-ca
```
```
verify-full
```
```
npx wrangler cert upload certificate-authority --ca-cert root-ca.pem --name my-ca-certnpx wrangler hyperdrive create my-db --connection-string="postgres://..." --ca-certificate-id <ID> --sslmode verify-full
```
```
npx wrangler cert upload certificate-authority --ca-cert root-ca.pem --name my-ca-certnpx wrangler hyperdrive create my-db --connection-string="postgres://..." --ca-certificate-id <ID> --sslmode verify-full
```
```
npx wrangler cert upload mtls-certificate --cert client-cert.pem --key client-key.pem --name my-certnpx wrangler hyperdrive create my-db --connection-string="postgres://..." --mtls-certificate-id <ID>
```
```
npx wrangler cert upload mtls-certificate --cert client-cert.pem --key client-key.pem --name my-certnpx wrangler hyperdrive create my-db --connection-string="postgres://..." --mtls-certificate-id <ID>
```
```
# 1. Install cloudflared (macOS: brew install cloudflare/cloudflare/cloudflared)# 2. Create tunnelcloudflared tunnel create my-db-tunnel# 3. Configure config.yml# tunnel: <TUNNEL_ID># ingress:#   - hostname: db.example.com#     service: tcp://localhost:5432# 4. Run tunnelcloudflared tunnel run my-db-tunnel# 5. Create Hyperdrivenpx wrangler hyperdrive create my-private-db --connection-string="postgres://user:password@db.example.com:5432/database"
```
```
# 1. Install cloudflared (macOS: brew install cloudflare/cloudflare/cloudflared)# 2. Create tunnelcloudflared tunnel create my-db-tunnel# 3. Configure config.yml# tunnel: <TUNNEL_ID># ingress:#   - hostname: db.example.com#     service: tcp://localhost:5432# 4. Run tunnelcloudflared tunnel run my-db-tunnel# 5. Create Hyperdrivenpx wrangler hyperdrive create my-private-db --connection-string="postgres://user:password@db.example.com:5432/database"
```
```
nodejs_compat
```
```
compatibility_flags
```
```
ctx.waitUntil(client.end())
```
```
max: 5
```
```
prepare: true
```
```
disableEval: true
```
```
wrangler dev
```
```
nodejs_compat
```
```
await client.end()
```
```
ctx.waitUntil()
```
```
useDatabase
```
```
# Create Hyperdrive configurationwrangler hyperdrive create <name> --connection-string="postgres://..."# List all Hyperdrive configurationswrangler hyperdrive list# Get details of a configurationwrangler hyperdrive get <hyperdrive-id># Update connection stringwrangler hyperdrive update <hyperdrive-id> --connection-string="postgres://..."# Delete configurationwrangler hyperdrive delete <hyperdrive-id># Upload CA certificatewrangler cert upload certificate-authority --ca-cert <file>.pem --name <name># Upload client certificate pairwrangler cert upload mtls-certificate --cert <cert>.pem --key <key>.pem --name <name>
```
```
# Create Hyperdrive configurationwrangler hyperdrive create <name> --connection-string="postgres://..."# List all Hyperdrive configurationswrangler hyperdrive list# Get details of a configurationwrangler hyperdrive get <hyperdrive-id># Update connection stringwrangler hyperdrive update <hyperdrive-id> --connection-string="postgres://..."# Delete configurationwrangler hyperdrive delete <hyperdrive-id># Upload CA certificatewrangler cert upload certificate-authority --ca-cert <file>.pem --name <name># Upload client certificate pairwrangler cert upload mtls-certificate --cert <cert>.pem --key <key>.pem --name <name>
```
```
PREPARE
```
```
EXECUTE
```
```
DEALLOCATE
```
```
LISTEN
```
```
NOTIFY
```
```
USE
```
```
COM_STMT_PREPARE
```
```
COM_INIT_DB
```
```
caching_sha2_password
```
```
mysql_native_password
```
```
prepare: true
```
```
references/troubleshooting.md
```
```
nodejs_compat
```
```
ctx.waitUntil()
```
```
disableEval: true
```
```
# Option 1: Create new config (zero downtime)wrangler hyperdrive create my-db-v2 --connection-string="postgres://new-creds..."# Update wrangler.jsonc, deploy, delete old config# Option 2: Update existingwrangler hyperdrive update <id> --connection-string="postgres://new-creds..."
```
```
# Option 1: Create new config (zero downtime)wrangler hyperdrive create my-db-v2 --connection-string="postgres://new-creds..."# Update wrangler.jsonc, deploy, delete old config# Option 2: Update existingwrangler hyperdrive update <id> --connection-string="postgres://new-creds..."
```
```
/* ❌ "No such module 'node:*'" error */// Missing compatibility flag/* ✅ Add to wrangler.jsonc */{  "compatibility_flags": ["nodejs_compat"]}
```
```
/* ❌ "No such module 'node:*'" error */// Missing compatibility flag/* ✅ Add to wrangler.jsonc */{  "compatibility_flags": ["nodejs_compat"]}
```
```
/* ❌ Blocks response */export default {  async fetch(request, env, ctx) {    const client = new Client(env.HYPERDRIVE.connectionString)    await client.connect()    const result = await client.query('SELECT * FROM users')    await client.end() // Blocks!    return Response.json(result.rows)  }}/* ✅ Non-blocking cleanup with waitUntil */export default {  async fetch(request, env, ctx) {    const client = new Client(env.HYPERDRIVE.connectionString)    await client.connect()    const result = await client.query('SELECT * FROM users')    ctx.waitUntil(client.end()) // Non-blocking!    return Response.json(result.rows)  }}
```
```
/* ❌ Blocks response */export default {  async fetch(request, env, ctx) {    const client = new Client(env.HYPERDRIVE.connectionString)    await client.connect()    const result = await client.query('SELECT * FROM users')    await client.end() // Blocks!    return Response.json(result.rows)  }}/* ✅ Non-blocking cleanup with waitUntil */export default {  async fetch(request, env, ctx) {    const client = new Client(env.HYPERDRIVE.connectionString)    await client.connect()    const result = await client.query('SELECT * FROM users')    ctx.waitUntil(client.end()) // Non-blocking!    return Response.json(result.rows)  }}
```
```
/* ❌ Too many connections */const pool = new Pool({  connectionString: env.HYPERDRIVE.connectionString,  max: 10, // Workers limit is 6 total!})/* ✅ Max 5 connections */const pool = new Pool({  connectionString: env.HYPERDRIVE.connectionString,  max: 5, // Leave room for other connections})
```
```
/* ❌ Too many connections */const pool = new Pool({  connectionString: env.HYPERDRIVE.connectionString,  max: 10, // Workers limit is 6 total!})/* ✅ Max 5 connections */const pool = new Pool({  connectionString: env.HYPERDRIVE.connectionString,  max: 5, // Leave room for other connections})
```
```
/* ❌ "eval() disallowed" error */import mysql from 'mysql2/promise'const conn = await mysql.createConnection(env.HYPERDRIVE.connectionString)/* ✅ Disable eval for Workers */import mysql from 'mysql2/promise'const conn = await mysql.createConnection({  uri: env.HYPERDRIVE.connectionString,  disableEval: true, // Required!})
```
```
/* ❌ "eval() disallowed" error */import mysql from 'mysql2/promise'const conn = await mysql.createConnection(env.HYPERDRIVE.connectionString)/* ✅ Disable eval for Workers */import mysql from 'mysql2/promise'const conn = await mysql.createConnection({  uri: env.HYPERDRIVE.connectionString,  disableEval: true, // Required!})
```
```
/* ✅ Better caching with prepared statements */const result = await client.query(  'SELECT * FROM users WHERE id = $1',  [userId])// Hyperdrive caches prepared statement plans
```
```
/* ✅ Better caching with prepared statements */const result = await client.query(  'SELECT * FROM users WHERE id = $1',  [userId])// Hyperdrive caches prepared statement plans
```
```
nodejs_compat
```
```
compatibility_flags
```
```
await client.end()
```
```
ctx.waitUntil(client.end())
```
```
max: 10
```
```
max: 5
```
```
disableEval: true
```
```
$1
```
For developers building high-performance serverless applications, the Cloudflare Hyperdrive Agent Skill is a game-changer. It empowers your AI assistant to configure and interact with Cloudflare Hyperdrive, drastically reducing database connection latency for both PostgreSQL and MySQL. By leveraging Cloudflare's global network, Hyperdrive pools and caches database connections closer to your Cloudflare Workers, ensuring your applications are incredibly responsive. This skill is essential for optimizing backend operations, especially when deploying globally distributed services where database access speed is critical for user experience and operational efficiency.

# When to Use This Skill
- •Deploying a global API using Cloudflare Workers that requires low-latency access to a centralized PostgreSQL or MySQL database.
- •Setting up and managing Hyperdrive configurations for new database connections directly through agent commands.
- •Optimizing existing serverless applications to reduce database connection overhead and improve query performance.
- •Troubleshooting database connection issues in a Cloudflare Workers environment by quickly reconfiguring Hyperdrive parameters.

# Pro Tips
- 💡Always configure Hyperdrive alongside `cloudflare-worker-base` for a seamless setup, as recommended in the skill's dependencies, to ensure proper integration with your Worker environment.
- 💡Leverage the configurable connection counts introduced in July 2025 to fine-tune your database connection pooling for optimal performance and resource utilization based on your specific application load.
- 💡Take advantage of Hyperdrive's regional prepared statement caching to significantly speed up frequently executed queries, particularly after the 5x faster cache hits update in May 2025.

