# Use Transitions for Non-Urgent Updates
Source: https://antigravity.codes/agent-skills/rerender/rerender-transitions

## AI Worker Instructions
When the user requests functionality related to Use Transitions for Non-Urgent Updates, follow these guidelines and utilize this context.

## Scraped Content

# Use Transitions for Non-Urgent Updates
```
function ScrollTracker() {  const [scrollY, setScrollY] = useState(0)  useEffect(() => {    const handler = () => setScrollY(window.scrollY)    window.addEventListener('scroll', handler, { passive: true })    return () => window.removeEventListener('scroll', handler)  }, [])}
```
```
function ScrollTracker() {  const [scrollY, setScrollY] = useState(0)  useEffect(() => {    const handler = () => setScrollY(window.scrollY)    window.addEventListener('scroll', handler, { passive: true })    return () => window.removeEventListener('scroll', handler)  }, [])}
```
```
import { startTransition } from 'react'function ScrollTracker() {  const [scrollY, setScrollY] = useState(0)  useEffect(() => {    const handler = () => {      startTransition(() => setScrollY(window.scrollY))    }    window.addEventListener('scroll', handler, { passive: true })    return () => window.removeEventListener('scroll', handler)  }, [])}
```
```
import { startTransition } from 'react'function ScrollTracker() {  const [scrollY, setScrollY] = useState(0)  useEffect(() => {    const handler = () => {      startTransition(() => setScrollY(window.scrollY))    }    window.addEventListener('scroll', handler, { passive: true })    return () => window.removeEventListener('scroll', handler)  }, [])}
```

