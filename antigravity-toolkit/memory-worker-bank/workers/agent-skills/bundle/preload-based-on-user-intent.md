# Preload Based on User Intent
Source: https://antigravity.codes/agent-skills/bundle/bundle-preload

## AI Worker Instructions
When the user requests functionality related to Preload Based on User Intent, follow these guidelines and utilize this context.

## Scraped Content

# Preload Based on User Intent
```
function EditorButton({ onClick }: { onClick: () => void }) {  const preload = () => {    if (typeof window !== 'undefined') {      void import('./monaco-editor')    }  }  return (    <button      onMouseEnter={preload}      onFocus={preload}      onClick={onClick}    >      Open Editor    </button>  )}
```
```
function EditorButton({ onClick }: { onClick: () => void }) {  const preload = () => {    if (typeof window !== 'undefined') {      void import('./monaco-editor')    }  }  return (    <button      onMouseEnter={preload}      onFocus={preload}      onClick={onClick}    >      Open Editor    </button>  )}
```
```
function FlagsProvider({ children, flags }: Props) {  useEffect(() => {    if (flags.editorEnabled && typeof window !== 'undefined') {      void import('./monaco-editor').then(mod => mod.init())    }  }, [flags.editorEnabled])  return <FlagsContext.Provider value={flags}>    {children}  </FlagsContext.Provider>}
```
```
function FlagsProvider({ children, flags }: Props) {  useEffect(() => {    if (flags.editorEnabled && typeof window !== 'undefined') {      void import('./monaco-editor').then(mod => mod.init())    }  }, [flags.editorEnabled])  return <FlagsContext.Provider value={flags}>    {children}  </FlagsContext.Provider>}
```
```
typeof window !== 'undefined'
```

