# Debug Memory Leaks in React
Source: https://antigravity.codes/workflows/qa-debugging/debug-react-memory-leaks-heap-snapshots

## AI Worker Instructions
When the user requests functionality related to Debug Memory Leaks in React, follow these guidelines and utilize this context.

## Scraped Content

# Debug Memory Leaks in React
```
useEffect(() => {     const handler = () => console.log('resize');     window.addEventListener('resize', handler);     return () => window.removeEventListener('resize', handler); // ✅ Cleanup   }, []);
```
```
useEffect(() => {     const handler = () => console.log('resize');     window.addEventListener('resize', handler);     return () => window.removeEventListener('resize', handler); // ✅ Cleanup   }, []);
```
```
setInterval
```
```
useEffect(() => {     const id = setInterval(() => {}, 1000);     return () => clearInterval(id); // ✅ Cleanup   }, []);
```
```
useEffect(() => {     const id = setInterval(() => {}, 1000);     return () => clearInterval(id); // ✅ Cleanup   }, []);
```
```
useEffect
```
```
AbortController
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-react-memory-leaks-heap-snapshots.md
```
debug-react-memory-leaks-heap-snapshots.md
```
- In Antigravity, type /debug_react_memory_leaks_heap_snapshots or just describe what you want to do
```
/debug_react_memory_leaks_heap_snapshots
```
Learn more about workflows →

# Related Workflows

# React Performance Profiling

# Fix 'Too Many Re-renders' Error

# Debug Slow API Routes (Performance Profiling)

