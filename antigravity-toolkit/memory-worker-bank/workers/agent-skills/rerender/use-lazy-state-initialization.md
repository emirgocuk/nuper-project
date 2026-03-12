# Use Lazy State Initialization
Source: https://antigravity.codes/agent-skills/rerender/rerender-lazy-state-init

## AI Worker Instructions
When the user requests functionality related to Use Lazy State Initialization, follow these guidelines and utilize this context.

## Scraped Content

# Use Lazy State Initialization
```
useState
```
```
function FilteredList({ items }: { items: Item[] }) {  // buildSearchIndex() runs on EVERY render, even after initialization  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))  const [query, setQuery] = useState('')    // When query changes, buildSearchIndex runs again unnecessarily  return <SearchResults index={searchIndex} query={query} />}function UserProfile() {  // JSON.parse runs on every render  const [settings, setSettings] = useState(    JSON.parse(localStorage.getItem('settings') || '{}')  )    return <SettingsForm settings={settings} onChange={setSettings} />}
```
```
function FilteredList({ items }: { items: Item[] }) {  // buildSearchIndex() runs on EVERY render, even after initialization  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))  const [query, setQuery] = useState('')    // When query changes, buildSearchIndex runs again unnecessarily  return <SearchResults index={searchIndex} query={query} />}function UserProfile() {  // JSON.parse runs on every render  const [settings, setSettings] = useState(    JSON.parse(localStorage.getItem('settings') || '{}')  )    return <SettingsForm settings={settings} onChange={setSettings} />}
```
```
function FilteredList({ items }: { items: Item[] }) {  // buildSearchIndex() runs ONLY on initial render  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))  const [query, setQuery] = useState('')    return <SearchResults index={searchIndex} query={query} />}function UserProfile() {  // JSON.parse runs only on initial render  const [settings, setSettings] = useState(() => {    const stored = localStorage.getItem('settings')    return stored ? JSON.parse(stored) : {}  })    return <SettingsForm settings={settings} onChange={setSettings} />}
```
```
function FilteredList({ items }: { items: Item[] }) {  // buildSearchIndex() runs ONLY on initial render  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))  const [query, setQuery] = useState('')    return <SearchResults index={searchIndex} query={query} />}function UserProfile() {  // JSON.parse runs only on initial render  const [settings, setSettings] = useState(() => {    const stored = localStorage.getItem('settings')    return stored ? JSON.parse(stored) : {}  })    return <SettingsForm settings={settings} onChange={setSettings} />}
```
```
useState(0)
```
```
useState(props.value)
```
```
useState({})
```

