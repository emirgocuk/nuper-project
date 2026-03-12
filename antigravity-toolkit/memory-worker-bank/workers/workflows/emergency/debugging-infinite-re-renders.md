# Debugging Infinite Re-renders
Source: https://antigravity.codes/workflows/emergency/debug-react-infinite-rerenders-useeffect-loop

## AI Worker Instructions
When the user requests functionality related to Debugging Infinite Re-renders, follow these guidelines and utilize this context.

## Scraped Content

# Debugging Infinite Re-renders
```
useEffect
```
```
useEffect
```
```
useEffect(() => {       setCount(count + 1);     }, [count]); // Depends on 'count' -> Infinite Loop!
```
```
useEffect(() => {       setCount(count + 1);     }, [count]); // Depends on 'count' -> Infinite Loop!
```
```
useMemo
```
```
const options = useMemo(() => ({ id: 1 }), []);
```
```
const options = useMemo(() => ({ id: 1 }), []);
```
```
useTraceUpdate
```
```
function useTraceUpdate(props) {     const prev = useRef(props);     useEffect(() => {       const changedProps = Object.entries(props).reduce((ps, [k, v]) => {         if (prev.current[k] !== v) ps[k] = [prev.current[k], v];         return ps;       }, {});       if (Object.keys(changedProps).length > 0) {         console.log('Changed props:', changedProps);       }       prev.current = props;     });   }
```
```
function useTraceUpdate(props) {     const prev = useRef(props);     useEffect(() => {       const changedProps = Object.entries(props).reduce((ps, [k, v]) => {         if (prev.current[k] !== v) ps[k] = [prev.current[k], v];         return ps;       }, {});       if (Object.keys(changedProps).length > 0) {         console.log('Changed props:', changedProps);       }       prev.current = props;     });   }
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as debug-react-infinite-rerenders-useeffect-loop.md
```
debug-react-infinite-rerenders-useeffect-loop.md
```
- In Antigravity, type /debug_react_infinite_rerenders_useeffect_loop or just describe what you want to do
```
/debug_react_infinite_rerenders_useeffect_loop
```
Learn more about workflows →

# Related Workflows

# Fix Next.js Hydration Errors

# Nuke & Reinstall

