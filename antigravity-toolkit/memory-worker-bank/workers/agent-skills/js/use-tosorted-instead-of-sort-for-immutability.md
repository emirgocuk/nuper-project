# Use toSorted() Instead of sort() for Immutability
Source: https://antigravity.codes/agent-skills/js/js-tosorted-immutable

## AI Worker Instructions
When the user requests functionality related to Use toSorted() Instead of sort() for Immutability, follow these guidelines and utilize this context.

## Scraped Content

# Use toSorted() Instead of sort() for Immutability
```
.sort()
```
```
.toSorted()
```
```
function UserList({ users }: { users: User[] }) {  // Mutates the users prop array!  const sorted = useMemo(    () => users.sort((a, b) => a.name.localeCompare(b.name)),    [users]  )  return <div>{sorted.map(renderUser)}</div>}
```
```
function UserList({ users }: { users: User[] }) {  // Mutates the users prop array!  const sorted = useMemo(    () => users.sort((a, b) => a.name.localeCompare(b.name)),    [users]  )  return <div>{sorted.map(renderUser)}</div>}
```
```
function UserList({ users }: { users: User[] }) {  // Creates new sorted array, original unchanged  const sorted = useMemo(    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),    [users]  )  return <div>{sorted.map(renderUser)}</div>}
```
```
function UserList({ users }: { users: User[] }) {  // Creates new sorted array, original unchanged  const sorted = useMemo(    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),    [users]  )  return <div>{sorted.map(renderUser)}</div>}
```
```
.toSorted()
```
```
// Fallback for older browsersconst sorted = [...items].sort((a, b) => a.value - b.value)
```
```
// Fallback for older browsersconst sorted = [...items].sort((a, b) => a.value - b.value)
```
```
.toSorted()
```
```
.toReversed()
```
```
.toSpliced()
```
```
.with()
```

