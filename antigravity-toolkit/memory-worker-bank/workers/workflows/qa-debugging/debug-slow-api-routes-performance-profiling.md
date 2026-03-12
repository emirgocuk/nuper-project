# Debug Slow API Routes (Performance Profiling)
Source: https://antigravity.codes/workflows/qa-debugging/debug-slow-api-routes-performance-profiling

## AI Worker Instructions
When the user requests functionality related to Debug Slow API Routes (Performance Profiling), follow these guidelines and utilize this context.

## Scraped Content

# Debug Slow API Routes (Performance Profiling)
```
export async function GET() {     console.time('API /users');     const users = await db.user.findMany();     console.timeEnd('API /users');     return Response.json(users);   }
```
```
export async function GET() {     console.time('API /users');     const users = await db.user.findMany();     console.timeEnd('API /users');     return Response.json(users);   }
```
```
--inspect
```
```
chrome://inspect
```
```
include
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-slow-api-routes-performance-profiling.md
```
debug-slow-api-routes-performance-profiling.md
```
- In Antigravity, type /debug_slow_api_routes_performance_profiling or just describe what you want to do
```
/debug_slow_api_routes_performance_profiling
```
Learn more about workflows →

# Related Workflows

# React Performance Profiling

# Debug API Issues with Network Tab

# Debug Memory Leaks in React

