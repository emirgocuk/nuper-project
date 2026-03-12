# Implement Optimistic UI Updates
Source: https://antigravity.codes/workflows/performance-optimization/implement-optimistic-ui-updates-react-query

## AI Worker Instructions
When the user requests functionality related to Implement Optimistic UI Updates, follow these guidelines and utilize this context.

## Scraped Content

# Implement Optimistic UI Updates
```
npm install @tanstack/react-query
```
```
const addTodo = useMutation({     mutationFn: (text) => fetch('/api/todos', { method: 'POST', body: JSON.stringify({ text }) }),     onMutate: async (newTodo) => {       await queryClient.cancelQueries({ queryKey: ['todos'] });       const previous = queryClient.getQueryData(['todos']);       queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);       return { previous };     },     onError: (err, newTodo, context) => {       queryClient.setQueryData(['todos'], context.previous);     },   });
```
```
const addTodo = useMutation({     mutationFn: (text) => fetch('/api/todos', { method: 'POST', body: JSON.stringify({ text }) }),     onMutate: async (newTodo) => {       await queryClient.cancelQueries({ queryKey: ['todos'] });       const previous = queryClient.getQueryData(['todos']);       queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);       return { previous };     },     onError: (err, newTodo, context) => {       queryClient.setQueryData(['todos'], context.previous);     },   });
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as implement-optimistic-ui-updates-react-query.md
```
implement-optimistic-ui-updates-react-query.md
```
- In Antigravity, type /implement_optimistic_ui_updates_react_query or just describe what you want to do
```
/implement_optimistic_ui_updates_react_query
```
Learn more about workflows →

# Related Workflows

# Optimize Images for Web

# Setup Redis Caching

# Implement Request Deduplication

