# useLatest for Stable Callback Refs
Source: https://antigravity.codes/agent-skills/advanced/advanced-use-latest

## AI Worker Instructions
When the user requests functionality related to useLatest for Stable Callback Refs, follow these guidelines and utilize this context.

## Scraped Content

# useLatest for Stable Callback Refs
```
function useLatest<T>(value: T) {  const ref = useRef(value)  useEffect(() => {    ref.current = value  }, [value])  return ref}
```
```
function useLatest<T>(value: T) {  const ref = useRef(value)  useEffect(() => {    ref.current = value  }, [value])  return ref}
```
```
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {  const [query, setQuery] = useState('')  useEffect(() => {    const timeout = setTimeout(() => onSearch(query), 300)    return () => clearTimeout(timeout)  }, [query, onSearch])}
```
```
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {  const [query, setQuery] = useState('')  useEffect(() => {    const timeout = setTimeout(() => onSearch(query), 300)    return () => clearTimeout(timeout)  }, [query, onSearch])}
```
```
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {  const [query, setQuery] = useState('')  const onSearchRef = useLatest(onSearch)  useEffect(() => {    const timeout = setTimeout(() => onSearchRef.current(query), 300)    return () => clearTimeout(timeout)  }, [query])}
```
```
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {  const [query, setQuery] = useState('')  const onSearchRef = useLatest(onSearch)  useEffect(() => {    const timeout = setTimeout(() => onSearchRef.current(query), 300)    return () => clearTimeout(timeout)  }, [query])}
```

