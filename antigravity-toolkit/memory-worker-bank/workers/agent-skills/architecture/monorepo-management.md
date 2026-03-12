# monorepo-management
Source: https://antigravity.codes/agent-skills/architecture/monorepo-management

## AI Worker Instructions
When the user requests functionality related to monorepo-management, follow these guidelines and utilize this context.

## Scraped Content

# monorepo-management
```
# Create new monoreponpx create-turbo@latest my-monorepocd my-monorepo# Structure:# apps/#   web/          - Next.js app#   docs/         - Documentation site# packages/#   ui/           - Shared UI components#   config/       - Shared configurations#   tsconfig/     - Shared TypeScript configs# turbo.json      - Turborepo configuration# package.json    - Root package.json
```
```
# Create new monoreponpx create-turbo@latest my-monorepocd my-monorepo# Structure:# apps/#   web/          - Next.js app#   docs/         - Documentation site# packages/#   ui/           - Shared UI components#   config/       - Shared configurations#   tsconfig/     - Shared TypeScript configs# turbo.json      - Turborepo configuration# package.json    - Root package.json
```
```
// turbo.json{  "$schema": "https://turbo.build/schema.json",  "globalDependencies": ["**/.env.*local"],  "pipeline": {    "build": {      "dependsOn": ["^build"],      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]    },    "test": {      "dependsOn": ["build"],      "outputs": ["coverage/**"]    },    "lint": {      "outputs": []    },    "dev": {      "cache": false,      "persistent": true    },    "type-check": {      "dependsOn": ["^build"],      "outputs": []    }  }}
```
```
// turbo.json{  "$schema": "https://turbo.build/schema.json",  "globalDependencies": ["**/.env.*local"],  "pipeline": {    "build": {      "dependsOn": ["^build"],      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]    },    "test": {      "dependsOn": ["build"],      "outputs": ["coverage/**"]    },    "lint": {      "outputs": []    },    "dev": {      "cache": false,      "persistent": true    },    "type-check": {      "dependsOn": ["^build"],      "outputs": []    }  }}
```
```
// package.json (root){  "name": "my-monorepo",  "private": true,  "workspaces": ["apps/*", "packages/*"],  "scripts": {    "build": "turbo run build",    "dev": "turbo run dev",    "test": "turbo run test",    "lint": "turbo run lint",    "format": "prettier --write \"**/*.{ts,tsx,md}\"",    "clean": "turbo run clean && rm -rf node_modules"  },  "devDependencies": {    "turbo": "^1.10.0",    "prettier": "^3.0.0",    "typescript": "^5.0.0"  },  "packageManager": "pnpm@8.0.0"}
```
```
// package.json (root){  "name": "my-monorepo",  "private": true,  "workspaces": ["apps/*", "packages/*"],  "scripts": {    "build": "turbo run build",    "dev": "turbo run dev",    "test": "turbo run test",    "lint": "turbo run lint",    "format": "prettier --write \"**/*.{ts,tsx,md}\"",    "clean": "turbo run clean && rm -rf node_modules"  },  "devDependencies": {    "turbo": "^1.10.0",    "prettier": "^3.0.0",    "typescript": "^5.0.0"  },  "packageManager": "pnpm@8.0.0"}
```
```
// packages/ui/package.json{  "name": "@repo/ui",  "version": "0.0.0",  "private": true,  "main": "./dist/index.js",  "types": "./dist/index.d.ts",  "exports": {    ".": {      "import": "./dist/index.js",      "types": "./dist/index.d.ts"    },    "./button": {      "import": "./dist/button.js",      "types": "./dist/button.d.ts"    }  },  "scripts": {    "build": "tsup src/index.ts --format esm,cjs --dts",    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",    "lint": "eslint src/",    "type-check": "tsc --noEmit"  },  "devDependencies": {    "@repo/tsconfig": "workspace:*",    "tsup": "^7.0.0",    "typescript": "^5.0.0"  },  "dependencies": {    "react": "^18.2.0"  }}
```
```
// packages/ui/package.json{  "name": "@repo/ui",  "version": "0.0.0",  "private": true,  "main": "./dist/index.js",  "types": "./dist/index.d.ts",  "exports": {    ".": {      "import": "./dist/index.js",      "types": "./dist/index.d.ts"    },    "./button": {      "import": "./dist/button.js",      "types": "./dist/button.d.ts"    }  },  "scripts": {    "build": "tsup src/index.ts --format esm,cjs --dts",    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",    "lint": "eslint src/",    "type-check": "tsc --noEmit"  },  "devDependencies": {    "@repo/tsconfig": "workspace:*",    "tsup": "^7.0.0",    "typescript": "^5.0.0"  },  "dependencies": {    "react": "^18.2.0"  }}
```
```
# pnpm-workspace.yamlpackages:  - "apps/*"  - "packages/*"  - "tools/*"
```
```
# pnpm-workspace.yamlpackages:  - "apps/*"  - "packages/*"  - "tools/*"
```
```
// .npmrc# Hoist shared dependenciesshamefully-hoist=true# Strict peer dependenciesauto-install-peers=truestrict-peer-dependencies=true# Performancestore-dir=~/.pnpm-store
```
```
// .npmrc# Hoist shared dependenciesshamefully-hoist=true# Strict peer dependenciesauto-install-peers=truestrict-peer-dependencies=true# Performancestore-dir=~/.pnpm-store
```
```
# Install dependency in specific packagepnpm add react --filter @repo/uipnpm add -D typescript --filter @repo/ui# Install workspace dependencypnpm add @repo/ui --filter web# Install in all packagespnpm add -D eslint -w# Update all dependenciespnpm update -r# Remove dependencypnpm remove react --filter @repo/ui
```
```
# Install dependency in specific packagepnpm add react --filter @repo/uipnpm add -D typescript --filter @repo/ui# Install workspace dependencypnpm add @repo/ui --filter web# Install in all packagespnpm add -D eslint -w# Update all dependenciespnpm update -r# Remove dependencypnpm remove react --filter @repo/ui
```
```
# Run script in specific packagepnpm --filter web devpnpm --filter @repo/ui build# Run in all packagespnpm -r buildpnpm -r test# Run in parallelpnpm -r --parallel dev# Filter by patternpnpm --filter "@repo/*" buildpnpm --filter "...web" build  # Build web and dependencies
```
```
# Run script in specific packagepnpm --filter web devpnpm --filter @repo/ui build# Run in all packagespnpm -r buildpnpm -r test# Run in parallelpnpm -r --parallel dev# Filter by patternpnpm --filter "@repo/*" buildpnpm --filter "...web" build  # Build web and dependencies
```
```
# Create Nx monoreponpx create-nx-workspace@latest my-org# Generate applicationsnx generate @nx/react:app my-appnx generate @nx/next:app my-next-app# Generate librariesnx generate @nx/react:lib ui-componentsnx generate @nx/js:lib utils
```
```
# Create Nx monoreponpx create-nx-workspace@latest my-org# Generate applicationsnx generate @nx/react:app my-appnx generate @nx/next:app my-next-app# Generate librariesnx generate @nx/react:lib ui-componentsnx generate @nx/js:lib utils
```
```
// nx.json{  "extends": "nx/presets/npm.json",  "$schema": "./node_modules/nx/schemas/nx-schema.json",  "targetDefaults": {    "build": {      "dependsOn": ["^build"],      "inputs": ["production", "^production"],      "cache": true    },    "test": {      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],      "cache": true    },    "lint": {      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],      "cache": true    }  },  "namedInputs": {    "default": ["{projectRoot}/**/*", "sharedGlobals"],    "production": [      "default",      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",      "!{projectRoot}/tsconfig.spec.json"    ],    "sharedGlobals": []  }}
```
```
// nx.json{  "extends": "nx/presets/npm.json",  "$schema": "./node_modules/nx/schemas/nx-schema.json",  "targetDefaults": {    "build": {      "dependsOn": ["^build"],      "inputs": ["production", "^production"],      "cache": true    },    "test": {      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],      "cache": true    },    "lint": {      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],      "cache": true    }  },  "namedInputs": {    "default": ["{projectRoot}/**/*", "sharedGlobals"],    "production": [      "default",      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",      "!{projectRoot}/tsconfig.spec.json"    ],    "sharedGlobals": []  }}
```
```
# Run task for specific projectnx build my-appnx test ui-componentsnx lint utils# Run for affected projectsnx affected:buildnx affected:test --base=main# Visualize dependenciesnx graph# Run in parallelnx run-many --target=build --all --parallel=3
```
```
# Run task for specific projectnx build my-appnx test ui-componentsnx lint utils# Run for affected projectsnx affected:buildnx affected:test --base=main# Visualize dependenciesnx graph# Run in parallelnx run-many --target=build --all --parallel=3
```
```
// packages/tsconfig/base.json{  "compilerOptions": {    "strict": true,    "esModuleInterop": true,    "skipLibCheck": true,    "forceConsistentCasingInFileNames": true,    "module": "ESNext",    "moduleResolution": "bundler",    "resolveJsonModule": true,    "isolatedModules": true,    "incremental": true,    "declaration": true  },  "exclude": ["node_modules"]}// packages/tsconfig/react.json{  "extends": "./base.json",  "compilerOptions": {    "jsx": "react-jsx",    "lib": ["ES2022", "DOM", "DOM.Iterable"]  }}// apps/web/tsconfig.json{  "extends": "@repo/tsconfig/react.json",  "compilerOptions": {    "outDir": "dist",    "rootDir": "src"  },  "include": ["src"],  "exclude": ["node_modules", "dist"]}
```
```
// packages/tsconfig/base.json{  "compilerOptions": {    "strict": true,    "esModuleInterop": true,    "skipLibCheck": true,    "forceConsistentCasingInFileNames": true,    "module": "ESNext",    "moduleResolution": "bundler",    "resolveJsonModule": true,    "isolatedModules": true,    "incremental": true,    "declaration": true  },  "exclude": ["node_modules"]}// packages/tsconfig/react.json{  "extends": "./base.json",  "compilerOptions": {    "jsx": "react-jsx",    "lib": ["ES2022", "DOM", "DOM.Iterable"]  }}// apps/web/tsconfig.json{  "extends": "@repo/tsconfig/react.json",  "compilerOptions": {    "outDir": "dist",    "rootDir": "src"  },  "include": ["src"],  "exclude": ["node_modules", "dist"]}
```
```
// packages/config/eslint-preset.jsmodule.exports = {  extends: [    "eslint:recommended",    "plugin:@typescript-eslint/recommended",    "plugin:react/recommended",    "plugin:react-hooks/recommended",    "prettier",  ],  plugins: ["@typescript-eslint", "react", "react-hooks"],  parser: "@typescript-eslint/parser",  parserOptions: {    ecmaVersion: 2022,    sourceType: "module",    ecmaFeatures: {      jsx: true,    },  },  settings: {    react: {      version: "detect",    },  },  rules: {    "@typescript-eslint/no-unused-vars": "error",    "react/react-in-jsx-scope": "off",  },};// apps/web/.eslintrc.jsmodule.exports = {  extends: ["@repo/config/eslint-preset"],  rules: {    // App-specific rules  },};
```
```
// packages/config/eslint-preset.jsmodule.exports = {  extends: [    "eslint:recommended",    "plugin:@typescript-eslint/recommended",    "plugin:react/recommended",    "plugin:react-hooks/recommended",    "prettier",  ],  plugins: ["@typescript-eslint", "react", "react-hooks"],  parser: "@typescript-eslint/parser",  parserOptions: {    ecmaVersion: 2022,    sourceType: "module",    ecmaFeatures: {      jsx: true,    },  },  settings: {    react: {      version: "detect",    },  },  rules: {    "@typescript-eslint/no-unused-vars": "error",    "react/react-in-jsx-scope": "off",  },};// apps/web/.eslintrc.jsmodule.exports = {  extends: ["@repo/config/eslint-preset"],  rules: {    // App-specific rules  },};
```
```
// packages/ui/src/button.tsximport * as React from 'react';export interface ButtonProps {  variant?: 'primary' | 'secondary';  children: React.ReactNode;  onClick?: () => void;}export function Button({ variant = 'primary', children, onClick }: ButtonProps) {  return (    <button      className={btn btn-${variant}}      onClick={onClick}    >      {children}    </button>  );}// packages/ui/src/index.tsexport { Button, type ButtonProps } from './button';export { Input, type InputProps } from './input';// apps/web/src/app.tsximport { Button } from '@repo/ui';export function App() {  return <Button variant="primary">Click me</Button>;}
```
```
// packages/ui/src/button.tsximport * as React from 'react';export interface ButtonProps {  variant?: 'primary' | 'secondary';  children: React.ReactNode;  onClick?: () => void;}export function Button({ variant = 'primary', children, onClick }: ButtonProps) {  return (    <button      className={btn btn-${variant}}      onClick={onClick}    >      {children}    </button>  );}// packages/ui/src/index.tsexport { Button, type ButtonProps } from './button';export { Input, type InputProps } from './input';// apps/web/src/app.tsximport { Button } from '@repo/ui';export function App() {  return <Button variant="primary">Click me</Button>;}
```
```
btn btn-${variant}
```
```
// packages/utils/src/string.tsexport function capitalize(str: string): string {  return str.charAt(0).toUpperCase() + str.slice(1);}export function truncate(str: string, length: number): string {  return str.length > length ? str.slice(0, length) + "..." : str;}// packages/utils/src/index.tsexport * from "./string";export * from "./array";export * from "./date";// Usage in appsimport { capitalize, truncate } from "@repo/utils";
```
```
// packages/utils/src/string.tsexport function capitalize(str: string): string {  return str.charAt(0).toUpperCase() + str.slice(1);}export function truncate(str: string, length: number): string {  return str.length > length ? str.slice(0, length) + "..." : str;}// packages/utils/src/index.tsexport * from "./string";export * from "./array";export * from "./date";// Usage in appsimport { capitalize, truncate } from "@repo/utils";
```
```
// packages/types/src/user.tsexport interface User {  id: string;  email: string;  name: string;  role: "admin" | "user";}export interface CreateUserInput {  email: string;  name: string;  password: string;}// Used in both frontend and backendimport type { User, CreateUserInput } from "@repo/types";
```
```
// packages/types/src/user.tsexport interface User {  id: string;  email: string;  name: string;  role: "admin" | "user";}export interface CreateUserInput {  email: string;  name: string;  password: string;}// Used in both frontend and backendimport type { User, CreateUserInput } from "@repo/types";
```
```
// turbo.json{  "pipeline": {    "build": {      // Build depends on dependencies being built first      "dependsOn": ["^build"],      // Cache these outputs      "outputs": ["dist/**", ".next/**"],      // Cache based on these inputs (default: all files)      "inputs": ["src/**/*.tsx", "src/**/*.ts", "package.json"]    },    "test": {      // Run tests in parallel, don't depend on build      "cache": true,      "outputs": ["coverage/**"]    }  }}
```
```
// turbo.json{  "pipeline": {    "build": {      // Build depends on dependencies being built first      "dependsOn": ["^build"],      // Cache these outputs      "outputs": ["dist/**", ".next/**"],      // Cache based on these inputs (default: all files)      "inputs": ["src/**/*.tsx", "src/**/*.ts", "package.json"]    },    "test": {      // Run tests in parallel, don't depend on build      "cache": true,      "outputs": ["coverage/**"]    }  }}
```
```
# Turborepo Remote Cache (Vercel)npx turbo loginnpx turbo link# Custom remote cache# turbo.json{  "remoteCache": {    "signature": true,    "enabled": true  }}
```
```
# Turborepo Remote Cache (Vercel)npx turbo loginnpx turbo link# Custom remote cache# turbo.json{  "remoteCache": {    "signature": true,    "enabled": true  }}
```
```
# .github/workflows/ci.ymlname: CIon:  push:    branches: [main]  pull_request:    branches: [main]jobs:  build:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3        with:          fetch-depth: 0 # For Nx affected commands      - uses: pnpm/action-setup@v2        with:          version: 8      - uses: actions/setup-node@v3        with:          node-version: 18          cache: "pnpm"      - name: Install dependencies        run: pnpm install --frozen-lockfile      - name: Build        run: pnpm turbo run build      - name: Test        run: pnpm turbo run test      - name: Lint        run: pnpm turbo run lint      - name: Type check        run: pnpm turbo run type-check
```
```
# .github/workflows/ci.ymlname: CIon:  push:    branches: [main]  pull_request:    branches: [main]jobs:  build:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3        with:          fetch-depth: 0 # For Nx affected commands      - uses: pnpm/action-setup@v2        with:          version: 8      - uses: actions/setup-node@v3        with:          node-version: 18          cache: "pnpm"      - name: Install dependencies        run: pnpm install --frozen-lockfile      - name: Build        run: pnpm turbo run build      - name: Test        run: pnpm turbo run test      - name: Lint        run: pnpm turbo run lint      - name: Type check        run: pnpm turbo run type-check
```
```
# Deploy only changed apps- name: Deploy affected apps  run: |    if pnpm nx affected:apps --base=origin/main --head=HEAD | grep -q "web"; then      echo "Deploying web app"      pnpm --filter web deploy    fi
```
```
# Deploy only changed apps- name: Deploy affected apps  run: |    if pnpm nx affected:apps --base=origin/main --head=HEAD | grep -q "web"; then      echo "Deploying web app"      pnpm --filter web deploy    fi
```
```
# Using Changesetspnpm add -Dw @changesets/clipnpm changeset init# Create changesetpnpm changeset# Version packagespnpm changeset version# Publishpnpm changeset publish
```
```
# Using Changesetspnpm add -Dw @changesets/clipnpm changeset init# Create changesetpnpm changeset# Version packagespnpm changeset version# Publishpnpm changeset publish
```
```
# .github/workflows/release.yml- name: Create Release Pull Request or Publish  uses: changesets/action@v1  with:    publish: pnpm release  env:    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
```
# .github/workflows/release.yml- name: Create Release Pull Request or Publish  uses: changesets/action@v1  with:    publish: pnpm release  env:    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
In modern software development, managing complex projects efficiently is paramount. The Monorepo Management Agent Skill empowers you to architect and maintain sophisticated multi-package repositories using leading tools like Turborepo, Nx, and pnpm workspaces. This skill streamlines your development workflow by fostering code sharing, consistent tooling, and optimized build performance across all your applications and libraries. Whether you're initiating a new project or migrating an existing one, mastering monorepo strategies is crucial for scalability, simplified dependency handling, and improved developer experience. Unlock the full potential of your codebase with intelligent monorepo design.

# When to Use This Skill
- •Setting up new monorepo projects from scratch or templates.
- •Optimizing build and test performance in a large, multi-package codebase.
- •Managing shared dependencies and utility packages across many applications.
- •Implementing efficient CI/CD pipelines specifically designed for monorepo structures.

# Pro Tips
- 💡Always start with pnpm workspaces for superior dependency hoisting, disk space efficiency, and faster installations compared to npm or Yarn.
- 💡Leverage Turborepo's remote caching and task orchestration to significantly speed up local and CI/CD builds, especially in large monorepos with many interdependent tasks.
- 💡Define clear boundaries and explicit `tsconfig.json` references between packages to enforce proper module isolation and prevent unwanted circular dependencies.

