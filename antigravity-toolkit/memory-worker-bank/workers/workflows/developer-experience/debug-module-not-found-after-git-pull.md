# Debug 'Module Not Found' After Git Pull
Source: https://antigravity.codes/workflows/developer-experience/debug-module-not-found-after-git-pull

## AI Worker Instructions
When the user requests functionality related to Debug 'Module Not Found' After Git Pull, follow these guidelines and utilize this context.

## Scraped Content

# Debug 'Module Not Found' After Git Pull
```
rm -rf node_modules .next && npm install
```
```
git diff package-lock.json
```
```
rm package-lock.json && npm install
```
```
npm install --legacy-peer-deps
```
```
pnpm install --force
```
```
npx tsc --noEmit
```
```
npm ci
```
```
npm install
```
```
.npmrc
```
```
.yarnrc
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-module-not-found-after-git-pull.md
```
debug-module-not-found-after-git-pull.md
```
- In Antigravity, type /debug_module_not_found_after_git_pull or just describe what you want to do
```
/debug_module_not_found_after_git_pull
```
Learn more about workflows →

# Related Workflows

# Bisecting a Bug

# Debug 'Cannot Find Module' TypeScript Errors

# Undo a "Bad" Public Push

