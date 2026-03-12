# Setup Semantic Versioning
Source: https://antigravity.codes/workflows/devops/setup-semantic-versioning-automated-releases

## AI Worker Instructions
When the user requests functionality related to Setup Semantic Versioning, follow these guidelines and utilize this context.

## Scraped Content

# Setup Semantic Versioning
```
npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git
```
```
# Format: <type>(<scope>): <description>   feat: add dark mode support   fix: resolve hydration error   docs: update README   chore: upgrade dependencies
```
```
# Format: <type>(<scope>): <description>   feat: add dark mode support   fix: resolve hydration error   docs: update README   chore: upgrade dependencies
```
```
.releaserc.json
```
```
{     "branches": ["main"],     "plugins": [       "@semantic-release/commit-analyzer",       "@semantic-release/release-notes-generator",       "@semantic-release/changelog",       "@semantic-release/npm",       "@semantic-release/github",       ["@semantic-release/git", {         "assets": ["CHANGELOG.md", "package.json"],         "message": "chore(release): ${nextRelease.version} [skip ci]"       }]     ]   }
```
```
{     "branches": ["main"],     "plugins": [       "@semantic-release/commit-analyzer",       "@semantic-release/release-notes-generator",       "@semantic-release/changelog",       "@semantic-release/npm",       "@semantic-release/github",       ["@semantic-release/git", {         "assets": ["CHANGELOG.md", "package.json"],         "message": "chore(release): ${nextRelease.version} [skip ci]"       }]     ]   }
```
```
# .github/workflows/release.yml   name: Release   on:     push:       branches: [main]   jobs:     release:       runs-on: ubuntu-latest       steps:         - uses: actions/checkout@v3         - uses: actions/setup-node@v3         - run: npm ci         - run: npx semantic-release           env:             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
```
# .github/workflows/release.yml   name: Release   on:     push:       branches: [main]   jobs:     release:       runs-on: ubuntu-latest       steps:         - uses: actions/checkout@v3         - uses: actions/setup-node@v3         - run: npm ci         - run: npx semantic-release           env:             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
```
git commit -m "feat: add user authentication"   # Will bump MINOR version (0.1.0 -> 0.2.0)      git commit -m "fix: resolve login bug"   # Will bump PATCH version (0.2.0 -> 0.2.1)      git commit -m "feat!: redesign API\n\nBREAKING CHANGE: API endpoints changed"   # Will bump MAJOR version (0.2.1 -> 1.0.0)
```
```
git commit -m "feat: add user authentication"   # Will bump MINOR version (0.1.0 -> 0.2.0)      git commit -m "fix: resolve login bug"   # Will bump PATCH version (0.2.0 -> 0.2.1)      git commit -m "feat!: redesign API\n\nBREAKING CHANGE: API endpoints changed"   # Will bump MAJOR version (0.2.1 -> 1.0.0)
```
```
npx cz
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-semantic-versioning-automated-releases.md
```
setup-semantic-versioning-automated-releases.md
```
- In Antigravity, type /setup_semantic_versioning_automated_releases or just describe what you want to do
```
/setup_semantic_versioning_automated_releases
```
Learn more about workflows →

# Related Workflows

# Setup Vercel Cron Jobs

# Analyze Bundle Size

# Database Migration Rollback

