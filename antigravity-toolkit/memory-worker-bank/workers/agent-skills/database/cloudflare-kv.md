# cloudflare-kv
Source: https://antigravity.codes/agent-skills/database/cloudflare-kv

## AI Worker Instructions
When the user requests functionality related to cloudflare-kv, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-kv
```
# Create namespacenpx wrangler kv namespace create MY_NAMESPACE# Output: [[kv_namespaces]] binding = "MY_NAMESPACE" id = "<UUID>"
```
```
# Create namespacenpx wrangler kv namespace create MY_NAMESPACE# Output: [[kv_namespaces]] binding = "MY_NAMESPACE" id = "<UUID>"
```
```
{  "kv_namespaces": [{    "binding": "MY_NAMESPACE",  // Access as env.MY_NAMESPACE    "id": "<production-uuid>",    "preview_id": "<preview-uuid>"  // Optional: local dev  }]}
```
```
{  "kv_namespaces": [{    "binding": "MY_NAMESPACE",  // Access as env.MY_NAMESPACE    "id": "<production-uuid>",    "preview_id": "<preview-uuid>"  // Optional: local dev  }]}
```
```
type Bindings = { MY_NAMESPACE: KVNamespace };app.post('/set/:key', async (c) => {  await c.env.MY_NAMESPACE.put(c.req.param('key'), await c.req.text());  return c.json({ success: true });});app.get('/get/:key', async (c) => {  const value = await c.env.MY_NAMESPACE.get(c.req.param('key'));  return value ? c.json({ value }) : c.json({ error: 'Not found' }, 404);});
```
```
type Bindings = { MY_NAMESPACE: KVNamespace };app.post('/set/:key', async (c) => {  await c.env.MY_NAMESPACE.put(c.req.param('key'), await c.req.text());  return c.json({ success: true });});app.get('/get/:key', async (c) => {  const value = await c.env.MY_NAMESPACE.get(c.req.param('key'));  return value ? c.json({ value }) : c.json({ error: 'Not found' }, 404);});
```
```
// Get single keyconst value = await env.MY_KV.get('key');  // string | nullconst data = await env.MY_KV.get('key', { type: 'json' });  // object | nullconst buffer = await env.MY_KV.get('key', { type: 'arrayBuffer' });const stream = await env.MY_KV.get('key', { type: 'stream' });// Get with cache (minimum 60s)const value = await env.MY_KV.get('key', { cacheTtl: 300 });  // 5 min edge cache// Bulk read (counts as 1 operation)const values = await env.MY_KV.get(['key1', 'key2']);  // Map<string, string | null>// With metadataconst { value, metadata } = await env.MY_KV.getWithMetadata('key');const result = await env.MY_KV.getWithMetadata(['key1', 'key2']);  // Bulk with metadata
```
```
// Get single keyconst value = await env.MY_KV.get('key');  // string | nullconst data = await env.MY_KV.get('key', { type: 'json' });  // object | nullconst buffer = await env.MY_KV.get('key', { type: 'arrayBuffer' });const stream = await env.MY_KV.get('key', { type: 'stream' });// Get with cache (minimum 60s)const value = await env.MY_KV.get('key', { cacheTtl: 300 });  // 5 min edge cache// Bulk read (counts as 1 operation)const values = await env.MY_KV.get(['key1', 'key2']);  // Map<string, string | null>// With metadataconst { value, metadata } = await env.MY_KV.getWithMetadata('key');const result = await env.MY_KV.getWithMetadata(['key1', 'key2']);  // Bulk with metadata
```
```
// Basic write (max 1/second per key)await env.MY_KV.put('key', 'value');await env.MY_KV.put('user:123', JSON.stringify({ name: 'John' }));// With expirationawait env.MY_KV.put('session', data, { expirationTtl: 3600 });  // 1 hourawait env.MY_KV.put('token', value, { expiration: Math.floor(Date.now()/1000) + 86400 });// With metadata (max 1024 bytes)await env.MY_KV.put('config', 'dark', {  metadata: { updatedAt: Date.now(), version: 2 }});
```
```
// Basic write (max 1/second per key)await env.MY_KV.put('key', 'value');await env.MY_KV.put('user:123', JSON.stringify({ name: 'John' }));// With expirationawait env.MY_KV.put('session', data, { expirationTtl: 3600 });  // 1 hourawait env.MY_KV.put('token', value, { expiration: Math.floor(Date.now()/1000) + 86400 });// With metadata (max 1024 bytes)await env.MY_KV.put('config', 'dark', {  metadata: { updatedAt: Date.now(), version: 2 }});
```
```
// List with paginationconst result = await env.MY_KV.list({ prefix: 'user:', limit: 1000, cursor });// result: { keys: [], list_complete: boolean, cursor?: string }// CRITICAL: Always check list_complete, not keys.length === 0let cursor: string | undefined;do {  const result = await env.MY_KV.list({ prefix: 'user:', cursor });  processKeys(result.keys);  cursor = result.list_complete ? undefined : result.cursor;} while (cursor);
```
```
// List with paginationconst result = await env.MY_KV.list({ prefix: 'user:', limit: 1000, cursor });// result: { keys: [], list_complete: boolean, cursor?: string }// CRITICAL: Always check list_complete, not keys.length === 0let cursor: string | undefined;do {  const result = await env.MY_KV.list({ prefix: 'user:', cursor });  processKeys(result.keys);  cursor = result.list_complete ? undefined : result.cursor;} while (cursor);
```
```
// Delete single keyawait env.MY_KV.delete('key');  // Always succeeds// Bulk delete (CLI only, up to 10,000 keys)// npx wrangler kv bulk delete --binding=MY_KV keys.json
```
```
// Delete single keyawait env.MY_KV.delete('key');  // Always succeeds// Bulk delete (CLI only, up to 10,000 keys)// npx wrangler kv bulk delete --binding=MY_KV keys.json
```
```
async function getCachedData(kv: KVNamespace, key: string, fetchFn: () => Promise<any>, ttl = 300) {  const cached = await kv.get(key, { type: 'json', cacheTtl: ttl });  if (cached) return cached;  const data = await fetchFn();  await kv.put(key, JSON.stringify(data), { expirationTtl: ttl * 2 });  return data;}
```
```
async function getCachedData(kv: KVNamespace, key: string, fetchFn: () => Promise<any>, ttl = 300) {  const cached = await kv.get(key, { type: 'json', cacheTtl: ttl });  if (cached) return cached;  const data = await fetchFn();  await kv.put(key, JSON.stringify(data), { expirationTtl: ttl * 2 });  return data;}
```
```
// Store small values (<1024 bytes) in metadata to avoid separate get() callsawait env.MY_KV.put('user:123', '', {  metadata: { status: 'active', plan: 'pro', lastSeen: Date.now() }});// list() returns metadata automatically (no additional get() calls)const users = await env.MY_KV.list({ prefix: 'user:' });users.keys.forEach(({ name, metadata }) => console.log(name, metadata.status));
```
```
// Store small values (<1024 bytes) in metadata to avoid separate get() callsawait env.MY_KV.put('user:123', '', {  metadata: { status: 'active', plan: 'pro', lastSeen: Date.now() }});// list() returns metadata automatically (no additional get() calls)const users = await env.MY_KV.list({ prefix: 'user:' });users.keys.forEach(({ name, metadata }) => console.log(name, metadata.status));
```
```
// ❌ Bad: Many cold keys (300ms each)await kv.put('user:123:name', 'John');await kv.put('user:123:email', 'john@example.com');await kv.put('user:123:plan', 'pro');// Each read of a cold key: ~100-300msconst name = await kv.get('user:123:name');    // Coldconst email = await kv.get('user:123:email');  // Coldconst plan = await kv.get('user:123:plan');    // Cold// ✅ Good: Single hot key (6-8ms)await kv.put('user:123', JSON.stringify({  name: 'John',  email: 'john@example.com',  plan: 'pro'}));// Single read, cached as hot key: ~6-8msconst user = JSON.parse(await kv.get('user:123'));
```
```
// ❌ Bad: Many cold keys (300ms each)await kv.put('user:123:name', 'John');await kv.put('user:123:email', 'john@example.com');await kv.put('user:123:plan', 'pro');// Each read of a cold key: ~100-300msconst name = await kv.get('user:123:name');    // Coldconst email = await kv.get('user:123:email');  // Coldconst plan = await kv.get('user:123:plan');    // Cold// ✅ Good: Single hot key (6-8ms)await kv.put('user:123', JSON.stringify({  name: 'John',  email: 'john@example.com',  plan: 'pro'}));// Single read, cached as hot key: ~6-8msconst user = JSON.parse(await kv.get('user:123'));
```
```
cacheTtl
```
```
async function* paginateKV(kv: KVNamespace, options: { prefix?: string } = {}) {  let cursor: string | undefined;  do {    const result = await kv.list({ ...options, cursor });    yield result.keys;    cursor = result.list_complete ? undefined : result.cursor;  } while (cursor);}// Usagefor await (const keys of paginateKV(env.MY_KV, { prefix: 'user:' })) {  processKeys(keys);}
```
```
async function* paginateKV(kv: KVNamespace, options: { prefix?: string } = {}) {  let cursor: string | undefined;  do {    const result = await kv.list({ ...options, cursor });    yield result.keys;    cursor = result.list_complete ? undefined : result.cursor;  } while (cursor);}// Usagefor await (const keys of paginateKV(env.MY_KV, { prefix: 'user:' })) {  processKeys(keys);}
```
```
async function putWithRetry(kv: KVNamespace, key: string, value: string, opts?: KVPutOptions) {  let attempts = 0, delay = 1000;  while (attempts < 5) {    try {      await kv.put(key, value, opts);      return;    } catch (error) {      if ((error as Error).message.includes('429')) {        attempts++;        if (attempts >= 5) throw new Error('Max retry attempts');        await new Promise(r => setTimeout(r, delay));        delay *= 2;  // Exponential backoff      } else throw error;    }  }}
```
```
async function putWithRetry(kv: KVNamespace, key: string, value: string, opts?: KVPutOptions) {  let attempts = 0, delay = 1000;  while (attempts < 5) {    try {      await kv.put(key, value, opts);      return;    } catch (error) {      if ((error as Error).message.includes('429')) {        attempts++;        if (attempts >= 5) throw new Error('Max retry attempts');        await new Promise(r => setTimeout(r, delay));        delay *= 2;  // Exponential backoff      } else throw error;    }  }}
```
```
// Tokyo: Writeawait env.MY_KV.put('counter', '1');const value = await env.MY_KV.get('counter'); // "1" ✅ (same POP, RYOW)// London (within 60s): May be stale ⚠️const value2 = await env.MY_KV.get('counter'); // Might be old value// After 60+ seconds: Consistent ✅
```
```
// Tokyo: Writeawait env.MY_KV.put('counter', '1');const value = await env.MY_KV.get('counter'); // "1" ✅ (same POP, RYOW)// London (within 60s): May be stale ⚠️const value2 = await env.MY_KV.get('counter'); // Might be old value// After 60+ seconds: Consistent ✅
```
```
// Use timestamp in key structure to avoid consistency issuesconst timestamp = Date.now();await kv.put(user:123:${timestamp}, userData);// Find latest using list with prefixconst result = await kv.list({ prefix: 'user:123:' });const latestKey = result.keys.sort((a, b) =>  parseInt(b.name.split(':')[2]) - parseInt(a.name.split(':')[2])).at(0);
```
```
// Use timestamp in key structure to avoid consistency issuesconst timestamp = Date.now();await kv.put(user:123:${timestamp}, userData);// Find latest using list with prefixconst result = await kv.list({ prefix: 'user:123:' });const latestKey = result.keys.sort((a, b) =>  parseInt(b.name.split(':')[2]) - parseInt(a.name.split(':')[2])).at(0);
```
```
user:123:${timestamp}
```
```
# Create namespacenpx wrangler kv namespace create MY_NAMESPACE [--preview]# Manage keys (add --remote flag to access production data)npx wrangler kv key put --binding=MY_KV "key" "value" [--ttl=3600] [--metadata='{}']npx wrangler kv key get --binding=MY_KV "key" [--remote]npx wrangler kv key list --binding=MY_KV [--prefix="user:"] [--remote]npx wrangler kv key delete --binding=MY_KV "key"# Bulk operations (up to 10,000 keys)npx wrangler kv bulk put --binding=MY_KV data.jsonnpx wrangler kv bulk delete --binding=MY_KV keys.json
```
```
# Create namespacenpx wrangler kv namespace create MY_NAMESPACE [--preview]# Manage keys (add --remote flag to access production data)npx wrangler kv key put --binding=MY_KV "key" "value" [--ttl=3600] [--metadata='{}']npx wrangler kv key get --binding=MY_KV "key" [--remote]npx wrangler kv key list --binding=MY_KV [--prefix="user:"] [--remote]npx wrangler kv key delete --binding=MY_KV "key"# Bulk operations (up to 10,000 keys)npx wrangler kv bulk put --binding=MY_KV data.jsonnpx wrangler kv bulk delete --binding=MY_KV keys.json
```
```
--remote
```
```
{  "kv_namespaces": [{    "binding": "MY_KV",    "id": "production-uuid",    "remote": true  // Connect to live KV  }]}
```
```
{  "kv_namespaces": [{    "binding": "MY_KV",    "id": "production-uuid",    "remote": true  // Connect to live KV  }]}
```
```
remote: true
```
```
// ❌ Badawait env.MY_KV.put('counter', '1');await env.MY_KV.put('counter', '2'); // 429 error!// ✅ Goodawait putWithRetry(env.MY_KV, 'counter', '2');
```
```
// ❌ Badawait env.MY_KV.put('counter', '1');await env.MY_KV.put('counter', '2'); // 429 error!// ✅ Goodawait putWithRetry(env.MY_KV, 'counter', '2');
```
```
if (value.length > 25 * 1024 * 1024) throw new Error('Value exceeds 25 MiB');
```
```
if (value.length > 25 * 1024 * 1024) throw new Error('Value exceeds 25 MiB');
```
```
const serialized = JSON.stringify(metadata);if (serialized.length > 1024) throw new Error('Metadata exceeds 1024 bytes');
```
```
const serialized = JSON.stringify(metadata);if (serialized.length > 1024) throw new Error('Metadata exceeds 1024 bytes');
```
```
// ❌ Errorawait env.MY_KV.get('key', { cacheTtl: 30 });// ✅ Correctawait env.MY_KV.get('key', { cacheTtl: 60 });
```
```
// ❌ Errorawait env.MY_KV.get('key', { cacheTtl: 30 });// ✅ Correctawait env.MY_KV.get('key', { cacheTtl: 60 });
```
```
list()
```
```
list_complete
```
```
keys.length === 0
```
```
get()
```
```
null
```
```
// ❌ Bad: Rate limitfor (let i = 0; i < 10; i++) await kv.put('counter', String(i));// ✅ Good: Single writeawait kv.put('counter', '9');// ✅ Good: Retry with backoffawait putWithRetry(kv, 'counter', String(i));
```
```
// ❌ Bad: Rate limitfor (let i = 0; i < 10; i++) await kv.put('counter', String(i));// ✅ Good: Single writeawait kv.put('counter', '9');// ✅ Good: Retry with backoffawait putWithRetry(kv, 'counter', String(i));
```
```
// ❌ Bad: 5000 operationsfor (const key of 5000keys) await kv.get(key);// ✅ Good: 1 operationconst values = await kv.get(keys);  // Bulk read
```
```
// ❌ Bad: 5000 operationsfor (const key of 5000keys) await kv.get(key);// ✅ Good: 1 operationconst values = await kv.get(keys);  // Bulk read
```
```
list_complete
```
```
keys.length
```
```
// ✅ Correct paginationlet cursor: string | undefined;do {  const result = await kv.list({ cursor });  processKeys(result.keys);  // Even if empty  cursor = result.list_complete ? undefined : result.cursor;} while (cursor);
```
```
// ✅ Correct paginationlet cursor: string | undefined;do {  const result = await kv.list({ cursor });  processKeys(result.keys);  // Even if empty  cursor = result.list_complete ? undefined : result.cursor;} while (cursor);
```
```
prefix
```
```
// ❌ WRONG - Loses prefix on subsequent pageslet result = await kv.list({ prefix: 'user:' });result = await kv.list({ cursor: result.cursor });  // Missing prefix!// ✅ CORRECT - Include prefix on every calllet cursor: string | undefined;do {  const result = await kv.list({ prefix: 'user:', cursor });  processKeys(result.keys);  cursor = result.list_complete ? undefined : result.cursor;} while (cursor);
```
```
// ❌ WRONG - Loses prefix on subsequent pageslet result = await kv.list({ prefix: 'user:' });result = await kv.list({ cursor: result.cursor });  // Missing prefix!// ✅ CORRECT - Include prefix on every calllet cursor: string | undefined;do {  const result = await kv.list({ prefix: 'user:', cursor });  processKeys(result.keys);  cursor = result.list_complete ? undefined : result.cursor;} while (cursor);
```
```
wrangler types
```
```
[env.feature.kv_namespaces]
```
```
# wrangler.toml[env.feature]name = "my-worker-feature"[[env.feature.kv_namespaces]]binding = "MY_STORAGE_FEATURE"id = "xxxxxxxxxxxx"
```
```
# wrangler.toml[env.feature]name = "my-worker-feature"[[env.feature.kv_namespaces]]binding = "MY_STORAGE_FEATURE"id = "xxxxxxxxxxxx"
```
```
npx wrangler types
```
```
# Generate types for specific environmentnpx wrangler types -e feature
```
```
# Generate types for specific environmentnpx wrangler types -e feature
```
```
# Top-level (types generated correctly)[[kv_namespaces]]binding = "MY_STORAGE"id = "xxxxxxxxxxxx"
```
```
# Top-level (types generated correctly)[[kv_namespaces]]binding = "MY_STORAGE"id = "xxxxxxxxxxxx"
```
```
wrangler kv key list
```
```
--remote
```
```
# ❌ Shows local storage (likely empty)npx wrangler kv key list --binding=MY_KV# ✅ Shows remote/production datanpx wrangler kv key list --binding=MY_KV --remote
```
```
# ❌ Shows local storage (likely empty)npx wrangler kv key list --binding=MY_KV# ✅ Shows remote/production datanpx wrangler kv key list --binding=MY_KV --remote
```
```
wrangler dev
```
```
wrangler kv key
```
```
id
```
```
preview_id
```
```
cacheTtl
```
```
list_complete
```
```
keys.length
```
```
/* ❌ 429 error - too many writes to same key */for (const item of items) {  await env.KV.put('counter', String(count++))}/* ✅ Consolidate writes or use different keys */// Option 1: Single writeawait env.KV.put('counter', String(finalCount))// Option 2: Different keysawait env.KV.put(counter:${Date.now()}, value)
```
```
/* ❌ 429 error - too many writes to same key */for (const item of items) {  await env.KV.put('counter', String(count++))}/* ✅ Consolidate writes or use different keys */// Option 1: Single writeawait env.KV.put('counter', String(finalCount))// Option 2: Different keysawait env.KV.put(counter:${Date.now()}, value)
```
```
counter:${Date.now()}
```
```
/* ❌ Old boolean syntax */await env.KV.get(key, { returnMetadata: true })/* ✅ New enum syntax (V2) */await env.KV.get(key, { returnMetadata: 'all' })// Options: 'all' | 'indexed' | 'none'
```
```
/* ❌ Old boolean syntax */await env.KV.get(key, { returnMetadata: true })/* ✅ New enum syntax (V2) */await env.KV.get(key, { returnMetadata: 'all' })// Options: 'all' | 'indexed' | 'none'
```
```
/* ❌ Error: TTL too low */await env.KV.get(key, { cacheTtl: 30 })/* ✅ Minimum 60 seconds */await env.KV.get(key, { cacheTtl: 60 })
```
```
/* ❌ Error: TTL too low */await env.KV.get(key, { cacheTtl: 30 })/* ✅ Minimum 60 seconds */await env.KV.get(key, { cacheTtl: 60 })
```
```
/* ❌ Wrong pagination check */const result = await env.KV.list()if (result.keys.length === 0) { /* done */ }/* ✅ Use list_complete flag */let cursor: string | undefineddo {  const result = await env.KV.list({ cursor })  // Process result.keys...  cursor = result.list_complete ? undefined : result.cursor} while (cursor)
```
```
/* ❌ Wrong pagination check */const result = await env.KV.list()if (result.keys.length === 0) { /* done */ }/* ✅ Use list_complete flag */let cursor: string | undefineddo {  const result = await env.KV.list({ cursor })  // Process result.keys...  cursor = result.list_complete ? undefined : result.cursor} while (cursor)
```
```
/* ❌ Multiple operations (counts against limits) */await env.KV.get('key1')await env.KV.get('key2')await env.KV.get('key3')/* ✅ Bulk operations (counts as 1) */// For writes, use batch in wrangler or Workers KV API// Max 10,000 keys per bulk operation
```
```
/* ❌ Multiple operations (counts against limits) */await env.KV.get('key1')await env.KV.get('key2')await env.KV.get('key3')/* ✅ Bulk operations (counts as 1) */// For writes, use batch in wrangler or Workers KV API// Max 10,000 keys per bulk operation
```
```
/* ⚠️ Reads may be stale for ~60 seconds globally */await env.KV.put('key', 'value')const value = await env.KV.get('key') // May return old value!/* For strong consistency, use Durable Objects instead */
```
```
/* ⚠️ Reads may be stale for ~60 seconds globally */await env.KV.put('key', 'value')const value = await env.KV.get('key') // May return old value!/* For strong consistency, use Durable Objects instead */
```
```
returnMetadata: true
```
```
returnMetadata: 'all'
```
```
cacheTtl < 60
```
```
keys.length === 0
```
```
list_complete
```
Unlock the power of Cloudflare Workers Key-Value (KV) storage directly through your AI coding assistant. This skill streamlines interactions with Cloudflare's globally distributed, highly scalable KV store, enabling developers to quickly set up, manage, and retrieve data without the overhead of traditional databases. Ideal for caching, user preferences, or dynamic content, it provides a robust solution for serverless applications. Leverage this tool to enhance your Cloudflare Worker projects, automating common KV operations and accelerating your development workflow for lightning-fast edge computing.

# When to Use This Skill
- •Storing user preferences or session data for serverless applications.
- •Caching API responses or frequently accessed static content at the edge.
- •Managing feature flags or A/B testing configurations for immediate updates.
- •Implementing a simple dynamic content store for small, high-performance data.

# Pro Tips
- 💡Combine KV with Cloudflare R2 for a hybrid storage strategy, using KV for metadata and small, frequently accessed items, and R2 for larger objects.
- 💡Utilize the `wrangler` CLI for efficient namespace management and local development, ensuring seamless deployment to production.
- 💡Leverage the bulk reads API to retrieve up to 100 keys in a single operation, optimizing performance and reducing operational costs for data fetching.

