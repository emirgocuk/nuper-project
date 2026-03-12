# Deduplicate Global Event Listeners
Source: https://antigravity.codes/agent-skills/client/client-event-listeners

## AI Worker Instructions
When the user requests functionality related to Deduplicate Global Event Listeners, follow these guidelines and utilize this context.

## Scraped Content

# Deduplicate Global Event Listeners
```
useSWRSubscription()
```
```
function useKeyboardShortcut(key: string, callback: () => void) {  useEffect(() => {    const handler = (e: KeyboardEvent) => {      if (e.metaKey && e.key === key) {        callback()      }    }    window.addEventListener('keydown', handler)    return () => window.removeEventListener('keydown', handler)  }, [key, callback])}
```
```
function useKeyboardShortcut(key: string, callback: () => void) {  useEffect(() => {    const handler = (e: KeyboardEvent) => {      if (e.metaKey && e.key === key) {        callback()      }    }    window.addEventListener('keydown', handler)    return () => window.removeEventListener('keydown', handler)  }, [key, callback])}
```
```
useKeyboardShortcut
```
```
import useSWRSubscription from 'swr/subscription'// Module-level Map to track callbacks per keyconst keyCallbacks = new Map<string, Set<() => void>>()function useKeyboardShortcut(key: string, callback: () => void) {  // Register this callback in the Map  useEffect(() => {    if (!keyCallbacks.has(key)) {      keyCallbacks.set(key, new Set())    }    keyCallbacks.get(key)!.add(callback)    return () => {      const set = keyCallbacks.get(key)      if (set) {        set.delete(callback)        if (set.size === 0) {          keyCallbacks.delete(key)        }      }    }  }, [key, callback])  useSWRSubscription('global-keydown', () => {    const handler = (e: KeyboardEvent) => {      if (e.metaKey && keyCallbacks.has(e.key)) {        keyCallbacks.get(e.key)!.forEach(cb => cb())      }    }    window.addEventListener('keydown', handler)    return () => window.removeEventListener('keydown', handler)  })}function Profile() {  // Multiple shortcuts will share the same listener  useKeyboardShortcut('p', () => { /* ... */ })   useKeyboardShortcut('k', () => { /* ... */ })  // ...}
```
```
import useSWRSubscription from 'swr/subscription'// Module-level Map to track callbacks per keyconst keyCallbacks = new Map<string, Set<() => void>>()function useKeyboardShortcut(key: string, callback: () => void) {  // Register this callback in the Map  useEffect(() => {    if (!keyCallbacks.has(key)) {      keyCallbacks.set(key, new Set())    }    keyCallbacks.get(key)!.add(callback)    return () => {      const set = keyCallbacks.get(key)      if (set) {        set.delete(callback)        if (set.size === 0) {          keyCallbacks.delete(key)        }      }    }  }, [key, callback])  useSWRSubscription('global-keydown', () => {    const handler = (e: KeyboardEvent) => {      if (e.metaKey && keyCallbacks.has(e.key)) {        keyCallbacks.get(e.key)!.forEach(cb => cb())      }    }    window.addEventListener('keydown', handler)    return () => window.removeEventListener('keydown', handler)  })}function Profile() {  // Multiple shortcuts will share the same listener  useKeyboardShortcut('p', () => { /* ... */ })   useKeyboardShortcut('k', () => { /* ... */ })  // ...}
```

