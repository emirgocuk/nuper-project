# OpenAI Apps MCP
Source: https://antigravity.codes/agent-skills/ai-tools/openai-apps-mcp

## AI Worker Instructions
When the user requests functionality related to OpenAI Apps MCP, follow these guidelines and utilize this context.

## Scraped Content

# OpenAI Apps MCP
```
cloudflare-worker-base
```
```
hono-routing
```
```
npm create cloudflare@latest my-openai-app -- --type hello-world --ts --git --deploy falsecd my-openai-appnpm install @modelcontextprotocol/sdk@1.25.3 hono@4.11.3 zod@4.3.5npm install -D @cloudflare/vite-plugin@1.17.1 vite@7.2.4
```
```
npm create cloudflare@latest my-openai-app -- --type hello-world --ts --git --deploy falsecd my-openai-appnpm install @modelcontextprotocol/sdk@1.25.3 hono@4.11.3 zod@4.3.5npm install -D @cloudflare/vite-plugin@1.17.1 vite@7.2.4
```
```
{  "name": "my-openai-app",  "main": "dist/index.js",  "compatibility_flags": ["nodejs_compat"],  // Required for MCP SDK  "assets": {    "directory": "dist/client",    "binding": "ASSETS"  // Must match TypeScript  }}
```
```
{  "name": "my-openai-app",  "main": "dist/index.js",  "compatibility_flags": ["nodejs_compat"],  // Required for MCP SDK  "assets": {    "directory": "dist/client",    "binding": "ASSETS"  // Must match TypeScript  }}
```
```
src/index.ts
```
```
import { Hono } from 'hono';import { cors } from 'hono/cors';import { Server } from '@modelcontextprotocol/sdk/server/index.js';import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';const app = new Hono<{ Bindings: { ASSETS: Fetcher } }>();// CRITICAL: Must allow chatgpt.comapp.use('/mcp/*', cors({ origin: 'https://chatgpt.com' }));const mcpServer = new Server(  { name: 'my-app', version: '1.0.0' },  { capabilities: { tools: {}, resources: {} } });// Tool registrationmcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({  tools: [{    name: 'hello',    description: 'Use this when user wants to see a greeting',    inputSchema: {      type: 'object',      properties: { name: { type: 'string' } },      required: ['name']    },    annotations: {      openai: { outputTemplate: 'ui://widget/hello.html' }  // Widget URI    }  }]}));// Tool executionmcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {  if (request.params.name === 'hello') {    const { name } = request.params.arguments as { name: string };    return {      content: [{ type: 'text', text: Hello, ${name}! }],      _meta: { initialData: { name } }  // Passed to widget    };  }  throw new Error(Unknown tool: ${request.params.name});});app.post('/mcp', async (c) => {  const body = await c.req.json();  const response = await mcpServer.handleRequest(body);  return c.json(response);});app.get('/widgets/*', async (c) => c.env.ASSETS.fetch(c.req.raw));export default app;
```
```
import { Hono } from 'hono';import { cors } from 'hono/cors';import { Server } from '@modelcontextprotocol/sdk/server/index.js';import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';const app = new Hono<{ Bindings: { ASSETS: Fetcher } }>();// CRITICAL: Must allow chatgpt.comapp.use('/mcp/*', cors({ origin: 'https://chatgpt.com' }));const mcpServer = new Server(  { name: 'my-app', version: '1.0.0' },  { capabilities: { tools: {}, resources: {} } });// Tool registrationmcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({  tools: [{    name: 'hello',    description: 'Use this when user wants to see a greeting',    inputSchema: {      type: 'object',      properties: { name: { type: 'string' } },      required: ['name']    },    annotations: {      openai: { outputTemplate: 'ui://widget/hello.html' }  // Widget URI    }  }]}));// Tool executionmcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {  if (request.params.name === 'hello') {    const { name } = request.params.arguments as { name: string };    return {      content: [{ type: 'text', text: Hello, ${name}! }],      _meta: { initialData: { name } }  // Passed to widget    };  }  throw new Error(Unknown tool: ${request.params.name});});app.post('/mcp', async (c) => {  const body = await c.req.json();  const response = await mcpServer.handleRequest(body);  return c.json(response);});app.get('/widgets/*', async (c) => c.env.ASSETS.fetch(c.req.raw));export default app;
```
```
Hello, ${name}!
```
```
Unknown tool: ${request.params.name}
```
```
src/widgets/hello.html
```
```
<!DOCTYPE html><html><head>  <style>    body { margin: 0; padding: 20px; font-family: system-ui; }  </style></head><body>  <div id="greeting">Loading...</div>  <script>    if (window.openai && window.openai.getInitialData) {      const data = window.openai.getInitialData();      document.getElementById('greeting').textContent = Hello, ${data.name}! 👋;    }  </script></body></html>
```
```
<!DOCTYPE html><html><head>  <style>    body { margin: 0; padding: 20px; font-family: system-ui; }  </style></head><body>  <div id="greeting">Loading...</div>  <script>    if (window.openai && window.openai.getInitialData) {      const data = window.openai.getInitialData();      document.getElementById('greeting').textContent = Hello, ${data.name}! 👋;    }  </script></body></html>
```
```
Hello, ${data.name}! 👋
```
```
npm run buildnpx wrangler deploynpx @modelcontextprotocol/inspector https://my-app.workers.dev/mcp
```
```
npm run buildnpx wrangler deploynpx @modelcontextprotocol/inspector https://my-app.workers.dev/mcp
```
```
https://chatgpt.com
```
```
/mcp/*
```
```
ui://widget/
```
```
ui://widget/map.html
```
```
text/html+skybridge
```
```
_meta.initialData
```
```
window.openai.getInitialData()
```
```
Access to fetch blocked by CORS policy
```
```
app.use('/mcp/*', cors({ origin: 'https://chatgpt.com' }))
```
```
404 (Not Found)
```
```
ui://widget/
```
```
resource://
```
```
/widgets/
```
```
annotations: { openai: { outputTemplate: 'ui://widget/map.html' } }
```
```
annotations: { openai: { outputTemplate: 'ui://widget/map.html' } }
```
```
text/html+skybridge
```
```
text/html
```
```
server.setRequestHandler(ListResourcesRequestSchema, async () => ({  resources: [{ uri: 'ui://widget/map.html', mimeType: 'text/html+skybridge' }]}));
```
```
server.setRequestHandler(ListResourcesRequestSchema, async () => ({  resources: [{ uri: 'ui://widget/map.html', mimeType: 'text/html+skybridge' }]}));
```
```
TypeError: Cannot read property 'fetch' of undefined
```
```
{ "assets": { "binding": "ASSETS" } }  // wrangler.jsonc
```
```
{ "assets": { "binding": "ASSETS" } }  // wrangler.jsonc
```
```
type Bindings = { ASSETS: Fetcher };  // index.ts
```
```
type Bindings = { ASSETS: Fetcher };  // index.ts
```
```
const heartbeat = setInterval(async () => {  await stream.writeSSE({ data: JSON.stringify({ type: 'heartbeat' }), event: 'ping' });}, 30000);
```
```
const heartbeat = setInterval(async () => {  await stream.writeSSE({ data: JSON.stringify({ type: 'heartbeat' }), event: 'ping' });}, 30000);
```
```
// ✅ Good: 'Use this when user wants to see a location on a map'// ❌ Bad: 'Shows a map'
```
```
// ✅ Good: 'Use this when user wants to see a location on a map'// ❌ Bad: 'Shows a map'
```
```
window.openai.getInitialData()
```
```
undefined
```
```
_meta.initialData
```
```
return {  content: [{ type: 'text', text: 'Here is your map' }],  _meta: { initialData: { location: 'SF', zoom: 12 } }};
```
```
return {  content: [{ type: 'text', text: 'Here is your map' }],  _meta: { initialData: { location: 'SF', zoom: 12 } }};
```
```
Refused to load script (CSP directive)
```
```
<!-- ✅ Works --> <script>console.log('ok');</script><!-- ❌ Blocked --> <script src="https://cdn.example.com/lib.js"></script>
```
```
<!-- ✅ Works --> <script>console.log('ok');</script><!-- ❌ Blocked --> <script src="https://cdn.example.com/lib.js"></script>
```
```
No response is returned from route handler
```
```
global.Response
```
```
webStandardStreamableHTTPServerTransport
```
```
// ✅ v1.25.3+ - Fixedconst transport = new StreamableHTTPServerTransport({  sessionIdGenerator: undefined,});// ✅ v1.25.0-1.25.2 - Workaroundimport { webStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/index.js';const transport = webStandardStreamableHTTPServerTransport({  sessionIdGenerator: undefined,});
```
```
// ✅ v1.25.3+ - Fixedconst transport = new StreamableHTTPServerTransport({  sessionIdGenerator: undefined,});// ✅ v1.25.0-1.25.2 - Workaroundimport { webStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/index.js';const transport = webStandardStreamableHTTPServerTransport({  sessionIdGenerator: undefined,});
```
```
EvalError: Code generation from strings disallowed
```
```
elicitInput()
```
```
// ❌ Don't use on Cloudflare Workersconst userInput = await server.elicitInput({  prompt: "What is your name?",  schema: { type: "string" }});// ✅ Use tool parameters insteadserver.setRequestHandler(CallToolRequestSchema, async (request) => {  const { name } = request.params.arguments as { name: string };  // User provides via tool call, not elicitation});
```
```
// ❌ Don't use on Cloudflare Workersconst userInput = await server.elicitInput({  prompt: "What is your name?",  schema: { type: "string" }});// ✅ Use tool parameters insteadserver.setRequestHandler(CallToolRequestSchema, async (request) => {  const { name } = request.params.arguments as { name: string };  // User provides via tool call, not elicitation});
```
```
400: No transport found for sessionId
```
```
SSEServerTransport
```
```
GET /sse
```
```
POST /messages
```
```
# Development OAuth AppCallback URL: http://localhost:8788/callback# Production OAuth AppCallback URL: https://my-mcp-server.workers.dev/callback
```
```
# Development OAuth AppCallback URL: http://localhost:8788/callback# Production OAuth AppCallback URL: https://my-mcp-server.workers.dev/callback
```
```
COOKIE_ENCRYPTION_KEY
```
```
openssl rand -hex 32
```
```
// ✅ Good - Lightweight statewindow.openai.setWidgetState({ selectedId: "item-123", view: "grid" });// ❌ Bad - Will cause performance issueswindow.openai.setWidgetState({  items: largeArray,           // Don't store full datasets  history: conversationLog,    // Don't store conversation history  cache: expensiveComputation  // Don't cache large results});
```
```
// ✅ Good - Lightweight statewindow.openai.setWidgetState({ selectedId: "item-123", view: "grid" });// ❌ Bad - Will cause performance issueswindow.openai.setWidgetState({  items: largeArray,           // Don't store full datasets  history: conversationLog,    // Don't store conversation history  cache: expensiveComputation  // Don't cache large results});
```
```
window.openai.callTool()
```
```
widgetCallable: true
```
```
// MCP Server - Mark tool as widget-callableserver.setRequestHandler(ListToolsRequestSchema, async () => ({  tools: [{    name: 'update_item',    description: 'Update an item',    inputSchema: { /* ... */ },    annotations: {      openai: {        outputTemplate: 'ui://widget/item.html',        // ✅ Required for widget-initiated calls        widgetCallable: true      }    }  }]}));// Widget - Now allowed to call toolwindow.openai.callTool({  name: 'update_item',  arguments: { id: itemId, status: 'completed' }});
```
```
// MCP Server - Mark tool as widget-callableserver.setRequestHandler(ListToolsRequestSchema, async () => ({  tools: [{    name: 'update_item',    description: 'Update an item',    inputSchema: { /* ... */ },    annotations: {      openai: {        outputTemplate: 'ui://widget/item.html',        // ✅ Required for widget-initiated calls        widgetCallable: true      }    }  }]}));// Widget - Now allowed to call toolwindow.openai.callTool({  name: 'update_item',  arguments: { id: itemId, status: 'completed' }});
```
```
window.openai.uploadFile()
```
```
image/png
```
```
image/jpeg
```
```
image/webp
```
```
// ✅ Supportedwindow.openai.uploadFile({ accept: 'image/png,image/jpeg,image/webp' });// ❌ Not supported (fails silently)window.openai.uploadFile({ accept: 'application/pdf' });window.openai.uploadFile({ accept: 'text/csv' });
```
```
// ✅ Supportedwindow.openai.uploadFile({ accept: 'image/png,image/jpeg,image/webp' });// ❌ Not supported (fails silently)window.openai.uploadFile({ accept: 'application/pdf' });window.openai.uploadFile({ accept: 'text/csv' });
```
```
// 1. Cache expensive computationsconst cache = new Map();if (cache.has(key)) return cache.get(key);const result = await expensiveOperation();cache.set(key, result);// 2. Use KV/D1 for pre-computed dataconst cached = await env.KV.get(result:${id});if (cached) return JSON.parse(cached);// 3. Paginate large datasetsreturn {  content: [{ type: 'text', text: 'First 20 results...' }],  _meta: { hasMore: true, nextPage: 2 }};// 4. Move slow work to async tasks// Return immediately, update via follow-up
```
```
// 1. Cache expensive computationsconst cache = new Map();if (cache.has(key)) return cache.get(key);const result = await expensiveOperation();cache.set(key, result);// 2. Use KV/D1 for pre-computed dataconst cached = await env.KV.get(result:${id});if (cached) return JSON.parse(cached);// 3. Paginate large datasetsreturn {  content: [{ type: 'text', text: 'First 20 results...' }],  _meta: { hasMore: true, nextPage: 2 }};// 4. Move slow work to async tasks// Return immediately, update via follow-up
```
```
result:${id}
```
```
setRequestHandler
```
```
// ❌ Old (removed in 1.25.0)import { Tools } from '@modelcontextprotocol/sdk/types.js';// ✅ New (1.25.1+)import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
```
```
// ❌ Old (removed in 1.25.0)import { Tools } from '@modelcontextprotocol/sdk/types.js';// ✅ New (1.25.1+)import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
```
```
.default()
```
```
.prefault()
```
```
error.issues
```
```
error.errors
```
```
.merge()
```
```
.superRefine()
```
```
// Zod 4.xtry {  const validated = schema.parse(data);} catch (error) {  if (error instanceof z.ZodError) {    return { content: [{ type: 'text', text: error.issues.map(e => e.message).join(', ') }] };  }}
```
```
// Zod 4.xtry {  const validated = schema.parse(data);} catch (error) {  if (error instanceof z.ZodError) {    return { content: [{ type: 'text', text: error.issues.map(e => e.message).join(', ') }] };  }}
```
```
{  "dependencies": {    "@modelcontextprotocol/sdk": "^1.25.3",    "hono": "^4.11.3",    "zod": "^4.3.5"  },  "devDependencies": {    "@cloudflare/vite-plugin": "^1.17.1",    "@cloudflare/workers-types": "^4.20260103.0",    "vite": "^7.2.4",    "wrangler": "^4.54.0"  }}
```
```
{  "dependencies": {    "@modelcontextprotocol/sdk": "^1.25.3",    "hono": "^4.11.3",    "zod": "^4.3.5"  },  "devDependencies": {    "@cloudflare/vite-plugin": "^1.17.1",    "@cloudflare/workers-types": "^4.20260103.0",    "vite": "^7.2.4",    "wrangler": "^4.54.0"  }}
```
```
window.openai.toolOutput
```
```
/src/lib/mcp/server.ts
```
```
/src/server/tools/portfolio.ts
```
```
/src/widgets/PortfolioWidget.tsx
```
This skill empowers developers to transcend the standard ChatGPT experience, transforming it into a dynamic platform for specialized applications. By leveraging the Model Context Protocol (MCP) on stateless Cloudflare Workers, users can architect sophisticated AI agents. It enables the creation of custom interactive widgets and integrates bespoke tooling, significantly expanding the utility and responsiveness of AI assistants. This facilitates tailored solutions for complex problems, making AI truly adaptable to specific business or educational requirements.

# When to Use This Skill
- •Developing custom AI assistants with unique UI elements for specific business workflows.
- •Integrating external APIs and services into ChatGPT through custom tools for real-time data access.
- •Creating interactive educational modules powered by ChatGPT that include dynamic HTML/JS components.
- •Building secure, scalable AI applications that extend ChatGPT's capabilities and are deployed on serverless platforms like Cloudflare Workers.

# Pro Tips
- 💡Prioritize security when handling user context and external API calls within your MCP tools, especially when exposing sensitive data.
- 💡Leverage Hono for efficient routing and Zod for robust schema validation of your JSON-RPC payloads to ensure data integrity and reliability.
- 💡Optimize widget performance by minimizing HTML/JS bundle sizes and utilizing modern web techniques, ensuring a responsive user experience within the iframe.
- 💡Make effective use of `nodejs_compat` in Cloudflare Workers to ensure seamless integration with the MCP SDK and other Node.js-compatible libraries.

