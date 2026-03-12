# Defer Non-Critical Third-Party Libraries
Source: https://antigravity.codes/agent-skills/bundle/bundle-defer-third-party

## AI Worker Instructions
When the user requests functionality related to Defer Non-Critical Third-Party Libraries, follow these guidelines and utilize this context.

## Scraped Content

# Defer Non-Critical Third-Party Libraries
```
import { Analytics } from '@vercel/analytics/react'export default function RootLayout({ children }) {  return (    <html>      <body>        {children}        <Analytics />      </body>    </html>  )}
```
```
import { Analytics } from '@vercel/analytics/react'export default function RootLayout({ children }) {  return (    <html>      <body>        {children}        <Analytics />      </body>    </html>  )}
```
```
import dynamic from 'next/dynamic'const Analytics = dynamic(  () => import('@vercel/analytics/react').then(m => m.Analytics),  { ssr: false })export default function RootLayout({ children }) {  return (    <html>      <body>        {children}        <Analytics />      </body>    </html>  )}
```
```
import dynamic from 'next/dynamic'const Analytics = dynamic(  () => import('@vercel/analytics/react').then(m => m.Analytics),  { ssr: false })export default function RootLayout({ children }) {  return (    <html>      <body>        {children}        <Analytics />      </body>    </html>  )}
```

