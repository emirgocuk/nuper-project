# hono-routing
Source: https://antigravity.codes/agent-skills/backend/hono-routing

## AI Worker Instructions
When the user requests functionality related to hono-routing, follow these guidelines and utilize this context.

## Scraped Content

# hono-routing
```
npm install hono@4.11.4
```
```
npm install hono@4.11.4
```
```
import { Hono } from 'hono'const app = new Hono()app.get('/', (c) => {  return c.json({ message: 'Hello Hono!' })})export default app
```
```
import { Hono } from 'hono'const app = new Hono()app.get('/', (c) => {  return c.json({ message: 'Hello Hono!' })})export default app
```
```
c.json()
```
```
c.text()
```
```
c.html()
```
```
res.send()
```
```
npm install zod@4.3.5 @hono/zod-validator@0.7.6
```
```
npm install zod@4.3.5 @hono/zod-validator@0.7.6
```
```
import { zValidator } from '@hono/zod-validator'import { z } from 'zod'const schema = z.object({  name: z.string(),  age: z.number(),})app.post('/user', zValidator('json', schema), (c) => {  const data = c.req.valid('json')  return c.json({ success: true, data })})
```
```
import { zValidator } from '@hono/zod-validator'import { z } from 'zod'const schema = z.object({  name: z.string(),  age: z.number(),})app.post('/user', zValidator('json', schema), (c) => {  const data = c.req.valid('json')  return c.json({ success: true, data })})
```
```
// Single parameterapp.get('/users/:id', (c) => {  const id = c.req.param('id')  return c.json({ userId: id })})// Multiple parametersapp.get('/posts/:postId/comments/:commentId', (c) => {  const { postId, commentId } = c.req.param()  return c.json({ postId, commentId })})// Optional parameters (using wildcards)app.get('/files/*', (c) => {  const path = c.req.param('*')  return c.json({ filePath: path })})
```
```
// Single parameterapp.get('/users/:id', (c) => {  const id = c.req.param('id')  return c.json({ userId: id })})// Multiple parametersapp.get('/posts/:postId/comments/:commentId', (c) => {  const { postId, commentId } = c.req.param()  return c.json({ postId, commentId })})// Optional parameters (using wildcards)app.get('/files/*', (c) => {  const path = c.req.param('*')  return c.json({ filePath: path })})
```
```
c.req.param('name')
```
```
c.req.param()
```
```
// Only matches numeric IDsapp.get('/users/:id{[0-9]+}', (c) => {  const id = c.req.param('id') // Guaranteed to be digits  return c.json({ userId: id })})// Only matches UUIDsapp.get('/posts/:id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}', (c) => {  const id = c.req.param('id') // Guaranteed to be UUID format  return c.json({ postId: id })})
```
```
// Only matches numeric IDsapp.get('/users/:id{[0-9]+}', (c) => {  const id = c.req.param('id') // Guaranteed to be digits  return c.json({ userId: id })})// Only matches UUIDsapp.get('/posts/:id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}', (c) => {  const id = c.req.param('id') // Guaranteed to be UUID format  return c.json({ postId: id })})
```
```
app.get('/search', (c) => {  // Single query param  const q = c.req.query('q')  // Multiple query params  const { page, limit } = c.req.query()  // Query param array (e.g., ?tag=js&tag=ts)  const tags = c.req.queries('tag')  return c.json({ q, page, limit, tags })})
```
```
app.get('/search', (c) => {  // Single query param  const q = c.req.query('q')  // Multiple query params  const { page, limit } = c.req.query()  // Query param array (e.g., ?tag=js&tag=ts)  const tags = c.req.queries('tag')  return c.json({ q, page, limit, tags })})
```
```
// Create sub-appconst api = new Hono()api.get('/users', (c) => c.json({ users: [] }))api.get('/posts', (c) => c.json({ posts: [] }))// Mount sub-appconst app = new Hono()app.route('/api', api)// Result: /api/users, /api/posts
```
```
// Create sub-appconst api = new Hono()api.get('/users', (c) => c.json({ users: [] }))api.get('/posts', (c) => c.json({ posts: [] }))// Mount sub-appconst app = new Hono()app.route('/api', api)// Result: /api/users, /api/posts
```
```
await next()
```
```
next()
```
```
c.error
```
```
next()
```
```
app.use('/admin/*', async (c, next) => {  const token = c.req.header('Authorization')  if (!token) return c.json({ error: 'Unauthorized' }, 401)  await next() // Required!})
```
```
app.use('/admin/*', async (c, next) => {  const token = c.req.header('Authorization')  if (!token) return c.json({ error: 'Unauthorized' }, 401)  await next() // Required!})
```
```
import { Hono } from 'hono'import { logger } from 'hono/logger'import { cors } from 'hono/cors'import { prettyJSON } from 'hono/pretty-json'import { compress } from 'hono/compress'import { cache } from 'hono/cache'const app = new Hono()// Request loggingapp.use('*', logger())// CORSapp.use('/api/*', cors({  origin: 'https://example.com',  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],  allowHeaders: ['Content-Type', 'Authorization'],}))// Pretty JSON (dev only)app.use('*', prettyJSON())// Compression (gzip/deflate)app.use('*', compress())// Cache responsesapp.use(  '/static/*',  cache({    cacheName: 'my-app',    cacheControl: 'max-age=3600',  }))
```
```
import { Hono } from 'hono'import { logger } from 'hono/logger'import { cors } from 'hono/cors'import { prettyJSON } from 'hono/pretty-json'import { compress } from 'hono/compress'import { cache } from 'hono/cache'const app = new Hono()// Request loggingapp.use('*', logger())// CORSapp.use('/api/*', cors({  origin: 'https://example.com',  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],  allowHeaders: ['Content-Type', 'Authorization'],}))// Pretty JSON (dev only)app.use('*', prettyJSON())// Compression (gzip/deflate)app.use('*', compress())// Cache responsesapp.use(  '/static/*',  cache({    cacheName: 'my-app',    cacheControl: 'max-age=3600',  }))
```
```
const cache = new Map<string, Response>()const customCache = async (c, next) => {  const key = c.req.url  // Check cache  const cached = cache.get(key)  if (cached) {    return cached.clone() // Clone when returning from cache  }  // Execute handler  await next()  // Store in cache (must clone!)  cache.set(key, c.res.clone()) // ✅ Clone before storing}app.use('*', customCache)
```
```
const cache = new Map<string, Response>()const customCache = async (c, next) => {  const key = c.req.url  // Check cache  const cached = cache.get(key)  if (cached) {    return cached.clone() // Clone when returning from cache  }  // Execute handler  await next()  // Store in cache (must clone!)  cache.set(key, c.res.clone()) // ✅ Clone before storing}app.use('*', customCache)
```
```
**Built-in Middleware Reference**: See references/middleware-catalog.md#### Streaming Helpers (SSE, AI Responses)
```
```
**Built-in Middleware Reference**: See references/middleware-catalog.md#### Streaming Helpers (SSE, AI Responses)
```
```
references/middleware-catalog.md
```
```
**Use Cases:**- stream() - Binary files, video, audio- streamText() - AI chat responses, typewriter effects- streamSSE() - Real-time notifications, live feeds#### WebSocket Helper
```
```
**Use Cases:**- stream() - Binary files, video, audio- streamText() - AI chat responses, typewriter effects- streamSSE() - Real-time notifications, live feeds#### WebSocket Helper
```
```
stream()
```
```
streamText()
```
```
streamSSE()
```
```
Message: ${event.data}
```
```
Echo: ${event.data}
```
```
**⚠️ Cloudflare Workers WebSocket Caveats:**- Import from hono/cloudflare-workers (not hono/ws)- onOpen callback is **NOT supported** (Cloudflare limitation)- CORS/header-modifying middleware conflicts with WebSocket routes- Use route grouping to exclude WebSocket routes from CORS:
```
```
**⚠️ Cloudflare Workers WebSocket Caveats:**- Import from hono/cloudflare-workers (not hono/ws)- onOpen callback is **NOT supported** (Cloudflare limitation)- CORS/header-modifying middleware conflicts with WebSocket routes- Use route grouping to exclude WebSocket routes from CORS:
```
```
hono/cloudflare-workers
```
```
hono/ws
```
```
onOpen
```
```
#### Security Middleware
```
```
#### Security Middleware
```
```
**Security Middleware Options:**| Middleware | Purpose ||------------|---------|| secureHeaders | X-Frame-Options, CSP, HSTS, XSS protection || csrf | CSRF via Origin/Sec-Fetch-Site validation || bearerAuth | Bearer token authentication || basicAuth | HTTP Basic authentication || ipRestriction | IP allowlist/blocklist |#### Combine MiddlewareCompose middleware with conditional logic:
```
```
**Security Middleware Options:**| Middleware | Purpose ||------------|---------|| secureHeaders | X-Frame-Options, CSP, HSTS, XSS protection || csrf | CSRF via Origin/Sec-Fetch-Site validation || bearerAuth | Bearer token authentication || basicAuth | HTTP Basic authentication || ipRestriction | IP allowlist/blocklist |#### Combine MiddlewareCompose middleware with conditional logic:
```
```
secureHeaders
```
```
csrf
```
```
bearerAuth
```
```
basicAuth
```
```
ipRestriction
```
```
---### Part 3: Type-Safe Context Extension#### Using c.set() and c.get()
```
```
---### Part 3: Type-Safe Context Extension#### Using c.set() and c.get()
```
```
**CRITICAL:**- Define Variables type for type-safe c.get()- Define Bindings type for environment variables (Cloudflare Workers)- c.set() in middleware, c.get() in handlers#### Custom Context Extension
```
```
**CRITICAL:**- Define Variables type for type-safe c.get()- Define Bindings type for environment variables (Cloudflare Workers)- c.set() in middleware, c.get() in handlers#### Custom Context Extension
```
```
Variables
```
```
c.get()
```
```
Bindings
```
```
c.set()
```
```
c.get()
```
```
[INFO] ${msg}
```
```
[ERROR] ${msg}
```
```
**Advanced Pattern**: See templates/context-extension.ts---### Part 4: Request Validation#### Validation with Zod
```
```
**Advanced Pattern**: See templates/context-extension.ts---### Part 4: Request Validation#### Validation with Zod
```
```
templates/context-extension.ts
```
```

```
```

```
```
**CRITICAL:**- **Always use c.req.valid()** after validation (type-safe)- Validation targets: json, query, param, header, form, cookie- Use z.transform() to convert strings to numbers/dates- Validation errors return 400 automatically**⚠️ CRITICAL: Validation Must Be Handler-Specific**For validated types to be inferred correctly, validation middleware **must be added in the handler**, not via app.use():
```
```
**CRITICAL:**- **Always use c.req.valid()** after validation (type-safe)- Validation targets: json, query, param, header, form, cookie- Use z.transform() to convert strings to numbers/dates- Validation errors return 400 automatically**⚠️ CRITICAL: Validation Must Be Handler-Specific**For validated types to be inferred correctly, validation middleware **must be added in the handler**, not via app.use():
```
```
c.req.valid()
```
```
json
```
```
query
```
```
param
```
```
header
```
```
form
```
```
cookie
```
```
z.transform()
```
```
app.use()
```
```
**Why It Happens:**Hono's Input type mapping merges validation results using generics. When validators are applied via app.use(), the type system cannot track which routes have which validation schemas, causing the Input generic to collapse to never.#### Custom Validation Hooks
```
```
**Why It Happens:**Hono's Input type mapping merges validation results using generics. When validators are applied via app.use(), the type system cannot track which routes have which validation schemas, causing the Input generic to collapse to never.#### Custom Validation Hooks
```
```
Input
```
```
app.use()
```
```
Input
```
```
never
```
```
**Note on Zod Optional Enums:**Prior to @hono/zod-validator@0.7.6, optional enums incorrectly resolved to strings instead of the enum type. This was fixed in v0.7.6. Ensure you're using the latest version:
```
```
**Note on Zod Optional Enums:**Prior to @hono/zod-validator@0.7.6, optional enums incorrectly resolved to strings instead of the enum type. This was fixed in v0.7.6. Ensure you're using the latest version:
```
```
@hono/zod-validator@0.7.6
```
```
#### Validation with Valibot
```
```
#### Validation with Valibot
```
```

```
```

```
```
**Zod vs Valibot**: See references/validation-libraries.md#### Validation with Typia
```
```
**Zod vs Valibot**: See references/validation-libraries.md#### Validation with Typia
```
```
references/validation-libraries.md
```
```

```
```

```
```
**Why Typia:**- Fastest validation (compile-time)- No runtime schema definition- AOT (Ahead-of-Time) compilation#### Validation with ArkType
```
```
**Why Typia:**- Fastest validation (compile-time)- No runtime schema definition- AOT (Ahead-of-Time) compilation#### Validation with ArkType
```
```

```
```

```
```
**Comparison**: See references/validation-libraries.md for detailed comparison---### Part 5: Typed Routes (RPC)#### Why RPC?Hono's RPC feature allows **type-safe client/server communication** without manual API type definitions. The client infers types directly from the server routes.#### Server-Side Setup
```
```
**Comparison**: See references/validation-libraries.md for detailed comparison---### Part 5: Typed Routes (RPC)#### Why RPC?Hono's RPC feature allows **type-safe client/server communication** without manual API type definitions. The client infers types directly from the server routes.#### Server-Side Setup
```
```
references/validation-libraries.md
```
```
**CRITICAL:**- **Must use const route = app.get(...) for RPC type inference**- Export typeof route or typeof app- Don't use anonymous route definitions#### Client-Side Setup
```
```
**CRITICAL:**- **Must use const route = app.get(...) for RPC type inference**- Export typeof route or typeof app- Don't use anonymous route definitions#### Client-Side Setup
```
```
const route = app.get(...)
```
```
typeof route
```
```
typeof app
```
```
**Why RPC:**- ✅ Full type inference (request + response)- ✅ No manual type definitions- ✅ Compile-time error checking- ✅ Auto-complete in IDE**⚠️ RPC Type Inference Limitation:**The RPC client only infers types for json and text responses. If an endpoint returns multiple response types (e.g., JSON and binary), **none** of the responses will be type-inferred:
```
```
**Why RPC:**- ✅ Full type inference (request + response)- ✅ No manual type definitions- ✅ Compile-time error checking- ✅ Auto-complete in IDE**⚠️ RPC Type Inference Limitation:**The RPC client only infers types for json and text responses. If an endpoint returns multiple response types (e.g., JSON and binary), **none** of the responses will be type-inferred:
```
```
json
```
```
text
```
```
#### RPC with Multiple Routes
```
```
#### RPC with Multiple Routes
```
```
#### RPC Performance Optimization**Problem**: Large apps with many routes cause slow type inference**Solution**: Export specific route groups instead of entire app
```
```
#### RPC Performance Optimization**Problem**: Large apps with many routes cause slow type inference**Solution**: Export specific route groups instead of entire app
```
```
**Deep Dive**: See references/rpc-guide.md---### Part 6: Error Handling#### HTTPException
```
```
**Deep Dive**: See references/rpc-guide.md---### Part 6: Error Handling#### HTTPException
```
```
references/rpc-guide.md
```
```
**CRITICAL:**- Use HTTPException for **expected errors** (400, 401, 403, 404)- Don't use for **unexpected errors** (500) - use onError instead- HTTPException stops execution immediately#### Global Error Handler (onError)
```
```
**CRITICAL:**- Use HTTPException for **expected errors** (400, 401, 403, 404)- Don't use for **unexpected errors** (500) - use onError instead- HTTPException stops execution immediately#### Global Error Handler (onError)
```
```
onError
```
```
**Why onError:**- Centralized error handling- Consistent error responses- Error logging and tracking#### Middleware Error Checking
```
```
**Why onError:**- Centralized error handling- Consistent error responses- Error logging and tracking#### Middleware Error Checking
```
```
#### Not Found Handler
```
```
#### Not Found Handler
```
```
---## Critical Rules### Always Do✅ **Call await next() in middleware** - Required for middleware chain execution✅ **Return Response from handlers** - Use c.json(), c.text(), c.html()✅ **Use c.req.valid() after validation** - Type-safe validated data✅ **Export route types for RPC** - export type AppType = typeof route✅ **Throw HTTPException for client errors** - 400, 401, 403, 404 errors✅ **Use onError for global error handling** - Centralized error responses✅ **Define Variables type for c.set/c.get** - Type-safe context variables✅ **Use const route = app.get(...)** - Required for RPC type inference### Never Do❌ **Forget await next() in middleware** - Breaks middleware chain❌ **Use res.send() like Express** - Not compatible with Hono❌ **Access request data without validation** - Use validators for type safety❌ **Export entire app for large RPC** - Slow type inference, export specific routes❌ **Use plain throw new Error()** - Use HTTPException instead❌ **Skip onError handler** - Leads to inconsistent error responses❌ **Use c.set/c.get without Variables type** - Loses type safety---## Known Issues PreventionThis skill prevents **10** documented issues:### Issue #1: RPC Type Inference Slow**Error**: IDE becomes slow with many routes (8-minute CI builds, non-existent IntelliSense)**Source**: [hono/docs/guides/rpc](https://hono.dev/docs/guides/rpc) | [GitHub Issue #3869](https://github.com/honojs/hono/issues/3869)**Why It Happens**: Complex type instantiation from typeof app with many routes. Exacerbated by Zod methods like omit, extend, pick.**Prevention**: Export specific route groups instead of entire app
```
```
---## Critical Rules### Always Do✅ **Call await next() in middleware** - Required for middleware chain execution✅ **Return Response from handlers** - Use c.json(), c.text(), c.html()✅ **Use c.req.valid() after validation** - Type-safe validated data✅ **Export route types for RPC** - export type AppType = typeof route✅ **Throw HTTPException for client errors** - 400, 401, 403, 404 errors✅ **Use onError for global error handling** - Centralized error responses✅ **Define Variables type for c.set/c.get** - Type-safe context variables✅ **Use const route = app.get(...)** - Required for RPC type inference### Never Do❌ **Forget await next() in middleware** - Breaks middleware chain❌ **Use res.send() like Express** - Not compatible with Hono❌ **Access request data without validation** - Use validators for type safety❌ **Export entire app for large RPC** - Slow type inference, export specific routes❌ **Use plain throw new Error()** - Use HTTPException instead❌ **Skip onError handler** - Leads to inconsistent error responses❌ **Use c.set/c.get without Variables type** - Loses type safety---## Known Issues PreventionThis skill prevents **10** documented issues:### Issue #1: RPC Type Inference Slow**Error**: IDE becomes slow with many routes (8-minute CI builds, non-existent IntelliSense)**Source**: [hono/docs/guides/rpc](https://hono.dev/docs/guides/rpc) | [GitHub Issue #3869](https://github.com/honojs/hono/issues/3869)**Why It Happens**: Complex type instantiation from typeof app with many routes. Exacerbated by Zod methods like omit, extend, pick.**Prevention**: Export specific route groups instead of entire app
```
```
await next()
```
```
c.json()
```
```
c.text()
```
```
c.html()
```
```
c.req.valid()
```
```
export type AppType = typeof route
```
```
onError
```
```
await next()
```
```
res.send()
```
```
typeof app
```
```
omit
```
```
extend
```
```
pick
```
```
**Advanced Workaround for Large Apps** (100+ routes):1. **Split into monorepo libs**:
```
```
**Advanced Workaround for Large Apps** (100+ routes):1. **Split into monorepo libs**:
```
```
2. **Use separate build configs**:   - **Production**: Full tsc with .d.ts generation (for RPC client)   - **Development**: Skip tsc on main router, only type-check sub-routers (faster live-reload)3. **Avoid Zod methods that hurt performance**:   - z.omit(), z.extend(), z.pick() - These increase language server workload by 10x   - Use interfaces instead of intersections when possible### Issue #2: Middleware Response Not Typed in RPC**Error**: Middleware responses (including notFound() and onError()) not inferred by RPC client**Source**: [honojs/hono#2719](https://github.com/honojs/hono/issues/2719) | [GitHub Issue #4600](https://github.com/honojs/hono/issues/4600)**Why It Happens**: RPC mode doesn't infer middleware responses by default. Responses from notFound() or onError() handlers are not included in type map.**Prevention**: Export specific route types that include middleware
```
```
2. **Use separate build configs**:   - **Production**: Full tsc with .d.ts generation (for RPC client)   - **Development**: Skip tsc on main router, only type-check sub-routers (faster live-reload)3. **Avoid Zod methods that hurt performance**:   - z.omit(), z.extend(), z.pick() - These increase language server workload by 10x   - Use interfaces instead of intersections when possible### Issue #2: Middleware Response Not Typed in RPC**Error**: Middleware responses (including notFound() and onError()) not inferred by RPC client**Source**: [honojs/hono#2719](https://github.com/honojs/hono/issues/2719) | [GitHub Issue #4600](https://github.com/honojs/hono/issues/4600)**Why It Happens**: RPC mode doesn't infer middleware responses by default. Responses from notFound() or onError() handlers are not included in type map.**Prevention**: Export specific route types that include middleware
```
```
tsc
```
```
.d.ts
```
```
tsc
```
```
z.omit()
```
```
z.extend()
```
```
z.pick()
```
```
notFound()
```
```
onError()
```
```
notFound()
```
```
onError()
```
```
**Specific Issue: notFound/onError Not Typed:**
```
```
**Specific Issue: notFound/onError Not Typed:**
```
```
**Partial Workaround** (v4.11.0+):Use module augmentation to customize NotFoundResponse type:
```
```
**Partial Workaround** (v4.11.0+):Use module augmentation to customize NotFoundResponse type:
```
```
NotFoundResponse
```
```
### Issue #3: Validation Hook Confusion**Error**: Different validator libraries have different hook patterns**Source**: Context7 research**Why It Happens**: Each validator (@hono/zod-validator, @hono/valibot-validator, etc.) has slightly different APIs**Prevention**: This skill provides consistent patterns for all validators### Issue #4: HTTPException Misuse**Error**: Throwing plain Error instead of HTTPException**Source**: Official docs**Why It Happens**: Developers familiar with Express use throw new Error()**Prevention**: Always use HTTPException for client errors (400-499)
```
```
### Issue #3: Validation Hook Confusion**Error**: Different validator libraries have different hook patterns**Source**: Context7 research**Why It Happens**: Each validator (@hono/zod-validator, @hono/valibot-validator, etc.) has slightly different APIs**Prevention**: This skill provides consistent patterns for all validators### Issue #4: HTTPException Misuse**Error**: Throwing plain Error instead of HTTPException**Source**: Official docs**Why It Happens**: Developers familiar with Express use throw new Error()**Prevention**: Always use HTTPException for client errors (400-499)
```
```
throw new Error()
```
```
HTTPException
```
```
### Issue #5: Context Type Safety Lost**Error**: c.set() and c.get() without type inference**Source**: Official docs**Why It Happens**: Not defining Variables type in Hono generic**Prevention**: Always define Variables type
```
```
### Issue #5: Context Type Safety Lost**Error**: c.set() and c.get() without type inference**Source**: Official docs**Why It Happens**: Not defining Variables type in Hono generic**Prevention**: Always define Variables type
```
```
c.set()
```
```
c.get()
```
```
Variables
```
```
### Issue #6: Missing Error Check After Middleware**Error**: Errors in handlers not caught**Source**: Official docs**Why It Happens**: Not checking c.error after await next()**Prevention**: Check c.error in middleware
```
```
### Issue #6: Missing Error Check After Middleware**Error**: Errors in handlers not caught**Source**: Official docs**Why It Happens**: Not checking c.error after await next()**Prevention**: Check c.error in middleware
```
```
c.error
```
```
await next()
```
```
c.error
```
```
### Issue #7: Direct Request Access Without Validation**Error**: Accessing c.req.param() or c.req.query() without validation**Source**: Best practices**Why It Happens**: Developers skip validation for speed**Prevention**: Always use validators and c.req.valid()
```
```
### Issue #7: Direct Request Access Without Validation**Error**: Accessing c.req.param() or c.req.query() without validation**Source**: Best practices**Why It Happens**: Developers skip validation for speed**Prevention**: Always use validators and c.req.valid()
```
```
c.req.param()
```
```
c.req.query()
```
```
c.req.valid()
```
```
### Issue #8: Incorrect Middleware Order**Error**: Middleware executing in wrong order**Source**: Official docs**Why It Happens**: Misunderstanding middleware chain execution**Prevention**: Remember middleware runs top-to-bottom, await next() runs handler, then bottom-to-top
```
```
### Issue #8: Incorrect Middleware Order**Error**: Middleware executing in wrong order**Source**: Official docs**Why It Happens**: Misunderstanding middleware chain execution**Prevention**: Remember middleware runs top-to-bottom, await next() runs handler, then bottom-to-top
```
```
await next()
```
```
### Issue #9: JWT verify() Requires Algorithm Parameter (v4.11.4+)**Error**: TypeError: Cannot read properties of undefined**Source**: [GitHub Issue #4625](https://github.com/honojs/hono/issues/4625) | [Security Advisory GHSA-f67f-6cw9-8mq4](https://github.com/honojs/hono/security/advisories/GHSA-f67f-6cw9-8mq4)**Why It Happens**: Security fix in v4.11.4 requires explicit algorithm specification to prevent JWT header manipulation**Prevention**: Always specify the algorithm parameter
```
```
### Issue #9: JWT verify() Requires Algorithm Parameter (v4.11.4+)**Error**: TypeError: Cannot read properties of undefined**Source**: [GitHub Issue #4625](https://github.com/honojs/hono/issues/4625) | [Security Advisory GHSA-f67f-6cw9-8mq4](https://github.com/honojs/hono/security/advisories/GHSA-f67f-6cw9-8mq4)**Why It Happens**: Security fix in v4.11.4 requires explicit algorithm specification to prevent JWT header manipulation**Prevention**: Always specify the algorithm parameter
```
```
TypeError: Cannot read properties of undefined
```
```
**Note**: This was a breaking change released in a patch version due to security severity. Update all JWT verification code when upgrading to v4.11.4+.### Issue #10: Request Body Consumed by Middleware**Error**: TypeError: Body is unusable**Source**: [GitHub Issue #4259](https://github.com/honojs/hono/issues/4259)**Why It Happens**: Using c.req.raw.clone() bypasses Hono's cache and consumes the body stream**Prevention**: Always use c.req.text() or c.req.json() instead of accessing raw request
```
```
**Note**: This was a breaking change released in a patch version due to security severity. Update all JWT verification code when upgrading to v4.11.4+.### Issue #10: Request Body Consumed by Middleware**Error**: TypeError: Body is unusable**Source**: [GitHub Issue #4259](https://github.com/honojs/hono/issues/4259)**Why It Happens**: Using c.req.raw.clone() bypasses Hono's cache and consumes the body stream**Prevention**: Always use c.req.text() or c.req.json() instead of accessing raw request
```
```
TypeError: Body is unusable
```
```
c.req.raw.clone()
```
```
c.req.text()
```
```
c.req.json()
```
```
**Why**: Request bodies in Web APIs can only be read once (they're streams). Hono's validator internally uses await c.req.json() which caches the content. If you use c.req.raw.clone().json(), it bypasses the cache and consumes the body, causing subsequent reads to fail.---## Configuration Files Reference### package.json (Full Example)
```
```
**Why**: Request bodies in Web APIs can only be read once (they're streams). Hono's validator internally uses await c.req.json() which caches the content. If you use c.req.raw.clone().json(), it bypasses the cache and consumes the body, causing subsequent reads to fail.---## Configuration Files Reference### package.json (Full Example)
```
```
await c.req.json()
```
```
c.req.raw.clone().json()
```
```
### package.json with Validation (Zod)
```
```
### package.json with Validation (Zod)
```
```
### package.json with Validation (Valibot)
```
```
### package.json with Validation (Valibot)
```
```
### package.json with All Validators
```
```
### package.json with All Validators
```
```
### tsconfig.json
```
```
### tsconfig.json
```
```
---## File TemplatesAll templates are available in the templates/ directory:- **routing-patterns.ts** - Route params, query params, wildcards, grouping- **middleware-composition.ts** - Middleware chaining, built-in middleware- **validation-zod.ts** - Zod validation with custom hooks- **validation-valibot.ts** - Valibot validation- **rpc-pattern.ts** - Type-safe RPC client/server- **error-handling.ts** - HTTPException, onError, custom errors- **context-extension.ts** - c.set/c.get, custom context types- **package.json** - All dependenciesCopy these files to your project and customize as needed.---## Reference DocumentationFor deeper understanding, see:- **middleware-catalog.md** - Complete built-in Hono middleware reference- **validation-libraries.md** - Zod vs Valibot vs Typia vs ArkType comparison- **rpc-guide.md** - RPC pattern deep dive, performance optimization- **top-errors.md** - Common Hono errors with solutions---## Official Documentation- **Hono**: https://hono.dev- **Hono Routing**: https://hono.dev/docs/api/routing- **Hono Middleware**: https://hono.dev/docs/guides/middleware- **Hono Validation**: https://hono.dev/docs/guides/validation- **Hono RPC**: https://hono.dev/docs/guides/rpc- **Hono Context**: https://hono.dev/docs/api/context- **Context7 Library ID**: /llmstxt/hono_dev_llms-full_txt---## Dependencies (Latest Verified 2026-01-20)
```
```
---## File TemplatesAll templates are available in the templates/ directory:- **routing-patterns.ts** - Route params, query params, wildcards, grouping- **middleware-composition.ts** - Middleware chaining, built-in middleware- **validation-zod.ts** - Zod validation with custom hooks- **validation-valibot.ts** - Valibot validation- **rpc-pattern.ts** - Type-safe RPC client/server- **error-handling.ts** - HTTPException, onError, custom errors- **context-extension.ts** - c.set/c.get, custom context types- **package.json** - All dependenciesCopy these files to your project and customize as needed.---## Reference DocumentationFor deeper understanding, see:- **middleware-catalog.md** - Complete built-in Hono middleware reference- **validation-libraries.md** - Zod vs Valibot vs Typia vs ArkType comparison- **rpc-guide.md** - RPC pattern deep dive, performance optimization- **top-errors.md** - Common Hono errors with solutions---## Official Documentation- **Hono**: https://hono.dev- **Hono Routing**: https://hono.dev/docs/api/routing- **Hono Middleware**: https://hono.dev/docs/guides/middleware- **Hono Validation**: https://hono.dev/docs/guides/validation- **Hono RPC**: https://hono.dev/docs/guides/rpc- **Hono Context**: https://hono.dev/docs/api/context- **Context7 Library ID**: /llmstxt/hono_dev_llms-full_txt---## Dependencies (Latest Verified 2026-01-20)
```
```
templates/
```
```
/llmstxt/hono_dev_llms-full_txt
```
```
---## Production ExampleThis skill is validated across multiple runtime environments:- **Cloudflare Workers**: Routing, middleware, RPC patterns- **Deno**: All validation libraries tested- **Bun**: Performance benchmarks completed- **Node.js**: Full test suite passingAll patterns in this skill have been validated in production.---**Questions? Issues?**1. Check references/top-errors.md first2. Verify all steps in the setup process3. Ensure await next() is called in middleware4. Ensure RPC routes use const route = app.get(...) pattern5. Check official docs: https://hono.dev------paths: "**/*.ts", "**/*.tsx", "**/*route*.ts", "**/*api*.ts"---# Hono Routing CorrectionsClaude's training may suggest Express patterns. This project uses **Hono v4**.## Response: c.json(), Not res.send()
```
```
---## Production ExampleThis skill is validated across multiple runtime environments:- **Cloudflare Workers**: Routing, middleware, RPC patterns- **Deno**: All validation libraries tested- **Bun**: Performance benchmarks completed- **Node.js**: Full test suite passingAll patterns in this skill have been validated in production.---**Questions? Issues?**1. Check references/top-errors.md first2. Verify all steps in the setup process3. Ensure await next() is called in middleware4. Ensure RPC routes use const route = app.get(...) pattern5. Check official docs: https://hono.dev------paths: "**/*.ts", "**/*.tsx", "**/*route*.ts", "**/*api*.ts"---# Hono Routing CorrectionsClaude's training may suggest Express patterns. This project uses **Hono v4**.## Response: c.json(), Not res.send()
```
```
references/top-errors.md
```
```
await next()
```
```
const route = app.get(...)
```
```
## Middleware: MUST await next()
```
```
## Middleware: MUST await next()
```
```
## Params: c.req.param(), Not req.params
```
```
## Params: c.req.param(), Not req.params
```
```
## Validation: Use Validator Middleware
```
```
## Validation: Use Validator Middleware
```
```
## Error Handling: HTTPException
```
```
## Error Handling: HTTPException
```
```
## RPC: Export Route, Not App
```
```
## RPC: Export Route, Not App
```
```
## Type Variables for c.set/c.get
```
```
## Type Variables for c.set/c.get
```
```
## Quick Fixes| Express pattern | Hono equivalent ||----------------|-----------------||
```
```
/
```
```
|
```
```
/
```
```
||
```
```
|
```
```
||
```
```
|
```
```
with validator ||
```
```
|
```
```
||
```
```
|
```
Unlock the power of Hono, the ultrafast web framework for modern JavaScript runtimes, directly within your coding assistant. This specialized agent skill is designed to guide you through the intricacies of Hono's routing and middleware system, enabling you to build high-performance, type-safe APIs and web services with ease. Whether you're targeting serverless environments like Cloudflare Workers or traditional Node.js setups, this skill provides structured knowledge and best practices to streamline your development workflow and harness Hono's lightweight efficiency.

# When to Use This Skill
- •Building high-performance serverless APIs for edge computing with Cloudflare Workers or Deno.
- •Developing lightweight and type-safe backend services for web applications.
- •Implementing robust request validation and error handling in Hono applications using Zod or Valibot.
- •Integrating global or route-specific middleware for authentication, logging, or data transformation.

# Pro Tips
- 💡Always leverage the `c` (Context) object in Hono handlers for full type inference and easy access to request, response, and environment variables.
- 💡Chain middleware strategically: place validation middleware early in the chain to fail fast and general-purpose middleware (like logging) before route handlers.
- 💡Understand Hono's flexibility across runtimes (Cloudflare Workers, Bun, Deno, Node.js); this allows for highly portable and performant backend codebases.

