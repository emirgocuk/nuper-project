# Strategic Suspense Boundaries
Source: https://antigravity.codes/agent-skills/async/async-suspense-boundaries

## AI Worker Instructions
When the user requests functionality related to Strategic Suspense Boundaries, follow these guidelines and utilize this context.

## Scraped Content

# Strategic Suspense Boundaries
```
async function Page() {  const data = await fetchData() // Blocks entire page    return (    <div>      <div>Sidebar</div>      <div>Header</div>      <div>        <DataDisplay data={data} />      </div>      <div>Footer</div>    </div>  )}
```
```
async function Page() {  const data = await fetchData() // Blocks entire page    return (    <div>      <div>Sidebar</div>      <div>Header</div>      <div>        <DataDisplay data={data} />      </div>      <div>Footer</div>    </div>  )}
```
```
function Page() {  return (    <div>      <div>Sidebar</div>      <div>Header</div>      <div>        <Suspense fallback={<Skeleton />}>          <DataDisplay />        </Suspense>      </div>      <div>Footer</div>    </div>  )}async function DataDisplay() {  const data = await fetchData() // Only blocks this component  return <div>{data.content}</div>}
```
```
function Page() {  return (    <div>      <div>Sidebar</div>      <div>Header</div>      <div>        <Suspense fallback={<Skeleton />}>          <DataDisplay />        </Suspense>      </div>      <div>Footer</div>    </div>  )}async function DataDisplay() {  const data = await fetchData() // Only blocks this component  return <div>{data.content}</div>}
```
```
function Page() {  // Start fetch immediately, but don't await  const dataPromise = fetchData()    return (    <div>      <div>Sidebar</div>      <div>Header</div>      <Suspense fallback={<Skeleton />}>        <DataDisplay dataPromise={dataPromise} />        <DataSummary dataPromise={dataPromise} />      </Suspense>      <div>Footer</div>    </div>  )}function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {  const data = use(dataPromise) // Unwraps the promise  return <div>{data.content}</div>}function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {  const data = use(dataPromise) // Reuses the same promise  return <div>{data.summary}</div>}
```
```
function Page() {  // Start fetch immediately, but don't await  const dataPromise = fetchData()    return (    <div>      <div>Sidebar</div>      <div>Header</div>      <Suspense fallback={<Skeleton />}>        <DataDisplay dataPromise={dataPromise} />        <DataSummary dataPromise={dataPromise} />      </Suspense>      <div>Footer</div>    </div>  )}function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {  const data = use(dataPromise) // Unwraps the promise  return <div>{data.content}</div>}function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {  const data = use(dataPromise) // Reuses the same promise  return <div>{data.summary}</div>}
```

