# Use Explicit Conditional Rendering
Source: https://antigravity.codes/agent-skills/rendering/rendering-conditional-render

## AI Worker Instructions
When the user requests functionality related to Use Explicit Conditional Rendering, follow these guidelines and utilize this context.

## Scraped Content

# Use Explicit Conditional Rendering
```
? :
```
```
&&
```
```
0
```
```
NaN
```
```
function Badge({ count }: { count: number }) {  return (    <div>      {count && <span className="badge">{count}</span>}    </div>  )}// When count = 0, renders: <div>0</div>// When count = 5, renders: <div><span class="badge">5</span></div>
```
```
function Badge({ count }: { count: number }) {  return (    <div>      {count && <span className="badge">{count}</span>}    </div>  )}// When count = 0, renders: <div>0</div>// When count = 5, renders: <div><span class="badge">5</span></div>
```
```
function Badge({ count }: { count: number }) {  return (    <div>      {count > 0 ? <span className="badge">{count}</span> : null}    </div>  )}// When count = 0, renders: <div></div>// When count = 5, renders: <div><span class="badge">5</span></div>
```
```
function Badge({ count }: { count: number }) {  return (    <div>      {count > 0 ? <span className="badge">{count}</span> : null}    </div>  )}// When count = 0, renders: <div></div>// When count = 5, renders: <div><span class="badge">5</span></div>
```

