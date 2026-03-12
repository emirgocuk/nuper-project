# Analyze Bundle Size
Source: https://antigravity.codes/workflows/devops/analyze-nextjs-bundle-size-optimization

## AI Worker Instructions
When the user requests functionality related to Analyze Bundle Size, follow these guidelines and utilize this context.

## Scraped Content

# Analyze Bundle Size
```
npm install @next/bundle-analyzer
```
```
const withBundleAnalyzer = require('@next/bundle-analyzer')({     enabled: process.env.ANALYZE === 'true',   })   module.exports = withBundleAnalyzer({     // Other config options   })
```
```
const withBundleAnalyzer = require('@next/bundle-analyzer')({     enabled: process.env.ANALYZE === 'true',   })   module.exports = withBundleAnalyzer({     // Other config options   })
```
```
ANALYZE=true npm run build
```
```
lodash
```
```
moment
```
```
import { x } from 'package'
```
```
import package from 'package'
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as analyze-nextjs-bundle-size-optimization.md
```
analyze-nextjs-bundle-size-optimization.md
```
- In Antigravity, type /analyze_nextjs_bundle_size_optimization or just describe what you want to do
```
/analyze_nextjs_bundle_size_optimization
```
Learn more about workflows →

# Related Workflows

# Setup Vercel Cron Jobs

# Database Migration Rollback

# Deploy to Vercel Preview

