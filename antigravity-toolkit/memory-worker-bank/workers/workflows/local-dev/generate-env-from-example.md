# Generate .env from Example
Source: https://antigravity.codes/workflows/local-dev/generate-local-env-file-from-example

## AI Worker Instructions
When the user requests functionality related to Generate .env from Example, follow these guidelines and utilize this context.

## Scraped Content

# Generate .env from Example
```
test -f .env.example && echo "✅ Found .env.example" || echo "❌ .env.example not found"
```
```
cp -n .env.example .env.local || echo ".env.local already exists"
```
```
.env.local
```
```
YOUR_API_KEY_HERE
```
```
abc123...
```
```
.env.local
```
```
.gitignore
```
```
.env.example
```
```
git secret
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as generate-local-env-file-from-example.md
```
generate-local-env-file-from-example.md
```
- In Antigravity, type /generate_local_env_file_from_example or just describe what you want to do
```
/generate_local_env_file_from_example
```
Learn more about workflows →

# Related Workflows

# Setup Environment Variables Per Branch

# Setup Prettier & ESLint from Scratch

# VS Code Settings Sync

