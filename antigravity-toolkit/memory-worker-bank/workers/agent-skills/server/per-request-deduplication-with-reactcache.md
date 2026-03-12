# Per-Request Deduplication with React.cache()
Source: https://antigravity.codes/agent-skills/server/server-cache-react

## AI Worker Instructions
When the user requests functionality related to Per-Request Deduplication with React.cache(), follow these guidelines and utilize this context.

## Scraped Content

# Per-Request Deduplication with React.cache()
```
React.cache()
```
```
import { cache } from 'react'export const getCurrentUser = cache(async () => {  const session = await auth()  if (!session?.user?.id) return null  return await db.user.findUnique({    where: { id: session.user.id }  })})
```
```
import { cache } from 'react'export const getCurrentUser = cache(async () => {  const session = await auth()  if (!session?.user?.id) return null  return await db.user.findUnique({    where: { id: session.user.id }  })})
```
```
getCurrentUser()
```

