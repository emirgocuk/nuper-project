# Setup Vercel Cron Jobs
Source: https://antigravity.codes/workflows/devops/setup-vercel-cron-jobs-scheduled-tasks

## AI Worker Instructions
When the user requests functionality related to Setup Vercel Cron Jobs, follow these guidelines and utilize this context.

## Scraped Content

# Setup Vercel Cron Jobs
```
crons
```
```
vercel.json
```
```
{     "crons": [       {         "path": "/api/cron/daily-report",         "schedule": "0 10 * * *"       }     ]   }
```
```
{     "crons": [       {         "path": "/api/cron/daily-report",         "schedule": "0 10 * * *"       }     ]   }
```
```
src/app/api/cron/daily-report/route.ts
```
```
import { NextResponse } from 'next/server';      export async function GET(request: Request) {     // Verify the request is from Vercel Cron     const authHeader = request.headers.get('authorization');     if (authHeader !== Bearer ${process.env.CRON_SECRET}) {       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });     }          // Your cron job logic here     console.log('Daily report cron executed');          return NextResponse.json({ success: true });   }
```
```
import { NextResponse } from 'next/server';      export async function GET(request: Request) {     // Verify the request is from Vercel Cron     const authHeader = request.headers.get('authorization');     if (authHeader !== Bearer ${process.env.CRON_SECRET}) {       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });     }          // Your cron job logic here     console.log('Daily report cron executed');          return NextResponse.json({ success: true });   }
```
```
Bearer ${process.env.CRON_SECRET}
```
```
CRON_SECRET
```
```
.env.local
```
```
openssl rand -base64 32
```
```
Authorization: Bearer <token>
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-vercel-cron-jobs-scheduled-tasks.md
```
setup-vercel-cron-jobs-scheduled-tasks.md
```
- In Antigravity, type /setup_vercel_cron_jobs_scheduled_tasks or just describe what you want to do
```
/setup_vercel_cron_jobs_scheduled_tasks
```
Learn more about workflows →

# Related Workflows

# Deploy to Vercel Preview

# Setup Semantic Versioning

# Analyze Bundle Size

