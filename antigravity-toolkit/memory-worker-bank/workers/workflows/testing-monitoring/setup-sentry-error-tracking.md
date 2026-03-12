# Setup Sentry Error Tracking
Source: https://antigravity.codes/workflows/testing-monitoring/setup-sentry-error-tracking-monitoring

## AI Worker Instructions
When the user requests functionality related to Setup Sentry Error Tracking, follow these guidelines and utilize this context.

## Scraped Content

# Setup Sentry Error Tracking
```
npm install @sentry/nextjs
```
```
npx @sentry/wizard@latest -i nextjs
```
```
sentry.client.config.ts
```
```
sentry.server.config.ts
```
```
next.config.js
```
```
.env.local
```
```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx   SENTRY_AUTH_TOKEN=your-auth-token
```
```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx   SENTRY_AUTH_TOKEN=your-auth-token
```
```
// app/test-error/page.tsx   export default function TestError() {     return (       <button onClick={() => {         throw new Error('Sentry Test Error');       }}>         Trigger Error       </button>     );   }
```
```
// app/test-error/page.tsx   export default function TestError() {     return (       <button onClick={() => {         throw new Error('Sentry Test Error');       }}>         Trigger Error       </button>     );   }
```
```
import * as Sentry from '@sentry/nextjs';      Sentry.setUser({     id: user.id,     email: user.email,     username: user.name,   });
```
```
import * as Sentry from '@sentry/nextjs';      Sentry.setUser({     id: user.id,     email: user.email,     username: user.name,   });
```
```
Sentry.init({     tracesSampleRate: 0.1, // 10% of transactions   });
```
```
Sentry.init({     tracesSampleRate: 0.1, // 10% of transactions   });
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-sentry-error-tracking-monitoring.md
```
setup-sentry-error-tracking-monitoring.md
```
- In Antigravity, type /setup_sentry_error_tracking_monitoring or just describe what you want to do
```
/setup_sentry_error_tracking_monitoring
```
Learn more about workflows →

# Related Workflows

# Setup Storybook for Components

# Setup API Mocking with MSW

