# cloudflare-workflows
Source: https://antigravity.codes/agent-skills/workflow/cloudflare-workflows

## AI Worker Instructions
When the user requests functionality related to cloudflare-workflows, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-workflows
```
# 1. Scaffold projectnpm create cloudflare@latest my-workflow -- --template cloudflare/workflows-starter --git --deploy falsecd my-workflow# 2. Configure wrangler.jsonc{  "name": "my-workflow",  "main": "src/index.ts",  "compatibility_date": "2025-11-25",  "workflows": [{    "name": "my-workflow",    "binding": "MY_WORKFLOW",    "class_name": "MyWorkflow"  }]}# 3. Create workflow (src/index.ts)import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    const result = await step.do('process', async () => { /* work */ });    await step.sleep('wait', '1 hour');    await step.do('continue', async () => { /* more work */ });  }}# 4. Deploy and testnpm run deploynpx wrangler workflows instances list my-workflow
```
```
# 1. Scaffold projectnpm create cloudflare@latest my-workflow -- --template cloudflare/workflows-starter --git --deploy falsecd my-workflow# 2. Configure wrangler.jsonc{  "name": "my-workflow",  "main": "src/index.ts",  "compatibility_date": "2025-11-25",  "workflows": [{    "name": "my-workflow",    "binding": "MY_WORKFLOW",    "class_name": "MyWorkflow"  }]}# 3. Create workflow (src/index.ts)import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    const result = await step.do('process', async () => { /* work */ });    await step.sleep('wait', '1 hour');    await step.do('continue', async () => { /* more work */ });  }}# 4. Deploy and testnpm run deploynpx wrangler workflows instances list my-workflow
```
```
WorkflowEntrypoint
```
```
run()
```
```
step
```
```
waitForEvent()
```
```
waitForEvent()
```
```
wrangler dev
```
```
waitForEvent()
```
```
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    for (let i = 0; i < 3; i++) {      try {        const evt = await step.waitForEvent(wait-${i}, {          type: 'user-action',          timeout: '5 seconds'        });        console.log(Iteration ${i}: Received event);      } catch {        console.log(Iteration ${i}: Timeout);      }    }  }}// In wrangler dev:// - Iteration 1: ✅ receives event// - Iteration 2: ⏱️ times out (expected)// - Iteration 3: ❌ does not receive event (BUG - event is sent but ignored)
```
```
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    for (let i = 0; i < 3; i++) {      try {        const evt = await step.waitForEvent(wait-${i}, {          type: 'user-action',          timeout: '5 seconds'        });        console.log(Iteration ${i}: Received event);      } catch {        console.log(Iteration ${i}: Timeout);      }    }  }}// In wrangler dev:// - Iteration 1: ✅ receives event// - Iteration 2: ⏱️ times out (expected)// - Iteration 3: ❌ does not receive event (BUG - event is sent but ignored)
```
```
wait-${i}
```
```
Iteration ${i}: Received event
```
```
Iteration ${i}: Timeout
```
```
MiniflareCoreError [ERR_RUNTIME_FAILURE]: The Workers runtime failed to start
```
```
getPlatformProxy()
```
```
wrangler
```
```
getPlatformProxy()
```
```
wrangler.cli.jsonc
```
```
// Workaround: Separate config for CLI scripts// wrangler.cli.jsonc (no workflows){  "name": "my-worker",  "main": "src/index.ts",  "compatibility_date": "2025-01-20"  // workflows commented out}// Use in script:import { getPlatformProxy } from 'wrangler';const { env } = await getPlatformProxy({ configPath: './wrangler.cli.jsonc' });
```
```
// Workaround: Separate config for CLI scripts// wrangler.cli.jsonc (no workflows){  "name": "my-worker",  "main": "src/index.ts",  "compatibility_date": "2025-01-20"  // workflows commented out}// Use in script:import { getPlatformProxy } from 'wrangler';const { env } = await getPlatformProxy({ configPath: './wrangler.cli.jsonc' });
```
```
instance.not_found
```
```
wrangler dev
```
```
workflow.create()
```
```
ctx.waitUntil()
```
```
export default {  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {    const workflow = await env.MY_WORKFLOW.create({ params: { userId: '123' } });    // ✅ Ensure workflow initialization completes    ctx.waitUntil(workflow.status());    return Response.redirect('/dashboard', 302);  }};
```
```
export default {  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {    const workflow = await env.MY_WORKFLOW.create({ params: { userId: '123' } });    // ✅ Ensure workflow initialization completes    ctx.waitUntil(workflow.status());    return Response.redirect('/dashboard', 302);  }};
```
```
[vitest-worker]: Timeout calling "resolveId"
```
```
@cloudflare/vitest-pool-workers
```
```
testTimeout
```
```
export default defineWorkersConfig({     test: {       testTimeout: 60_000 // Default: 5000ms     }   });
```
```
export default defineWorkersConfig({     test: {       testTimeout: 60_000 // Default: 5000ms     }   });
```
```
isolatedStorage: false
```
```
Error: Not implemented yet
```
```
instance.restart()
```
```
instance.terminate()
```
```
wrangler dev
```
```
running
```
```
const instance = await env.MY_WORKFLOW.get(instanceId);// ❌ Fails in wrangler devawait instance.restart();    // Error: Not implemented yetawait instance.terminate();  // Error: Not implemented yet// ✅ Works in production
```
```
const instance = await env.MY_WORKFLOW.get(instanceId);// ❌ Fails in wrangler devawait instance.restart();    // Error: Not implemented yetawait instance.terminate();  // Error: Not implemented yet// ✅ Works in production
```
```
"Cannot perform I/O on behalf of a different request"
```
```
step.do()
```
```
// ❌ Bad - I/O outside stepconst response = await fetch('https://api.example.com/data');const data = await response.json();await step.do('use data', async () => {  return data;  // This will fail!});// ✅ Good - I/O inside stepconst data = await step.do('fetch data', async () => {  const response = await fetch('https://api.example.com/data');  return await response.json();});
```
```
// ❌ Bad - I/O outside stepconst response = await fetch('https://api.example.com/data');const data = await response.json();await step.do('use data', async () => {  return data;  // This will fail!});// ✅ Good - I/O inside stepconst data = await step.do('fetch data', async () => {  const response = await fetch('https://api.example.com/data');  return await response.json();});
```
```
// ❌ Retries in dev, exits in prodthrow new NonRetryableError('');// ✅ Exits in both environmentsthrow new NonRetryableError('Validation failed');
```
```
// ❌ Retries in dev, exits in prodthrow new NonRetryableError('');// ✅ Exits in both environmentsthrow new NonRetryableError('Validation failed');
```
```
step.do()
```
```
step.do()
```
```
// ❌ BAD - In-memory variable lost on hibernationlet counter = 0;export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    counter = await step.do('increment', async () => counter + 1);    await step.sleep('wait', '1 hour'); // ← Hibernates here, in-memory state lost    console.log(counter); // ❌ Will be 0, not 1!  }}// ✅ GOOD - State from step.do() return values persistsexport class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    const counter = await step.do('increment', async () => 1);    await step.sleep('wait', '1 hour');    console.log(counter); // ✅ Still 1  }}
```
```
// ❌ BAD - In-memory variable lost on hibernationlet counter = 0;export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    counter = await step.do('increment', async () => counter + 1);    await step.sleep('wait', '1 hour'); // ← Hibernates here, in-memory state lost    console.log(counter); // ❌ Will be 0, not 1!  }}// ✅ GOOD - State from step.do() return values persistsexport class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    const counter = await step.do('increment', async () => 1);    await step.sleep('wait', '1 hour');    console.log(counter); // ✅ Still 1  }}
```
```
Date.now()
```
```
Math.random()
```
```
// ❌ BAD - Non-deterministic step nameawait step.do(fetch-data-${Date.now()}, async () => {  return await fetchExpensiveData();});// Every execution creates new cache key → step always re-runs// ✅ GOOD - Deterministic step nameawait step.do('fetch-data', async () => {  return await fetchExpensiveData();});// Same cache key → result reused on restart/retry
```
```
// ❌ BAD - Non-deterministic step nameawait step.do(fetch-data-${Date.now()}, async () => {  return await fetchExpensiveData();});// Every execution creates new cache key → step always re-runs// ✅ GOOD - Deterministic step nameawait step.do('fetch-data', async () => {  return await fetchExpensiveData();});// Same cache key → result reused on restart/retry
```
```
fetch-data-${Date.now()}
```
```
step.do()
```
```
// ❌ BAD - Race outside stepconst fastest = await Promise.race([fetchA(), fetchB()]);await step.do('use result', async () => fastest);// On restart: race runs again, different promise might win// ✅ GOOD - Race inside stepconst fastest = await step.do('fetch fastest', async () => {  return await Promise.race([fetchA(), fetchB()]);});// On restart: cached result used, consistent behavior
```
```
// ❌ BAD - Race outside stepconst fastest = await Promise.race([fetchA(), fetchB()]);await step.do('use result', async () => fastest);// On restart: race runs again, different promise might win// ✅ GOOD - Race inside stepconst fastest = await step.do('fetch fastest', async () => {  return await Promise.race([fetchA(), fetchB()]);});// On restart: cached result used, consistent behavior
```
```
step.do()
```
```
step.do()
```
```
// ❌ BAD - Side effect outside stepconsole.log('Workflow started'); // ← Logs multiple times on restartawait step.do('work', async () => { /* work */ });// ✅ GOOD - Side effects inside stepawait step.do('log start', async () => {  console.log('Workflow started'); // ← Logs once (cached)});
```
```
// ❌ BAD - Side effect outside stepconsole.log('Workflow started'); // ← Logs multiple times on restartawait step.do('work', async () => { /* work */ });// ✅ GOOD - Side effects inside stepawait step.do('log start', async () => {  console.log('Workflow started'); // ← Logs once (cached)});
```
```
// ❌ BAD - Charge customer without checkawait step.do('charge', async () => {  return await stripe.charges.create({ amount: 1000, customer: customerId });});// If step times out after charge succeeds, retry charges AGAIN!// ✅ GOOD - Check for existing charge firstawait step.do('charge', async () => {  const existing = await stripe.charges.list({ customer: customerId, limit: 1 });  if (existing.data.length > 0) return existing.data[0]; // Idempotent  return await stripe.charges.create({ amount: 1000, customer: customerId });});
```
```
// ❌ BAD - Charge customer without checkawait step.do('charge', async () => {  return await stripe.charges.create({ amount: 1000, customer: customerId });});// If step times out after charge succeeds, retry charges AGAIN!// ✅ GOOD - Check for existing charge firstawait step.do('charge', async () => {  const existing = await stripe.charges.list({ customer: customerId, limit: 1 });  if (existing.data.length > 0) return existing.data[0]; // Idempotent  return await stripe.charges.create({ amount: 1000, customer: customerId });});
```
```
step.do<T>(name: string, config?: WorkflowStepConfig, callback: () => Promise<T>): Promise<T>
```
```
step.do<T>(name: string, config?: WorkflowStepConfig, callback: () => Promise<T>): Promise<T>
```
```
name
```
```
config
```
```
callback
```
```
const result = await step.do('call API', { retries: { limit: 10, delay: '10s', backoff: 'exponential' }, timeout: '5 min' }, async () => {  return await fetch('https://api.example.com/data').then(r => r.json());});
```
```
const result = await step.do('call API', { retries: { limit: 10, delay: '10s', backoff: 'exponential' }, timeout: '5 min' }, async () => {  return await fetch('https://api.example.com/data').then(r => r.json());});
```
```
step.sleep(name: string, duration: WorkflowDuration): Promise<void>
```
```
step.sleep(name: string, duration: WorkflowDuration): Promise<void>
```
```
name
```
```
duration
```
```
"second"
```
```
"minute"
```
```
"hour"
```
```
"day"
```
```
"week"
```
```
"month"
```
```
"year"
```
```
await step.sleep('wait 5 minutes', '5 minutes');await step.sleep('wait 1 hour', '1 hour');await step.sleep('wait 2 days', '2 days');await step.sleep('wait 30 seconds', 30000);  // milliseconds
```
```
await step.sleep('wait 5 minutes', '5 minutes');await step.sleep('wait 1 hour', '1 hour');await step.sleep('wait 2 days', '2 days');await step.sleep('wait 30 seconds', 30000);  // milliseconds
```
```
step.sleepUntil(name: string, timestamp: Date | number): Promise<void>
```
```
step.sleepUntil(name: string, timestamp: Date | number): Promise<void>
```
```
name
```
```
timestamp
```
```
await step.sleepUntil('wait for launch', new Date('2025-12-25T00:00:00Z'));await step.sleepUntil('wait until time', Date.parse('24 Oct 2024 13:00:00 UTC'));
```
```
await step.sleepUntil('wait for launch', new Date('2025-12-25T00:00:00Z'));await step.sleepUntil('wait until time', Date.parse('24 Oct 2024 13:00:00 UTC'));
```
```
step.waitForEvent<T>(name: string, options: { type: string; timeout?: string | number }): Promise<T>
```
```
step.waitForEvent<T>(name: string, options: { type: string; timeout?: string | number }): Promise<T>
```
```
name
```
```
options.type
```
```
options.timeout
```
```
instance.sendEvent()
```
```
export class PaymentWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    await step.do('create payment', async () => { /* Stripe API */ });    const webhookData = await step.waitForEvent<StripeWebhook>(      'wait for payment confirmation',      { type: 'stripe-webhook', timeout: '1 hour' }    );    if (webhookData.status === 'succeeded') {      await step.do('fulfill order', async () => { /* fulfill */ });    }  }}// Worker sends event to workflowexport default {  async fetch(req: Request, env: Env): Promise<Response> {    if (req.url.includes('/webhook/stripe')) {      const instance = await env.PAYMENT_WORKFLOW.get(instanceId);      await instance.sendEvent({ type: 'stripe-webhook', payload: await req.json() });      return new Response('OK');    }  }};
```
```
export class PaymentWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    await step.do('create payment', async () => { /* Stripe API */ });    const webhookData = await step.waitForEvent<StripeWebhook>(      'wait for payment confirmation',      { type: 'stripe-webhook', timeout: '1 hour' }    );    if (webhookData.status === 'succeeded') {      await step.do('fulfill order', async () => { /* fulfill */ });    }  }}// Worker sends event to workflowexport default {  async fetch(req: Request, env: Env): Promise<Response> {    if (req.url.includes('/webhook/stripe')) {      const instance = await env.PAYMENT_WORKFLOW.get(instanceId);      await instance.sendEvent({ type: 'stripe-webhook', payload: await req.json() });      return new Response('OK');    }  }};
```
```
try {  const event = await step.waitForEvent('wait for user', { type: 'user-submitted', timeout: '10 minutes' });} catch (error) {  await step.do('send reminder', async () => { /* reminder */ });}
```
```
try {  const event = await step.waitForEvent('wait for user', { type: 'user-submitted', timeout: '10 minutes' });} catch (error) {  await step.do('send reminder', async () => { /* reminder */ });}
```
```
interface WorkflowStepConfig {  retries?: {    limit: number;          // Max attempts (Infinity allowed)    delay: string | number; // Delay between retries    backoff?: 'constant' | 'linear' | 'exponential';  };  timeout?: string | number; // Max time per attempt}
```
```
interface WorkflowStepConfig {  retries?: {    limit: number;          // Max attempts (Infinity allowed)    delay: string | number; // Delay between retries    backoff?: 'constant' | 'linear' | 'exponential';  };  timeout?: string | number; // Max time per attempt}
```
```
{ retries: { limit: 5, delay: 10000, backoff: 'exponential' }, timeout: '10 minutes' }
```
```
// Constant: 30s, 30s, 30s{ retries: { limit: 3, delay: '30 seconds', backoff: 'constant' } }// Linear: 1m, 2m, 3m, 4m, 5m{ retries: { limit: 5, delay: '1 minute', backoff: 'linear' } }// Exponential (recommended): 10s, 20s, 40s, 80s, 160s{ retries: { limit: 10, delay: '10 seconds', backoff: 'exponential' }, timeout: '5 minutes' }// Unlimited retries{ retries: { limit: Infinity, delay: '1 minute', backoff: 'exponential' } }// No retries{ retries: { limit: 0 } }
```
```
// Constant: 30s, 30s, 30s{ retries: { limit: 3, delay: '30 seconds', backoff: 'constant' } }// Linear: 1m, 2m, 3m, 4m, 5m{ retries: { limit: 5, delay: '1 minute', backoff: 'linear' } }// Exponential (recommended): 10s, 20s, 40s, 80s, 160s{ retries: { limit: 10, delay: '10 seconds', backoff: 'exponential' }, timeout: '5 minutes' }// Unlimited retries{ retries: { limit: Infinity, delay: '1 minute', backoff: 'exponential' } }// No retries{ retries: { limit: 0 } }
```
```
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';import { NonRetryableError } from 'cloudflare:workflows';export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    await step.do('validate input', async () => {      if (!event.payload.userId) {        throw new NonRetryableError('userId is required');      }      // Validate user exists      const user = await this.env.DB.prepare(        'SELECT * FROM users WHERE id = ?'      ).bind(event.payload.userId).first();      if (!user) {        // Terminal error - retrying won't help        throw new NonRetryableError('User not found');      }      return user;    });  }}
```
```
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';import { NonRetryableError } from 'cloudflare:workflows';export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    await step.do('validate input', async () => {      if (!event.payload.userId) {        throw new NonRetryableError('userId is required');      }      // Validate user exists      const user = await this.env.DB.prepare(        'SELECT * FROM users WHERE id = ?'      ).bind(event.payload.userId).first();      if (!user) {        // Terminal error - retrying won't help        throw new NonRetryableError('User not found');      }      return user;    });  }}
```
```
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    await step.do('process payment', async () => { /* critical */ });    try {      await step.do('send email', async () => { /* optional */ });    } catch (error) {      await step.do('log failure', async () => {        await this.env.DB.prepare('INSERT INTO failed_emails VALUES (?, ?)').bind(event.payload.userId, error.message).run();      });    }    await step.do('update status', async () => { /* continues */ });  }}
```
```
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {    await step.do('process payment', async () => { /* critical */ });    try {      await step.do('send email', async () => { /* optional */ });    } catch (error) {      await step.do('log failure', async () => {        await this.env.DB.prepare('INSERT INTO failed_emails VALUES (?, ?)').bind(event.payload.userId, error.message).run();      });    }    await step.do('update status', async () => { /* continues */ });  }}
```
```
let result;try {  result = await step.do('call primary API', async () => await callPrimaryAPI());} catch {  result = await step.do('call backup API', async () => await callBackupAPI());}
```
```
let result;try {  result = await step.do('call primary API', async () => await callPrimaryAPI());} catch {  result = await step.do('call backup API', async () => await callBackupAPI());}
```
```
{  "workflows": [{    "name": "my-workflow",    "binding": "MY_WORKFLOW",    "class_name": "MyWorkflow",    "script_name": "workflow-worker"  // If workflow in different Worker  }]}
```
```
{  "workflows": [{    "name": "my-workflow",    "binding": "MY_WORKFLOW",    "class_name": "MyWorkflow",    "script_name": "workflow-worker"  // If workflow in different Worker  }]}
```
```
const instance = await env.MY_WORKFLOW.create({ params: { userId: '123' } });return Response.json({ id: instance.id, status: await instance.status() });
```
```
const instance = await env.MY_WORKFLOW.create({ params: { userId: '123' } });return Response.json({ id: instance.id, status: await instance.status() });
```
```
const instance = await env.MY_WORKFLOW.get(instanceId);const status = await instance.status();  // { status: 'running'|'complete'|'errored'|'queued', error, output }await instance.sendEvent({ type: 'user-action', payload: { action: 'approved' } });await instance.pause();await instance.resume();await instance.terminate();
```
```
const instance = await env.MY_WORKFLOW.get(instanceId);const status = await instance.status();  // { status: 'running'|'complete'|'errored'|'queued', error, output }await instance.sendEvent({ type: 'user-action', payload: { action: 'approved' } });await instance.pause();await instance.resume();await instance.terminate();
```
```
step.do()
```
```
string
```
```
number
```
```
boolean
```
```
null
```
```
// ✅ Goodconst result = await step.do('fetch data', async () => ({  users: [{ id: 1, name: 'Alice' }],  timestamp: Date.now(),  metadata: null}));// ❌ Bad - function not serializableconst bad = await step.do('bad', async () => ({ data: [1, 2, 3], transform: (x) => x * 2 }));  // Throws error!
```
```
// ✅ Goodconst result = await step.do('fetch data', async () => ({  users: [{ id: 1, name: 'Alice' }],  timestamp: Date.now(),  metadata: null}));// ❌ Bad - function not serializableconst bad = await step.do('bad', async () => ({ data: [1, 2, 3], transform: (x) => x * 2 }));  // Throws error!
```
```
const userData = await step.do('fetch user', async () => ({ id: 123, email: 'user@example.com' }));const orderData = await step.do('create order', async () => ({ userId: userData.id, orderId: 'ORD-456' }));await step.do('send email', async () => sendEmail({ to: userData.email, subject: Order ${orderData.orderId} }));
```
```
const userData = await step.do('fetch user', async () => ({ id: 123, email: 'user@example.com' }));const orderData = await step.do('create order', async () => ({ userId: userData.id, orderId: 'ORD-456' }));await step.do('send email', async () => sendEmail({ to: userData.email, subject: Order ${orderData.orderId} }));
```
```
Order ${orderData.orderId}
```
```
const instance = await env.MY_WORKFLOW.get(instanceId);const status = await instance.status();console.log(status);// {//   status: 'complete' | 'running' | 'errored' | 'queued' | 'waiting' | 'unknown',//   error: string | null,//   output: { userId: '123', status: 'processed' }// }
```
```
const instance = await env.MY_WORKFLOW.get(instanceId);const status = await instance.status();console.log(status);// {//   status: 'complete' | 'running' | 'errored' | 'queued' | 'waiting' | 'unknown',//   error: string | null,//   output: { userId: '123', status: 'processed' }// }
```
```
// wrangler.jsonc{ "limits": { "cpu_ms": 300000 } }  // 5 minutes max (default: 30 seconds)
```
```
// wrangler.jsonc{ "limits": { "cpu_ms": 300000 } }  // 5 minutes max (default: 30 seconds)
```
```
step.sleep()
```
```
step.sleepUntil()
```
```
wrangler.jsonc
```
```
{ "limits": { "cpu_ms": 300000 } }
```
```
step.do()
```
```
step.sleep()
```
```
step.sleepUntil()
```
```
step.waitForEvent()
```
```
cloudflare:test
```
```
npm install -D vitest@latest @cloudflare/vitest-pool-workers@latest
```
```
npm install -D vitest@latest @cloudflare/vitest-pool-workers@latest
```
```
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';export default defineWorkersConfig({ test: { poolOptions: { workers: { miniflare: { bindings: { MY_WORKFLOW: { scriptName: 'workflow' } } } } } } });
```
```
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';export default defineWorkersConfig({ test: { poolOptions: { workers: { miniflare: { bindings: { MY_WORKFLOW: { scriptName: 'workflow' } } } } } } });
```
```
import { env, introspectWorkflowInstance } from 'cloudflare:test';it('should complete workflow', async () => {  const instance = await introspectWorkflowInstance(env.MY_WORKFLOW, 'test-123');  try {    await instance.modify(async (m) => {      await m.disableSleeps();  // Skip all sleeps      await m.mockStepResult({ name: 'fetch data' }, { users: [{ id: 1 }] });  // Mock step result      await m.mockEvent({ type: 'approval', payload: { approved: true } });  // Send mock event      await m.mockStepError({ name: 'call API' }, new Error('Network timeout'), 1);  // Force error once    });    await env.MY_WORKFLOW.create({ id: 'test-123' });    await expect(instance.waitForStatus('complete')).resolves.not.toThrow();  } finally {    await instance.dispose();  // Cleanup  }});
```
```
import { env, introspectWorkflowInstance } from 'cloudflare:test';it('should complete workflow', async () => {  const instance = await introspectWorkflowInstance(env.MY_WORKFLOW, 'test-123');  try {    await instance.modify(async (m) => {      await m.disableSleeps();  // Skip all sleeps      await m.mockStepResult({ name: 'fetch data' }, { users: [{ id: 1 }] });  // Mock step result      await m.mockEvent({ type: 'approval', payload: { approved: true } });  // Send mock event      await m.mockStepError({ name: 'call API' }, new Error('Network timeout'), 1);  // Force error once    });    await env.MY_WORKFLOW.create({ id: 'test-123' });    await expect(instance.waitForStatus('complete')).resolves.not.toThrow();  } finally {    await instance.dispose();  // Cleanup  }});
```
```
disableSleeps(steps?)
```
```
mockStepResult(step, result)
```
```
mockStepError(step, error, times?)
```
```
mockEvent(event)
```
```
forceStepTimeout(step, times?)
```
```
forceEventTimeout(step)
```
```
mcp__cloudflare-docs__search_cloudflare_documentation
```
```
/* ❌ I/O outside step context */async run(event, step) {  const data = await fetch('https://api.example.com') // Error!  await step.do('process', async () => {    return processData(data)  })}/* ✅ All I/O inside step.do() */async run(event, step) {  const data = await step.do('fetch', async () => {    const res = await fetch('https://api.example.com')    return res.json()  })  await step.do('process', async () => {    return processData(data)  })}
```
```
/* ❌ I/O outside step context */async run(event, step) {  const data = await fetch('https://api.example.com') // Error!  await step.do('process', async () => {    return processData(data)  })}/* ✅ All I/O inside step.do() */async run(event, step) {  const data = await step.do('fetch', async () => {    const res = await fetch('https://api.example.com')    return res.json()  })  await step.do('process', async () => {    return processData(data)  })}
```
```
/* ❌ Functions, symbols, undefined not allowed */await step.do('bad', async () => {  return {    callback: () => {}, // Error!    data: undefined,    // Error!  }})/* ✅ Return only JSON-serializable values */await step.do('good', async () => {  return {    status: 'complete',    data: null, // Use null instead of undefined  }})
```
```
/* ❌ Functions, symbols, undefined not allowed */await step.do('bad', async () => {  return {    callback: () => {}, // Error!    data: undefined,    // Error!  }})/* ✅ Return only JSON-serializable values */await step.do('good', async () => {  return {    status: 'complete',    data: null, // Use null instead of undefined  }})
```
```
/* ❌ Empty message behaves differently in dev vs prod */throw new NonRetryableError('') // Buggy!/* ✅ Always provide message */throw new NonRetryableError('Invalid credentials')throw new NonRetryableError('Validation failed: missing email')
```
```
/* ❌ Empty message behaves differently in dev vs prod */throw new NonRetryableError('') // Buggy!/* ✅ Always provide message */throw new NonRetryableError('Invalid credentials')throw new NonRetryableError('Validation failed: missing email')
```
```
/* ✅ Sleep doesn't count against 1,024 step limit */await step.sleep('wait', '1 hour')// This is free - use liberally for delays
```
```
/* ✅ Sleep doesn't count against 1,024 step limit */await step.sleep('wait', '1 hour')// This is free - use liberally for delays
```
```
/* ✅ Graceful degradation */let enrichedData = nulltry {  enrichedData = await step.do('enrich', async () => {    return await callOptionalAPI()  })} catch {  // Continue without enrichment}await step.do('process', async () => {  return process(data, enrichedData)})
```
```
/* ✅ Graceful degradation */let enrichedData = nulltry {  enrichedData = await step.do('enrich', async () => {    return await callOptionalAPI()  })} catch {  // Continue without enrichment}await step.do('process', async () => {  return process(data, enrichedData)})
```
```
step.do()
```
```
NonRetryableError('')
```
```
step.sleep()
```
The Cloudflare Workflows Agent Skill empowers developers to design and deploy durable, long-running serverless applications directly on the Cloudflare edge. This skill provides comprehensive guidance on leveraging Cloudflare's Workflow platform, from initial project scaffolding and configuration to advanced testing techniques and understanding platform capabilities. It's an indispensable tool for building resilient, event-driven systems that require state persistence across multiple asynchronous steps, offering a robust solution for complex business logic without managing traditional servers. Integrate seamlessly with your existing Cloudflare ecosystem.

# When to Use This Skill
- •Orchestrating multi-step business processes like order fulfillment, user onboarding, or complex data processing pipelines.
- •Building long-running serverless APIs that involve external integrations, human approvals, or delayed actions.
- •Implementing event-driven data transformations and aggregations at the edge, reacting to real-time events.
- •Creating automated task sequences that require state persistence, retries, and error handling across multiple steps.

# Pro Tips
- 💡Familiarize yourself with the `cloudflare:test` module's introspective and mocking capabilities (e.g., `introspectWorkflowInstance`, `mockStepResult`) for efficient local development and testing.
- 💡Always ensure your `compatibility_date` in `wrangler.jsonc` is up-to-date to access the latest Workflow features and performance improvements.
- 💡Optimize your workflow design by breaking down complex operations into smaller, manageable steps to stay within CPU time and state persistence limits, and maximize instance concurrency.

