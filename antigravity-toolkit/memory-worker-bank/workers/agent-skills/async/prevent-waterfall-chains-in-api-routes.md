# Prevent Waterfall Chains in API Routes
Source: https://antigravity.codes/agent-skills/async/async-api-routes

## AI Worker Instructions
When the user requests functionality related to Prevent Waterfall Chains in API Routes, follow these guidelines and utilize this context.

## Scraped Content

# Prevent Waterfall Chains in API Routes
```
export async function GET(request: Request) {  const session = await auth()  const config = await fetchConfig()  const data = await fetchData(session.user.id)  return Response.json({ data, config })}
```
```
export async function GET(request: Request) {  const session = await auth()  const config = await fetchConfig()  const data = await fetchData(session.user.id)  return Response.json({ data, config })}
```
```
export async function GET(request: Request) {  const sessionPromise = auth()  const configPromise = fetchConfig()  const session = await sessionPromise  const [config, data] = await Promise.all([    configPromise,    fetchData(session.user.id)  ])  return Response.json({ data, config })}
```
```
export async function GET(request: Request) {  const sessionPromise = auth()  const configPromise = fetchConfig()  const session = await sessionPromise  const [config, data] = await Promise.all([    configPromise,    fetchData(session.user.id)  ])  return Response.json({ data, config })}
```
```
better-all
```

