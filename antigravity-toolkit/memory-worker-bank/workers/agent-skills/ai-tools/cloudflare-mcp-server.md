# cloudflare-mcp-server
Source: https://antigravity.codes/agent-skills/ai-tools/cloudflare-mcp-server

## AI Worker Instructions
When the user requests functionality related to cloudflare-mcp-server, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-mcp-server
```
npm create cloudflare@latest -- my-mcp-server \  --template=cloudflare/ai/demos/remote-mcp-authlesscd my-mcp-server && npm install && npm run dev
```
```
npm create cloudflare@latest -- my-mcp-server \  --template=cloudflare/ai/demos/remote-mcp-authlesscd my-mcp-server && npm install && npm run dev
```
```
remote-mcp-authless
```
```
remote-mcp-github-oauth
```
```
remote-mcp-google-oauth
```
```
remote-mcp-auth0
```
```
remote-mcp-authkit
```
```
mcp-server-bearer-auth
```
```
# 1. Create from templatenpm create cloudflare@latest -- my-mcp --template=cloudflare/ai/demos/remote-mcp-authlesscd my-mcp && npm install && npm run dev# 2. Deploynpx wrangler deploy# Note the output URL: https://my-mcp.YOUR_ACCOUNT.workers.dev# 3. Test (PREVENTS 80% OF ERRORS!)curl https://my-mcp.YOUR_ACCOUNT.workers.dev/sse# Expected: {"name":"My MCP Server","version":"1.0.0","transports":["/sse","/mcp"]}# Got 404? See "HTTP Transport Fundamentals" below# 4. Configure client (~/.config/claude/claude_desktop_config.json){  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse"  // Must match curl URL!    }  }}# 5. Restart Claude Desktop (config only loads at startup)
```
```
# 1. Create from templatenpm create cloudflare@latest -- my-mcp --template=cloudflare/ai/demos/remote-mcp-authlesscd my-mcp && npm install && npm run dev# 2. Deploynpx wrangler deploy# Note the output URL: https://my-mcp.YOUR_ACCOUNT.workers.dev# 3. Test (PREVENTS 80% OF ERRORS!)curl https://my-mcp.YOUR_ACCOUNT.workers.dev/sse# Expected: {"name":"My MCP Server","version":"1.0.0","transports":["/sse","/mcp"]}# Got 404? See "HTTP Transport Fundamentals" below# 4. Configure client (~/.config/claude/claude_desktop_config.json){  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse"  // Must match curl URL!    }  }}# 5. Restart Claude Desktop (config only loads at startup)
```
```
/sse
```
```
// src/index.tsexport default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    const { pathname } = new URL(request.url);    if (pathname.startsWith("/sse")) {      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);  // ← Base path is "/sse"    }    return new Response("Not Found", { status: 404 });  }};
```
```
// src/index.tsexport default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    const { pathname } = new URL(request.url);    if (pathname.startsWith("/sse")) {      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);  // ← Base path is "/sse"    }    return new Response("Not Found", { status: 404 });  }};
```
```
/sse
```
```
{  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.workers.dev/sse"  // ✅ Correct    }  }}
```
```
{  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.workers.dev/sse"  // ✅ Correct    }  }}
```
```
"url": "https://my-mcp.workers.dev"      // Missing /sse → 404"url": "https://my-mcp.workers.dev/"     // Missing /sse → 404"url": "http://localhost:8788"           // Wrong after deploy
```
```
"url": "https://my-mcp.workers.dev"      // Missing /sse → 404"url": "https://my-mcp.workers.dev/"     // Missing /sse → 404"url": "http://localhost:8788"           // Wrong after deploy
```
```
/
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    return MyMCP.serveSSE("/").fetch(request, env, ctx);  // ← Base path is "/"  }};
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    return MyMCP.serveSSE("/").fetch(request, env, ctx);  // ← Base path is "/"  }};
```
```
{  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.workers.dev"  // ✅ Correct (no /sse)    }  }}
```
```
{  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.workers.dev"  // ✅ Correct (no /sse)    }  }}
```
```
serveSSE("/sse")
```
```
https://my-mcp.workers.dev/sse/tools/listhttps://my-mcp.workers.dev/sse/tools/callhttps://my-mcp.workers.dev/sse/resources/list
```
```
https://my-mcp.workers.dev/sse/tools/listhttps://my-mcp.workers.dev/sse/tools/callhttps://my-mcp.workers.dev/sse/resources/list
```
```
serveSSE("/")
```
```
https://my-mcp.workers.dev/tools/listhttps://my-mcp.workers.dev/tools/callhttps://my-mcp.workers.dev/resources/list
```
```
https://my-mcp.workers.dev/tools/listhttps://my-mcp.workers.dev/tools/callhttps://my-mcp.workers.dev/resources/list
```
```
1. Client connects to: https://my-mcp.workers.dev/sse                                ↓2. Worker receives request: { url: "https://my-mcp.workers.dev/sse", ... }                                ↓3. Your fetch handler: const { pathname } = new URL(request.url)                                ↓4. pathname === "/sse" → Check passes                                ↓5. MyMCP.serveSSE("/sse").fetch() → MCP server handles request                                ↓6. Tool calls routed to: /sse/tools/call
```
```
1. Client connects to: https://my-mcp.workers.dev/sse                                ↓2. Worker receives request: { url: "https://my-mcp.workers.dev/sse", ... }                                ↓3. Your fetch handler: const { pathname } = new URL(request.url)                                ↓4. pathname === "/sse" → Check passes                                ↓5. MyMCP.serveSSE("/sse").fetch() → MCP server handles request                                ↓6. Tool calls routed to: /sse/tools/call
```
```
https://my-mcp.workers.dev
```
```
/sse
```
```
pathname === "/" → Check fails → 404 Not Found
```
```
pathname === "/" → Check fails → 404 Not Found
```
```
npx wrangler deploy# Output: Deployed to https://my-mcp.YOUR_ACCOUNT.workers.dev
```
```
npx wrangler deploy# Output: Deployed to https://my-mcp.YOUR_ACCOUNT.workers.dev
```
```
# If serving at /sse, test this URL:curl https://my-mcp.YOUR_ACCOUNT.workers.dev/sse# Should return MCP server info (not 404)
```
```
# If serving at /sse, test this URL:curl https://my-mcp.YOUR_ACCOUNT.workers.dev/sse# Should return MCP server info (not 404)
```
```
{  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse"  // Match curl URL    }  }}
```
```
{  "mcpServers": {    "my-mcp": {      "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse"  // Match curl URL    }  }}
```
```
curl https://worker.dev/sse
```
```
workes.dev
```
```
workers.dev
```
```
https://
```
```
http://
```
```
MyMCP.serveSSE("/sse").fetch(request, env, ctx)
```
```
MyMCP.serveSSE("/sse").fetch(request, env, ctx)
```
```
MyMCP.serve("/mcp").fetch(request, env, ctx)
```
```
MyMCP.serve("/mcp").fetch(request, env, ctx)
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    const { pathname } = new URL(request.url);    if (pathname.startsWith("/sse")) {      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);    }    if (pathname.startsWith("/mcp")) {      return MyMCP.serve("/mcp").fetch(request, env, ctx);    }    return new Response("Not Found", { status: 404 });  }};
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    const { pathname } = new URL(request.url);    if (pathname.startsWith("/sse")) {      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);    }    if (pathname.startsWith("/mcp")) {      return MyMCP.serve("/mcp").fetch(request, env, ctx);    }    return new Response("Not Found", { status: 404 });  }};
```
```
pathname.startsWith()
```
```
// Request user input during tool executionconst result = await this.elicit({  prompt: "Enter your API key:",  type: "password"});// Interactive workflows with Durable Objects stateawait this.state.storage.put("api_key", result);
```
```
// Request user input during tool executionconst result = await this.elicit({  prompt: "Enter your API key:",  type: "password"});// Interactive workflows with Durable Objects stateawait this.state.storage.put("api_key", result);
```
```
// Old: Direct tool callsawait server.callTool("get_user", { id: "123" });// New: Type-safe generated APIconst user = await api.getUser("123");
```
```
// Old: Direct tool callsawait server.callTool("get_user", { id: "123" });// New: Type-safe generated APIconst user = await api.getUser("123");
```
```
import { MCPClientManager } from "agents/mcp";const manager = new MCPClientManager(env);await manager.connect("https://external-mcp.com/sse");// Auto-discovers tools, resources, prompts// Handles reconnection, OAuth flow, hibernation
```
```
import { MCPClientManager } from "agents/mcp";const manager = new MCPClientManager(env);await manager.connect("https://external-mcp.com/sse");// Auto-discovers tools, resources, prompts// Handles reconnection, OAuth flow, hibernation
```
```
// Task queues for background jobsawait this.queue.send({ task: "process_data", data });// Email integrationasync onEmail(message: Email) {  // Process incoming email  const response = await this.generateReply(message);  await this.sendEmail(response);}
```
```
// Task queues for background jobsawait this.queue.send({ task: "process_data", data });// Email integrationasync onEmail(message: Email) {  // Process incoming email  const response = await this.generateReply(message);  await this.sendEmail(response);}
```
```
// Old: Separate endpoints/connect  // Initialize connection/message  // Send/receive messages// New: Single streamable endpoint/mcp      // All communication via HTTP streaming
```
```
// Old: Separate endpoints/connect  // Initialize connection/message  // Send/receive messages// New: Single streamable endpoint/mcp      // All communication via HTTP streaming
```
```
# Check current versionnpm list @cloudflare/workers-oauth-provider# Update if < 0.0.5npm install @cloudflare/workers-oauth-provider@latest
```
```
# Check current versionnpm list @cloudflare/workers-oauth-provider# Update if < 0.0.5npm install @cloudflare/workers-oauth-provider@latest
```
```
@cloudflare/workers-oauth-provider@0.0.5
```
```
// ✅ GOOD: workers-oauth-provider handles encryption automaticallyexport default new OAuthProvider({  kv: (env) => env.OAUTH_KV,  // Tokens stored encrypted  // ...});// ❌ BAD: Storing tokens in plain textawait env.KV.put("access_token", token);  // Security risk!
```
```
// ✅ GOOD: workers-oauth-provider handles encryption automaticallyexport default new OAuthProvider({  kv: (env) => env.OAUTH_KV,  // Tokens stored encrypted  // ...});// ❌ BAD: Storing tokens in plain textawait env.KV.put("access_token", token);  // Security risk!
```
```
// ✅ GOOD: Namespace by user IDawait env.KV.put(user:${userId}:todos, data);// ❌ BAD: Global namespaceawait env.KV.put(todos, data);  // Data visible to all users!
```
```
// ✅ GOOD: Namespace by user IDawait env.KV.put(user:${userId}:todos, data);// ❌ BAD: Global namespaceawait env.KV.put(todos, data);  // Data visible to all users!
```
```
user:${userId}:todos
```
```
todos
```
```
remote-mcp-authless
```
```
mcp-server-bearer-auth
```
```
// Validate Authorization: Bearer <token>   const token = request.headers.get("Authorization")?.replace("Bearer ", "");   if (!await validateToken(token, env)) {     return new Response("Unauthorized", { status: 401 });   }
```
```
// Validate Authorization: Bearer <token>   const token = request.headers.get("Authorization")?.replace("Bearer ", "");   if (!await validateToken(token, env)) {     return new Response("Unauthorized", { status: 401 });   }
```
```
remote-mcp-github-oauth
```
```
import { OAuthProvider, GitHubHandler } from "@cloudflare/workers-oauth-provider";   export default new OAuthProvider({     authorizeEndpoint: "/authorize",     tokenEndpoint: "/token",     defaultHandler: new GitHubHandler({       clientId: (env) => env.GITHUB_CLIENT_ID,       clientSecret: (env) => env.GITHUB_CLIENT_SECRET,       scopes: ["repo", "user:email"]     }),     kv: (env) => env.OAUTH_KV,     apiHandlers: { "/sse": MyMCP.serveSSE("/sse") }   });
```
```
import { OAuthProvider, GitHubHandler } from "@cloudflare/workers-oauth-provider";   export default new OAuthProvider({     authorizeEndpoint: "/authorize",     tokenEndpoint: "/token",     defaultHandler: new GitHubHandler({       clientId: (env) => env.GITHUB_CLIENT_ID,       clientSecret: (env) => env.GITHUB_CLIENT_SECRET,       scopes: ["repo", "user:email"]     }),     kv: (env) => env.OAUTH_KV,     apiHandlers: { "/sse": MyMCP.serveSSE("/sse") }   });
```
```
remote-mcp-authkit
```
```
// Storage APIawait this.state.storage.put("key", "value");const value = await this.state.storage.get<string>("key");// Required wrangler.jsonc{  "durable_objects": {    "bindings": [{ "name": "MY_MCP", "class_name": "MyMCP" }]  },  "migrations": [{ "tag": "v1", "new_classes": ["MyMCP"] }]  // Required on first deploy!}
```
```
// Storage APIawait this.state.storage.put("key", "value");const value = await this.state.storage.get<string>("key");// Required wrangler.jsonc{  "durable_objects": {    "bindings": [{ "name": "MY_MCP", "class_name": "MyMCP" }]  },  "migrations": [{ "tag": "v1", "new_classes": ["MyMCP"] }]  // Required on first deploy!}
```
```
Client --- (SSE or HTTP) --> Worker --- (WebSocket) --> Durable Object
```
```
Client --- (SSE or HTTP) --> Worker --- (WebSocket) --> Durable Object
```
```
/sse
```
```
/mcp
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    const { pathname } = new URL(request.url);    // Client uses SSE    if (pathname.startsWith("/sse")) {      // ✅ Client → Worker: SSE      // ✅ Worker → DO: WebSocket (automatic)      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);    }    return new Response("Not Found", { status: 404 });  }};
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    const { pathname } = new URL(request.url);    // Client uses SSE    if (pathname.startsWith("/sse")) {      // ✅ Client → Worker: SSE      // ✅ Worker → DO: WebSocket (automatic)      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);    }    return new Response("Not Found", { status: 404 });  }};
```
```
this.server.tool(  "my_tool",  { /* schema */ },  async (params) => {    // ✅ CORRECT: Return object with content array    return {      content: [        { type: "text", text: "Your result here" }      ]    };    // ❌ WRONG: Raw string    return "Your result here";    // ❌ WRONG: Plain object    return { result: "Your result here" };  });
```
```
this.server.tool(  "my_tool",  { /* schema */ },  async (params) => {    // ✅ CORRECT: Return object with content array    return {      content: [        { type: "text", text: "Your result here" }      ]    };    // ❌ WRONG: Raw string    return "Your result here";    // ❌ WRONG: Plain object    return { result: "Your result here" };  });
```
```
export class MyMCP extends McpAgent<Env> {  async init() {    this.server = new McpServer({ name: "My MCP" });    // Base tools for all users    this.server.tool("public_tool", { /* schema */ }, async (params) => {      // Available to everyone    });    // Conditional tools based on user    const userId = this.props?.userId;    if (await this.isAdmin(userId)) {      this.server.tool("admin_tool", { /* schema */ }, async (params) => {        // Only available to admins      });    }    // Premium features    if (await this.isPremiumUser(userId)) {      this.server.tool("premium_feature", { /* schema */ }, async (params) => {        // Only for premium users      });    }  }  private async isAdmin(userId?: string): Promise<boolean> {    if (!userId) return false;    const userRole = await this.state.storage.get<string>(user:${userId}:role);    return userRole === "admin";  }}
```
```
export class MyMCP extends McpAgent<Env> {  async init() {    this.server = new McpServer({ name: "My MCP" });    // Base tools for all users    this.server.tool("public_tool", { /* schema */ }, async (params) => {      // Available to everyone    });    // Conditional tools based on user    const userId = this.props?.userId;    if (await this.isAdmin(userId)) {      this.server.tool("admin_tool", { /* schema */ }, async (params) => {        // Only available to admins      });    }    // Premium features    if (await this.isPremiumUser(userId)) {      this.server.tool("premium_feature", { /* schema */ }, async (params) => {        // Only for premium users      });    }  }  private async isAdmin(userId?: string): Promise<boolean> {    if (!userId) return false;    const userRole = await this.state.storage.get<string>(user:${userId}:role);    return userRole === "admin";  }}
```
```
user:${userId}:role
```
```
async getCached<T>(key: string, ttlMs: number, fetchFn: () => Promise<T>): Promise<T> {  const cached = await this.state.storage.get<{ data: T, timestamp: number }>(key);  if (cached && Date.now() - cached.timestamp < ttlMs) {    return cached.data;  }  const data = await fetchFn();  await this.state.storage.put(key, { data, timestamp: Date.now() });  return data;}
```
```
async getCached<T>(key: string, ttlMs: number, fetchFn: () => Promise<T>): Promise<T> {  const cached = await this.state.storage.get<{ data: T, timestamp: number }>(key);  if (cached && Date.now() - cached.timestamp < ttlMs) {    return cached.data;  }  const data = await fetchFn();  await this.state.storage.put(key, { data, timestamp: Date.now() });  return data;}
```
```
async rateLimit(key: string, maxRequests: number, windowMs: number): Promise<boolean> {  const requests = await this.state.storage.get<number[]>(ratelimit:${key}) || [];  const recentRequests = requests.filter(ts => Date.now() - ts < windowMs);  if (recentRequests.length >= maxRequests) return false;  recentRequests.push(Date.now());  await this.state.storage.put(ratelimit:${key}, recentRequests);  return true;}
```
```
async rateLimit(key: string, maxRequests: number, windowMs: number): Promise<boolean> {  const requests = await this.state.storage.get<number[]>(ratelimit:${key}) || [];  const recentRequests = requests.filter(ts => Date.now() - ts < windowMs);  if (recentRequests.length >= maxRequests) return false;  recentRequests.push(Date.now());  await this.state.storage.put(ratelimit:${key}, recentRequests);  return true;}
```
```
ratelimit:${key}
```
```
ratelimit:${key}
```
```
TypeError: Cannot read properties of undefined (reading 'serve')
```
```
export class MyMCP extends McpAgent { ... }  // ✅ Must exportexport default { fetch() { ... } }
```
```
export class MyMCP extends McpAgent { ... }  // ✅ Must exportexport default { fetch() { ... } }
```
```
404 Not Found
```
```
Connection failed
```
```
serveSSE("/sse")
```
```
https://worker.dev
```
```
/sse
```
```
// Server serves at /sseMyMCP.serveSSE("/sse").fetch(...)// Client MUST include /sse{ "url": "https://worker.dev/sse" }  // ✅ Correct{ "url": "https://worker.dev" }      // ❌ Wrong - 404
```
```
// Server serves at /sseMyMCP.serveSSE("/sse").fetch(...)// Client MUST include /sse{ "url": "https://worker.dev/sse" }  // ✅ Correct{ "url": "https://worker.dev" }      // ❌ Wrong - 404
```
```
serveSSE("/sse")
```
```
serveSSE("/")
```
```
curl https://worker.dev/sse
```
```
Connection failed: Unexpected response format
```
```
// SSE transportMyMCP.serveSSE("/sse")  // Client URL: https://worker.dev/sse// HTTP transportMyMCP.serve("/mcp")     // Client URL: https://worker.dev/mcp
```
```
// SSE transportMyMCP.serveSSE("/sse")  // Client URL: https://worker.dev/sse// HTTP transportMyMCP.serve("/mcp")     // Client URL: https://worker.dev/mcp
```
```
/sse
```
```
/mcp
```
```
startsWith()
```
```
// ✅ CORRECTif (pathname.startsWith("/sse")) {  return MyMCP.serveSSE("/sse").fetch(...);}if (pathname.startsWith("/mcp")) {  return MyMCP.serve("/mcp").fetch(...);}// ❌ WRONG: Exact match breaks sub-pathsif (pathname === "/sse") {  // Breaks /sse/tools/list  return MyMCP.serveSSE("/sse").fetch(...);}
```
```
// ✅ CORRECTif (pathname.startsWith("/sse")) {  return MyMCP.serveSSE("/sse").fetch(...);}if (pathname.startsWith("/mcp")) {  return MyMCP.serve("/mcp").fetch(...);}// ❌ WRONG: Exact match breaks sub-pathsif (pathname === "/sse") {  // Breaks /sse/tools/list  return MyMCP.serveSSE("/sse").fetch(...);}
```
```
// Development{ "url": "http://localhost:8788/sse" }// ⚠️ MUST UPDATE after npx wrangler deploy{ "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse" }
```
```
// Development{ "url": "http://localhost:8788/sse" }// ⚠️ MUST UPDATE after npx wrangler deploy{ "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse" }
```
```
npx wrangler deploy
```
```
OAuth error: redirect_uri does not match
```
```
{  "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse",  "auth": {    "type": "oauth",    "authorizationUrl": "https://my-mcp.YOUR_ACCOUNT.workers.dev/authorize",  // Must match deployed domain    "tokenUrl": "https://my-mcp.YOUR_ACCOUNT.workers.dev/token"  }}
```
```
{  "url": "https://my-mcp.YOUR_ACCOUNT.workers.dev/sse",  "auth": {    "type": "oauth",    "authorizationUrl": "https://my-mcp.YOUR_ACCOUNT.workers.dev/authorize",  // Must match deployed domain    "tokenUrl": "https://my-mcp.YOUR_ACCOUNT.workers.dev/token"  }}
```
```
Access to fetch at '...' blocked by CORS policy
```
```
Method Not Allowed
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    // Handle CORS preflight    if (request.method === "OPTIONS") {      return new Response(null, {        status: 204,        headers: {          "Access-Control-Allow-Origin": "*",          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",          "Access-Control-Allow-Headers": "Content-Type, Authorization",          "Access-Control-Max-Age": "86400"        }      });    }    // ... rest of your fetch handler  }};
```
```
export default {  fetch(request: Request, env: Env, ctx: ExecutionContext) {    // Handle CORS preflight    if (request.method === "OPTIONS") {      return new Response(null, {        status: 204,        headers: {          "Access-Control-Allow-Origin": "*",          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",          "Access-Control-Allow-Headers": "Content-Type, Authorization",          "Access-Control-Max-Age": "86400"        }      });    }    // ... rest of your fetch handler  }};
```
```
TypeError: Cannot read properties of undefined
```
```
Unexpected token
```
```
export default {  async fetch(request: Request, env: Env, ctx: ExecutionContext) {    try {      // Your MCP server logic      return await MyMCP.serveSSE("/sse").fetch(request, env, ctx);    } catch (error) {      console.error("Request handling error:", error);      return new Response(        JSON.stringify({          error: "Invalid request",          details: error.message        }),        {          status: 400,          headers: { "Content-Type": "application/json" }        }      );    }  }};
```
```
export default {  async fetch(request: Request, env: Env, ctx: ExecutionContext) {    try {      // Your MCP server logic      return await MyMCP.serveSSE("/sse").fetch(request, env, ctx);    } catch (error) {      console.error("Request handling error:", error);      return new Response(        JSON.stringify({          error: "Invalid request",          details: error.message        }),        {          status: 400,          headers: { "Content-Type": "application/json" }        }      );    }  }};
```
```
TypeError: env.API_KEY is undefined
```
```
export class MyMCP extends McpAgent<Env> {  async init() {    // Validate required environment variables    if (!this.env.API_KEY) {      throw new Error("API_KEY environment variable not configured");    }    if (!this.env.DATABASE_URL) {      throw new Error("DATABASE_URL environment variable not configured");    }    // Continue with tool registration    this.server.tool(...);  }}
```
```
export class MyMCP extends McpAgent<Env> {  async init() {    // Validate required environment variables    if (!this.env.API_KEY) {      throw new Error("API_KEY environment variable not configured");    }    if (!this.env.DATABASE_URL) {      throw new Error("DATABASE_URL environment variable not configured");    }    // Continue with tool registration    this.server.tool(...);  }}
```
```
.dev.vars
```
```
wrangler.jsonc
```
```
vars
```
```
wrangler secret
```
```
# .dev.vars (local development, gitignored)API_KEY=dev-key-123DATABASE_URL=http://localhost:3000# wrangler.jsonc (public config){  "vars": {    "ENVIRONMENT": "production",    "LOG_LEVEL": "info"  }}# wrangler secret (production secrets)npx wrangler secret put API_KEYnpx wrangler secret put DATABASE_URL
```
```
# .dev.vars (local development, gitignored)API_KEY=dev-key-123DATABASE_URL=http://localhost:3000# wrangler.jsonc (public config){  "vars": {    "ENVIRONMENT": "production",    "LOG_LEVEL": "info"  }}# wrangler secret (production secrets)npx wrangler secret put API_KEYnpx wrangler secret put DATABASE_URL
```
```
TypeError: server.registerTool is not a function
```
```
this.server is undefined
```
```
this.server.tool()
```
```
// ❌ WRONG: Mixing standalone SDK with McpAgentimport { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";const server = new McpServer({ name: "My Server" });server.registerTool(...);  // Not compatible with McpAgent!export class MyMCP extends McpAgent { /* no server property */ }// ✅ CORRECT: McpAgent patternexport class MyMCP extends McpAgent<Env> {  server = new McpServer({    name: "My MCP Server",    version: "1.0.0"  });  async init() {    this.server.tool("tool_name", ...);  // Use this.server  }}
```
```
// ❌ WRONG: Mixing standalone SDK with McpAgentimport { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";const server = new McpServer({ name: "My Server" });server.registerTool(...);  // Not compatible with McpAgent!export class MyMCP extends McpAgent { /* no server property */ }// ✅ CORRECT: McpAgent patternexport class MyMCP extends McpAgent<Env> {  server = new McpServer({    name: "My MCP Server",    version: "1.0.0"  });  async init() {    this.server.tool("tool_name", ...);  // Use this.server  }}
```
```
this.server
```
```
this.state.storage
```
```
// ❌ DON'T: Lost on hibernationthis.userId = "123";// ✅ DO: Persists through hibernationawait this.state.storage.put("userId", "123");
```
```
// ❌ DON'T: Lost on hibernationthis.userId = "123";// ✅ DO: Persists through hibernationawait this.state.storage.put("userId", "123");
```
```
TypeError: Cannot read properties of undefined (reading 'idFromName')
```
```
{  "durable_objects": {    "bindings": [      {        "name": "MY_MCP",        "class_name": "MyMCP",        "script_name": "my-mcp-server"      }    ]  }}
```
```
{  "durable_objects": {    "bindings": [      {        "name": "MY_MCP",        "class_name": "MyMCP",        "script_name": "my-mcp-server"      }    ]  }}
```
```
Error: Durable Object class MyMCP has no migration defined
```
```
{  "migrations": [    { "tag": "v1", "new_classes": ["MyMCP"] }  ]}
```
```
{  "migrations": [    { "tag": "v1", "new_classes": ["MyMCP"] }  ]}
```
```
serializeAttachment()
```
```
allowConsentScreen: false
```
```
export default new OAuthProvider({  allowConsentScreen: true,  // ✅ Always true in production  // ...});
```
```
export default new OAuthProvider({  allowConsentScreen: true,  // ✅ Always true in production  // ...});
```
```
Error: JWT_SIGNING_KEY environment variable not set
```
```
# Generate secure keyopenssl rand -base64 32# Add to wrangler secretnpx wrangler secret put JWT_SIGNING_KEY
```
```
# Generate secure keyopenssl rand -base64 32# Add to wrangler secretnpx wrangler secret put JWT_SIGNING_KEY
```
```
ZodError: Invalid input type
```
```
// Accept string, convert to numberparam: z.string().transform(val => parseInt(val, 10))// Or: Accept both typesparam: z.union([z.string(), z.number()]).transform(val =>  typeof val === "string" ? parseInt(val, 10) : val)
```
```
// Accept string, convert to numberparam: z.string().transform(val => parseInt(val, 10))// Or: Accept both typesparam: z.union([z.string(), z.number()]).transform(val =>  typeof val === "string" ? parseInt(val, 10) : val)
```
```
/sse
```
```
/mcp
```
```
startsWith()
```
```
startsWith()
```
```
npx wrangler dev --remote
```
```
# Local simulation (faster but limited)npm run dev# Remote DOs (slower but accurate)npx wrangler dev --remote
```
```
# Local simulation (faster but limited)npm run dev# Remote DOs (slower but accurate)npx wrangler dev --remote
```
```
claude_desktop_config.json
```
```
// ❌ WRONG: Missing "mcpServers" wrapper{  "my-mcp": {    "url": "https://worker.dev/sse"  }}// ❌ WRONG: Trailing comma{  "mcpServers": {    "my-mcp": {      "url": "https://worker.dev/sse",  // ← Remove comma    }  }}// ✅ CORRECT{  "mcpServers": {    "my-mcp": {      "url": "https://worker.dev/sse"    }  }}
```
```
// ❌ WRONG: Missing "mcpServers" wrapper{  "my-mcp": {    "url": "https://worker.dev/sse"  }}// ❌ WRONG: Trailing comma{  "mcpServers": {    "my-mcp": {      "url": "https://worker.dev/sse",  // ← Remove comma    }  }}// ✅ CORRECT{  "mcpServers": {    "my-mcp": {      "url": "https://worker.dev/sse"    }  }}
```
```
curl https://my-mcp.workers.dev/health# Should return: {"status":"ok","transports":{...}}
```
```
curl https://my-mcp.workers.dev/health# Should return: {"status":"ok","transports":{...}}
```
```
Access to fetch at '...' blocked by CORS policy
```
```
// Manual CORS (if not using OAuthProvider)const corsHeaders = {  "Access-Control-Allow-Origin": "*",  // Or specific origin  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  "Access-Control-Allow-Headers": "Content-Type, Authorization"};// Add to responsesreturn new Response(body, {  headers: {    ...corsHeaders,    "Content-Type": "application/json"  }});
```
```
// Manual CORS (if not using OAuthProvider)const corsHeaders = {  "Access-Control-Allow-Origin": "*",  // Or specific origin  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  "Access-Control-Allow-Headers": "Content-Type, Authorization"};// Add to responsesreturn new Response(body, {  headers: {    ...corsHeaders,    "Content-Type": "application/json"  }});
```
```
IoContext timed out due to inactivity, waitUntil tasks were cancelled
```
```
McpAgent
```
```
/mcp
```
```
// Custom Bearer auth without OAuthProvider wrapperexport default {  fetch: async (req, env, ctx) => {    const authHeader = req.headers.get("Authorization");    if (!authHeader?.startsWith("Bearer ")) {      return new Response("Unauthorized", { status: 401 });    }    if (url.pathname === "/sse") {      return MyMCP.serveSSE("/sse")(req, env, ctx);  // ← Timeout here    }    return new Response("Not found", { status: 404 });  }};
```
```
// Custom Bearer auth without OAuthProvider wrapperexport default {  fetch: async (req, env, ctx) => {    const authHeader = req.headers.get("Authorization");    if (!authHeader?.startsWith("Bearer ")) {      return new Response("Unauthorized", { status: 401 });    }    if (url.pathname === "/sse") {      return MyMCP.serveSSE("/sse")(req, env, ctx);  // ← Timeout here    }    return new Response("Not found", { status: 404 });  }};
```
```
OAuthProvider
```
```
CloudflareMCPServer
```
```
McpServer
```
```
// Use OAuthProvider wrapper (recommended)import { OAuthProvider } from "@cloudflare/workers-oauth-provider";export default new OAuthProvider({  authorizeEndpoint: "/authorize",  tokenEndpoint: "/token",  // ... OAuth config  apiHandlers: { "/sse": MyMCP.serveSSE("/sse") }});
```
```
// Use OAuthProvider wrapper (recommended)import { OAuthProvider } from "@cloudflare/workers-oauth-provider";export default new OAuthProvider({  authorizeEndpoint: "/authorize",  tokenEndpoint: "/token",  // ... OAuth config  apiHandlers: { "/sse": MyMCP.serveSSE("/sse") }});
```
```
// Check token is being passed to remote server   console.log("Connecting with token:", token ? "present" : "missing");
```
```
// Check token is being passed to remote server   console.log("Connecting with token:", token ? "present" : "missing");
```
```
// Ensure Worker can reach OAuth endpoints   const response = await fetch("https://oauth-provider.com/token");
```
```
// Ensure Worker can reach OAuth endpoints   const response = await fetch("https://oauth-provider.com/token");
```
```
// OAuth provider must allow Worker origin   headers: {     "Access-Control-Allow-Origin": "https://your-worker.workers.dev",     "Access-Control-Allow-Methods": "POST, OPTIONS",     "Access-Control-Allow-Headers": "Content-Type, Authorization"   }
```
```
// OAuth provider must allow Worker origin   headers: {     "Access-Control-Allow-Origin": "https://your-worker.workers.dev",     "Access-Control-Allow-Methods": "POST, OPTIONS",     "Access-Control-Allow-Headers": "Content-Type, Authorization"   }
```
```
{     "url": "https://mcp.workers.dev/sse",     "auth": {       "authorizationUrl": "https://mcp.workers.dev/authorize",  // Must match deployed domain       "tokenUrl": "https://mcp.workers.dev/token"     }   }
```
```
{     "url": "https://mcp.workers.dev/sse",     "auth": {       "authorizationUrl": "https://mcp.workers.dev/authorize",  // Must match deployed domain       "tokenUrl": "https://mcp.workers.dev/token"     }   }
```
```
wrangler secret
```
```
# Local devnpm run dev                    # Miniflare (fast)npx wrangler dev --remote      # Remote DOs (accurate)# Test with MCP Inspectornpx @modelcontextprotocol/inspector@latest# Open http://localhost:5173, enter http://localhost:8788/sse# Deploynpx wrangler login  # First time onlynpx wrangler deploy# ⚠️ CRITICAL: Update client config with deployed URL!# Monitor logsnpx wrangler tail
```
```
# Local devnpm run dev                    # Miniflare (fast)npx wrangler dev --remote      # Remote DOs (accurate)# Test with MCP Inspectornpx @modelcontextprotocol/inspector@latest# Open http://localhost:5173, enter http://localhost:8788/sse# Deploynpx wrangler login  # First time onlynpx wrangler deploy# ⚠️ CRITICAL: Update client config with deployed URL!# Monitor logsnpx wrangler tail
```
```
/* ❌ Server and client paths don't match */// Server:app.get('/sse', (c) => mcp.serveSSE('/sse').fetch(c.req.raw, c.env))// Client config:{ "url": "https://worker.dev/mcp" } // Wrong path!/* ✅ Test with curl, match exactly */// 1. Test: curl https://worker.dev/sse// 2. Use same URL in client config{ "url": "https://worker.dev/sse" }
```
```
/* ❌ Server and client paths don't match */// Server:app.get('/sse', (c) => mcp.serveSSE('/sse').fetch(c.req.raw, c.env))// Client config:{ "url": "https://worker.dev/mcp" } // Wrong path!/* ✅ Test with curl, match exactly */// 1. Test: curl https://worker.dev/sse// 2. Use same URL in client config{ "url": "https://worker.dev/sse" }
```
```
/* ❌ "Binding not found" error */class MyMcpAgent extends McpAgent { }/* ✅ Export the class */export class MyMcpAgent extends McpAgent { }
```
```
/* ❌ "Binding not found" error */class MyMcpAgent extends McpAgent { }/* ✅ Export the class */export class MyMcpAgent extends McpAgent { }
```
```
/* ❌ Exact match breaks sub-paths */if (pathname === '/sse') { }/* ✅ Use startsWith */if (pathname.startsWith('/sse')) { }
```
```
/* ❌ Exact match breaks sub-paths */if (pathname === '/sse') { }/* ✅ Use startsWith */if (pathname.startsWith('/sse')) { }
```
```
/* ❌ Browser clients blocked by CORS preflight */app.get('/sse', handler)/* ✅ Handle OPTIONS for browser clients */app.options('/sse', (c) => {  return new Response(null, {    headers: {      'Access-Control-Allow-Origin': '*',      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',      'Access-Control-Allow-Headers': 'Content-Type',    },  })})app.get('/sse', handler)
```
```
/* ❌ Browser clients blocked by CORS preflight */app.get('/sse', handler)/* ✅ Handle OPTIONS for browser clients */app.options('/sse', (c) => {  return new Response(null, {    headers: {      'Access-Control-Allow-Origin': '*',      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',      'Access-Control-Allow-Headers': 'Content-Type',    },  })})app.get('/sse', handler)
```
```
/* ❌ Works in dev, fails after deploy */// OAuth configured for localhost// Deployed to worker.dev/* ✅ Update ALL OAuth URLs after deployment */// 1. Update OAuth provider settings// 2. Update client config// 3. Test with curl before integrating
```
```
/* ❌ Works in dev, fails after deploy */// OAuth configured for localhost// Deployed to worker.dev/* ✅ Update ALL OAuth URLs after deployment */// 1. Update OAuth provider settings// 2. Update client config// 3. Test with curl before integrating
```
```
/* ❌ Instance properties lost on hibernation */class MyAgent extends McpAgent {  userData = {} // Lost!}/* ✅ Use this.state.storage */class MyAgent extends McpAgent {  async saveData(data) {    await this.state.storage.put('userData', data)  }  async getData() {    return await this.state.storage.get('userData')  }}
```
```
/* ❌ Instance properties lost on hibernation */class MyAgent extends McpAgent {  userData = {} // Lost!}/* ✅ Use this.state.storage */class MyAgent extends McpAgent {  async saveData(data) {    await this.state.storage.put('userData', data)  }  async getData() {    return await this.state.storage.get('userData')  }}
```
```
/* ✅ wrangler.jsonc */{  "durable_objects": {    "bindings": [{ "name": "MCP_AGENT", "class_name": "MyMcpAgent" }]  },  "migrations": [    { "tag": "v1", "new_classes": ["MyMcpAgent"] }  ]}
```
```
/* ✅ wrangler.jsonc */{  "durable_objects": {    "bindings": [{ "name": "MCP_AGENT", "class_name": "MyMcpAgent" }]  },  "migrations": [    { "tag": "v1", "new_classes": ["MyMcpAgent"] }  ]}
```
```
export class MyMcpAgent
```
```
pathname === '/sse'
```
```
pathname.startsWith('/sse')
```
```
this.state.storage
```
This specialized agent skill empowers developers to master the deployment of Model Context Protocol (MCP) servers directly onto Cloudflare's robust Workers platform. Designed for AI agents like Claude Code and Cursor, it demystifies the complexities of serverless backend development for advanced AI applications. By leveraging this skill, you can confidently build high-performance, scalable MCP servers, ensuring seamless interaction with your AI models and avoiding common pitfalls in distributed system architecture.

# When to Use This Skill
- •Deploying custom AI agent backends that require Model Context Protocol for stateful interactions.
- •Building serverless APIs for AI applications on Cloudflare Workers, integrating with various services.
- •Developing robust authentication and authorization flows for AI agents using Cloudflare's OAuth provider.
- •Creating real-time interactive AI experiences that leverage HTTP Streamable Transport for efficient communication.

# Pro Tips
- 💡Always validate your Cloudflare Worker routes and `wrangler.toml` configuration carefully, as URL path mismatches are the most common deployment issue for MCP servers.
- 💡Leverage Cloudflare's built-in OAuth provider (`@cloudflare/workers-oauth-provider`) for secure authentication of your MCP agents, ensuring proper access control and user management.
- 💡Utilize TypeScript's strong typing throughout your MCP server development to catch errors early and maintain code quality, especially when integrating with the `@modelcontextprotocol/sdk`.

