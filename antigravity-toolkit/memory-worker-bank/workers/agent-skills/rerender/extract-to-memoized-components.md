# Extract to Memoized Components
Source: https://antigravity.codes/agent-skills/rerender/rerender-memo

## AI Worker Instructions
When the user requests functionality related to Extract to Memoized Components, follow these guidelines and utilize this context.

## Scraped Content

# Extract to Memoized Components
```
function Profile({ user, loading }: Props) {  const avatar = useMemo(() => {    const id = computeAvatarId(user)    return <Avatar id={id} />  }, [user])  if (loading) return <Skeleton />  return <div>{avatar}</div>}
```
```
function Profile({ user, loading }: Props) {  const avatar = useMemo(() => {    const id = computeAvatarId(user)    return <Avatar id={id} />  }, [user])  if (loading) return <Skeleton />  return <div>{avatar}</div>}
```
```
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {  const id = useMemo(() => computeAvatarId(user), [user])  return <Avatar id={id} />})function Profile({ user, loading }: Props) {  if (loading) return <Skeleton />  return (    <div>      <UserAvatar user={user} />    </div>  )}
```
```
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {  const id = useMemo(() => computeAvatarId(user), [user])  return <Avatar id={id} />})function Profile({ user, loading }: Props) {  if (loading) return <Skeleton />  return (    <div>      <UserAvatar user={user} />    </div>  )}
```
```
memo()
```
```
useMemo()
```

