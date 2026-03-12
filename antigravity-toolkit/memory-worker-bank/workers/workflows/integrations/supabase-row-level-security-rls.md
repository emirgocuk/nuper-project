# Supabase Row Level Security (RLS)
Source: https://antigravity.codes/workflows/integrations/configure-supabase-row-level-security-rls-policies

## AI Worker Instructions
When the user requests functionality related to Supabase Row Level Security (RLS), follow these guidelines and utilize this context.

## Scraped Content

# Supabase Row Level Security (RLS)
```
alter table profiles enable row level security;
```
```
alter table profiles enable row level security;
```
```
create policy "Users can view own profile"   on profiles for select   to authenticated   using ( auth.uid() = id );
```
```
create policy "Users can view own profile"   on profiles for select   to authenticated   using ( auth.uid() = id );
```
```
create policy "Users can update own profile"   on profiles for update   to authenticated   using ( auth.uid() = id );
```
```
create policy "Users can update own profile"   on profiles for update   to authenticated   using ( auth.uid() = id );
```
```
anon
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as configure-supabase-row-level-security-rls-policies.md
```
configure-supabase-row-level-security-rls-policies.md
```
- In Antigravity, type /configure_supabase_row_level_security_rls_policies or just describe what you want to do
```
/configure_supabase_row_level_security_rls_policies
```
Learn more about workflows →

# Related Workflows

# Setup Local Database (Postgres)

# Setup Supabase Realtime

# NextAuth.js (Auth.js) v5 Setup

