# Use after() for Non-Blocking Operations
Source: https://antigravity.codes/agent-skills/server/server-after-nonblocking

## AI Worker Instructions
When the user requests functionality related to Use after() for Non-Blocking Operations, follow these guidelines and utilize this context.

## Scraped Content

# Use after() for Non-Blocking Operations
```
after()
```
```
import { logUserAction } from '@/app/utils'export async function POST(request: Request) {  // Perform mutation  await updateDatabase(request)    // Logging blocks the response  const userAgent = request.headers.get('user-agent') || 'unknown'  await logUserAction({ userAgent })    return new Response(JSON.stringify({ status: 'success' }), {    status: 200,    headers: { 'Content-Type': 'application/json' }  })}
```
```
import { logUserAction } from '@/app/utils'export async function POST(request: Request) {  // Perform mutation  await updateDatabase(request)    // Logging blocks the response  const userAgent = request.headers.get('user-agent') || 'unknown'  await logUserAction({ userAgent })    return new Response(JSON.stringify({ status: 'success' }), {    status: 200,    headers: { 'Content-Type': 'application/json' }  })}
```
```
import { after } from 'next/server'import { headers, cookies } from 'next/headers'import { logUserAction } from '@/app/utils'export async function POST(request: Request) {  // Perform mutation  await updateDatabase(request)    // Log after response is sent  after(async () => {    const userAgent = (await headers()).get('user-agent') || 'unknown'    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'        logUserAction({ sessionCookie, userAgent })  })    return new Response(JSON.stringify({ status: 'success' }), {    status: 200,    headers: { 'Content-Type': 'application/json' }  })}
```
```
import { after } from 'next/server'import { headers, cookies } from 'next/headers'import { logUserAction } from '@/app/utils'export async function POST(request: Request) {  // Perform mutation  await updateDatabase(request)    // Log after response is sent  after(async () => {    const userAgent = (await headers()).get('user-agent') || 'unknown'    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'        logUserAction({ sessionCookie, userAgent })  })    return new Response(JSON.stringify({ status: 'success' }), {    status: 200,    headers: { 'Content-Type': 'application/json' }  })}
```
```
after()
```

