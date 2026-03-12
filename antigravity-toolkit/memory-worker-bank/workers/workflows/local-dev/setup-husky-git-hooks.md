# Setup Husky Git Hooks
Source: https://antigravity.codes/workflows/local-dev/setup-husky-git-hooks-pre-commit-linting

## AI Worker Instructions
When the user requests functionality related to Setup Husky Git Hooks, follow these guidelines and utilize this context.

## Scraped Content

# Setup Husky Git Hooks
```
npm install --save-dev husky lint-staged
```
```
npx husky init
```
```
npx husky add .husky/pre-commit "npx lint-staged"
```
```
package.json
```
```
{     "lint-staged": {       "*.{ts,tsx}": [         "eslint --fix",         "prettier --write"       ],       "*.{json,md}": [         "prettier --write"       ]     }   }
```
```
{     "lint-staged": {       "*.{ts,tsx}": [         "eslint --fix",         "prettier --write"       ],       "*.{json,md}": [         "prettier --write"       ]     }   }
```
```
npx husky add .husky/pre-push "npm test"
```
```
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```
```
module.exports = { extends: ['@commitlint/config-conventional'] };
```
```
module.exports = { extends: ['@commitlint/config-conventional'] };
```
```
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```
```
git commit --no-verify
```
```
.husky/
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-husky-git-hooks-pre-commit-linting.md
```
setup-husky-git-hooks-pre-commit-linting.md
```
- In Antigravity, type /setup_husky_git_hooks_pre_commit_linting or just describe what you want to do
```
/setup_husky_git_hooks_pre_commit_linting
```
Learn more about workflows →

# Related Workflows

# Pre-Flight Check

# Create GitHub PR Template

# Fix Lint Errors

