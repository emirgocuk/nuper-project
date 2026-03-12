# google-workspace
Source: https://antigravity.codes/agent-skills/workflow/google-workspace

## AI Worker Instructions
When the user requests functionality related to google-workspace, follow these guidelines and utilize this context.

## Scraped Content

# google-workspace
```
// Authorization URLconst authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)authUrl.searchParams.set('redirect_uri', ${env.BASE_URL}/callback)authUrl.searchParams.set('response_type', 'code')authUrl.searchParams.set('scope', SCOPES.join(' '))authUrl.searchParams.set('access_type', 'offline')  // For refresh tokensauthUrl.searchParams.set('prompt', 'consent')       // Force consent for refresh token// Token exchangeasync function exchangeCode(code: string): Promise<TokenResponse> {  const response = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      code,      client_id: env.GOOGLE_CLIENT_ID,      client_secret: env.GOOGLE_CLIENT_SECRET,      redirect_uri: ${env.BASE_URL}/callback,      grant_type: 'authorization_code',    }),  })  return response.json()}// Refresh tokenasync function refreshToken(refresh_token: string): Promise<TokenResponse> {  const response = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      refresh_token,      client_id: env.GOOGLE_CLIENT_ID,      client_secret: env.GOOGLE_CLIENT_SECRET,      grant_type: 'refresh_token',    }),  })  return response.json()}
```
```
// Authorization URLconst authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)authUrl.searchParams.set('redirect_uri', ${env.BASE_URL}/callback)authUrl.searchParams.set('response_type', 'code')authUrl.searchParams.set('scope', SCOPES.join(' '))authUrl.searchParams.set('access_type', 'offline')  // For refresh tokensauthUrl.searchParams.set('prompt', 'consent')       // Force consent for refresh token// Token exchangeasync function exchangeCode(code: string): Promise<TokenResponse> {  const response = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      code,      client_id: env.GOOGLE_CLIENT_ID,      client_secret: env.GOOGLE_CLIENT_SECRET,      redirect_uri: ${env.BASE_URL}/callback,      grant_type: 'authorization_code',    }),  })  return response.json()}// Refresh tokenasync function refreshToken(refresh_token: string): Promise<TokenResponse> {  const response = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      refresh_token,      client_id: env.GOOGLE_CLIENT_ID,      client_secret: env.GOOGLE_CLIENT_SECRET,      grant_type: 'refresh_token',    }),  })  return response.json()}
```
```
${env.BASE_URL}/callback
```
```
${env.BASE_URL}/callback
```
```
access_type=offline
```
```
prompt=consent
```
```
import { SignJWT } from 'jose'async function getServiceAccountToken(  serviceAccount: ServiceAccountKey,  scopes: string[]): Promise<string> {  const now = Math.floor(Date.now() / 1000)  // Create JWT  const jwt = await new SignJWT({    iss: serviceAccount.client_email,    scope: scopes.join(' '),    aud: 'https://oauth2.googleapis.com/token',    iat: now,    exp: now + 3600,  })    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })    .sign(await importPKCS8(serviceAccount.private_key, 'RS256'))  // Exchange JWT for access token  const response = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',      assertion: jwt,    }),  })  const data = await response.json()  return data.access_token}
```
```
import { SignJWT } from 'jose'async function getServiceAccountToken(  serviceAccount: ServiceAccountKey,  scopes: string[]): Promise<string> {  const now = Math.floor(Date.now() / 1000)  // Create JWT  const jwt = await new SignJWT({    iss: serviceAccount.client_email,    scope: scopes.join(' '),    aud: 'https://oauth2.googleapis.com/token',    iat: now,    exp: now + 3600,  })    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })    .sign(await importPKCS8(serviceAccount.private_key, 'RS256'))  // Exchange JWT for access token  const response = await fetch('https://oauth2.googleapis.com/token', {    method: 'POST',    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    body: new URLSearchParams({      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',      assertion: jwt,    }),  })  const data = await response.json()  return data.access_token}
```
```
const jwt = await new SignJWT({  iss: serviceAccount.client_email,  sub: 'user@domain.com',  // User to impersonate  scope: scopes.join(' '),  aud: 'https://oauth2.googleapis.com/token',  iat: now,  exp: now + 3600,})
```
```
const jwt = await new SignJWT({  iss: serviceAccount.client_email,  sub: 'user@domain.com',  // User to impersonate  scope: scopes.join(' '),  aud: 'https://oauth2.googleapis.com/token',  iat: now,  exp: now + 3600,})
```
```
async function withRetry<T>(  fn: () => Promise<T>,  maxRetries = 5): Promise<T> {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn()    } catch (error: any) {      const status = error.status || error.code      if (status === 429 || status === 503) {        // Rate limited or service unavailable        const retryAfter = error.headers?.get('Retry-After') || Math.pow(2, i)        await new Promise(r => setTimeout(r, retryAfter * 1000))        continue      }      if (status === 403 && error.message?.includes('rateLimitExceeded')) {        // Quota exceeded - exponential backoff        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))        continue      }      throw error    }  }  throw new Error('Max retries exceeded')}
```
```
async function withRetry<T>(  fn: () => Promise<T>,  maxRetries = 5): Promise<T> {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn()    } catch (error: any) {      const status = error.status || error.code      if (status === 429 || status === 503) {        // Rate limited or service unavailable        const retryAfter = error.headers?.get('Retry-After') || Math.pow(2, i)        await new Promise(r => setTimeout(r, retryAfter * 1000))        continue      }      if (status === 403 && error.message?.includes('rateLimitExceeded')) {        // Quota exceeded - exponential backoff        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))        continue      }      throw error    }  }  throw new Error('Max retries exceeded')}
```
```
async function batchRequest(  accessToken: string,  requests: BatchRequestItem[]): Promise<BatchResponse[]> {  const boundary = 'batch_boundary'  let body = ''  requests.forEach((req, i) => {    body += --${boundary}\r\n    body += 'Content-Type: application/http\r\n'    body += Content-ID: <item${i}>\r\n\r\n    body += ${req.method} ${req.path} HTTP/1.1\r\n    body += 'Content-Type: application/json\r\n\r\n'    if (req.body) body += JSON.stringify(req.body)    body += '\r\n'  })  body += --${boundary}--  const response = await fetch('https://www.googleapis.com/batch/v1', {    method: 'POST',    headers: {      'Authorization': Bearer ${accessToken},      'Content-Type': multipart/mixed; boundary=${boundary},    },    body,  })  // Parse multipart response...  return parseBatchResponse(await response.text())}
```
```
async function batchRequest(  accessToken: string,  requests: BatchRequestItem[]): Promise<BatchResponse[]> {  const boundary = 'batch_boundary'  let body = ''  requests.forEach((req, i) => {    body += --${boundary}\r\n    body += 'Content-Type: application/http\r\n'    body += Content-ID: <item${i}>\r\n\r\n    body += ${req.method} ${req.path} HTTP/1.1\r\n    body += 'Content-Type: application/json\r\n\r\n'    if (req.body) body += JSON.stringify(req.body)    body += '\r\n'  })  body += --${boundary}--  const response = await fetch('https://www.googleapis.com/batch/v1', {    method: 'POST',    headers: {      'Authorization': Bearer ${accessToken},      'Content-Type': multipart/mixed; boundary=${boundary},    },    body,  })  // Parse multipart response...  return parseBatchResponse(await response.text())}
```
```
--${boundary}\r\n
```
```
Content-ID: <item${i}>\r\n\r\n
```
```
${req.method} ${req.path} HTTP/1.1\r\n
```
```
--${boundary}--
```
```
Bearer ${accessToken}
```
```
multipart/mixed; boundary=${boundary}
```
```
// wrangler.jsonc{  "name": "google-workspace-mcp",  "main": "src/index.ts",  "compatibility_date": "2026-01-03",  "compatibility_flags": ["nodejs_compat"],  // Store OAuth tokens  "kv_namespaces": [    { "binding": "TOKENS", "id": "xxx" }  ],  // Or use D1 for structured storage  "d1_databases": [    { "binding": "DB", "database_name": "workspace-mcp", "database_id": "xxx" }  ]}
```
```
// wrangler.jsonc{  "name": "google-workspace-mcp",  "main": "src/index.ts",  "compatibility_date": "2026-01-03",  "compatibility_flags": ["nodejs_compat"],  // Store OAuth tokens  "kv_namespaces": [    { "binding": "TOKENS", "id": "xxx" }  ],  // Or use D1 for structured storage  "d1_databases": [    { "binding": "DB", "database_name": "workspace-mcp", "database_id": "xxx" }  ]}
```
```
echo "your-client-id" | npx wrangler secret put GOOGLE_CLIENT_IDecho "your-client-secret" | npx wrangler secret put GOOGLE_CLIENT_SECRET# For service accounts:cat service-account.json | npx wrangler secret put GOOGLE_SERVICE_ACCOUNT
```
```
echo "your-client-id" | npx wrangler secret put GOOGLE_CLIENT_IDecho "your-client-secret" | npx wrangler secret put GOOGLE_CLIENT_SECRET# For service accounts:cat service-account.json | npx wrangler secret put GOOGLE_SERVICE_ACCOUNT
```
```
references/
```
```
{  "devDependencies": {    "@cloudflare/workers-types": "^4.20260109.0",    "wrangler": "^4.58.0",    "jose": "^6.1.3"  }}
```
```
{  "devDependencies": {    "@cloudflare/workers-types": "^4.20260109.0",    "wrangler": "^4.58.0",    "jose": "^6.1.3"  }}
```
Unlock the full potential of Google Workspace within your AI agent workflows. This powerful skill provides direct access to critical Google services like Gmail, Calendar, Drive, Sheets, and more, enabling sophisticated automation and data management. Developers can leverage pre-built functions to streamline tasks, generate reports, manage user data, and orchestrate complex business processes, significantly boosting efficiency and integrating productivity tools directly into their AI applications.

# When to Use This Skill
- •Automating email responses, inbox organization, and sending personalized notifications via Gmail.
- •Scheduling meetings, managing event invitations, and synchronizing calendars across teams using Calendar.
- •Reading and writing data to Google Sheets for reporting, data entry, or dynamic content generation.
- •Managing files in Google Drive, including uploading, sharing, and retrieving documents.
- •Automating user provisioning and group management within a Google Cloud organization using Admin SDK.

# Pro Tips
- 💡Always manage API scopes meticulously to grant only necessary permissions, enhancing security and reducing potential risks.
- 💡Utilize Google Cloud service accounts for server-to-server interactions, ensuring robust and auditable authentication without user intervention.
- 💡Implement robust error handling and rate limit management, especially when interacting with multiple APIs, to ensure your automations are resilient and performant.

