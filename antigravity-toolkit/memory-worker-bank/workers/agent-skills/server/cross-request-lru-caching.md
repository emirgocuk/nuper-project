# Cross-Request LRU Caching
Source: https://antigravity.codes/agent-skills/server/server-cache-lru

## AI Worker Instructions
When the user requests functionality related to Cross-Request LRU Caching, follow these guidelines and utilize this context.

## Scraped Content

# Cross-Request LRU Caching
```
React.cache()
```
```
import { LRUCache } from 'lru-cache'const cache = new LRUCache<string, any>({  max: 1000,  ttl: 5 * 60 * 1000  // 5 minutes})export async function getUser(id: string) {  const cached = cache.get(id)  if (cached) return cached  const user = await db.user.findUnique({ where: { id } })  cache.set(id, user)  return user}// Request 1: DB query, result cached// Request 2: cache hit, no DB query
```
```
import { LRUCache } from 'lru-cache'const cache = new LRUCache<string, any>({  max: 1000,  ttl: 5 * 60 * 1000  // 5 minutes})export async function getUser(id: string) {  const cached = cache.get(id)  if (cached) return cached  const user = await db.user.findUnique({ where: { id } })  cache.set(id, user)  return user}// Request 1: DB query, result cached// Request 2: cache hit, no DB query
```

