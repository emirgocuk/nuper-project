# Use SWR for Automatic Deduplication
Source: https://antigravity.codes/agent-skills/client/client-swr-dedup

## AI Worker Instructions
When the user requests functionality related to Use SWR for Automatic Deduplication, follow these guidelines and utilize this context.

## Scraped Content

# Use SWR for Automatic Deduplication
```
function UserList() {  const [users, setUsers] = useState([])  useEffect(() => {    fetch('/api/users')      .then(r => r.json())      .then(setUsers)  }, [])}
```
```
function UserList() {  const [users, setUsers] = useState([])  useEffect(() => {    fetch('/api/users')      .then(r => r.json())      .then(setUsers)  }, [])}
```
```
import useSWR from 'swr'function UserList() {  const { data: users } = useSWR('/api/users', fetcher)}
```
```
import useSWR from 'swr'function UserList() {  const { data: users } = useSWR('/api/users', fetcher)}
```
```
import { useImmutableSWR } from '@/lib/swr'function StaticContent() {  const { data } = useImmutableSWR('/api/config', fetcher)}
```
```
import { useImmutableSWR } from '@/lib/swr'function StaticContent() {  const { data } = useImmutableSWR('/api/config', fetcher)}
```
```
import { useSWRMutation } from 'swr/mutation'function UpdateButton() {  const { trigger } = useSWRMutation('/api/user', updateUser)  return <button onClick={() => trigger()}>Update</button>}
```
```
import { useSWRMutation } from 'swr/mutation'function UpdateButton() {  const { trigger } = useSWRMutation('/api/user', updateUser)  return <button onClick={() => trigger()}>Update</button>}
```

