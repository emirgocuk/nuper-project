# Setup Preview Deployments
Source: https://antigravity.codes/workflows/devops/setup-github-actions-preview-deployments

## AI Worker Instructions
When the user requests functionality related to Setup Preview Deployments, follow these guidelines and utilize this context.

## Scraped Content

# Setup Preview Deployments
```
name: Preview   on:     pull_request:       types: [opened, synchronize]   jobs:     deploy:       runs-on: ubuntu-latest       steps:         - uses: actions/checkout@v4         - uses: actions/setup-node@v4         - run: npm ci         - run: npm run build         - uses: amondnet/vercel-action@v25
```
```
name: Preview   on:     pull_request:       types: [opened, synchronize]   jobs:     deploy:       runs-on: ubuntu-latest       steps:         - uses: actions/checkout@v4         - uses: actions/setup-node@v4         - run: npm ci         - run: npm run build         - uses: amondnet/vercel-action@v25
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-github-actions-preview-deployments.md
```
setup-github-actions-preview-deployments.md
```
- In Antigravity, type /setup_github_actions_preview_deployments or just describe what you want to do
```
/setup_github_actions_preview_deployments
```
Learn more about workflows →

# Related Workflows

# Deploy to Vercel Preview

# Implement Blue-Green Deployment

# Implement Feature Flags

