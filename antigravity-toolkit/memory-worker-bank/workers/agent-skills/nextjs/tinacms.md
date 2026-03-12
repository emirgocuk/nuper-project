# tinacms
Source: https://antigravity.codes/agent-skills/nextjs/tinacms

## AI Worker Instructions
When the user requests functionality related to tinacms, follow these guidelines and utilize this context.

## Scraped Content

# tinacms
```
# Install pnpm (if needed)npm install -g pnpm# Initialize TinaCMSnpx @tinacms/cli@latest init# Install dependencies with pnpmpnpm install# Update package.json scripts{  "dev": "tinacms dev -c \"next dev\"",  "build": "tinacms build && next build"}# Set environment variablesNEXT_PUBLIC_TINA_CLIENT_ID=your_client_idTINA_TOKEN=your_read_only_token# Start dev serverpnpm run dev# Access admin interfacehttp://localhost:3000/admin/index.html
```
```
# Install pnpm (if needed)npm install -g pnpm# Initialize TinaCMSnpx @tinacms/cli@latest init# Install dependencies with pnpmpnpm install# Update package.json scripts{  "dev": "tinacms dev -c \"next dev\"",  "build": "tinacms build && next build"}# Set environment variablesNEXT_PUBLIC_TINA_CLIENT_ID=your_client_idTINA_TOKEN=your_read_only_token# Start dev serverpnpm run dev# Access admin interfacehttp://localhost:3000/admin/index.html
```
```
{  "dependencies": {    "tinacms": "3.3.1",  // NOT "^3.3.1"    "@tinacms/cli": "2.1.1"  }}
```
```
{  "dependencies": {    "tinacms": "3.3.1",  // NOT "^3.3.1"    "@tinacms/cli": "2.1.1"  }}
```
```
import { useTina } from 'tinacms/dist/react'import { client } from '../../tina/__generated__/client'export default function BlogPost(props) {  const { data } = useTina({    query: props.query,    variables: props.variables,    data: props.data  })  return <article><h1>{data.post.title}</h1></article>}export async function getStaticProps({ params }) {  const response = await client.queries.post({    relativePath: ${params.slug}.md  })  return {    props: {      data: response.data,      query: response.query,      variables: response.variables    }  }}
```
```
import { useTina } from 'tinacms/dist/react'import { client } from '../../tina/__generated__/client'export default function BlogPost(props) {  const { data } = useTina({    query: props.query,    variables: props.variables,    data: props.data  })  return <article><h1>{data.post.title}</h1></article>}export async function getStaticProps({ params }) {  const response = await client.queries.post({    relativePath: ${params.slug}.md  })  return {    props: {      data: response.data,      query: response.query,      variables: response.variables    }  }}
```
```
${params.slug}.md
```
```
app/admin/[[...index]]/page.tsx
```
```
pages/admin/[[...index]].tsx
```
```
import { defineConfig } from 'tinacms'export default defineConfig({  branch: process.env.GITHUB_BRANCH || 'main',  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,  token: process.env.TINA_TOKEN,  build: {    outputFolder: 'admin',    publicFolder: 'public',  },  schema: {    collections: [/* ... */],  },})
```
```
import { defineConfig } from 'tinacms'export default defineConfig({  branch: process.env.GITHUB_BRANCH || 'main',  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,  token: process.env.TINA_TOKEN,  build: {    outputFolder: 'admin',    publicFolder: 'public',  },  schema: {    collections: [/* ... */],  },})
```
```
{  name: 'post',           // Alphanumeric + underscores only  label: 'Blog Posts',  path: 'content/posts',  // No trailing slash  format: 'mdx',  fields: [    {      type: 'string',      name: 'title',      label: 'Title',      isTitle: true,      required: true    },    {      type: 'rich-text',      name: 'body',      label: 'Body',      isBody: true    }  ]}
```
```
{  name: 'post',           // Alphanumeric + underscores only  label: 'Blog Posts',  path: 'content/posts',  // No trailing slash  format: 'mdx',  fields: [    {      type: 'string',      name: 'title',      label: 'Title',      isTitle: true,      required: true    },    {      type: 'rich-text',      name: 'body',      label: 'Body',      isBody: true    }  ]}
```
```
string
```
```
rich-text
```
```
number
```
```
datetime
```
```
boolean
```
```
image
```
```
reference
```
```
object
```
```
bio: string
```
```
bio: rich-text
```
```
// Example: Reference field referencing multiple collections{  type: 'reference',  name: 'contributor',  collections: ['author', 'editor']  // Ensure shared fields have same type}
```
```
// Example: Reference field referencing multiple collections{  type: 'reference',  name: 'contributor',  collections: ['author', 'editor']  // Ensure shared fields have same type}
```
```
ERROR: Schema Not Successfully BuiltERROR: Config Not Successfully Executed
```
```
ERROR: Schema Not Successfully BuiltERROR: Config Not Successfully Executed
```
```
window
```
```
// ❌ Bad - Imports entire component directoryimport { HeroComponent } from '../components/'// ✅ Good - Import specific fileimport { HeroComponent } from '../components/blocks/hero'
```
```
// ❌ Bad - Imports entire component directoryimport { HeroComponent } from '../components/'// ✅ Good - Import specific fileimport { HeroComponent } from '../components/blocks/hero'
```
```
tina/config.ts
```
```
.schema.ts
```
```
references/common-errors.md#esbuild
```
```
Error: Could not resolve "tinacms"
```
```
Error: Could not resolve "tinacms"
```
```
# Clear cache and reinstallrm -rf node_modules package-lock.jsonnpm install# Or with pnpmrm -rf node_modules pnpm-lock.yamlpnpm install# Or with yarnrm -rf node_modules yarn.lockyarn install
```
```
# Clear cache and reinstallrm -rf node_modules package-lock.jsonnpm install# Or with pnpmrm -rf node_modules pnpm-lock.yamlpnpm install# Or with yarnrm -rf node_modules yarn.lockyarn install
```
```
package-lock.json
```
```
pnpm-lock.yaml
```
```
yarn.lock
```
```
--no-optional
```
```
--omit=optional
```
```
react
```
```
react-dom
```
```
Field name contains invalid characters
```
```
Field name contains invalid characters
```
```
// ❌ Bad - Uses hyphens{  name: 'hero-image',  label: 'Hero Image',  type: 'image'}// ❌ Bad - Uses spaces{  name: 'hero image',  label: 'Hero Image',  type: 'image'}// ✅ Good - Uses underscores{  name: 'hero_image',  label: 'Hero Image',  type: 'image'}// ✅ Good - CamelCase also works{  name: 'heroImage',  label: 'Hero Image',  type: 'image'}
```
```
// ❌ Bad - Uses hyphens{  name: 'hero-image',  label: 'Hero Image',  type: 'image'}// ❌ Bad - Uses spaces{  name: 'hero image',  label: 'Hero Image',  type: 'image'}// ✅ Good - Uses underscores{  name: 'hero_image',  label: 'Hero Image',  type: 'image'}// ✅ Good - CamelCase also works{  name: 'heroImage',  label: 'Hero Image',  type: 'image'}
```
```
127.0.0.1
```
```
0.0.0.0
```
```
# Ensure framework dev server listens on all interfacestinacms dev -c "next dev --hostname 0.0.0.0"tinacms dev -c "vite --host 0.0.0.0"tinacms dev -c "astro dev --host 0.0.0.0"
```
```
# Ensure framework dev server listens on all interfacestinacms dev -c "next dev --hostname 0.0.0.0"tinacms dev -c "vite --host 0.0.0.0"tinacms dev -c "astro dev --host 0.0.0.0"
```
```
services:  app:    build: .    ports:      - "3000:3000"    command: npm run dev  # Which runs: tinacms dev -c "next dev --hostname 0.0.0.0"
```
```
services:  app:    build: .    ports:      - "3000:3000"    command: npm run dev  # Which runs: tinacms dev -c "next dev --hostname 0.0.0.0"
```
```
_template
```
```
GetCollection failed: Unable to fetchtemplate name was not provided
```
```
GetCollection failed: Unable to fetchtemplate name was not provided
```
```
templates
```
```
_template
```
```
templates
```
```
fields
```
```
fields
```
```
{  name: 'post',  path: 'content/posts',  fields: [/* ... */]  // No _template needed}
```
```
{  name: 'post',  path: 'content/posts',  fields: [/* ... */]  // No _template needed}
```
```
_template
```
```
---_template: article  # ← Required when using templates arraytitle: My Post---
```
```
---_template: article  # ← Required when using templates arraytitle: My Post---
```
```
# Remove _template from all files in content/posts/find content/posts -name "*.md" -exec sed -i '/_template:/d' {} +
```
```
# Remove _template from all files in content/posts/find content/posts -name "*.md" -exec sed -i '/_template:/d' {} +
```
```
path
```
```
// Files located at: content/posts/hello.md// ✅ Correct{  name: 'post',  path: 'content/posts',  // Matches file location  fields: [/* ... */]}// ❌ Wrong - Missing 'content/'{  name: 'post',  path: 'posts',  // Files won't be found  fields: [/* ... */]}// ❌ Wrong - Trailing slash{  name: 'post',  path: 'content/posts/',  // May cause issues  fields: [/* ... */]}
```
```
// Files located at: content/posts/hello.md// ✅ Correct{  name: 'post',  path: 'content/posts',  // Matches file location  fields: [/* ... */]}// ❌ Wrong - Missing 'content/'{  name: 'post',  path: 'posts',  // Files won't be found  fields: [/* ... */]}// ❌ Wrong - Trailing slash{  name: 'post',  path: 'content/posts/',  // May cause issues  fields: [/* ... */]}
```
```
npx @tinacms/cli@latest audit
```
```
format
```
```
ERROR: Cannot find module '../tina/__generated__/client'ERROR: Property 'queries' does not exist on type '{}'
```
```
ERROR: Cannot find module '../tina/__generated__/client'ERROR: Property 'queries' does not exist on type '{}'
```
```
tinacms build
```
```
{  "scripts": {    "build": "tinacms build && next build"  // ✅ Tina FIRST    // NOT: "build": "next build && tinacms build"  // ❌ Wrong order  }}
```
```
{  "scripts": {    "build": "tinacms build && next build"  // ✅ Tina FIRST    // NOT: "build": "next build && tinacms build"  // ❌ Wrong order  }}
```
```
- name: Build  run: |    npx @tinacms/cli@latest build  # Generate types first    npm run build                   # Then build framework
```
```
- name: Build  run: |    npx @tinacms/cli@latest build  # Generate types first    npm run build                   # Then build framework
```
```
tinacms build
```
```
tina/__generated__/
```
```
Failed to load resource: net::ERR_CONNECTION_REFUSEDhttp://localhost:4001/...
```
```
Failed to load resource: net::ERR_CONNECTION_REFUSEDhttp://localhost:4001/...
```
```
admin/index.html
```
```
basePath
```
```
{  "scripts": {    "build": "tinacms build && next build"  // ✅ Always build    // NOT: "build": "tinacms dev"          // ❌ Never dev in production  }}
```
```
{  "scripts": {    "build": "tinacms build && next build"  // ✅ Always build    // NOT: "build": "tinacms dev"          // ❌ Never dev in production  }}
```
```
example.com/cms/admin
```
```
example.com/admin
```
```
basePath
```
```
/admin
```
```
// tina/config.tsexport default defineConfig({  build: {    outputFolder: 'admin',    publicFolder: 'public',    basePath: 'your-subdirectory'  // ← May have asset loading issues on sub-paths  }})
```
```
// tina/config.tsexport default defineConfig({  build: {    outputFolder: 'admin',    publicFolder: 'public',    basePath: 'your-subdirectory'  // ← May have asset loading issues on sub-paths  }})
```
```
# GitHub Actions / Vercel / Netlify- run: npx @tinacms/cli@latest build  # Always use build, not dev
```
```
# GitHub Actions / Vercel / Netlify- run: npx @tinacms/cli@latest build  # Always use build, not dev
```
```
// Instead of one huge "authors" collection// Split by active status or alphabetically{  name: 'active_author',  label: 'Active Authors',  path: 'content/authors/active',  fields: [/* ... */]}{  name: 'archived_author',  label: 'Archived Authors',  path: 'content/authors/archived',  fields: [/* ... */]}
```
```
// Instead of one huge "authors" collection// Split by active status or alphabetically{  name: 'active_author',  label: 'Active Authors',  path: 'content/authors/active',  fields: [/* ... */]}{  name: 'archived_author',  label: 'Archived Authors',  path: 'content/authors/archived',  fields: [/* ... */]}
```
```
// Instead of reference{  type: 'string',  name: 'authorId',  label: 'Author ID',  ui: {    component: 'select',    options: ['author-1', 'author-2', 'author-3']  // Curated list  }}
```
```
// Instead of reference{  type: 'string',  name: 'authorId',  label: 'Author ID',  ui: {    component: 'select',    options: ['author-1', 'author-2', 'author-3']  // Curated list  }}
```
```
Upload failedError uploading image
```
```
Upload failedError uploading image
```
```
NEXT_PUBLIC_TINA_CLIENT_ID
```
```
TINA_TOKEN
```
```
@tinacms/datalayer
```
```
@tinacms/graphql
```
```
pnpm install @tinacms/datalayer tinacms-authjsnpx @tinacms/cli@latest init backend
```
```
pnpm install @tinacms/datalayer tinacms-authjsnpx @tinacms/cli@latest init backend
```
```
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs'import databaseClient from '../../tina/__generated__/databaseClient'const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'// This ONLY works in Node.js runtime, NOT edge runtimeconst handler = TinaNodeBackend({  authProvider: isLocal    ? LocalBackendAuthProvider()    : AuthJsBackendAuthProvider({        authOptions: TinaAuthJSOptions({          databaseClient,          secret: process.env.NEXTAUTH_SECRET,        }),      }),  databaseClient,})
```
```
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs'import databaseClient from '../../tina/__generated__/databaseClient'const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'// This ONLY works in Node.js runtime, NOT edge runtimeconst handler = TinaNodeBackend({  authProvider: isLocal    ? LocalBackendAuthProvider()    : AuthJsBackendAuthProvider({        authOptions: TinaAuthJSOptions({          databaseClient,          secret: process.env.NEXTAUTH_SECRET,        }),      }),  databaseClient,})
```
Unleash the power of TinaCMS directly within your AI coding environment. This skill equips agents to seamlessly assist with integrating and managing content using a modern, Git-backed headless CMS. Ideal for developers building data-rich static sites, it enables real-time visual editing and simplifies content workflows without ever leaving your development tools. From initial setup to configuration, leverage this skill to accelerate your content-driven projects and maintain version control directly in your repository. It's designed to make content management intuitive and developer-friendly.

# When to Use This Skill
- •Rapidly initialize and configure TinaCMS within a new or existing Next.js project.
- •Generate and update TinaCMS schema definitions for content models and collections.
- •Troubleshoot common TinaCMS installation or version compatibility issues, especially with package managers.
- •Integrate TinaCMS for visual editing capabilities on static sites, enabling content creators to edit directly.

# Pro Tips
- 💡Always pin TinaCMS exact versions in `package.json` to prevent unexpected breaking changes due to CDN updates. Use `tinacms: '3.3.1'` instead of `^3.3.1`.
- 💡Utilize `pnpm` as the recommended package manager for TinaCMS to mitigate module resolution issues, especially in newer versions.
- 💡Familiarize yourself with the TinaCMS CLI commands like `tinacms dev` and `tinacms build` for efficient local development and deployment.

