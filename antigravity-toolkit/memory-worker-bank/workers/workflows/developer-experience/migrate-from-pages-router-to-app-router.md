# Migrate from Pages Router to App Router
Source: https://antigravity.codes/workflows/developer-experience/migrate-nextjs-pages-router-to-app-router

## AI Worker Instructions
When the user requests functionality related to Migrate from Pages Router to App Router, follow these guidelines and utilize this context.

## Scraped Content

# Migrate from Pages Router to App Router
```
app
```
```
pages
```
```
export async function getServerSideProps() {     const data = await fetchData();     return { props: { data } };   }
```
```
export async function getServerSideProps() {     const data = await fetchData();     return { props: { data } };   }
```
```
async function Page() {     const data = await fetchData();     return <div>{data}</div>;   }
```
```
async function Page() {     const data = await fetchData();     return <div>{data}</div>;   }
```
```
generateStaticParams
```
```
export async function generateStaticParams() {     const posts = await getPosts();     return posts.map((post) => ({ slug: post.slug }));   }
```
```
export async function generateStaticParams() {     const posts = await getPosts();     return posts.map((post) => ({ slug: post.slug }));   }
```
```
pages/api/*
```
```
app/api/*/route.ts
```
```
// app/api/users/route.ts   export async function GET() {     return Response.json({ users: [] });   }
```
```
// app/api/users/route.ts   export async function GET() {     return Response.json({ users: [] });   }
```
```
import { NextResponse } from 'next/server';   export function middleware(request) {     return NextResponse.next();   }
```
```
import { NextResponse } from 'next/server';   export function middleware(request) {     return NextResponse.next();   }
```
```
use client
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as migrate-nextjs-pages-router-to-app-router.md
```
migrate-nextjs-pages-router-to-app-router.md
```
- In Antigravity, type /migrate_nextjs_pages_router_to_app_router or just describe what you want to do
```
/migrate_nextjs_pages_router_to_app_router
```
Learn more about workflows →

# Related Workflows

# Debug 'Module Not Found' After Git Pull

# Setup VS Code Multi-Root Workspace

# Setup Monorepo with Turborepo

