# Hoist Static JSX Elements
Source: https://antigravity.codes/agent-skills/rendering/rendering-hoist-jsx

## AI Worker Instructions
When the user requests functionality related to Hoist Static JSX Elements, follow these guidelines and utilize this context.

## Scraped Content

# Hoist Static JSX Elements
```
function LoadingSkeleton() {  return <div className="animate-pulse h-20 bg-gray-200" />}function Container() {  return (    <div>      {loading && <LoadingSkeleton />}    </div>  )}
```
```
function LoadingSkeleton() {  return <div className="animate-pulse h-20 bg-gray-200" />}function Container() {  return (    <div>      {loading && <LoadingSkeleton />}    </div>  )}
```
```
const loadingSkeleton = (  <div className="animate-pulse h-20 bg-gray-200" />)function Container() {  return (    <div>      {loading && loadingSkeleton}    </div>  )}
```
```
const loadingSkeleton = (  <div className="animate-pulse h-20 bg-gray-200" />)function Container() {  return (    <div>      {loading && loadingSkeleton}    </div>  )}
```

