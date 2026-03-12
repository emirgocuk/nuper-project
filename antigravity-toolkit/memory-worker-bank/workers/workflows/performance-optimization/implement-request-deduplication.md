# Implement Request Deduplication
Source: https://antigravity.codes/workflows/performance-optimization/implement-request-deduplication-react-query

## AI Worker Instructions
When the user requests functionality related to Implement Request Deduplication, follow these guidelines and utilize this context.

## Scraped Content

# Implement Request Deduplication
```
fetch
```
```
GET
```
```
cache: 'force-cache'
```
```
fetch('https://...', { cache: 'force-cache' }); // Cached forever   fetch('https://...', { next: { revalidate: 3600 } }); // Cached for 1 hour
```
```
fetch('https://...', { cache: 'force-cache' }); // Cached forever   fetch('https://...', { next: { revalidate: 3600 } }); // Cached for 1 hour
```
```
npm install @tanstack/react-query
```
```
const { data } = useQuery({     queryKey: ['user', id],     queryFn: () => fetch(/api/user/${id}).then(r => r.json()),     staleTime: 60 * 1000, // Deduplicates requests for 1 minute   });
```
```
const { data } = useQuery({     queryKey: ['user', id],     queryFn: () => fetch(/api/user/${id}).then(r => r.json()),     staleTime: 60 * 1000, // Deduplicates requests for 1 minute   });
```
```
/api/user/${id}
```
```
cache
```
```
import { cache } from 'react';      export const getUser = cache(async (id) => {     return db.user.findUnique({ where: { id } });   });   // Calling getUser(1) multiple times in one request only hits DB once.
```
```
import { cache } from 'react';      export const getUser = cache(async (id) => {     return db.user.findUnique({ where: { id } });   });   // Calling getUser(1) multiple times in one request only hits DB once.
```
```
react.cache
```
```
fetch
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as implement-request-deduplication-react-query.md
```
implement-request-deduplication-react-query.md
```
- In Antigravity, type /implement_request_deduplication_react_query or just describe what you want to do
```
/implement_request_deduplication_react_query
```
Learn more about workflows →

# Related Workflows

# Optimize Images for Web

# Reduce Bundle Size

# Setup Redis Caching

