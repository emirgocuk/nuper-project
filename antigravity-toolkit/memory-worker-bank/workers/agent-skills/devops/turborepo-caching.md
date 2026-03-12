# turborepo-caching
Source: https://antigravity.codes/agent-skills/devops/turborepo-caching

## AI Worker Instructions
When the user requests functionality related to turborepo-caching, follow these guidelines and utilize this context.

## Scraped Content

# turborepo-caching
```
Workspace Root/├── apps/│   ├── web/│   │   └── package.json│   └── docs/│       └── package.json├── packages/│   ├── ui/│   │   └── package.json│   └── config/│       └── package.json├── turbo.json└── package.json
```
```
Workspace Root/├── apps/│   ├── web/│   │   └── package.json│   └── docs/│       └── package.json├── packages/│   ├── ui/│   │   └── package.json│   └── config/│       └── package.json├── turbo.json└── package.json
```
```
{  "$schema": "https://turbo.build/schema.json",  "globalDependencies": [".env", ".env.local"],  "globalEnv": ["NODE_ENV", "VERCEL_URL"],  "pipeline": {    "build": {      "dependsOn": ["^build"],      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],      "env": ["API_URL", "NEXT_PUBLIC_*"]    },    "test": {      "dependsOn": ["build"],      "outputs": ["coverage/**"],      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]    },    "lint": {      "outputs": [],      "cache": true    },    "typecheck": {      "dependsOn": ["^build"],      "outputs": []    },    "dev": {      "cache": false,      "persistent": true    },    "clean": {      "cache": false    }  }}
```
```
{  "$schema": "https://turbo.build/schema.json",  "globalDependencies": [".env", ".env.local"],  "globalEnv": ["NODE_ENV", "VERCEL_URL"],  "pipeline": {    "build": {      "dependsOn": ["^build"],      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],      "env": ["API_URL", "NEXT_PUBLIC_*"]    },    "test": {      "dependsOn": ["build"],      "outputs": ["coverage/**"],      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]    },    "lint": {      "outputs": [],      "cache": true    },    "typecheck": {      "dependsOn": ["^build"],      "outputs": []    },    "dev": {      "cache": false,      "persistent": true    },    "clean": {      "cache": false    }  }}
```
```
// apps/web/turbo.json{  "$schema": "https://turbo.build/schema.json",  "extends": ["//"],  "pipeline": {    "build": {      "outputs": [".next/**", "!.next/cache/**"],      "env": ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_ANALYTICS_ID"]    },    "test": {      "outputs": ["coverage/**"],      "inputs": ["src/**", "tests/**", "jest.config.js"]    }  }}
```
```
// apps/web/turbo.json{  "$schema": "https://turbo.build/schema.json",  "extends": ["//"],  "pipeline": {    "build": {      "outputs": [".next/**", "!.next/cache/**"],      "env": ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_ANALYTICS_ID"]    },    "test": {      "outputs": ["coverage/**"],      "inputs": ["src/**", "tests/**", "jest.config.js"]    }  }}
```
```
# Login to Vercelnpx turbo login# Link to Vercel projectnpx turbo link# Run with remote cacheturbo build --remote-only# CI environment variablesTURBO_TOKEN=your-tokenTURBO_TEAM=your-team
```
```
# Login to Vercelnpx turbo login# Link to Vercel projectnpx turbo link# Run with remote cacheturbo build --remote-only# CI environment variablesTURBO_TOKEN=your-tokenTURBO_TEAM=your-team
```
```
# .github/workflows/ci.ymlname: CIon:  push:    branches: [main]  pull_request:env:  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}  TURBO_TEAM: ${{ vars.TURBO_TEAM }}jobs:  build:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - uses: actions/setup-node@v4        with:          node-version: 20          cache: "npm"      - name: Install dependencies        run: npm ci      - name: Build        run: npx turbo build --filter='...[origin/main]'      - name: Test        run: npx turbo test --filter='...[origin/main]'
```
```
# .github/workflows/ci.ymlname: CIon:  push:    branches: [main]  pull_request:env:  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}  TURBO_TEAM: ${{ vars.TURBO_TEAM }}jobs:  build:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - uses: actions/setup-node@v4        with:          node-version: 20          cache: "npm"      - name: Install dependencies        run: npm ci      - name: Build        run: npx turbo build --filter='...[origin/main]'      - name: Test        run: npx turbo test --filter='...[origin/main]'
```
```
// Custom remote cache server (Express)import express from "express";import { createReadStream, createWriteStream } from "fs";import { mkdir } from "fs/promises";import { join } from "path";const app = express();const CACHE_DIR = "./cache";// Get artifactapp.get("/v8/artifacts/:hash", async (req, res) => {  const { hash } = req.params;  const team = req.query.teamId || "default";  const filePath = join(CACHE_DIR, team, hash);  try {    const stream = createReadStream(filePath);    stream.pipe(res);  } catch {    res.status(404).send("Not found");  }});// Put artifactapp.put("/v8/artifacts/:hash", async (req, res) => {  const { hash } = req.params;  const team = req.query.teamId || "default";  const dir = join(CACHE_DIR, team);  const filePath = join(dir, hash);  await mkdir(dir, { recursive: true });  const stream = createWriteStream(filePath);  req.pipe(stream);  stream.on("finish", () => {    res.json({      urls: [${req.protocol}://${req.get("host")}/v8/artifacts/${hash}],    });  });});// Check artifact existsapp.head("/v8/artifacts/:hash", async (req, res) => {  const { hash } = req.params;  const team = req.query.teamId || "default";  const filePath = join(CACHE_DIR, team, hash);  try {    await fs.access(filePath);    res.status(200).end();  } catch {    res.status(404).end();  }});app.listen(3000);
```
```
// Custom remote cache server (Express)import express from "express";import { createReadStream, createWriteStream } from "fs";import { mkdir } from "fs/promises";import { join } from "path";const app = express();const CACHE_DIR = "./cache";// Get artifactapp.get("/v8/artifacts/:hash", async (req, res) => {  const { hash } = req.params;  const team = req.query.teamId || "default";  const filePath = join(CACHE_DIR, team, hash);  try {    const stream = createReadStream(filePath);    stream.pipe(res);  } catch {    res.status(404).send("Not found");  }});// Put artifactapp.put("/v8/artifacts/:hash", async (req, res) => {  const { hash } = req.params;  const team = req.query.teamId || "default";  const dir = join(CACHE_DIR, team);  const filePath = join(dir, hash);  await mkdir(dir, { recursive: true });  const stream = createWriteStream(filePath);  req.pipe(stream);  stream.on("finish", () => {    res.json({      urls: [${req.protocol}://${req.get("host")}/v8/artifacts/${hash}],    });  });});// Check artifact existsapp.head("/v8/artifacts/:hash", async (req, res) => {  const { hash } = req.params;  const team = req.query.teamId || "default";  const filePath = join(CACHE_DIR, team, hash);  try {    await fs.access(filePath);    res.status(200).end();  } catch {    res.status(404).end();  }});app.listen(3000);
```
```
${req.protocol}://${req.get("host")}/v8/artifacts/${hash}
```
```
// turbo.json for self-hosted cache{  "remoteCache": {    "signature": false  }}
```
```
// turbo.json for self-hosted cache{  "remoteCache": {    "signature": false  }}
```
```
# Use self-hosted cacheturbo build --api="http://localhost:3000" --token="my-token" --team="my-team"
```
```
# Use self-hosted cacheturbo build --api="http://localhost:3000" --token="my-token" --team="my-team"
```
```
# Build specific packageturbo build --filter=@myorg/web# Build package and its dependenciesturbo build --filter=@myorg/web...# Build package and its dependentsturbo build --filter=...@myorg/ui# Build changed packages since mainturbo build --filter='...[origin/main]'# Build packages in directoryturbo build --filter='./apps/*'# Combine filtersturbo build --filter=@myorg/web --filter=@myorg/docs# Exclude packageturbo build --filter='!@myorg/docs'# Include dependencies of changedturbo build --filter='...[HEAD^1]...'
```
```
# Build specific packageturbo build --filter=@myorg/web# Build package and its dependenciesturbo build --filter=@myorg/web...# Build package and its dependentsturbo build --filter=...@myorg/ui# Build changed packages since mainturbo build --filter='...[origin/main]'# Build packages in directoryturbo build --filter='./apps/*'# Combine filtersturbo build --filter=@myorg/web --filter=@myorg/docs# Exclude packageturbo build --filter='!@myorg/docs'# Include dependencies of changedturbo build --filter='...[HEAD^1]...'
```
```
{  "$schema": "https://turbo.build/schema.json",  "pipeline": {    "build": {      "dependsOn": ["^build"],      "outputs": ["dist/**"],      "inputs": ["$TURBO_DEFAULT$", "!**/*.md", "!**/*.test.*"]    },    "test": {      "dependsOn": ["^build"],      "outputs": ["coverage/**"],      "inputs": ["src/**", "tests/**", "*.config.*"],      "env": ["CI", "NODE_ENV"]    },    "test:e2e": {      "dependsOn": ["build"],      "outputs": [],      "cache": false    },    "deploy": {      "dependsOn": ["build", "test", "lint"],      "outputs": [],      "cache": false    },    "db:generate": {      "cache": false    },    "db:push": {      "cache": false,      "dependsOn": ["db:generate"]    },    "@myorg/web#build": {      "dependsOn": ["^build", "@myorg/db#db:generate"],      "outputs": [".next/**"],      "env": ["NEXT_PUBLIC_*"]    }  }}
```
```
{  "$schema": "https://turbo.build/schema.json",  "pipeline": {    "build": {      "dependsOn": ["^build"],      "outputs": ["dist/**"],      "inputs": ["$TURBO_DEFAULT$", "!**/*.md", "!**/*.test.*"]    },    "test": {      "dependsOn": ["^build"],      "outputs": ["coverage/**"],      "inputs": ["src/**", "tests/**", "*.config.*"],      "env": ["CI", "NODE_ENV"]    },    "test:e2e": {      "dependsOn": ["build"],      "outputs": [],      "cache": false    },    "deploy": {      "dependsOn": ["build", "test", "lint"],      "outputs": [],      "cache": false    },    "db:generate": {      "cache": false    },    "db:push": {      "cache": false,      "dependsOn": ["db:generate"]    },    "@myorg/web#build": {      "dependsOn": ["^build", "@myorg/db#db:generate"],      "outputs": [".next/**"],      "env": ["NEXT_PUBLIC_*"]    }  }}
```
```
{  "name": "my-turborepo",  "private": true,  "workspaces": ["apps/*", "packages/*"],  "scripts": {    "build": "turbo build",    "dev": "turbo dev",    "lint": "turbo lint",    "test": "turbo test",    "clean": "turbo clean && rm -rf node_modules",    "format": "prettier --write \"**/*.{ts,tsx,md}\"",    "changeset": "changeset",    "version-packages": "changeset version",    "release": "turbo build --filter=./packages/* && changeset publish"  },  "devDependencies": {    "turbo": "^1.10.0",    "prettier": "^3.0.0",    "@changesets/cli": "^2.26.0"  },  "packageManager": "npm@10.0.0"}
```
```
{  "name": "my-turborepo",  "private": true,  "workspaces": ["apps/*", "packages/*"],  "scripts": {    "build": "turbo build",    "dev": "turbo dev",    "lint": "turbo lint",    "test": "turbo test",    "clean": "turbo clean && rm -rf node_modules",    "format": "prettier --write \"**/*.{ts,tsx,md}\"",    "changeset": "changeset",    "version-packages": "changeset version",    "release": "turbo build --filter=./packages/* && changeset publish"  },  "devDependencies": {    "turbo": "^1.10.0",    "prettier": "^3.0.0",    "@changesets/cli": "^2.26.0"  },  "packageManager": "npm@10.0.0"}
```
```
# Dry run to see what would runturbo build --dry-run# Verbose output with hashesturbo build --verbosity=2# Show task graphturbo build --graph# Force no cacheturbo build --force# Show cache statusturbo build --summarize# Debug specific taskTURBO_LOG_VERBOSITY=debug turbo build --filter=@myorg/web
```
```
# Dry run to see what would runturbo build --dry-run# Verbose output with hashesturbo build --verbosity=2# Show task graphturbo build --graph# Force no cacheturbo build --force# Show cache statusturbo build --summarize# Debug specific taskTURBO_LOG_VERBOSITY=debug turbo build --filter=@myorg/web
```
```
"@myorg/ui": "workspace:*"
```
```
persistent: true
```
This skill empowers AI agents to expertly configure and optimize Turborepo for enhanced monorepo performance. It delves into the nuances of local and remote caching strategies, crucial for accelerating build times and streamlining CI/CD pipelines. By leveraging this expertise, developers can ensure their projects benefit from intelligent task orchestration, efficient dependency management, and robust cache utilization. The skill provides clear guidance on `turbo.json` configurations, pipeline definitions, and debugging common caching challenges, transforming slow builds into fast, reliable processes. Unlock peak monorepo efficiency and maintain rapid development cycles with this essential Turborepo caching knowledge.

# When to Use This Skill
- •Optimizing CI/CD build times for large monorepos with shared dependencies.
- •Setting up distributed caching across development teams to avoid redundant builds.
- •Debugging persistent cache misses in Turborepo pipelines to identify root causes.
- •Migrating an existing monorepo to Turborepo, ensuring efficient caching is implemented from the start.

# Pro Tips
- 💡Prioritize `outputs` carefully: Be explicit and minimal with `outputs` in `turbo.json`. Caching too many unnecessary files can lead to larger cache sizes and slower restore times, while missing critical outputs causes unnecessary re-builds. Focus on actual build artifacts.
- 💡Leverage `globalDependencies` & `globalEnv`: Don't forget to include global files (like `.env.*`) or environment variables (e.g., `NODE_ENV`) that impact *all* tasks' cache keys. This prevents unexpected cache misses when these global factors change.
- 💡Implement a robust remote cache: For team environments or CI/CD, always set up a remote cache (e.g., Vercel Remote Cache, S3, GCS) to share cache artifacts across machines, drastically reducing build times for subsequent runs and improving consistency.

