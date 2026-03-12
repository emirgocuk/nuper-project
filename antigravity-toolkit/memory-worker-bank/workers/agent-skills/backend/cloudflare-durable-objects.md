# cloudflare-durable-objects
Source: https://antigravity.codes/agent-skills/backend/cloudflare-durable-objects

## AI Worker Instructions
When the user requests functionality related to cloudflare-durable-objects, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-durable-objects
```
getByName()
```
```
npm create cloudflare@latest my-durable-app -- --template=cloudflare/durable-objects-template --ts
```
```
npm create cloudflare@latest my-durable-app -- --template=cloudflare/durable-objects-template --ts
```
```
// src/counter.ts - Durable Object classimport { DurableObject } from 'cloudflare:workers';export class Counter extends DurableObject {  async increment(): Promise<number> {    let value = (await this.ctx.storage.get<number>('value')) || 0;    await this.ctx.storage.put('value', ++value);    return value;  }}export default Counter;  // CRITICAL: Export required
```
```
// src/counter.ts - Durable Object classimport { DurableObject } from 'cloudflare:workers';export class Counter extends DurableObject {  async increment(): Promise<number> {    let value = (await this.ctx.storage.get<number>('value')) || 0;    await this.ctx.storage.put('value', ++value);    return value;  }}export default Counter;  // CRITICAL: Export required
```
```
// wrangler.jsonc - Configuration{  "durable_objects": {    "bindings": [{ "name": "COUNTER", "class_name": "Counter" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["Counter"] }  // SQLite backend (10GB limit)  ]}
```
```
// wrangler.jsonc - Configuration{  "durable_objects": {    "bindings": [{ "name": "COUNTER", "class_name": "Counter" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["Counter"] }  // SQLite backend (10GB limit)  ]}
```
```
// src/index.ts - Workerimport { Counter } from './counter';export { Counter };export default {  async fetch(request: Request, env: { COUNTER: DurableObjectNamespace<Counter> }) {    const stub = env.COUNTER.getByName('global-counter');  // Aug 2025: getByName() shortcut    return new Response(Count: ${await stub.increment()});  }};
```
```
// src/index.ts - Workerimport { Counter } from './counter';export { Counter };export default {  async fetch(request: Request, env: { COUNTER: DurableObjectNamespace<Counter> }) {    const stub = env.COUNTER.getByName('global-counter');  // Aug 2025: getByName() shortcut    return new Response(Count: ${await stub.increment()});  }};
```
```
Count: ${await stub.increment()}
```
```
import { DurableObject } from 'cloudflare:workers';export class MyDO extends DurableObject {  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);  // REQUIRED first line    // Load state before requests (optional)    ctx.blockConcurrencyWhile(async () => {      this.value = await ctx.storage.get('key') || defaultValue;    });  }  // RPC methods (recommended)  async myMethod(): Promise<string> { return 'Hello'; }  // HTTP fetch handler (optional)  async fetch(request: Request): Promise<Response> { return new Response('OK'); }}export default MyDO;  // CRITICAL: Export required// Worker must export DO class tooimport { MyDO } from './my-do';export { MyDO };
```
```
import { DurableObject } from 'cloudflare:workers';export class MyDO extends DurableObject {  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);  // REQUIRED first line    // Load state before requests (optional)    ctx.blockConcurrencyWhile(async () => {      this.value = await ctx.storage.get('key') || defaultValue;    });  }  // RPC methods (recommended)  async myMethod(): Promise<string> { return 'Hello'; }  // HTTP fetch handler (optional)  async fetch(request: Request): Promise<Response> { return new Response('OK'); }}export default MyDO;  // CRITICAL: Export required// Worker must export DO class tooimport { MyDO } from './my-do';export { MyDO };
```
```
super(ctx, env)
```
```
ctx.blockConcurrencyWhile()
```
```
setTimeout
```
```
setInterval
```
```
{ "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyDO"] }] }
```
```
{ "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyDO"] }] }
```
```
export class MyDO extends DurableObject {  sql: SqlStorage;  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);    this.sql = ctx.storage.sql;    this.sql.exec(      CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, created_at INTEGER);      CREATE INDEX IF NOT EXISTS idx_created ON messages(created_at);      PRAGMA optimize;  // Feb 2025: Query performance optimization    );  }  async addMessage(text: string): Promise<number> {    const cursor = this.sql.exec('INSERT INTO messages (text, created_at) VALUES (?, ?) RETURNING id', text, Date.now());    return cursor.one<{ id: number }>().id;  }  async getMessages(limit = 50): Promise<any[]> {    return this.sql.exec('SELECT * FROM messages ORDER BY created_at DESC LIMIT ?', limit).toArray();  }}
```
```
export class MyDO extends DurableObject {  sql: SqlStorage;  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);    this.sql = ctx.storage.sql;    this.sql.exec(      CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, created_at INTEGER);      CREATE INDEX IF NOT EXISTS idx_created ON messages(created_at);      PRAGMA optimize;  // Feb 2025: Query performance optimization    );  }  async addMessage(text: string): Promise<number> {    const cursor = this.sql.exec('INSERT INTO messages (text, created_at) VALUES (?, ?) RETURNING id', text, Date.now());    return cursor.one<{ id: number }>().id;  }  async getMessages(limit = 50): Promise<any[]> {    return this.sql.exec('SELECT * FROM messages ORDER BY created_at DESC LIMIT ?', limit).toArray();  }}
```
```
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, created_at INTEGER);      CREATE INDEX IF NOT EXISTS idx_created ON messages(created_at);      PRAGMA optimize;  // Feb 2025: Query performance optimization
```
```
sql.exec(query, ...params)
```
```
cursor.one<T>()
```
```
cursor.one<T>({ allowNone: true })
```
```
cursor.toArray<T>()
```
```
ctx.storage.transactionSync(() => { ... })
```
```
?
```
```
PRAGMA optimize
```
```
STRICT
```
```
// Single operationsawait this.ctx.storage.put('key', value);const value = await this.ctx.storage.get<T>('key');await this.ctx.storage.delete('key');// Batch operationsawait this.ctx.storage.put({ key1: val1, key2: val2 });const map = await this.ctx.storage.get(['key1', 'key2']);await this.ctx.storage.delete(['key1', 'key2']);// List and delete allconst map = await this.ctx.storage.list({ prefix: 'user:', limit: 100 });await this.ctx.storage.deleteAll();  // Atomic on SQLite only// Transactionsawait this.ctx.storage.transaction(async (txn) => {  await txn.put('key1', val1);  await txn.put('key2', val2);});
```
```
// Single operationsawait this.ctx.storage.put('key', value);const value = await this.ctx.storage.get<T>('key');await this.ctx.storage.delete('key');// Batch operationsawait this.ctx.storage.put({ key1: val1, key2: val2 });const map = await this.ctx.storage.get(['key1', 'key2']);await this.ctx.storage.delete(['key1', 'key2']);// List and delete allconst map = await this.ctx.storage.list({ prefix: 'user:', limit: 100 });await this.ctx.storage.deleteAll();  // Atomic on SQLite only// Transactionsawait this.ctx.storage.transaction(async (txn) => {  await txn.put('key1', val1);  await txn.put('key2', val2);});
```
```
serializeAttachment()
```
```
export class ChatRoom extends DurableObject {  sessions: Map<WebSocket, { userId: string; username: string }>;  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);    this.sessions = new Map();    // CRITICAL: Restore WebSocket metadata after hibernation    ctx.getWebSockets().forEach((ws) => {      this.sessions.set(ws, ws.deserializeAttachment());    });  }  async fetch(request: Request): Promise<Response> {    const pair = new WebSocketPair();    const [client, server] = Object.values(pair);    const url = new URL(request.url);    const metadata = { userId: url.searchParams.get('userId'), username: url.searchParams.get('username') };    // CRITICAL: Use ctx.acceptWebSocket(), NOT ws.accept()    this.ctx.acceptWebSocket(server);    server.serializeAttachment(metadata);  // Persist across hibernation    this.sessions.set(server, metadata);    return new Response(null, { status: 101, webSocket: client });  }  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {    const session = this.sessions.get(ws);    // Handle message (max 32 MiB since Oct 2025)  }  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {    this.sessions.delete(ws);    ws.close(code, 'Closing');  }  async webSocketError(ws: WebSocket, error: any): Promise<void> {    this.sessions.delete(ws);  }}
```
```
export class ChatRoom extends DurableObject {  sessions: Map<WebSocket, { userId: string; username: string }>;  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);    this.sessions = new Map();    // CRITICAL: Restore WebSocket metadata after hibernation    ctx.getWebSockets().forEach((ws) => {      this.sessions.set(ws, ws.deserializeAttachment());    });  }  async fetch(request: Request): Promise<Response> {    const pair = new WebSocketPair();    const [client, server] = Object.values(pair);    const url = new URL(request.url);    const metadata = { userId: url.searchParams.get('userId'), username: url.searchParams.get('username') };    // CRITICAL: Use ctx.acceptWebSocket(), NOT ws.accept()    this.ctx.acceptWebSocket(server);    server.serializeAttachment(metadata);  // Persist across hibernation    this.sessions.set(server, metadata);    return new Response(null, { status: 101, webSocket: client });  }  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {    const session = this.sessions.get(ws);    // Handle message (max 32 MiB since Oct 2025)  }  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {    this.sessions.delete(ws);    ws.close(code, 'Closing');  }  async webSocketError(ws: WebSocket, error: any): Promise<void> {    this.sessions.delete(ws);  }}
```
```
ctx.acceptWebSocket(ws)
```
```
ws.serializeAttachment(data)
```
```
ctx.getWebSockets().forEach()
```
```
setTimeout
```
```
setInterval
```
```
ws.accept()
```
```
setTimeout
```
```
setInterval
```
```
fetch()
```
```
export class Batcher extends DurableObject {  async addItem(item: string): Promise<void> {    // Add to buffer    const buffer = await this.ctx.storage.get<string[]>('buffer') || [];    buffer.push(item);    await this.ctx.storage.put('buffer', buffer);    // Schedule alarm if not set    if ((await this.ctx.storage.getAlarm()) === null) {      await this.ctx.storage.setAlarm(Date.now() + 10000);  // 10 seconds    }  }  async alarm(info: { retryCount: number; isRetry: boolean }): Promise<void> {    if (info.retryCount > 3) return;  // Give up after 3 retries    const buffer = await this.ctx.storage.get<string[]>('buffer') || [];    await this.processBatch(buffer);    await this.ctx.storage.put('buffer', []);    // Alarm auto-deleted after success  }}
```
```
export class Batcher extends DurableObject {  async addItem(item: string): Promise<void> {    // Add to buffer    const buffer = await this.ctx.storage.get<string[]>('buffer') || [];    buffer.push(item);    await this.ctx.storage.put('buffer', buffer);    // Schedule alarm if not set    if ((await this.ctx.storage.getAlarm()) === null) {      await this.ctx.storage.setAlarm(Date.now() + 10000);  // 10 seconds    }  }  async alarm(info: { retryCount: number; isRetry: boolean }): Promise<void> {    if (info.retryCount > 3) return;  // Give up after 3 retries    const buffer = await this.ctx.storage.get<string[]>('buffer') || [];    await this.processBatch(buffer);    await this.ctx.storage.put('buffer', []);    // Alarm auto-deleted after success  }}
```
```
await ctx.storage.setAlarm(Date.now() + 60000)
```
```
await ctx.storage.getAlarm()
```
```
await ctx.storage.deleteAlarm()
```
```
async alarm(info)
```
```
// DO classexport class Counter extends DurableObject {  async increment(): Promise<number> {    let value = (await this.ctx.storage.get<number>('count')) || 0;    await this.ctx.storage.put('count', ++value);    return value;  }}// Worker callsconst stub = env.COUNTER.getByName('my-counter');const count = await stub.increment();  // Type-safe!
```
```
// DO classexport class Counter extends DurableObject {  async increment(): Promise<number> {    let value = (await this.ctx.storage.get<number>('count')) || 0;    await this.ctx.storage.put('count', ++value);    return value;  }}// Worker callsconst stub = env.COUNTER.getByName('my-counter');const count = await stub.increment();  // Type-safe!
```
```
// DO classexport class Counter extends DurableObject {  async fetch(request: Request): Promise<Response> {    const url = new URL(request.url);    if (url.pathname === '/increment') {      let value = (await this.ctx.storage.get<number>('count')) || 0;      await this.ctx.storage.put('count', ++value);      return new Response(JSON.stringify({ count: value }));    }    return new Response('Not found', { status: 404 });  }}// Worker callsconst stub = env.COUNTER.getByName('my-counter');const response = await stub.fetch('https://fake-host/increment', { method: 'POST' });const data = await response.json();
```
```
// DO classexport class Counter extends DurableObject {  async fetch(request: Request): Promise<Response> {    const url = new URL(request.url);    if (url.pathname === '/increment') {      let value = (await this.ctx.storage.get<number>('count')) || 0;      await this.ctx.storage.put('count', ++value);      return new Response(JSON.stringify({ count: value }));    }    return new Response('Not found', { status: 404 });  }}// Worker callsconst stub = env.COUNTER.getByName('my-counter');const response = await stub.fetch('https://fake-host/increment', { method: 'POST' });const data = await response.json();
```
```
idFromName(name)
```
```
const stub = env.CHAT_ROOM.getByName('room-123');  // Aug 2025: Shortcut for idFromName + get// Use for: chat rooms, user sessions, per-tenant logic, singletons
```
```
const stub = env.CHAT_ROOM.getByName('room-123');  // Aug 2025: Shortcut for idFromName + get// Use for: chat rooms, user sessions, per-tenant logic, singletons
```
```
newUniqueId()
```
```
const id = env.MY_DO.newUniqueId({ jurisdiction: 'eu' });  // Optional: EU complianceconst idString = id.toString();  // Save to KV/D1 for later
```
```
const id = env.MY_DO.newUniqueId({ jurisdiction: 'eu' });  // Optional: EU complianceconst idString = id.toString();  // Save to KV/D1 for later
```
```
idFromString(idString)
```
```
const id = env.MY_DO.idFromString(await env.KV.get('session:123'));const stub = env.MY_DO.get(id);
```
```
const id = env.MY_DO.idFromString(await env.KV.get('session:123'));const stub = env.MY_DO.get(id);
```
```
const stub = env.MY_DO.get(id, { locationHint: 'enam' });  // wnam, enam, sam, weur, eeur, apac, oc, afr, me
```
```
const stub = env.MY_DO.get(id, { locationHint: 'enam' });  // wnam, enam, sam, weur, eeur, apac, oc, afr, me
```
```
const id = env.MY_DO.newUniqueId({ jurisdiction: 'eu' });  // Options: 'eu', 'fedramp'// Cannot combine with location hints, higher latency outside jurisdiction
```
```
const id = env.MY_DO.newUniqueId({ jurisdiction: 'eu' });  // Options: 'eu', 'fedramp'// Cannot combine with location hints, higher latency outside jurisdiction
```
```
{ "migrations": [{ "tag": "v1", "new_sqlite_classes": ["Counter"] }] }  // SQLite 10GB// Or: "new_classes": ["Counter"]  // KV 128MB (legacy)
```
```
{ "migrations": [{ "tag": "v1", "new_sqlite_classes": ["Counter"] }] }  // SQLite 10GB// Or: "new_classes": ["Counter"]  // KV 128MB (legacy)
```
```
{ "migrations": [  { "tag": "v1", "new_sqlite_classes": ["OldName"] },  { "tag": "v2", "renamed_classes": [{ "from": "OldName", "to": "NewName" }] }]}
```
```
{ "migrations": [  { "tag": "v1", "new_sqlite_classes": ["OldName"] },  { "tag": "v2", "renamed_classes": [{ "from": "OldName", "to": "NewName" }] }]}
```
```
{ "migrations": [  { "tag": "v1", "new_sqlite_classes": ["Counter"] },  { "tag": "v2", "deleted_classes": ["Counter"] }  // Immediate deletion, cannot undo]}
```
```
{ "migrations": [  { "tag": "v1", "new_sqlite_classes": ["Counter"] },  { "tag": "v2", "deleted_classes": ["Counter"] }  // Immediate deletion, cannot undo]}
```
```
{ "migrations": [{ "tag": "v1", "transferred_classes": [  { "from": "OldClass", "from_script": "old-worker", "to": "NewClass" }]}]}
```
```
{ "migrations": [{ "tag": "v1", "transferred_classes": [  { "from": "OldClass", "from_script": "old-worker", "to": "NewClass" }]}]}
```
```
async checkLimit(userId: string, limit: number, window: number): Promise<boolean> {  const requests = (await this.ctx.storage.get<number[]>(rate:${userId})) || [];  const valid = requests.filter(t => Date.now() - t < window);  if (valid.length >= limit) return false;  valid.push(Date.now());  await this.ctx.storage.put(rate:${userId}, valid);  return true;}
```
```
async checkLimit(userId: string, limit: number, window: number): Promise<boolean> {  const requests = (await this.ctx.storage.get<number[]>(rate:${userId})) || [];  const valid = requests.filter(t => Date.now() - t < window);  if (valid.length >= limit) return false;  valid.push(Date.now());  await this.ctx.storage.put(rate:${userId}, valid);  return true;}
```
```
rate:${userId}
```
```
rate:${userId}
```
```
async set(key: string, value: any, ttl?: number): Promise<void> {  const expiresAt = ttl ? Date.now() + ttl : null;  this.sql.exec('INSERT OR REPLACE INTO session (key, value, expires_at) VALUES (?, ?, ?)',    key, JSON.stringify(value), expiresAt);}async alarm(): Promise<void> {  this.sql.exec('DELETE FROM session WHERE expires_at < ?', Date.now());  await this.ctx.storage.setAlarm(Date.now() + 3600000);  // Hourly cleanup}
```
```
async set(key: string, value: any, ttl?: number): Promise<void> {  const expiresAt = ttl ? Date.now() + ttl : null;  this.sql.exec('INSERT OR REPLACE INTO session (key, value, expires_at) VALUES (?, ?, ?)',    key, JSON.stringify(value), expiresAt);}async alarm(): Promise<void> {  this.sql.exec('DELETE FROM session WHERE expires_at < ?', Date.now());  await this.ctx.storage.setAlarm(Date.now() + 3600000);  // Hourly cleanup}
```
```
async electLeader(workerId: string): Promise<boolean> {  try {    this.sql.exec('INSERT INTO leader (id, worker_id, elected_at) VALUES (1, ?, ?)', workerId, Date.now());    return true;  } catch { return false; }  // Already has leader}
```
```
async electLeader(workerId: string): Promise<boolean> {  try {    this.sql.exec('INSERT INTO leader (id, worker_id, elected_at) VALUES (1, ?, ?)', workerId, Date.now());    return true;  } catch { return false; }  // Already has leader}
```
```
// Coordinator delegates to child DOsconst gameRoom = env.GAME_ROOM.getByName(gameId);await gameRoom.initialize();await this.ctx.storage.put(game:${gameId}, { created: Date.now() });
```
```
// Coordinator delegates to child DOsconst gameRoom = env.GAME_ROOM.getByName(gameId);await gameRoom.initialize();await this.ctx.storage.put(game:${gameId}, { created: Date.now() });
```
```
game:${gameId}
```
```
export class MyDO extends DurableObject { }export default MyDO;  // Required
```
```
export class MyDO extends DurableObject { }export default MyDO;  // Required
```
```
super(ctx, env)
```
```
constructor(ctx: DurableObjectState, env: Env) {  super(ctx, env);  // Required first line}
```
```
constructor(ctx: DurableObjectState, env: Env) {  super(ctx, env);  // Required first line}
```
```
new_sqlite_classes
```
```
{ "tag": "v1", "new_sqlite_classes": ["MyDO"] }
```
```
{ "tag": "v1", "new_sqlite_classes": ["MyDO"] }
```
```
ctx.acceptWebSocket()
```
```
this.ctx.acceptWebSocket(server);  // Enables hibernation
```
```
this.ctx.acceptWebSocket(server);  // Enables hibernation
```
```
await this.ctx.storage.put('important', value);
```
```
await this.ctx.storage.put('important', value);
```
```
await this.ctx.storage.setAlarm(Date.now() + 60000);
```
```
await this.ctx.storage.setAlarm(Date.now() + 60000);
```
```
this.sql.exec('SELECT * FROM table WHERE id = ?', id);
```
```
this.sql.exec('SELECT * FROM table WHERE id = ?', id);
```
```
constructor(ctx, env) {  super(ctx, env);  // Minimal initialization only  ctx.blockConcurrencyWhile(async () => {    // Load from storage  });}
```
```
constructor(ctx, env) {  super(ctx, env);  // Minimal initialization only  ctx.blockConcurrencyWhile(async () => {    // Load from storage  });}
```
```
// Missing migrations array = error
```
```
// Missing migrations array = error
```
```
class MyDO extends DurableObject { }// Missing: export default MyDO;
```
```
class MyDO extends DurableObject { }// Missing: export default MyDO;
```
```
setTimeout
```
```
setInterval
```
```
setTimeout(() => {}, 1000);  // Prevents hibernation
```
```
setTimeout(() => {}, 1000);  // Prevents hibernation
```
```
// ❌ WRONG: this.sessions will be lost on hibernation// ✅ CORRECT: Use serializeAttachment()
```
```
// ❌ WRONG: this.sessions will be lost on hibernation// ✅ CORRECT: Use serializeAttachment()
```
```
# Migrations are atomic - cannot use gradual rollout
```
```
# Migrations are atomic - cannot use gradual rollout
```
```
// Not supported - must create new DO class instead
```
```
// Not supported - must create new DO class instead
```
```
ws.accept();  // ❌ No hibernationthis.ctx.acceptWebSocket(ws);  // ✅ Hibernation enabled
```
```
ws.accept();  // ❌ No hibernationthis.ctx.acceptWebSocket(ws);  // ✅ Hibernation enabled
```
```
// Location hints are best-effort only
```
```
// Location hints are best-effort only
```
```
"binding not found"
```
```
"Class X not found"
```
```
export class MyDO extends DurableObject { }export default MyDO;  // ← Required
```
```
export class MyDO extends DurableObject { }export default MyDO;  // ← Required
```
```
"migrations required"
```
```
"no migration found for class"
```
```
{  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["MyDO"] }  ]}
```
```
{  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["MyDO"] }  ]}
```
```
new_classes
```
```
new_sqlite_classes
```
```
new_sqlite_classes
```
```
blockConcurrencyWhile()
```
```
constructor(ctx, env) {  super(ctx, env);  ctx.blockConcurrencyWhile(async () => {    // Load from storage  });}
```
```
constructor(ctx, env) {  super(ctx, env);  ctx.blockConcurrencyWhile(async () => {    // Load from storage  });}
```
```
setTimeout
```
```
setInterval
```
```
// ❌ WRONGsetTimeout(() => {}, 1000);// ✅ CORRECTawait this.ctx.storage.setAlarm(Date.now() + 1000);
```
```
// ❌ WRONGsetTimeout(() => {}, 1000);// ✅ CORRECTawait this.ctx.storage.setAlarm(Date.now() + 1000);
```
```
serializeAttachment()
```
```
ws.serializeAttachment({ userId, username });// Restore in constructorctx.getWebSockets().forEach(ws => {  const metadata = ws.deserializeAttachment();  this.sessions.set(ws, metadata);});
```
```
ws.serializeAttachment({ userId, username });// Restore in constructorctx.getWebSockets().forEach(ws => {  const metadata = ws.deserializeAttachment();  this.sessions.set(ws, metadata);});
```
```
new WebSocket('url')
```
```
ctx.acceptWebSocket()
```
```
new WebSocket(url)
```
```
deleteAll()
```
```
deleteAll()
```
```
deleteAlarm()
```
```
deleteAll()
```
```
async alarm(info: { retryCount: number }): Promise<void> {  await this.ctx.storage.deleteAlarm();  // ← Call first  await this.ctx.storage.deleteAll();    // Then delete all}
```
```
async alarm(info: { retryCount: number }): Promise<void> {  await this.ctx.storage.deleteAlarm();  // ← Call first  await this.ctx.storage.deleteAll();    // Then delete all}
```
```
{ "bindings": [{ "name": "MY_DO", "class_name": "MyDO" }] }
```
```
{ "bindings": [{ "name": "MY_DO", "class_name": "MyDO" }] }
```
```
env.MY_DO.getByName('instance');  // Must match binding name
```
```
env.MY_DO.getByName('instance');  // Must match binding name
```
```
"state limit exceeded"
```
```
async alarm(info: { retryCount: number }): Promise<void> {  if (info.retryCount > 3) {    console.error('Giving up after 3 retries');    return;  }  // Idempotent operation}
```
```
async alarm(info: { retryCount: number }): Promise<void> {  if (info.retryCount > 3) {    console.error('Giving up after 3 retries');    return;  }  // Idempotent operation}
```
```
fetch()
```
```
"true"
```
```
"false"
```
```
// Convert booleans to integersthis.sql.exec('INSERT INTO test (bool_col) VALUES (?)', value ? 1 : 0);// Use STRICT tables to catch type mismatches earlythis.sql.exec(  CREATE TABLE IF NOT EXISTS test (    id INTEGER PRIMARY KEY,    bool_col INTEGER NOT NULL  ) STRICT;);
```
```
// Convert booleans to integersthis.sql.exec('INSERT INTO test (bool_col) VALUES (?)', value ? 1 : 0);// Use STRICT tables to catch type mismatches earlythis.sql.exec(  CREATE TABLE IF NOT EXISTS test (    id INTEGER PRIMARY KEY,    bool_col INTEGER NOT NULL  ) STRICT;);
```
```
CREATE TABLE IF NOT EXISTS test (    id INTEGER PRIMARY KEY,    bool_col INTEGER NOT NULL  ) STRICT;
```
```
blockConcurrencyWhile
```
```
"Cannot access MyDurableObject#myMethod as Durable Object RPC is not yet supported between multiple wrangler dev sessions"
```
```
wrangler dev
```
```
wrangler dev -c config1 -c config2
```
```
DurableObjectState.id.name
```
```
{  "compatibility_date": "2025-11-23",  "durable_objects": {    "bindings": [{ "name": "COUNTER", "class_name": "Counter" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["Counter"] },    { "tag": "v2", "renamed_classes": [{ "from": "Counter", "to": "CounterV2" }] }  ]}
```
```
{  "compatibility_date": "2025-11-23",  "durable_objects": {    "bindings": [{ "name": "COUNTER", "class_name": "Counter" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["Counter"] },    { "tag": "v2", "renamed_classes": [{ "from": "Counter", "to": "CounterV2" }] }  ]}
```
```
import { DurableObject, DurableObjectState, DurableObjectNamespace } from 'cloudflare:workers';interface Env { MY_DO: DurableObjectNamespace<MyDurableObject>; }export class MyDurableObject extends DurableObject<Env> {  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);    this.sql = ctx.storage.sql;  }}
```
```
import { DurableObject, DurableObjectState, DurableObjectNamespace } from 'cloudflare:workers';interface Env { MY_DO: DurableObjectNamespace<MyDurableObject>; }export class MyDurableObject extends DurableObject<Env> {  constructor(ctx: DurableObjectState, env: Env) {    super(ctx, env);    this.sql = ctx.storage.sql;  }}
```
```
references/top-errors.md
```
```
templates/
```
```
/* ❌ "Binding not found" error */class MyDO extends DurableObject {  // ...}// Missing export!/* ✅ Export the class */export class MyDO extends DurableObject {  // ...}export default { fetch: handler } // Also export default
```
```
/* ❌ "Binding not found" error */class MyDO extends DurableObject {  // ...}// Missing export!/* ✅ Export the class */export class MyDO extends DurableObject {  // ...}export default { fetch: handler } // Also export default
```
```
/* ❌ Cannot add SQLite to existing class */// migrations: [//   { tag: 'v1' },//   { tag: 'v2', new_sqlite_classes: ['MyDO'] } // Too late!// ]/* ✅ Must be in v1 migration */// wrangler.jsonc:{  "durable_objects": {    "bindings": [{ "name": "MY_DO", "class_name": "MyDO" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["MyDO"] } // First migration!  ]}
```
```
/* ❌ Cannot add SQLite to existing class */// migrations: [//   { tag: 'v1' },//   { tag: 'v2', new_sqlite_classes: ['MyDO'] } // Too late!// ]/* ✅ Must be in v1 migration */// wrangler.jsonc:{  "durable_objects": {    "bindings": [{ "name": "MY_DO", "class_name": "MyDO" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["MyDO"] } // First migration!  ]}
```
```
/* ❌ Manual accept breaks hibernation */webSocketPair[1].accept()/* ✅ Use context method for hibernation support */this.ctx.acceptWebSocket(webSocket)
```
```
/* ❌ Manual accept breaks hibernation */webSocketPair[1].accept()/* ✅ Use context method for hibernation support */this.ctx.acceptWebSocket(webSocket)
```
```
/* ❌ State cleared after ~10s idle */class MyDO extends DurableObject {  userData = {} // Lost on hibernation!}/* ✅ Persist WebSocket metadata */this.ctx.acceptWebSocket(ws)ws.serializeAttachment({ userId, roomId })// Retrieve on wake:const { userId } = ws.deserializeAttachment()
```
```
/* ❌ State cleared after ~10s idle */class MyDO extends DurableObject {  userData = {} // Lost on hibernation!}/* ✅ Persist WebSocket metadata */this.ctx.acceptWebSocket(ws)ws.serializeAttachment({ userId, roomId })// Retrieve on wake:const { userId } = ws.deserializeAttachment()
```
```
/* ❌ setTimeout prevents hibernation */setTimeout(() => this.cleanup(), 60000)/* ✅ Use alarms API */await this.ctx.storage.setAlarm(Date.now() + 60000)async alarm() {  await this.cleanup()}
```
```
/* ❌ setTimeout prevents hibernation */setTimeout(() => this.cleanup(), 60000)/* ✅ Use alarms API */await this.ctx.storage.setAlarm(Date.now() + 60000)async alarm() {  await this.cleanup()}
```
```
/* ✅ Required in constructor */constructor(ctx: DurableObjectState, env: Env) {  super(ctx, env) // Must be first!  // Then your initialization...}
```
```
/* ✅ Required in constructor */constructor(ctx: DurableObjectState, env: Env) {  super(ctx, env) // Must be first!  // Then your initialization...}
```
```
export class MyDO
```
```
v1
```
```
ws.accept()
```
```
this.ctx.acceptWebSocket(ws)
```
```
serializeAttachment()
```
```
setTimeout
```
```
setAlarm()
```
Cloudflare Durable Objects offer a powerful primitive for building stateful applications at the edge, enabling your AI agent to manage persistent data and real-time interactions with unparalleled efficiency. This skill empowers coding assistants like Claude Code to generate, understand, and debug code that leverages globally unique, consistent objects. It's ideal for scenarios requiring shared state across many users or processes, from collaborative editors to gaming backends. By providing structured access to this cutting-edge technology, the skill streamlines development of highly scalable, resilient, and performant serverless applications, significantly boosting productivity and code quality.

# When to Use This Skill
- •Building collaborative real-time applications (e.g., shared whiteboards, document editors).
- •Creating persistent game servers or session management for multiplayer games.
- •Implementing stateful APIs for IoT devices or Web3 dApps.
- •Developing distributed queues or counters for serverless workflows.

# Pro Tips
- 💡Always pair Durable Objects with a Cloudflare Worker (e.g., using `cloudflare-worker-base` skill) for efficient routing and API exposure.
- 💡Leverage the `@cloudflare/actors` library (when stable) for simplified migrations, alarms, and an `Actor` class pattern for better organization.
- 💡Monitor Durable Object storage usage and I/O operations carefully, especially when scaling, to optimize costs and performance.

