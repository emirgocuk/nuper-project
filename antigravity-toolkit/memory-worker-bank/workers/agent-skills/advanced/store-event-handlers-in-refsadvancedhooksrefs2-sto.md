# Store Event Handlers in Ref


sadvancedhooksrefs+2## Store Event Handlers in Refs  Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.  **Incorrect (re-subscribes on every render):**  ```tsx function useWindowEvent(event: string, handler: () => void) {   useEffect(() => {     window.addEventListener(event, ...
Source: https://antigravity.codes/agent-skills/advanced/advanced-event-handler-refs

## AI Worker Instructions
When the user requests functionality related to Store Event Handlers in Refsadvancedhooksrefs+2## Store Event Handlers in Refs  Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.  **Incorrect (re-subscribes on every render):**  ```tsx function useWindowEvent(event: string, handler: () => void) {   useEffect(() => {     window.addEventListener(event, ..., follow these guidelines and utilize this context.

## Scraped Content

# Store Event Handlers in Refs
```
function useWindowEvent(event: string, handler: () => void) {  useEffect(() => {    window.addEventListener(event, handler)    return () => window.removeEventListener(event, handler)  }, [event, handler])}
```
```
function useWindowEvent(event: string, handler: () => void) {  useEffect(() => {    window.addEventListener(event, handler)    return () => window.removeEventListener(event, handler)  }, [event, handler])}
```
```
function useWindowEvent(event: string, handler: () => void) {  const handlerRef = useRef(handler)  useEffect(() => {    handlerRef.current = handler  }, [handler])  useEffect(() => {    const listener = () => handlerRef.current()    window.addEventListener(event, listener)    return () => window.removeEventListener(event, listener)  }, [event])}
```
```
function useWindowEvent(event: string, handler: () => void) {  const handlerRef = useRef(handler)  useEffect(() => {    handlerRef.current = handler  }, [handler])  useEffect(() => {    const listener = () => handlerRef.current()    window.addEventListener(event, listener)    return () => window.removeEventListener(event, listener)  }, [event])}
```
```
useEffectEvent
```
```
import { useEffectEvent } from 'react'function useWindowEvent(event: string, handler: () => void) {  const onEvent = useEffectEvent(handler)  useEffect(() => {    window.addEventListener(event, onEvent)    return () => window.removeEventListener(event, onEvent)  }, [event])}
```
```
import { useEffectEvent } from 'react'function useWindowEvent(event: string, handler: () => void) {  const onEvent = useEffectEvent(handler)  useEffect(() => {    window.addEventListener(event, onEvent)    return () => window.removeEventListener(event, onEvent)  }, [event])}
```
```
useEffectEvent
```

