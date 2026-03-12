# Parallel Data Fetching with Component Composition
Source: https://antigravity.codes/agent-skills/server/server-parallel-fetching

## AI Worker Instructions
When the user requests functionality related to Parallel Data Fetching with Component Composition, follow these guidelines and utilize this context.

## Scraped Content

# Parallel Data Fetching with Component Composition
```
export default async function Page() {  const header = await fetchHeader()  return (    <div>      <div>{header}</div>      <Sidebar />    </div>  )}async function Sidebar() {  const items = await fetchSidebarItems()  return <nav>{items.map(renderItem)}</nav>}
```
```
export default async function Page() {  const header = await fetchHeader()  return (    <div>      <div>{header}</div>      <Sidebar />    </div>  )}async function Sidebar() {  const items = await fetchSidebarItems()  return <nav>{items.map(renderItem)}</nav>}
```
```
async function Header() {  const data = await fetchHeader()  return <div>{data}</div>}async function Sidebar() {  const items = await fetchSidebarItems()  return <nav>{items.map(renderItem)}</nav>}export default function Page() {  return (    <div>      <Header />      <Sidebar />    </div>  )}
```
```
async function Header() {  const data = await fetchHeader()  return <div>{data}</div>}async function Sidebar() {  const items = await fetchSidebarItems()  return <nav>{items.map(renderItem)}</nav>}export default function Page() {  return (    <div>      <Header />      <Sidebar />    </div>  )}
```
```
async function Layout({ children }: { children: ReactNode }) {  const header = await fetchHeader()  return (    <div>      <div>{header}</div>      {children}    </div>  )}async function Sidebar() {  const items = await fetchSidebarItems()  return <nav>{items.map(renderItem)}</nav>}export default function Page() {  return (    <Layout>      <Sidebar />    </Layout>  )}
```
```
async function Layout({ children }: { children: ReactNode }) {  const header = await fetchHeader()  return (    <div>      <div>{header}</div>      {children}    </div>  )}async function Sidebar() {  const items = await fetchSidebarItems()  return <nav>{items.map(renderItem)}</nav>}export default function Page() {  return (    <Layout>      <Sidebar />    </Layout>  )}
```

