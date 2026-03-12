# Implement Rate Limiting
Source: https://antigravity.codes/workflows/production/implement-api-rate-limiting-upstash-redis

## AI Worker Instructions
When the user requests functionality related to Implement Rate Limiting, follow these guidelines and utilize this context.

## Scraped Content

# Implement Rate Limiting
```
npm install @upstash/ratelimit @upstash/redis
```
```
import { Ratelimit } from '@upstash/ratelimit';      const ratelimit = new Ratelimit({     redis,     limiter: Ratelimit.slidingWindow(10, '10 s')   });
```
```
import { Ratelimit } from '@upstash/ratelimit';      const ratelimit = new Ratelimit({     redis,     limiter: Ratelimit.slidingWindow(10, '10 s')   });
```
```
const { success } = await ratelimit.limit(ip);   if (!success) return Response.json({ error: 'Too many requests' }, { status: 429 });
```
```
const { success } = await ratelimit.limit(ip);   if (!success) return Response.json({ error: 'Too many requests' }, { status: 429 });
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as implement-api-rate-limiting-upstash-redis.md
```
implement-api-rate-limiting-upstash-redis.md
```
- In Antigravity, type /implement_api_rate_limiting_upstash_redis or just describe what you want to do
```
/implement_api_rate_limiting_upstash_redis
```
Learn more about workflows →

# Related Workflows

# Secure API from CSRF

# Security Hardening Checklist

# Setup RBAC

