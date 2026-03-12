# Setup Incremental Static Regeneration
Source: https://antigravity.codes/workflows/performance-optimization/setup-incremental-static-regeneration-isr-nextjs

## AI Worker Instructions
When the user requests functionality related to Setup Incremental Static Regeneration, follow these guidelines and utilize this context.

## Scraped Content

# Setup Incremental Static Regeneration
```
export const revalidate = 60; // seconds      export default async function Page() {     const data = await fetchData();     return <div>{data}</div>;   }
```
```
export const revalidate = 60; // seconds      export default async function Page() {     const data = await fetchData();     return <div>{data}</div>;   }
```
```
import { revalidatePath } from 'next/cache';      export async function POST(request: Request) {     const { path } = await request.json();     revalidatePath(path);     return Response.json({ revalidated: true });   }
```
```
import { revalidatePath } from 'next/cache';      export async function POST(request: Request) {     const { path } = await request.json();     revalidatePath(path);     return Response.json({ revalidated: true });   }
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-incremental-static-regeneration-isr-nextjs.md
```
setup-incremental-static-regeneration-isr-nextjs.md
```
- In Antigravity, type /setup_incremental_static_regeneration_isr_nextjs or just describe what you want to do
```
/setup_incremental_static_regeneration_isr_nextjs
```
Learn more about workflows →

# Related Workflows

# Setup Redis Caching

# Optimize Images for Web

# Implement Request Deduplication

