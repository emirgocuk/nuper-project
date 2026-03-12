# Cache Storage API Calls
Source: https://antigravity.codes/agent-skills/js/js-cache-storage

## AI Worker Instructions
When the user requests functionality related to Cache Storage API Calls, follow these guidelines and utilize this context.

## Scraped Content

# Cache Storage API Calls
```
localStorage
```
```
sessionStorage
```
```
document.cookie
```
```
function getTheme() {  return localStorage.getItem('theme') ?? 'light'}// Called 10 times = 10 storage reads
```
```
function getTheme() {  return localStorage.getItem('theme') ?? 'light'}// Called 10 times = 10 storage reads
```
```
const storageCache = new Map<string, string | null>()function getLocalStorage(key: string) {  if (!storageCache.has(key)) {    storageCache.set(key, localStorage.getItem(key))  }  return storageCache.get(key)}function setLocalStorage(key: string, value: string) {  localStorage.setItem(key, value)  storageCache.set(key, value)  // keep cache in sync}
```
```
const storageCache = new Map<string, string | null>()function getLocalStorage(key: string) {  if (!storageCache.has(key)) {    storageCache.set(key, localStorage.getItem(key))  }  return storageCache.get(key)}function setLocalStorage(key: string, value: string) {  localStorage.setItem(key, value)  storageCache.set(key, value)  // keep cache in sync}
```
```
let cookieCache: Record<string, string> | null = nullfunction getCookie(name: string) {  if (!cookieCache) {    cookieCache = Object.fromEntries(      document.cookie.split('; ').map(c => c.split('='))    )  }  return cookieCache[name]}
```
```
let cookieCache: Record<string, string> | null = nullfunction getCookie(name: string) {  if (!cookieCache) {    cookieCache = Object.fromEntries(      document.cookie.split('; ').map(c => c.split('='))    )  }  return cookieCache[name]}
```
```
window.addEventListener('storage', (e) => {  if (e.key) storageCache.delete(e.key)})document.addEventListener('visibilitychange', () => {  if (document.visibilityState === 'visible') {    storageCache.clear()  }})
```
```
window.addEventListener('storage', (e) => {  if (e.key) storageCache.delete(e.key)})document.addEventListener('visibilitychange', () => {  if (document.visibilityState === 'visible') {    storageCache.clear()  }})
```

