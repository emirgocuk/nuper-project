# Generate TypeScript Types from API
Source: https://antigravity.codes/workflows/local-dev/generate-typescript-types-from-openapi-schema

## AI Worker Instructions
When the user requests functionality related to Generate TypeScript Types from API, follow these guidelines and utilize this context.

## Scraped Content

# Generate TypeScript Types from API
```
/swagger.json
```
```
/openapi.json
```
```
npm install --save-dev openapi-typescript
```
```
npx openapi-typescript https://api.example.com/openapi.json -o src/types/api.ts
```
```
import type { paths } from './types/api';      type UserResponse = paths['/users']['get']['responses']['200']['content']['application/json'];      async function getUsers(): Promise<UserResponse> {     const res = await fetch('/api/users');     return res.json();   }
```
```
import type { paths } from './types/api';      type UserResponse = paths['/users']['get']['responses']['200']['content']['application/json'];      async function getUsers(): Promise<UserResponse> {     const res = await fetch('/api/users');     return res.json();   }
```
```
{     "scripts": {       "generate:types": "openapi-typescript https://api.example.com/openapi.json -o src/types/api.ts"     }   }
```
```
{     "scripts": {       "generate:types": "openapi-typescript https://api.example.com/openapi.json -o src/types/api.ts"     }   }
```
```
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
```
```
npm run generate:types
```
```
openapi-fetch
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as generate-typescript-types-from-openapi-schema.md
```
generate-typescript-types-from-openapi-schema.md
```
- In Antigravity, type /generate_typescript_types_from_openapi_schema or just describe what you want to do
```
/generate_typescript_types_from_openapi_schema
```
Learn more about workflows →

# Related Workflows

# VS Code Settings Sync

# Kill Port 3000

# Generate .env from Example

