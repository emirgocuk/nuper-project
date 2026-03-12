# Fix CORS Issues
Source: https://antigravity.codes/workflows/qa-debugging/fix-cors-issues-api-proxy-headers

## AI Worker Instructions
When the user requests functionality related to Fix CORS Issues, follow these guidelines and utilize this context.

## Scraped Content

# Fix CORS Issues
```
// app/api/proxy/route.ts   export async function GET(request: Request) {     const { searchParams } = new URL(request.url);     const url = searchParams.get('url');          const response = await fetch(url!, {       headers: { 'User-Agent': 'MyApp/1.0' },     });          return new Response(response.body, {       headers: {         'Content-Type': response.headers.get('Content-Type') || 'application/json',       },     });   }
```
```
// app/api/proxy/route.ts   export async function GET(request: Request) {     const { searchParams } = new URL(request.url);     const url = searchParams.get('url');          const response = await fetch(url!, {       headers: { 'User-Agent': 'MyApp/1.0' },     });          return new Response(response.body, {       headers: {         'Content-Type': response.headers.get('Content-Type') || 'application/json',       },     });   }
```
```
fetch('/api/proxy?url=' + encodeURIComponent('https://api.example.com/data'))
```
```
// Express.js   app.use((req, res, next) => {     res.header('Access-Control-Allow-Origin', 'https://yourdomain.com');     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');     if (req.method === 'OPTIONS') return res.sendStatus(200);     next();   });
```
```
// Express.js   app.use((req, res, next) => {     res.header('Access-Control-Allow-Origin', 'https://yourdomain.com');     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');     if (req.method === 'OPTIONS') return res.sendStatus(200);     next();   });
```
```
// next.config.js   module.exports = {     async rewrites() {       return [         {           source: '/api/:path*',           destination: 'https://api.example.com/:path*',         },       ];     },   };
```
```
// next.config.js   module.exports = {     async rewrites() {       return [         {           source: '/api/:path*',           destination: 'https://api.example.com/:path*',         },       ];     },   };
```
```
Access-Control-Allow-Origin: *
```
```
Access-Control-Allow-Credentials: true
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as fix-cors-issues-api-proxy-headers.md
```
fix-cors-issues-api-proxy-headers.md
```
- In Antigravity, type /fix_cors_issues_api_proxy_headers or just describe what you want to do
```
/fix_cors_issues_api_proxy_headers
```
Learn more about workflows →

# Related Workflows

# Debug API Issues with Network Tab

# Debug Slow API Routes (Performance Profiling)

# React Performance Profiling

