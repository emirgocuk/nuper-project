# Defer State Reads to Usage Point
Source: https://antigravity.codes/agent-skills/rerender/rerender-defer-reads

## AI Worker Instructions
When the user requests functionality related to Defer State Reads to Usage Point, follow these guidelines and utilize this context.

## Scraped Content

# Defer State Reads to Usage Point
```
function ShareButton({ chatId }: { chatId: string }) {  const searchParams = useSearchParams()  const handleShare = () => {    const ref = searchParams.get('ref')    shareChat(chatId, { ref })  }  return <button onClick={handleShare}>Share</button>}
```
```
function ShareButton({ chatId }: { chatId: string }) {  const searchParams = useSearchParams()  const handleShare = () => {    const ref = searchParams.get('ref')    shareChat(chatId, { ref })  }  return <button onClick={handleShare}>Share</button>}
```
```
function ShareButton({ chatId }: { chatId: string }) {  const handleShare = () => {    const params = new URLSearchParams(window.location.search)    const ref = params.get('ref')    shareChat(chatId, { ref })  }  return <button onClick={handleShare}>Share</button>}
```
```
function ShareButton({ chatId }: { chatId: string }) {  const handleShare = () => {    const params = new URLSearchParams(window.location.search)    const ref = params.get('ref')    shareChat(chatId, { ref })  }  return <button onClick={handleShare}>Share</button>}
```

