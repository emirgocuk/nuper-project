# Dynamic Imports for Heavy Components
Source: https://antigravity.codes/agent-skills/bundle/bundle-dynamic-imports

## AI Worker Instructions
When the user requests functionality related to Dynamic Imports for Heavy Components, follow these guidelines and utilize this context.

## Scraped Content

# Dynamic Imports for Heavy Components
```
next/dynamic
```
```
import { MonacoEditor } from './monaco-editor'function CodePanel({ code }: { code: string }) {  return <MonacoEditor value={code} />}
```
```
import { MonacoEditor } from './monaco-editor'function CodePanel({ code }: { code: string }) {  return <MonacoEditor value={code} />}
```
```
import dynamic from 'next/dynamic'const MonacoEditor = dynamic(  () => import('./monaco-editor').then(m => m.MonacoEditor),  { ssr: false })function CodePanel({ code }: { code: string }) {  return <MonacoEditor value={code} />}
```
```
import dynamic from 'next/dynamic'const MonacoEditor = dynamic(  () => import('./monaco-editor').then(m => m.MonacoEditor),  { ssr: false })function CodePanel({ code }: { code: string }) {  return <MonacoEditor value={code} />}
```

