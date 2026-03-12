# nextjs
Source: https://antigravity.codes/agent-skills/nextjs/nextjs

## AI Worker Instructions
When the user requests functionality related to nextjs, follow these guidelines and utilize this context.

## Scraped Content

# nextjs
```
"use cache"
```
```
revalidateTag()
```
```
updateTag()
```
```
refresh()
```
```
params
```
```
searchParams
```
```
cookies()
```
```
headers()
```
```
useEffectEvent()
```
```
cloudflare-nextjs
```
```
clerk-auth
```
```
better-auth
```
```
cloudflare-d1
```
```
drizzle-orm-d1
```
```
tailwind-v4-shadcn
```
```
zustand-state-management
```
```
tanstack-query
```
```
react-hook-form-zod
```
```
npm update next# Verify: npm list next should show 16.1.1+
```
```
npm update next# Verify: npm list next should show 16.1.1+
```
```
next dev --inspect
```
```
params
```
```
searchParams
```
```
cookies()
```
```
headers()
```
```
draftMode()
```
```
// ❌ This no longer works in Next.js 16export default function Page({ params, searchParams }: {  params: { slug: string }  searchParams: { query: string }}) {  const slug = params.slug // ❌ Error: params is a Promise  const query = searchParams.query // ❌ Error: searchParams is a Promise  return <div>{slug}</div>}
```
```
// ❌ This no longer works in Next.js 16export default function Page({ params, searchParams }: {  params: { slug: string }  searchParams: { query: string }}) {  const slug = params.slug // ❌ Error: params is a Promise  const query = searchParams.query // ❌ Error: searchParams is a Promise  return <div>{slug}</div>}
```
```
// ✅ Correct: await params and searchParamsexport default async function Page({ params, searchParams }: {  params: Promise<{ slug: string }>  searchParams: Promise<{ query: string }>}) {  const { slug } = await params // ✅ Await the promise  const { query } = await searchParams // ✅ Await the promise  return <div>{slug}</div>}
```
```
// ✅ Correct: await params and searchParamsexport default async function Page({ params, searchParams }: {  params: Promise<{ slug: string }>  searchParams: Promise<{ query: string }>}) {  const { slug } = await params // ✅ Await the promise  const { query } = await searchParams // ✅ Await the promise  return <div>{slug}</div>}
```
```
params
```
```
searchParams
```
```
cookies()
```
```
next/headers
```
```
headers()
```
```
next/headers
```
```
draftMode()
```
```
next/headers
```
```
// ❌ Beforeimport { cookies, headers } from 'next/headers'export function MyComponent() {  const cookieStore = cookies() // ❌ Sync access  const headersList = headers() // ❌ Sync access}// ✅ Afterimport { cookies, headers } from 'next/headers'export async function MyComponent() {  const cookieStore = await cookies() // ✅ Async access  const headersList = await headers() // ✅ Async access}
```
```
// ❌ Beforeimport { cookies, headers } from 'next/headers'export function MyComponent() {  const cookieStore = cookies() // ❌ Sync access  const headersList = headers() // ❌ Sync access}// ✅ Afterimport { cookies, headers } from 'next/headers'export async function MyComponent() {  const cookieStore = await cookies() // ✅ Async access  const headersList = await headers() // ✅ Async access}
```
```
npx @next/codemod@canary upgrade latest
```
```
@next-codemod-error
```
```
// For client components, use React.use() to unwrap promises'use client';import { use } from 'react';export default function ClientComponent({  params}: {  params: Promise<{ id: string }>}) {  const { id } = use(params); // Unwrap Promise in client  return <div>{id}</div>;}
```
```
// For client components, use React.use() to unwrap promises'use client';import { use } from 'react';export default function ClientComponent({  params}: {  params: Promise<{ id: string }>}) {  const { id } = use(params); // Unwrap Promise in client  return <div>{id}</div>;}
```
```
templates/app-router-async-params.tsx
```
```
middleware.ts
```
```
proxy.ts
```
```
proxy.ts
```
```
middleware.ts
```
```
proxy.ts
```
```
middleware
```
```
proxy
```
```
matcher
```
```
config.matcher
```
```
// middleware.ts ❌ Deprecated in Next.js 16import { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function middleware(request: NextRequest) {  const response = NextResponse.next()  response.headers.set('x-custom-header', 'value')  return response}export const config = {  matcher: '/api/:path*',}
```
```
// middleware.ts ❌ Deprecated in Next.js 16import { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function middleware(request: NextRequest) {  const response = NextResponse.next()  response.headers.set('x-custom-header', 'value')  return response}export const config = {  matcher: '/api/:path*',}
```
```
// proxy.ts ✅ New in Next.js 16import { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function proxy(request: NextRequest) {  const response = NextResponse.next()  response.headers.set('x-custom-header', 'value')  return response}export const config = {  matcher: '/api/:path*',}
```
```
// proxy.ts ✅ New in Next.js 16import { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function proxy(request: NextRequest) {  const response = NextResponse.next()  response.headers.set('x-custom-header', 'value')  return response}export const config = {  matcher: '/api/:path*',}
```
```
middleware.ts
```
```
proxy.ts
```
```
templates/proxy-migration.ts
```
```
references/proxy-vs-middleware.md
```
```
default.js
```
```
default.js
```
```
app/├── @auth/│   ├── login/│   │   └── page.tsx│   └── default.tsx    ← REQUIRED in Next.js 16├── @dashboard/│   ├── overview/│   │   └── page.tsx│   └── default.tsx    ← REQUIRED in Next.js 16└── layout.tsx
```
```
app/├── @auth/│   ├── login/│   │   └── page.tsx│   └── default.tsx    ← REQUIRED in Next.js 16├── @dashboard/│   ├── overview/│   │   └── page.tsx│   └── default.tsx    ← REQUIRED in Next.js 16└── layout.tsx
```
```
// app/layout.tsxexport default function Layout({  children,  auth,  dashboard,}: {  children: React.ReactNode  auth: React.ReactNode  dashboard: React.ReactNode}) {  return (    <html>      <body>        {auth}        {dashboard}        {children}      </body>    </html>  )}
```
```
// app/layout.tsxexport default function Layout({  children,  auth,  dashboard,}: {  children: React.ReactNode  auth: React.ReactNode  dashboard: React.ReactNode}) {  return (    <html>      <body>        {auth}        {dashboard}        {children}      </body>    </html>  )}
```
```
// app/@auth/default.tsxexport default function AuthDefault() {  return null // or <Skeleton /> or redirect}// app/@dashboard/default.tsxexport default function DashboardDefault() {  return null}
```
```
// app/@auth/default.tsxexport default function AuthDefault() {  return null // or <Skeleton /> or redirect}// app/@dashboard/default.tsxexport default function DashboardDefault() {  return null}
```
```
default.js
```
```
templates/parallel-routes-with-default.tsx
```
```
next lint
```
```
serverRuntimeConfig
```
```
publicRuntimeConfig
```
```
experimental.ppr
```
```
"use cache"
```
```
scroll-behavior: smooth
```
```
npx eslint .
```
```
npx biome lint .
```
```
serverRuntimeConfig
```
```
process.env.VARIABLE
```
```
experimental.ppr
```
```
"use cache"
```
```
node --version    # Should be 20.9+npm --version     # Should be 10+npx next --version # Should be 16.0.0+
```
```
node --version    # Should be 20.9+npm --version     # Should be 10+npx next --version # Should be 16.0.0+
```
```
# Using nvmnvm install 20nvm use 20nvm alias default 20# Using Homebrew (macOS)brew install node@20# Using apt (Ubuntu/Debian)sudo apt updatesudo apt install nodejs npm
```
```
# Using nvmnvm install 20nvm use 20nvm alias default 20# Using Homebrew (macOS)brew install node@20# Using apt (Ubuntu/Debian)sudo apt updatesudo apt install nodejs npm
```
```
next/image
```
```
[16, 32, 48, 64, 96, 128, 256, 384]
```
```
[640, 750, 828, 1080, 1200]
```
```
[75, 90, 100]
```
```
[75]
```
```
// next.config.tsimport type { NextConfig } from 'next'const config: NextConfig = {  images: {    minimumCacheTTL: 60, // Revert to 60 seconds    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Add larger sizes    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Restore old sizes    formats: ['image/webp'], // Default  },}export default config
```
```
// next.config.tsimport type { NextConfig } from 'next'const config: NextConfig = {  images: {    minimumCacheTTL: 60, // Revert to 60 seconds    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Add larger sizes    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Restore old sizes    formats: ['image/webp'], // Default  },}export default config
```
```
templates/image-optimization.tsx
```
```
"use cache"
```
```
"use cache"
```
```
"use cache"
```
```
"use cache"
```
```
// app/components/expensive-component.tsx'use cache'export async function ExpensiveComponent() {  const data = await fetch('https://api.example.com/data')  const json = await data.json()  return (    <div>      <h1>{json.title}</h1>      <p>{json.description}</p>    </div>  )}
```
```
// app/components/expensive-component.tsx'use cache'export async function ExpensiveComponent() {  const data = await fetch('https://api.example.com/data')  const json = await data.json()  return (    <div>      <h1>{json.title}</h1>      <p>{json.description}</p>    </div>  )}
```
```
// lib/data.ts'use cache'export async function getExpensiveData(id: string) {  const response = await fetch(https://api.example.com/items/${id})  return response.json()}// Usage in componentimport { getExpensiveData } from '@/lib/data'export async function ProductPage({ params }: { params: Promise<{ id: string }> }) {  const { id } = await params  const product = await getExpensiveData(id) // Cached  return <div>{product.name}</div>}
```
```
// lib/data.ts'use cache'export async function getExpensiveData(id: string) {  const response = await fetch(https://api.example.com/items/${id})  return response.json()}// Usage in componentimport { getExpensiveData } from '@/lib/data'export async function ProductPage({ params }: { params: Promise<{ id: string }> }) {  const { id } = await params  const product = await getExpensiveData(id) // Cached  return <div>{product.name}</div>}
```
```
https://api.example.com/items/${id}
```
```
// app/blog/[slug]/page.tsx'use cache'export async function generateStaticParams() {  const posts = await fetch('https://api.example.com/posts').then(r => r.json())  return posts.map((post: { slug: string }) => ({ slug: post.slug }))}export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {  const { slug } = await params  const post = await fetch(https://api.example.com/posts/${slug}).then(r => r.json())  return (    <article>      <h1>{post.title}</h1>      <div>{post.content}</div>    </article>  )}
```
```
// app/blog/[slug]/page.tsx'use cache'export async function generateStaticParams() {  const posts = await fetch('https://api.example.com/posts').then(r => r.json())  return posts.map((post: { slug: string }) => ({ slug: post.slug }))}export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {  const { slug } = await params  const post = await fetch(https://api.example.com/posts/${slug}).then(r => r.json())  return (    <article>      <h1>{post.title}</h1>      <div>{post.content}</div>    </article>  )}
```
```
https://api.example.com/posts/${slug}
```
```
templates/cache-component-use-cache.tsx
```
```
// app/dashboard/page.tsx// Static header (cached)'use cache'async function StaticHeader() {  return <header>My App</header>}// Dynamic user info (not cached)async function DynamicUserInfo() {  const cookieStore = await cookies()  const userId = cookieStore.get('userId')?.value  const user = await fetch(/api/users/${userId}).then(r => r.json())  return <div>Welcome, {user.name}</div>}// Page combines bothexport default function Dashboard() {  return (    <div>      <StaticHeader /> {/* Cached */}      <DynamicUserInfo /> {/* Dynamic */}    </div>  )}
```
```
// app/dashboard/page.tsx// Static header (cached)'use cache'async function StaticHeader() {  return <header>My App</header>}// Dynamic user info (not cached)async function DynamicUserInfo() {  const cookieStore = await cookies()  const userId = cookieStore.get('userId')?.value  const user = await fetch(/api/users/${userId}).then(r => r.json())  return <div>Welcome, {user.name}</div>}// Page combines bothexport default function Dashboard() {  return (    <div>      <StaticHeader /> {/* Cached */}      <DynamicUserInfo /> {/* Dynamic */}    </div>  )}
```
```
/api/users/${userId}
```
```
references/cache-components-guide.md
```
```
revalidateTag()
```
```
revalidateTag()
```
```
cacheLife
```
```
import { revalidateTag } from 'next/cache'export async function updatePost(id: string) {  await fetch(/api/posts/${id}, { method: 'PATCH' })  revalidateTag('posts') // ❌ Only one argument in Next.js 15}
```
```
import { revalidateTag } from 'next/cache'export async function updatePost(id: string) {  await fetch(/api/posts/${id}, { method: 'PATCH' })  revalidateTag('posts') // ❌ Only one argument in Next.js 15}
```
```
/api/posts/${id}
```
```
import { revalidateTag } from 'next/cache'export async function updatePost(id: string) {  await fetch(/api/posts/${id}, { method: 'PATCH' })  revalidateTag('posts', 'max') // ✅ Second argument required in Next.js 16}
```
```
import { revalidateTag } from 'next/cache'export async function updatePost(id: string) {  await fetch(/api/posts/${id}, { method: 'PATCH' })  revalidateTag('posts', 'max') // ✅ Second argument required in Next.js 16}
```
```
/api/posts/${id}
```
```
'max'
```
```
'hours'
```
```
'days'
```
```
'weeks'
```
```
'default'
```
```
revalidateTag('posts', {  stale: 3600, // Stale after 1 hour (seconds)  revalidate: 86400, // Revalidate every 24 hours (seconds)  expire: false, // Never expire (optional)})
```
```
revalidateTag('posts', {  stale: 3600, // Stale after 1 hour (seconds)  revalidate: 86400, // Revalidate every 24 hours (seconds)  expire: false, // Never expire (optional)})
```
```
'use server'import { revalidateTag } from 'next/cache'export async function createPost(formData: FormData) {  const title = formData.get('title') as string  const content = formData.get('content') as string  await fetch('/api/posts', {    method: 'POST',    body: JSON.stringify({ title, content }),  })  revalidateTag('posts', 'max') // ✅ Revalidate with max staleness}
```
```
'use server'import { revalidateTag } from 'next/cache'export async function createPost(formData: FormData) {  const title = formData.get('title') as string  const content = formData.get('content') as string  await fetch('/api/posts', {    method: 'POST',    body: JSON.stringify({ title, content }),  })  revalidateTag('posts', 'max') // ✅ Revalidate with max staleness}
```
```
templates/revalidate-tag-cache-life.ts
```
```
updateTag()
```
```
updateTag()
```
```
revalidateTag()
```
```
revalidateTag()
```
```
updateTag()
```
```
'use server'import { updateTag } from 'next/cache'export async function updateUserProfile(formData: FormData) {  const name = formData.get('name') as string  const email = formData.get('email') as string  // Update database  await db.users.update({ name, email })  // Immediately refresh cache (read-your-writes)  updateTag('user-profile')  // User sees updated data immediately (no stale data)}
```
```
'use server'import { updateTag } from 'next/cache'export async function updateUserProfile(formData: FormData) {  const name = formData.get('name') as string  const email = formData.get('email') as string  // Update database  await db.users.update({ name, email })  // Immediately refresh cache (read-your-writes)  updateTag('user-profile')  // User sees updated data immediately (no stale data)}
```
```
updateTag()
```
```
revalidateTag()
```
```
templates/server-action-update-tag.ts
```
```
refresh()
```
```
refresh()
```
```
router.refresh()
```
```
router.refresh()
```
```
'use server'import { refresh } from 'next/cache'export async function refreshDashboard() {  // Refresh uncached data (e.g., real-time metrics)  refresh()  // Cached data (e.g., static header) remains cached}
```
```
'use server'import { refresh } from 'next/cache'export async function refreshDashboard() {  // Refresh uncached data (e.g., real-time metrics)  refresh()  // Cached data (e.g., static header) remains cached}
```
```
revalidateTag()
```
```
updateTag()
```
```
refresh()
```
```
revalidateTag()
```
```
updateTag()
```
```
references/cache-components-guide.md
```
```
params
```
```
headers()
```
```
// app/api/posts/[id]/route.tsimport { NextResponse } from 'next/server'import { headers } from 'next/headers'export async function GET(  request: Request,  { params }: { params: Promise<{ id: string }> }) {  const { id } = await params // ✅ Await params in Next.js 16  const headersList = await headers() // ✅ Await headers in Next.js 16  const post = await db.posts.findUnique({ where: { id } })  return NextResponse.json(post)}
```
```
// app/api/posts/[id]/route.tsimport { NextResponse } from 'next/server'import { headers } from 'next/headers'export async function GET(  request: Request,  { params }: { params: Promise<{ id: string }> }) {  const { id } = await params // ✅ Await params in Next.js 16  const headersList = await headers() // ✅ Await headers in Next.js 16  const post = await db.posts.findUnique({ where: { id } })  return NextResponse.json(post)}
```
```
templates/route-handler-api.ts
```
```
proxy.ts
```
```
middleware.ts
```
```
middleware.ts
```
```
proxy.ts
```
```
proxy.ts
```
```
// middleware.tsimport { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function middleware(request: NextRequest) {  // Check auth  const token = request.cookies.get('token')  if (!token) {    return NextResponse.redirect(new URL('/login', request.url))  }  return NextResponse.next()}export const config = {  matcher: '/dashboard/:path*',}
```
```
// middleware.tsimport { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function middleware(request: NextRequest) {  // Check auth  const token = request.cookies.get('token')  if (!token) {    return NextResponse.redirect(new URL('/login', request.url))  }  return NextResponse.next()}export const config = {  matcher: '/dashboard/:path*',}
```
```
// proxy.tsimport { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function proxy(request: NextRequest) {  // Check auth  const token = request.cookies.get('token')  if (!token) {    return NextResponse.redirect(new URL('/login', request.url))  }  return NextResponse.next()}export const config = {  matcher: '/dashboard/:path*',}
```
```
// proxy.tsimport { NextResponse } from 'next/server'import type { NextRequest } from 'next/server'export function proxy(request: NextRequest) {  // Check auth  const token = request.cookies.get('token')  if (!token) {    return NextResponse.redirect(new URL('/login', request.url))  }  return NextResponse.next()}export const config = {  matcher: '/dashboard/:path*',}
```
```
templates/proxy-migration.ts
```
```
references/proxy-vs-middleware.md
```
```
default.js
```
```
app/├── @modal/│   ├── login/page.tsx│   └── default.tsx  ← REQUIRED in Next.js 16├── @feed/│   ├── trending/page.tsx│   └── default.tsx  ← REQUIRED in Next.js 16└── layout.tsx
```
```
app/├── @modal/│   ├── login/page.tsx│   └── default.tsx  ← REQUIRED in Next.js 16├── @feed/│   ├── trending/page.tsx│   └── default.tsx  ← REQUIRED in Next.js 16└── layout.tsx
```
```
// app/@modal/default.tsxexport default function ModalDefault() {  return null // or <Skeleton /> or redirect}
```
```
// app/@modal/default.tsxexport default function ModalDefault() {  return null // or <Skeleton /> or redirect}
```
```
default.js
```
```
default.js
```
```
// app/@modal/[...catchAll]/page.tsxexport default function CatchAll() {  return null;}// OR use catch-all in default.tsx// app/@modal/default.tsxexport default function ModalDefault({ params }: { params: { catchAll?: string[] } }) {  return null; // Handles all unmatched routes}
```
```
// app/@modal/[...catchAll]/page.tsxexport default function CatchAll() {  return null;}// OR use catch-all in default.tsx// app/@modal/default.tsxexport default function ModalDefault({ params }: { params: { catchAll?: string[] } }) {  return null; // Handles all unmatched routes}
```
```
templates/parallel-routes-with-default.tsx
```
```
'use client'import { useRouter } from 'next/navigation'import { startTransition } from 'react'export function NavigationLink({ href, children }: { href: string; children: React.ReactNode }) {  const router = useRouter()  function handleClick(e: React.MouseEvent) {    e.preventDefault()    // Wrap navigation in startTransition for View Transitions    startTransition(() => {      router.push(href)    })  }  return <a href={href} onClick={handleClick}>{children}</a>}
```
```
'use client'import { useRouter } from 'next/navigation'import { startTransition } from 'react'export function NavigationLink({ href, children }: { href: string; children: React.ReactNode }) {  const router = useRouter()  function handleClick(e: React.MouseEvent) {    e.preventDefault()    // Wrap navigation in startTransition for View Transitions    startTransition(() => {      router.push(href)    })  }  return <a href={href} onClick={handleClick}>{children}</a>}
```
```
/* app/globals.css */@view-transition {  navigation: auto;}/* Animate elements with view-transition-name */.page-title {  view-transition-name: page-title;}
```
```
/* app/globals.css */@view-transition {  navigation: auto;}/* Animate elements with view-transition-name */.page-title {  view-transition-name: page-title;}
```
```
templates/view-transitions-react-19.tsx
```
```
useEffectEvent()
```
```
useEffect
```
```
'use client'import { useEffect, experimental_useEffectEvent as useEffectEvent } from 'react'export function ChatRoom({ roomId }: { roomId: string }) {  const onConnected = useEffectEvent(() => {    console.log('Connected to room:', roomId)  })  useEffect(() => {    const connection = connectToRoom(roomId)    onConnected() // Non-reactive callback    return () => connection.disconnect()  }, [roomId]) // Only re-run when roomId changes  return <div>Chat Room {roomId}</div>}
```
```
'use client'import { useEffect, experimental_useEffectEvent as useEffectEvent } from 'react'export function ChatRoom({ roomId }: { roomId: string }) {  const onConnected = useEffectEvent(() => {    console.log('Connected to room:', roomId)  })  useEffect(() => {    const connection = connectToRoom(roomId)    onConnected() // Non-reactive callback    return () => connection.disconnect()  }, [roomId]) // Only re-run when roomId changes  return <div>Chat Room {roomId}</div>}
```
```
useEffect
```
```
useMemo
```
```
useCallback
```
```
import type { NextConfig } from 'next'const config: NextConfig = {  experimental: {    reactCompiler: true,  },}export default config
```
```
import type { NextConfig } from 'next'const config: NextConfig = {  experimental: {    reactCompiler: true,  },}export default config
```
```
npm install babel-plugin-react-compiler
```
```
npm install babel-plugin-react-compiler
```
```
'use client'export function ExpensiveList({ items }: { items: string[] }) {  // React Compiler automatically memoizes this  const filteredItems = items.filter(item => item.length > 3)  return (    <ul>      {filteredItems.map(item => (        <li key={item}>{item}</li>      ))}    </ul>  )}
```
```
'use client'export function ExpensiveList({ items }: { items: string[] }) {  // React Compiler automatically memoizes this  const filteredItems = items.filter(item => item.length > 3)  return (    <ul>      {filteredItems.map(item => (        <li key={item}>{item}</li>      ))}    </ul>  )}
```
```
references/react-19-integration.md
```
```
npm run build -- --webpack
```
```
npm run build -- --webpack
```
```
// next.config.tsimport type { NextConfig } from 'next'const config: NextConfig = {  experimental: {    turbopack: {      fileSystemCaching: true, // Beta: Persist cache between runs    },  },}export default config
```
```
// next.config.tsimport type { NextConfig } from 'next'const config: NextConfig = {  experimental: {    turbopack: {      fileSystemCaching: true, // Beta: Persist cache between runs    },  },}export default config
```
```
# Use webpack for production buildsnpm run build -- --webpack
```
```
# Use webpack for production buildsnpm run build -- --webpack
```
```
next.config.ts
```
```
const config: NextConfig = {  experimental: {    turbo: false, // Disable Turbopack for production  },};
```
```
const config: NextConfig = {  experimental: {    turbo: false, // Disable Turbopack for production  },};
```
```
// next.config.tsconst config: NextConfig = {  productionBrowserSourceMaps: false, // Disable source maps};
```
```
// next.config.tsconst config: NextConfig = {  productionBrowserSourceMaps: false, // Disable source maps};
```
```
.map
```
```
# .vercelignore or similar*.map
```
```
# .vercelignore or similar*.map
```
```
node_modules
```
```
// next.config.tsconst config: NextConfig = {  experimental: {    serverExternalPackages: ['package-name'], // Explicitly externalize packages  },};
```
```
// next.config.tsconst config: NextConfig = {  experimental: {    serverExternalPackages: ['package-name'], // Explicitly externalize packages  },};
```
```
params
```
```
Type 'Promise<{ id: string }>' is not assignable to type '{ id: string }'
```
```
Type 'Promise<{ id: string }>' is not assignable to type '{ id: string }'
```
```
params
```
```
params
```
```
// ❌ Beforeexport default function Page({ params }: { params: { id: string } }) {  const id = params.id}// ✅ Afterexport default async function Page({ params }: { params: Promise<{ id: string }> }) {  const { id } = await params}
```
```
// ❌ Beforeexport default function Page({ params }: { params: { id: string } }) {  const id = params.id}// ✅ Afterexport default async function Page({ params }: { params: Promise<{ id: string }> }) {  const { id } = await params}
```
```
searchParams
```
```
Property 'query' does not exist on type 'Promise<{ query: string }>'
```
```
Property 'query' does not exist on type 'Promise<{ query: string }>'
```
```
searchParams
```
```
// ❌ Beforeexport default function Page({ searchParams }: { searchParams: { query: string } }) {  const query = searchParams.query}// ✅ Afterexport default async function Page({ searchParams }: { searchParams: Promise<{ query: string }> }) {  const { query } = await searchParams}
```
```
// ❌ Beforeexport default function Page({ searchParams }: { searchParams: { query: string } }) {  const query = searchParams.query}// ✅ Afterexport default async function Page({ searchParams }: { searchParams: Promise<{ query: string }> }) {  const { query } = await searchParams}
```
```
cookies()
```
```
'cookies' implicitly has return type 'any'
```
```
'cookies' implicitly has return type 'any'
```
```
cookies()
```
```
// ❌ Beforeimport { cookies } from 'next/headers'export function MyComponent() {  const cookieStore = cookies()}// ✅ Afterimport { cookies } from 'next/headers'export async function MyComponent() {  const cookieStore = await cookies()}
```
```
// ❌ Beforeimport { cookies } from 'next/headers'export function MyComponent() {  const cookieStore = cookies()}// ✅ Afterimport { cookies } from 'next/headers'export async function MyComponent() {  const cookieStore = await cookies()}
```
```
default.js
```
```
Error: Parallel route @modal/login was matched but no default.js was found
```
```
Error: Parallel route @modal/login was matched but no default.js was found
```
```
default.js
```
```
default.tsx
```
```
// app/@modal/default.tsxexport default function ModalDefault() {  return null}
```
```
// app/@modal/default.tsxexport default function ModalDefault() {  return null}
```
```
revalidateTag()
```
```
Expected 2 arguments, but got 1
```
```
Expected 2 arguments, but got 1
```
```
revalidateTag()
```
```
cacheLife
```
```
// ❌ BeforerevalidateTag('posts')// ✅ AfterrevalidateTag('posts', 'max')
```
```
// ❌ BeforerevalidateTag('posts')// ✅ AfterrevalidateTag('posts', 'max')
```
```
You're importing a component that needs useState. It only works in a Client Component
```
```
You're importing a component that needs useState. It only works in a Client Component
```
```
'use client'
```
```
// ✅ Add 'use client' at the top'use client'import { useState } from 'react'export function Counter() {  const [count, setCount] = useState(0)  return <button onClick={() => setCount(count + 1)}>{count}</button>}
```
```
// ✅ Add 'use client' at the top'use client'import { useState } from 'react'export function Counter() {  const [count, setCount] = useState(0)  return <button onClick={() => setCount(count + 1)}>{count}</button>}
```
```
middleware.ts
```
```
Warning: middleware.ts is deprecated. Use proxy.ts instead.
```
```
Warning: middleware.ts is deprecated. Use proxy.ts instead.
```
```
proxy.ts
```
```
// Rename: middleware.ts → proxy.ts// Rename function: middleware → proxyexport function proxy(request: NextRequest) {  // Same logic}
```
```
// Rename: middleware.ts → proxy.ts// Rename function: middleware → proxyexport function proxy(request: NextRequest) {  // Same logic}
```
```
Error: Failed to compile with Turbopack
```
```
Error: Failed to compile with Turbopack
```
```
npm run build -- --webpack
```
```
npm run build -- --webpack
```
```
next/image
```
```
Invalid src prop (https://example.com/image.jpg) on next/image. Hostname "example.com" is not configured under images in your next.config.js
```
```
Invalid src prop (https://example.com/image.jpg) on next/image. Hostname "example.com" is not configured under images in your next.config.js
```
```
next/image
```
```
next.config.js
```
```
next.config.ts
```
```
const config: NextConfig = {  images: {    remotePatterns: [      {        protocol: 'https',        hostname: 'example.com',      },    ],  },}
```
```
const config: NextConfig = {  images: {    remotePatterns: [      {        protocol: 'https',        hostname: 'example.com',      },    ],  },}
```
```
You're importing a Server Component into a Client Component
```
```
You're importing a Server Component into a Client Component
```
```
// ❌ Wrong'use client'import { ServerComponent } from './server-component' // Errorexport function ClientComponent() {  return <ServerComponent />}// ✅ Correct'use client'export function ClientComponent({ children }: { children: React.ReactNode }) {  return <div>{children}</div>}// Usage<ClientComponent>  <ServerComponent /> {/* Pass as children */}</ClientComponent>
```
```
// ❌ Wrong'use client'import { ServerComponent } from './server-component' // Errorexport function ClientComponent() {  return <ServerComponent />}// ✅ Correct'use client'export function ClientComponent({ children }: { children: React.ReactNode }) {  return <div>{children}</div>}// Usage<ClientComponent>  <ServerComponent /> {/* Pass as children */}</ClientComponent>
```
```
generateStaticParams
```
```
generateStaticParams
```
```
export const dynamic = 'force-static'
```
```
export const dynamic = 'force-static'export async function generateStaticParams() {  const posts = await fetch('/api/posts').then(r => r.json())  return posts.map((post: { id: string }) => ({ id: post.id }))}
```
```
export const dynamic = 'force-static'export async function generateStaticParams() {  const posts = await fetch('/api/posts').then(r => r.json())  return posts.map((post: { id: string }) => ({ id: post.id }))}
```
```
fetch()
```
```
"use cache"
```
```
"use cache"
```
```
'use cache'export async function getPosts() {  const response = await fetch('/api/posts')  return response.json()}
```
```
'use cache'export async function getPosts() {  const response = await fetch('/api/posts')  return response.json()}
```
```
Error: Conflicting routes: /about and /(marketing)/about
```
```
Error: Conflicting routes: /about and /(marketing)/about
```
```
app/├── (marketing)/about/page.tsx  → /about└── (shop)/about/page.tsx       → ERROR: Duplicate /about# Fix: Use different routesapp/├── (marketing)/about/page.tsx     → /about└── (shop)/store-info/page.tsx     → /store-info
```
```
app/├── (marketing)/about/page.tsx  → /about└── (shop)/about/page.tsx       → ERROR: Duplicate /about# Fix: Use different routesapp/├── (marketing)/about/page.tsx     → /about└── (shop)/store-info/page.tsx     → /store-info
```
```
generateMetadata()
```
```
generateMetadata()
```
```
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {  const { id } = await params  const post = await fetch(/api/posts/${id}).then(r => r.json())  return {    title: post.title,    description: post.excerpt,  }}
```
```
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {  const { id } = await params  const post = await fetch(/api/posts/${id}).then(r => r.json())  return {    title: post.title,    description: post.excerpt,  }}
```
```
/api/posts/${id}
```
```
next/font
```
```
<html>
```
```
<body>
```
```
import { Inter } from 'next/font/google'const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })export default function RootLayout({ children }: { children: React.ReactNode }) {  return (    <html className={inter.variable}> {/* ✅ Apply variable */}      <body>{children}</body>    </html>  )}
```
```
import { Inter } from 'next/font/google'const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })export default function RootLayout({ children }: { children: React.ReactNode }) {  return (    <html className={inter.variable}> {/* ✅ Apply variable */}      <body>{children}</body>    </html>  )}
```
```
NEXT_PUBLIC_
```
```
# .envSECRET_KEY=abc123                  # Server-onlyNEXT_PUBLIC_API_URL=https://api    # Available in browser
```
```
# .envSECRET_KEY=abc123                  # Server-onlyNEXT_PUBLIC_API_URL=https://api    # Available in browser
```
```
// Server Component (both work)const secret = process.env.SECRET_KEYconst apiUrl = process.env.NEXT_PUBLIC_API_URL// Client Component (only public vars work)const apiUrl = process.env.NEXT_PUBLIC_API_URL
```
```
// Server Component (both work)const secret = process.env.SECRET_KEYconst apiUrl = process.env.NEXT_PUBLIC_API_URL// Client Component (only public vars work)const apiUrl = process.env.NEXT_PUBLIC_API_URL
```
```
Error: Could not find Server Action
```
```
Error: Could not find Server Action
```
```
'use server'
```
```
'use server'
```
```
// ❌ Beforeexport async function createPost(formData: FormData) {  await db.posts.create({ ... })}// ✅ After'use server'export async function createPost(formData: FormData) {  await db.posts.create({ ... })}
```
```
// ❌ Beforeexport async function createPost(formData: FormData) {  await db.posts.create({ ... })}// ✅ After'use server'export async function createPost(formData: FormData) {  await db.posts.create({ ... })}
```
```
baseUrl
```
```
paths
```
```
tsconfig.json
```
```
{  "compilerOptions": {    "baseUrl": ".",    "paths": {      "@/*": ["./*"],      "@/components/*": ["./app/components/*"]    }  }}
```
```
{  "compilerOptions": {    "baseUrl": ".",    "paths": {      "@/*": ["./*"],      "@/components/*": ["./app/components/*"]    }  }}
```
```
references/top-errors.md
```
```
Throttling navigation to prevent the browser from hanging
```
```
proxy.ts
```
```
middleware.ts
```
```
redirect()
```
```
<Link>
```
```
next dev
```
```
<Link>
```
```
// ✅ Workaround: Disable prefetch<Link href="/my-route" prefetch={false}>  Navigate</Link>
```
```
// ✅ Workaround: Disable prefetch<Link href="/my-route" prefetch={false}>  Navigate</Link>
```
```
generateStaticParams
```
```
"use cache"
```
```
intlayer
```
```
next-intl
```
```
lingui
```
```
params
```
```
generateStaticParams
```
```
params
```
```
params
```
```
generateStaticParams
```
```
// app/[locale]/[id]/page.tsxexport async function generateStaticParams() {  return [    { locale: 'en', id: '1' },    { locale: 'en', id: '2' },    // ... all combinations  ];}'use cache'export default async function Page({ params }: Props) {  // Now caching works}
```
```
// app/[locale]/[id]/page.tsxexport async function generateStaticParams() {  return [    { locale: 'en', id: '1' },    { locale: 'en', id: '2' },    // ... all combinations  ];}'use cache'export default async function Page({ params }: Props) {  // Now caching works}
```
```
[locale]
```
```
_next
```
```
RangeError: Incorrect locale information provided
```
```
instanceof CustomError
```
```
false
```
```
error.name
```
```
error.constructor.name
```
```
instanceof
```
```
// ❌ Wrong: instanceof doesn't worktry {  throw new CustomError('Test error');} catch (error) {  if (error instanceof CustomError) { // ❌ false    // Never reached  }}// ✅ Correct: Use error.nametry {  throw new CustomError('Test error');} catch (error) {  if (error instanceof Error && error.name === 'CustomError') { // ✅ true    // Handle CustomError  }}// ✅ Alternative: Use constructor.nameif (error.constructor.name === 'CustomError') {  // Handle CustomError}
```
```
// ❌ Wrong: instanceof doesn't worktry {  throw new CustomError('Test error');} catch (error) {  if (error instanceof CustomError) { // ❌ false    // Never reached  }}// ✅ Correct: Use error.nametry {  throw new CustomError('Test error');} catch (error) {  if (error instanceof Error && error.name === 'CustomError') { // ✅ true    // Handle CustomError  }}// ✅ Alternative: Use constructor.nameif (error.constructor.name === 'CustomError') {  // Handle CustomError}
```
```
// ❌ Wrong: Function not serializableconst user = {  name: 'John',  getProfile: () => console.log('profile'), // ❌ Not serializable};<ClientComponent user={user} />// ✅ Correct: Only serializable propsinterface SerializableUser {  name: string;  email: string;  // No functions, no class instances, no Symbols}// ✅ Alternative: Create functions in Client Component'use client';export default function ClientComponent({ user }: { user: { name: string } }) {  const getProfile = () => console.log('profile'); // Define in client  return <div onClick={getProfile}>{user.name}</div>;}
```
```
// ❌ Wrong: Function not serializableconst user = {  name: 'John',  getProfile: () => console.log('profile'), // ❌ Not serializable};<ClientComponent user={user} />// ✅ Correct: Only serializable propsinterface SerializableUser {  name: string;  email: string;  // No functions, no class instances, no Symbols}// ✅ Alternative: Create functions in Client Component'use client';export default function ClientComponent({ user }: { user: { name: string } }) {  const getProfile = () => console.log('profile'); // Define in client  return <div onClick={getProfile}>{user.name}</div>;}
```
```
import { z } from 'zod';const UserSchema = z.object({  name: z.string(),  email: z.string(),});type User = z.infer<typeof UserSchema>;
```
```
import { z } from 'zod';const UserSchema = z.object({  name: z.string(),  email: z.string(),});type User = z.infer<typeof UserSchema>;
```
```
The 'path' argument must be of type string
```
```
npm run build -- --webpack
```
```
npm run build -- --webpack
```
```
// next.config.tsconst config: NextConfig = {  experimental: {    turbo: false,  },};
```
```
// next.config.tsconst config: NextConfig = {  experimental: {    turbo: false,  },};
```
```
// next.config.tsconst config: NextConfig = {  productionBrowserSourceMaps: false,};
```
```
// next.config.tsconst config: NextConfig = {  productionBrowserSourceMaps: false,};
```
```
.map
```
```
# .vercelignore*.map
```
```
# .vercelignore*.map
```
```
Module not found
```
```
node_modules
```
```
// next.config.tsconst config: NextConfig = {  experimental: {    serverExternalPackages: ['package-name'],  },};
```
```
// next.config.tsconst config: NextConfig = {  experimental: {    serverExternalPackages: ['package-name'],  },};
```
```
references/top-errors.md
```
```
templates/
```
```
app-router-async-params.tsx
```
```
parallel-routes-with-default.tsx
```
```
cache-component-use-cache.tsx
```
```
"use cache"
```
```
revalidate-tag-cache-life.ts
```
```
revalidateTag()
```
```
server-action-update-tag.ts
```
```
updateTag()
```
```
proxy-migration.ts
```
```
view-transitions-react-19.tsx
```
```
next.config.ts
```
```
references/
```
```
next-16-migration-guide.md
```
```
cache-components-guide.md
```
```
proxy-vs-middleware.md
```
```
async-route-params.md
```
```
react-19-integration.md
```
```
top-errors.md
```
```
/websites/nextjs
```
```
./scripts/check-versions.sh
```
```
./scripts/check-versions.sh
```
```
cd skills/nextjs./scripts/check-versions.sh
```
```
cd skills/nextjs./scripts/check-versions.sh
```
```
/* ❌ Next.js 15 (synchronous) */export default function Page({ params, searchParams }: {  params: { slug: string }  searchParams: { query: string }}) {  const slug = params.slug // Error: params is a Promise}/* ✅ Next.js 16 (asynchronous) */export default async function Page({ params, searchParams }: {  params: Promise<{ slug: string }>  searchParams: Promise<{ query: string }>}) {  const { slug } = await params  const { query } = await searchParams}
```
```
/* ❌ Next.js 15 (synchronous) */export default function Page({ params, searchParams }: {  params: { slug: string }  searchParams: { query: string }}) {  const slug = params.slug // Error: params is a Promise}/* ✅ Next.js 16 (asynchronous) */export default async function Page({ params, searchParams }: {  params: Promise<{ slug: string }>  searchParams: Promise<{ query: string }>}) {  const { slug } = await params  const { query } = await searchParams}
```
```
/* ❌ Next.js 15 */import { cookies, headers } from 'next/headers'const cookieStore = cookies()const headersList = headers()/* ✅ Next.js 16 */const cookieStore = await cookies()const headersList = await headers()
```
```
/* ❌ Next.js 15 */import { cookies, headers } from 'next/headers'const cookieStore = cookies()const headersList = headers()/* ✅ Next.js 16 */const cookieStore = await cookies()const headersList = await headers()
```
```
/* ❌ Deprecated in Next.js 16 */// middleware.tsexport function middleware(request: NextRequest) { ... }/* ✅ Use proxy.ts instead */// proxy.tsexport function proxy(request: NextRequest) { ... }
```
```
/* ❌ Deprecated in Next.js 16 */// middleware.tsexport function middleware(request: NextRequest) { ... }/* ✅ Use proxy.ts instead */// proxy.tsexport function proxy(request: NextRequest) { ... }
```
```
/* ❌ Will fail during soft navigation */app/├── @modal/│   └── login/page.tsx/* ✅ Add default.tsx to every parallel route */app/├── @modal/│   ├── login/page.tsx│   └── default.tsx  ← Required!
```
```
/* ❌ Will fail during soft navigation */app/├── @modal/│   └── login/page.tsx/* ✅ Add default.tsx to every parallel route */app/├── @modal/│   ├── login/page.tsx│   └── default.tsx  ← Required!
```
```
// app/@modal/default.tsxexport default function ModalDefault() {  return null}
```
```
// app/@modal/default.tsxexport default function ModalDefault() {  return null}
```
```
/* ❌ Next.js 15 */revalidateTag('posts')/* ✅ Next.js 16 - second argument required */revalidateTag('posts', 'max')// Or with custom cache life:revalidateTag('posts', {  stale: 3600,  revalidate: 86400,})
```
```
/* ❌ Next.js 15 */revalidateTag('posts')/* ✅ Next.js 16 - second argument required */revalidateTag('posts', 'max')// Or with custom cache life:revalidateTag('posts', {  stale: 3600,  revalidate: 86400,})
```
```
/* ❌ Next.js 15 - implicit caching */export async function getData() {  return fetch('/api/data').then(r => r.json())}/* ✅ Next.js 16 - opt-in caching */'use cache'export async function getData() {  return fetch('/api/data').then(r => r.json())}
```
```
/* ❌ Next.js 15 - implicit caching */export async function getData() {  return fetch('/api/data').then(r => r.json())}/* ✅ Next.js 16 - opt-in caching */'use cache'export async function getData() {  return fetch('/api/data').then(r => r.json())}
```
```
params: { id: string }
```
```
params: Promise<{ id: string }>
```
```
await params
```
```
const cookieStore = cookies()
```
```
const cookieStore = await cookies()
```
```
middleware.ts
```
```
proxy.ts
```
```
default.tsx
```
```
default.tsx
```
```
null
```
```
revalidateTag('tag')
```
```
revalidateTag('tag', 'max')
```
```
'use cache'
```
```
experimental.ppr
```
```
"use cache"
```
This skill provides deep insights into Next.js 16 and its App Router, focusing on the latest production best practices and crucial updates. It serves as an invaluable guide for developers grappling with breaking changes, new features like Turbopack, and integration with React 19. Whether you're upgrading an existing application or starting a new project, this resource distills complex information into actionable knowledge, helping you build more resilient and performant Next.js applications ready for deployment. Leverage this skill to stay ahead in the rapidly evolving Next.js ecosystem.

# When to Use This Skill
- •Debugging or migrating an existing Next.js application to version 16, specifically addressing breaking changes.
- •Implementing advanced production patterns like caching strategies and optimized route handlers within the App Router.
- •Understanding the implications and usage of React 19 features when building Next.js 16 applications.
- •Troubleshooting common Next.js 16 errors and optimizing build performance with Turbopack.

# Pro Tips
- 💡Always review the 'Next.js 16 Breaking Changes' section thoroughly before any major upgrade to anticipate potential migration issues.
- 💡Leverage the new caching APIs and `cache` components to significantly improve your application's performance in production environments.
- 💡When encountering performance bottlenecks, experiment with Turbopack (stable in Next.js 16) for faster development and build times.

