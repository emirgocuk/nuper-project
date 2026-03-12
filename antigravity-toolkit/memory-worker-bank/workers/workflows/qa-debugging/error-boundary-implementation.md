# Error Boundary Implementation
Source: https://antigravity.codes/workflows/qa-debugging/implement-react-error-boundary-fallback-ui

## AI Worker Instructions
When the user requests functionality related to Error Boundary Implementation, follow these guidelines and utilize this context.

## Scraped Content

# Error Boundary Implementation
```
src/components/ErrorBoundary.tsx
```
```
'use client';   import React, { Component, ReactNode } from 'react';   interface Props {     children: ReactNode;     fallback?: ReactNode;   }      interface State {     hasError: boolean;   }   class ErrorBoundary extends Component<Props, State> {     constructor(props: Props) {       super(props);       this.state = { hasError: false };     }          static getDerivedStateFromError(_: Error): State {       return { hasError: true };     }          componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {       console.error('ErrorBoundary caught:', error, errorInfo);     }          render() {       if (this.state.hasError) {         return this.props.fallback || (           <div className="p-8 text-center">             <h1 className="text-2xl font-bold">Something went wrong</h1>             <button onClick={() => this.setState({ hasError: false })}>               Try again             </button>           </div>         );       }       return this.props.children;     }   }      export default ErrorBoundary;
```
```
'use client';   import React, { Component, ReactNode } from 'react';   interface Props {     children: ReactNode;     fallback?: ReactNode;   }      interface State {     hasError: boolean;   }   class ErrorBoundary extends Component<Props, State> {     constructor(props: Props) {       super(props);       this.state = { hasError: false };     }          static getDerivedStateFromError(_: Error): State {       return { hasError: true };     }          componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {       console.error('ErrorBoundary caught:', error, errorInfo);     }          render() {       if (this.state.hasError) {         return this.props.fallback || (           <div className="p-8 text-center">             <h1 className="text-2xl font-bold">Something went wrong</h1>             <button onClick={() => this.setState({ hasError: false })}>               Try again             </button>           </div>         );       }       return this.props.children;     }   }      export default ErrorBoundary;
```
```
layout.tsx
```
```
<ErrorBoundary>     {children}   </ErrorBoundary>
```
```
<ErrorBoundary>     {children}   </ErrorBoundary>
```
```
error.tsx
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as implement-react-error-boundary-fallback-ui.md
```
implement-react-error-boundary-fallback-ui.md
```
- In Antigravity, type /implement_react_error_boundary_fallback_ui or just describe what you want to do
```
/implement_react_error_boundary_fallback_ui
```
Learn more about workflows →

# Related Workflows

# React Performance Profiling

# Debug Memory Leaks in React

# Simulate Slow Network

