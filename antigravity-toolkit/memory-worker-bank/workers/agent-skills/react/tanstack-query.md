# tanstack-query
Source: https://antigravity.codes/agent-skills/react/tanstack-query

## AI Worker Instructions
When the user requests functionality related to tanstack-query, follow these guidelines and utilize this context.

## Scraped Content

# tanstack-query
```
import { useMutationState } from '@tanstack/react-query'function GlobalLoadingIndicator() {  // Get all pending mutations  const pendingMutations = useMutationState({    filters: { status: 'pending' },    select: (mutation) => mutation.state.variables,  })  if (pendingMutations.length === 0) return null  return <div>Saving {pendingMutations.length} items...</div>}// Filter by mutation keyconst todoMutations = useMutationState({  filters: { mutationKey: ['addTodo'] },})
```
```
import { useMutationState } from '@tanstack/react-query'function GlobalLoadingIndicator() {  // Get all pending mutations  const pendingMutations = useMutationState({    filters: { status: 'pending' },    select: (mutation) => mutation.state.variables,  })  if (pendingMutations.length === 0) return null  return <div>Saving {pendingMutations.length} items...</div>}// Filter by mutation keyconst todoMutations = useMutationState({  filters: { mutationKey: ['addTodo'] },})
```
```
variables
```
```
function TodoList() {  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })  const addTodo = useMutation({    mutationKey: ['addTodo'],    mutationFn: (newTodo) => api.addTodo(newTodo),    onSuccess: () => {      queryClient.invalidateQueries({ queryKey: ['todos'] })    },  })  // Show optimistic UI using variables from pending mutations  const pendingTodos = useMutationState({    filters: { mutationKey: ['addTodo'], status: 'pending' },    select: (mutation) => mutation.state.variables,  })  return (    <ul>      {todos?.map(todo => <li key={todo.id}>{todo.title}</li>)}      {/* Show pending items with visual indicator */}      {pendingTodos.map((todo, i) => (        <li key={pending-${i}} style={{ opacity: 0.5 }}>{todo.title}</li>      ))}    </ul>  )}
```
```
function TodoList() {  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })  const addTodo = useMutation({    mutationKey: ['addTodo'],    mutationFn: (newTodo) => api.addTodo(newTodo),    onSuccess: () => {      queryClient.invalidateQueries({ queryKey: ['todos'] })    },  })  // Show optimistic UI using variables from pending mutations  const pendingTodos = useMutationState({    filters: { mutationKey: ['addTodo'], status: 'pending' },    select: (mutation) => mutation.state.variables,  })  return (    <ul>      {todos?.map(todo => <li key={todo.id}>{todo.title}</li>)}      {/* Show pending items with visual indicator */}      {pendingTodos.map((todo, i) => (        <li key={pending-${i}} style={{ opacity: 0.5 }}>{todo.title}</li>      ))}    </ul>  )}
```
```
pending-${i}
```
```
useErrorBoundary
```
```
import { QueryErrorResetBoundary } from '@tanstack/react-query'import { ErrorBoundary } from 'react-error-boundary'function App() {  return (    <QueryErrorResetBoundary>      {({ reset }) => (        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => (          <div>            Error! <button onClick={resetErrorBoundary}>Retry</button>          </div>        )}>          <Todos />        </ErrorBoundary>      )}    </QueryErrorResetBoundary>  )}function Todos() {  const { data } = useQuery({    queryKey: ['todos'],    queryFn: fetchTodos,    throwOnError: true, // ✅ v5 (was useErrorBoundary in v4)  })  return <div>{data.map(...)}</div>}
```
```
import { QueryErrorResetBoundary } from '@tanstack/react-query'import { ErrorBoundary } from 'react-error-boundary'function App() {  return (    <QueryErrorResetBoundary>      {({ reset }) => (        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => (          <div>            Error! <button onClick={resetErrorBoundary}>Retry</button>          </div>        )}>          <Todos />        </ErrorBoundary>      )}    </QueryErrorResetBoundary>  )}function Todos() {  const { data } = useQuery({    queryKey: ['todos'],    queryFn: fetchTodos,    throwOnError: true, // ✅ v5 (was useErrorBoundary in v4)  })  return <div>{data.map(...)}</div>}
```
```
const queryClient = new QueryClient({  defaultOptions: {    queries: {      networkMode: 'offlineFirst', // Use cache when offline    },  },})// Per-query overrideuseQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  networkMode: 'always', // Always try, even offline (for local APIs)})
```
```
const queryClient = new QueryClient({  defaultOptions: {    queries: {      networkMode: 'offlineFirst', // Use cache when offline    },  },})// Per-query overrideuseQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  networkMode: 'always', // Always try, even offline (for local APIs)})
```
```
online
```
```
always
```
```
offlineFirst
```
```
const { isPending, fetchStatus } = useQuery(...)// isPending + fetchStatus === 'paused' = offline, waiting for network
```
```
const { isPending, fetchStatus } = useQuery(...)// isPending + fetchStatus === 'paused' = offline, waiting for network
```
```
const results = useQueries({  queries: userIds.map(id => ({    queryKey: ['user', id],    queryFn: () => fetchUser(id),  })),  combine: (results) => ({    data: results.map(r => r.data),    pending: results.some(r => r.isPending),    error: results.find(r => r.error)?.error,  }),})// Access combined resultif (results.pending) return <Loading />console.log(results.data) // [user1, user2, user3]
```
```
const results = useQueries({  queries: userIds.map(id => ({    queryKey: ['user', id],    queryFn: () => fetchUser(id),  })),  combine: (results) => ({    data: results.map(r => r.data),    pending: results.some(r => r.isPending),    error: results.find(r => r.error)?.error,  }),})// Access combined resultif (results.pending) return <Loading />console.log(results.data) // [user1, user2, user3]
```
```
queryOptions
```
```
import { infiniteQueryOptions, useInfiniteQuery, prefetchInfiniteQuery } from '@tanstack/react-query'const todosInfiniteOptions = infiniteQueryOptions({  queryKey: ['todos', 'infinite'],  queryFn: ({ pageParam }) => fetchTodosPage(pageParam),  initialPageParam: 0,  getNextPageParam: (lastPage) => lastPage.nextCursor,})// Reuse across hooksuseInfiniteQuery(todosInfiniteOptions)useSuspenseInfiniteQuery(todosInfiniteOptions)prefetchInfiniteQuery(queryClient, todosInfiniteOptions)
```
```
import { infiniteQueryOptions, useInfiniteQuery, prefetchInfiniteQuery } from '@tanstack/react-query'const todosInfiniteOptions = infiniteQueryOptions({  queryKey: ['todos', 'infinite'],  queryFn: ({ pageParam }) => fetchTodosPage(pageParam),  initialPageParam: 0,  getNextPageParam: (lastPage) => lastPage.nextCursor,})// Reuse across hooksuseInfiniteQuery(todosInfiniteOptions)useSuspenseInfiniteQuery(todosInfiniteOptions)prefetchInfiniteQuery(queryClient, todosInfiniteOptions)
```
```
useInfiniteQuery({  queryKey: ['posts'],  queryFn: ({ pageParam }) => fetchPosts(pageParam),  initialPageParam: 0,  getNextPageParam: (lastPage) => lastPage.nextCursor,  getPreviousPageParam: (firstPage) => firstPage.prevCursor, // Required with maxPages  maxPages: 3, // Only keep 3 pages in memory})
```
```
useInfiniteQuery({  queryKey: ['posts'],  queryFn: ({ pageParam }) => fetchPosts(pageParam),  initialPageParam: 0,  getNextPageParam: (lastPage) => lastPage.nextCursor,  getPreviousPageParam: (firstPage) => firstPage.prevCursor, // Required with maxPages  maxPages: 3, // Only keep 3 pages in memory})
```
```
maxPages
```
```
getNextPageParam
```
```
getPreviousPageParam
```
```
npm install @tanstack/react-query@latestnpm install -D @tanstack/react-query-devtools@latest
```
```
npm install @tanstack/react-query@latestnpm install -D @tanstack/react-query-devtools@latest
```
```
// src/main.tsximport { QueryClient, QueryClientProvider } from '@tanstack/react-query'import { ReactQueryDevtools } from '@tanstack/react-query-devtools'const queryClient = new QueryClient({  defaultOptions: {    queries: {      staleTime: 1000 * 60 * 5, // 5 min      gcTime: 1000 * 60 * 60, // 1 hour (v5: renamed from cacheTime)      refetchOnWindowFocus: false,    },  },})<QueryClientProvider client={queryClient}>  <App />  <ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider>
```
```
// src/main.tsximport { QueryClient, QueryClientProvider } from '@tanstack/react-query'import { ReactQueryDevtools } from '@tanstack/react-query-devtools'const queryClient = new QueryClient({  defaultOptions: {    queries: {      staleTime: 1000 * 60 * 5, // 5 min      gcTime: 1000 * 60 * 60, // 1 hour (v5: renamed from cacheTime)      refetchOnWindowFocus: false,    },  },})<QueryClientProvider client={queryClient}>  <App />  <ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider>
```
```
// src/hooks/useTodos.tsimport { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'// Query options factory (v5 pattern)export const todosQueryOptions = queryOptions({  queryKey: ['todos'],  queryFn: async () => {    const res = await fetch('/api/todos')    if (!res.ok) throw new Error('Failed to fetch')    return res.json()  },})export function useTodos() {  return useQuery(todosQueryOptions)}export function useAddTodo() {  const queryClient = useQueryClient()  return useMutation({    mutationFn: async (newTodo) => {      const res = await fetch('/api/todos', {        method: 'POST',        headers: { 'Content-Type': 'application/json' },        body: JSON.stringify(newTodo),      })      if (!res.ok) throw new Error('Failed to add')      return res.json()    },    onSuccess: () => {      queryClient.invalidateQueries({ queryKey: ['todos'] })    },  })}// Usage:function TodoList() {  const { data, isPending, isError, error } = useTodos()  const { mutate } = useAddTodo()  if (isPending) return <div>Loading...</div>  if (isError) return <div>Error: {error.message}</div>  return <ul>{data.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>}
```
```
// src/hooks/useTodos.tsimport { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'// Query options factory (v5 pattern)export const todosQueryOptions = queryOptions({  queryKey: ['todos'],  queryFn: async () => {    const res = await fetch('/api/todos')    if (!res.ok) throw new Error('Failed to fetch')    return res.json()  },})export function useTodos() {  return useQuery(todosQueryOptions)}export function useAddTodo() {  const queryClient = useQueryClient()  return useMutation({    mutationFn: async (newTodo) => {      const res = await fetch('/api/todos', {        method: 'POST',        headers: { 'Content-Type': 'application/json' },        body: JSON.stringify(newTodo),      })      if (!res.ok) throw new Error('Failed to add')      return res.json()    },    onSuccess: () => {      queryClient.invalidateQueries({ queryKey: ['todos'] })    },  })}// Usage:function TodoList() {  const { data, isPending, isError, error } = useTodos()  const { mutate } = useAddTodo()  if (isPending) return <div>Loading...</div>  if (isError) return <div>Error: {error.message}</div>  return <ul>{data.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>}
```
```
// v5 ONLY supports this:useQuery({ queryKey, queryFn, ...options })useMutation({ mutationFn, ...options })
```
```
// v5 ONLY supports this:useQuery({ queryKey, queryFn, ...options })useMutation({ mutationFn, ...options })
```
```
queryKey: ['todos']              // ListqueryKey: ['todos', id]          // DetailqueryKey: ['todos', { filter }]  // Filtered
```
```
queryKey: ['todos']              // ListqueryKey: ['todos', id]          // DetailqueryKey: ['todos', { filter }]  // Filtered
```
```
staleTime: 1000 * 60 * 5 // 5 min - prevents excessive refetches
```
```
staleTime: 1000 * 60 * 5 // 5 min - prevents excessive refetches
```
```
if (isPending) return <Loading />// isPending = no data yet AND fetching
```
```
if (isPending) return <Loading />// isPending = no data yet AND fetching
```
```
if (!response.ok) throw new Error('Failed')
```
```
if (!response.ok) throw new Error('Failed')
```
```
onSuccess: () => {  queryClient.invalidateQueries({ queryKey: ['todos'] })}
```
```
onSuccess: () => {  queryClient.invalidateQueries({ queryKey: ['todos'] })}
```
```
const opts = queryOptions({ queryKey, queryFn })useQuery(opts)useSuspenseQuery(opts)prefetchQuery(opts)
```
```
const opts = queryOptions({ queryKey, queryFn })useQuery(opts)useSuspenseQuery(opts)prefetchQuery(opts)
```
```
gcTime: 1000 * 60 * 60 // 1 hour
```
```
gcTime: 1000 * 60 * 60 // 1 hour
```
```
// v4 (removed in v5):useQuery(['todos'], fetchTodos, options) // ❌// v5 (correct):useQuery({ queryKey: ['todos'], queryFn: fetchTodos }) // ✅
```
```
// v4 (removed in v5):useQuery(['todos'], fetchTodos, options) // ❌// v5 (correct):useQuery({ queryKey: ['todos'], queryFn: fetchTodos }) // ✅
```
```
// v5 removed these from queries:useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  onSuccess: (data) => {}, // ❌ Removed in v5})// Use useEffect instead:const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })useEffect(() => {  if (data) {    // Do something  }}, [data])// Or use mutation callbacks (still supported):useMutation({  mutationFn: addTodo,  onSuccess: () => {}, // ✅ Still works for mutations})
```
```
// v5 removed these from queries:useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  onSuccess: (data) => {}, // ❌ Removed in v5})// Use useEffect instead:const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })useEffect(() => {  if (data) {    // Do something  }}, [data])// Or use mutation callbacks (still supported):useMutation({  mutationFn: addTodo,  onSuccess: () => {}, // ✅ Still works for mutations})
```
```
// Deprecated in v5:cacheTime: 1000 // ❌ Use gcTime insteadisLoading: true // ❌ Meaning changed, use isPendingkeepPreviousData: true // ❌ Use placeholderData insteadonSuccess: () => {} // ❌ Removed from queriesuseErrorBoundary: true // ❌ Use throwOnError instead
```
```
// Deprecated in v5:cacheTime: 1000 // ❌ Use gcTime insteadisLoading: true // ❌ Meaning changed, use isPendingkeepPreviousData: true // ❌ Use placeholderData insteadonSuccess: () => {} // ❌ Removed from queriesuseErrorBoundary: true // ❌ Use throwOnError instead
```
```
// v5 changed this:isLoading = isPending && isFetching // ❌ Now means "pending AND fetching"isPending = no data yet // ✅ Use this for initial load
```
```
// v5 changed this:isLoading = isPending && isFetching // ❌ Now means "pending AND fetching"isPending = no data yet // ✅ Use this for initial load
```
```
// v5 requires this:useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam }) => fetchProjects(pageParam),  initialPageParam: 0, // ✅ Required in v5  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
// v5 requires this:useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam }) => fetchProjects(pageParam),  initialPageParam: 0, // ✅ Required in v5  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
// Not allowed:useSuspenseQuery({  queryKey: ['todo', id],  queryFn: () => fetchTodo(id),  enabled: !!id, // ❌ Not available with suspense})// Use conditional rendering instead:{id && <TodoComponent id={id} />}
```
```
// Not allowed:useSuspenseQuery({  queryKey: ['todo', id],  queryFn: () => fetchTodo(id),  enabled: !!id, // ❌ Not available with suspense})// Use conditional rendering instead:{id && <TodoComponent id={id} />}
```
```
// Doesn't work - errors are always staleuseQuery({  queryKey: ['data'],  queryFn: failingFetch,  refetchOnMount: false,  // ❌ Ignored when query has error})// Use retryOnMount insteaduseQuery({  queryKey: ['data'],  queryFn: failingFetch,  refetchOnMount: false,  retryOnMount: false,  // ✅ Prevents refetch for errored queries  retry: 0,})
```
```
// Doesn't work - errors are always staleuseQuery({  queryKey: ['data'],  queryFn: failingFetch,  refetchOnMount: false,  // ❌ Ignored when query has error})// Use retryOnMount insteaduseQuery({  queryKey: ['data'],  queryFn: failingFetch,  refetchOnMount: false,  retryOnMount: false,  // ✅ Prevents refetch for errored queries  retry: 0,})
```
```
useQuery is not a function
```
```
useQuery({ queryKey, queryFn, ...options })
```
```
useQuery(['todos'], fetchTodos, { staleTime: 5000 })
```
```
useQuery(['todos'], fetchTodos, { staleTime: 5000 })
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  staleTime: 5000})
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  staleTime: 5000})
```
```
useEffect
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  onSuccess: (data) => {    console.log('Todos loaded:', data)  },})
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  onSuccess: (data) => {    console.log('Todos loaded:', data)  },})
```
```
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })useEffect(() => {  if (data) {    console.log('Todos loaded:', data)  }}, [data])
```
```
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })useEffect(() => {  if (data) {    console.log('Todos loaded:', data)  }}, [data])
```
```
status: 'loading'
```
```
status: 'pending'
```
```
isLoading
```
```
isPending
```
```
isLoading
```
```
const { data, isLoading } = useQuery(...)if (isLoading) return <div>Loading...</div>
```
```
const { data, isLoading } = useQuery(...)if (isLoading) return <div>Loading...</div>
```
```
const { data, isPending, isLoading } = useQuery(...)if (isPending) return <div>Loading...</div>// isLoading = isPending && isFetching (fetching for first time)
```
```
const { data, isPending, isLoading } = useQuery(...)if (isPending) return <div>Loading...</div>// isLoading = isPending && isFetching (fetching for first time)
```
```
cacheTime is not a valid option
```
```
gcTime
```
```
cacheTime
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  cacheTime: 1000 * 60 * 60,})
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  cacheTime: 1000 * 60 * 60,})
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  gcTime: 1000 * 60 * 60,})
```
```
useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  gcTime: 1000 * 60 * 60,})
```
```
enabled
```
```
useSuspenseQuery({  queryKey: ['todo', id],  queryFn: () => fetchTodo(id),  enabled: !!id, // ❌ Not allowed})
```
```
useSuspenseQuery({  queryKey: ['todo', id],  queryFn: () => fetchTodo(id),  enabled: !!id, // ❌ Not allowed})
```
```
// Conditional rendering:{id ? (  <TodoComponent id={id} />) : (  <div>No ID selected</div>)}// Inside TodoComponent:function TodoComponent({ id }: { id: number }) {  const { data } = useSuspenseQuery({    queryKey: ['todo', id],    queryFn: () => fetchTodo(id),    // No enabled option needed  })  return <div>{data.title}</div>}
```
```
// Conditional rendering:{id ? (  <TodoComponent id={id} />) : (  <div>No ID selected</div>)}// Inside TodoComponent:function TodoComponent({ id }: { id: number }) {  const { data } = useSuspenseQuery({    queryKey: ['todo', id],    queryFn: () => fetchTodo(id),    // No enabled option needed  })  return <div>{data.title}</div>}
```
```
initialPageParam is required
```
```
undefined
```
```
initialPageParam
```
```
useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam }) => fetchProjects(pageParam),  initialPageParam: 0, // ✅ Required  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam }) => fetchProjects(pageParam),  initialPageParam: 0, // ✅ Required  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
keepPreviousData is not a valid option
```
```
placeholderData
```
```
placeholderData: keepPreviousData
```
```
useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  keepPreviousData: true,})
```
```
useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  keepPreviousData: true,})
```
```
import { keepPreviousData } from '@tanstack/react-query'useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  placeholderData: keepPreviousData,})
```
```
import { keepPreviousData } from '@tanstack/react-query'useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  placeholderData: keepPreviousData,})
```
```
unknown
```
```
Error
```
```
const { error } = useQuery({  queryKey: ['data'],  queryFn: async () => {    if (Math.random() > 0.5) throw 'custom error string'    return data  },})// error: unknown
```
```
const { error } = useQuery({  queryKey: ['data'],  queryFn: async () => {    if (Math.random() > 0.5) throw 'custom error string'    return data  },})// error: unknown
```
```
const { error } = useQuery<DataType, string>({  queryKey: ['data'],  queryFn: async () => {    if (Math.random() > 0.5) throw 'custom error string'    return data  },})// error: string | null// Or better: always throw Error objectsconst { error } = useQuery({  queryKey: ['data'],  queryFn: async () => {    if (Math.random() > 0.5) throw new Error('custom error')    return data  },})// error: Error | null (default)
```
```
const { error } = useQuery<DataType, string>({  queryKey: ['data'],  queryFn: async () => {    if (Math.random() > 0.5) throw 'custom error string'    return data  },})// error: string | null// Or better: always throw Error objectsconst { error } = useQuery({  queryKey: ['data'],  queryFn: async () => {    if (Math.random() > 0.5) throw new Error('custom error')    return data  },})// error: Error | null (default)
```
```
Hydration failed because the initial UI does not match what was rendered on the server
```
```
hydrate()
```
```
query.fetch()
```
```
fetchStatus
```
```
useSuspenseQuery
```
```
// Server: void prefetchstreamingQueryClient.prefetchQuery({ queryKey: ['data'], queryFn: getData });// Client: conditional render on fetchStatusconst { data, isFetching } = useSuspenseQuery({ queryKey: ['data'], queryFn: getData });return <>{data && <div>{data}</div>} {isFetching && <Loading />}</>;
```
```
// Server: void prefetchstreamingQueryClient.prefetchQuery({ queryKey: ['data'], queryFn: getData });// Client: conditional render on fetchStatusconst { data, isFetching } = useSuspenseQuery({ queryKey: ['data'], queryFn: getData });return <>{data && <div>{data}</div>} {isFetching && <Loading />}</>;
```
```
// Option 1: Await prefetchawait streamingQueryClient.prefetchQuery({ queryKey: ['data'], queryFn: getData });// Option 2: Don't render based on fetchStatus with Suspenseconst { data } = useSuspenseQuery({ queryKey: ['data'], queryFn: getData });return <div>{data}</div>;  // No conditional on isFetching
```
```
// Option 1: Await prefetchawait streamingQueryClient.prefetchQuery({ queryKey: ['data'], queryFn: getData });// Option 2: Don't render based on fetchStatus with Suspenseconst { data } = useSuspenseQuery({ queryKey: ['data'], queryFn: getData });return <div>{data}</div>;  // No conditional on isFetching
```
```
getServerSnapshot
```
```
tryResolveSync
```
```
useSuspenseQuery
```
```
useQuery
```
```
isLoading
```
```
// Server Componentconst queryClient = getServerQueryClient();await queryClient.prefetchQuery({ queryKey: ['todos'], queryFn: fetchTodos });// Client Componentfunction Todos() {  const { data, isLoading } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });  if (isLoading) return <div>Loading...</div>;  // Server renders this  return <div>{data.length} todos</div>;  // Client hydrates with this}
```
```
// Server Componentconst queryClient = getServerQueryClient();await queryClient.prefetchQuery({ queryKey: ['todos'], queryFn: fetchTodos });// Client Componentfunction Todos() {  const { data, isLoading } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });  if (isLoading) return <div>Loading...</div>;  // Server renders this  return <div>{data.length} todos</div>;  // Client hydrates with this}
```
```
// Use useSuspenseQuery insteadfunction Todos() {  const { data } = useSuspenseQuery({ queryKey: ['todos'], queryFn: fetchTodos });  return <div>{data.length} todos</div>;}
```
```
// Use useSuspenseQuery insteadfunction Todos() {  const { data } = useSuspenseQuery({ queryKey: ['todos'], queryFn: fetchTodos });  return <div>{data.length} todos</div>;}
```
```
getServerSnapshot
```
```
refetchOnMount: false
```
```
retryOnMount: false
```
```
refetchOnMount: false
```
```
const { data, error } = useQuery({  queryKey: ['data'],  queryFn: () => { throw new Error('Fails') },  refetchOnMount: false,  // Ignored when query is in error state  retry: 0,});// Query refetches every time component mounts
```
```
const { data, error } = useQuery({  queryKey: ['data'],  queryFn: () => { throw new Error('Fails') },  refetchOnMount: false,  // Ignored when query is in error state  retry: 0,});// Query refetches every time component mounts
```
```
const { data, error } = useQuery({  queryKey: ['data'],  queryFn: failingFetch,  refetchOnMount: false,  retryOnMount: false,  // ✅ Prevents refetch on mount for errored queries  retry: 0,});
```
```
const { data, error } = useQuery({  queryKey: ['data'],  queryFn: failingFetch,  refetchOnMount: false,  retryOnMount: false,  // ✅ Prevents refetch on mount for errored queries  retry: 0,});
```
```
retryOnMount
```
```
onMutateResult
```
```
variables
```
```
context
```
```
useMutation({  mutationFn: addTodo,  onError: (error, variables, context) => {    // context is now onMutateResult, missing final context param  },  onSuccess: (data, variables, context) => {    // Same issue  }});
```
```
useMutation({  mutationFn: addTodo,  onError: (error, variables, context) => {    // context is now onMutateResult, missing final context param  },  onSuccess: (data, variables, context) => {    // Same issue  }});
```
```
useMutation({  mutationFn: addTodo,  onError: (error, variables, onMutateResult, context) => {    // onMutateResult = return value from onMutate    // context = mutation function context  },  onSuccess: (data, variables, onMutateResult, context) => {    // Correct signature with 4 parameters  }});
```
```
useMutation({  mutationFn: addTodo,  onError: (error, variables, onMutateResult, context) => {    // onMutateResult = return value from onMutate    // context = mutation function context  },  onSuccess: (data, variables, onMutateResult, context) => {    // Correct signature with 4 parameters  }});
```
```
onMutate
```
```
onMutateResult
```
```
Type 'readonly ["todos", string]' is not assignable to type '["todos", string]'
```
```
as const
```
```
export function todoQueryKey(id?: string) {  return id ? ['todos', id] as const : ['todos'] as const;}// Type: readonly ['todos', string] | readonly ['todos']useMutation({  mutationFn: addTodo,  onSuccess: () => {    queryClient.invalidateQueries({      queryKey: todoQueryKey('123')      // Error: readonly ['todos', string] not assignable to ['todos', string]    });  }});
```
```
export function todoQueryKey(id?: string) {  return id ? ['todos', id] as const : ['todos'] as const;}// Type: readonly ['todos', string] | readonly ['todos']useMutation({  mutationFn: addTodo,  onSuccess: () => {    queryClient.invalidateQueries({      queryKey: todoQueryKey('123')      // Error: readonly ['todos', string] not assignable to ['todos', string]    });  }});
```
```
// Works correctly with readonly typesqueryClient.invalidateQueries({  queryKey: todoQueryKey('123')  // ✅ No type error});
```
```
// Works correctly with readonly typesqueryClient.invalidateQueries({  queryKey: todoQueryKey('123')  // ✅ No type error});
```
```
openapi-react-query
```
```
mutation.state.variables
```
```
unknown
```
```
queryClient.getQueryCache().find()
```
```
select
```
```
const addTodo = useMutation({  mutationKey: ['addTodo'],  mutationFn: (todo: Todo) => api.addTodo(todo),});const pendingTodos = useMutationState({  filters: { mutationKey: ['addTodo'], status: 'pending' },  select: (mutation) => {    return mutation.state.variables;  // Type: unknown  },});
```
```
const addTodo = useMutation({  mutationKey: ['addTodo'],  mutationFn: (todo: Todo) => api.addTodo(todo),});const pendingTodos = useMutationState({  filters: { mutationKey: ['addTodo'], status: 'pending' },  select: (mutation) => {    return mutation.state.variables;  // Type: unknown  },});
```
```
const pendingTodos = useMutationState({  filters: { mutationKey: ['addTodo'], status: 'pending' },  select: (mutation) => mutation.state.variables as Todo,});// Or cast the entire state:select: (mutation) => mutation.state as MutationState<Todo, Error, Todo, unknown>
```
```
const pendingTodos = useMutationState({  filters: { mutationKey: ['addTodo'], status: 'pending' },  select: (mutation) => mutation.state.variables as Todo,});// Or cast the entire state:select: (mutation) => mutation.state as MutationState<Todo, Error, Todo, unknown>
```
```
CancelledError
```
```
fetchQuery()
```
```
useQuery
```
```
useQuery
```
```
fetchQuery()
```
```
async function loadData() {  try {    const data = await queryClient.fetchQuery({      queryKey: ['data'],      queryFn: fetchData,    });    console.log('Loaded:', data);  // Never logs in StrictMode  } catch (error) {    console.error('Failed:', error);  // CancelledError  }}function Component() {  const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });  // In StrictMode, component unmounts/remounts, cancelling fetchQuery}
```
```
async function loadData() {  try {    const data = await queryClient.fetchQuery({      queryKey: ['data'],      queryFn: fetchData,    });    console.log('Loaded:', data);  // Never logs in StrictMode  } catch (error) {    console.error('Failed:', error);  // CancelledError  }}function Component() {  const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });  // In StrictMode, component unmounts/remounts, cancelling fetchQuery}
```
```
// Keep query observed with staleTimeconst { data } = useQuery({  queryKey: ['data'],  queryFn: fetchData,  staleTime: Infinity,  // Keeps query active});
```
```
// Keep query observed with staleTimeconst { data } = useQuery({  queryKey: ['data'],  queryFn: fetchData,  staleTime: Infinity,  // Keeps query active});
```
```
invalidateQueries()
```
```
invalidateQueries()
```
```
refetchType: 'all'
```
```
// Only active queries (currently being observed) will refetchqueryClient.invalidateQueries({ queryKey: ['todos'] });
```
```
// Only active queries (currently being observed) will refetchqueryClient.invalidateQueries({ queryKey: ['todos'] });
```
```
queryClient.invalidateQueries({  queryKey: ['todos'],  refetchType: 'all'  // Refetch active AND inactive});
```
```
queryClient.invalidateQueries({  queryKey: ['todos'],  refetchType: 'all'  // Refetch active AND inactive});
```
```
staleTime
```
```
// Component A mounts firstfunction ComponentA() {  const { data } = useQuery({    queryKey: ['todos'],    queryFn: fetchTodos,    staleTime: 5000,  // Applied initially  });}// Component B mounts while A's query is in-flightfunction ComponentB() {  const { data } = useQuery({    queryKey: ['todos'],    queryFn: fetchTodos,    staleTime: 60000,  // Won't affect current fetch, only future ones  });}
```
```
// Component A mounts firstfunction ComponentA() {  const { data } = useQuery({    queryKey: ['todos'],    queryFn: fetchTodos,    staleTime: 5000,  // Applied initially  });}// Component B mounts while A's query is in-flightfunction ComponentB() {  const { data } = useQuery({    queryKey: ['todos'],    queryFn: fetchTodos,    staleTime: 60000,  // Won't affect current fetch, only future ones  });}
```
```
// Write options as functions that reference latest valuesconst getStaleTime = () => shouldUseLongCache ? 60000 : 5000;useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  staleTime: getStaleTime(),  // Evaluated on each render});
```
```
// Write options as functions that reference latest valuesconst getStaleTime = () => shouldUseLongCache ? 60000 : 5000;useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  staleTime: getStaleTime(),  // Evaluated on each render});
```
```
refetch()
```
```
// ❌ Wrong - using refetch() for different parametersconst [page, setPage] = useState(1);const { data, refetch } = useQuery({  queryKey: ['todos'],  // Same key for all pages  queryFn: () => fetchTodos(page),});// This refetches with OLD page value, not new one<button onClick={() => { setPage(2); refetch(); }}>Next</button>
```
```
// ❌ Wrong - using refetch() for different parametersconst [page, setPage] = useState(1);const { data, refetch } = useQuery({  queryKey: ['todos'],  // Same key for all pages  queryFn: () => fetchTodos(page),});// This refetches with OLD page value, not new one<button onClick={() => { setPage(2); refetch(); }}>Next</button>
```
```
// ✅ Correct - include parameters in query keyconst [page, setPage] = useState(1);const { data } = useQuery({  queryKey: ['todos', page],  // Key changes with page  queryFn: () => fetchTodos(page),  // Query automatically refetches when page changes});<button onClick={() => setPage(2)}>Next</button>  // Just update state
```
```
// ✅ Correct - include parameters in query keyconst [page, setPage] = useState(1);const { data } = useQuery({  queryKey: ['todos', page],  // Key changes with page  queryFn: () => fetchTodos(page),  // Query automatically refetches when page changes});<button onClick={() => setPage(2)}>Next</button>  // Just update state
```
```
// ✅ Manual refresh of same data (refresh button)const { data, refetch } = useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,});<button onClick={() => refetch()}>Refresh</button>  // Same parameters
```
```
// ✅ Manual refresh of same data (refresh button)const { data, refetch } = useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,});<button onClick={() => refetch()}>Refresh</button>  // Same parameters
```
```
const { data: posts } = useQuery({  queryKey: ['users', userId, 'posts'],  queryFn: () => fetchUserPosts(userId),  enabled: !!user, // Wait for user})
```
```
const { data: posts } = useQuery({  queryKey: ['users', userId, 'posts'],  queryFn: () => fetchUserPosts(userId),  enabled: !!user, // Wait for user})
```
```
const results = useQueries({  queries: ids.map(id => ({ queryKey: ['todos', id], queryFn: () => fetchTodo(id) })),})
```
```
const results = useQueries({  queries: ids.map(id => ({ queryKey: ['todos', id], queryFn: () => fetchTodo(id) })),})
```
```
queryClient.prefetchQuery({ queryKey: ['todo', id], queryFn: () => fetchTodo(id) })
```
```
queryClient.prefetchQuery({ queryKey: ['todo', id], queryFn: () => fetchTodo(id) })
```
```
useInfiniteQuery({  queryKey: ['todos', 'infinite'],  queryFn: ({ pageParam }) => fetchTodosPage(pageParam),  initialPageParam: 0, // Required in v5  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
useInfiniteQuery({  queryKey: ['todos', 'infinite'],  queryFn: ({ pageParam }) => fetchTodosPage(pageParam),  initialPageParam: 0, // Required in v5  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
queryFn: async ({ signal }) => {  const res = await fetch(/api/todos?q=${search}, { signal })  return res.json()}
```
```
queryFn: async ({ signal }) => {  const res = await fetch(/api/todos?q=${search}, { signal })  return res.json()}
```
```
/api/todos?q=${search}
```
```
select: (data) => data.filter(todo => todo.completed)
```
```
select: (data) => data.filter(todo => todo.completed)
```
```
/websites/tanstack_query
```
```
/* ❌ v4 array syntax (removed in v5) */useQuery(['todos'], fetchTodos, { staleTime: 5000 })/* ✅ v5 object syntax only */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  staleTime: 5000})
```
```
/* ❌ v4 array syntax (removed in v5) */useQuery(['todos'], fetchTodos, { staleTime: 5000 })/* ✅ v5 object syntax only */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  staleTime: 5000})
```
```
/* ❌ v5 removed onSuccess/onError/onSettled from queries */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  onSuccess: (data) => console.log(data), // Removed!})/* ✅ Use useEffect instead */const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })useEffect(() => {  if (data) console.log(data)}, [data])/* Note: Mutations still support callbacks */useMutation({  mutationFn: addTodo,  onSuccess: () => {}, // Still works!})
```
```
/* ❌ v5 removed onSuccess/onError/onSettled from queries */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  onSuccess: (data) => console.log(data), // Removed!})/* ✅ Use useEffect instead */const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })useEffect(() => {  if (data) console.log(data)}, [data])/* Note: Mutations still support callbacks */useMutation({  mutationFn: addTodo,  onSuccess: () => {}, // Still works!})
```
```
/* ❌ isLoading meaning changed in v5 */if (isLoading) return <Loading />/* ✅ Use isPending for initial load */const { data, isPending } = useQuery(...)if (isPending) return <Loading />// isPending = no data yet// isLoading = isPending && isFetching
```
```
/* ❌ isLoading meaning changed in v5 */if (isLoading) return <Loading />/* ✅ Use isPending for initial load */const { data, isPending } = useQuery(...)if (isPending) return <Loading />// isPending = no data yet// isLoading = isPending && isFetching
```
```
/* ❌ Renamed in v5 */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  cacheTime: 1000 * 60 * 60, // Error!})/* ✅ Use gcTime */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  gcTime: 1000 * 60 * 60,})
```
```
/* ❌ Renamed in v5 */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  cacheTime: 1000 * 60 * 60, // Error!})/* ✅ Use gcTime */useQuery({  queryKey: ['todos'],  queryFn: fetchTodos,  gcTime: 1000 * 60 * 60,})
```
```
/* ❌ Removed in v5 */useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  keepPreviousData: true, // Error!})/* ✅ Use placeholderData helper */import { keepPreviousData } from '@tanstack/react-query'useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  placeholderData: keepPreviousData,})
```
```
/* ❌ Removed in v5 */useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  keepPreviousData: true, // Error!})/* ✅ Use placeholderData helper */import { keepPreviousData } from '@tanstack/react-query'useQuery({  queryKey: ['todos', page],  queryFn: () => fetchTodos(page),  placeholderData: keepPreviousData,})
```
```
/* ❌ v4 used undefined as first pageParam */useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),  getNextPageParam: (lastPage) => lastPage.nextCursor,})/* ✅ v5 requires explicit initialPageParam */useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam }) => fetchProjects(pageParam),  initialPageParam: 0, // Required!  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
/* ❌ v4 used undefined as first pageParam */useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),  getNextPageParam: (lastPage) => lastPage.nextCursor,})/* ✅ v5 requires explicit initialPageParam */useInfiniteQuery({  queryKey: ['projects'],  queryFn: ({ pageParam }) => fetchProjects(pageParam),  initialPageParam: 0, // Required!  getNextPageParam: (lastPage) => lastPage.nextCursor,})
```
```
useQuery(['key'], fn, opts)
```
```
useQuery({ queryKey, queryFn, ...opts })
```
```
onSuccess
```
```
useEffect
```
```
cacheTime
```
```
gcTime
```
```
isLoading
```
```
isPending
```
```
keepPreviousData: true
```
```
placeholderData: keepPreviousData
```
```
initialPageParam
```
```
initialPageParam: 0
```
```
useErrorBoundary
```
```
throwOnError
```
Unlock advanced data management capabilities for your AI coding assistant with this TanStack Query v5 skill. Designed for developers utilizing React, this skill empowers agents to understand, generate, and troubleshoot code related to asynchronous data fetching, caching, and state synchronization. It streamlines tasks like implementing optimistic UI updates, tracking mutations across components, and managing query invalidation, making your agent an invaluable partner for building performant and reactive web applications. Leverage its expertise to simplify complex data interactions and elevate the efficiency of your React projects, ensuring best practices are always at your fingertips.

# When to Use This Skill
- •Implementing optimistic UI updates for form submissions or interactive features.
- •Tracking the status of multiple ongoing mutations globally or by specific keys.
- •Generating boilerplate code for `useQuery` or `useMutation` hooks with best practices.
- •Debugging cache invalidation strategies or data refetching issues in a React application.

# Pro Tips
- 💡When requesting code, specify the exact TanStack Query version (e.g., 'v5') and React version for optimal output.
- 💡Ask the agent to explain complex caching scenarios or query invalidation logic using this skill to deepen your understanding.
- 💡Combine with a 'TypeScript' skill to ensure strongly-typed TanStack Query implementations are generated.

