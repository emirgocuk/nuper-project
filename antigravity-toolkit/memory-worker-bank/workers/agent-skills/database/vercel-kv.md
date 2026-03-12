# vercel-kv
Source: https://antigravity.codes/agent-skills/database/vercel-kv

## AI Worker Instructions
When the user requests functionality related to vercel-kv, follow these guidelines and utilize this context.

## Scraped Content

# vercel-kv
```
# Create KV: Vercel Dashboard → Storage → KVvercel env pull .env.local  # Creates KV_REST_API_URL and KV_REST_API_TOKENnpm install @vercel/kv
```
```
# Create KV: Vercel Dashboard → Storage → KVvercel env pull .env.local  # Creates KV_REST_API_URL and KV_REST_API_TOKENnpm install @vercel/kv
```
```
import { kv } from '@vercel/kv';// Set with TTL (expires in 1 hour)await kv.setex('session:abc', 3600, { userId: 123 });// Getconst session = await kv.get('session:abc');// Increment counter (atomic)const views = await kv.incr('views:post:123');
```
```
import { kv } from '@vercel/kv';// Set with TTL (expires in 1 hour)await kv.setex('session:abc', 3600, { userId: 123 });// Getconst session = await kv.get('session:abc');// Increment counter (atomic)const views = await kv.incr('views:post:123');
```
```
user:123
```
```
123
```
```
const cached = await kv.get(post:${slug});if (cached) return cached;const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });await kv.setex(post:${slug}, 3600, post); // Cache 1 hourreturn post;
```
```
const cached = await kv.get(post:${slug});if (cached) return cached;const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });await kv.setex(post:${slug}, 3600, post); // Cache 1 hourreturn post;
```
```
post:${slug}
```
```
post:${slug}
```
```
async function checkRateLimit(ip: string): Promise<boolean> {  const key = ratelimit:${ip};  const current = await kv.incr(key);  if (current === 1) await kv.expire(key, 60); // 60s window  return current <= 10; // 10 requests per window}
```
```
async function checkRateLimit(ip: string): Promise<boolean> {  const key = ratelimit:${ip};  const current = await kv.incr(key);  if (current === 1) await kv.expire(key, 60); // 60s window  return current <= 10; // 10 requests per window}
```
```
ratelimit:${ip}
```
```
const sessionId = crypto.randomUUID();await kv.setex(session:${sessionId}, 7 * 24 * 3600, { userId });
```
```
const sessionId = crypto.randomUUID();await kv.setex(session:${sessionId}, 7 * 24 * 3600, { userId });
```
```
session:${sessionId}
```
```
const pipeline = kv.pipeline();pipeline.set('user:1', data);pipeline.incr('counter');const results = await pipeline.exec(); // Single round-trip
```
```
const pipeline = kv.pipeline();pipeline.set('user:1', data);pipeline.incr('counter');const results = await pipeline.exec(); // Single round-trip
```
```
user:123
```
```
post:abc:views
```
```
ratelimit:ip:endpoint
```
```
setex
```
```
set
```
```
user:123
```
```
123
```
```
Error: KV_REST_API_URL is not defined
```
```
KV_REST_API_TOKEN is not defined
```
```
@vercel/kv
```
```
vercel env pull .env.local
```
```
.env.local
```
```
.gitignore
```
```
turbo.json
```
```
{ "pipeline": { "build": { "env": ["KV_REST_API_URL", "KV_REST_API_TOKEN"] } } }
```
```
TypeError: Do not know how to serialize a BigInt
```
```
hset()
```
```
hset()
```
```
'123456'
```
```
hgetall()
```
```
'code_123456'
```
```
String(value.field)
```
```
hgetall()
```
```
cache
```
```
data
```
```
temp
```
```
feature:id:type
```
```
set()
```
```
setex()
```
```
setex(key, ttl, value)
```
```
Error: Rate limit exceeded
```
```
Error: Value too large
```
```
kv.get<T>()
```
```
null
```
```
kv.get()
```
```
unknown
```
```
kv.get<T>()
```
```
null
```
```
get()
```
```
const rawData = await kv.get('key'); const data = rawData as MyType | null;
```
```
pipeline.exec()
```
```
number
```
```
string
```
```
scan()
```
```
string
```
```
number
```
```
count
```
```
let cursor: string = "0"
```
```
cursor !== "0"
```
```
!== 0
```
```
expire(key, newTTL)
```
```
for await
```
```
kv.scanIterator()
```
```
sscanIterator()
```
```
scan()
```
```
scanIterator()
```
```
// Don't use scanIterator() - it hangs in v2.0.0+for await (const key of kv.scanIterator()) {  // This loop never terminates}// Use manual scan with cursor insteadlet cursor: string = "0"; // v3.x uses stringdo {  const [newCursor, keys] = await kv.scan(cursor);  cursor = newCursor;  for (const key of keys) {    const value = await kv.get(key);    // process key/value  }} while (cursor !== "0");
```
```
// Don't use scanIterator() - it hangs in v2.0.0+for await (const key of kv.scanIterator()) {  // This loop never terminates}// Use manual scan with cursor insteadlet cursor: string = "0"; // v3.x uses stringdo {  const [newCursor, keys] = await kv.scan(cursor);  cursor = newCursor;  for (const key of keys) {    const value = await kv.get(key);    // process key/value  }} while (cursor !== "0");
```
```
kv.zrange(key, 0, -1, { rev: true })
```
```
rev
```
```
rev
```
```
zrevrange()
```
```
// This sometimes returns empty array (BUG)const chats = await kv.zrange(user:chat:${userId}, 0, -1, { rev: true });// [] - but CLI shows 12 items// Workaround 1: Omit rev flag and reverse in-memoryconst chats = await kv.zrange(user:chat:${userId}, 0, -1);const reversedChats = chats.reverse();// Workaround 2: Use zrevrange insteadconst chats = await kv.zrevrange(user:chat:${userId}, 0, -1);
```
```
// This sometimes returns empty array (BUG)const chats = await kv.zrange(user:chat:${userId}, 0, -1, { rev: true });// [] - but CLI shows 12 items// Workaround 1: Omit rev flag and reverse in-memoryconst chats = await kv.zrange(user:chat:${userId}, 0, -1);const reversedChats = chats.reverse();// Workaround 2: Use zrevrange insteadconst chats = await kv.zrevrange(user:chat:${userId}, 0, -1);
```
```
user:chat:${userId}
```
```
user:chat:${userId}
```
```
user:chat:${userId}
```
```
kv.get()
```
```
null
```
```
unstable_noStore()
```
```
cache: 'no-store'
```
```
import { unstable_noStore as noStore } from 'next/cache';export async function getData() {  noStore(); // Force dynamic rendering  const data = await kv.get('mykey');  return data; // Now returns correct value on first call}// Or add retry logicasync function getWithRetry(key: string, retries = 2) {  let data = await kv.get(key);  let attempt = 0;  while (!data && attempt < retries) {    await new Promise(r => setTimeout(r, 100));    data = await kv.get(key);    attempt++;  }  return data;}
```
```
import { unstable_noStore as noStore } from 'next/cache';export async function getData() {  noStore(); // Force dynamic rendering  const data = await kv.get('mykey');  return data; // Now returns correct value on first call}// Or add retry logicasync function getWithRetry(key: string, retries = 2) {  let data = await kv.get(key);  let attempt = 0;  while (!data && attempt < retries) {    await new Promise(r => setTimeout(r, 100));    data = await kv.get(key);    attempt++;  }  return data;}
```
```
Uncaught ReferenceError: process is not defined
```
```
@vercel/kv
```
```
process.env
```
```
@vercel/kv
```
```
process.env
```
```
define
```
```
createClient
```
```
import.meta.env
```
```
vite-plugin-node-polyfills
```
```
// Option 1: Vite config with define// vite.config.tsimport { defineConfig, loadEnv } from 'vite';export default defineConfig(({ mode }) => {  const env = loadEnv(mode, process.cwd(), '');  return {    define: {      'process.env.KV_REST_API_URL': JSON.stringify(env.KV_REST_API_URL),      'process.env.KV_REST_API_TOKEN': JSON.stringify(env.KV_REST_API_TOKEN),    },  };});// Option 2: Use createClient with import.meta.envimport { createClient } from '@vercel/kv';const kv = createClient({  url: import.meta.env.VITE_KV_REST_API_URL,  token: import.meta.env.VITE_KV_REST_API_TOKEN,});
```
```
// Option 1: Vite config with define// vite.config.tsimport { defineConfig, loadEnv } from 'vite';export default defineConfig(({ mode }) => {  const env = loadEnv(mode, process.cwd(), '');  return {    define: {      'process.env.KV_REST_API_URL': JSON.stringify(env.KV_REST_API_URL),      'process.env.KV_REST_API_TOKEN': JSON.stringify(env.KV_REST_API_TOKEN),    },  };});// Option 2: Use createClient with import.meta.envimport { createClient } from '@vercel/kv';const kv = createClient({  url: import.meta.env.VITE_KV_REST_API_URL,  token: import.meta.env.VITE_KV_REST_API_TOKEN,});
```
```
kv.get()
```
```
unstable_noStore()
```
```
// In Server Actions'use server'import { unstable_noStore as noStore } from 'next/cache';export async function logChat(text: string) {  noStore(); // Force dynamic rendering  let n_usage = await kv.get('n_usage');  // Now returns fresh value, not cached}// Or use route handlers (automatically dynamic)// app/api/chat/route.tsexport async function GET() {  let n_usage = await kv.get('n_usage'); // Fresh data  return Response.json({ n_usage });}
```
```
// In Server Actions'use server'import { unstable_noStore as noStore } from 'next/cache';export async function logChat(text: string) {  noStore(); // Force dynamic rendering  let n_usage = await kv.get('n_usage');  // Now returns fresh value, not cached}// Or use route handlers (automatically dynamic)// app/api/chat/route.tsexport async function GET() {  let n_usage = await kv.get('n_usage'); // Fresh data  return Response.json({ n_usage });}
```
```
string
```
```
number
```
```
cursor !== 0
```
```
cursor !== "0"
```
```
// v2.xlet cursor: number = 0;do {  const [newCursor, keys] = await kv.scan(cursor);  cursor = newCursor;} while (cursor !== 0);// v3.xlet cursor: string = "0";do {  const [newCursor, keys] = await kv.scan(cursor);  cursor = newCursor;} while (cursor !== "0");
```
```
// v2.xlet cursor: number = 0;do {  const [newCursor, keys] = await kv.scan(cursor);  cursor = newCursor;} while (cursor !== 0);// v3.xlet cursor: string = "0";do {  const [newCursor, keys] = await kv.scan(cursor);  cursor = newCursor;} while (cursor !== "0");
```
```
enableAutoPipelining: false
```
```
// If auto-pipelining causes issues, disable it:import { createClient } from '@vercel/kv';const kv = createClient({  url: process.env.KV_REST_API_URL,  token: process.env.KV_REST_API_TOKEN,  enableAutoPipelining: false // Disable auto-pipelining});
```
```
// If auto-pipelining causes issues, disable it:import { createClient } from '@vercel/kv';const kv = createClient({  url: process.env.KV_REST_API_URL,  token: process.env.KV_REST_API_TOKEN,  enableAutoPipelining: false // Disable auto-pipelining});
```
```
scanIterator()
```
```
@vercel/kv
```
```
@upstash/redis
```
```
// @vercel/kv doesn't have stream methods// await kv.xAdd(...) // TypeError: kv.xAdd is not a function// Use Upstash Redis client directlyimport { Redis } from '@upstash/redis';const redis = new Redis({  url: process.env.KV_REST_API_URL!,  token: process.env.KV_REST_API_TOKEN!,});await redis.xadd('stream:events', '*', { event: 'user.login' });const messages = await redis.xread('stream:events', '0');
```
```
// @vercel/kv doesn't have stream methods// await kv.xAdd(...) // TypeError: kv.xAdd is not a function// Use Upstash Redis client directlyimport { Redis } from '@upstash/redis';const redis = new Redis({  url: process.env.KV_REST_API_URL!,  token: process.env.KV_REST_API_TOKEN!,});await redis.xadd('stream:events', '*', { event: 'user.login' });const messages = await redis.xread('stream:events', '0');
```
```
kv.hgetall()
```
```
await kv.hset('foobar', { '1834': 'https://example.com' });const data = await kv.hgetall('foobar');console.log(typeof data); // "object" not "string"// It's already an object - use directlyconsole.log(data['1834']); // 'https://example.com'// If you need JSON stringconst jsonString = JSON.stringify(data);
```
```
await kv.hset('foobar', { '1834': 'https://example.com' });const data = await kv.hgetall('foobar');console.log(typeof data); // "object" not "string"// It's already an object - use directlyconsole.log(data['1834']); // 'https://example.com'// If you need JSON stringconst jsonString = JSON.stringify(data);
```
```
const lockKey = lock:${resource};const lockValue = crypto.randomUUID();const acquired = await kv.setnx(lockKey, lockValue);if (acquired) {  await kv.expire(lockKey, 10); // TTL prevents deadlock  try {    await processOrders();  } finally {    const current = await kv.get(lockKey);    if (current === lockValue) await kv.del(lockKey);  }}
```
```
const lockKey = lock:${resource};const lockValue = crypto.randomUUID();const acquired = await kv.setnx(lockKey, lockValue);if (acquired) {  await kv.expire(lockKey, 10); // TTL prevents deadlock  try {    await processOrders();  } finally {    const current = await kv.get(lockKey);    if (current === lockValue) await kv.del(lockKey);  }}
```
```
lock:${resource}
```
```
await kv.zadd('leaderboard', { score, member: userId.toString() });// Note: zrange with { rev: true } has a known bug (Issue #12)// Use zrevrange instead for reliabilityconst top = await kv.zrevrange('leaderboard', 0, 9, { withScores: true });const rank = await kv.zrevrank('leaderboard', userId.toString());
```
```
await kv.zadd('leaderboard', { score, member: userId.toString() });// Note: zrange with { rev: true } has a known bug (Issue #12)// Use zrevrange instead for reliabilityconst top = await kv.zrevrange('leaderboard', 0, 9, { withScores: true });const rank = await kv.zrevrank('leaderboard', userId.toString());
```
Empower your AI coding assistant with the Vercel KV Agent Skill, providing seamless integration with a high-performance, Redis-compatible key-value store. This skill is crucial for AI agents operating in serverless environments, enabling them to handle state management, implement robust caching strategies, and enforce request rate limits with ease. By leveraging Vercel KV, agents can access fast, persistent data, significantly improving their efficiency and responsiveness for dynamic web applications and backend services.

# When to Use This Skill
- •Implementing fast caching strategies for frequently accessed data to reduce database load and improve response times.
- •Developing robust rate limiting mechanisms for API endpoints to prevent abuse and ensure fair usage.
- •Managing user sessions or temporary state for stateless serverless functions or web applications.
- •Creating atomic counters for analytics, voting systems, or feature toggles.

# Pro Tips
- 💡Always use namespaced keys (e.g., `user:123`, `post:slug`) to prevent key collisions, organize data logically, and improve maintainability.
- 💡Leverage TTL (`setex`, `expire`) for all temporary data like caches and sessions to automatically manage data lifecycle, reduce storage costs, and ensure data freshness.
- 💡Utilize Vercel KV's atomic operations (e.g., `incr`, `decr`) for counters or other concurrent updates to ensure data integrity without complex locking mechanisms.

