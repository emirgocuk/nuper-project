# typescript-mcp
Source: https://antigravity.codes/agent-skills/typescript/typescript-mcp

## AI Worker Instructions
When the user requests functionality related to typescript-mcp, follow these guidelines and utilize this context.

## Scraped Content

# typescript-mcp
```
npm install @modelcontextprotocol/sdk@latest hono zodnpm install -D @cloudflare/workers-types wrangler typescript
```
```
npm install @modelcontextprotocol/sdk@latest hono zodnpm install -D @cloudflare/workers-types wrangler typescript
```
```
StreamableHTTPServerTransport
```
```
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';import { Hono } from 'hono';import { z } from 'zod';const server = new McpServer({ name: 'my-mcp-server', version: '1.0.0' });server.registerTool(  'echo',  {    description: 'Echoes back input',    inputSchema: z.object({ text: z.string() })  },  async ({ text }) => ({ content: [{ type: 'text', text }] }));const app = new Hono();app.post('/mcp', async (c) => {  const transport = new StreamableHTTPServerTransport({    sessionIdGenerator: undefined,    enableJsonResponse: true  });  // CRITICAL: Set error handler to catch transport errors  transport.onerror = (error) => {    console.error('MCP transport error:', error);  };  // CRITICAL: Close transport to prevent memory leaks  c.res.raw.on('close', () => transport.close());  await server.connect(transport);  await transport.handleRequest(c.req.raw, c.res.raw, await c.req.json());  return c.body(null);});export default app; // CRITICAL: Direct export, not { fetch: app.fetch }
```
```
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';import { Hono } from 'hono';import { z } from 'zod';const server = new McpServer({ name: 'my-mcp-server', version: '1.0.0' });server.registerTool(  'echo',  {    description: 'Echoes back input',    inputSchema: z.object({ text: z.string() })  },  async ({ text }) => ({ content: [{ type: 'text', text }] }));const app = new Hono();app.post('/mcp', async (c) => {  const transport = new StreamableHTTPServerTransport({    sessionIdGenerator: undefined,    enableJsonResponse: true  });  // CRITICAL: Set error handler to catch transport errors  transport.onerror = (error) => {    console.error('MCP transport error:', error);  };  // CRITICAL: Close transport to prevent memory leaks  c.res.raw.on('close', () => transport.close());  await server.connect(transport);  await transport.handleRequest(c.req.raw, c.res.raw, await c.req.json());  return c.body(null);});export default app; // CRITICAL: Direct export, not { fetch: app.fetch }
```
```
wrangler deploy
```
```
app.use('/mcp', async (c, next) => {  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '');  const isValid = await c.env.MCP_API_KEYS.get(key:${apiKey});  if (!isValid) return c.json({ error: 'Unauthorized' }, 403);  await next();});
```
```
app.use('/mcp', async (c, next) => {  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '');  const isValid = await c.env.MCP_API_KEYS.get(key:${apiKey});  if (!isValid) return c.json({ error: 'Unauthorized' }, 403);  await next();});
```
```
key:${apiKey}
```
```
const jwt = c.req.header('Cf-Access-Jwt-Assertion');const payload = await verifyJWT(jwt, c.env.CF_ACCESS_TEAM_DOMAIN);
```
```
const jwt = c.req.header('Cf-Access-Jwt-Assertion');const payload = await verifyJWT(jwt, c.env.CF_ACCESS_TEAM_DOMAIN);
```
```
working
```
```
input_required
```
```
completed
```
```
failed
```
```
cancelled
```
```
const server = new McpServer({  name: 'my-server',  version: '1.0.0',  capabilities: {    tasks: {      list: {},      cancel: {},      requests: {        tools: { call: {} }      }    }  }});
```
```
const server = new McpServer({  name: 'my-server',  version: '1.0.0',  capabilities: {    tasks: {      list: {},      cancel: {},      requests: {        tools: { call: {} }      }    }  }});
```
```
server.registerTool(  'long-running-analysis',  {    description: 'Analyze large dataset',    inputSchema: z.object({ datasetId: z.string() }),    execution: { taskSupport: 'optional' }  // 'forbidden' | 'optional' | 'required'  },  async ({ datasetId }, extra) => {    // If invoked as task, extra.task contains taskId    const result = await performAnalysis(datasetId);    return { content: [{ type: 'text', text: JSON.stringify(result) }] };  });
```
```
server.registerTool(  'long-running-analysis',  {    description: 'Analyze large dataset',    inputSchema: z.object({ datasetId: z.string() }),    execution: { taskSupport: 'optional' }  // 'forbidden' | 'optional' | 'required'  },  async ({ datasetId }, extra) => {    // If invoked as task, extra.task contains taskId    const result = await performAnalysis(datasetId);    return { content: [{ type: 'text', text: JSON.stringify(result) }] };  });
```
```
{  "method": "tools/call",  "params": {    "name": "long-running-analysis",    "arguments": { "datasetId": "abc123" },    "task": { "ttl": 60000 }  }}
```
```
{  "method": "tools/call",  "params": {    "name": "long-running-analysis",    "arguments": { "datasetId": "abc123" },    "task": { "ttl": 60000 }  }}
```
```
task
```
```
taskId
```
```
tasks/get
```
```
taskId
```
```
completed
```
```
tasks/result
```
```
tasks/cancel
```
```
// Server initiates sampling with tools availableconst result = await server.requestSampling({  messages: [{ role: 'user', content: 'Analyze this data and fetch more if needed' }],  maxTokens: 4096,  tools: [    {      name: 'fetch_data',      description: 'Fetch additional data from API',      inputSchema: { type: 'object', properties: { query: { type: 'string' } } }    }  ]});// Handle tool calls in responseif (result.content[0].type === 'tool_use') {  const toolResult = await executeLocalTool(result.content[0]);  // Continue conversation with tool result...}
```
```
// Server initiates sampling with tools availableconst result = await server.requestSampling({  messages: [{ role: 'user', content: 'Analyze this data and fetch more if needed' }],  maxTokens: 4096,  tools: [    {      name: 'fetch_data',      description: 'Fetch additional data from API',      inputSchema: { type: 'object', properties: { query: { type: 'string' } } }    }  ]});// Handle tool calls in responseif (result.content[0].type === 'tool_use') {  const toolResult = await executeLocalTool(result.content[0]);  // Continue conversation with tool result...}
```
```
tools/list
```
```
server.registerTool('query-db', {  inputSchema: z.object({ query: z.string(), params: z.array(z.union([z.string(), z.number()])).optional() })}, async ({ query, params }, env) => {  const result = await env.DB.prepare(query).bind(...(params || [])).all();  return { content: [{ type: 'text', text: JSON.stringify(result.results) }] };});
```
```
server.registerTool('query-db', {  inputSchema: z.object({ query: z.string(), params: z.array(z.union([z.string(), z.number()])).optional() })}, async ({ query, params }, env) => {  const result = await env.DB.prepare(query).bind(...(params || [])).all();  return { content: [{ type: 'text', text: JSON.stringify(result.results) }] };});
```
```
references/cloudflare-integration.md
```
```
"Cannot read properties of undefined (reading 'map')"
```
```
// ❌ WRONG - Causes cryptic build errorsexport default { fetch: app.fetch };// ✅ CORRECT - Direct exportexport default app;
```
```
// ❌ WRONG - Causes cryptic build errorsexport default { fetch: app.fetch };// ✅ CORRECT - Direct exportexport default app;
```
```
app.post('/mcp', async (c) => {  const transport = new StreamableHTTPServerTransport(/*...*/);  // CRITICAL: Always close on response end  c.res.raw.on('close', () => transport.close());  // ... handle request});
```
```
app.post('/mcp', async (c) => {  const transport = new StreamableHTTPServerTransport(/*...*/);  // CRITICAL: Always close on response end  c.res.raw.on('close', () => transport.close());  // ... handle request});
```
```
ListTools request handler fails to generate inputSchema
```
```
// ✅ CORRECT - SDK handles Zod schema conversion automaticallyserver.registerTool(  'tool-name',  {    inputSchema: z.object({ a: z.number() })  },  handler);// No need for manual zodToJsonSchema() unless custom validation
```
```
// ✅ CORRECT - SDK handles Zod schema conversion automaticallyserver.registerTool(  'tool-name',  {    inputSchema: z.object({ a: z.number() })  },  handler);// No need for manual zodToJsonSchema() unless custom validation
```
```
undefined
```
```
const schema = z.object({ a: z.number(), b: z.number() });type Input = z.infer<typeof schema>;server.registerTool(  'add',  { inputSchema: schema },  async (args: Input) => {    // args.a and args.b properly typed and passed    return { content: [{ type: 'text', text: String(args.a + args.b) }] };  });
```
```
const schema = z.object({ a: z.number(), b: z.number() });type Input = z.infer<typeof schema>;server.registerTool(  'add',  { inputSchema: schema },  async (args: Input) => {    // args.a and args.b properly typed and passed    return { content: [{ type: 'text', text: String(args.a + args.b) }] };  });
```
```
import { cors } from 'hono/cors';app.use('/mcp', cors({  origin: ['http://localhost:3000', 'https://your-app.com'],  allowMethods: ['POST', 'OPTIONS'],  allowHeaders: ['Content-Type', 'Authorization']}));
```
```
import { cors } from 'hono/cors';app.use('/mcp', cors({  origin: ['http://localhost:3000', 'https://your-app.com'],  allowMethods: ['POST', 'OPTIONS'],  allowHeaders: ['Content-Type', 'Authorization']}));
```
```
app.post('/mcp', async (c) => {  const ip = c.req.header('CF-Connecting-IP');  const rateLimitKey = ratelimit:${ip};  const count = await c.env.CACHE.get(rateLimitKey);  if (count && parseInt(count) > 100) {    return c.json({ error: 'Rate limit exceeded' }, 429);  }  await c.env.CACHE.put(    rateLimitKey,    String((parseInt(count || '0') + 1)),    { expirationTtl: 60 }  );  // Continue...});
```
```
app.post('/mcp', async (c) => {  const ip = c.req.header('CF-Connecting-IP');  const rateLimitKey = ratelimit:${ip};  const count = await c.env.CACHE.get(rateLimitKey);  if (count && parseInt(count) > 100) {    return c.json({ error: 'Rate limit exceeded' }, 429);  }  await c.env.CACHE.put(    rateLimitKey,    String((parseInt(count || '0') + 1)),    { expirationTtl: 60 }  );  // Continue...});
```
```
ratelimit:${ip}
```
```
Out of memory
```
```
tsc
```
```
# Add to package.json scripts"build": "NODE_OPTIONS='--max-old-space-size=4096' tsc && vite build"
```
```
# Add to package.json scripts"build": "NODE_OPTIONS='--max-old-space-size=4096' tsc && vite build"
```
```
// ❌ WRONG - Exposes secretsconsole.log('Env:', JSON.stringify(env));// ✅ CORRECT - Never log env objectstry {  // ... use env.SECRET_KEY} catch (error) {  // Don't include env in error context  console.error('Operation failed:', error.message);}
```
```
// ❌ WRONG - Exposes secretsconsole.log('Env:', JSON.stringify(env));// ✅ CORRECT - Never log env objectstry {  // ... use env.SECRET_KEY} catch (error) {  // Don't include env in error context  console.error('Operation failed:', error.message);}
```
```
AbortError: This operation was aborted
```
```
Server.connect(transport)
```
```
// ✅ CORRECT - Create fresh McpServer per HTTP sessionapp.post('/mcp', async (c) => {  const server = new McpServer({ name: 'my-server', version: '1.0.0' });  // Register tools per request  server.registerTool('echo', { inputSchema: z.object({ text: z.string() }) },    async ({ text }) => ({ content: [{ type: 'text', text }] })  );  const transport = new StreamableHTTPServerTransport({    sessionIdGenerator: undefined,    enableJsonResponse: true  });  transport.onerror = (error) => console.error('Transport error:', error);  c.res.raw.on('close', () => transport.close());  await server.connect(transport);  await transport.handleRequest(c.req.raw, c.res.raw, await c.req.json());  return c.body(null);});// ❌ WRONG - Reusing server instance across sessionsconst sharedServer = new McpServer({ name: 'my-server', version: '1.0.0' });app.post('/mcp', async (c) => {  await sharedServer.connect(transport); // Breaks previous sessions!});
```
```
// ✅ CORRECT - Create fresh McpServer per HTTP sessionapp.post('/mcp', async (c) => {  const server = new McpServer({ name: 'my-server', version: '1.0.0' });  // Register tools per request  server.registerTool('echo', { inputSchema: z.object({ text: z.string() }) },    async ({ text }) => ({ content: [{ type: 'text', text }] })  );  const transport = new StreamableHTTPServerTransport({    sessionIdGenerator: undefined,    enableJsonResponse: true  });  transport.onerror = (error) => console.error('Transport error:', error);  c.res.raw.on('close', () => transport.close());  await server.connect(transport);  await transport.handleRequest(c.req.raw, c.res.raw, await c.req.json());  return c.body(null);});// ❌ WRONG - Reusing server instance across sessionsconst sharedServer = new McpServer({ name: 'my-server', version: '1.0.0' });app.post('/mcp', async (c) => {  await sharedServer.connect(transport); // Breaks previous sessions!});
```
```
Type 'undefined' is not assignable to type '() => string'
```
```
exactOptionalPropertyTypes: true
```
```
// With exactOptionalPropertyTypes: true// ✅ CORRECT - Omit the property instead of setting to undefinedconst transport = new StreamableHTTPServerTransport({  enableJsonResponse: true  // sessionIdGenerator omitted entirely});// ❌ WRONG - Setting to undefined causes type error in SDK 1.25.2const transport = new StreamableHTTPServerTransport({  sessionIdGenerator: undefined,  // Type error!  enableJsonResponse: true});// Alternative: Provide a generator functionconst transport = new StreamableHTTPServerTransport({  sessionIdGenerator: () => crypto.randomUUID(),  enableJsonResponse: true});
```
```
// With exactOptionalPropertyTypes: true// ✅ CORRECT - Omit the property instead of setting to undefinedconst transport = new StreamableHTTPServerTransport({  enableJsonResponse: true  // sessionIdGenerator omitted entirely});// ❌ WRONG - Setting to undefined causes type error in SDK 1.25.2const transport = new StreamableHTTPServerTransport({  sessionIdGenerator: undefined,  // Type error!  enableJsonResponse: true});// Alternative: Provide a generator functionconst transport = new StreamableHTTPServerTransport({  sessionIdGenerator: () => crypto.randomUUID(),  enableJsonResponse: true});
```
```
global.fetch
```
```
// FIXED in SDK v1.25.3 - Update to latest versionnpm install @modelcontextprotocol/sdk@1.25.3// Workaround for older versions (1.25.0-1.25.2):const nativeFetch = global.fetch;import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';global.fetch = nativeFetch; // Restore if needed
```
```
// FIXED in SDK v1.25.3 - Update to latest versionnpm install @modelcontextprotocol/sdk@1.25.3// Workaround for older versions (1.25.0-1.25.2):const nativeFetch = global.fetch;import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';global.fetch = nativeFetch; // Restore if needed
```
```
// Expected error for invalid input:// "Invalid arguments: Too small: expected number to be >=500"// Actual error (confusing):// "Invalid task creation result: expected object, received undefined"// WORKAROUND: Add explicit validation before task logicserver.experimental.tasks.registerToolTask(  'batch_process',  {    inputSchema: z.object({      itemCount: z.number().min(1).max(10),      processingTimeMs: z.number().min(500).max(5000).optional()    })  },  {    createTask: async (args, extra) => {      // SDK should fix this - currently no workaround      // Validation errors are masked by task wrapping    }  });
```
```
// Expected error for invalid input:// "Invalid arguments: Too small: expected number to be >=500"// Actual error (confusing):// "Invalid task creation result: expected object, received undefined"// WORKAROUND: Add explicit validation before task logicserver.experimental.tasks.registerToolTask(  'batch_process',  {    inputSchema: z.object({      itemCount: z.number().min(1).max(10),      processingTimeMs: z.number().min(500).max(5000).optional()    })  },  {    createTask: async (args, extra) => {      // SDK should fix this - currently no workaround      // Validation errors are masked by task wrapping    }  });
```
```
"expected": "object", "received": "undefined"
```
```
arguments
```
```
// ❌ WRONG - All optional fields may cause issuesserver.registerTool('fetch-records', {  inputSchema: z.object({    limit: z.number().optional()  })}, handler);// ✅ CORRECT - Always include at least one required fieldserver.registerTool('fetch-records', {  inputSchema: z.object({    action: z.literal('fetch').default('fetch'),  // Required    limit: z.number().optional()  })}, handler);// Alternative: Use empty object schemaserver.registerTool('fetch-records', {  inputSchema: z.object({}).passthrough()}, handler);
```
```
// ❌ WRONG - All optional fields may cause issuesserver.registerTool('fetch-records', {  inputSchema: z.object({    limit: z.number().optional()  })}, handler);// ✅ CORRECT - Always include at least one required fieldserver.registerTool('fetch-records', {  inputSchema: z.object({    action: z.literal('fetch').default('fetch'),  // Required    limit: z.number().optional()  })}, handler);// Alternative: Use empty object schemaserver.registerTool('fetch-records', {  inputSchema: z.object({}).passthrough()}, handler);
```
```
MaxListenersExceededWarning: Possible EventEmitter memory leak detected
```
```
sendToolListChanged()
```
```
// Workaround: Increase maxListeners before bulk registrationprocess.stdout.setMaxListeners(100);const tools = [...]; // Array of 80+ tool definitionsfor (const tool of tools) {  server.registerTool(tool.name, tool.schema, tool.handler);}// Future SDK may provide batch registration API
```
```
// Workaround: Increase maxListeners before bulk registrationprocess.stdout.setMaxListeners(100);const tools = [...]; // Array of 80+ tool definitionsfor (const tool of tools) {  server.registerTool(tool.name, tool.schema, tool.handler);}// Future SDK may provide batch registration API
```
```
onerror
```
```
// ✅ CORRECT - Always set onerror handlerconst transport = new StreamableHTTPServerTransport({  sessionIdGenerator: undefined,  enableJsonResponse: true});transport.onerror = (error) => {  console.error('Transport error:', error);  // Handle error appropriately};await server.connect(transport);
```
```
// ✅ CORRECT - Always set onerror handlerconst transport = new StreamableHTTPServerTransport({  sessionIdGenerator: undefined,  enableJsonResponse: true});transport.onerror = (error) => {  console.error('Transport error:', error);  // Handle error appropriately};await server.connect(transport);
```
```
qs
```
```
arrayLimit
```
```
?foo[99999999]=bar
```
```
// Validate query parameters to prevent DoSapp.post('/mcp', async (c) => {  const queryParams = c.req.query();  // Reject malicious patterns  if (Object.keys(queryParams).some(key => /\[\d{6,}\]/.test(key))) {    return c.json({ error: 'Invalid query parameters' }, 400);  }  // ... handle request});
```
```
// Validate query parameters to prevent DoSapp.post('/mcp', async (c) => {  const queryParams = c.req.query();  // Reject malicious patterns  if (Object.keys(queryParams).some(key => /\[\d{6,}\]/.test(key))) {    return c.json({ error: 'Invalid query parameters' }, 400);  }  // ... handle request});
```
```
// Workaround: Use AbortController pattern manuallyserver.registerTool(  'long-running-task',  { inputSchema: z.object({ duration: z.number() }) },  async ({ duration }, extra) => {    const abortController = new AbortController();    // Listen for transport close    const transport = extra.transport;    if (transport) {      const originalOnClose = transport.onclose;      transport.onclose = () => {        abortController.abort();        if (originalOnClose) originalOnClose();      };    }    try {      await longRunningTask(duration, abortController.signal);      return { content: [{ type: 'text', text: 'Done' }] };    } catch (error) {      if (error.name === 'AbortError') {        return { content: [{ type: 'text', text: 'Cancelled' }], isError: true };      }      throw error;    }  });
```
```
// Workaround: Use AbortController pattern manuallyserver.registerTool(  'long-running-task',  { inputSchema: z.object({ duration: z.number() }) },  async ({ duration }, extra) => {    const abortController = new AbortController();    // Listen for transport close    const transport = extra.transport;    if (transport) {      const originalOnClose = transport.onclose;      transport.onclose = () => {        abortController.abort();        if (originalOnClose) originalOnClose();      };    }    try {      await longRunningTask(duration, abortController.signal);      return { content: [{ type: 'text', text: 'Done' }] };    } catch (error) {      if (error.name === 'AbortError') {        return { content: [{ type: 'text', text: 'Cancelled' }], isError: true };      }      throw error;    }  });
```
```
can't resolve reference #/$defs/...
```
```
cacheToolOutputSchemas
```
```
listTools()
```
```
# Localwrangler dev  # http://localhost:8787/mcp# Productionwrangler deploy
```
```
# Localwrangler dev  # http://localhost:8787/mcp# Productionwrangler deploy
```
```
npx @modelcontextprotocol/inspector
```
```
basic-mcp-server.ts
```
```
tool-server.ts
```
```
resource-server.ts
```
```
authenticated-server.ts
```
```
tasks-server.ts
```
```
wrangler.jsonc
```
```
tool-patterns.md
```
```
authentication-guide.md
```
```
testing-guide.md
```
```
cloudflare-integration.md
```
```
common-errors.md
```
```
McpServer
```
```
transport.onerror
```
```
c.res.raw.on('close', () => transport.close())
```
```
export default app
```
```
{ fetch: app.fetch }
```
```
StreamableHTTPServerTransport
```
```
McpServer
```
```
transport.onerror
```
```
/* ❌ Wrong/outdated import */import { Server } from 'mcp'import { MCPServer } from '@modelcontextprotocol/server'/* ✅ Correct import */import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
```
```
/* ❌ Wrong/outdated import */import { Server } from 'mcp'import { MCPServer } from '@modelcontextprotocol/server'/* ✅ Correct import */import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
```
```
/* ❌ Incomplete setup */const server = new McpServer()/* ✅ Full setup with info */import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'const server = new McpServer({  name: 'my-server',  version: '1.0.0',})// Connect transportconst transport = new StdioServerTransport()await server.connect(transport)
```
```
/* ❌ Incomplete setup */const server = new McpServer()/* ✅ Full setup with info */import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'const server = new McpServer({  name: 'my-server',  version: '1.0.0',})// Connect transportconst transport = new StdioServerTransport()await server.connect(transport)
```
```
/* ❌ Wrong tool schema */server.addTool({  name: 'my_tool',  description: 'Does something',  parameters: { type: 'object', properties: {...} },})/* ✅ Correct tool definition */server.tool(  'my_tool',  'Does something useful',  {    input: z.object({      query: z.string().describe('The search query'),    }),  },  async ({ input }) => {    return {      content: [{ type: 'text', text: Result for: ${input.query} }],    }  })
```
```
/* ❌ Wrong tool schema */server.addTool({  name: 'my_tool',  description: 'Does something',  parameters: { type: 'object', properties: {...} },})/* ✅ Correct tool definition */server.tool(  'my_tool',  'Does something useful',  {    input: z.object({      query: z.string().describe('The search query'),    }),  },  async ({ input }) => {    return {      content: [{ type: 'text', text: Result for: ${input.query} }],    }  })
```
```
Result for: ${input.query}
```
```
/* ❌ Wrong resource pattern */server.addResource({ uri: 'file://...', content: '...' })/* ✅ Correct resource handler */server.resource(  'config',  'config://settings',  async (uri) => ({    contents: [{      uri: uri.href,      mimeType: 'application/json',      text: JSON.stringify(config),    }],  }))
```
```
/* ❌ Wrong resource pattern */server.addResource({ uri: 'file://...', content: '...' })/* ✅ Correct resource handler */server.resource(  'config',  'config://settings',  async (uri) => ({    contents: [{      uri: uri.href,      mimeType: 'application/json',      text: JSON.stringify(config),    }],  }))
```
```
/* ❌ Throwing generic errors */throw new Error('Something went wrong')/* ✅ MCP error format */return {  content: [{    type: 'text',    text: 'Error: Something went wrong',  }],  isError: true,}
```
```
/* ❌ Throwing generic errors */throw new Error('Something went wrong')/* ✅ MCP error format */return {  content: [{    type: 'text',    text: 'Error: Something went wrong',  }],  isError: true,}
```
```
/* ❌ Using stdio in Workers */import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'/* ✅ Use SSE or custom transport for Workers */// For Cloudflare Workers, use workers-mcp-server package// or implement custom SSE transportimport { McpAgent } from 'workers-mcp-server'
```
```
/* ❌ Using stdio in Workers */import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'/* ✅ Use SSE or custom transport for Workers */// For Cloudflare Workers, use workers-mcp-server package// or implement custom SSE transportimport { McpAgent } from 'workers-mcp-server'
```
```
import { Server }
```
```
import { McpServer }
```
```
server.addTool()
```
```
server.tool()
```
```
parameters: {...}
```
```
{ input: z.object({...}) }
```
```
throw new Error()
```
```
{ content: [...], isError: true }
```
```
@modelcontextprotocol/server
```
```
@modelcontextprotocol/sdk/server/mcp.js
```
This specialized agent skill empowers developers to swiftly build Model Context Protocol (MCP) servers using TypeScript, optimized for the Cloudflare Workers environment. It provides a structured approach to defining and exposing AI agent tools as serverless functions, leveraging the robust features of Hono and Zod for input validation. Ideal for creating highly performant and scalable backend services that seamlessly integrate with AI models, this skill streamlines the process of transforming complex AI logic into accessible, well-defined APIs. Get started quickly with robust type safety and efficient deployment on the edge.

# When to Use This Skill
- •Building custom AI agent backend services that deploy rapidly on Cloudflare Workers.
- •Creating type-safe APIs for AI tools using the Model Context Protocol (MCP).
- •Implementing serverless functions for specific AI tasks, like data processing or external service integration, exposed to AI models.
- •Developing scalable microservices that encapsulate AI agent capabilities.

# Pro Tips
- 💡Prioritize `StreamableHTTPServerTransport` for production deployments to leverage its superior error recovery and bidirectional communication over SSE.
- 💡Utilize Zod extensively for input schema validation to ensure robust, type-safe interactions between your AI agent and its tools.
- 💡Leverage Cloudflare Workers' global network for low-latency responses, placing your AI tools closer to the users or calling agents.

