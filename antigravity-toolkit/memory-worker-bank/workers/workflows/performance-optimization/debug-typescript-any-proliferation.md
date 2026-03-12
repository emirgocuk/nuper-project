# Debug TypeScript 'any' Proliferation
Source: https://antigravity.codes/workflows/performance-optimization/debug-typescript-implicit-any-type-safety

## AI Worker Instructions
When the user requests functionality related to Debug TypeScript 'any' Proliferation, follow these guidelines and utilize this context.

## Scraped Content

# Debug TypeScript 'any' Proliferation
```
tsconfig.json
```
```
{     "compilerOptions": {       "strict": true,       "noImplicitAny": true,       "strictNullChecks": true     }   }
```
```
{     "compilerOptions": {       "strict": true,       "noImplicitAny": true,       "strictNullChecks": true     }   }
```
```
// .eslintrc.json   {     "rules": {       "@typescript-eslint/no-explicit-any": "error"     }   }
```
```
// .eslintrc.json   {     "rules": {       "@typescript-eslint/no-explicit-any": "error"     }   }
```
```
// ❌ Bad     const handleClick = (e: any) => {};     // ✅ Good     const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
```
```
// ❌ Bad     const handleClick = (e: any) => {};     // ✅ Good     const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
```
```
// ❌ Bad     const data: any = await fetch('/api/user').then(r => r.json());     // ✅ Good     interface User { id: string; name: string; }     const data: User = await fetch('/api/user').then(r => r.json());
```
```
// ❌ Bad     const data: any = await fetch('/api/user').then(r => r.json());     // ✅ Good     interface User { id: string; name: string; }     const data: User = await fetch('/api/user').then(r => r.json());
```
```
// ❌ Bad     import someLib from 'some-lib'; // Module has no types     // ✅ Good     npm install --save-dev @types/some-lib
```
```
// ❌ Bad     import someLib from 'some-lib'; // Module has no types     // ✅ Good     npm install --save-dev @types/some-lib
```
```
function handleData(data: unknown) {     if (typeof data === 'string') {       console.log(data.toUpperCase()); // ✅ Type-safe     }   }
```
```
function handleData(data: unknown) {     if (typeof data === 'string') {       console.log(data.toUpperCase()); // ✅ Type-safe     }   }
```
```
noUncheckedIndexedAccess
```
```
as Type
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-typescript-implicit-any-type-safety.md
```
debug-typescript-implicit-any-type-safety.md
```
- In Antigravity, type /debug_typescript_implicit_any_type_safety or just describe what you want to do
```
/debug_typescript_implicit_any_type_safety
```
Learn more about workflows →

# Related Workflows

# Debug Webpack/Vite Build Issues

# Optimize Images for Web

# Setup Redis Caching

