# Debug Module Not Found Errors
Source: https://antigravity.codes/workflows/qa-debugging/debug-module-not-found-import-errors

## AI Worker Instructions
When the user requests functionality related to Debug Module Not Found Errors, follow these guidelines and utilize this context.

## Scraped Content

# Debug Module Not Found Errors
```
import { foo } from '../components/Foo'
```
```
import { foo } from '../components/Foo.tsx'
```
```
node_modules
```
```
ls node_modules/<package-name>
```
```
npm install <package-name>
```
```
import Foo from './foo'
```
```
Foo.tsx
```
```
import Foo from './Foo'
```
```
.next
```
```
node_modules/.cache
```
```
rm -rf .next node_modules/.cache && npm run dev
```
```
tsconfig.json
```
```
{     "compilerOptions": {       "baseUrl": ".",       "paths": {         "@/*": ["./src/*"]       }     }   }
```
```
{     "compilerOptions": {       "baseUrl": ".",       "paths": {         "@/*": ["./src/*"]       }     }   }
```
```
pnpm install
```
```
yarn install
```
```
@/
```
```
../../../../
```
```
npm ls <package-name>
```
```
react-router-dom
```
```
react-router
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-module-not-found-import-errors.md
```
debug-module-not-found-import-errors.md
```
- In Antigravity, type /debug_module_not_found_import_errors or just describe what you want to do
```
/debug_module_not_found_import_errors
```
Learn more about workflows →

# Related Workflows

# React Performance Profiling

# Simulate Slow Network

# Debug Memory Leaks in React

