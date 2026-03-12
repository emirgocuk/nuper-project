# Implement Feature Flags
Source: https://antigravity.codes/workflows/devops/implement-feature-flags-gradual-rollout

## AI Worker Instructions
When the user requests functionality related to Implement Feature Flags, follow these guidelines and utilize this context.

## Scraped Content

# Implement Feature Flags
```
// lib/features.ts   export const features = {     newDashboard: process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === 'true',     aiChat: process.env.NEXT_PUBLIC_FEATURE_AI_CHAT === 'true',   };
```
```
// lib/features.ts   export const features = {     newDashboard: process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === 'true',     aiChat: process.env.NEXT_PUBLIC_FEATURE_AI_CHAT === 'true',   };
```
```
import { features } from '@/lib/features';      export default function Dashboard() {     if (features.newDashboard) {       return <NewDashboard />;     }     return <OldDashboard />;   }
```
```
import { features } from '@/lib/features';      export default function Dashboard() {     if (features.newDashboard) {       return <NewDashboard />;     }     return <OldDashboard />;   }
```
```
npm install @vercel/edge-config
```
```
import { get } from '@vercel/edge-config';      export async function getFeatureFlags() {     const flags = await get('features');     return flags || {};   }
```
```
import { get } from '@vercel/edge-config';      export async function getFeatureFlags() {     const flags = await get('features');     return flags || {};   }
```
```
npm install launchdarkly-react-client-sdk
```
```
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk';      function MyComponent() {     const { newFeature } = useFlags();          if (newFeature) {       return <NewFeature />;     }     return <OldFeature />;   }
```
```
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk';      function MyComponent() {     const { newFeature } = useFlags();          if (newFeature) {       return <NewFeature />;     }     return <OldFeature />;   }
```
```
function isFeatureEnabled(userId: string, rolloutPercent: number) {     const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);     return (hash % 100) < rolloutPercent;   }      const showNewUI = isFeatureEnabled(user.id, 25); // 25% rollout
```
```
function isFeatureEnabled(userId: string, rolloutPercent: number) {     const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);     return (hash % 100) < rolloutPercent;   }      const showNewUI = isFeatureEnabled(user.id, 25); // 25% rollout
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as implement-feature-flags-gradual-rollout.md
```
implement-feature-flags-gradual-rollout.md
```
- In Antigravity, type /implement_feature_flags_gradual_rollout or just describe what you want to do
```
/implement_feature_flags_gradual_rollout
```
Learn more about workflows →

# Related Workflows

# Implement Blue-Green Deployment

# Setup Preview Deployments

# Deploy to Vercel Preview

