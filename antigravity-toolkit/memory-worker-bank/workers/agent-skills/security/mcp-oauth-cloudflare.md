# MCP OAuth Cloudflare
Source: https://antigravity.codes/agent-skills/security/mcp-oauth-cloudflare

## AI Worker Instructions
When the user requests functionality related to MCP OAuth Cloudflare, follow these guidelines and utilize this context.

## Scraped Content

# MCP OAuth Cloudflare
```
workers-oauth-provider
```
```
┌─────────────────────────────────────────────────────────────────────┐│                        Cloudflare Worker                            │├─────────────────────────────────────────────────────────────────────┤│                                                                     ││  ┌─────────────────────┐      ┌──────────────────────────────────┐ ││  │  OAuthProvider      │      │  McpAgent (Durable Object)       │ ││  │  ─────────────────  │      │  ────────────────────────────    │ ││  │  /register (DCR)    │      │  MCP Tools with user props:      │ ││  │  /authorize         │─────▶│  - this.props.email              │ ││  │  /token             │      │  - this.props.id                 │ ││  │  /mcp               │      │  - this.props.accessToken        │ ││  └─────────────────────┘      └──────────────────────────────────┘ ││           │                                                         ││           │ OAuth Flow                                              ││           ▼                                                         ││  ┌─────────────────────┐      ┌──────────────────────────────────┐ ││  │  Google Handler     │      │  KV Namespace (OAUTH_KV)         │ ││  │  ─────────────────  │      │  ────────────────────────────    │ ││  │  /authorize (GET)   │─────▶│  oauth:state:{token} → AuthReq   │ ││  │  /authorize (POST)  │      │  TTL: 10 minutes                 │ ││  │  /callback          │      └──────────────────────────────────┘ ││  └─────────────────────┘                                           ││                                                                     │└─────────────────────────────────────────────────────────────────────┘
```
```
┌─────────────────────────────────────────────────────────────────────┐│                        Cloudflare Worker                            │├─────────────────────────────────────────────────────────────────────┤│                                                                     ││  ┌─────────────────────┐      ┌──────────────────────────────────┐ ││  │  OAuthProvider      │      │  McpAgent (Durable Object)       │ ││  │  ─────────────────  │      │  ────────────────────────────    │ ││  │  /register (DCR)    │      │  MCP Tools with user props:      │ ││  │  /authorize         │─────▶│  - this.props.email              │ ││  │  /token             │      │  - this.props.id                 │ ││  │  /mcp               │      │  - this.props.accessToken        │ ││  └─────────────────────┘      └──────────────────────────────────┘ ││           │                                                         ││           │ OAuth Flow                                              ││           ▼                                                         ││  ┌─────────────────────┐      ┌──────────────────────────────────┐ ││  │  Google Handler     │      │  KV Namespace (OAUTH_KV)         │ ││  │  ─────────────────  │      │  ────────────────────────────    │ ││  │  /authorize (GET)   │─────▶│  oauth:state:{token} → AuthReq   │ ││  │  /authorize (POST)  │      │  TTL: 10 minutes                 │ ││  │  /callback          │      └──────────────────────────────────┘ ││  └─────────────────────┘                                           ││                                                                     │└─────────────────────────────────────────────────────────────────────┘
```
```
npm install @cloudflare/workers-oauth-provider agents @modelcontextprotocol/sdk hono zod
```
```
npm install @cloudflare/workers-oauth-provider agents @modelcontextprotocol/sdk hono zod
```
```
src/├── index.ts              # Main entry with OAuthProvider└── oauth/    ├── google-handler.ts # OAuth routes (/authorize, /callback)    ├── utils.ts          # Google token exchange & user info    └── workers-oauth-utils.ts # CSRF, state validation, approval UI
```
```
src/├── index.ts              # Main entry with OAuthProvider└── oauth/    ├── google-handler.ts # OAuth routes (/authorize, /callback)    ├── utils.ts          # Google token exchange & user info    └── workers-oauth-utils.ts # CSRF, state validation, approval UI
```
```
{  "name": "my-mcp-server",  "main": "src/index.ts",  "compatibility_flags": ["nodejs_compat"],  // KV for OAuth state storage  "kv_namespaces": [    {      "binding": "OAUTH_KV",      "id": "YOUR_KV_NAMESPACE_ID"    }  ],  // Durable Objects for MCP sessions  "durable_objects": {    "bindings": [      {        "class_name": "MyMcpServer",        "name": "MCP_OBJECT"      }    ]  },  "migrations": [    {      "new_sqlite_classes": ["MyMcpServer"],      "tag": "v1"    }  ]}
```
```
{  "name": "my-mcp-server",  "main": "src/index.ts",  "compatibility_flags": ["nodejs_compat"],  // KV for OAuth state storage  "kv_namespaces": [    {      "binding": "OAUTH_KV",      "id": "YOUR_KV_NAMESPACE_ID"    }  ],  // Durable Objects for MCP sessions  "durable_objects": {    "bindings": [      {        "class_name": "MyMcpServer",        "name": "MCP_OBJECT"      }    ]  },  "migrations": [    {      "new_sqlite_classes": ["MyMcpServer"],      "tag": "v1"    }  ]}
```
```
# Google OAuth credentials (from console.cloud.google.com)echo "YOUR_GOOGLE_CLIENT_ID" | npx wrangler secret put GOOGLE_CLIENT_IDecho "YOUR_GOOGLE_CLIENT_SECRET" | npx wrangler secret put GOOGLE_CLIENT_SECRET# Cookie encryption key (32+ chars)python3 -c "import secrets; print(secrets.token_urlsafe(32))" | npx wrangler secret put COOKIE_ENCRYPTION_KEY# Optional: Custom Google OAuth scopes (default: 'openid email profile')# See "Common Google Scopes" section below for scope recipesecho "openid email profile https://www.googleapis.com/auth/drive" | npx wrangler secret put GOOGLE_SCOPES# Deploy to activate secretsnpx wrangler deploy
```
```
# Google OAuth credentials (from console.cloud.google.com)echo "YOUR_GOOGLE_CLIENT_ID" | npx wrangler secret put GOOGLE_CLIENT_IDecho "YOUR_GOOGLE_CLIENT_SECRET" | npx wrangler secret put GOOGLE_CLIENT_SECRET# Cookie encryption key (32+ chars)python3 -c "import secrets; print(secrets.token_urlsafe(32))" | npx wrangler secret put COOKIE_ENCRYPTION_KEY# Optional: Custom Google OAuth scopes (default: 'openid email profile')# See "Common Google Scopes" section below for scope recipesecho "openid email profile https://www.googleapis.com/auth/drive" | npx wrangler secret put GOOGLE_SCOPES# Deploy to activate secretsnpx wrangler deploy
```
```
templates/env.d.ts
```
```
src/env.d.ts
```
```
interface Env {  GOOGLE_CLIENT_ID: string;  GOOGLE_CLIENT_SECRET: string;  COOKIE_ENCRYPTION_KEY: string;  GOOGLE_SCOPES?: string;  // Optional: Override default scopes  OAUTH_KV: KVNamespace;  MCP_OBJECT: DurableObjectNamespace;}
```
```
interface Env {  GOOGLE_CLIENT_ID: string;  GOOGLE_CLIENT_SECRET: string;  COOKIE_ENCRYPTION_KEY: string;  GOOGLE_SCOPES?: string;  // Optional: Override default scopes  OAUTH_KV: KVNamespace;  MCP_OBJECT: DurableObjectNamespace;}
```
```
import OAuthProvider from '@cloudflare/workers-oauth-provider';import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';import { McpAgent } from 'agents/mcp';import { z } from 'zod';import { GoogleHandler } from './oauth/google-handler';// Props from OAuth - user info stored in tokentype Props = {  id: string;  email: string;  name: string;  picture?: string;  accessToken: string;  refreshToken?: string; // Available on first auth with access_type=offline};export class MyMcpServer extends McpAgent<Env, Record<string, never>, Props> {  server = new McpServer({    name: 'my-mcp-server',    version: '1.0.0',  });  async init() {    // Register tools - user info available via this.props    this.server.tool(      'my_tool',      'Tool description',      { param: z.string() },      async (args) => {        // Access authenticated user        const userEmail = this.props?.email;        console.log(Tool called by: ${userEmail});        return {          content: [{ type: 'text', text: 'Result' }]        };      }    );  }}// Wrap with OAuth providerexport default new OAuthProvider({  apiHandlers: {    '/sse': MyMcpServer.serveSSE('/sse'),    '/mcp': MyMcpServer.serve('/mcp'),  },  authorizeEndpoint: '/authorize',  clientRegistrationEndpoint: '/register',  defaultHandler: GoogleHandler as any,  tokenEndpoint: '/token',});
```
```
import OAuthProvider from '@cloudflare/workers-oauth-provider';import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';import { McpAgent } from 'agents/mcp';import { z } from 'zod';import { GoogleHandler } from './oauth/google-handler';// Props from OAuth - user info stored in tokentype Props = {  id: string;  email: string;  name: string;  picture?: string;  accessToken: string;  refreshToken?: string; // Available on first auth with access_type=offline};export class MyMcpServer extends McpAgent<Env, Record<string, never>, Props> {  server = new McpServer({    name: 'my-mcp-server',    version: '1.0.0',  });  async init() {    // Register tools - user info available via this.props    this.server.tool(      'my_tool',      'Tool description',      { param: z.string() },      async (args) => {        // Access authenticated user        const userEmail = this.props?.email;        console.log(Tool called by: ${userEmail});        return {          content: [{ type: 'text', text: 'Result' }]        };      }    );  }}// Wrap with OAuth providerexport default new OAuthProvider({  apiHandlers: {    '/sse': MyMcpServer.serveSSE('/sse'),    '/mcp': MyMcpServer.serve('/mcp'),  },  authorizeEndpoint: '/authorize',  clientRegistrationEndpoint: '/register',  defaultHandler: GoogleHandler as any,  tokenEndpoint: '/token',});
```
```
Tool called by: ${userEmail}
```
```
import { env } from 'cloudflare:workers';import type { AuthRequest, OAuthHelpers } from '@cloudflare/workers-oauth-provider';import { Hono } from 'hono';import { fetchUpstreamAuthToken, fetchGoogleUserInfo, getUpstreamAuthorizeUrl, type Props } from './utils';import {  addApprovedClient,  bindStateToSession,  createOAuthState,  generateCSRFProtection,  isClientApproved,  OAuthError,  renderApprovalDialog,  validateCSRFToken,  validateOAuthState,} from './workers-oauth-utils';const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>();// GET /authorize - Show approval dialog or redirect to Googleapp.get('/authorize', async (c) => {  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);  const { clientId } = oauthReqInfo;  if (!clientId) return c.text('Invalid request', 400);  // Skip approval if client already approved  if (await isClientApproved(c.req.raw, clientId, env.COOKIE_ENCRYPTION_KEY)) {    const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);    const { setCookie } = await bindStateToSession(stateToken);    return redirectToGoogle(c.req.raw, stateToken, { 'Set-Cookie': setCookie });  }  // Show approval dialog with CSRF protection  const { token: csrfToken, setCookie } = generateCSRFProtection();  return renderApprovalDialog(c.req.raw, {    client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),    csrfToken,    server: {      name: 'My MCP Server',      description: 'Description of your server',      logo: 'https://example.com/logo.png',    },    setCookie,    state: { oauthReqInfo },  });});// POST /authorize - Process approval formapp.post('/authorize', async (c) => {  try {    const formData = await c.req.raw.formData();    validateCSRFToken(formData, c.req.raw);    const encodedState = formData.get('state') as string;    const state = JSON.parse(atob(encodedState));    // Add to approved clients    const approvedCookie = await addApprovedClient(      c.req.raw, state.oauthReqInfo.clientId, c.env.COOKIE_ENCRYPTION_KEY    );    // Create state and redirect    const { stateToken } = await createOAuthState(state.oauthReqInfo, c.env.OAUTH_KV);    const { setCookie } = await bindStateToSession(stateToken);    const headers = new Headers();    headers.append('Set-Cookie', approvedCookie);    headers.append('Set-Cookie', setCookie);    return redirectToGoogle(c.req.raw, stateToken, Object.fromEntries(headers));  } catch (error: any) {    if (error instanceof OAuthError) return error.toResponse();    return c.text(Error: ${error.message}, 500);  }});// GET /callback - Handle Google OAuth callbackapp.get('/callback', async (c) => {  const { oauthReqInfo, clearCookie } = await validateOAuthState(c.req.raw, c.env.OAUTH_KV);  // Exchange code for token  const [accessToken, err] = await fetchUpstreamAuthToken({    client_id: c.env.GOOGLE_CLIENT_ID,    client_secret: c.env.GOOGLE_CLIENT_SECRET,    code: c.req.query('code'),    redirect_uri: new URL('/callback', c.req.url).href,    upstream_url: 'https://oauth2.googleapis.com/token',  });  if (err) return err;  // Get user info  const user = await fetchGoogleUserInfo(accessToken);  if (!user) return c.text('Failed to fetch user info', 500);  // Complete authorization  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({    props: {      accessToken,      email: user.email,      id: user.id,      name: user.name,      picture: user.picture,    } as Props,    request: oauthReqInfo,    scope: oauthReqInfo.scope,    userId: user.id,  });  return new Response(null, {    status: 302,    headers: { Location: redirectTo, 'Set-Cookie': clearCookie },  });});async function redirectToGoogle(request: Request, stateToken: string, headers: Record<string, string> = {}) {  // Scopes configurable via GOOGLE_SCOPES env var (see "Common Google Scopes" section)  const scopes = env.GOOGLE_SCOPES || 'openid email profile';  return new Response(null, {    status: 302,    headers: {      ...headers,      location: getUpstreamAuthorizeUrl({        client_id: env.GOOGLE_CLIENT_ID,        redirect_uri: new URL('/callback', request.url).href,        scope: scopes,        state: stateToken,        upstream_url: 'https://accounts.google.com/o/oauth2/v2/auth',      }),    },  });}export { app as GoogleHandler };
```
```
import { env } from 'cloudflare:workers';import type { AuthRequest, OAuthHelpers } from '@cloudflare/workers-oauth-provider';import { Hono } from 'hono';import { fetchUpstreamAuthToken, fetchGoogleUserInfo, getUpstreamAuthorizeUrl, type Props } from './utils';import {  addApprovedClient,  bindStateToSession,  createOAuthState,  generateCSRFProtection,  isClientApproved,  OAuthError,  renderApprovalDialog,  validateCSRFToken,  validateOAuthState,} from './workers-oauth-utils';const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>();// GET /authorize - Show approval dialog or redirect to Googleapp.get('/authorize', async (c) => {  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);  const { clientId } = oauthReqInfo;  if (!clientId) return c.text('Invalid request', 400);  // Skip approval if client already approved  if (await isClientApproved(c.req.raw, clientId, env.COOKIE_ENCRYPTION_KEY)) {    const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);    const { setCookie } = await bindStateToSession(stateToken);    return redirectToGoogle(c.req.raw, stateToken, { 'Set-Cookie': setCookie });  }  // Show approval dialog with CSRF protection  const { token: csrfToken, setCookie } = generateCSRFProtection();  return renderApprovalDialog(c.req.raw, {    client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),    csrfToken,    server: {      name: 'My MCP Server',      description: 'Description of your server',      logo: 'https://example.com/logo.png',    },    setCookie,    state: { oauthReqInfo },  });});// POST /authorize - Process approval formapp.post('/authorize', async (c) => {  try {    const formData = await c.req.raw.formData();    validateCSRFToken(formData, c.req.raw);    const encodedState = formData.get('state') as string;    const state = JSON.parse(atob(encodedState));    // Add to approved clients    const approvedCookie = await addApprovedClient(      c.req.raw, state.oauthReqInfo.clientId, c.env.COOKIE_ENCRYPTION_KEY    );    // Create state and redirect    const { stateToken } = await createOAuthState(state.oauthReqInfo, c.env.OAUTH_KV);    const { setCookie } = await bindStateToSession(stateToken);    const headers = new Headers();    headers.append('Set-Cookie', approvedCookie);    headers.append('Set-Cookie', setCookie);    return redirectToGoogle(c.req.raw, stateToken, Object.fromEntries(headers));  } catch (error: any) {    if (error instanceof OAuthError) return error.toResponse();    return c.text(Error: ${error.message}, 500);  }});// GET /callback - Handle Google OAuth callbackapp.get('/callback', async (c) => {  const { oauthReqInfo, clearCookie } = await validateOAuthState(c.req.raw, c.env.OAUTH_KV);  // Exchange code for token  const [accessToken, err] = await fetchUpstreamAuthToken({    client_id: c.env.GOOGLE_CLIENT_ID,    client_secret: c.env.GOOGLE_CLIENT_SECRET,    code: c.req.query('code'),    redirect_uri: new URL('/callback', c.req.url).href,    upstream_url: 'https://oauth2.googleapis.com/token',  });  if (err) return err;  // Get user info  const user = await fetchGoogleUserInfo(accessToken);  if (!user) return c.text('Failed to fetch user info', 500);  // Complete authorization  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({    props: {      accessToken,      email: user.email,      id: user.id,      name: user.name,      picture: user.picture,    } as Props,    request: oauthReqInfo,    scope: oauthReqInfo.scope,    userId: user.id,  });  return new Response(null, {    status: 302,    headers: { Location: redirectTo, 'Set-Cookie': clearCookie },  });});async function redirectToGoogle(request: Request, stateToken: string, headers: Record<string, string> = {}) {  // Scopes configurable via GOOGLE_SCOPES env var (see "Common Google Scopes" section)  const scopes = env.GOOGLE_SCOPES || 'openid email profile';  return new Response(null, {    status: 302,    headers: {      ...headers,      location: getUpstreamAuthorizeUrl({        client_id: env.GOOGLE_CLIENT_ID,        redirect_uri: new URL('/callback', request.url).href,        scope: scopes,        state: stateToken,        upstream_url: 'https://accounts.google.com/o/oauth2/v2/auth',      }),    },  });}export { app as GoogleHandler };
```
```
Error: ${error.message}
```
```
User clicks "Connect" in Claude.ai          │          ▼┌─────────────────────────────────┐│  1. /register (DCR)             │ ◄── Claude.ai registers as client│     Returns client credentials   │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  2. GET /authorize              ││     - Check approved clients    ││     - Show approval dialog      ││     - Generate CSRF token       │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  3. POST /authorize             ││     - Validate CSRF             ││     - Create state in KV        ││     - Redirect to Google        │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  4. Google OAuth                ││     - User signs in             ││     - Consents to scopes        │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  5. GET /callback               ││     - Validate state            ││     - Exchange code for token   ││     - Fetch user info           ││     - Complete authorization    │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  6. User props available        ││     this.props.email            ││     this.props.id               ││     this.props.accessToken      │└─────────────────────────────────┘
```
```
User clicks "Connect" in Claude.ai          │          ▼┌─────────────────────────────────┐│  1. /register (DCR)             │ ◄── Claude.ai registers as client│     Returns client credentials   │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  2. GET /authorize              ││     - Check approved clients    ││     - Show approval dialog      ││     - Generate CSRF token       │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  3. POST /authorize             ││     - Validate CSRF             ││     - Create state in KV        ││     - Redirect to Google        │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  4. Google OAuth                ││     - User signs in             ││     - Consents to scopes        │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  5. GET /callback               ││     - Validate state            ││     - Exchange code for token   ││     - Fetch user info           ││     - Complete authorization    │└─────────────────────────────────┘          │          ▼┌─────────────────────────────────┐│  6. User props available        ││     this.props.email            ││     this.props.id               ││     this.props.accessToken      │└─────────────────────────────────┘
```
```
// Generate CSRF token with HttpOnly cookieexport function generateCSRFProtection(): CSRFProtectionResult {  const token = crypto.randomUUID();  const setCookie = __Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600;  return { token, setCookie };}
```
```
// Generate CSRF token with HttpOnly cookieexport function generateCSRFProtection(): CSRFProtectionResult {  const token = crypto.randomUUID();  const setCookie = __Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600;  return { token, setCookie };}
```
```
__Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600
```
```
// Create one-time-use state in KVexport async function createOAuthState(oauthReqInfo: AuthRequest, kv: KVNamespace) {  const stateToken = crypto.randomUUID();  await kv.put(oauth:state:${stateToken}, JSON.stringify(oauthReqInfo), {    expirationTtl: 600, // 10 minutes  });  return { stateToken };}
```
```
// Create one-time-use state in KVexport async function createOAuthState(oauthReqInfo: AuthRequest, kv: KVNamespace) {  const stateToken = crypto.randomUUID();  await kv.put(oauth:state:${stateToken}, JSON.stringify(oauthReqInfo), {    expirationTtl: 600, // 10 minutes  });  return { stateToken };}
```
```
oauth:state:${stateToken}
```
```
// Bind state to browser session via SHA-256 hashexport async function bindStateToSession(stateToken: string) {  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(stateToken));  const hashHex = Array.from(new Uint8Array(hashBuffer))    .map(b => b.toString(16).padStart(2, '0')).join('');  const setCookie = __Host-CONSENTED_STATE=${hashHex}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600;  return { setCookie };}
```
```
// Bind state to browser session via SHA-256 hashexport async function bindStateToSession(stateToken: string) {  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(stateToken));  const hashHex = Array.from(new Uint8Array(hashBuffer))    .map(b => b.toString(16).padStart(2, '0')).join('');  const setCookie = __Host-CONSENTED_STATE=${hashHex}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600;  return { setCookie };}
```
```
__Host-CONSENTED_STATE=${hashHex}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600
```
```
// HMAC-signed cookie tracks approved clients (30-day TTL)export async function addApprovedClient(request: Request, clientId: string, cookieSecret: string) {  const existing = await getApprovedClientsFromCookie(request, cookieSecret) || [];  const updated = [...new Set([...existing, clientId])];  const payload = JSON.stringify(updated);  const signature = await signData(payload, cookieSecret);  return __Host-APPROVED_CLIENTS=${signature}.${btoa(payload)}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=2592000;}
```
```
// HMAC-signed cookie tracks approved clients (30-day TTL)export async function addApprovedClient(request: Request, clientId: string, cookieSecret: string) {  const existing = await getApprovedClientsFromCookie(request, cookieSecret) || [];  const updated = [...new Set([...existing, clientId])];  const payload = JSON.stringify(updated);  const signature = await signData(payload, cookieSecret);  return __Host-APPROVED_CLIENTS=${signature}.${btoa(payload)}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=2592000;}
```
```
__Host-APPROVED_CLIENTS=${signature}.${btoa(payload)}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=2592000
```
```
plain
```
```
S256
```
```
https://your-worker.workers.dev/callback
```
```
GOOGLE_SCOPES
```
```
redirectToGoogle
```
```
openid email profile
```
```
openid email profile https://www.googleapis.com/auth/drive
```
```
openid email profile https://www.googleapis.com/auth/drive.file
```
```
openid email profile https://www.googleapis.com/auth/documents
```
```
openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents
```
```
openid email profile https://www.googleapis.com/auth/gmail.modify
```
```
openid email profile https://www.googleapis.com/auth/gmail.readonly
```
```
openid email profile https://www.googleapis.com/auth/calendar
```
```
openid email profile https://www.googleapis.com/auth/spreadsheets
```
```
openid email profile https://www.googleapis.com/auth/presentations
```
```
openid email profile https://www.googleapis.com/auth/youtube
```
```
# Option 1: Via environment variable (recommended for flexibility)echo "openid email profile https://www.googleapis.com/auth/drive" | npx wrangler secret put GOOGLE_SCOPES# Option 2: In wrangler.jsonc (for non-sensitive scopes){  "vars": {    "GOOGLE_SCOPES": "openid email profile https://www.googleapis.com/auth/drive"  }}
```
```
# Option 1: Via environment variable (recommended for flexibility)echo "openid email profile https://www.googleapis.com/auth/drive" | npx wrangler secret put GOOGLE_SCOPES# Option 2: In wrangler.jsonc (for non-sensitive scopes){  "vars": {    "GOOGLE_SCOPES": "openid email profile https://www.googleapis.com/auth/drive"  }}
```
```
openid email profile
```
```
drive.file
```
```
@cloudflare/workers-oauth-provider
```
```
access_type=offline
```
```
// In google-handler.ts, redirectToGoogle functiongoogleAuthUrl.searchParams.set('access_type', 'offline');googleAuthUrl.searchParams.set('prompt', 'consent'); // Forces new refresh token
```
```
// In google-handler.ts, redirectToGoogle functiongoogleAuthUrl.searchParams.set('access_type', 'offline');googleAuthUrl.searchParams.set('prompt', 'consent'); // Forces new refresh token
```
```
access_type=offline
```
```
access_type=online
```
```
export type Props = {  id: string;  email: string;  name: string;  picture?: string;  accessToken: string;  refreshToken?: string;      // Store when received  tokenExpiresAt?: number;    // Track expiration};
```
```
export type Props = {  id: string;  email: string;  name: string;  picture?: string;  accessToken: string;  refreshToken?: string;      // Store when received  tokenExpiresAt?: number;    // Track expiration};
```
```
export async function refreshAccessToken(  client_id: string,  client_secret: string,  refresh_token: string): Promise<{ accessToken: string; expiresAt: number } | null> {  const resp = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      client_id,      client_secret,      refresh_token,      grant_type: 'refresh_token',    }).toString(),  });  if (!resp.ok) return null; // Token revoked, requires re-auth  const body = await resp.json();  return {    accessToken: body.access_token,    expiresAt: Date.now() + (body.expires_in * 1000),  };}
```
```
export async function refreshAccessToken(  client_id: string,  client_secret: string,  refresh_token: string): Promise<{ accessToken: string; expiresAt: number } | null> {  const resp = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      client_id,      client_secret,      refresh_token,      grant_type: 'refresh_token',    }).toString(),  });  if (!resp.ok) return null; // Token revoked, requires re-auth  const body = await resp.json();  return {    accessToken: body.access_token,    expiresAt: Date.now() + (body.expires_in * 1000),  };}
```
```
// In your main fetch handlerexport default {  async fetch(request: Request, env: Env, ctx: ExecutionContext) {    const authHeader = request.headers.get('Authorization');    const url = new URL(request.url);    // Check for Bearer token auth on MCP endpoints    if (env.AUTH_TOKEN && authHeader?.startsWith('Bearer ') &&        (url.pathname === '/sse' || url.pathname === '/mcp')) {      const token = authHeader.slice(7);      if (token === env.AUTH_TOKEN) {        // Programmatic access (CLI, ElevenLabs)        const headerAuthCtx = { ...ctx, props: { source: 'bearer' } };        return mcpHandler.fetch(request, env, headerAuthCtx);      }      // NOT env.AUTH_TOKEN - fall through to OAuth provider      // (it may be an OAuth token from Claude.ai)    }    // OAuth flow for web clients    return oauthProvider.fetch(request, env, ctx);  }};
```
```
// In your main fetch handlerexport default {  async fetch(request: Request, env: Env, ctx: ExecutionContext) {    const authHeader = request.headers.get('Authorization');    const url = new URL(request.url);    // Check for Bearer token auth on MCP endpoints    if (env.AUTH_TOKEN && authHeader?.startsWith('Bearer ') &&        (url.pathname === '/sse' || url.pathname === '/mcp')) {      const token = authHeader.slice(7);      if (token === env.AUTH_TOKEN) {        // Programmatic access (CLI, ElevenLabs)        const headerAuthCtx = { ...ctx, props: { source: 'bearer' } };        return mcpHandler.fetch(request, env, headerAuthCtx);      }      // NOT env.AUTH_TOKEN - fall through to OAuth provider      // (it may be an OAuth token from Claude.ai)    }    // OAuth flow for web clients    return oauthProvider.fetch(request, env, ctx);  }};
```
```
python3 -c "import secrets; print(secrets.token_urlsafe(32))" | npx wrangler secret put AUTH_TOKENnpx wrangler deploy  # Required to activate
```
```
python3 -c "import secrets; print(secrets.token_urlsafe(32))" | npx wrangler secret put AUTH_TOKENnpx wrangler deploy  # Required to activate
```
```
clientRegistrationEndpoint: '/register'
```
```
this.props
```
```
if (this.props)
```
```
GOOGLE_CLIENT_ID
```
```
GOOGLE_CLIENT_SECRET
```
```
COOKIE_ENCRYPTION_KEY
```
```
secrets.token_urlsafe(32)
```
```
GOOGLE_SCOPES
```
```
invalid_token: Token audience does not match resource server
```
```
resourceServer
```
```
https://example.com
```
```
https://example.com/api
```
```
audienceMatches
```
```
https://example.com/api
```
```
resource
```
```
https://example.com
```
```
handleApiRequest
```
```
// Workaround: Include pathname in resourceServer computationconst resourceServer = ${requestUrl.protocol}//${requestUrl.host}${requestUrl.pathname};
```
```
// Workaround: Include pathname in resourceServer computationconst resourceServer = ${requestUrl.protocol}//${requestUrl.host}${requestUrl.pathname};
```
```
${requestUrl.protocol}//${requestUrl.host}${requestUrl.pathname}
```
```
audienceMatches
```
```
invalid_grant
```
```
tokenExchangeCallback
```
```
completeAuthorization()
```
```
tokenExchangeCallback: async (options) => {  if (options.grantType === "refresh_token") {    const response = await fetchNewToken(options.props.accessToken);    if (!response.ok) {      // Triggers re-auth but props remain stale      throw new Error(JSON.stringify({        error: "invalid_grant",        error_description: "access token expired"      }));    }  }}
```
```
tokenExchangeCallback: async (options) => {  if (options.grantType === "refresh_token") {    const response = await fetchNewToken(options.props.accessToken);    if (!response.ok) {      // Triggers re-auth but props remain stale      throw new Error(JSON.stringify({        error: "invalid_grant",        error_description: "access token expired"      }));    }  }}
```
```
Invalid redirect URI. The redirect URI provided does not match any registered URI for this client
```
```
wrangler dev
```
```
const setCookie = __Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600;
```
```
const setCookie = __Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600;
```
```
__Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600
```
```
await kv.put(oauth:state:${stateToken}, JSON.stringify(oauthReqInfo), {  expirationTtl: 600,});
```
```
await kv.put(oauth:state:${stateToken}, JSON.stringify(oauthReqInfo), {  expirationTtl: 600,});
```
```
oauth:state:${stateToken}
```
```
const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(stateToken));const hashHex = Array.from(new Uint8Array(hashBuffer))  .map(b => b.toString(16).padStart(2, '0')).join('');
```
```
const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(stateToken));const hashHex = Array.from(new Uint8Array(hashBuffer))  .map(b => b.toString(16).padStart(2, '0')).join('');
```
```
clientRegistrationEndpoint: '/register'
```
```
const signature = await signData(payload, cookieSecret);const cookie = __Host-APPROVED_CLIENTS=${signature}.${btoa(payload)};
```
```
const signature = await signData(payload, cookieSecret);const cookie = __Host-APPROVED_CLIENTS=${signature}.${btoa(payload)};
```
```
__Host-APPROVED_CLIENTS=${signature}.${btoa(payload)}
```
```
client_id
```
```
aud
```
```
aud
```
```
// wrangler.jsonc without KV{  "name": "my-mcp",  "durable_objects": { ... }  // No kv_namespaces!}
```
```
// wrangler.jsonc without KV{  "name": "my-mcp",  "durable_objects": { ... }  // No kv_namespaces!}
```
```
{  "name": "my-mcp",  "kv_namespaces": [    {      "binding": "OAUTH_KV",      "id": "your-kv-namespace-id"    }  ]}
```
```
{  "name": "my-mcp",  "kv_namespaces": [    {      "binding": "OAUTH_KV",      "id": "your-kv-namespace-id"    }  ]}
```
```
# Set secret onlyecho "secret" | npx wrangler secret put GOOGLE_CLIENT_ID# Forget to deploy!
```
```
# Set secret onlyecho "secret" | npx wrangler secret put GOOGLE_CLIENT_ID# Forget to deploy!
```
```
echo "secret" | npx wrangler secret put GOOGLE_CLIENT_IDnpx wrangler deploy  # Required to activate secrets!
```
```
echo "secret" | npx wrangler secret put GOOGLE_CLIENT_IDnpx wrangler deploy  # Required to activate secrets!
```
```
// Creating state without binding to sessionconst { stateToken } = await createOAuthState(oauthReqInfo, kv);return Response.redirect(googleUrl);  // No session cookie!
```
```
// Creating state without binding to sessionconst { stateToken } = await createOAuthState(oauthReqInfo, kv);return Response.redirect(googleUrl);  // No session cookie!
```
```
const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);const { setCookie } = await bindStateToSession(stateToken);  // Bind to session!return new Response(null, {  status: 302,  headers: {    'Set-Cookie': setCookie,    'Location': googleUrl,  },});
```
```
const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);const { setCookie } = await bindStateToSession(stateToken);  // Bind to session!return new Response(null, {  status: 302,  headers: {    'Set-Cookie': setCookie,    'Location': googleUrl,  },});
```
```
// Validate but don't delete - allows replay attacks!const storedData = await kv.get(oauth:state:${state});// Continue without deleting...
```
```
// Validate but don't delete - allows replay attacks!const storedData = await kv.get(oauth:state:${state});// Continue without deleting...
```
```
oauth:state:${state}
```
```
const storedData = await kv.get(oauth:state:${state});// ... validate ...await kv.delete(oauth:state:${state});  // One-time use!
```
```
const storedData = await kv.get(oauth:state:${state});// ... validate ...await kv.delete(oauth:state:${state});  // One-time use!
```
```
oauth:state:${state}
```
```
oauth:state:${state}
```
```
<form method="post" action="/authorize">  <input type="hidden" name="state" value="${state}">  <!-- No CSRF token! -->  <button type="submit">Approve</button></form>
```
```
<form method="post" action="/authorize">  <input type="hidden" name="state" value="${state}">  <!-- No CSRF token! -->  <button type="submit">Approve</button></form>
```
```
<form method="post" action="/authorize">  <input type="hidden" name="state" value="${state}">  <input type="hidden" name="csrf_token" value="${csrfToken}">  <button type="submit">Approve</button></form>
```
```
<form method="post" action="/authorize">  <input type="hidden" name="state" value="${state}">  <input type="hidden" name="csrf_token" value="${csrfToken}">  <button type="submit">Approve</button></form>
```
```
const setCookie = CSRF_TOKEN=${token}; HttpOnly; Secure;  // No prefix!
```
```
const setCookie = CSRF_TOKEN=${token}; HttpOnly; Secure;  // No prefix!
```
```
CSRF_TOKEN=${token}; HttpOnly; Secure
```
```
const setCookie = __Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax;// __Host- prefix ensures: Secure, no Domain, Path=/
```
```
const setCookie = __Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax;// __Host- prefix ensures: Secure, no Domain, Path=/
```
```
__Host-CSRF_TOKEN=${token}; HttpOnly; Secure; Path=/; SameSite=Lax
```
```
async init() {  const email = this.props.email;  // May be undefined!}
```
```
async init() {  const email = this.props.email;  // May be undefined!}
```
```
async init() {  if (this.props) {    const email = this.props.email;  // Safe!  }}
```
```
async init() {  if (this.props) {    const email = this.props.email;  // Safe!  }}
```
```
// wrangler.jsonc"durable_objects": {  "bindings": [{    "class_name": "MyMcpServer",  // Name in config    "name": "MCP_OBJECT"  }]}
```
```
// wrangler.jsonc"durable_objects": {  "bindings": [{    "class_name": "MyMcpServer",  // Name in config    "name": "MCP_OBJECT"  }]}
```
```
// index.tsexport class MyMCPServer extends McpAgent { }  // Different casing!
```
```
// index.tsexport class MyMCPServer extends McpAgent { }  // Different casing!
```
```
// Names must match exactlyexport class MyMcpServer extends McpAgent { }  // Same as wrangler.jsonc
```
```
// Names must match exactlyexport class MyMcpServer extends McpAgent { }  // Same as wrangler.jsonc
```
```
export default new OAuthProvider({  apiHandlers: { '/mcp': MyMcpServer.serve('/mcp') },  authorizeEndpoint: '/authorize',  tokenEndpoint: '/token',  // Missing clientRegistrationEndpoint!});
```
```
export default new OAuthProvider({  apiHandlers: { '/mcp': MyMcpServer.serve('/mcp') },  authorizeEndpoint: '/authorize',  tokenEndpoint: '/token',  // Missing clientRegistrationEndpoint!});
```
```
export default new OAuthProvider({  apiHandlers: { '/mcp': MyMcpServer.serve('/mcp') },  authorizeEndpoint: '/authorize',  clientRegistrationEndpoint: '/register',  // Required for Claude.ai!  tokenEndpoint: '/token',});
```
```
export default new OAuthProvider({  apiHandlers: { '/mcp': MyMcpServer.serve('/mcp') },  authorizeEndpoint: '/authorize',  clientRegistrationEndpoint: '/register',  // Required for Claude.ai!  tokenEndpoint: '/token',});
```
```
redirect_uri: 'https://my-worker.workers.dev/callback',  // Breaks in dev!
```
```
redirect_uri: 'https://my-worker.workers.dev/callback',  // Breaks in dev!
```
```
redirect_uri: new URL('/callback', request.url).href,  // Works everywhere!
```
```
redirect_uri: new URL('/callback', request.url).href,  // Works everywhere!
```
```
GOOGLE_CLIENT_ID
```
```
GOOGLE_CLIENT_SECRET
```
```
COOKIE_ENCRYPTION_KEY
```
```
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```
```
https://your-worker.workers.dev/callback
```
For developers building secure and scalable MCP (Modular Cloud Platform) servers, this skill offers a production-ready OAuth authentication solution tailored for Cloudflare Workers. It streamlines the integration of third-party identity providers like Google, moving beyond static tokens to provide a robust, user-centric security model. By embracing a dual OAuth role pattern, the skill ensures your MCP server can both authenticate users via an upstream service and issue its own secure tokens to clients, delivering enhanced security and user context for your applications. This approach is critical for modern, identity-aware MCP deployments.

# When to Use This Skill
- •Building an MCP server that requires secure user authentication.
- •Deploying an MCP application to Claude.ai, necessitating Dynamic Client Registration.
- •Replacing less secure static authentication tokens with modern OAuth for improved security posture.
- •Adding Google Sign-In or other OAuth providers to your MCP server to enrich user context for tools.

# Pro Tips
- 💡Always ensure your Cloudflare Workers KV is securely configured for encrypted storage of access tokens, protecting sensitive user data effectively.
- 💡Leverage the 'dual OAuth role pattern' by ensuring your MCP server generates and issues its *own* token, rather than simply passing through third-party tokens, to maintain full security and compliance.
- 💡When deploying to platforms like Claude.ai, meticulously handle Dynamic Client Registration to ensure seamless OAuth flow and user experience without manual intervention.

