# Conditional Module Loading
Source: https://antigravity.codes/agent-skills/bundle/bundle-conditional

## AI Worker Instructions
When the user requests functionality related to Conditional Module Loading, follow these guidelines and utilize this context.

## Scraped Content

# Conditional Module Loading
```
function AnimationPlayer({ enabled }: { enabled: boolean }) {  const [frames, setFrames] = useState<Frame[] | null>(null)  useEffect(() => {    if (enabled && !frames && typeof window !== 'undefined') {      import('./animation-frames.js')        .then(mod => setFrames(mod.frames))        .catch(() => setEnabled(false))    }  }, [enabled, frames])  if (!frames) return <Skeleton />  return <Canvas frames={frames} />}
```
```
function AnimationPlayer({ enabled }: { enabled: boolean }) {  const [frames, setFrames] = useState<Frame[] | null>(null)  useEffect(() => {    if (enabled && !frames && typeof window !== 'undefined') {      import('./animation-frames.js')        .then(mod => setFrames(mod.frames))        .catch(() => setEnabled(false))    }  }, [enabled, frames])  if (!frames) return <Skeleton />  return <Canvas frames={frames} />}
```
```
typeof window !== 'undefined'
```

