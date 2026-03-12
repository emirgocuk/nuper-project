# Secure API from CSRF
Source: https://antigravity.codes/workflows/production/secure-api-csrf-protection-samesite-cookies

## AI Worker Instructions
When the user requests functionality related to Secure API from CSRF, follow these guidelines and utilize this context.

## Scraped Content

# Secure API from CSRF
```
response.headers.set('Set-Cookie', 'token=abc; SameSite=Strict; HttpOnly');
```
```
response.headers.set('Set-Cookie', 'token=abc; SameSite=Strict; HttpOnly');
```
```
import { randomBytes } from 'crypto';   export function generateCSRFToken() {     return randomBytes(32).toString('hex');   }
```
```
import { randomBytes } from 'crypto';   export function generateCSRFToken() {     return randomBytes(32).toString('hex');   }
```
```
const origin = request.headers.get('origin');   if (!allowedOrigins.includes(origin)) {     return Response.json({ error: 'Invalid origin' }, { status: 403 });   }
```
```
const origin = request.headers.get('origin');   if (!allowedOrigins.includes(origin)) {     return Response.json({ error: 'Invalid origin' }, { status: 403 });   }
```
```
*
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as secure-api-csrf-protection-samesite-cookies.md
```
secure-api-csrf-protection-samesite-cookies.md
```
- In Antigravity, type /secure_api_csrf_protection_samesite_cookies or just describe what you want to do
```
/secure_api_csrf_protection_samesite_cookies
```
Learn more about workflows →

# Related Workflows

# Implement Rate Limiting

# Security Hardening Checklist

# Setup RBAC

