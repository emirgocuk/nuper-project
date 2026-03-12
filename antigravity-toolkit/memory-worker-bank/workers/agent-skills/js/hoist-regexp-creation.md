# Hoist RegExp Creation
Source: https://antigravity.codes/agent-skills/js/js-hoist-regexp

## AI Worker Instructions
When the user requests functionality related to Hoist RegExp Creation, follow these guidelines and utilize this context.

## Scraped Content

# Hoist RegExp Creation
```
useMemo()
```
```
function Highlighter({ text, query }: Props) {  const regex = new RegExp((${query}), 'gi')  const parts = text.split(regex)  return <>{parts.map((part, i) => ...)}</>}
```
```
function Highlighter({ text, query }: Props) {  const regex = new RegExp((${query}), 'gi')  const parts = text.split(regex)  return <>{parts.map((part, i) => ...)}</>}
```
```
(${query})
```
```
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/function Highlighter({ text, query }: Props) {  const regex = useMemo(    () => new RegExp((${escapeRegex(query)}), 'gi'),    [query]  )  const parts = text.split(regex)  return <>{parts.map((part, i) => ...)}</>}
```
```
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/function Highlighter({ text, query }: Props) {  const regex = useMemo(    () => new RegExp((${escapeRegex(query)}), 'gi'),    [query]  )  const parts = text.split(regex)  return <>{parts.map((part, i) => ...)}</>}
```
```
(${escapeRegex(query)})
```
```
/g
```
```
lastIndex
```
```
const regex = /foo/gregex.test('foo')  // true, lastIndex = 3regex.test('foo')  // false, lastIndex = 0
```
```
const regex = /foo/gregex.test('foo')  // true, lastIndex = 3regex.test('foo')  // false, lastIndex = 0
```

