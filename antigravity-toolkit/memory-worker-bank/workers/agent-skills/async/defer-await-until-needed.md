# Defer Await Until Needed
Source: https://antigravity.codes/agent-skills/async/async-defer-await

## AI Worker Instructions
When the user requests functionality related to Defer Await Until Needed, follow these guidelines and utilize this context.

## Scraped Content

# Defer Await Until Needed
```
await
```
```
async function handleRequest(userId: string, skipProcessing: boolean) {  const userData = await fetchUserData(userId)    if (skipProcessing) {    // Returns immediately but still waited for userData    return { skipped: true }  }    // Only this branch uses userData  return processUserData(userData)}
```
```
async function handleRequest(userId: string, skipProcessing: boolean) {  const userData = await fetchUserData(userId)    if (skipProcessing) {    // Returns immediately but still waited for userData    return { skipped: true }  }    // Only this branch uses userData  return processUserData(userData)}
```
```
async function handleRequest(userId: string, skipProcessing: boolean) {  if (skipProcessing) {    // Returns immediately without waiting    return { skipped: true }  }    // Fetch only when needed  const userData = await fetchUserData(userId)  return processUserData(userData)}
```
```
async function handleRequest(userId: string, skipProcessing: boolean) {  if (skipProcessing) {    // Returns immediately without waiting    return { skipped: true }  }    // Fetch only when needed  const userData = await fetchUserData(userId)  return processUserData(userData)}
```
```
// Incorrect: always fetches permissionsasync function updateResource(resourceId: string, userId: string) {  const permissions = await fetchPermissions(userId)  const resource = await getResource(resourceId)    if (!resource) {    return { error: 'Not found' }  }    if (!permissions.canEdit) {    return { error: 'Forbidden' }  }    return await updateResourceData(resource, permissions)}// Correct: fetches only when neededasync function updateResource(resourceId: string, userId: string) {  const resource = await getResource(resourceId)    if (!resource) {    return { error: 'Not found' }  }    const permissions = await fetchPermissions(userId)    if (!permissions.canEdit) {    return { error: 'Forbidden' }  }    return await updateResourceData(resource, permissions)}
```
```
// Incorrect: always fetches permissionsasync function updateResource(resourceId: string, userId: string) {  const permissions = await fetchPermissions(userId)  const resource = await getResource(resourceId)    if (!resource) {    return { error: 'Not found' }  }    if (!permissions.canEdit) {    return { error: 'Forbidden' }  }    return await updateResourceData(resource, permissions)}// Correct: fetches only when neededasync function updateResource(resourceId: string, userId: string) {  const resource = await getResource(resourceId)    if (!resource) {    return { error: 'Not found' }  }    const permissions = await fetchPermissions(userId)    if (!permissions.canEdit) {    return { error: 'Forbidden' }  }    return await updateResourceData(resource, permissions)}
```

