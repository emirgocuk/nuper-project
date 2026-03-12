# Database Migration Rollback
Source: https://antigravity.codes/workflows/devops/rollback-prisma-database-migration-emergency

## AI Worker Instructions
When the user requests functionality related to Database Migration Rollback, follow these guidelines and utilize this context.

## Scraped Content

# Database Migration Rollback
```
npx prisma migrate status
```
```
npx prisma migrate resolve --rolled-back "migration_name"
```
```
psql -d mydb -f ./migrations/down.sql
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as rollback-prisma-database-migration-emergency.md
```
rollback-prisma-database-migration-emergency.md
```
- In Antigravity, type /rollback_prisma_database_migration_emergency or just describe what you want to do
```
/rollback_prisma_database_migration_emergency
```
Learn more about workflows →

# Related Workflows

# Setup Database Seeding

# Analyze Bundle Size

# Setup Vercel Cron Jobs

