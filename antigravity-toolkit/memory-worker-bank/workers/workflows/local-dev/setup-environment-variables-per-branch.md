# Setup Environment Variables Per Branch
Source: https://antigravity.codes/workflows/local-dev/setup-environment-variables-per-branch-vercel

## AI Worker Instructions
When the user requests functionality related to Setup Environment Variables Per Branch, follow these guidelines and utilize this context.

## Scraped Content

# Setup Environment Variables Per Branch
```
.env.local
```
```
# .env.local   DATABASE_URL=postgresql://localhost:5432/mydb   API_URL=http://localhost:3001   NEXT_PUBLIC_APP_URL=http://localhost:3000
```
```
# .env.local   DATABASE_URL=postgresql://localhost:5432/mydb   API_URL=http://localhost:3001   NEXT_PUBLIC_APP_URL=http://localhost:3000
```
```
.env
```
```
# .env   NEXT_PUBLIC_APP_NAME=MyApp   NEXT_PUBLIC_MAX_UPLOAD_SIZE=5242880
```
```
# .env   NEXT_PUBLIC_APP_NAME=MyApp   NEXT_PUBLIC_MAX_UPLOAD_SIZE=5242880
```
```
main
```
```
VERCEL_ENV
```
```
const apiUrl = process.env.VERCEL_ENV === 'production'     ? 'https://api.myapp.com'     : 'https://staging-api.myapp.com';
```
```
const apiUrl = process.env.VERCEL_ENV === 'production'     ? 'https://api.myapp.com'     : 'https://staging-api.myapp.com';
```
```
# .github/workflows/test.yml   env:     DATABASE_URL: ${{ secrets.DATABASE_URL }}     API_KEY: ${{ secrets.API_KEY }}
```
```
# .github/workflows/test.yml   env:     DATABASE_URL: ${{ secrets.DATABASE_URL }}     API_KEY: ${{ secrets.API_KEY }}
```
```
NEXT_PUBLIC_
```
```
.env.example
```
```
vercel env pull .env.local
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-environment-variables-per-branch-vercel.md
```
setup-environment-variables-per-branch-vercel.md
```
- In Antigravity, type /setup_environment_variables_per_branch_vercel or just describe what you want to do
```
/setup_environment_variables_per_branch_vercel
```
Learn more about workflows →

# Related Workflows

# Kill Port 3000

# Generate .env from Example

# Pre-Flight Check

