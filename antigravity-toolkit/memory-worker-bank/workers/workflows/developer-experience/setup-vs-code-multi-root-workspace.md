# Setup VS Code Multi-Root Workspace
Source: https://antigravity.codes/workflows/developer-experience/setup-vscode-multi-root-workspace-monorepo

## AI Worker Instructions
When the user requests functionality related to Setup VS Code Multi-Root Workspace, follow these guidelines and utilize this context.

## Scraped Content

# Setup VS Code Multi-Root Workspace
```
my-project.code-workspace
```
```
{     "folders": [       { "path": "packages/web", "name": "Web App" },       { "path": "packages/api", "name": "API" },       { "path": "packages/shared", "name": "Shared" }     ],     "settings": {       "typescript.tsdk": "node_modules/typescript/lib",       "eslint.workingDirectories": [         { "mode": "auto" }       ]     }   }
```
```
{     "folders": [       { "path": "packages/web", "name": "Web App" },       { "path": "packages/api", "name": "API" },       { "path": "packages/shared", "name": "Shared" }     ],     "settings": {       "typescript.tsdk": "node_modules/typescript/lib",       "eslint.workingDirectories": [         { "mode": "auto" }       ]     }   }
```
```
.code-workspace
```
```
.vscode/settings.json
```
```
{     "editor.formatOnSave": true,     "typescript.tsdk": "../../node_modules/typescript/lib"   }
```
```
{     "editor.formatOnSave": true,     "typescript.tsdk": "../../node_modules/typescript/lib"   }
```
```
.vscode/launch.json
```
```
{     "compounds": [       {         "name": "Full Stack",         "configurations": ["Web", "API"]       }     ],     "configurations": [       {         "name": "Web",         "type": "node",         "request": "launch",         "runtimeExecutable": "npm",         "runtimeArgs": ["run", "dev"],         "cwd": "${workspaceFolder:Web App}"       }     ]   }
```
```
{     "compounds": [       {         "name": "Full Stack",         "configurations": ["Web", "API"]       }     ],     "configurations": [       {         "name": "Web",         "type": "node",         "request": "launch",         "runtimeExecutable": "npm",         "runtimeArgs": ["run", "dev"],         "cwd": "${workspaceFolder:Web App}"       }     ]   }
```
```
${workspaceFolder:name}
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-vscode-multi-root-workspace-monorepo.md
```
setup-vscode-multi-root-workspace-monorepo.md
```
- In Antigravity, type /setup_vscode_multi_root_workspace_monorepo or just describe what you want to do
```
/setup_vscode_multi_root_workspace_monorepo
```
Learn more about workflows →

# Related Workflows

# Setup Monorepo with Turborepo

# Debug 'Cannot Find Module' TypeScript Errors

# Debug 'Module Not Found' After Git Pull

