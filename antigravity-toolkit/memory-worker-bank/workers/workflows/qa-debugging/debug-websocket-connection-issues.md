# Debug WebSocket Connection Issues
Source: https://antigravity.codes/workflows/qa-debugging/debug-websocket-connection-issues-reconnection

## AI Worker Instructions
When the user requests functionality related to Debug WebSocket Connection Issues, follow these guidelines and utilize this context.

## Scraped Content

# Debug WebSocket Connection Issues
```
'use client'   export function useWebSocket(url: string) {     const ws = useRef<WebSocket | null>(null);          useEffect(() => {       ws.current = new WebSocket(url);       ws.current.onclose = () => {         setTimeout(() => connect(), 1000);       };     }, [url]);   }
```
```
'use client'   export function useWebSocket(url: string) {     const ws = useRef<WebSocket | null>(null);          useEffect(() => {       ws.current = new WebSocket(url);       ws.current.onclose = () => {         setTimeout(() => connect(), 1000);       };     }, [url]);   }
```
```
wscat
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-websocket-connection-issues-reconnection.md
```
debug-websocket-connection-issues-reconnection.md
```
- In Antigravity, type /debug_websocket_connection_issues_reconnection or just describe what you want to do
```
/debug_websocket_connection_issues_reconnection
```
Learn more about workflows →

# Related Workflows

# Simulate Slow Network

# Debug API Issues with Network Tab

# React Performance Profiling

