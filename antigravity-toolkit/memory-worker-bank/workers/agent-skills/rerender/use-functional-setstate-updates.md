# Use Functional setState Updates
Source: https://antigravity.codes/agent-skills/rerender/rerender-functional-setstate

## AI Worker Instructions
When the user requests functionality related to Use Functional setState Updates, follow these guidelines and utilize this context.

## Scraped Content

# Use Functional setState Updates
```
function TodoList() {  const [items, setItems] = useState(initialItems)    // Callback must depend on items, recreated on every items change  const addItems = useCallback((newItems: Item[]) => {    setItems([...items, ...newItems])  }, [items])  // ❌ items dependency causes recreations    // Risk of stale closure if dependency is forgotten  const removeItem = useCallback((id: string) => {    setItems(items.filter(item => item.id !== id))  }, [])  // ❌ Missing items dependency - will use stale items!    return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />}
```
```
function TodoList() {  const [items, setItems] = useState(initialItems)    // Callback must depend on items, recreated on every items change  const addItems = useCallback((newItems: Item[]) => {    setItems([...items, ...newItems])  }, [items])  // ❌ items dependency causes recreations    // Risk of stale closure if dependency is forgotten  const removeItem = useCallback((id: string) => {    setItems(items.filter(item => item.id !== id))  }, [])  // ❌ Missing items dependency - will use stale items!    return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />}
```
```
items
```
```
items
```
```
function TodoList() {  const [items, setItems] = useState(initialItems)    // Stable callback, never recreated  const addItems = useCallback((newItems: Item[]) => {    setItems(curr => [...curr, ...newItems])  }, [])  // ✅ No dependencies needed    // Always uses latest state, no stale closure risk  const removeItem = useCallback((id: string) => {    setItems(curr => curr.filter(item => item.id !== id))  }, [])  // ✅ Safe and stable    return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />}
```
```
function TodoList() {  const [items, setItems] = useState(initialItems)    // Stable callback, never recreated  const addItems = useCallback((newItems: Item[]) => {    setItems(curr => [...curr, ...newItems])  }, [])  // ✅ No dependencies needed    // Always uses latest state, no stale closure risk  const removeItem = useCallback((id: string) => {    setItems(curr => curr.filter(item => item.id !== id))  }, [])  // ✅ Safe and stable    return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />}
```
```
setCount(0)
```
```
setName(newName)
```

