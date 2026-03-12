# VS Code Settings Sync
Source: https://antigravity.codes/workflows/local-dev/sync-vscode-settings-extensions-team-consistency

## AI Worker Instructions
When the user requests functionality related to VS Code Settings Sync, follow these guidelines and utilize this context.

## Scraped Content

# VS Code Settings Sync
```
.vscode/settings.json
```
```
mkdir -p .vscode && printf '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "editor.codeActionsOnSave": {\n    "source.fixAll.eslint": true\n  }\n}' > .vscode/settings.json
```
```
printf '{\n  "recommendations": [\n    "dbaeumer.vscode-eslint",\n    "esbenp.prettier-vscode",\n    "bradlc.vscode-tailwindcss"\n  ]\n}' > .vscode/extensions.json
```
```
.vscode
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as sync-vscode-settings-extensions-team-consistency.md
```
sync-vscode-settings-extensions-team-consistency.md
```
- In Antigravity, type /sync_vscode_settings_extensions_team_consistency or just describe what you want to do
```
/sync_vscode_settings_extensions_team_consistency
```
Learn more about workflows →

# Related Workflows

# Generate .env from Example

# Generate TypeScript Types from API

# Kill Port 3000

