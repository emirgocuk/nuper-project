# cloudflare-turnstile
Source: https://antigravity.codes/agent-skills/security/cloudflare-turnstile

## AI Worker Instructions
When the user requests functionality related to cloudflare-turnstile, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-turnstile
```
rerenderOnCallbackChange
```
```
# 1. Create widget: https://dash.cloudflare.com/?to=/:account/turnstile#    Copy sitekey (public) and secret key (private)# 2. Add widget to frontend<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script><form>  <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>  <button type="submit">Submit</button></form># 3. Validate token server-side (Cloudflare Workers)const formData = await request.formData()const token = formData.get('cf-turnstile-response')const verifyFormData = new FormData()verifyFormData.append('secret', env.TURNSTILE_SECRET_KEY)verifyFormData.append('response', token)verifyFormData.append('remoteip', request.headers.get('CF-Connecting-IP'))  // REQUIRED - see Critical Rulesconst result = await fetch(  'https://challenges.cloudflare.com/turnstile/v0/siteverify',  { method: 'POST', body: verifyFormData })const outcome = await result.json()if (!outcome.success) return new Response('Invalid', { status: 401 })
```
```
# 1. Create widget: https://dash.cloudflare.com/?to=/:account/turnstile#    Copy sitekey (public) and secret key (private)# 2. Add widget to frontend<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script><form>  <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>  <button type="submit">Submit</button></form># 3. Validate token server-side (Cloudflare Workers)const formData = await request.formData()const token = formData.get('cf-turnstile-response')const verifyFormData = new FormData()verifyFormData.append('secret', env.TURNSTILE_SECRET_KEY)verifyFormData.append('response', token)verifyFormData.append('remoteip', request.headers.get('CF-Connecting-IP'))  // REQUIRED - see Critical Rulesconst result = await fetch(  'https://challenges.cloudflare.com/turnstile/v0/siteverify',  { method: 'POST', body: verifyFormData })const outcome = await result.json()if (!outcome.success) return new Response('Invalid', { status: 401 })
```
```
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script><div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY" data-callback="onSuccess"></div>
```
```
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script><div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY" data-callback="onSuccess"></div>
```
```
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>const widgetId = turnstile.render('#container', { sitekey: 'YOUR_SITE_KEY' })turnstile.reset(widgetId)   // Reset widgetturnstile.getResponse(widgetId)  // Get token
```
```
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>const widgetId = turnstile.render('#container', { sitekey: 'YOUR_SITE_KEY' })turnstile.reset(widgetId)   // Reset widgetturnstile.getResponse(widgetId)  // Get token
```
```
import { Turnstile } from '@marsidev/react-turnstile'<Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={setToken} />
```
```
import { Turnstile } from '@marsidev/react-turnstile'<Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={setToken} />
```
```
1x00000000000000000000AA
```
```
CF-Connecting-IP
```
```
X-Forwarded-For
```
```
success: false
```
```
success: false
```
```
turnstile.reset()
```
```
// CRITICAL: Reset widget after validation to get new tokenconst turnstileRef = useRef(null)async function handleSubmit(e) {  e.preventDefault()  const token = formData.get('cf-turnstile-response')  const result = await fetch('/api/submit', {    method: 'POST',    body: JSON.stringify({ token })  })  // Reset widget regardless of success/failure  // Token is consumed either way  if (turnstileRef.current) {    turnstile.reset(turnstileRef.current)  }}<Turnstile  ref={turnstileRef}  siteKey={TURNSTILE_SITE_KEY}  onSuccess={setToken}/>
```
```
// CRITICAL: Reset widget after validation to get new tokenconst turnstileRef = useRef(null)async function handleSubmit(e) {  e.preventDefault()  const token = formData.get('cf-turnstile-response')  const result = await fetch('/api/submit', {    method: 'POST',    body: JSON.stringify({ token })  })  // Reset widget regardless of success/failure  // Token is consumed either way  if (turnstileRef.current) {    turnstile.reset(turnstileRef.current)  }}<Turnstile  ref={turnstileRef}  siteKey={TURNSTILE_SITE_KEY}  onSuccess={setToken}/>
```
```
106010
```
```
https://challenges.cloudflare.com/cdn-cgi/challenge-platform
```
```
turnstile.render('#container', {  sitekey: SITE_KEY,  retry: 'auto',  'retry-interval': 8000,  'error-callback': (errorCode) => {    if (errorCode === '106010') {      console.warn('Chrome/Edge first-load issue (106010), auto-retrying...')      // Auto-retry will handle it    }  }})
```
```
turnstile.render('#container', {  sitekey: SITE_KEY,  retry: 'auto',  'retry-interval': 8000,  'error-callback': (errorCode) => {    if (errorCode === '106010') {      console.warn('Chrome/Edge first-load issue (106010), auto-retrying...')      // Auto-retry will handle it    }  }})
```
```
<Turnstile/>
```
```
<Turnstile  siteKey={KEY}  onSuccess={(token) => {    setToken(token)    // Force repaint by toggling display    const widget = document.querySelector('.cf-turnstile')    if (widget) {      widget.style.display = 'none'      setTimeout(() => widget.style.display = 'block', 0)    }  }}/>
```
```
<Turnstile  siteKey={KEY}  onSuccess={(token) => {    setToken(token)    // Force repaint by toggling display    const widget = document.querySelector('.cf-turnstile')    if (widget) {      widget.style.display = 'none'      setTimeout(() => widget.style.display = 'block', 0)    }  }}/>
```
```
Jest encountered an unexpected token
```
```
// Option 1: Jest mocking (jest.setup.ts)jest.mock('@marsidev/react-turnstile', () => ({  Turnstile: () => <div data-testid="turnstile-mock" />,}))// Option 2: transformIgnorePatterns in jest.config.jsmodule.exports = {  transformIgnorePatterns: [    'node_modules/(?!(@marsidev/react-turnstile)/)'  ]}// Option 3 (Recommended): Migrate to Vitest// Vitest handles ESM modules correctly without mocking
```
```
// Option 1: Jest mocking (jest.setup.ts)jest.mock('@marsidev/react-turnstile', () => ({  Turnstile: () => <div data-testid="turnstile-mock" />,}))// Option 2: transformIgnorePatterns in jest.config.jsmodule.exports = {  transformIgnorePatterns: [    'node_modules/(?!(@marsidev/react-turnstile)/)'  ]}// Option 3 (Recommended): Migrate to Vitest// Vitest handles ESM modules correctly without mocking
```
```
{  "vars": { "TURNSTILE_SITE_KEY": "1x00000000000000000000AA" },  "secrets": ["TURNSTILE_SECRET_KEY"]  // Run: wrangler secret put TURNSTILE_SECRET_KEY}
```
```
{  "vars": { "TURNSTILE_SITE_KEY": "1x00000000000000000000AA" },  "secrets": ["TURNSTILE_SECRET_KEY"]  // Run: wrangler secret put TURNSTILE_SECRET_KEY}
```
```
<meta http-equiv="Content-Security-Policy" content="  script-src 'self' https://challenges.cloudflare.com;  frame-src 'self' https://challenges.cloudflare.com;">
```
```
<meta http-equiv="Content-Security-Policy" content="  script-src 'self' https://challenges.cloudflare.com;  frame-src 'self' https://challenges.cloudflare.com;">
```
```
import { Hono } from 'hono'type Bindings = {  TURNSTILE_SECRET_KEY: string  TURNSTILE_SITE_KEY: string}const app = new Hono<{ Bindings: Bindings }>()app.post('/api/login', async (c) => {  const body = await c.req.formData()  const token = body.get('cf-turnstile-response')  if (!token) {    return c.text('Missing Turnstile token', 400)  }  // Validate token  const verifyFormData = new FormData()  verifyFormData.append('secret', c.env.TURNSTILE_SECRET_KEY)  verifyFormData.append('response', token.toString())  verifyFormData.append('remoteip', c.req.header('CF-Connecting-IP') || '')  // CRITICAL - always pass client IP  const verifyResult = await fetch(    'https://challenges.cloudflare.com/turnstile/v0/siteverify',    {      method: 'POST',      body: verifyFormData,    }  )  const outcome = await verifyResult.json<{ success: boolean }>()  if (!outcome.success) {    return c.text('Invalid Turnstile token', 401)  }  // Process login  return c.json({ message: 'Login successful' })})export default app
```
```
import { Hono } from 'hono'type Bindings = {  TURNSTILE_SECRET_KEY: string  TURNSTILE_SITE_KEY: string}const app = new Hono<{ Bindings: Bindings }>()app.post('/api/login', async (c) => {  const body = await c.req.formData()  const token = body.get('cf-turnstile-response')  if (!token) {    return c.text('Missing Turnstile token', 400)  }  // Validate token  const verifyFormData = new FormData()  verifyFormData.append('secret', c.env.TURNSTILE_SECRET_KEY)  verifyFormData.append('response', token.toString())  verifyFormData.append('remoteip', c.req.header('CF-Connecting-IP') || '')  // CRITICAL - always pass client IP  const verifyResult = await fetch(    'https://challenges.cloudflare.com/turnstile/v0/siteverify',    {      method: 'POST',      body: verifyFormData,    }  )  const outcome = await verifyResult.json<{ success: boolean }>()  if (!outcome.success) {    return c.text('Invalid Turnstile token', 401)  }  // Process login  return c.json({ message: 'Login successful' })})export default app
```
```
'use client'import { Turnstile } from '@marsidev/react-turnstile'import { useState } from 'react'export function ContactForm() {  const [token, setToken] = useState<string>()  const [error, setError] = useState<string>()  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {    e.preventDefault()    if (!token) {      setError('Please complete the challenge')      return    }    const formData = new FormData(e.currentTarget)    formData.append('cf-turnstile-response', token)    const response = await fetch('/api/contact', {      method: 'POST',      body: formData,    })    if (!response.ok) {      setError('Submission failed')      return    }    // Success  }  return (    <form onSubmit={handleSubmit}>      <input name="email" type="email" required />      <textarea name="message" required />      <Turnstile        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}        onSuccess={setToken}        onError={() => setError('Challenge failed')}        onExpire={() => setToken(undefined)}      />      {error && <div className="error">{error}</div>}      <button type="submit" disabled={!token}>        Submit      </button>    </form>  )}
```
```
'use client'import { Turnstile } from '@marsidev/react-turnstile'import { useState } from 'react'export function ContactForm() {  const [token, setToken] = useState<string>()  const [error, setError] = useState<string>()  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {    e.preventDefault()    if (!token) {      setError('Please complete the challenge')      return    }    const formData = new FormData(e.currentTarget)    formData.append('cf-turnstile-response', token)    const response = await fetch('/api/contact', {      method: 'POST',      body: formData,    })    if (!response.ok) {      setError('Submission failed')      return    }    // Success  }  return (    <form onSubmit={handleSubmit}>      <input name="email" type="email" required />      <textarea name="message" required />      <Turnstile        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}        onSuccess={setToken}        onError={() => setError('Challenge failed')}        onExpire={() => setToken(undefined)}      />      {error && <div className="error">{error}</div>}      <button type="submit" disabled={!token}>        Submit      </button>    </form>  )}
```
```
1x00000000000000000000AA
```
```
2x00000000000000000000AB
```
```
3x00000000000000000000FF
```
```
1x0000000000000000000000000000000AA
```
```
2x0000000000000000000000000000000AA
```
```
3x0000000000000000000000000000000AA
```
```
check-csp.sh
```
```
widget-configs.md
```
```
error-codes.md
```
```
testing-guide.md
```
```
react-integration.md
```
```
turnstile.render('#container', {  sitekey: SITE_KEY,  callback: async (token) => {    await fetch('/api/pre-clearance', { method: 'POST', body: JSON.stringify({ token }) })  }})
```
```
turnstile.render('#container', {  sitekey: SITE_KEY,  callback: async (token) => {    await fetch('/api/pre-clearance', { method: 'POST', body: JSON.stringify({ token }) })  }})
```
```
turnstile.render('#container', {  action: 'login',  // Track in analytics  cdata: JSON.stringify({ userId: '123' }),  // Custom payload})
```
```
turnstile.render('#container', {  action: 'login',  // Track in analytics  cdata: JSON.stringify({ userId: '123' }),  // Custom payload})
```
```
retry: 'auto'
```
```
error-callback
```
```
turnstile.render('#container', {  retry: 'auto',  'retry-interval': 8000,  // ms between retries  'error-callback': (error) => { /* handle or show fallback */ }})
```
```
turnstile.render('#container', {  retry: 'auto',  'retry-interval': 8000,  // ms between retries  'error-callback': (error) => { /* handle or show fallback */ }})
```
```
mcp__cloudflare-docs__search_cloudflare_documentation
```
```
1x00000000000000000000AA
```
```
success: false
```
```
<meta http-equiv="Content-Security-Policy" content="  frame-src https://challenges.cloudflare.com;  script-src https://challenges.cloudflare.com;">
```
```
<meta http-equiv="Content-Security-Policy" content="  frame-src https://challenges.cloudflare.com;  script-src https://challenges.cloudflare.com;">
```
```
// Option 1: Jest mocking (jest.setup.ts)jest.mock('@marsidev/react-turnstile', () => ({  Turnstile: () => <div data-testid="turnstile-mock" />,}))// Option 2: Migrate to Vitest (recommended for new projects)// Vitest handles ESM modules without mocking required
```
```
// Option 1: Jest mocking (jest.setup.ts)jest.mock('@marsidev/react-turnstile', () => ({  Turnstile: () => <div data-testid="turnstile-mock" />,}))// Option 2: Migrate to Vitest (recommended for new projects)// Vitest handles ESM modules without mocking required
```
```
/* ❌ SECURITY VULNERABILITY - client-only validation */// Frontend gets token, sends to your API// API trusts token without verification/* ✅ ALWAYS call Siteverify API */async function verifyTurnstile(token: string, env: Env): Promise<boolean> {  const response = await fetch(    'https://challenges.cloudflare.com/turnstile/v0/siteverify',    {      method: 'POST',      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },      body: new URLSearchParams({        secret: env.TURNSTILE_SECRET_KEY,        response: token,      }),    }  )  const result = await response.json()  return result.success === true}
```
```
/* ❌ SECURITY VULNERABILITY - client-only validation */// Frontend gets token, sends to your API// API trusts token without verification/* ✅ ALWAYS call Siteverify API */async function verifyTurnstile(token: string, env: Env): Promise<boolean> {  const response = await fetch(    'https://challenges.cloudflare.com/turnstile/v0/siteverify',    {      method: 'POST',      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },      body: new URLSearchParams({        secret: env.TURNSTILE_SECRET_KEY,        response: token,      }),    }  )  const result = await response.json()  return result.success === true}
```
```
/* ❌ GET not supported (unlike reCAPTCHA) */fetch(https://challenges.cloudflare.com/turnstile/v0/siteverify?secret=...&response=...)/* ✅ Must use POST */fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {  method: 'POST',  body: new URLSearchParams({ secret, response: token }),})
```
```
/* ❌ GET not supported (unlike reCAPTCHA) */fetch(https://challenges.cloudflare.com/turnstile/v0/siteverify?secret=...&response=...)/* ✅ Must use POST */fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {  method: 'POST',  body: new URLSearchParams({ secret, response: token }),})
```
```
https://challenges.cloudflare.com/turnstile/v0/siteverify?secret=...&response=...
```
```
/* ⚠️ Tokens have 300 second TTL */// User completes challenge// Token valid for 5 minutes only// After that, siteverify returns success: false/* ✅ Verify immediately after form submission */
```
```
/* ⚠️ Tokens have 300 second TTL */// User completes challenge// Token valid for 5 minutes only// After that, siteverify returns success: false/* ✅ Verify immediately after form submission */
```
```
/* ❌ Secret in frontend */const TURNSTILE_SECRET = 'xxx' // In client code!/* ✅ Secret only in backend environment */// .dev.vars or wrangler secret// Access via env.TURNSTILE_SECRET_KEY
```
```
/* ❌ Secret in frontend */const TURNSTILE_SECRET = 'xxx' // In client code!/* ✅ Secret only in backend environment */// .dev.vars or wrangler secret// Access via env.TURNSTILE_SECRET_KEY
```
```
/* ✅ Dummy keys for testing */// Site key (always passes): 1x00000000000000000000AA// Site key (always fails): 2x00000000000000000000AB// Site key (forces challenge): 3x00000000000000000000FF// Secret key (always passes): 1x0000000000000000000000000000000AA// Secret key (always fails): 2x0000000000000000000000000000000AB
```
```
/* ✅ Dummy keys for testing */// Site key (always passes): 1x00000000000000000000AA// Site key (always fails): 2x00000000000000000000AB// Site key (forces challenge): 3x00000000000000000000FF// Secret key (always passes): 1x0000000000000000000000000000000AA// Secret key (always fails): 2x0000000000000000000000000000000AB
```
```
/* ✅ Allow Turnstile iframe in CSP */// frame-src: https://challenges.cloudflare.com// script-src: https://challenges.cloudflare.com
```
```
/* ✅ Allow Turnstile iframe in CSP */// frame-src: https://challenges.cloudflare.com// script-src: https://challenges.cloudflare.com
```
This AI Agent Skill provides comprehensive guidance for implementing Cloudflare Turnstile, a modern and user-friendly CAPTCHA alternative. Developers can leverage this skill to quickly integrate bot protection into their web applications, ensuring a smoother user experience while effectively mitigating automated threats. From setup to understanding recent updates and best practices for both frontend and backend integration, this skill streamlines the process of securing forms, logins, and other critical interaction points without intrusive challenges. Enhance your application's resilience against spam and abuse with expert-level assistance.

# When to Use This Skill
- •Implementing invisible bot protection for web forms (e.g., contact forms, comment sections).
- •Securing user login and registration pages against credential stuffing and automated account creation.
- •Protecting API endpoints from excessive or malicious automated requests.
- •Integrating a modern, WCAG-compliant CAPTCHA alternative into new or existing React applications.

# Pro Tips
- 💡Always pass the `cf-turnstile-response` token from the frontend to your backend and validate it with Cloudflare's API. Never trust frontend validation alone.
- 💡Leverage the `@marsidev/react-turnstile` library for React applications to simplify integration and manage component lifecycle effectively, especially concerning callback changes.
- 💡Monitor Cloudflare Turnstile analytics regularly to gain insights into traffic patterns, bot behavior, and the effectiveness of your challenge configurations.

