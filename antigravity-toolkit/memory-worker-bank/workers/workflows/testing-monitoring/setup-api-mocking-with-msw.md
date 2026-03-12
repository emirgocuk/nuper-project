# Setup API Mocking with MSW
Source: https://antigravity.codes/workflows/testing-monitoring/setup-api-mocking-msw-service-worker

## AI Worker Instructions
When the user requests functionality related to Setup API Mocking with MSW, follow these guidelines and utilize this context.

## Scraped Content

# Setup API Mocking with MSW
```
npm install --save-dev msw@latest
```
```
npx msw init public/ --save
```
```
// mocks/handlers.ts   import { http, HttpResponse } from 'msw';      export const handlers = [     http.get('/api/user', () => {       return HttpResponse.json({         id: '1',         name: 'John Doe',         email: 'john@example.com',       });     }),          http.post('/api/login', async ({ request }) => {       const { email } = await request.json() as { email: string };              if (email === 'test@example.com') {         return HttpResponse.json({ token: 'fake-jwt-token' });       }              return new HttpResponse(null, { status: 401 });     }),   ];
```
```
// mocks/handlers.ts   import { http, HttpResponse } from 'msw';      export const handlers = [     http.get('/api/user', () => {       return HttpResponse.json({         id: '1',         name: 'John Doe',         email: 'john@example.com',       });     }),          http.post('/api/login', async ({ request }) => {       const { email } = await request.json() as { email: string };              if (email === 'test@example.com') {         return HttpResponse.json({ token: 'fake-jwt-token' });       }              return new HttpResponse(null, { status: 401 });     }),   ];
```
```
// mocks/browser.ts   import { setupWorker } from 'msw/browser';   import { handlers } from './handlers';      export const worker = setupWorker(...handlers);
```
```
// mocks/browser.ts   import { setupWorker } from 'msw/browser';   import { handlers } from './handlers';      export const worker = setupWorker(...handlers);
```
```
// app/msw-provider.tsx   'use client'   import { useEffect, useState } from 'react';      export function MSWProvider({ children }: { children: React.ReactNode }) {     const [mswReady, setMswReady] = useState(false);        useEffect(() => {       async function init() {         if (process.env.NODE_ENV === 'development') {           const { worker } = await import('../mocks/browser');           await worker.start({             onUnhandledRequest: 'bypass',           });           setMswReady(true);         } else {           setMswReady(true);         }       }          init();     }, []);        if (!mswReady) return null;     return <>{children}</>;   }
```
```
// app/msw-provider.tsx   'use client'   import { useEffect, useState } from 'react';      export function MSWProvider({ children }: { children: React.ReactNode }) {     const [mswReady, setMswReady] = useState(false);        useEffect(() => {       async function init() {         if (process.env.NODE_ENV === 'development') {           const { worker } = await import('../mocks/browser');           await worker.start({             onUnhandledRequest: 'bypass',           });           setMswReady(true);         } else {           setMswReady(true);         }       }          init();     }, []);        if (!mswReady) return null;     return <>{children}</>;   }
```
```
// app/layout.tsx   import { MSWProvider } from './msw-provider';      export default function RootLayout({ children }) {     return (       <html>         <body>           <MSWProvider>{children}</MSWProvider>         </body>       </html>     );   }
```
```
// app/layout.tsx   import { MSWProvider } from './msw-provider';      export default function RootLayout({ children }) {     return (       <html>         <body>           <MSWProvider>{children}</MSWProvider>         </body>       </html>     );   }
```
```
// vitest.setup.ts   import { afterAll, afterEach, beforeAll } from 'vitest';   import { setupServer } from 'msw/node';   import { handlers } from './mocks/handlers';      const server = setupServer(...handlers);      beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));   afterEach(() => server.resetHandlers());   afterAll(() => server.close());
```
```
// vitest.setup.ts   import { afterAll, afterEach, beforeAll } from 'vitest';   import { setupServer } from 'msw/node';   import { handlers } from './mocks/handlers';      const server = setupServer(...handlers);      beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));   afterEach(() => server.resetHandlers());   afterAll(() => server.close());
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-api-mocking-msw-service-worker.md
```
setup-api-mocking-msw-service-worker.md
```
- In Antigravity, type /setup_api_mocking_msw_service_worker or just describe what you want to do
```
/setup_api_mocking_msw_service_worker
```
Learn more about workflows →

# Related Workflows

# Setup Storybook for Components

# Setup Sentry Error Tracking

