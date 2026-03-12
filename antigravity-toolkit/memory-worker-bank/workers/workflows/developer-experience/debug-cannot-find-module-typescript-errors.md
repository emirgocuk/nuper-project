# Debug 'Cannot Find Module' TypeScript Errors
Source: https://antigravity.codes/workflows/developer-experience/debug-typescript-cannot-find-module-errors

## AI Worker Instructions
When the user requests functionality related to Debug 'Cannot Find Module' TypeScript Errors, follow these guidelines and utilize this context.

## Scraped Content

# Debug 'Cannot Find Module' TypeScript Errors
```
{     "compilerOptions": {       "baseUrl": ".",       "paths": {         "@/*": ["./src/*"],         "@/components/*": ["./src/components/*"]       }     }   }
```
```
{     "compilerOptions": {       "baseUrl": ".",       "paths": {         "@/*": ["./src/*"],         "@/components/*": ["./src/components/*"]       }     }   }
```
```
// ❌ Wrong   import { Button } from '@/Components/Button';   // ✅ Correct (case-sensitive)   import { Button } from '@/components/Button';
```
```
// ❌ Wrong   import { Button } from '@/Components/Button';   // ✅ Correct (case-sensitive)   import { Button } from '@/components/Button';
```
```
npm install --save-dev @types/node @types/react
```
```
{     "exclude": ["node_modules", "**/*.spec.ts"]   }
```
```
{     "exclude": ["node_modules", "**/*.spec.ts"]   }
```
```
rm -rf .next tsconfig.tsbuildinfo
```
```
moduleResolution: "bundler"
```
```
package.json
```
```
skipLibCheck
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-typescript-cannot-find-module-errors.md
```
debug-typescript-cannot-find-module-errors.md
```
- In Antigravity, type /debug_typescript_cannot_find_module_errors or just describe what you want to do
```
/debug_typescript_cannot_find_module_errors
```
Learn more about workflows →

# Related Workflows

# Debug 'Module Not Found' After Git Pull

# Setup VS Code Multi-Root Workspace

# Bisecting a Bug

