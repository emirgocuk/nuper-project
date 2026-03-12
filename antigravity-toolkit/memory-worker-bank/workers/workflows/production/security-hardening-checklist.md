# Security Hardening Checklist
Source: https://antigravity.codes/workflows/production/security-hardening-headers-csp-rate-limiting

## AI Worker Instructions
When the user requests functionality related to Security Hardening Checklist, follow these guidelines and utilize this context.

## Scraped Content

# Security Hardening Checklist
```
next.config.js
```
```
module.exports = {     async headers() {       return [         {           source: '/:path*',           headers: [             { key: 'X-DNS-Prefetch-Control', value: 'on' },             { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },             { key: 'X-Content-Type-Options', value: 'nosniff' },             { key: 'X-Frame-Options', value: 'SAMEORIGIN' },             { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }           ]         }       ]     }   }
```
```
module.exports = {     async headers() {       return [         {           source: '/:path*',           headers: [             { key: 'X-DNS-Prefetch-Control', value: 'on' },             { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },             { key: 'X-Content-Type-Options', value: 'nosniff' },             { key: 'X-Frame-Options', value: 'SAMEORIGIN' },             { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }           ]         }       ]     }   }
```
```
src/middleware.ts
```
```
import { NextResponse } from 'next/server';   import type { NextRequest } from 'next/server';      export function middleware(request: NextRequest) {     const nonce = Buffer.from(crypto.randomUUID()).toString('base64');     const cspHeader =        default-src 'self';       script-src 'self' 'nonce-${nonce}' 'strict-dynamic';       style-src 'self' 'nonce-${nonce}';       img-src 'self' blob: data:;       font-src 'self';       object-src 'none';       base-uri 'self';       form-action 'self';       frame-ancestors 'none';       upgrade-insecure-requests;     .replace(/\s{2,}/g, ' ').trim();          const requestHeaders = new Headers(request.headers);     requestHeaders.set('x-nonce', nonce);     requestHeaders.set('Content-Security-Policy', cspHeader);     const response = NextResponse.next({       request: {         headers: requestHeaders,       },     });     response.headers.set('Content-Security-Policy', cspHeader);     return response;   }
```
```
import { NextResponse } from 'next/server';   import type { NextRequest } from 'next/server';      export function middleware(request: NextRequest) {     const nonce = Buffer.from(crypto.randomUUID()).toString('base64');     const cspHeader =        default-src 'self';       script-src 'self' 'nonce-${nonce}' 'strict-dynamic';       style-src 'self' 'nonce-${nonce}';       img-src 'self' blob: data:;       font-src 'self';       object-src 'none';       base-uri 'self';       form-action 'self';       frame-ancestors 'none';       upgrade-insecure-requests;     .replace(/\s{2,}/g, ' ').trim();          const requestHeaders = new Headers(request.headers);     requestHeaders.set('x-nonce', nonce);     requestHeaders.set('Content-Security-Policy', cspHeader);     const response = NextResponse.next({       request: {         headers: requestHeaders,       },     });     response.headers.set('Content-Security-Policy', cspHeader);     return response;   }
```
```
default-src 'self';       script-src 'self' 'nonce-${nonce}' 'strict-dynamic';       style-src 'self' 'nonce-${nonce}';       img-src 'self' blob: data:;       font-src 'self';       object-src 'none';       base-uri 'self';       form-action 'self';       frame-ancestors 'none';       upgrade-insecure-requests;
```
```
// lib/rate-limit.ts   const rateLimit = new Map();      export function checkRateLimit(ip: string, limit = 10) {     const now = Date.now();     const windowMs = 60 * 1000; // 1 minute     const record = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };          if (now > record.resetTime) {       record.count = 1;       record.resetTime = now + windowMs;     } else {       record.count++;     }          rateLimit.set(ip, record);     return record.count <= limit;   }
```
```
// lib/rate-limit.ts   const rateLimit = new Map();      export function checkRateLimit(ip: string, limit = 10) {     const now = Date.now();     const windowMs = 60 * 1000; // 1 minute     const record = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };          if (now > record.resetTime) {       record.count = 1;       record.resetTime = now + windowMs;     } else {       record.count++;     }          rateLimit.set(ip, record);     return record.count <= limit;   }
```
```
.env
```
```
npm audit fix
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as security-hardening-headers-csp-rate-limiting.md
```
security-hardening-headers-csp-rate-limiting.md
```
- In Antigravity, type /security_hardening_headers_csp_rate_limiting or just describe what you want to do
```
/security_hardening_headers_csp_rate_limiting
```
Learn more about workflows →

# Related Workflows

# Ultimate Next.js SEO Setup

# Implement Rate Limiting

# Setup RBAC

