# CSS content-visibility for Long Lists
Source: https://antigravity.codes/agent-skills/rendering/rendering-content-visibility

## AI Worker Instructions
When the user requests functionality related to CSS content-visibility for Long Lists, follow these guidelines and utilize this context.

## Scraped Content

# CSS content-visibility for Long Lists
```
content-visibility: auto
```
```
.message-item {  content-visibility: auto;  contain-intrinsic-size: 0 80px;}
```
```
.message-item {  content-visibility: auto;  contain-intrinsic-size: 0 80px;}
```
```
function MessageList({ messages }: { messages: Message[] }) {  return (    <div className="overflow-y-auto h-screen">      {messages.map(msg => (        <div key={msg.id} className="message-item">          <Avatar user={msg.author} />          <div>{msg.content}</div>        </div>      ))}    </div>  )}
```
```
function MessageList({ messages }: { messages: Message[] }) {  return (    <div className="overflow-y-auto h-screen">      {messages.map(msg => (        <div key={msg.id} className="message-item">          <Avatar user={msg.author} />          <div>{msg.content}</div>        </div>      ))}    </div>  )}
```

