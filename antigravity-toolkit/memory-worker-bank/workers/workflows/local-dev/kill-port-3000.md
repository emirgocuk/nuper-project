# Kill Port 3000
Source: https://antigravity.codes/workflows/local-dev/kill-process-on-port-3000-terminal-command

## AI Worker Instructions
When the user requests functionality related to Kill Port 3000, follow these guidelines and utilize this context.

## Scraped Content

# Kill Port 3000
```
npx kill-port 3000
```
```
lsof -ti:3000
```
```
kill -9 $(lsof -ti:3000)
```
```
netstat -ano | findstr :3000
```
```
taskkill /PID <PID> /F
```
```
alias kill3000="npx kill-port 3000"
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as kill-process-on-port-3000-terminal-command.md
```
kill-process-on-port-3000-terminal-command.md
```
- In Antigravity, type /kill_process_on_port_3000_terminal_command or just describe what you want to do
```
/kill_process_on_port_3000_terminal_command
```
Learn more about workflows →

# Related Workflows

# Setup Environment Variables Per Branch

# Generate .env from Example

# Prune Docker System

