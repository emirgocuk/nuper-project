# cloudflare-d1
Source: https://antigravity.codes/agent-skills/database/cloudflare-d1

## AI Worker Instructions
When the user requests functionality related to cloudflare-d1, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-d1
```
# Create a new D1 databasenpx wrangler d1 create my-database# Output includes database_id - save this!# ✅ Successfully created DB 'my-database'## [[d1_databases]]# binding = "DB"# database_name = "my-database"# database_id = "<UUID>"
```
```
# Create a new D1 databasenpx wrangler d1 create my-database# Output includes database_id - save this!# ✅ Successfully created DB 'my-database'## [[d1_databases]]# binding = "DB"# database_name = "my-database"# database_id = "<UUID>"
```
```
wrangler.jsonc
```
```
{  "name": "my-worker",  "main": "src/index.ts",  "compatibility_date": "2025-10-11",  "d1_databases": [    {      "binding": "DB",                    // Available as env.DB in your Worker      "database_name": "my-database",      // Name from wrangler d1 create      "database_id": "<UUID>",             // ID from wrangler d1 create      "preview_database_id": "local-db"    // For local development    }  ]}
```
```
{  "name": "my-worker",  "main": "src/index.ts",  "compatibility_date": "2025-10-11",  "d1_databases": [    {      "binding": "DB",                    // Available as env.DB in your Worker      "database_name": "my-database",      // Name from wrangler d1 create      "database_id": "<UUID>",             // ID from wrangler d1 create      "preview_database_id": "local-db"    // For local development    }  ]}
```
```
binding
```
```
env.DB
```
```
database_id
```
```
preview_database_id
```
```
database_id
```
```
# Create migration filenpx wrangler d1 migrations create my-database create_users_table# This creates: migrations/0001_create_users_table.sql
```
```
# Create migration filenpx wrangler d1 migrations create my-database create_users_table# This creates: migrations/0001_create_users_table.sql
```
```
-- migrations/0001_create_users_table.sqlDROP TABLE IF EXISTS users;CREATE TABLE IF NOT EXISTS users (  user_id INTEGER PRIMARY KEY AUTOINCREMENT,  email TEXT NOT NULL UNIQUE,  username TEXT NOT NULL,  created_at INTEGER NOT NULL,  updated_at INTEGER);-- Create index for common queriesCREATE INDEX IF NOT EXISTS idx_users_email ON users(email);-- Optimize databasePRAGMA optimize;
```
```
-- migrations/0001_create_users_table.sqlDROP TABLE IF EXISTS users;CREATE TABLE IF NOT EXISTS users (  user_id INTEGER PRIMARY KEY AUTOINCREMENT,  email TEXT NOT NULL UNIQUE,  username TEXT NOT NULL,  created_at INTEGER NOT NULL,  updated_at INTEGER);-- Create index for common queriesCREATE INDEX IF NOT EXISTS idx_users_email ON users(email);-- Optimize databasePRAGMA optimize;
```
```
# Apply locally first (for testing)npx wrangler d1 migrations apply my-database --local# Apply to production when readynpx wrangler d1 migrations apply my-database --remote
```
```
# Apply locally first (for testing)npx wrangler d1 migrations apply my-database --local# Apply to production when readynpx wrangler d1 migrations apply my-database --remote
```
```
// src/index.tsimport { Hono } from 'hono';type Bindings = {  DB: D1Database;};const app = new Hono<{ Bindings: Bindings }>();app.get('/api/users/:email', async (c) => {  const email = c.req.param('email');  try {    // ALWAYS use prepared statements with bind()    const result = await c.env.DB.prepare(      'SELECT * FROM users WHERE email = ?'    )    .bind(email)    .first();    if (!result) {      return c.json({ error: 'User not found' }, 404);    }    return c.json(result);  } catch (error: any) {    console.error('D1 Error:', error.message);    return c.json({ error: 'Database error' }, 500);  }});export default app;
```
```
// src/index.tsimport { Hono } from 'hono';type Bindings = {  DB: D1Database;};const app = new Hono<{ Bindings: Bindings }>();app.get('/api/users/:email', async (c) => {  const email = c.req.param('email');  try {    // ALWAYS use prepared statements with bind()    const result = await c.env.DB.prepare(      'SELECT * FROM users WHERE email = ?'    )    .bind(email)    .first();    if (!result) {      return c.json({ error: 'User not found' }, 404);    }    return c.json(result);  } catch (error: any) {    console.error('D1 Error:', error.message);    return c.json({ error: 'Database error' }, 500);  }});export default app;
```
```
# 1. Create migrationnpx wrangler d1 migrations create <DATABASE_NAME> <MIGRATION_NAME># 2. List unapplied migrationsnpx wrangler d1 migrations list <DATABASE_NAME> --localnpx wrangler d1 migrations list <DATABASE_NAME> --remote# 3. Apply migrationsnpx wrangler d1 migrations apply <DATABASE_NAME> --local   # Test locallynpx wrangler d1 migrations apply <DATABASE_NAME> --remote  # Deploy to production
```
```
# 1. Create migrationnpx wrangler d1 migrations create <DATABASE_NAME> <MIGRATION_NAME># 2. List unapplied migrationsnpx wrangler d1 migrations list <DATABASE_NAME> --localnpx wrangler d1 migrations list <DATABASE_NAME> --remote# 3. Apply migrationsnpx wrangler d1 migrations apply <DATABASE_NAME> --local   # Test locallynpx wrangler d1 migrations apply <DATABASE_NAME> --remote  # Deploy to production
```
```
migrations/├── 0000_initial_schema.sql├── 0001_add_users_table.sql├── 0002_add_posts_table.sql└── 0003_add_indexes.sql
```
```
migrations/├── 0000_initial_schema.sql├── 0001_add_users_table.sql├── 0002_add_posts_table.sql└── 0003_add_indexes.sql
```
```
d1_migrations
```
```
{  "d1_databases": [    {      "binding": "DB",      "database_name": "my-database",      "database_id": "<UUID>",      "migrations_dir": "db/migrations",        // Custom directory (default: migrations/)      "migrations_table": "schema_migrations"   // Custom tracking table (default: d1_migrations)    }  ]}
```
```
{  "d1_databases": [    {      "binding": "DB",      "database_name": "my-database",      "database_id": "<UUID>",      "migrations_dir": "db/migrations",        // Custom directory (default: migrations/)      "migrations_table": "schema_migrations"   // Custom tracking table (default: d1_migrations)    }  ]}
```
```
-- Use IF NOT EXISTS to make migrations idempotentCREATE TABLE IF NOT EXISTS users (...);CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);-- Run PRAGMA optimize after schema changesPRAGMA optimize;-- Use UPPERCASE BEGIN/END in triggers (lowercase fails remotely)CREATE TRIGGER update_timestampAFTER UPDATE ON usersFOR EACH ROWBEGIN  UPDATE users SET updated_at = unixepoch() WHERE user_id = NEW.user_id;END;-- Use transactions for data migrationsBEGIN TRANSACTION;UPDATE users SET updated_at = unixepoch() WHERE updated_at IS NULL;COMMIT;
```
```
-- Use IF NOT EXISTS to make migrations idempotentCREATE TABLE IF NOT EXISTS users (...);CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);-- Run PRAGMA optimize after schema changesPRAGMA optimize;-- Use UPPERCASE BEGIN/END in triggers (lowercase fails remotely)CREATE TRIGGER update_timestampAFTER UPDATE ON usersFOR EACH ROWBEGIN  UPDATE users SET updated_at = unixepoch() WHERE user_id = NEW.user_id;END;-- Use transactions for data migrationsBEGIN TRANSACTION;UPDATE users SET updated_at = unixepoch() WHERE updated_at IS NULL;COMMIT;
```
```
-- DON'T include BEGIN TRANSACTION at start of migration file (D1 handles this)BEGIN TRANSACTION;  -- ❌ Remove this-- DON'T use lowercase begin/end in triggers (works locally, FAILS remotely)CREATE TRIGGER my_triggerAFTER INSERT ON tablebegin  -- ❌ Use BEGIN (uppercase)  UPDATE ...;end;   -- ❌ Use END (uppercase)-- DON'T use MySQL/PostgreSQL syntaxALTER TABLE users MODIFY COLUMN email VARCHAR(255);  -- ❌ Not SQLite-- DON'T create tables without IF NOT EXISTSCREATE TABLE users (...);  -- ❌ Fails if table exists
```
```
-- DON'T include BEGIN TRANSACTION at start of migration file (D1 handles this)BEGIN TRANSACTION;  -- ❌ Remove this-- DON'T use lowercase begin/end in triggers (works locally, FAILS remotely)CREATE TRIGGER my_triggerAFTER INSERT ON tablebegin  -- ❌ Use BEGIN (uppercase)  UPDATE ...;end;   -- ❌ Use END (uppercase)-- DON'T use MySQL/PostgreSQL syntaxALTER TABLE users MODIFY COLUMN email VARCHAR(255);  -- ❌ Not SQLite-- DON'T create tables without IF NOT EXISTSCREATE TABLE users (...);  -- ❌ Fails if table exists
```
```
-- Temporarily disable foreign key checks during schema changesPRAGMA defer_foreign_keys = true;-- Make schema changes that would violate foreign keysALTER TABLE posts DROP COLUMN author_id;ALTER TABLE posts ADD COLUMN user_id INTEGER REFERENCES users(user_id);-- Foreign keys re-enabled automatically at end of migration
```
```
-- Temporarily disable foreign key checks during schema changesPRAGMA defer_foreign_keys = true;-- Make schema changes that would violate foreign keysALTER TABLE posts DROP COLUMN author_id;ALTER TABLE posts ADD COLUMN user_id INTEGER REFERENCES users(user_id);-- Foreign keys re-enabled automatically at end of migration
```
```
interface Env { DB: D1Database; }type Bindings = { DB: D1Database; };const app = new Hono<{ Bindings: Bindings }>();
```
```
interface Env { DB: D1Database; }type Bindings = { DB: D1Database; };const app = new Hono<{ Bindings: Bindings }>();
```
```
const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')  .bind(email).first();
```
```
const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')  .bind(email).first();
```
```
.all()
```
```
{ results, meta }
```
```
.first()
```
```
.first('column')
```
```
.run()
```
```
{ success, meta }
```
```
const results = await env.DB.batch([  env.DB.prepare('SELECT * FROM users WHERE user_id = ?').bind(1),  env.DB.prepare('SELECT * FROM posts WHERE user_id = ?').bind(1)]);
```
```
const results = await env.DB.batch([  env.DB.prepare('SELECT * FROM users WHERE user_id = ?').bind(1),  env.DB.prepare('SELECT * FROM posts WHERE user_id = ?').bind(1)]);
```
```
await env.DB.exec('SELECT * FROM users;'); // Only for migrations/maintenance
```
```
await env.DB.exec('SELECT * FROM users;'); // Only for migrations/maintenance
```
```
// CREATEconst { meta } = await env.DB.prepare(  'INSERT INTO users (email, username, created_at) VALUES (?, ?, ?)').bind(email, username, Date.now()).run();const newUserId = meta.last_row_id;// READ (single)const user = await env.DB.prepare('SELECT * FROM users WHERE user_id = ?')  .bind(userId).first();// READ (multiple)const { results } = await env.DB.prepare('SELECT * FROM users LIMIT ?')  .bind(10).all();// UPDATEconst { meta } = await env.DB.prepare('UPDATE users SET username = ? WHERE user_id = ?')  .bind(newUsername, userId).run();const rowsAffected = meta.rows_written;// DELETEawait env.DB.prepare('DELETE FROM users WHERE user_id = ?').bind(userId).run();// COUNTconst count = await env.DB.prepare('SELECT COUNT(*) as total FROM users').first('total');// EXISTS checkconst exists = await env.DB.prepare('SELECT 1 FROM users WHERE email = ? LIMIT 1')  .bind(email).first();
```
```
// CREATEconst { meta } = await env.DB.prepare(  'INSERT INTO users (email, username, created_at) VALUES (?, ?, ?)').bind(email, username, Date.now()).run();const newUserId = meta.last_row_id;// READ (single)const user = await env.DB.prepare('SELECT * FROM users WHERE user_id = ?')  .bind(userId).first();// READ (multiple)const { results } = await env.DB.prepare('SELECT * FROM users LIMIT ?')  .bind(10).all();// UPDATEconst { meta } = await env.DB.prepare('UPDATE users SET username = ? WHERE user_id = ?')  .bind(newUsername, userId).run();const rowsAffected = meta.rows_written;// DELETEawait env.DB.prepare('DELETE FROM users WHERE user_id = ?').bind(userId).run();// COUNTconst count = await env.DB.prepare('SELECT COUNT(*) as total FROM users').first('total');// EXISTS checkconst exists = await env.DB.prepare('SELECT 1 FROM users WHERE email = ? LIMIT 1')  .bind(email).first();
```
```
const page = parseInt(c.req.query('page') || '1');const limit = 20;const offset = (page - 1) * limit;const [countResult, usersResult] = await c.env.DB.batch([  c.env.DB.prepare('SELECT COUNT(*) as total FROM users'),  c.env.DB.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?')    .bind(limit, offset)]);return c.json({  users: usersResult.results,  pagination: { page, limit, total: countResult.results[0].total }});
```
```
const page = parseInt(c.req.query('page') || '1');const limit = 20;const offset = (page - 1) * limit;const [countResult, usersResult] = await c.env.DB.batch([  c.env.DB.prepare('SELECT COUNT(*) as total FROM users'),  c.env.DB.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?')    .bind(limit, offset)]);return c.json({  users: usersResult.results,  pagination: { page, limit, total: countResult.results[0].total }});
```
```
// D1 doesn't support multi-statement transactions, but batch() provides sequential executionawait env.DB.batch([  env.DB.prepare('UPDATE users SET credits = credits - ? WHERE user_id = ?').bind(amount, fromUserId),  env.DB.prepare('UPDATE users SET credits = credits + ? WHERE user_id = ?').bind(amount, toUserId),  env.DB.prepare('INSERT INTO transactions (from_user, to_user, amount) VALUES (?, ?, ?)').bind(fromUserId, toUserId, amount)]);// If any statement fails, batch stops (transaction-like behavior)
```
```
// D1 doesn't support multi-statement transactions, but batch() provides sequential executionawait env.DB.batch([  env.DB.prepare('UPDATE users SET credits = credits - ? WHERE user_id = ?').bind(amount, fromUserId),  env.DB.prepare('UPDATE users SET credits = credits + ? WHERE user_id = ?').bind(amount, toUserId),  env.DB.prepare('INSERT INTO transactions (from_user, to_user, amount) VALUES (?, ?, ?)').bind(fromUserId, toUserId, amount)]);// If any statement fails, batch stops (transaction-like behavior)
```
```
D1_ERROR
```
```
D1_EXEC_ERROR
```
```
D1_TYPE_ERROR
```
```
D1_COLUMN_NOTFOUND
```
```
batch()
```
```
batch()
```
```
undefined
```
```
null
```
```
.bind(email, bio \|\| null)
```
```
PRAGMA defer_foreign_keys = true
```
```
D1_ERROR: Network connection lost
```
```
D1 DB storage operation exceeded timeout which caused object to be reset
```
```
Internal error while starting up D1 DB storage caused object to be reset
```
```
D1 DB's isolate exceeded its memory limit and was reset
```
```
async function queryWithRetry<T>(  fn: () => Promise<T>,  maxRetries = 3,  baseDelay = 100): Promise<T> {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn();    } catch (error: any) {      const isTransient = error.message?.includes('Network connection lost') ||                         error.message?.includes('exceeded timeout') ||                         error.message?.includes('exceeded its memory limit');      if (!isTransient || i === maxRetries - 1) throw error;      // Exponential backoff      await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, i)));    }  }  throw new Error('Max retries exceeded');}// Usageconst user = await queryWithRetry(() =>  env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first());
```
```
async function queryWithRetry<T>(  fn: () => Promise<T>,  maxRetries = 3,  baseDelay = 100): Promise<T> {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn();    } catch (error: any) {      const isTransient = error.message?.includes('Network connection lost') ||                         error.message?.includes('exceeded timeout') ||                         error.message?.includes('exceeded its memory limit');      if (!isTransient || i === maxRetries - 1) throw error;      // Exponential backoff      await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, i)));    }  }  throw new Error('Max retries exceeded');}// Usageconst user = await queryWithRetry(() =>  env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first());
```
```
meta.total_attempts
```
```
CREATE INDEX idx_users_email ON users(email)
```
```
CREATE INDEX idx_posts_user_id ON posts(user_id)
```
```
CREATE INDEX idx_posts_created_at ON posts(created_at DESC)
```
```
CREATE INDEX idx_posts_user_published ON posts(user_id, published)
```
```
CREATE INDEX idx_users_active ON users(email) WHERE deleted = 0
```
```
EXPLAIN QUERY PLAN SELECT ...
```
```
CREATE INDEX idx_users_email ON users(email);PRAGMA optimize;  -- Run after schema changes
```
```
CREATE INDEX idx_users_email ON users(email);PRAGMA optimize;  -- Run after schema changes
```
```
SELECT *
```
```
WHERE LOWER(email)
```
```
# Local database (automatic creation)npx wrangler d1 migrations apply my-database --localnpx wrangler d1 execute my-database --local --command "SELECT * FROM users"# Remote databasenpx wrangler d1 execute my-database --remote --command "SELECT * FROM users"# Remote bindings (wrangler@4.37.0+) - connect local Worker to deployed D1# Add to wrangler.jsonc: { "binding": "DB", "remote": true }
```
```
# Local database (automatic creation)npx wrangler d1 migrations apply my-database --localnpx wrangler d1 execute my-database --local --command "SELECT * FROM users"# Remote databasenpx wrangler d1 execute my-database --remote --command "SELECT * FROM users"# Remote bindings (wrangler@4.37.0+) - connect local Worker to deployed D1# Add to wrangler.jsonc: { "binding": "DB", "remote": true }
```
```
{ "remote": true }
```
```
D1_ERROR: Failed to parse body as JSON, got: error code: 1031
```
```
// Keep connection alive with periodic query (optional)setInterval(async () => {  try {    await env.DB.prepare('SELECT 1').first();  } catch (e) {    console.log('Connection keepalive failed:', e);  }}, 30 * 60 * 1000); // Every 30 minutes
```
```
// Keep connection alive with periodic query (optional)setInterval(async () => {  try {    await env.DB.prepare('SELECT 1').first();  } catch (e) {    console.log('Connection keepalive failed:', e);  }}, 30 * 60 * 1000); // Every 30 minutes
```
```
wrangler dev
```
```
--persist-to
```
```
# Apply worker2 migrations to worker1's persistence pathcd worker2npx wrangler d1 migrations apply DB --local --persist-to=../worker1/.wrangler/state# Now both workers can access D1cd ../worker1npx wrangler dev  # Both workers share the same D1 data
```
```
# Apply worker2 migrations to worker1's persistence pathcd worker2npx wrangler d1 migrations apply DB --local --persist-to=../worker1/.wrangler/state# Now both workers can access D1cd ../worker1npx wrangler dev  # Both workers share the same D1 data
```
```
.wrangler/state/v3/d1/miniflare-D1DatabaseObject/<database_id>.sqlite
```
```
npx wrangler d1 execute my-database --local --file=seed.sql
```
```
npx wrangler d1 execute my-database --local --file=seed.sql
```
```
// Hash user ID to shard numberfunction getShardId(userId: string): number {  const hash = Array.from(userId).reduce((acc, char) =>    ((acc << 5) - acc) + char.charCodeAt(0), 0  );  return Math.abs(hash) % 10; // 10 shards}// wrangler.jsonc - Define 10 database shards{  "d1_databases": [    { "binding": "DB_SHARD_0", "database_id": "..." },    { "binding": "DB_SHARD_1", "database_id": "..." },    { "binding": "DB_SHARD_2", "database_id": "..." },    // ... up to DB_SHARD_9  ]}// Get correct shard for userfunction getUserDb(env: Env, userId: string): D1Database {  const shardId = getShardId(userId);  return env[DB_SHARD_${shardId}];}// Query user's data from correct shardconst db = getUserDb(env, userId);const user = await db.prepare('SELECT * FROM users WHERE user_id = ?')  .bind(userId).first();
```
```
// Hash user ID to shard numberfunction getShardId(userId: string): number {  const hash = Array.from(userId).reduce((acc, char) =>    ((acc << 5) - acc) + char.charCodeAt(0), 0  );  return Math.abs(hash) % 10; // 10 shards}// wrangler.jsonc - Define 10 database shards{  "d1_databases": [    { "binding": "DB_SHARD_0", "database_id": "..." },    { "binding": "DB_SHARD_1", "database_id": "..." },    { "binding": "DB_SHARD_2", "database_id": "..." },    // ... up to DB_SHARD_9  ]}// Get correct shard for userfunction getUserDb(env: Env, userId: string): D1Database {  const shardId = getShardId(userId);  return env[DB_SHARD_${shardId}];}// Query user's data from correct shardconst db = getUserDb(env, userId);const user = await db.prepare('SELECT * FROM users WHERE user_id = ?')  .bind(userId).first();
```
```
DB_SHARD_${shardId}
```
```
database row size exceeded maximum allowed size
```
```
// 1. Store large content in R2const contentKey = pages/${crypto.randomUUID()}.html;await env.R2_BUCKET.put(contentKey, largeHtmlContent);// 2. Store metadata in D1await env.DB.prepare(  INSERT INTO pages (url, r2_key, size, created_at)  VALUES (?, ?, ?, ?)).bind(url, contentKey, largeHtmlContent.length, Date.now()).run();// 3. Retrieve contentconst page = await env.DB.prepare('SELECT * FROM pages WHERE url = ?')  .bind(url).first();if (page) {  const content = await env.R2_BUCKET.get(page.r2_key);  const html = await content.text();}
```
```
// 1. Store large content in R2const contentKey = pages/${crypto.randomUUID()}.html;await env.R2_BUCKET.put(contentKey, largeHtmlContent);// 2. Store metadata in D1await env.DB.prepare(  INSERT INTO pages (url, r2_key, size, created_at)  VALUES (?, ?, ?, ?)).bind(url, contentKey, largeHtmlContent.length, Date.now()).run();// 3. Retrieve contentconst page = await env.DB.prepare('SELECT * FROM pages WHERE url = ?')  .bind(url).first();if (page) {  const content = await env.R2_BUCKET.get(page.r2_key);  const html = await content.text();}
```
```
pages/${crypto.randomUUID()}.html
```
```
INSERT INTO pages (url, r2_key, size, created_at)  VALUES (?, ?, ?, ?)
```
```
-- Use lowercase for portabilityCREATE TABLE users (user_id INTEGER, email TEXT);CREATE INDEX idx_users_email ON users(email);-- NOT: CREATE TABLE Users (UserId INTEGER, Email TEXT);
```
```
-- Use lowercase for portabilityCREATE TABLE users (user_id INTEGER, email TEXT);CREATE INDEX idx_users_email ON users(email);-- NOT: CREATE TABLE Users (UserId INTEGER, Email TEXT);
```
```
-- CorrectCREATE VIRTUAL TABLE search_index USING fts5(  title,  content,  tokenize = 'porter unicode61');-- Query the indexSELECT * FROM search_index WHERE search_index MATCH 'query terms';
```
```
-- CorrectCREATE VIRTUAL TABLE search_index USING fts5(  title,  content,  tokenize = 'porter unicode61');-- Query the indexSELECT * FROM search_index WHERE search_index MATCH 'query terms';
```
```
wrangler d1 export
```
```
batch()
```
```
.wrangler
```
```
rm -rf .wranglernpx wrangler d1 execute db-name --file=database.sql
```
```
rm -rf .wranglernpx wrangler d1 execute db-name --file=database.sql
```
```
.bind()
```
```
.batch()
```
```
PRAGMA optimize
```
```
IF NOT EXISTS
```
```
null
```
```
undefined
```
```
meta.rows_written
```
```
.exec()
```
```
database_id
```
```
undefined
```
```
LIMIT
```
```
SELECT *
```
```
BEGIN TRANSACTION
```
```
batch()
```
```
BEGIN TRANSACTION
```
```
PRAGMA defer_foreign_keys = true
```
```
batch()
```
```
undefined
```
```
null
```
```
null
```
```
begin/end
```
```
BEGIN/END
```
```
--persist-to
```
```
# Database managementwrangler d1 create <DATABASE_NAME>wrangler d1 listwrangler d1 delete <DATABASE_NAME>wrangler d1 info <DATABASE_NAME># Migrationswrangler d1 migrations create <DATABASE_NAME> <MIGRATION_NAME>wrangler d1 migrations list <DATABASE_NAME> --local|--remotewrangler d1 migrations apply <DATABASE_NAME> --local|--remote# Execute querieswrangler d1 execute <DATABASE_NAME> --local|--remote --command "SELECT * FROM users"wrangler d1 execute <DATABASE_NAME> --local|--remote --file=./query.sql# Time Travel (view historical data)wrangler d1 time-travel info <DATABASE_NAME> --timestamp "2025-10-20"wrangler d1 time-travel restore <DATABASE_NAME> --timestamp "2025-10-20"
```
```
# Database managementwrangler d1 create <DATABASE_NAME>wrangler d1 listwrangler d1 delete <DATABASE_NAME>wrangler d1 info <DATABASE_NAME># Migrationswrangler d1 migrations create <DATABASE_NAME> <MIGRATION_NAME>wrangler d1 migrations list <DATABASE_NAME> --local|--remotewrangler d1 migrations apply <DATABASE_NAME> --local|--remote# Execute querieswrangler d1 execute <DATABASE_NAME> --local|--remote --command "SELECT * FROM users"wrangler d1 execute <DATABASE_NAME> --local|--remote --file=./query.sql# Time Travel (view historical data)wrangler d1 time-travel info <DATABASE_NAME> --timestamp "2025-10-20"wrangler d1 time-travel restore <DATABASE_NAME> --timestamp "2025-10-20"
```
```
/* ❌ Will cause conflicts */BEGIN TRANSACTION;CREATE TABLE users (...);COMMIT;/* ✅ D1 handles transactions automatically */CREATE TABLE users (...);
```
```
/* ❌ Will cause conflicts */BEGIN TRANSACTION;CREATE TABLE users (...);COMMIT;/* ✅ D1 handles transactions automatically */CREATE TABLE users (...);
```
```
/* ❌ Causes D1_TYPE_ERROR */await db.prepare('INSERT INTO users (name, bio) VALUES (?, ?)')  .bind('John', undefined)  .run()/* ✅ Use null for optional values */await db.prepare('INSERT INTO users (name, bio) VALUES (?, ?)')  .bind('John', null)  .run()
```
```
/* ❌ Causes D1_TYPE_ERROR */await db.prepare('INSERT INTO users (name, bio) VALUES (?, ?)')  .bind('John', undefined)  .run()/* ✅ Use null for optional values */await db.prepare('INSERT INTO users (name, bio) VALUES (?, ?)')  .bind('John', null)  .run()
```
```
/* ❌ SQL injection vulnerability */await db.exec(SELECT * FROM users WHERE id = ${userId})/* ✅ Use prepared statements */await db.prepare('SELECT * FROM users WHERE id = ?')  .bind(userId)  .first()
```
```
/* ❌ SQL injection vulnerability */await db.exec(SELECT * FROM users WHERE id = ${userId})/* ✅ Use prepared statements */await db.prepare('SELECT * FROM users WHERE id = ?')  .bind(userId)  .first()
```
```
SELECT * FROM users WHERE id = ${userId}
```
```
/* ❌ Statement too long (>128KB) */await db.exec(INSERT INTO items VALUES ${thousands_of_rows})/* ✅ Batch into 100-250 rows */for (const batch of chunks(rows, 100)) {  await db.batch(    batch.map(row =>      db.prepare('INSERT INTO items VALUES (?, ?)').bind(row.a, row.b)    )  )}
```
```
/* ❌ Statement too long (>128KB) */await db.exec(INSERT INTO items VALUES ${thousands_of_rows})/* ✅ Batch into 100-250 rows */for (const batch of chunks(rows, 100)) {  await db.batch(    batch.map(row =>      db.prepare('INSERT INTO items VALUES (?, ?)').bind(row.a, row.b)    )  )}
```
```
INSERT INTO items VALUES ${thousands_of_rows}
```
```
/* ❌ Multiple round trips */await db.prepare('SELECT * FROM users').all()await db.prepare('SELECT * FROM posts').all()/* ✅ Single round trip */const [users, posts] = await db.batch([  db.prepare('SELECT * FROM users'),  db.prepare('SELECT * FROM posts'),])
```
```
/* ❌ Multiple round trips */await db.prepare('SELECT * FROM users').all()await db.prepare('SELECT * FROM posts').all()/* ✅ Single round trip */const [users, posts] = await db.batch([  db.prepare('SELECT * FROM users'),  db.prepare('SELECT * FROM posts'),])
```
```
BEGIN TRANSACTION
```
```
undefined
```
```
null
```
```
.prepare().bind()
```
```
.batch([...])
```
Unlock the power of Cloudflare D1, the serverless SQL database, directly within your AI coding environment. This agent skill empowers you to seamlessly provision, configure, and interact with D1 databases for your edge-based applications. Designed for developers building high-performance, globally distributed services, it streamlines the integration of persistent data storage with Cloudflare Workers. Quickly set up your data layer without leaving your coding assistant, accelerating development workflows and ensuring your data is always close to your users.

# When to Use This Skill
- •Provisioning a new Cloudflare D1 database for a new project directly from the coding assistant.
- •Integrating D1 with a Cloudflare Worker application to store and retrieve data.
- •Exploring D1 database schemas or running quick queries during development or debugging.
- •Setting up local development environments that mirror D1 for testing.

# Pro Tips
- 💡Always define your D1 binding in `wrangler.toml` for easy access within your Workers, matching the binding name used in the skill.
- 💡Leverage D1's read replication feature for globally distributed applications to reduce latency for read operations by specifying region preferences.
- 💡Utilize `wrangler d1 execute` with SQL files for complex schema migrations or bulk data operations, automating database setup within your CI/CD.

