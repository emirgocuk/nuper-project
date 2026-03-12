# Production Deployment Workflow
Source: https://antigravity.codes/rules/antigravity-workflows/production-deployment-workflow

## AI Worker Instructions
When the user requests functionality related to Production Deployment Workflow, follow these guidelines and utilize this context.

## Scraped Content

# Production Deployment Workflow
```
---description: Deploy application to production with safety checks---1. Verify we're on the main branch.2. Pull latest changes to ensure we're up to date.// turbo3. Run git pull origin main4. Run all tests to ensure code quality.// turbo5. Run npm test6. Build the production bundle.// turbo7. Run npm run build8. Verify build completed successfully (check for build errors).9. Ask user for final confirmation before deploying.10. Deploy to production.11. Run npm run deploy or platform-specific command12. Verify deployment succeeded by checking the live URL.13. Create a git tag for this release.// turbo14. Run git tag -a v[version] -m "Production release [version]"15. Push the tag to remote.// turbo16. Run git push origin v[version]
```
```
---description: Deploy application to production with safety checks---1. Verify we're on the main branch.2. Pull latest changes to ensure we're up to date.// turbo3. Run git pull origin main4. Run all tests to ensure code quality.// turbo5. Run npm test6. Build the production bundle.// turbo7. Run npm run build8. Verify build completed successfully (check for build errors).9. Ask user for final confirmation before deploying.10. Deploy to production.11. Run npm run deploy or platform-specific command12. Verify deployment succeeded by checking the live URL.13. Create a git tag for this release.// turbo14. Run git tag -a v[version] -m "Production release [version]"15. Push the tag to remote.// turbo16. Run git push origin v[version]
```
```
git pull origin main
```
```
npm test
```
```
npm run build
```
```
npm run deploy
```
```
git tag -a v[version] -m "Production release [version]"
```
```
git push origin v[version]
```

# Related Rules

# Antigravity Workflow Fundamentals

# Git Feature Branch Workflow

# React Component Scaffolding Workflow

# Recommended Workflows

# Setup Preview Deployments

# Implement Blue-Green Deployment

# Ultimate Next.js SEO Setup

# Recommended MCP Servers

# Infobip
MCP server for integrating [Infobip](https://www.infobip.com/) global cloud communication platform. It equips AI agents with communication superpowers, allowing them to send and receive SMS and RCS messages, interact with WhatsApp and Viber, automate communication workflows, and manage customer data, all in a production-ready environment.

# Context Templates
An open-source collection of reusable context templates designed to assist developers in structuring prompts, configurations, and workflows across various development tasks. Community contributions are encouraged to expand and refine available templates.

# DeployHQ
MCP server for DeployHQ API integration, enabling AI assistants to manage deployments, list projects, and monitor deployment status.

# Take It Further
Maximize your productivity with these powerful resources
Combine this rule with automated workflows for maximum efficiency and consistency.
Discover advanced techniques for creating custom rules and mastering Antigravity.

