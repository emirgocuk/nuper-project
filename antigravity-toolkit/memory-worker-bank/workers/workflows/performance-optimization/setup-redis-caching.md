# Setup Redis Caching
Source: https://antigravity.codes/workflows/performance-optimization/setup-redis-caching-ioredis-performance

## AI Worker Instructions
When the user requests functionality related to Setup Redis Caching, follow these guidelines and utilize this context.

## Scraped Content

# Setup Redis Caching
```
npm install @upstash/redis
```
```
import { Redis } from '@upstash/redis';      const redis = new Redis({     url: process.env.UPSTASH_REDIS_REST_URL!,     token: process.env.UPSTASH_REDIS_REST_TOKEN!,   });      // Usage   await redis.set('key', 'value', { ex: 300 });   const value = await redis.get('key');
```
```
import { Redis } from '@upstash/redis';      const redis = new Redis({     url: process.env.UPSTASH_REDIS_REST_URL!,     token: process.env.UPSTASH_REDIS_REST_TOKEN!,   });      // Usage   await redis.set('key', 'value', { ex: 300 });   const value = await redis.get('key');
```
```
npm install ioredis
```
```
import Redis from 'ioredis';   const redis = new Redis(process.env.REDIS_URL);
```
```
import Redis from 'ioredis';   const redis = new Redis(process.env.REDIS_URL);
```
```
export async function getCachedUser(id: string) {     const cacheKey = user:${id};     const cached = await redis.get(cacheKey);     if (cached) return cached;          const user = await db.user.findUnique({ where: { id } });     await redis.set(cacheKey, JSON.stringify(user), { ex: 600 }); // 10 mins     return user;   }
```
```
export async function getCachedUser(id: string) {     const cacheKey = user:${id};     const cached = await redis.get(cacheKey);     if (cached) return cached;          const user = await db.user.findUnique({ where: { id } });     await redis.set(cacheKey, JSON.stringify(user), { ex: 600 }); // 10 mins     return user;   }
```
```
user:${id}
```
```
@upstash/redis
```
```
hset
```
```
hgetall
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-redis-caching-ioredis-performance.md
```
setup-redis-caching-ioredis-performance.md
```
- In Antigravity, type /setup_redis_caching_ioredis_performance or just describe what you want to do
```
/setup_redis_caching_ioredis_performance
```
Learn more about workflows →

# Related Workflows

# Setup Incremental Static Regeneration

# Optimize Images for Web

# Implement Request Deduplication

