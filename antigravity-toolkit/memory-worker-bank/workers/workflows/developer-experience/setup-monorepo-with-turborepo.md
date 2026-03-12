# Setup Monorepo with Turborepo
Source: https://antigravity.codes/workflows/developer-experience/setup-turborepo-monorepo-build-system

## AI Worker Instructions
When the user requests functionality related to Setup Monorepo with Turborepo, follow these guidelines and utilize this context.

## Scraped Content

# Setup Monorepo with Turborepo
```
npx create-turbo@latest
```
```
npm install turbo --save-dev
```
```
{     "$schema": "https://turbo.build/schema.json",     "pipeline": {       "build": {         "dependsOn": ["^build"],         "outputs": [".next/**", "dist/**"]       },       "dev": {         "cache": false,         "persistent": true       },       "lint": {         "dependsOn": ["^lint"]       }     }   }
```
```
{     "$schema": "https://turbo.build/schema.json",     "pipeline": {       "build": {         "dependsOn": ["^build"],         "outputs": [".next/**", "dist/**"]       },       "dev": {         "cache": false,         "persistent": true       },       "lint": {         "dependsOn": ["^lint"]       }     }   }
```
```
npx turbo login
```
```
npx turbo link
```
```
turbo run build
```
```
turbo run build --filter=web
```
```
# GitHub Actions   - run: npx turbo run build --filter=[HEAD^1]
```
```
# GitHub Actions   - run: npx turbo run build --filter=[HEAD^1]
```
```
--force
```
```
apps/
```
```
packages/
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-turborepo-monorepo-build-system.md
```
setup-turborepo-monorepo-build-system.md
```
- In Antigravity, type /setup_turborepo_monorepo_build_system or just describe what you want to do
```
/setup_turborepo_monorepo_build_system
```
Learn more about workflows →

# Related Workflows

# Setup VS Code Multi-Root Workspace

# Debug 'Module Not Found' After Git Pull

# Migrate from Pages Router to App Router

