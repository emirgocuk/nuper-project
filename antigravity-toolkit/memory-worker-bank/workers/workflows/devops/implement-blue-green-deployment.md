# Implement Blue-Green Deployment
Source: https://antigravity.codes/workflows/devops/implement-blue-green-deployment-strategy

## AI Worker Instructions
When the user requests functionality related to Implement Blue-Green Deployment, follow these guidelines and utilize this context.

## Scraped Content

# Implement Blue-Green Deployment
```
const rolloutPercent = await get('green_rollout') || 0;   if (Math.random() * 100 < rolloutPercent) {     return NextResponse.rewrite(new URL('/green', request.url));   }
```
```
const rolloutPercent = await get('green_rollout') || 0;   if (Math.random() * 100 < rolloutPercent) {     return NextResponse.rewrite(new URL('/green', request.url));   }
```
```
Sentry.setTag('environment', isGreen ? 'green' : 'blue');
```
```
Sentry.setTag('environment', isGreen ? 'green' : 'blue');
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as implement-blue-green-deployment-strategy.md
```
implement-blue-green-deployment-strategy.md
```
- In Antigravity, type /implement_blue_green_deployment_strategy or just describe what you want to do
```
/implement_blue_green_deployment_strategy
```
Learn more about workflows →

# Related Workflows

# Implement Feature Flags

# Setup Preview Deployments

# Deploy to Vercel Preview

