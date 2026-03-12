# Minimize Serialization at RSC Boundaries
Source: https://antigravity.codes/agent-skills/server/server-serialization

## AI Worker Instructions
When the user requests functionality related to Minimize Serialization at RSC Boundaries, follow these guidelines and utilize this context.

## Scraped Content

# Minimize Serialization at RSC Boundaries
```
async function Page() {  const user = await fetchUser()  // 50 fields  return <Profile user={user} />}'use client'function Profile({ user }: { user: User }) {  return <div>{user.name}</div>  // uses 1 field}
```
```
async function Page() {  const user = await fetchUser()  // 50 fields  return <Profile user={user} />}'use client'function Profile({ user }: { user: User }) {  return <div>{user.name}</div>  // uses 1 field}
```
```
async function Page() {  const user = await fetchUser()  return <Profile name={user.name} />}'use client'function Profile({ name }: { name: string }) {  return <div>{name}</div>}
```
```
async function Page() {  const user = await fetchUser()  return <Profile name={user.name} />}'use client'function Profile({ name }: { name: string }) {  return <div>{name}</div>}
```

